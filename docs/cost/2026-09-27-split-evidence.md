# Researcher split (Sonnet 5 sweep, then Opus 5 judge): what the published evidence says

Prepared 2026-09-27. Read-only web research; nothing billed.

**Bottom line.** The published record does not show that a cheap worker loop plus a frontier single-shot judge matches the frontier model alone on research of this size. Anthropic's own measurements point the other way for work that fits one context. The split will very probably cost less than today's run. It is roughly a coin flip against a tuned Opus-alone run. If it is built, its value depends almost entirely on the evidence pack. Run the two cheaper experiments in section 5 first.

## How to read this

- Every figure is exact as published. Each one carries a source number [n] (list at the end) and a locator, so it can be checked at source. Wording is paraphrased. The report uses one verbatim quote: the sentence the brief asked me to find.
- I used primary sources first. Figures from aggregators are marked (agg.). The Opus 5 and Sonnet 5 system-card PDFs are larger than the 10 MB fetch limit and were not opened. Their BrowseComp figures come from a leaderboard and a mirror that cite them.
- The Anthropic docs page *Optimizing for cost and intelligence* [2] shows no date and has been revised at least twice. Its figures are as read on 2026-09-27.
- NOT FOUND marks every place where the record is silent.

## 1. Verdicts

| Statement | Confidence | Why |
|---|---|---|
| (a) The split matches or beats Opus-alone on dossier quality | **35%** | The sweep limits what the judge can see. Sonnet 5 trails Opus 5 by 15 points on the one first-party, same-basis research-report benchmark, and that benchmark scores information recall [2][26]. Anthropic measured the frontier model alone at lower effort beating delegation on every workload that fit one context [2]. A run that compacts once near 180k tokens on a 1M-context model fits that description. What keeps the figure above 25%: today's solo run already writes its dossier from its own compaction summary, so it is not free of handoff loss either. A designed pack read in a clean context by a separate checker also has real support [27-30][41][49]. It could reach about 50% if sections 4 and 5 are followed. |
| (b) It does so at lower cost than Opus-alone | **30%** as the joint claim (same or better quality AND cheaper). Cost alone: **75%** against today's Opus 5 run (~$7.40); **45%** (about even) against a tuned Opus-alone (Opus 5 at lower effort, or Opus 5.5 at medium) | Sonnet 5 is 2.5x cheaper on every token class [3], and a 40k-token judge pass is small. Against that: at max effort Sonnet 5 produced 2.6x Opus 5's output tokens on Artificial Analysis's index [19][20]. On that index, Opus 5 at low effort out-scored Sonnet 5 at max for about 22% of the cost [18]. Lowering effort is Anthropic's documented first lever. On DeepWideSearch it matched an orchestrator with a Sonnet 5 worker at 29% lower cost (Fable 5) [2]. |
| (c) The biggest risk is handoff loss | **55%** | Handoff loss is the biggest design risk, and the only one an evidence pack controls. In Minions, the same two models moved from 87% to 97.9% of frontier quality through protocol design alone [36]. The competing risk is coverage: what a Sonnet loop never finds, which no pack can repair [2][16]. The two compound, because a sweep that misjudges what matters also packs the wrong things. Section 4 lists what the pack must contain. |

## 2. The evidence, question by question

### Q1. Anthropic, "How we built our multi-agent research system" (13 June 2025) [1]

What it reports:
- **The model split.** Claude Opus 4 was the lead agent and Claude Sonnet 4 ran the subagents. The system beat single-agent Opus 4 by **90.2%** on Anthropic's internal research eval. The gains were largest on breadth-first queries. In its example (the board members of every S&P 500 IT company), the single agent failed through slow sequential searching. Locator: the section on the benefits of a multi-agent system.
- **What explained performance variance.** On BrowseComp, three factors explained **95%** of the variance. Token usage alone explained **80%**; the number of tool calls and the model choice were the other two. Upgrading to Sonnet 4 gained more than doubling Sonnet 3.7's token budget.
- **Token cost.** Agents use about **4x** the tokens of chat, and multi-agent systems about **15x**. The task has to be valuable enough to pay for that.
- **Poor fits.** Work where the agents must share one context or depend heavily on each other, including most coding.
- **Failure modes it names.** Early agents spawned 50 subagents for simple queries, searched endlessly for sources that did not exist, and distracted each other with updates. Vague task descriptions produced duplicated work, gaps and missed information. Synchronous execution created bottlenecks. Small changes to the lead's prompt changed subagent behaviour unpredictably. Errors compounded over long stateful runs.
- **Mitigations.** Subagents write their outputs to a filesystem so results bypass the coordinator; this is its fix for the telephone game. The lead saves its plan to memory because context past 200,000 tokens is truncated. A separate CitationAgent reads the documents and the report and places the citations. Every subagent brief states an objective, an output format, the tools and sources to use, and the task's boundaries.
- **Evaluation.** A single LLM-judge call scoring 0.0 to 1.0, with a pass/fail grade, was the most consistent setup. The rubric covered factual accuracy, citation accuracy, completeness, source quality and tool efficiency. Evaluation started with about 20 queries. Human testers caught early agents preferring SEO content farms to authoritative sources such as academic PDFs.

What transfers to the proposed split:
- The model roles themselves: frontier synthesis over cheaper search is Anthropic's production research design.
- Outputs saved to files instead of passed as messages. That is the evidence pack.
- A separate citation and anchor pass. That is the judge, with one difference: the CitationAgent read the documents, not extracts.
- Detailed worker briefs, the rubric, and human review for drift in source quality.
- Token spend drives search performance, so the sweep must not be starved of tokens.

What does not transfer:
- The 90.2% came from parallel breadth: several context windows spending more tokens at once on breadth-first questions. The proposal is sequential and spends no extra tokens, and a dossier is mostly depth-first cross-checking of one topic. **The 90.2% is not evidence for this split.**
- The lead stayed in the loop and could spawn more work after reading results. The proposed judge is single-shot, with one optional short sweep.
- The baseline was a 2025 single-agent Opus 4, not a 2026 Opus 5 run with compaction.

### Q2. Sonnet 5 vs Opus 5 on research-shaped work

The launch posts do not compare the two models. The Sonnet 5 post (30 June 2026) charts it against Sonnet 4.6 and Opus 4.8, and Opus 5 shipped later, on 24 July 2026 [9][10]. The only first-party, same-basis comparison I found is in the docs [2].

| Measure | Opus 5 | Sonnet 5 | Gap | Source |
|---|---|---|---|---|
| DeepResearch Bench II (132 tasks; 9,430 binary rubrics over information recall, analysis and presentation) | 71%, $6.71 per task (default effort) | 56%, $1.20 per task | **-15 pts**; Sonnet at ~18% of Opus's cost per task | [2] cost-per-task section, with prompt caching; [26] |
| BrowseComp | 90.8% (single agent, max effort, compaction at 200k) | 84.7% single agent (10M-token budget, compaction, programmatic tool calling); 86.6% multi-agent | **-6.1 pts**; the configs differ, and Sonnet's budget was larger | [16] citing the system cards; [14] mirror; Sonnet's method confirmed in [9]'s correction note |
| Humanity's Last Exam, with tools | 64.7% | 57.4% | -7.3 pts | [17] (agg.); Sonnet's figure also in [23] |
| SWE-bench Pro (agentic coding, for reference) | 79.2% | 63.2% | -16 pts | [17] (agg.); Sonnet's figure also in [23] |
| AA Intelligence Index, both at max effort | 51; 140M output tokens; $5.86 per index task | 38; 370M output tokens (median model: 88M); $5.09 per index task | -13 pts at ~87% of the cost | [19][20] |
| AA: Opus 5 at low vs Sonnet 5 at max | 39; 15k output tokens per task; $1,561 to run the index | 38; 118k output tokens per task; $6,998 | Opus at low effort is ahead at ~22% of the cost | [18] |
| AA-Omniscience (knowledge; wrong answers penalised), same pair | 29 | 16 | -13 | [18][22] |
| AA-LCR (long-context reasoning), same pair | 81% | 82% | parity | [18] |
| GDPval-AA v2.1 / AA-Briefcase (knowledge-work deliverables), same pair | 1294 / 1210 | 1449 / 1359 | Sonnet at max is ahead of Opus at low | [18] |
| MRCR, GraphWalks, tau2-bench, DeepSearchQA | NOT FOUND | NOT FOUND | | |

**Prices [3], per million tokens (input / output / cache hit).** Opus 5: $5 / $25 / $0.50. Sonnet 5: $2 / $10 / $0.20. The launch introductory price is now standard, and the planned 1 September rise to $3 / $15 was cancelled. Opus 5.5 (released 22 September 2026): $4 / $20 / $0.20, with cache hits at 0.05x. **Opus 5 costs exactly 2.5x Sonnet 5 on every token class.**

**Other context.**
- Artificial Analysis's launch article found Sonnet 5 costing about 15% more per task than Opus 4.8 before promotional pricing, entirely because of token use [21]. It used about 40% more output tokens than Sonnet 4.6 and about 3x the agentic turns on knowledge-work tasks.
- That article's launch score for Sonnet 5 (53) differs from the current page's 38 for the same model and effort, so the index has evidently changed since launch. The table uses only the current side-by-side page.
- In Anthropic's advisor tests, a Sonnet 5 executor gained only a few points on GPQA from an Opus 5 advisor [2]. On pure reasoning, the gap between the two models is modest.

**What this means.** On research-shaped work, Sonnet 5 sits 6 to 15 points below Opus 5:
- The gap is widest on the report-writing benchmark and on knowledge reliability.
- The two are level on long-context reasoning.
- At max effort, Sonnet 5 is ahead on knowledge-work deliverables.
- On cost, the effort setting moves the bill more than the choice of model does.

### Q3. Clean context vs long context, and what compaction loses

**Degradation with context length.** Every study here predates Opus 5 and Sonnet 5.
- **Chroma, *Context Rot*** (Hong, Troynikov, Huber; 14 July 2025) [27]. Tested 18 models, including the Claude 4 generation. Findings:
  - Reliability falls as input grows, even on simple tasks.
  - A single distractor already hurts.
  - Low similarity between question and needle makes performance degrade faster.
  - Shuffled haystacks beat coherent ones.
  - On LongMemEval, focused prompts of about 300 tokens beat full prompts of about 113k tokens.
  - Claude models had the lowest hallucination rates and tended to abstain.
  - Conclusion: how information is presented matters more than whether it is present.
- ***Lost in the Middle*** (TACL 2024) [28]. Performance is best when the relevant passage sits at the start or end of the input and significantly worse when it sits in the middle, including for long-context models.
- **NoLiMa** (ICML 2025) [29]. Of 13 models claiming at least 128K of context, 11 fall below half their short-context score at 32K. GPT-4o drops from 99.3% to 69.7%. Reasoning and chain-of-thought do not rescue it.
- **RULER** (COLM 2024) [30]. 17 models are near-perfect on plain needle tests but drop sharply as length grows. Only half hold up at 32K.
- **Unknown:** the size of this effect on Opus 5 at 170k to 184k tokens is NOT FOUND. AA-LCR puts both models at 81 to 82% on long-context reasoning [18].

**Compaction and summarisation in agent runs:**
- **Anthropic, context engineering** (29 Sept 2025) [6]:
  - Compaction summarises a nearly full context into a new window.
  - Claude Code keeps decisions, open bugs and implementation details, and drops redundant tool output.
  - Over-aggressive compaction can drop subtle context whose importance only shows later.
  - Sub-agents hand back condensed summaries, often 1,000 to 2,000 tokens long.
  - Keep lightweight identifiers (paths, links, stored queries) and load the content just in time.
- **Anthropic, long-running harnesses** (26 Nov 2025) [8]. Compaction alone is not enough across context windows. Later sessions declared the job done too early. A progress file plus git history carried the state between sessions.
- **Anthropic, context management** (29 Sept 2025) [7]. On an internal 100-turn web-search eval, context editing alone gave a 29% improvement. Adding the memory tool gave 39%, and token use fell 84%.
- ***The Complexity Trap*** (JetBrains; NeurIPS 2025 workshop) [31]. Masking old observations halved cost against the raw agent and matched, or slightly beat, the solve rate of LLM summarisation. A hybrid cut cost a further 7% against masking and 11% against summarisation.
- **ACON** (ICML 2026) [32]. Compression guidelines refined from failure analysis cut peak tokens by 26 to 54% while beating other compression methods. Smaller models gained up to 46%.
- **Counterpoint.** Anthropic's best agentic-search scores are run with compaction: Sonnet 5's BrowseComp run used a 10M-token budget with compaction, and Opus 5's compacted at 200k [9][16]. Compaction by itself is not a quality defect.

**What follows for this pipeline.** The researcher writes its dossier after compacting, working from its own summary. So the solo run already hands off to itself; the handoff is simply undesigned. The split's real proposition is to replace that undesigned compaction with a designed one (the pack), read in a clean context. That proposition can be tested without changing models (section 5).

### Q4. Cascades, Anthropic's orchestrator and advisor findings, and judge bias

**Anthropic docs, *Optimizing for cost and intelligence* [2]:**
- **Orchestrator.** The frontier model holds the loop, and workers absorb the token-heavy exploration.
- **Easy slice of BrowseComp** (10 problems the solo model reliably solves; 50 delegated runs and 70 solo runs). Fable 5 with one Sonnet 5 worker cost about half as much on average, and about a third as much at the 90th percentile ($12 vs $33). The solo model's most expensive run, $84, was also wrong. Delegation insures routine work against a cost tail.
- **Full, harder BrowseComp.** Fable 5 alone reached the coordinator's accuracy at 22 to 30% lower cost.
- **Work larger than any context window** (a 21.6M-token corpus of 14 Python packages with 130 planted defects):
  - Fable 5.1 solo cost $468 to $552 per episode.
  - A Fable 5.1 lead over 25 Sonnet 5 workers cost **47 to 55% less** and scored **10 to 12 points lower**. It took about 2.3 hours per episode against 15 to 20, and it beat Sonnet 5 solo.
  - Fable 5.1 at high effort kept peak accuracy, at about 2.2x the coordinator's cost.
- **Work that is one dependent chain, or fits in one context.** Here the orchestrator pays for a plan, a handoff and a merge that the solo model gets for free. In every such case measured, **"the coordinator's model alone at lower effort came out ahead."**
- **DeepWideSearch.** Fable 5 at low effort matched an orchestrator with a Sonnet 5 worker at 29% lower cost.
- **Effort on research and knowledge-work benchmarks** (WideSearch, DeepWideSearch, BrowseComp, GDPval; Fable 5). The accuracy-cost curve is nearly flat. Low effort gave up 1 to 3 points for a third to a half off the cost. Medium matched the default at 70 to 87% of its cost. On DeepResearch Bench II, Fable 5.1 scored almost the same at low, medium and high while the cost per task rose from $4.66 to $7.12.
- **Advisor.** The help is bounded by the capability gap between the models and by whether the executor asks for it. An executor at low effort can stop noticing that it is stuck, and then scores below the executor alone.
- **Cost per completed task.** A stronger model finishes with fewer turns, less searching, less re-reading and less backtracking. On the SWE-bench Pro subset, Fable 5.1 at low effort solved 88.6% at $0.54 per solved task, against Sonnet 5's 77.4% at $0.84, despite a per-token price five times higher. Price the hardest tenth of the workload, because a failed task still bills.
- **Recommended order.** Sweep effort on the current model first. Then price the stronger model alone at low effort. Start agent workloads on Opus 5.5 at medium.
- **The brief's figures.**
  - The live page says 47 to 55% cheaper and 10 to 12 points lower, not "55% and 3 to 7 points". The "3 to 7 points" figure is NOT FOUND.
  - A third-party GitHub issue dated 4 September 2026 quotes a 29 August revision as saving over 60% while giving up 2 to 6 points [25].
  - The Decoder (8 July 2026) reported Anthropic's first BrowseComp claim as 96% of Fable 5's score at 46% of its cost [24].
  - Across revisions, the reported quality penalty of delegating has grown.

**Anthropic cookbook, coordinator pattern ("plan big, execute small") [4]:**
- The frontier coordinator never touches a raw page. Workers report the answer plus the evidence (URLs and quotes).
- 84 to 98% of the team's input tokens were billed at worker rates.
- The pattern pays on coverage questions, where the reading is unavoidable. It does not pay on narrow questions, and each worker carries a fixed setup overhead.
- Where the task needs frontier judgment on the raw material itself, a cheap reader can summarise away exactly what mattered.
- It publishes no quality comparison between the two arms (NOT FOUND). It does record both arms making the same error on a list built from model memory.

**Anthropic, *Building multi-agent systems: when and how to use them*** (23 Jan 2026) [5]:
- Multi-agent builds used 3 to 10x the tokens of a single agent for equivalent tasks.
- Teams that split planning, execution and review into separate agents lost context at every handoff.
- Splitting by type of work is often counterproductive (a telephone game); splitting along context boundaries usually works.
- Verification sub-agents are the exception, because a verifier needs little of the author's context.
- A verifier's typical failure is declaring success after one or two checks; concrete criteria fix it.
- Better prompting of a single agent often matched months of multi-agent building.
- **How this applies here:** the proposed split divides by type of work. The judge's verification job (checking anchors against verbatim evidence) fits the pattern Anthropic recommends. Its authorship job (writing the structural argument) is the pattern the same post calls often counterproductive.

**Cascades.** These route whole queries; none is a worker-then-judge design on one task.
- **FrugalGPT** (2023) [33]: matched the best single LLM at up to 98% lower cost, or gained 4% accuracy at equal cost.
- **Mixture-of-thought cascades** (ICLR 2024) [34]: GPT-4-level reasoning at 40% of GPT-4's cost.
- **RouteLLM** (2024) [35]: more than 2x cheaper in some cases, without quality loss.
- **Why they transfer poorly:** they save by never sending easy queries to the big model. A dossier is not an easy query, and the split sends every run through both models.

**A small model reads, a frontier model reasons:**
- **Minions** (Stanford, Feb 2025) [36]. A small local model reads the documents and a frontier model reasons. With free-form chat between them, remote cost fell 30.4x but quality was 87% of the frontier model's. When the frontier model split the job into short chunk-level subtasks, cost fell 5.7x and quality was 97.9%.
- **Chain-of-Agents** (Google, 2024) [37]. Workers read segments in sequence and pass notes forward; a manager writes the answer. Up to 10% better than RAG, full-context and multi-agent baselines.
- **ReWOO** (2023) [38]. Separating reasoning from observations gave 5x token efficiency and 4% higher accuracy on HotpotQA.
- **ArcticSwarm** (preprint, 1 Sept 2026) [40]. Separates evidence gathering from integration, with structured review at commitment points. On BrowseComp-Plus: 82.6% for the full system, 78.8% without gated isolation, and 74.5% with structured review also removed. The same model (Qwen 3.5-27B) filled every role.
- **Self-MoA** (2025) [39]. Aggregating several outputs of the single best model beat mixing different models: +6.6% on AlpacaEval 2.0 and +3.8% on average across MMLU, CRUX and MATH. Mixing models often lowered quality.
- **MAST** (Berkeley; 1,642 traces) [41]. Failures were about 44% system design, 32% inter-agent misalignment and 24% task verification. Incorrect verification accounted for 9.1%, missing or incomplete verification 8.2%, ignored input 1.9%, and information withholding 0.85%. A verifier is no silver bullet, but adding a high-level check against the task objective raised ChatDev's success on ProgramDev by 15.6%.

**When the judge is the author, or the author's sibling:**
- **Zheng et al.** 2023 [42]. GPT-4 gave its own answers about a 10% higher win rate and Claude-v1 about 25%. The authors say their data cannot settle whether this is a real bias.
- **Panickssery, Bowman, Feng** 2024 [43]. How well a model recognises its own output correlates linearly with how strongly it prefers it.
- **Spiliopoulou et al.** 2025 [44]. Over 5,000 prompt-completion pairs and nine judges. GPT-4o and Claude 3.5 Sonnet showed both self-bias and family bias.
- **Awuni et al.** (preprint, 15 Sept 2026) [45]. Four open-weight model families, 9,312 judgments. Judges favoured their own family by 3.4 to 8.4 points. 55.4% of AB/BA pairs flipped with position, and changing the panel's make-up changed 18.5% of outcomes. No Claude models were tested.
- **Verga et al.** 2024 (PoLL) [46]. A panel of smaller models from different families beat one large judge, with less bias, at over 7x lower cost.
- **Huang et al.** (ICLR 2024) [47]. Without external feedback, models fail to self-correct their reasoning and sometimes get worse.
- **Stechly et al.** 2023 [48]. GPT-4 verified answers no better than it produced them; the gains came from a sound external verifier.
- **Tsui** (COLM 2026) [49]. A 64.5% blind spot across 14 open, non-reasoning models: they corrected errors attributed to someone else and missed the same errors attributed to themselves.
- **SAFE** (NeurIPS 2024) [50]. Search-backed, claim-by-claim checking agreed with crowd raters 72% of the time, won 76% of 100 disagreements, and cost over 20x less. Larger models were generally more factual in long-form answers.
- **How this applies here:**
  - A checker with a fresh context is well supported.
  - A different model helps against self-preference, but Opus judging Sonnet is a same-family judgment, and family bias has been measured for Claude 3.5 Sonnet.
  - Whether family bias affects claim-against-evidence checking, as opposed to preference grading: NOT FOUND.

### Q5. Handoff loss, and what people did about it

What gets lost:
- **Material only frontier judgment would catch.** A cheap reader can summarise it away [4].
- **Quality, depending on the protocol.** In Minions, the same models reached 87% or 97.9% of frontier quality depending on how the handoff was designed [36].
- **Omissions.** Claude 2 extracted 160 data elements from clinical trials at 96.3% accuracy (96.9% and 95.0% on retest). Four of its six errors were missed items [55]. Anyone reading only the extracts cannot see an omission.
- **Conflicts between sources.** Splitting a corpus into chunks loses dependencies and conflicts between chunks [51]. Disagreements between sources are exactly such conflicts.
- **Coverage with citation.** On SummHay, even systems given perfect retrieval trail the human estimate (56%) by more than 10 points, and long-context models without retrieval score under 20% [52].
- **Faithfulness.** In FABLES, most unfaithful claims needed indirect reasoning to catch, LLM raters did not match humans at catching them, and omissions were systematic [53].
- **Support for claims.** Deep-research systems still produce large shares of unsupported statements, with citation accuracy of 40 to 80% [54].
- **Implicit decisions.** Actions carry implicit decisions, so pass full traces rather than messages; models that compress history are hard to get right [56].
- **Handoffs themselves.** Context is lost at each handoff [5], and inter-agent misalignment causes about 32% of multi-agent failures [41].

Mitigations with evidence behind them:
- Save outputs as files, and run a separate citation pass over the documents themselves [1].
- Return evidence, not conclusions: the answer plus URLs plus quotes [4].
- Keep identifiers so any source can be reloaded on demand [6].
- Let the frontier model write the extraction brief. In Minions, this is what moved quality from 87% to 97.9% [36].
- Keep one structured record per extract, with a confidence, and handle conflicts explicitly [51].
- Ask back to the worker that did the reading. Managed Agents threads persist, so a coordinator can send a follow-up to a worker that still holds its earlier turns [11].
- Use span-level citations. With Anthropic's Citations feature, Endex reported source hallucinations and formatting issues falling from 10% to 0%, and 20% more references per response. Anthropic's own figure was up to 15% better recall accuracy [12].
- Quote first, then answer. Pulling the relevant quotes before answering improved accuracy on long documents: Claude 2 went from 0.939 to 0.961, 36% fewer errors [13].

## 3. Where the split fails, and where it could win

Likely failures:
1. **Coverage.** The judge can only judge the pack. Sonnet 5 trails Opus 5 by 15 points on the report benchmark that scores recall [2][26], and its research loop there cost about 18% of Opus's, meaning a shorter loop. Token spend explains 80% of BrowseComp variance [1].
2. **Unknown unknowns.** A primary source that was never found stays invisible unless the pack records what was sought and missed.
3. **Disagreements between sources.** When pages are extracted one at a time, conflicts fall between the extracts [51].
4. **Omissions.** The most common extraction error, and one nobody downstream can detect [55].
5. **Subtle material** that the sweep does not know matters [4].
6. **Anchoring and family leniency** when an Opus judge edits a Sonnet draft [44].
7. **Drift toward weak sources that rank well** [1], even inside the allowlist.
8. **Cost erosion** from Sonnet's verbosity at high effort, and from second sweeps [18][21].
9. **The shape of the work.** A dossier is one dependent chain that fits in one context: the case where Anthropic measured the solo model ahead every time [2].

Where it could win:
1. It replaces the solo run's undesigned compaction with a designed pack. Designed compression beats naive compression [32], and the solo run currently writes its dossier after compacting.
2. The writing and checking step gets a clean context of about 40k tokens. The supporting evidence comes from older models [27-30]; the size of the effect on Opus 5 is unknown.
3. A separate check catches errors the author misses [41][49].
4. It insures against runs whose cost spirals [2].

## 4. What the evidence pack must contain

The rule: the judge must be able to re-derive every load-bearing fact without trusting the sweep's prose, and must be able to see what is missing.

1. **Coverage map.** Each question in the brief, and each data need the storyboard will draw, mapped to record IDs or marked "not found".
2. **One record per extract**, containing:
   - an ID and the claim in normalised form;
   - the value, unit, date and vintage;
   - the verbatim snippet: the sentence or table row, plus one sentence either side, never a paraphrase;
   - the canonical URL and the fetch time;
   - the publisher and its allowlist tier;
   - the location inside the source (page, section, table, row);
   - whether it is the primary anchor or a report of one;
   - how it was reached (the query, or the chain of links);
   - the sweep's confidence.
3. **Unresolved conflicts.** Every disagreement between sources, with both snippets side by side and their dates. The sweep does not decide between them.
4. **Negative results:**
   - the queries run, and why results were rejected;
   - failed fetches (403, oversize PDF, paywall);
   - primary sources that were sought and not found;
   - any source from outside the allowlist, and why it was used.
5. **Raw page store.** The full text of every fetched page, saved to disk under its ID, outside the judge's context and loadable on request.
6. **Tables verbatim.** Full rows, units and footnotes for anything a graphic will draw.
7. **Quotes verbatim.** Speaker, venue, date, and the primary-record link. Where the quote cannot be matched to the record, attribute it to the outlet under the quote-attribution fallback.
8. **The sweep's own interpretations** in a separate, labelled section, never mixed into the records.
9. **Size.** The judge's view (coverage map, records, conflicts, negative results) fits inside about 40k tokens. Everything else is reached by ID.

The process around the pack. The evidence supports each step; not all of them have been tested directly.
- Give the judge `web_fetch` for load-bearing anchors, or let it ask back to the same sweep thread. A fresh second sweep adds another handoff [11][47][48].
- Have the judge write the dossier from the pack and use the sweep's draft only as an index. This should limit anchoring and family leniency; it is an inference from [43][44] and untested.
- Run the sweep at its default effort, not low [2].
- Give the judge concrete acceptance criteria: every load-bearing fact has a verbatim primary anchor, or is marked [UNVERIFIED] [5].

## 5. Run these first: they may make the split unnecessary

1. **Effort sweep on today's researcher.** Try Opus 5 at medium, then at low. This is Anthropic's first step. On its research benchmarks (measured on Fable 5), low effort cost 1 to 3 points for a third to a half off [2]. The local cost plan already lists effort: medium as lever 7 (`docs/COST-PLAN.md`).
2. **Opus 5.5 at medium.** It costs $4 / $20, and its $0.20 cache reads cost the same as Sonnet 5's [3]. It is Anthropic's default recommendation for agent workloads [2]. Research-benchmark numbers for Opus 5.5: NOT FOUND.
3. **An evidence pack on the solo run.** Have today's Opus researcher write the pack to a file as it goes, and write the dossier after re-reading it. This isolates the benefit of a designed handoff from the model change. An Opus sweep followed by an Opus judge is the clean control.

**Illustrative arithmetic.** This is my arithmetic from list prices and the measured $7.40 per run; these are not published figures.
- **Same token profile on Sonnet 5:** $7.40 / 2.5 = $2.96 for the sweep. The judge, at 40k tokens in and 20k to 40k out on Opus 5, costs $0.70 to $1.20. A second sweep at 10 to 30% of a sweep costs $0.30 to $0.89. Total: $3.96 to $5.05, which is **32 to 46% below today**.
- **Sonnet runs the shorter loop that DeepResearch Bench II implies** (about 18% of Opus's cost per task): total $2.15 to $2.92, **61 to 71% below today**. This is also the low-coverage scenario.
- **Sonnet uses twice the tokens:** the sweep alone costs $5.92, and the total comes to about $6.90 to $8.00: **break-even or worse**.
- **Opus 5 at lower effort**, extrapolating Fable 5's research pattern (not measured on Opus 5): $5.18 to $6.44 at medium, $3.70 to $4.93 at low. The split's likely cost range overlaps the low-effort range.
- **Local note.** The cost plan measured web pages at 7.6% of the researcher's reads (`docs/COST-PLAN.md`). The page-reading arbitrage the cookbook relies on is therefore small here. Any saving would come from the 2.5x token price on everything, not from offloading the reading.

If the split is built, it belongs to the API-CLI route. `CLAUDE.md` pins every phase to Opus on the Claude Code route.

## 6. What to measure on the first real run

Design:
- Put the same 2 or 3 candidates through each arm:
  - **A:** today's Opus 5 run.
  - **B:** Opus 5 at medium, or Opus 5.5 at medium.
  - **C:** the split.
  - **D** (if the budget allows): an Opus sweep followed by an Opus judge, which separates the effect of the structure from the effect of the model.
- Include one candidate that re-researches a published topic containing a known trap from the Phase 6 corrections (for example the three-laws count, the minister's quote, or the tipping-point branch). That gives a ground truth.
- Score blind with Anthropic's rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency), as one 0.0 to 1.0 call with a pass/fail grade [1] and the arm labels hidden. Every arm is a Claude model, so the operator's own blind read breaks ties.

Measures:
1. **Cost by phase** (sweep, judge, second sweep): dollars, turns, output tokens, cache-read share, compaction events and wall-clock time. Record the worst run as well as the mean [2].
2. **Coverage:**
   - load-bearing facts per dossier;
   - the fact-level difference between arms (found by A but not C, and the reverse);
   - distinct primary sources, publishers and allowlist tiers;
   - the diversity floor: at least 8 sources from at least 5 publishers, none above 40%.
3. **Anchor rate.** The share of load-bearing facts with a verbatim primary anchor that contains the exact number, date or quote.
4. **Accuracy.** A blind audit of 20 random facts per dossier against their sources, counting wrong values, wrong dates, stale vintages and misattributed quotes.
5. **Discrepancies.** Known traps caught by each arm, disagreements flagged, and the precision of the [UNVERIFIED] flags.
6. **Handoff loss (split only).** Take 10 raw pages the sweep fetched, list the facts on each that matter to the brief, and count how many reached the pack. Count second-sweep requests and whether each was answered.
7. **Judge behaviour:**
   - the context actually used, against the 40k target;
   - the share of dossier claims that cite a record ID;
   - how far the dossier departs from the sweep's draft;
   - a leniency test: seed 2 or 3 deliberately wrong records into the pack and check they are caught.
8. **Downstream effects.** Whether the storyboard can fill every graphic's DATA line from the dossier, the panel verdict, the verifier's counts of untraced and incorrect claims, and the operator's review time.

The decision rule the evidence supports: adopt the split only if, at lower cost, it matches or beats the better of A and B (not merely A) on coverage and accuracy, within noise.

## 7. NOT FOUND

- A published head-to-head of a cheap sequential sweep plus a frontier single-shot judge against the frontier model alone, on research dossiers.
- The "3 to 7 points" figure on the live docs page.
- Any quality comparison in the coordinator cookbook.
- DeepResearch Bench II scores by dimension (recall, analysis, presentation) for Sonnet 5 and Opus 5.
- MRCR, GraphWalks, tau2-bench or DeepSearchQA figures for Opus 5 or Sonnet 5.
- Research-benchmark figures for Opus 5.5.
- The size of long-context degradation for Opus 5 at 170k to 184k tokens.
- Evidence on whether same-family bias affects claim-against-evidence checking.

## Sources

First-party (Anthropic)
1. How we built our multi-agent research system (13 Jun 2025): https://www.anthropic.com/engineering/multi-agent-research-system
2. Optimizing for cost and intelligence (Claude Platform Docs; undated, read 2026-09-27): https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence
3. Pricing (Claude Platform Docs): https://platform.claude.com/docs/en/about-claude/pricing
4. Cookbook, Coordinator pattern: big models for planning, small models for execution: https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_plan_big_execute_small.ipynb
5. Building multi-agent systems: when and how to use them (23 Jan 2026): https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
6. Effective context engineering for AI agents (29 Sep 2025): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
7. Managing context on the Claude Developer Platform (29 Sep 2025): https://claude.com/blog/context-management
8. Effective harnesses for long-running agents (26 Nov 2025): https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
9. Introducing Claude Sonnet 5 (30 Jun 2026): https://www.anthropic.com/news/claude-sonnet-5
10. Introducing Claude Opus 5 (24 Jul 2026): https://www.anthropic.com/news/claude-opus-5
11. Multiagent orchestration (Managed Agents docs): https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration
12. Introducing Citations on the Anthropic API: https://claude.com/blog/introducing-citations-api
13. Prompt engineering for Claude's long context window (23 Sep 2023): https://www.anthropic.com/news/prompting-long-context
14. Claude Opus 5 System Card (PDF, not opened, over 10 MB): https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf ; BrowseComp figure read via mirror: https://www.alphaxiv.org/abs/2607.claude-opus-5
15. Claude Sonnet 5 System Card (PDF, not opened, over 10 MB): https://www-cdn.anthropic.com/283ef97c476cf442c91d9a37d5b214242a55bb92/Claude%20Sonnet%205%20System%20Card.pdf

Third-party model data
16. Steel BrowseComp leaderboard (cites the system cards): https://leaderboard.steel.dev/leaderboards/browsecomp.md
17. BenchLM, Opus 5 vs Sonnet 5 (aggregator): https://benchlm.ai/compare/claude-opus-5-vs-claude-sonnet-5
18. Artificial Analysis, Opus 5 (low) vs Sonnet 5 (max): https://artificialanalysis.ai/models/comparisons/claude-opus-5-low-vs-claude-sonnet-5
19. Artificial Analysis, Claude Opus 5 (max): https://artificialanalysis.ai/models/claude-opus-5
20. Artificial Analysis, Claude Sonnet 5 (max): https://artificialanalysis.ai/models/claude-sonnet-5
21. Artificial Analysis, Claude Sonnet 5: strong agentic performance at a higher cost per task (30 Jun 2026): https://artificialanalysis.ai/articles/claude-sonnet-5-agentic-cost
22. Artificial Analysis, AA-Omniscience: https://artificialanalysis.ai/evaluations/omniscience
23. Vellum, Claude Sonnet 5 Benchmarks Explained: https://www.vellum.ai/blog/claude-sonnet-5-benchmarks-explained
24. The Decoder, Anthropic's fix for Fable 5's high cost (8 Jul 2026): https://the-decoder.com/anthropics-fix-for-fable-5s-high-cost-is-turning-it-into-a-manager-that-delegates-to-sonnet-5/
25. GitHub issue quoting an earlier revision of [2] (4 Sep 2026): https://github.com/philippe-ths/ai-coding-workflow/issues/260

Papers and reports
26. DeepResearch Bench II (Li et al., 2026): https://arxiv.org/abs/2601.08536
27. Context Rot (Chroma; Hong, Troynikov, Huber; 14 Jul 2025): https://www.trychroma.com/research/context-rot
28. Lost in the Middle (Liu et al., TACL): https://arxiv.org/abs/2307.03172
29. NoLiMa (Modarressi et al., ICML 2025): https://arxiv.org/abs/2502.05167
30. RULER (Hsieh et al., COLM 2024): https://arxiv.org/abs/2404.06654
31. The Complexity Trap (Lindenbauer et al., 2025): https://arxiv.org/abs/2508.21433
32. ACON (Kang et al., ICML 2026): https://arxiv.org/abs/2510.00615
33. FrugalGPT (Chen, Zaharia, Zou, 2023): https://arxiv.org/abs/2305.05176
34. LLM Cascades with Mixture of Thoughts (Yue et al., ICLR 2024): https://arxiv.org/abs/2310.03094
35. RouteLLM (Ong et al., 2024): https://arxiv.org/abs/2406.18665
36. Minions (Narayan et al., 2025): https://arxiv.org/abs/2502.15964
37. Chain of Agents (Zhang et al., 2024): https://arxiv.org/abs/2406.02818
38. ReWOO (Xu et al., 2023): https://arxiv.org/abs/2305.18323
39. Rethinking Mixture-of-Agents / Self-MoA (Li et al., 2025): https://arxiv.org/abs/2502.00674
40. ArcticSwarm (Yoon et al., preprint, 1 Sep 2026): https://arxiv.org/abs/2609.01870
41. Why Do Multi-Agent LLM Systems Fail? / MAST (Cemri et al., v3 Oct 2025): https://arxiv.org/abs/2503.13657
42. Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023): https://arxiv.org/abs/2306.05685
43. LLM Evaluators Recognize and Favor Their Own Generations (Panickssery, Bowman, Feng, 2024): https://arxiv.org/abs/2404.13076
44. Play Favorites (Spiliopoulou et al., 2025): https://arxiv.org/abs/2508.06709
45. Who Judges Matters (Awuni et al., preprint, 15 Sep 2026): https://arxiv.org/abs/2609.17857
46. Replacing Judges with Juries / PoLL (Verga et al., 2024): https://arxiv.org/abs/2404.18796
47. Large Language Models Cannot Self-Correct Reasoning Yet (Huang et al., ICLR 2024): https://arxiv.org/abs/2310.01798
48. GPT-4 Doesn't Know It's Wrong (Stechly, Marquez, Kambhampati, 2023): https://arxiv.org/abs/2310.12397
49. Self-Correction Bench (Tsui, COLM 2026): https://arxiv.org/abs/2507.02778
50. Long-form factuality in large language models / SAFE (Wei et al., NeurIPS 2024): https://arxiv.org/abs/2403.18802
51. LLMxMapReduce (Zhou et al., 2024): https://arxiv.org/abs/2410.09342
52. Summary of a Haystack (Laban et al., 2024): https://arxiv.org/abs/2407.01370
53. FABLES (Kim et al., COLM 2024): https://arxiv.org/abs/2404.01261
54. DeepTRACE (Venkit et al., ICLR 2026): https://arxiv.org/abs/2509.04499
55. Data extraction for evidence synthesis using a large language model (Gartlehner et al., Research Synthesis Methods 2024; doi 10.1002/jrsm.1710): https://www.rti.org/publication/data-extraction-evidence-synthesis-using-large-language-model-proof-concept-study
56. Don't Build Multi-Agents (Walden Yan, Cognition, 12 Jun 2025): https://cognition.com/blog/dont-build-multi-agents

Local (the operator's own measurements, not web evidence): `D:\SideProjects\parallax\docs\COST-PLAN.md`, which records web pages as 7.6% of the researcher's reads and effort: medium as lever 7.
