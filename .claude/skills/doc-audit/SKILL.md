---
name: doc-audit
description: Audit Parallax's documentation for staleness, contradictions, orphaned files and broken cross-references. Use when the docs feel out of sync, before a handover, after a big change, or periodically as maintenance.
allowed-tools: Bash(git *), Bash(node scripts/*), Bash(grep *), Read, Glob, Grep
---

# Documentation audit

## Inventory and dangling decisions
!`node scripts/project-graph.mjs --doc-audit`

## Your task

**Report only. Change nothing** unless the operator asks. Findings in these
five classes, most severe first — ranked by *cost of being wrong*, not by count.

### 1. Contradiction — the worst class

Two live docs asserting different current truth. An agent that finds nothing
asks a question; an agent that finds a confident stale answer acts on it. This
is what `NEXT-SESSION.md` did for two months before it was archived.

Check especially: anything claiming to be the entry point other than
`docs/STATE-OF-PLAY.md` (CD-10), and any environment claim — those go stale
silently and were wrong twice already.

### 2. Derivable prose

A hand-written fact a generator could compute: counts, wiring, which kinds
exist, what is committed. Every instance is future staleness (CD-02). Say which
generator flag should own it.

### 3. Broken reference

A cited file, section, anchor or ID that does not exist. Includes RD-/TD-/CD-
IDs with no definition, and links to files that moved to `docs/archive/`.

### 4. Orphan

A doc nothing links to and no guide mentions. Not automatically wrong —
say what it appears to be for, and whether it should be archived (CD-07) or
linked.

### 5. Dangling decision — status, NOT an error

A decision ID cited in planning docs with **zero implementing files**.

**Zero is a question, not a verdict.** It means one of two very different
things, and you must say which you think it is:

- **Decided but not yet built** — correct and expected. RD-03 (the deferred
  brand mark) and RD-07/RD-08 (Phase 7 furniture) are exactly this.
- **Built by files that never name the ID** — the graph only sees citations.
  TD-03 is cited in 30 blueprints while the tokens implementing it carry no
  `TD-03` comment, so it reads as dangling while being fully shipped.

**Never report either as a defect.** Report the count, then name any that look
*surprising* — a decision everyone believes shipped that no source file cites.
Where the second case applies and a citation comment would genuinely help a
future reader, propose adding one; do not add citations mechanically to make a
number go to zero.

## Output

For each finding: file, line, what is wrong, and the **smallest** fix. Group by
class. If a class is empty, say so in one line rather than padding.

End with the single highest-value fix, and offer to make it.

## Do not

- Do not "fix" a file in `docs/archive/`. Those are frozen records; correcting
  a stale fact in place defeats the point of freezing it.
- Do not treat prose disagreeing with a *generated* file as a doc bug without
  checking which is right — the generator can have a bug too.
