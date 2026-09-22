# Storyboard: Indonesia's fire is burning downward

- **Category:** earth
- **Dossier:** research/earth/2026-09-17-indonesia-fire-burns-soil-not-trees-dossier.md
- **Composed:** 2026-09-21
- **Composer:** composer-agent
- **Status:** approved            ← draft | approved | hold  (the gate; see below)

> Fresh issue, not a rewrite: no published MDX, no verification report, no
> `story:` block to remap. The dossier is `ready-for-draft` and unusually
> strong — it captured DATA for five drawn graphics against the catalog's own
> `DATA:` lines, settled the `region-map` province question from the component
> source, and killed `carbon-loop` itself with a named gap. This storyboard
> takes four of those five, reorders two beats, and spends the rest of its
> attention on the six places the drafter could put an unsourced number on a
> page.
>
> **The gate.** `GATES.storyboard` in `scripts/pipeline.config.ts` is
> `'required'`: the drafter runs only when this file says `Status: approved`.

---

## 1. The argument in one line

Indonesia's fire eats the ground, not the forest, so the burned-area number
everyone quotes is a flat measure of a fire whose whole story is depth.

## 2. The hero

**`core-sample`** (G6 · composition / layers by depth) — row 5, `layout: split`,
the issue's only split section.

It renders dossier **§4d** as a single column cut straight down through
Indonesian peat, with four marks that together are the entire argument:

| depth | what it marks | dossier row |
|---|---|---|
| 0 cm | the surface litter that has to burn first | §4b, Yokelson 2022 |
| 24.8 cm | how much ground the October 2015 fire removed | §4b, Kiely 2019 |
| 40 cm | where the law says the water table must stay | §4b, Mongabay 2019 |
| 50 cm | where plantation canals actually put it | §4b, Mongabay 2019 |

**Why this is the hero and not the `benchmark-chart`.** The bars at row 1 show
that the number is strange. Only this column shows *why*: the legal line and the
plantation line sit below the surface, and the burn depth sits between them.
Three of the four marks are invisible from a satellite, which is the reason the
area figure fails. It is also the only section where the reader sees the missing
third dimension as a distance rather than as a word.

**It needs an authored `plain` — the default is wrong here.**
`EXPLAIN['core-sample'].what` reads "read top (most recent) to bottom (most
ancient). Each band is a layer of time." This column is depth, not time; the
default would tell the reader that 50 cm is older than 25 cm, which is not what
any of these four marks mean. See §8, ruling 6.

## 3. The beats

Nine rows. Verified against `scripts/check-prose.mjs` rather than against the
prose description of the floors — the gate's `TEXT_ONLY` / `CARD_KINDS` sets
are what actually decide, and they classify `you-think` as visual and `timeline`
as a drawn graphic. Tally in §9.

| # | The reader must get (one line, register) | Shape | Kind | Hero? | Words | Analogy / example | Plain-line sketch | Dossier §4 rows |
|---|---|---|---|---|---|---|---|---|
| 1 | Eleven weeks of this season have already almost matched a normal full season | G5 ranking | `benchmark-chart` | — | **100** | none — the bars do it | "Each bar is one fire season's carbon. The dashed line is a whole year of Indonesia's cars, power plants and factories." | §4f (800 / 333 / 85 / 76 MtC · refValue 221) |
| 2 | You think burned area tells you how bad a fire season was. On peat it barely tells you anything | G2 reframe | `you-think` | — | **70** | measuring a flood by how wide the puddle is, never how deep | — (narrative card) | §4i `you-think` · §4a (286,000 ha vs 76 MtC) |
| 3 | The smoke crosses borders, and one province is carrying the season | G8 geographic | `region-map` | — | **110** | — | "A flat world map. The shaded countries are the ones the haze reaches; the pins are Indonesia's six priority peat provinces." | §4e (6 zones, 6 markers, West Kalimantan 28,680 ha) |
| 4 | Three words you need before the next section: peat, smouldering, water table | G1 narrative | `jargon-buster` | — | **74** | peat is compost that never finished | — (narrative card) | §4i `jargon-buster` |
| 5 | **The fire went 24.8 cm down, and the canal line sits below the law's line** | G6 layers by depth | `core-sample` | **HERO** `split` | **145** | 24.8 cm is about the length of a school ruler, taken off the top of the ground across an area you can see from space | authored — see §2 | §4d · §4b · quote §5 (Novita) |
| 6 | Dig the canal, the ground dries, the fire goes down | G1 narrative | `three-steps` | — | **90** | pulling the plug out of a bathtub the size of a province | — (narrative card) | §4i `three-steps` |
| 7 | All of it lands in the same place, and next to India the pipes are not the size you expect | G7 flow | `power-flow` | — | **150** | four taps running into one sink | authored — see §8 ruling 6 | §4g (333 · 72 · 221 · 870 MtC) · §4c |
| 8 | The body built to re-wet this ground was allowed to lapse, and the canals stayed | G4 dated sequence | `timeline` | — | **132** | — | default (a timeline explains itself; not in `NEEDS_HOW`) | §3 rows 2015-10 → 2026-09-07 |
| 9 | What it costs while nobody is watching: lungs, charges, and 72 MtC a year with no fire at all | G1 narrative | `prose` (≤ 135) | — | **135** | — | — (`skimCaption` only) | §4a (50,891 ISPA · 72 charged) · §4a (72 MtC/yr) |

**Budget:** sections 1,006 + head 66 = **1,072 reader-facing words**, cap 1,100.
`readerWords` sweeps eyebrows, titles, captions, `plain`, `source` labels and
every data string, so the per-row figures above are whole-row costs, not intro
lengths. **Row 9 is the designated slack row** — if any row overruns, it pays.

**Words before the first graphic: 73 of 80.** The gate counts head + row 1's
eyebrow + title + intro, then stops. So **row 1 carries no `intro`**, its
eyebrow is ≤ 4 words and its title ≤ 4. This is not a style preference; at 66
head words a seven-word title fails.

Per-field caps: intro ≤ 45 · prose section ≤ 200 (we use 135) · timeline note
≤ 20 (we use ≤ 14 to hold the budget) · tile note ≤ 15 · annotation ≤ 12.

### Row notes the drafter must not improvise

- **Row 1** carries the `annotations[]` callout: `{ at: "2026, to 7 September",
  text: "Eleven weeks. Almost a normal full season." }` (7 words, cap 12).
  `sortDesc: false` so the series reads 1997 → 2026 and the highlight lands on
  the short last bar. `refValue: 221` is a **conversion**, not a sourced
  figure — the caption says so.
- **Row 2** is where the issue spends its one "not X, it is Y" reframe. It does
  not appear again in the title, the hook or any section intro.
- **Row 5** carries the Novita quote verbatim inside its intro, attributed:
  *"Unlike fires in dry ecosystems, peat fires can smolder underground, so the
  soil itself becomes readily available fuel."* Use the dossier §5 wording, not
  the candidate's paraphrase (dossier §9.6). There is no separate `quote` row —
  see §8.
- **Row 8** timeline is exactly **6 events** (the cap): 2015-10 · 2016 · 2019 ·
  2024-12-31 · 2025 · 2026. Its `annotations[]` callout sits on 2024-12-31:
  "The agency ends. The canals stay." (6 words).
- **Row 9** is the issue's only `prose` section, so `check:prose` will score it
  for `NO-RESTATEMENT` and `NO-ANALOGY`. It must contain a literal restatement
  marker ("that means", "which means", "the point is", "for context") — good
  plain prose fails this flag by accident.

## 4. The head

- **Title (states the finding, 5 words):** **Indonesia's fire is burning downward**
- **Hook (24 words):** "You have seen the burned-area figure: 286,000 hectares. It misses the part that matters. In October 2015 this fire ate 24.8 centimetres of ground."
  - *Sentence lengths are deliberate: 8 / 6 / 10. `STACCATO` fires on three
    consecutive sentences under eight words — do not shorten the first or last.*
- **Dek (9 words):** "Burned area is a flat number for a deep fire."
- **Primer (28 words, ~175 chars — schema floor is 80):** "Indonesia's 2026 fire season released 76 million tonnes of carbon by 7 September. The fuel is the waterlogged soil under the trees. Here is how deep it went."

Head total **66**. The title states the finding and carries no "The ‹Noun›
That ‹Verb›s" construction and no reframe.

## 5. The Indian ground

The dossier is explicit (§4c, §9.15): **no current foreign-currency figure
appears anywhere in this issue, so contract §3 rule 4's ₹ bracket does not
apply.** The Indian ground is carried entirely by carbon scale.

| Where | What the reader gets | Dossier row | Status |
|---|---|---|---|
| Row 7 `power-flow` | India's fossil carbon, 870 MtC, drawn as the fourth band so the reader sees Indonesia's fire against something they own | §4g link 4 · §4c | **Conversion** — 3.19 GtCO2 × 12/44. State as arithmetic |
| Row 7 caption | 2015's fires ≈ 1.22 GtCO2 ≈ **38% of India's entire 2024 CO2**, from a country whose own fossil emissions are about a fifth of India's | §4c | **Conversion.** State as arithmetic, never as a sourced claim |
| Row 1 caption | 2026 to 7 September ≈ 279 MtCO2 ≈ **8.7% of India's annual CO2** | §4c | **Conversion** |
| Row 5 | 24.8 cm as the length of a school ruler — a thing every Indian reader has held | §4i `number-sense` equals | Analogy, no new fact needed |

**Every one of the four is my arithmetic on a sourced CO2 figure** (dossier
§9.14). The drafter presents each as a calculation the reader can follow
("multiply by 44 over 12 and you get…"), and the verifier checks the
arithmetic rather than hunting for a citation. This is the single biggest
place this issue could put an unsourced-looking number on a page.

**The haze bridge is an operator ruling, not a licence** — see §8, ruling 4.

## 6. The three questions

1. **Q:** What actually burns in an Indonesian fire season, and why does the
   burned-area figure not tell you how bad it was?
   **A:** The peat soil under the trees burns, and it burns *downward*. Area is
   a flat measure; the fire's real dimension is depth — 24.8 cm of ground in
   October 2015. · dossier §4b, §4d
2. **Q:** Peat is waterlogged. So why does it burn at all?
   **A:** Plantation drainage canals lower the water table so oil palm roots do
   not drown — the law allows 40 cm, the canals go to 50–75 cm. Dry peat is
   fuel. · dossier §4b, §4i `three-steps`
3. **Q:** How big is this next to India?
   **A:** The 2015 season put out about 1.22 GtCO2, roughly 38% of India's
   entire annual CO2, from a country whose own fossil emissions are about a
   fifth of India's. · dossier §4c

## 7. Names

Two people and one described body. The argument does not need more, and the
dossier says so (§4j: "Prefer keeping the count low").

| Name | Role phrase that introduces it |
|---|---|
| **Laura Kiely** | the atmospheric scientist whose team measured how deep the 2015 fires actually burned |
| **Novita** | the peat researcher who explains why this fire behaves unlike any other (row 5 quote) |

**Described, not named:** the peat restoration agency (the dossier never gives
it a name beyond its function — "the body set up after 2015 to re-wet drained
peat" is the right form); Robert Yokelson (the surface-fuel-first finding is
carried by row 6's source line, not by a name); the two burned-area monitoring
systems (row 3's source line names FireWatch only — see ruling 5).

Publishers (Carbon Brief, Mongabay, WRI, Our World in Data, NASA Earth
Observatory, Copernicus) are **source-line names, not body names** — the
contract's AI-tell 11 forbids stacking them into a sentence.

Total body names: **2 of 12**.

## 8. Composer notes

### Kinds considered and rejected

| Kind | Why it was wanted | Why it is not available |
|---|---|---|
| `carbon-loop` | The issue is literally a carbon stock-and-flow story, and the kind has never been published | **Third time on the earth desk, same blocker.** `DATA` needs ≥ 3 reservoirs with sourced *stocks* and ≥ 4 fluxes. The dossier has one reservoir (peat, 28 GtC) and two one-way fluxes. The return flux — the rate peat accumulates — exists only off-allowlist (dossier §4h, §9.7). `CarbonLoop.astro` conservation-checks every `role: 'store'` reservoir at build and throws, so an invented payload either fails the build or, worse, passes because the invented numbers balance. **Use `power-flow`** — also never published, no conservation constraint, and the evidence fills it completely |
| `number-sense` | 24.8 cm with the school-ruler `equals` line is a textbook fit, and the dossier captured it (§4i) | **Blocked by the card cap, not by data.** `PLAIN_CARDS` is capped at 3 per issue and `you-think` + `jargon-buster` + `three-steps` already spend it. The school-ruler line is not lost — it moves into row 5's intro as the hero's analogy, which is where it does more work anyway (next to the mark it describes) |
| `quote` (own row) | The Novita line is the best sentence in the dossier | Word budget. A `quote` row costs ~60 words of chrome for one sentence that survives verbatim and attributed inside row 5's intro. Restoring it is an operator call with a named cost: **+60 words, taking the issue to ~1,132, over the 1,100 cap** — so it would have to displace row 9 |
| `elevation-profile` | The dossier's own fallback for row 5 (§4d), and also never published — `{bands: [{label, range, value…}]}` would carry the 50–75 band directly in `range` | Not rejected on data — rejected on meaning. Its catalog DON'T USE routes "strata down a core" to `core-sample` explicitly, and its USE WHEN is *bands above ground level*. Every mark here is below the surface. **Keep it as the standing fallback** if the operator rejects `core-sample`; the four rows port unchanged and the band problem gets easier |
| `data-readout` | The obvious home for 286,000 ha / 50,891 ISPA / 72 charged | It is a card, not a drawn graphic, and the issue is already at the 3-card cap. Those three numbers land in row 9's prose, where they are the *cost*, not a headline |
| `climate-strip`, `climate-spiral`, `sea-level-tank`, `quake-depth`, `atmosphere-column`, `terrain-relief`, `storm-track` | The rest of the earth library | Wrong shapes: an annual anomaly series, a monthly series, a water level, a depth × time scatter, a barometric column, a DEM of a bounded region, a best-track table. None of the five is in the dossier, and `terrain-relief` / `storm-track` are WebGL — this issue has no WebGL and does not need it |
| `analogy` | The bathtub/plug mapping at row 6 | It would be a fourth text-only row and would sit adjacent to another. The mapping lives inside `three-steps`' card text, next to the number |

### The one kind I am least sure about

**`power-flow` at row 7 is a defensible call, not an obvious one.** Its catalog
DON'T USE routes "simple part-of-whole" to `data-readout` or `comparison`, and
a reviewer could fairly say four magnitudes side by side is a bar chart — which
row 1 already is. It earns the row on one thing the bars cannot say: all four
of these flows **end in the same place**. One sink, four sources, and the point
is that the fire band is wider than the whole-country fossil band beside it.
Build-safe, checked against `PowerFlow.astro`: with four `source` nodes and one
`sink` and no `via` node, the conservation check at line 78 never fires
(`isVia` requires both inflow and outflow), and `maxDepth` is 1, clearing the
"needs ≥2 layers" throw at line 60. If the operator disagrees, the honest
replacement is a second `benchmark-chart`, which costs the issue a new kind and
a graphic kind — so say so at approval, not after the draft.

### Rulings the operator should make before the draft

1. **The haze-zone list is the weakest sourcing in the issue.** Dossier §4e
   lists six haze-receiving countries as a group with no per-country citation,
   and the zone `value` is described as "ordinal" — but nothing in the record
   ranks them. **Composed as a two-value categorical**: Indonesia as the source,
   the other five as "reached by the haze", legend title "Reached by the haze",
   never as a measured number. *Ruling wanted:* accept the six as drawn, or trim
   to Malaysia / Singapore / Brunei, which the record supports most directly. Do
   not let the drafter invent an exposure ranking to make the map prettier.
2. **The six province markers are `[UNVERIFIED]`** against an allowlisted
   gazetteer (dossier §4e, §9.9). They are provincial-capital coordinates and
   are approximations of a province, not fire locations — the drafter must say
   so in the caption. *Ruling wanted:* keep the markers with that caption, or
   drop to zones only. The map still carries the haze argument either way.
3. **28 GtC, and the NASA quote is barred from the whole issue.** Dossier §9.3
   recommends 28 GtC and says the NASA "one-sixth of the world's peat carbon"
   quote must not appear in the same *section*. I am composing the stricter
   rule: it does not appear **anywhere**, because a reader who meets ~83 GtC in
   row 3 and 28 GtC in row 5 has been handed a contradiction across a page turn
   and no section-level separation fixes that. This is a real disagreement in
   the literature about what counts as peat, not an error.
4. **The Indian haze bridge.** An Indian reader owns the experience of a city
   under smoke. The dossier carries **no fact** linking Indonesian haze to
   anything Indian. *Ruling wanted:* permit one experiential sentence with **no
   number, no causal claim and no comparison of scale or cause**, or cut it. The
   carbon arithmetic in §5 is the Indian ground that is actually sourced; the
   bridge is atmosphere, and it is the easiest place in this issue to slip into
   an unsourced claim.
5. **Never mix burned-area systems inside one chart or one sentence**
   (dossier §9.4). FireWatch / Nusantara Atlas throughout: 48,889 ha at 9 Aug,
   28,680 ha of it West Kalimantan. The national 286,000 ha (Jan–24 Aug) is a
   different window and appears only in rows 2 and 9, each time with its window
   stated. Madani Berkelanjutan's 124,040 ha does not appear at all. **Name the
   system in the source line**, every time.
6. **Two `plain` lines must be authored, because the defaults are factually
   wrong here.** Checked in `src/lib/explainers.ts`, not in the catalog:
   - `core-sample` → default says layers are time, "deeper meaning older". This
     column is depth below the surface. Author it (§2).
   - `power-flow` → default opens "**Money** flows left to right". This is
     carbon. Author it: *"Each band is one source of carbon, and all of them end
     in the same place, the air. Thicker bands carry more."*
   - `power-flow` is also in `NEEDS_HOW`, so it renders a how-to-read panel.
     Author it, static reading first, per the instrument rule: *"Follow each
     band left to right; all four end in the atmosphere. The width is million
     tonnes of carbon a year."*
   - `region-map`'s default ("shaded by category and key places pinned") is
     accurate — authoring is optional there.
   - `core-sample` is **not** in `NEEDS_HOW`, so its how-to-read renders only if
     authored. Author one: the depth-not-time reading is exactly the
     "counter-intuitive form" the set exists for, and this kind predates the
     ruling rather than being exempted by it.
7. **The drawing rule, applied twice** (both weaken the issue's own claim,
   which is the point):
   - Row 5 draws the canal line at **50 cm**, the low end of the 50–75 cm band.
     The band goes in the caption.
   - Row 1 draws 1997 at **800 MtC**; the source says "just over 800". The
     "just over" goes in the caption.
   - Row 5 must also carry the dossier's honesty note: the column bottoms out at
     50 cm for drawing, but the peat below continues to 0.5 m–20 m and more.
8. **Every 2026 figure carries its cut-off date on its source line**
   (dossier §9.13) — emissions **7 September 2026**, burned area **24 August
   2026**, health **4 September 2026**. The season was not over at research
   time. Without the cut-offs this issue ages badly inside a fortnight.
9. **No `act-break`.** CANON §3 wants acts separated by `act-break`, but the
   kind is in the gate's `TEXT_ONLY` set, so adding two would drop the visual
   share from 67% to 55% and fail `TEXT-HEAVY`. All ten register-rewritten
   issues ship without it. Flagging rather than deciding silently: the two rules
   genuinely conflict and I followed the gate.

### Not a data gap, and not this issue's job

The dossier's §9.11 records that **`research/_sources/earth.md` still lists
`globalforestwatch.org`, which now 301-redirects to the off-allowlist
`globalnaturewatch.org`**. That is a live allowlist defect, not a composition
problem, and it did not block anything here (the identical content was cited
from `wri.org`). Worth fixing before the next earth dossier.

## 9. Kind ledger

Classification is taken from `scripts/check-prose.mjs` lines 85–91, not from
how a section reads on the page: `TEXT_ONLY` = act-break, prose, quote,
analogy, beat-sheet, plate, comparison, paradox, jargon-buster, three-steps ·
`CARD_KINDS` = you-think, number-sense, data-readout ·
`isGraphic = !TEXT_ONLY && !CARD_KINDS`. **So `timeline` counts as a drawn
graphic and `you-think` counts as visual but not as a graphic.**

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `benchmark-chart` | 1 | **Yes** | No — published (kessler) |
| `you-think` | 2 | No (card, but visual) | No — published in all ten |
| `region-map` | 3 | **Yes** | **Yes** |
| `jargon-buster` | 4 | No (text-only card) | No — published |
| `core-sample` | 5 | **Yes** (hero) | **Yes** |
| `three-steps` | 6 | No (text-only card) | No — published |
| `power-flow` | 7 | **Yes** | **Yes** |
| `timeline` | 8 | **Yes** | No — published in nine of ten |
| `prose` | 9 | No (text-only) | No |

- **Drawn graphics:** **5 of 9 (56%)** — floor 40% ✓ · distinct graphic kinds:
  **5** (`benchmark-chart`, `region-map`, `core-sample`, `power-flow`,
  `timeline`) — floor 3 ✓
- **Plain-language cards** (you-think · number-sense · jargon-buster ·
  three-steps): **3** — cap 3 ✓, one of each ✓ (no `number-sense`; see §8)
- **New kinds:** **3** — floor 2 ✓
  - `core-sample` — G6, a vertical column by depth (the hero)
  - `region-map` — G8, categorical fill per country plus point markers
  - `power-flow` — G7, a four-source / one-sink flow in one unit
  - All three are on the "Never in a published issue" ledger in
    `docs/generated/PROJECT-GRAPH.md`, and **none is claimed by any of the ten
    storyboards dated within the last 30 days** — checked: every occurrence of
    these three names in that set sits in a "considered and rejected" table
    (el-niño and amazon both rejected `region-map` for want of per-zone values;
    amazon rejected `core-sample` and `elevation-profile` on shape; cockroach
    and transgender-ratchet rejected `power-flow` for want of a value per link).
    This issue is the first in the round where the data actually fits.

### The other floors, checked here so the operator does not have to

| Floor | This issue | Verdict |
|---|---|---|
| Visual share ≥ 60% | 6 of 9 (67%) — rows 1, 2, 3, 5, 7, 8 | ✓ |
| No two text-only rows adjacent | text-only at 4, 6, 9 — separated by 5, 7 and 8 | ✓ |
| First section a graphic (`NO-LEAD-GRAPHIC`) | row 1 `benchmark-chart` | ✓ |
| `prose` sections ≤ 3 | 1 | ✓ |
| `paradox` ≤ 1 | 0 | ✓ |
| ≥ 1 kind outside the six workhorses | 4 (`you-think`, `region-map`, `jargon-buster`, `core-sample`, `three-steps`, `power-flow`) | ✓ |
| Reader-facing words ≤ 1,100 | 1,072 budgeted (66 head + 1,006 sections) | ✓ 28 spare |
| Words before first graphic ≤ 80 | 73 (66 head + 4 eyebrow + 3 title, no intro) | ✓ |
| Names ≤ 12 | 2 | ✓ |
| One hero, ≤ 3 loud sections, no adjacent WebGL | 1 hero (`split`, row 5); no WebGL; no `bleed` | ✓ |
| Sections 6–12 (CANON §3) | 9 | ✓ |
| Sources ≥ 8 from ≥ 5 publishers, none > 40% | dossier §8: 20 sources, 7 publishers, top 30% | ✓ |
