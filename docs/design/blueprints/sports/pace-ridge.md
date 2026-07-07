# Blueprint — `pace-ridge` (sports · SVG · the split-distribution ridgeline)

> One athlete's distribution against the field's, drawn as overlapping ridgeline
> density curves — a stack of smoothed histograms where the subject's ridge is
> volt and the field's are ink, so "is this player faster / more accurate / more
> consistent than everyone else?" reads as the shift and the spread of a curve,
> not a single average. "The stat, shown as a shape — where a number hides its
> variance, a ridge shows it."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `pace-ridge` |
| World | sports |
| Tier | SVG (build-time KDE + ridgeline layout in the component frontmatter; `html.js`-gated reveal; no three.js, no runtime compute) |
| Component | `src/components/topic/sports/PaceRidge.astro` |
| CSS prefix | `px-prdg` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `PlayerRadar.astro` (existing sports "one subject vs a comparison shape" SVG, overflow-visible labels) · `ClimateStrip.astro` / `QuakeDepth.astro` (build-time distribution-over-an-axis SVG) · `power-flow` (single-accent build-time discipline) |

## 2. What it shows / when to use

A quantity's DISTRIBUTION for the subject versus the field (or versus past
seasons / positional peers) — as stacked, slightly overlapping density ridges —
so the reader sees not just where the subject sits but how their whole spread
compares: faster on average, or just more consistent, or with a long tail.

- **USE WHEN:** the dossier has a **measurable quantity with a sample** for the
  subject AND ≥1 comparison group (e.g. sprint speeds across a season's runs,
  shot distances, serve speeds, lap times, xG-per-shot) — enough observations
  per group to form a distribution (≥ ~15 each), from a NAMED dataset. The
  *shape* of the difference (shift vs spread vs tail) is the argument.
- **DON'T USE:** a single value per subject with no spread (→ `player-radar` for
  multi-axis, or a `data-readout`/`benchmark-chart` for one number); values over
  time (→ `elo-river`, `xg-race`); spatial value (→ `court-value`). If there is
  one number per entity and no sample behind it, there is no distribution to
  ridge — use a bar. This kind exists precisely to show the *variance a mean hides*.
- **Pairs with:** `wide`; hero-capable for "is X actually elite / an outlier"
  issues. Not `split` (static plate). Not `bleed` before section 2.

## 3. Data schema

```ts
interface PaceRidgeData {
  metric: string;        // what's distributed, ≤ 3 words: "top speed" | "shot distance" | "serve".
  unit: string;          // "km/h" | "m" | "mph" — labels the x-axis + readouts.
  source_n?: string;     // sample provenance chip, ≤ 8 words: "2023-24 tracking, 34 matches".
  groups: Array<{        // 2–7 ridges, drawn top→bottom in array order
    label: string;       // ridge label, e.g. "Haaland" / "PL strikers" / "his 2021-22"
    samples: number[];   // the raw observations of `metric` in `unit` (≥ 8; ideally ≥ 15).
                         // The component computes the KDE; authors never pre-bin.
    subject?: true;      // at most ONE — the athlete this issue follows; volt ridge + stats.
  }>;
  domain?: [number, number];   // x-axis [min, max] in `unit`. default: [floor to nice, ceil to
                         // nice] over all samples. Fixing it makes multiple ridges comparable.
  stat?: 'mean' | 'median';    // which central line each ridge marks. default 'median'
                         // (robust to the outliers a distribution exists to show). The choice
                         // AUTO-RENDERS the readout label (`med` vs `μ`).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (striker top-speed distributions, illustrative sample of runs)
metric: "top speed"
unit: "km/h"
source_n: "2023-24 tracking, per sprint"
stat: median
domain: [24, 36]
groups:
  - { label: "Subject striker", subject: true,
      samples: [31.2, 32.0, 33.1, 30.8, 34.2, 32.7, 33.5, 31.9, 35.1, 32.4, 33.8, 34.6, 32.1, 33.0, 34.9] }
  - { label: "PL strikers (field)",
      samples: [28.1, 29.4, 30.2, 27.8, 31.0, 29.9, 28.6, 30.7, 29.1, 28.9, 30.4, 27.5, 29.8, 31.3, 28.3, 30.0, 29.2, 28.7] }
  - { label: "His 2021-22",
      samples: [29.6, 30.1, 31.2, 28.9, 30.8, 31.5, 29.4, 30.6, 31.9, 30.0, 29.1, 30.9] }
caption: "The subject's whole curve sits nearly 4 km/h right of the field — not one fast sprint, but a distribution that starts where everyone else's ends."
source: "Second Spectrum tracking data, 2023-24"
```

**Data flags with visual consequences (CANON §7):**
- Each ridge is a **kernel density estimate**, not a raw histogram → the mono
  chip `kernel density` (the smooth curve is a model of the samples; CANON §7).
- Each ridge's label carries its `n` (`{label} · n={samples.length}`) so a
  small-sample ridge announces its own thinness — never let a 9-sample curve
  masquerade as authoritative.
- `stat` (`median`/`mean`) is stated per ridge as a small mono tick label
  (`med 33.1` / `μ 33.0`) — the reader knows which central tendency the line is.
- `domain` fixes the x-axis so ridges are comparable; if auto, the axis min/max
  are shown (no truncation trick — the full sample range is visible).

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox:** `0 0 W H`, `W = 720`, `H = 100 + G·RIDGE_STEP` where `G` = number
  of groups and `RIDGE_STEP = 64` (each ridge gets a 64px band; the plot
  self-sizes to the group count — the `power-flow` self-sizing pattern). Margins
  `PAD_L = 20`, `PAD_R = 132` (right gutter holds ridge labels + stats, the
  `power-flow`/`elo-river` gutter), `PAD_T = 34`, `PAD_B = 40` (x-axis rail).
  Plot width `w = W − PAD_L − PAD_R = 568`.
  *(Corrected 2026-07-06: `PAD_T` was 24 and `H = 90 + G·RIDGE_STEP`. The TOP
  ridge (g=0) has nothing above it to overlap into, so if the globally-tallest
  peak happens to be the top ridge, a full `RIDGE_STEP·1.5 = 96 px` peak from
  baseline `PAD_T + RIDGE_STEP` reached `y = 24 + 64 − 96 = −8` — 8 px ABOVE the
  viewBox top, clipping (SVG `overflow: visible` would leak it outside the card).
  Room above the top baseline must be ≥ the max peak: `PAD_T + RIDGE_STEP ≥
  1.5·RIDGE_STEP ⇒ PAD_T ≥ 32`. Set `PAD_T = 34` (2 px clearance) and bump the
  `H` constant to `100` so the bottom date-rail gap stays 26 px for every `G`.)*
- **X (the metric axis):** `x(v) = PAD_L + (v − dMin)/(dMax − dMin)·w` over
  `domain = [dMin, dMax]`. A mono `{unit}` axis rail along the bottom with ~6
  ticks (nice round values), `--ink` @ 0.6.
- **KDE per group** (the shared distribution math, mirrors the standard Gaussian
  KDE — no physics sheet covers this, so the formula is stated here in full and
  the §11 anchor pins it):
  - bandwidth by **Silverman's rule**: `bw = 1.06·σ·n^(−1/5)` where `σ` = sample
    standard deviation, `n` = sample count, **floored at `(dMax−dMin)/40`** so a
    tiny-σ sample can't produce a spike thinner than the axis resolution.
  - density on a grid of `M = 128` x-positions across `domain`:
    `f(x) = (1/(n·bw))·Σ_i K((x − s_i)/bw)`, `K(u) = (1/√(2π))·e^(−u²/2)`.
  - **Height normalization:** each ridge is scaled so the **tallest peak across
    ALL groups** = `RIDGE_STEP·1.5` px (ridges may overlap the band above by up
    to 50% — the ridgeline signature). Using ONE global scale (not per-ridge)
    means a ridge that is genuinely taller/peakier reads as taller — the
    comparison stays honest. `SY = (RIDGE_STEP·1.5) / max_g(max_x f_g(x))`.
- **Ridge baseline + path:** group `g` (0-indexed from the top) has baseline
  `yb_g = PAD_T + g·RIDGE_STEP + RIDGE_STEP`. Its filled area path runs the KDE
  curve `y = yb_g − f_g(x)·SY` left→right across the 128 grid points (monotone
  cubic smoothing between grid points), closed along the baseline right→left.
  Drawn **top group last is wrong** — draw **bottom group first, top group last**
  so upper ridges overlap (occlude) the ones below, the ridgeline look. Each
  ridge fill is semi-opaque so the overlap still reads (§6).
- **Central line:** a vertical tick at `x(stat_g)` (median or mean per §3) from
  the ridge baseline up to the curve height at that x, `--ink` @ 0.5 (subject:
  volt @ 0.9), with the mono stat label (`med {v}` / `μ {v}`) just above it —
  this is the "where the middle sits" anchor that makes the shift between ridges
  legible.
- **Subject emphasis:** the `subject: true` ridge is filled volt (§6), its edge
  1.5px volt, its central line volt, and a faint **volt guideline** (a `--accent`
  @ 0.25 dashed vertical) is drawn at the subject's median x, spanning from the
  subject's central-line tick **across every OTHER ridge's band** — i.e. from the
  topmost ridge baseline to the bottommost ridge baseline (the full stack extent),
  clamped to the plot — so the reader can see where the whole field sits relative
  to the subject's center; the money comparison, drawn. *(Corrected 2026-07-06:
  the guideline formerly "drops … down through all lower ridges", which is
  undefined when the subject is the BOTTOM ridge in the array (no lower ridges to
  drop through — the schema allows `subject` at any array position). It now spans
  the full stack in both directions from the subject's tick, so it works for a
  subject placed anywhere.)*
- **Right-gutter labels:** at each ridge baseline, `{label}` (sans 12px) +
  `n={n} · {stat} {v}` (mono 11px tabular) in the gutter, connector-free
  (aligned to the baseline). Bracket-tag the subject: `[{subjShort}]` style
  (`worlds/sports.md` motif 3) — but ridge labels are usually names, so the
  bracket applies to the subject label only.
- **Size constants:** ridge edge 1px (subject 1.5px); central tick 1px; subject
  guideline dashed 1px; axis ticks 1px @ 0.6. **375px:** viewBox unchanged (SVG
  scales); `PAD_R` → 96 (labels wrap under the ridge instead of in the gutter if
  a label > 14 chars); `RIDGE_STEP` unchanged (vertical scroll is fine); mono
  authored at 11px stays ≥ 9.5px after scale (verify per CANON §13).

## 5. Motion spec (names from motion.md)

- Reveal (once, on scroll-in, `.px-prdg:not(.is-in)` states `html.js`-gated —
  §9 AGENTS contract):
  1. x-axis rail `reveal` (opacity, 250 ms);
  2. ridges `sweep` — each ridge fill revealed left→right via an animated
     `clipPath` growing in x (900 ms `--ease`), **bottom→top stagger 40 ms**
     (sports pace) so the ridges "rise" in sequence; the subject ridge draws
     with the group but at 1.0 not 0.72 fill;
  3. central-line ticks + stat labels `reveal` after each ridge's sweep;
  4. the subject guideline drops (`sweep` vertical, 400 ms) **overlapping the
     final ridge's sweep tail** (it starts when the subject ridge's own sweep
     completes, not after the whole stack), and the subject's right-gutter tag
     `stamp`s LAST (220 ms `--ease-snap`) — the verdict beat on the followed
     athlete.
  Full sequence ≤ **1.6 s** (stagger budget). *(Clarified 2026-07-06: at the
  max 7 groups the ridge sweep ends at ≈ 900 + 6·40 = 1140 ms; the guideline
  drop must OVERLAP that tail rather than follow it — 1140 + 400 + 220 sequenced
  = 1.76 s would be over budget, whereas overlapping the 400 ms drop and trailing
  only the 220 ms stamp closes the card by ≈ 1.36 s. Phase 1's axis reveal also
  overlaps phase 2.)*
- **No ambient motion** (`worlds/sports.md`).
- Reduced-motion / no-JS: all ridges + lines + labels painted final (clipPaths at
  full width), subject pre-emphasised, `stamp` pre-stamped. This IS the print plate.
- **Composed still:** the full stack of ridges, central lines + stat labels,
  subject volt with its dropped guideline, x-axis rail, right-gutter labels.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| field/comparison ridges (fill) | `--ink` @ **0.14** fill + `--ink` @ 0.4 (1px) edge — quiet ink shapes |
| subject ridge (fill) | `--accent` (volt) @ **0.28** fill + `--accent` @ 0.9 (1.5px) edge — the volt subject |
| central line (median/mean) | `--ink` @ 0.5 (field) · `--accent` @ 0.9 (subject) |
| subject median guideline | `--accent` @ 0.25, dashed (1px), dropped through lower ridges |
| x-axis rail + ticks | `--ink` @ 0.6, mono |
| right-gutter labels / stats | sans `--ink` @ 0.92 + mono `--accent-deep` values (subject label bracketed volt) |
| chips (`kernel density`, `n=…`) | `.px-viz__cap` mono unit-chip |

Two-tone discipline holds: quiet ink field ridges, one volt subject — the
rivalry-pair role (`worlds/sports.md`: volt = subject, and here the field is
ink rather than orange because the "opponent" is the whole population, not a
single rival). `--accent-alt` (orange) is available if a payload marks a second
subject as an explicit RIVAL (e.g. two named athletes head-to-head) — a variant
noted but not default; then orange = the second athlete's ridge, per the
rivalry-pair rule. v1 default: one volt subject, ink field.

## 7. Fallback design (first-class)

Build-time static SVG already — **no separate fallback needed** (`power-flow`
posture). No-JS = the final painted ridge stack (the reveal only animates
clipPath growth + tick opacity). This IS the print plate. The no-JS/AT reader
gets:

- The complete ridgeline stack, every ridge filled, central lines + stat labels,
  subject volt with its guideline, x-axis, and right-gutter labels — nothing
  requires JS.
- `role="img"` + `aria-label` summarising the subject-vs-field comparison ("the
  subject's median {metric} is {v} {unit}, {Δ} {unit} above the field's {v}").
- **A compact stats ledger** as the AT-readable data source — but the right-
  gutter labels already carry `{label} · n={n} · {stat} {v}` per ridge, which IS
  the ledger inline; at ≤ 7 groups this never exceeds the 5-row-collapse concern
  in a way that needs folding (7 gutter labels beside 7 ridges is the natural
  layout, not a legend list — CANON §4.5's collapse rule targets separate legend
  lists, not the ridges' own inline labels). If groups = 7 and labels are long,
  they wrap under their ridges at 375px (§4) rather than collapsing.
- The `metric`, `unit`, `stat` choice, and `source_n` in the caption/source row.

## 8. Interaction spec

- **None interactive in v1** (SVG stays pure — `power-flow` posture; zero
  controls trivially satisfies one-control-max). The distributions, their
  centers, and the subject-vs-field shift are all readable at rest. The `⤢`
  expand-to-modal (automatic on `.px-viz`) is the study view.
- Everything readable without interacting (CANON §9): the shapes, the medians,
  and the volt guideline showing where the field sits relative to the subject
  are all in the composed still + caption.
- Keyboard/AT: no focusable interactive elements; the `aria-label` + inline ridge
  labels + source line carry the content.
- *(Deliberately not adding a metric-switching chip in v1 — one ridge-set per
  section keeps the "at most one control" budget at zero and the form pure. A
  future `pace-ridge` variant could add a single chip-set to swap `metric`, but
  that is out of scope and would be the ONE control if added — noted, not built.)*

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "Each stacked shape is
  one group's whole range of {metric}: wider where more of them cluster, with a
  line marking the middle. The volt shape is the athlete this story follows —
  compare where their shape sits against the field's."
- **how** (ExpandModal): "Read each ridge as a range, not a single number — the
  hump is where most values fall, and the marked line is the middle. The volt
  guideline shows where the field sits against the subject's middle. Press ⤢ to
  study it larger."
- Caption guidance: state the distributional claim (shift vs spread vs tail —
  "the whole curve sits 3 km/h right of the field"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 55 words — right-gutter labels (≤7 ×
  ~4 words = the inline data source, exempt as the ledger) + stat ticks ~7 +
  axis ~6 + chips ~4 + caption ~28 + plain ~40 … caption + plain dominate;
  on-plate non-ledger text (axis + stat ticks + chips) ≈ 17 words, under 80.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 700 (≤7 ridge paths at 128 pts each + ≤7 clip rects + central lines + axis ticks + gutter labels) |
| `data` payload | ≤ 6 KB (7 groups × up to ~120 samples × a number). Samples over ~120/group are randomly down-sampled to 120 at build (KDE is stable — declared) to hold the cap. |
| JS | none beyond the shared `core/Reveal.astro` island (KDE is build-time; ridge growth is CSS clipPath) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (reads as a captioned ridge stack)
      · 375px no overflow, mono labels ≥ 9.5px · reduced-motion / no-JS = full
      painted stack (view-source check) · token grep (only `--ink`/`--accent`/
      `--accent-deep`; no stray hex) · caption + source + plain all render ·
      payload degradation (2–7 groups; missing `domain`→nice-rounded sample
      range; missing `stat`→median; `subject` optional) · `px-prdg` prefix unique
- [ ] **Worked anchor (recomputable):** for the subject's 15 samples, the median
      (`stat: median`) is the 8th-order-statistic = **33.0 km/h** (sort:
      30.8, 31.2, 31.9, 32.0, 32.1, 32.4, 32.7, **33.0**, 33.1, 33.5, 33.8,
      34.2, 34.6, 34.9, 35.1 — 15 values, 8th = 33.0); the field group's median
      (18 samples, mean of the 9th+10th order stats 29.2 & 29.4) is **29.3 km/h**.
      So the subject's central line sits **3.7 km/h right** of the field's → the
      caption's "nearly 4 km/h right" is earned. A reviewer sorts each `samples` array
      and recomputes the medians + the shift. (Bandwidth: subject sample-σ ≈
      1.322, n=15 → Silverman `bw = 1.06·1.322·15^(−0.2) ≈ 0.815 km/h`, floored
      at `(36−24)/40 = 0.3` — so 0.815 wins; the ridge is smooth, not spiky.)
- [ ] Height normalization is GLOBAL (one `SY` across all groups) — a genuinely
      peakier/narrower distribution renders taller; spot-check that the tallest
      ridge peak = `RIDGE_STEP·1.5` px and no ridge exceeds it
- [ ] Each ridge is a Gaussian KDE (smooth), not a raw histogram; the
      `kernel density` chip renders; each ridge label carries its `n=`
- [ ] The subject ridge is volt (fill 0.28 + 1.5px edge) with a volt central
      line and a dashed volt guideline dropped through the lower ridges; field
      ridges are quiet ink; exactly one subject honoured
- [ ] Central lines sit at the correct median/mean per `stat`; the tick label
      reads `med {v}` / `μ {v}` matching the choice
- [ ] `domain` fixes the x-axis (all ridges share it); omitting it shows the full
      nice-rounded sample range (no truncation) with the min/max ticks visible
- [ ] Ridges overlap correctly (upper ridges occlude lower — bottom drawn first);
      the plot height self-sizes to the group count (`H = 100 + G·64`, `PAD_T =
      34`), and the TOP ridge at a full `RIDGE_STEP·1.5` peak fits inside the
      viewBox (peak `y ≈ 2`, no top clip)
- [ ] No-JS: identical final stack (reveal only animates clipPath + opacity);
      `role="img"` + `aria-label` describe the shift; gutter labels carry
      `label · n · stat` per ridge
- [ ] Subject gutter tag `stamp`s last; single accent+ink discipline (grep: no
      per-group color literals in v1 default)

---

*Registry duties (P6, at implementation — NOT now): add `pace-ridge` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry
(`src/lib/explainers.ts`), add the catalog block (`docs/design/catalog.md` —
`npm run check:catalog` must pass), document the `px-prdg` prefix in
`src/components/AGENTS.md` §4, and add a worked example to
`src/content/issues/2026-06-03-sports-showcase`. Do NOT edit SECTION_KINDS or
catalog.md at blueprint time.*
