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

**What a run costs is measured, never estimated:** every run appends its
actual dollars and tokens to `research/_costs/ledger.jsonl`, and
`npm run pipeline:costs` totals them per issue and per agent (2026-09-16).
Quote that report, not a range. Running a phase is an editorial decision,
never a technical one. A one-word SDK call costs ~$0.25
because every run writes its first turn (~35–50k tokens) to a one-hour cache;
that is the floor, not a leak. The draft phase refuses
an unapproved storyboard while `GATES.storyboard` is `'required'`
(`pipeline.config.ts`, REGISTER-PLAN RG-07) — that check runs before any
agent is loaded, so `npx tsx scripts/pipeline.ts draft <cat>` with no
storyboard is a free smoke test.

`.env.local` is gitignored via `*.local`. Never commit it, never echo its
contents.

## Model routing — do NOT "optimise"

`scripts/pipeline.config.ts` (discovery and research → `claude-sonnet-5`,
the long tool loops; composer, drafter, stylist, verifier → `claude-opus-5`,
the short passes; the reader panel → `claude-sonnet-5` so it never judges
its own drafter's prose — the operator's ruling of 2026-09-21, after one
round on all-Opus measured $65.91 for discovery + research alone; a run's
cost is its loop length, not its thinking) applies to the **API-CLI route
only**. Both loop prompts carry a search / fetch budget and every phase has
a `maxTurns` cap (`MAX_TURNS`). On the Claude Code route
the subscription absorbs cost, so **every** phase pins to Opus. Leave the
split alone — it is the operator's API config; `--model <id>` overrides it
for one run. Model IDs DO go stale: the config sat on `claude-opus-4-1` for
six weeks after that model retired (2026-08-05), so a draft would have failed
on its first call. When the pipeline has not run for a while, check the IDs
against the current model list before anything bills.

## Two issues per desk — the flags

Every phase after research finds its input by "most recent file in the
folder", and two same-day files from one desk sort by slug, not age. Pass
`--slug <dossier-slug>` to storyboard / draft / panel / stylist / verify and
`--candidate C-NN` to research (no edit to the candidates file). `--count n`
fixes how many candidates discovery surfaces. `scripts/README.md` has the
table.

## Which credential a run bills to — proven, not reported

**The SDK's init message reports `apiKeySource: ANTHROPIC_API_KEY` whenever
the env var is set, even when the CLI then bills the operator's claude.ai
login.** Measured 2026-09-22: with the machine's `~/.claude` in play, a
BOGUS key still answered "OK" (the login carried it) and the console key
never moved; with `CLAUDE_CONFIG_DIR` pointed at an empty directory the same
bogus key got a 401 and the real key answered. Every pipeline run from
2026-09-16 to 2026-09-22 05:40 UTC (discovery, research, storyboards, three
drafts, three panels) drew on the subscription's usage and extra usage, not
the key, until it ran out mid-draft. `scripts/lib/runner.ts` now spawns the
CLI with `CLAUDE_CONFIG_DIR=.claude-api-home/` (gitignored), so the key is
the only credential it can find, and every ledger row since carries
`billedTo`. To re-prove it after an SDK upgrade: run the runner with a bogus
key and expect a 401 — a success means the login is back in the path.

## What a run's context contains

The SDK spawns a Claude Code CLI. Without `strictMcpConfig` that CLI loads
every MCP server the desktop app registered on this machine (seven claude.ai
connectors, 196 tools instead of 28) into the run — none callable, all
paid for. `scripts/lib/runner.ts` sets it; keep it set. The agent runs under
its own system prompt, not the Claude Code preset, so it does NOT see
CLAUDE.md / AGENTS.md / these rules, and nothing tells it today's date unless
the prompt does (`scripts/lib/prompts.ts` passes it to discovery and research).

## Gates live here

- `check-catalog.mjs` — SECTION_KINDS ↔ catalog.md 1:1 and in order, plus
  EXPLAIN and KIND_PRIORITY coverage, plus (2026-09-15) **every field in a
  catalog DATA line has a reader** in its component / dispatch arm / direct
  imports / WebGL scene. Reports every failure in one run. A field with no
  reader fails the build: render it, strike it from the DATA line, or add it
  to `ACCEPTED_UNREAD` in the script with a reason.
- `design-sync.mjs --check` — 30 mirrors + 6 in-world deeps + 18 record tokens.
- `wire-kind.mjs` — wires six of the nine registry places from one config;
  idempotent, handles per-file line endings.
- `project-graph.mjs` — the derived project graph (CD-09: its output in
  `docs/generated/` is never hand-edited).
- `ui-probe.mjs` — **the render gate** (`npm run check:render`, 2026-09-23;
  RD-15). `puppeteer-core` on the installed Chrome renders every non-draft
  issue as a signed-in reader at 1280 and 375 and fails on any element past
  the column, the honest phone overflow, clipped text, text on text, the ⤢
  button on text or duplicate chrome; screenshots per section per width
  under `research/_ui/<date>/` (gitignored). Not in `prebuild` — it needs a
  browser — but **enforced at commit time**: it writes
  `research/_ui/last-run.json` with a fingerprint of the rendering tree
  (`scripts/lib/render-fingerprint.mjs`), and `.claude/hooks/guard-render.mjs`
  refuses a `git commit` that stages rendering files unless the stamp matches
  the tree now, is clean, and covers what changed. Edit after the run and it
  is stale. `PX_SKIP_RENDER_GATE=1` on the commit is the operator's override,
  and only theirs.

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
