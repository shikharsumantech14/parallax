# Blueprint — `storm-track` (earth · WebGL · extends the shared globe)

> A tropical cyclone's real life, drawn on the globe: the best-track polyline
> from formation to dissipation, each segment coloured by the storm's intensity
> at that hour on the fixed Saffir-Simpson ramp, riding above the country Earth.
> Drag to follow it across the basin; the colour ramp is a declared,
> non-themeable encoding — the one place the earth accent stands aside for a
> standard the reader already knows. "The whole storm, from a tropical wave to
> landfall, in one arc."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `storm-track` |
| World | earth |
| Tier | WebGL (extends the shared country globe; best-track polyline layer + intensity ramp) |
| Component | `src/components/topic/earth/StormTrack.astro` |
| Scene module | `src/scripts/viz3d/scenes/stormTrack.ts` |
| Shared code reused | `scenes/globe.ts` — `buildCountryGlobe`, `latLon`, `makeLabels`, `dragController`; `kepler.ts` — `greatCircle` (for smoothing sparse fixes into a fair arc) |
| CSS prefix | `px-storm` |
| Flagship reference | `routeGlobe.ts` (arc-on-globe pattern) + `dataGlobe.ts` (builder shell/labels/dispose) |

## 2. What it shows / when to use

One cyclone's track over the globe, intensity-coloured, formation to
dissipation. The reader learns *where the storm went and how strong it was at
each point* — the intensification, the peak, the landfall.

- **USE WHEN:** the dossier has a best-track table for ONE (or a few compared)
  tropical cyclone(s): timestamped fixes with lat/lon and intensity (max
  sustained wind, kt, or a category). Sources: IBTrACS, NHC/JTWC best-track.
- **DON'T USE:**
  - a static per-region climatology value (→ `region-map`); geo point values
    (→ `data-globe`); plate motion (→ `plate-motion`);
  - a single station's time series (→ a charted kind);
  - a within-track detail that needs a flat inset (→ an SVG kind) — the globe is
    for basin/ocean scale.
  - many storms as a density climatology — a handful of named tracks is the
    ceiling (label + colour legibility); beyond ~4 it's a heat map, not this.
- **Pairs with:** `wide` standalone, or `layout: split` as hero for a hurricane
  issue (single-state; the story is carried by drag + the ramp; NO setState).
  Never adjacent to another WebGL kind (CANON §2).

## 3. Data schema

```ts
interface StormTrackData {
  storms: Array<{
    name: string;               // "Hurricane Katrina (2005)"
    fixes: Array<{
      t: string;                // ISO timestamp of the fix (6-hourly typical)
      lat: number; lon: number;
      wind_kt: number;          // max sustained wind, knots — drives the Saffir-Simpson category
      // category is DERIVED from wind_kt (see §4) — never author it, so the ramp can't lie.
      landfall?: boolean;       // mark this fix as a landfall point
    }>;
  }>;
  windScale?: 'kt';             // documentary: winds are knots (Saffir-Simpson is defined in kt). Default 'kt'.
  smooth?: boolean;             // fair the polyline through great-circle interpolation between fixes. Default true.
  caption?: string;
  source?: string;              // REQUIRED. e.g. "NOAA IBTrACS v4 / NHC best track"
}
```

```yaml
# example payload (Hurricane Katrina, abbreviated best track)
storms:
  - name: "Hurricane Katrina (2005)"
    fixes:
      - { t: "2005-08-23T18:00Z", lat: 23.1, lon: -75.1, wind_kt: 30 }   # TD
      - { t: "2005-08-25T00:00Z", lat: 26.0, lon: -79.0, wind_kt: 70, landfall: true }   # Cat 1, FL landfall (Corrected 2026-07-06: added the missing landfall flag — the comment, the §4 anchor and the caption all treat this as Katrina's Florida landfall, but the flag was absent so no ring would render)
      - { t: "2005-08-27T00:00Z", lat: 24.4, lon: -84.0, wind_kt: 100 }  # Cat 3
      - { t: "2005-08-28T18:00Z", lat: 26.9, lon: -89.6, wind_kt: 150 }  # Cat 5 peak
      - { t: "2005-08-29T12:00Z", lat: 30.2, lon: -89.6, wind_kt: 110, landfall: true } # Cat 3 LA landfall
      - { t: "2005-08-30T18:00Z", lat: 37.0, lon: -87.0, wind_kt: 25 }   # remnant low
smooth: true
caption: "Katrina crossed Florida a modest Category 1, exploded to Category 5 over the warm Loop Current, then struck Louisiana at Category 3."
source: "NOAA IBTrACS v4 / NHC best track"
```

**Data flags with visual consequences:** none require an honesty chip — the
Saffir-Simpson ramp is a DECLARED fixed encoding (§6), stated in the legend, not
themeable. Category is derived from wind, so the colour cannot misrepresent the
data.

## 4. Geometry spec

### Intensity → category (the Saffir-Simpson thresholds — derived, never authored)

`wind_kt` → category (NHC standard, knots):
```
< 34  kt → TD  (tropical depression)
34–63 kt → TS  (tropical storm)
64–82 kt → 1
83–95 kt → 2
96–112 kt → 3
113–136 kt → 4
≥137 kt → 5
```
A pure `saffirSimpson(wind_kt) → { cat, color }` helper (≤15 lines) the
component AND the fallback import — the single source of the ramp.

**Acceptance anchor (COMPUTABLE — recompute from the example):**
Katrina's peak fix `wind_kt: 150` ⇒ `150 ≥ 137` ⇒ **Category 5** ⇒ colour
`#b3005e` (§6 ramp). The FL-landfall fix `wind_kt: 70` ⇒ `64 ≤ 70 ≤ 82` ⇒
**Category 1** ⇒ `#ffd24d`. The LA-landfall fix `wind_kt: 110` ⇒ `96 ≤ 110 ≤
112` ⇒ **Category 3** ⇒ `#ff8c00`. A reviewer recomputes each threshold by hand.

### Track geometry (on the shared globe)

- **Base:** `buildCountryGlobe(THREE, group, colors, R=1.4, disposables)` —
  identical to `dataGlobe`/`plate-motion`. Camera FOV 40, position
  `(0, 0.3, 5.0)`, lookAt origin; on boot, seed `dragController`'s `yaw` so the
  storm's mean longitude faces the camera (the reader opens ON the storm, R7
  fit-the-subject). `dragController` startTilt 0.25.
- **Track polyline:** per storm, build the ordered fix vertices via `latLon(THREE,
  lat, lon, R·1.02)` (just above the coastline layer). If `smooth`, interpolate
  each adjacent pair with `greatCircle(a, b, 8)` (kepler.ts §2) and lift the arc
  slightly off the sphere by `1 + 0.02·sin(πt)` per segment (the routeGlobe
  bulge, small — storms hug the surface). **Each SEGMENT is coloured by the
  category of its STARTING fix** (`saffirSimpson(fix.wind_kt).color`), so the arc
  changes colour as the storm intensifies. Built as ONE `BufferGeometry` with a
  per-vertex color attribute + a `LineBasicMaterial({ vertexColors: true })`
  (1 draw call per storm), line width 2.5px.
- **Fix markers:** a small sphere (radius `0.018 + 0.03·(wind_kt/160)`, so
  stronger = bigger) at each fix in its category colour @ 1.0; landfall fixes get
  a 1.5px `--ink` @ 0.7 ring (the moment of landfall, motif). Spheres share a
  merged geometry where possible; ≤ ~60 fixes total.
- **Peak marker:** the max-wind fix of each storm gets a `glowSprite`
  (helpers.ts) in its category colour, size 0.14 — the storm's peak intensity,
  the one glow (the sanctioned glow, CANON §4; NO bloom).
- **Labels (`makeLabels`):** storm `name` (Fraunces italic 15px) at the first
  fix, `data` priority 2; a `PEAK · Cat {n} · {wind} kt` mono label at the peak
  fix, priority 2; `LANDFALL` mono labels at landfall fixes, priority 1;
  major-country labels from `loadGeo()` at priority 0 (grounds the basin, motif
  2). The shared layer hides far-side + de-collides.
- **375px:** same scene; drop the country labels (priority-0 cull <420px), keep
  name + peak + landfall; track width 2px; the whole canvas is the drag target
  (≥44px).

## 5. Motion spec (names from motion.md)

- Boot: the track `sweep`s — the polyline draws from formation to dissipation
  (`setDrawRange` advancing over 1400 ms, `--ease`), fix markers `settle` in as
  the draw front passes each (`p += (target−p)·min(1,8·dt)`); the peak glow
  `reveal`s LAST when the draw reaches the peak — so the reader watches the storm
  intensify along the arc (earth §Motion: `sweep` for tracks drawing). Total
  ≤ 1.6 s (motion.md budget).
- Ambient: the globe's idle rotation (`dragController` `yaw += 0.0018` when not
  dragging — the ONE continuous motion, motion.md continuous-budget). The peak
  glow may `pulse` (opacity 0.55↔1, 2.4 s) — **at most ONE pulsing element per
  viewport** (motion.md): if multiple storms, only the single highest-wind
  storm's peak pulses; others are static glows. The track itself does NOT
  animate after the sweep (the storm's motion is history, not live — animating a
  moving dot would imply a live feed; the arc is the record).
- `hoverLift`: picked fix marker brightens + its tooltip; no globe dimming.
- **Composed still (reduced-motion / print / fallback):** the full track(s)
  drawn, intensity-coloured, all fix markers + landfall rings + peak glow(s),
  labels on, globe at the storm-facing orientation. The fallback SVG IS this
  still — an orthographic basin view (§7).

## 6. Color spec

**FIXED DATA ENCODING (non-themeable, declared per CANON §6 — like the climate
blue→red ramp): the Saffir-Simpson intensity ramp.** The track/markers use
these hexes regardless of world theme; the legend states the ramp explicitly.

| Category | Wind (kt) | Hex | Reason |
|---|---|---|---|
| TD | < 34 | `#5aa9e6` | sub-storm, cool blue |
| TS | 34–63 | `#54d669` | tropical storm, green |
| Cat 1 | 64–82 | `#ffd24d` | Saffir-Simpson standard yellow |
| Cat 2 | 83–95 | `#ffa600` | amber |
| Cat 3 | 96–112 | `#ff8c00` | major-hurricane orange |
| Cat 4 | 113–136 | `#ff4d3d` | red |
| Cat 5 | ≥ 137 | `#b3005e` | deep magenta (the standard's most-intense band) |

| Non-encoded element | Token @ opacity |
|---|---|
| globe coastlines/borders | `--ink` @ 0.42 (globe default) |
| graticule | `--ink` @ 0.07 (globe default) |
| occluding sphere | `--paper` @ 1.0 (globe default) |
| landfall rings | `--ink` @ 0.7, 1.5px |
| storm name / peak / landfall labels | `--ink` (Fraunces italic + mono) |
| tooltip | shared `.viz3d__tip` |

The ramp is the ONE non-theme encoding; everything structural stays in `--ink`/
`--paper`. The earth accent (`--accent` green) is deliberately NOT used on the
track — it would collide with the ramp's TS green and confuse the reader
(green-means-storm here, not green-means-datum). The legend swatch is the
authority.

## 7. Fallback design (first-class — the print plate)

Build-time SVG in the Astro frontmatter: an **orthographic basin view**
centered on the storm's mean lat/lon (the example: ~28°N, 84°W → the Gulf +
Florida face front), radius 320, viewBox `0 0 720 720`, `overflow: visible`:
- Coastlines via `world-atlas` Natural Earth 50m two-pass land (geodesy §6;
  `readFileSync` from node_modules per `src/components/AGENTS.md §5`), clipped to
  the visible hemisphere, `--ink` @ 0.35.
- The track polyline projected orthographically, each segment coloured by its
  starting fix's Saffir-Simpson colour (SAME `saffirSimpson` helper), 2.5px; fix
  markers as category-coloured dots sized by wind; landfall dots ringed `--ink`;
  the peak fix as a larger dot + a soft radial halo (SVG `<radialGradient>` is
  fine here — it's the ONE peak marker, not a background).
- Storm name (Fraunces italic) at the first fix; `PEAK Cat {n} · {wind} kt` +
  `LANDFALL` mono labels with paper halos; the coordinate margin (motif 2) with
  the basin center lat/lon.
- **The Saffir-Simpson legend** (motif 4, the measured rule + the declared
  encoding): a swatch row TD→Cat 5 with the wind thresholds — this is mandatory
  (CANON §6: fixed encodings declared in-figure).
- Below: the **field-note track table** (motif 3, AT-readable): one row per fix
  — time · lat/lon · wind kt · category (· landfall). Collapses past 5 rows
  (REVIEW amendment 3) behind "show all track".
- Encodes the full track + intensities: a no-JS reader sees where the storm went
  and how strong it was at each fix, with the ramp legend. The print atlas page.

## 8. Interaction spec

- **Drag** = spin the globe (globe.ts `dragController`, pitch clamp ±0.9). No
  zoom in v1 (framed to fit the basin, R7 — matches the sibling globe scenes).
  `touch-action: pan-y`. Hint chip: `drag to follow the track`.
- **NO state chips** (single-state record — ZERO controls beyond drag, well
  within CANON §9 one-control-max; keeps it distinct from the setState scenes).
- **Hover/tap** a fix marker → `hoverLift` + tooltip:
  `<b>{storm}</b><br>{cat} · {wind_kt} kt<br>{date} · {latH} {lonH}{landfall: ` · landfall`}`,
  where `{latH}` = `{|lat|}°` + (`lat≥0 ? 'N' : 'S'`) and `{lonH}` = `{|lon|}°` +
  (`lon≥0 ? 'E' : 'W'`) — the hemisphere is derived from the sign so W-Pacific
  typhoons (positive lon) read `°E` and Southern-Hemisphere basins read `°S`.
  *(Corrected 2026-07-06: the template hardcoded `{lat}°N {lon}°W`, which is
  wrong for every basin this kind explicitly supports outside the North Atlantic
  — e.g. a JTWC W-Pacific typhoon at lon +135 would print `-135°W`.)*
  Picking: small invisible pick-spheres (radius 0.03) at each fix; nearest hit
  wins. The peak fix's tooltip adds `· peak intensity`.
- Keyboard/AT: canvas `aria-hidden`; the fallback basin + Saffir-Simpson legend
  + track table carry the data; the plain line explains the form. The ⤢ expand
  is the one focusable control.

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts`): "The storm's real path across
  the ocean, drawn from birth to breakup — the colour of the line is how strong
  it was at each point, from a weak depression to a top-category hurricane. The
  glowing point is its peak; the ringed points are where it hit land."
- **how** (ExpandModal): "Drag to spin the globe and follow the track. Hover any
  point on the path for the exact wind speed, category, and date."
- Caption guidance: state the track's story (intensified over warm water, struck
  at Cat 3), name the storm + year; never restate what the colour means (the
  legend + plain line own the ramp). Source names the best-track archive
  (CANON §7).

## 10. Performance budget

| Budget | Cap |
|---|---|
| Fixes (markers) | ≤ 60 total across storms |
| Storms | ≤ 4 (legibility ceiling, §2) |
| Vertices (WebGL) | ≤ 45k (globe coastlines dominate ~20k + track segments (smoothed ×8) + fix spheres) |
| Draw calls | ≤ 14 (globe 3 + ≤4 per-storm track lines + merged fix spheres + ≤4 glows + labels DOM) |
| Instancing | not required (≤60 fixes) |
| `data` payload (inline JSON) | ≤ 6 KB (best-track fixes) |
| Extra assets | the shared `/geo/countries-110m.json` (already fetched by globe scenes); NO extra per-issue asset (the track is inline data, not a fetched file) |

WebGL scene is its own lazy chunk; registry line:
`'storm-track': { load: () => import('./stormTrack') }`. Reuses the cached
`loadGeo()` globe geometry.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette (still reads as an
      intensity-coloured track on a globe with a ramp legend) · 375px no
      overflow, labels ≥ 9.5px · reduced-motion still = fallback basin ·
      token grep (structure only in `--ink`/`--paper`; the SEVEN ramp hexes are
      the ONLY literals, and they're the declared fixed encoding — every other
      color is a token) · caption + source + plain · WebGL boot/dispose/chunk-
      isolation/DPR≤2/RAF-pause · payload degrades (missing `landfall` ⇒ no
      ring; a single storm ⇒ renders fine) · `px-storm` prefix unique
- [ ] Saffir-Simpson anchor: `wind_kt 150 → Cat 5 → #b3005e`; `70 → Cat 1 →
      #ffd24d`; `110 → Cat 3 → #ff8c00` (recompute each threshold); category is
      DERIVED from wind (grep: no authored `category`/`cat` field consumed)
- [ ] The track segment colour changes with intensity along the arc (Katrina:
      blue/green early → magenta at peak → blue remnant)
- [ ] The peak fix carries the ONE glow (+ pulse only on the single strongest
      storm if multiple); fix marker size grows with wind
- [ ] Landfall fixes render the `--ink` ring; their tooltips say "landfall"
- [ ] Hovering the peak shows "Hurricane Katrina (2005) — Cat 5 · 150 kt · …·
      peak intensity"
- [ ] Globe idle-rotates when not dragged (the ONE ambient motion besides the
      single peak pulse); the track does NOT animate a moving dot after the sweep
- [ ] Fallback basin: coastlines + intensity-coloured track + fix markers +
      landfall rings + peak halo + Saffir-Simpson legend + track table, readable
      with zero JS (view-source)
- [ ] The `stormTrack` chunk + three chunk absent from `dist/` pages without the
      kind

---

*Registry duties when implementing (P6, NOT here): add `storm-track` to
`SECTION_KINDS`, dispatch in `SectionBody.astro`, add the `EXPLAIN` default, add
the `'storm-track'` line to `scenes/index.ts`, add the catalog block
(`check:catalog` must pass), document `px-storm` in `src/components/AGENTS.md`
§4, add a worked example to `2026-06-03-earth-showcase`. This blueprint edits NO
config/catalog/component.*
