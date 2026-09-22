---
name: kind-fit-by-argument-shape
description: Which section kinds actually fitted which argument shapes across composed storyboards, and the recurring swaps that worked
metadata:
  type: project
---

Running record of kind→argument fits that held up, so a later storyboard does
not re-derive them. Not a substitute for `catalog-shapes.md` (pick by data
shape first); this is what the *argument* wanted once the shape was settled.

**Fits that worked**

- **"The reader believes X; one number says Y" → `you-think`, row 1.** Used on
  el-nino, queue and arsenal. It replaces a 300-word opening `prose` section in
  ~45 words of component copy and is the single biggest lever on the ≤ 80-words-
  before-the-first-graphic floor.
- **A cut prose/`paradox` section splits cleanly into `three-steps` (the ordered
  mechanism) + `number-sense` (the one figure) + the chart that shows the
  result.** That three-way split is the standard move for retiring a text block
  without losing a fact. Every number survives; ~170 words do not.
- **One fully-sourced number with 2–3 weaker peers → `benchmark-chart`.** Peers
  may be labelled by rank ("2nd-highest side") when the dossier gives values but
  not names — honest, and it is often the *only* kind in a spine with an
  `annotations[]` slot, which is what satisfies the "every chart with a finding
  carries a callout" floor.
- **A single fully-anchored match or event beside otherwise-flagged season data
  → `match-stat-line`.** It buys a provenance-clean visual row and lets the
  weaker schematic figure stay without carrying the issue alone.
- **A published `paradox` whose "side A" is the misread is a `you-think` in
  disguise.** The catalog's USE WHEN is "two facts **both true**". Where one side
  is what the reader wrongly believes, re-kind to `you-think` at row 1 and
  promote the real side's quote to a `quote` closer. Costs a third of the words
  and frees the one-`paradox` ration. (asteroid-2024-yr4.)
- **Size the spine from the drawable beats, before picking any row.** The 60%
  floor makes the row count a function of how many genuinely drawable beats the
  record has: 4 drawable → a **6-row** issue (4V+2T, 67%), 5 → 8 rows (5V+3T,
  62.5%). 7 rows is the trap — 4 of 7 is 57% and fails. Getting this wrong late
  costs a whole re-composition, and the fix is never "add one more text row".
  (asteroid-2024-yr4: four drawable beats, so six rows, and a short issue is the
  right answer rather than a defect.)
- **Player-name arrays are a names-budget trap.** `tactics-pitch` (and any kind
  with `players[].name`) can spend 9–11 of the 12-name ration on data labels.
  Stripping `name`/`num` and keeping `role` usually also resolves a verifier
  flag about a player not in the source. Name the two the source anchors in the
  intro instead.
- **One subject, one metric, two conditions → `benchmark-chart` with TWO bars.**
  Where a published `comparison` says "the same thing breaks at X under
  condition A and at Y under condition B", the rows are not attributes, they are
  one axis. Two bars is a thin ranking and still the right call: the swap moves
  the section out of `TEXT_ONLY` into the visual set, which is a **two-row
  swing** in the visual share, and the two `annotations[]` carry the "why each
  number matters" the prose cells used to. `sortDesc: true` puts the tall bar
  first so the short one lands as the finding; `highlight` goes on the bar the
  argument is about, not the biggest. (amazon-tipping-point, 2 of 7 visual → 5
  of 8, where the swap alone accounted for two of the three rows gained.)
- **A published `paradox` whose side B is a CONSEQUENCE of side A is a
  `three-steps`.** The catalog's USE WHEN wants two facts pulling in *opposite*
  directions. "Rain falls because the forest is there" / "so clearing here kills
  forest never cut" is one mechanism in two paragraphs, and it runs in order,
  which is `three-steps`' own USE WHEN. Costs a third of the words, leaves the
  one-`paradox` ration unspent, and is neutral on the visual count (both are
  text-only) — so only take it when the words are what you need back. Sibling
  rule to the `you-think` re-kind above: between them they retire most published
  `paradox` sections.
- **One reading against a named band → `throughput-dial`.** It is the only kind
  in the catalog whose DATA carries `zones: [{from, to, label}]`, so it is the
  only one that can draw "here is the value, and here is the range where the
  thing breaks". `carbon-gauge` cannot (one fraction, no band);
  `margin-bullets` throws below four rows and inverts the semantics (a tick you
  must reach, not a line you must not cross). Two cautions: its fill is
  `var(--accent)`, so on a light desk the arc that grows as the bad thing grows
  is drawn in the desk's happiest colour, and its `zones` palette gives the
  FIRST zone the faintest grey. Offer the operator a `data-readout` fallback in
  the same row.
- **The wrong-default problem is not only cross-world — a kind used for the
  right world but the wrong AXIS is worse.** `core-sample`'s default `what`
  says layers are time, "deeper meaning older". Used for a depth column (burn
  depth, water table), that default actively contradicts the graphic and it is
  an *earth* kind on the *earth* desk, so the cross-world heuristic never fires.
  Compounding it: `core-sample` is NOT in `NEEDS_HOW`, so its how-to-read
  renders only if authored — and a depth-not-time column is exactly the
  "counter-intuitive form" that set exists for. Check both `EXPLAIN[kind].what`
  AND `NEEDS_HOW` membership for every graphic row, every time.
- **A cross-world kind usually needs an authored `plain`.** Several
  `EXPLAIN[kind].what` defaults are written for the kind's home world and are
  factually wrong elsewhere: `throughput-dial`'s opens "A speedometer for how
  many requests a system handles each second", `benchmark-chart`'s promises "a
  reference line" the chart may not have, `carbon-loop`'s says "Each box is a
  place carbon is stored" even when the loop is water. Check the default string
  in `src/lib/explainers.ts`, not the catalog's PLAIN line, before writing
  "default — do not author" in the beats table.
- **A prose `comparison` grid re-kinds to `power-matrix` and wins three ways.**
  Whenever the rows are *levers / powers* and the columns are *actors*, and the
  cells are prose verdicts ("Yes — the lever it holds", "No — servers are
  abroad"), the same grid fits `power-matrix`, whose cells are a four-value
  enum and consume **zero** words. On the cockroach rewrite that swap saved
  ~70 words, moved the section from the gate's text-only set into the visual
  set, and quietly retired the two cells a verifier had called "structural
  inferences" phrased as assertions — an enum claims who holds a lever, not
  that an event happened. It is now the first thing to try on any who-controls-
  what `comparison`.
- **The "banned vs withheld" family of corrections is `you-think` + a
  `jargon-buster` term, not prose.** When the issue's load-bearing accuracy
  point is that a common word is wrong (banned/deleted vs withheld), put the
  reframe in row 1's `you-think` and the definition in a `jargon-buster` term,
  and spend the once-per-issue "not X, it is Y" ration *there*. It stops the
  drafter reaching for the reframe in the title and the hook as well.
- **`power-matrix` as a snapshot of ONE case, not as dated regimes.** Its
  DON'T USE routes "control changing over time" to `timeline`, so the obvious
  law-reform framing (2014 · 2019 · 2026 as columns) is a catalog violation.
  The framing that works on a statute is *the decisions inside one application*
  down the side and *the people the law puts in charge of each* across the top.
  The argument then lands on two visible facts the enum cannot fudge: one
  column with a single filled cell, and one **row that is empty across every
  column** (here, "appeal a refusal" — neither Act provides one). An empty row
  is the strongest thing this kind can draw and no other kind can state it.
- **A statute-dense rewrite has more drawable beats than it looks like.**
  `bill-breakdown` and `bill-passage` are both visual in the gate and both
  politics signatures; `bill-passage` had never been published. A law's
  *contents* and a law's *passage* are two different beats and two different
  kinds, and splitting them is what lets a spine carry `jargon-buster` AND
  `three-steps` without failing the 60% floor. Six drawable beats → a nine-row
  spine (6V + 3T, 67%).
- **The rhythmic-triplet tell bites hardest on legislative material**, because
  a bill's provisions genuinely come in threes and fours. "Rewrote the
  definition, removed one clause, added a medical step" is a functional list
  read as a rhythm tell. Write the intro as two clauses joined by *and*, and
  let the cards carry the enumeration — cards are not prose and the tell does
  not apply to them.

- **"The measure everyone quotes is the wrong dimension" → `core-sample` as
  hero.** Where the argument is that a flat/2-D number misses a depth, the
  depth column *is* the argument: put the reader-visible surface at 0 and the
  invisible marks below it, and the hero says "three of these four marks cannot
  be seen from a satellite" without a sentence. Needs only `{depth, label}` per
  row, which is the lowest data bar of any earth graphic — far cheaper than the
  series kinds. (indonesia-fire, four marks: 0 / burn depth / legal water table
  / actual canal depth.)
- **Several independent magnitudes landing in ONE place → `power-flow`, and it
  is build-safe with no `via` node.** The catalog's DON'T USE ("simple
  part-of-whole") reads like a block, and a reviewer will say "that is a bar
  chart". It earns the row when the *shared sink* is the point — four emitters,
  one atmosphere, and the fire band wider than the whole-country fossil band.
  Checked in `PowerFlow.astro`: the conservation check only fires on a `via`
  node (`isVia` needs both inflow and outflow), so an all-sources → one-sink
  payload never throws, and `maxDepth` is 1 which clears the "needs ≥2 layers"
  guard. That makes it the cheapest never-published graphic to reach for when a
  dossier has four sourced magnitudes in one unit.
- **The three-card cap can block a card whose data is perfect, and the fix is
  to move the payload into a graphic's intro.** `PLAIN_CARDS` is capped at 3,
  so a dossier that captures `you-think` + `jargon-buster` + `three-steps` +
  `number-sense` has already overspent by one. Do not drop the fourth's
  content: a `number-sense` `equals` line ("24.8 cm is about a school ruler")
  works *better* as the hero's analogy, sitting next to the mark it describes.
  Say in §8 that it was cut by the cap and not by the data, or the operator
  reads it as an oversight.

- **"The published end date is a scheduling artefact, not a physical limit" →
  `descent-profile` as hero, `timeline` + `three-steps` behind it.** Where the
  argument is that a *date* was set by a process rather than by the thing
  itself, the drawable beat is the irreversible physical event the date buys —
  put the one-way trip in the hero, the dated paper trail in the `timeline`,
  and the procurement mechanism in the `three-steps` immediately after it. The
  timeline raises "why that year?" and the next row answers it, which is also
  what keeps the two text-only rows apart. (iss-retirement.)
- **Budget the authored `plain` / `howToRead` BEFORE fixing the row count.**
  The memory above says to check `EXPLAIN[kind].what` for cross-world kinds;
  the cost of being right about that is the part that bites. On iss-retirement
  four of five graphic rows needed authored copy (wrong default axis, a
  promised reference line, a wrong "one satellite per ring" reading), ~130
  words the nine-row plan had not budgeted, which pushed 1,085 to ~1,215 and
  cost a whole row late. Price every graphic row at *default or authored*
  during Step 5, not during the final tally. The row you cut should be the
  least argumentative one, never the one carrying the Indian stake.
- **A gap between two series, drawn as ONE bar per pair → `benchmark-chart`,
  with `sublabel` carrying both underlying scores.** `benchmark-chart` takes a
  single `value` per item, so "four benchmarks × two models" is not eight bars,
  it is four bars whose value IS the gap (58 / 33 / 25 / 3 points) with
  `sublabel: "open 39 · closed 72"`. This is the general escape hatch whenever
  the library has no two-series kind for your axis: draw the difference, not the
  levels, and let the levels ride in the label. It also makes the finding the
  mark rather than something the reader must subtract, and `annotations[]` then
  has something to point at. (open-models-four-months-behind.)
- **"The thing everyone measures was never the thing that decides" → the hero
  is the kind that draws the OTHER dimension, not the measured one.** On
  open-models the measured dimension is capability (four months, eight ECI
  points) and the deciding dimension is the stack a deployer assembles, so
  `arch-stack` is the hero and the capability charts are supporting rows.
  Sibling of the `core-sample`-as-hero note above, and the same test applies: if
  the hero draws the number in the title, the issue has no argument beyond the
  number.
- **A name-dense topic survives the ≤ 12 cap by putting names in `label` /
  `sublabel` / `tag`.** `check-prose.mjs` ~l.400 scans body fields plus
  `title` / `hook` / `dek` / `primer` / `caption` only, so a `version-graph`
  with ten labs on its nodes and a `benchmark-chart` whose sublabels name both
  models spends ZERO of the ration. Push attribution to the `source` line for
  the same reason. On a lab-dense or team-dense subject this is the difference
  between a nine-name spine and an impossible one. (The inverse of the
  `tactics-pitch` trap above, which is about the *verifier*, not the name
  counter — both are real and they pull opposite ways.)
- **"The output survived, the examination died" → `bill-funnel` as hero.** Any
  argument of the form *every stage that costs a VOTE cleared, the one stage
  that costs TIME did not* is a funnel, and the funnel's own form is the
  thesis: the bars stay flat through introduction and passage, then collapse at
  referral. Two build constraints to settle at composition time, not draft
  time: 4–10 stages, and **the build FAILS if any stage exceeds the one before
  it**, so a stage whose count rises has to be folded in rather than drawn.
  Also the catalog says it pairs with `default` and **never `split`**, which
  beats CANON §2's "the hero may take `split`" — such an issue ships with no
  `split` section at all, and §2 should say so or the operator reads it as an
  omission. (eleven-bills-fifteen-percent.)
- **Four unrelated measures each against its own published target →
  `margin-bullets`, and it carries fine off the space desk.** Its semantics are
  "a value, a scale, and a tick you must reach" — exactly a scorecard of
  sitting days against the recommended number, functioning against scheduled,
  Question Hour against its hour. The analogy that makes it land for an Indian
  reader is **exam marks against a pass mark**, one subject per row. Watch:
  4–8 rows (build throws outside), every row needs a `unit`, it is **not
  hero-capable**, never `bleed` — and its EXPLAIN default is written for space
  ("decibels and kilograms do not compare"), so author the `plain`.
- **Riding an accurate EXPLAIN default is ~25 words a row, and on a tight
  budget that is the whole margin.** The mirror of the iss-retirement note
  above: read the actual default string before writing "author a plain line" on
  every graphic row. Four of nine rows on the eleven-bills spine rode theirs
  unchanged (`bill-funnel`, `bill-passage`, `timeline`, `you-think`) and only
  two needed authored copy. Price each graphic row *default or authored* in
  Step 5 either way — the failure is not budgeting, not the direction.

**Fits that did not work**

- `comparison` loses to `you-think` whenever its rows are qualitative framing
  rather than metrics — the reframe is shorter and carries a number.
- `analogy` (pairs form) loses whenever the same mappings can sit *inside*
  `jargon-buster` glosses and `three-steps` text, next to the number. It is
  almost always the fourth text-only row, which breaks adjacency.
- A `quote` row is the first thing word budget kills. The line survives verbatim
  and attributed inside the following section's intro; offer restoring it as a
  named operator ruling with its exact word cost. **Exception:** where a
  verification report's mandatory sensitivity check requires a quote to travel
  verbatim with a matched clarification, the `quote` row is fixed cost and
  cannot be trimmed by the composer. Budget it (120–180 words), name it the
  designated slack row, and put the trim on the operator as a ruling.

**The composition trap this catalog does not warn you about**

`jargon-buster` and `three-steps` are the plan's own recommendation for
statute-dense material, but both sit in the gate's text-only set alongside
`prose`. Replacing one `prose` section with both **halves the words and buys
no visual share at all**. Plan the visual count first, then spend what is left
on the plain-language kinds; on an 8-row spine three text-only rows is the
ceiling, and a fourth fails the 60% floor outright.

**Since the 2026-09-16 floors there are THREE tiers, not two, and only the code
tells you which is which** (`check-prose.mjs` ~ll. 85–91). `TEXT_ONLY` ·
`CARD_KINDS` = `you-think` / `number-sense` / `data-readout` ·
`isGraphic = !TEXT_ONLY && !CARD_KINDS`. Two consequences a prose reading of
the floors gets backwards: **`timeline` counts as a DRAWN GRAPHIC** (so a
timeline row helps the 40% floor, not just the 60% one), and **`you-think` is
visual but is NOT a graphic**. Also note `data-readout` is a `CARD_KIND` but
*not* in `PLAIN_CARDS`, so it never counts against the cap of three. Read the
sets, not the sentence describing them — a spine can pass on the described
floors and fail on the coded ones.

**A post-2026-09-16 dossier prints its own floor check, and it can be wrong.**
The iss-retirement dossier's §7 counted `three-steps` as a card *outside*
`TEXT_ONLY`; the gate puts both `three-steps` and `jargon-buster` inside it. Its
proposed spine therefore ran a `quote`/`prose` row straight into a `three-steps`
row and would have fired PROSE-RUN. Re-run the adjacency and visual counts
against `check-prose.mjs` ll. 85–91 yourself, every time — a dossier that
arrives with four graphics pre-captured invites you to trust its arithmetic too,
and that is the one part of it nobody verified.

**The inverse also misleads, and it changes which sections you cut.** Several
kinds that *read* like text are visual in the gate: `bill-breakdown`,
`data-readout`, `timeline`, `you-think`, `power-matrix`, `bill-passage`. Before
proposing any re-kind on a rewrite, compute the published visual share from
`TEXT_ONLY` rather than from how the page feels. On the transgender-ratchet
issue the 3-of-6 share came entirely from `paradox` + `quote` + `prose`, so the
fix was cutting two sections and adding four, not re-kinding the card stack that
was already drawing.

See [[dossier-data-gaps]] for the kinds that were wanted and not available.

---

## Two opposed series over time — there is no drawn graphic for it

(half-indias-arrivals-are-indians, travel, 2026-09-21.)

The commonest argument shape in an official-statistics dossier is **one total
splitting into two components that move in opposite directions** (foreign
tourists down 8%, diaspora arrivals up 4%, inside a total that fell 1.7%). The
catalog *looks* full of homes for it and almost none survive contact:

- `approval-chart` — hardcoded 0–100% axis and an Approve / Disapprove legend
  in the component. Two arrival counts in millions cannot ride it.
- `age-pyramid` — the component is generic (authorable `unit`, `sides.*.label`,
  `mode: 'count'|'share'`) and validates cleanly with years as bands, so it
  *builds*. The catalog's DON'T USE bars it: "one group's share tracked over
  time (→ `approval-chart`)". Declining an off-label kind is right even when it
  would have bought a floor; a kind whose catalog block forbids the use is not
  available, whatever the component tolerates.
- `power-flow` — throws on <2 layers by design, and A + B = C is part-of-whole,
  which its own error text redirects to `data-readout`.

**When the intervening years are unverified, `timeline` is the honest form and
it still counts as a drawn graphic.** The dossier printed only four NRI years
(2014 / 2019 / 2024 / 2025) out of eleven. A line chart would have had to
interpolate seven. Six dated events carrying the crossover as *events* asserts
nothing the record does not, and the gate scores the row the same as a chart.
Reach for `timeline` for a sparse series before reaching for any line kind.

**`region-map` needs ISO 3166-1 NUMERIC string ids, and a wrong one fails
silently.** `RegionMap.astro` matches `String(f.id) === z.id` against
`countries-110m.json`; an unmatched zone drops out of *both* the shading and
the label list with no error. Put the nine ids in the storyboard so the drafter
never guesses. Its per-zone `note` renders, which is how a country's story
(Bangladesh, −73%) gets told without a marker — markers need `lat`/`lng`, which
a source-market table never carries.

---

## "The cap is a SHARE, so it is different for everybody" — the ratio-rule family

(premier-league-squad-cost-ratio, sports, 2026-09-21.)

- **When a rule is a percentage of something each actor has a different amount
  of, the hero is the SCATTER, not the flow.** The beats look like money
  (`power-flow`, where the revenue goes) and like shares (`channel-ternary`,
  what the squad spend is made of), and both are drawable and both are
  *setting*. The argument — one rule, twenty different ceilings — only becomes a
  visible shape when the denominator is an axis. `scaling-plot`: revenue on x,
  spend-as-share-of-revenue on y, the fit drawn and falling. Same family as the
  `core-sample`-as-hero and `arch-stack`-as-hero notes: **the hero draws the
  dimension the argument adds, never the number in the title.**
- **`channel-ternary` is the sports desk's cheapest never-published graphic when
  a dossier has any three-way split summing to one** (wages / amortisation /
  other). Two hard constraints to settle at composition: each entity's three
  values must sum to 1.0 ±0.001 or the **build fails**, and the catalog pins it
  to `layout: default` and bars `bleed` — so it can never be the hero, whatever
  its data quality. Decide that before you fall in love with it.
- **`power-flow` a second time, on a second desk, for a different reason.** The
  earlier note has it as the cheap all-sources→one-sink kind. Here it is
  one-source→many-sinks (league revenue → clubs → spend categories) and it
  clears the ≥2-layer guard the other direction. Either fan shape is build-safe;
  it is only the `via`-node conservation check that bites.
- **Two `PLAIN_CARDS` plus one `CARD_KIND` is the comfortable card load on a
  nine-row spine.** `you-think` + `jargon-buster` spends two of three; keeping
  the third unspent leaves `data-readout` (a `CARD_KIND`, not a `PLAIN_CARD`, so
  it costs nothing against the cap) free to carry the beat the dossier's own §7
  forgot.

**A dossier's suggested §7 can itself contain a PROSE-RUN, and the recurring
form is `jargon-buster` → `three-steps` adjacent.** Both sit in `TEXT_ONLY`.
This is now the third dossier to propose that pair back to back. The fix is
almost always to cut `three-steps` and fold its ordered content into the
`jargon-buster` glosses — a gloss can carry an arithmetic step ("85% of what the
club itself earns") without becoming a second row.

**A dossier's §7 can omit a row for the beat its own §1 says the issue turns
on.** Here §4.8 (the league-wide wage total and the asset-sale gains that game
the denominator) had no row at all while §1's thesis depended on it. Read §1
against the §7 table row by row before accepting the suggested spine; the
missing row is usually the one that needs a `data-readout` and no new data.

**Four EXPLAIN defaults are wrong or unusable for this family, all checked in
`src/lib/explainers.ts`:** `scaling-plot`'s `how` says "Up-and-to-the-right
means it keeps improving", which inverts a falling fit; `benchmark-chart`'s
`what` ends "Longer is better", false for a cost ratio; `power-flow`'s `what`
carries an em-dash and its `how` a semicolon, both banned in reader-facing
prose; `channel-ternary`'s `how` opens with the control clause, against the
instrument rule (static reading leads, control trails). Author `plain` and
`howToRead` on all four.
