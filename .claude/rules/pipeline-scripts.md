---
paths:
  - "scripts/**"
  - ".claude/agents/**"
---

# Pipeline scripts and agents

## These scripts spend real money

`.env.local` **exists at the repo root** on this machine (it holds
`ANTHROPIC_API_KEY` and the Supabase keys). So `npm run pipeline:*` **will
actually run and actually bill**.
Never invoke one to "test" something.

**What a run costs is measured, never estimated:** every run appends its
actual dollars and tokens to `research/_costs/ledger.jsonl`, and
`npm run pipeline:costs` totals them per issue and per agent (2026-09-16).
Quote that report, not a range. Running a phase is an editorial decision,
never a technical one. Since the harness diet (COST-PLAN CP-02, 2026-09-28) a
run's first request is about 4k to 15k tokens (measured 4,199 on a one-word
probe, down from 54.6k to 58.5k), written to a 5-minute cache on the API key;
a one-word call costs about a cent. The draft phase refuses
an unapproved storyboard while `GATES.storyboard` is `'required'`
(`pipeline.config.ts`, REGISTER-PLAN RG-07) — that check runs before any
agent is loaded, so `npx tsx scripts/pipeline.ts draft <cat>` with no
storyboard is a free smoke test ONLY when no approved storyboard exists for
that desk; pass `--slug <no-such-issue>` to be sure, or use `--dry-run`, which
assembles the prompt and exits without calling the runner (2026-09-28).

`.env.local` is gitignored via `*.local`. Never commit it, never echo its
contents.

The slash commands run these same scripts (below), so `/pipeline-<phase>`
really bills too, on the subscription. The rule is the same on both doors:
never start a phase to test something.

## One config, two wallets (the operator's ruling of 2026-09-28)

**Two doors, one pipeline (ruled 2026-09-28).** The API door is a terminal:
`npm run pipeline:<phase> <desk> -- <flags>` bills `ANTHROPIC_API_KEY`. The
Claude Code door is the slash command: `/pipeline-<phase> <desk> <flags>`
runs `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and
bills your Claude subscription. Same script, same agents, same
`scripts/pipeline.config.ts`: the door decides only which wallet pays, and
the ledger row's `billedTo` says which.

- **One config for both doors.** `scripts/pipeline.config.ts` rules every
  run: `CONFIG.models` (discovery and the reader panel on `claude-sonnet-5`,
  research, the check pass, composer, drafter, stylist and verifier on
  `claude-opus-5`, the panel kept off the drafter's model so it never judges
  its own prose), `EFFORT`, `MAX_BUDGET_USD`, `MAX_TURNS`, `ALLOW` and
  `GATES`. The rule that the Claude Code route ran every phase on Opus is
  retired, and so is the rule that it must not be "optimised" to match the
  API split: there is one pipeline now. `--model <id>` and `--effort <level>`
  override one run on either door. Both loop prompts carry a search / fetch
  budget. Model IDs DO go stale: the config sat on `claude-opus-4-1` for six
  weeks after that model retired (2026-08-05), so a draft would have failed
  on its first call. When the pipeline has not run for a while, check the IDs
  against the current model list before anything bills.
- **The flag is the door, not the place you type it.** `--bill subscription`
  in a terminal bills the subscription, and `npm run pipeline:<phase>` typed
  into Claude Code's shell without it bills the key. When the operator asks
  for a phase inside Claude Code, run it through its slash command's npm
  line, `--bill subscription` included.
- **The slash commands are wrappers.** Each `.claude/commands/pipeline-<phase>.md`
  (discover, research, check, storyboard, draft, panel, stylist, verify) runs
  the npm line above in the background and reports the footer. It spawns no
  agent, pins no model and reads no file list, and it carries
  `disable-model-invocation`, so only the operator starts one. The old route,
  which ran the agent inside Claude Code with the repo's `CLAUDE.md` and every
  tool, and without the check pass, Jev or the ledger, is retired. Spawning a
  pipeline agent with the Agent tool is that route by another name.
- **The same diet on both doors** (below). The one difference is the
  credential. On `api` the runner points the spawned CLI at an empty config
  directory (`CLAUDE_CONFIG_DIR=.claude-api-home/`, gitignored) and strips
  every other `CLAUDE_*` and `ANTHROPIC_*` variable, so the key is the only
  credential it can find. On `subscription` the machine's claude.ai login
  stays, and the CLI prefers it over the key: the plan's own usage first,
  then extra usage at API rates. The ledger prices both at list, so a
  subscription row's dollars are what the run would have cost on the key.
- **Jev is a standing part** (the operator's ruling of 2026-09-28). The
  script runs the claim pre-pass before the verifier and the quiz grade after
  each panel, on both doors, through OpenRouter (`JEV_API_KEY`). A pre-pass,
  never a gate: a missing key skips it with a `jev:` line and the phase runs
  on. It spends no Anthropic money (about a cent an issue, on its own ledger,
  `research/_costs/jev-ledger.jsonl`). Detail: `scripts/README.md`, Jev.

## Two issues per desk — the flags

Every phase after research finds its input by "most recent file in the
folder", and two same-day files from one desk sort by slug, not age. Pass
`--slug <dossier-slug>` to storyboard / draft / panel / stylist / verify and
`--candidate C-NN` to research (no edit to the candidates file). `--count n`
fixes how many candidates discovery surfaces. Since 2026-09-28 also
`--effort`, `--focus` (discovery), `--topup` (research, with `--slug`),
`--dry-run` (assemble the prompt, send nothing) and `--bill`. The slash
commands pass every flag through unchanged, except `--bill`, which they
refuse. `scripts/README.md` has the table.

## Which credential paid: proven, not reported

**The SDK's init message reports `apiKeySource: ANTHROPIC_API_KEY` whenever
the env var is set, even when the CLI then bills the operator's claude.ai
login.** Measured 2026-09-22: with the machine's `~/.claude` in play, a
BOGUS key still answered "OK" (the login carried it) and the console key
never moved. With `CLAUDE_CONFIG_DIR` pointed at an empty directory the same
bogus key got a 401 and the real key answered. Every pipeline run from
2026-09-16 to 2026-09-22 05:40 UTC (discovery, research, storyboards, three
drafts, three panels) drew on the subscription's usage and extra usage, not
the key, until it ran out mid-draft. That is why the `api` door isolates the
CLI (above), and why every ledger row since carries `billedTo`.

`billedTo` records the door a run was pointed at. The proof of who paid is
the row's cache split. The CLI writes 5-minute cache entries on an API key
and 1-hour entries on a subscription login within the plan's usage, and
nothing in the runner asks for an hour. **The standing trap: a run on `api`
that writes 1-hour entries means the login is back in the path**, whatever
`billedTo` says, and the footer prints a red warning. A `subscription` row
with no 1-hour writes ran on extra usage or was answered by the key: check the
plan's usage page and console.anthropic.com. To re-prove the `api` door after
an SDK or CLI upgrade, run the runner with a bogus key and expect a 401. A
success means the login is back in the path.

## What a run's context contains

The SDK spawns a Claude Code CLI. Without `strictMcpConfig` that CLI loads
every MCP server the desktop app registered on this machine (seven claude.ai
connectors, 196 tools instead of 28) into the run — none callable, all
paid for. `scripts/lib/runner.ts` sets it; keep it set. The agent runs under
its own system prompt, not the Claude Code preset, and nothing tells it
today's date unless the prompt does (`scripts/lib/prompts.ts` passes it to
discovery and research). It does NOT see CLAUDE.md / AGENTS.md / these rules since 2026-09-28:
`scripts/lib/runner.ts` sets `settingSources: []`, disables CLAUDE.md loading
and auto memory by environment, removes every built-in tool the frontmatter
does not list (`disallowedTools`), runs `permissionMode: 'dontAsk'` with only
the scoped rules in `ALLOW` (pipeline.config.ts) and the agent's own `allow:`,
and records any instruction file that still loads in the ledger row
(`instructionsLoaded`, the canary). The diet is the same on both doors.
Before that date the SDK loaded the root
`CLAUDE.md` + `@AGENTS.md` (about 31k tokens) into every first request and
handed the agent the operator's local allow rules, `Bash(npm run *)` included
(measured on 53 transcripts, COST-PLAN §1.3). Writes under `.claude/` are
denied in this mode, so an agent cannot update its memory in-run: the digest
in its prompt is what it reads (CP-05).

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

This describes Claude Code's own subagents. The pipeline's agents do not run
this way any more: the runner loads their definitions under the diet above,
through either door, and Claude Code's Agent tool is not a door (2026-09-28).

## Background loops — two rules from the ones that failed (2026-09-27)

The June 2026 content engine (reactive news, evergreen social, RAG corpus) ran
on GitHub Actions for three months without one successful loop, and was retired
(`docs/archive/CONTENT-ENGINE.md`). Whatever replaces it obeys two rules:

- **An agent cannot run from a bare GitHub runner through the Agent SDK.** The
  SDK spawns the Claude Code CLI; `npm install` does not provide it. A scheduled
  job that needs a model installs the CLI or calls the Messages API directly.
- **Never mask a scheduled step.** `|| true` on the corpus ingest turned a dead
  loop into thirteen weeks of green checkmarks. A step that may legitimately
  fail reports and exits non-zero; the schedule is the retry.

