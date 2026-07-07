/* ── ROUTE GLOBE (travel) — country Earth + city pins + great-circle arcs ──── */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController, latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.3, 5.0);
  camera.lookAt(0, 0, 0);
  const accent = new THREE.Color(colors.accent);
  const group = new THREE.Group();
  scene.add(group);

  const R = 1.4;
  const disposables: any[] = [];
  buildCountryGlobe(THREE, group, colors, R, disposables);

  const stops: any[] = Array.isArray(data.stops) ? data.stops : [];
  const labels = makeLabels(THREE, mount);
  stops.forEach((s) => {
    const g = new THREE.SphereGeometry(0.05, 14, 14);
    const mat = new THREE.MeshBasicMaterial({ color: accent });
    const mesh = new THREE.Mesh(g, mat);
    mesh.position.copy(latLon(THREE, s.lat || 0, s.lon || 0, R * 1.02));
    group.add(mesh);
    disposables.push(g, mat);
    if (s.city) labels.add(s.city, latLon(THREE, s.lat || 0, s.lon || 0, R * 1.08), 'data', 1);
  });
  for (let i = 0; i < stops.length - 1; i++) {
    const a = latLon(THREE, stops[i].lat || 0, stops[i].lon || 0, 1).normalize();
    const b = latLon(THREE, stops[i + 1].lat || 0, stops[i + 1].lon || 0, 1).normalize();
    const omega = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
    const pts: any[] = [];
    const N = 48;
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      let p;
      if (omega < 1e-4) p = a.clone();
      else { const s1 = Math.sin((1 - t) * omega) / Math.sin(omega); const s2 = Math.sin(t * omega) / Math.sin(omega); p = a.clone().multiplyScalar(s1).add(b.clone().multiplyScalar(s2)); }
      p.multiplyScalar(R * (1 + 0.18 * Math.sin(Math.PI * t)));
      pts.push(p);
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const arcMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 });
    group.add(new THREE.Line(arcGeo, arcMat));
    disposables.push(arcGeo, arcMat);
  }
  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });

  const drag = dragController(canvas, 0.2);
  return {
    resize(w, h, dpr) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
    frame() {
      if (!drag.s.dragging) drag.s.yaw += 0.0016;
      group.rotation.y = drag.s.yaw; group.rotation.x = drag.s.pitch;
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() { drag.dispose(); labels.dispose(); disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); },
  };
};
