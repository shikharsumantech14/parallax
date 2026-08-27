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

# rain-calendar — a year of rain, in 365 squares

> Blueprint for `rain-calendar`. Contract, not a suggestion — if implementation
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
| `kind` | `rain-calendar` |
| World | earth |
| Tier | HTML day grid + one hover/focus island |
| Component path | `src/components/topic/earth/RainCalendar.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-rcl` |
| Flagship reference | `climate-calendar` (travel) for the month vocabulary; `commit-grid` (tech) for the day-cell grid and its banded fills |

## 2. What it shows / when to use

A full year of daily values, one cell per day. The reader learns that an annual total says nothing about how the year was actually delivered.

- **USE WHEN:** a full year of DAILY values where the concentration of extremes is the argument — a total that a monthly average would hide.
- **DON'T USE:** monthly values for a when-to-go decision (→ `climate-calendar`, travel); multi-decade annual records (→ `climate-strip` / `climate-spiral`); a single month's detail (→ `data-readout`); many series' cycles (→ `river-multiples`).
- **Pairs with:** `wide`. Not hero-capable — the cells fall below the countability floor at hero scale on mobile.

## 3. Data schema

```ts
interface RainCalendarData {
  year: number;
  unit: string;                  // e.g. 'mm'
  days: { month: number; day: number; value: number }[];   // month 0-indexed
  bands: { max: number; label: string }[];                 // ascending; first is the zero/dry band
  monthTotals?: boolean;         // default true
  caption?: string;
  source?: string;
}
```

```yaml
kind: rain-calendar
data:
  year: 2025
  unit: mm
  monthTotals: true
  bands:
    - { max: 0,   label: dry }
    - { max: 6,   label: under 6 mm }
    - { max: 22,  label: 6 – 22 }
    - { max: 55,  label: 22 – 55 }
    - { max: 9999, label: over 55 mm }
  days:
    - { month: 6, day: 27, value: 96.4 }
    - { month: 6, day: 28, value: 12.1 }
    # … one entry per wet day; omitted days are treated as 0
  caption: 1,140 mm over 118 wet days — and 4 days deliver 38% of it.
  source: Station daily rainfall record, 2025
```

**Banded fills with a legend, never a continuous ramp** — the same rule as
`porkchop-grid`, for the same reason. **The concentration statistic in the plain
line is COMPUTED, not authored**: the component derives "what share of the total
falls on what share of days" from `days` and renders it, so the claim can never
drift from the payload. Omitted days are zero. A `day` outside its month's real
length **FAILS the build naming the date** (and February is validated against the
`year`'s leap status).

## 4. Geometry spec

Pure HTML/CSS grid.

- **Row grid:** `grid-template-columns: 34px 1fr 62px`, `gap: 10px`,
  `align-items: center`, one row per month, `gap: 2px` between rows.
- **Month label:** 9px mono uppercase, `--ink` @ 0.55.
- **Day grid:** `grid-template-columns: repeat(31, 1fr)`, `gap: 2px`. Cell
  height 14px desktop, 8px at 375px — **8px is the floor**; below that the grid
  stops being countable and the kind should not be used.
- **Short months pad with transparent cells** so all twelve rows align on the same
  31-column grid. Padding cells are not focusable and carry no band.
- **Month total cell:** right-aligned, 11px mono 600; `--accent-deep` when the
  month exceeds 200 units, else `--ink` @ 0.6. (The threshold is
  `0.15 × annualTotal` computed at build, not a magic number.)
- **Selected cell** takes a 2px `--ink` `outline` (outside the box, so the grid
  does not reflow).
- **Legend:** one swatch (16×10) + label per band, wrapping flex, `gap: 14px`.
- **Readout panel:** date, value, and a contextual line keyed to the band.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Cells do not stagger — 365 staggered
  cells is unusable.
- **On hover/focus:** outline appears instantly, no transition.
- **Composed still:** the wettest day of the year selected, its outline drawn,
  readout showing it.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| band 1 (dry) | `--paper-warm` @ 1.0 |
| band 2 | `--accent` @ 0.28 |
| band 3 | `--accent` @ 0.55 |
| band 4 | `--accent-deep` @ 1.0 |
| band 5 (heaviest) | `--accent-deep` mixed toward `--ink` 40% |
| padding cell | `transparent` |
| selected outline | `--ink` @ 1.0, 2px |
| month label | `--ink` @ 0.55 |
| month total, heavy month | `--accent-deep` @ 1.0 |
| month total, normal | `--ink` @ 0.60 |
| legend text | `--ink` @ 0.65 |
| readout value | `--accent-deep` @ 1.0, mono 700 |

**Declared fixed encoding:** a monotonic five-step ramp inside the world's accent,
dry → heaviest. The dry band is `--paper-warm` rather than white so a dry day
still reads as a cell you could count, not as a gap in the grid.

## 7. Fallback design

Build-time HTML:

1. The **whole grid**, every cell banded, month labels and totals, the legend.
2. The **readout** for the wettest day.
3. A `<table>` of **month totals** plus the derived concentration statistics
   (annual total, wet days, days above the top band, share of the total they
   carry). As with `porkchop-grid`, 365 cells of AT output would bury the
   argument, so the grid is `role="img"` with an `aria-label` naming the shape,
   and the table is the AT-readable source.

The argument survives entirely without JS — it is visible in the pattern of dark
rows.

## 8. Interaction spec

**One control** — day selection by hover or focus.

- **Targets:** every non-padding cell is focusable via roving `tabindex` inside a
  `role="grid"`; one tab stop for the whole calendar. Arrow keys move by day and
  by month. `touch-action: pan-y`; tap selects.
- **Readout template** (`aria-live="polite"`):
  `"{day} {monthName} — {value} {unit}{bandText}"` where `bandText` is one of:
  - dry: `". A dry day."`
  - top band: `". One of the {n} days that carry the year."`
  - otherwise: `". An ordinary wet day."`
- **Keyboard:** complete. `Home`/`End` jump to the driest and wettest days of the
  year.

## 9. Comprehension text

- **`what`**: "One row per month, one square per day, darkest for the wettest.
  An annual rainfall total tells you nothing about this shape: the same total
  could be a wet drizzle across every row or, as here, a few very dark cells."
- **`how`**: "Move across the grid for any single day's rainfall. The plain line
  counts how few days carry how much of the year."
- **Caption guidance:** the total, the wet-day count, and the concentration — "1,140 mm
  over 118 wet days, and 4 days deliver 38% of it".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 420 (372 cells + rows + legend) |
| `data` payload | ≤ 8 KB (wet days only; dry days omitted) |
| Island JS | ≤ 1.3 KB minified, inline |
| Grid | exactly 12 × 31 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Fills are banded with a legend; no interpolated cell colours
- [ ] Short months pad with transparent, non-focusable cells; all 12 rows align
- [ ] A day outside its month's length fails the build, naming the date (February checked against leap year)
- [ ] Omitted days render as the dry band
- [ ] **The concentration statistic in the plain line is computed from `days`**
- [ ] Month-total highlight threshold is derived (`0.15 × annual`), not hard-coded
- [ ] Selection uses `outline`; the grid does not reflow
- [ ] Cells are ≥ 8px at 375px
- [ ] Grid is `role="img"` with a shape-describing label; the table is the AT source
- [ ] `Home`/`End` reach the driest and wettest days

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-earth-showcase`.*
