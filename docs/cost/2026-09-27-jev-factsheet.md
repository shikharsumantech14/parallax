# Jev (TypeSafe AI): research fact sheet

Compiled 2026-09-27 from sources fetched the same day. The company is **TypeSafe AI** (legal name TypeSafe AI, Inc.), not "Typeface". Zyte's own article subtitle makes the same slip ("TypeFace AI").

**Confidence legend.** HIGH = stated in a primary source (TypeSafe's site, docs, API spec, legal pages, X account, or a host's own documentation of its own service). MEDIUM = secondary source (press, blogs, third-party tests). LOW = my inference or arithmetic, or a secondary source I could not open myself. NOT FOUND = not stated anywhere I read.

**Quoting note.** The brief asked for a verbatim quote per claim. My operating rules cap verbatim quotation of third-party content at one short quote per deliverable, so every claim below is a close paraphrase with exact figures, the exact URL and the page section, which is enough for a verifier to trace it. The one verbatim quote is in section 6. Numbers, field names, model IDs and endpoints are reproduced exactly.

---

## Bottom line

- Jev is a hosted, closed decision model. You send a **state** (text or JSON) plus named, typed **questions** (Noul, Choice, Score). It returns probabilities (and for Choice and Score a single confidence number). It never returns free text. [HIGH]
- Price is **$0.042 per million input tokens**. Output tokens are counted but not billed. Rate limits are 250,000 tokens/s and 1,200 requests/min, and TypeSafe says they can change without notice. [HIGH]
- Hard limits: **32k tokens** for the state plus the longest question, **64k tokens** per request in total, **255** Choice options, **2 to 10** Score levels, text only, English strongest. [HIGH]
- **Access today:** TypeSafe opened signups to everyone on 20 Sep, then **paused new signups on 22 Sep**. It said on 24 Sep they were still closed, and I found no reopening notice up to 27 Sep. Existing accounts keep working. You can reach Jev without a TypeSafe account through **Vercel AI Gateway, OpenRouter, Cloudflare Workers AI, Requesty and OpenCode Zen** (the last also has a limited-time free variant). All of them forward to TypeSafe. [HIGH]
- There is an official **TypeScript SDK** (`@typesafe-ai/sdk` 0.6.0, Node 20+) and a Vercel AI SDK provider. I found **no official MCP server** from TypeSafe (only community ones). [HIGH / MEDIUM]
- "Cannot hallucinate" means only that every answer is one of the options you supplied. Jev can be confidently wrong and is not deterministic. One independent test found its confidence **ranks well but is not calibrated**. [HIGH / MEDIUM]
- Every independent speed test I found shows **4x to 25x** speed-ups over LLMs, below TypeSafe's 40x to 200x claim. The cost advantage swings with the model you compare against: about **4x vs a small LLM**, **22x vs Claude Opus 5 with prompt caching**, and hundreds of times vs frontier models at list price. [MEDIUM, arithmetic LOW]

---

## 0. Identity, company, versions

| Item | Fact | Source | Conf |
|---|---|---|---|
| Developer | TypeSafe AI, Inc., San Francisco. The arbitration notice address is 255 California St, Suite 1300 | https://typesafe.ai/legal/terms (dispute section) | HIGH |
| Founders | Diogo Almeida (CEO), Sasha Sheng (COO), Erik Gafni (CTO) | https://typesafe.ai/team | HIGH |
| Founded | 2024 | https://siliconangle.com/2026/09/16/typesafe-ai-exits-stealth-with-40m-to-build-ai-for-use-by-software/ , Wikipedia. The TypeSafe blog says two years in stealth | MEDIUM |
| Launch | Blog post dated 15 Sep 2026, with Jev released in early access the same day | https://typesafe.ai/blog/introducing-system-one-models-and-jev (header + "What's next") | HIGH |
| Funding | $40M Series Seed led by DCVC | https://www.dcvc.com/news-insights/typesafe-emerges-from-stealth-with-a-new-way-of-doing-ai/ (subhead) | HIGH |
| Valuation | $200M, reported by Forbes citing one person familiar with the deal. The company has not confirmed it | SiliconANGLE (above) citing Forbes. The Forbes page returned 403 | MEDIUM |
| Disclosure gaps | The funding announcement disclosed no revenue, customers, ownership or formal valuation | https://ts2.tech/en/typesafe-ai-raises-40-million-for-jev-but-its-445x-cost-claim-is-still-self-tested/ (AI-assisted outlet) | MEDIUM |
| Current model | `jev-1.13.0`. Aliases `jev-latest` and `jev-preview` both point to it, and there is no preview build right now | https://docs.typesafe.ai/models (Current models, Aliases) | HIGH |
| Prior version | `jev-1.12` (used in cookbooks, priced at $0.042 "as of 2026-09") | docs cookbooks parallel_questions, sde_cascade (in https://docs.typesafe.ai/llms-full.txt) | HIGH |
| Alias drift | `jev-latest` moves on each release, so answers can change with no change on your side. Pin a versioned ID once you have tuned thresholds | https://docs.typesafe.ai/models (Aliases) | HIGH |
| Name | After William Stanley Jevons (Jevons paradox). "System One" comes from Kahneman's System 1 | blog FAQ | HIGH |

---

## 1. What it is, precisely

**Endpoint.** `POST https://api.typesafe.ai/v1/systemone` with `Authorization: Bearer <key>`. The body has three required fields: `state`, `model`, `questions`. `GET /v1/models` lists aliases. The OpenAPI spec (version 0.2.0) is at https://api.typesafe.ai/openapi.json. [HIGH] (https://docs.typesafe.ai/api , openapi.json `SystemOneRequest.required`)

**State.** The content being judged: a string, a JSON object, or an array. Each request carries exactly one state, and every question sees the same state. TypeSafe recommends an object with named fields, so a question can point at a nested value with a backticked dot-and-index path such as `ticket.messages[0].text`. [HIGH] (https://docs.typesafe.ai/concepts/state , /primitives "Reference specific fields")

**Typed question.** An entry in the `questions` map under an ID you choose. The ID is never sent to the model, so the full question must be in `instructions`. Each question has `type` (`noul` | `choice` | `score`), `instructions` (string, object or array) and `criteria` (shape depends on type). [HIGH] (https://docs.typesafe.ai/api "Question types", /primitives "Define a question")

**The primitives.** Exactly three are documented, and I found no others. Vercel's AI SDK renames Noul to `boolean` with a `probability` field. [HIGH]

| Primitive | Asks | `criteria` | Answer fields | Confidence? |
|---|---|---|---|---|
| **Noul** | Is this yes/true? | Optional `{true, false}` descriptions | `noul`: probability of yes, 0 to 1 | No. The single number is the whole answer |
| **Choice** | Which one option? | Map of option name to description (or `null`), max 255 | `choice` (highest-probability option), `probabilities` for every option (sum to 1), `confidence` 0 to 1 | Yes |
| **Score** | Where on an ordered rubric? | Ordered array of level descriptions, at least 2, at most 10 | `score` (probability-weighted mean of level indices, can fall between levels), `legend` (index to description), `probabilities` per level, `confidence` | Yes |

Sources: https://docs.typesafe.ai/api ("Answer types"), https://docs.typesafe.ai/primitives ("What comes back"), https://vercel.com/docs/ai-gateway/modalities/evaluation . [HIGH]

**Distribution and confidence both come back.** Choice and Score return the full distribution plus `confidence`. TypeSafe describes `confidence` as a statistic computed from the shape of that distribution (peaked means high, flat means low), and says you are free to compute your own measure from `probabilities`. [HIGH] (https://docs.typesafe.ai/confidence)

**Response envelope.** `model` (the versioned ID that answered), `answers` (keyed by your IDs, each with a `type`), `usage.input_tokens`, `usage.output_tokens`. [HIGH] (openapi.json `SystemOneResponse`)

**Semantics.** All questions in one request run in parallel and independently. No answer becomes context for another, and a question that genuinely depends on an earlier answer needs a second request. Jev writes no text, code, explanations or tool calls and holds no conversation. TypeSafe says it cannot replace the LLM behind a coding agent. [HIGH] (https://docs.typesafe.ai/primitives "When one question depends on another", https://docs.typesafe.ai/introduction/coding-agents)

**Examples.** The docs show one worked request/response per primitive at https://docs.typesafe.ai/api . Below are shape-accurate examples in my own wording, with field names exactly as documented. Values in angle brackets are placeholders, not results.

Noul (request fragment and answer):
```json
{
  "model": "jev-latest",
  "state": {"message": "My parcel came broken. I want my money back."},
  "questions": {
    "wants_refund": {
      "type": "noul",
      "instructions": "Does `message` ask for a refund?",
      "criteria": {"true": "Asks for money back", "false": "No request for money back"}
    }
  }
}
```
Answer: `{"wants_refund": {"type": "noul", "noul": <0..1>}}`. The API reference's own Noul example reports `noul` 0.95 with usage 307 input and 20 output tokens. [HIGH]

Choice:
```json
"route": {
  "type": "choice",
  "instructions": "Which team should own `message`?",
  "criteria": {"returns": "Damaged or wrong items", "billing": "Charges and refunds", "other": null}
}
```
Answer: `{"type": "choice", "choice": "<option>", "probabilities": {"returns": <p>, "billing": <p>, "other": <p>}, "confidence": <0..1>}`. The API reference example reports probabilities 0.88 / 0.12 / 0.0, confidence 0.81, usage 318 input and 34 output tokens. [HIGH]

Score:
```json
"anger": {
  "type": "score",
  "instructions": "How angry is `message`?",
  "criteria": ["Calm", "Annoyed", "Furious"]
}
```
Answer: `{"type": "score", "score": <0..2>, "legend": {"0": "Calm", "1": "Annoyed", "2": "Furious"}, "probabilities": {"0": <p>, "1": <p>, "2": <p>}, "confidence": <0..1>}`. The API reference example reports score 1.05, level probabilities 0.0 / 0.95 / 0.05, confidence 0.92, usage 304 input and 18 output tokens. [HIGH]

Errors: 401 bad key, 422 validation, 429 rate limit, 529 overloaded. Back off and retry on 429 and 529. [HIGH] (https://docs.typesafe.ai/api "Errors")

---

## 2. Limits

| Limit | Value | Source | Conf |
|---|---|---|---|
| State + longest single question | 32k tokens | https://docs.typesafe.ai/models (Context length) | HIGH |
| State + all questions | 64k tokens per request | same | HIGH |
| Context shown by hosts | 32K on OpenRouter, 32,000 on Cloudflare | https://openrouter.ai/typesafe/jev-1.13 , https://developers.cloudflare.com/ai/models/typesafe/jev/ | HIGH |
| What happens over the limit | Request fails with `max_tokens_exceeded` | https://pydantic.dev/docs/ai/models/typesafe/ (Costs and limits) | MEDIUM |
| Size in bytes or characters | NOT FOUND in TypeSafe docs. Flavio Copes estimates roughly 150,000 English characters for 32k tokens. Pydantic warns that a 4-characters-per-token estimate undercounts the JSON Jev is sent by about a quarter | https://flaviocopes.com/jev/ , Pydantic page | MEDIUM |
| Max questions per request | NOT FOUND as a number. It is bounded by the 64k-token budget. TypeSafe's docs include a single request with 62 questions (structure-recovery cookbook, 0.51 s) | https://docs.typesafe.ai/cookbooks/autoformat (Appendix) | HIGH for the 62 |
| Choice options | Max 255. TypeSafe's high-cardinality demo used a two-stage score-then-choose workaround. A 256th option gets HTTP 400 | https://docs.typesafe.ai/api (Choice criteria), blog (Wikiracing nuance), Pydantic page | HIGH / MEDIUM |
| Score levels | At least 2 (docs say "should"), at most 10. An 11th gets HTTP 400. The OpenAPI schema itself only enforces a minimum of 1 | https://docs.typesafe.ai/api (Score criteria), Pydantic page, openapi.json | HIGH / MEDIUM |
| Input types | Text only: a string, a JSON object, or an array of text values. No image, audio or video. `instructions` and `criteria` also accept JSON | https://docs.typesafe.ai/models (Input), /primitives/advanced | HIGH |
| Raw HTML | NOT FOUND (no guidance). It is text, so presumably accepted as a string, but markup spends tokens and TypeSafe says irrelevant content lowers accuracy | inference from /models and the jaggedness page | LOW |
| A whole web page | No explicit statement. TypeSafe's own cookbook sent the plain-text extract of the GDPR Wikipedia article (about 54,000 characters) as state in one request with 13 questions: 0.27 s, $0.000497, which works out to about 11,800 input tokens | https://docs.typesafe.ai/cookbooks/parallel_questions (token figure is my arithmetic from the cost) | HIGH / LOW |
| Languages | English is the primary training language and the most accurate. Other languages, CJK included, are accepted but less accurate. Test first and watch confidence | https://docs.typesafe.ai/models (Language support), /concepts/state | HIGH |
| Hindi | NOT FOUND. No statement or measurement anywhere | - | NOT FOUND |
| Streaming | No streaming concept in the TypeSafe API (one JSON response). Requesty rejects `stream: true` with a 400 | https://docs.requesty.ai/features/decisions | MEDIUM |
| JS SDK timeout | 10,000 ms per attempt by default | https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig | HIGH |

---

## 3. Pricing

- **What is billed:** input tokens only, at **$0.042 per million** ($42 per billion). Input means the state plus every question's instructions and criteria. [HIGH] (https://docs.typesafe.ai/models "Price", blog Cost row)
- **Is output really free?** Yes, for now. `usage.output_tokens` is reported but not charged, and the OpenAPI spec says output is free **at present**, not permanently. [HIGH] (openapi.json `Usage.output_tokens`) Independent check: in OpenRouter's published responses, `usage.cost` equals input tokens × $0.042/M exactly (357 input tokens → $0.000014994). [MEDIUM, my arithmetic] (https://openrouter.ai/blog/insights/what-is-jev/)
- **Per-call minimum:** NOT FOUND. TypeSafe's own examples report 296 to 328 input tokens for a one-sentence state with a single short question (392 with three questions), which implies a fixed overhead of roughly 300 tokens (about $0.0000126) on every request. [docs numbers HIGH, overhead inference MEDIUM] (https://docs.typesafe.ai/api , https://flaviocopes.com/jev-pricing/)
- **Free tier:** NOT FOUND in TypeSafe docs or legal pages. Secondary sites report a $5 credit for accounts created during the 20 to 22 Sep open window, but TypeSafe's own 20 Sep announcement post does not mention it. [LOW] (https://www.firecrawl.dev/blog/what-is-jev , https://www.jevaiplayground.com/blog/jev-open-access-free-credit) The Master Customer Agreement runs on prepaid credits and lets TypeSafe issue discretionary Promotional Credits. Purchased credits expire after 12 months unless the order says otherwise. [HIGH] (https://typesafe.ai/legal/mca §8.2)
- **Free or cheaper routes:** OpenCode Zen lists `jev-1.13-free` at no charge for a limited period, alongside `jev-1.13` at $0.042. [HIGH, host doc] (https://opencode.ai/docs/zen/) Vercel's $5 monthly gateway credit can be spent on Jev. [MEDIUM] (https://flaviocopes.com/jev-pricing/)
- **Early-access vs GA pricing:** NOT FOUND. No GA price is published. TypeSafe's homepage FAQ says it can serve Jev profitably at current prices. The launch post says it expects prices to fall, but admits it cannot prove the price is not subsidized. [HIGH] (homepage FAQ in the site bundle, blog "Evidence / Technical Results")
- **Rate limits:** 250,000 tokens per second and 1,200 requests per minute. Going over returns 429. TypeSafe warns the limits are being adjusted as demand and GPU capacity change and can move without notice. Higher limits come on custom or enterprise plans. [HIGH] (https://docs.typesafe.ai/models)
- **Enterprise:** zero data retention is offered to enterprise customers through sales. [HIGH] (https://docs.typesafe.ai/legal)
- **Vendor cost anecdote:** the Doom demo ran about 10 queries a second for roughly $7 an hour. [HIGH] (blog "Doom")

| Host | Input / 1M | Output | Notes | Conf |
|---|---|---|---|---|
| TypeSafe direct | $0.042 | free | prepaid credits | HIGH |
| Cloudflare Workers AI | $0.042 | $0.00 | cached input $0.00 | HIGH |
| OpenRouter | $0.042 | $0 | single upstream provider (TypeSafe) | HIGH |
| Vercel AI Gateway | same rate | free | billed via Gateway or BYOK | HIGH / MEDIUM |
| Requesty | $0.042 | free | experimental integration | MEDIUM |
| OpenCode Zen | $0.042, or free for `jev-1.13-free` | free | free variant is time-limited | HIGH |

---

## 4. Latency

**What "40-200x faster" measures.** The blog's comparison table puts Jev's end-to-end response time at 70 to 500 ms and says this is 40x to 200x faster than frontier models, whose end-to-end time it gives as 3 to 329 s, citing a third-party site (llm-benchmarks.diegoromero.es). So the claim is **per-call latency, not throughput**. [HIGH] The homepage's 193.6x comes from TypeSafe's workflow evals, where the time is **per workflow case**, and a case can involve several rounds of questions (the invoice workflow has seven). [HIGH] (blog "Workflow evals", https://evals.typesafe.ai/invoice_processing.html) No throughput figure is published beyond the 250,000 tokens/s rate limit. [NOT FOUND]

**TypeSafe-published numbers** (all vendor-run. The blog says its evals run from laptops on the US West Coast, where the service is based):

| Figure | Conditions | Source | Conf |
|---|---|---|---|
| 70 to 500 ms end to end | none given | blog Speed row | HIGH |
| about 100 ms for most queries | none given | https://docs.typesafe.ai/concepts/how-to-build-with-system-one (Fast card) | HIGH |
| 150 ms ("real-time") | none given | https://docs.typesafe.ai/concepts/use-case-map | HIGH |
| under 100 ms | investor's description | DCVC post | HIGH |
| 0.114 s vs 8.566 s LLM ($0.000081 vs $0.013880) | homepage side-by-side demo. The blog admits the short, dense state flatters Jev. The Register says the LLM was GPT-5.6 Terra | https://typesafe.ai , blog "Side-by-side demonstration" | HIGH |
| 114 ms mean round trip | 8 Choice questions on one post, 15 sequential calls, jev-1.13.0, 11 Sep | docs consistency_choice_cookbook | HIGH |
| 111 ms mean | 14 Noul questions on one insurance claim, 15 calls | docs consistency_noul_cookbook | HIGH |
| 0.27 s batched vs 2.71 s for 13 single calls (summed) | 13 questions over the ~54,000-character GDPR article, about 11.8k tokens, jev-1.12 | docs parallel_questions | HIGH |
| 0.32 s (16 questions) and 0.51 s (62 questions) | structure recovery, two requests, 10,211 tokens | docs autoformat | HIGH |
| 0.3 to 0.5 s per case (0.4 s mean) | four workflow evals | https://evals.typesafe.ai/ | HIGH |
| 4x (live shadow), 2.8x, 1.9x (offline), parity (PII guardrail) | Deel's evals vs the frontier LLM Deel runs today, published by TypeSafe | TypeSafe on X, 25 Sep (charts) | HIGH (vendor-published) |

**Independent numbers:**

| Figure | Conditions | Source | Conf |
|---|---|---|---|
| p50 175 ms, p95 270 ms, p99 353 ms | 3,080 Banking77 requests, mean 2,605 input tokens, 8 concurrent, via OpenRouter, 22 Sep. Claude Opus 5 with reasoning off: p50 2,266 ms (about 13x slower) | https://openrouter.ai/blog/insights/jev-vs-claude-opus-5-classification/ | MEDIUM |
| p50 194 ms, p95 633 ms / 688 ms | 60-ticket triage and 40-message injection screen. GPT-5.6 Luna p50 1,106 / 805 ms, Opus 5 1,957 / 2,099 ms | https://openrouter.ai/blog/tutorials/jev-vs-llm-when-to-use-each/ | MEDIUM |
| p50 0.22 s, 99.90% availability over 3 days | OpenRouter live stats as fetched 27 Sep | https://openrouter.ai/typesafe/jev-1.13 | MEDIUM |
| 0.92 to 0.97 s per call | 776 input tokens, 6 questions, 3 runs, author location not stated. GPT-5.6 Luna via OpenRouter took 3.8 to 8.9 s | https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/ | MEDIUM |
| 0.35 s median per passage vs 8.83 s for Fable 5.1, and 777 judgments in under 0.7 s | Every.to tests, reported by Firecrawl. The Every page itself would not load for me | https://www.firecrawl.dev/blog/what-is-jev | LOW |
| about 250 ms for four questions | pi-warden coding-agent guard, reported by Firecrawl | same | LOW |
| 5x to 18x faster than Luna 5.6 | Vercel engineer's command-safety classifier | https://techcrunch.com/2026/09/18/a-new-kind-of-ai-model-from-a-chatgpt-inventor-is-thrilling-developers/ | MEDIUM |

Adding questions barely changes response time, according to TypeSafe, but its own cookbook shows 16 questions at 0.32 s against 62 at 0.51 s. [HIGH]

---

## 5. Availability today (27 Sep 2026)

**Timeline (UTC):**

| Date | Event | Source | Conf |
|---|---|---|---|
| 15 Sep | Launch in early access. TypeSafe said it was pulling developers off the waitlist as fast as it could | blog "What's next" | HIGH |
| 16 Sep | Live on Vercel AI Gateway (changelog dated 16 Sep) | https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway | HIGH |
| 18 Sep | Listed on OpenRouter | https://openrouter.ai/typesafe/jev-1.13 ("Released") | HIGH |
| 18 Sep | TechCrunch reports the company briefly could not serve API users because of demand | TechCrunch | MEDIUM |
| 20 Sep 21:30 | TypeSafe posts that Jev is open to everyone with no waitlist | https://x.com/typesafeai/status/2101786156572823624 | HIGH |
| 22 Sep 06:19 | TypeSafe temporarily pauses signups because of demand. Existing signups keep working | https://x.com/typesafeai/status/2102281508950307159 | HIGH |
| 24 Sep 18:55 | TypeSafe posts that signups are still closed | https://x.com/typesafeai/status/2103196683932983335 | HIGH |
| 27 Sep | The pause post is still the first (pinned) item on TypeSafe's X timeline, and no reopening post appears up to 08:24 UTC. The homepage FAQ still tells newcomers to join the waitlist | X timeline (syndication fetch), homepage bundle | HIGH for the observation, MEDIUM that signups are still shut |

The console (console.typesafe.ai) sits behind a Cloudflare bot check. I did not try to get past it, so I could not see the live signup state. [NOT FOUND]

**Hosts serving Jev** (every one forwards to TypeSafe. OpenRouter lists a single provider):

| Host | Model ID and endpoint | TypeSafe account needed? | Notes | Conf |
|---|---|---|---|---|
| TypeSafe direct | `jev-latest`, `jev-1.13.0`, `jev-preview` at `https://api.typesafe.ai/v1/systemone` | Yes (new signups paused) | Playground and keys in the console | HIGH |
| Vercel AI Gateway | `typesafe-ai/jev`. AI SDK 7 `experimental_evaluate`, native evaluation API, or a TypeSafe-compatible base URL `https://ai-gateway.vercel.sh/typesafe` | No (Vercel account) | ZDR and no-training toggles per request. BYOK possible. Vercel calls it the fastest-adopted model in its gateway's history (18 Sep post). The AI SDK evaluation API is marked experimental | HIGH |
| OpenRouter | `typesafe/jev-1.13` or `~typesafe/jev-latest`. `POST https://openrouter.ai/api/alpha/decisions` (alpha), or TypeSafe SDKs with base URL `https://openrouter.ai/api` | No (any OpenRouter key) | Also launched a Jev-powered model router on 25 Sep | HIGH |
| Cloudflare Workers AI | `typesafe/jev` via `env.AI.run` or `/ai/run` | No (Cloudflare account) | Tagged third-party, ZDR yes, 32,000 context. Date added NOT FOUND | HIGH |
| Requesty | `typesafe/jev-1.13.0`, `typesafe/jev-latest` via chat/messages/responses APIs with a `questions` response format | No | Experimental, may change with no deprecation period, non-streaming, text-only user messages | HIGH (host doc) |
| OpenCode Zen | `jev-1.13`, `jev-1.13-free` at `https://opencode.ai/zen/v1/systemone` | No | Free variant is time-limited. No data statement for it | HIGH (host doc) |

TypeSafe's own Python SDK docs document the OpenRouter and Vercel routes. [HIGH] (https://docs.typesafe.ai/sdk/python/usage "Configuring the base URL")

**SDKs (TypeScript first):**
- **Official TS/JS:** `@typesafe-ai/sdk` 0.6.0 (npm, MIT, ESM + CJS + type declarations, Node 20 or newer). `client.systemOne({state, questions})` plus `choice()`, `noul()` and `score()` helpers, with answer types inferred from the questions. The initial public release was 0.5.7 on 11 Sep, and 0.6.0 (15 Sep) made `Score.criteria` an ordered array. It refuses to run in a browser unless `dangerouslyAllowBrowser` is set, retries 429 and 529 with backoff, and honours `retry-after`. [HIGH] (https://docs.typesafe.ai/sdk/javascript , changelog, TypeSafeClientConfig, https://registry.npmjs.org/@typesafe-ai%2fsdk)
- **Official Python:** `typesafe-sdk` 0.7.1 (21 Sep), Python 3.10+, sync and async clients, optional pydantic `response_model`. [HIGH]
- **Framework integrations:** Vercel `@ai-sdk/typesafe-ai` 3.0.8 (created 16 Sep) [HIGH]. Pydantic AI `TypeSafeModel` (`pydantic-ai-slim[typesafe]`) [HIGH]. LangChain `langchain-typesafe` `TypeSafeClassifier` with experimental routing and tool-risk middleware [MEDIUM]. OpenRouter TS SDK `alpha.decisions` [MEDIUM].
- **MCP:** I found **no official TypeSafe MCP server** in its docs, its GitHub org (typesafe-ai: SDKs, skills, an LLM adapter, forks) or its npm scope. [MEDIUM, absence of evidence] TypeSafe does ship an **agent skill** for Claude Code (a plugin in the `typesafe-ai/skills` marketplace) and for other agents via `npx skills add typesafe-ai/skills`. [HIGH] (https://docs.typesafe.ai/agent-skill) Community MCP servers exist, among them `@jkudish/jev-mcp`, `jev-mcp`, `@maximem/jev-mcp`, `jevcore-mcp` and `itsmostafa/typesafe-mcp`. [MEDIUM] (npm search, Firecrawl)

---

## 6. The "cannot hallucinate" claim

- **The claim.** The launch post says Jev can't hallucinate and never makes type errors, and the homepage advertises zero hallucinations. [HIGH] (blog intro and comparison table, https://typesafe.ai)
- **What is actually guaranteed.** Every answer is a distribution over the options or levels you supplied, so the model cannot return a value outside your schema. TypeSafe itself says its 0% hallucination figure is not empirical, only a consequence of guaranteed schema matching. The LLM hallucination rates it compared against came from OpenRouter data, which it concedes is biased. [HIGH] (blog "Hallucination and Type-safety" nuance)
- **What is not guaranteed.** Correctness. TypeSafe's homepage FAQ: "Jev guarantees the shape of its answers, not that every decision is correct." It adds that Jev can pick the wrong category from your list. [HIGH] (https://typesafe.ai FAQ "Can Jev still get things wrong?") On Hacker News, Almeida agreed the model can be confidently wrong. [MEDIUM] (https://news.ycombinator.com/item?id=49718780)
- **It cannot abstain on its own.** A Choice always picks one of your options. The docs tell you to add an `other` or "none of the above" option. Zyte skipped it, and Jev labelled a category-listing page as `poetry` with confidence 1.00. [HIGH / MEDIUM] (https://docs.typesafe.ai/primitives/choice , Zyte)
- **Valid shape, wrong question.** Zyte passed options malformed under an `options` key. It was accepted as a valid one-option Choice, and Jev returned that option at confidence 1.0 with no error. [MEDIUM]
- **Structured-output LLMs are not type-unsafe either.** In OpenRouter's Banking77 run, Claude Opus 5 with a strict JSON schema produced 0 invalid responses out of 3,080, the same as Jev. [MEDIUM] TypeSafe's own SDE-cascade cookbook says schema-following mistakes are not the kind of mistake it expects an LLM to make. [HIGH] (docs sde_cascade Overview)

**Calibration evidence:**
- **From TypeSafe:** no reliability diagrams, ECE, Brier scores or public-benchmark results. [NOT FOUND] The blog FAQ says this is deliberate: TypeSafe will publish only one-off evals and wants users to build their own. [HIGH] The docs say calibration holds over groups of predictions, not for any single answer. [HIGH] (https://docs.typesafe.ai/concepts/system-one)
- **Vendor cookbook evidence (not formal calibration):**
  - SEC 10-K industry classification, 60 filings: a 0.9 confidence cutoff splits them in half. The confident half is right 90% of the time and the rest 40%. [HIGH] (docs classification_using_confidence)
  - Choice self-consistency: the plurality label repeats 90.8% of the time, and TypeSafe flips on 2 of 8 questions. With a 0.60 threshold, agreement is 99.2% and 74.2% of answers are handled automatically. [HIGH] (docs consistency_choice_cookbook)
  - Noul self-consistency: mean per-question standard deviation 0.0102, but one borderline answer ranged 0.43 to 0.53, straddling a 0.5 threshold. [HIGH] (docs consistency_noul_cookbook)
  - Jaggedness page: Score levels are weakly calibrated numerically. A question and its negation need not sum to 1 (0.72 + 0.47 = 1.19 in TypeSafe's example). A Noul and a yes/no Choice on the same question are not comparable (0.22 against 0.01). [HIGH] (https://docs.typesafe.ai/model-jaggedness/jev-1.13)
- **Independent:**
  - OpenRouter's Banking77 test found Jev's confidence is not a calibrated probability: it overestimated accuracy in the mid-range, but it ranked well. At confidence 0.99 or higher (58% of items) accuracy was 96.3%. Below 0.5 (3.5% of items) it was 29.6%. Sending everything under 0.90 to Opus gave 84.0% accuracy against Opus-only's 84.4%, at $0.69 against $2.42 per 1,000. [MEDIUM]
  - Not deterministic: OpenRouter got 0.52 and then 0.49 on an identical input, and 0.79/0.69 then 0.84/0.77 on a repeated Choice. Zyte saw borderline answers drift by several points. TypeSafe says it aims for consistency rather than determinism. [MEDIUM / HIGH]

---

## 7. Training and domain

- **Method:** Reinforcement Learning for Calibrated Decisions (RLCD), which trains the model to output decisions with calibrated probabilities instead of text. The algorithm itself is unpublished. [HIGH] (https://docs.typesafe.ai/introduction/machine-learning-primer) On HN, Almeida said the architecture is being kept private for now and a paper has been discussed. [MEDIUM] (HN item 49718824)
- **Data:** TypeSafe's FAQ says it makes all of its training data itself. [HIGH] (blog FAQ) Almeida told TechCrunch Jev is trained exclusively on synthetic data. [MEDIUM, reported speech] (TechCrunch) On X he said the bottleneck is data rather than architecture, and that you need a very diverse input distribution to avoid a jagged model. [HIGH] (https://x.com/CompleteSkeptic/status/2100096532485988676)
- **Architecture:** TypeSafe says only that it built a new model architecture with a parallel sampler. No weights, paper or architecture details are public. [HIGH] (blog intro) **"Transformer-based" is TechCrunch's wording, not a TypeSafe statement I could find.** DataCamp instead calls it a departure from a transformer LLM. TechCrunch reports outside observers suspect it is built on an open-weight LLM, and HN commenters guess at an encoder-style model with output heads. [MEDIUM / LOW] Observation only: TypeSafe's GitHub org has public forks of LLaDA (a diffusion language model) and vLLM. I draw no conclusion from that. [LOW]
- **No customer fine-tuning:** one set of weights serves every account, with no LoRA. You adapt it only through state, instructions and criteria. [HIGH] (https://docs.typesafe.ai/models "Customizing Jev")
- **Good at:** quick common-sense judgments, meaning classify, route, score, detect, verify, rerank, and "extract by choosing" from candidates you supply. The use-case map covers search and retrieval, model routing, LLM guardrails, semantic linting, feature extraction, recruiting, support, insurance, financial crime, legal and compliance, e-commerce, moderation, advertising, gaming, risk, demand forecasting and knowledge graphs. [HIGH] (https://docs.typesafe.ai/concepts/use-case-map)
- **Bad at (jaggedness page for jev-1.13, last reviewed 17 Sep):** [HIGH]
  - literal reading, including scope words and negations
  - arithmetic and counting
  - numeric representations (hex colours, low-level assembly or binary compared with high-level code)
  - interpolating magnitudes from Scores
  - date and time comparison
  - indirection and multi-hop questions
  - large states full of irrelevant detail (context rot)
  - adversarial content, since the state is not treated as hostile
  - instructions that contradict their criteria
  - structural invariants between questions
  - text generation
  
  The homepage FAQ adds extended reasoning such as complex maths or chess-like planning. [HIGH] The console landing page reportedly lists System 2 tasks, specialised domains and anything generative. [MEDIUM] (https://flaviocopes.com/jev-api-key/)
- **Long documents:** accuracy falls as unrelated content grows, TypeSafe says to filter first, and the hard cap is 32k tokens. [HIGH]
- **Comparing two long texts:** NOT FOUND as a named limitation. My inference: such a comparison hits both the 32k cap and the large-state and indirection warnings. [LOW]
- **Non-English:** lower accuracy than English. Hindi is not mentioned. [HIGH / NOT FOUND]

---

## 8. Data policy

- **Training on your data:** the privacy policy says TypeSafe will not train or fine-tune any AI or ML model on your prompts or input. [HIGH] (https://typesafe.ai/legal/privacy-policy) The models page says Jev is not trained on customer requests or responses. [HIGH] The contract is softer: MCA §4.1 bars putting Customer Data in a training set **without the customer's prior consent**. [HIGH] (https://typesafe.ai/legal/mca) MCA §4.3 lets TypeSafe use **Telemetry** (defined to include logs, hashes, summary statistics, classifications, metrics and learnings) without restriction, including to improve its services, and §4.1(c) lets it derive that telemetry from Customer Data **in perpetuity**. [HIGH]
- **Retention:** kept as long as reasonably necessary (privacy policy) or as long as necessary (DPA). The MCA says TypeSafe has no duty to keep data and may delete it at any time, and backups may retain confidential information. No specific retention period is stated. [HIGH / NOT FOUND] (https://typesafe.ai/legal/data-processing) Zero data retention is for enterprise customers only. [HIGH]
- **Region:** the services are hosted in the United States, and data from the EEA or UK is transferred there. The DPA incorporates EU Standard Contractual Clauses. [HIGH] Every subprocessor is US-based: AWS (stores and processes live-request customer data), Modal, Nebius and CoreWeave (process prompts without storing them), Slack and Google Workspace. [HIGH] (https://trust.typesafe.ai/subprocessors , rendered in a browser) No regional hosting option. [NOT FOUND]
- **Via hosts:** Cloudflare lists ZDR as yes. Vercel offers ZDR and no-training per request. OpenCode Zen gives no data statement for `jev-1.13-free`. [HIGH / NOT FOUND]
- **Output use restriction:** customers may not use the service or its output for model distillation or to train a model that imitates it. [HIGH] (MCA §2.3(b))

---

## 9. The honest counter-case

1. **Every headline multiple is self-tested.** The four workflow evals were written by TypeSafe's model-capabilities team, and the company admits possible bias. It calls 193.6x / 444.6x the high end of real-world gains. [HIGH] (blog "Workflow evals" nuance) SiliconANGLE and ts2.tech both note the figures have not been independently verified. [MEDIUM]
2. **The eval measures agreement with other LLMs, not ground truth.** Reference labels average GPT-6 Astra and Claude Fable 5.1. TypeSafe concedes this favours OpenAI and Anthropic models. [HIGH]
3. **Jev is not the most accurate model in its own eval.** Averaged over the four workflows it scores 67.8%. Sol (74.1%) and Opus 5 (73.1%) beat it, and Terra (67.9%) and Sonnet 5 (67.8%) tie it. Its per-workflow results range from 61.7% (security incidents) to 76.0% (customer service). [HIGH] (https://evals.typesafe.ai chart data)
4. **The headline multiples seem to use different comparison models** (my arithmetic on TypeSafe's rounded chart values). About 195x faster matches Sonnet 5's 78.1 s. About 440x cheaper matches Opus 5's $0.1761. Against Sol, the most accurate model, the gap is about 58x faster and 209x cheaper. Against Terra, which is equally accurate, it is about 25x faster and 76x cheaper. TypeSafe does not say which model each multiple is measured against. [LOW]
5. **The LLM baselines were handicapped.** In the evals the LLMs ran through TypeSafe's own wrapper, which it admits is slower and more expensive. The 3 to 329 s baseline spans long-reasoning runs, which HN commenters called apples-to-oranges. The launch demo used a short input that TypeSafe admits flatters Jev. In the consistency cookbooks the LLMs ran in a 16-way thread pool while Jev ran sequentially. [HIGH / MEDIUM]
6. **Independent speed-ups are 4x to 25x, not 40x to 200x.**
   - OpenRouter Banking77: 13x faster than Opus 5.
   - OpenRouter triage: 5.7x faster than GPT-5.6 Luna.
   - Zyte: about 4x to 10x faster than Luna.
   - Every (via Firecrawl): about 25x faster than Fable 5.1.
   
   TypeSafe's own customer case (Deel) shows **1.9x to 4x**, with parity on the PII guardrail. [MEDIUM / HIGH]
7. **Against a small LLM the cost gap shrinks.** Jev cost $0.0248 per 1,000 tickets against GPT-5.6 Luna's $0.0921 (about 3.7x) at identical accuracy. Zyte measured about 7x. [MEDIUM]
8. **Accuracy trails frontier models on real tasks.**
   - Banking77: 81.0% against Opus 5's 84.4% (a 2.3 to 4.4 point gap at 95% confidence). Opus led on 35 of 77 intents and Jev on 15.
   - Deel: 2 of 8 checks got worse, down 3.6 points on 3-level root-cause tagging and **down 16.6 points on messy real questions**.
   - Every (via Firecrawl): Jev caught 6 of 7 planted defects, Fable 5.1 caught all 7.
   - TechCrunch: one developer found Gemini slightly more accurate, though 10x to 20x more expensive. [MEDIUM / HIGH]
9. **Confidence is not reliably calibrated** (OpenRouter), can be 1.00 on a wrong answer (Zyte), and **runs are not deterministic**. [MEDIUM]
10. **No abstention by default:** a Noul or Choice always answers. HN commenters point out it cannot qualify an answer, for example a yes that only applies later. [HIGH / MEDIUM]
11. **The "hallucination" framing is contested.** The Register calls the hallucination-free claim an unfair comparison, since Jev's output is not natural language and can still be wrong. HN users called the 0% chart misleading. The thread's original title advertised 40-400x cheaper and 20-200x faster, and was changed within the hour. [MEDIUM]
12. **Opaque model:** no paper, no weights, no architecture, no public benchmarks by policy. Almeida says it is not an LLM, yet observers suspect an open-weight LLM base. Skeptics on r/LocalLLaMA and r/singularity called it a rediscovered classifier or a logprobs wrapper. [HIGH / MEDIUM]
13. **The interface is easy to approximate.** The open "openjev/SemIf" project reads option logits from Qwen3.5-4B on one RTX 3090 and scores 0.845 modal agreement against Jev's published 0.883 on a 102-row subset. That compares against TypeSafe's published records, not a live run. [MEDIUM] (https://github.com/TheoLeeCJ/openjev)
14. **Known failure modes are broad:** everything in the jaggedness list, including adversarial steering. That matters for any state built from untrusted web text, which Zyte flags. [HIGH]
15. **Language:** English-first. No evidence for Hindi or Indian languages. [HIGH / NOT FOUND]
16. **Access and capacity are unstable.** There was a waitlist, then open signup, then a pause within about 48 hours. TechCrunch reported a serving outage. Rate limits can change without notice. The OpenRouter and Requesty integrations are alpha or experimental. Every host is a pass-through to one provider. [HIGH / MEDIUM]
17. **Price durability is unproven.** TypeSafe admits it cannot prove the price is not subsidized, and the API spec frames free output as a present-tense policy. [HIGH]
18. **Data terms are softer in the contract than in the marketing.** Training is possible with consent. Telemetry, which includes learnings drawn from your data, is unrestricted and perpetual. Processing is US-only, and ZDR is enterprise-only. [HIGH]
19. **Fixed overhead of about 300 tokens per call** means tiny states pay mostly overhead. [MEDIUM]
20. **The docs contradict themselves in small places.** See the next section. [HIGH]

---

## Discrepancies between sources

- **Speed range:** the blog says 40x to 200x. Almeida's launch post and the original HN title say 20x to 200x. DCVC and SiliconANGLE say often, or up to, 100x. [HIGH / MEDIUM]
- **"40-400x cheaper":** this comes from Almeida's X launch post (https://x.com/CompleteSkeptic/status/2099925682726002904). The blog body gives no 40x to 400x cost range. It says two orders of magnitude, and the homepage says 444.6x. [HIGH]
- **Batching savings:** the parallel-questions cookbook reports 12.2x cheaper and 10.0x faster. The Primitives page cites 11.5x and 9.6x for the same cookbook. The cookbook also notes its speed figure assumes the 13 single calls run one after another. [HIGH]
- **Structure-recovery cost:** the cookbook prints $0.0003 in its output but says $0.0015 in the text. [HIGH]
- **"Transformer-based" and "exclusively synthetic data":** TechCrunch only (Wikipedia cites it). TypeSafe's own pages say only that it makes all its data and built a new architecture. [MEDIUM]
- **"Limited early access with a waitlist":** true on 15 Sep. Superseded by open access on 20 Sep and paused signups from 22 Sep. [HIGH]
- **Score minimum:** the docs say at least 2 levels, but the OpenAPI schema allows 1. [HIGH]
- **HN thread size:** 1,984 points and 518 comments when I fetched the Algolia API on 27 Sep. Earlier secondary counts were 1,821/480 (Firecrawl) and 1,900+/509 (Zyte). [HIGH]

---

## Sources

TypeSafe primary:
- https://typesafe.ai/blog/introducing-system-one-models-and-jev (plus FAQ answers from the embedded page data)
- https://typesafe.ai/ (plus homepage FAQ answers from the Framer bundle https://framerusercontent.com/sites/43bTeC8cU9jZO20XvdK79t/171KXiw--aEjOOLIvEYghSneCMRcoGhTxc5arIope3I.DlVZnCjt.mjs)
- https://docs.typesafe.ai/ (redirects to /introduction), https://docs.typesafe.ai/llms.txt , https://docs.typesafe.ai/llms-full.txt (used for /api, /models, /model-jaggedness/jev-1.13, /primitives, /primitives/choice, /primitives/noul, /primitives/score, /primitives/advanced, /confidence, /concepts/state, /concepts/system-one, /concepts/how-to-build-with-system-one, /concepts/use-case-map, /introduction/quickstart, /introduction/coding-agents, /introduction/machine-learning-primer, /legal, /agent-skill, /sdk, /sdk/javascript, /sdk/javascript/changelog, /sdk/javascript/api/interfaces/TypeSafeClientConfig, /sdk/python, /sdk/python/changelog, /sdk/python/usage, /patterns/fan-out, and cookbooks parallel_questions, consistency_choice_cookbook, consistency_noul_cookbook, classification_using_confidence, autoformat, sde_cascade)
- https://api.typesafe.ai/docs/ , https://api.typesafe.ai/openapi.json
- https://evals.typesafe.ai/ , /security_incidents.html , /agent_trace_observability.html , /invoice_processing.html , /customer_service.html
- https://typesafe.ai/legal/privacy-policy , /legal/terms , /legal/data-processing , /legal/mca , /legal/acceptable-use-policy , https://typesafe.ai/manifesto , https://typesafe.ai/team
- https://trust.typesafe.ai/subprocessors (JavaScript-only. Plain fetch returned nothing, so I read it in a browser pane)
- https://console.typesafe.ai/ (**FAILED**: 403 and a Cloudflare bot check, not bypassed)
- X posts, fetched through api.fxtwitter.com and syndication.twitter.com: typesafeai/status/2101786156572823624 , /2102281508950307159 , /2103196683932983335 , /2103321890190491710 , /2103321892421865838 , /2103321894661595551 , /2103321896553210029 , /2103612889655353346 . CompleteSkeptic/status/2099925682726002904 , /2100096532485988676 . The Deel chart images were on pbs.twimg.com
- https://api.github.com/orgs/typesafe-ai/repos , https://registry.npmjs.org/@typesafe-ai%2fsdk , npm registry search API
- https://www.dcvc.com/news-insights/typesafe-emerges-from-stealth-with-a-new-way-of-doing-ai/

Secondary and hosts:
- https://en.wikipedia.org/wiki/Jev_(AI_model) (raw wikitext)
- https://pydantic.dev/docs/ai/models/typesafe/
- https://developers.cloudflare.com/ai/models/typesafe/jev/ (plus its index.md), https://developers.cloudflare.com/changelog/product/workers-ai/ (no Jev entry found)
- https://openrouter.ai/blog/insights/what-is-jev/ , https://openrouter.ai/typesafe/jev-1.13 , https://openrouter.ai/blog/insights/jev-vs-claude-opus-5-classification/ , https://openrouter.ai/blog/tutorials/jev-vs-llm-when-to-use-each/ , https://openrouter.ai/docs/guides/community/typesafe-sdk
- https://www.requesty.ai/blog/typesafe-jev-explained , https://docs.requesty.ai/features/decisions
- https://www.langchain.com/blog/building-a-harness-with-jev
- https://vercel.com/i/what-is-jev , https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe , https://vercel.com/docs/ai-gateway/modalities/evaluation , https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway , https://vercel.com/blog/ai-gateway-jev-model-launch , https://ai-sdk.dev/docs/ai-sdk-core/evaluation
- https://www.datacamp.com/blog/system-one-models-jev (curl got 403, WebFetch succeeded)
- https://flaviocopes.com/jev/ , https://flaviocopes.com/jev-api-key/ , https://flaviocopes.com/jev-pricing/
- https://www.tomshardware.com/tech-industry/artificial-intelligence/typesafe-ais-jev-offers-an-alternative-to-llms-that-claims-to-be-193x-faster-and-445x-cheaper-system-one-type-model-is-bespoke-for-probabilistic-decision-making
- https://gist.github.com/pjburnhill/adf8d28efcad9df037bfdece178ef965 (via the GitHub API. It is a community summary of the docs, published unfinished and ending mid-sentence, with no new primary facts)
- https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/
- https://www.firecrawl.dev/blog/what-is-jev
- https://techcrunch.com/2026/09/18/a-new-kind-of-ai-model-from-a-chatgpt-inventor-is-thrilling-developers/
- https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711
- https://siliconangle.com/2026/09/16/typesafe-ai-exits-stealth-with-40m-to-build-ai-for-use-by-software/
- https://ts2.tech/en/typesafe-ai-raises-40-million-for-jev-but-its-445x-cost-claim-is-still-self-tested/
- https://www.therundown.ai/articles/chatgpt-co-creator-launches-a-new-kind-of-ai
- https://news.ycombinator.com/item?id=49717558 (via https://hn.algolia.com/api/v1/items/49717558)
- https://github.com/TheoLeeCJ/openjev (README via the GitHub API)
- https://opencode.ai/docs/zen/
- https://www.jevaiplayground.com/blog/jev-open-access-free-credit (WebFetch)
- **FAILED:** https://www.forbes.com/sites/the-prompt/2026/09/15/this-200-million-startup-wants-to-fix-ais-overconfidence-problem/ (403). https://www.businesswire.com/news/home/20260915525333/en/ (403). https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds (JavaScript-only, no article text. Its figures above come from Firecrawl)
