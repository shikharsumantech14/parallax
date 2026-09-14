---
name: binding-file-precedence
description: On rewrites, a later commissioned research pass outranks both dossier and storyboard — check precedence before flagging drift or an unfixed constraint
metadata:
  type: project
---

**Before flagging STORYBOARD-DRIFT or an "unfollowed" dossier rule on a
rewrite, establish which file is binding.** The pipeline now produces artefacts
that supersede each other, and the older file is often still the one the
storyboard quotes.

**Why:** the Arsenal Phase-4 rewrite (2026-09-14) departed from the approved
storyboard on four `data-readout` tiles. Every departure was *mandated* by
`2026-09-13-arsenal-re-anchoring.md`, a narrow researcher pass the operator
commissioned in the storyboard's own ruling 6 — so it post-dates and outranks
the table it contradicts. Flagging those as drift would have told the editor to
restore a number (28.5 xGA) the sources contradict. The same pass also
retired two standing constraints the storyboard listed as absolute ("never
merge the two xGA measurements", "never assert the prior record-holder") by
showing the dossier's reading was stricter than the source.

**How to apply:**
- Order of precedence on a rewrite: **operator rulings (storyboard §9) →
  the latest commissioned research pass → the storyboard table → the dossier.**
  A storyboard constraint written against a stale dossier reading loses.
- A departure is legitimate drift-free when it is (a) mandated by the binding
  file and (b) *named* somewhere the editor will see it. An MDX `{/* */}`
  provenance note satisfies (b) and ships nothing to the reader — that is the
  right home for the "what changed and why" ledger on an in-place rewrite.
- The binding file's own "for the operator to rule" list is a checklist: for
  each item, find where the answer got recorded. If the only record is a
  comment inside the draft, say so — a ruling that lives in the artefact it
  governs disappears with the next rewrite.
- Re-read the prior verification report's *required fixes* as a table and mark
  each resolved / not, explicitly. Cuts resolve fixes silently: three of the
  Arsenal five were resolved by deleting the sections that carried them, which
  reads as "not addressed" unless you go looking.

See [[flag-severity-calibration]], [[inherited-data-blindspot]].
