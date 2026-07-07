# Blueprint — `solar-system` (space · WebGL · FLAGSHIP)

> The space world's hero component and the reference implementation for every
> WebGL blueprint that follows. A real, navigable solar system: bodies on
> elliptical Keplerian orbits, positions correct for the issue's epoch date,
> zoom from the inner planets outward, hover any body for its live readout,
> the story's object (comet / probe / asteroid) highlighted. "The reader
> holds the actual machine, not a picture of it."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `solar-system` |
| World | space |
| Tier | WebGL |
| Component | `src/components/topic/space/SolarSystem.astro` |
| Scene module | `src/scripts/viz3d/scenes/solarSystem.ts` |
| CSS prefix | `px-solsys` (component-scoped `<style>`) |
| Flagship reference | (is one) — copies patterns from `orbitGlobe` + P1 helpers |

## 2. What it shows / when to use

The architecture of the solar system with the story object inside it — where
a comet/asteroid/probe actually travels relative to the planets, at real
scale relationships and real dates.

- **USE WHEN:** the dossier has real orbital elements (a, e, i, Ω, ω, M0 or
  equivalents) for ≥1 story object, or the story hinges on interplanetary
  geometry (windows, flybys, crossings). Planets ship as built-in defaults.
- **DON'T USE:** near-Earth/orbital-shell stories (→ `orbit-globe`);
  a single ascent/descent (→ `trajectory-arc` / `descent-profile`).
- **Pairs with:** `layout: split` as the issue hero (chapters can `setState`
  scale/epoch later); `wide` standalone. Never adjacent to another WebGL kind.

## 3. Data schema

```ts
interface SolarSystemData {
  epoch?: string;          // ISO date — positions computed for this instant.
                           // Default: the issue's publishedAt (component passes it).
  planets?: string[];      // subset to show, e.g. ['mercury','venus','earth','mars','jupiter'];
                           // default: all 8. Lowercase keys of kepler.PLANETS.
  bodies?: Array<{         // story objects beyond the planets
    name: string;          // "2024 YR4"
    a_AU: number; e: number; i_deg: number;
    Omega_deg: number; omega_deg: number; M0_deg: number; // J2000 elements
    period_d: number;
    role?: 'focus';        // the story object — amber highlight + glow + trail
    note?: string;         // one line for the tooltip readout
  }>;
  scale?: 'true' | 'log';  // radial display scale; default 'log'.
                           // 'log' AUTO-RENDERS caption chip "distances log-compressed".
  trailDays?: number;      // focus-body trail length in days (default 120; 0 = off)
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (asteroid 2024 YR4 story)
epoch: "2026-06-04"
planets: [mercury, venus, earth, mars, jupiter]
bodies:
  - { name: "2024 YR4", a_AU: 2.52, e: 0.66, i_deg: 3.41,
      Omega_deg: 271.4, omega_deg: 134.4, M0_deg: 351.1, period_d: 1461,
      role: focus, note: "Earth-crosser · next close approach Dec 2032" }
scale: log
caption: "Where 2024 YR4 actually lives — an Earth-crossing ellipse reaching past Mars."
source: "JPL Small-Body Database"
```

## 4. Geometry spec

- **Math:** `kepler.ts` ONLY — `elementsToPosition(el, daysSinceJ2000(epoch))`
  per `physics/orbital-mechanics.md` §2; planet defaults from `PLANETS` (§3).
  Acceptance anchor: Mars at J2000 → E 21.361°, ν 23.400°, r 1.391 AU.
- **Frame:** ecliptic → scene: `x_s = x`, `y_s = z`, `z_s = −y` (Y-up; the
  ecliptic is the scene's XZ plane).
- **Radial scale:** `'log'` → `R = K·log10(1 + 9·r_AU)` (`logRadius`), K = 1.15
  scene units. `'true'` → `R = K'·r_AU`, K' = 0.62 (inner-system framing).
  Positions AND orbit paths pass through the same mapping (paths therefore
  are not geometric ellipses under log — correct and intended).
- **Orbit paths:** per body, 192-segment polyline sampled uniformly in mean
  anomaly over one period through the same pipeline. Planets: `--ink` @ 0.22.
  Focus body: `--accent-alt` (amber) @ 0.8.
- **Bodies:** Sun = 0.09-radius disc sprite (`glowSprite`, accent, size 0.55)
  + core circle `--accent` @ 1.0. Planets = spheres, radius
  `0.028 + 0.022·log10(1 + r_rel)` where r_rel = real radius / Earth's
  (Mercury 0.38 … Jupiter 11.2 — hardcoded table in the scene); color
  `--ink` @ 0.9 (light worlds n/a — space is dark; ink is light). Focus body
  = 0.045 sphere `--accent-alt` + glowSprite(accent-alt, 0.28) + trail.
- **Trail:** focus body's past `trailDays` sampled at 2-day steps, polyline
  with opacity fading 0.7 → 0.
- **Camera:** PerspectiveCamera FOV 40, position (0, 2.6, 4.4)·zoom,
  lookAt origin. `makeOrbitControls`: startPitch 0.55, minZoom 0.55 (whole
  system in frame), maxZoom 3.2 (inner planets fill the frame).
- **375px:** same scene; labels move via the existing label layer;
  min body hit target enforced by picking sphere radius ≥ 0.05.

## 5. Motion spec (names from motion.md)

- `orbitBody`: bodies advance along their real orbits at **1 s = 10 days**
  (auto-renders caption chip `1s = 10 days`); positions seeded at `epoch`.
- `orbitIdle`: controls' idle yaw drift (built into makeOrbitControls tick).
- `settle`: on boot, bodies scale-in 0→full over 600 ms staggered 40 ms
  outward (Mercury first) — implemented as per-body scale lerp in frame().
- `hoverLift`: picked body scales ×1.35 + tooltip; siblings undimmed (dark
  scene — dimming reads as flicker; deviation recorded here on purpose).
- **Composed still (reduced-motion / print / fallback):** all bodies at
  their exact `epoch` positions, orbits drawn, focus body + trail visible,
  labels on. (Reduced-motion never boots WebGL — the fallback SVG IS this
  still, computed at build time with the same kepler.ts.)

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| planet orbit paths | `--ink` @ 0.22 |
| graticule/ecliptic ring (none — the orbits are the structure) | — |
| planets | `--ink` @ 0.9 |
| Sun core / glow | `--accent` @ 1.0 / additive sprite |
| focus body + its orbit + trail | `--accent-alt` @ 0.8–1.0 |
| labels | existing `viz3d__label` classes (data > country priority unused here) |
| tooltip | shared `.viz3d__tip` |

No other colors. `bodies[].color` is deliberately NOT supported — the
two-color discipline (ink structure + amber story-object) is the design.

## 7. Fallback design (first-class)

Build-time SVG computed with the SAME `kepler.ts` at the SAME epoch —
top-down ecliptic view (no tilt):
- Orbit ellipses as sampled paths (log-mapped), planets as dots at epoch
  positions with 9.5px mono labels (halo per SVG conventions), Sun disc at
  center, focus body amber with its trail arc and label.
- Below the SVG, the **legend list** (AT-readable data source): one row per
  body — name · a (AU) · period · (focus rows: the `note`).
- The caption chips (`distances log-compressed`, `1s = 10 days` — the latter
  only when live) render via the standard `.px-viz__cap` pattern.

## 8. Interaction spec

- Drag = rotate (pitch clamped ±0.9), wheel/pinch = zoom (clamps §4),
  `touch-action: pan-y`. Hint chip: `drag to orbit · scroll to zoom`.
- Hover/tap a body → `hoverLift` + tooltip:
  `<b>{name}</b><br>{r_now} AU from Sun · {period}<br>{note?}`
  (r_now live from the animated position; period formatted d→yr above 400 d).
- No state chips in v1 (setState hooks reserved: `'true-scale'|'log-scale'`
  accepted by setState for future split-chapter use; implemented as a 600 ms
  `stateSwitch` re-map of all positions/paths).
- Keyboard/AT: canvas `aria-hidden`; the fallback legend carries the data;
  the plain line explains the form.

## 9. Comprehension text

- **Plain default** (→ explainers.ts): "A top-down map of the solar system —
  each ring is one real orbit, each dot a body at its actual position for
  the story's date. The amber object is the one this story follows."
- **how** (modal): "Drag to tilt and spin, scroll to zoom. Hover any body
  for its distance and year-length."
- Caption guidance: state the story-object's geometry claim ("an
  Earth-crossing ellipse reaching past Mars"), never restate the form.

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices | ≤ 45k (8 orbits × 192 segs + spheres 20×14 + trail) |
| Draw calls | ≤ 24 |
| Instancing | not needed (≤ 12 bodies) |
| `data` payload | ≤ 4 KB |
| Extra assets | none (no geo fetch — this scene never loads topojson) |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test · 375px · reduced-motion
      still = fallback SVG · token grep · caption+source+plain · lazy boot +
      dispose + chunk isolation · payload degradation · prefix unique
- [ ] Mars at J2000 matches the physics-sheet anchor within tolerance
      (checked via a temporary epoch: `2000-01-01T12:00Z`)
- [ ] Epoch correctness: `epoch: 2026-06-04` places Earth ~253° mean
      longitude from J2000 Earth (26.44 yr × 360°/yr mod 360 ≈ +158°) —
      sanity-check against any planetarium app
- [ ] `scale: log` renders chip `distances log-compressed`; `scale: true`
      renders no chip
- [ ] Live scene renders chip `1s = 10 days`; fallback does not
- [ ] Hovering Jupiter shows "Jupiter — 5.2 AU from Sun · 11.9 yr"
- [ ] Focus body renders amber + glow + trail; its orbit path amber
- [ ] Zoom clamps hold on wheel AND pinch; page never scroll-hijacks
      (vertical pan gesture scrolls the page)
- [ ] The three.module chunk + solarSystem chunk absent from pages without
      the kind (check dist)
