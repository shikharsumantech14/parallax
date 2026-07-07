/* ============================================================================
   PARALLAX — hemicycle / division-lobby math for the `chamber` component.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (kepler.ts-style): the SAME module feeds
   both the WebGL scene (scenes/chamber.ts) and the build-time fallback SVG in
   src/components/topic/politics/Chamber.astro, so the no-JS reader gets the
   identical geometry. Every formula mirrors docs/design/physics/
   apportionment.md §1 1:1 — same symbols, same conventions. If they disagree,
   one of them is a bug: fix visibly, both together.

   Acceptance anchor (blueprint §4): hemicycleSeats(543, 11, 210) returns
   EXACTLY 543 anchors; row seat-counts ascend monotonically; Σ rows = 543.
   ============================================================================ */

const DEG = Math.PI / 180;

/* Blueprint §4 constants (scene units). */
export const R0 = 1.05;             // inner row radius r₀
export const ROW_GAP = 0.16;        // row gap g
export const SEAT_W = 0.075;        // seat block x
export const SEAT_H = 0.06;         // seat block y
export const SEAT_D = 0.075;        // seat block z
export const LOBBY_SPACING = 0.095; // division-lobby grid spacing

/** Default row count by chamber size (blueprint §3): ≤200→7, ≤400→9, else 11. */
export function rowsFor(total: number): number {
  return total <= 200 ? 7 : total <= 400 ? 9 : 11;
}

/** Division-lobby column count (blueprint §4): ceil(√(n·1.6)). */
export function lobbyCols(n: number): number {
  return Math.max(1, Math.ceil(Math.sqrt(Math.max(0, n) * 1.6)));
}

export interface SeatAnchor {
  x: number;     // r·sinα
  z: number;     // −r·cosα (chamber faces −Z, Y-up; seatY is the caller's)
  angle: number; // α, rad, measured from the axis of symmetry — ascending = left→right
  row: number;   // 0 = innermost row
}

/**
 * Seat anchors on true hemicycle arcs (apportionment.md §1).
 *
 * 1. Row radii r_k = r₀ + k·g, k = 0..rows−1.
 * 2. Seats per row ∝ arc length (∝ r_k): quotas q_k = N·r_k / Σr_j, floored,
 *    with the rounding drift fixed by largest-remainder so Σn_k = N exactly.
 * 3. Per-row angles α_j = −θ/2 + θ·(j + 0.5)/n_k; position (r·sinα, ·, −r·cosα).
 * 4. Returned sorted by α (then r) — party filling is angular, not row-wise,
 *    so contiguous slices of this array ARE the contiguous party wedges.
 */
export function hemicycleSeats(
  total: number,
  rows: number,
  arcDeg: number,
  r0 = R0,
  gap = ROW_GAP,
): SeatAnchor[] {
  if (total <= 0 || rows <= 0) return [];
  const theta = arcDeg * DEG;
  const radii = Array.from({ length: rows }, (_, k) => r0 + k * gap);
  const sumR = radii.reduce((s, r) => s + r, 0);

  // largest-remainder apportionment: floor the quotas, hand the leftover
  // seats to the largest fractional parts (outer rows win ties, which keeps
  // the row counts monotonically ascending).
  const quotas = radii.map((r) => (total * r) / sumR);
  const counts = quotas.map((q) => Math.floor(q));
  let leftover = total - counts.reduce((s, n) => s + n, 0);
  const order = quotas
    .map((q, k) => ({ k, frac: q - Math.floor(q) }))
    .sort((a, b) => b.frac - a.frac || b.k - a.k);
  for (let i = 0; i < order.length && leftover > 0; i++, leftover--) {
    counts[order[i].k]++;
  }

  const seats: SeatAnchor[] = [];
  for (let k = 0; k < rows; k++) {
    const r = radii[k];
    const n = counts[k];
    for (let j = 0; j < n; j++) {
      const a = -theta / 2 + (theta * (j + 0.5)) / n;
      seats.push({ x: r * Math.sin(a), z: -r * Math.cos(a), angle: a, row: k });
    }
  }
  // angular sort (then radius) — blocs fill left→right as contiguous wedges
  seats.sort((a, b) => a.angle - b.angle || a.row - b.row);
  return seats;
}

export interface GridAnchor {
  x: number;
  z: number;
}

/**
 * Row-major grid anchors for the division lobbies (Aye x<0, No x>0 — the
 * caller mirrors by choosing x0/dx). Also reused in 2D by the fallback SVG
 * (its z maps to the plate's y).
 */
export function lobbyGrid(
  n: number,
  cols: number,
  x0: number,
  z0: number,
  dx: number,
  dz: number,
): GridAnchor[] {
  const out: GridAnchor[] = [];
  const c = Math.max(1, cols);
  for (let i = 0; i < n; i++) {
    out.push({ x: x0 + (i % c) * dx, z: z0 + Math.floor(i / c) * dz });
  }
  return out;
}
