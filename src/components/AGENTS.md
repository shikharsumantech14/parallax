# Components — agent guide

> Local rules for `src/components/`. Read the root `AGENTS.md` first for
> project-level context.

---

## 1. Two layers, six topics

Components split into:

- **`core/`** — topic-agnostic. Renders identically under any `data-topic`,
  picking up colour/font tokens automatically. Includes the Masthead, Banner,
  Hero, Primer, Section, Quote, Prose, Comparison, DataReadout, Gauge,
  Sources, Colophon, and the ReadingToolbar (the floating reading-progress +
  Full/Skim + Save pill that replaced the old SkimToggle). Motion is not a
  component's: every build runs through the one island
  `src/scripts/build.ts` from attributes the component declares (§11, Lens
  Phase 5). `core/Reveal.astro` and `core/VizMotion.astro` were DELETED in
  Phase 5.

  **`core/VizCard.astro`** (RD-01a, 2026-08) is the shared shell the revamp-wave
  kinds render inside — and, since Phase 6.2 (2026-09-04), `scaling-plot`,
  `xg-race` and `climate-spiral` too, and since 2026-09-13 `you-think` and
  `number-sense`. It renders the caption row (with an optional chip, shown
  only in story mode: in the reading system SectionBody hands it no caption)
  and the graphic slot, and its root is the `data-build-scene` — **not** the
  source line (it still accepts `source`, ignored). Every other piece of
  section chrome — the caption in the article column, the cue numerals, the
  `Source · …` line in the figure panel — is `core/Section.astro`'s, for every
  kind. Components render none of it. **Lens Phase 8 (2026-10-04) removed the
  how-to-read panel and the plain line for good:** `src/lib/explainers.ts`
  (`EXPLAIN`, `NEEDS_HOW`, `howToReadFor`) is deleted, VizCard has no
  `howToRead` prop, and the schema fails the build on a `plain` or a
  `howToRead`. A kind explains itself through its cues (LENS §5.2).

- **`home/`** — meta-brand pieces used only on `/` and `/topics/*` index
  pages (TypographicChord, TopicStrip, CategoryCard, CategoryGrid,
  ArchiveList).
- **`topic/<topic>/`** — topic-signature components. One folder per topic.
  Each topic also has its own `<Topic>Index.astro` that drives
  `/topics/<topic>/`.
- **`SectionRenderer.astro`** — the article-chrome shell. Wraps a section in
  `core/Section.astro` (the reading system: the article beside the pinned
  figure panel, the cue numerals, the caption and the source line, plus the
  skim caption) and delegates the actual kind dispatch to `SectionBody.astro`.
- **`SectionBody.astro`** — **the dispatcher** (since 2026-07-05). Reads
  `section.kind`, renders the matching component, and passes through the
  section's `data` payload plus `caption` and `source` (which the component
  does not render). Shared with story mode, which renders bodies
  without the article chrome — this is why the switch lives here.
  **Add new kinds to `SectionBody.astro`, never to `SectionRenderer.astro`.**

**One typeface — Literata (the operator's ruling of 2026-10-04, `docs/design/LENS.md` §3).**
All four role tokens (`--font-display` / `--font-body` / `--font-ui` /
`--font-mono`) resolve to it; a component differentiates roles by size,
weight, case and tracking, never by family, at the launch values: headlines
700 tight, prose 400 18/1.72, labels 600 capitals at 12px (.16em; eyebrow
.18em, chip .14em, button .17em), numbers 700 tabular at line-height 1, the
label under a number 12 capitals .16em. **No whole sentence in italic**, ever
(captions, notes, annotations, the lit cue line: roman); only the one authored
emphasis word of a title is italic, 400, in the desk text colour. In-SVG text
keeps a literal stack (LENS §3.3): `'Literata',Georgia,serif`. Lens's two
faces (Newsreader and Instrument Sans, 2026-09-30 to 2026-10-04) are retired;
the paragraph below is the 2026-06-21 history of the trio before Literata.

**One 3-font type system (2026-06-21, supersedes per-topic display fonts).**
The product now uses a single trio everywhere — **Fraunces** (serif: headlines,
leads, nameplates, the one italic accent word), **Schibsted Grotesk** (sans:
body, UI, structural headings; replaced Inter Tight as `--font-body`), and
**JetBrains Mono** (labels, eyebrows, numerals). The six worlds no longer carry
per-world display fonts (Space Grotesk / Cormorant / Oswald etc. are retired) —
they differ by **accent colour + treatment** (case / weight / italic / ornament /
motif), not typeface. Normalised in `src/styles/type-v2.css` (imported last so it
wins); also touches `meta.css`, the six `themes/<topic>.css`, and SVG
`font-family` in `RegionMap`/`CarbonGauge` (now Fraunces, not Cormorant — note
this overrides the old §5 "Display labels: Cormorant Garamond" guidance).

---

## 2. Section-kind → component map

> **Lens (2026-09-30).** The design law is `docs/design/LENS.md`; the
> library is **87 kinds** after the verdict (LENS §9). Ten were DROPPED,
> component and all: `beat-sheet`, `plate`, `orbital-shells`,
> `elevation-profile`, `coalition-orbit`, `ballot-flow`, `orbit-globe`,
> `signal-readout`, `data-globe`, `route-globe`. `carbon-gauge` became
> **`gauge`** (`core/Gauge.astro`, three variants derived from the fields:
> budget, lean, capacity) with `swing-dial` and `throughput-dial` folded in;
> `route-card` became **`itinerary`** (`topic/travel/Itinerary.astro`) with
> `itinerary-reel` folded in (days become stops); `city-compare` folded into
> **`comparison`** (its pair form). The six old names are ALIASES
> (`KIND_ALIASES` in `src/content/config.ts`): the schema resolves them on
> parse, and `SectionBody` resolves again with `canonicalKind()`, so every
> arm sees the host. The tables below are corrected to match; the counts in
> their headings are the history they were written in.

**Source of truth:** `SECTION_KINDS` in `src/content/config.ts` (**97 kinds**
as of 2026-08-28 — 30 narrative/classic-viz kinds below + `act-break` + the
**59-kind** v2 3D / interactive library + the **7 revamp-wave kinds** (both
blocks after the table); counted against the array, not from memory). The catalog with per-kind usage rules is
`docs/design/catalog.md`, and `npm run check:catalog` now exists as a real
gate: it enforces a 1:1 match between `SECTION_KINDS` and the catalog's `##`
blocks, **in the same order**. A new kind that is missing from the catalog (or
sitting in the wrong slot) fails that check.

The v2 block grew in four waves: the original 30 (5 per world, 2026-06-03) →
+`solar-system` → +`chamber` / `power-flow` → the six WebGL world flagships
(`terrain-relief`, `neural-flow`, `terminator-globe`, `flight-of-the-ball`
joined `chamber` + `solar-system`) → the 2026-07-14 **breadth pass** (+22).

**Dispatcher split (2026-07-05):** the kind → component switch lives in
`src/components/SectionBody.astro` (no wrapper — shared with story mode);
`SectionRenderer.astro` wraps it in the article chrome (`core/Section.astro`,
the Lens reading system since Phase 3: eyebrow / title / intro and the kind's
sentences with their cue buttons in the article column, the graphic in the
pinned figure panel with the lit cue's line and `Source · …`, the caption
once, `data-layout`, plus the skim-caption block, which any kind may carry;
SectionRenderer passes the source link through). The "In plain terms" line
and the how-to-read panel are gone (Lens Phase 8). **Add new kinds to
SectionBody**, not SectionRenderer.

| Kind | Component | Topic-scope |
|---|---|---|
| ~~`hero`~~ | **retired 2026-09-13** (REGISTER-PLAN RG-09) — it had rendered nothing since the launch design deleted `core/Hero.astro`; removed from `SECTION_KINDS`, the catalog, the template and the one draft that carried it | — |
| `act-break` | `core/ActBreak.astro` — chapter divider on the well: rulers, the numeral at 160, double side rules (Lens Phase 6); consumes no section number, no cues | universal |
| `prose` | `core/Prose.astro` — paragraphs, no drop cap (retired 2026-09-08, re-added in Phase 6 by mistake, removed 2026-10-04); narrative, no cues | universal |
| `quote` | `core/Quote.astro` (`px-qt`) — the mark, the words at up to 32, a rule and the attribution (Lens Phase 6); narrative, no cues | universal |
| `comparison` | `core/Comparison.astro` (`px-cmp`, Lens Phase 6: side plates, then per row a label and one cell per side; a pair row's winner gets a drawn check). Cues: rows `1..n` (columns in the list form), plates `s1..sN` | universal |
| `data-readout` | `core/DataReadout.astro` (`.tel`, Lens Phase 6: tiles as cards, the key tile across the row at up to 96, the rest at up to 48, a zero drawn as a dashed ring). Cues: tiles `1..n` | universal |
| `timeline` | `topic/politics/Timeline.astro` (Lens Phase 6: year ticks on a spine, the stretch from the first `key` event thick in the desk mark) | politics-styled, used across topics |
| `paradox` | `topic/politics/Paradox.astro` (Lens Phase 6: two tint plates and a drawn tension mark; an optional `figure: {value, label, was?}` that SectionBody does not pass yet) | politics-styled, used across topics |
| `analogy` | `topic/politics/BrothersAnalogy.astro` (Lens Phase 6: a numbered read-across with drawn double arrows; narrative, no anchors) | universal |
| `bill-breakdown` | `topic/politics/BillBreakdown.astro` (Lens Phase 6: the payload card at 96 on the tint, a pictogram per card chosen from its words) | politics |
| `vote-result` | `topic/politics/VoteResult.astro` (Lens Phase 6: the shortfall at 96, a column-filled dot chamber with the required line and the shortfall bracket; words in HTML) | politics |
| `seat-chart` | `topic/politics/SeatChart.astro` (Lens Phase 6: region bands derived from `region`, then a diverging change table) | politics |
| `approval-chart` | `topic/politics/ApprovalChart.astro` (Lens Phase 6: a 440-unit viewBox fitted to the data, the gap tinted, the crossing ringed, HTML end labels; scrolls on a phone) | politics |
| `power-matrix` | `topic/politics/PowerMatrix.astro` (Lens Phase 6: 28px state squares in the desk mark; a party's `color` is its key dot) | politics |
| `orbit-trace` | `topic/space/OrbitTrace.astro` (Lens Phase 6: quarter arcs round the Earth's corner, labels in a fixed right column, log radii past a 4× altitude span; `px-ot`) | space |
| `launch-stats` | `topic/space/LaunchStats.astro` (Lens Phase 6: stacked columns per year, counts in the bands, the key in HTML; `px-lst`) | space |
| `region-map` | `topic/earth/RegionMap.astro` (projection fitted to its zones and markers since 2026-09-22, world framing past 150° of longitude; Lens Phase 6: drawn at 460 units in the desk ramp, tint to mark, on a pale tint sea; 12px names; the legend is HTML under the map; phones scroll it at 460. Anchors `1`…`n` zones, `m1`… markers, `legend`) | earth |
| `climate-strip` | `topic/earth/ClimateStrip.astro` (`px-cstrip` since Lens Phase 6: stripes in the desk ramp in a stretched SVG with no text, the years and callouts HTML placed by percent; the kit's `.cs` is retired. Anchors `<year>`, `1`…`3` annotations, `legend`, `head`) | earth |
| `gauge` | `core/Gauge.astro` (`px-gauge`; was `carbon-gauge`, `swing-dial` and `throughput-dial` fold in). Lens Phase 6: ONE half arc for all three variants (budget, lean, capacity), the number at up to 96 in its bowl, every word HTML. Cues: `value`, `fill`, `rest`, `left` / `right` (lean), `target` (budget), zones or markers `1..n` | universal |
| `commit-grid` | `topic/tech/CommitGrid.astro` (Lens Phase 6: tightened, a year set as two stacked halves, the named days ringed and cued, one key row, `meta` the accessible name; its CSS moved out of `themes/tech.css`) | tech |
| `benchmark-chart` | `topic/tech/BenchmarkChart.astro` (Lens Phase 6: one `subgrid` for every row, the reference line placed by % of the track, the label on its own line under 640px, the largest value at 96; CSS moved out of `dataviz-v2.css`) | tech |
| `adoption-curve` | `topic/tech/AdoptionCurve.astro` (Lens Phase 6: 460-unit panel drawing, x placed by value, straight segments, milestones as dashed rules plus a list, its own `.adc__` classes, no longer `.ac__`; CSS moved out of `dataviz-v2.css`) | tech |
| `journey-map` | `topic/travel/JourneyMap.astro` (Lens Phase 6: the totals at 48, a stop a row on a rail, the height as a value and a bar; `px-journey`, scoped; anchors `1…n`, `line`, `total`, `legend`) | travel |
| `itinerary` | `topic/travel/Itinerary.astro` (was `route-card`; `itinerary-reel` folds in). Lens Phase 6 redrew it as ONE route: the count at 96, mode glyphs on a dashed rail, a box of the leg's note and items under each stop, a filled end dot, a mode key; `days` render as stops. `px-itin`, scoped; the `.rc` markup and its CSS are gone. Anchors `1…n`, `end`, `total`, `legend` | travel |
| `match-stat-line` | `topic/sports/MatchStatLine.astro` (Lens Phase 6: badge discs, the score on its own row at 96 and sized down to its box when an authored score like "1 (4)" would not fit, butterfly bars per row; scoped `px-msl`, the CSS left `themes/sports.css`) | sports |
| `league-table` | `topic/sports/LeagueTable.astro` (Lens Phase 6: `px-lt`, the leader's points at 48, band chips, form pips, a divider row where positions jump; one fixed-layout table per run of positions; columns drop by container width) | sports |
| `player-radar` | `topic/sports/PlayerRadar.astro` (Lens Phase 6: `px-rdr`, a 290-unit radar that prints 12px on a phone, the top attribute at 48, `compare` drawn dashed) | sports |

Topic-scoped components are tinted via the topic's theme tokens (`--accent`,
`--ink`, etc.). They render under any `data-topic` but look most "at home"
in their parent topic.

**v2 data-viz note (2026-06-03).** Most topic charts plus the shared
`timeline` and `paradox` kinds were rewritten to the v2 kit's exact markup
and animations, and now emit the kit's *generic* data-viz class names
(`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside the
shared flat `.px-viz` card (`.px-viz` itself in `base.css` — radius 0, no shadow, a 1px `--hair` top rule since Lens Phase 8; the kit classes' CSS moved into the components in Lens Phase 6). This is
a deliberate, documented break from the `px-` prefix convention — see the
"v2 data-viz + chrome class exception" section below for the full list, the
`html.js`-gated reveal contract, and which components were left on their
`px-` classes.

### v2 3D / interactive library (2026-06-03, extended 2026-07-05, breadth pass 2026-07-14) — 59 kinds

These are the interactive + 3D section kinds, all in the v2 design language
(originally 5 per world; then the flagships; then the 22-kind breadth pass).
**Fourteen are lazy WebGL scenes** (Three.js — marked **WebGL** below, and the
only entries in `src/scripts/viz3d/scenes/index.ts`); the rest are CSS-3D
(perspective / `transform-3d`), animated SVG/canvas, or — new with the breadth
pass — **HTML-interactive** (build-time HTML paints the answer, a tiny island
adds the control). The full architecture — the `Viz3DRuntime` lazy-WebGL
pattern, the shared `.px3d-*` CSS-3D mechanics, and the no-JS / reduced-motion
contract — is documented in the "3D / interactive component library" section
(§10). Each component's per-component cosmetic CSS is a **scoped
`<style>` in its own `.astro`** (unique `px-*` prefix — see §4); only the
shared 3D mechanics + `.viz3d` mount live in `components-3d.css`. All take
`caption?` + `source?` like the other viz — but since Phase 6.1 (2026-09-04) **no component renders the source line itself**: `core/Section.astro` emits it (`.px-fig__src` in the figure panel, `.px-rs__src` in the article on phones) for every kind, so a new component must not add one, and all render a static
SVG/HTML fallback by default.

| Kind | Component | Topic | Tech |
|---|---|---|---|
| `bill-passage` | `topic/politics/BillPassage.astro` | politics | HTML stage rows (flat since Lens Phase 6) |
| `vote-flow` | `topic/politics/VoteFlow.astro` | politics | SVG Sankey + HTML label layer |
| `margin-ladder` | `topic/politics/MarginLadder.astro` | politics | HTML bars (flat since Lens Phase 6) |
| `chamber` | `topic/politics/Chamber.astro` | politics | **WebGL** (FLAGSHIP — instanced hemicycle + division walk; shared math `scripts/viz3d/hemicycle.ts`) |
| `power-flow` | `topic/politics/PowerFlow.astro` | politics | SVG (build-time Sankey) + HTML label layer |
| `coalition-calculus` | `topic/politics/CoalitionCalculus.astro` | politics | HTML-interactive (coalition builder vs the majority line) — **spread dispatch, see below** |
| `gerrymander-lens` | `topic/politics/GerrymanderLens.astro` | politics | SVG (same votes, three maps, efficiency-gap counters) |
| `solar-system` | `topic/space/SolarSystem.astro` | space | **WebGL** (FLAGSHIP — Keplerian; shared math `scripts/viz3d/kepler.ts`). Lens Phase 6: on the deep plate, the mount re-points `--ink` / `--paper` / `--muted` / `--accent-alt` for the scene; anchors and build on the HTML key |
| `trajectory-arc` | `topic/space/TrajectoryArc.astro` | space | SVG, 470 units (the CSS-3D tilt retired in Lens Phase 6) |
| `delta-v-ladder` | `topic/space/DeltaVLadder.astro` | space | SVG, 470 units: segments whose labels chain as "A → B" become side-by-side ROUTE columns (Lens Phase 6) |
| `descent-profile` | `topic/space/DescentProfile.astro` | space | SVG, 470 units; time carries no unit in the data, the caption names it |
| `constellation-swarm` | `topic/space/ConstellationSwarm.astro` | space | **WebGL** (instanced mega-constellation shells); Lens Phase 6: deep plate, text-free fallback, anchors and build on the HTML key of shells |
| `lagrange-map` | `topic/space/LagrangeMap.astro` | space | SVG, 470 units (equal-potential lines, the L1 · L2 inset beside the map) |
| `transfer-window` | `topic/space/TransferWindow.astro` | space | SVG instrument (Hohmann Δv + a lead slider that ships `hidden`, sits outside the build scene and never runs on load) |
| `eclipse-cone` | `topic/space/EclipseCone.astro` | space | SVG, 470 units (umbra to true length, then the tip at true scale both ways) |
| `core-sample` | `topic/earth/CoreSample.astro` | earth | SVG since Lens Phase 6 (a drilled column, marks at true depth when every depth parses, else even; anchors `1`…`n`, `head`) |
| `sea-level-tank` | `topic/earth/SeaLevelTank.astro` | earth | SVG since Lens Phase 6 (the water at the highest firm level; a level labelled low-confidence / upper / high end is dashed above it; anchors `1`…`n`, `lm1`…, `water`, `head`) |
| `climate-spiral` | `topic/earth/ClimateSpiral.astro` | earth | SVG — through `core/VizCard.astro`; MONTH scrub (`<input type=range>`, ships hidden, island unhides once the payload parses; per-month tables precomputed at build; the build owns `stroke-dashoffset`, the scrub owns opacity only). Lens Phase 6: drawn at 344 units so it fits a phone at 12px, each year a tone of the desk ramp, dashed rings at round values; the build is a scene INSIDE the card (`.px-spiral__scene`), because the card holds the JS-shown scrub. Anchors `<year>`, `jan`…`dec`, `ring1`…, `peak`, `head` |
| `quake-depth` | `topic/earth/QuakeDepth.astro` | earth | SVG (Lens Phase 6: real time on x, the top 10 km banded and counted in the headline, labels placed where they fit; 460 units, phones scroll. Anchors `1`…`n`, `band`, `head`) |
| `terrain-relief` | `topic/earth/TerrainRelief.astro` | earth | **WebGL** (FLAGSHIP — real DEM; shared math `scripts/viz3d/terrain.ts`). Lens Phase 6: on the desk's deep plate; the still is the board's ridgeline view looking north (true horizontal scale, height × `exaggeration`), peak names an HTML layer; the height chip is in flow under the scene. Anchors `1`…`n` peaks, `ridges`, `head` |
| `plate-motion` | `topic/earth/PlateMotion.astro` | earth | **WebGL** (plate velocity field from Euler poles; data `public/geo/plates.json`). Lens Phase 6: on the deep plate, names and speeds an HTML layer, the pole table on paper under it. Anchors `1`…`n` plates, `convergent` / `divergent` / `transform`, `head` |
| `atmosphere-column` | `topic/earth/AtmosphereColumn.astro` | earth | SVG (barometric column to true altitude; Lens Phase 6: 320 units, fits a phone at 12px. Anchors `troposphere`…`thermosphere`, `curve`, `1`…`n` landmarks, `head`) |
| `carbon-loop` | `topic/earth/CarbonLoop.astro` | earth | SVG (stock-and-flow cycle, conservation-checked at build time; Lens Phase 6: straight arrows, a cancelling pair labelled once, the residual a dark chip and the headline; 460 units, phones scroll. Anchors `<reservoir id>`, `1`…`n` fluxes, `residual`, `head`) |
| `storm-track` | `topic/earth/StormTrack.astro` | earth | **WebGL** (cyclone best-track on the globe, Saffir–Simpson). Lens Phase 6: on the deep plate, the still zoomed to the basin (the track's furthest fix at 62% of the disc), every fix labelled in an HTML layer. Anchors `1`…`n` fixes, `peak`, `track`, `head` |
| `arch-stack` | `topic/tech/ArchStack.astro` | tech | HTML slabs (Lens Phase 6: the perspective, the pointer tilt and the hover lift retired; a tinted face and a solid edge) |
| `latency-waterfall` | `topic/tech/LatencyWaterfall.astro` | tech | HTML (Lens Phase 6: the span name on its own wrapping line above its bar, round ticks, the total at 96) |
| `version-graph` | `topic/tech/VersionGraph.astro` | tech | SVG graph at its own pixel size + HTML rows (Lens Phase 6: labels clamp to two lines, a majority tag becomes the 96 number and hollows the rest) |
| `scaling-plot` | `topic/tech/ScalingPlot.astro` | tech | SVG — re-routed through `core/VizCard.astro` 2026-09-04 (Phase 6.2); LOG/LINEAR axis toggle via `px-inst__chip` (`aria-pressed`), both projections precomputed in frontmatter, no scale math on the client. Point labels 12px with a collision-aware placement pass (above, below, right, left, the corners, one line further out; the least important label drops) and a y gutter measured from its tick labels and title lines (2026-09-30). Lens Phase 6: redrawn for the panel at 460 units (no sideways scroll at 1280; scrolls in its card on a phone), the y title above the plot, round ticks, the annotated point at 96, the build scene on the plot (the Log / Linear control stays outside it). A point may be `illustrative` (drawn hollow; the readout then prints no ratio). The cue numerals are placed after the labels and notes, never on a word, and on phones the 460 min-width sits on the plot box so they stay on their dots |
| `neural-flow` | `topic/tech/NeuralFlow.astro` | tech | **WebGL** (FLAGSHIP — instanced forward-pass activation wave; shared math `scripts/viz3d/neural.ts`). Lens Phase 6: on the deep plate (the mount re-points `--ink` / `--paper` / `--muted` / `--accent` to the on-deep set and the lime), the fallback cropped to its content, the weight count and the layer names HTML outside the mount; the scene no longer projects labels or a count-up |
| `packet-trace` | `topic/tech/PacketTrace.astro` | tech | **WebGL** globe + HTML latency budget (light floor vs measured RTT; shared math `scripts/viz3d/packet.ts`). Lens Phase 6: on the deep plate, the no-WebGL map cropped to the route with its city names an HTML layer per width tier, the overhead in the on-deep grey (no second hue) |
| `queue-cliff` | `topic/tech/QueueCliff.astro` | tech | SVG interactive (M/M/1 utilization cliff, 1/(1−ρ)); Lens Phase 6: 460-unit panel drawing, the build scene on the plot only (the slider is outside it), the start point snapped as the island snaps |
| `chip-die` | `topic/tech/ChipDie.astro` | tech | HTML treemap (die floorplan, area ∝ real mm²); Lens Phase 6: flat (the tilt, the lift and the hover readout island retired), compute in the mark, the other groups in neutral inks |
| `moore-ladder` | `topic/tech/MooreLadder.astro` | tech | SVG (base-2 log doubling fit); Lens Phase 6: 460-unit panel drawing, the computed doubling time at 96 |
| `elevation-trek` | `topic/travel/ElevationTrek.astro` | travel | SVG, 460 units (Lens Phase 6): the peak at 96, a height axis, names placed clear of the line or moved to a right-hand column with a leader. Anchors `1…n`, `line`, `peak`, `axis` |
| `climate-calendar` | `topic/travel/ClimateCalendar.astro` | travel | HTML ribbon (Lens Phase 6): the wettest month at 96, a tinted temperature row and hanging rain bars, 440px min on a phone. Anchors `1…12`, `temp`, `rain`, `peak`, `legend` |
| `timezone-arc` | `topic/travel/TimezoneArc.astro` | travel | SVG, 460 units (Lens Phase 6): the reference zone pinned at 12:00, the sun's curve over a paper day and a deep-plate night, labels by a collision pass. Anchors `band`, `arc`, `ref`, `1…n` |
| `terminator-globe` | `topic/travel/TerminatorGlobe.astro` | travel | **WebGL** (FLAGSHIP — day/night line + flight arc; shared math `scripts/viz3d/terminator.ts`). Lens Phase 6: on the desk's deep plate, the hours aloft at 96, an HTML label layer; anchors `line`, `night`, `arc`, `from`, `to`, `hours` on the fallback, never the canvas |
| `city-grid` | `topic/travel/CityGrid.astro` | travel | SVG (street-orientation polar histograms), each rose a fixed 200px in a wrapping card (Lens Phase 6). Anchors `1…n`, `rose`, `phi`, `norm` — **hard-throws outside 1–3 cities, see below** |
| `altitude-oxygen` | `topic/travel/AltitudeOxygen.astro` | travel | SVG, 460 units (Lens Phase 6): the air as a symmetric column narrowing with height, stop rules with leaders to a label column, tents for nights. Anchors `column`, `1…n`, `nights`, `peak`, `axis` |
| `season-wheel` | `topic/travel/SeasonWheel.astro` | travel | SVG rings with an HTML label layer (Lens Phase 6; the tilt and the month scrubber are gone, the cues light a month). Anchors `1…12`, `best`, `climate`, `crowd`, `price` |
| `fare-terrain` | `topic/travel/FareTerrain.astro` | travel | SVG, 460 units (Lens Phase 6): the low fare at 96 and the last one at 48, the focal route over a tinted ground, other routes as ink lines, the sweet spot shaded. Anchors `band`, `low`, `last`, `1…n`, `axis` |
| `tactics-pitch` | `topic/sports/TacticsPitch.astro` | sports | SVG pitch in drawn perspective + an HTML disc layer (Lens Phase 6: the CSS-3D recline and tilt retired; the block shape is the outfield hull) |
| `shot-map` | `topic/sports/ShotMap.astro` | sports | SVG with no text + an HTML label layer (Lens Phase 6, per its board: a block is the circle with the drawn cross, a miss is dashed; the goals at 96). `illustrative: true` (schematic marks standing for a total the caption states) drops the computed headline and the computed xG and keeps the marks and the outcome legend |
| `xg-race` | `topic/sports/XgRace.astro` | sports | SVG, 452 units — its own `.px-viz` root since Lens Phase 6 (the build scene sits on `.px-xgr__plot`, not the card, because the html.js-gated scrub changes the card's height); minute scrub (`<input type=range>`, ships hidden, island unhides once the payload parses; per-minute tables precomputed at build) |
| `momentum-wave` | `topic/sports/MomentumWave.astro` | sports | SVG, 452 units (Lens Phase 6: event labels in collision-free rows, the home share on top at 48) |
| `player-card` | `topic/sports/PlayerCard.astro` | sports | HTML profile card (Lens Phase 6, the named redraw: one face, the rating at 96, the attributes as bars; the CSS-3D flip retired) |
| `flight-of-the-ball` | `topic/sports/FlightOfTheBall.astro` | sports | **WebGL** (FLAGSHIP — drag + Magnus trajectory; shared math `scripts/viz3d/ballistics.ts`) |
| `elo-river` | `topic/sports/EloRiver.astro` | sports | SVG, 552 units: one line per team on a shared rating axis, the subject heavy in the mark, its overtakes ringed (Lens Phase 6, per its board: the streamgraph braid retired) |
| `court-value` | `topic/sports/CourtValue.astro` | sports | SVG with no text (value surface over a pitch/court) + an HTML label layer and ramp legend (Lens Phase 6) |
| `pace-ridge` | `topic/sports/PaceRidge.astro` | sports | SVG, 452 units (ridgeline of a stat's distribution per group; labels in a left gutter, the subject-to-field gap bracketed) |

The **ten** WebGL kinds since the Lens verdict (`chamber`, `solar-system`,
`constellation-swarm`, `terrain-relief`, `plate-motion`, `storm-track`,
`neural-flow`, `packet-trace`, `terminator-globe`, `flight-of-the-ball`;
the four generic globes were dropped on 2026-09-30) are the only section kinds that load
Three.js, and only when scrolled into view — see §10. They are exactly the keys
of the registry in `src/scripts/viz3d/scenes/index.ts`; that file is the
check. Per-kind `data` shapes are documented for issue authors in
`src/content/issues/_AGENTS.md`; the six `2026-06-03-<world>-showcase` draft
issues are the canonical worked examples and now carry a worked section for
every breadth kind in their world.

#### Dispatch / authoring exceptions worth memorising

- **`coalition-calculus` dispatches with a SPREAD.** Every other kind receives
  named props read off `section.data`; this one reads **flat props** and is
  wired as `<CoalitionCalculus {...data} />` in `SectionBody.astro`. Copying a
  neighbouring dispatch line for it will silently render an empty component.
- **Several breadth components hard-throw at build time on malformed data** —
  a deliberate loud-failure choice, not a bug. Verified guards: `city-grid`
  requires **1–3 cities** and **exactly 36 bins** per city; `season-wheel`
  requires **exactly 12 months**; `altitude-oxygen` requires **2–8 stops**;
  `fare-terrain` requires **1–5 routes** with **≥6 points each**;
  `carbon-loop`, `chip-die`, `moore-ladder`, `gerrymander-lens` and
  `packet-trace` also validate and throw. `power-flow`'s conservation check
  is the same pattern (§ change log 2026-07-05).
- **`section.plain` and `section.howToRead` FAIL the build** since Lens
  Phase 8 (2026-10-04): a guard in `src/content/config.ts` names the field.
  The form is explained by cues (LENS §5.2), the finding by the caption.

---

### Revamp-wave kinds (2026-08, docs/REVAMP-PLAN.md Phase 3) — 7 so far, 21 to go

These seven were built on `core/VizCard.astro` (the RD-01a shell seam:
caption row and graphic slot; nobody renders the source line but
`core/Section.astro`, in the figure panel; VizCard still accepts `source` but
ignores it). Lens Phase 6 moved `attrition-waffle` and `xg-race` onto roots of
their own. The in-card how-to-read panel, its `NEEDS_HOW` resolution and the
`:has()` one-panel rule are gone (Lens Phase 3 stopped rendering them, Phase 8
deleted them). The instrument kinds
consume the `px-inst` control/readout/legend primitive in `dataviz-v2.css`. Its readout has an **opt-in** `px-inst__readout--sized` modifier: the component renders its worst-case readout string as a `visibility: hidden` `.px-inst__sizer` twin stacked in the same grid cell, so the box reserves its true height (a `min-height: 3.2em` was not enough — `xg-race` reflowed 15px mid-drag, `scaling-plot` jumped 17px on the live page). Used by `scaling-plot`, `xg-race`, `climate-spiral`. **Keep it opt-in** — `StateTimeline` mixes inline children in its readout and the grid stack would break it.
Contract per kind: `docs/design/blueprints/<world>/<kind>.md` — **read its
standing corrections header first**. Registry wiring: `scripts/wire-kind.mjs`.

| kind | component | world | form |
|---|---|---|---|
| `bill-funnel` | `topic/politics/BillFunnel.astro` | politics | HTML funnel bars (widening funnel fails the build) — the HTML-path exemplar |
| `age-pyramid` | `topic/politics/AgePyramid.astro` | politics | HTML mirrored bars, counts ⇄ share-of-band |
| `margin-bullets` | `topic/space/MarginBullets.astro` | space | HTML row cards, each in its own unit (the row picker, readout and table retired in Lens Phase 6) |
| `state-timeline` | `topic/tech/StateTimeline.astro` | tech | HTML health lanes + incident clock (declared fixed encoding, redrawn for the paper in Lens Phase 6: pale green, amber, red; the lag at 96; event markers are squares) |
| `attrition-waffle` | `topic/travel/AttritionWaffle.astro` | travel | HTML 10 × 10 waffle, largest group first, beside the ledger (Lens Phase 6: its own root, no VizCard, no select island). Anchors `1…n` (authored order), `grid` |
| `finish-interval` | `topic/sports/FinishInterval.astro` | sports | HTML projected position + 90% interval; the most ranges covering one position at 48 and a dashed band round them (Lens Phase 6: the row-select island, readout and table retired) |
| `channel-ternary` | `topic/sports/ChannelTernary.astro` | sports | SVG ternary, 292 units so it prints 12px on a phone (sum-to-1 fails the build; the table IS the identity layer; the select island retired in Lens Phase 6) |

## 3. Adding a new section kind — checklist

A new component touches **nine** places (2026-07-05: +catalog; 2026-07-14:
+scene registry for WebGL, +worked showcase example — the two the breadth pass
kept catching; Lens Phase 8, 2026-10-04: the EXPLAIN entry became the cue
anchors and the build).
Miss one and the build either fails, silently renders nothing, or fails
`npm run check:catalog` — which enforces a 1:1, same-order match between
`SECTION_KINDS` and the catalog blocks (87 ↔ 87 today) **plus** KIND_PRIORITY
coverage, a reader for every DATA field, the alias map and (check 7) a
`data-cue` for every id on the block's CUES line. Since 2026-08-27 it runs in `prebuild`, ahead of the
OG writer — so `npm run build` fails on a half-wired kind with a clean tree. Item 8 (the scene registry) applies to WebGL kinds only; the other
eight apply to every kind.

**Before the checklist — the contract every component signs (root `AGENTS.md`
§7, 2026-09-22/23), because the sixteen live issues shipped broken three times
against components that each broke it once:** a text cell wraps or truncates,
never `nowrap` inside a fixed width; an outward SVG label wraps or is budgeted
in characters against the gutter it is drawn into, and never leaves its own
SVG (the outer `<svg>` clips); no control floats over content on touch; no
source line and no caption under a spelling the shell cannot see
(`__cap` / `__caption`; `core/Section.astro` prints the source); copy is
desk-neutral (87 kinds run under six worlds); values size to their cell. The
figure is drawn for the pinned figure panel (about 470px of content at 1280,
293 on a 375 phone; LENS §5.1); on phones it may scroll inside its card (its
own `min-width`, or the block in `dataviz-v2.css`), never overflow the page.
Step 10 below is how you prove all of it.

1. **Add the kind name** to `SECTION_KINDS` in `src/content/config.ts`.
2. **Create the component** at `src/components/<scope>/<Name>.astro` (scope
   = `core/` or `topic/<topic>/`).
3. **Dispatch the kind** in `src/components/SectionBody.astro` (NOT
   SectionRenderer — that's the chrome shell):
   ```astro
   {section.kind === 'new-kind' && <NewComponent ...data props... />}
   ```
4. **Add CSS** in a scoped `<style>` in the component, reading the role
   tokens (`--accent`, `--accent-deep`, `--accent-tint`, `--deep`, the
   neutrals). Never in a theme file: since Lens Phase 8 the six
   `themes/<topic>.css` hold the desk's inks and nothing else.
5. **Declare the cue anchors and the build** in the component: a `Cue
   anchors:` header comment, `data-cue="<id>"` on each element a cue can
   name with its empty `.px-cue-tag` slot, and the `data-build-*` attributes
   (§11). The same ids go on the catalog block's `CUES:` line and the order
   on its `BUILD:` line (check 7 asserts the ids; `scripts/wire-kind.mjs`
   refuses a block without both). There is no EXPLAIN entry any more: the
   file was deleted in Lens Phase 8.
6. **Add the catalog block** in `docs/design/catalog.md` (same order as
   SECTION_KINDS — `npm run check:catalog` fails otherwise).
7. **Document it here** — add a row to §2 and any non-obvious rule. New v2
   kinds also need a blueprint (`docs/design/blueprints/<world>/<kind>.md`).
8. **WebGL kinds only** — register the scene in
   `src/scripts/viz3d/scenes/index.ts` (`'<kind>': { load: () => import('./<scene>') }`).
   Omit this and the mount renders its static fallback forever, silently.
9. **Add a worked section** to that world's `2026-06-03-<world>-showcase`
   issue, so the kind has a live example to look at.
10. **Render it, both widths, and look** (2026-09-23):
    `npm run check:render -- --slug 2026-06-03-<world>-showcase` (and the
    issue that carries it, once one does). Zero blocking findings at 1280 and
    375, then open the section's screenshots under `research/_ui/<date>/` at
    both widths and read them. The commit hook `guard-render.mjs` refuses a
    commit of a component without a fresh clean run (root `AGENTS.md` §8).

For data viz components that emit SVG, follow the SVG conventions in §5.

---

## 4. CSS class prefix isolation (hard rule)

Each component owns a unique `px-<abbrev>` prefix, ≤6 chars. Check
`meta.css` for collisions before choosing — collisions silently corrupt
layout (the wrong rule wins).

**Two documented v2 exceptions to this rule** (see the "v2 data-viz + chrome
class exception" section below for full detail):

- The unified press-header adopts the kit's `.mh*` class names verbatim
  (`core/Masthead.astro`, CSS in `base.css`).
- The ported data-viz adopt the kit's *generic* names —
  `.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel` (plus the
  shell hook `.px-viz__cap`; `.px-viz__how` and `.px-viz__src` are retired,
  and the source line is Section's `.px-rs__src` / `.px-fig__src`). Lens
  Phase 6 moved most of these into their components' scoped styles and Phase
  8 deleted the last dead block (`.cc`). These are intentional adoptions, **not**
  collisions: the kit's animation/reveal CSS is tightly coupled to them.

Known reservations (still-live `px-` prefixes):

| Prefix | Owner | Notes |
|---|---|---|
| `px-viz` | the graphic's root inside the pinned figure panel (`base.css`: radius 0, no shadow, a 1px `--hair` top rule; `--viz-edge` was removed in Lens Phase 8) | wraps every ported chart; VizCard's root is a `data-build-scene` (§11). The ⤢ `.px-vexp` button and `modal.css` were deleted in Lens Phase 3 |
| `px-ns` | `number-sense` | core · `NumberSense.astro` (cues `value`, `note`, equals `1..n`) |
| `px-3s` | `three-steps` | core · `ThreeSteps.astro` (a figure kind since Lens Phase 6: the chain of step cards in the panel, cues `1..n`) |
| `px-yt` | `you-think` | core · `YouThink.astro` (one card cut by a slash, Lens Phase 6; cues `1` belief, `2` record, `3` figure) |
| `px-jb` | `jargon-buster` | core · `JargonBuster.astro` (a figure kind since Lens Phase 6: term cards in the panel, cues `1..n`) |
| `px-fin` | `finish-interval` | sports · `FinishInterval.astro` |
| `px-waf` | `attrition-waffle` | travel · `AttritionWaffle.astro` |
| `px-stl` | `state-timeline` | tech · `StateTimeline.astro` |
| `px-mgb` | `margin-bullets` | space · `MarginBullets.astro` |
| `px-pyr` | `age-pyramid` | politics · `AgePyramid.astro` |
| `px-fnl` | `bill-funnel` | politics · HTML bars · `BillFunnel.astro` |
| `px-trn` | `channel-ternary` | sports · SVG ternary · `ChannelTernary.astro` |
| `px-strip` | TopicStrip (in `meta.css`, `display: flex`) | DO NOT reuse |
| `px-gauge` | `gauge` (`core/Gauge.astro`, all three variants since Lens Phase 6) | `px-cgauge`, `px-swdial`, `px-tdial` retired with the old markup |
| `px-cmp` | `comparison` (`core/Comparison.astro`, Lens Phase 6) | `px-compare` retired; its dead rules left `base.css` and the themes in Phase 8 |
| `px-qt` | `quote` (`core/Quote.astro`, Lens Phase 6) | `px-quote` retired the same way |
| `px-seats` | SeatChart | kept on `px-` |
| `px-bills` | BillBreakdown | kept on `px-` |
| `px-analogy` | BrothersAnalogy | kept on `px-` |
| `px-msl` | MatchStatLine | kept on `px-` |
| `px-primer` | free: Primer was deleted 2026-09-08 and its `base.css` rules in Lens Phase 8 (IssueHead styles its own primer) | |
| `px-prose-full` / `px-skim-caption-block` | skim-mode wrappers (now emitted by `SectionRenderer.astro`) | |
| `px-rs` / `px-fig` | the reading system (`core/Section.astro`; CSS in `layout-v2.css`) | `.px-rs__src` (the article's source line, phones and narrative sections) and `.px-fig__src` (the figure panel's foot) print `Source · …` from `section.source ?? data.source`: the one source emitter in the codebase; components must not add their own. `px-plain` (the "In plain terms" line and its `.px-plain__src`) is free: removed in Lens Phase 8 |
| `px-act` | ActBreak chapter divider (scoped in `core/ActBreak.astro`) | |
| `px-acct` | AccountEntry masthead slot (scoped in `core/AccountEntry.astro`) | Lens 2026-09-30: on an SSR page with `Astro.locals.user` it renders the account pill (initial disc, first name, caret) as a `<details>` menu with "Your shelf" and Sign out; prerendered pages keep the "Sign in" / "Shelf" link and its cookie island |
| `px-hlens` | home hero (scoped in `home/HeroLens.astro`) — carries the ONE sanctioned cursor-parallax (HOME-SPEC §2) | |
| `px-wire` | home wire strip (scoped in `home/WireStrip.astro`) | |
| `px-fplate` | home featured plate (scoped in `home/FeaturedPlate.astro`) | |
| `px-wb` | WelcomeBack post-auth toast (scoped in `core/WelcomeBack.astro`) | mounted in `[slug].astro`; fires on `?welcome=1` |
| `px-nnote` | NewsletterNotice home ribbon (scoped in `core/NewsletterNotice.astro`) | mounted above `<Masthead>` in `index.astro`; fires on `/?newsletter=confirmed` |
| `px-mark` | the Parallax medallion (scoped in `core/Mark.astro`, RD-10 step 2) | inline SVG; `desk` picks the fixed dial station, `size` drives ring 7/10/14 AND the glyph tier, `cut` is mark/seal/reversed (auto-reversed below 24px unless `cut` is passed), `tight` trims the box to the ring, `ring` pins the stroke. `ground` (Lens Phase 2) is the surface colour the offset disc takes, so the crescent is cut from the real ground (the footer's paper-3, a chip's paper-2, a cover's tint); `onDeep` draws the on-deep body for a stage (ground = the desk deep, ring and P = `--on-deep`). The P is an OUTLINE from `src/lib/mark-glyph.ts`, never live text. Mounted by the masthead, the footer, the cover cards, About and the account pages |
| `px-cover` | `core/CoverCard.astro` (Lens Phase 2) | the graphic-dominant issue card: `size` card (3-across, 216px tint panel) / tile (the desk strip, 264px panel) / row (the 120 x 72 thumbnail inside a list row, not a link). One `<a>` on `.px-card` for card and tile |
| `px-cmark` | `core/CoverMark.astro` (Lens Phase 2) | the cover graphic: the section the issue's `cover.section` names when it is one of eleven drawable kinds, else the first such section (`src/lib/cover.ts`, which also returns the one-line `caption` a Home desk card prints under it); falls back to the desk medallion. In-SVG text in the literal Literata stack; the small words hide below a 340px panel (`@container`) so nothing prints under 12px, the marks and 20px+ numbers stay. The `row` thumbnail uses the model's `compact` mode: no words, heavier strokes and dots, a readout as bars or one bar beside the medallion. Never blank at any size |
| `px-stage` | `core/Stage.astro` (Lens Phase 4) | the deep plate, full bleed: the desk's `--deep` edge to edge (a negative margin to the frame edge, a `border-image` outset past it, which paints without horizontal scroll), `<Masthead variant="stage">` across its top, 760 on Home and 720 on a desk page, auto below 1024px. Local tokens `--st-deep`, `--st-mark`, `--st-hi` (the lime on tech and sports), `--st-h`. The slot is the scene. No JS |
| `px-scn` | `stage/StageScene.astro` (Lens Phase 4) | one issue told as a picture on the plate, from `src/lib/stage.ts` (pure): the number at 160 (88 on phones), a spiral clock, an orbit, readout bars or the cover mark on a tint panel, a ladder of at most three rungs, the headline and the paper "Read" button with Replay. Its root is the `data-build-scene` (`data-build-tempo="1.6"` on Home); the desktop and phone drawings are two SVGs, one shown by a media query, so every label prints at 12px or more at 1280 and 375 |
| `px-intro` | `core/IntroOverlay.astro` (Lens Phase 4) | the first-visit intro on Home: three scenes on paper, shown once per browser (`px_intro_v2`), `?intro=1` / `?intro=0`. Ships `hidden`; its is:inline script (under 3 KB) is the show-once, the stepper and the scene-3 cue lighting; each scene is a `data-build-scene` that it asks to build with `px:build` |
| `px-prom` / `px-prom-card` | `core/PromiseStrip.astro` (Lens Phase 4) | "Independent · Sourced · Slow" with their stroke icons: the 56px strip (Home, Subscribe) or three cards (About) |
| `px-dcard` | the Home desk cards (scoped in `src/pages/index.astro`) | medallion 40, register, name, count chip, tagline, the latest issue's cover mark on the desk tint with its caption |
| `px-arch` | `/archive` head, search and desk chips (in `meta.css`) | rows reuse `.px-archive__*`, so home and `/archive` share ONE row implementation; the filter island reveals the controls, which ship `hidden` |
| `pxs-` | story mode (`/s/` — `src/styles/story.css` + `components/story/*`) | Lens 2026-09-30 (the Story boards): `StoryShell` (the desktop head, the horizontal row of 360 x 640 cards snapping on x, the labelled dot stepper whose dots are `#cN` links, prev / next and the arrow keys; phones: one card per screen, vertical snap, each card with its own `.pxs-dots`), `StoryHookCard` (the desk DEEP plate, the medallion in its SEAL cut `onDeep`, the italic word in the desk mark or the lime), `StoryCard` (the beat: header, eyebrow + title, `SectionBody` in `bare` mode, the beat text clipped to 40 words, the source line; `kind: 'prose'` skips `SectionBody` and renders `.pxs-card--text`), `StoryCtaCard` (stats row, "Still in the issue", the desk button, `SaveButton variant="block"`, `StoryShare`'s four 44px icon controls). The beats still come from `src/lib/story.ts`, unchanged |
| `pol-` / `ear-` / `trv-` | free: the light-world motif kits (review R5) never reached a component and left the theme files in Lens Phase 8 | |

Retired prefixes (the v2 data-viz port replaced these with the kit's generic
class above; the old per-component CSS that stayed behind in the theme files
was deleted with everything else in them but the inks, Lens Phase 8):

| Retired prefix | Was | Now emits |
|---|---|---|
| `px-cstrip` | ClimateStrip | `.cs` until Lens Phase 6; the component owns `px-cstrip` again (scoped), the `.cs` rules are deleted |
| `px-ortrace` | OrbitTrace | `.ot` |
| `px-launch` | LaunchStats | `.ls` |
| `px-bench` | BenchmarkChart | `.bc` |
| `px-scurve` | AdoptionCurve | `.adc` |
| `px-route` | RouteCard (now Itinerary) | `.rc`, itself retired in Lens Phase 6: Itinerary emits `px-itin` |
| `px-ccomp` | CityCompare (deleted 2026-09-30; folded into Comparison) | — |
| `px-ltab` | LeagueTable | `.lt`, then `px-lt` (scoped) since Lens Phase 6 |
| `px-radar` | PlayerRadar | `.pr`, then `px-rdr` (scoped) since Lens Phase 6 |
| `px-appr` | ApprovalChart | `.ac` |
| `px-pwm` | PowerMatrix | `.pm` |
| `px-skim` | SkimToggle (component **deleted**) | — (skim toggle now lives in `core/ReadingToolbar.astro`) |

**v2 3D / interactive library prefixes (2026-06-03, extended through
2026-07-14).** Each of the 59 library components (§2 block + §10) owns a
**component-scoped** `px-*` prefix — its cosmetic CSS lives in a scoped
`<style>` inside that component's own `.astro`, not in the theme files. (The
shared 3D mechanics + the WebGL mount keep the `.px3d-*` / `.viz3d*`
namespaces in `components-3d.css`.)

| Prefix | Component | Prefix | Component |
|---|---|---|---|
| ~~`px-co`~~ | CoalitionOrbit (dropped 2026-09-30) | ~~`px-dg`~~ | DataGlobe (dropped 2026-09-30) |
| ~~`px-swdial`~~ | retired (Gauge is `px-gauge`) | `px-core` | CoreSample |
| `px-billp` | BillPassage | `px-sltank` | SeaLevelTank |
| `px-vflow` | VoteFlow | `px-spiral` | ClimateSpiral |
| `px-mladr` | MarginLadder | `px-quake` | QuakeDepth |
| ~~`px-og`~~ | OrbitGlobe (dropped 2026-09-30) | `px-arch` | ArchStack |
| `px-traj` | TrajectoryArc | `px-lwf` | LatencyWaterfall |
| `px-dvl` | DeltaVLadder | `px-vgraph` | VersionGraph |
| ~~`px-sig`~~ | SignalReadout (dropped 2026-09-30) | `px-scale` | ScalingPlot |
| `px-desc` | DescentProfile | ~~`px-tdial`~~ | retired (Gauge is `px-gauge`) |
| ~~`px-rg`~~ | RouteGlobe (dropped 2026-09-30) | `px-pitch` | TacticsPitch |
| `px-etrek` | ElevationTrek | `px-shot` | ShotMap |
| ~~`px-ireel`~~ | ItineraryReel (folded into Itinerary 2026-09-30) | `px-xgr` | XgRace |
| `px-ccal` | ClimateCalendar | `px-mom` | MomentumWave |
| `px-tzarc` | TimezoneArc | `px-pcard` | PlayerCard |
| `px-solsys` | SolarSystem | `px-chmbr` | Chamber |
| `px-pflow` | PowerFlow | | |

**WebGL world flagships** (four more beyond `chamber` / `solar-system`):

| Prefix | Component | Prefix | Component |
|---|---|---|---|
| `px-trrlf` | TerrainRelief (earth) | `px-nflow` | NeuralFlow (tech) |
| `px-tglobe` | TerminatorGlobe (travel) | `px-fball` | FlightOfTheBall (sports) |

**Breadth pass (2026-07-14) — 22 kinds:**

| Prefix | Component | Prefix | Component |
|---|---|---|---|
| `px-coalc` | CoalitionCalculus (politics) | `px-pkt` | PacketTrace (tech) |
| `px-glens` | GerrymanderLens (politics) | `px-qc` | QueueCliff (tech) |
| ~~`px-bflow`~~ | BallotFlow (dropped 2026-09-30) | `px-die` | ChipDie (tech) |
| `px-cswrm` | ConstellationSwarm (space) | `px-mldr` | MooreLadder (tech) |
| `px-lagr` | LagrangeMap (space) | `px-cgrid` | CityGrid (travel) |
| `px-xwin` | TransferWindow (space) | `px-altox` | AltitudeOxygen (travel) |
| `px-eclp` | EclipseCone (space) | `px-swheel` | SeasonWheel (travel) |
| `px-plmot` | PlateMotion (earth) | `px-fterr` | FareTerrain (travel) |
| `px-atmc` | AtmosphereColumn (earth) | `px-eriv` | EloRiver (sports) |
| `px-cloop` | CarbonLoop (earth) | `px-cval` | CourtValue (sports) |
| `px-storm` | StormTrack (earth) | `px-prdg` | PaceRidge (sports) |

Because these are scoped to their `.astro`, they cannot collide with the
global theme/`base.css`/`meta.css` namespaces — but the prefixes are still
unique and reserved here for the record.

Naming convention: `px-<abbrev>`, ≤6 chars, unambiguous. When in doubt,
grep `meta.css` and `base.css` for the candidate prefix before committing.
New narrative section kinds keep using `px-`; the kit class names above are
a closed, one-time v2 exception, not a new pattern to extend.

---

## 5. SVG conventions (established 2026-05-03 across map / chart components)

Any component that emits inline SVG must follow these:

- **Transparent SVG background.** `background: transparent`. Do not wrap
  the SVG in a `<div>` with a `border` or `background: var(--paper)` — the
  SVG sits directly on the page background.
- **Path / topology loading.** Use
  `readFileSync(join(process.cwd(), 'node_modules/...'), 'utf-8')`. Never
  use `import.meta.url` + relative `../` — chunk depth changes between
  dev and build and the relative path breaks.
- **Natural Earth 50m for maps.** `countries-50m.json` (241 geometries).
  Use 110m only for thumbnails.
- **Two-pass country rendering.** Shadow group first (no stroke,
  `filter: drop-shadow(...)`), then fill group with borders. Creates
  raised-land depth without SVG-filter complexity.
- **SVG text fonts.** Use
  `style="font-family:'Literata',Georgia,serif"` (the one face since 2026-10-04) — *not* the
  `font-family="..."` presentation attribute.

  **Corrected 2026-08-27.** This rule used to say "CSS variables do not work in
  SVG presentation attributes". That is **not true** in current Chromium —
  measured directly: against a control with no attribute (inheriting Schibsted
  Grotesk), `font-family="var(--font-mono)"` resolved to JetBrains Mono. The
  rule is still right, for two better reasons: a presentation attribute has the
  **lowest specificity of anything in CSS**, so any stylesheet rule silently
  overrides it; and build-time rasterisers (satori/resvg, which generate the OG
  cards) do no CSS-variable substitution, so a `var()` that works in the browser
  can still come out unstyled there. Use a **literal stack in a `style`
  attribute** and both problems disappear.

  Display labels: Fraunces (the serif voice;
  changed from Cormorant Garamond on 2026-06-21 with the unified type system).
  Coord/axis text: JetBrains Mono.
- **Text halo.** `paint-order="stroke"` plus a `stroke` on the SVG `<text>`
  for readable labels over any fill. Never use a separate shadow element.
- **Legends inside SVG.** Cartographic legend boxes live as SVG `<g>`
  elements in the lower-left corner with `fill-opacity` for transparency.
  Never an HTML `<div>` legend below the SVG.
- **Ocean depth.** `<radialGradient>` (lighter centre, darker rim) plus
  a `<pattern>` water-ruling overlay at 15–22% opacity.
- **`overflow: visible` for label-heavy diagrams.** SVGs where axis
  labels, spoke labels, or annotations must bleed outside the viewBox
  (radar charts, orbit diagrams, adoption-curve milestones) set
  `overflow: visible` on `.px-<component>__svg` and add horizontal
  padding on the wrapper `.px-<component>__wrap { padding: 0 56px }`.
  Do not enlarge the viewBox to compensate — it wastes layout space.
- **Fixed-column label pattern.** Diagrams with many labelled rings at
  varying radii (OrbitTrace) place all labels in a fixed right column at
  `LABEL_COL = W * 0.76` with dashed connector lines from each data
  point. Clamp label Y positions to `[20, H-20]`.

---

## 6. The skim-mode wrapper pattern

Skim mode (toggle now in the Full/Skim segmented control inside
`core/ReadingToolbar.astro`, mode state on `#px-article[data-mode]`) hides
prose and shows a per-section caption. The `#px-article[data-mode]`
mechanism and the CSS below are unchanged from the old SkimToggle era —
only the control that writes the attribute moved into the toolbar.

The wrapper is implemented in `src/pages/issues/[slug].astro` — not in
the components themselves:

```astro
{data.sections.map((section, i) => (
  section.kind === 'prose'
    ? (
      <Fragment>
        <div class="px-prose-full">
          <SectionRenderer section={section} index={i} />
        </div>
        {section.skimCaption && (
          <div class="px-skim-caption-block">
            <p class="px-skim-caption-text">{section.skimCaption}</p>
          </div>
        )}
      </Fragment>
    )
    : <SectionRenderer section={section} index={i} />
))}
```

CSS rules (`base.css`):

```css
#px-article[data-mode="skim"] .px-prose-full { display: none; }
.px-skim-caption-block { display: none; }
#px-article[data-mode="skim"] .px-skim-caption-block { display: block; }
```

Do not duplicate this wrapping into individual components. The site
template handles it once; new section kinds inherit nothing from it
unless they also need a skim equivalent (none do currently — all
non-prose kinds remain visible in skim mode).

---

## 7. Components that *don't* render via SectionRenderer

These render directly in templates, not via the dispatcher:

| Component | Rendered by |
|---|---|
| `core/IssueHead.astro` | inline in `src/pages/issues/[slug].astro` — the meta strip (← desk register · № · date), eyebrow, `.px-h1`, the hook as `.px-lede`, the primer on a 4px accent rule. Replaced `core/Hero.astro`, `core/Banner.astro` and `core/Primer.astro` (all deleted 2026-09-08). `px-ihead`. |
| `core/ReadingToolbar.astro` | inline at the bottom of `[slug].astro` — since 2026-09-08 a PINNED flat strip on the paper with a 2px ink rule on top: progress hairline, `NN% · N min left`, the square Full ⇄ Skim toggle, Save; slides up after the first scroll; sits above the phone home bar (`env(safe-area-inset-bottom)`). JS-only (`html.js`). |
| `core/SaveButton.astro` | **inside `core/ReadingToolbar.astro`**, and (Lens 2026-09-30) on the story CTA card as `variant="block"`, the board's 44px full-width "Save to shelf". Literata 12/600 capitals, a 4px corner, hair-2 border; saved in the desk text colour. Signed-out label is "Save to your shelf" and the signed-out click carries `&world=<data-topic>` into the login URL (world-tinted auth plate); a first-save "On your shelf →" microline flashes once and fades after 4s; the loading pulse is reduced-motion-gated. |
| `core/ReadingTracker.astro` | inline in `[slug].astro`, invisible sentinel |
| `core/ReactionsBar.astro` | inline in `[slug].astro`, after AnnotationLayer |
| `core/LettersBlock.astro` | inline in `[slug].astro`, after ReactionsBar |
| `core/NewsletterForm.astro` | rendered by `core/Colophon.astro` (and by `home/SubscribeStrip.astro` on the home page) — the **single** source every mount embeds (SubscribeStrip / Colophon / Footer / BeatJoin), so a change here covers all of them. POSTs to the app's `/api/join` (repointed from `/api/subscribe` on 2026-07-14) and handles the degraded `{ok:true, account:false}` response. **No-JS-gated:** the form is hidden behind `html:not(.js)` with an "Enable JavaScript to subscribe." line, because a no-JS submit used to do a native GET that put the reader's email in the URL, history and server logs. |
| `core/Masthead.astro` | in `IssueLayout.astro` and on each house page (index, archive, about, subscribe, desks). Lens Phase 2: the lockup (34px tight disc, ring 9, Literata 700 24, the register on a desk page), the nav, the live badge, the account slot as a "Sign in" link, the ink Subscribe; `variant="stage"` + `desk` (+ `register`) is the on-deep version for a stage (Phase 4). Below 768px a `<details>` menu with 44px rows beside a compact Subscribe |
| `core/ReadingGate.astro` | inline in `[slug].astro` — metered soft signup wall. Anonymous readers get primer + first 2 sections, then a per-topic-themed "Create a free account to finish" wall hiding the rest; signed-in (cookie heuristic) ⇒ full issue. No-JS / crawlers ⇒ gate hidden, full article renders (SEO-safe). `px-gate`. |
| `core/WelcomeBack.astro` | inline at the end of `[slug].astro`, after `ReadingToolbar` — top-centre toast (Lens 2026-09-30: paper-2, hair, shadow-2, a 44px close; the glass is gone) fired by `?welcome=1` (the return leg from the app's `/welcome`). Reads sessionStorage `px_resume` (written by `ReadingGate`) and offers "Continue where you left off ↓"; strips the param via `history.replaceState`; 8s auto-dismiss that **pauses on hover/focus** so keyboard/AT users don't lose the resume control. `[hidden]` by default ⇒ no-JS shows nothing. `px-wb`. |
| `core/NewsletterNotice.astro` | inline in `index.astro`, **above `<Masthead>`** — in-flow ribbon fired by `/?newsletter=confirmed`. Occupies no space until revealed, so no-JS / crawlers see nothing. Dismissible; cleans the URL. `px-nnote`. |
| `core/Sources.astro` | inline in `src/pages/issues/[slug].astro`, footer |
| `core/Colophon.astro` | in both layouts. Lens Phase 2: on `--paper-3`, the lockup at 28px (house cut), the promise, the six desks as link chips (20px medallions, the MARK cut), three link columns (Read · Parallax · Account), the colophon line with Privacy and Terms. Same on every page: `desk` is accepted and ignored |
| `src/scripts/build.ts` | every layout (Home, Issue, Story, App), once, as a bundled module `<script>` — the one build island (§11). Replaced `core/Reveal.astro` and `core/VizMotion.astro`, deleted in Lens Phase 5 |
| `core/Viz3DRuntime.astro` | `IssueLayout.astro`, once per issue — bundled module `<script>` that lazy-boots the WebGL runtime (`scripts/viz3d/`) when a `[data-viz3d]` mount scrolls in (§10) |
| `core/Tilt.astro` | `IssueLayout.astro`, once per issue — vanilla island driving the CSS-3D `[data-tilt]` pointer-tilt + `[data-flip-btn]` flip (§10) |
| `home/IssueRows.astro` | home, `/archive`, every desk — the ONE list-row implementation (`variant="home"` or `"desk"`, which drops the dot); emits the `.px-archive__list/__row/__none` hooks the archive filter island reads. Lens Phase 2: desk dot + "No 17", the headline in Literata 700 21, the hook 15 muted, the date and read time, and a `core/CoverCard` size="row" thumbnail on the right; hover is a paper-2 wash and an underlined headline. `px-rows`. |
| `desk/DeskIndex.astro` | rendered by `src/pages/topics/[topic].astro` for all six desks (the six `<Topic>Index` fronts were deleted 2026-09-08). Lens Phase 4: the desk's stage (its masthead included, with the register), its issues as `CoverCard size="tile"` three across, the "New here? Start with No N" path (the three earliest as a dot strip), the other five desks as tiles with their medallion and a row thumbnail. `px-desk__`. |
| `core/Stage.astro` + `stage/StageScene.astro` | Home (`index.astro`, the newest issue with a `cover`) and every desk page (the desk's newest issue). The stage replaces the page's `<Masthead>`: it renders the on-deep one itself |
| `core/IntroOverlay.astro` | `index.astro`, after the page content, with the Home cover issue (scene 3 is built from its readout, timeline and latency-waterfall by `introFigure()` in `src/lib/stage.ts`, or shows its cover mark) |
| `core/PromiseStrip.astro` | Home and `/subscribe` (strip), `/about` (cards) |

---

## 8. Reader-interaction client islands (Phase B)

Six new client islands ship with Phase B. All live in `core/`, all
call `app.parallaxlens.com/api/*` with `credentials: 'include'`. All
fail silently — analytics and engagement must never break the reading
experience.

### CSS class prefix reservations (additions)

| Prefix | Owner |
|---|---|
| `px-save` | SaveButton |
| `px-reactions` | ReactionsBar |
| `px-reading-tracker` | ReadingTracker (invisible — no visible CSS) |
| `px-annot` | AnnotationLayer |
| `px-newsletter` | NewsletterForm |
| `px-letter` | LettersBlock (end-of-issue reader letters, Phase B-6) |
| `px-mstrip` | ManifestoStrip (home, three editorial promises — v2 `.mf-strip` port) |
| `px-sub` | SubscribeStrip (home, editorial `.sub` framing wrapping NewsletterForm) |
| `px-col` | Colophon (the footer; Lens Phase 2 rebuilt it to the Home board's, with the desk chips) |
| `px-gate` | ReadingGate (metered signup wall, scoped in `ReadingGate.astro`) |
| `px-wb` | WelcomeBack (post-auth return toast on issues, scoped in `WelcomeBack.astro`) |
| `px-nnote` | NewsletterNotice (home `?newsletter=confirmed` ribbon, scoped in `NewsletterNotice.astro`) |
| `px-wj` / `px-abt` | now mainly serve AccountLine + About (the rest of the earlier welcome pass is retired) |

### The funnel islands (2026-07-14)

`WelcomeBack` and `NewsletterNotice` are the two loop-closing islands added by
the P6.3 funnel pass. They follow the same `is:inline` +
`previousElementSibling` pattern as the Phase-B islands, with three additions
worth copying when you write the next one:

- **Post-action, never content.** Both ship `hidden` and only reveal on a
  query param. No JS / crawlers ⇒ nothing renders and nothing shifts —
  `NewsletterNotice` sits above the masthead but occupies no space until shown.
- **They clean up after themselves.** Each strips its own query param with
  `history.replaceState` so a refresh or a shared link doesn't re-fire it.
- **Auto-dismiss must not eat a control.** `WelcomeBack`'s 8s timer **pauses
  on hover and focus**, because the toast carries the "Continue where you left
  off ↓" resume link — a keyboard or screen-reader user would otherwise lose it
  mid-reach. At ≤460px the toast uses a **definite** `width: calc(100vw - 24px)`
  plus flex-wrap (shrink-wrapping made it 168px tall; the definite width gives
  a ~73px two-row toast).

The rest of the funnel — `core/AccountEntry.astro` (masthead "Sign in" ↔
"Shelf" swap; `/api/me` is a **confirmer only, never a gatekeeper**) and
`core/ReadingGate.astro` (benefit rows, `&world=` on the CTA, the
sessionStorage `px_resume` scroll save) — already existed and was verified,
not rebuilt.

### Client island pattern

All use `is:inline` script that walks `previousElementSibling` to
find the root element by class name (not by ID — avoids ID collisions
when multiple islands are on the same page). They read `data-*`
attributes from the root element for config (issueId, appUrl) rather
than using Astro's `define:vars` — this keeps the script out of the
build-time bundle and avoids hydration issues.

The pattern from `SaveButton.astro`:

```astro
<div class="px-save" data-issue-id={issueId} data-app-url={appUrl}>
  <!-- markup -->
</div>

<script is:inline>
  (function () {
    var root = document.currentScript.previousElementSibling;
    while (root && !(root.classList && root.classList.contains('px-save'))) {
      root = root.previousElementSibling;
    }
    if (!root) return;
    var issueId = root.dataset.issueId;
    var appUrl = root.dataset.appUrl;
    // ...
  })();
</script>
```

### Unauthenticated reader flow

All islands that require auth handle the anonymous case the same way:
pass the full current URL (`window.location.href`) as the `next`
parameter, redirect to `appUrl + '/login?next=...'`. The
`safeNextPath` function on the app side allows-lists
`parallaxlens.com` as a redirect target so the reader returns to the
same issue after sign-in.

### `AnnotationLayer.astro` — the complex island

Selection capture uses:
- `document.addEventListener('mouseup')` deferred 10ms so selection settles
- `window.getSelection().getRangeAt(0)` + containment check
  (`article.contains(range.startContainer)`)
- Anchor JSON built as W3C TextQuoteSelector subset:
  `{ exact, before: lastN chars, after: firstN chars, section_index? }`
- Popover positioned via `getBoundingClientRect()` + `scrollY`
- Editor is a fixed modal with backdrop; `Escape` key closes both popover and editor

The finish sentinel for `ReadingTracker` is a
`<span id="px-finish-sentinel">` placed **inside the article element**
just before the closing `</article>` tag. `AnnotationLayer.astro` and
`ReactionsBar.astro` render **outside** the article, after it.

**Removed (2026-09-30).** The onboarding intro ("The Second Angle") is gone
by the operator's ruling: `intro/` (`IntroStory`, `IntroExperience`,
`WorldViz`), `src/pages/welcome.astro`, `src/layouts/IntroLayout.astro` and
`src/styles/intro.css` were deleted, and the home page no longer mounts the
first-visit overlay. The new design will bring a new intro. The earlier
`welcome/` onboarding pass it had superseded is gone from the tree too, and
there is no `welcome.css` any more.

When adding a meta-brand or layout-chrome piece, render it directly. Only
narrative section components flow through `SectionRenderer.astro`.

---

## 9. v2 data-viz + chrome class exception (2026-06-03)

The v2 design-match pass adopted the external kit's own class names in two
places, verbatim. This is a deliberate, closed exception to the `px-` prefix
rule (§4) — the kit's animation/reveal CSS is tightly coupled to these
selectors, so renaming them would mean rewriting the whole animation layer.

**Adopted names**

- **Masthead:** `.mh*` (`core/Masthead.astro`; CSS in `base.css`). One
  unified press-header on every page — lens-dot mark + pulse status pill +
  nav (Desks/About/Feed) + Subscribe CTA. The active world still comes from
  `data-topic` on `<html>`. The six old `.px-masthead--<topic>` variants are
  gone; their per-world microcopy now reads in `core/Banner.astro`.
- **Data-viz:** the generic kit names
  `.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`, plus the
  shared shell hook `.px-viz__cap` (caption). `.px-viz__how` (the how-to-read
  panel) and `.px-viz__src` are **retired**, zero emitters and zero rules. All CSS lives in the new `src/styles/dataviz-v2.css`, imported
  **last** in both `IssueLayout.astro` and `HomeLayout.astro`.

**Components fully ported** (rewritten to the kit's markup + animations —
stroke-draw lines, grow bars, scale-pop polygon, count-up tiles, the
44-column MP-dot vote chamber, scan sweep — and wrapped in the shared
flat `.px-viz` card — radius 0, no shadow; the 3px `--viz-edge` top rule of 2026-09-04 became a 1px hair under Lens and its variable left in Phase 8):

| Component | Kit class |
|---|---|
| VoteResult | `.vb` |
| ApprovalChart | `.ac` |
| PowerMatrix | `.pm` |
| Paradox | `.px2` |
| Timeline | `.tl` |
| OrbitTrace | `.ot` |
| LaunchStats | `.ls` |
| DataReadout | `.tel` |
| ClimateStrip | `.cs` (retired Lens Phase 6: `px-cstrip`, scoped) |
| BenchmarkChart | `.bc` |
| AdoptionCurve | `.adc` |
| RouteCard (now Itinerary) | `.rc` (retired in Lens Phase 6; `px-itin`, scoped) |
| CityCompare (deleted 2026-09-30) | `.cc` |
| LeagueTable | `.lt` |
| PlayerRadar | `.pr` |

Charts wrap in the shared `.px-viz` card; the vote bar (`.vb`), timeline
(`.tl`), and telemetry (`.tel`) are standalone roots. Since Lens Phase 5 the
cards that build are `data-build-scene` roots (§11).

**Components kept on their `px-` classes** (light-touch port; the card-level
scroll-in they gained was retired in Lens Phase 5): SeatChart (`.px-seats`), BillBreakdown
(`.px-bills`), BrothersAnalogy (`.px-analogy`), CarbonGauge (now Gauge's
budget variant, `.px-cgauge`), RegionMap (free-standing cartographic SVG),
CommitGrid, JourneyMap, MatchStatLine (`.px-msl`).

**The motion contract (no-JS / print safe)** is the build of §11 since Lens
Phase 5. The reveal contract that stood here (`core/Reveal.astro` adding
`.is-in` to `[data-reveal]`, every hidden state behind `html.js`, a
reduced-motion reset per kind, and `core/VizMotion.astro`'s `[data-countup]`
and `[data-warmth]`) was RETIRED, files, attributes and CSS together: every
component now paints its final state as written, and moves only through the
attributes of §11.

**The dead-CSS follow-up is done (Lens Phase 8, 2026-10-04).** The old
per-component viz CSS in the theme files (`.px-vote*`, `.px-appr*`,
`.px-pwm*`, `.px-paradox*`, `.px-timeline*`, the orbit / launch / climate /
bench / scurve / route / citycompare / ltab / radar blocks) went with
everything in those files but the inks, and the `.px-skim-toggle` /
`.px-skim-btn`, `.px-quote*`, `.px-compare*`, `.px-readout*`, `.px-primer*`,
the old home list (`.px-home__issue*`, `__title`, `__tagline`) and `.px-section__num` rules left `base.css`. Each class was
grepped for an emitter first.

---

## 10. 3D / interactive component library (2026-06-03, current at 2026-07-14)

The 59 v2 interactive kinds (§2 block) split into implementation families.
All honour one shared no-JS / `prefers-reduced-motion` contract: **every
component renders a static SVG/HTML fallback by default, and interactivity is
layered on top only when JS runs and motion is allowed.** This is the same
contract as the build island (§11) and the v2 data-viz (§9).

### Family A — lazy WebGL scenes (Three.js): 10 kinds

`chamber`, `solar-system`, `constellation-swarm`, `terrain-relief`,
`plate-motion`, `storm-track`, `neural-flow`, `packet-trace`,
`terminator-globe`, `flight-of-the-ball`. (The Lens verdict of 2026-09-30
dropped `coalition-orbit`, `orbit-globe`, `data-globe` and `route-globe`,
scenes and all; `scenes/globe.ts` stays as the shared globe helpers.) These are the **only** parts of the
whole site that touch Three.js, and they are exactly the keys of the registry
in `src/scripts/viz3d/scenes/index.ts`.

- **Self-hosted Three.js.** `three` is an npm dependency (`npm i three`), not
  a CDN script. It is **dynamic-imported** (`import('three')`) inside
  `src/scripts/viz3d/runtime.ts`, so Vite **code-splits it into its own
  chunk** (~730 KB raw, ≈170 KB gzipped). That chunk is fetched **only when a
  `[data-viz3d]` mount first scrolls into view** — never on the home page or
  any issue without a 3D section. The per-page hoisted runtime script is
  ~5 KB.
- **Runtime + a per-scene lazy registry.** `runtime.ts` owns the lifecycle
  (IntersectionObserver to lazy-boot, DPR capped at ≤2, a render loop that
  **pauses when the mount leaves the viewport** and **disposes on `pagehide`**,
  plus the no-WebGL / reduced-motion bail, plus the `setState` chip bridge).
  `scenes/index.ts` exports the `builders` registry keyed by the kind's
  `data-viz3d` type, one `{ load: () => import('./<scene>') }` line per scene
  so **each scene is its own chunk**. Each builder is
  `(THREE, canvas, data, colors) => SceneHandle` and **takes `THREE` as a
  parameter** (it must never `import 'three'` itself, or three would leak into
  the eager bundle). Scene aesthetic is dot-matrix / wireframe / low-poly in
  the world's theme colours (read from CSS custom properties), to match the
  type-led, no-photo v2 look.
- **Pure-math sidecars.** Heavier scenes keep their physics in a
  three-free module beside the runtime, so the **same numbers** drive the
  WebGL scene *and* the component's build-time fallback SVG:
  `kepler.ts` (solar-system), `hemicycle.ts` (chamber), `terrain.ts`
  (terrain-relief), `neural.ts` (neural-flow), `terminator.ts`
  (terminator-globe), `ballistics.ts` (flight-of-the-ball), and `packet.ts`
  (packet-trace — exports `budget` / `layoutBar` / `cities` / `meanHopLon` /
  `Hop`, consumed by both `PacketTrace.astro` and `scenes/packetTrace.ts`).
  Shared globe drawing lives in `scenes/globe.ts` (`dragController`, `latLon`,
  `loadGeo`, `buildCountryGlobe`, `makeLabels`). `plate-motion` also reads a
  checked-in data file, `public/geo/plates.json`.
- **Globe seed-yaw convention — get this backwards and the scene opens on the
  limb.** `globe.ts`'s basis is `th = (lon + 180)` with the camera on `+z`, so
  to face longitude `cLon` set
  `drag.s.yaw = -((cLon + 90) * Math.PI) / 180`. A stray `+180` there is the
  classic bug: the globe boots showing the edge, not the subject.
- **Mounted once per issue** via `core/Viz3DRuntime.astro` — a **bundled
  module `<script>`** (not `is:inline`, so Vite can process the dynamic
  import). `IssueLayout.astro` renders it once; if a page has no `[data-viz3d]`
  mounts, `initViz3D()` returns immediately and three is never fetched.
- **Mount markup.** Each WebGL component renders a `.viz3d` element with
  `data-viz3d="<kind>"`, a `<script class="viz3d__data" type="application/json">`
  carrying the section's data payload, and a `.viz3d__fallback` holding the
  static SVG. On successful boot the runtime appends a `.viz3d__canvas`, adds
  `.viz3d--live` to the mount (CSS then hides the fallback), and runs the loop.
  No JS / no WebGL / reduced-motion ⇒ no canvas, no loop, the fallback stays.

### Family B — CSS-3D

Perspective + `transform-3d` via the shared mechanics in
`src/styles/components-3d.css`:

- `.px3d-stage` establishes `perspective`; `.px3d-tilt` reads `--rx` / `--ry`
  (default `0`) for a pointer-tilt; `.px3d-flip` / `.px3d-flip.is-flipped`
  rotates a card face (e.g. `player-card`).
- Driven by the vanilla `core/Tilt.astro` island: `[data-tilt="<deg>"]`
  writes clamped `--rx` / `--ry` on `pointermove` (reset on `pointerleave`)
  and is **skipped entirely under `prefers-reduced-motion`**; `[data-flip-btn]`
  toggles `.is-flipped` on the `.px3d-flip` inside its nearest
  `[data-flip-card]` and manages `aria-pressed`. Rendered **once per issue**
  in `IssueLayout.astro` (alongside `Viz3DRuntime`).
- No JS ⇒ nothing runs: cards stay flat and front-facing (the vars default to
  `0`). Reduced-motion resets `.px3d-tilt` / `.px3d-flip` to no transform in
  `components-3d.css`.

Kinds: `gauge` (its lean and capacity variants), `core-sample`, `arch-stack`, `chip-die`, `player-card`,
plus the SVG/CSS-3D hybrids (`trajectory-arc`, `delta-v-ladder`,
`eclipse-cone`, `sea-level-tank`, `elevation-trek`, `timezone-arc`,
`tactics-pitch`, `shot-map`).

### Family C — animated SVG / canvas: the largest family

Line draws, bars, dials, contour fields and area fills — the default for the
breadth pass, which was SVG-first (`lagrange-map`,
`atmosphere-column`, `carbon-loop`, `moore-ladder`, `city-grid`,
`altitude-oxygen`, `season-wheel`, `fare-terrain`, `elo-river`, `court-value`,
`pace-ridge`, `gerrymander-lens`, alongside the older
`latency-waterfall`, `climate-spiral`, `momentum-wave`, `xg-race`). Their
scroll-in reveals were retired in Lens Phase 5: each paints its final state
until its Phase 6 wave declares a build (§11).

### Family D — HTML-interactive (new 2026-07-14)

Build-time HTML paints the *answer* in full; one tiny vanilla `is:inline`
island unhides a control and re-scores. `coalition-calculus` is the reference
implementation: the beam, majority line and verdict are static HTML in the
preset state, the chip set ships `hidden`, and the ledger `<details>` ships
`open` — the island unhides the chips and folds the ledger on boot. No-JS /
crawlers therefore get the composed still **and** the full ledger. The
scrubber-style SVG interactives (`transfer-window`, `queue-cliff`) work the
same way. When you add one: **the no-JS state must be the finished answer,
not an empty shell waiting for a click.**

### Mobile chart legibility — measured, and closed for the showcased kinds

The 2026-07-14 responsive pass fixed the one reproducible 375px overflow —
data tables. In `dataviz-v2.css` (tail, `@media (max-width: 640px)`), `.lt`
and `[class$="__table"]` become `display: block; overflow-x: auto` so rows
scroll **within** their card; desktop is untouched (still `display: table`
above 640px). Safety nets: `.px-viz { max-width: 100% }`,
`.px-viz > * { min-width: 0 }`. (`.px-ireel { overflow-x: clip }` was
retired 2026-09-24: it only ever hid a negative margin's bleed and cut the
second card's text on phones.)

**The 2026-09-07 rule** for the scaling charts: each SVG drawn for the 720
measure gets a `min-width` equal to its coordinate width and the CARD scrolls
sideways at ≤ 900px, so every label lands at the size it was drawn at
(`dataviz-v2.css`, the `min-width` block — read it before touching it).
**The 2026-09-24 rule** for the kinds that cannot scroll — the WebGL mounts
pin an aspect ratio, and a globe scrolled sideways hides its subject —
is two label sets: the authored sizes for desktop and a phone set sized to
print at ≥ 9.5px on a 335px plate, one or the other shown by a media query
(`StormTrack`, `ConstellationSwarm`, `PlateMotion`, `TerrainRelief`,
`TerminatorGlobe`'s HTML labels; since Lens Phase 6 `NeuralFlow` draws no
text in its SVG at all and `PacketTrace` sets its city names as an HTML
layer placed per width tier). Either way
the floor was **9.5px rendered**. Lens raises it to 12px (LENS §3.4):
`check:render` reports TINY (a warning) below 12px and FLOOR (blocking)
below 9.5px since Phase 5.
The showcase sweep of 2026-09-24 brought every kind on the six showcases to
zero findings at 375; a new kind picks one of the two rules in its first
commit.

### CSS ownership

- **Shared** (in `components-3d.css`): the `.px3d-*` 3D mechanics and the
  `.viz3d` / `.viz3d__canvas` / `.viz3d__fallback` / `.viz3d--live` /
  `.viz3d__data` mount machinery.
- **Per-component cosmetic CSS** is a **scoped `<style>` inside each
  component's `.astro`** under a unique `px-*` prefix (§4 table) — it does not
  live in the theme files.

### Worked examples

The six `src/content/issues/2026-06-03-<world>-showcase/index.mdx` draft
issues each exercise that world's library kinds end-to-end — every breadth
kind added on 2026-07-14 has a worked section appended to its world's
showcase. They are `status: draft` — URL-viewable at
`/issues/2026-06-03-<world>-showcase/` but unlisted (excluded from the archive
+ RSS), and therefore **they have no `/s/` story page** (story mode builds only
for `status !== 'draft'`). Data shapes for every kind are in
`src/content/issues/_AGENTS.md`.

---

## 11. The build contract (Lens Phase 5, 2026-09-30)

**A component never animates itself.** It declares a build in its markup and
the one island, `src/scripts/build.ts`, runs it (the law: `docs/design/LENS.md`
§6.4; the classes: `src/styles/motion-v2.css`). The static HTML is the FINAL
state: no JS, reduced motion, print and the render gate all see it, because
the start state is applied by the island, never in the markup. So never write
a hidden state in CSS, `html.js`-gated or not, for anything that builds.

| Attribute | Put it on | Means |
|---|---|---|
| `data-build-scene` | the component's root (or the graphic, see below) | a scene; optional `data-build-delay="ms"`, `data-build-tempo="1.6"` |
| `data-build="n"` | each element that builds | its step, an integer from 1; shared n staggers 80ms in document order |
| `data-build-kind` | the same element | `counter` · `draw` · `grow-x` · `grow-y` · `drop` · `rise` · `fade` (default) |
| `data-to` (+ `data-format="1dp"`) | a counter | the value it counts to; its text must hold ONE number |
| `data-build-replay` | a `<button hidden>` in the scene | shown and wired by the island |

**Order a build as axis, then marks, then labels, then the figure's headline
number,** inside 4.5s. The island moves `opacity`, the individual
`translate` and `scale` properties and `stroke-dashoffset`; it never
touches `transform`, so an SVG group's placement or a label's centring
survives. A `grow` needs a `transform-origin` in your CSS (a bar: its left
edge; a column: its floor; those are also the defaults). A `draw` goes on
the SVG geometry element itself with a solid stroke. A counter's number sits
in its own span when the element holds anything else (a cue tag, a unit).
Numerals grouped the Indian way are not counters (the tween is en-US).
VizCard's root is already a scene, so a VizCard kind only puts `data-build`
on its parts. Nested scenes each run their own elements.

**Two things break the gate.** `check:render`'s BUILD check compares every
scene after its build (JS and motion on) with the page with JavaScript off:
each build element's text, box (within 1px) and opacity. So (1) nothing may
end anywhere the static page does not show it, and (2) a scene must not hold
an `html.js`-gated control that moves its build elements (put the scene on
the graphic, not the card). And an element that is a cue anchor
(`data-cue`) may also build: the start state outranks the lighting, and
section 1's cues wait for its build (`px:built`).

**Wired in Phase 5:** the nine cue-wired kinds (`data-readout` tiles drop,
then count; `you-think` belief, record, figure; `timeline` rows;
`benchmark-chart` axis, bars, values, notes; `latency-waterfall` axis, bars,
durations; `margin-ladder` names, bars, margins; `power-matrix` axes, rows of
cells, legend; `jargon-buster` terms; `comparison` heads, rows) plus the
old count-ups (`vote-result`'s numbers, `transfer-window`'s days,
`gauge`'s capacity value). Every other kind is static until its Phase 6
wave gives it a build order. `coalition-calculus` lost its count-up for good:
its own island rewrites the verdict number.

---

## Change log

### 2026-10-04 — Lens Phase 8, the switch

`src/lib/explainers.ts` is deleted; `core/VizCard.astro` and the eleven
components that forwarded it (`NumberSense`, `MarginBullets`, `ClimateSpiral`,
`BillFunnel`, `AgePyramid`, `AttritionWaffle`, `ChannelTernary`,
`FinishInterval`, `StateTimeline`, `XgRace`, `ScalingPlot`) lost the
`howToRead` prop. The schema fails the build on `plain` / `howToRead`. The six
theme files hold the desk's inks only, so **a component's CSS lives in its
own scoped `<style>`, never in a theme**; §3 step 4 and step 5 say so (step 5
is the cue anchors and the build now, not an EXPLAIN entry), and
`scripts/wire-kind.mjs` refuses a catalog block without CUES and BUILD lines.
`.px-viz` reads `--hair` (no `--viz-edge`). Free prefixes: `px-plain`,
`px-primer`, `px-compare`, `px-quote`, `px-readout`, `px-floor`, `pol-`,
`ear-`, `trv-`, `.cc`.

### 2026-09-30 — Lens Phase 6, the politics wave

Seventeen kinds redrawn to their `Lib-<kind>` boards and wired to the cue and
build contracts: `timeline`, `bill-breakdown`, `vote-result`, `seat-chart`,
`paradox`, `analogy`, `approval-chart`, `power-matrix`, `bill-passage`,
`vote-flow`, `margin-ladder`, `chamber`, `power-flow`, `coalition-calculus`,
`gerrymander-lens`, `bill-funnel`, `age-pyramid`. Each component header
carries its `Cue anchors:` block (numbers from 1 in DATA order for lists;
short names for fixed parts: `top` for a headline number, `line` for a
threshold, `legend`, `for` / `against`, `north` / `south`, a party or node
`id`) and its build order. Every kind's CSS lives in its own scoped
`<style>` now: the `.vb`, `.ac`, `.pm`, `.px2` and `.tl` blocks left
`dataviz-v2.css`, and the dead per-kind rules (`.px-timeline`, `.px-bills`,
`.px-vote`, `.px-seats`, `.px-paradox`, `.px-analogy`, `.px-beats`,
`.px-appr`, `.px-pwm`) left `themes/politics.css`. `approval-chart`,
`vote-flow` and `power-flow` are drawn on a 440-unit viewBox with every word
in an HTML layer over the SVG, so the numerals print where Section puts them;
they left the `min-width` lists in `dataviz-v2.css` and scroll inside their
own root below 1024px. Three patterns worth copying: (1) a headline number
the component can DERIVE honestly (the stages cleared, the largest band, the
widest margin), never one it would have to guess; (2) where a kind has a
control or disclosure that changes its height under JS (`coalition-calculus`
chips, the `gerrymander-lens` ledger, the `bill-funnel` notes), the build
scene is the graphic, not the card, so the render gate's BUILD check never
sees JS move a built element; (3) a WebGL kind (`chamber`) builds only what
stays visible once the canvas takes over (its legend); its fallback sits on
the deep plate, the mount re-pointing `--ink` / `--paper` / `--rule` /
`--muted` to the on-deep set, which the scene reads. Removed:
`margin-ladder`'s tilt and hover lift, `bill-passage`'s 3D track,
`power-flow`'s static dash stipple, the `age-pyramid` Counts / Share chips
(the share is a column now), the `timeline` node's hover scale.
`power-flow` estimates every label's height from its words, spaces each
outer column's labels by those heights and grows the drawing when they need
more than 290 units; its link notes are a list under the drawing, not text
on the ribbons (the ribbon notes printed over node names on the squad-cost
and Indonesia issues, 2026-10-01).

### 2026-09-30 — Lens Phase 6, the sports wave

All fourteen sports kinds carry cue anchors (a `Cue anchors:` block heads
each component), a build order through `build.ts`, and the panel drawing:
`match-stat-line`, `league-table`, `player-radar`, `tactics-pitch`,
`shot-map`, `xg-race`, `momentum-wave`, `player-card`, `flight-of-the-ball`,
`elo-river`, `court-value`, `pace-ridge`, `channel-ternary`,
`finish-interval`. Three rules came out of it. **An SVG anchor's numeral**
goes in a 22px `<foreignObject>` holding the usual `.px-cue-tag` slot (the
only markup `core/Section.astro` fills), inside the anchor's `<g>`.
**A pitch or a surface that must not scroll** carries no SVG text: its words
and numerals are an HTML layer placed by percent and sized in pixels
(`tactics-pitch`, `shot-map`, `court-value`, the flight still), so it scales
to a 293px phone body at 12px; the wide charts keep their 452-unit viewBox
(552 for `elo-river`) and scroll inside the card on phones (the sports block
in `dataviz-v2.css`). **A kind with an html.js-gated control** puts its
`data-build-scene` on the graphic, not the card (`xg-race`), and a WebGL kind
puts its build on HTML outside the mount (`flight-of-the-ball`'s launch row),
because a live scene hides the fallback. Redrawn to their boards:
`player-card` (the profile card), `elo-river` (lines, not a braid),
`tactics-pitch` (drawn perspective, no CSS-3D), `flight-of-the-ball` (the
still from behind the ball on the deep plate; the mount sets the scene's
colour variables to the plate's). The CSS of `match-stat-line` left
`themes/sports.css` for its component, and the dead `.px-ltab` / `.px-radar`
blocks there went with it; `.lt` / `.pr` left `dataviz-v2.css`.

### 2026-09-30 — Lens Phase 6, the space wave

The eleven space kinds are redrawn to their `Lib-<kind>` boards for the
pinned figure panel, each with cue anchors, a build order and one number set
large at 96px, 72 on phones, its label 8px below (LENS §7; the anchor ids and steps are in each component's header,
under `Cue anchors:` and `THE BUILD`). The six chart kinds (`trajectory-arc`,
`delta-v-ladder`, `descent-profile`, `orbit-trace`, `launch-stats`,
`eclipse-cone`) draw TWICE, by rendering themselves again with
`<Astro.self {...Astro.props} w={…} />`: at 470 units (the panel body at
1280, measured) and at 290 (a 375 phone gives the figure 293px), one shown by
`.px-sfig__dual` (below 600px, and always in a story card), so a 12-unit label
is 12px at both widths and no chart scrolls sideways. The hidden drawing's
scene is 0×0, so the build island never starts it and the render gate skips
it. The two radial kinds draw once at 290 units and fit both widths:
`transfer-window` centred in the panel, `lagrange-map` as a 290 map beside a
160 inset that wraps under it on a phone. Their shared parts (the headline,
the dual rule, the SVG text roles, a key row) are one block in
`dataviz-v2.css`, **`px-sfig`**, and one helper module, `topic/space/_fig.ts`, which also
carries `svgTag()`: a cue numeral inside an SVG sits in a `foreignObject`
holding the exact `.px-cue-tag` slot `core/Section.astro` fills. In every
label the numeral slot sits between the mark and the words, so it never
depends on a text-width estimate. Removed with the redraws: the CSS-3D tilts
(`trajectory-arc`, `delta-v-ladder`, `eclipse-cone`), the starfield, the
satellites' `animateMotion` loop, the in-card captions and ledgers, and
`margin-bullets`' row picker, readout, legend and table (its `note` stays
for assistive tech). New prefixes `px-ot` (OrbitTrace, replacing `.ot`) and
`px-lst` (LaunchStats, replacing `.ls`); the `.ot` / `.ls` rules left
`dataviz-v2.css`, and the four old space classes left its min-width lists.
`delta-v-ladder` now reads segment labels that chain as "A → B" as ROUTES
(side-by-side columns), so alternatives no longer add up to a budget no
mission spends. The two WebGL kinds sit on the deep plate: the mount
re-points `--ink`, `--paper`, `--muted` and `--accent-alt` (the runtime
reads the scene's colours from the mount), and their anchors and build live
on an HTML key under the drawing, never on the canvas or the fallback.
`transfer-window`'s slider ships `hidden`, sits outside the build scene and
never runs on load. An authored `color` is honoured as a fixed encoding on
`orbit-trace`, `launch-stats`, `delta-v-ladder` and `constellation-swarm`;
the showcase's neon colours were removed so the desk inks show.

### 2026-09-30 — Lens Phase 6, the travel wave

The eleven travel kinds are redrawn to their boards (`Lib-<kind>.dc.html`;
`itinerary` to `Lib-route-card`, retitled on the canvas), each with a
`Cue anchors:` header, a build order and scoped CSS. **`itinerary`** is ONE
route (`px-itin`): legs and the folded `days` both render as stops on a
dashed rail; the `.rc` markup, its `dataviz-v2.css` block and the reel's
rows are gone. `journey-map`'s old rules left `themes/travel.css` (they set
a serif place name and a teal detour). The SVG kinds (`elevation-trek`,
`timezone-arc`, `altitude-oxygen`, `fare-terrain`) draw on a 460-unit
viewBox with text at 12 and up, keep 460px on a phone and scroll in their
card (their scoped `min-width`; the old `__svg` classes left the
card-scroll lists), and print cue numerals from an HTML layer placed in
percent, each numeral put clear of labels, lines and other numerals.
`season-wheel` lost its tilt and its month scrubber and `attrition-waffle`
its VizCard shell and group-select island: the cues light a month or a
group now (the waffle's cells and ledger row share the group's anchor).
`terminator-globe` sits on the desk's deep plate; the mount repoints
`--paper` / `--ink` / `--muted` / `--accent-deep` at the plate's values
for the scene, and `scenes/terminatorGlobe.ts` lifts the globe body 14%
off a dark ground and draws the night in black there. Its build runs on
the number and the key only, outside the mount, because the fallback
(where the anchors live) is hidden once the scene is live.

### 2026-09-30 — Lens Phase 6, the core wave

The ten core kinds are redrawn to their boards, with cue anchors (each
component's header lists them under `Cue anchors:`) and a build order.
**`gauge`** is ONE half arc for its three variants (`px-gauge`; the
`px-cgauge` / `px-swdial` / `px-tdial` markup is gone): the track in the desk
tint, the fill in the mark, the number at 96 in the bowl (72 on phones, the
headline tier of LENS §7, as for the readout's key tile, number-sense's figure
and you-think's record figure), every word
HTML so nothing scales below 12px; capacity zones ride a thin outer ring and
lean markers tick the arc, both listed in a key. **`comparison`** is side
plates and read-across rows (`px-cmp`), **`quote`** the mark and the words at
up to 32 (`px-qt`), **`data-readout`** tiles as cards with a 96 hero,
**`you-think`** one card cut by a slash with the belief struck,
**`number-sense`** the figure at up to 96 over equivalence cards,
**`act-break`** a ruled band with the numeral at 160, **`prose`** plain paragraphs (the drop cap stays retired).
**`jargon-buster` and `three-steps` are figure kinds now:**
`core/Section.astro` dropped them from its narrative set and writes each
term's meaning or step's text into the article as a cue sentence; the panel
carries the cards (their meanings and texts are hidden inside `.px-fig__body`
by the components' own CSS, since `SectionBody` hands them no `compact`).
`YouThink`'s counter regex had lost its backslashes and never matched a
number; fixed. Dead now: the `.px-compare*` / `.px-quote*` rules in
`base.css` and the six theme files.

### 2026-09-30 — Lens Phase 6, the earth wave

All eleven earth kinds carry cue anchors (the `Cue anchors:` block at the top
of each component) and a build (`data-build-scene`, axis → marks → labels →
number), drawn for the 470px figure panel with every label at 12px or more
at 1280 and 375. Shared parts, in `topic/earth/`: **`FigHead.astro`**
(`px-efh`, the one large number, 96 / 72 on phones, a counter when it holds
one number with at most one decimal, else a rise; anchor `head`; `deep` for
the plate), **`CueLayer.astro`** (`px-ecl`, the cue numerals over an SVG: one
slot per anchor in percent of the viewBox, printed at real 12px, each slot
carrying the anchor's `data-cue` so it lights with the mark) and **`_fig.ts`**
(the literal font stacks, label width estimates, `stack()` for label columns,
`headBuild()`). Two rules the wave settled, for any kind that follows:
**(1) an SVG cannot hold the `.px-cue-tag` span Section fills, so put the
numerals in an HTML layer over it** (CueLayer); **(2) the three WebGL kinds
put their anchors on the fallback and its HTML label layer, and their build
only OUTSIDE the mount** (the headline, the key): headless Chrome runs WebGL,
the live scene hides the fallback, and a build element inside it ends 0×0 on
the live page (the BUILD check). The deep plate re-points `--ink` / `--paper`
/ `--muted` to the on-deep inks, and `runtime.ts` reads those off the mount,
so the live scene draws light on dark with no scene change. `climate-spiral`
keeps its VizCard and its scrub; its build is a nested scene that excludes
the JS-shown control. Phone widths: `core-sample`, `sea-level-tank`,
`atmosphere-column` and `climate-spiral` are drawn at 320–344 units with
13.5–14.5 unit type so a 305px panel prints them at 12px; `quake-depth`,
`carbon-loop` and `region-map` are drawn at 460 and scroll inside their card
on phones (the rule is in each component; their entries left the
`dataviz-v2.css` lists). The `.px-map` and `.px-cstrip` blocks left
`themes/earth.css`, and the `.cs` block left `dataviz-v2.css`.

### 2026-09-30 — Lens Phase 6, the tech wave

All thirteen tech kinds carry cue anchors (a `Cue anchors:` block heads each
component), a build order through `build.ts` and, where the kind has one, ONE
headline number at 96 (72 on phones, LENS §7) with its label 8px below; the
head is a size container and `--ch` (the number's character count) caps the
size so a long number (1,363,250) fits the panel instead of overflowing it. **Drawn for
the panel:** `scaling-plot`, `adoption-curve`, `queue-cliff` and `moore-ladder`
are 460-unit viewBoxes with 12px text, so they fit the ~470px panel at 1280
and scroll inside their card on a phone at their authored size (their entries
left the 720 / 640 lists in `dataviz-v2.css` for a 460 one; `.px-pkt__bar` is
gone). `latency-waterfall`, `benchmark-chart`, `arch-stack`, `version-graph`,
`chip-die` and `state-timeline` are HTML and fit every width. **The SVG
numeral idiom used here:** an HTML layer over the drawing (`__tags`, each
numeral positioned by % of the viewBox), since Section.astro fills only
`span.px-cue-tag` slots. **Scenes on the graphic, not the card,** wherever the
card holds an `html.js`-gated control (scaling-plot's toggle, queue-cliff's
slider, state-timeline's markers) or a WebGL mount whose fallback hides when
live (neural-flow, packet-trace build only their HTML outside the mount). An
element that can be `display:none` (an uncued numeral pin, a rule hidden on
phones) never builds: the BUILD check cannot compare it. **Retired:**
`arch-stack`'s and `chip-die`'s CSS-3D tilt and hover lifts, `chip-die`'s
readout island, `neural-flow`'s legend island and the scene's projected labels
and count-up (`scenes/neuralFlow.ts`), `packet-trace`'s SVG bar and its
legend disclosure, `commit-grid`'s rules in `themes/tech.css` (and the dead
`.px-bench` / `.px-scurve` blocks there), the `.bc` and `.adc` blocks in
`dataviz-v2.css`. `state-timeline`'s fixed encoding is now `#D7E2BF` /
`#C97C22` / `#A02D18` (blueprint §6 amended).

### 2026-09-30 — Lens Phase 4a: the stage, the pages, the intro, the cover field

New: **`core/Stage.astro`** (`px-stage`, the full-bleed deep plate with the
on-deep masthead), **`stage/StageScene.astro`** (`px-scn`, an issue as a
picture: the spiral clock on Home from No 17's timeline, the orbit on the
space desk from No 14's descent profile, readout bars, or the cover mark on
a tint panel; data in `src/lib/stage.ts`, pure), **`core/IntroOverlay.astro`**
(`px-intro`, the three-scene first-visit intro on Home) and
**`core/PromiseStrip.astro`** (`px-prom`). Rebuilt to their boards:
`src/pages/index.astro`, `desk/DeskIndex.astro` (and its route),
`src/pages/about.astro`, `src/pages/archive.astro` (the chips now filter
cover cards by month; the search box is gone, as on the board) and
`src/pages/subscribe.astro`. The issue schema gained `cover` (see
`src/content/issues/_AGENTS.md`); `coverModel()` reads `cover.section` and
returns a `caption`. The stage and the intro build through Phase 5's
`build.ts` (`data-build-scene`, `data-build`, `data-build-kind`, the counter's
`data-to`, `[data-build-replay]` shipped `hidden`, `px:build`). The share
cards (`scripts/story/og-card.ts`) now draw the seal-cut medallion, the
italic word in the desk hi and the issue's cover mark on the right 45%.
`DARK_DESKS` left `src/lib/desks.ts` with the dark page grounds.

### 2026-09-30 — Lens Phase 5: one build island

`core/Reveal.astro` and `core/VizMotion.astro` are DELETED, with every
`data-reveal` attribute, every `data-countup`, and every CSS rule whose
selector named `.is-in` (the `html.js …:not(.is-in)` hidden states, the
`.is-in` staggers and delays, and their reduced-motion resets) in 75
components, `dataviz-v2.css` and `base.css`. Four keyframes that only those
rules used went too (`telSweep`, `px-cloop-flow`, `px-pflow-flow`,
`descRide`). Components paint their final state; motion is §11.

### 2026-09-30 — Lens Phase 4b: story cards and the account islands

- **Story mode** is rebuilt to the Story and Story-Phone boards (§4 `pxs-`
  row). `StoryCard`, `StoryHookCard` and `StoryCtaCard` take `count`, `desk`
  and `issueNo` now; `StoryShell` takes `labels`, `desk`, `eyebrow` and
  `slug`, and sets the desk inks (`--dk-text`, `--dk-mark`, `--dk-tint`,
  `--dk-deep`) on its root. The beat figure is `SectionBody bare`; a chart
  drawn for the 720 measure keeps its width and scrolls inside the 312px
  card on desktop, from a copy of `dataviz-v2.css`'s min-width list in
  `story.css` (keep the two in step until Phase 6). No `data-reveal` on the
  beat: the build island owns motion (Phase 5). The fixed chevrons and the
  fixed progress segments are gone; nothing floats on touch.
- **`SaveButton`** gained `variant` (`toolbar` | `block`) and the Lens values.
- **`AccountEntry`** renders the account pill on session pages (§4).
- **`WelcomeBack`** and **`NewsletterNotice`** lost the glass and the dark-desk
  variant, gained 44px close buttons; the notice's link is relative
  (`/login?next=/`).

### 2026-09-30 — Lens Phase 2: the shell

`core/Masthead.astro` (`.mh` in `base.css`), `core/Colophon.astro` and
`home/IssueRows.astro` are rebuilt to the Lens boards (LENS §4.2, §4.3), and
two components are new: **`core/CoverCard.astro`** (`px-cover`) and
**`core/CoverMark.astro`** (`px-cmark`), with their pure helpers in
`src/lib/cover.ts` (the derivation and the label clipping),
`src/lib/desk-inks.ts` (`ink(desk, role)` → `var(--spo-text)` and so on: a
house page names a desk's ink by role, never by hex) and
`src/lib/issue-number.ts` (the home page's numbering, "No 07", "28 Sep").
`core/Mark.astro` gained `ground` and `onDeep`. The masthead's `variant`
still names the desk; `variant="stage"` with `desk` is the on-deep version.
The six SVG annotation and gauge stacks that still named Literata
(`Gauge`, `ApprovalChart`, `EloRiver`, `XgRace`, `AdoptionCurve`,
`ScalingPlot`) moved to Instrument Sans (the gauge's words and number) and
Newsreader italic (the annotation callouts), each at 12px or more; the
Literata share-card TTFs left `assets/fonts/`.

### 2026-09-30 — Lens Phase 0: the verdict applied to the library

The design law is now `docs/design/LENS.md` (root `AGENTS.md` §7, §10). For
this subtree: **87 kinds**. Deleted: `core/BeatSheet`, `core/Plate`,
`topic/space/{OrbitalShells,OrbitGlobe,SignalReadout}`,
`topic/earth/{ElevationProfile,DataGlobe}`,
`topic/politics/{CoalitionOrbit,BallotFlow,SwingDial}`,
`topic/tech/ThroughputDial`, `topic/travel/{RouteGlobe,CityCompare,ItineraryReel}`,
and the scenes `orbitGlobe`, `coalitionOrbit`, `dataGlobe`, `routeGlobe`.
`topic/earth/CarbonGauge.astro` moved to **`core/Gauge.astro`**: one
component, three variants derived from the fields present (`remaining` means
budget, `max` means capacity, neither means lean), each keeping its old markup
and prefix (`px-cgauge`, `px-swdial`, `px-tdial`) until Phase 6 redraws them
as one arc. `topic/travel/RouteCard.astro` became **`Itinerary.astro`**: legs
gain an optional `day` kicker and an `items` list, and a stop glyph when
`mode` is absent; an `itinerary-reel` payload's `days` render as stops.
`core/Comparison.astro` gained the **pair form** (`cityA` / `cityB` / rows of
`a`, `b`, `winner`, `note`), normalised onto the matrix with a `data-win`
cell and a full-width `.px-compare__note`. `SectionBody` dispatches `gauge`
and `itinerary`, passes `cityA` / `cityB` to Comparison, and resolves any
alias with `canonicalKind()`. The narrative set is seven kinds now
(`beat-sheet` and `plate` left it) in `check-catalog.mjs`,
`project-graph.mjs`, `ReadingGate.astro`, `ui-probe.mjs` and the
`explainers.ts` header.

### 2026-09-15 — Thirteen documented fields nothing rendered; check:catalog check 5

A sweep of all 101 kinds compared each catalog `DATA:` line against what its
component actually reads. **A props interface is a DECLARATION, not a reader**
— that is why every one of these survived: the field was in the interface, in
the header comment, in the catalog and in issue frontmatter, and reached no
markup. Astro does not error on an unread prop, so nothing showed in a build,
a diff or a browser. Full list and reasoning: root `AGENTS.md` §10.

Rendered: `benchmark-chart.items[].sublabel` (new `.bc__sub`, a second line in
the fixed 150px label column — the track collapses to ~43px on a phone, that
column does not); `tactics-pitch.players[].role` (the disc takes `num`, else
`role`; the published Arsenal pitch had eleven blank discs);
`city-compare.rows[].note` (new `.cc__note`, `grid-column: 1 / -1` so the
centre column keeps its width); `climate-calendar.months[].note` (new
`.px-ccal__notes`, a named footnote under the strip); `league-table`'s `gf` /
`ga`, both `class="hide"` like GD; and `comparison`'s `columns` LIST form,
which the catalog had documented since the beginning and nothing ever read.

`data-readout`'s `emphasis` is the one that was invisible at the CSS layer
rather than the component layer: `.tel__tile[data-emphasis]` had no rules,
because the styling sat on the RETIRED `.px-readout__tile` prefix in the six
theme files (§4's "inert dead code" list — it was not all inert). 25 flags
across 8 published issues painted flat. Now one block in `dataviz-v2.css`:
an inset 2px accent rule plus an accent numeral, the retired intent restored.

Struck (with any authored content moved first): `data-readout.accent` →
`emphasis`, `city-compare.flag`, `channel-ternary.corners[].id` /
`entities[].short`, `terminator-globe.showEoT`, `adoption-curve.xLabel`.

`Comparison` also stopped emitting `.px-compare__source`. It was the last
component-rendered source line in the codebase: the 2026-09-04 sweep matched
`__src` and this one ends `__source`, so it printed the source twice under any
comparison that had one, and story.css's `[class$='__src']` rule could not
hide it in a beat either. Its list form builds each column as ONE block (head
+ its own items) so a phone can stack columns without an item losing its
heading — the first attempt stacked the two grids independently and put both
headings above all eight items.

**New: `check:catalog` check 5.** Every field in a catalog DATA line must have
a reader in the component, its dispatch arm, its direct imports or its WebGL
scene — 852 fields, and a bare prop forward to the kind's own component does
NOT count (that is the bug's exact shape). Deliberate exceptions live in
`ACCEPTED_UNREAD` in `scripts/check-catalog.mjs`, each with a reason; today
that is the annotation contract's `side` / `series` on single-series kinds
(`_ANNOTATIONS.md` §1 calls `side` a hint and `series` multi-series only) and
`chamber`'s `{party: n}`, which is a placeholder for a party name used as a
key. **Adding a field to a DATA line now fails the build until something
renders it.**

New prefixes: `.bc__sub`, `.cc__note`, `.px-ccal__notes` / `__noteln`,
`.px-compare__col` / `__list` / `__item`. None ends in `__cap` or `__src`,
which story.css hides inside a beat.

### 2026-09-13 — Phase 3 of the register plan: four plain-language kinds, the annotation slot, `analogy` generalised, `hero` retired

Built under `docs/REGISTER-PLAN.md` RG-09 and RG-20 by one-file-scoped
component agents against blueprints in `docs/design/blueprints/core/`, wired
by the orchestrator through `scripts/wire-kind.mjs` (which now emits the
RG-19 `howToReadFor()` idiom, takes `world: 'core'` for a universal kind, and
`vizcard: false` / `narrative: true` for a narrative one — note it also skips
the KIND_PRIORITY step whenever the kind's name already appears in `story.ts`,
which a TRIM entry triggers; add the score by hand).

- **`you-think`** (`core/YouThink.astro`, `px-yt`, VizCard) and
  **`number-sense`** (`core/NumberSense.astro`, `px-ns`, VizCard) — the
  VizCard set is **twelve** kinds now, not ten; neither is in `NEEDS_HOW`, so
  their panel renders only when authored. `number-sense` renders its value
  static on purpose: the shared count-up ends in `toLocaleString()`, which
  regroups an authored `1,500,000` as `15,00,000` in an `en-IN` browser.
- **`jargon-buster`** (`core/JargonBuster.astro`, `px-jb`) and
  **`three-steps`** (`core/ThreeSteps.astro`, `px-3s`) — narrative kinds:
  bare root, no card, no EXPLAIN; in `NARRATIVE` in `check-catalog.mjs`,
  `project-graph.mjs`, `ReadingGate.astro` and the `explainers.ts` header.
  Story trims: 4 terms, 3 steps (four stacked steps overflow a 667px card).
- **`analogy` generalised** — `topic/politics/BrothersAnalogy.astro` takes a
  universal `pairs[]` (this ↔ that, hairline rows) beside the legacy
  `brothers[]`, which still renders byte-identically for the delimitation
  issue. The pairs branch neutralises the legacy ink plate that
  `politics.css` applies on every desk (`px-analogy--pairs`), and its style
  block is `is:global` on purpose so the legacy markup keeps its exact
  classes. Pivot glyph in `--accent-deep` (TD-06).
- **The annotation slot** — `data.annotations[]` on `timeline`,
  `climate-strip`, `adoption-curve`, `benchmark-chart`, `approval-chart`,
  `scaling-plot`, `xg-race`, `elo-river`, per
  `docs/design/blueprints/_ANNOTATIONS.md`: a ≤ 12-word callout on the mark
  that shows the finding, in-SVG `<text>` with the literal font stack (an HTML
  `.tl__annot.vz-annot` on the timeline), byte-identical markup when absent.
- **`hero` retired** — it had rendered nothing since `core/Hero.astro` was
  deleted on 2026-09-08. Removed from `SECTION_KINDS`, the catalog, `story.ts`,
  the narrative sets, the template (which now opens with a real section and
  a primer placeholder) and the one draft that carried it (its intro survives
  as a prose lead). Library: 101 kinds.
- Worked examples in the politics (you-think), sports (jargon-buster),
  travel (number-sense) and earth (three-steps, analogy pairs) showcases;
  `docs/design/catalog-shapes.md` lists all five by job.

### 2026-09-13 — The how-to-read default is per kind (REGISTER-PLAN RG-19)

The every-kind `EXPLAIN.how` fallback of 2026-09-04 was measured: a paragraph
on 69 published sections, 5.7 text blocks per section, and readers calling
the product a wall of words. Ruled *only where the chart needs it*. One
function now resolves the panel for every render site —
`howToReadFor(kind, authored)` in `src/lib/explainers.ts`: an authored
`howToRead` always renders; the default renders only for the kinds in the new
`NEEDS_HOW` set (instruments, WebGL scenes, counter-intuitive forms — 45 of
the 90 explained kinds). `core/Section.astro` and `SectionBody.astro`'s ten
VizCard dispatch lines both call it; VizCard is unchanged. The source line
folded onto the plain line (`.px-plain__src` is `display: inline` now, in
`viz-type.css`) — one block fewer per section. The ⤢ study view still carries
every `how` string. §1, §2, the VizCard note and step 5 of "how to add a
component" updated; a new kind with a control or a misreadable form is added
to `NEEDS_HOW` in the same commit as its EXPLAIN entry. The composer's
data-shape lookup lives in `docs/design/catalog-shapes.md`.

### 2026-09-08 — The launch design

- **Literata only** (§1). The trio's role tokens survive as names.
- **Masthead** (`core/Masthead.astro`, `.mh` in base.css): the lockup — `Mark`
  gained `tight` (viewBox trimmed to the ring) and `ring` (pin the stroke) —
  wordmark 25px/700 nudged −1.5px so its cap centre sits on the disc centre,
  the register on the same axis; Home · Desks · Archive · About with
  `aria-current`, the live badge, `AccountEntry`, a square Subscribe to
  `/subscribe/`; a `<details>` Menu under 768px. `core/Colophon.astro` is the
  four-column footer with the same lockup and the legal line.
- **Issue page** rebuilt around `core/IssueHead.astro`; the floor plan is
  170 / 1fr / 250 on the 1280 frame with a 720 measure (layout-v2.css);
  `core/Section.astro` takes an `id` (`sec-N`, from `SectionRenderer`) for the
  aside's contents list; `ReactionsBar`, `LettersBlock`, `Sources` are hairline
  bands with a 260px label column; `ReadingGate` is square and lists letters,
  not margin notes, as the second benefit.
- **Deleted:** `AnnotationLayer`, `Banner`, `Hero`, `Primer`, `Footer`,
  `TopicManifesto`, the six `<Topic>Index` fronts, and the old home set
  (`WireStrip`, `FeaturedPlate`, `HeroLens`, `ManifestoStrip`, `CategoryGrid`,
  `CategoryCard`, `TypographicChord`, `SubscribeStrip`, `ArchiveList`,
  `TopicStrip`) plus the orphaned `welcome/*` beats. `meta.css` is tokens only.
- **New:** `core/IssueHead`, `core/Plate` (kind `plate`, 98 kinds),
  `home/IssueRows`, `desk/DeskIndex`; `src/lib/desks.ts` carries `DESK_COPY`
  and `DARK_DESKS`.
- **Prefixes added (§4):** `px-ihead`, `px-plate`, `px-rows`, `px-desk__`
  (both the home cards and the desk template, each scoped), `px-home__`,
  `px-abt__`, `px-subs__`, `px-arch__`, `px-ifact`, `px-inav`, `px-col` (kept),
  `px-floor` (kept). `.px-vexp` roots: `[data-viz-root]` is now positioned in
  `modal.css`, so the ⤢ no longer floats to the page corner under
  reduced-motion.
- **Per-world type overrides of the section chrome** (`.px-eyebrow`,
  `.px-section__num`, `.px-prose__*`, `.px-hero*`) were stripped from the six
  themes: worlds differ by colour.



### 2026-09-04 — Phase 6.1 shell adoption + 6.2 best-first; REVAMP-PLAN v3 signed

Eleven commits (e5fd2f1 → dc6a28c), all committed. The canon edits
(`docs/design/CANON.md`, `motion.md`) are a MARKED DRAFT awaiting the
operator's signature; the `--t-page` retime is the one open token decision.

- **The source fold (§1, §2, §4, §9).** `core/Section.astro` now renders the
  source line as `.px-plain__src` — `Source · …`, 9px/600/.14em mono — as the
  plain paragraph's **second line, below the graphic, for every kind**, from
  `section.source ?? data.source` (`SectionRenderer` passes `source` through;
  Section joins `{label, date}`). The **seventy** per-component `.px-viz__src`
  emitters were stripped (66 canonical one-liners, 3 variants; SeatChart's
  bespoke `px-seats__source` had already gone to the shared class and is now
  gone with it). `.px-viz__src` has **zero emitters and zero CSS** — the rule
  and the interim unscoped hide were retired in `dataviz-v2.css` (a note
  remains). `VizCard` no longer renders source (still accepts the prop).
  `CourtValue` kept its value-MODEL line on a new scoped `.px-cval__model`.
  The ⤢ modal portals the card, so it shows no source — ruled as-is. The
  verifier is unaffected (it reads MDX).
- **The how-to-read fallback is ON (§1, §2, §3).** `core/Section.astro`
  renders `<p class="px-viz__how px-viz__how--section">` ABOVE the graphic
  (after intro, before the slot) for every kind from
  `section.howToRead ?? EXPLAIN[kind].how`. For the **ten** VizCard kinds
  (`bill-funnel`, `age-pyramid`, `margin-bullets`, `state-timeline`,
  `attrition-waffle`, `finish-interval`, `channel-ternary`, `scaling-plot`,
  `xg-race`, `climate-spiral`) `SectionBody` resolves the same expression at
  the dispatch line (it now imports `EXPLAIN`) so the card carries the panel,
  and `.px-section:has(.px-viz > .px-viz__how) .px-viz__how--section
  { display: none }` guarantees exactly ONE panel per section. Before this an
  authored `howToRead` on any of the 87 non-VizCard kinds was silently
  dropped. Instrument rule: **the static reading leads, the control clause
  trails** (controls are `html.js`-gated, the paragraph is not).
  `tactics-pitch`'s `how` is the only live control cue; 29 draft-only cues
  await a bulk pass (`docs/design/EXPLAIN-HOW-REVIEW.md`: 90 `how` strings,
  30 CUE / 60 READ).
- **Flat surfaces (§4, §7, §9).** `.px-viz` is flat — radius 0, no shadow,
  `border-top: 3px solid var(--viz-edge, var(--ink))`, hover = border colour
  only. New per-theme token `--viz-edge` (`var(--ink)` on politics/earth/
  travel, `var(--accent)` on space/tech/sports). The RD-05 radius flip
  (`--r-card: 0; --r-tile: 0`) lives in `base.css :root`, **not** in
  `shared/design/tokens.css`, because `app/` consumes those; `--r-pill` is
  deliberately untouched (43 sites of UI chrome). Shadow sweep 115 → 64
  declarations: removed on surfaces only (`.px-compare`, `.px-beats`,
  `.px-bills__card`, `.px-analogy`, `.px-shells`, `.px-commit__frame`,
  `.px-elev__stack`, the gate card, letters, annotation items, home cards,
  featured plate, travel ticket cards, the six topic-index empty states — which
  gained a 1px hairline — and the bespoke roots `.px-coalc` / `.px-swheel`,
  which also gained the 3px `--viz-edge` rule). KEPT: focus rings, inset
  hairlines, halos on data marks, slider thumbs, CSS-3D scene depth (ArchStack,
  PlayerCard, TacticsPitch, ChipDie, CoreSample, SeaLevelTank,
  AtmosphereColumn, BillPassage, ItineraryReel — RD-06), viz3d overlay,
  modal/popover/toast chrome, the onboarding surface. Ten of seventeen theme
  "elevated card" rules were v2-port orphans (`.px-readout`, `.px-vote`,
  `.px-paradox`, `.px-appr__svg`, `.px-pwm`, `.px-ortrace__wrap`,
  `.px-launch__svg`, `.px-bench__svg`, `.px-scurve__svg`, `.px-route__card`)
  — elevation blocks deleted, base rules left for the deferred dead-CSS pass
  (§9). `ReadingToolbar` `.rtb` is flat: opaque paper, `2px solid var(--ink)`,
  no backdrop-filter, pill radius kept; glass survives on the modal only. The
  ⤢ `.px-vexp` is 44px on `(pointer: coarse)`.
- **Phase 6.2 best-first (§2).** `scaling-plot` gained a LOG/LINEAR axis
  toggle (`px-inst__chip` + `aria-pressed`; both projections computed in
  frontmatter, no scale math on the client; two latent tick-formatter bugs
  fixed). `xg-race` gained a minute scrub and `climate-spiral` a MONTH scrub
  (month, not the plan's year — the payload is four years): native
  `<input type=range>`, ships hidden, the island unhides it once the payload
  parses; per-minute/month tables precomputed at build. All three now route
  through `core/VizCard.astro`. `px-inst` gained the **opt-in**
  `px-inst__readout--sized` + `.px-inst__sizer` height reservation (must stay
  opt-in — `StateTimeline` mixes inline children).
- **Story mode.** `story.css` now hides `[class$='__cap']` / `[class$='__src']`
  at depth 1 as well as depth 2 — Timeline, BillBreakdown and VoteResult emit
  chrome as a SIBLING of the graphic root. The `__src` beat rule is left in
  place as a harmless suffix rule.
- **Still owed:** the Phase-5 mobile font bump on ScalingPlot / XgRace /
  ClimateSpiral (ScalingPlot.astro carries the measurements and why a plain
  bump fails); a JS-gated `howToRead` control clause (a schema call); the
  `--t-page` retime. Next per RD-13: Phase 6.3 type harvest, which begins by
  measuring the font binaries.


### 2026-07-14 — P6 component breadth (+22 kinds), funnel islands, responsive pass

**Everything below is in-repo and build-green, and all of it is UNCOMMITTED.**
Nothing here has been committed, pushed or deployed; the operator does that.

- **22 new section kinds** (`SECTION_KINDS` → **90**; `npm run check:catalog`
  now passes 90 ↔ 90). Per world: earth `plate-motion` (WebGL),
  `atmosphere-column`, `carbon-loop`, `storm-track` (WebGL); space
  `constellation-swarm` (WebGL), `lagrange-map`, `transfer-window`,
  `eclipse-cone`; politics `coalition-calculus`, `gerrymander-lens`,
  `ballot-flow`; tech `packet-trace` (WebGL), `queue-cliff`, `chip-die`,
  `moore-ladder`; travel `city-grid`, `altitude-oxygen`, `season-wheel`,
  `fare-terrain`; sports `elo-river`, `court-value`, `pace-ridge`. Four new
  scenes (`scenes/{plateMotion,stormTrack,constellationSwarm,packetTrace}.ts`),
  one new pure-math sidecar (`viz3d/packet.ts`, shared by the component and
  its scene), one new data file (`public/geo/plates.json`). Every component
  browser-verified on desktop and at 375px.
- **The file was also 4 kinds stale before this pass** — the WebGL world
  flagships `terrain-relief`, `neural-flow`, `terminator-globe` and
  `flight-of-the-ball` had shipped without ever reaching §2/§10. They are
  documented now; the library block is **59 kinds**, of which **14 are WebGL**
  (was documented as 33 / 6).
- **Two dispatch traps recorded (§2).** `coalition-calculus` is the one kind
  dispatched with a **spread** — `<CoalitionCalculus {...data} />`, flat props,
  not `section.data` fields. And several breadth components **hard-throw at
  build time** on malformed data by design (`city-grid` 1–3 cities × exactly
  36 bins; `season-wheel` exactly 12 months; `altitude-oxygen` 2–8 stops;
  `fare-terrain` 1–5 routes × ≥6 points).
- **§3 checklist is now nine steps** — the scene registry
  (`scripts/viz3d/scenes/index.ts`, WebGL only) and a worked showcase example
  are explicit, because those were the two the breadth pass kept catching.
  Also: `section.plain` is Zod-capped at **220 chars**; overshooting breaks the
  build.
- **New Family D — HTML-interactive (§10).** Build-time HTML paints the
  finished answer; a tiny island unhides the control.
  `coalition-calculus` is the reference (chips ship `hidden`, ledger ships
  `open`, island inverts both on boot), with `transfer-window` and
  `queue-cliff` as SVG-scrubber siblings.
- **Funnel islands (§7, §8).** New `core/WelcomeBack.astro` (`px-wb`, mounted
  in `[slug].astro`) — post-auth `?welcome=1` toast with a `px_resume` scroll
  resume and an 8s auto-dismiss that **pauses on hover/focus**. New
  `core/NewsletterNotice.astro` (`px-nnote`, mounted **above `<Masthead>`** in
  `index.astro`) — the `?newsletter=confirmed` ribbon. Both stay `hidden`
  under no-JS and strip their own query param.
  `core/SaveButton.astro` (which mounts **inside `ReadingToolbar`**, not on the
  page) gained the "Save to your shelf" signed-out label, `&world=` on the
  login URL, and a fading first-save microline.
  `core/NewsletterForm.astro` repointed `/api/subscribe` → **`/api/join`** and
  is now **no-JS-gated** behind `html:not(.js)` — a no-JS submit previously did
  a native GET that leaked the reader's email into the URL, history and server
  logs. It is the single embedded source for every newsletter mount.
  `core/AccountEntry.astro` + `core/ReadingGate.astro` already existed and were
  verified, not rebuilt.
- **Responsive pass + an honest residual (§10).** The real 375px overflow was
  data tables: `.lt` / `[class$="__table"]` now scroll inside their card below
  640px. **Still unfixed:** in-SVG fine print renders ~3.4–7px at 375px
  (fixed `viewBox` + `width: 100%`, and a blanket `min-width` breaks the
  tall-narrow forms). Mobile legibility rests on the HTML layer + the ⤢ modal.
  A per-component reflow round was offered and **not** done.
- **Story mode (§4).** `story/StoryCard.astro` now skips `SectionBody`
  entirely for `kind: 'prose'` and renders a pure-text card
  (`.pxs-card--text`); `story.css` hides each beat's own `__cap` / `__src`
  chrome inside a story card (the beat text is the title, the CTA carries the
  sources). Residual: text-heavy narrative kinds still rely on the
  spec-sanctioned 62dvh internal scroller — the real fix is an authored
  `story:` block, an editorial act rather than a code gap.

### 2026-07-05 — politics flagships: `chamber` + `power-flow`

- **`chamber`** (WebGL FLAGSHIP + politics world signature) — instanced 3D
  hemicycle parliament per `docs/design/blueprints/politics/chamber.md`. New
  pure-math module `src/scripts/viz3d/hemicycle.ts` (kepler.ts pattern —
  feeds both `scenes/chamber.ts` and the component's build-time fallback
  SVG). One InstancedMesh for all seats, dashed majority arc, rostrum,
  `setState('composition'|'division')` staggered seat walk. State chips on
  the component set `data-viz3d-state` on the mount; `runtime.ts` gained the
  ~10-line MutationObserver **state-chip bridge** (watches the attribute IF
  `handle.setState` exists; disconnected in teardown; zero cost otherwise).
- **`power-flow`** (SVG flow flagship) — 100% build-time directional Sankey
  per `docs/design/blueprints/politics/power-flow.md`, with a build-FAILING
  conservation check on `via` nodes (unless `imbalance: 'the-point'` → the
  accent-alt residual stub) and per-link `flowDash` speed ∝ value.
- Registered in `config.ts` (SECTION_KINDS 62 → 64), `scenes/index.ts`
  (chamber), `SectionBody.astro`, `src/lib/explainers.ts`,
  `docs/design/catalog.md`; worked examples appended to
  `2026-06-03-politics-showcase`. Prefixes `px-chmbr` / `px-pflow` reserved
  (+ the previously undocumented `px-solsys`).

### 2026-07-05 — P1 shared infrastructure (product-elevation plan)

- **Dispatcher split.** The 61-kind switch moved to `SectionBody.astro`
  (no wrapper; shared with the upcoming `/s/` story mode); `SectionRenderer`
  = article chrome (CoreSection + plain line + layout attr + skim block —
  the skim-caption block now renders for ANY kind carrying `skimCaption`,
  and the prose wrapper moved here from `[slug].astro`). Build-verified
  render-identical (word-diff: only block-boundary whitespace).
- **Comprehension layer.** `section.plain` schema field + the in-flow
  `IN PLAIN TERMS —` line under every viz (`core/Section.astro`), defaulting
  from `src/lib/explainers.ts` — the EXPLAIN dict extracted from ExpandModal
  (which now consumes it via a `#px-explain-data` JSON script; one dict, two
  consumers). New kinds MUST add an entry (§3.5).
- **Layout variants.** `section.layout` (`wide|bleed|split|split-flip|breath`)
  → `data-layout` on `.px-section`; geometry in `src/styles/layout-v2.css`
  (split = copy column + sticky stage — the zero-JS scrollytelling
  primitive). New `act-break` kind (`core/ActBreak.astro`) — chapter divider,
  consumes no number. Rhythm rules: `docs/design/CANON.md` §3.
- **viz3d scaling.** `scenes.ts` → `scenes/` directory with a per-scene LAZY
  registry (each scene its own chunk; `runtime.ts` accepts builder-or-loader,
  backward-compatible). New `helpers.ts` (orbit+zoom controls, raycast
  picker, shared `.viz3d__tip` tooltip, instancing, glowSprite — pass THREE,
  never import it) + `kepler.ts` (pure math mirroring
  `docs/design/physics/`). `SceneHandle.setState?` added for scroll-driven
  scenes. Kind count corrected: 61, not the previously-documented 63.

### 2026-06-21 — unified type system + onboarding + signup gate
- **One 3-font system (§1).** Collapsed ~11 fonts to **Fraunces** (serif) +
  **Schibsted Grotesk** (sans, replaced Inter Tight as `--font-body`) +
  **JetBrains Mono**. Worlds now differ by accent colour + treatment, not
  per-world display fonts (Space Grotesk / Cormorant / Oswald etc. retired).
  Normalised in `src/styles/type-v2.css` (imported last); also `meta.css`, the
  six `themes/<topic>.css`, `home/CategoryCard.astro`, and SVG `font-family` in
  `RegionMap`/`CarbonGauge`. This overrides the old §5 "Display labels:
  Cormorant Garamond" note.
- **"The Second Angle" onboarding (§7).** New `intro/` components in a distinct
  cinematic identity (scoped to `px-intro` / `px-xp` in `src/styles/intro.css`,
  loaded via `src/layouts/IntroLayout.astro`): `IntroStory` (5-scene player),
  `IntroExperience` (home first-visit overlay + spotlight tour, gated by
  localStorage `px_intro_seen_v1`, `?intro=1` replays), `WorldViz` (per-category
  mini data-viz). `welcome.astro` rebuilt as a standalone story; `index.astro`
  mounts the overlay. No-JS / reduced-motion safe.
- **Retired/orphaned (§7).** The earlier `welcome/Beat*.astro` issue-like pass
  is now unused; `welcome.css` survives only for AccountLine + About.
- **Metered signup gate (§7).** New `core/ReadingGate.astro` (`px-gate`),
  mounted in `[slug].astro` — soft wall after primer + first 2 sections;
  client-side cookie auth heuristic; no-JS / crawlers render the full article
  (SEO-safe).
- **Prefix reservations (§8):** added `px-intro`, `px-xp`, `px-gate`; noted
  `px-wj` / `px-abt` now mainly serve AccountLine + About.

### 2026-06-03 — expand-to-modal + unified viz typography
- **Expand-to-modal.** New `core/ExpandModal.astro` (+ `src/styles/modal.css`,
  mounted once in `IssueLayout`) adds a ⤢ expand button to every viz card and,
  on click, **moves the live node** into a centred glass modal — the same WebGL
  context + count-up/Tilt/reveal state, just larger — leaving a same-height
  placeholder so the reader's scroll position is untouched. Esc / backdrop / ✕
  close, focus-trapped, `aria-modal`, body scroll locked, mobile full-screen,
  reduced-motion + no-JS safe (no buttons without JS). Targets
  `.px-viz, .vb, .tl, .tel` → zero per-component edits.
- **Unified viz type system.** New `src/styles/viz-type.css` defines one label
  scale (tokens `--viz-fs-*` + `.vz-*` roles: eyebrow / caption / axis / legend /
  value / annot / src) blending the display serif for viz titles+captions with
  crisp mono + tabular figures for axes/values/legends. The shared
  `.px-viz__cap` (now a serif caption + a mono accent unit-chip) / `.px-viz__src`
  and the globe `.viz3d__label` were refined, then every component's scoped
  labels were swept onto the scale (tabular-nums everywhere, serif in-viz titles,
  paper halos on SVG text over busy fills, consistent ink/ink-soft/muted
  hierarchy). The modal bumps the scale a notch (`.px-modal__viz`).

### 2026-06-03 — v2 3D / interactive component library (30 kinds)
- **30 new section kinds, 5 per world** (§2 block), in the v2 design language.
  `SECTION_KINDS` in `config.ts` went 33 → 63; each is dispatched in
  `SectionRenderer.astro`.
- **4 lazy WebGL globes** (`coalition-orbit`, `orbit-globe`, `data-globe`,
  `route-globe`) on self-hosted Three.js, dynamic-imported by
  `src/scripts/viz3d/runtime.ts` (+ `scenes.ts` builders) only when a
  `[data-viz3d]` mount scrolls in — Vite code-splits it into a ~730 KB
  (≈170 KB gz) chunk that never loads on home / non-3D pages. Mounted once
  per issue via the new bundled `core/Viz3DRuntime.astro`. RAF pauses
  off-screen + disposes on `pagehide`; DPR ≤2. See the new §10.
- **26 CSS-3D / animated-SVG** kinds using the shared `.px3d-*` mechanics in
  the new `src/styles/components-3d.css`, driven by the new vanilla
  `core/Tilt.astro` island (`[data-tilt]` / `[data-flip-btn]`, once per issue).
- **No-JS / reduced-motion contract** as §9: every kind renders a static
  SVG/HTML fallback by default; WebGL bails (no canvas, no loop) and the
  fallback stays; reveal-hidden states are `html.js`-gated; reduced-motion
  resets to the final frame.
- Per-component cosmetic CSS is a **scoped `<style>`** in each `.astro` under a
  unique `px-*` prefix (§4 additions: `px-co … px-pcard`); only the shared 3D
  mechanics + `.viz3d` mount live in `components-3d.css`.
- Six `2026-06-03-<world>-showcase` draft issues are the worked examples.

### 2026-06-03 — v2 design-match pass (F1–F3)
- **F1 — masthead unified.** The six `.px-masthead--<topic>` variants
  collapsed into one `.mh` press-header (`core/Masthead.astro`, CSS in
  `base.css`). Per-world register microcopy moved to `core/Banner.astro`.
  `.mh*` is a documented adoption of the kit's names (§9).
- **F2 — data-viz fully ported.** 15 components rewritten to the v2 kit's
  markup, animations, and reveals, emitting the kit's generic class names
  (`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside
  the shared `.px-viz` card. New shared CSS file `src/styles/dataviz-v2.css`.
  Count-up + cursor-warmth via the new `core/VizMotion.astro` island; reveals
  via `core/Reveal.astro`, all `html.js`-gated. Eleven components kept their
  `px-` classes (light-touch — `data-reveal` only). See §2 note + §9.
- **F3 — openers / hero / toolbar.** Section openers gained the ghost-numeral
  depth echo + scroll-in (`Section.astro` now `data-reveal`); hero clamp
  bumped. New glass `core/ReadingToolbar.astro` (progress + Full/Skim + live %
  + read time + Save) **replaced the deleted `core/SkimToggle.astro`**; Save
  now lives inside the toolbar.
- Retired the `px-skim`, `px-appr`, `px-pwm`, `px-cstrip`, `px-ortrace`,
  `px-launch`, `px-bench`, `px-scurve`, `px-route`, `px-ccomp`, `px-ltab`,
  `px-radar` prefixes; the old per-component viz CSS + `.px-skim-*` rules are
  now inert dead code (cleanup deferred — §9).

### 2026-05-20 — File created
Initial version. Section-kind → component table grounded in `config.ts`
and the filesystem. CSS prefix reservation table. SVG conventions and
skim-mode wrapper pattern from `docs/PROJECT.md` §6.
