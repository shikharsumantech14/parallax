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

# rank-bump — rank, election by election

> Blueprint for `rank-bump`. Contract, not a suggestion — if implementation
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
| `kind` | `rank-bump` |
| World | politics |
| Tier | SVG (build-time, hover isolation only) |
| Component path | `src/components/topic/politics/RankBump.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-bmp` |
| Flagship reference | `approval-chart` for the axis + series treatment; `elo-river` for the multi-series legend and isolation behaviour |

## 2. What it shows / when to use

Where each party finished across a run of elections, and nothing else. The reader learns which positions are genuinely contested and which have never moved.

- **USE WHEN:** 4–8 entities' finishing POSITIONS across 4–8 ordered contests, where overtakes and the stability of the top places are the argument.
- **DON'T USE:** vote shares or seat counts over time (→ `approval-chart` for a series, `seat-chart` for a table); ranked-choice round transfers (→ `ballot-flow`); ratings that carry a magnitude (→ `elo-river`, sports).
- **Pairs with:** `default` or `wide`. Not hero-capable — it is a supporting chart, and its argument needs the prose around it.

## 3. Data schema

```ts
interface RankBumpData {
  contests: string[];        // ordered labels, e.g. ['2004','2009',…]
  entities: {
    name: string;
    short?: string;          // used at 375px
    color?: string;          // data-encoding exemption
    ranks: number[];         // 1-based, one per contest, same length
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: rank-bump
data:
  contests: ['2004', '2009', '2014', '2019', '2024', '2026']
  entities:
    - { name: Government,       ranks: [3, 2, 1, 1, 1, 1] }
    - { name: Main opposition,  ranks: [1, 1, 2, 2, 2, 2] }
    - { name: Regional · south, ranks: [4, 4, 3, 4, 3, 3] }
    - { name: Regional · east,  ranks: [2, 3, 4, 3, 4, 5] }
    - { name: Left front,       ranks: [5, 5, 6, 6, 6, 6] }
    - { name: New entrant,      ranks: [6, 6, 5, 5, 5, 4] }
  caption: First and second have swapped once in twenty-two years.
  source: Election Commission results, 2004–2026
```

**Validation.** Each `ranks` array must be the same length as `contests`,
and for every contest index the set of ranks across all entities must be a
complete permutation `1..n` — no duplicates, no gaps. A violation **FAILS the
build naming the contest**. No compression, so **no honesty chip** — but the
plain line must state that the y-axis carries no magnitude, which is this kind's
one real comprehension risk.

## 4. Geometry spec

`viewBox="0 0 440 250"`, rendered at `width:440px; height:250px` inside the
720px column.

- **x** `bx(i) = 56 + i · 72` — fits 6 contests; for 7–8, `bx(i) = 56 + i · (368/(n−1))`.
- **y** `by(r) = 30 + (r − 1) · 36` — rank 1 at top. For n > 6 ranks,
  `by(r) = 30 + (r − 1) · (186/(n−1))`.
- **Vertical gridlines** at each `bx(i)`, y 24 → 216, 1px.
- **Contest labels** at `y = 234`, `text-anchor="middle"`, 9.5px mono.
- **Rank gutter** — the numerals 1..n at `x = 18`, `y = by(r) + 4`,
  `text-anchor="middle"`, 10px mono.
- **Series path** is a polyline through `(bx(i), by(rank[i]))` — straight
  segments, NOT a spline. A curve would imply intermediate positions that do not
  exist between two elections.
- **Dot** at every vertex: r 3.4 at rest, 5 when the series is isolated.
- **Stroke** 1.6 at rest, 3 when isolated.
- **375px:** the chart keeps its `viewBox` and scales down; contest labels drop
  to the last two digits (`'04`, `'09`), and the legend below switches to
  `short` names. Below 340px the legend becomes two columns.

## 5. Motion spec

- **Entrance:** `reveal` on the card root.
- **Isolation:** on `mouseenter` / `focus` of a series or its legend row, the
  other series fade to 0.16 over 120ms ease-out; stroke width and dot radius of
  the active series step up with no transition (a width tween reads as a wobble).
- No ambient motion. The chart is static at rest.
- **Composed still:** nothing isolated — all six series at full opacity, all dots
  visible, legend showing each entity's first → last rank.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| gridlines | `--rule` @ 1.0 (1px) |
| contest labels | `--ink` @ 0.55 |
| rank gutter numerals | `--ink` @ 0.45 |
| series line + dots, rest | entity `color`, else the accent/ink cycle @ 1.0 |
| series, dimmed | same hue @ 0.16 |
| legend row, active | background `--paper-warm`, text `--ink` |
| legend row, rest | `--ink` @ 0.72 |
| legend delta `↑ 3 → 1` | `--ink` @ 0.72; the arrow glyph only, never a colour-coded up/down |

**Fallback colour cycle** when no `color` is authored:
`--accent`, `--ink`, then four steps interpolated between `--accent-deep` and
`--ink-soft`. Six is the practical ceiling for distinguishable lines.

## 7. Fallback design

Fully build-time — the no-JS reader loses nothing but the hover isolation.

1. The **complete chart**, all series drawn, all dots placed.
2. The **legend table**: entity, first rank, last rank, change. This is the
   AT-readable source; the SVG is `aria-hidden="true"`.

There is no state to paint a default for — the rest state IS the content.

## 8. Interaction spec

**No state control.** Hover/focus isolation only, and it is pure
progressive enhancement.

- **Targets:** each series path and each legend row (`<button>`, one tab stop
  each, array order). `touch-action: pan-y`.
- **Effect:** isolate that series; others to 0.16.
- **Readout:** the legend row's delta cell is already in the HTML; isolation adds
  no new text, so there is **no `aria-live` region** — nothing is announced that
  is not already readable.
- **Touch:** tap a legend row to isolate, tap again to clear.
- **Keyboard:** focus a legend row to isolate; `Esc` clears.

## 9. Comprehension text

- **`what`**: "Each line is one party and the only thing plotted is where it
  finished — first at the top, last at the bottom. Vertical distance is places,
  not votes, so a line can climb steeply on very few extra ballots."
- **`how`**: "Follow one line across the elections. Crossings are overtakes; a
  line that stays flat kept its position even if its vote share moved."
- **Caption guidance:** name the stability or the overtake — "first and second
  have swapped once in twenty-two years".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 180 (8 series × 8 dots + paths + axes) |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 0.6 KB minified, inline |
| Entities × contests | ≤ 8 × 8 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] A duplicated or missing rank in any contest fails the build, naming the contest
- [ ] `ranks` length ≠ `contests` length fails the build
- [ ] Rank 1 renders at the TOP (a naive y-scale inverts this)
- [ ] Series are polylines, not splines — no curve between adjacent contests
- [ ] The plain line states that vertical distance is places, not votes
- [ ] Isolating a series dims the others to 0.16 and thickens only the active one
- [ ] Legend delta reads `first → last` with an arrow glyph, not a colour
- [ ] 375px: contest labels shorten, legend uses `short` names, nothing clips
- [ ] No `aria-live` region exists (nothing is announced that is not already in the DOM)

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in
`2026-06-03-politics-showcase`.*
