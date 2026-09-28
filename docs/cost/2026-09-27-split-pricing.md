# Researcher split: Sonnet sweep, Opus judgment (priced on the six September runs)

2026-09-27. Read-only. Nothing billed. List prices from [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing): Opus 5 $5 input, $6.25 5-minute write, $0.50 cache read, $25 output. Sonnet 5 $2, $2.50, $0.20, $10. API route, 5-minute writes, 2.7 chars/token.

Transcripts: `sports 59aab041`, `politics 828bf7df`, `tech d83fac63`, `space 1786f13d`, `travel db3bff05`, `earth c5c301ed` in `C:\Users\user\.claude\projects\D--SideProjects-parallax\`. Per-request token counts reconcile exactly with the ledger rows.

---

## 0. The answer

| Per run, average of six | Cost | vs (a) |
|---|---|---|
| Ledger today (SDK estimate, no diet) | $7.38 | |
| (a) Opus alone, dieted | **$5.43** | |
| (b) Opus alone, effort `medium`, dieted | **$4.29 to $4.94** | −$0.49 to −$1.14 |
| (c) Sonnet alone, dieted | **$2.93** | −$2.50 |
| (d) Split, two rounds (sweep + judge + sign-off) | **$3.77** | −$1.66 |
| (d) Split, one round (sweep + judge) | **$3.40** | −$2.03 |

- **The split costs $0.47 (one round) to $0.84 (two rounds) per run more than Sonnet alone, and $1.66 to $2.03 less than Opus alone.** The ranking (a) > (b) > (d) > (c) holds on every run.
- **No run fetched anything after its first dossier Write** (0 web calls in 6 of 6). So the "second sweep" proxy is zero, and the one-round figure is what today's behaviour predicts.
- **Judgment is not a separate phase today.** The post-Write requests are jargon upkeep, a self-check grep or two and a summary (1.0k to 3.2k output). Cross-checking happens inline during the sweep and in the thinking before the dossier Write (about 2.3k to 10.5k tokens). The judge is therefore priced at the 15k fallback.
- **Three of six dossiers were written from a compacted memory** (space, travel, earth). After the diet, no run crosses the compaction threshold, so every dossier would be written from full context.
- **Latency:** the split is the slowest option (about 18 minutes with two rounds, 16 with one) because the Opus passes run after the sweep. Sonnet 5 is only about 11% faster per output token than Opus 5 in these runs (98 vs 88 tokens/s).

---

## 1. The partition, per run (task 1)

Each API request is classified from its tool calls and text:

- **SWEEP**: everything before the dossier Write. That is loading references (taxonomy, allowlist, template, ledger, catalog greps), RAG, WebFetch/WebSearch, PDF reads and extraction.
- **DRAFT-WRITE**: the one request that emits the first `Write` of the dossier. It carries both the draft and §1.
- **JUDGMENT**: everything after that Write.
- **SWEEP-2**: post-Write web calls (none occurred).

Observed tokens, as run:

| Run | SWEEP req / cache-read / output | DRAFT-WRITE cache-read / output | JUDGMENT req / cache-read / output | Web calls after first Write |
|---|---|---|---|---|
| Sports | 27 / 2,790,483 / 20,028 | 142,636 / 27,708 | 6 / 383,167 / 2,808 | 0 |
| Politics | 31 / 3,602,402 / 27,616 | 163,939 / 25,826 | 5 / 299,622 / 2,230 | 0 |
| Tech | 25 / 2,654,893 / 22,378 | 152,262 / 29,300 | 5 / 309,632 / 3,221 | 0 |
| Space | 38 / 4,137,889 / 32,378 | 82,456 / 23,019 | 1 / 85,995 / 1,009 | 0 |
| Travel | 42 / 4,892,298 / 31,176 | 19,636 / 15,341 | 4 / 345,440 / 3,194 | 0 |
| Earth | 34 / 4,107,579 / 27,276 | 19,636 / 16,170 | 2 / 159,359 / 1,956 | 0 |

Check: sports reads 2,790,483 + 142,636 + 383,167 = 3,316,286 and output 20,028 + 27,708 + 2,808 = 50,544, both exactly the ledger row.

### What the tool sequence and text show

**SWEEP.** Every run follows the same shape:

- Two or three requests load references.
- One ToolSearch loads the deferred web tools. That busts the cache at request 4 (request 10 in space).
- Then 20 to 35 requests of RAG query plus WebFetch/WebSearch, one to four calls each, with catalog greps between.
- Sports, politics, space and travel read saved PDFs. Space and travel also ran `pdftotext` through Bash/PowerShell.
- Travel delegated a subagent at request 27 and waited 146 s for it at request 41.

Cross-checking happens **inside** this sweep, in the visible notes. From travel: "India 2018 at 5.28m is clearly a misread — I'll treat the OWID pull as unreliable". From tech: "Two independent measures now agree the gap *stopped closing*".

**DRAFT-WRITE.** One request writes the whole dossier: 35k to 52k chars in 178 to 326 s. Output minus the visible dossier (chars ÷ 2.7) leaves the thinking done at write time:

| Run | Write-time thinking (tokens) |
|---|---|
| Sports | about 10.5k |
| Politics | about 8.7k |
| Tech | about 10.1k |
| Space | about 6.3k |
| Travel | about 2.3k |
| Earth | about 3.1k |

This is the only judgment-like reasoning that can be isolated.

**JUDGMENT (post-Write).** Read and Edit of `jargon.md` (5 of 6 runs), a Grep or Read of the dossier (sports, politics), one dossier Edit (travel, and sports where it was refused), and the final summary. No source re-checks. Sports' last message: "Both file writes were refused by the permission gate, so I'll flag the one discrepancy in the report rather than leave it silent."

**Conclusion for pricing.** The JUDGMENT partition's output (1.0k to 3.2k) is upkeep, not judgment, so it cannot stand in for the proposed Opus pass. The judge is priced at **15k output**, with 8k and 25k as sensitivities in §4.

---

## 2. Compaction relative to the first dossier Write (task 2)

| Run | Compaction before request | First Write at request | preTokens → postTokens | Duration | Dossier written from |
|---|---|---|---|---|---|
| Sports | 29 | 28 | 184,309 → 8,275 | 140 s | Full context. Compaction fired right after, pushed over by the Write's 27.7k output |
| Politics | 33 | 32 | 204,961 → 7,433 | 97 s | Full context (same pattern) |
| Tech | 27 | 26 | 197,369 → 8,671 | 162 s | Full context (same pattern) |
| Space | 36 | 39 | 169,565 → 11,615 | 161 s | **Compacted memory.** Three requests after the summary (a second ToolSearch, two WebSearch), then the Write on an 86k-token context |
| Travel | 43 | 43 | 173,049 → 10,301 | 139 s | **Compacted memory.** The Write request itself ran on the 67.6k post-compaction context |
| Earth | 35 | 35 | 175,233 → 9,222 | 210 s | **Compacted memory.** Same, 65.9k context |

The three compacted writers show the least write-time thinking (6.3k, 2.3k and 3.1k tokens, against 8.7k to 10.5k for the others). Travel and earth also wrote the shortest dossiers (35.3k and 35.4k chars, against 45k to 52k for the other four).

After the diet, the rebuilt uncompacted peak falls to 128.7k to 152.5k tokens. That is under the threshold, estimated at about 167k (the lowest observed trigger was 169.6k), so none of the six would compact.

---

## 3. Sizes (task 3)

| Run | Draft dossier (first Write) | §1 | Dossier on disk now | Evidence pack: WebFetch (with URLs) + WebSearch | Other extracts (PDF reads, pdftotext, TaskOutput) | Taxonomy + allowlist | Judge input (+3k prompt) |
|---|---|---|---|---|---|---|---|
| Sports | 46,571 chars = 17.2k tok | 1,494 | 47,270 | 26,366 + 34,117 = 60,483 chars = 22.4k tok | 93 | 9,236 + 19,902 = 29,138 chars = 10.8k tok | 53.4k tok |
| Politics | 46,144 = 17.1k | 1,445 | 46,570 | 28,446 + 33,205 = 61,651 = 22.8k | 93 | 9,236 + 18,712 = 27,948 = 10.4k | 53.3k |
| Tech | 51,927 = 19.2k | 2,054 | 52,510 | 39,505 + 23,476 = 62,981 = 23.3k | 0 | 9,236 + 22,957 = 32,193 = 11.9k | 57.5k |
| Space | 45,154 = 16.7k | 1,461 | 45,608 | 30,685 + 58,290 = 88,975 = 33.0k | 274 | 9,236 + 17,914 = 27,150 = 10.1k | 62.7k |
| Travel | 35,304 = 13.1k | 1,313 | 35,890 | 25,175 + 55,707 = 80,882 = 30.0k | 6,779 | 9,236 + 20,226 = 29,462 = 10.9k | 56.9k |
| Earth | 35,372 = 13.1k | 1,643 | 35,899 | 39,694 + 48,517 = 88,211 = 32.7k | 0 | 9,236 + 21,280 = 30,516 = 11.3k | 60.1k |

**What the evidence pack is.** WebFetch results average 790 to 1,520 chars per fetch. They are the helper model's answers to the researcher's own questions, not page text. WebSearch results are listings of 2.3k to 3.4k chars per search.

A judge reading this pack can confirm an anchor only against those answers. A pack that carried page text instead (about 25 pages at 5k to 10k tokens after readability extraction) would be 125k to 250k tokens.

The judge input without the allowlist is 6.6k to 8.5k tokens smaller, about $0.03 to $0.04 less.

---

## 4. Pricing the four configurations (task 4)

### Method

1. **Rebuild each run without compaction.** Before a compaction, use the measured growth of each request's prompt. Across a compaction, carry the previous request's full output plus the tool results appended (chars ÷ 2.7), and drop the summary and the re-injected context.
2. **Apply the "realistic" diet:**
   - First-request prefix kept at 25% (about 56.8k → 14.2k).
   - Nested `research/AGENTS.md` and `editorial-voice.md` removed. That is 7,963 tokens at first load plus 6,136 at the post-compaction reload, 14,099 per run (file size ÷ 3.0).
   - Agent tool removed.
3. **Tool search stays on**, as costed in the diet. The one deferred-tool bust per run re-writes the context, costing $0.14 to $0.23 at Opus. `ENABLE_TOOL_SEARCH=false` would remove it.
4. **Price each request:** writes = new content, reads = previous context, output as observed, 5-minute rates.
5. **Requests outside the main loop, equal in every configuration:**
   - Web helper requests, estimated as the SDK residual minus $0.50 per compaction: sports $0.61, politics $0.78, tech $0.76, space $0.89, travel $0.86, earth $2.91.
   - Travel's delegated sweep (25 requests, 40 web calls): kept as a stand-in at the sweep model's rates, $2.17 on Opus or $0.87 on Sonnet, plus $0.75 of helpers.
   - No compaction in any dieted run.
6. **(b)** multiplies the dieted Opus main loop by 0.70 to 0.87, the published cost of `medium` against the default on research and knowledge work. The live guide says `medium` "matched the default's accuracy at about 70% to 87% of its cost" (Fable 5, [optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)).
7. **(d) is made of:**
   - Requests 1 to W at Sonnet rates (the sweep writes the draft dossier), plus helpers.
   - Opus judge single-shot: input = draft dossier + evidence pack + taxonomy + allowlist + 3k prompt, at $5. Output 15k at $25.
   - Second sweep priced from the post-Write fetch count, which is 0.
   - Opus sign-off single-shot: input = dossier + 5k notes + 3k prompt. Output 10k.
   - The runner captures the evidence pack from the stream (the SDK emits tool results as user messages), so no model output is spent writing it. Having Sonnet write it out instead would add 22k to 33k output tokens, $0.22 to $0.33 per run.

Dieted tokens (whole run → requests 1..W): sports W 166,912 / R 2,350,014 / O 50,544 → 132,342 / 1,627,109 / 47,736. Politics 171,543 / 2,951,566 / 55,672 → 141,208 / 2,252,737 / 53,442. Tech 178,346 / 2,253,205 / 54,899 → 143,333 / 1,602,220 / 51,678. Space 186,651 / 2,899,828 / 56,406 → 163,577 / 2,770,362 / 55,397. Travel 182,799 / 3,543,960 / 49,711 → 161,203 / 2,996,961 / 46,517. Earth 172,747 / 2,883,159 / 45,402 → 150,494 / 2,611,147 / 43,446. For comparison, the observed reads were 3.1M to 5.3M.

### Worked example: sports

| Config | Arithmetic | Total |
|---|---|---|
| (a) | 166,912 × $6.25 + 2,350,014 × $0.50 + 50,544 × $25 = $1.04 + $1.18 + $1.26 = $3.48, + helpers $0.61 | **$4.09** |
| (b) | $3.48 × 0.70 to 0.87 + $0.61 | **$3.05 to $3.64** |
| (c) | 166,912 × $2.50 + 2,350,014 × $0.20 + 50,544 × $10 = $0.42 + $0.47 + $0.51 = $1.39, + $0.61 | **$2.00** |
| (d) sweep | 132,342 × $2.50 + 1,627,109 × $0.20 + 47,736 × $10 = $1.13, + $0.61 | $1.74 |
| (d) judge | (46,571 + 60,483 + 29,138) / 2.7 + 3,000 = 53,441 × $5 + 15,000 × $25 | $0.64 |
| (d) sign-off | (46,571 / 2.7 + 8,000) = 25,249 × $5 + 10,000 × $25 | $0.38 |
| (d) total | $1.74 + $0.64 + $0 (second sweep) + $0.38 | **$2.76** (one round $2.38) |

### Per run

| Run | Ledger today | (a) Opus | (b) Opus `medium` | (c) Sonnet | (d) two rounds | (d) one round | (d) = sweep + judge + sign-off |
|---|---|---|---|---|---|---|---|
| Sports | 5.85 | 4.09 | 3.05 to 3.64 | 2.00 | 2.76 | 2.38 | 1.74 + 0.64 + 0.38 |
| Politics | 6.52 | 4.72 | 3.53 to 4.20 | 2.35 | 3.13 | 2.75 | 2.11 + 0.64 + 0.38 |
| Tech | 6.07 | 4.37 | 3.29 to 3.90 | 2.21 | 3.00 | 2.62 | 1.96 + 0.66 + 0.39 |
| Space | 6.93 | 4.91 | 3.71 to 4.39 | 2.50 | 3.47 | 3.09 | 2.40 + 0.69 + 0.37 |
| Travel | 10.24 | 7.94 | 6.69 to 7.40 | 4.14 | 4.96 | 4.60 | 3.94 + 0.66 + 0.36 |
| Earth | 8.65 | 6.57 | 5.47 to 6.09 | 4.37 | 5.27 | 4.92 | 4.24 + 0.68 + 0.36 |
| **Average** | **7.38** | **5.43** | **4.29 to 4.94** | **2.93** | **3.77** | **3.40** | **2.73 + 0.66 + 0.37** |

### Sensitivities for (d)

| Change | Effect per run |
|---|---|
| Judge output: observed post-Write output (1.0k to 3.2k, not judgment) | judge $0.32 to $0.37 |
| Judge output 8k | judge $0.47 to $0.51 |
| Judge output 25k | judge $0.89 to $0.94 |
| Evidence pack carries page text (125k to 250k tokens) instead of WebFetch answers | +$0.5 to $1.1 per Opus pass that reads it |
| Both Opus passes on the Batch API (50% off, results within 24 hours) | (d) $3.26 (two rounds), $3.06 (one round) |
| Second round actually asks for k fetches | about $0.10 to start the Sonnet run + about $0.035 per fetch (reads, output, helper) + $0.37 sign-off. For example 5 fetches ≈ $0.65 |

### What drives the result most, in order

1. **The web helper spend** ($0.61 to $2.91 per run, average $1.26 including travel's delegated helpers). It is identical in every configuration, so it compresses all the gaps. It is 31 to 67% of (c) run by run (43% on average). It is also inferred, because the runner does not log `modelUsage`. If WebSearch's helper runs on the main model, the Sonnet configurations are somewhat cheaper than shown.
2. **The judge's output size and whether a second round happens.** These alone move the (d)−(c) premium from about +$0.3 (one round, 8k) to about +$1.1 (two rounds, 25k). Page-text evidence adds another $0.5 to $1.1 for each Opus pass that reads it.
3. **Sonnet behaving like Opus in the sweep** (same requests and tokens). Not yet measured: no Sonnet research run exists. Every 30% more requests adds about $0.25 to $0.35 to (c) and to (d)'s sweep.
4. **The diet.** It sets the absolute level of (a), (b), (c) and the sweep: the prefix cut, and no compaction. It does not touch the judge.
5. **The `medium` factor for (b)** (published on Fable 5 research benchmarks, not measured on Opus 5 here).

---

## 5. Latency (task 5)

Measured throughput on outputs of 8k tokens or more: Opus 5 88.3 tokens/s (52 requests, p10 to p90 78 to 97), Sonnet 5 98.2 tokens/s (16 requests, 90 to 104). Today's research runs took 865 to 1,437 s (average 17.4 minutes): generation 629 to 1,055 s, tool waits 96 to 295 s, compaction 97 to 210 s.

- **(a) Opus, dieted:** about 14.9 minutes average (725 to 1,227 s). Today minus the compaction wait.
- **(b) Opus `medium`:** about 11.7 to 13.1 minutes (estimate). Thinking and per-turn generation shrink 20 to 35%, while the dossier text itself (about 180 s at 88 tokens/s) does not.
- **(c) Sonnet:** about 13.7 minutes (661 to 1,121 s). Generation × 88.3 / 98.2, tool waits unchanged.
- **(d) Split:** about 18.3 minutes with two rounds (933 to 1,404 s), 16.3 minutes with one. Sonnet sweep about 13.2 min, then the Opus judge about 3.1 min (15k at 88 tokens/s plus prefill), then the sign-off about 2 min, in sequence. On the Batch API, add queue time of up to 24 hours.

Earth carries a 548 s request with only 4.8k output (a stall), which inflates earth in every configuration.

---

## 6. Two structural notes for the decision

- **The split changes who checks, not just the price.** Today the Opus researcher checks its own sources inline and never re-opens them after writing. The split puts the final check on a model that did not collect the evidence. But the judge can only see what the pack holds, which is WebFetch's ~1k-char answers, not the sources. If the check must be against source text, the pack's form, not the model choice, becomes the cost driver.
- **The diet alone fixes the compacted-memory writes.** Three of six dossiers were written after a compaction had summarized the sweep. With the prefix cut, every run stays under the threshold, in every configuration.

Scripts (read transcripts and ledger only) are in `C:\Users\user\AppData\Local\Temp\claude\D--SideProjects-parallax\02113c33-9eda-4193-b5b5-7f47aec6a4ac\scratchpad\`: `split.mjs` (request table, partitions, sizes → `split.json`), `split-price.mjs` (diet simulation and the four configurations), `throughput.mjs` (tokens per second). No project file was changed.
