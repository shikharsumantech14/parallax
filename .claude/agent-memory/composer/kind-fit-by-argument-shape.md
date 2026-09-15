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

See [[dossier-data-gaps]] for the kinds that were wanted and not available.
