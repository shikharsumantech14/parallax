/* ============================================================================
   PARALLAX — orbital / geodetic math for the 3D scene library.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (scenes pass THREE separately; this file
   is unit-testable math). Every formula mirrors docs/design/physics/
   {orbital-mechanics,geodesy}.md 1:1 — same symbols, same conventions. The
   sheet is the spec; this file is the implementation. If they disagree, one
   of them is a bug: fix visibly, both together.

   Acceptance anchor (orbital-mechanics.md §3): Mars at J2000 (d=0) →
   M=19.412°, E≈21.361°, ν≈23.400°, r≈1.391 AU (E,ν ±0.02°; r ±0.001 AU).
   ============================================================================ */

const DEG = Math.PI / 180;

/** J2000.0 epoch as JS ms (2000-01-01 12:00 UTC ≈ TT at our accuracy). */
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

/** Days since J2000 for a JS Date (or ms timestamp). */
export function daysSinceJ2000(t: Date | number): number {
  const ms = typeof t === 'number' ? t : t.getTime();
  return (ms - J2000_MS) / 86400000;
}

/** Keplerian element set (units per docs/design/physics/orbital-mechanics.md §1). */
export interface Elements {
  a: number;        // semi-major axis — AU (heliocentric) or km (geocentric)
  e: number;        // eccentricity
  iDeg: number;     // inclination, deg
  OmegaDeg: number; // longitude of ascending node Ω, deg
  omegaDeg: number; // argument of perihelion ω, deg
  M0Deg: number;    // mean anomaly at J2000, deg
  periodDays: number; // orbital period T, days
}

/** Kepler's equation E − e·sinE = M — Newton–Raphson, ≤8 iterations (sheet §2.2). */
export function solveKepler(M: number, e: number): number {
  let E = e > 0.8 ? Math.PI : M;
  for (let k = 0; k < 8; k++) {
    const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-8) break;
  }
  return E;
}

/**
 * Heliocentric-ecliptic position at d days after J2000 (sheet §2).
 * Returns ecliptic {x, y, z} in the elements' distance unit, plus r (radius),
 * nu (true anomaly, rad) and E (eccentric anomaly, rad) for readouts.
 * Scene mapping (Y-up): x_scene = x, y_scene = z, z_scene = −y.
 */
export function elementsToPosition(el: Elements, d: number): { x: number; y: number; z: number; r: number; nu: number; E: number } {
  const M = (((el.M0Deg + 360 * (d / el.periodDays)) % 360) + 360) % 360 * DEG;
  const E = solveKepler(M, el.e);
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + el.e) * Math.sin(E / 2),
    Math.sqrt(1 - el.e) * Math.cos(E / 2),
  );
  const r = el.a * (1 - el.e * el.e) / (1 + el.e * Math.cos(nu));

  const xp = r * Math.cos(nu);
  const yp = r * Math.sin(nu);
  const cO = Math.cos(el.OmegaDeg * DEG), sO = Math.sin(el.OmegaDeg * DEG);
  const co = Math.cos(el.omegaDeg * DEG), so = Math.sin(el.omegaDeg * DEG);
  const ci = Math.cos(el.iDeg * DEG), si = Math.sin(el.iDeg * DEG);

  const x = xp * (co * cO - so * sO * ci) - yp * (so * cO + co * sO * ci);
  const y = xp * (co * sO + so * cO * ci) - yp * (so * sO - co * cO * ci);
  const z = xp * (so * si) + yp * (co * si);
  return { x, y, z, r, nu, E };
}

/** The 8 planets — JPL approximate mean elements, J2000 (sheet §3, derived
    columns precomputed: ω = ϖ−Ω, M0 = L0−ϖ). Editorial accuracy: ~1° over
    ±50 yr. `solar-system` ships these as defaults; issue data may extend. */
export const PLANETS: Record<string, Elements> = {
  mercury: { a: 0.38710, e: 0.20563, iDeg: 7.005, OmegaDeg: 48.331, omegaDeg: 29.125, M0Deg: 174.795, periodDays: 87.969 },
  venus:   { a: 0.72333, e: 0.00677, iDeg: 3.395, OmegaDeg: 76.680, omegaDeg: 54.853, M0Deg: 50.447,  periodDays: 224.701 },
  earth:   { a: 1.00000, e: 0.01671, iDeg: 0.000, OmegaDeg: 0.000,  omegaDeg: 102.947, M0Deg: 357.517, periodDays: 365.256 },
  mars:    { a: 1.52368, e: 0.09340, iDeg: 1.850, OmegaDeg: 49.558, omegaDeg: 286.483, M0Deg: 19.412,  periodDays: 686.980 },
  jupiter: { a: 5.20260, e: 0.04849, iDeg: 1.303, OmegaDeg: 100.464, omegaDeg: 273.867, M0Deg: 20.066, periodDays: 4332.59 },
  saturn:  { a: 9.55491, e: 0.05551, iDeg: 2.489, OmegaDeg: 113.666, omegaDeg: 339.391, M0Deg: 316.897, periodDays: 10759.2 },
  uranus:  { a: 19.21845, e: 0.04630, iDeg: 0.773, OmegaDeg: 74.006, omegaDeg: 98.999, M0Deg: 140.233, periodDays: 30688.5 },
  neptune: { a: 30.11039, e: 0.00899, iDeg: 1.770, OmegaDeg: 131.784, omegaDeg: 276.340, M0Deg: 256.996, periodDays: 60182 },
};

/** Log-compressed radial display scale (sheet §4): 0→0, 1 AU→k, 30 AU→~2.47k.
    Any scene using it MUST render the `distances log-compressed` caption chip. */
export function logRadius(rAU: number, k = 1): number {
  return k * Math.log10(1 + 9 * Math.max(0, rAU));
}

/** Circular-orbit period around Earth (sheet §5): T seconds for altitude km. */
export const MU_EARTH = 398600; // km³/s²
export const R_EARTH = 6371;    // km
export function circularPeriodSec(altKm: number, mu = MU_EARTH, bodyRadiusKm = R_EARTH): number {
  const a = bodyRadiusKm + altKm;
  return 2 * Math.PI * Math.sqrt((a * a * a) / mu);
}

/** Hohmann transfer between circular coplanar radii (sheet §6). Same distance
    unit as mu (e.g. km + km³/s² → km/s). */
export function hohmannDv(r1: number, r2: number, mu: number): { dv1: number; dv2: number; tTransferSec: number } {
  const dv1 = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
  const dv2 = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
  const tTransferSec = Math.PI * Math.sqrt(Math.pow(r1 + r2, 3) / (8 * mu));
  return { dv1, dv2, tTransferSec };
}

/** Subsolar point for a date (geodesy.md §3; ±1° editorial accuracy).
    Includes the equation-of-time correction. */
export function subsolarPoint(t: Date | number): { lat: number; lon: number } {
  const date = typeof t === 'number' ? new Date(t) : t;
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 1);
  const N = Math.floor((date.getTime() - startOfYear) / 86400000) + 1;
  const frac = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lat = 23.44 * Math.sin((2 * Math.PI * (N - 80)) / 365.24);
  const B = (2 * Math.PI * (N - 81)) / 364;
  const eotMin = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  // geodesy.md §3: λ_ss = −15·(H − 12) + EoT_min/4 (the EoT term is ADDED in
  // degrees, not distributed inside the −15 factor — that would flip its sign).
  // Acceptance anchor: 2026-06-21T12:00Z → λ_ss = −0.375° (EoT = −1.50 min).
  const lon = -15 * (frac - 12) + eotMin / 4;
  return { lat, lon: ((lon + 540) % 360) - 180 };
}

/** Great-circle points between two lat/lon (deg) — slerp, geodesy.md §2.
    Returns n+1 {lat, lon} points inclusive. Pure math (no THREE). */
export function greatCircle(a: { lat: number; lon: number }, b: { lat: number; lon: number }, n = 64): { lat: number; lon: number }[] {
  const toVec = (p: { lat: number; lon: number }) => {
    const phi = p.lat * DEG, lam = p.lon * DEG;
    return [Math.cos(phi) * Math.cos(lam), Math.cos(phi) * Math.sin(lam), Math.sin(phi)];
  };
  const va = toVec(a), vb = toVec(b);
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const om = Math.acos(dot);
  const out: { lat: number; lon: number }[] = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    let v: number[];
    if (om < 1e-6) v = va;
    else {
      const s1 = Math.sin((1 - t) * om) / Math.sin(om);
      const s2 = Math.sin(t * om) / Math.sin(om);
      v = [va[0] * s1 + vb[0] * s2, va[1] * s1 + vb[1] * s2, va[2] * s1 + vb[2] * s2];
    }
    out.push({ lat: Math.asin(Math.max(-1, Math.min(1, v[2]))) / DEG, lon: Math.atan2(v[1], v[0]) / DEG });
  }
  return out;
}
