---
name: kind-data-shapes
description: Section-kind data shapes that fight the register — which data keys are sentence-scored, and where a term of art must be glossed to register as glossed
metadata:
  type: project
---

**Some `data` keys are scored as prose, some are invisible.** Keys named
`text`, `note`, `detail`, `body`, `followup`, `punchline`, `statement`,
`headline`, `desc`, `bullets`, `lead`, `paragraphs` are treated as body
paragraphs — sentence length, staccato runs, em-dashes and the
≤ 2-numerals-a-sentence rule all apply inside them. `value`, `unit`, `date`,
`state`, `region`, `code`, `at` are skipped entirely.
**Why:** `number-sense.equals[].text`, `you-think.actually.text` and
`analogy.punchline` read like labels but are graded like paragraphs. On the
delimitation rewrite, "raised the ceiling from 550 to 850 … the 50-year
freeze" tripped the numeral rule because `50-year` counts as a third numeral.
**How to apply:** when a caption-shaped `data` string has to carry two
figures, put the third figure in `value`/`unit` (free) or in the section
`caption` (not sentence-scored).

**A term of art counts as glossed only if a gloss MARKER follows it.** "X
means Y" does **not** register; only a colon, an em-dash, brackets, or the
literal phrases *that means / which means / which is / in other words / called
/ known as*. The marker must come **after** the term, in the same or the next
sentence.
**Why:** "Delimitation means redrawing which voters belong to which seat" is a
perfect gloss and still reads as unglossed.
**How to apply:** write `Delimitation: redrawing which voters belong to which
seat.` or `a division vote: every MP's yes or no counted and recorded`.
Glossing with brackets is cheapest when the em-dash budget (one per
paragraph) is already spent.

**`number-sense` builds a chrome-heavy section by construction** — label,
1–3 `equals` texts, their notes, the section note, the caption and the source
are six to eight text blocks. It cannot meet a three-block-per-section target;
drop the second `equals[].note` first, since the basis is usually already
visible in `value` and the first equals row.

**`vote-result`'s `label` carries a term of art** ("· Division vote"), and on
a verbatim-carry rewrite you cannot edit it — so the gloss has to go in the
`intro`, which renders earlier. Same trap for any kind whose published `label`
is a legal phrase. See [[word-budgets-that-bite]].
