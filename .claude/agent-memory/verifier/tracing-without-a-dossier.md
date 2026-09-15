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

**It fails in BOTH directions, and the second one bit on kessler-cascade
(2026-09-15).** Somebody had built since the draft landed, so the HTML was the
**pre-stylist draft** — newer than the published file, older than the file on
disk. Test for that too (grep a phrase the *stylist* introduced), because a build
that is neither the published version nor the current one is the worst of the
three: it looks authoritative and it is a third generation nobody asked about.
When it happens there is **no route to the published record without git**. Say so
in the report's first section rather than bluffing a diff — then trace against
the storyboard's transcription of the published rows (a Phase-6 storyboard carries
§2/§5/§6/§8a tables of the published values precisely so this is possible) and
hand the real numeral diff to `check:prose`, which can read the committed version.

**A stale-or-not build is still worth opening for a different job:** it proves
which authored fields actually reach a reader. Grep it for each `caption`, each
annotation `text`, `px-section__claim` and `Source ·`. That check does not care
which generation the build is, and it is the one that has silently failed before.

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
