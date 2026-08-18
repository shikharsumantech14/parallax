/* ============================================================================
   PARALLAX — `plate-motion` scene (earth · WebGL · extends the shared globe).
   Blueprint (the contract): docs/design/blueprints/earth/plate-motion.md — this
   file implements it 1:1. Math mirrors docs/design/physics/geodesy.md §4.

   The tectonic engine made visible: the real country globe (globe.ts) with the
   plate-boundary network inked over it and, at a scatter of in-plate points, the
   surface-velocity arrows each plate's Euler rotation actually produces — long
   where the plate races, vanishing at its rotation pole. Drag to spin; hover an
   arrow for the exact speed + bearing. ONE ambient motion (the globe idle-spin);
   arrows are a STATIC field once settled (the motion they depict is geological —
   animating it would lie about the timescale).

   The pure velocity/seed helpers below are exported and imported by
   PlateMotion.astro so the build-time fallback hemisphere draws the IDENTICAL
   field with zero JS. Takes THREE as a parameter; never imports three.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController, latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';
import { makePicker, makeTooltip } from '../helpers';

/* ── pure geodesy (no THREE) — geodesy.md §4, unit-testable ──────────────────
   Coordinate convention matches globe.ts `latLon` exactly so the 3-D tangent
   vectors returned here drop straight into the scene AND the orthographic
   fallback. */
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
export interface Pole { lat: number; lon: number; omega: number }
export interface PlateSpec {
  name: string;
  pole: Pole;
  color?: string;
  samples?: Array<{ lat: number; lon: number }>;
  bbox?: [number, number, number, number]; // [lonW,latS,lonE,latN]
}
export interface PlateMotionData {
  plates?: PlateSpec[];
  boundaries?: string;
  maxVel_mmyr?: number;
  _palette?: string[];        // earth-family fallback colours (component-injected)
  _hideCountryLabels?: boolean;
}
export interface Arrow {
  plate: number; name: string; color: string;
  lat: number; lon: number;
  vMag: number; bearing: number;   // mm/yr, compass azimuth (0=N,90=E)
  t: [number, number, number];     // unit tangent (motion direction), globe basis
  r: [number, number, number];     // unit radial (surface normal), globe basis
}

const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: number[], b: number[]): [number, number, number] =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (v: number[]): [number, number, number] => {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
};

/** Unit vector for lat/lon (deg) in the SAME basis as globe.ts `latLon`. */
export function unitLatLon(lat: number, lon: number): [number, number, number] {
  const phi = (90 - lat) * D2R, th = (lon + 180) * D2R;
  return [-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)];
}

/**
 * Surface velocity of a plate at a point (geodesy.md §4):
 *   |v| = 111.2·ω·sin(Δ) mm/yr,  v̂ = normalize(p̂ × r̂)  (tangent).
 * Returns magnitude, unit tangent + radial, and the compass bearing of v̂.
 * Anchor: ω=1°/Myr at Δ=90° → 111.2 mm/yr; at the pole (Δ=0) → 0.
 */
export function plateVelocity(pole: Pole, lat: number, lon: number): {
  vMag: number; t: [number, number, number]; r: [number, number, number]; bearing: number; deltaDeg: number;
} {
  const r = unitLatLon(lat, lon);
  const p = unitLatLon(pole.lat, pole.lon);
  const delta = Math.acos(clampN(dot(p, r), -1, 1));
  const vMag = 111.2 * pole.omega * Math.sin(delta);
  // local east/north (globe basis) — for the bearing AND a safe near-pole tangent
  const phi = (90 - lat) * D2R, th = (lon + 180) * D2R;
  const east: [number, number, number] = [Math.sin(th), 0, Math.cos(th)];
  const north: [number, number, number] = [Math.cos(phi) * Math.cos(th), Math.sin(phi), -Math.cos(phi) * Math.sin(th)];
  const raw = cross(p, r);
  const t = Math.hypot(raw[0], raw[1], raw[2]) < 1e-7 ? east : norm(raw);
  let bearing = Math.atan2(dot(t, east), dot(t, north)) * R2D;
  bearing = ((bearing % 360) + 360) % 360;
  return { vMag, t, r, bearing, deltaDeg: delta * R2D };
}

const EARTH_FAMILY = ['#2d6a4f', '#a04922', '#1a4a36']; // forest · USGS brown · deep

/** Seed a coarse lat/lon lattice inside each plate's bbox (geodesy §4 seeding). */
function seedSamples(plates: PlateSpec[], gridDeg: number): Array<{ plate: number; lat: number; lon: number }> {
  const out: Array<{ plate: number; lat: number; lon: number }> = [];
  plates.forEach((pl, pi) => {
    if (Array.isArray(pl.samples) && pl.samples.length) {
      pl.samples.forEach((s) => out.push({ plate: pi, lat: s.lat, lon: s.lon }));
      return;
    }
    if (!pl.bbox) return;
    const [lonW, latS, lonE, latN] = pl.bbox;
    const lat0 = Math.min(latS, latN), lat1 = Math.max(latS, latN);
    const lon0 = Math.min(lonW, lonE), lon1 = Math.max(lonW, lonE);
    let n = 0;
    for (let la = lat0 + gridDeg / 2; la <= lat1 && n < 40; la += gridDeg) {
      for (let lo = lon0 + gridDeg / 2; lo <= lon1 && n < 40; lo += gridDeg) {
        out.push({ plate: pi, lat: la, lon: lo }); n++;
      }
    }
  });
  return out;
}

/**
 * Build the full velocity field (arrows + normaliser). Shared by the live scene
 * and the build-time fallback so both draw the identical field. Caps arrows at
 * 120 by widening GRID_DEG (blueprint §4/§10). Arrows below 0.5 mm/yr (the
 * still point near a pole) are dropped so the field "vanishes" at the pole.
 */
export function buildField(data: PlateMotionData): { arrows: Arrow[]; maxVel: number } {
  const plates = Array.isArray(data.plates) ? data.plates : [];
  const palette = Array.isArray(data._palette) && data._palette.length ? data._palette : EARTH_FAMILY;
  let grid = 8;
  let seeds = seedSamples(plates, grid);
  while (seeds.length > 120 && grid < 40) { grid += 4; seeds = seedSamples(plates, grid); }

  const arrows: Arrow[] = [];
  for (const s of seeds) {
    const pl = plates[s.plate];
    const pv = plateVelocity(pl.pole, s.lat, s.lon);
    if (pv.vMag < 0.5) continue; // vanishes at the rotation pole
    arrows.push({
      plate: s.plate, name: pl.name,
      color: pl.color || palette[s.plate % palette.length],
      lat: s.lat, lon: s.lon,
      vMag: pv.vMag, bearing: pv.bearing, t: pv.t, r: pv.r,
    });
  }
  const maxVel = typeof data.maxVel_mmyr === 'number' && data.maxVel_mmyr > 0
    ? data.maxVel_mmyr
    : Math.max(1, ...arrows.map((a) => a.vMag));
  return { arrows, maxVel };
}

/** Arrow length in scene units (blueprint §4): min stub 0.05, cap 0.23. */
export function arrowLen(vMag: number, maxVel: number, mobile = false): number {
  return (0.05 + 0.18 * clampN(vMag / maxVel, 0, 1)) * (mobile ? 0.9 : 1);
}

/* ── the scene ─────────────────────────────────────────────────────────────── */
const R = 1.4; // scene sphere radius (matches dataGlobe)

export const build: SceneBuilder = (THREE, canvas, data: PlateMotionData, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const mobile = mount.clientWidth > 0 && mount.clientWidth < 420;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.3, 5.0);
  camera.lookAt(0, 0, 0);
  const ink = new THREE.Color(colors.ink);
  const group = new THREE.Group();
  scene.add(group);

  const disposables: any[] = [];
  buildCountryGlobe(THREE, group, colors, R, disposables);

  /* ── velocity field ── */
  const { arrows, maxVel } = buildField(data);
  const plates = Array.isArray(data.plates) ? data.plates : [];

  // helper: rotate a tangent vector `v` (⟂ axis) about the radial `axis` by θ.
  const rot = (v: any, axis: any, theta: number) => {
    // Rodrigues, k·v ≈ 0: v·cosθ + (k×v)·sinθ
    const kxv = new THREE.Vector3().crossVectors(axis, v);
    return v.clone().multiplyScalar(Math.cos(theta)).addScaledVector(kxv, Math.sin(theta));
  };

  // Per-arrow geometry pieces (recomputed each settle frame). 3 segments/arrow:
  // shaft + 2 head arms = 6 vertices = 18 floats.
  interface Piece {
    plate: number; P0: any; dir: any; arm1: any; arm2: any; Lfull: number;
    off: number; cur: number; delay: number;
  }
  const HEAD = 30 * D2R;
  const perPlate: Array<{ pieces: Piece[]; arr: Float32Array; geo: any; mat: any }> = [];
  const pieceByArrow: Piece[] = [];
  const plateColors: any[] = [];

  plates.forEach((pl, pi) => {
    const mine = arrows.filter((a) => a.plate === pi);
    const arr = new Float32Array(mine.length * 18);
    const pieces: Piece[] = [];
    mine.forEach((a, k) => {
      const rHat = new THREE.Vector3(a.r[0], a.r[1], a.r[2]).normalize();
      const tHat = new THREE.Vector3(a.t[0], a.t[1], a.t[2]).normalize();
      const P0 = rHat.clone().multiplyScalar(R * 1.006);
      const Lfull = arrowLen(a.vMag, maxVel, mobile);
      const back = tHat.clone().negate();
      const arm1 = rot(back, rHat, HEAD);
      const arm2 = rot(back, rHat, -HEAD);
      const piece: Piece = {
        plate: pi, P0, dir: tHat, arm1, arm2, Lfull, off: k * 18,
        cur: 0, delay: (1 - clampN(a.vMag / maxVel, 0, 1)) * 0.45, // fastest first
      };
      pieces.push(piece);
      pieceByArrow.push(piece);
    });
    const colHex = mine.length ? mine[0].color : (pl.color || colors.accent);
    const col = new THREE.Color(colHex);
    plateColors[pi] = col;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 });
    group.add(new THREE.LineSegments(geo, mat));
    disposables.push(geo, mat);
    perPlate.push({ pieces, arr, geo, mat });
  });

  const writePiece = (p: Piece, arr: Float32Array, frac: number) => {
    const L = p.Lfull * frac;
    const P1 = p.P0.clone().addScaledVector(p.dir, L);
    const h1 = P1.clone().addScaledVector(p.arm1, 0.32 * L);
    const h2 = P1.clone().addScaledVector(p.arm2, 0.32 * L);
    const o = p.off;
    arr[o] = p.P0.x; arr[o + 1] = p.P0.y; arr[o + 2] = p.P0.z;
    arr[o + 3] = P1.x; arr[o + 4] = P1.y; arr[o + 5] = P1.z;
    arr[o + 6] = P1.x; arr[o + 7] = P1.y; arr[o + 8] = P1.z;
    arr[o + 9] = h1.x; arr[o + 10] = h1.y; arr[o + 11] = h1.z;
    arr[o + 12] = P1.x; arr[o + 13] = P1.y; arr[o + 14] = P1.z;
    arr[o + 15] = h2.x; arr[o + 16] = h2.y; arr[o + 17] = h2.z;
  };

  /* ── plate boundaries (lazy) — one merged LineSegments per dash class ──
     Dash is BAKED into the geometry (emit only the "on" spans) so a plain
     LineBasicMaterial gives a correct dashed/dotted look on the sphere and the
     whole class is ONE draw call. Type encoded by DASH, never colour. */
  const boundaryMeshes: Array<{ geo: any; mat: any; line: any; total: number }> = [];
  let boundaryBootMs = -2; // -2 = boundaries not yet loaded; -1 = stamp next frame; ≥0 = sweeping
  const DASH: Record<string, [number, number]> = { div: [0, 0], conv: [0.03, 0.02], trans: [0.008, 0.02] };
  const boundariesURL = typeof data.boundaries === 'string' ? data.boundaries : '/geo/plates.json';
  fetch(boundariesURL).then((res) => res.json()).then((bj: any) => {
    const lines: number[][][] = Array.isArray(bj && bj.lines) ? bj.lines : [];
    const kinds: string[] = Array.isArray(bj && bj.kinds) ? bj.kinds : [];
    const byClass: Record<string, number[]> = { div: [], conv: [], trans: [] };
    lines.forEach((line, li) => {
      const kind = (kinds[li] === 'conv' || kinds[li] === 'trans') ? kinds[li] : 'div';
      const bucket = byClass[kind];
      const [on, off] = DASH[kind];
      const pts = line.map((c) => latLon(THREE, c[1], c[0], R * 1.004));
      if (on <= 0) {
        for (let i = 0; i < pts.length - 1; i++) {
          bucket.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        }
      } else {
        // walk arc length, emit "on" spans as short segments (baked dash)
        let phase = 0; // distance into the current on/off cycle
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const segLen = a.distanceTo(b);
          if (segLen < 1e-6) continue;
          let d = 0;
          while (d < segLen) {
            const inOn = phase < on;
            const remain = (inOn ? on - phase : on + off - phase);
            const step = Math.min(remain, segLen - d);
            if (inOn) {
              const t0 = d / segLen, t1 = (d + step) / segLen;
              const p0 = a.clone().lerp(b, t0), p1 = a.clone().lerp(b, t1);
              bucket.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
            }
            d += step; phase += step;
            if (phase >= on + off) phase -= on + off;
          }
        }
      }
    });
    (['div', 'conv', 'trans'] as const).forEach((cls) => {
      const pos = byClass[cls];
      if (!pos.length) return;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const total = pos.length / 3;
      geo.setDrawRange(0, 0); // swept in
      const mat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.5 });
      const lineObj = new THREE.LineSegments(geo, mat);
      group.add(lineObj);
      disposables.push(geo, mat);
      boundaryMeshes.push({ geo, mat, line: lineObj, total });
    });
    boundaryBootMs = -1; // stamp on next frame → begin sweep
  }).catch(() => { /* missing asset ⇒ arrows still render (blueprint §11) */ });

  /* ── labels: plate names (data), major countries (faint) ── */
  const labels = makeLabels(THREE, mount);
  plates.forEach((pl) => {
    if (!pl.bbox) return;
    const [lonW, latS, lonE, latN] = pl.bbox;
    const cLat = (latS + latN) / 2, cLon = (lonW + lonE) / 2;
    labels.add(pl.name, latLon(THREE, cLat, cLon, R * 1.02), 'data', 1);
  });
  if (!data._hideCountryLabels && !mobile) {
    loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });
  }

  /* ── picking: one shared invisible pick-sphere per arrow at its P0 ── */
  const pickGeo = new THREE.SphereGeometry(0.03, 6, 6);
  const pickMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(pickGeo, pickMat);
  const pickTargets: any[] = [];
  arrows.forEach((a, i) => {
    const m = new THREE.Mesh(pickGeo, pickMat);
    m.position.copy(pieceByArrow[i].P0);
    m.userData.arrow = a;
    m.userData.piece = pieceByArrow[i];
    group.add(m);
    pickTargets.push(m);
  });

  // reusable hover-highlight (one arrow at @1.0) — hoverLift
  const hlGeo = new THREE.BufferGeometry();
  hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(18), 3));
  const hlMat = new THREE.LineBasicMaterial({ color: colors.accent, transparent: true, opacity: 0, linewidth: 2 });
  const hlLine = new THREE.LineSegments(hlGeo, hlMat);
  group.add(hlLine);
  disposables.push(hlGeo, hlMat);

  const tooltip = makeTooltip(mount);
  const fmtLat = (lat: number) => `${Math.abs(Math.round(lat))}°${lat >= 0 ? 'N' : 'S'}`;
  const fmtLon = (lon: number) => `${Math.abs(Math.round(lon))}°${lon >= 0 ? 'E' : 'W'}`;
  const picker = makePicker(THREE, camera, canvas, pickTargets, (obj, _inst, x, y) => {
    if (!obj) { hlMat.opacity = 0; tooltip.hide(); return; }
    const a: Arrow = obj.userData.arrow;
    const p: Piece = obj.userData.piece;
    const col = plateColors[a.plate];
    if (col) hlMat.color.copy(col);
    writePiece({ ...p, off: 0 } as Piece, hlGeo.attributes.position.array as Float32Array, Math.max(0.001, p.cur));
    hlGeo.attributes.position.needsUpdate = true;
    hlMat.opacity = 1;
    tooltip.show(
      `<b>${a.name}</b><br>${a.vMag.toFixed(0)} mm/yr → ${a.bearing.toFixed(0)}°<br>${fmtLat(a.lat)} ${fmtLon(a.lon)}`,
      x, y,
    );
  });

  /* ── framing: seed yaw so the first plate's bbox faces the camera ── */
  const drag = dragController(canvas, 0.2);
  if (plates[0] && plates[0].bbox) {
    const [lonW, , lonE] = plates[0].bbox;
    drag.s.yaw = -(((lonW + lonE) / 2 + 90) * Math.PI) / 180;
  }

  /* ── frame loop ── */
  let bootMs = -1, lastT = 0;
  let settleDone = false;
  return {
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    },
    frame(tMs: number) {
      if (bootMs < 0) bootMs = tMs;
      const dt = lastT ? Math.min(64, tMs - lastT) : 16;
      lastT = tMs;
      const since = (tMs - bootMs) / 1000;

      // ONE ambient motion: idle globe spin (orbitIdle) when not dragging
      if (!drag.s.dragging) drag.s.yaw += 0.0018;
      group.rotation.y = drag.s.yaw;
      group.rotation.x = drag.s.pitch;

      // arrow settle — each grows 0→full, fastest first, then FREEZES (static field)
      if (!settleDone) {
        let allDone = true;
        for (const pp of perPlate) {
          for (const pc of pp.pieces) {
            const active = since >= pc.delay;
            if (active && pc.cur < 0.999) { pc.cur += (1 - pc.cur) * Math.min(1, 8 * (dt / 1000)); allDone = false; }
            else if (pc.cur < 0.999) allDone = false;
            writePiece(pc, pp.arr, pc.cur);
          }
          pp.geo.attributes.position.needsUpdate = true;
        }
        if (allDone && since > 0.2) settleDone = true;
      }

      // boundary sweep (dashoffset draw) over 1000 ms once the asset resolves
      if (boundaryBootMs === -1) boundaryBootMs = tMs;
      if (boundaryBootMs >= 0) {
        const sw = Math.min(1, (tMs - boundaryBootMs) / 1000);
        for (const b of boundaryMeshes) b.geo.setDrawRange(0, Math.floor(sw * b.total));
      }

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() {
      drag.dispose(); picker.dispose(); tooltip.dispose(); labels.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
