/* ============================================================================
   PARALLAX — `terrain-relief` scene (earth · FLAGSHIP + world signature).
   Blueprint: docs/design/blueprints/earth/terrain-relief.md — this file
   implements it 1:1; the blueprint is the contract. Math: terrain.ts only.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).

   The DEM tile is rebuilt as line-art: contour rings (marching squares) +
   ridgelines (crest network), displaced to true elevation on a centered plane.
   `setState('rest' | 'exaggerate')` lerps every vertex Y between the rest and
   the exaggerated vertical scale (the ONLY thing state changes; horizontal
   scale is fixed and true). The DEM JSON is fetched inside the builder on boot.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import {
  decodeDEM, contourPolylines, ridgelines, autoInterval, tileAspect,
  fmtElev, fmtCoord, type DEM, type Contour, type Ridge,
} from '../terrain';
import { makeOrbitControls, makePicker, makeTooltip } from '../helpers';
import { makeLabels } from './globe';

/* Plane constants (blueprint §4 "Scene"). */
const SPAN_X = 3.0;      // scene units, always (horizontal is fixed + true)
const SPAN_Y = 0.9;      // relief height unit (× EX)
const CONTOUR_PROUD = 0; // contours sit at true elevation
const RIDGE_PROUD = 0.006; // ridges drawn slightly proud, ON the crests

interface PeakRec {
  name: string;
  lat: number;
  lon: number;
  elev_m: number;
  col: number;        // fractional grid col/row (for Y recompute on EX change)
  row: number;
  normH: number;      // normalized height [0..1]
  world: any;         // Vector3 LOCAL anchor at the surface (picking distance)
  label: any;         // mutable Vector3 shared with the label layer
  el: HTMLElement | null; // the label DOM node (hoverLift ×1.15)
}

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const ink = new THREE.Color(colors.ink);
  const paper = new THREE.Color(colors.paper);
  const accent = new THREE.Color(colors.accent);
  // --accent-alt (USGS brown) / --accent-deep injected by the component into the
  // payload (blueprint §6); fall back to a computed-style read, then muted.
  const safeColor = (raw: string | undefined, fallback: any) =>
    raw && /^(#|rgb|hsl)/.test(String(raw).trim()) ? new THREE.Color(String(raw).trim()) : fallback.clone();
  const cs = getComputedStyle(mount);
  const alt = safeColor(data._altColor || cs.getPropertyValue('--accent-alt'), new THREE.Color(colors.muted));

  const disposables: any[] = [];

  /* ── EX (vertical exaggeration) resolution (blueprint §3) ── */
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const EX_REST = clamp(typeof data.exaggeration === 'number' ? data.exaggeration : 1.8, 1, 12);
  const hasToggle = typeof data.exaggerateTo === 'number';
  const EX_EXAG = hasToggle ? clamp(data.exaggerateTo, EX_REST + 1, 12) : EX_REST;

  /* ── state (rest ↔ exaggerate): only Y scale changes ── */
  let exTarget = EX_REST;   // where we're lerping to
  let exCur = EX_REST;      // current live EX
  function setState(name: string) {
    exTarget = name === 'exaggerate' && hasToggle ? EX_EXAG : EX_REST;
  }

  /* ── an empty handle used if the DEM is missing/bad (blueprint §11: skip) ── */
  const noop = {
    resize() {}, frame() {}, setState() {},
    dispose() { renderer.dispose(); },
  };

  /* the live scene is assembled asynchronously after the DEM fetch; until then
     resize/frame are buffered by these mutable refs. */
  let ready = false;
  let dem: DEM | null = null;
  let interval = 0;
  let aspect = 1;
  let SPAN_Z = SPAN_X;
  let contours: Contour[] = [];
  let ridges: Ridge[] = [];
  let seaLevel = false;
  const peaks: PeakRec[] = [];
  // filled relief surface (hypsometric tint × baked hillshade — review R2-3);
  // rescales with EX alongside the lines.
  let surface: { attr: any; nh: Float32Array; proud: number } | null = null;

  // geometry we mutate every frame on a state switch
  interface LineSet {
    positions: Float32Array;    // flat xyz, y computed at rest EX
    normHeights: Float32Array;  // per-vertex normalized height [0..1] for Y recompute
    proud: number;              // Y offset baked into this set (ridges sit proud)
    isRidge: boolean;           // ridge set draws last in the boot sweep
    attr: any;                  // BufferAttribute
    geo: any;
  }
  const lineSets: LineSet[] = [];

  let controls: any = null;
  let picker: any = null;
  let tooltip: any = null;
  let labels: any = null;

  // pending resize (if resize fires before the DEM resolves)
  let pendW = 0, pendH = 0, pendDpr = 1;

  const normHeight = (elev_m: number): number => {
    if (!dem) return 0;
    const span = dem.maxM - dem.minM;
    return span > 1e-9 ? (elev_m - dem.minM) / span : 0;
  };
  // world XYZ for a grid pt at its true elevation (Y uses the given EX)
  const gridToWorld = (col: number, row: number, elev_m: number, ex: number, proud: number, out: any) => {
    if (!dem) return out.set(0, 0, 0);
    const x = (col / (dem.w - 1) - 0.5) * SPAN_X;
    const z = (row / (dem.h - 1) - 0.5) * SPAN_Z;
    const y = normHeight(elev_m) * SPAN_Y * ex + proud;
    return out.set(x, y, z);
  };

  function assemble(demJson: any) {
    try {
      dem = decodeDEM(demJson);
    } catch { return false; }
    if (!dem || !(dem.w > 1) || !(dem.h > 1)) return false;

    interval = typeof data.contourInterval_m === 'number' && data.contourInterval_m > 0
      ? data.contourInterval_m
      : autoInterval(dem.minM, dem.maxM);
    aspect = tileAspect(dem.latN, dem.latS, dem.lonW, dem.lonE);
    SPAN_Z = SPAN_X * aspect;

    contours = contourPolylines(dem, interval);
    ridges = ridgelines(dem);
    seaLevel = typeof data.seaLevel === 'boolean' ? data.seaLevel : dem.minM < 0;

    buildSurface();   // the filled relief base — contours + ridges draw on top

    const tmp = new THREE.Vector3();

    /* ── contour lines: 2 merged geometries (index / intermediate), 1 sea ── */
    const idxPos: number[] = [], idxNorm: number[] = [];
    const intPos: number[] = [], intNorm: number[] = [];
    const seaPos: number[] = [], seaNorm: number[] = [];
    const pushLine = (pos: number[], norm: number[], pts: { col: number; row: number }[], level: number) => {
      // one polyline → (n-1) segments as line pairs
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        gridToWorld(a.col, a.row, level, EX_REST, CONTOUR_PROUD, tmp);
        pos.push(tmp.x, tmp.y, tmp.z); norm.push(normHeight(level));
        gridToWorld(b.col, b.row, level, EX_REST, CONTOUR_PROUD, tmp);
        pos.push(tmp.x, tmp.y, tmp.z); norm.push(normHeight(level));
      }
    };
    for (const c of contours) {
      if (seaLevel && c.level_m === 0) { pushLine(seaPos, seaNorm, c.pts, 0); continue; }
      if (c.isIndex) pushLine(idxPos, idxNorm, c.pts, c.level_m);
      else pushLine(intPos, intNorm, c.pts, c.level_m);
    }

    const mkLineSegments = (
      pos: number[], norm: number[], color: any, opacity: number,
      proud: number, isRidge: boolean,
    ) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(pos);
      const attr = new THREE.Float32BufferAttribute(positions, 3);
      geo.setAttribute('position', attr);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const seg = new THREE.LineSegments(geo, mat);
      group.add(seg);
      disposables.push(geo, mat);
      lineSets.push({ positions, normHeights: new Float32Array(norm), proud, isRidge, attr, geo });
      return seg;
    };

    if (intPos.length) mkLineSegments(intPos, intNorm, ink, 0.22, CONTOUR_PROUD, false);
    if (idxPos.length) mkLineSegments(idxPos, idxNorm, ink, 0.42, CONTOUR_PROUD, false);
    if (seaPos.length) mkLineSegments(seaPos, seaNorm, accent, 0.9, CONTOUR_PROUD, false);

    /* ── ridgelines: one merged geometry, brown, drawn proud ── */
    const rPos: number[] = [], rNorm: number[] = [];
    for (const rd of ridges) {
      for (let i = 0; i < rd.pts.length - 1; i++) {
        const a = rd.pts[i], b = rd.pts[i + 1];
        const ea = dem.elevAt(Math.round(a.col), Math.round(a.row));
        const eb = dem.elevAt(Math.round(b.col), Math.round(b.row));
        gridToWorld(a.col, a.row, ea, EX_REST, RIDGE_PROUD, tmp);
        rPos.push(tmp.x, tmp.y, tmp.z); rNorm.push(normHeight(ea));
        gridToWorld(b.col, b.row, eb, EX_REST, RIDGE_PROUD, tmp);
        rPos.push(tmp.x, tmp.y, tmp.z); rNorm.push(normHeight(eb));
      }
    }
    if (rPos.length) mkLineSegments(rPos, rNorm, alt, 0.85, RIDGE_PROUD, true);

    /* ── base occluder slab: paper skirt + underside so far-side lines hide ── */
    buildOccluder();

    /* ── survey-plate frame ring (ink @ 0.30) around the base perimeter ── */
    {
      const y = 0.001;
      const hx = SPAN_X / 2, hz = SPAN_Z / 2;
      const corners = [
        [-hx, y, -hz], [hx, y, -hz], [hx, y, hz], [-hx, y, hz], [-hx, y, -hz],
      ];
      const pts = corners.map((c) => new THREE.Vector3(c[0], c[1], c[2]));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.30 });
      group.add(new THREE.Line(geo, mat));
      disposables.push(geo, mat);
    }

    /* ── labels: peaks (data pri 2) + four corner coords (country pri 0) ── */
    labels = makeLabels(THREE, mount);
    buildPeaks();
    buildCornerCoords();
    buildContourLabels();

    return true;
  }

  /* Filled relief surface (review R2-3): a DEM heightfield mesh whose vertex
     colors bake a hypsometric elevation tint (green→tan→brown→snow) × a fake
     directional hillshade computed from the local slope. MeshBasic, no runtime
     light — it still prints as an editorial relief plate; the contour + ridge
     lines sit just above it. */
  function buildSurface() {
    if (!dem) return;
    const w = dem.w, h = dem.h, N = w * h;
    const positions = new Float32Array(N * 3);
    const colorArr = new Float32Array(N * 3);
    const nh = new Float32Array(N);
    const wv = new THREE.Vector3();
    const stops: [number, any][] = [
      [0.00, new THREE.Color('#2f5a40')], // deep valley green
      [0.30, new THREE.Color('#6f9159')], // green slope
      [0.55, new THREE.Color('#bda66d')], // tan / scrub
      [0.78, new THREE.Color('#9a6b42')], // USGS rock brown
      [0.92, new THREE.Color('#cdbca0')], // bare high rock
      [1.00, new THREE.Color('#f2ede2')], // snow
    ];
    const rampColor = (t: number, out: any) => {
      let i = 0;
      while (i < stops.length - 1 && t > stops[i + 1][0]) i++;
      const s0 = stops[i], s1 = stops[Math.min(i + 1, stops.length - 1)];
      const f = s1[0] > s0[0] ? (t - s0[0]) / (s1[0] - s0[0]) : 0;
      return out.copy(s0[1]).lerp(s1[1], clamp(f, 0, 1));
    };
    const dx = SPAN_X / (w - 1), dz = SPAN_Z / (h - 1);
    const yAt = (c: number, r: number) => normHeight(dem!.elevAt(c, r)) * SPAN_Y * EX_REST;
    const L = new THREE.Vector3(-0.55, 0.78, 0.42).normalize();
    const nrm = new THREE.Vector3();
    const col = new THREE.Color();
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const idx = r * w + c;
        const e = dem.elevAt(c, r);
        const t = normHeight(e);
        gridToWorld(c, r, e, EX_REST, -0.006, wv); // just under the contour lines
        positions[idx * 3] = wv.x; positions[idx * 3 + 1] = wv.y; positions[idx * 3 + 2] = wv.z;
        nh[idx] = t;
        const cl = Math.max(0, c - 1), cR = Math.min(w - 1, c + 1);
        const ru = Math.max(0, r - 1), rd = Math.min(h - 1, r + 1);
        const gx = (yAt(cR, r) - yAt(cl, r)) / (((cR - cl) || 1) * dx);
        const gz = (yAt(c, rd) - yAt(c, ru)) / (((rd - ru) || 1) * dz);
        nrm.set(-gx, 1, -gz).normalize();
        // gentle baked shade — soft range so DEM quantization steps don't quilt
        const mult = 0.74 + 0.30 * clamp(nrm.dot(L), 0, 1);
        rampColor(t, col);
        colorArr[idx * 3] = Math.min(1, col.r * mult);
        colorArr[idx * 3 + 1] = Math.min(1, col.g * mult);
        colorArr[idx * 3 + 2] = Math.min(1, col.b * mult);
      }
    }
    const indices: number[] = [];
    for (let r = 0; r < h - 1; r++) {
      for (let c = 0; c < w - 1; c++) {
        const a = r * w + c, b = a + 1, d = a + w, e2 = d + 1;
        indices.push(a, d, b, b, d, e2);
      }
    }
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.Float32BufferAttribute(positions, 3);
    geo.setAttribute('position', attr);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colorArr, 3));
    geo.setIndex(indices);
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(geo, mat));
    disposables.push(geo, mat);
    surface = { attr, nh, proud: -0.006 };
  }

  function buildOccluder() {
    if (!dem) return;
    const hx = SPAN_X / 2, hz = SPAN_Z / 2;
    const yBot = -0.12;
    const tmp = new THREE.Vector3();
    // sample the perimeter's surface height so the skirt hugs the real edge
    const topEdge: any[] = [];
    const w = dem.w, h = dem.h;
    const edgeCells: [number, number][] = [];
    for (let c = 0; c < w; c++) edgeCells.push([c, 0]);            // north
    for (let r = 1; r < h; r++) edgeCells.push([w - 1, r]);       // east
    for (let c = w - 2; c >= 0; c--) edgeCells.push([c, h - 1]);  // south
    for (let r = h - 2; r >= 1; r--) edgeCells.push([0, r]);      // west
    for (const [c, r] of edgeCells) {
      gridToWorld(c, r, dem.elevAt(c, r), EX_REST, 0, tmp);
      topEdge.push(tmp.clone());
    }
    // skirt: quad strip from each top-edge vertex down to yBot
    const pos: number[] = [];
    for (let i = 0; i < topEdge.length - 1; i++) {
      const a = topEdge[i], b = topEdge[i + 1];
      const aB = new THREE.Vector3(a.x, yBot, a.z);
      const bB = new THREE.Vector3(b.x, yBot, b.z);
      // two triangles (a, aB, b) (b, aB, bB)
      pos.push(a.x, a.y, a.z, aB.x, aB.y, aB.z, b.x, b.y, b.z);
      pos.push(b.x, b.y, b.z, aB.x, aB.y, aB.z, bB.x, bB.y, bB.z);
    }
    const skirtGeo = new THREE.BufferGeometry();
    skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    skirtGeo.computeVertexNormals();
    const skirtMat = new THREE.MeshBasicMaterial({ color: paper, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(skirtGeo, skirtMat));
    // faint ink edge on the skirt top (the survey-plate cut line)
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(topEdge);
    const edgeMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.30 });
    group.add(new THREE.Line(edgeGeo, edgeMat));
    // flat underside plane at yBot
    const uGeo = new THREE.PlaneGeometry(SPAN_X, SPAN_Z);
    const uMat = new THREE.MeshBasicMaterial({ color: paper, side: THREE.DoubleSide });
    const under = new THREE.Mesh(uGeo, uMat);
    under.rotation.x = -Math.PI / 2;
    under.position.y = yBot;
    group.add(under);
    disposables.push(skirtGeo, skirtMat, edgeGeo, edgeMat, uGeo, uMat);
  }

  function buildPeaks() {
    if (!dem || !labels) return;
    const raw: any[] = Array.isArray(data.peaks) ? data.peaks.slice(0, 6) : [];
    for (const p of raw) {
      if (typeof p?.lat !== 'number' || typeof p?.lon !== 'number') continue;
      const elev = typeof p.elev_m === 'number' ? p.elev_m : dem.elevLL(p.lat, p.lon);
      // grid position of the peak (north = row 0)
      const col = clamp(((p.lon - dem.lonW) / (dem.lonE - dem.lonW)) * (dem.w - 1), 0, dem.w - 1);
      const row = clamp(((dem.latN - p.lat) / (dem.latN - dem.latS)) * (dem.h - 1), 0, dem.h - 1);
      const world = new THREE.Vector3();
      gridToWorld(col, row, elev, EX_REST, 0, world);
      const label = new THREE.Vector3(world.x, world.y + 0.05, world.z);
      labels.add(`${p.name} · ${fmtElev(elev)} m`, label, 'data', 2);
      peaks.push({
        name: p.name, lat: p.lat, lon: p.lon, elev_m: elev,
        col, row, normH: normHeight(elev), world, label, el: null,
      });
    }
    // capture the peak label DOM nodes (added first, in order) for hoverLift.
    const nodes = mount.querySelectorAll<HTMLElement>('.viz3d__label--data');
    peaks.forEach((pk, i) => { pk.el = nodes[i] || null; });
  }

  function buildCornerCoords() {
    if (!dem || !labels) return;
    const hx = SPAN_X / 2, hz = SPAN_Z / 2;
    const y = 0.002;
    // NW/NE/SW/SE — north (row 0) is at −z in world space
    const corners: [number, number, number, number][] = [
      [dem.latN, dem.lonW, -hx, -hz], // NW
      [dem.latN, dem.lonE, hx, -hz],  // NE
      [dem.latS, dem.lonW, -hx, hz],  // SW
      [dem.latS, dem.lonE, hx, hz],   // SE
    ];
    for (const [lat, lon, x, z] of corners) {
      labels.add(fmtCoord(lat, lon), new THREE.Vector3(x, y, z), 'country', 0);
    }
  }

  function buildContourLabels() {
    if (!dem || !labels) return;
    // at most 4 elevation labels on the longest index loops (blueprint §4 Labels)
    const idx = contours.filter((c) => c.isIndex && !(seaLevel && c.level_m === 0));
    idx.sort((a, b) => b.pts.length - a.pts.length);
    const tmp = new THREE.Vector3();
    for (const c of idx.slice(0, 4)) {
      const mid = c.pts[Math.floor(c.pts.length / 2)];
      gridToWorld(mid.col, mid.row, c.level_m, EX_REST, 0.004, tmp);
      labels.add(`${fmtElev(c.level_m)} m`, tmp.clone(), 'country', 1);
    }
  }

  /* recompute every line vertex Y for the current EX (state switch / settle) —
     the ONLY thing EX changes; horizontal (X/Z) is fixed and true. */
  function applyEX(ex: number) {
    for (const ls of lineSets) {
      const pos = ls.positions;
      const nh = ls.normHeights;
      for (let i = 0; i < nh.length; i++) {
        pos[i * 3 + 1] = nh[i] * SPAN_Y * ex + ls.proud;
      }
      ls.attr.needsUpdate = true;
    }
    // the filled relief surface rides EX alongside the lines
    if (surface) {
      const pos = surface.attr.array as Float32Array;
      const nh = surface.nh;
      for (let i = 0; i < nh.length; i++) pos[i * 3 + 1] = nh[i] * SPAN_Y * ex + surface.proud;
      surface.attr.needsUpdate = true;
    }
    // peaks + their label anchors ride the surface up/down with EX
    for (const p of peaks) {
      const y = p.normH * SPAN_Y * ex;
      p.world.y = y;
      p.label.y = y + 0.05;
    }
  }

  /* ── boot: fetch DEM, assemble, wire controls/picker/tooltip ── */
  const demUrl: string = typeof data.dem === 'string' ? data.dem : '';
  if (!demUrl) { return noop; }

  fetch(demUrl)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((json) => {
      const ok = assemble(json);
      if (!ok) return;

      controls = makeOrbitControls(canvas, {
        startPitch: 0.62, minZoom: 0.48, maxZoom: 2.6, autoRotate: false,
      });
      tooltip = makeTooltip(mount);

      // full-area invisible hit-plane for peak picking (blueprint §8)
      const hitGeo = new THREE.PlaneGeometry(SPAN_X * 1.4, SPAN_Z * 1.4);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitPlane = new THREE.Mesh(hitGeo, hitMat);
      hitPlane.rotation.x = -Math.PI / 2;
      group.add(hitPlane);
      disposables.push(hitGeo, hitMat);

      picker = makePicker(THREE, camera, canvas, [hitPlane], (obj, _inst, x, y) => {
        hoverPeak = -1;
        // nearest peak to the ray/plane hit point, in the group's LOCAL XZ plane
        // (peaks[].world are local anchors; lastHitPoint is worldToLocal'd below)
        const hp = obj ? lastHitPoint : null;
        if (!hp || !peaks.length) { tooltip.hide(); return; }
        let best = -1, bestD = Infinity;
        for (let i = 0; i < peaks.length; i++) {
          const dxz = Math.hypot(peaks[i].world.x - hp.x, peaks[i].world.z - hp.z);
          if (dxz < bestD) { bestD = dxz; best = i; }
        }
        // 0.12-UV radius ≈ 0.12·SPAN in world units (blueprint §8)
        const radius = 0.12 * Math.max(SPAN_X, SPAN_Z);
        if (best >= 0 && bestD <= radius) {
          hoverPeak = best;
          const p = peaks[best];
          tooltip.show(
            `<b>${p.name}</b><br>${fmtElev(p.elev_m)} m · ${fmtCoord(p.lat, p.lon)}`,
            x, y,
          );
        } else {
          tooltip.hide();
        }
      });

      // capture the hit-plane intersection point each pointermove for §8 picking
      const pickRay = new THREE.Raycaster();
      const pickNdc = new THREE.Vector2();
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        pickNdc.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        );
        pickRay.setFromCamera(pickNdc, camera);
        const hits = pickRay.intersectObject(hitPlane, false);
        lastHitPoint = hits[0] ? group.worldToLocal(hits[0].point.clone()) : null;
      };
      canvas.addEventListener('pointermove', onMove, { passive: true });
      pointerMoveHandler = onMove;

      ready = true;
      if (pendW > 0 && pendH > 0) doResize(pendW, pendH, pendDpr);
    })
    .catch(() => { /* leave the static fallback in place (blueprint §11) */ });

  let hoverPeak = -1;
  let lastHitPoint: any = null;
  let pointerMoveHandler: any = null;

  function doResize(w: number, h: number, dpr: number) {
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;

  return {
    resize(w: number, h: number, dpr: number) {
      pendW = w; pendH = h; pendDpr = dpr;
      if (ready) doResize(w, h, dpr);
    },
    frame(tMs: number) {
      if (!ready) { renderer.render(scene, camera); return; }
      if (bootMs < 0) bootMs = tMs;
      const dt = lastT ? Math.min(64, tMs - lastT) : 16;
      lastT = tMs;
      const since = tMs - bootMs;
      const kSettle = Math.min(1, (8 * dt) / 1000); // settle constant (motion.md)

      controls.tick(dt);
      // idle dolly sway — the ground doesn't spin (blueprint §4): ≤±3° yaw sway
      const sway = controls.s.dragging ? 0 : 0.045 * Math.sin(tMs / 11000);
      group.rotation.y = controls.s.yaw + sway;
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(0, 2.05 * z, 2.75 * z);
      camera.lookAt(0, 0.28, 0);

      // boot sweep: reveal contour vertices low→high, ridges last (blueprint §5)
      // (drawRange advance, staggered by elevation band; total ≤ 1.6 s)
      applyDrawSweep(since);

      // stateSwitch: settle EX toward target (≤600 ms, no hard cut)
      if (Math.abs(exCur - exTarget) > 1e-4) {
        exCur += (exTarget - exCur) * kSettle;
        if (Math.abs(exCur - exTarget) <= 1e-4) exCur = exTarget;
        applyEX(exCur);
        liveEX = exCur;
        pushChip();
      }

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);

      // hoverLift: the picked peak's label scales ×1.15 (no scene dimming —
      // line-art on paper, dimming reads as flicker; blueprint §5). Others let
      // the base CSS transform reassert.
      for (let i = 0; i < peaks.length; i++) {
        const el = peaks[i].el;
        if (!el) continue;
        el.style.transform = i === hoverPeak
          ? 'translate(-50%, -130%) scale(1.15)'
          : '';
      }
    },
    setState,
    dispose() {
      if (pointerMoveHandler) canvas.removeEventListener('pointermove', pointerMoveHandler);
      if (controls) controls.dispose();
      if (picker) picker.dispose();
      if (tooltip) tooltip.dispose();
      if (labels) labels.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };

  /* ── boot sweep helper: per-lineSet drawRange advance, valleys→peaks ── */
  let liveEX = EX_REST;
  function applyDrawSweep(since: number) {
    // contours draw over 1000 ms staggered by band; ridges 250 ms later, 700 ms
    for (const ls of lineSets) {
      const total = ls.normHeights.length; // vertex count
      if (!total) continue;
      const start = ls.isRidge ? 250 : 0;
      const dur = ls.isRidge ? 700 : 1000;
      const t = Math.max(0, Math.min(1, (since - start) / dur));
      // ease-out so valleys fill first; reveal proportional vertices. Snap to an
      // even count so LineSegments pairs stay intact (no dangling half-segment).
      const eased = 1 - (1 - t) * (1 - t);
      let count = Math.max(0, Math.min(total, Math.round(eased * total)));
      count -= count % 2;
      ls.geo.setDrawRange(0, count);
    }
  }

  /* ── mirror the live EX into the component chip (blueprint §3 / §8) ── */
  function pushChip() {
    const disp = Math.round(liveEX * 10) / 10;
    mount.setAttribute('data-viz3d-ex', String(disp));
  }
};
