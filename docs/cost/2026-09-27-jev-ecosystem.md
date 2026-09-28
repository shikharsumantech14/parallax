# The Jev / TypeSafe AI open-source ecosystem — a catalogue

Compiled 2026-09-27, twelve days after Jev's 2026-09-15 early-access launch. GitHub metadata (stars, language, last push) pulled live via `gh api` where noted "verified"; everything else is attributed to the page or README it came from and marked accordingly. Nothing below is invented — where a number, star count or date could not be read, it says "not read."

**What Jev is** (for reference, not evaluated here): TypeSafe AI's first "System One" model. It does not generate text. It takes a `state` (text or JSON) plus typed `questions` and returns typed answers — **Choice** (pick one of up to 255 options), **Score** (rate on a defined rubric), **Noul** (probability a statement is true) — each with a calibrated probability distribution and a confidence score, in one forward pass (no token-by-token generation). Trained with RLCD (Reinforcement Learning for Calibrated Decisions). Pricing snapshot dated 2026-09-18 in the primary community list: **$0.042 / 1M input tokens, output free**; listed rate limits 250,000 tokens/second and 1,200 requests/minute (both stated as subject to change); vendor-reported end-to-end latency 70–500ms. Endpoint `POST https://api.typesafe.ai/v1/systemone`, model alias `jev-latest` (currently `jev-1.13.0`). Source: [kraayenjon/awesome-jev](https://github.com/kraayenjon/awesome-jev) README, citing [typesafe.ai's launch post](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and [docs.typesafe.ai/models](https://docs.typesafe.ai/models).

The ecosystem is large and growing fast: madewithjev.com's own tracker cites 729 catalogued builds and its `/github-repos` page is titled with a count of **330** GitHub repos; [kydlikebtc/awesome-jev](https://github.com/kydlikebtc/awesome-jev) claims **1,207** indexed resources; the awesome-jev README cites an arXiv survey ([2609.30216](https://arxiv.org/abs/2609.30216), title/abstract only — I did not independently fetch this paper) claiming **2,170** public GitHub projects as of 2026-09-22. I directly pulled live metadata (via `gh api`) or read READMEs for roughly 90 distinct repos in this pass; ~50 are catalogued below with a clear fit to the pipeline's needs. The rest — a rough count, not exhaustive — break down as: ~17 games/toy demos (Doom, Tetris, Pac-Man, chess, poker, Snake, StarCraft, Civ II, Pokémon Red, gomoku, etc.), ~11 browser/computer-use agents (jev-ultrafast, jev-browser variants, mobile/OS automation, ad blockers), ~15 "awesome-jev" directory duplicates (a classic land-rush on the list name), ~15 SDK/client libraries (Go, Rust, Ruby, Elixir, PHP, Swift, Scala, .NET — infrastructure, not pipeline patterns), ~30+ open decision-model reproductions not wired into any concrete task (AnyJev, reflex, tev1, Kev, von, Laya, NanoJev, jevos, etc.), and ~15 business/vertical demos (trading bots, home automation, Discord moderation) with no fit to (a)–(g). These are counted, not catalogued in detail below, per the task's instruction to skip repos with no relevance to (a)–(g).

---

## 1. Real reported latency / cost / state-size numbers

All figures below are **as reported by the named source**, not independently measured by me. Where a page explicitly says its own numbers are self-reported/vendor-reported, I've kept that caveat.

### From an independent, non-ecosystem source (Zyte, web scraping) — [zyte.com blog](https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/)
- **Cost**, per record with six validation questions: Jev **$0.000033** vs. a generative model **$0.000232–$0.000262** (~7× more expensive).
- **Latency**: Jev consistently **0.92–0.97s**; the generative model **3.8–8.9s** (highly variable).
- **State limit stated for the official Jev API**: **64k tokens/request** (32k for the state, 32k for the questions).
- Verdict (theirs): fine for narrow post-extraction validation gates and pre-extraction routing switches, tuned on your own data; not a fit for extraction itself since Jev cannot generate text — "if a regex, a status code, or a CSS class can answer the question, do not ask a model."

### From madewithjev.com's own "Jev Engineering" explainer — [madewithjev.com/what-is-jev-engineering](https://madewithjev.com/what-is-jev-engineering)
- Batching: **13 questions in one call cost 11.5× less than issuing them separately** (their measurement, methodology not shown).
- 1,018 research papers classified: **$0.08 total, 256ms median latency**.
- 500 emails categorized: **3.5 cents**.
- Flight-search agent: **7s, $0.0039**.
- Fraud detection: **100 emails in 1.42s, 96% accuracy, ~$0.07**.

### From madewithjev.com's Claude Code page — [madewithjev.com/jev-with/claude-code](https://madewithjev.com/jev-with/claude-code)
- **Context compaction**: one build compressed a session from **~1,000,000 tokens to ~86,000 tokens in "roughly a second"** by deleting stale tool outputs rather than summarizing them (this is the closest real number to the "fixed context every phase re-reads" cost problem).
- Rule enforcement: **348ms per check**, 93.3% of broken rules caught (one build, unnamed in what I could read).
- The widely-quoted **"200× faster / 400× cheaper"** figures originate from a single builder's published stack (CyrilXBT) and are explicitly flagged, by this same page, as **a ceiling, not a typical result** — they hold only where decisions are "high frequency, low ambiguity, tightly bounded," e.g. triage queues and CI gating; a workload that's mostly generation gets none of it.

### From the featured-builds table in [kraayenjon/awesome-jev](https://github.com/kraayenjon/awesome-jev) (each row sourced to the original author's own post; the README itself says "all figures are as reported by each author, not measured by this list")
| Build | Numbers reported | Source |
|---|---|---|
| Every's editorial vibe check (37 docs × 21 questions, 6/7 planted defects caught) | 1,709 judgments, **<$0.01**, **0.35s median** | [Every.to essay](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds) |
| 3,282 X posts, 8 questions each | 4.25M tokens, **$0.1282**, 8m34s | [X post](https://x.com/iannuttall/status/2100668908227162567) |
| SuperX post scoring, 61 questions/draft | **~1s, $0.0004/draft** | [X post](https://x.com/robj3d3/status/2100722975645598191) |
| 724 competitor ads across 37 brands | **~40s, ~$0.09** | [X post](https://x.com/TheMattBerman/status/2100654891756589230) |
| typesafe-computer-use, one decision/step | **~$0.0002/step** | [GitHub](https://github.com/awlevin/typesafe-computer-use) |
| 100,000 posts, 14 yes/no questions each | **20.4s, $0.67** | [X post](https://x.com/0xMovez/status/2101325703635435523) |
| Tocsin: 22.8M log lines grouped, one question each | **~6 min, $0.64** | [GitHub](https://github.com/TPAteeq/tocsin) |
| 1,891 ads tagged (hook/offer/format) | **19s, $0.12** | [X post](https://x.com/aresotik/status/2100949805573030378) |
| 2,300 AI papers screened | **~83s, ~$0.14** | [X post](https://x.com/KennyChinaTech/status/2102201611502448865) |
| 700 leads scored | **40s, $0.09** | [X post](https://x.com/romanbuildsaas/status/2100891604735099103) |
| Second-hand shopping agent, per-item match | **~26 listings/min, 406ms, $0.00085** | [X post](https://x.com/AlanDaitch/status/2100757989212754085) |
| Jev blocks a $50,000 transfer (one Noul) | **95% irreversible-risk score, 94% sensitivity** — refused | [X post](https://x.com/fluixoo/status/2102680895425503354) |
| tax-doc-classifier (261 IRS forms) | **100% strict accuracy, ~$0.001/page** (verified via `gh api`, see catalogue below) | [GitHub](https://github.com/kyotofin/tax-doc-classifier) |
| jgrep, filters lines by meaning | **~200ms and a thousandth of a cent per line** | [GitHub](https://github.com/keltokhy/jgrep) |

### jev-mcp's own examples (real request/response pairs shown in its README, not vendor benchmarks)
- Per-tool latency: **150–500ms**, "a fraction of a cent" (not quantified further).
- `jev_classify` example: 4 items classified in one call for **669 input tokens**.
- `jev_review` example: **855 input / 79 output tokens**. (Note: output tokens are billed at $0 per the official pricing, and per the openjev-server example below, Jev's own responses show `output_tokens: 0` — jev-mcp's `79` here likely reflects the wrapping provider's accounting, not raw Jev usage; not reconciled further.)
- `jev_gate` example: **1,559 input / 201 output tokens**.
- `jev_rerank` cites TypeSafe's own [rerank cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe) reporting a CLERC-benchmark lift from **top-1 5%→18%, top-10 38%→62%** — secondhand via this README, not independently checked against the cookbook page.

### State-size / request limits people actually hit (item 5)
- **Official Jev (per Zyte, for the hosted API)**: 64k tokens/request, split 32k state / 32k questions.
- **jev-mcp** (wraps the hosted API): `jev_rerank` up to 250 candidates / 100,000-char aggregate; `jev_classify` up to 250 classes × 64 items/call with an 8,000 item-class budget, item text truncated at 2,000 chars; `jev_compare` passages capped at 20,000 chars each; `jev_extract` document capped at 50,000 chars; `jev_review`/`jev_gate` text fields capped at 50,000 chars, claims at 2,000, evidence at 200,000 chars aggregate; `jev_noul` up to 64 propositions/call, 2,000 chars each, 150,000-char combined budget; `jev_find` up to 250 candidates, 2,000 chars each.
- **jev-recipes**: `routeMany` batches up to 500 requests, 20 per batch by default; accuracy is reported to fall as batch size grows (tune per your own data).
- **OpenJev, the zhihz local research preview**: 2–8 candidates/question, 4,096 full-prompt tokens/question (incl. chat template), 16 questions in its UI / 100 via API.
- **openjev-server** (the other OpenJev, the 27B model + server): up to 52 options answered in one pass, more handled in two passes.
- **Official Choice cardinality** (hosted Jev): 255 options max.

---

## 2. The "LLM writes, Jev decides" harness pattern

The ecosystem's own name for this is **"Jev Engineering"** (madewithjev.com's coinage, widely reused). The three-way split, as stated on [madewithjev.com/what-is-jev-engineering](https://madewithjev.com/what-is-jev-engineering):

- **The LLM writes**: drafting, summarizing, filling in prose fields — open-ended generation.
- **Jev decides**: which worker/action goes next, how relevant a source is, whether to approve a tool call, yes/no questions — bounded, enumerable decisions.
- **Code acts**: enforces the hard rules (stop after N actions, require approval for X, execute the actual side effect). Jev's answer is read but never trusted blindly.

Seven "shared principles" the page says recur across builds: send Jev the actual evidence, not a summary; write out full option descriptions, not cryptic enum names; rebuild the option list fresh at each step rather than reusing a stale fixed list; batch questions in one call (11.5× cost reduction cited); act only above a confidence threshold tuned on your own labeled data, not a vendor default; verify a "done" answer in code rather than trusting it; and measure cost per finished task, not per individual decision.

**Specifically for Claude Code** ([madewithjev.com/jev-with/claude-code](https://madewithjev.com/jev-with/claude-code)): the split there is Claude generates/reviews, Jev classifies. One audit reportedly counted 31 yes/no-or-categorical checks in a single refactor session, i.e. an estimated 25–40% of a typical agent loop's calls are actually classification, not writing — this is the number the "200×/400×" headline is built from, and it is explicitly scoped to that high-frequency-classification slice of a session, not the whole thing. Concrete builds: `jev-router` ("route to the cheapest model that can do it") and `fast-jev-compaction` (the ~1M→86K-token compaction mentioned above). Failure mode flagged on the same page: Jev "can select the wrong option inside a valid schema and return it with a clean confidence" — a wrong-but-well-typed answer looks identical to a right one unless you calibrate thresholds on your own data.

**From the specifically-requested LangChain post**, [langchain.com/blog/building-a-harness-with-jev](https://www.langchain.com/blog/building-a-harness-with-jev): describes the same LLM-writes/Jev-decides split, with two concrete decision points — (1) **model routing**: a Choice picks between a fast and a powerful model per incoming request; (2) **tool-risk gating**: Jev checks a proposed tool call for risk via an `AutoModeMiddleware` before it executes (the primitive used for this second one is not stated in what I could read — plausibly Noul given the yes/no framing, but not confirmed). The one number this post states directly: **"up to 200x faster inference and 400x lower cost than comparable LLMs on classification tasks."**

**A second, separate LangChain post** answers the "500 repeated judgements" benchmark the task asked about — this is at [langchain.com/blog/jev-agent-evals-langsmith](https://www.langchain.com/blog/jev-agent-evals-langsmith), a different URL from the one given in the brief, found via search. Setup: five captured weather-agent runs, replayed 100× each (500 total), scored pass/fail against a human oracle, comparing Jev to three LLM judges. Results: **Jev matched the human oracle on all 500/500 (100%)**, vs. Terra 99.8%, Luna 96.4%, Claude Sonnet 4.6 80.0%. **Variance**: Jev's mean per-case variance was the lowest at 0.0000149; Claude Sonnet 4.6 was 92× higher, GPT-5.6 Luna 433× higher, GPT-5.6 Terra 913× higher. This is a directly relevant number for the **reader-panel / verifier** phases, which are exactly this kind of repeated-grading task.

---

## 3. The local alternative: two unrelated projects both called "OpenJev"

This is worth flagging explicitly because the task's own seed links point to one of each, and they are **not the same project** — they share a name by coincidence of the obvious naming convention, not lineage.

### OpenJev-A: [zhihz/openjev](https://github.com/zhihz/openjev) — small bilingual research preview
**Verified via `gh api`**: 34 stars, Python, license "Other," pushed 2026-09-16 (created 2026-09-16 — one push, not touched since). Homepage: none set.

- **Backend model**: frozen **Qwen3-4B-Instruct-2507** — explicitly *not* a custom-trained decision model. README: "There is no demonstrated performance lead over Jev or other competing systems," and "No matched performance comparison against Jev, GLiClass, GLiNER2, or CAPPr has been completed."
- **Primitives**: Choice and Binary (their term for Noul-style yes/no).
- **Hardware tested**: **Apple M3, 16GB unified memory, Python 3.14, only.** The README states explicitly: "Other platforms and dependency combinations have not been validated." There is **no Windows or NVIDIA GPU testing claimed at all** — this is "not validated," not "doesn't work," per the project's own wording. There is also no CPU-only path documented; the FP16 build runs on Apple's MPS (GPU) backend and the other build is MLX (also Apple Silicon GPU/ANE).
- **Latency** (their own frozen measurements, 8 sequential requests): median **558ms** (FP16/MPS) vs **533ms** (MLX 8-bit); first cold request **8,007ms** (FP16) vs **555ms** (MLX); peak memory **8.35GB** (MPS) vs **4.60GB** (MLX). Their own conclusion: "The observed median latency reduction is about 4.6%, not a general 10× or 20× speedup."
- **Quality** (frozen snapshot 2026-09-17, their own dev set): Qwen3-0.6B scored 65.7%, Qwen3-4B-Instruct-2507 scored 89.8%, on a 236-item internal challenge set; a 128-item Belebele-derived reading subset scored up to 97.7%.

### OpenJev-B: the model behind [abhishekgahlot2/openjev-server](https://github.com/abhishekgahlot2/openjev-server) (forked as [rituparnakashyap/openjev-server](https://github.com/rituparnakashyap/openjev-server)) — a real open 27B model
**Verified via `gh api`**: upstream (abhishekgahlot2) has 2 stars, 4 forks, Python, Apache-2.0, pushed 2026-09-22. The seeded fork (rituparnakashyap) has 0 stars of its own but is **3 commits ahead, 0 behind** upstream (verified via `gh api .../compare/`) — it is not an untouched mirror. Homepage on both: `huggingface.co/openjev`.

- **What it is**: a server (vLLM or MLX backend) for **OpenJev**, described in its own README as "an open 27B decision model for browser and desktop agents." Reads exact candidate-token logits off the model's first output position — one forward pass, nothing generated, no chain-of-thought wait.
- **Primitives**: `choice`, `noul`, `score` — named identically to Jev's three, and the wire format explicitly mirrors Jev's `/v1/systemone`, so a jev-mcp-style client can point at it (jkudish/jev-mcp's own README lists this exact compatibility path, `JEV_PROVIDER=compatible` against `api.openjev.sh/v1/systemone`).
- **Hardware needed**: **16-bit build** — two 80GB GPUs, or one with CPU offload. **FP8 build** — one H100 or any 80GB-class GPU. **MLX 8-bit** — Apple Silicon, 64GB. **MLX 4-bit** — Apple Silicon, 32GB. **There is no CPU-only path documented anywhere in this README.**
- **Windows + NVIDIA GPU**: **not addressed in the README either way.** The two documented quick-starts are "one GPU, vLLM" (vLLM's own docs support Linux primarily; nothing here confirms or tests Windows) and "Mac, MLX" (Apple Silicon only). vLLM's GPU requirement here is stated as 80GB-class (H100 or equivalent) — a datacenter card, not a typical consumer Windows/NVIDIA desktop GPU. So the honest answer is: **not read / not documented for Windows**, and even if it were, the stated hardware floor (one 80GB GPU minimum) rules out ordinary consumer GPUs regardless of OS.
- **Quality claims vs. the real Jev** (their own self-reported comparison, 34 public datasets, 10,000 questions, same order for every model — their own words: "the comparison is not a controlled one: the hosted model's training data is unknown"):

  | Model | Correct / 10,000 | Accuracy |
  |---|---|---|
  | Jev (hosted) | 8,540 | 85.4% |
  | **OpenJev** (this project) | 8,403 | 84.0% |
  | Qwen3.8-27B base, untuned | 8,036 | 80.4% |
  | A fine-tuned 9B decision model | 7,574 | 75.7% |

  Also: 2,000 desktop-screenshot next-action steps, right element picked **88.0%** of the time. Latency: **~125ms on one H100** (FP8), **~150ms on a Mac** (4-bit MLX). Named demo results: returns-policy validation 93.5% (88.0% on date-counting cases) vs. a 43.5% majority baseline; agent tool-call guardrail 200/200; natural-language row filters 92.1%; prompt-injection detection 95.0% accuracy, ROC-AUC 0.995, 97.7% recall at a 2% false-alarm rate; Banking77 intent classification 78.0% zero-shot / 92.3% top-3; inbox triage, 72 typed fields in 6.41s on one H100.

---

## 4. MCP servers callable from Claude Code / the Claude Agent SDK

**Yes, and one is purpose-built for exactly this.** [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) — **verified via `gh api`: 407 stars, JavaScript (Node), MIT license, pushed 2026-09-26, 1 open issue.** Requires Node.js 22+. Installs with `claude mcp add jev -- npx -y @jkudish/jev-mcp`; also documents Amp, Codex, OpenCode, and generic-MCP-client configs, plus a stateless HTTP/remote mode (`--http`, bearer-token-gated) for a team-shared server, and ships an installable Claude Code **agent skill** (`skills/jev/`) that teaches the agent when to actually call each tool rather than leave it registered-but-unused.

**It exposes 11 tools**, each mapped to a Jev primitive as documented in its own README (this is the most directly reusable artifact found for the consumer pipeline):

| Tool | What it does | Primitive |
|---|---|---|
| `jev_verify` | Checks claims against supplied evidence, per-claim verdict + confidence | Choice (supports / contradicts / says_nothing) |
| `jev_screen` | Judges fetched/pasted text before it enters context: injection probability, substance, relevance | Noul × 3 |
| `jev_noul` | Bare calibrated probability for a stated proposition, batched up to 64 | Noul |
| `jev_find` | Picks the single best candidate from up to 250, plus an "does an answer even exist" check | Choice + Noul |
| `jev_rerank` | Scores every candidate's relevance and returns them sorted (not just one winner) | Noul per candidate |
| `jev_classify` | Batch-assigns many items to a shared class catalog in one call | Choice per item |
| `jev_decide` | One bounded decision, 2–6 candidates, evidence + priorities, per-requirement checks, escape hatches | Choice |
| `jev_compare` | How two passages relate (same_fact / contradicts / different_facts), optionally per-aspect | Choice |
| `jev_extract` | Regex finds candidates, Jev picks which is the real field value — value is always a verbatim substring, never generated | Choice over regex matches |
| `jev_review` | Scores a proposed diff on 4 rubrics (correctness, spec match, test gap, blast radius) 0–2 each, plus a safe-to-apply probability, into one composite auto/review/escalate decision | Score × 4 + Noul |
| `jev_gate` | `jev_review` plus completion claims verified against evidence, in one call | Score × 4 + Noul + Choice per claim |

Providers supported (auto-detected from environment variables): TypeSafe direct, OpenRouter, Cloudflare Workers AI, Vercel AI Gateway, or any "System One"-compatible endpoint (explicitly including a self-hosted OpenJev-B server, by URL). Two of its tools (`jev_review`, `jev_gate`) are adapted from a separate MIT-licensed fork, [burnigtm/jev-mcp](https://github.com/burnigtm/jev-mcp) (not independently checked via `gh api`).

**Other MCP/agent-skill variants found** (named in search results and the awesome-jev README; I did not run `gh api` on most of these, so stars/dates are "not read" unless stated):
- [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) — Go, single-binary MCP for Claude Desktop/Code and Codex. Stars/date: not read.
- [blakestone-x/jev-mcp](https://github.com/blakestone-x/jev-mcp) — Python variant: classify/score/check/match/screen tools. Not read.
- [PyModel/jev-judge-mcp](https://github.com/PyModel/jev-judge-mcp) — 11 tools (verify/screen/find/classify/rerank/decide/compare/extract/review/gate/score), policy-driven, pinned to a TypeScript reference server (v0.5.0) via parity fixtures per its own description. Not read.
- [NiazMorshed2007/jev-review](https://github.com/NiazMorshed2007/jev-review) — local-first MCP for Claude Code/Codex/Cursor/OpenCode code review. Not read.
- Several forks/reimplementations of jkudish's own server exist under other accounts (rahulrajaram, chalermkried, oppih, minhgv) — not independently checked.
- [Jevbridge](https://github.com/gamesonrblx/Jevbridge) — an ACP/MCP adapter alongside Codex/Claude/Grok/OpenCode. Not read.
- Official: [typesafe-ai/skills](https://github.com/typesafe-ai/skills) — **verified via `gh api`: 2,231 stars, pushed 2026-09-12** (note: this predates the stated 2026-09-15 launch date; reported as read, not explained). This is an agent **skill/plugin**, not an MCP server — `claude plugin marketplace add typesafe-ai/skills` then `claude plugin install typesafe@typesafe-ai`.
- A dedicated shared transport library, [jkudish/jev-agent-tools](https://github.com/jkudish/jev-agent-tools) — **verified: 2 stars, JavaScript, pushed 2026-09-25** — is what jev-mcp and jev-browser both build on for provider selection and fail-closed validation.

---

## 5. The main catalogue, by fit tag

Format per row: **name (★ stars, last commit, language)** — one-line description — primitive(s) — fit. Stars/dates marked "verified" came from a live `gh api` call in this session; anything else is "as described in [source]," not independently checked, with stars/date as "not read" where I did not query the API directly.

### (a) URL / source triage and ranking

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| [superagents-lab/jev-search](https://github.com/superagents-lab/jev-search) | not read | Web search app: Choice/Noul judgments pick sources, time ranges, query candidates, then rank retrieved results (Search1API). Live demo [jev.s1.dev](https://jev.s1.dev). | Choice, Noul | (a) |
| [komikat/jev-bfs](https://github.com/komikat/jev-bfs) | not read | Finds link paths between Wikipedia articles; Jev ranks each page's outgoing links, Python controls the search (beam-search style). | Choice (implied) | (a) |
| [jexp/neo4jev](https://github.com/jexp/neo4jev) | not read | Neo4j graph navigation: at each node, Jev chooses which relationship to follow, beam search over log-probabilities. | Choice | (a) |
| "YC Indexor" (search 6,000+ YC startups in ~1s) | URL not resolved — named only in madewithjev.com/github-repos' summary list; I could not confirm the exact GitHub owner/repo in this pass | Ranks a large startup corpus against a query | not read | (a) |

### (b) Relevance / quality scoring of fetched text chunks

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| jkudish/jev-mcp — `jev_find`, `jev_rerank` | 407★, JS, pushed 2026-09-26 (verified) | See §4 above. | Choice+Noul / Noul-per-candidate | (b) |
| [milvus-io/milvus-model](https://github.com/milvus-io/milvus-model) | **61★, Python, pushed 2026-09-23 (verified)** | Reranker adapter: sends candidate documents as Jev Noul questions in one request, sorts scores, preserves original indices. Part of a larger existing embeddings/reranking library, not a Jev-only project. | Noul | (b) |
| [keltokhy/jgrep](https://github.com/keltokhy/jgrep) | **119★, Python, pushed 2026-09-25 (verified)** | "grep, but the pattern is a description" — filters lines by meaning; ~200ms and a thousandth of a cent per line (their number, see §1). | Noul | (b) |
| [kylemclaren/jevsearch](https://github.com/kylemclaren/jevsearch) | **7★, TypeScript, pushed 2026-09-23 (verified)** | Site search: keyword hits show instantly, then one call asks Noul-per-candidate + a Choice over all candidates, re-orders top 20, falls back to keyword order on failure. shadcn/ui registry block. | Noul + Choice | (b) |

### (c) Claim-vs-evidence support checks — directly maps to the verifier phase

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| jkudish/jev-mcp — `jev_verify`, `jev_gate` | 407★, JS (verified) | Per-claim verdict against supplied evidence, confidence-gated auto/review split; `jev_gate` adds this on top of a diff review. Explicitly built for "fact-check a report, PR description, or agent brief against the sources it cites, claim by claim" — a near-exact description of this pipeline's verifier phase. | Choice (supports/contradicts/says_nothing) | (c) |
| [MarissaFamularo/citation-verifier](https://github.com/MarissaFamularo/citation-verifier) | **8★, JavaScript, pushed 2026-09-17 (verified)** | "Check whether each cited paper actually supports the sentence citing it: Claude locates the quote, Jev scores the support, a human decides." Almost exactly the verifier phase's job description. | Not stated precisely ("scores the support" — likely Score or Noul, not confirmed) | (c) |
| agencyenterprise/jev-recipes — `verify`, `claim-stance`, `answerability` recipes | 12★, TS (verified, see §recipes below) | `verify` checks claims against evidence; `claim-stance` labels a response's stance toward a claim; `answerability` checks whether evidence is enough to answer at all. | Not read at the schema level for each; described as Choice-shaped in the README's "Find your recipe" table | (c) / (e) |
| [jourdanlabs/assay-001](https://github.com/jourdanlabs/assay-001) | not read | Independent pre-registered check of Jev calibration on Banking77/CLINC150; "split verdict, full logs." A calibration audit, not a pipeline tool. | n/a | (c)-adjacent (evaluates whether Jev's own confidence is trustworthy) |

### (d) Classification / routing inside an agent harness

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| jkudish/jev-mcp — `jev_classify`, `jev_decide` | 407★, JS (verified) | Batch classification against a shared catalog; bounded 2–6-candidate decisions with priorities and escape hatches (`ask_user`, `investigate`). | Choice | (d) |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | **438★, JavaScript, pushed 2026-09-19 (verified)** | "Route to the cheapest model in Claude Code for your task." | Choice (implied) | (d) |
| [prismhq/jev-router](https://github.com/prismhq/jev-router) | **13★, Python, pushed 2026-09-17 (verified)** | Open-source LiteLLM-based router: a Jev decision picks which model serves each request. | Choice (implied) | (d) |
| [Devin-AXIS/jev-dsh-decision](https://github.com/Devin-AXIS/jev-dsh-decision) | **219★, JavaScript, pushed 2026-09-20 (verified)** | "Jev DSH decision engine — a structured-decision plugin for Agent Harnesses." Native DeepSeek Harness support, OpenCode/Codex Harness via iPolloWork. | Not read | (d) |
| agencyenterprise/jev-recipes — `route`, `route-many`, `model-route`, `tool-call-gate`, `wake-gate` | 12★, TS (verified) | `route`/`route-many`: send a request to the right team/handler, batched up to 500. `model-route`: pick a model tier + effort per request. `tool-call-gate`: allow/ask/deny an agent's tool call. `wake-gate`: for paused agents. | route is Choice-shaped (`status: 'ready'\|'review'` + a chosen id) | (d) |
| Several more per-agent routers named only in the awesome-jev README (jev-codex-router, Codex Jev Router, pi-jev-router, jcm-router, jev-agent-skill-router, langchain-skill-router, Jevonian) | not read | Same pattern repeated per coding-agent (Codex, Pi, Claude, skill-catalogs) | not read | (d) |

### (e) RAG gating / retrieval filtering — the closest fit to "the fixed context every phase re-reads"

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| jkudish/jev-mcp — `jev_screen`, `jev_rerank` | 407★, JS (verified) | `jev_screen`: judges fetched/pasted text for prompt-injection risk, substance, and task-relevance *before it enters context* — explicitly designed for "screen a fetched page for injected instructions... and skip pages with nothing to say," which is precisely the research phase's page-intake problem. | Noul × 3 | (e) |
| [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | **6,990★, TypeScript, pushed 2026-09-18 (verified)** | Claude Code plugin: every tool call and result scored in one fast request; stale ones dropped or truncated, kept ones stay verbatim (not summarized). This is the single closest match in the whole ecosystem to the consumer's "fixed context every phase re-reads" cost line — see the ~1M→86K-token number in §1/§2. | Not read at the schema level | (e) |
| [zilliztech/vector-graph-rag](https://github.com/zilliztech/vector-graph-rag) | **251★, Python, pushed 2026-09-22 (verified)** | Graph RAG with pure vector search; an *optional* Jev Noul reranker scores candidate graph relations' relevance before retrieval. Note: this is a general Graph-RAG project with an optional Jev component bolted on, not a dedicated Jev tool. | Noul | (e) |
| [kylemclaren/jevql](https://github.com/kylemclaren/jevql) | **13★, Go, pushed 2026-09-19 (verified)** | psql-style client: plain SQL runs on a real Postgres server, Jev answers `jev()`/`jev_prob`/`jev_choice`/`jev_score` calls on the returned rows, client applies filter/sort/group. | Choice, Score, Noul (all three, per SQL function) | (e) |
| agencyenterprise/jev-recipes — `context-prune` | 12★, TS (verified) | Explicitly listed under the recipe library's "Agent harness" group as one of the decisions inside an agent loop: "`context-prune` before compaction." | Not read | (e) |
| [milvus-io/bootcamp](https://github.com/milvus-io/bootcamp) `RAG/search_with_jev` folder | not read (subfolder of a large pre-existing repo, not independently checked) | Community cookbook: 9 runnable Python notebooks combining Gemini embeddings + Milvus retrieval + Jev for reranking, filtering, search-stopping, routing, cache reuse, curation, guardrails, and evaluation. | Mixed (all three, per notebook) | (e) |

### (f) Grading prose against a rubric — maps to reader-panel / stylist

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| Every's editorial vibe check (essay, not a repo) — [every.to](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds) | n/a | 37 documents × 21 questions each, 1,709 total judgments, **<$0.01, 0.35s median**, caught 6 of 7 deliberately planted defects. The single best real number in this catalogue for "grading prose against a rubric" at pipeline scale. | Not read in detail | (f) |
| [asfarsadewa/human-compiler](https://github.com/asfarsadewa/human-compiler) | **2★, TypeScript, pushed 2026-09-17 (verified)** | "A compiler for human language. Paste text, get diagnostics." Scores passive-aggression, urgency, and information density, then emits rustc-style diagnostics; a separate writing model turns the scores into prose. Live: human-compiler.asfarlab.fun. | Score (probable; "measured by Jev," not confirmed at the schema level) | (f) |
| agencyenterprise/jev-recipes — `draft-compare` | 12★, TS (verified) | Named under the README's "AI alignment research" section: "compares responses under a rubric." | Not read | (f) |
| jkudish/jev-mcp — `jev_review` | 407★, JS (verified) | Not prose-grading as shipped (it's a code-diff rubric: correctness/spec-match/test-gap/blast-radius), but the *pattern* — independent Score rubrics combined into one weighted composite with auto/review/escalate thresholds — is directly transferable to grading a stylist rewrite against a voice contract (register, AI-tell count, etc.) instead of a diff against a spec. Flagging as a reusable pattern, not a ready-made tool. | Score × 4 + Noul | (f)-by-analogy |

### (g) Scraped-data validation

| Repo | Stars / commit / lang | What it does | Primitive | Fit |
|---|---|---|---|---|
| jkudish/jev-mcp — `jev_extract` | 407★, JS (verified) | Regex finds candidate substrings; Jev picks which candidate is the real field value. Value is always a verbatim document substring, **never model-generated** — a zero-match field never even reaches the model. | Choice over regex matches | (g) |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | **464★, TypeScript, pushed 2026-09-20 (verified)** | Tax-document page classifier: "100% strict accuracy across 261 IRS forms, ~$0.001 per page" (their own reported number). | Not read | (g) |
| Zyte's own use case (article, not a repo) — [zyte.com](https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/) | n/a | "Data Quality Gates" pattern: validate already-extracted records for misaligned fields/missing data, post-extraction. Real cost/latency numbers in §1. | Noul (yes/no per validation question) | (g) |
| [AkashPriyadarshii/jev-curate](https://github.com/AkashPriyadarshii/jev-curate) | not read | High-throughput synthetic dataset sifter in Rust: Noul checks on JSONL/Parquet rows, streams clean/rejected rows to disk separately. | Noul | (g) |

### (h) Other / infrastructure (catalogued because specifically requested, not because it fits a–g)

| Repo | Stars / commit / lang | What it does | Fit |
|---|---|---|---|
| zhihz/openjev | 34★, Python, pushed 2026-09-16 (verified) | See §3, "OpenJev-A." | (h), local alternative |
| abhishekgahlot2/openjev-server (+ rituparnakashyap fork) | 2★ upstream / 0★ fork, Python, pushed 2026-09-22 / 2026-09-25 (verified) | See §3, "OpenJev-B." | (h), local alternative |
| [receptron/laya](https://github.com/receptron/laya) | **500★, TypeScript, pushed 2026-09-21 (verified)** | "Run Laya, the open-source Jev-compatible System-1 decision model, from Node.js/TypeScript via ONNX Runtime." Notable because it's the one **Node/TS-native local alternative** found (everything else local runs on Python/vLLM/MLX). Laya itself is a separate open model from ConvAI Innovations, not a TypeSafe release. | (h), Node-native local alternative |
| typesafe-ai/skills | 2,231★, pushed 2026-09-12 (verified) | Official agent skill/plugin for Claude Code, Codex, and other coding agents. | (h), official |
| kraayenjon/awesome-jev (the task's own seed) | **146★, pushed 2026-09-27 (verified, same day as this catalogue), homepage madewithjev.com** | The master community list this catalogue leaned on heavily. CC0. | (h), index |
| Other "awesome-jev" lists (sampled via GitHub search, stars verified) | yibie/awesome-jev 1,800★ · Anil-matcha/awesome-jev-by-typesafe 862★ · v-modal/awesome-jev-tools 726★ · logicrw/awesome-jev-projects 571★ · kydlikebtc/awesome-jev 495★ (claims 1,207 resources) · cobanov/awesome-jev 414★ · walidboulanouar/awesome-jev-use-cases 254★ · valentynkit/awesome-jev-typesafe 168★ · AppitStudio/awesome-jev 87★ · tanxarx/awesome-jev 17★ · 2456868764/jevguide 5★ | (h), duplicate indices — a land-rush on the "awesome-jev" name; several claim larger/different counts than kraayenjon's list and are not reconciled against each other here |
| [jaredpalmer/kev](https://github.com/jaredpalmer/kev) | **7,310★, Python, pushed 2026-09-27 (verified)** | "Jev-like family of decision models built on top of Qwen3.5/3.8 you can train and run on your own." The single highest-starred open reproduction found. | (h), open alternative |
| [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | **20,666★, Python, pushed 2026-09-25 (verified)** | Browser-Use's own agent framework with next-action decisions moved to Jev — "fastest and cheapest web agent." Highest star count of anything found in this pass, but browser/computer-use action-selection, not a text-pipeline fit. | (d)-adjacent / mostly out of scope |

---

## 6. The "200+ plug-and-play Jev recipes" project

This is [agencyenterprise/jev-recipes](https://github.com/agencyenterprise/jev-recipes) — **verified via `gh api`: 12 stars, TypeScript, MIT license, pushed 2026-09-27** (same day as this catalogue). This is the **single most directly reusable artifact for the consumer's actual stack** — it is Node/TypeScript-native, requires Node 22.9+, ESM, and is designed to be `npm install`-ed straight into a Node backend.

- **Scale**: the README's generated summary line currently reads **"246 focused recipes for JavaScript and TypeScript"** (the task's brief said "200+"; both are consistent — the count has grown since the number was first quoted, and recent PRs titled `completion-gate`, `context-prune`, `diff-hazards`, `model-route`, `route-many`, `tool-call-gate` pushed it from 236/243 to the current 246, per the release notes at [v0.8.0](https://github.com/agencyenterprise/jev-recipes/releases/tag/v0.8.0) and [v0.8.1](https://github.com/agencyenterprise/jev-recipes/releases/tag/v0.8.1), both dated 2026-09-27).
- **How it works**: each recipe is a typed function — `route({ request, routes })`, `verify(...)`, `rerank(...)` — that calls Jev through TypeSafe's API (or any `systemOne`-compatible `baseURL`, including a self-hosted OpenJev-style server) and returns a structured, validated decision; your code owns what happens with the result. Recipes are grouped by area: Agent harness (`tool-call-gate`, `model-route`, `context-prune`, `wake-gate`, `diff-hazards`, `completion-gate`), Psychology & behavior, Music & sound, plus the core set (`route`, `rerank`, `answerability`, `verify`, `clarify`, `claim-stance`, `choose-action`, `checkers-move`).
- **Batching**: `routeMany` sends up to 500 requests in batches of 20 by default, one call per batch rather than one per item — directly relevant to the research phase's page-by-page loop.
- **Local/offline testing**: every recipe ships an offline fixture (`npx jev-recipes demo route`) so behavior can be inspected without an API key or a live call.
- **CI**: runs on Node 22 and 24; package/recipe/model-evaluation checks are separated, and the README is explicit that its own offline tests "do not measure Jev's accuracy" — evaluate on your own data.

---

## Sources

Fetched or searched directly in this session:

- https://github.com/kraayenjon/awesome-jev (README read in full, plus `gh api` metadata)
- https://github.com/jkudish/jev-mcp (README read in full, plus `gh api` metadata)
- https://github.com/zhihz/openjev (README read in full, plus `gh api` metadata)
- https://github.com/rituparnakashyap/openjev-server and https://github.com/abhishekgahlot2/openjev-server (README read in full for both, `gh api` metadata + compare, both identical content)
- https://github.com/agencyenterprise/jev-recipes (README read in full, plus `gh api` metadata and release tags)
- https://github.com/topics/jev-ai and https://github.com/topics/jev-model (queried via GitHub's search API rather than scraping the topic pages directly)
- https://jevpatterns.com/
- https://madewithjev.com/github-repos
- https://madewithjev.com/what-is-jev-engineering
- https://madewithjev.com/jev-with/claude-code
- https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/
- https://www.langchain.com/blog/building-a-harness-with-jev
- https://www.langchain.com/blog/jev-agent-evals-langsmith (found via search, answers the "500 judgements" question the seed URL did not contain)
- GitHub API (`gh api`) calls for repo metadata / topic search / compare on: kraayenjon/awesome-jev, jkudish/jev-mcp, zhihz/openjev, rituparnakashyap/openjev-server, abhishekgahlot2/openjev-server, agencyenterprise/jev-recipes, tamaratran/fast-jev-compaction, milvus-io/milvus-model, zilliztech/vector-graph-rag, MarissaFamularo/citation-verifier, asfarsadewa/human-compiler, nexibeo/jev-cookbook, kylemclaren/jevql, kylemclaren/jevsearch, kylemclaren/jevpdf, gargpratyush/jev-router, prismhq/jev-router, browser-use/jev-ultrafast, jkudish/jev-agent-tools, typesafe-ai/skills, kyotofin/tax-doc-classifier, keltokhy/jgrep, jaredpalmer/kev, plus topic searches for `jev-ai`, `jev-model`, and free-text `jev decision` (dozens more repos surfaced this way, tallied in §0 but not all individually catalogued)
- WebSearch queries on: "Jev decision model TypeSafe AI Choice Score Noul"; "Jev TypeSafe AI decision model API pricing"; "200 Jev recipes plug-and-play github"; "LangChain Jev benchmark 500 judgements variance human oracle"; "jev-mcp vs typesafe-mcp vs jev-review github MCP server tools comparison"

Not independently fetched, cited only as described by another page: the arXiv survey 2609.30216 ("Jev in the Wild"); docs.typesafe.ai/cookbooks/rerank_typesafe (the CLERC number is secondhand via jev-mcp's README); the "200+ plug-and-play Jev recipes" project's exact original phrasing (I found and verified the repo itself, agencyenterprise/jev-recipes, rather than the phrase's original source).
