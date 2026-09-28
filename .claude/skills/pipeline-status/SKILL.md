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
<date>-<slug>-check.md            → the check pass ran (CLEAN / CORRECTIONS / BLOCKED)
<date>-<slug>-storyboard.md       → the composer ran (its Status: draft, approved or hold)
src/content/issues/<slug>/        → draft written
<date>-<slug>-panel.md            → first panel pass (beside it, .jev.md: the Jev quiz grade)
<date>-<slug>-panel-2.md          → second panel pass, after the stylist
<date>-<slug>-jevpass.md          → the Jev pre-pass ran, the verifier's first step
<date>-<slug>-verification.md     → verifier ran
status: published                 → live
```

Report a table: category · furthest phase reached · what it is waiting on ·
who owns the next step.

## The three human gates

All three are the operator's, each a status flip the next phase reads and,
for the last two, refuses to proceed without:

1. **Pick a candidate** — `status: open` → `status: chosen` in the candidates
   file. Read the file to see whether one is chosen.
2. **Approve the storyboard** — `Status: draft` → `approved` in the
   storyboard file. `GATES.storyboard` in `scripts/pipeline.config.ts`
   refuses the draft phase without it.
3. **Publish** — the issue's `status` field flips to `published`, after
   reading the verification report and the render-gate screenshots. Nothing
   publishes without this flip.

Reviewing the dossier and the draft are real steps too (research/AGENTS.md
§2, steps 4 and 9) but leave no file-state trace of their own; ask whether
they happened, do not assume.

## Before suggesting a run

**These scripts spend real money, on either door.** The root `.env.local`
exists, so `npm run pipeline:*` will actually execute and bill the key, and
every `/pipeline-<phase>` runs the same script on the subscription. Measured
at list on the trial issue of 2026-09-28: discover $0.77 · research $2.91 ·
check $1.83 and $2.39 (two passes) · storyboard $2.26 · draft $4.81 · panel
$0.19 and $0.17 · stylist $1.21 · verify $2.39. **The full issue was
$20.40**, $14.70 without the two check passes and the top-up.
`npm run pipeline:costs` has the current figures.

Never invoke one to test something. Recommend, state the cost, and let the
operator run it.

**Two doors, one pipeline (ruled 2026-09-28).** The API door is a terminal:
`npm run pipeline:<phase> <desk> -- <flags>` bills `ANTHROPIC_API_KEY`. The
Claude Code door is the slash command: `/pipeline-<phase> <desk> <flags>`
runs `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and
bills your Claude subscription. Same script, same agents, same
`scripts/pipeline.config.ts`: the door decides only which wallet pays, and
the ledger row's `billedTo` says which.
