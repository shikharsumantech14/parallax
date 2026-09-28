# Parallax pipeline: cost levers on the measured profile

Research report, 2026-09-27. Read-only. No pipeline phase, SDK call or API call was run.

Inputs: `scripts/lib/runner.ts`, `scripts/pipeline.ts`, `scripts/lib/prompts.ts`, `scripts/lib/agent-loader.ts`, `scripts/pipeline.config.ts`, `research/_costs/ledger.jsonl` (47 rows), the 53 run transcripts of the 2026-09-16 to 09-22 round in `C:\Users\user\.claude\projects\D--SideProjects-parallax\*.jsonl` (plus one subagent transcript), the two proof-run transcripts in `D:\SideProjects\parallax\.claude-api-home\projects\`, and the live docs and pricing pages cited inline. Every dollar figure below is list price unless marked as the ledger's.

**Per issue** means one run each of discovery, research, composer, drafter, stylist and verifier plus two reader-panel runs, using successful-run averages. Discovery is counted once per issue (halve its share when one desk yields two issues).

---

## 0. Summary

1. **The ledger's dollars are the SDK's own estimate, and SDK 0.2.126 misprices two things.** It prices every cache write at the 5-minute rate ($6.25/MTok on Opus 5) although all 53 subscription runs wrote 1-hour entries, and it prices `claude-sonnet-5` at Opus 5 rates. The reader panel shows $1.53 a run, while its true list cost is $0.61 at 5-minute writes and $0.79 at 1-hour.
2. **Neither 5-minute nor 1-hour pricing of the token columns reproduces $7.38 (researcher) or $6.71 (drafter).** The ledger equals the token columns at the 5-minute rate *plus* requests the token columns omit: compaction calls, WebFetch/WebSearch helper calls and, once, an unrequested subagent. Two runs with no compaction and no web tools match the 5-minute formula to the cent.
3. **Corrected baseline: $31.41 per issue on the API route** (list, 5-minute writes), $37.61 as actually run on the subscription's 1-hour cache. The ledger's $165 for six issues omits 11 failed runs whose tokens (about $37 at list) were spent.
4. **69 to 82% of every run's cache reads is content that is identical in every run of that phase.** The first request alone carries a 54.6k to 58.5k-token prefix that is re-read on every later request (49 to 61% of all reads). About 31k tokens of it is the repo's root `CLAUDE.md` + `AGENTS.md`, which `.claude/rules/pipeline-scripts.md` says the agents do not see. They do, because the runner omits `settingSources`.
5. **`allowedTools` does not restrict the tool set.** The agents called Bash 229 times (66 denied), PowerShell 16, ToolSearch 15, Agent once (a general-purpose Opus subagent, about $2.2), and inherit the operator's 415 local allow rules, including `Bash(npm run *)`, `Bash(git commit *)` and `Bash(git push *)`.
6. **Web results are a small share of research reads (7.6%).** Claude Code's WebFetch returns a small-model extract, not the page (26 fetches returned 24.5k characters in total). The web cost sits in the extra requests, the helper calls and one cache bust per run from loading the deferred web tools.
7. **The "short passes" are not short.** Composer, drafter, stylist and verifier take 18 to 41 API requests each and carry $19.19 of the $31.41. That is why moving them off the agent harness is the largest single lever.
8. **Largest levers per issue** (standalone, vs $31.41): passes to the Messages API with Batch $17.52 (56%). Harness diet (`settingSources: []`, a restricted tool set, no deferred-tool bust) $8.9 (28%). Haiku loops $7.83 (25%, high quality risk). Opus 5.5 for the passes $6.50 (21%). Sonnet loops (already ruled) $5.55 (18%). Stacked, the config-only free wins plus the ruled Sonnet move take the issue from $31.41 to about $18.3. With every step in §7 including the pass migration, it is about $5.9.

### Ranked by dollars saved per issue (standalone, API route, vs $31.41)

| # | Lever | $ / issue | % | Kind | Implementation risk |
|---|---|---|---|---|---|
| 1 | (vii) Passes + panel on Messages API, Batch | 17.52 (14.62 without Batch) | 55.8 | Architecture. Model unchanged | High |
| 2 | (v) Harness diet, realistic (prefix −75%, nested docs gone) | 8.88 | 28.3 | Free | Low |
| 2a | (v) as asked: first-call prefix −50% | 4.48 | 14.3 | Free | Low |
| 3 | (ii) Haiku 4.5 for discovery + research | 7.83 | 24.9 | Tradeoff, high quality risk | Low |
| 4 | (new) Opus 5 → Opus 5.5 for the four passes | 6.50 | 20.7 | Tradeoff (model swap) | Low to medium |
| 5 | (i) Sonnet 5 for discovery + research | 5.55 | 17.7 | Tradeoff, already ruled | Low (configured) |
| 6 | (iv) Halve API requests everywhere | 5.20 (4.17 with Sonnet loops) | 16.5 | Mostly free | Low to medium |
| 7 | (iii) effort `medium`, loops + panel | 1.59 to 3.67 (Opus loops) | 5 to 12 | Tradeoff | Low |
| 7b | (iii) effort `medium`, the four passes | 2.50 to 5.76 | 8 to 18 | Tradeoff, touches craft ruling | Low |
| 8 | (new) No in-run agent-memory upkeep | 3.16 | 10.0 | Tradeoff (memory freshness) | Low |
| 9 | (viii) Web reading outside the LLM | about 1.8 (1.4 with Sonnet loops) | 6 | Tradeoff | Medium to high |
| 10 | (new) `ENABLE_TOOL_SEARCH=false`: no deferred-tool cache bust | 0.88 (0.35 with Sonnet loops) | 2.8 | Free | Trivial |
| 11 | (new) Remove the Agent tool | 0.37 average (2.2 when it fires) | 1.2 | Free | Trivial |
| 12 | (vi) Context editing / compaction tuning | about 0 (±1) | 0 | Not a saving lever | n/a |
| 13 | 1-hour TTL on the API route | −6.20 (a cost increase) | −19.7 | Do not | n/a |

Standalone savings overlap. The stacked path is in §7.

---

## 1. What the runner passes to the SDK today (task 1)

**Versions.** `package.json` pins `"@anthropic-ai/claude-agent-sdk": "^0.2.126"`. `package-lock.json` resolves 0.2.126. Every transcript records the bundled CLI as `"version":"2.1.126"`. The current docs describe TypeScript SDK 0.3.x and CLI 2.1.2xx, so several options below carry version floors.

**The installed type definitions could not be read.** `.claude/settings.json` denies `Read(./**/node_modules/**)`, and the session's permission layer refused every read of `node_modules\@anthropic-ai\claude-agent-sdk\`. I did not work around the deny. The option inventory therefore comes from the current TypeScript reference plus behaviour observed in the transcripts. Before relying on `effort` or `maxBudgetUsd`, check them against `sdk.d.ts` in 0.2.126 or upgrade.

### Passed today (`scripts/lib/runner.ts` lines 92 to 106)

| Option | Value | Source |
|---|---|---|
| `prompt` | phase prompt from `scripts/lib/prompts.ts`, 700 to 1,000 characters | runner.ts:93 |
| `systemPrompt` | the agent `.md` body as a plain string, 5,201 to 15,496 characters | runner.ts:95, agent-loader.ts:33 |
| `allowedTools` | the frontmatter `tools:` list | runner.ts:96 |
| `model` | `CONFIG.models[agent]` or `--model` | runner.ts:97, pipeline.ts:227 |
| `cwd` | repo root | runner.ts:98 |
| `env` | `{...process.env, CLAUDE_CONFIG_DIR: '.claude-api-home'}` for `--bill api`, plain `process.env` for `--bill subscription` | runner.ts:85 to 89, 101 |
| `strictMcpConfig` | `true` | runner.ts:103 |
| `maxTurns` | 60 / 90 / 60 / 60 / 40 / 60 / 70 (discovery … verifier) | runner.ts:104, pipeline.config.ts:99 to 107 |
| `mcpServers` | only when passed. Nothing passes it since 2026-09-27 | runner.ts:105 |

The runner reads `total_cost_usd`, `num_turns` and `usage` from the result, and counts `WebSearch` / `WebFetch` tool_use blocks in the stream. It does **not** read `modelUsage`, the only field that itemizes spend outside the main loop.

### Not set, and what that did in the measured round

| Not set | Default that applied | Observed effect |
|---|---|---|
| `settingSources` | user + project + local | Root `CLAUDE.md` + `@AGENTS.md` (98,358 chars) in every first request, the skills listing (7.7k chars), SessionStart hook output, nested `research/AGENTS.md` and `.claude/rules/*.md` on first read in a subtree (plus `src/components/AGENTS.md`, 94k chars, when the drafter opened a component), and the 415 allow rules of `.claude/settings.local.json` |
| `tools` / `disallowedTools` | full built-in set, web tools deferred | Off-list calls: Bash 229 (66 denied), Edit 61 (22 denied), PowerShell 16 (15 denied), ToolSearch 15, Agent 1, TodoWrite 1. Each denied call still cost a full request |
| `agents` | built-in `general-purpose` subagent available | The travel researcher spawned one: Opus 5, 25 requests, 144k tokens written at 5 minutes, about $2.2 |
| `effort` | CLI default: `high` for Opus 5 and Sonnet 5 per current docs | Output is an estimated 60 to 80% thinking |
| `thinking` / `maxThinkingTokens` | adaptive | (`budget_tokens` is rejected on Opus 5 and Sonnet 5, so `effort` is the control) |
| `maxBudgetUsd` | none | Only `maxTurns` caps a run |
| `fallbackModel` | none | |
| `permissionMode` | `default`, no `canUseTool` | Calls that need approval and match no allow rule are denied after a paid request. Calls needing none (Agent, read-only Bash, reads) run |
| `hooks`, `outputFormat`, `betas`, `settings`, `skills`, `plugins`, `persistSession` | defaults | Transcripts are persisted, which is what made this measurement possible |
| env knobs | none set | `CLAUDE_CODE_EFFORT_LEVEL`, `ENABLE_TOOL_SEARCH`, `CLAUDE_CODE_PROMPT_CACHE_TTL`, `ENABLE_PROMPT_CACHING_1H`, `FORCE_PROMPT_CACHING_5M`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `CLAUDE_CODE_SUBAGENT_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL`, `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`, `CLAUDE_CODE_DISABLE_AUTO_MEMORY`, subagent depth/concurrency caps |

Cost-safety note from the same fact: because `settingSources` is omitted, a pipeline agent inherits `Bash(npm run *)` from the operator's local allowlist. It used that for `npm run check:prose`, but the same rule would let it start `npm run pipeline:*`, which bills.

---

## 2. What the SDK can do, from the docs (task 2)

| Question | Answer | How | Version note | Source |
|---|---|---|---|---|
| Set `effort`? | Yes | `Options.effort`: `'low' \| 'medium' \| 'high' \| 'xhigh' \| 'max'`. Per subagent: `AgentDefinition.effort`. Env: `CLAUDE_CODE_EFFORT_LEVEL` | Unset: "`high` on every model that supports effort, except that Opus 5.5 defaults to `medium`, Opus 4.7 defaults to `xhigh`" | [TS reference](https://code.claude.com/docs/en/agent-sdk/typescript), [agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop), [model config](https://code.claude.com/docs/en/model-config) |
| Set cache TTL? | Yes, by env var or setting, not by an option | Main conversation: `CLAUDE_CODE_PROMPT_CACHE_TTL` or `promptCacheTtl`. Subagents, compaction, titles: `CLAUDE_CODE_SUBAGENT_PROMPT_CACHE_TTL`. Also `ENABLE_PROMPT_CACHING_1H=1`, `FORCE_PROMPT_CACHING_5M=1`, `DISABLE_PROMPT_CACHING*` | The two TTL variables "require Claude Code v2.1.242 or later" (installed: 2.1.126) | [prompt caching](https://code.claude.com/docs/en/prompt-caching), [cost tracking](https://code.claude.com/docs/en/agent-sdk/cost-tracking) |
| Context editing? | **No.** There is no `context_management` option, so the API's `clear_tool_uses` edits are not reachable | | | [TS reference](https://code.claude.com/docs/en/agent-sdk/typescript) |
| Compaction? | Yes, automatic in the harness | `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (can only lower the threshold), `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `PreCompact` hook, sending `/compact` | Current docs: Opus 4.7 and later on the Anthropic API run the 1M window and compact "at about 967K tokens". CLI 2.1.126 compacted our Opus 5 runs at 171k to 184k | [agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop), [model config](https://code.claude.com/docs/en/model-config), [env vars](https://code.claude.com/docs/en/env-vars.md) |
| USD budget cap? | Yes | `maxBudgetUsd`: "Stop the query when the client-side cost estimate reaches this USD value." Ends with `error_max_budget_usd` | Subagent enforcement "require[s] Claude Code v2.1.217 or later" | [configuration](https://code.claude.com/docs/en/agent-sdk/configuration), [agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop) |
| Cheaper model for subagents? | Yes | `AgentDefinition.model` (`'haiku'`, `'sonnet'`, `'inherit'`, full ID). Env `CLAUDE_CODE_SUBAGENT_MODEL`. Background helpers: `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Depth/concurrency caps need TS SDK 0.3.219+ | [subagents](https://code.claude.com/docs/en/agent-sdk/subagents), [model config](https://code.claude.com/docs/en/model-config) |
| Restrict the tool set? | Yes | Bare-name `disallowedTools` "removes the tool from Claude's context". `allowedTools` only pre-approves: "Any other tool not listed in `allowed_tools` is still available to Claude" | | [permissions](https://code.claude.com/docs/en/agent-sdk/permissions) |
| Stop loading CLAUDE.md, skills, hooks? | Yes | `settingSources: []`. Auto memory needs `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | | [Claude Code features](https://code.claude.com/docs/en/agent-sdk/claude-code-features) |
| Load deferred tools upfront? | Yes | `ENABLE_TOOL_SEARCH=false`: "All tool definitions are loaded into context on every turn" | | [tool search](https://code.claude.com/docs/en/agent-sdk/tool-search) |

**5-minute or 1-hour writes?** The harness decides per request ([prompt caching](https://code.claude.com/docs/en/prompt-caching)):

| Request bucket | Claude subscription, within plan usage | Usage credits, API key, or cloud provider |
|---|---|---|
| Main conversation | One hour | Five minutes |
| Everything else (subagents, compaction, titles) | Five minutes, except the server-controlled helper requests, which get one hour | Five minutes |

Measured, not assumed: all 53 subscription transcripts show `ephemeral_1h_input_tokens` for 100% of main-loop writes and zero 5-minute writes. The API-key proof run `a5c57191` (Sonnet 5, one-word prompt, isolated config) wrote 51,369 tokens, all `ephemeral_5m`. The travel researcher's subagent wrote 144,428 tokens, all 5-minute. So the rules-doc line "every run writes its first turn (~35–50k tokens) to a one-hour cache" is right only on the subscription, and the first turn is 51k to 58.5k tokens.

**The cost field.** From [cost tracking](https://code.claude.com/docs/en/agent-sdk/cost-tracking): "The `total_cost_usd` and `costUSD` fields are client-side estimates, not authoritative billing data. The SDK computes them locally from a price table bundled at build time". The same page: `usage` "Counts only the top-level agent loop", while `total_cost_usd` and `modelUsage` include subagent requests.

---

## 3. Rates (task 3)

Source: [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing), where the pricing docs page now lives. `https://www.anthropic.com/pricing` answers 301 to [claude.com/pricing](https://claude.com/pricing), which lists Opus 5.5 as the latest model and Opus 5 as "Legacy".

| Model | Base input tokens | 5m cache writes | 1h cache writes | Cache hits and refreshes | Output tokens | Batch input / output |
|---|---|---|---|---|---|---|
| Claude Opus 5.5 | $4 / MTok | $5 / MTok | $8 / MTok | $0.20 / MTok | $20 / MTok | $2 / $10 |
| Claude Opus 5 | $5 / MTok | $6.25 / MTok | $10 / MTok | $0.50 / MTok | $25 / MTok | $2.50 / $12.50 |
| Claude Sonnet 5 | $2 / MTok | $2.50 / MTok | $4 / MTok | $0.20 / MTok | $10 / MTok | $1 / $5 |
| Claude Haiku 4.5 | $1 / MTok | $1.25 / MTok | $2 / MTok | $0.10 / MTok | $5 / MTok | $0.50 / $2.50 |

Verbatim, same page:

- Multipliers: "5-minute cache write | 1.25x base input price", "1-hour cache write | 2x base input price", "Cache read (hit) | 0.1x base input price (0.025x on Claude Fable 5.1 and Claude Mythos 5.1; 0.05x on Claude Opus 5.5)".
- "These multipliers stack with other pricing modifiers, including the Batch API discount and data residency."
- Batch: "The Batch API allows asynchronous processing of large volumes of requests with a 50% discount on both input and output tokens."
- Web search: "Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content."
- Web fetch: "The web fetch tool is available on the Claude API at **no additional cost**."
- Sonnet 5: "The $2/$10 per million input/output token pricing for Claude Sonnet 5 ... is now the standard price."
- Tokenizer: "Claude 4.7 and later models ... use a newer tokenizer ... This tokenizer produces approximately 30% more tokens for the same text." Haiku 4.5 is on the older one.
- Long context: "Claude 4.6 and later models ... include the full 1M token context window at standard pricing."

Two ratios drive the model levers. Sonnet 5 costs exactly 0.4x Opus 5 on every token class. Opus 5.5 costs 0.8x Opus 5 on input, writes and output but **0.4x on cache reads**, which matters on a read-heavy profile.

---

## 4. Reconciling $7.38 and $6.71 (task 4)

### The arithmetic

Researcher, average of the six ledger rows: W 307,835 · R 4,058,221 · O 52,106 · fresh input 75 · 14.3 web searches.

| Pricing | Cache writes | Cache reads | Output | Subtotal | + search fees |
|---|---|---|---|---|---|
| (a) 5-minute | 307,835 × $6.25 = $1.92 | 4,058,221 × $0.50 = $2.03 | 52,106 × $25 = $1.30 | **$5.26** | 14.3 × $0.01 = $0.14 → $5.40 |
| (b) 1-hour | 307,835 × $10 = $3.08 | $2.03 | $1.30 | **$6.41** | $6.55 |
| Ledger | | | | **$7.38** | |

Drafter, average of the three ledger rows: W 362,122 · R 3,933,498 · O 54,361.

| Pricing | Cache writes | Cache reads | Output | Subtotal |
|---|---|---|---|---|
| (a) 5-minute | $2.26 | $1.97 | $1.36 | **$5.59** |
| (b) 1-hour | $3.62 | $1.97 | $1.36 | **$6.95** |
| Ledger | | | | **$6.71** |

(All token counts divided by 10⁶.) **Neither reproduces either figure.** The drafter's (b) lands near $6.71 by coincidence.

### What does reproduce the ledger

`total_cost_usd` = (main-loop tokens with **every** write priced at the 5-minute rate) + (requests outside the main loop, which `usage` omits).

Proof from runs with no compaction and no web tools, which match formula (a) to the last digit even though their transcripts show 100% 1-hour writes:

- Composer, earth (ledger row 13): (36 × 5 + 158,190 × 6.25 + 1,997,614 × 0.50 + 34,239 × 25) / 10⁶ = **$2.8436495**. Ledger: $2.8436495.
- Verifier, earth (row 36): (36 × 5 + 141,364 × 6.25 + 2,166,140 × 0.50 + 38,682 × 25) / 10⁶ = **$2.933825**. Ledger: $2.933825.

The same test on the reader panel shows Opus rates on a Sonnet run. Row 22, transcript `9e105fb9`, `"model":"claude-sonnet-5"`: (6 × 5 + 107,300 × 6.25 + 174,915 × 0.50 + 22,834 × 25) / 10⁶ = **$1.3289625**, which is the ledger value. At Sonnet 5 list it is $0.53 (5-minute) or $0.69 (1-hour).

### What else is in the bill

| Item | Where it is | Size |
|---|---|---|
| Thinking tokens | Already inside `output_tokens`, billed at the output rate | An estimated 60 to 80% of output (output tokens minus visible tool-input and text characters at about 2.6 chars/token). Thinking is also carried back into context inside the loop: 4 to 5% of reads |
| Compaction requests | In `total_cost_usd`, not in `usage` | About $0.34 to $0.65 each (SDK-priced). 1.0 per research run, 2.0 per draft run |
| WebFetch / WebSearch helper requests | Same | About $0.6 to $0.9 per normal research run, $0.5 per discovery run, up to about $2.9 on the earth run (which fetched two large PDFs, not itemized) |
| Subagents | Same | One general-purpose Opus subagent in the travel research run, about $2.2 |
| Web search fees ($10 per 1,000) | Inside the helper requests, if the SDK prices them | $0.14 per research run, $0.20 per discovery run (the transcripts show 14 to 28 searches per discovery run. The ledger shows 0 because the stream counter came later) |

Residual over formula (a): researcher +$1.11 to +$4.28 (average +$2.13), drafter +$1.05 to +$1.26 (average +$1.12, two compactions).

### What each run really costs at list price

| Phase | Ledger | API route, 5-minute writes | As run, subscription 1-hour writes |
|---|---|---|---|
| Researcher | $7.38 | $5.26 + $2.13 = $7.39 | $6.41 + $2.13 = $8.54 |
| Drafter | $6.71 | $5.59 + $1.12 = $6.71 | $6.95 + $1.12 = $8.07 |
| Reader panel | $1.53 | $0.61 | $0.79 |

(Compaction and subagent requests are in the 5-minute bucket in both columns.) By luck, the ledger is a fair estimate of the API route for the Opus phases. It understates the subscription runs by about 16% and overstates the panel about 2.5x.

### Ledger caveats that move the baseline

- **Failed runs are recorded at $0 or not at all.** The SDK throws on an error result and the runner writes `costUsd: 0`. Eleven runs spent tokens that way: the tech composer (hit `maxTurns`), three drafts (politics, travel, sports: not in the ledger at all), three first-pass panels on 09-21 and four verifiers ("out of extra usage"). Their main-loop tokens are about $37 at 5-minute list: $4.99 + ($6.61 + $7.50 + $5.80) + ($0.49 + $0.46 + $0.43) + ($3.94 + $2.40 + $1.91 + $2.61).
- The given averages for composer ($3.61) and verifier ($1.60) include those $0 rows. Successful-run averages are $4.34 and $3.73.
- `num_turns` (research: 65) is not the request count. The research runs made 31 to 47 API requests (average 37.7).
- The config header's split ("45% cache writes, 30% cache reads, 20% output") is the 1-hour picture. On the API route the per-issue bill splits: writes $10.31 (33%), reads $9.01 (29%), output $6.95 (22%), requests outside the main loop $5.13 (16%).
- API-route risk not visible in these runs: 14 of 53 runs had one start-to-start gap over 300 s, most right after a 22k to 31k-token output (a dossier, storyboard, draft or rewrite being written), one spanning a compaction. On a 5-minute cache the next request re-writes the context unless a compaction follows anyway, about $0.6 to $1.0 on Opus. Expected under $1 per issue, well below the $6.20 per issue a 1-hour TTL would add. Keep 5 minutes.

### Corrected per-issue baseline (API route, 5-minute writes, list)

| Phase | Model | Writes | Reads | Output | Main loop | Outside loop | Per run | Runs | Per issue |
|---|---|---|---|---|---|---|---|---|---|
| Discovery | Opus 5 | 1.32 | 1.00 | 0.69 | 3.01 | 0.60 | 3.61 | 1 | 3.61 |
| Research | Opus 5 | 1.92 | 2.03 | 1.30 | 5.26 | 2.13 | 7.39 | 1 | 7.39 |
| Composer | Opus 5 | 1.49 | 1.16 | 1.21 | 3.86 | 0.48 | 4.34 | 1 | 4.34 |
| Drafter | Opus 5 | 2.26 | 1.97 | 1.36 | 5.59 | 1.12 | 6.71 | 1 | 6.71 |
| Reader panel | Sonnet 5 | 0.29 | 0.07 | 0.24 | 0.60 | 0.01 | 0.61 | 2 | 1.22 |
| Stylist | Opus 5 | 1.40 | 1.57 | 1.08 | 4.05 | 0.36 | 4.41 | 1 | 4.41 |
| Verifier | Opus 5 | 1.34 | 1.14 | 0.83 | 3.31 | 0.42 | 3.73 | 1 | 3.73 |
| **Total** | | | | | | | | | **31.41** |

As actually run on the subscription (1-hour writes): **$37.61**. The ledger's own view: $165 / 6 = $27.50.

---

## 5. Where the tokens go (measured from 53 transcripts)

### Per phase

| Phase | Runs | API requests | First-request prompt | Writes | Reads | Output | Compactions | Deferred-tool busts (tokens re-written) | Memory-only requests | Web fetch / search calls |
|---|---|---|---|---|---|---|---|---|---|---|
| Discovery | 6 | 20.3 | 56,475 | 210k | 2.01M | 28k | 0.2 | 1.0 (71k) | 0 | 4.8 / 20.2 |
| Research | 6 | 37.7 | 56,768 | 308k | 4.06M | 52k | 1.0 | 1.0 (81k) | 0 | 27.0 / 14.3 |
| Composer | 6 | 26.0 | 56,347 | 239k | 2.67M | 49k | 1.0 | 0 | 6.3 | 0 |
| Drafter | 6 | 40.5 | 58,500 | 372k | 4.34M | 65k | 2.2 | 0 | 7.0 | 0 |
| Reader panel | 16 | 4.4 | 54,569 | 112k | 0.30M | 23k | 0.1 | 0 | 0 | 0 |
| Stylist | 6 | 34.8 | 57,109 | 225k | 3.14M | 43k | 1.0 | 0 | 9.5 | 0 |
| Verifier | 7 | 18.3 | 58,156 | 186k | 1.91M | 34k | 1.0 | 0 | 5.6 | 0 |

Compaction fired at 171k to 184k tokens (`compactMetadata.preTokens`), so CLI 2.1.126 treated Opus 5 as a 200k window. Each fires a summary request and re-injects about 37k tokens of project context. The "deferred-tool bust" is the ToolSearch call that loads WebFetch and WebSearch (deferred in 2.1.126): the next request re-writes 66k to 90k tokens instead of reading them.

### What the cache reads are made of

Method: each request's prompt size (`input + cache_write + cache_read`) grows by the previous request's output plus the tool results and attachments appended in between, apportioned by characters. Each block is then counted once for every later request until the next compaction. The model reproduces the measured reads to within 2% in every phase.

| Share of cache reads (%) | Discovery | Research | Composer | Drafter | Panel | Stylist | Verifier |
|---|---|---|---|---|---|---|---|
| First-request prefix (tools, system prompt, CLAUDE.md block, listings) | 52.7 | 49.2 | 51.1 | 50.6 | 60.7 | 60.4 | 50.3 |
| Nested CLAUDE.md / rules loaded on first read | 9.8 | 8.4 | 11.3 | 10.8 | 12.1 | 8.4 | 17.8 |
| Standing reference files (allowlists, templates, voice core, catalog) | 12.8 | 12.1 | 4.7 | 5.5 | 9.1 | 4.2 | 0.4 |
| Agent-memory files | 0 | 0 | 6.5 | 2.2 | 0 | 3.8 | 5.0 |
| **Same in every run, subtotal** | **75.3** | **69.7** | **73.6** | **69.1** | **81.9** | **76.8** | **73.5** |
| Issue payload (candidates, dossier, storyboard, draft) | 1.7 | 6.0 | 11.9 | 13.0 | 14.9 | 8.7 | 14.1 |
| Web results (WebFetch + WebSearch) | 9.7 | 7.6 | 0 | 0 | 0 | 0 | 0 |
| Grep, Glob, RAG, other results | 7.0 | 8.2 | 6.9 | 3.7 | 0.4 | 1.7 | 2.4 |
| Model output carried (thinking, own writes, calls) | 6.1 | 7.3 | 5.3 | 7.9 | 2.7 | 5.6 | 7.2 |
| Compaction summaries | 0 | 0.8 | 2.3 | 6.4 | 0 | 7.0 | 2.8 |

### The fixed prefix, measured

The first request is 54,569 tokens (panel, body 5,201 chars) to 58,500 (drafter, body 15,496). Across the seven agents it fits `52.6k + body_chars / 2.62`, so about 52.6k tokens are the same for every agent. Its parts:

| Part | Characters | ÷4 tokens | Measured tokens | How measured |
|---|---|---|---|---|
| Tool schemas + Claude Code tool instructions + agent system prompt | | | 19,636 (researcher), 21,355 (drafter) | The part that stayed cached across a compaction, and that a parallel run of the same phase read at request 1 |
| Root `CLAUDE.md` (3,590) + `@AGENTS.md` (94,768) | 98,358 | 24.6k | about 31k | By difference: the first user turn is about 37k tokens and its visible parts are about 6k |
| Skills listing | 7,736 | 1.9k | | transcript attachment |
| Agent listing (exists because the Agent tool is loaded) | 7,550 | 1.9k | | transcript attachment |
| SessionStart hook brief, deferred-tool list, task prompt | about 2,600 | 0.7k | | transcript attachments |
| User auto memory `MEMORY.md` (subscription route only) | 2,114 | 0.5k | | file size |

Measured ratio on this markdown with the Opus 5 tokenizer: 2.5 to 2.8 characters per token for tool results (for example 107,146 characters appended cost 42,150 tokens), about 3.2 for `AGENTS.md`. The ÷4 rule understates by 25 to 50%, consistent with the pricing page's note that the newer tokenizer produces about 30% more tokens.

**Nested memory loaded on first read in a subtree:** `research/CLAUDE.md` → `research/AGENTS.md` (18,409) + `.claude/rules/editorial-voice.md` (5,201) = 23,888 chars (6.0k ÷4), reloaded after each compaction. `.claude/rules/issue-authoring.md` (3,154 chars, 0.8k) on touching an issue. In drafter runs that opened a component to check a data shape: `src/components/AGENTS.md` (94,162) + `design-tokens.md` (5,083) + `js-budget.md` (6,501) = 105,746 chars (26.4k ÷4, measured about 37k at the next request).

### Files each agent prompt tells it to read at start

| Agent | System prompt body | Standing reference reads named in Step 1 (chars, ÷4 tokens) | Agent memory ("consult it before you start") |
|---|---|---|---|
| Discovery | 11,116 (2.8k) | `_sources/_TAXONOMY.md` 9,236 (2.3k), `_sources/<category>.md` 17,914 to 22,957 (avg 20,165, 5.0k), `_templates/candidate.md` 2,523 (0.6k), `catalog-shapes.md` 11,794 (2.9k), `PROJECT-GRAPH.md` 13,214 (3.3k, one section read) | none |
| Researcher | 11,396 (2.8k) | `_TAXONOMY.md` 9,236 (2.3k), `<category>.md` avg 20,165 (5.0k), `_templates/dossier.md` 2,513 (0.6k), `jargon.md` 12,787 (3.2k), catalog blocks for each proposed kind (about 1.5 to 4k chars each), `PROJECT-GRAPH.md` ledger section. Payload: the candidates file (about 23k) | none |
| Composer | 10,532 (2.6k) | `_voice-core.md` 29,700 (7.4k), `catalog-shapes.md` 11,794 (2.9k), `catalog.md` 106,567 (26.6k, read by grep), `_templates/storyboard.md` 5,023 (1.3k), `config.ts` 13,131 (3.3k), `CANON.md` 20,038 (5.0k, §2 and §3), `PROJECT-GRAPH.md` ledger, the round's other storyboards §9. Payload: dossier 37k to 48k | `agent-memory/composer/` 52,851 (13.2k) |
| Drafter | 15,496 (3.9k) | `_voice-core.md` 29,700 (7.4k), `hinglish-lexicon.md` 4,971 (1.2k), `jargon.md` 12,787 (3.2k), `config.ts` 13,131 (3.3k), `_template/index.mdx` 1,110 (0.3k), catalog blocks for every kind in the storyboard (10k to 20k). Payload: dossier about 47k, storyboard about 30k | `agent-memory/drafter/` 67,461 (16.9k) |
| Reader panel | 5,201 (1.3k) | `_voice-core.md` 29,700 (7.4k). Payload: storyboard 30k to 45k, draft 15k to 18k | none |
| Stylist | 11,063 (2.8k) | `_voice-core.md` 29,700 (7.4k), `hinglish-lexicon.md` 4,971 (1.2k), `jargon.md` 12,787 (3.2k), `mode-library.md` 50,514 (12.6k). Payload: issue about 15k, storyboard, panel report about 10k | `agent-memory/stylist/` 75,406 (18.9k) |
| Verifier | 13,646 (3.4k) | `_voice-core.md` 29,700 (7.4k), `hinglish-lexicon.md` 4,971 (1.2k). Payload: draft about 15k, dossier 37k to 48k, storyboard 25k to 45k | `agent-memory/verifier/` 82,222 (20.6k) |

Adding it up, a drafter run carries about 58.5k (first request) + 6.8k (nested research docs and rule) + up to 37k (component docs) + about 20k (reference reads) + about 13k (memory files) of content that does not depend on the issue, before it reads the dossier.

In dollars per issue on the API route: the first-request prefix costs about $4.73 in reads and $4.23 in writes (initial write, re-injection after each compaction, deferred-tool busts), **$8.96 or 28.5% of the bill**. By its share of the prefix (about 31k of 57k), the root `CLAUDE.md` + `AGENTS.md` alone accounts for roughly $4.9 per issue. Nested project docs add about $1.4.

---

## 6. The levers (task 5)

Each lever is costed standalone against the §4 baseline ($31.41). API route, list prices, 5-minute writes.

### (i) Discovery + researcher on Sonnet 5 (ruled 2026-09-21, not yet run)

Assumption: Sonnet 5 takes the same requests and tokens (same tokenizer generation). Main-loop tokens and compaction/subagent requests scale by 0.4. Web helper requests are assumed to stay on the small helper model and do not change.

- Discovery: $3.01 × 0.4 = $1.20, + helpers $0.49, + compaction $0.11 × 0.4 = $0.04 → $1.74 (was $3.61, **−$1.87**)
- Research: $5.26 × 0.4 = $2.10, + helpers $1.26, + (compaction $0.50 + subagent $0.37) × 0.4 = $0.35 → $3.71 (was $7.39, **−$3.68**)
- **Total −$5.55 per issue (17.7%).** Risk: Sonnet may take more turns. Measure the first round.

### (ii) Discovery + researcher on Haiku 4.5

Assumption: Haiku costs 0.2x Opus 5 per token, and the same text is about 1/1.3 the tokens on its older tokenizer, so the effective factor is 0.2 / 1.3 = 0.154.

- Discovery: $3.01 × 0.154 = $0.46 + helpers $0.49 + $0.02 → $0.97 (**−$2.64**)
- Research: $5.26 × 0.154 = $0.81 + helpers $1.26 + $0.13 → $2.20 (**−$5.18**)
- **Total −$7.83 (24.9%), only $2.28 more than Sonnet.**

Caveats. The window is 200k. Our research contexts peak at 145k to 184k Opus tokens (about 112k to 140k Haiku tokens) before compaction, and the fixed prefix alone would be about 44k Haiku tokens (22% of the window). Haiku 4.5 takes no `effort` parameter (thinking uses `budget_tokens`). The live guide measures Haiku 4.5 at "63% accuracy compared with 92% for Opus 5.5" on GPQA Diamond at about a fifth of the cost per question ([optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)). A 38-request loop that must anchor on primary sources, balance tiers and capture data for four drawn graphics is judgment-heavy. One Sonnet re-run of research ($3.71) erases 1.6x the extra saving. Recommend Haiku only for mechanical sub-steps, which it already does as the WebFetch helper.

### (iii) `effort` on the loop phases

Available as `Options.effort` (current docs, unverified in 0.2.126) or `CLAUDE_CODE_EFFORT_LEVEL` through `env`. The default is `high` on Opus 5 and Sonnet 5. Published measurements from the [live guide](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence):

- Research and knowledge work (Fable 5): "`low` gave up 1 to 3 points for a third to a half off the cost per task, `medium` matched the default's accuracy at about 70% to 87% of its cost".
- Agentic coding (Opus 5.5 on SWE-bench Pro): "about 2.5 points lower at its default, `medium`, for about 70% of the cost, and about 8 points lower at `low` for about a third of the cost".

On our profile, `medium` saves 13 to 30% of a phase:

- Loops on Opus: $11.00 × 13 to 30% = **$1.43 to $3.30**. On Sonnet: $5.45 × 13 to 30% = $0.71 to $1.63
- Panel: $1.22 × 13 to 30% = $0.16 to $0.37
- The four passes: $19.19 × 13 to 30% = $2.50 to $5.76, but these are the craft and brand-protection phases

The mechanism fits this profile. Output is an estimated 60 to 80% thinking, and thinking is carried as context (4 to 5% of reads), so lower effort cuts both output and later reads, and usually requests. The pipeline already has an eval harness for a sweep: panel verdict and quiz scores, verifier untraced-claim count, `check:prose` flags. Changing effort mid-session invalidates the cache, so set it once per run.

### (iv) Halving API requests: batching tool calls, tighter budgets

Reads scale with requests × average context (research: 107.6k tokens re-read per request). Assumption: halving requests halves reads and trims output 10% (less per-turn thinking and preamble). Writes stay (the same content is appended once).

| Phase | Reads × 0.5 | Output × 0.1 | Saving |
|---|---|---|---|
| Discovery | $0.50 | $0.07 | $0.57 |
| Research | $1.01 | $0.13 | $1.14 |
| Composer | $0.58 | $0.12 | $0.70 |
| Drafter | $0.98 | $0.14 | $1.12 |
| Panel ×2 | $0.07 | $0.05 | $0.12 |
| Stylist | $0.79 | $0.11 | $0.89 |
| Verifier | $0.57 | $0.08 | $0.65 |
| **Total** | | | **$5.20 (16.5%). $4.17 with Sonnet loops** |

Where the requests go today: research makes about 41 web calls across 37.7 requests (1.1 per request), so telling it to issue independent fetches in one turn (3 to 4 per turn) is free. Composer, drafter, stylist and verifier spend 5.6 to 9.5 requests per run only on agent memory (lever 8 below) and 2 to 5 per run on denied off-list tool calls. A tighter fetch budget (27 → 15) also cuts helper spend by about $0.24 a run, at some risk to the source-spread floors (8 sources, 5 publishers).

### (v) Shrinking the fixed per-run prefix by 50%

Formula per phase: 0.5 × [reads × prefix share × read rate + (first-request prefix + compactions × 37k re-injected + busts × 37k) × write rate].

Research: 0.5 × [4,058,221 × 0.492 × $0.50 + (56,768 + 37,000 + 37,000) × $6.25] / 10⁶ = 0.5 × ($0.998 + $0.817) = **$0.91**.

| Phase | −50% prefix | Realistic (prefix −75%, nested docs gone) |
|---|---|---|
| Discovery | $0.58 | $1.07 |
| Research | $0.91 | $1.72 |
| Composer | $0.59 | $1.20 |
| Drafter | $0.91 | $1.86 |
| Panel ×2 | $0.19 | $0.38 |
| Stylist | $0.77 | $1.47 |
| Verifier | $0.55 | $1.18 |
| **Total** | **$4.48 (14.3%)** | **$8.88 (28.3%)** |

(With Sonnet loops: $3.59 and $7.21.)

Why −75% is reachable with options alone:

- `settingSources: []` drops the root `CLAUDE.md` + `AGENTS.md` (about 31k), the skills listing (about 2.4k), the hook brief, and all nested `CLAUDE.md`/rules loading (8 to 18% of reads, up to 37k tokens in a drafter run). Add `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` on the subscription route.
- Bare-name `disallowedTools` for everything outside the frontmatter list (`Agent`, `Bash`, `PowerShell`, `TodoWrite`, `NotebookEdit`, `Skill`, …) removes those schemas and the agent listing (about 2.4k). Tools + system should fall from about 20k to about 8 to 10k.
- Result: about 57k → 10k to 14k.

What must be carried over so this stays free: inline `.claude/rules/issue-authoring.md` (3,154 chars) into the drafter, stylist and verifier prompts. If the drafter and stylist should keep running `npm run check:prose`, pass `allowedTools: [..., 'Bash(npm run check:prose *)']` with `permissionMode: 'dontAsk'` instead of the inherited `Bash(npm run *)`. The project hooks lost are the SessionStart brief, the git/render/generated guards (the agents neither commit nor touch generated files) and `gate-registry`, which only fires on the five registry files the pipeline never edits. A smaller prefix also means fewer runs reach the 171k to 184k compaction point, which is not counted here.

A cheaper variant of the same idea: fold the standing reference files (voice core, lexicon, jargon, templates) into `systemPrompt`. They become part of the cached system layer, shared by the six parallel desk runs of a phase, and the 2 to 4 start-up Read requests disappear. That is worth roughly $0.1 to $0.2 a run.

### (vi) Context editing and compaction

The SDK has no `context_management` option, so the API's context editing is not available. The harness already compacts 1.0 to 2.2 times per run. Each compaction costs about $0.34 to $0.65 (SDK residual) plus a re-write of 44k to 55k tokens (about $0.30), and avoids roughly its own cost in later reads. Net about $0 (±$1 per issue). The live guide agrees that the win depends on the run: "context editing cost 74% more" on the 20-issue run, while "the prune saved 39% and compaction 32%" on the long run.

Recommendation: not a saving lever here. It is a quality lever. The drafter compacted twice mid-draft, and a smaller prefix (lever v) keeps runs under the threshold. **Upgrade warning:** current CLIs run Opus 5 with the 1M window and compact at about 967K, so after an SDK upgrade these runs stop compacting. Tail reads rise, compaction calls vanish, and the net is roughly neutral. Pin the old behaviour with `CLAUDE_CODE_AUTO_COMPACT_WINDOW` if wanted, and re-measure.

### (vii) Passes on the Messages API with the Batch discount

**Feasibility.** All five passes read local files and write one file. None uses the web. The tool loop is doing five jobs today, and each has a single-shot replacement:

| Job the loop does today | Single-shot replacement |
|---|---|
| Read the inputs | `pipeline.ts` already locates every file. Assemble them into the request |
| Grep the catalog for kinds | Parse the storyboard's kind column and send those `## <kind>` blocks (the composer gets `catalog-shapes.md` plus the catalog) |
| Drafter self-checks via `npm run check:prose` | The script runs `check:prose` and the schema build, then sends a second request with the flags |
| Stylist edits in place | Return structured `{section, field, newText}` edits. The script applies them and can reject any edit that touches a data field, a stronger guard than the prompt |
| Agent-memory upkeep | Separate pass (lever 8) |

Batch is single-shot, and results arrive "any time within 24 hours" (typically minutes). Each pass is followed by an operator review anyway, so Batch fits the loop boundaries. Batch "takes 50% off every token of a request, including cached ones" ([live guide](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)).

**Cost.** Inputs are the named files, at 2.7 chars/token. Outputs are the visible artifact plus 20k to 30k thinking tokens at the default effort (today's passes emit 33k to 65k output tokens across 18 to 41 requests).

| Pass | Input (chars → tokens) | Output tokens | Cost | Batch | Today |
|---|---|---|---|---|---|
| Composer (Opus 5) | prompt 11,078 + dossier 47,000 + catalog-shapes 11,794 + full catalog 106,567 + template 5,023 + kinds list 3,000 + CANON §2 and §3 8,000 + ledger 4,000 + round's §9s 9,000 + memory digest 10,000 = 215,462 → 79.8k | 31,000 | 79.8k × $5 + 31k × $25 = $1.17 | $0.59 | $4.34 |
| Drafter (Opus 5) | 16,006 + 47,000 + 30,500 + 29,700 + 4,971 + 12,787 + 13,131 + 1,110 + 15,000 catalog blocks + 15,000 memory digest + 3,154 rule = 188,359 → 69.8k | 35,500, × 1.5 rounds | ($0.35 + $0.89) × 1.5 = $1.85 | $0.93 | $6.71 |
| Stylist (Opus 5) | 11,552 + 15,000 + 29,700 + 4,971 + 12,787 + 50,514 + 30,500 + 12,000 + 10,000 = 177,024 → 65.6k | 30,500 | $0.33 + $0.76 = $1.09 | $0.55 | $4.41 |
| Verifier (Opus 5) | 14,447 + 15,000 + 47,000 + 30,500 + 29,700 + 4,971 + 10,000 = 151,618 → 56.2k | 32,400 | $0.28 + $0.81 = $1.09 | $0.55 | $3.73 |
| Panel ×2 (Sonnet 5) | 5,671 + 15,000 + 30,500 + 29,700 = 80,871 → 30.0k | 23,000 | 2 × ($0.06 + $0.23) = $0.58 | $0.29 | $1.22 |
| **Total** | | | **$5.79 (−$14.62, 46.6%)** | **$2.89 (−$17.52, 55.8%)** | **$20.41** |

Cross-request cache hits are not counted, so this is conservative. With Opus 5.5 on the four passes, the batch total falls to about $2.39.

**Quality.** The models do not change, so the operator's routing rulings hold. The context is small, never compacts and carries no `AGENTS.md`. The loss is mid-pass lookups: the drafter today greps components it did not anticipate (it read `DescentProfile.astro` in one run). The mitigations are pre-assembly and the check round. Implementation risk is the highest of all levers: new orchestration code, single-shot prompt redesign, output parsing and validation. The Messages API also offers task budgets, which the SDK does not. The live guide measured "A generous budget cut cost per task 44% for about 3 points of pass rate" on Fable 5.1.

### (viii) Web reading outside the LLM

**Measured from the six research transcripts: web tool results are 7.6% of the researcher's 4.06M cache reads, about 0.31M tokens** ($0.15 at the Opus read rate, $0.06 on Sonnet). All tool results together (reference files 12.1%, payload 6.0%, web 7.6%, grep/glob 4.9%, RAG 1.8%, other 1.5%) are 33.9%, about 1.38M tokens. The sports run returned 69,641 chars of Read results but only 24,455 chars from 26 WebFetch calls, about 940 chars each. Claude Code's WebFetch sends the page to a small helper model and returns its answer, so raw pages never enter the main context.

The web cost is elsewhere:

- helper requests, about $0.6 to $0.9 a normal run (not itemized, because the runner does not record `modelUsage`)
- about 25 loop requests, each re-reading about 110k tokens: about $1.4 on Opus, $0.55 on Sonnet
- one deferred-tool bust: $0.47 on Opus

A deterministic stage (fetch the candidate's cited URLs and allowlist searches, readability-extract, triage passages with a cheap classifier, hand the researcher a 30k-token evidence pack) could cut web-loop requests from about 25 to 8 and helper spend by about 70%.

Research arithmetic on Opus: 17 fewer requests × 110k × $0.50 = $0.94, + 0.7 × $1.26 = $0.88, − pack (30k written at $6.25 = $0.19, read by 15 later requests at $0.23) = $0.42, − triage 1.5M tokens × $0.04 = $0.06 → **$1.34**. Discovery about $0.49. **Total about $1.8 per issue ($1.4 with Sonnet loops).**

The $0.04/MTok classifier rate (TypeSafe's Jev) is the caller's figure. I did not verify that product or its price. Risk is medium to high: choosing the primary anchor is the researcher's core judgment. Most of this saving is available more cheaply from levers (iv), 10 and a fetch budget.

### New lever 8: no in-run agent-memory upkeep

Composer, drafter, stylist and verifier are told "Consult it before you start and update it when you finish". The transcripts show requests whose only tool calls touch `.claude/agent-memory/`: composer 6.3 per run ($1.03), drafter 7.0 ($0.59), stylist 9.5 ($0.71), verifier 5.6 ($0.59). Memory-file content re-read by other requests adds $0.24. **Total $3.16 per issue (10.0%).**

Alternative: a short curated digest in the system prompt (cached) and memory updates moved to an explicit, cheap post-review pass. The trade is memory freshness, under the CD-12 ruling. The tech composer's `error_max_turns` on 09-21 happened in exactly this upkeep, after its storyboard was written.

### New lever 10: load web tools upfront (`ENABLE_TOOL_SEARCH=false`)

One bust per discovery and research run: 71,307 × ($6.25 − $0.50) = $0.41, and 81,092 × $5.75 = $0.47. **Total $0.88 per issue on Opus, $0.35 on Sonnet**, plus one fewer ToolSearch request, and none again after each compaction. Free. Pair it with the restricted tool list so upfront loading stays small.

### New lever 11: remove the Agent tool

`disallowedTools: ['Agent']` or `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`. The one unrequested general-purpose subagent cost about 144,428 × $6.25 + 1,647,649 × $0.50 + about 20k × $25 = $2.2, which is **$0.37 per issue** averaged over six research runs. It also removes the agent listing from every prefix. The docs note Opus 5 "delegates to subagents more readily than earlier models", and that the anti-delegation line exists only in the `claude_code` preset, which a custom `systemPrompt` string drops. Free.

### New lever 12: Opus 5.5 for the four passes

Opus 5.5 costs 0.8x Opus 5 on writes and output and 0.4x on reads. Per pass, (W × 5 + R × 0.2 + O × 20) / (W × 6.25 + R × 0.5 + O × 25) = composer 0.680, drafter 0.659, stylist 0.645, verifier 0.663. Savings: $1.39 + $2.29 + $1.57 + $1.26 = **$6.50 per issue (20.7%)** at equal tokens. Opus 5.5 also defaults to `medium`, and "In Anthropic's testing, Opus 5.5 at `medium` matches or exceeds Opus 5 at `high` on coding and knowledge-work evaluations" ([model config](https://code.claude.com/docs/en/model-config)).

For the loops, Sonnet 5 stays cheaper (research main loop $2.10 on Sonnet 5 vs $3.39 on Opus 5.5). Needs a CLI/SDK that knows the model. 0.2.126 will at least misprice it in the ledger, as it does Sonnet 5. The panel stays on a different model from the drafter, as ruled.

---

## 7. Ranking, free vs tradeoff, and the operator's rulings (task 6)

### The rulings in `scripts/pipeline.config.ts` (header, unchanged)

- "Split by the SHAPE of the phase, not its importance ... So the cheap model runs the loops and the dear model runs the passes."
- "discovery / researcher → Sonnet 5 ... Diligence, not craft; the operator picks the candidate and the verifier catches what research missed. Both prompts now carry a fetch / search budget — the trajectory length was the bigger cost than the model."
- "composer / drafter / stylist / verifier → Opus 5. Short passes with few or no tool calls: the storyboard is the diversity lever, the draft and the stylist are craft, the verifier is brand protection and fetches nothing."
- "reader-panel → Sonnet, and deliberately NOT the drafter's model: a model judging its own prose flatters it by 10–25% (REGISTER-PLAN §10.4)."
- "Cost: ESTIMATES belong nowhere — every run appends its actual dollars and tokens to research/_costs/ledger.jsonl".
- And from `CLAUDE.md`: the Claude Code route pins every phase to Opus. Everything here concerns the API route only.

Two measurements bear directly on these rulings. First, the passes are not "few or no tool calls": they take 18 to 41 requests and $19.19 of $31.41 per issue. Second, the ledger's "actual dollars" are the SDK's bundled-table estimate, mispriced as shown in §4.

### Free, no quality trade

| Lever | $ / issue | Notes |
|---|---|---|
| (v) Harness diet (`settingSources: []`, restricted tools, inline two rules) | 4.48 to 8.88 | The rules doc already assumes the agents do not see `CLAUDE.md` |
| 10 `ENABLE_TOOL_SEARCH=false` | 0.88 (0.35) | |
| 11 No Agent tool | 0.37 | Also closes the inherited `Bash(npm run *)` path, a cost-safety fix |
| (iv) part: batch independent fetches in one turn, stop denied off-list calls | about half of 5.20 | Prompt and `permissionMode: 'dontAsk'` changes |
| Keep the 5-minute TTL on the API route | avoids +6.20 | Do not set `ENABLE_PROMPT_CACHING_1H` |
| Measurement: record `modelUsage`, price tokens from the published table using `usage.cache_creation`'s 5m/1h split, write ledger rows for failed runs from transcript totals, check against the Usage and Cost Admin API | 0 | Makes the next round's numbers true |

### Tradeoffs (need a sweep against panel + verifier + `check:prose`)

| Lever | $ / issue | Ruling touched |
|---|---|---|
| (i) Sonnet loops | 5.55 | Already ruled. Measure its first round |
| (iii) `medium` on loops + panel | 0.87 to 2.0 (on Sonnet loops) | Consistent with "diligence, not craft" |
| (iii) `medium` on the passes | 2.50 to 5.76 | Craft and brand-protection ruling |
| 12 Opus 5.5 passes | 6.50 | Pins `claude-opus-5` for the passes. The successor model, vendor-reported equal or better at `medium` |
| 8 No in-run memory upkeep | 3.16 | CD-12 agent memory |
| (ii) Haiku loops | 7.83 | Goes past the ruling. High risk to dossier quality |
| (viii) Web outside the LLM | about 1.4 to 1.8 | Research judgment |
| (vii) Messages API + Batch | 14.62 / 17.52 | Keeps every model ruling. Architecture risk |

### Stacked path (each step acts on what the earlier steps left)

| Step | Per issue | Cumulative saving |
|---|---|---|
| 0 Baseline (API route, 5-minute, list) | $31.41 | |
| 1 + tool search off, Agent tool removed | $30.16 | 4% |
| 2 + harness diet (prefix −75%, nested docs gone) | $21.59 | 31% |
| 3 + Sonnet loops (ruled) | $18.28 | 42% |
| 4 + no in-run memory upkeep | $17.21 | 45% |
| 5 + batched web calls in the loops (−40% requests) | $16.91 | 46% |
| 6 + `medium` on loops + panel | $15.56 to $16.32 | 48 to 50% |
| 7a + Opus 5.5 on the four passes | about $12.6 | 60% |
| 7b or + passes and panel on Messages API + Batch (Opus 5 / Sonnet 5) | about $5.9 ($5.4 with Opus 5.5) | 81 to 83% |

Order of work follows the cost-optimization guidance: free wins first (steps 1, 2, 5 and the measurement fixes), then the ruled model move, then effort and model tradeoffs one at a time against the eval, and the architecture change last. On the subscription route the same levers cut plan usage rather than dollars. The 09-22 runs hit "out of extra usage", and the subscription's 1-hour writes make every written token 1.6x dearer in usage terms.

---

## 8. Method and limits

- **Not verified:** the installed SDK's `Options` type (node_modules read denied by the project's own settings). WebFetch/WebSearch helper, compaction and subagent spend are inferred as `total_cost_usd` minus the token columns, because the runner does not record `modelUsage`. The earth researcher's +$2.9 web residual is not attributable further. The $0.04/MTok classifier price is the caller's.
- **Transcript identity:** 53 main runs matched to phases by their first prompt. Ledger rows matched by timestamp, and every ledgered run's transcript totals equal its ledger tokens exactly. One general-purpose subagent transcript (`db3bff05…/subagents/agent-aa7dfe96a39504c0e.jsonl`). Two proof runs in `.claude-api-home` (one had zero requests).
- **Token/char ratio:** measured 2.5 to 2.8 chars/token for tool results and about 3.2 for `AGENTS.md` on the Opus 5 tokenizer. The ÷4 figures in §5 are the rule of thumb the brief asked for.
- **Scenario estimates** (effort, halving requests, Messages API outputs, evidence pack) are planning numbers with their assumptions stated. Validate each against the panel, verifier and `check:prose` on a couple of issues before adopting it.
- **Reproducible:** the analysis scripts are in `C:\Users\user\AppData\Local\Temp\claude\D--SideProjects-parallax\02113c33-9eda-4193-b5b5-7f47aec6a4ac\scratchpad\`: `ledger-fit.mjs`, `index.mjs`, `analyze.mjs`, `attrib.mjs`, `gaps.mjs`, `memcalls.mjs`, `offlist.mjs`, `levers.mjs`, `stack.mjs`. They read the transcripts and the ledger only.
- **No project file was changed.**
