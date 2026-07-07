# Blueprint — `gerrymander-lens` (politics · SVG · FLAGSHIP of the same-data-many-maps family)

> The proof that district lines, not votes, decide who wins. **One** vote grid —
> the exact same voters, the exact same party split — is redrawn under three
> district plans side by side, and each plan's efficiency gap is stated as a
> signed number against the fairness flag. "Nothing changed but the lines, and
> everything changed." The reference implementation for any future
> hold-the-data-fixed / vary-the-structure comparison.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `gerrymander-lens` |
| World | politics |
| Tier | SVG (100% build-time layout + geometry; the reveal is the only JS, via the shared `core/Reveal.astro` island — no per-component script) |
| Component | `src/components/topic/politics/GerrymanderLens.astro` |
| Scene module | n/a (no WebGL) |
| Shared math | none — the efficiency-gap arithmetic is four expressions (§4) computed once in the Astro frontmatter. `physics/apportionment.md` §4 is the 1:1 reference; the §11 anchors force the implementation to agree with the sheet. |
| CSS prefix | `px-glens` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`, and the blueprint prefix tables in `src/components/AGENTS.md` §4) |
| Flagship reference | `power-flow` (build-time SVG layout + `html.js`-gated reveal + build-time invariant assert), `coalition-calculus` §6 (party-color exemption), `worlds/politics.md` (`.pol-annot` / `.pol-ledger` motifs) |

## 2. What it shows / when to use

Three maps of one electorate, drawn from a single shared vote grid, so the
reader sees the same ballots produce different seat outcomes purely because the
lines moved — with each plan's efficiency gap named as the measure of the skew.

- **USE WHEN:** the dossier can give (or the researcher can build) ONE precinct/
  cell grid of two-party vote counts covering the whole electorate, plus ≥2
  district plans (usually 3: a fair/neutral plan and one or two gerrymanders)
  that each partition **exactly that same cell set** into equal-population
  districts. The story is "the map is the manipulation."
- **DON'T USE:** a single map's shaded values per region (→ `region-map`, earth);
  one chamber's party composition (→ `chamber`); a coalition's arithmetic
  (→ `coalition-calculus`); a straight two-column contrast of two systems
  (→ `comparison`). If you have only district-level totals and no shared
  underlying grid, you cannot honestly show "same votes" — do not fake it with
  `region-map` panels.
- **Pairs with:** `layout: wide` (the three maps need horizontal room); hero-capable
  for redistricting issues. **Never `layout: split`** — this is a static
  comparison read across, not a scroll-driven scene, and split's sticky stage
  would strand the three-up row. **Never `bleed`** (the labels need the gutter).

## 3. Data schema

```ts
interface GerrymanderLensData {
  grid: {                      // the ONE shared electorate — every plan re-districts THIS
    cols: number;              // grid width in cells (e.g. 5)
    rows: number;              // grid height in cells (e.g. 5)
    // Party-A vote count per cell, row-major (length === rows*cols).
    // Party B in a cell = cellTotal − a. cellTotal is uniform (see `perCell`).
    a: number[];
    perCell: number;           // total voters per cell (uniform — equal population). e.g. 20
  };
  parties: {                   // exactly two — this is a two-party fairness measure
    a: { name: string; short?: string; color?: string };  // color: data-encoding exemption (chamber §6 rule)
    b: { name: string; short?: string; color?: string };
  };
  plans: Array<{               // 2–3 district plans over the SAME grid
    label: string;             // "Neutral" | "Pro-Union crack" | "Pro-Front pack"
    // district id per cell, row-major (length === rows*cols). Ids 0..D−1.
    // Every district must own the SAME number of cells (equal population) and
    // BE CONTIGUOUS — both asserted at build (§4).
    districts: number[];
    note?: string;             // ≤ 12 words, the plan's one-line characterization (annotation voice)
  }>;
  flagPct?: number;            // |EG| flag threshold in %, default 7 (Stephanopoulos & McGhee)
  caption?: string;
  source?: string;
}
```

```yaml
# example payload — a 5×5, 500-voter electorate, Party A 272 (54.4%) / Party B 228.
# Three plans re-district the identical grid; efficiency gaps diverge sharply.
grid:
  cols: 5
  rows: 5
  perCell: 20
  # 25 cells row-major (top→bottom, left→right); value = Party-A voters in that cell.
  a: [18,17,10,6,4,  17,16,10,6,4,  16,15,11,7,5,  15,14,12,8,6,  14,13,12,9,7]
parties:
  a: { name: "Union", short: "UNI", color: "#b8341f" }   # the finding-color / accent by default
  b: { name: "Front", short: "FRO", color: "#1e5a3f" }   # accent-alt (opposition green)
plans:
  - label: "Neutral"
    note: "Compact columns — seats track the vote share."
    # 5 vertical column districts (id = column index)
    districts: [0,1,2,3,4, 0,1,2,3,4, 0,1,2,3,4, 0,1,2,3,4, 0,1,2,3,4]
  - label: "Pro-Union crack"
    note: "Row strips spread Union voters to win every seat."
    # 5 horizontal row districts (id = row index)
    districts: [0,0,0,0,0, 1,1,1,1,1, 2,2,2,2,2, 3,3,3,3,3, 4,4,4,4,4]
  - label: "Pro-Front pack"
    note: "Union voters packed into two landslide seats."
    districts: [0,0,1,1,1, 0,0,1,3,3, 0,2,1,3,3, 2,2,2,4,3, 2,4,4,4,4]
flagPct: 7
caption: "Same 272–228 electorate, three maps: a fair plan, a Union gerrymander, a Front gerrymander — the lines decide, not the votes."
source: "Illustrative grid; efficiency-gap method: Stephanopoulos & McGhee (2015)"
```

**Data flags with visual consequences:** none that compress or distort — the grid
is shown at true 1:1 (every cell equal area). The `flagPct` threshold is stated
in the caption row as the mono chip `EG flag ±{flagPct}%` so the fairness bar is
never an unstated convention (CANON §7). If a plan's districts are not
equal-size or a district is non-contiguous, the build **fails** (§4) — that is a
data error, not a render mode.

## 4. Geometry spec (build-time, in the component frontmatter)

**The efficiency-gap arithmetic (mirrors `physics/apportionment.md` §4 exactly):**

For each district `d` with Party-A votes `aᵈ`, Party-B votes `bᵈ`, total
`tᵈ = aᵈ + bᵈ`, winner threshold `wᵈ = ⌊tᵈ/2⌋ + 1`:
- winner's wasted = `winnerVotes − wᵈ`; loser's wasted = `loserVotes` (all of them).
- `wastedA = Σ (a's wasted across all districts)`, `wastedB = Σ (b's wasted)`.
- `EG = (wastedA − wastedB) / totalVotes` — **signed**: negative favors A,
  positive favors B (A is the numerator's first term).
- `|EG|·100 > flagPct` → the plan is flagged (the commonly cited threshold is
  7%, attributed to Stephanopoulos & McGhee — the caption states the convention).

A tie district (`aᵈ === bᵈ`) cannot occur when `perCell` is even and district
size is odd; if the data produces one, assign the win to A and record wasted with
`wᵈ` as above (documented so the two never disagree). Prefer odd cells-per-district.

**District tallies from the shared grid:** `aᵈ = Σ grid.a[i]` over cells `i`
where `plan.districts[i] === d`; `tᵈ = (cell count of d) · grid.perCell`;
`bᵈ = tᵈ − aᵈ`. `totalVotes = rows·cols·perCell` (same for every plan — that
identity IS the point).

**Build-time invariant asserts (all `throw` with a message naming the offender —
per `physics/apportionment.md` §4 "build asserts the cell sets are identical"):**
1. `grid.a.length === rows·cols` and every `plan.districts.length === rows·cols`.
2. **Identical cell set:** every plan indexes the same `rows·cols` cells (the
   arrays are positional over one grid — assert each plan's index domain is
   `0..rows·cols−1` fully covered, and that the Party-A totals summed over ALL
   cells are byte-identical across plans: `Σ grid.a` is plan-independent by
   construction, so assert `Σ_d aᵈ === Σ grid.a` for every plan). If a plan's
   district tallies don't re-sum to the shared statewide A total, **fail** naming
   the plan — this is the "same votes" guarantee made mechanical.
3. **Equal population:** within each plan, every district owns the same cell
   count (`rows·cols / D` integer); else fail naming the plan + district.
4. **Contiguity:** each district's cells form one 4-connected region (flood-fill
   from any member cell reaches all members); else fail naming the plan +
   district. (Contiguity is the difference between a real map and a scatter.)

**Coordinate system / viewBox:**
- `viewBox="0 0 W H"`, `W = 720`. Three map panels in a row.
- Panel geometry: `PANEL = 200` px square map area; `PANEL_GAP = 24`;
  `PAD_X = 12` (fixed left inset). Panels at x = `12`, `236`, `460`
  (`x_i = PAD_X + i·(PANEL + PANEL_GAP)`). The three-panel band spans
  `12 → 660`, leaving a `60`px right margin — deliberately asymmetric so the
  rightmost panel's EG readout figures and `FLAGGED` chip clear the viewBox
  edge without a gutter of their own, the same outward-label trick `power-flow`
  uses. *(Corrected 2026-07-06: the prior `PAD_X = (720 − 3·PANEL − 2·PANEL_GAP)
  / 2` evaluates to `36`, which contradicts the stated panel x-positions
  12/236/460; PAD_X is a fixed `12` inset, not the symmetric centring formula —
  the power-flow formula-vs-prose bug class.)*
- Each panel: a `cols × rows` cell matrix. `CELL = PANEL / max(cols, rows)`
  (square cells; for the 5×5 example `CELL = 40`). Cell `(r,c)` at panel-local
  `(c·CELL, HEADER + r·CELL)`.
- `HEADER = 34` (plan label band above each map); `FOOTER = 56` (the EG readout
  bar below each map). `H = HEADER + PANEL + FOOTER + 8 = 34 + 200 + 56 + 8 = 298`.

**Cell rendering:**
- Fill = the cell's **majority party color** at opacity scaled by margin:
  `op = 0.28 + 0.42 · |a − b| / perCell` (a 60/40 cell ≈ 0.36; a 90/10 cell
  ≈ 0.62; a pure cell 0.70). This is the choropleth of the *cell*, not the
  district — it shows where each party's voters actually live, held constant
  across all three maps (the reader can verify by eye the fills never change).
- The cell fill NEVER changes between panels — only the district boundaries do.
  This is enforced structurally: cell fills derive from `grid.a`, boundaries
  from `plan.districts`.

**District boundaries (the only thing that differs between panels):**
- Draw a `2px` `--ink` @ 0.85 stroke on every cell edge that separates two
  DIFFERENT districts (interior seams between same-district cells get a hairline
  `--ink` @ 0.12 so the grid is legible but the district reads as one shape).
- The panel's outer frame is `1.5px` `--ink` @ 0.42.
- A district's winning-party is marked by a small **6px** filled square in the
  district's centroid cell, in the winner's color at full opacity, with a
  `--paper` @ 0.9 halo ring — the "who won this seat" pip. (No text inside
  the map: the text budget lives in the readout bar.)

**The plan-label band (`HEADER`, above each map):** the `plan.label` in
`.vz-legend` (mono uppercase 10px, `--ink` @ 0.9), left-aligned to the panel.

**The EG readout bar (`FOOTER`, below each map) — the quantified verdict:**
- Seat split: `{aShort} {seatsA} · {seatsB} {bShort}` in `.vz-value` (mono
  tabular, 13px), the winner's number in the winner's color.
- The efficiency-gap number: `EG {sign}{|EG|·100 rounded to 0.1}%` in
  `.vz-value` 15px, colored `--accent-deep` if `|EG|·100 > flagPct` (flagged),
  else `--ink` @ 0.7 (within tolerance). A flagged plan additionally shows the
  mono chip `FLAGGED` (`--accent-deep`, `.vz-eyebrow`) to its right.
- Direction gloss: `favours {name}` in `.vz-annot` (Fraunces italic 13px), or
  `balanced` when `|EG|·100 ≤ flagPct`.

**375px:** the three-up row does not fit side by side. Below 640px the panels
**stack vertically** (one map per row, full-column width, `CELL` recomputed to
`min(PANEL, containerWidth − 2·PAD)`), each with its own header + readout bar.
The efficiency-gap comparison then reads top-to-bottom instead of left-to-right;
the shared-grid identity is preserved (identical cell fills down the stack). No
horizontal scroll. Labels never drop below 9.5px (mono floor).

## 5. Motion spec (names from motion.md)

- Entrance (once, on scroll-in; `html.js`-gated hidden states per §9 contract).
  Timings are chosen so the **whole sequence lands within the 1.6s stagger
  budget** (motion.md hard rule 3); the three panels animate *concurrently*
  (a 60ms left→right stagger, not a per-panel serial chain), and the later
  stages overlap the sweep rather than queue behind it:
  1. `t=0–500ms` — panel frames + cell fills `reveal` (opacity 0→1 + 14px rise,
     500ms `--ease`; panels stagger left→right 60ms → last panel settles 620ms).
  2. `t=200–1100ms` — district boundary strokes `sweep` (stroke-dashoffset
     len→0, **900ms** `--ease`, all three panels drawing at once with the same
     60ms stagger, so the reader watches the lines drawn onto the same
     electorate — the boundary draw IS the metaphor). Last panel finishes ~1160ms.
  3. `t=900–1200ms` — winner pips `settle` in (scale 0→1, 300ms), landing as
     each panel's boundaries complete (overlaps the tail of the sweep, does not
     queue after it).
  4. `t=400–1300ms` — EG numbers `countup` (900ms, tabular, tween to the value
     in the HTML), run concurrently with the sweep.
  5. `t≈1360–1580ms` — **the flagged plan's `FLAGGED` chip fires `stamp` LAST**
     (220ms `--ease-snap`) — the politics verdict signature: the map is stamped
     as rigged. Sequence ends **≤1.6s**.
  *(Corrected 2026-07-06: the prior timings — 1200ms sweep starting at 250ms,
  pips settling only *after* boundaries finish, then a stamp after that — ran
  the sequence to ~2.0s while still asserting "≤1.6s". Sweep shortened to 900ms,
  panels animate concurrently, and the later stages overlap so the assertion
  now holds.)*
- No ambient motion. Records don't fidget (`worlds/politics.md`). There is no
  `flowDash` here — nothing flows; this is a static forensic comparison.
- **Composed still (reduced-motion / print / no-JS):** all three panels fully
  drawn — cell fills, district boundaries, winner pips, seat splits, EG numbers,
  flag chips (pre-stamped). This IS the print plate; the reveal only choreographs
  its assembly. Reduced-motion renders every entrance in final state; `countup`
  shows the final number (already in the HTML); `stamp` renders pre-stamped.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| Party-A cells | party A `color` (default `--accent`), `op = 0.28 + 0.42·margin/perCell` |
| Party-B cells | party B `color` (default `--accent-alt`), same margin ramp |
| district boundaries | `--ink` @ 0.85, 2px |
| interior grid seams (same district) | `--ink` @ 0.12, 1px |
| panel outer frame | `--ink` @ 0.42, 1.5px |
| winner pip | winner party color @ 1.0 + `--paper` @ 0.9 halo ring |
| plan label | `--ink` @ 0.9 (`.vz-legend`) |
| seat split figures | winner's color for its number, `--ink` @ 0.7 for the loser's |
| EG number (flagged) | `--accent-deep` |
| EG number (within tolerance) | `--ink` @ 0.7 |
| `FLAGGED` chip | `--accent-deep` (`.vz-eyebrow`) |
| direction gloss | `--ink-soft` (`.vz-annot`) |

Two data-encoding colors beyond the accent are permitted (CANON §4: "at most two
… must come from the section's `data`") — here Party A = `--accent`, Party B =
`--accent-alt` by default, both overridable via `parties.*.color` (identical
exemption to `chamber` §6 / `coalition-calculus` §6). No third color, no
per-district hues — every district in a plan is the same two-party palette;
thickness of boundary + the pip carry "who won."

## 7. Fallback design (first-class)

The SVG is 100% build-time; no-JS = the final painted plate (all three maps,
boundaries, pips, EG numbers, flag chips — per §5's composed still). Nothing
requires JS to paint; the `core/Reveal.astro` island only animates the assembly.

Below the maps, the **verdict ledger** (`.pol-ledger` rows — the AT-readable
data source, and the CANON §4.5 answer to text budget): one row per plan —
`{plan.label} · {seatsA}–{seatsB} · EG {sign}{pct}% · {balanced | favours {name}}`
with the plan's `note` as its `.pol-annot` sub-line. Mono figures right-aligned
with dot leaders. This ledger lives in `<details>` — **open** in markup so no-JS
readers get it permanently, and the reveal island removes `open` on boot once the
in-SVG numbers are visible (legend-collapse rule, CANON §4.5). The shared
electorate's headline (`{aName} {A} — {B} {bName}, {totalVotes} voters`) is a
single always-visible line above the `<details>` so the "same votes" fact is
never hidden behind a disclosure.

Nothing is dropped: every plan's seat split, EG, and characterization is in the
no-JS page.

## 8. Interaction spec

- **None interactive in v1** (no hover targets — the SVG stays a pure forensic
  plate, like `power-flow`). The three-up comparison is the whole argument; there
  is no "reveal more" state to add without inventing a gesture (CANON §9 forbids).
- The `⤢` expand modal (automatic via the shared `.px-viz` card) is the study
  view — it enlarges the same static plate; `viz-type.css` bumps the label scale
  so it reads deliberate, not zoomed.
- `note` strings render as the ledger's `.pol-annot` sub-lines, not tooltips.
- Keyboard/AT: nothing focusable beyond the `<details>` disclosure and the expand
  button; the verdict ledger carries the full data.
- `touch-action` untouched (no drag surface); vertical scroll never captured.

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts` at implementation): "The same
  voters, three ways of drawing the districts; each map shows who wins and how
  skewed it is — the number is the efficiency gap, and the fills never change."
- **how** (ExpandModal): "Compare the three maps: the coloured cells are the
  same electorate in all three, only the black district lines move. The lower a
  plan's efficiency-gap number sits from zero, the more the map favours one
  side."
- Caption guidance: state the comparison's finding ("the lines decide, not the
  votes" / "one plan is fair, two are gerrymanders"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 62 words — 3 plan labels (~6) + 3 seat
  splits (~9) + 3 EG lines with gloss (~18) + 1 flag chip word + shared-electorate
  headline (~9) + caption (~18). Under the 80-word ceiling. Plan `note` lines and
  the full ledger sit below the fold in `<details>` and don't count at rest. Hard
  cap: **3 plans, ≤ 49 cells per grid** (7×7) — beyond that the maps shrink below
  the 375px legibility floor; a bigger electorate wants a real `region-map`.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 700 (3 panels × [≤49 cell rects + boundary strokes + pip] + readout bars) |
| `data` payload | ≤ 4 KB (three int arrays of ≤49 + one A array) |
| JS | none beyond the shared `core/Reveal.astro` island |
| Extra assets | none (no topojson, no geo fetch) |
| DOM nodes total | ≤ 800 including the ledger `<details>` |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test (prints as a legible
      3-map comparison) · 375px = stacked, no horizontal overflow, labels ≥ 9.5px,
      expand target ≥ 44px · reduced-motion = composed still, no dead space,
      no reveal · token grep (only the two declared party-color exemptions pass) ·
      caption + source + plain all render · no-JS = final plate (view-source) ·
      payload validates by inspection, degrades on missing `note`/`short`/`color`/
      `flagPct` (defaults: name, name, accent/accent-alt, 7) · prefix `px-glens`
      unique
- [ ] **Shared-grid guarantee:** all three plans re-sum to the SAME statewide
      Party-A total (example: 272) and the SAME total voters (500); the cell
      fills are pixel-identical across the three panels (only boundaries differ)
- [ ] **EG recompute (the worked anchor — a reviewer can check by hand):** on the
      example grid (Σa = 272, 500 voters, perCell 20, districts of 5 cells →
      threshold ⌊100/2⌋+1 = 51):
  - **Neutral (columns):** district A-tallies 80,75,55,36,26 → A wins 3, B wins 2;
    wastedA = (80−51)+(75−51)+(55−51)+36+26 = 29+24+4+36+26 = 119;
    wastedB = 20+25+45+(64−51)+(74−51) = 20+25+45+13+23 = 126;
    EG = (119−126)/500 = **−1.4%** → within ±7% → **balanced**, `--ink` @ 0.7, no chip
  - **Pro-Union crack (rows):** A-tallies 55,53,54,55,55 → A wins all 5;
    wastedA = (55−51)+(53−51)+(54−51)+(55−51)+(55−51) = 4+2+3+4+4 = 17;
    wastedB = 45+47+46+45+45 = 228; EG = (17−228)/500 = **−42.2%** → flagged,
    favours Union, `stamp` fires
  - **Pro-Front pack:** A-tallies 84,41,70,28,49 → A wins 2 (84,70), B wins 3;
    wastedA = (84−51)+(70−51)+41+28+49 = 33+19+41+28+49 = 170;
    wastedB = 16+30+(59−51)+(72−51)+(51−49→ B wins 51 vs 49: 51−51=0) = 16+30+8+21+0 = 75;
    EG = (170−75)/500 = **+19.0%** → flagged, favours Front, `stamp` fires
- [ ] Build **fails** (naming the plan) if a plan's district A-tallies do not
      re-sum to the shared statewide total (the "same votes" assert)
- [ ] Build **fails** (naming plan + district) on unequal district sizes or a
      non-contiguous district (flood-fill test)
- [ ] Caption row renders the mono chip `EG flag ±7%` from `flagPct`
- [ ] Winner pip sits in each district and is the winning party's color; cell
      fills encode cell margin, not district margin, and are identical across panels
- [ ] Flagged plans show `--accent-deep` EG numbers + `FLAGGED` chip + `stamp`;
      the balanced plan shows neither
- [ ] Verdict ledger `<details>`: open with all 3 plan rows + `note` sub-lines
      under no-JS; folds on boot; shared-electorate headline always visible above it

---

*Registry duties when implementing (P6 — deliberately NOT done at blueprint time):
add `gerrymander-lens` to `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry
(`src/lib/explainers.ts`, §9 wording), add the catalog block (`docs/design/
catalog.md` — `npm run check:catalog` must pass), document the `px-glens` prefix
in `src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-politics-showcase`.*
