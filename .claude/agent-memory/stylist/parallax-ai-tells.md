---
name: parallax-ai-tells
description: Which of the seventeen AI tells actually recur in Parallax drafts, and which never do — so the audit spends its time where the misses are
metadata:
  type: project
---

# Tells that recur in this publication

**Why:** the seventeen-tell audit is cheap to run badly (scan for em-dashes,
declare it clean). The measured pattern across the Phase-4 rewrites is that the
loud tells are already gone by the time the stylist sees a draft, and the ones
that survive are the quiet register rules, not the catalog's headline items.

**How to apply:** run the full catalog anyway, but expect the finds here.

## What is already clean in a post-contract draft

Tells 1–6 and 7–9 (em-dash overload, binary reframe, triple-fragment close,
abstract-noun labels, "First… Second… Third…", the retired title formula, the
antithesis dek, stacked citations) do not survive the drafter any more. The
drafter also correctly rations the **one** binary reframe per issue and the
storyboard now names which section spends it.

## What actually survives to the stylist

- **The unwritten connective.** A comma-spliced or semicolon-joined pair where
  the relation (`because` / `but` / `so`) is implied. Not in the tell catalog —
  it is contract rule 7 plus CALM-STRUCTURAL's "Don't: leaving the connective
  out" — and it is the single most common real find.
- **The over-long single-sentence intro.** Usually on the hero, usually because
  a panel fix was welded onto an existing sentence with a colon. Under the
  35-word cap, so no flag fires; still the worst-reading sentence in the issue.
- **Three numerals in one sentence.** Arrives the same way: a panel asked for
  two figures to be separated and the drafter added the third to the same clause.

- **The term of art carried across sections with no gloss.** Not a catalog
  tell either — contract rule 2. The pattern: a word enters as an ordinary
  noun in one section's intro, then becomes an `eyebrow`, then a section
  `title` carrying the finding. By then it is load-bearing and has never been
  explained. Titles and eyebrows are flag-only, so **the gloss has to go into
  the earliest prose field the word appears in**. Read the issue's eyebrows and
  titles as a list first; any repeated noun there is the candidate.
- **The English false friend across Indian sports.** *Delivery* on a football
  issue reads as cricket to an Indian reader; so do *over, pitch, boundary,
  strike*. The reader panel catches these as "lost sentences", not as jargon.
  Plain-English replacement, not a gloss — the word itself is the defect.

## The panel handoff is a claim, not a state

The launching agent's "the panel's fixes have been applied" usually means the
*named* ones. Diff the panel's "what would fix it" list against the file item
by item; on the Arsenal rewrite four of ten were still open, and two were mine
to fix (the unglossed term, the false friend) while two were in protected
fields (a tile `note`, a chart's data labels) and could only be flagged.

## Hinglish, politics desk

The desk carries one Hindi phrase per issue at most, and it survives only as
**reported speech with its English gloss in the same sentence** ("Credit nahi
chahiye, he said: I do not want the credit"). The gate will not see it at all —
`nahi` is on its particle list and `chahiye` is not in the lexicon, so
`hindiContent()` returns empty and every Hindi rule is skipped. Judge it by the
four tests yourself; the gate is not the check here.

**The load-bearing test applies to a section `title` as a unit**, not just to
the sentence. A title is the one field rendered alone — the issue page's aside
prints a contents list of bare titles — so English beside it in the intro does
not travel with it. The reader panel made this finding on `2026-04-24-delimitation`
and the fix was to put the English in the title and the Hindi in the intro
where the gloss sits next to it. Repeat that shape.

See [[check-prose-gate-quirks]] and [[job-fit-judgements]].
