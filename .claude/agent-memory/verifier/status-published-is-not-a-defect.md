---
name: status-published-is-not-a-defect
description: The schema check "status: draft" is waived for Phase-4 in-place rewrites — do not report it as a failure
metadata:
  type: project
---

The verifier's schema table asks for `status: draft`. **A Phase-4 rewrite keeps
`status: published`** and it is correct.

**Why:** the rewrite replaces a live issue in place, keeping the `id`,
`publishedAt`, `topic`, `tags` and all `sources[]` so the URL does not move and
the trace still holds (storyboard §9.7 / REGISTER-PLAN §8.1). Flipping it to
draft would unpublish a live page and drop its `/s/` story route, which builds
only for `status !== 'draft'`.

**How to apply:** mark the row ✅ with the waiver named, and note that §9.7 still
requires the operator to read the rewrite before it is committed — that, not the
status flag, is the gate. Reporting it as ❌ would push the verdict toward
BLOCKED for a rule that does not apply.

Related: [[rewrite-audit-checks-that-pay]]
