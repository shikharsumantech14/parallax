/* ============================================================================
   PARALLAX — terminator / day-night helpers for `terminator-globe` (travel).
   ----------------------------------------------------------------------------
   PURE functions, NO three.js import (the scene passes THREE separately; the
   component calls these at build time for the fallback). Every derived formula
   mirrors docs/design/physics/geodesy.md §3 and the blueprint
   docs/design/blueprints/travel/terminator-globe.md §4/§8 1:1, so the live
   WebGL scene and the static SVG fallback compute the SAME geometry from the
   SAME source of truth (subsolarPoint() in kepler.ts).

   Acceptance anchors (blueprint §11):
   - subsolarPoint("2026-06-21T12:00:00Z") → δ ≈ +23.438°, λ_ss ≈ −0.375°.
   - DEL(28.5562,77.10)→SFO(37.6213,−122.379): Δ = 111.35°, d ≈ 12,382 km.
   - Delhi at the 02:30Z departure instant reads "in daylight" (82° from the
     subsolar point, inside the 90° day cap); SFO reads "in darkness" (104.8°).
   ============================================================================ */
import { subsolarPoint } from './kepler';

const DEG = Math.PI / 180;
const R_EARTH_KM = 6371; // geodesy.md §1

/** Terminator ring: the great circle 90° from the subsolar point, sampled at
 *  `n` bearings. Standard pole-circle with the polar distance c = 90° (so the
 *  cos c term drops), per blueprint §4:
 *    lat_t = asin(cos φ_s · cos b)
 *    lon_t = λ_s + atan2(sin b, −sin φ_s · cos b)
 *  Returns n points (0…360° exclusive of the duplicate 360°) as {lat, lon}. */
export function terminatorRing(sub: { lat: number; lon: number }, n = 128): { lat: number; lon: number }[] {
  const phiS = sub.lat * DEG;
  const cosPhi = Math.cos(phiS);
  const sinPhi = Math.sin(phiS);
  const out: { lat: number; lon: number }[] = [];
  for (let k = 0; k < n; k++) {
    const b = (k / n) * 2 * Math.PI;
    const latT = Math.asin(Math.max(-1, Math.min(1, cosPhi * Math.cos(b)))) / DEG;
    const lonT = sub.lon + Math.atan2(Math.sin(b), -sinPhi * Math.cos(b)) / DEG;
    out.push({ lat: latT, lon: ((lonT + 540) % 360) - 180 });
  }
  return out;
}

/** Antisolar ground point — the pole of the NIGHT hemisphere (blueprint §4). */
export function antisolarPoint(sub: { lat: number; lon: number }): { lat: number; lon: number } {
  return { lat: -sub.lat, lon: ((sub.lon + 180 + 540) % 360) - 180 };
}

/** Angular distance (deg) between two lat/lon points on the unit sphere. */
export function angularDistanceDeg(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dot =
    Math.sin(a.lat * DEG) * Math.sin(b.lat * DEG) +
    Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.cos((a.lon - b.lon) * DEG);
  return Math.acos(Math.max(-1, Math.min(1, dot))) / DEG;
}

/** Great-circle ground distance (km) between two lat/lon points (geodesy §1/§2).
 *  d = R_E · Δ (Δ in radians). Acceptance: DEL→SFO ≈ 12,382 km. */
export function groundDistanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  return R_EARTH_KM * angularDistanceDeg(a, b) * DEG;
}

/** Is a point inside the daylight hemisphere for a given subsolar point?
 *  True when its angular distance from the subsolar point is < 90°. */
export function isDaylight(point: { lat: number; lon: number }, sub: { lat: number; lon: number }): boolean {
  return angularDistanceDeg(point, sub) < 90;
}

/** Subsolar point for an ISO instant (kepler.ts is the single source of truth). */
export function subsolarFor(epochMs: number): { lat: number; lon: number } {
  return subsolarPoint(epochMs);
}

/** Local wall-clock (HH:MM) at `epochMs` for a UTC offset in hours, plus a
 *  day-delta vs. the UTC calendar day of `epochMs` (−1 previous / 0 same /
 *  +1 next), for the "(prev day)" / "(+1)" annotations (blueprint §7/§8). */
export function localClock(epochMs: number, offsetH: number): { hhmm: string; dayDelta: number } {
  const shifted = epochMs + offsetH * 3600000;
  const d = new Date(shifted);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const baseDay = Math.floor(new Date(epochMs).getTime() / 86400000);
  const locDay = Math.floor(shifted / 86400000);
  return { hhmm: `${hh}:${mm}`, dayDelta: locDay - baseDay };
}

/** A signed UTC-offset label like "UTC+5:30" / "UTC−8:00" (blueprint §8). */
export function offsetLabel(offsetH: number): string {
  const sign = offsetH < 0 ? '−' : '+'; // minus sign, not hyphen
  const abs = Math.abs(offsetH);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}:${String(m).padStart(2, '0')}`;
}

/** Whole-and-half-hour clamp for arcBulge (blueprint §3: default 0.14, 0.05–0.18). */
export function clampBulge(h: number | undefined): number {
  const v = typeof h === 'number' && isFinite(h) ? h : 0.14;
  return Math.max(0.05, Math.min(0.18, v));
}

/** Compact "N.N h" / "N h" for phase gaps and durations. */
export function fmtHours(h: number): string {
  const r = Math.round(h * 10) / 10;
  return (Number.isInteger(r) ? r.toFixed(0) : r.toFixed(1)) + ' h';
}

/** Thousands-separated integer km, e.g. 12382 → "12,382". */
export function fmtKm(km: number): string {
  return Math.round(km).toLocaleString('en-US');
}
