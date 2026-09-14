# Verification Report: Now even the *cool* years break records

- **Draft:** src/content/issues/2026-05-03-el-nino-new-floor/index.mdx
- **Dossier:** research/earth/2026-05-03-el-nino-new-floor-dossier.md
- **Storyboard:** research/earth/2026-09-13-el-nino-new-floor-storyboard.md (Status: approved, rulings §9)
- **Supersedes:** research/earth/2026-05-03-2026-05-03-el-nino-new-floor-verification.md (BLOCKED)
- **Verified:** 2026-09-14
- **Verdict:** BLOCKED

---

## Overall verdict

**BLOCKED — but not on anything this rewrite wrote.** Both blockers from the
May report are cleanly resolved: the Celeste Saulo quote is gone with the whole
`quote` section (no verbatim quote survives anywhere in the issue, so there is
no quotability exposure at all), and the [UNVERIFIED] ~1.7°C 2027 figure does
not appear — the closing prose keeps only the structural claim the dossier
fully supports. The three stale ⚠️ items are also fixed: the "satellite era"
gloss on Nov 2015 is deleted, the Arctic tile names its partner year, and the
`~30%` qualifier is restored. The register work is strong: 74 words before the
first graphic, 6 of 9 sections visual, no two text-only sections adjacent, ~940
reader-facing words, five names (all organisations, each with a role phrase),
one Hindi phrase in a purpose-built gloss slot that passes the skip test, and
every headline number carrying a comparison. The spine matches the approved
storyboard row for row, hero and all.

What blocks it is provenance on data the rewrite inherited verbatim. The
hero `climate-strip` renders 57 annual values, of which only six years (2016,
2022, 2023, 2024, 2025, 2026) appear anywhere in the dossier — §9 "Data for
climate-strip visualization" explicitly leaves the 1970–2014 series to be
fetched and never records the fetch. Its `source` line then credits **Berkeley
Earth** and **Copernicus C3S ERA5**, and neither the annual Berkeley Earth
series nor the ERA5 annual series is among the issue's 13 `sources[]` (src-13
is a single monthly Copernicus bulletin). The earlier verification pass never
audited this section — the storyboard §8b correctly notes that report is stale
on that row — so the series has been published twice without ever being traced.
The fix is a dossier addendum plus one `sources[]` entry, not a text change.
Eight ⚠️ items follow, two of which are substantive: the closing prose's 1998
worked example misstates the very lag it is explaining, and the primer states a
ratchet the issue's own strip values contradict.

---

## Claim verification

| # | Claim | Location | Status | Note |
|---|---|---|---|---|
| 1 | Eleven hottest years ever recorded; 2025 the last of them | head · hook | ✅ | Dossier §4 *11 hottest years* (2015–2025, in order). |
| 2 | "every year starts hotter than the one before" | head · primer | ⚠️ IMPRECISE | Contradicted by this issue's own strip values: 2025 (1.44) < 2024 (1.55); 2021 (1.10) < 2020 (1.25). The dossier's ratchet is about *cool* years — the floor rises, not every year. |
| 3 | 2025 "still finished second-hottest ever recorded" | story · beat 0 | ⚠️ IMPRECISE | Dossier §4: "effectively **tied** with 2023 as 2nd warmest". The caption in §0 says "tied"; the beat drops it. |
| 4 | Fifty-seven years; last dozen stripes above every earlier stripe | story · beat 1 | ✅ | 1970–2026 = 57 ✅. Min of 2015–2026 = 1.01; max of 1970–2014 = 0.84 (2014) ✅. Sanctioned as a reading of the section's own values (storyboard §5). |
| 5 | 91 of 100 units to the sea; about one part in a hundred to the air | story · beat 3 | ✅ | Dossier §4 *91% figure*; *5% land, 3% ice, 1% atmosphere*. |
| 6 | Two cool years three years apart: 5th/6th then tied 2nd | story · beat 5 | ✅ | Dossier §4 2022 and 2025 rows. |
| 7 | "61% odds and see the Pacific peaking in September" | story · beat 7 | ⚠️ IMPRECISE | Dossier gives +2.2°C as the median Niño3.4 anomaly **by** September and says the El Niño "peaks in late 2026". A September *peak* is not a dossier claim. The prose section (§8) states it correctly as "peaks late in 2026". |
| 8 | Record follows about three months later, putting it in 2027 | story · beat 7 | ✅ | Dossier §4 *Lag effect*. |
| 9 | 2025, a La Niña year, tied 2nd warmest at 1.44°C above the 1850–1900 average | §0 you-think · caption | ✅ | Dossier §4 *2025*. Caption correctly asserts data. |
| 10 | 1.44 °C | §0 · data.actually.value | ✅ | Dossier §4. |
| 11 | "finished second-warmest ever" (no "tied") | §0 · data.actually.text | ⚠️ IMPRECISE | Same drop as #3, and it disagrees with the caption 40 px above it. |
| 12 | 2025 hotter than 2016, an El Niño record year | §0 · data.actually.text | ✅ | 1.44 vs ~1.25 (dossier §3, 2016 row). |
| 13 | "The cooling did happen. It just started from a much warmer ocean." | §0 · data.note | ✅ | Dossier §1 + the −0.05°C ENSO contribution. |
| 14 | Source: Carbon Brief State of the Climate 2025 | §0 · source | ✅ | src-02. |
| 15 | Annual series 1970–2026, 57 values, 1850–1900 baseline | §1 climate-strip · data.values | ❌ UNTRACED | **Blocker.** Only 2016, 2022, 2023, 2024, 2025, 2026 appear in the dossier. §9 *Data for climate-strip visualization* states the series still needs a direct Copernicus/Berkeley fetch; no dossier §4 row records one. 51 values have no dossier entry. Inherited verbatim from the published issue (storyboard §8a) and never audited by the May report, which covered the retired `comparison` row instead. |
| 16 | 2016 = 1.29 in the series | §1 · data.values | ⚠️ IMPRECISE | Dossier §3 and the draft's own timeline note both say 2016 ≈ **1.25°C**. The strip says 1.29. One of the two is the wrong dataset; the issue should not state both. |
| 17 | 2022 = 1.15 · 2023 = 1.47 · 2024 = 1.55 · 2025 = 1.44 · 2026 = 1.47 | §1 · data.values | ✅ | Within / equal to dossier §4 (2022: 1.1–1.3; 2023: 1.34–1.54; 2024, 2025, 2026 exact). |
| 18 | Source line credits "Berkeley Earth · Copernicus C3S ERA5" | §1 · data.source | ❌ UNTRACED | **Blocker.** Neither resolves to an entry in `sources[]` (13 entries: 6 Carbon Brief, 6 WMO, 1 NOAA, 1 Copernicus *March 2026 monthly bulletin*), nor to the dossier §8 bibliography. A cited data provider must be a listed source. |
| 19 | Annotation 2016: "The old record: 2016's El Niño peak." | §1 · data.annotations | ✅ | Dossier §3 (2016 warmest year then on record, following the Nov 2015 El Niño). 8 words. |
| 20 | Annotation 2025: "A La Niña year, and still above the 2016 peak." | §1 · data.annotations | ✅ | 1.44 > 1.29 in-series and > ~1.25 in the dossier. 10 words. |
| 21 | "The last dozen stripes sit above every stripe before them, cool years included." | §2 jargon-buster · intro | ✅ | Arithmetically true of §1's values (see #4). Serves the contract §3 rule 5 restatement. |
| 22 | El Niño / La Niña = the Pacific's warm and cool phases, each about a year, taking turns | §2 · terms[0].meaning | ✅ | Dossier §1; matches `research/_voice/jargon.md` Earth row. |
| 23 | Pre-industrial = before factories, averaged 1850–1900 | §2 · terms[1].meaning | ✅ | Dossier baseline; `jargon.md`. |
| 24 | Energy imbalance = Earth takes in more heat than it lets out; most goes to the sea | §2 · terms[2].meaning | ✅ | Dossier §4 *Earth's energy imbalance*; `jargon.md`. |
| 25 | "More than 91% of the excess heat goes into the ocean." | §3 number-sense · caption | ✅ | Dossier §4 *91% figure*, verbatim sense. Correctly a data claim. |
| 26 | 91 % · "The ocean's share of Earth's extra heat" | §3 · data.value / label | ✅ | Dossier §4. |
| 27 | "Land holds five parts, ice three, the air one." | §3 · equals[0].note | ✅ | Dossier §4 *5% land, 3% ice, 1% atmosphere*. |
| 28 | "In 2025 alone the sea gained 39 years of human energy use" | §3 · equals[1] | ✅ | Dossier §4 *Ocean heat content record*: ~23 ZJ in 2025 = "39 times total annual human energy production". The restatement as "39 years of human energy use" is arithmetically the same statement and is the storyboard's sanctioned scale line (§5). |
| 29 | "The air you feel holds about one part in a hundred. The sea holds the rest." | §3 · data.note | ⚠️ IMPRECISE | "The rest" reads as 99. The section's own note two lines earlier says land 5, ice 3. Should be "the sea holds 91 of the other 99" or similar. |
| 30 | Source: WMO State of Global Climate 2025 | §3 · source | ✅ | src-07; the 91/5/3/1 split is specifically in the SOGC release (src-08) — acceptable as labelled. |
| 31 | "Think of the ocean as a geyser that never switches off." | §4 three-steps · intro | ✅ ANALOGY OK | Maps faithfully to dossier §1 (reservoir absorbs, El Niño spills some to air, La Niña cannot cool the reservoir). It is also the `_voice-core.md` §9 signed example. |
| 32 | Step 1: ~91 of every 100 units go into the ocean and stay there | §4 · steps[0] | ✅ | Dossier §4. |
| 33 | Step 2: El Niño spills stored heat into the air; surface temperature jumps for a year | §4 · steps[1] | ✅ | Dossier §1. |
| 34 | Step 3: La Niña cools the air a little; the next cool year starts above the old floor | §4 · steps[2] | ✅ | Dossier §1; the −0.05°C figure. |
| 35 | 2022 · La Niña year · 1.1–1.3°C · "Fifth or sixth warmest then" | §5 data-readout · tile 1 | ✅ | Dossier §4 *2022*. |
| 36 | 2024 · 1.55°C · first year above 1.5°C in most datasets · land at 2.3°C | §5 · tile 2 | ✅ | Dossier §4 *2024*. |
| 37 | 2025 · 1.44°C · tied 2nd warmest · with the Pacific swing removed from every year, the warmest | §5 · tile 3 | ✅ | Dossier §4 *2025*: "Without ENSO effects, 2025 would have been the warmest year in the observational record." Good plain-language gloss of "ENSO". |
| 38 | −0.05°C · how much La Niña cooled 2025 | §5 · tile 4 | ✅ | Dossier §4. |
| 39 | +0.128°C · what El Niño added in 2024 | §5 · tile 5 | ✅ | Dossier §4 / §3. |
| 40 | 11 hottest years, 2015 through 2025, in order | §5 · tile 6 | ✅ | Dossier §4 *11 hottest years*. |
| 41 | Source: Carbon Brief SOTC 2022 / 2024 / 2025 · WMO SOGC 2025 | §5 · data.source | ✅ | src-05, src-03, src-02, src-07. |
| 42 | Timeline annotation at 2025: "The cool year landed above the old hot record." | §6 timeline · data.annotations | ✅ | 1.44 > ~1.25. `at` matches the event's `date` string. 9 words. |
| 43 | Nov 2015: strongest El Niño in 18 years; 2016 warmest year then on record, about 1.25°C | §6 · events[0] | ✅ | Dossier §3. **The May report's ⚠️ "satellite era" gloss is gone.** |
| 44 | 2020–2022: three cool years in a row; 2022 fifth or sixth warmest; floor 1.1–1.3°C | §6 · events[1] | ✅ | Dossier §3 triple-dip row; §4 *2022*. |
| 45 | 2024: 1.55°C, the line crossed; first above 1.5°C; El Niño added 0.128°C | §6 · events[2] | ✅ | Dossier §3 / §4. |
| 46 | 2025: La Niña year at 1.44°C, tied second-warmest; cooling took off 0.05°C | §6 · events[3] | ✅ | Dossier §4 *2025*. |
| 47 | Mar 23 2026: the UN's weather agency counts Earth's energy imbalance for the first time | §6 · events[4] | ✅ | Dossier §3 Mar 23 2026; §4 *First-ever WMO indicator*. Role phrase present. |
| 48 | Apr 2026: NOAA, the US office that calls El Niño, opened a Watch on April 9 | §6 · events[5] | ✅ | Dossier §3 Apr 9 2026. Role phrase present. |
| 49 | "The WMO confirmed on April 24." | §6 · events[5].note | ⚠️ IMPRECISE | Dossier §3: the WMO announced "**high confidence in the onset** of El Niño, followed by further intensification" — a forecast statement, not a confirmation that El Niño had begun (NOAA still had ENSO-neutral conditions and a 61% probability). "Confirmed" overstates the source. |
| 50 | Source: WMO · NOAA CPC · Carbon Brief | §6 · source | ✅ | src-07/08/09, src-10, src-01. |
| 51 | "637 runs from thirteen modelling groups" | §7 data-readout · intro | ✅ | Dossier §4 *Niño3.4 median forecast*. |
| 52 | 61% probability El Niño develops by May–July 2026 (NOAA, April 9) | §7 · tile 1 | ✅ | Dossier §4 / §3. |
| 53 | +2.2°C central Pacific by September; above the Pacific's own normal; median of 637 runs; +2.0 is "super" | §7 · tile 2 | ✅ | Dossier §4 *Niño3.4 median forecast* and *Super El Niño definition*. The baseline clarification and the "central Pacific" gloss of Niño3.4 are both improvements. |
| 54 | 62% probability 2026 = 2nd warmest; best estimate 1.47°C above pre-industrial | §7 · tile 3 | ✅ | Dossier §4 *2026 temperature projection*. |
| 55 | ~30% probability 2026 exceeds 1.5°C; the line first crossed in 2024 | §7 · tile 4 | ✅ | Dossier §4 ("~30%"). **The May report's ⚠️ missing qualifier is fixed.** |
| 56 | ~3-month lag; "Seen three times since 1998"; puts this record in 2027 | §7 · tile 5 | ✅ | Dossier §4 *Lag effect* (1998, 2016, 2024). |
| 57 | Arctic sea ice winter maximum 2026 = 14.29 M km², joint-smallest **with 2025** | §7 · tile 6 | ✅ | Dossier §4 *Arctic sea ice*. **The May report's ⚠️ missing partner year is fixed.** |
| 58 | "About 4.3 times India (3.3M km²)" | §7 · tile 6 note | ✅ ANALOGY OK | Operator-ruled (storyboard §9.3) as a common-knowledge scale constant. 14.29 ÷ 3.3 = 4.33 ✅; India's land area 3.287 M km² ✅; the basis is stated in the note as the ruling required. |
| 59 | Source: NOAA CPC · Carbon Brief Q1 2026 · WMO Likelihood Increases of El Niño | §7 · data.source | ✅ | src-10, src-01, src-09. |
| 60 | The Pacific warms first; world temperature follows ~3 months behind; the record year is usually the year after | §8 prose · lead | ✅ | Dossier §4 *Lag effect*. |
| 61 | "That is what happened after the El Niño of 1998." | §8 · para 1 | ⚠️ IMPRECISE | The dossier's three cases (1998, 2016, 2024) are the **record years**; their El Niños peaked at the end of 1997, 2015 and 2023. As written, "the El Niño of 1998" plus "the record shows up the year after" predicts 1999 — which the issue's own strip puts at 0.48, far below 1998's 0.74. The mechanism is misstated by its own worked example. |
| 62 | "The same lag showed up in 2016 and in 2024." | §8 · para 1 | ✅ | Dossier §4 *Lag effect*. |
| 63 | Best estimate 1.47°C; 2027 given the better chance of the record | §8 · para 2 | ✅ | Dossier §4: 2026 has a 19% chance of being warmest ever; "if strong El Niño peaks in late 2026, 2027 becomes the likely warmest year on record." |
| 64 | "Its floor will sit above 1.44°C" | §8 · para 2 | ✅ | Dossier §1 (the subsequent La Niña cannot drain the reservoir). |
| 65 | skimCaption: lag → 2027 → next cool year above 1.44°C | §8 · skimCaption | ✅ | Same trace as #60, #63, #64. |
| — | **~1.7°C for 2027** | — | ✅ **ABSENT** | Dossier §9 note 6 [UNVERIFIED]. **May blocker #2 resolved by composition**, per storyboard §9.6. |
| — | **Celeste Saulo quote and its dating** | — | ✅ **ABSENT** | The whole `quote` section is cut. **May blocker #1 resolved.** No verbatim quote appears anywhere in the issue, so there is no quotable/non-quotable exposure to assess. |

**Counts: 55 ✅ VERIFIED · 8 ⚠️ IMPRECISE · 2 ❌ UNTRACED · 0 ❌ ADVOCACY · 0 ❌ UNVERIFIED CLAIM USED · 0 ❌ NON-QUOTABLE SOURCE.**

*RAG note:* `mcp__parallax_rag__search` is not available in this session, so
corpus trace was performed against the dossier's recorded source URLs, as the
agent contract allows. The draft contains no quoted passage, so the quotability
gate is moot for this issue.

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | No ADVOCACY, RHETORICAL Q, PASSIVE FILLER, WIRE TONE, SPECULATION or META-COMMENTARY found. |

Notes on the checks that used to fail here:

- The May report's ⚠️ META-COMMENTARY ("the public still tends to ask it
  wrongly") and ⚠️ MILD ADVOCACY ("the framing that has to travel") are both
  gone with the two prose bookends.
- "Then the Pacific will cool again" is not ❌ SPECULATION: dossier §1 states
  the subsequent La Niña explicitly, and the sentence hedges nothing the
  sources do not.
- AI tells: no paragraph carries two em-dashes; one "not X" construction in
  the issue (the dek, which the storyboard budgets as the issue's single
  antithesis because the hook does not reverse); no triple-fragment close; no
  ordinal manifesto; no stacked citation; no run of three sentences under
  eight words; no name used once without a role.
- Structure: the timeline's arc is directional (peak → trough → record →
  trough-that-wasn't → new indicator → the next one called); the data-readouts
  tell their story in tiles rather than prose; there is no `paradox`, so no
  straw-man tension to test.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| HINDI-LOAD-BEARING | — | ✅ PASS | Only Hindi in the issue is `garam saal, thanda saal` in §2's `hindi` gloss slot. Delete it and Karthik loses nothing — the English meaning line stands alone. |
| HINDI-FIELD | — | ✅ PASS | No Hindi in any `caption`, `howToRead`, `plain`, `source` or data label. The `jargon-buster.hindi` slot is a purpose-built field (catalog DATA line; `check:prose` exempts it), not the precision layer. |
| ⚠️ HINDI-SPELLING | §2 · terms[0].hindi | low | *garam*, *thanda* and *saal* are not rows in `research/_voice/hinglish-lexicon.md` (which has *garmi / sardi*), and the lexicon says anything not on it is not used. But `_voice-core.md` §9 uses this exact phrase as its signed worked example for this very issue. **The fix is to add the three words to the lexicon, not to change the draft.** |
| HINDI-DENSE | — | ✅ PASS | One phrase, one section, no consecutive sentences, Roman and set roman. |
| ⚠️ JARGON-UNGLOSSED | §1 · data.caption; §5 · data.caption | low | "ANOMALY" appears in two captions and is never glossed. Everywhere else the issue says "above the 1850–1900 average", which is the plain form and is better. Dropping the word costs nothing. |
| BARE-NUMBER | — | ✅ PASS | 14.29 M km² → India; 91% → 100 units + the 5/3/1 split; 23 ZJ → 39 years of human energy use; +2.2°C → against the +2.0 "super" line and the Pacific's own normal; 1.44°C → against 2016 and 2022. No `$` figures, so no ₹ conversion is owed (storyboard §5). |
| NO-INDIAN-ANCHOR | §7 · tile 6 | ✅ PASS (at the floor) | Exactly one Indian anchor — the operator-ruled Arctic/India comparison — plus the geyser, which is an Indian object rather than an Indian fact. The storyboard predicted this and named raising it a research job. |
| NAME-THROUGHPUT | — | ✅ PASS | Five distinct names, all organisations: WMO, NOAA CPC, Carbon Brief, Berkeley Earth, Copernicus. Cap is 12. |
| NAME-UNPLACED | — | ✅ PASS | WMO ("the UN's weather agency") and NOAA ("the US office that calls El Niño") carry role phrases in prose. Carbon Brief, Berkeley Earth and Copernicus appear only in `source` lines, which the rule exempts. |
| ⚠️ ANALOGY-CLAIM | §8 · para 1 | **substantive** | The 1998 worked example misstates the lag it exists to explain — see claim #61. An analogy is form; a wrong one is a wrong claim. |
| ⚠️ ANALOGY-CLAIM | head · primer | **substantive** | "every year starts hotter than the one before" states a ratchet the issue's own 57 values contradict — see claim #2. The staircase is a floor that rises, not a monotone series. |
| HOOK-ABSTRACT | head · hook | ✅ PASS | 22 words, two numbers a reader can feel (eleven, 2025), a "you", and the twist in "was supposed to be". |
| TITLE-FORMULA | head · title | ✅ PASS | "Now even the *cool* years break records" states the finding; the retired "The ‹Noun› That ‹Verb›s" construction is gone. |
| TEXT-HEAVY | — | ✅ PASS | 6 of 9 sections visual (67%) on the strict reading the operator ruled (storyboard §9.5): `you-think`, `climate-strip`, `number-sense`, two `data-readout`, `timeline`. |
| PROSE-RUN | — | ✅ PASS | Text-only at sections 3, 5 and 9 (1-indexed) — a figure between each. |
| NO-LEAD-GRAPHIC | §0 | ✅ PASS | `you-think` opens, per operator ruling §9.1. |
| HEAD-HEAVY | head | ✅ PASS | 74 words before the first graphic (title 7 + dek 10 + hook 22 + primer 35), cap 80. Row 1 carries no intro, as the storyboard required. Total reader-facing ≈ 940 words, cap 1,100. |
| ⚠️ STORYBOARD-DRIFT | head · dek | low | Kinds, order, hero, `layout: wide`, both annotations, six timeline events and the six-tile readouts all match §3 row for row. One departure, unnamed: the dek is "A staircase, not a swing" where the storyboard wrote "A staircase, not a **jhoola**" — which the storyboard designated as the issue's Hindi carrier (`_voice-core.md` §3.12: the dek carries the Hindi if the title has none). Result: the issue's only Hindi is a gloss slot. Also §0's caption runs 15 words against a ≤12 budget. Neither changes the spine. |
| QUESTION-UNANSWERED | — | ✅ PASS | Q1 (how hot was 2025?) → §0 caption and §5 tile 3. Q2 (where does the heat go, why can't La Niña give it back?) → §3 and §4. Q3 (which year sets the record?) → §7 tile 5 and §8. All three answerable from the draft alone. |
| NO PRIMARY ANCHOR | — | ✅ PASS | Load-bearing facts anchor on T0 sources: WMO SOGC 2025 (src-07/08), NOAA CPC (src-10), Copernicus (src-13). Carbon Brief carries the year-by-year syntheses as T3/T4 analysis on top of them. |
| SINGLE-VIEWPOINT | — | ✅ PASS | The issue makes no contested policy or interpretation claim; its "what it means" content is the ratchet mechanism, which is a settled-physics reading of primary data. |
| FALSE BALANCE | — | ✅ PASS | No hedging of the settled empirical claims against contrary opinion. Forecast probabilities are stated as probabilities, which is what the sources state. |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ⚠️ N/A | `status: published` is **deliberate** — this is a Phase-4 in-place rewrite of an already-published issue (operator ruling, storyboard §9.8; task brief). Not a defect. Note that the issue is therefore live the moment it is committed, which is why the ❌ items below matter before commit, not before a status flip. |
| All section kinds registered | ✅ | `you-think`, `climate-strip`, `jargon-buster`, `number-sense`, `three-steps`, `data-readout`, `timeline`, `prose` — all present in `SECTION_KINDS` (`src/content/config.ts`). |
| No author field | ✅ | |
| publishedAt valid | ✅ | 2026-05-03, unchanged. |
| Source URLs https:// | ✅ | All 13. |
| Source kinds valid | ✅ | 7 `primary`, 6 `analysis`. |
| ≥6 sources | ✅ | 13 (src-01…src-13), unchanged from the published issue as the storyboard §8a required. |
| Field-level bounds | ✅ | `primer` ≈ 183 chars (80–420); `layout: wide` valid; `skimCaption` on `prose` only; no `plain` or `howToRead` authored (none of these kinds is an instrument, so the RG-19 per-kind defaults apply); `data-readout` tiles use `emphasis: key/warn`, which `DataReadout.astro` reads; `climate-strip` and `timeline` `annotations[]` match the catalog shape and their `at` values resolve (2016, 2025; the timeline's "2025" matches its event `date` string). |
| Story beat indices | ✅ | Beats reference sections 0, 1, 3, 5, 7 → `you-think`, `climate-strip`, `number-sense`, `data-readout` (THE NUMBERS), `data-readout` (WHAT THE MODELS SAY). All resolve to the intended sections. |

---

## Required fixes before publish

1. **[❌ BLOCKER] Trace the `climate-strip` series, or cut it back to what the
   dossier holds.** 51 of the 57 annual values (1970–2014, and 2017–2021) have
   no dossier entry; §9 leaves the series to a fetch that was never recorded.
   The cheapest honest fix, since the values are inherited verbatim from the
   published issue and nothing suggests they are wrong: add a **§4 row to the
   dossier** recording the annual global mean temperature anomaly series with
   its provider, dataset version and access date, then re-check the six years
   the dossier already carries against it. Do not publish the rewrite with the
   series still untraced — it will otherwise have shipped three times without
   a source anyone can follow.

2. **[❌ BLOCKER] Make "Berkeley Earth" and "Copernicus C3S ERA5" resolvable.**
   The hero's `source` line credits two data providers that appear in neither
   `sources[]` nor the dossier bibliography (src-13 is the Copernicus *March
   2026 monthly bulletin*, not the annual series). Either add the Berkeley
   Earth annual series and the ERA5 annual series as `sources[]` entries —
   both are T1 datasets and both are allowlisted — or drop the names from the
   source line and credit only what is listed. Fix 1 and fix 2 are one job.

3. **[⚠️] Correct the 1998 example in the closing prose.** "That is what
   happened after the El Niño of 1998" plus "the record it sets will most
   likely show up the year after" predicts 1999, which the issue's own strip
   shows at 0.48 against 1998's 0.74. The dossier's three cases are the
   *record* years 1998, 2016 and 2024, whose El Niños peaked at the end of
   1997, 2015 and 2023. Suggested: *"That is what happened in 1998, after the
   Pacific peaked at the end of 1997. The same lag showed up in 2016 and in
   2024."*

4. **[⚠️] Fix the primer's ratchet.** "every year starts hotter than the one
   before" is contradicted by the section directly below it (2025 < 2024,
   2021 < 2020). The claim the dossier supports is about the floor. Suggested:
   *"Since 2015 the cooling stops short, so every cool year starts hotter than
   the last cool year."*

5. **[⚠️] Settle 2016 at one value.** The strip renders 1.29; the timeline note
   and the dossier say about 1.25. Pick the dataset the strip uses and make the
   timeline note match it, or say "about 1.25°C" in both — but the issue must
   not print two figures for the year its own annotation calls "the old
   record".

6. **[⚠️] Soften "The WMO confirmed on April 24."** The dossier records "high
   confidence in the onset of El Niño, followed by further intensification" —
   a forecast, issued while NOAA still had ENSO-neutral conditions on the
   board. Suggested: *"The WMO said on April 24 it had high confidence the El
   Niño would arrive."*

7. **[⚠️] Restore "tied" to the two places that dropped it.** §0's
   `actually.text` and story beat 0 both say 2025 "finished second-warmest /
   second-hottest ever", while the caption directly above says "tied
   second-warmest". The dossier says "effectively tied with 2023".

8. **[⚠️] Fix "The sea holds the rest."** (§3 `data.note`.) It reads as 99 of
   100 against the section's own 5-land / 3-ice / 1-air split. Suggested:
   *"The air you feel holds about one part in a hundred. The sea holds
   ninety-one."*

9. **[⚠️] Correct story beat 7's September peak.** The dossier gives +2.2°C as
   the median anomaly *by* September and dates the peak to "late 2026" — which
   is what §8's prose says. Align the beat with the prose.

---

## Optional improvements

- **⚠️ CAPTION-FORM ×3.** All three authored captions on the visual sections
  describe the graphic rather than assert its finding: "GLOBAL MEAN TEMPERATURE
  ANOMALY — ANNUAL, 1970–2026" (§1), "GLOBAL TEMPERATURE ANOMALY · 2022–2025"
  (§5), "2026 EL NIÑO AND TEMPERATURE OUTLOOK" (§7). They are inherited
  verbatim and the storyboard sanctioned the carryover, and §1's two
  annotations do carry the finding on the mark, so this is not a required fix
  — but three of the issue's four traceable caption slots are currently spent
  on chart titles. §0 and §3 show what the field is for.
- **Add the lexicon rows.** *garam*, *thanda*, *saal* — used by the signed
  `_voice-core.md` §9 example and now by a published issue, absent from
  `hinglish-lexicon.md`. Add them under "nouns the reader owns" (earth desk)
  so the prose gate stops treating the contract's own example as off-list.
- **§4's source line lists NOAA CPC**, which sources the ENSO *forecast*, not
  the ratchet mechanism the three cards describe. WMO SOGC 2025 alone (or WMO +
  Carbon Brief) would be the honest line.
- **§2 `jargon-buster` carries no `source`.** It is a narrative kind and its
  glosses come from `research/_voice/jargon.md`, so CANON §7 is not strictly
  in play — but §4 `three-steps`, the other narrative kind, does carry one.
  Consistency argues for either both or neither.
- **No question anywhere in the issue.** The register plan measured Finshots at
  2.5 questions per thousand words against the published corpus's zero, and
  `_voice-core.md` §3 rule 6 allows one per section as an opener. The reframe
  at §0 and the mechanism at §4 are both natural places for one.
- **NUMBER-DRIFT was not checked here** — comparing numerals against the
  previous committed version needs git access this session did not have. Run
  `npm run check:prose -- 2026-05-03-el-nino-new-floor` before committing; it
  reads the prior version and owns that check.
