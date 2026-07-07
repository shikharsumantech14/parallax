# Blueprint — `constellation-swarm` (space · WebGL · FLAGSHIP)

> The mega-constellation, rendered as the wall of hardware it actually is:
> every satellite an instanced point on its true orbital shell — thousands of
> them — Earth a country-outline globe inside the swarm, the shells at their
> real altitude ratios, one shell's inclination band drawn honestly so the
> reader sees the lattice, not a fog. "You are not looking at a diagram of
> Starlink. You are looking at Starlink." Where `orbit-globe` shows a handful
> of named rings, this shows the census.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `constellation-swarm` |
| World | space |
| Tier | WebGL (instanced points + picking, no setState) |
| Component | `src/components/topic/space/ConstellationSwarm.astro` |
| Scene module | `src/scripts/viz3d/scenes/constellationSwarm.ts` |
| Shared math | `src/scripts/viz3d/kepler.ts` — `circularPeriodSec` (§5), `R_EARTH`, `MU_EARTH`; NO new module (the shell math is three closed-form lines, computed identically in the scene and the build-time fallback frontmatter; the §11 anchors force them to agree) |
| CSS prefix | `px-cswrm` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `orbitGlobe.ts` (globe reuse: `buildCountryGlobe` + `makeLabels` + `dragController`), `chamber.ts` (`makeInstanced` + per-instance picking table), `solarSystem.ts` (settle-in + tooltip) |

## 2. What it shows / when to use

The physical scale and lattice structure of a satellite mega-constellation:
thousands of individual craft distributed across real orbital shells around a
line-art Earth, so the reader feels the population, not a count in a caption.

- **USE WHEN:** the dossier has a real **shell breakdown** — ≥1 shell with an
  altitude (km), inclination (deg), and a satellite count (the census figure
  that IS the story: "4,408 Starlink Gen1", "648 OneWeb"). Best when total
  count ≥ 300 (below that the swarm reads thin — use `orbit-globe`).
- **DON'T USE:** a handful of NAMED orbits where labels matter more than mass
  (→ `orbit-trace`, flat, labelled); comparing band occupancy as annotated
  rings (→ `orbital-shells`, SVG); a single constellation's altitude rings
  without a census (→ `orbit-globe`); interplanetary geometry (→
  `solar-system`). This kind's whole justification is **N is large** — if the
  count fits on ten fingers it is the wrong form.
- **Pairs with:** `layout: split` as the issue hero — prose walks the
  crowding argument while the swarm holds and rotates; `wide` standalone.
  Never adjacent to another WebGL kind (CANON §2). Never `bleed` (the globe is
  radially symmetric; bleed adds margin, not information).

## 3. Data schema

```ts
interface ConstellationSwarmData {
  shells: Array<{
    name: string;        // "Starlink Gen1 · 53°" — appears in tooltip + legend
    altKm: number;       // shell altitude above mean Earth radius, km (>0)
    inclDeg: number;     // inclination, deg [0..180]
    count: number;       // TRUE satellite count in this shell (the honest number)
    color?: string;      // shell color — data-encoding exemption (CANON §6), max 2
                         // beyond accent; default: shell 0 → --accent (cyan),
                         // shell 1 → --accent-alt (amber), shell 2+ → --ink @ 0.7.
    raanSpread?: number; // deg of RAAN spread across the shell's planes; default 360
    planes?: number;     // # orbital planes to distribute across; default: see §4
  }>;
  epoch?: string;        // ISO — phase seed only (positions are illustrative, not
                         // ephemeris-accurate); default the issue publishedAt.
  spin?: boolean;        // whether sats advance along orbits live; default true.
                         // true AUTO-RENDERS the time-compression chip (§4).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Starlink shells, illustrative census — the crowding story)
shells:
  - { name: "Starlink Gen1 · 53.0°", altKm: 550, inclDeg: 53.0, count: 1584, color: "#00d4ff" }
  - { name: "Starlink Gen1 · 53.2°", altKm: 540, inclDeg: 53.2, count: 1584 }
  - { name: "Starlink Gen1 · 70°",   altKm: 570, inclDeg: 70.0, count: 720,  color: "#ffb347" }
  - { name: "Starlink Gen1 · 97.6°", altKm: 560, inclDeg: 97.6, count: 520,  color: "#ffb347" }
epoch: "2026-06-04"
caption: "4,408 craft in four shells between 540 and 570 km — a single operator's slice of low orbit."
source: "FCC filing SAT-MOD-20200417, Starlink Gen1 architecture"
```

**Data flags with visual consequences (CANON §7):**
- **Display sampling.** If `Σ count > CAP` (CAP = 6000 instances, §10), each
  shell is display-sampled: it renders `shown_s = round(count_s · CAP / Σcount)`
  points (every shell keeps ≥ `min(count_s, 24)` so no shell vanishes). The
  component AUTO-RENDERS the caption chip `` showing {Σshown} of {Σcount} craft ``.
  The **legend and tooltip always state the TRUE `count`**, never the sampled
  number — sampling is display-only, the census is the truth.
- **Time compression.** `spin: true` AUTO-RENDERS the chip
  `` 1 s = {rate} min `` where rate is fixed at **90** (the swarm advances at
  1 s = 90 real minutes ≈ one full LEO revolution per ~1.06 s — see §5). A real
  swarm at real speed would be a static blur; the chip declares the honesty.
- **Altitude scale is TRUE-ratio, not log** (LEO shells span only 540–570 km;
  the whole point is they are nearly coincident) — no scale chip; §4 states the
  radial mapping and why it needs no compression.

## 4. Geometry spec

**Shell math (closed form — `kepler.ts` + these lines, identical in scene and
fallback; mirrors `physics/orbital-mechanics.md` §5 "Circular orbits"):**

- Orbital radius of shell `s`: `a_s = R_EARTH + altKm_s` (km). Period
  `T_s = circularPeriodSec(altKm_s)` seconds — the sat's real angular rate is
  `n_s = 2π / T_s` rad/s, displayed at the §5 time compression.
  **Acceptance anchor:** `circularPeriodSec(550)` ⇒ `a = 6921 km`,
  `T ≈ 5730 s = 95.5 min` (±0.5 min); the 550 km and 540 km shells must
  differ in period by **~0.21 min** (higher = slower). *(Corrected 2026-07-06:
  the recomputed difference is `95.502 − 95.295 = 0.207 min`, not the ~0.15 min
  originally stated — a reviewer computing it would have failed the check
  against the wrong target.)*
- **Radial display mapping (TRUE-ratio, magnified band).** Earth renders at
  scene radius `R = 1`. A shell at altitude `alt` maps to scene radius
  `ρ_s = 1 + BAND · (alt − altMin) / max(1, altMax − altMin) + INSET`, with
  `INSET = 0.42`, `BAND = 0.22`, `altMin`/`altMax` = min/max shell altitude in
  the data. This places the closest shell at ρ = 1.42 and the farthest at
  ρ = 1.64 — the shells sit just above the globe, tightly stacked, **which is
  the true story** (they really are a 30 km-thick crust on a 6371 km ball; the
  band magnifies that crust just enough to separate coincident shells without
  lying about "far above Earth"). Single-shell data ⇒ ρ = 1 + INSET + BAND/2.
- **Point placement per shell** (illustrative distribution, not ephemeris):
  `planes_s = planes ?? clamp(round(√(count_s)), 6, 72)`; sats spread
  `sats_per_plane = ceil(shown_s / planes_s)` across each plane. For sat `k`
  (0…shown_s−1): plane `p = k % planes_s`, slot `j = floor(k / planes_s)`.
  - RAAN of the plane: `Ω = (raanSpread/planes_s)·p + φ_s` (`φ_s` = shell index
    × 11.7° golden-ish offset so shells' planes don't align).
  - true anomaly along the plane: `ν = 360·(j / sats_per_plane) + 0.618·p·360`
    (mod 360) — the 0.618 turn per plane phases planes into a lattice, not
    stripes.
  - Position in the orbital plane then inclined: start
    `v = (cos ν, sin ν, 0)·ρ_s`, rotate by inclination `inclDeg_s` about the
    X axis, then by `Ω` about the scene Y (up) axis. Seed the whole shell's
    `ν` by `+ 360·(daysSinceJ2000(epoch) mod 1)` so the epoch nudges phase
    (illustrative only).
- **Instancing:** ONE `makeInstanced` **point-box** mesh for ALL shown sats
  across ALL shells (box `0.012³` scene units; instanceId → {shell, k} lookup
  table for picking — the `chamber.ts` pattern). Per-instance color = shell
  color. This is one draw call for the entire swarm.
- **Orbit-plane guides (structure, not census):** for EACH shell draw exactly
  **2 representative plane rings** (not all planes — that would be a cage) as
  `LineLoop`s at radius ρ_s, inclined to `inclDeg_s`, at RAAN `φ_s` and
  `φ_s + 90°`, `--ink` @ 0.16 (the graticule opacity). These say "these craft
  ride tilted circles" without drawing 72 rings.
- **Earth:** `buildCountryGlobe(THREE, group, colors, 1, disposables)` —
  the shared country-outline globe at R = 1 (occluder + graticule + coastlines),
  reused verbatim from the globe scenes. `makeLabels` carries the major-country
  labels at priority 0 (they yield to nothing here — no data labels compete).
- **Camera:** PerspectiveCamera FOV 42 (matches `orbit-globe`), initial
  `position (0, ρ_max·0.28, d)` where `d` = the `fitCamera` distance that frames
  ρ_max (copy `orbitGlobe.ts`'s `fitCamera`: `dV = ρ_max·0.92/tan(fov/2)`,
  `dH = ρ_max·1.08/(tan(fov/2)·max(0.6, aspect))`, `d = max(dV, dH, 4.6)`),
  lookAt origin — **the outermost shell is fully framed, never cropped**
  (REVIEW R7). `makeOrbitControls`: startPitch 0.32, minZoom 0.7 (whole swarm),
  maxZoom 2.8 (crust fills frame), `autoRotate: true` (space's sanctioned
  `orbitIdle` — a constellation genuinely moves).
- **375px:** same scene; DPR ≤ 2; `fitCamera` re-runs on resize so the swarm
  still fits; picking targets are whole shells' nearest sat (§8), so no
  hit-size problem from the 0.012 boxes.

## 5. Motion spec (names from motion.md)

- **Boot:** sats `settle` (scale 0→1, 500 ms smoothstep) in shell waves —
  shell delay **50 ms** (inner shell first), within-shell delay `+0.06 ms·k`,
  full sequence ≤ 1.2 s (matches `solarSystem`/`chamber` settle). The 2 plane
  guides per shell `sweep` (dashless `LineLoop` drawn via opacity 0→0.16,
  400 ms) after that shell's sats settle.
- **`orbitBody` (the ambient census motion — space's sanctioned one, one per
  viewport):** each sat advances along its plane at the shell's real `n_s`,
  displayed at **1 s = 90 min** (chip `1 s = 90 min`). At that rate the 550 km
  shell completes a revolution in ~1.06 s — fast enough to read as "alive",
  honest because the chip states it. Off-viewport the RAF pauses (runtime
  contract). `orbitIdle` yaw drift from `makeOrbitControls` runs only when NOT
  dragging and is additive to the swarm's own motion.
- `hoverLift`: picking a sat brightens its WHOLE shell (all that shell's
  instances color-lerp toward white by 0.3, +0.02 scene-radius nudge outward);
  other shells dim to 0.5 via color lerp; tooltip follows (§8). (Dark scene:
  dimming reads cleanly here, unlike the dimming-as-flicker note in
  `solar-system` — the swarm is dense enough that a dimmed shell is a clear
  visual group, not a flicker.)
- **Composed still (reduced-motion / print / fallback):** all sats at their
  epoch-seeded positions, both plane guides per shell drawn, Earth with
  coastlines + country labels, the legend visible. Reduced-motion never boots
  WebGL — the build-time fallback SVG IS this still, computed with the same
  shell math at the same epoch. `orbitBody` and `orbitIdle` are frozen.
- Entrance order: Earth (globe builds first, coastlines stream in async) →
  sats `settle` shell-by-shell → plane guides `sweep` → the swarm begins
  `orbitBody`. No `stamp`.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| satellites (per shell) | shell `color` from data @ 1.0 (data-encoding exemption, max 2 beyond accent; default shell 0 `--accent`, shell 1 `--accent-alt`, shell 2+ `--ink` @ 0.7) |
| orbit-plane guides | `--ink` @ 0.16 (graticule opacity, CANON §6) |
| Earth occluder / graticule / coastlines | shared globe: `--paper` @ 1.0 / `--ink` @ 0.07 / `--ink` @ 0.42 |
| hovered shell / dimmed shells | shell color mixed 30% → white / others → `--paper` by 0.5 |
| country labels | shared `viz3d__label--country` @ 0.66 |
| tooltip | shared `.viz3d__tip` |

`--accent` (cyan) is the primary constellation; `--accent-alt` (amber) marks
the second/anomalous shell family (worlds/space.md: amber = the second object).
No third invented color — a data with >3 shell colors falls back to `--ink`
@ 0.7 for the extras (the census, not the palette, carries the meaning).

## 7. Fallback design (first-class)

Build-time SVG computed with the SAME shell math at the SAME epoch, viewBox
`0 0 720 560` — an orthographic-ish top-down-tilted projection of the swarm:

- **Projection:** the same inclination/RAAN placement as the scene, projected
  with a fixed camera basis (tilt 0.32 rad about X, yaw 0): a sat at scene
  `(x, y, z)` maps to `px = 360 + x·150`, `py = 260 − (y·cos0.32 − z·sin0.32)·150`.
  All extents verified to fit within the box (ρ_max ≤ 1.64 ⇒ |x·150| ≤ 246 px;
  the 80 px bottom margin holds nothing — labels live in the legend).
- **What it draws:** the Earth disc (a `--paper` circle radius 150 px with the
  faint graticule arcs + a coastline path sampled from the same topojson at
  build time — reuse the `region-map` coastline import, or a simpler `--ink`
  @ 0.42 land silhouette), then **sampled** sats as 1.3 px-radius dots in shell
  color (fallback samples to ≤ 1500 dots regardless of CAP — a static SVG
  needs fewer; states its own sampling ratio), then the 2 plane guides per
  shell as thin `--ink` @ 0.16 ellipses.
- **Legend list** (the AT-readable data source, `.vz-legend` rows), one per
  shell: `` {name} · {altKm} km · {inclDeg}° · {count} craft `` — **TRUE
  count**. Rows ≤ 5 visible; a 6th+ shell collapses behind a "show all shells"
  `<details>` disclosure (REVIEW-2026-07-05 amendment 3). A total row:
  `` Σ {Σcount} craft in {shells.length} shells ``.
- **Caption chips** via the standard `.px-viz__cap` pattern: the sampling chip
  `showing {Σshown} of {Σcount} craft` when sampled; **never** the time chip
  (nothing moves in print).

## 8. Interaction spec

- Drag = rotate (pitch clamp ±0.9 via `makeOrbitControls`), wheel/pinch =
  zoom (0.7–2.8), `touch-action: pan-y` (page scroll sacred). Hint chip:
  `drag to orbit · scroll to zoom` (fades in when live).
- Hover/tap a sat → **shell-level** tooltip (the shell is the unit of meaning;
  an individual illustrative sat has no identity to claim):
  `<b>{name}</b><br>{altKm} km · {inclDeg}°<br>{count} satellites`.
  Anchor: hovering any Gen1·53.0° sat shows
  "Starlink Gen1 · 53.0° — 550 km · 53° · 1584 satellites".
- No state chips, no slider, no scrubber — the swarm is autonomous (one-control
  rule kept at ZERO controls; the interaction budget is spent on inspect +
  orbit, both readable-optional). `setState` hooks reserved (`'live'|'frozen'`)
  for a future split-chapter freeze, unimplemented in v1.
- Keyboard/AT: canvas `aria-hidden`; the fallback legend + total row carry the
  full census; the plain line explains the form. No focusable scene targets.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "Each dot is one
  satellite on its real orbital shell around Earth; the whole cloud is the
  constellation at true scale. Color groups the shells."
- **how** (ExpandModal): "Drag to orbit the swarm, scroll to zoom. Hover any
  satellite for its shell's altitude, tilt, and true count."
- Caption guidance: state the scale/crowding claim ("4,408 craft in four
  shells between 540 and 570 km"), never restate the form.
- **Text budget** (the ≤80-words-at-rest rule — `REVIEW-2026-07-05.md`
  amendment 3, designated "new §4.5" but **not yet merged into `CANON.md`**;
  cite the review until it lands): *(Corrected 2026-07-06: the four space
  blueprints cited "CANON §4.5", which does not exist — CANON.md runs §4→§5. The
  rule is real but only in the review doc's amendment list. Flag for the
  operator: merge amendment 3 into CANON as §4.5, then these citations resolve.)*
  at rest ≈ the caption (~16) + plain (~24) +
  ≤5 legend rows (each ~8 words) + total row + the sampling/time chips —
  legend collapses past 5 rows behind the disclosure, keeping the at-rest
  visible text ≤ 80 words. Shell `name`s are the only per-mark labels and they
  live in the tooltip/legend, not floating on the swarm.

## 10. Performance budget

| Budget | Cap |
|---|---|
| Instances | ≤ 6000 (CAP; one InstancedMesh, 1 draw call for the whole swarm; sampling guard in §3 enforces) |
| Vertices | ≤ 60k (6000 boxes are point-scale, but budget as 24-vert boxes worst case → sample harder if a device is slow; globe ≈ 6k; guides ≤ 8 loops × 128) |
| Draw calls | ≤ 20 (1 instanced swarm + globe occluder + graticule + coastlines + ≤8 plane guides) |
| SVG nodes (fallback) | ≤ 1700 (≤1500 sampled dots + globe + guides + legend) |
| `data` payload | ≤ 3 KB (shells are ~6 numbers each; the census counts, not per-sat data) |
| Extra assets | the shared `/geo/countries-110m.json` (already loaded by any globe scene; no new asset) |

Scene is its own lazy chunk via the scenes registry (`scenes/index.ts`) — no
eager imports; three loads only on scroll-in; disposes on pagehide; RAF pauses
off-screen (runtime contract).

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px, targets ≥ 44px · reduced-motion still = fallback SVG ·
      token grep (only declared shell-color exemption passes) · caption +
      source + plain · lazy boot + dispose + three-chunk absent from non-3D
      pages + DPR ≤ 2 + RAF off-screen pause · payload degradation (missing
      `color`/`planes`/`spin` all default) · prefix `px-cswrm` unique
- [ ] `circularPeriodSec(550)` ⇒ a = 6921 km, T ≈ 95.5 min; the 550 km and
      540 km shells differ in period by ~0.21 min (95.502 − 95.295; verify via
      a debug log)
- [ ] Radial mapping: with the example's 540/570 km span, the 540 km shell
      sits at ρ = 1.42 and the 570 km shell at ρ = 1.64 (closest/farthest);
      a single-shell payload places it at ρ = 1.53
- [ ] Sampling: a payload with `Σ count = 12000` renders ≤ 6000 instances,
      every shell keeps ≥ min(count, 24), and the chip reads
      `showing {Σshown} of 12000 craft`; the example (Σ = 4408 < 6000) renders
      NO sampling chip and every sat is real
- [ ] Tooltip ALWAYS shows the TRUE `count` (1584 for the example's first
      shell), never a sampled number, even when sampling is active
- [ ] `spin: true` renders the chip `1 s = 90 min`; `spin: false` renders no
      time chip and the swarm is static
- [ ] Camera frames the outermost shell fully at boot and after a 375px
      resize — no ring/shell cropping (REVIEW R7)
- [ ] Hovering any sat brightens its whole shell and dims the others; tooltip
      shows that shell's name · altitude · inclination · true count
- [ ] One InstancedMesh for the entire swarm; draw calls ≤ 20 (renderer.info
      in a temporary debug log — remove after)
- [ ] Fallback SVG: Earth disc + sampled dots + 2 plane guides per shell +
      the legend with TRUE counts (collapsing past 5 shells) + the Σ total row,
      readable with zero JS; reduced-motion shows exactly this still
- [ ] The three.module chunk + constellationSwarm chunk are absent from pages
      without the kind (check `dist/`)

---

*Registry duties when implementing (P6 — NOT now): add `constellation-swarm`
to `SECTION_KINDS` (`src/content/config.ts`), register the scene in
`src/scripts/viz3d/scenes/index.ts`, dispatch in `SectionBody.astro`, add the
`EXPLAIN` entry (`src/lib/explainers.ts` §9 wording), add the `catalog.md`
block (in `SECTION_KINDS` order; `npm run check:catalog` must pass), document
the `px-cswrm` prefix in `src/components/AGENTS.md` §4/§2 table, and add a
worked example to `2026-06-03-space-showcase`. Do NOT edit `SECTION_KINDS` or
`catalog.md` at blueprint time.*
