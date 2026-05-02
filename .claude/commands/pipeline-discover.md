---
description: Run the discovery agent for a Parallax category. Surfaces 5-10 candidate issue topics from the per-category source allowlist, written to research/<category>/<date>-candidates.md.
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-discover

Step 1 of the Parallax editorial pipeline. Surfaces candidate issue
topics for a single category.

## Usage

```
/pipeline-discover politics
/pipeline-discover earth
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

## What this does

1. Validates the category argument
2. Confirms `research/_sources/<category>.md` exists (the source allowlist)
3. Spawns the **discovery** subagent with the category as input
4. The agent surveys recent stories from allowlisted sources, filters
   to the Parallax voice, writes a candidates file
5. Returns the path to the file plus a top-pick summary

## What you do next

1. Open `research/<category>/<YYYY-MM-DD>-candidates.md`
2. Read the candidates (5-10 of them, ranked)
3. Pick exactly one by changing its `status: open` → `status: chosen`
4. Save the file
5. Run `/pipeline-research <category>` (Phase 2 — coming soon)

## Cost

This command runs once per category per week. Each run uses:
- ~5-15 WebSearch calls
- ~3-8 WebFetch calls (only on candidate-worthy headlines)
- One Sonnet pass for synthesis

Approx ₹15-40 per run on Anthropic API direct, or ~3-5% of a
Claude Pro 5-hour limit window.

---

## Instructions to Claude

The user has invoked `/pipeline-discover` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Verify `research/_sources/$ARGUMENTS.md` exists. If not, tell the
   user to populate it first and stop.

3. Verify `research/$ARGUMENTS/` directory exists. If not, create it.

4. Spawn the **discovery** subagent with this prompt:

   > Run discovery for category **$ARGUMENTS**. Read the source allowlist
   > at `research/_sources/$ARGUMENTS.md`, survey recent stories per the
   > rules in your agent definition, and write the candidates file to
   > `research/$ARGUMENTS/<today-IST-YYYY-MM-DD>-candidates.md`. Return
   > a one-paragraph summary with the file path and your top pick.

5. When the subagent finishes, relay its summary to the user. Do not add
   editorial commentary on the candidates — that's the user's job.
