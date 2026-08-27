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

# fare-spread — the month is not the price, the month is the spread

> Blueprint for `fare-spread`. Contract, not a suggestion — if implementation
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
| `kind` | `fare-spread` |
| World | travel |
| Tier | SVG range bars + one month-select island |
| Component path | `src/components/topic/travel/FareSpread.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-fsp` |
| Flagship reference | `fare-terrain` for the fare vocabulary; `pace-ridge` (sports) for the distribution discipline |

## 2. What it shows / when to use

A price distribution per month — full range, middle half, median. The reader learns that the month sets the odds rather than the price.

- **USE WHEN:** a price or duration DISTRIBUTION per month (or per category) where the spread, not the central value, is the argument — the dossier has min/q1/median/q3/max per period.
- **DON'T USE:** fare against days-before-departure, the when-to-book story (→ `fare-terrain`); a trip's cost split by category (→ `data-readout`); every individual observation (→ `price-swarm`); a smooth distribution from a large sample (→ `pace-ridge`, sports).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface FareSpreadData {
  metric: string;       // e.g. 'return fare'
  unit: string;         // '₹ thousand', '$'
  periods: {
    label: string;      // 'Jan' … or any ordered category
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: fare-spread
data:
  metric: return fare
  unit: ₹ thousand
  periods:
    - { label: Jan, min: 14.2, q1: 17.1, median: 19.4, q3: 22.0, max: 28.6 }
    - { label: Feb, min: 13.8, q1: 16.4, median: 18.2, q3: 20.9, max: 26.4 }
    - { label: Mar, min: 16.1, q1: 19.8, median: 22.6, q3: 26.2, max: 34.1 }
    - { label: Apr, min: 19.4, q1: 24.6, median: 28.8, q3: 34.2, max: 47.5 }
    - { label: May, min: 17.2, q1: 20.1, median: 22.4, q3: 25.6, max: 33.0 }
    - { label: Jun, min: 12.6, q1: 14.4, median: 15.8, q3: 17.6, max: 21.8 }
    - { label: Jul, min: 11.9, q1: 13.6, median: 14.9, q3: 16.4, max: 19.9 }
    - { label: Aug, min: 12.4, q1: 14.1, median: 15.4, q3: 17.0, max: 20.6 }
    - { label: Sep, min: 15.6, q1: 19.2, median: 22.1, q3: 26.4, max: 36.2 }
    - { label: Oct, min: 21.2, q1: 28.4, median: 33.6, q3: 41.2, max: 58.4 }
    - { label: Nov, min: 18.1, q1: 22.6, median: 26.0, q3: 30.8, max: 42.6 }
    - { label: Dec, min: 16.8, q1: 21.2, median: 24.4, q3: 29.6, max: 41.0 }
  caption: October's median is more than double July's — and October's cheapest quote undercuts the dearest September one.
  source: Fare scrape, Delhi–Kathmandu return, 14,200 quotes over 12 months
```

**Ordering is validated:** `min ≤ q1 ≤ median ≤ q3 ≤ max` for every period,
or the build **FAILS naming the period**. **Any prose claim that one period's floor
undercuts another's ceiling must be verified against the payload** — check the
actual overlapping period rather than the adjacent one; the prototype's first
draft named July when the true overlap was September, and the acceptance checklist
tests it. No compression, **no honesty chip**; but the caption must never quote a
median as "the price".

## 4. Geometry spec

`viewBox="0 0 440 250"`, `width:440px; height:250px`.

- **Plot floor** y 216, x 42 → 430.
- **y** `fy(v) = 216 − (v − domainMin) / domainSpan × 198`, where the domain is
  the data range padded 4% and rounded outward to a nice step.
- **Bar pitch** `52 + i · 31.5` for 12 periods; box width 20px, centre `x + 10`.
- **Whisker:** a 1.2px vertical line from `fy(max)` to `fy(min)` at the centre.
- **Box:** a rect from `fy(q3)` to `fy(q1)` (height `fy(q1) − fy(q3)`), 20px wide.
- **Median notch:** a 2px horizontal line across the full box width at
  `fy(median)`, in the surface colour so it reads as a gap in the box rather than
  an added mark.
- **Gridlines:** 5 horizontal at nice steps, labelled at `x = 36`,
  `text-anchor="end"`, `y + 3.5`; each label carries the unit prefix
  (`₹10k`), because a bare numeral in a currency chart is ambiguous.
- **Period label** at the centre, `y = 234`, 9px mono.
- **Readout** to the right (200px): period name, median, middle half as a range,
  full range, and the dearest-to-cheapest ratio.
- **375px:** the SVG scales; period labels drop to their first letter for 12
  periods (with the full name in the readout), and the box narrows to 12px.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Boxes do not grow.
- **On selection:** the selected bar's box and whisker take the accent, others
  return to the muted fill; 120ms ease-out.
- **Composed still:** the widest-spread period selected (the argument), all boxes
  and whiskers painted, gridlines and labels visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| box, rest | `--accent` mixed toward `--ink` 30% @ 0.72 |
| box, selected | `--accent` @ 1.0 |
| whisker, rest | `--ink` @ 0.45 |
| whisker, selected | `--accent` @ 1.0 |
| median notch | `--paper` @ 1.0 (2px) |
| gridlines | `--rule` @ 1.0 |
| tick labels | `--ink` @ 0.50 |
| period label, rest | `--ink` @ 0.50 |
| period label, selected | `--ink` @ 1.0 |
| readout median | `--accent-deep` @ 1.0, mono 700 |
| readout ratio, > 2.4× | `--accent-deep` @ 1.0 |

The median notch is the page surface, not a third colour — it reads as a cut
through the box, which is the conventional and least noisy way to mark it.

## 7. Fallback design

Build-time SVG:

1. The **whole chart** — every box, whisker, notch, gridline and label.
2. The **readout** for the default period.
3. A `<table>`: period, min, q1, median, q3, max, and the ratio. AT-readable
   source; SVG `aria-hidden="true"`.

The overlap argument is checkable directly from the table, which is why min and
max are both columns.

## 8. Interaction spec

**One control** — period selection.

- **Targets:** the whisker, the box and the table row for each period share a
  handler; the SVG hit target is a transparent 28px-wide rect over the whole
  column so a 20px box is not a precision task. Tab order left to right.
  `touch-action: pan-y`.
- **Readout template** (`aria-live="polite"`):
  `"{period} — median {median} {unit}, middle half {q1} to {q3}, full range {min} to {max}. Dearest is {ratio}× the cheapest."`
- **Keyboard:** complete; `←`/`→` step periods, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "One bar per month. The thin line is the full range of fares
  recorded that month, the solid bar is the middle half of them, and the notch is
  the median. A short bar means the month has one price; a long bar means booking
  date decides which end you get."
- **`how`**: "Press a month for its quartiles and its cheapest-to-dearest ratio.
  Compare a wide month's floor against a cheap month's ceiling — they often
  overlap."
- **Caption guidance:** the ratio and the overlap — "October's median is more than
  double July's, and October's cheapest quote undercuts the dearest September
  one".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 90 (12 periods × 4 + axes) |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Periods | 4–12 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] `min ≤ q1 ≤ median ≤ q3 ≤ max` violated fails the build, naming the period
- [ ] **Any overlap claim in the caption is verified against the payload** (name the period that actually overlaps)
- [ ] The median notch is the surface colour, drawn across the full box width
- [ ] Tick labels carry the unit prefix, not bare numerals
- [ ] Hit target is ≥ 28px wide per column
- [ ] Readout gives the dearest/cheapest ratio
- [ ] Default selection is the widest-spread period
- [ ] 375px: period labels shorten, boxes narrow, nothing collides
- [ ] The caption does not describe a median as "the price"
- [ ] No-JS: full chart + default readout + quartile table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-travel-showcase`.*
