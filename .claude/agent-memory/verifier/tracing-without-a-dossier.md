---
name: tracing-without-a-dossier
description: How to recover the factual record for a Phase-4 rewrite when there is no dossier and Bash/git is unavailable — the build output is the pre-rewrite published render
metadata:
  type: project
---

Phase-4 rewrites (`docs/REGISTER-PLAN.md`) replace a published issue in place
and have **no dossier**. The trace target is the published version. The obvious
route — `git show HEAD:src/content/issues/<slug>/index.mdx` — fails whenever
Bash is disabled for the session, which has happened.

**Fallback that worked (delimitation, 2026-09-14):**
`.vercel/output/static/issues/<slug>/index.html` is the last *build*, so on an
uncommitted rewrite it still holds the **published** render. Confirm it is stale
before trusting it — grep for a phrase the rewrite removed (old title, a cut
section). Then extract text nodes with Grep in `-o` mode on `[^<>]{20,400}`,
paging with `offset`/`head_limit`.

**Why:** the rendered HTML carries everything a dossier §3–§6 would: section
intros, timeline labels and notes, both verbatim quotes, the source list with
URLs. It is a *better* verbatim target than the MDX for quote comparison,
because it is what the reader actually saw.

**How to apply:**
- Short data values (state names, seat counts, dates) fall under a 20-char
  minimum and will be missed. Recover them from encoded geometry instead —
  `SeatChart`'s `bar-fill` widths are `change / maxChange`, so 100% / 90.909% /
  72.727% / 18.182% decode to +11 / +10 / −8 / −2 against a max of 11. Cross-check
  against the storyboard's own carried-over list.
- Grep a narrower pattern (`tl__date">1971.{0,300}`) to pull a specific row with
  its siblings when the paging approach skips it.
- Long runs of repeated markup (the vote chamber emits ~530 `vb__mp` spans) eat
  hundreds of result slots — jump `offset` past them rather than paging through.

Related: [[rewrite-audit-checks-that-pay]]
