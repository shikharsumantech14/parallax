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
- **Player-name arrays are a names-budget trap.** `tactics-pitch` (and any kind
  with `players[].name`) can spend 9–11 of the 12-name ration on data labels.
  Stripping `name`/`num` and keeping `role` usually also resolves a verifier
  flag about a player not in the source. Name the two the source anchors in the
  intro instead.

**Fits that did not work**

- `comparison` loses to `you-think` whenever its rows are qualitative framing
  rather than metrics — the reframe is shorter and carries a number.
- `analogy` (pairs form) loses whenever the same mappings can sit *inside*
  `jargon-buster` glosses and `three-steps` text, next to the number. It is
  almost always the fourth text-only row, which breaks adjacency.
- A `quote` row is the first thing word budget kills. The line survives verbatim
  and attributed inside the following section's intro; offer restoring it as a
  named operator ruling with its exact word cost.

See [[dossier-data-gaps]] for the kinds that were wanted and not available.
