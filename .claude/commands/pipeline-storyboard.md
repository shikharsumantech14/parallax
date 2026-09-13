---
description: Run the composer agent for a researched Parallax candidate. Reads the dossier and writes the storyboard — every point the reader must get, the component that shows it (picked from all 98 kinds by data shape), the word budget around each, the head, the Indian ground and the three quiz questions — to research/<category>/<date>-<slug>-storyboard.md with Status: draft, for the operator to approve before /pipeline-draft.
allowed-tools: Read, Glob, Grep, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-storyboard

Step 2.5 of the Parallax editorial pipeline (REGISTER-PLAN RG-07, 2026-09-13).
Writes the storyboard from the dossier, before any prose is drafted.

## Usage

```
/pipeline-storyboard politics
/pipeline-storyboard earth
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

**Prerequisite:** `/pipeline-research <category>` has produced a dossier with
`Status: ready-for-draft`.

## What this does

1. Validates the category argument
2. Finds the most recent dossier for the category and confirms
   `Status: ready-for-draft`
3. Spawns the **composer** subagent with the dossier path
4. The agent reads the dossier, the voice contract, `docs/design/catalog-shapes.md`
   and the catalog, and writes the storyboard with `Status: draft`
5. Returns the path, the hero, the spine of kinds, the word budget, and
   anything that needs a ruling

## What you do next

1. Open `research/<category>/<YYYY-MM-DD>-<slug>-storyboard.md`
2. Read the table — two minutes. Move a row, swap a kind, cut a beat, change
   the hero if it is wrong
3. Flip `Status: draft` → `Status: approved` (or `hold` to park it)
4. Run `/pipeline-draft <category>`. While `GATES.storyboard` in
   `scripts/pipeline.config.ts` is `'required'`, the drafter refuses an
   unapproved storyboard; when it is `'auto'`, `draft` is enough and only
   `hold` stops it

## Cost

Reads: the dossier, the contract, two catalog files, the template, the
schema. One writing pass. No WebSearch or WebFetch. Cheap: roughly a fifth of
a draft run.

---

## Instructions to Claude

The user has invoked `/pipeline-storyboard` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Glob `research/$ARGUMENTS/*-dossier.md`. Read the most recent file's
   header. Check `Status: ready-for-draft`.
   - If no dossier exists: tell the user to run
     `/pipeline-research $ARGUMENTS` first.
   - If the status is not `ready-for-draft`: tell the user to review the
     dossier and confirm it is ready.

3. Spawn the **composer** subagent — pinned to **Opus** (`model: 'opus'`) per
   the Claude Code route policy in `CLAUDE.md` — with this prompt:

   > You are the Composer Agent for Parallax. Your full agent definition is
   > at `.claude/agents/composer.md` — read it first.
   >
   > Write the storyboard for this dossier:
   > `research/$ARGUMENTS/<dossier-filename>`
   >
   > Follow all rules in your agent definition exactly. Write the output to
   > `research/$ARGUMENTS/<today>-<slug>-storyboard.md` following
   > `research/_templates/storyboard.md`, with `Status: draft`.
   >
   > Working directory: D:\SideProjects\parallax
   >
   > Return: the file path, the hero and why, the spine (kinds in order), the
   > word total budgeted, any kind you wanted and could not use for want of
   > data, and anything the operator should rule on before the draft.

4. When the subagent finishes, relay its summary to the user with the file
   path, and remind them to flip `Status: approved` before `/pipeline-draft`.
