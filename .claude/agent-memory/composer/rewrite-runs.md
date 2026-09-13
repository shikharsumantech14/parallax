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

## Sent back by the operator

*(nothing yet — log each returned storyboard here with the reason, so the same
call is not made twice)*

See [[kind-fit-by-argument-shape]] and [[dossier-data-gaps]].
