---
name: publish-issue
description: Take a Parallax issue from draft to published — audit sources, schema bounds, voice and gates before the status flip. Use when preparing an issue for publication or auditing a draft after the verifier has run.
argument-hint: [issue-slug]
allowed-tools: Bash(npm run *), Bash(node scripts/*), Bash(grep *), Read, Edit, Grep
---

# Publish an issue

> **The status flip is the operator's, always.** This skill prepares and audits;
> it does not publish. Present the findings and let the operator decide.

## Library and issue state
!`node scripts/project-graph.mjs --brief`

## 1. Where it is in the pipeline

`draft` → `review` → `published`. Only `status !== 'draft'` renders publicly,
and story pages (`/s/`) build only for non-draft. The verifier must have run
(`research/<cat>/<date>-<slug>-verification.md`) and the operator must have
read it. If either is missing, stop and say so.

## 2. Schema bounds — Zod fails the build, it does not warn

- `primer` 80–420 chars
- `plain` ≤ 220 chars — the **form** of the graphic, never the data
- `howToRead` 40–360 chars
- `caption` — the **data** claim; the only comprehension field the verifier traces
- `sources[].url` — a real URL; mock URLs break the build
- every `sourceRefs[]` resolves to an existing `source.id`

## 3. Sources — CANON §7, "no source, no section"

Every figure states where its data came from. This became true of published
content for the first time in `37a6f7d` (21 backfilled).

**Missing captions are not automatically a defect.** 22 sections deliberately
carry none: their `intro` already states the finding, and adding a caption
would trip the verifier's `REDUNDANT-HOWTO` / `CAPTION-FORM` flags. Check
whether the intro already says it before "fixing" one.

## 4. Voice

`.claude/rules/editorial-voice.md` loads automatically for `.mdx`. Check the
hard limits: ≤1 SATIRICAL EXPOSURE section, ≤2 LYRICAL COMPRESSION paragraphs,
4–6 modes across the issue. Run the AI-tell catalog over every prose field —
**applying a mode does not excuse a tell.**

## 5. Unverified claims

Every `# EDITOR:` flag must be resolved or consciously accepted. Grep the file;
list any that remain, with the claim each guards.

## 6. Gates and greps

```
npm run build
npm run check:catalog
npm run graph:check
```

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

Zero hits. `author` is schema-optional with no default; if absent the Hero
omits the "By" line. Never hardcode a name.

Also check numbering: `— 01` style via `formatIssueNumber` /
`formatSectionLabel`. The travel masthead's `Vol. I, No. 01` is the one
intentional exception.

## 7. Report

Per check: pass, fail, or not applicable — and for each failure the smallest
fix. End with an explicit recommendation: **ready to flip**, or **not ready
because X**. Then stop.

$ARGUMENTS
