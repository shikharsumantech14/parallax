# Physics sheet — geodesy & earth geometry

> Reference for the shared globe scenes (`data-globe`, `route-globe`,
> `orbit-globe` ground features, `plate-motion`, `storm-track`,
> `terminator-globe`) and `terrain-relief`. `src/scripts/viz3d/kepler.ts`
> (subsolarPoint, greatCircle) and the scene builders mirror these 1:1.

## 1. Coordinates

Lat/lon (deg) → sphere of radius `rr` — **the repo convention is the `latLon()`
helper in `src/scripts/viz3d/scenes/globe.ts` (verified 2026-07-05); every
globe scene MUST use it** rather than restating trig:
```
φ = (90 − lat)·π/180          # polar angle
θ = (lon + 180)·π/180
x = −rr·sinφ·cosθ,  y = rr·cosφ,  z = rr·sinφ·sinθ
```
(Y-up; the lon offset/negation orients world-atlas geometry correctly on the
occluding sphere. `kepler.ts greatCircle()` is frame-independent — it returns
lat/lon pairs you feed back through `latLon()`.)
Earth radius for physical quantities: `R_E = 6371 km`. Scene sphere radius is a
scene constant; altitudes scale as `r = 1 + alt_km/R_E` (orbit shells use the
log-radius mapping already in orbitGlobe — keep it).

## 2. Great circles (routes, arcs)

Between unit vectors **a**, **b**: `Δ = acos(a·b)`; slerp
`p(t) = (sin((1−t)Δ)·a + sin(tΔ)·b) / sinΔ`, t ∈ [0,1], ~64 segments.
Arc "bulge" for route aesthetics: scale p(t) by `1 + h·sin(πt)` with
`h = 0.05–0.18` proportional to Δ (existing routeGlobe treatment).
Ground distance: `d = R_E·Δ`.

## 3. Subsolar point (terminator-globe, day/night shading)

Approximate (±1° accuracy — fine for editorial):
- Day of year `N` (1–365), fractional UTC hours `H`.
- Declination: `δ = 23.44°·sin(2π·(N − 80)/365.24)`  → subsolar latitude.
- Subsolar longitude: `λ_ss = −15°·(H − 12)` (add the equation of time,
  `EoT ≈ 9.87·sin(2B) − 7.53·cos(B) − 1.5·sin(B)` minutes with
  `B = 2π(N−81)/364`, divided by 4 to get degrees, if the extra ~1° matters).
- Terminator = great circle 90° from the subsolar point. Night hemisphere
  shading: ink @ 0.28 overlay (paper-occluder trick, not a shader).

## 4. Plate motion (plate-motion)

Euler pole (lat_p, lon_p, ω °/Myr) → surface velocity at point **r**:
- direction: `v̂ = (p̂ × r̂)` normalized (p̂ = pole unit vector) — tangent,
  perpendicular to the great circle toward the pole.
- magnitude: `|v| = 111.2·ω·sin(Δ)` **mm/yr**, where Δ = angular distance
  point↔pole. (Check: ω = 1°/Myr at Δ = 90° → 111.2 mm/yr.)
- Arrows: tangent-plane vectors, length ∝ |v|, `settle` on reveal. Boundary
  polylines ship as a small static JSON (`public/geo/plates.json`, one-time
  asset ≤ 60 KB, derived from a PB2002 simplification — operator-verifiable).

## 5. Terrain (terrain-relief)

Per-issue DEM asset `public/geo/<slug>-dem.json`:
```
{ "w": 128, "h": 128, "latN": .., "latS": .., "lonW": .., "lonE": ..,
  "minM": .., "maxM": .., "q": [row-major uint16 0..65535] }
```
`elev_m = minM + q/65535·(maxM − minM)`; grid ≤ 128×128 (≤ 40 KB gzipped);
plane geometry displaced by `elev_m·EX / horizontalScale`, vertical exaggeration
`EX` from data (**caption chip `vertical ×EX` mandatory**, CANON §7). Rendered
as wireframe ridgelines (decimated rows) or contour polylines (marching squares
at build) — never a shaded solid. Contour interval stated in the legend.

## 6. Map plates (SVG kinds)

Natural Earth 50m via `world-atlas` (existing dependency), loaded with
`readFileSync(join(process.cwd(), 'node_modules/...'))` — never
`import.meta.url` (per `src/components/AGENTS.md` §5). Two-pass land rendering,
in-SVG legends, `paint-order` halos — all existing conventions apply.

## 7. Atmosphere (atmosphere-column, altitude-oxygen)

- Isothermal barometric: `P = P₀·e^(−h/H)`, scale height `H = 8.4 km`,
  `P₀ = 1013.25 hPa`.
- With lapse rate (troposphere, ≤11 km, better for mountain stories):
  `T = T₀ − Γh` (Γ = 6.5 K/km, T₀ = 288 K), `P = P₀·(T/T₀)^5.256`.
- "Effective oxygen %" for trekking: `21%·(P/P₀)` (Everest 8849 m → P ≈ 0.31·P₀
  → ~6.7% effective — sanity check).
- Layer boundaries for the column: troposphere 0–12, stratosphere 12–50,
  mesosphere 50–85, thermosphere 85–600 km (editorial rounding fine).
