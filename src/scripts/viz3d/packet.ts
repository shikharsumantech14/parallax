/* ============================================================================
   PARALLAX — packet-latency math for the `packet-trace` component.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (the scene passes THREE separately; the
   component calls these at BUILD TIME for the fallback). Mirrors
   docs/design/physics/{mechanics-and-flow.md §3, geodesy.md §2} 1:1 — same
   symbols, same conventions. The sheet is the spec; this file is the
   implementation. If they disagree, one of them is a bug: fix both together.

   The honesty core: a request's measured round trip is decomposed hop-by-hop
   against the speed-of-light floor (2·d / v_fiber). The gap between the floor
   and the measured time is routing, queuing, TLS handshakes and the last mile
   — the milliseconds humans added to what physics already demanded.

   Acceptance anchor (blueprint §4, recompute exactly):
     V_FIBER_KMS(1.468) = 204,218 km/s  (≈ 9.793 ms RTT per 1000 km)
     Mumbai(19.08,72.88)→Frankfurt(50.11,8.68): greatCircleKm = 6,564 km,
       hopFloorMs = 64.3 ms.  Frankfurt→Ashburn(39.04,-77.49) = 6,549 km,
       floor 64.1 ms.  compute hop floor 0.
     Totals: floor 128.4 ms · measured 256 ms · overhead 127.6 ms.
   ============================================================================ */

const DEG = Math.PI / 180;

/** Speed of light in vacuum, km/s. */
export const C_KMS = 299792.458;
/** Mean Earth radius, km (geodesy.md §2). */
export const R_E_KM = 6371;

/** Signal speed in fibre: c / n. Default n = 1.468 → 204,218 km/s.
    n = 1.0 = vacuum / radio line-of-sight (no glass to slow the photon). */
export function vFiberKms(n = 1.468): number {
  return C_KMS / (n > 0 ? n : 1.468);
}

export interface LatLon { lat: number; lon: number; }

/** Great-circle distance in km — R_E · acos(â·b̂), the kepler.ts convention
    (unit vectors [cosφcosλ, cosφsinλ, sinφ]). Returns the scalar distance
    only; use kepler.ts greatCircle() for the arc *points*. */
export function greatCircleKm(a: LatLon, b: LatLon): number {
  const va = [Math.cos(a.lat * DEG) * Math.cos(a.lon * DEG), Math.cos(a.lat * DEG) * Math.sin(a.lon * DEG), Math.sin(a.lat * DEG)];
  const vb = [Math.cos(b.lat * DEG) * Math.cos(b.lon * DEG), Math.cos(b.lat * DEG) * Math.sin(b.lon * DEG), Math.sin(b.lat * DEG)];
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  return R_E_KM * Math.acos(dot);
}

export type HopKind = 'fiber' | 'wireless' | 'satellite' | 'compute';

export interface Hop {
  from: string; fromLat: number; fromLon: number;
  to: string; toLat: number; toLon: number;
  rttMs: number;
  kind?: HopKind;
  note?: string;
}

/** The RTT floor for one hop, ms — the minimum physics allows for the round
    trip. `compute` hops have ~0 distance, so their floor is 0 (the whole
    segment is overhead: TLS, DNS, the server's own work). */
export function hopFloorMs(hop: Hop, n = 1.468): number {
  if (hop.kind === 'compute') return 0;
  const d = greatCircleKm({ lat: hop.fromLat, lon: hop.fromLon }, { lat: hop.toLat, lon: hop.toLon });
  return (2 * d / vFiberKms(n)) * 1000;
}

export interface Segment {
  i: number;
  label: string;   // "{from}→{to}"
  from: string; to: string;
  kind: HopKind;
  note?: string;
  distKm: number;
  floor: number;      // ms — physics minimum
  measured: number;   // ms — measured RTT for this hop
  overhead: number;   // ms — measured − floor (never < 0)
  compute: boolean;
}

export interface Budget {
  floorMs: number;
  measMs: number;
  overheadMs: number;
  segments: Segment[];
}

/** Decompose the whole trace: Σ floors, Σ measured, and a per-hop segment
    carrying floor / overhead. The component NEVER trusts an authored total —
    floorMs and measMs are always summed from `hops` here. */
export function budget(hops: Hop[], n = 1.468): Budget {
  const segments: Segment[] = hops.map((h, i) => {
    const compute = h.kind === 'compute';
    const distKm = compute ? 0 : greatCircleKm({ lat: h.fromLat, lon: h.fromLon }, { lat: h.toLat, lon: h.toLon });
    const floor = hopFloorMs(h, n);
    const measured = Math.max(0, h.rttMs);
    return {
      i,
      label: `${h.from}→${h.to}`,
      from: h.from, to: h.to,
      kind: (h.kind || 'fiber') as HopKind,
      note: h.note,
      distKm,
      floor,
      measured,
      overhead: Math.max(0, measured - floor),
      compute,
    };
  });
  const floorMs = segments.reduce((s, seg) => s + seg.floor, 0);
  const measMs = segments.reduce((s, seg) => s + seg.measured, 0);
  return { floorMs, measMs, overheadMs: Math.max(0, measMs - floorMs), segments };
}

export interface BarSegment extends Segment {
  x0: number;       // left edge, px
  w: number;        // full segment width, px (∝ measured)
  floorW: number;   // lime portion width, px (∝ floor, from the left)
  overheadW: number;// pink portion width, px (∝ overhead, abutting right)
}

export interface BarLayout {
  pxPerMs: number;
  segments: BarSegment[];
  floorLineX: number;  // where the trip would end at the physics floor
  endX: number;        // where the measured trip ends (bar right edge)
}

/** Place the segments left→right on a bar spanning [x0, x0 + wBar] at scale
    px_per_ms = wBar / measMs. Each segment's floorW + overheadW == w exactly
    (conservation), and the floor line sits at Σ floors. */
export function layoutBar(b: Budget, x0: number, wBar: number): BarLayout {
  const pxPerMs = b.measMs > 0 ? wBar / b.measMs : 0;
  let cursor = x0;
  const segments: BarSegment[] = b.segments.map((s) => {
    const w = s.measured * pxPerMs;
    const floorW = s.floor * pxPerMs;
    const overheadW = s.overhead * pxPerMs;
    const seg: BarSegment = { ...s, x0: cursor, w, floorW, overheadW };
    cursor += w;
    return seg;
  });
  return { pxPerMs, segments, floorLineX: x0 + b.floorMs * pxPerMs, endX: x0 + b.measMs * pxPerMs };
}

/** Unique cities in trace order (dedup by label + rounded coords), tagged with
    origin / destination so the scene + fallback can accent the endpoints. */
export interface City { label: string; lat: number; lon: number; origin: boolean; dest: boolean; }
export function cities(hops: Hop[], originLabel?: string): City[] {
  const seq: { label: string; lat: number; lon: number }[] = [];
  hops.forEach((h) => {
    seq.push({ label: h.from, lat: h.fromLat, lon: h.fromLon });
    seq.push({ label: h.to, lat: h.toLat, lon: h.toLon });
  });
  if (originLabel && seq.length) seq[0].label = originLabel;
  const key = (p: { lat: number; lon: number }) => `${p.lat.toFixed(2)},${p.lon.toFixed(2)}`;
  const originKey = seq.length ? key(seq[0]) : '';
  const destKey = seq.length ? key(seq[seq.length - 1]) : '';
  const seen = new Map<string, City>();
  for (const p of seq) {
    const k = key(p);
    if (!seen.has(k)) {
      seen.set(k, { label: p.label, lat: p.lat, lon: p.lon, origin: k === originKey, dest: k === destKey });
    } else if (p.label && !seen.get(k)!.label) {
      seen.get(k)!.label = p.label;
    }
  }
  return Array.from(seen.values());
}

/** Mean of all hop endpoint longitudes — the scene seeds yaw from this so the
    globe opens on the route, not the empty Pacific. */
export function meanHopLon(hops: Hop[]): number {
  if (!hops.length) return 0;
  let s = 0, n = 0;
  hops.forEach((h) => { s += h.fromLon + h.toLon; n += 2; });
  return s / n;
}
