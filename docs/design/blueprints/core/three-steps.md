# Blueprint — `three-steps`

> **Corrections header (2026-09-13, at implementation):** the story cap is
> **3**, not 4 — four stacked steps measure roughly 800px against the 667px
> card even at the 25-word cap, so `TRIM['three-steps']` keeps three and §11
> check 7 reads "≤ 3 steps fit". The `→` sits centred ON the right hairline
> (`right: 0; translate(50%, -50%)`) over a `var(--bg)` patch, mirrored to the
> bottom edge for the stacked `↓`, so the rule never runs through the glyph.
> Word caps are `check:prose`'s. Written under `docs/REGISTER-PLAN.md` RG-09. A mechanism in three numbered cards, one
> idea each, read left to right. The contract's "the mechanism in two short
> sentences" rule given a shape. Narrative kind (no plain line, no
> how-to-read, no card); universal; lives in `core/`. `_TEMPLATE.md`'s
> preamble applies.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `three-steps` |
| World | universal |
| Tier | HTML, static |
| Component path | `src/components/core/ThreeSteps.astro` |
| CSS prefix | `px-3s` (verified free 2026-09-13) |
| Flagship reference | `core/BeatSheet.astro` (narrative root); `topic/politics/BillPassage.astro` for a staged card row |
| Shell | none — narrative kind. Bare root with `data-reveal`. Joins the `NARRATIVE` set in `scripts/check-catalog.mjs` and the header list in `src/lib/explainers.ts`. |

## 2. What it shows / when to use

How something works, in three moves, each short enough to repeat to a friend.

- **USE WHEN:** the dossier describes a mechanism with a clear order — cause,
  what it does, what that leaves behind — and no data series to draw.
- **DON'T USE:** dated events (→ `timeline`); timed beats of an episode
  (→ `beat-sheet`); a bill's procedural stages (→ `bill-passage`); a
  mechanism with numbers at each stage (→ `power-flow`, `carbon-loop`).
- **Pairs with:** `layout: default`; a quiet section; often right before the
  chart that shows the mechanism's result.

## 3. Data schema

```ts
interface ThreeStepsData {
  steps: Array<{
    title: string;     // ≤ 6 words ("The tap opens")
    text: string;      // ≤ 25 words, the register; an analogy is welcome here
  }>;                  // 2–4; three is the shape; TRIM caps at 3 (see the corrections header)
  source?: string;     // rendered by core/Section.astro if given
}
```

Example payload (El Niño; the mechanism is in the published issue, the
geyser is the contract's worked analogy):

```yaml
- kind: three-steps
  eyebrow: "HOW THE FLOOR RISES"
  title: "Why the next cool year starts higher than the last."
  data:
    steps:
      - title: "The geyser never switches off"
        text: "Of every 100 units of extra heat the planet traps, about 91 go into the ocean and stay there."
      - title: "El Niño opens the tap"
        text: "Some of that stored heat spills into the air. The world's surface temperature jumps for a year."
      - title: "La Niña closes the tap"
        text: "The air cools a little, but the ocean is warmer than the last time. So the next 'cool' year starts above the old floor."
  source: { label: "WMO State of the Global Climate 2025; NOAA Climate Prediction Center" }
```

## 4. Geometry spec

- Root: `<div class="px-3s" data-reveal>`, `border-top: 1px solid var(--rule)`.
- `.px-3s__row`: `display: grid; grid-template-columns: repeat(N, minmax(0, 1fr))`
  at ≥ 640px where N is the step count; one column below 640px.
- `.px-3s__step`: `padding: 18px 20px 18px 0` (16px 0 below); a `1px solid
  var(--rule)` right border between steps at ≥ 640px (`padding-left: 20px` on
  all but the first); a bottom hairline between stacked steps below 640px.
- The arrow: each step but the last carries `::after` with content `→` at
  ≥ 640px — `font-family: var(--font-display)`, 20px, `color: var(--accent)`,
  absolutely positioned at the step's right edge, vertically centred on the
  numeral row — and `↓` below 640px, centred under the step. (Pure CSS; no
  SVG.)
- `.px-3s__n` (numeral): `font-family: var(--font-display)`, 700, 26px /
  1, tabular, `color: var(--accent-deep)`, margin-bottom 8px. Rendered as
  "1", "2", "3" (never "01").
- `.px-3s__t` (title): `font-family: var(--font-display)`, 700, 16.5px /
  1.3, `color: var(--ink)`, margin-bottom 6px.
- `.px-3s__x` (text): `font-family: var(--font-body)`, 15.5px / 1.5,
  `color: var(--ink-soft)`, max-width `30ch`.
- Flat; no radius, no shadow.

## 5. Motion spec

`data-reveal` on the root. Optional: the kit's stagger on the steps if it is
CSS-only and already shared (`--i` custom property, as DataReadout does).
Reduced motion: still.

## 6. Color spec

`--ink`, `--ink-soft`, `--muted`, `--accent`, `--accent-deep`, `--rule`. The
arrow is the only vivid mark.

## 7. Fallback design

Static HTML; the fallback is the component.

## 8. Interaction spec

None.

## 9. Comprehension text

Narrative kind: no `EXPLAIN` entry, no plain line, no how-to-read. The
section `title` states the mechanism's outcome; the steps are its reading.

## 10. Performance budget

Zero JS. ≤ 50 lines of scoped CSS.

## 11. Acceptance checklist

1. Silhouette: three numbered cards with arrows, JS disabled.
2. 375px: stacked with `↓` between, no overflow, text ≥ 15px.
3. Reduced motion: still.
4. Tokens only; `px-3s` unique; flat.
5. Nothing emitted beyond the steps: no caption, source, plain or how.
6. Two and four steps render correctly (grid adapts; arrows only between).
7. Story card: ≤ 3 steps fit 375×667 (TRIM caps at 3).
8. `check:catalog` green with the kind in `NARRATIVE`.
