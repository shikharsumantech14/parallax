# Storyboard: Cutting the forest lowers the heat it survives

- **Category:** earth
- **Dossier:** `research/earth/2026-06-04-amazon-tipping-point-dossier.md`
- **Rewrites:** `src/content/issues/2026-06-04-amazon-tipping-point/index.mdx`
  (published; slug, `id`, `publishedAt`, `tags`, `status` and all **eight**
  `sources[]` entries unchanged)
- **Verification report:** `research/earth/2026-06-04-amazon-tipping-point-verification.md`
  (verdict NEEDS REVISION — one required fix, two optional; §8c says how each
  is resolved)
- **Composed:** 2026-09-15
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-15; rulings settled in §8c

> Created under `docs/REGISTER-PLAN.md` §5.2; RG-07 ruled 2026-09-13: a
> separate composer agent, and the gate is a switch. The storyboard is written
> after the dossier and before the draft. It maps every point the reader must
> get to the component that shows it, chosen from all twelve data shapes in
> `docs/design/catalog-shapes.md`, and fixes how many words may sit around each
> one. The drafter executes it the way it executes the dossier; the verifier
> checks the draft matched it.
>
> **The gate.** `GATES.storyboard` in `scripts/pipeline.config.ts` is the one
> switch, read by both routes (the API CLI and the `/pipeline-draft` command):
> - `'required'`: the drafter runs only when this file says `Status: approved`.
> - `'auto'`: the drafter also runs on `Status: draft`.
> - `Status: hold` parks the issue in either mode.

> **REWRITE — Phase 6 (REGISTER-PLAN §8.1), the last pair.** The four measured
> defects this rewrite exists to fix:
>
> 1. **1,827 reader-facing words in 7 sections**, against a 1,100 ceiling. The
>    longest issue in the backlist.
> 2. **2 of 7 sections visual (29%)**, against a 60% floor — **the worst visual
>    share in the whole backlist**. The spine is `prose` → `comparison` →
>    `data-readout` → `paradox` → `timeline` → `quote` → `prose`, and `prose`,
>    `comparison`, `paradox` and `quote` are all in `TEXT_ONLY` in
>    `scripts/check-prose.mjs`. **Five of seven rows carry no graphic**, and the
>    issue opens on prose and closes on prose.
> 3. **639 words before the first graphic**, against a ceiling of 80. The
>    counter runs until it meets a visual kind, so the whole opening `prose`
>    section — lead, three paragraphs and a 63-word `skimCaption` — plus the
>    `comparison`'s intro and every one of its cells is inside the count.
> 4. **26 names**, against a ration of 12, and **no Indian anchor anywhere**:
>    no ₹, no lakh or crore, no Indian place, institution or habit.
>
> **This rewrite cannot be done by swapping prose for the plain-language kinds.**
> `jargon-buster` and `three-steps` are in `TEXT_ONLY` too. Visual share is won
> by **re-kinding the `comparison` into a chart and the `data-readout` into a
> dial**, and by finding a drawable home for the closing argument. §3 shows the
> arithmetic.
>
> **Rewrite rules in force.** No fact, number, name or source is added: every
> claim below is already in that file. Arithmetic on the issue's own numbers is
> listed in §5 as a derivation, with its basis, for the operator to rule on.
> Numbers are **copied, never retyped** (rule 13). `readTimeMinutes` 7 → 4.
> `status: published` and `publishedAt: 2026-06-04` unchanged.
>
> **Two hazards this file does not have.** The published issue carries **no
> `story:` block**, so there are no 0-based `story.beats[].section` indices to
> remap. And **no published section here draws an invented value** — I audited
> all seven against the operator's 2026-09-14 standard and found nothing like
> `orbital-shells`'s editorial `density`. The exposure in this rewrite runs the
> other way: it is the two **new** graphics that must draw a number out of a
> published *range*, and §8c.2 puts that rule to you before it is drawn.

---

## 1. The argument in one line

The Amazon can take four degrees of heat. It cannot take four degrees and the
saw, and the saw is the dial one government moves in one budget.

*(28 words. Dossier §1, restated at L1.)*

## 2. The hero

**`benchmark-chart`** · shape **G5** (entities ranked on one metric as
horizontal bars) · row 2 · `layout: wide` · **re-kinded from the published
`comparison`**.

It carries the argument because the argument **is** the gap between two
numbers. Six rows of prose cells become two bars on one axis — degrees of
global warming the forest survives — and the short bar is the one that applies
if the cutting continues. Nothing else in the issue states the inversion
without words.

| Bar | `value` | `sublabel` | Published in |
|---|---|---|---|
| **If the cutting stops** | `3.7` | "3.7–4°C, with clearing held at today's level" | `comparison` rows 1, 2, 4 · `data-readout` · `prose` 1 |
| **If the cutting goes on** | `1.5` | "1.5–1.9°C, once 22–28% of the forest is cleared" | `comparison` rows 1, 2 · `data-readout` tiles 2, 3 |

`unit: "°C"` · `sortDesc: true` (the tall bar reads first, so the short one
lands as the finding) · `highlight: true` on **If the cutting goes on**.

**The drawing rule, applied to both bars and stated on the page:** each bar is
drawn at the **low end of its published band**, and the band itself is written
in the `sublabel`, the `caption` and the `plain` line. 1.5 and 3.7, never 1.7
and 3.85. A midpoint would be a number nobody published; the low end is a
number both reporters carry, and using it for both bars makes the ratio
conservative rather than flattering. **Operator ruling 2 in §8c.**

**No `refValue`.** 1.5 is both the bottom of the tipping band and the warming
the world reaches around 2030, so a reference line would land exactly on the
end of bar 2 and read as a rendering bug. The two `annotations[]` say it
instead. (The alternative is costed in §8c.3.)

**Not `layout: split`.** CANON §2 reserves `split` for the hero and this is the
hero, so it is available. A two-bar chart is short, and `split` wants a column
of prose beside a held graphic — roughly 120 words this issue spends on rows 3
and 4 instead. `wide` is right. Every other row is `default`.

**Not the hero, and why:** the `throughput-dial` (row 4) is the more striking
graphic and answers *how close are we*. The argument is *which dial*, and that
is a comparison of two thresholds, not one reading.

## 3. The beats

Eight rows. The first row after the head is a graphic. No two text-only rows
adjacent. Six in ten visual is the floor; this spine runs 62.5%.

*For this rewrite the last column cites the published issue's own section and
`sources[]` id beside the dossier §4 row.*

| # | The reader must get (one line, register) | Shape | Kind | Hero? | Words | Analogy / example | Plain-line sketch | The row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | You were told to watch the thermostat. On heat alone this forest holds to 3.7–4°C. | G2 · belief vs one figure | `you-think` **[new]** | — | **88** · `eyebrow` ≤ 2 w · `title` ≤ 3 w · **no `intro`** (all three sit inside the 80-word count) · `think.label` ≤ 3 · `think.text` ≤ 16 · `actually.label` ≤ 4 · `actually.value` "3.7–4" + `unit` "°C" (both free, `SKIP_KEYS`) · `actually.text` ≤ 19 · `note` ≤ 14 · `caption` ≤ 13 · `source` ≤ 8 | the two dials on one machine, named here, drawn in row 2 | omit — `EXPLAIN['you-think'].what` fits exactly | published `prose` 1 para 2 + `comparison` rows 1, 4, 6 · dossier §4 *The two thresholds* · src-01, src-02 |
| 2 | Same forest, two breaking points, and the difference is how much of it gets cut. | G5 · ranked on one metric | `benchmark-chart` **[re-kinded from `comparison`]** | **HERO** · `layout: wide` | **118** · intro ≤ 20 · 2 labels ≤ 5 · 2 sublabels ≤ 7 · **2 annotations** ≤ 9 · `caption` ≤ 14 · **authored `plain`** ≤ 19 · `source` ≤ 10 | — (the bars are the comparison) | "Each bar is how much global warming the forest survives. A longer bar means more heat before it tips." | published `comparison`, all six rows · dossier §4 *The two thresholds*, *Scale of the collapse* · src-01, src-02 |
| 3 | The forest makes up to half its own rain, so cutting here kills trees that were never cut. | G1 · narrative, in order | `three-steps` **[re-kinded from `paradox`]** | — | **118** · intro ≤ 28 · 3 `title` ≤ 4 · 3 `text` ≤ 24 (59 total) · `source` ≤ 10 | **the monsoon, half of it only** — wet air comes off the sea and moves inland; in the Amazon the forest is what keeps that air wet (§5, ruling 4) | none (narrative kind) | published `paradox`, both details · dossier §4 *The mechanism* · src-01, src-07 |
| 4 | Roughly 17 to 18% is already cleared. The band where it tips opens at 22%. | G3 · one number against a threshold | `throughput-dial` **[new]** | — | **105** · intro ≤ 19 · `label` ≤ 3 · `unit` "%" free · 1 zone `label` ≤ 4 · `caption` ≤ 13 · **authored `plain`** ≤ 19 · **authored `howToRead`** ≤ 27 · `source` ≤ 10 | — (the arc does it) | "The filled arc is how much of the forest has been cleared. The marked band is where the study puts the tipping point." | published `data-readout` tiles 1, 2 · dossier §4 *Current state of the dial* · src-01, src-02, src-04 |
| 5 | Eight years of sharpening science, and one year when the cutting actually fell. | G4 · dated sequence | `timeline` **[carried, 7 → 6 events, notes halved]** | — | **180** · intro ≤ 20 · 6 `date` verbatim · 6 labels ≤ 5 · 6 notes ≤ 14 · **2 annotations** ≤ 10 · `caption` ≤ 12 · `source` ≤ 8 | — | omit — the catalog default fits and `timeline` is not in `NEEDS_HOW` | published `timeline`, six of seven events · dossier §3 · src-01, 02, 03, 04, 06, 08 |
| 6 | The dial moves both ways. The people who count it refuse to call one year safety. | G1 · narrative | `quote` **[carried verbatim]** | — | **78** · intro ≤ 19 · quote **9 w verbatim** · `attribution` ≤ 11 · `followup` ≤ 24 · `source` ≤ 4 | — | none (narrative kind) | published `quote`, text unchanged · dossier §5 *Goldman*, *Brando* · src-05, src-04 |
| 7 | 5,796 km² in a year, nearly four times Delhi, and that was the good year. | G3 · one number made physical | `number-sense` **[new]** | — | **92** · intro ≤ 16 · `value` "5,796" + `unit` "km²" free · `label` ≤ 6 · 2 `equals` ≤ 10 + `note` ≤ 6 each · `note` ≤ 14 · `caption` ≤ 9 · `source` ≤ 8 | **Delhi** — the clearing said in an area the reader walks around (§5, ruling 3) | omit — `EXPLAIN['number-sense'].what` fits | published `data-readout` tile 5 + `timeline` Jul 2025 + `prose` 2 para 1 · dossier §4 *Brazil clearing trajectory* · src-06 |
| 8 | A degree takes every nation a century. A hectare takes one line in one budget. | G1 · narrative | `prose` **[carried, halved]** | — | **148** · `lead` ≤ 22 · 2 paragraphs ≤ 45 · `skimCaption` ≤ 25 · eyebrow + title ≤ 6 | "think of the two dials on the same machine" — **required**, see §8h.3 | none (narrative kind) | published `prose` 2, all three paragraphs · dossier §1, §5 *Nobre* · src-01, src-05, src-06 |

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before the
first graphic. Every cap above is tighter than its ceiling on purpose.

**Head:** 72 words (title 8 · dek 11 · hook 21 · primer 32).

**Total budgeted, the way the gate counts it: ~999 reader-facing words**
against the 1,100 ceiling — the 927 of row caps above plus the 72-word head.
`readerWords` in `scripts/check-prose.mjs` sweeps `eyebrow`, `title`,
`caption`, `plain`, `howToRead` and `source` as well as the body fields, so all
of those are already inside each row's number. `value` and `unit` are in
`SKIP_KEYS` and cost nothing, which is why rows 1, 4 and 7 are cheap for what
they show. Published today: **1,827**. This is a **45% cut with every sourced
number kept**, and it leaves **~101 words of headroom** — the most any Phase 6
spine has had, because the issue's argument is short and its published length
was carried by prose.

**Words before the first graphic: 77.** Ceiling 80. **Read the arithmetic
before editing the head.** The gate counts head (title + dek + hook + primer)
**plus row 1's `eyebrow`, `title` and `intro`**, and only stops *after* the
first visual section (`check-prose.mjs`, the `before` loop):

| | Words |
|---|---|
| title 8 · dek 11 · hook 21 · primer 32 | **72** |
| row 1 `eyebrow` — **cap 2 words** | 2 |
| row 1 `title` — **cap 3 words** | 3 |
| row 1 `intro` — **none, deliberately** | 0 |
| | **77** |

Published today: **639**. Every word added to the head comes out of row 1's
title, and the other way round.

**Floors and ceilings, checked before writing.**

| Rule | This storyboard |
|---|---|
| ≥ 6 in 10 sections visual | **5 of 8 = 62.5%** (rows 1, 2, 4, 5, 7). Published: 2 of 7 = 29% |
| Never two text-only adjacent | text-only at 3, 6, 8 — the spine runs **V V T V V T V T** |
| First section after the head is a graphic | row 1 `you-think`, a VizCard kind outside `TEXT_ONLY`; `firstVisual === 0`, so `NO-LEAD-GRAPHIC` does not fire (operator ruling, delimitation 4, 2026-09-13) |
| ≤ 80 words before the first graphic | 77 |
| ≤ 1,100 reader-facing words | ~999 |
| ≤ 3 `prose`, each ≤ 200 words | one, budgeted 148 including its `skimCaption` |
| ≤ 1 `paradox` | **zero** — the published one is re-kinded (§8a) |
| ≥ 1 kind outside the six workhorses | **four**: `you-think`, `three-steps`, `throughput-dial`, `number-sense`. Three of the four have never appeared in a published issue, and `throughput-dial` has never been published at all |
| `timeline` ≤ 6 events, notes ≤ 20 words | 6 events (down from 7), notes ≤ 14 |
| One hero | `benchmark-chart`, row 2 |
| ≤ 3 loud · never two WebGL adjacent · quiet after loud | **zero loud**: no WebGL, no `bleed`, no `split`. One `wide`, on the hero |
| Every chart with a finding carries a callout | hero 2, `timeline` 2 (the only two kinds in this spine with the slot) |
| ≤ 12 names | **nine** (§7), down from 26 |
| Sections within CANON §3's 6–12 | 8 |
| Reading gate shows ≥ 1 graphic free | rows 1 and 2 are both graphics |

**The visual-share arithmetic, since it is the whole job.** The gate's
`TEXT_ONLY` set is `act-break, prose, quote, analogy, beat-sheet, plate,
comparison, paradox, jargon-buster, three-steps`. Four of the published
issue's seven kinds are in it. Two moves do the work:

- `comparison` → `benchmark-chart`: **−1 text row, +1 visual row** (a two-row
  swing on a seven-row spine).
- `paradox` → `three-steps`: neutral on the count (both text-only) but it frees
  the one-`paradox` ration and halves the words.
- the published `data-readout` is **cut as a section** and its six tiles are
  redistributed, which pays for `throughput-dial` and `number-sense` — two
  visual rows where there was one.

Net: 2 visual of 7 becomes 5 visual of 8. **A ninth row is not available**:
six visual of nine (66.7%) would need a sixth drawable beat, and the record has
five. Adding a text row instead takes the spine to 5 of 9 = 55.6% and fails
outright.

**Annotations** (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`). Two kinds
here carry the slot. Four callouts, all ≤ 12 words:

| Row | `at` | `text` | Why it is the finding |
|---|---|---|---|
| 2 | `"If the cutting stops"` | **"No realistic path this century reaches this much heat."** (9 w) | The tall bar looks alarming until this says it is unreachable. Without it the chart reads as two dangers instead of one |
| 2 | `"If the cutting goes on"` | **"The world reaches this band around 2030."** (7 w) | The short bar is not a forecast for 2100. It is four years away, said on the mark |
| 5 | `"Jul 2025"` | **"The dial moved the right way, with no new treaty."** (10 w) | The issue's one piece of good news, on the date that carries it |
| 5 | `"7 May 2026"` | **"The first study to turn both dials, not one."** (9 w) | What was new about the paper, on the pivot event |

`you-think`, `throughput-dial`, `number-sense`, `three-steps`, `quote` and
`prose` are not in the eight annotation-enabled kinds, so their finding rides
the section title and the caption.

**`plain` / `howToRead`, resolved per row.** No kind in this spine is in
`NEEDS_HOW` (`src/lib/explainers.ts`), so **no default panel renders anywhere**
and the only `howToRead` in the issue is the one authored on row 4. Two rows
must author a `plain`, and for the same reason in both cases — **the per-kind
default describes a different graphic**:

| Row | Kind | `plain` | Why |
|---|---|---|---|
| 1 | `you-think` | default | `EXPLAIN['you-think'].what` is exact |
| 2 | `benchmark-chart` | **author** | the default ends "…the reference line the mark to beat", and this chart deliberately has none |
| 4 | `throughput-dial` | **author** | the default reads "A speedometer for how many requests a system handles each second, against its maximum capacity" — a tech string for a forest. **Do not ship the default here** |
| 5 | `timeline` | default | correct as written |
| 7 | `number-sense` | default | correct as written |
| 3, 6, 8 | narrative kinds | none | no `plain`, no panel |

**Rhetorical jobs (three of the eight, `_voice-core.md` §7).**
CONVERSATIONAL EXPLAINER carries rows 1, 2, 3, 4 and 7 — **five of eight, over
the half the contract requires** · INVESTIGATION takes row 5, where the dated
evidence is assembled · CALM-STRUCTURAL takes rows 6 and 8, naming the
structural cost with the connective written. **Zero SATIRICAL EXPOSURE** (the
temptation is Brazil's finance gap, and it is not in the published file at all
— see §8d). **Zero LYRICAL**: row 8's last sentence is a landing already, and a
lyrical turn on top of a policy fact reads as decoration.

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **"Cutting the forest lowers the heat it survives"** (8 words)
  - Retires **"The Forest Has a Dial, and It *Isn't* Temperature"**. It does not
    trip `TITLE-FORMULA` (`/^The .+ That /i`), but it names the subject and
    withholds the finding (rule 11), and its "it isn't X" is the issue's
    reversal spent in the one place that cannot carry the evidence beside it.
  - Alternate for the operator: *"The Amazon's limit falls from 4°C to 1.5°C"*
    (8) — carries both numbers, but asks the reader to hold two thresholds
    before anything has explained either. My recommendation is the first.
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"You have been told to watch 1.5°C. Leave this forest alone and it survives 4°C. Keep cutting and 1.5°C is enough."** (21 words)
  - Published hook: 30 words, no "you", no number.
  - Sentence lengths 7 / 8 / 6 — deliberately not three under eight in a row,
    which would fire `STACCATO`. **Do not shorten the middle sentence.**
- **Dek (≤ 14 words):**
  **"Two dials, two breaking points. The world watches the slower one."** (11 words)
  - Retires "Two dials, two thresholds — and the world watches the wrong one"
    (an em-dash, and "wrong one" spends a reversal the hook already implies).
    "Slower" is the sourced claim: a degree of warming takes every nation and
    decades; clearing moves in a year.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"The Amazon makes up to half of its own rain. Cut it and the forest downwind dries, so the study below measures two breaking points, not one. They sit more than two degrees apart."**
  (32 words, ~184 characters — inside the 80–420 bound. Published primer: 66
  words.) Carries "so", which keeps `NO-CONNECTIVE` quiet.
- **No Hindi in the head, and none in the issue** — see §5.

## 5. The Indian ground

**The dossier and the published issue carry no Indian fact.** This is a
Brazilian forest reported by Mongabay and Carbon Brief; §3, §4, §5 and §6 of
the dossier contain no Indian place, institution, figure or study, and the
published issue trips `NO-INDIAN-ANCHOR` today. A rewrite adds no sources, so
the ground has to be built from the issue's own numbers plus a habit the reader
already owns. Both candidates are listed below with **what is sourced and what
is a habit**, and both need a ruling.

| Ground | Sourced, or a habit? | Basis | Ruling |
|---|---|---|---|
| **"Nearly four times the area of Delhi"** on the 5,796 km² cleared in 2025 (row 7, `equals[0]`) | the 5,796 km² is **sourced** (src-06, published tile 5). Delhi's area is **an outside constant**, not a claim from this record | 5,796 ÷ 1,483 = 3.9. The `equals[].note` states the basis: "Delhi is about 1,480 km²", so the verifier can check it | **Yes — ruling 3.** Exactly the shape the operator allowed on el-niño (ruling 3, 2026-09-13: the Arctic tile against India's land area, basis in the note) |
| **The monsoon, as half an analogy** (row 3 intro): "You already know the first half of this from the monsoon. Wet air comes off the sea and moves inland. In the Amazon, the forest itself keeps that air wet." | the monsoon clause is **a habit**, and it asserts only the direction every reader learned in school. The recycling half is **sourced** (src-01, src-07) and is attributed to the Amazon, never to India | no new fact, no new source | **Yes — ruling 4**, with the guard below |
| **Degrees, hectares and km²** need no conversion | — | the reader already counts in these | No |
| **No currency anywhere** | the published issue carries no `$` figure at all, so contract §3 rule 4 has nothing to convert | — | No |

**The guard on the monsoon, and it is the kessler warning in earth clothes.**
The obvious move here is "cutting the Amazon changes the Indian monsoon".
**Do not write it.** It is a real and contested scientific claim, it is in
neither the dossier nor the published issue, and a rewrite adds no sources. The
analogy above is safe precisely because it borrows only the direction of travel
(sea → inland) and puts the recycling back in the Amazon in the same breath.
If the operator is not comfortable with even that, cut the first sentence of
row 3's intro and the issue's Indian ground rests on Delhi alone, which still
satisfies the anchor.

**If both are refused, the issue carries no Indian ground at all** and
`NO-INDIAN-ANCHOR` fires exactly as it does today. There is no third option
inside the rewrite rules: raising it further needs one sourced Indian fact,
which is a research job.

**No Hindi, deliberately.** Every candidate word here sits next to a number, a
threshold or a unit, and the contract's precision test keeps Hindi out of all
three. The earth desk also spent its one licensed word two days ago on the
el-niño rewrite (*jhoola*, in the dek), and repeating the device on the same
desk inside a week is a tic rather than a register. If the operator wants one
anyway, the only field in this spine that passes all four tests is row 3's
intro, and the choice should be the operator's, not the drafter's.

**Derivations** (arithmetic or a selection rule on the issue's own numbers — no
new fact, no new source, listed so the operator can rule):

1. **"more than two degrees apart"** = 3.7 − 1.5 = 2.2 and 4 − 1.9 = 2.1.
   Already published and already verified (verification report, claim 7).
   Primer and hero `caption`.
2. **"four to five points of forest"** = 22 − 18 = 4 and 22 − 17 = 5. Dossier
   §4 states it as arithmetic and forbids presenting it as a paper figure.
   Row 4 `caption`.
3. **"Nearly four times the area of Delhi"** = 5,796 ÷ 1,483 = 3.9, with the
   constant in the `equals[].note`. Row 7. **Adds the numeral 1,480 to the
   file** (§8f).
4. **The bar-drawing rule** (row 2): each bar at the **low end** of its
   published band, the band in the `sublabel`. Not arithmetic, a selection
   rule, applied to both bars and stated in the `plain` line.
5. **The dial value** (row 4): **17**, the figure **both** allowlisted
   reporters carry ("around 17%", Carbon Brief; "roughly 17–18%", Mongabay).
   The upper 18 lives in the authored `howToRead`. Drawing the needle at 17 is
   also the conservative choice — it puts the reader further from the band, not
   closer.
6. **"nearly four times"**, not "3.9 times" — the ratio is rounded down in
   words because the numerator is a single year's tally and the denominator is
   a round-numbered constant.

**Offered and NOT recommended.** "5,796 km² is about 16 km² a day" (5,796 ÷ 365
= 15.9) is arithmetic on the issue's own number and it lands. It is also a
daily rate the record never claims, over a year whose clearing is seasonal and
fire-driven. Do not write it.

## 6. The three questions

What the issue must teach. Written from the dossier and the published record,
not from any draft; the reader panel answers them from the draft alone. If the
draft cannot teach these, the draft is wrong.

1. **Q:** The study gives the same forest two tipping points. What are they,
   and what decides which one applies?
   · **A:** With clearing held where it is today, the Amazon holds until
   3.7–4°C of global warming, which no realistic path reaches this century. If
   clearing rises to 22–28% of the forest, it tips at 1.5–1.9°C, a band the
   world reaches around 2030. What decides it is how much of the forest gets
   cut.
   · dossier §4 *The two thresholds* (both bullets) · published `comparison`
   rows 1, 2, 4 · src-01, src-02.
   · Taught by rows 1 and 2 (the hero and both its annotations).
2. **Q:** Why does cutting forest in one place kill trees that were never cut?
   · **A:** The forest makes its own rain. Trees pull water out of the soil and
   breathe it into the air, it drifts inland and falls again, and in parts of
   the basin more than 50% of the rainfall is made that way. Clear a patch and
   the air downwind dries, and the drought stress can kill trees hundreds of
   kilometres away.
   · dossier §4 *The mechanism (hydrological self-destruction)* · published
   `paradox`, both details · src-01, src-07.
   · Taught by row 3, and it is the question this spine has to work for — three
   cards of 24 words each carry what 190 words of `paradox` carried before.
3. **Q:** Where does clearing sit today, and which way did it move last year?
   · **A:** Roughly 17 to 18% of the Amazon is already cleared, and the tipping
   band opens at 22%. Last year it moved the right way: clearing in Brazil's
   Amazon fell 11% in the year to 31 July 2025, the lowest since 2014, and
   global tropical primary forest loss fell 36% in 2025.
   · dossier §4 *Current state of the dial*, *Brazil policy / clearing
   trajectory* · published `data-readout` tiles 1, 2, 5 + `timeline` Jul 2025 ·
   src-01, src-02, src-05, src-06.
   · Taught by rows 4, 5, 6 and 7.

## 7. Names

**Nine**, against a ceiling of twelve and the 26 the published issue carries.
Three spare slots; the drafter may use them only for a name already in the
published file.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **the Amazon** | the forest itself | throughout |
| **Brazil** | the country that holds most of the forest and moved the clearing number in 2025 | rows 5, 7, 8 |
| **Nature** | the journal the study appeared in, on 7 May 2026 | row 5, the pivot event note, once |
| **Carlos Nobre** | the scientist who helped draw the first threshold in 2018, and who gives the 2040 deadline | row 5 (Feb 2018) and row 8 |
| **Elizabeth Goldman** | the researcher at the institute that totals the world's forest loss | row 6 `attribution` |
| **World Resources Institute** | her institute | row 6 `attribution` |
| **Paulo Brando** | a co-author of the study on burned forest, on how well it recovers | row 6 `followup` |
| **Mongabay** | the outlet Nobre said it to | row 8, once, plus source lines |
| **Delhi** | the area the reader can walk around, beside the year's clearing | row 7 `equals[0]` |

**Described, not named** (all of these are named in the published file):
**Nico Wunderling** → "the study's lead author", with the name on the source
line — this also keeps the 2040s timing correctly attributed without a stacked
citation; **Goethe University Frankfurt** and the **Potsdam Institute** →
dropped, the source line carries them; **the World Meteorological
Organization** → "the world's weather agency" (row 5, 28 May), with WMO on the
source line; **Thomas Lovejoy** → dropped, "Nobre and a colleague" (row 5, Feb
2018); **Marina Hirota** and the **Flores** regional study → gone with the
Feb 2024 event (§8a); **Guyana, Venezuela, Colombia and Peru** → gone with the
same event, and they were four names in one note; **PNAS** → "a separate
study" (row 5, 21 May); **INPE / PRODES** → source line only; **Global Forest
Watch** → source line only; **Science Advances** → dropped.

**Source lines only, never inside a sentence** (rule 9, tell 9): Mongabay ·
Carbon Brief · Wunderling et al., Nature, 7 May 2026 · INPE PRODES · World
Meteorological Organization · Global Forest Watch. The published
`data-readout`'s source line already does this correctly; the `comparison`'s
does not (it stacks author, journal, date, two outlets and two reporters' names
into one line) and is rewritten with the section.

## 8. Composer notes

### 8a. What carries over, section by section

Component `data` is expensive, so the rewrite reuses it wherever the register
allows. **Numbers are copied from the published file, never retyped** (rule
13), including the en-dashes in "17–18", "22–28", "1.5–1.9", "3.7–4" and
"31.3–50.8", the comma in "5,796", and the "~" on "~50".

| Published section | Verdict | Detail |
|---|---|---|
| `prose` 1 — "We have been reading the *wrong gauge*" | **CUT as a section, content re-drawn** | ~330 words plus a 63-word `skimCaption`, and the single largest cause of the 639-words-before-the-first-graphic failure. Paragraph 2 (the two-dial setup) becomes row 1's `you-think` panels in 35 words. Paragraphs 1 and 3 are a table of contents for the issue and are cut outright. The `skimCaption`'s restatement moves into row 2's intro, where a reader can actually see it (`skimCaption` renders only in Skim mode). **This is the change the floors force** — the issue may not open on prose |
| `comparison` — "The same forest, *two* breaking points" | **CUT as a kind; re-kinded to `benchmark-chart` and promoted to hero** | It is in `TEXT_ONLY`, so it costs a visual row instead of buying one. All six rows survive: rows 1 and 2 become the bar values and sublabels, row 4 becomes the two annotations, row 3's left cell becomes row 4's dial, row 5 becomes row 8's lead, row 6 becomes row 1's `note`. **Row 3's right cell, "~1.3°C and rising", is dropped** — §8c.5 |
| `data-readout` — "How little forest stands *between*" | **CUT as a section; all six tiles redistributed** | 17–18% and 22–28% become row 4's needle and zone; 1.5–1.9°C becomes the hero's second sublabel; ~50% becomes row 3's second step; 5,796 km² becomes row 7 in full; "2040s" becomes row 5's pivot-event note. Its tile-2 note — "The reporters' framing of the current state, not a figure quoted from the paper" — is an honesty label the dossier asked for and **it must survive**: it becomes row 4's authored `howToRead`, which is the field it always belonged in |
| `paradox` — "The forest waters *its own* ground" | **CUT as a kind; re-kinded to `three-steps`** | The catalog's USE WHEN is "two facts that are **both true** and pull in opposite directions". These two do not pull against each other: side B ("clearing here kills forest that was never cut") is a *consequence* of side A ("rain falls because the forest is there"). It is a mechanism that runs in order, which is `three-steps`' own USE WHEN. Both details fall from 62 and 74 words to three cards of ≤ 24. Every number survives, including "more than 50%" and "hundreds of kilometres". The one-`paradox` ration is left unspent |
| `timeline` — "How the science *and* the dial moved" | **carried, 7 → 6 events, notes halved, gains 2 annotations** | Every surviving `date` and `state` value unchanged. **Cut: Feb 2024** (the regional-mapping study) — it carries four country names, the 47%/2050 pair and the 13%-of-the-biome baseline the dossier §9.2 warns must never be netted against 17–18%. Its source, src-03, survives on the Feb 2018 event. **Fixed: the Jul 2025 label** "Clearing falls to a 12-year low" → "**The lowest since 2014.**" (verification required fix #1). Notes fall from ~28 words to ≤ 14 |
| `quote` — "One good year is *not* the trend" | **carried, quote verbatim, followup halved** | The Goldman line is 9 words and unchanged. The `attribution` loses the outlet and date to a new `source` line (tell 9), falling to 11 words. The `followup` falls from 66 to ≤ 24 and keeps the Brando quoted span verbatim. **The intro loses its "The honest version of this story is not a doomed forest. It is a controllable lever" opening** — the verification report passed it as the issue's one binary reframe, but in this spine the reframe is carried structurally by row 1's `you-think`, so the construction is spent nowhere. §8h.1 |
| `prose` 2 — "The choice the framing *hides*" | **carried as row 8, halved** | ~330 words → ≤ 148 including the `skimCaption`. Keeps: the asymmetry, "Brazil bent it in 2025" with 11% and 36%, and both verbatim Nobre fragments ("by 2040" / "it is impossible to save the Amazon"). Loses: the "Notice what the deadline is measured in. Not degrees the world must surrender. Hectares a few governments must stop cutting." close, which is a not-X-but-Y in fragments (tells 2 and 19) |
| `sources[]` src-01 … src-08 | **all eight unchanged, and all eight still in use** | No orphans. §8b maps every row |
| frontmatter | **`id`, `topic`, `publishedAt`, `status`, `tags` unchanged** | `readTimeMinutes` 7 → 4. `title`, `hook`, `dek`, `primer` per §4. Leave `voice` unset, or set `CONVERSATIONAL EXPLAINER`, the dominant job |
| `story:` | **does not exist** | No 0-based beat indices to remap. If the operator wants story cards, authoring them is a separate editorial act after the draft lands |
| the MDX body's six `# EDITOR:` notes | **five carried verbatim, one rewritten** | Notes 1 (Nature is not allowlisted and is not a Parallax source), 2 (`region-map` deliberately dropped), 3 ("two-thirds to three-quarters" verbal; 62–77% off-allowlist), 4 (17–18% is the reporters' framing, not netted against the 2024 13% baseline) and 6 (Goldman and Brando verbatim; the Maracahipes line unused) all still hold. **Note 5 is rewritten**: `carbon-gauge` no longer "fell back to `data-readout`" — §8c.1 gives the new reason and the new kind |

### 8b. Sourcing — every row, under CANON §7

The published issue satisfies "no source, no section" on five of seven sections
and `sourceRefs[]` is **empty on all seven** (verification, Optional #1). The
rewrite touches every section, so backfilling is free now and expensive later.

| Row | Kind | `source` label | `sourceRefs[]` |
|---|---|---|---|
| 1 | `you-think` | Mongabay and Carbon Brief · 7–8 May 2026 | src-01, src-02 |
| 2 | `benchmark-chart` | Wunderling et al., Nature, as reported by Mongabay and Carbon Brief | src-01, src-02 |
| 3 | `three-steps` | Mongabay · Carbon Brief | src-01, src-07 |
| 4 | `throughput-dial` | Mongabay and Carbon Brief · May 2026 | src-01, src-02, src-04 |
| 5 | `timeline` | Mongabay and Carbon Brief reporting | src-01, 02, 03, 04, 06, 08 |
| 6 | `quote` | Mongabay · 8 May 2026 | src-05, src-04 |
| 7 | `number-sense` | INPE PRODES, via Mongabay | src-06 |
| 8 | `prose` | — (narrative; the published prose sections carry none) | src-01, src-05, src-06 |

**Two published sections carry no `source` today** and both are affected:
`prose` 1 (cut) and `prose` 2 (kept, and it may stay sourceless as a narrative
kind, but `sourceRefs[]` should be filled). Nothing in the new spine cites a
document the bibliography does not carry. **src-03 has only one job left** —
the Feb 2018 threshold on row 5 — so if the operator also cuts that event, src-03
becomes an orphan and should be left in `sources[]` anyway (removing a source
from a published issue breaks existing citations).

### 8c. The rulings I am asking for

> ## SETTLED — operator ruling, 2026-09-15
>
> **All seven settled as recommended.**
>
> 1. **`carbon-loop` is OUT.** It needs at least three reservoirs with stocks
>    and four fluxes in one conserved unit, and it conservation-checks at
>    build, so it would silently accept any invented set that happened to
>    balance. The record carries one share and one direction. `three-steps`
>    carries the mechanism. Unblocking it needs a basin water-balance table
>    from an allowlisted source. That is a research job, not this rewrite.
> 2. **THE DRAWING RULE, and it is a standing rule from here on.** Where a
>    source gives a band, draw the **low end** and put the band in the
>    `sublabel`. The dial needle sits at **17**, the figure both reporters
>    carry, with 18 named in the authored `howToRead`. **Both choices weaken
>    the issue's own claim rather than flatter it, and that is the point.**
> 3. **Hero takes `layout: wide`, not `split`, and no `refValue`.**
> 4. **`throughput-dial` for row 4**, with the colour wrinkle recorded. If it
>    does not read, the two one-edit fallbacks stand: a four-tile
>    `data-readout`, or `max: 30` instead of `max: 100`.
> 5. **Both weak figures are dropped, not softened.** "~1.3°C and rising" (the
>    verification's one untraced number) goes. "12-year low" becomes "the
>    lowest since 2014".
> 6. **Delhi and the monsoon clause are both allowed**, or the issue has no
>    Indian ground at all. The Delhi comparison carries its basis in the
>    `equals[].note`. The monsoon is borrowed for **half** an analogy only:
>    wet air comes off the sea and moves inland, and in the Amazon the forest
>    is what keeps that air wet. **Any sentence implying that Amazon clearing
>    changes Indian rainfall is barred.** That is the kessler trap restated,
>    and kessler barred the equivalent move for the same reason.
> 7. **All eight `sources[]` stay**, even though src-03 ends up backing a
>    single timeline event.


**1. `carbon-loop` is NOT fillable from this record. Recommended: do not use
it.** REGISTER-PLAN §8.1 names it for this issue, so this is the ruling that
matters most, and I checked the DATA line, the blueprint and the component
before answering.

`carbon-loop` requires `reservoirs: [{id, label, stock, x, y, role?}]` and
`fluxes: [{from, to, value}]`, **≥ 3 reservoirs and ≥ 4 fluxes**, with stocks
in a conserved unit, and it **checks conservation at build**: a `role: 'store'`
reservoir whose net exceeds 1% of its throughput *throws and names the
reservoir* unless it is the single `accent` reservoir flagged
`imbalance: 'the-point'`. Box **area ∝ stock** and arrow thickness and dash
speed ∝ flux, so every number in the payload is a drawn value.

**The record carries no stock and no flux.** Its hydrology is one share ("up to
half of the rainfall is recycled by the trees", "more than 50% in parts") and
one direction ("drought stress can kill trees hundreds of kilometres away").
There is no volume of water in the air over the basin, no evapotranspiration in
km³/yr, no rainfall total, no runoff, no ocean inflow — not in the published
issue, not in dossier §4, not in any of the eight sources. Filling the kind
would mean inventing four to six numbers, of which the conservation check would
silently accept the ones that happen to balance. That is the operator's
2026-09-14 standard exactly: a graphic whose drawn values are editorial fails
the verifier's trace. It is also in `NEEDS_HOW`, so it would add an authored
panel, and its default `plain` opens "Each box is a place carbon is stored" —
this is a **water** cycle, so that would need authoring too.

*What would unblock the kind itself:* one basin water-balance table from an
allowlisted source — moisture inflow from the ocean, evapotranspiration,
precipitation and river runoff, all in the same unit, plus a stock for at least
three reservoirs. Then `carbon-loop` becomes the mechanism hero for this issue,
"half its own rain" becomes a drawn ratio instead of a sentence, and the
recycling loop is visible as a loop. **That is a research job, and a rewrite
may not add a source.** It is the highest-value note this storyboard leaves
behind. Until then the beat is row 3, `three-steps`, which needs no number the
record lacks and still carries "more than 50%" and "hundreds of kilometres".

**2. The bar and needle drawing rule. Recommended, and it needs your signature
because it is the one place this rewrite puts a number on a page that the
record states as a range.**
- The hero's bars are drawn at the **low end** of each published band (1.5 and
  3.7), with the full band in the `sublabel`, the `caption` and the `plain`
  line, and the rule applied to both bars.
- The dial's needle is drawn at **17**, the figure both reporters carry, with
  18 in the authored `howToRead`.
Both choices are conservative: the low end makes the gap between the two
thresholds smaller than a midpoint reading would, and 17 puts the reader
further from the tipping band than 18 does. *The alternative* is to draw
nothing and keep the published `comparison` and `data-readout`, which is what
2 of 7 visual looks like.

**3. `layout: wide` on the hero, not `split`, and no `refValue`.** §2 gives
both reasons. If you want the reference line anyway, `refValue: 1.5` with
`refLabel: "the warming the world reaches around 2030"` is defensible and one
edit away, but it lands on top of bar 2's end and the annotation already says
it in seven words.

**4. `throughput-dial` for row 4, with one wrinkle you should see first.**
Recommended. It is the only kind in the catalog that draws **one reading
against a named zone**, which is precisely this beat, and it has never been
published. The wrinkle is colour: the fill arc uses `var(--accent)`, which on
the earth desk is the living green, so the arc that grows as the forest
disappears is drawn in the desk's most cheerful colour, while the tipping band
(the first `zones[]` entry) renders as a soft grey. The fill *direction* is
right — fuller means further along, which is the kind's own reading — and the
authored `plain` line says so in plain words. **Two fallbacks if you would
rather not risk it:**
- swap row 4 for a four-tile `data-readout` (17–18% · 22–28% · 1.5–1.9°C ·
  2040s). Same visual count, same word budget, one fewer unseen kind, and the
  beat reads as a list instead of a distance.
- keep the dial and set `max: 30` instead of `max: 100`, which makes the needle
  and the band fill the arc. I recommend **100**: it is the real denominator
  (share of the whole forest) and needs no editorial axis choice, and the
  emptiness of the rest of the dial is part of the honest reading.

**5. Two published numbers are dropped, and both are verification fixes.**
- **"~1.3°C and rising"** (`comparison`, "Where the dial sits today"). The
  verification report's Optional #2 says it is the one number in the issue not
  traceable to a dossier line. The rewrite **drops it rather than softening
  it**, so nothing is added and the untraced figure is gone.
- **"a 12-year low"** (`timeline`, Jul 2025). The verification report's single
  required fix: "lowest since 2014" spans 11 years. The label becomes "**The
  lowest since 2014.**", matching the wording the `data-readout` tile already
  used. **This resolves the NEEDS REVISION verdict by composition.**

**6. The Delhi comparison (ruling 3 in §5) and the monsoon clause (ruling 4).**
Allow both and the issue has Indian ground for the first time. Refuse both and
it has none, and `NO-INDIAN-ANCHOR` fires exactly as it does today.

**7. The eight `sources[]` entries stay, all of them, even if src-03 ends up
backing a single timeline event.** A published issue's bibliography is part of
its record.

### 8d. Kinds I wanted and could not use

| Kind | Why it fitted | What blocked it |
|---|---|---|
| **`carbon-loop`** [earth, never published] | REGISTER-PLAN §8.1 names it, and the mechanism genuinely is a stock-and-flow: the forest passes its own water inland | **No stocks, no fluxes, no unit.** §8c.1 in full. The build's conservation check is the tell: it would be checking invented numbers against each other |
| **`scaling-plot`** [i] | The issue's claim IS an x/y relationship — deforestation share against the warming the forest survives — and it carries an `annotations[]` slot. This is the most tempting kind after `carbon-loop` | **Two points is not a curve.** The record gives (clearing held → 3.7–4°C) and (22–28% → 1.5–1.9°C), each a range on both axes. Fitting anything through them manufactures the paper's central relationship, which is the one thing a rewrite must not do. *Unblocked by:* the threshold curve from the paper's own figure, which needs the paywalled Nature PDF **and** an allowlist decision |
| `climate-strip` (earth signature) | The earth desk's own time-series kind, and the el-niño hero | **No annual series of anything.** The record has two clearing figures on two different measures (5,796 km² PRODES for 2025, 2.78 M ha of primary-forest loss for 2024) and a 36% year-on-year fall. Three points, three definitions |
| `region-map` (earth signature) | It is the instinct for a forest story, and the candidate originally asked for it | **No per-zone values**, and this was already settled before publication: dossier §9.4 records that by-country and by-state clearing shares exist only off-allowlist (Wikipedia citing INPE/Embrapa). The published `# EDITOR:` note stands and carries forward |
| `carbon-gauge` (earth signature) | The dossier §7 proposed it for exactly this beat | **It cannot draw the band**, which is the finding. Its DATA is `{remaining, remainingGt, usedGt, totalGt, target, year}` — a single fraction. The 22–28% tipping band has nowhere to go but a text label, and the component prints a derived percentage at 52px in the middle of the arc, which would be manufactured precision on the issue's most hedged number. The published issue rejected it for a weaker reason (a high needle reads as safety); this is the stronger one |
| `margin-bullets` [i] | "Each measurement against its own requirement" is close to "clearing against its threshold" | **The build throws below 4 rows**, and the record supports two at most. The requirement semantics are also inverted: a `required` tick is a bar you must reach, and 22% is a line you must not cross |
| `attrition-waffle` [i] | 100 countable squares as the forest, 17 of them cleared, would be a strong figure | Needs groups summing to exactly 100 **and** a true `n`; it audits a cohort's outcomes, and its DON'T USE sends a part-of-whole-by-quantity elsewhere. The record gives a share of a physical quantity and no denominator |
| `comparison` (the incumbent) | Two entities, six attributes, already authored and already sourced | No data gap at all. It is in `TEXT_ONLY`, so on a seven-row spine it costs a visual row instead of buying one. Re-kinded (§8a) |
| `paradox` (the incumbent) | Already authored, and the mechanism is genuinely surprising | Not a paradox by the catalog's own USE WHEN: its side B is a consequence of side A, not a counterweight. Re-kinded to `three-steps` |
| `analogy` (`pairs[]`) | The monsoon ↔ forest mapping is a clean two-column this/that | `TEXT_ONLY`. A fourth text-only row takes the spine to 5 visual of 9 (55.6%) and fails the floor. The mapping sits in row 3's intro instead, next to the real mechanism. Memory of four previous storyboards: `analogy` loses this trade every time |
| `jargon-buster` | "Tipping point", "savanna", "deforestation rate" are all terms of art the issue leans on | `TEXT_ONLY` again, and each term is glossed where it appears in one clause. Same arithmetic |
| `terrain-relief`, `data-globe`, `storm-track`, `plate-motion` [3D] | A WebGL section would be the earth desk's first in a published issue | All four need data the record does not have: a DEM for a bounded region, geo-located point values, best-track fixes, Euler poles. There is nothing to fetch from this dossier |
| `climate-spiral` [i], `core-sample`, `sea-level-tank`, `elevation-profile`, `quake-depth` | The rest of the earth library | Wrong shapes: a monthly series, depth layers, a water level, vertical bands with values, a depth × time scatter. The one regional fact the record carries ("dry season extended by four to five weeks") is a single number, not a profile |
| `you-think`, a second time | The issue corrects a second belief (that a tipped Amazon is a distant-century problem) | One per issue, per the catalog. The 2040s lands on row 5's pivot event instead |
| `act-break` | CANON §3's act device | Zero uses in 24 issues; RG-06 has not ruled, and el-niño ruled against it on this desk. Not used, so the act rule is not invoked — and every act still carries a quiet section (rows 3, 6, 8) |

### 8e. The number ledger — read this before `check:prose` scares you

`check-prose.mjs` compares every numeral against the last committed version and
flags `NUMBER-DRIFT` as **❌ blocking on a published issue** (it is only ℹ on a
draft). This rewrite will fire it. Here is the whole list, so the operator can
tick each one rather than re-derive it.

**Removed, deliberately:**

| Numeral | Where it lived | Why it goes |
|---|---|---|
| `1.3` | `comparison`, "Where the dial sits today" | untraced to any dossier line — verification Optional #2 (§8c.5) |
| `12` | `timeline`, Jul 2025 label ("12-year low") | wrong — verification required fix #1 (§8c.5) |
| `47`, `2050` | `timeline`, Feb 2024 event | the event is cut: four country names in one note, and the 13%-baseline hazard |
| `2028`, `2036` | `data-readout` tile 3 note (the 1.5°C crossing range) | the central estimate, "around 2030", survives on the hero annotation; the range is precision no surviving row can carry |
| `7` (one of several) | `readTimeMinutes: 7` | → `4`, the REGISTER-PLAN §5.1 target. "7 May 2026" keeps the numeral alive elsewhere |

**Added, deliberately:** `1,480` (Delhi's area, row 7 `equals[0].note`, **only
if ruling 3 passes**) and `4` (`readTimeMinutes`).

**Everything else is copied:** `1.5`, `1.9`, `3.7`, `4`, `17`, `18`, `22`,
`28`, `50`, `2030`, `5,796`, `11`, `2014`, `31`, `20`, `25`, `2.78`, `60`,
`31.3`, `50.8`, `91`, `36`, `2040`, `2018`, `2024`, `2025`, `2026` and every
date. **Two of these need the drafter's attention**, because the obvious
rewrite drops them:
- **`50`** survives only if row 3's second step keeps the published clause "more
  than 50% of the rain is made this way". "Up to half" alone loses the numeral.
- **`31`** survives only if row 5's Jul 2025 note keeps "in the year to 31
  July".

### 8f. Three traps in the gate this spine is written around

1. **`NUMBER-DENSE` fires at three numerals in one sentence**, and it scores
   `note`, `text`, `detail`, `lead`, `paragraphs` and `followup` — every
   timeline note and every `equals` line. It does **not** score `label`,
   `sublabel`, `caption`, `plain` or `source`. So the 7 May 2026 event note
   must **not** try to carry "22–28% plus 1.5–1.9°C, and 3.7–4°C without" —
   that is four numerals in one sentence, and those numbers are the hero's job.
   The 28 May event puts "1.5°C" and "91%" in the **label** for the same
   reason.
2. **`NO-RESTATEMENT` and `NO-ANALOGY` fire on any `prose` section** that
   lacks one of the gate's literal markers. Row 8 must contain **one of**
   "in other words · that means · which means · to put that in perspective ·
   the point is · for context" **and one of** "think of · like a · imagine ·
   the way a · is like". This is not a style note. It is a flag with a word
   list, and the published closing prose carries neither.
3. **`STACCATO` fires on three consecutive sentences under eight words**, which
   is exactly the shape the published close reaches for ("Not degrees the world
   must surrender. Hectares a few governments must stop cutting."). The hook's
   7 / 8 / 6 pattern is deliberately built to clear it; do not shorten the
   middle sentence.

### 8g. The designated slack

~101 words of headroom, the most any Phase 6 spine has had. If a row overruns,
the order of payment is:

1. **Row 5's six timeline notes pay first** (≤ 14 words → ≤ 11 saves 18).
2. **Then row 8's second paragraph** (≤ 45 → ≤ 35 saves 10), which is the
   Nobre paragraph — but the two quoted fragments are fixed cost and travel
   verbatim.
3. **Then row 3's three step texts** (≤ 24 → ≤ 20 saves 12).

Nothing pays out of row 1, which is protecting the 80-word floor, out of the
four annotations, which are the issue's findings, or out of row 4's authored
`howToRead`, which is carrying an honesty label the dossier asked for.

**And if you want to spend the headroom rather than bank it**, the one thing
worth buying is a fifth and sixth `equals` on row 7 or a seventh word on each
annotation. **Do not buy a ninth row** — §3 shows why the arithmetic fails.

### 8h. Five things the drafter must not do

1. **Do not write "not X, it's Y" anywhere, in any dress.** The issue's reframe
   is carried structurally by row 1's `you-think` component, which is what it
   was built for. The published issue spends the construction three times: the
   title ("and it *isn't* temperature"), the `quote` intro ("is not a doomed
   forest. It is a controllable lever") and the closing paragraph ("Not
   degrees… Hectares…"). All three come out.
2. **Do not re-type a number.** Every figure in rows 2, 4, 5 and 7 is copied
   from `src/content/issues/2026-06-04-amazon-tipping-point/index.mdx`,
   including the en-dashes inside ranges, the comma in "5,796" and the "~" on
   "~50". §8e is the ledger.
3. **Do not tie the Amazon to the Indian monsoon.** The analogy in row 3 borrows
   the direction of travel and nothing else (§5). Any sentence implying that
   clearing the Amazon changes Indian rainfall is a contested scientific claim
   the record does not carry.
4. **No em-dash in any prose field, and no semicolons.** The published file
   carries em-dashes in the primer, the opening prose lead, the `comparison`
   intro, the `data-readout` tile notes, the `paradox` details and the closing
   paragraph. Every one becomes a full stop, a comma or a new sentence. Ranges
   keep their en-dashes.
5. **Do not present Mongabay or Carbon Brief reporting as a direct *Nature*
   citation**, and do not cite the paper as a source. This is the published
   issue's own standing `# EDITOR:` note, it is the dossier's §2 caveat, and it
   is the reason the issue is safe to publish at all. Name the journal once, in
   row 5's pivot event, and let the source lines carry the reporters.
