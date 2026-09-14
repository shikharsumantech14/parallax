---
name: cheap-checks-that-catch-most
description: The four verifier checks with the best findings-per-minute, and the two that reliably find nothing
metadata:
  type: project
---

Measured across runs. Do these first; they find real defects in minutes.

1. **Arithmetic on the draft's own rendered data.** The strongest findings come
   from testing a prose sentence against the numbers in the same file, not
   against the dossier. Examples caught: a primer claiming "every year starts
   hotter than the one before" while the section below it showed 2025 (1.44) <
   2024 (1.55); a worked example ("the El Niño of 1998… the record shows up the
   year after") that predicted a year the issue's own series shows as a trough.
   The dossier cannot catch these — only the draft can contradict itself.
2. **Same number, two places.** Grep every figure that appears more than once.
   A value in a chart array and a different value for the same year in a
   timeline note (2016 as 1.29 vs "about 1.25°C") is invisible section by
   section and obvious in a list.
3. **Hedge-strength drift.** Sources say "high confidence in the onset",
   "~30%", "effectively tied", "more than 91%". Drafts compress to "confirmed",
   "30%", "second-warmest", "91%". Diff the qualifier, not just the number —
   this is the single most common ⚠️ class and it recurs across issues.
4. **Story `beats` against the sections they index.** Beats get written last,
   drift from the sections, and no other gate reads them. Check the `section:`
   index actually resolves to the section the beat describes, and that the beat
   has not sharpened a hedge the section kept.

**Reliably empty, so do them last:** the advocacy/wire-tone sweep (the drafter
under the v2 contract does not produce these any more), and the quotability
gate on issues whose `quote` section was cut — no verbatim quote means no
copyright exposure to assess, so say so in one line and move on.

**Do not flag as defects:** `status: published` on a Phase-4 in-place rewrite
(operator-ruled); Hindi in a `jargon-buster.hindi` slot (a purpose-built field,
not the precision layer); a caption carried over verbatim when the approved
storyboard sanctioned the carryover — downgrade that to an optional note.

See [[inherited-data-blindspot]], [[flag-severity-calibration]].
