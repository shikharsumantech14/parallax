# Blueprint — `carbon-loop` (earth · SVG · the stock-and-flow of the `flowDash` family)

> The carbon cycle as it actually balances — and doesn't: reservoirs drawn as
> boxes sized by how much carbon they hold, fluxes as flowing arrows sized by
> gigatonnes-per-year, and the one flux that doesn't cancel (the +5 GtC/yr the
> atmosphere keeps) made visible as a widening residual. Conservation is
> checked at BUILD; an unbalanced reservoir fails the build unless the
> imbalance IS the story. The `power-flow` family, applied to a closed loop
> with a leak. "Where the carbon goes, and where it piles up."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `carbon-loop` |
| World | earth (usable cross-world for any stock-and-flow; wears the issue theme) |
| Tier | SVG (build-time layout + conservation check; `flowDash` via CSS vars, like `power-flow`) |
| Component | `src/components/topic/earth/CarbonLoop.astro` |
| CSS prefix | `px-cloop` |
| Flagship reference | `power-flow` (`PowerFlow.astro`) — same build-time-layout + `flowDash`-speed-∝-value + conservation-check discipline; this is the reservoir (stock-and-flow) sibling of that pure Sankey. Also `ClimateSpiral.astro` for the html.js-gated reveal. |

## 2. What it shows / when to use

The carbon cycle (or any conserved-quantity budget) as reservoirs + fluxes,
with conservation visible and the accumulation called out. The reader learns
*what balances, what doesn't, and by how much*.

- **USE WHEN:** the dossier has a stock-and-flow table — named reservoirs with
  stocks (GtC) and fluxes between them (GtC/yr), ≥3 reservoirs and ≥4 fluxes —
  and either the flows balance per reservoir OR a named reservoir accumulates
  and THAT is the point (flagged `imbalance: 'the-point'`, e.g. atmosphere
  +5.1 GtC/yr).
- **DON'T USE:**
  - a one-directional money/authority trail with layers (→ `power-flow`, the
    pure Sankey — carbon-loop is for a CLOSED loop with reservoirs, not a
    left-to-right cascade);
  - a used/remaining budget arc (→ `carbon-gauge`); a single rise level
    (→ `sea-level-tank`); part-of-whole tiles (→ `data-readout`).
  - a flow with no reservoir sizes — if you only have edge values, that's
    `power-flow`.
- **Pairs with:** `wide`; hero-capable for a carbon-cycle / nitrogen-cycle /
  water-cycle issue. A QUIET-to-MEDIUM section (one ambient `flowDash` motion —
  not "loud" like WebGL, but not silent).

## 3. Data schema

```ts
interface CarbonLoopData {
  unit: string;                 // "GtC" (stocks) — fluxes are "{unit}/yr". Labels every value.
  reservoirs: Array<{
    id: string;                 // "atmosphere"
    label: string;              // "Atmosphere"
    stock: number;              // reservoir size, GtC — box AREA ∝ this
    x: number; y: number;       // layout anchor, normalized 0..1 (author places the loop; see §4)
    role?: 'store' | 'source' | 'sink';  // conservation class (mirrors power-flow's source/via/sink).
                                // Default 'store' = a closed pool that MUST conserve (balance-checked, §4).
                                // 'source' (one-way tap, e.g. fossil reserves) / 'sink' (one-way terminus)
                                // are OPEN boundaries — exempt from the balance check.
    accent?: boolean;           // draw in the accent (the reservoir the story is about);
                                // the ONLY reservoir on which imbalance:'the-point' draws a residual (§4).
  }>;
  fluxes: Array<{
    from: string; to: string;   // reservoir ids
    value: number;              // flux, GtC/yr — arrow thickness + flowDash speed ∝ this
    note?: string;              // "fossil fuels + land use"
  }>;
  imbalance?: 'the-point';      // suppresses the build-time conservation FAILURE for accumulating
                                // reservoirs; renders the residual visibly instead (see §4).
  residualLabel?: string;       // label for the visible accumulation, e.g. "+5.1 GtC/yr — the airborne fraction"
  caption?: string;
  source?: string;              // REQUIRED. e.g. "Global Carbon Budget 2023 (Friedlingstein et al.)"
}
```

```yaml
# example payload (the fast carbon cycle, GtC & GtC/yr)
# Corrected 2026-07-06: the ocean and land loops now CLOSE (80/80, 123/123) so both
# 'store' reservoirs balance and the build passes; fossil is role:source (exempt,
# a one-way tap); the atmosphere is the ONE accent store that accumulates. Its net
# = +10 GtC/yr = exactly the fossil input that the closed ocean/land loops can't
# reabsorb — the airborne fraction, drawn as the residual.
unit: "GtC"
reservoirs:
  - { id: atmosphere, label: "Atmosphere",        stock: 875,  x: 0.50, y: 0.16, role: store,  accent: true }
  - { id: ocean,      label: "Surface ocean",     stock: 900,  x: 0.16, y: 0.66, role: store }
  - { id: land,       label: "Land + vegetation",  stock: 2200, x: 0.84, y: 0.66, role: store }
  - { id: fossil,     label: "Fossil reserves",   stock: 1200, x: 0.50, y: 0.90, role: source }
fluxes:
  - { from: atmosphere, to: ocean,  value: 80,  note: "dissolution" }
  - { from: ocean,      to: atmosphere, value: 80,  note: "outgassing" }
  - { from: atmosphere, to: land,   value: 123, note: "photosynthesis" }
  - { from: land,       to: atmosphere, value: 123, note: "respiration + fire" }
  - { from: fossil,     to: atmosphere, value: 10,  note: "combustion + land use" }
imbalance: the-point
residualLabel: "+10 GtC/yr stays aloft — the airborne fraction"
caption: "The ocean and land loops nearly cancel — but every year the ~10 gigatonnes of carbon released from fossil reserves has nowhere to return, and the atmosphere keeps it."
source: "Global Carbon Budget 2023 (Friedlingstein et al.)"
```

**Data flags with visual consequences:**
- `imbalance: 'the-point'` → the flagged reservoir's net (Σin − Σout) is drawn
  as a **residual accumulation** (an `--accent-alt` growing stub/halo on the
  reservoir + the `residualLabel` chip), instead of failing the build. Without
  the flag, a >1% net imbalance on ANY reservoir FAILS the build naming it
  (mechanics-and-flow §4).

## 4. Geometry spec (build-time, in the component frontmatter)

### Conservation check (mirrors `mechanics-and-flow.md §4` 1:1)

- For each reservoir `R`: `net_R = Σ(flux.value where flux.to==R) − Σ(flux.value
  where flux.from==R)` (GtC/yr).
- Balanced iff `|net_R| ≤ 0.01 · max(Σin_R, Σout_R)` (1% tolerance,
  mechanics-and-flow §4).
- **Which reservoirs are checked** mirrors `power-flow`'s source/via/sink split
  (a reservoir's `role`, §3): only `role: 'store'` reservoirs (the default —
  closed pools that must conserve, like ocean and land) are balance-checked.
  `role: 'source'` (a one-way tap, e.g. fossil reserves — combustion out, no
  return) and `role: 'sink'` (a one-way terminus) are OPEN boundaries and are
  exempt, exactly as `power-flow` exempts its `source`/`sink` nodes and checks
  only `via`. *(Corrected 2026-07-06: without a role split, fossil reserves — a
  pure one-way source (out 10, in 0) — could NEVER balance, so the example was
  structurally un-buildable under a blanket check. The role field, borrowed from
  `power-flow`, is the fix.)*
- If a `role: 'store'` reservoir is unbalanced AND `imbalance !== 'the-point'` →
  `throw` at build naming the reservoir and its `net` (identical discipline to
  `power-flow`'s via-node check). Honesty enforced by the build, not by the
  author's memory (CANON §7).
- If `imbalance: 'the-point'` → the flag suppresses the failure and draws the
  visible residual **only on the reservoir(s) marked `accent: true`** (the ONE
  the story is about — the airborne fraction). **A `store` reservoir that is
  unbalanced but NOT `accent` STILL FAILS the build, naming it** — the flag is a
  licence to show the story's accumulation, not a blanket amnesty that lets a
  leak hide in a side pool. *(Corrected 2026-07-06: the previous wording —
  "the unbalanced reservoir(s) render their net as the visible residual" — keyed
  the residual off *unbalanced*, so ocean/land/fossil would each sprout residual
  crescents alongside the atmosphere, contradicting §6's "reserved for the ONE
  residual." Residual now keys off `accent`.)*

**Acceptance anchor (COMPUTABLE — recompute from the example payload):**
- Atmosphere (`role: store`, `accent`) net: `in = ocean→atm 80 + land→atm 123 +
  fossil→atm 10 = 213`; `out = atm→ocean 80 + atm→land 123 = 203`.
  `net = 213 − 203 = +10 GtC/yr` (4.7% of 213 → >1% → unbalanced, but it is the
  `accent` reservoir with `imbalance:'the-point'`). **The residual DRAWN is the
  computed `net` (+10 here), and `residualLabel` is authored text** (they agree
  by design in this payload — the label is still not derived from the arithmetic;
  the implementer draws the +10). ⇒ the build PASSES and draws a +10 residual
  crescent on the atmosphere box.
- Ocean (`store`) net: `in = atm→ocean 80`; `out = ocean→atm 80`; `net = 0` →
  balanced ✓. Land (`store`) net: `in = 123`; `out = 123`; `net = 0` → balanced
  ✓. Fossil (`role: source`) net: `in = 0`; `out = 10`; `net = −10` → **exempt**
  (open boundary, not balance-checked). So exactly ONE reservoir (the accent
  atmosphere) carries a residual; the build passes.
- **Live-check probe:** flip ocean's outgassing to 78 (net +2, 2.5% >1%). Because
  ocean is `store` and NOT `accent`, the build now FAILS naming `ocean` even with
  `imbalance:'the-point'` set — proving the flag is a story-residual licence, not
  a blanket amnesty. *(Corrected 2026-07-06: the prior anchor had the example
  itself failing the build — ocean +2 / land +5 / fossil −10 were all non-accent
  imbalances — so the "copy-pasteable" payload was un-buildable. The example now
  closes the store loops and marks fossil a source; the +10 residual is exactly
  the fossil input the closed loops can't reabsorb.)*

### Layout

- viewBox `0 0 W H`, `W = 720`, `H = 560`, `overflow: visible`. Author places
  reservoirs via normalized `x,y` (∈[0,1]) → `cx = PAD + x·(W−2·PAD)`,
  `cy = PAD + y·(H−2·PAD)`, `PAD = 60` (gutter holds outward labels). A loop
  layout (reservoirs around a ring) is the natural arrangement; the schema lets
  the author position them so the cycle reads as a cycle, not a column.
- **Reservoir boxes:** rounded rects, **AREA ∝ stock** (the "stock" of stock-and-
  flow): `area = stock · K_area`, `K_area = 9000 / maxStock` (px²); box drawn as
  a square-ish rect `side = sqrt(area)` clamped `[44, 140]` px (44 = the AT/touch
  floor; 140 caps the largest). Centered at `(cx,cy)`. Fill `--paper-2`, 1.5px
  `--ink` @ 0.6 edge; accent reservoir edge `--accent` @ 0.9. Inside: label
  (Schibsted 13px) + mono `{stock} {unit}` (motif 4, the measured value).
- **Flux arrows:** each flux = a curved arrow from the `from` box edge to the
  `to` box edge. Path = a quadratic Bézier bowed outward (control point offset
  perpendicular to the chord by `0.18·chordLen`, so opposite-direction fluxes
  between the same pair separate — photosynthesis and respiration don't
  overlap). **Thickness ∝ value:** `w = max(2, value · K_flux)`,
  `K_flux = 22 / maxFlux` px. Drawn as a filled band @ 0.28 accent + a 1.5px
  centerline (the `flowDash` carrier). An open-V arrowhead at the `to` end
  (line-art, CANON §4). Mono value label `{value}` (+ `/yr` implied by the axis
  key) at the path midpoint with paper halo; `note` as a `--muted` sub-label.
- **The residual (`imbalance:'the-point'`):** on the flagged reservoir, an
  `--accent-alt` (brown = the warmed/geologic) crescent halo OUTSIDE the box on
  its top edge, its arc-length ∝ `net`, growing (`grow` motion) — plus the
  `residualLabel` in mono `--accent-deep` above the box. This is the carbon that
  piles up, drawn as it accumulates (mechanics-and-flow §4: "render the
  accumulation visibly").
- **Axis key (motif 4, the measured rule):** top-left mono
  `FLUX = {unit}/yr · STOCK = {unit}` so the two scales are declared.
- **Coordinate margin (motif 2):** the card header carries the cycle name + the
  budget year (mono), grounding it in a time (carbon cycles are dated) rather
  than a place.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated, `.px-viz:not(.is-in)` hidden states — the existing
  contract):
  - reservoir boxes `grow` (scale from center, 400 ms, 60 ms stagger) →
  - flux bands `sweep` (dashoffset draw along the centerline, 900 ms, starting
    250 ms) →
  - value labels + the residual crescent `reveal`/`grow` LAST (the accumulation
    grows in after the loop is drawn — the punchline).
  - Total ≤ 1.6 s (motion.md stagger budget).
- **`flowDash`** on the flux centerlines (the card's ONE ambient motion,
  motion.md continuous-budget): `stroke-dasharray: 2 6`, `stroke-dashoffset`
  animated via CSS `@keyframes`, **speed ∝ value normalized so the largest flux
  = 60 px/s, floor 8 px/s** (mechanics-and-flow §4 — NOT the inverse; the
  biggest flux moves fastest, matching the physics-sheet normalization). Per
  flux: `speed = max(8, 60·value/maxFlux) px/s` (bounded [8, 60] by construction),
  then the `@keyframes` period `dur_s = dashCycleLen / speed`, where
  `dashCycleLen = 2 + 6 = 8 px` (the dasharray period) → `dur` runs 0.13 s
  (fastest, at 60 px/s) to 1.0 s (floor, at 8 px/s). *(Corrected 2026-07-06: the
  prior `duration = clamp(dashCycleLen / speed)` wrote `clamp()` with a single
  argument — malformed; the speed floor already bounds `dur`, so no clamp is
  needed.)* Direction follows `from→to` (offset decreases along the path). Runs
  continuously.
- Reduced-motion: everything painted final; dashes STATIC but visible (dasharray
  stays — directional stipple, exactly like `power-flow`); the residual crescent
  at full size; no keyframes.
- **Composed still:** the full loop — reservoirs sized, fluxes drawn with
  stipple dashes, values labelled, the residual crescent + label present. The
  print plate.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| reservoir boxes | `--paper-2` fill, `--ink` @ 0.6 edge; accent reservoir edge `--accent` @ 0.9 |
| reservoir labels / stock | `--ink` (Schibsted) + mono stock `--accent-deep` |
| flux bands | `--accent` @ 0.28 fill, centerline dash `--accent-deep` @ 0.9 |
| flux value labels | mono `--accent-deep`; notes `--muted` |
| the residual (accumulation) | `--accent-alt` @ 0.85 crescent + mono `--accent-deep` label (brown = the warmed/piled-up carbon — earth §Materials) |
| axis key / coordinate margin | `--ink` @ 0.55 mono |

Single-accent discipline (like `power-flow`): NO per-flux rainbow — one green
system, thickness + dash-speed do the talking; `--accent-alt` (brown) is
reserved for the ONE residual (the piled-up carbon), which is exactly the
earth-world semantic (green = the living/cycling datum, brown = the
warmed/accumulated). No new hue. Grep test: only these tokens, zero color
literals in the component.

## 7. Fallback design (first-class)

The SVG is **build-time static already** — no separate fallback needed (like
`power-flow`). No-JS / reduced-motion = the full painted loop with stipple
dashes (per §5), reservoirs sized by stock, fluxes labelled, the residual
crescent + label present. This IS the print plate. The SVG carries a
`<title>`/`<desc>` and the reservoir/flux values are real text (AT-readable data
source). If the loop is dense, a below-SVG **field-note legend** (motif 3) lists
reservoir · stock and flux · value rows, collapsing past 5 (REVIEW amendment 3).

## 8. Interaction spec

- **None interactive in v1** (no hover targets — the SVG stays pure, like
  `power-flow`; CANON §9 one-control-max is satisfied by using ZERO controls).
  Values and notes are always-visible labels, not tooltips.
- The ⤢ expand modal (automatic via `.px-viz`) is the study view — the loop at
  full size with the plain-language explainer and the conservation arithmetic
  spelled out.
- Keyboard/AT: no focusable in-card controls beyond ⤢; the SVG text + optional
  legend carry the data; the plain line explains the form.

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts`): "Each box is a place carbon is
  stored, sized by how much it holds; each arrow is a yearly flow between them,
  thicker and faster where more carbon moves. The brown mark shows the carbon
  that arrives but never leaves."
- **how** (ExpandModal): "Follow the arrows around the loop — most nearly cancel
  out. Watch the brown residual on the atmosphere: that's the part that
  accumulates every year."
- Caption guidance: state the balance/accumulation claim ("the ~10 gigatonnes
  from fossil reserves has nowhere to return"), name the cycle + year; never
  restate what a box or arrow is. Source names the budget (CANON §7).

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 400 (≤~8 reservoir groups + ≤~16 flux paths×2 (band+centerline) + labels) |
| `data` payload | ≤ 5 KB |
| Extra assets | none |
| Client JS | none beyond the shared `Reveal` island (CSS `flowDash` needs no JS) |

No fetch, no per-frame JS compute; `flowDash` is pure CSS `@keyframes` driven
by a per-flux `--dash-dur` custom property computed at build.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette (the still IS the card) ·
      375px no overflow, labels ≥ 9.5px, ⤢ target ≥ 44px, reservoir boxes ≥ 44px ·
      reduced-motion = static stipple, full loop painted · token grep (only
      `--ink`/`--accent`/`--accent-alt`/`--accent-deep`/`--paper-2`/`--muted`;
      zero hex literals) · caption + source + plain render · (no WebGL clause —
      N/A) · payload degrades (missing `note` ⇒ no sub-label; missing `imbalance`
      flag on a balanced set ⇒ renders fine) · `px-cloop` prefix unique
- [ ] Conservation (example payload): ocean and land `store` reservoirs balance
      (80/80, 123/123 → net 0); fossil is `role: source` → exempt; the atmosphere
      (`store`, `accent`) nets `213 − 203 = +10` and renders the residual crescent
      under `imbalance:'the-point'` — the build PASSES (recompute 213−203=+10 by hand)
- [ ] Live-check probe: flipping ocean→atm to 78 (net +2, 2.5%) makes the build
      FAIL naming `ocean` EVEN WITH `imbalance:'the-point'` set — because ocean is
      a non-accent `store` (the flag is not a blanket amnesty)
- [ ] A `role: source`/`sink` reservoir with a one-way flux never fails the build;
      a `store` reservoir with all nets ≤1% builds with NO residual and NO error
- [ ] Reservoir box AREA ∝ stock (spot-check: land 2200 vs atmosphere 875 ≈
      2.5× the area, so ≈1.6× the side)
- [ ] Flux thickness ∝ value (photosynthesis 123 vs fossil 10 ≈ 12× thicker);
      the largest flux's dashes move at ~60 px/s, the smallest ≥8 px/s (largest
      FASTER — mechanics-and-flow §4 normalization, not the inverse)
- [ ] Opposite-direction fluxes between the same pair (photosynthesis vs
      respiration) are bowed apart and both readable
- [ ] The residual crescent is `--accent-alt` and its arc ∝ the computed net;
      the `residualLabel` renders in mono
- [ ] Reduced-motion / no-JS: identical full loop with static stipple
      (view-source check)
- [ ] One accent family only (grep for color literals — expect zero)

---

*Registry duties when implementing (P6, NOT here): add `carbon-loop` to
`SECTION_KINDS`, dispatch in `SectionBody.astro`, add the `EXPLAIN` default, add
the catalog block (`check:catalog` must pass), document `px-cloop` in
`src/components/AGENTS.md` §4, add a worked example to
`2026-06-03-earth-showcase`. This blueprint edits NO config/catalog/component.*
