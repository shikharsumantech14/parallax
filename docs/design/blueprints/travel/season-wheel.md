# Blueprint — `season-wheel` (travel · CSS-3D · the when-to-go instrument)

> The year as a wheel: twelve month-sectors, three concentric rings — climate,
> crowd, price — so the traveller reads the *shape* of a destination's year and
> finds the sweet spot (the arc where the weather is good, the crowds are thin,
> and the fares are low all at once). Goa's December blazes on all three rings;
> its monsoon July is a hollow. A gently tilted CSS-3D disc (the planner's dial
> laid on the desk), build-time static with one control: a month scrubber that
> lights the selected wedge and reads out its numbers.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `season-wheel` |
| World | travel |
| Tier | CSS-3D (tilted disc via `core/Tilt.astro` `.px3d-*`) + build-time SVG rings + one tiny vanilla inline island for the month scrubber |
| Component | `src/components/topic/travel/SeasonWheel.astro` |
| Scene module | n/a |
| Shared math | none — the polar wedge geometry is two expressions (§4) in the Astro frontmatter; the island only toggles a highlight class + swaps a readout (no recompute). §11 anchors pin the geometry |
| CSS prefix | `px-swheel` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, AGENTS.md §4 table) |
| Flagship reference | `ClimateCalendar.astro` (travel's monthly heat-ribbon — this is its radial cousin), `PlayerRadar.astro` (polar wedges + spoke labels), `coalition-calculus.md` §8 (the reader-agency one-control pattern), `ClimateSpiral.astro` (build-time polar path) |

## 2. What it shows / when to use

A destination's whole year in one dial: each of twelve month-sectors carries
three stacked ring-segments — climate comfort, crowd level, price level — so the
best travel window (good weather ∧ low crowds ∧ low price) shows itself as the
arc where the inner rings are full and the outer rings are empty.

- **USE WHEN:** a "when to go" story for ONE destination with per-month values on
  2–3 of {climate/comfort, crowd, price} (0–1 or a stated unit), where the
  *annual shape* and the sweet-spot window are the argument.
- **DON'T USE:** a linear month heat-ribbon for a quick glance (→
  `climate-calendar`, travel's simpler kind — use that if only temp/rain matter
  and there's no crowd/price story); multi-decade climate (→ `climate-strip`/
  `climate-spiral`, earth); comparing two destinations' months (→ `city-compare`
  rows). One destination only — a two-destination wheel is unreadable.
- **Pairs with:** default width or `wide`; hero-capable for a "best time to
  visit" issue. **Never `layout: split`** (a chip/scrubber control conflicts
  with scroll-as-control — the standing reader-agency rule, `coalition-calculus`
  §2).

## 3. Data schema

```ts
interface SeasonWheelData {
  place: string;                 // "Goa" — the destination this year belongs to
  months: Array<{                // EXACTLY 12, Jan→Dec order; build error otherwise
    // each metric is 0–1 (share of its ring band). Omit a metric to leave its
    // ring empty that month. At least one of climate/crowd/price per month.
    climate?: number;            // 0 = harsh, 1 = ideal comfort (NOT raw temp — a comfort score)
    crowd?: number;              // 0 = empty, 1 = peak crowds
    price?: number;              // 0 = cheapest, 1 = most expensive
    label?: string;              // ≤ 6 words, e.g. "monsoon" / "peak season" — shown on hover/scrub
  }>;
  rings?: Array<'climate' | 'crowd' | 'price'>;  // which rings, inner→outer.
                                 //   Default ['climate','crowd','price']. 2 or 3 entries.
  sweetSpot?: number[];          // month indices (0–11) to mark as the recommended window
                                 //   (a scalloped outer arc). If absent, the component
                                 //   computes it: months where climate ≥ 0.6 AND crowd ≤ 0.4
                                 //   AND price ≤ 0.5 (all present rings pass).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Goa's year — illustrative 0–1 scores)
place: "Goa"
rings: [climate, crowd, price]
months:
  - { climate: 0.75, crowd: 0.55, price: 0.55, label: "pleasant, filling up" }   # Jan
  - { climate: 0.80, crowd: 0.45, price: 0.45 }                                   # Feb
  - { climate: 0.70, crowd: 0.35, price: 0.40, label: "shoulder — the sweet spot" } # Mar
  - { climate: 0.55, crowd: 0.25, price: 0.30 }                                   # Apr
  - { climate: 0.35, crowd: 0.15, price: 0.25, label: "pre-monsoon heat" }        # May
  - { climate: 0.20, crowd: 0.10, price: 0.20 }                                   # Jun
  - { climate: 0.15, crowd: 0.10, price: 0.20, label: "monsoon" }                 # Jul
  - { climate: 0.20, crowd: 0.15, price: 0.25 }                                   # Aug
  - { climate: 0.35, crowd: 0.20, price: 0.30 }                                   # Sep
  - { climate: 0.60, crowd: 0.35, price: 0.45, label: "reopening" }               # Oct
  - { climate: 0.75, crowd: 0.55, price: 0.65 }                                   # Nov
  - { climate: 0.80, crowd: 0.95, price: 0.90, label: "peak season" }             # Dec
sweetSpot: [1, 2]   # Feb–Mar: good weather, thin crowds, low fares
caption: "Goa's sweet spot is February–March — the weather still good, the crowds and prices not yet peaked. December blazes on all three rings; July hollows out."
source: "Illustrative seasonal indices (climate comfort, occupancy, fare level)."
```

**Data flags with visual consequences (CANON §7):** the rings encode
*normalised indices* (0–1), not raw °C / ₹ / headcounts — a modelling choice.
The component AUTO-RENDERS the mono chip `` indices 0–1 `` in the caption row so
the reader knows the rings are relative, not absolute. Always present.

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox:** `0 0 460 460`, wheel centred at (230, 230). `overflow: visible`
  for month labels that bleed past the outer ring; `.px-swheel__wrap { padding:
  0 48px }`.
- **Month sectors:** 12 sectors of 30° each. Month `m` (0 = Jan) is centred at
  screen angle `a_m = −90° + m·30°` (Jan at 12 o'clock, clockwise), spanning
  `[a_m − 15°, a_m + 15°]` with a 2° gap → drawn `[a_m − 14°, a_m + 14°]`.
  **Anchor:** Jan center −90° (top), Apr center 0° (right/3 o'clock), Jul center
  +90° (bottom), Oct center 180° (left/9 o'clock), Dec center +240°.
- **Rings (inner→outer):** three bands, each a `[r_in, r_out]` annulus:
  - climate: `[40, 90]`  · crowd: `[95, 145]`  · price: `[150, 200]`.
  (2-ring configs use climate `[46,106]`, then the second at `[112,182]`.)
  A month's metric wedge fills its band from `r_in` to
  `r_fill = r_in + value·(r_out − r_in)` — a partial annular wedge (donut
  slice). Empty/absent metric → no wedge (band shows only its faint guide).
  **Worked anchor:** Goa Dec crowd = 0.95 → outer radius
  `95 + 0.95·(145−95) = 142.5`; Goa Jul crowd = 0.10 → `95 + 0.10·50 = 100.0`
  (a stub near the band floor). Feb price = 0.45 → `150 + 0.45·50 = 172.5`.
- **Band guides:** each band's `r_in` and `r_out` as faint full circles
  `--ink` @ 0.16, 0.75px; 12 radial spoke lines at the sector gaps `--ink` @
  0.12. A tiny ring-legend at the centre hub (r < 40): three concentric arcs
  labelled `CLI` / `CRD` / `PRC` mono 8.5px — no, **9.5px floor** → the hub
  legend is instead a single 3-row key placed in the top-left margin (mono
  9.5px, one swatch + word per ring), keeping the hub clean.
- **Month labels:** three-letter mono caps (`JAN`…`DEC`) 10px `+0.08em` at
  radius 214 along each sector's centre angle, `--ink` @ 0.6; rotated upright
  (never upside-down — labels past 90°/below the axis stay horizontal).
- **Sweet-spot arc:** the `sweetSpot` months (or the computed default) get a
  1.5px `--accent-deep` scalloped arc just outside the price band (r = 206)
  spanning their sectors, with a small `` BEST `` mono tag at the arc's mid
  angle. **Computed default anchor:** for Goa, months where climate ≥ 0.6 ∧
  crowd ≤ 0.4 ∧ price ≤ 0.5 → Feb (0.80/0.45/0.45 — crowd 0.45 > 0.4 → **fails**),
  Mar (0.70/0.35/0.40 → **passes**), **and Oct (0.60/0.35/0.45 → passes**:
  climate 0.60 ≥ 0.6, crowd 0.35 ≤ 0.4, price 0.45 ≤ 0.5). So the computed set is
  **{Mar, Oct}** — two non-contiguous months, which the scalloped arc draws as
  two separate arcs (one per contiguous run). The authored `sweetSpot: [1,2]`
  (Feb–Mar) overrides the computed set (author's editorial window wins — here it
  deliberately swaps Oct's reopening shoulder for Feb's, and the caption argues
  Feb–Mar; declared so the two don't fight). *(Corrected 2026-07-06: the prior
  anchor said the computed window was "March only" — it omitted October, which
  also satisfies all three thresholds by the blueprint's own predicate. An
  implementer testing the computed default against "March only" would wrongly
  conclude their code was buggy. Also declared how the renderer handles a
  non-contiguous computed set: one arc per run.)*
- **The tilt (CSS-3D):** the whole `.px-swheel__disc` carries
  `transform: rotateX(52deg) rotateZ(-8deg)` — the dial laid on the desk, read
  at an angle (travel's field-journal register). Month labels counter-rotate
  (`rotateX(-52deg)`) to stay readable. Under `core/Tilt.astro`, pointer moves
  add ±6° of parallax tilt. Reduced-motion / no-JS → the static 52° tilt holds
  (it is a CSS transform, not an animation) OR, if the flat form reads better
  for print, a `prefers-reduced-motion` rule flattens to `rotateX(0)` — **choose
  flatten** (a tilted disc under reduced-motion can disorient; the flat wheel is
  fully legible). Pointer parallax is disabled under reduced-motion regardless.
- **375px:** viewBox scales; the disc tilt reduces to `rotateX(44deg)` (less
  foreshortening on a small screen); month labels 9.5px; the ring key moves
  above the wheel. No horizontal overflow.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated): band guides `reveal` → metric wedges `grow` (each
  wedge grows radially from its `r_in`, `--ease`, staggered by month Jan→Dec,
  total ≤ 1.4 s — travel's slow sweep) → month labels + ring key `reveal` →
  sweet-spot arc `sweep` (draws along its sectors) → `BEST` tag `reveal` last.
  Full sequence ≤ 1.6 s.
- Scrub-time (event-driven, the one control): selecting a month via the scrubber
  lifts that sector's wedges (`hoverLift` — opacity of other sectors → 0.55, the
  selected sector to full) in 150 ms and swaps the readout panel; no layout
  reflow. Reduced-motion → opacity-only, instant.
- No continuous motion (a calendar does not tick). The CSS-3D tilt is
  static/pointer-parallax only.
- **Composed still (reduced-motion / no-JS):** the full wheel, all wedges, month
  labels, ring key, sweet-spot arc + `BEST` tag, and the readout panel showing
  the **sweet-spot's first month** (the answer at rest). Flat under
  reduced-motion.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| climate wedges (inner ring) | `--accent` @ 0.7 (terracotta = the warmth/comfort axis) |
| crowd wedges (middle ring) | `--ink` @ 0.55 (crowds = press of people, neutral ink — the thing you want LESS of reads as weight, not warmth) |
| price wedges (outer ring) | `--accent-alt` @ 0.6 (teal = the cost/alternative axis) |
| band guides + spokes | `--ink` @ 0.16 / @ 0.12 |
| month labels + ring key | `--ink` @ 0.6, mono |
| sweet-spot arc + `BEST` tag | `--accent-deep` @ 0.9 (the finding — the recommended window) |
| selected-month highlight | the sector's own wedges at full opacity; others dimmed 0.55 |

Three encodings, each a declared fixed role (climate = accent, crowd = ink,
price = accent-alt) — this is the CANON §4 "at most two data colours beyond the
accent" allowance, used exactly: accent + ink-as-data + accent-alt. Declared
here. Text on cream uses `--accent-deep` for the finding (CANON §6).

## 7. Fallback design (first-class)

No-JS is the print edition of the recommendation:

- The wheel renders fully at build time — all wedges, guides, month labels, ring
  key, sweet-spot arc + `BEST` tag — flat or lightly tilted (CSS transform, no
  JS). This is complete static SVG.
- The **readout panel** renders at build time showing the sweet-spot's first
  month (the answer): `` {place} · {MONTH} — climate {c} · crowd {r} · price
  {p} `` (mono), plus that month's `label` if present. Static; no JS to paint.
- The month scrubber is a JS-only control: rendered with `hidden`, unhidden by
  the island on boot (the standing controls-never-show-dead contract).
- Below the wheel, the **month ledger** (AT-readable data source) — a
  `<details>` table, one row per month: `{MONTH} · climate {c} · crowd {r} ·
  price {p} · {label?}`. Twelve rows > the 5-row threshold, so per REVIEW
  amendment 3 it ships **collapsed** (`<details>` without `open`; summary "all
  twelve months"); no-JS readers get it (the `open` is added in markup and the
  island removes it on boot — same inversion as `coalition-calculus` §7 so no-JS
  = open, JS = collapsed behind the live scrubber).
- Nothing dropped: every month's three values and label are in the no-JS page.

## 8. Interaction spec — one control (the reader-agency pattern)

Follows `coalition-calculus` §8's five rules (data at rest / one control /
aria-live readout / self-explaining / keyboard-complete):

- **The one control: a month scrubber.** A horizontal 12-stop control under the
  wheel — realised as a native `<input type="range" min="0" max="11" step="1">`
  with a visible month-tick track (each stop a 44×44 target zone), OR an
  equivalent 12-button mono chip row (Jan…Dec). **Pick the range input** (one
  scrubber = one control, cleaner than 12 chips and the CANON §9 "slider"
  affordance). Moving it selects a month; the wheel highlights that sector and
  the readout panel swaps to that month's numbers + label.
- The readout element is `aria-live="polite"`: each scrub announces
  `` {MONTH}: climate {c}, crowd {r}, price {p} `` to AT without focus moving.
- Hover/tap a month sector on the wheel also selects it (pointer parity with the
  scrubber) — the sector is a 44×44-min hit region at its outer radius.
- No second control. No tooltips beyond the single shared readout panel (the
  panel IS the tooltip, pinned, not floating — one readout surface).
- Keyboard: the range input is natively arrow-key driven (←/→ = prev/next
  month); the collapsed ledger `<details>` is focusable; the sweet-spot is
  stated in the caption (not gated behind interaction). `touch-action: pan-y` on
  the wheel (it's a tilted surface but carries no drag-data — vertical scroll
  stays sacred).

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "The year runs clockwise from January;
  each month's three arcs are how good the weather is, how thick the crowds are,
  and how high the prices climb. The best time to go is where the inner arc is
  full and the outer two are empty."
- **how** (ExpandModal): "Slide through the months — the wheel lights each one
  and reads out its numbers. The marked arc is the sweet spot."
- Caption guidance: state the window claim ("the sweet spot is February–March"),
  never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 55 words — 12 month labels (12) +
  ring key (3 words) + `BEST` tag (1) + readout panel one line (~10) +
  `indices 0–1` chip + caption (~24) + plain (~40 → trim caption if the sum
  nears 80). The 12-row ledger is collapsed and doesn't count; per-month `label`
  strings are behind interaction.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 260 (12 sectors × up to 3 wedges + 6 band circles + 12 spokes + 12 labels + arc) |
| Inline island JS | ≤ 2 KB / ≤ 70 lines, vanilla, `is:inline` (scrub → toggle highlight + swap readout; no geometry recompute) |
| `data` payload | ≤ 2.5 KB (12 months × 3 floats + labels) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px, scrubber stops ≥ 44px targets · reduced-motion still =
      flat wheel, readout at sweet-spot month · token grep (accent / ink-as-data
      / accent-alt / accent-deep, all declared; no hex) · caption + source +
      plain · payload validates + degrades on missing metric/`label`/`sweetSpot`
      · prefix unique
- [ ] `months.length !== 12` fails the build naming the 12-month rule
- [ ] Jan sector is at the top (12 o'clock), Apr at 3 o'clock, Jul at bottom,
      Oct at 9 o'clock (angle anchors)
- [ ] Goa Dec crowd wedge outer radius = 142.5 (0.95 of the [95,145] band);
      Jul crowd wedge ≈ 100.0 (0.10 of band) — recompute anchors
- [ ] Absent `sweetSpot` → computed window is ALL months passing climate ≥ 0.6
      ∧ crowd ≤ 0.4 ∧ price ≤ 0.5 (Goa → **{March, October}**, drawn as two
      separate arcs); authored `sweetSpot: [1,2]` overrides it with Feb–Mar
- [ ] The `indices 0–1` chip renders; the readout at rest shows the sweet-spot's
      first month
- [ ] Scrubber: ←/→ steps months; each step highlights the sector (others →
      0.55) and swaps the readout; the readout is `aria-live` and announces the
      month's three values with no focus change
- [ ] Wheel sector tap selects the same month as the equivalent scrubber stop
- [ ] Reduced-motion: wheel flattens to `rotateX(0)`, no pointer parallax, no
      grow/sweep running; still fully legible
- [ ] No-JS (view-source): full wheel + readout at sweet-spot month painted;
      scrubber absent (hidden); 12-month ledger `<details>` open
- [ ] Card height never changes across any scrub (reserved readout panel)

---

*Registry duties (P6, at implementation — NOT now): add `season-wheel` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog`), document the `px-swheel`
prefix in `src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-travel-showcase`.*
