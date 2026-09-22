# Storyboard: NASA bought the station's ending in 2024

- **Category:** space
- **Dossier:** research/space/2026-09-17-iss-retirement-set-by-contract-dossier.md
- **Composed:** 2026-09-21
- **Composer:** composer-agent
- **Status:** approved            ← draft | approved | hold  (the gate; see below)

> Created under `docs/REGISTER-PLAN.md` §5.2; RG-07 ruled 2026-09-13. The
> drafter runs only when this file says `Status: approved`
> (`GATES.storyboard` is `'required'`).
>
> **Fresh storyboard, not a rewrite.** No published issue, no verification
> report, no `story:` block, no number ledger — the rewrite apparatus in
> `.claude/agent-memory/composer/rewrite-runs.md` does not apply. It is the
> first storyboard of the 2026-09-17 round (six dossiers, one per desk, no
> sibling storyboards yet), so no never-published kind has been claimed by
> another storyboard in the round and the whole ledger was available.
>
> **Two things the operator should read before the table:** the spine is
> **eight rows, not the dossier's nine** (§8.1 — the dossier's own floor check
> mis-classifies `three-steps` and its row order would fire `PROSE-RUN`), and
> the **hero is `descent-profile`, not `benchmark-chart`** (§2 — the dossier
> nominates the chart whose three numbers are still `[UNVERIFIED]`).

---

## 1. The argument in one line

The space station's 2030 end date came from agreements and a delivery
schedule, not from cracks. A tug was bought in 2024, and the calendar has
run the decision ever since.

*(29 words. The mechanism the reader must end up owning is **procurement lead
time**: NASA has to decide in 2027 because replacements and extra flights are
bought three years ahead, not because anything fails in 2027.)*

## 2. The hero

**`descent-profile` (row 1) · data shape G4, time series · `layout: split`.**
The only row that may take `split`.

It renders dossier **§4.8** verbatim: four sourced altitude points on an axis
of **months counted back from the final burn** — 415 km at T−18 when the tug
launches and docks, 330 km at T−6 when the last crew leaves, 220 km where the
burn series starts four days out, and the burn itself at T−0.

**Why this and not `benchmark-chart`, which the dossier's §4.11 and §7 both
nominate as "the argument in one picture":**

1. **It is the argument.** The issue's claim is that the ending is a
   *schedule*. `descent-profile`'s x-axis is literally a schedule measured
   from a day NASA has not yet chosen — the shape is contracted, the date is
   not. `benchmark-chart` answers a different and secondary question ("why
   destroy it rather than park it?"), and it answers it with fuel physics,
   which pulls *against* the issue's own thesis that the date is not an
   engineering verdict. Making it the hero would misdirect the reader.
2. **A hero must not be the row that might be cut.** Dossier §9 marks the
   three delta-v figures `[UNVERIFIED]` — the NASA white-paper PDF could not
   be machine-read, the numbers were traced through search excerpts, and the
   researcher's instruction is explicit: *"If any one cannot be confirmed,
   GRAPHIC 4 must be cut rather than softened."* See §8.4 for the pre-planned
   one-for-one swap that covers that case.

`descent-profile` is on the never-published ledger, so the issue's hero is
also a kind no Parallax reader has seen.

## 3. The beats

Eight rows. Row 1 is a drawn graphic and carries **no `intro`** (§4).

| # | The reader must get (one line, register) | Shape | Kind | Hero? | Words (cap) | Analogy / worked example | Plain-line sketch (FORM only) | Dossier rows |
|---|---|---|---|---|---|---|---|---|
| 1 | The station's last eighteen months are already drawn, step by step, on a clock that starts from a day nobody has picked yet | G4 | `descent-profile` **[NEW]** | **HERO** · `split` | **92** | The countdown exists; the date it counts down to does not | **Author it — the default is wrong.** "Altitude falls left to right. Time runs in months counted back from the final burn, not in calendar dates. Each flag is a step the plan names." | §4.8 |
| 2 | You think cracks and air leaks are ending it. The cracks are real. The date came from a contract signed in 2024 | G2 | `you-think` (card) | — | **111** | — (the reframe is the device) | default (card) | §1, §4.2, §3 (2024-06-26) |
| 3 | The dates run ahead of the station: decide in 2027, deliver the tug by 2029, stop in 2030 | G4 | `timeline` | — | **160** | — | default ("Events stacked in time order down a spine") ✓ correct | §3 |
| 4 | Why 2027 and not 2029: a replacement needs certifying, and extra cargo and crew flights are bought about three years ahead | G1 | `three-steps` (text-only) | — | **104** | **Booking the wedding hall.** You do not book it the week of the wedding. Book three years out and the booking, not the couple, fixes the date | — (narrative kind, no plain) | §4.2, §4.4 |
| 5 | Dropping it in the ocean is the cheapest thing that can be done with it — parking it safely costs thirteen times the fuel | G5 | `benchmark-chart` | — · `wide` | **133** | **Delta-v glossed in the intro:** the fuel bill, written as speed. 57 m/s to drop it, 760 m/s to park it for ten thousand years | **Author it — the default promises a reference line this chart has not got and says "longer is better", which is backwards here.** "Each bar is one option, and its length is the fuel that option costs, written as speed. Shorter is cheaper. The highlighted bar is the one this issue is about." | §4.11 |
| 6 | India has put ₹20,100 crore behind its own crewed programme and first station module, while NASA spends about $3 billion a year flying this one | G3 | `number-sense` (card) | — | **131** | The two national figures sit side by side **in their own currencies**. No conversion, no division (§5) | default ✓ correct | §4.3, §4.5 |
| 7 | The auditor's tell: NASA had not written down how it will decide, and a decision nobody writes down is one the calendar makes | G1 | `prose` (text-only) | — | **115** | Restatement marker **required** (§8.6) | — (narrative kind) | §4.4, §5 (GAO rec 2; Hoeser) |
| 8 | Gaganyaan is aimed at 400 km — inside the same band the station flies in. India is buying into the orbit it is about to lose | G9 | `orbit-trace` **[NEW]** | — · `wide` | **168** | The closer. One LYRICAL paragraph, the issue's only one | **Author plain AND howToRead — `orbit-trace` is in `NEEDS_HOW` and its default panel talks about satellite counts this data has not got.** plain: "Each ring is one named orbit at its own height above Earth, on a squeezed scale so near and far fit together. The labels sit in a fixed column." howToRead: "Compare the rings by how far each sits from Earth, then read across to the label column for the name and the note. This diagram carries no satellite counts." | §4.9, §4.5 |

**Budget.** Head 71 + rows 1,014 = **1,085 reader-facing words**, 15 under the
1,100 ceiling. Caps count every `eyebrow`, `title`, `intro`, `caption`,
`plain`, `howToRead`, `source` and data string — `readerWords` sweeps all of
them. **Designated slack: row 7 (`prose`), which may fall to 100**, then row
3's timeline notes. Per-field caps unchanged from the contract: intro ≤ 45,
prose section ≤ 200, timeline note ≤ 20, tile note ≤ 15, annotation ≤ 12.

**Data the rows carry** (all of it lifted from the dossier — the drafter
invents no value):

- **Row 1** — dossier §4.8 exactly, but **drop the optional `phase` field on
  all four points**; it duplicates the `events[]` labels and costs 16 words.
  Keep `craftLabel`. §4.8's drawing rule is binding: four points are sourced,
  the curve between them is interpolation, **no number on the intermediate
  slope**, and the caption must say the shape is the plan's shape, not a
  measured decay.
- **Row 3** — six events, the cap. `2 Nov 2000` (first crew) · `26 Jun 2024`
  (NASA buys the vehicle, `state: 'key'`) · `17 Jun 2026` (GAO, `'key'`) ·
  `2027` (the decision, `'now'`) · `1 May 2029` (tug must be delivered) ·
  `2030` (operations end). **Notes ≤ 8 words each** to hold the cap. One
  annotation, on `2027`: *"Nothing on the station forces this date"* (7 words).
  The 2025 C3DO revision is **dropped from the timeline** — row 4 carries the
  replacement mechanism, and seven events breaks the cap.
- **Row 5** — dossier §4.11 exactly. `sortDesc` so the 760 bar leads and the
  57 bar lands as the finding; `highlight` on the 57 bar (the option bought),
  **not** on the longest. The 120–140 band is drawn at **120**, its low end,
  with the band in the `sublabel` — §4.11's drawing rule, which weakens the
  issue's own claim and is meant to.
- **Row 6** — `value: 20,100` `unit: "crore rupees"`. **Two** `equals` lines,
  not three: the ₹11,100 crore added by the September 2024 Cabinet decision,
  and what it buys (first BAS module plus four missions by December 2028).
  Both sourced in §4.5; each `note` carries its basis.
- **Row 8** — dossier §4.9, **three rings not four**: ISS today (415 km,
  51.6°), Gaganyaan planned (400 km), last crew leaves (330 km). **The 220 km
  ring is dropped** — row 1 already owns the burn altitude, and a fourth ring
  buys repetition, not information. `inclDeg` stays off Gaganyaan: ISRO's page
  does not state it (§4.9) and it is not to be guessed.

**Rhythm (CANON §2–3).** One hero (row 1, `split`). Zero WebGL, so the
never-two-adjacent rule is moot. Zero `bleed`. Two `wide` rows (5, 8) — loud
count is 1, well inside the ≤ 3 ceiling. Text-only rows sit at 4 and 7, never
adjacent. Every act carries a quiet section.

## 4. The head

- **Title (≤ 7 words):** **NASA bought the station's ending in 2024**
- **Hook (≤ 23 words):** *You think cracks and leaks are ending the space
  station. The date came from a contract NASA signed in 2024, six years early.*
  (23 words; sentences of 10 and 13 — neither under eight, so `STACCATO` will
  not fire. **The second sentence must not be shortened.**)
- **Dek (≤ 11 words):** *One vehicle, one delivery date, and a decision the
  calendar makes.*
- **Primer (≤ 27 words, three sentences, each ≥ 8 words):** *NASA bought the
  vehicle that will push the station down. Its delivery date now decides when
  the station ends. You will see that schedule, drawn before anything wore
  out.* (Schema bound: 80–420 chars — this is ~155. ✓)

**The ≤ 80-words-before-the-first-graphic floor, counted properly.** The gate
adds head + each section's `eyebrow` + `title` + `intro` and breaks *after*
the first non-text-only section, so row 1's chrome counts and row 1's `data`
does not:

> title 7 + dek 11 + hook 23 + primer 27 = **68**, plus row 1's eyebrow (≤ 4,
> e.g. `THE LAST EIGHTEEN MONTHS`) and title (≤ 5) = **77**. Three words spare.

**Row 1 therefore carries no `intro` at all.** If the drafter needs a longer
primer, it pays for it out of the hook, not out of this margin.

Title check: states the finding, carries no "The ‹Noun› That ‹Verb›s", and
the dek is not an antithesis of the hook (one reversal per issue, and it is
spent in row 2's `you-think`).

## 5. The Indian ground

Every item traces to a dossier row. Nothing here is a new fact.

| What | Where it lands | Dossier |
|---|---|---|
| **Shubhanshu Shukla**, IAF pilot, flew to *this* station on Axiom-4, 25 Jun – 15 Jul 2025; splashdown ~15:03 IST; ~12 million km, ~282 orbits; seven experiments from Indian institutions | Row 2 `you-think` note, and the row 8 closer | §4.5 |
| **Gaganyaan: 3 crew, 400 km, 3 days, landing in Indian sea waters** | Inside the row 8 graphic, as a named ring — not a bolted-on paragraph (§9's explicit caution) | §4.5 |
| **₹20,100 crore** (₹201 billion), expanded by ₹11,100 crore in September 2024, covering four Gaganyaan missions plus the first Bharatiya Antariksh Station module and four missions **by December 2028** | Row 6 `number-sense`, the whole card | §4.5 |

**Currency (contract §3 rule 4) — no rupee bracket anywhere in this issue.**
$843 million (2024 contract), ~$3 billion a year (2021 audit), $2.1 billion
(FY2026–30 projection) are all historical or forward programme projections.
The Indian scale anchor is India's own ₹ figure, which needs no conversion.
**Forbidden arithmetic, named here so the drafter does not rediscover it:** do
not convert any dollar figure, do not divide one national figure by the other,
and do not repeat the fetched SpaceNews page's dollar glosses on the Cabinet
decision — §9 records them as internally impossible ("₹111 billion ($1.35
billion) … ₹201 billion ($432 million)"). Rupees are primary; those dollars
are ignored.

**The Gaganyaan/ISS altitude claim — use the band, not the subtraction.** The
dossier's §4.9 line "fifteen kilometres below" is 415 − 400, and it is
brittle: 415 km is the FAQ's *working figure* for a station whose stated
operating band is **370–460 km** (§4.1). Gaganyaan's 400 km is not below the
station, it is **inside the same band**. That is both more honest and the
stronger sentence, and it is what row 8 must say. Do not print "fifteen
kilometres".

**One gap, and it is the operator's call, not the drafter's (§8.3).** The
2,000 km debris footprint is the issue's one figure that wants an Indian
distance comparison, and the dossier carries none. Adding one means adding a
fact, which the composer does not do.

## 6. The three questions

The reader panel answers these from the draft alone.

1. **Q:** Why is the space station being retired in 2030?
   **A:** Because the five partner agencies committed to operate it only
   through 2030 (Russia through 2028), and NASA bought a vehicle in 2024 that
   must be delivered by 1 May 2029 to push it down. Not because it has worn
   out. · *dossier §4.2 (contract, delivery date) + §3 (2030 row)*
2. **Q:** Why must NASA decide in 2027, three years before the end?
   **A:** Because a replacement station has to be certified, extra cargo and
   crew flights have to be funded and bought about three years ahead, and even
   the rocket for the deorbit vehicle is procured at least three years before
   launch. Nothing on the station itself forces 2027. · *dossier §4.4 (the
   2027 factors) + §4.2 (three years ahead)*
3. **Q:** What does this have to do with India?
   **A:** An Indian Air Force pilot flew to this station in 2025 as a
   rehearsal for Gaganyaan, and India has committed ₹20,100 crore covering
   four Gaganyaan missions and its own first station module by December 2028.
   Gaganyaan is aimed at 400 km, inside the same band this station flies in. ·
   *dossier §4.5*

## 7. Names

**Eight, against a ration of twelve** — deliberate headroom, because the
dossier's four commercial partners and three Expedition-1 crew would eat it.

**People (3)**

1. **Shubhanshu Shukla** — the Indian Air Force pilot who flew to the station
   in 2025 as a rehearsal for Gaganyaan
2. **Ken Bowersox** — the NASA official who runs its space operations
3. **Steve Hoeser** — the engineer who argues NASA cannot legally certify a
   station it does not own

**Organisations (5)** — NASA · SpaceX · ISRO · GAO (the US government's
auditor) · Axiom Space (the company whose mission carried Shukla)

**Described, never named** (each a deliberate saving):

- Gidzenko, Krikalev and Shepherd → **"the first three residents"** (the
  dossier's own fallback; saves three names)
- Axiom, Blue Origin, Vast, Starlab → **"the four partners NASA names"**
- The six companies in GAO's count → **"six American companies"**. Per §9,
  six and four are true of *different things*; attribute each and do not stage
  them as a contradiction.

## 8. Composer notes

### 8.1 The dossier's floor check has a bug, and it changes the row order

Dossier §7 counts `three-steps` as a card sitting outside the text-only set.
It does not. `scripts/check-prose.mjs` line 85:

```
TEXT_ONLY = ['act-break','prose','quote','analogy','beat-sheet','plate',
             'comparison','paradox','jargon-buster','three-steps']
```

So the dossier's proposed order — row 8 `quote`/`prose` followed by row 9
`three-steps` — is two text-only sections adjacent and **would fire
`PROSE-RUN`**. The spine above moves `three-steps` to row 4, where it also
reads better: the timeline raises "why 2027?" and the next section answers it.

Two more corrections to that floor check, both in the issue's favour:

- **`timeline` *is* a drawn graphic** by the gate's own test
  (`isGraphic = !TEXT_ONLY && !CARD_KINDS`; `CARD_KINDS` is only `you-think`,
  `number-sense`, `data-readout`). The dossier counted 4 of 9 = 44%; the gate
  counts this spine at 4 of 8 = 50%.
- **`data-readout` does not count against the three-card cap** (`PLAIN_CARDS`
  is `you-think`, `number-sense`, `jargon-buster`, `three-steps`). It was
  still rejected — see §8.5.

### 8.2 Why eight rows and not nine: the EXPLAIN defaults broke the budget

The nine-row spine was composed, costed and cut. The cause was not the kinds,
it was that **four of the five graphics need an authored `plain`**, because
their `EXPLAIN` defaults in `src/lib/explainers.ts` are written for a
different story and are factually wrong here:

| Kind | Default says | Why it is wrong here |
|---|---|---|
| `descent-profile` | "…as it **lands**", "Read left to right to **touchdown**" | The station does not land. It breaks up, and the axis is months before a burn |
| `benchmark-chart` | "with a **reference line** for context. **Longer is better**" | There is no reference line, and the longest bar (760 m/s) is the option *not* taken |
| `orbit-trace` | "one satellite rides each ring", "…and **how many satellites** share it" | No `satCount` in this data. **And `orbit-trace` is in `NEEDS_HOW`**, so that panel renders by default unless overridden |
| `elevation-profile` | "how high each thing **stands** against the others" | Written for terrain; these bands are altitudes at which stages of destruction happen |

That is ~130 words of authored `plain`/`howToRead` the nine-row plan had not
budgeted, and it put the issue at ~1,215 against a 1,100 ceiling.
**`elevation-profile` (the last forty minutes: arrays at 90–95 km, structure
at 72–84 km, ocean at zero) is the cut**, and it was the reluctant one — it is
the most vivid row in the dossier and a third never-published kind.

It is cut rather than another row because it is the least *argumentative*: it
shows what happens to the station, not why the date exists. Rows 3, 4, 5 and 7
each carry a load-bearing step of the thesis. Its data is fully captured at
dossier §4.10 with the drawing rule already applied, so it can be restored in
one paste — see §8.4, where it is already doing exactly that.

### 8.3 What the operator should rule on before the draft

**R1 — Confirm the three delta-v figures, or trigger the swap.** Open
`https://www.nasa.gov/wp-content/uploads/2024/06/iss-deorbit-analysis-summary.pdf`
and confirm **57 m/s**, **120–140 m/s** and **760 m/s**. The researcher could
not machine-read it (§9) and traced all three through search excerpts. They
carry row 5 entirely, and the "thirteen times" annotation is 760 ÷ 57 = 13.3,
computed. If any one fails, apply §8.4 — do not soften the chart.

**R2 — The hero is `descent-profile`, overruling the dossier.** §4.11 and §7
both nominate `benchmark-chart` as the load-bearing graphic. Reasons in §2;
flip it back in one edit if you disagree, but note that R1 is unresolved.

**R3 — The March 2026 government-owned core module is dropped entirely.** §9
marks it `[UNVERIFIED]`, NASA's own page (updated 20 Aug 2026) does not carry
it, and no allowlisted primary was found. The dossier permits it in prose if
attributed to the reporting. This spine **does not use it at all** — it costs
words the budget has not got and buys a hedge the argument does not need. Say
so if you want it back.

**R4 — An Indian distance comparison for the 2,000 km debris footprint.** The
one place the issue would benefit from a fact the dossier does not carry. A
composer does not add sources. If you want it, supply the figure; otherwise
the footprint stays in kilometres. *(Moot if R1 fails and §8.4 fires, since
that is when `elevation-profile` returns and the footprint gets a row.)*

Also carried forward, not rulings but binding on the drafter:

- **Every date in this issue is a plan, not a commitment** (§9). 2028, 2029,
  2030 all describe intent recorded in contracts and agreements. Say so each
  time. This is the point of the piece, so precision is free.
- **The anti-false-balance rule.** That the end date is set by agreements and
  a delivery schedule is a documented fact, not a position. Do not balance it.
  The two viewpoint clusters (GAO's process critique, Hoeser's
  certification-authority argument) live **only** in row 7.
- **BAS by 2035 is `[UNVERIFIED]` and is not used.** Only the sourced December
  2028 first-module commitment appears.
- **The continuous-presence day count is not used either.** §4.1's ~9,450 days
  is `[COMPUTED]` and would need recomputing for the publication date. Row 3's
  first timeline note says *"people have lived here without a break ever
  since"* and carries no number, which needs no recomputation and costs fewer
  words.

### 8.4 The contingency spine, if R1 fails

One swap, already costed. **Cut row 5 (`benchmark-chart`, 133) and restore
`elevation-profile` (135) in its place**, from dossier §4.10 — four bands,
each drawn at the LOW end of its range with the band in `range` and the
nominal figure in `note`. It needs an authored `plain` (§8.2) and sits at
`layout: default`.

The swapped spine still clears every floor, and on three of them it does
better:

| | Composed spine | Contingency |
|---|---|---|
| Rows | 8 | 8 |
| Drawn graphics | 4 (50%) | 4 (50%) ✓ |
| Distinct graphic kinds | 4 | 4 ✓ |
| New kinds | 2 | **3** ✓ |
| Plain cards | 3 | 3 ✓ |
| Text-only adjacency | rows 4, 7 | rows 4, 7 ✓ |
| Budget | 1,085 | **1,087** ✓ |

The beat also survives: rows 5 and the restored row both answer "and then what
happens to it", one in fuel and one in altitude.

### 8.5 Kinds considered and rejected

| Kind | Why not |
|---|---|
| `jargon-buster` | **Wanted, and blocked by the card cap.** Dossier §4.7 supplies nine clean glosses and the material is term-dense. But `jargon-buster` is one of the four `PLAIN_CARDS` and the spine already carries three (`you-think`, `number-sense`, `three-steps`), so a fourth fires `CARD-HEAVY`. Dropping any of the three costs more than a glossary buys — `three-steps` *is* the 2027 mechanism. **USDV and delta-v are glossed inline instead**, which the kind's own DON'T USE prescribes for a single term anyway |
| `data-readout` | Genuinely available (§4.1 gives mass, pressurised volume, inclination, 100 m/day drag, 290 people from 26 countries) and it does **not** count against the card cap. Rejected purely on budget: ~90 words for a row that restates the station's scale without advancing the argument |
| `launch-stats` | **Rejected by the dossier (§4.12) and not resurrected.** NASA's Visiting Vehicles page produced internally inconsistent per-year counts on two fetches (2023 given as both 15 and 14 in one table). **Unblocking it is a research job:** pull the launch log from Jonathan McDowell's planet4589 (T7) or Space-Track (T1) |
| `state-timeline` | Rejected on **shape**, not sourcing (§4.12): its window and marks are authored in fractional hours and render `HH:MM`, and the build fails outside 3–8 lanes and 2–3 states. A multi-year partner-readiness grid cannot live in it. `timeline` with an annotation is the honest substitute, and it is row 3 |
| `solar-system`, `orbit-globe`, `constellation-swarm` | No orbital elements, no census, no shell breakdown. This is the G9 pattern recorded in memory: space geometry blocks on one missing number. `orbit-trace` needs only `altKm` per named orbit, which §4.9 has — which is exactly why it is the kind that fits |
| `quote` | The GAO and Hoeser lines travel verbatim and attributed **inside** row 7's prose. A standalone `quote` row is text-only, would sit adjacent to another, and is the first thing this budget kills |
| `comparison` | Would have carried ₹20,100 crore against $3 billion a year — but it is text-only, and §5 forbids the arithmetic between them anyway. `number-sense` carries the ₹ figure and row 6's intro sets the dollar figure beside it without converting |
| `paradox` | Ration unspent. Nothing here is two facts pulling opposite ways; the reader's belief is simply wrong, which is `you-think`'s job (row 2) |

### 8.6 Gate behaviours the drafter must write around

- **`NO-RESTATEMENT` / `NO-ANALOGY` fire on every `prose` section** unless it
  contains a literal marker from the hard-coded lists. Row 7 must contain one
  of *"that means / which means / the point is / for context / in other
  words"* and one of *"think of / like a / imagine / the way a / is like"*.
  Good plain prose still fails this by accident.
- **`STACCATO` fires on three consecutive sentences under eight words**, and
  the hook is scored as body prose. §4's hook is built at 10 and 13 — do not
  shorten the second sentence.
- **`NUMBER-DENSE` fires at three numerals in one sentence**, and it scores
  only body keys (`note`, `text`, `detail`, `lead`, `paragraphs`, `followup`,
  `statement`, `kicker`, `headline`). `label`, `sublabel`, `caption`, `plain`,
  `source` and `annotations[].text` are **not** sentence-scored — so a figure
  that will not fit a timeline `note` can usually sit in that event's `label`.
- **The machine-prose marks.** No em-dash (hard cap one per issue), no
  semicolons, no AI word list, no "not about X, it's about Y". The one
  reversal ration is spent in row 2.
- **`SOURCE-NARROW` — carry the full bibliography.** The gate counts by URL
  hostname, and the dossier's twenty sources spread as nasa.gov 6 (30%),
  spacenews.com 5, gao.gov 2, isro.gov.in 2, plus single entries on
  oig.nasa.gov, orbitaldebris.jsc.nasa.gov, spaceflightnow.com, planetary.org
  and thespacereview.com — **9 hostnames, top share 30%. It passes.** The only
  way to fail it is by trimming: if the drafter carries fewer than 13 sources,
  or more than 5 from `nasa.gov` proper, nasa.gov crosses 40% and the flag
  fires. Note that `oig.nasa.gov` and `orbitaldebris.jsc.nasa.gov` count as
  separate publishers.
- **The Planetary Society article is from November 2023** and predates the
  USDV award. Use it **only** for the physics — the 100 m/day drag loss and
  the Point Nemo distance. Its commercial-station target dates are stale.
- **`NUMBER-DRIFT` does not apply.** This is a new issue, not a rewrite.

## 9. Kind ledger

"New" = on the "Never in a published issue" list in
`docs/generated/PROJECT-GRAPH.md` (76 of 101) **and** not claimed by another
storyboard dated within the last 30 days. Checked 2026-09-21: the ten
storyboards on disk are all 2026-09-13 to 2026-09-15 Phase 4/6 rewrites of
issues that have since published, so their kinds are already counted in the
ledger. **No sibling storyboard exists yet for the 2026-09-17 round**, so
nothing is double-claimed.

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `descent-profile` | 1 | **yes** | **yes** — space signature, on the ledger |
| `you-think` | 2 | no — plain-language card | no (published 10 of 10) |
| `timeline` | 3 | **yes** | no (published 9 of 10) |
| `three-steps` | 4 | no — card, **and in `TEXT_ONLY`** | no (published 7 of 10) |
| `benchmark-chart` | 5 | **yes** | no |
| `number-sense` | 6 | no — plain-language card | no (published 8 of 10) |
| `prose` | 7 | no — `TEXT_ONLY` | no |
| `orbit-trace` | 8 | **yes** | **yes** — space signature, on the ledger |

- **Drawn graphics:** **4 of 8 = 50%** (floor 40%) ✓ · distinct graphic kinds:
  **4** — `descent-profile`, `timeline`, `benchmark-chart`, `orbit-trace`
  (floor 3) ✓
- **Plain-language cards** (`you-think` · `number-sense` · `jargon-buster` ·
  `three-steps`): **3**, one of each, none repeated (cap 3) ✓
- **New kinds:** **2** (floor 2) ✓ — `descent-profile` fills G4, altitude
  against time with named event markers (dossier §4.8); `orbit-trace` fills
  G9, a handful of named orbits by altitude on a squeezed scale (§4.9). Both
  are the space desk's **own** signature kinds, which is the order the brief
  asks for: the world's signatures first, a cross-world kind second.
  `benchmark-chart` is the cross-world borrow (tech signature).
- **Visual share** (the older 60% floor, `!TEXT_ONLY`): **6 of 8 = 75%** ✓
- **Text-only adjacency:** rows 4 and 7, never adjacent ✓ · **first row is a
  drawn graphic** ✓ · **`prose` sections: 1** (cap 3) ✓ · **`paradox`: 0**
  (cap 1) ✓ · **non-workhorse kinds present:** `descent-profile`,
  `you-think`, `benchmark-chart`, `number-sense`, `orbit-trace` ✓
- **CANON §2–3:** one hero (row 1, the only `split`) ✓ · zero WebGL ✓ · zero
  `bleed` ✓ · loud sections: 1 ✓ (≤ 3)
- **Words:** 1,085 of 1,100 ✓ · before the first graphic: 77 of 80 ✓ ·
  names: 8 of 12 ✓
