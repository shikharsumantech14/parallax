---
name: where-a-caveat-renders
description: Render order decides which of intro / howToRead / caption / plain gets an honesty label, an instruction and a figure — plus the bar-label edit that silently orphans an annotation
metadata:
  type: feedback
---

# Put the instruction above the graphic and the caveat below it

**For a non-VizCard kind the reader meets four fields in this order: `intro`,
the `howToRead` panel, the component's own caption row, the graphic, then the
`plain` line with the source.** Decide what goes in each field by that order,
not by which field the storyboard nominated.

**Why:** on the Amazon dial the storyboard sent the issue's honesty label ("the
reporters' framing of today, not a figure quoted from the paper") to the
`howToRead`, "the field it always belonged in". It renders *above* the graphic,
so every one of four readers met a verifier-facing caveat as their **first
instruction**, before they had seen the thing it qualified. Two skipped the
panel outright. The storyboard's reasoning was sound in the abstract and wrong
on the page, and only a panel read could find that.

**How to apply:**
- `howToRead` (above) is where to look and what to compare. It is the reader's
  first instruction, so it may not open on a caveat and it may not name a thing
  the component does not draw. **Read the component before trusting it** — a
  `data:` field the drafter authored is not proof the component renders it.
- `caption` (top of the card, for every kind that takes one) carries the
  figures. It is the field the reader sees while looking at the graphic.
- `plain` (below) carries the FORM and, with it, the *drawing choice*.
- A caveat placed after the graphic reads as care. The same caveat placed
  before it reads as the issue arguing with itself.

## The device that survives a panel: the choice in `plain`, the figures in `caption`

The reader panel singled this shape out as the one honesty device that worked,
and it transplants to any graphic that draws one number out of a published
range:

- `plain` ends on the choice, with **no numerals** — "Both bars are drawn at
  the low end of their published range", "The arc is drawn at the lower of the
  two published readings."
- `caption` carries both figures in the order the marks appear.

The failing version states the choice and the figures in the same breath, which
forces the reader to do arithmetic ("the lower of the two figures… the other is
roughly 17–18%" promises two figures and delivers a figure plus a range that
contains it). Split the two jobs across the two fields and the arithmetic
disappears without losing a word of the honesty.

## A zone / series label is a free place to print a number on the figure

`throughput-dial`'s `zones[].label` renders as a legend chip with a colour
swatch under the dial, and `from` / `to` are already in the payload — so moving
the band's range into the label prints it beside the graphic and **adds no
fact**. Check the component for a label slot before concluding that a number
"cannot go on the picture". `from`, `to`, `at` and `value` are in the gate's
`SKIP_KEYS`, so only the label's own words cost anything.

## A caveat's scope is read as a judgement on everything it covers

**Write the caveat for the class it was calibrated to, and let the rest of the
section fall outside it.** A sourcing caveat written for one disputed rendering
("all three lines below come from press reports, not the parliamentary record")
also lands on the one voice that never needed it — a written resignation
statement was never a parliamentary-record item — and the panel reads the
blanket form as quietly discounting the place where the affected community
speaks for itself. Scope it by what the lines *are*: "the lines spoken in the
debate below…" covers the two reported ones and leaves the written one alone,
at no extra words.

While you are in there, **a caveat that names an institution's paperwork must
gloss it in the same sentence.** "The parliamentary record" split the panel two
ways: readers who knew the term read careful sourcing, readers who did not read
hedging ("we could not find this anywhere official"). "Parliament's own
transcript" is the same caveat, one word longer, and it cannot be read as an
admission.

## The bar label IS the annotation anchor

`benchmark-chart` matches `annotations[].at` against `items[].label` as a
string, and **a label not in `items` is a silent no-op** — the callout vanishes
with no error and no flag. So a panel fix to a bar label is always two edits.
Same pattern anywhere `at:` names a row rather than an index. This is the one
case where my standing "never touch the anchor" rule inverts: here the anchor
is derived from the field being fixed, so leaving it alone is what breaks it.

`power-matrix` is the second instance and it fails the same silent way:
`cells.find(c => c.institution === inst)` matches the row label as a string, so
a fix to `institutions[n]` that does not also rewrite every `cells[]` entry
naming it empties the row — on the hero, whose empty rows are usually the
argument. Two edits, always, and grep the label string before and after.

## A row label carrying a verb is a claim about who acts

Check every row/axis label of a control grid against the verbs the prose
sections teach. A `power-matrix` row reading "Examine and recommend", filled by
the medical board, handed the statute's verb (the magistrate examines the
board's *recommendation*) to the wrong actor, and it was the only place on the
page inviting the exact reading the editor notes forbid. Three other sections
said *recommends* and the grid still outvoted them for the most literal reader,
because the grid is what the section is *for*. Reuse the glossed vocabulary
verbatim ("Recommend to the magistrate"); the cells never change.

See [[protected-fields-vs-fix-lists]] and [[check-prose-gate-quirks]].
