<!-- ────────────────────────────────────────────────────────────────────────────
 COPIED FROM THE DESIGN HANDOFF, 2026-08-27, WITH FOUR STANDING CORRECTIONS.

 The handoff folder is a delivered artifact; this is the in-repo contract. Where
 they differ, THIS file wins, because the handoff could not know the repo.

 1. SVG TEXT — the handoff TYPE-MAPPING.md:25 prescribes
    font-family="var(--font-mono)". A CSS variable inside an SVG PRESENTATION
    ATTRIBUTE does not resolve; every axis label would silently render in the
    browser default serif. Use a LITERAL stack in a style attribute:
      style="font-family:'JetBrains Mono',ui-monospace,monospace"
    (RD-01b. See src/components/AGENTS.md section 5.)

 2. TOKENS — the three tokens this blueprint may reference resolve per
    docs/design/TOKEN-RECORD.md: --paper-warm is REAL (TD-01, six measured
    values); --paper-deep is an ALIAS of it (TD-02), not a second surface;
    --accent-warm maps to --accent-alt (TD-03, flagged — check it against
    this blueprint section 6).

 3. DISPATCH — ignore registry/SectionBody.diff.md. Its arms read
    {kind === x && <X data={section.data} />}: there is no bare "kind"
    variable in SectionBody.astro, and NO component in this repo takes a
    "data" prop. "Fixing" it by prepending section. renders the component on
    its prop defaults — an empty chart, no error, green build. Use the repo
    idiom: {section.kind === x && <X ...flat named props />}

 4. EXPLAINER LENGTH — "plain" is Zod-capped at 220 chars and 13 of the 28
    supplied "what" strings exceed it. The EXPLAIN map is uncapped, so a long
    string is safe THERE, but an author copying it into a section plain:
    breaks the build. Keep EXPLAIN entries under 220 and move the surplus
    into "howToRead", which is capped at 360.

 Also: the SCREENSHOT is reference only. Four of them contain real ledger
 overflow bugs that these blueprints already document and correct — where
 they disagree, the blueprint wins.
──────────────────────────────────────────────────────────────────────────── -->

# route-criteria — six routes, and no route that wins

> Blueprint for `route-criteria`. Contract, not a suggestion — if implementation
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
| `kind` | `route-criteria` |
| World | travel |
| Tier | SVG parallel coordinates + one route-select island |
| Component path | `src/components/topic/travel/RouteCriteria.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-pcd` |
| Flagship reference | `player-radar` (sports) for the multi-axis normalisation discipline; `city-compare` for the criteria vocabulary |

## 2. What it shows / when to use

Options scored on several criteria in different units, each axis normalised to its own best. The reader learns that there is no best option, only different things to want.

- **USE WHEN:** 4–8 options scored on 4–6 criteria in DIFFERENT units, where no option dominates and the trade-off is the argument.
- **DON'T USE:** one entity's multi-axis profile (→ `player-radar`, sports); two entities on numeric rows (→ `city-compare`); a single ranking (→ `league-table`, sports, or a table); criteria that share a unit and scale (→ `comparison`).
- **Pairs with:** `wide`. Not hero-capable.

## 3. Data schema

```ts
interface RouteCriteriaData {
  axes: {
    id: string;
    label: string;
    bestLabel: string;    // the real-unit value at the top, e.g. '11 days'
    worstLabel: string;   // at the bottom, e.g. '38 days'
  }[];
  options: {
    name: string;
    color?: string;
    values: Record<string, number>;   // axisId → 0–1 index, 1 = best
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: route-criteria
data:
  axes:
    - { id: cost,  label: Affordability,  bestLabel: cheap,   worstLabel: dear }
    - { id: quiet, label: Quiet,          bestLabel: empty,   worstLabel: crowded }
    - { id: safe,  label: Safety margin,  bestLabel: high,    worstLabel: thin }
    - { id: view,  label: Views,          bestLabel: famous,  worstLabel: modest }
    - { id: short, label: Shortness,      bestLabel: 11 days, worstLabel: 38 days }
  options:
    - { name: Everest base camp,  values: { cost: 0.30, quiet: 0.08, safe: 0.62, view: 0.98, short: 0.52 } }
    - { name: Annapurna circuit,  values: { cost: 0.58, quiet: 0.34, safe: 0.71, view: 0.82, short: 0.24 } }
    - { name: Manaslu circuit,    values: { cost: 0.44, quiet: 0.78, safe: 0.48, view: 0.74, short: 0.38 } }
    - { name: Gokyo lakes,        values: { cost: 0.40, quiet: 0.56, safe: 0.66, view: 0.88, short: 0.62 } }
    - { name: Langtang valley,    values: { cost: 0.82, quiet: 0.62, safe: 0.86, view: 0.44, short: 0.94 }, note: The safest, cheapest and shortest — and the plainest views. }
    - { name: Upper Dolpo,        values: { cost: 0.12, quiet: 0.96, safe: 0.28, view: 0.66, short: 0.08 }, note: The emptiest trail and the least safe. }
  caption: Every line crosses every other line at least once.
  source: Parallax route survey · cost and permit data 2025, crowding from checkpoint counts
```

**Values are 0–1 indices with best at the top**, so the component always
renders the chip `indices 0–1 · best at top` and the axis end labels
(`bestLabel`/`worstLabel`) carry the real units — without them the chart is
unreadable as anything but a ranking. **If one option dominates on every axis, this
is the wrong kind**: the acceptance checklist asserts at least one crossing
between some pair of lines, and the build `console.warn`s when none exists.
A `values` key that matches no axis, or a missing axis, **FAILS the build naming
both**.

## 4. Geometry spec

`viewBox="0 0 780 290"`, `width:100%; height:auto` (the 1080px breakout).

- **Axis x** `pcx(i) = 76 + i · 158` for 5 axes; generally
  `76 + i · (632 / (n − 1))`.
- **Axis line** from y 34 to y 238, 1.4px.
- **y** `pcy(v) = 238 − v × 200` — index 1 (best) at the top.
- **Axis title** at `y = 24`, `text-anchor="middle"`, 10.5px, 700 weight.
- **End labels:** `bestLabel` at `y = 46` and `worstLabel` at `y = 252`, both
  `text-anchor="middle"`, 9px mono.
- **Option line** is a polyline through `(pcx(i), pcy(values[axisId]))` in axis
  order, 1.8px at rest, 3.4px selected. Straight segments — a spline would invent
  values between axes that do not exist.
- **Vertex dots** r 3.2 at rest, 5 selected.
- **Legend** to the right (250px): one row per option, a 16×3 line sample plus the
  name, and a cell naming that option's single strongest axis.
- **375px:** parallel coordinates do not survive 375px with five axes. Below
  700px, the component switches to a **stacked bar-group form**: one block per
  option, five mini bars inside it labelled with the axis names, keeping the
  0–1 indices and the honesty chip. The crossing argument is carried in the plain
  line and the legend's strongest-axis column.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Lines do not draw across.
- **On selection:** unselected lines to 0.13 over 120ms ease-out; the selected
  line's width and dot radius step with no transition.
- **Composed still:** nothing selected — all lines at 0.92, all vertex dots
  visible, legend complete.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| axis line | `--rule` darkened (`color-mix` toward `--ink` 20%) @ 1.0, 1.4px |
| axis title | `--ink` @ 1.0 |
| end labels | `--ink` @ 0.50 |
| option line, rest | option `color`, else the cycle @ 0.92 |
| option line, dimmed | own colour @ 0.13 |
| vertex dot | matches its line |
| legend row, selected | background `--paper-warm` |
| legend strongest-axis cell | `--ink` @ 0.75 |
| honesty chip | `--ink` @ 0.55, mono |

**Fallback colour cycle:** `--accent`, `--accent-deep`, `--ink`, then three
steps between `--accent-alt` and `--ink-soft`. Six distinguishable lines is the
ceiling, which is also the option cap.

## 7. Fallback design

Build-time SVG:

1. The **whole chart** — all axes with their end labels, all option lines and
   vertex dots, the chip.
2. The **legend** with each option's strongest axis.
3. A `<table>`: one row per option, one column per axis, giving the index **and**
   the axis's real-unit end labels in the header — so a no-JS reader can
   reconstruct what an index means. AT-readable source; SVG `aria-hidden="true"`.

## 8. Interaction spec

**One control** — option selection.

- **Targets:** each option line (with a ≥12px transparent stroke-width hit path
  over the 1.8px visible line) and each legend row. Tab order in array order.
  `touch-action: pan-y`.
- **Readout** replaces the legend's note line (`aria-live="polite"`):
  `"{name} — strongest on {bestAxis}, weakest on {worstAxis}. That dip is the trade you are accepting.{note}"`
- **Re-press** clears.
- **Keyboard:** complete; `↑`/`↓` through the legend, `Esc` clears.

## 9. Comprehension text

- **`what`**: "Five vertical axes, one per criterion, each scaled so its own
  best value is at the top and its own worst at the bottom. Every route is a line
  crossing all five, and crossing lines mean the two routes disagree on that pair
  of criteria."
- **`how`**: "Press a route to trace it and see where it dips. If every pair of
  lines crosses somewhere, there is no best route — only different things to want."
- **Caption guidance:** state the no-winner finding — "every line crosses every
  other line at least once".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 140 (8 options × 6 dots + lines + axes) |
| `data` payload | ≤ 4 KB |
| Island JS | ≤ 1.1 KB minified, inline |
| Options × axes | ≤ 8 × 6 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] The `indices 0–1 · best at top` chip always renders
- [ ] Every axis shows both real-unit end labels
- [ ] Index 1 renders at the TOP of each axis
- [ ] A `values` key with no matching axis, or a missing axis, fails the build naming both
- [ ] A dominating option `console.warn`s that this is the wrong kind
- [ ] Lines are polylines, not splines
- [ ] Line hit paths are ≥ 12px wide
- [ ] Below 700px the component switches to the stacked bar-group form, keeping the indices and the chip
- [ ] Legend names each option's strongest axis
- [ ] No-JS: full chart + legend + index table with unit end labels in the header

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-travel-showcase`.*
