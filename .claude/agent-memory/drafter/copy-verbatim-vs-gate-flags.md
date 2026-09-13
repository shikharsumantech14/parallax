---
name: copy-verbatim-vs-gate-flags
description: On a rewrite, copied-verbatim published strings will trip check:prose flags (FOREIGN-ANCHOR, NUMBERS, CAPTION-FORM) — report them, do not "fix" them
metadata:
  type: feedback
---

When a storyboard says a section "carries over verbatim", the copied strings
stay exactly as published even when they trip a `check:prose` warning. Report
each one in the summary instead of editing it.

**Why:** the storyboard's verbatim instruction exists because the verifier
already traced those numbers to the dossier; retyping them is how a rewrite
introduces number drift (`NUMBER-DRIFT` is a ❌, the flags below are ⚠️).
Measured on the Everest/Fuji rewrite (2026-09-13).

**How to apply.** Expect these on verbatim payloads and name them rather than
rewriting:

- **FOREIGN-ANCHOR** — any string with a `$` figure and no `₹` in the *same
  string*. Fires per string, not per section, so a `comparison` cell
  `"**$15,000** permit (spring)"` flags even when the ₹ sits three rows away.
- **NUMBERS** — >2 numerals in one sentence, e.g. a tile note
  `"≈ US$25; doubled from ¥2,000 in 2025"`.
- **CAPTION-FORM** — a published caption that is a label rather than a claim,
  e.g. `"Mount Fuji · Yoshida Trail · 2026 season"`.

**Where you *do* have room:** a NEW string in the same section (the intro, the
caption you are authoring fresh, the skimCaption) should carry the ₹ so the
issue is not flagged for having no Indian anchor at all, and so rule 4 is met
somewhere the reader can see it.

**Jargon glosses are ordering-sensitive.** `check:prose` finds the FIRST
occurrence of a term in document order — head, then per section in field order
`eyebrow → title → intro → plain → howToRead → caption → skimCaption →
source → data` — and looks for a gloss marker (dash, colon, *matlab*,
*that means*, *which is*, *in other words*) in the two sentences starting AT
the term. Consequences:

- A term in an **eyebrow** counts as its first use. Rename the eyebrow rather
  than trusting the intro to catch it.
- The gloss must come **after** the term with a marker. "…the air is so thin
  the body shuts down. Climbers call it the death zone, and…" FAILS; "Climbers
  call the last stretch the death zone — above about 7,950 m the air is so
  thin…" passes.
- A term that first appears inside a copied-verbatim `data` note (e.g.
  `"bullet climbing"` in a tile note) must be glossed in that section's
  intro, which runs earlier in the ordering.

See [[word-budget-reality]].
