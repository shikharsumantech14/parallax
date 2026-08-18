# price-swarm — every bed in the valley, at its real price

> Blueprint for `price-swarm`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/travel.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `price-swarm` |
| World | travel |
| Tier | SVG beeswarm + one dot-select island |
| Component path | `src/components/topic/travel/PriceSwarm.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-swm` |
| Flagship reference | `pace-ridge` (sports) for the distribution vocabulary; `scaling-plot` (tech) for the dot + label discipline |

## 2. What it shows / when to use

Every observation as one dot, positioned by value and nudged only to avoid overlap. The reader learns where the market actually sits, and what the outliers do to the average.

- **USE WHEN:** 20–60 individual observations of one value where the cluster and its outliers are both the argument, and the gap between mean and median is the point.
- **DON'T USE:** summary quartiles per period (→ `fare-spread`); a smooth distribution of a large sample (→ `pace-ridge`, sports); values over time (→ `fare-terrain`); a countable rate out of 100 (→ `attrition-waffle`).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface PriceSwarmData {
  metric: string;         // e.g. 'price per night'
  unit: string;           // '₹'
  scale?: 'log' | 'linear';   // default: log when max/min > 6
  items: { name: string; value: number; note?: string }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: price-swarm
data:
  metric: price per night
  unit: ₹
  scale: log
  items:
    - { name: Porter House,      value: 900 }
    - { name: Village Rest,      value: 1000 }
    - { name: Lukla Halt,        value: 1050 }
    - { name: Trail End,         value: 1150 }
    - { name: Trekkers Halt,     value: 1100 }
    - { name: Sherpa Home,       value: 1200 }
    - { name: Pine Rest,         value: 1250 }
    - { name: Namche Lodge,      value: 2400 }
    - { name: Icefall Inn,       value: 2700 }
    - { name: Summit Lodge,      value: 8400, note: One of two lodges that sit entirely outside the market. }
    - { name: Ama Dablam View,   value: 9600, note: The dearest bed in the valley, and 3.5× the next one down. }
    # … 42 in total
  caption: Forty of forty-two beds cost between ₹900 and ₹2,700; two cost more than ₹8,000.
  source: Walked survey of 42 registered guesthouses, October 2025
```

Two declared requirements:

1. **Vertical position is meaningless** and the plain line must say so. Dots are
   nudged only to avoid overlap; there is no y variable.
2. **Deterministic packing.** Bucket the x positions at 8px, then alternate
   above/below the axis in insertion order: for the `k`-th dot in a bucket
   (0-indexed), `y = axisY + ceil(k / 2) × 11 × (k odd ? −1 : +1)`. No random
   jitter — a swarm that reshuffles between builds is not a chart. Log x renders
   the `log scale` chip when `scale` resolves to log.

## 4. Geometry spec

`viewBox="0 0 440 210"`, `width:440px; height:210px`.

- **Axis** at y 150, x 30 → 430, 1px.
- **x (log)** `swx(v) = 34 + log(v / domainMin) / log(domainMax / domainMin) × 392`.
  Linear mode maps the padded data range.
- **Dot** r 4.6 at rest, 6.4 when selected, with a 1px stroke so overlapping dots
  stay individually countable.
- **Packing** per §3 — the swarm grows upward and downward from the axis
  alternately, so the visual mass is centred on the axis line.
- **Mean and median markers** — two vertical lines from y 18/30 to y 150:
  - **median:** 1.4px solid `--accent`, label at `y = 14`,
    `text-anchor="end"`
  - **mean:** 1px dashed `4 3` `--ink` @ 0.55, label at `y = 26`,
    `text-anchor="start"`

  **The two labels sit on different rows and anchor away from each other** — at
  9px they collide when mean and median are close, which is exactly when the chart
  is most interesting. This was a real defect in the prototype.
- **x-axis ticks** at nice log steps (`₹1k, ₹2k, ₹4k, ₹8k`) with labels at
  `y = 169`; axis title at `x = 230, y = 192`.
- **375px:** the SVG scales; dot radius drops to 3.6/5, and the mean/median labels
  shorten to `x̄` and `M` with the full words in the legend below.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Dots do not fly into place.
- **On selection:** radius steps with no transition; the readout swaps.
- **Composed still:** the highest-value item selected (the outlier that makes the
  argument), both markers drawn, all dots visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| dot, in the main cluster | `--accent` mixed toward `--ink` 25% @ 0.90 |
| dot, outlier (> 2× median) | `--ink` @ 0.55 |
| dot, selected | `--accent-deep` @ 1.0, `--ink` stroke |
| dot stroke, rest | `--ink` @ 0.35 |
| median line + label | `--accent-deep` @ 1.0 |
| mean line + label | `--ink` @ 0.60 |
| axis + ticks | `--ink` @ 1.0 / 0.55 |
| axis title | `--ink` @ 0.50 |
| readout value | `--accent-deep` @ 1.0, mono 700 |
| readout ratio, > 2× median | `--accent-deep` @ 1.0 |

Outliers are drawn in ink rather than accent — they are the observations that are
not part of the market, and desaturating them says so without hiding them.

## 7. Fallback design

Build-time SVG:

1. The **whole swarm**, deterministically packed, with both markers and the axis.
2. The **readout** for the default item.
3. A `<table>`: item, value, rank, and multiple-of-median. Plus a summary line —
   n, median, mean, and the gap between them. AT-readable source; SVG
   `aria-hidden="true"`.

## 8. Interaction spec

**One control** — item selection.

- **Targets:** each dot is a `<button>` with a ≥24px hit area, plus the table
  rows. Tab order is by value, ascending. `touch-action: pan-y`.
- **Readout template** (`aria-live="polite"`):
  `"{name} — {value} {unit}. {nBelow} of {n} cost less. {ratio}× the median of {median}. {note}"`
- **Keyboard:** complete; `←`/`→` step by value order, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "One dot per guesthouse, placed left to right by nightly price.
  Dots are nudged vertically only so that they do not sit on top of each other —
  height carries no meaning. Where the dots pile up is where the market actually
  is."
- **`how`**: "Move across the swarm for any single observation. The two marked
  lines are the mean and the median; the distance between them is what the
  outliers are doing to the average."
- **Caption guidance:** the cluster and the outliers, with numbers — "forty of
  forty-two beds cost between ₹900 and ₹2,700; two cost more than ₹8,000".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 120 (60 dots + markers + axis) |
| `data` payload | ≤ 4 KB |
| Island JS | ≤ 1 KB minified, inline |
| Items | 20–60 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] **The plain line states that vertical position is meaningless**
- [ ] Packing is deterministic — two builds of the same payload are pixel-identical
- [ ] Mean and median labels sit on different rows and anchor apart; they do not collide when the two values are close
- [ ] Log scale renders the `log scale` chip
- [ ] Outliers (> 2× median) render in desaturated ink, not the accent
- [ ] Dots keep a 1px stroke so overlaps stay countable
- [ ] Dot hit areas ≥ 24px
- [ ] The readout gives the multiple-of-median
- [ ] Fallback summary states n, median, mean and the gap
- [ ] No-JS: full swarm + default readout + item table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-travel-showcase`.*
