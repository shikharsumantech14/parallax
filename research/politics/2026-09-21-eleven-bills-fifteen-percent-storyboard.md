# Storyboard: Eleven bills passed. None went to a committee.

- **Category:** politics
- **Dossier:** research/politics/2026-09-17-eleven-bills-fifteen-percent-dossier.md
- **Composed:** 2026-09-21
- **Composer:** composer-agent
- **Status:** approved            ← draft | approved | hold  (the gate; see below)

> Created under `docs/REGISTER-PLAN.md` §5.2; RG-07 ruled 2026-09-13. Written
> after the dossier and before the draft. It maps every point the reader must
> get to the component that shows it, chosen from all twelve data shapes in
> `docs/design/catalog-shapes.md`, and fixes how many words may sit around
> each one. The drafter executes it; the verifier checks the draft matched it.
>
> **FRESH ISSUE, not a rewrite.** No published sections to port, no number
> ledger, no `story:` beat remap. The exposure is the mirror one
> (`.claude/agent-memory/composer/rewrite-runs.md`): every graphic here is
> **new copy**, so the graphics are where an invented number would enter. Two
> rows carry derived values, and both are named as operator rulings in §8.
>
> **The gate.** `GATES.storyboard` in `scripts/pipeline.config.ts`:
> `'required'` means the drafter runs only on `Status: approved`.

---

## 1. The argument in one line

Passing a bill costs a vote. Examining one costs time. The side that owns the
clock is not the side that wants the examination.

## 2. The hero

**`bill-funnel`** (G7 · process, stage attrition) · row 2 · `layout: default`.
**New to the publication.**

The hero is the only component whose *form* is the thesis. A funnel is read as
attrition, so the reader arrives expecting the bars to shorten at passage. They
do not. Three stages sit flat at eleven and twelve, and the drop comes at the
last stage, the one that costs time rather than votes. The white space to the
right of the fourth bar is the issue.

Renders dossier §4.5(A): 12 introduced · 11 reached a Lok Sabha vote · 11
passed both Houses · 2 debated in the Lok Sabha by anyone but the minister
(PRS legislation tracker for 1–3; Newslaundry 20 Aug 2026 for 4, derived
11 − 9).

**It may not take `layout: split`.** The catalog is explicit: `bill-funnel`
"pairs with `default`; never `split`". CANON §2 says the hero *should* take
split; the kind's own constraint wins, so **this issue ships with no `split`
section at all.** Flagged for the operator in §8 rather than quietly ignored.

Rejected as hero: `margin-bullets` is marked **not hero-capable** in the
catalog. `benchmark-chart` is hero-capable but draws the long decline, which is
context for the argument rather than the argument.

## 3. The beats

Nine rows. Three acts. Reading order below.

| # | The reader must get (one line, register) | Shape | Kind | Hero? | Words (cap) | Analogy / worked example | Plain-line sketch | Dossier rows |
|---|---|---|---|---|---|---|---|---|
| 1 | A House that shouted and walked out still passed eleven of the twelve bills in front of it | G2 | `you-think` | | **85** | The count itself is the concrete thing. No analogy needed | EXPLAIN default — **do not author** (checked in `explainers.ts`: accurate for this use) | §4.1 (15%, 12 introduced, 11 passed) |
| 2 | Nothing was lost at the stages that cost a vote. Everything was lost at the one that costs time | G7 | **`bill-funnel`** *(NEW)* | **HERO** | **140** | "Four checks on a line. Three of them passed everything through. The fourth was barely switched on." Gloss *committee* inline here, in one clause | EXPLAIN default — **do not author** (politics-native, verified accurate) | §4.5(A) |
| 3 | Three procedure words, so the rest of the issue reads without stopping | G1 | `jargon-buster` | | **100** | — (narrative kind; no plain line, no caption row) | — | §9 jargon rows; §4.3 |
| 4 | Four separate measures of the same session. Every one of them falls short of its own mark | G3 | **`margin-bullets`** *(NEW)* | | **175** | **Exam marks against passing marks.** Each subject has its own passing mark, so you compare a mark to its own line and never to another subject's | **AUTHORED — required.** The default says "one row per *subsystem*… decibels and kilograms", written for the space desk and wrong here | §4.5(B), §4.4 |
| 5 | One real bill, four days, and a blank where the examination should be | G7 | `bill-passage` | | **105** | The concrete instance of row 2's fourth bar. One named bill, four dates, one empty card | EXPLAIN default — **do not author** (verified accurate) | §4.5(D) |
| 6 | Why losing time removes examination and leaves output untouched | G1 | `three-steps` | | **95** | "One of the two jobs needs the calendar. The other only needs the room." | — (narrative kind) | §4.3 (Art. 85, who decides), §1 |
| 7 | This is not one bad session. Referral has been falling for three Houses | G5 | `benchmark-chart` | | **125** | "Two in three bills went to a committee under the 15th Lok Sabha. Now it is about one in six." | **AUTHORED — required.** The default promises "a reference line" this chart does not have and calls the values "scores" | §4.2, §4.5(C) |
| 8 | The man who ran the Lok Sabha secretariat says the timing is the government's to choose | G1 | `quote` | | **70** ◀ slack | — | — | §5 (Achary) |
| 9 | The session adjourned in August and has not been closed. A House kept alive can be recalled | G4 | `timeline` | | **125** | 32 days against a manual that records two to ten | EXPLAIN default — **do not author** | §3, §4.3 |

**Acts and rhythm.** Act 1 = rows 1–3 (the surface and the vocabulary) ·
Act 2 = rows 4–6 (the measurements and the mechanism) · Act 3 = rows 7–9 (the
long series and the calendar). Each act carries a quiet section (3, 6, 8).
**No `act-break` rows are spent** — none of the ten published issues uses one
and it is still on the never-published ledger; spending two rows on dividers
would cost the word budget more than the rhythm gains.

**Loud sections: effectively zero.** No WebGL kind, no `bleed`, no full-width
animation. `bill-passage` (CSS-3D) is the single louder row and it sits in act
2 with a quiet row on each side. CANON §2's ceiling of three is not approached.

**Layouts.** Row 7 `wide`; rows 6 and 8 `breath`; everything else `default`.
No `split` (see §2), no `bleed`.

**Rhetorical jobs** (contract §7). CONVERSATIONAL EXPLAINER on rows 1, 3, 4, 6,
7 — five of nine, clearing the "at least half" floor. INVESTIGATION on row 2
(the anomaly as a graphic first: *look at the fourth bar*). FORENSIC on row 5.
CALM-STRUCTURAL on rows 8 and 9. **Four jobs. Zero SATIRICAL — the contract
sets it to zero on the politics desk, and this dossier's sharpest material is
an opposition allegation, which is exactly what the ban exists for.** Zero
LYRICAL.

### The word budget

| Row | Kind | Cap |
|---|---|---|
| head | title 8 · dek 8 · hook 23 · primer 27 | **66** |
| 1 | `you-think` | 85 |
| 2 | `bill-funnel` | 140 |
| 3 | `jargon-buster` | 100 |
| 4 | `margin-bullets` | 175 |
| 5 | `bill-passage` | 105 |
| 6 | `three-steps` | 95 |
| 7 | `benchmark-chart` | 125 |
| 8 | `quote` | 70 |
| 9 | `timeline` | 125 |
| | **Total** | **1,086** |

Against the 1,100 ceiling, so **14 words of headroom**. These caps count every
`eyebrow`, section `title`, `intro`, `caption`, `plain`, `howToRead`, data
`label`, `note` and `source` label — `readerWords` sweeps all of them, and a
budget built from intros alone under-reads by about 15 words a section.

**Row 8 (`quote`) is the designated slack row.** If a row overruns, the
Achary quote's follow-up sentence pays first. The quotation itself is fixed
cost (45 words verbatim plus attribution) and the composer may not trim it.

**Four rows ride the EXPLAIN default for `plain` and author none** (rows 1, 2,
5, 9). The default strings were read in `src/lib/explainers.ts`, not inferred
from the catalog's PLAIN line, and all four are accurate for this use. That is
roughly 100 words of budget the issue does not spend. **Rows 4 and 7 must
author a `plain`** — both are cross-world kinds whose defaults are written for
another desk and are factually wrong here.

**Instrument `howToRead` on rows 2 and 4** (both are VizCard instruments). The
static reading leads and the control clause trails it — the control is
`html.js`-gated and the paragraph is not, so a no-JS reader must reach a
complete sentence before any clause about a button.

**Words before the first graphic: 74 of 80.** Head 66 + row 1's eyebrow (2) +
row 1's title (≤ 6). **Row 1 carries no `intro`.** The gate adds each section's
eyebrow, title and intro and only breaks *after* the first non-text-only
section, so row 1's chrome is inside the count even though `you-think` is
visual. Its card text is not.

`readTimeMinutes: 4`.

### Per-row data and copy

**Row 1 · `you-think` · eyebrow THE ASSUMPTION · no intro**
- `think`: *"A House that shouts, walks out and adjourns within minutes of
  opening cannot be passing laws."* (16 words)
- `actually`: value **11**, unit *of 12 bills*, text *"It passed eleven of the
  twelve bills before it, and nine cleared the Lok Sabha with only the minister
  speaking."* (20)
- `note`: *"The House worked 15% of its scheduled time while it did this."* (12)
- `caption`: *"The Lok Sabha worked 15% of its scheduled time and passed eleven
  of the twelve bills before it."*
- `source`: PRS, Monsoon Session 2026 vital stats and legislation tracker.

**Row 2 · `bill-funnel` · HERO · eyebrow WHERE THE EXAMINATION WENT**
`unit: Bills`. Four stages, counts monotonically non-increasing (the build
fails otherwise, and fails below four stages).

| # | label | count | note |
|---|---|---|---|
| 1 | Introduced in the session | 12 | |
| 2 | Reached a vote in the Lok Sabha | 11 | The twelfth went to a committee instead |
| 3 | Passed by both Houses | 11 | |
| 4 | Debated in the Lok Sabha by anyone but the minister | 2 | Nine passed with only the minister speaking |

- `caption`: *"Twelve bills entered the session and eleven passed both Houses.
  Two were debated in the Lok Sabha by anyone other than the minister."*
- `source`: PRS legislation tracker (stages 1–3) · Newslaundry, 20 Aug 2026
  (stage 4, derived 11 − 9).
- **Take the four-stage version. Do not author the five-stage variant.** The
  dossier offers a fifth row ("Given more than five minutes of Lok Sabha time —
  4", derived 11 − 7). A funnel asserts that each stage is a subset of the one
  above, and that every bill with a non-minister speaker also took more than
  five minutes is *likely but not sourced*. The five-minute figure lives in the
  row 4 `margin-bullets` intro instead, where it makes no subset claim.
- The intro glosses *committee* inline in one clause, because the word appears
  in stage 2's note before the jargon card reaches it (contract rule 2).

**Row 3 · `jargon-buster` · eyebrow THREE WORDS · three terms**
1. **Prorogue** — *"The formal end of a session. Until it happens the House is
   still technically in session, even if nobody is sitting."*
2. **Adjourned sine die** — *"The House stops sitting with no date fixed to
   return. A pause, not an ending."*
3. **Question Hour** — *"The first hour of every sitting, set aside for MPs to
   put questions to ministers."*

**No Hindi gloss on any row.** Politics carries the fewest Hindi words
(contract §2) and a definition card sits next to the precision layer. The
`hindi?` field stays empty.

*Standing committee* is deliberately **not** a fourth term: it is glossed
inline in row 2 where it first appears, and a fourth row costs ~25 words the
budget does not have.

**Row 4 · `margin-bullets` · eyebrow FOUR MEASURES, FOUR MARKS**
Four rows, four different units (the kind exists for units that do not
compare). Build fails on a missing `unit`, on `0 < required <= max` or
`0 <= value <= max` breaking, or outside 4–8 rows. All four check out.

| label | value | required | max | unit | note |
|---|---|---|---|---|---|
| Lok Sabha working time, Monsoon 2026 | 15 | 100 | 100 | % of scheduled time | Across the session, about nine minutes in every scheduled hour |
| Question Hour in the Lok Sabha | 0.6 | 60 | 60 | minutes of the scheduled hour | Across the session, about 36 seconds in every scheduled hour |
| Bills passed after committee scrutiny | 0 | 8 | 11 | of the 11 bills passed | 8 is what the 15th Lok Sabha's referral rate would have sent. A comparison, not a rule |
| Lok Sabha sittings a year, 17th Lok Sabha | 55 | 120 | 135 | sittings a year | 120 is the recommended minimum. 135 was the first Lok Sabha's average |

- `plain` (**authored**): *"Each row is one measurement on its own scale,
  because a percentage and a count of sittings do not compare. The bar is what
  it got and the tick is the mark it is measured against."* (~180 chars, inside
  the 220 cap, no semicolon.)
- `howToRead` (**authored, instrument rule**): the exam-marks reading first
  (compare every bar to the tick on its own line, never to another row),
  then the control clause about pressing a row for its signed margin.
- `caption`: *"All four measures fall short of the mark they are held to.
  Question Hour falls furthest."*
- `source` line must carry **both derivations**: 1% of a 60-minute hour = 0.6
  minutes; 71% of 11 bills ≈ 8. Plus PRS vital stats, PRS legislation tracker,
  PRS "In a rush to pass bills", PRS Functioning of the 17th Lok Sabha, PRS
  "Parliament needs to find its voice".
- **Rows 1 and 2 are session-wide percentages, never a per-day stopwatch.**
  The note wording above ("Across the session, about…") is mandatory. Do not
  write "36 seconds a day".
- The component's default selection lands on the worst relative shortfall,
  which is Question Hour. That is the right default here.

**Row 5 · `bill-passage` · eyebrow FOUR DAYS, ONE LAW · the MMDR Amendment Bill, 2026**

| label | status | date | note |
|---|---|---|---|
| Introduced | passed | 10 Aug 2026 | |
| Sent to a committee | failed | — | Not referred. No committee examined this bill |
| Passed by the Lok Sabha | passed | 12 Aug 2026 | Five minutes of debate |
| Passed by the Rajya Sabha | passed | 13 Aug 2026 | Forty minutes of debate |
| President's assent | pending | — | Not confirmed as of publication |

- `caption`: *"The MMDR Amendment Bill cleared both Houses in four days with
  forty-five minutes of debate and no committee stage. Assent was not confirmed
  as of publication."*
- `source`: PRS legislation tracker (dates) · Newslaundry (minutes).
- **Keep the assent row `pending`.** It is [UNVERIFIED] (dossier §9.1) and
  keeping it does real work: it shows the reader that *passed* is not the same
  as *became law*, which is the distinction the whole issue must hold. The
  drafter writes "passed", never "became law", unless it verifies assent on
  `indiacode.nic.in` (T0, on the allowlist).
- **Do not substitute the MSME Bill.** Three minutes is the sharper number but
  PRS records Rajya Sabha passage *before* Lok Sabha passage, so its House of
  introduction is unconfirmed and a stage sequence cannot be authored.
  The three-minute figure appears in prose only, with no sequence around it.
- The `failed` status on the committee row is a semantic compromise. See §8,
  ruling 2.

**Row 6 · `three-steps` · eyebrow WHO OWNS THE CLOCK**
1. **Passing costs a vote** — *"A bill needs a majority in the room. On the days
   the House sat, the majority was in the room."*
2. **Examining costs time** — *"A committee takes weeks. Weeks come out of a
   calendar, and the calendar is not the House's to set."*
3. **So the clock decides** — *"Losing time removes the stage that needs time
   and leaves alone the stage that does not."*

This is the one sanctioned place for a Hindi word: *matlab* may open step 3's
restatement, once, if it reads naturally. Delete it and the English still says
everything. If it wrinkles, drop it and the issue runs at L1 throughout.

**Row 7 · `benchmark-chart` · eyebrow THE LONG DECLINE · `layout: wide`**
`unit`: *% of bills introduced that went to a committee* · `maxValue`: 100 ·
no `refValue`.

| label | value | sublabel | highlight |
|---|---|---|---|
| 14th Lok Sabha (2004–09) | 60 | | |
| 15th Lok Sabha (2009–14) | 71 | The high-water mark | |
| 16th Lok Sabha (2014–19) | 25 | | |
| 17th Lok Sabha (2019–24) | 16 | Fewest of the last four | true |

- `annotations`: one, `at: "16th Lok Sabha (2014–19)"`, text *"Referral falls
  by two-thirds after 2014"* (6 words).
- `plain` (**authored**): *"Each bar is one Lok Sabha, and its length is the
  share of bills that were sent to a committee."*
- `caption`: *"Committee referral fell from 71% of bills introduced in the 15th
  Lok Sabha to 16% in the 17th."*
- `source`: PRS "In a rush to pass bills" (14th/15th/16th) · PRS Functioning of
  the 17th Lok Sabha (17th). **The line must state the denominator: bills
  *introduced*, one denominator across all four bars.**
- **Author `sortDesc: false` for chronological order and verify the component
  honours it before shipping.** The argument is temporal and the annotation
  names a year. Fallback if the component ignores it: value order (71, 60, 25,
  16) still tells the truth and the annotation still reads, because it
  references 2014 rather than a bar position.
- **The 18th Lok Sabha gets no bar.** Only counts exist (3 · 7 · 2 bills by
  year), no sourced percentage. Do not compute one and draw it.
- Use **25** for the 16th, not 26. The 26% figure is measured against bills
  *passed* and would mix denominators.

**Row 8 · `quote` · eyebrow THE PREROGATIVE · `layout: breath`**
P.D.T. Achary, verbatim, 14 September 2026, The Wire:

> "The prorogation of the House of parliament is the prerogative of the
> government which decides when the Houses should be prorogued or whether the
> Houses should be prorogued or not. The usual practice is to prorogue the
> Houses within a week's time."

One follow-up sentence only, and it is the first thing cut if the issue runs
long. **Do not use the second Achary quotation** ("It is unusual…
predetermined") — The Wire's rendering trails into an ellipsis and closing the
sentence for him is not available.

**Row 9 · `timeline` · eyebrow THE SESSION THAT WILL NOT CLOSE · five events**

| date | label | note | state |
|---|---|---|---|
| 17 Apr 2026 | The 131st Amendment Bill is negatived | It needed a two-thirds majority and did not get one | default |
| 20 Jul 2026 | The Monsoon Session opens | Nineteen sittings scheduled, running to 13 August | default |
| 24 Jul 2026 | The Lok Sabha adjourns within minutes of opening | The Speaker asks the opposition not to create an impasse | default |
| 13 Aug 2026 | Both Houses adjourn sine die | The eleventh bill has passed. Nothing has gone to a committee | key |
| 14 Sep 2026 | Thirty-two days on, neither House is prorogued | The session is technically still alive | now |

- `annotations`: one, `at: "14 Sep 2026"`, text *"The manual records two to ten
  days, not thirty-two"* (9 words).
- `caption`: *"The session adjourned on 13 August 2026 and had still not been
  prorogued when this issue went out."*
- `source`: PRS session alert and legislation tracker · ThePrint, 24 Jul 2026 ·
  The Wire, 14 Sep 2026.
- **The 24 July node does not name the Speaker.** "The Speaker" does the work
  and a name used once is a tell (contract §6.11).
- **The 17 April node does not re-explain delimitation.** That issue is told in
  `2026-04-24-delimitation`. This node is one dated fact: a bill needing
  two-thirds was defeated. It does not assert any link to the prorogation
  delay. See §8, ruling 3.
- Notes ≤ 20 words each. No rupee bracket anywhere in a dated timeline event
  (contract §3 rule 4) — there is no money in this issue in any case.

**Row 9 carries a hard publication-date dependency.** Dossier §9.2: the
prorogation count is The Wire's as of 14 September 2026. **Re-check before
publishing.** If the House has been prorogued in the interval, the last node
becomes the prorogation date, the annotation becomes the gap in days, and the
caption changes. The figure is dated explicitly ("as of…") either way. The
argument survives a prorogation: a session held open for thirty-two days and
then closed still shows the calendar being used.

## 4. The head

- **Title (8 words):** *Eleven bills passed. None went to a committee.*
- **Hook (23 words):** *Your MP's House sat 15% of its scheduled time. It still
  passed eleven of twelve bills. Nine had no speaker but the minister.*
- **Dek (8 words):** *The government owns the clock. Examination needs time.*
- **Primer (27 words, ~156 chars):** *Parliament sat nineteen days this monsoon.
  The laws you live under were passed in a House open fifteen percent of the
  time. See where the examination went.*

**Constraints on the head the drafter may not relax:**

- **The hook's first sentence must not be shortened below eight words.**
  Lengths run 9 / 7 / 7. Trim the first and three consecutive sentences fall
  under eight words, which fires STACCATO.
- **Numerals per sentence stay at two.** The hook runs 1 / 2 / 1; the primer
  runs 1 / 1 / 0. NUMBER-DENSE fires at three in one sentence.
- **The title's "None" means the eleven that passed, and nothing wider.**
  Dossier §9.3: PRS and Newslaundry conflict on whether anything was referred
  during the session, and both sources support only the narrow claim. **The
  drafter must never write "no bill was referred"** — the twelfth was. The
  qualifier is discharged on the same screen by the hero's stage-2 note ("The
  twelfth went to a committee instead"); that note is therefore not optional.
- The title does not use "The ‹Noun› That ‹Verb›s". The dek does not reverse,
  because the hook already does (one reversal per issue).
- No em-dash, no semicolon, no colon as a drum-roll anywhere in the head.

## 5. The Indian ground

The subject is entirely Indian, so the register's Indian-ground requirement is
met by the material. **No rupee bracket appears anywhere in this issue**:
dossier §4.7 confirms there is no foreign currency in the record at all, and
contract §3 rule 4 asks for a bracket only beside a current foreign-currency
figure. The only foreign numbers available (UK ~150 sitting days a year, US
~140) are counts of days, and neither is used — see §8.

The Indian ground the issue does stand on, each with the dossier row:

| What the reader owns | How it appears | Dossier |
|---|---|---|
| Their own MP, and the House that MP sits in | The hook's "Your MP's House" | structural |
| 15% made feelable | "About nine minutes in every scheduled hour" (19 × 0.15 ≈ 2.9 sitting days of actual work out of nineteen) | §4.4 |
| 1% made feelable | "About 36 seconds in every scheduled hour" | §4.4 |
| 16% made feelable | "About one in six bills" against "two in three" under the 15th Lok Sabha | §4.2 |
| 55 sittings a year made feelable | Against the 120 a constitutional review panel recommended, which is 46% of it | §4.4 |
| A named law the reader can look up | The MMDR Amendment Bill, 2026, with its four dates | §4.5(D) |

**The exam-marks analogy (row 4) is the issue's one load-bearing everyday
picture**, and it is chosen because it is universally Indian and because it
carries the component's own semantics: each subject has its own passing mark,
so you read a mark against its own line and never against another subject's.
That is precisely what `margin-bullets` does and why its bars share no axis.

## 6. The three questions

Written from the dossier. The reader panel answers these from the draft alone.

1. **Q:** In the Monsoon Session of 2026, how much of its scheduled time did the
   Lok Sabha work, and how many bills passed?
   **A:** It worked 15% of its scheduled time, and eleven of the twelve bills
   before it passed both Houses. · dossier §4.1 (PRS vital stats; PRS
   legislation tracker)
2. **Q:** How many of those eleven bills had been examined by a parliamentary
   committee before they passed?
   **A:** None. The only bill of the twelve sent to a committee, the Indian
   Statistical Institute Bill, is the one that did not pass. · dossier §4.1
   (PRS legislation tracker, "Committee Referral: No" against all eleven)
3. **Q:** Who decides when Parliament meets, whether a bill goes to a committee,
   and when a session formally ends?
   **A:** The government. The President summons and prorogues on the Cabinet's
   advice under Article 85, and referral is the government's call. So a collapse
   of time does not slow legislation down. It removes the one stage of lawmaking
   that time protects. · dossier §4.3 (Articles 85 and 123; The Wire 2017 on the
   Cabinet Committee on Parliamentary Affairs; Achary)

Question 3 is the issue. If the panel cannot answer it, rows 6 and 8 are the
sections to look at, not the head.

## 7. Names

Four named people and bodies, well under the twelve-name ration. On a procedure
issue that is a feature: the argument is about offices, not individuals.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **PRS Legislative Research** | the non-partisan outfit that has published Parliament's own vital statistics for twenty years | source lines throughout; once in body copy |
| **P.D.T. Achary** | who ran the Lok Sabha secretariat as its Secretary General and now explains its procedure for a living | row 8, the quote |
| **The National Commission to Review the Working of the Constitution** | the panel that in 2002 recommended a floor of 120 sitting days | row 4, the fourth row's tick |
| **Vinod Bhanu** *(optional)* | who runs the Centre for Legislative Research and Advocacy and counts what Parliament does with its bills | row 2 only, and only if the drafter needs to attribute the nine-bills count in body text |

Two named instruments (not people, but they spend the same reader memory):
**the Indian Statistical Institute Bill, 2026** (row 2's stage-2 note) and
**the MMDR Amendment Bill, 2026** (row 5).

**Described, never named:** the Speaker (row 9), the Home Minister, every
opposition MP quoted in the dossier. Om Birla, Jairam Ramesh, Sagarika Ghose,
Mallikarjun Kharge and Ronojoy Sen are each in the dossier and each would be
used once, which is tell 11. Prefer "the Speaker", "the Congress chief whip in
the Rajya Sabha". Contract rule 9 also bars stacking a citation into a
sentence: the source line carries the outlet and the author.

## 8. Composer notes

### Rulings the operator should make before the draft

**Ruling 1 — `margin-bullets` row 3 draws a derived comparison as a
requirement.** The component's semantics are "the tick is what it needs". Rows
1, 2 and 4 have honest requirements: the schedule, the scheduled hour, and a
constitutional review panel's recommended floor. **Row 3's `required: 8` is
not a requirement.** No rule obliges any referral at all; 8 is 71% of 11,
derived from the 15th Lok Sabha's rate, and the dossier itself instructs that
it "must be labelled as a comparison, never as a rule".

- **Recommended:** keep the row. It carries the issue's central fact, the note
  says "A comparison, not a rule" in the row itself, and the derivation goes on
  the source line. The tick reads as "what the previous norm would have sent".
- **Fallback if the operator refuses a derived tick:** replace row 3 with
  *Rajya Sabha working time, Monsoon 2026 · value 33 · required 100 · max 100 ·
  % of scheduled time* (PRS vital stats, fully sourced, honest requirement).
  The zero-referral fact then rests entirely on the hero funnel and the title,
  where it already sits. Cost: the row shares a unit with row 1, which weakens
  the kind's own rationale, and the issue loses its clearest single picture of
  zero scrutiny.

Rows 2 and 3 both carry derived numbers either way, and both derivations must
be printed on the section's source line. That is the one place this fresh issue
puts arithmetic on a page.

**Ruling 2 — `bill-passage` has no "skipped" status.** The enum is
`passed | failed | pending | current`. The committee stage on the MMDR Bill was
not failed, it was never entered. `failed` is the nearest available state and
renders as the stall. The note "Not referred. No committee examined this bill"
is what carries the meaning, and it is mandatory. If the operator reads
`failed` as implying a committee rejected the bill, the alternative is to drop
the row — which removes the only place a reader *sees* the missing stage on a
real bill, and leaves row 2's aggregate to carry it alone. Recommend keeping
it with the note.

**Ruling 3 — the motive allegation is composed out, deliberately.** The
dossier's most quotable material is Jairam Ramesh's "kept on ventilator …
super-tainted two-thirds majority" and Sagarika Ghose's "devious", both
attributing the prorogation delay to an attempt to assemble a two-thirds
majority for a revived delimitation bill. **No row carries either.** Reasons,
in order of weight:

1. Dossier §9.6 is explicit that Swarajya's 15 July report corroborates the
   *effort* to court NCP support, not the *reason for the delay*, and that no
   government explanation is on record in any source found. An issue that
   quotes the allegation must print the government's silence beside it, which
   costs ~60 words this budget does not have.
2. The contract sets SATIRICAL EXPOSURE to zero on the politics desk and says
   restraint is the safer register on sensitive material. A motive claim with
   no answering voice reads as advocacy (contract rule 15).
3. The Ghose line is reported speech, not continuous quotation, and cannot be
   reconstructed.

The issue is stronger without it: Article 123 and the Achary quote establish
what an unprorogued session *makes possible* without anyone having to allege
what it is *for*. If the operator wants the allegation, it needs its own row
(~80 words, attributed in the same sentence, with the absence of a government
reply stated) and something else must be cut — row 5 is the cheapest.

**Ruling 4 — the hero takes no `split`.** CANON §2 says the hero visual "is the
only section that may use `layout: split` and it should". `bill-funnel`'s
catalog entry says "pairs with `default`; never `split`". The kind's own
constraint wins, so this issue has no `split` section. If the operator wants a
split hero, the only hero-capable alternative the data supports is
`benchmark-chart`, and that moves the issue's centre from *this session* to
*the twenty-year decline*, which is a different issue.

**Ruling 5 — the trim lever, if the drafter cannot hold 1,086.** Cut row 5
(`bill-passage`, 105 words). The result is an eight-row spine that still clears
every floor: 4 of 8 drawn graphics (50%), 4 distinct graphic kinds, 2 new
kinds, 3 plain-language cards, 5 of 8 visual (62.5%), and no two text-only rows
adjacent. It costs the issue its one concrete named bill, which is contract
rule 3's "every abstraction gets a concrete thing". Recommend cutting words
inside rows before cutting the row.

### Kinds considered and rejected

| Kind | Why it was wanted | Why it is not available |
|---|---|---|
| `power-flow` **(new)** | The ideal hero. Hours scheduled flowing into legislative business, Question Hour, other business and time lost to disruption would draw the whole argument in one mark | **PRS published only percentages for this session, not hours.** The page states no hours worked, no hours lost and no legislative-business split. The kind needs a value on every band. **One fetch would unblock it**: a Lok Sabha Secretariat session-productivity return giving scheduled and actual hours by category. That is a research job, not a composition failure |
| `approval-chart` **(new)** | The candidate suggested it for the referral series, and it is a politics signature | The component hard-codes its legend as "Approve · now N%" / "Disapprove · now N%" and prints an `approve / disapprove` caption chip (`ApprovalChart.astro`, lines 114 and 156–157). A referral series would ship under a false legend. `benchmark-chart` takes the series instead |
| `attrition-waffle` **(new)** | "Bills that survived scrutiny, countable" is the instinct, and countability is exactly the honest move here | Needs a rate out of **exactly 100** with 3–6 groups. The 46 analysed bills of the 18th Lok Sabha split into two sourced groups (29 under an hour, 17 not); the session's 12 bills cannot be normalised to 100 without inventing groups, and the build throws on a bad sum |
| `state-timeline` **(new)** | The candidate suggested it for the session | Its window is `{fromHour, toHour}` inside one continuous window with no gaps, 3–8 lanes, 2–3 states. A session running across three weeks is not that shape. `timeline` takes the calendar |
| `vote-result` **(new)** | The 131st Amendment Bill was negatived on a division needing two-thirds, which is the kind's exact subject | The dossier records that it was negatived but carries no `for` / `against` / `required` counts. Drawing a majority line without the numbers invents the section's subject. The defeat stays as one dated timeline node |
| `number-sense` | "36 seconds of the scheduled hour" is a textbook `number-sense` row, and the dossier's §7 proposed it | **The card cap.** `you-think`, `jargon-buster` and `three-steps` already put the issue at three plain-language cards, which is the ceiling; a fourth fires CARD-HEAVY. The 36-second conversion sits in `margin-bullets` row 2's note, which is where its requirement tick already lives |
| `data-readout` | Three or four headline numbers as tiles is the obvious opener | It is a card, not a drawn graphic, and it would spend a row the graphics floor needs. Its figures are already distributed across rows 1, 2 and 4 |
| `comparison` | UK ~150 and US ~140 sitting days a year against India's 55 is a real and striking row | Two of the three figures are 15-year averages from a 2017 piece and the third is a 2019–24 average, so the row compares different windows. The international figures also pull the issue towards "India's Parliament sits too little", which is a *different* argument from the one the dossier makes. Left out entirely |
| `paradox` | "The House did not work" / "the House legislated" looks like two facts pulling opposite ways | They are the same fact read twice, which is `you-think`'s USE WHEN, not `paradox`'s. Row 1 takes it, at a third of the words, and the one-`paradox` ration stays unspent |
| `bill-breakdown` | What the eleven bills actually contain | The dossier carries no provisions for any of them. The issue is about examination, not contents |

### The tension the issue must not hide

Dossier §9, last note. **The 17th Lok Sabha *functioned* at 88% of its
scheduled time and still referred only 16% of bills.** So 15% is not the
*cause* of weak examination, it is the most visible instance of it. Row 7's
long series is where this lands: the decline runs through Houses that sat
perfectly well. **The drafter must not write "the House did not work, therefore
bills were not examined"** — that is a causal claim the issue's own chart
contradicts. The correct connective, and it is row 6's job: output and
examination are separate systems, and only one of them is protected by time.

### Tells this material will attract

- **The rhythmic triplet (tell 20).** Legislative procedure genuinely comes in
  threes, and "summon, refer, prorogue" will write itself. Let the `three-steps`
  cards and the `jargon-buster` rows carry the enumeration — cards are not prose
  and the tell does not apply to them. In the intros, join two clauses with
  *and* and leave the third to the card.
- **"Not X, it's Y" (tells 2 and 19).** This argument is a reversal, so the
  shape will surface repeatedly. The once-per-issue ration is spent in **row 1's
  `you-think`** and nowhere else. It may not appear in the title, the hook, the
  dek or any section intro.
- **NO-RESTATEMENT / NO-ANALOGY** fire on `prose` sections only, and this spine
  has zero `prose` rows, so neither can fire. The restatement duty still holds
  under contract rule 5: the intro of rows 3, 5, 7 and 9 each opens by saying,
  in the reader's words, what the graphic above it showed.
- **`NUMBER-DENSE` scores only body keys** (`note`, `text`, `detail`, `lead`,
  `paragraphs`, `followup`, `statement`, `kicker`, `headline`). `label`,
  `sublabel`, `caption`, `plain`, `source` and `annotations[].text` are not
  sentence-scored, which is why the row-4 unit strings can carry figures the
  notes cannot.
- One em-dash is permitted in the whole issue and this storyboard does not
  spend it. Zero semicolons in any prose, caption or note.

### Sourcing

The dossier's §8 spread already clears the floors: **16 sources · 9 publishers ·
5 tiers · top publisher 37.5%** (PRS, 6 of 16). The drafter carries the
bibliography across as-is. Two entries must not appear in `sources[]`: the EPW
article (paywalled, metadata only, nothing in the issue rests on it) and
anything from OpIndia (§9.5 — HTTP 403, unfetchable, and its figures conflict
with PRS's). Do not use 19% or 39% for productivity.

### Research notes left behind

1. **One fetch would buy the issue a better hero.** A Lok Sabha Secretariat
   session-productivity return giving *hours* scheduled and lost by category
   would unblock `power-flow`, which is the right shape for this argument and
   would replace both row 2 and row 4. PRS publishes percentages only.
2. **`sansad.in` yielded nothing** (§6) and the prorogation status is not
   exposed there, so row 9's live fact rests on The Wire. Worth an allowlist
   note: the House's own site is on the allowlist and is not usable for session
   state.
3. **The Hindu, Indian Express, Mint and BBC are on the allowlist and block the
   crawler** (§9). Three searches were rejected. That is why the centre cluster
   is carried by ThePrint and ORF, and it will recur on every politics issue
   until someone changes the fetch path.
4. **The RAG corpus carries no 2024–2026 parliamentary session data.** Two runs
   in a row flagged it (discovery 2026-09-16, research 2026-09-17). An operator
   signal, not noise.

## 9. Kind ledger

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `you-think` | 1 | No — plain-language card | No (published in all ten issues) |
| `bill-funnel` | 2 | **Yes** | **Yes** — on the ledger, unclaimed by any storyboard in the round |
| `jargon-buster` | 3 | No — plain-language card (`TEXT_ONLY`) | No |
| `margin-bullets` | 4 | **Yes** | **Yes** — on the ledger, unclaimed by any storyboard in the round |
| `bill-passage` | 5 | **Yes** | No — reached readers in `2026-05-02-transgender-ratchet` |
| `three-steps` | 6 | No — plain-language card (`TEXT_ONLY`) | No |
| `benchmark-chart` | 7 | **Yes** | No |
| `quote` | 8 | No — `TEXT_ONLY` | No |
| `timeline` | 9 | **Yes** | No |

- **Drawn graphics:** **5 of 9 (56%)**, floor 40% ✓ · distinct graphic kinds:
  **5** (`bill-funnel`, `margin-bullets`, `bill-passage`, `benchmark-chart`,
  `timeline`), floor 3 ✓
- **Plain-language cards** (you-think · number-sense · jargon-buster ·
  three-steps): **3**, cap 3 ✓, one of each ✓, no repeats ✓. `number-sense` is
  deliberately unspent — see §8.
- **New kinds:** **2**, floor 2 ✓
  - **`bill-funnel`** fills G7, process and stage attrition: a population of
    bills counted at each procedural stage, where the attrition between stages
    is the argument. This dossier is that shape exactly, and §4.5(A) captures
    the four counts against a named source.
  - **`margin-bullets`** fills G3, measurements each against their own
    threshold in units that do not compare: a percentage of scheduled time,
    minutes of an hour, a count of bills, sittings a year. §4.5(B) captures
    value, required, max and unit for all four rows.
  - Both are checked against the ledger in `docs/generated/PROJECT-GRAPH.md`
    ("Never in a published issue", 76 of 101) **and** against every storyboard
    in the round. `bill-funnel` and `margin-bullets` were each *considered and
    rejected* by a sibling storyboard (transgender-ratchet and
    amazon-tipping-point / asteroid-2024-yr4 respectively) but **claimed by
    none**, so both count as new.
  - `bill-funnel` is the issue's own desk signature and takes the hero slot;
    `margin-bullets` is the cross-world kind, borrowed from space, and is the
    one that needs an authored `plain` because of it.

### The other floors, checked here

| Floor | This spine | Pass |
|---|---|---|
| ≥ 6 in 10 sections visual (not `TEXT_ONLY`) | 6 of 9 (67%) | ✓ |
| Never two text-only rows adjacent | text-only at 3, 6, 8 | ✓ |
| First section visual (`NO-LEAD-GRAPHIC`) | row 1 `you-think` is not `TEXT_ONLY` | ✓ |
| ≤ 3 `prose` sections | 0 | ✓ |
| ≤ 1 `paradox` | 0 | ✓ |
| ≥ 1 kind outside the six workhorses | 6 of 9 rows | ✓ |
| ≤ 1,100 reader-facing words | 1,086 budgeted | ✓ |
| ≤ 80 words before the first graphic | 74 | ✓ |
| ≤ 12 names | 4 people and bodies, 2 bill titles | ✓ |
| One hero | `bill-funnel`, row 2 | ✓ |
| ≤ 3 loud sections | 0 WebGL, 0 `bleed`; 1 CSS-3D row | ✓ |
| No two WebGL kinds adjacent | no WebGL at all | ✓ |
| ≤ 1 `bleed` per act | 0 | ✓ |
| `timeline` ≤ 6 events | 5 | ✓ |
| 6–12 sections | 9 | ✓ |
| ≥ 8 sources from ≥ 5 publishers, none above 40% | 16 · 9 · 37.5% | ✓ |
