---
name: pipeline-status
description: Show where each of the six Parallax categories stands in the editorial pipeline — candidates, dossiers, drafts, verification reports and published issues. Use when planning editorial work, picking what to run next, or checking what a category is waiting on.
allowed-tools: Bash(git *), Bash(node scripts/*), Bash(ls *), Read, Glob, Grep
---

# Editorial pipeline status

## Working files per category
!`ls -1 research/politics research/space research/earth research/tech research/travel research/sports 2>/dev/null`

## Issues
!`node scripts/project-graph.mjs --brief`

## Your task

Reconstruct where each of the six categories stands. The pipeline is
**file-based by design** — each phase writes an artifact the next reads — so
the filenames in `research/<category>/` *are* the state:

```
<date>-candidates.md              → discovery ran
<date>-<slug>-dossier.md          → research ran
src/content/issues/<slug>/        → draft written
<date>-<slug>-verification.md     → verifier ran
status: published                 → live
```

Report a table: category · furthest phase reached · what it is waiting on ·
who owns the next step.

## The two human gates

Both are the operator's, and neither can be inferred from a file:

1. **Pick a candidate** — `status: open` → `status: chosen` in the candidates
   file. Read the file to see whether one is chosen.
2. **Review the dossier** — check `[UNVERIFIED]` items before drafting. Nothing
   records that this happened; **ask, do not assume.**

## Before suggesting a run

**These scripts spend real money.** The root `.env.local` exists, so
`npm run pipeline:*` will actually execute and bill: discover ~$0.30–0.80 ·
research ~$0.80–2.00 · draft ~$3–7.50 · stylist ~$1.50–2.50 · verify
~$0.40–1.00. **A full pipeline is $6–14 per issue.**

Never invoke one to test something. Recommend, state the cost, and let the
operator run it.

Note the two routes differ on purpose: the Claude Code route pins **every**
phase to Opus; `scripts/pipeline.config.ts`'s Sonnet/Opus split is the API-CLI
config and must not be "fixed" to match.
