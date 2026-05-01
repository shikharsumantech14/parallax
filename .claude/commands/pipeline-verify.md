---
description: Run the verifier agent on a Parallax draft issue. Audits every factual claim against the research dossier, checks voice compliance, and writes a verification report at research/<category>/<date>-<slug>-verification.md. This is the brand-protection step before publish.
allowed-tools: Read, Glob, Grep, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-verify

Step 4 of the Parallax editorial pipeline. Claim-by-claim audit of a
draft issue before it is cleared for publish.

## Usage

```
/pipeline-verify politics
/pipeline-verify space
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

**Prerequisite:** You must have already run `/pipeline-draft <category>`
and done at least one read-through of the draft yourself.

## What this does

1. Validates the category argument
2. Finds the most recent draft issue for the category
   (most recent `src/content/issues/*` with matching topic + status: draft)
3. Finds the most recent dossier for the category
4. Spawns the **verifier** subagent
5. The agent audits every factual claim, quote, and date in the draft
   against the dossier; checks Parallax voice rules; checks schema
6. Writes a verification report and returns a verdict

## Verdict meanings

- **APPROVED** — all claims verified, voice clean, schema valid.
  You can flip `status: draft → published` (or `review` if you want
  one more human pass first).
- **NEEDS REVISION** — specific imprecisions found but no invented
  claims. Fix the flagged items, then publish.
- **BLOCKED** — one or more untraced claims or advocacy phrases.
  Must be resolved before the issue can go live.

## What you do next

1. Open `research/<category>/<YYYY-MM-DD>-<slug>-verification.md`
2. Work through "Required fixes before publish"
3. Edit `src/content/issues/<slug>/index.mdx` to fix each item
4. If verdict was APPROVED or fixes are minor: flip `status: draft →
   published` and push
5. If verdict was BLOCKED: re-run `/pipeline-verify` after fixing

## Cost

Each run uses:
- ~5-8 Read calls (draft + dossier + schema reference)
- One Sonnet pass for systematic audit

Approx ₹10-20 per run on Anthropic API direct, or ~2-3% of a
Claude Pro 5-hour limit window.

---

## Instructions to Claude

The user has invoked `/pipeline-verify` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Find the most recent draft issue for this category:
   - Glob `src/content/issues/*/index.mdx`
   - Read each and find the one with `topic: $ARGUMENTS` and
     `status: draft`
   - If multiple drafts exist, use the most recently dated one
   - If none: tell the user to run `/pipeline-draft $ARGUMENTS` first

3. Find the most recent dossier:
   - Glob `research/$ARGUMENTS/*-dossier.md`
   - Use the most recent file

4. Spawn the **verifier** subagent with this prompt:

   > You are the Verifier Agent for Parallax. Your full agent definition
   > is at `.claude/agents/verifier.md` — read it first.
   >
   > Audit this draft issue:
   > `src/content/issues/<slug>/index.mdx`
   >
   > Against this dossier:
   > `research/$ARGUMENTS/<dossier-filename>`
   >
   > Write the verification report to:
   > `research/$ARGUMENTS/<today-YYYY-MM-DD>-<slug>-verification.md`
   >
   > Working directory: D:\SideProjects\parallax
   >
   > Return: verdict (APPROVED/NEEDS REVISION/BLOCKED), count of
   > verified/imprecise/untraced claims, and top 3 issues if not
   > APPROVED.

5. Relay the subagent's summary to the user with the report file path.
