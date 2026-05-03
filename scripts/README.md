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
npm run pipeline:verify   earth
```

---

## Commands

| Command | Phase | What it does |
|---|---|---|
| `npm run pipeline:discover <cat>` | 1 | Discovery agent surveys allowlisted sources, writes `research/<cat>/<date>-candidates.md` |
| `npm run pipeline:research <cat>` | 2 | Researcher agent deep-dives the chosen candidate, writes `research/<cat>/<date>-<slug>-dossier.md` |
| `npm run pipeline:draft <cat>` | 3 | Drafter agent writes the full MDX issue to `src/content/issues/<date-slug>/index.mdx` with `status: draft` |
| `npm run pipeline:verify <cat>` | 4 | Verifier agent audits every factual claim against the dossier, writes `research/<cat>/<date>-<slug>-verification.md` |

Valid categories: `politics` · `space` · `earth` · `tech` · `travel` · `sports`

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
                          fix voice, flow, resolve EDITOR comments
      ↓
npm run pipeline:verify <cat>
      ↓
YOU AUDIT + PUBLISH    ← read verification report, fix residual issues,
                          flip status: draft → published, git push
```

---

## Model assignments

Configured in `scripts/pipeline.config.ts` — change there to re-route:

| Phase | Agent | Model |
|---|---|---|
| discover | discovery | `claude-sonnet-4-6` |
| research | researcher | `claude-sonnet-4-6` |
| draft | drafter | `claude-opus-4-1` |
| verify | verifier | `claude-sonnet-4-6` |

Drafting uses Opus because voice quality is the highest-value output of that
phase. All other phases are rule-following tasks where Sonnet is sufficient.

---

## Approximate cost per run (May 2026 rates)

| Phase | Model | Typical token range | Approx cost |
|---|---|---|---|
| discover | Sonnet | 30 K–80 K | $0.30–0.80 |
| research | Sonnet | 80 K–200 K | $0.80–2.00 |
| draft | Opus | 60 K–150 K | $3.00–7.50 |
| verify | Sonnet | 40 K–100 K | $0.40–1.00 |

**Full 6-category run (all four phases):** approximately $26–70 on the API.

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
`verifier.md`. These are the same agents used by the slash commands in
Claude Code; the pipeline CLI simply calls them directly via the SDK.

---

## Troubleshooting

**`ANTHROPIC_API_KEY is not set`**
→ `.env.local` is missing or has no `ANTHROPIC_API_KEY=` line.

**`No candidates file found in research/<cat>/`**
→ You haven't run `pipeline:discover` yet, or the output file is in the
wrong directory.

**`No candidate with status: chosen`**
→ Open the candidates file and change exactly one `status: open` to
`status: chosen`, then save.

**`No dossier found in research/<cat>/`**
→ Run `pipeline:research` before `pipeline:draft`.

**`No draft issue found with topic: <cat>`**
→ Run `pipeline:draft` before `pipeline:verify`, or check that the MDX
frontmatter has `topic: <cat>` and `status: draft`.

**Auth error / 401**
→ Your `.env.local` key is expired or is a session token (starts with
`sk-ant-api01-` or similar). Generate a fresh key at console.anthropic.com.

**Rate limit / 429**
→ The runner exits with code 2. Wait a few minutes and re-run. Sonnet has
higher rate limits than Opus — consider downgrading draft temporarily if
hitting limits repeatedly.
