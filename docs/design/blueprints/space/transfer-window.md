# Blueprint — `transfer-window` (space · SVG interactive scrubber · the launch-window explainer)

> Why you can only go to Mars every 26 months. Two circular orbits, the Hohmann
> ellipse that connects them, and a **phase scrubber** the reader drags to sweep
> the departure planet around its orbit — the transfer ellipse and the arrival
> geometry update live, and the readout says whether *this* phase angle actually
> arrives at the destination. The window is not a date on a chart; it is a
> geometry that lines up. One control: the phase scrubber.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `transfer-window` |
| World | space |
| Tier | SVG interactive (build-time base geometry + one tiny vanilla `is:inline` island driving a single range scrubber; no WebGL, no three.js) |
| Component | `src/components/topic/space/TransferWindow.astro` |
| Scene module | n/a |
| Shared math | `src/scripts/viz3d/kepler.ts` — `hohmannDv(r1, r2, mu)` (§6, EXISTS) for Δv + transfer time; plus 3 closed-form phase lines computed identically in the Astro frontmatter (build-time base state) and the inline island (scrub updates). The §11 anchors force the two sites to agree — a shared module for three expressions is overhead, not safety (the `coalition-calculus` precedent) |
| CSS prefix | `px-xwin` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `coalition-calculus` §8 (THE reader-agency pattern — data-at-rest / one control / `aria-live` verdict / keyboard-complete), `power-flow` (build-time SVG + single accent), `ClimateSpiral` (build-time polar geometry + reveal) |

## 2. What it shows / when to use

The orbital geometry of an interplanetary transfer and why departures are
periodic: the Hohmann ellipse between two circular orbits, and the phase angle
the departure body must have for the ellipse to actually meet the destination.
The Δv cost and flight time are stated, computed, on screen.

- **USE WHEN:** the story is a specific transfer between two roughly-circular
  coplanar orbits — an interplanetary launch window (Earth→Mars, Earth→Venus),
  a Hohmann orbit-raise (LEO→GEO), or the cadence of opportunities. The dossier
  needs the two orbital radii (or altitudes) and the central body's μ.
- **DON'T USE:** a highly eccentric or plane-change-heavy real trajectory (the
  Hohmann idealization would lie — say so and use `solar-system` with the real
  elements); the full solar-system context of the object (→ `solar-system`);
  a pure Δv budget breakdown with no window idea (→ `delta-v-ladder`); ascent
  from a surface (→ `trajectory-arc`).
- **Pairs with:** `wide` standalone; hero-capable for launch-window issues.
  **Never `layout: split`** — in split, scroll is the control (CANON §9); a
  scrubber inside split would be two competing controls. This is the standing
  reader-agency rule (`coalition-calculus` §2).

## 3. Data schema

```ts
interface TransferWindowData {
  central: { name: string; mu: number };   // "Sun", μ in km³/s² (Sun 1.327e11;
                                            // Earth 3.986e5 for LEO→GEO)
  from: { name: string; radiusKm: number; periodDays?: number };  // departure orbit
  to:   { name: string; radiusKm: number; periodDays?: number };  // destination orbit
                          // periodDays optional: if absent, computed from radius+mu
                          // via T = 2π√(r³/μ) (circular). Needed for the synodic period.
  distanceUnit?: 'AU' | 'km';   // readout unit for radii; default 'km', 'AU' for
                                // heliocentric (1 AU = 1.496e8 km). Display only.
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Earth → Mars Hohmann, the canonical window)
central: { name: "Sun", mu: 1.327e11 }
from: { name: "Earth", radiusKm: 149600000, periodDays: 365.25 }
to:   { name: "Mars",  radiusKm: 227900000, periodDays: 686.98 }
distanceUnit: AU
caption: "5.6 km/s and 259 days to Mars — but only if Mars leads Earth by 44°, which recurs every 780 days."
source: "Hohmann transfer, JPL heliocentric parameters"
```

**Data flags with visual consequences (CANON §7):**
- **Idealization chip (always).** The Hohmann model assumes circular, coplanar
  orbits and impulsive burns. The component AUTO-RENDERS the caption chip
  `` idealized · circular coplanar `` — the reader must know the real transfer
  is messier. (This is the honesty default for this kind; it never omits.)
- **Radial display is TRUE-ratio** for radii within ~6× (Earth/Mars = 1.52×
  reads fine); if `to.radiusKm / from.radiusKm > 6` (e.g. LEO→GEO = 6.6×) the
  component switches to a `sqrt`-compressed radial map and AUTO-RENDERS
  `` radii √-compressed `` — the inner orbit must stay visible, but the ring
  ratio is then not literal, and the chip says so.

## 4. Geometry spec

**The physics (`kepler.ts` `hohmannDv` + closed-form phase, per
`physics/orbital-mechanics.md` §6):**

- `r1 = from.radiusKm`, `r2 = to.radiusKm`, `mu = central.mu`.
- `{ dv1, dv2, tTransferSec } = hohmannDv(r1, r2, mu)`;
  `dvTotal = dv1 + dv2` (km/s); `tTransferDays = tTransferSec / 86400`.
- Periods: `T1 = from.periodDays ?? 2π√(r1³/mu)/86400`, likewise `T2`.
- **Synodic period** `S = 1 / |1/T1 − 1/T2|` days (window cadence, sheet §6).
- **Required phase angle at departure** (destination must be where the ellipse's
  apoapsis will be when the craft arrives): the destination travels
  `θ_arrival = 360·(tTransferDays / T2)` during the flight; it must end at the
  apoapsis (180° from departure), so at departure the destination must lead by
  `φ_required = 180° − θ_arrival` (normalize to (−180, 180]).

**Worked anchors (COMPUTABLE — recompute with the example payload):**
- `√(μ/r1) = √(1.327e11/1.496e8) = 29.78 km/s` (Earth's heliocentric speed).
- `dv1 = 29.78·(√(2·2.279e8/3.775e8) − 1) = 29.78·(1.0988 − 1) = 2.94 km/s`.
- `dv2 = 24.13·(1 − √(2·1.496e8/3.775e8)) = 24.13·(1 − 0.8903) = 2.65 km/s`.
- **`dvTotal ≈ 5.59 km/s`** (sheet's ~5.6 sanity check).
- `tTransferSec = π√((3.775e8)³/(8·1.327e11)) = π·7.117e6 = 2.236e7 s`
  → **`tTransferDays ≈ 258.8 days`** (~259).
- `θ_arrival = 360·(258.8/686.98) = 135.6°`; **`φ_required = 180 − 135.6 =
  44.4°`** — at departure **Mars leads Earth by ~44°** (the outer, slower planet
  is ahead, so that after the craft coasts 180° to apoapsis while Mars advances
  135.6°, the two meet). *(Corrected 2026-07-06: the original parenthetical
  said "Earth must lead Mars… i.e. Mars leads Earth", tangling the direction —
  and the §3 caption said "Earth leads by 44°", which is backwards. Earth is the
  faster inner planet and departs BEHIND Mars.)*
- **Synodic** `S = 1/|1/365.25 − 1/686.98| = 1/0.0012822 = 779.9 days` (~780,
  the ~26-month cadence).

**The figure (viewBox `0 0 720 520`):**
- **Orbit rings:** central body a filled `--ink` @ 0.9 disc r = 8 px at center
  `(300, 260)` (offset left of center to leave a readout gutter on the right).
  `from` orbit a `--ink` @ 0.42 circle radius `R1`, `to` orbit `--ink` @ 0.42
  radius `R2`, where `R1 = 70 px`, `R2 = 70·(r2/r1)` px (TRUE-ratio; example:
  R2 = 106.6 px) — or the √-compressed map when the >6× flag trips
  (`R2 = 70·√(r2/r1)` capped at 210 px so it fits). Mono ring labels
  `{from.name}` / `{to.name}` at the ring's top, paper halo.
- **The departure body** (`from`): a `--accent` (cyan) filled dot r = 5 px on
  the `from` ring at scene-angle `α` (α = 0 at the 3-o'clock position, CCW
  positive), where `α = 180° − Δφ` is *derived* from the scrubbed relative phase
  `Δφ` (§8) — the scrubber sets `Δφ`, not `α` directly (see the next bullet).
- **The scrub variable is the relative phase `Δφ`** — the angle by which the
  departure body LEADS the destination's meeting point, and it is the value the
  scrubber sets directly (§8). The **destination body** (`to`) is an
  `--accent-alt` (amber) dot r = 5 px pinned at a **FIXED** scene-angle
  `β = 180°` (the 9-o'clock meeting point, opposite where the transfer ellipse's
  periapsis will sit); it does **not** move as the reader scrubs — it is the
  destination sitting in its own orbit. The **departure body** (`from`, cyan,
  §above) is then placed at scene-angle `α = β − Δφ = 180° − Δφ` so that the
  live gap between the two dots equals the scrubbed `Δφ`. The window opens when
  `Δφ = φ_required` (44.4° for the example ⇒ departure at `α = 135.6°`); every
  other `Δφ` is a non-window, which is exactly what makes the §8 verdict vary.
  *(Corrected 2026-07-06: the original text left a half-drafted, self-
  contradicting formula — it first placed the destination at `α + φ_current`,
  then struck it out with "no; …" and re-locked it to `α + φ_required`. Locking
  the destination to the departure body makes the two-body gap CONSTANT, so the
  verdict would read "WINDOW OPEN" at every scrub value — breaking the
  interaction and contradicting §8's `|scrub − φ_required|` math. Fix: the
  destination is FIXED; the scrubber sets the relative phase `Δφ`; the departure
  dot is derived from it. This keeps §8's verdict and the "opens at φ_required"
  claim exactly as written.)*
- **The Hohmann ellipse:** a semi-ellipse `<path>` from the departure dot
  (periapsis, on R1) to the opposite side (apoapsis, on R2), semi-major axis
  `a_t = (R1+R2)/2` px, drawn as the actual transfer half-orbit, `--accent`
  @ 0.8, 1.5 px. Redrawn each scrub so it always starts at the departure dot.
  A faint `--accent` @ 0.2 full ghost ellipse shows the complete transfer orbit.
- **The phase wedge:** a thin `--ink` @ 0.16 arc between the departure and
  destination radii near the center, with a mono label `Δφ {current}°` — the
  live phase angle between the two bodies.
- **The readout gutter** (right of the figure, `x ∈ [520, 708]`): mono telemetry
  block, `.vz-value` sizing, three lines that are STATIC (they describe the
  transfer, not the scrub): `Δv {dvTotal} km/s`, `t {tTransferDays} d`,
  `window every {S} d`, plus a mission-metadata header
  `{from.name} → {to.name}` (mono +0.08em, the space designation motif).
- **The verdict line** (the aria-live element, under the figure): compares the
  current scrub phase to `φ_required` — see §8.
- **375px:** viewBox scales fluidly; at ≤ 640px the readout gutter moves BELOW
  the figure as a 3-tile `.tel` row (it would crowd the rings at narrow width);
  the scrubber spans full width under everything; ring labels stay ≥ 9.5 px.

## 5. Motion spec (names from motion.md)

- Entrance (once, on scroll-in, `html.js`-gated): rings `reveal` (start 0) → the
  ghost transfer ellipse `sweep` (dashoffset draw, 900 ms, **starting 150 ms** —
  overlaps the ring reveal) → bodies `settle` (start 700 ms: the amber
  destination lands at its FIXED `β = 180°`, the cyan departure at the aligned
  `α = 180° − φ_required = 135.6°`, since the scrubber opens at `Δφ = φ_required`
  — i.e. **the composed still opens ALIGNED / at the window**) → readout
  `countup` on Δv, time, synodic (start 700 ms, concurrent with `settle`, 900 ms,
  tabular) → verdict `stamp` (start 1400 ms) if aligned (the "WINDOW OPEN" seal,
  the space equivalent of the politics verdict stamp). Full sequence ≤ 1.6 s
  (last stage 1400 + 220 ms `stamp` = 1620 → clamp `stamp` to 200 ms). *(Start
  offsets added 2026-07-06: the bare `→` chain of 900 ms sweep + 900 ms countup
  read as serial would run to ~1.8 s; the explicit offsets — the `power-flow` §5
  convention — land the sequence within the 1.6 s motion.md budget.)*
- Scrub-time (event-driven): dragging the scrubber moves the cyan departure dot
  and redraws the transfer ellipse + phase wedge **instantly** (no transition —
  a scrubber must feel direct, `coalition-calculus` toggle-instant rule); the
  verdict text swaps live. When the scrub crosses INTO the aligned band, the
  verdict chip fires `stamp` once per crossing; crossing OUT is a plain 140 ms
  text swap (leaving a window gets no ceremony — the `coalition-calculus`
  clears↔short asymmetry).
- No ambient motion — the bodies do NOT auto-orbit (that would fight the
  scrubber for the one motion slot and imply live time; the scrubber IS time).
  `worlds/space.md` sanctions ambient motion but CANON §9 gives the control
  priority: one control, and it is the scrubber.
- **Composed still (reduced-motion / print / no-JS):** the aligned state at
  `Δφ = φ_required` — departure dot at `α = 135.6°`, fixed destination dot at
  `β = 180°` (the two `φ_required` apart), transfer ellipse drawn, readout
  populated, verdict "WINDOW OPEN". Reduced-motion: transitions become hard
  swaps; `stamp` pre-rendered; `countup` shows final numbers.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| central body + orbit rings | `--ink` @ 0.9 (disc) / `--ink` @ 0.42 (rings) |
| departure body + transfer ellipse | `--accent` (cyan) @ 1.0 (dot) / @ 0.8 (ellipse) / @ 0.2 (ghost) |
| destination body | `--accent-alt` (amber) @ 1.0 (the second object — worlds/space.md) |
| phase wedge + Δφ label | `--ink` @ 0.16 / mono `--ink` |
| readout telemetry | mono `--accent` (values) / `--ink` (units) — the `.tel` register |
| verdict: aligned / not | `--accent` "WINDOW OPEN" / `--ink` @ 0.6 "phase {n}° off" |
| ring + designation labels | mono, paper halo (`paint-order`) |

Cyan = the craft/departure (the signal). Amber = the destination (the second
object). No third color. The verdict never goes red — a missed window is not a
failure, it is a wait (worlds/space.md: awe from real numbers, not alarm).

## 7. Fallback design (first-class)

No-JS is the print edition of the aligned window:

- The figure renders fully at build time in the **aligned state** (scrubber at
  `Δφ = φ_required`, so the departure dot at `α = 135.6°` and the fixed
  destination at `β = 180°` sit exactly `φ_required` apart, transfer ellipse
  drawn, readout populated, verdict "WINDOW OPEN"). Complete, correct, static
  SVG — nothing requires JS to paint the answer.
- The scrubber is a JS-only control: rendered with the `hidden` attribute,
  unhidden by the island on boot (the existing island contract — controls that
  need JS never show dead). A no-JS reader simply gets the window-open still.
- Below the figure, the **transfer ledger** (`.vz-legend` / `.tel` rows, the
  AT-readable data source): `Δv total {dvTotal} km/s` (with the `dv1`/`dv2`
  split as sub-rows), `transfer time {tTransferDays} d`, `synodic period {S} d`,
  `required phase {φ_required}°`, and the two orbit radii in `distanceUnit`.
  Everything the scrubber can reveal is a stated number here.
- Nothing is dropped: the geometry, the costs, the cadence, and the required
  phase are all in the no-JS page.

## 8. Interaction spec — reader-agency (cites `coalition-calculus` §8)

Follows the five reader-agency rules (data-at-rest / ONE control / `aria-live`
verdict / refusals explain / keyboard-complete). The ONE control is the phase
scrubber (a chip SET would be many controls; a slider is one).

- **The scrubber:** a single `<input type="range">`, `min=−180 max=180 step=1`
  whose value **IS the relative phase `Δφ`** (the departure's lead over the fixed
  destination, §4), value = `φ_required` at load (opens at the window), spanning
  the figure width, labeled `relative phase Δφ — drag to sweep the departure
  planet's position`. Styled as a mono track with a 44×44 thumb (CANON §9 target
  floor). `touch-action: pan-y` on the track wrapper is NOT needed (a range input
  handles its own gesture and does not capture vertical scroll) — but the wrapper
  sets `touch-action: manipulation` to kill the 300 ms tap delay.
- **On input:** the cyan departure dot moves to `α = 180° − Δφ` (the amber
  destination stays FIXED at `β = 180°`, §4); the transfer ellipse and the Δφ
  wedge redraw; the verdict recomputes (`scrub` below = the scrubbed `Δφ`):
  - `|scrub − φ_required| ≤ 3°` → `WINDOW OPEN` (accent, stamped);
  - else → `phase {round(scrub − φ_required)}° off · next window in {days} d`
    where days = `S · (|scrub − φ_required| / 360)` (how long until the phase
    drifts back — an honest, computed "wait").
- **The verdict is `aria-live="polite"`:** every scrub settle announces
  "Window open" / "Phase 30 degrees off" to AT without moving focus.
- **Keyboard:** the range input is natively keyboard-driven (arrows ±1°,
  PageUp/Down ±15°, Home/End to the extremes); a keyboard user reaches every
  state and hears every verdict. Focus ring 2 px `--accent`, 2 px offset.
- No tooltips (the readout + verdict already say everything a tooltip would).
- `setState` not used — the scrubber is the entire interaction surface.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Two rings are the orbits, the arc
  between them is the cheapest transfer path, and the two dots must line up at
  the right angle for the trip to work — drag to see when they do."
- **how** (ExpandModal): "Drag the slider to sweep the departure planet around
  its orbit. The readout is fixed — the cost and travel time never change — but
  only one phase angle actually arrives; that is the launch window."
- Caption guidance: state the window claim ("only if Mars leads Earth by 44°,
  which recurs every 780 days"), never restate the form.
- **Text budget** (≤80 words at rest — `REVIEW-2026-07-05.md` amendment 3,
  designated "§4.5" but not yet merged into `CANON.md`): at rest ≈ 2 ring labels + Δφ label + 4 readout
  lines (~10 words) + verdict (~3) + caption (~18) + plain (~30) + the two
  auto chips — under 80; the `dv1`/`dv2` split and radii live in the collapsible
  ledger, not on the figure.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 200 (2 rings + 2 bodies + transfer ellipse + ghost + wedge + labels + readout text) |
| Inline island JS | ≤ 2.5 KB / ≤ 90 lines, vanilla, `is:inline` (redraws ellipse path + moves 2 dots + updates verdict; no framework) |
| `data` payload | ≤ 1.5 KB |
| Reflow | scrub updates mutate `transform`/path `d`/`textContent` only — no layout thrash, no height change |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (aligned still) · 375px no
      overflow, scrubber thumb ≥ 44px, labels ≥ 9.5px · reduced-motion still
      (aligned, no transitions) · token grep (cyan + amber declared; no hex
      literals beyond) · caption + source + plain · no-JS = aligned still with
      scrubber hidden + full ledger (view-source) · payload degradation
      (missing `periodDays` → computed from radius+μ) · prefix `px-xwin` unique
- [ ] `hohmannDv(1.496e8, 2.279e8, 1.327e11)` → dv1 ≈ 2.94, dv2 ≈ 2.65,
      **dvTotal ≈ 5.59 km/s**, tTransfer ≈ 2.236e7 s ≈ **258.8 days**
      (recompute from the sheet)
- [ ] Synodic `S = 1/|1/365.25 − 1/686.98| ≈ **779.9 days**` in the readout
- [ ] `φ_required = 180 − 360·(258.8/686.98) ≈ **44.4°**`; the scrubber opens
      at this value and the composed still is ALIGNED (verdict "WINDOW OPEN")
- [ ] The `idealized · circular coplanar` chip ALWAYS renders; a payload with
      `to/from` radius ratio > 6 (e.g. LEO→GEO, r2/r1 = 6.6) ALSO renders
      `radii √-compressed` and the inner ring stays visible
- [ ] Scrubbing to `φ_required + 30°` shows `phase 30° off · next window in
      {S·30/360 ≈ 65} d`; scrubbing back within 3° re-stamps "WINDOW OPEN"
      exactly once per crossing-in; crossing out is a plain text swap
- [ ] The transfer ellipse always originates at the departure dot and its
      apoapsis touches the destination ring (redrawn on every scrub)
- [ ] The amber destination dot stays FIXED at `β = 180°` across every scrub
      value; only the cyan departure dot (`α = 180° − Δφ`) and the ellipse move
      — so `Δφ` (hence the verdict) genuinely varies (§4/§8 corrected model)
- [ ] Verdict element is `aria-live="polite"`; arrow-key scrubbing announces
      each new verdict with no focus change; full range reachable by keyboard
- [ ] Readout Δv / time / synodic are STATIC across all scrub values (they are
      the transfer's fixed costs; only the phase verdict changes)
- [ ] Card height never changes across any scrub (reserved verdict row);
      at ≤640px the readout becomes a 3-tile `.tel` row below the figure

---

*Registry duties when implementing (P6 — NOT now): add `transfer-window` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the `catalog.md` block (in
`SECTION_KINDS` order; `npm run check:catalog` must pass), document the
`px-xwin` prefix in `src/components/AGENTS.md` §4/§2, and add a worked example
to `2026-06-03-space-showcase`. `hohmannDv` already exists in `kepler.ts` — no
new math module. Do NOT edit `SECTION_KINDS` or `catalog.md` at blueprint time.*
