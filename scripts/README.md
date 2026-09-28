# Parallax pipeline CLI — operator guide

The scripts in this directory power the **API-direct pipeline** — the same
editorial workflow as the `/pipeline-<phase>` slash commands in Claude Code,
but billing to your **Anthropic API key** (`ANTHROPIC_API_KEY`) instead of
your Claude Pro token budget.

Heavy agent work (50 K–200 K tokens per run) goes to the API key. Orchestration
in Claude Code (a few thousand tokens to relay results) stays on Pro.

---

## Quick start

```bash
# 1. Copy the env template and paste your real Anthropic key
cp .env.example .env.local

# 2. Edit .env.local and replace the placeholder
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here

# 3. Install dependencies (if not already done)
npm install

# 4. Run a phase
npm run pipeline:discover earth
npm run pipeline:research earth
npm run pipeline:draft    earth
npm run pipeline:stylist  earth
npm run pipeline:verify   earth
```

---

## Commands

| Command | Phase | What it does |
|---|---|---|
| `npm run pipeline:discover <cat>` | 1 | Discovery agent surveys allowlisted sources, writes `research/<cat>/<date>-candidates.md` |
| `npm run pipeline:research <cat>` | 2 | Researcher agent deep-dives the chosen candidate, writes `research/<cat>/<date>-<slug>-dossier.md` |
| `npm run pipeline:storyboard <cat>` | 2.5 | Composer agent maps every point the reader must get to the component that shows it (from all 98 kinds, by data shape), the word budgets, the head, the Indian ground and the three quiz questions → `research/<cat>/<date>-<slug>-storyboard.md`, `Status: draft`. **You flip it to `approved`** — the gate is `GATES.storyboard` in `pipeline.config.ts` (`'required'` now, `'auto'` later) |
| `npm run pipeline:draft <cat>` | 3 | Drafter agent executes the storyboard and writes the full MDX issue to `src/content/issues/<date-slug>/index.mdx` with `status: draft`. Refuses an unapproved storyboard while the gate is `'required'` |
| `npm run pipeline:panel <cat>` | 3.2 / 3.7 | Reader-panel agent reads the draft cold as four Indian reader personas, answers the storyboard's three questions from the draft alone, retells every section, quotes the sentence that lost each reader → `research/<cat>/<date>-<slug>-panel.md` with PASS / REVISE / BLOCK. Run after the draft and again after the stylist |
| `npm run pipeline:stylist <cat>` | 3.5 | Stylist agent rewrites the prose into the runtime voice contract (`research/_voice/_voice-core.md` v2: plain Indian English, hand-held, a Hindi word only where it is the natural word) and assigns one rhetorical job per section. Facts and structured data untouched |
| `npm run pipeline:verify <cat>` | 4 | Verifier agent audits every factual claim against the dossier and the register/composition flags, writes `research/<cat>/<date>-<slug>-verification.md` |
| `npm run check:prose [-- <slug>]` | — | The deterministic register + composition report over every issue (words, blocks, visual share, sentence rhythm, names, unglossed jargon, Hindi rules, Indian ground, numeral drift against HEAD). `check:prose:gate` fails on blocking flags; it joins `prebuild` once the backlist passes |
| `npm run check:render [-- --slug <s> --widths 1280,375 --report --out <dir>]` | — | The render gate (`scripts/ui-probe.mjs`, 2026-09-23): `puppeteer-core` on the installed Chrome loads every published issue as a signed-in reader at 1280 and 375, measures overflow past the column, the honest phone overflow, clipped text, text on text, the ⤢ button on text and duplicate chrome, and writes `report.md` / `report.json` plus a screenshot per section per width under `research/_ui/<date>/` (gitignored). Exit 1 on a blocking finding unless `--report`. Starts a dev server if none answers on 4321 (`--no-serve` to forbid). Not in `prebuild`: it needs a browser |
| ↳ `research/_ui/last-run.json` | — | The render gate's stamp (2026-09-24), written at the end of every completed run, clean or not: `when`, `base`, `widths`, the `slugs` rendered, `full` (no `--slug`, every non-draft issue at 1280 and 375), `blocking`, `warnings`, `report`, and the render `fingerprint` (`scripts/lib/render-fingerprint.mjs`) taken when the run STARTED. `.claude/hooks/guard-render.mjs` reads it and refuses a `git commit` that stages rendering files the stamp does not cover. Local state, gitignored |

Valid categories: `politics` · `space` · `earth` · `tech` · `travel` · `sports`

### Flags (2026-09-16)

A desk carrying **two issues in one round** needs these — without them every
phase after research picks whichever dossier / storyboard / draft sorts last
in the folder, and two same-day files from one desk sort by slug, not by age.

| Flag | Phases | What it does |
|---|---|---|
| `--slug <slug>` | storyboard · draft · panel · stylist · verify | target the `<date>-<slug>-…` dossier / storyboard and the `<date>-<slug>` issue directory; the slug is the dossier's, without the date |
| `--candidate C-NN` | research | research that candidate regardless of its `status:` line (so the second pick of a desk needs no edit to the candidates file) |
| `--model <id>` | all | override the phase's model from `pipeline.config.ts` for one run |
| `--effort <level>` | all | override the phase's `effort` (`low` · `medium` · `high` · `xhigh` · `max`) for one run; the ledger row records the level (2026-09-28) |
| `--count <n>` | discover | surface exactly n candidates (1–10) instead of 5–10 |
| `--focus "<subject>"` | discover | every candidate a different structural angle on one subject, strongest first, each still meeting the diversity gate and the drawn-graphic rule; exactly `--count` of them, 5 when `--count` is absent. Quote the subject; under 300 characters (2026-09-28) |

```bash
npm run pipeline:discover   earth -- --count 5
npm run pipeline:discover   sports -- --count 3 --focus "Manchester City and the financial rules"
npm run pipeline:research   earth -- --candidate C-03
npm run pipeline:research   earth -- --candidate C-03 --model claude-opus-5 --effort medium
npm run pipeline:storyboard earth -- --slug glacier-lake-outburst
npm run pipeline:draft      earth -- --slug glacier-lake-outburst
```

A valued flag with nothing after it (`--effort` as the last word) is an
error, not a silent default.

The `--` after the npm script name is what passes the flags through.

---

## Full workflow (6 categories, one issue each)

Each category follows this linear gate structure. **You** hold two control
gates; agents do everything else.

```
npm run pipeline:discover <cat>
      ↓
YOU PICK 1 CANDIDATE   ← open research/<cat>/<date>-candidates.md
                          change status: open → status: chosen, save
      ↓
npm run pipeline:research <cat>
      ↓
YOU REVIEW DOSSIER     ← check [UNVERIFIED] items, confirm structural argument
      ↓
npm run pipeline:draft <cat>
      ↓
YOU REVIEW DRAFT       ← open src/content/issues/<slug>/index.mdx
                          fix structure, resolve EDITOR comments
      ↓
npm run pipeline:stylist <cat>
      ↓
YOU REVIEW VOICE       ← read mode assignment table in terminal output,
                          check before/after on key sections, tweak if needed
      ↓
npm run pipeline:verify <cat>
      ↓
YOU AUDIT + PUBLISH    ← read verification report, fix residual issues,
                          flip status: draft → published, git push
```

---

## Model assignments

Configured in `scripts/pipeline.config.ts` — change there to re-route, or pass
`--model <id>` / `--effort <level>` for one run. Current generation as of
2026-09-16 (both IDs verified live through the SDK that day; `claude-sonnet-5`
again through SDK 0.3.283 on 2026-09-28):

| Phase | Agent | Model | Effort | Stops at | Turn cap |
|---|---|---|---|---|---|
| discover | discovery | `claude-sonnet-5` | `medium` | $5 | 60 |
| research | researcher | `claude-sonnet-5` | `medium` | $12 | 90 |
| check | check (`.claude/agents/dossier-check.md`) | `claude-opus-5` | `high` | $3 | 20 |
| storyboard | composer | `claude-opus-5` | `high` | $5 | 60 |
| draft | drafter | `claude-opus-5` | `high` | $8 | 60 |
| panel | reader-panel | `claude-sonnet-5` — deliberately not the drafter's model | `medium` | $3 | 40 |
| stylist | stylist | `claude-opus-5` | `high` | $5 | 60 |
| verify | verifier | `claude-opus-5` | `high` | $5 | 70 |

**Effort and the hard stop (COST-PLAN CP-02 / CP-04, 2026-09-28).** `EFFORT`
passes the SDK's `effort` option per phase: the loops and the panel at
`medium`, the passes and the check at `high` (Opus 5 and Sonnet 5 default to
`high` anyway; the ledger now records the level). `MAX_BUDGET_USD` is the
SDK's `maxBudgetUsd`, a hard stop checked against the SDK's own cost estimate:
a run that reaches it ends with `error_max_budget_usd`, exits 3 and lands in
the ledger like any failed run. The caps sit above the worst September runs,
so a normal run never meets them. Effort is a trade: move a phase's level
only after one measured issue reads clean against the panel, the verifier's
untraced count, `check:prose` and the COST-PLAN §4.5 bar (CP-07). Opus 5.5
defaults to `medium`, but `EFFORT` says `high` for the passes, so an Opus 5.5
trial of a pass needs `--effort medium` as well as `--model claude-opus-5-5`.
COST-PLAN CP-10 puts the next research round on Opus 5 at `medium`; the pin
above is still the 2026-09-21 Sonnet ruling, so that round needs
`--model claude-opus-5` until the operator changes the pin.

**Split by the shape of the phase, not its importance** — the operator's
ruling of 2026-09-21 after the first measured round. The ledger showed where
a run's money goes: about 45% writing tool results to the prompt cache, 30%
re-reading the whole context on every turn, 20% output. A long loop (40–80
turns of searches and fetches) therefore costs by its length, and Opus made
every turn 2.5× dearer: discovery and research for six desks came to $65.91.
So the cheap model runs the loops (diligence — the operator picks the
candidate, the verifier catches what research missed) and the dear model
runs the short passes where the judgment lives. Both loop prompts now carry a
search / fetch budget, which saves more than the model swap, and every phase
has a `maxTurns` safety cap (`MAX_TURNS` in `pipeline.config.ts`; a capped
run exits 3 and still lands in the ledger). The panel stays on Sonnet so it
never judges its own prose, and a slightly less capable reader is the better
proxy for a cold one. The previous pins —
`claude-sonnet-4-6` and `claude-opus-4-1` — are a generation old, and Opus 4.1
**retired on 2026-08-05**: a draft or stylist run on the old config fails
with a model-not-found error. The runner names the model in that error now.

---

## What a run costs — measured, not estimated

Every `npm run pipeline:<phase>` appends one JSON line to
`research/_costs/ledger.jsonl`, **failed runs included**, tagged with the desk,
the issue slug, the phase, the agent and the model. The ledger is tracked in
git — it is the operator's cost record.

```bash
npm run pipeline:costs                        # per issue: each agent's runs, list and SDK cost, requests, tokens; subtotals; per-agent averages; grand total
npm run pipeline:costs -- --since 2026-09-16  # one round
npm run pipeline:costs -- --category earth    # one desk
npm run pipeline:costs -- --json              # the raw rows
npm run pipeline:costs -- --ledger <path>     # another ledger file (a copy, a test)
```

Discovery rows belong to the desk (slug `(discovery)`); every other row to
the issue whose dossier / storyboard / draft the phase worked on. Read the
report before quoting a per-issue figure anywhere — the estimates that used
to sit here were a generation of prices old.

For comparison, routing all agent work through Claude Pro would consume
roughly 2–4 hours of the 5-hour Pro usage limit window — leaving little
headroom for other work.

**What a row carries (COST-PLAN CP-01, 2026-09-28).** Two prices:

- `costUsd` (and its twin `costUsdList`) — the **list price** of every
  request the run made, main loop plus compaction, WebFetch / WebSearch
  helpers and any subagent, from the token split, the 5-minute / 1-hour
  cache split and the published rates in `scripts/lib/pricing.ts` (quoted
  there with the date they were read). Web searches add $10 per 1,000.
- `costUsdSdk` — the SDK's `total_cost_usd`, a client-side estimate from a
  table bundled into the SDK, kept for comparison. SDK 0.2.126 priced every
  cache write at the 5-minute rate and `claude-sonnet-5` at Opus 5 rates;
  0.3.283 matched the list price to the cent on the 2026-09-28 probe.

And the tokens: `inputTokens` · `cacheWriteTokens` (split as
`cacheWrite5mTokens` / `cacheWrite1hTokens`) · `cacheReadTokens` ·
`outputTokens` for the **main loop**; `modelUsage` for every request, per
model (`in`, `cw`, `cr`, `out`, `web`, `usdSdk`, `usdList`); `requests`, the
API requests the main loop made (not `turns`, which counts tool round trips —
a 65-turn research run made 31–47 requests); `firstRequestTokens`, the fixed
prefix every later request re-reads; `effort`, `maxBudgetUsd`, `sdkVersion`,
`cliVersion` and `sessionId` (the run's transcript is
`.claude-api-home/projects/D--SideProjects-parallax/<sessionId>.jsonl` on the
API route). A failed run adds `errorKind` / `error`; `denied` lists tool calls
the permission mode refused (each one a paid request); `instructionsLoaded`
appears only if a CLAUDE.md or rule reached the run, which the diet below
forbids. A run that dies without a result message is priced from the
per-request usage the stream carried, so it no longer lands at $0. Rows before
2026-09-28 carry only the SDK's estimate, in `costUsd`; the report shows it in
both columns and counts those rows.

## What a run's context contains — the harness diet (2026-09-28)

`scripts/lib/runner.ts` spawns the Claude Code CLI through the Agent SDK
(0.3.283) with COST-PLAN CP-02's diet. The measured first request fell from
**54.6k–58.5k tokens to 4.2k** (reader panel, 2026-09-28 probe): our agent
prompt and two tool schemas, nothing else.

- `settingSources: []` — no user, project or local settings: no root
  `CLAUDE.md` + `AGENTS.md` (about 31k tokens it used to add to every run),
  no nested `CLAUDE.md` or `.claude/rules/` on first read, no skills, no
  hooks, and none of the operator's 415 local allow rules (one of which,
  `Bash(npm run *)`, would have let an agent start a billing
  `npm run pipeline:*`). An `InstructionsLoaded` hook records any
  instruction file that still loads; the footer and the ledger row flag it.
- `tools` is the agent's frontmatter `tools:` list, and every other built-in
  is removed by bare-name `disallowedTools` (`Agent`/`Task`, `Bash`,
  `PowerShell`, `Edit` unless listed, `ToolSearch`, `Skill`, `TodoWrite`,
  the Task tools…). `allowedTools` alone only pre-approves; in September the
  agents called Bash 229 times and spawned one $2.2 subagent that way.
- `permissionMode: 'dontAsk'` — a call no rule approves is denied, not left
  waiting on a prompt nobody answers. Scoped grants come from `ALLOW` in
  `pipeline.config.ts` (the researcher: `Bash(pdftotext *)`) and from an
  agent's own `allow:` frontmatter field (for example
  `allow: Bash(npm run check:prose *)`); a rule's tool is made available to
  that agent and only matching commands run, plus the read-only commands
  (`ls`, `cat`, `grep`…) Claude Code never asks about. **Writes under
  `.claude/` are protected paths, which `dontAsk` always denies — agent-memory
  files included**, so memory upkeep belongs in the post-review pass
  (COST-PLAN CP-05), not in a run.
- Environment: `ENABLE_TOOL_SEARCH=false` (web tools load up front, no
  mid-run cache bust), `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`,
  `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`, `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`,
  `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1`, `CLAUDE_CODE_DISABLE_ATTACHMENTS=1`,
  `CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1`. Inherited variables that change what
  the CLI loads, caches or bills are stripped first (a terminal inside the
  Claude Code desktop app carries a dozen: session ids, a messaging socket,
  host auth refresh, `CLAUDE_EFFORT`…); on the API route every other
  `CLAUDE_*` / `ANTHROPIC_*` variable goes too, since `ANTHROPIC_AUTH_TOKEN`
  outranks the key and `CLAUDE_CODE_OAUTH_TOKEN` is a login. What stays is
  `ANTHROPIC_API_KEY` and the machine's plumbing (`CLAUDE_CODE_GIT_BASH_PATH`,
  the shell, the temp dir, TLS).
- `strictMcpConfig: true` — the CLI otherwise inherits every MCP server the
  desktop app registered on the machine (seven claude.ai connectors, 196 tool
  schemas instead of 28, measured 2026-09-16).
- `verbatimPrompts: true` — the prompt reaches the model as written: an
  `@path` inside inlined text is not expanded into a file read, and a line
  starting with `/` is not run as a command.
- The cache TTL is left at the CLI's default: **5 minutes on an API key**,
  1 hour on a subscription within plan usage. Nothing asks for an hour (on
  the API route it would add about $6.20 an issue), so an `api` run that
  writes 1-hour entries is not billing the key alone; the footer warns.
- Compaction: CLI 2.1.283 runs Opus 5, Opus 5.5 and Sonnet 5 on the 1M
  window and compacts only near 967k tokens, where 2.1.126 compacted at
  171k–184k. After the diet no September run would come near it.

---

## Environment variable setup

`.env.local` is gitignored (covered by the `*.local` rule in `.gitignore`).
Never commit your key.

The pipeline forcefully overrides `ANTHROPIC_API_KEY` from `.env.local`
at startup, because Claude Code itself sets this env var to its own session
token. Without the override, API calls would fail with an auth error.

If you see an auth error:
1. Check that `.env.local` exists and has the correct key.
2. Make sure the key starts with `sk-ant-api03-` (not a session token).
3. Verify the key at [console.anthropic.com](https://console.anthropic.com).

---

## File structure

```
scripts/
├── pipeline.ts          # CLI entry point — validation, pre-flight, colored output
├── pipeline.config.ts   # Models, effort, budgets, turn caps, tool grants (single source of truth)
├── pipeline-costs.mjs   # `npm run pipeline:costs` — the ledger report
├── lib/
│   ├── agent-loader.ts  # Parses .claude/agents/<name>.md YAML frontmatter (tools, allow)
│   ├── runner.ts        # Claude Agent SDK wrapper — the harness diet, streams tool calls, measures every request
│   ├── pricing.ts       # Published list rates per model, and the token-split → dollars function
│   └── prompts.ts       # Prompt builders with resolved file paths per phase
└── README.md            # This file
```

Agent definitions (the system prompts the pipeline uses) live in
`.claude/agents/` — `discovery.md`, `researcher.md`, `drafter.md`,
`stylist.md`, `verifier.md`. These are the same agents used by the slash
commands in Claude Code; the pipeline CLI simply calls them directly via the SDK.

The writing agents (composer, drafter, stylist, reader-panel, verifier) read
`research/_voice/_voice-core.md` v2 at runtime — the register contract: plain
Indian English, hand-held, a Hindi word only where it is the natural word,
the eight rhetorical jobs and the twenty-two AI tells. `mode-library.md` is
the deeper reference for the eight jobs and loses to the contract where they
disagree.

---

## Troubleshooting

**`ANTHROPIC_API_KEY is not set`**
→ `.env.local` is missing or has no `ANTHROPIC_API_KEY=` line.

**`No candidates file found in research/<cat>/`**
→ You haven't run `pipeline:discover` yet, or the output file is in the
wrong directory.

**`No candidate with status: chosen`**
→ Open the candidates file and change exactly one `status: open` to
`status: chosen`, then save — or pass `--candidate C-NN` and leave the file
alone (the second pick of a desk, in a two-per-desk round).

**`No dossier found in research/<cat>/ matching --slug <slug>`**
→ The slug is the dossier's, without the date: `glacier-lake-outburst`, not
`2026-09-16-glacier-lake-outburst`. `ls research/<cat>/*-dossier.md` shows them.

**`No dossier found in research/<cat>/`**
→ Run `pipeline:research` before `pipeline:draft`.

**`No draft issue found with topic: <cat>`**
→ Run `pipeline:draft` before `pipeline:verify`, or check that the MDX
frontmatter has `topic: <cat>` and `status: draft`.

**`No issue found with topic: <cat>`** (stylist phase)
→ Run `pipeline:draft` before `pipeline:stylist`. The stylist searches all
statuses (draft, review, published) so it can re-style an already-published
issue; the error means no issue with `topic: <cat>` exists at all.

**Auth error / 401**
→ Your `.env.local` key is expired or is a session token (starts with
`sk-ant-api01-` or similar). Generate a fresh key at console.anthropic.com.
The run exits 1 and still writes a (near-$0) ledger row.

**Out of credit / usage**
→ The row says `errorKind: "billing"` and the run exits 3. Top up the API
balance; do not switch to `--bill subscription` to finish a run.

**Rate limit / 429**
→ The runner exits with code 2 (the ledger row is written first). Wait a few
minutes and re-run. Sonnet has higher rate limits than Opus — consider
downgrading draft temporarily if hitting limits repeatedly.

**`stopped: the $N budget for <agent>`**
→ The run reached `MAX_BUDGET_USD` on the SDK's own estimate
(`error_max_budget_usd`). Check whether its output file was written, read the
row's `requests` and `denied`, and raise the cap in `pipeline.config.ts` only
if the run was doing real work.

**`denied: N call(s)`** in the footer
→ The agent reached for a tool its frontmatter does not grant, or wrote under
`.claude/` (a protected path `dontAsk` always refuses). Each denial is a paid
request. Fix the prompt, or add the tool to the agent's `tools:` / a scoped
rule to `allow:`; never grant a bare `Bash`.

**`warning: 1-hour cache writes on the API route`**
→ The CLI requests an hour only on a subscription login, so the run may not
have billed the key. Check console.anthropic.com, and that
`.claude-api-home/` holds no login.
