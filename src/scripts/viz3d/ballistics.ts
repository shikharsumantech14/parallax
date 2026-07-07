/* ============================================================================
   PARALLAX — ballistic flight math for the 3D scene library.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (the `flight-of-the-ball` scene passes
   THREE separately; this file is unit-testable math). Every formula mirrors
   docs/design/physics/mechanics-and-flow.md §1 1:1 — same symbols, same
   conventions. The physics sheet is the spec; this file is the implementation.
   If they disagree, one of them is a bug: fix visibly, both together.

   ONE source of truth: FlightOfTheBall.astro calls integrate() at BUILD TIME
   to draw the static fallback SVG, and flightOfTheBall.ts calls the same
   integrate() at RUNTIME to draw + fly the WebGL polyline. The flown arc and
   the printed arc are byte-identical sample arrays (no drift).

   Acceptance anchors (mechanics-and-flow.md §1 + blueprint §4):
   - Sanity: 30 m free kick, v0=25 m/s, spinRevPerS=8, sidespin, el≈10° →
     lateral deviation ≈ 2–3 m vs the ghost at the goal line.
   - Example (Roberto Carlos vs France, 1997 — recomputed): v0=38, spin 10,
     el 10°, az −16°, from (30, 4.5) → real crosses the goal line at
     z ≈ 2.16 m, y ≈ 1.13 m; ghost at z ≈ −4.10 m; swerve ≈ 6.26 m;
     flight ≈ 1.00 s. (RK4, dt = 1/240 s.)
   ============================================================================ */

const DEG = Math.PI / 180;
const G = 9.81; // m/s² gravitational acceleration (−Y)

/** Aerodynamic constants per sport (blueprint §4 / physics-sheet §1). */
export interface BallConsts {
  m: number;   // mass, kg
  r: number;   // radius, m
  A: number;   // cross-sectional area π r², m²
  Cd: number;  // drag coefficient (post-critical)
  rho: number; // air density, kg/m³
}

export type Sport = 'football' | 'basketball' | 'cricket';

/** Constant blocks keyed by sport. ρ = 1.225 kg/m³ for all (sea-level air). */
export const SPORT_CONSTS: Record<Sport, BallConsts> = {
  football:   { m: 0.43, r: 0.11,  A: Math.PI * 0.11 * 0.11,   Cd: 0.25, rho: 1.225 },
  basketball: { m: 0.62, r: 0.12,  A: Math.PI * 0.12 * 0.12,   Cd: 0.47, rho: 1.225 },
  // cricket: seam/swing effects are NOT modelled — the component emits the
  // `swing not modeled` honesty chip (blueprint §3 / physics-sheet §1).
  cricket:    { m: 0.16, r: 0.036, A: Math.PI * 0.036 * 0.036, Cd: 0.25, rho: 1.225 },
};

/** Default goal-mouth (center x, width, height, z) per sport, SI metres. */
export const SPORT_GOAL: Record<Sport, { x_m: number; width_m: number; height_m: number; z_m: number }> = {
  football:   { x_m: 0, width_m: 7.32, height_m: 2.44, z_m: 0 },
  basketball: { x_m: 0, width_m: 0.45, height_m: 3.05, z_m: 0 }, // rim ø + height
  cricket:    { x_m: 0, width_m: 0.22, height_m: 0.71, z_m: 0 }, // stumps span + bail height
};

/** One integrated point of the flight. */
export interface Sample {
  x: number; y: number; z: number; // pitch-frame metres (Y up)
  t: number;      // seconds since launch
  speed: number;  // |v|, m/s (drives the marker deceleration + readout)
}

/** The launch parameters the integrator needs (a subset of the data schema). */
export interface ShotInput {
  v0: number;                 // launch speed — SI m/s (converted before this call)
  elevationDeg: number;       // launch angle above the pitch plane
  azimuthDeg: number;         // launch heading in the pitch plane
  spinRevPerS: number;        // |ω|/2π, rev/s (≥ 0; 0 = knuckle, Magnus≈0)
  spinAxis: [number, number, number]; // spin axis in the pitch frame (auto-normalised)
  from: [number, number];     // launch point [x_m, z_m]
}

/** Convert a launch speed to SI m/s. km/h → ÷3.6. */
export function toMetersPerSec(v0: number, unit?: 'm/s' | 'km/h'): number {
  return unit === 'km/h' ? v0 / 3.6 : v0;
}

/** Launch velocity vector (m/s) in the pitch frame — blueprint §4.
    az=0 sends the ball straight at goal-center down decreasing x (goalward);
    +az curls toward +z. v_x is negative so flight always goes goalward. */
function launchVelocity(shot: ShotInput): { x: number; y: number; z: number } {
  const el = shot.elevationDeg * DEG;
  const az = shot.azimuthDeg * DEG;
  const s = shot.v0;
  return {
    x: -s * Math.cos(el) * Math.cos(az),
    y: s * Math.sin(el),
    z: s * Math.cos(el) * Math.sin(az),
  };
}

/** Per-unit-mass acceleration at state (v) for spin ω — gravity + drag + Magnus.
    physics-sheet §1:
      F_drag   = −½ρ·C_d·A·|v|·v
      F_magnus =  ½ρ·C_L·A·|v|²·(ω̂ × v̂),  C_L = S/(2.2S+0.4), S = r|ω|/|v| (0–0.35)
    All divided by m to give acceleration. */
function accel(
  v: { x: number; y: number; z: number },
  omegaMag: number,
  wHat: { x: number; y: number; z: number },
  c: BallConsts,
): { x: number; y: number; z: number } {
  const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  const a = { x: 0, y: -G, z: 0 };
  if (speed < 1e-6) return a;

  // drag: −½ρ C_d A |v| v / m  (opposes velocity)
  const kd = (0.5 * c.rho * c.Cd * c.A * speed) / c.m;
  a.x -= kd * v.x;
  a.y -= kd * v.y;
  a.z -= kd * v.z;

  // Magnus: needs spin. spin ratio S clamped 0–0.35 → lift coefficient C_L.
  if (omegaMag > 1e-9) {
    const S = Math.min(0.35, (c.r * omegaMag) / speed);
    const CL = S / (2.2 * S + 0.4);
    const inv = 1 / speed;
    const vhx = v.x * inv, vhy = v.y * inv, vhz = v.z * inv;
    // ω̂ × v̂
    const cx = wHat.y * vhz - wHat.z * vhy;
    const cy = wHat.z * vhx - wHat.x * vhz;
    const cz = wHat.x * vhy - wHat.y * vhx;
    const km = (0.5 * c.rho * CL * c.A * speed * speed) / c.m;
    a.x += km * cx;
    a.y += km * cy;
    a.z += km * cz;
  }
  return a;
}

const DT = 1 / 240;         // fixed RK4 step (physics-sheet §1)
const MAX_T = 6;            // safety stop, seconds
const SAMPLE_EVERY = 2;     // record a point every 2 substeps → ~100–200 samples

/**
 * RK4-integrate a struck ball over the chalk pitch (blueprint §4).
 * Integrate until EITHER y < 0 (ground) after t > 0.05 s, OR x ≤ goalX
 * (crossed the goal line), OR t > 6 s (safety). Returns the polyline of
 * {x,y,z,t,speed} samples — the SAME array the scene flies and the fallback
 * draws. `noAir: true` zeroes drag AND spin (the pure-gravity ghost path).
 */
export function integrate(shot: ShotInput, c: BallConsts, goalX: number, noAir = false): Sample[] {
  const cc: BallConsts = noAir ? { ...c, Cd: 0 } : c;
  const omegaMag = noAir ? 0 : 2 * Math.PI * shot.spinRevPerS;
  const ax = shot.spinAxis && shot.spinAxis.length === 3 ? shot.spinAxis : [0, 1, 0];
  const an = Math.hypot(ax[0], ax[1], ax[2]) || 1;
  const wHat = { x: ax[0] / an, y: ax[1] / an, z: ax[2] / an };

  let v = launchVelocity(shot);
  let r = { x: shot.from[0], y: c.r, z: shot.from[1] }; // starts one radius off the turf
  const speed0 = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  const out: Sample[] = [{ x: r.x, y: r.y, z: r.z, t: 0, speed: speed0 }];

  let t = 0;
  const maxSteps = Math.ceil(MAX_T / DT);
  for (let i = 0; i < maxSteps; i++) {
    // RK4 on the coupled (r, v) system. r' = v, v' = accel(v).
    const a1 = accel(v, omegaMag, wHat, cc);
    const v2 = { x: v.x + 0.5 * DT * a1.x, y: v.y + 0.5 * DT * a1.y, z: v.z + 0.5 * DT * a1.z };
    const a2 = accel(v2, omegaMag, wHat, cc);
    const v3 = { x: v.x + 0.5 * DT * a2.x, y: v.y + 0.5 * DT * a2.y, z: v.z + 0.5 * DT * a2.z };
    const a3 = accel(v3, omegaMag, wHat, cc);
    const v4 = { x: v.x + DT * a3.x, y: v.y + DT * a3.y, z: v.z + DT * a3.z };
    const a4 = accel(v4, omegaMag, wHat, cc);

    const px = r.x, py = r.y, pz = r.z;
    r = {
      x: r.x + (DT / 6) * (v.x + 2 * v2.x + 2 * v3.x + v4.x),
      y: r.y + (DT / 6) * (v.y + 2 * v2.y + 2 * v3.y + v4.y),
      z: r.z + (DT / 6) * (v.z + 2 * v2.z + 2 * v3.z + v4.z),
    };
    v = {
      x: v.x + (DT / 6) * (a1.x + 2 * a2.x + 2 * a3.x + a4.x),
      y: v.y + (DT / 6) * (a1.y + 2 * a2.y + 2 * a3.y + a4.y),
      z: v.z + (DT / 6) * (a1.z + 2 * a2.z + 2 * a3.z + a4.z),
    };
    t += DT;
    const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

    // crossed the goal line: interpolate the exact crossing and stop.
    if (r.x <= goalX && px > goalX) {
      const f = (px - goalX) / (px - r.x);
      out.push({
        x: goalX,
        y: py + f * (r.y - py),
        z: pz + f * (r.z - pz),
        t,
        speed,
      });
      return out;
    }
    // hit the turf after clearing the launch instant.
    if (t > 0.05 && r.y < 0) {
      const f = py > r.y ? py / (py - r.y) : 0;
      out.push({ x: px + f * (r.x - px), y: 0, z: pz + f * (r.z - pz), t, speed });
      return out;
    }
    if (i % SAMPLE_EVERY === SAMPLE_EVERY - 1) out.push({ x: r.x, y: r.y, z: r.z, t, speed });
    if (t > MAX_T) return out;
  }
  return out;
}

/** Lateral gap (metres) between the real and ghost crossings — the swerve. */
export function swerveMeters(real: Sample[], ghost: Sample[]): number {
  const rc = real[real.length - 1];
  const gc = ghost[ghost.length - 1];
  return rc.z - gc.z;
}

/** Peak height (metres) reached along a flight. */
export function apexMeters(samples: Sample[]): number {
  let y = 0;
  for (const s of samples) if (s.y > y) y = s.y;
  return y;
}

/** Resolve the full flight for a shot: real path, ghost path, and the derived
    read-out numbers. ONE call both sites use (build-time fallback + scene). */
export interface Flight {
  real: Sample[];
  ghost: Sample[];
  swerve: number;     // metres, real − ghost at the goal line
  flightTime: number; // seconds, last real sample t
  apex: number;       // metres, peak height of the real path
}

export function solveFlight(shot: ShotInput, sport: Sport, goalX: number): Flight {
  const c = SPORT_CONSTS[sport] ?? SPORT_CONSTS.football;
  const real = integrate(shot, c, goalX, false);
  const ghost = integrate(shot, c, goalX, true);
  return {
    real,
    ghost,
    swerve: swerveMeters(real, ghost),
    flightTime: real[real.length - 1].t,
    apex: apexMeters(real),
  };
}
