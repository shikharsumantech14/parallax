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

# river-multiples — twelve rivers, the same twelve months

> Blueprint for `river-multiples`. Contract, not a suggestion — if implementation
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
| `kind` | `river-multiples` |
| World | earth |
| Tier | SVG small multiples + one panel-select island |
| Component path | `src/components/topic/earth/RiverMultiples.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-rmu` |
| Flagship reference | `climate-strip` for the cycle vocabulary; `city-grid` (travel) for the per-panel-normalised grid + its honesty chip |

## 2. What it shows / when to use

Many series over the same cycle, each panel scaled to its own peak, so the comparison is timing and shape rather than volume. The reader learns which series behave differently from the crowd.

- **USE WHEN:** 6–16 series over the same cycle (usually 12 months) where the comparison is TIMING or SHAPE, and the series' magnitudes differ enough that one shared scale would flatten most of them.
- **DON'T USE:** one series' long record (→ `climate-strip` / `climate-spiral`); values that share a scale and should be compared by size (→ `comparison` or a bar list); a single destination's year (→ `season-wheel`, travel); daily granularity (→ `rain-calendar`).
- **Pairs with:** `wide`. Not hero-capable — a 12-panel grid at hero scale reads as wallpaper.

## 3. Data schema

```ts
interface RiverMultiplesData {
  cycle?: string[];        // default the 12 month abbreviations
  panels: {
    name: string;
    values: number[];      // same length as `cycle`
    peakValue?: number;    // the REAL peak in `unit` — see §3 flags
    unit?: string;
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: river-multiples
data:
  panels:
    - { name: Brahmaputra,   peakValue: 19800, unit: m³/s, values: [0.06,0.07,0.11,0.22,0.44,0.78,1,0.92,0.61,0.29,0.13,0.08], note: Snowmelt and monsoon arrive together, which is why the peak is both early and enormous. }
    - { name: Ganges,        peakValue: 16600, unit: m³/s, values: [0.05,0.05,0.08,0.15,0.32,0.68,0.94,1,0.72,0.34,0.14,0.07], note: A single monsoon peak. Eighty per cent of the year's water passes in four months. }
    - { name: Kaveri,        peakValue: 2800,  unit: m³/s, values: [0.09,0.07,0.07,0.12,0.24,0.38,0.46,0.58,0.74,1,0.62,0.24], note: The one south-west river with an October peak — it takes the retreating monsoon. }
    - { name: Periyar,       peakValue: 1900,  unit: m³/s, values: [0.11,0.09,0.10,0.22,0.52,1,0.86,0.72,0.64,0.78,0.42,0.18], note: The only river with two crests, in June and again in October. }
  caption: Nine of the twelve peak in July or August.
  source: National gauging stations, mean monthly discharge 1991–2020
```

**Per-panel normalisation is the central honesty risk**, so it is always
declared: the component auto-renders the chip
`each panel scaled to its own peak`, and **every panel prints its real peak value
as a mono caption** (`peak Jul · 19,800 m³/s`) so magnitude stays recoverable
from the face of the chart. `values` may be authored as 0–1 indices (as above) or
as raw values — if raw, the component normalises and still prints the real peak.
All `values` arrays must match `cycle.length`; a mismatch **FAILS the build
naming the panel**.

## 4. Geometry spec

A CSS grid of small SVGs.

- **Grid:** `grid-template-columns: repeat(4, 1fr)`, `gap: 12px` at the 1080px
  breakout; `repeat(3, 1fr)` at 720px; `repeat(2, 1fr)` at 375px.
- **Panel cell:** `padding: 8px 9px 7px`, 1px `--rule` border. The panel name is
  a 11.5px `--font-body` line with `text-overflow: ellipsis` (names are never
  wrapped — a two-line name breaks the grid rhythm).
- **Panel SVG:** `viewBox="0 0 140 54"`, `width:100%; height:auto`.
  - **x** `px(i) = i / (n − 1) × 138`
  - **y** `py(v) = 50 − v × 44` where `v` is the 0–1 normalised value
  - **baseline** at y 50, x 0 → 140, 1px
  - **line** polyline through the points, 1.8px; **area** the same path closed
    `L 138 50 L 0 50 Z`
  - **peak dot** r 2.6 at the maximum point
- **Peak caption** below the SVG: 8.5px mono uppercase,
  `peak {cycleLabel}` (plus `· {peakValue} {unit}` where it fits; at 375px the
  value moves to the readout only).
- **Readout panel** below the grid: panel name, peak label, real peak value, note.
- **Sparkline legibility floor:** a panel narrower than 96px drops its peak dot
  and its in-cell peak caption. Below 2-up, use a different kind.

## 5. Motion spec

- **Entrance:** `reveal` on the card root — the whole grid at once, not
  staggered per panel. Twelve staggered panels is a light show.
- **On selection:** the selected panel's border goes to `--ink`, its background
  to `--paper-warm`, and its line to `--accent-deep`; 120ms ease-out.
- **Composed still:** the first panel selected, all panels painted with their
  peak dots and captions.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| panel line, rest | `--accent` @ 1.0 |
| panel line, selected | `--accent-deep` @ 1.0 |
| panel area fill | same hue @ 0.22 |
| panel baseline | `--rule` @ 1.0 |
| panel border, rest | `--rule` @ 1.0 |
| panel border, selected | `--ink` @ 1.0 |
| panel background, selected | `--paper-warm` |
| panel name, rest | `--ink` @ 0.78 |
| panel name, selected | `--ink` @ 1.0 |
| peak caption | `--ink` @ 0.55 |
| honesty chip | `--ink` @ 0.55, mono |

One accent for every panel. Colouring panels individually would imply a category
that is not in the data — the panels are peers, and the only distinction is which
one is selected.

## 7. Fallback design

Build-time SVG grid:

1. **All panels** painted with lines, areas, peak dots and peak captions.
2. The **readout** for the first panel.
3. A `<table>`: panel, peak position in the cycle, real peak value, unit. This is
   the AT-readable source; the panel SVGs are `aria-hidden="true"` (twelve
   sparklines are not describable individually).

The argument — which panels peak off-cycle — is visible without JS from the peak
captions alone.

## 8. Interaction spec

**One control** — panel selection.

- **Targets:** each panel cell is a `<button>`, tab order in array order.
  `touch-action: pan-y`.
- **Readout template** (`aria-live="polite"`):
  `"{name} — peaks in {cycleLabel} at {peakValue} {unit}. {note}"`
- **Re-press** returns to the first panel.
- **Keyboard:** complete; arrow keys move within the grid (left/right within a
  row, up/down between rows), `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "One small panel per series, each showing a full year and each
  scaled to its own peak — so heights compare shapes and not volumes, and a small
  river can fill its box just as a large one does. What you are comparing is when
  the water arrives."
- **`how`**: "Scan the panels for the odd shape out, then press it for its real
  numbers. Panels are self-scaled, so never read one panel's height against
  another's."
- **Caption guidance:** the crowd behaviour and the exceptions — "nine of the
  twelve peak in July or August".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 16 panels × 5 = 80 |
| `data` payload | ≤ 6 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Panels | 6–16 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] The `each panel scaled to its own peak` chip always renders
- [ ] Every panel prints its REAL peak value (in-cell or in the readout at 375px)
- [ ] A `values` array not matching `cycle.length` fails the build, naming the panel
- [ ] All panels share one accent; no per-panel colour
- [ ] Panel names ellipsis rather than wrap
- [ ] Panels below 96px drop the peak dot and in-cell caption
- [ ] Grid is 4-up / 3-up / 2-up at breakout / column / 375px
- [ ] Arrow keys traverse the grid in two dimensions
- [ ] No-JS: all panels + first-panel readout + peak table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-earth-showcase`.*
