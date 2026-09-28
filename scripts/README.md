# Parallax pipeline CLI — operator guide

The scripts in this directory are the editorial pipeline. Every phase, from
discovery to the verifier, runs through `scripts/pipeline.ts`, whichever door
starts it. The agents' system prompts come from `scripts/agents/`, the
models, effort and budgets from `scripts/pipeline.config.ts`, and every run
appends its measured cost to `research/_costs/ledger.jsonl`.

---

## Two doors, one pipeline: which wallet a run bills

**Two doors, one pipeline (ruled 2026-09-28).** The API door is a terminal:
`npm run pipeline:<phase> <desk> -- <flags>` bills `ANTHROPIC_API_KEY`. The
Claude Code door is the slash command: `/pipeline-<phase> <desk> <flags>`
runs `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and
bills your Claude subscription. Same script, same agents, same
`scripts/pipeline.config.ts`: the door decides only which wallet pays, and
the ledger row's `billedTo` says which.

| Door | Start it with | What runs | Who pays | Cache writes |
|---|---|---|---|---|
| API | a terminal | `npm run pipeline:<phase> <desk> -- <flags>` | `ANTHROPIC_API_KEY` from `.env.local`, at API rates | 5-minute only |
| Claude Code | `/pipeline-<phase> <desk> <flags>` | `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` | the Claude plan: its own usage first, then extra usage at API rates | 1-hour, within the plan's usage |

- **The flag is the door, not the place you type it.** `--bill subscription`
  in a terminal bills the subscription too, and `npm run pipeline:<phase>`
  typed into Claude Code's shell without it bills the key. `--bill api` is
  the default. The slash commands refuse a `--bill` of their own.
- **Nothing else differs.** Both doors run the same agents under the same
  harness diet (below), with the same models, effort, budgets and turn caps,
  the same check round, stylist guard, dossier guard and Jev hooks, and they
  write the same ledger row. The credential is the one difference. On `api`
  the runner points the spawned CLI at an empty config directory
  (`CLAUDE_CONFIG_DIR=.claude-api-home/`, gitignored) and strips every other
  `CLAUDE_*` and `ANTHROPIC_*` variable, so the key is the only credential it
  can find. On `subscription` it leaves the machine's claude.ai login in
  place, which the CLI prefers over the key. `.env.local` must hold
  `ANTHROPIC_API_KEY` on both doors: the script checks for it before a run.
- **The price is the list price on both doors.** A row's `costUsd` is what
  its requests cost at the published rates. On the subscription door that is
  what the run would have cost on the key, 1-hour writes priced as such, not
  what the plan charged.
- **How to prove which credential paid.** The header's `bills to:` line
  names the door before anything is spent, and the row's `billedTo` records
  it (`api-key (isolated CLI)` or `subscription (--bill subscription)`). The
  cache split is the evidence. The CLI writes 5-minute cache entries on an
  API key and 1-hour entries on a subscription login within the plan's usage
  (its default: nothing in the runner asks for an hour). So an `api` row
  with any `cacheWrite1hTokens` means the login is back in the path, and the
  footer prints a warning. A `subscription` row with none ran on extra usage
  or was answered by the key: check the plan's usage page and
  console.anthropic.com. On 2026-09-28 all twelve `api` rows since the split
  was first recorded wrote 5-minute entries only. No `subscription` row has
  been written since then (the 26 of 2026-09-22 predate the split fields), so
  the first run through a slash command is the first reading.
- **Why this is written down.** The docs were wrong twice. Every run from
  2026-09-16 to 2026-09-22 05:40 UTC drew on the subscription while the SDK
  reported the key as its source, until the isolated config directory
  (`.claude/rules/pipeline-scripts.md`, "Which credential paid"). And the
  rules said the pipeline's agents never saw `CLAUDE.md`, when every run
  carried it and `AGENTS.md` until the diet of 2026-09-28. The old slash
  commands, which ran the agents inside Claude Code without the check pass,
  Jev or the ledger, are retired as a route: each is now a wrapper around the
  npm line above.

---

## Quick start

```bash
# 1. Copy the env template and paste your real Anthropic key
cp .env.example .env.local

# 2. Edit .env.local and replace the placeholder
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
JEV_API_KEY=your-openrouter-key   # optional: Jev, the pre-pass and the quiz grade

# 3. Install dependencies (if not already done)
npm install

# 4. Run a phase, on the API door (bills the key)
npm run pipeline:discover   earth
npm run pipeline:research   earth
npm run pipeline:check      earth
npm run pipeline:storyboard earth    # then flip the storyboard to Status: approved
npm run pipeline:draft      earth
npm run pipeline:panel      earth
npm run pipeline:stylist    earth
npm run pipeline:panel      earth    # the second pass
npm run pipeline:verify     earth

# 5. Or the same phase on the Claude Code door (bills the subscription)
/pipeline-draft earth                                # typed in Claude Code
npm run pipeline:draft earth -- --bill subscription  # what that command runs
```

---

## Commands

| Command | Phase | What it does |
|---|---|---|
| `npm run pipeline:discover <cat>` | 1 | Discovery agent surveys allowlisted sources, writes `research/<cat>/<date>-candidates.md` |
| `npm run pipeline:research <cat>` | 2 | Researcher agent deep-dives the chosen candidate, writes `research/<cat>/<date>-<slug>-dossier.md` |
| `npm run pipeline:check <cat>` | 2.2 | The dossier check pass (`scripts/agents/dossier-check.md`, COST-PLAN CP-09): recomputes every derived number, confirms the anchors, writes `research/<cat>/<date>-<slug>-check.md` with CLEAN / CORRECTIONS / BLOCKED. The script applies the report's corrections to the dossier (see [The check pass and the check round](#the-check-pass-and-the-check-round)) |
| `npm run pipeline:storyboard <cat>` | 2.5 | Composer agent maps every point the reader must get to the component that shows it (from all 98 kinds, by data shape), the word budgets, the head, the Indian ground and the three quiz questions → `research/<cat>/<date>-<slug>-storyboard.md`, `Status: draft`. **You flip it to `approved`** — the gate is `GATES.storyboard` in `pipeline.config.ts` (`'required'` now, `'auto'` later) |
| `npm run pipeline:draft <cat>` | 3 | Drafter agent executes the storyboard and writes the full MDX issue to `src/content/issues/<date-slug>/index.mdx` with `status: draft`. Refuses an unapproved storyboard while the gate is `'required'` |
| `npm run pipeline:panel <cat>` | 3.2 / 3.7 | Reader-panel agent reads the draft cold as four Indian reader personas, answers the storyboard's three questions from the draft alone, retells every section, quotes the sentence that lost each reader → `research/<cat>/<date>-<slug>-panel.md` with PASS / REVISE / BLOCK. Run after the draft and again after the stylist (the second pass writes `-panel-2.md`). Then the script runs the Jev quiz grade (see [Jev](#jev-the-decision-layer-cp-06)) |
| `npm run pipeline:stylist <cat>` | 3.5 | Stylist agent rewrites the prose into the runtime voice contract (`research/_voice/_voice-core.md` v2: plain Indian English, hand-held, a Hindi word only where it is the natural word) and assigns one rhetorical job per section. Facts and structured data untouched |
| `npm run pipeline:verify <cat>` | 4 | The Jev pre-pass first (`research/<cat>/<date>-<slug>-jevpass.md`, see [Jev](#jev-the-decision-layer-cp-06)), then the verifier agent audits every factual claim against the dossier and the register/composition flags, writes `research/<cat>/<date>-<slug>-verification.md` |
| `npm run jev:verify` · `jev:panel` · `jev:pilot` | — | Jev on its own: the pre-pass, the quiz grade, and Jev read against an issue already verified. Bills `JEV_API_KEY` only (see [Jev](#jev-the-decision-layer-cp-06)) |
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
| `--topup` | research, with `--slug` | top up the existing dossier named by `--slug` with what its check pass asked for (the publisher spread, missing or stale anchors, an `[UNVERIFIED]` with a named path), edited in place within a budget of 8 fetches and 6 searches, ending in a `## §N Top-up` section. Never a new dossier (2026-09-28) |
| `--dry-run` | all | assemble the prompt, print what it inlines and its size, and exit before the model: bills nothing, writes no ledger row. For the draft it also previews the check round, both the resumed form and the fallback. For the check pass it names the dossier section the corrections would land in (2026-09-28) |
| `--bill <api\|subscription>` | all | which wallet pays. `api`, the default, bills `ANTHROPIC_API_KEY` with the CLI isolated from the machine's login. `subscription` bills your Claude plan, and it is what every slash command passes. See [Two doors, one pipeline](#two-doors-one-pipeline-which-wallet-a-run-bills) (2026-09-28) |

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

The `--` after the npm script name is what passes the flags through. On the
Claude Code door the slash command takes the same flags without it:
`/pipeline-draft earth --slug glacier-lake-outburst`.

---

## The check pass and the check round

The passes after research are single-shot (COST-PLAN CP-03): the script
inlines every input, the agent answers once and writes one file, and
`scripts/lib/single-shot.ts` does what the agent no longer can. Two of those
steps changed after the trial issue (COST-PLAN §12.5, 2026-09-28).

**The check pass writes its report only.** `pipeline:check` recomputes the
dossier's derived numbers and anchors in a clean context and writes
`research/<cat>/<date>-<slug>-check.md`. It never writes the dossier. Its
corrections go in the report's §6 as one fenced JSON block,
`{"corrections":[{"section","was","now","why"}]}`, where `was` is the
dossier's exact text. After the run the script applies them to the dossier
as it stood before the run: each `was` found exactly once (as written, or
with its spaces matched across the dossier's line wraps) is replaced by its
`now`, and a correction whose text occurs nowhere or more than once, overlaps
another, touches a heading, or drops a URL or an `[UNVERIFIED]` marker is
refused and named. The dossier gains a final `## §N Check pass, <date>`
section listing what was applied and what was refused, N being the next free
number (§10 on a first pass, §12 after a `--topup` wrote §11), and it is
written only when the dossier guard finds every heading, URL and
`[UNVERIFIED]` marker still in place. Otherwise the dossier is left alone and
the corrected version is kept as `<dossier>.check-rejected.md`. A refused
correction, an unreadable §6 or a guard refusal ends the run with exit 4: the
report stands, and the operator applies what the script could not. Until the
trial the agent wrote the whole corrected dossier back, which was most of the
pass's $1.83 to $2.39, and the old guard refused any second pass outright
because it cut at the first `## §10` and counted §10 and §11 as lost.

**The draft's check round resumes the session.** After the drafter writes,
the script runs `check:prose` and the schema check on the file. When either
flags something, one more request carries the flags, now on the first run's
own session (the SDK's `resume`): the new prompt is the flags and the task,
1.7k characters on the trial issue against 192k for the fresh form, because
the transcript already holds the dossier, the storyboard, every reference
block and the first draft, and the prompt cache still holds them for five
minutes after the first run's last request. The saving is on the round's
first request. Its last request, after its own Write, still re-writes the
whole context when that Write took more than five minutes to generate, as
every long single-shot pass of the trial did. The
session's transcript lives under the billing route's config directory
(`.claude-api-home/projects/…` on `api`), which is why a resumed call uses the
same `--bill` and cwd. When the session cannot be resumed (no session id, or
the resumed call ends before its first request) the round runs as before, on
a fresh session with every input and the first draft inlined, after a
warning. Both runs land in one ledger row with `resumed: true` or `false`.
A resumed call's result counts the session's earlier spend too (CLI 2.1.277
and later restore it), so the runner takes the first run back out of it
before the two are added. Its `maxBudgetUsd` counts the call's own spend only.
`--dry-run` on the draft previews both forms of the round.

---

## Jev: the decision layer (CP-06)

Jev, TypeSafe AI's decision model, is a standing part of the pipeline by the
operator's ruling of 2026-09-28. It is not a language model: it answers one
typed question about one item with probabilities, never a sentence, and it
is pinned in `JEV_MODELS` (`scripts/lib/jev.ts`, `jev-1.13` through
OpenRouter). The pipeline runs its two jobs itself, on either door:

| Where it runs | What Jev does | Writes |
|---|---|---|
| `pipeline:panel`, after the panel's report | re-grades each persona's quiz answer against the storyboard's model answer (correct, partly, wrong, not in the draft), beside the panel's own grades | the panel report's name with `.jev.md` |
| `pipeline:verify`, before the verifier | scores every claim in the draft against the dossier's passages (supports, contradicts, says nothing). The verifier's prompt carries the report when it is newer than the draft, and the verifier spends its attention on the unsupported and contradicted claims | `research/<cat>/<date>-<slug>-jevpass.md` |

**A pre-pass, never a gate.** Jev orders the verifier's attention and gives
the quiz a second reading. The verifier and the panel own their verdicts.
Jev never does arithmetic, counting or dates, and it is never a security
boundary. A missing key, a module that does not load or a failed call
prints one `jev:` line, and the phase runs on without it. It spends no
Anthropic money.

**Measured on the trial issue (2026-09-28):** 71 calls, $0.0024 in all. The
pre-pass scored 47 claims against 179 dossier passages (24 confident
support, 1 contradicted, 22 low confidence) for $0.0019 in 30 seconds, and
the two quiz grades agreed with the panel on 11 of 12 answers each for
$0.0003. It changed no verdict. On two verified September issues the pilot
routed every ❌ row of the old verifier into the pre-pass's worklist
(COST-PLAN §12.4).

**Configuration** (`.env.local`, all optional): `JEV_API_KEY` (OpenRouter,
the default provider), `JEV_PROVIDER` (`openrouter` · `typesafe` ·
`compatible`), `TYPESAFE_API_KEY` (for `typesafe`), `JEV_BASE_URL` (for
`compatible`, with `JEV_KEY_VAR` and `JEV_MODEL`), and `JEV_THRESHOLD`, the
"confident" line, 0.90 by default (`JEV_THRESHOLD_VERIFY` and
`JEV_THRESHOLD_PANEL` set it per job). Every call, failed or not, appends a
line to `research/_costs/jev-ledger.jsonl`.

**On its own**, to re-run a job or to read Jev against an issue already
verified. These bill `JEV_API_KEY` only and exit 2 without it:

```bash
npm run jev:verify -- --slug <issue>                 # the pre-pass
npm run jev:panel  -- --slug <issue> --pass second   # the quiz grade on the -panel-2.md report
npm run jev:pilot  -- --slug <issue>                 # Jev against the verifier's own report
```

---

## Full workflow (one issue)

Each issue follows this linear gate structure. **You** hold the gates, and
agents do everything else. Every `npm run` line below is the API door. Its
Claude Code twin is `/pipeline-<phase> <cat>`, which runs the same line with
`--bill subscription`.

```
npm run pipeline:discover <cat>
      ↓
YOU PICK 1 CANDIDATE   ← open research/<cat>/<date>-candidates.md
                          change status: open → status: chosen, save
                          (or pass --candidate C-NN to research)
      ↓
npm run pipeline:research <cat>
      ↓
YOU REVIEW DOSSIER     ← check [UNVERIFIED] items, confirm structural argument
      ↓
npm run pipeline:check <cat>        CLEAN or CORRECTIONS: go on
                                    BLOCKED: research --topup --slug <s>, check again
      ↓
npm run pipeline:storyboard <cat>
      ↓
YOU APPROVE THE STORYBOARD   ← flip Status: approved
      ↓
npm run pipeline:draft <cat>        the check round runs inside it
      ↓
npm run pipeline:panel <cat>        the first pass, then the Jev quiz grade
      ↓
YOU REVIEW DRAFT       ← open src/content/issues/<slug>/index.mdx with the
                          panel report, resolve EDITOR comments
      ↓
npm run pipeline:stylist <cat>      behind the stylist guard
      ↓
npm run pipeline:panel <cat>        the second pass, then the Jev quiz grade
      ↓
npm run pipeline:verify <cat>       the Jev pre-pass, then the verifier
      ↓
YOU AUDIT + PUBLISH    ← read the verification report, run check:prose and
                          check:render, fix residual issues,
                          flip status: draft → published, git push
```

---

## Model assignments

**One config for both doors (the operator's ruling of 2026-09-28).** Every
run reads the table below, whichever door started it. The rule that the
Claude Code route ran every phase on Opus is retired: a slash command runs
the same script with the same models, effort and budgets, and only the
wallet differs.

Configured in `scripts/pipeline.config.ts` — change there to re-route, or pass
`--model <id>` / `--effort <level>` for one run. Current generation as of
2026-09-16 (both IDs verified live through the SDK that day; `claude-sonnet-5`
again through SDK 0.3.283 on 2026-09-28):

| Phase | Agent | Model | Effort | Stops at | Turn cap |
|---|---|---|---|---|---|
| discover | discovery | `claude-sonnet-5` | `medium` | $5 | 60 |
| research | researcher | `claude-opus-5` | `medium` | $12 | 90 |
| check | check (`scripts/agents/dossier-check.md`) | `claude-opus-5` | `high` | $3 | 20 |
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
COST-PLAN CP-10 (signed 2026-09-28) moved the researcher to Opus 5 at
`medium`, the pin above, with Opus 5.5 at `medium` as the next trial and the
Sonnet sweep plus Opus judge split as the fallback.

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
Since CP-10 the research loop runs on Opus 5 as well, so discovery and the
panel are the two phases left on Sonnet.

---

## What a run costs — measured, not estimated

Every `npm run pipeline:<phase>`, whichever door started it, appends one JSON
line to `research/_costs/ledger.jsonl`, **failed runs included**, tagged with the desk,
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

A run through the Claude Code door draws on the plan's usage instead of the
key, and its row carries the same list price: what the run would have cost
on the key (see [Two doors, one pipeline](#two-doors-one-pipeline-which-wallet-a-run-bills)).

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

And the door: `billedTo` is `api-key (isolated CLI)` or
`subscription (--bill subscription)`, the credential the run was pointed at.
Rows before 2026-09-22 05:40 UTC carry none, and they drew on the
subscription whatever they meant to do. The cache split beside it is the
evidence of which credential answered.

## What a run's context contains — the harness diet (2026-09-28)

`scripts/lib/runner.ts` spawns the Claude Code CLI through the Agent SDK
(0.3.283) with COST-PLAN CP-02's diet. The measured first request fell from
**54.6k–58.5k tokens to 4.2k** (reader panel, 2026-09-28 probe): our agent
prompt and two tool schemas, nothing else. The diet is the same on both
doors. Only the credential differs (above).

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

The key must be there on the Claude Code door too: the script checks for it
before a run, although the subscription pays.

**Jev (optional).** `JEV_API_KEY` in `.env.local` turns on the pre-pass and
the quiz grade (see [Jev](#jev-the-decision-layer-cp-06)). Without it both
are skipped with a `jev:` line and the phase runs on. `.env.example` lists
the other Jev variables, one comment line each.

---

## File structure

```
scripts/
├── pipeline.ts          # CLI entry point: validation, pre-flight, the steps around each pass, the footer, the ledger row
├── pipeline.config.ts   # Models, effort, budgets, turn caps, tool grants, the storyboard gate (one config, both doors)
├── pipeline-costs.mjs   # `npm run pipeline:costs`, the ledger report
├── jev-verify.ts        # `npm run jev:verify`, the Jev pre-pass on its own
├── jev-panel.ts         # `npm run jev:panel`, the Jev quiz grade on its own
├── jev-pilot.ts         # `npm run jev:pilot`, Jev read against an issue already verified
├── agents/              # The eight agent definitions, one <name>.md each (read by lib/agent-loader.ts)
├── lib/
│   ├── agent-loader.ts  # Parses scripts/agents/<name>.md YAML frontmatter (tools, allow)
│   ├── runner.ts        # Claude Agent SDK wrapper: the harness diet, the billing door, streams tool calls, measures every request
│   ├── pricing.ts       # Published list rates per model, and the token-split → dollars function
│   ├── prompts.ts       # Prompt builders with resolved file paths per phase
│   ├── assemble.ts      # Gathers and inlines each single-shot pass's inputs
│   ├── single-shot.ts   # The script's side of a pass: the check round, the guards, the check-pass corrections, the Jev hooks
│   ├── validate-issue.ts # The schema check the draft's check round runs, without an Astro build
│   ├── jev.ts           # The Jev client: the provider switch, the pin, the thresholds, the Jev ledger
│   ├── jev-verify.ts    # The claim pre-pass
│   └── jev-panel.ts     # The quiz grade
└── README.md            # This file
```

Agent definitions (the system prompts the pipeline uses) live in
`scripts/agents/`: `discovery.md`, `researcher.md`, `dossier-check.md`,
`composer.md`, `drafter.md`, `reader-panel.md`, `stylist.md`,
`verifier.md`. They moved from `.claude/agents/` on 2026-09-29 so Claude Code
lists none of them as a subagent type, and `.claude/agents/` keeps only
`voice-checker.md`, a read-only voice gate that is not a pipeline phase. The
runner loads them through the SDK on both doors. The slash commands in
`.claude/commands/` do not: since 2026-09-28 each one runs its phase's npm
line with `--bill subscription` and reports the footer. Spawning one of these
agents with the Agent tool was the retired route, outside the pipeline (no
check pass, no Jev, no ledger row). Run them through `scripts/pipeline.ts`,
by either door.

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
balance. Do not switch to `--bill subscription` to finish a run. On the
Claude Code door the same error means the plan and its extra usage are
spent, and the answer is the same: do not switch doors to finish the run.

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
