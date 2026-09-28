# Jev pre-pass: No City decision published in 1,330 days

- **Draft:** src/content/issues/2026-09-28-verdict-arrived-sentence-didnt/index.mdx
- **Dossier:** research/sports/2026-09-28-verdict-arrived-sentence-didnt-dossier.md
- **Run:** 2026-09-28 · typesafe/jev-1.13-20260917 via openrouter · threshold p ≥ 0.90 · 179 dossier passages (§0, §7, §8 excluded)
- **Cost:** $0.00185 · 46 calls · 44,162 input tokens · 5.3 s

> A pre-pass, not a gate (docs/COST-PLAN.md CP-06). Each claim was compared with the three
> dossier passages that share the most numbers and names with it, one claim per Jev call.
> "Supports" means only that Jev read a passage as stating the claim. The verifier owns every
> verdict, every quote, all arithmetic and every date. The code checks are deterministic:
> a figure in the claim that none of the passages shown carries, a quote not found verbatim,
> a passage the dossier marks [PARTIAL] / [UNVERIFIED] / [HISTORICAL], a caption or callout
> that ranks the chart's own figures ("furthest", "highest"), which only a recomputation settles,
> and each section's source line against the publishers of its sourceRefs.

**Summary:** 46 claims · 22 confident support (p ≥ 0.90) · 1 contradicts · 1 says nothing · 22 low confidence · 2 supported but flagged by code · 1 of 11 sections flagged on their source line

## For the verifier

Jev pre-pass (46 claims, threshold 0.90): 22 confidently supported, 1 contradicted, 1 with nothing in the dossier, 22 low confidence, 2 supported but flagged by code. 1 of 11 sections flagged on their source line.
This is routing, not a verdict: audit every claim as usual, and start with these.

### Contradicts (1)

A passage states a different value or fact.

- **#7** §1 data-readout · data.tiles[1]: "Decisions published: 0. The League's rule promises one." · contradicts (supports 0.01, says_nothing 0.06, contradicts 0.93) · passage `6/row6`: "| Premier League statement — independent Appeal Board decision on Nottingham Forest (7 May 2024) | Premier League | http…"

### Says nothing (1)

No passage the pre-pass found addresses the claim.

- **#41** §10 power-matrix · intro: "Not one of these eight stages comes with a deadline." · says_nothing (supports 0.00, contradicts 0.09, says_nothing 0.91) · no passage cited

### Low confidence (22)

No answer reached p ≥ 0.90. Sorted by p(supports), lowest first.

- **#4** §1 data-readout · title: "Two of these four numbers are zero" · says_nothing (says_nothing 0.82, contradicts 0.15, supports 0.03) · no passage cited
- **#27** §6 jargon-buster · title: "Four words that decide this story" · says_nothing (contradicts 0.13, supports 0.09, says_nothing 0.78) · passage `4i/item9`: "Second Indian anchor — a live Indian football dispute, decided in nine days (added by the top-up; source: Scroll.in Fiel…"
- **#14** §3 timeline · caption: "Two clubs were docked points and one settled while City waited." · says_nothing (supports 0.10, says_nothing 0.66, contradicts 0.24) · passage `1/para1`: "The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said …"
- **#2** head · hook: "Three days later, and 1,330 days after the charge, there is still nothing to read." · contradicts (contradicts 0.77, says_nothing 0.09, supports 0.14) · passage `2/item3`: "Elapsed, charge to reported verdict: 2023-02-06 → 2026-09-25 = 1,096 days (three full years) + 231 days = 1,327 days; 1,…"
- **#40** §10 power-matrix · title: "Eight stages, and nobody owns the clock" · contradicts (supports 0.20, contradicts 0.48, says_nothing 0.32) · passage `3/row1`: "| 2009-08 → 2018-05 | Seasons 2009/10–2017/18 — the nine seasons in which the League alleges City failed to provide accu…"
- **#43** §10 power-matrix · caption: "Nobody holds the bottom row, so no party can set a date. The contested cell is publication. In 2021 City lost a Court of Appeal fight to keep a ruling unpublished." · contradicts (says_nothing 0.03, supports 0.25, contradicts 0.72) · passage `3/row7`: "| 2021 | *Manchester City FC Ltd v The Football Association Premier League Ltd & Ors* — the Court of Appeal upholds the …"
- **#1** head · title: "No City decision published in 1,330 days" · says_nothing (supports 0.29, contradicts 0.23, says_nothing 0.48) · passage `1/para1`: "The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said …"
- **#23** §5 latency-waterfall · caption: "Forest's case, appeal included, took 113 days. City's first stage has run 1,330 days and has not stopped." · contradicts (supports 0.30, says_nothing 0.00, contradicts 0.70) · passage `4e/item4`: "Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referra…"
- **#8** §1 data-readout · data.tiles[2]: "Punishments imposed: 0. No points off, no fine." · contradicts (supports 0.34, contradicts 0.65, says_nothing 0.01) · passage `4e/row5`: "| Manchester City (Sep 2026) | 0 | "verdict reported; no sanction set" | §9 — [UNVERIFIED] |" · **code:** passage 4e/row5 is marked [UNVERIFIED]
- **#46** §11 comparison · caption: "The committee asked for standing officers. The Premier League convenes a panel per case." · supports (says_nothing 0.12, supports 0.54, contradicts 0.34) · passage `4i/item8`: "The contrast to draw: the Premier League's Commission is convened per case and dissolved after; Lodha's design is standi…"
- **#35** §7 benchmark-chart · data.annotations[0]: "Callout on "Nottingham Forest, Mar 2024": 63 days from referral. City, 1,330 and counting." · supports (supports 0.57, contradicts 0.42, says_nothing 0.01) · passage `4e/item4`: "Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referra…" · **code:** not in the passages shown: 1,330
- **#6** §1 data-readout · data.tiles[0]: "Days since the charge: 1,330. Charged 6 February 2023. Three and a half years." · supports (supports 0.61, contradicts 0.39, says_nothing 0.00) · passage `10/row3`: "| 3 | §4d, note under the ladder | "no number on it, four years after being charged" | "no number on it, three and a hal…" · **code:** not in the passages shown: 1,330
- **#26** §5 latency-waterfall · data.spans[2]: "Manchester City: charge to today: start 0, dur 1330" · supports (says_nothing 0.21, supports 0.62, contradicts 0.17) · passage `4e/row5`: "| Manchester City (Sep 2026) | 0 | "verdict reported; no sanction set" | §9 — [UNVERIFIED] |" · **code:** passage 4e/row5 is marked [UNVERIFIED]
- **#29** §7 benchmark-chart · caption: "Everton lost ten points, later reduced on appeal, Forest four, Everton two more. City's bar is empty because nothing has been published." · supports (says_nothing 0.05, contradicts 0.31, supports 0.64) · passage `4e/item2`: "Points per £m of overspend: Everton 10 ÷ 19.5 = 0.51 pts/£m; Everton post-appeal 6 ÷ 19.5 = 0.31 pts/£m; Forest 4 ÷ 34.5…"
- **#3** head · primer: "On 25 September, reports said a panel had found against Manchester City." · supports (supports 0.67, says_nothing 0.01, contradicts 0.32) · passage `2/item1`: "25 September 2026 — multiple outlets report that an independent Commission has found Manchester City guilty on 114 of 11…" · **code:** passage 2/item1 is marked [UNVERIFIED]
- **#12** §2 you-think · data.actually: "What the record shows: 0 published decisions. Finding and punishing are separate stages here. The League's website carries no decision and no punishment." · supports (says_nothing 0.01, contradicts 0.30, supports 0.69) · passage `4c/code1`: "stages: - label: "Alleged breaches charged (6 Feb 2023)", count: 115 - label: "Heard by the independent Commission", cou…"
- **#38** §8 margin-ladder · data.rows[1]: "Everton, 2021/22: margin 19.5. Lost 10 points" · supports (contradicts 0.27, supports 0.72, says_nothing 0.01) · passage `4d/row2`: "| Everton, 2021/22 | 19.5 | 105 | 19.5 ÷ 105 = 18.6% over | 10 pts, reduced to 6 on appeal | PL |"
- **#11** §2 you-think · caption: "No decision has been published and no punishment exists, so nothing has changed on the league table." · supports (contradicts 0.06, says_nothing 0.21, supports 0.73) · passage `1/para1`: "The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said …"
- **#21** §3 timeline · data.annotations[0]: "Callout on "18 Mar 2024": Charged after City, finished long before it." · supports (contradicts 0.16, says_nothing 0.03, supports 0.81) · passage `4e/item4`: "Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referra…"
- **#36** §8 margin-ladder · caption: "Forest went £34.5m over a £61m limit, the widest gap here." · supports (supports 0.81, says_nothing 0.14, contradicts 0.05) · passage `3/row12`: "| 2024-01-15 | Nottingham Forest referred to a Commission after admitting a £34.5m breach of a £61m threshold | Premier …"
- **#9** §1 data-readout · data.tiles[3]: "Days to Forest's first decision: 63. Referral to four points off." · supports (contradicts 0.14, says_nothing 0.01, supports 0.85) · passage `4e/item3`: "Speed vs outcome: Forest, referral 2024-01-15 → decision 2024-03-18 = 63 days. City, referral 2023-02-06 → reported verd…"
- **#30** §7 benchmark-chart · data.items[0]: "Everton, Nov 2023: 10 points. Breach admitted. Later reduced on appeal." · supports (contradicts 0.08, says_nothing 0.04, supports 0.88) · passage `4e/row1`: "| Everton (Nov 2023) | 10 | "reduced to 6 on appeal" [UNVERIFIED — no allowlisted source fetched confirms the 6; see §11…" · **code:** passage 4e/row1 is marked [UNVERIFIED]

### Supported by Jev, flagged by code (2)

A figure in the claim is in none of the passages shown, a quote is not verbatim, the passage carries a dossier caveat, or a caption ranks the chart's own figures.

- **#28** §6 jargon-buster · data.terms[1]: "Profitability and Sustainability Rules. A cap on losses: £105m. In rupees, about ₹1,300 crore. Europe's top divisions lose about 4% of revenue before tax each year." · supports (supports 0.95, says_nothing 0.00, contradicts 0.05) · passage `4i/item3`: "The PSR loss limit still in force: £105m × 126.9378 = ₹13,328,469,000 = ₹1,332.85 crore (13,328,469,000 ÷ 10,000,000 = 1…" · **code:** not in the passages shown: ₹1,300 crore
- **#34** §7 benchmark-chart · data.items[4]: "Manchester City, Sep 2026: 0 points. Nothing published, nothing imposed." · supports (supports 0.98, says_nothing 0.00, contradicts 0.02) · passage `4e/row5`: "| Manchester City (Sep 2026) | 0 | "verdict reported; no sanction set" | §9 — [UNVERIFIED] |" · **code:** passage 4e/row5 is marked [UNVERIFIED]

### Source lines (1)

Each section's source line against the publishers of its sourceRefs. Code only, no Jev.

- **§2 you-think · source**: "Reported finding, checked against premierleague.com, where none is published" · cites Premier League · cites Premier League (src-01) but the source line does not name it

## Every claim

| # | Claim | Location | Verdict | p | Passage id | Passage excerpt (first 160 chars) | Code check |
|---|---|---|---|---|---|---|---|
| 1 | No City decision published in 1,330 days | head · title | says_nothing (low) | 0.48 | 1/para1 | The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said *guilty*, and now comes the punishment. | — |
| 2 | Three days later, and 1,330 days after the charge, there is still nothing to read. | head · hook | contradicts (low) | 0.77 | 2/item3 | Elapsed, charge to reported verdict: 2023-02-06 → 2026-09-25 = 1,096 days (three full years) + 231 days = 1,327 days; 1,327 ÷ 365.25 = 3.63 years. | — |
| 3 | On 25 September, reports said a panel had found against Manchester City. | head · primer | supports (low) | 0.67 | 2/item1 | 25 September 2026 — multiple outlets report that an independent Commission has found Manchester City guilty on 114 of 115 Premier League charges. [UNVERIFIED — | passage 2/item1 is marked [UNVERIFIED] |
| 4 | Two of these four numbers are zero | §1 data-readout · title | says_nothing (low) | 0.82 | — |  | — |
| 5 | As of 28 September 2026 the League's site shows no published decision and no punishment. | §1 data-readout · caption | supports | 0.99 | 3/row18 | \| 2026-09-28 \| No Premier League statement or final award on the City decision exists on premierleague.com \| premierleague.com (domain-restricted search, 2026-0 | — |
| 6 | Days since the charge: 1,330. Charged 6 February 2023. Three and a half years. | §1 data-readout · data.tiles[0] | supports (low) | 0.61 | 10/row3 | \| 3 \| §4d, note under the ladder \| "no number on it, four years after being charged" \| "no number on it, three and a half years after being charged" \| 2023-02-0 | not in the passages shown: 1,330 |
| 7 | Decisions published: 0. The League's rule promises one. | §1 data-readout · data.tiles[1] | contradicts | 0.93 | 6/row6 | \| Premier League statement — independent Appeal Board decision on Nottingham Forest (7 May 2024) \| Premier League \| https://www.premierleague.com/en/news/399977 | — |
| 8 | Punishments imposed: 0. No points off, no fine. | §1 data-readout · data.tiles[2] | contradicts (low) | 0.65 | 4e/row5 | \| Manchester City (Sep 2026) \| 0 \| "verdict reported; no sanction set" \| §9 — [UNVERIFIED] \| | passage 4e/row5 is marked [UNVERIFIED] |
| 9 | Days to Forest's first decision: 63. Referral to four points off. | §1 data-readout · data.tiles[3] | supports (low) | 0.85 | 4e/item3 | Speed vs outcome: Forest, referral 2024-01-15 → decision 2024-03-18 = 63 days. City, referral 2023-02-06 → reported verdict 2026-09-25 = 1,327 days. 1,327 ÷ 63 | — |
| 10 | Guilty and punished are two different stages | §2 you-think · title | supports | 1.00 | 1/para1 | The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said *guilty*, and now comes the punishment. | — |
| 11 | No decision has been published and no punishment exists, so nothing has changed on the league table. | §2 you-think · caption | supports (low) | 0.73 | 1/para1 | The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said *guilty*, and now comes the punishment. | — |
| 12 | What the record shows: 0 published decisions. Finding and punishing are separate stages here. The League's website carries no decision and no punishment. | §2 you-think · data.actually | supports (low) | 0.69 | 4c/code1 | stages: - label: "Alleged breaches charged (6 Feb 2023)", count: 115 - label: "Heard by the independent Commission", count: 115 - label: "Upheld by the Commissi | — |
| 13 | Meanwhile three other clubs had their cases dealt with while City's first stage stayed open. | §3 timeline · intro | supports | 0.99 | 1/para1 | The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said *guilty*, and now comes the punishment. | — |
| 14 | Two clubs were docked points and one settled while City waited. | §3 timeline · caption | says_nothing (low) | 0.66 | 1/para1 | The reader arrives thinking the Manchester City story finally has an ending: after three and a half years, a panel said *guilty*, and now comes the punishment. | — |
| 15 | May 2018 · City finish on 100 points. Nineteen clear of second, inside the charge window. | §3 timeline · data.events[0] | supports | 0.96 | 4j/item2 | 2017/18 (final season of the financial-information charge window): City win with 100 points and a 19-point gap to second — the largest title margin in Premier L | — |
| 16 | 6 Feb 2023 · Manchester City charged. Five categories of alleged breach, across fourteen seasons. | §3 timeline · data.events[1] | supports | 1.00 | 3/row9 | \| 2023-02-06 \| Premier League refers Manchester City to a Commission under Rule W.3.4 across five categories of alleged breach, seasons 2009/10–2022/23 \| Premie | — |
| 17 | 17 Nov 2023 · Everton lose 10 points. £124.5m loss against a £105m limit. | §3 timeline · data.events[2] | supports | 0.99 | 3/row11 | \| 2023-11-17 \| Everton deducted 10 points; Commission finds a PSR loss of £124.5m against a £105m threshold \| Premier League \| | — |
| 18 | 18 Mar 2024 · Forest lose 4 points. Sixty-three days after referral. | §3 timeline · data.events[3] | supports | 1.00 | 3/row13 | \| 2024-03-18 \| Nottingham Forest deducted 4 points — 63 days after referral \| Premier League \| | — |
| 19 | 16 Mar 2026 · Chelsea settle instead. Fines and transfer bans agreed. No points lost. | §3 timeline · data.events[4] | supports | 1.00 | 3/row16 | \| 2026-03-16 \| Chelsea and the Premier League conclude sanction agreements: £10m + £750,000 in fines, a nine-month academy transfer ban, a suspended one-year fi | — |
| 20 | 28 Sep 2026 · City, still nothing published. No decision to read, no punishment to serve. | §3 timeline · data.events[5] | supports | 0.97 | 3/row18 | \| 2026-09-28 \| No Premier League statement or final award on the City decision exists on premierleague.com \| premierleague.com (domain-restricted search, 2026-0 | — |
| 21 | Callout on "18 Mar 2024": Charged after City, finished long before it. | §3 timeline · data.annotations[0] | supports (low) | 0.81 | 4e/item4 | Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referral 2024-01-15 → Commission 2024-03-18 → A | — |
| 22 | Forest's whole case took 113 days | §5 latency-waterfall · title | supports | 1.00 | 4e/item4 | Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referral 2024-01-15 → Commission 2024-03-18 → A | — |
| 23 | Forest's case, appeal included, took 113 days. City's first stage has run 1,330 days and has not stopped. | §5 latency-waterfall · caption | contradicts (low) | 0.70 | 4e/item4 | Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referral 2024-01-15 → Commission 2024-03-18 → A | — |
| 24 | Forest: referral to decision: start 0, dur 63 | §5 latency-waterfall · data.spans[0] | supports | 0.90 | 4e/item3 | Speed vs outcome: Forest, referral 2024-01-15 → decision 2024-03-18 = 63 days. City, referral 2023-02-06 → reported verdict 2026-09-25 = 1,327 days. 1,327 ÷ 63 | — |
| 25 | Forest: appeal to final: start 63, dur 50 | §5 latency-waterfall · data.spans[1] | supports | 1.00 | 4e/item4 | Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referral 2024-01-15 → Commission 2024-03-18 → A | — |
| 26 | Manchester City: charge to today: start 0, dur 1330 | §5 latency-waterfall · data.spans[2] | supports (low) | 0.62 | 4e/row5 | \| Manchester City (Sep 2026) \| 0 \| "verdict reported; no sanction set" \| §9 — [UNVERIFIED] \| | passage 4e/row5 is marked [UNVERIFIED] |
| 27 | Four words that decide this story | §6 jargon-buster · title | says_nothing (low) | 0.78 | 4i/item9 | Second Indian anchor — a live Indian football dispute, decided in nine days (added by the top-up; source: Scroll.in Field, T4 · business-finance). | — |
| 28 | Profitability and Sustainability Rules. A cap on losses: £105m. In rupees, about ₹1,300 crore. Europe's top divisions lose about 4% of revenue before tax each year. | §6 jargon-buster · data.terms[1] | supports | 0.95 | 4i/item3 | The PSR loss limit still in force: £105m × 126.9378 = ₹13,328,469,000 = ₹1,332.85 crore (13,328,469,000 ÷ 10,000,000 = 1,332.85). | not in the passages shown: ₹1,300 crore |
| 29 | Everton lost ten points, later reduced on appeal, Forest four, Everton two more. City's bar is empty because nothing has been published. | §7 benchmark-chart · caption | supports (low) | 0.64 | 4e/item2 | Points per £m of overspend: Everton 10 ÷ 19.5 = 0.51 pts/£m; Everton post-appeal 6 ÷ 19.5 = 0.31 pts/£m; Forest 4 ÷ 34.5 = 0.12 pts/£m; Everton second case 2 ÷ | — |
| 30 | Everton, Nov 2023: 10 points. Breach admitted. Later reduced on appeal. | §7 benchmark-chart · data.items[0] | supports (low) | 0.88 | 4e/row1 | \| Everton (Nov 2023) \| 10 \| "reduced to 6 on appeal" [UNVERIFIED — no allowlisted source fetched confirms the 6; see §11] \| PL \| | passage 4e/row1 is marked [UNVERIFIED] |
| 31 | Nottingham Forest, Mar 2024: 4 points. Appeal dismissed. Four points stood. | §7 benchmark-chart · data.items[1] | supports | 1.00 | 4e/row2 | \| Nottingham Forest (Mar 2024) \| 4 \| "appeal dismissed; four-point deduction remained in place" \| PL — Appeal Board decision, 7 May 2024 \| | — |
| 32 | Everton, Apr 2024: 2 points. Second breach, same club. | §7 benchmark-chart · data.items[2] | supports | 1.00 | 4e/row3 | \| Everton (Apr 2024) \| 2 \| "second breach, same club" \| PL \| | — |
| 33 | Chelsea, Mar 2026: 0 points. £10.75m in fines (about ₹136 crore). | §7 benchmark-chart · data.items[3] | supports | 0.98 | 4e/row4 | \| Chelsea (Mar 2026) \| 0 \| "£10.75m fine + transfer bans instead" \| PL \| | — |
| 34 | Manchester City, Sep 2026: 0 points. Nothing published, nothing imposed. | §7 benchmark-chart · data.items[4] | supports | 0.98 | 4e/row5 | \| Manchester City (Sep 2026) \| 0 \| "verdict reported; no sanction set" \| §9 — [UNVERIFIED] \| | passage 4e/row5 is marked [UNVERIFIED] |
| 35 | Callout on "Nottingham Forest, Mar 2024": 63 days from referral. City, 1,330 and counting. | §7 benchmark-chart · data.annotations[0] | supports (low) | 0.57 | 4e/item4 | Speed vs outcome, appeal included (added by the top-up). Forest's whole route, charge to final and unappealable: referral 2024-01-15 → Commission 2024-03-18 → A | not in the passages shown: 1,330 |
| 36 | Forest went £34.5m over a £61m limit, the widest gap here. | §8 margin-ladder · caption | supports (low) | 0.81 | 3/row12 | \| 2024-01-15 \| Nottingham Forest referred to a Commission after admitting a £34.5m breach of a £61m threshold \| Premier League \| | — |
| 37 | Nottingham Forest, 2022/23: margin 34.5. Lost 4 points | §8 margin-ladder · data.rows[0] | supports | 1.00 | 4d/row1 | \| Nottingham Forest, 2022/23 \| 34.5 \| 61 \| 34.5 ÷ 61 = 56.6% over \| 4 pts deducted \| PL \| | — |
| 38 | Everton, 2021/22: margin 19.5. Lost 10 points | §8 margin-ladder · data.rows[1] | supports (low) | 0.72 | 4d/row2 | \| Everton, 2021/22 \| 19.5 \| 105 \| 19.5 ÷ 105 = 18.6% over \| 10 pts, reduced to 6 on appeal \| PL \| | — |
| 39 | Everton, 2022/23: margin 16.6. Lost 2 points | §8 margin-ladder · data.rows[2] | supports | 0.98 | 4d/row3 | \| Everton, 2022/23 \| 16.6 \| 105 \| 16.6 ÷ 105 = 15.8% over \| 2 pts deducted \| PL \| | — |
| 40 | Eight stages, and nobody owns the clock | §10 power-matrix · title | contradicts (low) | 0.48 | 3/row1 | \| 2009-08 → 2018-05 \| Seasons 2009/10–2017/18 — the nine seasons in which the League alleges City failed to provide accurate financial information (9 seasons co | — |
| 41 | Not one of these eight stages comes with a deadline. | §10 power-matrix · intro | says_nothing | 0.91 | — |  | — |
| 42 | Its statement says: "Under Premier League Rule W.82.2, the Commission's final award will be published on the Premier League's website." | §10 power-matrix · intro | supports | 1.00 | 5/quote1 | "Under Premier League Rule W.82.2, the Commission's final award will be published on the Premier League's website." — Premier League, official statement, 6 Febr | — |
| 43 | Nobody holds the bottom row, so no party can set a date. The contested cell is publication. In 2021 City lost a Court of Appeal fight to keep a ruling unpublished. | §10 power-matrix · caption | contradicts (low) | 0.72 | 3/row7 | \| 2021 \| *Manchester City FC Ltd v The Football Association Premier League Ltd & Ors* — the Court of Appeal upholds the decision to publish sports arbitral deci | — |
| 44 | Other 19 clubs | §10 power-matrix · data.parties[3] | supports | 0.94 | 4f/para3 | parties (columns): Premier League Board · Independent Judicial Panel · The charged club · The other 19 clubs | — |
| 45 | A smaller Indian football case, one defender's contract, was reported cleared in nine days. | §11 comparison · intro | supports | 1.00 | 4b/item7 | Anwar Ali — *the India defender whose contract case the Indian football system settled in nine days* — Scroll.in Field | — |
| 46 | The committee asked for standing officers. The Premier League convenes a panel per case. | §11 comparison · caption | supports (low) | 0.54 | 4i/item8 | The contrast to draw: the Premier League's Commission is convened per case and dissolved after; Lodha's design is standing office-holders who exist before the d | — |
