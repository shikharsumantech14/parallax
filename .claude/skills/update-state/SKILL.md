---
name: update-state
description: Refresh docs/STATE-OF-PLAY.md after working on Parallax — regenerate the derived block and propose prose edits for the authored sections. Use after finishing a chunk of work, before ending a session, or when the state doc has drifted from reality.
argument-hint: [optional note about what changed]
allowed-tools: Bash(git *), Bash(node scripts/*), Bash(npm run *), Read, Edit
---

# Update the state of play

## Derived facts (authoritative)
!`node scripts/project-graph.mjs --state-block`

## Live state
!`node scripts/project-graph.mjs --brief`

## Uncommitted
!`git status --short`

## Commits since the state doc was last touched
!`git log --oneline -20`

## Your task

**Three fact classes, three different rules (CD-02). Getting these confused is
the bug this whole system exists to fix — so classify before you write.**

### 1. DERIVED — write without asking

The block between `<!-- BEGIN GENERATED -->` and `<!-- END GENERATED -->` in
STATE-OF-PLAY §2. Replace it verbatim with the "Derived facts" output above.
Never hand-write inside those markers; never reword the numbers.

### 2. ATTESTED — never invent, only carry forward or ask

Facts about the world **outside this box**: whether a migration was applied,
whether the live site smoke-tested clean, what is deployed on Vercel. No script
here can check these. Rules:

- If unchanged, leave the existing line **and its date** exactly as they are.
- If the operator has just told you one changed, update it **and re-date it**.
- If you suspect one is stale, **ask** — do not guess, and do not delete it.
- Never promote an attested fact into the generated block.

### 3. JUDGED — draft, then stop

§4 what is done · §5 what is left · §6 residuals · §7 traps.

1. Read the current STATE-OF-PLAY.
2. From the commits and live state above, work out what genuinely changed.
3. Draft the edits — quote the **exact** before and after lines.
4. **Present them and stop.** Write nothing until the operator approves.
5. On approval, apply exactly what was approved, and nothing more.

## Rules

- A new entry in §7 (traps) only if it **actually bit** this session. §7 is a
  record of real damage, not a list of hypotheticals — that is what makes it
  worth reading.
- A §6 residual only if it is deliberate and you can state why.
- Never delete an authored line to tidy up. Flag it; let the operator rule.
- If a fact is derivable, it does not belong in prose at all — move it into the
  generated block or delete it (CD-02).
- Volatile facts (branch, unpushed count, dirty files) belong in **no** file.
  They live in the session brief. If you find one written down, remove it and
  say why (CD-11).

$ARGUMENTS
