---
name: rewrite-audits
description: How a Phase-4 register rewrite differs from a fresh-draft audit — what to load, what the schema check means, and which checks actually catch things
metadata:
  type: project
---

A Phase-4 rewrite (REGISTER-PLAN §8.1) replaces a published issue in place. It
is NOT a fresh draft and auditing it as one produces a wrong verdict.

**Why:** the storyboard carries operator rulings that override my default
checklist, and the prior verification report is the list of things the rewrite
was commissioned to fix. Both are inputs, not context.

**How to apply:**

- **`status: draft` is FALSE and correct** on a rewrite. The storyboard's
  ruling section will say "write in place, keep `id`/`publishedAt`/`status`".
  Mark the row `✅ by ruling` and say explicitly "flagged only so it is not
  'fixed'" — otherwise the next pass reverts it.
- **Read the prior verification report and confirm each required fix
  individually, in its own table.** This is the single highest-yield section of
  the report: it is what the operator actually wants to know, and it is cheap
  (each fix is a grep).
- **The storyboard's rulings can waive a contract rule.** The queue rewrite's
  hook trips the "never Hindi in two consecutive sentences" rule and is
  nonetheless correct — it is the signed worked example in `_voice-core.md` §9.
  Record waived items as *noted, not a defect*, with the ruling cited. A flag
  with no waiver note gets "fixed" by someone later.
- **Word-budget drift from the storyboard is usually fine.** The storyboard's
  per-row caps are tighter than the contract's (`intro ≤ 25` vs `≤ 45`). Drift
  inside the contract is ⚠️ STORYBOARD-DRIFT at low severity, not a fix.

**What actually caught things, per run:**

| Check | Yield |
|---|---|
| Comparing a compressed claim against the dossier's *full* wording | highest — compression silently drops qualifiers ("Yoshida Trail", "in Nepal") |
| Reading each section's `source` line against which `sources[]` entry really backs each row | high — a row and its section source line drift apart easily |
| Confirming prior-report fixes | high, cheap |
| Schema bounds / component runtime guards | low on a rewrite (the drafter copies verified data), but free |
| Em-dash / staccato / title-formula tells | low — the v2 contract has largely trained these out |
