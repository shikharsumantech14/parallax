# Verification Report: Space junk now *grows* even if nobody launches

- **Draft:** src/content/issues/2026-04-24-kessler-cascade/index.mdx
- **Dossier:** none — Phase 6 rewrite of a pre-pipeline issue. Trace target is the
  published version of that file and its twelve `sources[]`, per the operator's brief.
- **Storyboard:** research/space/2026-09-14-kessler-cascade-storyboard.md (approved, §8c SETTLED)
- **Panels:** research/space/2026-09-14-kessler-cascade-panel.md (REVISE) · `-panel-2.md` (PASS)
- **Verified:** 2026-09-15
- **Verdict:** NEEDS REVISION

---

## Read this before the verdict — two tools I did not have

1. **No Bash, no git.** I could not run `git show HEAD:…`, so I could not diff the
   rewrite against the committed published file myself. The build-output fallback
   (`.vercel/output/static/issues/2026-04-24-kessler-cascade/index.html`) is **not**
   stale here: it already carries the new title, "mostly from things breaking apart",
   "A single-year jump" and "What nobody pays", so it is the **pre-stylist draft**,
   not the published version. I used it for what it is good for — confirming which
   authored fields actually reach a reader — and traced the published record through
   the storyboard's transcription of it (§2 hero table, §5, §6, §8a) plus the two
   panel reports. **`npm run check:prose -- 2026-04-24-kessler-cascade` is the only
   thing in this repo that can do the real numeral diff.** My removal audit below is
   reconstructed, not diffed.
2. **No RAG, no fetch.** I could not open src-01 or src-06. Point 1 is therefore
   ruled on what is checkable from inside the repo, and the one question that needs
   the ESA report open is named precisely, as one line of work.

**Nothing in the draft is untraced against the published record.** Zero ❌. The
verdict is NEEDS REVISION on three cheap items, one of which is the 7,473 tile.

---

## Overall verdict

This is a clean rewrite. Every figure on the page traces to the published record or
to arithmetic the approved storyboard sanctioned; the three mandated cuts are gone
with no residue; no name was added (11 of 12); no total is implied anywhere; the
quote is the full 44 words with its speaker named; there are zero em-dashes and zero
semicolons in reader-facing prose, zero Hindi, zero advocacy, zero AI-list
vocabulary; the paradox's side B now states what its evidence proves. Three things
hold it back, none needing new research and none needing a writing agent. **(1) The
7,473 tile.** The stylist's softening to "Break-ups are part of it" is correct and
is supported by the issue's own 2024 figures — but the note is only *meaningful* if
7,473 counts objects that can include fragments, and the tile's own section cites no
source that could carry an annual figure at all. **(2) The `data-readout` header**
says "2024 to 2026" over six tiles, two of which are dated 1998 and 2023; the
storyboard asked for that header to be "retimed to the tiles that remain" and it was
not. **(3) The editor-notes block** carries a "Left for the operator" paragraph that
is stale on two counts and will send the next reader to fix something already fixed.
Beyond those, four inherited provenance gaps are listed as spot-checks — each is one
page-read, each predates this rewrite, and none is a wrong fact.

---

## Rulings on your six points

### 1 · The 7,473 tile — the main job

**Ruling, in three parts.**

**(a) The stylist's softening was necessary and is supported.** "Mostly" asserted a
majority share, i.e. more than 3,736 of 7,473 from break-ups. The issue's own 2024
break-up figures on the same page — **180+** (June 26, src-08) and **700+** (August 6,
src-06) — account for roughly **880 catalogued pieces, about 12%**. Nothing in §7's
`sourceRefs` could have closed that gap: src-06 is a single-event SpaceNews article,
src-08 is not even among §7's refs. "Break-ups are part of it" asserts only a
non-zero contribution, which those two figures prove as a floor. **✅ the softened
claim is supported by the issue's own numbers.** No numeral was touched, correctly.

**(b) The tile has no source in its own section, and that is the real defect.**
§7's refs are src-02, 04, 06, 09, 10 and its source line reads "FCC, NASA, Astroscale
and Jonathan's Space Report". None of those can carry a global annual figure: src-02
is McDowell's **Starlink** statistics page, src-04 is the FCC's 2022 rulemaking Order,
src-06 is one break-up, src-09 is an Astroscale mission page, src-10 is one NASA
station blog post. **src-01 — the ESA Space Environment Report 2025, the only source
in the whole bibliography that publishes annual orbital-population statistics — is
not cited on this section.** Whatever 7,473 is, its home is src-01 and the page does
not say so.

**(c) "Objects added to orbit" is the wording to check, and the note depends on it.**
The two possibilities are not interchangeable:

- If src-01's figure counts **objects added to the catalogue** in 2024 (launches plus
  newly tracked fragments), then "Break-ups are part of it" is right, and the honest
  label is the report's own noun — a fragment from a 2007 break-up newly catalogued in
  2024 was added to the *catalogue*, not to *orbit*.
- If it counts **objects launched** in 2024, then break-ups are by definition not part
  of it, and **the note is false and must be cut**, softened or not.

**This is one line of work with the ESA report open** and it is the only item on the
page whose truth I could not settle from inside the repo. The fix, in either case,
also closes (b): add **src-01** to §7's `sourceRefs` and name ESA on the source line.

One thing that is already right and should not be cut for length: the label's
**"in 2024"**. It is what stops a reader treating 7,473 as a stock (see point 3).

### 2 · The three cuts — all three are gone, and nothing leans on them

| Cut | Ruling | Gone? | Does anything surviving depend on it? |
|---|---|---|---|
| `orbital-shells` | 1 | **Yes.** No `orbital-shells` section, no `density` field, no band altitudes, and the ten satellite-programme names (Tiangong, OneWeb, Kuiper, Starshield…) appear nowhere in the file. | **No.** The beat it carried — each altitude band decays differently — is the hero's axis, drawn from five *published* altitudes. Nothing in the rewrite reads back to a band figure. Cutting it also retires the honesty caveat the section needed ("values are illustrative"), which is a trace improvement, not a loss. |
| ClearSpace-1 / VESPA / PROBA-1 / Vega | 5 | **Yes.** Zero occurrences in any reader-facing field. The only mentions of those words in the file are inside the editor-notes comment describing the cut. | **No.** §7's zero tile and its "One mission flew within 15 metres in 2024, then left" are ADRAS-J (src-09) and stand alone. §8's "Nothing has ever been removed from orbit" rests on the same. |
| The primer's GPS claim | 7 | **Yes.** The primer reads "Low Earth orbit: the band 160 to 2,000 km up." GPS is not mentioned anywhere in the file. | **No.** Removing a false claim adds nothing and needs no source. It is the one place the rewrite changes what the issue asserts, and it changes it by subtraction. Worth recording that the published issue's only answer to "what do *I* lose" went with it (panel 1, point 3) — an editorial gap, not a defect. |

### 3 · The absent total — no sentence implies one

I read every reader-facing string for a stock claim. **None is made.** Each count on
the page is scoped: per-event (`3,500+ at peak`, `~2,900 fragments`, `700+`, `1,500+`,
`~125`), per-fleet (`10,074 Starlink satellites in orbit`), per-year
(`7,473 … in 2024`), or per-institution (`39 … since 1998`). The primer's "thousands
of fragments" is explicitly per collision. **✅ Clean: the issue states a direction
and a price, never a level.**

Your observation about "total" is exactly right and worth keeping on the record:
§1's `actually.text` says "the total still climbs" and §1's `caption` says "the debris
total still rises" — **two uses of the word before anything sizes it**, and they are
what sends three of four panel readers looking for a stock figure that is not there.
Neither is a false claim. The nearest number they land on is 7,473, a flow, which is
why point 1's label wording matters more than its size. Panel 2's call — schedule the
research, do not block — is right, and I endorse it.

### 4 · The paradox — the statement now matches its evidence, and every ref earns its place

**Statement vs evidence: ✅ matched.** "Nobody is bound to stop making the junk" is
evidenced by a General Assembly resolution that asked states to stop and binds
nobody. That is an obligation claim under obligation evidence. The old "billed" was
proved by a fine in the *previous* section and left side B leaning across a section
break. Panel 2, point 4 records Karthik — who found the mismatch on the first pass —
now reading statement and evidence as agreeing. The `label` "What nobody owes" bridges
pay and bound correctly.

**All six refs earn their place:**

| Ref | The sentence in §8 it carries |
|---|---|
| src-05 (UNGA A/RES/77/41) | "In December 2022 the United Nations asked states… The vote was 155 for and 9 against." |
| src-11 (Secure World Foundation) | "China and Russia were two of those 9. India abstained… the resolution binds nobody." |
| src-09 (Astroscale) | intro — "Nothing has ever been removed from orbit" |
| src-04 (FCC) | intro — "only one operator has ever been fined" |
| src-10 (NASA station blog) | side A — "The space station has moved 39 times since 1998." |
| src-02 (Jonathan's Space Report) | side A — "One broadband fleet moved more than 300,000 times in 2025 alone." |

**One residual, and it moved the wrong way.** Storyboard §8b set this section's line
as "UN General Assembly resolution record, with Secure World Foundation **and the FCC
order**" over three refs. The draft **dropped "and the FCC order" from the line** while
the refs grew to six. So the line now names **2 of 6**, and the two facts you added
refs for (src-09, src-04) are the two the line does not name. Not a wrong claim —
a `source` line is not required to enumerate — but it is the one place where line and
refs moved in opposite directions. One-line fix if you want it, listed as optional.

### 5 · Every surviving figure — copied, not retyped

Checked against the storyboard's transcription of the published rows (§2 table, §5,
§6, §8a) and against the pre-stylist build.

| Figure | Where | Verdict |
|---|---|---|
| 865 / 800 / 789 / 480 / 283 km | hero bar values, `sortDesc: true` | ✅ all five exact, and the authored order already matches the sorted order |
| "3,500+ at peak, ~2,800 left" | Fengyun-1C sublabel | ✅ both numerals as published. Notation normalised from "about" to "~"; no numeral changed |
| "700+ fragments, at ~800 km" | rocket-stage sublabel | ✅ figures exact; **"catalogued" dropped** (see the qualifier note below) |
| "~2,900 fragments" | 2009 sublabel | ✅ |
| "1,500+ fragments, 0.3% left" | Cosmos 1408 sublabel | ✅ ("still up" → "left", same claim) |
| "~125 fragments, nearly all gone" | Mission Shakti sublabel | ✅ |
| 3,500+ · ~2,900 · 1,500+ · 700+ · ~125 · 180+ | hero + timeline | ✅ every "+" and "~" preserved (storyboard §8h rule 2) |
| 10,074 · 39 · 7,473 · $150,000 · ~10% · 300,000+ | §6, §7 | ✅ values and units exact; comma placement kept on 10,074 and 7,473 |
| **$150,000 unconverted** | §7 tile 6 | ✅ **correct.** No bracketed ₹, no rate anywhere in the file. A 2023 penalty is historical under contract §3 rule 4 — and under the rule's own test ("this year or last" = current), 2023 is outside it whether you date from `publishedAt` 2026-04 or from today |
| 155 for / 9 against | §8 | ✅ as published (the plenary tally) |
| 0.3% still up | §4 | ✅ |
| 34 an hour | §6 `equals` | ✅ 300,000 ÷ 365 ÷ 24 = 34.2; **"at least" preserved**, which is what keeps the "+" honest. Storyboard derivation 2 |
| three lakh | §6 `equals` | ✅ derivation 1; `lakh` is L1 Indian English (contract §2), not Hindi, so no precision-layer breach |

**One small class, twice: a scope qualifier dropped.** The published `comparison` row
was "**Trackable** fragments at peak" and the storyboard wrote the 2024 sublabel as
"700+ fragments **catalogued**". Both sublabels now say only "fragments". Catalogued
pieces are a subset of actual fragments, so the unqualified form reads marginally
larger than the source. It is defensible — src-06's own headline says "more than 700
pieces of space debris" with no qualifier — and both sublabels are inside their
six-word cap with room, so restoring one word is free if you want it. ⚠️ minor,
optional.

### 6 · Your two late edits — both supported, neither overstates

**"of 2025 near-miss risk" → "of all near-miss risk in 2025".** ✅ Supported, and an
improvement. The claim is unchanged — one break-up contributed about a tenth of the
year's near-miss risk — but the base is now named. "All … in 2025" states the universe
the 10% is a share of, which is the thing Meera stopped on in both panels. It does
not overstate: "all" quantifies the denominator, not the numerator. The residual is
that the *size* of that universe is still not given, which no tile label can fix in
six words.

**Removing "A single-year jump."** ✅ Supported, and the right cut. It was a
comparative with no baseline on the page, Karthik stopped on it in both passes, and
panel 2's own fix list names exactly this move ("drop the comparative and let the
figure stand as a one-year count"). A removal cannot overstate. One consequence worth
knowing: the tile now carries **no comparison a reader can feel** — see ⚠️ BARE-NUMBER
below, where the storyboard's own sanctioned derivation (7,473 ÷ 365 ≈ 20 a day) is
the cheap replacement if you want one.

---

## Claim verification

Fifty-nine claims. **52 ✅ · 7 ⚠️ · 0 ❌.** Only the deltas and the load-bearing rows
are noted; a ✅ with no note matched the record exactly.

| Claim | Location | Status | Note |
|---|---|---|---|
| Title states ESA's finding | head · title | ✅ | Not the retired "The ‹Noun› That ‹Verb›s" |
| "Last year one company's satellites dodged 300,000 times" | head · hook | ✅ | "Last year" = 2025 against `publishedAt` 2026-04-24; matches §6 |
| "never once been cleaned up" | head · hook | ✅ | §7 zero tile, src-09 |
| "One cloud cleared. One stays past 2100." | head · dek | ✅ | The hero's two ends |
| "Low Earth orbit: the band 160 to 2,000 km up" | head · primer | ✅ | Colon before a gloss — permitted, contract §6 tell 1 |
| "Every collision there makes thousands of fragments" | head · primer | ✅ | Per collision, correctly scoped |
| "In 2025 the agency that counts them said the chain has started" | head · primer | ✅ | src-01 |
| GPS operating in LEO | head · primer | ✅ | **Removed.** Ruling 7. A correction by subtraction |
| `actually.value` 0 / `unit` new launches | §1 · data | ✅ | src-01 |
| "Even at zero new launches, the total still climbs" | §1 · actually.text | ✅ | Matches the §5 quote's own clause |
| "Thin air up there drags fragments down, but break-ups add them faster than it can" | §1 · actually.text | ✅ | src-01. 24 w against the storyboard's 20 — panel fix 3, affordable |
| "ESA, the agency that counts what is in orbit, wrote this in its 2025 report" | §1 · note | ✅ | Role phrase present (rule 9) |
| "Zero new launches, and the debris total still rises" | §1 · caption | ✅ | A data claim, correctly |
| Jan 11 2007 · Fengyun-1C · dead weather satellite at 865 km | §2 · events | ✅ | src-12, src-01 |
| Feb 10 2009 · two satellites collide | §2 · events | ✅ | Names withheld by design (§7) |
| "The first time two whole satellites ever hit each other" | §2 · annotation | ✅ | Resolves — `at` matches the event `date` exactly |
| Mar 27 2019 · Mission Shakti · 283 km · about 125 fragments | §2 · events | ✅ | |
| Nov 15 2021 · Cosmos 1408 · crew sheltered in their capsules | §2 · events | ⚠️ | Claim as published. Provenance: the crew fact is an ISS fact and §2's nearest ref is src-07 (LeoLabs). One spot-check |
| Jun 26 2024 · 6-tonne dead satellite · 180+ pieces | §2 · events | ✅ | src-08 |
| Aug 6 2024 · rocket stage · had just released a batch of new satellites | §2 · events | ✅ | src-06 |
| "About a tenth of 2025's near-miss risk came from this" | §2 · annotation | ✅ | Storyboard row 2 said "last year's"; dating it is a precision gain on an evergreen page |
| "Six break-ups. Three were deliberate tests, one a collision, two just came apart." | §2 · caption | ✅ | **Counted against its own six events: 3 + 1 + 2 = 6** |
| "Six break-ups wrote today's orbit" | §2 · title | ✅ | Six events in the graphic |
| Kessler syndrome · "Two scientists at NASA modelled it in 1978" | §3 · terms | ✅ | src-03 (Kessler & Cour-Palais, JGR 1978) |
| Collision avoidance · fuel burned dodging | §3 · terms | ✅ | Mechanism, correctly stated |
| Decay · thin air, less of it higher up | §3 · terms | ✅ | No ANALOGY-CLAIM: the mechanism matches |
| Five bar values 865 / 800 / 789 / 480 / 283 km | §4 · data.items | ✅ | See point 5 |
| Five sublabels | §4 · data.items | ⚠️ | Figures exact; "catalogued"/"trackable" dropped on two. Minor, optional |
| `highlight: true` on Mission Shakti | §4 · data.items | ✅ | Ruling 9 |
| `layout: wide`, no `refValue` | §4 | ✅ | Rulings 10 and §2 — no invented threshold line |
| "283 km. The air still reaches. Gone in two years." | §4 · annotation | ✅ | Resolves — `at` matches the item label exactly |
| "865 km. Nothing slows it. Still there after 2100." | §4 · annotation | ✅ | Resolves |
| "Five break-ups by altitude. The lowest cleared in two years. The highest clears after 2100." | §4 · caption | ✅ | Five items ✓; both ends match their bars; "clears after 2100" matches the published `Projected full decay` row |
| "Each bar is one break-up… A longer bar means higher up." | §4 · plain | ✅ | FORM only. No PLAIN-CLAIM. 92 chars of 220 |
| The 44-word ESA sentence | §5 · data.quote | ✅ | Counted: **44 words**, unellipsed. Storyboard §8g explicitly authorises buying the full version — a sanctioned departure, not drift |
| "European Space Agency · Space Environment Report 2025" | §5 · attribution | ✅ | Speaker named on the page — no orphan quotation |
| "The agency's own word for it: *runaway*" | §5 · title | ✅ | "runaway" is verbatim inside the quoted sentence |
| "not in the future tense" | §5 · intro | ✅ | The quote is a counterfactual about a present state, not a forecast |
| `followup` restatement + "What comes next is the bill" | §5 · data | ✅ | No new claim; a forward pointer, not a prediction. 30 w against the storyboard's 24 — panel fix 1 |
| 300,000 + "+" · "Starlink course changes in 2025" | §6 · data | ✅ | src-02 |
| "Starlink made more than 300,000 avoidance moves in 2025" | §6 · caption | ✅ | "more than" carries the "+" |
| "at least 34 every hour, all year long" (+ basis note) | §6 · equals | ✅ | 34.2; "at least" preserved. Derivation 2 |
| "three lakh course changes, one fleet, one year" | §6 · equals | ✅ | Derivation 1 |
| "the odds of a hit pass 3-in-10-million" | §6 · note | ⚠️ | Figure as published. The line names "FCC orbital-debris reports", which resolves to no `sources[]` entry — the only FCC entry is the 2022 rulemaking Order |
| 10,074 Starlink · as of March 20, 2026 · crossed 10,000 on March 17 | §7 · tile 1 | ✅ | src-02; both dates precede `publishedAt` |
| 0 pieces ever removed · "within 15 metres in 2024, then left" | §7 · tile 2 | ✅ | src-09. Ruling 6 |
| ~10% "of all near-miss risk in 2025" · gloss · August 2024 | §7 · tile 3 | ✅ | Your edit; base now named. Note at 15 w, exactly the gate's cap |
| 39 station dodges since 1998 · last April 30, 2025 · a 2005 fragment | §7 · tile 4 | ✅ | src-10, whose URL encodes 2025/04/30 |
| **7,473 "objects added to orbit in 2024" · "Break-ups are part of it."** | §7 · tile 5 | ⚠️ | **Point 1.** Note supported as a floor by the page's own 180+ and 700+. Label verb and the tile's source both unsettled: src-01 is not cited on this section |
| $150,000 · one operator, one satellite, 2023, only case | §7 · tile 6 | ⚠️ | Claim as published, and correctly left unconverted. Provenance: no FCC *enforcement* document is in `sources[]`; src-04 is the 2022 Order and predates the penalty |
| "Sharing low orbit · 2024 to 2026" | §7 · caption | ⚠️ | **Two of its own six tiles fall outside the window** (39 *since 1998*; the fine in *2023*). Storyboard §8a asked for the header to be "retimed to the tiles that remain" |
| "Three lakh dodges is one company's bill" | §7 · intro | ✅ | Restates §6, seams correctly |
| "Nothing has ever been removed… only one operator has ever been fined" | §8 · intro | ✅ | src-09, src-04 |
| Side A statement + detail (39 since 1998; 300,000+ in 2025) | §8 · sides | ✅ | Both figures restated from §6 and §7 without drift |
| **"Nobody is bound to stop making the junk."** | §8 · sides | ✅ | **Now matches its evidence.** Point 4 |
| "What nobody owes" | §8 · label | ✅ | Bridges pay and bound |
| December 2022 · 155 for, 9 against · China and Russia among the 9 | §8 · detail | ⚠️ | Tally and month are the 7 Dec 2022 plenary, and internally consistent. src-05's URL is a **GA/DIS** (First Committee) press release, whose vote is the 1 Nov 2022 committee vote. One spot-check |
| "India abstained, neither for nor against, and the resolution binds nobody" | §8 · detail | ✅ | India did abstain; the four added words gloss "abstained" and add no claim; the sentence ends on the instrument, not the country |

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|

Empty. Specifically swept and clean: no advocacy verb, no "should/must/deserve", no
wire tone, no rhetorical-question closer (§4's intro question is an *opener*, which
contract rule 6 allows, and it is answered in the same sentence), no passive filler,
no meta-commentary, no invented consequence. "What comes next is the bill" points at
documented costs in the next three sections, not at a prediction. Zero words from the
AI list (tell 18). Zero sentence-opening adverbs of importance (tell 21). No mirrored
close (tell 22). The one reversal is spent in the hook, as §4 of the storyboard
instructed; §1's belief-versus-data pair is the `you-think` **component's** declared
shape, not a prose reframe, so it does not spend the tell-2 ration.

**Structure.** The timeline's arc is directional (three tests → an accident → two
uncommanded break-ups, ending on `state: now`). The paradox is genuinely two-sided
and no longer two instances of one fact. The `data-readout` argues in numbers with
ten-word notes. There is no prose section to audit.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ JARGON-UNGLOSSED | §2 annotation "near-miss risk" | low | First use is unglossed; the gloss lands at §7's tile, five sections later. Both panels found it; panel 2 ruled the placement right and the residual a *different* defect (a share with no stated base). The 12-word annotation cap cannot carry both |
| ⚠️ JARGON-UNGLOSSED | §2, §4 "rocket stage" | very low | Never said what one is. Panel 2: "a beat, not a stop" |
| ⚠️ BARE-NUMBER | §7 tile 5, 7,473 | low | No comparison a reader can feel, since "A single-year jump" came out. Storyboard §8f already sanctions the replacement: 7,473 ÷ 365 ≈ **more than twenty a day** |
| ⚠️ FIELD-OVER-CAP (storyboard, not Zod) | §1 `actually.text` 24 w / 20 · §5 `followup` 30 w / 24 | very low | Both bought by panel fixes, both inside `check:prose`'s own caps (30 and no cap). Recorded so the gate's numbers are not a surprise |
| ℹ STACCATO (expected) | head · dek | none | "Two tests, two altitudes. One cloud cleared. One stays past 2100." is three sentences under eight words. `check-prose.mjs:303` scans body strings, so this may fire on the dek. **Both panels ruled: keep it.** Correct arithmetic, wrong diagnosis on a headline slot. The §4 caption has the same shape and is *not* scanned (captions are not body strings) |

**Clean, and checked explicitly:**

- **HINDI-LOAD-BEARING / HINDI-FIELD / HINDI-SPELLING / HINDI-DENSE** — zero Hindi in
  the file. No Devanagari, no italics, no lexicon word. `lakh` is L1 Indian English
  under contract §2 and is licensed in the precision layer; it is used twice, once in
  an `equals.text` and once in an intro. The skip test passes trivially (panel 1).
- **NO-INDIAN-ANCHOR** — Mission Shakti on the hero, India's abstention in the closer,
  `lakh` in §6 and §7. Three anchors, all from the record rather than imported. The
  storyboard's monsoon trap was **not** walked into: "weather satellite" appears once,
  as what Fengyun-1C was, with no Indian forecasting claim attached.
- **NAME-THROUGHPUT / NAME-UNPLACED** — **11 names in sentences**, ceiling 12: ESA,
  NASA, Kessler (inside the term), Fengyun-1C, Cosmos 1408, Mission Shakti, Starlink,
  China, Russia, India, United Nations. **None added.** FCC appears on source lines
  only, as the editor notes state. Every one carries a role phrase. Two observations,
  neither a flag: NASA is used in exactly one sentence ("Two scientists at NASA
  modelled it in 1978") and otherwise lives on source lines — defensible, since the
  gloss needs an institution; and "Kessler" is never introduced as a person, so it
  costs nothing from the ration and the two 1978 scientists stay described, which is
  what rule 9 wants.
- **ANALOGY-CLAIM** — the three glosses in §3 state the mechanisms correctly (drag
  falls with altitude; an avoidance burn spends working fuel; one crash raises the
  odds of the next). No analogy misstates anything.
- **HOOK-ABSTRACT / TITLE-FORMULA** — hook is 19 words with a number, a "you" and the
  twist; title states the finding and does not match `/^The .+ That /i`.
- **TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC / HEAD-HEAVY / ISSUE-LONG** — 5 of 8
  visual (62.5%, floor 60%); text-only at 3, 5, 8, never adjacent; section 1 is
  `you-think`, outside `TEXT_ONLY`, so `firstVisual === 0`; **79 words before the
  first graphic against a cap of 80** (title 8 + dek 11 + hook 19 + primer 35 = 73,
  plus eyebrow 2 + title 4, and `check-prose.mjs:253–258` breaks there because §1 is
  visual) — **one word of margin, so do not touch the head**; ~968 reader-facing words
  of 1,100 per the stylist and panel 2.
- **STORYBOARD-DRIFT** — none. Kinds, order, hero, `layout: wide`, `sortDesc`,
  `highlight`, all four annotations and the six-tile set match §2/§3/§8a exactly. Two
  departures, both licensed: the unellipsed 44-word quote (§8g names it as the first
  thing to buy) and §8's widened `sourceRefs` (your ruling, named in point 4 of the
  brief). Both are recorded in the draft's own editor notes.
- **QUESTION-UNANSWERED** — all three storyboard §6 questions are answerable from the
  draft alone; both panels record all four readers answering all three correctly.
- **PLAIN-CLAIM / CAPTION-FORM / REDUNDANT-HOWTO** — one authored `plain` (§4), pure
  form. Five captions, all data claims; the `data-readout` header is a scope label,
  which is that kind's caption convention, and its only problem is the date range.
  **No `howToRead` anywhere, and that is correct:** I checked `NEEDS_HOW` in
  `src/lib/explainers.ts` — none of `you-think`, `timeline`, `jargon-buster`,
  `benchmark-chart`, `quote`, `number-sense`, `data-readout`, `paradox` is in it, so
  under RG-19 no default renders and none should be authored.

**Source balance.** Primary anchor present: eight of twelve sources are `primary`,
including ESA's own report, the 1978 paper, the UNGA record, US Space Command and
NASA. No ⚠️ NO PRIMARY ANCHOR. No ⚠️ FALSE BALANCE — the settled physics (drag falls
with altitude) is stated flat, with no contrary opinion balanced against it. No
⚠️ SINGLE-VIEWPOINT — the one contested question (whether anyone is obliged to stop)
is carried by the vote itself plus an analysis source (src-11), and the section states
the positions of three states rather than reading one.

**Quotability.** One verbatim quote, from ESA's own published report (src-01, a
primary, public, official document), 44 words, speaker named. No GUIDE-ONLY chunk is
involved — the quote is inherited from the published issue and no RAG retrieval backs
it. No ❌ NON-QUOTABLE SOURCE.

---

## Does every authored field actually render?

Checked in the build output rather than assumed (this is the check that has silently
failed before — an authored `caption` that reaches no reader).

| Field | Render site | Verdict |
|---|---|---|
| §2 `caption` (timeline) | `core/Section.astro` → `.px-section__claim` | ✅ present in the built HTML. `Timeline.astro` has no caption slot; the 2026-09-13 fix covers it |
| §1, §4, §6, §7 `caption` | the component's own card (`.px-viz__cap` / `.tel__cap`), with Section's copy hidden by `dataviz-v2.css:240` `:has()` | ✅ exactly one visible caption per section |
| §2 annotations ×2 | `Timeline.astro` — exact string match on the event `date` | ✅ both `at` values match; both render |
| §4 annotations ×2 | `BenchmarkChart.astro` — exact string match on the item `label`, a miss being a silent no-op | ✅ both `at` values match, middle dot and spacing included; both render |
| §4 `plain`, every `source` | `core/Section.astro` → `.px-plain` / `.px-plain__src` | ✅ `Source ·` emitted on every section |
| `highlight`, `sublabel`, `sortDesc` | `BenchmarkChart` `Item` interface | ✅ all three are real fields, not catalog fiction |

---

## Removal audit (the NUMBER-DRIFT list, reconstructed)

`check:prose` will report ❌ NUMBER-DRIFT because the file is `published` and numerals
left. I could not diff, so this is reconstructed from the storyboard's §8a cut table
and the draft's own notes. **Every removal I can account for is a mandated cut, and
nothing surviving leans on one.**

| Removed | Mandated by | Anything depend on it? |
|---|---|---|
| `orbital-shells` `density` 2, 11, 6, 9, 5 and its band altitudes | Ruling 1 | No. It was the section's only quantitative encoding and the section declared it editorial — **removing it is a trace improvement, not a lost fact** |
| ClearSpace-1's 2013, August 2023, 2028 | Ruling 5 | No. Backed by no `sources[]` entry in the first place, so these numerals could never have passed a trace |
| The `comparison`'s dropped rows (the surviving-pieces count, the 2025–2026 decay window) | Ruling 3 | No. "nearly all gone" and "0.3% left" carry the same claims qualitatively, and the caption carries both ends of the decay range |
| The GPS claim (not a numeral) | Ruling 7 | No. It was false |
| `readTimeMinutes` 7 → 4 | §8a | No |

**Read the gate's list against this table before acting on it.** The one thing I
cannot rule on is a numeral the storyboard never mentioned; if `check:prose` names a
figure that is not in the table above, that one needs a look.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | n/a | `published`, correct for an in-place Phase 6 rewrite — the URL must not move. Operator-ruled; not a defect |
| All section kinds registered | ✅ | All eight in `SECTION_KINDS` |
| No author field | ✅ | Absent |
| publishedAt valid | ✅ | 2026-04-24, unchanged, with `id`, `topic`, `tags` |
| Source URLs https:// | ✅ | Twelve of twelve; zero `http://` |
| Source kinds valid | ✅ | 8 primary · 2 secondary · 2 analysis |
| ≥6 sources | ✅ | Twelve, all still referenced, zero orphans (src-01 ×5, 02 ×3, 03 ×1, 04 ×3, 05 ×1, 06 ×3, 07 ×2, 08 ×1, 09 ×2, 10 ×2, 11 ×1, 12 ×2) |
| Zod bounds | ✅ | primer ~193 chars (80–420) · `plain` 92 (≤220) · no `howToRead` · `layout: wide` valid · no `skimCaption` · every `sourceRefs` resolves |
| Em-dashes / semicolons | ✅ | **Exactly one em-dash in the whole file**, in src-12's bibliographic `title`, which is the cited page's own wording. Zero semicolons, zero en-dashes |

---

## Required fixes before publish

1. **§7 tile 5 — settle 7,473 against src-01.** Confirm (a) what the ESA Space
   Environment Report 2025 actually counts and (b) the noun it uses. If it is a
   catalogue-additions figure, keep "Break-ups are part of it." and match the label to
   the report's wording ("added to the catalogue" and "added to orbit" are different
   claims). If it is objects *launched*, **cut the note** — break-ups cannot be part of
   a launch count. Either way, **add `src-01` to §7's `sourceRefs` and name ESA on the
   section's `source` line**: as it stands the only annual population figure in the
   issue is cited to five sources that cannot carry one.
2. **§7 `caption` — retime or drop the date range.** "Sharing low orbit · 2024 to
   2026" sits over a tile dated *since 1998* and a fine from *2023*. Storyboard §8a
   asked for the header to be retimed to the tiles that remain and it was not. Cheapest
   honest forms: drop the range, or "Sharing low orbit · as of 2026".
3. **Fix the stale paragraph in the editor notes** before this commits. "Left for the
   operator, not fixed" says side B's label "still reads 'What nobody pays'" — the file
   reads **"What nobody owes"** — and says §8's `sourceRefs` are "src-02, 05, 10 and
   11" when the file carries **src-02, 04, 05, 09, 10, 11**, closing the gap the
   paragraph describes. Panel 2 flagged both. A future reader will otherwise re-open
   two settled items.

**Four inherited provenance spot-checks — one page-read each, none is a wrong fact,
none was introduced by this rewrite.** Each is a claim the published issue made that
no entry in the twelve can obviously carry. They do not block, because the operator's
stated trace target is the published record and all four are in it — but they are the
next ClearSpace-1 if anyone audits the bibliography:

- **$150,000 (§7 tile 6, §8 intro).** The only FCC entry is src-04, the 2022
  rulemaking Order (FCC 22-74). A 2022 document cannot report a 2023 penalty. Closing
  it means adding the FCC's 2023 enforcement document to `sources[]` — a bibliography
  addition, and therefore your call, exactly as ruling 5 was.
- **The 155-to-9 vote (§8).** The month and tally the draft states are the
  **7 December 2022 plenary**. src-05's URL is a **GA/DIS** press release — the First
  Committee, which voted on 1 November 2022 with a different tally. India abstained and
  China and Russia voted against in both, so the substance survives either way; only the
  numerals and the month are exposed.
- **"FCC orbital-debris reports" (§6, §7 source lines).** Names a class of document —
  the operator's own semiannual filings — that resolves to no `sources[]` entry. This is
  the same shape as the "CelesTrak catalog" line the storyboard caught and cut with the
  `comparison`.
- **"The crew on the space station sheltered in their capsules" (§2).** An ISS fact
  whose nearest ref in §2 is src-07 (LeoLabs' break-up analysis).

---

## Optional improvements

1. **Give 7,473 a comparison** if the label survives fix 1: "more than twenty a day"
   (7,473 ÷ 365 = 20.5) is already sanctioned by storyboard §8f, is a *rate* rather than
   a baseline, and so answers Karthik's objection without implying the previous year the
   issue never shows. Fits the 15-word note cap.
2. **Extend §8's `source` line** to name the four refs it does not — the storyboard's
   own line carried "and the FCC order", and rule 9 says the source line is exactly
   where a stacked citation belongs.
3. **Restore one dropped qualifier** on a hero sublabel ("700+ fragments **catalogued**"
   or "3,500+ **trackable** at peak"). Both sublabels are inside the six-word cap with
   room.
4. **Leave these alone**, and both panels agree: the dek (its STACCATO flag is correct
   arithmetic on a headline slot), the paradox title (the most repeatable six words in
   the issue, and its seam resolves inside its own section), the two hero annotations,
   and the head (79 of 80).

---

## The India question, since you asked it directly

**Fair in both directions, and I looked at the graphic as well as the words.**

- The physics credit is explicit and factual: "Fired deliberately low, at 283 km",
  "~125 fragments, nearly all gone", and the annotation "283 km. The air still reaches.
  Gone in two years." No admiring adjective anywhere.
- The political fact arrives four sections later with no editorial verb, and the
  sentence ends on the instrument rather than the country: "India abstained, neither
  for nor against, and the resolution binds nobody." The abstention is stated exactly
  as the record has it, and the four added words gloss "abstained" rather than
  characterising it. India is explicitly separated from the nine who voted against.
- `highlight: true` on the shortest bar is ruling 9, and its justification — the
  counter-example is what makes the chart argue rather than rank — holds.
- **One asymmetry, inherited, that I checked rather than assumed.** In the timeline,
  Mission Shakti carries `state: default` while Fengyun-1C and Cosmos 1408 carry `fail`
  and `key`. Storyboard §8a says every `state` value carries over unchanged, so this is
  the published encoding. I read the CSS: `.tl__row[data-state]` drives **dot style
  only** — hollow-muted, hollow-accent, filled-accent, filled-with-halo. There is no
  legend, no colour semantics, and `fail` is also worn by the 2009 accident and both
  uncommanded 2024 break-ups, so it reads as *emphasis on the high-consequence events*,
  not as blame. Under that reading, the lowest-consequence event taking the quietest dot
  is consistent. And the hero pushes the other way, giving India's bar the only
  highlight. Nothing here a reader can decode as approval or as a charge.
