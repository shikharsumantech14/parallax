---
name: job-fit-judgements
description: Rhetorical-job assignments that held up on Parallax issues, and the arithmetic trap in the "CONVERSATIONAL carries half" rule
metadata:
  type: project
---

# Job-fit judgements that held up

**The "CONVERSATIONAL EXPLAINER carries at least half the sections" rule is
arithmetic, and storyboards get it wrong.**

**Why:** the composer sketches jobs in prose ("INVESTIGATION opens, CONVERSATIONAL
carries the middle, CALM-STRUCTURAL closes") and does not count. On the
delimitation rewrite (9 sections) the storyboard's own split was 2 / 4 / 3 and
claimed 4 of 9 was "over half the sections, as required". It is not.

**How to apply:** count before you accept a storyboard's job sketch. When the
count is short, the section to re-read is usually the one whose *prose* explains
a mechanism while its *slot* (a vote, a result, a closer) says CALM-STRUCTURAL.
A `vote-result` intro that glosses two terms of art in two sentences
("Changing the Constitution needs two-thirds of those present and voting. In a
division vote every MP's yes or no is counted") is a walk-through — the
decision tree (§8) sends it to CONVERSATIONAL, not to the closer's default.
The contract's hard blending rule outranks the storyboard's sketch; report the
reallocation as storyboard drift with the reason.

## Reliable slot → job fits so far

- `number-sense` / `data-readout` as section 1, no intro → **INVESTIGATION**
  ("look at this number"). The numeral and the eyebrow carry the opening move;
  an intro here also eats the 80-word words-before-first-graphic budget.
- `timeline` whose intro glosses the issue's one term of art →
  **INVESTIGATION**. The dates *are* the anomaly.
- `you-think`, `bill-breakdown`, `analogy`, the hero chart → **CONVERSATIONAL**.
  These four are the reliable half.
- `paradox`, `quote` → **CALM-STRUCTURAL**, always. Both are "the official line
  beside the physical fact with the sentence that joins them".

## `voice:` (the schema's top-level field)

Dominant job by section count. In practice this is **CONVERSATIONAL EXPLAINER**
for any conforming issue, because the contract mandates it carry half. Set it
anyway — the fact grid drops to three cells when it is absent. Convention:
unquoted scalar after `readTimeMinutes`, before `primer`.

See [[parallax-ai-tells]] and [[check-prose-gate-quirks]].
