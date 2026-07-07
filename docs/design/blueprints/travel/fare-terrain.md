# Blueprint — `fare-terrain` (travel · SVG · the booking-curve ridgeline)

> When to book, drawn as terrain: median fare against days-before-departure as a
> ridgeline of overlapping route-curves (a joyplot), with the booking sweet-spot
> — the valley where fares bottom out before the last-minute cliff — cut through
> all of them as a shaded gorge. The reader sees the shape every booking-advice
> article gestures at: fares drift down from the far-out speculative highs, pool
> in a three-to-five-week valley, then rocket in the final fortnight. Build-time
> static SVG (a printed contour plate).

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `fare-terrain` |
| World | travel |
| Tier | SVG (build-time layout, `html.js`-gated reveal; no runtime data JS) |
| Component | `src/components/topic/travel/FareTerrain.astro` |
| Scene module | n/a |
| Shared math | none — the valley detection + ridgeline layout are four expressions (§4) in the Astro frontmatter; §11 anchors pin them |
| CSS prefix | `px-fterr` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, AGENTS.md §4 table) |
| Flagship reference | `ClimateStrip.astro` / `ClimateSpiral.astro` (build-time series path + reveal), `power-flow.md` (build-time-static / print-plate discipline), `AdoptionCurve.astro` (milestone/marker labels with `overflow: visible`) |

## 2. What it shows / when to use

Median fare as a function of how far ahead you book, for one or several routes
stacked as a ridgeline, with the cheapest-booking window marked as a valley
through the terrain. The reader learns *when* to buy.

- **USE WHEN:** a fare-timing / "when to book" story with per-route fare curves
  over days-before-departure (≥ 6 sample points per route, 1–5 routes), where
  the booking sweet-spot IS the argument.
- **DON'T USE:** the price of a trip broken into cost categories (→
  `data-readout` tiles or a `comparison`); a route's geography (→ `route-globe`/
  `journey-map`); the seasonal when-to-*go* dial (→ `season-wheel` — that's
  month-of-year; this is days-before-departure). Fares over calendar months →
  `climate-calendar`'s cousin territory, not this.
- **Pairs with:** `wide` (a ridgeline wants horizontal room); default width for
  a single route. Hero-capable for a "how airfares actually move" issue. Not
  `layout: split` (static plate, no scroll control).

## 3. Data schema

```ts
interface FareTerrainData {
  routes: Array<{                // 1–5 routes; build error outside that range
    label: string;               // "DEL → LHR" — mono route code (travel stub voice)
    // fare samples: daysBefore descending is NOT required; the component sorts.
    // Each point: days before departure (≥1) and a median fare (same unit across
    // all routes, or a 0–1 index — see the `unit` field).
    points: Array<{ daysBefore: number; fare: number }>;  // ≥6 points each
    highlight?: boolean;         // the story's focal route (accent-deep curve + valley label)
  }>;
  unit: string;                  // "₹" | "$" | "index" — labels the fare axis + readouts
  sweetSpotDays?: [number, number]; // [maxDays, minDays] booking window to shade.
                                 //   If absent, computed: the contiguous daysBefore range
                                 //   whose fare ≤ 1.05 × the global-min fare (§4).
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (one route's booking curve — illustrative fare index, 100 = cheapest)
routes:
  - label: "DEL → LHR"
    highlight: true
    points:
      - { daysBefore: 120, fare: 128 }
      - { daysBefore: 90,  fare: 120 }
      - { daysBefore: 75,  fare: 115 }
      - { daysBefore: 60,  fare: 110 }
      - { daysBefore: 45,  fare: 104 }
      - { daysBefore: 35,  fare: 100 }
      - { daysBefore: 28,  fare: 98  }
      - { daysBefore: 21,  fare: 101 }
      - { daysBefore: 14,  fare: 112 }
      - { daysBefore: 10,  fare: 126 }
      - { daysBefore: 7,   fare: 148 }
      - { daysBefore: 3,   fare: 182 }
      - { daysBefore: 1,   fare: 210 }
unit: "index"
caption: "Fares bottom out about four weeks before departure, then climb steeply — the last-minute seat costs more than double the sweet-spot fare."
source: "Illustrative median-fare curve by advance-purchase window."
```

**Data flags with visual consequences (CANON §7):** the x-axis (days-before-
departure) is **reversed** — 120 days at the left, departure (day 0) at the
right — because the reader's mental model is "time running toward the flight".
This reversal MUST be declared: the component AUTO-RENDERS the mono chip
`` time → departure `` under the axis so the direction is unambiguous. If a
`unit: 'index'` is used (relative, not currency), also render `` fare index ``.

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox:** `0 0 720 {H}` where `H = 120 + routeCount·ROW + 60`, `ROW = 48`
  (the ridgeline row pitch). One route → H ≈ 288; five → H ≈ 480.
  `overflow: visible`; `.px-fterr__wrap { padding: 0 56px }` (fixed-column route
  labels bleed right).
- **X axis (reversed, shared by all routes):** plot box `[x: 72…648]` (576
  wide). `daysBefore` mapped **reversed, LINEAR only:**
  `x(d) = 648 − (d/maxDays)·576` (so d = maxDays → left edge,
  d = 0 → right edge). Ticks at 90, 60, 30, 14, 7, 1 days, mono 10px `--ink` @
  0.55. `maxDays = max daysBefore across routes`. *(Corrected 2026-07-06: the
  prior text said "optionally log", but the §3 schema exposes no log-x flag, no
  log mapping formula was given, and CANON §7 would require a `days log-compressed`
  honesty chip that was also unspecified — a dangling half-option an implementer
  couldn't build. The valley/cliff shape reads correctly on a linear reversed
  axis, so log-x is dropped, not left open. If a future variant wants it, it must
  add the flag, the `x(d) = 648 − (log(d)/log(maxDays))·576` mapping, AND the
  honesty chip together.)*
- **Ridgeline rows:** route `r` (0-indexed from the top) has baseline
  `y0_r = 80 + r·ROW`. Its curve peaks UPWARD (lower y = higher fare) with
  amplitude scaled so the tallest fare across ALL routes reaches
  `AMP = ROW·2.4 = 115` px (curves overlap ~2.4 rows — the joyplot look):
  `y(d) = y0_r − (fare(d)/globalMaxFare)·AMP`. Curves drawn back-to-front
  (bottom route first) so nearer ridges occlude farther ones; each curve's
  **area below it is filled paper** (`--paper` @ 1.0) so overlaps read as
  layered terrain, then a 1.5px stroke on top.
- **Curve smoothing:** Catmull-Rom → cubic Bézier through the sorted sample
  points (monotone-safe; no overshoot below the data — matches motion.md's
  no-overshoot register). Points sorted by `daysBefore` descending before
  drawing.
- **The valley (sweet-spot gorge):** a vertical shaded band spanning the
  `sweetSpotDays` window across the FULL height, `--accent` @ 0.10 fill with
  1px dashed `--accent-deep` @ 0.6 edges, labelled `` SWEET SPOT · {maxD}–{minD}
  DAYS `` (mono, top of the band).
  **Computed default (recomputable anchor):** find `globalMin = min fare` over
  the highlighted route (or route 0 if none highlighted); the window is the
  contiguous `daysBefore` range whose fares ≤ `1.05·globalMin`. For the example:
  globalMin = 98 (at 28 d), threshold = 102.9, qualifying points = {35 d (100),
  28 d (98), 21 d (101)} → **window 21–35 days**, minimum at **28 days**. An
  authored `sweetSpotDays` overrides the computed window.
- **Route labels (fixed right column, AGENTS.md §5):** each route's `label` at
  `x = 656`, y = its curve's right-end y, mono; the highlighted route's label in
  `--accent-deep`. A dashed connector from the curve's last point to the label
  if they'd otherwise not align. Clamp label y to `[24, H−16]`.
- **Cliff marker:** the last-minute rise — a small down-pointing caret + mono
  tag `` +{pct}% last 14 days `` anchored near the highlighted route's day-1
  peak, where `pct = round((fare@1 / fare@sweetMin − 1)·100)`. **Anchor:** the
  example → 210/98 − 1 = 1.14 → `` +114% ``. (Only on the highlighted/sole
  route; declared so a 5-route plate doesn't stack five carets.)
- **375px:** viewBox scales (SVG is fluid width); day ticks thin to 90/30/7/1;
  route labels 9.5px; AMP reduces to `ROW·2.0` (less overlap fits a narrow
  screen); no horizontal overflow.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated, `.px-viz:not(.is-in)` hides pre-reveal): axes `reveal`
  → valley band `reveal` (opacity) → route curves `sweep` (stroke dashoffset
  draw, back-to-front, each 1400 ms — travel's slow signature — staggered
  120 ms per route) → route labels + `SWEET SPOT` + cliff tag `reveal` last.
  Full sequence ≤ 1.6 s (respecting motion.md's ≤ 1.6 s stagger budget even
  across 5 routes — cap the per-route stagger so the total lands in budget).
- No continuous motion (a fare history is a fixed record — static plate,
  `worlds/travel.md` register).
- Reduced-motion / no-JS: everything painted final — all curves, the valley
  band, all labels. The print plate.
- **Composed still:** the full ridgeline, valley gorge shaded + labelled, route
  labels, cliff tag.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| route curves | `--accent-deep` @ 0.9 (highlighted route) / `--ink` @ 0.55 (other routes) — the focal route is terracotta-deep, the field is ink |
| curve area fills (occluders) | `--paper` @ 1.0 (so overlapping ridges layer as terrain, CANON §4 paper-occluder depth) |
| valley band | `--accent` @ 0.10 fill, `--accent-deep` @ 0.6 dashed edges |
| axes + day ticks + `unit` label | `--ink` @ 0.42 (axes), `--ink` @ 0.55 (ticks, mono) |
| `SWEET SPOT` + cliff `+{pct}%` tags | `--accent-deep` @ 0.9, mono |
| route labels | highlighted `--accent-deep`; others `--ink` @ 0.7, mono |

Single-accent discipline: NO per-route rainbow — one focal route in
terracotta-deep, the rest in ink, thickness/position doing the talking (the
politics `power-flow` answer to rainbow charts, applied to a joyplot). Text on
cream uses `--accent-deep`, never vivid `--accent` (CANON §6). `--accent-alt`
unused (there is no comparison-alternative axis here — the routes are peers, not
an A/B).

## 7. Fallback design

Build-time static SVG — no separate fallback. No-JS = the final painted
ridgeline, valley gorge, all labels, and the cliff tag. The `SWEET SPOT ·
{maxD}–{minD} DAYS` band label and the per-route labels ARE the AT-readable
summary (the booking window and the routes are stated in text on the plate). For
a ≤ 5-route plate there is no separate legend list to collapse, so the REVIEW
amendment-3 rule does not engage. This IS the print plate.

## 8. Interaction spec

- No data interaction in v1 (static plate — SVG stays clean, matching
  `power-flow`). The `⤢` expand-to-modal (automatic via `.px-viz`) is the study
  view; the modal explainer states the "book about a month out" takeaway.
- No hover targets, no tooltips: the sweet-spot window and the last-minute
  premium are printed as tags on the plate; a reader wanting per-point fares uses
  the expand modal. (Keeping the SVG pure honours the text budget, §9.)

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Each ridge is one route's fare as
  departure nears — time runs left to right toward the flight, and higher ground
  means a pricier ticket. The shaded valley is the window where fares bottom
  out."
- **how** (ExpandModal): "Follow a ridge from far-out on the left to the flight
  on the right; the low point in the shaded band is when to book."
- Caption guidance: state the timing claim ("fares bottom out about four weeks
  before departure"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 45 words — ≤ 5 route labels (≤ 10) +
  `SWEET SPOT` band label (~5) + cliff tag (~3) + `time → departure` +
  `fare index` chips + caption (~22). Well under 80 (a single-route plate ≈ 35).
  No per-point fare labels is a deliberate budget choice.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 400 (≤ 5 curves × [1 area + 1 stroke] + valley band + ~6 ticks + labels) |
| Runtime JS | none beyond the shared Reveal island |
| `data` payload | ≤ 4 KB (5 routes × ~13 points) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px · reduced-motion still = final plate · token grep (accent /
      accent-deep / ink / paper only, no hex) · caption + source + plain ·
      payload validates + degrades on missing `sweetSpotDays`/`highlight` ·
      prefix unique
- [ ] `routes.length` of 0 or 6 fails the build naming the 1–5 rule; a route
      with < 6 points fails naming the ≥6-samples rule
- [ ] X-axis is reversed: `daysBefore: 120` at the left, `daysBefore: 1` near
      the right; the `time → departure` chip renders
- [ ] Absent `sweetSpotDays` → computed window = the contiguous days whose fares
      ≤ 1.05 × min: for the example, **21–35 days** (min 98 at 28 days);
      authored `sweetSpotDays` overrides it
- [ ] The valley band spans the sweet-spot window full-height and is labelled
      `SWEET SPOT · 35–21 DAYS`
- [ ] Cliff tag on the highlighted route = `+114%` (210/98 − 1) `last 14 days`
- [ ] Curves layer as terrain (paper area fills occlude farther ridges); the
      highlighted route is terracotta-deep, others ink; no per-route rainbow
      (grep for color literals → none)
- [ ] `unit: 'index'` renders the `fare index` chip; a currency unit labels the
      fare readouts with the symbol instead
- [ ] No-JS (view-source): identical final ridgeline with valley + all labels
- [ ] Reveal stagger across 5 routes still completes ≤ 1.6 s (motion budget)

---

*Registry duties (P6, at implementation — NOT now): add `fare-terrain` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog`), document the `px-fterr`
prefix in `src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-travel-showcase`.*
