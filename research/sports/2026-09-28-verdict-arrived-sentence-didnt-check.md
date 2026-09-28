# Dossier check: The verdict arrived. The sentence didn't.

- **Category:** sports
- **Dossier:** research/sports/2026-09-28-verdict-arrived-sentence-didnt-dossier.md
- **Candidate:** C-01 (research/sports/2026-09-28-candidates.md)
- **Checked:** 2026-09-28
- **Checker:** dossier-check-agent
- **Verdict:** BLOCKED
- **Dossier rewritten:** yes, `## §12 Check pass, 2026-09-28` added

> Created 2026-09-28 under `docs/COST-PLAN.md` CP-09. The check pass runs
> after every research run, whatever model swept, and before the storyboard.
> It recomputes every derived number from the inputs the dossier states,
> confirms the primary anchor behind each load-bearing fact, and lists every
> disagreement and every open `[UNVERIFIED]` item. It never adds a fact and
> never fetches.
>
> **Note on this run.** This is the **second** check pass on this dossier: the
> first is recorded in the dossier's `## §10 Check pass, 2026-09-28`, and a
> targeted top-up ran against it (`## §11`). The change section this pass
> appends is therefore numbered **§12**, not §10, so the dossier does not
> carry two identically-titled sections with different contents. §10 stands
> untouched.

---

## 1. Derived numbers, recomputed

Every division, share, difference, sum, rate and conversion in the dossier,
recomputed from the inputs the dossier states beside it. A number whose
inputs the dossier does not state is not guessed at: it is listed with the
result `inputs not stated`.

| # | Where (dossier §) | As written | Inputs and formula, as the dossier states them | Recomputed | Result |
|---|---|---|---|---|---|
| 1 | §2 | 1,096 days | 2023-02-06 → 2026-02-06; 365 + 366 (2024 leap) + 365 | 1,096 | reproduces |
| 2 | §2 | 231 days | 2026-02-06 → 2026-09-25; day-of-year 268 − 37 (2026 not leap) | 231 | reproduces |
| 3 | §2, §4a | 1,327 days | 1,096 + 231 | 1,327 | reproduces |
| 4 | §2, §4a | 3.63 years | 1,327 ÷ 365.25 | 3.6331 → 3.63 | reproduces |
| 5 | §2, §4a-bis, §7 | 3 days | 2026-09-25 → 2026-09-28 | 3 | reproduces |
| 6 | §3, §4a | 9 seasons | (2017 − 2009) = 8 gaps + 1 | 9 | reproduces |
| 7 | §3, §4j | margin of 8 goals | 64 − 56 (goal difference, 2011/12) | 8 | reproduces |
| 8 | §3, §4j | 0 points | 89 − 89 (2011/12 City v Man Utd) | 0 | reproduces |
| 9 | §3 | 19-point gap, 2017/18 | stated as a figure (100 pts, 19-pt gap); second-place total not stated | — | reproduces as stated (see §2 row 12 on the superlative) |
| 10 | §3, §4e | 63 days | 2024-01-15 → 2024-03-18; day-of-year 78 − 15 (2024 leap) | 63 | reproduces |
| 11 | §3, §4i | £10.75m | £10m + £750,000 | £10.75m | reproduces |
| 12 | §4a | 14 seasons | (2022 − 2009) = 13 gaps + 1 | 14 | reproduces |
| 13 | §4a | 99.13% upheld | 114 ÷ 115 | 0.991304 → 99.13% | reproduces (inputs are reported, not official — §3 row 1) |
| 14 | §4a, §4c | 1 charge dismissed | 115 − 114 | 1 | reproduces (same caveat) |
| 15 | §4a | 205 months | (2026 − 2009) × 12 + 1 | 204 + 1 = 205 | reproduces |
| 16 | §4a | 17.08 years | 205 ÷ 12 | 17.0833 → 17.08 | reproduces |
| 17 | §4a | 100 months | (2026 − 2018) × 12 + 4 | 96 + 4 = 100 | reproduces |
| 18 | §4a | 8.33 years | 100 ÷ 12 | 8.3333 → 8.33 | reproduces |
| 19 | §4a-bis, §4e | 50 days (appeal leg) | 2024-03-18 → 2024-05-07; day-of-year 128 − 78 | 50 | reproduces |
| 20 | §4a-bis, §4e | 13 + 30 + 7 = 50 | rest of March 13, April 30, May 7 | 50 | reproduces |
| 21 | §4a-ter | €0 change year on year | 1.2 − 1.2 (€bn pre-tax losses, 2023 v 2024) | 0 | reproduces |
| 22 | §4a-ter | +25 percentage points | 50 − 25 (profitable-club share, 2025 v 2021) | 25 | reproduces |
| 23 | §4a-ter | 2.0× the 2021 share | 50 ÷ 25 | 2.0 | reproduces |
| 24 | §4a-ter | 4.0% of revenue | €1.2bn ÷ €30bn | 0.04 → 4.0% | reproduces |
| 25 | §4a-ter | 5 dated shares 2021→2025 | 25, 26, 30, 38, 50 over five years | 5 values / 5 years | reproduces |
| 26 | §4c | 1 lost at the Commission | 115 − 114 | 1 | reproduces |
| 27 | §4c | 114 lost at publication | 114 − 0 | 114 | reproduces |
| 28 | §4c | 0 at sanction | 0 − 0 | 0 | reproduces |
| 29 | §4c | monotonically non-increasing, 5 stages | 115, 115, 114, 0, 0 | non-increasing; 5 rows | reproduces |
| 30 | §4d | 56.6% over | 34.5 ÷ 61 | 0.565574 → 56.6% | reproduces |
| 31 | §4d | 18.6% over | 19.5 ÷ 105 | 0.185714 → 18.6% | reproduces |
| 32 | §4d | 15.8% over | 16.6 ÷ 105 | 0.158095 → 15.8% | reproduces |
| 33 | §4d | £19.5m over | £124.5m − £105m | 19.5 | reproduces |
| 34 | §4d | ladder ranking (Forest the top rung) | 34.5 > 19.5 > 16.6 (£m over); 56.6% > 18.6% > 15.8% | same order on both measures | reproduces |
| 35 | §4d | "three and a half years after being charged" | 2023-02-06 → 2026-09-28 = 1,330 days ÷ 365.25 | 3.64 years | reproduces as the dossier's rounding (§1 uses the same phrase) |
| 36 | §4e | 8 points | 6 (post-appeal) + 2 | 8 | reproduces arithmetically; the input 6 is [UNVERIFIED] (§3 row 2) |
| 37 | §4e | 0.51 pts/£m | 10 ÷ 19.5 | 0.5128 → 0.51 | reproduces |
| 38 | §4e | 0.31 pts/£m | 6 ÷ 19.5 | 0.3077 → 0.31 | reproduces arithmetically; the input 6 is [UNVERIFIED] |
| 39 | §4e | 0.12 pts/£m (Forest) | 4 ÷ 34.5 | 0.11594 → 0.12 | reproduces |
| 40 | §4e | 0.12 pts/£m (Everton 2nd) | 2 ÷ 16.6 | 0.12048 → 0.12 | reproduces |
| 41 | §4e | "roughly a quarter to a half of each other's rate" | 0.12 ÷ 0.51 and 0.12 ÷ 0.31 | 0.235 and 0.387 | reproduces (both ratios sit inside a quarter-to-a-half; the upper end is nearer two-fifths) |
| 42 | §4e, §7 | 21.1× longer | 1,327 ÷ 63 | 21.063 → 21.1 | reproduces |
| 43 | §4e | 113 days (full Forest route) | 63 + 50 | 113 | reproduces |
| 44 | §4e | 11.7× longer | 1,327 ÷ 113 | 11.7434 → 11.7 | reproduces |
| 45 | §4f | 8 institutions × 4 parties | rows listed v table rows; columns listed v table columns | 8 rows, 4 columns | reproduces |
| 46 | §4f | "the other 19 clubs" | 20-club league − the charged club | 19 | reproduces |
| 47 | §4g, §7 | 7.17% published | 43 ÷ 600 | 0.0716667 → 7.17% | reproduces |
| 48 | §4g | 557 awards unpublished | 600 − 43 | 557 | reproduces |
| 49 | §4g | 92.8% unpublished | 557 ÷ 600 | 0.928333 → 92.8% | reproduces |
| 50 | §4i | ₹1,364,581,350 | £10.75m × 126.9378 | 1,269,378,000 + 95,203,350 = 1,364,581,350 | reproduces (rate itself unanchored — §2 row 4) |
| 51 | §4i | ₹136.46 crore | 1,364,581,350 ÷ 10,000,000 | 136.458135 → 136.46 | reproduces |
| 52 | §4i | ₹13,328,469,000 | £105m × 126.9378 | 12,693,780,000 + 634,689,000 = 13,328,469,000 | reproduces |
| 53 | §4i | ₹1,332.85 crore | 13,328,469,000 ÷ 10,000,000 | 1,332.8469 → 1,332.85 | reproduces |
| 54 | §4i | "= **19** (rest of Sept to the 20th from the 11th)" | 2024-09-11 → 2024-09-20 | **9** | **corrected to 9** (the same line's own `20 − 11 = 9`, the 147× multiple and §11 all use 9) |
| 55 | §4i | 9 days | 20 − 11 (September 2024) | 9 | reproduces |
| 56 | §4i | 147× longer | 1,327 ÷ 9 | 147.44 → 147 | reproduces |
| 57 | §7 (card 4) | "Everton 8 months" | no Everton referral date appears anywhere in the dossier (§3 gives only the Oct 2023 hearing and the 17 Nov 2023 decision) | — | **inputs not stated** |
| 58 | §7 | drawn-graphic count 4, of which 2 never-published | `bill-funnel`, `margin-ladder`, `benchmark-chart`, `power-matrix`; never-published = funnel + ladder | 4 and 2 | reproduces |
| 59 | §7 | "misses seven of the nine charge-window seasons" | SPI from 2016 covers 2016/17 + 2017/18; 9 − 2 | 7 | reproduces |
| 60 | §8 | 20 sources | counted rows in §8 (13 original + 7 top-up) | 20 | reproduces |
| 61 | §8 | 13 publishers | PL + 12 distinct others | 13 | reproduces |
| 62 | §8 | 6 tiers | T0, T2, T3, T4, T6, T7 present | 6 | reproduces |
| 63 | §8 | top publisher 40% | 8 ÷ 20 | 0.400 → 40.0% | reproduces |
| 64 | §8 | tier tally | 10 + 1 + 2 + 2 + 3 + 2 | 20 = row count | reproduces |
| 65 | §8 | 53.8% on content-yielding rows | 7 ÷ 13 | 0.53846 → 53.8% | reproduces (7 non-yielding rows: LawInSport, Guardian, ESPNcricinfo, CAS, Swiss Ramble, Deloitte, the 2011/12 table) |
| 66 | §8 | 5 ÷ 9 = 55.6% (pre-top-up basis) | 5 ÷ 9 | 0.5556 → 55.6% | reproduces |
| 67 | §8 | "a fall of 1.8 percentage points" | 55.6 − 53.8 | 1.8 from the rounded shares; **1.7** from the unrounded 5 ÷ 9 − 7 ÷ 13 (55.556 − 53.846 = 1.710) | reproduces from the shares as stated; flagged as a rounding artifact, not corrected (both inputs are stated pre-rounded on the same line) |
| 68 | §10 | 3.64 years | 2023-02-06 → 2026-09-28 = 1,330 ÷ 365.25 | 3.6413 → 3.64 | reproduces |
| 69 | §10 | 46% (6 of 13, historical record) | 6 ÷ 13 | 0.4615 → 46% | reproduces |
| 70 | §11 | 8 fetches, 7 rows added, 3 documents added | fetch table rows; §8 top-up rows; §6 top-up rows | 8, 7, 3 | reproduces |

**Totals:** 70 checked · 68 reproduce · 1 corrected · 1 inputs not stated.

---

## 2. Anchors behind the load-bearing facts

Every fact the structural argument (§1) or a captured component dataset (§4)
rests on, with the source the dossier cites for it and that source's tier
(from the dossier's §8 tags, checked against `research/_sources/sports.md`).

| # | Fact (dossier §) | Cited source | Tier | Result |
|---|---|---|---|---|
| 1 | Rule W.82.2 requires publication of the final award (§1, §2, §4a, §4f, §5) | Premier League, 6 Feb 2023, https://www.premierleague.com/en/news/3045970 | T0 | anchored |
| 2 | Rule W.82 makes proceedings confidential; no time limit attaches to either rule (§1, §4f) | Premier League, same URL | T0 | anchored |
| 3 | Five categories of alleged breach, 2009/10–2022/23, incl. the co-operation charge (§4a, §4h) | Premier League, same URL | T0 | anchored |
| 4 | Commissions are independent; members appointed by the Judicial Panel Chair (§4a, §4b) | Premier League, 3045970 + 3788486 | T0 | anchored |
| 5 | No Premier League statement or final award exists as of 2026-09-28 — the verified absence the argument rests on (§1, §2, §4c, §9.9) | premierleague.com, domain-restricted search 2026-09-28 | T0 (domain) | anchored as a negative check; no document URL exists to cite, by construction. Re-runnable by the verifier |
| 6 | **The 25 Sep 2026 verdict: guilty, 114 of 115, appeal intended (§2, §3, §4a, §4c, §4e, §7 cards 1/3/5)** | none on the allowlist — Yahoo, beIN, The Football Week, MyFootballFacts per §9.1 | — | **no source.** Flagged [UNVERIFIED] throughout; a BLOCKED driver |
| 7 | Everton: £124.5m loss v £105m threshold, 10 points, five-day hearing (§1, §3, §4d, §4e) | Premier League, 3788486 | T0 | anchored |
| 8 | **Everton's 10 reduced to 6 on appeal (§4d cell, §4e, §4e's 0.31 and 8-point sum)** | 17 Nov 2023 statement, which predates the Feb 2024 appeal; the Feb 2024 statement was not fetched | T0 but stale | **no anchor for the 6.** Flagged in §4a-bis and §4e; **not** flagged in the §4d cell (see §3 row 6) |
| 9 | Forest: £34.5m over a £61m threshold, 4 points, referral 15 Jan 2024 (§1, §3, §4d, §4e) | Premier League, 3936397 | T0 | anchored |
| 10 | Forest's appeal dismissed 7 May 2024, four points stood, two grounds rejected, three named members (§4a-bis, §4b, §4e) | Premier League, 3999776 | T0 | anchored (cleared by the §11 top-up) |
| 11 | Chelsea: self-report, £10m + £750,000, transfer bans, no points, cooperation as mitigation (§1, §3, §4e, §4h) | Premier League, 4616198 | T0 | anchored |
| 12 | **2017/18's 19-point gap is "the largest title margin in Premier League history" (§3, §4j, and the §1 "records were set" beat)** | Opta Analyst (Stats Perform), theanalyst.com | T7 | **below T2.** A superlative resting on a single named-expert source; no comparison set is stated in the dossier, so it cannot be recomputed |
| 13 | 2011/12: 89 points each, GD +64 / +56 (§3, §4j, §7's `league-table` note) | Premier League 2011/12 table | T0 | anchored, with the dossier's own caveat that the URL was located by search, not fetched |
| 14 | CAS published 43 of ~600 awards in 2019 (§4g, §7 card 8) | Goh & Anderson, Harvard JSEL at 262 | T2 | anchored (the CAS primary, T0, returned 404 — §8) |
| 15 | Court of Appeal upheld publication in *Man City v FAPL*; the "public interest" quote (§1, §3, §4f) | Harvard JSEL at 262 | T2 | anchored |
| 16 | UEFA: €30bn revenue, €1.2bn losses ×2 years, 25%→50% profitable, 36% non-wage, €3.3bn transfers (§4a-ter) | UEFA ECFIL, https://ecfil.uefa.com/ | T0 | anchored |
| 17 | **£1 = ₹126.9378 on 2026-09-27, carrying both ₹ figures (§4i)** | a web-search summary of rate aggregators; no FX source is on the sports allowlist (§9.6) | — | **no source.** A BLOCKED driver for the Indian-ground card unless hedged |
| 18 | **Roberto Mancini managed 2009–2013 (§3 parenthetical, §4b role phrase)** | none | — | **no source** |
| 19 | **City has "the deepest litigation capacity in the competition" (§1)** | none | — | **no source.** An unsourced comparative; already flagged in §11 item 4 |
| 20 | **"each of those clubs was explicitly credited with cooperation as mitigation" (§1)** | §4h anchors cooperation credit for Chelsea and Forest (T0); for Everton it anchors only mitigation for "its admitted breach" | T0 partial | **not anchored for Everton.** Soften to "admitted the breach" for Everton, or drop it from the list |
| 21 | Lodha: standing Ombudsman/Ethics Officer/Electoral Officer; 22 Jan 2015 constitution; three named judges (§4i, §5, §7 card 9) | Lodha Committee Report (Gujarat CA copy) | T6 | **below T2**, though primary in nature (a Supreme Court committee report). §9.8 acknowledges this; the closing card can carry it with attribution |
| 22 | **Anwar Ali suspended 11 Sep 2024, cleared 20 Sep 2024 — the 9 days and the 147× (§4i)** | Scroll.in Field ×2 | T4 | **journalism only**, and the clearance headline is itself hedged ("say reports"). The dossier carries the right caveat; keep it a scale comparison |
| 23 | "Everton 8 months" (§7 card 4) | none; no referral date in the dossier | — | **no source and no stated inputs.** Drop the figure or source the Everton referral date before the storyboard uses card 4 |
| 24 | 115 as the charge count (§4c, §7 card 3) | press tally only; the PL statement never states a number (§9.2) | — | **no source**, and contested (§3 row 1) |

---

## 3. Where sources disagree

| # | What | Source A says | Source B says | The dossier should carry | Why |
|---|---|---|---|---|---|
| 1 | The charge count | press reports of 25 Sep 2026 (not allowlisted): **115** charges, 114 upheld | LawInSport 2025/26 annual review, per its search-index summary (T6, HTTP 403 ×3): a **"130 charges"** verdict | **Neither, as an established figure.** Carry the Premier League's own **five categories** (T0, 3045970), and where 115/114 appear, label them "reported, not official" on the card face | The only T0 document in the dispute states no number at all. Source A is off-allowlist; Source B is a search-index summary of a page nobody read. There is no way to choose between 115 and 130 from the allowlist, and the `bill-funnel` (§4c, §7 card 3) is built on 115 → 115 → 114. **This is a BLOCKED driver** |
| 2 | Everton's post-appeal deduction | PL, 17 Nov 2023 (T0): **10 points** | §4d/§4e sublabels: "reduced to **6** on appeal" — the Feb 2024 statement was never fetched | **10**, and the derived rate **0.51 pts/£m** (10 ÷ 19.5), per §4e's own caveat. Keep the 6 only inside its [UNVERIFIED] marker | The anchored figure over the unanchored one; the Feb 2024 reduction statement is a named, fetchable document that would settle it |
| 3 | Forest's appeal outcome and its citation | PL, 18 Mar 2024 (the first-instance statement, predating the appeal) | PL, 7 May 2024 (T0): *"The four-point deduction will therefore remain in place"* | The **7 May 2024** statement | The later document, and the one that actually decided the fact. Already fixed by the §11 top-up |
| 4 | The elapsed-time framing | Candidate C-01: **"six-and-a-half years"** | Dossier §4a from T0 dates: **3.63** years (charge → verdict), 8.33 (window end → verdict), 17.08 (oldest conduct → verdict) | **3.63 years** for "charge to verdict", stated as such; never 6.5 | The dossier's figures derive from the T0 charge date and the reported verdict date; 6.5 reproduces from no anchor in either file. §9.3 already rules this way |
| 5 | The charge window | Candidate C-01: charges cover **2009/10–2017/18** | PL statement (T0): five categories spanning **2009/10–2022/23**, co-operation "December 2018 to present" | The **PL statement** | Primary over the candidate's paraphrase; 2009/10–2017/18 is category (1) alone. §9.4 already rules this way |
| 6 | Internal: the same Everton "6" | §4d ladder cell: "10 pts, reduced to 6 on appeal", **unmarked**, cited to the 17 Nov 2023 statement | §4e: same text **marked [UNVERIFIED]**, pointing to §11 | The **§4e** treatment | One fact cannot be marked in one section and asserted in another. A marker is text, not a number, so this pass flagged it rather than editing the §4d cell — the storyboard must carry the marker into any ladder render |
| 7 | The basis for the publisher ceiling | §8 spread line: **8 ÷ 20 = 40.0%** on the full list | §8 caveat: **7 ÷ 13 = 53.8%** on rows that yielded content | Operator's ruling (§5 below) | Both counts are arithmetically correct; they measure different denominators, and the floor's wording does not say which. §11 item 1 asks the same question |

---

## 4. `[UNVERIFIED]` items

| # | Item (dossier §) | Resolution path stated? | Note |
|---|---|---|---|
| 1 | §2 — "guilty on 114 of 115 charges" | yes | §9.1: the Premier League's own statement / final award; §11 adds that LawInSport is abandoned after three 403s and the Guardian is unreachable. The path exists but nothing on the allowlist can walk it today |
| 2 | §3 — "2024-09 → 2024-12 the Commission hears the case" | **no** | §11 item 3 says so explicitly: "still with no resolution path". No document, request or due date is named. The hearing window carries the timeline card's shape |
| 3 | §3 — 2026-09-25 row (verdict, no ruling, appeal intended) | yes | Same path as item 1 (§9) |
| 4 | §4a — "Verdict as reported: 114 of 115 upheld" | yes | Same path as item 1 |
| 5 | §4a-bis / §4e — Everton's post-appeal **6** | yes | A named document: the February 2024 Premier League "reduced to 6" statement, "not reachable within this run's budget". One fetch resolves it |
| 6 | §4b — Lord Dyson as "a former Master of the Rolls" | **no** (workaround only) | The dossier gives a safe fallback phrase ("a serving judge of the appeal panel") but names no document or request that would source the title. Harmless if the fallback is used |
| 7 | §4e — Manchester City row, "verdict reported; no sanction set" | yes | Points to §9; same path as item 1 |
| 8 | §4j — the 2013/14 final table and margin | partial | Names the missing document type (the 2013/14 Premier League final table) and forbids stating a margin, but gives no URL. §7's `league-table` note shows the fetch pattern |

**Without a stated resolution path: 2** (items 2 and 6). Item 8 is partial.
No marker was resolved or removed by this pass.

---

## 5. The spread line

- **As written in §8:** "20 sources · 13 publishers · tiers T0/T2/T3/T4/T6/T7 (6 tiers) · top publisher 40% (premierleague.com, 8 of 20 — 8 ÷ 20 = 0.400)"
- **Counted from §8:** **20 sources** (13 original rows + 7 top-up rows) · **13 publishers** (Premier League ×8; Harvard JSEL, Gujarat CA/SC committee, Opta Analyst, Play the Game, LawInSport, The Guardian, ESPNcricinfo, UEFA, Scroll.in, CAS, Swiss Ramble, Deloitte ×1 each) · tiers **T0 ×10, T2 ×1, T3 ×2, T4 ×2, T6 ×3, T7 ×2 = 6 tiers** (sums to 20) · top publisher **premierleague.com, 8 of 20 = 40.0%**
- Tier tags spot-checked against `research/_sources/sports.md`: UEFA ECFIL T0, CAS T0, Harvard JSEL T2, Play the Game T3, Deloitte Annual Review T3, Guardian Football T4, Scroll.in Field T4, Lodha report T6, LawInSport T6, ESPNcricinfo-Lodha-timeline T6, Opta Analyst T7, Swiss Ramble T7. **All match.**
- **Floors:** ≥ 8 sources · ≥ 5 publishers · ≥ 3 tiers · no publisher above 40%
- **Result: matches my count exactly** — no correction needed. Sources (20), publishers (13) and tiers (6) clear comfortably. The publisher ceiling is **met exactly, not cleared**: 40.0% is not *above* 40%, so on the full-list basis the floor holds by nothing. On the **13 rows that actually yielded content** the same publisher is 7 ÷ 13 = **53.8%**, which is over the ceiling. **The operator must rule which denominator the floor is measured on**; on the content basis the spread misses a floor.
- Related flag, not corrected: **§9 note 5 is now stale.** It states "13 sources / 8 publishers / 6 tiers with premierleague.com at 46%" and "5 of 9 = 56%". Both reproduce from the *pre-top-up* list and §11 records the recount, but as written they contradict §8. Correcting them would cascade into the surrounding prose (the "three access failures" clause, the already-executed fetch list), which is outside this pass's remit. **Read §8 and §11, not §9.5, for the current count.**

---

## 6. Changes made to the dossier

The same list is the dossier's `## §12 Check pass, 2026-09-28` section
(numbered §12 because §10 is the first check pass and §11 the top-up).

| # | Where (dossier §) | Was | Now | Why |
|---|---|---|---|---|
| 1 | §4i, the Anwar Ali derived line | `2024-09-11 → 2024-09-20 = 19 (rest of Sept to the 20th from the 11th)` | `2024-09-11 → 2024-09-20 = 9 (rest of Sept to the 20th from the 11th)` | 11 September to 20 September 2024 is 9 days, not 19. The same line's own `20 − 11 = 9 days`, the `1,327 ÷ 9 = 147×` multiple and §11's summary all already use 9; the stray 19 was the only figure in the dossier that did not reproduce from its own stated inputs |

Nothing else in the dossier was touched. Every flag above lives in this
report only.

---

## 7. For the operator

1. **The headline fact still has no source at all.** "Guilty, 114 of 115, 25 September 2026" rests entirely on publishers that are not on the sports allowlist; three routes to an allowlisted confirmation have now failed across two runs (Guardian unreachable, LawInSport 403 ×3 and abandoned, no other allowlisted publisher covered the verdict). The issue's actual argument — that **nothing has been published** — is independently verified by absence and survives. Approve the storyboard only with the verdict attributed as reported everywhere it appears.
2. **The `bill-funnel` is built on a contested count (115 v 130) with no way to choose.** Rebuild it on the Premier League's own five categories (T0), or carry "reported, not official" on the card face. This, with item 1, is why the verdict is BLOCKED rather than CORRECTIONS.
3. **The publisher ceiling holds only on the denominator you pick:** 8 ÷ 20 = 40.0% (meets it to the digit) on the full list, 7 ÷ 13 = 53.8% (fails) on rows that yielded content. Rule the basis before the storyboard runs; §9 note 5's older counts are stale and should be ignored in favour of §8 and §11.
4. **Two ₹ figures rest on an aggregator rate with no T0–T2 anchor** (£1 = ₹126.9378). Hedge to "about ₹136 crore" and "about ₹1,330 crore" with the rate date, or cut the conversion — no FX source exists on this allowlist to fix it.
5. **The arithmetic is otherwise sound:** 68 of 70 derived numbers reproduce digit for digit, one stray 19 is corrected to 9, and one figure ("Everton 8 months", §7 card 4) has no stated inputs and should be dropped from the timeline card. Four smaller anchor gaps need a storyboard workaround: the 2017/18 "largest margin in history" superlative (T7 only), Mancini's managerial dates (unsourced), "the deepest litigation capacity in the competition" (unsourced comparative), and §1's claim that Everton too was "credited with cooperation" (§4h anchors only an admitted breach).
