---
name: word-budget-accounting
description: The 1,100-word ceiling and the 80-words-before-first-graphic floor are measured far more broadly than a storyboard's per-row budget table — budget ~90 words of headroom
metadata:
  type: project
---

A storyboard's per-row word budgets undercount what `scripts/check-prose.mjs`
actually measures. Budget for the gate, not the table.

**Why:** the gate's `readerWords` collects head fields *plus*, per section,
`eyebrow`, `title`, `intro`, `plain`, `howToRead`, `caption`, `skimCaption`,
`source`, **and every string inside `data`** that is not in its `SKIP_KEYS`
set. A storyboard table typically lists only intro / data notes / caption /
source, so a plan that reads "1,089 of 1,100" measures ~1,190 once ten
eyebrows and ten section titles are added. The Arsenal rewrite (2026-09-13)
needed roughly 100 words cut from the approved plan to land at ~1,087.

**How to apply:**
- Add ~10 words per section for `eyebrow` + `title` on top of the storyboard's
  row budget before you start writing. If the plan is already at the ceiling,
  the slack has to come from somewhere — say where in the summary.
- `SKIP_KEYS` means `value`, `unit`, `at`, `side`, `role`, `emphasis`, `date`,
  `x`, `y` cost nothing. That is why a `tactics-pitch` of eleven players is
  almost free and a `data-readout` tile's `value`/`unit` are free.
- But `outcome` is **not** skipped: a 20-shot `shot-map` spends 20 reader
  words on `"goal"`/`"saved"`/`"miss"` strings alone. Same for `name`,
  `badge`, `score`, `outcome`, `competition`, `formation`, `team`.
- **Words before the first graphic includes section 1's `eyebrow` and
  `title`**, not just its intro (the loop adds them, then breaks on the first
  non-text-only kind). A 70-word head leaves ~10 words for all of section 1's
  chrome, which is one eyebrow and one title and nothing else. The practical
  move is to omit section 1's `intro` — the opening kinds (`you-think`,
  `data-readout`) carry their own labels and caption, so nothing is lost.
- **A grid kind can cost more than its whole storyboard row.** A storyboard
  budgets `power-matrix` as "5 institutions + 4 party labels + caption + plain";
  the gate also counts every `cells[].institution` repeat (see
  [[component-data-shape-traps]]), which on a full 5×4 grid is ~100 words — most
  of a row's budget again. Check any kind whose data repeats a label to address a
  cell before you trust the plan's total.
- **A `source` written as `{ label, date }` costs only the label.** The gate
  reads `s.source.label` and ignores the date, so every dateline, every "2–3
  June 2026" and every accessed-on is free the moment it moves out of the
  string form. On a nine-section issue that is 30–50 words back for no loss of
  information, and it also keeps an en dash out of a counted string.
- **Three cheap ways to come in under a storyboard's own row budget**, each
  worth 5–20 words and none of them a loss to the reader: omit `you-think`'s
  two panel labels (the defaults "What most people think" / "What the data
  shows" are usually right, and an authored label is not free); drop the `note`
  on the one or two timeline events that carry an `annotation`, since the
  callout IS that node's note; and let the hero's `plain` carry the reading
  rather than authoring a `howToRead` on a kind outside `NEEDS_HOW`, which
  saves a whole block as well as the words. The Kessler rewrite landed at ~938
  against a plan of ~1,043 on those three alone.
- **A three-voice `quote` row is the single most under-budgeted row a
  storyboard writes.** Its verbatim words are unpayable by rule, and the plan
  usually budgets intro + quote + attribution + the followup's framing while the
  gate also bills the eyebrow, the section title, the `source` label and every
  framing word needed to introduce a second and third speaker *with their roles*
  (rule 9). On the transgender rewrite a row budgeted at 115 landed at ~136 and
  could not honestly go lower. Budget a three-voice quote at **row + 20**, and
  take the overage out of a visual row's notes, never out of a quotation.
- **An attribution fix costs names as well as words.** When a quotation has to
  be attributed to the outlet that reported it rather than to the speaker, the
  outlet's name enters `attribution` — which is in `PRECISION_FIELDS` and is
  therefore *not* name-scanned by the gate, but still counts against the
  contract's twelve. Keep the outlet out of the `followup` (a body key) and let
  the section `intro` say once that all the lines come from press reports: one
  sentence buys the honesty for every quote in the section and spends one name
  instead of three.
- A `skimCaption` on all ten sections costs ~200 words, which no issue at the
  ceiling can afford. It only *renders* for `prose` in skim mode (other kinds
  keep their graphic), so author it on the prose section, and on one or two
  others only if the budget has room. Story mode is covered by the authored
  `story:` block, which the gate does not count at all.

- **Name the swing row before you write, not after.** On an eight-section
  issue every row will drift 10–20 words from its budget in one direction or
  the other, and the honest way to hold the total is to pick one row whose
  content can genuinely run short — usually a `timeline`, because its `date`s
  are free and its notes are capped at 20 words each anyway — and treat its
  underrun as the issue's float. On the open-models draft (2026-09-21) the
  timeline came in ~36 words under its 150 and paid for `version-graph`'s node
  `id`/`parents`/`tag` strings (~17 over) and the prose row (~10 over), leaving
  the issue at ~1,010 of 1,100. Report which row lent and which row borrowed;
  that is a departure from the storyboard's table even when the total holds.
- **A graphic whose `value` is a DERIVED number needs its inputs somewhere,
  and the cheapest honest slot is a per-item `sublabel`.** Drawing the *gap*
  between two scores rather than the two scores is a strong form, but a bar
  labelled "58" with no inputs is unverifiable to the reader. Four `sublabel`s
  of "Open 26% · closed 84%" cost ~20 billed words and save the caption from
  having to list eight numbers, which would trip NUMBER-DENSE anyway.

- **A storyboard's per-row budget can be internally consistent and still ~7%
  light, and it is always the never-published kinds that overrun.** On the
  Indonesia peat draft (2026-09-21) the storyboard budgeted 1,072 of 1,100.
  Authored literally, the first pass measured ~1,171. The overrun sat almost
  entirely in the three new kinds — `core-sample` (+17 over its 145, because
  `layers[].depth` strings are billed), `power-flow` (+19 over its 150, because
  five node labels plus four link notes are billed) and `timeline` (+13, six
  labels plus five notes) — while the cards and the chart came in close to
  plan. **Budget a never-published kind 15–20% above the storyboard's figure
  before writing, then trim the prose fields, not the data.** A second pass
  that shortened captions, intros and step text by 2–6 words each recovered
  ~85 words and landed the issue at ~1,086.
- **Where to find those 80 words, in order of least damage:** a `legend.none`
  string (~3), the note on a timeline event whose label already says it
  (~5–10), an adjectival clause in a caption that the graphic itself shows
  (~3 per caption, across five captions), a source label compressed from a
  sentence to a list ("Kiely et al. 2019, Mongabay, WRI"), and the closing
  prose paragraph's last sentence — a mirrored close is an AI tell anyway, so
  cutting it fixes two things at once (~8).

- **`margin-bullets` has an irreducible floor of ~190 reader words, so never
  accept a storyboard budget under 200 for it.** On the parliament-scrutiny
  draft (2026-09-21) the storyboard budgeted 175 and the honest minimum came
  to ~198. The cost is structural, not padding: four `label`s that must each
  carry or imply their own unit (~24), four `note`s (~40), a mandatory
  authored `plain` because the kind's EXPLAIN default is space-desk copy
  (~27), a mandatory instrument `howToRead` (~27), an intro carrying the
  mark-sheet analogy (~30), a caption (~13), and a source line that has to
  show the derivation arithmetic for any derived `required` (~20). Only `unit`
  and `value` are free. **Take the overrun out of the narrative kinds**
  (`quote`, `three-steps`) and the prose rows, which under-run easily.
- **Adding a `so` / `because` to satisfy NO-CONNECTIVE costs 4–8 words each,
  and the primer is the one worth paying for.** NO-CONNECTIVE is ℹ-level, so
  three flagged 25-word section intros are not a defect worth 20 words; the
  primer is a real paragraph the reader reads first and is worth the spend.
  Rewriting the primer's second sentence to open with "You" rather than "The
  laws you live under were…" recovered the same words the connective cost.
- **Clearing four JARGON-UNGLOSSED flags cost +15 words and pushed the issue
  from 1,081 to 1,096 of 1,100 — budget for the gloss repairs, not just the
  draft.** Each `which is` / `which means` insertion is 2 words, and words
  added to the *head* are billed twice: once to the 1,100 ceiling and once to
  the 80-words-before-the-first-graphic count. A head edit is the most
  expensive word in the issue.

Related: [[component-data-shape-traps]], [[check-prose-heuristics]].
