/* ============================================================================
   PARALLAX — shared globe helpers for the WebGL scene modules.
   ----------------------------------------------------------------------------
   Every helper takes THREE as a PARAMETER and must never `import 'three'`
   itself — that keeps three in the single lazy chunk loaded by runtime.ts.
   Aesthetic: a real country-outline Earth (coastlines + borders from
   world-atlas, drawn as crisp line-art over an occluding sphere) in the
   world's theme colors — no photoreal textures, so it blends with the
   type-led, no-photo v2 look.

   The globe + its country borders + near-side labels are SHARED across the
   three globe scenes (orbit-globe, data-globe, route-globe) via
   buildCountryGlobe() + makeLabels(). Country geometry is lazy-fetched once
   from /geo/countries-110m.json (world-atlas) and decoded with topojson-client
   (a tiny separate chunk), so it loads only when a globe is on screen.
   ============================================================================ */
import type { SceneColors } from '../runtime';

/* Pointer-drag controller: drag to spin, gentle auto-rotate when idle. */
export function dragController(canvas: HTMLCanvasElement, startTilt = 0.35) {
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
export function latLon(THREE: any, lat: number, lon: number, rr: number) {
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
export function loadGeo() {
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
export function buildCountryGlobe(THREE: any, group: any, colors: SceneColors, R: number, disposables: any[]) {
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
export function makeLabels(THREE: any, mount: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'viz3d__labels';
  mount.appendChild(wrap);
  // each item = an anchor dot at the exact projected point + the text chip
  // offset a consistent 10px up-right, so every label reads as a deliberate,
  // uniformly-placed map annotation (review R2-1). data labels win collisions.
  const items: { el: HTMLElement; dot: HTMLElement; local: any; priority: number }[] = [];
  const tmp = new THREE.Vector3();
  return {
    add(text: string, local: any, kind: string, priority: number) {
      const dot = document.createElement('span');
      dot.className = 'viz3d__anchor viz3d__anchor--' + kind;
      wrap.appendChild(dot);
      const d = document.createElement('div');
      d.className = 'viz3d__label viz3d__label--' + kind;
      d.textContent = text;
      wrap.appendChild(d);
      items.push({ el: d, dot, local, priority });
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
        if (show) for (const p of placed) { if (Math.abs(p.x - x) < 64 && Math.abs(p.y - y) < 15) { show = false; break; } }
        if (show) {
          placed.push({ x, y });
          it.el.style.left = x + 'px'; it.el.style.top = y + 'px';
          it.el.style.opacity = it.priority > 0 ? '1' : '0.62';
          it.dot.style.left = x + 'px'; it.dot.style.top = y + 'px';
          it.dot.style.opacity = it.priority > 0 ? '1' : '0';
        } else { it.el.style.opacity = '0'; it.dot.style.opacity = '0'; }
      }
    },
    dispose() { wrap.remove(); },
  };
}
