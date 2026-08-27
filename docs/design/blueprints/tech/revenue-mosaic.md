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

# revenue-mosaic — four segments, three plans, one rectangle

> Blueprint for `revenue-mosaic`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/tech.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `revenue-mosaic` |
| World | tech |
| Tier | HTML marimekko + one column-select island |
| Component path | `src/components/topic/tech/RevenueMosaic.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-mos` |
| Flagship reference | `chip-die` for the area-proportional tile treatment; `comparison` for the read-across discipline |

## 2. What it shows / when to use

A total split two ways at once, where column width times block height is real quantity. The reader learns that a tall block in a narrow column is a big slice of a small pie.

- **USE WHEN:** a total split two ways at once (3–5 primary × 2–4 secondary), where AREA is the quantity and the secondary mix inverts across the primary segments.
- **DON'T USE:** a single part-of-whole split (→ `data-readout` tiles); components of a growing total over time (→ `heat-uptake`, earth); two or three entities compared attribute by attribute (→ `comparison`); a value field over space (→ `court-value`, sports).
- **Pairs with:** `wide`. Not hero-capable — the height/area distinction needs its "how to read" block adjacent.

## 3. Data schema

```ts
interface RevenueMosaicData {
  total?: number;      // derived from segments if absent
  unit: string;        // e.g. '$M'
  segments: {
    id: string;
    label: string;
    value: number;     // sets column WIDTH
    accounts?: number; // surfaced in the readout
    parts: { label: string; share: number }[];   // Σ = 1.0 ±0.001, sets block HEIGHTS
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: revenue-mosaic
data:
  unit: $M
  segments:
    - id: ent
      label: Enterprise
      value: 41.2
      accounts: 84
      parts: [{ label: Platform, share: 0.62 }, { label: Team, share: 0.28 }, { label: Starter, share: 0.10 }]
      note: 84 accounts, half the revenue, and 62% of them on the top plan.
    - id: mid
      label: Mid-market
      value: 22.6
      accounts: 610
      parts: [{ label: Platform, share: 0.31 }, { label: Team, share: 0.52 }, { label: Starter, share: 0.17 }]
    - id: smb
      label: Small business
      value: 12.1
      accounts: 4820
      parts: [{ label: Platform, share: 0.08 }, { label: Team, share: 0.44 }, { label: Starter, share: 0.48 }]
    - id: self
      label: Self-serve
      value: 6.4
      accounts: 31400
      parts: [{ label: Platform, share: 0.02 }, { label: Team, share: 0.19 }, { label: Starter, share: 0.79 }]
      note: 31,400 accounts producing eight per cent of revenue.
  caption: Enterprise is 84 accounts and half the money; self-serve is 31,400 accounts and eight per cent of it.
  source: Billing ledger, financial year 2026
```

**Height-versus-area is this kind's central risk.** Three requirements
follow from it: the plain line states it explicitly; **every block at ≥16% of its
column's height prints its own absolute value** so the reader never has to
multiply width by height; and the part labels are identical across columns so the
inversion is readable as a pattern. Each segment's `parts` shares must sum to
1.0 ±0.001 or the build **FAILS naming the segment**. No compression, **no honesty
chip** — widths and heights are both true proportions.

## 4. Geometry spec

Pure HTML/CSS flex — no SVG.

- **Container:** `display: flex; height: 260px; gap: 3px`.
- **Column width** `value / Σvalues × 100%`. Columns are flex items with an
  explicit `width`, not `flex: 1`.
- **Column inner:** `display: flex; flex-direction: column; gap: 3px`. Each block
  has `height: share × 100%`.
- **Block content:** bottom-aligned (`justify-content: flex-end`), `padding: 6px 7px`,
  `overflow: hidden`. Two lines — the part label (9px mono uppercase) and the
  absolute value (11px mono 700). Both drop below 16% block height; below 14%
  column width, in-block labels drop entirely and live only in the readout.
- **Column footer** below the 260px box: the segment label (9.5px mono uppercase,
  `text-overflow: ellipsis`) then its total (11px mono 700). Because the footer
  sits inside the flex column, reserve `margin-top: 34px` on the readout panel
  below so the footers never collide with it.
- **Readout panel:** segment, revenue and share of total, accounts, note.
- **375px:** the mosaic transposes — columns become full-width rows, heights become
  widths. Below 640px a 4-column marimekko has columns under 60px, and the
  transposed form keeps areas honest while staying legible.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Blocks do not grow.
- **On selection:** unselected columns' blocks drop to 0.28 over 120ms ease-out.
- **Composed still:** the largest segment selected, all blocks painted, all
  qualifying value labels visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| part 1 (top plan) | `--accent` @ 1.0 |
| part 2 | `--accent-deep` @ 1.0 |
| part 3 | `--ink` @ 0.62 |
| part 4 (if present) | `--ink` @ 0.34 |
| block, in an unselected column | own colour @ 0.28 |
| block label on parts 1–2 | `--paper-deep` @ 1.0 |
| block label on parts 3–4 | `--paper` @ 0.92 |
| column gap | `--paper-deep` (the 3px gap shows the surface) |
| segment footer label, rest | `--ink` @ 0.80 |
| segment footer label, selected | `--accent` @ 1.0 |
| readout revenue | `--accent` @ 1.0, mono 700 |

**Parts get the ramp, segments get nothing.** The secondary split is the same
categories in every column, so it is the thing that needs consistent colour;
columns are distinguished by width, which is already their encoding.

## 7. Fallback design

Build-time HTML:

1. The **whole mosaic** — every column at its width, every block at its height,
   all qualifying labels, all footers.
2. The **readout** for the default segment.
3. A `<table>`: segment, revenue, share of total, accounts, and one column per
   part giving that part's share **and** its absolute value. AT-readable source —
   and the absolute values are what make the area encoding checkable.

## 8. Interaction spec

**One control** — column selection.

- **Targets:** each column is a `<button>`, tab order in array order.
- **Readout template** (`aria-live="polite"`):
  `"{label} — {value} {unit}, {pct}% of revenue, {accounts} accounts. {note}"`
  and where `accounts` is present but no `note`, append the derived
  `"Revenue per account: {perAccount}."`
- **Re-press** returns to the default.
- **Keyboard:** complete; `←`/`→` step columns, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "The whole rectangle is the total. Column width is what a segment
  contributes and the blocks stacked inside it are how that segment splits, so
  block area is real money and block height is a share within its column only —
  a tall block in a narrow column is a big slice of a small pie."
- **`how`**: "Press a column for its totals. Compare areas, not heights: the same
  block height in two columns of different widths is two very different numbers."
- **Caption guidance:** the inversion, stated with both ends — "enterprise is 84
  accounts and half the money; self-serve is 31,400 accounts and eight per cent
  of it".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 120 |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 1 KB minified, inline |
| Segments × parts | ≤ 5 × 4 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Any segment's `parts` shares not summing to 1.0 ±0.001 fails the build, naming it
- [ ] Column widths are proportional to `value` (measure two against their ratio)
- [ ] Every block ≥16% height prints its own absolute value
- [ ] Part labels are identical across columns, so the inversion reads as a pattern
- [ ] Blocks below 16% height, and all blocks in columns under 14% width, drop labels to the readout
- [ ] The plain line states that height is a within-column share and area is the quantity
- [ ] Column footers do not collide with the readout panel (the 34px reserve)
- [ ] 375px: the mosaic transposes to full-width rows
- [ ] Fallback table gives each part's share AND absolute value
- [ ] No-JS: full mosaic + default readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-tech-showcase`.*
