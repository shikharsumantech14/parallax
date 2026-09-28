# The cost plan: the pipeline after the cuts, and where Jev fits

> **Status: v0.1 · SIGNED 2026-09-28.** The operator signed CP-01 to CP-10 as written, and asked for the implementation plus one trial issue (sports, Manchester City and the financial rules). Written 2026-09-27 for the operator to
> read cold, in the form of `REGISTER-PLAN.md` (RG-nn), `REVAMP-PLAN.md`
> (RD-nn) and `CONTEXT-PLAN.md` (CD-nn). Supersedes v0 of the same day. Every
> number in §1 and §4 was measured from the cost ledger, the 53 run transcripts
> of the September round and the sixteen dossiers on disk, and the method sits
> next to each one. Every claim about Jev carries its source in the appendices
> under `docs/cost/`. The decisions are CP-01 to CP-10 in §8. An implementation
> log follows in §12 as the work lands.
>
> **What changed since v0.** The operator asked whether splitting the
> researcher into a Sonnet sweep and an Opus judgment pass is better on cost
> and on quality. It was priced on the six September research transcripts,
> checked against the published evidence, and the dossiers it would replace
> were measured. The verdict is in §4: cheaper than today, not proven better
> than Opus alone, and not the first thing to do. §3 now lays out the whole
> pipeline after the plan, phase by phase, including Jev's exact jobs.
>
> **The brief.** The operator read about Jev, a new "decision model" from
> TypeSafe AI, and asked whether it can cut the pipeline's cost, which they put
> at about $100 for five published issues. They asked for deep research on Jev,
> its ecosystem, the cost and latency of integrating it, and every other change
> that would stop the pipeline burning tokens.

---

## 0. The one-screen version

**Jev is real, cheap and useful, but it is not where the money is.** The
measured bill is about **$31 per issue** at list price. About 61% of it is the
four "short" writing passes (composer, drafter, stylist, verifier), which are
not short: each makes 18 to 41 API calls, and every call re-reads a fixed
**57,000-token prefix** that the Claude Code harness adds in front of our own
3,000-token agent prompt. About 31,000 tokens of that prefix is this repo's
`CLAUDE.md` and `AGENTS.md`, which the rules say the agents never see. Web
pages, the thing Jev would triage, are **7.6% of the researcher's reads**.

The order of work, with what each step is worth per issue:

1. **Free wins, same week, no model change.** Stop loading the repo memory,
   the unused tools and the operator's permission list into every call, load
   the web tools up front, remove the Agent tool, price the ledger correctly.
   About **−$10**. This also ends a measured quality defect: three of the six
   September dossiers were written from a compacted memory, and after the fix
   no run reaches the compaction point.
2. **The research phase, tuned on the evidence.** Opus 5 at medium effort
   first (about −$1 to −$1.5 with no model change), Opus 5.5 at medium once
   the SDK is upgraded (about −$1.5 to −$2 more), and a **single-shot check
   pass** that recomputes every derived number and confirms every anchor
   (+$0.65, and it would have caught all three dossier errors the verifier
   found in September). The Sonnet sweep plus Opus judge split is priced and
   ready as the fallback if the price point matters more than the recall gap.
3. **Discovery on Sonnet**, already ruled. About **−$2**.
4. **Make the passes single-shot** (inputs assembled by the script, one
   request, one output file), then run them through the Batch API at half
   price. Same models, same rulings. This is the big one: **about −$15**.
5. **Jev, as a decision layer, not a model swap.** Its own bill for one
   issue is about a cent. Its jobs: screen fetched passages before they enter
   context, pre-check claims against the dossier before the Opus verifier,
   grade the panel's quiz answers. Worth about **−$1.5** in tokens and a
   repeatable, sub-second second opinion on the two gates. Never the final
   gate, never a security boundary, never arithmetic.

End state: about **$8 to $9 per issue** with Batch, **$11 to $12** without,
against $31 today. The interim state after the free wins and the research
tuning alone is about **$17 to $20**.

Latency: an issue takes about 79 agent-minutes today. Jev adds under three
minutes. Batch adds waiting, which fits a pipeline the operator gates by hand.

---

## 1. What was measured

### 1.1 The ledger, corrected

`research/_costs/ledger.jsonl` holds 47 rows from 2026-09-16 to 09-22, $165.31
for six issues, about $27.50 each. Three corrections move that figure
(`docs/cost/2026-09-27-cost-levers.md` §4):

- **The dollars are the SDK's own estimate**, computed from a price table
  bundled into `@anthropic-ai/claude-agent-sdk` 0.2.126. It prices every cache
  write at the 5-minute rate although every subscription run wrote 1-hour
  entries, and it prices `claude-sonnet-5` at Opus 5 rates. The reader panel
  reads $1.53 a run in the ledger and costs $0.61 at list. For clean runs the
  5-minute formula reproduces the ledger to the cent.
- **Eleven failed runs are recorded at $0 or not at all.** Their tokens cost
  about $37 at list.
- **`num_turns` is not the request count.** A 65-turn research run made 31 to
  47 API requests.

| Phase | Model | Ledger avg | Corrected per run (API route, 5-min writes, list) | Runs per issue |
|---|---|---|---|---|
| Discovery | Opus 5 | $3.61 | $3.61 | 1 |
| Researcher | Opus 5 | $7.38 | $7.39 | 1 |
| Composer | Opus 5 | $3.61 | $4.34 (successful runs only) | 1 |
| Drafter | Opus 5 | $6.71 | $6.71 | 1 |
| Reader panel | Sonnet 5 | $1.53 | $0.61 | 2 |
| Stylist | Opus 5 | $4.41 | $4.41 | 1 |
| Verifier | Opus 5 | $1.60 | $3.73 (successful runs only) | 1 |
| **Per issue** | | $27.50 | **$31.41** | |

As actually run on the subscription's 1-hour cache: **$37.61 per issue.** The
round spent about $200 to $230 on six issues, failed runs included, first on
the Max plan's included usage and then on extra usage, which is billed at API
rates.

### 1.2 The turn model: cost follows turns, not thinking

| Agent | Turns | Context re-read per turn | New tokens per turn | Cost per turn |
|---|---|---|---|---|
| Discovery | 43 | 47k | 4.9k | $0.084 |
| Researcher | 65 | 62k | 4.7k | $0.113 |
| Composer | 39 | 50k | 5.2k | $0.094 |
| Drafter | 49 | 80k | 7.4k | $0.137 |
| Reader panel | 7 | 52k | 17.1k | $0.224 |
| Stylist | 49 | 64k | 4.6k | $0.090 |
| Verifier | 29 | 65k | 6.3k | $0.054 |

A turn costs about the same whatever the agent thinks, because a turn is the
whole context re-read at the cache-read rate plus a few thousand new tokens
written at the cache-write rate. The panel is the only genuinely short pass.
The stylist runs 49 turns because its prompt tells it to apply one `Edit` per
rewritten field. The drafter runs 49 because it reads a dozen files one `Read`
at a time, and it read its own dossier and storyboard in full twice.

### 1.3 The transcripts: what the context is made of

53 run transcripts were parsed and the per-request usage summed. The sums
reproduce every ledger row's token columns exactly.

| Share of cache reads | Discovery | Research | Composer | Drafter | Panel | Stylist | Verifier |
|---|---|---|---|---|---|---|---|
| First-request prefix (harness, tool schemas, CLAUDE.md block, listings) | 53% | 49% | 51% | 51% | 61% | 60% | 50% |
| Nested CLAUDE.md and rules loaded on first read | 10% | 8% | 11% | 11% | 12% | 8% | 18% |
| Standing reference files (allowlists, templates, voice core, catalog) | 13% | 12% | 5% | 6% | 9% | 4% | 0% |
| Agent-memory files | 0% | 0% | 7% | 2% | 0% | 4% | 5% |
| **Identical in every run of the phase** | **75%** | **70%** | **74%** | **69%** | **82%** | **77%** | **74%** |
| Issue payload (candidates, dossier, storyboard, draft) | 2% | 6% | 12% | 13% | 15% | 9% | 14% |
| Web results (WebFetch + WebSearch) | 10% | **8%** | 0 | 0 | 0 | 0 | 0 |

**The fixed prefix is 54.6k to 58.5k tokens on the first request of every
run.** Our agent prompt is 1.3k to 3.9k of it. The rest is the CLI's tool
schemas and instructions (about 20k), the root `CLAUDE.md` plus `@AGENTS.md`
(about 31k), the skills listing, the agent listing and the SessionStart brief.
It is there because `scripts/lib/runner.ts` never sets `settingSources`, so the
SDK loads user, project and local settings. The same default hands the
pipeline agent the operator's 415 local allow rules, including
`Bash(npm run *)`, which would let a pipeline agent start `npm run
pipeline:*` and bill.

**`allowedTools` does not restrict the tool set.** It only pre-approves. Across
the round the agents called Bash 229 times (66 denied), Edit 61 (22 denied),
PowerShell 16 (15 denied), ToolSearch 15 and Agent once, which spawned an Opus
subagent for about $2.2. Every denied call still cost a full request.

**Web pages are not the cost.** Claude Code's `WebFetch` sends the page to a
small helper model and returns its answer, about 940 characters per fetch, so
raw pages never enter the main context. Nobody in the pipeline reads page
text: the researcher reads the helper's answers to its own questions. The web
cost sits in the extra loop requests, the helper requests (about $0.6 to $0.9
a run, $1.26 on average) and one cache bust per run when the deferred web
tools are loaded mid-run.

### 1.4 The researcher, request by request

The six September research runs (`docs/cost/2026-09-27-split-pricing.md`):

- **There is no judgment phase today.** Cross-checking happens inline during
  the sweep, in the visible notes. After the dossier is written, the remaining
  requests are jargon-file upkeep, a self-check grep and the summary (1.0k to
  3.2k output tokens). **No run fetched anything after its first dossier
  write.**
- **Three of six dossiers were written from a compacted memory** (space,
  travel, earth). Compaction fired at 170k to 205k tokens. Those three show
  the least write-time thinking (2.3k to 6.3k tokens against 8.7k to 10.5k)
  and two of them are the shortest dossiers (35k characters against 45k to
  52k). After the harness diet no run crosses the threshold.
- Web helper spend is $0.61 to $2.91 a run and identical in every model
  configuration, so it compresses every gap between them.

### 1.5 The dossier quality bar

The sixteen dossiers on disk were measured (`docs/cost/2026-09-27-dossier-baseline.md`).
The September six, all Opus 5: median 19.5 sources, 9 publisher domains, top
publisher 31%, 4 drawn-graphic kinds named beside captured data (range 3 to
5), 2.5 `[UNVERIFIED]` markers (2 to 15), §1 at 254 words. All six clear every
2026-09-16 floor. Downstream, **three of the six carried a dossier-caused
error that reached the verifier**, all arithmetic or comparison: a division
wrong by ten times, a "worst shortfall" that named the wrong row, "a fifth"
that was a quarter. All sixteen issues got REVISE on the first panel pass, and
none reached APPROVED on the first verification, so "first-pass PASS" is not
a bar Opus meets either. The acceptance bar for any cheaper researcher is in
§4.5.

---

## 2. Jev, in short

The full record is `docs/cost/2026-09-27-jev-factsheet.md` (TypeSafe's own
docs, contract and X account), `2026-09-27-jev-skeptic.md` (twenty independent
tests) and `2026-09-27-jev-ecosystem.md` (about 90 repos read).

**What it is.** A hosted, closed model from **TypeSafe AI** (San Francisco,
founded 2024, $40M seed led by DCVC, launched 2026-09-15). The operator heard
the name as "Typeface". It is not a language model. You send a **state** (text
or JSON, up to 32k tokens) and a map of typed **questions**, and it returns
typed answers with probabilities in one call, never a sentence:

| Primitive | Asks | Returns |
|---|---|---|
| Noul | is this true? | a probability 0 to 1 |
| Choice | which one of up to 255 options? | the pick, a probability per option, a confidence |
| Score | where on an ordered rubric of 2 to 10 levels? | a weighted level, probabilities, a confidence |

**Price.** $0.042 per million input tokens, output free "at present". About
300 tokens of fixed overhead per call. Rate limits changeable without notice.
TypeSafe says it cannot yet prove the price is not subsidised.

**Access today.** TypeSafe opened signups on 20 September and **paused them on
22 September**, with no reopening posted by the 27th. Jev is reachable without
a TypeSafe account through **OpenRouter** (`typesafe/jev-1.13`, 5.5% fee,
$0.80 minimum top-up), **Cloudflare Workers AI** (zero data retention),
**Vercel AI Gateway** and Requesty, at the same list price, all forwarding to
a US endpoint. From India the warm round trip is about 380 ms. Official
TypeScript SDK `@typesafe-ai/sdk` 0.6.0. An official Claude Code skill. No
official MCP server. The best community one is `jkudish/jev-mcp` (407 stars,
Node, MIT, eleven tools including `jev_verify`, `jev_screen`, `jev_rerank`).

**Good at, on independent evidence.** English yes/no and few-option questions
over a short, relevant state: triage, routing, reranking, binary rubric
checks, claim-versus-evidence support. Calibration error 0.01 to 0.08 there.
As the first stage of a cascade it kept 99.6% of GPT-6's accuracy at 44% of
its fee in one university test, and matched Opus 5 within 0.4 points on
Banking77 at 28% of the cost in OpenRouter's.

**Bad at, on the same evidence.** Reasoning (36.7% on a sealed hard-decision
set against 95.5% for a reasoning LLM at 3.4x the price), arithmetic,
counting, dates, negations, multi-hop questions, Score questions (calibration
error 0.25 to 0.33), unanswerable questions, any question without a "none"
option (30 of 30 out-of-scope items classified at 0.99), long states (accuracy
fell from 97% to 81% between the shortest and longest quarter of one
production set), many items in one state (40 of 40 correct one per call, 62%
as one document), non-English text (eighth of ten models on real Hindi and
Hinglish routing), and planted facts (96.5% to 26.5% after one injected
sentence). Not deterministic. Renaming options from 0/1 to no/yes flipped
32.5% of decisions in one paper.

**Independent speed and cost.** 0.15 to 1 second a call. Speed-ups of 4x to
25x against LLMs, not the advertised 40x to 200x. Cost ratios of 4x against a
small LLM, about 22x against Opus 5 with caching.

**Contract.** No SLA, "AS IS", liability capped at the greater of twelve
months' fees and $50, may delete customer data, no using outputs to train a
replacement, five SDK releases in thirteen days. The open "OpenJev" needs an
80 GB GPU or a 24 GB card for a 4-bit build of unmeasured quality, and its
weights are non-commercial, which rules it out here.

**The verdict the tests agree on:** a cheap, fast, roughly calibrated
classifier that you must (a) give options including "none", (b) send one
short item per call, (c) keep away from arithmetic, dates and security
decisions, (d) recalibrate on 50 to a few hundred of your own labels, and
(e) back with an LLM or a person on low confidence. Your code proposes, the
model decides, the code acts.

---

## 3. The pipeline after the plan, phase by phase

Costs per run at list, API route, 5-minute writes. "Today" is the corrected
baseline. "After" assumes the harness diet (§5 lever 2) and the shape change
named in the row. Batch figures are the same request at the 50% discount.

| Phase | Today: model, shape, cost | After: model, shape | Jev's job | After: cost (Batch) |
|---|---|---|---|---|
| Discovery | Opus 5, 20-request web loop, $3.61 | Sonnet 5 (ruled), dieted, searches batched three to four per turn, tool search off | optional: dedupe a candidate against published issues, sort hits into structural / news / opinion, with "none" | about $1.30 |
| Researcher | Opus 5, 38-request web loop, compacts once, $7.39 | Opus 5 at `medium`, dieted, no compaction. Then Opus 5.5 at `medium` after the SDK upgrade. The Sonnet sweep + Opus judge split is the fallback (§4) | screen each extracted passage for relevance and injection risk before it enters context, pick which passage carries a given number, one passage per call | $4.30 to $4.90 on Opus 5 `medium`, about $3.50 to $4.00 on Opus 5.5, $3.40 to $3.80 on the split, $2.93 on Sonnet alone |
| Dossier check (new) | none | Opus 5, single-shot, clean context: recompute every derived number from its inputs, confirm the primary anchor behind each load-bearing fact, flag disagreements, mark unverified. Any sweep model | none: arithmetic is code and the LLM's job | about $0.65 ($0.33) |
| Composer | Opus 5, 26 requests, $4.34 | Opus 5, single-shot: dossier, catalog shapes, the catalog, template, CANON §2 to §3, the round's ledgers, a memory digest, assembled by the script | none | $1.17 ($0.59) |
| Drafter | Opus 5, 40 requests, $6.71 | Opus 5, single-shot with a check round: all inputs inlined, the script runs `check:prose` and the schema build, a second request carries the flags | none | $1.85 ($0.93) |
| Reader panel ×2 | Sonnet 5, 4 requests, $0.61 each | Sonnet 5, single-shot, inputs inlined | optional: grade each persona's quiz answer against the model answer (correct / partly / wrong / not in the draft) for a consistent score beside the LLM's | $0.58 ($0.29) for both |
| Stylist | Opus 5, 35 requests, one `Edit` per field, $4.41 | Opus 5, single-shot returning structured `{section, field, newText}` edits. The script applies them and refuses any that touch a data field | none | $1.09 ($0.55) |
| Verifier | Opus 5, 18 requests, $3.73 | Jev pre-pass over every extracted claim against the dossier (supports / contradicts / says nothing), then Opus 5 single-shot with the pre-pass attached, spending its attention on the unsupported and contradicted third | the pre-pass, `jev_verify`-shaped, thresholds from our own past reports | about $0.01 + $1.09 ($0.55) |
| Agent memory | consulted and updated in-run, 5.6 to 9.5 requests per pass, $3.16 per issue | a curated digest in each prompt, updates in a post-review pass | none | about $0.20 |
| **Per issue** | **$31.41** | | | **about $11 to $12, about $8 to $9 with Batch** |

Every model ruling of 2026-09-21 survives: the loops on the cheap model, the
passes on the dear one, the panel on a different model from the drafter. What
changes is the shape of the passes and the harness under everything.

Jev's total bill for an issue on this table is about a cent, and its total
saving in LLM tokens about $1.5 (fewer wasted fetches, a smaller researcher
context, a verifier that reads less). Its value is the second opinion at the
two gates and the screen on scraped text. Every Jev call runs behind a
provider switch (OpenRouter now, TypeSafe direct when signups reopen, a
compatible server if the vendor fails), with embeddings or Haiku 4.5 as the
fallback for the passage screen.

---

## 4. The research phase: the split, verified

The proposal was to split the researcher: a **sweep** on Sonnet 5 (search,
fetch, extract, capture, write the draft dossier and an evidence pack), then
a **judgment** pass on Opus 5, single-shot, in a clean context (confirm
anchors, flag disagreements, mark unverified, write the structural argument,
list extra fetches), with a short second sweep if asked.

### 4.1 Cost, measured on the six September runs

Per research run, after the harness diet, list prices
(`docs/cost/2026-09-27-split-pricing.md`):

| Configuration | Per run | Against Opus alone |
|---|---|---|
| Today, Opus 5, ledger (no diet) | $7.38 | |
| (a) Opus 5 alone, dieted | **$5.43** | |
| (b) Opus 5 alone at `medium`, dieted | **$4.29 to $4.94** | −$0.49 to −$1.14 |
| (b') Opus 5.5 alone at `medium`, dieted (estimate: 0.8x writes and output, 0.4x reads, then the `medium` factor) | **about $3.50 to $4.00** | about −$1.50 to −$2.00 |
| (c) Sonnet 5 alone, dieted | **$2.93** | −$2.50 |
| (d) The split, one round (sweep + judge) | **$3.40** | −$2.03 |
| (d) The split, two rounds (sweep + judge + second sweep + sign-off) | **$3.77** | −$1.66 |
| (d) with both Opus passes on Batch | $3.06 to $3.26 | |

The ranking holds on every one of the six runs. The split costs $0.47 to $0.84
more than Sonnet alone and $1.66 to $2.03 less than Opus alone, and it sits in
the same band as Opus 5.5 alone at `medium`. What drives the result: the web
helper spend, identical in every configuration ($1.26 average, 43% of the
Sonnet figure), the judge's output size, and whether Sonnet takes the same
number of requests as Opus, which no run has yet measured.

Latency: the split is the slowest option, about 16 to 18 minutes against 15
for Opus alone and 14 for Sonnet alone, because the Opus passes run after the
sweep. Sonnet 5 generates only about 11% faster per token than Opus 5 in these
runs (98 against 88 tokens per second).

### 4.2 Quality, on the published evidence

`docs/cost/2026-09-27-split-evidence.md`, 56 sources. No published test of
this exact shape exists. The closest evidence:

- **The judge only sees what the sweep finds.** On DeepResearch Bench II,
  which scores recall among other things, Sonnet 5 scores 56% at $1.20 a task
  against Opus 5's 71% at $6.71. On BrowseComp the gap is 6.1 points. On
  long-context reasoning they are level. A fact the sweep never finds is one
  no evidence pack can carry.
- **Anthropic's current guidance points away from the split for work this
  size.** On the live "optimizing for cost and intelligence" page, an
  orchestrator handing bulk work to a cheaper worker saved 47% to 55% and lost
  10 to 12 points on a job too large for one context window. On research that
  fits one context (DeepWideSearch, BrowseComp) the frontier model alone at
  lower effort matched the orchestrator at 22% to 30% lower cost. The page's
  recommended order: sweep effort on the current model first, then price the
  stronger model alone at low effort, and start agent work on Opus 5.5 at
  `medium`. Our research run peaks at 130k to 150k tokens after the diet and
  fits one context.
- **Effort barely moves research accuracy.** On research benchmarks low
  effort gave up 1 to 3 points for a third to a half off the cost, measured
  on Fable 5, not Opus 5.
- **What still argues for a separate checker.** Models judged by themselves
  score themselves higher, and a separate context helps (models missed 64.5%
  of errors when told the errors were their own). Anthropic's January 2026
  post calls splitting agents by type of work "often counterproductive", and
  names verification agents as the exception. Today's Opus researcher already
  hands off to itself through an undesigned compaction summary in half the
  runs, which the diet removes.
- **Handoff loss is designable against.** In the Minions study the same two
  models reached 87% or 97.9% of the frontier model's quality depending only
  on how the handoff was designed. Coverage loss is not designable against.

The evidence agent's verdict, and this plan adopts it: the split matches or
beats Opus alone on dossier quality with **35% confidence**, costs less than
today with 75% confidence, and less than a tuned Opus run with 45% confidence.

### 4.3 The verdict

**Do not build the split first.** The cheaper experiments come first and may
make it unnecessary:

1. **Opus 5 at `medium`** on the dieted loop: no model change, about $4.30 to
   $4.90, the flat research curve says the dossier holds.
2. **Opus 5.5 at `medium`** after the SDK upgrade: about $3.50 to $4.00, the
   frontier line at Sonnet-like cache-read prices, the vendor's own
   recommendation for agent work. Research benchmarks for it are not yet
   published, so it is measured, not assumed.
3. **The check pass, on any sweep.** The half of the judge that the evidence
   supports is the checking half: recompute every derived number, confirm
   every anchor, flag disagreements. It costs about $0.65 single-shot, needs
   no second sweep, and applied to September's Opus dossiers it would have
   caught all three dossier-caused errors, because all three were arithmetic.
   It is a quality step, not a cost step, and it is model-agnostic about who
   swept. **This is the part of the split to build now.**
4. **The split as the fallback.** If the operator wants the Sonnet price
   point (about $2.90 plus the check pass), the sweep runs on Sonnet with the
   check pass as its safety net and the acceptance bar in §4.5 as its judge.
   The evidence pack then matters: one record per extract with the verbatim
   snippet, URL, tier and date, every disagreement kept side by side, the
   negative results (queries run, fetches failed, primaries not found), data
   tables copied row by row, and the full page text on disk loadable by ID.
   That pack is also the input Jev's passage screen and the verifier's
   pre-pass want, so it is worth building regardless.

### 4.4 What the judge cannot fix, and what changes it

The evidence pack today is `WebFetch`'s answers to the researcher's own
questions, about 1k characters each, not page text. A judge reading it can
confirm an anchor only against those answers, which is also all the
researcher ever saw. If the check must be against source text, the pack's
form, not the model choice, becomes the cost driver: readability-extracted
pages run 125k to 250k tokens per issue, about $0.50 to $1.10 per Opus pass
that reads them. Jev's screen is what keeps that pack small.

### 4.5 The acceptance bar for any cheaper researcher

From the measured Opus dossiers (`docs/cost/2026-09-27-dossier-baseline.md`
§7). Thresholds sit at or just under what Opus 5 cleared, because some ideal
values (zero verifier flags) Opus does not clear either.

| Check | Floor |
|---|---|
| Sources, publishers, tiers, top-publisher share | ≥ 8, ≥ 5, ≥ 3, ≤ 40% (the 2026-09-16 floors. September ran 11 to 25, 8 to 12, 3 to 6, 27% to 37.5%). Since the operator's ruling of 2026-09-28 an official-record publisher (T0 on the desk's allowlist) above 40% is set aside and counts once, with five other publishers required |
| Drawn-graphic kinds named beside captured data in §4 | ≥ 4, or 3 with a note that a fourth kind's data is folded into another's table |
| `[UNVERIFIED]` markers | ≤ 15, each naming its resolution path |
| §1 structural argument | present, 200 to 350 words |
| §5 quotes | ≥ 2, every one traceable to a URL |
| Indian ground subsection, per-source tier and viewpoint tags | present |
| Downstream: verifier ❌ traced to the dossier itself | ≤ 1 per issue (Opus produced exactly one in three of six) |
| Downstream: reader-panel first pass | REVISE acceptable, BLOCK is not (all sixteen issues got REVISE) |

### 4.6 The first measured round

Arms, one desk each or one desk under all: A today's dieted Opus run, B Opus
at `medium` (or Opus 5.5 at `medium`), C the split, and D if budget allows an
Opus sweep with an Opus check pass, which separates the structure from the
model. Include one topic re-researched from a published issue with a known
trap (the "three laws" count from the Phase 6 record). Score blind on factual
accuracy, citation accuracy, completeness, source quality and tool efficiency.
Measure cost per phase including the worst run, coverage (facts each arm found
that the others missed), how many load-bearing facts have a verbatim primary
source, an audit of twenty random facts per dossier against their sources,
whether each arm catches the trap, and for the split how many relevant facts
on the fetched pages reached the pack and how much of the judge's context was
used. Plant two or three wrong records in a pack and check the judge catches
them. Adopt any cheaper arm only if it matches or beats the better of A and B
on that scoring, at lower cost. Each arm is one editorial run the operator
starts, about $3 to $6 at the corrected prices.

---

## 5. The levers, ranked, and the stacked path

Per issue against the corrected $31.41 baseline, API route, list prices,
5-minute writes. Standalone savings overlap. The arithmetic for each is in
`docs/cost/2026-09-27-cost-levers.md` §6 and `2026-09-27-split-pricing.md`.

| # | Lever | Saving | Kind | Risk |
|---|---|---|---|---|
| 1 | Passes and panel on the Messages API, single-shot, with Batch | $17.52 (56%), $14.62 without Batch | architecture, models unchanged | high |
| 2 | Harness diet: `settingSources: []`, bare-name `disallowedTools` for everything off the frontmatter list, the two needed rules inlined | $8.88 (28%) | free | low |
| 3 | Haiku 4.5 for the two loops | $7.83 (25%) | trade, high quality risk, not recommended | low to apply |
| 4 | Opus 5.5 for the four passes (0.8x writes and output, 0.4x reads) | $6.50 (21%) | model swap | needs the SDK upgrade |
| 5 | Sonnet 5 for discovery (ruled) and research (see §4) | $1.87 discovery, $3.68 research | ruled for both, research now sequenced behind the effort sweep | low |
| 6 | Halve the API requests: batch fetches per turn, stop denied off-list calls, tighter budgets | $5.20 (17%) | mostly free | low to medium |
| 7 | `effort: medium` on loops and panel | $0.9 to $3.7 | trade, needs a sweep | low |
| 8 | No in-run agent-memory upkeep | $3.16 (10%) | trade against CD-12 freshness | low |
| 9 | Web reading outside the LLM (Jev or embeddings triage, evidence pack) | $1.4 to $1.8 (6%) | trade, research judgment | medium to high |
| 10 | Load web tools up front (`ENABLE_TOOL_SEARCH=false`) | $0.88 | free | trivial |
| 11 | Remove the Agent tool | $0.37 average, $2.2 when it fires | free, also a cost-safety fix | trivial |
| 12 | The dossier check pass | −$0.65 (a cost) | quality | low |
| 13 | Context editing or compaction tuning | about 0 | not a saving lever | |
| 14 | 1-hour cache TTL on the API route | **−$6.20** (a cost increase) | do not | |

### The stacked path

| Step | Per issue | Cumulative |
|---|---|---|
| 0 Baseline, corrected | $31.41 | |
| 1 Tool search off, Agent tool removed | $30.16 | −4% |
| 2 Harness diet | $21.59 | −31% |
| 3 Discovery on Sonnet (ruled) | $19.72 | −37% |
| 4 Research at `medium` on Opus 5, plus the check pass | $19.3 to $19.9 | −38% |
| 5 No in-run memory upkeep, batched web calls | $17.9 to $18.5 | −42% |
| 6 Opus 5.5 at `medium` on research and the four passes | about $11 | −65% |
| 7 Passes and panel single-shot on the Messages API with Batch | **about $8 to $9** | **−72% to −75%** |
| Alternative at step 4: the split or Sonnet alone on research | about $1 to $1.5 lower at each later step | |

Steps 1, 2, 5 and the ledger fix are free. Step 3 is ruled. Steps 4 and 6 are
trade-offs run one at a time against the panel verdict, the verifier's
untraced count, `check:prose` and the §4.5 bar. Step 7 is the architecture
change and comes last.

**On the subscription route** (the slash commands) the same levers cut plan
usage rather than dollars, and the 1-hour writes make every written token
1.6x dearer in usage terms, so the harness diet matters there too.

---

## 6. Latency

| | Today | After the plan |
|---|---|---|
| Discovery | 8 min | about 6, fewer requests |
| Researcher | 17 min | about 12 to 15 (Opus at `medium` 12 to 13, Sonnet 14, the split 16 to 18), plus 3 for the check pass |
| Composer, drafter, stylist, verifier | 10, 15, 11, 9 min | one generation of about 30k tokens each, 6 to 10 min, or minutes to hours in Batch (no SLA) |
| Reader panel | 4 min ×2 | same |
| Jev calls | | about 200 a run at 0.2 to 1 s each: under 3 min sequential, seconds in parallel |
| **Per issue** | **about 79 agent-minutes** | about 60 interactive, or a Batch queue the operator feeds and reads back |

Batch is the only lever that adds waiting. It fits because the operator
already reviews between phases.

---

## 7. Risks, and the rules for a decision model here

- **Jev is a filter, never a gate.** The verifier's zero-untraced record and
  the panel's PASS are brand protection. Jev routes work to them (CP-06).
- **Scraped text is an attack surface.** Jev believes planted facts. Its
  screen lowers the researcher's load and does not protect it. The quotability
  and allowlist gates stay in code.
- **Thresholds are ours to set.** 50 to a few hundred labels from our own
  verification reports, per question type, and pin `jev-1.13.0`.
- **Arithmetic is code.** Three of three dossier errors in September were
  arithmetic. Jev cannot count. The check pass recomputes from stated inputs,
  and a derived number in a dossier carries its inputs and formula.
- **Hindi.** English first. The register's skip test stays a human and LLM
  judgment.
- **Vendor risk.** Twelve days old, signups paused, no SLA, price unproven.
  Everything Jev does here is a pre-pass whose absence costs a few dollars an
  issue, so an outage degrades cost, not output.
- **The free wins carry a hidden dependency.** The installed SDK 0.2.126 could
  not be inspected (the project's own settings deny reads under
  `node_modules`). Verify `settingSources`, `disallowedTools` and `effort`
  against the installed `sdk.d.ts` before relying on them, or upgrade and
  re-measure compaction, which current CLIs trigger at about 967k tokens.
- **The coverage gap is the split's real risk**, not the handoff. A pack
  cannot carry a fact the sweep never found. The §4.5 bar and the check pass
  are the net, and the §4.6 round is the test.
- **The cost-safety hole is open now.** Until lever 2 lands, a pipeline agent
  inherits `Bash(npm run *)` and could start a billing run on its own.

---

## 8. Decision record (proposed, unsigned)

- **CP-01 The baseline.** The corrected $31.41 per issue at list on the API
  route is the reference. The ledger is re-priced from the published table
  using `usage.cache_creation`'s 5-minute and 1-hour split, records
  `modelUsage` (helpers, compaction, subagents) and writes a row for every
  failed run from its transcript totals.
- **CP-02 The harness diet.** Pipeline agents run with `settingSources: []`,
  a restricted tool set (bare-name `disallowedTools` for every tool not in the
  frontmatter, `Agent` included), web tools loaded up front, and
  `permissionMode: 'dontAsk'` with explicit allows for `npm run check:prose`
  and PDF text extraction. The two rules the writing agents need are inlined
  into their prompts. The 5-minute TTL stays on the API route. Free, and it
  closes the inherited `Bash(npm run *)` path.
- **CP-03 The passes are single-shot.** Composer, drafter, stylist, verifier
  and panel receive their inputs assembled by `pipeline.ts` and return one
  artifact in one request: first inside the Agent SDK with the inputs inlined,
  then on the Messages API with Batch. The stylist returns structured edits
  the script applies and can refuse. Models and the 2026-09-21 routing are
  unchanged.
- **CP-04 Loop hygiene.** The loops batch independent fetches in one turn,
  keep the fetch and search budgets, and run at `effort: medium` once a
  one-round sweep shows the panel, the verifier and the §4.5 bar hold.
- **CP-05 Agent memory.** A curated digest in the prompt, updates in a
  post-review pass. CD-12's purpose stands, its in-run mechanics change.
- **CP-06 Jev is admitted as a decision layer, not a model.** Three jobs:
  (a) screening extracted passages in research before they enter context,
  (b) a claim-support pre-pass before the verifier, (c) grading the panel's
  quiz answers. Rules: a "none" option always, one item per call under 2k
  tokens, thresholds calibrated on our own labels and pinned to `jev-1.13.0`,
  low confidence routed to the LLM, never the final gate, never a security
  boundary, never arithmetic, and the same interface behind a provider switch
  with embeddings or Haiku 4.5 as the fallback for (a).
- **CP-07 Measure before the next trade.** Every trade-off lever runs on one
  issue and is read against the panel verdict, the verifier's untraced count,
  `check:prose` and the §4.5 bar before it becomes the default.
- **CP-08 Opus 5.5 at `medium` for research and the four passes**, after the
  SDK upgrade and CP-07's one-issue comparison. This amends the 2026-09-21 pin
  on `claude-opus-5` and is the operator's call.
- **CP-09 The dossier check pass.** A single-shot Opus pass after every
  research run, whatever model swept: recompute every derived number from its
  stated inputs, confirm the primary anchor behind each load-bearing fact,
  flag disagreements, mark unverified. A derived number in a dossier carries
  its inputs and its formula so the check is mechanical.
- **CP-10 The research model, in this order.** Opus 5 at `medium` first, Opus
  5.5 at `medium` second, the Sonnet sweep plus Opus judge split held as the
  fallback for the Sonnet price point, all judged by the §4.6 round and the
  §4.5 bar. The evidence pack of §4.3 item 4 is built regardless, because the
  Jev screen and the verifier pre-pass want it.

---

## 9. The operator's to-do, in order

1. **Rule on CP-01 to CP-10.** Sign, amend or strike each.
2. **Approve the free wins** (CP-01, CP-02, tool search off, Agent tool
   removed). An agent implements them in `scripts/lib/runner.ts` and the
   prompts, no billing involved, and verifies the SDK options against the
   installed type definitions. First run after the change: a verifier or a
   composer, whose output is checkable against a known report.
3. **Run discovery for one desk on Sonnet** and one research phase on Opus
   at `medium`. Read the re-priced ledger rows and the dossier against the
   §4.5 bar. That is the first measured point of the new curve.
4. **Open a Jev pilot account through OpenRouter** ($5). An agent runs the
   claim-support pre-pass over one already-verified issue against its dossier
   and compares it with the verifier's report, and runs the passage screen
   over one research run's evidence. Under $1 of Jev. The output is a labelled
   set and a threshold, or a reason to stop.
5. **Approve the check pass** (CP-09) and the evidence pack. Half a day, and
   it lands before any research model changes.
6. **Decide the SDK upgrade and Opus 5.5** (CP-08) after one measured issue
   on each. The upgrade changes compaction behaviour, so it is measured, not
   assumed.
7. **Decide the passes' migration** (CP-03). The largest saving and the
   largest job: two to three agent-days for the five passes, one at a time,
   the drafter last. The Agent SDK step (inputs inlined, no start-up reads)
   lands first and is most of the saving without Batch.
8. **Run the §4.6 round** only if the research price after steps 3 and 6 is
   still not where you want it.

---

## 10. Confidence

| Claim | Confidence | Why |
|---|---|---|
| What Jev is, its price, limits and access routes | 90% | primary docs, contract and API spec, cross-checked by twenty independent tests. Twelve days old, signup status can change any day |
| The corrected $31.41 baseline and the split of the bill | 90% | 53 transcripts reproduce the ledger rows exactly, the 5-minute formula reproduces clean runs to the cent. Helper and compaction residuals are inferred |
| The free wins save $9 to $10 per issue | 75% | arithmetic on measured token shares. The installed SDK's option behaviour could not be inspected |
| Research at `medium` on Opus holds quality | 70% | published flat curves on research benchmarks, on Fable 5 not Opus 5 |
| Opus 5.5 at `medium` on research costs about $3.50 to $4.00 | 60% | list prices and equal tokens. No research benchmark for it yet |
| The split costs $3.40 to $3.80 per run | 80% | measured token partitions, Sonnet's request count unmeasured |
| The split matches or beats Opus alone on quality | 35% | the evidence agent's verdict, adopted |
| The check pass would have caught September's dossier errors | 85% | all three were arithmetic on stated inputs |
| The passes single-shot with Batch bring an issue near $8 to $9 | 65% | conservative arithmetic, real implementation risk, the passes lose mid-run lookups |
| Jev's direct saving is small, $2 or under | 85% | web content measured at 7.6% of research reads |
| Jev improves gate consistency at near-zero cost | 60% | strong partner evidence, independent calibration conditional on task shape, no test on our data yet |

---

## 11. Sources and appendices

Appendices, each with its own source list:

- `docs/cost/2026-09-27-jev-factsheet.md`: TypeSafe's docs, API spec, contract, pricing, availability timeline, calibration evidence, the counter-case.
- `docs/cost/2026-09-27-jev-skeptic.md`: twenty independent tests and critiques, access from India, dependency risk, where the hype line sits.
- `docs/cost/2026-09-27-jev-ecosystem.md`: the GitHub ecosystem, `jev-mcp`'s eleven tools, `jev-recipes`, the two unrelated "OpenJev" projects, reported numbers.
- `docs/cost/2026-09-27-cost-levers.md`: the SDK options in use and available, current Anthropic rates, the ledger reconciliation, per-phase token attribution, every lever's arithmetic, the stacked path.
- `docs/cost/2026-09-27-token-profile.md`: the fixed prefix per agent, two real transcripts parsed.
- `docs/cost/2026-09-27-triage-alternatives.md`: search APIs, page extractors, embeddings, rerankers, small models with and without log-probabilities, Anthropic's server-side web tools, local CPU options, priced.
- `docs/cost/2026-09-27-split-pricing.md`: the six research runs partitioned request by request, compaction relative to the dossier write, the four configurations priced, latency.
- `docs/cost/2026-09-27-split-evidence.md`: 56 sources on worker-plus-judge pipelines, Sonnet 5 against Opus 5 on research benchmarks, long-context degradation, judge bias, handoff loss, the first-run protocol.
- `docs/cost/2026-09-27-dossier-baseline.md`: the sixteen dossiers measured, downstream outcomes, the acceptance bar.
- `research/_costs/analysis/*.mjs`: the scripts behind §1 and §4. They read the ledger and the run transcripts under the operator's Claude config only, and bill nothing.

Primary sources used directly in this plan:

- TypeSafe launch post and docs: https://typesafe.ai/blog/introducing-system-one-models-and-jev, https://docs.typesafe.ai/models, https://docs.typesafe.ai/api, https://docs.typesafe.ai/model-jaggedness/jev-1.13, https://typesafe.ai/legal/mca
- Anthropic pricing: https://platform.claude.com/docs/en/about-claude/pricing
- Anthropic cost and intelligence guidance: https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence
- Anthropic's multi-agent research system: https://www.anthropic.com/engineering/multi-agent-research-system
- Agent SDK docs: https://code.claude.com/docs/en/agent-sdk/typescript, https://code.claude.com/docs/en/agent-sdk/permissions, https://code.claude.com/docs/en/agent-sdk/claude-code-features, https://code.claude.com/docs/en/prompt-caching, https://code.claude.com/docs/en/agent-sdk/cost-tracking
- Claude extra usage at API rates: https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans
- OpenRouter's Jev tests: https://openrouter.ai/blog/insights/jev-vs-claude-opus-5-classification/
- DeepResearch Bench II: https://arxiv.org/abs/2601.08536
- Zyte: https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/
- The community MCP server: https://github.com/jkudish/jev-mcp

---

## 12. Implementation log and the trial issue (2026-09-28)

### 12.1 What landed (commits `b31ae68`, `1f2071b`)

CP-01, CP-02, CP-03 (the Agent SDK step, not yet the Messages API or Batch),
CP-04, CP-05, CP-06 (the verifier pre-pass and the panel grade, not yet the
research screen), CP-09 and CP-10 are implemented. Three Opus agents built
them in parallel and each hand-back was rated 9 of 10. Measured on the
runner's own probe: the first request fell from 54.6k to 58.5k tokens to
**4,199**, no CLAUDE.md reaches the model, cache writes are 5-minute on the
key, and the SDK's cost estimate now matches the list price. The Jev pilot
on two verified September issues routed every blocking finding of the old
verifier into the pre-pass's worklist for a third of a cent each (§12.4).

Added during the trial: `--topup --slug <s>` on research (the check pass
blocked a dossier for reasons one short fetch run clears), and the check
report as an input to the composer.

### 12.2 The trial issue: sports, "Nothing has been published in 1,330 days"

The operator chose the subject (Manchester City and the Premier League's
financial rules), signed CP-01 to CP-10, and authorised the storyboard
approval for this one trial. Every phase ran on the API key at list price.

| Phase | Model, effort | Requests | Minutes | First request | Cost |
|---|---|---|---|---|---|
| Discovery (`--focus`, 4 candidates) | Sonnet 5, medium | 10 | 4.7 | 10k | $0.77 |
| Research (C-01) | Opus 5, medium | 26 | 9.9 | 10k | $2.91 |
| Check pass 1 (BLOCKED, 5 numbers corrected) | Opus 5, high | 2 | 7.4 | 35k | $1.83 |
| Research top-up (spread and anchors) | Opus 5, medium | 14 | 4.2 | 10k | $1.48 |
| Check pass 2 (BLOCKED, rewrite refused by a guard bug, fixed the same day) | Opus 5, high | 3 | 10.3 | 43k | $2.39 |
| Storyboard | Opus 5, high | 2 | 6.5 | 108k | $2.26 |
| Draft, with the check round (4 flags, 3 fixed) | Opus 5, high | 4 | 17.3 | 80k | $4.81 |
| Panel 1 (REVISE) plus Jev grade | Sonnet 5, medium | 2 | 2.5 | 13k | $0.19 |
| Stylist (guard: 5 prose fields changed, no data field) | Opus 5, high | 2 | 4.7 | 68k | $1.21 |
| Panel 2 (REVISE) plus Jev grade | Sonnet 5, medium | 2 | 2.0 | 13k | $0.17 |
| Verifier, with the Jev pre-pass (NEEDS REVISION, 0 untraced) | Opus 5, high | 2 | 9.1 | 81k | $2.39 |
| Jev, 71 calls | jev-1.13 via OpenRouter | | | | $0.0024 |
| **Total** | | **69** | **79** | | **$20.40** |

Against the September sports issue (`premier-league-squad-cost-ratio`), same
desk, same phases where they existed: about $31 to $34 at list once the two
runs the old ledger never recorded (a draft and a failed verifier) are priced,
in about 80 agent-minutes. Like for like, without the three phases the old
pipeline did not have (two check passes and a top-up, $5.70), the trial cost
**$14.70, a 55% cut**. The plan's end-state estimate of $11 to $12 was not
reached because the single-shot passes emit more output than estimated (a
storyboard, a corrected dossier or a verification report is 30k to 58k tokens
with its reasoning) and the assembled prompts measured about a third larger
than the 2.7-characters-per-token rule (the drafter's 59.7k estimate ran at
79.8k).

**Quality, measured by the same gates as September:**

| Measure | September sports issue | The trial issue |
|---|---|---|
| Verifier | 71 ✅ · 39 ⚠️ · **15 ❌** · BLOCKED | 43 ✅ · 20 ⚠️ · **0 ❌** · NEEDS REVISION |
| Panel, first and second pass | REVISE, REVISE | REVISE, REVISE (all three quiz questions correct for all four readers, both passes) |
| `check:prose` on the draft as the pipeline left it | 0 ❌ · 2 ⚠️ (as published, after the operator's fixes) | 0 ❌ · 3 ⚠️ (5 words over the ceiling, a gloss the heuristic misses, SOURCE-NARROW) |
| Reader-facing words · names · words before the first graphic | 1,089 · 10 · 78 | 1,105 · 9 · 78 |
| Drawn graphics · distinct graphic kinds · new to the publication | 5 of 9 · 5 · 1 | 5 of 9 · 5 · 2 (`latency-waterfall`, `margin-ladder`) |
| Dossier: sources · publishers · tiers · top publisher | 24 · 12 · 5 · 37.5% | 20 · 13 · 6 · 40.0% after the top-up |
| Draft citations: sources · publishers · top publisher | 17 · 5 · 53% (Swiss Ramble) | 12 · 6 · 50% (Premier League) |
| Dossier-caused errors reaching the verifier | 1 (a wrong "furthest" row) | 0 (the check pass corrected six numbers before the storyboard) |
| Compaction during research | yes | none (peak context stayed under the threshold) |

Jev's contribution, measured: the pre-pass scored 47 claims against 179
dossier passages (24 confident support, 1 contradicted, 22 low confidence)
for $0.0019 in 30 seconds, and the two panel grades agreed with the panel on
11 of 12 answers each for $0.0003. It changed no verdict. It ordered the
verifier's attention and gave a second reading of every quiz grade at no cost.

**What the trial found that the plan did not predict:**

- The check pass is worth having and costs too much as written. It caught
  five wrong derived numbers, three anchors cited to statements that predate
  the facts they support, a contested charge count the hero was about to be
  built on, and a spread line that was wrong by six points. But the agent
  returns the whole corrected dossier as output (40k characters), which is
  most of its $1.83 to $2.39, and its second rewrite was refused by the
  guard, wrongly: the guard cut the dossier at its first §10 heading and
  misread a rewrite that had kept every section (fixed the same day). Fix
  for the cost: report only, with corrections as a
  structured list the script applies (§12.5).
- The draft's check round starts a fresh session and re-writes the 80k
  prompt to cache instead of reading it back: about $1 of the draft's $4.81.
  Fix: resume the session for the second request.
- Two phases still need the operator's ruling in every run of this desk:
  the publisher floor, because the Premier League is the only allowlisted
  publisher of its own disciplinary record (the September issue carried the
  same flag with Swiss Ramble at 53%), and how a reported-but-unpublished
  finding may be referenced. Both are editorial rules, not pipeline faults.
- The researcher reached for `sed` and `awk` on repo files twice (two paid,
  denied requests). Its prompt should say Read and Grep.
- The rupee conversion of the £105m loss cap is about ₹1,330 crore, which
  sat beside "1,330 days" and confused three of four panel readers. No gate
  finds a coincidence. The panel did.

### 12.3 Rulings made for the trial by the agent, each the operator's to overturn

1. The reported verdict may be referenced, attributed "as reported" every
   time and never as fact. The argument rests on the anchored absence of a
   published award.
2. The 40% publisher floor is counted on the dossier's §8 rows, as the rule
   is written (exactly 40.0% after the top-up). The draft's own citations are
   50%. The operator then ruled (2026-09-28) that an official-record
   publisher sits outside the ceiling, so the published issue clears the
   source floor under the amended gate.
3. Nine sections, not ten.

### 12.4 The Jev pilot on the September issues (Agent C, 2026-09-28)

| | Sports | Politics |
|---|---|---|
| Claims extracted | 67 | 44 |
| Old verifier's ❌ rows routed to the worklist | 5 of 5 | 2 of 2 |
| Old verifier's ⚠️ and ❌ rows routed, Jev plus code checks | 17 of 22 | 5 of 7 |
| ✅ rows Jev also called confident support | 34 of 44 | 30 of 43 |
| Panel grade agreement, pass 1 and 2 | 11 of 12, 11 of 12 | 11 of 12, 10 of 12 |
| Cost, calls, time | $0.0034, 91, 9.7 s | $0.0023, 68, 7.6 s |

8% of confident-support claims were still imprecise in the old reports, so
the pre-pass orders the verifier's attention and does not cut it (the
sampling sentence was removed from the verifier prompt). The labelled set is
`research/_costs/jev-pilot/`.

### 12.5 Post-trial fixes, for the operator's approval

1. Check pass: report only, corrections as `{section, was, now, why}` rows
   the script applies with the dossier guard. Expected: about $0.80 a run.
2. Draft check round and any second request: resume the session (cache read
   at 0.1x) instead of a new one. Expected: about $1 a draft.
3. Researcher prompt: Read and Grep for repo files, never a shell tool.
4. The rupee-days coincidence: an editorial rule for the stylist ("when a
   converted figure lands on a number the issue already uses, say so or
   round differently").
5. The publisher floor on desks with one official publisher: a ruling. Either
   an "official record" class that counts once, or a second allowlisted
   publisher for league discipline (the Guardian was unreachable to the
   fetch tool in both runs, and LawInSport answered 403 three times).
6. Then the plan's remaining steps in order: Opus 5.5 at medium on one
   issue (CP-08), the Messages API with Batch for the passes (CP-03's second
   half), the research screen (CP-06 a) once the evidence pack exists.
