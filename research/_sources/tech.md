# Tech — source allowlist

Tiered, viewpoint-tagged allowlist for the **tech** topic (AI/ML, compute,
platforms, infrastructure, governance). Schema + vetting rubric live in
`_TAXONOMY.md`; read it before editing. The spine is primary docs (T0),
datasets/benchmarks (T1), peer-reviewed work (T2), and postmortems/incident
DBs (T6) — these are `ingest: full` and the citable backbone. The
interpretation layer (T3/T4/T7) is tagged by **viewpoint cluster** for balance.

**Viewpoint clusters (tech)** — anchor each to institute mission + author
affiliation:
- `accelerationist` — pro-capability/pro-deployment, growth framing.
- `safety-governance` — risk, evaluation, regulation, alignment framing.
- `labor-society` — critical / worker / consumer / civil-society framing.
- `industry-vendor` — first-party labs/vendors (their own research/claims).
- `primary` — papers, benchmarks, official data (empirical; T0/T1/T2 only).

> **Diversity gate (per `_TAXONOMY.md` §5):** a candidate needs ≥3 sources
> across ≥2 clusters on the interpretation layer **and** ≥1 T0/T1/T2 anchor.
> On settled empirical questions (a benchmark score, a chip's FLOP/s) the
> anchor carries the fact; viewpoint balance applies only to "what it means".

---

## T0 — Primary documents / official data

- **NIST AI Risk Management Framework** — https://www.nist.gov/itl/ai-risk-management-framework — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: the US voluntary trustworthy-AI framework + Generative AI Profile + playbook; canonical risk taxonomy.
- **EU AI Act (artificialintelligenceact.eu portal)** — https://artificialintelligenceact.eu/the-act/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: Regulation (EU) 2024/1689 full text + AI Act Explorer + implementation timeline; risk tiers, obligations.
- **EUR-Lex — official EU legal texts** — https://eur-lex.europa.eu/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: authoritative Official Journal text of the AI Act and related EU digital regulation (DSA, DMA, GDPR).
- **US White House — Executive Orders & OSTP AI actions** — https://www.whitehouse.gov/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: federal AI executive orders, OSTP guidance, official policy announcements.
- **UK AI Security Institute (AISI)** — https://www.aisi.gov.uk/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: government frontier-model evaluations, Frontier AI Trends report, pre-deployment testing results.
- **OECD AI Policy Observatory (OECD.AI)** — https://oecd.ai/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: national AI strategies, policy database, the OECD AI Principles, live policy tracker.
- **US Copyright Office — AI policy & reports** — https://www.copyright.gov/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: official US position on AI training, authorship, and generative-AI copyright (the AI report series).
- **FTC — technology & AI enforcement** — https://www.ftc.gov/news-events/topics/protecting-consumers/protecting-consumers-technology — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: consumer-protection actions, dark-patterns/AI-claims enforcement, official complaints and orders.

## T1 — Datasets / data portals / benchmarks

- **Epoch AI — Data** — https://epoch.ai/data — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: CC-BY databases — 3,500+ ML models, training compute, hardware, GPU clusters, data-center build-out, chip sales; the compute-trends spine.
- **Our World in Data — Artificial Intelligence** — https://ourworldindata.org/artificial-intelligence — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: CC-BY charts/data — training compute, parameters, investment, adoption, capability-vs-human benchmarks; reusable viz data.
- **Stanford HAI — AI Index Report** — https://hai.stanford.edu/ai-index — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: the annual state-of-AI metrics report (R&D, technical performance, economy, policy, public opinion); downloadable data.
- **MLCommons — MLPerf benchmarks** — https://mlcommons.org/benchmarks/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: standardized training/inference/storage benchmark results across hardware; the system-performance reference.
- **Stanford CRFM — HELM** — https://crfm.stanford.edu/helm/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: holistic, reproducible LM evaluation across scenarios/metrics with full transparency; rankings + raw runs.
- **LMArena (Chatbot Arena leaderboard)** — https://arena.ai/ — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: crowdsourced human-preference Elo rankings of frontier LLMs; cite the leaderboard + version, not scraped prompts.
- **Hugging Face — Datasets & model hub** — https://huggingface.co/datasets — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: dataset/model cards, licences, download/usage signals; per-artifact licence governs reuse, so index metadata.
- **Stack Overflow — Developer Survey** — https://survey.stackoverflow.co/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: large annual developer survey — tool adoption, AI-coding-tool usage, sentiment; open results + raw data.

## T2 — Peer-reviewed & preprints

- **arXiv — cs.LG (Machine Learning)** — https://arxiv.org/list/cs.LG/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: primary ML preprints; the mechanism + evidence layer (arXiv non-exclusive licence ⇒ abstracts/metadata always, many full PDFs open).
- **arXiv — cs.AI (Artificial Intelligence)** — https://arxiv.org/list/cs.AI/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: AI methods/agents/reasoning preprints; pair with cs.LG for the technical spine.
- **arXiv — cs.CL (Computation & Language)** — https://arxiv.org/list/cs.CL/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: NLP / LLM papers (training, evaluation, alignment methods).
- **arXiv — cs.CY (Computers & Society)** — https://arxiv.org/list/cs.CY/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: AI ethics, governance, fairness, societal-impact peer-track preprints; bridges into the labor-society layer with evidence.
- **ACM Digital Library** — https://dl.acm.org/ — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: FAccT / CHI / systems-conference papers; quote the legally-accessed original, index metadata only.
- **OpenReview (NeurIPS / ICLR / ICML)** — https://openreview.net/ — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: peer reviews + camera-ready papers for the top ML venues; reviewer signal on what's load-bearing.
- **Journal of Machine Learning Research (JMLR)** — https://www.jmlr.org/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: open-access, fully peer-reviewed ML journal; durable methods references.
- **Distill** — https://distill.pub/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: CC-BY interactive ML explanations (interpretability, feature viz); on hiatus since 2021 but archival-gold for mechanism explainers.

## T3 — Think-tanks / NGOs / research institutes (tagged)

- **CSET (Georgetown, Center for Security & Emerging Tech)** — https://cset.georgetown.edu/publications/ — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: data-driven analysis of AI + national security, compute/semiconductors, China tech policy, translations.
- **Centre for the Governance of AI (GovAI)** — https://www.governance.ai/ — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: AI-governance research agenda, policy briefs, compute governance; rigorous, peer-published.
- **Ada Lovelace Institute** — https://www.adalovelaceinstitute.org/ — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: data + AI for people and society; regulation, public attitudes, biometrics, audit/assurance.
- **AI Now Institute** — https://ainowinstitute.org/ — tier: T3 · access: open · ingest: live · viewpoint: labor-society · cadence: weekly — focus: power/concentration critique of AI, labor, surveillance, antitrust framing; structural-critique lens.
- **Data & Society Research Institute** — https://datasociety.net/ — tier: T3 · access: open · ingest: live · viewpoint: labor-society · cadence: weekly — focus: tech-and-society research — labor, AI & democracy, data centers/justice, algorithmic impact assessment.
- **Mozilla Foundation — research & internet health** — https://foundation.mozilla.org/en/research/ — tier: T3 · access: open · ingest: live · viewpoint: labor-society · cadence: weekly — focus: open-source AI, trustworthy AI, platform accountability, consumer-privacy research.
- **Electronic Frontier Foundation (EFF) — AI & ML** — https://www.eff.org/issues/ai — tier: T3 · access: open · ingest: live · viewpoint: labor-society · cadence: weekly — focus: digital-rights view on AI surveillance, copyright, speech, automated decision-making.
- **RAND — technology & AI policy** — https://www.rand.org/topics/artificial-intelligence.html — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: nonpartisan policy analysis on AI security, compute, military applications, governance.
- **Brookings — AI governance & economy** — https://www.brookings.edu/topic/artificial-intelligence/ — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: centrist AI-policy analysis — regulation, labor markets, geopolitics.
- **AI Index / Stanford HAI — policy & society research** — https://hai.stanford.edu/research — tier: T3 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: foundation-model governance, transparency indexes, policy briefs (the interpretation arm to the T1 AI Index).

## T4 — Long-form journalism

- **Ars Technica — Tech** — https://arstechnica.com/ — tier: T4 · access: open · ingest: live · viewpoint: primary · cadence: live — focus: deep, technically-literate reporting on AI, security, computing; high accuracy, named authorship.
- **IEEE Spectrum** — https://spectrum.ieee.org/ — tier: T4 · access: open · ingest: live · viewpoint: primary · cadence: weekly — focus: engineering magazine — AI, semiconductors, robotics; expert + staff reporting, rigorous standards.
- **MIT Technology Review** — https://www.technologyreview.com/ — tier: T4 · access: paywall · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: AI capability + impact reporting, accountability investigations; quote legally-accessed original.
- **The Verge — Tech** — https://www.theverge.com/tech — tier: T4 · access: open · ingest: live · viewpoint: labor-society · cadence: live — focus: product + platform + policy reporting, consumer/culture lens.
- **Wired — Business & AI** — https://www.wired.com/category/business/ — tier: T4 · access: paywall · ingest: live · viewpoint: labor-society · cadence: weekly — focus: feature reporting on AI industry, labor, society; metadata-index, cite original.
- **The Information** — https://www.theinformation.com/ — tier: T4 · access: paywall · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: inside-the-industry scoops on labs, funding, leadership; closely sourced, paywalled ⇒ live only.
- **Rest of World** — https://restofworld.org/ — tier: T4 · access: open · ingest: live · viewpoint: labor-society · cadence: weekly — focus: technology's impact beyond the West; gig labor, platform power, global-South deployment.
- **The Register** — https://www.theregister.com/ — tier: T4 · access: open · ingest: live · viewpoint: primary · cadence: live — focus: skeptical enterprise-IT and infrastructure reporting; outages, cloud, hardware, vendor claims scrutiny.
- **TechCrunch** — https://techcrunch.com/ — tier: T4 · access: open · ingest: live · viewpoint: accelerationist · cadence: live — focus: startup + funding + product-launch reporting; useful for the deployment/market-hype signal (tag the lean).

## T5 — Books / reference

- **Deep Learning (Goodfellow, Bengio, Courville)** — https://www.deeplearningbook.org/ — tier: T5 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: canonical free-to-read HTML textbook; MIT Press contract forbids copyable redistribution ⇒ metadata, cite the original.
- **Dive into Deep Learning (d2l.ai)** — https://d2l.ai/ — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: open, interactive deep-learning textbook (CC-BY-SA-style open); runnable, adopted by 500+ universities.
- **The Atlas of AI (Kate Crawford)** — https://katecrawford.net/atlas — tier: T5 · access: paywall · ingest: metadata · viewpoint: labor-society · cadence: archival — focus: critical account of AI's material/labor/extraction costs; metadata only, owned-copy quoting.
- **Weapons of Math Destruction (Cathy O'Neil)** — https://www.penguinrandomhouse.com/books/241363/weapons-of-math-destruction-by-cathy-oneil/ — tier: T5 · access: paywall · ingest: metadata · viewpoint: labor-society · cadence: archival — focus: algorithmic-harm framing for inequality + opaque scoring; metadata only, publisher page.

## T6 — Case-study / postmortem / incident repositories

- **AI Incident Database (AIID)** — https://incidentdatabase.ai/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: indexed real-world AI harms/near-harms (autonomous vehicles, model failures, deployment incidents); the canonical incident corpus.
- **AIAAIC Repository** — https://www.aiaaic.org/aiaaic-repository — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: open register of AI, algorithmic & automation incidents and controversies; harms, bias, transparency failures.
- **OECD.AI — AI Incidents Monitor (AIM)** — https://oecd.ai/en/incidents — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: official global AI-incident tracker drawn from news; complements AIID with policy-grade taxonomy.
- **Cloudflare Blog — post-mortems** — https://blog.cloudflare.com/tag/post-mortem/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: transparent outage retrospectives (BGP leaks, KV/R2 failures, DNS, third-party compromise); engineering root-cause writeups.
- **AWS — Post-Event Summaries** — https://aws.amazon.com/premiumsupport/technology/pes/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: official root-cause analyses for major AWS outages; the canonical cloud-failure case studies.
- **Google Cloud — incident history** — https://status.cloud.google.com/summary — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: official incident summaries + retrospectives for GCP outages.
- **The GitHub Blog — Engineering / availability reports** — https://github.blog/category/engineering/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: monthly availability reports + incident retrospectives at platform scale.
- **k8s.af / Kubernetes failure stories** — https://k8s.af/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: curated collection of public Kubernetes/cloud-infra failure postmortems; worked examples of distributed-systems failure modes.
- **ACM Queue** — https://queue.acm.org/ — tier: T6 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: practitioner case studies on real systems engineering at scale; metadata-index, cite original.

## T7 — Named expert blogs / newsletters / data shops

- **Simon Willison's Weblog** — https://simonwillison.net/ — tier: T7 · access: open · ingest: live · viewpoint: primary · cadence: live — focus: hands-on, reproducible LLM/tooling analysis; careful, well-sourced, names what he tested.
- **Stratechery (Ben Thompson)** — https://stratechery.com/ — tier: T7 · access: paywall · ingest: live · viewpoint: accelerationist · cadence: weekly — focus: platform/business strategy analysis of big tech + AI; market/aggregation framing, paywalled.
- **The Pragmatic Engineer (Gergely Orosz)** — https://www.pragmaticengineer.com/ — tier: T7 · access: paywall · ingest: live · viewpoint: primary · cadence: weekly — focus: inside-engineering reporting — incident reviews, eng culture, hiring/layoffs; freemium, cite original.
- **Import AI (Jack Clark)** — https://importai.substack.com/ — tier: T7 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: weekly research-paper digest + policy commentary from an Anthropic co-founder; flag the affiliation.
- **Marcus on AI (Gary Marcus)** — https://garymarcus.substack.com/ — tier: T7 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: skeptic-of-scaling critique of LLM reliability, hype, and governance gaps; deliberately contrarian counterweight.
- **Zvi Mowshowitz — Don't Worry About the Vase** — https://thezvi.substack.com/ — tier: T7 · access: open · ingest: live · viewpoint: safety-governance · cadence: weekly — focus: exhaustive AI-news + alignment roundups; opinionated safety lens, heavily sourced.
- **Semianalysis (Dylan Patel)** — https://www.semianalysis.com/ — tier: T7 · access: paywall · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: deep semiconductor / data-center / compute-economics analysis; the supply-side data shop, partly paywalled.
- **Interconnects (Nathan Lambert)** — https://www.interconnects.ai/ — tier: T7 · access: open · ingest: live · viewpoint: primary · cadence: weekly — focus: technical analysis of open models, RLHF/post-training, evaluation; researcher-authored.
- **Platformer (Casey Newton)** — https://www.platformer.news/ — tier: T7 · access: reg · ingest: live · viewpoint: labor-society · cadence: weekly — focus: tech + platform-policy reporting — trust & safety, moderation, AI governance.
- **Benedict Evans** — https://www.ben-evans.com/ — tier: T7 · access: open · ingest: live · viewpoint: accelerationist · cadence: weekly — focus: tech-market structural analysis, adoption-curve framing; data-driven big-picture essays.

## T0/T1 — Vendor / lab research (industry-vendor primary)

- **OpenAI — Research & Index** — https://openai.com/research/index/ — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: first-party model releases, system cards, capability/safety claims; cite as the vendor's own claim, corroborate externally.
- **Anthropic — Research** — https://www.anthropic.com/research — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: interpretability/alignment/societal-impact papers + model cards; first-party, tag the affiliation.
- **Google DeepMind — Blog & research** — https://deepmind.google/discover/blog/ — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: research announcements, model/system cards, technical reports.
- **Google Research Blog** — https://research.google/blog/ — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: first-party research across ML, systems, responsible AI.
- **Meta AI — Research blog** — https://ai.meta.com/blog/ — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: Llama / open-weights releases, FAIR research, model cards and licences.
- **Microsoft Research Blog** — https://www.microsoft.com/en-us/research/blog/ — tier: T0 · access: open · ingest: live · viewpoint: industry-vendor · cadence: weekly — focus: first-party research across AI, systems, HCI; Copilot/Phi releases.
- **Hugging Face Blog** — https://huggingface.co/blog — tier: T0 · access: open · ingest: full · viewpoint: industry-vendor · cadence: weekly — focus: open-model releases, evaluation writeups, ecosystem trends; mostly CC/open posts.
- **Hugging Face — Papers (daily)** — https://huggingface.co/papers — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: community-curated daily arXiv papers with code links + upvote signal; the successor to Papers with Code as a discovery feed.

---

## WebFetch domains to allow in .claude/settings.local.json

```
nist.gov
artificialintelligenceact.eu
eur-lex.europa.eu
whitehouse.gov
aisi.gov.uk
oecd.ai
copyright.gov
ftc.gov
epoch.ai
ourworldindata.org
hai.stanford.edu
mlcommons.org
crfm.stanford.edu
arena.ai
huggingface.co
survey.stackoverflow.co
arxiv.org
dl.acm.org
openreview.net
jmlr.org
distill.pub
cset.georgetown.edu
governance.ai
adalovelaceinstitute.org
ainowinstitute.org
datasociety.net
foundation.mozilla.org
eff.org
rand.org
brookings.edu
arstechnica.com
spectrum.ieee.org
technologyreview.com
theverge.com
wired.com
theinformation.com
restofworld.org
theregister.com
techcrunch.com
deeplearningbook.org
d2l.ai
katecrawford.net
penguinrandomhouse.com
incidentdatabase.ai
aiaaic.org
aws.amazon.com
status.cloud.google.com
github.blog
k8s.af
queue.acm.org
simonwillison.net
stratechery.com
pragmaticengineer.com
importai.substack.com
garymarcus.substack.com
thezvi.substack.com
semianalysis.com
interconnects.ai
platformer.news
ben-evans.com
openai.com
anthropic.com
deepmind.google
research.google
ai.meta.com
microsoft.com
```
