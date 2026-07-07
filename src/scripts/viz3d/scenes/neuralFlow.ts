/* ============================================================================
   PARALLAX — `neural-flow` scene (tech · FLAGSHIP + world signature).
   Blueprint: docs/design/blueprints/tech/neural-flow.md — this file implements
   it 1:1; the blueprint is the contract. Math: neural.ts only.
   Takes THREE as a parameter; never imports three (lazy-chunk contract).

   ONE InstancedMesh carries every shown node across all layers (per-instance
   color, 1 draw call); one merged LineSegments per adjacent-layer gap carries
   its 96 sampled edges. The forward-pass wave loops with period `wave_ms`:
   nodes lerp base→accent by layerBrightness, gap edges lerp opacity by
   edgeEnvelope. Hover lifts + brightens a WHOLE layer (the layer is the unit
   of meaning). No setState in v1 — the wave is autonomous.
   ============================================================================ */
import type { SceneBuilder, SceneColors } from '../runtime';
import {
  resolveArchitecture, nodeLocal, gapEdges, EDGES_PER_GAP,
  layerBrightness, edgeEnvelope, middleLayer, waveMs, formatCount,
  type LayerSpec, type Resolved,
} from '../neural';
import { makeOrbitControls, makePicker, makeTooltip, makeInstanced } from '../helpers';
import { makeLabels } from './globe';

const NODE_BOX = 0.024;       // grid-slab node box edge (blueprint §4)
const COLUMN_SCALE = 1.8;     // column layers (shown <= 16) scale up ×1.8
const EDGE_REST = 0.10;       // --ink @ 0.10 at rest
const EDGE_CROSS = 0.55;      // --accent @ 0.55 while the wave crosses
const SETTLE_MS = 400;        // boot settle per node (--ease-snap cadence)
const LAYER_DELAY = 40;       // per-layer boot stagger (tech's tight cadence)
const HOVER_LIFT = 0.03;      // +Y lift on the hovered layer
const smoothstep = (t: number) => {
  const s = Math.max(0, Math.min(1, t));
  return s * s * (3 - 2 * s);
};

interface NodeRec { layer: number; k: number; ly: number; lz: number; settleAt: number; }

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
  // resting node color: --ink mixed 55% toward --paper (a resting node is dim)
  const restCol = ink.clone().lerp(paper, 0.55);
  const dimLayer = ink.clone().lerp(paper, 0.55); // dimmed non-hovered layers

  const disposables: any[] = [];

  /* ── data → resolved architecture (same math as the fallback) ── */
  const specs: LayerSpec[] = (Array.isArray(data.layers) ? data.layers : [])
    .filter((l: any) => l && typeof l.n === 'number' && l.n >= 1)
    .map((l: any) => ({ n: l.n, label: typeof l.label === 'string' ? l.label : '' }));
  const R: Resolved = resolveArchitecture(specs);
  const L = R.L;
  const cyclMs = waveMs(typeof data.wave_ms === 'number' ? data.wave_ms : undefined);

  /* ── build the flat node table (instanceId → {layer, k}) ── */
  const nodes: NodeRec[] = [];
  R.layers.forEach((ly, l) => {
    for (let k = 0; k < ly.shown; k++) {
      const p = nodeLocal(k, ly.layout);
      nodes.push({ layer: l, k, ly: p.y, lz: p.z, settleAt: l * LAYER_DELAY + 0.4 * k });
    }
  });
  const total = nodes.length;
  const isColumn = R.layers.map((ly) => ly.shown <= 16);

  /* ── ONE InstancedMesh for ALL shown nodes ── */
  const nodeGeo = new THREE.BoxGeometry(NODE_BOX, NODE_BOX, NODE_BOX);
  const nodeMat = new THREE.MeshBasicMaterial({});
  const inst = makeInstanced(THREE, nodeGeo, nodeMat, total, (i: number, dummy: any, setColor: (c: any) => void) => {
    const nd = nodes[i];
    dummy.position.set(R.layers[nd.layer].x, nd.ly, nd.lz);
    dummy.scale.setScalar(0.0001); // settle-in from zero
    setColor(restCol);
  });
  group.add(inst);
  disposables.push(nodeGeo, nodeMat);

  /* ── edges: one merged LineSegments per adjacent-layer gap (96 sampled) ── */
  interface GapRec { mat: any; }
  const gaps: GapRec[] = [];
  for (let l = 0; l < L - 1; l++) {
    const a = R.layers[l];
    const b = R.layers[l + 1];
    const edges = gapEdges(a.shown, b.shown);
    const pos = new Float32Array(EDGES_PER_GAP * 2 * 3);
    for (let e = 0; e < EDGES_PER_GAP; e++) {
      const pa = nodeLocal(edges[e].from, a.layout);
      const pb = nodeLocal(edges[e].to, b.layout);
      const o = e * 6;
      pos[o] = a.x; pos[o + 1] = pa.y; pos[o + 2] = pa.z;
      pos[o + 3] = b.x; pos[o + 4] = pb.y; pos[o + 5] = pb.z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0 }); // fade in after boot
    const seg = new THREE.LineSegments(g, m);
    group.add(seg);
    gaps.push({ mat: m });
    disposables.push(g, m);
  }

  /* ── layer labels: one per layer, 0.18 below each slab's bottom edge ── */
  const labels = makeLabels(THREE, mount);
  R.layers.forEach((ly, l) => {
    const rows = ly.layout.rows;
    const bottomY = -((rows - 1) / 2) * ly.layout.s; // lowest node's local y
    labels.add(ly.label || `layer ${l}`, new THREE.Vector3(ly.x, bottomY - 0.18, 0), 'data', 1);
  });

  /* ── param readout chip (HTML, pinned top-left) ── */
  const readout = document.createElement('div');
  readout.className = 'px-nflow__readout';
  readout.setAttribute('aria-hidden', 'true');
  const paramsStr = formatCount(R.params);
  const noteStr = typeof data.paramsNote === 'string' ? data.paramsNote : '';
  readout.innerHTML =
    `<span class="px-nflow__params vz-value"><b class="px-nflow__count">0</b> params</span>` +
    (noteStr ? `<span class="px-nflow__note vz-legend">${escapeHtml(noteStr)}</span>` : '');
  mount.appendChild(readout);
  const countEl = readout.querySelector('.px-nflow__count') as HTMLElement;

  /* ── wave-honesty chip (live only — a real pass is microseconds) ── */
  const waveChip = document.createElement('div');
  waveChip.className = 'px-nflow__chip';
  waveChip.setAttribute('aria-hidden', 'true');
  waveChip.textContent = `wave ≈ ${(cyclMs / 1000).toFixed(cyclMs % 1000 === 0 ? 0 : 1)}s / pass`;
  mount.appendChild(waveChip);

  /* ── controls / picking / tooltip ── */
  const controls = makeOrbitControls(canvas, {
    startPitch: 0.12, minZoom: 0.5, maxZoom: 2.4, autoRotate: false,
  });
  const tooltip = makeTooltip(mount);
  let hoverLayer = -1;
  const picker = makePicker(THREE, camera, canvas, [inst], (obj, instanceId, x, y) => {
    if (!obj || instanceId === undefined || instanceId === null) {
      hoverLayer = -1;
      tooltip.hide();
      return;
    }
    const nd = nodes[instanceId];
    hoverLayer = nd.layer;
    const ly = R.layers[nd.layer];
    const html = nd.layer === 0
      ? `<b>${escapeHtml(ly.label)}</b><br>${formatCount(ly.n)} units · input`
      : `<b>${escapeHtml(ly.label)}</b><br>${formatCount(ly.n)} units · ${formatCount(ly.paramsIn)} params in`;
    tooltip.show(html, x, y);
  });

  /* ── per-instance color scratch (base→accent lerp by brightness) ── */
  const nodeCol = new Array(total);
  for (let i = 0; i < total; i++) nodeCol[i] = restCol.clone();
  const tmpCol = new THREE.Color();

  /* ── frame loop ── */
  let bootMs = -1;
  let lastT = 0;
  let counted = false;
  const midL = middleLayer(L);
  const dummy = new THREE.Object3D();
  const lift = new Float32Array(total);
  const bootDone = (L - 1) * LAYER_DELAY + SETTLE_MS + 0.4 * (R.layers.length ? Math.max(...R.layers.map((x) => x.shown)) : 0);

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
      const k = Math.min(1, (8 * dt) / 1000); // settle constant

      controls.tick(dt);
      group.rotation.y = controls.s.yaw;
      group.rotation.x = controls.s.pitch;
      const z = 1 / controls.s.zoom;
      camera.position.set(0, 0.5 * z, 3.8 * z);
      camera.lookAt(0, 0, 0);

      // edges fade in 200 ms, after the last layer settles (entrance order §5)
      const edgeFade = smoothstep((since - bootDone) / 200);

      // param count-up (900 ms), starts with the last layer's settle
      const countStart = (L - 1) * LAYER_DELAY;
      if (!counted) {
        const ct = smoothstep((since - countStart) / 900);
        countEl.textContent = formatCount(R.params * ct);
        if (ct >= 1) { countEl.textContent = paramsStr; counted = true; }
      }

      // wave phase within the current cycle (starts once boot completes)
      const wavePhase = since > bootDone ? (since - bootDone) % cyclMs : -1;

      // node update: settle + wave brightness + hover lift/brighten
      for (let i = 0; i < total; i++) {
        const nd = nodes[i];
        const ly = R.layers[nd.layer];
        const baseScale = isColumn[nd.layer] ? COLUMN_SCALE : 1;

        // boot settle: scale 0 → 1 (smoothstep, no overshoot)
        const s = smoothstep((since - nd.settleAt) / SETTLE_MS);
        dummy.scale.setScalar(Math.max(0.0001, s) * baseScale);

        // hoverLift: the picked layer lifts +HOVER_LIFT Y
        const liftTarget = hoverLayer === nd.layer ? HOVER_LIFT : 0;
        lift[i] += (liftTarget - lift[i]) * k;
        dummy.position.set(ly.x, nd.ly + lift[i], nd.lz);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);

        // color: hover overrides wave; otherwise wave crest lerps base→accent
        if (hoverLayer >= 0) {
          if (nd.layer === hoverLayer) tmpCol.copy(accent).lerp(paper, 0.1); // accent @ 0.9
          else tmpCol.copy(dimLayer);                                        // others dim to 0.55
        } else {
          const b = wavePhase >= 0 ? layerBrightness(wavePhase, nd.layer) : 0;
          tmpCol.copy(restCol).lerp(accent, b);
        }
        nodeCol[i].lerp(tmpCol, k);
        inst.setColorAt(i, nodeCol[i]);
      }
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;

      // edges: rest ink @ 0.10 → accent @ 0.55 by the crossing envelope
      for (let l = 0; l < gaps.length; l++) {
        const env = hoverLayer < 0 && wavePhase >= 0 ? edgeEnvelope(wavePhase, l) : 0;
        const target = (EDGE_REST + (EDGE_CROSS - EDGE_REST) * env) * edgeFade;
        const mat = gaps[l].mat;
        mat.opacity += (target - mat.opacity) * k;
        // recolor toward accent as the crest crosses (ink at rest, accent on cross)
        mat.color.copy(ink).lerp(accent, env);
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
      readout.remove();
      waveChip.remove();
      disposables.forEach((d) => d.dispose && d.dispose());
      inst.dispose();
      renderer.dispose();
    },
  };
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}
