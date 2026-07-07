/* ── DATA GLOBE (earth) — country Earth + data bubbles at lat/lon ──────────── */
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

  const markers: any[] = Array.isArray(data.markers) ? data.markers : [];
  const maxVal = Math.max(1, ...markers.map((m) => m.value || 0));
  const labels = makeLabels(THREE, mount);
  markers.forEach((m) => {
    const col = m.color ? new THREE.Color(m.color) : accent;
    const s = 0.045 + 0.13 * Math.sqrt((m.value || 0) / maxVal);
    const g = new THREE.SphereGeometry(s, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.92 });
    const mesh = new THREE.Mesh(g, mat);
    mesh.position.copy(latLon(THREE, m.lat || 0, m.lon || 0, R * 1.02));
    group.add(mesh);
    disposables.push(g, mat);
    if (m.name) labels.add(m.name, latLon(THREE, m.lat || 0, m.lon || 0, R * (1.02 + s)), 'data', 1);
  });
  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });

  const drag = dragController(canvas, 0.2);
  return {
    resize(w, h, dpr) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
    frame() {
      if (!drag.s.dragging) drag.s.yaw += 0.0018;
      group.rotation.y = drag.s.yaw; group.rotation.x = drag.s.pitch;
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() { drag.dispose(); labels.dispose(); disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); },
  };
};
