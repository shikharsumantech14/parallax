# Politics — source allowlist

Tiered, viewpoint-tagged allowlist for the **politics** topic. Indian politics
first; comparative / international second. Read `_TAXONOMY.md` before editing:
8 tiers, the per-source field format, the vetting rubric (admit on ≥2 of
{reliability, provenance, transparency}), and the diversity gate.

**Viewpoint clusters (politics):** `left` · `center` · `right` ·
`intl-comparative` · `primary`. Empirical primary/data/peer-reviewed sources
(T0/T1/T2) carry `viewpoint: n/a` — they hold facts, not stances. Only the
interpretation layer (T3 think-tanks, T4 journalism, T7 named experts) is
tagged and balanced across clusters. Outlet leans anchored to AllSides / MBFC;
institute leans to self-description + scholarship. Cluster ids are grep-stable —
do not rename.

**Line format (grep-stable):**
`- **Name** — <url> — tier: Tn · access: … · ingest: … · viewpoint: … · cadence: … — focus: …`

---

## T0 — Primary documents / official data

- **Lok Sabha (Sansad)** — https://sansad.in/ls — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: debates, vote records, starred/unstarred questions, committee reports
- **Rajya Sabha (Sansad)** — https://sansad.in/rs — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: upper-house debates, divisions, committee reports
- **Election Commission of India** — https://www.eci.gov.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: election results, statistical reports, candidate affidavits, electoral roll data
- **Ministry of Statistics (MoSPI)** — https://www.mospi.gov.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: census, NSS rounds, official socioeconomic statistics
- **Supreme Court of India — Judgments** — https://www.sci.gov.in/judgements-judgement-date/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: constitutional benches, orders, landmark judgment summaries
- **India Code (legislation repository)** — https://www.indiacode.nic.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: bare acts, central + state legislation, amendments
- **Constitution of India (Wikisource)** — https://en.wikisource.org/wiki/Constitution_of_India — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: full constitutional text + amendments, CC BY-SA, quotable
- **Constituent Assembly Debates (CADIndia)** — https://www.constitutionofindia.net/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: 167 days of framing debates (1946–1950), article-by-article history
- **Union Budget of India** — https://www.indiabudget.gov.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: budget documents, Economic Survey, expenditure/receipts
- **Comptroller & Auditor General (CAG)** — https://cag.gov.in/en — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: performance + compliance audits, accountability reports
- **Law Commission of India — Reports** — https://lawcommissionofindia.nic.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: law-reform reports, statutory review recommendations
- **NITI Aayog** — https://niti.gov.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: policy papers, state rankings, SDG/composite indices
- **Ministry of External Affairs (MEA)** — https://www.mea.gov.in/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: bilateral/multilateral documents, treaties, official statements
- **RBI — State Finances: A Study of Budgets** — https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State+Finances+%3A+A+Study+of+Budgets — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: consolidated state fiscal data, deficits, transfers

## T1 — Datasets / data portals

- **PRS Legislative Research** — https://prsindia.org/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: bill tracker, MP attendance/voting, budget briefs, vital stats
- **PRS — Bill Track** — https://prsindia.org/billtrack — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: live status of central bills, summaries, committee scrutiny
- **ADR / MyNeta** — https://adrindia.org/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: candidate affidavits, criminal/asset declarations, party finances, electoral bonds
- **TCPD — Trivedi Centre Data Portal** — https://tcpd.ashoka.edu.in/data/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: TCPD-IED election results (1962–), candidate IDs, SPINPER legislator data
- **Lok Dhaba (TCPD)** — https://lokdhaba.ashoka.edu.in/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: visual archive of Lok Sabha + Vidhan Sabha results since 1962
- **Lokniti-CSDS data unit** — https://www.lokniti.org/ — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: annual — focus: National Election Studies survey archive, voter-behaviour microdata
- **V-Dem Dataset** — https://v-dem.net/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: multidimensional democracy indices, V-Party, country-year series
- **International IDEA — Voter Turnout Database** — https://www.idea.int/data-tools/data/voter-turnout-database — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: comparative turnout, registration, compulsory-voting data
- **Our World in Data — Democracy** — https://ourworldindata.org/democracy — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: long-run democracy/regime indicators, CC BY, quotable
- **World Bank — Worldwide Governance Indicators** — https://data.worldbank.org/topic/public-sector — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: governance, voice-and-accountability, rule-of-law, public-sector series
- **CEDA (Ashoka) Data Portal** — https://ceda.ashoka.edu.in/ — tier: T1 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: cleaned Indian socioeconomic + electoral data visualisations

## T2 — Peer-reviewed & scholarship

- **Economic & Political Weekly** — https://www.epw.in/ — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: peer-reviewed Indian political economy, structural/theoretical analysis
- **EPW Engage** — https://www.epw.in/engage — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: open-access scholarly commentary, data-driven explainers
- **Studies in Indian Politics (SAGE)** — https://journals.sagepub.com/home/inp — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: peer-reviewed empirical work on Indian party systems + elections
- **Pew Research Center — Religion in India** — https://www.pewresearch.org/religion/2021/06/29/religion-in-india-tolerance-and-segregation/ — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: 29,999-respondent survey on religion, identity, attitudes; methodology disclosed
- **SSRN — Political Science / South Asia** — https://www.ssrn.com/index.cfm/en/political-science/ — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: working papers / preprints on governance, elections, institutions

## T3 — Think-tanks / NGOs / research institutes

- **Carnegie India** — https://carnegieendowment.org/india/ — tier: T3 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: political economy, institutions, technology + governance
- **Centre for Policy Research (CPR)** — https://cprindia.org/ — tier: T3 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: governance, law/regulation/state, federalism, urbanisation
- **Observer Research Foundation (ORF)** — https://www.orfonline.org/ — tier: T3 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: foreign policy, security, governance; broad policy spectrum
- **Takshashila Institution** — https://takshashila.org.in/ — tier: T3 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: public policy, statecraft, defence, networked-governance framing
- **Vidhi Centre for Legal Policy** — https://vidhilegalpolicy.in/ — tier: T3 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: legislative drafting, judicial reform, regulatory design
- **PRS — policy briefs/analysis layer** — https://prsindia.org/policy — tier: T3 · access: open · ingest: full · viewpoint: center · cadence: weekly — focus: non-partisan legislative analysis, vital-stats explainers
- **Brookings — India** — https://www.brookings.edu/regions/asia-the-pacific/india/ — tier: T3 · access: open · ingest: live · viewpoint: intl-comparative · cadence: weekly — focus: US-based scholarship on India's economy, foreign policy, democracy
- **GIGA Institute (Hamburg)** — https://www.giga-hamburg.de/en — tier: T3 · access: open · ingest: live · viewpoint: intl-comparative · cadence: weekly — focus: comparative area-studies on South Asian politics + accountability
- **Freedom House — India (Freedom in the World)** — https://freedomhouse.org/country/india/freedom-world/2025 — tier: T3 · access: open · ingest: live · viewpoint: intl-comparative · cadence: annual — focus: political-rights / civil-liberties scoring, methodology disclosed
- **Bertelsmann Transformation Index (BTI)** — https://www.bti-project.org/en/ — tier: T3 · access: open · ingest: live · viewpoint: intl-comparative · cadence: annual — focus: democracy + market-transformation country report for India

## T4 — Long-form journalism

- **The Hindu — Politics** — https://www.thehindu.com/news/national/politics/ — tier: T4 · access: reg · ingest: live · viewpoint: center · cadence: live — focus: parliamentary politics, electoral analysis, record-of-account reporting
- **Indian Express — Political Pulse** — https://indianexpress.com/section/political-pulse/ — tier: T4 · access: reg · ingest: live · viewpoint: center · cadence: live — focus: governance, party machinery, ground reporting
- **The Print — Politics** — https://theprint.in/category/politics/ — tier: T4 · access: open · ingest: live · viewpoint: center · cadence: live — focus: news + opinion, defence/strategic affairs, data desk
- **Mint — Politics** — https://www.livemint.com/politics — tier: T4 · access: reg · ingest: live · viewpoint: center · cadence: live — focus: policy + political-economy reporting, budget/economy linkage
- **Frontline (The Hindu group)** — https://frontline.thehindu.com/ — tier: T4 · access: reg · ingest: live · viewpoint: left · cadence: weekly — focus: long-form left-of-centre political + social reporting
- **The Wire — Politics** — https://thewire.in/politics — tier: T4 · access: open · ingest: live · viewpoint: left · cadence: live — focus: investigative, accountability, structural critique
- **Caravan Magazine** — https://caravanmagazine.in/politics — tier: T4 · access: paywall · ingest: metadata · viewpoint: left · cadence: weekly — focus: deep narrative political reporting, profiles, institutional investigation
- **Scroll.in — Politics** — https://scroll.in/category/politics — tier: T4 · access: open · ingest: live · viewpoint: left · cadence: live — focus: news + analysis, rights + minorities, ground reporting
- **Newslaundry** — https://www.newslaundry.com/ — tier: T4 · access: reg · ingest: live · viewpoint: left · cadence: live — focus: media criticism, accountability journalism, subscriber-funded
- **Swarajya** — https://swarajyamag.com/ — tier: T4 · access: reg · ingest: live · viewpoint: right · cadence: live — focus: right-of-centre policy + cultural commentary, market/nationalist framing
- **OpIndia** — https://www.opindia.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: right · cadence: live — focus: Hindu-nationalist framing; tagged for cluster balance, cross-check claims against T0/T1
- **IndiaSpend** — https://www.indiaspend.com/ — tier: T4 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: data journalism, policy-implementation + fact-checking
- **The Economist — Asia** — https://www.economist.com/asia — tier: T4 · access: paywall · ingest: metadata · viewpoint: intl-comparative · cadence: weekly — focus: India in regional/global context, liberal-market framing
- **Foreign Policy — South Asia** — https://foreignpolicy.com/region/south-asia/ — tier: T4 · access: paywall · ingest: metadata · viewpoint: intl-comparative · cadence: weekly — focus: geopolitics, foreign-policy framing of Indian politics
- **The Diplomat — Politics** — https://thediplomat.com/topics/politics/ — tier: T4 · access: reg · ingest: live · viewpoint: intl-comparative · cadence: live — focus: Asia-Pacific lens on South Asian politics + security
- **BBC News — India** — https://www.bbc.com/news/world/asia/india — tier: T4 · access: open · ingest: live · viewpoint: intl-comparative · cadence: live — focus: wire-standard India coverage, external-vantage reporting

## T5 — Books / reference

- **Project Gutenberg** — https://www.gutenberg.org/ — tier: T5 · access: open · ingest: metadata · viewpoint: primary · cadence: archival — focus: PD primary texts/speeches; confirm India PD status before full-ingest
- **Internet Archive — texts** — https://archive.org/details/texts — tier: T5 · access: open · ingest: metadata · viewpoint: primary · cadence: archival — focus: scanned histories, gazetteers, committee volumes; per-item licence check
- **Google Books** — https://books.google.com/ — tier: T5 · access: reg · ingest: metadata · viewpoint: center · cadence: archival — focus: scholarly monographs on Indian politics — snippet/metadata only, cite the original
- **HathiTrust Digital Library** — https://www.hathitrust.org/ — tier: T5 · access: reg · ingest: metadata · viewpoint: center · cadence: archival — focus: academic + government volumes; full-view only for PD items

## T6 — Case-study / postmortem / inquiry repositories

- **ECI — Statistical Reports** — https://www.eci.gov.in/statistical-report — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: post-election statistical reports, turnout/seat/party breakdowns by cycle
- **CAG — Audit Reports archive** — https://cag.gov.in/en/audit-report — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: scheme/department postmortems, irregularity case studies
- **Parliamentary Standing Committee Reports (PRS)** — https://prsindia.org/policy/report-summaries — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: committee scrutiny summaries, ministry-response postmortems
- **Law Commission — historical reports archive** — https://lawcommissionofindia.nic.in/old-reports/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: decades of reform inquiries (electoral, criminal, family law) as worked cases
- **Supreme Court — Landmark Judgment Summaries** — https://www.sci.gov.in/landmark-judgment-summaries/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: curated constitutional-case studies of public interest

## T7 — Named expert blogs / newsletters / data shops

- **Milan Vaishnav (Carnegie) — Grand Tamasha** — https://carnegieendowment.org/programs/southasia — tier: T7 · access: open · ingest: live · viewpoint: intl-comparative · cadence: weekly — focus: named-scholar analysis of Indian democracy, money + politics
- **Pradeep Chhibber / Rahul Verma — political science writing** — https://www.idfcinstitute.org/site/assets/files/ — tier: T7 · access: open · ingest: metadata · viewpoint: center · cadence: archival — focus: ideology-and-identity scholarship on Indian voters (named authors)
- **Gilles Verniers (TCPD co-founder) — data columns** — https://tcpd.ashoka.edu.in/people/ — tier: T7 · access: open · ingest: metadata · viewpoint: center · cadence: weekly — focus: named electoral-data analysis, legislator-profile breakdowns
- **Asim Ali / political commentary (The Print)** — https://theprint.in/author/asim-ali/ — tier: T7 · access: open · ingest: live · viewpoint: center · cadence: weekly — focus: named columnist on party strategy + state politics
- **Pratap Bhanu Mehta — columns (Indian Express)** — https://indianexpress.com/profile/columnist/pratap-bhanu-mehta/ — tier: T7 · access: reg · ingest: metadata · viewpoint: center · cadence: weekly — focus: named constitutional + political-theory commentary

## WebFetch domains to allow in `.claude/settings.local.json`

```
sansad.in
eci.gov.in
mospi.gov.in
sci.gov.in
indiacode.nic.in
en.wikisource.org
constitutionofindia.net
indiabudget.gov.in
cag.gov.in
lawcommissionofindia.nic.in
niti.gov.in
mea.gov.in
rbi.org.in
prsindia.org
adrindia.org
tcpd.ashoka.edu.in
lokdhaba.ashoka.edu.in
lokniti.org
v-dem.net
idea.int
ourworldindata.org
data.worldbank.org
ceda.ashoka.edu.in
epw.in
journals.sagepub.com
pewresearch.org
ssrn.com
carnegieendowment.org
cprindia.org
orfonline.org
takshashila.org.in
vidhilegalpolicy.in
brookings.edu
giga-hamburg.de
freedomhouse.org
bti-project.org
thehindu.com
indianexpress.com
theprint.in
livemint.com
frontline.thehindu.com
thewire.in
caravanmagazine.in
scroll.in
newslaundry.com
swarajyamag.com
opindia.com
indiaspend.com
economist.com
foreignpolicy.com
thediplomat.com
bbc.com
gutenberg.org
archive.org
books.google.com
hathitrust.org
idfcinstitute.org
```
