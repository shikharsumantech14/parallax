# Jev pilot: Eleven bills passed. None went to a committee.

- **Draft:** research/_costs/jev-pilot/eleven-bills-fifteen-percent.as-verified.mdx, the text the verifier read. The issue file has changed since (the verifier's fixes). Kept in research/_costs/jev-pilot/ (see its README).
- **Dossier:** research/politics/2026-09-17-eleven-bills-fifteen-percent-dossier.md
- **Verification report:** research/politics/2026-09-22-eleven-bills-fifteen-percent-verification.md (60 ✅ · 6 ⚠️ · 2 ❌ rows)
- **Pre-pass report:** research/politics/2026-09-28-eleven-bills-fifteen-percent-jevpass.md
- **Run:** 2026-09-28 · typesafe/jev-1.13-20260917 via openrouter · threshold p ≥ 0.90
- **Cost:** $0.00226 · 68 Jev calls · 7.4 s wall

## The numbers

- **Claims extracted:** 44. Confident support (p ≥ 0.90): **30 (68%)**. Routed to the verifier by Jev: 14. By Jev or code: 15 (34%).
- **Recall of problems** (report ⚠️ / ❌ rows the pre-pass routed): **2 of 5** claim rows by Jev alone. **5 of 7** rows with the code checks, source lines included (the source-line check flagged 2 of 2 source rows). 1 problem rows matched nothing the pre-pass checks (listed below).
  - ❌ rows: 2 of 2 matched ❌ rows routed (2 ❌ rows in all).
- **Agreement on ✅ rows** (every matched claim confident support): **30 of 43** claim rows (70%). With no code flag either: 29. Source-line ✅ rows left unflagged: 1 of 2. 15 ✅ rows matched nothing.
- **Source lines:** 2 of 9 sections flagged.
- **Of what was routed**, 3 of 10 labelled claims were real ⚠️ / ❌ (30%). The rest are the verifier's time on a clean claim.
- **Panel grade, 2026-09-22-eleven-bills-fifteen-percent-panel.md:** 11 of 12 agree (92%). On Jev's confident grades, 4 of 4.
- **Panel grade, 2026-09-22-eleven-bills-fifteen-percent-panel-2.md:** 10 of 12 agree (83%). On Jev's confident grades, 7 of 7.

## Threshold sweep over the labelled claims

Each claim takes the worst status of the report rows it matched: 5 problem claims, 31 clean ones. "Routed" = not confident support at that threshold.

| Threshold | Problems routed by Jev | … or code-flagged | Clean claims passed | Share of all claims sent to the verifier |
|---|---|---|---|---|
| 0.50 | 0 of 5 | 1 of 5 | 31 of 31 | 9% |
| 0.60 | 1 of 5 | 2 of 5 | 29 of 31 | 18% |
| 0.70 | 1 of 5 | 2 of 5 | 27 of 31 | 23% |
| 0.80 | 2 of 5 | 3 of 5 | 26 of 31 | 27% |
| 0.85 | 2 of 5 | 3 of 5 | 25 of 31 | 32% |
| 0.90 | 2 of 5 | 3 of 5 | 24 of 31 | 34% |
| 0.95 | 2 of 5 | 3 of 5 | 23 of 31 | 36% |
| 0.99 | 2 of 5 | 3 of 5 | 19 of 31 | 45% |

## Every problem row in the report

| | Report claim | Where | Pre-pass claims matched | Routed by |
|---|---|---|---|---|
| ⚠️ | "the laws it passed in fifteen percent of its scheduled time" | head · primer | #6 supports 0.74 | Jev |
| ⚠️ | Stage 4 = 2, "Debated by any MP but the minister" | §2 · data.stages label | #14 supported | missed |
| ❌ | "Question Hour falls furthest." | §4 · caption | #17 supported ⚑ | code |
| ⚠️ | `sourceRefs` cites src-08 (Scroll.in) | §4 · sourceRefs | source-line check: cites Scroll.in (src-08) but the source line does not name it | code (source line) |
| ⚠️ | "Seven of the eleven bills took five minutes or less" | §5 · intro | #24 supported | missed |
| ⚠️ | "On the days the House sat, that majority was there" | §6 · step 1 | *not extracted* | — |
| ⚠️ | Source line reads "Constitution of India, Article 85" | §6 · source | source-line check: cites Wikisource (src-09) but the source line does not name it · cites The Wire (src-10) but the source line does not name it | code (source line) |
| ❌ | "had not been prorogued when this issue went out" | §9 · caption | #38 supports 0.50 | Jev |

## ✅ rows the pre-pass did not confidently support

| | Report claim | Where | Pre-pass claims matched | Routed by |
|---|---|---|---|---|
| ✅ | Lok Sabha sat 15% of scheduled time | head · hook | #2 supports 0.85 | Jev |
| ✅ | Stage 2 = 11 reached a Lok Sabha vote | §2 · data.stages | #10 supports 0.75 | Jev |
| ✅ | Stage 3 = 11 passed both Houses | §2 · data.stages | #10 supports 0.75; #13 supported | Jev |
| ✅ | "Two drew a Lok Sabha MP other than the minister" | §2 · caption | #10 supports 0.75 | Jev |
| ✅ | Row 2 — 0.6 of 60 minutes | §4 · data.rows | #19 supports 0.80 | Jev |
| ✅ | "about 36 seconds in every scheduled hour" | §4 · row 2 note | #19 supports 0.80 | Jev |
| ✅ | Row 4 — 55 of 120, max 135 | §4 · data.rows | #21 supports 0.68 | Jev |
| ✅ | "A 2002 review panel recommended 120. The first Lok Sabha averaged 135" | §4 · row 4 note | #21 supports 0.68 | Jev |
| ✅ | "All four measures fall short of their own marks" | §4 · caption | #17 supported ⚑ | code |
| ✅ | MMDR Amendment Bill, four days introduction to Rajya Sabha | §5 · intro | #23 supports 0.57 | Jev |
| ✅ | "forty-five minutes of debate" | §5 · caption | #25 supports 0.60 | Jev |
| ✅ | "no committee stage" | §5 · caption | #25 supports 0.60 | Jev |
| ✅ | 17 Apr 2026 — 131st Amendment Bill defeated | §9 · events | #39 supports 0.52 | Jev |
| ✅ | "Two in three MPs had to vote yes, and they did not" | §9 · note | #39 supports 0.52 | Jev |
| ✅ | Both derivations on the source line | §4 · source | source-line check: cites Scroll.in (src-08) but the source line does not name it | code (source line) |

## Source lines, section by section

| § | Source line | Cites | Check | Report rows on this source |
|---|---|---|---|---|
| 1 you-think | PRS Legislative Research, Monsoon Session 2026 | PRS Legislative Research | clean | — |
| 2 bill-funnel | PRS legislation tracker · Newslaundry · stage four derived, eleven minus nine | PRS Legislative Research, Newslaundry | clean | ✅ |
| 3 jargon-buster | — | — | clean | — |
| 4 margin-bullets | PRS vital statistics and legislation tracker · 1% of 60 minutes is 0.6 · 71% of 11 bills is about 8 | PRS Legislative Research, Scroll.in | cites Scroll.in (src-08) but the source line does not name it | ✅ ⚠️ |
| 5 bill-passage | PRS legislation tracker · Newslaundry · ThePrint | PRS Legislative Research, Newslaundry, ThePrint | clean | — |
| 6 three-steps | Constitution of India, Article 85 | Wikisource, The Wire | cites Wikisource (src-09) but the source line does not name it · cites The Wire (src-10) but the source line does not name it | ⚠️ |
| 7 benchmark-chart | PRS committee-referral figures · counted against bills introduced | PRS Legislative Research | clean | — |
| 8 quote | The Wire | The Wire | clean | — |
| 9 timeline | PRS · ThePrint · The Wire, status as of 14 September 2026 | PRS Legislative Research, ThePrint, The Wire | clean | — |

## The labelled set (for calibration, CP-06)

| # | Label | Verdict | p(supports) | p(pick) | Code flags | Claim |
|---|---|---|---|---|---|---|
| 1 | ✅ | supports | 1.00 | 1.00 | — | Eleven bills passed. None went to a committee. |
| 2 | ✅ | supports | 0.85 | 0.85 | — | Your MP's House sat 15% of its scheduled time. |
| 3 | ✅ | supports | 0.99 | 0.99 | — | It still passed eleven of twelve bills. |
| 4 | ✅ | supports | 1.00 | 1.00 | — | Nine had no speaker but the minister. |
| 5 | ✅ | supports | 1.00 | 1.00 | — | Parliament sat nineteen days this monsoon. |
| 6 | ⚠️ | supports | 0.74 | 0.74 | — | You live under the laws it passed in fifteen percent of its scheduled time, so something had to give |
| 7 | ✅ | supports | 1.00 | 1.00 | — | The Lok Sabha worked 15% of its scheduled time and passed eleven of the twelve bills before it. |
| 8 | ✅ | supports | 0.98 | 0.98 | — | The House worked 15% of its scheduled time while it did this. |
| 9 | ✅ | supports | 1.00 | 1.00 | — | 11 of 12 bills. It passed eleven of the twelve bills before it. Nine cleared the Lok Sabha with only |
| 10 | ✅ | supports | 0.75 | 0.75 | — | Twelve bills entered the session and eleven passed both Houses. Two drew a Lok Sabha MP other than t |
| 11 | · | supports | 1.00 | 1.00 | — | Introduced in the session: count 12 |
| 12 | · | supports | 0.99 | 0.99 | — | Reached a vote in the Lok Sabha: count 11. The twelfth went to a committee instead |
| 13 | ✅ | supports | 1.00 | 1.00 | — | Passed by both Houses: count 11 |
| 14 | ⚠️ | supports | 1.00 | 1.00 | — | Debated by any MP but the minister: count 2. Nine passed with only the minister speaking |
| 15 | · | contradicts | 0.45 | 0.52 | — | The graphic above showed twelve bills going in and eleven coming out, but the drop came at the last  |
| 16 | · | says_nothing | 0.30 | 0.39 | — | Three words carry the rest. |
| 17 | ❌ | supports | 1.00 | 1.00 | ranks the chart's figures ("furthest"): recompute it from the section's own data | All four measures fall short of their own marks. Question Hour falls furthest. |
| 18 | ✅ | supports | 1.00 | 1.00 | — | Lok Sabha working time, Monsoon 2026: 15 % of scheduled time, required 100. Across the session, abou |
| 19 | ✅ | supports | 0.80 | 0.80 | — | Question Hour, Lok Sabha: 0.6 minutes of the scheduled hour, required 60. Across the session, about  |
| 20 | ✅ | supports | 0.91 | 0.91 | — | Bills passed after committee scrutiny: 0 of the 11 bills passed, required 8. What the 15th Lok Sabha |
| 21 | ✅ | supports | 0.68 | 0.68 | — | Sittings a year, 17th Lok Sabha: 55 sittings a year, required 120. A 2002 review panel recommended 1 |
| 22 | · | contradicts | 0.12 | 0.50 | — | Those four bars measured the whole session at once, so here is one bill inside it. |
| 23 | ✅ | supports | 0.57 | 0.57 | — | The Mines and Minerals Amendment Bill, four days from introduction to the Rajya Sabha. |
| 24 | ⚠️ | supports | 1.00 | 1.00 | — | Seven of the eleven bills took five minutes or less. |
| 25 | ✅ | supports | 0.60 | 0.60 | — | The Mines and Minerals Amendment Bill cleared both Houses in four days with forty-five minutes of de |
| 26 | · | supports | 1.00 | 1.00 | — | 10 Aug 2026 · Introduced |
| 27 | ✅ | supports | 1.00 | 1.00 | — | 12 Aug 2026 · Passed by the Lok Sabha. Five minutes of debate |
| 28 | ✅ | supports | 1.00 | 1.00 | — | 13 Aug 2026 · Passed by the Rajya Sabha. Forty minutes of debate |
| 29 | · | supports | 0.54 | 0.54 | — | Four days is the ordinary shape of this session, because the reason sits in the calendar rather than |
| 30 | ✅ | supports | 1.00 | 1.00 | — | Committee referral fell from 71% of bills introduced in the 15th Lok Sabha to 16% in the 17th. |
| 31 | ✅ | supports | 1.00 | 1.00 | — | 14th Lok Sabha (2004–09): 60 % of bills introduced that went to a committee |
| 32 | ✅ | supports | 1.00 | 1.00 | — | 15th Lok Sabha (2009–14): 71 % of bills introduced that went to a committee. The high-water mark |
| 33 | ✅ | supports | 1.00 | 1.00 | — | 16th Lok Sabha (2014–19): 25 % of bills introduced that went to a committee |
| 34 | ✅ | supports | 1.00 | 1.00 | — | 17th Lok Sabha (2019–24): 16 % of bills introduced that went to a committee. Fewest of the last four |
| 35 | · | supports | 0.82 | 0.82 | — | Callout on "16th Lok Sabha (2014–19)": Referral falls by two-thirds after 2014 |
| 36 | ✅ | supports | 0.96 | 0.96 | — | The prorogation of the House of parliament is the prerogative of the government which decides when t |
| 37 | ✅ | supports | 1.00 | 1.00 | — | The Rajya Sabha's manual records a gap of two to ten days. |
| 38 | ❌ | supports | 0.50 | 0.50 | — | The session adjourned on 13 August 2026 and had not been prorogued when this issue went out. |
| 39 | ✅ | supports | 0.52 | 0.52 | — | 17 Apr 2026 · The 131st Amendment Bill is defeated. Two in three MPs had to vote yes, and they did n |
| 40 | ✅ | supports | 1.00 | 1.00 | — | 20 Jul 2026 · The Monsoon Session opens. Nineteen sittings scheduled to 13 August |
| 41 | ✅ | supports | 1.00 | 1.00 | — | 24 Jul 2026 · The Lok Sabha adjourns minutes after opening. The Speaker asks the opposition not to b |
| 42 | ✅ | supports | 0.98 | 0.98 | — | 13 Aug 2026 · Both Houses adjourn sine die. Eleven bills have passed. None has gone to a committee |
| 43 | ✅ | supports | 1.00 | 1.00 | — | 14 Sep 2026 · Neither House is prorogued |
| 44 | ✅ | supports | 0.95 | 0.95 | — | Callout on "14 Sep 2026": The manual records two to ten days, not thirty-two |
