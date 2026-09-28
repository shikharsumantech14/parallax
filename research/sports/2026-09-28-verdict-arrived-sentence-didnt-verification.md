# Verification Report: No City decision published in 1,330 days

- **Draft:** src/content/issues/2026-09-28-verdict-arrived-sentence-didnt/index.mdx
- **Dossier:** research/sports/2026-09-28-verdict-arrived-sentence-didnt-dossier.md
- **Storyboard:** research/sports/2026-09-28-verdict-arrived-sentence-didnt-storyboard.md
- **Verified:** 2026-09-28
- **Verdict:** BLOCKED

---
## Overall verdict

**No blocker here is an invented fact, and none needs another research run.** The
hard part of this issue came out right: the 1,330-day clock re-derives exactly
from the two anchored dates (2023-02-06 → 2026-09-28 = 1,096 + 234 = **1,330**),
the reported verdict is attributed as something *you read* in all four places it
appears and never asserted in Parallax's own voice (dossier §9.1, §9.9), the
contested 115 / 114 / 130 counts appear nowhere, Everton's post-appeal "6" and
the 0.31 pts/£m derived from it appear nowhere, Manchester City is not drawn as
a zero-length rung on the ladder, the W.82.2 quote is verbatim from a T0 open
source the dossier fetched, and the historical pound figures stay unconverted
while both current ones carry a bracketed ₹. Kinds, order and hero match the
storyboard row for row.

Two things block. **First, an ❌ UNVERIFIED CLAIM USED, in two fields:** the
benchmark chart's caption and Everton's sublabel both state as fact that the
ten-point deduction was "later reduced on appeal". That is the one item the
dossier marks `[UNVERIFIED]` twice over (§4e row 1, §4a-bis "Everton — STILL NOT
ANCHORED"), because the February 2024 statement was never reachable; no
allowlisted source fetched in either run carries the reduction at all, not just
the number. The draft omits the figure, which the storyboard asked for, but
still asserts the event with no hedge and no `# EDITOR:` note. Cost: one clause,
cut in two places, or an editor note naming the unfetched statement. **Second, a
sourcing floor the draft cannot fix by itself:** premierleague.com is 6 of the
draft's 12 sources = **50%**, over the 40% ceiling. This is the dossier's known
structural block (§8 caveat, §9.5, storyboard §8.11) and it needs the operator's
ruling on the denominator, not more drafting.

Everything else is ⚠️: a rupee figure rounded away from its own derivation
(₹1,300 crore for a £105m cap that computes to ₹1,332.85 crore), one over-broad
generalisation of the dossier's deadline finding, one causal reading stated in
Parallax's voice with only the dossier's own argument behind it, a `plain` line
that reads the data, and four small wording overreaches.

**Jev pre-pass reconciliation.** I traced all 46 pre-pass claims first and
overrode six of its routing verdicts. #2, #6, #23, #26, #35 (the "1,330"
family): **verified by recomputation** — 1,327 is charge-to-reported-verdict,
1,330 is charge-to-today, and the storyboard (§8, authoring notes) specifies
1,330 precisely because it does not depend on the unverified verdict date. #7
("0 decisions published", marked *contradicts* at p 0.93): the pre-pass matched
it to a §6 bibliography row about the Forest appeal; the claim is verified by
absence (§3, 2026-09-28). #8, #34: the `[UNVERIFIED]` tag on §4e row 5 attaches
to the *verdict*, not to the absence of a sanction, which §4c verifies by
absence. #40, #41, #43: the pre-pass was right to stop on the power-matrix
intro — see ⚠️ row 53 below. #28's code flag on ₹1,300 crore was correct and is
a required fix. One pre-pass hit I keep in full: the §2 source-line flag.

---
## Claim verification

| # | Claim | Location | Status | Note |
|---|---|---|---|---|
| 1 | No City decision published in 1,330 days | head · title | ✅ | 1,096 + 234 = 1,330 from §4a charge date and §3's 2026-09-28 absence row |
| 2 | "You read that City were found guilty" | head · hook | ✅ | §2 [UNVERIFIED], carried as reported inside "You read that", per §9.1/§9.9(c) |
| 3 | "Three days later" | head · hook | ✅ | §2: 2026-09-25 → 2026-09-28 = 3 days |
| 4 | 1,330 days after the charge, nothing to read | head · hook | ✅ | §3 charge row + §3 2026-09-28 row |
| 5 | The League's own rule promises a published award | head · dek | ✅ | §4a, Rule W.82.2 |
| 6 | "On 25 September, reports said a panel had found against Manchester City" | head · primer | ✅ | §2, hedged to "reports said" |
| 7 | "We checked the League's website but found no decision" | head · primer | ✅ | §3, premierleague.com domain-restricted search, 2026-09-28 |
| 8 | As of 28 Sep 2026 no published decision and no punishment | data-readout · caption | ✅ | §3 final row; §4c "verified by absence" |
| 9 | 1,330 days since the charge; charged 6 Feb 2023; three and a half years | data-readout · tiles[0] | ✅ | 1,330 ÷ 365.25 = 3.64; §10 row 3 uses "three and a half years" |
| 10 | 0 decisions published; the League's rule promises one | data-readout · tiles[1] | ✅ | §4c + §4a W.82.2 |
| 11 | 0 punishments imposed; no points off, no fine | data-readout · tiles[2] | ✅ | §4c, verified by absence |
| 12 | 63 days, referral to four points off (Forest) | data-readout · tiles[3] | ✅ | §4e: 2024-01-15 → 2024-03-18 = 63 |
| 13 | "Two of these four numbers are zero" | data-readout · title | ✅ | Recounted against the tiles: 1,330 / 0 / 0 / 63 |
| 14 | Guilty and punished are two different stages | you-think · title | ✅ | §1 |
| 15 | No decision published, no punishment exists | you-think · caption | ✅ | §4c |
| 16 | "so nothing has changed on the league table" | you-think · caption | ⚠️ | Added entailment. No dossier row addresses the current table; §1 says only that results inside the charge window are final. Cut or source |
| 17 | "You read that a panel found against City, so the punishment comes next" | you-think · data.think | ✅ | Reader-assumption panel, attributed as reported (§9.9) |
| 18 | 0 published decisions; the website carries no decision and no punishment | you-think · data.actually | ✅ | §4c, §3 |
| 19 | "In court you at least get a date for sentencing. Here, no date." | you-think · data.note | ⚠️ | Storyboard-authorised analogy, but it states a legal fact with no dossier anchor and no jurisdiction. Keep it as form or cut |
| 20 | "three other clubs had their cases dealt with while City's first stage stayed open" | timeline · intro | ⚠️ | True of Forest (appeal dismissed 2024-05-07) and Chelsea (settled). Everton's two appeals are unanchored in the dossier (§4a-bis); "dealt with" overstates that row |
| 21 | Two clubs docked points, one settled, while City waited | timeline · caption | ✅ | §3 rows 2023-11-17, 2024-03-18, 2024-04-08, 2026-03-16 |
| 22 | May 2018: City finish on 100 points, nineteen clear, inside the charge window | timeline · events[0] | ✅ | §4j; season ends May 2018; the "largest in PL history" superlative is correctly not claimed (storyboard §8.5) |
| 23 | 6 Feb 2023: charged, five categories, across fourteen seasons | timeline · events[1] | ✅ | §4a: five categories, 2009/10–2022/23 = 14 seasons |
| 24 | 17 Nov 2023: Everton lose 10 points; £124.5m against a £105m limit | timeline · events[2] | ✅ | §3, §5 (Commission quote) |
| 25 | 18 Mar 2024: Forest lose 4 points, sixty-three days after referral | timeline · events[3] | ✅ | §3, §4e |
| 26 | 16 Mar 2026: Chelsea settle; fines and transfer bans agreed, no points lost | timeline · events[4] | ✅ | §3: £10m + £750,000, academy ban, suspended first-team ban, no deduction |
| 27 | 28 Sep 2026: City, still nothing published | timeline · events[5] | ✅ | §3 final row |
| 28 | Annotation on 18 Mar 2024: "Charged after City, finished long before it" | timeline · annotations[0] | ✅ | Forest referred 2024-01-15, after 2023-02-06. Anchor string matches the event date exactly, so it will render |
| 29 | Forest's whole case took 113 days | latency-waterfall · title | ✅ | §4e top-up: 63 + 50 = 113 |
| 30 | "The calendar showed one case finished and another still open" | latency-waterfall · intro | ✅ | Restatement of the timeline (contract §3 rule 5) |
| 31 | Forest 113 days; City's first stage 1,330 days and has not stopped | latency-waterfall · caption | ✅ | §4e; 1,330 recomputed |
| 32 | Spans 0/63, 63/50, 0/1330 days | latency-waterfall · data.spans | ✅ | Appeal leg recomputed: 2024-03-18 → 2024-05-07 = 13 + 30 + 7 = 50 |
| 33 | Arbitration: a private panel both sides accept, not a public court | jargon-buster · terms[0] | ✅ | §1 |
| 34 | PSR: a cap on losses of £105m | jargon-buster · terms[1] | ✅ | §4a category (4), §4d threshold column |
| 35 | "In rupees, about ₹1,300 crore" | jargon-buster · terms[1] | ⚠️ | §4i: £105m × ₹126.9378 = **₹1,332.85 crore**; dossier and storyboard both specify "about ₹1,330 crore". ₹1,300 crore rounds 2.5% off its own derivation |
| 36 | "Europe's top divisions lose about 4% of revenue before tax each year" | jargon-buster · terms[1] | ⚠️ | §4a-ter derives 4.0% from €1.2bn pre-tax losses (2023 and 2024) against €30bn revenue (2025). "each year" generalises two reported years. UEFA attribution in the source line is correct and must stay (§4a-ter caveat) |
| 37 | Final award: the finding and the punishment together; none exists here yet | jargon-buster · terms[2] | ✅ | §4a, §4c |
| 38 | Sanction agreement: the club admits the breach and agrees its punishment | jargon-buster · terms[3] | ✅ | §3 2026-03-16, §4h |
| 39 | "Chelsea and Forest were credited with exceptional cooperation for admitting the breach" | benchmark-chart · intro | ⚠️ | §4h credits Chelsea for self-reporting, admissions **and** exceptional cooperation, and Forest for exceptional cooperation. "for admitting the breach" makes admission the reason for the credit, which no source says. Split the two |
| 40 | "How fast a case moves depends on how hard it is fought" | benchmark-chart · intro | ⚠️ | Traces only to the dossier's own §1 structural argument. No allowlisted source states the causal claim; the League has never said it. Soften to the observed pattern (the fast cases are the admitted ones) or attribute |
| 41 | "Everton lost ten points, later reduced on appeal" | benchmark-chart · caption | ❌ | **UNVERIFIED CLAIM USED.** §4e row 1 and §4a-bis mark the reduction `[UNVERIFIED]`; the Feb 2024 statement was never fetched, so the event, not only the "6", is unanchored. Stated flat, with no hedge and no `# EDITOR:` note |
| 42 | Everton, Nov 2023: 10 points. "Breach admitted. Later reduced on appeal." | benchmark-chart · items[0] | ❌ | Same as 41. "Breach admitted" is fine (§4h, and storyboard §8.8 correctly avoids crediting Everton with cooperation); the reduction clause is not |
| 43 | Nottingham Forest, Mar 2024: 4 points. Appeal dismissed, four points stood | benchmark-chart · items[1] | ✅ | §4a-bis, PL 7 May 2024 — the anchor postdates the fact it carries |
| 44 | Everton, Apr 2024: 2 points, second breach, same club | benchmark-chart · items[2] | ✅ | §3, §4e |
| 45 | Chelsea, Mar 2026: 0 points; £10.75m in fines (about ₹136 crore) | benchmark-chart · items[3] | ✅ | §3 (£10m + £750,000 = £10.75m); §4i (₹136.46 crore), hedged as required |
| 46 | Manchester City, Sep 2026: 0 points. Nothing published, nothing imposed | benchmark-chart · items[4] | ✅ | §4c, verified by absence. Highlight flag matches the storyboard |
| 47 | Annotation: "63 days from referral. City, 1,330 and counting." | benchmark-chart · annotations[0] | ✅ | §4e + recomputed 1,330. Anchor string matches the item label exactly |
| 48 | "Everyone else's punishment has a number" | benchmark-chart · title | ✅ | 10 / 4 / 2 / £10.75m against City's nothing |
| 49 | "Forest went furthest over, but did not lose the most points" | margin-ladder · intro | ✅ | Recomputed: 34.5 > 19.5 > 16.6 absolute and 56.6% > 18.6% > 15.8% relative; 4 points < 10 |
| 50 | "Rank the same cases … and City is missing" | margin-ladder · intro | ⚠️ | The ladder drops two of the chart's five cases. Chelsea is absent too and goes unmentioned, so "the same cases" is not accurate. Say "the cases with a published figure" |
| 51 | Forest went £34.5m over a £61m limit, the widest gap here | margin-ladder · caption | ✅ | §4d; ranking recomputed against the three rungs drawn |
| 52 | Rungs 34.5 / 19.5 / 16.6 with outcomes 4 / 10 / 2 | margin-ladder · data.rows | ✅ | §4d. Everton's 19.5 is itself derived (124.5 − 105) ✅. City correctly not authored at margin 0, per storyboard authoring note |
| 53 | "Not one of these eight stages comes with a deadline" | power-matrix · intro | ⚠️ | §4f anchors two narrower things: the "Setting the deadline" row is `none` across all four parties, and neither rule **as quoted in the League's statement** attaches a time limit. Extending that to all eight stages is unsourced |
| 54 | "Under Premier League Rule W.82.2, the Commission's final award will be published on the Premier League's website." | power-matrix · intro | ✅ | Verbatim against §5 quote 1, character for character. Quotable: src-01 is T0, open, fetched by the dossier (`full`) |
| 55 | "publication is promised, but never a date" | power-matrix · intro | ✅ | §4f |
| 56 | The Judicial Panel picks each case's panel, called a Commission | power-matrix · howToRead | ✅ | §4a: members appointed by the independent Chair of the Judicial Panel. (Placement flagged in the register table) |
| 57 | Nobody holds the bottom row; the contested cell is publication; in 2021 City lost a Court of Appeal fight to keep a ruling unpublished | power-matrix · caption | ✅ | §4f bottom row; §4f contested cell; §3 2021 row and §1 (the case City itself brought and lost) |
| 58 | All 12 authored cells and 4 parties | power-matrix · data | ✅ | Each cell matches §4f, including the empty "Setting the deadline" row and the all-`none` Other 19 clubs column. Row renames ("Setting the punishment", "The appeal", "Further challenge in court") change no value |
| 59 | "Nobody in that grid held a deadline" | comparison · intro | ✅ | Restatement of the hero (contract §3 rule 5) |
| 60 | India's Supreme Court committee asked for officers who exist before the dispute does | comparison · intro + rows | ✅ | §4i; "asked for" / "recommended", never "built", as the storyboard requires |
| 61 | "A smaller Indian football case, one defender's contract, was reported cleared in nine days" | comparison · intro | ✅ | §4i: 2024-09-11 → 2024-09-20 = 9 days. Carries the dossier's hedge ("reported") and is used as scale, not equivalence |
| 62 | The committee asked for standing officers; the Premier League convenes a panel per case | comparison · caption | ✅ | §4i |
| 63 | Rows: who decides · when it starts · where it came from | comparison · data.rows | ✅ | §4i (Ombudsman / Ethics Officer / Electoral Officer verbatim in substance; SC committee constituted 22 Jan 2015) |
| 64 | "Who sets the date — Nobody. No rule fixes one." | comparison · data.rows | ⚠️ | Same overreach as row 53, one notch milder. §4f supports "no rule quoted in the League's statement fixes one" |

**Totals: 52 ✅ verified · 10 ⚠️ imprecise · 2 ❌ untraced/unverified.**

Quotability gate: one verbatim quote in the issue (Rule W.82.2), from
premierleague.com — T0, `access: open`, fetched and transcribed by the dossier
(§6, `full`). No quote rests on a `metadata`-class source, a snippet or a
paraphrase. The press reports of the verdict are referenced, never quoted, which
is exactly what §9.7 demands. **No ❌ NON-QUOTABLE SOURCE.**

---
## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | Clean. No advocacy, no wire tone, no rhetorical-question closer, no passive filler, no meta-commentary. "Found guilty" appears only inside "You read that". No em-dash anywhere in reader-facing prose (cap is one per issue), no semicolons, colons only before a gloss. No word from the AI list. No binary reframe, no triple-fragment closer, no stacked citation, no once-used name. Titles state findings, not subjects |

One borderline item, recorded but not flagged: "How fast a case moves depends on
how hard it is fought" is a causal reading, not a forecast, so it is not ❌
SPECULATION. It is claim row 40 above.

---
## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ PLAIN-CLAIM | benchmark-chart · `plain` | medium | "A bar of zero length means no points were taken" reads the data instead of the form, and it sits against the caption's own reason for City's empty bar ("because nothing has been published"). Rewrite to form: "Each bar's length is the number of points deducted; a case with none draws no bar." |
| ⚠️ SOURCE-NARROW | `sources[]` | **blocking-adjacent** | 12 sources ✅, 6 publishers ✅, but premierleague.com is 6 of 12 = **50%**, over the 40% ceiling. Dossier §8 / §9.5 / §11 call this structural (the League is the only allowlisted publisher of its own disciplinary record) and leave the denominator to the operator. Not fixable by drafting |
| ⚠️ SINGLE-VIEWPOINT | benchmark-chart · intro; jargon-buster · terms[0] | low | The interpretation layer (arbitration has no clock; speed tracks how hard a case is fought; the cooperation discount) is carried in Parallax's voice on the dossier's §1 argument plus the League's own statements. Dossier §9.8: two viewpoint clusters, "only just". The primary anchor is comfortable (T0 PL, T2 Harvard, T6 Lodha), so this is not NO PRIMARY ANCHOR |
| ⚠️ JARGON-UNGLOSSED | power-matrix · intro → howToRead | low | "Commission" first reaches the reader in the intro (inside the W.82.2 quote) and is glossed in the `howToRead` panel, which renders after it. Contract §3 rule 2 excludes the how-to-read panel as a glossing site. Move the six words into the intro |
| ⚠️ HINDI-SPELLING | head · dek ("abhi tak") | low | *abhi* is in the lexicon; *tak* is not. Skip test passes ("Still nothing." carries the whole claim), field is allowed, density is one phrase, script is roman. Either an operator ruling adding *tak* to the lexicon, or cut to "Still nothing, abhi." / "Still nothing." |
| ⚠️ HINDI-SPELLING | jargon-buster · terms[0] ("like a panchayat") | low | Not in the lexicon, and it sits inside a legal gloss, where the contract keeps the register at L1. Skip test passes (delete it and the gloss is intact). Storyboard row 5 specified it, so this is a lexicon ruling, not a drafting error |
| ⚠️ source-line mismatch | you-think · `source` | low | "Reported finding, checked against premierleague.com, where none is published" cites src-01, a Premier League statement, without naming the publisher, and "none" has no antecedent. Name the League and the thing absent |
| ✅ HINDI-LOAD-BEARING | — | — | None. Read as Karthik, every sentence survives the deletion of every Hindi word |
| ✅ HINDI-FIELD | — | — | No Hindi in any caption, `howToRead`, `plain`, source line or data label. The eyebrow "THE HISAAB" is the lexicon's own worked example |
| ✅ BARE-NUMBER | — | — | 1,330 days gets "three and a half years"; 63 and 113 are set against 1,330; £105m and £10.75m each carry a bracketed ₹ with the rate and its date in the section source line; the five historical pound figures stay unconverted, per §4i |
| ✅ NO-INDIAN-ANCHOR | — | — | Two ₹ conversions, the Lodha comparison, the Anwar Ali nine days, the panchayat image |
| ✅ NAME-THROUGHPUT / NAME-UNPLACED | — | — | About eleven named bodies, no named individuals at all, each with a role phrase, none used once. Fewer names than the storyboard's ten-name list, which is the safe direction and removes the Lord Dyson `[UNVERIFIED]` title risk entirely |
| ✅ ANALOGY-CLAIM | — | — | The panchayat, the stopwatch framing and the sentencing-date line misstate no mechanism the dossier describes (the sentencing line's own traceability is claim row 19) |
| ✅ HOOK-ABSTRACT / TITLE-FORMULA | — | — | Hook: 22 words, two figures, a "you", the twist. Title states the finding and is not "The ‹Noun› That ‹Verb›s" |
| ✅ TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC / HEAD-HEAVY | — | — | 9 of 9 sections visual; no text-only section, so none adjacent; row 1 is a `data-readout`; about 69 words before it; about 1,040 reader-facing words against the 1,100 ceiling |
| ✅ FEW-GRAPHICS / CARD-HEAVY / NO-NEW-KIND | — | — | Drawn graphics 5 of 9 = 56% (floor 40%); 5 distinct graphic kinds (floor 3); 2 plain-language cards, one each (cap 3); 2 kinds new to the publication, `latency-waterfall` and `margin-ladder` (floor 2) |
| ✅ REDUNDANT-HOWTO / CAPTION-FORM | — | — | Both `howToRead` panels name what a mark is and what the axes mean; neither restates its `plain` line. Every caption asserts data |
| ✅ STORYBOARD-DRIFT | — | — | Kinds, order, hero and layouts match row for row: data-readout, you-think (breath), timeline, act-break, latency-waterfall, jargon-buster (breath), benchmark-chart, margin-ladder, act-break, power-matrix (wide, hero), comparison (breath). Both act-breaks bare. The title and primer are reworded from the storyboard's and the names list is thinner; both are within the composer's latitude and neither changes a claim |
| ✅ QUESTION-UNANSWERED | — | — | All three storyboard questions answer from the draft alone: what has not happened (rows 1, 2, 10), why Forest took 113 days and City 1,330 (rows 5, 7, 10), who could set a date (rows 10, 11) |

---
## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ | |
| All section kinds registered | ✅ (not machine-checked) | Inputs were inlined, so `config.ts` was not read this run. `latency-waterfall` and `margin-ladder` are new to the publication; confirm both are in `SECTION_KINDS` with components before the build |
| No author field | ✅ | |
| publishedAt valid | ✅ | 2026-09-28, today |
| Source URLs https:// | ✅ | All 12 |
| Source kinds valid | ✅ | 9 `primary`, 1 `analysis`, 2 `secondary`; each matches the dossier §8 tag |
| ≥8 sources | ✅ | 12 sources, 6 publishers |
| No publisher above 40% | ❌ | Premier League 6 of 12 = 50%. Operator ruling required (dossier §11, block 1) |
| `sourceRefs` all resolve | ✅ | src-01…src-12 all exist and all are used; every section carries a source line, so none renders bare |
| Field bounds | ✅ | primer ~168 chars (80–420); both `howToRead` inside 40–360; all `plain` well under 220; `layout` only `wide` / `breath`; no `skimCaption` outside `prose`; one comprehension panel per section |

---
## Required fixes before publish

1. **Resolve the Everton appeal reduction (❌, blocks).** Cut "later reduced on
   appeal" from the benchmark chart's caption **and** "Later reduced on appeal."
   from `items[0].sublabel`, or keep one of them and add an `# EDITOR:` note
   stating that the reduction rests on a February 2024 Premier League statement
   no allowlisted source fetched in either research run (dossier §4a-bis, §4e
   row 1, §11 change 2). Do not print 6, 8 or 0.31 pts/£m. The caption still
   works as "Everton lost ten points, Forest four, Everton two more. City's bar
   is empty because nothing has been published."
2. **Get the operator's ruling on the publisher denominator (❌, blocks).**
   premierleague.com is 6 of 12 sources (50%) on the draft's own list, 8 of 20
   (40.0%) on the dossier's full list, 7 of 13 (53.8%) on rows that yielded
   content. Nothing in the draft depends on the answer; the floor does.
3. **Fix the rupee figure.** "about ₹1,300 crore" → **"about ₹1,330 crore"**
   (£105m × ₹126.9378 = ₹1,332.85 crore, dossier §4i, storyboard §5). Two words.
4. **Narrow the deadline claim.** Power-matrix intro: "Not one of these eight
   stages comes with a deadline" → what §4f anchors, e.g. "No party in this grid
   holds the clock, and no rule quoted in the League's own statement sets a
   date." Apply the same narrowing to the comparison row "Nobody. No rule fixes
   one."
5. **Rewrite the benchmark chart's `plain` to form only** (see the register
   table). The data claim it currently makes is already in the caption.
6. **Cut or source "so nothing has changed on the league table"** in the
   you-think caption. The caption is fully anchored without it.
7. **Attribute or soften "How fast a case moves depends on how hard it is
   fought."** It is the dossier's §1 reading, not a sourced finding. Stating the
   pattern instead ("the cases that finished fast are the ones where the club
   admitted the breach") keeps the point and loses the unsourced causation.
8. **Separate admission from cooperation** in the benchmark intro: §4h credits
   Chelsea for self-reporting, admissions *and* exceptional cooperation, and
   Forest for exceptional cooperation. "credited … for admitting the breach" is
   a causal claim no source makes.
9. **Fix "Rank the same cases"** in the margin-ladder intro: two of the five
   cases are absent, not one. "Rank the cases with a published figure" costs
   nothing and is true.
10. **Scope the UEFA line.** "lose about 4% of revenue before tax each year" →
    the years UEFA reports (€1.2bn in 2023 and again in 2024 against about €30bn
    of revenue). Keep the UEFA attribution and keep it away from the Premier
    League specifically (§4a-ter caveat).
11. **Soften the timeline intro's "dealt with."** Everton's appeal outcomes are
    unanchored (§4a-bis); "had decisions issued" or "were docked and moved on"
    is safe.
12. **Fix the you-think source line** to name the Premier League and the thing
    absent.
13. **Confirm the two new section kinds are registered** with components before
    build (not checkable from the inlined inputs).

---
## Optional improvements

- The head sits at its caps, so fixes 3, 4 and 6 should swap words rather than
  add them. The dek spends 12 of its words already; if the operator rules
  against *tak*, "Still nothing." alone is inside budget.
- Storyboard §5 offered a felt scale for 1,330 days — "four IPL seasons start to
  finish" — and the draft uses only "Three and a half years." The tile note has
  room for the IPL line, which is the Indian anchor the reader can feel.
- `margin-ladder` is new to the publication and ranks by a margin over a
  *per-club* threshold, which is not obvious from the bars. A `howToRead` (40–360
  chars) would carry that; today only the one-line `plain` does.
- The £→₹ rate has no T0–T2 anchor (§9.6: an aggregator figure, not RBI). The
  source lines carry the rate and its date, which is the required hedge, but the
  editor may want "(market rate, 27 September 2026)" so the reader knows it is
  not an official reference rate. I could not re-derive it against RBI this run.
- The you-think note's sentencing-date analogy would be safer as a
  Parallax-voice observation about this process rather than a claim about courts
  in general.
- Frontmatter records a single issue-level `voice: CONVERSATIONAL EXPLAINER`,
  while the storyboard planned four modes across the nine rows (CALM-STRUCTURAL
  on 3 and 8, FORENSIC on 6 and 7). The field can hold only one, so this is a
  record-keeping point, not a defect; the prose does read as the storyboard
  planned.
- Worth keeping in the issue's own record: everything the dossier's two check
  passes and the top-up flagged as unusable — 115 / 114 / 130, Everton's 6, the
  Sep–Dec 2024 hearing window, the 2013/14 margin, the 2017/18 superlative, the
  "deepest litigation capacity" comparative, Lord Dyson's judicial title, the
  candidate's "six-and-a-half years" — is absent from the draft. That is the
  cleanest part of this audit.
