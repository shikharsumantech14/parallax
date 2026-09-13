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
- A `skimCaption` on all ten sections costs ~200 words, which no issue at the
  ceiling can afford. It only *renders* for `prose` in skim mode (other kinds
  keep their graphic), so author it on the prose section, and on one or two
  others only if the budget has room. Story mode is covered by the authored
  `story:` block, which the gate does not count at all.

Related: [[component-data-shape-traps]].
