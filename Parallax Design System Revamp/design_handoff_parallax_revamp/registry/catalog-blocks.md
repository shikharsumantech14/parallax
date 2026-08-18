# Catalog blocks — 28 new kinds

Paste into `docs/design/catalog.md`, each block at the position matching its
`SECTION_KINDS` slot (see `SECTION_KINDS.diff.md`) — `npm run check:catalog`
enforces 1:1 **and order**. All blocks go **above** the trailing
`<!-- check:catalog expects … -->` comment.

Block grammar follows the file: World/Tier · USE WHEN · DON'T USE · DATA ·
PLAIN · NOTES.

Five of these carry `DON'T USE` lines negotiated against existing kinds — and
those existing blocks need a reciprocal line appended. See `../COLLISIONS.md`
for the exact edits; do both sides or the drafter gets routed wrong.

---

## majority-flow
- **World/Tier:** politics · SVG (build-time Sankey + one chip-set island) · `src/components/topic/politics/MajorityFlow.astro`
- **USE WHEN:** a standing chamber where the route from party groups to a working majority IS the argument — the dossier has every group's seat count (Σ = chamber), a bloc assignment per group, and the majority threshold; the story is which partners the largest bloc cannot afford to lose.
- **DON'T USE:** money or authority moving between institutions (→ `power-flow`); one division's blocs splitting for/against/abstain (→ `vote-flow`); coalition arithmetic played out on a single bar (→ `coalition-calculus`); the chamber as a portrait (→ `chamber`).
- **DATA:** `{ groups: [{id, label, seats, bloc, color?}], blocs: [{id, label, canLegislate: boolean, color?}], majority, chamberTotal, unit?, caption?, source? }`
- **PLAIN:** "Every seat enters on the left as one of several groups, merges into a bloc in the middle, and arrives at whether that bloc can pass a law alone; ribbon thickness is seats and the dashed line is the number needed."
- **NOTES:** three FIXED layers (group → bloc → outcome), unlike `power-flow`'s arbitrary DAG; conservation-checked at build — Σ group seats must equal `chamberTotal` and each bloc's inflow its own total, or the build FAILS naming the group. Selecting a group renders the walk-out counterfactual in an `aria-live` readout; no-JS paints the unselected state plus the full group ledger. Party colours are a data-encoding exemption (same rule as `chamber`). `wide`, hero-capable; never `split`. ⚠ merge candidate with `coalition-calculus` — see `COLLISIONS.md` §5.

## rank-bump
- **World/Tier:** politics · SVG · `src/components/topic/politics/RankBump.astro`
- **USE WHEN:** 4–8 entities' finishing *positions* across 4–8 ordered contests, where overtakes and the stability of the top places are the argument.
- **DON'T USE:** vote shares or seat counts over time (→ `approval-chart` for a series, `seat-chart` for a table); ranked-choice round transfers (→ `ballot-flow`); ratings with a magnitude (→ `elo-river`, sports).
- **DATA:** `{ contests: [label], entities: [{name, short?, color?, ranks: [number]}], caption?, source? }`
- **PLAIN:** "Each line is one party and the only thing plotted is where it finished; vertical distance is places, not votes, so a line can climb steeply on very few extra ballots."
- **NOTES:** the y-axis is ordinal and inverted (1 at top) — it carries NO magnitude, and the plain line must say so. `ranks` must be a complete permutation per contest (build FAILS on a duplicate or a gap). Hover/focus isolates one line at full opacity, the rest to 0.16. Pairs with `default`/`wide`; not hero-capable.

## bill-funnel
- **World/Tier:** politics · HTML bars · `src/components/topic/politics/BillFunnel.astro`
- **USE WHEN:** a *population* of bills counted at each procedural stage in order (≥4 stages, monotonically non-increasing), where the attrition between stages is the argument.
- **DON'T USE:** ONE bill's journey through the stages (→ `bill-passage`); what a bill contains (→ `bill-breakdown`); a dated legislative history (→ `timeline`).
- **DATA:** `{ stages: [{label, count, note?}], unit?, caption?, source? }`
- **PLAIN:** "The same bills counted again at every stage they had to clear; bar length is how many were still alive there, and the darker segment is what was lost since the row above."
- **NOTES:** build FAILS if any stage exceeds the one before it (a funnel cannot widen). The per-row loss segment is derived, never authored. Each stage's `note` surfaces in the readout on press. Pairs with `default`; never `split`.

## age-pyramid
- **World/Tier:** politics · HTML bars, mirrored · `src/components/topic/politics/AgePyramid.astro`
- **USE WHEN:** a body's composition by age band and a binary split (4–8 bands), where either the concentration of bands or the constancy of the split is the argument.
- **DON'T USE:** party composition (→ `chamber` / `seat-chart`); one attribute compared across 2–3 entities (→ `comparison`); a single distribution with no split (→ a bar list in `data-readout`).
- **DATA:** `{ bands: [{label, left, right}], sides: {left: {label, color?}, right: {label, color?}}, mode?: 'count'|'share', caption?, source? }`
- **PLAIN:** "One row per age band, oldest at the top, with bars running outward from the centre line — one side per sex; read it as counts for the size of each band, or as shares to compare bands of very different sizes."
- **NOTES:** `share` mode normalises each row to its OWN total and auto-renders the `share of band` honesty chip — the two modes answer different questions and the toggle labels must say which. Bars share one scale in `count` mode (the widest band sets it). No-JS paints `mode`'s default. Pairs with `default`.

## turnout-margin
- **World/Tier:** politics · SVG connected scatter · `src/components/topic/politics/TurnoutMargin.astro`
- **USE WHEN:** exactly two numeric series over 4–8 ordered periods where the *relationship between them* changes — the path doubling back is the argument.
- **DON'T USE:** one series over time (→ `approval-chart`); two series that move together and just need two lines (→ `approval-chart` with two series); ranked positions (→ `rank-bump`).
- **DATA:** `{ x: {label, unit}, y: {label, unit}, points: [{period, x, y, note?}], caption?, source? }`
- **PLAIN:** "Each dot is one election placed by turnout across the bottom and the winner's margin up the side, joined in time order; where the path doubles back, the two numbers stopped moving together."
- **NOTES:** the connecting path is time-ordered, NOT a fit — never draw a trend line through it. Point labels use the per-point offset table in the blueprint §4 (a naive placement collides at 375px). Hover/focus reads out both values plus the change since the previous period. Pairs with `default`/`wide`.

## mission-timeline
- **World/Tier:** space · HTML gantt · `src/components/topic/space/MissionTimeline.astro`
- **USE WHEN:** a mission's phases on ONE elapsed clock (4–8 phases) plus fixed milestones, where the disproportion between phase durations is the argument.
- **DON'T USE:** a dated real-world history (→ `timeline`); altitude over time during one descent (→ `descent-profile`); a Δv budget (→ `delta-v-ladder`).
- **DATA:** `{ phases: [{label, fromDay, toDay, note?}], milestones?: [{label, atDay, slip?: 'none'|'hours'|'days'}], totalDays?, caption?, source? }`
- **PLAIN:** "One bar per phase on a single clock that starts at launch, so bar length is real duration; the diamonds on the lower lane are the moments that cannot be rescheduled."
- **NOTES:** a phase narrower than 3px still renders at a 3px floor and auto-renders the `shortest phase at minimum width` chip — the whole point of the kind is usually that one phase is invisibly short, and faking its width honestly is the design. Labels move outside the bar below 120px. Pairs with `default`.

## porkchop-grid
- **World/Tier:** space · SVG/HTML matrix · `src/components/topic/space/PorkchopGrid.astro`
- **USE WHEN:** a launch-opportunity story where cost is a function of BOTH departure and arrival date — the dossier has (or the blueprint's model derives) a Δv per pairing over a grid, and the shape of the feasible island is the argument.
- **DON'T USE:** one specific transfer's geometry and window timing (→ `transfer-window`); a pure Δv budget with no date dimension (→ `delta-v-ladder`); the interplanetary geometry itself (→ `solar-system`).
- **DATA:** `{ departures: [label], arrivals: [label], cells: number[][], unit, bands: [{max, label}], vehicleLimit?, caption?, source? }`
- **PLAIN:** "Departure dates run across the bottom, arrival dates up the side, and every cell is one pairing; colour is the velocity change that trip needs, so the bright island is the launch window and everything outside it is a trip the rocket cannot make."
- **NOTES:** BANDED, never a continuous ramp — a reader cannot decode a smooth gradient, and the bands are the legend. `vehicleLimit` renders the "not flyable" band in `--ink` @ 0.18 with an explicit legend entry. Axis labels must state their step (the prototype's first draft mislabelled a 4-day step as 16-day). Hover/focus reads Δv + flight time + penalty against the grid minimum. `wide`, hero-capable.

## debris-histogram
- **World/Tier:** space · SVG log-axis bars · `src/components/topic/space/DebrisHistogram.astro`
- **USE WHEN:** a size- or magnitude-binned population spanning ≥3 orders of magnitude (5–8 bins), where a detectability or capability threshold splits the bins and the invisible majority is the argument.
- **DON'T USE:** a satellite constellation's spatial distribution (→ `constellation-swarm`); counts over time (→ `launch-stats`); a value distribution with real samples (→ `pace-ridge`).
- **DATA:** `{ bins: [{label, count, flagged?: boolean, note?}], flagLabel?, countUnit?, caption?, source? }`
- **PLAIN:** "Objects sorted into size bins, smallest on the left, on a scale where each gridline is ten times the one below — so a bar one step taller means ten times as many, not twice."
- **NOTES:** log₁₀ y-axis ALWAYS auto-renders the `log scale · each step ×10` honesty chip; gridlines are labelled 10¹…10ⁿ, never with raw numbers, and each bar carries its true count as a mono label. The `flagged` filter dims rather than removes bins (removing them hides the argument). Pairs with `default`.

## margin-bullets
- **World/Tier:** space · HTML bullet rows · `src/components/topic/space/MarginBullets.astro`
- **USE WHEN:** 4–8 measurements each against its OWN requirement, in units that do not compare (dB, kg, °C, W), where whether each one closes is the argument.
- **DON'T USE:** values sharing one unit and scale (→ `benchmark-chart`, tech); a stacked energy budget (→ `delta-v-ladder`); telemetry band strengths (→ `signal-readout`).
- **DATA:** `{ rows: [{label, value, required, max, unit, note?}], caption?, source? }`
- **PLAIN:** "One row per subsystem, each on its own scale because decibels and kilograms do not compare; the bar is what it has, the tick is what it needs, and a bar short of its tick does not close."
- **NOTES:** each row is normalised to its own `max` — the blueprint requires the row label to carry the unit so no reader compares two rows' lengths. Rows failing their requirement use `--accent-alt`, never red-by-default (the world accent may already be red). The readout gives the signed margin in that row's unit. Pairs with `default`.

## river-multiples
- **World/Tier:** earth · SVG small multiples · `src/components/topic/earth/RiverMultiples.astro`
- **USE WHEN:** 6–16 series over the same cycle (usually 12 months) where the comparison is TIMING or SHAPE, not magnitude — and the series' magnitudes differ enough that one shared scale would flatten most of them.
- **DON'T USE:** one series' long record (→ `climate-strip` / `climate-spiral`); values that share a scale and should be compared by size (→ `comparison` / a bar list); a single destination's year (→ `season-wheel`, travel).
- **DATA:** `{ cycle?: [label], panels: [{name, values: number[], peakLabel?, peakValue?, unit?, note?}], caption?, source? }`
- **PLAIN:** "One small panel per series, each scaled to its own peak — so heights compare shapes and not volumes, and what you are comparing is when the water arrives."
- **NOTES:** per-panel normalisation ALWAYS auto-renders the `each panel scaled to its own peak` honesty chip (this is the kind's central honesty risk). Every panel carries its real peak value as a mono caption so magnitude is recoverable. 4-up grid desktop, 2-up at 375px. Pairs with `wide`.

## heat-uptake
- **World/Tier:** earth · SVG stacked area · `src/components/topic/earth/HeatUptake.astro`
- **USE WHEN:** 3–6 components of a growing total over a long series, where the story is that the SPLIT stays constant while the total grows (or that it does not).
- **DON'T USE:** a single total over time (→ `climate-strip`); a stock-and-flow budget with conservation (→ `carbon-loop`); part-of-whole at one instant (→ `revenue-mosaic`, tech, or `data-readout`).
- **DATA:** `{ from, to, components: [{id, label, share, color?, note?}], total: [{period, value}], unit, mode?: 'absolute'|'share', caption?, source? }`
- **PLAIN:** "The bands stack, so the top edge is the whole total and each band is one place it went; read it absolute to watch the total grow, or as shares to see the split hold steady."
- **NOTES:** shares must sum to 1.0 ±0.001 or the build FAILS. `share` mode is the argument-carrying view — the toggle is not decoration, and the plain line changes with it. Band labels sit inside their band above 10% and move to a leader line below it (the two thin bands collide otherwise). Pairs with `wide`, hero-capable.

## glacier-dumbbell
- **World/Tier:** earth · HTML dumbbell rows · `src/components/topic/earth/GlacierDumbbell.astro`
- **USE WHEN:** 5–12 entities measured at exactly TWO times, where absolute and relative change rank them differently and that disagreement is the argument.
- **DON'T USE:** a continuous series per entity (→ `climate-strip`); one entity's before/after (→ `comparison`); a spatial distribution of change (→ `region-map`).
- **DATA:** `{ times: [earlierLabel, laterLabel], unit, rows: [{name, earlier, later, note?}], sort?: 'relative'|'absolute', caption?, source? }`
- **PLAIN:** "Two dots per entity — hollow for the earlier survey, filled for the later — with a bar between for what was lost; the percentage is that loss against the entity's own starting size."
- **NOTES:** positions use √-compression when max/min > 20 (one huge entity otherwise squashes the rest to the axis) and then auto-render the `positions √-compressed` chip. The sort toggle is the argument: the two orders disagree, and the plain line names which entity each order promotes. Pairs with `default`.

## rain-calendar
- **World/Tier:** earth · HTML day grid · `src/components/topic/earth/RainCalendar.astro`
- **USE WHEN:** a full year of DAILY values where the concentration of extremes is the argument — a total that a monthly average would hide.
- **DON'T USE:** monthly values for a when-to-go decision (→ `climate-calendar`, travel); multi-decade annual records (→ `climate-strip` / `climate-spiral`); a single month's detail (→ `data-readout`).
- **DATA:** `{ year, unit, days: [{month, day, value}], bands: [{max, label}], monthTotals?: boolean, caption?, source? }`
- **PLAIN:** "One row per month, one cell per day, darkest for the wettest — the same annual total could be a drizzle across every row or a handful of very dark cells."
- **NOTES:** BANDED fills with a legend, never a continuous ramp. Short months pad with transparent cells so all 12 rows align on a 31-column grid. The plain line must carry the concentration statistic (what share of the total falls on what share of days) — computed, never authored. Cells are 14px desktop / 8px at 375px, which is the floor before the grid stops being countable. Pairs with `wide`.

## flame-graph
- **World/Tier:** tech · HTML nested bars · `src/components/topic/tech/FlameGraph.astro`
- **USE WHEN:** ONE profiled operation's call tree with self-times (depth ≥3), where the cost sits deeper than the obvious top-level frames.
- **DON'T USE:** spans of one request across services (→ `latency-waterfall`); a distribution of many requests (→ `latency-ridge`); a service dependency graph (→ `service-arcs`).
- **DATA:** `{ root: FrameNode, unit?, caption?, source? }` where `FrameNode = { name, self, children?: FrameNode[] }` — totals are derived, never authored.
- **PLAIN:** "The top bar is one request and every bar below it is a function called by the bar above; width is time spent inside that function and everything it called, depth is stack depth, and horizontal position means nothing."
- **NOTES:** the plain line MUST state that horizontal position is meaningless — it is the one thing every reader gets wrong. Labels are fitted to the frame's measured pixel width with an ellipsis, and dropped entirely below ~5 characters (never sliced at a fixed character count and clipped — that was the prototype's bug). Depth palette is a single-hue ramp of `--accent` at descending lightness, max 6 steps. Pairs with `wide`, hero-capable.

## latency-ridge
- **World/Tier:** tech · SVG ridgeline · `src/components/topic/tech/LatencyRidge.astro`
- **USE WHEN:** response-time distributions for 4–8 ORDERED releases (newest first) against a named threshold, where the median and the tail move in opposite directions.
- **DON'T USE:** peer groups compared for distribution shape with no threshold (→ `pace-ridge`, sports); one request's span breakdown (→ `latency-waterfall`); throughput as a single rate (→ `throughput-dial`).
- **DATA:** `{ metric, unit, threshold: {at, label}, scale?: 'log'|'linear', releases: [{label, samples: number[]} | {label, median, tailPct, secondPeakAt?}], caption?, source? }`
- **PLAIN:** "One ridge per release, newest at the top, each showing how a day of requests was distributed; the tick is that release's median and the shaded foot is everything past the threshold."
- **NOTES:** ⚠ merge candidate with `pace-ridge` — see `COLLISIONS.md` §3. Differs by three things that are all first-class here: time-ordered groups, a named threshold with a shaded tail, and a per-ridge tail percentage in the readout. Log x-axis auto-renders the `log scale` chip. Prefer raw `samples` (build-time KDE, Silverman bandwidth, ONE global height scale as `pace-ridge` does); the summary form is a fallback for when only percentiles survive. Pairs with `default`/`wide`.

## service-arcs
- **World/Tier:** tech · SVG arc diagram · `src/components/topic/tech/ServiceArcs.astro`
- **USE WHEN:** a call graph of 6–12 services that has a natural request ORDER, where backward edges (cycles) are the argument.
- **DON'T USE:** a request's timing breakdown (→ `latency-waterfall`); geographic hops (→ `packet-trace`); a value flow that conserves (→ `power-flow`, politics); a layer-by-layer network (→ `neural-flow`).
- **DATA:** `{ services: [{id, label, order?, volume?}], calls: [{from, to, rate, note?}], rateUnit, caption?, source? }`
- **PLAIN:** "Every service sits on one line in request order and each arc is one service calling another; arcs above the line run forwards, and an arc below the line is a service calling something upstream of it."
- **NOTES:** node order is the spine of the chart — authored via `order`, or topologically sorted at build with cycles broken by volume (the break must be logged, not hidden). Backward arcs render below the axis in `--accent-alt` and are counted in the plain line. Arc width is √(rate) so one dominant edge cannot swamp the rest. Node labels rotate −90°. Pairs with `default`/`wide`.

## revenue-mosaic
- **World/Tier:** tech · HTML marimekko · `src/components/topic/tech/RevenueMosaic.astro`
- **USE WHEN:** a total split two ways at once (3–5 primary × 2–4 secondary), where AREA is the quantity and the secondary mix inverts across the primary segments.
- **DON'T USE:** a single part-of-whole split (→ `data-readout` tiles); components of a growing total over time (→ `heat-uptake`, earth); two or three entities compared attribute by attribute (→ `comparison`).
- **DATA:** `{ total?, unit, segments: [{id, label, value, accounts?, parts: [{label, share}], note?}], caption?, source? }`
- **PLAIN:** "The whole rectangle is the total; column width is what a segment contributes and the blocks inside are how that segment splits — so block area is real money while block height is a share within its column only."
- **NOTES:** the height-vs-area confusion is this kind's central risk: the plain line must state it, and every block ≥16% carries its own absolute value so the reader never has to multiply. Each segment's `parts` shares must sum to 1.0 ±0.001 (build FAILS). Below ~14% width a column drops its in-block labels to the readout only. Pairs with `wide`.

## state-timeline
- **World/Tier:** tech · HTML lanes · `src/components/topic/tech/StateTimeline.astro`
- **USE WHEN:** 3–8 entities' discrete STATE over one window plus an event timeline, where the lag between the true onset and the first alert is the argument.
- **DON'T USE:** a continuous metric per service (→ `latency-ridge`); one request's spans (→ `latency-waterfall`); a dated narrative history (→ `timeline`).
- **DATA:** `{ window: {fromHour, toHour} | {from, to}, states: [{id, label, color, ok?: boolean}], lanes: [{label, segments: [{from, to, state}]}], marks?: [{n, atHour, label, note?}], caption?, source? }`
- **PLAIN:** "One lane per service across a single day, coloured by state rather than volume; the numbered markers are the incident timeline."
- **NOTES:** colour is CATEGORICAL state, not a scale — a legend is mandatory and the three health colours are a declared non-themeable encoding (green/amber/red read as status across every world). Segments must tile each lane with no gaps or overlaps (build FAILS naming the lane). Per-lane uptime is derived. Pairs with `default`/`wide`.

## attrition-waffle
- **World/Tier:** travel · HTML 10×10 grid · `src/components/topic/travel/AttritionWaffle.astro`
- **USE WHEN:** a rate out of exactly 100 with 3–6 outcome groups, where the point is that the reader can COUNT it — a published completion or survival rate that deserves auditing.
- **DON'T USE:** any n that is not normalised to 100 (the countability is the whole kind); a distribution of a continuous value (→ `price-swarm`); stages of attrition in order (→ `bill-funnel`, politics).
- **DATA:** `{ n?: 100, groups: [{id, label, count, color?, note?}], subject?, caption?, source? }`
- **PLAIN:** "A hundred squares, one per person who started, grouped by where they stopped — nothing is scaled or estimated, so each block is exactly as many people as it looks like."
- **NOTES:** counts must sum to exactly 100 (build FAILS) — if the real n is not 100, the caption states the true n and that the squares are per-hundred. Squares fill row-major from the top-left in group order; no interleaving. Selecting a group dims the others to 0.2 and surfaces its `note`. Pairs with `default`.

## fare-spread
- **World/Tier:** travel · SVG range bars · `src/components/topic/travel/FareSpread.astro`
- **USE WHEN:** a price or duration DISTRIBUTION per month (or per category) where the spread, not the central value, is the argument — the dossier has min/q1/median/q3/max per period.
- **DON'T USE:** fare against days-before-departure — the when-to-book story (→ `fare-terrain`); a trip's cost split by category (→ `data-readout`); every individual observation (→ `price-swarm`).
- **DATA:** `{ metric, unit, periods: [{label, min, q1, median, q3, max}], caption?, source? }`
- **PLAIN:** "One bar per month: the thin line is the full range, the solid bar is the middle half, and the notch is the median — a short bar means the month has one price, a long one means booking date decides."
- **NOTES:** requires min ≤ q1 ≤ median ≤ q3 ≤ max per period (build FAILS naming the period). The readout gives the dearest-to-cheapest ratio, which is the number the kind exists to expose. Any prose claim that one month's floor undercuts another's ceiling must be verified against the payload — check the actual overlapping period, not the adjacent one. Pairs with `default`.

## price-swarm
- **World/Tier:** travel · SVG beeswarm · `src/components/topic/travel/PriceSwarm.astro`
- **USE WHEN:** 20–60 individual observations of one value where the cluster and its outliers are both the argument, and the gap between mean and median is the point.
- **DON'T USE:** summary quartiles per period (→ `fare-spread`); a smooth distribution of a large sample (→ `pace-ridge`, sports); values over time (→ `fare-terrain`).
- **DATA:** `{ metric, unit, scale?: 'log'|'linear', items: [{name, value, note?}], caption?, source? }`
- **PLAIN:** "One dot per observation placed left to right by price; dots are nudged vertically only so they do not overlap, so height carries no meaning and where they pile up is where the market is."
- **NOTES:** the plain line MUST state that vertical position is meaningless. Both mean and median are marked and labelled on separate rows (they collide at 9px otherwise) — the distance between them is the outliers' effect on the average, and the readout names it. Log x when max/min > 6, with the honesty chip. Collision packing is deterministic (8px buckets, alternating above/below) so the render is stable across builds. Pairs with `default`.

## route-criteria
- **World/Tier:** travel · SVG parallel coordinates · `src/components/topic/travel/RouteCriteria.astro`
- **USE WHEN:** 4–8 options scored on 4–6 criteria in DIFFERENT units, where no option dominates and the trade-off is the argument.
- **DON'T USE:** one entity's multi-axis profile (→ `player-radar`, sports); two entities on numeric rows (→ `city-compare`); a single ranking (→ `league-table`, sports, or a table).
- **DATA:** `{ axes: [{id, label, bestLabel, worstLabel, higherIsBetter?: true}], options: [{name, color?, values: {axisId: number}}], caption?, source? }`
- **PLAIN:** "Five vertical axes, one per criterion, each scaled so its own best value is at the top; every option is a line crossing all five, and crossing lines mean those two disagree on that pair."
- **NOTES:** values are normalised 0–1 indices per axis with the best at the top — the axis end labels (`bestLabel`/`worstLabel`) carry the real units, and the `indices 0–1 · best at top` chip always renders. If one option dominates on every axis the kind is the wrong choice — the blueprint's acceptance check asserts at least one crossing. Selecting an option traces it and names its weakest axis. Pairs with `wide`.

## daylight-band
- **World/Tier:** travel · SVG band · `src/components/topic/travel/DaylightBand.astro`
- **USE WHEN:** usable daylight across a whole year at one or more latitudes, where WHEN the light falls (not just how much) affects the plan.
- **DON'T USE:** a day/night terminator for one moment and one flight (→ `terminator-globe`); clock offsets between cities (→ `timezone-arc`); altitude physiology (→ `altitude-oxygen`).
- **DATA:** `{ latitudes: [{id, label, lat}], year?, showCivilTwilight?: boolean, months?: [label], caption?, source? }` — sunrise/sunset are computed from `lat` by the solar-position model, not authored.
- **PLAIN:** "The shaded band is the time between sunrise and sunset across the year; its thickness is usable hours and its position is when they happen."
- **NOTES:** derived from the declination + hour-angle model in `docs/design/physics/` — mirror the sheet, do not re-derive. Local clock time, no daylight saving, and the caption says so. y-axis is clock time 03:00–21:00 fixed, so the band's vertical MOVEMENT is comparable between latitude presets. Selecting a month reads out sunrise, sunset, length, and the delta against the solstice. Pairs with `default`.

## knockout-bracket
- **World/Tier:** sports · SVG bracket · `src/components/topic/sports/KnockoutBracket.astro`
- **USE WHEN:** a completed single-elimination draw of 4/8/16 teams WITH pre-match odds per tie, where the improbability of the winner's run is the argument.
- **DON'T USE:** a league's standings (→ `league-table`); ratings over a season (→ `elo-river`); one match's flow (→ `momentum-wave` / `xg-race`).
- **DATA:** `{ rounds: [label], teams: [{id, name, short?, seed?, odds?}], matches: [{round, index, a, b, winner, score?}], caption?, source? }`
- **PLAIN:** "Teams enter on the left and one leaves on the right; every fork is a match and the surviving line carries on, with line thickness for how likely the bookmakers thought that survival was."
- **NOTES:** **each match draws TWO feeder links** — from slots `2·index` and `2·index+1` of the round, both terminating at slot `index` of the next round. Getting this wrong leaves half the bracket unconnected; it is the one place the prototype had a real bug, and blueprint §4 gives the indexing explicitly with an acceptance check for it. Losing feeders render as 1px `--ink` @ 0.28 hairlines so every team has a traceable path. Scores are winner-first. `wide`, hero-capable.

## volume-accuracy
- **World/Tier:** sports · SVG quadrant scatter · `src/components/topic/sports/VolumeAccuracy.astro`
- **USE WHEN:** 8–20 entities on two rates whose PRODUCT is a meaningful total, where position relative to both averages is the argument.
- **DON'T USE:** one entity's multi-axis profile (→ `player-radar`); shots by pitch location (→ `shot-map`); a value surface over space (→ `court-value`).
- **DATA:** `{ x: {label, unit}, y: {label, unit}, size?: {label}, entities: [{name, short?, x, y, size?, note?}], quadrantLabels?: [4 × string], caption?, source? }`
- **PLAIN:** "Each dot is a team placed by how often it attempts something and how often that works; the dashed lines are the league averages, and dot size is the two multiplied out."
- **NOTES:** quadrant captions go in an HTML row BELOW the plot, not as SVG text inside it — in-plot corner labels collide with dots at 375px and read as data. Dot area (not radius) ∝ `size`, and `size` must be derivable from x × y × opportunities or the encoding lies. Per-dot label offsets come from the blueprint §4 table. Pairs with `default`.

## goal-clock
- **World/Tier:** sports · SVG dual-axis · `src/components/topic/sports/GoalClock.astro`
- **USE WHEN:** events binned across a fixed period (12–20 blocks) where both the per-block rate AND the cumulative share carry the argument.
- **DON'T USE:** two teams' cumulative xG within one match (→ `xg-race`); momentum swing (→ `momentum-wave`); a distribution with real samples (→ `pace-ridge`).
- **DATA:** `{ period: {label, blocks: number, unit}, bars: [{label, share}], intervalAt?: number, cumulativeLabel?, caption?, source? }`
- **PLAIN:** "The bars count events in each block on the left-hand scale; the line is the running share of all events by that minute on the right-hand scale — the line is just the bars added up."
- **NOTES:** dual axis is permitted here ONLY because the line is literally the cumulative sum of the bars — never for two independent series. Bar shares must sum to 100 ±0.1 (build FAILS). Right-hand axis is fixed 0–100% and labelled in `--accent-deep` to bind it to the line. Any prose claim about the 50% crossing must be computed from the payload, not asserted. Pairs with `default`.

## channel-ternary
- **World/Tier:** sports · SVG ternary · `src/components/topic/sports/ChannelTernary.astro`
- **USE WHEN:** 4–12 entities split across exactly THREE mutually exclusive shares summing to 100, where the lopsidedness is the argument.
- **DON'T USE:** more or fewer than three parts (→ `player-radar` for many axes, `comparison` for two); positions on the pitch (→ `tactics-pitch`); a value surface (→ `court-value`).
- **DATA:** `{ corners: [3 × {id, label}], entities: [{name, short?, values: [a, b, c], note?}], caption?, source? }`
- **PLAIN:** "A triangle, because the three shares must add to a hundred and only two are ever free; each corner is an entity playing entirely down that channel and the centre is an even split."
- **NOTES:** every entity's three values must sum to 1.0 ±0.001 (build FAILS) — the constraint IS the reason for the geometry. Gridlines at 25/50/75% on all three axes; the centroid is marked so "balanced" is a visible position rather than an inference. The plain line must explain that distance from a corner means LOW use of that channel — readers assume the opposite. Pairs with `default`; never `bleed`.

## finish-interval
- **World/Tier:** sports · HTML interval rows · `src/components/topic/sports/FinishInterval.astro`
- **USE WHEN:** a projection with real UNCERTAINTY per entity (8–20 entities, a central estimate and an interval from a named simulation), where the overlap between intervals is the argument.
- **DON'T USE:** settled standings (→ `league-table`); a rating history (→ `elo-river`); a single win probability (→ `data-readout`).
- **DATA:** `{ model, runs?, positions: number, zones?: [{fromPos, toPos, label, tone: 'good'|'bad'}], rows: [{name, median, low, high, note?}], caption?, source? }`
- **PLAIN:** "The dot is the most likely finishing position and the bar is the range the model gives nine times out of ten; overlapping bars mean the order between those teams is not yet decided."
- **NOTES:** the interval is the content — a version of this chart without it is a `league-table` and should be one. `model` and `runs` are mandatory in the source line. Zone strips must be inset to the bar TRACK, not the full row (a strip spanning the label column misstates the scale — the prototype's one layout bug). The readout counts overlapping intervals. Pairs with `default`/`wide`.
