# Blueprint — `moore-ladder` (tech · SVG · log-axis with fit)

> Fifty years of transistor counts on a **base-2 log axis**, where an
> exponential law becomes a straight climb — and the least-squares
> **doubling-time fit** drawn through it, its slope printed as "doubling every
> N years". Because it is log, a chip 25 doublings above another sits 25 rungs
> higher on a ruler where every rung is ×2 — the ladder of the title. One chip
> the story cares about is highlighted on the rungs. "Moore's Law, drawn as the
> straight line it actually is."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `moore-ladder` |
| World | tech |
| Tier | SVG (build-time layout + regression; `sweep`-drawn fit; zero WebGL) |
| Component | `src/components/topic/tech/MooreLadder.astro` |
| Scene module | none (no WebGL) |
| Shared math | build-time pure helpers in the frontmatter (`log2`, least-squares fit) — mirrored 1:1 from `physics/mechanics-and-flow.md` §7 |
| CSS prefix | `px-mldr` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, `src/styles/`) |
| Flagship reference | `scaling-plot`/`ScalingPlot.astro` (log axes + fit line, the closest existing kind), `power-flow` (build-time SVG layout + `sweep`/`reveal` grammar) |

## 2. What it shows / when to use

The exponential growth of transistor counts (or any doubling-law series) shown
on a log-2 axis so the trend is a straight line, with the fitted doubling time
stated. The reader sees both the raw explosion (the numbers) and the law behind
it (the line).

- **USE WHEN:** the dossier has a **dated count series that grows
  exponentially** over a wide range — transistor counts per chip/year (the
  canonical case), or any Moore-shaped series (sequencing cost, model
  parameters, storage density) where a doubling time is the claim. Needs ≥6
  points spanning ≥3 orders of magnitude (a log axis on a narrow range is a
  lie — it needs the range to earn the log).
- **DON'T USE:** a general x/y power law or a non-doubling scaling relationship
  (→ `scaling-plot`, which is the flexible log-log scatter — `moore-ladder` is
  the *opinionated* single-series doubling-fit variant, year-on-x, log2-on-y,
  with the doubling-time readout); an adoption S-curve (→ `adoption-curve`);
  ranked one-metric bars (→ `benchmark-chart`); die area (→ `chip-die`). If the
  data isn't roughly exponential, the fit is meaningless — use `scaling-plot`.
- **Pairs with:** default width or `wide`; hero-capable for a "law of the
  industry" issue. A quiet section suits either side but it's not a "loud"
  interactive (static SVG) — the act-rhythm cost is low.

## 3. Data schema

```ts
interface MooreLadderData {
  points: Array<{
    year: number;             // x — calendar year
    count: number;            // y — transistor count (or the doubling-law quantity), >0
    label: string;            // ≤3 words ("4004", "M1 Max")
    highlight?: true;         // the chip the story follows — accent + labeled rung; ≤2 max
  }>;                         // ≥6 points; build error below 6
  yLabel?: string;            // default "transistors per chip"
  unit?: string;              // suffix for count readouts, default "" (plain count with SI grouping)
  fit?: boolean;              // draw the least-squares doubling-fit line; default true
  fitRange?: [number, number];// [startYear, endYear] to fit over (default: all points)
                              // — lets the caption claim a doubling time for a specific era
  caption?: string;           // every viz kind
  source?: string;            // every viz kind
}
```

```yaml
# example payload (five decades of microprocessors — real, rounded counts)
yLabel: "transistors per chip"
points:
  - { year: 1971, count: 2300,          label: "4004" }
  - { year: 1978, count: 29000,         label: "8086" }
  - { year: 1985, count: 275000,        label: "386" }
  - { year: 1993, count: 3100000,       label: "Pentium" }
  - { year: 2000, count: 42000000,      label: "Pentium 4" }
  - { year: 2008, count: 731000000,     label: "Core i7" }
  - { year: 2012, count: 1400000000,    label: "Xeon" }
  - { year: 2021, count: 57000000000,   label: "M1 Max", highlight: true }
fit: true
caption: "From 2,300 to 57 billion transistors in fifty years — a straight line on a log ruler, doubling roughly every two years."
source: "Manufacturer die specs; Wikipedia transistor-count table, 2025"
```

**Data flags with visual consequences (CANON §7):**
- The y-axis is **base-2 logarithmic** — an exponential looks linear, which
  compresses the visual difference between huge and tiny counts. The component
  ALWAYS renders the mono chip `y: log₂ scale` (honesty about the log; without
  it the reader misreads the slope as linear growth — the core CANON §7 case).
- If `fitRange` is set (fit over a sub-era, not all points), the component
  renders the chip `fit: {startYear}–{endYear}` so the doubling-time claim's
  scope is explicit.
- The fitted **doubling time** is COMPUTED, never authored — printed in the
  legend as `doubling every {yr} yr` (`physics/mechanics-and-flow.md` §7).

## 4. Geometry spec

**Math (mirrors `physics/mechanics-and-flow.md` §7):**
- Transform each point to `(x_i = year_i, Y_i = log2(count_i))`.
- **Least-squares fit** of `Y = m·x + b` over the `fitRange` points:
  `m = Σ((x−x̄)(Y−Ȳ)) / Σ((x−x̄)²)`, `b = Ȳ − m·x̄`.
- **Doubling time** `= 1/m` years (since Y is log2, a slope of m per year means
  m doublings per year → 1/m years per doubling). Printed rounded to 0.1 yr.
- **Worked anchor (recompute exactly):** fit over the two endpoints alone
  (1971→2021) sanity-checks the full fit: `log2(2300) = 11.167`,
  `log2(57e9) = 35.730`; slope `m = (35.730 − 11.167)/(2021 − 1971) =
  24.563/50 = 0.4913` doublings/yr → **doubling every 2.04 yr**. The full
  8-point least-squares fit (the default, `fitRange` = all points) gives slope
  `m = 0.4833` → **doubling every 2.07 yr**, which rounds to the rendered
  callout `doubling every 2.1 yr` (printed to 0.1 yr). Both land within ~0.03 yr
  of each other — the data hugs the endpoint line. *(Corrected 2026-07-06: the
  earlier text said the full fit's target was "~2.0 yr"; recomputed, the
  least-squares slope over all eight points is 0.4833/yr → 2.07 → **2.1 yr**
  rounded, not 2.0. The caption's "roughly every two years" prose stays honest;
  the machine-printed callout is 2.1 yr.)*

**SVG plot (build-time, static):**
- viewBox `0 0 720 440`. Plot area `x` 88→680 (`W_plot = 592`), `y` 36→380
  (`H_plot = 344`); left 76px for the log-2 y-axis, bottom 44px for the year
  axis, right 40px gutter for the highlighted rung's label.
- **x (year):** linear, `x(yr) = 88 + (yr − yMin)/(yMax − yMin) · W_plot`.
  Ticks at decade boundaries within range (1970, 1980, … mono 9.5px, uppercase,
  `+0.08em`). Axis label `YEAR`.
- **y (log2 count):** `y(c) = 380 − (log2(c) − Ylo)/(Yhi − Ylo) · H_plot`,
  where `Ylo = floor(min Y)`, `Yhi = ceil(max Y)`. **Rungs:** a horizontal
  `--ink` @ 0.16 gridline at every integer power of ten within range
  (10³, 10⁶, 10⁹, …) — labeled in mono with SI suffixes (`1K`, `1M`, `1B`) —
  AND a fainter `--ink` @ 0.08 line at each power of two between them (the
  "ladder rungs" of the title; drawn but unlabeled to avoid clutter). Axis
  label `TRANSISTORS (log₂)` rotated.
- **Data points:** each a 4px `--accent` @ 0.9 dot; `highlight` points 6px
  `--accent` @ 1.0 with a mono label `{label}` + `{count}` (SI-grouped) on a
  1px leader into the right gutter (fixed-column label pattern, like
  `orbit-trace` — labels never overrun the viewBox). Non-highlight points get a
  small mono `{label}` above-right, paper halo, dropped if it would collide
  (collision policy: highlight labels always win, then most-recent year).
- **The fit line:** drawn LAST, `sweep`-animated, spanning the `fitRange` x
  extent at `y(2^(m·x+b))`, `--accent-deep` @ 0.9, 2px, `stroke-dasharray` NOT
  used (solid — it's the law, not a flow). A small mono callout at the line's
  right end: `doubling every {yr} yr`.
- **375px:** SVG `max-width:100%`, `height:auto`; year ticks thin to every
  other decade; power-of-two faint rungs drop (keep only the labeled powers of
  ten to reduce node count and clutter); non-highlight point labels collapse
  (highlight + first + last kept); the fit callout wraps under the line if it
  would exceed the right edge.

## 5. Motion spec (names from motion.md)

- **Reveal** (html.js-gated, `.px-viz:not(.is-in)` hidden states): axes +
  rungs `reveal` → data points `settle` in **year order** left→right (scale
  0→1, `pointStagger = min(40, 700 / max(1, points−1))` ms tech stagger — the
  industry marching up the ladder) → the fit line `sweep` (stroke-dashoffset
  len→0, **900ms** `--ease`, beginning as the last point starts its settle so
  it still draws visibly *through* the settled points) draws LAST in z-order
  (physics §7: "the fit line is `sweep`-drawn last") → the doubling callout +
  highlight labels `reveal`. **Entrance cap (motion.md rule 3 ≤1.6s):** last
  point starts by ≤700ms, +900ms sweep ⇒ full sequence ≤1600ms for any point
  count (40ms stagger holds up to 18 points; tightens above). *(Corrected
  2026-07-06: the earlier 1200ms sweep drawn strictly after an uncapped 40ms
  point stagger put the 8-point example's entrance at ~2080ms, over the 1.6s
  budget; the 900ms sweep — matching the `power-flow` reference — begun on the
  last point's settle, plus the stagger cap, keeps every payload within it while
  preserving "fit drawn last" as z-order + last-to-begin.)*
- **No ambient motion** — a historical law is static. Zero pulse, zero flow.
- **`hoverLift`** (optional, cheap): hovering a point brightens it + shows its
  readout tooltip; not required to read anything (labels + legend carry it).
- **Composed still (reduced-motion / no-JS / print):** all points placed, axes
  + labeled rungs drawn, the fit line fully drawn with its doubling callout,
  highlight labels shown, the `y: log₂ scale` chip present. No stagger, no
  sweep (final state). The build-time SVG IS this still — it's static by
  construction.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| year + log axes, tick labels | `--ink` @ 0.42 (axis lines), `--muted` (tick labels) |
| power-of-ten rungs (labeled) | `--ink` @ 0.16 |
| power-of-two rungs (faint, unlabeled) | `--ink` @ 0.08 |
| data points | `--accent` @ 0.9 |
| highlighted chip(s) | `--accent` @ 1.0 + mono label + count |
| the fit line + doubling callout | `--accent-deep` @ 0.9 |
| point labels | mono `--ink` with paper halo (`paint-order:stroke`) |
| chips (`y: log₂ scale`, `fit: …`) | standard `.px-viz__cap` mono |

Single-accent discipline — one lime system, opacity + weight doing the work.
`--accent-alt` (pink) is deliberately NOT used (there is no failure/regression
here — growth is the story, and pink means the hot path in tech). No per-point
colors; `points[].color` is not supported (the highlight flag is the only
per-point emphasis).

## 7. Fallback design (first-class)

The component is a build-time static SVG — it IS its own fallback (like
`power-flow`). No-JS ⇒ the final painted plot: all points, the drawn fit line,
the doubling callout, labeled log rungs, highlight labels. The `sweep`/`settle`
reveals simply don't run; nothing is hidden without JS (the `html.js` gating
only hides the *pre-reveal* states).

- **Legend list** (AT-readable data source), `.vz-legend` rows in year order:
  `{year} · {label} · {count} {unit}` — plus a summary row `Fit: doubling every
  {yr} yr{fitRange: ` over {start}–{end}`}`. **Rows ≤ 5 visible; a series of
  6+ points collapses behind a "show all chips" disclosure**
  (REVIEW-2026-07-05 amendment 3); the highlight row(s) + first + last are
  pinned visible above the fold.
- The `y: log₂ scale` chip (always) and `fit: …` chip (when `fitRange` set)
  via `.px-viz__cap`.

## 8. Interaction spec

- **The ONE control (CANON §9): none — static plot.** No state chips, no
  slider, no toggle. The only optional interaction is point `hoverLift` +
  tooltip (feedback, not a control). One-control rule satisfied at zero.
- **Hover/tap a point** → tooltip:
  `<b>{label}</b> · {year}<br>{count} {unit}` (count SI-grouped with
  thin-space separators). Legend rows are also hover targets that brighten
  their matching point (the sync, for points whose on-plot label was dropped).
- **Keyboard:** points are focusable buttons (`tabindex="0"`, `aria-label` =
  the tooltip text) in year order; the legend disclosure is focusable. The SVG
  as a whole has a `role="img"` + `aria-label` summarizing the doubling claim.
- **Touch:** points ≥ 44px effective tap target (4–6px dots get a padded
  transparent hit-circle); the plot does not drag/zoom (static SVG); page
  scrolls normally.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Each dot is one chip at its year and
  transistor count, plotted on a ruler where every step up means twice as many;
  the straight line is the steady doubling that turns the curve into a climb."
- **how** (ExpandModal): "Read up the log ruler — each rung is double the last.
  Hover any chip for its exact count; the line's slope is the doubling time."
- Caption guidance: state the growth claim with the doubling time ("from 2,300
  to 57 billion … doubling roughly every two years"), never restate the form.
  Text budget at rest — the `log₂` chip + ≤~5 on-plot point labels (rest in the
  legend) + the doubling callout + caption + plain — stays ≤ 80 words (REVIEW
  amendment 3); point labels are ≤3 words.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 340 (axes + ≤10 labeled rungs + ≤~40 faint power-of-2 rungs + ≤ ~30 points + labels + fit line + legend) |
| JS | none beyond the shared `Reveal` island (+ optional lightweight hover handler ≤ 0.6 KB) |
| `data` payload | ≤ 2 KB |
| Extra assets | none |

Static SVG, `html.js`-gated reveal only — no lazy chunk, no WebGL.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight: silhouette (a log climb + a fit line
      reads as the law) · 375px (ticks/rungs thin, no overflow) ·
      reduced-motion still (full static plot) · token grep (single lime + deep;
      no pink, no per-point color) · caption+source+plain · no-JS = identical
      final plot (view-source) · payload degradation (no highlight/fitRange ⇒
      plain full-range fit) · prefix `px-mldr` unique)
- [ ] The **log chip is highlighted**: the `highlight: true` point (M1 Max)
      renders at `--accent` @ 1.0 with its label + count in the right gutter,
      distinct from the @ 0.9 unhighlighted points
- [ ] The fit's doubling time computes to **2.1 yr** on the example payload
      (full 8-point least-squares slope 0.4833/yr → 2.07 yr → 2.1 rounded;
      endpoint sanity: (log2(57e9)−log2(2300))/50 = 0.4913/yr → 2.04 yr;
      grep the component: the doubling number is `1/m` from least-squares,
      never authored)
- [ ] `y: log₂ scale` chip ALWAYS renders (CANON §7 log-honesty); the y-axis
      rungs are powers of two/ten, not a linear scale
- [ ] The fit line spans the `fitRange` (or all points), `sweep`-draws LAST
      (after points settle), and its callout reads `doubling every 2.1 yr`
      (the full-range least-squares value; a `fitRange` sub-era prints its own)
- [ ] `fitRange` set ⇒ the `fit: {start}–{end}` chip renders and the line +
      doubling time cover only that era
- [ ] A ≥6-point exponential series spanning ≥3 orders of magnitude renders
      cleanly; `points.length` of 5 fails the build with a message naming the
      ≥6 rule
- [ ] Highlight/first/last labels never overrun the viewBox at 375px (fixed
      right-gutter column for highlight labels)
- [ ] Legend collapses past 5 rows; highlight + first + last rows pinned visible
- [ ] Hovering the Pentium point shows "Pentium · 1993 · 3,100,000 transistors"
      (SI-grouped); the SVG has a `role="img"` summary label for AT

---

*Registry duties (P6, at implementation — NOT now): add `moore-ladder` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`,
`EXPLAIN` entry (`src/lib/explainers.ts`), catalog block (`docs/design/catalog.md`
— `npm run check:catalog` must pass), prefix `px-mldr` in `src/components/AGENTS.md`
§4, worked example in `2026-06-03-tech-showcase`. No scene registry entry (no
WebGL).*
