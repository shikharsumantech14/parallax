# age-pyramid — who is actually in the room

> Blueprint for `age-pyramid`. Contract, not a suggestion — if implementation
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
| `kind` | `age-pyramid` |
| World | politics |
| Tier | HTML mirrored bars |
| Component path | `src/components/topic/politics/AgePyramid.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-pyr` |
| Flagship reference | `benchmark-chart` for the HTML bar rows; `comparison` for the two-sided reading |

## 2. What it shows / when to use

A body's composition by age band and a binary split, readable either as counts or as the balance inside each band. The reader learns whether an imbalance is a generational effect working through, or roughly constant.

- **USE WHEN:** a body's composition by age band and a binary split (4–8 bands), where either the concentration of bands or the constancy of the split is the argument.
- **DON'T USE:** party composition (→ `chamber` / `seat-chart`); one attribute compared across 2–3 entities (→ `comparison`); a single distribution with no split (→ a bar list in `data-readout`).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface AgePyramidData {
  bands: {
    label: string;   // e.g. '55–64', oldest FIRST in array order
    left: number;
    right: number;
  }[];
  sides: {
    left:  { label: string; color?: string };
    right: { label: string; color?: string };
  };
  mode?: 'count' | 'share';   // default 'count'
  caption?: string;
  source?: string;
}
```

```yaml
kind: age-pyramid
data:
  mode: count
  sides:
    left:  { label: Men }
    right: { label: Women }
  bands:
    - { label: '75+',   left: 8,   right: 2 }
    - { label: '65–74', left: 74,  right: 17 }
    - { label: '55–64', left: 141, right: 38 }
    - { label: '45–54', left: 121, right: 34 }
    - { label: '35–44', left: 62,  right: 21 }
    - { label: '25–34', left: 18,  right: 7 }
  caption: 334 of 543 members are between 45 and 64.
  source: Members' declared dates of birth, house register 2026
```

**`share` mode normalises each row to its OWN total** and auto-renders the
mono honesty chip `share of band`. The two modes answer different questions, so
the toggle labels must name them ("Counts" / "Share of band") rather than being
an unlabelled switch. In `count` mode all rows share one scale set by the
largest single side value across all bands.

## 4. Geometry spec

Pure HTML/CSS — no SVG.

- **Row grid:** `grid-template-columns: 1fr 62px 1fr`, `gap: 8px`,
  `padding: 4px 0`. The centre column holds the band label,
  `text-align: center`, 10px mono, `letter-spacing: .1em`.
- **Left half** is `display:flex; justify-content:flex-end` — value label then
  bar, so the bar's inner edge meets the centre column. **Right half** is the
  mirror: bar then value label.
- **Bar height** 20px. **Bar width:**
  - `count` mode: `value / maxSideValue × 100%` where `maxSideValue` is the
    largest `left` or `right` across every band.
  - `share` mode: `value / (left + right) × 100%` for that row only.
- **Value labels** 11.5px mono 600 at `--ink` @ 0.7 — the count in `count`
  mode, the percentage in `share` mode.
- **Legend** below the rows: two swatch+label pairs (14×9 blocks) with each
  side's total, in a `gap: 18px` flex.
- **Mode chips** above the rows: `gap: 8px` flex, `padding: 6px 13px`,
  1px border, square corners.
- **375px:** the three-column grid holds — it is already narrow — but value
  labels move inside the bar (right-aligned, `--paper` text) when the bar is
  ≥ 34px wide, and are dropped entirely below that, remaining in the readout.
- **Oldest band at the top** is the convention and the array order; do not sort.

## 5. Motion spec

- **Entrance:** `reveal` on the card root.
- **Mode switch:** bar widths transition `width` 150ms ease-out. This is the one
  place a width tween is correct — the same data is being re-expressed, and the
  motion shows the rows re-normalising.
- **Composed still:** `mode`'s authored default (usually `count`), all bars at
  rest, both totals in the legend.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| left bar | `sides.left.color` if given, else `--ink` @ 1.0 |
| right bar | `sides.right.color` if given, else `--accent` @ 1.0 |
| band label | `--ink` @ 0.65 |
| value labels | `--ink` @ 0.70 |
| mode chip, active | background `--ink`, text `--paper` |
| mode chip, rest | 1px `--rule` border, text `--ink` @ 0.70 |
| legend text | `--ink` @ 0.65 |
| honesty chip (`share` mode) | `--ink` @ 0.55, mono |

**Ink-vs-accent, not two hues.** The default sides are `--ink` and `--accent`
so the chart works in every world without a second colour. `sides[].color` is
available but is NOT a data-encoding exemption — a demographic split has no
canonical colours, and using two arbitrary hues invites a reading that is not in
the data.

## 7. Fallback design

Build-time HTML in the authored `mode`:

1. All rows painted with correct widths for that mode.
2. The legend with both totals.
3. A `<table>` giving every band's left and right values **as counts**,
   regardless of mode — so the absolute numbers are never only reachable by
   toggling. AT-readable source.

The mode chips ship `hidden` and are unhidden by the island.

## 8. Interaction spec

**One control** — the mode toggle.

- **Targets:** two chips, `role="group"`, each `aria-pressed`, two tab stops.
- **Effect:** re-normalises every bar, swaps the value labels between counts and
  percentages, and swaps the unit eyebrow.
- **Announcement** (`aria-live="polite"`): `"Showing {counts | share of each band}."`
  The per-row values are in the DOM table, so the live region announces only the
  mode change.
- **Keyboard:** two tab stops; `←`/`→` move between the chips.

## 9. Comprehension text

- **`what`**: "One row per age band, oldest at the top, with bars running
  outward from the centre line — one sex to each side. Read it as counts to see
  the size of each band, or as shares to compare the balance inside bands of
  very different sizes."
- **`how`**: "Switch between counts and shares. Counts show where the members
  actually are; shares show whether the imbalance is a generational effect
  working through, or roughly constant."
- **Caption guidance:** the concentration or the constancy — "334 of 543 members
  are between 45 and 64".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 110 |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 0.7 KB minified, inline |
| Bands | 4–8 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] `count` mode: all rows share one scale (the widest band's side sets 100%)
- [ ] `share` mode: each row's two bars total 100% of the row width
- [ ] `share` mode renders the `share of band` honesty chip
- [ ] Mode chips are labelled "Counts" / "Share of band", never an unlabelled switch
- [ ] Oldest band renders at the top, in array order, unsorted
- [ ] The `<table>` gives absolute counts in BOTH modes
- [ ] Mode switch transitions `width` only (no colour or opacity tween)
- [ ] 375px: value labels move inside or drop; no overflow
- [ ] No-JS: authored mode painted, chips hidden, table present

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in
`2026-06-03-politics-showcase`.*
