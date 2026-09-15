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

**The inverse also misleads, and it changes which sections you cut.** Several
kinds that *read* like text are visual in the gate: `bill-breakdown`,
`data-readout`, `timeline`, `you-think`, `power-matrix`, `bill-passage`. Before
proposing any re-kind on a rewrite, compute the published visual share from
`TEXT_ONLY` rather than from how the page feels. On the transgender-ratchet
issue the 3-of-6 share came entirely from `paradox` + `quote` + `prose`, so the
fix was cutting two sections and adding four, not re-kinding the card stack that
was already drawing.

See [[dossier-data-gaps]] for the kinds that were wanted and not available.
