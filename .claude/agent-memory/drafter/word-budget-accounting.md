---
name: word-budget-accounting
description: The 1,100-word ceiling and the 80-words-before-first-graphic floor are measured far more broadly than a storyboard's per-row budget table — budget ~90 words of headroom
metadata:
  type: project
---

A storyboard's per-row word budgets undercount what `scripts/check-prose.mjs`
actually measures. Budget for the gate, not the table.

**Why:** the gate's `readerWords` collects head fields *plus*, per section,
`eyebrow`, `title`, `intro`, `plain`, `howToRead`, `caption`, `skimCaption`,
`source`, **and every string inside `data`** that is not in its `SKIP_KEYS`
set. A storyboard table typically lists only intro / data notes / caption /
source, so a plan that reads "1,089 of 1,100" measures ~1,190 once ten
eyebrows and ten section titles are added. The Arsenal rewrite (2026-09-13)
needed roughly 100 words cut from the approved plan to land at ~1,087.

**How to apply:**
- Add ~10 words per section for `eyebrow` + `title` on top of the storyboard's
  row budget before you start writing. If the plan is already at the ceiling,
  the slack has to come from somewhere — say where in the summary.
- `SKIP_KEYS` means `value`, `unit`, `at`, `side`, `role`, `emphasis`, `date`,
  `x`, `y` cost nothing. That is why a `tactics-pitch` of eleven players is
  almost free and a `data-readout` tile's `value`/`unit` are free.
- But `outcome` is **not** skipped: a 20-shot `shot-map` spends 20 reader
  words on `"goal"`/`"saved"`/`"miss"` strings alone. Same for `name`,
  `badge`, `score`, `outcome`, `competition`, `formation`, `team`.
- **Words before the first graphic includes section 1's `eyebrow` and
  `title`**, not just its intro (the loop adds them, then breaks on the first
  non-text-only kind). A 70-word head leaves ~10 words for all of section 1's
  chrome, which is one eyebrow and one title and nothing else. The practical
  move is to omit section 1's `intro` — the opening kinds (`you-think`,
  `data-readout`) carry their own labels and caption, so nothing is lost.
- **A grid kind can cost more than its whole storyboard row.** A storyboard
  budgets `power-matrix` as "5 institutions + 4 party labels + caption + plain";
  the gate also counts every `cells[].institution` repeat (see
  [[component-data-shape-traps]]), which on a full 5×4 grid is ~100 words — most
  of a row's budget again. Check any kind whose data repeats a label to address a
  cell before you trust the plan's total.
- **A `source` written as `{ label, date }` costs only the label.** The gate
  reads `s.source.label` and ignores the date, so every dateline, every "2–3
  June 2026" and every accessed-on is free the moment it moves out of the
  string form. On a nine-section issue that is 30–50 words back for no loss of
  information, and it also keeps an en dash out of a counted string.
- **Three cheap ways to come in under a storyboard's own row budget**, each
  worth 5–20 words and none of them a loss to the reader: omit `you-think`'s
  two panel labels (the defaults "What most people think" / "What the data
  shows" are usually right, and an authored label is not free); drop the `note`
  on the one or two timeline events that carry an `annotation`, since the
  callout IS that node's note; and let the hero's `plain` carry the reading
  rather than authoring a `howToRead` on a kind outside `NEEDS_HOW`, which
  saves a whole block as well as the words. The Kessler rewrite landed at ~938
  against a plan of ~1,043 on those three alone.
- A `skimCaption` on all ten sections costs ~200 words, which no issue at the
  ceiling can afford. It only *renders* for `prose` in skim mode (other kinds
  keep their graphic), so author it on the prose section, and on one or two
  others only if the budget has room. Story mode is covered by the authored
  `story:` block, which the gate does not count at all.

Related: [[component-data-shape-traps]].
