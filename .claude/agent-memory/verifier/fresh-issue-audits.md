---
name: fresh-issue-audits
description: Where defects hide on a FRESH issue (not a rewrite) whose dossier is strong — refs completeness, superlatives, and the measured-mean presented flat
metadata:
  type: project
---

First strong fresh issue audited (indonesia-fire, earth, 2026-09-22): dossier
`ready-for-draft` and unusually good, storyboard approved with nine numbered
rulings, `check:prose` returning **0 ❌** and every floor passing. All 68 claims
traced; nothing was invented. **The defects had moved somewhere else.** On a
rewrite you hunt drift from the published version; on a fresh issue with a
strong dossier there is no drift to find, and these three classes are where the
yield is.

**1. `sourceRefs` COMPLETENESS is the top-yield check, and it is invisible to
every other gate.** The schema check only asks *does every ref resolve* — it
always does. Nobody asks the inverse: **does every numeral on the section
resolve to a ref that is ON the section?** Here that caught four sections, one
badly: a `three-steps` whose three numerals (40 cm, 50/75, 24.8 cm) and whose
mechanism claim were backed by src-05, src-09 and src-10, none of which it
cited — it cited only the two general-explainer sources. Same shape on
`core-sample` (Yokelson missing under "surface litter burns first") and
`timeline` (the 40 cm regulation source missing under the 2019 event).
**How to apply:** go section by section, list each numeral and named mechanism,
name the dossier row that backs it, then name the `src-NN` that carries that
row, then check the section's `sourceRefs` contains it. Ten minutes for an
issue. Report ⚠️ not ❌ — the facts trace, the paperwork does not — but say the
reader sees nothing, which is the part that matters.

**1b. The sibling: a narrative card with `sourceRefs` and NO `source:` line.**
`jargon-buster` and `three-steps` both shipped with refs and no `source:`
string, so nothing renders under them at all (CANON §7, "no source, no
section"). It is invisible reading the section — the refs *look* like sourcing.
**Check it against the backlist, not against the schema**, where `source` is
optional: `grep -A8 "kind: three-steps" src/content/issues/*/index.mdx` showed
every other issue carries one. A convention the backlist keeps unanimously and
this draft breaks is a finding; the schema will never tell you.

**2. A SUPERLATIVE is the fresh-issue analogue of the dropped qualifier, and
the dossier usually refutes it one row away.** The run's only ❌ was a timeline
note reading "The deepest burn on record". Every number around it traced. But
the study measured **one season**, the dossier's own wording is that 24.8 cm
"peaks" *within that season's* Aug→Sep→Oct series, and the adjacent dossier row
names a **different year** (1997) as "the largest single-year total in the
record". So the superlative was not merely unsourced — it was contradicted by
the file it came from.
**How to apply:** grep the draft for *deepest, largest, worst, first, only,
highest, record, ever*. For each, find the dossier row that would establish the
**ranking**, not the value. If the evidence contains measurements for one year
only, no cross-year superlative is available at any wording. Report ❌, but open
with the species: an overreaching characterisation is a one-clause fix and
needs no writing agent re-run — say so, or BLOCKED reads as "the draft failed".

**3. A measured MEAN presented as a flat quantity, in every field at once.**
The dossier said "**Mean** peat burn depth **across Indonesian peatland**" in
all four places; the draft said "24.8 centimetres" in five (hook, card value,
hero title, hero layer label, timeline label) and "mean" or "average" in none.
This is claim-error pattern 1 scaled up — the qualifier is not dropped once, it
is dropped everywhere, so no single field looks wrong and there is nothing to
diff against. It is worse on a **drawn graphic**, which renders an average as
one definite line: here the `core-sample` column plus a caption ("a school
ruler taken off the top of the ground") actively invites reading it as the
depth at a place.
**How to apply:** for every headline measurement, read the dossier's full
phrase and ask whether it names a *statistic* (mean, median, peak, modelled,
estimated) or a *measurement*. If a statistic, grep every occurrence in the
draft and check whether **any one of them** says so. Recommend one qualifier at
the graphic, not five edits — it fixes the reader's understanding once and it
is the only version that fits the word cap.

**4. Separate real `JARGON-UNGLOSSED` hits from the gate's own artifacts.**
`check:prose` flagged four; three were the `jargon-buster` **term lines
themselves**, which *are* the gloss. Only one was real — a term used in §2
whose gloss card sits at §4. Report the artifacts as ℹ with the reason, or the
editor rewrites a glossary to satisfy a gate that was reading the glossary.

**5. Plan the fix list against the word cap, not just the claim.** The issue
sat at **1,098 of 1,100** reader words. That makes the cap a constraint on the
*report*: every recommendation has to be named as a substitution or as a debt
against the storyboard's designated slack row. Read the storyboard for which
row that is — a good one names it ("row 9 is the designated slack row") and
then the recommendation is actionable instead of arithmetic the editor has to
redo.

**Also confirmed here:** the panel-diff check (see
[[restored-and-orphaned-claims]]) works on a **pass-1** panel on a fresh issue,
not just panel 2 on a rewrite — and it was where the second-worst defect lived.
Three edits were made after panel 1 read the file; two improved it and the
third, written to answer the panel's own fix, **contradicted its own section's
caption** ("all four widths are converted" vs "three of the four bands
convert"). A fix written against a panel note is authored in isolation from the
rest of the section, so check the edited field against its OWN neighbours
before checking it against the dossier.

**6. Read the panel report for what it RATIFIED, not only for what it flagged.**
The panel-diff check above looks at the items the panel raised. The second
fresh issue (half-indias-arrivals, travel, 2026-09-22) inverted it: all four of
panel 1's findings were properly resolved in the draft, panel 2 returned a
clean PASS with every quiz question answered — and the arithmetic persona had
*affirmatively endorsed* the one number that was wrong ("the ₹3.5 crore
promotion budget works out to 38 paise a tourist. Numbers check out"). A
persona reading for comprehension cannot re-derive a quotient that is presented
as already-derived; the fluent, confident retell is the danger sign, not the
reassurance. **How to apply:** grep the panel report for sentences where a
persona repeats a computed figure back approvingly, and recompute exactly
those. They are pre-filtered for you: the persona has already identified which
numbers the draft asks a reader to trust.

**7. On a fresh issue, the composition floors usually PASS and saying so is
part of the job.** Both fresh audits so far cleared every §5.1 floor including
the 2026-09-16 diversity rows — here 44% drawn graphics across four kinds,
three cards used once each, 78% visual, no adjacent text-only sections — and
`check:prose` raised neither FEW-GRAPHICS, CARD-HEAVY nor NO-NEW-KIND. **Trust
the gate on NO-NEW-KIND specifically**: it reads the ledger in
`docs/generated/PROJECT-GRAPH.md`, which you would otherwise have to reconstruct
by hand from ten issues, and its silence is a pass. Record the measured
percentages in the report anyway — the operator's brief that created those
floors was about issues that read as text, so the numbers are the answer to a
standing question, not boilerplate.

See [[claim-error-patterns]], [[cheap-checks-that-catch-most]],
[[restored-and-orphaned-claims]], [[flag-severity-calibration]].
