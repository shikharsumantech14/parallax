# Verification Report: Who decides your gender in law moved *twice*

- **Draft:** `src/content/issues/2026-05-02-transgender-ratchet/index.mdx` (Phase 6 rewrite, in place)
- **Binding files, in precedence order:**
  1. `research/politics/2026-09-15-transgender-ratchet-re-anchoring.md` (authoritative)
  2. `research/politics/2026-09-15-transgender-ratchet-storyboard.md` (approved, §8i SETTLED)
  3. `research/politics/2026-05-02-transgender-ratchet-dossier.md` (**stale in four places**, see below)
- **Panels:** `-panel.md` (REVISE) and `-panel-2.md` (PASS)
- **Prior verification:** `research/politics/2026-05-02-transgender-ratchet-verification.md` (NEEDS REVISION, three required fixes)
- **Verified:** 2026-09-15
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**Read the verdict word before the flag count: there are zero untraced claims, zero
advocacy, zero non-quotable quotations, and zero blocking register flags. All eight
points in the brief check out.** The minister's quote is verbatim, re-attributed to
The Print, and its section no longer claims to be the parliamentary record. The
primer says two laws and nothing anywhere restates three. Eleven days is measured
introduction-to-passage in all four places that touch it, and neither "seventeen" nor
"six" appears on the page. The four-Article formulation and NALSA's surgery-precondition
holding are gone from reader copy entirely. Every mention of the board is *recommends*.
The hero's empty row is anchored at T1 twice and its cell keys resolve mechanically,
with exactly one empty row. The statutory list is framed as a quotation and the
publication's own vocabulary is neutral. Both late edits are confirmed as changing no
claim. The three prior required fixes all close. The issue also gains its first T0
primary, and two of the biggest removals are trace *improvements*, not losses.

**NEEDS REVISION is for wording, not for facts.** Eighteen ⚠️ flags, none of which
needs new research and none of which changes what the issue argues. Three are worth
holding the commit for: a caption that says "before 2026" over a tile dated 11 March
2026, a gloss that names one of the two officers the law permits to chair the board,
and an `# EDITOR NOTES` block that does not record four mandated departures, one of
which protects the fairness-critical hero relabel from being reverted by anyone who
re-reads the approved storyboard. The rest are optional.

**One composition warning that is not a claim issue and may be the only real gate
risk:** my hand count of reader-facing words lands at roughly **1,110 against the
1,100 ceiling**, within my own margin of error either side. `npm run check:prose --
2026-05-02-transgender-ratchet` is the authority and has to be run before the commit.

---

## The eight points in the brief

| # | Point | Ruling |
|---|---|---|
| **1** | **The minister's quote** | **HOLDS, all three parts.** English verbatim to dossier §5 and src-06, character for character. Attribution reads "Union Social Justice Minister Virendra Kumar, **as reported by The Print**". The section is reframed off the record: eyebrow ON THE DAY, title "Three positions, as *reported*", intro "reach you through press reports, not Parliament's own transcript". Its `sourceRefs` are src-05, src-06, src-08 and **deliberately exclude src-16** (the Lok Sabha record), and its `source` line names only The Print and The Wire. That exclusion is the load-bearing detail: citing src-16 here would have re-asserted the record through the back door. `# EDITOR NOTES` A carries the discrepancy in full, including that it is unresolved rather than disproven and how to resolve it. |
| **2** | **Two Acts, not three; not "lapsed in committee"** | **HOLDS.** Primer: "Parliament has since passed two laws." No string "three laws" in reader copy (it survives only in the notes, as a retired phrase). No string "lapsed in committee" anywhere. Timeline event 2 carries the 2016 Bill's **Lok Sabha passage in December 2018** and the lapse, exactly as the re-anchoring pass mandates, and the `date` string reads "2016–2018", not the storyboard's "2016–2017". One clause is an entailment rather than a quotation. See the claim table. |
| **3** | **Eleven days, and both places agree** | **HOLDS, in four places, not two.** Eyebrow ELEVEN DAYS. Title "From introduction to the *vote*". Caption "Introduced on 13 March, passed by voice vote eleven days later" (both endpoints pinned). Stage dates 13 / 24 / 25 / 30 March. 13 → 24 March is 11 days, both endpoints anchored on src-01. "Seventeen" and "six days" appear nowhere in reader copy. The 30 March assent stays a date only, with no interval computed from it. |
| **4** | **The two dropped claims stay dropped** | **HOLDS, both.** "Articles 14" appears only inside the MDX comment. Nothing in reader copy attributes a surgery-precondition holding to NALSA: the 2019 Act's surgery requirement is stated as a fact about the 2019 Act, never as a contradiction of 2014. Every statement about the 2014 judgment sits inside what PRS supports (the right to determine one's self-identified gender, plus the citation). No date beyond "Apr 2014", no Article numbers, no claim that Parliament may or may not override it. One register note on "settled" below. |
| **5** | **The board RECOMMENDS** | **HOLDS.** Seven mentions swept: dek, section 1 `actually.text`, jargon-buster term 3, card 03, three-steps step 2, hero row 2 and caption, annotation 2. Every one uses *recommends* or *recommendation*. The single instance of "examin" in reader copy is card 03's "the district magistrate issues the certificate after **examining a designated medical board's recommendation**", where the subject is the magistrate and the object is the recommendation. Nothing on the page has the board examining, deciding, or meeting an applicant. |
| **6** | **The hero's empty row** | **HOLDS, both halves.** *Substantive:* anchored T1 twice, seven years apart, on src-17 ("does not provide a mechanism for appeal or review") and src-02 ("does not provide for any kind of redressal mechanism … The Bill also does not address this"), and the claim appears three times on the page (hero caption, three-steps step 3, tile 4), each on a section whose `sourceRefs` carry one of those two. *Mechanical:* all four `cells[].institution` strings match `institutions[]` exactly, all four `cells[].party` values match a `parties[].id`, and **exactly one row, "Appeal a refusal", has no cell**. `PowerMatrix.cellFor` falls through to `control: 'none'`, so that row renders four explicit ○ glyphs against the legend's "○ None" rather than as blank space. The claim is drawn, not implied. |
| **7** | **The statutory vocabulary** | **HOLDS.** Card 01 reads "people the law names as kinner, hijra, aravani, jogta and eunuch", matching dossier §4's rendering of the definition. The framing phrase "the law names as" marks it as the statute's vocabulary five words before the list. *Eunuch* appears exactly once in the file. The publication's own vocabulary elsewhere is current and neutral: "trans-men, trans-women and genderqueer persons", "transgender people", "transgender identity". The archaic noun form appears nowhere. Both panels confirmed no reader took the list as Parallax's voice. |
| **8** | **The two late edits** | **NEITHER CHANGED A CLAIM.** *Tile 5:* the source's own denominator is "fewer than 5% of the 4.87 lakh population" (dossier §4, src-13), and 4.87 lakh is the census count of transgender people in India, so "Of all transgender people in India" names the denominator the source uses. It also closes panel 2's top-ranked fix. One wording judgement call raised below. *Timeline note:* "it" and "the criticism" have the same referent, so no claim moved, and the ambiguity in which "it" could bind to "the law" is gone. Cost: the note is now **20 words against the gate's 20-word cap**, with zero margin. |

**A full diff of every string panel 2 quotes against the current file finds those two
edits and no third.** There is no undeclared post-panel edit in this issue.

---

## Claim verification

### Head

| Claim | Location | Status | Note |
|---|---|---|---|
| "In 2014 the Supreme Court settled it: you decide your own gender" | hook | ✅ | PRS via src-17: "the Court upheld the right of transgender persons to determine their self-identified gender". "Settled" is a shade stronger than "upheld"; the hook's own second sentence and the title's "moved twice" qualify it in the same breath. Noted, not a flag. |
| 5,566 applications refused by March 2026 | hook | ✅ | Dossier §4; PRS gives 11 March 2026 |
| "with nowhere to appeal" | hook | ✅ | src-17 and src-02, T1, twice |
| "Two laws later, a medical board recommends and a district magistrate issues the certificate" | dek | ✅ | Two laws: re-anchoring §4 SETTLED. "Recommends": src-16, T0 |
| "Parliament has since passed two laws" | primer | ✅ | Re-anchoring §4. The published "three laws" is retired and not restated in any form |
| "the second one changed" | primer | ✅ | Structural, correct |

### Section 1 · `you-think`

| Claim | Location | Status | Note |
|---|---|---|---|
| "The decision moved twice, in 2019 and 2026." | caption | ✅ | A DATA claim in the caption slot, correctly. Not CAPTION-FORM |
| "12 years" | `actually.value` | ✅ | 2014 → 2026. Sanctioned derivation |
| Moved to a DM's certificate 2019, a board's recommendation 2026 | `actually.text` | ✅ | Dossier §4; src-16 |
| "Both laws are named for protection of rights. The name never moved." | `note` | ✅ | Both statutes carry "(Protection of Rights)". §8c.6 placement of the published hook clause. Panel 2 finding 11: no reader used it, because neither law's name is printed on the page. A comprehension note, not an accuracy one |

### Section 2 · `timeline`

| Claim | Location | Status | Note |
|---|---|---|---|
| Apr 2014, Supreme Court holds your own word decides | event 1 | ✅ | PRS holding. Month-only date holds constraint F.4 |
| *NALSA v. Union of India*, (2014) 5 SCC 438 | event 1 note | ✅ | Citation now confirmed on src-17 (T1). An upgrade over the published sourcing |
| The 2016 Bill clears the Lok Sabha in December 2018 | event 2 | ✅ | src-18 Bill Track: Status "Passed" by Lok Sabha "Dec 17, 2018" |
| "Still pending in the Rajya Sabha, it died when that Lok Sabha ended." | event 2 note | ⚠️ IMPRECISE | The lapse on dissolution of the 16th Lok Sabha is quoted verbatim in the re-anchoring pass. **"Still pending in the Rajya Sabha" is not.** It is an entailment (a Bill passed by the Lok Sabha and not enacted must have been before the Rajya Sabha, and only such a Bill lapses on dissolution under Art. 107(5)), and the operator's brief states it as established. Almost certainly right. Flagged only so the record shows which words are quoted and which are reasoned |
| "Nov 26 2019 · The Act arrives." | event 3 | ⚠️ IMPRECISE | **This exposes a fourth stale place in the dossier.** Dossier §3 attributes 26 Nov 2019 to the **Lok Sabha**; the re-anchoring pass's PRS table has **LS 5 Aug 2019, RS 26 Nov 2019**. The draft dodges it by naming no chamber, which is the right call. But 26 Nov is the completion of *passage*, not enactment, and "arrives" reads as enactment. The date string is a sanctioned carryover (§8a). No fix is required on the page. **The fix is a dossier line**, so the next rewrite does not restore "Lok Sabha passes" |
| "A male or female certificate also required proof of surgery." | event 3 note | ✅ | Dossier §4 (2019 Act s.7). Section number correctly omitted, since the re-anchoring never saw the section text |
| 2020, the national portal opens | event 4 | ✅ | Dossier §3 |
| "Activists protest rules that added a psychologist's certificate." | event 4 note | ✅ | Dossier §3, src-14 |
| Oct 2025, SC appoints a committee on gaps in the 2019 Act | event 5 | ✅ | Dossier §3/§4. Justice Menon described, not named, per §7 |
| "The Amendment becomes law, and is challenged in the Supreme Court." | event 6 | ⚠️ IMPRECISE | Assent 30 March; the petition was filed **3 April**. Both sit under one "Mar 30 2026" mark. **Mandated by storyboard §8a** ("absorbs the assent and the challenge"). Constraint F.6 is fully held: "challenged" is the ceiling, nothing about listing, notice or a stay |
| Rajasthan HC published criticism that day, then deleted the criticism as "included by mistake" | event 6 note | ✅ | Dossier §3 ×2, src-11, src-15. Constraint F.5 held exactly: sequence only, the deleted text never reproduced, and the only quotation is the court's own reported reason. The prior report's required fix 1 closes here, by deletion of the interval |
| Annotation 1: "The right the 2026 amendment deletes begins here." | `annotations[0]` | ✅ | The provenance link (NALSA holding → s.4(2) → deletion) is PRS's own framing: src-02 sets the NALSA holding beside this deletion. Resolves: `at: "Apr 2014"` matches event 1's `date` exactly. **It stops short of the retired "Overruled by Parliament"** by claiming origin, not validity |
| Annotation 2: "Twelve years on, a board recommends and a magistrate issues." | `annotations[1]` | ✅ | src-16 T0. Resolves: `at: "Mar 30 2026"` matches event 6's `date` exactly |

### Section 3 · `jargon-buster`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Self-identification — You decide your own gender on paper. That is, no doctor and no officer signs off." | term 1 | ✅ | A definition of the term, correctly **not** attributed to NALSA. This is the sentence that would have re-imported the dropped surgery-precondition holding, and it does not |
| "Certificate of identity — The paper a district magistrate issues." | term 2 | ✅ | Dossier §4; PRS on the DM application |
| "A panel led by the chief medical officer, which recommends to the magistrate. It does not decide." | term 3 | ⚠️ IMPRECISE | "Recommends" and "does not decide" are anchored at T0 (src-16). **"led by the chief medical officer" drops the statute's alternative**: dossier §4 and src-16 both say "Chief Medical Officer **or Deputy** Chief Medical Officer". Claim-error pattern 1, compression dropping the qualifier. The field is 17 words against a 25-word cap, so "or deputy" costs two of eight free words |

### Section 4 · `bill-breakdown`

| Claim | Location | Status | Note |
|---|---|---|---|
| "The 2026 amendment narrowed the definition and deleted the self-identification right." | caption | ✅ | Dossier §4 ×2. DATA claim ✅ |
| "It narrowed who the law covers and changed how certificates are issued." | intro | ✅ | **This is §8e.5 retired.** "removed an entire category of persons from legal existence" does not return |
| Two groups only: the named socio-cultural communities, and medically recognised intersex variations | card 01 | ✅ | Dossier §4. Statutory list accurate and framed as quotation (point 7) |
| "Trans-men, trans-women and genderqueer persons are no longer covered." | card 01 bullet | ✅ | Dossier §4. Drops "(irrespective of surgery)", which narrows nothing the source does not already assert |
| "Section 4(2) of the earlier law recognised a right to self-perceived gender identity. The 2026 amendment deletes it in full." | card 02 | ✅ | Dossier §4; src-04 "deleted entirely". **Constraint F.3 held perfectly:** "Section 4(2)" appears exactly once in the file, and is explicitly a section of "the earlier law" |
| "The district magistrate issues the certificate after examining a designated medical board's recommendation." | card 03 | ✅ | Dossier §4 verbatim in substance; src-16 T0 |
| "Hospitals performing gender-affirming surgery must report patient details to both." | card 03 | ✅ | Dossier §4. "both" resolves to the magistrate and the board named in the sentence before |
| Abduction with mutilation or castration, to force a transgender identity on the person abducted | card 04 | ⚠️ IMPRECISE | Dossier §4 also lists "surgical/chemical/hormonal procedures" alongside mutilation and castration. A compression that narrows the offence as stated. The card is already ~35 words against a ≤22 budget (a panel-mandated departure), so this one is a genuine trade, not an oversight |
| "ten years in prison, up to life, plus a fine from ₹2 lakh" | card 04 | ✅ | Dossier §4: "at least 10 years, extendable to life, plus a minimum fine of Rs 2 lakh". The range carries "at least"; "from" carries the minimum. ₹ notation is sanctioned derivation D4. Panel 2 verified the fairness reading is closed and cannot recur |

### Section 5 · `three-steps`

| Claim | Location | Status | Note |
|---|---|---|---|
| "You apply to the district magistrate for a certificate of identity." | step 1 | ✅ | PRS via src-02 |
| "A designated medical board, headed by the chief medical officer, makes a recommendation to the magistrate." | step 2 | ⚠️ IMPRECISE | Same dropped "or Deputy" as section 3. Same two-word fix, 16 words against a 25-word cap |
| "The district magistrate issues the certificate, or refuses it. Neither law gives you an appeal from that decision." | step 3 | ✅ | src-17 and src-02, T1 |

### Section 6 · `bill-passage`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Four days before the vote, a committee the Supreme Court had appointed met without seven government secretaries and asked for the bill's withdrawal." | intro | ⚠️ IMPRECISE | Every fact traces (dossier §3/§4, src-07): 20 March meeting, seven absent secretaries, formal withdrawal request. 20 → 24 March is four days and the arithmetic is right. **But "four days" is a derivation the storyboard's §5 list does not carry** (it lists only eleven and seventeen). Procedurally unsanctioned, factually fine |
| "Introduced on 13 March, passed by voice vote eleven days later." | caption | ✅ | src-01 for both dates; src-05 and src-06 for voice vote, which is constraint F.1's permitted formulation. DATA claim ✅ |
| Stage 1: Introduced, 13 Mar 2026, "Moved in the Lok Sabha by the social justice ministry." | stage 1 | ✅ | Dossier §3. Ministry lower-cased per §7. See the storyboard contradiction note below |
| Stage 2: Lok Sabha, 24 Mar 2026, "Voice vote after a two-and-a-half-hour debate. The opposition walked out." | stage 2 | ✅ | Dossier §3/§4; src-16 anchors date, chamber and the House's own "(passed)" at T0 |
| Stage 3: Rajya Sabha, 25 Mar 2026, "The DMK's move to send it for scrutiny was rejected." | stage 3 | ✅ | Dossier §4, src-06. "Send it for scrutiny" is a clean gloss of "refer to a Select Committee". The RS sitting is not re-anchored and src-06 is correctly on the section |
| Stage 4: Assent, 30 Mar 2026, "Signed into law, and in force the same day." | stage 4 | ✅ noted | Dossier §3. **This is the one date on the page with no allowlisted primary** (dossier §9 note 3, re-anchoring §5). It is an unchanged carryover used as a date only, with no interval derived from it, and `# EDITOR NOTES` C declares the gap. Accepted carry, not a new claim |
| "The word under each card is whether the bill cleared that stage." | `plain` | ✅ FORM | See the `bill-passage` ruling below. Not a PLAIN-CLAIM |
| Nothing about divisions, counts or tallies, anywhere | whole section | ✅ | **Prior required fix 2 closes.** The string "division" does not occur in reader copy. Constraint F.1 is also written into the notes block |

### Section 7 · `quote`

| Claim | Location | Status | Note |
|---|---|---|---|
| "The objective of this legislation is solely to protect those individuals who face severe social exclusion due to their gender identity." | `quote` | ✅ **VERBATIM** | Character for character against dossier §5 and src-06. Twenty-one words, unchanged |
| "Union Social Justice Minister Virendra Kumar, as reported by The Print" | `attribution` | ✅ | Operator ruling 1, option 1, executed exactly |
| "The lines spoken in the debate below reach you through press reports, not Parliament's own transcript." | intro | ✅ | Accurate and correctly scoped. "Spoken in the debate" excludes the written resignation statement, which the followup's own verb ("wrote") marks. Panel 2 finding 6 verified both halves with readers |
| "What it really means is the state does not trust transgender persons." | `followup` | ✅ **VERBATIM** | Dossier §5, src-06. Twelve words, unchanged. "Dr." dropped from the attribution per storyboard §7 house form; the re-anchoring confirms T. Sumathy against the House record |
| "Two members then resigned from the National Council of Transgender Persons, the NCTP, a government advisory body." | `followup` | ⚠️ IMPRECISE | The resignations, the count and the Council all trace (dossier §3, src-08). **"a government advisory body" is a role phrase assigned by storyboard §7, not a line in the dossier.** Correct and necessary for comprehension (panel 2 finding 7 shows it closed a reader stop). Recommend leaving it; flagged so the provenance is on the record |
| Kalki Subramanium's thirty words | `followup` | ✅ **VERBATIM** | Dossier §5, src-08, unchanged. Rituparna Neog removed per §8c.4, replaced by "One of them" |
| **Quotability** | all three quotes | ✅ | The Print and The Wire are both T4 · access: open · **`ingest: live`** on `research/_sources/politics.md`, which per `_TAXONOMY.md` §1 means no pre-indexed corpus chunk exists, the RAG trace is moot, and the quotation is from a legally accessed original by construction. Nothing is quoted from a `metadata` source. Nothing is quoted from src-16, whose words are Hindi. **No ❌ NON-QUOTABLE SOURCE.** (`mcp__parallax_rag__search` was not available in this session; verified against the recorded source URLs, as the agent definition provides) |

### Section 8 · `data-readout`

| Claim | Location | Status | Note |
|---|---|---|---|
| "The certificate system before 2026" | caption | ⚠️ IMPRECISE | **The scope header does not cover its own tiles.** Tile 4 is dated **11 March 2026**. Under the issue's own shorthand ("the 2026 law", "the 2026 amendment") the header reads as "before the amendment" and is true; under a calendar reading it is false for one of five tiles. The section's own intro gets it right ("the system the amendment rewrote"), which is what makes it checkable. Fix: name the amendment, not the year |
| 4,87,803 counted as "other" in the 2011 census; "4.87 lakh people, and still the only official count" | tile 1 | ✅ | Dossier §4 and §9 note 8. Constraint F.8 held: described as the only **official count**, never as the true size. D1 conversion arithmetic correct |
| 24,000+ applications since the portal opened in 2020, figure from late 2023 | tile 2 | ✅ | Dossier §4. Date travels with the figure (F.7) |
| "About 15,800 of 24,000+ applications. Both are late-2023 figures." | tile 3 | ✅ | Dossier §4. The only ratio the issue is permitted to state, in words, with no percentage computed. §5 D6/D7 held |
| 5,566 refused "As of 11 March 2026. Neither law gives you an appeal." | tile 4 | ✅ | **Sharpened from the published "March 2026" to the exact PRS day**, exactly as the re-anchoring pass recommended in its finding 1. F.7 held, appeal claim anchored on src-02 |
| "<5% · Share with any identity card · Of all transgender people in India. An activists' estimate, not a count." | tile 5 | ✅ with a judgement call | The denominator is the source's own (dossier §4, src-13: "fewer than 5% of the 4.87 lakh population"), the estimate is flagged as an estimate, and the funnel misreading panel 2 ranked first is closed. **The judgement call:** tile 1 is careful to call 4.87 lakh "the only official count" rather than the population, and tile 5 five lines later calls the same denominator "all transgender people in India". Two treatments of one number in one graphic. See optional improvement 1 |
| "15,800 certificates, and 5,566 *refusals*" | title | ✅ | **§8e.6 retired.** "had already *failed*" does not return; the title states the numbers |

### Section 9 · `power-matrix` (hero)

| Claim | Location | Status | Note |
|---|---|---|---|
| "You may apply. A board recommends, a magistrate issues. Neither law gives an appeal." | caption | ✅ | src-16 (T0), src-17 and src-02 (T1). DATA claim ✅ |
| Five decisions, four actors, one filled cell in the "you" column | `institutions`, `parties`, `cells` | ✅ | Mechanically verified, see point 6 |
| "Appeal a refusal" held by nobody | the empty row | ✅ | src-17 and src-02, T1, two documents seven years apart |
| "A row with no filled cell means nobody holds it." | `plain` | ✅ FORM | Describes the encoding, does not name which row is empty. Not a PLAIN-CLAIM. ~172 chars, inside the 220 bound |
| The magistrate may also consult other medical experts | **absent from the page** | ✅ not a gap | PRS carries "The District Magistrate may also take assistance of other medical experts", and the re-anchoring pass says explicitly this "does not add a column to the hero" because such experts hold no decision. The matrix encodes *who holds a decision*, so the omission is correct by the graphic's own semantics, and `# EDITOR NOTES` F.2 records it so no later reader reads the grid as the complete list of who is consulted |

**Claim totals: 52 rows · 44 ✅ · 8 ⚠️ IMPRECISE · 0 ❌ UNTRACED.**

---

## Removal audit (what the ❌ NUMBER-DRIFT will report)

The gate will fire ❌ against HEAD because the file is `published` and sections were cut.
Every removal is mandated, and two of them make the issue's sourcing *better*.

| Removed | Mandate | Orphaned survivor? |
|---|---|---|
| "Parliament has passed three laws" | Re-anchoring §4, storyboard §8i | No. The primer says two |
| "Articles 14, 15, 19 and 21" (three places) | Re-anchoring §1 and `# EDITOR NOTES` D | No, and this is a **trace improvement**: the formulation rested on T4 newspapers alone, while PRS names Article 21 only. The issue now asserts no Article at all |
| NALSA's surgery-precondition holding | Same | No, and the same improvement. The concept survives only as a definition of the *term* "self-identification", which needs no judicial anchor |
| "Two days later" (epilogue interval) | Prior required fix 1 | No. The note carries no interval |
| "No division vote recorded" | Prior required fix 2, constraint F.1 | No. Nothing on the page implies a count either way |
| "The tension is structural, not rhetorical" | Prior required fix 3 | No. Cut with the `paradox` |
| 886-page petition detail | Ruling 4 | No. "Is challenged" asserts no magnitude |
| The petition's central question | Ruling 4 | No, and this is what keeps §8e.3 "Overruled" retired |
| UN statement, 140 lawyers | Ruling 5 | No. **src-09 is orphaned, and it is the only orphan of eighteen** (verified: all seventeen other ids resolve and are earned) |
| Rs 5 lakh minors fine, begging/servitude penalties | §8c / notes H | No. Card 04 describes one offence and says so ("is the offence here") |
| The Bill's statement-of-purpose exclusion | Notes H | No. Card 01's bullet is separately sourced to PRS, and panel 2 answered question 2 correctly without it |
| Words, not digits | — | I checked each surviving big number for a lost comparison. 4,87,803 keeps its lakh conversion, 15,800 keeps "of 24,000+", <5% keeps its attribution and now its denominator. **No number lost its feel.** |

**All three of the prior report's required fixes are closed.**

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|

Empty. Swept for advocacy, rhetorical questions, passive filler, wire tone, invented
consequence and meta-commentary, and found none. Every verb in reader copy is
procedural: *narrowed, deleted, recommends, issues, refuses, refused, died, challenged,
published, walked out, rejected, moved*. Panel 2's journalism check reached the same
conclusion from the readers' side, which is the stronger evidence.

Specifically retired and confirmed absent from reader copy: "Erases", "Overruled",
"removed from legal existence", "had already failed", "a medical verdict", "the tension
is structural", "three laws". All seven of §8e's phrases and the title verb are gone.

**Rhetorical jobs:** CONVERSATIONAL EXPLAINER on 1, 3, 5, 8, 9 (five of nine, above the
half floor), CALM-STRUCTURAL on 2, 6, 7, FORENSIC on 4. **SATIRICAL EXPOSURE: zero**, as
the politics desk requires. DRY WIT zero, LYRICAL zero. Three jobs, inside the 3–5 band.

**Appositive negations are not reframes.** "An activists' estimate, not a count", "not
Parliament's own transcript", "It does not decide", "Neither law gives…". Each is doing
precision work on exactly the claims the record was most careful about. Noted, not
counted against the one-reframe ration, which is spent structurally in section 1's
`you-think` panels as the storyboard directs.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ❌ HINDI-LOAD-BEARING | — | **clear** | The only non-English words are *kinner, hijra, aravani, jogta* in card 01's `body`. Delete all four and the card still says two groups only, still names the intersex category, and still carries the bullet on who is excluded. Panel 2 tested exactly this. **Does not block** |
| ❌ HINDI-FIELD | — | **clear** | None in any `caption`, `howToRead`, `plain`, `source` or data label. The four sit in a `body` field, which is not the precision layer. Storyboard §8i settled them as a statutory quotation, not register Hindi. **Does not block** |
| ⚠️ HINDI-SPELLING | card 01 | ℹ pre-declared | The four are not in `hinglish-lexicon.md` and may trip the heuristic. Storyboard §8g.3 pre-rules this a false positive. The fix, if any, is a lexicon row, not a draft edit |
| ⚠️ JARGON-UNGLOSSED | "voice vote" (section 6 caption and stage 2) | ⚠️ | A real term of art, unglossed. **And it is genuinely hard to gloss safely:** every natural gloss ("no count was taken", "members say aye or no and nobody counts") states or implies the absence of a division, which constraint F.1 forbids absolutely. The constraint should win. This is an operator ruling, not a drafting miss |
| ⚠️ JARGON-UNGLOSSED | "intersex variations", "genderqueer" (card 01) | ⚠️ low | Both are the statute's own categories inside a card already over its word budget. Panel scored the section 4 partly for this. Optional |
| ⚠️ BARE-NUMBER | — | clear | Every figure carries a comparison a reader can feel |
| ⚠️ NO-INDIAN-ANCHOR | — | clear | ₹, lakh, district magistrate, chief medical officer, the 2011 census, both Houses. **No foreign currency anywhere**, so contract §3 rule 4 has nothing to convert and correctly converts nothing |
| ⚠️ NAME-THROUGHPUT | issue | **clear at 11 of 12** | Verified by hand: Supreme Court · *NALSA v. Union of India* · Lok Sabha · Rajya Sabha · Rajasthan High Court · Virendra Kumar · The Print · T. Sumathy · DMK · Kalki Subramanium · National Council of Transgender Persons. **Eleven.** The storyboard's twelfth slot (the 2019 Act's full name) is unused, and The Print takes its place through the mandated attribution. The gate's capitalisation heuristic will report more; §7's boxed note and `# EDITOR NOTES` H both warn of it |
| ⚠️ NAME-UNPLACED | — | clear | Every name carries a role phrase. The one used once, the NALSA citation, is a formal law report citation in a note rather than a name in a sentence |
| ⚠️ ANALOGY-CLAIM | — | clear | No analogy on the page. `analogy` was declined deliberately at storyboard §8d, on tonal grounds |
| ⚠️ HOOK-ABSTRACT | hook | clear | Carries 2014, 5,566 and a "you" |
| ⚠️ TITLE-FORMULA | title | clear | Not "The ‹Noun› That ‹Verb›s". States the finding |
| ⚠️ TEXT-HEAVY | sections | clear | 6 of 9 visual, 67%, floor 60% |
| ⚠️ PROSE-RUN | sections | clear | Text-only at 3, 5 and 7, each between two visuals |
| ⚠️ NO-LEAD-GRAPHIC | section 1 | clear | `you-think` is not in `TEXT_ONLY` |
| ⚠️ HEAD-HEAVY | head | **clear, by one word** | title 8 + dek 14 + hook 24 + primer 25 = 71, plus section 1's eyebrow (2) and title (6) = **79 of 80**. Section 1 carries no `intro`, which is the only reason it holds |
| ⚠️ WORD-CEILING | issue | **⚠️ at risk** | My hand count with the gate's own tokeniser lands at roughly **1,110 against 1,100**, and I cannot be more precise than ±3% on nested data. About 16 of those words are the hero's `cells[].institution` keys, which duplicate `institutions[]` and no reader ever sees. **Run `npm run check:prose -- 2026-05-02-transgender-ratchet` before the commit.** If it reports an overrun, the storyboard names section 7's `intro` and framing as the designated slack, and panel 2 names section 1's `note` as the cheapest donor at eleven words |
| ⚠️ FIELD-OVER-CAP | title, dek | ℹ **zero margin** | Title is **8 of 8** and dek is **14 of 14**. Panel 2's fix 3 calls the title garden-path "the one word of head slack" — but there is no slack in the title's own cap. **That fix must be a substitution at eight words or fewer, never an addition** |
| ⚠️ FIELD-OVER-CAP | timeline event 6 note | ℹ **zero margin** | The late edit took it from 19 to **20 of the gate's 20-word cap**, and 2 over the storyboard's advisory ≤18. It passes. Nothing may be added to it |
| ⚠️ FIELD-OVER-CAP | tile 5 note | ℹ | 12 words against the gate's 15-word cap ✅, 2 over the storyboard's advisory ≤10 |
| ⚠️ STORYBOARD-DRIFT | see the table below | ⚠️ | Eight departures, all legitimate, four undeclared |
| ⚠️ QUESTION-UNANSWERED | — | clear | Panel 2 returned all twelve quiz cells correct from the draft alone. **One note:** the storyboard's own model answer to question 1 asserts the four Articles and the surgery-precondition holding, both of which ruling D removed. The question is still answerable; the storyboard's maximal answer is now stricter than the record supports and should be marked so a later pass does not read the difference as a gap |
| ℹ CHROME-HEAVY, ⚠️ NUMBER-DENSE, ⚠️ SENTENCE-MAX | sections 2, 4, 6, 8, and the locked 30-word quotation | ℹ expected | Pre-declared at storyboard §8g and `# EDITOR NOTES` H. The Kalki sentence is one 40-word unit including its framing and may trip SENTENCE-MAX; the storyboard's slack rule says those thirty words never pay |
| Em-dashes, semicolons | reader copy | **zero of each** | The only occurrences are inside `sources[].title` strings, which are the publishers' own verbatim titles and cannot be rewritten, and inside the MDX comment, which renders nothing. `check-prose` skips both. The one en dash, "2016–2018", is an unspaced numeric range and is not matched |
| AI words, opening adverbs, NOT-X-BUT-Y | reader copy | clear | None |

### Storyboard drift, itemised

| # | Departure | Mandate | Declared in the file? |
|---|---|---|---|
| 1 | Hero row 2 reads "Recommend to the magistrate", not the storyboard §2's "examine and recommend" | Constraint 8b.2 and panel-1 fix 2. **The approved storyboard's §2 prose contains a phrase its own §8b.2 forbids** | **No.** The notes state the rule but never say the row was relabelled |
| 2 | `bill-passage` opens with an "Introduced · 13 Mar 2026" stage | **The storyboard contradicts itself.** §8i's SETTLED box says "all seven settled as recommended", and the recommendation for ruling 2 is *in*; the box's own ruling-2 text then says "stays a bibliography fact, off the page". The re-anchoring pass and the operator's brief both require 13 March on the page for the eleven-day claim to be checkable | **No** |
| 3 | Timeline event 2's `date` is "2016–2018", not §8a's "2016–2017" | Re-anchoring §4: the Bill passed the Lok Sabha in Dec 2018, so a 2016–2017 range would be wrong | Yes, notes B |
| 4 | The `quote` section's whole frame, and the attribution | Re-anchoring READ FIRST, operator ruling 1 | Yes, notes A, in full |
| 5 | A second `plain` line, on `bill-passage` (storyboard allowed one, on the hero) | Needed to stop the status word reading as a vote | **No** |
| 6 | Card 04 runs ~35 words against a ≤22 budget | Panel-1 fix 4, the fairness-critical rewrite | **No** |
| 7 | Hook and dek differ from the storyboard's composed strings | Panel-1 fixes 3 and 7. Both are improvements: the dek names the certificate, the hook attaches the year to March | No, and not needed |
| 8 | Tile 5 note and timeline event 6 note exceed the storyboard's advisory caps | The two declared operator edits | **No** |

Departures 1, 2, 5, 6 and 8 are correct and I would not change any of them. The problem
is only that a later reader who opens the approved storyboard will find instructions
that contradict the file, with nothing in the file explaining why.

### Source-balance check

| Check | Result |
|---|---|
| **Primary anchor** | ✅ **PRESENT, and newly so.** src-16 (Lok Sabha, Parliament of India) is T0 open; src-01, src-02, src-03, src-17 and src-18 (PRS) are T1 open `ingest: full`. The published issue had no T0 at all. The hero's load-bearing claim rests on two independent T1 documents and the board's verb on a T0 record |
| **Viewpoint diversity** | ✅ The government's position is quoted first and in full, then two critical Indian voices, with PRS's non-partisan analysis carrying the mechanism. Panel 2 recorded the 2:1 critical-to-supportive ratio, ruled it the reported record of the day, and noted the government leads. I agree. The one thing that could widen it, the minister's fuller case, sits past the same fetch truncation that blocks the passage formula |
| **False balance** | ✅ None. Dates, the deletion, the counts and the appeal gap are stated flat, not hedged against opinion |
| **Source line vs cited publishers** | ⚠️ **Five of nine sections name fewer publishers than they cite.** Section 3 cites src-04 (The Print) and src-14 (The Wire) under a line reading "PRS India". Section 5 cites src-04 and **src-16, the issue's only T0 primary and the anchor for that section's load-bearing verb**, under "PRS India". Section 9 cites src-04 under "PRS India". Section 6 cites src-06 under a line naming PRS, the Lok Sabha record and The Wire. Section 8 cites src-13, publisher of three of its five figures, under a line naming the census, the portal and PRS. This is defensible if the convention is "name the source that carries the row", but sections 5 and 8 are the two where the omitted publisher is doing the most work |

---

## Component and render checks

| Check | Result |
|---|---|
| All nine kinds in `SECTION_KINDS` | ✅ verified against `src/content/config.ts` |
| Every authored `caption` reaches a reader | ✅ `you-think`, `data-readout`, `bill-passage` and `power-matrix` render their own via the promoted `data.caption` merge at `SectionBody` line 147. `bill-breakdown` emits **no** `*__cap` element, so `core/Section.astro` prints it as `.px-section__claim`. Exactly one caption per section, no silent drops |
| `data-readout` `emphasis` field | ✅ The draft uses `emphasis: "key"`, which is the component's real field. The storyboard's "`accent: true`" is the stale catalog name. **The draft is right and the storyboard is wrong here** |
| Both annotations resolve | ✅ `Timeline` matches on the event's exact `date` string. "Apr 2014" → event 1, "Mar 30 2026" → event 6. Neither is a silent no-op |
| `power-matrix` cell keys | ✅ All four resolve; exactly one empty row; unfilled cells render an explicit ○ against the legend |
| `layout` | ✅ `wide` on the hero only. Zero loud sections, no `bleed`, no `split` |
| `story.beats` drift | n/a. The frontmatter carries no `story:` block, so there are no indices to repoint and no beat can go stale against a section |
| `howToRead` | ✅ none authored, and none of the nine kinds is in `NEEDS_HOW`, so no panel renders. No REDUNDANT-HOWTO is possible |

### The `bill-passage` ruling (first publication of this kind)

**The card asserts nothing false.** The status enum is `passed | failed | pending |
current`, so a completed stage that was not a vote has no honest value but `passed`:
`pending` renders at 0.62 opacity with no glyph, which would say the stage has not
happened, and `current` pulses, which would say it is where the bill sits now. The
authored `plain` line defines the word for the reader as "whether the bill cleared that
stage", and stage 1's own note says the bill was **moved**, not voted. The rendered
claim is "the introduction stage completed on 13 March 2026", which src-01 carries. No
panel reader read it as a vote; all four retold the stack as stages.

Two residuals, neither fixable inside a rewrite. "Assent · PASSED" is the same small
category error (assent is granted, not passed), mitigated the same way by the note
beneath it. And "the vote", singular, sits over a stack carrying two votes, which is why
panel 2's Karthik computed twelve days before the caption corrected him. Both would need
a schema change (a fifth enum value) or a House name in a five-word title field.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| `status: draft` | ✅ **by ruling** | It is `published`, which is **correct** for a Phase 6 in-place rewrite (storyboard ruling 7). Flagged only so nobody "fixes" it |
| All section kinds registered | ✅ | Nine of nine |
| No `author` field | ✅ | Absent |
| `publishedAt` valid | ✅ | 2026-05-02, unchanged, as ruled |
| Source URLs `https://` | ✅ | All eighteen |
| Source `kind` values valid | ✅ | 7 primary, 8 secondary, 3 analysis |
| ≥6 sources | ✅ | Eighteen |
| Every `sourceRefs[]` resolves | ✅ | All 40 references across nine sections resolve. Seventeen of eighteen ids are used and earned |
| Exactly one orphan | ✅ | **src-09 only**, the UN statement, cut by ruling 5 and declared in notes G |
| Zod bounds | ✅ | primer 138 chars (80–420); both `plain` lines well under 220; `layout` valid; no `skimCaption` on a non-prose kind |
| `readTimeMinutes` | ✅ | 4, per ruling 7 |

---

## Required fixes before publish

1. **Section 8, `caption`: retime the scope header to its own tiles.**
   "The certificate system before 2026" sits over a tile explicitly dated **11 March
   2026**. The section's own `intro` already has the right form ("the system the
   amendment rewrote"). Name the amendment rather than the year. Same word count, and
   it removes the one line on the page a reader can catch out.

2. **Sections 3 and 5: restore the statute's second officer.**
   Both say the board is "led by" or "headed by the chief medical officer". The record
   (dossier §4 and src-16, at T0) says **Chief Medical Officer or Deputy Chief Medical
   Officer**. On a page whose whole discipline is precision about who holds what, a
   two-word addition closes it, and both fields have room (17 and 16 words against a
   25-word cap).

3. **Add a four-line provenance list to `# EDITOR NOTES`.**
   Four mandated departures are unrecorded, and one of them is load-bearing for
   fairness. Record:
   - hero row 2 was relabelled from the storyboard §2's "examine and recommend" under
     constraint 8b.2 and panel-1 fix 2. **Say plainly that the approved storyboard's own
     §2 prose contains a phrase its §8b.2 forbids**, so nobody restores it.
   - the "Introduced · 13 Mar 2026" stage is *in*, because §8i's SETTLED box contradicts
     itself (the box says "settled as recommended" and the recommendation was *in*,
     while ruling 2's text says off the page). The eleven-day claim is unverifiable
     without it.
   - card 04 runs long by panel-1 fix 4, and the `bill-passage` `plain` line is a second
     authored plain beyond the storyboard's one.
   - the two operator edits of 2026-09-15 (tile 5's denominator, the timeline pronoun),
     with the note that the timeline note now sits at exactly 20 of 20 words.

4. **Run `npm run check:prose -- 2026-05-02-transgender-ratchet` before committing.**
   My hand count puts reader-facing words at roughly 1,110 against the 1,100 ceiling,
   inside my own error bars on either side. It is the one gate I cannot settle by
   reading, and the only composition floor in doubt.

---

## Optional improvements

1. **Tile 5's denominator could be tighter than "all transgender people in India".**
   The edit is correct, it names the source's own denominator, and it closes the funnel
   misreading. But tile 1 four lines above is careful to call 4.87 lakh "the only
   **official count**" rather than the population, precisely because constraint F.8
   forbids treating the census figure as the true size. "Of the 4.87 lakh counted" is
   five words, fits the same slot, closes the same funnel misreading, and keeps the two
   tiles saying the same thing about the same number. **Operator's call, not a defect**,
   and I would not hold the issue for it.

2. **Put src-16 on section 3.** The `jargon-buster`'s third gloss ("recommends to the
   magistrate. It does not decide") is the definitional home of the issue's most
   carefully guarded verb, and the T0 record that anchors it is cited on sections 5 and
   6 but not there. One id, no text change.

3. **Name the omitted publishers on sections 5 and 8.** Section 5's line says "PRS
   India" while the section leans on the Lok Sabha record; section 8's line names the
   census and the portal while The Print publishes three of its five figures. Two words
   each. The other three mismatches are defensible under a "name the source that carries
   the row" convention, and are listed above only for the record.

4. **The title garden-path, if the operator wants it.** Panel 2 ranks it third and calls
   it "the one word of head slack". There is no slack: the title is **8 of 8 words** and
   the head sits at 79 of 80. Any fix has to be a substitution at eight words or fewer.
   The claim itself is sound and "in law" and "twice" both have to survive.

5. **Two dossier corrections, actionable only outside this rewrite.** §3's 2019-11-26
   row attributes the passage to the **Lok Sabha**; PRS has LS 5 Aug 2019 and RS 26 Nov
   2019. That is a **fourth** stale place beyond the three the brief names, the draft
   already dodges it, and nothing currently records the correction. §5's "gender
   identity" quote also needs the re-anchoring's caveat attached to it in the dossier
   itself, or a future drafter will lift it as the minister's own words exactly as the
   last one did.

6. **Mark the storyboard's quiz answer 1 as superseded.** It asserts the four Articles
   and the surgery-precondition holding, both removed by ruling. Panel 2 confirms the
   question is still answerable from the draft. Without a mark, a later pass reads the
   difference as a comprehension gap and tries to restore two claims with no primary.

7. **Backlist note, not this issue.** Two inherited source URLs end in `/amp`
   (src-09, orphaned, and src-14) and six use `m.thewire.in`. They resolve, and the
   rewrite is barred from touching `sources[]`, so this belongs on a cleanup list.

---

## One thing I want to say plainly

This is the most constrained issue in the backlist and the constraints held. The place
where that is clearest is not any single claim, it is the **absence** of src-16 from
section 7's `sourceRefs` while it sits on sections 5 and 6. Citing the Lok Sabha record
beside the minister's English would have been the natural, tidy, wrong thing to do, and
it would have quietly re-asserted the exact thing the operator ruled out. Somebody
thought about it.
