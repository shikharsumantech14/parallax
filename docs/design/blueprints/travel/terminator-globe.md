# Blueprint — `terminator-globe` (travel · WebGL · FLAGSHIP + world signature)

> THE travel hero: a real Earth with the live day/night line drawn on it for
> the story's instant, and the flight arc laid across it — so the reader *sees*
> the jet lag. On the example westbound leg the plane departs in daylight,
> crosses the terminator over the night side of the Pacific, and lands back into
> daylight only three clock-hours later — even though sixteen have passed, which
> is the whole reason the body is wrong. *(Corrected 2026-07-06: the prior
> framing said the leg "lands into a night"; for DEL→SFO both endpoints are in
> daylight — see §3/§7 — because flying west chases the sun. The honest jet-lag
> hook is the clock that barely moves, not a night arrival; an eastbound variant
> would land into night and the state chips would show it.)* "The reason your
> body is wrong, drawn on the actual planet." Extends the shared
> `buildCountryGlobe` machinery (`scenes/globe.ts`) exactly as `routeGlobe` does
> — same occluder, same country line-art, same label layer — and adds three
> honest layers: the subsolar-anchored terminator, the night wash, and the
> great-circle flight arc with its endpoint local-clock readouts.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `terminator-globe` |
| World | travel |
| Tier | WebGL (extends globe; picking + one setState) |
| Component | `src/components/topic/travel/TerminatorGlobe.astro` |
| Scene module | `src/scripts/viz3d/scenes/terminatorGlobe.ts` |
| Shared math | `src/scripts/viz3d/kepler.ts` — `subsolarPoint()` and `greatCircle()` (both already exist, both pure; NO new module needed — the fallback SVG calls the same two functions at build time) and `scenes/globe.ts` `latLon()` |
| CSS prefix | `px-tglobe` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, AGENTS.md §4 table) |
| Flagship reference | `routeGlobe.ts` (globe reuse + arc math), `solarSystem.ts` (settle-in, tooltip, camera/controls), `chamber.md` (setState chip bridge, fallback-from-shared-math discipline) |

## 2. What it shows / when to use

Where the sun is right now versus where the traveller is going — the day/night
line on a real globe, with the flight arc crossing it, so the mismatch between
clock-time and body-time reads at a glance.

- **USE WHEN:** a jet-lag / time-zone / "why the red-eye wrecks you" story with
  **exactly one flight** given as origin + destination `{lat, lon, city, tz}`
  (IANA offset in hours), an `epoch` ISO instant (usually the departure moment),
  and a flight duration. The story hinges on the terminator geometry — the leg
  crossing from day into night, or chasing the sun.
- **DON'T USE:** a multi-stop journey arced across the globe (→ `route-globe`,
  which owns 2+ legs and has no terminator); city offsets compared as a bar/arc
  with no globe (→ `timezone-arc`); a regional route with texture (→
  `journey-map`); pure geometry with no time-of-day angle (→ `route-globe`).
- **Pairs with:** `layout: split` as the issue hero — the prose walks departure
  → crossing → arrival while the globe holds and `setState('arrival')` advances
  the sun to the landing instant; `wide` standalone. Never adjacent to another
  WebGL kind (CANON §2). Never `bleed` (a globe centred in air needs the frame,
  not the edge).

## 3. Data schema

```ts
interface TerminatorGlobeData {
  epoch: string;                 // REQUIRED. ISO instant the day/night line is drawn for
                                 //   (default story intent: the departure moment, UTC).
  from: {                        // REQUIRED. departure city
    city: string;                // "Delhi"
    lat: number; lon: number;    // degrees, +N / +E
    tzOffsetH: number;           // local UTC offset in HOURS (e.g. +5.5 for IST, −8 for PST)
  };
  to: {                          // REQUIRED. arrival city — same shape
    city: string; lat: number; lon: number; tzOffsetH: number;
  };
  flightHours: number;           // REQUIRED. block time, hours (arrival epoch = epoch + flightHours)
  arcBulge?: number;             // arc lift factor h (geodesy §2), default 0.14 (clamped 0.05–0.18)
  showEoT?: boolean;             // include equation-of-time in the subsolar longitude; default true
                                 //   (subsolarPoint() already applies it — this flag is documentary,
                                 //    the caption never claims sub-degree precision either way)
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (the classic body-clock wrecker: Delhi → San Francisco, a red-eye)
epoch: "2026-01-15T02:30:00Z"       # 08:00 IST departure from DEL
from: { city: "Delhi",         lat: 28.5562, lon:  77.1000, tzOffsetH: 5.5 }
to:   { city: "San Francisco", lat: 37.6213, lon: -122.3790, tzOffsetH: -8 }
flightHours: 16.5
caption: "You leave Delhi at 08:00 and land in San Francisco at 11:00 the same morning — 16½ hours in the air for a clock that barely moved, which is exactly why your body lands 13.5 hours out of phase."
source: "Great-circle distance from airport coordinates; UTC offsets IST/PST."
```

**Data flags with visual consequences (CANON §7):**
- The live scene AUTO-RENDERS the mono chip `` sun advances {rate} ×`` only if
  the day→night sweep is animated between states; v1 does NOT continuously
  advance the sun (the terminator is a fixed geometry per state, see §5) so **no
  time-compression chip is needed at rest** — the two states are two honest
  instants, not a sped-up movie. The `epoch` and arrival instant are stated as
  literal local clocks on the endpoints, which is the honesty.
- The subsolar point is an approximation (±1°, `geodesy.md §3`); the caption
  states clock offsets, never sub-degree sun positions, so no accuracy chip is
  required. If a future variant animates the sun, it inherits `solar-system`'s
  `orbitBody` chip rule verbatim.

## 4. Geometry spec

**Shared math (mirrors `geodesy.md`; identical call sites in scene AND fallback):**

- **Subsolar point:** `subsolarPoint(epoch)` → `{lat, lon}` (kepler.ts, geodesy
  §3, EoT included). This is the sun's ground point; the day hemisphere is the
  90° cap around it.
  **Acceptance anchor (recomputable):** `subsolarPoint("2026-06-21T12:00:00Z")`
  → N = 172, δ = **+23.438°**, λ_ss = **−0.375°** (EoT = −1.50 min → −0.375°).
  A reviewer recomputes: δ = 23.44·sin(2π·(172−80)/365.24) = 23.44·sin(90.67°) ≈
  23.438; λ_ss = −15·(H − 12) + EoT_min/4 = −15·(12 − 12) + (−1.5)/4 = **−0.375**.
  *(Corrected 2026-07-06: geodesy §3 ADDS the equation-of-time in degrees
  (`EoT_min ÷ 4`) to `λ_ss = −15·(H − 12)`. The prior anchor wrote it as
  `−15·(H − 12 + EoT_min/60)`, which distributes to `−EoT_min/4` — the EoT term
  with the WRONG sign — yielding +0.375° instead of −0.375°. Same
  formula-fitted-to-a-pre-decided-answer class as `power-flow`'s dash-rate bug.
  Magnitude is sub-degree (inside the sheet's ±1° tolerance) but the sign and the
  mirrored formula must match `geodesy.md §3` symbol-for-symbol; `subsolarPoint()`
  in `kepler.ts` is the single source of truth for both scene and fallback.)*
- **Terminator ring:** the great circle 90° from the subsolar point. Build it as
  `greatCircle()` is NOT directly usable (it takes two endpoints, not a pole), so
  sample the ring explicitly: for `b` = 0…360° in 128 steps, the terminator point
  at bearing `b` from the subsolar antipode is
  `latLon()`-fed from the standard pole-circle formula —
  `lat_t = asin(cos c·sin φ_s + sin c·cos φ_s·cos b)` with `c = 90°`,
  simplifying to `lat_t = asin(cos φ_s·cos b)`,
  `lon_t = λ_s + atan2(sin b·sin c·cos φ_s, cos c − sin φ_s·sin lat_t)` →
  with c = 90°: `lon_t = λ_s + atan2(sin b, −sin φ_s·cos b)`
  (φ_s, λ_s = subsolar lat/lon). Draw as a 128-seg `LineSegments` at `R·1.004`.
- **Night wash:** the anti-sun hemisphere darkened. Implemented the
  paper-occluder way (CANON §4: NO shader) — a **half-sphere cap mesh** (a
  `SphereGeometry` `phiStart/phiLength` hemisphere) oriented so its pole points
  at the *antisolar* direction `latLon(−φ_s, λ_s+180)`, radius `R·1.006`,
  `MeshBasicMaterial` `--ink` @ **0.28** (geodesy §3), `transparent`,
  `depthWrite:false`, `side: THREE.FrontSide` — it tints only the far-from-sun
  hemisphere's country lines, reading as dusk. (The near-side country lines
  under it stay legible because 0.28 is a wash, not a mask.)
- **Flight arc:** `greatCircle(from, to, 64)` → 65 lat/lon points; each fed
  through `latLon(THREE, p.lat, p.lon, R·(1 + h·sin(π·t)))`, `t = k/64`,
  `h = arcBulge` (default 0.14). Exactly the `routeGlobe` treatment. Endpoints
  are 0.05-radius accent spheres at `R·1.02` (reusing the routeGlobe pin size).
- **Ground distance readout:** `d = R_E·Δ` where `Δ = acos(a·b)` of the two unit
  vectors, `R_E = 6371` (geodesy §1/§2). **Acceptance anchor:**
  DEL(28.5562, 77.10) → SFO(37.6213, −122.379) → Δ = **111.35°**, d ≈ **12,382
  km** (recomputable).
- **Frame / coordinates:** the shared globe frame — `latLon()` (geodesy §1,
  Y-up, the world-atlas orientation). Scene sphere radius **R = 1.4** (matches
  `routeGlobe`). Group rotation carries drag yaw/pitch; the sun/terminator/night
  geometry lives in the SAME group as the country lines, so it rotates with the
  Earth (the sun is fixed in space → as the reader spins the globe, the
  terminator stays put relative to the countries, which is correct: it is drawn
  ON the Earth for a frozen instant).
- **Camera:** PerspectiveCamera FOV **40**, position `(0, 0.35, 5.0)·zoom`,
  lookAt origin — copied from `routeGlobe` so the whole globe + arc fit (R7:
  the outermost feature, here the bulged arc apex at ≈ R·1.16 = 1.62, sits well
  inside frame). `makeOrbitControls`: startPitch **0.30**, minZoom **0.72**
  (globe + arc always fully framed — never crops, R7), maxZoom **2.4**,
  **autoRotate: true** (travel's slow `orbitIdle` — the world's one sanctioned
  ambient drift, `worlds/travel.md`).
- **Initial framing:** on boot, rotate the group so the **arc midpoint** faces
  the camera — yaw seeded to `−(midLon + 180)°` in radians (so the crossing,
  the whole point, is what you see first). The reader can spin away from it.
- **Size constants:** endpoint spheres 0.05 r (14×14); arc line 1px (WebGL line,
  opacity per §6); terminator line drawn 2× (an inner `R·1.004` @ 0.9 + a faint
  `R·1.002` shadow @ 0.3 for a drawn-with-ink weight). All identical at 375px —
  the scene doesn't reflow; labels move via the shared label layer.
- **Labels (shared `makeLabels` layer):** the two city names (priority 1,
  `data` kind) anchored at `latLon(city, R·1.08)`; the major-country labels from
  `loadGeo()` (priority 0, `country` kind) exactly as routeGlobe. A single
  `SUBSOLAR` mono tick (priority 2) at the subsolar ground point `latLon(φ_s,
  λ_s, R·1.03)` — small, so the reader can find "where it's noon". Collision +
  far-side hiding handled by the existing label layer (no new logic).

## 5. Motion spec (names from motion.md)

- **Boot `settle`:** the globe fades in with its country lines (existing globe
  build); then, **starting together at t = 0 of the reveal (concurrent, NOT in
  series)**, the terminator ring `sweep`s on (stroke-style draw emulated by
  growing the drawn segment count 0→128 over 900 ms `--ease`), the night wash
  fades opacity 0→0.28 over 600 ms, and the flight arc `sweep`s from `from` to
  `to` (grow drawn points 0→65 over **1400 ms** — travel's slower signature
  sweep, `worlds/travel.md`); endpoints `settle` (scale 0→1) as the arc reaches
  each. Because the three draws overlap, the **arc sweep is the long pole**: the
  full sequence lands at 1.4 s + city settle 0.15 s = **1.55 s ≤ 1.6 s**
  (motion.md stagger budget). City labels fade in last, within that window.
  *(Corrected 2026-07-06: made the concurrency explicit — read serially
  (terminator 900 + night 600 + arc 1400 + settle 150 = 3.05 s) the sequence
  blows the ≤1.6 s budget; the three layers MUST share a start so the 1.4 s arc
  is the long pole. The prior "then … then" phrasing left this ambiguous.)*
- **`orbitIdle`:** the globe's gentle auto-yaw when not dragged (built into the
  globe's drag controller / `makeOrbitControls autoRotate`, travel's slow rate).
  This is the ONE ambient motion (motion.md continuous-budget: one scene motion).
- **`stateSwitch`** (`departure` ↔ `arrival`): the ONLY state change. On
  `setState('arrival')` the sun/terminator/night are recomputed for the arrival
  instant (`epoch + flightHours`) and the terminator ring + night wash `settle`
  to the new geometry over 600 ms (ring vertices lerp; wash pole slerps). The
  arc, endpoints, and country lines do not move (the route is the same; only the
  sun advanced). The endpoint clock readouts (§8) swap to the arrival-instant
  local times. `departure` returns them.
- **`hoverLift`:** hovering either city endpoint scales it ×1.35 + shows its
  tooltip (§8); the other endpoint is undimmed (a globe scene reads dimming as a
  lighting flicker — same deviation `solar-system` records; noted on purpose).
- **Composed still (reduced-motion / print / fallback):** the `departure` state
  — globe at the seeded arc-facing yaw, terminator drawn, night wash on, flight
  arc complete, both endpoints + city labels + the `SUBSOLAR` tick visible, the
  endpoint clock readouts showing departure-instant local times. Reduced-motion
  never boots WebGL; the **build-time fallback SVG IS this still**, computed with
  the same `subsolarPoint()` + `greatCircle()` at the same `epoch`.
- Entrance order (z-/priority order, not a strict serial timeline — the
  terminator, night wash and arc draws OVERLAP per the concurrency note above):
  globe first → then terminator + night wash + arc reveal together → endpoints
  settle as the arc reaches them → city labels → clock readouts last. No `stamp`
  (travel closes with a stamp only on arrival-marker furniture, not on this
  figure).

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| country coastlines / borders | `--ink` @ 0.42 (shared globe build) |
| graticule | `--ink` @ 0.07 (shared globe build) |
| occluding sphere | `--paper` @ 1.0 (shared globe build) |
| night-hemisphere wash | `--ink` @ **0.28** (geodesy §3 — the one fixed encoding: night = ink dusk, NOT a themeable choice; declared here) |
| terminator line | `--ink` @ 0.9 (inner) + `--ink` @ 0.3 (shadow) — the day/night boundary is structure, drawn in ink not accent |
| flight arc | `--accent` @ 0.85 (terracotta = the journey, `worlds/travel.md`) |
| city endpoints | `--accent` @ 1.0 |
| `SUBSOLAR` tick + city labels | shared `viz3d__label` (mono/`data` classes) |
| clock readouts / tooltip | shared `.viz3d__tip` styling (mono tabular) |

Two-role discipline: **ink draws the planet and the shadow it casts on itself;
terracotta is the one thing a human is doing on it (the flight).** No teal in
v1 — there is one route, not a comparison (teal is reserved for `route-globe`'s
sea legs / alternative routes, `worlds/travel.md`). `--accent-alt` unused.

## 7. Fallback design (first-class)

Build-time SVG computed in the component frontmatter with the SAME
`subsolarPoint(epoch)` + `greatCircle(from, to)` — an **orthographic globe**
centred on the arc midpoint (so the crossing faces the reader, matching the live
seeded yaw), viewBox `0 0 720 460`:

- **Projection:** orthographic sphere of radius `Rpx = 180`, centred at (360,
  220), rotated so the arc-midpoint lon/lat is the near point. Standard
  ortho: a lat/lon is visible iff its unit vector's dot with the view axis > 0;
  project visible points to `(cx + Rpx·x', cy − Rpx·y')`. Country outlines
  (Natural Earth 50m via `readFileSync` per AGENTS.md §5), clipped to the
  near hemisphere, `--ink` @ 0.42; graticule @ 0.10.
- **Terminator:** the 128-sampled ring (same formula as §4), drawn as a 1.5px
  `--ink` @ 0.9 path, clipped to the visible hemisphere.
- **Night wash:** the antisolar hemisphere as a filled `--ink` @ 0.28 region —
  a clipped path of the night cap's visible extent (the dusk side of the
  terminator on the near face). This is the print edition of the day/night line.
- **Flight arc:** the 64-seg great circle projected the same way, `--accent` @
  0.85, 1.5px; endpoints as 4px accent dots with 9.5px Fraunces-italic city
  labels (travel's place-name treatment) + paper halo (`paint-order`).
- **The stub readout (travel signature furniture):** below the globe, a
  `.px-tglobe__stub` ticket-stub card (`--tape` fill, perforated edge per
  `worlds/travel.md` motif 1) carrying the honest numbers as a mono ledger:
  `DEL → SFO · 12,382 km · dep 08:00 IST · arr 11:00 PST · 13.5 h out of
  phase`. Arrival local clock = `epoch + flightHours` converted to `to.tzOffsetH`;
  "out of phase" = `|from.tzOffsetH − to.tzOffsetH|` hours. This card is the
  **AT-readable data source** and the whole point stated in words. *(Corrected
  2026-07-06: the arrival clock was written `00:30 PST (+1)`; the payload's own
  arithmetic is epoch 02:30Z + 16.5 h = 19:00Z → SFO UTC−8 = **11:00 PST, same
  calendar day** — a late-morning, in-daylight arrival. The old value contradicted
  the epoch and the "lands into night" caption; the honest reading is that only
  three clock-hours pass for sixteen-and-a-half in the air.)*
- **Legend collapse (REVIEW-2026-07-05 amendment 3):** only two rows here (the
  two cities) — well under the 5-row collapse threshold, so no disclosure needed.
- Caption chips: none at rest (§3 — no time-compression, no log scale). The
  `.px-viz__cap` caption + `.px-plain` line render as standard.

## 8. Interaction spec

- Drag = rotate the globe (pitch clamp ±0.9, startPitch 0.30), wheel/pinch =
  zoom (0.72–2.4), `touch-action: pan-y` (mandatory — vertical scroll sacred).
  Hint chip: `` drag to spin · scroll to zoom ``.
- Hover/tap a city endpoint → tooltip (mono tabular):
  `` <b>{city}</b><br>{localClock} local · {tzLabel}<br>{dayOrNight} now ``
  where `localClock` = the endpoint's local time at the **current state's
  instant** (departure or arrival), `tzLabel` = `UTC{±offset}`, and
  `dayOrNight` = whether that city's lon is inside the day cap of the current
  subsolar point ("in daylight" / "in darkness"). Template example (departure
  state, epoch 02:30Z): `` Delhi — 08:00 local · UTC+5:30 · in daylight ``;
  `` San Francisco — 18:30 local (prev day) · UTC−8:00 · in darkness ``.
  *(Corrected 2026-07-06: SFO local at the 02:30Z departure instant is
  02:30 − 8:00 = 18:30 the previous calendar day, not 21:00 — the earlier value
  didn't match the epoch. "In darkness" is correct: SFO is ~108° from the
  departure-instant subsolar point, well inside the night hemisphere.)*
- **State chips (the one control, CANON §9 ≤3 states — here 2):** two mono pill
  buttons over the mount top-right — `` DEPARTURE `` / `` ARRIVAL — {arr local}
  ``, `aria-pressed`, keyboard-focusable, tab order departure→arrival. They set
  `data-viz3d-state="departure|arrival"` on the mount; the runtime's state-chip
  bridge (the ~8-line MutationObserver added for `chamber`, reused here — zero
  new runtime cost) calls `handle.setState`. This is the ONE control (no slider,
  no scrubber — the two instants that matter are departure and arrival).
- Keyboard/AT: chips are real `<button>`s; the canvas is `aria-hidden`; the
  fallback stub-ledger + the two city rows carry the full data; the plain line
  explains the form. The `dayOrNight` and clock facts a hover would give are all
  present statically in the stub card.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "A real globe lit for one moment —
  the shaded half is night, the line across it is where day meets dark, and the
  terracotta arc is your flight crossing from one into the other."
- **how** (ExpandModal): "Drag to spin the Earth; scroll to zoom. Hover either
  city for its local clock — and press ARRIVAL to jump the sun forward to when
  you land."
- Caption guidance: state the phase-mismatch claim ("13.5 hours out of phase",
  "sixteen hours aloft for a clock that moved three"), never restate the form.
  Match the claim to the ACTUAL geometry of the leg in the payload — a westbound
  DEL→SFO lands in daylight, so don't write "into the night"; an eastbound leg
  that truly lands after dark may. *(Corrected 2026-07-06: replaced the
  "lands into a night your body calls afternoon" exemplar, which is false for the
  example DEL→SFO payload — see the header note and §3.)*
- **Text budget (CANON §4.5):** at rest ≈ 60 words — 2 city labels + SUBSOLAR
  tick (1) + 2 chip labels (~4) + the stub-ledger one-liner (~14) + caption
  (~20) + plain (~30 → trim the authored caption if the sum nears 80). City
  tooltips + country labels are behind interaction / progressive and don't count
  at rest. The stub ledger is one line, not a paragraph — the FORM carries it.

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices (WebGL) | ≤ 40k (country lines ~30k shared + terminator 128 seg + night hemisphere 32×16 + arc 64 seg + 2 spheres 14×14) |
| Instances | not needed (2 endpoint meshes) |
| Draw calls | ≤ 16 (occluder + graticule + borders + terminator ×2 + night cap + arc + 2 pins) |
| SVG nodes (fallback) | ≤ 900 (near-hemisphere country paths dominate; standard globe budget) |
| `data` payload | ≤ 1.5 KB |
| Extra assets | `/geo/countries-110m.json` (scene, shared, already lazy-fetched by `loadGeo`) + `countries-50m.json` (fallback build-time `readFileSync`, existing dep) — no new asset |

WebGL scene is its own lazy chunk via the scenes registry — no eager imports;
disposes on pagehide; three-chunk absent from pages without a 3D kind.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px, targets ≥ 44px · reduced-motion still = fallback SVG ·
      token grep (only the declared night-wash `--ink` @ 0.28 encoding) ·
      caption + source + plain · lazy boot + dispose + chunk isolation · payload
      degradation (missing `arcBulge` → 0.14) · prefix unique
- [ ] `subsolarPoint("2026-06-21T12:00:00Z")` → δ ≈ +23.438°, λ_ss ≈ −0.375°
      (recompute anchor per geodesy §3 `λ_ss = −15·(H−12) + EoT_min/4`; drives
      both scene and fallback terminator)
- [ ] DEL→SFO ground distance from the example payload = 12,382 km (Δ = 111.35°;
      the stub-ledger shows it), and "out of phase" = 13.5 h (|5.5 − (−8)|)
- [ ] Terminator ring is the 90° circle about the subsolar point (a city on the
      day side reads "in daylight", one on the night side "in darkness")
- [ ] Night wash covers exactly the antisolar hemisphere at `--ink` @ 0.28 and
      leaves near-side country lines legible
- [ ] Flight arc sweeps `from`→`to` over 1400 ms; endpoints settle as it arrives
- [ ] `ARRIVAL` chip advances the sun to `epoch + flightHours`: the terminator
      settles to the new geometry, the arc/route does not move, and both city
      tooltips + the chip label show arrival-instant local clocks
- [ ] `DEPARTURE` chip returns the sun to `epoch`
- [ ] Hovering Delhi (departure state, example) shows
      "Delhi — 08:00 local · UTC+5:30 · in daylight"
- [ ] Fallback SVG: orthographic globe centred on the arc midpoint, terminator +
      night wash + arc + 2 city labels + the stub-ledger, readable with zero JS;
      no ARRIVAL state (single composed departure instant, per §7)
- [ ] Zoom clamps hold on wheel AND pinch; a vertical pan gesture scrolls the
      page (never hijacked); the globe + arc apex never crop at minZoom (R7)
- [ ] The three chunk + terminatorGlobe chunk are absent from pages without the
      kind (check dist)

---

*Registry duties (P6, at implementation — NOT now): add `terminator-globe` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog`), document the `px-tglobe`
prefix in `src/components/AGENTS.md` §4, register the scene in
`src/scripts/viz3d/scenes/index.ts`, and add a worked example to
`2026-06-03-travel-showcase`.*
