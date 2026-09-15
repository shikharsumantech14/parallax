# Storyboard: 2024 YR4 — the asteroid never moved, the odds did

- **Category:** space
- **Dossier:** `research/space/2026-06-04-asteroid-2024-yr4-dossier.md`
- **Published issue (the factual record):** `src/content/issues/2026-06-04-asteroid-2024-yr4/index.mdx`, `sources[]` src-01 … src-08
- **Verification report:** `research/space/2026-06-04-asteroid-2024-yr4-verification.md` (verdict APPROVED, zero required fixes)
- **Composed:** 2026-09-14
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-14; rulings settled in §8c

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

> **REWRITE — Phase 6 (REGISTER-PLAN §8.1), the Phase 4 flagship method
> applied to the remaining six.** The four defects this rewrite exists to fix,
> as measured by the plan:
>
> 1. **1,529 reader-facing words in 38 blocks**, against a 1,100 ceiling.
> 2. **The issue opens on a three-paragraph `prose` section** (lead plus three
>    paragraphs plus a 76-word `skimCaption`). The floor says the first section
>    after the head is a graphic, and the gate's counter does not stop until it
>    reaches one — so **roughly 400 words** run before the first graphic today,
>    against a ceiling of 80.
> 3. **34 NASA mentions**, plus ESA, Webb, ATLAS, Gaia, NIRCam, the Minor Planet
>    Center, CNEOS and Río Hurtado, against a 12-name ration. Most of that
>    belongs on the source line (contract §3 rule 9, tell 9).
> 4. **Two of the six sections draw numbers nobody published** — `signal-readout`
>    (bars at 22 / 54 / 94 / 88, "Bar values are editorial") and `trajectory-arc`
>    (`altKm` / `downrangeKm` illustrative). Rulings requested in §8c.
>
> **The verification report is a constraint, not background.** It is APPROVED
> with zero required fixes, so nothing here is a correction: every number in
> this spine is already traced. Its three optional notes are picked up in §8
> (the lunar-peak framing, the empty `sourceRefs[]`, the "least constrained"
> synthesis). Its one live warning — the binary-reframe quota is spent — is
> honoured: §4 spends the issue's single reversal in the hook and nowhere else.
>
> **Rewrite rules in force.** The slug `2026-06-04-asteroid-2024-yr4`, the `id`,
> `topic`, `publishedAt`, `tags`, `status: published` and all eight `sources[]`
> entries are kept, so the URL does not change and the verifier's trace still
> holds. No fact, number, name or source is added: every claim traces to dossier
> §4 or to the published issue's own verified sections. Arithmetic on the
> issue's own numbers is listed in §5 so the operator can rule on it.
> `readTimeMinutes` drops from 7 to 4. §8 lists which component `data` carries
> over verbatim, what is cut, and the story-beat index mapping.

---

## 1. The argument in one line

The impact odds climbed to a record and then fell to zero without the asteroid
moving a metre. What shrank was the box around where it would be.

## 2. The hero

**`timeline`** (G4 · dated sequence with hinge moments), at `layout: wide`,
carried from the published issue at 8 events cut to 6, with two `annotations[]`.

It carries the argument because the argument **is** the shape of the sequence:
up, across, up again, then nothing. No other section can show that a probability
rose before it collapsed, and the `state` field already encodes the turns
(`key` on the Earth peak, `fail` on the lunar climb, `now` on the all-clear). It
is also the only kind in this spine with an annotation slot, which is where the
finding gets said on the mark rather than in a paragraph (§3, annotations).

The §4 facts it renders: discovery 27 Dec 2024 (ATLAS, Chile); the 3.1% Earth
peak of 18 Feb 2025; Earth ruled out at 0.004% on 24 Feb 2025 with a 1.7% lunar
residual; the lunar peak of 4.3% on 3 Jun 2025 and the fade from every
telescope's reach; the two Webb detections of 18 and 26 Feb 2026 against
Gaia-anchored star positions; the 5 Mar 2026 all-clear and the >20,000 km miss.

**Not `layout: split`, and why.** CANON §2 reserves `split` for the hero and
this is the hero, so it is available. I recommend against it: a timeline is a
vertical spine with a note under each label, and a half-measure column turns six
notes into twelve short lines. `wide` gives the spine the full frame. No other
row takes anything but `default`. Flip it to `split` in one edit if you disagree.

**Not the hero, and why:** `data-readout` is the issue's densest section and is
hero-capable, but it is a ledger. It states the outcome of the argument, six
numbers at once, with no order in it. Order is the whole point here, so the
tiles sit at row 5 and the sequence leads.

## 3. The beats

One row per thing the reader must get, in reading order. The first row after
the head is a graphic, never prose. No two text-only rows adjacent. At least six
in ten rows visual. ≥ 1 kind from outside the six workhorses.

*For this rewrite the last column cites the published issue's own section and
`sources[]` id beside the dossier §4 row.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | The row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | The odds moved twice in six days. The rock did not move at all. | G2 · belief vs data | `you-think` **[new]** | — | **94** · **`eyebrow` ≤ 3 w · `title` ≤ 6 w · no `intro`** (all three are inside the 80-word count) · `think` ≤ 24 w · `actually.value` "3.1% → 0.004%" + `unit` "in six days" · `actually.text` ≤ 26 w · `note` ≤ 16 w · `caption` ≤ 20 w | The number on the screen against the rock in the sky. The screen changed; the sky did not | omit — `EXPLAIN['you-think'].what` fits | published `prose` lead + para 2; §4 peak 3.1% and post-resolution 0.004% · src-03, src-04 |
| 2 | Fifteen months, six dated entries, one orbit. Up on Earth, across to the Moon, up again, then zero. | G4 · dated sequence | `timeline` **[carried, 8 → 6 events]** | **HERO** · `layout: wide` | **200** · intro ≤ 26 w · 6 labels ≤ 6 w · 5 notes (four ≤ 14 w, one ≤ 20 w) · **2 annotations** ≤ 12 w · caption ≤ 18 w · **authored `plain`** ≤ 24 w | The almond, verbatim, on the Feb 2026 node — the reason nobody could simply look again | "Each entry is one dated update to the odds. The highlighted nodes are the turning points, and the last one is where it stands now." | published `timeline` events 1, 2, 4, 6, 7, 8 · §3 timeline · src-01, 02, 03, 04, 06, 07, 08 |
| 3 | "Impact probability" is a reading off the size of the error box, not off the danger. | G1 · narrative (text-only) | `jargon-buster` **[new]** | — | **96** · intro ≤ 20 w · 3 terms (term ≤ 4 w · meaning ≤ 22 w) · no Hindi gloss (§5) | The box itself is the concrete thing: a stretch of sky, and the Moon standing inside it or outside it | none (narrative kind) | published `prose` para 2 ("a probability is only a reading off the size of that box"); §4 defence-trigger context · src-01, src-04 |
| 4 | 3.1% is about one chance in thirty-two. Six days later it was one in 25,000. | G3 · one number made physical | `number-sense` **[new]** | — | **106** · intro ≤ 18 w · label ≤ 8 w · 3 `equals` ≤ 12 w each + `note` ≤ 10 w each · `note` ≤ 18 w · `caption` ≤ 18 w | Odds said the way they actually get said out loud — one in thirty-two, not three point one percent | omit — `EXPLAIN['number-sense'].what` fits | §4 peak Earth probability; §4 post-resolution 0.004% · src-03, src-04 |
| 5 | Six figures on the board. Only one of them belongs to the rock. | G3 · a few headline numbers | `data-readout` **[carried verbatim, notes halved]** | — | **144** · intro ≤ 26 w · 6 tiles (label ≤ 5 w · note ≤ 12 w) · `caption` ≤ 16 w | The miss distance in the unit the reader counts in: three to four lakh times the rock's own width | omit — `EXPLAIN['data-readout'].what` fits | published `data-readout`, all six tiles · §4 throughout · src-01…08 |
| 6 | NASA's own words for what changed: the precision, not the path. | G1 · narrative (text-only) | `quote` **[promoted out of `paradox`]** | — | **81** · intro ≤ 18 w · quote 26 w verbatim · attribution ≤ 8 w · `followup` ≤ 28 w | The closer places the rock back in the sky the reader can see tonight | none (narrative kind) | published `paradox` · Structural Read detail; §5 Wasser quote · src-01 |

**Head:** 69 words (title 7 · dek 11 · hook 23 · primer 28).

**Total budgeted, the way the gate counts it: ~890 reader-facing words** against
the 1,100 ceiling. That is the 721 of row copy above, plus the 69-word head,
plus roughly 60 for six eyebrows and six section titles and 30 for six source
lines — `readerWords` in `scripts/check-prose.mjs` sweeps `eyebrow`, `title`,
`source`, `caption` and `plain` as well as the body fields, so a budget that
counts only intros and notes under-reads by about 90. Published today: **1,529**.
This spine is a **42% cut** with every number kept, and it leaves ~210 words of
headroom (which is what buys the operator §8f's eight-row variant without a
re-composition).

**Words before the first graphic: 78.** Ceiling 80. **Read the arithmetic before
editing the head.** The gate counts head (title + dek + hook + primer) **plus
row 1's `eyebrow`, `title` and `intro`**, and only stops after the first visual
section (`check-prose.mjs`, the `before` loop). So:

| | Words |
|---|---|
| title 7 · dek 11 · hook 23 · primer 28 | **69** |
| row 1 `eyebrow` — **cap 3 words** | 3 |
| row 1 `title` — **cap 6 words** | 6 |
| row 1 `intro` — **none, deliberately** | 0 |
| | **78** |

Published today: **roughly 400** — the head, then the whole opening `prose`
section, because the counter runs until it meets a visual kind.

Row 1's intro is deliberately empty; the eyebrow, the title and the section
numeral carry it. **Every word added to the head has to come out of row 1's
title, and the other way round.**

**Floors check.**
- **Visual 4 of 6 (66.7%, floor 60%)** — rows 1, 2, 4, 5. Text-only 2 (rows 3
  and 6), never adjacent: the spine runs **V V T V V T**.
- The visual/text-only split is taken from `TEXT_ONLY` in
  `scripts/check-prose.mjs`, not from the catalog's narrative flag. That set is
  `act-break, prose, quote, analogy, beat-sheet, plate, comparison, paradox,
  jargon-buster, three-steps`. **`comparison`, `jargon-buster` and `three-steps`
  all count as text-only**, which is the single constraint that shaped this
  spine — see §8d and §8f.
- First section after the head is `you-think`, a VizCard kind in G2. The
  operator ruled this satisfies the floor on 2026-09-13 (delimitation ruling 4:
  "the gate counts every non-narrative kind as visual").
- `prose` sections: **0** (ceiling 3). `paradox`: **0** (ceiling 1).
- Kinds from outside the six workhorses: **3** — `you-think`, `jargon-buster`,
  `number-sense` (floor 1, or 2 where the data supports it). All three have
  never appeared in a published issue.
- `timeline` at **6 events** (ceiling 6), notes ≤ 20 words (ceiling 20), five of
  six events carry one.
- Loud sections: **0** (ceiling 3). No WebGL, no `bleed`, no `split`. One
  `wide`, on the hero. Sections: 6 — the floor of CANON §3's 6–12 range.
- Names: **7** against the ceiling of 12 (§7).
- Blocks: row 2 will read `CHROME-HEAVY ℹ` at roughly fifteen text blocks. Every
  timeline does; the gate's ℹ is informational and the alternative is a timeline
  with no notes. Every other row sits at or under five.

**How-to-read panels: none authored, anywhere.** No kind in this spine is in
`NEEDS_HOW` (`src/lib/explainers.ts`) — no instrument, no WebGL scene, no
counter-intuitive form. Under RG-19 no panel renders and none should be
authored. The published issue authors none either, so this is a hold, not a saving.

**`plain` lines: one authored, on the hero.** Rows 1, 4 and 5 take the
`EXPLAIN[kind].what` default, which describes each form correctly. Rows 3 and 6
are narrative kinds and take none. The source renders on every section as the
second line of that paragraph (`core/Section.astro`).

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** `timeline` is
the only kind in this spine with the slot. Two required, one optional:

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 2 | `"Feb 18 2025"` | **"Peak odds. The orbit was at its least known."** (9 w) | The thesis, on the mark that carries it. The scariest number sits on the least data, and the callout says so where the reader is already looking. |
| 2 | `"Jun 3 2025"` | **"The risk moves to the Moon. The rock does not."** (10 w) | The one step readers get wrong. A number rising for a new target looks like a new danger; it is the same box, shrinking around the same path. |
| 2 | `"Mar 5 2026"` *(optional)* | "Zero, after two nights of Webb time." (7 w) | Keeps the resolution visible without a third note. Drop it if three callouts crowd a six-event spine. |

`you-think`, `number-sense` and `data-readout` are **not** in the eight
annotation-enabled kinds, so their finding rides the section title and the caption.

**Rhetorical jobs (4 of the eight, `_voice-core.md` §7).** INVESTIGATION opens
(row 1: the anomaly as a graphic, first) · CONVERSATIONAL EXPLAINER carries rows
2, 3 and 4 — **three of six, exactly the half the contract requires** · AWE takes
row 5, where the space desk's one licensed marvel lives and where the lakh
conversion lands (the awe is in the fact and the comparison, never the
adjectives) · CALM-STRUCTURAL closes on row 6. **Zero SATIRICAL EXPOSURE.** At
most one LYRICAL paragraph: I recommend spending none. The closer's `followup`
is a landing already and a lyrical turn on top of a verbatim NASA quote would
read as decoration.

## 4. The head

- **Title (states the finding, ≤ 8 words):** **"The odds *moved*. The asteroid did not."** (7 words)
  - Retires **"The Asteroid We *Talked* Down"** for two reasons, and the first is
    not stylistic: **it asserts the opposite of the issue's argument.** "We
    talked it down" says people acted on the rock. Nobody acted on anything; a
    measurement got sharper. It is also the retired "The ‹Noun› That ‹Verb›s"
    family (tell 7), and it is the subject rather than the finding (rule 11).
  - Alternate for the operator: *"The asteroid never moved. Only the odds did."*
    (8) — better rhythm, and it costs the one spare word in the 80-word count
    above, so row 1's title would have to drop to five.
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"For six days an asteroid had a 1-in-32 chance of hitting Earth. Then 1 in 25,000. The rock you were watching never moved."** (23 words)
  - Published hook: 24 words, no number a reader can feel ("climbed to a
    record"), no "you", and the "not because X, but because Y" shape the
    verifier already flagged as the softer half of the issue's one reversal.
  - **This is where the issue's single reversal is spent** (tells 2 and 19).
    The twist is carried by "never moved" against two moving numbers, not by an
    "It is not X. It is Y." The drafter must not reach for that construction in
    rows 1, 3 or 6, and the closer in particular must not mirror it (tell 22).
- **Dek (≤ 14 words):** **"The number rose before it fell. That was the system working."** (11 words)
  - The published dek, trimmed from 13 words. It is a sequence, not an
    antithesis, so it does not trip tell 8 beside the hook. No Hindi here: the
    dek sits directly above a section full of percentages, and §2's precision
    test keeps Hindi away from them. The issue's one Hindi word is placed in
    row 6 instead (§5).
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"In December 2024 a telescope in Chile found this rock. For fifteen months its odds of a hit rose, then fell to zero. Here is what actually changed."**
  (28 words, ~152 characters — inside the 80–420 bound. Published primer: 65
  words, ~410 characters, sitting at the Zod ceiling.) The 53–67 m size is *not*
  in the primer: it is `data-readout` tile 4, and the primer has 28 words to
  spend, not 35.

## 5. The Indian ground

**The record carries no Indian fact at all.** Not one of the eight sources, and
not one line of the dossier, mentions an Indian institution, place, person or
observation. There is no ISRO, no Indian telescope, no Indian scientist in this
story, and a rewrite may not add a source to put one there. If the operator
wants Indian institutional ground under this issue, that is a research job
(a sourced line on Indian near-Earth-object tracking), not a composition one.

**There is also no money in the issue.** Zero `$` and zero `₹` across all six
published sections, so contract §3 rule 4 has nothing to convert. The ground
has to come from the unit the reader counts in, the objects the reader owns, and
the sky the reader can see. All four below are built on the issue's own numbers.

| Ground | Where it lands | The row behind it |
|---|---|---|
| **lakh, as the native unit** — "three to four lakh times the rock's own width" | row 5, the miss-distance tile note | `data-readout` tiles 4 (53–67 m) and 5 (>20,000 km) · a derivation, item 4 below · src-01, src-02, src-05 |
| **Odds said out loud** — "about one chance in thirty-two", "one in 25,000" | row 4 (`equals`), the hook | §4 peak 3.1%; §4 post-resolution 0.004% · the "1-in-32" framing is already the published issue's own, in story beat 2 · src-03, src-04 |
| **badam — the almond** | row 2, the Feb 2026 event note, verbatim | §5 Rivkin / de Wit quote, already carried as `sources[].quote` on src-07 and used nowhere in the body today |
| **The Moon overhead** — the one object in this issue every reader has already seen, and the only thing at stake | row 1 `note`, row 6 `followup` | needs no fact; it is the issue's subject |
| **One Hindi word, L2** — *aasmaan*, in the closer's `followup` | row 6 only | contract §2, the per-desk note: space and earth may use the awe words. Passes all four tests: delete it and the English still says everything, an Indian would say it, no wince, and it sits in a prose field with no number in the sentence |

**Recommended closer, with the placement:** *"The rock is still up there in the
same aasmaan, on the same path it has always flown. On 22 December 2032 it
arrives, and it misses."* (26 w). **Zero-Hindi alternate**, if the operator wants
the space desk kept at L1: *"The rock is still up there, on the same path it has
always flown. On 22 December 2032 it arrives, and it misses."* (24 w).

**Derivations used** (arithmetic on the issue's own numbers — no new fact, no new
source, listed so the operator can rule):

1. **"about 1 in 32"** = 1 ÷ 0.031. Hook and row 4 `equals[0]`. Not strictly new:
   the published `story.beats[1]` already says "about 1-in-32".
2. **"1 in 25,000"** = 1 ÷ 0.00004. Exact, not approximate. Hook and row 4
   `equals[2]`.
3. **"thirty-one chances in thirty-two that nothing happens"** = the complement
   of 3.1%. Row 4 `equals[1]`. It is the same statement the published `paradox`
   makes in words and the CNEOS "96.2% chance that the asteroid will miss"
   quote (src-05) makes for the Moon.
4. **"three to four lakh times the rock's own width"** = 21,200 km ÷ 67 m
   (≈ 316,000) to 21,200 km ÷ 53 m (≈ 400,000). Row 5, tile 5 note. **The range
   is deliberate**: using the ~60 m central estimate would give one tidy "3.5
   lakh" that the published size range does not support. Two of the issue's own
   numbers, no third.
5. **"six days"** = 18 Feb 2025 → 24 Feb 2025. Hook, row 1, rows 2 and 5.
6. **"fifteen months"** — carried, not derived. The dossier §2 calls it a
   "~15-month risk-resolution arc" and the published issue says "Fifteen
   months". Kept in the published form.

**One fact that is new to the issue and old to the record — ruling requested.**
Row 3's third term, **the 1% line**, comes from dossier §4 ("the >1% impact
probability is the threshold that triggered the international planetary-defense
notification process"), sourced to **src-04, which the issue already carries**.
It has never appeared in the published issue. It is the single most useful thing
the dossier left on the table: it is what makes a 3.1% reading a *procedure*
rather than a scare, and without it the reader has no scale for "is 4% a lot".
I recommend taking it. If you would rather the rewrite add nothing at all, cut
term 3 and row 3 becomes a two-term `jargon-buster` at 74 words.

**Not used, deliberately.** No cricket-pitch comparison for the 53–67 m rock, no
Delhi-to-Chennai for the 20,000 km, no "the size of a 20-storey building". Every
one of them needs a second number the issue's `sources[]` does not carry, and a
composer does not add sources. The rock's own width is the only honest yardstick
in the record, which is why it is the one used.

## 6. The three questions

What the issue must teach. Written from the dossier and the published record,
not from any draft; the reader panel answers them from the draft alone. If the
draft cannot teach these, the draft is wrong.

1. **Q:** The odds of hitting Earth went from 3.1% to 0.004% in six days. What
   changed in those six days?
   · **A:** Not the asteroid. It stayed on the same orbit the whole time. What
   changed was how precisely astronomers knew where it would be on 22 December
   2032. Fresh observations shrank the box of possible positions until Earth was
   outside it.
   · rows 1, 2, 3 · §4 peak 3.1% (18 Feb 2025) and 0.004% (24 Feb 2025);
   §5 Wasser quote · src-03, src-04, src-01.
2. **Q:** Why did the chance of hitting the *Moon* go up through 2025, to about
   4%, before it went to zero?
   · **A:** Because the box was still shrinking around a path that ran close to
   the Moon. As Earth dropped out of the box, the Moon still sat inside the
   smaller one, so its share of the odds rose — 1.7%, then 3.8%, then 4.3% by
   3 June 2025. The 2026 observations put the Moon outside the box too, and the
   figure went to zero.
   · rows 2 (and its second annotation), 3, 5 · §4 lunar arc 1.7 → 3.8 → 4.3 → 0
   · src-04, src-05, src-06, src-01, src-02.
3. **Q:** What finally settled it, and how close does the rock actually come?
   · **A:** Two Webb observations, on 18 and 26 February 2026, among the faintest
   ever made of an asteroid, tracked against star positions fixed by Gaia. They
   pinned the 2032 position two years before any ground telescope could. It
   passes more than 20,000 km beyond the Moon on 22 December 2032.
   · rows 2, 5 · §4 decisive observation dates; §4 Gaia anchor; §4 miss distance
   · src-01, src-02, src-07.

Questions 1 and 3 are answerable from a drawn graphic alone. Question 2 is the
one this spine has to work for: it is answered by the timeline's second
annotation plus the `jargon-buster`'s first two terms, and if the panel cannot
answer it, the fix is the eight-row variant in §8f, not more prose.

## 7. Names

**Seven**, against a ceiling of 12, and against the 34 NASA mentions plus eight
other named bodies the published issue carries. The five spare slots should stay
spare. NASA falls from 34 mentions to three inside reader-facing sentences.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **2024 YR4** | the asteroid this issue follows — the designation is the subject, used once per section at most | throughout |
| **NASA** | the agency whose planetary-defence desk published every one of these odds | row 2 (Dec 2024 note), row 4 `note`, row 6 attribution |
| **ESA** | Europe's space agency, which ran the same numbers and announced the same all-clear | row 2 source label, row 5 source line |
| **Webb** | the space telescope that made the measurement nothing on the ground could | row 2 (Feb 2026 event), row 5 (size tile note) |
| **ATLAS** | the NASA-funded survey in Chile that found it | row 2 (Dec 2024 event) |
| **Gaia** | the mission whose star map every Webb measurement is made against | row 2 (Feb 2026 note) |
| **Molly Wasser** | NASA Science, who wrote the all-clear the day it was announced | row 6 attribution only |

**Described, not named** (all currently named in the published issue): the Minor
Planet Center → cut, "first reported" carries it; **Río Hurtado** → cut, it is
ESA's station name for a place NASA gives only as Chile, and the reader gains
nothing from the station; **NIRCam** → cut, "Webb" is the instrument the reader
knows; **CNEOS** → "NASA's near-Earth object desk" if it is needed at all;
**the Asteroid Terrestrial-impact Last Alert System** → the expansion goes, the
acronym stays; **Andy Rivkin and Julien de Wit** → described, not named, at the
almond quote (see §8c.3 — this is a ruling, not a default). Chile, Earth and the
Moon are places, not names, and do not spend from the ration.

**Source lines only, never inside a sentence** (rule 9, tell 9): NASA Planetary
Defense blog · NASA Webb blog · ESA Planetary Defence · NASA 2024 YR4 Facts.
Every "(NASA, 19 Feb 2025)" style citation currently sitting inside a
`data-readout` tile note comes out of the note and into the section's `source`.

## 8. Composer notes

### 8a. What carries over, section by section

Component `data` is expensive and already verified, so the rewrite reuses it
wherever the register allows. The verifier's trace holds because no number
changes. **Numbers are copied from the published file, never retyped** (rule 13).

| Published section | Verdict | Detail |
|---|---|---|
| `prose` — "A percentage that *lurched*" | **cut as a section, content re-drawn** | ~280 words plus a 76-word `skimCaption`. Its lead and paragraph 1 are the misread, and become row 1's `think` panel in 24 words. Paragraph 2's "a probability is only a reading off the size of that box" becomes row 3, term 1. Paragraph 3's closer becomes row 1's `note` and row 6's `followup`. The `skimCaption` goes with it, and the restatement it was carrying moves into row 2's intro, where a reader can actually see it (contract rule 5: `skimCaption` renders only in Skim mode). **This is the change the floors force** — the issue may not open on prose. |
| `timeline` | **carried, 8 → 6 events, notes halved** | Every date, figure and quoted fragment unchanged. **Cut:** *Feb 19 2025* (the 1.5% intermediate reading — the story needs the peak and the floor, not the step between them) and *Apr 2 2025* (the 3.8% lunar reading, folded into the Jun 3 event, and the 53–67 m size it carries is already `data-readout` tile 4). Notes fall from ~25 words each to ≤ 14, one at 20. Gains `annotations[]`, an authored `plain`, `layout: wide`, and becomes the hero. `source` label extends to cover the Webb blog (src-07) for the almond fragment. |
| `signal-readout` | **CUT — ruling requested, §8c.1** | |
| `data-readout` | **all six tiles verbatim, notes halved** | `value`, `unit` and `label` unchanged on every tile, including "53–67" / " m", ">20,000" / " km" and "Dec 22" / " 2032". Notes fall from ~22 words to ≤ 12 and the inline "(NASA, 19 Feb 2025)" citations come out into the section `source` (tell 9). Tile 1's note changes subject to avoid restating row 4. Tile 5 gains the lakh derivation. `caption` carried verbatim. |
| `trajectory-arc` | **CUT — ruling requested, §8c.2** | |
| `paradox` | **cut as a kind; its Structural Read is promoted** | The catalog's USE WHEN for `paradox` is "two facts that are **both true** and pull in opposite directions". The Surface Read is not true — it is the misread the issue exists to correct, which is `you-think`'s shape exactly, and `you-think` now carries it in row 1 at a third of the words. The Structural Read's Wasser quote is promoted to its own `quote` closer, verbatim, which is the dossier §5's own recommendation ("strong candidate for the paradox section or the closer"). The Structural Read's three-sentence anaphoric staircase, which the verifier flagged as advisory, goes with the section. |
| `story.beats` | **indices re-mapped, all four texts re-registered** | §8e. |
| `sources[]` src-01 … src-08 | **all eight unchanged, all eight still in use** | src-05 backs the size tile, src-06 the 4.3% tile, src-07 the almond and the Feb 2026 event, src-08 the discovery. Nothing becomes an orphan. |
| frontmatter | **`id`, `topic`, `publishedAt`, `status`, `tags` unchanged** | `readTimeMinutes` 7 → 4. `title`, `hook`, `dek`, `primer` per §4. The optional `voice` field is currently unset; leave it unset or set `CONVERSATIONAL EXPLAINER`, the dominant job. |

### 8b. Sourcing, and the verifier's optional notes

Every row needs a `source` under CANON §7. The published issue satisfies this on
five of six sections; the `prose` section carries none and is being cut anyway.

| Row | `source` | `sourceRefs[]` |
|---|---|---|
| 1 `you-think` | NASA Planetary Defense blog | src-03, src-04 |
| 2 `timeline` | NASA planetary-defence and Webb blogs, with ESA | src-01, 02, 03, 04, 06, 07, 08 |
| 3 `jargon-buster` | NASA Planetary Defense blog | src-01, src-04 |
| 4 `number-sense` | NASA Planetary Defense blog | src-03, src-04 |
| 5 `data-readout` | carried verbatim from the published section | src-01…08 |
| 6 `quote` | NASA Planetary Defense blog, 5 March 2026 | src-01 |

**Backfill `sourceRefs[]`, which is the verifier's optional note 2.** They are
empty on every section today. The rewrite touches all six sections, so this is
free now and expensive later.

**Verifier optional note 1 (the lunar-peak framing)** is settled by keeping the
published split: the tile value stays "4.3" and the ESA "around 4%" rounding
stays in its note, now at ≤ 12 words.

**Verifier optional note 3 (the "least constrained" synthesis)** is kept but
plainer. The timeline's first annotation says "the orbit was at its least
known", which is the same editorial synthesis the verifier called defensible,
in words a reader does not have to unpack. It is supported by the Wasser quote
in row 6 and by the mechanism in row 3.

### 8c. The three rulings I am asking for

> ## SETTLED — operator ruling, 2026-09-14
>
> Every ruling settled as the composer recommended. The reasoning below is kept
> verbatim; this block is what the drafter executes.
>
> 1. **`signal-readout` is CUT.** Its four bars were editorial values. The beat
>    survives as `jargon-buster` term 2 plus the timeline's Feb 2026 node.
> 2. **`trajectory-arc` is CUT.** One of its eight numbers was published and the
>    form misdescribes a flyby as an ascent. The clearance is carried by the
>    `data-readout` tile that already holds it, with the lakh comparison in its
>    note, plus the timeline's final event. No drawn alternative is honest on
>    this record, and a rewrite may not add a source.
> 3. **The 1% notification threshold is TAKEN** (dossier, src-04, already in
>    `sources[]`). Row 3 is a three-term `jargon-buster`. It is what makes 4% a
>    procedure rather than a scare.
> 4. **The almond quote is TAKEN** into the timeline's Feb 2026 note at <= 20
>    words, verbatim fragment, with the two co-principal investigators
>    **described, not named** (rule 9). Add src-07 to that section's
>    `sourceRefs`.
> 5. **One Hindi word, *aasmaan*, in the closer.** The per-desk note licenses it
>    for space. It must pass the skip test: delete it and the English still says
>    everything. Nowhere near a number, and nowhere else in the issue.
> 6. **The eight-row variant in 8f is DECLINED.** It lands over the 1,100
>    ceiling and would have to be paid for out of the tile notes. The six-row
>    spine ships as composed, with its ~210 words of headroom intact.
>
> ### The `story:` block — the part that breaks silently
>
> `selectStoryCards` in `src/lib/story.ts` reads `story.beats` in **authored
> array order** and does **not** sort it, and `sections[b.section]` is a plain
> **0-based** array index. A beat pointing at an index that no longer exists is
> dropped by the `.filter` with no error and no build failure, so a stale index
> costs a story card silently.
>
> Both cut sections were story-beat targets. Remap all four, and **rewrite all
> four beat texts in the register** (they are in the social voice and two of
> them describe sections that no longer exist):
>
> | Beat | Published `section:` | Published target | New `section:` | New target |
> |---|---|---|---|---|
> | 1 | `1` | timeline | `1` | timeline |
> | 2 | `3` | data-readout | `4` | data-readout |
> | 3 | `4` | trajectory-arc **(cut)** | `0` | you-think |
> | 4 | `5` | paradox **(cut)** | `5` | quote |
>
> **Order the array ascending: 0, 1, 4, 5.** Array order is reading order, so
> this makes the story arc run reframe -> the fifteen-month arc -> the numbers ->
> NASA's own words, which is the issue's own spine order. Beat 3's published
> text is about the flyby geometry and beat 4's is about the paradox: neither
> subject survives, so both need writing from scratch against their new targets.


**1. `signal-readout` — CUT. Recommended.**
Four bars at 22 / 54 / 94 / 88 out of 100, with a caption that says "SCHEMATIC —
relative orbit-precision gained per observation pass, not published
measurements" and a source line that says "Bar values are editorial." Under the
register plan a graphic whose values are editorial is a graphic that fails the
verifier's trace, and the honesty labels the draft added are doing the work a
component should not need. The researcher flagged this in the dossier's own
notes ("If the editor dislikes editorial-scale viz, drop signal-readout").
**The beat survives and is better served.** "Each pass buys precision, not a new
orbit" is a *definition*, not a distribution across bands, and it is now said in
row 3, term 2 ("The error box: the stretch of space the asteroid could be in on
the day. Every fresh sighting shrinks it") plus the timeline's Feb 2026 node.
*The alternative, if you want the campaign drawn:* a `beat-sheet` (time-marked
beats, no invented values) at row 3's slot — but it is text-only in the gate,
like `jargon-buster`, so it is a swap, not an addition. *What would unblock the
kind itself:* a published per-band SNR or astrometric-uncertainty table for these
observations. None exists on the allowlist, and the one document that might
carry it — the NASA NTRS "Lessons Learned from Near-Earth Asteroid 2024 YR4"
PDF — is the one the researcher could not parse. That is a research job.

**2. `trajectory-arc` — CUT. Recommended, and more strongly than 1.**
It is the same pattern with less behind it. Its four `phases[]` carry eight
numbers and exactly one of them is published: the 21,200 km closest approach.
`altKm: 60000`, `downrangeKm: 90`, `apoapsisKm: 60000` and the rest are
invented, and the form itself misdescribes the event — the catalog's USE WHEN is
"a flight path by altitude and downrange — launch/ascent phases with real km
values", and the default plain line reads "A rocket's flight from launch to
orbit." A flyby is not an ascent.
**A schematic geometry does not earn its place when one number is real**,
because the reader cannot tell which mark is the measurement. The clearance is
one number, so the plainest honest kind for it is the `data-readout` tile that
already carries it, now with the lakh comparison in its note, plus the timeline's
final event. *The alternative, if you want the geometry drawn:* there isn't one
that is honest. `orbit-trace` would need the Moon's orbital radius to place the
ring; `eclipse-cone` would need three radii and two distances; `solar-system`
would need the object's orbital elements. **None of those numbers is in the
dossier or the published issue**, and a rewrite may not add a source. Capturing
2024 YR4's elements from JPL SBDB would unlock `solar-system`, which is the
right kind for this story, and that is a research job for a future issue.

**3. The almond quote — take it into the timeline note, speakers described.
Recommended, reversible.**
*"2024 YR4 is exceedingly faint right now, reflecting about as much light as an
almond at the distance of the Moon"* is already in the issue as `sources[].quote`
on src-07 and is used nowhere in the body. It is the best register asset in the
entire record: an everyday object, in a primary source, explaining exactly why
nobody could simply look again. I have put the verbatim fragment — *"about as
much light as an almond at the distance of the Moon"* — in the timeline's
Feb 2026 note at 20 words, the gate's exact ceiling, with the two co-principal
investigators **described rather than named** (rule 9: a name used once is a name
to cut) and src-07 on the section's `sourceRefs`. *If you want them named*, it
costs two of the five spare name slots and about six words; say so and the
drafter writes "the two astronomers who led the Webb runs, Andy Rivkin and
Julien de Wit". *If you want it out*, the note reverts to "Among the faintest
observations of an asteroid ever made, tracked against Gaia's star map" and the
issue loses its only concrete object.

### 8d. Kinds I wanted and could not use

| Kind | Why it fitted | What blocked it |
|---|---|---|
| `solar-system` [3D] | The flagship for exactly this argument: a real orbit crossing Earth's neighbourhood on a real date, with the story object flagged. It would answer "where does it actually go" with no invented coordinate. | `bodies[]` needs a, e, i, Ω, ω, M0, period **and the epoch M is quoted at**, from JPL SBDB or equivalent. The dossier captured none of them — it predates the storyboard step and captured aggregates, not elements. A rewrite may not add a source. **This is the one to unblock if the issue is ever revisited.** |
| `approval-chart` | Two opposed series over time whose crossover is the story is *literally* the Earth-falls / Moon-rises shape, and it carries an `annotations[]` slot. | The catalog's DON'T USE is explicit: "non-opinion series". `points[]` are keyed `approve` / `disapprove` and the component labels them that way. An impact probability in an approval chart is a mislabel the reader has to unlearn. |
| `benchmark-chart` | Every odds reading as a bar against a `refValue` of 1 — the notification line — with one highlighted and an `annotations[]` slot. | DON'T USE: "change over time (→ `adoption-curve` / `scaling-plot`)". Every reading is a point in a series, and ranking them by size would hide the only thing that matters, the order they arrived in. |
| `orbit-trace`, `eclipse-cone` | Either would draw the >20,000 km clearance to scale, which is the beat `trajectory-arc` was reaching for. | `orbit-trace` needs `altKm` per named orbit (the Moon's orbital radius is nowhere in the record); `eclipse-cone` needs three radii and two distances. Neither is in the dossier. |
| `margin-bullets` | "Measurements each against its own requirement" is the shape, and the 1% line is a real requirement. | DON'T USE: "values sharing one unit and scale". Every reading is a percentage. The build also refuses fewer than four rows and needs a real `max` per row. |
| `throughput-dial`, `swing-dial` | One number with zones; one value between two blocs. | `throughput-dial` is specified for throughput or utilisation, not a probability, and a speedometer tells the reader to feel it as a live operational reading. `swing-dial` needs a signed value for "where the risk sits" that exists nowhere in the record. |
| `finish-interval` | A published point estimate with an interval around it — the 53–67 m size, best estimate ~60 m ± 7 — is its shape on paper. | It wants several entities whose intervals overlap, from a named model. One object with one range is not that, and the catalog's capture note forbids inventing a range around a point estimate. |
| `comparison` | ATLAS found it, Webb measured it, Gaia supplied the star positions the measurement is made against. Three peers, attribute by attribute, and it would have retired the instrument names into column labels instead of sentence furniture. | No data gap at all. **`comparison` is in `TEXT_ONLY` in `scripts/check-prose.mjs`**, so it costs a visual row instead of buying one. Adding it to this spine drops the visual share to 50% and puts two text-only sections side by side. The three instruments ride the timeline's Dec 2024 and Feb 2026 events instead. |
| `three-steps` | The mechanism in three cards, needing no numbers at all: the box is fat, every pass shrinks it, the Moon ends up outside. It is the cleanest possible answer to quiz question 2. | Also `TEXT_ONLY`, and there is no adjacency-safe slot for a third text-only section in a six-row spine. Its content is carried by the `jargon-buster`'s three glosses, which do the same work in the same slot. If you prefer it, swap it for row 3 (same slot, same 96-word budget) — or take §8f. |
| `analogy` (`pairs[]`) | A this ↔ that mapping for the shrinking box (a search for a lost phone narrowing street by street). | Text-only again, and the mapping it would carry already sits inside row 3's glosses next to the real numbers. Memory of the last three storyboards: `analogy` loses this trade every time. |
| `number-sense`, a second time | On the >20,000 km miss, where the lakh comparison would get a whole section. | Nothing blocks it except taste: two `number-sense` sections in six is a tic, and the miss distance already has a tile with an accent and now a lakh note. It is the fifth visual row in §8f if you want the spine longer. |

### 8e. The story-beat mapping — this must be checked before the draft ships

`story.beats[].section` is **a 0-based index into `sections[]`**
(`src/content/config.ts`: `section: z.number().int().nonnegative()`, "index into
sections[]"). The published file's four beats confirm it: beat `section: 1`
carries the fifteen-month arc and `sections[1]` is the timeline. **A drafter who
reads those numbers as 1-based will point every beat at the wrong card.**

New `sections[]` order, 0-based: **0** `you-think` · **1** `timeline` ·
**2** `jargon-buster` · **3** `number-sense` · **4** `data-readout` ·
**5** `quote`.

| Published beat | Pointed at | Now | Points at | What happens to the text |
|---|---|---|---|---|
| `section: 1` · "The 15-month arc" | `timeline` | **`section: 1`** | `timeline` — unchanged target | Keep the beat, re-register it. "The strangest part" survives as a thumb-stopper; the social voice stays, the register pass applies (`_voice-social.md` governs format, `_voice-core.md` governs voice). |
| `section: 3` · "What actually changed" | `data-readout` | **`section: 4`** | `data-readout` | Index moves by one. Text keeps "about 1-in-32" — it is where the framing comes from — and keeps "Same asteroid, same orbit, the whole time." |
| `section: 4` · "The geometry" | `trajectory-arc` | **`section: 0`** | `you-think` | **The target is cut.** The beat's "crossing a road is not the same thing as standing in traffic" analogy has nothing left to sit on and is unsourced framing. Replace with the inversion, which is the better social beat anyway: same rock, same orbit, 1 in 32 to 1 in 25,000 in six days. Beats then run 0, 1, 4, 5 — still ascending. |
| `section: 5` · "Why up came before down" | `paradox` | **`section: 5`** | `quote` | Index unchanged, target changed. The reversal it carries ("MORE telescope time made the odds go UP") is the issue's argument and survives, but the beat must not import the "A shrinking circle of uncertainty has to sweep across Earth" sentence — that is the cut `paradox`'s wording and it is the issue's one reversal, already spent in the hook. |

`cta` carries over as written. Four beats, inside the schema's 3–6.

### 8f. If you want the spine longer — the eight-row variant, costed

Insert two rows and the spine becomes **V V T V T V V T**, 5 visual of 8
(62.5%, still over the floor), adjacency intact:

| Insert | Where | Kind | Words | What it buys |
|---|---|---|---|---|
| new row 5 | after `number-sense`, before `data-readout` | `three-steps` | ~100 | Quiz question 2 becomes unmissable: the box is fat, every pass shrinks it, the Moon ends up outside. The Wasser quote could then move into its intro if you would rather not close on a `quote`. |
| new row 7 | after `data-readout`, before `quote` | `number-sense` (second) | ~100 | The >20,000 km miss as a felt number, with the lakh comparison as a full `equals` line instead of a tile note. |

New total, counted the way the gate counts: **~1,120 words**, which is **20 over
the ceiling**, because each new row also brings an eyebrow, a title and a source
line. So the variant is not free: taking it means also taking 30 words out of
row 5's six tile notes (§8g, the designated slack), which lands it at ~1,090.
Its other cost is two `number-sense` sections in one issue. My recommendation is
the six-row spine as composed; this variant exists so that you can take it in
one edit rather than send the storyboard back.

### 8g. The designated slack

If a row overruns, **row 5's six tile notes pay first** (≤ 12 words → ≤ 9 saves
18) and then **row 2's fourth and fifth event notes** (≤ 14 → ≤ 10 saves 8).
Nothing pays out of row 1, which is protecting the 80-word floor, or out of
row 6's quote, which is verbatim.

### 8h. Three things the drafter must not do

1. **Do not reach for "It is not X. It is Y." anywhere.** The issue's one
   reversal is spent in the hook (§4). The verifier already logged the quota as
   spent in the published issue, and this rewrite spends it in a different place.
2. **Do not re-type a number.** Every figure in rows 2 and 5 is copied from
   `src/content/issues/2026-06-04-asteroid-2024-yr4/index.mdx`, including the
   en-dash in "53–67" and the ">" in ">20,000". Rule 13, and the gate diffs them.
3. **Do not put a citation inside a sentence.** "(NASA, 19 Feb 2025)" appears six
   times in the published tile notes. All six come out; the `source` line carries
   them (rule 9, tell 9). No em-dash in any prose field, and no semicolons.
