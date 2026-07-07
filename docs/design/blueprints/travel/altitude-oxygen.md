# Blueprint — `altitude-oxygen` (travel · SVG/CSS-3D · the thinning-air family)

> Why the trek gets harder with every kilometre of gain: a vertical cross-section
> where the horizontal axis is the *effective oxygen* the air still carries, and
> the trekker's acclimatization stops are pinned up the climb. At Everest Base
> Camp the air holds barely half the oxygen it does at the coast — the figure
> makes that loss physical, and marks the nights the body needs to catch up.
> Build-time SVG with an optional CSS-3D tilt (the column reads as a wall of air
> you climb into).

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `altitude-oxygen` |
| World | travel (shares the barometric math with earth's `atmosphere-column`) |
| Tier | SVG (build-time geometry) + optional CSS-3D tilt on the column (`core/Tilt.astro` mechanics, `.px3d-*`); no runtime data JS |
| Component | `src/components/topic/travel/AltitudeOxygen.astro` |
| Scene module | n/a |
| Shared math | none new — the barometric curve is `geodesy.md §7` implemented in the Astro frontmatter (three expressions, §4). The §11 anchors pin it to the sheet. (If earth's `atmosphere-column` is built first and factors a shared `atmosphere.ts`, this kind imports it; until then, inline per the sheet — same discipline as `coalition-calculus`) |
| CSS prefix | `px-altox` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, AGENTS.md §4 table) |
| Flagship reference | `ElevationProfile.astro` (earth cross-section by band), `ElevationTrek.astro` (travel elevation + waypoints), `power-flow.md` (build-time static / print-plate discipline) |

## 2. What it shows / when to use

Effective oxygen versus altitude as a filled column, with named acclimatization
stops pinned at their elevations and their effective-O2 readouts. The reader sees
the air thin out and where the itinerary pauses to let the body adapt.

- **USE WHEN:** a high-altitude trek / mountain story with named waypoints at
  known elevations (metres), where the *physiological cost of altitude* is the
  argument — acclimatization, summit day, altitude sickness. 2–8 stops.
- **DON'T USE:** the route's up-and-down elevation over distance (→
  `elevation-trek`, which is distance-on-x); earth-science band structure with
  no oxygen story (→ `elevation-profile`); a whole atmosphere's layer stack (→
  earth's `atmosphere-column`). If the story is the *walk* not the *air*, use
  `elevation-trek`.
- **Pairs with:** default width or `wide`; hero-capable for an altitude/
  acclimatization issue. Not `layout: split` (static plate, no scroll control).

## 3. Data schema

```ts
interface AltitudeOxygenData {
  stops: Array<{                 // 2–8 acclimatization/waypoint stops; build error outside
    name: string;                // "Everest Base Camp"
    elevM: number;               // elevation, metres above sea level
    nights?: number;             // nights spent here (0/undefined = pass-through);
                                 //   ≥1 draws the acclimatization-stop marker
    note?: string;               // ≤ 8 words, e.g. "first sleep above 5,000 m"
  }>;
  maxElevM?: number;             // axis top; default = ceil(max stop elev to next 500 m) + 500
  model?: 'lapse' | 'isothermal'; // barometric model, default 'lapse' (geodesy §7;
                                 //   better for ≤11 km mountain stories). Choice shown as a chip.
  seaLevelO2Pct?: number;        // reference O2 at sea level, default 21 (%). Rarely overridden.
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (the Everest Base Camp trek — real elevations, standard-atmosphere O2)
stops:
  - { name: "Lukla",             elevM: 2860, nights: 1, note: "trailhead" }
  - { name: "Namche Bazaar",     elevM: 3440, nights: 2, note: "first acclimatization halt" }
  - { name: "Dingboche",         elevM: 4410, nights: 2, note: "second acclimatization halt" }
  - { name: "Gorak Shep",        elevM: 5160, nights: 1 }
  - { name: "Everest Base Camp", elevM: 5360, nights: 0, note: "air holds half the oxygen of the coast" }
model: lapse
caption: "By Base Camp the air carries 10.7% effective oxygen — barely half of sea level — which is why the body needs those nights at Namche and Dingboche."
source: "Barometric model (geodesy §7); elevations from standard trek profiles."
```

**Data flags with visual consequences (CANON §7):** the x-axis is *effective
oxygen*, a modelled quantity, not measured air. The component AUTO-RENDERS the
mono chip `` model: {model} `` (`model: lapse` / `model: isothermal`) so the
reader knows the curve is the standard-atmosphere approximation, not
station data. Always present (the curve is always modelled).

## 4. Geometry spec (build-time, in the component frontmatter)

- **The barometric curve (mirrors `geodesy.md §7`, `model: 'lapse'` default):**
  with `h` in km (`h = elevM/1000`), `T₀ = 288 K`, `Γ = 6.5 K/km`,
  `P₀ = 1013.25 hPa`:
  `T = T₀ − Γ·h`, `P(h) = P₀·(T/T₀)^5.256`, effective oxygen
  `O₂(h) = seaLevelO2Pct · P(h)/P₀`.
  `model: 'isothermal'` uses `P(h) = P₀·e^(−h/8.4)` instead (scale height
  `H = 8.4 km`).
  **Worked anchor (recomputable, lapse):** at 5,360 m → h = 5.36,
  T = 288 − 34.84 = 253.16 K, `P/P₀ = (253.16/288)^5.256 = 0.508`,
  **O₂ = 21 × 0.508 = 10.7%**. Everest summit 8,849 m → P/P₀ = 0.310 →
  **O₂ = 6.5%** (matches the sheet's ~6.7% sanity check). Sea level → 21.0%.
- **viewBox:** `0 0 560 460`, plot box `[x: 96…496, y: 40…400]` (400×360),
  60px left margin for altitude ticks, right margin for the stop labels
  (fixed-column label pattern, AGENTS.md §5), `overflow: visible`.
- **Axes:**
  - **Y = altitude**, sea level at the BOTTOM (y = 400), `maxElevM` at the top
    (y = 40): `y(elevM) = 400 − (elevM/maxElevM)·360`. Ticks every 1,000 m,
    mono 10px `--ink` @ 0.55, `+0.08em`, uppercase (`0 M`, `1,000 M`, …).
  - **X = effective O₂ %**, 0% at left (x = 96) to `seaLevelO2Pct` at right
    (x = 496): `x(o2) = 96 + (o2/seaLevelO2Pct)·400`. So higher = leftward =
    thinner. A dashed reference line at the sea-level value (x = 496) labelled
    `` SEA LEVEL {o2}% ``.
- **The air column:** a filled area between the curve and the left axis
  (x = 96) — sampled every 100 m from 0 to `maxElevM`, each altitude's x from
  `x(O₂(h))`. The fill is a vertical gradient in OPACITY only (denser =
  higher-oxygen at the base, fading toward the thin top) — realised as a
  `--accent` fill at a single opacity with a `<linearGradient>` on alpha
  (0.28 at base → 0.10 at top), NOT a hue gradient (CANON §11 no rainbow). The
  curve's right edge is a 1.5px `--accent-deep` stroke (the air/space boundary).
- **Stop markers:** each stop at `(x(O₂(elevM)), y(elevM))` — a 4px
  `--accent-deep` dot, a dashed connector to the fixed right label column at
  `x = 500`, and the label block: `{name}` (Fraunces italic 13px, place-name
  voice) + a mono line `{elevM} m · O₂ {o2}%`. Stops with `nights ≥ 1` get the
  **acclimatization marker** — a small bespoke inline-SVG "moon/tent" glyph
  (line-drawn, 1.5px stroke, `--accent-alt` teal) + `{nights}n` — marking a
  night the body catches up. Label Y clamped to `[24, 436]`; on collision,
  nudge down by 16px (fixed-column pattern).
- **CSS-3D tilt (optional, progressive):** the `.px-altox__col` group carries a
  subtle `rotateY(-12deg) rotateX(4deg)` under `core/Tilt.astro`'s pointer-tilt
  (`.px3d-*`), so the column reads as a wall of air. Reduced-motion / no-JS →
  the transform is the composed flat still (tilt is enhancement only; the SVG is
  fully legible flat). This is the ONLY motion beyond reveal; it is
  pointer-driven (user-initiated, not animation).
- **375px:** viewBox unchanged (SVG scales); the right label column moves to
  `x = 470` and labels shrink to 11px name / 9.5px mono; `.px-altox__wrap
  { padding: 0 44px }`; altitude ticks stay ≥ 9.5px. No horizontal overflow.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated): axes `reveal` → air column `grow` (the filled area
  grows upward from sea level, transform-origin at y = 400, 900 ms `--ease`) →
  curve edge `sweep` (dashoffset draw bottom→top, 1400 ms — travel's slow
  signature) → stop dots + labels `settle` in altitude order low→high (60 ms
  stagger) → acclimatization glyphs `reveal` last. Full sequence ≤ 1.6 s.
- No continuous motion. The optional CSS-3D tilt is pointer-driven only.
- Reduced-motion / no-JS: everything painted final and flat (no tilt) — the
  print plate.
- **Composed still:** full column, curve, all stop markers + labels + O₂
  readouts + the sea-level reference line, flat (untilted).

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| air column fill | `--accent` @ 0.28→0.10 alpha gradient (dense base → thin top) |
| curve edge (air boundary) | `--accent-deep` @ 0.9, 1.5px |
| axes + altitude ticks | `--ink` @ 0.42 (axes), `--ink` @ 0.55 (tick text, mono) |
| sea-level reference line + label | `--ink` @ 0.42 dashed |
| stop dots + connectors + `{elevM} m · O₂ %` | `--accent-deep` (dot), `--ink` @ 0.3 (connector), mono `--ink` @ 0.85 (readout) |
| stop name | `--ink` @ 0.92, Fraunces italic |
| acclimatization night glyph + `{nights}n` | `--accent-alt` @ 0.9 teal (the ONE second-role use: teal = the rest/recovery, the alternative to just climbing — consistent with travel's teal = the alternative) |

Text on cream uses `--accent-deep`, never vivid `--accent` (CANON §6). The teal
acclimatization glyph is travel's sanctioned second role (`worlds/travel.md`:
teal = water / the alternative) — here "the pause that lets you continue".

## 7. Fallback design

Build-time static SVG — no separate fallback. No-JS = the final painted column,
curve, all stop markers, O₂ readouts, and the sea-level reference line, flat
(the CSS-3D tilt simply never applies). The per-stop `{elevM} m · O₂ {o2}%`
readouts ARE the AT-readable data source (every stop's altitude and modelled
oxygen is on the plate). ≤ 8 stops → under the 5-row... no: stop labels are the
figure's marks, not a collapsible legend, so the amendment-3 collapse rule does
not engage (there is no separate legend list; the marks carry the data). This
IS the print plate.

## 8. Interaction spec

- No data interaction in v1 (static plate). The `⤢` expand-to-modal (automatic
  via `.px-viz`) is the study view; the modal explainer states what "effective
  oxygen" means and why nights at altitude matter.
- The optional CSS-3D pointer-tilt (`core/Tilt.astro`) is a cosmetic
  enhancement, not a data control — it reveals nothing; hover/tilt never changes
  a value. `touch-action` untouched (no drag data surface); vertical scroll
  never captured.
- No tooltips: every stop's numbers are already printed at its marker (the
  fixed-column readouts), so a tooltip would duplicate the plate.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Height runs up the side; the column's
  width is how much oxygen the air still carries at that height. Each dot is a
  stop on the climb, and the teal moons mark the nights spent letting the body
  catch up."
- **how** (ExpandModal): "Read up the column — the higher you go, the thinner it
  gets. The marked stops show where the trek pauses to acclimatize."
- Caption guidance: state the air-loss claim ("10.7% effective oxygen — barely
  half of sea level"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 60 words — per stop `{name}` +
  `{elevM} m · O₂ %` (~4 words × ≤8 = up to 32, but the example's 5 stops ≈ 20)
  + `model:` chip + `SEA LEVEL` label + caption (~22) + plain (~30). The `note`
  strings (≤8 words) are the one soft spot: cap the total on-plate notes so the
  sum stays ≤ 80 — the drafter drops notes on pass-through stops first.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 300 (column path + curve + ~6 axis ticks + ≤8 stops × ~4 nodes) |
| Runtime JS | none beyond shared Reveal + the optional `core/Tilt.astro` island (already mounted per issue) |
| `data` payload | ≤ 2 KB |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px · reduced-motion still = flat plate · token grep (accent /
      accent-deep / accent-alt only, no hex) · caption + source + plain ·
      payload validates · degrades on missing `note`/`nights`/`maxElevM` ·
      prefix unique
- [ ] `stops.length` of 1 or 9 fails the build naming the 2–8 rule
- [ ] Lapse model at 5,360 m → effective O₂ = 10.7% (the EBC stop readout shows
      it); at 8,849 m → 6.5%; at sea level → 21.0% (recompute anchors)
- [ ] The x-axis maps 21% → right edge and 0% → left; higher stops sit further
      left (thinner air) AND higher up
- [ ] Sea-level reference line at the right edge labelled `SEA LEVEL 21%`
- [ ] The `model:` chip renders (`model: lapse` for the example); switching to
      `isothermal` changes both the curve and the chip, and EBC reads ~11.1%
      (isothermal: `21·e^(−5.36/8.4)` = 21·0.528 = 11.09%), not the lapse 10.7%
      *(Corrected 2026-07-06: was "~10.8%"; the isothermal model gives 11.09% at
      5,360 m — recomputed from geodesy §7's `P = P₀·e^(−h/H)`, H = 8.4 km.)*
- [ ] Stops with `nights ≥ 1` (Namche, Dingboche…) show the teal acclimatization
      glyph + `{nights}n`; `nights: 0` stops (Gorak Shep, EBC) do not
- [ ] Label Y clamped inside the plate; near-equal-elevation stops (Gorak Shep
      5,160 / EBC 5,360) don't overlap (16px nudge applied)
- [ ] No-JS (view-source): identical flat plate with every stop's O₂ readout;
      CSS-3D tilt absent, plate fully legible
- [ ] Reduced-motion: column painted final, no tilt, no sweep animation running

---

*Registry duties (P6, at implementation — NOT now): add `altitude-oxygen` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog`), document the `px-altox`
prefix in `src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-travel-showcase`.*
