# porkchop-grid — every day you could leave, and what it would cost

> Blueprint for `porkchop-grid`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/space.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `porkchop-grid` |
| World | space |
| Tier | HTML/CSS matrix (grid cells, no SVG) + one hover/focus island |
| Component path | `src/components/topic/space/PorkchopGrid.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-pkc` |
| Flagship reference | `transfer-window` for the Δv vocabulary and the idealisation chips; `region-map` for the banded-fill + legend pattern |

## 2. What it shows / when to use

Every pairing of departure and arrival date, coloured by what that trip would cost in velocity change. The reader learns that a launch window is a small island in a large field of impossible missions.

- **USE WHEN:** a launch-opportunity story where cost is a function of BOTH departure and arrival date — the dossier has (or the model derives) a Δv per pairing over a grid, and the shape of the feasible island is the argument.
- **DON'T USE:** one specific transfer's geometry and window timing (→ `transfer-window`); a pure Δv budget with no date dimension (→ `delta-v-ladder`); the interplanetary geometry itself (→ `solar-system`); a value surface over physical space (→ `court-value`, sports, or `region-map`, earth).
- **Pairs with:** `wide`, hero-capable. Never `split` — the matrix needs the breakout measure to keep cells ≥ 20px.

## 3. Data schema

```ts
interface PorkchopGridData {
  departures: string[];   // column labels, left → right, EQUAL steps
  arrivals: string[];     // row labels, TOP → bottom (latest arrival first)
  cells: number[][];      // [arrivalIndex][departureIndex], Δv in `unit`
  unit: string;           // e.g. 'km/s'
  bands: { max: number; label: string }[];  // ascending; last is the infeasible band
  vehicleLimit?: number;  // Δv above this is 'not flyable'
  flightDays?: number[][];// optional, same shape — enables flight time in the readout
  caption?: string;
  source?: string;
}
```

```yaml
kind: porkchop-grid
data:
  unit: km/s
  vehicleLimit: 6.0
  departures: ['Oct 2', 'Oct 15', 'Oct 28', 'Nov 10', 'Nov 23']   # labels every 3rd column; step stated in the axis title
  arrivals:   ['Sep 20', 'Aug 27', 'Aug 3', 'Jul 10', 'Jun 16']
  bands:
    - { max: 3.8,  label: under 3.8 }
    - { max: 4.3,  label: 3.8 – 4.3 }
    - { max: 5.0,  label: 4.3 – 5.0 }
    - { max: 6.0,  label: 5.0 – 6.0 }
    - { max: 99,   label: over 6.0 · not flyable }
  caption: The cheapest departure costs 3.58 km/s; the dearest more than twice that.
  source: Parallax trajectory model · patched-conic, no gravity assist
```

Three declared honesty requirements:

1. **Banded fills, never a continuous ramp.** A reader cannot decode a smooth
   gradient into a number; the bands ARE the legend. The component renders the
   legend from `bands` and refuses to build without it.
2. **The axis step must be stated.** `departures`/`arrivals` are usually
   sampled labels over a denser grid; the axis title must read
   `"Departure date, {year} · {n}-day steps"`. The prototype's first draft
   mislabelled a 4-day step as a 16-day one — the acceptance checklist tests this.
3. **`vehicleLimit`** renders its band in `--ink` @ 0.18 with an explicit
   "not flyable" legend entry, and auto-renders the chip
   `idealised · patched-conic` alongside `transfer-window`'s wording, since the
   same simplification applies.

## 4. Geometry spec

HTML `display: grid` — no SVG. `cells` is row-major by arrival.

- **Layout:** a 2-column flex — the arrival gutter (`text-align: right`, 9px
  mono labels distributed with `justify-content: space-between`) and the matrix.
- **Matrix:** `grid-template-columns: repeat({departures.length × step}, 1fr)`
  with `gap: 1px`. Cell height 26px desktop, 14px at 375px. Cells are plain
  `<span>`s with a background from the band lookup.
- **Band lookup:** the first `bands[i].max` that `v <= max`; the last band is
  the catch-all. Never interpolate between bands.
- **Selected cell** takes a 2px `--ink` outline drawn *outside* the cell
  (`outline`, not `border`) so the grid does not reflow on selection.
- **Departure axis** below the matrix: labels in a `space-between` flex, then
  the axis title centred, 9px mono uppercase.
- **Legend** below that: one swatch (16×10) + label per band, wrapping flex,
  `gap: 14px`.
- **Readout** to the right (250px column at `wide`): the big Δv figure (31px mono
  700), then rows for departure, flight time, band, and penalty against the grid
  minimum.
- **375px:** the matrix keeps its aspect but cells drop to 14px and the arrival
  gutter shows only the first and last label; the readout moves below the matrix.
  Below 340px, cells are 10px and the legend goes to two lines.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Cells do not stagger in — 140 staggered
  cells is a light show, not a chart.
- **On hover/focus:** the outline appears instantly (no transition — a fading
  outline lags the cursor). The readout swaps via `aria-live`.
- **Composed still:** the grid minimum cell selected, its outline drawn, the
  readout showing the cheapest pairing.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| band 1 (cheapest) | `--accent` @ 1.0, lightened (`color-mix` toward `--paper` 35%) |
| band 2 | `--accent` @ 1.0 |
| band 3 | `--accent-deep` @ 1.0 |
| band 4 | `--accent-deep` mixed toward `--ink` 45% |
| band 5 / above `vehicleLimit` | `--ink` @ 0.18 |
| cell gap | `--paper` (the 1px grid gap shows the surface) |
| selected outline | `--ink` @ 1.0, 2px |
| axis labels + title | `--ink` @ 0.50 |
| legend text | `--ink` @ 0.65 |
| readout Δv figure | `--accent` @ 1.0 |
| readout penalty, > 0.7 unit | `--accent-alt` |

**Declared fixed encoding:** the ramp is monotonic within the world's single
accent — brightest = cheapest — and the infeasible band is deliberately
*desaturated ink*, not a second hue, so "cannot fly" reads as absence rather than
as another category.

## 7. Fallback design

Build-time HTML; the grid is fully painted without JS.

1. The **whole matrix**, correctly banded, with the legend.
2. The **readout** painted for the grid minimum.
3. A `<table>` of the band boundaries and the count of pairings in each band —
   plus the minimum, its departure and arrival, and its Δv. A 140-cell table is
   not useful to AT, so the summary is the AT-readable source, and the matrix
   carries `role="img"` with an `aria-label` naming the shape of the window.

This is the one kind where the fallback deliberately summarises rather than
enumerates — 140 cells of screen-reader output would bury the argument.

## 8. Interaction spec

**One control** — cell selection by hover or focus.

- **Targets:** every cell is focusable (`tabindex="-1"` with roving focus, one
  tab stop for the grid, `role="grid"` semantics). Arrow keys move within the
  matrix. `touch-action: pan-y`; on touch, tap selects.
- **Readout template** (`aria-live="polite"`):
  `"Depart {departure}, arrive {arrival} — {v} {unit}{flightText}. {bandLabel}. {penaltyText}"`
  with `flightText` = `", {n} days in flight"` when `flightDays` is present, and
  `penaltyText` = `"{+d} {unit} above the cheapest pairing in the grid."` or, in
  the infeasible band, `"Outside the window — a launch here needs a bigger rocket
  than the one that exists."`
- **Keyboard:** complete. `Home`/`End` jump to the cheapest and dearest cells.

## 9. Comprehension text

- **`what`**: "Departure dates run across the bottom, arrival dates up the
  side, and every cell is one pairing of the two. The colour is the velocity
  change that trip would need — brightest is cheapest — so the bright island is
  the launch window and everything outside it is a mission the rocket cannot
  perform."
- **`how`**: "Move across the grid for any pairing's exact cost and flight time.
  The readout also gives the penalty against the cheapest departure in the whole
  grid."
- **Caption guidance:** the spread between best and worst — "the cheapest
  departure costs 3.58 km/s; the dearest more than twice that".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 900 (grid cells dominate; 14 × 10 = 140 is typical) |
| `data` payload | ≤ 8 KB (`cells` + optional `flightDays`) |
| Island JS | ≤ 1.4 KB minified, inline |
| Grid | ≤ 24 × 16 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Fills are banded; no cell takes an interpolated colour between two bands
- [ ] The legend renders from `bands` and the build fails without it
- [ ] **The axis title states the real step** (a 4-day step is not labelled 16-day)
- [ ] `vehicleLimit` band renders as desaturated ink with a "not flyable" legend entry
- [ ] The `idealised · patched-conic` chip renders
- [ ] Selection uses `outline`, and the grid does not reflow when a cell is picked
- [ ] Readout penalty is measured against the grid minimum, not the row minimum
- [ ] Arrow keys traverse the grid; `Home`/`End` reach cheapest and dearest
- [ ] Fallback summarises (band counts + minimum), and the matrix is `role="img"` with a shape-describing label
- [ ] 375px: cells ≥ 10px, readout below the matrix

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-space-showcase`.*
