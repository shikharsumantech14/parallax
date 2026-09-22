# Verification Report: Eleven bills passed. None went to a committee.

- **Draft:** src/content/issues/2026-09-21-eleven-bills-fifteen-percent/index.mdx
- **Dossier:** research/politics/2026-09-17-eleven-bills-fifteen-percent-dossier.md
- **Storyboard:** research/politics/2026-09-21-eleven-bills-fifteen-percent-storyboard.md (Status: approved)
- **Panel (pass 1):** research/politics/2026-09-22-eleven-bills-fifteen-percent-panel.md (REVISE)
- **Verified:** 2026-09-22
- **Verdict:** **BLOCKED**

---

## Overall verdict

This is a clean, well-sourced draft — 60 of 68 traced claims verify exactly, the
one verbatim quotation is character-perfect, the Hindi layer is empty by design,
and the machine-prose marks (em-dash, semicolon, AI vocabulary) are all zero in
reader-facing prose. The two never-published kinds carry real sourced data and
the storyboard's kinds, order, hero and layouts were executed row for row. It is
blocked on **two ❌ claims, both in captions** — the one comprehension field that
asserts data and the only one this report traces.

The first is the more serious because nothing upstream would catch it. Section
4's caption says **"Question Hour falls furthest."** By the component's own
selection arithmetic — `MarginBullets.astro` line 140, `shortfall = (required −
value) / required` — the four rows score 0.85, 0.99, **1.00** and 0.54, so the
furthest shortfall is **"Bills passed after committee scrutiny" (0 of 8), not
Question Hour**, and that is the row the graphic will select and highlight. The
caption will therefore contradict the picture printed directly above it. The
error did not originate with the drafter: dossier §4.5(B) and storyboard §3 row 4
both assert that the default "lands on Question Hour", and the drafter faithfully
turned an upstream arithmetic slip into a reader-facing finding. Zero of a
required eight is a 100% shortfall; 0.6 of 60 is 99%. The fix is one word, and it
*improves* the issue — Karthik's panel note was that the committee row "is buried
as row 3 of 4", and correcting the caption puts the row that answers quiz
question 2 into the component's own highlight.

The second is the publication-date dependency both the dossier (§9.2) and the
storyboard (row 9) flagged as mandatory. Section 9's caption asserts the session
"had not been prorogued **when this issue went out**", but the section's own
source line dates the evidence "as of 14 September 2026" and `publishedAt` is
2026-09-21. The caption claims seven days the record does not cover, and the
section contradicts itself across two fields.

Everything else is ⚠️ and fixable without new research, with one exception worth
flagging early: **the source spread regressed below the floor in transit**. The
dossier assembled 16 sources at 37.5% PRS and the storyboard instructed the
drafter to carry the bibliography across minus EPW only (15 sources, PRS at
exactly 40%). The draft ships 13 — ORF and Swarajya were dropped too — which puts
**PRS at 6 of 13, 46.2%**, over the 40% ceiling. Restoring the two named entries
fixes it arithmetically and restores the centre and right viewpoint clusters the
dossier built on purpose.

---

## Claim verification

**60 ✅ verified · 6 ⚠️ imprecise · 2 ❌ untraced/contradicted** (68 traced).

### Head

| Claim | Location | Status | Note |
|---|---|---|---|
| "Eleven bills passed" | title | ✅ | §4.1 — 11 passed both Houses |
| "None went to a committee" | title | ✅ | Narrow claim, §9.3. Discharged on the same screen by §2's stage-2 note, as the storyboard required |
| Lok Sabha sat 15% of scheduled time | hook | ✅ | §4.1, PRS vital stats |
| Passed eleven of twelve bills | hook | ✅ | §4.1 |
| "Nine had no speaker but the minister" | hook | ✅ | §4.1, Newslaundry 20 Aug 2026 |
| "The government owns the clock" | dek | ✅ | §4.3 — Art. 85, Cabinet Committee on Parliamentary Affairs |
| "Parliament sat nineteen days" | primer | ✅ | §4.1 — "Both Houses met for 19 days" |
| "the laws **it** passed in fifteen percent of **its** scheduled time" | primer | ⚠️ IMPRECISE | 15% is the **Lok Sabha**; the Rajya Sabha ran at 33%. The antecedent is "Parliament", so the primer applies a one-House figure to both. The storyboard's own primer said "a House open fifteen percent of the time" and was correct — this broadened in the rewrite |

### Section 1 · `you-think`

| Claim | Location | Status | Note |
|---|---|---|---|
| 15% + eleven of twelve | caption | ✅ | §4.1. Matches the storyboard caption verbatim |
| value 11 · "of 12 bills" | data.actually | ✅ | §4.1 |
| "Nine cleared the Lok Sabha with only the minister speaking" | data.actually.text | ✅ | §4.1 — House scope correctly retained here |
| "The House worked 15% of its scheduled time while it did this" | data.note | ✅ | §4.1 |

### Section 2 · `bill-funnel` (hero)

| Claim | Location | Status | Note |
|---|---|---|---|
| Stage 1 = 12 introduced | data.stages | ✅ | §4.5(A) |
| Stage 2 = 11 reached a Lok Sabha vote | data.stages | ✅ | §4.5(A) |
| "The twelfth went to a committee instead" | stage 2 note | ✅ | §4.1. **Mandatory** per storyboard §4 — present |
| Stage 3 = 11 passed both Houses | data.stages | ✅ | §4.1 |
| Stage 4 = 2, **"Debated by any MP but the minister"** | data.stages label | ⚠️ IMPRECISE | The count is sound (11 − 9) but the **House qualifier was dropped from the mark**. The storyboard's label read "Debated in the Lok Sabha by anyone but the minister". As written the bar claims only 2 of 11 bills drew a non-minister speaker *anywhere in Parliament* — which the draft's own §5 contradicts, since the MMDR Bill took 40 minutes in the Rajya Sabha. The caption carries "Lok Sabha" correctly; the label a skimmer reads does not |
| "Nine passed with only the minister speaking" | stage 4 note | ✅ | §4.1 |
| "Two drew a Lok Sabha MP other than the minister" | caption | ✅ | §4.4 derived, scope correct |
| "stage four derived, eleven minus nine" | source | ✅ | Derivation printed as the storyboard required |
| Committee glossed as "a small group of MPs takes it apart over weeks" | intro | ✅ | Inline gloss before first use, contract rule 2 |

### Section 3 · `jargon-buster`

| Claim | Location | Status | Note |
|---|---|---|---|
| Prorogue = formal end of a session; until it happens the session stays open | terms | ✅ | §4.3, Art. 85(2) + Art. 123 hinge |
| Adjourned sine die = Latin "without a day", no date fixed to return | terms | ✅ | §4.3; the Latin is correct |
| Question Hour = first hour of every sitting, MPs question ministers | terms | ✅ | §4.1 |

### Section 4 · `margin-bullets`

| Claim | Location | Status | Note |
|---|---|---|---|
| Row 1 — 15 of 100, % of scheduled time | data.rows | ✅ | §4.5(B) |
| "about nine minutes in every scheduled hour" | row 1 note | ✅ | §4.4. "Across the session" wording mandated and present |
| Row 2 — 0.6 of 60 minutes | data.rows | ✅ | §4.4, derived from PRS's 1% |
| "about 36 seconds in every scheduled hour" | row 2 note | ✅ | §4.4. Correctly **not** stated as a per-day stopwatch |
| Row 3 — 0 of 8, max 11 | data.rows | ✅ | §4.5(B) |
| "What the 15th Lok Sabha's rate would have sent. A comparison, not a rule" | row 3 note | ✅ | §4.4's labelling requirement discharged in the row itself |
| Row 4 — 55 of 120, max 135 | data.rows | ✅ | §4.2 |
| "A 2002 review panel recommended 120. The first Lok Sabha averaged 135" | row 4 note | ✅ | §4.2. Panel described, not named — correct under the name ration |
| "All four measures fall short of their own marks" | caption | ✅ | 15<100, 0.6<60, 0<8, 55<120 |
| **"Question Hour falls furthest."** | caption | ❌ **CONTRADICTED** | `MarginBullets.astro:140` computes `(required − value)/required`: row 1 = 0.85, row 2 = **0.99**, row 3 = **1.00**, row 4 = 0.54. The worst relative shortfall is **row 3, committee scrutiny**, and that is the row the component will select and print in its readout. The caption will contradict the graphic above it. Dossier §4.5(B) and storyboard §3 row 4 both assert Question Hour; **both are wrong**, and the draft inherited the error |
| Both derivations on the source line | source | ✅ | "1% of 60 minutes is 0.6 · 71% of 11 bills is about 8" |
| `sourceRefs` cites src-08 (Scroll.in) | sourceRefs | ⚠️ IMPRECISE | The source line names only PRS. Scroll backs the 55-sittings figure legitimately, so the ref is right and the label under-names it |

### Section 5 · `bill-passage`

| Claim | Location | Status | Note |
|---|---|---|---|
| MMDR Amendment Bill, four days introduction to Rajya Sabha | intro | ✅ | §4.5(D), 10→13 Aug |
| "Seven of the eleven bills took five minutes or less" | intro | ⚠️ IMPRECISE | §4.1 supports 7 of 11 (PTI/ThePrint) but the figure is Lok Sabha debate time. Placed one sentence after the MMDR's four days, and in a section whose own data shows that bill taking 45 minutes across both Houses, it reads as a whole-Parliament total. Name the House |
| "forty-five minutes of debate" | caption | ✅ | §4.1 — 5 (LS) + 40 (RS) |
| "no committee stage" | caption | ✅ | §4.1, PRS "Committee Referral: No" |
| Dates 10 / 12 / 13 Aug 2026 | data.stages | ✅ | §4.5(D) |
| "Five minutes of debate" (Lok Sabha) | stage note | ✅ | §4.1, Newslaundry |
| "Forty minutes of debate" (Rajya Sabha) | stage note | ✅ | §4.1 |
| Assent `pending`, "Not confirmed as of publication" | data.stages | ✅ | §9.1 [UNVERIFIED] carried honestly, not asserted. The eyebrow was also changed from the storyboard's "ONE LAW" to **"ONE BILL"**, which is the correct call under §9.1 — a sanctioned improvement, not drift |

### Section 6 · `three-steps`

| Claim | Location | Status | Note |
|---|---|---|---|
| "On the days the House sat, that majority was there" | step 1 | ⚠️ IMPRECISE | An inference from passage, not a record. Scroll (§4.2) reports only 9% of bills passed with recorded voting; the rest were voice votes, where a majority is *deemed*, not counted. "the House carried them" would be exact |
| "the government sets the calendar those weeks come out of" | step 2 | ✅ | §4.3 — "The power to summon parliament rests with the executive"; the Cabinet Committee on Parliamentary Affairs fixes dates (src-10). **Newly added since the panel**, and it closes panel fix 2 in part |
| Source line reads "Constitution of India, Article 85" | source | ⚠️ IMPRECISE | Article 85 gives the **President** the summoning power; it does not say the government decides. The claim in step 2 rests on src-10 (The Wire, 2017), which is cited in `sourceRefs` but absent from the label. A T0 document is being credited for a claim only the T4 analysis makes |
| "Losing time removes the stage that needs time and leaves the stage that does not" | step 3 | ✅ | §1 verbatim in substance. See the composition audit on the 88% tension the issue does not carry |

### Section 7 · `benchmark-chart`

| Claim | Location | Status | Note |
|---|---|---|---|
| 14th 60 · 15th 71 · 16th 25 · 17th 16 | data.items | ✅ | §4.2. The candidate's swapped 14th/15th and its unsupported "13%" were both correctly avoided |
| Unit states the denominator, "bills introduced" | data.unit | ✅ | §4.2's caveat discharged. 25 used for the 16th, not 26 — correct, one denominator throughout |
| "The high-water mark" (15th) | sublabel | ✅ | §4.2 |
| "Fewest of the last four" (17th) | sublabel | ✅ | §4.2, PRS "lower than the previous three Lok Sabhas" |
| "Referral falls by two-thirds after 2014" | annotation | ✅ | 71→25 is a 64.8% fall. 6 words, under the 12 cap |
| "fell from 71% … to 16%" | caption | ✅ | §4.2 |
| `sortDesc: false` renders chronologically | data | ✅ | Verified in `BenchmarkChart.astro:64` — `sortDesc ? sort : items`. The storyboard asked for this check; the component honours it |

### Section 8 · `quote`

| Claim | Location | Status | Note |
|---|---|---|---|
| Achary on prorogation, 45 words | data.quote | ✅ **VERBATIM** | Compared character by character against dossier §5. Exact, including "House of parliament" lower-cased as The Wire rendered it. The second Achary quotation (the ellipsis one) is correctly **not** used |
| "P.D.T. Achary, former Secretary General of the Lok Sabha" | attribution | ✅ | §4.6 |
| "The Rajya Sabha's manual records a gap of two to ten days" | followup | ✅ | §4.3 |

### Section 9 · `timeline`

| Claim | Location | Status | Note |
|---|---|---|---|
| 17 Apr 2026 — 131st Amendment Bill defeated | events | ✅ | §4.3 — negatived 17 Apr 2026 |
| "Two in three MPs had to vote yes, and they did not" | note | ✅ | §4.3, two-thirds requirement; opposition voted against as a bloc |
| 20 Jul 2026 — session opens, nineteen sittings to 13 Aug | events | ✅ | §3 |
| 24 Jul 2026 — Lok Sabha adjourns minutes after opening | events | ✅ | §3, ThePrint |
| "The Speaker asks the opposition not to block proceedings" | note | ✅ | §5 — a paraphrase in a note, not a quotation, so no verbatim duty. Speaker correctly described, not named |
| 13 Aug 2026 — both Houses adjourn sine die | events | ✅ | §3 |
| "Eleven bills have passed. None has gone to a committee" | note | ✅ | The narrow claim; "None" scoped by the preceding sentence to the eleven |
| 14 Sep 2026 — neither House prorogued | events | ✅ | §4.3, The Wire, as of that date |
| "The manual records two to ten days, not thirty-two" | annotation | ✅ | §4.3. 9 words, under the 12 cap |
| **"had not been prorogued when this issue went out"** | caption | ❌ **UNTRACED** | The evidence is dated 14 September 2026 — the section's own source line says so. `publishedAt` is 2026-09-21. The caption asserts seven days of non-prorogation the record does not cover, and disagrees with the source line beside it. Dossier §9.2 and storyboard row 9 both make a re-check **mandatory before publishing**; no re-check is recorded |

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | — |

Clean. No advocacy, no wire tone, no rhetorical-question closer, no passive
filler, no meta-commentary, no speculation about what "will happen". The
dossier's sharpest material — Jairam Ramesh's "kept on ventilator" and Sagarika
Ghose's "devious" — is composed out entirely, per storyboard ruling 3, and the
draft honours it: no motive is alleged anywhere. On a politics issue with an
opposition allegation sitting in the dossier, that restraint is the finding.

Machine-prose marks, checked by grep across the file: **zero em-dashes in
reader-facing prose** (the two hits are inside `sources[].title` strings, which
are not reader-facing), **zero semicolons**, **zero** words from the AI list.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| **SOURCE-NARROW** | `sources[]` | ⚠️ | **13 sources · 6 publishers · PRS 6 of 13 = 46.2%**, over the 40% ceiling. The dossier shipped 16 at 37.5% and the storyboard instructed the drafter to carry the bibliography across minus EPW (15 sources, PRS at exactly 40%). **ORF and Swarajya were dropped as well**, which is what pushed PRS over. Restoring both fixes the arithmetic (6 of 15 = 40%) and restores the centre and right viewpoint clusters |
| **TEXT-HEAVY** (provisional) | whole issue | ⚠️ | Hand count lands at **~1,130–1,185 reader-facing words against the 1,100 ceiling**, depending on whether the gate sweeps numeric `value`/`required`/`max` and `unit` strings. Largest overruns against the storyboard budget: §4 **+31 to +43** (175 cap), §9 **+28** (125 cap), §5 **+18** (105 cap), §8 **+8** (70 cap). **`npm run check:prose -- 2026-09-21-eleven-bills-fifteen-percent` is the authority and I could not run it here — run it before publishing.** Note that §8 is the storyboard's designated slack row ("if a row overruns, the Achary quote's follow-up sentence pays first"), and it overran instead of paying |
| **BARE-NUMBER** | §7 | ⚠️ | 71% and 16% carry no comparison a reader can feel. The storyboard's §5 Indian-ground table specified "about one in six bills" against "two in three" under the 15th Lok Sabha, and the draft uses neither. Panel readers retold this section numerically ("60/71/25/16") rather than in a felt quantity |
| **QUESTION-UNANSWERED** | storyboard §6 Q3 | ⚠️ | All four panel readers answered Q3 only partly. §6's new step-2 clause now names the government for the **calendar**, which closes half the gap, but **committee referral is still never assigned to anyone**. Important: the fix is *not* to assert it. Dossier §1 claims referral is the government's call but **no §4 fact carries a citation for it** — referral is formally the Speaker's/Chairman's. Either source the claim properly or narrow Q3 to summoning and prorogation, which the draft does support |
| **STORYBOARD-DRIFT** | `sources[]`, primer, §2 stage 4 | ⚠️ | Three departures, none flagged in the draft: three sources dropped (above); the primer reworded in a way that broadened the 15% figure; §2's stage-4 label lost its House qualifier. Kinds, order, hero, layouts, word-budget intent and the two mandatory notes all match exactly |
| **JARGON-UNGLOSSED** | §8 eyebrow | ⚠️ (mild) | "THE PREROGATIVE" is above everyday vocabulary and is not glossed before it appears. The panel's Sana flagged exactly this word. The quotation itself defines it by context, so this is a weak flag |
| Head margin | head + §1 | note | Words before the first graphic = **78 of 80** (head 69 + eyebrow 2 + title 7). The storyboard budgeted 74; the primer grew from 27 words to 30, which ate the margin. Still passes, with two words of room |
| `jargon-buster.meaning` cap | §3, "Prorogue" | note | Exactly **25 of 25**. The gate fires on `>`, so it passes with **zero** margin. Any rewrite of that definition must be a substitution, not an addition |
| Section source date | §4 | note | Labelled "August 2026", but row 4's data (55 sittings, 17th Lok Sabha) and src-08 (Scroll) are February 2024 material. A date range or a second date would be exact |
| `REDUNDANT-HOWTO` | §4 | note | `plain` and `howToRead` both explain that the four rows share no unit. The `howToRead` earns its place with the comparison instruction and the control clause, so this does not fire — but the shared clause is the one place to cut if §4 must lose words |
| **Clean:** HINDI-LOAD-BEARING · HINDI-FIELD · HINDI-SPELLING · HINDI-DENSE | — | ✅ | **Zero Hindi anywhere.** The storyboard sanctioned an optional *matlab* in §6 step 3 and the draft declined it. Correct on the politics desk |
| **Clean:** NO-INDIAN-ANCHOR · currency | — | ✅ | The subject is entirely Indian. Dossier §4.7 confirms no foreign currency exists in the record, so no ₹ bracket is owed (contract §3 rule 4). None appears. Correct |
| **Clean:** NAME-THROUGHPUT · NAME-UNPLACED | — | ✅ | Two people/bodies in body copy (PRS, Achary) plus two named bills, well under 12. Om Birla, the National Commission and every opposition MP are **described, never named** — each would have been a single use (tell 11) |
| **Clean:** FEW-GRAPHICS · CARD-HEAVY · NO-NEW-KIND | — | ✅ | **5 of 9 drawn graphics (56%)**, floor 40% · **5 distinct graphic kinds**, floor 3 · **3 plain-language cards**, one each, at the cap of 3 · **2 kinds new to the publication** (`bill-funnel`, `margin-bullets`), floor 2. `number-sense` deliberately unspent |
| **Clean:** TEXT-HEAVY/visual · PROSE-RUN · NO-LEAD-GRAPHIC · HEAD-HEAVY | — | ✅ | 6 of 9 visual (67%) · text-only at 3, 6, 8, never adjacent · §1 is visual · 78 of 80 before the first graphic |
| **Clean:** PLAIN-CLAIM · CAPTION-FORM | — | ✅ | Both authored `plain` lines (§4, §7) describe form only. Every caption asserts data. The three comprehension fields are correctly distinguished throughout |
| **Clean:** TITLE-FORMULA · HOOK-ABSTRACT · ANALOGY-CLAIM | — | ✅ | The title states the finding. The hook carries a "you", three numbers and the twist. The mark-sheet analogy is exact — each subject has its own passing mark, which is precisely why `margin-bullets` rows share no axis |

### Source balance

- **Primary anchor:** ✅ present and load-bearing. PRS vital stats and the PRS
  legislation tracker (both T1) carry 15%, the twelve/eleven split and the
  committee-referral column; Wikisource's Constitution text (T0) carries Article 85.
- **Viewpoint diversity:** the dossier built four clusters (centre, left, right,
  `n/a` primary). The draft ships **left and centre only** — dropping Swarajya
  removed the right cluster and dropping ORF thinned the centre. On a contested
  reading ("the government owns the clock") that is a **⚠️ SINGLE-VIEWPOINT**
  risk, and it is the second reason to restore those two entries.
- **False balance:** none. The counts and percentages are settled empirical facts
  from the primary anchor and are not hedged against contrary opinion.

### Quotability / copyright gate

One verbatim quotation in the issue, Achary via **The Wire — T4 · open ·
`ingest: live`**. Per `_TAXONOMY.md` §1 a live-fetch source has no corpus chunk,
so the RAG trace is moot and the quotation comes from a legally accessed original
by construction. The dossier records (§9) that the RAG corpus carries **no
2024–2026 parliamentary session data** at all, confirmed on two consecutive runs.
**No NON-QUOTABLE SOURCE exposure.** The paywalled EPW article is correctly
absent from `sources[]`, as the storyboard required, and nothing rests on it.

### The absent-ref check

No attribution in this issue was deliberately downgraded, so the "ref that must
not be there" check has no subject here. Recorded so the next pass does not
re-run it.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| `status: draft` | ✅ | |
| All section kinds registered | ✅ | All nine confirmed in `SECTION_KINDS` (`src/content/config.ts`): you-think 15, bill-funnel 56, jargon-buster 19, margin-bullets 69, bill-passage 48, three-steps 20, benchmark-chart 37, quote 17, timeline 9 |
| No `author` field | ✅ | |
| `publishedAt` valid | ✅ | 2026-09-21 — but see ❌ on §9's caption; the date is what makes that caption false |
| Source URLs `https://` | ✅ | All 13 |
| Source `kind` values valid | ✅ | primary / secondary / analysis only |
| Every `sourceRefs[]` resolves | ✅ | src-01…src-13, all defined, all referenced at least once |
| ≥ 8 sources | ✅ | 13 |
| ≥ 5 publishers | ✅ | 6 — PRS, Newslaundry, ThePrint, Scroll.in, Wikisource, The Wire |
| No publisher > 40% | ❌ | **PRS 6 of 13 = 46.2%** — see SOURCE-NARROW |
| `layout` values valid | ✅ | breath, wide, breath |
| `margin-bullets` build constraints | ✅ | 4 rows (4–8 ✓); every row has a `unit` ✓; `0 < required <= max` and `0 <= value <= max` hold on all four |
| `bill-funnel` build constraints | ✅ | 4 stages (4–10 ✓); counts monotonically non-increasing (12, 11, 11, 2) ✓ |
| `plain` ≤ 220 chars · `howToRead` 40–360 · `primer` 80–420 | ✅ | |
| No source on `jargon-buster` | note | Not a schema failure, but CANON §7 is "no source, no section". The three definitions are recorded in `research/_voice/jargon.md`; a one-line source label would close it |

---

## Required fixes before publish

1. **§4 caption — fix the false finding.** Replace "Question Hour falls
   furthest." The component selects the **worst relative shortfall**
   (`MarginBullets.astro:140`), which is **"Bills passed after committee
   scrutiny" at 0 of 8 — a 100% shortfall** against Question Hour's 99%. As
   written the caption will contradict the row the graphic highlights. Suggested
   direction, not the sentence: name the committee row as the furthest, which
   also lifts the row answering quiz question 2 out of the "buried as row 3 of 4"
   position the panel flagged. **Also correct dossier §4.5(B) and storyboard §3
   row 4**, which both carry the same arithmetic error and will otherwise seed it
   into the next issue that uses this kind.
2. **§9 caption — date the live fact or re-verify it.** "had not been prorogued
   when this issue went out" claims 21 September; the evidence and the section's
   own source line say 14 September. Either re-check prorogation status against
   the allowlisted outlets and update the node, the annotation and the caption
   together (dossier §9.2, storyboard row 9 — both make this mandatory), or
   reword the caption to the dated form the source line already uses. If the
   House *has* been prorogued since, the storyboard specifies the rewrite: last
   node becomes the prorogation date, annotation becomes the gap in days.
3. **Restore ORF and Swarajya to `sources[]`.** 13 sources with PRS at 46.2%
   breaches the 40% ceiling; 15 sources puts PRS at exactly 40% and restores the
   centre and right viewpoint clusters the dossier assembled deliberately. The
   storyboard's instruction was to carry the bibliography across minus EPW only.
4. **§2 stage-4 label — put the House back on the mark.** "Debated by any MP but
   the minister" should read "…in the Lok Sabha…" as the storyboard had it.
   Without it the bar contradicts §5, which shows the MMDR Bill taking 40 minutes
   of Rajya Sabha debate. The caption is already correct; it is the label a
   skimmer reads that is not.
5. **Primer — restore the House scope.** "the laws **it** passed in fifteen
   percent of its scheduled time" attributes a Lok Sabha figure to Parliament
   (the Rajya Sabha ran at 33%). The storyboard's "a House open fifteen percent
   of the time" was correct. Note this must be a **substitution**: the primer is
   already 3 words over budget and the head sits at 78 of 80 words before the
   first graphic, so the fix cannot add words.
6. **§5 — name the House on the five-minute figure.** "Seven of the eleven bills
   took five minutes or less" is Lok Sabha debate time (§4.1, PTI/ThePrint). In a
   section whose own data shows 45 minutes across both Houses for one bill, the
   unqualified form reads as a Parliament-wide total.
7. **§6 source line — add The Wire.** "the government sets the calendar" rests on
   src-10 (the Cabinet Committee on Parliamentary Affairs), not on Article 85,
   which assigns the power to the President. The ref is already cited; the label
   credits only the Constitution.
8. **Run `npm run check:prose -- 2026-09-21-eleven-bills-fifteen-percent`.** My
   hand count puts the issue at ~1,130–1,185 reader-facing words against the
   1,100 ceiling, concentrated in §4, §9 and §5. The gate is the authority and I
   could not run it here. If TEXT-HEAVY fires, the storyboard nominates §8's
   follow-up sentence as the first cut, and §4's `plain`/`howToRead` overlap is
   the next cheapest.

---

## Optional improvements

- **The 88% tension is nowhere in the issue.** Dossier §9 and storyboard §8 both
  say in terms that the issue "must not hide" it: the 17th Lok Sabha *functioned*
  at 88% of its scheduled time and still referred only 16% of bills, so 15% is
  not the cause of weak examination but the most visible instance of it. §6's
  step 3 and §7's intro gesture at the right connective without ever stating the
  fact. One clause in §7's intro would discharge the instruction and pre-empt the
  obvious objection.
- **Why non-prorogation matters is never said.** The storyboard's row 9 line was
  "A House kept alive can be recalled", and dossier §4.3 has the sharper hinge:
  Article 123 shuts the ordinance route while a House stays in session. The draft
  shows the 32 days but never says what they buy, which is why the panel's Aarav
  and Karthik both found §9 disconnected from the throughline.
- **§2's title slightly overstates its own graphic.** "Nothing stopped until the
  stage that costs time" sits above a funnel that visibly drops 12 → 11 at stage
  2. The storyboard was careful here ("three stages sit flat at eleven and
  twelve"). The twelfth stopped *because* it went to a committee, which is the
  issue's point — but the title as written reads past its own first bar.
- **"Speaker" still carries two senses** (panel fix 3). §2's stage note was
  reworded to "speaking", which helps, but the hook's "Nine had no speaker but
  the minister" still collides with §9's "The Speaker". Two panel readers
  re-parsed the hook's "but" as "except".
- **§6 step 1 — "that majority was there"** is an inference from passage. Only 9%
  of bills passed with recorded voting (§4.2); the rest were voice votes, where a
  majority is deemed rather than counted. "the House carried them" is exact and
  costs nothing.
- **`jargon-buster` carries no `source`.** Not a build failure, but CANON §7 is
  "no source, no section", and every other section in the issue has one.
- **§4's source date** says "August 2026" over a table whose fourth row is
  February 2024 data.
- **Credit where it is due, so a later pass does not "fix" it back:** the eyebrow
  change from the storyboard's "FOUR DAYS, ONE LAW" to "FOUR DAYS, ONE BILL" is
  correct under dossier §9.1 (assent unconfirmed — say "passed", never "became
  law"), as is keeping the assent row `pending`. The post-panel move of the
  five-minute figure out of §4's intro and into §5 resolved the panel's orphan-stat
  finding and landed it beside the ThePrint ref that backs it.
