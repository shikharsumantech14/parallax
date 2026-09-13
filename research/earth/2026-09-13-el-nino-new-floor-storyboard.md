# Storyboard: Now even the *cool* years break records

- **Category:** earth
- **Dossier:** research/earth/2026-05-03-el-nino-new-floor-dossier.md
- **Rewrites:** src/content/issues/2026-05-03-el-nino-new-floor/index.mdx (published; slug and sources unchanged)
- **Composed:** 2026-09-13
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-13; rulings in §9

> Created under `docs/REGISTER-PLAN.md` §5.2; RG-07 ruled 2026-09-13: a
> separate composer agent, and the gate is a switch. The storyboard is written
> after the dossier and before the draft. It maps every point the reader must
> get to the component that shows it, chosen from all twelve data shapes in
> `docs/design/catalog-shapes.md`, and fixes how many words may sit around each
> one. The drafter executes it the way it executes the dossier; the verifier
> checks the draft matched it.
>
> **This run is a Phase 4 rewrite** (REGISTER-PLAN §8.1): the issue is already
> published and already verified. No fact is new. Every row below is either
> data the published issue carries verbatim or a dossier §3/§4 row the issue
> did not yet show. Section 8 lists what carries over, what is cut, and what is
> re-kinded.
>
> **The gate.** `GATES.storyboard` in `scripts/pipeline.config.ts` is the one
> switch, read by both routes (the API CLI and the `/pipeline-draft` command):
> - `'required'` (the setting until the first ten issues have run): the drafter
>   runs only when this file says `Status: approved`. The operator reads the
>   table, edits rows if needed, and flips the status.
> - `'auto'`: the drafter also runs on `Status: draft`.
> - `Status: hold` parks the issue in either mode.

---

## 1. The argument in one line

El Niño and La Niña used to cancel out. They don't any more: the sea keeps 91
of every 100 units of extra heat, so each cool year starts higher.

*(30 words. Dossier §1, restated at L1.)*

## 2. The hero

**`climate-strip`** · shape **G4** (time series and dated sequence) · row 2 ·
`layout: wide`.

It renders the annual global mean temperature anomaly above the 1850–1900
baseline for **1970–2026** — the 57-value series the published issue already
carries verbatim — plus **two new annotations** (`data.annotations[]`,
`docs/design/blueprints/_ANNOTATIONS.md`; `at` = the year):

| `at` | `text` (≤ 12 words) | What it states |
|---|---|---|
| `2016` | "The old record: 2016's El Niño peak." | the landing the staircase started from (1.29 in the series) |
| `2025` | "A La Niña year, and still above the 2016 peak." | the finding (1.44 in the series) |

**Why this is the hero.** The argument *is* the shape of the record. One strip
shows fifty-seven years at once, and the reader sees without reading an axis
that the recent cool stripes are darker than the old hot ones. The published
issue told this in 74 words of prose (`_voice-core.md` §9 quotes that very
paragraph as the before-example); the strip plus two callouts says it on the
mark. It is the one component every other row supports: rows 1 and 6 give its
two endpoints as numbers, row 5 gives the mechanism behind its slope, row 7
gives its dates.

It is the only row that may take `layout: split`. **Recommended: `wide`** —
see §8, this is an operator call.

Dossier rows it renders: §4 *Temperature staircase* (all five bullets), §4
*2026 temperature projection* (the 1.47°C best estimate that ends the series),
§3 timeline rows 2016 / 2020–2022 / 2023 / 2024 / Mar 2026.

## 3. The beats

Nine rows. Six visual (67%), three text-only, never two text-only adjacent,
row 1 is a figure, zero WebGL, zero `bleed`, one hero, one `prose`, no
`paradox`. Five kinds sit outside the six workhorses.

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | You think the hot year and the cool year cancel out. In 2025 the cool year came in second-hottest ever. | G2 · one belief corrected by one figure | `you-think` | — | **95** · no intro (see §4); `think` ≤ 22 · `actually` ≤ 22 · note ≤ 18 · caption ≤ 12 · source | — (the figure does the work; the analogy arrives at row 5) | "Two panels: on the left what most people assume, on the right what the numbers show, with the one figure that settles it." | *Temperature staircase* → 2025 = 1.44°C, tied 2nd warmest; §3 timeline 2016 ≈ 1.25°C |
| 2 | Fifty-seven years in one strip: the cool years at the end are darker than the hot years in the middle. | G4 · one annual value per year | `climate-strip` | **HERO** | **80** · intro ≤ 25 · 2 annotations ≤ 12 each · caption ≤ 10 · source ≤ 12 · `plain` omitted (the catalog default fits) | — | "One thin stripe per year, coloured by its value; the drift of colour across the strip is the trend." (catalog default — do not author) | *Temperature staircase* (all); *2026 projection* 1.47°C; §3 rows 2016, 2020–2022, 2023, 2024 |
| 3 | Three words this issue can't do without: the cycle, the baseline, the imbalance. | G1 · narrative | `jargon-buster` | — | **90** · 3 terms × meaning ≤ 25 · optional `hindi` ≤ 10 each · title + eyebrow | "garam saal, thanda saal" as the Hindi gloss on El Niño / La Niña | — (narrative kind; no plain line) | *Earth's energy imbalance* (the imbalance definition, carried from the published paradox intro); the 1850–1900 baseline carried from the published `climate-strip` |
| 4 | Of every 100 units of extra heat, 91 go into the sea. One stays in the air you feel. | G3 · one big number made physical | `number-sense` | — | **80** · `label` ≤ 8 · 2 `equals` ≤ 14 each + notes ≤ 12 · note ≤ 20 · caption ≤ 12 · source | "39 times everything the human race uses in a year" — the dossier's own scale line, no new fact | "One number, large, and beside it the everyday things it equals, so the size can be felt rather than read." | *91% figure*; *5% land, 3% ice, 1% atmosphere*; *Ocean heat content record* (23 ZJ ≈ 39× annual human energy production) |
| 5 | The mechanism in three moves: heat goes in, El Niño spills a little out, La Niña can't put it back. | G1 · narrative, ordered | `three-steps` | — | **90** · intro ≤ 13 · 3 cards × (title ≤ 6 + text ≤ 25) · source | **The geyser that never switches off** — reuse the earth-showcase cards verbatim (`2026-06-03-earth-showcase`, rows "HOW THE FLOOR RISES"); already in the register | — (narrative kind; no plain line) | *91% figure*; §1 (the ratchet); §4 *2025* (La Niña contributed −0.05°C) |
| 6 | Two peaks, two troughs, and the troughs keep landing higher. | G3 · a few headline numbers | `data-readout` | — | **125** · intro ≤ 15 · 6 tiles × (label ≤ 6 + note ≤ 14) · caption ≤ 8 · source ≤ 12 | — | "A grid of instrument tiles; each shows one number and its label, and the accented tile is the headline reading." | *Temperature staircase* → 2022 (1.1–1.3°C, 5th–6th), 2024 (1.55°C), 2025 (1.44°C, −0.05°C), 2024 El Niño +0.128°C; *11 hottest years* |
| 7 | Peak, trough, peak, trough — then April 2026, when the next one was called. | G4 · dated sequence | `timeline` | — | **145** · intro ≤ 12 · **6 events** × (label ≤ 7 + note ≤ 20) · 1 annotation ≤ 12 · source ≤ 10 | — | "Events stacked in time order down a spine; the highlighted nodes are the turning points." (catalog default — do not author) | §3 rows Nov 2015, 2020–2022, 2024, Mar 23 2026, Apr 9 2026, Apr 24 2026; §4 *2025* |
| 8 | What the models agree on: a super El Niño by September, and the record landing a year late. | G3 · a few headline numbers | `data-readout` | — | **115** · intro ≤ 14 · 6 tiles × (label ≤ 7 + note ≤ 12) · caption ≤ 7 · source ≤ 12 | — | "A grid of instrument tiles; each shows one number and its label, and the accented tile is the headline reading." | *2026 El Niño forecast* (61%, +2.2°C median, super = +2.0°C); *2026 temperature projection* (62%, ~30%, 1.47°C, the ~3-month lag); *Arctic sea ice* |
| 9 | The Pacific peaks first and the world's record follows about three months later — so the next cool year starts above 1.44°C. | G1 · narrative | `prose` | — | **140** · lead ≤ 35 · 2 paragraphs ≤ 90 each is the ceiling, **budget 105 total** · `skimCaption` ≤ 55 (counted inside the 140) | The staircase returns: "the next landing sits above the last one" | — (narrative kind; no plain line) | *Lag effect* (1998, 2016, 2024); *2026 temperature projection* (19% warmest); §1 closing sentence |

**Budget.** Head 78 + rows 960 = **1,038 reader-facing words** (cap 1,100; 62
spare). Words before the first figure: **78** (cap 80) — see §4. The published
issue measures **1,774** across 50 blocks (REGISTER-PLAN §1.2), so this is a
41% cut with three more sections showing rather than telling.

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

**Floors and ceilings, checked before writing:**

| Rule | This storyboard |
|---|---|
| ≥ 6 in 10 sections visual | 6 of 9 = 67% (rows 1, 2, 4, 6, 7, 8) |
| Never two text-only adjacent | text-only at 3, 5, 9 — separated by a figure each time |
| First section after the head is a graphic or `data-readout` | row 1 `you-think` (VizCard figure) — see §8, one operator call |
| ≤ 80 words before the first graphic | 78 |
| ≤ 1,100 reader-facing words | 1,038 |
| ≤ 3 `prose`, each ≤ 200 words | one, budgeted 140 |
| ≤ 1 `paradox` | zero (the published one is cut — §8) |
| ≥ 1 kind outside the six workhorses (≥ 2 where data allows) | five: `you-think`, `climate-strip`, `jargon-buster`, `number-sense`, `three-steps` |
| `timeline` ≤ 6 events, notes ≤ 20 words | 6 events (down from 9) |
| One hero | `climate-strip`, row 2 |
| ≤ 3 loud, never two WebGL adjacent, quiet after loud | zero WebGL, zero `bleed`, zero full-width animated — nothing loud |
| Every chart with a finding carries ≥ 1 in-graphic callout | `climate-strip` 2, `timeline` 1 |
| ≤ 12 names | five, all organisations (§7) |

## 4. The head

- **Title (states the finding, ≤ 8 words):** **Now even the *cool* years break
  records** — 7 words, one accent word. Retires *The Pacific That No Longer
  Resets* (AI-tell 7, the "The ‹Noun› That ‹Verb›s" formula; nine of ten
  published titles used it).
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  *You have lived through the eleven hottest years ever recorded. The last of
  them, 2025, was supposed to be a cool one.* — 22 words. Number: eleven,
  2025 (dossier §4, *11 hottest years*). "You": yes. The twist sits in
  "supposed to be", and the hook does **not** reverse, which is what leaves
  the dek free to.
- **Dek (≤ 14 words; carries the Hindi if the title has none):** *A staircase,
  not a jhoola — and it only goes up.* — 10 words. One antithesis dek, the
  issue's only one (AI-tell 8), allowed because the hook does not reverse.
  *jhoola* passes the four tests: delete it and the English still says
  everything; it is the word an Indian would use for a swing; it is nowhere
  near a number or a source; Roman, set roman.
- **Primer (three sentences: what happened · why it matters to you · what
  you'll see):** *El Niño warms the Pacific and La Niña cools it back. Since
  2015 the cooling stops short, so every year you live through starts hotter
  than the last. Below: the record since 1970, and what April 2026 started.* —
  38 words, ~215 characters (schema bound 80–420).

**Head total: 7 + 10 + 22 + 38 = 77, plus row 1's intro = 78.** Row 1 carries
**no intro** — `you-think`'s two panels are self-explaining and the
eighty-word floor has no room for one. If the operator wants an intro on row
1, the primer drops to two sentences.

## 5. The Indian ground

**The dossier carries no Indian fact.** There is no Indian place, institution,
figure or study in §3, §4, §5 or §6 — the sources are WMO, NOAA, Carbon Brief,
Copernicus. The drafter must **not** add a monsoon link: every Indian monsoon /
El Niño claim that suggests itself here is a real and contested scientific
claim, it needs a source, and this rewrite adds no sources. Say nothing about
Indian rainfall, kharif sowing, heatwaves or reservoir levels.

What the issue can honestly stand on:

| Indian ground | Basis | Needs a ruling? |
|---|---|---|
| **The geyser** (rows 5 and, if restored, the `analogy`) — the water heater in an Indian bathroom, the tap, the tank that stays hot, "the next bath starts warmer than the last" | An everyday object, not a fact. Already written and already in the register: `2026-06-03-earth-showcase` §"HOW THE FLOOR RISES" and §"THE GEYSER"; `_voice-core.md` §9 | No |
| **No currency conversion is owed.** The issue carries zero `$` figures, so the "₹ for every $" rule has nothing to convert | The published issue and dossier §4 contain no money | No |
| **Degrees need no conversion** — °C is the unit the reader already counts in. The comparison that makes 1.44°C feel like something is *another year*, not another unit | Dossier §4 throughout | No |
| **"39 times everything the human race uses in a year"** (row 4) — the scale line for the ocean's 2025 heat gain | Dossier §4, *Ocean heat content record*, verbatim. Universal, not foreign — nothing the reader had to grow up elsewhere to feel | No |
| ⚠️ **Arctic sea ice 14.29 million km² ≈ 4.3 times India's land area** (row 8 tile note) | Needs one outside constant: India's land area, 3.287 million km². It is a standard reference figure, not a claim from this dossier | **Yes — operator rules.** Allow it and the issue gains its one Indian anchor; refuse it and the tile note keeps "joint-smallest with 2025 in nearly 50 years" and the issue carries no Indian place at all |
| ⚠️ **"eleven hottest years in a row" ≈ "every year since Aarav finished school"** | No fact, but it is an invented biography. Listed only so the drafter knows it was considered and rejected | No — do not use |

If the operator refuses the Arctic comparison, the issue's Indian ground is the
geyser and the direct address, and `_voice-core.md` §3 rule 10 is met at its
floor, not its full height. Raising it needs one sourced Indian fact, which is
a research job, not a rewrite job.

## 6. The three questions

What the issue must teach. Written from the dossier, not the draft; the reader
panel answers them from the draft alone.

1. **Q:** In 2025 the Pacific was in its *cool* phase. How hot was the year?
   · **A:** 1.44°C above the 1850–1900 average — second-hottest ever recorded,
   and hotter than 2016, which was an El Niño record year at about 1.25°C.
   · dossier §4 *Temperature staircase* → "2025 (La Niña year): 1.44°C… tied
   with 2023 as 2nd warmest ever"; §3 timeline row "2016".
   · Taught by rows 1, 2, 6.
2. **Q:** Where does the extra heat go, and why can't La Niña give it back?
   · **A:** More than 91 of every 100 units go into the ocean and stay there;
   only about 1 stays in the air. El Niño spills a little of the ocean's heat
   into the atmosphere; La Niña stops the spill but cannot cool the ocean, so
   the next cool year starts from a warmer reservoir.
   · dossier §4 *Earth's energy imbalance and ocean heat* → "91% figure" and
   "5% land, 3% ice, 1% atmosphere"; §1.
   · Taught by rows 4, 5.
3. **Q:** Forecasters expect a strong El Niño to peak late in 2026. Which year
   most likely sets the temperature record?
   · **A:** 2027 — the world's temperature peak follows the Pacific's by about
   three months, as it did in 1998, 2016 and 2024.
   · dossier §4 *2026 temperature projection* → "Lag effect".
   · Taught by rows 8, 9.

## 7. Names

**Five, all organisations. No personal names.** The published issue's `quote`
section is cut (§8), which drops all three named people with it. Everything
else in the dossier is described, not named.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **World Meteorological Organization (WMO)** | "the UN's weather and climate agency" | rows 3, 7, 8; source lines |
| **NOAA's Climate Prediction Center** | "the US office that calls El Niño" | rows 7, 8; source lines |
| **Carbon Brief** | "a climate-science site that totals the year's temperature every year" | rows 1, 6, 8; source lines |
| **Berkeley Earth** | — (source line only; never in a sentence) | row 2 source |
| **Copernicus Climate Change Service** | — (source line only; never in a sentence) | row 2 source |

Described, not named, per `_voice-core.md` §3 rule 9: Wilfran Moufouma Okia
("the WMO's chief of climate prediction" — and only if the operator restores
the quote, §8), Celeste Saulo, António Guterres, the International Maritime
Organization and its 2020 shipping-sulfur rules, Inside Climate News.

## 8. Composer notes

### 8a. What carries over, what is cut, what is re-kinded

| Published section | Fate | Detail |
|---|---|---|
| `prose` "THE WATCH" | **cut** | 445 words before the first graphic. Its two working claims move: the staircase reframe becomes row 1 (`you-think`), the 91% mechanism becomes rows 4 and 5. The lead's April dates move into row 7's last event. This also retires the verifier's ⚠️ META-COMMENTARY flag ("the public still tends to ask it wrongly"). |
| `timeline` "THE STAIRCASE" | **kept, trimmed 9 → 6 events, notes recut ≤ 20 words** | Kept: Nov 2015, 2020–2022, 2024, 2025, Mar 2026, Apr 2026 (Apr 9 and Apr 24 merged into one event). Dropped: 2017–2019 (the floor it states is carried by the strip), 2023 (2024 is the stronger peak and the strip shows 2023). Gains one annotation on 2025. The verifier's ⚠️ on the Nov 2015 note ("first major ENSO event of the satellite era") is fixed by deletion — the new note says only what the dossier says. |
| `data-readout` "THE NUMBERS" | **data carries over verbatim**, one tile swapped | Four of six tiles unchanged (1.55, 1.44, −0.05, +0.128, 11). The "2026 · best estimate 1.47" tile moves to row 8 where the forecast lives; a **2022** tile (1.1–1.3°C, 5th–6th warmest — dossier §4) takes its place, because the floor argument needs the earlier trough beside the later one. |
| `climate-strip` "THE FLOOR" | **data carries over verbatim** — all 57 `values`, `palette`, `baseline`, `unit`, `caption`, `source` | Promoted to **hero** at row 2; gains `annotations` (the finding moves onto the mark) and `layout: wide`. Intro cut from 34 words to ≤ 25. |
| `paradox` "THE BATHTUB" | **cut and re-kinded** | REGISTER-PLAN §5.1 calls `paradox` "prose in a costume" and caps it at one; its 248 words are the issue's densest block. The 91/5/3/1 split becomes row 4 (`number-sense`), the ratchet becomes row 5 (`three-steps`). Every number survives; the 39× scale line survives. Saves ~170 words. |
| `data-readout` "THE FORECAST" | **data carries over verbatim**, two notes corrected | Row 8. Applies verifier fixes #4 and #5: the Arctic tile now names the partner year ("joint-smallest **with 2025**") and the 1.5°C tile restores the approximate qualifier ("**~30%**"). |
| `quote` "THE OFFICIAL READING" | **cut** | This is the section carrying the verifier's **❌ BLOCKER #1** — the Saulo quote placed "the same week" as the April announcement when the dossier dates it five weeks earlier. Cutting it resolves the blocker outright, saves ~90 words, and removes three of the issue's names. The WMO's April position survives as a ≤ 20-word paraphrase in row 7's last event, which the verifier already passed as claim #3. |
| `prose` "WHAT COMES NEXT" | **kept as row 9, rewritten and halved** | 320 words → 140. **The ~1.7°C 2027 figure must not appear** — it is the verifier's **❌ BLOCKER #2** and dossier §9 note 6 flags it [UNVERIFIED]. Keep the structural claim ("the probability for 2027 runs higher", "the next floor sits above 1.44°C"), which is fully sourced. Also drop "the framing that has to travel" (⚠️ MILD ADVOCACY) and the "not X, it is Y" close ("Surface temperature is the symptom. The reservoir is the disease") — the dek already spends the issue's one antithesis. |
| `sources[]` (13 entries) | **unchanged, all 13** | No fact is new, so no source is new and the verifier's trace holds. |
| `id`, `topic`, `publishedAt`, `tags`, `status` | **unchanged** | The rewrite replaces the issue in place. `readTimeMinutes` 7 → **4** (REGISTER-PLAN §5.1 target 4–5). |

Net: 8 published sections → 9; 1,774 words → 1,038; two prose bookends → none;
both ❌ verification blockers resolved by composition rather than by patching;
three of the four ⚠️ IMPRECISE items resolved.

### 8b. Kinds considered and rejected

| Kind | Why it was wanted | Why it is not available |
|---|---|---|
| `climate-spiral` | REGISTER-PLAN §8.1 names it for this issue, and the month-scrub would show the seasonal cycle riding the drift | **The dossier has no monthly series.** `DATA` needs `months: [{year, month, value}]`. §4 carries four scattered monthly facts (Jan 2025 warmest January, Mar 2026 +1.48°C, Q1 2026 fourth-warmest, the Jun–Sep 2023 streak) — points, not a series. `climate-strip` is the kind the evidence supports, and its `DON'T USE` sends monthly cycles to the spiral, not the reverse. Getting the spiral needs a fresh Copernicus ERA5 monthly fetch — a research job. |
| `carbon-loop` | The energy imbalance is genuinely a stock-and-flow story and the kind has never been published | **No stocks, no fluxes.** `DATA` needs ≥ 3 reservoirs with stocks and ≥ 4 fluxes in a conserved unit; the dossier has *shares* of an annual excess (91/5/3/1) and one flux-like figure (23 ZJ in 2025). The build's conservation check would have nothing to check. Also the unit is heat, not carbon. |
| `attrition-waffle` | 91 + 5 + 3 + 1 = exactly 100, four groups — the arithmetic fits the kind perfectly, and a countable 91 squares would be a strong hero-adjacent figure | **Semantics and the capture note.** The kind audits *a cohort's outcomes* — "the outcome tally for every member of one cohort as counts rather than percentages, the real sample size". The dossier gives percentages of a physical quantity and no n; `trueN` would be meaningless. Its `DON'T USE` also sends part-of-whole-by-quantity elsewhere. **An operator call:** if you want the 91 countable, this is the row-4 swap, and the caption must say plainly that the squares are units of heat, not people. |
| `region-map` | It is the earth desk's signature and would give the issue a geography | **No per-zone values.** §4 has two global shares (5.2% of the surface saw record warmth in Q1; ~90% of the ocean had a marine heatwave) and no country or zone breakdown. A map would have to invent the shading. |
| `carbon-gauge` | The 1.5°C line is the issue's threshold and the gauge is the earth desk's threshold kind | **No budget figures.** `DATA` needs remaining / used / total GtC. The dossier has none — 1.5°C appears only as a temperature the record crossed, never as a budget. |
| `throughput-dial` | The +2.2°C median against the +2.0°C "super" threshold is one value against zones | Semantically a throughput / utilisation gauge, which a forecast anomaly is not; and a needle hides that +2.2 is the *median of 637 runs*, which is the honest part of that number. The tile in row 8 states it with its note. |
| `analogy` (pairs form) | The earth showcase already carries a four-pair geyser mapping built from this exact mechanism, with the "Yeh jhoola nahi hai" punchline | **Duplicate of row 5.** `three-steps` and `analogy` would both say the geyser; the catalog sends an ordered mechanism to `three-steps` and a parallel mapping to `analogy`, and this mechanism runs in order. Also a fourth text-only row would break the 60% visual floor. The punchline is reused as the **dek** instead. **If the operator prefers the pairs form**, swap row 5 for `analogy` — same word budget, same source line, same floors. |
| `comparison` | The published issue once had a "THE FLOOR" comparison (2022 vs 2025); the verification report still audits it | It was already re-kinded to `climate-strip` before publication — the report is stale on that row. Its content is now row 1 (`you-think`) and row 6's 2022 tile. A third telling would be redundant. |
| `act-break` | CANON §3's act device | Zero uses in 23 issues; RG-06 has not ruled. Not used here, so the act rule is not invoked, and the quiet-section-per-act requirement is met anyway (rows 3, 5, 9). |

### 8c. What the operator should rule on before the draft

1. **Is `you-think` "a graphic" for the ≤ 80-word floor?** It is a VizCard kind
   and the catalog says "usually the first or second section", so I have read
   it as satisfying "the first section after the head is a graphic or a
   `data-readout`" — that is what it was built for (RG-09). If you rule it is
   not, swap rows 1 and 2: the hero `climate-strip` opens, `you-think` follows,
   and the head loses nothing (row 2's intro of ≤ 25 words would then sit
   inside the 80, which means the primer drops to two sentences). **I prefer
   the current order** — the reframe is the brand promise and it should land
   before the evidence.
2. **`wide` or `split` for the hero?** CANON §2 says the hero "should" take
   `split`, and only the hero may. I have recommended `wide` because `split` is
   the sticky scrollytelling layout and wants a column of prose beside the held
   graphic — roughly 120 words this issue does not have, since its explanation
   deliberately lives in rows 4 and 5 as separate, countable components. Ruling
   `split` costs ~120 words and means cutting row 9's prose to ~60 or dropping
   a tile from each `data-readout`.
3. **The Arctic sea ice / India's land area comparison** (§5). It is the
   issue's only possible Indian anchor and it needs one outside constant.
   Allow, or the issue carries no Indian place.
4. **Restoring a human voice.** No person is named anywhere in this plan. If
   you want the WMO's "high confidence in the onset of El Niño, followed by
   further intensification" back as a `quote` section, it goes at row 7 (between
   `data-readout` and `timeline`, which keeps every floor intact at 10 rows and
   60% visual) and costs ~90 words — so row 9's prose drops from 140 to ~100.
   The quote is verbatim in dossier §5 and was verified. **Do not restore the
   Saulo followup**: that is verification blocker #1, and dating it correctly
   (March, not April) costs more words than the line is worth here.
5. **Two kinds ship for the first time in a published issue** — `you-think` and
   `jargon-buster` (`number-sense` and `three-steps` too, if the showcase
   drafts don't count). Worth eyeballing rows 1, 3, 4 and 5 in the browser
   before the draft is verified, since nothing published has exercised them.
6. **`three-steps` and `jargon-buster` are counted here as text-only** for the
   adjacency and 60% rules, which is the strict reading (`catalog-shapes.md`
   files both under G1 · Narrative). Under the lenient reading — the composer
   floor's exclusion list names only `prose`, `quote`, `analogy`, `beat-sheet`,
   `act-break`, `plate` and `paradox` — this storyboard is 8 visual of 9 (89%).
   It passes either way; the strict count is the one in the table.

## 9. Operator rulings (2026-09-13) — binding on the drafter

Approved as composed, with these calls settled (the operator's approval took
the orchestrator's recommendations on every open item):

1. **`you-think` opens the issue** and counts as the opening graphic.
2. **The hero takes `layout: wide`**, not `split`.
3. **The Arctic sea-ice tile may compare to India's land area** — "about 4.3
   times India's land area" — the way the contract allows "the population of
   Delhi": a common-knowledge scale constant, not a new claim. The tile `note`
   states the basis ("India is about 3.3 million km²") so the verifier can
   check it (ANALOGY-CLAIM).
4. **No `quote` section is restored.** No person is named; that is fine for
   this issue.
5. **`jargon-buster` and `three-steps` count as text-only**, the strict
   reading; `check:prose` now agrees. The spine passes.
6. **The ~1.7°C figure for 2027 must not appear** (verification blocker #2).
   Keep the structural claim only.
7. **No `act-break`** (RG-06).
8. **Write in place.** The rewrite replaces
   `src/content/issues/2026-05-03-el-nino-new-floor/index.mdx` — same `id`,
   `topic`, `publishedAt`, `status: published`, `tags`; `readTimeMinutes` to 4.
   It is tabled for the operator's read before it is committed.
