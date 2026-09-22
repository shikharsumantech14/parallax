# Verification Report: NASA bought the station's ending in 2024

- **Draft:** src/content/issues/2026-09-21-iss-retirement-set-by-contract/index.mdx
- **Dossier:** research/space/2026-09-17-iss-retirement-set-by-contract-dossier.md
- **Storyboard:** research/space/2026-09-21-iss-retirement-set-by-contract-storyboard.md (Status: approved)
- **Panel:** research/space/2026-09-21-2026-09-21-iss-retirement-set-by-contract-panel.md (REVISE — most items already addressed; see note)
- **Verified:** 2026-09-22
- **Verdict:** NEEDS REVISION

---
## Overall verdict

**NEEDS REVISION — no ❌ flags of any class.** Every factual claim in the draft
traces to a dossier entry; there are no untraced claims, no invented numbers, no
advocacy, no wire tone, no Hindi anywhere in the issue, and no verbatim quotation
at all — so the quotability gate has nothing to bite on. The composition gate
(`npm run check:prose`) returns zero errors and zero warnings: every REGISTER-PLAN
§5.1 floor passes, including the two that are hardest to hit (≥2 never-published
graphic kinds — `descent-profile` and `orbit-trace` — and ≥8 sources from ≥5
publishers with none above 40%).

What holds publication is a cluster of **provenance and precision defects**, not
accuracy failures. The largest is systematic: `sourceRefs` on four sections do not
match the **shape** of the claims those sections make. `src-09` (Spaceflight Now)
is the single source carrying 330 km, 220 km, the ~18-month build, the 1 May 2029
delivery and the >30,000 kg mass, yet it is cited on only one of the four sections
that use those figures — while `src-07` (Orbital Debris Program Office) is cited on
the benchmark chart, where it carries nothing, because it belonged to the
`elevation-profile` section the storyboard's §8.4 swap would have used and the
draft did not. The same wrong document is then named in the `# EDITOR:` block, so
the operator's pre-publish check on the three [UNVERIFIED] delta-v values is
pointed at a document that does not contain them. Second: the draft reverses a
hedge, turning the dossier's "through **at least** 2028" into "only to 2028" in
two places — an upper bound no source states. Third: the `three-steps` section
promises "the gap between them is arithmetic" and then does not do the arithmetic;
its own numbers do not produce 2027, and the dossier's actual reason for 2027 is
never stated. The reader panel found that one independently.

All of these are fixable from the existing dossier without new research.

---
## Claim verification

54 claims checked: **40 ✅ VERIFIED · 14 ⚠️ IMPRECISE · 0 ❌ UNTRACED.**

### Head and frontmatter

| Claim | Location | Status | Note |
|---|---|---|---|
| NASA bought the station's ending in 2024 | title | ✅ | Dossier §3, 26 Jun 2024 award. |
| The deorbit vehicle was contracted in 2024 | dek | ✅ | §3, §4.2. |
| The station's end date was fixed by a purchase order, not a failure | hook | ✅ | §4.3, §4.4 — the structural claim the issue rests on. |
| ISS operations committed to 2030 | primer | ✅ | §3 / src-03. |

### Section 1 · `descent-profile`

| Claim | Location | Status | Note |
|---|---|---|---|
| Altitude 415 km at −18 months | data.points | ✅ | §4.8 captured values. |
| 330 km at −6 months | data.points | ⚠️ IMPRECISE | Traces to §4.2, sourced to **Spaceflight Now (src-09)** — which this section does not cite. See Fix 1. |
| 220 km at −0.13 months and at entry | data.points | ⚠️ IMPRECISE | Same: src-09 carries it; refs are src-03/04/12. |
| Four event labels (drift down, final approach, deorbit burn, entry interface) | data.events | ✅ | §4.8, §4.11. |
| Craft label / USDV framing | data.craftLabel | ✅ | §4.2. |
| `source: NASA, June 2024` | section.source | ⚠️ IMPRECISE | The altitude ladder is Spaceflight Now's reporting, not a June 2024 NASA release. Label understates the chain. |
| No `phase` on points ⇒ no phase bands | data.points | ✅ | Deliberate per storyboard; component reads `phase?` and omits bands cleanly. Data-shape honest. |

### Section 2 · `you-think`

| Claim | Location | Status | Note |
|---|---|---|---|
| NASA selected SpaceX in June 2024 | caption | ✅ | §3, 26 Jun 2024. Caption asserts DATA — correct field use. |
| Single award worth up to $843 million | caption, data.actually | ✅ | §4.3, primary NASA release (src-12). |
| No ₹ bracket on $843m | caption | ✅ | Correct: historical (2024) figure, contract §3 rule 4 forbids conversion at today's rate. |

### Section 3 · `timeline`

| Claim | Location | Status | Note |
|---|---|---|---|
| Five partner agencies committed to 2030 | intro | ✅ | §3 / src-03. |
| "Russia, one of the five, only to 2028" | intro | ⚠️ IMPRECISE | **Hedge reversal.** Dossier §3 and src-03 say "through **at least** 2028". "Only to" asserts a ceiling no source gives. Also recurs in the 2030 event note. See Fix 2. |
| 26 Jun 2024 — SpaceX awarded the deorbit vehicle | data.events | ✅ | §3. |
| 17 Jul 2024 — vehicle specifications published | data.events | ✅ | §3, §4.2. |
| 17 Jun 2026 — GAO report issued | data.events | ✅ | §3 / src-01. |
| Event label "**Auditors set the deadline**" | data.events | ⚠️ IMPRECISE | The GAO report *observes* the decision window; the 2027 date is driven by lead time and by certification/funding needs (§4.4), not set by the auditors. The label also contradicts this section's own annotation ("Nothing on the station forces this date"). See Fix 4. |
| "GAO: NASA must decide within a year." | data.events | ⚠️ IMPRECISE | Compression drops the qualifier: §4.4 frames this as what NASA must decide **about** (certifying a replacement, funding additional transportation), not a bare deadline. Reads as a quotation without being one. |
| 1 May 2029 — vehicle delivery required | data.events | ⚠️ IMPRECISE | Correct (§4.2) but sourced to src-09, which this section does not cite. |
| 2030 — end of committed operations | data.events | ✅ | §3. |
| Annotation at 2027: "Nothing on the station forces this date" | data.annotations | ✅ | §4.4. Resolves against a real x-position on the rendered axis — checked, not assumed. |
| `source: GAO-26-107805, 17 June 2026` | section.source | ✅ | Matches src-01 exactly, including report number. |

### Section 4 · `three-steps`

| Claim | Location | Status | Note |
|---|---|---|---|
| "The gap between them is arithmetic" | intro | ⚠️ IMPRECISE | The section does not perform the arithmetic, and its own figures do not yield 2027. See Fix 3. |
| The burn needs a vehicle (~18 months to build) | data.steps | ⚠️ IMPRECISE | §4.2, sourced to Spaceflight Now (src-09) — cited here, correctly. The "roughly" survives. ✅ on the hedge. |
| Vehicle >30,000 kg | data.steps | ✅ | §4.2 / src-09, cited. |
| Launcher must be secured "at least three years ahead" | data.steps | ✅ | §4.2 / src-09, cited; hedge preserved. |
| "Count back from 2030 and the commitment lands in 2027" | data.steps | ⚠️ IMPRECISE | Does not follow from 18 months + 3 years. The dossier's 2027 (§4.4) rests on certification and funding lead time, which the draft never states. |
| `source: NASA and SpaceX, 17 July 2024` | section.source | ⚠️ IMPRECISE | Two of the three step figures are Spaceflight Now's, not a NASA/SpaceX release. Source line drifts from the rows. |

### Section 5 · `benchmark-chart`

| Claim | Location | Status | Note |
|---|---|---|---|
| 57 m/s (highlighted) | data.items | ⚠️ **[UNVERIFIED] used — flagged** | §9 marks all three delta-v values [UNVERIFIED]; the draft carries the required `# EDITOR:` block, so this is ⚠️ not ❌. But the block names the **wrong document**. See Fix 1. |
| 120 m/s drawn, "120–140 m/s" in sublabel | data.items | ✅ | Correct application of the drawing rule: draw the low end, put the band in the copy. Storyboard §5 compliant. |
| 760 m/s | data.items | ⚠️ | Same [UNVERIFIED] status as 57. |
| Annotation "Saving it costs thirteen times more fuel" | data.annotations | ✅ | 760 ÷ 57 = 13.3. Arithmetic checked on the draft's own data; ≤12 words; resolves on the mark. |
| `sourceRefs: [src-07, src-04]` | section | ⚠️ IMPRECISE | src-07 (Orbital Debris Program Office) carries none of these values; it was the source for the `elevation-profile` section the §8.4 swap would have produced. Orphaned onto this section. |

### Section 6 · `number-sense`

| Claim | Location | Status | Note |
|---|---|---|---|
| ₹20,100 crore Gaganyaan programme | data.value | ✅ | §4.5 (₹201bn), Sept 2024 Cabinet expansion. |
| "It was ₹9,000 crore before September 2024." | data.equals[].note | ✅ | §4.5 (₹111bn → ₹201bn). Historical figure, correctly not re-converted. |
| Gaganyaan orbit 400 km | data.equals | ✅ | §4.5. |
| Shubhanshu Shukla reference | data.note | ⚠️ NAME-UNPLACED | Traces (§4.6), but used once with no role phrase. See register table. |
| `source: ISRO, 18 September 2024` | section.source | ⚠️ IMPRECISE | The ₹201bn Cabinet figure traces through **src-15 (SpaceNews)** in the dossier, not an ISRO release. Outlet named in `source` ≠ publisher of the cited ref. |

### Section 7 · `prose`

| Claim | Location | Status | Note |
|---|---|---|---|
| NASA has not certified a commercial replacement | body | ✅ | §4.4 / src-01. |
| "That means the test does not exist yet." | body | ✅ | §4.4 — entailment, and stated as the draft's own inference rather than as a source's words. Correct handling. |
| Driving-licence analogy | body | ✅ ANALOGY-OK | Maps certification-before-operation accurately; does not misstate the mechanism. |
| Funding for additional transportation vehicles not secured | body | ✅ | §4.4. |
| **No `source` field** | section | ⚠️ | CANON §7 "no source, no section". `sourceRefs` are present, but the rendered `Source ·` line is absent for this section. |

### Section 8 · `orbit-trace`

| Claim | Location | Status | Note |
|---|---|---|---|
| "Where 290 people have lived." | data.note | ⚠️ IMPRECISE | Dossier §4.1 says "**over** 290 individuals". The qualifier is dropped; the draft states an exact figure the source does not. |
| ISS altitude band / trace geometry | data | ⚠️ IMPRECISE | Rests on the same src-09 altitude figures; src-09 is not cited here. |
| Gaganyaan trace with no `inclDeg` | data | ✅ | Correct — the dossier gives no inclination, and the component omits the field rather than inventing one. Data-shape honest. |
| No `satCount`, and `howToRead` disclaims satellite counts | data / howToRead | ✅ | Exemplary: the comprehension field is written to what the component will actually draw. |
| `source: ISRO and NASA, 2026` | section.source | ⚠️ IMPRECISE | "2026" is the access year. Dossier §6 records the ISRO Gaganyaan page as **last updated 23 November 2022**. The date overstates the document's vintage. |

### Unused sources

| Item | Status | Note |
|---|---|---|
| src-08 (NASA OIG, IG-22-005) | ⚠️ ORPHAN | Listed in `sources`, referenced by no section. |
| src-10 (SpaceNews) | ⚠️ ORPHAN | Same. |

### Quotability gate

No verbatim quotation appears anywhere in the draft — no text in quotation marks
attributed to a named person. **No ❌ NON-QUOTABLE SOURCE exposure.** The space RAG
corpus is not ingested (dossier §9), so tracing ran against the dossier's recorded
source URLs, as the fallback specifies.

### Source balance (`_TAXONOMY.md` §5)

| Check | Status | Note |
|---|---|---|
| Primary anchor | ✅ | src-01 (GAO), src-12 (NASA release), src-03, src-04 — the load-bearing facts rest on T0–T2. |
| Viewpoint diversity | ✅ | Not a contested-interpretation issue; the claims are contractual and physical. |
| False balance | ✅ | None. Delta-v and orbital decay are stated as settled, not "balanced". |

---
## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | No advocacy, no rhetorical-question closers, no passive filler, no wire tone, no speculation, no meta-commentary. Swept all eight prose fields. |

The structure check passes: the timeline's arc is directional (award → spec →
audit → delivery → end), the `you-think` tension is genuine rather than
straw-man, the `benchmark-chart` tells its story in numbers, and section 7 stays
on documented events.

---
## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ JARGON-UNGLOSSED | §3 `source` label, §7 body | minor | "GAO" appears on the timeline's source line and in the 2026 event note, but is not expanded until section 7. A smart 15-year-old meets the acronym three sections before the gloss. |
| ⚠️ NAME-UNPLACED | §6 `data.note` | minor | Shubhanshu Shukla appears once with no role phrase. Either place him ("the Indian astronaut who flew to the station in 2025") or cut. |
| ⚠️ STORYBOARD-DRIFT | §6 | minor | The storyboard's row 6 specified a "$3 billion a year" ISS-operations comparison alongside the Gaganyaan figure; the draft drops it and the departure is not named in the summary. The remaining comparison still works, so this is a note, not a blocker. |
| ⚠️ QUESTION-UNANSWERED | Q2 | minor | The panel's finding stands: the draft teaches one of the three drivers behind the 2027 decision. Fix 3 closes this. |
| — HINDI-* | — | — | **Clean.** No Hindi anywhere — no load-bearing use, none in `caption` / `plain` / `howToRead` / `source` / labels. The panel's "aasmaan" sentence is gone from the current draft. |
| — BARE-NUMBER | — | — | Clean. Every figure carries a comparison the reader can feel, and the currency rule is applied correctly in both directions (no ₹ bracket on the historical $843m; the ₹9,000 crore predecessor given as a historical figure, not reconverted). |
| — NO-INDIAN-ANCHOR | — | — | Clean — §6 and §8 carry the Indian ground. |
| — PLAIN-CLAIM / CAPTION-FORM / REDUNDANT-HOWTO | — | — | Clean. The §2 caption asserts data (correct); §8's `plain` and `howToRead` are distinct, the paragraph naming what a mark IS and the one-liner naming the form. |
| — Composition floors | — | — | **All pass.** `npm run check:prose` → 0 errors, 0 warnings: 8 sections, ≥60% visual, 4/8 drawn graphics across 4 graphic kinds, 3 cards (one each), 2 never-published kinds (`descent-profile`, `orbit-trace`), 15 sources / 9 publishers / max share under 40%, 1,090 reader words (cap 1,100), 79 words before the first graphic (cap 80), names under 12. |

> **Margin note for the editor.** The head sits at **79 of 80** words before the
> first graphic and the issue at **1,090 of 1,100** reader words. Every fix below
> that adds prose must be a **substitution inside a section body**, not an
> addition, and must not touch the head. Fix 3 in particular needs ~10 words of
> room found by cutting ~10.

---
## Schema check

| Check | Status | Note |
|---|---|---|
| `status: draft` | ✅ | |
| All section kinds registered | ✅ | `descent-profile`, `you-think`, `timeline`, `three-steps`, `benchmark-chart`, `number-sense`, `prose`, `orbit-trace` — all in `SECTION_KINDS`. |
| No `author` field | ✅ | |
| `publishedAt` valid | ✅ | 2026-09-21. |
| Source URLs `https://` | ✅ | All 15. |
| Source `kind` values valid | ✅ | Only `primary` / `secondary` / `analysis`. |
| ≥8 sources, ≥5 publishers, none >40% | ✅ | 15 sources, 9 publishers. |
| Every `sourceRefs[]` resolves | ✅ | All resolve. Two sources (src-08, src-10) are referenced by nothing — valid, but dead weight. |
| Field bounds (primer, plain, howToRead) | ✅ | Within Zod bounds; build-safe. |

---
## Required fixes before publish

1. **Repair the `sourceRefs` shape mismatch, and correct the `# EDITOR:` note,
   which currently points the operator at the wrong document.**
   - Add **src-09 (Spaceflight Now)** to sections **1**, **3** and **8** — it is
     the source that carries 330 km, 220 km, the ~18-month build, the 1 May 2029
     delivery and the >30,000 kg mass, and it is cited on only one of the four
     sections that use those figures.
   - Add **src-05 (NASA FAQ)** to section 1.
   - Remove **src-07 (Orbital Debris Program Office)** from section 5, or state
     what it supports there. It carries none of 57 / 120–140 / 760 m/s; it was
     the source for the `elevation-profile` section the storyboard's §8.4 swap
     would have used, and it was left behind when that section was not drawn.
   - **Rewrite the `# EDITOR:` block above section 5** to name the
     ***ISS Deorbit Analysis Summary* white paper (src-04)** — the dossier's
     §4.11 / §9 source for the three [UNVERIFIED] delta-v values — instead of
     "NASA's Orbital Debris Program Office". As written, the pre-publish
     confirmation step sends the operator to a document that does not contain
     the numbers being confirmed, which would return a false negative.
   - The dossier §9 instruction stands: **if any one of 57 / 120–140 / 760
     cannot be confirmed, GRAPHIC 4 must be cut, not softened.**

2. **Fix the hedge reversal on Russia's commitment — two places.**
   Dossier §3 and src-03 both say Russia is committed "through **at least**
   2028". The draft says "**only to** 2028" in the section 3 intro and repeats
   the sense in the 2030 event note. "Only" asserts an upper bound no source
   states, and it strengthens the issue's argument in the issue's own favour —
   exactly the direction a hedge must never drift. Restore "at least 2028" (or
   "through 2028 at minimum") in both.

3. **Close the 2027 arithmetic gap in `three-steps`, or stop promising it.**
   The intro says "The gap between them is arithmetic", but roughly 18 months to
   build plus a launcher secured at least three years ahead does not count back
   from 2030 to 2027, and the reader cannot reconstruct the date from what is on
   the page. The dossier §4.4 gives the real drivers: NASA must **certify a
   commercial replacement** and **secure funding for additional transportation
   vehicles**, neither of which the section states. Either name one of those
   drivers in step 3, or drop the word "arithmetic" from the intro so the
   section stops advertising a calculation it does not show. This also closes
   the reader panel's surviving Q2 finding. **Budget: substitute, do not add —
   the issue is 10 words under the word cap and 1 word under the head cap.**

4. **Fix the timeline event label "Auditors set the deadline."**
   GAO observed a decision window; it did not set the 2027 date. The label also
   contradicts this section's own annotation, "Nothing on the station forces
   this date" — the issue tells the reader in one mark that the date is
   externally imposed and in another that nothing imposes it. Retitle to
   something like "Auditors name the window", and soften "GAO: NASA must decide
   within a year" to reflect §4.4's framing of *what* must be decided.

5. **Give section 7 a `source` field.** It is the only section without one
   (CANON §7, "no source, no section"). `src-01` with the GAO date is the
   natural label.

6. **Correct two source labels that name the wrong publisher or vintage.**
   - Section 6: `source: ISRO, 18 September 2024` — the ₹20,100 crore Cabinet
     figure reaches the dossier through **src-15 (SpaceNews)**. Name the outlet
     that actually carries it.
   - Section 8: `source: ISRO and NASA, 2026` — "2026" is the access year. The
     dossier §6 records the ISRO Gaganyaan page as **last updated 23 November
     2022**. Use the document's vintage, not the year you read it.

7. **Restore the dropped qualifier in section 8.** Dossier §4.1 says "**over**
   290 individuals"; the draft's note says "Where 290 people have lived." One
   word, and it converts a floor into an exact count.

---
## Optional improvements

- **Gloss "GAO" on first appearance** (section 3's source line or the 2026 event
  note) rather than leaving it to section 7. "the GAO, the US government's
  auditor" costs four words and can be traded against the word cap elsewhere.
- **Place or cut Shubhanshu Shukla.** A name used once with no role is a name the
  reader carries for nothing.
- **Remove src-08 and src-10, or use them.** Two of fifteen sources are
  referenced by no section. The source-diversity floor passes comfortably
  without them (9 publishers), so removing them costs nothing and makes the
  bibliography honest about what the issue actually rests on.
- **Name the storyboard departure in the summary.** Row 6's "$3 billion a year"
  ISS-operations comparison was dropped. The substitution is defensible — the
  Gaganyaan comparison is the stronger Indian anchor — but the storyboard is the
  approved contract, and a silent departure is harder to review than a stated one.

---
## What this draft gets right (recorded so it is not lost in revision)

- **Zero untraced claims across 54 checked.** That is the bar, and it is met.
- **The drawing rule is applied correctly** on the 120–140 m/s band: the mark
  sits at the low end and the band lives in the sublabel, which weakens the
  issue's own claim rather than flattering it.
- **The currency rule is handled correctly in both directions** — no ₹ bracket on
  the historical $843m, and the ₹9,000 crore predecessor given as a historical
  figure rather than reconverted.
- **Two data-shape honesty wins**: `orbit-trace` omits `inclDeg` where the
  dossier gives no inclination rather than inventing one, and its `howToRead`
  explicitly disclaims satellite counts because no `satCount` is authored — the
  comprehension field is written to what the component will actually draw.
  `descent-profile`'s omitted `phase` is the same discipline.
- **The entailment in section 7** ("That means the test does not exist yet") is
  stated as the draft's own inference, not dressed as a source's words.
- **Two never-published graphic kinds reach a reader**, which is the diversity
  floor's whole purpose rather than its minimum.
