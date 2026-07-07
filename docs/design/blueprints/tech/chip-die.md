# Blueprint — `chip-die` (tech · CSS-3D · floorplan)

> A processor die as an **exploded floorplan**: the functional blocks (cores,
> cache, GPU, memory controllers, I/O) laid out as tiles whose **areas are the
> real silicon areas in mm²** — so "the GPU is bigger than all the CPU cores
> combined" is a thing the reader *sees*, not reads. Pixel-crisp integer tiles
> on a CSS-3D-tilted board, one block liftable to name what actually eats a
> modern chip's budget. "The map of the silicon, drawn to scale."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `chip-die` |
| World | tech |
| Tier | CSS-3D (tilted board + per-tile `translateZ` lift; via `core/Tilt.astro` mechanics + `components-3d.css` `.px3d-*`) |
| Component | `src/components/topic/tech/ChipDie.astro` |
| Scene module | none (no WebGL — CSS transforms only) |
| Shared math | build-time treemap-squarify in the component frontmatter (pure; no runtime) — see §4 |
| CSS prefix | `px-die` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, `src/styles/`) |
| Flagship reference | `arch-stack`/`ArchStack.astro` (exploded CSS-3D slabs + `.px3d` tilt), `commit-grid` (the tech "pixel grid, integer sizes, no blur" doctrine), `Tilt.astro` (the pointer-tilt + focus island) |

## 2. What it shows / when to use

The physical composition of a chip: which functional blocks exist and how much
die area each actually occupies, at true relative scale. The reader learns
where the transistor budget goes — usually the surprising answer (cache and GPU
dwarf the "CPU").

- **USE WHEN:** the dossier has a real die's **area breakdown** — named blocks
  with mm² (or % of die area) from a die-shot analysis / vendor disclosure /
  a credible teardown, and the story is about silicon allocation ("what an
  SoC really spends its area on", "why the NPU is now bigger than a core").
  Needs ≥4 blocks covering ≥90% of the die area.
- **DON'T USE:** a layered software/system stack with no area meaning (→
  `arch-stack`); transistor *count* growth over generations (→ `moore-ladder`);
  a benchmark comparison of chips (→ `benchmark-chart`); activity density (→
  `commit-grid`). If the blocks have no real area data, this component is a
  lie — use `arch-stack` or `comparison` instead.
- **Pairs with:** `wide` (the floorplan wants width); a quiet section either
  side (it is a "loud" CSS-3D viz — CANON §3). Hero-capable for a
  silicon-teardown issue. Never `bleed` (the tiles need a measured frame, and
  a die is not edge-to-edge content).

## 3. Data schema

```ts
interface ChipDieData {
  chip: string;               // "Apple M-series SoC" — the die being mapped
  dieAreaMm2?: number;        // total die area, mm²; if omitted, = Σ blocks[].areaMm2
  blocks: Array<{
    label: string;            // ≤3 words ("GPU", "System cache", "P-cores")
    areaMm2?: number;         // real silicon area, mm² (provide this OR pct)
    pct?: number;             // % of die area (provide this OR areaMm2); one must be resolvable
    group?: 'compute' | 'memory' | 'io' | 'media' | 'other';
                              // tints the tile within the single-accent ramp (NOT free color)
    primary?: true;           // the block the story is about — lifts + accent, one max
    note?: string;            // ≤6 words, shown on lift/tooltip ("40% of the die")
    count?: number;           // optional "×4" multiplicity badge (four identical cores)
  }>;                         // 4–24 blocks; build error outside that range
  caption?: string;           // every viz kind
  source?: string;            // every viz kind
}
```

```yaml
# example payload (a mobile SoC die, illustrative-but-plausible areas in mm²)
chip: "Flagship mobile SoC"
dieAreaMm2: 100
blocks:
  - { label: "GPU",           areaMm2: 24, group: compute, primary: true, note: "24% of the die" }
  - { label: "System cache",  areaMm2: 20, group: memory }
  - { label: "P-cores",       areaMm2: 12, group: compute, count: 4 }
  - { label: "E-cores",       areaMm2: 6,  group: compute, count: 4 }
  - { label: "NPU",           areaMm2: 14, group: compute }
  - { label: "Media engine",  areaMm2: 8,  group: media }
  - { label: "Memory ctrl",   areaMm2: 9,  group: memory }
  - { label: "I/O + fabric",  areaMm2: 7,  group: io }
caption: "The GPU alone takes a quarter of the die — more silicon than all eight CPU cores combined."
source: "Die-shot analysis, 2025"
```

**Data flags with visual consequences (CANON §7):**
- If Σ `blocks[].areaMm2` (or resolved %) < 95% of `dieAreaMm2`, the remainder
  renders as an explicit **"unmapped" tile** (`--ink` @ 0.12, hatched) — never
  silently absorbed; the component AUTO-RENDERS the chip
  `{n}% mapped` when coverage < 100%.
- Areas are **true-scale** (the whole point) — there is NO exaggeration flag
  and no size manipulation; a tile's area IS its data. (If an author wants to
  emphasize a tiny block, they use `primary` to lift it, not to resize it.)

## 4. Geometry spec

**Build-time squarified treemap (pure, in the frontmatter — no runtime layout):**
- The die is a **1 mm² = S px² area-preserving** map. Frame: a fixed
  `BOARD = 560 × 360` CSS px "die" rectangle (the substrate). Scale
  `S = (BOARD_W · BOARD_H) / dieAreaMm2` px² per mm² — so tile pixel area =
  `areaMm2 · S`, and total tile area exactly fills the board.
- **Algorithm:** squarified treemap (Bruls et al.) over the blocks sorted
  area-descending — the standard aspect-ratio-minimizing tiling. Each block
  becomes an axis-aligned rectangle of area `areaMm2 · S`; the algorithm keeps
  rectangles as square as possible (worst aspect ratio the priority it
  minimizes). **All coordinates rounded to integer px** (tech doctrine:
  pixel-crisp, no sub-pixel blur) — rounding drift absorbed by the last tile in
  each strip so the board stays exactly filled (no 1px gaps).
- **Worked anchor (recompute):** with `dieAreaMm2 = 100` and BOARD 560×360 =
  201,600 px², `S = 2016 px²/mm²`. The GPU block (24 mm²) → `24·2016 = 48,384
  px²` → a squarish tile ≈ **220 × 220 px** (√48384 = 219.9). The "P-cores"
  block (12 mm²) → 24,192 px² ≈ **156 × 155 px**. Verify: Σ all tile pixel
  areas = 201,600 (± rounding, absorbed) = the full board. The GPU tile (48,384
  px²) is exactly 4× the "I/O + fabric" tile (7 mm² → 14,112 px²)? — 48384/14112
  = 3.43 = 24/7 ✓ (areas are proportional, the acceptance invariant).
- **Tile gaps:** a **2px** `--bg` gutter between tiles (the crisp grid look —
  gutters come out of nothing; tiles are inset 1px each side, preserving the
  *relative* areas since every tile loses the same 1px border — stated so an
  implementer doesn't "fix" the areas by removing the inset).
- **Labels:** each tile centers a mono label (`{label}`) + a mono `{areaMm2}
  mm²` sub-line + optional `×{count}` badge top-right. Tiles too small for the
  label (pixel area < 3,200 px² ≈ 56×56) show only a leader dot; their label
  moves to the **collapsed legend** (§7) — collision policy so no label
  overflows its tile (the neural-flow "labels fit" bug class).
- **CSS-3D board:** the board sits in a `.px3d` perspective context
  (perspective 1200px), resting tilt `rotateX(52deg) rotateZ(0)` — a
  drafting-table angle so the floorplan reads as a physical die on a bench, not
  a flat chart. Tiles are `position:absolute` at their integer `left/top/
  width/height`; each tile is a thin extruded slab (`translateZ(3px)` +
  a `::after` 3px side face in `--paper-2`) for the crisp-edge relief.
- **375px:** the board scales via `transform: scale()` on the perspective
  wrapper to fit container width (areas stay proportional — scaling is uniform);
  the tilt reduces to `rotateX(38deg)` (shallower reads better on small
  screens); tiles below the label threshold grow their threshold (more labels
  go to the legend); min tap target for lift = 44px (tiles smaller than that
  are liftable only via the legend rows).

## 5. Motion spec (names from motion.md)

- **Reveal** (html.js-gated, `.px-viz:not(.is-in)`): tiles `settle` into the
  board in **area-descending order** (biggest silicon lands first), scale
  0.9→1 + opacity, 400ms `--ease-snap`, stagger `= min(40, 800 / max(1,
  blocks−1))` ms (tech's tight mechanical cadence — 40ms up to 21 blocks,
  tightening toward the 24-block cap) — a chip being placed block by block. The
  primary tile lifts last with a `stamp`-like settle (~400ms, it's the
  punchline). **Entrance cap (motion.md rule 3 ≤1.6s):** last tile starts by
  ≤800ms, +400ms settle +400ms primary stamp ⇒ full sequence ≤1600ms at the
  24-block maximum. *(Corrected 2026-07-06: a flat 40ms stagger over the 24-block
  maximum finished tiles at ~1320ms and the trailing primary stamp pushed the
  sequence to ~1720ms, over budget; the stagger cap keeps the worst case at
  exactly 1.6s while leaving typical ≤21-block dies at the full 40ms cadence.)*
- **Lift (interaction):** hovering/focusing a tile raises it `translateZ` from
  3px → **18px** (`hoverLift`, 150ms `--ease`) and brightens it; siblings dim
  to 0.55 (opacity only — no layout move, motion.md rule 5). The `primary` tile
  rests slightly lifted (`translateZ(9px)`) so it reads as the subject at rest.
- **Pointer-tilt:** the whole board tilts ±4° with the pointer via
  `core/Tilt.astro` (the existing CSS-3D pointer-tilt island) — subtle, the
  "physical object on a bench" feel. Reduced-motion disables the pointer-tilt
  (it's decorative parallax-adjacent — freeze at rest tilt).
- **No ambient motion** — a die is static. Zero pulse, zero flow, zero loop.
- **Composed still (reduced-motion / no-JS / print):** the full floorplan at
  rest tilt, every tile placed and labeled, the primary tile at its resting
  `translateZ(9px)` lift, the coverage chip if < 100%. No reveal stagger
  (final state), no pointer-tilt. This is the print plate.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| substrate / board | `--paper` @ 1.0 with a `--rule` 1px edge |
| tile fills — by `group` (single-accent ramp) | compute `--accent` @ 0.85 · memory `--accent` @ 0.45 · media `--accent` @ 0.28 · io `--ink` @ 0.30 · other `--ink` @ 0.18 |
| primary tile | `--accent` @ 1.0 + `--accent` 1.5px border |
| tile side faces (extrusion) | `--paper-2` @ 1.0 |
| unmapped remainder tile | `--ink` @ 0.12, 3px diagonal hatch (`--ink` @ 0.2) |
| tile labels / area values | mono `--ink` (labels), mono `--accent-deep` (mm² values), `--muted` (notes) |
| gutters | `--bg` (the near-black shows between tiles — the crisp grid) |

The tiles are tinted by `group` along ONE accent ramp (opacity steps of the
same lime) + ink for the non-compute blocks — **not** a rainbow of per-block
colors (worlds/tech.md: lime carries throughput/compute; ink is structure).
`--accent-alt` (pink) is deliberately NOT used — there is no failure/hot state
in a floorplan. `blocks[].color` is not supported.

## 7. Fallback design (first-class)

The component is build-time CSS+HTML; the treemap is computed at build, so the
no-JS reader gets the **complete floorplan** already:

- The full tiled board (all integer-positioned tiles with fills + labels +
  areas), flattened to `rotateX(0)` under no-JS if the CSS-3D transform is
  unsupported? — **no**: CSS 3D transforms need no JS, so the tilted board
  paints as-is; only the *pointer-tilt* and *lift* need JS and degrade to the
  static resting state. Everything area-encoded is visible.
- The primary tile at its resting lift; the coverage chip if < 100%.
- **Legend list** (AT-readable data source + the home for labels that didn't
  fit their tile), `.vz-legend` rows sorted area-descending: `{label} ·
  {areaMm2} mm² · {pct}%{count: ` · ×{count}`}`. **Rows ≤ 5 visible; blocks
  6–24 collapse behind a "show all blocks" disclosure** (REVIEW-2026-07-05
  amendment 3). The primary row is always visible (pinned above the fold).
- Caption chip (`{n}% mapped` when coverage < 100%) via `.px-viz__cap`.

## 8. Interaction spec

- **The ONE control (CANON §9): none — pure inspection.** There are no state
  chips and no slider; the only interactions are hover/focus lift and the
  pointer-tilt (both feedback, not controls). One-control rule satisfied at zero.
- **Hover/tap a tile** → lift (§5) + tooltip:
  `<b>{label}</b>{count: ` ×{count}`}<br>{areaMm2} mm² · {pct}% of die<br>{note?}`.
  Legend rows are also hover targets that lift their matching tile (the sync,
  for tiles too small to tap directly).
- **Keyboard:** each tile is a focusable button (`tabindex="0"`,
  `aria-label` = the tooltip text); focus lifts it; Tab order = area-descending
  (matches the reveal + legend order). The legend disclosure is a focusable
  button.
- **Touch:** tiles ≥ 44px are directly tappable; the pointer-tilt is disabled
  on touch (no hover state to key off — tap = lift instead); the page scrolls
  normally (the board is not a drag-to-rotate scene).

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "A map of the chip drawn to scale —
  every tile is one functional block, and a tile's size is the real silicon
  area that block occupies on the die."
- **how** (ExpandModal): "Hover any block to lift it and read its area. Compare
  tile sizes directly — bigger tile, more silicon."
- Caption guidance: state the allocation claim ("the GPU alone takes a quarter
  of the die"), never restate the form. Text budget at rest — coverage chip +
  ≤~8 on-tile labels (the rest in the legend) + caption + plain — stays
  ≤ 80 words (REVIEW amendment 3); tile labels are ≤3 words and areas are the
  only value shown on-tile.

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 320 (≤24 tiles × ~4 nodes each (fill, side face, label, value) + board + legend) |
| CSS transforms | build-time positions; only `translateZ`/tilt animate — GPU-composited, no reflow |
| JS (island) | ≤ 1.2 KB min+gz — reuse `core/Tilt.astro`'s pointer-tilt + a lift/legend-sync handler; no framework |
| `data` payload | ≤ 2 KB |
| Extra assets | none (no die-shot image — the publication is type/geometry-led, CANON §4; no raster) |

No WebGL, no lazy chunk; CSS-3D + a tiny island, `html.js`-gated.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight: silhouette (the floorplan reads as a
      scale map) · 375px (board scales, tilt shallower, ≥44px targets or legend)
      · reduced-motion still (rest tilt, no pointer-tilt, primary lifted) ·
      token grep (only the lime ramp + ink; no pink, no per-block color) ·
      caption+source+plain · no-JS = full tiled board · payload degradation
      (missing note/count ⇒ omit) · prefix `px-die` unique)
- [ ] **Areas are proportional:** with the example payload, the GPU tile's
      pixel area is exactly 24/7× the "I/O + fabric" tile's (recompute: 48,384
      vs 14,112 px² = 3.43×) — grep the component: tile size derives from
      `areaMm2·S`, never authored px
- [ ] `S = BOARD_W·BOARD_H / dieAreaMm2`; Σ tile pixel areas = board area
      (± integer rounding absorbed by strip-final tiles; no 1px gaps)
- [ ] The GPU tile (24 mm² on a 100 mm² die, 560×360 board) is ≈ 220×220 px
- [ ] Coverage < 95% ⇒ an explicit hatched "unmapped" tile + the `{n}% mapped`
      chip; = 100% ⇒ no chip, no unmapped tile
- [ ] Tiles are integer-positioned and pixel-crisp (no fractional left/top/
      width/height; 2px `--bg` gutters between)
- [ ] Hovering the GPU tile lifts it (translateZ 3→18) + dims siblings to 0.55
      (opacity only, no reflow) + shows "GPU — 24 mm² · 24% of die"
- [ ] `primary` tile rests lifted (translateZ 9) and is accent @ 1.0
- [ ] Legend collapses past 5 rows; the primary row stays visible; a
      too-small tile's label lives in the legend and its row lifts the tile
- [ ] `blocks.length` of 3 or 25 fails the build with a message naming the
      4–24 rule

---

*Registry duties (P6, at implementation — NOT now): add `chip-die` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`,
`EXPLAIN` entry (`src/lib/explainers.ts`), catalog block (`docs/design/catalog.md`
— `npm run check:catalog` must pass), prefix `px-die` in `src/components/AGENTS.md`
§4, worked example in `2026-06-03-tech-showcase`. No scene registry entry (no
WebGL).*
