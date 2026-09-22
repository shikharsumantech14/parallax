# Verification Report: Indonesia's fire is burning downward

- **Draft:** src/content/issues/2026-09-21-indonesia-fire-burns-soil-not-trees/index.mdx
- **Dossier:** research/earth/2026-09-17-indonesia-fire-burns-soil-not-trees-dossier.md
- **Storyboard:** research/earth/2026-09-21-indonesia-fire-burns-soil-not-trees-storyboard.md (Status: approved)
- **Panel (pass 1):** research/earth/2026-09-21-2026-09-21-indonesia-fire-burns-soil-not-trees-panel.md (REVISE)
- **Verified:** 2026-09-22
- **Verdict:** BLOCKED

---

## Overall verdict

**Nothing in this issue is invented, and the sourcing discipline is the best
this desk has produced.** Every one of the six CO2↔C conversions recomputes
exactly (812×12/44 = 221.5 → 221; 3190×12/44 = 870; 263×12/44 = 71.7 → 72;
76×44/12 = 278.7 = 8.7% of India's 3,190 MtCO2; 333×44/12 = 1,221 = 38.3%),
each is presented as arithmetic rather than as a sourced figure exactly as
dossier §9.14 demanded, the Novita quote is character-for-character verbatim
against dossier §5 with a role phrase attached, the drawing rule is applied at
both places the storyboard named (1997 drawn at 800 with "just over" in the
caption; the canal line drawn at the 50 cm low end with the 50–75 band in the
caption), every 2026 figure carries its cut-off date, and all six province
marker coordinates match dossier §4e with the [UNVERIFIED] approximation
disclosed in the caption ("Each pin sits on a provincial capital and stands
for a province, not a fire"). `check:prose` returns **0 ❌** and every
composition floor passes. `carbon-loop` was correctly not attempted and the
barred NASA one-sixth figure appears nowhere.

**One ❌ blocks it, and it is a one-clause fix requiring no re-research.** The
timeline note "The deepest burn on record" asserts a superlative the record
does not carry and probably contradicts: Kiely et al. 2019 measured burn
depths for the **2015 season only**, where dossier §3 says 24.8 cm is the
month that "peaks" within that season's own Aug 15.0 → Sep 23.6 → Oct 24.8
series — while the same dossier line names **1997** as "the largest
single-year fire carbon total in the record". There is no cross-year burn-depth
series anywhere in the evidence. Per the ❌ species distinction, this is an
**overreaching characterisation**, not an invented fact and not a provenance
gap; the fix is to write what Kiely measured ("The deepest month of the 2015
burn") and no writing agent needs to run again.

Behind it sit two systematic ⚠️ classes worth the editor's time more than the
blocker is. First, **24.8 cm is a mean across Indonesian peatland in all four
dossier occurrences and the draft never once says so** — it appears in the
hook, the `you-think` card, the hero's title, the hero's layer label and the
timeline as a flat depth. Second, **the post-panel-1 edit to the `power-flow`
intro contradicts that section's own caption**: the intro says "Carbon dioxide
is converted to carbon first, so all four widths compare directly" while the
caption two lines below correctly says "Three of the four bands convert carbon
dioxide into carbon". Three of four is right — the 333 MtC fire figure is
natively carbon from Carbon Brief. That edit was made after the panel read the
file and has been read by nobody.

---

## Claim verification

Sixty-eight claims extracted, including every component `data` value.

### Head

| Claim | Location | Status | Note |
|---|---|---|---|
| Burned area 286,000 hectares | hook | ✅ | §4a, Jan–24 Aug 2026 |
| Oct 2015 fire "ate 24.8 centimetres of ground" | hook | ⚠️ | Dossier: **mean** burn depth across Indonesian peatland. See Fix 2 |
| 76 Mt carbon by 7 September | primer | ✅ | §4a |
| Fuel is the waterlogged soil under the trees | primer | ✅ | §1 |

### §1 `benchmark-chart` — THE SEASON SO FAR

| Claim | Location | Status | Note |
|---|---|---|---|
| 1997 = 800 | data.items | ✅ | §4f. Drawing rule applied; "just over" in caption ✅ |
| 2015 = 333 | data.items | ✅ | §4a |
| 2000–2026 average = 85 | data.items | ✅ | §4a |
| 2026 to 7 Sep = 76, highlighted | data.items | ✅ | §4a |
| `refValue: 221` Indonesia's fossil, one year | data | ✅ | 812 MtCO2 × 12/44 = 221.5. Caption states it is a conversion ✅ |
| "this season's 76 is about 8.7% of India's yearly output" | caption | ✅ | 76×44/12 = 278.7; ÷3,190 = **8.735%** |
| "the bar rounds down" | caption | ✅ | Post-panel edit answering panel fix 3. Improves on the flagged wording |
| Annotation "Eleven weeks. Almost a normal full season." | data.annotations | ✅ | `at` matches item label exactly → resolves. 7 words, cap 12 |
| Source line carries 7 Sep 2026 cut-off | source | ✅ | Storyboard ruling 8 |
| Source line names only Carbon Brief | source | ⚠️ | src-02/src-03 (Our World in Data) carry the 221 line and the 8.7%; neither publisher is named |

### §2 `you-think` — WHAT ACTUALLY BURNED

| Claim | Location | Status | Note |
|---|---|---|---|
| 286,000 ha "in the first eight months of 2026" | caption | ⚠️ | Window is Jan–**24 Aug**, not eight full months. Source line carries the true cut-off, so it is contained |
| `actually.value: 24.8 cm` | data | ⚠️ | Mean, not stated. See Fix 2 |
| "Depth is measured on the ground, not from orbit" | caption | ✅ | §1 / §4b |
| Source line names only Mongabay | source | ⚠️ | The 24.8 value is Kiely/Copernicus (src-05), cited but unnamed |
| One binary reframe, spent here | data.actually.text | ✅ | Storyboard row-2 note sanctions it; it does not recur. Cap 1 ✅ |

### §3 `region-map` — WHERE THE SMOKE GOES

| Claim | Location | Status | Note |
|---|---|---|---|
| 48,889 ha burned by 9 Aug 2026 | caption | ✅ | §4a, FireWatch / Nusantara Atlas |
| West Kalimantan 28,680 ha | caption | ✅ | §3, §4e |
| Source line names Nusantara Atlas + 9 August 2026 | source | ✅ | Storyboard rulings 5 and 8 both honoured. Madani's 124,040 ha correctly absent |
| Six haze-receiving country zones | data.zones | ⚠️ | Dossier §4e lists them as a group with **no per-country citation**. Storyboard ruling 1 flagged this as the issue's weakest sourcing and the operator approved the six as drawn |
| Indonesia = 1, other five = 0.35 | data.zones | ✅ | Two-value categorical per ruling 1; no invented exposure ranking |
| Six marker coordinates | data.markers | ⚠️ | All six match §4e exactly. Dossier §9.9 marks them **[UNVERIFIED]** against an allowlisted gazetteer |
| "Each pin sits on a provincial capital and stands for a province, not a fire" | caption | ✅ | Ruling 2's mandated honesty note, carried |
| `kind: event` / `data-point` | data.markers | ✅ | Both valid in `RegionMap.astro` line 38; render distinct fills |

### §4 `jargon-buster` — THREE WORDS FIRST

| Claim | Location | Status | Note |
|---|---|---|---|
| Peat definition | data.terms | ✅ | §4i verbatim. 17 words, cap 25 |
| Smouldering definition | data.terms | ✅ | §4i. 15 words |
| Water table definition | data.terms | ✅ | §4i. 18 words |
| No `source:` line on the section | — | ⚠️ | See Fix 4 |

### §5 `core-sample` (HERO) — STRAIGHT DOWN

| Claim | Location | Status | Note |
|---|---|---|---|
| Novita quote | intro | ✅ | **Character-for-character verbatim** against §5. The dossier's §9.6 correction ("peat fires", not "drained peat") is respected |
| "Novita, a peat researcher" | intro | ✅ | Role phrase present; name ration 2 of 12 |
| Layer 0 cm — "Surface litter and plants. This burns first" | data.layers | ⚠️ | Traces to Yokelson 2022 (§4d row 1) — **src-10 is not on this section** |
| Layer 25 cm, `value: 24.8` | data.layers | ⚠️ | Matches §4d shape exactly; mean not stated |
| Layer 40 cm — legal water table | data.layers | ✅ | §4b, src-09 ✅ |
| Layer 50 cm — where canals put it | data.layers | ✅ | Low end drawn per ruling 7 |
| "Canals run 50 to 75 centimetres deep and the column draws the shallow end" | caption | ✅ | Band in the caption, drawing rule stated to the reader |
| "The peat below goes past 20 metres" | caption | ⚠️ | Dossier: peat thickness **0.5 m to more than 20 m**. The range is compressed to its maximum. See Fix 3 |
| "about a school ruler taken off the top of the ground" | caption | ✅ | §4i `equals` analogy, relocated per storyboard §8 |
| `plain` — "a depth below ground, not a layer of time" | plain | ✅ | FORM only. Ruling 6 required this; the default would have said deeper = older |
| `howToRead` authored | howToRead | ✅ | Ruling 6. 132 chars, in the 40–360 band |
| Component renders depth + label + value | — | ✅ | `CoreSample.astro` lines 16, 68–71 read all three |

### §6 `three-steps` — FROM CANAL TO FIRE

| Claim | Location | Status | Note |
|---|---|---|---|
| "The law allows 40 cm" | steps[0] | ⚠️ | Traces to src-09; **src-09 is not on this section** |
| "Oil palm takes it to 50 or 75" | steps[0] | ⚠️ | Same — src-09 absent |
| "Dry peat is fuel… water taken out" | steps[1] | ✅ | §4i, src-07 ✅ |
| "Surface fuel lights first" | steps[2] | ⚠️ | Traces to Yokelson 2022; **src-10 absent** |
| "In October 2015 it took 24.8 cm" | steps[2] | ⚠️ | Traces to Kiely; **src-05 absent**. Also the mean issue |
| Step word counts 20 / 16 / 16 | data.steps | ✅ | Cap 25 |
| No `source:` line on the section | — | ⚠️ | See Fix 4 |

### §7 `power-flow` — THE FOUR PIPES

| Claim | Location | Status | Note |
|---|---|---|---|
| "Carbon dioxide is converted to carbon first, so **all four** widths compare directly" | intro | ⚠️ | **Contradicts this section's own caption.** 333 MtC is natively carbon. See Fix 1 |
| "India's band is the widest" | intro | ✅ | 870 vs 333 / 221 / 72 |
| "Indonesia's own is a fraction of it" | intro | ✅ | 221 / 870 = 25.4%. Correctly avoids the dossier's own "a fifth" (§1, §4c), which is wrong at 25.5% |
| "Three of the four bands convert… multiplying by 12 over 44" | caption | ✅ | Exactly right against §4g |
| "The 2015 fires alone came to about 38% of India's yearly carbon dioxide" | caption | ✅ | 333×44/12 = 1,221; ÷3,190 = **38.28%** |
| link `peatfire` 333 | data.links | ✅ | §4g, Carbon Brief, native MtC |
| link `oxidation` 72 | data.links | ✅ | 263 MtCO2 × 12/44 = 71.7 |
| link `idnfossil` 221 | data.links | ✅ | 812 × 12/44 = 221.5 |
| link `indfossil` 870 | data.links | ✅ | 3,190 × 12/44 = 870.0 |
| `unit: "million tonnes of carbon a year"` over a one-season 333 | data.unit | ⚠️ | Inherited from dossier §4g. Mitigated by the link note "one bad season" |
| `plain` — "Each band is one source of carbon" | plain | ✅ | Ruling 6: the default opens "**Money** flows left to right" |
| `howToRead` authored, static reading leads | howToRead | ✅ | Ruling 6 + the instrument rule |
| Build-safety: 4 sources, 1 sink, no `via` | data.nodes | ✅ | Storyboard §8 checked this against `PowerFlow.astro`; shape matches |

### §8 `timeline` — THE PLUMBING DECISION

| Claim | Location | Status | Note |
|---|---|---|---|
| **"The deepest burn on record"** | events[0].note | **❌** | **UNTRACED.** No cross-year burn-depth series exists in the evidence. See Fix 1 |
| Oct 2015 — 24.8 cm of ground gone | events[0] | ⚠️ | Mean not stated |
| 2016 — peat restoration agency created to re-wet peatland | events[1] | ✅ | §3, src-12 ✅. Agency described, not named — storyboard §7 ✅ |
| 2019 — the 40 cm rule arrives | events[2] | ⚠️ | Traces to src-09; **src-09 not on this section** |
| 31 Dec 2024 — mandate expires | events[3] | ✅ | §3, src-12 |
| 2025 — folded away, no successor body | events[4] | ✅ | §3, src-12 |
| 2026 — 76 Mt carbon by 7 September | events[5] | ✅ | §4a, src-01 |
| "first full fire season since 2016 with no national body mandated to re-wet peat" | caption | ✅ | Consistent with §2: agency 2016–2024, dissolved through 2025, 2026 the first full season without |
| Annotation at "31 December 2024" | data.annotations | ✅ | `Timeline` matches on exact `date` string → **resolves**. 6 words, cap 12 |
| Exactly 6 events | data.events | ✅ | Storyboard cap |

### §9 `prose` — WHAT IT COSTS

| Claim | Location | Status | Note |
|---|---|---|---|
| 50,891 acute respiratory infection cases by 4 Sep | paragraphs[0] | ✅ | §4a, src-13 ✅ |
| "which means an infection of the nose, throat or lungs" | paragraphs[0] | ✅ | Gloss present; also satisfies the storyboard's mandated restatement marker |
| "By late August, 72 people had been charged" | paragraphs[0] | ✅ | §4a (24 Aug), src-04 ✅. Window stated in copy |
| "about 72 million tonnes of carbon… every year" | paragraphs[1] | ⚠️ | §4a. The conversion is **not** restated here; §9.14 asks each to be presented as arithmetic. Covered two sections earlier |
| "a tap left running in an empty house" | paragraphs[1] | ✅ | Accurate to the mechanism: continuous loss, nobody present |
| Paragraph lengths 54 / 45 words | data | ✅ | Cap 90 |

**Totals: ✅ 52 · ⚠️ 15 · ❌ 1**

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | No advocacy, no wire tone, no rhetorical-question closer, no passive filler, no speculation, no meta-commentary |

The v2 machine-prose marks are clean and were checked mechanically: **zero
em-dashes**, **zero semicolons**, no AI word-list vocabulary, no
sentence-opening "Notably", no rhythmic triplet, no mirrored close. One binary
reframe, in §2, where the approved storyboard placed it — cap 1, not exceeded.
The advocacy / wire-tone sweep found nothing, which is now the expected result
under the v2 contract.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ JARGON-UNGLOSSED | "peat", §2 `you-think` | ⚠️ | **The one real instance.** The reader meets "peat" in §2 but the `jargon-buster` gloss sits at §4. The primer's "waterlogged soil under the trees" softens it. Fixing it means moving §4 ahead of §2, which departs from the approved storyboard — an operator call, not a drafting error |
| ⚠️ JARGON-UNGLOSSED ×3 | "smouldering", "water table", "peatland" | ℹ | **Gate false-positives.** `check:prose` flags the `jargon-buster` term lines themselves — those *are* the gloss. "peatland" fires in the §8 timeline, by which point peat is defined. Not defects |
| ⚠️ NUMBER-DENSE | primer | ⚠️ | Three numbers in one sentence ("2026", "76 million tonnes", "7 September"). The storyboard authored this sentence and the operator approved it |
| ℹ BINARY-REFRAME | §2 `data.actually.text` | ℹ | Sanctioned, cap 1, does not recur |
| ℹ CHROME-HEAVY ×5 | §1, §5, §6, §7, §8 | ℹ | A consequence of full comprehension-field authoring, which the storyboard mandated. Not a defect |
| ⚠️ STORYBOARD-DRIFT | §1 title | ⚠️ | "Eleven weeks, nearly a season" is 5 words; the storyboard specified ≤ 4 with the arithmetic spelled out. It still passes — 77 of 80 words before the first graphic — but the margin is 3 words, not the budgeted 7 |
| ⚠️ QUESTION-UNANSWERED | Q3, "How big is this next to India?" | ⚠️ | Panel 1 scored it **partly** for all four personas. The post-panel `power-flow` intro edit addresses it, but **no second panel has read that edit** |
| ✅ HINDI-LOAD-BEARING / HINDI-FIELD / HINDI-SPELLING / HINDI-DENSE | — | — | **Zero Hindi anywhere in the issue.** All four Hindi flags clean by construction |
| ✅ NO-INDIAN-ANCHOR | — | — | India's fossil carbon as the fourth band, 8.7% and 38% of India's annual CO2, the school ruler. No ₹ bracket required: dossier §9.15 and storyboard §5 confirm no current foreign-currency figure appears |
| ✅ NAME-THROUGHPUT / NAME-UNPLACED | — | — | 2 names of 12. Novita carries "a peat researcher"; the agency is described, not named, per storyboard §7 |
| ✅ ANALOGY-CLAIM | school ruler · bathtub plug · running tap | — | All three checked against the mechanism. The tap is the strongest: continuous loss with nobody present is exactly what drained-peat oxidation is |
| ✅ HOOK-ABSTRACT / TITLE-FORMULA | head | — | Hook carries 286,000 and 24.8 cm and a "you"; the title states the finding and takes no "The ‹Noun› That ‹Verb›s" shape |
| ✅ TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC / HEAD-HEAVY | — | — | 6/9 visual (67%), no adjacent text-only rows, §1 is a graphic, 77/80 words before it, **1,098 of 1,100** reader words |
| ✅ FEW-GRAPHICS / CARD-HEAVY / NO-NEW-KIND | — | — | 5/9 drawn (56%), 5 distinct graphic kinds, 3 cards at one use each, **3 new kinds** (`region-map`, `core-sample`, `power-flow`) against a floor of 2 |
| ✅ SOURCE-NARROW | sources | — | 14 sources · 7 publishers · top publisher Mongabay at 5/14 = **35.7%**, under 40% |

**Word-cap fragility — say this out loud.** The issue sits at **1,098 of
1,100** reader-facing words. Every fix below that *adds* a word trips
`READER-WORDS`. Fix 1's blocker fix is a substitution ("The deepest burn on
record" → "The deepest month of the 2015 burn", +3 words) and would tip it.
Fixes must come out of the same section or out of §9, which the storyboard
designated the slack row.

### Source-balance check

- **Primary anchor:** ✅ present and load-bearing. Burn depth is Kiely 2019
  (**T2**, peer-reviewed, open), the surface-fuel mechanism is Yokelson 2022
  (**T2**), the emissions method is GFED/ESSD (**T2**), and both national CO2
  figures are Our World in Data (**T1**, Global Carbon Budget).
- **Viewpoint diversity:** ✅ two clusters, `mainstream-science` (Carbon Brief,
  Yale) and `policy-regulatory` (Mongabay, WRI). Dossier §9.10 records that no
  `industry` or `policy-market` source for this topic exists on the earth
  allowlist, and the draft correctly makes **no** plantation-industry or
  Indonesian-government claim rather than manufacturing one.
- **No false balance:** ✅ the empirical core (burn depth, emissions, the
  40 cm regulation) is asserted from T0–T2 sources without hedging against a
  contrary opinion. The barred NASA "one-sixth of the world's peat carbon"
  figure (~83 GtC, storyboard ruling 3) appears **nowhere** in the issue, and
  neither does the 28 GtC figure it conflicts with — the stricter composed rule
  was honoured.

### Copyright / quotability gate

**Clean, and moot by construction.** The issue carries exactly one verbatim
quotation (Novita, §5). Dossier §9.1 records that `mcp__parallax_rag__search`
returned **no earth material at all** — every peat query came back with
Constituent Assembly Debates and Lok Sabha records — so the entire research
sweep was allowlisted WebSearch/WebFetch and **no corpus chunk exists** for
this issue. There is no GUIDE-ONLY chunk to quote from; the quotation comes
from an open, legally accessed Mongabay original. No ❌ NON-QUOTABLE SOURCE.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| `status: draft` | ✅ | |
| All section kinds registered | ✅ | All 9 present in `SECTION_KINDS` (`config.ts` lines 9, 15, 19, 20, 21, 30, 37, 52, 72) |
| No `author` field | ✅ | |
| `publishedAt` valid | ✅ | 2026-09-21 |
| Source URLs `https://` | ✅ | All 14 |
| Source `kind` values valid | ✅ | Only `primary` / `secondary` / `analysis` |
| ≥ 8 sources, ≥ 5 publishers, none > 40% | ✅ | 14 / 7 / 35.7% |
| Every `sourceRefs[]` resolves | ✅ | src-01…src-14 all defined, and all 14 are used at least once |
| `primer` 80–420 chars | ✅ | ~158 |
| `plain` ≤ 220 chars | ✅ | Longest is §3 at ~118 |
| `howToRead` 40–360 chars | ✅ | §5 ~132, §7 ~122 |
| `layout` valid, one hero | ✅ | `split` on §5 only |
| `skimCaption` on `prose` only | ✅ | §9 |
| Annotations resolve | ✅ | §1 `at` matches an item label; §8 `at` matches an event `date` exactly |

---

## Required fixes before publish

1. **[BLOCKER] §8 `timeline`, `events[0].note` — "The deepest burn on record."**
   No source in the dossier establishes a cross-year burn-depth series. Kiely
   et al. 2019 measured the **2015 season only**, where dossier §3 records
   24.8 cm as the month that *peaks* within that season's own Aug 15.0 →
   Sep 23.6 → Oct 24.8 progression — and the same dossier names **1997**, not
   2015, as "the largest single-year fire carbon total in the record". Rewrite
   to what was measured (for example "The deepest month of the 2015 burn") and
   pay the three added words out of §9, the storyboard's designated slack row.
   No re-research needed.

2. **§7 `power-flow` intro contradicts §7's own caption.** The intro reads
   "Carbon dioxide is converted to carbon first, so **all four** widths compare
   directly"; the caption reads "**Three of the four** bands convert carbon
   dioxide into carbon". The caption is right — 333 MtC comes out of Carbon
   Brief already in carbon. Change "all four" to "three of these" or drop the
   clause. **This is an unreviewed post-panel edit**: diffing panel 1's quoted
   strings against the file shows three edits made after the panel read it
   (this intro, the §1 1997 caption, and the §1 8.7% caption). The other two
   are improvements; this one introduced the error.

3. **State that 24.8 cm is a mean.** The dossier says "**Mean** peat burn depth
   **across Indonesian peatland**" in all four places it appears (§3, §4b, §4d,
   §4i). The draft presents it as a flat depth in five places: the hook, §2
   `actually.value`, §5's title, §5's layer label and §8's event label. One
   qualifier in the hero's caption or layer label ("on average across
   Indonesia's peatland") fixes the reader's understanding for the whole issue
   without touching the other four. Currently the `core-sample` column draws it
   as a single definite line and the caption ("a school ruler taken off the top
   of the ground") invites reading it as a depth at a place.

4. **Close four `sourceRefs` gaps where a section's own numerals resolve to no
   cited source.** Every fact traces to the dossier — this is provenance
   paperwork, not accuracy — but the reader and the trace both come up empty:
   - **§6 `three-steps` is the worst:** 40 cm and 50/75 need **src-09**;
     "surface fuel lights first" needs **src-10**; "24.8 cm" needs **src-05**.
     It cites only src-07 and src-08.
   - **§5 `core-sample`** layer 0 ("Surface litter… burns first") needs
     **src-10** (Yokelson), which is absent.
   - **§8 `timeline`** event 2019 (the 40 cm rule) needs **src-09**, absent.
   - **§4 `jargon-buster` and §6 `three-steps` carry no `source:` line at all.**
     Checked against the backlist: every other issue's `three-steps` section has
     one. Under CANON §7 ("no source, no section") these two render with no
     source visible to the reader.

5. **§5 caption — "The peat below goes past 20 metres."** The dossier and WRI
   give peat thickness as a **range, 0.5 m to more than 20 m**. The draft
   asserts the top of the range as the condition below this column. Hedge it
   ("the peat below can run past 20 metres") — a one-word fix inside the
   existing sentence.

6. **§2 caption — "in the first eight months of 2026."** The 286,000 ha window
   is **Jan–24 August**. The source line already states the true cut-off, so
   this is contained, but "to late August" costs nothing and removes the gap.

7. **Run the second reader panel before publishing.** Pipeline step 11 has not
   run. Panel 1 returned REVISE with Q3 answered only *partly* by all four
   personas, three edits were made in response, and no reader has read the
   result. Panel 1's fix 1 — glossing "multiplying by 12 over 44", which lost
   Karthik and slowed Meera and Sana — is **still unaddressed** in the file.

---

## Optional improvements

- **§3's six haze-receiving country zones remain the issue's weakest sourcing**,
  exactly as storyboard ruling 1 predicted. The dossier lists them as a group
  with no per-country citation. The operator approved the six as drawn and I am
  not reopening it — but if the issue is ever trimmed, Malaysia / Singapore /
  Brunei are the three the record supports most directly.
- **§7's `unit` reads "million tonnes of carbon a year"** while the 333 band is
  a single season. The link note ("one bad season") carries the correction and
  the shape is inherited from dossier §4g, so this is a note rather than a fix.
- **§9's 72 MtC is the only conversion not presented as arithmetic** at its
  point of use. §7's caption does the work two sections earlier, so nothing is
  unsourced — mentioning it only because §9.14 asked for each one.
- **Dossier defect for the next earth run, not this draft.** Dossier §1 and §4c
  describe Indonesia's fossil emissions as "a fifth of India's". 812 / 3,190 =
  **25.5%**, which is a quarter. The draft sidestepped it with "a fraction",
  which is why nothing on the page is wrong — but the error survives in the
  dossier for the next issue that reads it. Fix the dossier line.
- **Allowlist defect, already recorded twice and still open.**
  `research/_sources/earth.md` lists `globalforestwatch.org`, which now
  301-redirects to the off-allowlist `globalnaturewatch.org` (dossier §9.11,
  storyboard §8). It blocked nothing here — WRI mirrors carried the content —
  but it will mislead the next earth researcher.
- **Praise worth recording:** the `core-sample` hero is the cleanest execution
  of the drawing rule and the honesty-note convention this desk has produced.
  It draws the weak end of the canal band, states the band in the caption,
  discloses that the column bottoms out for drawing reasons, authors both the
  `plain` and the `howToRead` because the defaults were factually wrong, and
  carries a verbatim quote with a role phrase. Three new-to-publication kinds
  shipped in one issue against a floor of two.
