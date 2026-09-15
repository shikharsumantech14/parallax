---
name: rewrite-runs
description: How a Phase 4 rewrite storyboard differs from a fresh one, and the log of storyboards the operator sent back
metadata:
  type: project
---

**A rewrite (REGISTER-PLAN §8.1) is a different job from a fresh storyboard.**
The inputs are three, not one: the published issue, its dossier, and its
verification report.

**How to apply**

1. Read the verification report as a *constraint list*, not background. Its
   "required fixes" are the cheapest wins available — most are resolved by
   cutting or restripping the section that carries them, not by patching prose.
   Say which fix each composition decision resolves; that is what earns the
   rewrite its approval.
2. §8 must carry a **published-section fate table** — carried verbatim /
   re-kinded / cut, one row each, with the reason. The operator reads this
   before the beats table. Say explicitly which `data` blocks port unchanged;
   the drafter otherwise re-authors them and the numbers drift.
3. **Sources, slug, `id`, `publishedAt`, `tags` never change.** No fact is new,
   so no source is new and the verifier's existing trace holds. Any arithmetic
   on a sourced figure (a currency conversion, a subtraction, a ratio) is a
   *computation*, not a fact: put it in §5 with its basis and its rate and make
   it an operator ruling.
4. `readTimeMinutes` drops to 4 (the §5.1 target) — easy to forget.
5. Carry forward any `# EDITOR:` flags in the MDX body verbatim unless the
   composition made them moot; deleting an operator's unresolved flag is not the
   composer's call.

**Header convention that reads well:** a blockquote after the front-matter block
stating REWRITE, the four measured defects the rewrite exists to fix, and the
verification verdict as a constraint. Both sibling storyboards
(`el-nino-new-floor`, `queue-is-the-product`, both 2026-09-13) do this; match it.

**Budget reality.** The ≤ 1,100-word ceiling and the ≤ 80-words-before-the-first-
graphic floor are both binding, and the head alone eats 60–79. Title 6–8 · dek
9–11 · hook 22–25 · primer 21–26, and row 1 gets an intro of ≤ 10 or none.
Ten rows at 90–120 words each lands around 1,050–1,090 — thin. Always name one
row in §8 as the designated slack (the `quote` row is the usual candidate) so
the drafter knows what pays when a row overruns.

**The ≤ 1,100 word total also counts every `eyebrow`, section `title`, `source`
label, `caption` and `plain`** (`readerWords` sweeps all of them). A budget built
from intros, notes and captions alone under-reads by about 15 words per section —
90 on a six-row spine. Add that line to the total explicitly; a variant offered
in §8 as "free headroom" can be over the ceiling once its new rows bring their
own eyebrow, title and source line.

**The words-before-the-first-graphic count includes row 1's eyebrow and title.**
The gate adds head + every section's eyebrow/title/intro and only stops *after*
the first visual section, so a head of 75 plus a two-word eyebrow and a
seven-word title is 84 and fails. Budget the head at ≤ 69 and say in the
storyboard that row 1 carries no `intro` — the delimitation storyboard reported
75 by counting the head alone, which is the wrong arithmetic even though that
issue happened to pass.

**A nine-row spine fits, and it is the shape a statute-dense issue wants.**
Head 69 + nine rows at 70–160 lands near 1,020–1,060 with the `source` labels
counted. The rows are not equal: the `timeline` (~150) and the card stack
(~150) carry twice what a `you-think` (~70) or a `three-steps` (~90) does, so
budget per kind rather than per row. Publish caps that sum ~40 words above the
composed sketches — the caps are ceilings and the drafter needs the slack more
than the ledger does.

**Check for a `story:` block before writing the beat-remap table.** Several
published issues have none (the 2026-05-02 politics issue does not), in which
case story mode derives from `KIND_PRIORITY`/`TRIM` and the rewrite can reorder
and re-kind freely. Say so in §8a in one line — it saves the operator looking
for a table that should not exist.

**`story.beats[].section` is a 0-BASED index into `sections[]`** (the schema
comment says so, and the published beats confirm it). Any rewrite that reorders
or re-kinds sections silently repoints every beat, and a beat can end up on a
section that no longer exists. Put an explicit old → new mapping table in §8 —
published index, what it pointed at, new index, new target, what happens to the
text — and say that the beat text needs its own register pass, because the
social voice is a separate contract. Beats must stay ascending.

**A section whose own caption says SCHEMATIC or whose source line says the values
are editorial is a CUT, not a re-kind.** There is no honest kind to move
invented `value`/`altKm` numbers into, and the honesty labels the original
drafter added are doing work a component should not need. Cut it, name where the
*beat* now lands (usually a `jargon-buster` gloss or a tile note), and say what
sourcing would unblock the kind itself so the operator sees a research job
rather than a composition failure. Two of the six 2026-06 issues carry one of
these; expect it.

**Two conflicts a rewrite will hit, and the way to settle them**

- **An old verification approving something the new contract forbids.** The
  2026-06-04 reports predate `_voice-core.md` v2, so a report can *approve* a
  SATIRICAL EXPOSURE beat on the politics desk, which the contract now sets to
  zero. The contract is newer and Rule 0 says the register outranks the mode:
  cut the section, and say in §8 that the two documents disagree and which one
  you followed. Do not leave the operator to find it.
- **A number that is weak by authorship, not by sourcing.** Interpolated
  mid-points in a series, an illustrative value a verifier flagged as "not
  sourced as hard data" — a researcher pass returns empty-handed on these
  because no source exists. The fix is deletion plus a weakened claim, and the
  weakened claim usually needs its own operator ruling because it changes what
  the published title asserted. Reserve a re-anchoring recommendation for the
  Arsenal condition: a source that was off-allowlist when the dossier was
  written, or a figure the cited source contradicts.
- **An old verification's VOICE findings can be looser than the contract, not
  just stricter.** The 2026-05/06 reports mark things ✅ ACCEPTABLE "per
  benchmark issue" — and the benchmark was the pre-register corpus the plan has
  since ruled is not a voice reference. Say the split explicitly in §8: the
  report's *factual* findings are followed to the letter, its *voice* findings
  followed where stricter and superseded where looser, and nothing factual is
  overridden. That sentence is what stops an operator reading a cut as the
  composer disagreeing with the verifier.

**A published issue can assert beyond its sources in a way a claim-by-claim
verification cannot catch, and hunting for it is part of the job.** The
verifier traces each row; an error that lives in the *count* or the *verb*
across rows survives. Two classes found so far, both on the transgender-ratchet
rewrite:

- **A tally nobody checked.** The primer said "Parliament has passed three laws
  all called 'Protection'" where the record shows two enacted statutes plus a
  Bill that was never passed. No single verification row is about the number
  three, so it passed clean. Check every "three X", "every Y", "all Z" in the
  head against the dossier's own timeline.
- **A verb that names an effect the sources never measured.** "Erases",
  "failed", "overruled", "from legal existence" — each is a consequence or a
  legal conclusion sitting where a description belongs, and on a legal story
  the worst of them assert the answer to a question that is literally still
  before a court. List them in a dedicated §8 subsection with the sourced form
  beside each, and say which composition decision retires each one. On
  sensitive material this subsection is the part of the storyboard that earns
  its approval.

**`NUMBER-DRIFT` is ❌ BLOCKING on a published rewrite, ℹ only on a draft**
(`check-prose.mjs`, the last block: it diffs every numeral against
`git show HEAD:` and picks the severity off `status`). Every rewrite cuts
sections, so every rewrite fires it. **Put a number ledger in §8** — removed,
with the one-line reason each; added, with the ruling that allows it; and a
short "these survive only if the drafter keeps this exact clause" list, because
the obvious paraphrase silently drops a numeral ("up to half" loses the `50`
that "more than 50%" keeps). It turns a blocking flag into a tick-list the
operator clears in a minute. Also remember `readTimeMinutes` 7 → 4 is itself a
drift entry.

**Three gate behaviours that shape the copy, not just the count**
(`check-prose.mjs` — worth re-reading it each run rather than trusting this):

- **`NUMBER-DENSE` fires at 3 numerals in one sentence**, and it scores only the
  *body* keys (`note`, `text`, `detail`, `lead`, `paragraphs`, `followup`,
  `statement`, `kicker`, `headline`). `label`, `sublabel`, `caption`, `plain`,
  `source` and `annotations[].text` are **not** sentence-scored — so a figure
  that will not fit a timeline note can often sit in that event's `label`.
- **`NO-RESTATEMENT` and `NO-ANALOGY` fire on every `prose` section** unless it
  contains a literal marker from two hard-coded word lists ("that means / which
  means / the point is / for context / in other words…" and "think of / like a /
  imagine / the way a / is like…"). Name the requirement in the beats table; a
  drafter writing good plain prose still fails it by accident.
- **`STACCATO` fires on three consecutive sentences under eight words**, and the
  hook is scored as body prose. Build the hook's sentence lengths deliberately
  (7 / 8 / 6 passes) and say in the storyboard that the middle sentence must not
  be shortened.

**Audit the published sections for editorial values BEFORE promising the
rewrite is clean.** Two of the six 2026-06 issues carry one; the other four do
not, and saying so explicitly is worth a line in the header blockquote. On an
issue with none, the exposure inverts: the *new* graphics are where an invented
number would enter, so the drawing rule (see [[dossier-data-gaps]], "a range is
not a value") becomes the ruling the operator actually has to sign.

## Sent back by the operator

*(nothing yet — log each returned storyboard here with the reason, so the same
call is not made twice)*

See [[kind-fit-by-argument-shape]] and [[dossier-data-gaps]].
