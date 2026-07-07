# Blueprint — `court-value` (sports · SVG · the spatial value surface)

> Where scoring value actually lives on the surface: a pitch or court washed
> with contour bands of expected value — xG per shot location on the box, or
> eFG / points-per-shot across the half-court — so the reader sees the
> geography of a good chance, not a scatter of dots. "The heat map, drawn as a
> contour map — you can read the elevation of danger."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `court-value` |
| World | sports |
| Tier | SVG (build-time contour extraction in the component frontmatter; `html.js`-gated reveal; no three.js, no runtime compute) |
| Component | `src/components/topic/sports/CourtValue.astro` |
| CSS prefix | `px-cval` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `ShotMap.astro` (the existing sports goal-frame + shot-plotting SVG — `court-value` is its surface complement) · `RegionMap.astro` (build-time value-shaded SVG with an in-SVG legend + `d3-geo` reading; the contour approach mirrors its choropleth-with-legend structure) · `power-flow` (single-accent build-time SVG discipline) |

## 2. What it shows / when to use

The value SURFACE over the playing area — expected goals (or expected points)
as a function of location — drawn as filled contour bands so the shape of "where
chances are worth taking" is legible at a glance, with the actual shots
optionally plotted on top.

- **USE WHEN:** the dossier has a **model-scored value field** over pitch/court
  space: EITHER a grid of `value` samples on a stated resolution, OR a set of
  shots each with `(x, y, value)` that the component bins into a grid — from a
  NAMED model (an xG model, an eFG% surface, a PPS map). The *spatial* structure
  of value is the argument.
- **DON'T USE:** individual shots as discrete plotted events with outcomes (→
  `shot-map` — that's dots, this is the field beneath them); a formation's player
  positions (→ `tactics-pitch`); one shot's physical flight (→
  `flight-of-the-ball`); cumulative match xG over time (→ `xg-race`). If the
  point is *which shots went in*, it's `shot-map`; if the point is *where value
  is*, it's this.
- **Pairs with:** `wide`; hero-capable for tactical / analytics issues. Often
  precedes a `shot-map` (the surface, then the actual shots on it). Not `split`
  (static plate, no scroll-driven state). Not `bleed` before section 2.

## 3. Data schema

```ts
interface CourtValueData {
  surface: 'football-box' | 'football-half' | 'basketball-half';
                         // selects the pitch/court outline + true dimensions (§4).
  model: string;         // the value model NAMED (honesty): "StatsBomb xG" |
                         // "Opta eFG surface" | "PPS (points per shot)". REQUIRED.
  valueLabel: string;    // what the contour value MEANS, ≤ 3 words: "xG" | "eFG%" | "PPS".
  valueRange?: [number, number];   // [min, max] for the contour domain + legend.
                         // default: [0, max grid value]. Fixes the color ramp so
                         // two court-value cards in one issue are comparable.

  // EXACTLY ONE of `grid` or `shots` is required:
  grid?: {               // pre-computed value field
    cols: number; rows: number;      // grid resolution over the surface bbox (§4)
    values: number[];                // row-major, length cols*rows; the value at each cell
  };
  shots?: Array<{        // raw shots — the component bins them into a grid (§4)
    x: number; y: number;            // 0–100 pitch coords (ShotMap convention)
    value: number;                   // this shot's model value (xG etc.)
  }>;

  levels?: number[];     // explicit contour thresholds; default = 5 evenly-spaced
                         // bands across `valueRange`. AUTO-RENDERS `{n} value bands` chip.
  showShots?: boolean;   // overplot the raw shot dots (only meaningful with `shots`).
                         // default false. When true, dots are 2px `--ink` @ 0.5.
  smoothed?: boolean;    // whether the surface is kernel-smoothed before contouring.
                         // default true when `shots` given (sparse points need it);
                         // AUTO-RENDERS the chip `kernel-smoothed` (the surface is a
                         // model of the samples, not the samples — CANON §7 honesty).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (penalty-box xG surface from a shot sample, illustrative)
surface: football-box
model: "StatsBomb xG (open-play)"
valueLabel: "xG"
valueRange: [0, 0.4]
levels: [0.05, 0.10, 0.20, 0.30, 0.40]
smoothed: true
showShots: true
shots:
  - { x: 88, y: 50, value: 0.76 }   # penalty-spot-ish, high value
  - { x: 84, y: 46, value: 0.22 }
  - { x: 82, y: 55, value: 0.18 }
  - { x: 78, y: 50, value: 0.11 }
  - { x: 75, y: 40, value: 0.06 }
  - { x: 80, y: 62, value: 0.05 }
  # … (a real payload carries 40–400 shots)
caption: "Value collapses with every metre off the penalty spot — the same strike is worth three times as much from the six-yard heart as from the edge of the box."
source: "StatsBomb open-data xG, 2015-23 open-play shots"
```

**Data flags with visual consequences (CANON §7):**
- `smoothed: true` → the mono chip `kernel-smoothed` (the contours are a model
  of sparse samples, not raw counts).
- `levels` present (or defaulted) → the chip `{n} value bands` so the reader
  knows the surface is quantised, not continuous.
- `valueRange` fixes the ramp domain; the legend states `{min}–{max} {valueLabel}`
  so the color scale is never ambiguous about which end is high.
- Providing `shots` with `showShots: false` is honest (the surface is derived
  from them but not overplotted); providing `grid` means the samples aren't
  available to plot — `showShots` is ignored (no dots) and that's fine.

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox + surface:** `0 0 W H` sized to the surface's true aspect ratio:
  - `football-box`: the penalty-box third — a 40 m (wide) × 30 m (deep) region
    in front of one goal; `W = 620`, `H = 465` (4:3). Goal frame 7.32 m, 6-yard
    box, 18-yard box, penalty spot + arc, all to FIFA scale, drawn `--ink` @ 0.35
    chalk (`stroke-linecap: round`).
  - `football-half`: a full 52.5 m × 68 m half; `W = 560`, `H = 725`.
  - `basketball-half`: a 15.24 m × 14.33 m NBA half-court; `W = 600`, `H = 564`;
    the arc, restricted area, free-throw circle, three-point line to real dims.
  - A `bbox` maps surface metres → viewBox px linearly; declared per surface.
- **Coordinate convention:** shot `x,y` are 0–100 pitch coords (the `ShotMap`
  convention — `x` toward goal, `y` across); mapped into the selected surface's
  metre bbox then to px. Stated so the two paths (grid vs shots) place identically.
- **Grid construction (when `shots` given):** bin/estimate a value field on a
  `GX × GY` grid where `GX = 40`, `GY = round(40·H/W)` (square-ish cells over the
  surface). Each cell value = **kernel-weighted mean** of nearby shots' `value`
  (Gaussian kernel, bandwidth `= 6 m` in surface units — clamped so a 400-shot
  sample and a 40-shot sample both produce a smooth field; declared, not magic):
  `v(cell) = Σ_s w_s·value_s / Σ_s w_s`, `w_s = exp(−d²/(2·bw²))`, `d` = cell-to-
  shot distance in metres. Cells with `Σ w_s < 0.01` are held at the domain min
  (no data ⇒ no phantom value). When `grid` is given directly, `smoothed`
  defaults false and the raw grid is contoured as-is.
  *(Corrected 2026-07-06: the weighted mean is a Nadaraya-Watson estimator — near
  an isolated high-value shot, and at the sparse goalward edge where `Σ w_s`
  thins, it approaches that shot's raw `value` and can exceed `valueRange.max`.
  Every cell value is therefore **clamped to `valueRange`** — `v = clamp(vMin,
  v, vMax)` — BEFORE contouring, so no band or peak label exceeds the declared
  domain and the legend's top edge is the honest ceiling. The estimator peaks at
  the goalward heart of the shot cloud, not at a symmetric interior point; the
  contour story is the collapse of value moving OUT from that heart toward the
  box edge, which is what the acceptance anchor pins.)*
- **Contour extraction:** run **marching squares** on the grid at each threshold
  in `levels` to produce iso-value polylines, then build **filled bands** (the
  region between level `k` and level `k+1`) as SVG paths — the choropleth-style
  filled-contour look, not just iso-lines. Bands clipped to the surface outline
  (a `clipPath` of the pitch/court playing area) so value never bleeds off the
  field. *(Marching squares is the standard, deterministic contour algorithm;
  the implementer may use a tiny inlined routine or `d3-contour`'s
  `contours()` at build time — `d3-geo` is already a dep; `d3-contour` may be
  added as a build-only dep, noted in the footer.)*
- **Color ramp (fixed data encoding, NON-themeable — declared here, CANON §6):**
  a **sequential single-hue volt ramp** from `--paper-2` (lowest band, near-
  transparent turf) through `--accent-deep` to `--accent` (highest band, hot
  volt) — 5 default bands at opacities `[0.14, 0.30, 0.48, 0.68, 0.9]` of the
  band fill. This keeps the world's two-tone discipline (volt = value, over
  chalk) while giving a readable elevation ramp. **Not** a rainbow heatmap
  (CANON §11 anti-pattern). The ramp is fixed so all `court-value` cards read
  identically; only intensity, not hue, carries value.
- **Iso-lines:** thin `--ink` @ 0.22 (0.75px) strokes on each band boundary —
  the "contour line" that makes it read as a map, not a blur.
- **Peak marker:** the grid cell with the max (post-clamp) value gets a small
  `--accent` @ 1.0 cross (+ mono label `{valueLabel} {peak}` in the label style)
  — the hottest spot, named. One only. `{peak}` is the CLAMPED value, so it never
  reads above `valueRange.max`. *(Corrected 2026-07-06: with a weighted-mean
  surface the peak lands at the goalward heart of the shot cloud — the estimator
  climbs toward the highest-value shots and toward the sparse goal-line edge —
  NOT at a symmetric penalty-spot centre with radial falloff. That is honest
  football: value is highest nearest goal. Describe the marker as "the goalward
  heart", not a centred spot.)*
- **Shot overplot (when `showShots` + `shots`):** each shot a 2px-radius `--ink`
  @ 0.5 circle at its mapped position (the sample cloud under the surface).
- **In-SVG legend (per AGENTS §5 — legends live in the SVG):** a lower-left `<g>`
  vertical ramp swatch column, one chip per band, labelled with the band's value
  edge (`0.05`, `0.10`, …) in mono tabular, titled `{valueLabel} · {model}`.
- **Size constants:** chalk lines 1.5px @ 0.35; iso-lines 0.75px @ 0.22; peak
  cross 8px; shot dots 2px. **375px:** viewBox unchanged (SVG scales to card
  width); legend swatch column shrinks; mono labels authored at 11px stay ≥ 9.5px
  after scale (verify per CANON §13); shot dots drop to 1.5px; the peak label
  clamps inside the viewBox.

## 5. Motion spec (names from motion.md)

- Reveal (once, on scroll-in, `.px-cval:not(.is-in)` states `html.js`-gated —
  §9 AGENTS contract):
  1. chalk court/pitch lines `sweep`-draw (700 ms, 40 ms per-marking stagger —
     sports pace);
  2. contour bands `grow` in intensity — each band's fill-opacity animates
     0→final, **inner (hottest) bands last**, 60 ms stagger (the value "rises
     out of the turf" from the edges inward), total ≤ 700 ms;
  3. iso-lines `reveal` (opacity, 250 ms), overlapping the band grow;
  4. shot dots (if shown) `reveal` staggered, overlapping (3);
  5. peak cross + label `stamp` LAST (220 ms `--ease-snap`) — the hottest spot
     is the verdict beat.
  Full sequence ≤ **1.6 s**. *(Clarified 2026-07-06: the phases OVERLAP, they do
  not sum — the chalk `sweep` (700 ms) and the band `grow` (≤ 700 ms) run
  concurrently (bands rise while the chalk is still inking), iso-lines + dots
  reveal over the band-grow tail, and only the 220 ms peak `stamp` trails after.
  Sequenced end-to-end (700 + 700 + 250 + 220 ≈ 1.87 s) would blow the budget;
  overlapped, the band grow finishes by ≈ 700 ms and the stamp lands by
  ≈ 1.0–1.3 s, well under 1.6 s.)*
- **No ambient motion** (`worlds/sports.md`).
- Reduced-motion / no-JS: bands, iso-lines, dots, peak all painted final. This
  IS the print plate.
- **Composed still:** the full contour surface on the chalk court, iso-lines,
  peak marker + label, legend, and (if enabled) the shot cloud.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| chalk pitch/court lines | `--ink` @ 0.35, `stroke-linecap: round` (the chalk motif) |
| goal frame / rim | `--ink` @ 0.9 |
| value bands (the ramp — FIXED encoding) | sequential volt ramp: band fills at `--paper-2`→`--accent-deep`→`--accent`, opacities `[0.14, 0.30, 0.48, 0.68, 0.9]` (5 bands) |
| iso-lines | `--ink` @ 0.22 (0.75px) |
| peak cross + label | `--accent` @ 1.0 / label `viz-type` label role with paper halo |
| shot overplot dots | `--ink` @ 0.5 (2px) |
| in-SVG legend | ramp swatches (band colors) + mono `--ink` @ 0.7 edge labels |
| chips | `.px-viz__cap` mono unit-chip |

Single-hue ramp only — the value encoding is a fixed non-themeable sequential
scale (declared, CANON §6), NOT a rainbow. `--accent-alt` (orange) is unused
(no rivalry pair in a single surface). The ramp intentionally reuses the world's
own volt family so the card stays inside the sports palette instead of importing
a foreign heatmap gradient (CANON §11).

## 7. Fallback design (first-class)

Build-time static SVG already — **no separate fallback needed** (`power-flow` /
`RegionMap` posture). No-JS = the final painted contour map (the reveal only
animates fill-opacity growth). This IS the print plate. What the no-JS/AT reader
gets:

- The complete contour surface, iso-lines, chalk court, peak marker + value
  label, in-SVG ramp legend, and (if enabled) shot cloud — nothing requires JS.
- `role="img"` + `aria-label` on the SVG summarising the surface ("{valueLabel}
  peaks at {peak} near {peak location description}; value falls to {min} at the
  edges").
- The `model` + `valueLabel` in the `.px-viz__src` / caption row — the AT reader
  learns which value model produced the surface. The legend's band edges are the
  AT-readable quantisation.
- **Legend rows** = the number of bands (default 5) — at the 5-row ceiling, no
  collapse needed (CANON §4.5). If `levels` gives >5 bands, the legend renders a
  2-column compact ramp (static plate packs, doesn't fold — same rule as
  `elo-river` §7).

## 8. Interaction spec

- **None interactive in v1** (SVG stays pure — the `power-flow` posture; zero
  controls trivially satisfies the one-control-max rule). The value at any point
  is readable from the contour bands + legend; the peak is marked. The `⤢`
  expand-to-modal (automatic on `.px-viz`) is the study view.
- Everything readable at rest (CANON §9): the geography of value, the hottest
  spot, and the scale are all in the composed still + legend + caption.
- Keyboard/AT: no focusable interactive elements; the `aria-label` + in-SVG
  legend + source line carry the content.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "The pitch is shaded
  by how much a shot from each spot is worth — brighter volt means a better
  chance — and the lines are contours, like a map's height lines, joining places
  of equal value."
- **how** (ExpandModal): "Read it like a topographic map: the bright core is
  where chances are most valuable, and each contour line steps down to a lower
  value. Press ⤢ to study it larger."
- Caption guidance: state the spatial-value claim ("value collapses with every
  metre off the penalty spot"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 50 words — peak label 2 + legend band
  edges ~6 (legend is the data source, exempt) + chips ~4 + caption ~26 + plain
  ~30. On-plate text (peak label + chips) ≈ 6 words, far under 80.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 900 (≤5 band paths, each possibly multi-ring + iso-lines + chalk + ≤400 shot dots + legend). If `showShots` with >400 shots, the component bins-and-drops the overplot dots past 400 (the surface already encodes them) — declared. |
| `data` payload | ≤ 8 KB (`grid`: cols·rows numbers; or ≤400 shots × 3 numbers). Payloads over 8 KB should use `grid` (pre-binned), not raw `shots`. |
| JS | none beyond the shared `core/Reveal.astro` island (contour math is build-time; band growth is CSS) |
| Build-only dep | `d3-contour` MAY be added (build-time only, tree-shaken out of client bundles like `d3-geo`/`topojson` already are). Alternatively an inlined marching-squares routine (~40 lines). Noted in the footer. |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (reads as a captioned contour map)
      · 375px no overflow, mono labels ≥ 9.5px · reduced-motion / no-JS = full
      painted surface (view-source check) · token grep (only the declared fixed
      volt ramp + tokens; no rainbow/hex heatmap literals) · caption +
      source(+model) + plain all render · payload degradation (exactly one of
      `grid`/`shots`; missing `levels`→5 even bands; missing `valueRange`→[0,max])
      · `px-cval` prefix unique
- [ ] **Worked anchor (recomputable):** with the six example shots, bandwidth
      6 m, and 0–100 pitch coords mapped to metres by (×1.05, ×0.68), the
      kernel-weighted mean at the cell of the 0.76 shot `(x=88, y=50)` computes
      to **≈ 0.40** (`v = Σ w_s·value_s / Σ w_s`, `w_s = exp(−d²/2·6²)`, `d` in
      metres) — the top band. *(Corrected 2026-07-06: the raw grid max is
      **≈ 0.66** at the goal-line edge near `(100, 53)`, and near `(90, 47)` the
      raw value is **≈ 0.46** — both ABOVE `valueRange.max = 0.4`; the surface is
      clamped to `[0, 0.4]` (§4), so the top band and the peak label both read
      **0.40**, and the peak marker lands at the goalward heart of the cloud
      around `(88–90, 50)`. The earlier "grid max ≈ 0.46 at (90,47), penalty-spot
      heart, monotone outward" was wrong: the weighted mean climbs toward goal,
      not radially outward from a centre.)* Value falls off moving OUT toward the
      box edge — **≈ 0.24** at `(82, 50)`, **≈ 0.17** at `(78, 50)`, **≈ 0.15**
      toward the 18-yard edge `(76, 50)` — a monotone collapse away from the
      heart, so the caption's "collapses with every metre off the spot" is earned
      in the away-from-goal direction. A reviewer recomputes the weighted mean for
      these cells from the six shots and confirms the clamp caps the peak at 0.40.
- [ ] Contour bands are nested/monotone (each higher band is enclosed by the
      band below it — marching squares on a smoothed field yields no crossing
      iso-lines); bands are clipped to the pitch outline (value never bleeds off
      the field)
- [ ] The color ramp is the fixed single-hue volt sequence at the declared
      opacities — NOT a rainbow; grep confirms no foreign gradient/hex
- [ ] `smoothed: true` renders the `kernel-smoothed` chip; a directly-supplied
      `grid` with `smoothed` unset renders no smoothing chip
- [ ] `{n} value bands` chip matches `levels.length` (default 5); `valueRange`
      appears in the legend as `{min}–{max} {valueLabel}`
- [ ] `showShots: true` + `shots` overplots ≤400 dots at `--ink` @ 0.5; `grid`
      input ignores `showShots` (no phantom dots)
- [ ] Empty regions (no nearby shots, `Σ w_s < 0.01`) render at the domain min
      band — no phantom value where there's no data
- [ ] Surface is clamped to `valueRange` before contouring: no band, and no peak
      label, reads above `valueRange.max` even when the raw weighted mean does
      (the example's raw ≈ 0.66 clamps to the 0.40 top band)
- [ ] No-JS: identical final surface; in-SVG ramp legend present; `model` in the
      source line; `role="img"` + `aria-label` describe the surface
- [ ] Peak cross + label `stamp` fire last; exactly one peak marker (at the
      goalward heart of the cloud, label = the clamped peak value)

---

*Registry duties (P6, at implementation — NOT now): add `court-value` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry
(`src/lib/explainers.ts`), add the catalog block (`docs/design/catalog.md` —
`npm run check:catalog` must pass), document the `px-cval` prefix in
`src/components/AGENTS.md` §4, add the (build-only) `d3-contour` dep if the
inlined routine isn't used, and add a worked example to
`src/content/issues/2026-06-03-sports-showcase`. Do NOT edit SECTION_KINDS or
catalog.md at blueprint time.*
