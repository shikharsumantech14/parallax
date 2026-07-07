/* ============================================================================
   PARALLAX — `terminator-globe` scene (travel · FLAGSHIP + world signature).
   Blueprint: docs/design/blueprints/travel/terminator-globe.md — this file
   implements it 1:1; the blueprint is the contract. Math: kepler.ts
   (subsolarPoint / greatCircle) + terminator.ts (ring / day-night / clocks),
   both pure; the component calls the SAME functions at build time for the
   fallback SVG. Takes THREE as a parameter; never imports three (lazy-chunk).

   Extends the shared country globe (globe.ts: buildCountryGlobe + latLon +
   makeLabels + loadGeo) exactly as routeGlobe does, then adds three honest
   layers — the subsolar-anchored terminator ring, the antisolar night wash
   (paper-occluder half-sphere cap, NO shader, CANON §4), and the great-circle
   flight arc — plus one setState (departure ↔ arrival) that advances the sun.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import { latLon, loadGeo, buildCountryGlobe, makeLabels } from './globe';
import { greatCircle } from '../kepler';
import { makeOrbitControls, makePicker, makeTooltip } from '../helpers';
import {
  terminatorRing, antisolarPoint, isDaylight, subsolarFor,
  localClock, offsetLabel, clampBulge,
} from '../terminator';

interface City { city: string; lat: number; lon: number; tzOffsetH: number }

const R = 1.4;                 // scene sphere radius (matches routeGlobe)
const smoothstep = (t: number) => { const s = Math.max(0, Math.min(1, t)); return s * s * (3 - 2 * s); };

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.35, 5.0);
  camera.lookAt(0, 0, 0);
  const ink = new THREE.Color(colors.ink);
  const accent = new THREE.Color(colors.accent);
  const group = new THREE.Group();
  scene.add(group);

  const disposables: any[] = [];
  buildCountryGlobe(THREE, group, colors, R, disposables);

  /* ── data ── */
  const epochISO: string = typeof data.epoch === 'string' ? data.epoch : '2026-01-01T00:00:00Z';
  const epochMs = Date.parse(epochISO + (epochISO.length <= 10 ? 'T00:00:00Z' : ''));
  const from: City = data.from || { city: 'From', lat: 0, lon: 0, tzOffsetH: 0 };
  const to: City = data.to || { city: 'To', lat: 0, lon: 0, tzOffsetH: 0 };
  const flightHours: number = typeof data.flightHours === 'number' ? data.flightHours : 0;
  const bulge = clampBulge(data.arcBulge);
  const arrivalMs = epochMs + flightHours * 3600000;

  /* ── state: two honest instants (departure / arrival) ── */
  let state: 'departure' | 'arrival' = 'departure';
  const instantMs = () => (state === 'arrival' ? arrivalMs : epochMs);

  /* ── terminator ring: LineSegments, drawn 2× (inner @0.9 + shadow @0.3) ── */
  const RING_N = 128;
  const ringGeoInner = new THREE.BufferGeometry();
  const ringGeoShadow = new THREE.BufferGeometry();
  ringGeoInner.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(RING_N * 2 * 3), 3));
  ringGeoShadow.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(RING_N * 2 * 3), 3));
  const ringMatInner = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const ringMatShadow = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const ringInner = new THREE.LineSegments(ringGeoInner, ringMatInner);
  const ringShadow = new THREE.LineSegments(ringGeoShadow, ringMatShadow);
  group.add(ringShadow); group.add(ringInner);
  disposables.push(ringGeoInner, ringGeoShadow, ringMatInner, ringMatShadow);

  // current + target ring vertex sets (settled/lerped on stateSwitch)
  let ringCur = terminatorRing(subsolarFor(epochMs), RING_N);
  let ringFrom = ringCur.map((p) => ({ ...p }));
  let ringTo = ringCur.map((p) => ({ ...p }));
  const writeRing = (pts: { lat: number; lon: number }[]) => {
    const inA = ringGeoInner.attributes.position.array as Float32Array;
    const shA = ringGeoShadow.attributes.position.array as Float32Array;
    for (let k = 0; k < RING_N; k++) {
      const p0 = pts[k]; const p1 = pts[(k + 1) % RING_N];
      const a = latLon(THREE, p0.lat, p0.lon, R * 1.004);
      const b = latLon(THREE, p1.lat, p1.lon, R * 1.004);
      const aS = latLon(THREE, p0.lat, p0.lon, R * 1.002);
      const bS = latLon(THREE, p1.lat, p1.lon, R * 1.002);
      const o = k * 6;
      inA[o] = a.x; inA[o + 1] = a.y; inA[o + 2] = a.z; inA[o + 3] = b.x; inA[o + 4] = b.y; inA[o + 5] = b.z;
      shA[o] = aS.x; shA[o + 1] = aS.y; shA[o + 2] = aS.z; shA[o + 3] = bS.x; shA[o + 4] = bS.y; shA[o + 5] = bS.z;
    }
    ringGeoInner.attributes.position.needsUpdate = true;
    ringGeoShadow.attributes.position.needsUpdate = true;
  };
  writeRing(ringCur);

  /* ── night wash: antisolar half-sphere cap, --ink @ 0.28, FrontSide ── */
  const nightGeo = new THREE.SphereGeometry(R * 1.006, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const nightMat = new THREE.MeshBasicMaterial({
    color: ink, transparent: true, opacity: 0, depthWrite: false, side: THREE.FrontSide,
  });
  const night = new THREE.Mesh(nightGeo, nightMat);
  group.add(night);
  disposables.push(nightGeo, nightMat);
  // orient the cap so its +Y pole points at the antisolar ground point
  const orientNight = (sub: { lat: number; lon: number }) => {
    const anti = antisolarPoint(sub);
    const dir = latLon(THREE, anti.lat, anti.lon, 1).normalize();
    night.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  };
  orientNight(subsolarFor(epochMs));
  let nightFromQ = night.quaternion.clone();
  let nightToQ = night.quaternion.clone();

  /* ── flight arc: great circle from→to, bulged, swept over 1400 ms ── */
  const arcPts = greatCircle({ lat: from.lat, lon: from.lon }, { lat: to.lat, lon: to.lon }, 64)
    .map((p, k) => latLon(THREE, p.lat, p.lon, R * (1 + bulge * Math.sin(Math.PI * (k / 64)))));
  const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
  arcGeo.setDrawRange(0, 0); // swept in
  const arcMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 });
  group.add(new THREE.Line(arcGeo, arcMat));
  disposables.push(arcGeo, arcMat);

  /* ── endpoints: accent spheres at R·1.02, settle (scale 0→1) as arc arrives ─ */
  const mkPin = (c: City) => {
    const g = new THREE.SphereGeometry(0.05, 14, 14);
    const m = new THREE.MeshBasicMaterial({ color: accent });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.copy(latLon(THREE, c.lat, c.lon, R * 1.02));
    mesh.scale.setScalar(0.0001);
    group.add(mesh);
    const hg = new THREE.SphereGeometry(0.11, 8, 6);
    const hm = new THREE.MeshBasicMaterial({ visible: false });
    const hit = new THREE.Mesh(hg, hm);
    hit.position.copy(mesh.position);
    group.add(hit);
    disposables.push(g, m, hg, hm);
    return { mesh, hit };
  };
  const pinFrom = mkPin(from);
  const pinTo = mkPin(to);
  (pinFrom.hit as any).userData.city = from;
  (pinTo.hit as any).userData.city = to;

  /* ── labels: city names (data), SUBSOLAR tick (data), countries (country) ── */
  const labels = makeLabels(THREE, mount);
  labels.add(from.city, latLon(THREE, from.lat, from.lon, R * 1.08), 'data', 1);
  labels.add(to.city, latLon(THREE, to.lat, to.lon, R * 1.08), 'data', 1);
  const subAnchor = new THREE.Vector3();
  const setSubAnchor = (sub: { lat: number; lon: number }) => subAnchor.copy(latLon(THREE, sub.lat, sub.lon, R * 1.03));
  setSubAnchor(subsolarFor(epochMs));
  labels.add('SUBSOLAR', subAnchor, 'data', 2);
  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, R * 1.01), 'country', 0)); });

  /* ── initial framing: seed yaw so the arc midpoint faces the camera ── */
  const mid = greatCircle({ lat: from.lat, lon: from.lon }, { lat: to.lat, lon: to.lon }, 2)[1];
  const seedYaw = -((mid.lon + 180) * Math.PI) / 180;

  /* ── controls / picking / tooltip ── */
  const controls = makeOrbitControls(canvas, { startPitch: 0.30, minZoom: 0.5, maxZoom: 2.6, autoRotate: true });
  controls.s.yaw = seedYaw;
  const tooltip = makeTooltip(mount);
  const pins = [pinFrom, pinTo];
  const picker = makePicker(THREE, camera, canvas, pins.map((p) => p.hit), (obj, _inst, x, y) => {
    for (const p of pins) p.mesh.userData.hover = false;
    if (!obj) { tooltip.hide(); return; }
    const c: City = obj.userData.city;
    const pin = obj === pinFrom.hit ? pinFrom : pinTo;
    pin.mesh.userData.hover = true;
    const sub = subsolarFor(instantMs());
    const { hhmm, dayDelta } = localClock(instantMs(), c.tzOffsetH);
    const dayTag = dayDelta < 0 ? ' (prev day)' : dayDelta > 0 ? ' (next day)' : '';
    const light = isDaylight({ lat: c.lat, lon: c.lon }, sub) ? 'in daylight' : 'in darkness';
    tooltip.show(`<b>${c.city}</b><br>${hhmm} local${dayTag} · ${offsetLabel(c.tzOffsetH)}<br>${light} now`, x, y);
  });

  /* ── setState (departure ↔ arrival): sun/terminator/night settle 600 ms ── */
  let switchAt = -1; // tMs the current settle started (-1 = idle)
  function setState(name: string) {
    const next = name === 'arrival' ? 'arrival' : name === 'departure' ? 'departure' : null;
    if (!next || next === state) return;
    state = next;
    const sub = subsolarFor(instantMs());
    ringFrom = ringCur.map((p) => ({ ...p }));
    ringTo = terminatorRing(sub, RING_N);
    nightFromQ = night.quaternion.clone();
    const anti = antisolarPoint(sub);
    const dir = latLon(THREE, anti.lat, anti.lon, 1).normalize();
    nightToQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    setSubAnchor(sub);
    switchAt = -2; // stamped on next frame
  }

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;
  const tmpQ = new THREE.Quaternion();
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

      controls.tick(dt);
      group.rotation.y = controls.s.yaw; // seeded to face the arc midpoint at boot
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(0, 0.35 * z, 5.0 * z);
      camera.lookAt(0, 0, 0);

      // ── boot reveal (concurrent): terminator draw, night fade, arc sweep ──
      // ring "draw" 0→128 over 900 ms; night 0→0.28 over 600 ms; arc 0→65 over
      // 1400 ms (the long pole). Endpoints settle as the arc reaches them.
      const ringDrawn = Math.min(1, since / 900);
      ringMatInner.opacity = 0.9 * ringDrawn;
      ringMatShadow.opacity = 0.3 * ringDrawn;
      nightMat.opacity = 0.28 * Math.min(1, since / 600);
      const arcT = Math.min(1, since / 1400);
      arcGeo.setDrawRange(0, Math.max(0, Math.floor(arcT * (arcPts.length - 1))) + 1);
      // endpoint settle: from-pin as the sweep starts, to-pin as it lands
      const settleFrom = smoothstep(Math.min(1, since / 400));
      const settleTo = smoothstep(Math.min(1, (since - 1150) / 400));
      pinFrom.mesh.scale.setScalar(Math.max(0.0001, settleFrom * (pinFrom.mesh.userData.hover ? 1.35 : 1)));
      pinTo.mesh.scale.setScalar(Math.max(0.0001, settleTo * (pinTo.mesh.userData.hover ? 1.35 : 1)));

      // ── stateSwitch settle: ring vertices lerp, night pole slerps (600 ms) ──
      if (switchAt === -2) switchAt = tMs;
      if (switchAt >= 0) {
        const s = smoothstep((tMs - switchAt) / 600);
        for (let k = 0; k < RING_N; k++) {
          ringCur[k].lat = ringFrom[k].lat + (ringTo[k].lat - ringFrom[k].lat) * s;
          // lon lerp on the short way around the ±180 seam
          let dLon = ringTo[k].lon - ringFrom[k].lon;
          if (dLon > 180) dLon -= 360; else if (dLon < -180) dLon += 360;
          ringCur[k].lon = ((ringFrom[k].lon + dLon * s + 540) % 360) - 180;
        }
        writeRing(ringCur);
        tmpQ.slerpQuaternions(nightFromQ, nightToQ, s);
        night.quaternion.copy(tmpQ);
        if (s >= 1) { switchAt = -1; ringCur = ringTo.map((p) => ({ ...p })); }
      }

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    setState,
    dispose() {
      controls.dispose(); picker.dispose(); tooltip.dispose(); labels.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
