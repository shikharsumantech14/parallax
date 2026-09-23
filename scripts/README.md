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
| `--count <n>` | discover | surface exactly n candidates (1–10) instead of 5–10 |

```bash
npm run pipeline:discover   earth -- --count 5
npm run pipeline:research   earth -- --candidate C-03
npm run pipeline:storyboard earth -- --slug glacier-lake-outburst
npm run pipeline:draft      earth -- --slug glacier-lake-outburst
```

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
`--model <id>` for one run. Current generation as of 2026-09-16 (both IDs
verified live through the SDK that day):

| Phase | Agent | Model | Shape | Turn cap |
|---|---|---|---|---|
| discover | discovery | `claude-sonnet-5` | long tool loop | 60 |
| research | researcher | `claude-sonnet-5` | longest tool loop | 90 |
| storyboard | composer | `claude-opus-5` | short read-only pass | 40 |
| draft | drafter | `claude-opus-5` | short pass, one file out | 50 |
| panel | reader-panel | `claude-sonnet-5` — deliberately not the drafter's model | short | 40 |
| stylist | stylist | `claude-opus-5` | short, edit in place | 50 |
| verify | verifier | `claude-opus-5` | medium, read-only | 70 |

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
`research/_costs/ledger.jsonl`: the SDK's own `total_cost_usd`, the token
split (fresh input · cache write · cache read · output), web searches, turns
and wall-clock, tagged with the desk, the issue slug, the phase, the agent and
the model. The ledger is tracked in git — it is the operator's cost record.

```bash
npm run pipeline:costs                        # per issue: each agent's runs, cost, tokens; subtotals; per-agent averages; grand total
npm run pipeline:costs -- --since 2026-09-16  # one round
npm run pipeline:costs -- --category earth    # one desk
npm run pipeline:costs -- --json              # the raw rows
```

Discovery rows belong to the desk (slug `(discovery)`); every other row to
the issue whose dossier / storyboard / draft the phase worked on. Read the
report before quoting a per-issue figure anywhere — the estimates that used
to sit here were a generation of prices old.

Two things the footer's token line shows (measured 2026-09-16): every run
writes its first turn — the CLI's own prompt, the tool schemas, the agent
definition, ~35–50 K tokens — to a one-hour prompt cache and reads it after,
so a short run's cost is mostly that write; and the runner passes
`strictMcpConfig`, because the SDK's spawned CLI otherwise inherits every MCP
server the desktop app has registered on the machine (seven claude.ai
connectors, 196 tool schemas instead of 28) into each run's context.

For comparison, routing all agent work through Claude Pro would consume
roughly 2–4 hours of the 5-hour Pro usage limit window — leaving little
headroom for other work.

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
├── pipeline.config.ts   # Model assignments (single source of truth)
├── lib/
│   ├── agent-loader.ts  # Parses .claude/agents/<name>.md YAML frontmatter
│   ├── runner.ts        # Claude Agent SDK wrapper — streams tool calls, captures cost
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

**Rate limit / 429**
→ The runner exits with code 2. Wait a few minutes and re-run. Sonnet has
higher rate limits than Opus — consider downgrading draft temporarily if
hitting limits repeatedly.
