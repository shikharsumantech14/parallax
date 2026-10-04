# Parallax component catalog

> The single source of truth for WHAT TO USE WHEN. One `##` block per section
> kind, in `SECTION_KINDS` order (`src/content/config.ts`) — `npm run
> check:catalog` enforces the 1:1 match. Pipeline agents (composer, drafter,
> stylist, researcher) read this file; humans too. Deep specs live in
> `docs/design/blueprints/<world>/<kind>.md` where one exists (a blueprint that
> predates Lens Phase 6 may describe a drawing the NOTES line says is retired:
> the NOTES line wins).
>
> LENS (2026-09-30). The visual law is `docs/design/LENS.md`. Its reading
> system (§5) is prose beside a pinned figure, joined by CUES: the section's
> own sentences carry numbered `[[n]]` markers, and each marker's cue lights
> the part of the figure it names. The plain line and the how-to-read panel
> are GONE: they stopped rendering in Lens Phase 3, the pipeline stopped
> authoring `plain` and `howToRead` in Phase 7, and since Phase 8
> (2026-10-04) the schema fails the build on either.
>
> Block grammar: World/Tier (the component path) · USE WHEN (dossier
> conditions) · DON'T USE (and what instead) · DATA (shape sketch) · CUES ·
> BUILD · NOTES (layout pairing, world, what the drawing is, blueprint link,
> RESEARCHER MUST CAPTURE).
>
> - **CUES** lists the anchor ids the component exposes as `data-cue="<id>"`,
>   exactly as its `Cue anchors:` header block lists them, one clause each on
>   what the id names. A section's `cues: [{n, at, text?}]` names these ids in
>   `at` (several separated by spaces). `1`…`n` means one id per item,
>   numbered from 1 in DATA order (authored order, before any sort); a prefixed
>   range (`m1`…`mK`) is the same with a prefix; `<…>` is an id taken from the
>   data (a party `id`, a year). `none` marks a narrative kind (`act-break`,
>   `prose`, `quote`, `analogy`): it runs in the article column with no
>   figure panel and carries no cues. Every other kind takes **two to four
>   cues** per section. `npm run check:catalog` (check 7) asserts every id on
>   a CUES line appears in its component.
> - **BUILD** is the order the `build.ts` island builds the figure in
>   (LENS §6.4), and the counter if there is one. No JS or reduced motion
>   paints the final state. The component declares the order; it never
>   animates itself.
>
> THE COMPREHENSION FIELDS (Lens). `caption` is the DATA claim, the finding,
> printed once at the end of the article column; the verifier traces it. Each
> cue sentence (the sentence its `[[n]]` marker introduces, or the cue's
> `text`) is a data claim too, traced exactly like the caption. Never let a
> caption or a cue sentence merely describe the shape, and never let either
> name a scale the reader can change with a control (a `· log scale` tail on
> a toggle-able axis). A `data-readout` tile, a `timeline` event, a
> `you-think` text, a `jargon-buster` term and a `three-steps` step are set as
> sentences in the article and get their cue button automatically when a cue
> names them; everywhere else the marker goes before its sentence in `intro`,
> `caption`, a prose kind's `data.paragraphs`, the `you-think` texts or a
> timeline event's `note`. `source` renders once, from `core/Section.astro`
> (the figure panel's foot on desktop): components render no source.
> Which components to pick for which data: `docs/design/catalog-shapes.md`,
> the twelve data shapes the composer reads.
>
> STATUS (2026-09-30, the Lens verdict): covers all **87** kinds registered in
> `SECTION_KINDS`. From 101, ten kinds were DROPPED (`beat-sheet`, `plate`,
> `orbital-shells`, `elevation-profile`, `coalition-orbit`, `ballot-flow`,
> `orbit-globe`, `signal-readout`, `data-globe`, `route-globe`: no component,
> no block, a section naming one fails the build) and four FOLDED into a host
> (`city-compare` → `comparison`, `swing-dial` and `throughput-dial` →
> `gauge`, `itinerary-reel` → `itinerary`); `carbon-gauge` was renamed
> `gauge` and `route-card` renamed `itinerary`. The six retired names are
> ALIASES (`KIND_ALIASES` in `src/content/config.ts`): they still build, and
> they have no block here, so never author one. `docs/design/LENS.md` §9.
> Blueprinted kinds not yet built remain under `docs/design/blueprints/`,
> landing via `scripts/wire-kind.mjs`. Adding a block here without the
> matching `SECTION_KINDS` entry breaks `npm run check:catalog`, which runs in
> `prebuild`, so it fails the build. The same check asserts every kind has a
> KIND_PRIORITY score, and (check 7) that every id on a block's CUES line is
> a `data-cue` in its component. The EXPLAIN entry it once asserted is gone
> with `src/lib/explainers.ts`, deleted in Lens Phase 8 (2026-10-04); a new
> kind's blocks need a CUES line and a BUILD line instead, and
> `scripts/wire-kind.mjs` refuses one without both.

## act-break
- **World/Tier:** universal · narrative divider · `src/components/core/ActBreak.astro`
- **USE WHEN:** opening a new act of the issue (CANON.md §3: 2–4 acts, each 2–4 sections) — the argument shifts register or scene.
- **DON'T USE:** as decoration between every section; an act break must mark a real structural pivot.
- **DATA:** `{ act: 'II', title?, epigraph? }`
- **CUES:** none (a narrative kind: it runs in the article column with no figure panel, so it carries no cues)
- **BUILD:** the rulers fade in, then the side rules grow out from the numeral, then the numeral rises, then the title and epigraph rise. No counter.
- **NOTES:** consumes NO section number (numbering skips it). Lens Phase 6 (board Lib-act-break): a band on the well with a ruler along its top and bottom edges, the Roman numeral at 160 (88 on a phone) in the desk text colour between double rules, the optional title and epigraph under it. It is air: generous margins are the point. Never bare: author `act`, or the page prints "I" twice.

## timeline
- **World/Tier:** universal (politics-styled) · v2 kit `.tl` · `src/components/topic/politics/Timeline.astro`
- **USE WHEN:** a dated sequence where order and turning points carry the argument — the dossier has 4+ dated events with one or two hinge moments.
- **DON'T USE:** a bill's procedural stages (→ `bill-passage`); un-dated steps of a mechanism (→ `three-steps`).
- **DATA:** `{ events: [{date, label (**bold** ok), note, state?: 'default'|'key'|'fail'|'now'}] }` + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the event's `date` string or its 0-based index; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `1`…`n` each event row, in data order (a cued event gets its cue button in the article automatically, no marker needed; a [[n]] marker may also sit in an event's note)
- **BUILD:** the rows drop in, in date order, 80ms apart. No counter; a hover never scales a node.
- **NOTES:** politics-styled but used across all worlds. Lens Phase 6 (board Lib-timeline): a vertical spine with the year set against it where the year turns, a node per event (`key` filled in the desk mark and ringed, `fail` a mark ring, `now` filled in the desk text ink), the spine thick in the desk mark from the first `key` event on. In the reading system the article carries each event as a sentence (date, **label**, note, annotation) and the figure keeps the year ticks and the labels.

## bill-breakdown
- **World/Tier:** politics · classic card stack (`.px-bills`) · `src/components/topic/politics/BillBreakdown.astro`
- **USE WHEN:** decomposing what a bill/policy package actually contains — provisions as cards, one flagged as the key payload.
- **DON'T USE:** the bill's journey through readings/houses (→ `bill-passage`); a straight two-way contrast (→ `comparison`).
- **DATA:** `{ cards: [{label, title, body, bullets?, primary?: true}] }`
- **CUES:** `1`…`n` each card, in data order (the payload keeps its own number although it is drawn first)
- **BUILD:** the payload card fades in, then the other cards drop in, 80ms apart, then the payload's number rises.
- **NOTES:** politics world; pairs well after a `timeline` showing how the package arrived. Lens Phase 6 (board Lib-bill-breakdown): the payload card (`primary: true`, else the first) set large on the desk tint with its number at 96 and a stroke pictogram chosen from its own words; the other provisions as small paper cards two to a row, `body` and `bullets` still printed.

## vote-result
- **World/Tier:** politics · v2 kit `.vb` (MP-dot chamber) · `src/components/topic/politics/VoteResult.astro`
- **USE WHEN:** one decisive vote against a threshold — dossier has for/against/required numbers and the shortfall is the story.
- **DON'T USE:** blocs splitting into positions (→ `vote-flow`); many races/margins at once (→ `margin-ladder`).
- **DATA:** `{ for, against, required, present, shortfall, label, stamp, followup }`
- **CUES:** `for` the yes dots and the for count · `against` the no dots and the against count · `line` the required line and its "n needed" label · `short` the shortfall bracket, its label and the headline number · `stamp` the verdict stamp
- **BUILD:** the dots fade in (for, then against, then the rest), then the required line draws, then the bracket draws and the labels and legend rise, then the headline number (the shortfall) counts up and the stamp fades in.
- **NOTES:** politics signature; hero-capable. Lens Phase 6 (board Lib-vote-result): the shortfall at 96 with the stamp beside it, then the dot chamber filled down the columns, the required line as a solid rule, a bracket from the last yes vote to the line; the SVG holds no text (every word is HTML). `followup` renders under the figure.

## seat-chart
- **World/Tier:** politics · classic table (`.px-seats`) · `src/components/topic/politics/SeatChart.astro`
- **USE WHEN:** seat counts per party/state with current numbers and a change column — a redistribution/shift story.
- **DON'T USE:** whole-chamber composition by bloc (→ `chamber`); a single vote (→ `vote-result`).
- **DATA:** `{ subtitle, source, rows: [{name, region, current, change}], quote: {text, attribution} }`
- **CUES:** `<region>` each region band, by the rows' `region` value (for example north, south) · `1`…`n` each row, in data order
- **BUILD:** the table head and the axis fade in, then the region bars and the row bars grow from their origin (the rows from the centre axis), then the change values rise, then the band totals rise.
- **NOTES:** politics world. Lens Phase 6 (board Lib-seat-chart): the regions as two stacked bands (gain as a desk-mark extension, loss as a dashed slot, the net change at 48), then the table with each row's change as a diverging bar from a centre axis. The regions and their totals are DERIVED from the rows' `region`, never authored. The built-in quote slot renders under the figure and replaces a separate `quote` section.

## comparison
- **World/Tier:** universal · core · `src/components/core/Comparison.astro`
- **USE WHEN:** two or three peer entities compared attribute by attribute (systems, bills, eras, two cities) — read-across rows matter.
- **DON'T USE:** a contradiction where the tension is the point (→ `paradox`); one value against a scale (→ `gauge`).
- **DATA:** THREE forms. Matrix (read ACROSS a row): `{ sides: [{label, title (*italic* ok), kicker?, tag?}], rows: [{label, values: [string × sides]}] }`. List (parallel columns that do NOT pair up row by row — a done / not-done ledger): `{ columns: [{label, items: [string | {text, strong?: true}]}] }`; `columns` wins when present. Until 2026-09-15 only the list form was documented and only the matrix form was implemented, so a section authored from this line rendered an empty card. Pair (the folded `city-compare`, two places with a winner per row): `{ cityA: {name, subtitle?}, cityB: {name, subtitle?}, rows: [{label, a, b, winner?: 'a'|'b'|'tie', note?}] }` — normalised onto the matrix, the winning cell marked, a row's `note` full width under it.
- **CUES:** `1`…`n` each row in the matrix and pair forms, each column in the list form, in data order · `s1`…`sN` each side's plate at the head (matrix and pair forms)
- **BUILD:** the plates (or the list columns) drop in, then the rows drop in, 80ms apart.
- **NOTES:** universal; 2–3 columns only. Lens Phase 6 (board Lib-comparison): the sides are plates at the head, the last on the desk tint (the side the reader is walked toward); a pair row's winning cell carries a drawn check. `city-compare` is an ALIAS of this kind since the Lens verdict (2026-09-30, `KIND_ALIASES` in `src/content/config.ts`): author `comparison` with the pair form.

## paradox
- **World/Tier:** universal (politics-styled) · v2 kit `.px2` · `src/components/topic/politics/Paradox.astro`
- **USE WHEN:** two facts that are both true and pull in opposite directions — the tension IS the section's claim.
- **DON'T USE:** a plain A-vs-B feature comparison (→ `comparison`); a contradiction the prose resolves immediately (→ `prose`).
- **DATA:** `{ sides: [{label, statement (*italic* ok), detail}], figure?: {value, label, was?} }` — the first two sides are drawn; `figure` (Lens Phase 6) sets the one number that divides them at 96, and with `was` a before / now pair of bars on one scale
- **CUES:** `1`, `2` the two plates, in data order · `gap` the tension mark between them · `figure` the number and its bars (only when `figure` is authored)
- **BUILD:** the plates fade in, then the spine draws, then the arrows fade in, then the bars grow, then the number counts up.
- **NOTES:** politics-styled but used across worlds; one per issue is usually enough. Lens Phase 6 (board Lib-paradox): two plates facing each other on the desk tint, each statement in Newsreader italic at 28 with its `detail` under it at 14, and between them a drawn tension mark (a dashed spine, two arrows pulling apart). Counts as text-only for the composition floors.


## you-think
- **World/Tier:** universal · HTML, static · `src/components/core/YouThink.astro` · VizCard
- **USE WHEN:** the dossier's structural argument corrects one specific common belief, and one sourced figure does the correcting — the brand's reframe ("stories you think you already understand") as a component. Usually the first or second section.
- **DON'T USE:** two legitimate positions in tension (→ `paradox`); a feature-by-feature contrast (→ `comparison`); a correction with no number behind it (→ `prose`). One per issue.
- **DATA:** `{ think: {label?, text ≤ 30 words}, actually: {label?, value?, unit?, text ≤ 30 words}, note? ≤ 20 words }` + `caption` (the data claim) + `source`
- **CUES:** `1` the belief panel · `2` the record panel · `3` the record's figure (a cue on 1 or 2 gets its button in the article automatically, before that text; a [[n]] marker may also sit inside think.text or actually.text)
- **BUILD:** the belief drops in, then the slash fades, then the record drops, then its figure counts up when it is one plain number (else it rises).
- **NOTES:** quiet section; `layout: default`. The article carries both texts with their cue buttons; the figure keeps the two labels, the belief as a dashed box and the record as a ruled one with its figure. BLUEPRINT: `docs/design/blueprints/core/you-think.md`. Worked example in `2026-06-03-politics-showcase` and in `2026-09-28-verdict-arrived-sentence-didnt`.
## analogy
- **World/Tier:** universal · narrative device (`.px-analogy`) · `src/components/topic/politics/BrothersAnalogy.astro` (generalised 2026-09-13, REGISTER-PLAN RG-09)
- **USE WHEN:** an unfamiliar mechanism maps one-for-one onto something the reader already handles — 2–5 rows of *the real thing ↔ the everyday thing*, with one number in a note where it keeps the mapping honest.
- **DON'T USE:** a side-by-side of two real things (→ `comparison`); two legitimate positions in tension (→ `paradox`); a mechanism that runs in order rather than in parallel (→ `three-steps`); one misconception corrected (→ `you-think`).
- **DATA:** `{ headline?, pairs: [{this ≤ 12 words, that ≤ 12 words, note? ≤ 16 words}] (2–5), punchline? }` — or the politics-bespoke legacy form `{ headline?, brothers: [{code, role, desc, kids}], punchline? }`, which wins when present (the delimitation issue).
- **CUES:** none (a narrative kind: it runs in the article column with no figure panel, so it carries no cues)
- **BUILD:** the rows drop in, 80ms apart, then the punchline rises. No counter.
- **NOTES:** quiet section, narrative (the article column, no figure panel, no cues). Lens Phase 6 (board Lib-analogy): a two-column read-across under a head rule ("The real thing" · "Like this"), a drawn double arrow in the desk mark between each pair, the pair's `note` under it; the row number stands where the board drew a pictogram. The legacy `brothers` form draws as two cards. Worked example in `2026-06-03-earth-showcase`.

## quote
- **World/Tier:** universal · core · `src/components/core/Quote.astro`
- **USE WHEN:** one verified verbatim quote carries more weight than any chart — attribution known, wording exact from the dossier.
- **DON'T USE:** paraphrases or composite quotes (→ `prose` with attribution); a quote that only supports a table (→ `seat-chart`'s quote slot).
- **DATA:** `{ quote, attribution, followup }`
- **CUES:** none (a narrative kind: it runs in the article column with no figure panel, so it carries no cues)
- **BUILD:** the quote mark fades in, then the words rise, then the rule draws and the attribution rises. No counter.
- **NOTES:** quiet section (act rhythm); verbatim only. Narrative: the article column, no figure panel, no cues. Lens Phase 6 (board Lib-quote): the opening mark at 120 in the desk mark, the words in Newsreader up to 32 (22 on a phone), a short rule and the attribution.

## jargon-buster
- **World/Tier:** universal · HTML cards in the figure panel · `src/components/core/JargonBuster.astro`
- **USE WHEN:** the issue needs more than one term of art and glossing them in-line would clog a paragraph; the glosses come from `research/_voice/jargon.md`. Sits right before the first section that uses the terms.
- **DON'T USE:** one term (gloss it in the sentence); a comparison of entities (→ `comparison`); a sequence (→ `three-steps`).
- **DATA:** `{ terms: [{term, meaning ≤ 25 words, hindi? ≤ 10 words (Roman script, set roman)}] }` — 2–4 entries; story mode trims to 4
- **CUES:** `1`…`n` each term's card, in data order (the article carries each term and its meaning as a sentence, and a cued term gets its button automatically)
- **BUILD:** the cards drop in, 80ms apart, then each card's figure rises. No counter.
- **NOTES:** NOT narrative since Lens Phase 6 (board Lib-jargon-buster): a graphic section with a figure panel and cues. The article carries each meaning as a sentence; the panel carries a two-by-two grid of cards, each with its term and, where the meaning carries a figure, that figure at 48 lifted verbatim from the meaning. Still a plain-language card for the composition floors (not a drawn graphic). BLUEPRINT: `docs/design/blueprints/core/jargon-buster.md`. Worked example in `2026-06-03-sports-showcase`.

## three-steps
- **World/Tier:** universal · HTML chain in the figure panel · `src/components/core/ThreeSteps.astro`
- **USE WHEN:** the dossier describes a mechanism with a clear order — cause, what it does, what it leaves behind — and no data series to draw. Often right before the chart that shows the mechanism's result.
- **DON'T USE:** dated events (→ `timeline`); timed beats of an episode (→ `timeline`); a bill's stages (→ `bill-passage`); a mechanism with numbers at each stage (→ `power-flow`, `carbon-loop`).
- **DATA:** `{ steps: [{title ≤ 6 words, text ≤ 25 words}] }` — 2–4, three is the shape; story mode trims to 4
- **CUES:** `1`…`n` each step's card, in data order (the article carries each step's text as a sentence, and a cued step gets its button automatically)
- **BUILD:** the cards drop in, 80ms apart, then the arrows draw, then the step numbers rise. No counter.
- **NOTES:** NOT narrative since Lens Phase 6 (board Lib-three-steps): a graphic section with a figure panel and cues. The panel draws the steps as a chain of cards (the number at 48 beside "STEP n", the title in Newsreader, a drawn arrow to the next); the article carries each step's text. Still a plain-language card for the composition floors (not a drawn graphic). BLUEPRINT: `docs/design/blueprints/core/three-steps.md`. Worked example in `2026-06-03-earth-showcase`.
## prose
- **World/Tier:** universal · core · `src/components/core/Prose.astro`
- **USE WHEN:** the argument itself — connective narrative between structural sections; the issue's voice lives here.
- **DON'T USE:** to narrate data a viz already shows; to smuggle in a list (→ a structured kind).
- **DATA:** `{ paragraphs: [string] }` or `{ lead, paragraphs: [string] }`
- **CUES:** none (a narrative kind: it runs in the article column with no figure panel, so it carries no cues)
- **BUILD:** the paragraphs rise in order, 80ms apart. No counter.
- **NOTES:** quiet section (act rhythm), narrative: the article column, no figure panel, no cues. Lens Phase 6 (board Lib-prose): the first paragraph opens on a drop cap in the desk text colour. The ONLY kind that reads `skimCaption`: in skim mode the prose hides and the caption shows.


## data-readout
- **World/Tier:** universal · v2 kit `.tel` (telemetry tiles) · `src/components/core/DataReadout.astro`
- **USE WHEN:** 3–6 headline numbers that set scale before the argument — values with short labels, one worth accenting.
- **DON'T USE:** a series over time (→ the world's time-series kind); ranked values needing bars (→ `benchmark-chart`).
- **DATA:** `{ tiles: [{value, label, note?, unit?, emphasis?: 'key'|'warn', color?}], status? }` — `emphasis` is the highlight (`accent: true` was documented until 2026-09-15 and never read by the component; authored tiles migrated to `emphasis: "key"`). A `value` that is a plain integer counts up; anything else renders verbatim.
- **CUES:** `1`…`n` each tile, in data order (the article sets each tile as a sentence, "Label: value unit. note", and a cued tile gets its button automatically, no marker needed)
- **BUILD:** the tiles drop in, 80ms apart, then each plain-number value counts up to the value in the HTML (anything else renders verbatim).
- **NOTES:** the figure keeps each tile's value and label; the article carries the sentences. A card, not a drawn graphic, for the composition floors.


## number-sense
- **World/Tier:** universal · HTML, static · `src/components/core/NumberSense.astro` · VizCard
- **USE WHEN:** one number carries the section — a price, a count, a share — and the dossier or the storyboard's Indian-ground list gives its everyday equivalents (the ₹ for a $ figure, "the population of Delhi", "one IPL season"). Often right after a chart, restating its headline figure at human scale.
- **DON'T USE:** three to six numbers (→ `data-readout`); a number against a threshold (→ `vote-result`, `gauge`); a series (→ a time-series kind).
- **DATA:** `{ value, unit?, label ≤ 8 words, equals: [{text ≤ 14 words, note? ≤ 12 words}] (1–3; story mode trims to 2), note? ≤ 20 words }` + `caption` + `source`. Each `equals` line is a claim: the basis goes in its `note` and the verifier traces it.
- **CUES:** `value` the figure and its label · `note` the note under the figure · `1`…`n` each `equals` row, in data order
- **BUILD:** the equivalents drop in, 80ms apart, then the label and the note rise, then the figure rises. Never a counter: the figure is often Indian-grouped and always shows exactly what was authored.
- **NOTES:** quiet section. Lens Phase 6 (board Lib-number-sense): the figure at up to 96 under its label, the note under it, each equivalent as a card with its ≈ sign. BLUEPRINT: `docs/design/blueprints/core/number-sense.md`. Worked example in `2026-06-03-travel-showcase`.
## commit-grid
- **World/Tier:** tech · classic activity grid · `src/components/topic/tech/CommitGrid.astro`
- **USE WHEN:** activity intensity over weeks — a contribution-graph-style density story (commits, releases, incidents).
- **DON'T USE:** precise values over time (→ `scaling-plot`); adoption share (→ `adoption-curve`).
- **DATA:** `{ weeks: Day[][] (Day = {level: 0|1|2|3|4, label?}), months?, weekdays?, meta? }`
- **CUES:** `1`…`n` the named days, every cell that carries a label, in data order (week by week, Monday first): outlined in ink, the numeral in a lane above or below the grid · `legend` the legend row
- **BUILD:** the month and weekday labels fade in, then the week columns fade in left to right (80ms apart, compressed by the island) with the named days, then the legend. No counter.
- **NOTES:** tech signature; hero-capable. Lens Phase 6 (board Lib-commit-grid): the grid is the whole figure, one legend row, the named days as cues, no meta line (`meta` is the figure's accessible name). A series longer than 30 weeks is set as two stacked halves so it fits the panel with no sideways scroll.

## journey-map
- **World/Tier:** travel · classic route diagram · `src/components/topic/travel/JourneyMap.astro`
- **USE WHEN:** a route as a sequence of named stops with distance/elevation/notes — the journey's texture is the structure.
- **DON'T USE:** leg-by-leg transport logistics or day-by-day plans (→ `itinerary`); a flight's day and night (→ `terminator-globe`).
- **DATA:** `{ stops: [{place, region?, km?, elev?, arrival?, note?, tag?}] }`
- **CUES:** `1`…`n` each stop, in authored order (its row: pin, place, height) · `line` the rail · `total` the totals above the rail · `legend` the key under the rail
- **BUILD:** the rail segments grow down, then the stops drop in order, then the height bars grow from the left, then the legend, then the totals count up.
- **NOTES:** travel signature; hero-capable. Lens Phase 6 (board Lib-journey-map): each row is when, the pin on the rail, the place and region, and the height as a value and a bar. A stop's `note` is not printed on the figure (labels of at most three words): it is the row's screen-reader text and hover title, and the article carries the story.

## match-stat-line
- **World/Tier:** sports · classic stat sheet (`.px-msl`) · `src/components/topic/sports/MatchStatLine.astro`
- **USE WHEN:** one match told through its stat rows — home vs away across possession, shots, and the rest.
- **DON'T USE:** season-long standings (→ `league-table`); one player's profile (→ `player-radar` / `player-card`).
- **DATA:** `{ home: {name, score?, badge?, outcome?}, away: {name, score?, badge?, outcome?}, competition?, venue?, date?, rows: [{label, home, away, unit?, note?}] }`
- **CUES:** `score` the scoreline (both sides and the score) · `1`…`n` the stat rows, in authored order
- **BUILD:** the row labels fade in, then the bars grow out from the centre line, then the values rise, then the sides fade in and the score counts up.
- **NOTES:** sports signature; hero-capable. Lens Phase 6 (board Lib-match-stat-line): the score at 48 between the two badges, then one butterfly row per stat, home in the desk mark and away in ink-2.

## region-map
- **World/Tier:** earth · classic cartographic SVG (d3-geo, Natural Earth 50m) · `src/components/topic/earth/RegionMap.astro`
- **USE WHEN:** a value shaded per country/zone on a flat world map — where something is, at region grain.
- **DON'T USE:** one place's value over time (→ a charted kind); motion across the globe (→ `plate-motion`, `storm-track`).
- **DATA:** `{ projection?, palette?, zones?: [{id, label?, value, note?}], markers?: [{lat, lng, label?, kind?}], legend?: {title?, low?, high?, none?} }`
- **CUES:** `1`…`n` each zone with a value, in authored order (its fill and its name) · `m1`…`mK` each marker, in authored order (its dot and its name) · `legend` the legend
- **BUILD:** land and ocean, then the zone fills, then the markers drop, then the names rise. No counter.
- **NOTES:** earth signature; hero-capable; free-standing cartographic SVG (SVG conventions in `src/components/AGENTS.md` §5). **The projection FRAMES ITS DATA** (2026-09-22): fitted with `fitExtent` to the zones that carry a value plus every marker, capped at 6x world scale, keeping the world framing when the zones span more than 150° of longitude. Lens Phase 6 (board Lib-region-map): drawn at the figure panel's width (460 units) so zone and marker names print at 12px there (a phone scrolls it inside its card); zones shade from the desk tint to the desk mark; the legend is HTML under the map, with zone notes listed under it.

## climate-strip
- **World/Tier:** earth · v2 kit `.cs` (warming stripes) · `src/components/topic/earth/ClimateStrip.astro`
- **USE WHEN:** one annual value per year over decades — a trend told as colour drift, not axis-reading.
- **DON'T USE:** monthly within-year cycles (→ `climate-spiral`); values the reader must read precisely (→ a charted kind).
- **DATA:** `{ values: [{year, value}], palette?, baseline?, unit?, showYears?, showLegend?, customMin?, customMax? }` + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the `year`; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `<year>` each stripe, by its year (for example 2016) · `1`…`3` each annotation marker, in authored order · `legend` the scale · `head` the headline number (the warmest year)
- **BUILD:** the year axis, then the stripes rise left to right, then the annotation markers and callouts, then the headline number.
- **NOTES:** earth signature; hero-capable. Lens Phase 6 (board Lib-climate-strip): stripes shaded along the desk's ramp (tint → mark → deep), a marker above each annotated year with its callout, a scale with its two ends; `palette` sets the ramp's direction (`custom` uses the two authored colours). Emits `.cs` inside `.px-viz`, never the `px-strip` namespace (owned by TopicStrip).

## gauge
- **World/Tier:** universal · one SVG arc with HTML words · `src/components/core/Gauge.astro`
- **USE WHEN:** ONE value read against a scale on an arc: a budget with a used / remaining split (the remaining carbon budget against a temperature target), a single lean between two blocs (a swing, a margin), or a load against its capacity (throughput, utilisation, a share cleared against a tipping band).
- **DON'T USE:** several headline figures (→ `data-readout`); a value over time (→ `approval-chart`, `climate-strip`); many margins at once (→ `margin-ladder`); a count against a pass mark with a shortfall (→ `vote-result`).
- **DATA:** THREE shapes, told apart by their fields unless `variant?: 'budget'|'lean'|'capacity'` is authored. Budget (`remaining` present): `{ remaining (0–1), remainingGt?, usedGt?, totalGt?, target?, year? }`. Capacity (`max` present): `{ value, max, unit?, label?, zones?: [{from, to, label?}] }`. Lean (neither): `{ value (-100..100), leftLabel?, rightLabel?, markers?: [{at, label}] }`.
- **CUES:** `value` the headline number (and the boundary tick on the arc) · `fill` the filled arc (budget: used; capacity: the reading; lean: the swing) · `rest` the unfilled arc (budget: what is left; capacity: the headroom) · `left`, `right` lean only: each bloc's half and its end label · `target` budget only: the target and year line · `1`…`n` capacity: each zone, in data order; lean: each marker, in data order
- **BUILD:** the unfilled arc fades in (the axis), then the fill draws and the zones and marker ticks fade in, then the end labels and the key rise, then the number counts up.
- **NOTES:** the Lens verdict (2026-09-30) merged three kinds here: `carbon-gauge` was renamed `gauge` (budget), and `swing-dial` (lean) and `throughput-dial` (capacity) folded in. All three old names stay accepted as ALIASES (`KIND_ALIASES`, `src/content/config.ts`), so the backlist builds unedited: author `gauge`, never an old name. Lens Phase 6 drew the three as ONE arc (board Lib-carbon-gauge): a half arc from left over the top to right, the track in the desk tint, the fill in the desk mark, one number large in the bowl; the arc SVG carries no text, every word is HTML. Budget: the fill is the used share; lean: the arc splits at its top and the fill runs from the middle toward the side the value leans, markers tick it; capacity: filled to value / max, zones on a thin outer ring. The old `px-cgauge` / `px-swdial` / `px-tdial` markup is gone; prefix `px-gauge`. Hero-capable.

## approval-chart
- **World/Tier:** politics · v2 kit `.ac` · `src/components/topic/politics/ApprovalChart.astro`
- **USE WHEN:** approve vs disapprove over time for one subject — crossovers and widening gaps carry the story.
- **DON'T USE:** a single point-in-time swing or margin (→ `gauge`); non-opinion series (→ the world's chart kind).
- **DATA:** `{ points: [{date, approve, disapprove}], subject? }` + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the point's `date` string (or its printed year label); `series: 'disapprove'` reads the muted line; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `1`…`n` each point (both of its dots), in data order · `approve` the approve line and its end label · `disapprove` the disapprove line and its end label · `cross` the first crossing, ringed · `note1`…`noteK` each annotation, in data order
- **BUILD:** the grid and the axis fade in, then the band fades in, then both lines draw, then the dots fade in, then the end labels, the crossing and the notes rise.
- **NOTES:** politics signature; hero-capable. Lens Phase 6 (board Lib-approval-chart): drawn for the figure panel (a 440-unit viewBox), the y axis fitted in steps of 5, the band between the lines tinted, the first crossing ringed, the lines named at their ends; every word a cue can name is HTML over the SVG. On a phone it scrolls sideways inside the panel.

## power-matrix
- **World/Tier:** politics · v2 kit `.pm` · `src/components/topic/politics/PowerMatrix.astro`
- **USE WHEN:** who controls what — institutions crossed with parties, each cell a control state.
- **DON'T USE:** seat arithmetic (→ `seat-chart` / `chamber`); control changing over time (→ `timeline`).
- **DATA:** `{ institutions: [string], parties: [{id, label, color?}], cells: [{institution, party, control: 'full'|'partial'|'none'|'contested'}] }`
- **CUES:** `1`…`n` each institution row, in data order · `<party id>` each party column head (the `id` from `parties`) · `<r>-<c>` one cell (row r, party column c, both from 1) · `legend` the key
- **BUILD:** the party heads and the institution names fade in, then the cells drop in row by row, 80ms apart, then the legend.
- **NOTES:** politics signature; hero-capable. Lens Phase 6 (board Lib-power-matrix): one 28px square per cell, full a solid desk-mark square, partial a light square, contested hatched with an ink edge, none a dashed outline; a party's own `color` shows only as its key dot.

## orbit-trace
- **World/Tier:** space · v2 kit `.ot` · `src/components/topic/space/OrbitTrace.astro`
- **USE WHEN:** a handful of NAMED orbits compared by altitude/inclination on a flat diagram — labels matter more than spectacle.
- **DON'T USE:** whole-population shells in 3-D (→ `constellation-swarm`).
- **DATA:** `{ orbits?: [{name, altKm, inclDeg?, color?, satCount?, note?}], maxAltKm? }`
- **CUES:** `1`…`n` each orbit, in authored order (its arc, point, label and numeral; the headline carries the first orbit's anchor) · `earth` the Earth · `axis` the axis
- **BUILD:** the Earth and the axis fade in, then the arcs draw from the axis upward, then the points and labels drop, outermost first, then the headline counts up.
- **NOTES:** space signature; hero-capable. Lens Phase 6 (board Lib-orbit-trace): quarter arcs round a corner of the Earth with the labels in a fixed column on the right on dotted leaders (`src/components/AGENTS.md` §5); radii are logarithmic in altitude when the highest orbit is more than four times the lowest, else linear from a floor with a break on the axis, and the caption says which. An orbit's `color` is honoured as a fixed encoding; `satCount` and `note` ride as its <title>.

## launch-stats
- **World/Tier:** space · v2 kit `.ls` · `src/components/topic/space/LaunchStats.astro`
- **USE WHEN:** launches (or similar events) counted per year, optionally split by operator/vehicle — a cadence/growth story.
- **DON'T USE:** a continuous flight path or budget (→ `trajectory-arc`, `delta-v-ladder`); non-annual series (→ `scaling-plot`).
- **DATA:** `{ years: [{year, bars: [{label, value, color?}]}] }`
- **CUES:** `1`…`n` each year, in authored order (its column, its bands, its total; the headline carries the last year's anchor) · `series-1`…`series-k` each operator, in the first year's order (its key entry and its band in every year) · `axis` the axis
- **BUILD:** the axis fades in, then the bands grow up, year by year, then the counts and totals rise, then the headline (the latest year's total) counts up.
- **NOTES:** space signature; hero-capable. Lens Phase 6 (board Lib-launch-stats): stacked columns, one band per operator, counts inside the bands where they fit, totals above, the key in HTML; a bar's `color` is honoured as a fixed encoding, otherwise the operators step through the desk inks.

## benchmark-chart
- **World/Tier:** tech · v2 kit `.bc` · `src/components/topic/tech/BenchmarkChart.astro`
- **USE WHEN:** entities ranked on one metric as horizontal bars — one highlighted, optionally against a reference line.
- **DON'T USE:** change over time (→ `adoption-curve` / `scaling-plot`); multi-attribute comparison (→ `comparison`).
- **DATA:** `{ items: [{label, value, sublabel?, highlight?, color?}], maxValue?, unit?, refValue?, refLabel?, sortDesc? }` (`sublabel` is the bar's second line, in the label column — unrendered until 2026-09-15) + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the item's label; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `1`…`n` each item's row, in DATA order (before the sort), so an author counts from the list they wrote · `ref` the reference line and its label · `top` the largest value, the large number
- **BUILD:** the labels and the reference fade in, then the bars grow from the left, 80ms apart, then the values rise, then any annotation, then the large number counts up.
- **NOTES:** tech signature; hero-capable. Lens Phase 6 (board Lib-benchmark-chart): the rows share one grid (label, track, value) so every track starts and ends on the same line; below 640px the label sits above its bar. Bars in the desk mark; where some are highlighted, the rest fall back to the desk tint. `unit` prints in the panel head.

## adoption-curve
- **World/Tier:** tech · v2 kit `.adc` · `src/components/topic/tech/AdoptionCurve.astro`
- **USE WHEN:** percent adoption over years tracing an S-curve, with milestone moments worth pinning to it.
- **DON'T USE:** raw scaling relationships (→ `scaling-plot`); activity density (→ `commit-grid`).
- **DATA:** `{ points: [{year, pct}], milestones?: [{year, label, pct?}], yLabel? }` (yLabel is the caption's unit chip; `xLabel` was documented, never rendered, struck 2026-09-15) + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the x value or a milestone label; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `1`…`n` each reported figure (a dot), in data order · `line` the curve · `m1`…`mK` each milestone (its rule on the chart and its row below) · `axis` the grid and tick labels · `head` the large number
- **BUILD:** the axis fades in, then the line draws, then the dots drop and the milestone rules fade in, then the notes and the milestone list, then the large number counts up.
- **NOTES:** tech signature; hero-capable. Lens Phase 6 (board Lib-adoption-curve): a 460-unit viewBox, the x axis placed by VALUE, straight segments between the reported figures (never smoothed), a milestone as a dashed rule with its name in the list below the chart. The large number is the annotated point, else the latest.

## itinerary
- **World/Tier:** travel · v2 kit `.rc` · `src/components/topic/travel/Itinerary.astro`
- **USE WHEN:** a journey as legs in travel order (from / to, mode, distance, duration per leg), where the logistics are the point, and each stop may carry up to three things done there; or a day-by-day plan, which renders as one stop per day.
- **DON'T USE:** named stops with texture and elevation (→ `journey-map`); a route's elevation along distance (→ `elevation-trek`); the day and night a flight crosses (→ `terminator-globe`).
- **DATA:** `{ legs: [{from, to?, mode?, distance?, duration?, note?, day?, items?: [string]}], title? }` — up to three `items` per stop (an authoring cap: nothing authored is dropped). The folded day shape `{ days: [{day, place, items?}] }` still renders, each day becoming a stop at its `place`; `legs` wins when both are present.
- **CUES:** `1`…`n` each leg (or day), in authored order: its row and its box · `end` the final destination (legs shape only) · `total` the count above the rail · `legend` the key of modes under the rail
- **BUILD:** the rail segments grow down, then the stops drop in order, then the stop boxes fade in, then the key, then the count.
- **NOTES:** ONE merged route of stops (Lens Phase 6, the merged board): each row is a leg, its mode glyph on a dashed rail, "From → To", its distance and time, and a box of what is done there (the note and up to three items); the legs shape ends on a filled dot at the last destination; the count of legs set large above, a key of modes under it. BOTH authoring shapes render: `legs`, and the folded `days` (each day a stop at its `place`); `legs` wins. The Lens verdict (2026-09-30) renamed `route-card` to `itinerary` and folded `itinerary-reel` in; both old names stay accepted as ALIASES (`KIND_ALIASES`, `src/content/config.ts`). Author `itinerary`. A leg with no `mode` draws a stop glyph. Hero-capable.

## league-table
- **World/Tier:** sports · v2 kit `.lt` · `src/components/topic/sports/LeagueTable.astro`
- **USE WHEN:** standings — position, points, form over a season or window; movement and gaps tell the story.
- **DON'T USE:** one match (→ `match-stat-line`); momentum inside a match (→ `momentum-wave`).
- **DATA:** `{ rows: [{pos, posChange?, team, badge?, played, won, drawn?, lost, gf?, ga?, gd?, points, form?: ['W'|'D'|'L'], highlight?: 'top'|'promotion'|'relegation'|'qualified'}], showDrawn?, showGoals? }` — `showGoals` shows GF, GA and GD (only GD was emitted until 2026-09-15); all three drop with Form below 720px.
- **CUES:** `top` the leader's points, the large number · `1`…`n` the rows, in authored order · `form` the form column (its head and every row's pips) · `gap` the divider where positions are skipped (only when one exists)
- **BUILD:** the header row, then the rows drop in order, then the divider and the legend, then the leader's points count up.
- **NOTES:** sports signature; hero-capable. Lens Phase 6 (board Lib-league-table): a real <table> sized by its own box, a band chip per position, a divider row where positions are skipped so a cut table never reads as whole, one legend row.

## player-radar
- **World/Tier:** sports · v2 kit `.pr` · `src/components/topic/sports/PlayerRadar.astro`
- **USE WHEN:** one player profiled across 5–8 stat axes, optionally against a comparison shape.
- **DON'T USE:** a single headline rating with stat bars (→ `player-card`); two teams (→ `match-stat-line`).
- **DATA:** `{ stats: [{label, value, max?}], player?, team?, color?, compare? }`
- **CUES:** `top` the highest value, the large number · `shape` the player's shape · `compare` the comparison shape (only when `compare` is given) · `1`…`n` each attribute, in authored order (its spoke's dot, label and value)
- **BUILD:** the rings and spokes fade in, then the shape fills and its outline draws, then the dots drop and the labels rise, then the highest value counts up.
- **NOTES:** sports signature; hero-capable. Lens Phase 6 (board Lib-player-radar): five hair rings, the shape in the desk mark (or the authored `color`), `compare` dashed in ink-2, spoke labels wrapped at about ten characters so they print at 12px on a phone.

## bill-passage
- **World/Tier:** politics · HTML stage rows · `src/components/topic/politics/BillPassage.astro`
- **USE WHEN:** a bill advancing stage by stage — readings, houses, assent — with a status per stage.
- **DON'T USE:** what the bill contains (→ `bill-breakdown`); the dated history around it (→ `timeline`).
- **DATA:** `{ stages: [{label, status: 'passed'|'failed'|'pending'|'current', date?, note?}] }`
- **CUES:** `1`…`n` each stage row, in data order · `cleared` the headline number
- **BUILD:** the rows drop in, 80ms apart, then the status glyphs fade in, then the number (stages cleared) counts up.
- **NOTES:** NOT CSS-3D since Lens Phase 6 (board Lib-bill-passage): the old tilted card track is gone. A column of stage rows, each with its status as a glyph (a filled check for passed, a ring for the stage it sits at now, a crossed ring on a dashed row for failed, a dashed clock for pending), its name, date and note; the count of stages cleared set at 96 (derived, never authored). Worked example in `2026-06-03-politics-showcase`.

## vote-flow
- **World/Tier:** politics · SVG (Sankey) · `src/components/topic/politics/VoteFlow.astro`
- **USE WHEN:** blocs flowing into for/against/abstain — the split WITHIN groupings is the story.
- **DON'T USE:** the bare tally vs threshold (→ `vote-result`); coalition make-up without a vote (→ `seat-chart`).
- **DATA:** `{ blocs: [{name, seats, color?, vote: 'for'|'against'|'abstain'}], outcome?: {label, passed} }`
- **CUES:** `1`…`n` each bloc (its bar, ribbon and label), in data order · `for`, `against`, `abstain` each vote node and its label · `outcome` the stamp
- **BUILD:** the bars fade in, then the ribbons fade in, 80ms apart, then the labels rise, then the number (seats for) counts up and the stamp fades in.
- **NOTES:** Lens Phase 6 (board Lib-vote-flow): the seats for at 96 with the outcome stamp, then a two-column Sankey (a 440-unit viewBox), ribbons coloured by where they went (For in the desk mark, Against in ink, Abstain grey); the SVG holds no text. On a phone it scrolls sideways in the panel. Worked example in `2026-06-03-politics-showcase`.

## margin-ladder
- **World/Tier:** politics · HTML ranked bars · `src/components/topic/politics/MarginLadder.astro`
- **USE WHEN:** ranked win/loss margins across seats or races — how safe or knife-edge each contest was.
- **DON'T USE:** one aggregate swing (→ `gauge`); party seat totals (→ `seat-chart`).
- **DATA:** `{ rows: [{label, margin, winner?, color?}], unit? }`. `unit` is the chip beside the caption, what a rung's length measures. It defaults to "win margins", so name it whenever the rungs are not match or seat margins (an overspend in £m, a swing in points)
- **CUES:** `1`…`n` each rung, in DATA order (before the sort) · `top` the headline number (the widest margin)
- **BUILD:** the names fade in, then the bars grow from the left, 80ms apart, then the margins rise, then the headline counts up.
- **NOTES:** NOT CSS-3D since Lens Phase 6 (board Lib-margin-ladder): the tilt and the hover lift are gone. The widest margin at 96 with the unit beside it, then the rungs widest first on a left rule, each a flat bar in the desk mark (or the row's `color`) with its margin at the end and `winner` set right. Worked example in `2026-06-03-politics-showcase` and in `2026-09-28-verdict-arrived-sentence-didnt`.

## chamber
- **World/Tier:** politics · WebGL **FLAGSHIP** + world signature · `src/components/topic/politics/Chamber.astro`
- **USE WHEN:** seat-by-party composition covering ≥90% of the chamber (name + seats per party); optionally a specific division's per-party aye/no counts.
- **DON'T USE:** partial compositions (→ `seat-chart`); vote-total-only stories (→ `vote-result`); coalition arithmetic play (→ `coalition-calculus`, P5).
- **DATA:** `{ chamber?: {rows?, arcDeg?}, parties: [{name, seats, color?, side?: 'gov'|'opp'|'cross', short?}], majority?, division?: {label?, aye: {party: n}, no: {party: n}} }`
- **CUES:** `1`…`n` each party, in data order (its seats and its legend entry) · `line` the majority arc · `total` the seat count · `aye`, `no` the division's lobbies (only when there is a division). The anchors live on the static fallback and its HTML labels, never on the canvas
- **BUILD:** the legend is the scene: its entries drop in, 80ms apart. The drawing itself does not build (the WebGL scene replaces the fallback), and the scene keeps its one idle loop.
- **NOTES:** the politics hero + identity anchor; hero-capable (`layout: wide`); the COMPOSITION / DIVISION chips walk the seats to the lobbies when a `division` is attached; never adjacent to another WebGL kind; shared math `src/scripts/viz3d/hemicycle.ts` feeds scene AND fallback SVG; absent seats = party total − aye − no (seated, dimmed). Lens Phase 6 (board Lib-chamber): the scene sits on the desk's deep plate, the chamber's size in the bowl of the arc, the majority over its apex, a one-line legend under it. BLUEPRINT: `docs/design/blueprints/politics/chamber.md`. RESEARCHER MUST CAPTURE: full composition per party (name + seats, ≥90% of the chamber) and, if a vote is the story, the division's per-party aye/no counts.

## power-flow
- **World/Tier:** politics · SVG (build-time Sankey, usable cross-world) · `src/components/topic/politics/PowerFlow.astro`
- **USE WHEN:** the dossier has a flow table (from → to → amount, one unit) with ≥4 links and ≥2 layers; totals reconcile (or the imbalance IS the story and is flagged `imbalance: 'the-point'`).
- **DON'T USE:** simple part-of-whole (→ `data-readout` tiles or `comparison`); bloc→vote flows (→ `vote-flow`, which owns that shape).
- **DATA:** `{ nodes: [{id, label, group?: 'source'|'via'|'sink'}], links: [{from, to, value, note?}], unit, imbalance?: 'the-point' }`
- **CUES:** `<node id>` each node (its bar and label), by the `id` in `nodes` · `1`…`n` each link (its ribbon and its row in the list under the drawing), in data order · `top` the headline number
- **BUILD:** the bars fade in, then the ribbons fade in, 80ms apart, then the labels and the link rows rise, then the number counts up.
- **NOTES:** hero-capable for money-trail issues; conservation-checked at build (an imbalanced `via` node FAILS the build naming the node unless flagged `imbalance: 'the-point'`, when the residual renders as a stub with its amount). Lens Phase 6 (board Lib-power-flow): the largest amount to reach a destination at 96, then the flow in a 440-unit viewBox, nodes as bars in the desk text ink, ribbons in shades of the desk mark whose thickness is the amount. The SVG holds no text. **No dash animation** (the old `flowDash` stipple is gone): width says the amount, the columns say the direction. The links' notes are a LIST UNDER THE DRAWING, never on the ribbons. On a phone it scrolls sideways in the panel. BLUEPRINT: `docs/design/blueprints/politics/power-flow.md`.

## coalition-calculus
- **World/Tier:** politics · HTML-interactive (build-time HTML + one tiny vanilla `is:inline` island; no three.js, SVG only for the lock glyph) · `src/components/topic/politics/CoalitionCalculus.astro`
- **USE WHEN:** a hung-chamber / coalition-formation story where the dossier has ≥3 parties' seat counts covering the whole chamber (Σseats = N) and the who-can-combine arithmetic IS the argument; locked-out parties carry a sourced ≤12-word reason.
- **DON'T USE:** the chamber's composition as portrait (→ `chamber`); one decisive vote against a threshold (→ `vote-result`); blocs splitting for/against (→ `vote-flow`); seat totals with a change column (→ `seat-chart`).
- **DATA:** `{ majority?, parties: [{name, short?, seats, color?, locked?}], preset?, caption?, source? }`
- **CUES:** `1`…`n` each party, in data order (its block, its name under the bar, its reason) · `line` the majority line and its label · `top` the margin
- **BUILD:** the blocks grow from the left, 80ms apart, then the majority line fades in, then the names rise, then the margin counts up. The scene is the figure, not the card, so the chips the island unhides above it never move a built element.
- **NOTES:** THE reader-agency reference (data-at-rest / one chip-set control / `aria-live` verdict / refusals that explain themselves / keyboard-complete). Lens Phase 6 (board Lib-coalition-calculus): party chips on top, the margin at 96 ("12 seats clear" / "5 seats short"), then the seat bar with the majority line dashed across it and each locked-out party's reason under it. No-JS = the print edition (the preset painted in full; the chips ship `hidden`, unhidden by the island). `wide` standalone, hero-capable. `majority` present and ≠ ⌈(N+1)/2⌉ auto-renders the `threshold {majority} of {N}` honesty chip. Party colors are the chip key dot only. BLUEPRINT: `docs/design/blueprints/politics/coalition-calculus.md`. RESEARCHER MUST CAPTURE: seat counts for every party summing to the full chamber, plus a sourced one-line reason for each party locked out of coalitions.

## gerrymander-lens
- **World/Tier:** politics · SVG (100% build-time layout + efficiency-gap math; the reveal is the only JS) · `src/components/topic/politics/GerrymanderLens.astro`
- **USE WHEN:** you have ONE precinct/cell grid of two-party vote counts covering the whole electorate, plus 2–3 district plans (a fair/neutral plan and one or two gerrymanders) that each partition **exactly that same cell set** into equal-population, contiguous districts. The story is "the map is the manipulation — same votes, different seats."
- **DON'T USE:** a single map's shaded values per region (→ `region-map`, earth); one chamber's party composition (→ `chamber`); a coalition's arithmetic (→ `coalition-calculus`); a straight two-column contrast (→ `comparison`). If you have only district-level totals and no shared underlying grid, you cannot honestly show "same votes."
- **DATA:** `{ grid: {cols, rows, a: number[], perCell}, parties: {a: {name, short?, color?}, b: {name, short?, color?}}, plans: [{label, districts: number[], note?}], flagPct?: 7 }`
- **CUES:** `1`…`n` each plan's panel, in data order · `top` the headline (the most skewed plan's seat split) · `legend` the key
- **BUILD:** the key and the cell fills fade in, then the district lines draw, then the winner dots fade in, then the readouts rise, then the headline rises.
- **NOTES:** flagship of the same-data-many-maps family; pairs with `layout: wide`, hero-capable for redistricting issues. Cell fills encode each cell's vote margin and are identical across all panels (only the district boundaries differ). Efficiency gap is signed (− favours A, + favours B); flagged when `|EG| > flagPct` (default 7%, Stephanopoulos & McGhee), shown as a "Balanced" / "Favours <party>" pill. Build **FAILS** naming the offender if a plan's district A-tallies don't re-sum to the shared statewide total, or on unequal-population / non-contiguous districts. Hard cap 3 plans, ≤49 cells (7×7). The verdict ledger folds under JS, outside the build scene. BLUEPRINT: `docs/design/blueprints/politics/gerrymander-lens.md`.

## bill-funnel
- **World/Tier:** politics · HTML bars · `src/components/topic/politics/BillFunnel.astro`
- **USE WHEN:** a *population* of bills counted at each procedural stage in order (≥4 stages, monotonically non-increasing), where the attrition between stages is the argument.
- **DON'T USE:** ONE bill's journey through the stages (→ `bill-passage`); what a bill contains (→ `bill-breakdown`); a dated legislative history (→ `timeline`).
- **DATA:** `{ stages: [{label, count, note?}], unit?, caption?, source? }`
- **CUES:** `1`…`n` each stage row, in data order · `top` the headline number (what came out the far end) · `legend` the key
- **BUILD:** the stage names fade in, then the survivor bars grow from the left, 80ms apart, then the losses fade in, then the counts rise, then the headline counts up.
- **NOTES:** build FAILS if any stage exceeds the one before it (a funnel cannot widen), or if there are fewer than 4 or more than 10 stages. The per-row loss is derived, never authored. Lens Phase 6 (board Lib-bill-funnel): one bar per stage on the first stage's scale, the loss since the row above as a dashed tint with its "−n"; pressing a row shows its note (the instrument's own small island), and every note is also in the `<dl>`. Pairs with `default`.

## age-pyramid
- **World/Tier:** politics · HTML mirrored bars · `src/components/topic/politics/AgePyramid.astro`
- **USE WHEN:** a body's composition by age band and a binary split (4–8 bands, oldest first), where either the concentration of the bands or the constancy of the split is the argument.
- **DON'T USE:** party composition of a chamber (→ `chamber` / `seat-chart`); one attribute compared across 2–3 entities (→ `comparison`); a single distribution with no split (→ a bar list in `data-readout`); one group's share tracked over time (→ `approval-chart`).
- **DATA:** `{ bands: [{label, left, right}] (oldest FIRST), sides: {left: {label, color?}, right: {label, color?}}, mode?: 'count'|'share', unit?, caption?, source? }`
- **CUES:** `1`…`n` each band row, in data order (oldest first) · `left`, `right` the two side heads · `share` the share column head · `top` the headline number (the largest band's total)
- **BUILD:** the head row fades in, then the bars grow out from the centre, 80ms apart, then the counts and shares rise, then the headline counts up.
- **NOTES:** build FAILS naming the band on fewer than 4 or more than 8 bands, a negative or non-finite value, a duplicate band label, or a band totalling 0. Array order IS display order: oldest first, never sorted. Lens Phase 6 (board Lib-age-pyramid): **no chips and no control**. Each row prints the left bar in ink with its count, the band, the right bar in the desk mark with its count, and the right side's share of the band in a last column, so both readings are on the figure at once. `mode: 'share'` draws every bar as its share of its own band (and says so under the head); `count` puts every bar on one scale set by the largest single side. The `<table>` of absolute counts stays for screen readers. `sides[].color` is not a data-encoding exemption. Pairs with `default`; not hero-capable. BLUEPRINT: `docs/design/blueprints/politics/age-pyramid.md`. RESEARCHER MUST CAPTURE: for every band, BOTH sides' absolute counts from the register or roll (not percentages), plus the band boundaries exactly as the source defines them.
## trajectory-arc
- **World/Tier:** space · SVG · `src/components/topic/space/TrajectoryArc.astro`
- **USE WHEN:** a flight path by altitude and downrange — launch/ascent phases with real km values.
- **DON'T USE:** a descent or landing with event markers (→ `descent-profile`); whole-orbit populations (→ `constellation-swarm`).
- **DATA:** `{ phases: [{label, altKm, downrangeKm, note?}], apoapsisKm? }`
- **CUES:** `1`…`n` each phase, in authored order (its pin, label and numeral; the headline carries the last phase's anchor) · `line` the arc · `apoapsis` the dashed line (when apoapsisKm is set) · `axis` the two axes
- **BUILD:** the axes fade in, then the arc draws, then the phase pins drop in downrange order, then the apoapsis line fades in, then the headline counts up.
- **NOTES:** Lens Phase 6 (board Lib-trajectory-arc): a 470-unit SVG, one smooth arc through the named phases, the final phase's altitude set large; a phase's `note` rides as its pin's <title> (the article carries the sentences). Worked example in `2026-06-03-space-showcase`.

## delta-v-ladder
- **World/Tier:** space · SVG stacked columns · `src/components/topic/space/DeltaVLadder.astro`
- **USE WHEN:** a delta-v / energy budget broken into segments — what it costs to get from here to there, piece by piece.
- **DON'T USE:** the flight path itself (→ `trajectory-arc`); non-additive comparisons (→ `benchmark-chart`, tech).
- **DATA:** `{ segments: [{label, dv, color?}], unit? }`
- **CUES:** `1`…`n` each segment, in authored order (its band in every column that climbs it, and its label; the headline carries the anchor of the segment it reports) · `total-1`…`total-k` each column's total, left to right · `axis` the axis
- **BUILD:** the axis fades in, then the bands grow up from their own floors (bottom band first), then the labels rise, then the column totals fade in, then the headline counts up.
- **NOTES:** Lens Phase 6 (board Lib-delta-v-ladder): segments whose labels chain as "A → B" are laid out as ROUTES, one column per route, so alternatives stand side by side instead of adding up; the largest single step set large. A segment's `color` is honoured as a fixed encoding. Worked example in `2026-06-03-space-showcase`.

## descent-profile
- **World/Tier:** space · SVG · `src/components/topic/space/DescentProfile.astro`
- **USE WHEN:** an altitude-vs-time descent or landing with event markers — dossier has timestamped altitude points and named events.
- **DON'T USE:** ascent / downrange stories (→ `trajectory-arc`).
- **DATA:** `{ points: [{t, altKm, phase?}], events?: [{t, label}], craftLabel? }`
- **CUES:** `1`…`n` each event, in authored order (its point, label and numeral) · `start` the craft at the first point, and the headline number that reports its altitude · `line` the profile · `axis` the axes
- **BUILD:** the axes fade in, then the area fades in and the line draws, then the event flags drop in time order, then the headline counts up.
- **NOTES:** Lens Phase 6 (board Lib-descent-profile): a 470-unit SVG, event labels placed by one collision rule; time carries no unit in the data, so the caption names it. A point's `phase` rides as its dot's <title>. A `cover` that names a descent-profile section draws the orbit scene on the stage (LENS §8.2). Worked example in `2026-06-03-space-showcase`.

## solar-system
- **World/Tier:** space · WebGL **FLAGSHIP** · `src/components/topic/space/SolarSystem.astro`
- **USE WHEN:** interplanetary geometry IS the story (an object's real orbit, windows, flybys, crossings) — dossier has real orbital elements (a, e, i, Ω, ω, M0, period) for ≥1 story object, plus an epoch date. Planets ship as built-in J2000 defaults.
- **DON'T USE:** near-Earth shells/constellations (→ `constellation-swarm`, `orbit-trace`); a single ascent (→ `trajectory-arc`).
- **DATA:** `{ epoch, planets?: ['mercury'…], bodies?: [{name, a_AU, e, i_deg, Omega_deg, omega_deg, M0_deg, period_d, role?: 'focus', note?}], scale?: 'log'|'true', trailDays? }`
- **CUES:** `sun` the Sun · `mercury` … `neptune` each planet, by its key · `1`…`n` each story body, in authored order · `epoch` the date the positions are for. The anchors live on the HTML key under the drawing and on the fallback, never on the canvas
- **BUILD:** the key's entries drop, then the epoch line fades in. The scene's slow idle turn is its own (the one ambient loop); the fallback does not build.
- **NOTES:** hero-capable (`layout: wide`); never adjacent to another WebGL kind; `scale: log` auto-renders the honesty chip. Lens Phase 6 (board Lib-solar-system): on the desk's deep plate, the scene and the fallback drawing light on dark alike. BLUEPRINT: `docs/design/blueprints/space/solar-system.md`. RESEARCHER MUST CAPTURE: the object's elements from JPL SBDB (or equivalent primary), incl. the epoch its M is quoted at.

## constellation-swarm
- **World/Tier:** space · WebGL **FLAGSHIP** · `src/components/topic/space/ConstellationSwarm.astro`
- **USE WHEN:** the physical scale + lattice of a satellite mega-constellation IS the story — the dossier has a real shell breakdown (≥1 shell with altitude km, inclination °, and a TRUE satellite count) and the census is large (best ≥ 300 craft). Every shown craft renders as one instanced point on its real orbital shell around a line-art Earth.
- **DON'T USE:** a single constellation's altitude rings without a census, or a handful of NAMED orbits where labels matter more than mass (→ `orbit-trace`); interplanetary geometry (→ `solar-system`). If the count fits on ten fingers, it is the wrong form.
- **DATA:** `{ shells: [{name, altKm, inclDeg, count, color?, planes?, raanSpread?}], epoch?, spin?, caption?, source? }`
- **CUES:** `1`…`n` each shell, in authored order (its key entry) · `total` the census line. The anchors live on the HTML key of shells under the drawing, never on the canvas
- **BUILD:** the shells' key entries drop, then the census fades in. The scene's spin is its own (the one ambient loop).
- **NOTES:** hero-capable (`layout: wide`); never adjacent to another WebGL kind. Altitude uses a TRUE-ratio magnified band (no log). Lens Phase 6 (board Lib-constellation-swarm): on the desk's deep plate; the fallback swarm carries no text (the census moved into the key). `spin: true` auto-renders the `1 s = 90 min` time chip; `Σcount > 6000` display-samples the instances and auto-renders the `showing … of … craft` chip; the key always states the TRUE count. BLUEPRINT: `docs/design/blueprints/space/constellation-swarm.md`. RESEARCHER MUST CAPTURE: per shell the altitude (km), inclination (°) and the census satellite count from a primary filing (FCC/ITU) or the operator's architecture doc.

## lagrange-map
- **World/Tier:** space · build-time SVG contour field · `src/components/topic/space/LagrangeMap.astro`
- **USE WHEN:** the story hinges on a Lagrange point — a mission parked at L1/L2 (SOHO, JWST, Gaia) or a Trojan population at L4/L5; the two-body system is named and its mass ratio is derivable.
- **DON'T USE:** the flight path to get there (→ `trajectory-arc`); interplanetary orbit geometry (→ `solar-system`); a Δv budget of the transfer (→ `delta-v-ladder`); halo orbits around a point (out of scope).
- **DATA:** `{ primary:{name,mass}, secondary:{name,mass}, separationKm?, markers?:[{at:'L1'..'L5',label}], show?:['L1'..'L5'], caption?, source? }`
- **CUES:** `L1`…`L5` each Lagrange point (in the map, and in the inset for the two it magnifies) with its marker label; the headline carries the anchor of the point it measures · `primary`, `secondary` the two masses · `inset` the magnified window · `field` the equal-potential lines
- **BUILD:** the field and the inset frame fade in, then the masses fade in, then the points drop, then the key fades in, then the headline counts up.
- **NOTES:** space; wide/hero-capable. Lens Phase 6 (board Lib-lagrange-map): a 290-unit map and a 160-unit inset side by side in the panel (the inset wraps under the map on a phone), the distance to the first marked point near the smaller body set large, the key in HTML. The inset renders for real (small-μ) mass ratios and is omitted once L1/L2 separate natively (Earth–Moon). BLUEPRINT: `docs/design/blueprints/space/lagrange-map.md`.

## transfer-window
- **World/Tier:** space · SVG interactive · `src/components/topic/space/TransferWindow.astro`
- **USE WHEN:** the story is a specific Hohmann transfer between two roughly-circular coplanar orbits — an interplanetary launch window (Earth→Mars, Earth→Venus), a Hohmann orbit-raise (LEO→GEO), or the cadence of departure opportunities. The dossier needs the two orbital radii (or altitudes) and the central body's μ.
- **DON'T USE:** a highly eccentric or plane-change-heavy real trajectory (the Hohmann idealization would lie → `solar-system` with real elements); the full solar-system context of the object (→ `solar-system`); a pure Δv budget with no window idea (→ `delta-v-ladder`); ascent from a surface (→ `trajectory-arc`). NEVER `layout: split` — scroll would fight the scrubber for the one control.
- **DATA:** `{ central: { name, mu }, from: { name, radiusKm, periodDays? }, to: { name, radiusKm, periodDays? }, distanceUnit? }` — Δv + transfer time from `kepler.ts hohmannDv`; synodic period + required phase are closed-form.
- **CUES:** `lead` the wedge, the destination at launch, and the headline · `transfer` the half ellipse · `from` the departure planet at launch · `to` the destination at arrival · `central` the central body · `dv`, `days`, `cadence` the three numbers under the figure
- **BUILD:** the orbits and the central body fade in, then the transfer draws, then the planets and the wedge drop, then the three numbers rise, then the headline counts up. The control sits outside the build scene.
- **NOTES:** ONE control (the lead scrubber; a range input shipped `hidden`, unhidden by the island, which never runs on load: the static figure IS the window-open state). Lens Phase 6 (board Lib-transfer-window): a 290-unit SVG centred in the panel so it never scrolls, the required lead set large, the Δv, flight time and days between windows under it. The verdict is aria-live and never red (a missed window is a wait, not a failure). Hero-capable, pairs with `wide`. BLUEPRINT: `docs/design/blueprints/space/transfer-window.md`. RESEARCHER MUST CAPTURE: the two orbital radii/altitudes + central-body μ; orbital periods if the orbits are not treated as circular.

## eclipse-cone
- **World/Tier:** space · build-time SVG · `src/components/topic/space/EclipseCone.astro`
- **USE WHEN:** the story is eclipse or occultation geometry — a solar/lunar eclipse, the totality coincidence, a star occulted by a body, transit vs eclipse; the dossier has the three radii (source, occulter, target) and the two distances (source→occulter, occulter→target).
- **DON'T USE:** the *path* of an eclipse across a map (→ `region-map` with a track); a timeline of eclipse events (→ `timeline`); the orbit that produces the alignment (→ `solar-system`/`lagrange-map`). If the point is not the cone geometry itself, this is the wrong tool.
- **DATA:** `{ source: {name, radiusKm}, occulter: {name, radiusKm, distanceFromSourceKm}, target: {name, radiusKm, distanceFromOcculterKm, distanceRangeKm?: [min,max]}, showPenumbra?: true, caption?, sourceCite? }` — NB the nested `source` object is the light SOURCE (e.g. the Sun), not the citation — author the citation as the SECTION-level `source` (which `core/Section.astro` renders as the plain paragraph's second line; it ignores the light-source object because it carries no `label`). `sourceCite` in `data` is still accepted but renders nowhere since 2026-09-04, when the in-card emitter was stripped with the rest.
- **CUES:** `tip` the umbra's point (both panels) and the headline · `mean` the target at its mean distance (both panels) · `near`, `far` the target at the ends of its range (the zoom) · `umbra` the umbra · `range` the range box above · `penumbra` the penumbra · `occulter` the occulting body · `axis` the axes
- **BUILD:** the axes fade in, then the occulter, the penumbra and the umbra fade in, then the target's positions drop, then the headline (the umbra's length) counts up.
- **NOTES:** space world. Lens Phase 6 (board Lib-eclipse-cone): one 470-unit SVG, the umbra drawn to its TRUE length along the axis with its width exaggerated (the caption says so), and below it the tip at true scale in both directions with the target at its closest, mean and farthest distance. `wide`/hero-capable. BLUEPRINT: `docs/design/blueprints/space/eclipse-cone.md`.


## margin-bullets
- **World/Tier:** space · HTML bullet rows · `src/components/topic/space/MarginBullets.astro`
- **USE WHEN:** 4–8 measurements each against its OWN requirement, in units that do not compare (dB, kg, °C, W), where whether each one closes is the argument.
- **DON'T USE:** values sharing one unit and scale (→ `benchmark-chart`, tech); a stacked energy budget (→ `delta-v-ladder`); one measurement over time (→ `approval-chart`).
- **DATA:** `{ rows: [{label, value, required, max, unit, note?}] }` — `label` must carry or imply the unit; `max` is that row's OWN full range.
- **CUES:** `1`…`n` each row, in authored order (its whole card; the headline carries the anchor of the row it reports)
- **BUILD:** the cards drop in, then the bars grow from the left, then the verdicts rise, then the headline (the worst shortfall) counts up.
- **NOTES:** build FAILS naming the row if it carries no `unit`, or breaks `0 < required <= max` or `0 <= value <= max`, or if there are fewer than 4 or more than 8 rows. Each row is normalised to its OWN `max`: no shared axis. Lens Phase 6 (board Lib-margin-bullets): one card per row (label and verdict on top, the bar against its own track with the requirement as an ink tick, value and mark under it), the worst shortfall set large. The row picker, readout, legend and fallback table are retired: every value is printed on its card and the cues do the pointing. A row's `note` is kept for assistive tech. Pairs with `default`; not hero-capable. BLUEPRINT: `docs/design/blueprints/space/margin-bullets.md`. RESEARCHER MUST CAPTURE: per subsystem the as-measured value, the requirement it is held to, that row's full instrument range, and the unit — all four from the same margin report, plus a one-line note on what a shortfall costs.
## core-sample
- **World/Tier:** earth · SVG column · `src/components/topic/earth/CoreSample.astro`
- **USE WHEN:** a vertical core / stratigraphy by depth — layers with labels and values (ice cores, sediment records).
- **DON'T USE:** layers of the air above ground (→ `atmosphere-column`); a time series without depth (→ `climate-strip` / `climate-spiral`).
- **DATA:** `{ layers: [{depth, label, value?, color?}], unit? }`
- **CUES:** `1`…`n` each layer, in authored order (its band, mark, depth and label) · `head` the headline number
- **BUILD:** the bands grow down, then the marks and depths, then the labels, then the headline number.
- **NOTES:** Lens Phase 6 (board Lib-core-sample): each layer is a mark at its depth (true depth when every depth reads as a number running downward, else evenly spaced), the band below tinted from the desk tint to the deep; the column continues below the last mark (a torn edge); the first layer that carries a value is the headline, with `unit` as its label. Worked example in `2026-06-03-earth-showcase`.

## sea-level-tank
- **World/Tier:** earth · SVG tank · `src/components/topic/earth/SeaLevelTank.astro`
- **USE WHEN:** rising-water levels against landmark heights — scenario rises measured against things the reader knows the size of.
- **DON'T USE:** annual anomaly series (→ `climate-strip`); depth structure (→ `core-sample`).
- **DATA:** `{ levels: [{label, riseM, year?}], landmarks?: [{name, heightM}], maxM? }`
- **CUES:** `1`…`n` each level, in authored order · `lm1`…`lmK` each landmark · `water` the water body · `head` the headline number
- **BUILD:** the tank and its scale, then the water rises, then the level and landmark lines, then the labels, then the headline number.
- **NOTES:** Lens Phase 6 (board Lib-sea-level-tank): each level is a line at its rise; the water stands at the highest level that is not a low-confidence case (a label saying "low confidence", "upper" or "high end" draws dashed, above the water); landmarks are dotted lines with their name and height. The water's level is the headline. Worked example in `2026-06-03-earth-showcase`.

## climate-spiral
- **World/Tier:** earth · build-time SVG + one month-scrub island (routed through `core/VizCard.astro`) · `src/components/topic/earth/ClimateSpiral.astro`
- **USE WHEN:** a monthly climate series spiralling by year — seasonal cycle plus long-term drift in one figure.
- **DON'T USE:** one value per year (→ `climate-strip`); monthly travel planning (→ `climate-calendar`, travel).
- **DATA:** `{ months: [{year, month (1-12), value}], unit?, baseline? }`
- **CUES:** `<year>` each year's winding, by its year (for example 2023) · `jan`…`dec` the month letters · `ring1`…`ringK` the reference rings, inside out · `peak` the highest month · `head` the headline number
- **BUILD:** the rings and months, then the spiral draws, then the peak ring and the ring labels, then the headline number. The scene is `.px-spiral__scene` inside the card, because the card also holds the scrub.
- **NOTES:** Lens Phase 6 (board Lib-climate-spiral): a build-time polar SVG, each year one tone of the desk ramp, dashed reference rings, the highest month ringed and set as the headline. Month scrub (an instrument; its island stays): a native range input that ships `hidden` and is unhidden once the payload parses; the future drops to a ghost, the centre reads the year, the readout names that month's value and whether it was the highest yet. The island owns `opacity`, the build owns `stroke-dashoffset`. No-JS paints every segment at full opacity. Routed through `core/VizCard.astro`. Worked example in `2026-06-03-earth-showcase`.

## quake-depth
- **World/Tier:** earth · SVG · `src/components/topic/earth/QuakeDepth.astro`
- **USE WHEN:** earthquakes by depth and magnitude over time — the depth dimension carries the mechanism.
- **DON'T USE:** quake locations on a map (→ `region-map` markers).
- **DATA:** `{ quakes: [{date, depthKm, mag, place?}] }`
- **CUES:** `1`…`n` each quake, in authored order · `band` the top 10 km · `head` the headline number (the quakes inside the band)
- **BUILD:** the axes, the band and the surface, then the circles drop in time order, then the labels, then the headline number.
- **NOTES:** Lens Phase 6 (board Lib-quake-depth): x is real time, y depth below the surface line, each circle sized by magnitude and labelled where the label finds room (a label that fits nowhere is dropped, the circle stays). Worked example in `2026-06-03-earth-showcase`.

## terrain-relief
- **World/Tier:** earth · WebGL **FLAGSHIP** · `src/components/topic/earth/TerrainRelief.astro`
- **USE WHEN:** the story hinges on the real topography of ONE bounded region — a committed DEM heightfield exists for it.
- **DON'T USE:** geo-located values across the whole globe (→ `region-map`); a route's up-and-down profile (→ `elevation-trek`).
- **DATA:** `{ dem: '/geo/<slug>-dem.json', place?, exaggeration?, exaggerateTo?, contourInterval_m?, peaks?: [{lat, lon, label, elev_m?}], seaLevel? }`
- **CUES:** `1`…`n` each peak, in authored order (its dot and its name) · `ridges` the relief · `head` the headline number (the highest named summit). The anchors live on the fallback and its label layer, never on the canvas
- **BUILD:** only the headline number builds, in a scene of its own above the mount (the live scene replaces the still). The scene keeps its one idle loop.
- **NOTES:** hero-capable (`layout: wide`); needs a per-issue DEM JSON asset in `public/geo/`; the vertical-exaggeration chip is in flow under the scene and shows once the scene is live. Lens Phase 6 (board Lib-terrain-relief): on the desk's deep plate; the still is the board's ridgeline view (the DEM's rows drawn back to front as profiles, true horizontal scale, height × `exaggeration`), with the named summits on their ridge; the peak table sits under the plate. BLUEPRINT: `docs/design/blueprints/earth/terrain-relief.md`. RESEARCHER MUST CAPTURE: the DEM provider + resolution + region bounds.

## plate-motion
- **World/Tier:** earth · WebGL · `src/components/topic/earth/PlateMotion.astro`
- **USE WHEN:** the story is tectonic motion of ≥2 plates and the dossier has real Euler poles (lat, lon, ω °/Myr from a NNR-MORVEL / PB2002 reference frame).
- **DON'T USE:** one region's terrain shape (→ `terrain-relief`); earthquakes by depth (→ `quake-depth`); a geo-located point value (→ `region-map` markers); a flat per-country choropleth (→ `region-map`); a single plate with no motion contrast.
- **DATA:** `{ plates: [{name, pole:{lat,lon,omega}, color?, samples?, bbox?}], boundaries?, maxVel_mmyr?, caption?, source }`
- **CUES:** `1`…`n` each plate, in authored order (its arrows and its name) · `convergent`, `divergent`, `transform` the boundaries of each kind · `head` the headline number. The anchors live on the fallback and its label layer, never on the canvas
- **BUILD:** outside the mount only: the key, then the headline number. The globe does not build; the scene keeps its one idle loop.
- **NOTES:** hero-capable (`layout: wide`); ships the one-time asset `public/geo/plates.json`; an "arrows clipped at N mm/yr" honesty chip auto-renders when `maxVel_mmyr` is authored below the true peak |v|. Lens Phase 6 (board Lib-plate-motion): on the desk's deep plate, the headline (the first plate's speed range), the globe and a key; in the fallback the first plate's arrows are the desk mark and the others on-deep grey; plate names and speeds are an HTML layer; the pole table sits under the plate. An authored `color` colours the live scene. BLUEPRINT: `docs/design/blueprints/earth/plate-motion.md`. RESEARCHER MUST CAPTURE: the Euler-pole reference frame + per-plate poles + the boundary source.

## atmosphere-column
- **World/Tier:** earth · SVG column · `src/components/topic/earth/AtmosphereColumn.astro`
- **USE WHEN:** the reader must feel atmospheric altitude — high-altitude trekking/mountaineering, an aviation-ceiling story, a "where does space begin" explainer; there are ≥2 landmark heights worth pinning.
- **DON'T USE:** terrain shape (→ `terrain-relief`); rising WATER against landmarks (→ `sea-level-tank` — the mirror image); a single gauge/number (→ `gauge`, `data-readout`).
- **DATA:** `{ maxAlt_km?, model?: 'lapse'|'isothermal', landmarks?: [{name, alt_km, note?}], showOxygen?, logAlt?, caption?, source }`
- **CUES:** `troposphere`, `stratosphere`, `mesosphere`, `thermosphere` the bands the column reaches · `curve` the pressure curve · `1`…`n` each landmark, in authored order · `head` the headline number
- **BUILD:** the axis and the bands, then the curve draws, then the landmark pins, then the landmark labels, then the headline number.
- **NOTES:** Lens Phase 6 (board Lib-atmosphere-column): the layers as stacked bands, the barometric pressure curve beside them (0% to 100% of sea-level pressure), the landmarks pinned on the curve at their real altitude; the pressure at the first landmark is the headline. Pressure/O₂ computed at build time (geodesy §7); the printed O₂ uses the SAME model that draws the curve. `logAlt: true` compresses the altitude axis and the figure says so under the column. No tilt, no WebGL. Worked example in `2026-06-03-earth-showcase`.

## carbon-loop
- **World/Tier:** earth · SVG (build-time layout + conservation check, usable cross-world) · `src/components/topic/earth/CarbonLoop.astro`
- **USE WHEN:** the dossier has a stock-and-flow table — named reservoirs with stocks (GtC) and fluxes between them (GtC/yr), ≥3 reservoirs and ≥4 fluxes — and either the flows balance per reservoir OR one named reservoir accumulates and THAT is the point (flag `imbalance: 'the-point'` on the `accent` reservoir, e.g. the atmosphere's airborne fraction).
- **DON'T USE:** a one-directional money/authority cascade with layers (→ `power-flow`, the pure Sankey); a used/remaining budget arc (→ `gauge`); a single rise level (→ `sea-level-tank`); part-of-whole tiles (→ `data-readout`); a flow with no reservoir sizes (→ `power-flow`).
- **DATA:** `{ unit, reservoirs: [{id, label, stock, x, y, role?: 'store'|'source'|'sink', accent?}], fluxes: [{from, to, value, note?}], imbalance?: 'the-point', residualLabel?, cycle?, year? }`
- **CUES:** `<reservoir id>` each reservoir box, by its `id` (for example atmosphere) · `1`…`n` each flux, in authored order · `residual` the residual chip · `head` the headline number
- **BUILD:** the reservoirs, then the fluxes draw, then the labels, then the residual chip, then the headline number.
- **NOTES:** the stock-and-flow sibling of `power-flow`. Lens Phase 6 (board Lib-carbon-loop): reservoirs are squares whose AREA is their stock at their authored x / y; fluxes are straight arrows whose WIDTH is their flow (a pair that cancels is labelled once, "each way"); the accent reservoir in the desk mark, an open boundary (`source` / `sink`) dashed. The residual (`imbalance: 'the-point'`) is a dark chip beside the accent reservoir and the headline. No dash animation. Conservation-checked at build (a `role: 'store'` reservoir that doesn't balance within 1% FAILS the build naming it, unless it is `accent` + `imbalance: 'the-point'`). Hero-capable for a cycle issue; pairs with `wide`. BLUEPRINT: `docs/design/blueprints/earth/carbon-loop.md`.

## storm-track
- **World/Tier:** earth · WebGL · `src/components/topic/earth/StormTrack.astro`
- **USE WHEN:** the dossier has a best-track table for ONE (or a few compared) tropical cyclone(s) — timestamped fixes with lat/lon and intensity (max sustained wind, kt). Sources: IBTrACS, NHC/JTWC best-track.
- **DON'T USE:** a static per-region climatology value (→ `region-map`); geo point values (→ `region-map` markers); plate motion (→ `plate-motion`); a single station's time series (→ a charted kind); many storms as a density climatology (a handful of named tracks is the ceiling — beyond ~4 it's a heat map).
- **DATA:** `{ storms: [{ name, fixes: [{ t, lat, lon, wind_kt, landfall? }] }], windScale?, smooth? }` — category is DERIVED from `wind_kt` on the fixed Saffir-Simpson ramp, never authored.
- **CUES:** `1`…`n` each fix, in order across the storms (its dot and its label) · `peak` the dashed ring on the strongest fix · `track` the line · `head` the headline number. The anchors live on the fallback and its label layer, never on the canvas
- **BUILD:** outside the mount only: the key, then the headline number. The scene keeps its one idle loop.
- **NOTES:** hero-capable (`layout: wide`); never adjacent to another WebGL kind. Lens Phase 6 (board Lib-storm-track): on the desk's deep plate, the headline (the first storm's peak wind), the basin, the category key; the Saffir-Simpson ramp stays the fixed encoding (declared in the key); every fix labelled with its day, category and wind in an HTML layer; the track table sits under the plate. BLUEPRINT: `docs/design/blueprints/earth/storm-track.md`. RESEARCHER MUST CAPTURE: the best-track archive + storm name/year; landfall fixes flagged.

## arch-stack
- **World/Tier:** tech · HTML drawn slabs · `src/components/topic/tech/ArchStack.astro`
- **USE WHEN:** a layered system / architecture stack — what sits on what.
- **DON'T USE:** request timing through the stack (→ `latency-waterfall`); branch/merge structure (→ `version-graph`).
- **DATA:** `{ layers: [{label, sublabel?, color?}] }`
- **CUES:** `1`…`n` each slab, top to bottom (data order)
- **BUILD:** the slabs drop in, top to bottom, 80ms apart. No counter.
- **NOTES:** NOT in perspective since Lens Phase 6 (board Lib-arch-stack): the slab is drawn (a tinted top face and a solid offset edge read as thickness), so the stack fits the panel; the pointer tilt and the hover lift are retired. Label 15/600, sublabel 13, both wrap. Worked example in `2026-06-03-tech-showcase`.

## latency-waterfall
- **World/Tier:** tech · SVG · `src/components/topic/tech/LatencyWaterfall.astro`
- **USE WHEN:** timed spans in a request waterfall — where the milliseconds actually go.
- **DON'T USE:** throughput as one figure (→ `gauge`); ranked totals (→ `benchmark-chart`).
- **DATA:** `{ spans: [{label, start, dur, kind?}], unit? }`
- **CUES:** `1`…`n` each span, in data order (its name, value and bar) · `axis` the gridlines and tick labels · `total` the trace's length, the large number
- **BUILD:** the axis fades in, then each bar grows from its left edge, 80ms apart down the rows, then the names and durations rise, then the total counts up.
- **NOTES:** Lens Phase 6 (board Lib-latency-waterfall): HTML drawn for the figure panel, each span's name on its own line above its bar (it wraps, never cut), the duration at the line's end, round-number ticks. Worked example in `2026-06-03-tech-showcase` and in `2026-09-28-verdict-arrived-sentence-didnt`.

## version-graph
- **World/Tier:** tech · SVG · `src/components/topic/tech/VersionGraph.astro`
- **USE WHEN:** a commit / release DAG — branches, merges, and tags telling a development story.
- **DON'T USE:** activity volume over time (→ `commit-grid`); layered runtime structure (→ `arch-stack`).
- **DATA:** `{ nodes: [{id, parents?, label?, tag?, lane?}] }`
- **CUES:** `1`…`n` each node, in data order (its dot and its row) · `head` the large number (only when one tag is carried by most nodes)
- **BUILD:** the lane guides fade in, then the edges draw, then the dots drop, 80ms apart, then the rows rise, then the large number counts up.
- **NOTES:** Lens Phase 6 (board Lib-version-graph): a narrow SVG at its own pixel size beside HTML rows (label, tag); the id is the key the parents name and is no longer printed. When one tag is on most nodes, the large number says so ("8 of 10") and the others draw hollow. Worked example in `2026-06-03-tech-showcase`.

## scaling-plot
- **World/Tier:** tech · SVG + one axis-toggle island (routed through `core/VizCard.astro`) · `src/components/topic/tech/ScalingPlot.astro`
- **USE WHEN:** an x/y scaling relationship — power laws, cost curves — optionally with log axes and a fit line.
- **DON'T USE:** the adoption S-curve story (→ `adoption-curve`); ranked one-metric bars (→ `benchmark-chart`).
- **DATA:** `{ points: [{x, y, label?, illustrative?}], xLabel?, yLabel?, logX?, logY?, fit? }` (`illustrative: true` marks a point that stands for a class rather than a measurement: it draws hollow, and the readout then states no top-to-bottom ratio) + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the point's `label` or its raw x; rendered for both projections; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `1`…`n` each point, in data order (its numeral beside the dot) · `fit` the fitted line (when `fit`) · `axis` the gridlines and tick labels · `head` the large number
- **BUILD:** the axis fades in, then the fitted line draws, then the points drop, 80ms apart, then the labels and notes fade in, then the large number counts up. The scene is the plot and its number, not the card (the card holds the Log / Linear control).
- **NOTES:** Lens Phase 6 (board Lib-scaling-plot): a 460-unit viewBox, the y title above the plot, the large number the annotated point, else the highest. LOG ⇄ LINEAR toggle: two chip buttons that render ONLY when `logX` or `logY` is authored; both projections are computed in frontmatter and sit in the DOM, the island swaps one attribute; no-JS paints the authored projection; reduced motion keeps the toggle and drops the tween. Routed through `core/VizCard.astro`. Never name the scale in the `caption` or a cue sentence: the reader can change it. Worked example in `2026-06-03-tech-showcase`; published in `2026-06-04-ai-coding-token-bill`.

## neural-flow
- **World/Tier:** tech · WebGL **FLAGSHIP** · `src/components/topic/tech/NeuralFlow.astro`
- **USE WHEN:** the dossier has a real architecture — ordered layer sizes (units per layer) for the model discussed.
- **DON'T USE:** layered *system* structure with no unit counts (→ `arch-stack`); a scaling curve (→ `scaling-plot`).
- **DATA:** `{ layers: [{n, label}] (2–8), paramsNote?, wave_ms? }`
- **CUES:** `1`…`L` each layer (its column of nodes in the fallback and its cell in the label row, where the numeral prints) · `wave` the frozen wave · `head` the weight count
- **BUILD:** only the plate's HTML builds: the layer cells rise, 80ms apart, then the weight count counts up. The scene keeps its one idle loop, the wave.
- **NOTES:** hero-capable (`layout: wide`); large layers sampled with a "showing 1 in N" chip; the param count is COMPUTED. Lens Phase 6 (board Lib-neural-flow): on the deep plate (the lime on tech); the weight count in HTML above the mount, the layer names and unit counts as an HTML row under it (nothing is text inside the SVG); the legend list and its island are retired. BLUEPRINT: `docs/design/blueprints/tech/neural-flow.md`. RESEARCHER MUST CAPTURE: the real per-layer unit counts of the network.

## packet-trace
- **World/Tier:** tech · WebGL globe + synced build-time SVG **FLAGSHIP** · `src/components/topic/tech/PacketTrace.astro`
- **USE WHEN:** the dossier has a real trace — an ordered hop list, each with a from/to city (lat/lon) and a measured RTT in ms — and the story is "why is this slow / where does the time go" (a CDN post-mortem, an inter-region latency piece, a submarine-cable story). Total measured RTT and the great-circle light floor must both be computable from the data.
- **DON'T USE:** timed spans of a *local* request with no geography (→ `latency-waterfall`); a multi-stop *travel* journey where the stops are the point and timing is not (→ `journey-map`); throughput as one live number (→ `gauge`); a static "these cities are far apart" fact (→ `region-map` markers). Never adjacent to another WebGL kind; never `bleed`.
- **DATA:** `{ hops: [{from, fromLat, fromLon, to, toLat, toLon, rttMs, kind?: 'fiber'|'wireless'|'satellite'|'compute', note?}] (1–8), originLabel?, refractiveIndex?, loopMs?, caption?, source? }`
- **CUES:** `1`…`n` each hop, in data order (its arc on the map, its share of the bar and its row, where the numeral prints) · `floor` the light-floor rule on the bar · `head` the round trip, the large number
- **BUILD:** only what sits outside the mount builds: the track fades in, then each hop's share grows from the left, 80ms apart, then the floor rule drops and the rows rise, then the round trip counts up. The scene keeps its one idle loop, the packets.
- **NOTES:** hero-capable (`layout: wide`). NEVER trusts an authored total: floor + measured are summed from `hops` via `packet.ts`, the SAME math as the live globe, the fallback map and the budget bar. Lens Phase 6 (board Lib-packet-trace): on the deep plate (the lime on tech), the overhead the on-deep grey; the honesty chip beside the round trip states floor and measured; the budget is HTML (one track, each hop's floor share and overhead, the floor a dashed rule, the hops listed under it); the no-WebGL map is cropped to the route with HTML city names. BLUEPRINT: `docs/design/blueprints/tech/packet-trace.md`. RESEARCHER MUST CAPTURE: the per-hop from/to cities (lat/lon) + measured RTT + hop kind + the trace source.

## queue-cliff
- **World/Tier:** tech · HTML-interactive (vanilla `is:inline` island; SVG curve, zero WebGL, zero framework) · `src/components/topic/tech/QueueCliff.astro`
- **USE WHEN:** the utilization/latency trade-off is the story — one slider drives offered load ρ and the exact M/M/1 wait multiplier `1/(1−ρ)` climbs to a vertical wall near ρ=1 (capacity-planning, "run too hot" incident, "why we keep headroom").
- **DON'T USE:** a general x/y power or cost curve (→ `scaling-plot`); a single live utilization number without the trade-off (→ `gauge`); a request's timing breakdown (→ `latency-waterfall`); multi-server or priority queues (M/M/1 only — don't fake M/M/c).
- **DATA:** `{ muPerSec | serviceMs, startRho?, maxRho?, annotations?: [{rho, label, tone?}], caption?, source? }`
- **CUES:** `1`…`K` each named point (annotation), in data order · `curve` the M/M/1 curve · `marker` the operating point the slider sets (and its drop-lines) · `axis` the grid and tick labels · `head` the large number
- **BUILD:** the axis fades in, then the curve draws, then the named points and the marker drop, then their labels fade in, then the large number counts up. The scene is the number and the plot, not the card (the slider lives below it).
- **NOTES:** tech flagship; hero-capable (`layout: wide`); a "loud" interactive, so keep a quiet section either side. Lens Phase 6 (board Lib-queue-cliff): a 460-unit viewBox, load in percent, annotation labels carrying their multiplier ("Black Friday · 20×"); the large number is the wait at the busiest named point (else at the cap); the start point snaps to a named point exactly as the island does. Always renders the `y capped at {yCap}× · M/M/1` chip and the honesty note. Companion table (≤5 rows) is the no-JS / AT data source. BLUEPRINT: `docs/design/blueprints/tech/queue-cliff.md`.

## chip-die
- **World/Tier:** tech · flat HTML floorplan (build-time treemap) · `src/components/topic/tech/ChipDie.astro`
- **USE WHEN:** a processor die where the story is relative silicon area — "the GPU is bigger than every CPU core combined." Each block's pixel area equals its real mm².
- **DON'T USE:** a layered architecture stack (→ `arch-stack`); ranked one-metric bars (→ `benchmark-chart`); request timing through a stack (→ `latency-waterfall`).
- **DATA:** `{ chip, dieAreaMm2?, blocks: [{label, areaMm2?|pct?, group?, primary?, count?, note?}], caption?, source? }`
- **CUES:** `1`…`n` each block, in DATA order (as authored, not the area order the treemap draws) · `legend` the key row · `head` the large number (the primary block's area)
- **BUILD:** the die fades in, then its tiles fade in, largest first, 80ms apart (compressed by the island), then the key, then the large number counts up.
- **NOTES:** 4–24 blocks; area given as `areaMm2` OR `pct`+`dieAreaMm2`; coverage <95% shows an explicit Unmapped remainder. FLAT since Lens Phase 6 (board Lib-chip-die): the CSS-3D tilt, the tile lift and the hover readout island are retired. Compute in the desk mark, the primary block in the desk text ink, the other groups neutral; labels print only where measured to fit, elsewhere a dot marks the tile and "All n blocks" lists every one. BLUEPRINT: `docs/design/blueprints/tech/chip-die.md`. Worked example in `2026-06-03-tech-showcase`.

## moore-ladder
- **World/Tier:** tech · SVG · `src/components/topic/tech/MooreLadder.astro`
- **USE WHEN:** a dated count series that grows exponentially over ≥3 orders of magnitude — transistor counts per chip/year (the canonical case), sequencing cost, model parameters, storage density — where a doubling time is the claim (≥6 points).
- **DON'T USE:** a general x/y power law or non-doubling scaling relationship (→ `scaling-plot`); an adoption S-curve (→ `adoption-curve`); ranked one-metric bars (→ `benchmark-chart`); die area (→ `chip-die`).
- **DATA:** `{ points: [{year, count, label, highlight?}] (≥6), yLabel?, unit?, fit?, fitRange? }`
- **CUES:** `1`…`n` each chip, in data order (a dot and its label) · `fit` the fitted doubling line · `axis` the rungs and tick labels · `head` the large number (the doubling time)
- **BUILD:** the rungs fade in, then the dots drop in data order, then the fit line draws, then the labels and the callout fade in, then the doubling time counts up.
- **NOTES:** base-2 log y-axis: the `log₂ scale` chip ALWAYS renders; the doubling time is COMPUTED from the least-squares slope, never authored, and is the large number; `fitRange` fits a sub-era and prints a `fit: {start}–{end}` chip. Lens Phase 6 (board Lib-moore-ladder): a 460-unit viewBox, labels placed off each other and off the dots, hover changes nothing; "All n chips" is the disclosure table. BLUEPRINT: `docs/design/blueprints/tech/moore-ladder.md`. Worked example in `2026-06-03-tech-showcase`.


## state-timeline
- **World/Tier:** tech · HTML lanes + marker island · `src/components/topic/tech/StateTimeline.astro`
- **USE WHEN:** 3–8 entities' discrete STATE (healthy / degraded / down, or domain equivalents) across ONE window, plus a numbered event timeline, where the lag between the true onset and the first alert is the argument.
- **DON'T USE:** a continuous metric per service (→ `latency-ridge`, blueprinted, not yet built); one request's spans (→ `latency-waterfall`); a dated narrative history (→ `timeline`); a service dependency graph (→ `service-arcs`, blueprinted, not yet built).
- **DATA:** `{ window: {fromHour,toHour}, states: [{id,label,ok?}] ×2–3 best-first, lanes: [{label, segments:[{from,to,state}]}], marks?: [{n,atHour,label,note?}] }`
- **CUES:** `1`…`n` each service lane, in data order · `m1`…`mK` each event, by its own `n` (the rule, the marker and the row) · `legend` the state key · `head` the large number (the lag)
- **BUILD:** the key, the head row and the service names fade in, then the tracks grow from the left, 80ms apart, then the uptimes rise, then the large number rises. The scene is the figure above the marker lane, not the card; the event rules do not build.
- **NOTES:** build FAILS, naming the lane, if any lane's segments leave a gap or an overlap, or do not run `fromHour` to `toHour`; also outside 3–8 lanes, 1–12 segments per lane, 2–3 states, more than 8 marks, an undeclared state, a duplicate marker `n`, a marker outside the window, or no state with `ok: true`. Per-lane uptime and the default selected marker ("the first alert") are DERIVED. Lens Phase 6 (board Lib-state-timeline): the large number is the lag from the first fault to the first event after it; healthy a pale green, degraded amber, down red (a declared data-encoding exemption); each event's hour a dashed rule down the lanes; markers are small numbered SQUARES (a cue is a round disc); the tables sit in an "All the numbers" disclosure. Pairs with `default` or `wide`; not hero-capable. BLUEPRINT: `docs/design/blueprints/tech/state-timeline.md`. RESEARCHER MUST CAPTURE: per service, the state changes as timestamps covering the whole window with no holes, plus the incident's own event times from the postmortem.
## elevation-trek
- **World/Tier:** travel · SVG · `src/components/topic/travel/ElevationTrek.astro`
- **USE WHEN:** an elevation profile along a route — distance vs elevation with named waypoints and a moving-marker feel.
- **DON'T USE:** strata down a core (→ `core-sample`, earth); stop-sequence storytelling (→ `journey-map`).
- **DATA:** `{ points: [{km, elevM, label?}], unit? }`
- **CUES:** `1`…`n` each point, in authored order (its dot and its name) · `line` the profile and the ground under it · `peak` the highest point (its ring, and the number above) · `axis` the height and distance axes
- **BUILD:** the axes, then the ground fades in and the profile draws, then the dots drop, then the names rise, then the peak counts up.
- **NOTES:** Lens Phase 6 (board Lib-elevation-trek): a 460-unit viewBox, the peak set large, a name beside its dot where it fits clear, else in a right-hand column with a leader; a long label prints its first part and the whole is the dot's title. On a phone it scrolls inside its card. Worked example in `2026-06-03-travel-showcase`.

## climate-calendar
- **World/Tier:** travel · SVG · `src/components/topic/travel/ClimateCalendar.astro`
- **USE WHEN:** monthly temperature / rainfall for a "when to go" decision.
- **DON'T USE:** multi-decade climate records (→ `climate-strip` / `climate-spiral`, earth).
- **DATA:** `{ months: [{month, temp?, rainfall?, note?}], tempUnit? }` — a month's `note` renders as a named footnote under the strip, not in its column (twelve columns are ~22px wide on a phone). Unrendered until 2026-09-15.
- **CUES:** `1`…`12` each month, in authored order (its name, cell and bar) · `temp` the temperature row · `rain` the rainfall row · `peak` the wettest month's number above the ribbon · `legend` the key
- **BUILD:** the month names, then the temperature cells drop left to right, then the rain bars grow down, then the rain values, the footnote and the key, then the number counts up.
- **NOTES:** Lens Phase 6 (board Lib-climate-calendar): the wettest month set large; one column a month, a temperature cell tinted cool to warm from the desk inks with its value, a rainfall bar hanging below with its millimetres; a note is an asterisk on the month's name and a footnote under the ribbon. On a phone the ribbon scrolls inside its card. Worked example in `2026-06-03-travel-showcase`.

## timezone-arc
- **World/Tier:** travel · SVG · `src/components/topic/travel/TimezoneArc.astro`
- **USE WHEN:** city time-zone offsets against a reference — a jet-lag / overlap / sun-position story.
- **DON'T USE:** route geometry (→ `journey-map`); journey durations (→ `itinerary`).
- **DATA:** `{ zones: [{city, offset}], refOffset? }`
- **CUES:** `band` the horizon, with SUN UP and SUN DOWN · `arc` the sun's curve · `ref` the reference city (its label on the curve, and the clock above) · `1`…`n` each city, in authored order (its glyph and its label)
- **BUILD:** the day, the night and the hours, then the horizon fades in and the day's curve draws, then the cities drop, then their labels rise, then the clock.
- **NOTES:** Lens Phase 6 (board Lib-timezone-arc): the reference zone pinned at 12:00 and set large (no live clock, every build the same); one day left to right, the sun's height as a curve over a horizon, day on paper and night on the desk's deep plate; each city on the curve at its local hour with a sun or moon glyph, name, clock and UTC offset. On a phone it scrolls inside its card. Worked example in `2026-06-03-travel-showcase`.

## terminator-globe
- **World/Tier:** travel · WebGL **FLAGSHIP** · `src/components/topic/travel/TerminatorGlobe.astro`
- **USE WHEN:** a jet-lag / time-zone / red-eye story — two cities, a departure moment, a flight duration.
- **DON'T USE:** a multi-stop journey (→ `journey-map`); city time-zone offsets as a flat chart (→ `timezone-arc`).
- **DATA:** `{ epoch, from: {city, lat, lon, tzOffsetH}, to: {city, lat, lon, tzOffsetH}, flightHours, arcBulge? }` — (`showEoT` was documented and read by neither the component nor its scene; struck 2026-09-15.)
- **CUES:** `line` the day and night line (the terminator) · `night` the night side (its wash, and its key) · `arc` the flight's great circle (its path, and its key) · `from` the departure city (pin and label) · `to` the arrival city (pin and label) · `hours` the hours aloft, the number above. The anchors live on the fallback and its label layer, never on the canvas
- **BUILD:** outside the mount only: the key, then the number. The scene's boot reveal and its one idle loop are the runtime's.
- **NOTES:** hero-capable (`layout: wide`); extends the shared country globe; the ARRIVAL chip moves the sun to landing. Lens Phase 6 (board Lib-terminator-globe): on the desk's deep plate, the hours aloft set large, the flight in the desk mark, a key under it; the city labels are HTML over the fallback. BLUEPRINT: `docs/design/blueprints/travel/terminator-globe.md`. RESEARCHER MUST CAPTURE: the two airports' coords + tz offsets + the real flight duration.

## city-grid
- **World/Tier:** travel · SVG · `src/components/topic/travel/CityGrid.astro`
- **USE WHEN:** 1-3 cities compared by the *shape* of their street grid, each drawn as a 36-petal orientation rose; a gridded plan collapses to a cross, an organic one fans to a circle.
- **DON'T USE:** two cities on numeric travel rows (→ `comparison`); a single route's geography (→ `journey-map`); a non-place radial profile (→ `player-radar`).
- **DATA:** `{ cities: [{name, subtitle?, bins[36], orderScore?}], caption?, source? }`
- **CUES:** `1`…`n` each city, in authored order (its card) · `rose` the petals, on every rose · `phi` the order score under each rose · `norm` the "normalised per city" chip
- **BUILD:** the names, then the rings and the compass, then the petals, then the order scores and the chip. No counter.
- **NOTES:** travel signature; hero-capable; per-city-normalised (the `normalised per city` chip whenever there is more than one city); Boeing (2019) order φ under each rose; exactly 36 bins per city enforced at build. Lens Phase 6 (board Lib-city-grid): each rose drawn at a fixed 200px, the cards two across in the panel and one a row on a phone. BLUEPRINT: `docs/design/blueprints/travel/city-grid.md`.

## altitude-oxygen
- **World/Tier:** travel · SVG · `src/components/topic/travel/AltitudeOxygen.astro`
- **USE WHEN:** a high-altitude trek where the *physiological cost of altitude* is the argument — effective oxygen thinning with height, with named acclimatization stops (2–8) at known elevations.
- **DON'T USE:** a route's up-and-down elevation over distance (→ `elevation-trek`); a whole atmosphere's layer stack (→ `atmosphere-column`, earth).
- **DATA:** `{ stops: [{name, elevM, nights?, note?}], maxElevM?, model?, seaLevelO2Pct? }`
- **CUES:** `column` the air column · `1`…`n` each stop, in authored order (its rule, leader and label) · `nights` the tents · `peak` the highest stop's oxygen, the number above · `axis` the height axis and the sea-level line
- **BUILD:** the axis, then the column grows up from sea level, then the stop rules and tents drop, then the labels rise, then the number counts up.
- **NOTES:** the oxygen is *modelled* (barometric, geodesy §7), so a `model:` chip always prints under the column. Lens Phase 6 (board Lib-altitude-oxygen): the column as wide at each height as the effective oxygen there, each stop a rule with a leader to `{elevation} m · {oxygen}%`, a tent per night; a stop's `note` is its hover title and screen-reader text. On a phone it scrolls inside its card. BLUEPRINT: `docs/design/blueprints/travel/altitude-oxygen.md`. Worked example in `2026-06-03-travel-showcase`.

## season-wheel
- **World/Tier:** travel · flat SVG dial with HTML labels · `src/components/topic/travel/SeasonWheel.astro`
- **USE WHEN:** a "when to go" story for ONE destination with per-month values on 2–3 of {climate/comfort, crowd, price} — the annual shape and the sweet-spot window (good weather ∧ thin crowds ∧ low price) are the argument.
- **DON'T USE:** a linear month heat-ribbon for a quick glance (→ `climate-calendar`, travel — if only temp/rain matter); multi-decade climate (→ `climate-strip` / `climate-spiral`, earth); comparing two destinations' months (→ `comparison`). One destination only.
- **DATA:** `{ place, months: [12 ×{climate?, crowd?, price?, label?}], rings?, sweetSpot?, caption?, source? }`
- **CUES:** `1`…`12` each month, January first (its sector and its name) · `best` the sweet-spot window · `climate`, `crowd`, `price` each ring's key under the wheel
- **BUILD:** the tracks, then the months fill clockwise, then the sweet spot, then the names and the key. No counter.
- **NOTES:** a FLAT SVG dial since Lens Phase 6 (board Lib-season-wheel): the tilted CSS-3D disc and the month scrubber are gone, and the cues light a month or the window instead. Twelve sectors, January at the top, two or three rings (inner climate comfort, middle crowds, outer price) filling from the inside out; the sweet spot outlined in the desk text colour; the place named in the middle. The month names, the place and the numerals are an HTML layer, so they print at their own size. Metrics are normalised 0–1 indices, not raw °C/₹/headcounts (the `indices 0–1` chip). Hero-capable. BLUEPRINT: `docs/design/blueprints/travel/season-wheel.md`. RESEARCHER MUST CAPTURE: all 12 months' climate-comfort / crowd / price indices + the recommended window. Worked example in `2026-06-03-travel-showcase`.

## fare-terrain
- **World/Tier:** travel · SVG · `src/components/topic/travel/FareTerrain.astro`
- **USE WHEN:** a fare-timing / "when to book" story — per-route median fare over days-before-departure (≥6 points each, 1–5 routes) stacked as a ridgeline, where the booking sweet-spot IS the argument.
- **DON'T USE:** a trip's cost split into categories (→ `data-readout` / `comparison`); a route's geography (→ `journey-map`); the when-to-*go* seasonal dial (→ `climate-calendar` — that's month-of-year, this is days-before-departure).
- **DATA:** `{ routes: [{label, points:[{daysBefore, fare}], highlight?}], unit, sweetSpotDays? }`
- **CUES:** `band` the sweet-spot window · `low` the lowest fare (its point, and the number above) · `last` the fare nearest departure (its point, and its number) · `1`…`n` each route's line, in authored order · `axis` the fare and day axes
- **BUILD:** the axes, then the window, then the ground fades in and the lines draw, then the points and labels, then the numbers count up.
- **NOTES:** reversed x-axis (far-out left → departure right) declared by the `time → departure` chip; absent `sweetSpotDays`, the window is the contiguous run at or under 1.05 × the focal route's lowest fare; one focal route (`highlight`, else the first) over a tinted ground, the rest thin ink lines. Lens Phase 6 (board Lib-fare-terrain): the sweet-spot fare set large and the last-minute fare beside it; a 460-unit viewBox that scrolls inside its card on a phone. BLUEPRINT: `docs/design/blueprints/travel/fare-terrain.md`. Worked example in `2026-06-03-travel-showcase`.


## attrition-waffle
- **World/Tier:** travel · HTML waffle grid (10 × 10) · `src/components/topic/travel/AttritionWaffle.astro`
- **USE WHEN:** a rate out of exactly 100 with 3–6 outcome groups, where the point is that the reader can COUNT it — a published completion or survival rate that deserves auditing.
- **DON'T USE:** any n not normalised to 100 (the countability IS the kind); a distribution of a continuous value (→ `price-swarm`); stages of attrition in order (→ `bill-funnel`, politics); a part-of-whole where area is the quantity (→ `revenue-mosaic`, tech).
- **DATA:** `{ groups: [{id, label, count, color?, note?}], n?: 100, trueN?, subject?, caption?, source? }`
- **CUES:** `1`…`n` each group, in AUTHORED order (its squares, its ledger row, and the number above when it is the largest) · `grid` the hundred squares
- **BUILD:** the grid, then the ledger rows, then the number. No count-up and no square-by-square stagger (an animated waffle turns an auditable figure into a performance).
- **NOTES:** NO control since Lens Phase 6 (board Lib-attrition-waffle): the group-select island is gone, and the cues light a group (its squares and its ledger row share one anchor). A **10 × 10 grid**, one contiguous block per group in order of SIZE (largest first, ties in authored order), the ledger beside it (swatch, label, note, count), the largest group's count set large; 212px wide on the panel and on a phone, each square about 18px. Build FAILS on: counts not summing to exactly 100 (the error prints the actual sum), fewer than 3 or more than 6 groups, a duplicate group `id`, `n` present and ≠ 100, a group that comes to zero squares, fractional counts without `trueN`, and `trueN` set without the caption stating that real n. `trueN` prints the `per hundred · n = {trueN}` chip. NEVER give this kind a `TRIM` in `src/lib/story.ts`: capping the groups drops squares and the sum check then throws. Pairs with `default`; not hero-capable. BLUEPRINT: `docs/design/blueprints/travel/attrition-waffle.md`. Worked example in `2026-06-03-travel-showcase`. RESEARCHER MUST CAPTURE: the outcome tally for every member of one cohort as counts rather than percentages, the real sample size, and a sourced one-line reason for each outcome group.
## tactics-pitch
- **World/Tier:** sports · SVG pitch with HTML discs · `src/components/topic/sports/TacticsPitch.astro`
- **USE WHEN:** player positions / a formation on the pitch — the spatial set-up is the argument.
- **DON'T USE:** shot locations and quality (→ `shot-map`); match numbers (→ `match-stat-line`).
- **DATA:** `{ players: [{x (0-100), y (0-100), num?, name?, role?}], formation?, team? }` — the disc shows `num`, or `role` when there is no number; `name`'s surname sits in the chip below it (hidden under 560px). Author at least one of `num` / `role`, or the disc is blank: `role` was unrendered until 2026-09-15 and the Arsenal issue shipped eleven empty discs.
- **CUES:** `formation` the formation headline · `shape` the outfield block · `1`…`n` each player, in authored order
- **BUILD:** the pitch, then the block fades in and the lines draw, then the players drop, then the formation and the legend.
- **NOTES:** NO tilt since Lens Phase 6 (board Lib-tactics-pitch): the CSS-3D recline and the pointer tilt are retired; the perspective is drawn. The formation at 48 with the team, a two-key legend, the pitch seen from behind its own goal, the outfield block as one soft tint, each line of the team joined by a rule, a disc per player (an HTML layer over an SVG of lines). Coords: x = pitch width (0 = left touchline), y = pitch length (0 = own goal line). Worked example in `2026-06-03-sports-showcase`.

## shot-map
- **World/Tier:** sports · SVG · `src/components/topic/sports/ShotMap.astro`
- **USE WHEN:** shots plotted by location and xG with outcomes — where the chances came from and what they were worth.
- **DON'T USE:** cumulative chance quality over time (→ `xg-race`); formation shape (→ `tactics-pitch`).
- **DATA:** `{ shots: [{x, y, xg, outcome: 'goal'|'saved'|'miss'|'blocked'}], illustrative? }` — `illustrative: true` when the marks are drawn, not tracked (schematic positions standing for a real total the caption states): the figure then prints no computed headline and no computed xG, only the marks and the outcome legend.
- **CUES:** `goals` the headline count and every goal circle · `box` the penalty box · `1`…`n` each shot, in authored order
- **BUILD:** the pitch and its words, then the shots drop, then the legend, then the goals count up.
- **NOTES:** Lens Phase 6 (board Lib-shot-map): the attacking third on paper, goal at the top, one circle per shot with its area in proportion to its xG (goal filled, save on the tint, miss dashed, block with a drawn cross); the drawing carries no text and never scrolls on a phone. The CSS-3D goal tilt and the hover scale are retired. Worked example in `2026-06-03-sports-showcase`.

## xg-race
- **World/Tier:** sports · SVG + one minute-scrub island (routed through `core/VizCard.astro`) · `src/components/topic/sports/XgRace.astro`
- **USE WHEN:** a cumulative xG race between two teams — who was creating, and exactly when it flipped.
- **DON'T USE:** individual shots' detail (→ `shot-map`); a momentum feel without xG data (→ `momentum-wave`).
- **DATA:** `{ events: [{minute, team: 'home'|'away', xg}], home?, away? }` + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the minute; `series` 'home' | 'away' (or a team name), default the higher line; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `home`, `away` each side's line and its total · `half` the half-time rule · `note1`…`noteK` the annotations, in authored order · `1`…`n` each shot, in authored order (the dot on its step)
- **BUILD:** the grid, the axes and the half-time rule, then the lines draw, then the shot dots drop and the notes rise, then the totals count up. The scene is the plot, not the card (the card holds the scrub).
- **NOTES:** Lens Phase 6 (board Lib-xg-race): home in the desk mark, away in ink-2, the home total at 48 and the away total beside it; a 452-unit viewBox that scrolls inside its card below 1024px. Minute scrub (an instrument; its island stays): a native range input that ships `hidden` and is unhidden once the per-minute payload parses; the lines ahead of the playhead drop to a ghost and the readout states who was ahead at that minute; at rest the chart is the finished one. The root is a plain `.px-viz`, not `core/VizCard.astro`. Worked example in `2026-06-03-sports-showcase`.

## momentum-wave
- **World/Tier:** sports · SVG · `src/components/topic/sports/MomentumWave.astro`
- **USE WHEN:** match momentum swinging between sides — pressure over minutes, with event markers.
- **DON'T USE:** chance-quality accounting (→ `xg-race`); the final numbers (→ `match-stat-line`).
- **DATA:** `{ points: [{minute, value (-100..100)}], events?: [{minute, label, team?}], home?, away? }`
- **CUES:** `top` the headline share · `home`, `away` the swell above the line, the swell below it · `half` the half-time rule · `1`…`n` each event, in authored order (its pin, dot and label)
- **BUILD:** the baseline, the ticks and the half-time rule, then the wave grows out of the baseline, then the events drop, then the share counts up.
- **NOTES:** Lens Phase 6 (board Lib-momentum-wave): the wave above the baseline on the desk-mark tint (home) and below on an ink tint (away), events as dots with labels stacked so none overlap; the headline (48) is the home side's share of the match on top, derived. Worked example in `2026-06-03-sports-showcase`.

## player-card
- **World/Tier:** sports · HTML profile card · `src/components/topic/sports/PlayerCard.astro`
- **USE WHEN:** one player as a flip rating card — a headline rating up front, stat bars on the back.
- **DON'T USE:** multi-axis shape comparison (→ `player-radar`, which also takes a `compare` shape).
- **DATA:** `{ name, position?, team?, rating, stats: [{label, value, max?}] }`
- **CUES:** `rating` the rating and the name · `stats` the attribute block (its label and every bar) · `1`…`n` the attribute rows, in authored order
- **BUILD:** the attribute names, then the bars grow from the left, then the values rise, then the rating counts up.
- **NOTES:** a PROFILE CARD since Lens Phase 6 (board Lib-player-card): the CSS-3D tilt, the flip and the back face are retired, and every attribute is on the one face. A header band on the desk tint with the team and the position chip, the rating at 96, the name beside it, the attributes as bars on a well, the strongest in the desk text ink. Worked example in `2026-06-03-sports-showcase`.

## flight-of-the-ball
- **World/Tier:** sports · WebGL **FLAGSHIP** · `src/components/topic/sports/FlightOfTheBall.astro`
- **USE WHEN:** the dossier has ONE famous shot/kick with primary launch parameters — speed, angle, spin.
- **DON'T USE:** many shots' locations/quality at once (→ `shot-map`); cumulative xG over a match (→ `xg-race`).
- **DATA:** `{ sport, shot: {v0, speedUnit?, elevationDeg, azimuthDeg, spinRevPerS, spinAxis?, from?, label?, note?}, goal?: {x_m, width_m, height_m, z_m}, showGhost?, slowmo? }`
- **CUES:** `real` the real flight and its label · `ghost` the no-air path and its label · `swerve` the bracket at the goal line · `launch` the ball and the launch numbers. The anchors live on the still and the launch row, never on the canvas
- **BUILD:** on the launch row under the mount only: the label, then the three numbers count up, then the flight line. The drawing itself does not build; the scene flies the ball on boot and on REPLAY and keeps its one idle loop.
- **NOTES:** hero-capable (`layout: wide`); drag + Magnus RK4 physics (shared `src/scripts/viz3d/ballistics.ts`, the SAME integrate() for the drawn arc and the flown one). Lens Phase 6 (board Lib-flight-of-the-ball): on the desk's deep plate, the real flight in the lime, the no-air path dashed, the swerve bracketed at the goal line; the still's words are an HTML layer. BLUEPRINT: `docs/design/blueprints/sports/flight-of-the-ball.md`. RESEARCHER MUST CAPTURE: the shot's launch speed, elevation angle, and spin rate.

## elo-river
- **World/Tier:** sports · SVG · `src/components/topic/sports/EloRiver.astro`
- **USE WHEN:** a rating time series — 3–10 teams, each with ≥6 dated Elo / SPI / power values from a NAMED model over one window; the relative rise/fall and the crossovers are the story.
- **DON'T USE:** current standings as a snapshot (→ `league-table`); one match's momentum (→ `momentum-wave`); two teams' cumulative xG within a match (→ `xg-race`); a single team's multi-axis profile (→ `player-radar`). If there is no *rating* (just points/wins), it is a `league-table`.
- **DATA:** `{ model, kInfo?, dates: [ISO ascending, 6–40], baseline?, teams: [{name, short?, color?, ratings: [num|null], subject?}], caption?, source? }` + `annotations?: [{at, text ≤ 12 words, side?, series?}]` (0–3; at = the round index (or `dates[i]`); `series` = the team name or short code, default the subject line; the callout on the mark that shows the finding — docs/design/blueprints/_ANNOTATIONS.md)
- **CUES:** `gain` the headline gain · `overtakes` the rings where the subject passes another team · `1`…`n` each team, in authored order (its line, its end tag and its legend key) · `note1`…`noteK` the annotations, in authored order
- **BUILD:** the grid and the axes, then the lines draw, then the rings, the end tags and the notes, then the gain counts up.
- **NOTES:** a LINE CHART since Lens Phase 6 (board Lib-elo-river): the braided streamgraph is gone. Every team's rating on one shared axis, the subject a heavy line in the desk mark, the others thin ink lines each in its own dash, the subject's overtakes ringed, each line's final rating tagged at its end; the subject's gain across the span is the headline (48). The model, `kInfo` and `baseline` print as one muted line. A `null` rating is bridged by a faint dashed span, so an interpolated stretch never reads as measured. At most one `subject` is honoured. Drawn for the `wide` panel (a 552-unit viewBox); below 1024px it scrolls inside its card. BLUEPRINT: `docs/design/blueprints/sports/elo-river.md` (the braid it describes is retired). Worked example in `2026-06-03-sports-showcase`.

## court-value
- **World/Tier:** sports · SVG · `src/components/topic/sports/CourtValue.astro`
- **USE WHEN:** a model-scored value field over pitch/court space (xG, eFG, points-per-shot) — the geography of where a chance is worth taking, drawn as filled contour bands.
- **DON'T USE:** individual shots as plotted events with outcomes (→ `shot-map`); a formation's player positions (→ `tactics-pitch`); cumulative match xG over time (→ `xg-race`).
- **DATA:** `{ surface?: 'football-box'|'football-half'|'basketball-half', model, valueLabel, valueRange?, shots?: [{x,y,value}] | grid?: {cols,rows,values[]}, levels?, showShots?, smoothed? }`
- **CUES:** `peak` the best spot (its ring and the headline value) · `shots` the sampled shots (when shown) · `1`…`k` each contour band, lowest first (the band and its legend step)
- **BUILD:** the turf and the chalk, then the bands, then the shots, the ring, the words and the legend, then the value.
- **NOTES:** Lens Phase 6 (board Lib-court-value): contour bands from the desk tint (lowest) through the mark to the text ink (highest), raw shots optionally as hollow dots, the best spot ringed and its value at 48; one ramp row names the bands, one muted line names the model, smoothing and domain. The drawing carries no text and never scrolls. Worked example in `2026-06-03-sports-showcase`. BLUEPRINT: `docs/design/blueprints/sports/court-value.md`.

## pace-ridge
- **World/Tier:** sports · SVG (build-time KDE + ridgeline layout; `html.js`-gated reveal, no runtime compute) · `src/components/topic/sports/PaceRidge.astro`
- **USE WHEN:** a measurable quantity with a SAMPLE for the subject AND ≥1 comparison group (≥ ~15 obs each) where the SHAPE of the difference (shift vs spread vs tail) is the argument — sprint speeds, shot distances, serve speeds, lap times.
- **DON'T USE:** one number per entity with no spread (→ `player-radar` / `player-card` / a bar); values over time (→ `elo-river`, `xg-race`); spatial value (→ `court-value`).
- **DATA:** `{ metric, unit, source_n?, stat?: 'mean'|'median', domain?: [min,max], groups: [{label, samples: number[], subject?}], caption?, source? }`
- **CUES:** `stat` the subject's centre, the large number · `gap` the bracket and the two dashed guides · `1`…`n` each group, in authored order (its ridge, centre line and label)
- **BUILD:** the axis and the baselines, then the ridges grow from their baselines, then the centre lines, labels, guides and bracket, then the subject's centre counts up.
- **NOTES:** build-time Gaussian KDE (Silverman bandwidth, ONE global height scale): authors pass raw `samples`, never pre-bin; at most one `subject` (its ridge in the desk mark, the others quiet ink). Lens Phase 6 (board Lib-pace-ridge): each ridge's label and centre value in the left gutter; a bracket over the stack measures the gap from the subject's centre to the largest comparison group's. A 452-unit viewBox that scrolls inside its card below 1024px. BLUEPRINT: `docs/design/blueprints/sports/pace-ridge.md`. RESEARCHER MUST CAPTURE: the subject's per-observation sample of the metric and ≥1 comparison group's sample, from a NAMED dataset.

## channel-ternary
- **World/Tier:** sports · SVG ternary · `src/components/topic/sports/ChannelTernary.astro`
- **USE WHEN:** 4–12 entities split across exactly THREE mutually exclusive shares summing to 100, where the lopsidedness is the argument.
- **DON'T USE:** more or fewer than three parts (→ `player-radar` for many axes, `comparison` for two); positions on the pitch (→ `tactics-pitch`); a value surface (→ `court-value`); a two-way split of a total (→ `revenue-mosaic`, tech).
- **DATA:** `{ corners: [{label} ×3], entities: [{name, values:[l,t,r] summing to 1.0 ±0.001, note?}] }` — 4–12 entities; anything else fails the build. (`corners[].id` and `entities[].short` were documented and never read; struck 2026-09-15 — the plot carries no dot labels by design, so a short code had nowhere to go.)
- **CUES:** `corners` the three corner words · `even` the even-split mark · `1`…`n` each entity, in authored order (its dot, with its numeral, and its table row)
- **BUILD:** the triangle, the grid and the corners fade in, then the dots drop, then the names rise and the table rows fade in.
- **NOTES:** build FAILS if any entity's three values do not sum to 1.0 ±0.001, or outside 4–12 entities. Lens Phase 6 (board Lib-channel-ternary): the triangle with its 25 / 50 / 75 grid; only the entities with a note, and the most lopsided one, are named beside their dot; the table under it is the identity layer (every entity and its three shares). The entity-select island is retired: the cues point now. A 292-unit viewBox that prints at 12px on a phone. Pairs with `default`.


## finish-interval
- **World/Tier:** sports · HTML interval rows + one team-select island · `src/components/topic/sports/FinishInterval.astro`
- **USE WHEN:** a projection with real UNCERTAINTY per entity (8–20 entities, a central estimate plus an interval from a NAMED simulation) where the overlap between intervals is the argument — who is still catching whom with N matchdays left.
- **DON'T USE:** settled standings (→ `league-table`); a rating history over time (→ `elo-river`); a single win probability (→ `data-readout`); a completed bracket (→ `knockout-bracket`); a distribution of observations rather than a range (→ `pace-ridge`).
- **DATA:** `{ model, runs?, positions, zones?: [{fromPos, toPos, label, tone: 'good'|'bad'}], rows: [{name, median, low, high, note?}], caption?, source? }`
- **CUES:** `overlap` the headline number and the dashed band · `zones` the consequence strips (the first label carries the numeral) · `1`…`n` the team rows, in authored order
- **BUILD:** the names, the ticks and the strips, then the ranges grow from their best finish, then the likely finishes drop, then the band, the notes, the model line and the headline count up.
- **NOTES:** build FAILS if any row has `low === high` (a zero-width interval is a standing: use `league-table`), if `low <= median <= high` breaks, if any row runs outside the 1–`positions` scale, outside 8–20 rows, or if `model` is missing. The overlap count is DERIVED, never authored, and is the headline (48), with a dashed band framing those rows. Lens Phase 6 (board Lib-finish-interval): the row-selection island, the readout and the AT table are retired; the cues do the pointing and each row carries its full sentence as its label. The authored `source` must name the model and its run count itself (blueprint §9: never just "projection"). Pairs with `default` or `wide`; not hero-capable. BLUEPRINT: `docs/design/blueprints/sports/finish-interval.md`. RESEARCHER MUST CAPTURE: the simulation's NAME and run count, the league size, and per team the median plus the 5th/95th-percentile finishing positions.
<!-- check:catalog expects exactly the SECTION_KINDS list above this line -->
