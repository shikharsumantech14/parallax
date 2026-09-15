---
name: currency-brackets-audit
description: How to audit a rupee-bracket ruling — the five questions, why the "dollar leads" test must be read against the component not the string, and the two edges nobody checks
metadata:
  type: project
---

Contract §3 rule 4 (rewritten 2026-09-14) produces a recurring audit shape:
an operator ruling supplies a rate and a small set of bracketed figures. It is
cheap to verify and the arithmetic is never the defect.

**How to apply — the five questions, in this order:**

1. **Grep `₹|Rs|lakh|crore` once.** Every occurrence is either a permitted
   bracket, the rate note, or a defect. Three lines of output means the issue
   is clean; it is the fastest high-confidence check in the whole run.
2. **Recompute both figures.** Always correct so far, but it is ten seconds and
   it is the only thing the operator cannot do from the storyboard.
3. **Check the STALE illustrations were not used.** A storyboard written before
   the rate arrives carries the composer's own guess (₹1.3 lakh at ~₹85–90) and
   labels it stale. That guess is in the file the drafter read. Diff the
   draft's figures against the operator's supplied table, not against §5.
4. **"The dollar leads" is a COMPONENT question, not a string question.** On
   `number-sense` the bracket lands in `equals[].text`, which carries no dollar
   at all — the dollar is in the `value` slot at 44–72px in the same card. That
   is compliant, and it *looks* like a breach in the MDX. **Say so in the report
   with the mechanism named**, or the next editor "fixes" it by putting two
   currencies in one equals row and breaks the two-numbers cap instead.
5. **Read the dated-event and rate-card exclusions as removals to verify, not
   rules to trust.** The interesting question is whether a `$20 a seat` inside a
   dated timeline event or a `$0.25 per million` rate card stayed unconverted —
   both are *correct* absences, and both look like omissions.

**The date collision is real but lands somewhere else than expected.** A
September rate on a June-dated issue does not make readers misdate the event
(the section intro pins the date above the source line). What it does is read
as a quiet later edit. Both reader panels recorded exactly that, both times as
a cost of trust rather than of meaning. Report it as an accepted cost of the
ruling, not as a defect to fix.

See [[claim-error-patterns]] (pattern 5), [[flag-severity-calibration]].
