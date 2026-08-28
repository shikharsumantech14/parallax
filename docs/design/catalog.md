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
> THREE COMPREHENSION FIELDS, three contracts (2026-08-27). `plain` is the FORM
> in one sentence, below the graphic, 220 chars. `howToRead` is the FORM at
> paragraph length, ABOVE the graphic, 40–360 chars — write one only where the
> form can be misread. `caption` is the DATA claim and is the only one of the
> three a verifier traces to the dossier. Never let `plain` assert data, and
> never let `caption` merely describe the shape.
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

## coalition-calculus
- **World/Tier:** politics · HTML-interactive (build-time HTML + one tiny vanilla `is:inline` island; no three.js, SVG only for the lock glyph) · `src/components/topic/politics/CoalitionCalculus.astro`
- **USE WHEN:** a hung-chamber / coalition-formation story where the dossier has ≥3 parties' seat counts covering the whole chamber (Σseats = N) and the who-can-combine arithmetic IS the argument; locked-out parties carry a sourced ≤12-word reason.
- **DON'T USE:** the chamber's composition as portrait (→ `chamber`); one decisive vote against a threshold (→ `vote-result`); blocs splitting for/against (→ `vote-flow`); seat totals with a change column (→ `seat-chart`).
- **DATA:** `{ majority?, parties: [{name, short?, seats, color?, locked?}], preset?, caption?, source? }`
- **PLAIN:** "Every block is one party's seats on a single bar; press parties in or out and the bar shows whether the group reaches the majority line."
- **NOTES:** THE reader-agency reference — its §8 pattern (data-at-rest / one chip-set control / `aria-live` verdict / refusals that explain themselves / keyboard-complete) is the precedent later reader-agency kinds cite. No-JS = the print edition (beam painted in the preset state + open party ledger; the bench control ships `hidden`, unhidden by the island). `wide` standalone, hero-capable; **never `layout: split`**. `majority` present and ≠ ⌈(N+1)/2⌉ auto-renders the `threshold {majority} of {N}` honesty chip. Party colors are a data-encoding exemption (same rule as `chamber`). BLUEPRINT: `docs/design/blueprints/politics/coalition-calculus.md`. RESEARCHER MUST CAPTURE: seat counts for every party summing to the full chamber, plus a sourced one-line reason for each party locked out of coalitions.

## gerrymander-lens
- **World/Tier:** politics · SVG (100% build-time layout + efficiency-gap math; the reveal is the only JS) · `src/components/topic/politics/GerrymanderLens.astro`
- **USE WHEN:** you have ONE precinct/cell grid of two-party vote counts covering the whole electorate, plus 2–3 district plans (a fair/neutral plan and one or two gerrymanders) that each partition **exactly that same cell set** into equal-population, contiguous districts. The story is "the map is the manipulation — same votes, different seats."
- **DON'T USE:** a single map's shaded values per region (→ `region-map`, earth); one chamber's party composition (→ `chamber`); a coalition's arithmetic (→ `coalition-calculus`); a straight two-column contrast (→ `comparison`). If you have only district-level totals and no shared underlying grid, you cannot honestly show "same votes."
- **DATA:** `{ grid: {cols, rows, a: number[], perCell}, parties: {a: {name, short?, color?}, b: {name, short?, color?}}, plans: [{label, districts: number[], note?}], flagPct?: 7 }`
- **PLAIN:** "The same voters, three ways of drawing the districts; each map shows who wins and how skewed it is — the number is the efficiency gap, and the fills never change."
- **NOTES:** flagship of the same-data-many-maps family; pairs with `layout: wide`, hero-capable for redistricting issues, **never `layout: split` or `bleed`**. Cell fills encode each cell's vote margin and are pixel-identical across all three panels (only the black district boundaries differ — the boundary `sweep` IS the metaphor). Efficiency gap is signed (− favours A, + favours B); flagged when `|EG| > flagPct` (default 7%, Stephanopoulos & McGhee). Build **FAILS** naming the offender if a plan's district A-tallies don't re-sum to the shared statewide total, or on unequal-population / non-contiguous districts. Hard cap 3 plans, ≤49 cells (7×7). BLUEPRINT: `docs/design/blueprints/politics/gerrymander-lens.md`.

## ballot-flow
- **World/Tier:** politics · SVG (build-time round layout + `flowDash`) · `src/components/topic/politics/BallotFlow.astro`
- **USE WHEN:** a **precomputed** ranked-choice / instant-runoff count — for each round every continuing candidate's tally, and for each elimination the breakdown of where those ballots transferred (including how many exhausted). ≥3 candidates, ≥2 rounds; the transfer mechanism IS the story.
- **DON'T USE:** a single plurality vote against a threshold (→ `vote-result`); blocs splitting for/against/abstain in one shot (→ `vote-flow`); money/authority moving between institutions (→ `power-flow`); a coalition's post-election arithmetic (→ `coalition-calculus`).
- **DATA:** `{ candidates: [{id, name, short?, color?}], rounds: [{tallies: {id: n}, exhausted?, eliminate?: {id, transfers: [{to|'exhausted', value}]}}], winnerId?, majorityBasis?: 'continuing'|'firstRound', caption?, source? }`
- **PLAIN:** "Each column is one counting round; when a candidate is knocked out, the moving ribbons show where their votes went next, and the dashed line is the majority needed to win."
- **NOTES:** the round-structured cousin of `power-flow` (build-time layout + `flowDash` speed ∝ value); two conservation asserts FAIL the build naming the round (an eliminated candidate's transfers must sum to their tally; Σ tallies + exhausted constant across rounds); exhausted ballots are always their own muted `--ink` @ 0.30 sink lane; `majorityBasis: 'continuing'` auto-renders the `majority of continuing ballots` chip and the majority tick descends per round. Pairs with `layout: wide`; never `bleed`/`split`. BLUEPRINT: `docs/design/blueprints/politics/ballot-flow.md`.


## bill-funnel
- **World/Tier:** politics · HTML bars · `src/components/topic/politics/BillFunnel.astro`
- **USE WHEN:** a *population* of bills counted at each procedural stage in order (≥4 stages, monotonically non-increasing), where the attrition between stages is the argument.
- **DON'T USE:** ONE bill's journey through the stages (→ `bill-passage`); what a bill contains (→ `bill-breakdown`); a dated legislative history (→ `timeline`).
- **DATA:** `{ stages: [{label, count, note?}], unit?, caption?, source? }`
- **PLAIN:** "The same bills counted again at every stage they had to clear; bar length is how many were still alive there, and the faded segment is what was lost since the row above."
- **NOTES:** build FAILS if any stage exceeds the one before it (a funnel cannot widen), or if there are fewer than 4 or more than 10 stages. The per-row loss is derived, never authored. Pairs with `default`; never `split`.

## age-pyramid
- **World/Tier:** politics · HTML mirrored bars · `src/components/topic/politics/AgePyramid.astro`
- **USE WHEN:** a body's composition by age band and a binary split (4–8 bands, oldest first), where either the concentration of the bands or the constancy of the split is the argument.
- **DON'T USE:** party composition of a chamber (→ `chamber` / `seat-chart`); one attribute compared across 2–3 entities (→ `comparison`); a single distribution with no split (→ a bar list in `data-readout`); one group's share tracked over time (→ `approval-chart`).
- **DATA:** `{ bands: [{label, left, right}] (oldest FIRST), sides: {left: {label, color?}, right: {label, color?}}, mode?: 'count'|'share', unit?, caption?, source? }`
- **PLAIN:** "One row per age band, oldest at the top, bars running outward from a centre line with one group to each side. Read as counts for the size of each band, or as shares to compare the balance within unequal bands."
- **NOTES:** build FAILS naming the band on fewer than 4 or more than 8 bands, a negative or non-finite value, a duplicate band label, or a band totalling 0 (share mode divides each row by its own total, so an empty band is a hole in the data). Array order IS display order — oldest first, never sorted, never validated. `count` mode puts every bar on ONE scale set by the largest single side anywhere in the chart; `share` mode re-normalises each row to its own total and auto-renders the `share of band` honesty chip, and the two printed shares always total 100 because the second is derived from the first. The chips are labelled "Counts" / "Share of band", ship `hidden`, and are unhidden by the island — no-JS paints the authored mode and the `<table>` carries absolute counts in BOTH modes, so no number is only reachable by toggling. Default sides are `--ink` and `--accent`: `sides[].color` exists but is NOT a data-encoding exemption, because a demographic split has no canonical colours. `unit` labels the count-mode eyebrow only and never touches the geometry. Pairs with `default`; not hero-capable; never `split` or `bleed`. BLUEPRINT: `docs/design/blueprints/politics/age-pyramid.md`. RESEARCHER MUST CAPTURE: for every band, BOTH sides' absolute counts from the register or roll (not percentages — the component derives shares), plus the band boundaries exactly as the source defines them.
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

## constellation-swarm
- **World/Tier:** space · WebGL **FLAGSHIP** · `src/components/topic/space/ConstellationSwarm.astro`
- **USE WHEN:** the physical scale + lattice of a satellite mega-constellation IS the story — the dossier has a real shell breakdown (≥1 shell with altitude km, inclination °, and a TRUE satellite count) and the census is large (best ≥ 300 craft). Every shown craft renders as one instanced point on its real orbital shell around a line-art Earth.
- **DON'T USE:** a single constellation's altitude rings without a census (→ `orbit-globe`); a handful of NAMED orbits where labels matter more than mass (→ `orbit-trace`); band-occupancy as annotated rings (→ `orbital-shells`); interplanetary geometry (→ `solar-system`). If the count fits on ten fingers, it is the wrong form.
- **DATA:** `{ shells: [{name, altKm, inclDeg, count, color?, planes?, raanSpread?}], epoch?, spin?, caption?, source? }`
- **PLAIN:** "Each dot is one satellite on its real orbital shell around Earth; the whole cloud is the constellation at true scale, and colour groups the shells."
- **NOTES:** hero-capable (pairs with `layout: split`, or `wide` standalone); never adjacent to another WebGL kind, never `bleed`. Altitude uses a TRUE-ratio magnified band (no log — LEO shells really are a ~30 km crust). `spin: true` auto-renders the `1 s = 90 min` time chip; `Σcount > 6000` display-samples the instances and auto-renders the `showing … of … craft` chip — the legend + tooltip ALWAYS state the TRUE count. BLUEPRINT: `docs/design/blueprints/space/constellation-swarm.md`. RESEARCHER MUST CAPTURE: per shell the altitude (km), inclination (°) and the census satellite count from a primary filing (FCC/ITU) or the operator's architecture doc.

## lagrange-map
- **World/Tier:** space · build-time SVG contour field · `src/components/topic/space/LagrangeMap.astro`
- **USE WHEN:** the story hinges on a Lagrange point — a mission parked at L1/L2 (SOHO, JWST, Gaia) or a Trojan population at L4/L5; the two-body system is named and its mass ratio is derivable.
- **DON'T USE:** the flight path to get there (→ `trajectory-arc`); interplanetary orbit geometry (→ `solar-system`); a Δv budget of the transfer (→ `delta-v-ladder`); halo orbits around a point (out of scope).
- **DATA:** `{ primary:{name,mass}, secondary:{name,mass}, separationKm?, markers?:[{at:'L1'..'L5',label}], show?:['L1'..'L5'], caption?, source? }`
- **PLAIN:** "A contour map of a two-body system's gravity-plus-spin terrain; five rings mark the balance points — the three crossed rings are knife-edge (unstable), the two filled ones are stable."
- **NOTES:** space; wide/hero-capable; single-accent cyan ramp (no second hue); auto-renders the `potential log-shaded` honesty chip; the collinear-trio magnifier inset auto-renders for real (small-μ*) mass ratios and is omitted once L1/L2 separate natively (Earth–Moon). BLUEPRINT: `docs/design/blueprints/space/lagrange-map.md`.

## transfer-window
- **World/Tier:** space · SVG interactive · `src/components/topic/space/TransferWindow.astro`
- **USE WHEN:** the story is a specific Hohmann transfer between two roughly-circular coplanar orbits — an interplanetary launch window (Earth→Mars, Earth→Venus), a Hohmann orbit-raise (LEO→GEO), or the cadence of departure opportunities. The dossier needs the two orbital radii (or altitudes) and the central body's μ.
- **DON'T USE:** a highly eccentric or plane-change-heavy real trajectory (the Hohmann idealization would lie → `solar-system` with real elements); the full solar-system context of the object (→ `solar-system`); a pure Δv budget with no window idea (→ `delta-v-ladder`); ascent from a surface (→ `trajectory-arc`). NEVER `layout: split` — scroll would fight the scrubber for the one control.
- **DATA:** `{ central: { name, mu }, from: { name, radiusKm, periodDays? }, to: { name, radiusKm, periodDays? }, distanceUnit? }` — Δv + transfer time from `kepler.ts hohmannDv`; synodic period + required phase are closed-form.
- **PLAIN:** "Two rings are the orbits, the arc between them is the cheapest transfer path, and the two dots must line up at the right angle for the trip to work — drag to see when they do."
- **NOTES:** ONE control (the phase scrubber; data-at-rest / aria-live verdict / keyboard-complete); build-time ALIGNED still (no-JS = window-open still + scrubber hidden + collapsible transfer ledger); auto `idealized · circular coplanar` chip always renders, `radii √-compressed` chip when r2/r1 > 6; verdict is aria-live and never red (a missed window is a wait, not a failure); hero-capable, pairs with `wide`. BLUEPRINT: `docs/design/blueprints/space/transfer-window.md`. RESEARCHER MUST CAPTURE: the two orbital radii/altitudes + central-body μ; orbital periods if the orbits are not treated as circular.

## eclipse-cone
- **World/Tier:** space · CSS-3D / SVG (build-time SVG geometry inside a `core/Tilt.astro` pointer-tilt shell; no WebGL) · `src/components/topic/space/EclipseCone.astro`
- **USE WHEN:** the story is eclipse or occultation geometry — a solar/lunar eclipse, the totality coincidence, a star occulted by a body, transit vs eclipse; the dossier has the three radii (source, occulter, target) and the two distances (source→occulter, occulter→target).
- **DON'T USE:** the *path* of an eclipse across a map (→ `region-map` with a track); a timeline of eclipse events (→ `timeline`); the orbit that produces the alignment (→ `solar-system`/`lagrange-map`). If the point is not the cone geometry itself, this is the wrong tool.
- **DATA:** `{ source: {name, radiusKm}, occulter: {name, radiusKm, distanceFromSourceKm}, target: {name, radiusKm, distanceFromOcculterKm, distanceRangeKm?: [min,max]}, showPenumbra?: true, caption?, sourceCite? }` — NB the citation field is `sourceCite`; the nested `source` object is the light SOURCE (e.g. the Sun), not the citation.
- **PLAIN:** "A shadow cone drawn from the occulting body to its true tip length, with the target placed at its real fraction of that length — so you can see whether the shadow's point actually reaches it."
- **NOTES:** space world; cone half-angle exaggerated for visibility (auto-chip `cone angle exaggerated · length-ratio true · baseline compressed`), but the axial length-ratio is exact and the angular-diameter inset is true 1:1; `wide`/hero-capable, standalone (not `split`). BLUEPRINT: `docs/design/blueprints/space/eclipse-cone.md`.


## margin-bullets
- **World/Tier:** space · HTML bullet rows · `src/components/topic/space/MarginBullets.astro`
- **USE WHEN:** 4–8 measurements each against its OWN requirement, in units that do not compare (dB, kg, °C, W), where whether each one closes is the argument.
- **DON'T USE:** values sharing one unit and scale (→ `benchmark-chart`, tech); a stacked energy budget (→ `delta-v-ladder`); telemetry band strengths (→ `signal-readout`); one measurement over time (→ `approval-chart`).
- **DATA:** `{ rows: [{label, value, required, max, unit, note?}] }` — `label` must carry or imply the unit; `max` is that row's OWN full range.
- **PLAIN:** "One row per subsystem, each drawn on its own scale because decibels and kilograms do not compare; the bar is what it has, the tick is what it needs, and a bar stopping short of its tick does not close."
- **NOTES:** build FAILS naming the row if it carries no `unit`, or breaks `0 < required <= max` or `0 <= value <= max`, or if there are fewer than 4 or more than 8 rows. Each row is normalised to its OWN `max` — no shared axis and no gridline is drawn across rows, and the margin's decimal places are derived from the authored numbers rather than a unit table. The requirement tick overhangs the track so it stays visible where the bar covers it. Default selection is the failing row (worst relative shortfall; the last row if all pass). Pairs with `default`; **not hero-capable**, never `bleed`. BLUEPRINT: `docs/design/blueprints/space/margin-bullets.md`. RESEARCHER MUST CAPTURE: per subsystem the as-measured value, the requirement it is held to, that row's full instrument range, and the unit — all four from the same margin report, plus a one-line note on what a shortfall costs.
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

## plate-motion
- **World/Tier:** earth · WebGL · `src/components/topic/earth/PlateMotion.astro`
- **USE WHEN:** the story is tectonic motion of ≥2 plates and the dossier has real Euler poles (lat, lon, ω °/Myr from a NNR-MORVEL / PB2002 reference frame).
- **DON'T USE:** one region's terrain shape (→ `terrain-relief`); earthquakes by depth (→ `quake-depth`); a geo-located point value (→ `data-globe`); a flat per-country choropleth (→ `region-map`); a single plate with no motion contrast.
- **DATA:** `{ plates: [{name, pole:{lat,lon,omega}, color?, samples?, bbox?}], boundaries?, maxVel_mmyr?, caption?, source }`
- **PLAIN:** "Arrows on a globe show which way each tectonic plate moves and how fast — longer is faster, and they vanish where the plate pivots; the heavy lines are the plate boundaries."
- **NOTES:** hero-capable (pairs with `layout: split` or `wide`); ships the one-time asset `public/geo/plates.json`; an "arrows clipped at N mm/yr" honesty chip auto-renders when `maxVel_mmyr` is authored below the true peak |v|. Draw plate `color`s from the earth token family (green/brown/deep), not invented hues. BLUEPRINT: `docs/design/blueprints/earth/plate-motion.md`. RESEARCHER MUST CAPTURE: the Euler-pole reference frame + per-plate poles + the boundary source.

## atmosphere-column
- **World/Tier:** earth · CSS-3D/SVG · `src/components/topic/earth/AtmosphereColumn.astro`
- **USE WHEN:** the reader must feel atmospheric altitude — high-altitude trekking/mountaineering, an aviation-ceiling story, a "where does space begin" explainer; there are ≥2 landmark heights worth pinning.
- **DON'T USE:** terrain shape (→ `terrain-relief`); ground-level bands by value (→ `elevation-profile`); rising WATER against landmarks (→ `sea-level-tank` — the mirror image); a single gauge/number (→ `carbon-gauge`, `data-readout`).
- **DATA:** `{ maxAlt_km?, model?: 'lapse'|'isothermal', landmarks?: [{name, alt_km, note?}], showOxygen?, logAlt?, caption?, source }`
- **PLAIN:** "A slice of the sky stood on end, drawn to true height; each band is one layer of the atmosphere, the curve on the right is how fast the air pressure drops as you climb, and the pinned heights are places you already know."
- **NOTES:** worked example in `2026-06-03-earth-showcase`. Pressure/O₂ computed at build time (geodesy §7); the printed O₂ uses the SAME model that draws the curve. `logAlt:true` auto-renders the `altitude log-compressed` chip (independent of caption). CSS-3D pointer-tilt only; no WebGL.

## carbon-loop
- **World/Tier:** earth · SVG (build-time layout + conservation check, usable cross-world) · `src/components/topic/earth/CarbonLoop.astro`
- **USE WHEN:** the dossier has a stock-and-flow table — named reservoirs with stocks (GtC) and fluxes between them (GtC/yr), ≥3 reservoirs and ≥4 fluxes — and either the flows balance per reservoir OR one named reservoir accumulates and THAT is the point (flag `imbalance: 'the-point'` on the `accent` reservoir, e.g. the atmosphere's airborne fraction).
- **DON'T USE:** a one-directional money/authority cascade with layers (→ `power-flow`, the pure Sankey); a used/remaining budget arc (→ `carbon-gauge`); a single rise level (→ `sea-level-tank`); part-of-whole tiles (→ `data-readout`); a flow with no reservoir sizes (→ `power-flow`).
- **DATA:** `{ unit, reservoirs: [{id, label, stock, x, y, role?: 'store'|'source'|'sink', accent?}], fluxes: [{from, to, value, note?}], imbalance?: 'the-point', residualLabel?, cycle?, year? }`
- **PLAIN:** "Each box is a place carbon is stored, sized by how much it holds; each arrow is a yearly flow between them, thicker and faster where more carbon moves. The brown mark shows the carbon that arrives but never leaves."
- **NOTES:** the stock-and-flow sibling of `power-flow`; box AREA ∝ stock, flux thickness + flowDash speed ∝ value (largest flux fastest — the card's one ambient motion); conservation-checked at build (a `role: 'store'` reservoir that doesn't balance within 1% FAILS the build naming it, unless it is `accent` + `imbalance: 'the-point'`, which draws the `--accent-alt` residual crescent; `source`/`sink` are exempt open boundaries); single green accent, brown reserved for the ONE residual; hero-capable for a carbon/nitrogen/water-cycle issue; pairs with `wide`. BLUEPRINT: `docs/design/blueprints/earth/carbon-loop.md`.

## storm-track
- **World/Tier:** earth · WebGL · `src/components/topic/earth/StormTrack.astro`
- **USE WHEN:** the dossier has a best-track table for ONE (or a few compared) tropical cyclone(s) — timestamped fixes with lat/lon and intensity (max sustained wind, kt). Sources: IBTrACS, NHC/JTWC best-track.
- **DON'T USE:** a static per-region climatology value (→ `region-map`); geo point values (→ `data-globe`); plate motion (→ `plate-motion`); a single station's time series (→ a charted kind); many storms as a density climatology (a handful of named tracks is the ceiling — beyond ~4 it's a heat map).
- **DATA:** `{ storms: [{ name, fixes: [{ t, lat, lon, wind_kt, landfall? }] }], windScale?, smooth? }` — category is DERIVED from `wind_kt` on the fixed Saffir-Simpson ramp, never authored.
- **PLAIN:** "The storm's real path across the ocean, drawn from birth to breakup — the colour of the line is how strong it was at each point, from a weak depression to a top-category hurricane. The glowing point is its peak; the ringed points are where it hit land."
- **NOTES:** hero-capable (pairs with `wide` standalone or `layout: split`); never adjacent to another WebGL kind; opening yaw seeds the mean longitude facing the camera; only the single highest-wind storm's peak pulses. BLUEPRINT: `docs/design/blueprints/earth/storm-track.md`. RESEARCHER MUST CAPTURE: the best-track archive + storm name/year; landfall fixes flagged.

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

## packet-trace
- **World/Tier:** tech · WebGL globe + synced build-time SVG **FLAGSHIP** · `src/components/topic/tech/PacketTrace.astro`
- **USE WHEN:** the dossier has a real trace — an ordered hop list, each with a from/to city (lat/lon) and a measured RTT in ms — and the story is "why is this slow / where does the time go" (a CDN post-mortem, an inter-region latency piece, a submarine-cable story). Total measured RTT and the great-circle light floor must both be computable from the data.
- **DON'T USE:** timed spans of a *local* request with no geography (→ `latency-waterfall`); a multi-stop *travel* journey where the arcs are the point and timing is not (→ `route-globe`); throughput as one live number (→ `throughput-dial`); a static "these cities are far apart" fact (→ `route-globe`/`data-globe`). Never adjacent to another WebGL kind; never `bleed`.
- **DATA:** `{ hops: [{from, fromLat, fromLon, to, toLat, toLon, rttMs, kind?: 'fiber'|'wireless'|'satellite'|'compute', note?}] (1–8), originLabel?, refractiveIndex?, loopMs?, caption?, source? }`
- **PLAIN:** "A world globe with the request's route drawn on it as arcs, above a bar that breaks the round-trip time into the unavoidable speed-of-light minimum (green) and the extra delay routing, servers and handshakes added (pink)."
- **NOTES:** hero-capable (pairs with `layout: split` or `wide`; never `bleed`). NEVER trusts an authored total — floor + measured are summed from `hops` via `packet.ts` at build time, and the SAME pure math feeds the live globe, the static flat-route fallback map, and the budget bar. Honesty chip `floor = {floorMs} ms · measured {measMs} ms` ALWAYS renders; `refractiveIndex: 1.0` adds the `vacuum floor (line-of-sight)` chip; the live scene adds `packets ≈ {loop_s}s / trip`. `compute` hops draw no arc (pulsing ring + all-pink bar segment). BLUEPRINT: `docs/design/blueprints/tech/packet-trace.md`. RESEARCHER MUST CAPTURE: the per-hop from/to cities (lat/lon) + measured RTT + hop kind + the trace source.

## queue-cliff
- **World/Tier:** tech · HTML-interactive (vanilla `is:inline` island; SVG curve, zero WebGL, zero framework) · `src/components/topic/tech/QueueCliff.astro`
- **USE WHEN:** the utilization/latency trade-off is the story — one slider drives offered load ρ and the exact M/M/1 wait multiplier `1/(1−ρ)` climbs to a vertical wall near ρ=1 (capacity-planning, "run too hot" incident, "why we keep headroom").
- **DON'T USE:** a general x/y power or cost curve (→ `scaling-plot`); a single live utilization number without the trade-off (→ `throughput-dial`); a request's timing breakdown (→ `latency-waterfall`); multi-server or priority queues (M/M/1 only — don't fake M/M/c).
- **DATA:** `{ muPerSec | serviceMs, startRho?, maxRho?, annotations?: [{rho, label, tone?}], caption?, source? }`
- **PLAIN:** "One slider raises the load; a live curve shows the average wait staying flat until it snaps vertical near full capacity, with a readout of the exact multiplier, latency, and queue length."
- **NOTES:** tech flagship; hero-capable via `layout: split`; a "loud" interactive — keep a quiet section either side (CANON §3 eye-rest). Always renders the `y capped at {yCap}× · M/M/1` chip and the baked honesty footnote. Companion table (`.px-qc__table`, ≤5 rows) is the no-JS / AT data source. BLUEPRINT: `docs/design/blueprints/tech/queue-cliff.md`.

## chip-die
- **World/Tier:** tech · CSS-3D · `src/components/topic/tech/ChipDie.astro`
- **USE WHEN:** a processor die where the story is relative silicon area — "the GPU is bigger than every CPU core combined." Each block's pixel area equals its real mm².
- **DON'T USE:** a layered architecture stack (→ `arch-stack`); ranked one-metric bars (→ `benchmark-chart`); request timing through a stack (→ `latency-waterfall`).
- **DATA:** `{ chip, dieAreaMm2?, blocks: [{label, areaMm2?|pct?, group?, primary?, count?, note?}], caption?, source? }`
- **PLAIN:** "An exploded chip floorplan drawn to scale; every tile is one functional block, and its size on screen is its real share of the silicon."
- **NOTES:** 4–24 blocks; area given as `areaMm2` OR `pct`+`dieAreaMm2`; coverage <95% shows an explicit Unmapped remainder. On-tile text colour is luminance-picked (dark ink on bright compute/primary fills, light ink elsewhere) to hold WCAG AA. BLUEPRINT: `docs/design/blueprints/tech/chip-die.md`. Worked example in `2026-06-03-tech-showcase`.

## moore-ladder
- **World/Tier:** tech · SVG · `src/components/topic/tech/MooreLadder.astro`
- **USE WHEN:** a dated count series that grows exponentially over ≥3 orders of magnitude — transistor counts per chip/year (the canonical case), sequencing cost, model parameters, storage density — where a doubling time is the claim (≥6 points).
- **DON'T USE:** a general x/y power law or non-doubling scaling relationship (→ `scaling-plot`); an adoption S-curve (→ `adoption-curve`); ranked one-metric bars (→ `benchmark-chart`); die area (→ `chip-die`).
- **DATA:** `{ points: [{year, count, label, highlight?}] (≥6), yLabel?, unit?, fit?, fitRange? }`
- **PLAIN:** "Each dot is one chip at its year and transistor count, plotted on a ruler where every step up means twice as many; the straight line is the steady doubling that turns the curve into a climb."
- **NOTES:** base-2 log y-axis — the `y: log₂ scale` chip ALWAYS renders (CANON §7 log-honesty); the doubling time is COMPUTED from the least-squares slope (`1/m`), never authored; `fitRange` fits a sub-era and prints a `fit: {start}–{end}` chip. Highlight (≤2) draws a chip at accent 1.0 with a right-gutter label + count. BLUEPRINT: `docs/design/blueprints/tech/moore-ladder.md`. Worked example in `2026-06-03-tech-showcase`.


## state-timeline
- **World/Tier:** tech · HTML lanes + marker island · `src/components/topic/tech/StateTimeline.astro`
- **USE WHEN:** 3–8 entities' discrete STATE (healthy / degraded / down, or domain equivalents) across ONE window, plus a numbered event timeline, where the lag between the true onset and the first alert is the argument.
- **DON'T USE:** a continuous metric per service (→ `latency-ridge`, blueprinted, not yet built); one request's spans (→ `latency-waterfall`); a dated narrative history (→ `timeline`); a service dependency graph (→ `service-arcs`, blueprinted, not yet built).
- **DATA:** `{ window: {fromHour,toHour}, states: [{id,label,ok?}] ×2–3 best-first, lanes: [{label, segments:[{from,to,state}]}], marks?: [{n,atHour,label,note?}] }`
- **PLAIN:** "One lane per service across a single day, coloured by state rather than volume: healthy, degraded, or down. The numbered markers are the incident timeline."
- **NOTES:** build FAILS, naming the lane, if any lane's segments leave a gap or an overlap, do not start at `fromHour`, or do not end at `toHour` — a gap in a state timeline reads as "no data" and there is no such state here. Also fails outside 3–8 lanes, 1–12 segments per lane, 2–3 states, more than 8 marks, a segment referencing an undeclared state, a duplicate marker `n`, a marker outside the window, or no state carrying `ok: true`. Per-lane uptime and the default selected marker (the first event AFTER any lane left an ok state — "the first alert") are DERIVED, never authored. Fractional hours are the authoring unit and render as `HH:MM`. The three health colours are a declared data-encoding exemption (same rule as `chamber`'s party colours): the legend names all three and the readout states them in words, so nothing is carried by colour alone. Markers are the one control; segments are not interactive. No honesty chip — nothing is compressed. Pairs with `default` or `wide`; not hero-capable; never `split`. BLUEPRINT: `docs/design/blueprints/tech/state-timeline.md`. RESEARCHER MUST CAPTURE: per service, the state changes as timestamps from a health-check archive or status-page history, covering the whole window with no holes; plus the incident's own event times from the postmortem — deploy, first alert, page raised, fix confirmed.
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

## city-grid
- **World/Tier:** travel · SVG · `src/components/topic/travel/CityGrid.astro`
- **USE WHEN:** 1-3 cities compared by the *shape* of their street grid, each drawn as a 36-petal orientation rose; a gridded plan collapses to a cross, an organic one fans to a circle.
- **DON'T USE:** two cities on numeric travel rows (→ `city-compare`); a single route's geography (→ `route-globe` / `journey-map`); a non-place radial profile (→ `player-radar`).
- **DATA:** `{ cities: [{name, subtitle?, bins[36], orderScore?}], caption?, source? }`
- **PLAIN:** "Each city is a compass wheel of 36 spokes; a spoke's length is how much of that city's streets run in that direction, so a grid makes a sharp cross and a tangle makes a full circle."
- **NOTES:** travel signature; hero-capable; per-city-normalised (auto 'normalised per city' honesty chip whenever >1 city, independent of caption); Boeing (2019) order phi readout; exactly 36 bins per city enforced at build; static SVG, no WebGL. BLUEPRINT: `docs/design/blueprints/travel/city-grid.md`.

## altitude-oxygen
- **World/Tier:** travel · SVG/CSS-3D · `src/components/topic/travel/AltitudeOxygen.astro`
- **USE WHEN:** a high-altitude trek where the *physiological cost of altitude* is the argument — effective oxygen thinning with height, with named acclimatization stops (2–8) at known elevations.
- **DON'T USE:** a route's up-and-down elevation over distance (→ `elevation-trek`); earth-science band structure with no oxygen story (→ `elevation-profile`, earth); a whole atmosphere's layer stack (→ `atmosphere-column`, earth).
- **DATA:** `{ stops: [{name, elevM, nights?, note?}], maxElevM?, model?, seaLevelO2Pct? }`
- **PLAIN:** "Height runs up the side; the column's width is the oxygen the air still carries there, and each teal tent is a night spent letting the body catch up."
- **NOTES:** x-axis is *modelled* effective O₂ (barometric, geodesy §7) — a mono `model:` chip always renders. BLUEPRINT: `docs/design/blueprints/travel/altitude-oxygen.md`. Worked example in `2026-06-03-travel-showcase`.

## season-wheel
- **World/Tier:** travel · CSS-3D · `src/components/topic/travel/SeasonWheel.astro`
- **USE WHEN:** a "when to go" story for ONE destination with per-month values on 2–3 of {climate/comfort, crowd, price} — the annual shape and the sweet-spot window (good weather ∧ thin crowds ∧ low price) are the argument.
- **DON'T USE:** a linear month heat-ribbon for a quick glance (→ `climate-calendar`, travel — if only temp/rain matter); multi-decade climate (→ `climate-strip` / `climate-spiral`, earth); comparing two destinations' months (→ `city-compare`). One destination only.
- **DATA:** `{ place, months: [12 ×{climate?, crowd?, price?, label?}], rings?, sweetSpot?, caption?, source? }`
- **PLAIN:** "The year runs clockwise from January; each month's three arcs are how good the weather is, how thick the crowds are, and how high the prices climb. The best time to go is where the inner arc is full and the outer two are empty."
- **NOTES:** tilted CSS-3D disc + one month scrubber (never `layout: split`); hero-capable. Metrics are normalised 0–1 indices, not raw °C/₹/headcounts (auto `indices 0–1` chip). BLUEPRINT: `docs/design/blueprints/travel/season-wheel.md`. RESEARCHER MUST CAPTURE: all 12 months' climate-comfort / crowd / price indices + the recommended window. Worked example in `2026-06-03-travel-showcase`.

## fare-terrain
- **World/Tier:** travel · SVG · `src/components/topic/travel/FareTerrain.astro`
- **USE WHEN:** a fare-timing / "when to book" story — per-route median fare over days-before-departure (≥6 points each, 1–5 routes) stacked as a ridgeline, where the booking sweet-spot IS the argument.
- **DON'T USE:** a trip's cost split into categories (→ `data-readout` / `comparison`); a route's geography (→ `route-globe` / `journey-map`); the when-to-*go* seasonal dial (→ `climate-calendar` — that's month-of-year, this is days-before-departure).
- **DATA:** `{ routes: [{label, points:[{daysBefore, fare}], highlight?}], unit, sweetSpotDays? }`
- **PLAIN:** "Each ridge is one route's fare as departure nears — time runs left to right toward the flight, higher ground means a pricier ticket, and the shaded valley is the window where fares bottom out."
- **NOTES:** reversed x-axis (far-out left → departure right) auto-declares a `time → departure` chip; absent `sweetSpotDays` computes the contiguous ≤1.05×min valley; single focal route in accent-deep, the rest ink (no per-route rainbow). BLUEPRINT: `docs/design/blueprints/travel/fare-terrain.md`. Worked example in `2026-06-03-travel-showcase`.


## attrition-waffle
- **World/Tier:** travel · HTML waffle grid + one group-select island · `src/components/topic/travel/AttritionWaffle.astro`
- **USE WHEN:** a rate out of exactly 100 with 3–6 outcome groups, where the point is that the reader can COUNT it — a published completion or survival rate that deserves auditing.
- **DON'T USE:** any n not normalised to 100 (the countability IS the kind); a distribution of a continuous value (→ `price-swarm`); stages of attrition in order (→ `bill-funnel`, politics); a part-of-whole where area is the quantity (→ `revenue-mosaic`, tech).
- **DATA:** `{ groups: [{id, label, count, color?, note?}], n?: 100, trueN?, subject?, caption?, source? }`
- **PLAIN:** "A hundred squares, one per person who started, grouped by where they stopped. Nothing is scaled or estimated — you can count the squares, and each colour block is exactly as many people as it looks like."
- **NOTES:** ONE control (group select). The ledger rows are the only tab stops and the only AT path; the cell blocks share one delegated handler as a pointer convenience and carry no role or tabindex, because the grid is a single `role="img"`. Build FAILS on: counts not summing to exactly 100 (the error prints the actual sum), fewer than 3 or more than 6 groups, a duplicate group `id`, `n` present and ≠ 100, any group that comes to zero squares, fractional counts without `trueN`, and `trueN` set without the caption stating that real n. Geometry is 20 across × 5 down — **not** 10×10; the five-row silhouette is held at 375px, where the grid takes the card's full width so the cell stays near the countability floor. Colours are an ordered ramp (`--accent-deep` → `--accent` → accent paled 30% toward paper → ink 0.55 / 0.34 / 0.22); `groups[].color` overrides a step but is NOT a data-encoding exemption. `trueN` auto-renders the `per hundred · n = {trueN}` chip — and there is no other honesty chip, because nothing is scaled. No count-up and no stagger: an animated waffle turns an auditable figure into a performance. NEVER give this kind a `TRIM` in `src/lib/story.ts` — capping the groups drops squares and the sum check then throws at build. Pairs with `default`; not hero-capable (at hero scale the squares stop reading as countable units). BLUEPRINT: `docs/design/blueprints/travel/attrition-waffle.md`. Worked example in `2026-06-03-travel-showcase`. RESEARCHER MUST CAPTURE: the outcome tally for every member of one cohort as counts rather than percentages, the real sample size, and a sourced one-line reason for each outcome group.
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

## elo-river
- **World/Tier:** sports · SVG · `src/components/topic/sports/EloRiver.astro`
- **USE WHEN:** a rating time series — 3–10 teams, each with ≥6 dated Elo / SPI / power values from a NAMED model over one window; the relative rise/fall and the crossovers are the story.
- **DON'T USE:** current standings as a snapshot (→ `league-table`); one match's momentum (→ `momentum-wave`); two teams' cumulative xG within a match (→ `xg-race`); a single team's multi-axis profile (→ `player-radar`). If there is no *rating* (just points/wins), it is a `league-table`.
- **DATA:** `{ model, kInfo?, dates: [ISO ascending, 6–40], baseline?, teams: [{name, short?, color?, ratings: [num|null], subject?}], caption?, source? }`
- **PLAIN:** "Each coloured ribbon is one team, and how thick it is shows its rating; the ribbons stack and weave, so a team climbing past another crosses over it in the braid."
- **NOTES:** worked example in `2026-06-03-sports-showcase`. Team `color`s are a blueprint-declared data-encoding exemption (the legend lists every one); omit them and the fallback single-accent-plus-ink cycle is used. `null` ratings render a hollow (0.4× fill) span + the `dashed spans interpolated` chip. At most one `subject` is honoured. BLUEPRINT: `docs/design/blueprints/sports/elo-river.md`.

## court-value
- **World/Tier:** sports · SVG · `src/components/topic/sports/CourtValue.astro`
- **USE WHEN:** a model-scored value field over pitch/court space (xG, eFG, points-per-shot) — the geography of where a chance is worth taking, drawn as filled contour bands.
- **DON'T USE:** individual shots as plotted events with outcomes (→ `shot-map`); a formation's player positions (→ `tactics-pitch`); cumulative match xG over time (→ `xg-race`).
- **DATA:** `{ surface?: 'football-box'|'football-half'|'basketball-half', model, valueLabel, valueRange?, shots?: [{x,y,value}] | grid?: {cols,rows,values[]}, levels?, showShots?, smoothed? }`
- **PLAIN:** "The pitch is shaded by how much a shot from each spot is worth; the lines are contours, like a map's height lines, joining places of equal value."
- **NOTES:** worked example in `2026-06-03-sports-showcase`. BLUEPRINT: `docs/design/blueprints/sports/court-value.md`.

## pace-ridge
- **World/Tier:** sports · SVG (build-time KDE + ridgeline layout; `html.js`-gated reveal, no runtime compute) · `src/components/topic/sports/PaceRidge.astro`
- **USE WHEN:** a measurable quantity with a SAMPLE for the subject AND ≥1 comparison group (≥ ~15 obs each) where the SHAPE of the difference (shift vs spread vs tail) is the argument — sprint speeds, shot distances, serve speeds, lap times.
- **DON'T USE:** one number per entity with no spread (→ `player-radar` / `player-card` / a bar); values over time (→ `elo-river`, `xg-race`); spatial value (→ `court-value`).
- **DATA:** `{ metric, unit, source_n?, stat?: 'mean'|'median', domain?: [min,max], groups: [{label, samples: number[], subject?}], caption?, source? }`
- **PLAIN:** "Each stacked shape is one group's whole range of the stat; wider where more values cluster, with a line at the middle. The volt shape is the athlete this story follows."
- **NOTES:** build-time Gaussian KDE (Silverman bandwidth, ONE global height scale so a genuinely peakier ridge reads taller) — authors pass raw `samples`, never pre-bin; at most one `subject` (volt ridge + dashed guideline across the full stack); `kernel density` honesty chip + per-ridge `n=`; `stat` auto-renders the `med`/`μ` tick. BLUEPRINT: `docs/design/blueprints/sports/pace-ridge.md`. RESEARCHER MUST CAPTURE: the subject's per-observation sample of the metric and ≥1 comparison group's sample, from a NAMED dataset.

## channel-ternary
- **World/Tier:** sports · SVG ternary · `src/components/topic/sports/ChannelTernary.astro`
- **USE WHEN:** 4–12 entities split across exactly THREE mutually exclusive shares summing to 100, where the lopsidedness is the argument.
- **DON'T USE:** more or fewer than three parts (→ `player-radar` for many axes, `comparison` for two); positions on the pitch (→ `tactics-pitch`); a value surface (→ `court-value`); a two-way split of a total (→ `revenue-mosaic`, tech).
- **DATA:** `{ corners: [{id,label} ×3], entities: [{name, short?, values:[l,t,r], note?}] }`
- **PLAIN:** "A triangle, because the three shares must add to a hundred and only two are ever free; distance FROM a corner is how little that channel is used."
- **NOTES:** build FAILS if any entity's three values do not sum to 1.0 ±0.001, or outside 4–12 entities. The plot carries NO dot labels — eight names cannot be placed in a 300px triangle without collision, so the table is the identity layer, not an optional fallback. Pairs with `default`; never `bleed`.


## finish-interval
- **World/Tier:** sports · HTML interval rows + one team-select island · `src/components/topic/sports/FinishInterval.astro`
- **USE WHEN:** a projection with real UNCERTAINTY per entity (8–20 entities, a central estimate plus an interval from a NAMED simulation) where the overlap between intervals is the argument — who is still catching whom with N matchdays left.
- **DON'T USE:** settled standings (→ `league-table`); a rating history over time (→ `elo-river`); a single win probability (→ `data-readout`); a completed bracket (→ `knockout-bracket`); a distribution of observations rather than a range (→ `pace-ridge`).
- **DATA:** `{ model, runs?, positions, zones?: [{fromPos, toPos, label, tone: 'good'|'bad'}], rows: [{name, median, low, high, note?}], caption?, source? }`
- **PLAIN:** "The dot is the most likely finishing position and the bar is the range the model gives nine times out of ten; where two bars overlap, nothing on the pitch has decided the order between those teams yet."
- **NOTES:** build FAILS if any row has `low === high` (a zero-width interval is a standing — use `league-table`), if `low <= median <= high` breaks, if any row runs outside the 1–`positions` scale, outside 8–20 rows, or if `model` is missing. The overlap count is DERIVED, never authored — it drives both the readout and the table's column. `model` is composed into the source line by the component, so it cannot go missing. Zone strips are inset to the bar track, not the row, and are deliberately near-invisible (22% accent over the card surface) because they are context, not data. No honesty chip — the position scale is linear and complete. Pairs with `default` or `wide`; not hero-capable. BLUEPRINT: `docs/design/blueprints/sports/finish-interval.md`. RESEARCHER MUST CAPTURE: the simulation's NAME and run count, the league size, and per team the median plus the 5th/95th-percentile finishing positions — never a range invented around a published projection.
<!-- check:catalog expects exactly the SECTION_KINDS list above this line -->
