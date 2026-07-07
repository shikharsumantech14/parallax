# Blueprint — `terrain-relief` (earth · WebGL · FLAGSHIP + world signature)

> The earth world's hero and its identity anchor: the story's real landscape,
> rebuilt from a Digital Elevation Model as **contour lines and ridgelines** —
> a surveyor's plate lifted into three dimensions. No shaded solid, no
> satellite skin: the terrain IS the line-art. Drag to orbit the massif, and a
> single chip re-inks it at a truer or a more dramatic vertical scale.
> "The reader holds the actual ground, drawn the way the atlas draws it."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `terrain-relief` |
| World | earth |
| Tier | WebGL (line-art displaced mesh + build-time marching-squares fallback + one setState chip) |
| Component | `src/components/topic/earth/TerrainRelief.astro` |
| Scene module | `src/scripts/viz3d/scenes/terrainRelief.ts` |
| Shared math | `src/scripts/viz3d/terrain.ts` (NEW pure module — feeds BOTH the scene AND the component's build-time fallback SVG, `hemicycle.ts`-style: DEM decode + marching-squares contours + ridgeline extraction) |
| CSS prefix | `px-trrlf` |
| Flagship reference | `chamber.ts` (shared-math + setState-bridge patterns) + `dataGlobe.ts` (SceneBuilder/label/disposables patterns); NOT the globe scenes (no country sphere here) |

## 2. What it shows / when to use

The physical shape of the place the story is about — a mountain, a rift, a
crater, a coastline's bathymetry — as contour rings and ridgelines you can
tilt and read. The reader learns the *form of the ground*, not a value on it.

- **USE WHEN:** the story hinges on real topography of ONE bounded region
  (≤ ~600 km across) and the dossier can supply (or the operator can commit)
  a per-issue DEM tile per `geodesy.md §5`: Everest–Khumbu, the East African
  Rift shoulder, a caldera, a submarine canyon. Vertical exaggeration is
  named and honest.
- **DON'T USE:**
  - values placed at coordinates on the whole Earth (→ `data-globe`);
  - a value shaded per country/zone on a flat map (→ `region-map`);
  - a single vertical cross-section by band (→ `elevation-profile`, earth) or
    along a route (→ `elevation-trek`, travel) — those are 2-D and cheaper;
  - stratigraphy DOWN a core (→ `core-sample`).
  - Global relief "because it looks cool": the DEM budget (≤128×128) can't
    resolve a continent — bound the tile to the actual subject.
- **Pairs with:** `layout: split` as the issue hero — chapter copy scrolls
  while the massif holds and a chapter may `setState('exaggerate')`;
  `wide` standalone. Never adjacent to another WebGL kind (CANON §2). Only
  ONE loud section per act — this is it.

## 3. Data schema

```ts
interface TerrainReliefData {
  dem: string;              // REQUIRED. URL of the per-issue DEM JSON asset,
                            // committed under public/geo/<slug>-dem.json.
                            // Shape = geodesy.md §5 (decoded by terrain.ts):
                            //   { w,h: grid dims ≤128; latN,latS,lonW,lonE: bbox deg;
                            //     minM,maxM: elevation range m; q: uint16[w*h] row-major }
  place: string;            // REQUIRED. "Khumbu Himal" — the coordinate-margin title (earth §Signature motif 2).
  exaggeration?: number;    // vertical ×EX at rest. Default 1.8. Range clamp [1, 12].
                            // ALWAYS renders the caption chip `vertical ×{EX}` (geodesy §5, CANON §7).
  exaggerateTo?: number;    // the setState('exaggerate') target EX. Default 5. Clamp [EX_rest+1, 12].
                            // Omit to disable the chip (single-state card).
  contourInterval_m?: number;  // spacing between contour rings, m. Default: auto =
                               // niceStep((maxM−minM)/12) → one of {10,20,25,50,100,200,250,500,1000}.
                               // STATED in the legend (earth §Signature motif 4).
  peaks?: Array<{           // optional named summits/points to pin (≤6). Placed by lat/lon into the tile.
    name: string;           // "Everest"
    lat: number; lon: number;
    elev_m?: number;        // if omitted, sampled from the DEM at that cell (bilinear)
  }>;
  seaLevel?: boolean;       // draw the 0 m contour as the accent (water datum) line. Default: true if minM<0.
  caption?: string;
  source?: string;          // REQUIRED (CANON §7). e.g. "NASA SRTM 30 m, resampled"
}
```

```yaml
# example payload (Khumbu Himal — Everest massif)
dem: "/geo/2026-07-everest-khumbu-dem.json"
place: "Khumbu Himal · 27.99° N, 86.93° E"
exaggeration: 1.8
exaggerateTo: 5
contourInterval_m: 250
peaks:
  - { name: "Everest",   lat: 27.9881, lon: 86.9250, elev_m: 8849 }
  - { name: "Lhotse",    lat: 27.9617, lon: 86.9330, elev_m: 8516 }
  - { name: "Nuptse",    lat: 27.9667, lon: 86.8894, elev_m: 7861 }
  - { name: "Pumori",    lat: 28.0147, lon: 86.8297, elev_m: 7161 }
seaLevel: false
caption: "The Khumbu massif at true horizontal scale — five of the fourteen 8,000 m peaks in one 60 km frame."
source: "NASA SRTM 30 m (SRTMGL1 v3), resampled to 128×128"
```

**Data flags with visual consequences (auto-chips, CANON §7):**
- `vertical ×{exaggeration}` — ALWAYS rendered (there is no honest EX=1 default;
  even EX=1 renders `vertical ×1` so the reader is never left guessing). When
  live and toggled to `exaggerateTo`, the chip updates to the live EX.
- `contour {contourInterval_m} m` — rendered in the legend, not the caption.

## 4. Geometry spec

### `terrain.ts` (the shared math — mirrors `geodesy.md §5` 1:1)

Pure, no THREE import. Three exported functions; the scene AND the Astro
frontmatter fallback both call them so the two renderings are the same surface.

**(a) `decodeDEM(json) → DEM`**
```
elev_m(col,row) = minM + q[row*w + col] / 65535 * (maxM − minM)     // geodesy §5
```
Returns `{ w, h, latN, latS, lonW, lonE, minM, maxM, elevAt(col,row), elevLL(lat,lon) }`.
`elevLL` bilinearly samples (for `peaks[].elev_m` when omitted). Grid cell
fractional index: `fx = (lon−lonW)/(lonE−lonW)*(w−1)`, `fy = (latN−lat)/(latN−latS)*(h−1)`
(**note latN is row 0** — north at the top, matching the atlas).

**(b) `contourPolylines(dem, interval_m) → Contour[]`** — marching squares.
- Levels — the **interior** multiples of `interval` strictly between the tile's
  extremes: `L = (floor(minM/interval)+1)·interval … (ceil(maxM/interval)−1)·interval`,
  iterating `L += interval`. Both ends are OPEN: `L = minM` is a degenerate
  all-above plateau (no crossing) and `L = maxM` a single-point touch (no
  crossing) — a marching-squares level needs cells that both exceed and fall
  below it, which neither endpoint has. *(Corrected 2026-07-06: the previous
  `ceil(minM/interval)·interval … floor(maxM/interval)·interval` produced the
  CLOSED range — e.g. minM=0, maxM=1000, interval=500 gave {0, 500, 1000}, three
  levels, contradicting this section's own worked spike anchor of exactly ONE
  level (500). The interior-open form yields {500}. Verified across edge cases
  incl. minM<0 sea-level tiles, non-multiple minM, and both-multiple ranges.)*
- Standard 16-case marching squares on each grid cell; linear interpolation of
  the crossing point along each edge. Emit each level's segments, chained into
  polylines where endpoints coincide (tolerance 1e−4 of a cell).
- Each `Contour = { level_m, isIndex: (level_m % (interval_m*5) === 0), pts: [{col,row}] }`
  in **grid space** (fractional col/row); the consumer maps to world/plane.
  `isIndex` = every 5th contour is an **index contour** (heavier, labelled) —
  standard USGS convention (earth world register).

**(c) `ridgelines(dem) → Ridge[]`** — the signature ridge extraction.
- A grid vertex is a **ridge point** if it is a local max along EITHER the row
  OR the column 1-D profile (elev ≥ both orthogonal neighbours on one axis AND
  strictly ≥ one of them) AND its elevation is in the top 55% of the tile's
  range (`elev ≥ minM + 0.45·(maxM−minM)`) — this culls valley noise, keeps
  the crest network. Chain adjacent ridge points (8-neighbour) into polylines
  ≥ 4 pts; drop shorter fragments. Returns grid-space polylines.

**Acceptance anchor (COMPUTABLE — a reviewer recomputes by hand):**
Given a 3×3 test DEM `w=3,h=3, minM=0, maxM=1000, q=[0,0,0, 0,65535,0, 0,0,0]`
(a single central spike), `interval_m = 500`:
- `elevAt(1,1) = 0 + 65535/65535·1000 = 1000 m`; all edge cells = 0 m. ✓
- Interior levels (the corrected (b) range): `(floor(0/500)+1)·500 = 500 …
  (ceil(1000/500)−1)·500 = 500` ⇒ `500` only (`0` = minM and `1000` = maxM are
  both excluded as open endpoints — neither has a crossing). ⇒ `contourPolylines`
  returns exactly ONE level (`500 m`), forming ONE closed loop of 4 segments around cell centre
  (1,1): crossings at the four edge-midpoints (0.5,1),(1,0.5),(1.5,1),(1,1.5)
  in grid coords. Loop length = 4 segments. **Check: exactly 1 contour, closed,
  4 pts.**
- `ridgelines`: vertex (1,1) is a local max on both axes and 1000 ≥ 0+0.45·1000
  = 450 ⇒ ridge point; no 8-neighbour qualifies (all 0) ⇒ polyline length 1 <4
  ⇒ **dropped. Ridges = [] for a lone spike** (correct: a single point is not a
  ridge). A reviewer can verify both by hand.

### Scene (world space; Y-up)

- **Plane mapping.** The DEM tile maps to a centered plane in the XZ plane:
  `x = (col/(w−1) − 0.5) · SPAN_X`, `z = (row/(h−1) − 0.5) · SPAN_Z`,
  `y = (elev_m − minM)/(maxM − minM) · SPAN_Y · EX`.
  Constants: `SPAN_X = 3.0` scene units always; `SPAN_Z = 3.0 · aspect` where
  `aspect = (latN−latS) / ((lonE−lonW)·cos(midLat))` clamped to [0.5, 2.0] (true
  ground aspect Z/X = ground-N-S / ground-E-W, Mercator-free — the cos shrinks
  the E-W denominator because a degree of longitude is physically shorter than a
  degree of latitude away from the equator, so a 1°×1° tile near 28°N reads
  taller than wide, aspect ≈ 1.13). *(Corrected 2026-07-06: the cos(midLat)
  factor was in the numerator (`(latN−latS)·cos(midLat)/(lonE−lonW)`), which
  INVERTED the correction — it gave aspect ≈ 0.88 for that tile, squashing the
  massif the wrong way. cos must divide the E-W span; this matches the §7
  fallback scale-bar `d = R_E·Δλ·cos(midLat)` which correctly shrinks E-W
  distance. The clamp [0.5,2.0] does not catch the error — both 0.88 and 1.13
  survive it.)*; `SPAN_Y = 0.9`. So at `EX=1.8`, the Everest tile's relief height
  = `(8849−(−200 say minM))/… · 0.9 · 1.8` — see the worked check below.
- **EX is the ONLY thing setState changes** — `SPAN_Y·EX`. Horizontal scale is
  fixed and TRUE (that's the honesty: only the vertical lies, and the chip says
  by how much).
- **Contour lines** (the primary read): for each `Contour`, a `LineBasicMaterial`
  polyline sampling its grid pts through the plane mapping at their true `elev_m`.
  Index contours (`isIndex`) `--ink` @ 0.42, 1.4px; intermediate `--ink` @ 0.22,
  1px. One merged `BufferGeometry` per opacity class (2 draw calls, not per-loop).
- **Ridgelines** (the signature): `--accent-alt` (USGS contour brown) @ 0.85,
  1.6px, drawn slightly proud (`y += 0.006`) so they sit ON the crests above the
  contour rings. One merged geometry (1 draw call). **Earth §Signature motif 1
  (contours) + the brown ridge = the world's native language, in 3-D.**
- **The 0 m / sea contour** (if `seaLevel`): the `level_m===0` contour drawn in
  `--accent` (green = the living datum / water) @ 0.9, 1.6px, replacing its ink
  contour.
- **Base slab.** A paper-colored occluder: a thin extruded skirt from the tile's
  perimeter down to `y = −0.12` + a flat `--paper` underside plane, so far-side
  contours are hidden and the massif reads solid from any angle (the globe's
  occluder trick, adapted to a plane — CANON §4 "depth = paper occluder").
  No walls, no grid floor.
- **Frame ring.** A 1px `--ink` @ 0.30 rectangle around the plane's base
  perimeter (the survey plate's edge) + mono corner coordinate ticks handled by
  the label layer (motif 2).
- **Camera.** PerspectiveCamera FOV 42, initial position `(0, 2.05, 2.75)·zoom`,
  lookAt `(0, 0.28, 0)` (looking slightly down onto the massif, standing off one
  corner reads as a survey oblique). `makeOrbitControls`: `startPitch 0.62`,
  `minZoom 0.7` (whole tile + margin in frame — R7 fit-the-content rule),
  `maxZoom 2.4`, **`autoRotate: false`** (earth register: the ground does not
  spin; idle = a ≤±3° dolly sway `yaw = 0.045·sin(tMs/11000)` added in `frame()`
  when not dragging — same discipline as chamber's sway).
- **375px:** identical scene; label layer thins to `peaks` + 2 corner coords
  (drop intermediate contour labels — see §Labels); min pick target enforced by
  a 44px invisible hit-plane over the whole mount (peaks pick via nearest-vertex,
  §8), not tiny meshes.

**Labels (via `makeLabels`, the shared HTML layer):**
- `peaks[]` → `data` priority 2: `{name}` in Fraunces italic 15px (earth
  specimen-label register) with `· {elev_m} m` mono suffix; anchor at the peak
  vertex + `y` offset `0.05`.
- Four corner coordinates (motif 2) → `country` priority 0, mono 9.5px:
  the tile's NW/NE/SW/SE lat·lon formatted `{|lat|}°`+(`lat≥0?'N':'S'`) `{|lon|}°`+(`lon≥0?'E':'W'`)
  → e.g. `27.99°N 86.89°E` for the Everest tile, `33.42°S 70.65°W` for an Andean
  caldera. **This same sign-aware formatter is used everywhere a coordinate is
  printed** (corner coords, peak tooltip §8, fallback plate §7). *(Corrected
  2026-07-06: the hardcoded `°N °E` form mislabels Southern/Western tiles — and
  §2 explicitly lists a submarine canyon / caldera as valid subjects, which may
  sit at negative lat/lon.)*
- Index-contour elevation labels: at most 4, on the longest index loops, mono
  9.5px `{level} m` — priority 1; suppressed at 375px. The shared layer's
  greedy de-collision (56×13px) handles overlap; data (peaks) win.

### Worked scale anchor (COMPUTABLE)

Everest tile, `minM = 200, maxM = 8849` (SRTM Khumbu), `EX = 1.8`:
- Everest vertex normalized height `= (8849−200)/(8849−200) = 1.0` ⇒
  `y = 1.0 · SPAN_Y(0.9) · 1.8 = 1.62` scene units.
- A 5000 m ridge: `(5000−200)/8649 = 0.555` ⇒ `y = 0.555·0.9·1.8 = 0.899`.
- Toggle `setState('exaggerate')` → `EX=5`: Everest `y = 1.0·0.9·5 = 4.5`;
  the chip must read `vertical ×5`. A reviewer recomputes `0.9·EX·normHeight`
  for any vertex and matches the rendered Y.

## 5. Motion spec (names from motion.md)

- Boot: contours `sweep` **from low to high** — each contour's `stroke`
  (dashoffset len→0 emulated in-scene by revealing polyline vertices over time)
  draws in over 1000 ms, staggered by elevation band so the massif "fills from
  the valleys up" (earth §Motion: `sweep` for contours drawing). Ridgelines
  `sweep` last (250 ms after contours start), 700 ms — the crest inks over the
  rings. Total entrance ≤ 1.6 s (motion.md stagger budget).
  Implementation: per-line `drawn` fraction lerped `0→1`; geometry drawRange
  advanced (`setDrawRange`).
- `stateSwitch` (rest EX ↔ `exaggerateTo`): every vertex Y lerps
  `y += (yTarget − y)·min(1, 8·dt)` (motion.md `settle` curve, ≤ 600 ms). No
  hard cut. The caption chip cross-fades its number in the same window.
- `hoverLift`: picked peak's label scales ×1.15 + a 1px accent-alt tick drops
  from the label to the vertex; **no scene dimming** (line-art on paper —
  dimming reads as flicker; deviation recorded here on purpose, matching
  solar-system's rationale).
- Idle sway: the ≤±3° dolly (§4) is the ONE ambient motion (motion.md
  continuous-budget: one ambient scene motion) — it is NOT `orbitIdle` yaw
  drift (the ground doesn't spin), so `autoRotate:false` and the sway is added
  manually.
- **Composed still (reduced-motion / print / fallback):** the full massif at
  rest EX, all contours + ridgelines + sea line drawn, peaks + corner coords
  labelled, camera at the start oblique. The build-time fallback SVG IS this
  still (§7). Reduced-motion never boots WebGL (runtime bails) — the fallback
  is the frame.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| index contours (every 5th) | `--ink` @ 0.42, 1.4px |
| intermediate contours | `--ink` @ 0.22, 1px |
| ridgelines (the signature) | `--accent-alt` @ 0.85, 1.6px (USGS contour brown — earth §Materials "brown = the geologic") |
| sea / 0 m contour (if present) | `--accent` @ 0.9, 1.6px (green = the living datum / water) |
| base occluder slab | `--paper` @ 1.0 (+ `--ink` @ 0.30 skirt edge) |
| survey-plate frame | `--ink` @ 0.30, 1px |
| peak labels | `--ink` (Fraunces italic) + mono elev `--accent-deep` |
| corner coords / contour labels | `--ink` @ 0.66 mono (label layer) |
| tooltip | shared `.viz3d__tip` |

`--accent-alt` (brown) and `--accent-deep` are NOT in `SceneColors` (which is
`{accent, ink, paper, muted}` — runtime.ts). **The component reads them from
the mount's computed style and injects them into the `data` payload** as
`data._altColor` / `data._deepColor` (documented convention; the scene falls
back to `colors.muted` if absent). This keeps the runtime's 4-color contract
intact while letting the earth brown through. Only these tokens + the two data
lines. No per-contour rainbow — elevation is read by the contour spacing and
the index/intermediate weight split, never by hue (CANON §4 two-color
discipline; the ONE fixed non-theme encoding here is none — brown/green are
tokens).

## 7. Fallback design (first-class — the print plate)

Build-time SVG rendered in the Astro frontmatter from the SAME `terrain.ts`
(`decodeDEM` + `contourPolylines` + `ridgelines`), a **top-down orthographic
contour map** (the classic surveyor's plate — no 3-D tilt needed to carry the
form):
- viewBox `0 0 720 H`, `H = 720·(SPAN_Z/SPAN_X)` (true ground aspect, §4),
  `overflow: visible` for label bleed.
- Contour polylines mapped grid→SVG: `sx = PAD + col/(w−1)·(720−2·PAD)`,
  `sy = PAD + row/(h−1)·(H−2·PAD)` (`PAD = 24`). Index contours `--ink` @ 0.42
  1.4px, intermediate @ 0.22 0.8px, sea line `--accent` @ 0.9 — identical
  weights to the scene.
- Ridgelines `--accent-alt` @ 0.85 1.4px over the contours.
- Peaks as 3px `--accent-deep` dots + Fraunces-italic name + mono `{elev} m`
  (specimen label), paper halo (`paint-order: stroke`).
- The **coordinate margin** (motif 2): the four corner lat·lon in mono 9.5px
  outside the frame; a **survey scale bar** (motif 4) bottom-left: a ruled tick
  bar labelled in km, length computed from the tile's ground width
  `d = R_E·Δλ·cos(midLat)·π/180` (R_E = 6371 km, geodesy §1) → e.g. a 20 km bar.
- Below the SVG, the **specimen legend / field-note table** (AT-readable data
  source, earth §Signature motif 3): `contour interval {interval} m · vertical
  ×{EX}` line, then one row per peak — name · elev · lat·lon. Collapses behind a
  "show all" past 5 rows (REVIEW amendment 3 / component text budget).
- This plate encodes EVERYTHING except the obliqueness — a reader with no JS
  gets the complete topographic map with named summits, contour interval, scale
  bar, and coordinates. It is not a degradation; it is the atlas page.

## 8. Interaction spec

- **Drag** = orbit the massif (pitch clamp ±0.9 via `makeOrbitControls`;
  startPitch 0.62 reads as an oblique survey view). **Wheel/pinch** = zoom
  (clamps §4). `touch-action: pan-y` (mandatory — vertical page scroll wins).
  Hint chip (fades in when live): `drag to tilt · scroll to zoom`.
- **ONE control (CANON §9 one-control-max):** the vertical-exaggeration chip.
  When `exaggerateTo` is set, ONE mono pill button top-right of the mount:
  label toggles `VERTICAL ×{EX_rest}` ⇄ `VERTICAL ×{exaggerateTo}`,
  `aria-pressed` reflects state. Click sets `data-viz3d-state` = `'rest'` /
  `'exaggerate'` on the mount; the runtime state-chip bridge (runtime.ts, lines
  130–137) mirrors it into `handle.setState`. No slider, no second chip.
  44×44 min target.
- **Hover/tap a peak** → `hoverLift` + tooltip:
  `<b>{name}</b><br>{elev_m} m · {lat}°N {lon}°E{note?}`. Picking: the mount's
  full-area hit-plane raycast returns a UV; the scene maps UV→nearest peak
  within a 0.12-UV radius (peaks are the only pick targets — contours are not
  hoverable, keeping the read clean). Elevation formatted with thousands sep.
- Keyboard/AT: the chip is a real focusable button; the canvas is `aria-hidden`;
  the fallback plate + specimen legend carry the full data; the plain line
  explains the form. State-chip keyboard order: chip is the single tabbable
  control in the card (before the ⤢ expand button).

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts`): "The real shape of the ground,
  drawn as contour rings and ridgelines — each ring joins points at the same
  height, and the brown lines trace the crests. The vertical scale is stretched
  to make the relief legible; the caption says by how much."
- **how** (ExpandModal): "Drag to tilt the massif, scroll to zoom. Press the
  ×-scale button to swap between the true and the exaggerated height. Hover a
  peak for its elevation."
- Caption guidance: state the topographic claim ("five 8,000 m peaks in one
  60 km frame"), name the region, NEVER restate the form (the plain line owns
  "what a contour is"). Source names the DEM provider + resolution (CANON §7).

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices (WebGL) | ≤ 60k (contours ≤ ~40k pts across all loops at 128² + ridges ≤ 8k + occluder skirt) |
| Draw calls | ≤ 12 (2 contour classes + 1 ridge + sea + occluder + frame + labels are DOM) |
| Instancing | not used (line geometry, merged) |
| SVG nodes (fallback) | ≤ 900 (contour polylines are the bulk — decimate the fallback to ≤ 40 loops if a dense DEM overflows; scene keeps full) |
| `data` payload (inline JSON) | ≤ 4 KB (the DEM is NOT inlined — it's the fetched asset) |
| Extra assets | per-issue DEM JSON `public/geo/<slug>-dem.json` ≤ 40 KB gzipped (geodesy §5), committed with the issue; NO globe topojson fetch (this scene has no country sphere) |

WebGL scene is its own lazy chunk via the scenes registry (`scenes/index.ts`
line to add: `'terrain-relief': { load: () => import('./terrainRelief') }`) —
no eager three import; DEM fetched inside the scene builder on boot.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test (the still reads as a
      topo map) · 375px no overflow, labels ≥ 9.5px, chip target ≥ 44px ·
      reduced-motion still = the fallback plate · token grep (only `--ink`,
      `--accent`, `--accent-alt`, `--accent-deep`, `--paper` — no hex literals) ·
      caption + source + plain all render · WebGL boots on scroll-in, disposes on
      pagehide, three-chunk absent from non-3D pages, DPR ≤ 2, RAF pauses
      off-screen · payload degrades (missing `peaks` ⇒ no pins, still renders;
      missing `dem` ⇒ component renders nothing/skips) · `px-trrlf` prefix
      unique (grep `meta.css`, `base.css`, `src/components/`)
- [ ] `terrain.ts` spike anchor: the 3×3 `q=[0,0,0,0,65535,0,0,0,0]` DEM at
      `interval 500` returns exactly ONE closed 4-pt contour and ZERO ridges
      (worked in §4) — a unit test recomputes it
- [ ] Scale anchor: at `EX=1.8` the Everest vertex sits at `y=1.62` scene units
      (`(8849−200)/8649·0.9·1.8`); at `EX=5`, `y=4.5` — recomputable per vertex
- [ ] `vertical ×{EX}` chip ALWAYS renders (even at EX=1); toggling to
      `exaggerateTo` updates the chip number live and the geometry `settle`s
      (≤ 600 ms, no hard cut) — reduced-motion makes it a hard swap
- [ ] Index contours (every 5th) render heavier (0.42) than intermediates
      (0.22); the ridgelines are brown `--accent-alt` and sit above the rings
- [ ] Contour interval + vertical-×EX appear in the legend/field-note table
- [ ] Hovering "Everest" shows "Everest — 8,849 m · 27.99°N 86.93°E"
- [ ] Horizontal scale is TRUE and never changes with the chip (only Y scales);
      the fallback scale bar's km length matches `R_E·Δλ·cos(midLat)`
- [ ] Fallback plate: top-down contour map + ridgelines + peaks + scale bar +
      corner coords + specimen legend, fully readable with zero JS (view-source)
- [ ] The `terrainRelief` chunk + three chunk are absent from `dist/` pages
      without the kind

---

*Registry duties when implementing (P6, NOT here): add `terrain-relief` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` default
(`src/lib/explainers.ts`), add the `'terrain-relief'` line to
`src/scripts/viz3d/scenes/index.ts`, add the catalog block (`docs/design/catalog.md`
— `npm run check:catalog` must pass), document `px-trrlf` in
`src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-earth-showcase`. This blueprint edits NO config/catalog/component.*
