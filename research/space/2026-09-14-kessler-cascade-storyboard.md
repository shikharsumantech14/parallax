# Storyboard: Kessler cascade — altitude decides how long orbit remembers

- **Category:** space
- **Dossier:** none — this is a Phase 6 **rewrite** of a published issue that
  predates the pipeline. The factual record is
  `src/content/issues/2026-04-24-kessler-cascade/index.mdx` and its `sources[]`
  block (src-01 … src-12). Every fact below is already in that file; no claim,
  number, name or source is added.
- **Verification report:** none — the issue predates the verifier as well. There
  is no prior verdict to treat as a constraint, so §8b does the sourcing audit
  a verification report would normally hand over.
- **Composed:** 2026-09-14
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

> **REWRITE — Phase 6 (REGISTER-PLAN §8.1), the Phase 4 flagship method applied
> to the remaining six.** The five defects this rewrite exists to fix, as
> measured today:
>
> 1. **1,455 reader-facing words in 8 sections**, against a 1,100 ceiling.
> 2. **3 of 8 sections visual (37.5%)**, against a 60% floor. The issue **opens
>    on `prose` and closes on `prose`**, and `prose`, `comparison`, `paradox`
>    and `quote` are all in `TEXT_ONLY` in `scripts/check-prose.mjs`, so five of
>    the eight rows carry no graphic at all.
> 3. **341 words before the first graphic**, against a ceiling of 80. The
>    counter runs until it meets a visual kind, and section 1 is a lead plus
>    three paragraphs plus a 76-word `skimCaption`.
> 4. **35 names**, against a ration of 12. Most of them are agencies,
>    programmes, satellite models and rocket stages, which belong on the source
>    line (contract rule 9, tell 9, the stacked citation).
> 5. **One section draws a number nobody published.** `orbital-shells` renders
>    `density` as a 12-dot meter and its own intro says "values are illustrative
>    … not exact counts", with a source line that opens "Editorial synthesis".
>    Ruling requested in §8c.
>
> **Rewrite rules in force.** The slug `2026-04-24-kessler-cascade`, the `id`,
> `topic`, `publishedAt: 2026-04-24`, `tags`, `status: published` and all
> **twelve** `sources[]` entries are kept, so the URL does not move and every
> existing citation still resolves. No fact, number, name or source is added:
> every claim traces to a published section of that file. Arithmetic on the
> issue's own numbers is listed in §5 so the operator can rule on it.
> `readTimeMinutes` drops from 7 to 4. §8a lists which component `data` carries
> over verbatim and what is cut.
>
> **Two hazards the sibling rewrites had and this one does not.** The published
> file carries **no `story:` block**, so there are no 0-based beat indices to
> remap. And the MDX body is the scaffold comment only, so there are no
> unresolved `# EDITOR:` flags to carry forward.

---

## 1. The argument in one line

Space junk is no longer a forecast. It now makes itself faster than the air can
clear it, and how high a thing breaks decides whether orbit forgets it in two
years or keeps it past 2100.

## 2. The hero

**`benchmark-chart`** (G5 · entities ranked on one metric as horizontal bars),
at `layout: wide`, re-kinded from the published `comparison` and widened from
two events to five, with two `annotations[]`.

It carries the argument because the argument **is** the ranking. Every other
section says that altitude matters; this one draws it, with what is left of each
cloud written on its own bar. Five break-ups, one metric, and the bar that is
shortest is the one that cleared. The encoding and the argument agree: longer
bar means higher up means longer memory.

The published facts it renders, all of them already in the file:

| Bar | `value` (km) | `sublabel` | Published in |
|---|---|---|---|
| Fengyun-1C · 2007 | 865 | 3,500+ at the peak, about 2,800 left | `timeline` ev. 1, `comparison` |
| Rocket stage break-up · 2024 | 800 | 700+ fragments catalogued, about 800 km | `timeline` ev. 6 |
| Two satellites collide · 2009 | 789 | about 2,900 fragments | `timeline` ev. 2 |
| Cosmos 1408 · 2021 | 480 | 1,500+ fragments, 0.3% still up | `timeline` ev. 4, `comparison` |
| Mission Shakti · 2019 | 283 | about 125 fragments, nearly all gone | `timeline` ev. 3 |

`sortDesc: true`. `highlight: true` on **Mission Shakti** — the counter-example
is the reader's own country's test, and highlighting the *shortest* bar is what
makes the chart argue rather than rank. (Operator call, §8c ruling 6: the
alternative is highlighting Fengyun-1C, the worst.)

**No `refValue`.** There is no published threshold to draw a reference line at,
and inventing one would be inventing the chart's hardest mark. The two
`annotations[]` do the work a reference line would.

**Not `layout: split`, and why.** CANON §2 reserves `split` for the hero and
this is the hero, so it is available. I recommend against it: horizontal bars
with a label column and a sublabel column need the full measure, and a
half-width stage would wrap every sublabel to two lines. `wide` is right. No
other row takes anything but `default`. Flip it in one edit if you disagree.

**Not the hero, and why:** `timeline` is the issue's most familiar graphic and
is hero-capable, but it answers *when*, and the argument is *where*. The
timeline sets the five break-ups up; the hero is what they mean.

## 3. The beats

One row per thing the reader must get, in reading order. The first row after the
head is a graphic, never prose. No two text-only rows adjacent. At least six in
ten rows visual. ≥ 1 kind from outside the six workhorses.

*For this rewrite the last column cites the published issue's own section and
`sources[]` id in place of a dossier §4 row.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | The row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | It is not coming. It is here. The junk now makes itself faster than the air clears it. | G2 · belief vs data | `you-think` **[new]** | — | **87** · **`eyebrow` ≤ 2 w · `title` ≤ 4 w · no `intro`** (all three sit inside the 80-word count) · `think.label` ≤ 3 w · `think.text` ≤ 18 w · `actually.label` ≤ 4 w · `actually.value` "0" + `unit` " new launches" · `actually.text` ≤ 20 w · `note` ≤ 16 w · `caption` ≤ 14 w | The number that settles it is a zero. Even with nothing else launched, the total still rises | omit — `EXPLAIN['you-think'].what` fits | published `prose` 1, para 2 (the ESA 2025 reframing) · src-01 |
| 2 | Six break-ups wrote the orbit we fly in. Three were deliberate. One was an accident. Two were nobody's plan. | G4 · dated sequence | `timeline` **[carried, 6 events, notes halved]** | — | **162** · intro ≤ 24 w · 6 `date` verbatim · 6 labels ≤ 5 w · 5 notes ≤ 11 w · **2 annotations** ≤ 12 w · `caption` ≤ 14 w | — | omit — not in `NEEDS_HOW`, and the form reads itself | published `timeline`, all six events · src-01, 06, 07, 08, 12 |
| 3 | Three words the rest of the issue leans on, said once, in plain terms. | G1 · narrative (text-only) | `jargon-buster` **[new]** | — | **100** · intro ≤ 16 w · 3 terms (`term` ≤ 4 w · `meaning` ≤ 20 w) · **no Hindi gloss** (§5) | The fuel a satellite burns dodging is fuel it does not burn working | none (narrative kind) | published `prose` 1 para 1 (the 1978 model), `data-readout` tile 2 note · src-01, src-03 |
| 4 | 283 km and the air still reaches it. 865 km and nothing does. Same weapon, different memory. | G5 · ranked on one metric | `benchmark-chart` **[re-kinded from `comparison`, 2 → 5 items]** | **HERO** · `layout: wide` | **154** · intro ≤ 24 w · 5 labels ≤ 5 w · 5 sublabels ≤ 6 w · **2 annotations** ≤ 12 w · `caption` ≤ 16 w · **authored `plain`** ≤ 18 w | The thin upper air as a brake that only reaches so high | "Each bar is one break-up, drawn at the altitude it happened. A longer bar means higher up." | published `comparison` all 5 rows + `timeline` ev. 1, 2, 3, 4, 6 · src-01, 06, 07, 12 |
| 5 | The agency whose job is the count wrote "runaway chain reaction" in an annual report. | G1 · narrative (text-only) | `quote` **[carried verbatim]** | — | **91** · intro ≤ 20 w · quote 28 w verbatim, ellipsed (44 w unellipsed, §8g) · attribution ≤ 7 w · `followup` ≤ 24 w | — | none (narrative kind) | published `quote`, text and attribution unchanged · src-01 |
| 6 | Three lakh times in one year, a satellite got out of the way. That is the rent now. | G3 · one number made physical | `number-sense` **[new]** | — | **99** · intro ≤ 18 w · `value` "300,000" + `unit` "+" · `label` ≤ 6 w · 2 `equals` ≤ 9 w each + `note` ≤ 7 w each · `note` ≤ 18 w · `caption` ≤ 12 w | Said the way an Indian reader counts it: three lakh, and at least one every two minutes, all year | omit — `EXPLAIN['number-sense'].what` fits | published `data-readout` tile 2 (value and threshold both) · src-02 |
| 7 | Six readings off the board. The last one is a zero, and it is the one that matters. | G3 · a few headline numbers | `data-readout` **[carried, 5 tiles verbatim + 1 new]** | — | **146** · intro ≤ 20 w · 6 tiles (`label` ≤ 6 w · `note` ≤ 10 w) · `caption` ≤ 12 w | Nothing has ever been brought down. One mission flew within 15 metres of a dead stage and left | omit — `EXPLAIN['data-readout'].what` fits | published `data-readout` tiles 1, 3, 4, 5, 6 + closing `prose` para 1 · src-02, 04, 06, 09, 10 |
| 8 | You pay to dodge everyone else's junk. Nobody pays for their own. | G2 · two facts in tension | `paradox` **[carried as a kind, both sides re-cut]** | — | **132** · intro ≤ 18 w · 2 labels ≤ 4 w · 2 statements ≤ 10 w · 2 `detail` ≤ 36 w (published: 51 and 54) | A shared bill with no shared payer | omit — `EXPLAIN['paradox'].what` fits | published `paradox` both sides + closing `prose` para 3 · src-04, 05, 11 |

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic. Every cap above is tighter than its ceiling on purpose.

**Head:** 72 words (title 8 · dek 11 · hook 19 · primer 34).

**Total budgeted, the way the gate counts it: ~1,043 reader-facing words**
against the 1,100 ceiling. That is the 971 of row copy above plus the 72-word
head. `readerWords` in `scripts/check-prose.mjs` sweeps `eyebrow`, `title`,
`caption`, `plain` and `source` as well as the body fields, so those are already
inside each row's number — a budget built from intros and notes alone under-reads
by roughly 15 words a section. `value` and `unit` are in `SKIP_KEYS` and cost
nothing, which is why the `data-readout` and `number-sense` rows are cheap for
what they show. Published today: **1,455**. This spine is a **28% cut with every
sourced number kept**, and it leaves ~57 words of headroom.

**Words before the first graphic: 78.** Ceiling 80. **Read the arithmetic before
editing the head.** The gate counts head (title + dek + hook + primer) **plus
row 1's `eyebrow`, `title` and `intro`**, and only stops *after* the first
visual section (`check-prose.mjs`, the `before` loop):

| | Words |
|---|---|
| title 8 · dek 11 · hook 19 · primer 34 | **72** |
| row 1 `eyebrow` — **cap 2 words** | 2 |
| row 1 `title` — **cap 4 words** | 4 |
| row 1 `intro` — **none, deliberately** | 0 |
| | **78** |

Published today: **341** — the head, then the whole opening `prose` section
including its `skimCaption`, because the counter runs until it meets a visual
kind. Row 1's intro is deliberately empty: the eyebrow, the title and the
section numeral carry it. **Every word added to the head has to come out of
row 1's title, and the other way round.**

**Floors check.**
- **Visual 5 of 8 (62.5%, floor 60%)** — rows 1, 2, 4, 6, 7. Text-only 3 (rows
  3, 5, 8), never adjacent: the spine runs **V V T V T V V T**.
- The visual/text-only split is taken from `TEXT_ONLY` in
  `scripts/check-prose.mjs`, not from the catalog's narrative flag. That set is
  `act-break, prose, quote, analogy, beat-sheet, plate, comparison, paradox,
  jargon-buster, three-steps`. **`comparison`, `paradox`, `jargon-buster` and
  `three-steps` all count as text-only**, which is the single constraint that
  shaped this spine. It is also why the row count is eight and not nine: the
  record yields five genuinely drawable beats, and five visual rows support
  eight sections (62.5%) but not nine (55.6%, which fails). Adding a text row to
  make the issue longer breaks the floor outright.
- First section after the head is `you-think`, a VizCard kind in G2. The
  operator ruled this satisfies the floor on 2026-09-13 (delimitation ruling 4:
  "the gate counts every non-narrative kind as visual"). `firstVisual === 0`, so
  `NO-LEAD-GRAPHIC` does not fire.
- `prose` sections: **0** (ceiling 3). `paradox`: **1** (ceiling 1).
- Kinds from outside the six workhorses: **4** — `you-think`, `jargon-buster`,
  `benchmark-chart`, `number-sense` (floor 1, or 2 where the data supports it).
  Three of the four have never appeared in a published issue.
- `timeline` at **6 events** (ceiling 6), notes ≤ 11 words (ceiling 20).
- Loud sections: **0** (ceiling 3). No WebGL, no `bleed`, no `split`. One
  `wide`, on the hero. Sections: 8, inside CANON §3's 6–12.
- Names: **12** against the ceiling of 12 (§7), down from 35.
- Blocks: rows 2, 4 and 7 will each read `CHROME-HEAVY ℹ` at roughly fourteen
  text blocks. Every timeline and every tile row does. The gate's ℹ is
  informational and the alternative is a chart with no labels. Every other row
  sits at or under five.

**How-to-read panels: none authored, anywhere.** No kind in this spine is in
`NEEDS_HOW` (`src/lib/explainers.ts`) — no instrument, no WebGL scene, no
kind on the counter-intuitive list. Under RG-19 no default renders. The one
reading that genuinely needs saying, *a longer bar means higher up*, is FORM,
so it goes in the hero's authored `plain` (below the graphic) rather than in a
`howToRead` panel (above it). That is one block saved and the right field.

**`plain` lines: one authored, on the hero.** Rows 1, 6 and 7 take the
`EXPLAIN[kind].what` default, which describes each form correctly. Rows 3, 5 and
8 take none (`jargon-buster` and `quote` are narrative kinds; `paradox` has a
default). Row 2 takes the default. The hero must author one because the
`benchmark-chart` default ends "…the reference line the mark to beat", and this
chart deliberately has no reference line — the default would describe a mark
that is not on the page. The source renders on every section as the second line
of that paragraph (`core/Section.astro`).

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** Two kinds in
this spine carry the slot, `timeline` and `benchmark-chart`. Four required:

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 2 | `"Feb 10 2009"` | **"The first time two whole satellites ever hit each other."** (10 w) | Separates the accident from the tests. Three of these six were deliberate; this one was nobody's decision, which is the point the dates alone do not make. |
| 2 | `"Aug 6 2024"` | **"One break-up. About a tenth of last year's near-miss risk."** (10 w) | The newest event carries a tenth of the whole environment's risk. It is the sentence that makes "it is still happening" concrete, on the mark that carries it. |
| 4 | `"Mission Shakti · 2019"` | **"283 km. The air still reaches. Gone in two years."** (10 w) | The counter-example, said on the shortest bar. This is the half of the argument a ranking cannot say by itself. |
| 4 | `"Fengyun-1C · 2007"` | **"865 km. Nothing slows it. Still there after 2100."** (9 w) | The other half, on the longest bar. Together the two callouts ARE the issue's thesis, in nineteen words, where the reader is already looking. |

`you-think`, `number-sense`, `data-readout`, `jargon-buster`, `quote` and
`paradox` are **not** in the eight annotation-enabled kinds, so their finding
rides the section title and the caption.

**Rhetorical jobs (4 of the eight, `_voice-core.md` §7).** INVESTIGATION opens
(row 1: the anomaly as a graphic, first) · CONVERSATIONAL EXPLAINER carries rows
2, 3, 4 and 6 — **four of eight, exactly the half the contract requires** · AWE
takes row 7, where the space desk's one licensed marvel lives and where the
zero lands (the awe is in the fact, never in the adjectives) · CALM-STRUCTURAL
takes rows 5 and 8, naming the structural cost with the connective written.
**Zero SATIRICAL EXPOSURE** (the $150,000 fine is the temptation, and the tile
states it without comment). At most one LYRICAL paragraph: I recommend spending
none. Row 8's second detail is a landing already, and a lyrical turn on top of a
policy fact would read as decoration.

## 4. The head

- **Title (states the finding, ≤ 8 words):** **"Space junk now *grows* even if nobody launches"** (8 words)
  - Retires **"The Orbit That *Remembers*"** for two reasons, and the first is
    mechanical: it is the retired "The ‹Noun› That ‹Verb›s" construction
    exactly, and `check-prose.mjs` flags it today as `TITLE-FORMULA` on the
    regex `/^The .+ That /i`. Second, it names the subject and withholds the
    finding (rule 11). The new title states ESA's 2025 finding in words a reader
    gets before the first section.
  - Alternate for the operator: *"Orbit forgets 283 km. It remembers 865 km."*
    (8) — sharper, carries the hero's two numbers, but it asks the reader to
    hold two altitudes before anything has explained them. My recommendation is
    the first; the second is one edit away.
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"Last year one company's satellites dodged 300,000 times. The junk you never see has never once been cleaned up."** (19 words)
  - Published hook: 27 words, no "you", and it opens "Space junk isn't a future
    scenario", which is the "not X, it's Y" shape the tell catalog rations.
  - **This is where the issue's single reversal is spent** (tells 2 and 19). The
    twist is carried by "never once been cleaned up" against a number in the
    hundreds of thousands, not by an "It is not X. It is Y." The drafter must
    not reach for that construction in rows 1, 3 or 8, and row 8 in particular
    must not mirror it (tell 22).
  - "One company's satellites", not "satellites": the published figure is
    Starlink's fleet, and generalising it to all operators would overstate a
    sourced number.
- **Dek (≤ 14 words):** **"Two tests, two altitudes. One cloud cleared. One stays past 2100."** (11 words)
  - Retires "Every altitude remembers differently" — true, and it states nothing.
    The new dek is the hero's finding in eleven words and sets the reader up for
    the chart. It is a sequence, not an antithesis, so it does not trip tell 8
    beside the hook.
  - No Hindi here: the dek sits directly above a section full of figures, and
    §2's precision test keeps Hindi away from them. See §5 — the issue carries
    none at all, deliberately.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"Low Earth orbit runs 160 to 2,000 km up. Every collision there makes thousands of fragments, and each can start the next. In 2025 the agency that counts them said the chain has begun."**
  (34 words, ~183 characters — inside the 80–420 bound. Published primer: 65
  words, ~415 characters, sitting at the Zod ceiling.)
  - **The published primer's GPS claim is dropped, not restated.** It reads
    "Low Earth orbit — 160 to 2,000 km up — is where GPS, weather satellites,
    and the ISS operate." GPS satellites are not in low Earth orbit. This is
    the one place the rewrite changes what the published issue asserts, and it
    does it by **removing** a claim rather than adding one, so no source is
    needed. Ruling 7 in §8c flags it for the operator because it is a
    correction, however quiet.
  - ESA is not named in the primer. "The agency that counts them" costs four
    words instead of six and holds the name back for row 1, where the caption
    and the source line carry it.

## 5. The Indian ground

**This issue is unusually well placed already, and the ground is in the record
rather than imported.** India is one of only four actors named in the published
file, it owns one of the five bars on the hero, and the one policy fact the
issue turns on has India in it.

| Ground | Where it lands | The published row behind it |
|---|---|---|
| **Mission Shakti, India's 2019 test** — deliberately low at 283 km, about 125 fragments, nearly all of it gone within two years | row 4 (a bar on the hero, `highlight: true`) and its first annotation; row 2, timeline event 3 | published `timeline` ev. 3 · src-01 |
| **India abstained** on the 2022 UN ban on destructive anti-satellite tests | row 8, `paradox` side B `detail`, verbatim from the published wording | published `paradox` detail 1 · src-05, src-11 |
| **lakh, as the native unit** — "three lakh course changes, one fleet, one year" | row 6, `number-sense` `equals[1]` | published `data-readout` tile 2 · src-02 |
| **Odds and rates said out loud** — "at least 34 every hour, all year long"; "a three-in-ten-million chance of a hit" | row 6, `equals[0]` and `note` | published `data-readout` tile 2 note · src-02 |
| **The space station, described not named** — it has moved 39 times since 1998 to get out of the way | row 7, tile 3 | published `data-readout` tile 4 · src-10 |

**Money: one figure, and I recommend it stays unconverted.** The issue's only
currency is **$150,000**, the FCC's largest orbital-debris penalty, levied on
one operator in **2023**. Contract §3 rule 4 converts CURRENT foreign-currency
figures and leaves historical ones alone. A dated 2023 penalty is historical,
so no bracketed ₹ — and a rupee figure would in any case need a rate and a month
on the source line, which is a new fact and a composer does not add sources.
**Ruling 8 in §8c.** If the operator wants the size felt without a conversion,
the honest move is the tile note, not a comparison: one case, ever.

**A trap the drafter must not fall into.** The obvious Indian habit to reach for
is the monsoon forecast, and it would be wrong. India's forecasting leans on
geostationary weather satellites, which sit far above the 2,000 km band this
issue is about. The primer's generic "weather satellites" is fine; tying it to
the Indian forecast is a claim the record does not carry and the physics does
not support. **Do not write it.**

**No Hindi in this issue, deliberately.** Every candidate word here sits next to
a number, an altitude or a term of art, and the contract's precision test keeps
Hindi away from all three. The space desk's one licensed awe word was also spent
this week on the sibling rewrite (`2026-09-14-asteroid-2024-yr4-storyboard.md`
§8c ruling 5), and repeating it across two space issues in one week is a tic
rather than a register. The Indian ground here is carried by Mission Shakti, the
abstention and lakh, which is more than most issues get. If the operator wants
one word anyway, the only field in this spine that passes all four tests is row
5's `followup`, and it should be chosen by the operator rather than the drafter.

**Derivations used** (arithmetic on the issue's own numbers — no new fact, no new
source, listed so the operator can rule):

1. **"three lakh"** = 300,000 in the unit an Indian reader counts in. Not
   arithmetic, a re-reading. Row 6 `equals[1]`.
2. **"at least 34 every hour, all year long"** = 300,000 ÷ 365 ÷ 24 = 34.2.
   Row 6 `equals[0]`, with the basis in its `note`. **"At least"** is
   load-bearing: the published figure is "300,000+", a floor, not a count.
3. **"at least one every two minutes"** = 60 ÷ 34.2 = one every 1.75 minutes.
   Row 6 `note` or the row 6 intro. Same "at least" caveat.
4. **"about 2,800 of 3,500+ still up"** = the published pair, stated as a
   fraction rather than as two bare numbers. Row 4, the Fengyun-1C `sublabel`.
   Both figures are published; the ratio is not asserted as a percentage.
5. **"nineteen years on"** = 2007 → 2026. Row 4 caption, if the drafter wants it.
6. **"about 800 km"** — carried, not derived. The record writes the 2024 rocket
   stage break-up as "~800 km" and the bar is drawn at 800. The `sublabel` keeps
   the word "about" so the approximation survives the loss of the tilde.

**Offered and NOT recommended.** "$150,000 across 10,074 satellites is about $15
each" is arithmetic on two of the issue's own numbers, and it is the kind of
line that lands. It is also dishonest: the fine was levied on one operator for
one satellite, and the fleet it would be divided by belongs to a different
company. Do not write it. If the operator wants it anyway, it needs to be said
as a comparison between two unrelated things, out loud, which costs more words
than it buys.

## 6. The three questions

What the issue must teach. Written from the published record, not from any
draft; the reader panel answers them from the draft alone. If the draft cannot
teach these, the draft is wrong.

1. **Q:** Two anti-satellite tests both made clouds of thousands of fragments.
   Why is one cloud gone and the other still up there?
   · **A:** How high they happened. India's 2019 test was at 283 km, where the
   thin upper air still drags fragments down, and nearly all of it was gone
   within two years. China's 2007 test was at 865 km, where there is almost
   nothing to slow anything down. About 2,800 of its fragments are still in
   orbit and the cloud is not expected to clear before 2100.
   · rows 4 (the hero and both its annotations), 2 · published `comparison` all
   five rows + `timeline` ev. 1 and 3 · src-01, src-07, src-12.
2. **Q:** What did the European Space Agency say in 2025 that was new?
   · **A:** That it has already started. Break-ups now add debris faster than the
   atmosphere pulls it back down, so the total would keep rising even if nobody
   launched another satellite. That is the formal definition of Kessler
   syndrome, written for the first time in the present tense.
   · rows 1, 3, 5 · published `prose` 1 para 2 + `quote` · src-01.
3. **Q:** What does it already cost to share low orbit, and who pays for the
   junk left behind?
   · **A:** One company's satellites made more than 300,000 avoidance
   manoeuvres in 2025, and the space station has moved 39 times since 1998.
   Nothing has ever been removed from orbit. The largest penalty ever levied for
   leaving a satellite where it should not be is $150,000, in a single case, and
   the international ban on destructive tests is not binding.
   · rows 6, 7, 8 · published `data-readout` tiles 2, 4, 6 + `paradox` +
   closing `prose` para 3 · src-02, src-04, src-09, src-10.

Questions 1 and 3 are answerable from a drawn graphic alone. Question 2 is the
one this spine has to work for: it is answered by row 1's `actually` panel plus
the verbatim quote in row 5, and if the panel cannot answer it, the fix is
sharpening row 1's `note`, not adding prose.

## 7. Names

**Twelve**, exactly at the ceiling, against the 35 the published issue carries.
No spare slots: the drafter may not add a thirteenth without dropping one.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **ESA** | Europe's space agency, whose annual count of what is up there changed the tense in 2025 | row 1 caption, row 5 attribution, rows 2 and 7 source lines |
| **NASA** | the American space agency, whose scientists published the 1978 model and whose debris office does the counting | row 3 gloss, source lines |
| **Kessler** | the scientist the syndrome is named after, in the 1978 paper that predicted it | row 3, term 1 only |
| **Fengyun-1C** | the Chinese weather satellite shot down in 2007 at 865 km, the worst debris event on record | row 2 label, row 4 bar label and annotation |
| **Cosmos 1408** | the dead Russian satellite shot down in 2021 at 480 km | row 2 label, row 4 bar label |
| **Mission Shakti** | India's 2019 anti-satellite test, fired deliberately low | row 2 label, row 4 bar label and annotation |
| **Starlink** | the broadband fleet that is 10,074 satellites and does most of the dodging | rows 6 and 7 |
| **China** | one of the two states that voted against the ban and caused one of the two worst clouds | rows 2 and 8 |
| **Russia** | the other | rows 2 and 8 |
| **India** | the state that tested lowest and abstained from the ban | rows 4 and 8 |
| **United Nations** | the body whose 2022 resolution called for a moratorium, 155 votes to nine | row 8 |
| **FCC** | the American regulator whose five-year disposal rule is the one binding rule, and whose largest penalty is a single case | rows 7 and 8 |

**Described, not named** (every one of these is currently named in the published
file): **the ISS** → "the space station", which is plainer and buys the slot the
UN needs; **Donald Kessler and Burton Cour-Palais** → "the scientists who
predicted it in 1978", with Kessler surviving only inside the term itself;
**the Journal of Geophysical Research** → dropped, the source line carries it;
**Iridium 33 and Cosmos 2251** → "two satellites collide", which is what the bar
and the annotation both say; **Long March 6A and Qianfan** → "a rocket stage
breaks up after deploying a new constellation"; **RESURS-P1** → "a defunct
six-tonne Earth-observation satellite"; **LeoLabs, CelesTrak, Planet4589 and
Jonathan McDowell** → source lines only; **Tiangong, OneWeb, Kuiper,
Starshield** → gone with `orbital-shells` (§8a); **DISH Network and EchoStar-7**
→ "one operator, one satellite", in the $150,000 tile note; **Astroscale,
ADRAS-J, ADRAS-J2, H-2A** → "one mission flew within 15 metres of a dead rocket
stage and left"; **ClearSpace-1, VESPA, PROBA-1, Vega** → cut entirely, and for
a sourcing reason rather than a naming one (§8c ruling 5). Earth, Siberia and
the altitudes are places and numbers, not names, and do not spend from the
ration.

**Source lines only, never inside a sentence** (rule 9, tell 9): ESA Space Debris
Office · NASA Orbital Debris Program Office · LeoLabs · CelesTrak · Jonathan's
Space Report · SpaceNews · US Space Command · Astroscale · FCC orbital-debris
reports · Secure World Foundation · Orbital Radar. The published `data-readout`
tile notes carry "Long March 6A", "DISH Network" and "EchoStar-7" inside the
sentence today; all three come out and the section `source` carries them.

## 8. Composer notes

### 8a. What carries over, section by section

Component `data` is expensive, so the rewrite reuses it wherever the register
allows. **Numbers are copied from the published file, never retyped** (rule 13),
including the "+" on "1,500+", the "~" on "~2,900", the "$" on "$150,000" and
the comma placement on "10,074" and "7,473".

| Published section | Verdict | Detail |
|---|---|---|
| `prose` 1 — "The *cascade* is not a scenario" | **CUT as a section, content re-drawn** | ~300 words plus a 76-word `skimCaption`, and the single largest cause of the 341-words-before-the-first-graphic failure. Paragraph 2 (the ESA 2025 reframing) becomes row 1's `actually` panel in 20 words. Paragraph 1 (the 1978 model) becomes row 3's first gloss. Paragraph 3 is a table of contents for the issue and is cut outright. The `skimCaption` goes with it; the restatement it carried moves into row 2's intro, where a reader can actually see it (`skimCaption` renders only in Skim mode). **This is the change the floors force** — the issue may not open on prose. |
| `timeline` | **carried, all 6 events, notes halved** | Every `date` and `state` value unchanged. Labels fall from ~8 words to ≤ 5 and lose the model names (§7); notes fall from ~22 words to ≤ 11 because the fragment counts and the altitudes now live on the hero's bars and its sublabels. Gains `annotations[]` and a `sourceRefs[]`. Keeps `source: { label: "ESA Space Debris Office" }`, extended to cover src-06 and src-08. |
| `comparison` | **CUT as a kind; re-kinded to `benchmark-chart` and promoted to hero** | It is in `TEXT_ONLY`, so it costs a visual row instead of buying one, and it shows two of the five break-ups the record measures. Every one of its five rows survives: `Altitude` becomes the bar value, `Trackable fragments at peak` and `Still in orbit` become the sublabel, `Projected full decay` becomes the two annotations, `Current risk contribution` is the chart's own reading and needs no words. Its `data.source` lists "CelesTrak catalog", which resolves to no `sources[]` entry; the new source line lists only the four that do. |
| `orbital-shells` | **CUT — ruling requested, §8c.1** | |
| `data-readout` | **5 tiles verbatim, 1 tile replaced, notes halved** | `value` and `unit` unchanged on "10,074", "~10"/"%", "39", "7,473" and "$150,000". Tile 2 ("300,000+") is **promoted out** to row 6, where it gets a whole section, and its slot is taken by the new zero tile (§8c.6). Notes fall from ~12 words to ≤ 10 and the names inside them come out into the `source` (tell 9). `caption` "LEO OPS · 2024–2026 SNAPSHOT" is carried, retimed to the tiles that remain. |
| `paradox` | **carried as a kind, both sides re-cut** | The catalog's USE WHEN is "two facts that are **both true** and pull in opposite directions". The published sides are not in tension: "the treaty has no teeth" and "the regulator has one case" are two instances of the same fact, which is why the section reads flat. The re-cut keeps every number and makes it an actual paradox: side A is what everyone already pays to dodge the junk, side B is that nobody pays for the junk they leave. Both `detail` blocks fall from 51 and 54 words to ≤ 36. The UN vote (155 / 9 / 9), the nine against, India's abstention and "not legally binding" all carry verbatim. |
| `quote` | **carried verbatim** | The 44-word ESA sentence and the attribution are unchanged, ellipsed at the middle to 28 words (see §8g — the full version is affordable and is the operator's call). The published `followup` is rewritten: it currently spends its length re-explaining the quote, and the re-cut spends it on what the quote implies for the sections that follow. Gains a `source` — it has none today, against CANON §7. |
| `prose` 2 — "The *cleanup economy* doesn't exist yet" | **CUT; one fact promoted, the rest lost for want of a source** | ~250 words. Paragraph 1's ADRAS-J facts (src-09) become the new `data-readout` tile and its note. Paragraph 3's economics become `paradox` side B. **Paragraph 2 is cut for a sourcing reason, not a length one**: the ClearSpace-1 / VESPA / PROBA-1 / Vega material is backed by no entry in `sources[]` and the section itself carries no `source` at all. §8c.5. |
| `sources[]` src-01 … src-12 | **all twelve unchanged, and all twelve still in use** | No orphans: src-03 backs row 3's first gloss, src-08 the RESURS-P1 timeline event, src-09 the zero tile, src-10 the space-station tile, src-11 the abstention, src-12 the Fengyun-1C bar. §8b maps every row. |
| frontmatter | **`id`, `topic`, `publishedAt`, `status`, `tags` unchanged** | `readTimeMinutes` 7 → 4. `title`, `hook`, `dek`, `primer` per §4. The optional `voice` field is unset; leave it unset or set `CONVERSATIONAL EXPLAINER`, the dominant job. |
| `story:` | **does not exist** | The published file has no `story` block, so there are no 0-based `story.beats[].section` indices to remap. This is the hazard that bit both sibling rewrites and it is absent here. If the operator wants story cards for this issue, authoring them is a separate editorial act after the draft lands. |

### 8b. Sourcing — the audit a verification report would have handed over

Every row needs a `source` under CANON §7. The published issue satisfies this on
five of eight sections, and `sourceRefs[]` is **empty on all eight**. The rewrite
touches every section, so backfilling is free now and expensive later.

| Row | Kind | `source` label | `sourceRefs[]` |
|---|---|---|---|
| 1 | `you-think` | ESA Space Environment Report 2025 | src-01 |
| 2 | `timeline` | ESA Space Debris Office, with US Space Command and SpaceNews | src-01, 06, 07, 08, 12 |
| 3 | `jargon-buster` | Kessler and Cour-Palais 1978, with ESA | src-01, src-03 |
| 4 | `benchmark-chart` | NASA Orbital Debris Program Office, LeoLabs and ESA | src-01, 06, 07, 12 |
| 5 | `quote` | ESA Space Environment Report 2025 | src-01 |
| 6 | `number-sense` | FCC orbital-debris reports and Jonathan's Space Report | src-02, src-04 |
| 7 | `data-readout` | FCC, NASA, Astroscale and Jonathan's Space Report | src-02, 04, 06, 09, 10 |
| 8 | `paradox` | UN General Assembly resolution record, with Secure World Foundation and the FCC order | src-04, 05, 11 |

**Three published sections carry no `source` today** and all three are affected:
`prose` 1 (cut), `quote` (gains src-01), `prose` 2 (cut). **Two published source
lines cite documents that resolve to no `sources[]` entry** and both disappear
with their sections: "CelesTrak catalog" on the `comparison`, and "Editorial
synthesis · … · SpaceX FCC filings" on `orbital-shells`. Nothing in the new
spine cites a document the bibliography does not carry.

### 8c. The rulings I am asking for

> ## SETTLED — operator ruling, 2026-09-15
>
> **All ten settled as recommended.** The reasoning below is kept verbatim;
> this block is what the drafter executes.
>
> 1. **`orbital-shells` is CUT.** Its `density` field is the component's only
>    quantitative encoding and the section itself declares it editorial. Same
>    standard the operator applied to `signal-readout` and `trajectory-arc`.
> 2. **No WebGL kind in this issue.** `constellation-swarm` is blocked for want
>    of per-shell inclination and counts. `orbit-globe` is fillable and still
>    barred: without `inclDeg` every ring renders equatorial, and the scene
>    draws one satellite per ring regardless of `satCount`, so two of the three
>    things it promises would be invented. The single fetch that would unblock
>    the space desk's first WebGL section is recorded in 8c.2 as a research job
>    for a future issue. **Do not attempt it in this rewrite.**
> 3. **The `comparison` becomes the hero as a `benchmark-chart`** at
>    `layout: wide`, five bars, every value published.
> 4. **The `paradox` is kept and both sides rewritten.**
> 5. **The ClearSpace-1 material is CUT.** No `sources[]` entry backs it and a
>    rewrite adds none. It is the best line in the published issue and it still
>    goes.
> 6. **The new tile is the zero:** "0 · pieces of debris ever removed from
>    orbit", note "One mission flew within 15 metres in 2024, then left."
> 7. **The primer's GPS claim is dropped.** GPS satellites are not in low Earth
>    orbit. The rewrite does not restate it, so nothing is added.
> 8. **The $150,000 stays unconverted.** A 2023 penalty is historical under
>    contract §3 rule 4. No bracket, no rate.
> 9. **`highlight: true` on Mission Shakti**, the shortest bar.
> 10. **`layout: wide` on the hero, not `split`.**
>
> **Read before drafting:** the budget is ~1,043 of 1,100 with ~57 words of
> headroom, names sit at **12 against a ceiling of 12** (§7) so not one may be
> added, and words-before-first-graphic is 78 of 80 with row 1 carrying no
> `intro`. Zero em-dashes and zero semicolons (operator ruling 2026-09-14).


**1. `orbital-shells` — CUT. Recommended.**
Its five rows carry real, sourced altitudes, operators and decay windows, and
one invented number. `density` (2, 11, 6, 9, 5) is the component's **only**
quantitative encoding: `OrbitalShells.astro` renders it as a twelve-dot meter
with `aria-label="Relative density N of 12"`, and it is a required field, so
there is no version of this section without it. The published intro says so out
loud — "Density shown at editorial scale; values are illustrative of current
population concentrations, not exact counts" — and the source line opens
"Editorial synthesis". Under the standard the operator set on 2026-09-14, a
graphic whose drawn value is editorial fails the verifier's trace, and the
honesty labels the original drafter added are doing work a component should not
need. **The beat survives and is better served.** "Each altitude band has a
different decay rate" is not five bands of invented density; it is the hero's
axis, said with five real altitudes and five real outcomes. The operators list
also spent ten of the issue's thirty-five names on satellite programmes that
appear nowhere else. *What would unblock the kind itself:* a published
per-band object count from ESA's Space Environment Report or McDowell's tables.
That is a research job, and a rewrite may not add a source.

**2. No WebGL kind in this issue. Recommended, and this is the compositional
call the plan asked for.**
REGISTER-PLAN §8.1's note on this issue says "`orbit-globe` / `constellation-swarm`
data exists in the space dossier". **There is no space dossier for this issue**,
and against the published file the two kinds fail differently:

- **`constellation-swarm` is blocked outright.** Its DATA requires, per shell,
  `altKm`, `inclDeg` **and** `count`, with none of the three optional, and the
  catalog's capture note wants them from a primary filing. The published record
  has one fleet total (10,074, src-02), five band-centre altitudes, and **no
  inclination anywhere in the file**. There is no shell census to render.
- **`orbit-globe` is fillable and should still not be used.** Its required
  fields are only `name` and `altKm`, which the five bands supply. But
  `inclDeg` is optional and defaults to zero, and `scenes/orbitGlobe.ts` sets
  `ring.rotation.x = Math.PI / 2 - (o.inclDeg || 0) * Math.PI / 180` — so every
  ring renders in the equatorial plane. None of these orbits is equatorial. And
  `satCount` is legend text only: the scene draws exactly one satellite per
  ring regardless, so the satellite *population* the kind exists to show is
  five dots. Its own default explainer promises "each ring is one orbit at its
  real altitude **and tilt**; the coloured dots are satellites, and busier
  constellations carry more of them" — two claims the record cannot back. That
  is the same defect the operator cut `signal-readout` and `trajectory-arc` for
  this morning, in a louder wrapper.

**The single fetch that would unblock the flagship:** per-shell altitude,
inclination and active-satellite count for the Starlink shells, from McDowell's
own tables (src-02 is already in `sources[]`, so this is one page-read away) or
the SpaceX FCC filing. With those three numbers per shell, `constellation-swarm`
becomes the right hero for this issue and the space desk gets its first
published WebGL section. It is a research job, not a composition failure, and
it is the highest-value note this storyboard leaves behind.

**3. The `comparison` becomes the hero as a `benchmark-chart`. Recommended.**
Two entities and five prose rows become five entities and one metric, and the
section moves from the gate's text-only set into the visual set. Every value is
published. This is what makes 62.5% visual reachable at all.

**4. The `paradox` is kept, and both its sides are re-written.** The published
section is not a paradox by the catalog's own USE WHEN, and the one-per-issue
ration is better spent on the tension that is actually there. Recommended. If
the operator would rather keep the published treaty/regulator framing, say so
and the details carry over at ≤ 36 words each, but the section will still read
as two examples rather than two forces.

**5. The ClearSpace-1 material is CUT for want of a source. Recommended, and
this is a floor, not a preference.**
The published closing `prose` asserts that ESA's ClearSpace-1 targeted the VESPA
adapter left by a Vega launch in 2013, that VESPA was itself hit by debris in
August 2023, and that the mission switched to PROBA-1 and slipped to 2028. It is
the best line in the published issue: the debris-removal target was destroyed by
debris. **No entry in `sources[]` backs any of it**, and the section carries no
`source` at all. A rewrite adds no sources, so it goes. *If the operator wants
it,* one ESA ClearSpace-1 mission page added to `sources[]` restores it, and the
honest home is a second `equals` line on row 6 or a seventh tile — but that is
an addition to the bibliography and therefore the operator's call, not mine.

**6. The new `data-readout` tile: "0 · pieces of debris ever removed from
orbit". Recommended.**
It replaces the promoted 300,000+ tile. The value is a reading of the published
closer, which says active debris removal "is a technology demo, not an industry"
and that the only completed mission photographed a derelict stage and is now
deorbiting itself. Its note carries the published number: *"One mission flew
within 15 metres in 2024, then left."* (10 w). It is the issue's hardest
number and it is a zero. *The conservative alternative,* if you would rather
the tile state only what is literally published: value "15", unit " m", label
"closest a cleanup mission has come", note "2024. It photographed a dead rocket
stage and left." Both trace to src-09. I recommend the zero because it is the
fact the reader must leave with, and the 15 metres survives either way.

**7. The primer's GPS claim is dropped.** The published primer says low Earth
orbit "is where GPS, weather satellites, and the ISS operate". GPS satellites
are not in low Earth orbit. The rewrite does not restate it, so no source is
needed and nothing is added — but it does change what the published issue
asserts, which is why it is here rather than buried in §4. Flagged for the
operator's read.

**8. The $150,000 stays unconverted.** It is a 2023 penalty, which contract §3
rule 4 treats as historical, and a rupee figure would need a rate and a month on
the source line. That is a new fact. If the operator disagrees and wants the
bracket, the rate has to come from the operator, not the drafter.

**9. `highlight: true` on Mission Shakti**, the shortest bar, because the
counter-example is what makes the chart argue rather than rank. The alternative
is Fengyun-1C, the worst event. Note that the issue is not flattering India
either way: row 8 carries the abstention in the same breath.

**10. `layout: wide` on the hero, not `split`.** §2 gives the reason.

### 8d. Kinds I wanted and could not use

| Kind | Why it fitted | What blocked it |
|---|---|---|
| `constellation-swarm` [3D] | The flagship for exactly this subject: a real mega-constellation on its real shells, at true scale, with a line-art Earth. It would answer "how crowded is it actually" with no invented mark. | `shells[]` requires `altKm`, `inclDeg` and a true `count` **per shell**, none optional. The file has one fleet total and five band-centre altitudes, and **no inclination anywhere**. See §8c.2 for the one fetch that unblocks it. |
| `orbit-globe` [3D] | Fillable on its required fields from the five published bands. | Two of the three things it draws would be invented: rings default to the equatorial plane without `inclDeg`, and the satellite population is one dot per ring without `satCount`. §8c.2. |
| `orbit-trace` | The 2-D sibling, a space signature, and every value it draws (`altKm`) is published. Not blocked by data at all. | Blocked by redundancy and by precision. The hero already draws altitude, and this would draw the same axis twice in one issue. It also needs a bare number where the record writes "~400 km", and a ring at an exact radius reads as an exact altitude. It is in `NEEDS_HOW`, so it would also add a panel. **If the operator wants a second altitude graphic, this is the one to take**, and it costs the `data-readout`'s slot. |
| `orbital-shells` (the incumbent) | Space signature, hero-capable, already authored, and the beat is real. | Its one quantitative encoding is declared editorial by the section itself. §8c.1. |
| `comparison` (the incumbent) | Two events, five attributes, already authored and already sourced. | No data gap. It is in `TEXT_ONLY`, so it costs a visual row instead of buying one, and it shows two of the five break-ups the record measures. |
| `vote-result` | The UN vote, 155 for and nine against, is the policy row's best number and a drawn chamber of dots would be striking. | `required` and `shortfall` are required fields and "the shortfall is the story". The record gives no threshold and no shortfall, and the resolution passed. Drawing a majority line would be inventing the section's subject. |
| `power-matrix` | The standard swap for a who-is-bound-by-what grid, and the one that worked on the cockroach rewrite: enum cells consume zero words and turn a text row into a visual one. | Every cell must be filled, and `cellFor` silently defaults a missing cell to `control: 'none'`, which renders as an assertion. The record says how three states voted and nothing about whether a US regulator reaches them, so half the grid would be inference rendered as a filled glyph. The legend is hardcoded to "Full control / Partial / None", which is the wrong reading for "does this rule bind you". |
| `scaling-plot` | Altitude against how long debris stays IS the issue's claim, as an x/y relationship, and it carries an `annotations[]` slot. | The y-axis does not exist as numbers. The record gives "substantially all decayed within two years", "2025–2026", "after 2100", "50–100+ yrs" and "centuries" — strings, ranges and one open bound. Fitting anything through them manufactures the issue's central number. |
| `launch-stats` | Events counted per year is the natural shape for "it keeps happening". | One year's figure (7,473 objects added in 2024) and six dated events. Two points is not a cadence, and the other years are not in the file. |
| `three-steps` | The cascade in three cards, needing no numbers: a break-up makes fragments, the fragments hit more things, the air cannot keep up. It is the cleanest possible answer to quiz question 2. | `TEXT_ONLY`. A fourth text-only row in an eight-row spine drops the visual share to 50% and there is no adjacency-safe slot. Its content sits inside row 3's first gloss, next to the real dates. |
| `analogy` (`pairs[]`) | A this ↔ that mapping for the cascade. | Text-only again, and the mapping it would carry already sits inside row 3's glosses. Memory of the last four storyboards: `analogy` loses this trade every time. |
| `region-map`, the G8 family | The instinct for anything called an environment. | Wrong shape. These events have altitudes, not places. The record names exactly one location, "over northern Siberia", and it is incidental. |
| `number-sense`, a second time | On 7,473 objects added in one year, which is a felt number. | Nothing blocks it except taste and the visual/text arithmetic: two `number-sense` sections in eight is a tic, and the figure already has a tile. It is the ninth row if the operator wants the spine longer, and it would take the spine to 6 visual of 9 (66.7%), which passes. See §8f. |

### 8e. The `plain` / `caption` / `howToRead` split, on the hero

This is the one section where the three fields are easy to confuse, so they are
spelled out:

- **`plain` (the FORM, below the graphic, authored):** *"Each bar is one
  break-up, drawn at the altitude it happened. A longer bar means higher up."*
  No data claim, so no `PLAIN-CLAIM` flag.
- **`caption` (the DATA claim, the only field the verifier traces):** *"Five
  break-ups by altitude. The lowest cleared in two years. The highest clears
  after 2100."* (15 w)
- **`howToRead`:** none. `benchmark-chart` is not in `NEEDS_HOW`, the reading
  that needed saying is FORM and is in `plain`, and a panel above the graphic
  would be a fourth block on a section that already carries fourteen.

### 8f. If you want the spine longer — the ninth row, costed

Insert one row and the spine becomes **V V T V T V V V T**, 6 visual of 9
(66.7%, comfortably over the floor), adjacency intact:

| Insert | Where | Kind | Words | What it buys |
|---|---|---|---|---|
| new row 8 | after `data-readout`, before `paradox` | `number-sense` (second) | ~95 | 7,473 objects catalogued in one year as a felt figure, with "more than twenty a day" as its `equals` (7,473 ÷ 365 = 20.5, a derivation). It also raises the visual share from 62.5% to 66.7%, which is the only real argument for it. |

New total, counted the way the gate counts: **~1,138**, which is **38 over the
ceiling**, because the new row brings its own eyebrow, title, caption and source
line. So the variant is not free: taking it means also taking 40 words out of
row 7's six tile notes (§8g, the designated slack), which lands it at ~1,098.
Its other cost is two `number-sense` sections in one issue. My recommendation is
the eight-row spine as composed; this exists so you can take it in one edit
rather than send the storyboard back.

### 8g. The designated slack

If a row overruns, the order of payment is:

1. **Row 5's quote is already ellipsed** and carries 16 words of optional
   spend in the other direction. Budgeted at 28 words. Restoring the full
   44-word ESA sentence (the middle clause about fragmentation events adding
   debris faster than re-entry removes it) costs 16 and the budget can afford
   it. **This is the first thing to buy, not the first thing to cut** — it is
   the best asset in the record.
2. **Row 7's six tile notes pay first** (≤ 10 words → ≤ 7 saves 18).
3. **Then row 2's five event notes** (≤ 11 → ≤ 8 saves 15).

Nothing pays out of row 1, which is protecting the 80-word floor, or out of the
four annotations, which are the issue's findings.

### 8h. Five things the drafter must not do

1. **Do not reach for "It is not X. It is Y." anywhere.** The issue's one
   reversal is spent in the hook (§4). The published issue spends it in the
   hook, the opening prose title and the closing paragraph, three times.
2. **Do not re-type a number.** Every figure in rows 2, 4, 6 and 7 is copied
   from `src/content/issues/2026-04-24-kessler-cascade/index.mdx`, including the
   "+" on "1,500+" and "300,000+", the "~" on "~2,900" and "~10", the en-dash in
   "50–100+ yrs" wherever it survives, and the comma placement on "10,074" and
   "7,473".
3. **Do not put a citation inside a sentence.** "Long March 6A", "DISH Network"
   and "EchoStar-7" all sit inside `data-readout` tile notes today. All three
   come out and the section `source` carries them (rule 9, tell 9).
4. **No em-dash in any prose field, and no semicolons.** The published file
   carries em-dashes in the primer, the opening prose lead, the timeline notes
   and the closing paragraph, and semicolons in the `paradox` details and the
   `orbital-shells` intro. Every one of them becomes a full stop.
5. **Do not tie the weather satellites to the Indian monsoon** (§5). It is the
   obvious Indian hook here and it is wrong.
