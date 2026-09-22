# Storyboard: More than half of India's "international arrivals" are Indians coming home

- **Category:** travel
- **Dossier:** research/travel/2026-09-17-half-indias-arrivals-are-indians-dossier.md
- **Composed:** 2026-09-21
- **Composer:** composer-agent
- **Status:** approved            ← draft | approved | hold  (the gate; see below)

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
> - `'required'` (the setting until the first ten issues have run): the drafter
>   runs only when this file says `Status: approved`. The operator reads the
>   table, edits rows if needed, and flips the status.
> - `'auto'`: the drafter also runs on `Status: draft`.
> - `Status: hold` parks the issue in either mode.

---

## 1. The argument in one line

India's headline 20.22 million "international arrivals" adds two different
things. Only 9.15 million were foreign tourists. The other 11.07 million were
Indians flying home.

## 2. The hero

**`benchmark-chart`** (row 1) — data shape **G5, ranking against a reference**.

India's ten largest foreign source markets in 2024, sorted descending, with
`refValue` set to that same year's NRI arrivals. The tallest country bar is the
United States at 18.0 lakh. The reference line sits at 106.2 lakh. Every single
foreign source market renders as a stub beside it, which is the issue's whole
argument drawn once, in the ministry's own published numbers.

Renders dossier **§4e** (the 2024 top-ten country table), **§4d** (same table),
**§4i** (the Bangladesh sublabel and annotation), and the 2024 NRI figure from
the **§3** timeline row.

**Layout ruling: `wide`, not `split`.** The hero is the only row permitted
`layout: split`, and I am declining it. A split section is a copy column beside
a sticky stage, and this row's intro is capped at nine words by the 80-word
head floor (§8, note 1). Nine words cannot fill a copy column. `wide` gives the
chart the width it needs without a half-empty column beside it.

**Authoring rules for this row — both are component facts, not preferences:**

1. **Author every value in lakh.** `BenchmarkChart.astro` prints `{it.value}`
   and the reference label raw, with no formatter. Authoring `1804586` puts the
   string `1804586` on the reader's screen. Lakh is also the register's own
   unit. `unit: "lakh arrivals · 2024"`.
2. **Use the 2024 NRI figure (106.2 lakh), not 2025's 110.7.** The dossier §4e
   suggests `refValue: 11070000`, which is the 2025 NRI count set against 2024
   country bars. Mixing years inside one chart is a methodological wobble the
   caption would then have to apologise for. 2024 NRI arrivals are printed
   (10.62 million, §3 timeline), so the whole chart sits in one year and the
   caption stays clean.

| field | value |
|---|---|
| `items` | United States 18.0 · Bangladesh 17.5 (`highlight: true`, `sublabel: "4.66 lakh in 2025"`) · United Kingdom 10.2 · Australia 5.2 · Canada 4.8 · Malaysia 3.1 · Sri Lanka 2.8 · Germany 2.6 · France 2.1 · Singapore 2.1 |
| `refValue` | `106.2` |
| `refLabel` | `"Indians coming home"` |
| `unit` | `"lakh arrivals · 2024"` |
| `annotations` | `[{ at: "Bangladesh", text: "Visa curbs from August 2024" }]` (5 words) |

## 3. The beats

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | India's biggest source of arrivals is not a country. It is Indians. | G5 ranking | `benchmark-chart` | **HERO** | eyebrow 4 · title 3 · intro 9 · caption 24 · plain 22 · annotation 5 · labels ~26 = **93** | The chart is the example. Ten countries, then the line none of them reach. | "One bar per country, longest first. The dashed line is Indians coming home that same year." | §4e, §4d, §4i, §3 (2024 row) |
| 2 | You pictured 20 million foreigners. Fewer than half of them were. | G1 narrative | `you-think` | | think 14 · actually 22 · because 18 · chrome 6 = **60** | The immigration queue at Delhi airport: of every 100 people in it counted as an "international tourist arrival", 55 carry an Indian passport. | *(card — no plain line)* | §4a |
| 3 | The two halves crossed. Foreign tourists were the majority until 2019; now they are not. | G4 time series | `timeline` | | intro 22 · 6 notes × 17 = 102 · caption 20 · annotation 5 · chrome 8 = **157** | — | "Six years the ministry has printed both halves. Each entry gives the foreign count and the Indian count for that year." | §4a, §4b, §3 (2008, 2014, 2019, 2021, 2024, 2025 rows) |
| 4 | Three ministry words that look alike and mean different things. | G1 narrative | `jargon-buster` | | 3 terms × 26 = 78 · chrome 8 = **86** | — | *(narrative — no plain line)* | §4a, §6 (IRTS definition) |
| 5 | A third of the foreign half also came to see family, not sights. | G6 composition | `attrition-waffle` | | intro 30 · caption 34 · plain 22 · labels 8 · notes 16 · chrome 9 = **119** | 100 squares is 100 arrivals. Count the squares that are somebody's relative. | "A hundred squares, one arrival each, grouped by the reason the arrival gave at the counter." | §4c |
| 6 | Arrivals barely moved. The money moved a lot more. Here is why. | G1 narrative | `prose` | | body ≤ **160** · chrome 6 = **166** | One half sleeps in a cousin's spare room. The other half books a hotel room for eighteen nights. | *(prose)* | §4g, §4h (₹3.5 crore), §5 (IRTS quote), §1 |
| 7 | Where the foreign half comes from, and the one country that vanished. | G8 geographic | `region-map` | | intro 28 · caption 28 · plain 24 · legend 8 · note 10 · labels 11 · chrome 10 = **119** | — | "Countries shaded by how many of India's foreign tourists they sent in 2024. Darker means more." | §4d, §4i |
| 8 | 468 domestic visits for every one foreign tourist. | G3 number vs threshold | `number-sense` | | value 6 · comparison 30 · chrome 6 = **42** | 4,287 million domestic visits against 9.15 million foreign tourists. Also: 32.83 million Indians flew out. | *(card — no plain line)* | §4h |
| 9 | The ministry has said this out loud itself. | G1 narrative | `quote` | | intro 24 · quote 32 · attribution 10 · chrome 8 = **74** | — | *(quote)* | §5 (Billa, 14 Sep 2026) |

**Head block:** title 7 · dek 7 · hook 22 · primer 20 = **56**

**Budget total: 972 reader-facing words** against the 1,100 cap — 128 words of
headroom for the drafter, which is deliberate. Row 6 is the only row that may
spend it, and it may not exceed 200.

**Words before the first graphic: 72** against the cap of 80. `check-prose.mjs`
line 299 counts `title + dek + hook + primer + section 1's eyebrow + title +
intro`, then stops because section 1 is visual. That sum is 7 + 7 + 22 + 20 + 4
+ 3 + 9. **The nine-word intro on row 1 is load-bearing** — it is the only
slack in the whole head, and it is why the hero cannot take `layout: split`.

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

### Row 3 — the six timeline events (≤ 6, and which six)

The dossier's §3 carries thirteen rows and its §4b carries a twelve-year table
in which **eight of the twelve NRI values are [UNVERIFIED] or derived by
subtraction**. These are the six that turn the story, and every number in them
is printed by the ministry:

| Year | Note (≤ 20 words) |
|---|---|
| 2008 | The UN tells countries to count their own nationals living abroad separately. They stay with family, not in hotels. |
| 2014 | 13.11 million arrivals. 5.43 million were Indians — 41 in every 100. |
| 2019 | 17.91 million arrivals. Foreign tourists 10.93 million, still the clear majority at 61 in 100. |
| 2021 | Foreign tourist arrivals bottom out at 1.52 million. |
| 2024 | 20.57 million arrivals. Indians 10.62 million, foreign tourists 9.95 million. The halves swap places. |
| 2025 | 20.22 million arrivals. Indians 11.07 million, foreign tourists 9.15 million — below 2019. |

Annotation: `{ at: "2024", text: "Indians abroad overtake foreign tourists" }`
(5 words).

**The drawing rule applies here** and it is why this beat is a timeline and not
a line chart. Dossier §4b instructs that the 2015–2018 and 2020–2023 NRI values
must not be drawn as a continuous line, because they are missing or derived. A
timeline of printed years asserts nothing between its entries, so the honest
constraint becomes the native behaviour of the form instead of a caveat bolted
onto a chart. See §8, note 2, for the two charts this beat lost.

**No rupee figure may appear inside a dated timeline event** (contract §3 rule
4, composition clause). The FEE numbers live in row 6.

### Row 5 — the waffle, exactly as it must be authored

Counts sum to exactly 100 across 5 groups with no zero group, which is what
`AttritionWaffle.astro` throws on at build time:

`Leisure 34 · Indian Diaspora 33 · Business 13 · Medical 7 · Others 13 = 100`

`n: 100` · `trueN: 9150000` · `subject: "arrivals, Jul–Sep 2025"`

The caption carries **both** disclosures and neither may be dropped: the
printed shares sum to 100.1% because the ministry rounds to one decimal, so
**Medical is rounded down from 7.5 to 7** (no other row is touched); and the
denominator question in §8, note 4.

### Row 7 — the map, and the nine countries it can actually shade

`RegionMap.astro` line 28 requires `id` to be an **ISO 3166-1 numeric string**,
matched by `String(f.id)` against the topojson features. A wrong or missing id
silently drops the zone from both the shading and the label pass — it fails
quiet, not loud. Author the ids as quoted strings with their leading zeros:

`"840"` United States 18.13 · `"050"` Bangladesh 17.59 · `"826"` United Kingdom
10.28 · `"036"` Australia 5.21 · `"124"` Canada 4.79 · `"458"` Malaysia 3.09 ·
`"144"` Sri Lanka 2.83 · `"276"` Germany 2.58 · `"250"` France 2.08

`value` is share of foreign tourist arrivals in 2024, per dossier §4d.
`legend: { title: "share of foreign tourist arrivals, 2024", low: "2%", high: "18%" }`.

**Singapore is named in the caption, not drawn.** It is tenth on the dossier's
table at 2.06%, and a 719 km² country carries no visible choropleth fill at
world scale. Dropping it from the zones is a legibility call, not a data call,
and the caption says "the tenth, Singapore, is too small to shade."

**No marker, and this is a rule not an omission.** The dossier §4d proposes a
Bangladesh marker, but `markers[]` takes `lat` and `lng`, and no coordinate for
Bangladesh appears anywhere in the dossier. A coordinate is a fact like any
other and I may not supply one. The Bangladesh collapse goes in that zone's
`note` field instead, which the component already renders (line 146):
`note: "466,012 in 2025, down 73.4%"`.

## 4. The head

- **Title (states the finding, ≤ 8 words):** More than half India's arrivals are Indians *(7 words)*
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):** You read 20 million international arrivals in 2025. Only 9.15 million were foreigners. The other 11.07 million were Indians flying home. *(22 words)*
- **Dek (≤ 14 words):** The ministry counts NRIs as international tourists *(7 words)*
- **Primer (three sentences: what happened · why it matters to you · what you'll see):** India adds two different things and reports one number. Foreign tourists fell 8% last year. Indians coming home rose 4%. *(20 words, 118 characters — inside the Zod 80–420 bound)*

The title carries no Hindi and neither does the dek, and that is correct here.
Per the contract's four tests, there is no natural Hindi word anywhere near
this material: every load-bearing term is either a ministry category, a number
or a currency figure, and all of those sit in the precision layer where Hindi
is barred outright.

## 5. The Indian ground

The entire issue is Indian ground — the subject is India's own counting
convention, every figure is a Ministry of Tourism figure, and the money is
already published in rupees (dossier §4k).

- **No ₹ bracket is needed anywhere in this issue.** Contract §3 rule 4 brackets
  a rupee equivalent beside a *foreign-currency* figure. Here the rupee figure
  is the primary published one and the dollar figure is the ministry's own
  parallel publication, not a researcher conversion. The drafter must not add a
  conversion line, and must not put a rate-and-month note on any source line.
- **Foreign exchange earnings: ₹2,93,033 crore → ₹2,76,831 crore** (§4g). Row 6.
  The trap the drafter must not fall into: the portal's headline −9.5% is the
  **dollar** number. The sentence is "fell 5.5% in rupees, 9.5% in dollars",
  never a bare "fell 9.5%".
- **₹3.5 crore for overseas promotion in FY2026-27** (§4h), which against 9.15
  million foreign tourists is **about 38 paise each**. Row 6. State the division
  plainly and let it land on its own; do not call it shocking.
- **4,287 million domestic visits, 468 for every one foreign tourist** (§4h).
  Row 8 — the comparison that makes 9.15 million feel small.
- **32.83 million Indians departed as travellers in 2025** (§4h). Row 8. More
  than three Indians left for every one foreign tourist who arrived.
- **The place the reader owns:** Delhi (34.94%), Mumbai (18.06%), Bengaluru
  (9.08%), Chennai (8.94%), Hyderabad (4.82%) — five airports take 75.8% of all
  foreign tourist arrivals (§4h). Available to row 2 as the concrete scene (the
  immigration queue the reader has personally stood in) and to row 6 as a
  spare-capacity line. It needs no new fact.
- **Lakh is the unit on the hero chart** (§2). Not a decoration — the component
  prints values raw, so the unit choice is also the legibility fix.

## 6. The three questions

1. **Q:** India reported 20.22 million "international tourist arrivals" in 2025.
   How many of those were foreign tourists? · **A:** 9.15 million. The other
   11.07 million were Indians living abroad, flying home — 55 in every 100. ·
   dossier **§4a**
2. **Q:** Total arrivals fell only 1.71% in 2025, but tourism earnings fell
   faster. Why? · **A:** Earnings fell 5.53% in rupees, from ₹2,93,033 crore to
   ₹2,76,831 crore, because the half that grew mostly stays with family while
   the half that shrank books hotels — which is exactly what the UN's manual
   said would happen. · dossier **§4g** + **§5** (IRTS 2008 ¶2.12)
3. **Q:** Which single country's collapse explains most of the drop in foreign
   tourists, and what caused it? · **A:** Bangladesh. India's second-largest
   source market in 2024 at 17,50,165 arrivals (17.59% of all FTAs) fell 73.37%
   to 466,012 after India restricted visas from August 2024. Strip Bangladesh
   out and the foreign half actually grew 4.25%. · dossier **§4i**

## 7. Names

Four, against the cap of twelve. The issue needs three of them.

| Name | Role phrase that introduces it | Rows |
|---|---|---|
| **Ministry of Tourism** | the government department that publishes these numbers | 1, 3, 5, 7, 8 |
| **Suman Billa** | Additional Secretary at the Ministry of Tourism, the official who runs India's inbound strategy | 9 |
| **UN Tourism** *(and the UN Statistics Division as the publisher of the manual)* | the body that writes the rulebook countries count by | 3, 6 |
| **Ross Bennett-Cook** — **optional, and I recommend cutting him** | a visiting lecturer at the University of Westminster who studies how Indians travel | — |

Everything else in the dossier is described, not named. Bangladesh, the United
States and the other source markets are countries in a chart, not names against
the cap.

**On Bennett-Cook:** his quotation (dossier §5) is about how far ahead Indians
book their holidays. That is an outbound-behaviour fact, and this issue is
about an inbound counting convention. Carrying him costs a name, a quote block
and roughly 50 words to introduce a person whose evidence does not touch the
argument. Cut unless the operator wants him.

## 8. Composer notes

**1. The 80-word head floor is the binding constraint on this issue, not the
1,100-word one.** The budget lands at 972 of 1,100 with room to spare, but at
72 of 80 before the first graphic. That sum includes the head *and* row 1's
eyebrow, title and intro. Any expansion of the hook, the dek or the primer has
to come out of row 1's nine-word intro, and there is nothing else to take it
from. This is also the reason the hero declines `layout: split` (§2).

**2. `approval-chart` and `launch-stats` are both unusable, so the crossover
beat is a `timeline`.** The dossier's §4b builds its flagship graphic on
`approval-chart` with `approve` = FTA and `disapprove` = NRI. I read the
component rather than the catalog line, and it cannot carry this data:

- `ApprovalChart.astro` clamps its y-scale to 0–100 **as a percentage**
  (`Math.max(0, Math.min(100, v)) / 100`) with hardcoded gridlines at 0, 25,
  50, 75, 100. Values of 9.15 and 11.07 would compress into the bottom 11% of
  the plot and never visibly cross — the exact thing the section exists to show.
- The caption chip is the literal string `approve / disapprove`, and the legend
  would print "Approve · now 9.15%" and "Disapprove · now 11.07%" to the reader.
- The catalog's own DON'T USE bars it for a non-opinion series, and the
  asteroid-2024-yr4 storyboard rejected it independently on the same ground.

I then took `launch-stats` (also never published) as a substitute — its grouped
year-bars are fully generic, auto-scaled, and its discontinuous year groups
make the dossier's "do not draw a continuous NRI line" instruction native. It
fails on one line: `LaunchStats.astro` line 40 prints
`<b>launches / yr</b>` unconditionally in the caption chip, with no `unit`
prop. A chart of tourist arrivals would ship with "launches / yr" beside its
caption. Its eight `DEFAULT_COLORS` are space-palette literals too, though
those are overridable per bar.

I also weighed **`age-pyramid`** (never published, mirrored bars, authorable
`unit` and side labels, a count ⇄ share instrument) with years as bands. Its
catalog DON'T USE bars it explicitly: *"one group's share tracked over time
(→ `approval-chart`)"*. I am not going to force an off-label kind to hit a
diversity floor I already clear.

**So the crossover is row 3, a `timeline`.** It is a workhorse and it wins the
issue no novelty, but the issue already clears the new-kind floor with two, and
a timeline of six printed years is the honest form for data with eight missing
years in the middle.

> **Operator: one line of component work would unlock `launch-stats` for this
> issue and every future one.** Change line 40 to `<b>{unit ?? 'launches / yr'}</b>`,
> add `unit?: string` to the props and to the kind's catalog DATA line.
> `check:catalog` check 5 would be satisfied because the field is genuinely
> read. That is a component change, outside my remit, and I have not made it.
> If you want it, it belongs in its own commit before the draft runs, and row 3
> then becomes `launch-stats` with a third new kind.

**3. `margin-bullets` is rejected on two independent grounds**, so the
dossier's optional §4f row is not in the spine. The catalog's DON'T USE sends
"values sharing one unit and scale" to `benchmark-chart`, and FTA 9.15, ITA
20.22 and NRI 11.07 are all millions of arrivals on one scale. Separately,
`MarginBullets.astro` needs four rows and the fourth (2019 foreign exchange
earnings) is [UNVERIFIED] in the dossier, leaving three. Either reason alone
would be enough.

**4. OPERATOR RULING NEEDED — the waffle's denominator (row 5).** Dossier §4c
marks this **[UNVERIFIED — materially important]**: the Jul–Sep 2025
purpose-of-visit table does not state on its face whether its denominator is
FTAs or ITAs. If it is ITAs, "Indian Diaspora 32.7%" understates the diaspora
badly, because the NRI half is 54.75% of ITAs. My spine labels the subject
`"arrivals, Jul–Sep 2025"` and lets the caption carry the ambiguity, which is
the dossier's own recommendation. **If you would rather not publish on an
unresolved denominator, there is a clean drop-in on a certain basis:** the same
`attrition-waffle` kind, same new-kind credit, built on the port split from
§4h — Delhi 35 · Mumbai 18 · Bengaluru 9 · Chennai 9 · Hyderabad 5 · everywhere
else 24 = exactly 100, six groups (the component's maximum), `trueN: 9150000`,
denominator stated as "share of foreign tourist arrivals by port of entry". It
loses the "a third of them also came to see family" beat, which is a real loss,
but every square is certain.

**5. OPERATOR RULING NEEDED — the Billa quotation (row 9).** Dossier §5 records
that both Billa quotes are the wording Skift printed, with no ministry
transcript or video found. The dossier judges direct attribution defensible,
since it is direct quotation in a named-interview piece from an allowlisted T4
trade outlet. The quote-attribution fallback would instead keep the wording and
attribute it to Skift's report. **Row 9 is the issue's closer, so this decides
how the issue ends.** I have written the row for direct attribution to Billa
per the dossier's judgment. Say the word and it becomes "told Skift" and the
intro reframes.

**6. `power-flow` was considered for the ITA = FTA + NRI identity and
rejected.** Two sources into one sink is a part-of-whole, and `PowerFlow.astro`
line 60 throws on exactly that case with the message *"needs ≥2 layers (see
blueprint §2 — use data-readout for part-of-whole)"*. The identity is carried
by row 2's `you-think` card in plain words instead, which is where a reader
actually needs it.

**7. The 2025 FTA vintage.** Dossier §4a gives 9.15 million / −8.07% from the
data portal. Use the portal figures and name the release on the source line. No
2026 year-to-date figure appears anywhere in this issue.

**8. AI tell 18 is the standing risk on this material.** "It is not a recovery,
it is a counting convention" writes itself here, in a dozen dresses, and the
contract caps the construction at one per issue and only where it *is* the
argument. It is barred from rows 1, 2, 6 and 9. If the drafter wants its one
reversal, spend it in row 3's intro and nowhere else.

**9. Build-check before publish.** The hero's reference line lands at 95.3% of
the track (`refValue / (refValue × 1.05)`), which puts `.bc__reflabel` hard
against the right edge. Look at it at 375px. If it clips, set an explicit
`maxValue: 120` to pull the line inward — the bars only get shorter, which
weakens the issue's own claim rather than flattering it, and is therefore the
correct direction to fail in.

**10. Sourcing floors already pass at the dossier.** §8 records 11 sources
across 7 publishers, tiers T0/T1/T4, top publisher at 27.3% — against floors of
8 sources, 5 publishers and no publisher above 40%. The drafter should not need
to add a source. The ₹3.5 crore line cites **Skift (1 Feb 2026)**, not
`indiabudget.gov.in`, which is the true primary but is off the travel
allowlist. Dossier §9 recommends adding that domain at T0; that is an operator
decision and not a blocker for this issue.

## 9. Kind ledger

Added 2026-09-16. The floors on drawn graphics and new kinds are checked
here before the draft, and by `npm run check:prose` after it (FEW-GRAPHICS,
CARD-HEAVY, NO-NEW-KIND). "New" means on the ledger in
`docs/generated/PROJECT-GRAPH.md` ("Never in a published issue") AND not
claimed by another storyboard dated within the last 30 days.

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `benchmark-chart` | 1 | **Yes** | No — published (Kessler) |
| `you-think` | 2 | No — plain-language card | No — published, all ten issues |
| `timeline` | 3 | **Yes** | No — published, nine of ten |
| `jargon-buster` | 4 | No — TEXT_ONLY in the gate, renders cells | No — published |
| `attrition-waffle` | 5 | **Yes** | **YES** |
| `prose` | 6 | No — text-only | No |
| `region-map` | 7 | **Yes** | **YES** |
| `number-sense` | 8 | No — plain-language card | No — published, eight of ten |
| `quote` | 9 | No — text-only | No |

- **Drawn graphics:** **4 of 9 rows (44%)** — floor 40% ✓ · distinct graphic
  kinds: **4** (`benchmark-chart`, `timeline`, `attrition-waffle`,
  `region-map`) — floor 3 ✓
- **Plain-language cards** (you-think · number-sense · jargon-buster ·
  three-steps): **3** — cap 3 ✓, and one of each ✓ (`you-think` ×1,
  `number-sense` ×1, `jargon-buster` ×1, `three-steps` ×0). `data-readout` is
  not used at all.
- **New kinds:** **2** — floor 2 ✓
  - **`attrition-waffle`** fills **G6, composition** — one cohort of 100 split
    by the reason each arrival gave (§4c). It is not hero-capable, which is why
    it sits at row 5 and not row 1.
  - **`region-map`** fills **G8, geographic** — ten real per-zone values from
    §4d. This is the strongest availability in the issue: four sibling
    storyboards in the backlist had to reject `region-map` for want of per-zone
    values, and this dossier carries a complete published country table.

**The other floors, checked here rather than after the draft:**

| Floor | This storyboard | Verdict |
|---|---|---|
| ≥ 60% visual (not TEXT_ONLY) | 6 of 9 = 67% | ✓ |
| Never two text-only rows adjacent | text-only at rows 4, 6, 9 — no pair | ✓ |
| First row is a graphic | row 1 `benchmark-chart` | ✓ |
| ≤ 3 `prose` rows of ≤ 200 words | 1 row, capped 160 | ✓ |
| ≤ 1 `paradox` | 0 | ✓ |
| ≥ 1 kind outside the six workhorses | 5 (`benchmark-chart`, `you-think`, `attrition-waffle`, `region-map`, `number-sense`) | ✓ |
| ≤ 1,100 reader-facing words | 972 budgeted | ✓ |
| ≤ 80 words before the first graphic | 72 | ✓ |
| ≤ 12 names | 4, and 3 recommended | ✓ |
| One hero | `benchmark-chart`, row 1 | ✓ |
| ≤ 3 loud sections | 0 WebGL, 0 `bleed`, 2 `wide` | ✓ |
| Never two WebGL kinds adjacent | 0 WebGL kinds | ✓ |
| ≤ 1 `bleed` per act | 0 | ✓ |

**Claimed-kind check.** This is the first storyboard of the 2026-09-16
two-per-desk round. The ten existing storyboards in `research/*/` are the
Phase 4 and Phase 6 rewrite round and predate the §9 template, so none carries
a kind ledger. I grepped each candidate kind by name across all of them:
`region-map`, `attrition-waffle`, `approval-chart`, `margin-bullets`,
`power-flow`, `city-compare`, `journey-map` and `route-card` appear only inside
"kinds considered and rejected" tables. **Neither of my two new kinds is
claimed by another storyboard in the round.**
