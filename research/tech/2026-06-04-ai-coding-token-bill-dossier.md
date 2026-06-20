# Dossier: The Bill Came Due in April

- **Category:** tech
- **Candidate:** C-01
- **Researched:** 2026-06-04
- **Researcher:** researcher-agent
- **Status:** ready-for-draft

---

## 1. Structural argument (the Parallax take)

Every headline says AI is getting cheaper, and the rate cards prove it: the
price of a million tokens has fallen by more than an order of magnitude in
three years, and a query that cost dollars in 2023 now costs cents. The reader
walks in believing the obvious corollary — that an AI budget should be
*shrinking*. The structural truth is the opposite, and it is a scissor. Price
per token is one blade, falling. Tokens consumed per task is the other blade,
rising faster — because the industry crossed a threshold in November 2025 where
coding *agents* (not chatbots) became good enough to use as daily drivers, and
an agentic task burns vastly more tokens than a chat turn: it loops, re-reads
the whole codebase on every step, calls tools, and runs reasoning traces, so a
single Codex run can consume well over a million tokens where a chat reply
consumes a few thousand. Multiply a unit price that halves each year by a unit
count that climbs an order of magnitude, and the product — the actual invoice —
goes *up*. That is why Uber, having budgeted for 2026 against last year's
cheaper-per-token mental model, exhausted its entire annual AI budget in four
months and now caps every engineer at $1,500 a month per coding tool. The
mechanism the issue exposes: "cheaper AI" is a per-unit claim, and the business
pays per-task. The two diverged the moment the tools stopped being things you
talk to and started being things that work for you.

---

## 2. Why now

On **2 June 2026**, Bloomberg's Natalie Lung reported that Uber is limiting
every employee to **$1,500 in monthly token spending per AI coding tool** —
separate budgets for each tool — after the company **exhausted its entire 2026
AI budget in four months**. Simon Willison relayed and analysed the report on
**3 June 2026**, noting the cap alone, assuming an engineer uses two tools,
works out to roughly **11% of a median Uber software engineer's ~$330,000 total
compensation**. The cap applies specifically to *agentic* coding software —
Cursor and Anthropic's Claude Code — not to chat assistants, which is the whole
point: it is the agentic class of tool that broke the budget. The event lands in
the same fortnight that Willison's broader writing dates the coding-agent
"daily-driver" crossover to a **November 2025** inflection, and one week after
his 27 May post arguing the labs have found product-market fit precisely *because*
these tools "burn vastly more tokens." Uber is the first named institution to
hit the wall publicly; the unit economics say it will not be the last.

---

## 3. Timeline of events

Chronological. Every entry fact-checked and sourced inline.

| Date | Event | Source |
|---|---|---|
| 2023 (ref) | Claude 3 Haiku launches at $0.25 / $1.25 per million input/output tokens — the cheap-per-token baseline readers anchor on | [Simon Willison — llm-pricing tag](https://simonwillison.net/tags/llm-pricing/) |
| 2025-08-07 | GPT-5 ships at $1.25 input / $10 output per million tokens; sets the frontier price point for the coming agent wave | [Simon Willison — llm-pricing tag](https://simonwillison.net/tags/llm-pricing/) |
| 2025-08 | Anthropic's enterprise plan still framed as "Claude seats include enough usage for a typical workday" (flat-rate mental model) | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| 2025-11-19 | GPT-5.1 Codex Max ships — specialised coding variant | [Simon Willison — 5-minute LLMs](https://simonwillison.net/2026/May/19/5-minute-llms/) |
| 2025-11-24 | Claude Opus 4.5 ships; combined with GPT-5.1 and their coding harnesses, marks the **November 2025 inflection**: coding agents go "from often-work to mostly-work" | [Simon Willison — 5-minute LLMs](https://simonwillison.net/2026/May/19/5-minute-llms/) |
| 2025-11 | Anthropic changes enterprise terms to "$20/seat/month plus API pricing" — usage now metered (announced 2026-04-14) | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| late 2025 → 2026 | Companies set 2026 AI budgets against the cheaper-per-token, lighter-usage reality of mid-2025 | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| 2026-04-02 | OpenAI moves Codex pricing "to align with API token usage, instead of per-message pricing" | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| 2026-04-16 | Claude Opus 4.7 ships at ~1.4× the effective cost of Opus 4.6 (tokenizer inflation at identical rate card) | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) · [Claude token counts](https://simonwillison.net/2026/apr/20/claude-token-counts/) |
| 2026-04-23 | GPT-5.5 ships at "2x the API price of GPT-5.4" — a price *increase* at the frontier | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| ~2026-04 | Uber's 2026 AI budget is **exhausted four months into the year** (implied by the four-month claim in the 2 June report) | [Bloomberg via Simon Willison](https://simonwillison.net/2026/Jun/3/uber-caps-usage/) |
| ~2026-05-14 | Goldman Sachs Research publishes projection: AI token consumption to grow **24× by 2030**, to ~120 quadrillion tokens/month | [Goldman Sachs](https://www.goldmansachs.com/insights/articles/ai-agents-forecast-to-boost-tech-cash-flow-as-usage-soars) |
| 2026-05-27 | Willison documents his own 30-day usage: **$2,180.16** of tokens at API rates, paid **$200** via subscriptions; argues labs found product-market fit | [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) |
| 2026-06-02 | Bloomberg (Natalie Lung) reports Uber's **$1,500/month-per-tool** cap | [Bloomberg via Simon Willison](https://simonwillison.net/2026/Jun/3/uber-caps-usage/) |
| 2026-06-03 | Willison publishes his analysis: cap ≈ 11% of ~$330K median comp; calls it "a rational policy response to over-spending" | [Simon Willison — Uber caps usage](https://simonwillison.net/2026/Jun/3/uber-caps-usage/) |

---

## 4. Key facts & data

Every number that may appear in the issue. Each sourced. Uncertainty marked
explicitly.

### The scissor — the load-bearing reframe

- **Per-token price, falling (one blade):** Claude 3 Haiku launched at
  **$0.25 / $1.25** per million input/output tokens; the modern Claude Haiku 4.5
  is **$1 / $5**, GPT-5 is **$1.25 / $10**, GPT-5-mini/nano **$0.05 / $0.40**,
  Gemini 3.1 Flash-Lite **$0.25 / $1.50**, Grok 4 Fast **$0.20 / $0.50**. Frontier
  capability that cost dollars per million tokens in 2023 now costs cents. —
  [Simon Willison — llm-pricing tag](https://simonwillison.net/tags/llm-pricing/)
- **Spend-per-task, rising faster (other blade):** Uber's entire 2026 AI budget
  was consumed in **four months**, forcing a hard per-engineer cap. —
  [Bloomberg via Simon Willison](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)
- **The net effect is a price increase where it matters most:** GPT-5.5 (23 Apr)
  costs **2×** the API price of GPT-5.4; Claude Opus 4.7 (16 Apr) costs **~1.4×**
  Opus 4.6 in practice. At the frontier, per-token price is now *rising*, not
  falling. — [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/)

### Uber (the anchor institution)

- **The cap:** "$1,500 in monthly token spending per AI coding tool" per
  employee, separate budgets per tool, applies to agentic tools (Cursor, Claude
  Code) only. — [Bloomberg via Simon Willison](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)
- **Budget burn-down:** entire 2026 AI budget exhausted in **four months**. —
  [Bloomberg via Simon Willison](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)
- **Comp ratio:** median Uber US software-engineer total comp ≈ **$330,000**
  (Levels.fyi, cited by Willison); the cap (two tools → ~$36,000/yr) ≈ **11%**
  of that. — [Simon Willison — Uber caps usage](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)
  - *Caveat:* the $330K figure is Levels.fyi data quoted by Willison, not a
    company disclosure; the 11% is Willison's arithmetic (assumes 2 tools).
    Present as "by Willison's estimate / on Levels.fyi data," not as Uber's own
    number.

### Tokens-per-task (the multiplier — the scaling story)

- **A single agentic coding query, real measurement:** one of Willison's GPT-5
  Codex tasks generated **169,818 input + 17,112 output + 1,176,320 cached
  tokens** — i.e. well over a million tokens for one task. This is the verified
  top of the per-task range. — [Simon Willison — llm-pricing tag](https://simonwillison.net/tags/llm-pricing/)
- **Why agents burn so much:** coding agents "maintain state by replaying entire
  conversations with each new prompt, causing input token growth over time";
  "as a conversation gets longer, each prompt becomes more expensive since the
  number of input tokens grows every time." Tool calls and reasoning loops
  multiply this. — [Simon Willison — how coding agents work](https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/)
- **Qualitative multiplier (Willison's framing):** the new tools "burn vastly
  more tokens" than chat; heavy LLM users were burning "an order of magnitude
  less" tokens six months ago. Willison does **not** state a precise "5×–30×"
  figure. — [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/)
- **5×–30× token multiplier (chat turn vs agentic session):** **[UNVERIFIED]** —
  this specific numeric range surfaced only via non-allowlisted aggregators. The
  *direction* (agents burn vastly more; ~order of magnitude) is verified on
  Willison; the precise 5–30× band is not. Use the verified order-of-magnitude
  language, or present 5–30× as an illustrative range explicitly flagged.
- **Tokens-per-task range "5,000 → 1,000,000":** the **1M ceiling is verified**
  (Willison's Codex query above). The **5,000 floor** (a typical chat turn) is a
  reasonable estimate but is **[UNVERIFIED]** against an allowlisted source —
  treat the floor as illustrative.

### Tokenizer inflation (price rises hidden inside "same rate card")

- Opus 4.7 vs 4.6, same $5/$25 rate card, but more tokens for identical input:
  system prompt **7,335 vs 5,039 tokens (1.46×)**; a high-res test image
  **4,744 vs 1,578 tokens (3.01×)**; a 30-page PDF **60,934 vs 56,482 (1.08×)**.
  Net effective cost rise ≈ **40%** at an unchanged price card. —
  [Simon Willison — Claude token counts](https://simonwillison.net/2026/apr/20/claude-token-counts/)
- Anthropic's own statement: "the same input can map to more tokens — roughly
  1.0–1.35× depending on the content type." Willison's system-prompt test
  (1.46×) exceeded that range. — [Simon Willison — Claude token counts](https://simonwillison.net/2026/apr/20/claude-token-counts/)

### The arbitrage that hides the bill from individuals

- **Willison's 30-day usage:** **$1,199.79** (Anthropic Claude Code) + **$980.37**
  (OpenAI Codex) = **$2,180.16** worth of tokens at API rates, for which he paid
  **$200** ($100 Anthropic Max + $100 OpenAI Pro). The subscription masks the
  true token cost from the individual — which is exactly why per-seat enterprise
  spend surprises finance. — [Simon Willison — product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/)

### The macro projection (where the curve goes)

- **Goldman Sachs Research:** global AI token consumption to grow **24× by 2030**,
  reaching ~**120 quadrillion tokens per month**, driven by always-on agents.
  Analyst: Jim Schneider, Goldman Sachs Research; report ~mid-May 2026. —
  [Goldman Sachs](https://www.goldmansachs.com/insights/articles/ai-agents-forecast-to-boost-tech-cash-flow-as-usage-soars)
  - *Sourcing note:* the goldmansachs.com primary page timed out / is JS-gated on
    repeated WebFetch attempts; the 24× and 120-quadrillion figures and the
    analyst name were confirmed via a secondary that quotes the report, and match
    the candidate brief. The Goldman URL is the primary citation. See researcher
    notes on allowlist status.
- **Goldman 55×-by-2040 and 60–70% annual inference-cost decline:**
  **[UNVERIFIED]** — appear only in non-allowlisted secondary summaries; not
  confirmable from the excerpt I could read. Cite only the 24×/2030 figure unless
  the editor accesses the full Goldman report.

### Other unit-economics figures from the candidate brief

- **Blended cost of intelligence $18.40/M → $6.07/M tokens year-over-year:**
  **[UNVERIFIED]** — this figure did not appear in *any* search or allowlisted
  source. It traces to a non-allowlisted aggregator (the candidate flagged
  Vantage / Stanford Digital Economy Lab as likely origin). **Do not use** unless
  the editor can source it to a primary report. The price-drop story is fully
  carryable on the verified rate-card ladder above without this number.
- **Microsoft cancelling Claude Code licenses (E+D division, by 30 June 2026,
  pushing engineers to GitHub Copilot CLI; per-engineer cost reportedly reached
  ~$2,000/month):** **[UNVERIFIED]** against the allowlist. The story is real and
  widely reported, but only on non-allowlisted aggregators (The Decoder,
  opentools.ai, etc.) tracing to a paywalled Bloomberg/Business Insider original.
  Willison's 2 June "Microsoft's new MAI models" post does **not** cover it.
  **Do not present as a Parallax-sourced fact.** If the editor confirms via
  Bloomberg, it is a powerful second institutional data point alongside Uber.

---

## 5. Key quotes

Verbatim only. All from allowlisted sources (Willison) except where noted.

> "$1,500 in monthly token spending per AI coding tool ... The limits ... only
> apply to agentic coding software such as Cursor or Anthropic PBC's Claude Code."
> — Bloomberg News (Natalie Lung), 2 June 2026, quoted in [Simon Willison, 3 June 2026](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)

> "a rational policy response to over-spending"
> — Simon Willison, on Uber's cap, [3 June 2026](https://simonwillison.net/2026/Jun/3/uber-caps-usage/)

> "Tools which burn vastly more tokens, but are also quickly becoming daily
> drivers for the work carried out by extremely well-compensated professionals"
> — Simon Willison, [27 May 2026](https://simonwillison.net/2026/May/27/product-market-fit/)

> "That's $2,180.16 worth of tokens for $200—not bad at all!"
> — Simon Willison, on his own 30-day usage, [27 May 2026](https://simonwillison.net/2026/May/27/product-market-fit/)

> "companies surprised at how expensive their LLM bills are becoming from usage
> by their staff"
> — Simon Willison, [27 May 2026](https://simonwillison.net/2026/May/27/product-market-fit/)

> "Coding agents went from often-work to mostly-work, crossing a quality barrier
> where you could use them as a daily-driver to get real work done"
> — Simon Willison (on the November 2025 inflection), [19 May 2026](https://simonwillison.net/2026/May/19/5-minute-llms/)

> "OpenAI and Anthropic had spent most of 2025 running Reinforcement Learning
> from Verifiable Rewards to increase the quality of code written by their models"
> — Simon Willison, [19 May 2026](https://simonwillison.net/2026/May/19/5-minute-llms/)

> "Delivering new code has dropped in price to almost free ... but delivering
> _good_ code remains significantly more expensive than that."
> — Simon Willison, [Agentic Engineering Patterns: "Writing code is cheap now"](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)

> "If you can go from producing 200 lines of code a day to 2,000 lines of code a
> day, what else breaks?"
> — Simon Willison, [6 May 2026](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/)

---

## 6. Primary source documents

| Document | Publisher | URL | Notes |
|---|---|---|---|
| "Uber Caps Usage of AI Tools Like Claude Code to Manage Costs" | Simon Willison's Weblog | https://simonwillison.net/2026/Jun/3/uber-caps-usage/ | **The anchor.** Relays Bloomberg's 2 Jun report (Natalie Lung) + Willison's analysis. Allowlisted. Carries the $1,500 cap, the four-month burn, the $330K comp + 11% ratio. |
| "I think Anthropic and OpenAI have found product-market fit" | Simon Willison's Weblog | https://simonwillison.net/2026/May/27/product-market-fit/ | **Second pillar.** Nov-2025 inflection; "burn vastly more tokens"; $2,180.16-for-$200; pricing migration to token-metering; "companies surprised." Allowlisted. |
| "The last six months in LLMs in five minutes" | Simon Willison's Weblog | https://simonwillison.net/2026/May/19/5-minute-llms/ | Nov-2025 "often-work to mostly-work" crossover; RLVR driver; Opus 4.5 / GPT-5.1 Codex Max dates. Allowlisted. |
| Simon Willison — llm-pricing tag index | Simon Willison's Weblog | https://simonwillison.net/tags/llm-pricing/ | Per-token rate-card ladder across models; the 169,818+17,112+1,176,320-token Codex query; long-context tiered pricing. Allowlisted. |
| "Claude Token Counter, now with model comparisons" | Simon Willison's Weblog | https://simonwillison.net/2026/apr/20/claude-token-counts/ | Tokenizer-inflation measurements (1.46× / 3.01× / 1.08×; ~40% effective rise). Allowlisted. |
| "Writing code is cheap now" (Agentic Engineering Patterns) | Simon Willison's Weblog | https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/ | The cost-shift quote (cheap to write, expensive to make *good*). Allowlisted. |
| "How coding agents work" (Agentic Engineering Patterns) | Simon Willison's Weblog | https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/ | Mechanism of token growth: replay of full conversation, caching, tool loops. Allowlisted. |
| "AI Agents Forecast to Boost Tech Cash Flow as Usage Soars" | Goldman Sachs Research | https://www.goldmansachs.com/insights/articles/ai-agents-forecast-to-boost-tech-cash-flow-as-usage-soars | 24× token growth by 2030 → 120 quadrillion/mo (Jim Schneider). **Not on the tech allowlist** — see notes. Primary corporate research; page is JS-gated (timed out on fetch). |
| Bloomberg: "Uber Caps Employee AI Spending..." (Natalie Lung) | Bloomberg | (paywalled — accessed only via Willison's relay) | **PAYWALLED.** Original of the Uber story. Willison's summary carries the load-bearing facts; editor may have Bloomberg access to confirm verbatim. |

---

## 7. Suggested issue structure

Section-by-section plan. Kinds verified against `SECTION_KINDS` /
`src/content/issues/_AGENTS.md` §11 (`paradox` is in the core kit;
`scaling-plot`, `version-graph`, `arch-stack`, `throughput-dial` are the tech v2
kinds; `timeline`, `benchmark-chart`, `data-readout`, `comparison`, `prose`,
`quote` are core). 8 sections → ~7 min read.

| # | kind | eyebrow | what it covers |
|---|---|---|---|
| 1 | `hero` | — | Hook + title + dek. "AI keeps getting cheaper. Uber's bill says otherwise." Lands the four-month-budget-burn + the $1,500 cap. |
| 2 | `paradox` | THE SCISSOR | **Load-bearing reframe.** Two opposing arrows: *price per token, falling* (Claude 3 Haiku $0.25/M → frontier cents) vs *spend per task, rising* (budget gone in 4 months; GPT-5.5 = 2× GPT-5.4). The product goes up. `data`: two-sided statement — left = "What everyone reads: AI is getting cheaper," right = "What the bill shows: spend per task is exploding," resolution = "A falling unit price × a faster-rising unit count = a budget blown in a third of a year." |
| 3 | `prose` | THE CROSSOVER | The Nov-2025 inflection: coding *agents* went from "often-work to mostly-work" (RLVR + Opus 4.5 / GPT-5.1 + harnesses). The qualitative shift from chatbot to autonomous worker is what changed the token math. skimCaption: "In Nov 2025 coding agents became reliable enough to use as daily drivers — and they burn vastly more tokens than chat." |
| 4 | `scaling-plot` | TOKENS PER TASK | **The multiplier, visualised.** Log Y axis. X = task complexity (one chat reply → multi-step agentic refactor). Y = tokens consumed, from a few thousand to >1,000,000 (Willison's real Codex query: 169,818 + 17,112 + 1,176,320). Shows why "cheaper per token" loses to "more tokens per task." `data` shape: `{ points[]{x,y,label}, xLabel:"task complexity", yLabel:"tokens per task", logY:true }`. **Flag the 5,000 floor as illustrative (see notes).** |
| 5 | `timeline` | HOW THE BILL CAME DUE | Nov 2025 inflection → enterprise pricing flips to token-metering (Anthropic Apr 14 / OpenAI Apr 2) → frontier prices *rise* (GPT-5.5 2×, Opus 4.7 1.4×) → Uber budget exhausted (~Apr) → $1,500 cap (2 Jun). The chronology *is* the argument. |
| 6 | `benchmark-chart` | THE REAL PRICE OF A SESSION | $ bars. Contrast the per-token rate-card story with realised cost: Willison's 30-day API-equivalent spend ($1,199.79 Anthropic + $980.37 OpenAI = $2,180.16) vs the $200 he paid; and tokenizer inflation (Opus 4.7 ≈ +40% at the same rate card). Bars make the gap between sticker price and real cost concrete. `data`: labelled $ bars per item, each with a sourceRef. |
| 7 | `data-readout` | $1,500 / MONTH | The cap as a single hard number, set against the ~$330K median comp (~11%) and the four-month burn. The institution made visible. One unforgettable stat block. |
| 8 | `prose` | THE WALL EVERYONE'S WALKING TOWARD | Close: Uber is the first named institution to hit it; Goldman projects 24× more tokens by 2030. The cost didn't fall, it moved — from "talking to AI" to "AI working for you," and the business pays per task. skimCaption pulls the Goldman 24× + the structural one-liner. **Max 2 LYRICAL paragraphs across the issue — this is the natural home for one.** |

**Visualization mapping notes for the drafter:**
- The `paradox` (§2) is the chart everyone remembers — protect it; it carries the
  thesis. Keep both blades to *verified* numbers (rate-card ladder ↓ vs
  budget-burn / frontier-price-rise ↑).
- `scaling-plot` (§4) needs the log Y axis or the >1M-token point flattens
  everything else. Only the 1M point and Willison's exact Codex split are
  verified; lower points are illustrative — say so in the caption.
- `benchmark-chart` (§6): every bar needs a sourceRef. The $2,180.16/$200 split
  and the tokenizer-inflation % are the two cleanest, fully-sourced bars.
- A `version-graph` (the native tech signature) is *not* recommended here — the
  story is economic, not a release tree; C-04 is its proper home. Don't force it.

---

## 8. Source bibliography

Complete list of everything consulted, cited or not.

- [Uber Caps Usage of AI Tools Like Claude Code to Manage Costs](https://simonwillison.net/2026/Jun/3/uber-caps-usage/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary` (relays Bloomberg; the anchor)
- [I think Anthropic and OpenAI have found product-market fit](https://simonwillison.net/2026/May/27/product-market-fit/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary`
- [The last six months in LLMs in five minutes](https://simonwillison.net/2026/May/19/5-minute-llms/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary`
- [Simon Willison — llm-pricing tag](https://simonwillison.net/tags/llm-pricing/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary`
- [Claude Token Counter, now with model comparisons](https://simonwillison.net/2026/apr/20/claude-token-counts/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary`
- [Is Claude Code going to cost $100/month? Probably not](https://simonwillison.net/2026/apr/22/claude-code-confusion/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary` (context on subscription vs API confusion; no token-volume data)
- [Vibe coding and agentic engineering](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: analysis` ("200→2,000 lines" quote; no token economics)
- [Writing code is cheap now (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: analysis`
- [How coding agents work (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: analysis` (token-growth mechanism)
- [Microsoft's new MAI models](https://simonwillison.net/2026/Jun/2/microsofts-new-models/) — Simon Willison's Weblog, accessed 2026-06-04 — `kind: primary` (checked for the MS/Claude-Code cancellation; does NOT cover it)
- [AI Agents Forecast to Boost Tech Cash Flow as Usage Soars](https://www.goldmansachs.com/insights/articles/ai-agents-forecast-to-boost-tech-cash-flow-as-usage-soars) — Goldman Sachs Research, accessed 2026-06-04 — `kind: primary` (**not allowlisted**; page JS-gated, figure confirmed via secondary)
- Bloomberg — "Uber Caps Employee AI Spending..." (Natalie Lung, 2026-06-02) — Bloomberg — `kind: primary` (**PAYWALLED**; not directly accessed; relayed via Willison)
- Goldman 24×/120-quadrillion confirmation secondary (PYMNTS) — accessed 2026-06-04 — `kind: secondary` (used only to confirm the Goldman figure the primary page wouldn't load; **not a Parallax citation**)
- Microsoft-cancels-Claude-Code coverage (The Decoder, opentools.ai, et al.) — accessed 2026-06-04 — `kind: secondary` (**non-allowlisted**; basis for the [UNVERIFIED] Microsoft item only; **not a Parallax citation**)

---

## 9. Researcher notes

**Sourcing posture — strong.** The three load-bearing anchors the candidate
flagged are all confirmed on allowlisted Willison posts, in some cases with more
precision than the brief promised:
- Uber $1,500/tool cap, four-month budget burn, ~$330K comp, ~11% ratio →
  Willison 3 Jun (relaying Bloomberg).
- The scissor's "spend up" blade is backed by *named, dated frontier price
  increases* (GPT-5.5 = 2× GPT-5.4; Opus 4.7 ≈ 1.4×) — stronger than just "budget
  blown."
- A real >1M-token single-task measurement (169,818 + 17,112 + 1,176,320 on GPT-5
  Codex) gives the scaling-plot a concrete, sourced top-of-range point.

**[UNVERIFIED] items the editor must see before approving:**
1. **Blended cost $18.40/M → $6.07/M tokens YoY.** Found in *no* allowlisted or
   even general source during this sweep. Origin is a non-allowlisted aggregator.
   **Recommend dropping it** — the per-token-decline story is fully carried by
   the verified rate-card ladder (Claude 3 Haiku $0.25/$1.25 → frontier cents).
2. **5×–30× token multiplier (chat vs agentic).** The *direction and rough
   magnitude* are verified (Willison: "vastly more tokens," "order of magnitude
   less six months ago"). The precise 5–30× band is not on any allowlisted
   source. Use the order-of-magnitude language, or label 5–30× as illustrative.
3. **Tokens-per-task floor of ~5,000.** The 1M ceiling is verified; the 5k chat
   floor is a reasonable but uncited estimate. Caption the scaling-plot's low end
   as illustrative.
4. **Microsoft cancelling Claude Code licenses (E+D division, by 30 Jun, ~$2K/
   engineer/mo, → Copilot CLI).** Real and widely reported, but ONLY on
   non-allowlisted aggregators tracing to a paywalled Bloomberg/BI original, and
   Willison did NOT cover it. **Do not present as a Parallax fact.** It would be a
   strong *second* institutional example beside Uber if the editor confirms via
   Bloomberg — worth a `# EDITOR:` flag in the draft if used.
5. **Goldman 55×-by-2040 and 60–70% annual inference-cost decline.** Secondary
   only; not in the excerpt I could confirm. Cite only the 24×/2030 → 120-
   quadrillion figure.

**Goldman allowlist nuance.** goldmansachs.com is **not** on the tech allowlist.
The candidate explicitly named Goldman's projection, and it is genuine primary
corporate research (analyst: Jim Schneider). The page is JS-gated and timed out
on three WebFetch attempts; I confirmed the 24× / 120-quadrillion figures and the
analyst via a secondary that quotes the report. **Editor decision needed:** either
(a) treat the Goldman number as the macro "where this goes" anchor and cite
goldmansachs.com directly (recommended — it's primary and load-bearing for §8), or
(b) drop the projection and let the issue rest entirely on the dated Willison
facts. The issue stands on its own without Goldman; Goldman only widens the lens.

**Paywall.** The Bloomberg original (Natalie Lung, 2 Jun) is paywalled and was not
directly accessed. Every load-bearing fact from it is carried by Willison's relay
and quoted verbatim there. If the editor has Bloomberg access, confirm the cap
wording and the "four months" claim against the original before publish.

**Voice/structure cautions for the drafter:**
- The `paradox` (§2) is the whole issue in one chart — do not bury it; do not let
  any AI-tell "It is not X, it is Y" creep in (this issue's one permitted binary
  reframe, if used at all, belongs here and nowhere else).
- The subscription-arbitrage fact ($2,180.16 of tokens for $200) is seductive but
  is a *sub-point* — it explains why individuals don't *feel* the cost, which is
  why *finance* gets surprised. Keep it subordinate to the enterprise scissor;
  don't let the issue become "how to get cheap tokens."
- Resist `version-graph` here despite it being the tech signature kind — the story
  is a cost curve, not a release tree (that's C-04). `scaling-plot` + `paradox`
  are the right signatures for this argument.

**404s / fetch failures:** none returned 404. goldmansachs.com timed out 3×
(JS-gated); eenewseurope.com returned HTTP 403. Neither is allowlisted; neither is
load-bearing given the Willison coverage.

Status: ready-for-draft
