# Blueprint — `neural-flow` (tech · WebGL · FLAGSHIP + world signature)

> THE tech hero: a real (small) network's forward pass, rendered as the
> machine it is. Every unit of every layer is an instanced node at the
> layer's true size (large layers honestly sampled, and labeled so), and an
> activation wave sweeps the columns layer-by-layer — the build log of a
> thought. "The reader watches the actual computation, not a diagram of one."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `neural-flow` |
| World | tech |
| Tier | WebGL (instanced + picking) |
| Component | `src/components/topic/tech/NeuralFlow.astro` |
| Scene module | `src/scripts/viz3d/scenes/neuralFlow.ts` |
| Shared math | `src/scripts/viz3d/neural.ts` (NEW pure module, kepler.ts-style — no three import; feeds BOTH the scene and the component's build-time fallback SVG, so sampling/layout/param math is identical in each) |
| CSS prefix | `px-nflow` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `chamber.ts` (instanced blocks + picking + label patterns), `solarSystem.ts` (settle-in, tooltip) |

## 2. What it shows / when to use

What a neural network physically is — layers of units at their real relative
sizes — and what a forward pass physically does: activation sweeping from
input to output. The parameter count is computed from the architecture, on
screen, so scale claims are earned.

- **USE WHEN:** the dossier has a real architecture — ordered layer sizes
  (2–8 layers, each with a unit count and a name) from a named model/paper
  (e.g. the MNIST MLP, a transformer block's MLP, a policy head). The story
  hinges on scale, structure, or "what happens in one pass".
- **DON'T USE:** layered *system* structure with no units (→ `arch-stack`);
  model benchmark scores (→ `benchmark-chart`); parameter growth across
  model generations (→ `scaling-plot`, or `moore-ladder` if it's
  transistors); request timing (→ `latency-waterfall`).
- **Pairs with:** `layout: split` as the issue hero — prose walks the pass
  while the wave loops; `wide` standalone. Never adjacent to another WebGL
  kind. Never `bleed` (the figure is wider than tall; bleed adds nothing).

## 3. Data schema

```ts
interface NeuralFlowData {
  layers: Array<{
    n: number;        // true unit count, ≥1 (this is the honest number; sampling is display-only)
    label: string;    // short — ≤3 words ("input 28×28", "hidden 1", "digits 0–9")
  }>;                 // 2–8 layers; build error outside that range
  paramsNote?: string; // one-line context, ≤8 words ("MNIST classifier · 98.4% test")
  wave_ms?: number;    // full wave-cycle period in ms; default 3000, clamped 1500–8000
  caption?: string;    // every viz kind
  source?: string;     // every viz kind
}
```

```yaml
# example payload (the classic MNIST MLP — LeCun-style 784-512-512-10)
layers:
  - { n: 784, label: "input 28×28" }
  - { n: 512, label: "hidden 1" }
  - { n: 512, label: "hidden 2" }
  - { n: 10,  label: "digits 0–9" }
paramsNote: "MNIST classifier · ~98% test accuracy"
caption: "Two hidden layers and 669,706 weights — everything this machine will ever know about handwriting."
source: "LeCun et al., MNIST benchmark architecture"
```

**Data flags with visual consequences (CANON §7):**
- Any layer with `n >= 1024` is sampled for display (see §4; matches physics
  §5 "≥1024-unit layers"). The component
  AUTO-RENDERS the caption chip `` sampled — showing 1 in {maxEvery} ``
  (maxEvery = the largest `every` across layers), and each sampled layer's
  legend row states its own ratio ("512 of 4096 · 1 in 8").
- The live scene AUTO-RENDERS the chip `` wave ≈ {wave_ms/1000}s / pass ``
  (time-compression honesty — a real pass is microseconds).
- Parameter count is **computed, never authored** (schema has no field for
  it) — `Σ (n_l·n_{l+1} + n_{l+1})` per `physics/mechanics-and-flow.md` §5.

## 4. Geometry spec

**`neural.ts` (the shared pure math — mirrors `physics/mechanics-and-flow.md` §5):**

- `paramCount(ns: number[]): number` = `Σ_{l=0}^{L-2} (n_l·n_{l+1} + n_{l+1})`
  (weights + biases). **Acceptance anchor:** `[784, 512, 512, 10]` →
  401,920 + 262,656 + 5,130 = **669,706**.
- `sampleShown(n, cap = 256, threshold = 1024): { shown, every }` —
  `every = n >= threshold ? ceil(n / cap) : 1`; `shown = ceil(n / every)`.
  Shown node k represents true unit `k·every`. Anchors: n = 4096 →
  every 16, shown 256; n = 3000 → every 12, shown 250; n = 1024 →
  every 4, shown 256; n = 784 → every 1, shown 784. *(Corrected 2026-07-06:
  the condition was `n > threshold` (strictly greater), which left a layer of
  exactly 1024 units unsampled and un-chipped — but `physics/
  mechanics-and-flow.md` §5 mandates sampling "≥1024-unit layers". Changed to
  `n >= threshold` so n = 1024 samples (every 4, shown 256, chip fires), matching
  the sheet symbol-for-symbol; the 784 and 4096 anchors are unchanged.)*
  **Instance guard:** if `Σ shown > 2048`, re-run with `threshold = 256`
  (i.e. sample every layer `≥ 256`) — deterministic, self-healing; chips
  update accordingly.
- `layerLayout(shown): { cols, rows, s }` — if `shown ≤ 16`: a single
  vertical column, `cols = 1, rows = shown, s = 0.11`. Else a square-ish
  grid slab: `cols = ceil(√shown)`, `rows = ceil(shown/cols)`,
  spacing `s = min(0.06, 1.4 / max(rows, cols))` (every slab fits a
  1.4-scene-unit box). Node k → col `c = k % cols`, row `r = floor(k/cols)`;
  local position `y = ((rows−1)/2 − r)·s`, `z = (c − (cols−1)/2)·s`.
  Anchors: shown 784 → **28×28 grid, s 0.05** (the MNIST input literally
  becomes the 28×28 image plane); shown 512 → 23×23, s 0.06; shown 10 →
  1×10 column, s 0.11.

**Scene (Y-up, layers along X):**

- Layer l of L sits at `x_l = (l − (L−1)/2)·DX`, **DX = 0.9**. Each layer is
  a grid slab in the Y–Z plane per `layerLayout`.
- **Nodes:** ONE `makeInstanced` box mesh for ALL shown nodes across all
  layers (instanceId → {layer, k} lookup table for picking). Box
  `0.024 × 0.024 × 0.024` (grid slabs) — column layers (`shown ≤ 16`) scale
  instances ×1.8. Base instance color `--ink` mixed 55% toward `--paper`
  (a resting node is dim); wave and hover recolor via `setColorAt` lerp.
- **Edges:** between each adjacent layer pair, exactly **96 sampled
  connections** as one merged `LineSegments` per gap: edge e (0…95) joins
  from-node `floor(e·shown_l/96)` to to-node
  `floor(((e·37) % 96)·shown_{l+1}/96)` (37 ⊥ 96 — deterministic
  pseudo-shuffle, identical in fallback). `--ink` @ 0.10 at rest.
- **Param readout:** HTML mono chip pinned top-left of the mount:
  `{paramCount formatted with thin-space groups} params`, `.vz-value`
  sizing; `paramsNote` beneath it in `.vz-legend` muted. Layer labels via
  the shared `viz3d__label` layer, one per layer, anchored 0.18 below each
  slab's bottom edge, priority 1 (they never collide — L ≤ 8).
- **Camera:** PerspectiveCamera FOV 38, position `(0, 0.5, 3.8)·zoom`,
  lookAt `(0, 0, 0)`. `makeOrbitControls`: startPitch 0.12 (near-frontal —
  the figure reads as a printed diagram first), minZoom 0.75, maxZoom 2.2,
  **autoRotate: false** (tech register: a build log doesn't spin; the wave
  is the world-sanctioned ambient motion — `worlds/tech.md`).
- **375px:** same scene at zoom 0.85 initial; labels handled by the label
  layer; picking targets are whole slabs (see §8) so no hit-size issue.

## 5. Motion spec (names from motion.md)

- **Boot:** nodes `settle` (scale 0→1, 400 ms at `--ease-snap` — the named
  overshoot-free settle curve at tech's faster cadence, cf. `worlds/tech.md`
  "grow for bars, fast 400ms") in per-layer waves left→right, layer delay
  **40 ms** (tech's tight mechanical stagger), within-layer delay `+0.4 ms·k`;
  full sequence ≤ 1.2 s. `countup` on the param readout (900 ms) starts with
  the last layer's settle. *(Corrected 2026-07-06: was "400 ms smoothstep" —
  "smoothstep" names a curve outside the motion.md token set; `--ease-snap` is
  the sanctioned settle easing (also overshoot-free) and keeps the boot inside
  the named vocabulary.)*
- **The wave** (the ONE ambient motion; sanctioned by `worlds/tech.md` for
  this kind): a forward pass loops with period `wave_ms` (default 3000).
  Within a cycle, layer l "fires" at `t_l = l·90 ms`
  (`physics/mechanics-and-flow.md` §5: settle stagger 90 ms/layer);
  brightness `b_l(t) = clamp01(1 − (t − t_l)/450)` for `t ≥ t_l`, else 0
  (`clamp01(x) = max(0, min(1, x))`). Node color lerps base→`--accent` by
  `b_l`. The gap-(l→l+1) edge lights while the crest travels from layer l to
  layer l+1: define the crossing envelope `e_l(t) = clamp01((t − t_l)/90) ·
  clamp01(1 − (t − t_{l+1})/450)` — a ramp that rises 0→1 over the 90 ms it
  takes the crest to reach l+1 (`t_{l+1} − t_l = 90 ms`), then decays with
  l+1's activation. The edge material lerps its opacity `0.10 → 0.55` by
  `e_l(t)`. *(Corrected 2026-07-06: the earlier formula
  `min(b_l, 1 − (t − t_{l+1})/450 …)` was under-specified — it trailed off in
  an ellipsis and left the rising edge and clamping undefined. `e_l(t)` above
  is the complete, deterministic replacement; peaks near `t = t_{l+1}` when the
  crest bridges the gap.)* Dead time after the last layer's decay to the cycle
  end is intentional rest. Anchor: L = 4 → output layer fires 270 ms into each
  cycle; the final gap edge (l = 2→3) peaks near t = 270 ms.
- `hoverLift`: picking any node lifts and brightens its WHOLE layer
  (+0.03 Y, color → accent @ 0.9); other layers dim to 0.55; tooltip
  follows (§8).
- **Composed still (reduced-motion / print / fallback):** all layers
  settled, the wave FROZEN at the middle hidden layer — layer
  `ceil((L−1)/2)` at full accent brightness, its inbound edge gap at 0.55 —
  plus labels and the param readout. Reduced-motion never boots WebGL; the
  build-time fallback SVG IS this frame, computed with the same `neural.ts`.
- Entrance order: nodes settle → edges fade in (200 ms, after last layer) →
  param `countup` → wave begins. No `stamp`.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| resting nodes | `--ink` mixed 55% toward `--paper` (≈ ink @ 0.45 on the dark panel) |
| firing nodes (wave crest) | `--accent` @ 1.0 (lime = throughput — the pass IS throughput) |
| edges at rest / while wave crosses | `--ink` @ 0.10 / `--accent` @ 0.55 |
| hovered layer / dimmed others | `--accent` @ 0.9 / others ink-mix @ 0.55 |
| param readout value / note | `--accent` @ 1.0 mono / `--muted` |
| layer labels, tooltip | shared `viz3d__label` / `.viz3d__tip` |

No pink (`--accent-alt`) anywhere in v1 — there is no failure state in a
forward pass. No per-layer colors from data; the two-tone discipline
(dim ink machine + lime activation) IS the design.

## 7. Fallback design (first-class)

Build-time SVG computed with the SAME `neural.ts` (same sampling, same
layouts, same 96-edge pseudo-shuffle), viewBox `0 0 720 360`:

- **Projection:** shallow isometric so slab grids stay visible —
  `px = 360 + (x − z·0.36)·150`, `py = 168 − (y + z·0.16)·150`
  (all extents verified to fit: widest case ±239 px of center).
- Nodes as 1.6 px-radius circles (column layers 2.6 px), edges as 0.75 px
  lines @ 0.10; the composed still's frozen wave painted (middle hidden
  layer lime @ 1.0, its inbound edges @ 0.55).
- Layer labels in mono 9.5 px with paper halo, centered 12 px under each
  slab (bottom 40 px of the viewBox is reserved for them — labels never
  leave the box). Param readout + `paramsNote` as static HTML above.
- **Legend list** (the AT-readable data source), `.vz-legend` rows, one per
  layer: `{label} · {n} units · {params_in} params in` (input row: "input").
  Sampled rows append `· showing 1 in {every}`. **Rows ≤ 5 visible; layers
  6–8 collapse behind a "show all layers" disclosure**
  (REVIEW-2026-07-05 amendment 3).
- Caption chips (`sampled — showing 1 in N` when sampling; never the wave
  chip — nothing is moving) via the standard `.px-viz__cap` pattern.

## 8. Interaction spec

- Drag = rotate (pitch clamp ±0.9, but startPitch 0.12 keeps it a diagram),
  wheel/pinch = zoom (0.75–2.2), `touch-action: pan-y`. Hint chip:
  `drag to inspect · scroll to zoom`.
- Hover/tap any node → layer-level tooltip (the layer is the unit of
  meaning):
  `<b>{label}</b><br>{n} units · {params_in} params in`
  where `params_in = n_{l−1}·n_l + n_l` (input layer: `{n} units · input`).
  Anchor: hovering hidden 1 shows "hidden 1 — 512 units · 401,920 params in".
- No state chips, no slider — the wave is autonomous. (One-control rule
  kept at zero controls; `setState` hooks reserved for a future
  `'pause'|'play'` chapter use, unimplemented in v1.)
- Keyboard/AT: canvas `aria-hidden`; the legend list + param readout carry
  the full data; the plain line explains the form.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Each column is one layer of the
  network and every dot is one unit, at true layer sizes. The lime wave is
  a single forward pass moving from input to answer."
- **how** (ExpandModal): "Drag to look around the layers. Hover any column
  for its unit and weight counts."
- Caption guidance: state the scale/structure claim ("two hidden layers and
  669,706 weights…"), never restate the form. Text budget at rest —
  param chip + note + ≤8 short layer labels + caption + plain — must stay
  ≤ 80 words (REVIEW amendment 3); layer labels are capped at 3 words each
  for this reason.

## 10. Performance budget

| Budget | Cap |
|---|---|
| Instances | ≤ 2048 (one InstancedMesh; guard in §4 enforces) |
| Vertices | ≤ 30k (24-vert box × instancing + 7 × 96 edge segments) |
| Draw calls | ≤ 12 (1 instanced mesh + ≤7 edge LineSegments + occluder-free) |
| SVG nodes (fallback) | ≤ 2400 (static circles; justified over the usual 900 — the true-size honesty IS the point, and the SVG is inert) |
| `data` payload | ≤ 1 KB |
| Extra assets | none (no geo fetch, no textures) |

Scene is its own lazy chunk via the scenes registry — no eager imports.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight: silhouette · 375px · reduced-motion
      still = fallback SVG · token grep · caption+source+plain · lazy boot +
      dispose + chunk isolation · payload degradation · prefix unique)
- [ ] `paramCount([784,512,512,10])` = 669,706, and the readout shows it
      (grep the component: no hardcoded param literal)
- [ ] `sampleShown(4096)` → shown 256, every 16; chip reads
      `sampled — showing 1 in 16`; an all-**<1024** payload (every layer
      strictly under 1024) renders NO chip; a 1024-unit layer DOES sample
      (every 4) and chips (`n >= 1024` per physics §5)
- [ ] `layerLayout(784)` → 28×28 grid at s = 0.05 (the input plane)
- [ ] Instance guard fires on the case that actually overflows: **eight
      1000-unit layers** (each < 1024, so unsampled at the default threshold →
      Σ shown = 8×1000 = 8000 > 2048) → guard re-runs at threshold 256 → every
      layer samples to shown 250, Σ shown = 2000 ≤ 2048, build succeeds, and the
      chip reads `sampled — showing 1 in 4`. *(Corrected 2026-07-06: the earlier
      witness "eight 4096-unit layers" does NOT exercise the guard — 4096 ≥ 1024
      already samples each layer to shown 256 at the default threshold, Σ = 2048,
      which is not > 2048, so the re-run never fires. The genuine trigger is many
      layers in [256, 1024) that render unsampled — eight 1000-unit layers is the
      canonical witness. Note: exactly-1024 layers now sample under the `>=1024`
      rule, so they too do not trigger the guard.)*
- [ ] Wave: with 4 layers the output column brightens 270 ms after the
      input column, every cycle; cycle period = `wave_ms`
- [ ] Live scene renders chip `wave ≈ 3s / pass`; fallback does not
- [ ] Hovering hidden 1 lifts the whole column and shows
      "hidden 1 — 512 units · 401,920 params in"
- [ ] Fallback SVG: identical layout/sampling to the scene (diff the
      `neural.ts` call inputs), frozen wave on the middle hidden layer,
      legend collapses past 5 rows
- [ ] One InstancedMesh for all nodes; draw calls ≤ 12 (renderer.info in a
      debug log — remove after)
- [ ] `layers.length` of 1 or 9 fails the build with a message naming the
      2–8 rule

---

*Registry duties (P6, at implementation — NOT now): add `neural-flow` to
`SECTION_KINDS`, dispatch in `SectionBody.astro`, `EXPLAIN` entry, catalog
block (`npm run check:catalog`), prefix in `src/components/AGENTS.md` §4,
worked example in `2026-06-03-tech-showcase`, and register the scene in
`src/scripts/viz3d/scenes/index.ts`.*
