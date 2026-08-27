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

# finish-interval — six teams with the same season left

> Blueprint for `finish-interval`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/sports.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `finish-interval` |
| World | sports |
| Tier | HTML interval rows + one team-select island |
| Component path | `src/components/topic/sports/FinishInterval.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-fiv` |
| Flagship reference | `league-table` for the standings vocabulary; `margin-bullets` (space) for the row + track geometry |

## 2. What it shows / when to use

A projected finishing position per team with the range the model actually gives. The reader learns which positions are decided and which are still open.

- **USE WHEN:** a projection with real UNCERTAINTY per entity (8–20 entities, a central estimate and an interval from a named simulation), where the overlap between intervals is the argument.
- **DON'T USE:** settled standings (→ `league-table`); a rating history (→ `elo-river`); a single win probability (→ `data-readout`); a completed bracket (→ `knockout-bracket`).
- **Pairs with:** `default` or `wide`. Not hero-capable.

## 3. Data schema

```ts
interface FinishIntervalData {
  model: string;        // MANDATORY — named in the source line
  runs?: number;        // simulation count
  positions: number;    // league size, sets the scale
  zones?: {
    fromPos: number;
    toPos: number;
    label: string;
    tone: 'good' | 'bad';
  }[];
  rows: {
    name: string;
    median: number;
    low: number;        // 5th percentile position (best)
    high: number;       // 95th percentile (worst)
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: finish-interval
data:
  model: 10,000 simulations of the remaining 9 matchdays
  runs: 10000
  positions: 18
  zones:
    - { fromPos: 1,  toPos: 4,  label: European place, tone: good }
    - { fromPos: 16, toPos: 18, label: Relegation,     tone: bad }
  rows:
    - { name: Rivermouth United, median: 1,  low: 1,  high: 2 }
    - { name: Harborough,        median: 2,  low: 1,  high: 4 }
    - { name: Kestrel Park,      median: 4,  low: 2,  high: 7 }
    - { name: Fenwick City,      median: 5,  low: 3,  high: 8 }
    - { name: Southgate Mills,   median: 5,  low: 3,  high: 9, note: Shares a median with Fenwick and a wider range. }
    - { name: Ashford Rangers,   median: 7,  low: 4,  high: 11 }
    - { name: Thornbury,         median: 8,  low: 5,  high: 12 }
    - { name: Oldcastle,         median: 9,  low: 6,  high: 13 }
    - { name: Marsh End,         median: 12, low: 9,  high: 16 }
    - { name: Coalbrook,         median: 17, low: 14, high: 18 }
  caption: Six teams have overlapping intervals between third and ninth.
  source: 10,000 simulations of the remaining 9 matchdays
```

**The interval IS the content.** A version of this chart without it is a
`league-table` and should be one — the component **FAILS the build** if any row
has `low === high`, and `model` is mandatory and printed in the source line.
`low <= median <= high` is validated per row. **The zone strips must be inset to
the bar TRACK**, not the full grid row: a strip spanning the label column
misstates where position 1 begins, which was the prototype's layout bug and is
what the acceptance checklist probes. **No honesty chip** — the position scale is
linear and complete.

## 4. Geometry spec

Pure HTML/CSS.

- **Row grid:** `grid-template-columns: 138px 1fr 74px`, `gap: 12px`,
  `padding: 7px 0`, 1px `--rule` bottom border.
- **Zone strips:** a single `position: absolute` layer behind the rows,
  **inset `left: 150px; right: 86px`** — the label column plus its gap, and the
  value column plus its gap. Inside that layer, each zone is positioned by the
  same `ipos()` used for the dots:
  `ipos(p) = (p − 1) / (positions − 1) × 100%`.
  A good zone runs `left: 0; width: ipos(toPos + 0.5)`; a bad zone runs
  `right: 0; width: 100% − ipos(fromPos − 0.5)`.
- **Track:** `position: relative; height: 16px` in the middle column.
  - **interval bar:** `left: ipos(low)`, `width: ipos(high) − ipos(low)`,
    `height: 4px`, `top: 6px`
  - **median dot:** `left: calc(ipos(median) − 6px)`, 12px circle, `top: 2px`
- **Value cell:** right-aligned, `{low}–{high}` in mono 700.
- **Scale row** below the rows, in the same grid so it aligns to the track: five
  labels (`1st`, `5th`, `9th`, `13th`, `18th`) in a `space-between` flex.
- **Readout panel:** team, the range with its median, and how many other intervals
  overlap it.
- **375px:** the label column drops to 104px and truncates; the track keeps its
  full width because the overlap comparison depends on it.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Intervals do not extend outward —
  animating an uncertainty range implies it is narrowing.
- **On selection:** the row's bar and dot take the accent, others return to rest;
  120ms ease-out.
- **Composed still:** a team from the contested middle selected (the argument),
  every bar and dot painted, zone strips visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| good zone strip | `--accent` mixed toward `--paper-deep` 78% |
| bad zone strip | `--accent-alt` mixed toward `--paper-deep` 78% |
| interval bar, rest | `--ink` @ 0.72, at 0.5 alpha |
| interval bar, selected | `--accent` @ 1.0, at 0.5 alpha |
| median dot, rest | `--ink` @ 0.72 |
| median dot, selected | `--accent` @ 1.0 |
| row border | `--rule` @ 1.0 |
| row background, selected | `--paper-deep` |
| team name, rest | `--ink` @ 0.85 |
| team name, selected | `--accent` @ 1.0 |
| value cell | matches its bar |
| scale labels | `--ink` @ 0.45 |

The zone strips are deliberately very low contrast — they are context, not data,
and a strong fill behind ten rows of intervals would dominate the marks that
matter.

## 7. Fallback design

Build-time HTML:

1. All **rows** with their intervals, medians and value cells; both zone strips
   correctly inset.
2. The **scale row**.
3. The **readout** for the default team.
4. A `<table>`: team, median, low, high, interval width, and a count of
   overlapping teams. AT-readable source — the overlap count is the argument, so it
   is a real column, not a derived aside.

## 8. Interaction spec

**One control** — team selection.

- **Targets:** each row is a `<button>`, `aria-pressed`, tab order in array
  order.
- **Readout template** (`aria-live="polite"`):
  `"{name} — most likely {median}, range {low} to {high}. {n} other teams have an overlapping range, which is another way of saying the position is not decided. {note}"`
- **Re-press** returns to default.
- **Keyboard:** complete; `↑`/`↓` step rows, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "The dot is the most likely finishing position and the bar is the
  range the model gives nine times out of ten. Overlapping bars mean the order
  between those teams is not yet decided by anything on the pitch."
- **`how`**: "Press a team to read its range and how many others overlap it. The
  shaded strips are the positions that carry a consequence."
- **Caption guidance:** count the undecided band — "six teams have overlapping
  intervals between third and ninth".
- **Source line must name the model** — "10,000 simulations of the remaining 9
  matchdays", never just "projection".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 160 |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Rows | 8–20 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] A row with `low === high` fails the build (that is a `league-table`)
- [ ] `low <= median <= high` validated per row, failing with the row name
- [ ] `model` is mandatory and appears in the source line
- [ ] **Zone strips are inset to the bar track** (`left: 150px; right: 86px`), not the full row — verify position 1 aligns with the track's left edge
- [ ] Zone strips use the same `ipos()` as the dots
- [ ] Zone strips are low-contrast and do not dominate the marks
- [ ] The overlap count in the readout matches the table's column
- [ ] Intervals do not animate on entrance
- [ ] 375px: label column truncates, track keeps full width
- [ ] No-JS: all rows + strips + scale + default readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-sports-showcase`.*
