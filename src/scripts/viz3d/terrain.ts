/* ============================================================================
   PARALLAX — DEM terrain math for the `terrain-relief` component.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (kepler.ts / hemicycle.ts-style): the SAME
   module feeds both the WebGL scene (scenes/terrainRelief.ts) and the
   build-time fallback SVG in src/components/topic/earth/TerrainRelief.astro, so
   the no-JS reader gets the identical topographic surface. Every formula mirrors
   docs/design/blueprints/earth/terrain-relief.md §4 (and geodesy.md §5) 1:1. If
   they disagree, one of them is a bug: fix visibly, both together.

   Acceptance anchor (blueprint §4 / §11): the 3×3 DEM
   `w=3,h=3, minM=0, maxM=1000, q=[0,0,0, 0,65535,0, 0,0,0]` (a lone central
   spike) at `interval_m = 500` returns EXACTLY ONE closed 4-pt contour at level
   500 m and ZERO ridges. A reviewer recomputes both by hand.
   ============================================================================ */

/* ── (a) DEM decode (blueprint §4a / geodesy §5) ─────────────────────────── */

export interface DEMJson {
  w: number;
  h: number;
  latN: number;
  latS: number;
  lonW: number;
  lonE: number;
  minM: number;
  maxM: number;
  q: number[] | Uint16Array;
}

export interface DEM {
  w: number;
  h: number;
  latN: number;
  latS: number;
  lonW: number;
  lonE: number;
  minM: number;
  maxM: number;
  /** elevation (m) at integer grid cell (col,row); row 0 = north (latN). */
  elevAt(col: number, row: number): number;
  /** bilinearly-sampled elevation (m) at a lat/lon inside the tile. */
  elevLL(lat: number, lon: number): number;
}

const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Decode a DEM JSON payload into a sampler. `q` is uint16 0..65535 row-major,
 * north-at-top (row 0 = latN). `elev_m = minM + q/65535·(maxM−minM)`.
 */
export function decodeDEM(json: DEMJson): DEM {
  const w = json.w | 0;
  const h = json.h | 0;
  const { latN, latS, lonW, lonE, minM, maxM } = json;
  const q = json.q;
  const span = maxM - minM;
  const at = (col: number, row: number): number => {
    const c = clampN(col | 0, 0, w - 1);
    const r = clampN(row | 0, 0, h - 1);
    const raw = q[r * w + c] ?? 0;
    return minM + (raw / 65535) * span;
  };
  return {
    w, h, latN, latS, lonW, lonE, minM, maxM,
    elevAt: at,
    elevLL(lat: number, lon: number): number {
      // fractional grid index — latN is row 0 (north at top).
      const fx = clampN(((lon - lonW) / (lonE - lonW)) * (w - 1), 0, w - 1);
      const fy = clampN(((latN - lat) / (latN - latS)) * (h - 1), 0, h - 1);
      const c0 = Math.floor(fx), r0 = Math.floor(fy);
      const c1 = Math.min(c0 + 1, w - 1), r1 = Math.min(r0 + 1, h - 1);
      const tx = fx - c0, ty = fy - r0;
      const a = at(c0, r0), b = at(c1, r0), c = at(c0, r1), d = at(c1, r1);
      const top = a + (b - a) * tx;
      const bot = c + (d - c) * tx;
      return top + (bot - top) * ty;
    },
  };
}

/* ── (b) contour polylines — marching squares (blueprint §4b) ────────────── */

export interface GridPt { col: number; row: number; }
export interface Contour {
  level_m: number;
  isIndex: boolean;      // every 5th contour (level % (interval·5) === 0): heavier + labelled
  pts: GridPt[];         // fractional grid-space polyline (consumer maps to world/plane)
}

/** Interior contour levels: multiples of `interval` STRICTLY between the tile's
    extremes. Both endpoints are open (a marching-squares level needs cells that
    both exceed AND fall below it — neither extreme has a crossing). */
export function contourLevels(minM: number, maxM: number, interval: number): number[] {
  if (!(interval > 0) || !(maxM > minM)) return [];
  const first = (Math.floor(minM / interval) + 1) * interval;
  const last = (Math.ceil(maxM / interval) - 1) * interval;
  const out: number[] = [];
  // guard against FP drift on exact multiples with a tiny epsilon of an interval
  const eps = interval * 1e-9;
  for (let L = first; L <= last + eps; L += interval) {
    // exclude the open endpoints explicitly (defensive; the range already does)
    if (L > minM + eps && L < maxM - eps) out.push(L);
  }
  return out;
}

/**
 * Marching squares over the DEM grid at each interior level. Standard 16-case
 * table, linear edge interpolation of the crossing point; segments chained into
 * polylines where endpoints coincide (tolerance = TOL of a cell). Returns
 * grid-space (fractional col/row) polylines, one Contour per chained loop/arc.
 */
export function contourPolylines(dem: DEM, interval_m: number): Contour[] {
  const { w, h, minM, maxM } = dem;
  const levels = contourLevels(minM, maxM, interval_m);
  const out: Contour[] = [];
  const idxMod = interval_m * 5;

  for (const level of levels) {
    // collect raw segments for this level
    const segs: [number, number, number, number][] = []; // c0,r0 → c1,r1 (grid coords)

    for (let r = 0; r < h - 1; r++) {
      for (let c = 0; c < w - 1; c++) {
        // cell corners: TL(c,r) TR(c+1,r) BR(c+1,r+1) BL(c,r+1)
        const tl = dem.elevAt(c, r);
        const tr = dem.elevAt(c + 1, r);
        const br = dem.elevAt(c + 1, r + 1);
        const bl = dem.elevAt(c, r + 1);

        let code = 0;
        if (tl >= level) code |= 8; // TL
        if (tr >= level) code |= 4; // TR
        if (br >= level) code |= 2; // BR
        if (bl >= level) code |= 1; // BL
        if (code === 0 || code === 15) continue;

        // edge crossing points (fractional grid coords), interpolated
        const lerp = (a: number, b: number) => (level - a) / (b - a);
        const top = () => ({ col: c + lerp(tl, tr), row: r });
        const right = () => ({ col: c + 1, row: r + lerp(tr, br) });
        const bottom = () => ({ col: c + lerp(bl, br), row: r + 1 });
        const left = () => ({ col: c, row: r + lerp(tl, bl) });

        const push = (a: GridPt, b: GridPt) => segs.push([a.col, a.row, b.col, b.row]);

        // 16-case marching squares (saddles 5/10 resolved via cell-average)
        switch (code) {
          case 1: push(left(), bottom()); break;
          case 2: push(bottom(), right()); break;
          case 3: push(left(), right()); break;
          case 4: push(top(), right()); break;
          case 5: { // saddle
            const avg = (tl + tr + br + bl) / 4;
            if (avg >= level) { push(left(), top()); push(bottom(), right()); }
            else { push(left(), bottom()); push(top(), right()); }
            break;
          }
          case 6: push(top(), bottom()); break;
          case 7: push(left(), top()); break;
          case 8: push(left(), top()); break;
          case 9: push(top(), bottom()); break;
          case 10: { // saddle
            const avg = (tl + tr + br + bl) / 4;
            if (avg >= level) { push(left(), bottom()); push(top(), right()); }
            else { push(left(), top()); push(bottom(), right()); }
            break;
          }
          case 11: push(top(), right()); break;
          case 12: push(left(), right()); break;
          case 13: push(bottom(), right()); break;
          case 14: push(left(), bottom()); break;
          default: break;
        }
      }
    }

    // chain segments into polylines where endpoints coincide
    const chains = chainSegments(segs);
    const isIndex = Math.abs(level % idxMod) < interval_m * 1e-6
      || Math.abs((level % idxMod) - idxMod) < interval_m * 1e-6;
    for (const ch of chains) {
      out.push({ level_m: level, isIndex, pts: ch });
    }
  }
  return out;
}

const TOL = 1e-4; // tolerance = 1e−4 of a cell (blueprint §4b)
function key(c: number, r: number): string {
  return Math.round(c / TOL) + ':' + Math.round(r / TOL);
}

/** Chain undirected segments into polylines by coincident endpoints. */
function chainSegments(segs: [number, number, number, number][]): GridPt[][] {
  // adjacency: endpoint-key → list of {seg index, which end}
  const ends = new Map<string, { seg: number; end: 0 | 1 }[]>();
  const add = (k: string, seg: number, end: 0 | 1) => {
    let a = ends.get(k);
    if (!a) { a = []; ends.set(k, a); }
    a.push({ seg, end });
  };
  segs.forEach((s, i) => {
    add(key(s[0], s[1]), i, 0);
    add(key(s[2], s[3]), i, 1);
  });

  const used = new Array<boolean>(segs.length).fill(false);
  const chains: GridPt[][] = [];

  const ptOf = (seg: number, end: 0 | 1): GridPt =>
    end === 0
      ? { col: segs[seg][0], row: segs[seg][1] }
      : { col: segs[seg][2], row: segs[seg][3] };

  for (let start = 0; start < segs.length; start++) {
    if (used[start]) continue;
    used[start] = true;
    const chain: GridPt[] = [ptOf(start, 0), ptOf(start, 1)];

    // extend forward from the tail
    let grew = true;
    while (grew) {
      grew = false;
      const tail = chain[chain.length - 1];
      const cands = ends.get(key(tail.col, tail.row));
      if (!cands) break;
      for (const cand of cands) {
        if (used[cand.seg]) continue;
        used[cand.seg] = true;
        const other = ptOf(cand.seg, cand.end === 0 ? 1 : 0);
        chain.push(other);
        grew = true;
        break;
      }
    }
    // extend backward from the head
    grew = true;
    while (grew) {
      grew = false;
      const head = chain[0];
      const cands = ends.get(key(head.col, head.row));
      if (!cands) break;
      for (const cand of cands) {
        if (used[cand.seg]) continue;
        used[cand.seg] = true;
        const other = ptOf(cand.seg, cand.end === 0 ? 1 : 0);
        chain.unshift(other);
        grew = true;
        break;
      }
    }
    chains.push(chain);
  }
  return chains;
}

/* ── (c) ridgelines — the signature crest extraction (blueprint §4c) ─────── */

export interface Ridge { pts: GridPt[]; }

/**
 * A grid vertex is a ridge point if it is a local max along EITHER the row OR
 * the column 1-D profile (elev ≥ both orthogonal neighbours on one axis AND
 * strictly ≥ one of them) AND its elevation is in the top 55% of the tile's
 * range (elev ≥ minM + 0.45·(maxM−minM)). Chain adjacent ridge points
 * (8-neighbour) into polylines ≥ 4 pts; drop shorter fragments.
 */
export function ridgelines(dem: DEM): Ridge[] {
  const { w, h, minM, maxM } = dem;
  const thresh = minM + 0.45 * (maxM - minM);
  const isRidge = new Array<boolean>(w * h).fill(false);

  const localMaxAxis = (a: number, self: number, b: number): boolean =>
    self >= a && self >= b && (self > a || self > b);

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const self = dem.elevAt(c, r);
      if (self < thresh) continue;
      // row profile (horizontal neighbours) — clamp at edges
      const left = dem.elevAt(Math.max(0, c - 1), r);
      const right = dem.elevAt(Math.min(w - 1, c + 1), r);
      // column profile (vertical neighbours)
      const up = dem.elevAt(c, Math.max(0, r - 1));
      const down = dem.elevAt(c, Math.min(h - 1, r + 1));
      const rowMax = c > 0 && c < w - 1 && localMaxAxis(left, self, right);
      const colMax = r > 0 && r < h - 1 && localMaxAxis(up, self, down);
      if (rowMax || colMax) isRidge[r * w + c] = true;
    }
  }

  // 8-neighbour chaining into polylines ≥ 4 pts (greedy longest-walk per seed)
  const visited = new Array<boolean>(w * h).fill(false);
  const N8 = [
    [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
  ];
  const ridges: Ridge[] = [];

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const i = r * w + c;
      if (!isRidge[i] || visited[i]) continue;
      // walk a connected component as a path (BFS order gives a stable chain)
      const stack: [number, number][] = [[c, r]];
      const comp: GridPt[] = [];
      visited[i] = true;
      while (stack.length) {
        const [cc, rr] = stack.pop()!;
        comp.push({ col: cc, row: rr });
        for (const [dc, dr] of N8) {
          const nc = cc + dc, nr = rr + dr;
          if (nc < 0 || nc >= w || nr < 0 || nr >= h) continue;
          const ni = nr * w + nc;
          if (isRidge[ni] && !visited[ni]) {
            visited[ni] = true;
            stack.push([nc, nr]);
          }
        }
      }
      if (comp.length >= 4) ridges.push({ pts: comp });
    }
  }
  return ridges;
}

/* ── shared helpers used by BOTH the scene and the fallback plate ─────────── */

/** Sign-aware coordinate label — used for corner coords, peak tooltip, and the
    fallback plate (blueprint §4 Labels / §7 / §8). e.g. (27.99, 86.93) →
    "27.99°N 86.93°E"; (−33.42, −70.65) → "33.42°S 70.65°W". */
export function fmtCoord(lat: number, lon: number, dp = 2): string {
  const la = Math.abs(lat).toFixed(dp) + '°' + (lat >= 0 ? 'N' : 'S');
  const lo = Math.abs(lon).toFixed(dp) + '°' + (lon >= 0 ? 'E' : 'W');
  return la + ' ' + lo;
}

/** Elevation with thousands separators (blueprint §8), e.g. 8849 → "8,849". */
export function fmtElev(m: number): string {
  return Math.round(m).toLocaleString('en-US');
}

/** "Nice" contour step — one of {10,20,25,50,100,200,250,500,1000} nearest to
    the raw span/12 estimate (blueprint §3 default contourInterval_m). */
const NICE_STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
export function niceStep(raw: number): number {
  if (!(raw > 0)) return NICE_STEPS[0];
  for (const s of NICE_STEPS) if (raw <= s) return s;
  return NICE_STEPS[NICE_STEPS.length - 1];
}

/** Default contour interval for a tile (blueprint §3): niceStep((max−min)/12). */
export function autoInterval(minM: number, maxM: number): number {
  return niceStep((maxM - minM) / 12);
}

/** Clamp of the true ground aspect Z/X for the plane / fallback (blueprint §4):
    aspect = (latN−latS) / ((lonE−lonW)·cos(midLat)), clamped [0.5, 2.0].
    cos(midLat) DIVIDES the E-W span (a degree of longitude is physically
    shorter away from the equator, so a 1°×1° tile near 28°N reads taller). */
export function tileAspect(latN: number, latS: number, lonW: number, lonE: number): number {
  const midLat = ((latN + latS) / 2) * (Math.PI / 180);
  const ns = latN - latS;
  const ew = (lonE - lonW) * Math.cos(midLat);
  const a = ew !== 0 ? ns / ew : 1;
  return clampN(a, 0.5, 2.0);
}

/** Ground width of the tile in km (blueprint §7 scale bar):
    d = R_E·Δλ·cos(midLat)·π/180, R_E = 6371 km. */
export const R_E_KM = 6371;
export function tileGroundWidthKm(latN: number, latS: number, lonW: number, lonE: number): number {
  const midLat = ((latN + latS) / 2) * (Math.PI / 180);
  return R_E_KM * (lonE - lonW) * Math.cos(midLat) * (Math.PI / 180);
}

/** A "nice" scale-bar length ≤ the full ground width, from the same {1,2,5}×10ⁿ
    ladder surveyors use — returns { km, fracOfWidth } for the fallback bar. */
export function niceScaleBar(groundWidthKm: number): { km: number; frac: number } {
  const target = groundWidthKm * 0.35; // ~a third of the frame
  if (!(target > 0)) return { km: 1, frac: 0 };
  const pow = Math.pow(10, Math.floor(Math.log10(target)));
  const cands = [1, 2, 5, 10].map((m) => m * pow);
  let best = cands[0];
  for (const c of cands) if (c <= target) best = c;
  return { km: best, frac: clampN(best / groundWidthKm, 0, 1) };
}
