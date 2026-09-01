---
name: close-session
description: Close out a Parallax working session — summarise what changed, run the gates, propose a commit, doc updates and memory writes, and leave the repo ready for a cold start. Use when wrapping up, before a handover, or when the user says they are done for now.
allowed-tools: Bash(git *), Bash(node scripts/*), Bash(npm run *), Read, Edit, Write
---

# Close the session

## What changed
!`git status --short`

## Commits this session
!`git log --oneline -10`

## Diff scale
!`git diff HEAD --stat`

## Live state
!`node scripts/project-graph.mjs --brief`

## Your task

Work through these in order. **Everything in steps 3–5 needs approval before
you write anything** (CD-05).

### 1. Summarise

What this session actually *achieved*, in outcomes — not a narration of steps.
Three to six lines. If something was attempted and abandoned, say so and why;
that is the most valuable line for the next session.

### 2. Gates

Run and report honestly:

```
npm run check:catalog
npm run design:check
npm run graph:check
npm run hooks:test
```

**Do not close over a red gate.** If one fails, say so plainly and either fix it
or record it as the next action. A green summary over a red gate is the single
most damaging thing this skill could produce.

### 3. Propose a commit

Repo style: imperative subject, body explaining *why* and citing the decision
IDs touched. **No `Co-Authored-By` trailer** (AGENTS.md §7). Include what was
verified, not just what was changed.

Present the message. Do not commit until asked. **Never push** — the operator
pushes, and a hook enforces it.

### 4. Propose doc updates

- State drifted? Offer `/update-state`.
- A **standing convention** changed — something true next month, not just
  today? That belongs in `AGENTS.md` or a `.claude/rules/` file. Propose the
  exact edit.
- Something bit you that is not written down? Propose a §7 trap entry. Only if
  it *actually bit*.

### 5. Propose memory writes

Auto memory is for what **the repo cannot say about itself**: operator
preferences, corrections given this session, the reasoning behind a call that
is not in any doc.

Do **not** save anything derivable from code, git history, or the guides —
those have better homes and a duplicate will rot. Draft each as one line, say
which type it is (`user` / `feedback` / `project` / `reference`), and ask.

### 6. Name the next action

One sentence, specific enough that the next session can start on it without
re-deriving anything. This is the handoff.
