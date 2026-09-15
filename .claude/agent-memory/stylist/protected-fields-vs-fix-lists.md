---
name: protected-fields-vs-fix-lists
description: How to resolve a launching agent's named fix that lands inside a Step-5 do-not-touch field, and the panel's own "do not touch section N" collisions
metadata:
  type: feedback
---

# When the fix list points at a protected field

**A specific, named fix from the launching agent outranks the generic Step-5
do-not-touch list for that field only. Make the minimum edit and report it in
its own line of the summary.**

**Why:** Step 5 protects `annotations[]`, readout `note`s, timeline `note`s and
data labels because the stylist has no business *restyling* the precision
layer. It is not a claim that those strings are always correct. When the reader
panel has found a real defect there (an annotation with no noun, two spellings
of the same caveat in two note slots) and the operator's agent has put it on the
numbered list, refusing it just moves the defect to the verifier with a flag
attached. The rule exists to stop drive-by rewriting, not to stop repairs the
editor asked for.

**How to apply:**
- Edit only the field named, only the words the finding names. An annotation
  fix does not become an annotation rewrite.
- Never touch the field's *anchor* — an `at:`, a `year:`, a `sourceRefs` entry.
  The drafter usually pinned it for a reason the reader cannot see and the
  EDITOR NOTES usually record it. Fix the wording so the reader is not misled
  by the pin; leave the pin.
- Report every such edit separately, with before → after, so the operator can
  reverse exactly that one.
- The list is the job. A panel finding the launching agent did **not** carry
  forward stays a flag, even when it is in a field you may write.

## The panel's "do not touch section N" is about a sub-field

A panel will write "Do not touch §1 in any respect" and, four rows earlier,
score §1 down for the wording of its `note`. Not a contradiction: the
protection attaches to whatever the panel's *reasoning* names — usually the
reframe or the graphic that taught the point cold. Read the reason, apply it to
that sub-field, and treat the rest of the section normally. When both readings
survive, prefer the one the launching agent's numbered list assumes.

## Fixing a `paradox` statement drags two flag-only fields with it

**A side's `statement`, its `label` and the section `title` are one sentence
split across three fields, and only the statement is ever the named fix.** When
a panel finds the statement claiming more than its `detail` evidences and the
editor says "fix the statement, not the evidence", the repaired statement will
usually stop rhyming with the label above it and the title above that, both of
which are flag-only.

**Why:** the title is written first and the label is written to echo it, so both
carry the *old* claim. Repairing all three is a retitle, which the stylist may
not do.

**How to apply:** choose the statement that is true to the evidence AND closest
in vocabulary to the title, so the label still reads as a heading rather than a
contradiction. Then declare the residual in its own line, with the alternative
label you did not write, so the operator can close it in one edit. Do not fix
the label alone: it leaves the title mismatched and hides the seam instead of
reporting it.

## Unit conversions are numeral edits and must be declared

Converting 160,000–200,000 to "1.6 to 2 lakh", or twenty million to "2 crore",
is a rule-4 improvement and usually pre-sanctioned in the storyboard's
"derivations" block — **and it still trips the gate's NUMBER-DRIFT diff and
still looks like a retyped figure to a verifier reading the field alone.**
Check the storyboard authorises that exact conversion in that exact row, keep
the band a band, and put the raw figure beside the converted one in the summary
so the trace survives outside the file.

See [[parallax-ai-tells]] and [[check-prose-gate-quirks]].
