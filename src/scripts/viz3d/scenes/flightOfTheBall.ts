/* ============================================================================
   PARALLAX — `flight-of-the-ball` scene (sports · FLAGSHIP + world hero).
   Blueprint: docs/design/blueprints/sports/flight-of-the-ball.md — this file
   implements it 1:1; the blueprint is the contract. Math: ballistics.ts only.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).

   One struck ball, rebuilt from its physics: drag + Magnus bend a real launch
   over a chalk-lined pitch to the goal (RK4 in ballistics.ts). A dashed ghost
   "no-air" path shows how much the air did. The ball flies the arc once on
   boot and re-flies on REPLAY (the `data-viz3d-state="replay"` chip bridge in
   runtime.ts, the same path chamber uses for its state chips).
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import {
  SPORT_CONSTS, SPORT_GOAL, toMetersPerSec, integrate, swerveMeters, apexMeters,
  type Sport, type Sample, type ShotInput,
} from '../ballistics';
import { makeOrbitControls, makePicker, makeTooltip, glowSprite } from '../helpers';
import { makeLabels } from './globe';

const SCENE = 1 / 12; // 1 scene unit = 12 m (blueprint §4 scene mapping)

const smoothstep = (t: number) => {
  const s = Math.max(0, Math.min(1, t));
  return s * s * (3 - 2 * s);
};

/** Sample the polyline at flight-time `tSec` (linear in t, so the marker
    visibly decelerates as drag bites — its speed = the sample's real speed). */
function sampleAtTime(path: Sample[], tSec: number): { x: number; y: number; z: number } {
  const last = path[path.length - 1];
  if (tSec >= last.t) return last;
  // binary-ish linear scan (paths are ~100–200 pts, cheap)
  for (let i = 1; i < path.length; i++) {
    if (path[i].t >= tSec) {
      const a = path[i - 1], b = path[i];
      const span = b.t - a.t;
      const f = span > 1e-9 ? (tSec - a.t) / span : 0;
      return { x: a.x + f * (b.x - a.x), y: a.y + f * (b.y - a.y), z: a.z + f * (b.z - a.z) };
    }
  }
  return last;
}

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const ink = new THREE.Color(colors.ink);
  const accent = new THREE.Color(colors.accent);
  const safeColor = (raw: string | undefined, fallback: any) =>
    raw && /^(#|rgb|hsl)/.test(raw.trim()) ? new THREE.Color(raw.trim()) : fallback.clone();
  const accentDeep = safeColor(getComputedStyle(mount).getPropertyValue('--accent-deep'), accent);

  const disposables: any[] = [];

  /* ── data (blueprint §3, with degradation defaults) ── */
  const sport: Sport = (['football', 'basketball', 'cricket'] as const).includes(data.sport)
    ? data.sport : 'football';
  const consts = SPORT_CONSTS[sport];
  const s = data.shot || {};
  const shot: ShotInput = {
    v0: toMetersPerSec(typeof s.v0 === 'number' ? s.v0 : 30, s.speedUnit),
    elevationDeg: typeof s.elevationDeg === 'number' ? s.elevationDeg : 12,
    azimuthDeg: typeof s.azimuthDeg === 'number' ? s.azimuthDeg : 0,
    spinRevPerS: typeof s.spinRevPerS === 'number' ? Math.max(0, s.spinRevPerS) : 0,
    spinAxis: Array.isArray(s.spinAxis) && s.spinAxis.length === 3 ? s.spinAxis : [0, 1, 0],
    from: Array.isArray(s.from) && s.from.length === 2 ? s.from : [30, 0],
  };
  const label: string = typeof s.label === 'string' ? s.label : 'the shot';
  const note: string | undefined = typeof s.note === 'string' ? s.note : undefined;
  const speedUnit: string = s.speedUnit === 'km/h' ? 'km/h' : 'm/s';
  const v0Display: number = typeof s.v0 === 'number' ? s.v0 : 30;
  const spinDisplay: number = shot.spinRevPerS;

  const goalDef = data.goal && typeof data.goal === 'object' ? data.goal : {};
  const goal = {
    x_m: typeof goalDef.x_m === 'number' ? goalDef.x_m : SPORT_GOAL[sport].x_m,
    width_m: typeof goalDef.width_m === 'number' ? goalDef.width_m : SPORT_GOAL[sport].width_m,
    height_m: typeof goalDef.height_m === 'number' ? goalDef.height_m : SPORT_GOAL[sport].height_m,
    z_m: typeof goalDef.z_m === 'number' ? goalDef.z_m : SPORT_GOAL[sport].z_m,
  };
  const showGhost: boolean = data.showGhost !== false;
  const slowmo: number = typeof data.slowmo === 'number' && data.slowmo > 0 ? data.slowmo : 3;

  /* ── integrate (the SAME call the fallback made at build time) ── */
  const real = integrate(shot, consts, goal.x_m, false);
  const ghost = integrate(shot, consts, goal.x_m, true);
  const swerve = swerveMeters(real, ghost);
  const flightTime = real[real.length - 1].t;
  const apex = apexMeters(real);

  /* ── scene mapping: pitch metres → scene units, centered on the arc ── */
  const X_OFF = ((goal.x_m + shot.from[0]) / 2) * SCENE;
  const P = (x: number, y: number, z: number, out: any) =>
    out.set(x * SCENE - X_OFF, y * SCENE, z * SCENE);
  const tmp = new THREE.Vector3();
  const toScene = (smp: { x: number; y: number; z: number }) => P(smp.x, smp.y, smp.z, new THREE.Vector3());

  /* ── the chalk pitch (blueprint §4 — the world's grid) ── */
  const chalkGroups: { mat: any; target: number }[] = []; // for staggered sweep-in
  const addChalk = (segments: number[][][], opacity: number) => {
    const pos: number[] = [];
    for (const seg of segments) {
      for (let i = 0; i < seg.length - 1; i++) {
        P(seg[i][0], 0, seg[i][1], tmp); pos.push(tmp.x, tmp.y, tmp.z);
        P(seg[i + 1][0], 0, seg[i + 1][1], tmp); pos.push(tmp.x, tmp.y, tmp.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
    const ls = new THREE.LineSegments(g, m);
    group.add(ls);
    disposables.push(g, m);
    chalkGroups.push({ mat: m, target: opacity });
    return ls;
  };
  // FIFA markings (real dimensions), z centered on 0, width 68 m, up to from+6 m.
  const backX = shot.from[0] + 6;
  const HW = 34; // half-width
  const arcPts = (cx: number, radius: number, a0: number, a1: number, n = 40) => {
    const pts: number[][] = [];
    for (let k = 0; k <= n; k++) {
      const a = a0 + (a1 - a0) * (k / n);
      pts.push([cx + radius * Math.cos(a), radius * Math.sin(a)]);
    }
    return pts;
  };
  // 1) goal line + touchline hint (drawn first)
  addChalk([
    [[goal.x_m, -HW], [goal.x_m, HW]],                 // goal line
    [[goal.x_m, -HW], [backX, -HW]], [[goal.x_m, HW], [backX, HW]], // touchlines
    [[backX, -HW], [backX, HW]],                       // far edge (center-ward hint)
  ], 0.35);
  // 2) penalty box (16.5 m deep, 40.32 m wide) + 6-yard box (5.5 m / 18.32 m)
  addChalk([
    [[16.5, -20.16], [16.5, 20.16]], [[goal.x_m, -20.16], [16.5, -20.16]], [[goal.x_m, 20.16], [16.5, 20.16]],
    [[5.5, -9.16], [5.5, 9.16]], [[goal.x_m, -9.16], [5.5, -9.16]], [[goal.x_m, 9.16], [5.5, 9.16]],
  ], 0.35);
  // 3) penalty arc (9.15 m radius from the penalty spot at 11 m), spot
  addChalk([arcPts(11, 9.15, Math.PI - 1.05, Math.PI + 1.05)], 0.35);
  addChalk([[[11, -0.15], [11, 0.15]], [[10.85, 0], [11.15, 0]]], 0.35);

  /* ── goal frame: posts + crossbar (ink @ 0.9) + faint net grid (ink @ 0.12) ── */
  const goalGroup = new THREE.Group();
  goalGroup.scale.setScalar(0.0001); // settle-in
  group.add(goalGroup);
  {
    const hw = goal.width_m / 2;
    const h = goal.height_m;
    const fpos: number[] = [];
    const seg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
      P(ax, ay, az, tmp); fpos.push(tmp.x, tmp.y, tmp.z);
      P(bx, by, bz, tmp); fpos.push(tmp.x, tmp.y, tmp.z);
    };
    seg(goal.x_m, 0, goal.z_m - hw, goal.x_m, h, goal.z_m - hw); // left post
    seg(goal.x_m, 0, goal.z_m + hw, goal.x_m, h, goal.z_m + hw); // right post
    seg(goal.x_m, h, goal.z_m - hw, goal.x_m, h, goal.z_m + hw); // crossbar
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fpos, 3));
    const fm = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.9 });
    goalGroup.add(new THREE.LineSegments(fg, fm));
    disposables.push(fg, fm);
    // net hint: 6×4 grid on the goal plane
    const npos: number[] = [];
    for (let c = 0; c <= 6; c++) {
      const z = goal.z_m - hw + (goal.width_m * c) / 6;
      P(goal.x_m, 0, z, tmp); npos.push(tmp.x, tmp.y, tmp.z);
      P(goal.x_m, h, z, tmp); npos.push(tmp.x, tmp.y, tmp.z);
    }
    for (let rr = 0; rr <= 4; rr++) {
      const y = (h * rr) / 4;
      P(goal.x_m, y, goal.z_m - hw, tmp); npos.push(tmp.x, tmp.y, tmp.z);
      P(goal.x_m, y, goal.z_m + hw, tmp); npos.push(tmp.x, tmp.y, tmp.z);
    }
    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', new THREE.Float32BufferAttribute(npos, 3));
    const nm = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.12 });
    goalGroup.add(new THREE.LineSegments(ng, nm));
    disposables.push(ng, nm);
  }

  /* ── ghost dashed "no-air" path (ink @ 0.22, dashed) ── */
  let ghostMat: any = null;
  if (showGhost) {
    const gpts = ghost.map((smp) => toScene(smp));
    const gg = new THREE.BufferGeometry().setFromPoints(gpts);
    ghostMat = new THREE.LineDashedMaterial({
      color: ink, transparent: true, opacity: 0, dashSize: 0.03, gapSize: 0.03,
    });
    const gline = new THREE.Line(gg, ghostMat);
    gline.computeLineDistances();
    group.add(gline);
    disposables.push(gg, ghostMat);
  }

  /* ── real trajectory polyline (accent volt @ 0.9), sweep-drawn on boot ── */
  const realPts = real.map((smp) => toScene(smp));
  const realGeo = new THREE.BufferGeometry().setFromPoints(realPts);
  const realMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 });
  const realLine = new THREE.Line(realGeo, realMat);
  realGeo.setDrawRange(0, 1); // grows to full during the sweep
  group.add(realLine);
  disposables.push(realGeo, realMat);

  /* ── impact ring at the real crossing (accent @ 1.0 torus on the goal plane) ── */
  const impact = toScene(real[real.length - 1]);
  const ringGeo = new THREE.TorusGeometry(0.05, 0.008, 8, 28);
  const ringMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 1 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(impact);
  ring.rotation.y = Math.PI / 2; // face down the pitch (goal plane is the y-z plane)
  ring.scale.setScalar(0.0001);  // stamps in LAST
  group.add(ring);
  disposables.push(ringGeo, ringMat);

  /* ── the ball: white sphere + volt glow + a short fading trail ── */
  const ballGeo = new THREE.SphereGeometry(0.06, 16, 12);
  const ballMat = new THREE.MeshBasicMaterial({ color: ink });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  const ballGlow = glowSprite(THREE, colors.accent, 0.22);
  ball.add(ballGlow);
  group.add(ball);
  disposables.push(ballGeo, ballMat, ...(ballGlow.userData.disposables || []));
  // picking proxy (floored radius so the 44px tap target holds at 375px)
  const hitGeo = new THREE.SphereGeometry(0.09, 8, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const ballHit = new THREE.Mesh(hitGeo, hitMat);
  group.add(ballHit);
  disposables.push(hitGeo, hitMat);
  // trail (last 12 samples, accent 0.6→0)
  const TRAIL = 12;
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(TRAIL * 3), 3));
  const trailMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.6 });
  const trail = new THREE.Line(trailGeo, trailMat);
  group.add(trail);
  disposables.push(trailGeo, trailMat);

  /* ── labels: the swerve verdict at the goal line (priority 2) ── */
  const labels = makeLabels(THREE, mount);
  const swerveLabelPos = new THREE.Vector3().copy(impact).add(new THREE.Vector3(0, 0.14, 0));
  labels.add(`swerve ${Math.abs(swerve).toFixed(1)} m`, swerveLabelPos, 'data', 2);

  /* ── controls / picking / tooltip ── */
  const is375 = mount.clientWidth > 0 && mount.clientWidth < 480;
  const controls = makeOrbitControls(canvas, {
    startPitch: 0.42, minZoom: 0.7, maxZoom: 2.8, autoRotate: false,
  });
  controls.s.zoom = is375 ? 0.82 : 1;
  const tooltip = makeTooltip(mount);
  const fmtV0 = Number.isInteger(v0Display) ? String(v0Display) : v0Display.toFixed(1);
  const tipHtml =
    `<b>${label}</b><br>${fmtV0} ${speedUnit} · ${spinDisplay} rev/s spin<br>` +
    `swerve ${Math.abs(swerve).toFixed(1)} m · flight ${flightTime.toFixed(1)}s` +
    (note ? `<br>${note}` : '');
  let hovering = false;
  const picker = makePicker(THREE, camera, canvas, [ballHit], (obj, _inst, x, y) => {
    hovering = !!obj;
    if (!obj) { tooltip.hide(); return; }
    tooltip.show(tipHtml, x, y);
  });

  /* ── replay state (blueprint §8 — the ONE control, via the chip bridge) ── */
  // The flight is a one-shot playback: plays once on boot, re-plays on REPLAY.
  let flightStart = -1;    // tMs when the current flight began (-1 = resting)
  let flightDone = false;  // boot flight has run at least once
  let pendingReplay = false;
  const startFlight = (tMs: number) => { flightStart = tMs; flightDone = true; };
  const setState = (name: string) => { if (name === 'replay') pendingReplay = true; };

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;
  const BOOT_SWEEP = 700;   // chalk sweep window
  const REAL_SWEEP_AT = 900; // ms after boot the real path starts drawing
  const REAL_SWEEP_DUR = 900;
  const flightDurMs = flightTime * 1000 * slowmo;
  const tmpBall = new THREE.Vector3();
  const trailArr = trailGeo.getAttribute('position').array as Float32Array;

  return {
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    frame(tMs: number) {
      if (bootMs < 0) bootMs = tMs;
      const dt = lastT ? Math.min(64, tMs - lastT) : 16;
      lastT = tMs;
      const since = tMs - bootMs;
      const k = Math.min(1, (8 * dt) / 1000); // settle constant (physics §6)

      controls.tick(dt);
      // idle sway when not dragging and not replaying (broadcast subtle drift)
      const replaying = flightStart >= 0;
      const sway = controls.s.dragging || replaying ? 0 : 0.05 * Math.sin(tMs / 8000);
      group.rotation.y = controls.s.yaw + sway;
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(2.2 * z, 1.6 * z, 4.6 * z);
      camera.lookAt(0, 0.4, 0);

      /* boot sequence (blueprint §5):
         1. chalk lines sweep in (40 ms per-marking stagger)
         2. goal frame settles (scale 0→1, 350 ms)
         3. ghost reveals (opacity 0→0.22, 300 ms)
         4. real trajectory sweep-draws (900 ms) — ball rides the draw head
         5. impact ring + swerve label stamp LAST */
      chalkGroups.forEach((c, i) => {
        const s2 = smoothstep((since - i * 40) / BOOT_SWEEP);
        c.mat.opacity = c.target * s2;
      });
      const gs = smoothstep((since - 200) / 350);
      goalGroup.scale.setScalar(Math.max(0.0001, gs));

      // real path sweep + ball riding the head, then the one-shot flight.
      const total = realPts.length;
      let ballT: number; // flight-time (s) the ball sits at
      if (since < REAL_SWEEP_AT) {
        realGeo.setDrawRange(0, 1);
        ballT = 0;
      } else if (since < REAL_SWEEP_AT + REAL_SWEEP_DUR) {
        const f = (since - REAL_SWEEP_AT) / REAL_SWEEP_DUR;
        const n = Math.max(2, Math.round(f * total));
        realGeo.setDrawRange(0, n);
        ballT = f * flightTime;
      } else {
        realGeo.setDrawRange(0, total);
        // kick off the boot flight once the sweep finishes; REPLAY restarts it.
        if (!flightDone && flightStart < 0) startFlight(tMs);
        if (pendingReplay) { startFlight(tMs); pendingReplay = false; }
        if (flightStart >= 0) {
          const e = tMs - flightStart;
          if (e >= flightDurMs) { ballT = flightTime; flightStart = -1; } // rest on the ring
          else ballT = (e / flightDurMs) * flightTime;
        } else {
          ballT = flightTime; // resting on the impact ring
        }
      }

      // place the ball at ballT
      const bp = sampleAtTime(real, ballT);
      P(bp.x, bp.y, bp.z, tmpBall);
      const lift = hovering && !replaying ? 0.03 : 0; // hoverLift
      ball.position.set(tmpBall.x, tmpBall.y + lift, tmpBall.z);
      ballHit.position.copy(ball.position);

      // ghost dashed path: reveal 0→0.22 (opacity 0→0.22, 300 ms after 500 ms),
      // then dims to 0.12 on hover (blueprint §5 hoverLift). One write per frame.
      if (ghostMat) {
        const reveal = smoothstep((since - 500) / 300);
        const gTarget = hovering ? 0.12 : 0.22 * reveal;
        ghostMat.opacity += (gTarget - ghostMat.opacity) * k;
      }

      // trail: last TRAIL samples behind the ball's current flight-time
      for (let i = 0; i < TRAIL; i++) {
        const tt = Math.max(0, ballT - (TRAIL - 1 - i) * (flightTime / 60));
        const q = sampleAtTime(real, tt);
        P(q.x, q.y, q.z, tmp);
        trailArr[i * 3] = tmp.x; trailArr[i * 3 + 1] = tmp.y; trailArr[i * 3 + 2] = tmp.z;
      }
      trailGeo.getAttribute('position').needsUpdate = true;
      trailMat.opacity = replaying ? 0.6 : 0;

      // impact ring + stamp (after the sweep)
      const rs = smoothstep((since - (REAL_SWEEP_AT + REAL_SWEEP_DUR)) / 220);
      ring.scale.setScalar(Math.max(0.0001, rs));

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    setState,
    dispose() {
      controls.dispose();
      picker.dispose();
      tooltip.dispose();
      labels.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
