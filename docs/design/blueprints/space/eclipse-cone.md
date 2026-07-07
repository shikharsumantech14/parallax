# Blueprint — `eclipse-cone` (space · CSS-3D / SVG · the shadow-geometry explainer)

> Why a total eclipse is a coincidence and a near-miss. The Sun–body–shadow
> geometry drawn to TRUE angular scale: the umbra cone tapering from the
> occulting body to its real tip length, the target body placed at its real
> distance, and the punchline visible in the geometry — the Moon's umbra
> *barely* reaches Earth, so totality is a knife-edge of orbital distance. The
> two angular diameters (0.52° vs 0.53°) shown equal is the whole story.
> CSS-3D tilt to feel the cone, SVG for the exact geometry, fallback-complete.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `eclipse-cone` |
| World | space |
| Tier | CSS-3D / SVG (build-time SVG geometry inside a `core/Tilt.astro` pointer-tilt shell — the shared `.px3d-*` mechanics; no WebGL, no three.js) |
| Component | `src/components/topic/space/EclipseCone.astro` |
| Scene module | n/a |
| Shared math | `src/scripts/viz3d/kepler.ts` gains 2 pure helpers — `umbraConeLength(rBody, rSun, dSun)` and `angularDiameter(radius, distance)` (both mirror `physics/orbital-mechanics.md` §8 1:1; used by this component's frontmatter, live in kepler.ts for unit-testing + the §11 anchors) |
| CSS prefix | `px-eclp` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `core/Tilt.astro` + `components-3d.css` `.px3d-*` (the CSS-3D pointer-tilt mechanic, shared), `power-flow` (build-time SVG + single accent), `TrajectoryArc` (space CSS-3D/SVG hybrid precedent) |

## 2. What it shows / when to use

The true geometry of an eclipse shadow: a light source, an occulting body, its
umbra/penumbra cone at real proportions, and the target body at its real
distance — so the reader sees *why* totality happens (or nearly doesn't) instead
of reading it as a fact.

- **USE WHEN:** the story is eclipse or occultation geometry — solar/lunar
  eclipses, the totality coincidence, an occultation of a star by a body,
  transit vs eclipse. The dossier needs the three radii (source, occulter,
  target) and the two distances (source→occulter, occulter→target).
- **DON'T USE:** the *path* of an eclipse across a map (→ `region-map` with a
  track); a timeline of eclipse events (→ `timeline`); the orbit that produces
  the alignment (→ `solar-system` or `lagrange-map`). If the point is not the
  cone geometry itself, this is the wrong tool.
- **Pairs with:** `wide` standalone; hero-capable for eclipse issues. Fine
  adjacent to a WebGL kind (it is CSS/SVG). Not `split` (one still figure, the
  tilt is decorative depth, not a state control — CANON §9).

## 3. Data schema

```ts
interface EclipseConeData {
  source: { name: string; radiusKm: number };        // "Sun", 696000
  occulter: { name: string; radiusKm: number; distanceFromSourceKm: number };
                                                       // "Moon", 1737, 1.496e8
  target: { name: string; radiusKm: number; distanceFromOcculterKm: number;
            distanceRangeKm?: [number, number] };      // "Earth", 6371, 384400,
                                                        // [363300, 405500] perigee..apogee
  showPenumbra?: boolean;   // draw the penumbra (diverging) cone too; default true
  caption?: string;
  source_?: string;         // NB: `source` is taken by the light source above;
                            // the citation field is `source` at the viz level —
                            // resolved by nesting (see example). Use `sourceCite`.
  sourceCite?: string;      // citation (the standard viz `source` line)
}
```

> **Schema note (a real ambiguity, resolved here):** every viz kind carries a
> top-level `source` citation field (CANON §7), but this kind's data ALSO has a
> light `source` (the Sun). To avoid the collision the citation field for this
> kind is **`sourceCite`**, and the light source is the nested `source` object.
> The component maps `sourceCite` → the standard `.px-viz` source line. Flag
> for the implementer: do not wire `data.source` (the Sun object) into the
> citation slot.

```yaml
# example payload (the Sun–Moon–Earth totality coincidence)
source:   { name: "Sun",  radiusKm: 696000 }
occulter: { name: "Moon", radiusKm: 1737, distanceFromSourceKm: 149600000 }
target:
  name: "Earth"
  radiusKm: 6371
  distanceFromOcculterKm: 384400
  distanceRangeKm: [363300, 405500]
showPenumbra: true
caption: "The Moon's shadow tapers to a point 374,000 km away — and the Earth sits 384,000 km off. Totality only when the Moon rides closer than average."
sourceCite: "NASA eclipse geometry; lunar distance IMCCE"
```

**Data flags with visual consequences (CANON §7):**
- **Radial vs longitudinal scale differ (always).** Distances (150 M km,
  384,400 km) and radii (696,000 km, 1,737 km) cannot share one linear scale on
  a card — the true umbra half-angle is 0.27°, so a to-scale cone would be an
  invisible needle. The component draws the cone with its **half-angle
  exaggerated for visibility** (≈ 3.6° displayed vs 0.27° true — see the
  correction below) but keeps the ONE quantity that carries the story exact:
  the **axial length ratio**, so the target body sits at its true fraction of
  the umbra length (Earth at 102.7 % of the tip distance — *just past* the tip,
  which IS the annular-at-mean result). It AUTO-RENDERS the chip
  `` cone angle exaggerated · length-ratio true · baseline compressed ``.
  *(Corrected 2026-07-06: the original claimed `` cone angle true `` and §4
  asserted the half-angle "renders at its real value". It cannot — §4 fixes
  BOTH the occulter display radius `OCC_PX = 26 px` AND the tip position at
  `x ≈ 560`, which over-determines the geometry and forces the displayed
  half-angle to `atan(26/410) = 3.63°`, i.e. 13.6× the true 0.266°. The cone
  angle is exaggerated; the honest chip now says so, and the length ratio — the
  quantity the "tip falls short" story actually depends on — is what stays
  true.)*
- **Angular-diameter inset is 1:1.** The two-disc inset (§4) showing θ_occulter
  vs θ_source IS drawn to a shared true angular scale (that comparison is the
  point and must not be distorted) — no chip needed; it carries its own
  degree labels.

## 4. Geometry spec

**The physics (`kepler.ts` helpers, mirror `physics/orbital-mechanics.md` §8):**

- `umbraConeLength(rBody, rSun, dSun) = dSun · rBody / (rSun − rBody)` — the
  distance from the occulter to the umbra tip.
- `angularDiameter(radius, distance) = 2·atan(radius / distance)` (returns rad;
  format as degrees for labels).
- Umbra **half-angle** `γ = atan((rSun − rBody) / dSun)` (the cone's taper rate;
  equivalently `rBody / umbraLength`).
- Umbra **radius at the target's distance** `d`:
  `r_umbra(d) = rBody · (1 − d / umbraLength)` — positive ⇒ umbra still a
  shadow disc of that radius; ≤ 0 ⇒ the tip is short of the target (annular).
- Penumbra half-angle `γ_p = atan((rSun + rBody) / dSun)` (diverging).

**Worked anchors (COMPUTABLE — recompute with the example):**
- `umbraConeLength(1737, 696000, 1.496e8) = 1.496e8·1737 / (696000 − 1737)
  = 2.599e11 / 694263 ≈ **374,300 km**` (the sheet's ~374,000).
- `angularDiameter(1737, 384400) = 2·atan(0.004518) ≈ 0.009036 rad = **0.518°**`
  (Moon, at mean distance).
- `angularDiameter(696000, 1.496e8) = 2·atan(0.004652) ≈ 0.009305 rad =
  **0.533°**` (Sun). Ratio 0.518/0.533 = **0.972** — the Moon is on average
  slightly *too small*, so annular is marginally more common than total; but
  both ≈ 0.53°, which is why totality is possible AT ALL. **This near-equality
  is the figure's whole argument.**
- Umbra radius at mean lunar distance 384,400 km:
  `r_umbra = 1737·(1 − 384400/374300) = 1737·(−0.02698) ≈ **−47 km**` (NEGATIVE
  → the tip falls ~10,000 km short → annular at mean distance).
- At perigee 363,300 km: `r_umbra = 1737·(1 − 363300/374300) = 1737·0.02939
  ≈ **+51 km** → umbra ground disc ≈ 102 km wide → TOTAL`. The
  `distanceRangeKm` band is drawn precisely because the sign of this number
  flips across it — that flip is the story.

**The main figure (SVG, viewBox `0 0 720 420`):**
- **The occulter** at left-center `(150, 210)`, a filled `--ink` @ 0.9 disc
  scaled so its radius = `OCC_PX = 26 px` (a fixed display size — the occulter
  anchors the scale). Mono label `{occulter.name}` above.
- **The display construction (stated exactly, so it is reproducible and its
  one distortion is named).** Fix TWO display anchors and derive the rest:
  (a) occulter display radius `OCC_PX = 26 px`; (b) umbra tip at display
  distance `TIP_PX = 410 px` along the axis (tip at `x = 150 + 410 = 560`).
  The **axial scale** is then `k = TIP_PX / umbraLength` px per km (example:
  `k = 410 / 374 300 ≈ 1.095e-3`); every axial distance uses `k`, so the target
  sits at its true fraction of the umbra length. The **displayed cone
  half-angle** is `γ_display = atan(OCC_PX / TIP_PX) = atan(26/410) = 3.63°` —
  this is **exaggerated 13.6× vs the true `γ = 0.266°`** (unavoidable: fixing
  both a visible occulter and a readable tip position over-determines the
  angle). The exaggeration is declared by the §3 chip; the length ratio it
  trades away accuracy for is preserved. *(Corrected 2026-07-06: replaces the
  original claim that γ "renders at its real value" — it does not.)*
- **The light direction:** the Sun is OFF-FRAME left; draw two `--accent`
  @ 0.5 converging rays entering from the left edge along the umbra cone's
  displayed edges (slope `= tan γ_display`, meeting the occulter's two edge
  points). A small `→ Sun` mono tag at the left edge.
- **The umbra cone:** a filled `--ink` @ 0.14 triangle from the occulter's two
  edge points (at `(150, 210 ± 26)`) converging to the umbra tip at `(560, 210)`.
  The umbra edges are `--ink` @ 0.42 1.5 px lines. A 1 px `--accent` dot + mono
  `umbra tip · {umbraLength} km` at the tip.
- **The penumbra cone** (if `showPenumbra`): diverging `--ink` @ 0.07 fill at
  half-angle `γ_p`, behind the umbra.
- **The target body:** a `--accent-alt` (amber) disc centered at
  `(150 + k·distanceFromOcculterKm, 210)` — its AXIAL position uses `k` (true
  fraction of the umbra length). Its **radius uses a separate body-scale**
  `b = OCC_PX / rOcculter` px per km, so `rTarget_px = min(b · rTarget, 64)`;
  this draws the occulter and the target on ONE consistent size scale (Earth's
  honest size is `26 · 6371/1737 ≈ 95 px`; it is **clamped to 64 px** so it
  clears the top-right angular inset and does not bury the tip callout — when
  the clamp bites, the amber body carries a small mono `~true size` tick so the
  clamp is not read as the real ratio). Only the target clamps; the occulter
  anchors the scale at 26 px. **Placement rule:** the tip callout leader and the
  `→ Sun` tag route to the free margin *below* the axis; the angular inset stays
  in the top-right and the clamped target's top edge (`210 − 64 = 146`) sits
  clear of the inset (bottom ≈ 120). *(Corrected 2026-07-06: the original sized the target by
  the AXIAL scale `k · rTarget ≈ 7 px`, which drew Earth SMALLER than the
  26 px Moon — inverting the true 3.7× size ratio. Body radii now share the
  occulter's body-scale `b`; positions still use the axial `k`. Note the two
  scales differ — that is the "baseline compressed" trade the §3 chip already
  declares.)* If `distanceRangeKm` is present, draw the target's position as a
  **band**: the amber body at mean distance, with two faint `--ink` @ 0.22 ring
  outlines at the perigee/apogee axial positions and a `--accent` bracket
  labeled `perigee — apogee` — the band that straddles the umbra tip.
- **The verdict-at-tip callout:** a Fraunces-italic 13 px `--accent-deep`
  annotation stating the geometric result at mean distance — "tip falls ~10,000
  km short — annular" — with a leader to the tip/target gap. (This is the
  figure's editorial landing, CANON §5 in-viz callout role.)

**The angular-diameter inset (SVG, top-right, ~200×120 px, TRUE 1:1 angular
scale):** two concentric-ish discs on a shared angular ruler — an `--accent-alt`
disc at θ_occulter and an `--accent` @ 0.4 ring at θ_source, sized by their real
angular diameters on ONE scale (so 0.518° vs 0.533° render as *almost the same
size*, the point). Mono labels `{occulter.name} {θ}°` / `{source.name} {θ}°`.
This inset is the "why totality is possible" proof and is never compressed.

- **CSS-3D tilt shell:** the whole figure sits in a `core/Tilt.astro`
  `.px3d-tilt` surface — pointer-tilt ±6° max (the shared mechanic), giving the
  cone a subtle sense of pointing out of the page toward the target. Tilt is
  cosmetic depth only; it changes NO data and is disabled under reduced-motion
  and no-JS (the flat SVG is complete). `touch-action: pan-y`.
- **375px:** the inset moves BELOW the main figure (it would overlap the cone at
  narrow width); the main figure keeps its full geometry; labels ≥ 9.5 px; the
  tilt is disabled ≤ 640px (touch devices — tilt-on-scroll is noise) and the
  figure renders flat.

## 5. Motion spec (names from motion.md)

- Entrance (once, on scroll-in, `html.js`-gated) — **with explicit start
  offsets so overlapping stages fit the 1.6 s budget** (the `power-flow` §5
  convention): occulter `reveal` (start 0, 220 ms) → the two Sun rays `sweep`
  (start 150 ms, dashoffset draw left→right, 550 ms) → umbra cone `grow`
  (start 450 ms, scaleX 0→1 from the occulter toward the tip, 550 ms; overlaps
  the rays' tail) → penumbra `reveal` (start 700 ms, 220 ms) → target body
  `settle` (start 800 ms, 300 ms) → the angular-diameter inset discs `settle`
  (start 900 ms, scale 1.15→1, 220 ms, the two discs staggered 80 ms so the
  near-equality registers) → the tip callout `reveal` (start 1240 ms, 140 ms)
  last. Full sequence ends at **1380 ms ≤ 1.6 s**. *(Start offsets added
  2026-07-06: the original bare `→` chain summed to ~1.74 s serial — 700 ms
  rays + 600 ms grow + settle + inset 220 + 80 stagger + callout 140 — over the
  motion.md ≤1.6 s budget; overlapping starts bring it in.)*
- **`scan` (the ONE ambient motion, space-sanctioned telemetry, ≤ 0.12
  opacity):** a 1 px `--accent` line sweeps along the umbra axis from occulter
  to tip, 6 s linear, ≤ 0.12 — the "shadow projecting" feel, the space
  telemetry motif (worlds/space.md). At most one scan; the penumbra does not
  scan.
- Pointer-tilt (`core/Tilt.astro`, event-driven): ±6° `--px3d` transform on
  pointer move; not an entrance, not counted against the ambient budget
  (user-initiated). Off under reduced-motion / touch / no-JS.
- Reduced-motion / no-JS: everything painted final and flat (no tilt); `scan`
  static (or omitted). This IS the print plate.
- **Composed still:** the full cone geometry + target + range band + inset +
  tip callout, flat, from the front. The fallback and reduced-motion frame are
  this.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| occulter disc | `--ink` @ 0.9 |
| Sun rays / umbra-axis scan | `--accent` @ 0.5 / `--accent` @ ≤0.12 (scan) |
| umbra cone fill / edges | `--ink` @ 0.14 / `--ink` @ 0.42 |
| penumbra cone | `--ink` @ 0.07 |
| target body | `--accent-alt` (amber — the second body, worlds/space.md) |
| distance range band + rings | `--ink` @ 0.22 + `--accent` bracket |
| angular inset: occulter / source discs | `--accent-alt` @ 1.0 / `--accent` @ 0.4 |
| tip callout (editorial) | `--accent-deep`, Fraunces italic |
| labels | mono, paper halo (`paint-order`) |

Cyan = the light/shadow projection (the signal); amber = the target body (the
second object). The near-equal inset discs deliberately use the two accents so
the reader reads them as "these two things are the same size" — the coincidence
in color. No third hue.

## 7. Fallback design (first-class)

The SVG is build-time static; the tilt + reveal + scan are the only JS, all
gated so **no-JS = the final flat painted figure** (per §5). This IS the print
plate.

- Below the figure, the **geometry ledger** (`.vz-legend` / `.tel` rows, the
  AT-readable data source): `umbra length {umbraLength} km`,
  `{occulter.name} angular Ø {θ_occ}°`, `{source.name} angular Ø {θ_src}°`,
  `{target.name} distance {d} km` (+ `range {min}–{max} km` when given),
  `umbra radius at target {r_umbra} km ({TOTAL|ANNULAR})`. Every number the
  figure encodes is stated. Rows ≤ 5 visible; the range/penumbra detail rows
  collapse behind "show all geometry" past 5 (amendment 3).
- Nothing is dropped: cone length, both angular diameters, the target distance
  band, and the total/annular verdict are all in the no-JS page.

## 8. Interaction spec

- **Minimal interaction:** the only pointer affordance is the cosmetic
  `core/Tilt.astro` tilt (depth, not data — CANON §9: interaction reveals
  *more*, and here there is no "more" to reveal, so it stays decorative and
  fully optional). No hover tooltips, no state chips, no scrubber.
- This keeps the interactive budget at ZERO data-controls — correct for a kind
  whose entire content is a single true-scale still. (Contrast `transfer-window`,
  which has a genuine variable to explore; an eclipse cone has none — the
  geometry is fixed; the range band already shows the one varying quantity.)
- Keyboard/AT: the figure is `role="img"` with an `aria-label` summarizing the
  coincidence ("Umbra cone of the Moon reaching 374,000 km, Earth at 384,000 km
  — totality only near perigee"); the geometry ledger carries the numbers. The
  Tilt shell is `aria-hidden` decoration and not focusable.
- `touch-action: pan-y` on the tilt surface (vertical scroll sacred); tilt
  disabled on touch (≤ 640px) so it never competes with scroll.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "The dark cone is the full shadow the
  body casts; it tapers to a point at a real distance, and totality only
  happens where the target sits inside that point before it closes."
- **how** (ExpandModal): "Compare the two discs top-right — the Sun and the
  Moon look almost exactly the same size from Earth, which is the only reason a
  total eclipse can happen. The cone shows how narrowly the shadow reaches."
- Caption guidance: state the coincidence/near-miss claim ("tapers to a point
  374,000 km away — and Earth sits 384,000 km off"), never restate the form.
- **Text budget** (≤80 words at rest — `REVIEW-2026-07-05.md` amendment 3,
  designated "§4.5" but not yet merged into `CANON.md`): at rest ≈ 3 body labels + tip label + inset's
  2 θ-labels + range bracket label + tip callout (~6 words) + caption (~26) +
  plain (~30) + the exaggerated/length-ratio/compressed chip — under 80; the
  total/annular verdict and umbra-radius number live in the collapsible ledger.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 160 (2 cones + rays + 2 bodies + range band/rings + inset 2 discs + labels + callout) |
| CSS-3D | one `core/Tilt.astro` shell — shared `.px3d-*`, no per-component 3D code |
| JS | shared `Reveal` + `Tilt` islands only; no per-component script |
| `data` payload | ≤ 1.5 KB |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (flat still IS the deliverable) ·
      375px no overflow (inset drops below, tilt off), labels ≥ 9.5px ·
      reduced-motion still (flat, no tilt, scan static) · token grep (cyan +
      amber declared; no hex literals) · caption + source + plain (`sourceCite`
      wired to the source line, NOT the Sun object) · no-JS = flat figure +
      ledger (view-source) · payload degradation (missing `distanceRangeKm` →
      single target position, no band; missing `showPenumbra` → true) · prefix
      `px-eclp` unique
- [ ] `umbraConeLength(1737, 696000, 1.496e8) ≈ **374,300 km**` and the tip
      label + ledger show it (recompute from the sheet)
- [ ] `angularDiameter(1737, 384400) ≈ **0.518°**` and
      `angularDiameter(696000, 1.496e8) ≈ **0.533°**`; the inset renders the two
      discs at a shared 1:1 angular scale so they appear nearly equal (ratio
      0.972) — NOT distorted
- [ ] Umbra radius at mean lunar distance = `1737·(1 − 384400/374300) ≈ **−47
      km**` → ledger reads ANNULAR at mean; at perigee 363,300 km → `≈ +51 km`
      → TOTAL; the range band straddles the tip so both sides of the flip are
      visible
- [ ] The `cone angle exaggerated · length-ratio true · baseline compressed`
      chip renders (main figure); the angular inset carries NO chip (it is true
      1:1). The displayed cone half-angle is `atan(26/410) ≈ 3.63°`, the true
      `γ ≈ 0.266°` — the chip's "exaggerated" is honest, NOT "true"
- [ ] Bodies share ONE size-scale `b = OCC_PX/rOcculter`: the target renders
      `min(b·rTarget, 64)` px (Earth honest 95 px → clamped 64 px with the
      `~true size` tick), NOT the axial-scale `k·rTarget` (which would draw
      Earth ~7 px, smaller than the 26 px Moon — inverted and wrong)
- [ ] All body/tip/inset labels fit inside their viewBoxes at the example
      geometry — none clipped (the exemplars' label-fit bug class); the clamped
      64 px target clears the top-right inset (target top 146 vs inset ~120)
- [ ] `scan` runs at ≤ 0.12 along the umbra axis, one only; reduced-motion
      freezes/omits it; the pointer-tilt works on desktop, is off on touch and
      under reduced-motion, and changes no data
- [ ] The `source`/`sourceCite` collision is handled: the Sun object never
      appears in the citation line; `sourceCite` does
- [ ] Geometry ledger carries umbra length, both angular diameters, target
      distance (+ range), and the umbra-radius / total-vs-annular verdict;
      collapses past 5 rows; readable with zero JS

---

*Registry duties when implementing (P6 — NOT now): add `eclipse-cone` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `umbraConeLength`/`angularDiameter` helpers to `kepler.ts` with unit tests,
add the `EXPLAIN` entry (`src/lib/explainers.ts`), add the `catalog.md` block
(in `SECTION_KINDS` order; `npm run check:catalog` must pass), document the
`px-eclp` prefix in `src/components/AGENTS.md` §4/§2, and add a worked example
to `2026-06-03-space-showcase`. Do NOT edit `SECTION_KINDS` or `catalog.md` at
blueprint time.*
