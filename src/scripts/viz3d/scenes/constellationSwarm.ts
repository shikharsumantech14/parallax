/* ============================================================================
   PARALLAX — `constellation-swarm` scene (space · FLAGSHIP).
   Blueprint: docs/design/blueprints/space/constellation-swarm.md — this file
   implements it 1:1; the blueprint is the contract. Shell math: kepler.ts
   (circularPeriodSec, R_EARTH) + the three closed-form placement lines, kept
   byte-identical with the build-time fallback in ConstellationSwarm.astro.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).

   The census, not a diagram: every shown craft is one instance in a SINGLE
   InstancedMesh (one draw call for the whole swarm) at its real orbital shell.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import { circularPeriodSec, R_EARTH, daysSinceJ2000 } from '../kepler';
import { makeOrbitControls, makePicker, makeTooltip } from '../helpers';
import { buildCountryGlobe, loadGeo, latLon, makeLabels } from './globe';

const DEG = Math.PI / 180;
const CAP = 6000;            // §10 instance cap — one InstancedMesh
const INSET = 0.42, BAND = 0.22; // §4 radial display mapping
const TIME_RATE_MIN = 90;   // §5 time compression: 1 s = 90 min
const TIME_COMPRESS = TIME_RATE_MIN * 60; // orbital seconds advanced per real second

interface ShellRec {
  name: string; altKm: number; inclDeg: number; count: number;
  color: string; shown: number; rho: number; omegaDisp: number; phi: number;
}

/* Per-shell display sampling (§3): identical formula in the fallback. */
function sampleShells(shells: any[]): { shown: number[]; total: number; sampled: boolean } {
  const counts = shells.map((s) => Math.max(0, Math.round(s.count) || 0));
  const total = counts.reduce((a, b) => a + b, 0);
  const sampled = total > CAP;
  const shown = counts.map((c) =>
    sampled ? Math.max(Math.min(c, 24), Math.round((c * CAP) / total)) : c,
  );
  return { shown, total, sampled };
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
  const altRaw = getComputedStyle(mount).getPropertyValue('--accent-alt').trim() || '#ffb347';
  const alt = new THREE.Color(altRaw);
  const disposables: any[] = [];

  /* ── data ── */
  const rawShells: any[] = Array.isArray(data.shells) ? data.shells.filter((s: any) => s && s.altKm > 0) : [];
  const spin: boolean = data.spin !== false;
  const epochISO: string = typeof data.epoch === 'string' ? data.epoch : '2026-01-01';
  const d0 = daysSinceJ2000(Date.parse(epochISO + (epochISO.length <= 10 ? 'T12:00:00Z' : '')));
  const seedDeg = 360 * (((d0 % 1) + 1) % 1); // epoch nudges phase (illustrative)

  const altVals = rawShells.map((s) => s.altKm);
  const altMin = Math.min(...altVals), altMax = Math.max(...altVals);
  const single = rawShells.length <= 1;
  const rhoOf = (alt: number) =>
    single ? 1 + INSET + BAND / 2 : 1 + BAND * (alt - altMin) / Math.max(1, altMax - altMin) + INSET;

  const defColor = (i: number) => (i === 0 ? colors.accent : i === 1 ? altRaw : colors.ink);
  const { shown } = sampleShells(rawShells);

  const shells: ShellRec[] = rawShells.map((s, i) => ({
    name: String(s.name ?? `Shell ${i + 1}`),
    altKm: s.altKm, inclDeg: s.inclDeg ?? 0, count: Math.round(s.count) || 0,
    color: typeof s.color === 'string' ? s.color : defColor(i),
    shown: shown[i],
    rho: rhoOf(s.altKm),
    omegaDisp: spin ? (2 * Math.PI / circularPeriodSec(s.altKm)) * TIME_COMPRESS : 0,
    phi: i * 11.7 * DEG,
  }));
  const rhoMax = shells.length ? Math.max(...shells.map((s) => s.rho)) : 1 + INSET + BAND;

  /* ── Earth (shared country-outline globe at R = 1) ── */
  buildCountryGlobe(THREE, group, colors, 1, disposables);
  const labels = makeLabels(THREE, mount);
  loadGeo().then((geo) => { if (geo) geo.labels.forEach((L) => labels.add(L.name, latLon(THREE, L.lat, L.lon, 1.01), 'country', 0)); });

  /* ── per-sat placement (§4 — identical to the fallback frontmatter) ─────────
     plane basis after inclination-about-X then RAAN-about-Y:
       u = (cosΩ, 0, -sinΩ)                       (the ν = 0 in-plane axis)
       w = (sin i·sinΩ, cos i, sin i·cosΩ)        (the ν = 90° in-plane axis)
     position = ρ·(cos ν·u + sin ν·w)                                        */
  const totalShown = shells.reduce((a, s) => a + s.shown, 0);
  const N = Math.max(1, totalShown);
  const ux = new Float32Array(N), uy = new Float32Array(N), uz = new Float32Array(N);
  const wx = new Float32Array(N), wy = new Float32Array(N), wz = new Float32Array(N);
  const rho = new Float32Array(N), nu0 = new Float32Array(N), omega = new Float32Array(N);
  const settleAt = new Float32Array(N);
  const shellOf = new Int16Array(N);

  // shell settle order: inner (lowest altitude) shell first (§5)
  const rankByAlt = shells
    .map((s, i) => ({ i, alt: s.altKm }))
    .sort((a, b) => a.alt - b.alt)
    .reduce((m, e, r) => { m[e.i] = r; return m; }, {} as Record<number, number>);

  let w = 0;
  shells.forEach((s, si) => {
    const planesData = rawShells[si]?.planes;
    const planes = Math.max(6, Math.min(72, planesData ? Math.round(planesData) : Math.round(Math.sqrt(s.count || 1))));
    const raanSpread = typeof rawShells[si]?.raanSpread === 'number' ? rawShells[si].raanSpread : 360;
    const satsPerPlane = Math.max(1, Math.ceil(s.shown / planes));
    const ci = Math.cos(s.inclDeg * DEG), sinI = Math.sin(s.inclDeg * DEG);
    const shellDelay = (rankByAlt[si] ?? si) * 50;
    for (let k = 0; k < s.shown; k++) {
      const p = k % planes, j = Math.floor(k / planes);
      const Omega = ((raanSpread / planes) * p) * DEG + s.phi;
      const nuDeg = 360 * (j / satsPerPlane) + 0.618 * p * 360 + seedDeg;
      const cO = Math.cos(Omega), sO = Math.sin(Omega);
      ux[w] = cO;            uy[w] = 0;   uz[w] = -sO;
      wx[w] = sinI * sO;     wy[w] = ci;  wz[w] = sinI * cO;
      rho[w] = s.rho;
      nu0[w] = (nuDeg % 360) * DEG;
      omega[w] = s.omegaDisp;
      settleAt[w] = shellDelay + 0.06 * k;
      shellOf[w] = si;
      w++;
    }
  });

  /* ── ONE InstancedMesh for the entire swarm (§4 / §10) ── */
  const boxGeo = new THREE.BoxGeometry(0.012, 0.012, 0.012);
  const boxMat = new THREE.MeshBasicMaterial();
  const swarm = new THREE.InstancedMesh(boxGeo, boxMat, N);
  swarm.frustumCulled = false;
  swarm.instanceColor = null;
  group.add(swarm);
  disposables.push(boxGeo, boxMat);
  // shell 2+ with no explicit data color → --ink @ 0.7 (§6): emulate the 0.7
  // opacity as a paper-ward lerp, since instance colours carry no alpha.
  const baseColors = shells.map((s, i) => {
    const col = new THREE.Color(s.color);
    if (i >= 2 && rawShells[i] && rawShells[i].color === undefined) col.lerp(paper, 0.3);
    return col;
  });
  const tmpCol = new THREE.Color();
  const dummy = new THREE.Object3D();

  // colour writer: hovered shell → toward white 0.3, others → toward paper 0.5
  function applyColors(hovered: number) {
    for (let i = 0; i < N; i++) {
      const si = shellOf[i];
      tmpCol.copy(baseColors[si]);
      if (hovered >= 0) {
        if (si === hovered) tmpCol.lerp(WHITE, 0.3);
        else tmpCol.lerp(paper, 0.5);
      }
      swarm.setColorAt(i, tmpCol);
    }
    if (swarm.instanceColor) swarm.instanceColor.needsUpdate = true;
  }
  const WHITE = new THREE.Color('#ffffff');
  applyColors(-1);

  /* ── 2 representative plane guides per shell (§4) at RAAN φ_s and φ_s+90° ── */
  const guides: { mat: any; start: number }[] = [];
  shells.forEach((s, si) => {
    const ci = Math.cos(s.inclDeg * DEG), sinI = Math.sin(s.inclDeg * DEG);
    const start = (rankByAlt[si] ?? si) * 50 + 500; // sweep after that shell's sats settle
    [s.phi, s.phi + Math.PI / 2].forEach((Omega) => {
      const cO = Math.cos(Omega), sO = Math.sin(Omega);
      const uX = cO, uZ = -sO;
      const wX = sinI * sO, wY = ci, wZ = sinI * cO;
      const pts: any[] = [];
      for (let t = 0; t <= 128; t++) {
        const th = (t / 128) * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th);
        pts.push(new THREE.Vector3(
          s.rho * (c * uX + sn * wX),
          s.rho * (sn * wY),
          s.rho * (c * uZ + sn * wZ),
        ));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
      group.add(new THREE.LineLoop(g, m));
      disposables.push(g, m);
      guides.push({ mat: m, start });
    });
  });

  /* ── controls / picking / tooltip ── */
  const controls = makeOrbitControls(canvas, { startPitch: 0.32, minZoom: 0.7, maxZoom: 2.8, autoRotate: true });
  const tooltip = makeTooltip(mount);
  let hovered = -1;
  const picker = makePicker(THREE, camera, canvas, [swarm], (obj, inst, x, y) => {
    if (!obj || inst === undefined) {
      if (hovered !== -1) { hovered = -1; applyColors(-1); }
      tooltip.hide();
      return;
    }
    const si = shellOf[inst] ?? 0;
    if (si !== hovered) { hovered = si; applyColors(si); }
    const s = shells[si];
    tooltip.show(
      `<b>${s.name}</b><br>${Math.round(s.altKm)} km · ${s.inclDeg}°<br>${s.count.toLocaleString()} satellites`,
      x, y,
    );
  });

  /* ── camera framing (copies orbitGlobe.fitCamera; frames ρ_max fully) ── */
  const halfTan = Math.tan((camera.fov * Math.PI) / 360);
  let camY = rhoMax * 0.28, camZ = 4.6;
  const fitCamera = () => {
    const dV = (rhoMax * 0.92) / halfTan;
    const dH = (rhoMax * 1.08) / (halfTan * Math.max(0.6, camera.aspect));
    camZ = Math.max(dV, dH, 4.6);
    camY = rhoMax * 0.28;
  };

  /* ── frame loop ── */
  let bootMs = -1, lastT = 0;
  return {
    resize(wpx: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(wpx, h, false);
      camera.aspect = wpx / h;
      camera.updateProjectionMatrix();
      fitCamera();
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
      camera.position.set(0, camY * z, camZ * z);
      camera.lookAt(0, 0, 0);

      // orbitBody begins after the ~1.2 s settle+sweep sequence (§5)
      const orbitSec = Math.max(0, (since - 1200) / 1000);

      for (let i = 0; i < N; i++) {
        const r = rho[i] + (shellOf[i] === hovered ? 0.02 : 0);
        const nu = nu0[i] + omega[i] * orbitSec;
        const c = Math.cos(nu), s = Math.sin(nu);
        dummy.position.set(
          r * (c * ux[i] + s * wx[i]),
          r * (s * wy[i]),
          r * (c * uz[i] + s * wz[i]),
        );
        // settle: scale 0 → 1, 500 ms smoothstep, shell-wave + within-shell stagger
        let sc = (since - settleAt[i]) / 500;
        sc = sc <= 0 ? 0.0001 : sc >= 1 ? 1 : sc * sc * (3 - 2 * sc);
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        swarm.setMatrixAt(i, dummy.matrix);
      }
      swarm.instanceMatrix.needsUpdate = true;

      // plane guides sweep in (opacity 0 → 0.16, 400 ms) after their shell
      for (const g of guides) {
        const p = (since - g.start) / 400;
        g.mat.opacity = 0.16 * (p <= 0 ? 0 : p >= 1 ? 1 : p);
      }

      picker.tick();
      renderer.render(scene, camera);
      labels.update(group, camera, mount.clientWidth, mount.clientHeight);
    },
    dispose() {
      controls.dispose();
      picker.dispose();
      tooltip.dispose();
      labels.dispose();
      swarm.dispose?.();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
};
