---
name: light-touch-passes
description: How to run a stylist pass on a draft already written into the v2 contract — retain by default, and where the real surface is
metadata:
  type: feedback
---

On an issue drafted directly into `_voice-core.md` v2 and already through a
reader panel, **retain by default and rewrite only where the rewrite is
meaningfully better in the register.** Say "retained — already in register" and
mean it.

**Why:** the drafter now works from the same contract the stylist does, so the
prose usually arrives in register. A pass that rewrites for the sake of
rewriting burns the word ceiling and re-opens decisions the storyboard's
operator rulings already settled.

**How to apply:**

- **Know how small the surface is.** When component `data`, `caption`,
  `source`, `annotations`, the `story` block and every structural field are
  held, the writable fields on a component-first issue are the section
  **`intro`s** and any **`plain`** line. On an eight-section issue that is nine
  fields. Budget the pass accordingly and spend the words on seams and glosses.
- **The word ceiling is the binding constraint, not the field budgets.** A
  well-composed issue lands ~1,050 against 1,100, so a pass has roughly 50
  words to spend in total. Cost every proposed rewrite in words before writing
  it, and pay for additions by tightening elsewhere (an abstract-noun label cut
  from a closer usually funds a gloss somewhere earlier).
- **Words-before-the-first-graphic is often at its ceiling (80).** When it is,
  the head, the first eyebrow, the first title and the first intro are all
  frozen — no rewrite there may add a single word.
- **A storyboard's analogy column is an instruction, not a suggestion.** If the
  storyboard assigned an analogy to a row and the draft does not carry it, that
  is drift the stylist can fix inside the intro, and it usually also answers a
  panel finding.
- **`npm run check:prose -- <slug>` may not be runnable** — the Bash tool has
  been disabled in this agent's session before. Count words by hand and leave
  margin rather than assuming the gate will catch an overshoot.
