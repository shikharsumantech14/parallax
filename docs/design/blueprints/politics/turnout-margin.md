<!-- ────────────────────────────────────────────────────────────────────────────
 COPIED FROM THE DESIGN HANDOFF, 2026-08-27, WITH FOUR STANDING CORRECTIONS.

 The handoff folder is a delivered artifact; this is the in-repo contract. Where
 they differ, THIS file wins, because the handoff could not know the repo.

 1. SVG TEXT — the handoff TYPE-MAPPING.md:25 prescribes
    font-family="var(--font-mono)". Do not use it. NOT because var() fails —
    measured 2026-08-27, it resolves fine in Chromium — but because a
    presentation attribute is the lowest-specificity thing in CSS, so any
    stylesheet rule silently beats it, and because satori/resvg do no var()
    substitution when they rasterise the OG cards. Use a LITERAL stack in a
    style attribute:
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

# turnout-margin — two numbers that stopped moving together

> Blueprint for `turnout-margin`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/politics.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `turnout-margin` |
| World | politics |
| Tier | SVG connected scatter |
| Component path | `src/components/topic/politics/TurnoutMargin.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-tmg` |
| Flagship reference | `approval-chart` for axis treatment; `scaling-plot` (tech) for the scatter + label-offset pattern |

## 2. What it shows / when to use

Two numeric series plotted against each other and joined in time order, so the reader sees a path rather than a trend — and sees where the relationship between the two reversed.

- **USE WHEN:** exactly two numeric series over 4–8 ordered periods where the RELATIONSHIP between them changes — the path doubling back is the argument.
- **DON'T USE:** one series over time (→ `approval-chart`); two series that move together and just need two lines (→ `approval-chart` with two series); ranked positions (→ `rank-bump`).
- **Pairs with:** `default` or `wide`. Not hero-capable — it needs its "how to read" block adjacent.

## 3. Data schema

```ts
interface TurnoutMarginData {
  x: { label: string; unit: string };
  y: { label: string; unit: string };
  points: {
    period: string;   // the label drawn at the dot
    x: number;
    y: number;
    note?: string;    // surfaced on hover/focus
  }[];               // in TIME order — the path follows array order
  caption?: string;
  source?: string;
}
```

```yaml
kind: turnout-margin
data:
  x: { label: Turnout, unit: '% of registered voters' }
  y: { label: Winning margin, unit: pts }
  points:
    - { period: '2004', x: 58.1, y: 3.6,  note: A coalition assembled after the count rather than before it. }
    - { period: '2009', x: 58.2, y: 4.8,  note: Turnout flat, margin up. At this point the two numbers are unrelated. }
    - { period: '2014', x: 66.4, y: 12.1, note: Eight points more turnout, and the widest margin in the series. }
    - { period: '2019', x: 67.4, y: 14.9, note: The peak of both numbers. Every election after this moves down and to the right. }
    - { period: '2024', x: 65.8, y: 9.2,  note: Turnout slips a point and a half; the margin falls by almost six. }
    - { period: '2026', x: 68.9, y: 6.4,  note: Record turnout, and the closest result since 2009. }
  caption: Turnout rose eleven points while the winning margin ended lower than it started.
  source: Election Commission turnout and margin tables, 2004–2026
```

**The connecting path is time-ordered, not a fit.** Never draw a regression
line through these points — the whole argument is that the relationship is not
monotonic. Axis ranges are authored-free (computed with a 6% pad) but must
include the origin only if the data does; **no forced zero**, and the caption
carries the range if it is surprising. No compression, **no honesty chip**.

## 4. Geometry spec

`viewBox="0 0 440 260"`, rendered at `width:440px; height:260px`.

- **Plot box** x 46 → 424, y 24 → 222.
- **Scales** linear, padded 6% beyond the data range on both axes, then rounded
  outward to a "nice" step (1, 2, 2.5, 5 × 10ⁿ). Four gridlines per axis.
- **Horizontal gridlines** at each y tick, x 46 → 424, 1px; y-tick labels at
  `x = 40`, `text-anchor="end"`, `y + 3.5`, 9.5px mono. The topmost label
  carries the unit (`16 pts`), the rest are bare numerals.
- **x-axis rule** at y 222, 1px `--ink`. x-tick labels at `y = 240`,
  `text-anchor="middle"`. **Axis title** at `x = 235, y = 256`,
  `text-anchor="middle"`, 9px mono uppercase.
- **Path** through the points in array order, straight segments, 1.6px.
- **Dots** r 4.6 at rest, 7 when selected. Rest fill is `--paper` with a 1.2px
  `--ink` stroke (hollow, so the path reads through); the selected dot fills
  `--accent`.
- **Period labels — use an explicit offset table.** A single rule collides at
  375px; this is the prototype's tuned set for the example payload:

  | index | dx | dy | anchor |
  |---|---|---|---|
  | 0 | 0 | −14 | middle |
  | 1 | 0 | +22 | middle |
  | 2 | −9 | +4 | end |
  | 3 | +9 | +4 | start |
  | 4 | +9 | +4 | start |
  | 5 | 0 | −14 | middle |

  For other payloads: default `dy −14 / middle`, and flip to the side
  (`dx ±9 / start|end`) whenever the previous label's box is within 16px.
  Blueprint acceptance requires zero label overlap at 375px.
- **375px:** the SVG scales; period labels drop to two digits, and the axis title
  moves above the plot as an HTML eyebrow.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. The path does NOT draw itself — a
  `stroke-dashoffset` reveal would imply the path is a trajectory in progress.
- **On selection:** dot radius steps with no transition; the readout swaps
  (`aria-live`).
- **Composed still:** the last point selected (the most recent period), its dot
  filled, the readout showing its two values and the change since the previous
  period.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| gridlines | `--rule` @ 1.0 |
| axis rule | `--ink` @ 1.0 |
| tick labels, axis title | `--ink` @ 0.50 |
| path | `--accent` @ 0.80 |
| dot, rest | fill `--paper`, stroke `--ink` @ 1.0 |
| dot, selected | fill `--accent` @ 1.0, stroke `--ink` |
| period labels | `--ink` @ 0.60 |
| readout values | `--ink` @ 1.0, mono 700 |
| readout delta, adverse direction | `--accent-deep` |

One accent only. The path and the selected dot share it; nothing else is
coloured, so the eye follows the sequence rather than hunting a legend.

## 7. Fallback design

Build-time SVG plus a table:

1. The **whole plot** — path, all dots, all period labels, both axes.
2. The **readout** painted for the last point.
3. A `<table>`: period, x value, y value, change in y. AT-readable source; the
   SVG is `aria-hidden="true"`.

No state is hidden behind the interaction.

## 8. Interaction spec

**One control** — point selection.

- **Targets:** each dot is a `<button>` (with a ≥24px invisible hit area, since
  the visible dot is 9px), plus the table rows. Tab order follows time order.
  `touch-action: pan-y`.
- **Effect:** fill that dot, swap the readout.
- **Readout template** (`aria-live="polite"`):
  `"{period} — {x.label} {x}{x.unit}, {y.label} {y}{y.unit}. Change in {y.label} since {prevPeriod}: {±d}. {note}"`
- **Keyboard:** `←`/`→` step through the points in time order; `Esc` returns to
  the last point.

## 9. Comprehension text

- **`what`**: "Each dot is one election, placed by turnout across the bottom
  and by the winner's margin up the side, joined in time order. This is a path
  rather than a trend — where it doubles back, the two numbers stopped moving
  together."
- **`how`**: "Trace the path in date order and watch for the reversal. Hover any
  dot for that election's two numbers and the change in margin."
- **Caption guidance:** state the divergence — "turnout rose eleven points while
  the winning margin ended lower than it started".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 90 |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 0.8 KB minified, inline |
| Points | 4–8 (above 8 the labels cannot be placed honestly) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] No regression or trend line is drawn anywhere
- [ ] Path follows array order, not sorted by x
- [ ] Zero label overlap at 375px (measure every pair's bounding boxes)
- [ ] Axes are not forced to zero unless the data reaches it
- [ ] Rest dots are hollow so the path reads through them
- [ ] Readout gives both values, the delta, and the note
- [ ] `←`/`→` step in time order; `Esc` returns to the last point
- [ ] Dot hit area ≥ 24px despite the 9px visible dot
- [ ] No-JS: full plot + last-point readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in
`2026-06-03-politics-showcase`.*
