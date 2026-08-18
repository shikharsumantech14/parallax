/* ============================================================================
   PARALLAX — `packet-trace` scene (tech · FLAGSHIP · WebGL globe).
   Blueprint: docs/design/blueprints/tech/packet-trace.md — this file
   implements the globe half 1:1; the SVG latency-budget bar lives in the
   component (build-time). Math: packet.ts (greatCircleKm / cities / meanHopLon,
   all pure) + kepler.ts greatCircle() (arc points). Takes THREE as a parameter;
   never imports three (lazy-chunk contract).

   Extends the shared country globe (globe.ts: buildCountryGlobe + latLon +
   makeLabels + loadGeo) exactly as routeGlobe / terminatorGlobe do, then adds
   the honest route layers: one great-circle arc per hop (swept in origin→dest),
   a relay of flowDash packet dots running the arcs, city nodes (endpoints
   accented), and a pulsing ring where a `compute` hop does its work. Drag to
   spin (dragController) — no orbitIdle auto-rotate: the packets' flowDash is
   this card's ONE ambient scene motion (motion.md rule 4).

   setState bridge (runtime.ts data-viz3d-state): the SVG bar's hover sets
   `hop-<i>` / `clear` on the mount → the matching arc brightens to accent @ 1.0
   and the others dim to 0.4 (the signature bar⇄globe sync, one-way).
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController, latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';
import { greatCircle } from '../kepler';
import { glowSprite } from '../helpers';
import { cities, meanHopLon, type Hop } from '../packet';

const R = 1.4;                    // scene sphere radius (globe family)
const ARC_N = 64;                 // arc segments → 65 points
const SWEEP_MS = 1200;            // per-arc sweep duration (motion.md)
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.3, 5.0);
  camera.lookAt(0, 0, 0);
  const accent = new THREE.Color(colors.accent);
  // --accent-alt (pink valence) isn't in SceneColors; resolve it from the mount
  // like terrainRelief does — THREE.Color can't parse a raw 'var(--…)' string.
  const mountCS = getComputedStyle(mount);
  const altRaw = (mountCS.getPropertyValue('--accent-alt') || '').trim();
  const accentAlt = /^(#|rgb|hsl)/.test(altRaw) ? new THREE.Color(altRaw) : new THREE.Color(colors.muted);
  const ink = new THREE.Color(colors.ink);
  const group = new THREE.Group();
  scene.add(group);

  const disposables: any[] = [];
  buildCountryGlobe(THREE, group, colors, R, disposables);

  /* ── data ── */
  const hops: Hop[] = Array.isArray(data.hops) ? data.hops : [];
  // refractiveIndex feeds only the SVG budget bar (component, build-time); the
  // globe scene draws arcs + packets and needs no light-floor math here.
  const loopMs = clamp(typeof data.loopMs === 'number' ? data.loopMs : 4000, 2000, 8000);

  /* per-hop stagger cap (motion.md rule 3 — full entrance ≤ 1.6s): the last
     arc's sweep must END by 1600ms, so staggerMs = min(120, 400/(hops−1)). */
  const staggerMs = hops.length > 1 ? Math.min(120, 400 / (hops.length - 1)) : 0;

  const labels = makeLabels(THREE, mount);

  /* ── arcs (fiber/wireless hops) + packet runners ── */
  interface ArcRec {
    mat: any; geo: any; pts: any[]; startMs: number; endMs: number;
    packet?: { sphere: any; sphMat: any; glow: any; startFrac: number };
  }
  const arcs: ArcRec[] = [];

  hops.forEach((h, i) => {
    if (h.kind === 'compute') { arcs.push(null as any); return; } // no arc; ring added below
    // bulge scales with arc length (geodesy §2 range 0.05–0.18)
    const gcPts = greatCircle({ lat: h.fromLat, lon: h.fromLon }, { lat: h.toLat, lon: h.toLon }, ARC_N);
    const delta = greatCircleAngle(h.fromLat, h.fromLon, h.toLat, h.toLon);
    const hh = 0.06 + 0.10 * (delta / Math.PI);
    const pts = gcPts.map((p, k) => latLon(THREE, p.lat, p.lon, R * (1 + hh * Math.sin(Math.PI * (k / ARC_N)))));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setDrawRange(0, 0); // swept in
    const mat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 });
    group.add(new THREE.Line(geo, mat));
    disposables.push(geo, mat);

    const startMs = i * staggerMs;
    const rec: ArcRec = { mat, geo, pts, startMs, endMs: startMs + SWEEP_MS };

    // packet dot: solid crest + additive glow, runs the arc as a flowDash relay
    const sg = new THREE.SphereGeometry(0.012, 12, 12);
    const sm = new THREE.MeshBasicMaterial({ color: accent });
    const sphere = new THREE.Mesh(sg, sm);
    sphere.visible = false;
    group.add(sphere);
    const glow = glowSprite(THREE, colors.accent, 0.06);
    glow.visible = false;
    group.add(glow);
    disposables.push(sg, sm, ...(glow.userData.disposables || []));
    rec.packet = { sphere, sphMat: sm, glow, startFrac: i / hops.length };
    arcs.push(rec);
  });

  /* ── compute-hop rings (the "work happens here" marker) ── */
  interface RingRec { mat: any; }
  const rings: RingRec[] = [];
  hops.forEach((h) => {
    if (h.kind !== 'compute') return;
    const rg = new THREE.RingGeometry(0.024, 0.036, 28);
    const rm = new THREE.MeshBasicMaterial({ color: accentAlt, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(rg, rm);
    const pos = latLon(THREE, h.fromLat, h.fromLon, R * 1.012);
    ring.position.copy(pos);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
    group.add(ring);
    disposables.push(rg, rm);
    rings.push({ mat: rm });
  });

  /* ── city nodes + labels (endpoints accented) ── */
  const cs = cities(hops, typeof data.originLabel === 'string' ? data.originLabel : undefined);
  cs.forEach((c) => {
    const endpoint = c.origin || c.dest;
    const g = new THREE.SphereGeometry(endpoint ? 0.028 : 0.02, 14, 14);
    const m = new THREE.MeshBasicMaterial({ color: endpoint ? accentAlt : ink, transparent: true, opacity: endpoint ? 1.0 : 0.9 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.copy(latLon(THREE, c.lat, c.lon, R * 1.01));
    group.add(mesh);
    disposables.push(g, m);
    if (c.label) labels.add(c.label, latLon(THREE, c.lat, c.lon, R * 1.06), 'data', 2);
  });

  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });

  /* ── boot framing: seed yaw so the route centroid faces the camera ── */
  const seedYaw = -((meanHopLon(hops) + 180) * Math.PI) / 180;
  const drag = dragController(canvas, 0.35);
  drag.s.yaw = seedYaw;

  /* ── hover sync (bar → globe) via setState ── */
  let activeHop = -1;
  function setState(name: string) {
    if (name === 'clear') { activeHop = -1; return; }
    const m = /^hop-(\d+)$/.exec(name);
    if (m) { activeHop = parseInt(m[1], 10); return; }
    // 'trip' | 'floor-only' reserved for a future split-chapter reveal (v1: ignore)
  }

  /* ── frame loop ── */
  let bootMs = -1;
  const tmp = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  return {
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    },
    frame(tMs: number) {
      if (bootMs < 0) bootMs = tMs;
      const since = tMs - bootMs;

      group.rotation.y = drag.s.yaw;   // seeded to face the route; no auto-rotate
      group.rotation.x = drag.s.pitch;

      // ── arc sweep (per-hop stagger) + hover brightness ──
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i];
        if (!a) continue;
        const prog = clamp((since - a.startMs) / SWEEP_MS, 0, 1);
        a.geo.setDrawRange(0, Math.max(0, Math.floor(prog * ARC_N)) + 1);
        // brightness: active hop full, others dim; none active → all 0.85
        a.mat.opacity = activeHop < 0 ? 0.85 : (i === activeHop ? 1.0 : 0.4);
      }

      // ── packets: flowDash relay, one dot per fiber hop, staggered ──
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i];
        if (!a || !a.packet) continue;
        const arrived = since >= a.endMs; // only run once the arc has drawn
        a.packet.sphere.visible = arrived;
        a.packet.glow.visible = arrived;
        if (!arrived) continue;
        const phase = ((tMs / loopMs + a.packet.startFrac) % 1 + 1) % 1;
        const f = phase * ARC_N;
        const k0 = Math.min(ARC_N, Math.floor(f));
        const k1 = Math.min(ARC_N, k0 + 1);
        const frac = f - k0;
        tmpA.copy(a.pts[k0]); tmpB.copy(a.pts[k1]);
        tmp.copy(tmpA).lerp(tmpB, frac);
        a.packet.sphere.position.copy(tmp);
        a.packet.glow.position.copy(tmp);
        const dim = activeHop >= 0 && i !== activeHop;
        (a.packet.sphMat as any).opacity = dim ? 0.4 : 1.0;
        (a.packet.sphMat as any).transparent = true;
      }

      // ── compute-hop ring pulse (opacity 0.45↔1.0, 2.4s sine) ──
      if (rings.length) {
        const p = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((tMs / 2400) * Math.PI * 2));
        for (const r of rings) r.mat.opacity = p;
      }

      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    setState,
    dispose() {
      drag.dispose(); labels.dispose();
      disposables.forEach((d) => d && d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};

/* central angle between two lat/lon (rad) — same convention as packet.ts. */
function greatCircleAngle(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const D = Math.PI / 180;
  const va = [Math.cos(lat1 * D) * Math.cos(lon1 * D), Math.cos(lat1 * D) * Math.sin(lon1 * D), Math.sin(lat1 * D)];
  const vb = [Math.cos(lat2 * D) * Math.cos(lon2 * D), Math.cos(lat2 * D) * Math.sin(lon2 * D), Math.sin(lat2 * D)];
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  return Math.acos(dot);
}
