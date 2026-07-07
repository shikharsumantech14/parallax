# Blueprint — `city-grid` (travel · SVG · the orientation-rose family)

> A city's street bearings drawn as a polar histogram — the "urban fingerprint"
> figure. A gridded city (Manhattan, Chicago) shows a tight cross of spokes; an
> organic one (a medieval quarter, Boston) shows a near-circle of scattered
> petals. The reader reads the city's *plan* — was it drawn by a surveyor or by
> centuries of footpaths — from the shape of the rose alone. Build-time static
> SVG (a printed plate); usable to compare up to three cities side by side.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `city-grid` |
| World | travel (usable cross-world for urban stories; wears the issue theme) |
| Tier | SVG (build-time layout, `html.js`-gated reveal; no runtime JS beyond the shared Reveal island) |
| Component | `src/components/topic/travel/CityGrid.astro` |
| Scene module | n/a |
| Shared math | none — bin folding + normalisation are three expressions (§4) implemented in the Astro frontmatter; the §11 anchors pin them. Data arrives pre-binned (see §3) so no geodesy dependency at build |
| CSS prefix | `px-cgrid` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, AGENTS.md §4 table) |
| Flagship reference | `PlayerRadar.astro` (polar geometry + spoke labels + `overflow: visible` padding), `ClimateSpiral.astro` (build-time polar path + reveal), `power-flow.md` (build-time-static / print-plate discipline) |

## 2. What it shows / when to use

The distribution of street compass bearings for a city — a 36-petal polar
histogram where petal length is how much road runs at that bearing. The overall
silhouette classifies the city: a sharp four-spoke cross = a planned grid; a
soft near-circle = organic growth.

- **USE WHEN:** the dossier has per-bearing road quantities for 1–3 cities
  (36 bins × a share, from OSMnx / an OpenStreetMap extract) and the *shape of
  the plan* is the argument — orderliness, grid rotation, one city vs another.
- **DON'T USE:** an actual route between places (→ `journey-map`, `route-globe`);
  a where-is-it map (→ `region-map`); a single scalar orientation (→ a
  `data-readout` tile). Not for non-city angular data (weather wind roses would
  reuse the FORM but belong to earth if built — this kind is street-bearing).
- **Pairs with:** `wide` (a 3-up comparison needs the width); default width for
  a single city. Hero-capable for a "how cities are drawn" issue. Never
  `layout: split` (no interaction to drive by scroll; it is a static plate).

## 3. Data schema

```ts
interface CityGridData {
  cities: Array<{                // 1–3 cities; build error outside that range
    name: string;                // "Manhattan"
    subtitle?: string;           // "New York, USA" — mono, under the name
    // 36 non-negative bin values, one per 10° sector, bin b covers bearings
    // [b·10 − 5, b·10 + 5)°. Bin 0 = due north (0°/360°). May be raw road
    // lengths (metres), counts, or shares — the component NORMALISES per city
    // (see §4), so cross-city comparison is by SHAPE not absolute size.
    bins: number[];              // length EXACTLY 36; build error otherwise
    orderScore?: number;         // optional 0–1 "orientation-order" φ (Boeing 2019).
                                 //   If present, shown as a mono readout; if absent,
                                 //   the component computes it (§4) and shows it.
  }>;
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (a planned grid vs an organic city — illustrative bin shares)
cities:
  - name: "Manhattan"
    subtitle: "New York, USA"
    # a rotated grid: avenues bearing ~29°/209° (bins 3, 21), streets ~119°/299°
    # (bins 12, 30). Four dominant spokes, near-zero elsewhere.
    bins: [2,1,3,38,4,1,2,1,1,1,2,3,34,3,1,1,1,1,2,1,3,37,4,1,2,1,1,1,2,3,33,3,1,1,1,1]
    orderScore: 0.91
  - name: "Boston"
    subtitle: "Massachusetts, USA"
    # organic: energy spread across many bins, no dominant cross.
    bins: [7,6,8,7,9,6,7,8,6,7,9,6,7,8,6,7,9,6,7,6,8,7,9,6,7,8,6,7,9,6,7,8,6,7,9,6]
    orderScore: 0.12
caption: "Manhattan's grid collapses onto four bearings; Boston's streets point everywhere at once."
source: "Street bearings from OpenStreetMap via OSMnx (Boeing, 2019)."
```

**Data flags with visual consequences (CANON §7):** the rose is normalised
per city (each city's longest petal = the ring radius) so two cities of very
different size are shape-comparable. This normalisation is honest but MUST be
declared: the component AUTO-RENDERS the mono chip `` normalised per city `` in
the caption row whenever `cities.length > 1`. Single-city roses are still
normalised (petal 1.0 = the max bin) but need no comparison caveat, so no chip.

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox:** `0 0 {W} {H}` where per rose the plotting box is **300×300**
  with a **56px** label margin all round; one city → `W = 412, H = 380`; two →
  `W = 760`; three → `W = 1096` (roses laid horizontally, 40px gutter). Each
  rose centre `c_i = (206 + i·(300+40), 190)`. `overflow: visible` on the SVG
  (AGENTS.md §5) so the N/E/S/W tick labels bleed into the 56px margin.
- **Radius:** rose outer radius **R = 130** (300-box, 20px breathing to the
  label ring). Three concentric guide rings at 0.33R, 0.66R, R — `--ink` @ 0.16
  (support opacity, CANON §6), 0.75px.
- **Bins → petals:** 36 sectors, sector `b` spans angle
  `θ_b = b·10°` measured **clockwise from north (up)** — screen angle
  `a_b = −90° + b·10°` in standard SVG coords (0° = +x/east; north is up so
  subtract 90°). Petal `b` is a filled wedge from centre spanning
  `[a_b − 5°, a_b + 5°]` (a 10° slice, 1px gap between neighbours via a 4° draw
  inset → draw `[a_b − 4°, a_b + 4°]`).
- **Petal length:** `len_b = R · bins[b] / max(bins)` (per-city normalisation —
  the honesty chip in §3). A zero bin draws nothing (no stub).
- **Order score (Boeing φ):** if `orderScore` absent, compute
  `φ = 1 − ( (H − H_min) / (H_max − H_min) )²` where `H = −Σ p_b·ln p_b`
  (Shannon entropy of the normalised shares `p_b = bins[b]/Σbins`),
  `H_max = ln 36` (perfectly uniform → φ = 0), `H_min` = the entropy of a
  perfect single-direction grid (four equal bins → `ln 4`). So
  `φ = 1 − ((H − ln4)/(ln36 − ln4))²`, clamped [0, 1]. Shown as a mono readout
  `` ORDER φ {value·100}% `` under each rose. This is Boeing (2019) exactly: order
  is HIGH when entropy is LOW (a grid concentrates road length onto a few
  bearings) and near 0 when entropy is maximal (roads point every which way); the
  term is **squared** so a nearly-uniform city collapses to ≈ 0 rather than
  drifting up. **Worked anchor:** the Manhattan payload (H ≈ 2.53) →
  φ = 1 − ((2.53 − 1.386)/(3.584 − 1.386))² ≈ **0.73**; a clean 4-spoke grid
  with a low noise floor → φ ≈ 0.86; a perfect 4-spoke grid → φ = 1.0. Boston's
  near-uniform bins (H ≈ 3.57) → φ ≈ **0.01**; a perfectly uniform 36-bin city →
  φ = 0. The authored `orderScore`s (Manhattan 0.91, Boston 0.12) are used
  verbatim when present — they read as a cleaner grid / slightly-textured organic
  city than the illustrative bins alone compute, which is fine since present
  scores win. *(Corrected 2026-07-06: the prior formula was
  `φ = 1 − (H_max − H)/(H_max − H_min)`, which simplifies to
  `(H − H_min)/(H_max − H_min)` — the exact INVERSE of orientation-order: it
  scored the uniform/organic Boston at 0.995 and the Manhattan grid at only 0.52,
  i.e. it rewarded disorder and directly contradicted this blueprint's own prose
  ("uniform → φ = 0", "grid → φ ≈ 0.9") and the authored scores. Recomputed from
  the payload with the correct Boeing squared-entropy form. Same
  formula-fitted-to-a-narrative-it-doesn't-produce class as `power-flow`'s
  dash-rate bug.)*
- **Cardinal ticks:** N (top), E (right), S (bottom), W (left) as mono 10px
  labels at R + 18, `--ink` @ 0.55, uppercase +0.08em; 30°/60° minor ticks as
  2px `--ink` @ 0.16 marks on the outer ring. No numeric degree labels (the
  rose is read by shape, not measured — text-budget discipline, §9).
- **City name:** Fraunces 16px (place-name serif voice, `worlds/travel.md`)
  centred above each rose at y = 24; `subtitle` mono 10px beneath it.
- **Bidirectional note:** streets are undirected, so a real grid appears as
  **opposite pairs** of petals (bins b and b+18). The component does NOT fold
  the data (the 36-bin input already carries both ends); it just renders all 36,
  and the visual symmetry across the centre is the tell. (Declared so an
  implementer doesn't "helpfully" fold to 18 bins.)
- **375px:** roses stack vertically (1 per row) at 300-box → the SVG wrapper
  `.px-cgrid__wrap { padding: 0 40px }`; petal geometry unchanged; label margin
  shrinks to 40px; N/E/S/W ticks stay ≥ 9.5px. No horizontal overflow.

## 5. Motion spec (names from motion.md)

- Reveal (html.js-gated, `.px-viz:not(.is-in)` hides the pre-reveal state):
  guide rings `reveal` (opacity, 400 ms) → petals `grow` (each wedge scales from
  centre 0→len, `--ease`, staggered by bearing: bin 0 first, sweeping clockwise,
  total ≤ 1.4 s — travel's slower rose "drawing") → cardinal ticks + name +
  `ORDER φ` readout `reveal` last. For a multi-city plate, roses stagger 150 ms
  left→right. Full sequence ≤ 1.6 s.
- No continuous motion (a city plan does not animate — a static plate,
  `worlds/travel.md` "records don't fidget" analogue).
- Reduced-motion / no-JS: everything painted final — all petals at full length,
  rings, ticks, readouts. This IS the print plate (§7).
- **Composed still:** the complete rose(s) with petals, rings, cardinal ticks,
  name, subtitle, `ORDER φ`.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| petals | `--accent` @ 0.42 fill + `--accent-deep` @ 0.9 1px edge (terracotta = the city drawn; edge gives each petal definition on cream) |
| guide rings + minor ticks | `--ink` @ 0.16 (support, CANON §6) |
| cardinal N/E/S/W ticks | `--ink` @ 0.55, mono |
| city name | `--ink` @ 0.92, Fraunces |
| subtitle + `ORDER φ` readout | `--ink` @ 0.6 (subtitle), `--accent-deep` (the φ value, mono) |

Single-accent discipline: NO per-city colors (a 3-up plate is three terracotta
roses — the SHAPES differ, not the hues; that is the whole argument). Text on
cream uses `--accent-deep`, never vivid `--accent` (CANON §6 WCAG). `--accent-alt`
unused.

## 7. Fallback design

The SVG is build-time static already — no separate fallback. No-JS = the final
painted rose(s) with every petal, ring, tick, name, and `ORDER φ` readout. This
IS the print plate. The `ORDER φ` readout is the AT-readable summary datum; the
rose shape is the qualitative content. Because there are ≤ 3 cities and no live
legend, the REVIEW amendment-3 legend-collapse rule does not engage (nothing to
collapse).

## 8. Interaction spec

- None interactive in v1 (the rose is a pure printed plate — SVG stays clean,
  matching `power-flow`). The `⤢` expand-to-modal (automatic via `.px-viz`) is
  the study view; in the modal the plain-language explainer states what a grid
  vs an organic rose means.
- No hover targets, no tooltips: petals carry no per-bin numeric labels by
  design (a 36-value table would blow the text budget, §9); the SHAPE is the
  reading. A reader who wants the numbers uses the expand modal's explainer.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Each spoke points the way a share of
  the city's streets run; a tight cross means a planned grid, a full circle
  means streets that grew every which way."
- **how** (ExpandModal): "Read the shape, not the numbers — the sharper the
  cross, the more the city was drawn on a grid. The φ score sums that up."
- Caption guidance: state the plan claim ("Manhattan's grid collapses onto four
  bearings"), never restate the form.
- **Text budget (CANON §4.5):** at rest per rose ≈ 12 words — name (1–2) +
  subtitle (2–3) + 4 cardinal ticks + `ORDER φ` (2) + the shared caption (~16)
  + plain (~26). A 3-up plate ≈ 55 words total, under 80. No per-petal labels is
  a deliberate budget choice, not an omission.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 500 (≤ 3 roses × [36 petals + 3 rings + ~12 ticks + ~4 text] ≈ 55 each) |
| Runtime JS | none beyond the shared Reveal island |
| `data` payload | ≤ 3 KB (3 cities × 36 ints + names) |
| Extra assets | none (data arrives pre-binned; no OSM fetch at runtime) |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test · 375px no overflow,
      labels ≥ 9.5px, targets n/a (no controls) · reduced-motion still = final
      plate · token grep (single accent, no hex literals) · caption + source +
      plain · payload validates · degrades on missing `subtitle`/`orderScore` ·
      prefix unique
- [ ] `bins.length !== 36` fails the build with a message naming the 36-bin rule;
      `cities.length` of 0 or 4 fails naming the 1–3 rule
- [ ] The Manhattan example renders four dominant petals at bins 3, 12, 21, 30
      (avenues ~29°/209°, streets ~119°/299°) and near-nothing elsewhere;
      the cross reads as a grid
- [ ] Petal length is `R · bins[b] / max(bins)`: Manhattan's bin 3 (value 38 =
      max) reaches the outer ring; its bin 0 (value 2) reaches ≈ 5% of R
- [ ] `orderScore` absent → computed φ ∈ [0,1] with the Boeing squared-entropy
      formula `φ = 1 − ((H − ln4)/(ln36 − ln4))²`; a perfectly uniform 36-bin
      city → φ = 0; a perfect 4-spoke grid → φ = 1.0 (a clean grid with a low
      noise floor ≈ 0.86); the illustrative Manhattan bins → φ ≈ 0.73, Boston
      ≈ 0.01 (grid scores ABOVE organic — direction sanity check); present
      `orderScore` is used verbatim
- [ ] `cities.length > 1` renders the caption chip `normalised per city`;
      a single city renders no chip
- [ ] Cardinal N tick is at the top (bearing 0 = north = up); E at right
- [ ] Multi-city plate: roses are the same terracotta (shape does the arguing —
      grep for any per-city color literal → none)
- [ ] No-JS (view-source): identical final plate with all petals + φ readouts
- [ ] 375px: roses stack, N/E/S/W ticks ≥ 9.5px, no horizontal overflow

---

*Registry duties (P6, at implementation — NOT now): add `city-grid` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`, add
the `EXPLAIN` entry (`src/lib/explainers.ts`), add the catalog block
(`docs/design/catalog.md` — `npm run check:catalog`), document the `px-cgrid`
prefix in `src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-travel-showcase`.*
