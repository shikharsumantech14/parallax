---
paths:
  - "scripts/**"
  - ".claude/agents/**"
---

# Pipeline scripts and agents

## These scripts spend real money

`.env.local` **exists at the repo root** on this machine (it holds
`ANTHROPIC_API_KEY`, Voyage and Supabase keys). So `npm run pipeline:*`,
`rag:*`, `social:*` and `reactive:*` **will actually run and actually bill**.
Never invoke one to "test" something.

Per-run cost, API-CLI route: discover ~$0.30–0.80 · research ~$0.80–2.00 ·
draft ~$3–7.50 · stylist ~$1.50–2.50 · verify ~$0.40–1.00. **Full pipeline per
issue: $6–14.** Running one is an editorial decision, never a technical one.

`.env.local` is gitignored via `*.local`. Never commit it, never echo its
contents.

## Model routing — do NOT "optimise"

`scripts/pipeline.config.ts` (discovery/researcher/verifier → Sonnet,
drafter/stylist → Opus) applies to the **API-CLI route only**. On the Claude
Code route the subscription absorbs cost, so **every** phase pins to Opus.
Leave `pipeline.config.ts` alone — it is the operator's API config.

## Gates live here

- `check-catalog.mjs` — SECTION_KINDS ↔ catalog.md 1:1 and in order, plus
  EXPLAIN and KIND_PRIORITY coverage. Reports every failure in one run.
- `design-sync.mjs --check` — 30 mirrors + 6 in-world deeps + 18 record tokens.
- `wire-kind.mjs` — wires six of the nine registry places from one config;
  idempotent, handles per-file line endings.
- `project-graph.mjs` — the derived project graph (CD-09: its output in
  `docs/generated/` is never hand-edited).

`prebuild` runs the gates **before** `story/og.ts` writes anything. Keep that
order: a gate that runs after a writer has already rewritten tracked files is
not a gate. Iterate with `npx astro build` to skip the hook.

## Windows (CD-08)

Node one-liners with regex or quotes **break in Git Bash** — write a scratch
`.mjs` file instead. Python needs `PYTHONIOENCODING=utf-8` (cp1252 chokes on
em-dashes). `src/content/config.ts` is **CRLF**: exact-string anchors fail
unless you match `\r?\n`. That is why `wire-kind.mjs` exists.

## Subagents

Definitions in `.claude/agents/`. A subagent receives the CLAUDE.md hierarchy
(including these rules) but **never auto-loads skills** — preload them with the
`skills:` frontmatter field. It also does **not** inherit the main
conversation's auto memory. Give a subagent that should accumulate know-how
`memory: project` (CD-12), which writes to `.claude/agent-memory/<name>/`.
