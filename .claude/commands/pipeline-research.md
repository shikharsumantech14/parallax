---
description: Run the researcher agent for a chosen Parallax candidate. Deeply researches the chosen issue, verifies all facts against primary sources, and writes a structured dossier at research/<category>/<date>-<slug>-dossier.md.
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-research

Step 2 of the Parallax editorial pipeline. Deep-researches a chosen
candidate and produces a verified dossier for the drafter.

## Usage

```
/pipeline-research politics
/pipeline-research space
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

**Prerequisite:** You must have already run `/pipeline-discover <category>`
and picked a candidate by changing its `status: open` → `status: chosen`
in the candidates file.

## What this does

1. Validates the category argument
2. Finds the most recent candidates file for the category
3. Confirms exactly one candidate has `status: chosen`
4. Spawns the **researcher** subagent with the category and chosen
   candidate as context
5. The agent verifies all facts, finds primary sources and key quotes,
   proposes the issue structure, and writes the dossier
6. Returns the dossier path and a summary of what was found

## What you do next

1. Open `research/<category>/<YYYY-MM-DD>-<slug>-dossier.md`
2. Read through the structural argument, verified facts, and suggested
   structure
3. Check any items marked [UNVERIFIED] — decide if they need resolving
   before drafting or can be dropped
4. If the dossier looks solid, run `/pipeline-draft <category>`
   (Phase 3 — coming soon)
5. If the dossier has gaps, you can ask the researcher to go deeper
   on a specific section before moving to draft

## Cost

Each run uses:
- ~10-20 WebSearch calls
- ~8-15 WebFetch calls (one per primary source + cross-checks)
- One Sonnet pass for synthesis and structure

Approx ₹30-70 per run on Anthropic API direct, or ~5-10% of a
Claude Pro 5-hour limit window.

---

## Instructions to Claude

The user has invoked `/pipeline-research` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Verify `research/_sources/$ARGUMENTS.md` exists. If not, stop.

3. Glob `research/$ARGUMENTS/*-candidates.md`. Read the most recent
   file. Check for a candidate with `status: chosen`.
   - If none found: tell the user to run `/pipeline-discover $ARGUMENTS`
     first and pick a candidate.
   - If more than one is chosen: tell the user to unset the extras and
     leave exactly one `status: chosen`.

4. Spawn the **researcher** subagent with this prompt:

   > Run research for category **$ARGUMENTS**. The candidates file is at
   > `research/$ARGUMENTS/<most-recent-candidates-file>`. Find the
   > candidate with `status: chosen`, deeply research it using the
   > source allowlist at `research/_sources/$ARGUMENTS.md`, and write
   > the dossier to `research/$ARGUMENTS/<today-YYYY-MM-DD>-<slug>-dossier.md`.
   > Follow the template at `research/_templates/dossier.md` exactly.
   > Return a one-paragraph summary with: dossier file path, the
   > structural argument in one sentence, 3 strongest verified facts,
   > and any [UNVERIFIED] items to flag for the editor.

5. When the subagent finishes, relay its summary to the user. Do not
   add editorial commentary — the editor reviews the dossier directly.
