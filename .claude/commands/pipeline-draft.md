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

**Prerequisite:** You must have already run `/pipeline-research <category>`
and confirmed the dossier looks solid (status: ready-for-draft, no
blocking [UNVERIFIED] items).

## What this does

1. Validates the category argument
2. Finds the most recent dossier for the category
3. Confirms the dossier has `status: ready-for-draft`
4. Spawns the **drafter** subagent with the dossier path
5. The agent reads the dossier + schema + existing issues for voice,
   then writes a complete MDX issue file with `status: draft`
6. Returns the file path and a draft summary

## What you do next

1. Open `src/content/issues/<slug>/index.mdx`
2. Read it fully — check voice, facts, section flow
3. Fix anything that feels off — rewrite intros, adjust eyebrows,
   tweak section order
4. Resolve any `# EDITOR: verify before publish` comments
5. Run `/pipeline-verify <category>` (Phase 4) for a claim-by-claim
   audit before flipping to published
6. Or flip `status: draft → review` if you want to hold it before
   the verifier pass

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

3. Extract the dossier file path and spawn the **drafter** subagent
   with this prompt:

   > You are the Drafter Agent for Parallax. Your full agent definition
   > is at `.claude/agents/drafter.md` — read it first.
   >
   > Write a complete draft issue from this dossier:
   > `research/$ARGUMENTS/<dossier-filename>`
   >
   > Follow all rules in your agent definition exactly. Write the
   > output to `src/content/issues/<id>/index.mdx` where `<id>`
   > matches the dossier slug and today's date.
   >
   > Working directory: D:\SideProjects\parallax
   >
   > Return: file path, issue title + hook, section count + read time,
   > any [UNVERIFIED] items omitted or flagged, any section kind
   > substitutions made.

4. When the subagent finishes, relay its summary to the user. Include
   the file path so the user can open it directly.
