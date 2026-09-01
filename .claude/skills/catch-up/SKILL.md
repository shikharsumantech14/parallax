---
name: catch-up
description: Orient at the start of a Parallax session — live repo state, gate status, where the revamp stands, and what to do next. Use when resuming work, when the user asks "where are we" or "what's the status", or before starting any task whose scope is not already clear.
allowed-tools: Bash(git *), Bash(node scripts/*), Bash(npm run *), Read, Glob, Grep
---

# Catch up

## Live state
!`node scripts/project-graph.mjs --brief`

## Recent history
!`git log --oneline -12`

## Uncommitted
!`git status --short`

## Your task

1. **Read `docs/STATE-OF-PLAY.md`** — the only current entry point. Anything in
   `docs/archive/` is frozen history: never treat it as current, never cite it
   as if it were.

2. **Reconcile.** The block above is *measured*; the doc is *written*. Where
   they disagree, **the measurement wins** — say so plainly and offer
   `/update-state`. Do not quietly average them.

3. **Report, briefly and in this order:**
   - where the revamp stands — phase, wave, library count
   - what is uncommitted or unpushed
   - which gates pass
   - the next 2–3 candidate actions from STATE-OF-PLAY §5, ranked *as that
     document ranks them*, not as you would

4. **Stop.** Do not start work until the operator picks. Orientation is the
   whole job.

## What to remember while working

- **Decisions are locked and cited**: RD-01…RD-09 (`docs/REVAMP-PLAN.md` §1),
  TD-01…TD-06 (`docs/design/TOKEN-RECORD.md`), CD-01…CD-12
  (`docs/CONTEXT-PLAN.md` §3). **Do not re-litigate a cited decision.** If you
  think one is wrong, say so once, then continue.
- For *why* something was done — a decision's back-story, an abandoned
  approach — read `docs/PROJECT.md` before guessing, and search past session
  transcripts if the tooling offers it (CD-12).
- **`git push` and destructive git are blocked by a hook**, not by politeness.
  Claude commits; the operator pushes.
- The three fact classes (CD-02): **derived** facts come from
  `npm run graph`; **attested** facts ("migration applied", "live smoke") are
  the operator's word and cannot be checked here; **judged** facts are rulings.
  Never present one class as another.
