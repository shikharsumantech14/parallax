# Verification Report: More than half India's arrivals are *Indians*

- **Draft:** src/content/issues/2026-09-21-half-indias-arrivals-are-indians/index.mdx
- **Dossier:** research/travel/2026-09-17-half-indias-arrivals-are-indians-dossier.md
- **Storyboard:** research/travel/2026-09-21-half-indias-arrivals-are-indians-storyboard.md (approved)
- **Panels:** …-panel.md (REVISE, applied) · …-panel-2.md (PASS)
- **Verified:** 2026-09-22
- **Verdict:** BLOCKED

---
## Overall verdict

**BLOCKED on one number.** Section 6 prints "India budgeted ₹3.5 crore to
promote itself overseas this financial year. Divide it by 9.15 million foreign
tourists, which means about 38 paise each." ₹3.5 crore is ₹3,50,00,000;
divided by 9,150,000 that is **₹3.83**, not 38 paise. The draft is wrong by a
factor of ten, and because it prints both operands in the same sentence, the
page refutes itself in front of the reader. The error did not originate here:
dossier §4h carries "roughly 38 paise per foreign tourist (Researcher's
division)", and the draft copied it faithfully. No other gate caught it —
Karthik, the panel's arithmetic persona, explicitly ratified it ("the ₹3.5
crore promotion budget works out to 38 paise a tourist. Numbers check out").
The dossier line needs the same correction, or the next issue that reaches for
it will reprint it.

Everything else is in good order. **Nothing in this draft is invented.** All
61 extracted claims trace to the dossier; the four ⚠️ flags are wording drift
and one attribution judgment, not sourcing failures. The composition floors
are met with room (44% drawn graphics, 4 graphic kinds, 3 cards used once
each, 78% visual, no adjacent text-only sections), and the panel's four
first-pass findings were all resolved in the draft as it now stands. The
second blocker-adjacent item, **SOURCE-NARROW**, is real but structural: 7
sources across 3 publishers with Skift at 43%, against floors of 8 / 5 / 40%.
The draft declares it in its own EDITOR block and correctly refuses to pad
with the dossier's four unused framing-only sources.

Two margins constrain every fix below: the issue sits at **1,100 of 1,100
reader-facing words** and **79 of 80 words before the first graphic**. There
is no slack. Every required fix here is a substitution, and fix 1 is
word-neutral by construction.

---
## Claim verification

61 claims extracted and traced. Only non-✅ rows and the load-bearing ✅ rows
are itemised; the remainder (country-table values, timeline counts, waffle
groups, region-map ids) traced cleanly to dossier §4c–§4e and are summarised
in the block rows.

| Claim | Location | Status | Note |
|---|---|---|---|
| 20.22m arrivals / 9.15m foreign / 11.07m Indian, 2025 | hook · primer · §2 caption | ✅ | Dossier §4a. The issue's spine, stated four times, consistent every time |
| "Foreign tourists fell 8% last year. Indians coming home rose 4%." | primer | ✅ | Dossier §4a. Panel 1 flagged these as unconfirmable in the body; the 2025 timeline event now carries 8.07% and 4.26%, so they are checkable |
| 55 in every 100 arrivals carried an Indian passport | §2 · `actually.value` | ✅ | 11.07 ÷ 20.22 = 54.75% |
| Ten-country bar values (US 18.0 … Singapore 2.1 lakh) | §1 · `data.items` | ✅ | Dossier §4d, converted from shares against a 99.5-lakh 2024 foreign total. Cross-checks against §7's shares to two decimals |
| `refValue: 106.2` lakh Indians coming home | §1 · `data.refValue` | ✅ | The **2024** NRI figure, as the storyboard's §2 authoring rule required (not 2025's 110.7). Authored in lakh because BenchmarkChart prints values raw |
| Bangladesh sublabel "4.66 lakh in 2025" · note "466,012 in 2025" | §1 · §7 | ✅ | 17.5 lakh × (1 − 0.7337) = 4.66 lakh. Internally consistent across both sections |
| "Visa curbs from August 2024" | §1 · `annotations[0]` | ✅ | Dossier §4d |
| 2008 UN rule: nationals abroad counted separately | §3 · 2008 event | ✅ | src-04, IRTS 2008 B.1 |
| 2014: 13.11m / 5.43m Indian / 41 in 100 | §3 · 2014 event | ✅ | 41.4% |
| 2019: 17.91m / 6.98m Indian / 39 in 100 | §3 · 2019 event | ✅ | 38.97%. Panel 1's finding — the caption's 6.98m was not derivable from the graphic — is **resolved**: the figure and the ratio now sit inside the 2019 event |
| 2021 foreign floor 1.52m | §3 · 2021 event | ✅ | Dossier §3 |
| 2024: Indians 10.62m vs foreign 9.95m | §3 · 2024 event | ✅ | The swap year. Dossier §4a |
| 2025: Indians 11.07m **up 4.26%**, foreign 9.15m **down 8.07%** | §3 · 2025 event | ✅ | Both percentages are the dossier's, computed on unrounded portal figures. The rounded counts printed alongside reproduce 4.24% and 8.04%; this is normal for a portal that publishes both, and no reader-facing number is wrong |
| FTA / NRI arrival / ITA definitions | §4 · `terms` | ✅ | Dossier §4a identity (ITA = FTA + NRI), src-04 for the concepts |
| Waffle: 34 / 33 / 13 / 7 / 13 | §5 · `groups` | ✅ | Dossier §4c. Sums to exactly 100, which AttritionWaffle hard-requires |
| "Printed as 7.5, drawn as 7" | §5 · medical note + caption | ✅ | The rounding is disclosed on the graphic rather than hidden — correct handling |
| Denominator ambiguity (foreign only, or all arrivals?) | §5 · intro + caption | ✅ | Dossier §4c marks this `[UNVERIFIED — materially important]`. Panel 1 asked for the caveat to arrive **before** the numbers; it now opens the intro. `trueN` correctly omitted (see Register table) |
| Arrivals slipped 1.71% in 2025 | §6 ¶1 | ✅ | Dossier §4g |
| FEE fell 5.53% in rupees; ₹2,93,033cr → ₹2,76,831cr | §6 ¶2 | ✅ | Difference ₹16,202cr = 5.529%. Panel 1 asked for a felt comparison; "about five and a half rupees gone from every hundred" supplies it |
| "The portal leads with 9.51%, but that is the fall in dollars" | §6 ¶2 | ✅ | Dossier §4g's explicit trap ("never print 9.5% bare") handled exactly as instructed, in one sentence, as panel 1 asked |
| UN quote: "mainly stay with family and friends" | §6 ¶3 | ✅ | **Verbatim** against dossier §5. src-04 is open-access UN Statistics — quotable |
| "A foreign tourist stays eighteen days" | §6 ¶3 | ✅ | Dossier §4g average stay |
| "…and pays a hotel for most of them" | §6 ¶3 | ⚠️ IMPRECISE | An entailment, not a sourced fact. The dossier establishes the *contrast* (diaspora stay with family) but never that a foreign tourist is in paid accommodation for a majority of 18 days. Weaken to a claim the source carries |
| India budgeted ₹3.5 crore for overseas promotion this FY | §6 ¶4 | ✅ | src-07. Figure itself is right |
| **"which means about 38 paise each"** | **§6 ¶4** | **❌ ARITHMETIC** | **₹3,50,00,000 ÷ 9,150,000 = ₹3.83.** Wrong by 10×. Traces to dossier §4h ("Researcher's division"), which is itself wrong. Both must be corrected |
| Region-map `value` 1.0 / 0.97 / 0.567 / … | §7 · `zones` | ✅ | Correct as authored. RegionMap's interface documents `value` as **0–1 choropleth intensity** consumed by `colorAt()` with no internal normalisation — the storyboard's raw share values would have clamped every zone to the darkest colour. Ratios reproduce the shares exactly |
| ISO numeric ids 840 / 050 / 826 / 036 / 124 / 458 / 144 / 276 / 250 | §7 · `zones[].id` | ✅ | All nine correct per the component's header list |
| US 18.13%, Bangladesh 17.59% of foreign tourists, 2024 | §7 · caption | ✅ | Dossier §4d |
| Bangladesh fell 73.37% in 2025; without it the foreign half grew 4.25% | §7 · caption | ✅ | Dossier §4d. The counterfactual is the issue's sharpest finding and it is sourced |
| "The tenth, Singapore, is too small to shade" | §7 · plain | ✅ | Form, honestly stated rather than quietly dropped |
| 468 domestic visits per foreign tourist | §8 · `value` | ✅ | 4,287 ÷ 9.15 = 468.5. Authored as the string `"468"`, which is what NumberSense requires |
| 4,287 million domestic tourist visits, 2025 | §8 · `equals[0]` + caption | ✅ | Dossier §4h |
| 32.83 million Indian departures, 2025 | §8 · `equals[1]` | ✅ | Dossier §4h |
| "Three departures for every foreign arrival" | §8 · `equals[1].note` | ⚠️ IMPRECISE | 32.83 ÷ 9.15 = **3.59**. "Three" understates by more than half a unit. Understating one's own claim is the house drawing rule, so this is a soft flag, but "three and a half" is both truer and no longer |
| Billa quote, 40 words | §9 · `quote` | ✅ | **Verbatim** against dossier §5, character for character |
| Attribution: "Suman Billa, Additional Secretary at the Ministry of Tourism, 14 September 2026" | §9 · `attribution` | ⚠️ PARAPHRASE-RISK | The only record is Skift; no ministry transcript exists (dossier §5, draft EDITOR note 2). The standing quote-attribution fallback (2026-09-15) says keep the wording and move the attribution to the **outlet**. The section's source line does name Skift, so the reader can trace it — but the attribution field asserts the speaker directly |
| "Domestic visits are up 45.6%" | §9 · `followup` | ✅ | Dossier §4h |
| "the foreign half is still 16.29% below 2019" | §9 · `followup` | ✅ | (10.93 − 9.15) ÷ 10.93 = 16.29%, against the 2019 foreign count the timeline derives |
| "six years after the **borders reopened**" | §9 · `followup` | ⚠️ IMPRECISE | The dossier says "six years after the pandemic". Six years runs from the **2019 peak**; the dossier's own §3 timeline puts border reopening at 2022, which makes this clause false by three years |

**Untraced claims: 0.** Nothing in this draft came from outside the dossier.

---
## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| "In the other direction:" — a colon used as a pivot, not before a list, gloss or quote | §8 · `equals[1].text` | ⚠️ minor | Full stop and a new clause, or drop the phrase: the second row is already visibly the second row |

No advocacy, no rhetorical-question closers, no wire tone, no speculation, no
meta-commentary. Zero em-dashes, zero semicolons, no AI-word-list vocabulary,
no "not about X, it's about Y", no triplet closes, no sentence-opening
"Notably". Titles state findings ("Arrivals barely moved. Earnings fell.").
The hook carries a number, a "you" and the twist in 24 words.

---
## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ SOURCE-NARROW | `sources[]` | ⚠️ | **7** sources (floor 8), **3** publishers (floor 5) — Ministry of Tourism, UN Statistics Division, Skift — with Skift at **3/7 = 43%** (ceiling 40%). Self-declared in the draft's EDITOR block. Not fixable by padding: the four unused dossier sources are framing-only, and orphan citations are their own defect |
| ⚠️ STORYBOARD-DRIFT (a) | §5 · absent `trueN` | ⚠️, departure is correct | Storyboard row 5 specifies `trueN: 9150000`, which contradicts its own neutral `subject`. AttritionWaffle forces `trueN` into the caption and adds a `per hundred · n = N` chip, so authoring it would assert a full-year foreign-tourist sample size beside a three-month table of unknown denominator. **Omission is right.** Named in the EDITOR block |
| ⚠️ STORYBOARD-DRIFT (b) | §7 · `zones[].value` | ⚠️, departure is correct | Storyboard row 7 gives raw share values (18.13, 17.59 …). RegionMap takes 0–1 intensity, so raw values would clamp every zone. Draft normalises against the US. **Not** named in the EDITOR block — record it, so nobody "restores" the storyboard's figures |
| ⚠️ REDUNDANT-HOWTO | §5 · `howToRead` vs `plain` | ⚠️ minor | "Each square is one arrival in every hundred" and "A hundred squares, one arrival each" state the same fact. The paragraph earns its length only on the grouping order and the control clause |
| ⚠️ JARGON-UNGLOSSED "2014" | §3 | — (gate artifact) | `check:prose` fired on a four-digit year read as a first-use term. Not a defect |
| Word budget | whole issue | at ceiling | **1,100 / 1,100** reader-facing words. Zero slack — every fix must be a substitution |
| Head budget | §1 | at ceiling | **79 / 80** words before the first graphic. One word of room |
| ✅ FEW-GRAPHICS / CARD-HEAVY / NO-NEW-KIND | — | clean | 4 drawn graphics of 9 sections (44%, floor 40%) across 4 kinds (floor 3): `benchmark-chart`, `timeline`, `attrition-waffle`, `region-map`. 3 cards (`you-think`, `jargon-buster`, `number-sense`), each used once (ceiling 3 total, 1 each). 7 of 9 sections visual (78%, floor 60%). First section a graphic. No two text-only sections adjacent. `check:prose` raised none of the three diversity flags |
| ✅ NAME-THROUGHPUT | — | clean | One named person (Suman Billa, with his role), three organisations. Floor is 12 |
| ✅ HINDI rules | — | clean | Zero Hindi anywhere, per the storyboard's §4 ruling that the material has no natural Hindi word. Nothing load-bearing, nothing in the precision layer, by construction |
| ✅ NO-INDIAN-ANCHOR | — | clean | ₹, crore, lakh and paise throughout; the whole subject is India |
| ✅ TITLE-FORMULA / HOOK-ABSTRACT | — | clean | Title states the finding; hook is numeric |
| ✅ QUESTION-UNANSWERED | — | clean | All four personas answered all three storyboard questions from the draft alone in panel 2 |
| ✅ PLAIN-CLAIM / CAPTION-FORM | all sections | clean | Every `plain` describes form; every `caption` asserts data. The one to watch is §1's caption, which carries the hero's whole claim and traces |

---
## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ | |
| All section kinds registered | ✅ | `benchmark-chart`, `you-think`, `timeline`, `jargon-buster`, `attrition-waffle`, `prose`, `region-map`, `number-sense`, `quote` — all in SECTION_KINDS |
| No author field | ✅ | |
| publishedAt valid | ✅ | 2026-09-21 |
| Source URLs https:// | ✅ | 7 of 7 |
| Source kinds valid | ✅ | 4 primary, 3 secondary |
| ≥8 sources | ❌ | 7 |
| ≥5 publishers | ❌ | 3 |
| No publisher >40% | ❌ | Skift 43% |
| `plain` ≤220 · `howToRead` 40–360 · `primer` 80–420 | ✅ | All within bounds |
| `skimCaption` on `prose` only | ✅ | §6 |
| `layout` valid | ✅ | `wide` on §1 |
| Every `sourceRefs[]` resolves | ✅ | All 17 refs across 9 sections resolve to src-01…src-07 |
| Component hard-throws | ✅ | Waffle groups sum to 100 across 5 groups, none below 1; `number-sense` has a string `value` and 2 `equals` rows |

---
## Required fixes before publish

1. **§6, paragraph 4 — correct the per-tourist figure.** "about 38 paise each"
   → **"about ₹3.83 each"**. ₹3,50,00,000 ÷ 9,150,000 = ₹3.825. The
   substitution is word-neutral, so the 1,100-word ceiling is unaffected, and
   the sentence's rhetorical point survives intact: ₹3.83 a head is still a
   rounding error against a ₹2.77 lakh crore earnings line.
2. **Correct dossier §4h in the same pass.** The line reads "roughly 38 paise
   per foreign tourist (Researcher's division)". Leave it and the next issue
   that reaches for this figure reprints the error. This is the origin, not
   the draft.
3. **§9, `followup` — fix the clause that dates the gap.** "six years after
   the borders reopened" → **"six years on from its 2019 peak"**. Borders
   reopened in 2022 by the dossier's own timeline; six years is measured from
   2019. Same word count.
4. **§6, paragraph 3 — pull "pays a hotel for most of them" back to the
   source.** The dossier supports the contrast, not the majority-of-nights
   claim. "…and pays for a bed most nights" is equally unsourced; prefer a
   form that asserts only the contrast the UN manual makes.
5. **SOURCE-NARROW — add one genuine publisher, or accept the flag on the
   record.** The honest gap is src-07: the ₹3.5 crore overseas-promotion
   allocation rests on a single secondary outlet. **`tourism.gov.in` sits on
   the travel allowlist at T0** (the dossier's off-allowlist note covers
   `indiabudget.gov.in` and `pib.gov.in`, not this), so the ministry's own
   market-research page is a reachable primary for the allocation and would
   fix the publisher count, the Skift share and the tier of the one figure
   this issue now has to reprint. If it cannot be found, publish with the flag
   stated — do not pad with the dossier's four framing-only sources.

---
## Optional improvements

- **§8** — "Three departures for every foreign arrival" is 3.59. "Three and a
  half" is truer at the same length.
- **§9** — the draft's own EDITOR note 2 offers the outlet form. Taking it
  ("Suman Billa, Additional Secretary at the Ministry of Tourism, speaking to
  Skift") brings the attribution in line with the standing fallback, at the
  cost of four words the issue does not have. Either resolution is defensible;
  what is not is leaving the ruling open at publish.
- **§5** — trim the first clause of `howToRead` so the paragraph carries the
  grouping order and the control, and lets `plain` own "one square is one
  arrival".
- **§8** — replace the colon pivot in `equals[1].text`.
- **Record STORYBOARD-DRIFT (b)** in the EDITOR block beside (a). The
  region-map normalisation is correct and non-obvious; without a note, a later
  editor comparing draft to storyboard will read it as a transcription error
  and restore values that clamp the choropleth.
