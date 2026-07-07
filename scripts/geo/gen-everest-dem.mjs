/**
 * Generate a clean, plausible Khumbu / Everest-region DEM for the terrain-relief
 * showcase (the agent-made sample had a tiling artifact). Not real SRTM — a
 * smooth procedural massif: the real peaks as Gaussian summits over coherent,
 * non-repeating valley terrain. Output matches decodeDEM's format
 * ({w,h,latN,latS,lonW,lonE,minM,maxM,q[]}), q = uint16 row-major (north = row 0).
 *
 *   node scripts/geo/gen-everest-dem.mjs
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

const W = 96, H = 96;
const latN = 28.1, latS = 27.6, lonW = 86.7, lonE = 87.2;

// seeded PRNG (deterministic output)
let seed = 20260706;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

// coherent low-frequency value noise: random coarse grid, bilinear-interpolated
function valueNoise(gw, gh) {
  const grid = Array.from({ length: gh + 1 }, () =>
    Array.from({ length: gw + 1 }, () => rnd()));
  return (u, v) => { // u,v in [0,1]
    const x = u * gw, y = v * gh;
    const x0 = Math.min(Math.floor(x), gw - 1), y0 = Math.min(Math.floor(y), gh - 1);
    const tx = x - x0, ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty); // smoothstep
    const a = grid[y0][x0], b = grid[y0][x0 + 1], c = grid[y0 + 1][x0], d = grid[y0 + 1][x0 + 1];
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  };
}
const n1 = valueNoise(6, 6);   // broad relief
const n2 = valueNoise(13, 13); // ridges
const n3 = valueNoise(26, 26); // fine texture

// real summits (lat, lon, elev m)
const PEAKS = [
  { lat: 27.9881, lon: 86.9250, e: 8849, s: 0.019 }, // Everest
  { lat: 27.9617, lon: 86.9330, e: 8516, s: 0.017 }, // Lhotse
  { lat: 27.9667, lon: 86.8894, e: 7861, s: 0.016 }, // Nuptse
  { lat: 28.0147, lon: 86.8297, e: 7161, s: 0.018 }, // Pumori
  { lat: 28.0300, lon: 86.9200, e: 7543, s: 0.017 }, // Changtse
  { lat: 27.8800, lon: 86.8600, e: 6812, s: 0.015 }, // Ama Dablam-ish
];

const q = new Array(W * H);
let mn = Infinity, mx = -Infinity;
const raw = new Float64Array(W * H);
for (let r = 0; r < H; r++) {
  for (let c = 0; c < W; c++) {
    const u = c / (W - 1), v = r / (H - 1);
    const lon = lonW + u * (lonE - lonW);
    const lat = latN - v * (latN - latS); // north at row 0
    // coherent valley base ~4200–5600 m, gently higher to the north
    let e = 4300 + (latN - lat) / (latN - latS) * 900
      + n1(u, v) * 1500 + n2(u, v) * 650 + n3(u, v) * 220;
    // add the summits as smooth Gaussians (only where they lift the terrain)
    for (const p of PEAKS) {
      const dLat = lat - p.lat, dLon = lon - p.lon;
      const d2 = dLat * dLat + dLon * dLon;
      const lift = (p.e - 4600) * Math.exp(-d2 / (2 * p.s * p.s));
      e = Math.max(e, 4300 + lift + n3(u, v) * 180); // massif dominates its bump
    }
    raw[r * W + c] = e;
    mn = Math.min(mn, e); mx = Math.max(mx, e);
  }
}
const minM = 3800, maxM = 8849;                 // fixed range (matches the peaks)
const span = maxM - minM;
for (let i = 0; i < raw.length; i++) {
  const clamped = Math.max(minM, Math.min(maxM, raw[i]));
  q[i] = Math.round(((clamped - minM) / span) * 65535);
}

const out = { w: W, h: H, latN, latS, lonW, lonE, minM, maxM, q };
const path = join(process.cwd(), 'public', 'geo', '2026-07-everest-khumbu-dem.json');
writeFileSync(path, JSON.stringify(out));
console.log(`wrote ${path} — ${W}×${H}, raw range ${mn.toFixed(0)}–${mx.toFixed(0)} m, clamped to ${minM}–${maxM}`);
