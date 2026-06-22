# Sports — source allowlist

Tiered, viewpoint-tagged allowlist for the **sports** topic (football primary,
cricket strong, India where relevant). Reads against `_TAXONOMY.md` — see it for
the tier definitions, the per-source field format, the vetting rubric, and the
diversity gate. The list both **gates** what Parallax will cite and configures
the RAG corpus (`ingest` controls quoting, not just citation).

**Viewpoint clusters for sports** (apply to T3/T4/T7 interpretation sources;
T0/T1/T2 empirical/primary/data = `viewpoint: n/a`). Diversity here is
**analytical school, not ideology**:

- `analytics` — data / xG / model-driven (StatsBomb, ASA, opta analyst)
- `traditional-tactical` — practitioner / formation / eye-test tactical reading
- `business-finance` — club accounts, valuations, governance economics
- `primary` — official statistics / governing-body reporting

**Ingest note (licence drift).** FBref lost its Opta licence Jan 2026 → it is
`ingest: metadata`, `cadence: archival`. StatsBomb open-data is free for research
**with attribution** (logo + "data source: StatsBomb"); treated as `full`.
Cricsheet is freely downloadable but carries no named open licence → `metadata`.
Books are `metadata` unless verified open/PD. Paywalled outlets → `metadata` /
`live`. When unsure, `metadata`.

**Last updated 2026-06-21.**

---

## T0 — Primary documents / official data

- **UEFA — Club Licensing Benchmarking / Finance & Investment Landscape** — https://ecfil.uefa.com/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: the authoritative review of European club football finances; >700 clubs, 55-country KPI tables, revenue/wage/loss trends, FFP impact
- **Premier League — Official Statistics** — https://www.premierleague.com/en/stats — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: official Opta-collected player/club stats; canonical figures for the league (goals, assists, clean sheets, advanced metrics)
- **ESPNcricinfo — Statsguru** — https://stats.espncricinfo.com/ci/engine/stats/index.html — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: the definitive queryable cricket-statistics database; build record tables across formats, eras, players, teams (Tests, ODIs, T20Is, IPL)
- **ICC — International Cricket Council (official)** — https://www.icc-cricket.com/ — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: governing-body rankings, rulings, World Test Championship standings, member structure, official competition records
- **All India Football Federation (AIFF) — official** — https://www.the-aiff.com/ — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: Indian football governing body; competition structure (ISL, I-League), regulations, national-team records
- **Indian Super League — official** — https://www.indiansuperleague.com/ — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: ISL schedules, live scores, club + player stats, season records — primary source for Indian top-flight football data
- **Court of Arbitration for Sport (CAS/TAS) — Jurisprudence database** — https://www.tas-cas.org/en/jurisprudence/archive.html — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: published arbitral awards in sport disputes (doping, transfers, governance, eligibility) — the primary legal record
- **World Anti-Doping Agency (WADA) — official** — https://www.wada-ama.org/en — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: anti-doping code, testing figures, sanction lists, prohibited-substance list and annual statistics

## T1 — Datasets / data portals

- **StatsBomb Open Data (GitHub)** — https://github.com/statsbomb/open-data — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: free event + StatsBomb 360 freeze-frame JSON for selected competitions (WC, women's, historic) — the citable open spine for event-level football analysis. Attribution required (logo + "data source: StatsBomb")
- **Understat — xG / shot data** — https://understat.com/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: per-shot expected-goals + xA for the top-five European leagues; team/player xG-vs-actual over/under-performance
- **FBref — Football Statistics (Sports Reference)** — https://fbref.com/en/ — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: deep per-match/season/career tables incl. advanced metrics, top-5 leagues + WSL + internationals. NOTE: lost the Opta licence Jan 2026 → metadata/archival; verify currency before citing live figures
- **Cricsheet — ball-by-ball cricket data** — https://cricsheet.org/ — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: structured ball-by-ball data for Tests/ODIs/T20Is + T20 leagues (incl. IPL); the only open ball-by-ball cricket source. No named open licence → metadata-guide, cite the original
- **Transfermarkt — market values + transfers** — https://www.transfermarkt.com/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: crowd-derived player market values + transfer-fee records; useful as a directional dataset, NOT an audited valuation (community-estimated, label as such)
- **FiveThirtyEight — Soccer Power Index (SPI) data** — https://github.com/fivethirtyeight/data/tree/master/soccer-spi — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: open CSV club ratings + match forecasts back to 2016 (xG-based off/def ratings). Archival — the public SPI feed is no longer updated; cite as a historical dataset

## T2 — Peer-reviewed & preprints

- **"Expected goals in football: Improving model performance and demonstrating value" (PLOS ONE, 2023)** — https://pmc.ncbi.nlm.nih.gov/articles/PMC10075453/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: peer-reviewed xG methodology + validation (Mead, O'Hare, McMenemy, Univ. of Stirling); CC BY 4.0 — quotable on what xG measures and its limits
- **"Explainable expected goal models for performance analysis in football analytics" (arXiv 2206.07212)** — https://arxiv.org/abs/2206.07212 — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: interpretable/SHAP xG modelling; what drives a shot's goal probability — good mechanism source for explainer prose
- **"Bayes-xG: Player and Position Correction on Expected Goals using Bayesian Hierarchical Approach" (arXiv 2311.13707)** — https://arxiv.org/pdf/2311.13707 — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: how player/position priors shift xG; the statistical caveats behind single-number xG comparisons
- **"Toward interpretable expected goals modeling using Bayesian mixed models" (Frontiers in Sports & Active Living, 2025)** — https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1504362/full — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: recent peer-reviewed treatment of xG uncertainty + interpretability (open access)
- **"The Credibility of the Court of Arbitration for Sport" (Harvard Journal of Sports & Entertainment Law)** — https://journals.law.harvard.edu/jsel/wp-content/uploads/sites/78/2022/09/HLS205.pdf — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: scholarly analysis of CAS independence + governance — anchor for any sport-law / arbitration issue

## T3 — Think-tanks / research institutes / advisory data shops

- **Deloitte — Football Money League** — https://www.deloitte.com/uk/en/services/consulting-financial/analysis/deloitte-football-money-league.html — tier: T3 · access: open · ingest: metadata · viewpoint: business-finance · cadence: annual — focus: annual revenue ranking of the highest-earning clubs (matchday/broadcast/commercial split); the standard club-revenue benchmark
- **Deloitte — Annual Review of Football Finance** — https://www.deloitte.com/uk/en/services/consulting-financial/analysis/annual-review-of-football-finance-europe.html — tier: T3 · access: open · ingest: metadata · viewpoint: business-finance · cadence: annual — focus: macro view of the European football market — Premier League + "big five" revenue, wages-to-revenue, broadcast value
- **KPMG Football Benchmark** — https://footballbenchmark.com/home — tier: T3 · access: reg · ingest: metadata · viewpoint: business-finance · cadence: annual — focus: club enterprise-value estimates + operational/commercial benchmarking ("The European Elite" valuation report)
- **CIES Football Observatory** — https://football-observatory.com/ — tier: T3 · access: open · ingest: metadata · viewpoint: analytics · cadence: weekly — focus: academic-affiliated player-valuation models, demographic + performance studies, transfer-market research (Neuchâtel)
- **Play the Game — sports governance** — https://www.playthegame.org/ — tier: T3 · access: open · ingest: metadata · viewpoint: business-finance · cadence: weekly — focus: independent (Danish institute) investigations into sport governance, integrity, mega-event finance — critical-governance angle

## T4 — Long-form journalism

- **The Athletic (NYT)** — https://www.nytimes.com/athletic/ — tier: T4 · access: paywall · ingest: metadata · viewpoint: traditional-tactical · cadence: live — focus: tactical breakdowns (Michael Cox et al.), club-finance reporting, deep features; lead-finding + framing, not a primary anchor
- **The Guardian — Football** — https://www.theguardian.com/football — tier: T4 · access: open · ingest: live · viewpoint: traditional-tactical · cadence: live — focus: news + opinion + Sid Lowe / tactical writing; reliable reporting, centre-left framing
- **ESPNcricinfo — editorial** — https://www.espncricinfo.com/ — tier: T4 · access: open · ingest: live · viewpoint: traditional-tactical · cadence: live — focus: cricket news, match analysis, features (distinct from the Statsguru T0 dataset); the dominant cricket newsroom
- **The Cricket Monthly** — https://www.thecricketmonthly.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: traditional-tactical · cadence: weekly — focus: long-form cricket essays + analysis pieces — depth, history, structural reads
- **The Cricketer** — https://www.thecricketer.com/ — tier: T4 · access: reg · ingest: metadata · viewpoint: traditional-tactical · cadence: weekly — focus: established cricket magazine reporting + comment (UK)
- **Off The Pitch** — https://offthepitch.com/ — tier: T4 · access: paywall · ingest: metadata · viewpoint: business-finance · cadence: weekly — focus: football governance, transfers, club-ownership and money reporting — specialist business-of-football newsroom
- **Sportstar (The Hindu)** — https://sportstar.thehindu.com/ — tier: T4 · access: open · ingest: live · viewpoint: traditional-tactical · cadence: live — focus: long-running Indian sport magazine; cricket + football + Olympic-sport reporting with an India lens
- **Scroll.in — Field** — https://scroll.in/field — tier: T4 · access: open · ingest: live · viewpoint: business-finance · cadence: weekly — focus: Indian sport analysis with a structural/governance bent (federation politics, athlete welfare, funding)
- **The Guardian — Sport (business/governance)** — https://www.theguardian.com/sport — tier: T4 · access: open · ingest: live · viewpoint: business-finance · cadence: live — focus: sportswashing, ownership, regulation and mega-event investigations — critical business-of-sport reporting
- **The New York Times — Sports** — https://www.nytimes.com/section/sports — tier: T4 · access: paywall · ingest: metadata · viewpoint: traditional-tactical · cadence: live — focus: investigative + feature sports journalism, US + global; framing and leads

## T5 — Books / reference

- **"Soccernomics" — Simon Kuper & Stefan Szymanski** — https://www.hachettebookgroup.com/titles/simon-kuper/soccernomics-2026-world-cup-edition/9781645030812/ — tier: T5 · access: paywall · ingest: metadata · viewpoint: business-finance · cadence: archival — focus: economics-of-football canon (wages predict league position, the inefficient transfer market); cite the legally-accessed text
- **"The Numbers Game: Why Everything You Know About Soccer Is Wrong" — Chris Anderson & David Sally** — https://www.penguinrandomhouse.com/books/314351/the-numbers-game-by-chris-anderson-and-david-sally/ — tier: T5 · access: paywall · ingest: metadata · viewpoint: analytics · cadence: archival — focus: foundational football-analytics popularisation (value of corners, weak-link vs strong-link); metadata-guide only
- **"Inverting the Pyramid: The History of Football Tactics" — Jonathan Wilson** — https://www.hachettebookgroup.com/titles/jonathan-wilson/inverting-the-pyramid/9781645030522/ — tier: T5 · access: paywall · ingest: metadata · viewpoint: traditional-tactical · cadence: archival — focus: the definitive tactical-history reference (formation evolution 2-3-5 → modern); metadata-guide, quote the original

## T6 — Case-study / postmortem / inquiry reports

- **Report of the Hillsborough Independent Panel (2012)** — https://assets.publishing.service.gov.uk/media/5a7c9e4840f0b65b3de0a0ff/0581.pdf — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: official UK government inquiry into the 1989 stadium disaster — the worked case on crowd safety, institutional failure, and decades-long cover-up
- **The Taylor Report — Hillsborough Stadium Disaster Inquiry (National Archives)** — https://discovery.nationalarchives.gov.uk/details/c/F265146 — tier: T6 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: the 1989–90 Taylor Inquiry that mandated all-seater stadiums — the primary stadium-safety reform record
- **Report of the Supreme Court Committee on Reforms in Cricket (Lodha Committee, 2016)** — https://gujaratcricketassociation.com/wp-content/uploads/2020/01/Lodha_Committee_Report.pdf — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: the Supreme Court-ordered BCCI governance overhaul (one-state-one-vote, age/tenure caps, players' association) — the India sports-governance case study
- **ESPNcricinfo — BCCI / Lodha reforms timeline** — https://www.espncricinfo.com/story/_/id/16616908/a-line-bcci-lodha-committee-reforms-case-supreme-court-india — tier: T6 · access: open · ingest: live · viewpoint: n/a · cadence: archival — focus: documented chronology of the BCCI-Lodha case — sequenced events for reconstructing the reform fight
- **The Impact of the Lodha Committee BCCI Report (LawInSport)** — https://www.lawinsport.com/topics/item/the-impact-of-the-lodha-committee-bcci-report-on-sports-governance-in-india — tier: T6 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: legal-analysis case study of the Lodha reforms' governance consequences
- **LawInSport — sport-law cases + analysis** — https://www.lawinsport.com/ — tier: T6 · access: reg · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: documented case analyses (CAS awards, doping, FFP/PSR disputes, governance) — the case-repository for sport-law postmortems

## T7 — Named expert blogs / newsletters / data shops

- **The Swiss Ramble (Kieron O'Connor)** — https://swissramble.substack.com/ — tier: T7 · access: open · ingest: metadata · viewpoint: business-finance · cadence: weekly — focus: forensic club-by-club reading of published football accounts (revenue, wages, FFP/PSR, debt) — the standard for club-finance explainers
- **StatsBomb — articles / blog** — https://statsbomb.com/articles/ — tier: T7 · access: open · ingest: metadata · viewpoint: analytics · cadence: weekly — focus: methodology + applied analysis from the data provider (xG model design, OBV, radars) — quote their method writing, anchor figures to the open data (T1)
- **StatsBomb Blog Archive** — https://blogarchive.statsbomb.com/articles/soccer/ — tier: T7 · access: open · ingest: metadata · viewpoint: analytics · cadence: archival — focus: the foundational analytics essays (xG history, radars, reading-analytics guides) — canonical explainer references
- **Opta Analyst (Stats Perform)** — https://theanalyst.com/ — tier: T7 · access: open · ingest: live · viewpoint: analytics · cadence: live — focus: data-driven storytelling from the Opta team — supercomputer forecasts, tactical + statistical breakdowns across football and cricket
- **Tifo Football / Tifo IRL** — https://tifofootball.com/ — tier: T7 · access: open · ingest: metadata · viewpoint: traditional-tactical · cadence: weekly — focus: accessible explainers on tactics, structures and the business of football — explainer-craft reference
- **The Coaches' Voice** — https://www.coachesvoice.com/cv/ — tier: T7 · access: open · ingest: metadata · viewpoint: traditional-tactical · cadence: weekly — focus: first-person tactical analysis from practising coaches/managers — the practitioner eye-test angle
- **American Soccer Analysis (ASA)** — https://www.americansocceranalysis.com/ — tier: T7 · access: open · ingest: live · viewpoint: analytics · cadence: weekly — focus: open, transparent-methodology football analytics (g+, xG models, public data) — a named-author analytics shop with documented methods
- **CricViz** — https://cricviz.com/ — tier: T7 · access: open · ingest: metadata · viewpoint: analytics · cadence: weekly — focus: cricket data + predictive models (expected wickets/runs, win prediction, ball-tracking analysis) — the leading cricket-analytics shop
- **Cricmetric** — https://www.cricmetric.com/ — tier: T7 · access: open · ingest: live · viewpoint: analytics · cadence: live — focus: cricket advanced metrics + player-matchup tools (Win Probability Added, Runs Above Average) — quantitative cricket analysis
- **Forbes — SportsMoney** — https://www.forbes.com/sportsmoney/ — tier: T7 · access: reg · ingest: metadata · viewpoint: business-finance · cadence: weekly — focus: franchise/club valuations + business-of-sport commentary; valuations are estimates — label as such, cross-check against Deloitte/UEFA

## WebFetch domains to allow in .claude/settings.local.json

```
ecfil.uefa.com
premierleague.com
stats.espncricinfo.com
icc-cricket.com
the-aiff.com
indiansuperleague.com
tas-cas.org
wada-ama.org
github.com
understat.com
fbref.com
cricsheet.org
transfermarkt.com
pmc.ncbi.nlm.nih.gov
arxiv.org
frontiersin.org
journals.law.harvard.edu
deloitte.com
footballbenchmark.com
football-observatory.com
playthegame.org
nytimes.com
theguardian.com
espncricinfo.com
thecricketmonthly.com
thecricketer.com
offthepitch.com
sportstar.thehindu.com
scroll.in
hachettebookgroup.com
penguinrandomhouse.com
assets.publishing.service.gov.uk
discovery.nationalarchives.gov.uk
gujaratcricketassociation.com
lawinsport.com
swissramble.substack.com
statsbomb.com
blogarchive.statsbomb.com
theanalyst.com
tifofootball.com
coachesvoice.com
americansocceranalysis.com
cricviz.com
cricmetric.com
forbes.com
```
