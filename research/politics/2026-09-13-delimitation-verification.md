# Verification Report: The women's bill carried a new map inside

- **Draft:** src/content/issues/2026-04-24-delimitation/index.mdx
- **Dossier:** none — Phase-4 rewrite. The factual record is the **published
  version this draft replaces**, read from the last build output
  (`.vercel/output/static/issues/2026-04-24-delimitation/index.html`, which is
  pre-rewrite and carries the old title, the "Trojan Horse" framing, the
  SATIRICAL quote intro and "sine die" — confirmed stale, therefore the
  published record). `git show HEAD:…` was not available: **Bash is disabled in
  this session**, so the rendered build was used as the trace target instead.
  Every published section, every timeline date, every seat row, both verbatim
  quotes and all ten `sources[]` URLs were recovered from it.
- **Storyboard:** research/politics/2026-09-13-delimitation-storyboard.md (Status: approved)
- **Panel:** research/politics/2026-09-13-delimitation-panel.md (first pass, REVISE)
- **Verified:** 2026-09-14
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION — no ❌, eleven ⚠️.** Every factual claim in the rewrite
traces to the published record or to a derivation the storyboard sanctions; no
number moved, both verbatim quotes survive character-for-character, and all ten
sources are intact. The register work is clean and measurable: zero advocacy,
zero rhetorical questions, zero questions of any kind, zero SATIRICAL sections
on the politics desk, one em-dash per paragraph everywhere, no staccato run, no
triple-fragment close, no retired title formula in any of the ten titles, nine
names against a twelve ceiling, and the single Hindi phrase is glossed in its
own sentence so it survives the skip test. The nine kinds and their order match
the storyboard exactly, the hero is `seat-chart` at `layout: split` as composed,
and all three storyboard questions are answerable from the draft alone. What
holds it back is not the writing: the §9 title **departs from a binding operator
ruling** (§9.3) without naming the departure, the Hindi phrase it dropped is one
whose verbatim status the record asserts but never demonstrates, two authored
captions carrying the issue's two most load-bearing restatements **do not reach
the page at all** because `SectionBody` passes no `caption` to `seat-chart` or
`vote-result`, and the Yadav quote is cited to a 2019 source that cannot carry a
2026 X post while the source that can (src-07) sits unreferenced. All eleven are
fixable in the file or with one prop — none needs new research.

---

## Claim verification

### Head and story block

| Claim | Location | Status | Note |
|---|---|---|---|
| "One MP in Uttar Pradesh speaks for 30 lakh people. In Tamil Nadu, 18 lakh." | `hook` | ✅ | Published `bill-breakdown` payload-03 bullet: "a UP MP represents ~30 lakh people; a TN MP represents ~18 lakh" (src-01), and `paradox` detail 1 (src-05) |
| "lost by 54 votes" | `hook` | ✅ | Published `vote-result` `shortfall: 54`; 352 − 298 = 54 (src-04) |
| "Fifty years on, the map has not moved." | `dek` | ✅ | Sanctioned derivation, storyboard §5.3 (1976 → 2026); published "the 50-year freeze" |
| "Parliament has had the same 543 seats since 1976." | `primer` | ✅ | Published primer, verbatim in substance |
| "The seat map has not been redrawn since 1976." | `story.beats[2]` | ⚠️ IMPRECISE | The draft's own §3 intro says the last full redraw was **1971** and the map was *frozen* in 1976. The story beat states the weaker date as the redraw date. The panel logged both readers outside the Hindi belt re-reading this exact collision; §3 fixed it, the beat did not |
| "12 lakh more people behind it" | `story.beats[0]`, §1 `equals[0].note` | ✅ | Sanctioned derivation, storyboard §5.1 (30 − 18) |
| "raised the Lok Sabha ceiling to 850 seats" | `story.beats[1]` | ✅ | Published payload 02 |
| "UP gains 11 and Bihar 10; TN, Kerala and AP lose 8 each" | `story.beats[3]` | ✅ | Published `seat-chart` rows (src-05) |
| "298 … 230 … 528 … 352 … 54" | `story.beats[4]` | ✅ | Published `vote-result` (src-04) |
| Beat `section:` indices 0, 1, 2, 5, 7 | `story.beats` | ✅ | Resolve to `number-sense`, `you-think`, `timeline`, `seat-chart`, `vote-result` — all correct against the section array |

### §1 `number-sense`

| Claim | Location | Status | Note |
|---|---|---|---|
| "One MP in Uttar Pradesh represents about 30 lakh people; one in Tamil Nadu, about 18 lakh." | §1 · `caption` | ✅ | Published payload-03 bullet + `paradox` detail 1. Caption asserts DATA — correct role, traced |
| `value: "30 lakh"` · `unit: "people per MP"` · `label: "Uttar Pradesh, per Lok Sabha seat"` | §1 · `data` | ✅ | Same |
| "about 1.7 times the people behind one Tamil Nadu seat, which is 18 lakh" | §1 · `equals[0].text` | ⚠️ IMPRECISE | Arithmetically sound (30 ÷ 18 = 1.67, "about 1.7"), but **storyboard §5 lists three sanctioned derivations and this is not one of them** (12 lakh, six-tenths, fifty years). No new fact and no new source, so it is not untraced — it needs the operator to add a fourth row to §5, or the drafter to fall back on the two that are listed |
| "one Uttar Pradesh vote worth about six-tenths of a Tamil Nadu vote" / note "18 lakh divided by 30 lakh" | §1 · `equals[1]` | ✅ | Sanctioned derivation, storyboard §5.2 (18 ÷ 30), **with the basis stated in the note** exactly as the operator required. Expresses the published `paradox`'s own "a North Indian vote literally counts less" (src-05) as a ratio |
| "Seats were frozen fifty years ago. Populations were not, so the gap kept growing." | §1 · `note` | ✅ | Published 1976 freeze + the growth premise in the published primer |
| `source` = PRS · Vaishnav & Hintson; `sourceRefs` src-01, src-05 | §1 | ✅ | Both numbers appear under both sources in the published file |

### §2 `you-think`

| Claim | Location | Status | Note |
|---|---|---|---|
| "One vote covered women's seats, a Lok Sabha of 850, and a fresh boundary for every constituency." | §2 · `caption` | ✅ | Published `bill-breakdown` intro ("three very different changes, stapled together and presented as a single vote") + the three payloads |
| "one in three seats kept for women" | §2 · `think.text` | ✅ | Published "33% women's reservation"; matches `jargon.md`'s own gloss for *women's reservation* |
| "The opposition blocked it." | §2 · `think.text` | ⚠️ UNTRACED (framed as belief) | Nothing in the published record attributes the 230 "against" to the opposition — storyboard §8d states plainly that the issue "carries no per-party breakdown of the 298 / 230 split". It sits inside `think`, i.e. what the reader is assumed to believe rather than what happened, which is why this is ⚠️ and not ❌. But `actually` corrects only the *contents* of the bill, never the attribution, so the belief is left standing as fact |
| `actually.value: "543 → 850"` | §2 · `data` | ✅ | Published payload-02 title verbatim: "Expand Lok Sabha from 543 → 850." |
| "It also raised the seat ceiling and opened every constituency boundary to a redraw by population." | §2 · `actually.text` | ✅ | Published payloads 02 + 03 |

### §3 `timeline`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Delimitation: redrawing which voters belong to which seat." | §3 · `intro` | ✅ | Term of art glossed on first appearance, in `jargon.md`'s own words (contract rule 2) |
| "The last full redraw was 1971, but the map was frozen in 1976 and has not moved since." | §3 · `intro` | ✅ | Published timeline event 1 ("1971 · Last full delimitation.") + event 2 (1976 freeze). **Resolves panel fix 7a** |
| 1971 · "The last full redraw." · "The Lok Sabha was fixed at 543 seats." | §3 · `events[0]` | ✅ | Published: "Last full delimitation. / Lok Sabha fixed at 543 seats, population 548M." (548M dropped, nothing added) |
| 1976 · "42nd Amendment · the freeze begins." · "The Indira Gandhi government froze it: family planning would not cost seats." | §3 · `events[1]` | ✅ | Published verbatim in substance |
| 2001 · "84th Amendment · freeze extended to 2026." · "The Vajpayee government pushed the same freeze out by 25 years." | §3 · `events[2]` | ✅ | Published verbatim in substance. (Storyboard §7 put the 84th Amendment on the *described-not-named* list; the draft names it — see composition table) |
| Sept 2023 · "Nari Shakti Vandan Adhiniyam passes." · "one in three seats, passed 454 to 2" | §3 · `events[3]` | ✅ | Published: "33% women's reservation passes 454–2" (src-10). Name glossed in the same breath, per storyboard §7 |
| Apr 16 2026 · "The amendment, a Delimitation Bill and a UT Laws Bill, tabled together." | §3 · `events[4]` | ✅ | Published: "131st Amendment Bill + Delimitation Bill + UT Laws Bill." **Resolves panel fix 7b** — §8's "the two companion bills" now points at something named |
| Apr 17 2026 · "131st Amendment Bill defeated." | §3 · `events[5]` | ✅ | Published event 6 |
| **Annotation:** at "Sept 2023" — "The women's Act switched itself off until a new census" | §3 · `annotations[0]` | ✅ | Published: "the clause says it activates only after a new census **and delimitation**." The annotation carries the census half only — authored verbatim by storyboard §Annotations at 10 words against a 12-word cap, so the elision is composed, not drifted. Traced |
| `source` = "PRS India and Lok Sabha records"; src-01, src-10 | §3 | ✅ | Published source line verbatim |

### §4 `bill-breakdown`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Use the 2011 census so the reservation starts at the next general election." | §4 · card 01 | ✅ | Published payload 01: "Use 2011 Census data so the 33% reservation can kick in for the next general election." |
| "active by 2029" | §4 · card 01 title | ✅ | Published payload-01 title: "Activate women's reservation by 2029." |
| "Lift the ceiling from 550 to 850 seats. Today's house fills 543 of them." | §4 · card 02 | ✅ | Published "Raise the constitutional cap from 550 to 850" + the 543 of the primer and timeline. The "fills 543 of them" clause is new *wording* on published numbers and **resolves panel fix 3** — the three-number collision (543 / 550 / 850) that three of four readers re-read |
| "Projection: 816." | §4 · card 02 | ⚠️ IMPRECISE | The figure is published and correct ("Projected actual size 816 seats under Amit Shah's 50% expansion model"). Storyboard §8b.5 rightly drops the name but asked for the model to survive as "the government's own 50 percent expansion model"; the draft keeps neither, so 816 now has no owner and no comparison beside it. src-02 (PIB, the reply that carries the model) is in the bibliography and unreferenced here |
| "End the 50-year freeze. A simple majority picks which census to use." | §4 · card 03 | ✅ | Published payload 03: "Revert Article 82. End the 50-year freeze. Parliament can decide by simple majority which census to use." Article 82 dropped per operator ruling §9.5 |

### §5 `analogy`

| Claim | Location | Status | Note |
|---|---|---|---|
| The three `pairs[]` (birth rate ↔ small household; head-count seats ↔ dinner-table votes; the freeze ↔ the old count) | §5 · `data.pairs` | ✅ | Composed verbatim in storyboard §8c; the mechanism each row maps (seats follow population, so a state that lowered its birth rate ends up with fewer) is exactly the published `paradox` detail 2 and `seat-chart` premise. **No ANALOGY-CLAIM** — the mapping is accurate in both directions |
| headline "Votes at the family table, decided by how many children you have." | §5 · `data.headline` | ✅ | Storyboard composed "Votes **in the house**…"; the draft's change to "at the family table" removes the Lok-Sabha/family collision the panel logged (fix 8). An improvement, not a drift |
| punchline "Ending the freeze is the family recounting the children, and the votes, on the same day." | §5 · `data.punchline` | ✅ | Storyboard §8c, with the two em-dashes replaced by commas (tell 1) |
| `source` = Carnegie; src-05 | §5 | ✅ | **Resolves storyboard §8f** — the published `analogy` carried no source at all |

### §6 `seat-chart` (HERO)

| Claim | Location | Status | Note |
|---|---|---|---|
| "This projection keeps today's 543 seats and redraws them by population, so every gain here is another state's loss." | §6 · `intro` | ✅ | Published intro: "Under population-based delimitation of a 543-seat house…". **Resolves panel fix 1**, the report's top item — both readers outside the Hindi belt could not tell which house the change column counted |
| "The states that grew fastest take seats from the states that grew slowest." | §6 · `intro` | ✅ | Published intro, second clause |
| Uttar Pradesh 80 / +11 · Bihar 40 / +10 · Rajasthan 25 / +6 · Madhya Pradesh 29 / +4 | §6 · `data.rows` | ✅ | Published `seat-chart`; the built page's `bar-fill` widths (100%, 90.909%, 54.545%, 36.364%) are exactly 11/11, 10/11, 6/11, 4/11 — the change column, recovered arithmetically. `current` values match the real Lok Sabha allocation |
| Tamil Nadu 39 / −8 · Kerala 20 / −8 · Andhra Pradesh 25 / −8 · Karnataka 28 / −2 | §6 · `data.rows` | ✅ | Same method: 72.727%, 72.727%, 72.727%, 18.182% = 8/11, 8/11, 8/11, 2/11 |
| subtitle "Projected seat change · 543-seat scenario" | §6 · `data.subtitle` | ✅ | Published verbatim |
| "Under a population-based redraw, Uttar Pradesh gains 11 seats and Bihar 10; Tamil Nadu, Kerala and Andhra Pradesh lose 8 each." | §6 · `caption` | ✅ (unreachable) | Traces cleanly to the rows — but **this caption does not render.** `SectionBody.astro` line 174 passes `subtitle` / `source` / `rows` to `SeatChart` and no `caption`; the promoted-caption merge at line 147 only helps arms that read `data.caption`. Verified by reading the dispatcher, not inferred. Carried forward from panel fix 2, still open |
| quote "The political pattern of losers and gainers maps almost perfectly onto areas of BJP's weakness and strength." | §6 · `data.quote.text` | ✅ VERBATIM | Character-for-character against the published render. No paraphrase |
| attribution "Yogendra Yadav · X · April 2026" | §6 · `data.quote.attribution` | ⚠️ IMPRECISE | Verbatim, but the section cites **only src-05** — Vaishnav & Hintson, Carnegie Endowment, **2019**, which cannot carry an April-2026 X post. src-07 ("Yogendra Yadav's 850-seat projection", The Wire, from X posts during the April 2026 debate) is in `sources[]` and referenced by nothing. Inherited from the published file; the rewrite is the moment to fix it |
| `plain` "Each row is one state: today's seat count on the left, and on the right what a population-based redraw would change." | §6 · `plain` | ✅ | Describes the FORM only — **no PLAIN-CLAIM**. 122 chars, inside the 220 cap |

### §7 `paradox`

| Claim | Location | Status | Note |
|---|---|---|---|
| "There is no villain here, because two fair principles point in opposite directions." | §7 · `intro` | ✅ | Published: "This isn't a simple good-guy / bad-guy story. The real dilemma: two legitimate principles, pulling in opposite directions." |
| "*One person, one vote, one value.*" | §7 · side 1 `statement` | ✅ VERBATIM | Published `px2__claim` |
| "When one MP speaks for far more people than another, a vote in the north counts for less. Equal votes is a democratic principle." | §7 · side 1 `detail` | ✅ | Published: "a North Indian vote literally counts less… Fixing this is a democratic principle, not a conspiracy." 27 words against the storyboard's 28 cap |
| "*Don't punish responsibility.*" | §7 · side 2 `statement` | ✅ VERBATIM | Published `px2__claim` |
| "The south brought its birth rate down because the country asked it to — schools, hospitals, family planning." | §7 · side 2 `detail` | ⚠️ IMPRECISE | Published reads "**Educating women**, building hospitals, family planning — that's why their fertility fell." src-09 is specifically the *fertility-rate and women-education* correlation (NFHS-5). "schools" generalises away the one variable the cited source actually measures |
| Both sides present, neither straw-manned | §7 | ✅ | Genuine two-sided tension. Not advocacy: each claim is labelled as a side's case and both are carried verbatim from the published record |

### §8 `vote-result`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Changing the Constitution needs two-thirds of those present and voting." | §8 · `intro` | ✅ | Published intro; matches `jargon.md`'s gloss for *constitutional amendment* |
| "In a division vote every MP's yes or no is counted: 528 were there." | §8 · `intro` | ✅ | Glosses *division vote* in `jargon.md`'s own words; 528 published (src-04) |
| `for: 298` · `against: 230` · `required: 352` · `present: 528` · `shortfall: 54` | §8 · `data` | ✅ | All five published verbatim (src-04). Arithmetic checks: ⅔ × 528 = 352; 352 − 298 = 54 |
| label "Constitution (131st Amendment) Bill · Division vote" · stamp "Defeated" | §8 · `data` | ✅ | Published verbatim |
| "298 voted for the amendment and 230 against; two-thirds of the 528 present meant 352." | §8 · `caption` | ✅ (unreachable) | Traces cleanly — but **this caption does not render either.** `SectionBody.astro` lines 156–167 pass the vote values, `label`, `stamp` and `source`, and no `caption` |
| "The two companion bills fell with it, and the Lok Sabha shut for the session the same day." | §8 · `followup` | ⚠️ IMPRECISE | Published: "the two companion bills were automatically withdrawn. Lok Sabha was **adjourned sine die**." Storyboard §8b.3 sanctions glossing the term away, but `jargon.md`'s own gloss is "the House closed with **no date set to return**" — the meaning that makes the phrase worth glossing. The draft's replacement drops it and substitutes a "same day" timing the published record never states |

### §9 `quote`

| Claim | Location | Status | Note |
|---|---|---|---|
| "… I had said in Parliament as well — let half the population get their rights. I am ready to give the credit to the opposition by even publishing advertisements in their name." | §9 · `data.quote` | ✅ VERBATIM | Compared character-by-character against the published render. The retained passage is **identical**; the leading ellipsis correctly marks the elision of "This was not about failure or taking credit." — sanctioned by storyboard §8a |
| attribution "PM Narendra Modi · Address to the Nation · 18 April 2026" | §9 · `data.attribution` | ✅ VERBATIM | Published verbatim |
| **"Credit nahi chahiye, he said: I do not want the credit."** | §9 · `intro` | ⚠️ QUOTE-UNDEMONSTRATED | **This is the item the audit was asked to run down, and the finding is that the published record cannot demonstrate it.** The published file presents the phrase as said in two places — the §7 section title (`Credit nahi chahiye.`) and the timeline event-7 label (`"Credit nahi chahiye" — Address to the Nation.`) — both attributed to src-03. But the only quoted text the published file carries from that address is **entirely in English** and contains no such phrase. So the phrase's verbatim status is **asserted by the issue, never demonstrated by any quote it carries** — precisely the exposure storyboard §8c.3 flagged and left to the operator. The rewrite does not inherit the assertion neutrally: it upgrades it to inline reported speech with an attributive verb ("**he said**:"), which is a stronger verbatim claim than quotation marks in a title. The gloss beside it is correct and correctly placed; it is the attribution that is unbacked. The editor must either confirm the phrase against src-03 (the Deccan Herald report of the 18 April address) or drop the attributive frame |
| "The day after the vote, the Prime Minister addressed the nation." | §9 · `intro` | ✅ | Published timeline event 7 (Apr 18 2026, address to the nation), one day after the 17 April vote |
| "The fight was not about the credit. It was about who draws the map for the next fifty years." | §9 · `followup` | ✅ | Published followup carried the same reversal as two rhetorical questions ("was the fight ever really about credit? Or was it about who gets to draw the map for the next fifty years?"). Converting them to statements is correct under rule 6 (no question as a closer) and **this is the issue's one sanctioned binary reframe**, spent exactly where storyboard §8b.2 directs and nowhere earlier — verified across all nine sections |
| `source` = "PM's address to the nation via Deccan Herald" · 18 April 2026; src-03 | §9 | ✅ | **Resolves storyboard §8f** — the published `quote` carried no source at all |

**Copyright / quotability gate.** `mcp__parallax_rag__search` is not available in
this session, so per Step 3.5 both quotes were verified against the recorded
source URLs instead. Neither is backed by a GUIDE-ONLY (metadata-only) corpus
chunk: the Yadav line is a public X post reported by The Wire (src-07, present
in `sources[]` though not yet referenced), and the Modi passage is a short
extract from a head of government's public address to the nation as reported by
src-03. **No ❌ NON-QUOTABLE SOURCE.**

**Counts — 52 claims traced:** ✅ **41 verified** (including 2 verbatim quote
passages and 2 verbatim attributions) · ⚠️ **11 imprecise** · ❌ **0 untraced.**
Two of the 41 are verified but **unreachable on the page** (§6 and §8 captions).

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|

**Empty — no voice issues found.** Checked and clear on every rule in Step 4 and
the seventeen-tell catalog:

- **ADVOCACY — none.** The only evaluative language in the issue ("Don't punish
  responsibility", "Now that record costs it seats") sits inside a `paradox`
  side explicitly labelled "The opposition's case", carried verbatim from the
  published record, and is answered by an equally weighted government case. §7's
  intro ("There is no villain here") is anti-advocacy. The published version's
  SATIRICAL quote intro — the vaccine certificates, ration bags and airport
  screens, none of which any entry in `sources[]` backs — is **gone**, which
  retires both an advocacy exposure and three unsourced claims.
- **RHETORICAL Q — none.** The draft contains **zero question marks**. The
  published followup's two closing questions were converted to statements.
- **WIRE TONE, PASSIVE FILLER, META-COMMENTARY, SPECULATION — none.** Every
  counterfactual is marked as a projection and attributed ("This projection…",
  "would change", "Projected seat change").
- **Tells 1–11:** one em-dash maximum per paragraph throughout; one binary
  reframe, spent where sanctioned; no triple-fragment close; no abstract-noun
  label; no "First… Second… Third…"; **none of the ten titles uses the retired
  "The ‹Noun› That ‹Verb›s" construction and every one states a finding**; the
  dek is not an antithesis; no stacked citation in any prose field (every author
  and outlet lives in a `source` line); no run of three sentences under eight
  words.
- **Tells 12–17 (Hinglish):** no YouTube intro, no Hindi in consecutive
  sentences, no *yaar/bhai*, **the one Hindi phrase is set roman, not italic**,
  no literal idiom, no condescending tag.
- **Structure:** the timeline's arc is directional (redraw → freeze → extension →
  the Act that switched itself off → the three bills → defeat); the paradox is
  genuinely two-sided; `vote-result` tells its story in five numbers against a
  threshold; there are no `prose` sections to check for advocacy.
- **Jobs:** CONVERSATIONAL EXPLAINER carries §1, §2, §4, §5, §6, §8 — six of
  nine, clearing the "at least half" floor. Three jobs across the issue (3–5
  range). **Zero SATIRICAL**, as the politics desk requires. Zero LYRICAL. DRY
  WIT appears once as a device (§2 `note`: "Only one of them was on the
  poster."), never as a section.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| **STORYBOARD-DRIFT** | §9 · `title` | ⚠️ | Operator ruling **§9.3 is binding on the drafter** and says "**'Credit nahi chahiye' stays as the section title**, set roman, never italic." The draft instead uses storyboard §8c.3's *reversible alternate* — "He said he did not want the *credit*." — and moves the Hindi into the `intro`. **The departure is not named in the draft's summary**, which the flag requires. It is also the correct call on the evidence: it is exactly what the reader panel's fix 4 asked for, and it resolves the panel's sole REVISE-level finding (Karthik could not read the one line that a title, unlike an intro, travels alone into the aside's contents list). The editor must **ratify the override explicitly**, not let it pass unnoticed |
| **HINDI-SPELLING** | §9 · `intro` — "Credit nahi chahiye" | ⚠️ | Neither *nahi* nor *chahiye* appears in `hinglish-lexicon.md`, whose header rule is "Anything not on it is not used." Reported speech has no slot in that file, which is arguably the lexicon's gap rather than the draft's: this is a phrase attributed to a named person, not the writer's register choice. Recommend a lexicon amendment for reported speech over a copy change — but note it interacts with QUOTE-UNDEMONSTRATED above, and if the attribution is dropped, so is the flag |
| **JARGON-UNGLOSSED** | §4 · card 03 — "A simple majority" | ⚠️ | Unglossed, and the contrast that makes it matter — an *amendment* needs two-thirds, but choosing *which census* needs only half — does not arrive until §8, four sections later. `jargon.md`'s own entry for *constitutional amendment* pairs the two terms for exactly this reason. This is the issue's sharpest single mechanism and the draft states both halves without ever joining them |
| **BARE-NUMBER** | §4 · card 02 — "Projection: 816." | ⚠️ | No comparison and, since the model attribution was dropped, no owner either. The panel logged Sana losing this sentence: "Three numbers, none compared." §4's new "Today's house fills 543 of them" fixed 543/550/850; 816 still floats |
| **BARE-NUMBER** | §1 · "30 lakh" | ⚠️ (accepted) | Every comparison beside it is an internal ratio (1.7×, 12 lakh, six-tenths) — the reader still has nothing to picture. **Reported, not demanded:** storyboard §5 rules out a city-sized comparison for want of a source, and the panel records it as "a known, accepted gap rather than an oversight". Needs a source before it needs a sentence |
| **NAME-UNPLACED** | §6 · quote attribution — "Yogendra Yadav" | ⚠️ | Named once, with no role phrase anywhere in the issue. Storyboard §7 assigned him one — "the psephologist who read the gainers and losers off the projected map" — and the draft carries none. Tell 11 (the once-used name) plus contract rule 9 |
| **NAME-UNPLACED** | §3 · "The Vajpayee government", "The Indira Gandhi government" | ⚠️ (minor) | Each appears once. "government" is a role of a kind, so this is weaker than the Yadav case, but storyboard §7 specified "the Prime Minister whose government froze the seat map in 1976" / "…extended that freeze to 2026", and neither survives. Vajpayee is also surname-only |
| **STORYBOARD-DRIFT** | §3 · "84th Amendment" | ⚠️ (minor) | Storyboard §7 puts the 84th Amendment on the *described-not-named* list ("the freeze extended to 2026"). The draft names it. Defensible — a statute is not a person or an organisation and does not spend from the twelve-name budget — but it is a departure from the approved sheet |
| **STORYBOARD-DRIFT** | §3 · `events[].note` | ⚠️ (minor) | Storyboard budgets a `note` on "four of six only"; the draft carries five (1971, 1976, 2001, Sept 2023, Apr 16). All are inside the 12-word cap. Cosmetic against the word budget, not the meaning |
| **STORYBOARD-DRIFT** | §6 · `intro` | ⚠️ (minor) | 32 words against the ≤30 budget. The two-word overrun is what buys "keeps today's 543 seats", i.e. the fix the panel ranked first. Recommend accepting it |
| **CAPTION UNREACHABLE** | §6, §8 · `caption` | ⚠️ | Not a Step-4b flag, carried forward from panel fix 2 and re-verified against the dispatcher today: `SectionBody.astro` passes no `caption` to the `seat-chart` (line 174) or `vote-result` (156–167) arms, and the promoted-caption merge at line 147 only reaches arms that read `data.caption`. Contract §3.5 requires a restatement after every graphic; the issue's **two most load-bearing restatements** — the model answers to storyboard questions 2 and 3 — are authored correctly and reach no reader. Both `number-sense` and `you-think` captions **do** render (lines 190, 224), so §1 and §2 are fine |

### Composition floors — all clear

| Floor | Required | Measured | |
|---|---|---|---|
| Kinds and order vs storyboard | 9 rows as composed | `number-sense`, `you-think`, `timeline`, `bill-breakdown`, `analogy`, `seat-chart`, `paradox`, `vote-result`, `quote` — **identical** | ✅ |
| Hero | `seat-chart`, `layout: split`, sole `split` | §6, `layout: split`, the only one in the issue | ✅ |
| Visual share | ≥ 6 in 10 | 6 of 9 = 67% (§1, §2, §3, §4, §6, §8) | ✅ no TEXT-HEAVY |
| Text-only adjacency | never two adjacent | V V V V **T** V **T** V **T** | ✅ no PROSE-RUN |
| First section a graphic | required | `number-sense`, ruled sufficient by operator §9.4 | ✅ no NO-LEAD-GRAPHIC |
| Words before the first graphic | ≤ 80 | 66 (title 7 + dek 8 + hook 23 + primer 28); 73 counting §1's eyebrow and title. §1 carries no intro, as composed | ✅ no HEAD-HEAVY |
| Reader-facing words | ≤ 1,100 | ≈ 900 on the issue page, against a 1,007-word storyboard budget | ✅ |
| `prose` sections | ≤ 3 | 0 | ✅ |
| Names | ≤ 12 | 9 in reader-facing prose (Lok Sabha, Parliament, Indira Gandhi, Vajpayee, Nari Shakti Vandan Adhiniyam, Yogendra Yadav, BJP, Narendra Modi, Constitution (131st Amendment) Bill). States are places; PRS, Carnegie, SCC Online, NFHS-5, PIB and Deccan Herald appear in `source` lines only, per rule 9 | ✅ no NAME-THROUGHPUT |
| Hook | ≤ 25 words, a number, the twist | 23 words; 30 lakh / 18 lakh / 54; "lost by 54 votes" is the twist. No "you" — **removed by operator ruling §9.2**, cost measured and accepted by the panel | ✅ no HOOK-ABSTRACT |
| Titles | state the finding | all ten do; none uses the retired formula | ✅ no TITLE-FORMULA |
| Indian ground | required | lakh throughout, eight states, the Lok Sabha, the joint family and the dinner table. No `$` anywhere, so the ₹ rule has nothing to convert (storyboard §5) | ✅ no NO-INDIAN-ANCHOR |
| Analogy accuracy | mechanism must match | the `pairs[]` mapping is accurate both ways | ✅ no ANALOGY-CLAIM |
| `howToRead` | none in `NEEDS_HOW` | none authored, none renders — as composed | ✅ no REDUNDANT-HOWTO |
| `plain` role | FORM only | one `plain`, on §6, describes the form | ✅ no PLAIN-CLAIM |
| `caption` role | DATA only | four captions, all assert data | ✅ no CAPTION-FORM |
| Hindi load-bearing | blocks publish | delete "Credit nahi chahiye, he said:" and the English still says everything; the gloss sits in the same sentence | ✅ **no HINDI-LOAD-BEARING** |
| Hindi in the precision layer | blocks publish | zero Hindi in any `caption`, `plain`, `source`, data label or subtitle | ✅ **no HINDI-FIELD** |
| Storyboard questions | all three answerable | Q1 → §2 + §4; Q2 → §6 + §7; Q3 → §8. The panel recorded all twelve answers landing | ✅ no QUESTION-UNANSWERED |

### Source balance (`_TAXONOMY.md` §5)

| Check | Result |
|---|---|
| **Primary anchor** | ✅ Present and load-bearing. The bill's provisions trace to src-01 (PRS legislative brief, `primary`); the vote to src-04 (Lok Sabha division records, `primary`); the 2023 Act to src-10 (`primary`); src-02 is PIB (`primary`). **No NO PRIMARY ANCHOR** |
| **Viewpoint diversity** | ✅ The contested question — whether ending the freeze is fair — is carried by §7 with both cases weighted equally, and §6 adds Yadav's partisan reading of the map. Behind them: src-05 (Carnegie, analysis), src-06 (The Wire / Tharoor framing), src-08 (Stalin's all-party meeting, the southern-state position), src-09 (NFHS-5). **No SINGLE-VIEWPOINT** |
| **No false balance** | ✅ The settled empirical claims — the 298/230/352/528 vote counts, the eight seat rows, the 30-lakh/18-lakh ratio — are stated flat, with no contrary opinion hedged against them. **No FALSE BALANCE** |
| Unreferenced sources | src-06 and src-08 back no section, which storyboard §8f sanctions ("keep both in `sources[]`… neither needs a `sourceRefs[]` entry"). **src-07 is different** — it is the source that *should* back the §6 Yadav quote and does not |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ (waived) | `status: published`, deliberately. Storyboard §9.7 — "the rewrite replaces … same `id`, `topic`, `publishedAt`, `status: published`" — so the URL and the live page do not break. The normal draft requirement does not apply to a Phase-4 in-place rewrite. §9.7 also states it is **tabled for the operator's read before it is committed**, which is still true |
| All section kinds registered | ✅ | All nine present in `SECTION_KINDS` (`src/content/config.ts`): `timeline`, `bill-breakdown`, `vote-result`, `seat-chart`, `paradox`, `you-think`, `analogy`, `quote`, `number-sense` |
| No author field | ✅ | Absent |
| publishedAt valid | ✅ | `2026-04-24`, unchanged from the published issue |
| Source URLs https:// | ❌ | **src-09 is `http://rchiips.org/nfhs/factsheet_NFHS-5.shtml`.** Inherited verbatim from the published file. Everything else is `https://` |
| Source kinds valid | ✅ | 4 `primary`, 3 `secondary`, 3 `analysis` — all inside the allowed set |
| ≥6 sources | ✅ | 10, all ten carried over unchanged as the rewrite rule requires |
| All `sourceRefs[]` resolve | ✅ | Twelve references across nine sections; every one resolves to a real `source.id` |
| `primer` 80–420 chars | ✅ | ~158 |
| `plain` ≤ 220 chars | ✅ | One `plain`, §6, ~122 |
| `layout` value valid | ✅ | `split`, on §6 only |
| `skimCaption` on `prose` only | ✅ | None authored; no `prose` sections |
| `readTimeMinutes` | ✅ | 5, inside the 4–5 the operator set (§9.7) |

---

## Required fixes before publish

1. **Ratify or reverse the §9 title override (storyboard §9.3).** The approved
   storyboard carries a binding operator ruling that "Credit nahi chahiye" stays
   as the section title; the draft replaced it with the reversible alternate and
   moved the phrase into the `intro`. The change is well-motivated — it is the
   panel's fix 4 and clears its only REVISE-level finding — but a binding ruling
   was overridden silently. **Either** record the departure in the draft's
   summary and amend §9.3, **or** restore the composed title. Do not leave it
   unnoticed.
2. **Resolve the "Credit nahi chahiye" attribution.** §9's intro asserts the
   phrase as direct reported speech ("*he said:*"), but the published record it
   inherits from never demonstrates it: the only text quoted from that address
   is entirely in English and contains no such phrase. Either confirm the phrase
   against src-03 (the Deccan Herald report of the 18 April address) and keep
   the attributive verb, or drop the frame so the issue stops asserting a
   verbatim it cannot show. **If the phrase goes, the HINDI-SPELLING flag on
   *nahi* / *chahiye* goes with it.**
3. **Make the §6 and §8 captions reachable.** `SectionBody.astro` passes no
   `caption` to the `seat-chart` arm (line 174) or the `vote-result` arm
   (156–167), so the issue's two load-bearing restatements — the model answers
   to storyboard questions 2 and 3 — render nowhere. **Either** add
   `caption={data.caption}` to both arms (the merge at line 147 already resolves
   the promoted field, so this is a two-word change), **or** fold each
   restatement into its section's `intro`. This is a code fix, not a writing
   fix; the drafter authored both correctly.
4. **Add `src-07` to §6's `sourceRefs`.** The Yadav quote is dated April 2026
   and is cited only to Carnegie 2019. src-07 — "Yogendra Yadav's 850-seat
   projection", The Wire, from X posts during the April 2026 debate — is already
   in `sources[]` and currently backs nothing.
5. **Give Yogendra Yadav a role phrase, or cut the name.** Used once with no
   role, against contract rule 9 and tell 11. Storyboard §7 supplies the
   wording: *the psephologist who read the gainers and losers off the projected
   map*. The cheapest home is §6's `intro`.
6. **Fix the §3 / story-beat date collision.** `story.beats[2]` says "The seat
   map has not been redrawn since 1976" while §3's intro correctly separates the
   1971 redraw from the 1976 freeze. Bring the beat into line with the section.
7. **Correct §8's `sine die` gloss.** "shut for the session the same day" both
   loses the meaning (`jargon.md`: "the House closed with **no date set to
   return**") and adds a same-day timing the published record does not state.
8. **Change src-09's URL to `https://`.** One character; does not alter the
   bibliography the rewrite rule requires be kept whole.
9. **Restore an owner for the 816 figure.** Storyboard §8b.5 drops Amit Shah's
   name but keeps the model. Reinstating "the government's own 50 percent
   expansion model" — and referencing src-02, which carries it — costs seven
   words and answers the panel's "three numbers, none compared".

---

## Optional improvements

1. **Add "1.7 times" to the storyboard's sanctioned derivations (§5), or drop
   it.** The arithmetic is right (30 ÷ 18) and no fact is added, but §5 lists
   three derivations and the draft uses four. A one-line amendment closes it.
2. **Gloss "a simple majority" at §4, and draw the contrast.** That an
   *amendment* needs two-thirds while choosing *which census* needs only half is
   the sharpest mechanism in the issue, and the draft states both halves four
   sections apart without ever joining them. One clause on card 03 would do it.
3. **Restore "educating women" in §7's second detail.** The draft's "schools"
   generalises away the single variable src-09 (NFHS-5) actually measures.
4. **Give Indira Gandhi and Vajpayee their role phrases** from storyboard §7,
   and use Vajpayee's full name once. Weaker than the Yadav case, but free.
5. **Gloss "scenario"** in §6's subtitle, or lean on the new intro to carry it.
   Meera and Karthik both re-read it; the word is doing all the work of telling
   the reader the chart is a projection.
6. **Consider a label pair on the `analogy` columns.** Panel fix 8: every reader
   arrived, none on the first row. The headline's move from "in the house" to
   "at the family table" already removes the worst of it.
7. **Trim §3 to four `notes`** if the composer's word budget is being held
   strictly. All five are inside the per-note cap, so this is cosmetic.
8. **Re-run the reader panel's second pass after fixes 1–3.** The first pass
   returned REVISE on a single finding, and that finding plus the two dark
   captions are precisely what these fixes address.
