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

## Sent back by the operator

*(nothing yet — log each returned storyboard here with the reason, so the same
call is not made twice)*

See [[kind-fit-by-argument-shape]] and [[dossier-data-gaps]].
