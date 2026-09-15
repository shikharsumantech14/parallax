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
- **A reader-panel report sits below all of those, and still causes departures.**
  Its second pass post-dates the storyboard and the draft, but it writes
  "direction only, never the sentence" — so a change made on its recommendation
  is *advisory in origin and unrecorded by construction*. Read panel-2's "what
  would fix it" list against the draft: the items that landed are departures
  whose only paper trail is the panel file. Judge each on its merits, then ask
  for the provenance note. Twice now the panel's direction has been right and
  the storyboard's table stale in the same field (a name §7 assigned to a row
  that the panel proved was carrying no reason for the reader).
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

**An APPROVED storyboard can contradict itself, and can contain a phrase its own
constraint list forbids. Diff the storyboard against ITSELF before you diff it
against the draft.** Two instances on one file (transgender-ratchet, 2026-09-15):

- **§2's hero prose said row 2 was "examine and recommend" while §8b.2 said never
  say the board examines anything.** The drafter followed the constraint and
  relabelled the row, which is right, and the departure then looks like drift
  against the approved table. The danger is the reverse direction: anyone who
  later opens the storyboard to "restore" the hero reintroduces the exact reading
  a reader panel was run to close.
- **The `SETTLED` box said "all seven settled as recommended" and then wrote
  ruling 2 as the OPPOSITE of the recommendation it was settling.** The operator's
  live brief resolved it; the file still reads both ways.

**How to apply:** grep the storyboard's constraint list (§8b) for its forbidden
verbs and phrases, then grep the rest of the storyboard for the same strings. A
hit means the draft had to depart and nobody recorded why. Do the same for a
`SETTLED` block that says "as recommended": open each numbered recommendation
below it and check the box's own text agrees. Then make it a **required fix** that
the departure is written into `# EDITOR NOTES` naming the storyboard section it
overrides. A mandated departure with no note is a revert waiting for its next
reader, and on a sensitive subject the reverted thing is the safeguard.

See [[flag-severity-calibration]], [[inherited-data-blindspot]].
