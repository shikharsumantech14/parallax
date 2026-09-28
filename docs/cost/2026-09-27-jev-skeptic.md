# Jev (TypeSafe AI): the skeptic's file

As of 2026-09-27, twelve days after launch. This is the independent view, written against TypeSafe's own materials. Every finding carries a source and a confidence tag.

**Confidence legend**

- **HIGH**: a primary document (TypeSafe docs, contract, status page, gateway docs) or an independent test with a published method and data (arXiv paper, reproducible repo, first-hand production test).
- **MEDIUM**: a first-hand test with a thinner method, a careful secondary write-up, a news report quoting a named person, or an HN comment used as opinion.
- **LOW**: SEO "guide" sites, numbers I could not trace to a primary, or social posts seen only as search-index snippets.

**Limits of this review.** Reddit could not be fetched (the crawler is blocked there), so Reddit reactions appear only as reported by others. X/Twitter pages returned HTTP 402, so X quotes come from search-index titles of the posts. Every.to returned no article body.

---

## Bottom line

1. **A solo developer in India can use Jev this month, but not through TypeSafe's own signup.** Direct signups have been paused since 22 September. OpenRouter, Cloudflare Workers AI, Vercel AI Gateway, Requesty and DigitalOcean all serve jev-1.13 at $0.042 per million input tokens with no TypeSafe account. Every route ends at a US endpoint. (HIGH)
2. **"Cannot hallucinate" means "cannot return a value outside your schema".** TypeSafe's blog admits the 0% figure "is not empirical", and TypeSafe's own contract says the service "MAY PRODUCE INACCURATE OR ERRONEOUS OUTPUT". Independent tests found wrong answers carrying 0.74 to 1.00 probability. (HIGH)
3. **Calibration is real but conditional.** On familiar English yes/no and few-option questions, independent ECE runs roughly 0.01 to 0.08. It breaks on Score questions (ECE 0.25 to 0.33), on unanswerable questions (a hidden fair die guessed at 82.9% confidence, right 19% of the time), when there is no "none" option, in some non-English inference (Russian ECE tripled), and when option names carry meaning. (HIGH)
4. **The 193.6x / 444.6x headline compares Jev with two different models** on TypeSafe's own four workflows, scored against the averaged answers of two LLMs, not human labels. Against the model it actually ties on accuracy (GPT-5.6 Terra), the gap is about 25x faster and 76x cheaper. Independent multiples run from 0.5x (slower than a local Gemma) to a few hundred times cheaper. (MEDIUM to HIGH)
5. **It is not an agent's reasoning step.** On an independent sealed set of hard decisions, Jev scored 36.7% against 95.5% for a reasoning LLM that cost only 3.39x as much per decision. On real Hindi and Hinglish phone calls it moved a conversation forward only about half the times it should have. (HIGH)
6. **Dependency risk is high.** No SLA, "AS IS", liability capped at the greater of 12 months' fees or $50, rate limits that "can change without notice", two breaking SDK changes in the first week, a signup freeze, and a contract clause that forbids using its outputs to train a replacement. (HIGH)
7. **"OpenJev" is not one project.** Of the two repos in the brief, one wraps a 4B model and publishes no Jev comparison. The other is a fork of a server for a 27B model under a non-commercial licence, whose own card shows 84.0% against Jev's 85.4% on a comparison it calls "not a controlled one". (HIGH)

---

## 1. Access

### 1.1 Timeline

| Date (2026) | What happened | Source | Conf |
|---|---|---|---|
| Sep 15 | Launch. TypeSafe: "opening early access and bringing developers off the waitlist as quickly as we can" | TypeSafe blog | HIGH |
| Sep 16 | Jev live on Vercel AI Gateway and OpenRouter (OpenRouter: "now on OpenRouter, in beta") | Vercel changelog; OpenRouter X post via search index | HIGH / MEDIUM |
| Sep 17 | CEO Diogo Almeida (@completeskeptic) on X: "we've jev-ed 140k off the waitlist" | HuggingNews relaying the post | LOW to MEDIUM |
| Sep 18 | TechCrunch: "the company briefly lost the ability to serve users from its API because demand was so high" | TechCrunch | MEDIUM |
| Sep 20 | Waitlist removed. TypeSafe on X: "Jev is now available to everyone. No waitlist." New accounts got $5 credit (about 120M tokens) | X via search index; Flavio Copes; cryptobriefing | MEDIUM |
| Sep 22 | Signups paused. TypeSafe on X: "We have seen such an immense swell of demand that we have to temporarily pause signups for Jev. We need to ensure quality of service for our existing signups, which will continue to function." Almeida: "oops, we're full! our service is absolutely overflowing right now so we'll have to suspend new signups" | X via search index, quoted by aifront-page and aiextracash | MEDIUM |
| Sep 24 to 25 | Still paused. Flavio Copes (updated Sep 24): existing accounts work, new signups paused. jevaiguide (Sep 25): "No reopening announcement found" | flaviocopes.com, jevaiguide | MEDIUM / LOW |
| Sep 27 | Status page reads "All services are online". Whether signups have reopened: **NOT FOUND** | status.typesafe.ai | HIGH (status only) |

A secondary summary says Almeida wrote on Sep 23 that people had been "abusing signups to get around rate limits". I could not find the primary post. (LOW)

### 1.2 Who got in, and how fast

- **The waitlist was a queue with a fast lane.** An X user (Kai): "I got my invite in about half a day", after clicking "Answer a few questions" under "Want in sooner?" (MEDIUM, search index). A TypeSafe team member on HN (zenlikethat): "join the waitlist! We offer faster access in exchange for good memes" (MEDIUM).
- **Individuals were admitted, not only companies.** HN user porridgeraisin: "I got accepted from the waitlist and it's really neat." Simon Willison and Flavio Copes both had console access. (HIGH)
- **Admission criteria were never published.** Apidog (Sep 21): TypeSafe "published no wait time, no queue position, and no target date". (MEDIUM)
- **India.** Two Indian companies published tests. Juspay's draft PR (Sep 19) calls TypeSafe's API directly with `TYPESAFE_API_KEY`. Bolna (Sep 25) tested on real calls and says "We have no commercial relationship with TypeSafe", without naming its access route. (HIGH) The contract has no India exclusion, only US export and embargo clauses (MCA 16.12). (HIGH) A report from an India-based individual, and the payment methods accepted on console.typesafe.ai: **NOT FOUND**.

### 1.3 Routes that work today without a TypeSafe account

| Host | Model ID | Price | Context | Their fees and limits | Data | Conf |
|---|---|---|---|---|---|---|
| **OpenRouter** | `typesafe/jev-1.13`, `~typesafe/jev-latest` | $0.042/M input, $0 output | 32,000 | OpenRouter key only ("Just create an OpenRouter API key"). Jev is a paid model, so you buy credits: "5.5% ($0.80 minimum)" by card or AliPay, "5%" in USDC. A $5 card top-up pays the $0.80 floor, which is 16%. Credits may expire a year after purchase. Decisions endpoint sits at `/api/alpha/decisions`. Jev-specific rate limits: NOT FOUND | Jev data policy: NOT FOUND | HIGH |
| **Cloudflare Workers AI** | `typesafe/jev` | $0.042/M input, "$0.00 for output and cached input" | 32,000 | Cloudflare account ID plus API token, called at `/ai/run`. A GitHub issue calls it "access without a TypeSafe invite" with a "byte-identical" schema. Whether the free 10,000 Neurons a day cover this third-party model: NOT FOUND. Rate limits: NOT FOUND | Labelled "Third-party" and "Zero data retention" | HIGH |
| **Vercel AI Gateway** | `typesafe-ai/jev` | $0.042/M input, $0 output. Free until Sep 25 (ended) | 32,000 | "no markup and no platform fee", but "You're responsible for any payment processing fees". Accepts TypeSafe SDK clients since Sep 21. Free tier: $5 a month, "a subset of models", per-model rate limits returning 429. Whether Jev is in the free subset: one unofficial guide says yes (LOW), and reports a 131-question batch taking about 90 minutes on the free tier against 81 seconds on TypeSafe's paid API (LOW) | Providers listed: typesafe-ai and digitalocean. Zero data retention per request on Pro and Enterprise | HIGH (docs) / LOW (free-tier detail) |
| **Requesty** | `typesafe/jev-1.13.0`, `typesafe/jev-latest` | $0.042/M input, output free | NOT FOUND | "You pay for what your application spends, plus 5%." Its Decisions integration is "experimental and may change without a deprecation period" | EU residency option (not India) | HIGH |
| **DigitalOcean Serverless Inference** | not stated | "$42 per billion input tokens with output tokens free" | NOT FOUND | NOT FOUND | One guide says DigitalOcean's endpoint lacks zero data retention (LOW) | MEDIUM |
| **Lovable AI Gateway** | not stated | Free "through 27 September 23:59 UTC", which ends today | NOT FOUND | NOT FOUND | NOT FOUND | MEDIUM (via Requesty) |

Footnote: OpenRouter also lists `typesafe/jev-router` with a 1,000,000-token context. That is a chat-completions router "powered by Jev" that picks an LLM for each request. The 1M figure is the routed chat request, not a Jev decision state. (MEDIUM)

**Clone and reseller warning.** Eye Security counted about 670 new domains containing "jev" that received TLS certificates between Sep 15 and Sep 22, with resellers "charging customers up to 11.5x the official price". Named examples: jev-ai.pro, jevtypesafeai.com, jev-agent.org, jevapi.pro, jevmodel.org. Several "guide" sites in search results sit on this pattern. Use console.typesafe.ai or the gateways in the table. (HIGH for the count and examples)

### 1.4 Verdict for a solo developer in India, September 2026

- **Yes, through a gateway, today.** No through TypeSafe direct unless the account was created before Sep 22. (HIGH)
- **Every route ends in the US.** TypeSafe's privacy policy: "The Services are hosted in the United States". Juspay measured "Warm round trip from India is about 380 ms to a US-West endpoint", which eats most of the 70 to 500 ms TypeSafe advertises. An India region: NOT FOUND. (HIGH)
- **English first.** Read section 3.5 before sending Hindi or Hinglish.

---

## 2. Calibration in practice

### 2.1 What TypeSafe actually promises

- **No published ECE or Brier score from TypeSafe.** Layer3Labs: "Calibration is a training objective. It is not an operational guarantee." (MEDIUM) The AWS-builders aggregate: "RLCD has no paper, patent or method description." (MEDIUM)
- **Its docs hedge it.** "Calibration is measured across groups of predictions; it does not guarantee that an individual answer is correct." And: "The correct threshold values depend on your domain and the performance of the model for your use case." (HIGH)
- **"Confidence" is a formula, not a second signal.** The docs call it "a statistic computed from the probability distribution". Primeline gives the Choice formula as `C = (N * p_max - 1) / (N - 1)`. (HIGH / MEDIUM)
- **Probabilities drift.** OpenRouter's own explainer says they "vary somewhat from call to call". (HIGH)

### 2.2 Where it holds (independent tests)

| Test | Data | Result | Conf |
|---|---|---|---|
| Primeline, pre-registered (Sep 18) | 2,600 pooled items from 4 public human-labelled sets | Yes/no ECE 0.012, pick-one 0.086. At 0.9+ confidence, 92% accuracy on 73% of items | MEDIUM |
| AHTOOOXA audit (Sep 21) | XNLI and MASSIVE, parallel human-labelled | English XNLI ECE 0.032, MASSIVE 0.066 | HIGH |
| willkelly, pre-registered | 123,805 requests, $12.69 | Support routing ECE 0.075, AUROC 0.878 | HIGH |
| CMU, Li et al., arXiv 2609.26550 | RewardBench, JudgeBench, HaluEval, 1,312 judgments | At q ≥ 0.9: 95.8% accuracy on 54% of items. Error-detection AUROC 0.869, 0.745, 0.863 | HIGH |
| Ibrahim and Zaki, arXiv 2609.24574 | 7,977 human labels, 18 tasks | Better calibrated than 16 of 19 LLMs, but three frontier models did better (median error 0.066 against Jev's 0.157) | HIGH |
| Lightfield (Sep 20) | Craigslist deal detection, 500 items | ECE 0.015 against Sonnet's 0.034 | MEDIUM |
| Lindfors (Norwegian, 24 documents) | Hearing responses | 0.9 to 1.0 band was 98% accurate | MEDIUM (small n) |

Primeline's summary is the fairest one-liner on the upside: "you can get the same answer out of any LLM. You cannot get the same number." (MEDIUM)

### 2.3 Where it breaks: confidently wrong, with numbers

- **Unanswerable questions.** KantaHayashiAI hid a fair die roll: Choice "put 82.9% on its pick at 19% accuracy" (76 of 400). Noul on the same die stayed near one in six (19.2%). Forecast documents stating 45% came back at 6.6%, and 55% came back at 95.9%. (HIGH)
- **A rule that is not in the text.** Scienthoon (Sep 19, via Vercel): a Score question on ticket priority depended on a policy absent from the ticket. Jev was right 44.7% of the time while "the chosen level carries 0.74 probability on average". Score ECE 0.325. Overall ECE 0.107, "4.4×" the 0.024 noise floor. (HIGH)
- **No "none" option.** Priorbench: "0 of 30 out-of-scope messages were flagged — at 0.99 confidence". It classified a cake recipe and random letters as technical issues at 0.94 to 0.97. Jujumilk3, on KoBBQ with the "unknown" option removed: "Accuracy 0.950 → 0.000 on unanswerable items, stereotype rate 0.03 → 0.79, at 0.79 confidence". Zyte: "in a larger run it labeled a category listing page poetry at a confidence of 1.00", with no poetry option offered. (HIGH / MEDIUM)
- **Choice and Score run hot.** Anthus (8,801 sentiment items): Choice stated 91.4% against 76.1% actual, Noul 79.0% against 72.3%. Primeline: rating scales ECE 0.254 against 0.012 for yes/no. TypeSafe itself: "`jev-1.13`'s score levels are weak in numerical calibration." (HIGH)
- **Outside its training shape it has no signal.** Willkelly: on random 3-SAT the model "answered 'satisfiable' for every formula", and on `x AND NOT x` gave P(satisfiable) = 0.38. His line: "Calibration holds where the model was built to work and fails completely outside it." (HIGH)
- **Hard judging.** CMU: RM-Bench adversarial pairs 74.8% against GPT-6's 94.6%; JudgeBench 78.6% against 93.1%. Ibrahim and Zaki: on empathy detection the model showed high confidence at near-chance accuracy. (HIGH)
- **Beaten on calibration by a small LLM.** Anisselbd phishing bench: Jev ECE 0.154, Claude Haiku 4.5 ECE 0.097. (HIGH)
- **Non-English.** Russian XNLI ECE rose from 0.032 to 0.096, and answers at confidence ≥ 0.9 were 88.7% right in Russian against 97.2% in English. (HIGH)

### 2.4 Probabilities that do not add up

- **TypeSafe's own example.** Its jaggedness page shows refund = 0.72 and not_refund = 0.47 on the same ticket, a sum of 1.19. (HIGH)
- **Complements.** Jujumilk3: P(x) + P(not x) ranged from 0.71 to 1.42 across 400 items, and the same judgment asked as a Noul and as a two-option Choice differed by 0.125 on average. (MEDIUM)
- **Option names override rubrics.** Sun et al. (NUS, Fudan, USTC; arXiv 2609.26758, "Type-Safe Is Not Error-Free"): with identical rubrics, renaming two options from 0/1 to no/yes "flips 32.5% of the decisions, 30.4 pp more than 0/1". "balanced accuracy falls from 71.3% to 51.6%, and AUC from 81.5% to 58.1%". Test-retest noise was "At most 1.33%". (HIGH)
- **Rounding.** "The API also rounds every probability to 0.01. In one committed sample, 70.4% of `choice` probabilities came back as exactly 0" (AWS-builders aggregate, MEDIUM). Jev-wide: "95.8% of the field comes back at exactly 0.00" on a 200-candidate rerank (MEDIUM). Official SDK issue #15 (Sep 25): `choice` "is sometimes 0.01 below the highest probability", across 35 production responses, with the hypothesis that probabilities are rounded and renormalised after the winner is chosen (HIGH that the issue is open and reproduced by its author).

### 2.5 Nondeterminism

- Zyte: "six of eight Nouls came back with a standard deviation of exactly zero across five repeats while two carried noise". The author notes TypeSafe's own cookbooks measured the same. (HIGH)
- Jev-wide: "an identical repeated call changes 7.3% of the top-10". (MEDIUM)
- CMU: 11.14% of JudgeBench decisions change when the pair order is reversed. (HIGH)
- Counterpoint from a partner: LangChain measured very low per-case variance across 5 agent runs scored 100 times each. (MEDIUM, interested party)

### 2.6 What the evidence says to do

- **Recalibrate on your own labels.** Anthus: isotonic regression took Noul ECE from 0.117 to 0.008, and "A few hundred is enough to get most of the benefit". The AWS-builders aggregate: "Fit a temperature on 50 to a few hundred of your own labels". Alex Molas: treat the outputs "as good scores (they rank examples well) rather than good probabilities." (MEDIUM)
- **Always offer "none of these"**, use neutral option names (Sun et al.), never reuse thresholds across question types (TypeSafe docs, Primeline), and pin the version. TypeSafe: "If you have tuned confidence thresholds against a specific version, pin that version's ID instead of the alias." (HIGH)

---

## 3. Where it fails

### 3.1 TypeSafe's own out-of-scope list (HIGH)

- Jaggedness page, opening line: "`jev-1.13` is fast, calibrated, and good at common-sense judgment but it is not perfect." It then lists twelve failure modes: literal reading of scoping words and negations; "Jev is not a calculator."; "`jev-1.13` does not count reliably."; raw numeric values such as RGB or hex; score interpolation; "`jev-1.13` reads dates as text, not as ordered quantities."; double negatives and multi-hop indirection; irrelevant detail ("Accuracy falls as the state grows with content unrelated to the decision."); adversarial content ("State is data, and `jev-1.13` does not treat it as hostile by default."); contradictory instructions; structural invariants (the refund example); and generation.
- Models page: "Text only. String, JSON object, or array of text values. No image, audio, or video input." "English is the primary training language and where accuracy is currently best." Context is "64k tokens per request", with "32k tokens for `state` plus the longest question".
- System One page: models "do not write replies, produce code, or generate explanations of their reasoning."
- Blog: Choice supports "a cardinality up to 255", and the demo is "not on images (yet…)".

### 3.2 Long inputs: 10k, 50k, 100k tokens of state

- **50k and 100k: impossible in one call.** The state cap is 32k (TypeSafe), and OpenRouter, Cloudflare and Vercel all list a 32,000 context. You must chunk in your own code. What the API returns when you exceed the cap: **NOT FOUND**. (HIGH)
- **The public evidence barely touches long states.** JevBench issue #49 (Sep 23): public states have "median ≈ 30 tokens, 90th percentile ≈ 2 500, maximum ≈ 3 700. No task above 4 000 tokens." (MEDIUM)
- **About 20k tokens: one small test.** Lightfield: one roughly 20k-token article with 40 hand-written questions, Jev 90.0% against Opus 5's 92.5%. (MEDIUM, small n)
- **Longer real inputs score lower.** Primeline: accuracy "fell from 97.0% on the shortest quarter of entries to 81.1% on the longest quarter" on production data (lengths not given). (MEDIUM)
- **Packing many items into one state breaks it.** Ebrain.lab (Threads): 40 Korean sentences scored "40/40 correct" sent one per call and "62% correct" as one document. Yodablocks: 40 rows per request against 1 row per request, Spearman 0.579 against 0.932, "77 decisions flipped", rows in slots 24 to 39 shifted about 0.42 on average, "despite tokens remaining well under the documented 32k limit". (MEDIUM)
- **Chunking costs accuracy too.** Jev-wide: "Naive chunk-merging throws away 83% of reranking's value". (MEDIUM)
- **So:** 10k tokens works only if nearly all of it bears on the decision (TypeSafe's own distractor warning). 50k and 100k mean a retrieval or chunking layer that you build and calibrate.

### 3.3 Multi-document comparison

- A dedicated independent benchmark: **NOT FOUND**.
- The nearest evidence: the batching and position effects above (one item per call beats many per call), and CMU's pairwise judging, where order reversal flipped 11.14% of JudgeBench decisions and style swayed it: "JEV scores 84.0% when answers share style but 74.8% when rejected answer is more elaborate". (HIGH for CMU)

### 3.4 Numbers and dates

- RINNECODER (Sep 16 to 17, 432 calls): arithmetic 88.0% (95 of 108) when the right answer is listed first, 57.4% (62 of 108) when last. Letter counting 117 of 216. Its conclusion: "choice order is an evaluation variable, not harmless formatting". (MEDIUM)
- Etsabary (1,000 decisions): sequential procedure execution 13.2%, exact counting 33.3%, static relational reasoning 97 to 100%. (MEDIUM)
- Counterpoint on order: jujumilk3 found no option-order bias on ordinary judgments (mean shift 0.005, zero flips in 400 trials). Position bias shows up on arithmetic, not everywhere. (MEDIUM)

### 3.5 Non-English, including Hindi and Hinglish

- **TypeSafe says English is best** and advises testing non-English workloads before deployment. (HIGH)
- **Real Hindi and Hinglish data, Bolna (Sep 25).** Its voice agents talk "mostly in Hindi and Hinglish". (HIGH)
  - Routing, 600 decisions: 72.7% agreement with the production router (gpt-4.1-mini), "eighth of ten models". "When the call should move on, Jev moves only about half the time. When it should stay, it almost always does. On a live call, that is an agent that will not advance, and the caller ends up repeating themselves."
  - Call judge, 196 human-labelled calls: Cohen's kappa 0.416, "statistically level" with Qwen3-32B (0.471) and Gemma 4 31B (0.435), and above the OpenAI models tried (0.240 to 0.304).
  - Field extraction, 775 transcripts: "in the tied group at the top, with both Geminis and Claude Sonnet".
  - No Hindi-against-English split and no calibration numbers.
- **Synthetic Indic data, Juspay (Sep 19, draft PR, 12 languages including Hindi, Hinglish, Tamil, Tanglish).** Clean text was perfect (86 of 86 reply classifications and more). Noisy text scored 31 of 37, where "every miss is a two-to-three-word romanised Kannada, Malayalam, Bengali, Gujarati or Marathi affirmative at low confidence". "a 0.9 confidence floor gives zero errors at 24/37 coverage". And: "Language id needs every option described or Bengali and Gujarati script are called Hindi". No per-language counts. (MEDIUM: synthetic and small)
- **Other languages.** Russian XNLI down 11.0 points (95% CI −14.2 to −7.8), MASSIVE no significant drop (AHTOOOXA, HIGH). Korean down 6.5 points with stable ECE (jujumilk3, MEDIUM). Korean medical exam 80 against GPT Luna's 88 (mahlernim, MEDIUM). Spanish 3 to 6 points lost with calibration error "roughly doubled" (marcosmartinez, seen only via a curated list, LOW).
- **A Hindi-specific accuracy or calibration number for hosted Jev: NOT FOUND.** OpenJev's model card has a mixed German, French, Hindi and Chinese XNLI row (240 items) but no hosted-Jev score on it.

### 3.6 Domain jargon and specialist judgment

- Ibrahim and Zaki: across 18 social-science annotation tasks, Jev "underperformed the best LLM on 14 of 15 tasks, with a median deficit of 11.6 macro-F1 points". (HIGH)
- TypeSafe's own dashboard: invoice processing 61.8% against 79.1% for the best comparator. (MEDIUM, reported by several secondary sources)
- Primeline: on long knowledge-base entries, 62% of mistakes came from "conflating preference notes with technical patterns". (MEDIUM)
- Redreamality (5,003 pairs, nine panels, Sep 26): Jev holds on binary checklists, but on graded scales keep humans for "norm-referenced or convention-dense evaluation scales". Flash LLMs repeated Jev's most confident errors about 96% of the time, so a cheap LLM is not an independent check on it. (MEDIUM)

### 3.7 Reasoning chains

- **JevBench by Benchmark Heaven (scored Sep 24, independent, "Not affiliated with TypeSafe").** 308 sealed decisions from families including multi-hop, trade-off, temporal and numeric, long policy, and traps. Jev 36.7%, decider-4b v2 34.7%, GPT-6 Luna at medium reasoning 95.5%, at "3.39× Jev" cost ($0.135 against $0.040 per 1,000 decisions) and "2.3× Jev" latency (1.48 s against 0.65 s median). Calibration axis: Jev 76.3, Luna 93.5. Caveats: the sealed items were written by Opus 5 and GPT-5.6 Sol, the run is pilot scale and English only. (HIGH for the numbers, MEDIUM for how far they generalise)
- Willkelly's 3-SAT, etsabary's 13.2% on sequential state, and CMU's 14.6-point gap on derivation checking (above). (HIGH)
- Bolna's graph routing (above). Reticle: an agent picked "Send, at 0.95 probability" and the action had "no observable effect". (MEDIUM)

### 3.8 Adversarial input (the evidence conflicts)

- Zkousama (Sep 21, Wikipedia deletion debates, 486 discussions): 96.5% at baseline, 26.5% after one planted line claiming the article had been kept. The false factual claim drove the reversals more than the instruction did. (MEDIUM)
- Primeline: "22.5% of injected pairs got misclassified outright". (MEDIUM)
- Cwhy (1,056 attacks): Jev flipped once (0.09%) under a strict policy, open Jev-like models 3.0% to 62.6%. The authors add that "a stricter trusted policy closed every flip we found on Jev". (MEDIUM)
- **Reading:** it resists blunt "ignore previous instructions", and it believes planted facts. Zyte: "the page your agent scrapes is now an attack surface". Do not use it as a security boundary.

---

## 4. The speed and cost claims

### 4.1 What the headline numbers compare

- **Four in-house workflows, LLM-made labels.** The 193.6x / 444.6x figures come from TypeSafe's evals on security incidents, agent-trace review, invoice processing and customer service (711 cases per secondary sources). TypeSafe: "we test how they compare to the average of the smartest models (in this case, Astra and Fable)." No human ground truth. (HIGH)
- **TypeSafe's own caveats.** "they were made by individuals on our model capabilities team, so some bias could exist." "we expect that these are on the higher end of real world gains." "our published evals are generally run from our laptops on the West Coast (this is where our service is currently based)". The LLMs ran through TypeSafe's "System One LLM wrapper", which TypeSafe says "tends to be slower and more expensive than giving decisions without probabilities". The "3 to 329 seconds" frontier latency comes from these runs. (HIGH)
- **Decomposed (Pere Pages, from TypeSafe's table).** (MEDIUM, consistent with DataCamp and Layer3Labs)

| Model | Agreement with LLM reference | Cost per case | Seconds per case |
|---|---|---|---|
| Jev | 67.8% | $0.0004 | 0.4 |
| GPT-5.6 Terra | 67.9% | $0.0304 | 10.1 |
| Claude Opus 5 | 73.1% | $0.1761 | 37.8 |
| Claude Sonnet 5 | 67.8% | $0.1174 | 78.1 |
| GPT-5.6 Sol (best) | 74.1% | n/a | n/a |

  "193.6x faster" is Jev against Sonnet 5's time. "444.6x cheaper" is Jev against Opus 5's cost. Two different comparators. Against Terra, the accuracy peer, it is about 25x faster and 76x cheaper. Against the best model it is 6.3 points behind.
- **The Doom demo feeds text, not pixels.** TypeSafe: "The demo is on structured state as a data structure with text, not on images (yet…)". The homepage demo shows 0.114 s against 8.566 s for GPT-5.6 Terra (The Register). HN user hdjrudni: "They're not feeding it video, they're feeding it a text description." (HIGH / MEDIUM)
- TS2: "company-generated results, not independent measurements", and the benchmark "does not compare Jev with an objective answer key". (MEDIUM)

### 4.2 Measured latency per call

| Who | Setup | Jev | Comparison | Conf |
|---|---|---|---|---|
| Juspay | India to US-West, warm | ~380 ms round trip | n/a | MEDIUM |
| Bolna | one machine, public internet | 383 to 547 ms by job | 950 to 1,250 ms; "faster on every job, by 1.7 to 3.3 times" | HIGH |
| Zyte | six questions per record | 0.92 to 0.97 s | gpt-5.6-luna via OpenRouter, under 4 s to nearly 9 s | HIGH |
| anisselbd | from France | 239 ms median | Haiku 4.5, 687 ms | HIGH |
| CMU | single client | 0.152 s median | GPT-6, 1.885 s | HIGH |
| Benchmark Heaven | from Germany | 0.65 s median | GPT-6 Luna, 1.48 s | HIGH |
| Lindfors | Norway | 0.32 s median | DeepSeek V4.1 Flash with reasoning, 2.7 to 26 s | MEDIUM |
| AWS-builders aggregate | many runs | server "about 105 ms", "about 76 ms once the network round trip is subtracted" | "Speed runs from 0.5x, slower than a local Gemma, to 12.1x faster" | MEDIUM |
| Partners (interested) | Maven, Vercel | "about 12 times faster"; "up to 18 times faster" at p95 | their current models | LOW to MEDIUM |

**Reading:** real calls take 0.15 to 1 s, and from India the network is most of it. Independent testers saw roughly 2x to 25x against small and mid LLMs. The 40x to 200x range appears only against slow frontier or reasoning models.

### 4.3 Cost ratios seen in practice

- The list price ($0.042 per million input tokens, $0 output) is confirmed on every gateway. (HIGH)
- Zyte: "Roughly 7X the cost, on one record" for gpt-5.6-luna ($0.000033 against $0.000232 to $0.000262). Anisselbd: $0.038 against $0.462 per 1,000 emails for Haiku, "roughly 2.9x faster and about 12x cheaper" (XenoSpectrum's reading). Ibrahim and Zaki: about 44x cheaper than frontier models. CMU: $0.044 against $12.182 per 1,000 judgments for GPT-6. AWS-builders aggregate: "cost runs from 0.6x, dearer, to 478x cheaper". (HIGH / MEDIUM)
- On hard decisions the ratio collapses: GPT-6 Luna cost only 3.39x Jev per decision on Benchmark Heaven's sealed set while scoring 95.5% against 36.7%. (HIGH)
- Good Start Labs, via Langfuse: 6,003 rubric checks, Jev agreed with Fable 5.1 91.5% of the time at $160 per million graded answers. DeepSeek V4.1 Flash agreed 93.5% of the time at $260. (MEDIUM)

### 4.4 Does "free output" hide a per-call or per-question charge?

No per-call or per-question fee is documented. The real costs sit elsewhere:

1. **Question text is input.** Flavio Copes: input is "the `state` ... plus every question with its instructions and criteria", and "Ask 13 questions about a document in 13 calls and you pay for the document 13 times." (MEDIUM)
2. **A fixed overhead shows up in the bill.** Copes sent a very short input with one question and saw roughly 300 to 400 billed input tokens: "The docs don't explain the gap, but it behaves like a fixed cost of a few hundred tokens on every request." At list price that is about $0.0000126 per call, tiny but per call. (MEDIUM, one source)
3. **Accuracy costs tokens.** The tests push you to one item per call (yodablocks: 417,994 tokens against 226,537 batched, about 1.85x) and to several narrow questions instead of one (anisselbd: 62.6% asked once, 95.0% split into five signals plus a logistic regression trained on 1,000 labelled emails, only just ahead of a 91.6% regex baseline). (MEDIUM / HIGH)
4. **Gateway fees.** OpenRouter 5.5% with an $0.80 minimum per card top-up, Requesty plus 5%, Vercel "payment processing fees". (HIGH)
5. **Labels.** The recalibration everyone recommends needs 50 to a few hundred labelled examples per question type. (MEDIUM)
6. **The price may not last.** TypeSafe: "We can't prove it isn't subsidized; we'll need the long-term to prove the sustainability of our pricing (which we expect to go down, not up)." TS2: "It does not yet validate TypeSafe's economics." (HIGH)

---

## 5. Dependency risk

### 5.1 The contract (Master Customer Agreement, "Last updated Sep 23, 2026") (HIGH)

- **No SLA.** "THE SERVICES AND DOCUMENTATION ARE PROVIDED 'AS IS' AND 'AS AVAILABLE'", beyond a warranty that the services "will perform materially as described in its Documentation" (9.1).
- **Wrong answers are your problem.** 9.3: "(I) THE SERVICES MAY PRODUCE INACCURATE OR ERRONEOUS OUTPUT; (II) CUSTOMER IS RESPONSIBLE FOR INDEPENDENTLY EVALUATING THE OUTPUT".
- **Liability cap.** 12.2: the greater of the 12 months' fees "AND (B) $50 USD".
- **No distilling a replacement.** 2.3: no using "the Services or any Output (defined below) to perform model distillation, train a model to imitate the output of the Services, or develop (or to facilitate the development of) a similar or competing product or service".
- **No retention duty.** 10.3: "TypeSafe will be under no obligation to store or retain Customer Data and may delete Customer Data at any time in its sole discretion."
- **Suspension, law, changes.** TypeSafe "may immediately suspend" access for listed causes (6). California law, San Francisco courts (16.2). Future updates take effect "at least 60 days after" notice (16.7). The agreement was revised eight days after launch and names no earlier version. A fee-change clause and early-access terms: **NOT FOUND**.

### 5.2 Capacity, rate limits, uptime

- Docs: "250,000 tokens per second / 1,200 requests per minute", which "can change without notice". The API returns 429 and "529 Overloaded". (HIGH)
- Status page (read Sep 27): api.typesafe.ai at 99.826% uptime. Incidents on Sep 20 (API issues), Sep 21 ("intermittent downtime and system instability"), Sep 22 (elevated latency, 12 minutes) and Sep 23 (elevated latency). (HIGH)
- The signup freeze and TechCrunch's report of the API briefly unable to serve (above). On the Latent Space podcast Almeida called rate limits "the scary part" as demand grows. (MEDIUM)

### 5.3 Data (HIGH)

- **Not used for training.** Privacy policy: "We will not train or fine tune any artificial intelligence or machine learning models on your prompts or other Input". Models page: "Jev is not trained on customer requests or responses".
- **Retention period unstated.** The policy keeps data "for as long as reasonably necessary". Zero data retention is for enterprise customers on TypeSafe direct. Everything is hosted in the US. India-specific provisions: **NOT FOUND**.
- **Via gateways.** Cloudflare labels Jev "Zero data retention". Vercel offers per-request zero retention on Pro and Enterprise. One guide says the DigitalOcean provider behind Vercel lacks it (LOW).

### 5.4 Pricing and product churn

- **List price unchanged since launch.** No change found. The promotions moved instead: Vercel free until Sep 25, TypeSafe's $5 credit from Sep 20 until the Sep 22 freeze, Lovable free until Sep 27 23:59 UTC. (MEDIUM, absence of evidence)
- **SDK churn.** Python SDK v0.6.0 (Sep 15) changed `Score.criteria` from a dict to "an ordered sequence", and v0.7.0 (Sep 18) changed the "ser/de library ... from `msgspec` to `pydantic`". Five releases in 13 days, latest v0.7.2 on Sep 26. (HIGH)
- **Moving targets.** `jev-latest` and `jev-preview` "can shift to new versions". No deprecation policy found. OpenRouter's Decisions endpoint sits under `/api/alpha/`. (HIGH)
- **No escape hatch.** No weights, no on-prem build, and "no published plan for either" (modemguides, LOW to MEDIUM).

### 5.5 Lock-in, and how close OpenJev really is

- **The API shape travels.** Cloudflare's schema is "byte-identical" to TypeSafe's, and openjev-server says "Request and response shapes follow Jev's `/v1/systemone`". (HIGH / MEDIUM)
- **Behaviour does not.** Thresholds are specific to the version, the question type and the model, so any swap means relabelling and recalibrating. And MCA 2.3 forbids training your own replacement on Jev's outputs. (HIGH)

**The two repos in the brief**

- **zhihz/openjev ("Open JEV").** It wraps a frozen Qwen3-4B-Instruct-2507 (4B). It takes "English or Chinese context" only, 2 to 8 candidates per question, and runs questions one after another. Median 533 to 558 ms on an "Apple M3 / 16 GB". It scores "212/236 (89.8%)" on its own development challenge. In its own words: "There is no demonstrated performance lead over Jev or other competing systems." and "Probabilities are normalized candidate-label scores, not established estimates of real-world correctness." Apache-2.0, 34 stars, baseline frozen "2026-09-17". (HIGH)
- **rituparnakashyap/openjev-server.** A fork (0 stars) of abhishekgahlot2/openjev-server (2 stars, 4 forks, 1 commit). It serves the openjev/openjev weights on Hugging Face (HIGH for all of the following):
  - 27B parameters, licence "CC BY-NC 4.0": "free for research and other non-commercial use ... For commercial use, open a discussion on this repository."
  - Hosted Jev "85.4% (8,540 of 10,000)" against OpenJev "84.0% (8,403 of 10,000)" on the "Same 10,000 questions, same options, same order for every model (34 public datasets, gold answers from the datasets)". But "The comparison is not a controlled one: the hosted model's training data is unknown.", and "Of the 10,000 text questions, 6,922 were fresh for this run and 3,078 had been used during development." No calibration comparison. Both finished 39 of 100 MiniWoB browser tasks.
  - "Prompts up to 16,384 tokens", half of Jev's state budget. Up to 52 options per question against Jev's 255.
  - Hardware: FP8 "on one 80 GB GPU" (about 80 ms for a short decision, about 125 ms on an H100 per the server README). Q4_K_M GGUF at 16.5 GB "fits a 24 GB card (RTX 3090 / 4090)". MLX 4-bit on a 32 GB Mac (about 150 ms). The quality of the Q4 build: **NOT FOUND**.
- **Name collision.** At least three more unrelated "openjev" projects exist (razorback16 on DiffusionGemma 26B-A4B, markusbuchholz, AlexWortega). Numbers from one do not transfer to another. (HIGH)
- **An unverified third-party ranking.** A Hugging Face community post (Sep 23) cites a "JevBench v1.3.0 snapshot" giving Jev 74.1% against OpenJev 65.5% on hard cases, and calibration 82.7 against 64.8. I could not find those figures in the JevBench repository, where "65.5 %" belongs to a different model (Bespoke Nimble 9B). Treat as unverified. (LOW)
- **Other open Jev-class models, independently ranked.** On Benchmark Heaven's composite, decider-4b v2 (64.1) and Plumb-4B (65.84) rank above Jev (63.3). Jev leads on the Intelligence axis (53.1 against 49.4) and on calibration (76.3 against 75.0). Open models were far weaker on injection in cwhy's bench (Laya English flipped 62.6% of the time against Jev's 0.09%). (HIGH / MEDIUM)
- **What self-hosting costs in India.** E2E Networks lists an on-demand H100 80 GB at "₹255.55/hr per GPU", about ₹1.84 lakh for a 24x7 month before tax (my arithmetic). TypeSafe sells "$42 Per Billion input tokens". Self-hosting pays only at tens of billions of tokens a month, or on a 24 GB card you already own, and the non-commercial licence still blocks a product. (MEDIUM, arithmetic mine)

---

## 6. The hype check

### 6.1 Credible skeptics, in their words

- **Sean Goedecke (Sep 16):** "To me, this seems like a semantic dodge, since Jev can absolutely still pick the wrong choice." "I doubt Jev is ever going to be as smart as frontier LLMs." "The data and demos in the announcement look to me like they could have been generated by plugging any Terra-sized model into a single-token inference stack." (HIGH)
- **Armin Ronacher (TechCrunch):** "At the end of the day, it delegates the hallucination problem a little bit to the user". (MEDIUM)
- **Alex Molas (Sep 23):** "A model can be calibrated on TypeSafe's data and still be miscalibrated on yours." (MEDIUM)
- **Simon Willison (Sep 21):** "It's great for anything that can be expressed as a classification task", and "I really hope nobody uses Jev to rank job applicants—that floating point number could conceal all manner of unseen bias." (HIGH)
- **Zyte (Ayan Pahwa, Sep 21):** "it can be completely wrong, and arriving in a tidy shape makes it easier to trust than it has earned." "I would not replace a null check with a model call." (HIGH)
- **CMU (Li, Miao, Krishnan, Padman):** treat confidence as "an escalation signal, not a certificate". (HIGH)
- **KDnuggets (Abid Ali Awan):** "zero out-of-schema outputs, not zero incorrect decisions." (MEDIUM)
- **Hacker News (1,984 points, 520 comments).** nkozyra: "Type safety is not factual correctness." 8note: "if it puts a high confidence value on a wrong answer, thats still hallucinating, no?" jacobgold's retitle: "Jev: Trading general purpose generation for fast typed inference". WhitneyLand notes the original HN title was "Jev: New frontier model 40-400x cheaper and 20-200x faster", changed within the hour. The CEO (CompleteSkeptic) answered: "I don't think it's fair to say a random forest 'hallucinates' in the way LLMs do". (MEDIUM)
- **The Register (Thomas Claburn):** the "hallucination-free" comparison is unfair because the model outputs structured data, and wrong structured answers remain possible. (MEDIUM)
- **Rajesh Beri (Sep 20):** the accuracy comes from "how you break the decision down, the labels you check it against, and the per-question fit you maintain". (MEDIUM)
- **Excluded as not credible:** the "Guys Jev Is a Scam" thread, which per Requesty "argued from a single geopolitical question that Jev is a relabelled Chinese model". No evidence was offered.

### 6.2 What it is actually good for (where independent tests agree)

- High-volume, English, answerable decisions over a few options that include "none": triage, queue routing, moderation pre-filters, binary rubric checklists, reranking, and gates like Zyte's "Deciding whether a description actually describes the thing it is attached to".
- The first stage of a cascade. CMU: routing uncertain cases to GPT-6 kept 99.6% of GPT-6's accuracy at 44% of its fee. Ibrahim and Zaki: routing low-confidence items to LLMs matched or beat LLMs alone at 25 to 50% of the cost.
- A confidence signal that ranks errors better than chat models' self-reported confidence (Primeline, Lightfield), once recalibrated on your own labels.

### 6.3 What it is oversold as

- **"Zero Hallucinations"** (homepage heading): schema conformance, which any constrained decoder already gives.
- **Frontier intelligence:** TypeSafe's own dashboard puts it 6.3 points behind the best model. The AWS-builders aggregate: "Level with mid-price LLMs and behind the frontier, at a fraction of the frontier's price."
- **"Calibrated":** true in aggregate on familiar English tasks, false as a per-answer promise, on Score questions, on unanswerable questions, and under option renaming.
- **"40-400x cheaper":** true against slow frontier models on TypeSafe's own tasks. Independent tests saw roughly 7x to 20x against small LLMs (Zyte about 7x, anisselbd about 12x, Primeline "8-20x" per call against Haiku), and dearer than a local model in one.
- **An agent's brain:** it fails at moving a conversation between states (Bolna), at sequential state (13.2%), at 3-SAT, at checking derivations, and at hard sealed decisions (36.7% against 95.5%).

### 6.4 Where the line sits

- **A cheap calibrated classifier: yes**, if you (a) write the options yourself, including "none", (b) send one item per call with a short, relevant state, (c) keep arithmetic, counting, dates and security checks in code, (d) recalibrate thresholds on your own labels, and (e) send low-confidence cases to an LLM or a person.
- **A replacement for an LLM agent's reasoning step: no.** Every independent test that asked it to plan, chain steps, check a derivation, or decide when an agent should move forward found it well behind LLMs. In a Jev pipeline the reasoning lives in the decomposition you write. Bolna: "Jev is not a replacement for the model that talks to your caller, and on routing it is not ready". Zyte: "Your code proposes, the model decides."

---

## NOT FOUND (the record is silent)

- Whether TypeSafe signups have reopened as of Sep 27.
- Waitlist admission criteria. Any report from an India-based individual. Payment methods accepted on console.typesafe.ai.
- What the API returns when the state exceeds 32k tokens.
- Any test at 50k or 100k tokens (impossible in one call), or a controlled degradation curve at 8k to 32k.
- A Hindi-specific accuracy or calibration number for hosted Jev. Any Hinglish calibration test.
- An independent multi-document comparison benchmark.
- Any ECE or Brier score published by TypeSafe. A paper describing RLCD. The model's size.
- Jev-specific rate limits on OpenRouter, Cloudflare or Requesty. Whether Cloudflare's free Neurons cover Jev.
- A TypeSafe SLA, fee-change clause, early-access terms or deprecation policy.
- Any list-price change since launch.
- The quality of OpenJev's Q4 GGUF build.

---

## Sources (every URL fetched)

TypeSafe primary
- https://typesafe.ai/
- https://typesafe.ai/blog/introducing-system-one-models-and-jev
- https://typesafe.ai/legal/mca
- https://typesafe.ai/legal/privacy-policy
- https://typesafe.ai/legal/data-processing
- https://typesafe.ai/evals (404)
- https://typesafe.ai/benchmarks (404)
- https://docs.typesafe.ai/introduction
- https://docs.typesafe.ai/llms.txt
- https://docs.typesafe.ai/models
- https://docs.typesafe.ai/models.md
- https://docs.typesafe.ai/model-jaggedness/jev-1.13
- https://docs.typesafe.ai/model-jaggedness/jev-1.13.md
- https://docs.typesafe.ai/confidence.md
- https://docs.typesafe.ai/concepts/system-one.md
- https://docs.typesafe.ai/api.md
- https://docs.typesafe.ai/cookbooks/llm_guardrails.md
- https://docs.typesafe.ai/legal.md
- https://docs.typesafe.ai/sdk/python/changelog.md
- https://status.typesafe.ai/
- https://console.typesafe.ai/ (403)
- https://github.com/typesafe-ai/typesafe-sdk-python/issues
- https://github.com/typesafe-ai/typesafe-sdk-python/issues/15
- https://x.com/typesafeai/status/2102281508950307159 (402, text taken from search index)

Gateways and hosts
- https://openrouter.ai/typesafe
- https://openrouter.ai/typesafe/jev-1.13 (404)
- https://openrouter.ai/typesafe/jev-router
- https://openrouter.ai/docs/guides/community/jev
- https://openrouter.ai/docs/faq
- https://openrouter.ai/blog/insights/what-is-jev/
- https://developers.cloudflare.com/ai/models/typesafe/jev/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://vercel.com/ai-gateway/models/jev
- https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway
- https://vercel.com/changelog/ai-gateway-now-supports-typesafe-clients-and-http-api-for-jev
- https://vercel.com/docs/ai-gateway/pricing
- https://www.requesty.ai/blog/typesafe-jev-explained
- https://www.requesty.ai/blog/jev-week-two-four-gateways-open-clones-what-builders-shipped
- https://www.requesty.ai/pricing
- https://ideas.digitalocean.com/changelog/now-available-jev-from-typesafe-ai
- https://github.com/clouatre-labs/decisions-judge-mcp/issues/40
- https://github.com/Mumega-com/mupot/issues/1437

Independent tests, papers and audits
- https://www.zyte.com/blog/jev-the-model-that-cannot-write-a-word-and-where-it-fits-in-web-scraping-does-it/
- https://www.bolna.ai/blog/testing-jev-on-real-phone-calls
- https://github.com/juspay/clairvoyance/pull/1163
- https://arxiv.org/html/2609.26550v1
- https://arxiv.org/abs/2609.24574
- https://arxiv.org/abs/2609.26758
- https://arxiv.org/html/2609.26758
- https://github.com/scienthoon/jev-ood-calibration
- https://github.com/willkelly/jev-evaluation
- https://github.com/KantaHayashiAI/jev-does-not-play-dice
- https://github.com/AHTOOOXA/jev-cyrillic-audit
- https://github.com/jujumilk3/jev-calibration-audit
- https://github.com/priorbench/jev
- https://github.com/anisselbd/jev-phishing-bench
- https://github.com/zkousama/jagged
- https://github.com/cwhy/decision-injection-bench
- https://github.com/yodablocks/jev-orderby-bench
- https://github.com/123Satyajeet123/jev-wide
- https://github.com/RINNECODER/jev-behavior-study
- https://github.com/etsabary/jev-deterministic-benchmark
- https://github.com/mahlernim/jev-korean-benchmark
- https://github.com/stillmarcus24/awesome-jev-robustness
- https://github.com/fstandhartinger/jevbench
- https://github.com/fstandhartinger/jevbench/issues/49
- https://benchmarkheaven.com/jev-models
- https://jevbench.xyz/benchmarks
- https://jevbench.xyz/methodology
- https://anth.us/blog/can-you-trust-jev-confidence
- https://primeline.cc/blog/typesafe-jev-pre-registered-test
- https://lightfield.app/blog/testing-typesafe-jev-on-text-understanding
- https://lindfors.no/blog/a-first-look-at-typesafes-jev/
- https://www.rotecodefraktion.de/en/blog/jev-typesafe-im-test/
- https://www.threads.com/@ebrain.lab/post/DddGgXuoLlL
- https://redreamality.com/blog/jev-rubric-judges-cheaper-faster-correlated-errors/
- https://www.reticle.sh/blog/typesafe-jev-playbook
- https://www.mavenagi.com/resources/why-were-already-testing-jev-against-real-enterprise-decisions
- https://www.langchain.com/blog/jev-agent-evals-langsmith
- https://langfuse.com/blog/2026-09-18-using-typesafes-jev-for-evals
- https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60
- https://www.beri.net/article/typesafe-jev-typed-decision-model-calibration-decomposition-shadow-eval
- https://aiagentssimplified.substack.com/p/the-dark-side-of-jev-83-confidence
- https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds (no article body returned)

Open alternatives
- https://github.com/zhihz/openjev
- https://github.com/rituparnakashyap/openjev-server
- https://github.com/abhishekgahlot2/openjev-server
- https://huggingface.co/openjev/openjev
- https://huggingface.co/openjev/openjev/raw/main/README.md
- https://huggingface.co/spaces/multimodalart/jev-reproductions-tracker (no content returned)
- https://huggingface.co/blog/sora-2/jev-ai-vs-djev-vs-laya-vs-openjev-vs-semif-which-d
- https://github.com/SAGAR-TAMANG/sarvam-jev
- https://www.modemguides.com/blogs/ai-news/jev-typesafe-reality-check-run-locally
- https://www.e2enetworks.com/gpus/nvidia-h100

Commentary, news and skeptics
- https://news.ycombinator.com/item?id=49717558
- https://news.ycombinator.com/item?id=49794590
- https://news.ycombinator.com/item?id=49745752
- https://news.ycombinator.com/item?id=49731282
- https://www.seangoedecke.com/jev-means-structured-output-is-interesting-again/
- https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html
- https://simonwillison.net/2026/Sep/21/jev/
- https://www.kdnuggets.com/what-everyone-is-getting-wrong-about-typesafe-ais-jev
- https://techcrunch.com/2026/09/18/a-new-kind-of-ai-model-from-a-chatgpt-inventor-is-thrilling-developers/
- https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711
- https://www.tomshardware.com/tech-industry/artificial-intelligence/typesafe-ais-jev-offers-an-alternative-to-llms-that-claims-to-be-193x-faster-and-445x-cheaper-system-one-type-model-is-bespoke-for-probabilistic-decision-making (no article body returned)
- https://ts2.tech/en/typesafe-ai-raises-40-million-for-jev-but-its-445x-cost-claim-is-still-self-tested/
- https://xenospectrum.com/en/jev-typesafe-bert-classifier-decomposition/
- https://pearpages.com/blog/2026/09/16/jev-sorted-what-typesafes-system-one-model-actually-is-and-what-is-still-just-a-claim
- https://www.datacamp.com/blog/system-one-models-jev
- https://www.latent.space/p/jev
- https://en.wikipedia.org/wiki/Jev_(AI_model)
- https://labs.eye.security/rise-of-the-jev-clones/
- https://www.firecrawl.dev/blog/what-is-jev
- https://systemonemodels.org/guides/is-jev-just-a-classifier/

Access guides and news (mostly LOW)
- https://flaviocopes.com/jev/
- https://flaviocopes.com/jev-api-key/
- https://flaviocopes.com/jev-pricing/
- https://apidog.com/blog/how-to-access-jev/
- https://www.orcarouter.ai/blog/jev-typesafe-system-one-what-we-know
- https://www.orcarouter.ai/blog/jev-vs-deepseek-v4-1-flash
- https://cryptobriefing.com/typesafe-jev-ai-public-access/
- https://aifront-page.com/typesafe-ai-pauses-jev-ai-model-signups-demand-surge/
- https://aiextracash.com/tools/jev/jev-free-credit/
- https://huggingnews.com/ai/update-typesafe-ai-clears-140000-waitlist-users-for-first-system-one-mod-e5962b39
- https://jevaiguide.com/faq/jev-waitlist/
- https://jevaiguide.com/channels/vercel-ai-gateway/
- https://www.layer3labs.io/guides/jev-benchmarks
- https://www.layer3labs.io/guides/jev-limits
- https://www.youtube.com/watch?v=2L-XUcSqOHA (no description returned)

Quoted from search-index snippets only (pages not fetchable): TypeSafe's X post of Sep 20 ("Jev is now available to everyone. No waitlist."), Diogo Almeida's X post on the signup pause (x.com/CompleteSkeptic/status/2102282924699840980), Kai's X post on the invite (x.com/hqmank/status/2100790483379245391), OpenRouter's X post on the beta listing (x.com/OpenRouter/status/2100744709589316009).
