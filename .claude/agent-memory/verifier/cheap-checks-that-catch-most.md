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
   year after") that predicted a year the issue's own series shows as a trough;
   **a per-head figure out by a factor of ten** ("₹3.5 crore… divide it by 9.15
   million foreign tourists, which means about 38 paise each" — it is ₹3.83),
   which is this check's purest case because both operands and the quotient sit
   in one sentence. The dossier cannot catch these — only the draft can
   contradict itself. **Do the sum by hand.** The sandbox rejects `node -e` and
   any chained `cd … && …`, and a rejected compound call also cancels whatever
   was batched with it; a division you can do in your head costs less than
   arguing with the tool.
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

9. **The ref that must NOT be there.** Where an attribution has been deliberately
   *downgraded* ("as reported by X" instead of the primary), check that the
   stronger source is **absent** from that section's `sourceRefs`, and say so as a
   finding. On transgender-ratchet the minister's English was re-attributed to a
   newspaper because the House record says something else at the key word, and the
   T0 House record was cited on two neighbouring sections and correctly **not** on
   the quote. Citing it there would have re-asserted, through the source line, the
   exact authority the operator had just ruled out — and it would have passed every
   trace check, because the id resolves and the section is about that debate.
   **How to apply:** whenever a ruling weakens a claim's provenance, grep the id of
   the source that ruling set aside and confirm it appears nowhere on that section.
   This is the only check that reads an absence as the finding, and it is the one
   worth leading the report with on a sensitive issue.

10. **Cap-margin arithmetic: a panel that says "one word of slack" has counted a
    different budget than the one the fix spends.** Panel 2 ranked a title rewrite
    third and costed it at "the one word of head slack". True of the 80-word
    words-before-first-graphic floor (79 of 80). False of the field the fix
    touches: `titleWords` is 8 and the title was **8 of 8**, so any added word
    trips FIELD-OVER-CAP. `dekWords` 14 sat at 14 too.
    **How to apply:** for every fix a panel recommends, name the cap the fix
    actually spends from, not the one the panel cited, and say whether it must be
    a substitution or can be an addition. Three head fields at or one under their
    caps is the normal state of a composed issue, so this recurs.

11. **Build a "which id carries which shape" table ONCE, then read the draft
    against it.** The single highest-yield check on the ISS issue, and it is
    mechanical. Before opening the draft, go through the dossier's §4 and write
    one line per source id naming the *distinctive* figures only that id carries
    — here `src-09` (Spaceflight Now) was the sole carrier of 330 km, 220 km,
    the ~18-month build, the 1 May 2029 delivery AND the >30,000 kg mass. Then
    grep the draft for each figure and check the id is on that section. It found
    src-09 missing from three of the four sections that use its numbers, plus a
    source orphaned onto a section that uses none of it. This is checks 5 and 8
    (outlets, dates) generalised to the third axis — **content** — and it is the
    one that catches the storyboard-swap residue (claim-error pattern 12).

12. **Every `# EDITOR:` block is itself a claim, and nobody else traces it.**
    It names a document, a section, a number or a status, it ships inside the
    committed MDX, and it is the instruction the operator will actually follow
    at publish time. On the ISS issue it named the wrong document for the three
    [UNVERIFIED] figures. Trace the document it names exactly as you would trace
    a figure — does that source contain those values, per the dossier. Costs one
    minute. Related to check 8 (the stale stylist notes block): both are prose
    *about* the draft that no gate reads.

13. **State the cap margins at the TOP of the required-fixes list, once.** On a
    composed issue the head fields sit at or one under their caps by
    construction (see check 10), so most fixes must be substitutions. Doing this
    once as a margin note beats repeating "watch the word count" on each fix,
    and it stops the editor from writing a good fix that trips
    `words-before-first-graphic`. Quote the two numbers that bind: words before
    the first graphic, and total reader words.

14. **Does it BUILD? Grep each kind's component for `throw new Error` and check
    the authored data against every guard.** `data: z.any()` in `config.ts` means
    Zod validates nothing inside a section's payload, so the only type contract
    is the component's own constructor. On open-models this turned a "needs
    revision" into a "does not build": `NumberSense` requires `value` as a
    **string** and the draft authored `value: 4795`. Several kinds hard-throw by
    design (`city-grid` 1–3 cities × 36 bins, `season-wheel` exactly 12 months,
    `altitude-oxygen` 2–8 stops, `fare-terrain` 1–5 routes, `number-sense` 1–3
    `equals`). Five minutes for a whole issue, and the operator must hear it
    first — no other gate in the pipeline runs a build.

15. **Read every promissory phrase in an `intro` or `plain` as an assertion
    about the render.** "below", "each column", "the colour shows", "labelled",
    "oldest at the top" — then go find the markup that satisfies it. This is the
    check that caught the worst defect on open-models (an intro naming three labs
    the component never draws) and it is the one an independent reader panel
    tends to find *first*, phrased as a comprehension complaint. When a panel
    says "the intro promises X the section never delivers", treat it as this
    flag and go to the `.astro`. See [[data-shape-honesty]].

**Reliably empty, so do them last:** the advocacy/wire-tone sweep (the drafter
under the v2 contract does not produce these any more), and the quotability
gate on issues whose `quote` section was cut — no verbatim quote means no
copyright exposure to assess, so say so in one line and move on.

**Also reliably clean, and worth one line rather than a paragraph:** every
verbatim quote on an Indian politics issue traces to The Print or The Wire, both
**T4 · open · `ingest: live`**, which per `_TAXONOMY.md` §1 means no corpus chunk
exists, the RAG trace is moot and the quotation is from a legally accessed
original by construction. Check the `ingest:` value once, state the conclusion,
move on — and note that the RAG tool has not been available in recent sessions,
which the agent definition already provides for.

**Do not flag as defects:** `status: published` on a Phase-4 in-place rewrite
(operator-ruled); Hindi in a `jargon-buster.hindi` slot (a purpose-built field,
not the precision layer); a caption carried over verbatim when the approved
storyboard sanctioned the carryover — downgrade that to an optional note.

See [[inherited-data-blindspot]], [[flag-severity-calibration]].
