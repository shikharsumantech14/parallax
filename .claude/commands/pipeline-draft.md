---
description: Run the drafter agent for a researched Parallax candidate. Reads the dossier and writes a complete MDX issue file at src/content/issues/<slug>/index.mdx with status draft.
allowed-tools: Read, Glob, Grep, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-draft

Step 3 of the Parallax editorial pipeline. Writes a complete draft
issue MDX file from the research dossier.

## Usage

```
/pipeline-draft politics
/pipeline-draft space
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

**Prerequisites:** `/pipeline-research <category>` has produced a dossier
with `Status: ready-for-draft` (no blocking [UNVERIFIED] items), and
`/pipeline-storyboard <category>` has produced a storyboard. While
`GATES.storyboard` in `scripts/pipeline.config.ts` is `'required'`, the
storyboard must say `Status: approved` (REGISTER-PLAN RG-07); when it is
`'auto'`, `draft` is enough. `hold` always stops the draft.

## What this does

1. Validates the category argument
2. Finds the most recent dossier for the category and confirms
   `Status: ready-for-draft`
3. Finds the most recent storyboard and checks the gate
4. Spawns the **drafter** subagent with both paths
5. The agent reads the dossier, the storyboard, the voice contract and the
   schema, then writes a complete MDX issue file with `status: draft`,
   executing the storyboard's kinds, order, hero and word budgets
6. Returns the file path and a draft summary

## What you do next

1. Run `/pipeline-panel <category>` — the comprehension gate (first pass)
2. Open `src/content/issues/<slug>/index.mdx` and read it with the panel
   report beside it — apply its fixes (they are directions, not sentences)
3. Resolve any `# EDITOR: verify before publish` comments
4. Run the stylist (`npm run pipeline:stylist <category>`, API-CLI only),
   then `/pipeline-panel <category>` again (second pass)
5. Run `/pipeline-verify <category>` for the claim-by-claim audit before
   flipping to published
6. Or flip `status: draft → review` if you want to hold it before the
   verifier pass

## Cost

Each run uses:
- ~5-10 Read calls (dossier + schema + voice reference issues)
- One Sonnet pass for writing (high-craft step — do not route to a
  cheaper model)
- No WebSearch or WebFetch — drafter works only from the dossier

Approx ₹10-25 per run on Anthropic API direct, or ~2-4% of a
Claude Pro 5-hour limit window.

---

## Instructions to Claude

The user has invoked `/pipeline-draft` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Glob `research/$ARGUMENTS/*-dossier.md`. Read the most recent file.
   Check the header for `Status: ready-for-draft`.
   - If no dossier exists: tell the user to run
     `/pipeline-research $ARGUMENTS` first.
   - If status is not `ready-for-draft`: tell the user to review the
     dossier and confirm it's ready.

3. Glob `research/$ARGUMENTS/*-storyboard.md` and read the most recent
   file's `- **Status:**` line. Read `GATES.storyboard` from
   `scripts/pipeline.config.ts`.
   - If no storyboard exists: tell the user to run
     `/pipeline-storyboard $ARGUMENTS` first.
   - If the status is `hold`: stop and say the storyboard is on hold.
   - If the gate is `'required'` and the status is not `approved`: stop and
     tell the user to read the storyboard and flip `Status: approved`.

4. Spawn the **drafter** subagent — pinned to **Opus** (`model: 'opus'`) per
   the Claude Code route policy in `CLAUDE.md` — with this prompt:

   > You are the Drafter Agent for Parallax. Your full agent definition
   > is at `.claude/agents/drafter.md` — read it first.
   >
   > Write a complete draft issue from this dossier:
   > `research/$ARGUMENTS/<dossier-filename>`
   >
   > Execute this storyboard — it fixes the kinds, the order, the hero, the
   > word budgets and the head:
   > `research/$ARGUMENTS/<storyboard-filename>`
   >
   > Follow all rules in your agent definition exactly. Write the
   > output to `src/content/issues/<id>/index.mdx` where `<id>`
   > matches the dossier slug and today's date.
   >
   > Working directory: D:\SideProjects\parallax
   >
   > Return: file path, issue title + hook, section count + read time,
   > any [UNVERIFIED] items omitted or flagged, any place the draft departs
   > from the storyboard and why.

5. When the subagent finishes, relay its summary to the user. Include
   the file path so the user can open it directly, and point them to
   `/pipeline-panel $ARGUMENTS` as the next step.
