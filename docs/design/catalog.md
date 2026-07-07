# Parallax component catalog

> The single source of truth for WHAT TO USE WHEN. One `##` block per section
> kind, in `SECTION_KINDS` order (`src/content/config.ts`) — `npm run
> check:catalog` enforces the 1:1 match. Pipeline agents (drafter, stylist,
> researcher) read this file; humans too. Deep specs live in
> `docs/design/blueprints/<world>/<kind>.md` where one exists.
>
> Block grammar: USE WHEN (dossier conditions) · DON'T USE (and what instead) ·
> DATA (shape sketch) · PLAIN (the "in plain terms" template explaining the FORM)
> · NOTES (layout pairing, world, tier, component path, blueprint link).
>
> STATUS (2026-07-06): covers the 64 kinds registered in `SECTION_KINDS`
> (61 originals + the 3 flagships solar-system/chamber/power-flow). The **26
> next-generation kinds have full blueprints** under `docs/design/blueprints/`
> (all authored + adversarially verified) but are NOT yet in `SECTION_KINDS` or
> this catalog — their catalog blocks + registry entries land at P6 when each
> component is implemented (see each blueprint's footer). Adding a block here
> without the matching `SECTION_KINDS` entry breaks `npm run check:catalog`, so
> the two move together, per component.

## hero
- **World/Tier:** universal · narrative · rendered inline in `src/pages/issues/[slug].astro` (via `src/components/core/Hero.astro`)
- **USE WHEN:** always — every issue opens with exactly one `hero` section at position 0, carrying the section-level `eyebrow`/`title`/`intro`.
- **DON'T USE:** anywhere after the opening; never a second hero in an issue.
- **DATA:** none — the hero uses the section's `eyebrow`/`title`/`intro` plus issue frontmatter (`dek`, `readTimeMinutes`, `publishedAt`; `author` only if set).
- **PLAIN:** — (narrative kind; no plain line)
- **NOTES:** renders inline in `[slug].astro`, NOT via `SectionRenderer.astro`; one per issue, first section.

## act-break
- **World/Tier:** universal · narrative divider · `src/components/core/ActBreak.astro`
- **USE WHEN:** opening a new act of the issue (CANON.md §3: 2–4 acts, each 2–4 sections) — the argument shifts register or scene.
- **DON'T USE:** as decoration between every section; an act break must mark a real structural pivot.
- **DATA:** `{ act: 'II', title?, epigraph? }`
- **PLAIN:** — (narrative kind; no plain line)
- **NOTES:** consumes NO section number (numbering skips it); ghost Roman numeral + rule + optional Fraunces title + italic epigraph; it is air — generous margins are the point.

## timeline
- **World/Tier:** universal (politics-styled) · v2 kit `.tl` · `src/components/topic/politics/Timeline.astro`
- **USE WHEN:** a dated sequence where order and turning points carry the argument — the dossier has 4+ dated events with one or two hinge moments.
- **DON'T USE:** a bill's procedural stages (→ `bill-passage`); un-dated steps of a mechanism (→ `beat-sheet`).
- **DATA:** `{ events: [{date, label (**bold** ok), note, state?: 'default'|'key'|'fail'|'now'}] }`
- **PLAIN:** "Events stacked in time order down a spine; the highlighted nodes are the turning points."
- **NOTES:** politics-styled but used across all worlds; standalone `data-reveal` root.

## bill-breakdown
- **World/Tier:** politics · classic card stack (`.px-bills`) · `src/components/topic/politics/BillBreakdown.astro`
- **USE WHEN:** decomposing what a bill/policy package actually contains — provisions as cards, one flagged as the key payload.
- **DON'T USE:** the bill's journey through readings/houses (→ `bill-passage`); a straight two-way contrast (→ `comparison`).
- **DATA:** `{ cards: [{label, title, body, bullets?, primary?: true}] }`
- **PLAIN:** "Each card is one provision of the package; the highlighted card is the payload the rest is wrapped around."
- **NOTES:** politics world; pairs well after a `timeline` showing how the package arrived.

## vote-result
- **World/Tier:** politics · v2 kit `.vb` (MP-dot chamber) · `src/components/topic/politics/VoteResult.astro`
- **USE WHEN:** one decisive vote against a threshold — dossier has for/against/required numbers and the shortfall is the story.
- **DON'T USE:** blocs splitting into positions (→ `vote-flow`); many races/margins at once (→ `margin-ladder`).
- **DATA:** `{ for, against, required, present, shortfall, label, stamp, followup }`
- **PLAIN:** "Every dot is one vote in the chamber; the line across it is the threshold the count had to clear."
- **NOTES:** politics signature; hero-capable; standalone `data-reveal` root with count-up numerals.

## seat-chart
- **World/Tier:** politics · classic table (`.px-seats`) · `src/components/topic/politics/SeatChart.astro`
- **USE WHEN:** seat counts per party/state with current numbers and a change column — a redistribution/shift story.
- **DON'T USE:** whole-chamber composition by bloc (→ `coalition-orbit`); a single vote (→ `vote-result`).
- **DATA:** `{ subtitle, source, rows: [{name, region, current, change}], quote: {text, attribution} }`
- **PLAIN:** "Rows of seat counts where the change column does the arguing; the closing quote anchors what the shift means."
- **NOTES:** politics world; the built-in quote slot replaces a separate `quote` section.

## comparison
- **World/Tier:** universal · core · `src/components/core/Comparison.astro`
- **USE WHEN:** two or three peer entities compared attribute by attribute (systems, bills, eras) — read-across rows matter.
- **DON'T USE:** two cities' travel stats (→ `city-compare`); a contradiction where the tension is the point (→ `paradox`).
- **DATA:** `{ columns: [{label, items: [string | {text, strong?: true}]}] }`
- **PLAIN:** "Parallel columns, one per thing compared; read across a row to see the same attribute side by side."
- **NOTES:** universal; 2–3 columns only.

## paradox
- **World/Tier:** universal (politics-styled) · v2 kit `.px2` · `src/components/topic/politics/Paradox.astro`
- **USE WHEN:** two facts that are both true and pull in opposite directions — the tension IS the section's claim.
- **DON'T USE:** a plain A-vs-B feature comparison (→ `comparison`); a contradiction the prose resolves immediately (→ `prose`).
- **DATA:** `{ sides: [{label, statement (*italic* ok), detail}] }`
- **PLAIN:** "Two statements face each other; both are true, and the gap between them is what the section is about."
- **NOTES:** politics-styled but used across worlds; one per issue is usually enough.

## analogy
- **World/Tier:** politics · bespoke device (`.px-analogy`) · `src/components/topic/politics/BrothersAnalogy.astro`
- **USE WHEN:** an allocation/apportionment rule explained through named household characters (the delimitation "brothers" device).
- **DON'T USE:** general side-by-side contrast (→ `comparison`); any analogy that isn't a person-for-entity mapping — the component is shaped for the brothers device.
- **DATA:** `{ headline, brothers: [{code, role, desc, kids}], punchline }`
- **PLAIN:** "Each character stands in for a real actor; their household maths replays the real allocation rule at kitchen scale."
- **NOTES:** politics world; highly specific — reach for it rarely.

## quote
- **World/Tier:** universal · core · `src/components/core/Quote.astro`
- **USE WHEN:** one verified verbatim quote carries more weight than any chart — attribution known, wording exact from the dossier.
- **DON'T USE:** paraphrases or composite quotes (→ `prose` with attribution); a quote that only supports a table (→ `seat-chart`'s quote slot).
- **DATA:** `{ quote, attribution, followup }`
- **PLAIN:** — (narrative kind; no plain line)
- **NOTES:** quiet section (act rhythm); verbatim only.

## beat-sheet
- **World/Tier:** universal · core · `src/components/core/BeatSheet.astro`
- **USE WHEN:** a mechanism or episode compressed into ordered beats with time markers — the "how it unfolds" spine.
- **DON'T USE:** date-anchored history (→ `timeline`); beats that are just paragraph topic sentences (→ `prose`).
- **DATA:** `{ beats: [{time, label, description}] }`
- **PLAIN:** — (narrative kind; no plain line)
- **NOTES:** quiet section (act rhythm).

## prose
- **World/Tier:** universal · core · `src/components/core/Prose.astro`
- **USE WHEN:** the argument itself — connective narrative between structural sections; the issue's voice lives here.
- **DON'T USE:** to narrate data a viz already shows; to smuggle in a list (→ a structured kind).
- **DATA:** `{ paragraphs: [string] }` or `{ lead, paragraphs: [string] }`
- **PLAIN:** — (narrative kind; no plain line)
- **NOTES:** quiet section (act rhythm); the ONLY kind that reads `skimCaption` — in skim mode the prose hides and the caption shows.

## data-readout
- **World/Tier:** universal · v2 kit `.tel` (telemetry tiles) · `src/components/core/DataReadout.astro`
- **USE WHEN:** 3–6 headline numbers that set scale before the argument — values with short labels, one worth accenting.
- **DON'T USE:** a series over time (→ the world's time-series kind); ranked values needing bars (→ `benchmark-chart`).
- **DATA:** `{ tiles: [{value, label, note?, accent?: true}] }`
- **PLAIN:** "A grid of instrument tiles; each shows one number and its label, and the accented tile is the headline reading."
- **NOTES:** standalone `data-reveal` root; count-up tweens to the values already in the HTML.

## orbital-shells
- **World/Tier:** space · classic SVG diagram · `src/components/topic/space/OrbitalShells.astro`
- **USE WHEN:** comparing the occupancy/character of altitude bands (LEO/MEO/GEO) — density, operators, debris persistence per shell.
- **DON'T USE:** a handful of named orbits (→ `orbit-trace`); a 3-D population view (→ `orbit-globe`).
- **DATA:** `{ shells: [{altitude, band?, density, operators, persistence, flag?}] }`
- **PLAIN:** "Concentric bands above Earth, one per altitude shell; each band's annotation says what lives there and how long it stays."
- **NOTES:** space signature; hero-capable.

## commit-grid
- **World/Tier:** tech · classic activity grid · `src/components/topic/tech/CommitGrid.astro`
- **USE WHEN:** activity intensity over weeks — a contribution-graph-style density story (commits, releases, incidents).
- **DON'T USE:** precise values over time (→ `scaling-plot`); adoption share (→ `adoption-curve`).
- **DATA:** `{ weeks: Day[][] (Day = {level: 0|1|2|3|4, label?}), months?, weekdays?, meta? }`
- **PLAIN:** "A calendar of squares, one per day; the darker the square, the more happened that day."
- **NOTES:** tech signature; hero-capable.

## journey-map
- **World/Tier:** travel · classic route diagram · `src/components/topic/travel/JourneyMap.astro`
- **USE WHEN:** a route as a sequence of named stops with distance/elevation/notes — the journey's texture is the structure.
- **DON'T USE:** leg-by-leg transport logistics (→ `route-card`); day-by-day plans (→ `itinerary-reel`); a globe-scale arc (→ `route-globe`).
- **DATA:** `{ stops: [{place, region?, km?, elev?, arrival?, note?, tag?}] }`
- **PLAIN:** "Stops strung along a path in travel order; the annotations carry what changes between them."
- **NOTES:** travel signature; hero-capable.

## match-stat-line
- **World/Tier:** sports · classic stat sheet (`.px-msl`) · `src/components/topic/sports/MatchStatLine.astro`
- **USE WHEN:** one match told through its stat rows — home vs away across possession, shots, and the rest.
- **DON'T USE:** season-long standings (→ `league-table`); one player's profile (→ `player-radar` / `player-card`).
- **DATA:** `{ home: {name, score?, badge?, outcome?}, away: {name, score?, badge?, outcome?}, competition?, venue?, date?, rows: [{label, home, away, unit?, note?}] }`
- **PLAIN:** "A match-programme stat sheet; each row is one metric with the home and away values facing each other."
- **NOTES:** sports signature; hero-capable.

## elevation-profile
- **World/Tier:** earth · classic SVG cross-section · `src/components/topic/earth/ElevationProfile.astro`
- **USE WHEN:** vertical structure by labelled bands, each with a value (terrain zones, snowpack, aquifer depths).
- **DON'T USE:** a route's elevation along distance (→ `elevation-trek`, travel); strata down a core (→ `core-sample`).
- **DATA:** `{ bands: [{label, range, value, unit?, note?, flag?}], maxValue?, axisLabel? }`
- **PLAIN:** "A cross-section stacked by height; each band is one zone, sized by its value."
- **NOTES:** earth signature; hero-capable.

## region-map
- **World/Tier:** earth · classic cartographic SVG (d3-geo, Natural Earth 50m) · `src/components/topic/earth/RegionMap.astro`
- **USE WHEN:** a value shaded per country/zone on a flat world map — where something is, at region grain.
- **DON'T USE:** point values at exact coordinates (→ `data-globe`); anything that needs spinning to see (→ `data-globe`).
- **DATA:** `{ projection?, palette?, zones?: [{id, label?, value, note?}], markers?: [{lat, lng, label?, kind?}], legend?: {title?, low?, high?, none?} }`
- **PLAIN:** "A flat world map where each shaded region encodes its value; the legend gives the scale."
- **NOTES:** earth signature; hero-capable; free-standing cartographic SVG (kept its `px-` classes; SVG conventions in `src/components/AGENTS.md` §5).

## climate-strip
- **World/Tier:** earth · v2 kit `.cs` (warming stripes) · `src/components/topic/earth/ClimateStrip.astro`
- **USE WHEN:** one annual value per year over decades — a trend told as colour drift, not axis-reading.
- **DON'T USE:** monthly within-year cycles (→ `climate-spiral`); values the reader must read precisely (→ a charted kind).
- **DATA:** `{ values: [{year, value}], palette?, baseline?, unit?, showYears?, showLegend?, customMin?, customMax? }`
- **PLAIN:** "One thin stripe per year, coloured by its value; the drift of colour across the strip is the trend."
- **NOTES:** earth signature; hero-capable; emits the kit's `.cs` inside `.px-viz` — never the `px-strip` namespace (owned by TopicStrip).

## carbon-gauge
- **World/Tier:** earth · classic arc gauge (`.px-cgauge`) · `src/components/topic/earth/CarbonGauge.astro`
- **USE WHEN:** a budget with a used/remaining split — canonically the remaining carbon budget against a temperature target.
- **DON'T USE:** throughput/utilisation of a live system (→ `throughput-dial`, tech); several headline figures (→ `data-readout`).
- **DATA:** `{ remaining, remainingGt?, usedGt?, totalGt?, target?, year? }`
- **PLAIN:** "An arc filled by what's already spent; the unfilled remainder is the budget left before the target."
- **NOTES:** earth signature; hero-capable.

## approval-chart
- **World/Tier:** politics · v2 kit `.ac` · `src/components/topic/politics/ApprovalChart.astro`
- **USE WHEN:** approve vs disapprove over time for one subject — crossovers and widening gaps carry the story.
- **DON'T USE:** a single point-in-time swing or margin (→ `swing-dial`); non-opinion series (→ the world's chart kind).
- **DATA:** `{ points: [{date, approve, disapprove}], subject? }`
- **PLAIN:** "Two lines over time, approval and disapproval; where they cross or split is the event."
- **NOTES:** politics signature; hero-capable; stroke-draw reveal.

## power-matrix
- **World/Tier:** politics · v2 kit `.pm` · `src/components/topic/politics/PowerMatrix.astro`
- **USE WHEN:** who controls what — institutions crossed with parties, each cell a control state.
- **DON'T USE:** seat arithmetic (→ `seat-chart` / `coalition-orbit`); control changing over time (→ `timeline`).
- **DATA:** `{ institutions: [string], parties: [{id, label, color?}], cells: [{institution, party, control: 'full'|'partial'|'none'|'contested'}] }`
- **PLAIN:** "A grid of institutions against parties; each cell's fill shows who holds that lever and how firmly."
- **NOTES:** politics signature; hero-capable.

## orbit-trace
- **World/Tier:** space · v2 kit `.ot` · `src/components/topic/space/OrbitTrace.astro`
- **USE WHEN:** a handful of NAMED orbits compared by altitude/inclination on a flat diagram — labels matter more than spectacle.
- **DON'T USE:** whole-population shells in 3-D (→ `orbit-globe`); band-occupancy comparison (→ `orbital-shells`).
- **DATA:** `{ orbits?: [{name, altKm, inclDeg?, color?, satCount?, note?}], maxAltKm? }`
- **PLAIN:** "Nested rings to scale around Earth, one per named orbit, with labels in a fixed column pointing to their ring."
- **NOTES:** space signature; hero-capable; fixed-column label pattern (`src/components/AGENTS.md` §5).

## launch-stats
- **World/Tier:** space · v2 kit `.ls` · `src/components/topic/space/LaunchStats.astro`
- **USE WHEN:** launches (or similar events) counted per year, optionally split by operator/vehicle — a cadence/growth story.
- **DON'T USE:** a continuous flight path or budget (→ `trajectory-arc`, `delta-v-ladder`); non-annual series (→ `scaling-plot`).
- **DATA:** `{ years: [{year, bars: [{label, value, color?}]}] }`
- **PLAIN:** "Grouped bars per year; bar height is the count, colours split it by who or what launched."
- **NOTES:** space signature; hero-capable; grow-bar reveal.

## benchmark-chart
- **World/Tier:** tech · v2 kit `.bc` · `src/components/topic/tech/BenchmarkChart.astro`
- **USE WHEN:** entities ranked on one metric as horizontal bars — one highlighted, optionally against a reference line.
- **DON'T USE:** change over time (→ `adoption-curve` / `scaling-plot`); multi-attribute comparison (→ `comparison`).
- **DATA:** `{ items: [{label, value, sublabel?, highlight?, color?}], maxValue?, unit?, refValue?, refLabel?, sortDesc? }`
- **PLAIN:** "Horizontal bars sorted by value; the highlighted bar is the subject, the reference line the mark to beat."
- **NOTES:** tech signature; hero-capable.

## adoption-curve
- **World/Tier:** tech · v2 kit `.adc` · `src/components/topic/tech/AdoptionCurve.astro`
- **USE WHEN:** percent adoption over years tracing an S-curve, with milestone moments worth pinning to it.
- **DON'T USE:** raw scaling relationships (→ `scaling-plot`); activity density (→ `commit-grid`).
- **DATA:** `{ points: [{year, pct}], milestones?: [{year, label, pct?}], xLabel?, yLabel? }`
- **PLAIN:** "One line climbing an S-shape from niche to normal; flags along it mark the moments that bent the curve."
- **NOTES:** tech signature; hero-capable; overflow-visible milestone labels.

## route-card
- **World/Tier:** travel · v2 kit `.rc` · `src/components/topic/travel/RouteCard.astro`
- **USE WHEN:** a journey as legs — from/to, mode, distance, duration per leg; the logistics are the point.
- **DON'T USE:** named stops with texture (→ `journey-map`); day-by-day plans (→ `itinerary-reel`); the globe-scale sweep (→ `route-globe`).
- **DATA:** `{ legs: [{from, to, distance?, duration?, mode, note?}], title? }`
- **PLAIN:** "Stacked legs in travel order; each row is one hop with its mode, distance, and time."
- **NOTES:** travel signature; hero-capable.

## city-compare
- **World/Tier:** travel · v2 kit `.cc` · `src/components/topic/travel/CityCompare.astro`
- **USE WHEN:** exactly two places head-to-head on travel-relevant rows, with per-row winners.
- **DON'T USE:** three or more entities, or non-place subjects (→ `comparison`).
- **DATA:** `{ cityA: {name, flag?, subtitle?}, cityB: {name, flag?, subtitle?}, rows: [{label, a, b, winner?, note?}] }`
- **PLAIN:** "Two city columns with metric rows between them; the marked side wins that row."
- **NOTES:** travel signature; hero-capable.

## league-table
- **World/Tier:** sports · v2 kit `.lt` · `src/components/topic/sports/LeagueTable.astro`
- **USE WHEN:** standings — position, points, form over a season or window; movement and gaps tell the story.
- **DON'T USE:** one match (→ `match-stat-line`); momentum inside a match (→ `momentum-wave`).
- **DATA:** `{ rows: [{pos, posChange?, team, badge?, played, won, drawn?, lost, gf?, ga?, gd?, points, form?, highlight?}], showDrawn?, showGoals? }`
- **PLAIN:** "A standings table read top-down; position arrows and the form string show direction, the highlighted row is the subject."
- **NOTES:** sports signature; hero-capable.

## player-radar
- **World/Tier:** sports · v2 kit `.pr` · `src/components/topic/sports/PlayerRadar.astro`
- **USE WHEN:** one player profiled across 5–8 stat axes, optionally against a comparison shape.
- **DON'T USE:** a single headline rating with stat bars (→ `player-card`); two teams (→ `match-stat-line`).
- **DATA:** `{ stats: [{label, value, max?}], player?, team?, color?, compare? }`
- **PLAIN:** "A spider web with one spoke per stat; the filled shape's reach on each spoke is that stat's strength."
- **NOTES:** sports signature; hero-capable; scale-pop reveal, overflow-visible spoke labels.

## coalition-orbit
- **World/Tier:** politics · WebGL · `src/components/topic/politics/CoalitionOrbit.astro`
- **USE WHEN:** seat shares / bloc make-up as party bodies orbiting a government core — dossier has per-party seats and bloc membership.
- **DON'T USE:** one vote against a threshold (→ `vote-result`); a static seats-and-change table (→ `seat-chart`).
- **DATA:** `{ parties: [{name, seats, color?, bloc?}], totalSeats? }`
- **PLAIN:** "A 3-D core with party bodies orbiting it; body size is seat count, and orbit grouping is the bloc."
- **NOTES:** hero-capable; never adjacent to another WebGL kind (Three.js lazy-loads on scroll-in); worked example in `2026-06-03-politics-showcase`.

## swing-dial
- **World/Tier:** politics · CSS-3D · `src/components/topic/politics/SwingDial.astro`
- **USE WHEN:** a single value on a two-bloc scale — a swing, a margin, a lean — with optional reference markers.
- **DON'T USE:** opinion over time (→ `approval-chart`); many margins at once (→ `margin-ladder`).
- **DATA:** `{ leftLabel?, rightLabel?, value (-100..100), markers?: [{at, label}] }`
- **PLAIN:** "A needle on a dial between two ends; where it points is how far the balance tips, and the ticks mark reference points."
- **NOTES:** worked example in `2026-06-03-politics-showcase`.

## bill-passage
- **World/Tier:** politics · CSS-3D · `src/components/topic/politics/BillPassage.astro`
- **USE WHEN:** a bill advancing stage by stage — readings, houses, assent — with a status per stage.
- **DON'T USE:** what the bill contains (→ `bill-breakdown`); the dated history around it (→ `timeline`).
- **DATA:** `{ stages: [{label, status: 'passed'|'failed'|'pending'|'current', date?, note?}] }`
- **PLAIN:** "Stage cards in procedural order; each card's state shows whether the bill cleared it, stalled, or sits there now."
- **NOTES:** worked example in `2026-06-03-politics-showcase`.

## vote-flow
- **World/Tier:** politics · SVG (Sankey) · `src/components/topic/politics/VoteFlow.astro`
- **USE WHEN:** blocs flowing into for/against/abstain — the split WITHIN groupings is the story.
- **DON'T USE:** the bare tally vs threshold (→ `vote-result`); coalition make-up without a vote (→ `coalition-orbit`).
- **DATA:** `{ blocs: [{name, seats, color?, vote: 'for'|'against'|'abstain'}], outcome?: {label, passed} }`
- **PLAIN:** "Ribbons run from each bloc on the left to for, against, or abstain on the right; ribbon width is seats."
- **NOTES:** worked example in `2026-06-03-politics-showcase`.

## margin-ladder
- **World/Tier:** politics · CSS-3D · `src/components/topic/politics/MarginLadder.astro`
- **USE WHEN:** ranked win/loss margins across seats or races — how safe or knife-edge each contest was.
- **DON'T USE:** one aggregate swing (→ `swing-dial`); party seat totals (→ `seat-chart`).
- **DATA:** `{ rows: [{label, margin, winner?, color?}] }`
- **PLAIN:** "Contests ranked as rungs on a tilted ladder; each rung's length is the margin it was won or lost by."
- **NOTES:** worked example in `2026-06-03-politics-showcase`.

## chamber
- **World/Tier:** politics · WebGL **FLAGSHIP** + world signature · `src/components/topic/politics/Chamber.astro`
- **USE WHEN:** seat-by-party composition covering ≥90% of the chamber (name + seats per party); optionally a specific division's per-party aye/no counts.
- **DON'T USE:** partial compositions (→ `seat-chart`); vote-total-only stories (→ `vote-result`); coalition arithmetic play (→ `coalition-calculus`, P5).
- **DATA:** `{ chamber?: {rows?, arcDeg?}, parties: [{name, seats, color?, side?: 'gov'|'opp'|'cross', short?}], majority?, division?: {label?, aye: {party: n}, no: {party: n}} }`
- **PLAIN:** "The chamber from above — every block is one seat, grouped by party. The dashed arc is the majority line."
- **NOTES:** the politics hero + identity anchor; hero-capable (pairs with `layout: split`; setState 'composition'/'division' via the state chips); never adjacent to another WebGL kind; shared math `src/scripts/viz3d/hemicycle.ts` feeds scene AND fallback SVG; absent seats = party total − aye − no (seated, dimmed). BLUEPRINT: `docs/design/blueprints/politics/chamber.md`. RESEARCHER MUST CAPTURE: full composition per party (name + seats, ≥90% of the chamber) and, if a vote is the story, the division's per-party aye/no counts.

## power-flow
- **World/Tier:** politics · SVG (build-time Sankey, usable cross-world) · `src/components/topic/politics/PowerFlow.astro`
- **USE WHEN:** the dossier has a flow table (from → to → amount, one unit) with ≥4 links and ≥2 layers; totals reconcile (or the imbalance IS the story and is flagged `imbalance: 'the-point'`).
- **DON'T USE:** simple part-of-whole (→ `data-readout` tiles or `comparison`); bloc→vote flows (→ `vote-flow`, which owns that shape).
- **DATA:** `{ nodes: [{id, label, group?: 'source'|'via'|'sink'}], links: [{from, to, value, note?}], unit, imbalance?: 'the-point' }`
- **PLAIN:** "Money flows left to right — every band is one route, and thicker bands carry more. The moving dashes show direction."
- **NOTES:** hero-capable for money-trail issues; conservation-checked at build (an imbalanced `via` node FAILS the build naming the node unless flagged — then it renders the accent-alt residual stub); single accent, thickness does the talking; flowDash speed ∝ value and is the card's one ambient motion. BLUEPRINT: `docs/design/blueprints/politics/power-flow.md`.

## orbit-globe
- **World/Tier:** space · WebGL · `src/components/topic/space/OrbitGlobe.astro`
- **USE WHEN:** orbital shells / satellite populations around Earth — dossier has real altitudes (km) and ideally inclinations per constellation.
- **DON'T USE:** a single trajectory or ascent (→ `trajectory-arc`); interplanetary scale (→ `solar-system`, P5).
- **DATA:** `{ orbits: [{name, altKm, inclDeg?, color?, satCount?}], maxAltKm? }`
- **PLAIN:** "A 3-D Earth; each ring is one orbit at its real altitude and tilt, and the dots are satellites."
- **NOTES:** hero-capable; never adjacent to another WebGL kind; worked example in `2026-06-03-space-showcase`.

## trajectory-arc
- **World/Tier:** space · CSS-3D/SVG · `src/components/topic/space/TrajectoryArc.astro`
- **USE WHEN:** a flight path by altitude and downrange — launch/ascent phases with real km values.
- **DON'T USE:** a descent or landing with event markers (→ `descent-profile`); whole-orbit populations (→ `orbit-globe`).
- **DATA:** `{ phases: [{label, altKm, downrangeKm, note?}], apoapsisKm? }`
- **PLAIN:** "An arc climbing across a starfield; each labelled point is one flight phase at its real altitude and distance downrange."
- **NOTES:** worked example in `2026-06-03-space-showcase`.

## delta-v-ladder
- **World/Tier:** space · CSS-3D · `src/components/topic/space/DeltaVLadder.astro`
- **USE WHEN:** a delta-v / energy budget broken into segments — what it costs to get from here to there, piece by piece.
- **DON'T USE:** the flight path itself (→ `trajectory-arc`); non-additive comparisons (→ `benchmark-chart`, tech).
- **DATA:** `{ segments: [{label, dv, color?}], unit? }`
- **PLAIN:** "Stacked bars climbing like rungs; each rung is one manoeuvre's cost, and the total height is the whole budget."
- **NOTES:** worked example in `2026-06-03-space-showcase`.

## signal-readout
- **World/Tier:** space · SVG/canvas · `src/components/topic/space/SignalReadout.astro`
- **USE WHEN:** signal bands or a spectrum — per-band frequency and strength readings from the dossier.
- **DON'T USE:** time-ordered telemetry (→ `descent-profile`); headline numbers (→ `data-readout`).
- **DATA:** `{ bands: [{label, freq, value, max?, color?}] }`
- **PLAIN:** "A tuner-style readout; each band sits at its frequency and its bar height is the signal strength."
- **NOTES:** worked example in `2026-06-03-space-showcase`.

## descent-profile
- **World/Tier:** space · SVG · `src/components/topic/space/DescentProfile.astro`
- **USE WHEN:** an altitude-vs-time descent or landing with event markers — dossier has timestamped altitude points and named events.
- **DON'T USE:** ascent / downrange stories (→ `trajectory-arc`).
- **DATA:** `{ points: [{t, altKm, phase?}], events?: [{t, label}], craftLabel? }`
- **PLAIN:** "A line falling from upper-left to touchdown; time runs right, altitude runs down, and flags mark the moments that mattered."
- **NOTES:** worked example in `2026-06-03-space-showcase`.

## solar-system
- **World/Tier:** space · WebGL **FLAGSHIP** · `src/components/topic/space/SolarSystem.astro`
- **USE WHEN:** interplanetary geometry IS the story (an object's real orbit, windows, flybys, crossings) — dossier has real orbital elements (a, e, i, Ω, ω, M0, period) for ≥1 story object, plus an epoch date. Planets ship as built-in J2000 defaults.
- **DON'T USE:** near-Earth shells/constellations (→ `orbit-globe`); a single ascent (→ `trajectory-arc`).
- **DATA:** `{ epoch, planets?: ['mercury'…], bodies?: [{name, a_AU, e, i_deg, Omega_deg, omega_deg, M0_deg, period_d, role?: 'focus', note?}], scale?: 'log'|'true', trailDays? }`
- **PLAIN:** "A top-down map of the solar system — each ring is one real orbit, each dot a body at its actual position for the story's date. The amber object is the one this story follows."
- **NOTES:** hero-capable (pairs with `layout: split`; setState 'log-scale'/'true-scale' reserved for chapters); never adjacent to another WebGL kind; `scale: log` auto-renders the honesty chip. BLUEPRINT: `docs/design/blueprints/space/solar-system.md`. RESEARCHER MUST CAPTURE: the object's elements from JPL SBDB (or equivalent primary), incl. the epoch its M is quoted at.

## data-globe
- **World/Tier:** earth · WebGL · `src/components/topic/earth/DataGlobe.astro`
- **USE WHEN:** geo-located values at real lat/lon points — the global spread of point measurements is the story.
- **DON'T USE:** values shaded by country/region (→ `region-map`); a flat overview that doesn't need spinning (→ `region-map`).
- **DATA:** `{ markers: [{name, lat, lon, value, color?}], unit? }`
- **PLAIN:** "A 3-D globe with a marker at each real location, sized and coloured by its value."
- **NOTES:** hero-capable; never adjacent to another WebGL kind; worked example in `2026-06-03-earth-showcase`.

## core-sample
- **World/Tier:** earth · CSS-3D · `src/components/topic/earth/CoreSample.astro`
- **USE WHEN:** a vertical core / stratigraphy by depth — layers with labels and values (ice cores, sediment records).
- **DON'T USE:** bands above ground level (→ `elevation-profile`); a time series without depth (→ `climate-strip` / `climate-spiral`).
- **DATA:** `{ layers: [{depth, label, value?, color?}], unit? }`
- **PLAIN:** "A drilled column read top-down; each stripe is a layer at its real depth, deeper meaning older."
- **NOTES:** worked example in `2026-06-03-earth-showcase`.

## sea-level-tank
- **World/Tier:** earth · CSS-3D/SVG · `src/components/topic/earth/SeaLevelTank.astro`
- **USE WHEN:** rising-water levels against landmark heights — scenario rises measured against things the reader knows the size of.
- **DON'T USE:** annual anomaly series (→ `climate-strip`); depth structure (→ `core-sample`).
- **DATA:** `{ levels: [{label, riseM, year?}], landmarks?: [{name, heightM}], maxM? }`
- **PLAIN:** "A cross-section tank filling with water; each waterline is one scenario, drawn against landmarks for scale."
- **NOTES:** worked example in `2026-06-03-earth-showcase`.

## climate-spiral
- **World/Tier:** earth · SVG/canvas · `src/components/topic/earth/ClimateSpiral.astro`
- **USE WHEN:** a monthly climate series spiralling by year — seasonal cycle plus long-term drift in one figure.
- **DON'T USE:** one value per year (→ `climate-strip`); monthly travel planning (→ `climate-calendar`, travel).
- **DATA:** `{ months: [{year, month (1-12), value}], unit?, baseline? }`
- **PLAIN:** "A line spiralling outward, one loop per year around twelve month-spokes; the outward creep is the warming."
- **NOTES:** worked example in `2026-06-03-earth-showcase`.

## quake-depth
- **World/Tier:** earth · SVG · `src/components/topic/earth/QuakeDepth.astro`
- **USE WHEN:** earthquakes by depth and magnitude over time — the depth dimension carries the mechanism.
- **DON'T USE:** quake locations on a map (→ `region-map` markers or `data-globe`).
- **DATA:** `{ quakes: [{date, depthKm, mag, place?}] }`
- **PLAIN:** "Dots on a time-by-depth field; lower means deeper underground, bigger means stronger."
- **NOTES:** worked example in `2026-06-03-earth-showcase`.

## terrain-relief
- **World/Tier:** earth · WebGL **FLAGSHIP** · `src/components/topic/earth/TerrainRelief.astro`
- **USE WHEN:** the story hinges on the real topography of ONE bounded region — a committed DEM heightfield exists for it.
- **DON'T USE:** geo-located values across the whole globe (→ `data-globe`); a route's up-and-down profile (→ `elevation-trek`).
- **DATA:** `{ dem: '/geo/<slug>-dem.json', place?, exaggeration?, exaggerateTo?, contourInterval_m?, peaks?: [{lat, lon, label, elev_m?}], seaLevel? }`
- **PLAIN:** "The real shape of the ground, drawn as contour rings and ridgelines — the vertical scale is stretched to make the relief legible; the caption says by how much."
- **NOTES:** hero-capable (pairs with `layout: split`); needs a per-issue DEM JSON asset in `public/geo/`; vertical-exaggeration honesty chip auto-renders. BLUEPRINT: `docs/design/blueprints/earth/terrain-relief.md`. RESEARCHER MUST CAPTURE: the DEM provider + resolution + region bounds.

## arch-stack
- **World/Tier:** tech · CSS-3D · `src/components/topic/tech/ArchStack.astro`
- **USE WHEN:** a layered system / architecture stack — what sits on what.
- **DON'T USE:** request timing through the stack (→ `latency-waterfall`); branch/merge structure (→ `version-graph`).
- **DATA:** `{ layers: [{label, sublabel?, color?}] }`
- **PLAIN:** "An exploded stack of slabs; each slab is one layer of the system, in the order they sit on each other."
- **NOTES:** worked example in `2026-06-03-tech-showcase`.

## latency-waterfall
- **World/Tier:** tech · SVG · `src/components/topic/tech/LatencyWaterfall.astro`
- **USE WHEN:** timed spans in a request waterfall — where the milliseconds actually go.
- **DON'T USE:** throughput as one figure (→ `throughput-dial`); ranked totals (→ `benchmark-chart`).
- **DATA:** `{ spans: [{label, start, dur, kind?}], unit? }`
- **PLAIN:** "Bars staggered down the page like a network inspector; each bar starts when its step starts and is as long as it took."
- **NOTES:** worked example in `2026-06-03-tech-showcase`.

## version-graph
- **World/Tier:** tech · SVG · `src/components/topic/tech/VersionGraph.astro`
- **USE WHEN:** a commit / release DAG — branches, merges, and tags telling a development story.
- **DON'T USE:** activity volume over time (→ `commit-grid`); layered runtime structure (→ `arch-stack`).
- **DATA:** `{ nodes: [{id, parents?, label?, tag?, lane?}] }`
- **PLAIN:** "A git-style graph; dots are commits or releases, lanes are branches, and connecting lines show what merged where."
- **NOTES:** worked example in `2026-06-03-tech-showcase`.

## scaling-plot
- **World/Tier:** tech · SVG · `src/components/topic/tech/ScalingPlot.astro`
- **USE WHEN:** an x/y scaling relationship — power laws, cost curves — optionally with log axes and a fit line.
- **DON'T USE:** the adoption S-curve story (→ `adoption-curve`); ranked one-metric bars (→ `benchmark-chart`).
- **DATA:** `{ points: [{x, y, label?}], xLabel?, yLabel?, logX?, logY?, fit? }`
- **PLAIN:** "A scatter of points on (optionally log) axes; the fit line shows the law the points obey."
- **NOTES:** worked example in `2026-06-03-tech-showcase`.

## throughput-dial
- **World/Tier:** tech · SVG/CSS-3D · `src/components/topic/tech/ThroughputDial.astro`
- **USE WHEN:** a single throughput / utilisation gauge with zones — one live-feeling operational number.
- **DON'T USE:** a used/remaining budget arc (→ `carbon-gauge`, earth); several headline numbers (→ `data-readout`).
- **DATA:** `{ value, max, unit?, label?, zones?: [{from, to, label?}] }`
- **PLAIN:** "A gauge needle against a zoned arc; where it points is the current reading, and the coloured zones say how to feel about it."
- **NOTES:** worked example in `2026-06-03-tech-showcase`.

## neural-flow
- **World/Tier:** tech · WebGL **FLAGSHIP** · `src/components/topic/tech/NeuralFlow.astro`
- **USE WHEN:** the dossier has a real architecture — ordered layer sizes (units per layer) for the model discussed.
- **DON'T USE:** layered *system* structure with no unit counts (→ `arch-stack`); a scaling curve (→ `scaling-plot`).
- **DATA:** `{ layers: [{n, label}] (2–8), paramsNote?, wave_ms? }`
- **PLAIN:** "Each column is one layer of the network and every dot is one unit, at true layer sizes. The lime wave is a single forward pass moving from input to answer."
- **NOTES:** hero-capable (pairs with `layout: split`); large layers sampled with a "showing 1 in N" chip; param count computed. BLUEPRINT: `docs/design/blueprints/tech/neural-flow.md`. RESEARCHER MUST CAPTURE: the real per-layer unit counts of the network.

## route-globe
- **World/Tier:** travel · WebGL · `src/components/topic/travel/RouteGlobe.astro`
- **USE WHEN:** a multi-stop journey arced across a globe — intercontinental scale where great-circle geometry matters.
- **DON'T USE:** leg-by-leg logistics (→ `route-card`); a regional path with texture (→ `journey-map`).
- **DATA:** `{ stops: [{city, lat, lon, note?}] }`
- **PLAIN:** "A 3-D globe with the journey drawn as arcs from stop to stop along real great-circle paths."
- **NOTES:** hero-capable; never adjacent to another WebGL kind; worked example in `2026-06-03-travel-showcase`.

## elevation-trek
- **World/Tier:** travel · CSS-3D/SVG · `src/components/topic/travel/ElevationTrek.astro`
- **USE WHEN:** an elevation profile along a route — distance vs elevation with named waypoints and a moving-marker feel.
- **DON'T USE:** earth-science band structure (→ `elevation-profile`, earth); stop-sequence storytelling (→ `journey-map`).
- **DATA:** `{ points: [{km, elevM, label?}], unit? }`
- **PLAIN:** "A mountain silhouette of the route; left-to-right is distance travelled, up-and-down is real elevation."
- **NOTES:** worked example in `2026-06-03-travel-showcase`.

## itinerary-reel
- **World/Tier:** travel · CSS-3D · `src/components/topic/travel/ItineraryReel.astro`
- **USE WHEN:** a day-by-day itinerary — flip-through day cards with per-day items.
- **DON'T USE:** transport legs (→ `route-card`); the route's geography (→ `journey-map` / `route-globe`).
- **DATA:** `{ days: [{day, place, items?}] }`
- **PLAIN:** "A deck of day cards flipped through in order; each card is one day, where you are, and what's on it."
- **NOTES:** worked example in `2026-06-03-travel-showcase`.

## climate-calendar
- **World/Tier:** travel · SVG · `src/components/topic/travel/ClimateCalendar.astro`
- **USE WHEN:** monthly temperature / rainfall for a "when to go" decision.
- **DON'T USE:** multi-decade climate records (→ `climate-strip` / `climate-spiral`, earth).
- **DATA:** `{ months: [{month, temp?, rainfall?, note?}], tempUnit? }`
- **PLAIN:** "Twelve month cells coloured as a heat ribbon; warm and wet read at a glance, so the good window shows itself."
- **NOTES:** worked example in `2026-06-03-travel-showcase`.

## timezone-arc
- **World/Tier:** travel · SVG/CSS-3D · `src/components/topic/travel/TimezoneArc.astro`
- **USE WHEN:** city time-zone offsets against a reference — a jet-lag / overlap / sun-position story.
- **DON'T USE:** route geometry (→ `route-globe`); journey durations (→ `route-card`).
- **DATA:** `{ zones: [{city, offset}], refOffset? }`
- **PLAIN:** "Cities placed along a day arc by their clock offset; the spread shows who's awake when you are."
- **NOTES:** worked example in `2026-06-03-travel-showcase`.

## terminator-globe
- **World/Tier:** travel · WebGL **FLAGSHIP** · `src/components/topic/travel/TerminatorGlobe.astro`
- **USE WHEN:** a jet-lag / time-zone / red-eye story — two cities, a departure moment, a flight duration.
- **DON'T USE:** a multi-stop journey arced across the globe (→ `route-globe`); city time-zone offsets as a flat chart (→ `timezone-arc`).
- **DATA:** `{ epoch, from: {city, lat, lon, tzOffsetH}, to: {city, lat, lon, tzOffsetH}, flightHours, arcBulge?, showEoT? }`
- **PLAIN:** "A real globe lit for one moment — the shaded half is night, the line across it is where day meets dark, and the terracotta arc is your flight crossing from one into the other."
- **NOTES:** hero-capable (pairs with `layout: split`); extends the shared country globe; setState 'arrival' jumps the sun forward. BLUEPRINT: `docs/design/blueprints/travel/terminator-globe.md`. RESEARCHER MUST CAPTURE: the two airports' coords + tz offsets + the real flight duration.

## tactics-pitch
- **World/Tier:** sports · CSS-3D/SVG · `src/components/topic/sports/TacticsPitch.astro`
- **USE WHEN:** player positions / a formation on the pitch — the spatial set-up is the argument.
- **DON'T USE:** shot locations and quality (→ `shot-map`); match numbers (→ `match-stat-line`).
- **DATA:** `{ players: [{x (0-100), y (0-100), num?, name?, role?}], formation?, team? }`
- **PLAIN:** "A pitch viewed at a tilt with a marker per player where they actually operate; the shape between markers is the formation."
- **NOTES:** worked example in `2026-06-03-sports-showcase`.

## shot-map
- **World/Tier:** sports · SVG · `src/components/topic/sports/ShotMap.astro`
- **USE WHEN:** shots plotted by location and xG with outcomes — where the chances came from and what they were worth.
- **DON'T USE:** cumulative chance quality over time (→ `xg-race`); formation shape (→ `tactics-pitch`).
- **DATA:** `{ shots: [{x, y, xg, outcome: 'goal'|'saved'|'miss'|'blocked'}] }`
- **PLAIN:** "A goal frame with one dot per shot; dot size is the chance's quality, dot style is what happened to it."
- **NOTES:** worked example in `2026-06-03-sports-showcase`.

## xg-race
- **World/Tier:** sports · SVG · `src/components/topic/sports/XgRace.astro`
- **USE WHEN:** a cumulative xG race between two teams — who was creating, and exactly when it flipped.
- **DON'T USE:** individual shots' detail (→ `shot-map`); a momentum feel without xG data (→ `momentum-wave`).
- **DATA:** `{ events: [{minute, team: 'home'|'away', xg}], home?, away? }`
- **PLAIN:** "Two step-lines climbing with each chance created; the higher line was creating more, and the steps show when."
- **NOTES:** worked example in `2026-06-03-sports-showcase`.

## momentum-wave
- **World/Tier:** sports · SVG · `src/components/topic/sports/MomentumWave.astro`
- **USE WHEN:** match momentum swinging between sides — pressure over minutes, with event markers.
- **DON'T USE:** chance-quality accounting (→ `xg-race`); the final numbers (→ `match-stat-line`).
- **DATA:** `{ points: [{minute, value (-100..100)}], events?: [{minute, label, team?}], home?, away? }`
- **PLAIN:** "A wave above or below the centre line; above means one side is on top, below the other, and flags pin the moments."
- **NOTES:** worked example in `2026-06-03-sports-showcase`.

## player-card
- **World/Tier:** sports · CSS-3D flip · `src/components/topic/sports/PlayerCard.astro`
- **USE WHEN:** one player as a flip rating card — a headline rating up front, stat bars on the back.
- **DON'T USE:** multi-axis shape comparison (→ `player-radar`, which also takes a `compare` shape).
- **DATA:** `{ name, position?, team?, rating, stats: [{label, value, max?}] }`
- **PLAIN:** "A collector-style card that flips: rating and identity on the front, stat bars on the back."
- **NOTES:** flip driven by `[data-flip-btn]` (`core/Tilt.astro`); no-JS keeps the front face; worked example in `2026-06-03-sports-showcase`.

## flight-of-the-ball
- **World/Tier:** sports · WebGL **FLAGSHIP** · `src/components/topic/sports/FlightOfTheBall.astro`
- **USE WHEN:** the dossier has ONE famous shot/kick with primary launch parameters — speed, angle, spin.
- **DON'T USE:** many shots' locations/quality at once (→ `shot-map`); cumulative xG over a match (→ `xg-race`).
- **DATA:** `{ sport, shot: {v0, speedUnit?, elevationDeg, azimuthDeg, spinRevPerS, spinAxis?, from?, label?, note?}, goal?: {x_m, width_m, height_m, z_m}, showGhost?, slowmo? }`
- **PLAIN:** "The bright line is the ball's real curved flight; the faint dashed line is the straight path it would have taken with no air. The gap between them is how much the spin bent it."
- **NOTES:** hero-capable (pairs with `layout: split`); drag+Magnus RK4 physics (shared `src/scripts/viz3d/ballistics.ts`); setState 'replay'. BLUEPRINT: `docs/design/blueprints/sports/flight-of-the-ball.md`. RESEARCHER MUST CAPTURE: the shot's launch speed, elevation angle, and spin rate.

<!-- check:catalog expects exactly the SECTION_KINDS list above this line -->
