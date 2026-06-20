/* ============================================================================
   PARALLAX — WebGL scene builders for the 3D component library.
   ----------------------------------------------------------------------------
   Each builder is `(THREE, canvas, data, colors) => SceneHandle`. They take
   THREE as a PARAMETER and must never `import 'three'` themselves — that keeps
   three in the single lazy chunk loaded by runtime.ts. Aesthetic: a real
   country-outline Earth (coastlines + borders from world-atlas, drawn as crisp
   line-art over an occluding sphere) in the world's theme colors — no photoreal
   textures, so it blends with the type-led, no-photo v2 look.

   The globe + its country borders + near-side labels are SHARED across the
   three globe scenes (orbit-globe, data-globe, route-globe) via
   buildCountryGlobe() + makeLabels(). Country geometry is lazy-fetched once
   from /geo/countries-110m.json (world-atlas) and decoded with topojson-client
   (a tiny separate chunk), so it loads only when a globe is on screen.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from './runtime';

/* Pointer-drag controller: drag to spin, gentle auto-rotate when idle. */
function dragController(canvas: HTMLCanvasElement, startTilt = 0.35) {
  const s = { yaw: 0, pitch: startTilt, dragging: false, lastX: 0, lastY: 0 };
  const down = (e: PointerEvent) => { s.dragging = true; s.lastX = e.clientX; s.lastY = e.clientY; };
  const move = (e: PointerEvent) => {
    if (!s.dragging) return;
    s.yaw += (e.clientX - s.lastX) * 0.006;
    s.pitch += (e.clientY - s.lastY) * 0.006;
    s.pitch = Math.max(-0.9, Math.min(0.9, s.pitch));
    s.lastX = e.clientX; s.lastY = e.clientY;
  };
  const up = () => { s.dragging = false; };
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  return { s, dispose() { canvas.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); } };
}

/* lat/lon (degrees) → point on a sphere of radius rr. */
function latLon(THREE: any, lat: number, lon: number, rr: number) {
  const phi = (90 - lat) * Math.PI / 180;
  const th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-rr * Math.sin(phi) * Math.cos(th), rr * Math.cos(phi), rr * Math.sin(phi) * Math.sin(th));
}

/* Lazy-load + decode country borders + major-country label centroids (once). */
const MAJOR = new Set([
  'United States of America', 'Canada', 'Brazil', 'Argentina', 'Russia', 'China',
  'India', 'Australia', 'South Africa', 'Egypt', 'Nigeria', 'Saudi Arabia',
  'Indonesia', 'Japan', 'Germany', 'France', 'United Kingdom', 'Mexico',
  'Kazakhstan', 'Greenland', 'Iran', 'Turkey',
]);
let geoPromise: Promise<{ borders: number[][][]; labels: { name: string; lat: number; lon: number }[] } | null> | null = null;
function loadGeo() {
  if (!geoPromise) {
    geoPromise = (async () => {
      const [topo, tj]: any = await Promise.all([
        fetch('/geo/countries-110m.json').then((r) => r.json()),
        import('topojson-client'),
      ]);
      const borders = tj.mesh(topo, topo.objects.countries).coordinates as number[][][];
      const feats = tj.feature(topo, topo.objects.countries).features as any[];
      const labels: { name: string; lat: number; lon: number }[] = [];
      for (const f of feats) {
        const name = f.properties && f.properties.name;
        if (!name || !MAJOR.has(name)) continue;
        let sx = 0, sy = 0, n = 0;
        const eat = (c: any) => { if (typeof c[0] === 'number') { sx += c[0]; sy += c[1]; n++; } else for (const k of c) eat(k); };
        eat(f.geometry.coordinates);
        if (n) labels.push({ name, lon: sx / n, lat: sy / n });
      }
      return { borders, labels };
    })().catch(() => null);
  }
  return geoPromise;
}

/* Build the shared country-outline Earth into `group`. An occluding sphere (so
   only the near hemisphere's lines show), a faint graticule, then the coastline
   + border line-art added when the geo chunk resolves. */
function buildCountryGlobe(THREE: any, group: any, colors: SceneColors, R: number, disposables: any[]) {
  const ink = new THREE.Color(colors.ink);
  // occluding body — paper-coloured so it blends with the card; hides far-side lines
  const sphGeo = new THREE.SphereGeometry(R * 0.992, 48, 32);
  const sphMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.paper) });
  group.add(new THREE.Mesh(sphGeo, sphMat));
  disposables.push(sphGeo, sphMat);

  // faint graticule (equator + a couple of parallels + meridians) for globe feel
  const gpos: number[] = [];
  const ring = (latDeg: number) => { for (let i = 0; i < 64; i++) { const a = latLon(THREE, latDeg, (i / 64) * 360 - 180, R * 1.0); const b = latLon(THREE, latDeg, ((i + 1) / 64) * 360 - 180, R * 1.0); gpos.push(a.x, a.y, a.z, b.x, b.y, b.z); } };
  const merid = (lonDeg: number) => { for (let i = 0; i < 64; i++) { const a = latLon(THREE, (i / 64) * 180 - 90, lonDeg, R * 1.0); const b = latLon(THREE, ((i + 1) / 64) * 180 - 90, lonDeg, R * 1.0); gpos.push(a.x, a.y, a.z, b.x, b.y, b.z); } };
  [-35, 0, 35].forEach(ring);
  [-150, -90, -30, 30, 90, 150].forEach(merid);
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute('position', new THREE.Float32BufferAttribute(gpos, 3));
  const gMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.07 });
  group.add(new THREE.LineSegments(gGeo, gMat));
  disposables.push(gGeo, gMat);

  // country coastlines + borders (lazy)
  loadGeo().then((geo) => {
    if (!geo) return;
    const positions: number[] = [];
    for (const line of geo.borders) {
      for (let i = 0; i < line.length - 1; i++) {
        const a = latLon(THREE, line[i][1], line[i][0], R * 1.002);
        const b = latLon(THREE, line[i + 1][1], line[i + 1][0], R * 1.002);
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const m = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.42 });
    group.add(new THREE.LineSegments(g, m));
    disposables.push(g, m);
  });
}

/* HTML label layer over the canvas — projects 3D anchors to screen each frame,
   hides any anchor on the far hemisphere, and greedily de-collides (data labels
   win over faint country labels). */
function makeLabels(THREE: any, mount: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'viz3d__labels';
  mount.appendChild(wrap);
  const items: { el: HTMLElement; local: any; priority: number }[] = [];
  const tmp = new THREE.Vector3();
  return {
    add(text: string, local: any, kind: string, priority: number) {
      const d = document.createElement('div');
      d.className = 'viz3d__label viz3d__label--' + kind;
      d.textContent = text;
      wrap.appendChild(d);
      items.push({ el: d, local, priority });
    },
    update(group: any, camera: any, w: number, h: number) {
      const placed: { x: number; y: number }[] = [];
      const sorted = items.slice().sort((a, b) => b.priority - a.priority);
      for (const it of sorted) {
        tmp.copy(it.local).applyMatrix4(group.matrixWorld);
        const front = tmp.clone().sub(camera.position).dot(tmp) < 0;
        const ndc = tmp.clone().project(camera);
        const x = (ndc.x * 0.5 + 0.5) * w;
        const y = (-ndc.y * 0.5 + 0.5) * h;
        let show = front && ndc.z < 1 && x >= 0 && x <= w && y >= 0 && y <= h;
        if (show) for (const p of placed) { if (Math.abs(p.x - x) < 56 && Math.abs(p.y - y) < 13) { show = false; break; } }
        if (show) { placed.push({ x, y }); it.el.style.left = x + 'px'; it.el.style.top = y + 'px'; it.el.style.opacity = it.priority > 0 ? '1' : '0.66'; }
        else it.el.style.opacity = '0';
      }
    },
    dispose() { wrap.remove(); },
  };
}

/* ── ORBIT GLOBE (space) — country Earth + inclined orbit rings + sats ─────── */
const orbitGlobe: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
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
  return {
    resize(w, h, dpr) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
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

/* ── COALITION ORBIT (politics) — party bodies orbiting a government core ──── */
const coalitionOrbit: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
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

/* ── DATA GLOBE (earth) — country Earth + data bubbles at lat/lon ──────────── */
const dataGlobe: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
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

/* ── ROUTE GLOBE (travel) — country Earth + city pins + great-circle arcs ──── */
const routeGlobe: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
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

export const builders: Record<string, SceneBuilder> = {
  'orbit-globe': orbitGlobe,
  'coalition-orbit': coalitionOrbit,
  'data-globe': dataGlobe,
  'route-globe': routeGlobe,
};
