/* ============================================================================
   PARALLAX — `storm-track` scene (earth · WebGL · extends the shared globe).
   Blueprint: docs/design/blueprints/earth/storm-track.md — this file implements
   it 1:1; the blueprint is the contract. Takes THREE as a PARAMETER; never
   imports three (lazy-chunk isolation).

   One tropical cyclone's best-track polyline drawn on the shared country globe,
   each SEGMENT coloured by the Saffir-Simpson category of its STARTING fix, so
   the arc changes colour as the storm intensifies. Fix markers grow with wind;
   landfall fixes carry an ink ring; the peak fix carries the one sanctioned glow
   (glowSprite, CANON §4 — NO bloom). Drag spins the globe; hover a fix reads out
   its exact wind / category / date. NO setState (single-state record).

   The Saffir-Simpson ramp (`saffirSimpson` / `SAFFIR_RAMP`) is exported and is
   the SINGLE source of the encoding — the build-time fallback in StormTrack.astro
   imports the same helper, so the ramp can never disagree between live + print.
   Category is DERIVED from wind here; it is never authored in the data.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController, latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';
import { greatCircle } from '../kepler';
import { makePicker, makeTooltip, glowSprite } from '../helpers';

/* ── Saffir-Simpson ramp — THE declared fixed encoding (blueprint §4 + §6) ──── */
export interface SaffirBand { key: string; cat: string; label: string; minKt: number; maxKt: number; color: string; }
export const SAFFIR_RAMP: SaffirBand[] = [
  { key: 'TD', cat: 'TD', label: 'Trop. depression', minKt: 0,   maxKt: 33,  color: '#5aa9e6' },
  { key: 'TS', cat: 'TS', label: 'Tropical storm',   minKt: 34,  maxKt: 63,  color: '#54d669' },
  { key: '1',  cat: '1',  label: 'Category 1',        minKt: 64,  maxKt: 82,  color: '#ffd24d' },
  { key: '2',  cat: '2',  label: 'Category 2',        minKt: 83,  maxKt: 95,  color: '#ffa600' },
  { key: '3',  cat: '3',  label: 'Category 3',        minKt: 96,  maxKt: 112, color: '#ff8c00' },
  { key: '4',  cat: '4',  label: 'Category 4',        minKt: 113, maxKt: 136, color: '#ff4d3d' },
  { key: '5',  cat: '5',  label: 'Category 5',        minKt: 137, maxKt: 999, color: '#b3005e' },
];
/** wind_kt → { cat, color } on the fixed NHC ramp. Single source of truth. */
export function saffirSimpson(windKt: number): { cat: string; color: string } {
  const w = Number.isFinite(windKt) ? windKt : 0;
  for (const b of SAFFIR_RAMP) if (w <= b.maxKt) return { cat: b.cat, color: b.color };
  return { cat: '5', color: '#b3005e' };
}
/** "Cat 3" / "TD" / "TS" display form of a derived category. */
export function catLabel(cat: string): string {
  return cat === 'TD' || cat === 'TS' ? cat : `Cat ${cat}`;
}

/* ── small shared formatters (also mirrored in the .astro fallback) ─────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${hh}:${mm}Z`;
}
const latH = (lat: number) => `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}`;
const lonH = (lon: number) => `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;

interface Fix { t: string; lat: number; lon: number; wind_kt: number; landfall?: boolean; }
interface Storm { name: string; fixes: Fix[]; }

const R = 1.4;               // scene sphere radius (matches routeGlobe/dataGlobe)
const TRACK_R = R * 1.02;    // just above the coastline layer (R·1.002)
const DRAW_MS = 1400;        // sweep budget (blueprint §5, ≤1.6 s total)
const easeOut = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
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

  /* ── data ── */
  const storms: Storm[] = (Array.isArray(data.storms) ? data.storms : [])
    .filter((s: any) => s && Array.isArray(s.fixes) && s.fixes.length);
  const smooth: boolean = data.smooth !== false; // default true

  /* liftedPoint: a fix's lat/lon at TRACK_R, bulged by 1 + 0.02·sin(πt) (§4). */
  const liftedPoint = (lat: number, lon: number, t: number) =>
    latLon(THREE, lat, lon, TRACK_R * (1 + 0.02 * Math.sin(Math.PI * t)));

  /* ── flat fix registry (markers, picking, labels) + per-storm peak ── */
  interface FixMeta {
    storm: string; cat: string; wind: number; t: string; lat: number; lon: number;
    landfall: boolean; isPeak: boolean; color: string; pos: any; baseR: number; revealFrac: number;
  }
  const fixMeta: FixMeta[] = [];
  const peaks: { pos: any; color: string; revealFrac: number; strongest: boolean }[] = [];
  const landfallCentres: { pos: any; r: number }[] = [];

  let strongestWind = -Infinity, strongestStormIdx = -1;
  storms.forEach((s, si) => { for (const f of s.fixes) if (f.wind_kt > strongestWind) { strongestWind = f.wind_kt; strongestStormIdx = si; } });

  const labels = makeLabels(THREE, mount);
  const trackLines: { line: any; geoV: number }[] = [];

  /* mean longitude (unit-vector average) → seed the opening orientation (R7). */
  let mx = 0, my = 0, mn = 0;

  storms.forEach((storm, stormIdx) => {
    const fixes = storm.fixes;
    // peak fix index (max wind; first on ties)
    let peakIdx = 0;
    for (let i = 1; i < fixes.length; i++) if (fixes[i].wind_kt > fixes[peakIdx].wind_kt) peakIdx = i;

    // ── build the intensity-coloured polyline (one BufferGeometry / storm) ──
    const positions: number[] = [];
    const cols: number[] = [];
    const vertexOfFix: number[] = new Array(fixes.length).fill(0);
    const col = new THREE.Color();
    let v = 0;
    const pushV = (p: any, hex: string) => {
      positions.push(p.x, p.y, p.z);
      col.set(hex);
      cols.push(col.r, col.g, col.b);
      v++;
    };

    if (fixes.length === 1) {
      const f = fixes[0];
      pushV(liftedPoint(f.lat, f.lon, 0), saffirSimpson(f.wind_kt).color);
      vertexOfFix[0] = 0;
    } else {
      for (let i = 0; i < fixes.length - 1; i++) {
        const a = fixes[i], b = fixes[i + 1];
        const segColor = saffirSimpson(a.wind_kt).color; // starting-fix category (§4)
        const pts = smooth
          ? greatCircle({ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }, 8)
          : [{ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }];
        const startK = i === 0 ? 0 : 1; // skip the join vertex shared with the previous segment
        for (let k = startK; k < pts.length; k++) {
          const t = k / (pts.length - 1);
          if (i === 0 && k === 0) vertexOfFix[0] = v;
          pushV(liftedPoint(pts[k].lat, pts[k].lon, t), segColor);
        }
        vertexOfFix[i + 1] = v - 1; // fix i+1 sits at this segment's last (on-surface) vertex
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.setDrawRange(0, 0); // swept in over DRAW_MS
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1, linewidth: 2.5 });
    const line = new THREE.Line(geo, mat);
    group.add(line);
    disposables.push(geo, mat);
    trackLines.push({ line, geoV: v });

    const totalV = Math.max(1, v - 1);
    // ── register fixes (markers / picking / labels) ──
    fixes.forEach((f, i) => {
      const { cat, color } = saffirSimpson(f.wind_kt);
      const pos = latLon(THREE, f.lat, f.lon, TRACK_R);
      const revealFrac = vertexOfFix[i] / totalV;
      const isPeak = i === peakIdx;
      fixMeta.push({
        storm: storm.name, cat, wind: f.wind_kt, t: f.t, lat: f.lat, lon: f.lon,
        landfall: !!f.landfall, isPeak, color, pos, baseR: 0.018 + 0.03 * (f.wind_kt / 160), revealFrac,
      });
      if (f.landfall) landfallCentres.push({ pos, r: (0.018 + 0.03 * (f.wind_kt / 160)) * 1.9 });
      // running mean of positions (for the opening orientation)
      const phi = f.lat * Math.PI / 180, lam = f.lon * Math.PI / 180;
      mx += Math.cos(phi) * Math.cos(lam); my += Math.cos(phi) * Math.sin(lam); mn++;
    });

    // ── labels: storm name (Fraunces), PEAK + LANDFALL (mono) ──
    const f0 = fixes[0];
    labels.add(storm.name, latLon(THREE, f0.lat, f0.lon, R * 1.08), 'storm', 2);
    const pf = fixes[peakIdx];
    labels.add(`PEAK · ${catLabel(saffirSimpson(pf.wind_kt).cat)} · ${pf.wind_kt} kt`,
      latLon(THREE, pf.lat, pf.lon, R * 1.05), 'data', 2);
    fixes.forEach((f) => { if (f.landfall) labels.add('LANDFALL', latLon(THREE, f.lat, f.lon, R * 1.05), 'data', 1); });

    // ── peak glow (the one sanctioned glow) ──
    const pk = fixes[peakIdx];
    const pkColor = saffirSimpson(pk.wind_kt).color;
    const sprite = glowSprite(THREE, pkColor, 0.14);
    sprite.position.copy(latLon(THREE, pk.lat, pk.lon, TRACK_R));
    sprite.material.opacity = 0;
    sprite.scale.set(0.0001, 0.0001, 1);
    group.add(sprite);
    disposables.push(...(sprite.userData.disposables || []));
    peaks.push({ pos: sprite, color: pkColor, revealFrac: vertexOfFix[peakIdx] / totalV, strongest: stormIdx === strongestStormIdx });
  });

  // country labels ground the basin (priority 0) — dropped under 420px (§4).
  if (mount.clientWidth >= 420) {
    loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });
  }

  /* ── fix markers — ONE InstancedMesh (1 draw call, per-instance colour+scale) ── */
  const N = fixMeta.length;
  const sphereGeo = new THREE.SphereGeometry(1, 14, 14);
  const markerMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.98 });
  const markers = new THREE.InstancedMesh(sphereGeo, markerMat, Math.max(1, N));
  const dummy = new THREE.Object3D();
  const cc = new THREE.Color();
  const curScale = new Float32Array(N);
  for (let i = 0; i < N; i++) { cc.set(fixMeta[i].color); markers.setColorAt(i, cc); }
  if (markers.instanceColor) markers.instanceColor.needsUpdate = true;
  group.add(markers);
  disposables.push(sphereGeo, markerMat);

  /* invisible pick spheres (radius 0.03) — nearest hit wins (§8) */
  const pickGeo = new THREE.SphereGeometry(0.03, 8, 6);
  const pickMat = new THREE.MeshBasicMaterial({ visible: false });
  const pickMesh = new THREE.InstancedMesh(pickGeo, pickMat, Math.max(1, N));
  for (let i = 0; i < N; i++) {
    dummy.position.copy(fixMeta[i].pos);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    pickMesh.setMatrixAt(i, dummy.matrix);
  }
  pickMesh.instanceMatrix.needsUpdate = true;
  group.add(pickMesh);
  disposables.push(pickGeo, pickMat);

  /* ── landfall rings — merged into ONE mesh (1 draw call), ink @ 0.7 ── */
  if (landfallCentres.length) {
    const ringPos: number[] = [];
    const RSEG = 28;
    const up = new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion();
    const tmp = new THREE.Vector3();
    for (const lc of landfallCentres) {
      const nrm = lc.pos.clone().normalize();
      q.setFromUnitVectors(up, nrm);
      const inner = lc.r, outer = lc.r + 0.01;
      for (let k = 0; k < RSEG; k++) {
        const a0 = (k / RSEG) * Math.PI * 2, a1 = ((k + 1) / RSEG) * Math.PI * 2;
        const ci = [Math.cos(a0), Math.sin(a0)], cj = [Math.cos(a1), Math.sin(a1)];
        const p = (rad: number, c: number[]) => tmp.set(c[0] * rad, c[1] * rad, 0).applyQuaternion(q).add(lc.pos).clone();
        const i0 = p(inner, ci), o0 = p(outer, ci), i1 = p(inner, cj), o1 = p(outer, cj);
        ringPos.push(i0.x, i0.y, i0.z, o0.x, o0.y, o0.z, o1.x, o1.y, o1.z);
        ringPos.push(i0.x, i0.y, i0.z, o1.x, o1.y, o1.z, i1.x, i1.y, i1.z);
      }
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(ringPos, 3));
    const rm = new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false });
    group.add(new THREE.Mesh(rg, rm));
    disposables.push(rg, rm);
  }

  /* ── opening orientation: seed yaw so the storm faces the camera (R7) ── */
  const meanLon = mn ? Math.atan2(my, mx) * 180 / Math.PI : 0;
  const drag = dragController(canvas, 0.25);
  drag.s.yaw = -((meanLon + 90) * Math.PI) / 180;

  /* ── picking + tooltip ── */
  const tooltip = makeTooltip(mount);
  let hovered = -1;
  const picker = makePicker(THREE, camera, canvas, [pickMesh], (obj, inst, x, y) => {
    if (!obj || inst === undefined || inst < 0 || inst >= N) { hovered = -1; tooltip.hide(); return; }
    hovered = inst;
    const f = fixMeta[inst];
    const tags = (f.landfall ? ' · landfall' : '') + (f.isPeak ? ' · peak intensity' : '');
    tooltip.show(
      `<b>${f.storm}</b><br>${catLabel(f.cat)} · ${f.wind} kt<br>${fmtDate(f.t)} · ${latH(f.lat)} ${lonH(f.lon)}${tags}`,
      x, y,
    );
  });

  /* ── frame loop ── */
  let bootMs = -1, lastT = 0;
  return {
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    },
    frame(tMs: number) {
      if (bootMs < 0) bootMs = tMs;
      const dt = lastT ? Math.min(64, tMs - lastT) : 16;
      lastT = tMs;
      const since = tMs - bootMs;
      const drawFrac = easeOut(since / DRAW_MS);

      // idle rotation is the ONE ambient motion (blueprint §5)
      if (!drag.s.dragging) drag.s.yaw += 0.0018;
      group.rotation.y = drag.s.yaw;
      group.rotation.x = drag.s.pitch;

      // sweep each track's draw range
      for (const t of trackLines) {
        const count = Math.max(0, Math.floor(drawFrac * (t.geoV - 1)) + 1);
        t.line.geometry.setDrawRange(0, count);
      }

      // fix markers settle in as the draw front passes each (§5)
      const k = Math.min(1, 8 * (dt / 1000));
      for (let i = 0; i < N; i++) {
        const target = drawFrac >= fixMeta[i].revealFrac ? 1 : 0;
        curScale[i] += (target - curScale[i]) * k;
        dummy.position.copy(fixMeta[i].pos);
        const s = fixMeta[i].baseR * curScale[i] * (i === hovered ? 1.4 : 1);
        dummy.scale.setScalar(Math.max(1e-4, s));
        dummy.updateMatrix();
        markers.setMatrixAt(i, dummy.matrix);
      }
      markers.instanceMatrix.needsUpdate = true;

      // peak glow reveals last; only the strongest storm's peak pulses (§5)
      for (const pk of peaks) {
        const revealed = drawFrac >= pk.revealFrac;
        const g = (pk.pos.userData.g = (pk.pos.userData.g || 0) + (((revealed ? 1 : 0) - (pk.pos.userData.g || 0)) * k));
        const pulse = pk.strongest ? 0.775 + 0.225 * Math.sin((since / 2400) * Math.PI * 2) : 1;
        pk.pos.scale.set(0.14 * g, 0.14 * g, 1);
        pk.pos.material.opacity = 0.9 * g * pulse;
      }

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() {
      drag.dispose(); picker.dispose(); tooltip.dispose(); labels.dispose();
      markers.dispose(); pickMesh.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
