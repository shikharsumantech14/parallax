# Blueprint — `atmosphere-column` (earth · CSS-3D)

> The air overhead, drawn to scale as a standing column: troposphere to
> thermosphere stacked by real altitude, with the barometric pressure curve
> falling away up its side and the places the reader knows — Everest's summit,
> a cruising airliner, the Kármán line — pinned at their true heights. A
> field-notebook plate that stands up. "How thin the breathable part actually
> is."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `atmosphere-column` |
| World | earth |
| Tier | CSS-3D (pure Astro/CSS; a subtle `.px3d-*` tilt via the existing `core/Tilt.astro` island — NO WebGL, NO canvas) |
| Component | `src/components/topic/earth/AtmosphereColumn.astro` |
| CSS prefix | `px-atmc` |
| Flagship reference | `CoreSample.astro` (the earth CSS-3D vertical-column pattern) for the standing slab + `power-flow`'s build-time-SVG-curve pattern for the pressure trace |

## 2. What it shows / when to use

The vertical structure of the atmosphere to true altitude scale, with the
pressure/oxygen fall-off drawn against it and human-known landmarks pinned. The
reader learns *how the air thins with height* and how compressed the livable
band is.

- **USE WHEN:** the story needs the reader to feel atmospheric altitude —
  a high-altitude trekking/mountaineering piece, an aviation-ceiling story, a
  "where does space begin" explainer. The dossier supplies (or the component
  computes from geodesy §7) pressure at altitude, and there are ≥2 landmark
  heights worth pinning.
- **DON'T USE:**
  - terrain shape (→ `terrain-relief`); ground-level band structure by value
    (→ `elevation-profile`); a route's up-and-down (→ `elevation-trek`, travel);
  - rising WATER against landmarks (→ `sea-level-tank` — that is the mirror
    image; this is air, that is water);
  - a single gauge/number (→ `carbon-gauge`, `data-readout`).
- **Pairs with:** `layout: breath` or default width as a QUIET supporting
  section (CSS-3D is not "loud" — CANON §3); a good eye-rest after a WebGL hero.
  Not hero-capable (it's a supporting mechanism figure).

## 3. Data schema

```ts
interface AtmosphereColumnData {
  maxAlt_km?: number;          // top of the drawn column, km. Default 100 (just past the Kármán line).
                               // Range clamp [12, 600]. The vertical axis is 0..maxAlt_km.
  model?: 'lapse' | 'isothermal'; // pressure model (geodesy §7). Default 'lapse' below 11 km stories,
                               // 'isothermal' for whole-column. Component picks 'lapse' if maxAlt_km<=12 else 'isothermal'.
  landmarks?: Array<{          // pins at real heights (≤7). Sorted by alt at build.
    name: string;              // "Everest summit"
    alt_km: number;            // 8.849
    note?: string;             // "8,849 m — death zone above ~8 km"
  }>;
  showOxygen?: boolean;        // annotate effective-O₂ % at each landmark (geodesy §7). Default true.
  logAlt?: boolean;            // compress the altitude axis logarithmically (for whole-column framing).
                               // Default false. If true, AUTO-RENDERS the chip `altitude log-compressed`.
  caption?: string;
  source?: string;             // REQUIRED. e.g. "U.S. Standard Atmosphere 1976"
}
```

```yaml
# example payload (Everest & the thin air)
maxAlt_km: 100
model: isothermal
landmarks:
  - { name: "Everest summit", alt_km: 8.849, note: "8,849 m · ~34% sea-level pressure" }
  - { name: "Cruising airliner", alt_km: 11.5, note: "FL380 · cabin pressurised to ~2,400 m" }
  - { name: "Armstrong limit", alt_km: 19, note: "water boils at body temperature" }
  - { name: "Kármán line", alt_km: 100, note: "the conventional edge of space" }
showOxygen: true
logAlt: false
caption: "Everything humans breathe unaided sits in the bottom tenth of this column — the summit of Everest already thins the air by two-thirds."
source: "U.S. Standard Atmosphere 1976; barometric formula, geodesy §7"
```

**Data flags with visual consequences (auto-chip, CANON §7):**
- `altitude log-compressed` — rendered ONLY when `logAlt: true`. The default
  (`false`) is a TRUE linear altitude scale — the whole point of the card is the
  honest thinness, so linear is the default and the chip is absent then.

## 4. Geometry spec (build-time, in the component frontmatter — SVG + CSS-3D)

The card is a build-time SVG column inside a `.px3d-*` tilt wrapper. All math
runs in frontmatter; NO client compute.

### Pressure / oxygen (mirrors `geodesy.md §7` 1:1)

- **Isothermal barometric:** `P(h) = P₀ · exp(−h / H)`, `H = 8.4 km`,
  `P₀ = 1013.25 hPa`.
- **Lapse-rate (troposphere ≤11 km):** `T = T₀ − Γ·h` (`Γ = 6.5 K/km`,
  `T₀ = 288 K`), `P(h) = P₀ · (T/T₀)^5.256`.
- **Effective oxygen %:** `O₂_eff(h) = 21% · P(h)/P₀` (geodesy §7).
- Layer boundaries (drawn as the column's internal rules): troposphere 0–12,
  stratosphere 12–50, mesosphere 50–85, thermosphere 85–600 km (geodesy §7;
  the top three appear only if `maxAlt_km` reaches them).

**Acceptance anchor (COMPUTABLE — the sheet's own check):**
Everest at `h = 8.849 km`, isothermal: `P = 1013.25·exp(−8.849/8.4) =
1013.25·exp(−1.0535) = 1013.25·0.3487 = 353.3 hPa` → `P/P₀ = 0.349` →
`O₂_eff = 21%·0.349 = 7.3%`. (**The sheet's rounded "~6.7%" is the LAPSE-RATE
result, not isothermal**: geodesy §7's Everest check `P ≈ 0.31·P₀ → ~6.7%`
follows directly from `P = P₀·(T/T₀)^5.256` with `T = 288 − 6.5·8.849 = 230.5 K`
→ `(230.5/288)^5.256 = 0.310` → `21·0.310 = 6.5%` (the sheet rounds to ~6.7%).
The two models legitimately differ at Everest — isothermal 7.3%, lapse 6.5% —
so **the acceptance number depends on the card's `model`, not on any H tweak**.
This card's example payload sets `model: isothermal`, so its Everest readout is
7.3%; the component MUST print the value from the SAME model it draws the curve
with. *(Corrected 2026-07-06: the previous note blamed the 6.7%↔7.3% gap on "a
slightly different H" — wrong; H is irrelevant to the lapse model. The gap is
isothermal-vs-lapse. This also aligns with travel's `altitude-oxygen`, whose
default `model: lapse` yields the matching 6.5% at Everest.)*) A reviewer
recomputes `21·exp(−8.849/8.4)` = 7.3% (isothermal) and `21·(230.5/288)^5.256`
= 6.5% (lapse).

### Column geometry

- viewBox `0 0 W H`, `W = 560`, `H = 640`, `overflow: visible` (label bleed).
  375px: same viewBox, CSS `max-width:100%`.
- **Vertical axis** = altitude. Linear map (default):
  `y(alt) = MARGIN_TOP + (1 − alt/maxAlt_km) · PLOT_H`, `MARGIN_TOP = 28`,
  `PLOT_H = 584` (so 0 km at the bottom, `maxAlt_km` at the top).
  Log map (`logAlt`): `y(alt) = MARGIN_TOP + (1 − log10(1+alt) / log10(1+maxAlt_km)) · PLOT_H`.
- **Layer slabs:** each atmospheric layer within `[0, maxAlt_km]` is a filled
  rect spanning the plot width (`COL_X0=140` to `COL_X0+COL_W`, `COL_W=180`),
  from its base to its top altitude. Fill = a tint ramp from `--paper-2` at the
  ground to `--bg` at altitude (denser air = warmer paper) — 4 discrete tints,
  NOT a gradient blob (CANON §11 no mesh gradients): one flat tint per layer,
  stepping lighter with height. Left edge = a 1px `--ink` @ 0.30 rule; a mono
  layer label (`TROPOSPHERE 0–12 km`) sits inside each slab, 9.5px.
- **Pressure curve:** a path plotting `x_p(h) = COL_X0 + COL_W + 8 +
  (P(h)/P₀)·CURVE_W` (pressure grows rightward from the column's right edge),
  `CURVE_W = 150`, sampled every 1 km (or every 2 km if maxAlt>200). Drawn
  `--accent-alt` (brown = the geologic/measured) @ 0.85, 1.6px, with a mono
  axis key at top: `PRESSURE → (hPa)` and ticks at 1000/500/250/0. This is the
  "measured rule" (earth motif 4) turned vertical.
- **Landmark pins:** each landmark → a horizontal `--ink` @ 0.45 tick from the
  column's left rule out into the left margin, a 3px `--accent-deep` dot on the
  column's left edge, then Fraunces-italic `{name}` (specimen label, motif 3) +
  mono `{alt_km} km`{showOxygen: ` · O₂ {O₂_eff}%`} in the left gutter. Paper
  halo (`paint-order:stroke`). Collision: landmarks are pre-sorted by altitude;
  if two labels are <16px apart in `y`, the lower one's label nudges down by the
  overlap (build-time greedy declutter).
- **Coordinate margin (motif 2):** the card header carries a mono altitude
  reference line; NO lat/lon (this card is location-agnostic — it's a vertical
  section of the standard atmosphere), so the margin shows the model name
  instead: `U.S. STANDARD ATMOSPHERE · sea level 1013 hPa`.
- **CSS-3D tilt:** the whole SVG sits in a `.px3d-tilt` wrapper (from
  `core/Tilt.astro`) giving a ≤6° pointer-tilt (the standing-plate feel);
  reduced-motion + no-JS ⇒ flat, fully readable (Tilt degrades to static — its
  contract). This tilt is the ONLY 3-D; the data is entirely in the SVG.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated, `.px-viz:not(.is-in)` hidden states per the existing
  contract):
  - layer slabs `grow` (scaleY from the ground up, transform-origin bottom,
    600 ms, 50 ms stagger bottom→top — the atmosphere "builds up from the
    ground");
  - the pressure curve `sweep` (dashoffset draw, 900 ms, starting 200 ms —
    inking the fall-off; ends ~1100 ms);
  - landmark pins `reveal` (opacity + 14px translateY) LAST, but OVERLAPPING the
    curve's tail: the first pin starts at 700 ms, pins staggered 40 ms, each
    `reveal` 300 ms. With the schema cap of ≤7 landmarks the last pin starts at
    `700 + 6·40 = 940 ms` and finishes at `940 + 300 = 1240 ms`. *(Corrected
    2026-07-06: the previous timing (curve 1000 ms from 250 ms → 1250 ms, then
    pins LAST at 60 ms stagger) let 7 pins run to ≈1250 + 6·60 + 700 ≈ 2.3 s,
    busting the ≤1.6 s budget. Pins now overlap the curve tail and use a 40 ms
    stagger / 300 ms reveal so the worked worst case (7 pins) lands at 1.24 s.)*
  - Total ≤ 1.6 s for the full worked worst case (motion.md stagger budget);
    the governing end is `max(curve 1100, last pin 1240) = 1.24 s`.
- CSS-3D tilt: pointer-driven only (not an entrance/ambient motion); ≤6°,
  no auto-animation.
- Reduced-motion: everything painted final, flat (no tilt); the composed still.
- No continuous/ambient motion (CSS-3D card; the tilt is user-initiated). This
  keeps the earth ambient-motion budget (globe rotation, tank drift) untouched.
- **Composed still:** the full column — slabs, pressure curve, all landmark
  pins, layer labels, axis keys — flat and static. IS the no-JS / print frame.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| layer slabs | stepped flat tints `--paper-2` (ground) → `--bg` (top), 4 steps; NO gradient |
| slab left rule + layer labels | `--ink` @ 0.30 rule; labels `--ink` @ 0.66 mono |
| pressure curve | `--accent-alt` @ 0.85, 1.6px (brown = the measured) |
| pressure axis key + ticks | `--ink` @ 0.55 mono |
| landmark ticks | `--ink` @ 0.45 |
| landmark dots | `--accent-deep` @ 1.0 |
| landmark names | `--ink` (Fraunces italic); alt/O₂ mono `--accent-deep` |
| oxygen annotation | `--accent-deep` mono (on light paper — never vivid `--accent`, CANON §6) |

Single-accent discipline: the ONLY non-ink colors are `--accent-alt` (the one
pressure curve) and `--accent-deep` (landmark numerals) — both earth tokens, no
new hue, no per-layer rainbow. Green `--accent` is deliberately NOT used (this
card is about air, not the living datum) — the restraint is the point.

## 7. Fallback design (first-class)

The card is **build-time SVG already** — no separate fallback needed (like
`power-flow`). No-JS / reduced-motion = the full painted column, flat (tilt off,
per the Tilt island contract), every slab/curve/pin/label present. This IS the
print plate: a standing atmospheric section with the pressure fall-off and the
landmarks pinned. The plain line + caption + the in-SVG layer labels and
landmark legend carry the full read for AT (the SVG has a `<title>`/`<desc>` and
the landmark list is real text). No canvas ⇒ nothing to fall back FROM.
- **Text budget (CANON §4.5 / REVIEW amendment 3):** at rest the on-plate text is
  caption (~25 w) + plain (~35 w) + the ≤4 mono layer labels + the ≤7 landmark
  `{name} · {alt} km · O₂ %` marks (~4 w each). Landmark marks ARE the figure's
  data (not a separate legend list), so — like `altitude-oxygen` — the amendment-3
  collapse does not engage; instead the schema caps landmarks at ≤7 and `note`
  strings at ≤8 words, keeping the at-rest total ≤ ~80 words. The drafter drops
  `note` on pass-through landmarks first if the sum runs long. *(Added 2026-07-06
  — the text-budget stance was previously unstated.)*

## 8. Interaction spec

- **ONE optional interaction:** the CSS-3D pointer-tilt (`core/Tilt.astro`),
  ≤6°, `touch-action` unaffected (tilt is pointer-hover on desktop; on touch it
  is inert — the card just reads flat). No hover tooltips, no state chips, no
  zoom — the SVG is complete and static (CANON §9: interaction reveals more,
  never the point; here it reveals nothing critical, so it's purely the
  standing-plate flourish).
- The ⤢ expand modal (automatic via `.px-viz`) is the study view — the same
  column at full size with the plain-language explainer.
- Keyboard/AT: no focusable in-card controls beyond ⤢; the SVG's text (layer
  labels, landmark names + alt + O₂, axis keys) is the AT data source; the plain
  line explains the form. Fully usable with zero interaction.

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts`): "A slice of the sky stood on
  end, drawn to true height — each band is one layer of the atmosphere, the
  curve on the right is how fast the air pressure drops as you climb, and the
  pinned heights are places you already know."
- **how** (ExpandModal): "Read bottom to top: ground level at the base, the edge
  of space at the top. The brown curve shows pressure falling away; the marks in
  the margin are landmark altitudes."
- Caption guidance: state the thinness/scale claim ("everything humans breathe
  unaided sits in the bottom tenth"), never restate what a layer is. Source names
  the atmosphere model (CANON §7).

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 400 (≤4 slabs + ~100-sample pressure path as ONE polyline + ≤7 landmark groups + axis) |
| `data` payload | ≤ 3 KB (landmarks + flags; the atmosphere model is computed, not shipped) |
| Extra assets | none |
| Client JS | none beyond the shared `Reveal` + `Tilt` islands (both already loaded per issue) |

No WebGL, no fetch, no per-frame compute. Everything is build-time SVG.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette (the still IS the card) ·
      375px no overflow, labels ≥ 9.5px, ⤢ target ≥ 44px · reduced-motion =
      flat painted column (no tilt) · token grep (only `--ink`/`--accent-alt`/
      `--accent-deep`/`--paper`/`--paper-2`/`--bg`; NO hex literals, NO `--accent`
      vivid) · caption + source + plain render · (no WebGL clause — N/A, note it
      passes trivially) · payload degrades (missing `landmarks` ⇒ column + curve
      only, still valid; missing `maxAlt_km` ⇒ default 100) · `px-atmc` prefix
      unique
- [ ] Pressure/O₂ anchor: Everest `h=8.849 km`, isothermal (`H=8.4`) ⇒
      `P=353 hPa`, `O₂_eff=7.3%` (recomputes `21·exp(−8.849/8.4)`); under `model:
      lapse` the same point reads 6.5% (`21·(230.5/288)^5.256`). The printed O₂
      value uses the SAME model (and its constants) that draws the curve — never
      mix models between the curve and the readout
- [ ] Altitude axis is TRUE linear by default; `logAlt:true` renders the chip
      `altitude log-compressed` and compresses the axis; `logAlt:false` renders
      no chip
- [ ] Layer slabs sit at true altitude boundaries (troposphere top at the
      `y(12)` line, etc.) and step lighter with height (no gradient blob)
- [ ] The pressure curve reaches ~0 at the top and P₀ (full CURVE_W) at the
      ground; ticks at 1000/500/250/0 hPa align to the curve
- [ ] Landmark pins land at their true `y(alt_km)`; overlapping labels declutter;
      each shows name + alt + (if showOxygen) O₂ %
- [ ] No-JS: identical full column (view-source check); reduced-motion: flat,
      no tilt, all elements final
- [ ] One accent family only (grep the component for color literals — expect
      zero; all via tokens)

---

*Registry duties when implementing (P6, NOT here): add `atmosphere-column` to
`SECTION_KINDS`, dispatch in `SectionBody.astro`, add the `EXPLAIN` default, add
the catalog block (`check:catalog` must pass), document `px-atmc` in
`src/components/AGENTS.md` §4, add a worked example to
`2026-06-03-earth-showcase`. This blueprint edits NO config/catalog/component.*
