/* ============================================================================
   PARALLAX — `solar-system` scene (space · FLAGSHIP).
   Blueprint: docs/design/blueprints/space/solar-system.md — this file
   implements it 1:1; the blueprint is the contract. Math: kepler.ts only.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import {
  PLANETS, type Elements, elementsToPosition, daysSinceJ2000, logRadius,
} from '../kepler';
import { makeOrbitControls, makePicker, makeTooltip, glowSprite } from '../helpers';
import { makeLabels } from './globe';

/* Real radii relative to Earth (blueprint §4) — display size only. */
const R_REL: Record<string, number> = {
  mercury: 0.38, venus: 0.95, earth: 1.0, mars: 0.53,
  jupiter: 11.2, saturn: 9.45, uranus: 4.0, neptune: 3.88,
};
const NICE: Record<string, string> = {
  mercury: 'Mercury', venus: 'Venus', earth: 'Earth', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune',
};

const DAYS_PER_SEC = 10;      // motion.md orbitBody — caption chip "1s = 10 days"
const K_LOG = 1.15;           // blueprint §4 radial scale constants
const K_TRUE = 0.62;

interface BodyRec {
  name: string;
  el: Elements;
  mesh: any;          // visible sphere
  hit: any;           // invisible picking proxy
  label: any;         // mutable Vector3 shared with the label layer
  bodyR: number;
  focus: boolean;
  note?: string;
  settleAt: number;   // stagger start (ms since boot)
}

function fmtPeriod(d: number): string {
  return d >= 400 ? (d / 365.256).toFixed(1) + ' yr' : Math.round(d) + ' d';
}

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const ink = new THREE.Color(colors.ink);
  const accent = new THREE.Color(colors.accent);
  // --accent-alt is the story-object color (blueprint §6); read from the mount
  const altRaw = getComputedStyle(mount).getPropertyValue('--accent-alt').trim();
  const alt = new THREE.Color(altRaw || '#ffb347');

  const disposables: any[] = [];

  /* ── data ── */
  const epochISO: string = typeof data.epoch === 'string' ? data.epoch : '2026-01-01';
  const d0 = daysSinceJ2000(Date.parse(epochISO + (epochISO.length <= 10 ? 'T12:00:00Z' : '')));
  const planetKeys: string[] = Array.isArray(data.planets) && data.planets.length
    ? data.planets.filter((k: string) => PLANETS[k])
    : Object.keys(PLANETS);
  const extra: any[] = Array.isArray(data.bodies) ? data.bodies : [];
  let mode: 'log' | 'true' = data.scale === 'true' ? 'true' : 'log';
  const trailDays: number = typeof data.trailDays === 'number' ? data.trailDays : 120;

  const mapR = (rAU: number, m: 'log' | 'true' = mode) =>
    m === 'log' ? logRadius(rAU, K_LOG) : K_TRUE * rAU;

  /* ecliptic (AU) → scene (Y-up), radius remapped preserving direction */
  const toScene = (p: { x: number; y: number; z: number; r: number }, out: any, m?: 'log' | 'true') => {
    const s = p.r > 1e-9 ? mapR(p.r, m) / p.r : 0;
    out.set(p.x * s, p.z * s, -p.y * s);
    return out;
  };

  /* ── Sun ── */
  const sunGlow = glowSprite(THREE, colors.accent, 0.55);
  group.add(sunGlow);
  const sunGeo = new THREE.SphereGeometry(0.09, 20, 14);
  const sunMat = new THREE.MeshBasicMaterial({ color: accent });
  group.add(new THREE.Mesh(sunGeo, sunMat));
  disposables.push(sunGeo, sunMat, ...(sunGlow.userData.disposables || []));

  /* ── orbit paths (rebuilt on scale switch) ── */
  const pathMats: any[] = [];
  let pathGroup: any = null;
  function buildPaths(m: 'log' | 'true') {
    if (pathGroup) {
      group.remove(pathGroup);
      pathGroup.traverse((o: any) => { o.geometry?.dispose?.(); });
    }
    pathGroup = new THREE.Group();
    pathMats.length = 0;
    const tmp = new THREE.Vector3();
    const addPath = (el: Elements, color: any, opacity: number) => {
      const pts: any[] = [];
      for (let k = 0; k <= 192; k++) {
        const dd = (k / 192) * el.periodDays; // uniform in mean anomaly
        toScene(elementsToPosition(el, dd), tmp, m);
        pts.push(tmp.clone());
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      pathGroup.add(new THREE.Line(g, mat));
      pathMats.push(mat);
      disposables.push(g, mat);
    };
    for (const k of planetKeys) addPath(PLANETS[k], ink, 0.22);
    for (const b of extra) addPath(elOf(b), alt, 0.8);
    group.add(pathGroup);
  }
  function elOf(b: any): Elements {
    return { a: b.a_AU, e: b.e, iDeg: b.i_deg, OmegaDeg: b.Omega_deg, omegaDeg: b.omega_deg, M0Deg: b.M0_deg, periodDays: b.period_d };
  }

  /* ── bodies ── */
  const labels = makeLabels(THREE, mount);
  const bodies: BodyRec[] = [];
  const mkBody = (name: string, el: Elements, focus: boolean, note: string | undefined, i: number) => {
    const rRel = R_REL[name.toLowerCase()] ?? 1;
    const bodyR = focus ? 0.045 : 0.028 + 0.022 * Math.log10(1 + rRel);
    const geo = new THREE.SphereGeometry(bodyR, 20, 14);
    const mat = new THREE.MeshBasicMaterial({ color: focus ? alt : ink, transparent: true, opacity: focus ? 1 : 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(0.0001); // settle-in from zero
    group.add(mesh);
    const hitGeo = new THREE.SphereGeometry(Math.max(bodyR * 1.8, 0.06), 8, 6);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hit = new THREE.Mesh(hitGeo, hitMat);
    group.add(hit);
    if (focus) {
      const g = glowSprite(THREE, altRaw || '#ffb347', 0.28);
      mesh.add(g);
      disposables.push(...(g.userData.disposables || []));
    }
    const label = new THREE.Vector3();
    labels.add(NICE[name.toLowerCase()] ?? name, label, 'data', focus ? 2 : 1);
    disposables.push(geo, mat, hitGeo, hitMat);
    const rec: BodyRec = { name: NICE[name.toLowerCase()] ?? name, el, mesh, hit, label, bodyR, focus, note, settleAt: i * 40 };
    (hit as any).userData.rec = rec;
    bodies.push(rec);
  };
  planetKeys.forEach((k, i) => mkBody(k, PLANETS[k], false, undefined, i));
  extra.forEach((b, j) => mkBody(b.name, elOf(b), b.role === 'focus', b.note, planetKeys.length + j));
  labels.add('Sun', new THREE.Vector3(0, 0.12, 0), 'country', 0);

  /* ── focus trail ── */
  let trailLine: any = null;
  const trailMat = new THREE.LineBasicMaterial({ color: alt, transparent: true, opacity: 0.5 });
  disposables.push(trailMat);
  function rebuildTrail(dNow: number) {
    const focus = bodies.find((b) => b.focus);
    if (!focus || trailDays <= 0) return;
    const pts: any[] = [];
    const tmp = new THREE.Vector3();
    const steps = Math.min(90, Math.ceil(trailDays / 2));
    for (let k = 0; k <= steps; k++) {
      const dd = dNow - trailDays + (k / steps) * trailDays;
      toScene(elementsToPosition(focus.el, dd), tmp);
      pts.push(tmp.clone());
    }
    if (trailLine) { group.remove(trailLine); trailLine.geometry.dispose(); }
    trailLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), trailMat);
    group.add(trailLine);
  }

  buildPaths(mode);
  rebuildTrail(d0);

  /* ── controls / picking / tooltip ── */
  const controls = makeOrbitControls(canvas, { startPitch: 0.55, minZoom: 0.4, maxZoom: 3.4 });
  const tooltip = makeTooltip(mount);
  let dNow = d0;
  const picker = makePicker(THREE, camera, canvas, bodies.map((b) => b.hit), (obj, _inst, x, y) => {
    for (const b of bodies) b.mesh.scale.setScalar(b.mesh.scale.x >= 1 ? 1 : b.mesh.scale.x); // normalize
    if (!obj) { tooltip.hide(); return; }
    const rec: BodyRec = obj.userData.rec;
    rec.mesh.scale.setScalar(1.35); // hoverLift
    const p = elementsToPosition(rec.el, dNow);
    tooltip.show(
      `<b>${rec.name}</b><br>${p.r.toFixed(rec.el.a < 2 ? 2 : 1)} AU from Sun · ${fmtPeriod(rec.el.periodDays)}${rec.note ? '<br>' + rec.note : ''}`,
      x, y,
    );
  });

  /* ── state switch (blueprint §8): crossfade paths, lerp bodies ── */
  let modeLerp = 1; // 1 = settled
  function setState(name: string) {
    const next = name === 'true-scale' ? 'true' : name === 'log-scale' ? 'log' : null;
    if (!next || next === mode) return;
    mode = next;
    buildPaths(mode);
    for (const m of pathMats) m.opacity *= 0.0001; // fade in below
    modeLerp = 0;
    rebuildTrail(dNow);
  }

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;
  const tmpV = new THREE.Vector3();
  return {
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    frame(tMs: number) {
      if (bootMs < 0) bootMs = tMs;
      const dt = lastT ? Math.min(64, tMs - lastT) : 16;
      lastT = tMs;
      const since = tMs - bootMs;

      controls.tick(dt);
      group.rotation.y = controls.s.yaw;
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(0, 2.6 * z, 4.4 * z);
      camera.lookAt(0, 0, 0);

      // orbitBody time advance (1 s = DAYS_PER_SEC days)
      dNow = d0 + (since / 1000) * DAYS_PER_SEC;

      // path crossfade after a scale switch (stateSwitch ≤600 ms)
      if (modeLerp < 1) {
        modeLerp = Math.min(1, modeLerp + dt / 600);
        for (const m of pathMats) m.opacity = (m.color.equals(alt) ? 0.8 : 0.22) * modeLerp;
      }

      for (const b of bodies) {
        const p = elementsToPosition(b.el, dNow);
        toScene(p, tmpV);
        b.mesh.position.copy(tmpV);
        b.hit.position.copy(tmpV);
        b.label.set(tmpV.x, tmpV.y + b.bodyR + 0.05, tmpV.z);
        // settle-in: scale 0 → 1, 600 ms, 40 ms stagger (motion.md `settle`)
        if (b.mesh.scale.x < 1) {
          const s = Math.max(0.0001, Math.min(1, (since - b.settleAt) / 600));
          b.mesh.scale.setScalar(s * s * (3 - 2 * s)); // smoothstep, no overshoot
        }
      }
      // trail follows the moving focus body (cheap rebuild ~4×/s)
      if (((since / 250) | 0) !== (((since - dt) / 250) | 0)) rebuildTrail(dNow);

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    setState,
    dispose() {
      controls.dispose();
      picker.dispose();
      tooltip.dispose();
      labels.dispose();
      if (trailLine) trailLine.geometry.dispose();
      if (pathGroup) pathGroup.traverse((o: any) => { o.geometry?.dispose?.(); });
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
