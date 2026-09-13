# The catalog by data shape — which component for which data

> The lookup the **composer** (the storyboard agent) reads before picking a
> kind, and the drafter's replacement for the eleven inline data shapes its
> prompt used to carry (REGISTER-PLAN RG-08, 2026-09-13 — those eleven were,
> near enough, the only kinds ever published). Every one of the 98 registered
> kinds appears exactly once below, grouped by the SHAPE of the data it needs.
> Pick by shape first, then open the kind's `## <kind>` block in `catalog.md`
> for USE WHEN / DON'T USE / DATA / PLAIN. This file is a separate document
> rather than a section of `catalog.md` because `check-catalog.mjs` treats
> every `## heading` there as a kind.
>
> **[3D]** = WebGL scene (lazy `three`, never adjacent to another 3D kind).
> **[i]** = has a control, so it authors a `howToRead` and shows the panel by
> default (`NEEDS_HOW`). Descriptions are trimmed from the catalog's USE WHEN.

## How to use this table

1. Take one beat of the argument: *what must the reader get here?*
2. Ask what the data IS — a count against a threshold, a series over time, a
   share of a whole, a flow, a place, a distribution, a comparison of peers.
3. Read that group. Prefer the plainest kind that shows the shape; reach for
   a 3D or instrument kind only when the interaction *is* the explanation and
   the dossier carries the data it needs (the catalog block says what).
4. Never two text-only kinds adjacent; at least six in ten sections visual;
   at least one kind from outside the six workhorses (`prose`, `data-readout`,
   `timeline`, `paradox`, `quote`, `comparison`) per issue.

## G1 · Narrative — no data shape (7)

| Kind | One line |
|---|---|
| `hero` | **dead** — deleted with the launch design; still registered, never rendered; do not author |
| `act-break` | a typographic chapter divider between acts; consumes no number |
| `prose` | the connective argument; ≤ 200 words a section, ≤ 3 sections an issue |
| `quote` | one verified verbatim quote with an exact attribution |
| `analogy` | an allocation rule told through named household characters (politics-bespoke today) |
| `beat-sheet` | a mechanism compressed into ordered beats with time markers |
| `plate` | a framed photograph; renders nothing without an image |

## G2 · Two or three peers, attribute by attribute (6)

| Kind | One line |
|---|---|
| `comparison` | two or three entities compared row by row; the read-across matters |
| `paradox` | two facts both true, pulling opposite ways — two blocks of prose, no mark; ≤ 1 per issue |
| `city-compare` | exactly two places, with a winner per row |
| `match-stat-line` | one match, home vs away stat rows |
| `player-radar` | one player across 5–8 axes as a shape; optional comparison shape |
| `player-card` [i] | one player as a flip rating card |

## G3 · One number against a threshold, or a few headline numbers (6)

| Kind | One line |
|---|---|
| `data-readout` | 3–6 headline numbers as instrument tiles, one accented |
| `vote-result` | one decisive vote against the threshold it needed |
| `carbon-gauge` | a budget as a gauge: used against remaining |
| `swing-dial` | a single value on a two-bloc scale |
| `throughput-dial` | one throughput or utilisation gauge with zones |
| `margin-bullets` [i] | 4–8 measurements each against its own requirement, in mixed units |

## G4 · Time series and dated sequence (16)

| Kind | One line |
|---|---|
| `timeline` | dated events with one or two hinge moments; ≤ 6 events, notes ≤ 20 words |
| `approval-chart` | approve vs disapprove over time; the crossovers are the story |
| `climate-strip` | one annual value per year as colour drift |
| `adoption-curve` | percent adoption over years tracing an S-curve, milestones marked |
| `launch-stats` | events counted per year, optionally split by operator |
| `moore-ladder` | a dated count series over three or more orders of magnitude, on a doubling ladder |
| `elo-river` | 3–10 teams' dated ratings as a braid; crossovers are the story |
| `climate-spiral` [i] | a monthly series spiralling by year: season plus drift |
| `commit-grid` | activity intensity over weeks, contribution-graph density |
| `descent-profile` | altitude against time with named event markers |
| `latency-waterfall` | timed spans laid end to end: where the milliseconds go |
| `state-timeline` [i] | several entities' health lanes plus an incident clock |
| `climate-calendar` | monthly temperature and rainfall for a when-to-go call |
| `season-wheel` [i] | one destination's year as a radial dial: weather, crowds, price |
| `xg-race` [i] | cumulative expected goals for two teams, minute by minute |
| `momentum-wave` | match momentum swinging over the minutes, with event markers |

## G5 · Ranking (3)

| Kind | One line |
|---|---|
| `benchmark-chart` | entities ranked on one metric as horizontal bars, one highlighted |
| `league-table` | standings: position, points, form, movement |
| `margin-ladder` | ranked win or loss margins: safe seats against knife-edge ones |

## G6 · Composition, parts of a whole, layers (16)

| Kind | One line |
|---|---|
| `seat-chart` | seat counts per party or state with a change column |
| `bill-breakdown` | a bill's provisions as cards, one of them the key payload |
| `chamber` [3D] | the seat-by-party composition of a whole chamber, plus a division walk |
| `coalition-orbit` [3D] | seat shares as party bodies orbiting a core |
| `coalition-calculus` [i] | build a coalition against the majority line |
| `age-pyramid` [i] | composition by age band with a binary split; counts or shares |
| `attrition-waffle` [i] | a rate out of exactly 100 as countable squares |
| `channel-ternary` [i] | entities split across three shares that sum to 100 |
| `chip-die` [i] | a die floorplan where each block's area equals its real share |
| `orbital-shells` | occupancy of altitude bands (low, medium, geostationary) |
| `delta-v-ladder` | an energy budget broken into named segments |
| `signal-readout` | per-band frequency and strength readings |
| `elevation-profile` | vertical structure by labelled bands with values |
| `core-sample` | a vertical core by depth; layers with labels and values |
| `arch-stack` | a layered system: what sits on what |
| `power-matrix` | institutions crossed with parties, each cell a control state |

## G7 · Process, flow, stage attrition (9)

| Kind | One line |
|---|---|
| `bill-passage` | a bill advancing stage by stage with a status at each |
| `bill-funnel` [i] | a population of bills surviving each procedural stage |
| `vote-flow` | blocs flowing into for / against / abstain; the split within each |
| `power-flow` | money or authority flowing source → via → sink, with totals |
| `ballot-flow` [i] | ranked-choice round transfers, exhausted ballots included |
| `carbon-loop` | a stock-and-flow cycle: reservoirs and fluxes, conservation-checked |
| `journey-map` | a route as named stops with distance, elevation, notes |
| `route-card` | a journey as legs: from, to, mode, distance, duration |
| `itinerary-reel` | a day-by-day itinerary as flip-through cards |

## G8 · Geographic (11)

| Kind | One line |
|---|---|
| `region-map` | a value shaded per country or zone on a flat world map |
| `data-globe` [3D] | geo-located point values at real latitude and longitude |
| `route-globe` [3D] | a multi-stop journey arced across a globe |
| `terrain-relief` [3D] | real elevation-model topography of one bounded region |
| `plate-motion` [3D] | a plate velocity field from real Euler poles |
| `storm-track` [3D] | a cyclone's best-track fixes, strength-coloured |
| `packet-trace` [3D] | hop-by-hop round-trip time against the great-circle light floor |
| `terminator-globe` [3D] | the day-night line plus a flight arc: jet-lag geometry |
| `gerrymander-lens` [i] | the same votes under three district plans, with the efficiency gap |
| `city-grid` | street-orientation polar histograms: grid against tangle |
| `timezone-arc` | city offsets against a reference, with overlap and sun position |

## G9 · Physics, orbital mechanics, physical scale (13)

| Kind | One line |
|---|---|
| `solar-system` [3D][i] | navigable Keplerian orbits from real elements |
| `orbit-globe` [3D] | orbital shells and satellite populations around Earth |
| `constellation-swarm` [3D] | a true satellite census on its real shells |
| `flight-of-the-ball` [3D] | a drag-plus-Magnus trajectory from launch parameters |
| `orbit-trace` | a handful of named orbits by altitude and inclination, on a squeezed scale |
| `trajectory-arc` | a flight path by altitude and downrange distance |
| `transfer-window` [i] | Hohmann transfer cost, time and the phase window |
| `lagrange-map` | the three-body effective-potential field: where the pulls balance |
| `eclipse-cone` | umbra and penumbra geometry to scale from three radii |
| `atmosphere-column` | a barometric altitude column with landmark heights |
| `altitude-oxygen` | effective oxygen against altitude with acclimatisation stops |
| `sea-level-tank` | scenario sea-level rise against landmarks the reader knows |
| `elevation-trek` | elevation along a route with named waypoints |

## G10 · Distribution, relationship, uncertainty (6)

| Kind | One line |
|---|---|
| `scaling-plot` [i] | an x/y scaling relationship, optional log axes and a fit |
| `pace-ridge` | a quantity's distribution shape per group: shift, spread, tail |
| `finish-interval` [i] | projected position plus a 90% interval; overlaps mean undecided |
| `queue-cliff` [i] | the M/M/1 utilisation cliff: the latency wall near full load |
| `fare-terrain` | per-route fare over days before departure as a ridgeline; the booking sweet spot |
| `quake-depth` | seismic events on a depth × time scatter |

## G11 · Network / DAG (2)

| Kind | One line |
|---|---|
| `version-graph` | a commit or release graph: branches, merges, tags |
| `neural-flow` [3D] | a forward pass across real layer sizes |

## G12 · Spatial field on a playing surface (3)

| Kind | One line |
|---|---|
| `tactics-pitch` [i] | player positions and formation: the spatial set-up |
| `shot-map` | shots by location and expected goals, with outcomes |
| `court-value` | a model-scored value surface over pitch or court space |

## Planned under REGISTER-PLAN RG-09 (not yet registered)

`you-think` (G2: what you think / what the data shows), `jargon-buster` (G1:
2–4 terms with one-line meanings), `number-sense` (G3: one big number made
physical), `three-steps` (G1: a mechanism in three cards); `analogy`
generalised to a universal this ↔ that mapping. Until they land, the nearest
existing kinds are `paradox`, `comparison`, `data-readout` and `bill-passage`.
