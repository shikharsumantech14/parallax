# Cheap-triage alternatives to a frontier-model research loop — pricing catalogue

**Compiled:** 2026-09-27 · read-only web research, no paid API calls made.
**Context:** the pipeline's researcher agent runs Opus 5 / Sonnet 5 through a ~65-turn WebSearch → WebFetch → read → extract loop, ~$7.40 and ~18 minutes per article, because the whole growing context re-reads on every turn. This catalogue is the fair comparison set for moving "which sources / which passages matter" decisions to something far cheaper than the frontier model, against TypeSafe AI's Jev ($0.042/MTok input, output free, typed answers with probabilities, early access).

> **Sourcing note.** Every price below is a verbatim quote from either the vendor's own pricing/docs page (marked **[official]**) or, where the official page did not render the number (JS-gated pricing widgets, sales-gated tables), a secondary aggregator **[secondary]** — flagged explicitly in each case per the "never invent a price" instruction. Nothing here is estimated or inferred as a price.

---

## Quick-reference: Jev vs. the field

Jev is a **non-generative "System One" decision model**: it takes context + typed questions (Choice / Score / Noul-yes-or-no) and returns structured answers with calibrated probabilities in one parallel-evaluated request, with **output tokens unmetered/free** — so its economics don't map cleanly onto "$/MTok generative" comparisons. The closest incumbents, by job:

- **(a) rank/filter URLs** → any relevance-scored search API (Exa, Tavily, Brave, Serper, SerpApi, You.com) already returns this without an extra model call.
- **(b) extract clean text** → a page extractor (Jina Reader, Firecrawl, Readability) or Anthropic's own `web_fetch` — Jev/OpenJev are not built for this job at all (no free-text generation).
- **(c) rank passages against a question** → this is exactly what a **reranker** (Cohere Rerank 3.5, Jina Reranker, Voyage rerank, bge-reranker-v2-m3) or **embeddings + cosine** already do, cheaply, and is the single closest incumbent to Jev's passage-scoring job.
- **(d) typed yes/no with confidence** → a small generative model **with logprobs exposed** (Gemini Flash-Lite, Together, vLLM/local) can approximate Jev's calibrated-probability claim; one **without** logprobs (Claude Haiku, Groq) can only give a self-reported confidence string, which is a weaker guarantee.
- **(e) claim-vs-evidence entailment** → no incumbent here is purpose-built; rerankers and embeddings are trained on relevance, not entailment, so this is the job where a generative model's judgment (Haiku 4.5, Flash-Lite) is doing real reasoning work that a reranker's relevance score cannot substitute for.

**Risk flag on Jev itself:** early access is waitlist-gated (as of 2026-09-15), and TypeSafe "openly admits it cannot yet prove the price is not subsidized" — the $0.042/MTok figure has no track record of holding at GA pricing or under rate limits. [secondary: eesel.ai, layer3labs.io, ai-crescent.com — see Sources]

---

## 1. Search APIs — relevance-scored results / highlights

| Name | Job fit | Price (verbatim + URL) | Free tier | Limits | Node/TS SDK | Logprobs/confidence |
|---|---|---|---|---|---|---|
| **Exa** | (a), partial (c) via query-focused highlights | "$7 / 1k requests" (search, up to 10 results, contents bundled since March 2026); "$1 / 1k pages, per content type" for extra Contents/Highlights/Summary calls (billed independently — asking for text **and** highlights on one page bills twice) [official, exa.ai/pricing] | Free balance resets to $10/mo, no card required (~1,400 searches/mo) | Deep Search $12/1k, Deep-Reasoning $15/1k, Answer $5/1k | `exa-js` (official) | n.a. — returns relevance-ranked results + text excerpts, not a probability |
| **Tavily** | (a) | "$0.008 per credit" pay-as-you-go; Basic search = 1 credit, Advanced = 2 credits; monthly plans $0.0075–$0.005/credit [official, docs.tavily.com/documentation/api-credits] | "1,000 free API Credits every month. No credit card required." | Growth plan: 100,000 credits/mo at $500 (=$0.005/credit) | `@tavily/core` (official) | n.a. |
| **Brave Search API** | (a) | "$5.00 per 1,000 requests" (Search); Answers "$4.00 per 1,000 queries" + "$5.00 per 1,000,000" input/output tokens [official, api-dashboard.search.brave.com/documentation/pricing] | $5/mo credit auto-applied (≈1,000 queries) | 50 req/s (Search); 2 req/s (Answers) | None official (REST only); community `@microfox/brave`; official MCP server `@brave/brave-search-mcp-server` | n.a. |
| **Perplexity Sonar API** | (a); thin (d)/(e) only via its full generated answer (a real LLM call, not cheap-typed) | Sonar "$1.00 per million input tokens and $1.00 per million output tokens"; Sonar Pro "$3.00... and $15.00..."; **plus** a $5–$14/1k-request fee depending on search-context level on top of token cost [secondary: cloudzero.com, aipricing.guru — official pricing tables did not render a single verbatim per-request figure in this check] | None found | Citation tokens dropped from Sonar/Sonar Pro billing in 2026, Deep Research only | No dedicated SDK — documented as OpenAI-Chat-Completions-compatible; use `openai` npm package with `baseURL: "https://api.perplexity.ai"` [official, docs.perplexity.ai OpenAI-compatibility page] | n.a. for search; underlying model may expose logprobs via the OpenAI-compatible surface — not confirmed this session |
| **You.com** | (a) | Web Search API "$5 per 1,000 calls"; Contents API "$1.00 /1k pages"; Answer API "$5.00 per 1,000 calls"; Research API tiered $12–$1,200/1k by effort [official, you.com/pricing + you.com/resources/lower-search-api-cost] | 100 free calls/day (Search); $100 free credit for new accounts | — | None official found (REST only) | n.a. |
| **Serper** | (a) | Official pricing widget did not render a price in this check (404 on `/pricing`, homepage omits numbers). [secondary, consistent across coldiq.com and apiserpent.com]: credit packs from $50 (≈$1/1,000) down to $3,750 (≈$0.30/1,000); 1 credit = ≤10 results, 2 credits for 11–100 results | "2,500 free queries" no card required [official, serper.dev homepage] | Paid credits expire 6 months after purchase [secondary] | None official; unmaintained community `serper` npm package | n.a. |
| **SerpApi** | (a) | Free: 250 searches/mo, 50/hr, $0. Starter $25/mo = 1,000 searches ($0.025/search) up to Volume $1,475/mo = 250,000 ($0.006/search); Cloud tiers to $3,750/mo (1M) → $106,050/mo (54M) [official, serpapi.com/pricing] | 250 searches/month (real recurring allowance, not a one-time trial) | Throughput scales 50/hr (free) → 640k/hr (top cloud tier); "only successful searches are counted" | `serpapi` / `google-search-results-nodejs` (both official, MIT) | n.a. |

---

## 2. Page extractors — clean article text from a URL

| Name | Job fit | Price (verbatim + URL) | Free tier | Limits | Node/TS SDK | Logprobs/confidence |
|---|---|---|---|---|---|---|
| **Jina Reader (r.jina.ai)** | (b) | Reported inconsistently across sources: one figure of "$0.02 per 1 million output tokens", another of "$0.05 per million tokens" post-May-2025 repricing [secondary: markaicode.com, linkstartai.com — flagging the conflict rather than picking one] | 10M free tokens on signup, shared across Reader/Embeddings/Reranker; **fully keyless** access at ~20 req/min with no account at all | 500 RPM with a free/paid key, 5,000 RPM premium; `s.jina.ai` search endpoint bills a minimum ~10,000 tokens/request | None official (plain REST) | n.a. |
| **Firecrawl** | (b), + (a) via its Search endpoint | Free 1,000 credits/mo; Hobby $16/mo(annual)=5,000 credits; Standard $83/mo=100,000; Growth $333/mo=500,000; Scale $599/mo=1,000,000. "Scrape/Crawl/Map: 1 credit per page"; JSON/structured extraction adds 4 credits (5 total); Enhanced/anti-bot mode 5 credits/page [official, firecrawl.dev/pricing] | "1,000 credits every month, refreshed monthly, no card required" | "A scrape that returns no result is not charged. A page that responds with an error status such as 403 or 404 is still returned to you and costs 1 credit." | `@mendable/firecrawl-js` (official, MIT, 279k weekly downloads) | n.a. — returns markdown/structured JSON, not a confidence score |
| **Zyte API** | (b), incl. JS-rendered pages via browser mode | No flat per-1k rate; tier-based by target site + request type. Pay-as-you-go HTTP requests "$0.13 to $1.27 per 1,000"; browser-rendered "$1.01 to $16.08 per 1,000"; at $500/mo commitment, HTTP drops to "$0.06-$0.61 per 1,000". Automatic extraction add-on "$0.0004-$0.0016 per data type" [secondary: use-apify.com blog citing Zyte's own tier tables; official docs.zyte.com/zyte-api/pricing.html confirmed the tier structure and the extraction/screenshot add-on prices but pointed to zyte.com/pricing for the base numbers] | "$5 free credit" first billing month ($200 for Enterprise) | "You are only charged for successful responses" — rate-limits and failures are free | Official Python client `python-zyte-api` only; **no official Node/JS SDK** — REST calls only from Node | n.a. |
| **Diffbot** | (b), plus entity/knowledge-graph extraction | Free $0/mo = 10,000 credits, 5 req/min; Startup $299/mo = 250,000 credits, 5 req/s; Plus $899/mo = 1,000,000 credits, 25 req/s. "The Extract API costs 1 credit per page extraction (standard method) or 2 credits when using a datacenter proxy." Overage $0.001/credit (Startup), $0.0009/credit (Plus) [official, diffbot.com/pricing] | 10,000 credits/month, no card required | 5 req/min (free) → 25 req/s (Plus) | No official Node SDK — unofficial `diffbot-node-client` (stale, 0 weekly downloads) or more-recently-updated `diffbot-api-node` | n.a. |
| **Apify** | (b) + general scraping/orchestration infra, so also (a) | Free $0/mo with "$5 in monthly platform credits", 16GB RAM, no card. Paid tiers reported inconsistently between sources — one cites Starter at "$19/month ($17/month billed annually)" with $19 of included usage, another cites "$29/mo" — **both cited here since the two aggregators disagree and the live pricing page renders via JS** [secondary: use-apify.com and scrapegraphai.com — conflict flagged]. Compute units ~$0.20/CU (Free/Starter) down to $0.13/CU (Business) | $5/month usage credit, no card | Store-Actor pay-per-result fees stack on top of compute+proxy spend; unused credits don't roll over | `apify-client` (official); the Apify SDK itself is a Node/TS-native scraping framework | n.a. |
| **Free/open route** | (b) | **$0.** Mozilla Readability (`@mozilla/readability`, MPL-2.0) + `jsdom` (MIT) — runs in your own Node process. `@extractus/article-extractor` (MIT license, npm). `trafilatura` (Apache-2.0 since ≥1.8.0, GPLv3+ before; Python, not Node — would need a subprocess call from the TS pipeline); "the most efficient open-source library in ScrapingHub's article extraction benchmark" [secondary: trafilatura docs / ACL Anthology paper] | Unlimited (self-hosted) | Your own CPU/network only | `@mozilla/readability` + `jsdom`, `@extractus/article-extractor` are all native Node/TS packages; trafilatura is Python-only | n.a. |

---

## 3. Embeddings & rerankers — passage ranking against a question

| Name | Job fit | Price (verbatim + URL) | Free tier | Limits | Node/TS SDK | Logprobs/confidence |
|---|---|---|---|---|---|---|
| **Voyage AI — voyage-4** (current gen, released 2026-01-15) | (c) | "$0.06" per million tokens [official, docs.voyageai.com/docs/pricing] | 200M free tokens (new-model introductory allotment) | 2048/1024/512/256-dim output options [secondary: blog.voyageai.com/2026/01/15/voyage-4] | `voyageai` (official, Node 18+, also Vercel/CF Workers/Deno/Bun/RN) | n.a. — cosine similarity score, not a calibrated probability |
| **Voyage — voyage-3.5-lite** (prior gen) | (c) | "$0.02" per million tokens, no free tier [official, docs.voyageai.com/docs/pricing] | none | — | same SDK | n.a. |
| **Voyage — voyage-4-nano** (bonus, not in original brief) | (c) | **$0 — open-weight, Apache-2.0, on Hugging Face**, explicitly positioned "ideal for local development and prototyping with an easy path to production" [official, blog.voyageai.com/2026/01/15/voyage-4] | n/a — self-hosted | your own hardware | self-hosted (ONNX/sentence-transformers) | n.a. |
| **Voyage rerankers (rerank-3 / rerank-3-lite / rerank-2.5 / rerank-2.5-lite)** | (c) | "$0.05" / "$0.02" / "$0.05" / "$0.02" per million tokens respectively; rerank-3 and rerank-3-lite each carry 200M free tokens, the 2.5-generation models have none [official, docs.voyageai.com/docs/pricing] | 200M tokens (rerank-3 family only) | — | same SDK | n.a. |
| **OpenAI text-embedding-3-small** | (c)/(a) | "$0.02" per million tokens (input only); Batch API "$0.01" [official, developers.openai.com/api/docs/pricing] | — | — | `openai` (official) | n.a. |
| **OpenAI text-embedding-3-large** | (c)/(a) | "$0.13" per million tokens; Batch "$0.065" [official] | — | — | `openai` | n.a. |
| **Google Gemini Embedding 2** (current) | (c)/(a) | Text "$0.20" per 1M tokens standard (batch "$0.10"); image "$0.45"/1M; audio "$6.50"/1M; video "$12.00"/1M [official, ai.google.dev/gemini-api/docs/pricing] | Free tier via AI Studio (rate-limited, not itemized on the pricing page) | — | `@google/genai` (official) | n.a. |
| **Gemini Embedding 001** (prior gen) | (c)/(a) | "$0.15 per 1M input tokens", batch "$0.075" [secondary: aicostcheck.com / tokenmix.ai, consistent across sources] | — | 2,048-token max input (vs. 4x for Embedding 2) | same SDK | n.a. |
| **Cohere Embed v4** | (c)/(a) | Standard serverless API pricing **did not render** on cohere.com/pricing at time of check — that page shows only Model Vault dedicated-instance pricing ("Embed 4 (Small): $4.00/hour or $2,500/month"). Secondary aggregators converge on "$0.12 per million tokens for text and $0.47 per million image tokens" for the pay-per-token API [secondary: aipricing.guru — flagged as unconfirmed on the primary page] | Trial API key: "free" and rate-limited, exact RPM not published on the pages checked | — | `cohere-ai` (official) | n.a. |
| **Cohere Rerank 3.5** | **(c) — closest incumbent to Jev's passage-scoring job**, per the brief | Not found on cohere.com/pricing directly (Model Vault only: "$5.00/hour or $3,250/month"). Secondary aggregators converge on "$2.00 per 1,000 searches" for the standard API, where "a single search counts as one query with up to 100 documents to rank"; one reseller (OpenRouter) lists it materially cheaper at "$0.001 per search" ≈ $1.00/1,000 [secondary: aipricing.guru, openrouter.ai/cohere/rerank-v3.5 — flagged, not confirmed on cohere.com] | same trial-key note as Embed | — | `cohere-ai` (official) | n.a. — returns a relevance score, not a calibrated probability |
| **Jina Reranker v3.5** | (c) | "$0.05 per million input tokens and $0.05 per million output tokens" — unusually, token-priced rather than per-search like Cohere/Voyage [secondary: aihubmix.com, meetcody.ai — consistent] | 10M free tokens shared with Reader/Embeddings on signup | — | None official (REST) | n.a. |
| **Mixedbread** | (c) | Embeddings "$0.10 per million tokens"; semantic search "$4 per thousand queries", "$7.50 per thousand queries with reranking"; indexing "$1.50 per million content tokens" (fast/basic OCR) or "$3 per million" (high-quality); storage "$0.50 per million content tokens per month" [official, mixedbread.com/pricing] | Starter plan free, "$5 in one-time credits", 100 req/min | — | `@mixedbread/sdk` (newer) / `@mixedbread-ai/sdk` (older), both official | n.a. |

---

## 4. Small / cheap generative models — classification & extraction with structured output

| Name | Job fit | Price (verbatim + URL) | Free tier | Node/TS SDK | **Logprobs?** |
|---|---|---|---|---|---|
| **Claude Haiku 4.5** | (d)/(e) via forced JSON schema + a self-reported confidence field (not a true logprob) | "Input: $1 / MTok" · "Output: $5 / MTok" · cache read "$0.10 / MTok" · cache write "$1.25 / MTok"; "Save 50% with batch processing" [official, claude.com/pricing] | None (API is metered from token 1; no free tier) | `@anthropic-ai/sdk` (official — already this project's SDK) | **No.** Confirmed across multiple independent sources: "Anthropic's API does not expose token logprobs" on any Claude model, in contrast to OpenAI/Cohere. [secondary, consistent] |
| **Gemini 2.5 Flash** | (d)/(e) | "$0.30 (text/image/video)" in, "$2.50" out, standard; batch "$0.15"/"$1.25" [official, ai.google.dev/gemini-api/docs/pricing]. **Deprecating 2026-10-16** → migrate to Gemini 3 Flash Preview ($0.50/$3.00) | Up to 500 RPD via Google AI Studio (shared quota with Flash-Lite) | `@google/genai` (official) | **Yes**, via `responseLogprobs` + `logprobs` (1–20 top alternatives) on `generateContent` — though a Google AI Developers forum thread flags it as inconsistently exposed on some newer "Interactions"/GenerationConfig_2 surfaces; confirm per-endpoint. |
| **Gemini 2.5 Flash-Lite** | (d)/(e) — **cheapest hosted option with confirmed logprobs** | "$0.10 (text/image/video)" in, "$0.40" out, standard; batch "$0.05"/"$0.20" [official, ai.google.dev/gemini-api/docs/pricing]. **Also deprecating 2026-10-16** → migrate to 3.1 Flash-Lite ($0.25/$1.50) | Same 500 RPD shared quota | `@google/genai` | **Yes**, same mechanism as 2.5 Flash. |
| **OpenAI gpt-5-nano** | (d)/(e) — cheapest OpenAI model | Input "$0.05" · cached input "$0.005" · output "$0.40" per MTok [official, developers.openai.com/api/docs/pricing] | None published | `openai` (official) | **Unclear / mixed signals.** OpenAI's chat-completions logprobs param is well documented generally (`logprobs`/`top_logprobs` up to 20), but the GPT-5 family are reasoning models, and OpenAI's own docs state "reasoning models (other than GPT-6 Astra) don't support... logprobs... on Chat Completions"; separately, community reports say gpt-5-nano rejects the `reasoning` parameter outright. Net: **test before relying on it** — not a clean yes. |
| **OpenAI gpt-5-mini** | (d)/(e) | Input "$0.25" · cached "$0.025" · output "$2.00" per MTok [official] | None published | `openai` | Same caveat as gpt-5-nano. |
| **Mistral Small 4** | (d)/(e) | "$0.15" in / "$0.60" out per MTok [secondary: pricepertoken.com, cloudzero.com — official mistral.ai/pricing page confirmed the per-million-token billing model and gave a worked example for Mistral Large ($0.5/$1.5) but did not print the Small figure verbatim on the page fetched] | "$10/mo in API credits" on the Free plan [official, mistral.ai/pricing] | `@mistralai/mistralai` (official) | Not confirmed this session — flagging as **not found** rather than guessing. |
| **Ministral 3 (3B)** | (d)/(e) — cheapest Mistral-family option | "$0.10" in / "$0.10" out per MTok [secondary: cloudzero.com] | same $10/mo free credit | same SDK | Not confirmed this session. |
| **Groq — GPT-OSS-20B** | (d)/(e) | Input "$0.075" / output "$0.30" per MTok, ~1000 tok/s [official, console.groq.com/docs/models] | Free tier exists (console); exact RPD not itemized on this page | `groq-sdk` (official) | **No.** Groq's own API reference: "`logprobs`... **not yet supported by any of our models**"; supplying it returns a 400 error. Confirmed via Groq community forum feature-request thread. |
| **Groq — GPT-OSS-120B** | (d)/(e) | "$0.15" in / "$0.60" out per MTok, ~500 tok/s [official] | same | same SDK | No (same limitation). |
| **Groq — Qwen3.8-27B** | (d)/(e), open-weights option | "$0.80" in / "$4.00" out per MTok, ~450 tok/s [official, console.groq.com/docs/models] | — | same SDK | No. **Note:** Llama 3.1-8B and Llama 3.3-70B were pulled from Groq's self-serve catalog to enterprise/contact-sales as of 2026-08-26 — not available at a published per-token rate any more. |
| **Together AI — Qwen3.8 Flash** | (d)/(e), open-weights, **cheapest confirmed-logprobs option** | "$0.09" in / "$0.28" out per MTok [secondary: together.ai model pages, cross-checked] | Not itemized on pricing page | `together-ai` (official) | **Yes**, documented: "the logprobs parameter... returns the log probability of each generated token, along with the alternative tokens the model considered," 0–20 top-k, on both chat and text completions. [official, docs.together.ai/docs/logprobs] |
| **Together AI — Llama 3.3 70B** | (d)/(e) | "$1.04" per million tokens, input and output [official, together.ai/models/llama-3-3-70b] | — | same SDK | Yes (same platform-wide logprobs support). |
| **vLLM (self-hosted, any open model)** | (d)/(e) — reference point for "local, GPU-backed" | $0 marginal (your own GPU) | n/a | OpenAI-compatible REST; use `openai` npm client against your local endpoint | **Yes** — `--max-logprobs` server flag, full logprobs support on the OpenAI-compatible chat/completions endpoints. [official, docs.vllm.ai] |

---

## 5. Anthropic's own server-side tools (the in-ecosystem alternative to the harness's WebFetch)

All quotes below are **verbatim from `platform.claude.com/docs/en/agents-and-tools/tool-use/`** (the `docs.anthropic.com` / `docs.claude.com` URLs both 30x-redirect here as of this check).

### `web_search` (versions `_20250305` / `_20260209` adds dynamic filtering / `_20260318` adds response_inclusion)
- **Price:** "Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content." Each search = one use "regardless of the number of results returned"; failed searches aren't billed.
- **Dynamic filtering** (`web_search_20260209`+): "Claude... writes and runs code that filters the results first, so only relevant content reaches the context window. This reduces token use on search-heavy requests." Runs inside the code-execution tool automatically ("There are no additional charges for code execution calls made this way beyond the standard token costs"). Requires Claude 4.6+.
- Returns per result: `url`, `title`, `page_age`, `encrypted_content`; citations always on, `cited_text` capped at 150 chars, and citation fields **don't count toward token usage**.

### `web_fetch` (versions `_20250910` / `_20260209`+dynamic filtering / `_20260309`+cache bypass / `_20260318`+response_inclusion)
- **Price: "no additional charges beyond standard token costs"** — the fetch itself is free; you only pay for the fetched content that enters context.
- **`max_content_tokens`**: "limits the amount of content included in the context. If the fetched content exceeds this limit, the tool truncates it... The limit applies to text content, not to binary content such as PDFs." No fixed platform default is stated; the worked example in the docs uses `100000`. "The actual number of input tokens used can vary by a small amount" from the requested cap.
- **Dynamic filtering** (`web_fetch_20260209`+): same code-execution mechanism as web_search — Claude writes/runs code to filter fetched content before it reaches context, "keeping only relevant information and discarding the rest."
- Illustrative token costs the docs themselves give: "Average web page (10 kB): ~2,500 tokens; Large documentation page (100 kB): ~25,000 tokens; Research paper PDF (500 kB): ~125,000 tokens."
- Citations optional (`citations: {enabled: true}`), off by default (unlike web_search).

### Claude Code / Agent SDK's own `WebFetch` tool (the harness tool the pipeline currently loops on)
- Per Claude Code's tools-reference page and independent analysis (mikhail.io, giuseppegurgone.com, only-cli.com — the primary docs page itself truncates before rendering the "WebFetch tool behavior" section in a raw fetch, which is a fitting demonstration of the exact mechanism being described): "The WebFetch tool fetches a page, converts the response to Markdown when the server returns HTML, and runs the prompt against the content using **a small, fast model**. For most fetches, Claude receives that model's answer, not the raw page." One analysis names the model as "Haiku 3.5"-class specifically; the primary docs do not name it verbatim in what rendered here.
- **Truncation:** "the tool downloads the page, converts it to Markdown, truncates the result to roughly **100 KB of text**, and gives that to a small fast model with your question." Exception: a preapproved documentation URL serving `text/markdown` under 100,000 characters skips the small-model step entirely and returns raw content directly (Haiku is skipped).
- **Is the summarization step billed?** Not explicitly itemized as a line item in Claude Code's own docs. Logically it is a real model call consuming real tokens: on the **API-key route** (`npm run pipeline:*`, per this project's `CLAUDE.md`) it should register as a small Haiku-class charge; on the **Claude Pro/Max subscription route inside Claude Code** it is absorbed into the subscription like every other harness-internal model call, so it costs no separate dollar amount to the operator but is not literally "free" processing either. **This is exactly the inefficiency the operator is trying to route around** — the harness already inserts one cheap-model summarization step per fetch, but the calling agent still re-reads the entire growing conversation (including this tool's prior outputs) on every subsequent turn, which is what runs the 65-turn loop's bill up.

---

## 6. Local, free options for a Windows machine

| Name | What it is | Hardware | License | Feasibility on Windows CPU |
|---|---|---|---|---|
| **OpenJev** (github.com/zhihz/openjev) | "Independent research preview inspired by TypeSafe Jev" — **not** the official Jev, no shared weights. Built on **Qwen3-4B-Instruct-2507** (Apache-2.0). API: POST with context + Choice (2–8 options) or Binary questions → choice + probabilities + `elapsed_ms`. | Validated config: **Apple M3, 16GB unified memory**, MLX 8-bit build (~4GB disk) | Code Apache-2.0; base model Apache-2.0 (HF) | Qwen3-4B can run on a Windows CPU via llama.cpp/ONNX in principle (int4/int8 quant fits in ~4–8GB RAM), but **no published CPU benchmark exists** for this project — the only quoted latency (125–150ms/decision) is GPU/Apple-Silicon. Expect multi-second-per-decision latency on CPU-only, unverified. |
| **openjev-server** (github.com/rituparnakashyap/openjev-server) | Production-shaped decision API over vLLM (GPU) or MLX (Apple Silicon); Choice/Noul/Score question types, health checks, Prometheus metrics, bearer auth, Docker Compose. Latency "125 ms on one H100," "150 ms on a Mac with the 4-bit build"; "72 typed fields in 6.41s on one H100." Accuracy "84.0%" (10k eval Qs), "88.0%" (desktop UI tasks). | 16-bit build: **two 80GB GPUs** (or one + offload); FP8: **one H100/80GB GPU**; MLX: **64GB** (8-bit) or **32GB** (4-bit) unified-memory Apple Silicon | Server code Apache-2.0; **model weights CC BY-NC 4.0 (non-commercial)** | **Not a fit as specified.** Every documented backend is either a datacenter GPU (vLLM) or Apple Silicon (MLX) — neither is "a Windows machine" with no GPU. Would require WSL2 **plus an actual NVIDIA GPU** to use the vLLM path at all; there is no CPU-only path documented. |
| **Ollama + `bge-m3`** (embedding) | BAAI general-purpose multilingual embedding model, servable via Ollama | CPU-only feasible | Permissive (BAAI/MIT-family) | **Good fit.** Secondary-source CPU throughput estimate: "approximately 50–150 docs/sec on a modern CPU" — 400 passages ≈ 3–8 seconds. Practical on a Windows box today via Ollama or onnxruntime. |
| **`bge-reranker-v2-m3`** (cross-encoder reranker) | BAAI reranker, canonical pairing with bge-m3 for retrieve-then-rerank | CPU-only feasible, slower than embeddings | Same license family | **Workable but slower.** Secondary-source estimate: "50–100ms per document pair," i.e., ~10–20 pairs/sec — 400 passages against one query ≈ 20–40 seconds on CPU alone. Fine for an offline per-article batch step; not fine for interactive use. |
| **`voyage-4-nano`** (bonus — not in the original brief, surfaced during research) | Voyage AI's open-weight embedding model, released alongside voyage-4, "ideal for local development and prototyping with an easy path to production" | CPU/GPU, self-hosted | **Apache-2.0**, on Hugging Face | $0, directly answers job (c) locally; worth adding to the shortlist. |

**Bottom line for job 6:** the embedding/reranker half of a local pipeline (bge-m3 + bge-reranker-v2-m3, or voyage-4-nano) is genuinely free and CPU-feasible today on a few hundred passages per article. The **generative typed-decision half** (an OpenJev-style yes/no-with-confidence model) is the part that assumes a GPU or Apple Silicon in every piece of documentation found — there is no evidence either project has been benchmarked CPU-only, and a Windows box with no discrete GPU is explicitly outside every hardware table both projects publish.

---

## Final estimate: one article's research (30 results triaged, 15 pages @ ~8k tok = 120k tokens extracted, 400 passages ranked, 60 typed questions)

**Stated assumptions (order-of-magnitude, not vendor-audited):** the 120,000 tokens of extracted page text is read once as ranking/context input across the 400-passage ranking pass (≈120k tok, i.e. ~300 tok/passage average); the 30-result URL triage adds ~1,800 tokens (60 tok/snippet); the 60 typed yes/no questions each carry ~400 tokens of passage context + question (~24,000 tok). **Combined generative/decision input ≈ 146,000 tokens, rounded to 150,000.** Output across ~490 total typed/classification decisions is short (labels, probabilities, brief JSON) — assumed **≈10,000 output tokens** total. Rerankers and embeddings don't take "output tokens" in this sense; they're priced per search-unit or per token embedded instead, and they only cover jobs (a)/(c), not (d)/(e).

| # | Approach | Arithmetic | Cost | Covers |
|---|---|---|---|---|
| (i) | **Jev** @ $0.042/MTok in, output free | 150,000 / 1,000,000 × $0.042 | **≈ $0.006** | a, c, d, e (by design) — early access, unaudited price |
| (ii) | **Reranker** (Cohere Rerank 3.5 @ $2.00/1,000 searches, ≤100 docs/search) | 400 passages ÷ 100 docs/search = 4 searches (single ranking query) → 4/1,000 × $2.00 = $0.008; **or**, more realistically, ~5 distinct research questions × 4 batches = 20 searches → 20/1,000 × $2.00 = $0.04 | **≈ $0.008–$0.04** | c only |
| (iii) | **Embeddings + cosine** (Voyage 3.5-lite @ $0.02/MTok, cosine computed locally for $0) | Embed 400 passages (~120,000 tok) + 30 URL snippets (~1,800 tok) + 60 questions (~900 tok) ≈ 123,000 tok. 123,000 / 1,000,000 × $0.02 | **≈ $0.002** | a, c only |
| (iv) | **Haiku 4.5** @ $1/$5 per MTok | in: 150,000/1,000,000 × $1 = $0.15; out: 10,000/1,000,000 × $5 = $0.05 | **≈ $0.20** | a, c, d, e — but no logprobs, self-reported confidence only |
| (v) | **Gemini 2.5 Flash-Lite** @ $0.10/$0.40 per MTok | in: 150,000/1,000,000 × $0.10 = $0.015; out: 10,000/1,000,000 × $0.40 = $0.004 | **≈ $0.02** | a, c, d, e — has logprobs, but model retires 2026-10-16 |
| (vi) | **Local CPU** (bge-m3 + bge-reranker-v2-m3; no capable local decision LLM benchmarked CPU-only) | $0 marginal API cost. Wall-clock instead: embed 400 passages ≈ 3–8s; cross-encoder rerank 400 passages ≈ 20–40s; a local 4B typed-decision model for 60 questions has no published CPU number — extrapolating 10–50× slower than the 125–150ms/decision GPU/Apple-Silicon figures gives a plausible **several-seconds-to-tens-of-seconds per decision**, i.e., **~5–30+ minutes for 60 sequential questions** unless batched | **$0.00** | a, c cheaply and fast; d, e possible only with an unverified, likely slow local generative pass |

**For scale:** the status-quo frontier-model loop this is meant to replace costs **~$7.40/article**. Even the most expensive "cheap" option above (Haiku 4.5, ~$0.20) is **~37× cheaper**; Gemini Flash-Lite is **~370× cheaper**; Jev, if its early-access price holds at GA, would be **~1,200× cheaper** — but is the only one of the six with no production track record and an unresolved subsidy question from its own vendor.

---

## Sources

**Search APIs**
- [Pricing - Exa](https://exa.ai/docs/admin/pricing) · [Exa API Pricing | Pay-as-You-Go Plans for AI Search](https://exa.ai/pricing)
- [Credits & Pricing - Tavily Docs](https://docs.tavily.com/documentation/api-credits)
- [Brave Search - API pricing](https://api-dashboard.search.brave.com/documentation/pricing)
- [Perplexity API Pricing In 2026 (CloudZero)](https://www.cloudzero.com/blog/perplexity-api-pricing/) · [Sonar API Pricing 2026 (pricepertoken)](https://pricepertoken.com/pricing-page/model/perplexity-sonar) · [OpenAI Compatibility - Perplexity docs](https://docs.perplexity.ai/docs/agent-api/openai-compatibility)
- [You.com | Lower Search API Cost](https://you.com/resources/lower-search-api-cost) · [Our Pricing Plans | You.com](https://you.com/pricing)
- [Serper - The World's Fastest and Cheapest Google Search API](https://serper.dev/) · [Serper Pricing in 2026 (coldiq)](https://coldiq.com/blog/serper-pricing) · [Serper Pricing Explained (apiserpent)](https://apiserpent.com/blog/serper-pricing-credits-explained)
- [SerpApi Pricing](https://serpapi.com/pricing)

**Page extractors**
- [Reader API - Jina AI](https://jina.ai/reader/) · [Jina AI Pricing (markaicode)](https://markaicode.com/pricing/jina-ai-pricing/)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing) · [Node SDK | Firecrawl docs](https://docs.firecrawl.dev/sdks/node)
- [Zyte API pricing docs](https://docs.zyte.com/zyte-api/pricing.html) · [Web Scraping Pricing 2026 (Use Apify)](https://use-apify.com/blog/web-scraping-pricing-guide-all-platforms)
- [Diffbot pricing](https://www.diffbot.com/pricing/)
- [Apify Pricing 2026 (Use Apify)](https://use-apify.com/docs/what-is-apify/apify-pricing) · [apify-client - npm](https://www.npmjs.com/package/apify-client)
- [Trafilatura documentation](https://trafilatura.readthedocs.io/) · [@extractus/article-extractor - npm](https://www.npmjs.com/package/@extractus/article-extractor)

**Embeddings & rerankers**
- [Pricing - Introduction - Voyage AI](https://docs.voyageai.com/docs/pricing) · [The Voyage 4 model family (Voyage AI blog)](https://blog.voyageai.com/2026/01/15/voyage-4/) · [voyageai - npm](https://www.npmjs.com/package/voyageai)
- [New embedding models and API updates | OpenAI](https://openai.com/index/new-embedding-models-and-api-updates/) · [OpenAI API pricing (developers.openai.com)](https://developers.openai.com/api/docs/pricing)
- [Gemini Developer API pricing | Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini Embedding now GA (Google Developers Blog)](https://developers.googleblog.com/gemini-embedding-available-gemini-api/)
- [Cohere pricing](https://cohere.com/pricing) · [Rerank v3.5 — OpenRouter](https://openrouter.ai/cohere/rerank-v3.5) · [Cohere API Pricing 2026 (aipricing.guru)](https://www.aipricing.guru/cohere-pricing/)
- [Reranker API - Jina AI](https://jina.ai/en-US/reranker/)
- [Mixedbread pricing](https://www.mixedbread.com/pricing)

**Small/cheap generative models & logprobs**
- [Claude pricing](https://claude.com/pricing) · [Introducing Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini API logprobs forum thread](https://discuss.ai.google.dev/t/missing-logprobs-support-in-next-gen-interactions-api-generationconfig-2/144837)
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) · [Create chat completion | OpenAI API Reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) · [Azure OpenAI reasoning models docs (logprobs restriction)](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning) · [GPT-5-Nano accepted parameters (OpenAI community)](https://community.openai.com/t/gpt-5-nano-accepted-parameters/1355086)
- [Mistral pricing](https://mistral.ai/pricing)
- [Groq models & pricing docs](https://console.groq.com/docs/models) · [Groq logprobs feature request (community)](https://community.groq.com/t/add-support-for-logprobs-in-model-api-response/193)
- [Together AI pricing](https://www.together.ai/pricing) · [Log probabilities - Together AI docs](https://docs.together.ai/docs/logprobs)
- [vLLM OpenAI-Compatible Server docs](https://docs.vllm.ai/en/stable/cli/serve/)

**Anthropic server tools & Claude Code**
- [Web search tool - Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
- [Web fetch tool - Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)
- [Tools reference - Claude Code Docs](https://code.claude.com/docs/en/tools-reference)
- [Inside Claude Code's Web Tools: WebFetch vs WebSearch | Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-web-tools/)
- [How Claude Code Eats the Web (giuseppegurgone.com)](https://giuseppegurgone.com/claude-webfetch)
- [Why did WebFetch truncate the docs page you pointed it at? (only-cli.com)](https://only-cli.com/blog/webfetch-truncated-the-docs-page/)

**Jev / local options**
- [TypeSafe Jev pricing 2026 (eesel.ai)](https://www.eesel.ai/blog/typesafe-jev-pricing) · [Jev Pricing (layer3labs)](https://www.layer3labs.io/guides/jev-pricing) · [Jev (TypeSafe AI) Pricing (ai-crescent.com)](https://www.ai-crescent.com/blog/jev-typesafe-pricing-2026)
- [GitHub - zhihz/openjev](https://github.com/zhihz/openjev)
- [GitHub - rituparnakashyap/openjev-server](https://github.com/rituparnakashyap/openjev-server)
- [BAAI/bge-m3 · Hugging Face](https://huggingface.co/BAAI/bge-m3) · [BAAI/bge-reranker-v2-m3 · Hugging Face](https://huggingface.co/BAAI/bge-reranker-v2-m3)
