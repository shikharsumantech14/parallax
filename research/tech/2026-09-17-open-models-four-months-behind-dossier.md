# Dossier: Open models are four months behind, not four years

- **Category:** tech
- **Candidate:** C-02
- **Researched:** 2026-09-17
- **Researcher:** researcher-agent
- **Status:** ready-for-draft

---

## 1. Structural argument (the Parallax take)

The reader arrives believing open models are in a race: behind today, catching
up, and one day level with the closed frontier. The measurements say the race
is over and it did not end the way either side argues. The gap stopped closing
in 2025 and then widened slightly: Epoch AI's capability index put open weights
three months behind the closed frontier across Jan 2023–Oct 2025, and four
months behind since January 2026; Stanford's AI Index, measuring something else
entirely (human-preference Elo, not benchmarks), found the top closed model's
lead over the top open model grew from 0.5% in August 2024 to 3.3% in March
2026. Two independent instruments, the same direction. What that stable lag
means is the real inversion: if the distance is a roughly constant few months
rather than a widening chasm, frontier capability is not a moat, it is a
subscription you can decline — today's frontier is yours in about a hundred
days for the price of the hardware, with no per-token bill and no vendor. That
offer is now on the table, priced and dated. And almost nobody takes it. Of 139
state-backed sovereign-AI projects across 56 countries, 40% chose Meta's Llama
and **zero** chose DeepSeek or Moonshot — the models actually at the open
frontier. On Hugging Face, 83% of all-time downloads go to models under one
billion parameters and just 3% of 2026's volume goes to anything above 70
billion. The mechanism behind the gap between the offer and the uptake is what
the issue exists to name: the four months is the cheap part. Kimi K3 is 2.8
trillion parameters and its weights are a file you cannot usefully hold — what
is not downloadable is the GPU cluster to serve it, the evaluation to trust it,
the licence certainty to build a business on it, and the tokeniser that does
not charge an Indian-language question five times what it charges the same
question in English. The capability gap closed to four months. The gap that
actually decides who uses these models was never the capability gap.

---

## 2. Why now

**The September refresh the candidate demanded, and it holds.** On **3
September 2026** OpenAI released **GPT-6 Astra**, which Epoch AI scores at
**ECI 166 — rank 1 of 249 tracked models**. The best open-weight model is
**Kimi K3** from Moonshot (China), announced **16 July 2026** at **ECI 158**,
with weights released **27 July 2026**. The live gap on the day of writing is
therefore **exactly 8.0 ECI points** — which is precisely the average gap Epoch
measured across January–May 2026. The candidate's headline figure did not go
stale; it was re-confirmed by two model releases since the window closed.

The second anchor is that the trend **reversed**. Epoch's October 2025 reading
was three months; the January–May 2026 reading is four. Stanford HAI's 2026 AI
Index, published from March 2026 data, independently reports the closed lead
growing from 0.5% (Aug 2024) to 3.3% (Mar 2026). The story is not "open models
are catching up" — it is "open models caught up to within a few months, and
then stopped there."

Third, on **30 July 2026** Rest of World reported the uptake number that turns
the finding inside out: the Sovereign AI Index tracks **139 state-backed AI
projects across 56 countries**, and despite more than a year of availability,
**zero** selected DeepSeek or Moonshot models.

---

## 3. Timeline of events

| Date | Event | Source |
|---|---|---|
| 2024-09-12 | OpenAI releases o1-mini / o1-preview, the first reasoning models. Epoch dates the current frontier trend from here: the ECI frontier advances **14 points/year** after this, against 6 points/year for non-reasoning models before it. | [Epoch AI](https://epoch.ai/data-insights/eci-frontier-trend) |
| 2024-08 | Stanford AI Index baseline: top closed model leads top open model by **0.5%** on the Arena leaderboard. | [Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance) |
| 2024-10-15 | AI Now Institute publishes "The Openness Imperative", warning that "openwashing is a real risk" and that releasing weights "provides only some of the benefits we've come to expect from open source." | [AI Now Institute](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai) |
| 2025-07-25 | Alibaba releases Qwen3-235B-A22B-Thinking — ECI 145.26. | [Epoch AI](https://epoch.ai/data-insights/us-vs-china-eci) |
| 2025-09-24 | Alibaba releases Qwen3-Max — ECI 145.28. | [Epoch AI](https://epoch.ai/data-insights/us-vs-china-eci) |
| 2025-10-30 | Epoch's earlier reading: open-weight models lag state-of-the-art by **~3 months** on average across Jan 2023–Oct 2025. | [Epoch AI](https://epoch.ai/topics/open-models) |
| 2025-11-06 | Moonshot releases Kimi K2 Thinking — ECI 145.05. | [Epoch AI](https://epoch.ai/data-insights/us-vs-china-eci) |
| 2025-12-01 | DeepSeek releases DeepSeek-V3.2 — ECI 146.46. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-02-11 | Zhipu AI releases GLM-5 — ECI 146.62. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-02-19 | Mozilla CTO Raffi Krikorian, writing ahead of India's AI Impact Summit in New Delhi, argues nations renting foreign models cannot be sovereign. | [Rest of World](https://restofworld.org/2026/india-ai-summit-open-source-sovereignty-mozilla-investment/) |
| 2026-02-23 | arXiv preprint "Beyond the Binary: A nuanced path for open-weight advanced AI" (cs.CY, CC BY 4.0) finds "no commonly adopted standards for determining when or how advanced models should be released openly." | [arXiv 2602.19682](https://arxiv.org/abs/2602.19682) |
| 2026-03-05 | OpenAI releases GPT-5.4 — ECI 156.13. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-03 | Stanford AI Index reading: closed lead now **3.3%**; top US model leads top Chinese by **2.7%**; Anthropic (1,503), xAI (1,495), Google (1,494), OpenAI (1,481), Alibaba (1,449) and DeepSeek (1,424) all in the top Arena Elo tier. | [Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance) |
| 2026-03-31 | Alibaba releases Qwen 3.6 Plus — ECI 149.08. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-04-07 | Zhipu AI releases GLM-5.1 — ECI 149.94. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-04-16 | Anthropic releases Claude Opus 4.7 — ECI 156.18. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-04-20 | Moonshot releases Kimi K2.6 — ECI 151.60. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-04-23 | OpenAI releases GPT-5.5 (ECI 158.22) and GPT-5.5 Pro (ECI 159.35). **GPT-5.5's 158.22 is the mark Kimi K3 reaches 84 days later.** | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-04-24 | DeepSeek releases V4 under **MIT licence** — V4-Pro (1.6T params, 865GB, $1.74/$3.48 per M tokens) and V4-Flash (284B, 160GB, $0.14/$0.28). Willison: it "trails state-of-the-art frontier models by approximately 3 to 6 months". | [Simon Willison](https://simonwillison.net/2026/Apr/24/deepseek-v4/) |
| 2026-05-19 | Google releases Gemini 3.5 Flash — ECI 156.31. | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-05-29 | Epoch publishes the finding: since January 2026 open weights lag the closed frontier by **four months / 8 ECI points**, "similar to the gap between GPT-5 and GPT-5.5". | [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) |
| 2026-07-16 | Moonshot announces **Kimi K3** — 2.8T parameters, 2.0e25 FLOP training compute, ECI 158 (rank 11 of 249), $3/$15 per M tokens. | [Epoch AI](https://epoch.ai/models/kimi-k3) · [Simon Willison](https://simonwillison.net/2026/Jul/16/kimi-k3/) |
| 2026-07-20 | Nathan Lambert (Interconnects) calls K3 the moment "frontier open-weight models are now real", putting the lag at "3-5 months" against a previously debated 6-9. | [Interconnects](https://www.interconnects.ai/p/kimi-k3-the-open-weights-escalation) |
| 2026-07-27 | Kimi K3's **weights are released** as free open-weight software. | [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/) |
| 2026-07-30 | Rest of World reports the Sovereign AI Index: **139 state-backed projects, 56 countries, 40% chose Llama, zero chose DeepSeek or Moonshot.** | [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/) |
| 2026-08-03 | Rest of World reports the US split: 179 Silicon Valley startups urge preserving access to Chinese open models; Anthropic argues for restrictions. | [Rest of World](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/) |
| 2026-08-04 | Stanford HAI publishes "Open-Weight Models Aren't Enough", drawing the weights/source distinction. | [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society) |
| 2026-08-14 | Hugging Face's "State of Open Models: Summer 2026" publishes the download and licence census. | [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026) |
| 2026-09-03 | OpenAI releases **GPT-6 Astra** — ECI 166, rank 1 of 249, $10/$50 per M tokens. The live gap to Kimi K3 is 8.0 points. | [Epoch AI](https://epoch.ai/models/gpt-6-astra) |

---

## 4. Key facts & data

### 4.1 The headline measurement

- **The gap, Epoch's framing:** "Since January 2026, the most capable
  open-weight models have lagged frontier closed models by an average of four
  months" — an average **ECI gap of 8 points**, "similar to the gap between
  GPT-5 and GPT-5.5." — [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)
- **The gap WIDENED:** the same page states this "is slightly larger than the
  one identified in an October 2025 Data Insight, which found that open models
  lagged by an average of three months between January 2023 and October 2025."
  — [Epoch AI](https://epoch.ai/topics/open-models)
- **Epoch's own caveat, load-bearing — do not drop it:** the estimate "may tend
  to understate the true gap", because "open-weight models tend to perform
  worse on private benchmarks compared to closed models, plausibly because they
  more aggressively hillclimb on public benchmarks." —
  [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)
- **Independent corroboration, different instrument:** "As of March 2026, the
  top closed model leads the top open model by 3.3%, up from 0.5% in August
  2024." Measured on the **Arena leaderboard** (human preference), not on
  benchmarks. "Six of the top ten models on the Arena Leaderboard are now
  closed." — [Stanford HAI, AI Index 2026](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance)
- **Third corroboration, a practitioner:** DeepSeek-V4-Pro "trails
  state-of-the-art frontier models by approximately 3 to 6 months." —
  [Simon Willison](https://simonwillison.net/2026/Apr/24/deepseek-v4/)
- **Fourth:** Nathan Lambert puts the lag at "3-5 months", down from "a debated
  6-9 months". — [Interconnects](https://www.interconnects.ai/p/kimi-k3-the-open-weights-escalation)

### 4.2 What ECI is — attribute it, never call it "the" score

- **Definition (verbatim):** the ECI "combines scores from many different AI
  benchmarks into a single 'general capability' scale, allowing comparisons
  between models even over timespans long enough for single benchmarks to reach
  saturation." — [Epoch AI](https://epoch.ai/eci)
- **Construction:** aggregates **over 50 distinct benchmarks** (maths, software
  engineering, language, science); logistic fits to benchmark data, fit jointly
  across all data, "with benchmark difficulty inferred statistically from
  overlapping model results". Minimum **4 benchmarks** per model for inclusion.
  — [Epoch AI](https://epoch.ai/eci)
- **Calibration anchors — the reader's ruler:** "Claude 3.5 Sonnet = 130 and
  GPT-5 = 150." The scale is linear and has no maximum. —
  [Epoch AI](https://epoch.ai/eci)
- **Therefore, for the reader:** 20 ECI points is the whole distance from
  Claude 3.5 Sonnet to GPT-5. The open/closed gap of 8 points is **under half**
  of that one generational step. *(Derived from the two calibration anchors
  above — arithmetic, not a new claim.)*
- **Stated limitation:** models optimising specifically for benchmarks may be
  overestimated, and Epoch notes open-weight models "optimize on benchmarks
  more aggressively." — [Epoch AI](https://epoch.ai/eci)
- **Licence:** Epoch's AI Models database is **CC-BY 4.0** and downloadable at
  `https://epoch.ai/data/all_ai_models.csv`. Attribution required. —
  [Epoch AI](https://epoch.ai/data/ai-models)

### 4.3 The two models at the top today (the live gap)

| | **GPT-6 Astra** | **Kimi K3** |
|---|---|---|
| Developer / country | OpenAI, USA | Moonshot, China |
| Release date | 2026-09-03 | 2026-07-16 (weights 2026-07-27) |
| Weights | Closed | **Open** |
| ECI | **166** (rank 1 of 249) | **158** (rank 11 of 249) |
| Parameters | not disclosed | **2.8 trillion** |
| Training compute | not disclosed | **2.0e25 FLOP** |
| Price, input / M tokens | **$10** | **$3** |
| Price, output / M tokens | **$50** | **$15** |

Sources: [Epoch AI — GPT-6 Astra](https://epoch.ai/models/gpt-6-astra) ·
[Epoch AI — Kimi K3](https://epoch.ai/models/kimi-k3) · weights-release date
from [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/).

- **The live gap is 8.0 ECI points** (166 − 158), matching Epoch's measured
  average exactly. *(Derived; both figures sourced above.)*
- **The 84-day proof.** Kimi K3 scores 158 on 16 July 2026. GPT-5.5 scored
  158.22 on 23 April 2026. **Kimi K3 reached in July the closed frontier of
  late April — 84 days, about 2.8 months.** *(Derived; both tuples sourced to
  Epoch. This is the single cleanest instance of the thesis and it is
  arithmetic, not estimate.)*
- **Price ratio: 3.3×** on both input and output tokens ($10÷$3, $50÷$15).

### 4.4 Currency — CURRENT figures, so they take a ₹ bracket (contract §3 rule 4)

Rate used: **₹95.9 = $1**, mid-September 2026. **Put the rate and the month on
the section's source line**, per the currency rule.

| Item | USD | ₹ (at 95.9) |
|---|---|---|
| GPT-6 Astra, per M input tokens | $10 | **₹959** |
| GPT-6 Astra, per M output tokens | $50 | **₹4,795** |
| Kimi K3, per M input tokens | $3 | **₹288** |
| Kimi K3, per M output tokens | $15 | **₹1,439** |
| DeepSeek V4-Pro, per M output tokens | $3.48 | **₹334** |
| DeepSeek V4-Flash, per M output tokens | $0.28 | **₹27** |

- **Rate source:** [US Federal Reserve H.10 foreign exchange rates](https://www.federalreserve.gov/releases/h10/hist/dat00_in.htm),
  release of 8 September 2026. **⚠ federalreserve.gov is NOT on the tech
  allowlist** — see §9. The rate is a lookup, not a Parallax claim; if the
  editor prefers, substitute the RBI reference rate.
- **Ratio for the reader:** a million output tokens costs **₹4,795 from the
  closed frontier and ₹1,439 from the open one — and ₹27 from DeepSeek
  V4-Flash.** That is **178×** between the top and the floor. *(Derived.)*
- **HISTORICAL figures take no conversion.** None of the 2024–2025 prices in
  this dossier are converted, and no ₹ bracket goes inside a dated `timeline`
  event or on a per-token rate card (contract §3 rule 4, 2026-09-15 clauses).

### 4.5 Where the 8 points actually live — DATA for `benchmark-chart`

Both models' scores, same benchmark names, both from Epoch's model pages.
**This is the issue's best counter-intuitive beat: the average hides everything.**

| Benchmark | Domain | Kimi K3 (open) | GPT-6 Astra (closed) | Gap |
|---|---|---|---|---|
| GPQA Diamond | Graduate science | **93%** | **96%** | 3 pts |
| SimpleQA Verified | World knowledge | **51%** | **76%** | 25 pts |
| Chess Puzzles | Games / planning | **39%** | **72%** | 33 pts |
| Mystery Game Puzzles | Multi-step reasoning | **26%** | **84%** | 58 pts |

Sources: [Epoch AI — Kimi K3](https://epoch.ai/models/kimi-k3) ·
[Epoch AI — GPT-6 Astra](https://epoch.ai/models/gpt-6-astra)

- ⚠ **Do NOT put FrontierMath in this chart.** Kimi K3's score (72%) is on
  "FrontierMath Tiers 1-3 **v2**"; GPT-6 Astra's (94%) is on "FrontierMath
  Tiers 1-3". Different versions, not comparable. Excluded deliberately.
- ⚠ ARC-AGI-2 (K3: 60%) has no matching Astra figure on its page. Excluded.
- The four rows above are the only cleanly paired benchmarks found.

### 4.6 The release lineage — DATA for `version-graph`

Catalog DATA shape: `{ nodes: [{id, parents?, label?, tag?, lane?}] }`.
Every node below is a real dated release with a sourced ECI where one exists.
Suggested lanes: 0 DeepSeek · 1 Moonshot (Kimi) · 2 Zhipu (GLM) · 3 Alibaba
(Qwen) · 4 closed frontier (reference).

| id | lane | label | date | ECI | tag |
|---|---|---|---|---|---|
| `qwen3-235b` | 3 Alibaba | Qwen3-235B-A22B-Thinking | 2025-07-25 | 145.26 | open |
| `qwen3-max` | 3 Alibaba | Qwen3-Max | 2025-09-24 | 145.28 | open |
| `k2-thinking` | 1 Moonshot | Kimi K2 Thinking | 2025-11-06 | 145.05 | open |
| `ds-v32` | 0 DeepSeek | DeepSeek-V3.2 | 2025-12-01 | 146.46 | open |
| `glm5` | 2 Zhipu | GLM-5 | 2026-02-11 | 146.62 | open |
| `gpt54` | 4 closed | GPT-5.4 | 2026-03-05 | 156.13 | closed |
| `qwen36plus` | 3 Alibaba | Qwen 3.6 Plus | 2026-03-31 | 149.08 | open |
| `glm51` | 2 Zhipu | GLM-5.1 | 2026-04-07 | 149.94 | open |
| `opus47` | 4 closed | Claude Opus 4.7 | 2026-04-16 | 156.18 | closed |
| `k26` | 1 Moonshot | Kimi K2.6 | 2026-04-20 | 151.60 | open |
| `gpt55` | 4 closed | GPT-5.5 | 2026-04-23 | 158.22 | closed |
| `gpt55pro` | 4 closed | GPT-5.5 Pro | 2026-04-23 | 159.35 | closed |
| `ds-v4pro` | 0 DeepSeek | DeepSeek V4-Pro (1.6T, MIT) | 2026-04-24 | — | open |
| `ds-v4flash` | 0 DeepSeek | DeepSeek V4-Flash (284B, MIT) | 2026-04-24 | — | open |
| `gem35flash` | 4 closed | Gemini 3.5 Flash | 2026-05-19 | 156.31 | closed |
| `fable5` | 4 closed | Claude Fable 5 | ~2026-06-09 | — | closed |
| `k3` | 1 Moonshot | **Kimi K3 (2.8T)** | 2026-07-16 | **158** | open |
| `astra` | 4 closed | **GPT-6 Astra** | 2026-09-03 | **166** | closed |

Sources: ECI tuples from [Epoch AI — open/closed gap](https://epoch.ai/data-insights/open-closed-eci-gap)
and [Epoch AI — US vs China](https://epoch.ai/data-insights/us-vs-china-eci);
DeepSeek V4 specs from [Simon Willison](https://simonwillison.net/2026/Apr/24/deepseek-v4/);
Claude Fable 5 date from [Epoch AI — frontier trend](https://epoch.ai/data-insights/eci-frontier-trend);
K3 and Astra from their Epoch model pages.

- **Parent edges to author:** `k2-thinking → k26 → k3` (Moonshot line);
  `ds-v32 → ds-v4pro`, `ds-v32 → ds-v4flash` (the V4 fork — one release, two
  sizes, a genuine branch); `glm5 → glm51`; `qwen3-235b → qwen3-max →
  qwen36plus`; `gpt54 → gpt55 → gpt55pro → astra`.
- ⚠ **Qwen 3.8 Max (2.4T)** is named by Hugging Face and Stanford HAI but
  **I could not source a release date or ECI** — leave it out of the graph
  rather than guess a lane position.

### 4.7 The five layers of "open" — DATA for `arch-stack`

Catalog DATA shape: `{ layers: [{label, sublabel?, color?}] }`. Top to bottom,
each layer sourced. This is the jargon-buster made visual: what "open" covers
and where it stops.

| # | label | sublabel | source for the claim |
|---|---|---|---|
| 1 | **Weights** | Downloadable. Kimi K3, DeepSeek V4, Qwen. The layer everyone means by "open". | [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society) |
| 2 | **Licence** | Permissive for 81% of Chinese releases above 20B (59% Apache 2.0, 22% MIT). Only 29% of American ones. | [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026) |
| 3 | **Code** | Inference code usually. Training code rarely. | [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society) |
| 4 | **Training data** | Almost never released. "You still can't see how the thing was built, what it was trained on." | [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society) |
| 5 | **Compute and serving** | Not downloadable at any licence. Compute remains "prohibitively expensive and scarce". | [AI Now Institute](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai) |

- The **Model Openness Framework** (Linux Foundation) "Open Science Class"
  requires code, training data and tooling released together with mechanisms
  for outside researchers to study and modify the work — the standard almost
  no released model meets. — [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society)

### 4.8 The uptake inversion — the issue's landing

- **Sovereign AI Index: 139 state-backed AI projects across 56 countries. 40%
  chose Meta's Llama. ZERO chose DeepSeek or earlier Moonshot models** — after
  more than a year of availability. — [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/)
- **Download reality (verbatim):** "Among models that declare a parameter
  count, those under 1B take 83% of all-time downloads and everything above
  100B takes 1%. Restricting to downloads accumulated in 2026 changes nothing:
  3% of the volume goes to models above 70B." — [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)
- **Moonshot's total 2026 downloads: 37 million. Qwen's: 2,045 million** — 55×
  more. The lab at the open frontier is not the lab people download. —
  [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)
- **Qwen ecosystem: 151,448 derivative models on the Hub**, growing 180–210 new
  repositories per day through the first seven months of 2026; 28,531 GGUF
  conversions of which Qwen itself published only 54. Google's ecosystem:
  82,506 derivatives. — [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)
- **The size ceiling is Chinese:** "China's monthly ceiling ran between 754B and
  2.78 trillion parameters; U.S. models stayed under 130B in five of seven
  months." — [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)
- **Runtime layer growing far faster than models:** gguf library +464%,
  lerobot +194%, Apple mlx +148%, against transformers +16% and diffusers +21%
  over seven months. — [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)

### 4.9 Indian ground (REGISTER-PLAN §3 — sourced, not asserted)

- **The tokeniser tax — the strongest Indian anchor found.** "The same
  question, when asked in English, costs one-fifth of what it costs in an
  Indian language." — [Rest of World](https://restofworld.org/2026/india-frugal-ai-sarvam-krutrim-sovereign/),
  7 April 2026. **This is the link to the published token-bill issue**: with a
  closed API you simply pay the 5× multiplier; with open weights the tokeniser
  is a thing you can change.
- **Sarvam AI's OpenHathi** adapts open-weight base models — Meta's Llama and
  France's Mistral — to Indian languages, building better tokens for Indian
  languages and higher-quality datasets to make models cheaper to run. Named:
  **Vivek Raghavan** and **Pratyush Kumar**, co-founders of Sarvam AI. —
  [Rest of World](https://restofworld.org/2026/india-frugal-ai-sarvam-krutrim-sovereign/)
- **Krutrim**, launched April 2023 by **Bhavish Aggarwal** (co-founder of Ola
  Cabs), trained on over 2 trillion tokens across 22 Indian languages. —
  [Rest of World](https://restofworld.org/2026/india-frugal-ai-sarvam-krutrim-sovereign/)
- **India's AI Impact Summit**, New Delhi, framed by Mozilla's CTO as the
  moment nations choose between renting foreign models and co-investing in open
  foundations. — [Rest of World](https://restofworld.org/2026/india-ai-summit-open-source-sovereignty-mozilla-investment/),
  19 February 2026.
- ⚠ **What I could NOT source:** any figure for Indian adoption of open-weight
  models specifically, any rupee cost for Indian open-model deployment, and
  whether any Indian project appears in the Sovereign AI Index's 139. See §9.

### 4.10 The interpretation layer — three viewpoint clusters

- **accelerationist:** 179 Silicon Valley startups urged preserving access to
  Chinese open models; Nvidia, Microsoft, Google, Meta and OpenAI argue open
  models expand accessibility. — [Rest of World](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/)
- **safety-governance:** Anthropic advocates restrictions to protect US
  technological leadership; the arXiv preprint proposes "a tiered,
  safety-anchored approach to model release, where openness is determined by
  rigorous risk assessment and demonstrated safety rather than ideology or
  commercial pressure." — [Rest of World](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/) ·
  [arXiv 2602.19682](https://arxiv.org/abs/2602.19682)
- **labor-society:** AI Now argues openness alone does not redistribute power,
  because compute remains "prohibitively expensive and scarce". —
  [AI Now Institute](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai)
- **On security, the honest line:** Chinese models "contain censorship but no
  documented backdoors". — [Rest of World](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/)

### 4.11 Names the register may use (≤12 per issue — pick from these)

Each with the role phrase that introduces it. **Labs can live in graphic
labels rather than prose** — that is how the name budget survives this topic.

- **Nathan Lambert**, a researcher who writes the Interconnects newsletter on open models
- **Simon Willison**, a developer who has been testing and documenting every open-weight release as it lands
- **James Landay**, director of Stanford's institute for human-centred AI
- **Vivek Raghavan**, co-founder of Sarvam AI, which teaches Indian languages to open models
- **Bhavish Aggarwal**, the Ola Cabs co-founder who started the AI company Krutrim
- **Sam Altman**, who runs OpenAI
- **Mohammed Soliman**, a senior fellow at the Middle East Institute
- **Pablo Chavez**, who studies how governments pick AI systems at the Center for a New American Security
- **Raffi Krikorian**, Mozilla's chief technology officer
- **Epoch AI**, the research group that built the capability index this issue leans on
- **Moonshot**, the Chinese lab behind Kimi
- **Hugging Face**, the site where open model weights are actually downloaded

---

## 5. Key quotes

> "Since January 2026, the most capable open-weight models have lagged frontier
> closed models by an average of four months in the Epoch Capabilities Index."
> — Epoch AI, 29 May 2026, [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)

> "The average ECI gap was 8 points, similar to the gap between GPT-5 and GPT-5.5."
> — Epoch AI, 29 May 2026, [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)

> "As of March 2026, the top closed model leads the top open model by 3.3%, up
> from 0.5% in August 2024."
> — Stanford HAI, AI Index 2026, Technical Performance chapter, [Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance)

> "Following the introduction of the first reasoning models (OpenAI's o1-mini
> and o1-preview) in September 2024, the Epoch Capabilities Index (ECI)
> frontier has advanced linearly by 14 points per year."
> — Epoch AI, [Epoch AI](https://epoch.ai/data-insights/eci-frontier-trend)

> "frontier open-weight models are now real"
> — Nathan Lambert, author of Interconnects, 20 July 2026, [Interconnects](https://www.interconnects.ai/p/kimi-k3-the-open-weights-escalation)

> "Open-weight models are inherently decelerationist"
> — Nathan Lambert, author of Interconnects, 20 July 2026, [Interconnects](https://www.interconnects.ai/p/kimi-k3-the-open-weights-escalation)

> "Open weights are progress...But you still can't see how the thing was built,
> what it was trained on, or why it behaves the way it does. That's not an open
> model. That's open *distribution*."
> — James Landay, Denning Director, Stanford Institute for Human-Centered AI,
> 4 August 2026, [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society)

> "Open weights answer 'Can I run this?' Open source answers 'Can I trust this,
> improve it, and build the next thing on top of it?'"
> — James Landay, Denning Director, Stanford Institute for Human-Centered AI,
> 4 August 2026, [Stanford HAI](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society)

> "openwashing is a real risk"
> — Udbhav Tiwari, AI Now Institute, 15 October 2024, [AI Now Institute](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai)

> "open source is neither a silver-bullet solution to the challenges posed by
> concentrated market power in AI"
> — Udbhav Tiwari, AI Now Institute, 15 October 2024, [AI Now Institute](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai)

> "If governments finance dependency, dependency is what they will get."
> — Raffi Krikorian, Chief Technology Officer, Mozilla, 19 February 2026,
> [Rest of World](https://restofworld.org/2026/india-ai-summit-open-source-sovereignty-mozilla-investment/)

> "Closed models cannot fully accommodate the contextual nuances, languages,
> and customizations that different societies and cultures require."
> — Raffi Krikorian, Chief Technology Officer, Mozilla, 19 February 2026,
> [Rest of World](https://restofworld.org/2026/india-ai-summit-open-source-sovereignty-mozilla-investment/)

> "An open model like Kimi K3 does change government calculations investing in
> hardware."
> — Mohammed Soliman, Senior Fellow, Middle East Institute, 30 July 2026,
> [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/)

> "Governments choose base models like infrastructure—documentation, licensing,
> language, capability matter most."
> — Pablo Chavez, Adjunct Senior Fellow, Center for a New American Security,
> 30 July 2026, [Rest of World](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/)

> "i want the US to win in AI both in open source and proprietary models"
> — Sam Altman, CEO, OpenAI, reported 3 August 2026,
> [Rest of World](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/)

> "Whatever these releases are for, it is not licence revenue. The weights are
> given away on the most permissive terms available."
> — Hugging Face, State of Open Models: Summer 2026, 14 August 2026,
> [Hugging Face](https://huggingface.co/blog/state-of-open-models-summer-2026)

> "The same question, when asked in English, costs one-fifth of what it costs
> in an Indian language."
> — Rest of World, 7 April 2026, [Rest of World](https://restofworld.org/2026/india-frugal-ai-sarvam-krutrim-sovereign/)

**Attribution note (per the 2026-09-15 quote-attribution fallback):** the Sam
Altman line and the Soliman / Chavez lines are reported wording from Rest of
World, not matched to a primary transcript. **Attribute them to the outlet**
("as Rest of World reported"), not to a primary record.

---

## 6. Primary source documents

| Document | Publisher | URL | Notes |
|---|---|---|---|
| Open models lag state-of-the-art closed models by 4 months (Data Insight) | Epoch AI | https://epoch.ai/data-insights/open-closed-eci-gap | T1, open. **The primary anchor.** Carries the 4-month / 8-point finding, the per-model table and the understatement caveat. Full table not machine-reproducible via fetch — see §9. |
| Epoch Capabilities Index — methodology | Epoch AI | https://epoch.ai/eci | T1, open. 50+ benchmarks, logistic joint fit, calibration anchors (Claude 3.5 Sonnet = 130, GPT-5 = 150), stated limitations. |
| AI Models database (CC-BY 4.0) | Epoch AI | https://epoch.ai/data/ai-models · CSV: https://epoch.ai/data/all_ai_models.csv | T1, open, **CC-BY 4.0, downloadable** — licence question in the candidate notes is RESOLVED. 3,600+ models. |
| Model page — Kimi K3 | Epoch AI | https://epoch.ai/models/kimi-k3 | T1, open. ECI 158, rank 11/249, 2.8T params, 2.0e25 FLOP, $3/$15, per-benchmark scores. |
| Model page — GPT-6 Astra | Epoch AI | https://epoch.ai/models/gpt-6-astra | T1, open. ECI 166, rank 1/249, $10/$50, per-benchmark scores. |
| AI Index 2026, Chapter 2: Technical Performance | Stanford HAI | https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance · PDF: https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_2_technical.pdf | T1, open. The independent 3.3% / 0.5% Arena measurement and the Arena Elo tier list. |
| State of Open Models: Summer 2026 | Hugging Face | https://huggingface.co/blog/state-of-open-models-summer-2026 | T0/T1, open, industry-vendor. The download, derivative and licence census. Note it is the platform reporting on itself. |
| Beyond the Binary: A nuanced path for open-weight advanced AI (arXiv:2602.19682) | arXiv (cs.CY) | https://arxiv.org/abs/2602.19682 | T2, open, **CC BY 4.0**. Peer-track preprint; the governance/standards gap. |
| US Federal Reserve H.10 foreign exchange rates | Federal Reserve | https://www.federalreserve.gov/releases/h10/hist/dat00_in.htm | T0-class official data, but **off the tech allowlist** — used only for the ₹ conversion rate. See §9. |

---

## 7. Suggested issue structure

A suggestion the composer refines by data shape against all 101 kinds. **Four
DRAWN graphics, two of them never published** (`version-graph`, `arch-stack` —
both on the ledger in `docs/generated/PROJECT-GRAPH.md`). Three plain-language
cards, each used once. 8 sections; 4 of 8 drawn = **50% drawn**, clearing the
40% floor.

| # | kind | eyebrow | what it covers |
|---|---|---|---|
| 1 | `scaling-plot` | THE MEASUREMENT | **Hero.** x = release date, y = ECI; two families (open, closed) with a fit line each. The two lines run parallel about four months apart. Data: §4.6 table, 18 sourced tuples. Published kind. *(Already published — the two new kinds below carry the floor.)* |
| 2 | `you-think` | WHAT EVERYONE SAYS | You think open models are behind and catching up. Both instruments say they caught up to a few months and then the gap widened slightly: Epoch 3 → 4 months, Stanford 0.5% → 3.3%. Data: §4.1. |
| 3 | `version-graph` | **NEW KIND** · THE LINEAGE | Who actually ships open weights. Lanes per lab (DeepSeek, Moonshot, Zhipu, Alibaba) against a closed reference lane; the Kimi line climbing to K3. Data + parent edges: §4.6. |
| 4 | `benchmark-chart` | WHERE THE EIGHT POINTS LIVE | The counter-intuitive beat: 3 points apart on graduate science, 58 apart on multi-step puzzles. Four cleanly paired benchmarks. Data: §4.5. |
| 5 | `jargon-buster` | THE WORD DOING THE WORK | "Open weights" is not "open source", and the distinction is load-bearing. Plus ECI. Data: §4.2, §4.7; jargon rows appended to `research/_voice/jargon.md`. |
| 6 | `arch-stack` | **NEW KIND** · WHAT YOU CAN ACTUALLY DOWNLOAD | Five layers: weights / licence / code / training data / compute-and-serving. The top layer is free; the bottom one is not downloadable at any licence. Data: §4.7. |
| 7 | `number-sense` | THE BILL | ₹4,795 vs ₹1,439 vs ₹27 per million output tokens, and the Indian-language question that costs five times the English one. Data: §4.4, §4.9. |
| 8 | `prose` | WHO TOOK THE OFFER | The landing. 139 state projects, 56 countries, zero on the open frontier. 83% of downloads under 1B. The four months was never the expensive part. Data: §4.8. |

### Alternates, with data already captured

- **`elo-river`** *(never published)* — the candidate's first choice. **Possible
  but derived**: build 5–7 lab ribbons (OpenAI, Anthropic, Google, Moonshot,
  DeepSeek, Zhipu, Alibaba) on a shared date axis from the §4.6 tuples, using
  `null` for dates where a lab shipped nothing — the component renders nulls as
  a hollow span with a "dashed spans interpolated" chip, so this is honest. **Do
  not** build it as two ribbons (open vs closed): the catalog calls for 3–10
  teams. If the composer prefers it over `scaling-plot` at §1, the data is the
  same table.
- **`comparison`** — licence terms, Chinese vs American labs above 20B params:
  Apache 2.0 59% / MIT 22% / almost no non-commercial, against Apache-or-MIT
  29% / custom 41% / undeclared 30%. Data: §4.7 row 2. Use the `sides`+`rows`
  shape, or the `columns` list shape (both render since 2026-09-15).
- **Download inversion as a second `benchmark-chart`** — 83% under 1B vs 3%
  above 70B; Qwen 2,045M downloads vs Moonshot 37M. Data: §4.8.

### Kinds I considered and REJECTED on the evidence — do not let the drafter reach for these

- **`moore-ladder`** *(never published)* — the candidate suggested a doubling
  ladder. **The evidence does not support it.** The catalog requires a dated
  count series spanning **≥3 orders of magnitude** with ≥6 points. Open-model
  parameter counts run roughly 65B (Llama 1) to 2.8T (Kimi K3) — about 43×,
  which is 1.6 orders of magnitude. Drawing it would misuse a log₂ axis on a
  range that does not need one. **Use `scaling-plot` instead.**
- **`channel-ternary`** — the licence split looks like three shares of 100, but
  the catalog requires **4–12 entities** and I have two (Chinese labs, American
  labs). The build fails outside that range. **Use `comparison`.**
- **`neural-flow`** — requires real per-layer unit counts. Kimi K3's
  architecture is published as 2.8T parameters with mixture-of-experts routing,
  but **per-layer unit counts are not disclosed**. Cannot be sourced; do not
  invent layer sizes.
- **`scaling-plot` with price on the x-axis** — attractive (ECI against ₹ per
  million tokens) but **under-sourced**: I have price+ECI for only three models
  (GPT-5.4, Kimi K3, GPT-6 Astra). DeepSeek V4-Pro and V4-Flash have prices but
  **no ECI I could source**. Use release date on x instead, where I have 18
  points.

---

## 8. Source bibliography

**Spread: 19 sources · 9 publishers · tiers T0 · T1 · T2 · T3 · T4 · T7 (6 tiers) · top publisher 32% (Epoch AI, 6 of 19)**
*(floors, added 2026-09-16: ≥ 8 sources · ≥ 5 publishers · ≥ 3 tiers · no publisher above 40% — **all clear**)*

Viewpoint clusters on the interpretation layer: `primary` (Willison,
Interconnects) · `safety-governance` (Stanford HAI research, arXiv) ·
`labor-society` (AI Now, Rest of World) · `accelerationist` (the 179 startups /
Altman position, reported in Rest of World) · `industry-vendor` (Hugging Face)
= **5 clusters**, against the gate's minimum of 2. The candidate's flagged
"narrow spread" gap is closed.

**Epoch AI (6 of 19 — 32%)**
- [Open models lag state-of-the-art closed models by 4 months](https://epoch.ai/data-insights/open-closed-eci-gap) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [Epoch Capabilities Index — methodology](https://epoch.ai/eci) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [The ECI frontier has advanced by 14 points per year since the introduction of reasoning models](https://epoch.ai/data-insights/eci-frontier-trend) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [Chinese AI models have lagged the US frontier by 7 months on average since 2023](https://epoch.ai/data-insights/us-vs-china-eci) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [Model page — Kimi K3](https://epoch.ai/models/kimi-k3) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [Model page — GPT-6 Astra](https://epoch.ai/models/gpt-6-astra) — Epoch AI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`

**Stanford HAI (2)**
- [AI Index 2026, Chapter 2: Technical Performance](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance) — Stanford HAI, accessed 2026-09-17 — `tier: T1` · `viewpoint: n/a` · `kind: primary`
- [Open-Weight Models Aren't Enough. We Need Truly Open-Source AI Models for Science and Society](https://hai.stanford.edu/news/open-weight-models-arent-enough-we-need-truly-open-source-ai-models-for-science-and-society) — Stanford HAI, 2026-08-04 — `tier: T3` · `viewpoint: safety-governance` · `kind: analysis`

**Rest of World (4 — 21%)**
- [China's free Kimi K3 AI model shakes up global tech market](https://restofworld.org/2026/china-moonshot-kimi-k3-free-sovereign-ai/) — Rest of World, 2026-07-30, Indranil Ghosh — `tier: T4` · `viewpoint: labor-society` · `kind: secondary`
- [Why U.S. tech and Washington are divided over Chinese AI models](https://restofworld.org/2026/silicon-valley-debate-chinese-open-weight-ai-models/) — Rest of World, 2026-08-03, Viola Zhou — `tier: T4` · `viewpoint: labor-society` (reports the `accelerationist` case) · `kind: secondary`
- [India's frugal AI startups Sarvam and Krutrim build sovereign models](https://restofworld.org/2026/india-frugal-ai-sarvam-krutrim-sovereign/) — Rest of World, 2026-04-07, Jaideep Prabhu / Priyank Narayan / Mukesh Sud — `tier: T4` · `viewpoint: labor-society` · `kind: secondary`
- [India's AI sovereignty: Why open source is the new infrastructure](https://restofworld.org/2026/india-ai-summit-open-source-sovereignty-mozilla-investment/) — Rest of World, 2026-02-19, Raffi Krikorian — `tier: T4` · `viewpoint: labor-society` · `kind: analysis`

**Simon Willison (2)**
- [Kimi K3, and what we can still learn from the pelican benchmark](https://simonwillison.net/2026/Jul/16/kimi-k3/) — Simon Willison's Weblog, 2026-07-16 — `tier: T7` · `viewpoint: primary` · `kind: analysis`
- [DeepSeek V4 — almost on the frontier, a fraction of the price](https://simonwillison.net/2026/Apr/24/deepseek-v4/) — Simon Willison's Weblog, 2026-04-24 — `tier: T7` · `viewpoint: primary` · `kind: analysis`

**Hugging Face (1)**
- [State of Open Models: Summer 2026 Observations](https://huggingface.co/blog/state-of-open-models-summer-2026) — Hugging Face, 2026-08-14, Adina Yakefu / Apolinário / Irene Solaiman — `tier: T0` · `viewpoint: industry-vendor` · `kind: primary`

**Interconnects (1)**
- [Kimi K3: the open-weights escalation](https://www.interconnects.ai/p/kimi-k3-the-open-weights-escalation) — Interconnects, 2026-07-20, Nathan Lambert — `tier: T7` · `viewpoint: primary` · `kind: analysis`

**AI Now Institute (1)**
- [IX. The Openness Imperative: Charting a Path for Public AI](https://ainowinstitute.org/publications/ix-the-openness-imperative-charting-a-path-for-public-ai) — AI Now Institute, 2024-10-15, Udbhav Tiwari — `tier: T3` · `viewpoint: labor-society` · `kind: analysis`

**arXiv (1)**
- [Beyond the Binary: A nuanced path for open-weight advanced AI (arXiv:2602.19682)](https://arxiv.org/abs/2602.19682) — arXiv cs.CY, 2026-02-23, Özcan / Petropoulos / Reddel — `tier: T2` · `viewpoint: safety-governance` · `kind: primary`

**Federal Reserve (1) — off-allowlist, rate lookup only**
- [H.10 Foreign Exchange Rates](https://www.federalreserve.gov/releases/h10/hist/dat00_in.htm) — US Federal Reserve, release 2026-09-08 — `tier: T0` · `viewpoint: n/a` · `kind: primary` — **⚠ not on the tech allowlist; see §9**

**Consulted, not cited** (context only, no claim rests on them):
[Epoch — Open-Weight Models topic hub](https://epoch.ai/topics/open-models) ·
[Epoch — AI capabilities progress has sped up](https://epoch.ai/data-insights/ai-capabilities-progress-has-sped-up) ·
[Epoch — AI Models database](https://epoch.ai/data/ai-models) ·
[Hugging Face — One Year Since the "DeepSeek Moment"](https://huggingface.co/blog/huggingface/one-year-since-the-deepseek-moment)

---

## 9. Researcher notes

### Blocking nothing, but the editor should know

**1. The "four months" and the "8 points" do not derive from each other. Do not
let the drafter convert one into the other.** Epoch reports both as averages
over the Jan–May 2026 window, measured differently: four months is a horizontal
(time) match, 8 points a vertical (capability) match. Epoch's own frontier
trend is **14 ECI points/year** ([frontier-trend](https://epoch.ai/data-insights/eci-frontier-trend)),
and 8 ÷ 14 = **6.9 months**, not four. The two reconcile only if the frontier
moved at roughly 24 points/year during that window. The live 2026 pace implied
by GPT-5.5 Pro (159.35, 23 Apr) → GPT-6 Astra (166, 3 Sep) is about **18
points/year**, which still gives ~5.3 months for 8 points. **Present the two
figures as Epoch presents them — side by side, each as its own measurement —
and never write "8 points, which is four months".** This is the single most
likely place for the issue to manufacture a false precision.

**2. Epoch's understatement caveat is not optional garnish.** Epoch states the
gap "may tend to understate the true gap" because open-weight models "more
aggressively hillclimb on public benchmarks", and the ECI methodology page
repeats that open models "optimize on benchmarks more aggressively". An issue
whose thesis is "the gap is small" **must** carry this. It is the strongest
argument against the issue's own claim and the drawing rule applies: weaken
your own case rather than flatter it.

**3. ECI is Epoch's composite, not a neutral standard.** Attribute it every
time ("Epoch AI's capability index"), never as "the" capability score. The
Stanford Arena figure is the independent check and it is a *different kind of
measurement* (human preference, not benchmarks) — say so rather than blending
them into one number.

**4. A conflicting ECI figure for DeepSeek-V3.2.** The open/closed gap page
gives **146.46**; the US-vs-China page gives **144.60** for the same model and
release date (2025-12-01). Likely different snapshot dates as more benchmarks
were added. **I used 146.46** (the more recent page). Flagged so the verifier
does not read it as an error.

**5. The full Epoch table could not be reproduced.** WebFetch declined to
reproduce the several-hundred-row model table on copyright grounds; I obtained
a bounded subset (top 5 open, top 5 closed) plus individual model pages. The
per-model tuples in §4.6 are reliable, but **the ordering returned was
internally inconsistent** (Kimi K2.6 at 151.60 was listed below GLM-5.1 at
149.94 in a list labelled "by ECI score"). **Treat the tuples as sourced and
the rank ordering as not.** The CSV at `https://epoch.ai/data/all_ai_models.csv`
is CC-BY and downloadable if the drafter wants to re-derive the series cleanly.

**6. Kimi K3 has three dates in circulation, and they are all correct.** Epoch
lists **2026-07-16** (announcement / API). Willison, writing the same day, notes
the weights were only "promised by 27th July 2026". Rest of World reports the
actual open-weight release on **2026-07-27**. **Say "announced 16 July, weights
released 27 July"** rather than picking one. The ECI is measured against the
16 July release.

**7. Kimi K3's ranking depends on which index you use, and on the date.** Epoch
ranks it **11th of 249** on ECI. Rest of World (30 July) reported it **third
globally**, on the Artificial Analysis intelligence index, before GPT-6 Astra
existed. Both are accurate for their index and date. **Do not write "third" or
"eleventh" without naming the index and the date.**

**8. `[UNVERIFIED]` items:**
- **[UNVERIFIED] Kimi K3's weight file size — "1.56TB on Hugging Face".** This
  came from a search snippet attributed to Simon Willison; the fetched post did
  not carry it and I could not confirm it on the Hugging Face model page. It is
  a *lovely* concrete number for the arch-stack bottom layer ("the file you
  cannot usefully hold"). **Either confirm it on the Hugging Face repo page or
  use the confirmed DeepSeek V4-Pro figure instead — 865GB, which Willison's
  post does carry.** Do not print 1.56TB unconfirmed.
- **[UNVERIFIED] Kimi K3's licence.** Neither Willison nor Rest of World stated
  it. Hugging Face's census notes that "in the last few weeks…Kimi K3 and Qwen
  3.8 2.4T" are "starting to include some non-commercial restrictions and
  revenue share requirements" — which **cuts against the issue's own argument**
  and should be included if confirmed. DeepSeek V4's **MIT** licence IS
  confirmed (Willison). If K3's licence cannot be confirmed, build the licence
  layer on DeepSeek, not Kimi.
- **[UNVERIFIED] Qwen 3.8 Max (2.4T) release date and ECI.** Named by both
  Hugging Face and Stanford HAI; no date or score found. Left out of §4.6.
- **[UNVERIFIED] the local-hardware figure.** A search snippet reports Kimi
  K2.5 running on a 128GB M4 Max at ~1.7 tokens/second, attributed to one
  Daniel Isaac via Willison. **Not confirmed on any fetched page.** It would be
  a superb honest counterweight (yes you can run it; no, not at desk scale) but
  it must be confirmed before use.
- **[UNVERIFIED] the ₹ rate's provenance.** ₹95.9/$1 for mid-September 2026 is
  consistent across sources, but I could not fetch the Federal Reserve H.10
  table directly to pin the exact daily figure, and **federalreserve.gov is not
  on the tech allowlist**. Two options for the editor: confirm against the RBI
  reference rate, or (cleaner) **add `rbi.org.in` to the tech allowlist** — this
  desk will hit the currency rule on every issue that prices anything, so the
  allowlist gap will recur.

**9. An Indian adoption figure does not exist in these sources, and the issue
must not invent one.** I found the tokeniser-tax line, Sarvam, Krutrim and the
Delhi summit — real Indian ground, all sourced (§4.9). What I could **not**
find is any number for Indian uptake of open-weight models, any rupee cost for
an Indian open-model deployment, or whether an Indian project sits among the
Sovereign AI Index's 139. **Per REGISTER-PLAN, the composer should carry the
Indian ground through the tokeniser tax and the ₹-per-million comparison —
which are sourced — and use a scale comparison rather than a new claim
anywhere else.**

**10. The AI Now source is from October 2024 and reads older than the rest.**
Its argument (openwashing, compute concentration) has aged well and it is the
cleanest `labor-society` anchor on the allowlist, but **date it in the prose**
rather than letting it sit beside 2026 material undated. Its author, Udbhav
Tiwari, is a policy lead associated with Mozilla — note the affiliation if he
is named alongside the separate Mozilla/Krikorian source, so the issue does not
present them as two independent voices.

**11. Follow-on, not retelling.** The candidate correctly flags this as the
inverse of the published `2026-06-04-ai-coding-token-bill` issue. **The drafter
should read that issue before writing** and make the relationship explicit
once. The tokeniser-tax fact (§4.9) is the hinge between them: that issue
counted what the meter costs; this one prices the option to unplug it.

**12. No paywalls hit.** Every source cited is open-access. The Hugging Face
post is the platform reporting on its own download numbers — **attribute it as
such** ("Hugging Face's own census"), since there is no independent check on
Hub download figures.

**13. Jargon rows appended** to `research/_voice/jargon.md` for: open weights,
open source (AI), ECI, MoE / mixture of experts, tokeniser, GGUF, quantised,
Arena Elo, sovereign AI. Glosses are the plainest the sources support.
