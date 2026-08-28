# Components — agent guide

> Local rules for `src/components/`. Read the root `AGENTS.md` first for
> project-level context.

---

## 1. Two layers, six topics

Components split into:

- **`core/`** — topic-agnostic. Renders identically under any `data-topic`,
  picking up colour/font tokens automatically. Includes the Masthead, Banner,
  Hero, Primer, Section, Quote, Prose, Comparison, DataReadout, BeatSheet,
  Sources, Colophon, and the ReadingToolbar (the floating reading-progress +
  Full/Skim + Save pill that replaced the old SkimToggle). The scroll-reveal
  and count-up/cursor-warmth behaviours ship as two tiny vanilla
  progressive-enhancement islands — `core/Reveal.astro` and
  `core/VizMotion.astro` — discussed in §"v2 data-viz + chrome class
  exception" below.
- **`home/`** — meta-brand pieces used only on `/` and `/topics/*` index
  pages (TypographicChord, TopicStrip, CategoryCard, CategoryGrid,
  ArchiveList).
- **`topic/<topic>/`** — topic-signature components. One folder per topic.
  Each topic also has its own `<Topic>Index.astro` that drives
  `/topics/<topic>/`.
- **`SectionRenderer.astro`** — the article-chrome shell. Wraps a section in
  `core/Section.astro` (numbering, eyebrow, `plain` line, skim caption) and
  delegates the actual kind dispatch to `SectionBody.astro`.
- **`SectionBody.astro`** — **the dispatcher** (since 2026-07-05). Reads
  `section.kind`, renders the matching component, and passes through the
  section's `data` payload. Shared with story mode, which renders bodies
  without the article chrome — this is why the switch lives here.
  **Add new kinds to `SectionBody.astro`, never to `SectionRenderer.astro`.**

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

**Source of truth:** `SECTION_KINDS` in `src/content/config.ts` (**90 kinds**
as of 2026-07-14 — 30 narrative/classic-viz kinds below + `act-break` + the
**59-kind** v2 3D / interactive library in the block after the table; counted
against the array, not from memory). The catalog with per-kind usage rules is
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
`SectionRenderer.astro` wraps it in the article chrome (`core/Section.astro`
number/eyebrow/title/intro + the "In plain terms" line + `data-layout` +
the skim-caption block, which any kind may now carry). **Add new kinds to
SectionBody**, not SectionRenderer.

| Kind | Component | Topic-scope |
|---|---|---|
| `hero` | inline in `src/pages/issues/[slug].astro` (not via renderer) | universal |
| `act-break` | `core/ActBreak.astro` — chapter divider; consumes no section number | universal |
| `prose` | `core/Prose.astro` | universal |
| `quote` | `core/Quote.astro` | universal |
| `comparison` | `core/Comparison.astro` (2–3 column side-by-side) | universal |
| `data-readout` | `core/DataReadout.astro` (telemetry tile grid) | universal |
| `beat-sheet` | `core/BeatSheet.astro` | universal |
| `timeline` | `topic/politics/Timeline.astro` | politics-styled, used across topics |
| `paradox` | `topic/politics/Paradox.astro` | politics-styled, used across topics |
| `analogy` | `topic/politics/BrothersAnalogy.astro` | politics |
| `bill-breakdown` | `topic/politics/BillBreakdown.astro` | politics |
| `vote-result` | `topic/politics/VoteResult.astro` | politics |
| `seat-chart` | `topic/politics/SeatChart.astro` | politics |
| `approval-chart` | `topic/politics/ApprovalChart.astro` | politics |
| `power-matrix` | `topic/politics/PowerMatrix.astro` | politics |
| `orbital-shells` | `topic/space/OrbitalShells.astro` | space |
| `orbit-trace` | `topic/space/OrbitTrace.astro` | space |
| `launch-stats` | `topic/space/LaunchStats.astro` | space |
| `elevation-profile` | `topic/earth/ElevationProfile.astro` | earth |
| `region-map` | `topic/earth/RegionMap.astro` | earth |
| `climate-strip` | `topic/earth/ClimateStrip.astro` (v2 kit `.cs`, inside `.px-viz`) | earth |
| `carbon-gauge` | `topic/earth/CarbonGauge.astro` | earth |
| `commit-grid` | `topic/tech/CommitGrid.astro` | tech |
| `benchmark-chart` | `topic/tech/BenchmarkChart.astro` | tech |
| `adoption-curve` | `topic/tech/AdoptionCurve.astro` | tech |
| `journey-map` | `topic/travel/JourneyMap.astro` | travel |
| `route-card` | `topic/travel/RouteCard.astro` | travel |
| `city-compare` | `topic/travel/CityCompare.astro` | travel |
| `match-stat-line` | `topic/sports/MatchStatLine.astro` | sports |
| `league-table` | `topic/sports/LeagueTable.astro` | sports |
| `player-radar` | `topic/sports/PlayerRadar.astro` | sports |

Topic-scoped components are tinted via the topic's theme tokens (`--accent`,
`--ink`, etc.). They render under any `data-topic` but look most "at home"
in their parent topic.

**v2 data-viz note (2026-06-03).** Most topic charts plus the shared
`timeline` and `paradox` kinds were rewritten to the v2 kit's exact markup
and animations, and now emit the kit's *generic* data-viz class names
(`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside the
shared elevated `.px-viz` card (CSS in `src/styles/dataviz-v2.css`). This is
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
`caption?` + `source?` like the other viz, and all render a static
SVG/HTML fallback by default.

| Kind | Component | Topic | Tech |
|---|---|---|---|
| `coalition-orbit` | `topic/politics/CoalitionOrbit.astro` | politics | **WebGL** |
| `swing-dial` | `topic/politics/SwingDial.astro` | politics | CSS-3D |
| `bill-passage` | `topic/politics/BillPassage.astro` | politics | CSS-3D |
| `vote-flow` | `topic/politics/VoteFlow.astro` | politics | SVG/CSS-3D |
| `margin-ladder` | `topic/politics/MarginLadder.astro` | politics | SVG/CSS-3D |
| `chamber` | `topic/politics/Chamber.astro` | politics | **WebGL** (FLAGSHIP — instanced hemicycle + division walk; shared math `scripts/viz3d/hemicycle.ts`) |
| `power-flow` | `topic/politics/PowerFlow.astro` | politics | SVG (build-time Sankey + flowDash) |
| `coalition-calculus` | `topic/politics/CoalitionCalculus.astro` | politics | HTML-interactive (coalition builder vs the majority line) — **spread dispatch, see below** |
| `gerrymander-lens` | `topic/politics/GerrymanderLens.astro` | politics | SVG (same votes, three maps, efficiency-gap counters) |
| `ballot-flow` | `topic/politics/BallotFlow.astro` | politics | SVG (ranked-choice round transfers, flowDash) |
| `orbit-globe` | `topic/space/OrbitGlobe.astro` | space | **WebGL** |
| `solar-system` | `topic/space/SolarSystem.astro` | space | **WebGL** (FLAGSHIP — Keplerian; shared math `scripts/viz3d/kepler.ts`) |
| `trajectory-arc` | `topic/space/TrajectoryArc.astro` | space | SVG/CSS-3D |
| `delta-v-ladder` | `topic/space/DeltaVLadder.astro` | space | SVG/CSS-3D |
| `signal-readout` | `topic/space/SignalReadout.astro` | space | SVG/canvas |
| `descent-profile` | `topic/space/DescentProfile.astro` | space | SVG |
| `constellation-swarm` | `topic/space/ConstellationSwarm.astro` | space | **WebGL** (instanced mega-constellation shells) |
| `lagrange-map` | `topic/space/LagrangeMap.astro` | space | SVG (three-body effective-potential contour field) |
| `transfer-window` | `topic/space/TransferWindow.astro` | space | SVG interactive (Hohmann Δv + phase scrubber) |
| `eclipse-cone` | `topic/space/EclipseCone.astro` | space | SVG/CSS-3D (umbra/penumbra to scale) |
| `data-globe` | `topic/earth/DataGlobe.astro` | earth | **WebGL** |
| `core-sample` | `topic/earth/CoreSample.astro` | earth | CSS-3D |
| `sea-level-tank` | `topic/earth/SeaLevelTank.astro` | earth | CSS-3D/SVG |
| `climate-spiral` | `topic/earth/ClimateSpiral.astro` | earth | SVG/canvas |
| `quake-depth` | `topic/earth/QuakeDepth.astro` | earth | SVG |
| `terrain-relief` | `topic/earth/TerrainRelief.astro` | earth | **WebGL** (FLAGSHIP — real DEM ridgeline/contour; shared math `scripts/viz3d/terrain.ts`) |
| `plate-motion` | `topic/earth/PlateMotion.astro` | earth | **WebGL** (plate velocity field from Euler poles; data `public/geo/plates.json`) |
| `atmosphere-column` | `topic/earth/AtmosphereColumn.astro` | earth | SVG (barometric column to true altitude) |
| `carbon-loop` | `topic/earth/CarbonLoop.astro` | earth | SVG (stock-and-flow cycle, conservation-checked at build time) |
| `storm-track` | `topic/earth/StormTrack.astro` | earth | **WebGL** (cyclone best-track on the globe, Saffir–Simpson) |
| `arch-stack` | `topic/tech/ArchStack.astro` | tech | CSS-3D |
| `latency-waterfall` | `topic/tech/LatencyWaterfall.astro` | tech | SVG |
| `version-graph` | `topic/tech/VersionGraph.astro` | tech | SVG |
| `scaling-plot` | `topic/tech/ScalingPlot.astro` | tech | SVG |
| `throughput-dial` | `topic/tech/ThroughputDial.astro` | tech | SVG/CSS-3D |
| `neural-flow` | `topic/tech/NeuralFlow.astro` | tech | **WebGL** (FLAGSHIP — instanced forward-pass activation wave; shared math `scripts/viz3d/neural.ts`) |
| `packet-trace` | `topic/tech/PacketTrace.astro` | tech | **WebGL** globe + SVG latency budget (light floor vs measured RTT; shared math `scripts/viz3d/packet.ts`) |
| `queue-cliff` | `topic/tech/QueueCliff.astro` | tech | SVG interactive (M/M/1 utilization cliff, 1/(1−ρ)) |
| `chip-die` | `topic/tech/ChipDie.astro` | tech | CSS-3D (exploded die floorplan, area ∝ real mm²) |
| `moore-ladder` | `topic/tech/MooreLadder.astro` | tech | SVG (base-2 log doubling fit) |
| `route-globe` | `topic/travel/RouteGlobe.astro` | travel | **WebGL** |
| `elevation-trek` | `topic/travel/ElevationTrek.astro` | travel | SVG/CSS-3D |
| `itinerary-reel` | `topic/travel/ItineraryReel.astro` | travel | CSS-3D |
| `climate-calendar` | `topic/travel/ClimateCalendar.astro` | travel | SVG |
| `timezone-arc` | `topic/travel/TimezoneArc.astro` | travel | SVG/CSS-3D |
| `terminator-globe` | `topic/travel/TerminatorGlobe.astro` | travel | **WebGL** (FLAGSHIP — day/night line + flight arc; shared math `scripts/viz3d/terminator.ts`) |
| `city-grid` | `topic/travel/CityGrid.astro` | travel | SVG (street-orientation polar histograms) — **hard-throws outside 1–3 cities, see below** |
| `altitude-oxygen` | `topic/travel/AltitudeOxygen.astro` | travel | SVG (altitude vs breathable oxygen + landmarks) |
| `season-wheel` | `topic/travel/SeasonWheel.astro` | travel | SVG (radial climate year) |
| `fare-terrain` | `topic/travel/FareTerrain.astro` | travel | SVG (fare/price ridgeline across dates or routes) |
| `tactics-pitch` | `topic/sports/TacticsPitch.astro` | sports | CSS-3D/SVG |
| `shot-map` | `topic/sports/ShotMap.astro` | sports | SVG |
| `xg-race` | `topic/sports/XgRace.astro` | sports | SVG |
| `momentum-wave` | `topic/sports/MomentumWave.astro` | sports | SVG |
| `player-card` | `topic/sports/PlayerCard.astro` | sports | CSS-3D flip |
| `flight-of-the-ball` | `topic/sports/FlightOfTheBall.astro` | sports | **WebGL** (FLAGSHIP — drag + Magnus trajectory; shared math `scripts/viz3d/ballistics.ts`) |
| `elo-river` | `topic/sports/EloRiver.astro` | sports | SVG (rating streamgraph, braided season) |
| `court-value` | `topic/sports/CourtValue.astro` | sports | SVG (value surface shaded over a pitch/court) |
| `pace-ridge` | `topic/sports/PaceRidge.astro` | sports | SVG (ridgeline of a stat's distribution per group) |

The **fourteen** WebGL kinds (`coalition-orbit`, `chamber`, `orbit-globe`,
`solar-system`, `constellation-swarm`, `data-globe`, `terrain-relief`,
`plate-motion`, `storm-track`, `neural-flow`, `packet-trace`, `route-globe`,
`terminator-globe`, `flight-of-the-ball`) are the only section kinds that load
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
  `carbon-loop`, `chip-die`, `moore-ladder`, `gerrymander-lens`, `ballot-flow`
  and `packet-trace` also validate and throw. `power-flow`'s conservation check
  is the same pattern (§ change log 2026-07-05).
- **`section.plain` is capped at 220 chars by Zod.** Overshooting breaks the
  build. It explains the *form* of the viz, never the data.

---

## 3. Adding a new section kind — checklist

A new component touches **nine** places (2026-07-05: +explainer, +catalog;
2026-07-14: +scene registry for WebGL, +worked showcase example — the two the
breadth pass kept catching).
Miss one and the build either fails, silently renders nothing, or fails
`npm run check:catalog` — which enforces a 1:1, same-order match between
`SECTION_KINDS` and the catalog blocks (90 ↔ 90 today). Note that
`check:catalog` is a **manual** gate: `npm run build` runs only
`design-sync.mjs --check`, so run the catalog check yourself after adding a
kind. Item 8 (the scene registry) applies to WebGL kinds only; the other
eight apply to every kind.

1. **Add the kind name** to `SECTION_KINDS` in `src/content/config.ts`.
2. **Create the component** at `src/components/<scope>/<Name>.astro` (scope
   = `core/` or `topic/<topic>/`).
3. **Dispatch the kind** in `src/components/SectionBody.astro` (NOT
   SectionRenderer — that's the chrome shell):
   ```astro
   {section.kind === 'new-kind' && <NewComponent ...data props... />}
   ```
4. **Add CSS** in the correct theme file (`src/styles/themes/<topic>.css`),
   `base.css` if universal, or a scoped `<style>` (v2-library pattern).
5. **Add the EXPLAIN entry** in `src/lib/explainers.ts` (what/how — feeds the
   in-flow "In plain terms" line AND the expand modal; blueprint §9 wording).
6. **Add the catalog block** in `docs/design/catalog.md` (same order as
   SECTION_KINDS — `npm run check:catalog` fails otherwise).
7. **Document it here** — add a row to §2 and any non-obvious rule. New v2
   kinds also need a blueprint (`docs/design/blueprints/<world>/<kind>.md`).
8. **WebGL kinds only** — register the scene in
   `src/scripts/viz3d/scenes/index.ts` (`'<kind>': { load: () => import('./<scene>') }`).
   Omit this and the mount renders its static fallback forever, silently.
9. **Add a worked section** to that world's `2026-06-03-<world>-showcase`
   issue, so the kind has a live example to look at.

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
  shell hooks `.px-viz__cap` / `.px-viz__src`) — defined in
  `src/styles/dataviz-v2.css`. These are intentional adoptions, **not**
  collisions: the kit's animation/reveal CSS is tightly coupled to them.

Known reservations (still-live `px-` prefixes):

| Prefix | Owner | Notes |
|---|---|---|
| `px-viz` | shared elevated data-viz card (`base.css`) | wraps every ported chart; `data-reveal` root |
| `px-fin` | `finish-interval` | sports · `FinishInterval.astro` |
| `px-waf` | `attrition-waffle` | travel · `AttritionWaffle.astro` |
| `px-stl` | `state-timeline` | tech · `StateTimeline.astro` |
| `px-mgb` | `margin-bullets` | space · `MarginBullets.astro` |
| `px-pyr` | `age-pyramid` | politics · `AgePyramid.astro` |
| `px-fnl` | `bill-funnel` | politics · HTML bars · `BillFunnel.astro` |
| `px-trn` | `channel-ternary` | sports · SVG ternary · `ChannelTernary.astro` |
| `px-strip` | TopicStrip (in `meta.css`, `display: flex`) | DO NOT reuse |
| `px-cgauge` | CarbonGauge | kept on `px-` (free-standing gauge, light-touch port) |
| `px-seats` | SeatChart | kept on `px-` |
| `px-bills` | BillBreakdown | kept on `px-` |
| `px-analogy` | BrothersAnalogy | kept on `px-` |
| `px-msl` | MatchStatLine | kept on `px-` |
| `px-primer` | Primer | |
| `px-prose-full` / `px-skim-caption-block` | skim-mode wrappers (now emitted by `SectionRenderer.astro`) | |
| `px-plain` | the "In plain terms" line (`core/Section.astro`; CSS in `viz-type.css`) | |
| `px-act` | ActBreak chapter divider (scoped in `core/ActBreak.astro`) | |
| `px-acct` | AccountEntry masthead slot (scoped in `core/AccountEntry.astro`) | |
| `px-hlens` | home hero (scoped in `home/HeroLens.astro`) — carries the ONE sanctioned cursor-parallax (HOME-SPEC §2) | |
| `px-wire` | home wire strip (scoped in `home/WireStrip.astro`) | |
| `px-fplate` | home featured plate (scoped in `home/FeaturedPlate.astro`) | |
| `px-wb` | WelcomeBack post-auth toast (scoped in `core/WelcomeBack.astro`) | mounted in `[slug].astro`; fires on `?welcome=1` |
| `px-nnote` | NewsletterNotice home ribbon (scoped in `core/NewsletterNotice.astro`) | mounted above `<Masthead>` in `index.astro`; fires on `/?newsletter=confirmed` |
| `pxs-` | story mode (`/s/` — `src/styles/story.css` + `components/story/*`) | `story/StoryCard.astro` composes `SectionBody` **except** for `kind: 'prose'`, which it skips entirely and renders as a pure-text card (`.pxs-card--text`) |
| `pol-` / `ear-` / `trv-` | light-world motif kits (ends of `themes/{politics,earth,travel}.css` — review R5) | |

Retired prefixes (the v2 data-viz port replaced these with the kit's generic
class above; the old per-component CSS in the theme files is now **inert dead
code** — no element emits it — pending a future safe cleanup pass):

| Retired prefix | Was | Now emits |
|---|---|---|
| `px-cstrip` | ClimateStrip | `.cs` |
| `px-ortrace` | OrbitTrace | `.ot` |
| `px-launch` | LaunchStats | `.ls` |
| `px-bench` | BenchmarkChart | `.bc` |
| `px-scurve` | AdoptionCurve | `.adc` |
| `px-route` | RouteCard | `.rc` |
| `px-ccomp` | CityCompare | `.cc` |
| `px-ltab` | LeagueTable | `.lt` |
| `px-radar` | PlayerRadar | `.pr` |
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
| `px-co` | CoalitionOrbit | `px-dg` | DataGlobe |
| `px-swdial` | SwingDial | `px-core` | CoreSample |
| `px-billp` | BillPassage | `px-sltank` | SeaLevelTank |
| `px-vflow` | VoteFlow | `px-spiral` | ClimateSpiral |
| `px-mladr` | MarginLadder | `px-quake` | QuakeDepth |
| `px-og` | OrbitGlobe | `px-arch` | ArchStack |
| `px-traj` | TrajectoryArc | `px-lwf` | LatencyWaterfall |
| `px-dvl` | DeltaVLadder | `px-vgraph` | VersionGraph |
| `px-sig` | SignalReadout | `px-scale` | ScalingPlot |
| `px-desc` | DescentProfile | `px-tdial` | ThroughputDial |
| `px-rg` | RouteGlobe | `px-pitch` | TacticsPitch |
| `px-etrek` | ElevationTrek | `px-shot` | ShotMap |
| `px-ireel` | ItineraryReel | `px-xgr` | XgRace |
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
| `px-bflow` | BallotFlow (politics) | `px-die` | ChipDie (tech) |
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
  `style="font-family:'Fraunces',Georgia,serif"` — *not* the
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
| `core/Hero.astro` | inline in `src/pages/issues/[slug].astro` |
| `core/Primer.astro` | inline in `src/pages/issues/[slug].astro` |
| `core/ReadingToolbar.astro` | inline at the bottom of `[slug].astro` (floating glass pill: reading-progress bar + Full/Skim toggle + live % + read time + Save). Replaced the old `.px-reader-controls` row. |
| `core/SaveButton.astro` | **inside `core/ReadingToolbar.astro`** — not mounted on the issue page directly. Signed-out label is "Save to your shelf" and the signed-out click carries `&world=<data-topic>` into the login URL (world-tinted auth plate); a first-save "On your shelf →" microline flashes once and fades after 4s; the loading pulse is reduced-motion-gated. |
| `core/ReadingTracker.astro` | inline in `[slug].astro`, invisible sentinel |
| `core/AnnotationLayer.astro` | inline in `[slug].astro`, between article and ReactionsBar |
| `core/ReactionsBar.astro` | inline in `[slug].astro`, after AnnotationLayer |
| `core/LettersBlock.astro` | inline in `[slug].astro`, after ReactionsBar |
| `core/NewsletterForm.astro` | rendered by `core/Colophon.astro` (and by `home/SubscribeStrip.astro` on the home page) — the **single** source every mount embeds (SubscribeStrip / Colophon / Footer / BeatJoin), so a change here covers all of them. POSTs to the app's `/api/join` (repointed from `/api/subscribe` on 2026-07-14) and handles the degraded `{ok:true, account:false}` response. **No-JS-gated:** the form is hidden behind `html:not(.js)` with an "Enable JavaScript to subscribe." line, because a no-JS submit used to do a native GET that put the reader's email in the URL, history and server logs. |
| `core/Masthead.astro` | in `IssueLayout.astro` and `HomeLayout.astro` |
| `core/Banner.astro` | inline in `[slug].astro` (per-issue standing plate; carries the per-world register readout — telemetry orbit / atlas coords / build hash / vol-no / matchday — that the unified masthead no longer shows) |
| `core/ReadingGate.astro` | inline in `[slug].astro` — metered soft signup wall. Anonymous readers get primer + first 2 sections, then a per-topic-themed "Create a free account to finish" wall hiding the rest; signed-in (cookie heuristic) ⇒ full issue. No-JS / crawlers ⇒ gate hidden, full article renders (SEO-safe). `px-gate`. |
| `core/WelcomeBack.astro` | inline at the end of `[slug].astro`, after `ReadingToolbar` — top-centre glass toast fired by `?welcome=1` (the return leg from the app's `/welcome`). Reads sessionStorage `px_resume` (written by `ReadingGate`) and offers "Continue where you left off ↓"; strips the param via `history.replaceState`; 8s auto-dismiss that **pauses on hover/focus** so keyboard/AT users don't lose the resume control. `[hidden]` by default ⇒ no-JS shows nothing. `px-wb`. |
| `core/NewsletterNotice.astro` | inline in `index.astro`, **above `<Masthead>`** — in-flow ribbon fired by `/?newsletter=confirmed`. Occupies no space until revealed, so no-JS / crawlers see nothing. Dismissible; cleans the URL. `px-nnote`. |
| `core/Sources.astro` | inline in `src/pages/issues/[slug].astro`, footer |
| `core/Colophon.astro` | in both layouts (editorial footer; replaced `core/Footer.astro`) |
| `core/Reveal.astro` | both layouts, after content — scroll-reveal island (adds `.is-in` to `[data-reveal]`) |
| `core/VizMotion.astro` | both layouts, after content — count-up + cursor-warmth island (`[data-countup]` / `[data-warmth]`) |
| `core/Viz3DRuntime.astro` | `IssueLayout.astro`, once per issue — bundled module `<script>` that lazy-boots the WebGL runtime (`scripts/viz3d/`) when a `[data-viz3d]` mount scrolls in (§10) |
| `core/Tilt.astro` | `IssueLayout.astro`, once per issue — vanilla island driving the CSS-3D `[data-tilt]` pointer-tilt + `[data-flip-btn]` flip (§10) |
| `core/ExpandModal.astro` | `IssueLayout.astro`, once per issue — in-page lightbox. Adds a ⤢ button to every viz card (`.px-viz` / `.vb` / `.tl` / `.tel`) and **portals the live node** into a modal (placeholder holds the page slot, scroll preserved); fires `resize` so WebGL re-fits. `styles/modal.css`. |
| `intro/IntroStory.astro` | `welcome.astro` (and inside `IntroExperience`) — the 5-scene "The Second Angle" onboarding player. Vanilla `is:inline` player (auto/manual, prev/next/dots/skip/keyboard); no-JS scenes stack + scroll. `px-intro`. |
| `intro/IntroExperience.astro` | `index.astro`, once — home first-visit overlay. Auto-plays the story, then an optional spotlight tour of the real home. Gated by localStorage `px_intro_seen_v1`; `?intro=1` force-replays; `[hidden]` by default (no-JS shows nothing). `px-xp`. |
| `intro/WorldViz.astro` | inside `IntroStory` — per-category mini data-viz on the six worlds cards (vote split / orbit / stripes / commit grid / route / momentum wave) |
| `home/*` | in home + topic-index templates |
| `topic/<topic>/<Topic>Index.astro` | dispatched from `src/pages/topics/[topic].astro` |

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
| `px-col` | Colophon (editorial footer, replaces Footer in both layouts — v2 `.col` port) |
| `px-intro` | "The Second Angle" onboarding (scenes/player/controls, in `intro.css`) |
| `px-xp` | home first-visit overlay + spotlight tour (`IntroExperience`, in `intro.css`) |
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

**Orphaned/retired (2026-06-21).** An earlier "issue-like" onboarding pass is
superseded by `intro/`: the `welcome/Beat*.astro` set and most of `welcome/`
are now unused. (`intro/` itself holds only `IntroExperience`, `IntroStory` and
`WorldViz` — an earlier `RegistrationMark.astro` was deleted, not merely
orphaned.) `welcome.css`
survives only for `AccountLine` (`px-wj-join`, used on home + welcome) and the
About `px-abt` / `px-wj-reg` bits.

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
  shared shell hooks `.px-viz__cap` (caption) and `.px-viz__src` (source
  line). All CSS lives in the new `src/styles/dataviz-v2.css`, imported
  **last** in both `IssueLayout.astro` and `HomeLayout.astro`.

**Components fully ported** (rewritten to the kit's markup + animations —
stroke-draw lines, grow bars, scale-pop polygon, count-up tiles, the
44-column MP-dot vote chamber, scan sweep — and wrapped in the shared
elevated `.px-viz` card):

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
| ClimateStrip | `.cs` |
| BenchmarkChart | `.bc` |
| AdoptionCurve | `.adc` |
| RouteCard | `.rc` |
| CityCompare | `.cc` |
| LeagueTable | `.lt` |
| PlayerRadar | `.pr` |

Charts wrap in the shared `.px-viz` card tagged `data-reveal`; the vote bar
(`.vb`), timeline (`.tl`), and telemetry (`.tel`) are standalone `data-reveal`
roots.

**Components kept on their `px-` classes** (light-touch port — only gained a
card-level `data-reveal` scroll-in): SeatChart (`.px-seats`), BillBreakdown
(`.px-bills`), BrothersAnalogy (`.px-analogy`), OrbitalShells, CarbonGauge
(`.px-cgauge`), ElevationProfile, RegionMap (free-standing cartographic SVG),
CommitGrid, JourneyMap, MatchStatLine (`.px-msl`).

**The reveal + motion contract (no-JS / print safe)**

- Scroll reveals are driven by `core/Reveal.astro` (an `is:inline` island
  that adds `.is-in` to every `[data-reveal]` via IntersectionObserver).
- **Every reveal-hidden state is gated behind an `html.js` class** set by a
  one-line inline `<head>` guard. No JS ⇒ no `.js` class ⇒ content paints in
  its final revealed state. Print does the same. Matching
  `prefers-reduced-motion` resets live in `dataviz-v2.css` (and
  `motion-v2.css` for chrome).
- Count-up + cursor-warmth ship as `core/VizMotion.astro`: `[data-countup]`
  tweens to the final value **already present in the HTML** (so no-JS shows
  the real number), and `[data-warmth]` tracks the pointer for the warmth
  radial.

**Inert dead-CSS follow-up.** The old per-component viz CSS in the theme
files (`.px-vote*`, `.px-appr*`, `.px-pwm*`, `.px-paradox*`, `.px-timeline*`,
and the old orbit/launch/climate/bench/scurve/route/citycompare/ltab/radar
blocks) plus the `.px-skim-toggle` / `.px-skim-btn` rules in `base.css` are
now **orphaned** — no element emits them. They are harmless (the new viz use
new class names, so there is no override conflict) but should be removed in a
future safe cleanup pass.

---

## 10. 3D / interactive component library (2026-06-03, current at 2026-07-14)

The 59 v2 interactive kinds (§2 block) split into implementation families.
All honour one shared no-JS / `prefers-reduced-motion` contract: **every
component renders a static SVG/HTML fallback by default, and interactivity is
layered on top only when JS runs and motion is allowed.** This is the same
contract as `core/Reveal.astro` / `core/VizMotion.astro` and the v2 data-viz
(§9).

### Family A — lazy WebGL scenes (Three.js): 14 kinds

`coalition-orbit`, `chamber`, `orbit-globe`, `solar-system`,
`constellation-swarm`, `data-globe`, `terrain-relief`, `plate-motion`,
`storm-track`, `neural-flow`, `packet-trace`, `route-globe`,
`terminator-globe`, `flight-of-the-ball`. These are the **only** parts of the
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

Kinds: `swing-dial`, `bill-passage`, `margin-ladder`, `core-sample`,
`arch-stack`, `chip-die`, `throughput-dial`, `itinerary-reel`, `player-card`,
plus the SVG/CSS-3D hybrids (`trajectory-arc`, `delta-v-ladder`,
`eclipse-cone`, `sea-level-tank`, `elevation-trek`, `timezone-arc`,
`tactics-pitch`, `shot-map`).

### Family C — animated SVG / canvas: the largest family

Reveal-on-scroll line draws, bars, dials, contour fields and area fills — the
default for the breadth pass, which was SVG-first (`lagrange-map`,
`atmosphere-column`, `carbon-loop`, `moore-ladder`, `city-grid`,
`altitude-oxygen`, `season-wheel`, `fare-terrain`, `elo-river`, `court-value`,
`pace-ridge`, `gerrymander-lens`, `ballot-flow`, alongside the older
`latency-waterfall`, `climate-spiral`, `momentum-wave`, `xg-race`). These
follow the §9 reveal contract: hidden states are **`html.js`-gated** (no JS ⇒
final painted state) and reduced-motion resets to the final frame.

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

### Mobile chart legibility — an honest open residual

The 2026-07-14 responsive pass fixed the one reproducible 375px overflow —
data tables. In `dataviz-v2.css` (tail, `@media (max-width: 640px)`), `.lt`
and `[class$="__table"]` become `display: block; overflow-x: auto` so rows
scroll **within** their card; desktop is untouched (still `display: table`
above 640px). Safety nets: `.px-viz { max-width: 100% }`,
`.px-viz > * { min-width: 0 }`, `.px-ireel { overflow-x: clip }`.

**Not fixed:** in-SVG fine print still renders at roughly 3.4–7px at a 375px
viewport, because the SVG cards use a fixed `viewBox` with `width: 100%`.
There is no clean blanket fix — a blanket `min-width` breaks the tall-narrow
columns, discs and gauges. Today mobile legibility is carried by the **HTML**
layer (the plain line, caption, and legends/tables at real px) plus the ⤢
expand-modal study view. A per-component mobile-reflow round was scoped and
**not** done; it is the obvious next move if small-screen charts matter.

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

## Change log

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
