# Blueprint — `plate-motion` (earth · WebGL · extends the shared globe)

> The tectonic engine, made visible: the real country Earth with plate
> boundaries inked over it and, at a scatter of points, the **surface-velocity
> arrows** each plate's Euler rotation actually produces — long where the plate
> races, vanishing at its rotation pole. Drag to spin the globe; the arrows are
> the mechanism, not decoration. "Why the ground moves where it moves."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `plate-motion` |
| World | earth |
| Tier | WebGL (extends the shared country globe; velocity-vector layer + boundary polylines) |
| Component | `src/components/topic/earth/PlateMotion.astro` |
| Scene module | `src/scripts/viz3d/scenes/plateMotion.ts` |
| Shared code reused | `scenes/globe.ts` — `buildCountryGlobe`, `latLon`, `makeLabels`, `dragController` (the globe IS the base; this scene adds two layers) |
| CSS prefix | `px-plmot` |
| Flagship reference | `dataGlobe.ts` (the canonical "extends globe" scene — copy its builder shell, occluder, drag, labels, dispose) |

## 2. What it shows / when to use

Where each tectonic plate is heading and how fast, as velocity arrows computed
from real Euler poles, over the plate-boundary network. The reader learns the
*direction and rate field* of plate motion — convergence, divergence, the
still point at a pole.

- **USE WHEN:** the story is about tectonic motion of ≥2 plates and the dossier
  has real Euler poles (`lat_p, lon_p, ω °/Myr`, e.g. from a NNR-MORVEL / PB2002
  reference frame). Plate-boundary polylines ship as the one-time asset
  `public/geo/plates.json` (geodesy §4).
- **DON'T USE:**
  - the shape of ONE region's terrain (→ `terrain-relief`);
  - earthquakes by depth/magnitude (→ `quake-depth`);
  - a geo-located point value (→ `data-globe`);
  - a flat per-country choropleth (→ `region-map`).
  - a single plate with no motion contrast — the field needs ≥2 plates to make
    the "fast here, still there" point.
- **Pairs with:** `wide` standalone, or `layout: split` as hero for a
  plate-tectonics issue (no setState — it's a single-state field; the story is
  carried by drag + the arrows). Never adjacent to another WebGL kind (CANON §2).

## 3. Data schema

```ts
interface PlateMotionData {
  plates: Array<{
    name: string;              // "Indian Plate"
    pole: { lat: number; lon: number; omega: number }; // Euler pole: deg, deg, °/Myr (geodesy §4)
    color?: string;            // per-plate arrow tint — data encoding, allowed (CANON §6 exemption, ≤2 beyond accent → see §6)
    samples?: Array<{ lat: number; lon: number }>;  // where to draw arrows for THIS plate
                               // (points inside the plate). If omitted, the component
                               // seeds a coarse graticule of in-bbox points (see §4).
    bbox?: [number,number,number,number]; // [lonW,latS,lonE,latN] — used to auto-seed samples if none given
  }>;
  boundaries?: string;         // URL of the boundary polyline asset; default '/geo/plates.json'
                               // shape: { lines: [ [ [lon,lat], … ], … ], kinds?: ('div'|'conv'|'trans')[] }
  maxVel_mmyr?: number;        // arrow-length normalizer; default = max computed |v| across all samples
  caption?: string;
  source?: string;             // REQUIRED. e.g. "NNR-MORVEL56 Euler poles (Argus et al. 2011)"
}
```

```yaml
# example payload (India–Eurasia convergence)
plates:
  - name: "Indian Plate"
    pole: { lat: 50.4, lon: -3.3, omega: 0.544 }   # NNR-MORVEL56, °/Myr
    color: "#a04922"                                  # USGS brown
    bbox: [68, 6, 90, 30]
  - name: "Eurasian Plate"
    pole: { lat: 48.9, lon: -106.5, omega: 0.223 }
    color: "#2d6a4f"                                  # forest green
    bbox: [40, 30, 100, 60]
  - name: "Arabian Plate"
    pole: { lat: 48.8, lon: -8.5, omega: 0.559 }
    color: "#1a4a36"
    bbox: [35, 12, 60, 33]
boundaries: "/geo/plates.json"
caption: "The Indian plate drives north-northeast at ~50 mm/yr — the collision that is still raising the Himalaya."
source: "NNR-MORVEL56 Euler poles (Argus, Gordon & DeMets 2011); PB2002 boundaries"
```

**Data flags with visual consequences:** none require an honesty chip — the
arrows are to a stated scale (the legend carries `arrow = {maxVel} mm/yr`);
velocities are real, not compressed. If `maxVel_mmyr` is set below the true max
(clipping long arrows), the legend chip reads `arrows clipped at {maxVel} mm/yr`.

## 4. Geometry spec

### Velocity field (mirrors `geodesy.md §4` 1:1)

For a sample point **r** (unit vector via `latLon(THREE, lat, lon, 1)`
normalized) and a plate's Euler pole **p̂** (`latLon(THREE, pole.lat, pole.lon,
1)` normalized, `ω` °/Myr):
- Angular distance point↔pole: `Δ = acos(clamp(p̂·r̂, −1, 1))`.
- **Magnitude:** `|v| = 111.2 · ω · sin(Δ)` **mm/yr** (geodesy §4).
- **Direction (tangent):** `v̂ = normalize(p̂ × r̂)` — perpendicular to the
  great circle toward the pole, in the local tangent plane. (Right-handed:
  this points in the direction of plate motion for ω>0, consistent with the
  physics sheet.)
- The arrow is drawn in the tangent plane at **r** on the globe surface,
  length ∝ `|v| / maxVel`.

**Acceptance anchor (COMPUTABLE — the sheet's own check):**
`ω = 1 °/Myr`, sample at `Δ = 90°` from the pole ⇒ `|v| = 111.2·1·sin(90°) =
111.2 mm/yr` exactly (geodesy §4 check line). Second anchor: a sample AT the
pole (`Δ = 0`) ⇒ `|v| = 111.2·ω·sin(0) = 0` — the arrow vanishes at the
rotation pole (the "still point"). A reviewer recomputes both by hand. Third,
data-real: Indian plate (ω=0.544) at a point 80° from its pole ⇒
`111.2·0.544·sin(80°) = 111.2·0.544·0.985 = 59.6 mm/yr` (Himalaya-front order
of magnitude — matches the caption's ~50 mm/yr).

### Sample seeding (when `samples` omitted)

For a plate with `bbox=[lonW,latS,lonE,latN]`: seed a lat/lon lattice at
`GRID_DEG = 8°` spacing clipped to the bbox (≤ ~40 points/plate); this is a
coarse illustrative field, not a boundary-accurate mask. If `samples` given,
use them verbatim. **Cap total arrows at 120** across all plates (budget §10) —
if seeding overflows, widen `GRID_DEG` until ≤120.

### Scene (extends the globe)

- **Base:** `buildCountryGlobe(THREE, group, colors, R=1.4, disposables)` —
  identical to `dataGlobe.ts` (occluding paper sphere + graticule + coastlines,
  R=1.4). Camera FOV 40, `camera.position.set(0, 0.3, 5.0)`, lookAt origin
  (the `dataGlobe` framing — verified to fit the globe, R7). `dragController`
  (globe.ts) with startTilt 0.2; idle auto-rotate at the globe's `yaw += 0.0018`
  when not dragging (this IS the earth ambient-rotation budget item, world spec
  §Motion — `orbitIdle`).
- **Boundary polylines:** fetch `boundaries` JSON; for each line, a polyline of
  `latLon(THREE, lat, lon, R*1.004)` points (just proud of the coastline layer)
  as `LineBasicMaterial` `--ink` @ 0.5, 1.5px (heavier than country borders'
  0.42 — the boundaries are the primary structure here). If `kinds` present,
  boundary type is encoded by **dash**, not color (CANON two-color discipline):
  divergent = solid, convergent = dashed 0.03/0.02, transform = dotted
  0.008/0.02. One merged geometry per dash class (≤3 draw calls). Boundaries
  loaded lazily like the country geo; scene renders arrows immediately, adds
  boundaries when the asset resolves.
- **Arrows:** each = a short great-circle-tangent **shaft** + a 2-triangle
  **head**, built in the point's tangent basis:
  - basis at r̂: `t̂ = v̂` (motion direction), `n̂ = r̂` (up/out of surface).
  - shaft: from `P0 = r̂·R·1.006` to `P1 = P0 + t̂·L`, where
    `L = 0.05 + 0.18·(|v|/maxVel)` scene units (min stub so slow arrows are
    still visible; max 0.23). `LineBasicMaterial` in the plate `color` @ 0.9,
    2px. Slightly lifted (`·1.006`) so arrows float above the boundary/coast
    lines.
  - head: two short segments from `P1` back at ±150° in the tangent plane,
    length `0.32·L` — a simple open V arrowhead (line-art, no filled cone;
    CANON §4). Same material.
  - One MERGED line geometry for ALL shafts+heads of a plate (per-plate draw
    call so per-plate color works: ≤ N_plates draw calls, ≤ 6 typical).
- **Labels (`makeLabels`):** one per plate → `data` priority 1: the plate
  `name` (Fraunces italic 15px, earth register) anchored at the plate's bbox
  centroid on the surface (`latLon` at R·1.02). Major-country labels from
  `loadGeo()` at priority 0 (faint), exactly as `dataGlobe` adds them — grounds
  the globe in place (motif 2). The shared layer hides far-side labels + de-collides.
- **375px:** same scene; arrow `L` scaled ×0.9 to avoid crowding; labels thin to
  plate names only (drop the faint country labels below 420px via a priority-0
  cull in the component). Drag target = the whole canvas (≥44px trivially).

## 5. Motion spec (names from motion.md)

- Boot: the globe fades/rotates in (existing globe behavior). Arrows `settle`
  in — each arrow's `L` grows `0 → final` via `p += (target−p)·min(1, 8·dt)`
  (motion.md `settle`), staggered by `|v|` so the FASTEST arrows extend first
  (the eye is pulled to the racing plates), whole sequence ≤ 1.2 s. Boundary
  polylines `sweep` (dashoffset draw) over 1000 ms as they resolve (earth §Motion:
  `sweep` for tracks/contours drawing).
- Ambient: the globe's idle `orbitIdle` rotation (`yaw += 0.0018` when not
  dragging) is the ONE continuous motion (motion.md continuous-budget). Arrows
  do NOT animate their length continuously — they are a static field once
  settled (the motion they depict is geological; animating it would lie about
  the timescale).
- `hoverLift`: picked arrow (nearest sample, §8) — its shaft brightens to @ 1.0
  and a mono readout tooltip appears; no globe dimming.
- **Composed still (reduced-motion / print / fallback):** the globe at its
  start orientation (India-facing, `yaw` seeded so the story plate is toward the
  camera), all boundaries drawn, all arrows at full length, plate labels on. The
  fallback SVG IS this still — an orthographic hemisphere (§7).

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| country coastlines/borders (globe) | `--ink` @ 0.42 (globe default) |
| graticule | `--ink` @ 0.07 (globe default) |
| occluding sphere | `--paper` @ 1.0 (globe default) |
| plate boundaries | `--ink` @ 0.5, 1.5px (dash encodes div/conv/trans) |
| velocity arrows | per-plate `color` from data @ 0.9 (hover → 1.0) |
| plate name labels | `--ink` (Fraunces italic), country labels `--ink` @ 0.66 |
| tooltip | shared `.viz3d__tip` |

**Data-color budget (CANON §4 "at most two data-encoding colors beyond the
accent"):** the per-plate `color`s are the data encoding. Discipline: the
example uses the earth palette family (green `--accent`, brown `--accent-alt`,
deep `--accent-deep`) so even 3 plates read as ONE world; the drafter is
instructed (catalog NOTE) to draw plate colors from the earth token set, not
invent hues. `--accent-alt`/`--accent-deep` reach the scene via the
`data._altColor`/`data._deepColor` convention (same as `terrain-relief` §6 —
the component reads them from computed style and injects them), OR the author
supplies literal hexes in `color` (the CANON §6 data-encoding exemption). No
boundary uses color to encode type — dash does that.

## 7. Fallback design (first-class — the print plate)

Build-time SVG in the Astro frontmatter: an **orthographic hemisphere**
centered on the story region (the example: centered ~78°E, 25°N so India +
the collision front face front), radius 320, viewBox `0 0 720 720`,
`overflow: visible`:
- Coastlines drawn with the same `world-atlas` Natural Earth 50m two-pass land
  render used by `region-map` (geodesy §6; `readFileSync` from node_modules per
  `src/components/AGENTS.md §5`), clipped to the visible hemisphere, `--ink` @
  0.35.
- Plate boundaries `--ink` @ 0.5 with the same dash-by-kind encoding.
- Velocity arrows: for each sample, compute `|v|` and `v̂` with the SAME §4
  formulas (a small pure `plateVelocity(pole, lat, lon)` helper the component
  imports — one function, ≤15 lines, unit-testable), project the tangent
  direction onto the orthographic plane, draw a shaft + open V-head in the plate
  color, length ∝ `|v|/maxVel · 60px`. Arrows on the far hemisphere are dropped.
- Plate names (Fraunces italic) at centroids; a mono **velocity scale key**
  (motif 4): `→ = {maxVel} mm/yr`; the coordinate margin (motif 2) with the
  hemisphere's center lat/lon.
- Below: the **field-note legend** (motif 3, AT-readable): one row per plate —
  name · Euler pole (lat,lon,ω) · peak |v| in its samples. Collapses past 5
  rows (REVIEW amendment 3).
- Encodes the full field: a no-JS reader sees which plates move which way, how
  fast, over the real boundaries. The print atlas page.

## 8. Interaction spec

- **Drag** = spin the globe (globe.ts `dragController`, pitch clamp ±0.9).
  Wheel is NOT bound by the base globe controller (dataGlobe doesn't zoom) —
  keep it that way: **no zoom** here (the globe is framed to fit; R7). If a zoom
  is later wanted, adopt `makeOrbitControls` — but v1 is drag-only, matching the
  sibling globe scenes. `touch-action: pan-y`. Hint chip: `drag to spin`.
- **NO state chips** (single-state field — respects CANON §9 one-control-max by
  using ZERO controls beyond drag). This keeps it distinct from the two
  setState scenes (chamber, terrain-relief).
- **Hover/tap** an arrow → `hoverLift` + tooltip:
  `<b>{plate}</b><br>{v_mmyr} mm/yr → {bearing}°<br>{latH} {lonH}`, where
  `{latH}` = `{|lat|}°`+(`lat≥0?'N':'S'`) and `{lonH}` = `{|lon|}°`+(`lon≥0?'E':'W'`)
  — hemisphere derived from sign so a Southern/Western plate reads `°S`/`°W`
  *(Corrected 2026-07-06: hardcoded `°N °E` mis-labels any plate sampled in the S
  or W hemisphere, e.g. the Nazca or Pacific plates)*; bearing = the compass
  azimuth of `v̂` in the local tangent frame (0°=N, 90°=E), computed from the
  tangent direction. Picking targets = a small invisible pick-sphere (radius
  0.03) at each arrow's `P0`; nearest hit within screen tolerance wins.
- Keyboard/AT: canvas `aria-hidden`; the fallback hemisphere + field-note legend
  carry the data; the plain line explains the form. No focusable in-scene
  controls (drag is pointer-only; AT users read the plate; the ⤢ expand is the
  one focusable control).

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts`): "Each arrow shows which way a
  tectonic plate is moving at that spot and how fast — longer means faster, and
  the arrows shrink to nothing at the point the plate pivots around. The heavy
  lines are the plate boundaries."
- **how** (ExpandModal): "Drag to spin the globe. Hover any arrow for the exact
  speed and direction of the plate there."
- Caption guidance: state the motion claim ("the Indian plate drives
  north-northeast at ~50 mm/yr"), name the plates/region; never restate what an
  arrow is. Source names the Euler-pole reference frame (CANON §7).

## 10. Performance budget

| Budget | Cap |
|---|---|
| Arrows | ≤ 120 total (seed cap §4) |
| Vertices (WebGL) | ≤ 45k (globe coastlines dominate ~20k + arrows ≤ 120×4 + boundaries) |
| Draw calls | ≤ 16 (globe 3 + boundaries ≤3 dash classes + ≤6 per-plate arrow meshes + labels DOM) |
| Instancing | not required (≤120 arrows; per-plate merged geometry) |
| `data` payload (inline JSON) | ≤ 4 KB (poles + samples; boundaries are the fetched asset) |
| Extra assets | `public/geo/plates.json` ≤ 60 KB (geodesy §4, one-time, PB2002 simplification) + the shared `/geo/countries-110m.json` (already fetched by all globe scenes) |

WebGL scene is its own lazy chunk; registry line:
`'plate-motion': { load: () => import('./plateMotion') }`. Reuses the globe
geo fetch (cached by `loadGeo()`), so no extra topojson cost when a globe scene
already loaded on the page (though CANON §2 forbids two WebGL adjacent anyway).

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette (still reads as a labelled
      motion field over a globe) · 375px no overflow, labels ≥ 9.5px · reduced-
      motion still = fallback hemisphere · token grep (`--ink`/`--accent`/
      `--accent-alt`/`--accent-deep`/`--paper` + data `color` hexes only) ·
      caption + source + plain · WebGL boot/dispose/chunk-isolation/DPR≤2/RAF-pause
      · payload degrades (missing `samples` ⇒ auto-seed; missing `boundaries`
      asset ⇒ arrows still render) · `px-plmot` prefix unique
- [ ] Velocity anchor: `ω=1°/Myr` at `Δ=90°` ⇒ `|v|=111.2 mm/yr`; at the pole
      (`Δ=0`) ⇒ `|v|=0` (arrow vanishes) — a unit test on the shared
      `plateVelocity` recomputes both
- [ ] Data anchor: Indian plate (ω=0.544) 80° from its pole ⇒ ~59.6 mm/yr;
      arrow length = `0.05 + 0.18·(59.6/maxVel)` scene units
- [ ] Arrows point in the tangent direction `normalize(p̂×r̂)` and shrink toward
      the Euler pole; the still point (near the pole) shows stub/no arrows
- [ ] Boundaries render heavier than coastlines; type encoded by DASH not color
      (grep: no per-boundary color literal)
- [ ] Hovering an Indian-plate arrow shows "Indian Plate — {v} mm/yr → {bearing}°"
      with a plausible NNE–NE bearing (~15–45°) — the azimuth of `normalize(p̂×r̂)`
      in the local tangent frame; a sample at 78°E,30°N (the Himalaya front)
      recomputes to ≈44° / ≈53 mm/yr. *(Corrected 2026-07-06: the band was
      ~15–35°, which a correctly-computed front-of-collision arrow (≈44°) would
      FALSE-FAIL; India's real convergence azimuth spans ~N15–45°E west→east
      across the front.)*
- [ ] Globe idle-rotates when not dragged (the ONE ambient motion); arrows do
      NOT continuously animate their length once settled
- [ ] Fallback hemisphere: coastlines + boundaries + per-plate arrows + velocity
      key + field-note legend, readable with zero JS (view-source)
- [ ] The `plateMotion` chunk + three chunk absent from `dist/` pages without
      the kind

---

*Registry duties when implementing (P6, NOT here): add `plate-motion` to
`SECTION_KINDS`, dispatch in `SectionBody.astro`, add the `EXPLAIN` default, add
the `'plate-motion'` line to `scenes/index.ts`, add the catalog block
(`check:catalog` must pass), document `px-plmot` in `src/components/AGENTS.md`
§4, add a worked example to `2026-06-03-earth-showcase`, and commit
`public/geo/plates.json`. This blueprint edits NO config/catalog/component.*
