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

# glacier-dumbbell — eight glaciers, 1990 against 2025

> Blueprint for `glacier-dumbbell`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/earth.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `glacier-dumbbell` |
| World | earth |
| Tier | HTML dumbbell rows + one sort island |
| Component path | `src/components/topic/earth/GlacierDumbbell.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-gdb` |
| Flagship reference | `benchmark-chart` (tech) for the HTML row pattern; `margin-ladder` (politics) for the ranked-rows reading |

## 2. What it shows / when to use

Two measurements per entity with the change between them drawn as a bar. Sorting by absolute and by relative loss ranks the entities differently, and that disagreement is the point.

- **USE WHEN:** 5–12 entities measured at exactly TWO times, where absolute and relative change rank them differently and that disagreement is the argument.
- **DON'T USE:** a continuous series per entity (→ `climate-strip`); one entity's before/after (→ `comparison`); a spatial distribution of change (→ `region-map`); more than two time points (→ `climate-strip` or `elo-river`, sports).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface GlacierDumbbellData {
  times: [string, string];   // [earlierLabel, laterLabel]
  unit: string;              // e.g. 'km²'
  rows: {
    name: string;
    earlier: number;
    later: number;
    note?: string;
  }[];
  sort?: 'relative' | 'absolute';   // default 'relative'
  caption?: string;
  source?: string;
}
```

```yaml
kind: glacier-dumbbell
data:
  times: ['1990', '2025']
  unit: km²
  sort: relative
  rows:
    - { name: Gangotri,       earlier: 143.6,  later: 121.4 }
    - { name: Siachen,        earlier: 1180.0, later: 1064.0, note: Has lost more area than every other glacier here put together, and the smallest share of itself. }
    - { name: Zemu,           earlier: 96.2,   later: 78.9 }
    - { name: Pindari,        earlier: 39.4,   later: 27.6,   note: Has lost roughly a third of itself. }
    - { name: Chhota Shigri,  earlier: 15.7,   later: 12.9 }
    - { name: Bara Shigri,    earlier: 131.0,  later: 105.8 }
    - { name: Milam,          earlier: 61.3,   later: 48.1 }
    - { name: Dokriani,       earlier: 7.9,    later: 5.4,    note: The smallest glacier here and the hardest hit in relative terms. }
  caption: Ranked by share, the small glaciers are worst hit; ranked by area, Siachen dominates.
  source: World Glacier Inventory, repeat surveys 1990 and 2025
```

**√-compression when the range is extreme.** If
`max(earlier) / min(earlier) > 20`, dot positions use
`√(value / maxValue) × trackWidth` and the component auto-renders the chip
`positions √-compressed`. Without it, one 1,180 km² glacier squashes a 7.9 km²
one onto the axis and the small entities become unreadable. The **percentage
figures are always computed from the raw values**, never from compressed
positions. `later > earlier` is legal (a growing entity) and renders the bar in
`--accent` with a `+` figure.

## 4. Geometry spec

Pure HTML/CSS.

- **Row grid:** `grid-template-columns: 152px 1fr 108px`, `gap: 14px`,
  `padding: 8px 0`, 1px `--rule` bottom border.
  At 375px: `grid-template-columns: 1fr 92px` with the track on a second line.
- **Track:** `position: relative; height: 16px`.
- **Positions** (with `s(v)` = the linear or √-compressed scale, mapped to
  0–88% of the track so the later dot and its label never touch the value cell):
  - **earlier dot:** `left: s(earlier)`, 11px, `border-radius: 50%`,
    2px `--accent-deep` border, `--paper` fill (hollow)
  - **later dot:** `left: s(later)`, 11px, solid `--accent-alt` fill
  - **connector bar:** `left: min(s(earlier), s(later)) + 2.2%`,
    `width: |s(earlier) − s(later)|`, `height: 3px`, `top: 7px`
- **Value cell:** right-aligned — `−{pct}%` in mono 700 `--accent-alt`, then
  `· {absolute} {unit}` in `--ink` @ 0.55.
- **Legend:** two items, hollow dot + `times[0]`, solid dot + `times[1]`.
- **Sort chips:** two, above the rows.
- **Row order** is the sort result, not the array order. The array order is only
  the tie-break.

## 5. Motion spec

- **Entrance:** `reveal` on the card root.
- **Sort switch:** rows reorder. Use `transform: translateY` on each row over
  220ms ease-out (a FLIP-style move) so the eye can follow an entity from one
  ranking to the other — this is the one place a reorder animation is doing real
  work, because the argument IS that the two orders disagree. Under
  `prefers-reduced-motion`, reorder instantly with no transform.
- **Composed still:** the authored `sort`, rows in that order, all dots and bars
  painted.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| earlier dot | border `--accent-deep` 2px, fill `--paper` |
| later dot | `--accent-alt` @ 1.0 |
| connector bar | `--accent-deep` @ 0.55 |
| connector bar, entity grew | `--accent` @ 0.55 |
| row border | `--rule` @ 1.0 |
| row name | `--ink` @ 0.82 |
| percentage figure | `--accent-alt` @ 1.0 (or `--accent` if positive) |
| absolute figure | `--ink` @ 0.55 |
| sort chip, active | background `--ink`, text `--paper` |
| legend text | `--ink` @ 0.65 |
| honesty chip | `--ink` @ 0.55, mono |

Hollow-then-solid is the encoding for then-and-now; it does not depend on colour,
so it survives a monochrome print. `--accent-alt` marks loss, `--accent` gain.

## 7. Fallback design

Build-time HTML in the authored sort:

1. All rows painted in that order, dots and bars positioned.
2. Legend and, where triggered, the compression chip.
3. A `<table>`: entity, earlier value, later value, absolute change, percentage
   change — **sorted both ways is unnecessary; the table carries both columns**,
   so a no-JS reader can do either ranking by eye. AT-readable source.

The sort chips ship `hidden`.

## 8. Interaction spec

**One control** — the sort toggle.

- **Chips:** `By share lost` / `By area lost`, `aria-pressed`, two tab stops.
- **Effect:** reorders the rows.
- **Announcement** (`aria-live="polite"`):
  `"Sorted by {share of each glacier lost | absolute area lost}. {topName} is now first."`
  Naming the new leader is the point of the announcement — that is the
  disagreement made audible.
- **Row notes:** each row is also a `<button>` surfacing its `note` in a readout
  line below the rows, where one exists.
- **Keyboard:** complete; `←`/`→` on the chips, `↑`/`↓` through the rows.

## 9. Comprehension text

- **`what`**: "Two dots per entity — the hollow one is its area at the earlier
  survey, the filled one at the later — and the bar between them is the loss. The
  percentage on the right is that same loss against the entity's own size."
- **`how`**: "Sort by share and by absolute loss. The two orders disagree, and
  which one you use decides which entity looks like it is in the most trouble."
- **Caption guidance:** name both rankings — "ranked by share, the small glaciers
  are worst hit; ranked by area, Siachen dominates".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 140 |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 1.1 KB minified, inline |
| Rows | 5–12 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] `max/min > 20` triggers √-compression AND the `positions √-compressed` chip
- [ ] Percentages are computed from raw values, never from compressed positions
- [ ] `later > earlier` renders `--accent` and a `+` figure
- [ ] Dots are capped at 88% of the track so the later label never collides with the value cell
- [ ] Sort reorders rows with a FLIP-style translate, and instantly under reduced motion
- [ ] The sort announcement names the new first row
- [ ] The fallback table carries BOTH absolute and percentage change
- [ ] Hollow/solid encoding survives greyscale (test with a filter)
- [ ] 375px: track on its own line, value cell intact
- [ ] No-JS: authored sort painted, chips hidden, table present

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-earth-showcase`.*
