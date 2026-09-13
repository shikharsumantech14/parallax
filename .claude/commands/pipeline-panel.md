---
description: Run the reader-panel agent on a Parallax draft issue. Four Indian reader personas read the draft cold, answer the storyboard's three quiz questions from the draft alone, retell every section in one line and quote the sentence that lost them; the report at research/<category>/<date>-<slug>-panel.md carries a PASS / REVISE / BLOCK verdict. Run after /pipeline-draft and again after the stylist.
allowed-tools: Read, Glob, Grep, Write, Agent
argument-hint: <category — politics | space | earth | tech | travel | sports>
---

# /pipeline-panel

The comprehension gate (REGISTER-PLAN RG-12, 2026-09-13). Runs twice per
issue: after the draft, before the stylist; and again after the stylist.

## Usage

```
/pipeline-panel sports
```

Argument is one of: `politics`, `space`, `earth`, `tech`, `travel`, `sports`.

**Prerequisite:** a draft issue for the category exists in
`src/content/issues/`, and its storyboard (with §6, the three questions)
exists in `research/<category>/`.

## What this does

1. Validates the category argument
2. Finds the most recent draft issue for the category and its storyboard
3. Spawns the **reader-panel** subagent with both paths
4. The agent reads the draft as each of the four personas, answers the quiz
   from the draft alone, retells each section, quotes the lost sentences,
   scores, and writes the report
5. Returns the verdict, the quiz results, the weakest sections and the top
   three fixes

## What you do next

- **PASS** — run the stylist (or, on the second pass, the verifier).
- **REVISE** — apply the fixes (they are directions, not sentences), then
  re-run.
- **BLOCK** — the draft is not teaching its own argument; go back to the
  storyboard or the draft before spending anything else.

---

## Instructions to Claude

The user has invoked `/pipeline-panel` with argument: **$ARGUMENTS**

1. Validate that **$ARGUMENTS** is one of: politics, space, earth, tech,
   travel, sports. If not, print the valid options and stop.

2. Find the most recent `src/content/issues/<slug>/index.mdx` whose
   frontmatter has `topic: $ARGUMENTS` and `status: draft`. If none: tell the
   user to run `/pipeline-draft $ARGUMENTS` first.

3. Glob `research/$ARGUMENTS/*-storyboard.md` and take the most recent. If
   none: tell the user to run `/pipeline-storyboard $ARGUMENTS` first — the
   panel needs its three questions.

4. Ask nothing else. Spawn the **reader-panel** subagent — pinned to **Opus**
   (`model: 'opus'`) per the Claude Code route policy in `CLAUDE.md` — with:

   > You are the Reader Panel for Parallax. Your full agent definition is at
   > `.claude/agents/reader-panel.md` — read it first.
   >
   > Read this draft: `src/content/issues/<slug>/index.mdx`
   > The storyboard with the three questions: `research/$ARGUMENTS/<storyboard-filename>`
   > This is the <first | second> pass.
   >
   > Follow all rules in your agent definition exactly. Write the report to
   > `research/$ARGUMENTS/<today>-<slug>-panel.md`.
   >
   > Working directory: D:\SideProjects\parallax
   >
   > Return: the verdict, one line per quiz question, the three lowest-scoring
   > sections, and the top three fixes.

   Say "first pass" if no panel report for this slug exists yet, otherwise
   "second pass".

5. Relay the verdict and the summary to the user with the report path.
