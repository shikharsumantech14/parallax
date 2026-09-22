---
name: restored-and-orphaned-claims
description: The two highest-yield claim checks on a rewrite — a figure restored mid-pipeline lands outside every prior gate, and a surviving clause whose evidence the same rewrite deleted
metadata:
  type: project
---

**Two claim classes that no other pass in the pipeline can see. Both were the
run's best findings on the token-bill rewrite (2026-09-15).**

**1. A field edited AFTER the last reader panel has been read by nobody.**
The panel report quotes the field verbatim, so a diff between the panel's quote
and the current file finds every post-panel edit in seconds. On the token bill,
panel 2 quoted `"and newer ones cost less"` and the file said `"and small
models keep getting cheaper"` — an operator restoration answering panel 2's own
fix 1, made after the panel, before the verifier, with no paper trail.
**How to apply:** grep the panel-2 report for quoted draft strings and compare
each to the file. Anything that differs is an unreviewed edit. Then check its
**field caps** — a restoration lands a field at its original length plus the
restored words, and `check-prose`'s per-kind caps (`jargon-buster.meaning` 25,
`three-steps.step text` 25, `you-think.note` 20, `number-sense.note` 20,
`equals.text` 14) are tight enough that one restored clause tips it. That one
did: 26 of 25.

**2. Audit removals for ORPHANED SURVIVORS, not just for lost facts.**
My existing removal audit asks "is the cut mandated" and "does anything lean on
it". The sharper form is: **does a surviving CLAUSE now assert a direction whose
only evidence the same rewrite deleted?** A number that leaves takes its
argument's footing with it while the sentence stating that argument stays and
still reads fine. On the token bill the whole falling-price ladder ($0.05,
$0.20, $1.25) left with a cut `paradox`, and "small models keep getting cheaper"
survived with nothing behind it — *and* the dossier's ladder held a
counterexample in the anchor's own family (Claude Haiku $0.25 → $1.00).
**How to apply:** for each cut section, list the claims it *evidenced* rather
than the numbers it carried, then find where each of those claims still appears.
A reader panel finds this from the other side ("the fall has a start point and
no end point") — if a panel says a half of the argument is asserted but not
shown, the cause is usually a removal, not a drafting choice.

**A CLEAN panel diff is itself a finding, so run it even when the operator has
already declared the edits.** On amazon the brief named two late edits and asked
me to audit them. Diffing every string panel 2 quotes against the file confirmed
those two and found **no third** — which is the sentence the operator actually
needs ("there is no undeclared edit"), and which nobody can assert without doing
the diff. It takes two minutes and it converts an act of trust into a check.

**The diff is not rewrite-only, and not panel-2-only.** It paid again on a
FRESH issue against a **pass-1** panel (indonesia-fire, 2026-09-22): three
fields differed from the strings panel 1 quoted. Two were improvements; the
third, written to answer the panel's own fix, contradicted its own section's
caption. **A fix authored against a panel note is written in isolation from the
rest of the section** — so check an edited field against its NEIGHBOURS (the
caption, the `plain`, the data it sits on) before checking it against the
dossier. The dossier trace passes; the section disagrees with itself.

**Report both as ⚠️, never ❌.** The direction is dossier-backed; only the
wording outruns it, and the fix is inside the existing words.

See [[removal-audits-on-rewrites]], [[claim-error-patterns]].
