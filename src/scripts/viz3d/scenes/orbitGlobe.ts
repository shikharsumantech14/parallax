/* ── ORBIT GLOBE (space) — country Earth + inclined orbit rings + sats ─────── */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController, latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 5.4);
  camera.lookAt(0, 0, 0);
  const accent = new THREE.Color(colors.accent);
  const group = new THREE.Group();
  scene.add(group);

  const earthR = 1;
  const disposables: any[] = [];
  buildCountryGlobe(THREE, group, colors, earthR, disposables);

  const orbits: any[] = Array.isArray(data.orbits) ? data.orbits : [];
  const maxAlt = data.maxAltKm || Math.max(1, ...orbits.map((o) => o.altKm || 0));
  const sats: any[] = [];
  orbits.forEach((o, i) => {
    const r = earthR + 0.45 + (Math.log((o.altKm || 0) + 1) / Math.log(maxAlt + 1)) * 2.3;
    const col = o.color ? new THREE.Color(o.color) : accent;
    const ringGeo = new THREE.RingGeometry(r - 0.006, r + 0.006, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 - (o.inclDeg || 0) * Math.PI / 180;
    ring.rotation.y = i * 0.6;
    group.add(ring);
    const satGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const satMat = new THREE.MeshBasicMaterial({ color: col });
    const sat = new THREE.Mesh(satGeo, satMat);
    group.add(sat);
    disposables.push(ringGeo, ringMat, satGeo, satMat);
    sats.push({ ring, sat, r, speed: 0.28 + i * 0.05, phase: i * 1.3 });
  });

  const labels = makeLabels(THREE, mount);
  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, earthR * 1.01), 'country', 0)); });

  const drag = dragController(canvas, 0.35);
  const tmp = new THREE.Vector3();

  // Camera fits the outermost ring (design review R7 — orbits were cropped):
  // distance = the larger of the vertical/horizontal requirement for rMax,
  // with a small tilt allowance vertically (rings rarely project full r).
  const rMax = sats.length ? Math.max(...sats.map((s) => s.r)) : 3;
  const halfTan = Math.tan((camera.fov * Math.PI) / 360);
  const fitCamera = () => {
    const dV = (rMax * 0.92) / halfTan;
    const dH = (rMax * 1.08) / (halfTan * Math.max(0.6, camera.aspect));
    const d = Math.max(dV, dH, 4.6);
    camera.position.set(0, d * 0.08, d);
    camera.lookAt(0, 0, 0);
  };

  return {
    resize(w, h, dpr) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); fitCamera(); },
    frame(tMs) {
      const t = tMs * 0.001;
      if (!drag.s.dragging) drag.s.yaw += 0.0016;
      group.rotation.y = drag.s.yaw; group.rotation.x = drag.s.pitch;
      for (const s of sats) { const a = t * s.speed + s.phase; tmp.set(Math.cos(a) * s.r, Math.sin(a) * s.r, 0).applyEuler(s.ring.rotation); s.sat.position.copy(tmp); }
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() { drag.dispose(); labels.dispose(); disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); },
  };
};
