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

# heat-uptake — where the extra heat actually went

> Blueprint for `heat-uptake`. Contract, not a suggestion — if implementation
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
| `kind` | `heat-uptake` |
| World | earth |
| Tier | SVG stacked area + one mode island |
| Component path | `src/components/topic/earth/HeatUptake.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-hup` |
| Flagship reference | `carbon-loop` for the reservoir vocabulary and its conservation check; `climate-strip` for the long-series axis |

## 2. What it shows / when to use

Components of a growing total, stacked so the top edge is the whole. Read as shares instead, the bands go flat — the split holds while the total triples.

- **USE WHEN:** 3–6 components of a growing total over a long series, where the story is that the SPLIT stays constant while the total grows (or conspicuously does not).
- **DON'T USE:** a single total over time (→ `climate-strip`); a stock-and-flow budget with conservation between nodes (→ `carbon-loop`); part-of-whole at one instant (→ `revenue-mosaic`, tech, or `data-readout`); components that are not exhaustive (a stacked area of a non-total lies).
- **Pairs with:** `wide`, hero-capable.

## 3. Data schema

```ts
interface HeatUptakeData {
  from: number;            // first period, e.g. 1970
  to: number;              // last period
  components: {
    id: string;
    label: string;
    share: number;         // 0–1; Σ must be 1.0 ±0.001
    color?: string;
    note?: string;
  }[];
  total: { period: number; value: number }[];  // the envelope
  unit: string;            // e.g. 'ZJ'
  mode?: 'absolute' | 'share';                 // default 'absolute'
  caption?: string;
  source?: string;
}
```

```yaml
kind: heat-uptake
data:
  from: 1970
  to: 2025
  unit: ZJ
  mode: absolute
  components:
    - { id: upper, label: 'Ocean, 0–700 m',      share: 0.556, note: The top seven hundred metres take more than half of everything. }
    - { id: deep,  label: 'Ocean, below 700 m',  share: 0.331, note: Warming slowly and irreversibly on any human timescale. }
    - { id: land,  label: Land and groundwater,  share: 0.058, note: Small in energy terms, and where almost all of the visible damage happens. }
    - { id: ice,   label: Ice and atmosphere,    share: 0.055, note: Melting ice absorbs energy without changing temperature, which is why this band stays thin. }
  total:
    - { period: 1970, value: 26 }
    - { period: 1985, value: 78 }
    - { period: 1995, value: 141 }
    - { period: 2005, value: 223 }
    - { period: 2015, value: 300 }
    - { period: 2025, value: 382 }
  caption: 382 zettajoules since 1970, 89% of it in the ocean.
  source: Ocean heat content reanalysis and cryosphere mass budget, 1970–2025
```

**Shares must sum to 1.0 ±0.001** or the build **FAILS**, listing the
components and the actual sum — a stacked area whose parts do not make the whole
is the classic dishonest chart. `share` mode is not decoration: it is the
argument-carrying view, and **the plain line changes with the mode** (the
component supplies both strings). No scale compression, so **no honesty chip**;
if a future payload needs a log envelope, that is a blueprint revision, not a
runtime flag.

## 4. Geometry spec

`viewBox="0 0 780 300"`, `width:100%; height:auto` (the 1080px breakout).

- **Plot box** x 52 → 770, y 24 → 262.
- **x** `hx(period) = 52 + (period − from) / (to − from) × 718`. The envelope is
  interpolated linearly between `total` points, sampled at every integer period
  so the bands are smooth without a spline.
- **y**
  - `absolute`: `hy(v) = 262 − v / maxTotal × 210`
  - `share`: `hy(f) = 262 − f × 210` where `f` is a cumulative fraction
- **Band path** for component `i`: the top edge is the cumulative share through
  `i`, the bottom edge the cumulative share through `i − 1`, each multiplied by
  the period's total in `absolute` mode. Closed path, top edge forward then
  bottom edge reversed. **1px `--paper` stroke** between bands so they separate
  without a rule.
- **Gridlines:** 5 horizontal, labelled at `x = 46`, `text-anchor="end"`,
  `y + 3.5`. The topmost carries the unit (`400 ZJ`); in `share` mode they read
  `0% … 100%`.
- **Period labels** at `y = 280`, `text-anchor="middle"`, at 6 chosen periods.
- **Band share labels** at `x = 762`, `text-anchor="end"`, one per band at its
  mid-height. **Thin-band rule:** a band under 10% of the plot height moves its
  label off its mid-height — the first thin band goes to `x 690, y mid − 3`, the
  second stays at `x 762, y mid + 11`. Two thin bands at the same x collide
  otherwise; this was a real defect in the prototype.
- **375px:** the SVG scales; band labels drop out entirely and the legend table
  below carries the shares.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. The area does not wipe in from the
  left — that reads as time playing forward and invites a "watch it grow" reading
  the chart is arguing against.
- **Mode switch:** band paths morph via `d` interpolation over 220ms ease-out if
  the implementation can do it cheaply; otherwise cross-fade the two path sets over
  150ms. Either is acceptable — do NOT tween via `transform: scaleY`, which
  distorts the stroke.
- **On band selection:** other bands to 0.13 over 120ms.
- **Composed still:** `mode`'s authored default, nothing selected, all band share
  labels visible, the total readout showing the whole.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| band 1 (largest) | `--accent-deep` @ 1.0 |
| band 2 | `--accent` @ 1.0 |
| band 3 | `--accent-alt` @ 1.0 |
| band 4 (thinnest) | `--ink` @ 0.34 |
| band separator stroke | `--paper` @ 1.0, 1px |
| band, dimmed | own colour @ 0.13 |
| gridlines | `--rule` @ 1.0 |
| tick + period labels | `--ink` @ 0.50 |
| band share label, on a dark band | `--paper` @ 1.0 |
| band share label, on the thin ink band | `--ink` @ 0.75 |
| legend row, selected | background `--paper-warm` |
| total readout | `--accent-deep` @ 1.0, mono 700 |

A four-step ramp inside the world's own accent family plus one ink step — not
four hues. The ordering is deliberate: the biggest band is the deepest value, so
the stack darkens downward and the thin bands stay legible at the top.

## 7. Fallback design

Build-time SVG in the authored mode:

1. The **whole stacked area**, all bands, gridlines, period labels, share labels.
2. The **reservoir legend** with each component's share and, in `absolute` mode,
   its value at the final period.
3. A `<table>`: component, share, final value. Plus the total series as a second
   table (period, total). AT-readable source; SVG `aria-hidden="true"`.

The mode chips ship `hidden`. Because `share` mode carries half the argument,
the fallback's legend prints **both** the share and the absolute value, so a
no-JS reader gets both readings.

## 8. Interaction spec

**One control** — the absolute/share toggle. Band selection is a secondary
hover/focus affordance with no state of its own.

- **Mode chips:** two, `aria-pressed`, two tab stops. Switching swaps the y-axis
  labels, the unit eyebrow, the plain line, and the readout.
- **Band targets:** each band path and each legend row is a `<button>`; selecting
  dims the others and surfaces that component's note.
- **Announcements** (`aria-live="polite"`):
  - mode: `"Showing {zettajoules | share of total}."`
  - band: `"{label} — {share}% of the total{valueText}. {note}"` where
    `valueText` = `", {v} {unit} since {from}"` in absolute mode.
- **Keyboard:** complete; `←`/`→` on the chips, `↑`/`↓` through the legend.

## 9. Comprehension text

- **`what`**: "The bands stack, so the top edge of the whole shape is all the
  energy the planet has taken up and each band is one place it went. Read it as
  zettajoules to see the total grow, or as shares to see the split hold almost
  perfectly steady while the total triples."
- **`how`**: "Switch between absolute and share. If the bands go flat in share
  mode, nothing is being redistributed — it is all simply getting larger."
- **Caption guidance:** the total and where it went — "382 zettajoules since
  1970, 89% of it in the ocean".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 60 (6 band paths at ~56 sampled points each is one `d` string, not nodes) |
| `data` payload | ≤ 4 KB |
| Island JS | ≤ 1.3 KB minified, inline |
| Components | 3–6 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Shares not summing to 1.0 ±0.001 fail the build, printing the actual sum
- [ ] `share` mode renders a flat-topped stack filling the full plot height
- [ ] The plain line differs between the two modes
- [ ] Band separator strokes are `--paper`, so bands read as separate without a rule
- [ ] Two thin bands (<10% height) do not overlap their labels — check the offset rule
- [ ] Mode switch does not use `transform: scaleY`
- [ ] Fallback legend prints BOTH share and absolute value
- [ ] Bands are a single-accent ramp plus one ink step, not four hues
- [ ] 375px: band labels drop, legend carries the shares
- [ ] No-JS: full area + legend + both tables

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-earth-showcase`.*
