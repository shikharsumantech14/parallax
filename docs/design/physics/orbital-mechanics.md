# Physics sheet — orbital mechanics

> The formula reference for `solar-system`, `orbit-globe`, `constellation-swarm`,
> `transfer-window`, `lagrange-map` and any future orbital kind. The
> implementation (`src/scripts/viz3d/kepler.ts`) must mirror these formulas 1:1 —
> same symbols, same conventions — so this sheet doubles as its review spec.
> Editorial accuracy target: positions good to ~1° over ±50 years from J2000 —
> plenty for a viz, NOT for navigation. Say so nowhere in the UI; just don't
> overclaim precision in captions.

## 1. Keplerian elements (per body)

| Symbol | Name | Unit |
|---|---|---|
| `a` | semi-major axis | AU (heliocentric) or km (geocentric) |
| `e` | eccentricity | — |
| `i` | inclination | deg |
| `Ω` | longitude of ascending node | deg |
| `ω` | argument of perihelion | deg (`ω = ϖ − Ω` when sources give longitude of perihelion ϖ) |
| `M0` | mean anomaly at epoch | deg (`M0 = L0 − ϖ` when sources give mean longitude L0) |
| `T` | orbital period | days |

Epoch convention: **J2000.0** (2000-01-01 12:00 TT). Time since epoch in days:
`d = (t − J2000) / 86400000` from a JS `Date` (UTC ≈ TT is fine at our accuracy).

## 2. Position at time t

1. **Mean anomaly:** `M = M0 + 360·(d / T)` (deg), normalize to [0, 360).
2. **Kepler's equation** `E − e·sin(E) = M` (radians) — Newton–Raphson:
   `E₀ = M` (or `π` if `e > 0.8`); iterate
   `E ← E − (E − e·sinE − M)/(1 − e·cosE)` until `|Δ| < 1e-8`, cap **8
   iterations** (converges in ≤5 for e < 0.3).
3. **True anomaly:**
   `ν = 2·atan2( √(1+e)·sin(E/2), √(1−e)·cos(E/2) )`
4. **Radius:** `r = a·(1 − e²) / (1 + e·cosν)`  (equivalently `a·(1 − e·cosE)`).
5. **Perifocal → reference frame** (heliocentric ecliptic; angles in radians):
   ```
   x' = r·cos(ν),  y' = r·sin(ν)                          # in-plane
   x = x'·(cosω·cosΩ − sinω·sinΩ·cosi) − y'·(sinω·cosΩ + cosω·sinΩ·cosi)
   y = x'·(cosω·sinΩ + sinω·cosΩ·cosi) − y'·(sinω·sinΩ − cosω·cosΩ·cosi)
   z = x'·(sinω·sini) + y'·(cosω·sini)
   ```
   Scene mapping: ecliptic plane = scene XZ, `z_scene = −y_ecliptic`, Y-up
   (matches the existing globes' Y-up convention).

## 3. Planet elements (JPL approximate mean elements, J2000)

Derived columns already computed (`ω = ϖ − Ω`, `M0 = L0 − ϖ`, normalized):

| Body | a (AU) | e | i° | Ω° | ω° | M0° | T (days) |
|---|---|---|---|---|---|---|---|
| Mercury | 0.38710 | 0.20563 | 7.005 | 48.331 | 29.125 | 174.795 | 87.969 |
| Venus | 0.72333 | 0.00677 | 3.395 | 76.680 | 54.853 | 50.447 | 224.701 |
| Earth | 1.00000 | 0.01671 | 0.000 | 0.000 | 102.947 | 357.517 | 365.256 |
| Mars | 1.52368 | 0.09340 | 1.850 | 49.558 | 286.483 | 19.412 | 686.980 |
| Jupiter | 5.20260 | 0.04849 | 1.303 | 100.464 | 273.867 | 20.066 | 4332.59 |
| Saturn | 9.55491 | 0.05551 | 2.489 | 113.666 | 339.391 | 316.897 | 10759.2 |
| Uranus | 19.21845 | 0.04630 | 0.773 | 74.006 | 98.999 | 140.233 | 30688.5 |
| Neptune | 30.11039 | 0.00899 | 1.770 | 131.784 | 276.340 | 256.996 | 60182 |

(Ship this table as the `solar-system` component's built-in defaults; an issue's
`data.bodies` may override or extend — e.g. the story comet with its own
elements. Earth's Ω is undefined at i≈0; 0 is the convention.)

**Worked example (acceptance check):** Mars at J2000 epoch (`d = 0`):
`M = 19.412°` → Kepler with e = 0.0934 → `E = 21.361°` → `ν = 23.400°` →
`r = 1.391 AU`. Implementations must match E, ν to ±0.02°, r to ±0.001 AU.

## 4. Radial display scale

- `scale: 'true'` — scene radius ∝ a (AU). Legible only for inner-system stories.
- `scale: 'log'` — `R_scene = k·log10(1 + 9·r_AU)` (maps 0→0, 1 AU→k, 30 AU→~2.47k).
  MUST render the caption chip `distances log-compressed` (CANON §7).

## 5. Circular orbits (geocentric: orbit-globe, constellation-swarm)

- `T = 2π·√(a³/μ)`, `μ_Earth = 398 600 km³/s²`, `a = R_E + alt`, `R_E = 6371 km`.
  (LEO 550 km → T ≈ 95.6 min; sanity check.)
- Angular speed for animation: real `n = 2π/T`, displayed at the stated time
  compression (`orbitBody` motion — caption chip `1 s = X min`).
- Shell geometry: satellites of one shell share `a` and `i`, spread in RAAN and
  phase. Render via `makeInstanced`.

## 6. Hohmann transfer (transfer-window)

Between circular coplanar radii r₁ → r₂ (μ of the central body):
```
Δv₁ = √(μ/r₁)·(√(2r₂/(r₁+r₂)) − 1)
Δv₂ = √(μ/r₂)·(1 − √(2r₁/(r₁+r₂)))
t_transfer = π·√((r₁+r₂)³ / (8μ))
```
Synodic period (window cadence): `S = 1/|1/T₁ − 1/T₂|`.
(Earth→Mars: Δv_total ≈ 5.6 km/s ideal, S ≈ 780 d — sanity checks.)

## 7. Lagrange points (lagrange-map)

CR3BP, rotating frame, mass ratio `μ* = m₂/(m₁+m₂)` (Sun–Earth μ* = 3.003e-6):
- Effective potential (unit distance = separation, unit ω = 1):
  `Ω(x,y) = ½(x²+y²) + (1−μ*)/r₁ + μ*/r₂`,
  `r₁ = √((x+μ*)²+y²)`, `r₂ = √((x−1+μ*)²+y²)`.
- L1/L2 distance from the secondary (Hill approx): `r_H ≈ a·(μ*/3)^(1/3)`
  (Sun–Earth: 0.01 AU ≈ 1.5 M km — JWST's neighborhood). L4/L5 at ±60° on the
  secondary's orbit. Contours precomputed at build time on a ~200×200 grid.

## 8. Eclipse geometry (eclipse-cone)

Umbra cone length of a body radius `R_body` lit by the Sun (radius `R_sun`,
distance `d_sun`): `L = d_sun·R_body/(R_sun − R_body)` (Moon: L ≈ 374 000 km —
barely reaches Earth; THE story). Angular diameter `θ = 2·atan(R/d)`; totality
happens because θ_moon ≈ θ_sun ≈ 0.53°. Umbra ground-track width from the cone
remainder at Earth's distance — the blueprint states the construction.
