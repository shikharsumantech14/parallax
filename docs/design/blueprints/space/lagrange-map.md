# Blueprint — `lagrange-map` (space · SVG · the CR3BP mechanism explainer)

> Why a spacecraft can *park in empty space*. The five Lagrange points drawn on
> their real effective-potential landscape — the rotating-frame gravity-plus-
> centrifugal terrain of a two-body system — with L1–L5 marked at their true
> geometry and the saddle/hill character visible in the contour shape.
> "The map shows the points are not places. They are balances." Build-time SVG,
> one ambient motion (co-rotating drift), fallback-complete.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `lagrange-map` |
| World | space |
| Tier | SVG (build-time contour geometry in the component frontmatter; CSS-var-driven reveal, no SMIL) |
| Component | `src/components/topic/space/LagrangeMap.astro` |
| Scene module | n/a (no WebGL) |
| Shared math | `src/scripts/viz3d/kepler.ts` gains 2 pure helpers — `effectivePotential(x, y, muStar)` and `lagrangePoints(muStar)` (both mirror `physics/orbital-mechanics.md` §7 1:1; used only by this component's frontmatter, but they live in kepler.ts so they are unit-testable and the §11 anchors can import them) |
| CSS prefix | `px-lagr` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `ClimateSpiral.astro` (build-time geometry + `html.js`-gated reveal), `power-flow` (build-time layout, single-accent discipline), `region-map` (in-SVG legend + `paint-order` halos) |

## 2. What it shows / when to use

The rotating-frame potential landscape of a two-body system and where its five
equilibrium points sit — so the reader understands L1/L2/L3 as unstable saddles
and L4/L5 as the stable equilateral corners, not as dots someone placed.

- **USE WHEN:** the story hinges on a Lagrange point — a mission parked at L1/L2
  (SOHO, JWST, Gaia), a co-orbital / Trojan population at L4/L5, or the
  station-keeping idea itself. The dossier needs the two-body system named and
  its mass ratio derivable (Sun–Earth, Earth–Moon, Sun–Jupiter).
- **DON'T USE:** a single spacecraft's flight path to get there (→
  `trajectory-arc`); interplanetary orbit geometry (→ `solar-system`); a
  delta-v budget of the transfer (→ `delta-v-ladder`); orbits *around* a
  Lagrange point (halo orbits — out of scope, mention in prose). If there is no
  potential-landscape idea, a labelled diagram is the wrong tool.
- **Pairs with:** `wide` standalone; hero-capable for "how does it park there"
  issues. Fine adjacent to a WebGL kind (it is SVG — the never-two-WebGL rule
  does not apply). Not `split` (no scroll-driven state; one still figure).

## 3. Data schema

```ts
interface LagrangeMapData {
  primary: { name: string; mass: number };   // "Sun", mass in any consistent unit
  secondary: { name: string; mass: number };  // "Earth", same unit as primary
                                               // muStar = mass_sec / (mass_pri + mass_sec)
  separationKm?: number;    // real primary–secondary distance, km — labels the
                            // Hill-distance readout (e.g. 1.496e8 for Sun–Earth AU).
                            // If absent, distances render in normalized units only.
  markers?: Array<{         // spacecraft / populations to pin at a point
    at: 'L1'|'L2'|'L3'|'L4'|'L5';
    label: string;          // "JWST", "Trojans"
  }>;
  show?: Array<'L1'|'L2'|'L3'|'L4'|'L5'>;  // which points to draw; default all 5
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Sun–Earth, JWST at L2, Trojans at L4/L5)
primary:   { name: "Sun",   mass: 332946 }   # Earth masses
secondary: { name: "Earth", mass: 1 }        # → muStar = 1/332947 = 3.003e-6
separationKm: 149600000
markers:
  - { at: L2, label: "JWST · Gaia" }
  - { at: L1, label: "SOHO" }
  - { at: L4, label: "Trojan asteroids" }
caption: "L2 sits 1.5 million km beyond Earth — a saddle in the rotating landscape where a telescope stays put."
source: "NASA/JPL Sun–Earth Lagrange geometry"
```

**Data flags with visual consequences (CANON §7):**
- The contour field is a **log-of-potential** shading (the raw Ω spans orders
  of magnitude near each mass). The component AUTO-RENDERS the caption chip
  `` potential log-shaded `` (honesty: the color ramp is not linear in Ω).
- Distances are in **units of the separation** unless `separationKm` is given;
  the Hill-distance readout then shows both (`0.010 · 1.5 M km`). No separate
  chip — the readout carries its own units per worlds/space.md.

## 4. Geometry spec (build-time, in the component frontmatter)

**`kepler.ts` helpers (mirror `physics/orbital-mechanics.md` §7):**

- `muStar = secondary.mass / (primary.mass + secondary.mass)`.
- `effectivePotential(x, y, muStar)` — rotating frame, unit distance =
  separation, unit ω = 1, barycenter at origin, primary at `x = −muStar`,
  secondary at `x = 1 − muStar`:
  ```
  r1 = √((x + muStar)² + y²)        // distance to primary
  r2 = √((x − 1 + muStar)² + y²)    // distance to secondary
  Ω  = ½·(x² + y²) + (1 − muStar)/r1 + muStar/r2
  ```
- `lagrangePoints(muStar)` returns the 5 points in normalized coords:
  - **L4** `(0.5 − muStar,  √3/2)`, **L5** `(0.5 − muStar, −√3/2)` — exact
    equilateral (closed form).
  - **L1, L2, L3** on the x-axis (y = 0) via Newton on `dΩ/dx = 0`
    (collinear roots), seeded from the Hill approximation
    `r_H = (muStar/3)^(1/3)`: L1 seed `1 − muStar − r_H`, L2 seed
    `1 − muStar + r_H`, L3 seed `−(1 + 5·muStar/12)`. ≤ 40 Newton iterations,
    `|Δ| < 1e-10`.

**Worked anchors (COMPUTABLE — a reviewer recomputes these):**
- Sun–Earth `muStar = 1 / 332947 = 3.0032e-6`.
- Hill distance `r_H = (muStar/3)^(1/3) = (1.0011e-6)^(1/3) ≈ 0.010003`
  (units of separation). With `separationKm = 1.496e8` → `≈ 1.497e6 km`
  (1.5 M km — JWST's neighborhood, matches the sheet).
- **L4 potential is EXACTLY Ω = 1.5** in this normalization: at L4,
  `r1 = r2 = 1` and `x² + y² = (0.5 − muStar)² + 3/4 ≈ 1`, so
  `Ω = ½·1 + (1−muStar) + muStar = 1.5`. (The blueprint's single hardest
  check: the L4/L5 dots must land where `effectivePotential = 1.5000 ± 0.001`.)
- L1 ≈ `x = 0.98999` (i.e. `1 − muStar − r_H` refined), L2 ≈ `x = 1.01001`,
  L3 ≈ `x = −1.00000125` (just beyond the primary, opposite the secondary).

**The contour field:**
- **viewBox `0 0 720 470`.** Domain mapped: normalized `x ∈ [−1.35, 1.35]`,
  `y ∈ [−0.95, 0.95]` → screen with `PAD = 12`. `sx(x) = 12 + (x + 1.35)/2.7 ·
  696`; `sy(y) = 235 − y/0.95 · 223` (y-up flipped; barycenter at ~ (360, 235)).
- **Grid:** sample Ω on a **160 × 106 grid** (≈ 17k cells) over the domain at
  build time. Clamp Ω to `[Ω_min, Ω_cap]` where `Ω_cap = Ω(L1) + 0.6` (the
  interesting band around the collinear saddles; the mass singularities are
  masked, see below). Shade `t = (log(Ω − Ω_min + ε) − …)` normalized to
  `[0,1]` → the ramp in §6. Rendered as **filled iso-bands via marching
  squares at 11 levels** (contour polylines closed into bands) — NOT 17k rects
  (SVG-node budget). Each band is one `<path>`; ≤ ~40 band paths total.
- **Contour lines:** the same 11 levels as 0.75 px `--ink` @ 0.22 stroke paths
  over the bands (the "ruled paper" of the terrain).
- **The two masses:** primary a filled `--ink` @ 0.9 disc r = 9 px at
  `sx(−muStar)`, secondary r = 5 px at `sx(1−muStar)`; each masked with a small
  `--paper` occluder ring so the diverging contours near them don't visually
  scream (the singularity is real but not the story). Mono labels
  `{primary.name}` / `{secondary.name}` below each, 10 px +0.08em, paper halo.
- **The Lagrange points:** each in `show` drawn as a 4 px accent ring (hollow,
  1.5 px stroke `--accent`) + a 1 px `--accent` center dot. L1/L2/L3 get a tiny
  1.5 px `×` glyph inside (saddle = unstable); L4/L5 get a filled center dot
  (stable). Mono label `{point}` (e.g. "L2") 10 px, offset 8 px along the
  radial away from the secondary, paper halo, **collision policy:** L1/L2/L3
  labels stack above the axis, L4/L5 labels sit outside their triangle apex.
- **The collinear-trio magnifier (REQUIRED for real mass ratios).** At the
  example's Sun–Earth `μ* = 3.003e-6`, L1, the secondary, and L2 map to screen
  x = 615.2, 617.8, 620.4 — a **5.2 px span**: the two point rings and the
  secondary disc overlap into one blob and their `L1`/`{secondary}`/`L2` labels
  cannot separate on the main map. So the component draws a **magnified inset**
  (a small framed box, ~180×90 px, bottom-right, clear of L5) that blows up the
  neighborhood of the secondary by a fixed factor (≥ 40×, chosen so the L1–L2
  span reads ≥ 60 px): the secondary disc centered, L1 and L2 rings at their
  true *relative* offsets `∓ r_H` about it, each with its `×` saddle glyph and
  `L1`/`L2` label, and a hairline connector from the inset frame to the collapsed
  blob on the main map. On the main map, the overlapping trio collapses to a
  single `--accent` tick with a `L1·L2` mono tag pointing at the inset. The
  inset is omitted only when the collinear points are already ≥ 24 px apart on
  the main map (i.e. `μ*` large enough — Earth–Moon, `μ* ≈ 0.0123`, separates
  them natively). *(Added 2026-07-06: the original collision policy verified
  only that labels fit the viewBox, not that L1/secondary/L2 are mutually
  separable — for the blueprint's own Sun–Earth example they collapse into ~5 px
  and are unreadable. The magnifier is the designed fix; the §11 anchor now
  tests mutual separation, not just viewBox fit.)*
- **Marker callouts:** a `markers[]` entry adds a Fraunces-italic 13 px
  `--accent-deep` annotation (the space "editorial callout" role, CANON §5)
  with a 1 px `--accent` leader line from the point to the label, placed in the
  nearest viewBox margin; ≤ 3 markers (more clutters — enforce, drop extras).
- **The co-rotating axis:** a faint `--ink` @ 0.16 dashed line through both
  masses (the rotating frame's x-axis) with a mono end-label
  `co-rotating frame`, so the reader knows the whole picture spins with the
  secondary.
- **375px:** viewBox scales (SVG is fluid); labels stay ≥ 9.5 px via the
  `--viz-fs-*` tokens; at ≤ 640px the marker callouts move below the figure as
  a 2-row list (they would collide at narrow width) — the leader lines drop,
  the point rings keep their `L#` labels.

## 5. Motion spec (names from motion.md)

- Reveal (once, on scroll-in, `html.js`-gated `.px-viz:not(.is-in)` hidden) —
  **with explicit start offsets so overlapping stages fit the 1.6 s budget**
  (the `power-flow` §5 convention): contour bands `reveal` (start 0, opacity
  0→1, 400 ms, no transform — a terrain doesn't fly in) → contour lines `sweep`
  (start 250 ms, stroke-dashoffset draw, 700 ms, from the center outward by
  level) → masses `reveal` (start 850 ms, 220 ms) → **L-points `settle`** (start
  1000 ms, scale 1.3→1 + opacity, 220 ms `--ease-snap`, staggered 40 ms L1→L5 =
  +160 ms) → marker callouts `reveal` (start 1420 ms, 140 ms) last. Full
  sequence ends at **1560 ms ≤ 1.6 s**. *(Start offsets + trimmed durations
  added 2026-07-06: the original bare `→` chain — 500 ms bands then 900 ms sweep
  (serial, since the sweep draws over the bands) then settle + 160 ms stagger +
  140 ms callouts — realized ≈ 1.76 s, over the motion.md ≤1.6 s budget with no
  offsets stated to reconcile it. Overlapping starts and a 400/700 ms trim bring
  it in.)*
- **`pulse` (the ONE ambient motion, one per viewport):** the marked Lagrange
  point(s) that carry a `marker` pulse gently (opacity 0.55↔1, 2.4 s sine) —
  the "occupied balance" is alive. Unmarked points are static. At most one
  point pulses even if multiple markers exist (the primary marker; others
  static) — CANON: one pulse per viewport.
- Reduced-motion / no-JS: everything painted final; contour bands + lines +
  points + labels + callouts all visible; `pulse` renders static at full
  opacity. This IS the print plate.
- **Composed still:** the complete potential map with all shown L-points,
  masses, and callouts — the fallback and the reduced-motion frame are this.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| contour bands (potential shading) | `--accent` ramp: deep→vivid on `--accent-deep` @ 0.10 (low Ω / valleys) → `--accent` @ 0.28 (high Ω / near masses); single-hue ramp, NOT rainbow |
| contour lines | `--ink` @ 0.22 (support/graticule opacity, CANON §6) |
| masses (discs) + labels | `--ink` @ 0.9 / mono `--ink` |
| Lagrange point rings + dots | `--accent` @ 1.0 (the data mark) |
| saddle `×` / stable center dot | `--accent` @ 1.0 |
| marker callouts + leaders | `--accent-deep` (Fraunces italic annotation) / `--accent` @ 0.6 leader |
| co-rotating axis | `--ink` @ 0.16 dashed |

Single-accent discipline (CANON §6, the `power-flow` rule): the terrain is ONE
cyan ramp, the points are cyan, the callouts cyan-deep — no per-point colors,
no second hue. Amber (`--accent-alt`) is deliberately absent — there is no
"anomaly" here, only structure.

## 7. Fallback design (first-class)

The SVG is build-time static already — the reveal is the only JS, and it is
gated so **no-JS = the final painted map** (per §5). This IS the print plate;
no separate fallback geometry needed.

- Below the figure, the **legend list** (`.vz-legend`, AT-readable), one row
  per shown point: `` {point} · {type} · {x_norm, y_norm}{· distance if
  separationKm} `` where type = "unstable saddle" (L1/L2/L3) or "stable
  equilateral" (L4/L5). The L2 row for the example reads
  `` L2 · unstable saddle · 1.5 M km beyond Earth ``.
- A system row: `` {primary.name}–{secondary.name} · mass ratio μ* = {muStar} ``.
- Rows are ≤ 5 (five L-points) — no collapse needed; but the marker list, if
  > 5, collapses behind "show all markers" (amendment 3; rarely hit).

## 8. Interaction spec

- **None interactive in v1** (no hover targets — the SVG stays pure, like
  `power-flow`). Everything readable from the composed still + labels +
  legend + caption. The ⤢ expand modal (automatic via `.px-viz`) is the study
  view; its `how` line points the reader at the point types.
- `markers[]` render as static labeled callouts, not tooltips.
- Keyboard/AT: the figure is `role="img"` with an `aria-label` summarizing the
  system ("Effective-potential map of the Sun–Earth system, five Lagrange
  points marked"); the legend list carries the per-point data. No focusable
  interactive elements exist to trap focus.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "The shaded landscape is the combined
  gravity-and-spin terrain of the two bodies; the five rings mark the points
  where the pulls balance — three are knife-edge, two are stable."
- **how** (ExpandModal): "Read the contours like a topographic map: the two
  bodies sit in the deep wells, and L4/L5 are the shallow stable basins 60°
  ahead of and behind the smaller body."
- Caption guidance: state the specific geometry claim ("L2 sits 1.5 million km
  beyond Earth"), never restate the form.
- **Text budget** (≤80 words at rest — `REVIEW-2026-07-05.md` amendment 3,
  designated "§4.5" but not yet merged into `CANON.md`): at rest = 5 `L#` labels (5 words) + 2 mass
  labels + 1 axis label + ≤3 marker callouts (~6 words) + caption (~16) +
  plain (~28) — well under 80; the per-point *type* description lives in the
  collapsible legend, not on the figure.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 900 (≤40 band paths + ≤11 contour-line paths + 5 point groups + 2 masses + labels + callouts + the collinear-trio magnifier inset ≈ 12 nodes when present; the 160×106 sample grid is build-time only — never emitted as nodes) |
| Build-time compute | 160×106 = 16,960 `effectivePotential` evals + marching squares — trivial at build, zero runtime cost |
| `data` payload | ≤ 2 KB (two bodies + ≤5 markers) |
| JS | the shared `Reveal` island only (no per-component JS) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (the still IS the deliverable) ·
      375px no overflow, labels ≥ 9.5px · reduced-motion still · token grep
      (single accent ramp only; no hex literals) · caption + source + plain ·
      no-JS = final painted map (view-source) · payload degradation (missing
      `separationKm` → normalized units; missing `show` → all 5) · prefix
      `px-lagr` unique
- [ ] `effectivePotential` at L4 `(0.5 − muStar, √3/2)` = **1.5000 ± 0.001**
      for Sun–Earth muStar (the equilateral anchor); L5 identical
- [ ] `lagrangePoints(3.003e-6)`: L1 x ≈ 0.98999, L2 x ≈ 1.01001, L3 x ≈
      −1.0000, and Hill distance `(muStar/3)^(1/3) ≈ 0.01000` (1.5 M km with
      the example separation) — recomputable from the sheet
- [ ] L1/L2/L3 render the saddle `×` glyph; L4/L5 render the stable filled dot;
      the legend labels them "unstable saddle" / "stable equilateral"
      accordingly
- [ ] All five `L#` labels + both mass labels fit inside the `0 0 720 470`
      viewBox at the example geometry — none clipped (the exemplars' label-fit
      bug class)
- [ ] **Mutual separability at Sun–Earth μ\*:** L1 (x≈615 px), secondary
      (x≈618 px) and L2 (x≈620 px) collapse to ~5 px on the main map, so the
      collinear-trio magnifier inset renders (≥40×, L1–L2 span ≥60 px in the
      inset) with L1/L2 individually labelled and saddle-glyphed; the main-map
      blob collapses to one tick with a `L1·L2` tag pointing at the inset. The
      inset is absent for Earth–Moon μ\* (points already ≥24 px apart)
- [ ] The contour field renders as ≤40 filled band `<path>`s (marching squares),
      NOT 17k rects; SVG node count ≤ 900
- [ ] Caption chip `potential log-shaded` renders (the ramp is log, per §3)
- [ ] `markers: [{at: L2, label: "JWST · Gaia"}]` draws a leader + Fraunces-
      italic callout inside a viewBox margin; at ≤640px the callout moves to a
      list below the figure
- [ ] The occupied point `pulse`s (one only) live; reduced-motion freezes it at
      full opacity; unmarked points never pulse
- [ ] Legend `<details>` carries per-point type + coordinates (+ distance when
      `separationKm` given); readable with zero JS

---

*Registry duties when implementing (P6 — NOT now): add `lagrange-map` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `effectivePotential`/`lagrangePoints` helpers to `kepler.ts` with unit
tests, add the `EXPLAIN` entry (`src/lib/explainers.ts`), add the `catalog.md`
block (in `SECTION_KINDS` order; `npm run check:catalog` must pass), document
the `px-lagr` prefix in `src/components/AGENTS.md` §4/§2, and add a worked
example to `2026-06-03-space-showcase`. Do NOT edit `SECTION_KINDS` or
`catalog.md` at blueprint time.*
