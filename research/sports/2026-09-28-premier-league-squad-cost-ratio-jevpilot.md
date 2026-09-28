# Jev pilot: Football's new cap is highest for the richest

- **Draft:** research/_costs/jev-pilot/premier-league-squad-cost-ratio.as-verified.mdx, the text the verifier read. The issue file has changed since (the verifier's fixes). Kept in research/_costs/jev-pilot/ (see its README).
- **Dossier:** research/sports/2026-09-17-premier-league-squad-cost-ratio-dossier.md
- **Verification report:** research/sports/2026-09-22-premier-league-squad-cost-ratio-verification.md (54 ✅ · 20 ⚠️ · 5 ❌ rows)
- **Pre-pass report:** research/sports/2026-09-28-premier-league-squad-cost-ratio-jevpass.md
- **Run:** 2026-09-28 · typesafe/jev-1.13-20260917 via openrouter · threshold p ≥ 0.90
- **Cost:** $0.00336 · 91 Jev calls · 9.8 s wall

## The numbers

- **Claims extracted:** 67. Confident support (p ≥ 0.90): **52 (78%)**. Routed to the verifier by Jev: 15. By Jev or code: 19 (28%).
- **Recall of problems** (report ⚠️ / ❌ rows the pre-pass routed): **6 of 15** claim rows by Jev alone. **17 of 22** rows with the code checks, source lines included (the source-line check flagged 7 of 7 source rows). 3 problem rows matched nothing the pre-pass checks (listed below).
  - ❌ rows: 5 of 5 matched ❌ rows routed (5 ❌ rows in all).
- **Agreement on ✅ rows** (every matched claim confident support): **33 of 44** claim rows (75%). With no code flag either: 31. Source-line ✅ rows left unflagged: 2 of 2. 8 ✅ rows matched nothing.
- **Source lines:** 7 of 9 sections flagged.
- **Of what was routed**, 7 of 17 labelled claims were real ⚠️ / ❌ (41%). The rest are the verifier's time on a clean claim.
- **Panel grade, 2026-09-22-premier-league-squad-cost-ratio-panel.md:** 11 of 12 agree (92%). On Jev's confident grades, 6 of 6.
- **Panel grade, 2026-09-22-premier-league-squad-cost-ratio-panel-2.md:** 11 of 12 agree (92%). On Jev's confident grades, 5 of 5.

## Threshold sweep over the labelled claims

Each claim takes the worst status of the report rows it matched: 11 problem claims, 49 clean ones. "Routed" = not confident support at that threshold.

| Threshold | Problems routed by Jev | … or code-flagged | Clean claims passed | Share of all claims sent to the verifier |
|---|---|---|---|---|
| 0.50 | 3 of 11 | 6 of 11 | 48 of 49 | 16% |
| 0.60 | 3 of 11 | 6 of 11 | 45 of 49 | 21% |
| 0.70 | 5 of 11 | 7 of 11 | 45 of 49 | 22% |
| 0.80 | 5 of 11 | 7 of 11 | 44 of 49 | 24% |
| 0.85 | 5 of 11 | 7 of 11 | 42 of 49 | 27% |
| 0.90 | 5 of 11 | 7 of 11 | 41 of 49 | 28% |
| 0.95 | 5 of 11 | 7 of 11 | 40 of 49 | 28% |
| 0.99 | 7 of 11 | 9 of 11 | 33 of 49 | 43% |

## Every problem row in the report

| | Report claim | Where | Pre-pass claims matched | Routed by |
|---|---|---|---|---|
| ⚠️ | Cap is 85% of what each club earns | head · hook | #1 supported | missed |
| ⚠️ | Manchester City gets £590m | head · hook | #2 supported | missed |
| ⚠️ | Bournemouth £155m | head · hook | #2 supported | missed |
| ⚠️ | A club "may now spend 85% of its own revenue on its squad" | head · primer | #3 supported | missed |
| ⚠️ | `actually.unit` reads "of your own revenue" | §2 · `data.actually.unit` | #15 contradicts 0.54 | Jev |
| ⚠️ | Source line "Premier League rules and club accounts, 2024/25" | §2 · `source` | source-line check: cites The Swiss Ramble (src-06, src-12) but the source line does not name it | code (source line) |
| ⚠️ | "Earn £100 that way, and £85 is your ceiling" | §3 · `terms[1]` | #18 supports 0.60 | Jev |
| ⚠️ | Source line "Premier League" | §3 · `source` | source-line check: cites The Swiss Ramble (src-13) but the source line does not name it | code (source line) |
| ⚠️ | Ruling 4's sanction wording absent | §3 · `terms[1]` | *not extracted* | — |
| ⚠️ | Source "Club accounts and Deloitte" | §5 · `source` | source-line check: cites The Swiss Ramble (src-06, src-07, src-08, src-09, src-10, src-11, src-12) but the source line does not name it | code (source line) |
| ⚠️ | "Dots high on the left are already spending more than they earn" | §6 · `howToRead` | *not extracted* | — |
| ❌ | "Biggest earners sit furthest below the line." | §6 · `annotations[1]`, at Arsenal | #49 says_nothing 0.86 ⚑ | Jev |
| ⚠️ | Source "Club accounts, 2024/25" | §6 · `source` | source-line check: cites The Swiss Ramble (src-06, src-07, src-08, src-09, src-10, src-11, src-12) but the source line does not name it | code (source line) |
| ⚠️ | "The accountants Deloitte put most of the £812m increase down to decisions about selling players and club asse | §7 · caption | #52 supported ⚑ | code |
| ⚠️ | Source "Deloitte Annual Review of Football Finance 2026" | §7 · `source` | source-line check: cites The Swiss Ramble (src-10) but the source line does not name it | code (source line) |
| ⚠️ | "Those dots are already over the line" | §7 · intro | *not extracted* | — |
| ⚠️ | 8 Jul 2026 · Deloitte counts £948m of losses | §8 · `events[2]` | #60 supported | missed |
| ⚠️ | Source "Premier League statements" | §8 · `source` | source-line check: cites The Swiss Ramble (src-14) but the source line does not name it | code (source line) |
| ❌ | "Fourteen clubs chose a share of themselves." | §9 · intro | #64 supports 0.66 ⚑ | Jev |
| ❌ | IPL cap is one amount for all ten franchises | §9 · caption / rows | #65 supported ⚑ | code |
| ❌ | ₹151 crore, with a ₹125 crore auction purse | §9 · `rows[0]` | #66 contradicts 0.57 ⚑ | Jev |
| ❌ | One franchise had ₹2.75 crore left, another still had ₹64.3 crore | §9 · caption | #65 supported ⚑ | code |
| ⚠️ | "85% of the club's own football revenue" | §9 · `rows[0]` | #66 contradicts 0.57 ⚑ | Jev |
| ⚠️ | "At the 2026 auction" | §9 · caption | #65 supported ⚑ | code |
| ⚠️ | Source "ESPNcricinfo, IPL 2026 auction" | §9 · `source` | source-line check: cites Premier League (src-01) but the source line does not name it | code (source line) |

## ✅ rows the pre-pass did not confidently support

| | Report claim | Where | Pre-pass claims matched | Routed by |
|---|---|---|---|---|
| ✅ | Line is 85% of each club's own revenue plus what it makes selling players | §2 · `actually.text` | #15 contradicts 0.54 | Jev |
| ✅ | 85% of 2024/25 revenue is about £590m at City, about £155m at Bournemouth | §2 · caption | #13 supports 0.59 | Jev |
| ✅ | Both real ceilings are higher, because player-sale profit adds to the base | §2 · caption | #13 supports 0.59 | Jev |
| ✅ | Two families told to spend at most 85% of what they earn | §3 · intro | #17 supports 0.56 | Jev |
| ✅ | SCR = squad spending (wages, agents' fees, transfer fees) over revenue plus player-sale profit | §3 · `terms[1]` | #18 supports 0.60 | Jev |
| ✅ | Three streams, the league shares out only one | §4 · intro | #20 supports 0.54 | Jev |
| ✅ | Annotation "Highest wage share. Smallest revenue." | §5 · `annotations` | #39 supports 0.85 ⚑ | Jev |
| ✅ | "The rule's own measure adds agents' fees and profit on player sales, so every real figure is lower" | §6 · caption | #40 supports 0.83 | Jev |
| ✅ | Annotation "Smallest revenue. Highest ratio. Same rule." | §6 · `annotations[0]` | #48 supported ⚑ | code |
| ✅ | A rule change needs fourteen of the twenty clubs. This one got them. | §8 · caption | #57 supported ⚑ | code |
| ✅ | 21 Nov 2025 · Squad Cost Ratio approved, the hard cap fails | §8 · `events[1]` | #59 supports 0.73 | Jev |
| ✅ | 2026/27 · the rule binds, PSR is gone; "Fines first payable from 2027/28" | §8 · `events[3]` | #61 says_nothing 0.54 | Jev |
| ✅ | Annotation "The cap that would have narrowed the gap failed here." | §8 · `annotations` | #62 supports 0.83 | Jev |

## Source lines, section by section

| § | Source line | Cites | Check | Report rows on this source |
|---|---|---|---|---|
| 1 power-flow | Deloitte Annual Review of Football Finance 2026 | Deloitte | clean | ✅ |
| 2 you-think | Premier League rules and club accounts, 2024/25 | Premier League, The Swiss Ramble | cites The Swiss Ramble (src-06, src-12) but the source line does not name it | ⚠️ |
| 3 jargon-buster | Premier League | Premier League, The Swiss Ramble | cites The Swiss Ramble (src-13) but the source line does not name it | ⚠️ |
| 4 channel-ternary | The Swiss Ramble, club accounts 2024/25 | The Swiss Ramble | clean | ✅ |
| 5 benchmark-chart | Club accounts and Deloitte | Deloitte, The Swiss Ramble | cites The Swiss Ramble (src-06, src-07, src-08, src-09, src-10, src-11, src-12) but the source line does not name it | ⚠️ |
| 6 scaling-plot | Club accounts, 2024/25 | The Swiss Ramble | cites The Swiss Ramble (src-06, src-07, src-08, src-09, src-10, src-11, src-12) but the source line does not name it | ⚠️ |
| 7 data-readout | Deloitte Annual Review of Football Finance 2026 | Deloitte, The Swiss Ramble | cites The Swiss Ramble (src-10) but the source line does not name it | ⚠️ |
| 8 timeline | Premier League statements | Premier League, The Swiss Ramble | cites The Swiss Ramble (src-14) but the source line does not name it | ⚠️ |
| 9 comparison | ESPNcricinfo, IPL 2026 auction | Premier League, ESPNcricinfo | cites Premier League (src-01) but the source line does not name it | ⚠️ |

## The labelled set (for calibration, CP-06)

| # | Label | Verdict | p(supports) | p(pick) | Code flags | Claim |
|---|---|---|---|---|---|---|
| 1 | ⚠️ | supports | 0.96 | 0.96 | — | This one is 85% of what each club earns. |
| 2 | ⚠️ | supports | 1.00 | 1.00 | — | Manchester City gets £590m, Bournemouth £155m. |
| 3 | ⚠️ | supports | 0.98 | 0.98 | — | A Premier League club may now spend 85% of its own revenue on its squad. |
| 4 | ✅ | supports | 0.98 | 0.98 | — | £6.8bn in. £4.4bn out. |
| 5 | ✅ | supports | 1.00 | 1.00 | — | Matchday passed £1bn for the first time. Wages took £4.4bn of the £6.8bn. |
| 6 | ✅ | supports | 0.97 | 0.97 | — | Matchday → Football revenue: £1000m (first time above £1bn) |
| 7 | ✅ | supports | 1.00 | 1.00 | — | Broadcast → Football revenue: £3400m (shared nearly equally) |
| 8 | ✅ | supports | 0.99 | 0.99 | — | Commercial → Football revenue: £2400m (not shared between clubs) |
| 9 | ✅ | supports | 1.00 | 1.00 | — | Football revenue → Wages: £4400m (65% of revenue) |
| 10 | ✅ | supports | 0.98 | 0.98 | — | Football revenue → Everything else the clubs spend or keep: £2400m (transfer fees and running the cl |
| 11 | · | supports | 0.99 | 0.99 | — | One rule, twenty different ceilings |
| 12 | ✅ | supports | 0.97 | 0.97 | — | Nearly two thirds of what the clubs earned from football went out as wages. |
| 13 | ✅ | supports | 0.59 | 0.59 | — | 85% of 2024/25 revenue is about £590m at Manchester City and about £155m at Bournemouth. Both real c |
| 14 | ✅ | supports | 0.98 | 0.98 | — | Same percentage, different revenue. Manchester City earned £694m, Bournemouth £182m. |
| 15 | ⚠️ | contradicts | 0.43 | 0.54 | — | Actually: 85% of your own revenue. The line is drawn at 85% of each club's own revenue plus what it  |
| 16 | · | supports | 0.95 | 0.95 | — | Four terms, in plain English |
| 17 | ✅ | supports | 0.56 | 0.56 | — | Think of two families told to spend at most 85% of what they earn. |
| 18 | ⚠️ | supports | 0.60 | 0.60 | — | Squad Cost Ratio. Squad spending (wages, agents' fees, transfer fees) as a share of revenue plus pla |
| 19 | ✅ | supports | 1.00 | 1.00 | — | PSR. The old rule: a club could lose at most £105m over three seasons, whatever its size. |
| 20 | ✅ | supports | 0.54 | 0.54 | — | Three streams, and the league shares out only one. |
| 21 | ✅ | supports | 0.98 | 0.98 | — | Broadcast money, shared nearly equally by the league, is 81.5% of Bournemouth's income and 40.2% of  |
| 22 | ✅ | supports | 1.00 | 1.00 | — | Manchester City: Matchday 0.108, Broadcast 0.402, Commercial 0.49 |
| 23 | ✅ | supports | 1.00 | 1.00 | — | Liverpool: Matchday 0.165, Broadcast 0.376, Commercial 0.459 |
| 24 | ✅ | supports | 1.00 | 1.00 | — | Arsenal: Matchday 0.223, Broadcast 0.396, Commercial 0.381 |
| 25 | ✅ | supports | 1.00 | 1.00 | — | Manchester United: Matchday 0.24, Broadcast 0.26, Commercial 0.5 |
| 26 | ✅ | supports | 1.00 | 1.00 | — | Aston Villa: Matchday 0.103, Broadcast 0.651, Commercial 0.246 |
| 27 | ✅ | supports | 1.00 | 1.00 | — | West Ham: Matchday 0.172, Broadcast 0.581, Commercial 0.247 |
| 28 | ✅ | supports | 1.00 | 1.00 | — | Bournemouth: Matchday 0.037, Broadcast 0.815, Commercial 0.148 |
| 29 | · | supports | 0.86 | 0.86 | — | Wages against revenue, seven clubs |
| 30 | ✅ | supports | 1.00 | 1.00 | — | Bournemouth spent 86.8% of revenue on wages. The league average was 65%. |
| 31 | · | supports | 1.00 | 1.00 | — | Premier League average, 2024/25: 65% |
| 32 | · | supports | 1.00 | 1.00 | — | Bournemouth: 86.8% |
| 33 | ✅ | supports | 1.00 | 1.00 | — | West Ham: 77.2% |
| 34 | ✅ | supports | 1.00 | 1.00 | — | Aston Villa: 72.2% |
| 35 | ✅ | supports | 1.00 | 1.00 | — | Liverpool: 60.9% |
| 36 | ✅ | supports | 1.00 | 1.00 | — | Manchester City: 58.8% |
| 37 | ✅ | supports | 1.00 | 1.00 | — | Arsenal: 50.3% |
| 38 | · | supports | 1.00 | 1.00 | — | Manchester United: 46.9% |
| 39 | ✅ | supports | 0.85 | 0.85 | ranks the chart's figures ("Highest"): recompute it from the section's own data | Callout on "Bournemouth": Highest wage share. Smallest revenue. |
| 40 | ✅ | supports | 0.83 | 0.83 | — | Wages plus player amortisation over revenue, worked out from the accounts. The rule's own measure ad |
| 41 | ✅ | supports | 1.00 | 1.00 | — | Liverpool: Revenue, 2024/25 (£m) 703; Squad cost as a share of revenue (wages plus player amortisati |
| 42 | ✅ | supports | 1.00 | 1.00 | — | Manchester City: Revenue, 2024/25 (£m) 694; Squad cost as a share of revenue (wages plus player amor |
| 43 | ✅ | supports | 1.00 | 1.00 | — | Arsenal: Revenue, 2024/25 (£m) 690; Squad cost as a share of revenue (wages plus player amortisation |
| 44 | ✅ | supports | 1.00 | 1.00 | — | Manchester United: Revenue, 2024/25 (£m) 667; Squad cost as a share of revenue (wages plus player am |
| 45 | ✅ | supports | 1.00 | 1.00 | — | Aston Villa: Revenue, 2024/25 (£m) 378; Squad cost as a share of revenue (wages plus player amortisa |
| 46 | ✅ | supports | 1.00 | 1.00 | — | West Ham: Revenue, 2024/25 (£m) 228; Squad cost as a share of revenue (wages plus player amortisatio |
| 47 | ✅ | supports | 1.00 | 1.00 | — | Bournemouth: Revenue, 2024/25 (£m) 182; Squad cost as a share of revenue (wages plus player amortisa |
| 48 | ✅ | supports | 0.90 | 0.90 | ranks the chart's figures ("Smallest"): recompute it from the section's own data | Callout on "Bournemouth": Smallest revenue. Highest ratio. Same rule. |
| 49 | ❌ | says_nothing | 0.03 | 0.86 | ranks the chart's figures ("Biggest"): recompute it from the section's own data | Callout on "Arsenal": Biggest earners sit furthest below the line. |
| 50 | ✅ | supports | 1.00 | 1.00 | — | Wages barely moved. Losses grew sevenfold. |
| 51 | ✅ | supports | 1.00 | 1.00 | — | Aston Villa's £17m profit rested on £114m from selling the women's team and property rights. |
| 52 | ⚠️ | supports | 1.00 | 1.00 | ranks the chart's figures ("most"): recompute it from the section's own data | Wages went from 64% to 65% while losses rose sevenfold. The accountants Deloitte put most of the £81 |
| 53 | ✅ | supports | 1.00 | 1.00 | — | Pre-tax losses, 2024/25: £948m. Up from £135m the season before |
| 54 | ✅ | supports | 1.00 | 1.00 | — | Wages as a share of revenue: 65%. It was 64% the season before |
| 55 | ✅ | supports | 1.00 | 1.00 | — | Clubs in operating profit: 8. Thirteen managed it the year before |
| 56 | ✅ | supports | 1.00 | 1.00 | — | Total revenue: £6.8bn. A record, and up 8% |
| 57 | ✅ | supports | 0.99 | 0.99 | passage 9.1/item1 is marked [UNVERIFIED] (section heading) | A rule change needs fourteen of the twenty clubs. This one got them. |
| 58 | ✅ | supports | 0.98 | 0.98 | — | 2024 · Clubs agree to explore a hard cap. A vote to investigate, not to adopt |
| 59 | ✅ | supports | 0.73 | 0.73 | — | 21 Nov 2025 · Squad Cost Ratio approved. The hard cap fails. Shareholders backed one rule and not th |
| 60 | ⚠️ | supports | 0.99 | 0.99 | — | 8 Jul 2026 · Deloitte counts £948m of losses. The season these rules answer |
| 61 | ✅ | says_nothing | 0.16 | 0.54 | — | 2026/27 · The rule binds. PSR is gone. Fines first payable from 2027/28 |
| 62 | ✅ | supports | 0.83 | 0.83 | — | Callout on "21 Nov 2025": The cap that would have narrowed the gap failed here. |
| 63 | · | supports | 0.45 | 0.45 | passage 4.7/item1 is marked [PARTIAL] | The IPL draws one line for ten |
| 64 | ❌ | supports | 0.66 | 0.66 | passage 9.1/item1 is marked [UNVERIFIED] (section heading) | Fourteen clubs chose a share of themselves. |
| 65 | ❌ | supports | 1.00 | 1.00 | passage 4.7/item2 is marked [PARTIAL] | The IPL cap is one amount for all ten franchises. At the 2026 auction one franchise had ₹2.75 crore  |
| 66 | ❌ | contradicts | 0.40 | 0.57 | passage 4.7/item1 is marked [PARTIAL] | What the cap is. Premier League, from 2026/27: 85% of the club's own football revenue \| IPL, 2026:  |
| 67 | ✅ | supports | 1.00 | 1.00 | — | Same number for everyone? Premier League, from 2026/27: No. Twenty clubs, twenty ceilings \| IPL, 20 |
