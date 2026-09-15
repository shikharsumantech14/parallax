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
5. **Outlet names in the `source` string vs the `publisher` of every cited
   `sourceRefs` id.** A pure set comparison, two minutes for a whole issue, and
   on the cockroach rewrite it caught **three of nine sections**: two read "The
   Wire and ThePrint" while citing only Wire ids, one read "The Wire · Delhi
   High Court record" while citing a ThePrint/PTI id. Nothing else in the
   pipeline reads both fields together, so this class survives every prior pass.
   It is the mechanical version of claim-error pattern 3 — do it as a list, not
   section by section.
6. **The head arithmetic, by hand.** `words-before-first-graphic` = head (title +
   dek + hook + primer) + section 1's eyebrow and title, and *only* those,
   because section 1 is visual. A primer that overruns its storyboard cap by
   five words eats the entire margin on the 80-word floor, and nothing else
   shows it. On the cockroach rewrite this landed on exactly 80 of 80. Quote the
   arithmetic in the report and hand the ruling to `check:prose`, which is the
   authority — but you are the one who notices.
7. **Count the fields with a hard cap, with the gate's own tokeniser.** Same
   yield as 6 and the same reason: a storyboard budget is advisory, a
   `check-prose` cap is not, and the two are different numbers. `words()` is
   `[\p{L}\p{N}₹$][\p{L}\p{N}’'.,%₹$°-]*`, so `$0.25` and `cheaper-AI` are ONE
   token each — count that way or you will be off by two and miss it. The tight
   ones are the plain-language kinds' (`jargon-buster.meaning` 25,
   `three-steps` step text 25, `you-think`/`number-sense` note 20,
   `equals.text` 14, annotations 12) and `paragraphWords` 90, which fires on
   `>`, so exactly 90 passes with zero margin and is worth saying out loud.
8. **Section `source.date` against the section's own latest event or `sourceRefs`
   publication dates.** Two minutes, a whole issue, and it caught a timeline
   dated "19 and 27 May 2026" whose last event is 2 June and whose refs include
   a 3 June post. The sibling of check 5 (outlet names) — do the dates as a
   list too, and note that a *correct* section in the same file (a "20 April to
   3 June" range) is the tell that the wrong one is an oversight, not a
   convention.

7. **The scope header on a tile row is a claim — check it against its own tiles.**
   A `data-readout` `caption` is usually a date range or a scope label, not a
   finding, so CAPTION-FORM does not fire and nobody reads it as traceable. On
   kessler-cascade "Sharing low orbit · 2024 to 2026" sat over six tiles, two of
   which were dated *since 1998* and *2023*. Ten seconds: read the header's window,
   then read every tile's date. The storyboard had even asked for the header to be
   "retimed to the tiles that remain" and the drafter kept the published string.
8. **Diff the draft's own editor-notes block against the draft.** The stylist writes
   its "Left for the operator, not fixed" paragraph *before* the operator acts, so on
   any issue where the operator then acts it is stale **by construction** — here it
   named a label and a `sourceRefs` gap that the file had already closed. It costs
   one grep, it ships inside the committed MDX, and it is the thing the next reader
   will act on.

**Reliably empty, so do them last:** the advocacy/wire-tone sweep (the drafter
under the v2 contract does not produce these any more), and the quotability
gate on issues whose `quote` section was cut — no verbatim quote means no
copyright exposure to assess, so say so in one line and move on.

**Do not flag as defects:** `status: published` on a Phase-4 in-place rewrite
(operator-ruled); Hindi in a `jargon-buster.hindi` slot (a purpose-built field,
not the precision layer); a caption carried over verbatim when the approved
storyboard sanctioned the carryover — downgrade that to an optional note.

See [[inherited-data-blindspot]], [[flag-severity-calibration]].
