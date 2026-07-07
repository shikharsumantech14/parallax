/* ── COALITION ORBIT (politics) — party bodies orbiting a government core ──── */
import type { SceneBuilder, SceneColors } from '../runtime';
import { dragController } from './globe';

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.0, 6.4);
  camera.lookAt(0, 0, 0);
  const accent = new THREE.Color(colors.accent);
  const ink = new THREE.Color(colors.ink);
  const group = new THREE.Group();
  scene.add(group);

  const coreGeo = new THREE.IcosahedronGeometry(0.56, 1);
  const coreMat = new THREE.MeshBasicMaterial({ color: ink, wireframe: true, transparent: true, opacity: 0.3 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);
  const coreDotGeo = new THREE.IcosahedronGeometry(0.5, 3);
  const coreDotMat = new THREE.PointsMaterial({ color: accent, size: 0.03, transparent: true, opacity: 0.85 });
  const coreDots = new THREE.Points(coreDotGeo, coreDotMat);
  group.add(coreDots);

  const parties: any[] = Array.isArray(data.parties) ? data.parties : [];
  const maxSeats = Math.max(1, ...parties.map((p) => p.seats || 0));
  const disposables: any[] = [coreGeo, coreMat, coreDotGeo, coreDotMat];
  const bodies: any[] = [];
  parties.forEach((p, i) => {
    const r = 1.4 + i * 0.55;
    const col = p.color ? new THREE.Color(p.color) : accent;
    const ringGeo = new THREE.RingGeometry(r - 0.004, r + 0.004, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.26, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 - 0.34 + (i % 2 ? 0.14 : -0.14);
    ring.rotation.y = i * 0.5;
    group.add(ring);
    const bodyR = 0.1 + 0.3 * Math.sqrt((p.seats || 0) / maxSeats);
    const bodyGeo = new THREE.SphereGeometry(bodyR, 20, 20);
    const bodyMat = new THREE.MeshBasicMaterial({ color: col });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);
    disposables.push(ringGeo, ringMat, bodyGeo, bodyMat);
    bodies.push({ ring, body, r, speed: 0.34 - i * 0.03, phase: i * 1.7 });
  });

  const drag = dragController(canvas, 0.42);
  const tmp = new THREE.Vector3();
  return {
    resize(w, h, dpr) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
    frame(tMs) {
      const t = tMs * 0.001;
      if (!drag.s.dragging) drag.s.yaw += 0.0015;
      group.rotation.y = drag.s.yaw; group.rotation.x = drag.s.pitch;
      core.rotation.y = t * 0.1; coreDots.rotation.y = -t * 0.06;
      for (const b of bodies) { const a = t * b.speed + b.phase; tmp.set(Math.cos(a) * b.r, Math.sin(a) * b.r, 0).applyEuler(b.ring.rotation); b.body.position.copy(tmp); }
      renderer.render(scene, camera);
    },
    dispose() { drag.dispose(); disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); },
  };
};
