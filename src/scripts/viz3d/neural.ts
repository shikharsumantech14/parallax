/* ============================================================================
   PARALLAX — neural-network forward-pass math for the `neural-flow` scene.
   ----------------------------------------------------------------------------
   PURE functions, no three.js import (the scene passes THREE separately; this
   file is unit-testable math). Every formula mirrors docs/design/physics/
   mechanics-and-flow.md §5 and the neural-flow blueprint §4 1:1 — same symbols,
   same conventions. The sheet + blueprint are the spec; this file is the
   implementation. The SAME functions feed BOTH the live scene
   (scenes/neuralFlow.ts) and the component's build-time fallback SVG
   (NeuralFlow.astro), so sampling, layout, param math and the 96-edge shuffle
   are identical in each surface.

   Acceptance anchors (blueprint §4 / §11):
     paramCount([784,512,512,10]) = 669,706
     sampleShown(4096) → { shown: 256, every: 16 }
     sampleShown(1024) → { shown: 256, every: 4 }   (n >= 1024 samples)
     sampleShown(784)  → { shown: 784, every: 1 }
     layerLayout(784)  → { cols: 28, rows: 28, s: 0.05 }  (the input plane)
     Instance guard: eight 1000-unit layers → Σshown 8000 > 2048 → re-run at
       threshold 256 → shown 250 each, Σ 2000 ≤ 2048, chip "1 in 4".
   ============================================================================ */

export interface LayerSpec {
  n: number;      // true unit count, >= 1 (the honest number; sampling is display-only)
  label: string;  // short — <= 3 words
}

/* ── parameter count — Σ_{l=0}^{L-2} (n_l·n_{l+1} + n_{l+1}) (weights + biases) ── */
export function paramCount(ns: number[]): number {
  let total = 0;
  for (let l = 0; l < ns.length - 1; l++) {
    total += ns[l] * ns[l + 1] + ns[l + 1];
  }
  return total;
}

/* ── display sampling — large layers honestly down-sampled (blueprint §4) ──────
   every = n >= threshold ? ceil(n / cap) : 1 ; shown = ceil(n / every).
   Shown node k represents true unit k·every. (n >= threshold per physics §5 —
   a 1024-unit layer samples.) */
export function sampleShown(
  n: number,
  cap = 256,
  threshold = 1024,
): { shown: number; every: number } {
  const every = n >= threshold ? Math.ceil(n / cap) : 1;
  const shown = Math.ceil(n / every);
  return { shown, every };
}

/* ── per-layer grid layout in the Y–Z plane (blueprint §4) ─────────────────────
   shown <= 16 → a single vertical column (cols 1, rows shown, s 0.11).
   else a square-ish grid slab fitting a 1.4-scene-unit box.
   Node k → col c = k % cols, row r = floor(k / cols); local position
   y = ((rows-1)/2 - r)·s, z = (c - (cols-1)/2)·s. */
export function layerLayout(shown: number): { cols: number; rows: number; s: number } {
  if (shown <= 16) return { cols: 1, rows: shown, s: 0.11 };
  const cols = Math.ceil(Math.sqrt(shown));
  const rows = Math.ceil(shown / cols);
  const s = Math.min(0.06, 1.4 / Math.max(rows, cols));
  return { cols, rows, s };
}

/** Local (y, z) of shown-node k within a slab of the given layout. */
export function nodeLocal(
  k: number,
  layout: { cols: number; rows: number; s: number },
): { y: number; z: number } {
  const { cols, rows, s } = layout;
  const c = k % cols;
  const r = Math.floor(k / cols);
  return {
    y: ((rows - 1) / 2 - r) * s,
    z: (c - (cols - 1) / 2) * s,
  };
}

export interface ResolvedLayer {
  n: number;
  label: string;
  shown: number;
  every: number;
  layout: { cols: number; rows: number; s: number };
  paramsIn: number;   // n_{l-1}·n_l + n_l ; 0 for the input layer
  x: number;          // scene X, layers along X
}

export interface Resolved {
  layers: ResolvedLayer[];
  params: number;         // total parameter count
  sampled: boolean;       // any layer sampled (every > 1)
  maxEvery: number;       // largest `every` across layers (drives the chip)
  totalShown: number;     // Σ shown (post-guard)
  threshold: number;      // sampling threshold actually used (1024 or the guard's 256)
  L: number;
}

export const DX = 0.9; // layer spacing along X (blueprint §4)

/* Layer l of L sits at x_l = (l − (L−1)/2)·DX. */
export function layerX(l: number, L: number): number {
  return (l - (L - 1) / 2) * DX;
}

/* ── resolve the whole architecture (sampling + guard + layouts + params) ──────
   Deterministic + self-healing: if Σshown > 2048 at the default threshold,
   re-run sampling for ALL layers at threshold 256 (sample every layer >= 256).
   The scene and the fallback both call this with the same `ns`, so they never
   diverge. */
export function resolveArchitecture(specs: LayerSpec[], instanceCap = 2048): Resolved {
  const ns = specs.map((s) => Math.max(1, Math.round(s.n)));
  const L = ns.length;

  const sampleAt = (threshold: number) => ns.map((n) => sampleShown(n, 256, threshold));
  let threshold = 1024;
  let s = sampleAt(threshold);
  let totalShown = s.reduce((a, x) => a + x.shown, 0);
  if (totalShown > instanceCap) {
    threshold = 256;
    s = sampleAt(threshold);
    totalShown = s.reduce((a, x) => a + x.shown, 0);
  }

  const layers: ResolvedLayer[] = ns.map((n, l) => ({
    n,
    label: specs[l].label,
    shown: s[l].shown,
    every: s[l].every,
    layout: layerLayout(s[l].shown),
    paramsIn: l === 0 ? 0 : ns[l - 1] * n + n,
    x: layerX(l, L),
  }));

  const maxEvery = layers.reduce((m, x) => Math.max(m, x.every), 1);
  return {
    layers,
    params: paramCount(ns),
    sampled: maxEvery > 1,
    maxEvery,
    totalShown,
    threshold,
    L,
  };
}

/* ── the 96 sampled edges of one adjacent-layer gap (blueprint §4) ─────────────
   Edge e (0…95) joins from-node floor(e·shown_l/96) to to-node
   floor(((e·37) % 96)·shown_{l+1}/96). 37 ⊥ 96 — a deterministic
   pseudo-shuffle, identical in scene and fallback. */
export const EDGES_PER_GAP = 96;
export function gapEdges(shownFrom: number, shownTo: number): { from: number; to: number }[] {
  const out: { from: number; to: number }[] = [];
  for (let e = 0; e < EDGES_PER_GAP; e++) {
    const from = Math.floor((e * shownFrom) / EDGES_PER_GAP);
    const to = Math.floor((((e * 37) % EDGES_PER_GAP) * shownTo) / EDGES_PER_GAP);
    out.push({ from, to });
  }
  return out;
}

/* ── wave (the forward-pass loop) math (blueprint §5) ──────────────────────────
   Layer l fires at t_l = l·FIRE_MS. Node brightness
   b_l(t) = clamp01(1 − (t − t_l)/DECAY_MS) for t >= t_l, else 0.
   Gap-(l→l+1) edge envelope
   e_l(t) = clamp01((t − t_l)/FIRE_MS) · clamp01(1 − (t − t_{l+1})/DECAY_MS)
   — rises 0→1 over the FIRE_MS the crest takes to reach l+1, then decays with
   l+1's activation. Both take t in ms within a cycle (t = tMs mod wave_ms). */
export const FIRE_MS = 90;    // per-layer settle stagger (physics §5)
export const DECAY_MS = 450;  // activation decay window

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function layerBrightness(t: number, l: number): number {
  const tl = l * FIRE_MS;
  if (t < tl) return 0;
  return clamp01(1 - (t - tl) / DECAY_MS);
}

export function edgeEnvelope(t: number, l: number): number {
  const tl = l * FIRE_MS;
  const tl1 = (l + 1) * FIRE_MS;
  return clamp01((t - tl) / FIRE_MS) * clamp01(1 - (t - tl1) / DECAY_MS);
}

/** Index of the middle hidden layer — the frozen-wave frame of the composed
    still (blueprint §5): layer ceil((L−1)/2). */
export function middleLayer(L: number): number {
  return Math.ceil((L - 1) / 2);
}

/* ── wave-cycle period (ms), clamped 1500–8000, default 3000 (blueprint §3) ── */
export function waveMs(raw: number | undefined): number {
  const v = typeof raw === 'number' && isFinite(raw) ? raw : 3000;
  return Math.max(1500, Math.min(8000, v));
}

/* ── integer formatting with thin-space groups (blueprint §4 param readout) ──
   669706 → "669 706" (U+2009 thin spaces). Identical in scene + fallback. */
export function formatCount(n: number): string {
  const s = Math.round(n).toString();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ' ';
    out += s[i];
  }
  return out;
}
