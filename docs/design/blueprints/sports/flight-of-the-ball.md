# Blueprint — `flight-of-the-ball` (sports · WebGL · FLAGSHIP + world hero)

> THE sports hero: one famous shot rebuilt from its physics, not traced from
> footage. The ball leaves the boot at a real speed with real spin, and drag +
> Magnus bend it over a chalk-lined pitch to the goal — the whole trajectory
> integrated by RK4, then flown by a marker, replayable. A ghost straight-line
> "no-swerve" path shows exactly how much the air did. "The reader holds the
> shot's real machinery, not a highlight."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `flight-of-the-ball` |
| World | sports |
| Tier | WebGL (polyline trajectory + marker + picking + one replay control) |
| Component | `src/components/topic/sports/FlightOfTheBall.astro` |
| Scene module | `src/scripts/viz3d/scenes/flightOfTheBall.ts` |
| Shared math | `src/scripts/viz3d/ballistics.ts` (NEW pure module, kepler.ts/hemicycle.ts pattern — no `three` import; the RK4 integrator + constants feed BOTH the scene AND the component's build-time fallback SVG, so the flown polyline and the printed arc are the SAME points) |
| CSS prefix | `px-fball` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `solarSystem.ts` (marker-along-polyline `orbitBody`, `makeOrbitControls`, `makeTooltip`, `settle` boot, glowSprite), `chamber.ts` (the `data-viz3d-state` state-chip bridge in `runtime.ts` — reused for the one replay chip) |

## 2. What it shows / when to use

The real curved flight of one struck ball: launch speed and spin in, a
drag+Magnus trajectory out, drawn over a to-scale chalk pitch with the goal
frame — and the straight-line path it *would* have taken with no air, so the
swerve is measurable, not asserted.

- **USE WHEN:** the dossier has ONE shot/kick with primary launch parameters —
  initial speed `v0` (m/s or km/h), launch elevation + azimuth (deg), spin rate
  (rev/s) and spin-axis, and start + goal positions on the pitch — from a
  named source (broadcast tracking / a physics reconstruction paper / a
  federation dataset). The *swerve or dip IS the story* (a knuckleball, a
  banana free-kick, a top-spin dip, a three-point arc).
- **DON'T USE:** many shots' locations/quality at once (→ `shot-map`);
  cumulative chance quality over a match (→ `xg-race`); a formation's spatial
  shape (→ `tactics-pitch`); a value SURFACE over the pitch (→ `court-value`).
  One ball, one flight — if there are two or more paths to compare, it is a
  `shot-map`, not this.
- **Pairs with:** `layout: split` as the issue hero — the prose column walks
  the forces (gravity, drag, Magnus) while the shot holds and `setState`
  replays; `wide` standalone. **Never adjacent to another WebGL kind**
  (CANON §2). Never `bleed` (the arc is wider than tall; a chalk margin is part
  of the read).

## 3. Data schema

```ts
interface FlightOfTheBallData {
  sport?: 'football' | 'basketball' | 'cricket';
                        // selects the constant block in ballistics.ts (§4).
                        // default 'football'. cricket AUTO-RENDERS the caption
                        // chip `swing not modeled` (seam effects unmodelled,
                        // physics/mechanics-and-flow.md §1).
  shot: {
    label: string;      // "Roberto Carlos vs France, 1997"
    v0: number;         // launch speed — units per `speedUnit`, > 0
    speedUnit?: 'm/s' | 'km/h';   // default 'm/s'. km/h → ÷3.6 into SI at load.
    elevationDeg: number;         // launch angle above the pitch plane, −10..80
    azimuthDeg: number;           // launch heading in the pitch plane, deg;
                                  // 0 = straight at goal-center down +X, + = toward +Z
    spinRevPerS: number;          // |ω|/2π, rev/s, ≥ 0 (0 = knuckle: Magnus≈0)
    spinAxis?: [number, number, number];
                                  // unit-ish spin axis in pitch frame (auto-normalised).
                                  // default [0,1,0] = pure sidespin (banana).
                                  // [0,0,-1]≈topspin dip, [0,0,1]≈backspin lift.
    from: [number, number];       // launch point on pitch, [x_m, z_m] (§4 frame)
    note?: string;                // one line for the readout, ≤ 10 words
  };
  goal?: { x_m: number; width_m?: number; height_m?: number; z_m?: number };
                        // goal mouth center + size. Defaults by sport (§4).
  showGhost?: boolean;  // the no-air straight/parabolic reference path. default true.
  slowmo?: number;      // flight playback time-compression; 1 = real time,
                        // 4 = 4× slower. default 3. AUTO-RENDERS the caption chip
                        // `replay ×{slowmo} slow-mo` when > 1 (honesty, CANON §7).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Roberto Carlos free-kick vs France, 3 June 1997 — reconstructed)
sport: football
shot:
  label: "Roberto Carlos vs France, 1997"
  v0: 38            # ~137 km/h off the boot
  speedUnit: m/s
  elevationDeg: 10
  azimuthDeg: -16   # aimed several metres wide of goal, curled back inside the post
  spinRevPerS: 10   # ~600 rpm
  spinAxis: [0, 1, 0]   # near-pure sidespin
  from: [30.0, 4.5]     # ~30 m out, angled off-center
  note: "curled back inside the far post"
goal: { x_m: 0, width_m: 7.32, height_m: 2.44, z_m: 0 }
showGhost: true
slowmo: 3
caption: "Ten revs a second of sidespin bent the ball more than six metres — the wall, and Barthez, were watching a straight line aimed wide that curled back inside the post."
source: "Dupeux et al., New J. Phys. 12 (2010), trajectory reconstruction"
```

**Data flags with visual consequences (CANON §7):**
- `slowmo > 1` → live scene chip `` replay ×{slowmo} slow-mo ``.
- `sport: cricket` → chip `swing not modeled` (both live and fallback — the
  omission is permanent, not a playback artefact).
- No log/exaggeration flags — the pitch is drawn to true 105×68 m scale and the
  arc to true metres; there is nothing to compress, and that fidelity is the point.

## 4. Geometry spec

**`ballistics.ts` (the shared pure math — mirrors `physics/mechanics-and-flow.md` §1 1:1):**

- **Pitch frame (SI metres, right-handed, Y-up):** origin at the goal-mouth
  center on the ground. `+X` points down-pitch away from goal (so the shooter
  is at positive `x`); `+Y` is up; `+Z` completes the frame (the goal-line
  direction). Launch point `r0 = (from[0], 0.11, from[1])` (ball starts one
  radius off the turf). This is the frame all `from`/`goal`/`spinAxis` inputs
  live in.
- **Forces** (per unit mass divided out at integration; `physics/…§1`):
  `F_gravity = m·g`, `g = 9.81 m/s²` (−Y);
  `F_drag = −½·ρ·C_d·A·|v|·v`;
  `F_magnus = ½·ρ·C_L·A·|v|²·(ω̂ × v̂)`.
- **Constants by `sport`** (the blueprint declares them; `ballistics.ts` holds
  the table — `physics/…§1`):
  - football: `m = 0.43 kg`, `r = 0.11 m`, `A = π r² = 0.0380 m²`, `C_d = 0.25`,
    `ρ = 1.225 kg/m³`.
  - basketball: `m = 0.62`, `r = 0.12`, `A = 0.0452`, `C_d = 0.47`.
  - cricket: `m = 0.16`, `r = 0.036`, `A = 0.00407`, `C_d = 0.25` (seam/swing
    NOT modelled — emits the `swing not modeled` chip).
- **Lift coefficient** (spin-dependent, football-derived, used for all sports):
  spin ratio `S = r·|ω|/|v|` recomputed each step, **clamped 0–0.35**; then
  `C_L = S / (2.2·S + 0.4)` (gives `C_L ≈ 0.21` at `S = 0.25`, free-kick range).
  `|ω| = 2π·spinRevPerS`; `ω̂ = normalize(spinAxis)`.
- **Launch velocity:** `speed = v0` (converted to m/s if `km/h`);
  `v = speed·( cos(el)·cos(az), sin(el), cos(el)·sin(az) )` with `el =
  elevationDeg·π/180`, `az = azimuthDeg·π/180`. (az=0 ⇒ straight at goal-center
  down −X from the shooter's side; the sign convention above sends the ball
  toward decreasing x — implement `v_x = −speed·cos(el)·cos(az)` so flight goes
  goalward. **Stated explicitly so the two sites cannot disagree.**)
- **Integrator:** **RK4, fixed `dt = 1/240 s`** (`physics/…§1`). Integrate until
  EITHER `y < 0` (ground) after `t > 0.05 s`, OR `x ≤ goal.x_m` (crossed the
  goal line), OR `t > 6 s` (safety). Record a point every 2 substeps → a
  polyline of ~100–200 `{x,y,z,t,speed}` samples. `integrate(shot, consts,
  goal): Sample[]`.
- **Ghost path:** the same launch `v` with `C_L = 0` and `C_d = 0` (pure
  gravity parabola) integrated to the same stop condition → `ghost: Sample[]`.
  This is the "no air" reference; the lateral gap at the goal line = the swerve.
- **Acceptance anchor (sanity check, `physics/…§1`):** a 30 m free kick,
  `v0 = 25 m/s`, `spinRevPerS = 8`, sidespin → **lateral deviation at goal ≈
  2–3 m** vs the ghost (the physics sheet's own stated check). The example
  payload (`v0 = 38, spin 10, el 10°, az −16°, from (30, 4.5)`) is the harder,
  fully-recomputed anchor: RK4 (`dt = 1/240`) puts the real path across the goal
  line at **z ≈ 2.16 m** (inside the 3.66 m half-mouth) and **y ≈ 1.13 m**
  (under the 2.44 m bar), while the no-air ghost crosses at **z ≈ −4.10 m** —
  a computed **swerve ≈ 6.26 m** in **flight ≈ 1.0 s**. A reviewer re-integrates
  the example and confirms these four numbers (goal-line z, height y, ghost z,
  swerve) to ±0.1 m / ±0.02 s.

**Scene mapping (pitch metres → scene units):** `SCENE = 1/12` (1 scene unit =
12 m — the 105 m pitch spans ~8.75 units, framing the shooter-to-goal third
comfortably). `p_scene = (x·SCENE − X_OFF, y·SCENE, z·SCENE)`, `X_OFF` chosen so
the launch point and goal both sit in frame: `X_OFF = (goal.x_m + from[0])/2 ·
SCENE` (centers the arc). Applied identically to trajectory, ghost, pitch lines,
goal, and marker.

**The chalk pitch (the world's grid — `worlds/sports.md` motif 1):**
- A ground-plane rectangle of the attacking third: from `x = 0` (goal line) to
  `x = from[0] + 6` m, full 68 m width centered on `z = 0`. Lines as
  `LineSegments`, **1.5px equivalent** (line width is GPU-clamped; draw as thin
  geometry), `--ink` @ **0.35**, rounded feel (chalk, not laser — CANON accepts
  the standard `LineBasicMaterial`; roundness is aesthetic intent for the
  fallback SVG's `stroke-linecap: round`).
  Markings: goal line, the 16.5 m penalty box, the 9.15 m penalty arc, the
  penalty spot, and a center-spot-ward touchline hint. Real FIFA dimensions.
- **Goal frame:** two 2.44 m posts + crossbar at `x = goal.x_m`, width
  `goal.width_m` (default 7.32 m football / 3.05 m rim height mapped for
  basketball / stumps for cricket), as `--ink` @ **0.9** thin box geometry, with
  a faint net hint (a 6×4 grid of `--ink` @ 0.12 lines on the goal plane).
- **No stadium, no crowd, no sky.** The dark green background IS the floodlit
  turf (`worlds/sports.md`: "turf under floodlights, not a dark mode"). Strip
  the scaffolding (CANON §4).

**The trajectory + ghost + ball:**
- Real path: a `LineSegments`/`Line` polyline through the integrated samples,
  `--accent` (volt) @ **0.9**, thin. It is `sweep`-drawn on boot (§5).
- Ghost path: the no-air polyline, `--ink` @ **0.22**, **dashed** (dash 0.03 /
  gap 0.03 scene units) — reads as "the line everyone expected". Only when
  `showGhost !== false`.
- Ball: a `0.06`-scene-radius sphere (SphereGeometry 16×12), `--ink` @ **1.0**
  (floodlight white ball), + a small `glowSprite(--accent, 0.22)` so the volt
  reads as motion-trail warmth (NOT bloom — the sanctioned sprite, CANON §4).
  A short fading trail (last 12 samples, `--accent` @ 0.6→0 polyline) follows it.
- **Impact marker:** where the real path stops, a `--accent` @ 1.0 ring
  (0.05 radius, 0.008 thick torus) on the goal plane — the "it went in here" dot.
- **Swerve annotation:** a mono label at the goal line reading the lateral gap
  `Δz` between real and ghost crossings — `swerve {Δz} m` (label layer, priority 2).

- **Camera:** `PerspectiveCamera` FOV **42**, initial position
  `(2.2, 1.6, 4.6)·zoom`, `lookAt (0, 0.4, 0)` — a broadcast-behind-and-above
  angle looking down the shot toward goal. `makeOrbitControls`: **startPitch
  0.42**, **minZoom 0.7** (whole third + arc in frame), **maxZoom 2.8** (the
  goal mouth + swerve fill the frame), **autoRotate: false** — sports doesn't
  idle-spin; a replayed shot is the motion (`worlds/sports.md`: "No ambient
  motion"). Add a gentle idle sway `yaw = 0.05·sin(tMs/8000)` in `frame()` when
  not dragging and not replaying (broadcast subtle drift, ≤ the orbitIdle budget).
- **375px:** same scene at initial zoom **0.82**; chalk-line labels via the
  label layer; the ball's picking sphere radius floored at **0.07** so the
  44×44 tap target holds; goal + arc + swerve label never clip.

## 5. Motion spec (names from motion.md)

- **Boot (broadcast pace — sports' 40 ms stagger, `worlds/sports.md`):**
  1. chalk pitch lines `sweep`-draw (goal line → box → arc), 700 ms, 40 ms
     per-marking stagger;
  2. goal frame `settle` in (scale 0→1, 350 ms — sports' fast `grow`/`settle`);
  3. ghost dashed path `reveal` (opacity 0→0.22, 300 ms) — the expected line
     appears first, so the swerve lands against it;
  4. real trajectory `sweep`-draws along its length, **900 ms** (the shot being
     inked), the ball riding the draw head;
  5. impact ring + `swerve … m` label `stamp` LAST (220 ms `--ease-snap`) — the
     sports verdict beat.
  Full sequence ≤ **1.6 s** (stagger budget, motion.md).
- **The flight (`orbitBody`, the sanctioned replay motion):** after boot, the
  ball flies the real polyline once from launch to impact at **`slowmo`×**
  real time (the true flight is ~0.6–1.0 s; at `slowmo 3` ≈ 2–3 s), speed along
  the arc = the sample's real speed (marker interpolates by `t`, so it
  visibly decelerates as drag bites). Then it rests on the impact ring. **This
  is a one-shot playback, not a loop** — records replay on demand, they don't
  loop for decoration (motion.md rule 4 + `worlds/sports.md`). Re-runs via the
  REPLAY chip (§8).
- `hoverLift`: hovering the arc (or ball) lifts the ball marker (+0.03 Y) and
  shows the readout (§8); the ghost path dims to 0.12. No layout move.
- **Composed still (reduced-motion / print / fallback):** the FULL real
  trajectory drawn end to end, the ball resting on the impact ring at the goal,
  the ghost dashed path visible, the chalk pitch + goal frame drawn, and the
  `swerve {Δz} m` label placed. The ball does NOT fly (reduced-motion never
  boots WebGL; the build-time fallback SVG IS this still, computed with the same
  `ballistics.ts`). Entrance renders final immediately under no-JS.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| chalk pitch lines / box / arc | `--ink` @ 0.35 (the chalk-line motif; `stroke-linecap: round` in the SVG fallback) |
| goal frame (posts + bar) | `--ink` @ 0.9 |
| goal net hint | `--ink` @ 0.12 |
| ghost "no-air" path | `--ink` @ 0.22, dashed |
| real trajectory + ball trail | `--accent` (volt) @ 0.9 / trail 0.6→0 |
| ball sphere + impact ring + glow | `--ink` @ 1.0 (ball) · `--accent` @ 1.0 (ring) · `glowSprite(--accent, 0.22)` |
| swerve label + readout | shared `viz3d__label` (priority 2) / `.viz3d__tip` |
| REPLAY chip | mono pill, `--accent-deep` text on `--paper-2` (volt-on-light fails AA — `worlds/sports.md` Do/Don't; use `--accent-deep`) |

`--accent-alt` (away orange) is **reserved** and unused in v1 — a single shot
has no rivalry pair. (If a future variant overlays a second, comparison shot,
orange is its color, per `worlds/sports.md`; not this blueprint.) No other
colors; the two-tone discipline is white ball + volt flight over chalk.

## 7. Fallback design (first-class)

Build-time SVG computed with the SAME `ballistics.ts` (same constants, same RK4,
same stop conditions — the flown polyline and the printed arc are byte-identical
sample sets), a **side-elevation projection down the pitch** so both the height
(dip/lift) and the lateral swerve read. viewBox `0 0 720 380`:

- **Two stacked panels** sharing one x-axis (downrange metres, `0'`→shooter, a
  mono `— m` rail under both — the world's minute-rail motif adapted to distance):
  - **Top panel (elevation, side-on):** downrange `x` vs height `y`. Real path
    `--accent` @ 0.9, ghost parabola `--ink` @ 0.22 dashed, the ball as a
    3.2px-radius `--ink` circle resting at the goal end, goal posts as a 2.44 m
    vertical `--ink` @ 0.9 tick. Height axis mono labels (0, 1, 2, 3 m).
  - **Bottom panel (plan, top-down):** downrange `x` vs lateral `z`. Real path
    curving to its goal-line crossing, ghost dashed running straight, the goal
    mouth drawn as a `width_m` `--ink` @ 0.9 segment on the goal line, and the
    **swerve bracket** — a `--accent-deep` span between the two crossings with
    the mono label `swerve {Δz} m` (this is the printed money-shot; the number
    is the story).
- The chalk feel: panel frames + the box/arc footprint in `--ink` @ 0.35 with
  `stroke-linecap: round`; transparent SVG background (CANON §4 / AGENTS §5).
- **The readout ledger** below the SVG (`.vz-legend` rows — the AT-readable data
  source, this world's scoreboard idiom in text): `launch {v0} {unit} · {elev}°
  · {spin} rev/s`, `flight {t_flight} s · apex {y_max} m`, `swerve {Δz} m at goal`.
  **Rows are ≤ 5; there are exactly 3 — no collapse needed** (CANON §4.5 —
  well under the ceiling).
- Caption chips (`replay ×3 slow-mo` only on the live scene; `swing not modeled`
  when cricket) via the standard `.px-viz__cap` pattern. The fallback shows the
  `swing not modeled` chip but never the slow-mo chip (nothing replays in print).

## 8. Interaction spec

- Drag = orbit the shot (pitch clamp ±0.9; startPitch 0.42 reads as
  "behind the shooter, raised"), wheel/pinch = zoom (0.7–2.8), `touch-action:
  pan-y` (vertical page scroll sacred). Hint chip: `drag to orbit · scroll to zoom`.
- Hover/tap the arc or ball → `hoverLift` + tooltip, content template:
  `<b>{shot.label}</b><br>{v0} {speedUnit} · {spinRevPerS} rev/s spin<br>swerve
  {Δz} m · flight {t_flight}s{note ? `<br>{note}` : ''}`. Values from the
  integrated samples (`t_flight` = last sample `t`; `Δz` from §4), formatted
  mono tabular. Anchor: hovering the example arc shows
  `Roberto Carlos vs France, 1997 — 38 m/s · 10 rev/s spin · swerve ~6.3 m ·
  flight ~1.0s`.
- **The ONE control (CANON §9 one-control-max):** a single **REPLAY** mono pill
  button, top-right of the mount, that re-flies the ball along the real polyline
  (`orbitBody`, §5). Implemented via the existing `data-viz3d-state` chip bridge
  in `runtime.ts` (the same MutationObserver path `chamber` uses): the chip sets
  `data-viz3d-state="replay"`; the runtime, owning the handle, calls
  `handle.setState('replay')` which restarts the flight tween. `aria-pressed`
  is momentary (returns to false when the flight ends). No slider, no scrubber —
  one button (rule 2 of the reader-agency pattern, `coalition-calculus` §8).
  The chip is `hidden` until the island boots (dead controls never show); no-JS
  gets the composed still with the arc fully drawn and no chip.
- Keyboard/AT: REPLAY is a real focusable `<button>`; the canvas is
  `aria-hidden`; the fallback readout ledger + the plain line carry the full
  content (launch params, flight time, swerve). A reader who never presses
  REPLAY still sees the whole shot (composed still) — interaction only re-plays
  it (CANON §9: interaction reveals *more*, never the point).

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "The bright line is
  the ball's real curved flight; the faint dashed line is the straight path it
  would have taken with no air. The gap between them is how much the spin bent it."
- **how** (ExpandModal): "Drag to look around the shot, scroll to zoom. Press
  REPLAY to watch the ball fly the arc again."
- Caption guidance: state the swerve/dip claim in metres ("ten revs a second
  bent the ball three metres"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 60 words — swerve label 3 + goal/axis
  mono ticks ~6 + REPLAY 1 + 3 readout-ledger rows ~24 + caption ~18 + plain ~24
  … caption + plain dominate; on-canvas text (swerve label + ticks + chip) is
  ~12 words, well under 80. The ledger is 3 rows (no collapse). Keep `note` ≤ 10
  words (behind the hover, doesn't count at rest).

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices | ≤ 20k (≤2 polylines ×~200 pts + ball sphere 16×12 + goal box + chalk lines + net grid) |
| Draw calls | ≤ 18 |
| Instancing | not needed (one ball, no swarms) |
| SVG nodes (fallback) | ≤ 500 (two panels, two polylines, axes, ledger) |
| `data` payload | ≤ 2 KB |
| Extra assets | none (no geo fetch, no textures, no footage) |

Scene is its own lazy chunk via the scenes registry (`scenes/index.ts`) — no
eager imports; `three` loads only when the `[data-viz3d]` mount scrolls in.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test (the still reads as a
      captioned diagram) · 375px no overflow, labels ≥ 9.5px, REPLAY target
      ≥ 44px · reduced-motion still = the fallback SVG (arc fully drawn, ball at
      impact, no flight) · token grep (only the declared `--ink`/`--accent`/
      `--accent-deep` tokens; no hex literals) · caption + source + plain all
      render · lazy boot + `pagehide` dispose + three-chunk absent from non-3D
      pages · payload degradation (missing `spinAxis`→[0,1,0]; missing `goal`→
      sport default; missing `showGhost`→true) · `px-fball` prefix unique
- [ ] `ballistics.integrate` on the physics-sheet anchor (30 m, v0=25 m/s,
      8 rev/s sidespin) yields **lateral deviation 2–3 m** vs the ghost at the
      goal line (recompute in a unit test; both scene + fallback call the same fn)
- [ ] Example payload (recomputed §4 anchor): the real path crosses the goal
      line at **z ≈ 2.16 m** (inside the 3.66 m half-mouth), **y ≈ 1.13 m**
      (under the 2.44 m bar), ghost at z ≈ −4.10 m → the `swerve` label reads
      **~6.3 m** in ~1.0 s; the caption's "more than six metres" is earned by
      the computed number (NOT asserted — the shot both scores and swerves)
- [ ] The flown WebGL polyline and the fallback SVG polyline are the SAME sample
      array (diff the `integrate()` inputs — one source of truth, no drift)
- [ ] `slowmo: 3` renders the live chip `replay ×3 slow-mo`; `slowmo: 1` renders
      no chip; the fallback never renders the slow-mo chip
- [ ] `sport: cricket` renders the `swing not modeled` chip in BOTH live and
      fallback
- [ ] REPLAY (the only control) re-flies the ball once, decelerating along the
      arc (marker speed = sample speed), then rests on the impact ring;
      `aria-pressed` returns to false at flight end; no second control exists
- [ ] Hovering the arc shows "Roberto Carlos vs France, 1997 — 38 m/s · 10
      rev/s spin · swerve ~6.3 m · flight ~1.0s" *(Corrected 2026-07-06: was
      "swerve ~3.0 m · flight ~0.9s" — stale numbers from the physics-sheet's
      2–3 m sanity case; the recomputed example anchor (§4, §8) is swerve ≈ 6.3 m
      in ≈ 1.0 s, and the hover tooltip reads the same integrated samples.)*
- [ ] Ghost path is dashed `--ink` @ 0.22 and the real path volt @ 0.9; the
      chalk lines carry `stroke-linecap: round` in the fallback SVG
- [ ] Fallback SVG: two panels (elevation + plan) share the downrange rail, the
      plan panel shows the swerve bracket + metre label, ledger has 3 rows — all
      readable with zero JS (view-source check)
- [ ] Draw calls ≤ 18 (renderer.info in a debug log — remove after); RAF pauses
      off-screen; disposes the ball geometry + glow texture + line geometries on
      `pagehide`

---

*Registry duties (P6, at implementation — NOT now): add `flight-of-the-ball` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry
(`src/lib/explainers.ts`), register the scene in
`src/scripts/viz3d/scenes/index.ts` (lazy), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog` must pass), document the
`px-fball` prefix in `src/components/AGENTS.md` §4, and add a worked example to
`src/content/issues/2026-06-03-sports-showcase`. Do NOT edit SECTION_KINDS or
catalog.md at blueprint time.*
