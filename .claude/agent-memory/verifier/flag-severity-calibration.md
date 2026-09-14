---
name: flag-severity-calibration
description: How to report a ❌ that is paperwork rather than a wrong fact, and when a lexicon/gate is wrong instead of the draft
metadata:
  type: feedback
---

**A ❌ still blocks, but say in the first paragraph what kind of ❌ it is.**

**Why:** the verdict is a three-state switch, so a provenance gap and an
invented fact both come out as BLOCKED. An editor reading "BLOCKED" on a
rewrite that fixed two prior blockers will assume the rewrite failed, and may
re-run an expensive phase to fix a problem that needs one dossier line.

**How to apply:**
- Open the verdict paragraph with what was *resolved*, then name the blocker
  and its cost ("the fix is a dossier addendum plus one `sources[]` entry, not
  a text change"). Do not soften the verdict itself.
- Distinguish three ❌ species explicitly: invented fact (re-research),
  non-quotable source (re-source or cut), untraced-but-inherited provenance
  (record the source). Only the first two need the writing agents again.

**Sometimes the draft is right and the supporting file is stale.** When a
draft's Hindi word is absent from `hinglish-lexicon.md` but is the exact phrase
`_voice-core.md` §9 uses as its signed worked example, the defect is in the
lexicon. Flag it at low severity and state plainly that the fix is to add the
rows, not edit the draft. Same logic for `jargon.md` glosses and for
`check:prose` heuristics — the DRAFT-marked voice files are younger than the
contract and lag it.
