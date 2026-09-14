# Verification Report: Arsenal won the league from the *corner flag* (Phase-4 rewrite)

- **Draft:** src/content/issues/2026-06-04-arsenal-set-piece-title/index.mdx
- **Dossier:** research/sports/2026-06-04-arsenal-set-piece-title-dossier.md
- **Binding over the dossier:** research/sports/2026-09-13-arsenal-re-anchoring.md
- **Storyboard:** research/sports/2026-09-13-arsenal-set-piece-title-storyboard.md (Status: approved, rulings §9)
- **Prior report:** research/sports/2026-06-04-arsenal-set-piece-title-verification.md (NEEDS REVISION)
- **Verified:** 2026-09-14
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION — no blockers, and every one of the prior report's five
required fixes is resolved.** The rewrite is the cleanest provenance pass this
issue has had: 28.5 xGA is corrected to 28.3, "a quarter of their goals" is gone
without trace, "200 consecutive days" is absent as instructed, 25 set-piece
goals ships as a stated derivation with Opta's own breakdown and **without** the
unsourced "most in the division" rank, the 238 figure says *days* not *nights*,
the clinch tile carries the one-word fix the re-anchoring asked for ("were four
points clear", not "finished four points behind"), the StatsBomb line is
verbatim for the first time, the `tactics-pitch` players carry no names, and no
`# EDITOR:` flag ships as visible copy — the provenance note lives inside an
MDX `{/* */}` comment, which renders nothing. **Zero ❌: no untraced claim, no
advocacy, no non-quotable quote, no load-bearing Hindi, no Hindi in the
precision layer.** What holds it short of APPROVED is nine ⚠️, of which three
matter. The biggest is not a fact at all but a **data shape**: the
`match-stat-line` marks a 1–1 draw as a PSG win using colour alone, with no
shootout numerals anywhere in the graphic, while the component's own `score`
field documents `"(4)"` as the convention for exactly this. Second, two claims
are stated a notch stronger than their source: the `benchmark-chart` caption
turns an 11-game snapshot into a season-level league ranking (the qualifier
survives only in the source line), and story beat 5 narrates the **schematic**
shot-map as observed data — in story mode the caption carrying "positions are
schematic" is hidden by `story.css`, so the beat is the only text a story reader
gets. Third, the hero's caption asserts 25 and 19 beside a picture containing 15
goal marks. All three are text-or-field edits; none needs new research.

One thing for the operator rather than the editor: five of the six re-anchored
counting stats rest on **T7** (Opta Analyst), not the T0/T1/T2 primary
`_TAXONOMY.md` §5 prefers. The re-anchoring file flagged this rather than
deciding it ("For the operator to rule", item 1); the draft's MDX note records
that "the operator accepted that tier". That acceptance exists only in the
draft's own comment. Worth one line in the storyboard or the re-anchoring file
so the ruling lives outside the artefact it governs.

---

## Claim verification

51 claims traced. **42 ✅ · 9 ⚠️ · 0 ❌.**

| Claim | Location | Status | Note |
|---|---|---|---|
| 19 league goals from corners, a Premier League record | hook | ✅ | Re-anchoring §4 — Opta 25 May 2026 ("finishing on 19") and 19 Aug 2026 |
| Conceded 27 all season | hook | ✅ | Re-anchoring §1, two independent Opta pieces |
| "The team everyone called boring" | dek | ✅ | Dossier §1 ("pundits and neutrals called boring"); attributed to the pundits, not asserted in Parallax's voice |
| Had not won England's league since 2004 | primer | ✅ | Dossier §2 (last title 2003/04); §7 of the re-anchoring anchors the 22-year wait at T0 |
| Won it in 2026 by giving the ball away and scoring from corners | primer | ✅ | Dossier §1; 18.05 PPDA-against (AL) + 19 corners |
| Three seasons of pretty football finished second | story beat 0 | ✅ | (AL) Coaches' Voice "three consecutive runners-up finishes" |
| 27 conceded · 28.3 xGA · 25 set-piece goals | story beat 2 | ✅ | Re-anchoring §1, §2, §3 — all three carried at source strength |
| "Look at where the goals are. They pile into the same few square yards" | story beat 5 | ⚠️ IMPRECISE | The marks are **drawn**, not tracked. The beat is the only text on a story card, and `story.css` hides `[class$='__cap']` inside a beat — `ShotMap` renders its caption as `.px-viz__cap`, so "positions are schematic; the totals are real" **disappears in story mode**. The reading page is fine (the intro says it); story mode is not. |
| Opponents allowed 18.05 passes per defensive action, "the highest figure in the league" | story beat 7 | ⚠️ IMPRECISE | Dossier §4 records the figure as **after 11 games / Nov 2025**. The beat states it as a season-level league fact with no checkpoint. |
| PSG 74% possession, 2.21 xG; only goal conceded in 120 minutes a penalty | story beat 8 | ✅ | (AL) Coaches' Voice, dossier §4 |
| "Arsenal scored 19 league goals from corners in 2025/26, a Premier League record" | you-think · caption | ✅ | Re-anchoring §4. src-07 (25 May) carries the 19; src-09 (25 Apr) carries the record — see Optional |
| "The previous high was 16" | you-think · note; data-readout tile 4 | ✅ | Re-anchoring §4. Safe phrasing kept: the prior holder is **not** asserted (constraint 8d-3 honoured even though the re-anchoring showed the conflict was false) |
| Finished second three years running playing that way | you-think · actually | ✅ | (AL) Coaches' Voice |
| xG = "how many goals those chances usually turn into, judged by where each shot was taken from" | jargon-buster | ✅ | `research/_voice/jargon.md` sports row; dossier §4 usage |
| **Set piece = "a corner, a free kick or a throw-in: play restarting from a dead ball"** | jargon-buster | ✅ | **Ruled explicitly.** Traced to the binding file: re-anchoring §3 quotes Opta's own breakdown — "four from free-kicks, four penalties and twice from **throw-ins**" inside the 29 set-piece total. Throw-ins are set pieces in the source this issue counts with. `jargon.md`'s narrower row ("a corner or free kick") is the **stale file**, not the draft — see Optional. |
| Open play = "everything that is not a set piece" | jargon-buster | ✅ | jargon.md; dossier §4 |
| Passes per defensive action, glossed | jargon-buster | ✅ | Dossier §4 definition, restated plainly |
| 27 goals conceded, fewest in the league | data-readout tile 1 | ✅ | Re-anchoring §1 |
| "Eight fewer than any other side. Manchester City next, on 35." | data-readout tile 1 · note | ✅ | Re-anchoring §1, Opta verbatim substance ("eight fewer than any other side (Man City next best on 35)") |
| **28.3** expected goals allowed all season | data-readout tile 2 | ✅ | Re-anchoring §2. The published **28.5 was CONTRADICTED** and is correctly replaced. |
| "Under one goal's worth a game; the best figure in Europe's top five leagues" | data-readout tile 2 · note | ✅ | 28.3 ÷ 38 = 0.745, and Opta's own 0.74/game corroborates. Merging the domestic figure with the big-five claim is **Opta's own framing** (re-anchoring §2), which supersedes storyboard constraint 8d-2 — not drift. The probable-misreading "Champions League 0.7" note is correctly dropped. |
| 25 set-piece goals, penalties excluded | data-readout tile 3 | ✅ | Re-anchoring §3, option 2 as recommended: 29 − 4 penalties = 25, and 19 + 4 + 2 = 25. **"Most in the division" is correctly NOT asserted** — that rank is sourced only for 29. |
| "19 from corners. Four from free-kicks, two from throw-ins." | data-readout tile 3 · note | ✅ | Opta's printed breakdown, re-anchoring §3 |
| 19 goals from corners, single-season record | data-readout tile 4 | ✅ | Re-anchoring §4 |
| 238 days spent top of the table | data-readout tile 5 | ✅ | Re-anchoring §5. Opta's sentence is prospective ("will have led"); the projection resolved. **"days", not "nights"** — the correction is applied. "200 consecutive" is absent, as required. |
| "Manchester City spent 229 fewer days there" | data-readout tile 5 · note | ✅ | Opta: "a huge 229 more days than City" — exact inversion |
| May 19, champions with a game to spare | data-readout tile 6 | ✅ | Re-anchoring §7 — the one **T0** anchor (premierleague.com), Matchweek 37 |
| "City drew; Arsenal were four points clear with a game left" | data-readout tile 6 · note | ✅ | Re-anchoring §7's required one-word fix **applied**: four points is the gap *at confirmation*, not the final margin (seven). Bournemouth correctly kept out. |
| "ARSENAL · 2025/26 PREMIER LEAGUE" | data-readout · data.caption | ⚠️ CAPTION-FORM | A scope label, not a data claim. Defensible (the six tiles carry the findings and `.tel__cap` is conventionally a header), but by the contract a caption asserts the finding. Low. |
| 18.05 / 13.93 / 13.87 / 13.67 | benchmark-chart · items | ✅ | (AL) Coaches' Voice, dossier §4, verbatim trio. Club names correctly suppressed ("Next highest") — saves three names. |
| "Opponents made 18.05 passes per defensive action against Arsenal, the highest in the league" | benchmark-chart · caption | ⚠️ IMPRECISE | Reads as a full-season league ranking; the figure is an **11-game** checkpoint. The qualifier exists only in the `source` line, which renders below the plain line. The published issue carried "as of 11 games" inside the tile note; the rewrite lost it from the claim layer. |
| "Arsenal allowed four more passes per defensive action than anyone" | benchmark-chart · annotation | ✅ | Storyboard §5 computation B1: 18.05 − 13.93 = 4.12, both figures from the same sourced row. Sanctioned subtraction, ≤ 12 words, `at: "Arsenal"` resolves to a real item. |
| **"Goals from set pieces are not luck."** | three-steps · intro | ✅ VERBATIM | Dossier §5, character-for-character. **Prior required fix #1 resolved.** Source: StatsBomb blogarchive — allowlisted, open full text, fetched OK (dossier §6) ⇒ **quotable**. |
| "A football data company said it nine years early" | three-steps · intro | ✅ | 2017 → 2026, storyboard §5. Attribution by role, not by stacked citation; StatsBomb named on the source line (rule 9). |
| Analysts find who loses in the air and aim the corner there | three-steps · step 1 | ✅ | (AL) StatsBomb HOPS method, dossier §4. **Not** attributed to Jover or Arsenal — constraint 6 honoured. |
| Arteta hired Nicolas Jover, whose whole job is corners and free kicks | three-steps · step 3 | ✅ | (AL) Coaches' Voice. Formal name, bare role, no "Nico", no "German", no off-allowlist CV. |
| "Arsenal scored 25 league goals from set pieces, 19 from corners; positions are schematic, the totals are real" | shot-map · caption | ✅ | Totals per re-anchoring §3/§4. **Operator ruling 1 honoured** — the honesty line is in the caption, not only the source line. |
| The map draws **15** goal marks beside a caption claiming 25 and 19 | shot-map · data.shots | ⚠️ IMPRECISE | The count of marks matches neither sourced total. Labelled illustrative in caption, intro and source, so not a false claim — but a caption asserting two totals now sits directly above a countable picture that agrees with neither. |
| 20 shot coordinates with per-shot xG | shot-map · data.shots | ⚠️ IMPRECISE | No per-shot event data is sourceable (dossier §9). Sanctioned as illustrative by dossier §7/§9 and operator ruling 1; labelled in three places. The lead mark's optional fix is applied (0.70 → **0.68**). |
| One Premier League goal ≈ £2.5 million, 2017 estimate | number-sense · caption, value | ✅ | (AL) StatsBomb/Knutson, dossier §4; labelled 2017 in the intro, the note and the source line, exactly as the dossier requires |
| ≈ ₹26 crore at ₹105 to the pound, September 2026 | number-sense · equals | ✅ | **Operator ruling 3 honoured in full**: approximate, labelled a 2017 valuation, rate and month in the section's source line. Arithmetic: £2.5m × 105 = ₹26.25 crore. |
| 4-4-2 block, two banks dropped deep, centre-backs Gabriel and William Saliba stepping up | tactics-pitch · intro | ✅ | (AL) Coaches' Voice, dossier §4 |
| 11 player positions | tactics-pitch · data.players | ⚠️ IMPRECISE | Schematic, as dossier §7 sanctions and the source line states. **Names and shirt numbers are stripped** — prior required fix #3 resolved outright, operator ruling 5 honoured. Roles read 4-4-2 and match `formation`. |
| "Arsenal's defensive shape in the 2026 Champions League final" | tactics-pitch · caption | ⚠️ CAPTION-FORM | Names the subject rather than asserting a finding. Low. |
| Eleven days after the title, a 1–1 draw and a 4–3 shootout loss | match-stat-line · intro | ✅ | Dossier §4 (PSG won 4–3 on pens, 30 May); 19 May → 30 May = 11 days |
| Possession 74/26 · shots 20/7 · on target 4/1 · xG 2.21/0.57 | match-stat-line · rows | ✅ | (AL) Coaches' Voice, dossier §4, exact |
| Only goal conceded in 120 minutes was a penalty | match-stat-line · row note | ✅ | (AL) dossier §4 |
| **`home.outcome: "win"` on a 1–1 scoreline** | match-stat-line · data.home | ⚠️ IMPRECISE | **Ruled explicitly: the data shape does not carry it honestly.** The fact (PSG won the shootout) is traced, but the graphic renders `1 — 1` with PSG in `--accent` and Arsenal in plain ink (`sports.css`: `.px-msl__side[data-outcome="win"] { color: var(--accent) }`). A reader of the figure alone sees a drawn match with one side arbitrarily highlighted, and **colour is the only encoding** — an accessibility failure as well as a factual one. No shootout numeral appears anywhere in the component. `MatchStatLine.astro`'s own `score` field documents the fix: `/* "2", "0", or "(4)" for penalties */`. |
| Date: May 30, 2026 | match-stat-line · data.date | ✅ | Dossier §3, §4 |
| Conceded 27 all season, scored 25 from set pieces | prose · paragraph | ✅ | Re-anchoring §1, §3 |

**Quote inventory (verbatim + quotability):** one quoted passage in the issue.

| Quote | Dossier §5 verbatim | Result |
|---|---|---|
| "Goals from set pieces are not luck." | "Goals from set pieces are not luck." | ✅ VERBATIM · ✅ QUOTABLE (StatsBomb blogarchive, allowlisted, open full text) |
| Carragher, "every time they get a corner…" | §5 candidate quote, off-allowlist, "do not use" | ✅ CORRECTLY ABSENT |

*(RAG note: `mcp__parallax_rag__search` is not in this session's tool set, as it
was not in the researcher's. Quotability was assessed against the dossier's
recorded source URLs and `research/_sources/sports.md` tiering per the
fallback in the brief. No GUIDE-ONLY/metadata-only source is quoted.)*

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| "In other words, the season that looked like a retreat was the one that finally ended the wait." | prose · paragraph (closer) | ⚠️ META-COMMENTARY (borderline, not a blocker) | "In other words" is doing the register's restatement work (contract §3 rule 5), and the sentence lands on a fact rather than a verdict — the published closer's "had been the winning machine all along" is gone. Acceptable as written; cutting the connective would cost nothing. |
| Advocacy framing | whole draft | ✅ CLEAN | None. The "boring" judgement is attributed to pundits in the dek and never asserted. |
| Wire tone / rhetorical-question closers / invented consequence | whole draft | ✅ CLEAN | None found. No future-tense claim anywhere. |
| Em-dash density | all prose fields | ✅ CLEAN | Zero em-dashes in the issue; colons and full stops carry the joins. |
| Binary reframe (AI-tell 2) | hook only | ✅ CLEAN | "a factory, not a football team" — one, in the hook, and the reversal **is** the argument. The dek does not reverse; `you-think`'s `actually` uses a plain "but". Budget spent exactly once, as storyboard §8c requires. |
| Triple-fragment closer · staccato run (tells 3, 10) | whole draft | ✅ CLEAN | No three consecutive sub-eight-word sentences; the prose closer ends on a full clause. |
| Stacked citation (tell 9) | three-steps · intro | ✅ CLEAN | "A football data company said it nine years early" — outlet and author on the source line, finding in the sentence. |
| Title formula (tell 7) | title + 10 section titles | ✅ CLEAN | No "The ‹Noun› That ‹Verb›s". The retired *The Title Nobody Could Watch* is gone; the title states the finding. |
| Paradox / straw-man | — | ✅ N/A | The `paradox` section is cut; nothing straw-manned in its place. |
| Structure: does the readout tell its story in numbers? | data-readout | ✅ CLEAN | Six tiles, each with a comparison in its note; no prose narration of the same figures elsewhere. |

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| HINDI-LOAD-BEARING | dek (*hisaab*), prose (*maidan*), jargon-buster (`hindi`) | ✅ CLEAN | All three pass the skip test read as Karthik. *hisaab* is glossed inline ("the hisaab, the maths"); *maidan* sits in an adjunct ("one clean run on the maidan") whose deletion leaves the sentence whole; the `hindi` slot is additive to a complete English `meaning`. **No blocker.** |
| HINDI-FIELD | all `caption` / `howToRead` / `plain` / `source` / labels | ✅ CLEAN | Zero Hindi in the precision layer. **No blocker.** |
| ⚠️ HINDI-SPELLING | jargon-buster · `terms[0].hindi` — "matlab, kitne maukon se goal banta hai" | ⚠️ low | *matlab* ✅ and *mauka* ✅ are lexicon words (*maukon* is an inflection of the lexicon's own sports example, "xG counts the maukas"), but *kitne*, *se*, *banta*, *hai* are not rows in `hinglish-lexicon.md`, which says "anything not on it is not used". The clause is 7 words (cap 10), Roman, set roman, in the kind's purpose-built Hindi slot, and not load-bearing. **Likely the lexicon is short a verb-and-connective set rather than the draft being wrong** — it is still a DRAFT file awaiting the operator's ear. Fix is either two lexicon rows or the shorter "matlab, kitne maukon se goal banta hai" → "matlab, goal ka mauka". |
| HINDI-DENSE | whole issue | ✅ CLEAN | Three touches across ten sections; never two consecutive sentences; ≤ 1 per paragraph; nothing italicised or Devanagari. |
| JARGON-UNGLOSSED | whole issue | ✅ CLEAN | Every term of art is glossed at or before first use: xG, set piece, open play and passes per defensive action in §2, before §3 and §4 need them; "block" is glossed in §3's intro before `tactics-pitch` in §8; "xGA" and "PPDA" as abbreviations never appear (tile 2 says "Chances allowed all season, in expected goals"). |
| BARE-NUMBER | all figures | ✅ CLEAN | 27 → eight fewer, City on 35 · 28.3 → under a goal a game · 25 → its breakdown · 19 → previous high 16 · 238 → City 229 fewer · 18.05 → four more than anyone, drawn as bars · £2.5m → ₹26 crore. |
| NO-INDIAN-ANCHOR | whole issue | ✅ CLEAN | ₹26 crore (§7), the hockey penalty corner (§2), the captain's deep field setting (§4, §8), net practice (§5), the maidan (§10). The published issue's measured zero is fixed. |
| NAME-THROUGHPUT | whole issue | ✅ CLEAN | Nine named bodies/people in reader-facing copy (Arsenal, Arteta, Jover, Gabriel, Saliba, Manchester City, Paris Saint-Germain, the Premier League, the Champions League) against a ceiling of 12; down from the published 15. Bournemouth, the goalkeeper and the nine `tactics-pitch` players are described or dropped, not named. |
| NAME-UNPLACED | three-steps, tactics-pitch | ✅ CLEAN (noted) | Arteta, Jover, Gabriel and Saliba each appear exactly once, but each is introduced with its role **in the same sentence**, which is what tell 11 asks for. No bare name anywhere. |
| ANALOGY-CLAIM | §2 hockey penalty corner · §4/§8 deep field · §5 net practice | ✅ CLEAN | Each maps correctly onto the mechanism the sources describe: a drilled dead-ball restart; conceding volume to deny value; rehearsal producing repeatability. None smuggles a number. |
| HOOK-ABSTRACT | hook | ✅ CLEAN | 25 words exactly, two numbers in the first sentence, a "you", the twist last. |
| TITLE-FORMULA | title | ✅ CLEAN | States the finding; one italic accent word. |
| TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC / HEAD-HEAVY | composition | ✅ CLEAN | 7 of 10 sections visual (70%); text-only rows at 2, 5, 10 — never adjacent; `you-think` opens as a VizCard figure (operator ruling 2); ~72 words before the first graphic against a floor of 80; one `prose` at ~95 words; my count of reader-facing words lands just under 1,100, with the `data-readout` (~148 v. a 120 budget) and `tactics-pitch` (~118 v. 110) the two rows over their storyboard allowance. `npm run check:prose -- 2026-06-04-arsenal-set-piece-title` should be run to get the exact figure — it is close enough to the ceiling to be worth measuring rather than trusting. |
| STORYBOARD-DRIFT | §3 tiles 2, 3, 5, 6 | ✅ CLEAN (ruled) | Kinds, order, hero and `layout: wide` match the approved table exactly, ten for ten. Every departure from the storyboard's tile text (28.5 → 28.3, "most in the division" dropped, nights → days, "200 in a row" dropped, "finished four points behind" → "were four points clear") is **mandated by the re-anchoring file**, which operator ruling 6 commissioned and which post-dates the storyboard — and each is named in the draft's MDX provenance note. Not drift. |
| QUESTION-UNANSWERED | storyboard §6 | ✅ CLEAN | All three answerable from the draft alone. Q1 from §2 + tile 3 + tile 4 (minus the "most in the division" clause the storyboard's model answer carried and the source cannot support). Q2 from §4's bars + tiles 1 and 2 (28.3, not the model answer's 28.5). Q3 from §9. |
| PLAIN-CLAIM | benchmark-chart, shot-map | ✅ CLEAN | Both authored `plain` lines describe form only ("Each bar is one team…", "A goal frame seen from above with one dot per attempt…"). No finding in either. |
| REDUNDANT-HOWTO | tactics-pitch | ✅ CLEAN | One `howToRead` in the issue, on the only kind in `NEEDS_HOW` here — constraint 5 honoured. It carries no `plain`, so nothing duplicates. Instrument rule obeyed: the static reading leads, the "it leans as your pointer moves" clause trails. |
| CAPTION-FORM | data-readout, tactics-pitch | ⚠️ low ×2 | See the claim table. Both name their subject rather than asserting a finding. |
| **Source balance — primary anchor** | whole issue | ⚠️ NO PRIMARY ANCHOR (partial) | src-10 (premierleague.com) is **T0** and anchors the clinch, the 22-year wait and the runner-up run. The other five counting stats rest on **T7** (Opta Analyst). `_TAXONOMY.md` §5 wants T0/T1/T2 for load-bearing facts. The re-anchoring file explains why the T0 tables are unreachable (JavaScript-rendered) and left the call to the operator; the acceptance is recorded only in the draft's MDX comment. Not a publish blocker — an operator signature that lives outside the draft. |
| Source balance — viewpoint diversity | interpretation claims | ✅ CLEAN | The "engineering, not luck" reading is carried by two clusters: analytics (StatsBomb 2017/2023, Opta) and coaching (Coaches' Voice). The contrary "boring/dull" reading is present and attributed (dek). |
| Source balance — false balance | settled figures | ✅ CLEAN | No sourced count is hedged against an opinion. |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status | ✅ | `published` — correct for a Phase-4 in-place rewrite (storyboard ruling 8: same `id`, `topic`, `publishedAt`, `tags`). The agent's default "must be `draft`" does not apply here. `readTimeMinutes: 4` as ruled. |
| All section kinds registered | ✅ | `you-think`, `jargon-buster`, `data-readout`, `benchmark-chart`, `three-steps`, `shot-map`, `number-sense`, `tactics-pitch`, `match-stat-line`, `prose` — all in `SECTION_KINDS` (config.ts) |
| No author field | ✅ | Absent |
| publishedAt valid | ✅ | `2026-06-04` |
| Source URLs https:// | ✅ | All 11 |
| Source kinds valid | ✅ | 9 `analysis`, 1 `secondary` (src-05), 1 `primary` (src-10) |
| ≥6 sources | ✅ | **11**: the six published entries byte-identical, plus src-07…src-11 added as the brief describes. The src-10 URL is the corrected live one (the dossier's 404s — re-anchoring §7). |
| sourceRefs resolve | ✅ | Every ref (src-01, 02, 03, 04, 07, 08, 09, 10, 11) resolves. src-05 and src-06 are now unreferenced — expected, since the Guardian hand-read path the dossier recommended was superseded. |
| primer 80–420 chars | ✅ | ~133 chars. **Prior required fix #4 resolved** — the ~360-char primer that needed a hand count is gone. |
| `plain` ≤ 220 | ✅ | 122 and 104 chars |
| `howToRead` 40–360 | ✅ | ~240 chars, on `tactics-pitch` only |
| `layout` valid · `skimCaption` on prose only | ✅ | `wide` on the hero; `skimCaption` only on §10 |
| Component field names | ✅ | Checked against the components, not the catalog: `emphasis: "key"` is `DataReadout`'s real field (the catalog block's `accent?: true` is the stale line); `annotations[].at` = an existing item label; `you-think` / `number-sense` / `match-stat-line` / `shot-map` / `tactics-pitch` payloads all match their `interface Props`. |

---

## Prior report — the five required fixes

| # | Fix | State |
|---|---|---|
| 1 | Restore or de-quote the StatsBomb "not luck" line | ✅ **RESOLVED** — verbatim, in `three-steps` · intro, attributed by role with StatsBomb on the source line |
| 2 | Tighten the ".75–.80 goals a game" attribution | ✅ **RESOLVED by deletion** — the figure appears nowhere; storyboard §5C's trap is not stitched |
| 3 | Resolve the Martinelli personnel claim | ✅ **RESOLVED outright** — every `name` and `num` is stripped from `tactics-pitch`; no named starter exists to be absent from the source |
| 4 | Confirm the primer clears the 420-char cap | ✅ **RESOLVED** — ~133 chars |
| 5 | Resolve the seven `# EDITOR: Opta` counting-stat flags | ✅ **RESOLVED** — the re-anchoring pass cleared five outright, one as a stated derivation, corrected one (28.5 → 28.3) and dropped the unanchorable one (200 consecutive). **No `# EDITOR:` flag ships as visible copy**; the provenance note is inside an MDX `{/* */}` comment. Residual: the T7 anchor tier is accepted only in that comment — see the flag above. |

Also carried out: the optional fix from the prior report's list (shot-map lead
`xg` 0.70 → **0.68**, off the reserved 0.7) and the `sourceRefs[]` wiring the
prior report asked for as an optional improvement — every section is now
machine-linked to a source id.

---

## Required fixes before publish

1. **Make the `match-stat-line` carry the shootout in the graphic, not just in
   the intro.** Set `home.score: "1 (4)"` and `away.score: "1 (3)"` — the
   convention `MatchStatLine.astro` documents on that very field — and add
   `away.outcome: "loss"`. As it stands the figure renders `1 — 1` with the
   winner encoded **only** as an accent colour on the PSG name, which is both
   factually thin (a 1–1 with a winner and no shootout number) and a
   colour-only encoding. (match-stat-line · data.home / data.away)

2. **Put the 11-game checkpoint back into the claim layer of the
   `benchmark-chart`.** The caption states a season-level league ranking from a
   Nov-2025, 11-game figure; only the `source` line says so. Either extend the
   caption — "…the highest in the league after 11 games" (17 words, inside
   budget) — or say it in the intro. The same correction applies to **story
   beat 7**, which states it with no qualifier at all. (benchmark-chart ·
   caption; story.beats[3])

3. **Keep the shot-map's honesty line alive in story mode.** `story.css` hides
   `[class$='__cap']` inside a beat and `ShotMap` renders its caption as
   `.px-viz__cap`, so "positions are schematic; the totals are real" does not
   reach a story reader — while beat 5 narrates the marks as observed
   ("Look at where the goals are. They pile into…"). Add three words to the
   beat: "The marks are drawn, not tracked." (story.beats[2])

4. **Reconcile the hero caption's totals with the picture.** The caption asserts
   25 and 19 directly above 15 goal marks. Either reword the caption to stop
   inviting the count ("Set-piece goals land in the same few square yards;
   positions are schematic, the totals are real") or state the totals in the
   intro instead, where they are not read as a legend. (shot-map · caption)

5. **Record the T7 ruling outside the draft.** The re-anchoring file left
   "accept T7 as the anchor for the counting stats?" to the operator; the draft
   answers it in an MDX comment. Add one line to
   `research/sports/2026-09-13-arsenal-re-anchoring.md` ("For the operator to
   rule", item 1) or to the storyboard's §9, so the decision outlives the file
   it governs.

---

## Optional improvements

- **`jargon.md`'s sports row is now the stale file.** It glosses a set piece as
  "a corner or free kick"; the draft's "a corner, a free kick or a throw-in" is
  the definition the binding source counts with (Opta's own 19 + 4 + 2 + 4
  penalties breakdown). Update the row rather than the draft. While there:
  Opta counts **penalties** as set pieces too, which is why tile 3 says
  "penalties excluded" — a reader who took §2's three-item list literally will
  wonder why an exclusion is needed. Adding "(a penalty is one too, which is
  why we exclude them below)" is one clause, or leave it; it is a seam, not an
  error.
- **`you-think`'s source line pairs two dates.** "Opta Analyst, 25 April and
  25 May 2026" — the April piece carries the record (at 17 goals), the May
  piece carries the 19. Both claims in the caption are sourced, so this is
  correct; but a reader who checks the April link will not find 19. Dropping
  "25 April and" costs the record's own citation, so leaving it is defensible.
- **Two `caption` fields state their subject rather than a finding** — the
  readout's "ARSENAL · 2025/26 PREMIER LEAGUE" and the pitch's "Arsenal's
  defensive shape in the 2026 Champions League final". The pitch's could carry
  a finding for free: "Two banks of four, with the back line held high in the
  Champions League final."
- **The `hindi` slot's clause outruns the lexicon** by four small words. Either
  add the rows (the lexicon is still a DRAFT awaiting the operator's ear) or
  shorten to the lexicon's own worked example.
- **Two rows sit over their storyboard word budgets** — the `data-readout` by
  roughly 28 words and `tactics-pitch` by 8. The issue total still reads under
  1,100 by my count, but the margin is thin; run
  `npm run check:prose -- 2026-06-04-arsenal-set-piece-title` for the exact
  number before the flip. That gate also owns the NUMBER-DRIFT check against
  the committed version, which this report cannot perform.
- **`tactics-pitch`'s source line still says "Shape and personnel per Coaches'
  Voice"** — there is no personnel left in the component. "Shape per Coaches'
  Voice, 31 May 2026; positions schematic" is truer and shorter.
- **src-05 (The Guardian) is now an unreferenced source.** Correct to keep
  under the brief (the six published entries stay byte-identical), but the
  dossier's recommended Guardian hand-read never happened and no longer needs
  to — worth a line in the dossier's §9 so a future pass does not chase it.
