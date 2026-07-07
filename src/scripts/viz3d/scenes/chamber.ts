/* ============================================================================
   PARALLAX — `chamber` scene (politics · FLAGSHIP + world signature).
   Blueprint: docs/design/blueprints/politics/chamber.md — this file
   implements it 1:1; the blueprint is the contract. Math: hemicycle.ts only.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).

   One InstancedMesh carries every seat (per-instance party colors, 1 draw
   call); `setState('composition' | 'division')` walks the seats to the Aye/No
   lobbies with the staggered `settle` curve (motion.md stateSwitch).
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import {
  hemicycleSeats, lobbyGrid, lobbyCols, rowsFor,
  R0, ROW_GAP, SEAT_W, SEAT_H, SEAT_D, LOBBY_SPACING,
} from '../hemicycle';
import { makeOrbitControls, makePicker, makeTooltip, makeInstanced } from '../helpers';
import { makeLabels } from './globe';

interface Party {
  name: string;
  seats: number;
  color?: string;
  side?: 'gov' | 'opp' | 'cross';
  short?: string;
}

const SIDE_RANK: Record<string, number> = { gov: 0, cross: 1, opp: 2 };
const SEAT_Y = SEAT_H / 2; // blocks rest on the paper plane (y = 0)

const smoothstep = (t: number) => {
  const s = Math.max(0, Math.min(1, t));
  return s * s * (3 - 2 * s);
};

export const build: SceneBuilder = (THREE, canvas, data, colors: SceneColors) => {
  const mount = canvas.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const ink = new THREE.Color(colors.ink);
  const paper = new THREE.Color(colors.paper);
  const accent = new THREE.Color(colors.accent);
  const safeColor = (raw: string | undefined, fallback: any) =>
    raw && /^(#|rgb|hsl)/.test(raw.trim()) ? new THREE.Color(raw.trim()) : fallback.clone();
  const alt = safeColor(getComputedStyle(mount).getPropertyValue('--accent-alt'), accent);
  const rule = safeColor(getComputedStyle(mount).getPropertyValue('--rule'), ink.clone().lerp(paper, 0.7));

  const disposables: any[] = [];

  /* ── data ── */
  const rawParties: Party[] = (Array.isArray(data.parties) ? data.parties : [])
    .filter((p: any) => p && typeof p.name === 'string' && typeof p.seats === 'number' && p.seats > 0);
  // wedge order: gov left → cross → opp right (stable within a side)
  const parties = rawParties
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (SIDE_RANK[a.p.side ?? 'cross'] - SIDE_RANK[b.p.side ?? 'cross']) || a.i - b.i)
    .map((x) => x.p);
  const total = parties.reduce((s, p) => s + p.seats, 0);
  if (total === 0) throw new Error('chamber: no seats');
  const rows: number = data.chamber?.rows ?? rowsFor(total);
  const arcDeg: number = data.chamber?.arcDeg ?? 210;
  const majority: number = typeof data.majority === 'number' ? data.majority : Math.floor(total / 2) + 1;
  const division = data.division && data.division.aye && data.division.no ? data.division : null;

  /* party colors — data encoding (CANON §6 exemption); fallback cycle:
     accent, accent-alt, then ink @ 0.7/0.5/0.35 (mixed toward paper). */
  const fallbackCycle = [
    accent.clone(),
    alt.clone(),
    ink.clone().lerp(paper, 0.3),
    ink.clone().lerp(paper, 0.5),
    ink.clone().lerp(paper, 0.65),
  ];
  let fb = 0;
  const partyColor = parties.map((p) => (p.color ? safeColor(p.color, accent) : fallbackCycle[fb++ % fallbackCycle.length]));

  /* ── seats: α-sorted anchors + contiguous wedge assignment ── */
  const anchors = hemicycleSeats(total, rows, arcDeg);
  const seatParty = new Array<number>(total);
  {
    let i = 0;
    parties.forEach((p, k) => { for (let n = 0; n < p.seats; n++) seatParty[i++] = k; });
  }
  // j within row (α order) for the boot row-waves
  const rowJ = new Array<number>(total);
  {
    const perRow = new Array(rows).fill(0);
    anchors.forEach((a, i) => { rowJ[i] = perRow[a.row]++; });
  }

  const basePos = anchors.map((a) => new THREE.Vector3(a.x, SEAT_Y, a.z));

  /* ── division targets: lobby grids (Aye x<0, No x>0), absent stay seated ── */
  const divTarget = basePos.map((v: any) => v.clone());
  const absent = new Array<boolean>(total).fill(false);
  if (division) {
    const ayeSeats: number[] = [];
    const noSeats: number[] = [];
    let i = 0;
    for (let k = 0; k < parties.length; k++) {
      const p = parties[k];
      const a = Math.max(0, Math.min(p.seats, Math.round(division.aye[p.name] ?? 0)));
      const n = Math.max(0, Math.min(p.seats - a, Math.round(division.no[p.name] ?? 0)));
      for (let s = 0; s < p.seats; s++, i++) {
        if (s < a) ayeSeats.push(i);
        else if (s < a + n) noSeats.push(i);
        else absent[i] = true; // absent = total − aye − no: seated, dimmed
      }
    }
    // grid fitted to the blueprint's lobby band (x −1.3…−0.4, mirrored):
    // spacing clamps below LOBBY_SPACING when the lobby outgrows the band.
    const assign = (seatIdx: number[], sideSign: -1 | 1) => {
      const n = seatIdx.length;
      if (!n) return;
      const cols = lobbyCols(n);
      const dx = Math.min(LOBBY_SPACING, 0.9 / Math.max(1, cols - 1));
      const rowsDeep = Math.ceil(n / cols);
      const dz = Math.min(LOBBY_SPACING, 1.1 / Math.max(1, rowsDeep - 1));
      const x0 = sideSign * 0.85 - ((cols - 1) * dx) / 2;
      const grid = lobbyGrid(n, cols, x0, 0.35, dx, dz);
      seatIdx.forEach((si, gi) => divTarget[si].set(grid[gi].x, SEAT_Y, grid[gi].z));
    };
    assign(ayeSeats, -1); // Aye lobby left of the rostrum
    assign(noSeats, 1);   // No lobby mirrored right
  }

  /* ── the instanced mesh: ONE mesh, per-instance party colors ── */
  const seatGeo = new THREE.BoxGeometry(SEAT_W, SEAT_H, SEAT_D);
  const seatMat = new THREE.MeshBasicMaterial({});
  const inst = makeInstanced(THREE, seatGeo, seatMat, total, (i: number, dummy: any, setColor: (c: any) => void) => {
    dummy.position.copy(basePos[i]);
    dummy.scale.setScalar(0.0001); // settle-in from zero
    setColor(partyColor[seatParty[i]]);
  });
  group.add(inst);
  disposables.push(seatGeo, seatMat);

  /* ── majority arc: dashed ink line beyond the outer row ── */
  const rArc = R0 + rows * ROW_GAP + 0.12;
  const theta = (arcDeg * Math.PI) / 180;
  let arcMat: any;
  {
    const pts: any[] = [];
    for (let k = 0; k <= 96; k++) {
      const a = -theta / 2 + (theta * k) / 96;
      pts.push(new THREE.Vector3(rArc * Math.sin(a), 0.01, -rArc * Math.cos(a)));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineDashedMaterial({
      color: ink, transparent: true, opacity: 0.42, dashSize: 0.04, gapSize: 0.03,
    });
    const line = new THREE.Line(g, m);
    line.computeLineDistances();
    group.add(line);
    disposables.push(g, m);
    arcMat = m;
  }

  /* ── rostrum: low paper plinth at origin, --rule edge line ── */
  {
    const g = new THREE.BoxGeometry(0.3, 0.05, 0.18);
    const m = new THREE.MeshBasicMaterial({ color: paper });
    const plinth = new THREE.Mesh(g, m);
    plinth.position.set(0, 0.025, 0);
    group.add(plinth);
    const eg = new THREE.EdgesGeometry(g);
    const em = new THREE.LineBasicMaterial({ color: rule, transparent: true, opacity: 0.9 });
    plinth.add(new THREE.LineSegments(eg, em));
    disposables.push(g, m, eg, em);
  }

  /* ── MAJORITY label (label layer, priority 2) ── */
  const labels = makeLabels(THREE, mount);
  labels.add(`MAJORITY · ${majority}`, new THREE.Vector3(0, 0.06, -rArc), 'data', 2);

  /* ── controls / picking / tooltip ── */
  const controls = makeOrbitControls(canvas, {
    startPitch: 0.55, minZoom: 0.48, maxZoom: 2.8, autoRotate: false,
  });
  const tooltip = makeTooltip(mount);
  let hoverParty = -1;
  const picker = makePicker(THREE, camera, canvas, [inst], (obj, instanceId, x, y) => {
    if (!obj || instanceId === undefined || instanceId === null) {
      hoverParty = -1;
      tooltip.hide();
      return;
    }
    const k = seatParty[instanceId];
    hoverParty = k;
    const p = parties[k];
    const pct = Math.round((p.seats / total) * 100);
    let html = `<b>${p.short ?? p.name}</b><br>${p.seats} seats · ${pct}%`;
    if (division) {
      const a = Math.round(division.aye[p.name] ?? 0);
      const n = Math.round(division.no[p.name] ?? 0);
      html += `<br>Aye ${a} · No ${n}`;
    }
    tooltip.show(html, x, y);
  });

  /* ── state (composition ↔ division): staggered settle walk ── */
  let state: 'composition' | 'division' = 'composition';
  const cur = basePos.map((v: any) => v.clone());
  const from = basePos.map((v: any) => v.clone());
  let walkAt = -1;      // tMs when the current walk started (-1 = idle)
  let walkPending = false;
  function setState(name: string) {
    const next = name === 'division' ? 'division' : name === 'composition' ? 'composition' : null;
    if (!next || next === state || (next === 'division' && !division)) return;
    state = next;
    for (let i = 0; i < total; i++) from[i].copy(cur[i]);
    walkPending = true; // walkAt is stamped on the next frame
  }

  /* ── per-frame color targets (party / absent-dim / hover-dim) ── */
  const seatCol = new Array(total);
  const dimAbsent = partyColor.map((c) => c.clone().lerp(paper, 0.75)); // §6: 75% toward paper
  for (let i = 0; i < total; i++) seatCol[i] = partyColor[seatParty[i]].clone();
  const tmpCol = new THREE.Color();

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;
  const dummy = new THREE.Object3D();
  const lift = new Float32Array(total); // hoverLift +0.04 Y, settled

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
      const k = Math.min(1, (8 * dt) / 1000); // settle constant (physics §6)

      controls.tick(dt);
      // idle dolly sway — records don't spin (blueprint §4): absolute offset
      // on top of the dragged yaw, so dragging never fights the sway.
      const sway = controls.s.dragging ? 0 : 0.06 * Math.sin(tMs / 9000);
      group.rotation.y = controls.s.yaw + sway;
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(0, 2.2 * z, 3.4 * z);
      camera.lookAt(0, 0, -0.3);

      // stateSwitch walk (600 ms settle, 0.8 ms·index stagger — ≤1.2 s total)
      if (walkPending) { walkAt = tMs; walkPending = false; }
      const targets = state === 'division' ? divTarget : basePos;
      const walking = walkAt >= 0;
      // majority arc: fades to 0.15 in division (threshold moved to the lobbies)
      const arcTarget = state === 'division' ? 0.15 : 0.42;
      arcMat.opacity += (arcTarget - arcMat.opacity) * k;

      for (let i = 0; i < total; i++) {
        if (walking) {
          const t = smoothstep((tMs - walkAt - 0.8 * i) / 600);
          cur[i].lerpVectors(from[i], targets[i], t);
        }
        // hoverLift: the picked party's instances lift +0.04 Y
        const liftTarget = hoverParty >= 0 && seatParty[i] === hoverParty ? 0.04 : 0;
        lift[i] += (liftTarget - lift[i]) * k;

        // boot settle: row waves — delay row·60ms + j·1.5ms, 500 ms smoothstep
        const s = smoothstep((since - (anchors[i].row * 60 + rowJ[i] * 1.5)) / 500);
        dummy.position.set(cur[i].x, cur[i].y + lift[i], cur[i].z);
        dummy.scale.setScalar(Math.max(0.0001, s));
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);

        // color: base → absent-dim (division) → hover-dim of other parties
        const p = seatParty[i];
        tmpCol.copy(state === 'division' && absent[i] ? dimAbsent[p] : partyColor[p]);
        if (hoverParty >= 0 && p !== hoverParty) tmpCol.lerp(paper, 0.45); // dim to 0.55
        seatCol[i].lerp(tmpCol, k);
        inst.setColorAt(i, seatCol[i]);
      }
      if (walking && tMs - walkAt > 600 + 0.8 * total) walkAt = -1; // walk finished
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;

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
      disposables.forEach((d) => d.dispose && d.dispose());
      inst.dispose();
      renderer.dispose();
    },
  };
};
