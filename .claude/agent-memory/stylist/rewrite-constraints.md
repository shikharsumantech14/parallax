---
name: rewrite-constraints
description: Phrasing constraints that bite on a Phase-4 rewrite of an already-published issue — numerals, word budget, which panel fixes reach the stylist
metadata:
  type: feedback
---

On a Phase-4 rewrite (an issue that is already `status: published`), a
rewritten sentence must not add or drop a single numeral *occurrence* —
including a year the sentence only mentions in passing.

**Why:** `check:prose` diffs the numeral multiset against `git show HEAD` and
raises NUMBER-DRIFT at ❌ (blocking) severity when the issue is published, at
ℹ when it is a draft. A perfectly faithful restatement that says "2025" one
extra time fails the gate exactly like a wrong figure does.

**How to apply:** when rephrasing, count the numerals in the old string and
make the new string carry the same ones, the same number of times. If the
clearest phrasing needs an extra year, find the words elsewhere instead — or
leave the field and flag it.

Two more that keep biting:

- **Arrive with the word budget already spent.** Rewrites land on issues
  sitting a handful of words under the 1,100 cap and exactly at the 80-word
  before-the-first-graphic floor, so the head and the first section's title are
  frozen and every rewrite has to be word-neutral or shorter. Measure the field
  before writing the replacement, not after.
- **The reader panel's fixes are not all applied before the stylist runs.**
  The mechanical ones (a label's direction, a baseline in a note, a title
  matching its tiles) usually are; the *seam* ones — the missing restatement
  after the hero, an intro whose chart word does not match the form, a
  housekeeping intro — usually are not, because they are wording, which is the
  stylist's job. Read the panel's "what would fix it" list as a worklist and
  check each item against the current file rather than assuming.

See [[job-fit-by-kind]], [[hindi-rulings]].
