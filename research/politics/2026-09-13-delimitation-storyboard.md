# Storyboard: Delimitation — the map inside the women's bill

- **Category:** politics
- **Dossier:** none — this is a Phase 4 **rewrite** of a published issue that
  predates the pipeline. The factual record is
  `src/content/issues/2026-04-24-delimitation/index.mdx` and its `sources[]`
  block (src-01 … src-10). Every fact below is already in that file; no claim,
  number, name or source is added.
- **Composed:** 2026-09-13
- **Composer:** composer-agent
- **Status:** draft            ← draft | approved | hold  (the gate; see below)

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
>
> **Rewrite rules in force** (REGISTER-PLAN §8.1): the slug
> `2026-04-24-delimitation` and all ten `sources[]` entries are kept, so the URL
> does not change and the verifier's trace still holds. §8 below lists which
> component `data` carries over verbatim and which sections are cut, merged or
> re-kinded.

---

## 1. The argument in one line

A bill sold as women's reservation would also have ended the 50-year seat
freeze, moving Lok Sabha power from the south to the north. It lost by 54.

## 2. The hero

**`seat-chart`** (G6 · composition — seat counts per state with a change
column), at `layout: split` — the only section allowed it.

It carries the argument because the argument *is* the change column. Everything
before it sets up a question the chart answers in one read: if seats follow
population, who moves? The eight rows it renders are already published and
already verified — Uttar Pradesh 80 (+11), Bihar 40 (+10), Rajasthan 25 (+6),
Madhya Pradesh 29 (+4), Tamil Nadu 39 (−8), Kerala 20 (−8), Andhra Pradesh 25
(−8), Karnataka 28 (−2), on the 543-seat scenario, per Vaishnav & Hintson,
Carnegie Endowment 2019 (src-05). Its built-in quote slot carries Yogendra
Yadav verbatim, so the issue needs no second `quote` section for it.

**Not the hero, and why:** `vote-result` is the strongest *drawn* graphic in
the issue and is hero-capable — but it carries the outcome, not the argument.
The bill's defeat is what happened; the redistribution is what the issue is
about. `vote-result` is the resolution, placed at section 8.

## 3. The beats

One row per thing the reader must get, in reading order. 6–9 rows. The first
row after the head is a graphic or a `data-readout`, never prose. No two
text-only rows adjacent. At least six in ten rows visual. ≥ 1 kind from outside
the six workhorses (prose, data-readout, timeline, paradox, quote, comparison).

*For this rewrite the last column cites the published issue's own section and
`sources[]` id in place of a dossier §4 row.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Published row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | One MP in UP speaks for 30 lakh people. One in Tamil Nadu, 18 lakh. | G3 · one number made physical | `number-sense` **[new]** | — | **72** · no intro · label ≤ 8 w · 2 `equals` ≤ 14 w each + `note` ≤ 12 w each · `note` ≤ 18 w · caption ≤ 20 w | The number *is* the concrete thing; the `equals` column does the felt comparison (12 lakh more people per seat; about six-tenths of an MP per vote) | omit — `EXPLAIN['number-sense'].what` fits | `bill-breakdown` payload-03 bullets + `paradox` detail 1 · src-01, src-05 |
| 2 | You heard "women's reservation". The same bill raised the house to 850 and unfroze the map. | G2 · belief vs data | `you-think` **[new]** | — | **90** · no intro · `think` ≤ 22 w · `actually.value` "543 → 850" · `actually.text` ≤ 26 w · `note` ≤ 14 w · caption ≤ 20 w | The poster vs what the poster was stapled to | omit — default fits | `bill-breakdown` cards 01 + 02 · src-01 |
| 3 | The map has not moved since 1976 — and the 2023 women's Act switched itself off until it did. | G4 · dated sequence | `timeline` **[carried, 7 → 6 events]** | — | **150** · intro ≤ 24 w · 6 events (date + label ≤ 6 w; a `note` ≤ 12 w on four of six only) · **1 annotation** ≤ 12 w · no caption | — | omit — default fits | `timeline` events 1–6 · src-01, src-10 |
| 4 | Three different changes, one vote. You could not say yes to one and no to another. | G6 · parts of a whole | `bill-breakdown` **[carried, bullets cut]** | — | **110** · intro ≤ 24 w · 3 cards (label ≤ 3 w · title ≤ 8 w · body ≤ 16 w) · no bullets | The stapling itself: one ballot for three things | omit — default fits | `bill-breakdown` cards 01–03 · src-01 |
| 5 | Seats by head-count is a house where votes at the dinner table go by number of children. | G1 · narrative (text-only) | `analogy` — **`pairs[]` form [re-kinded]** | — | **95** · no intro · `headline` ≤ 12 w · 3 pairs (`this` ≤ 9 w · `that` ≤ 11 w) · `punchline` ≤ 20 w | The joint family, kept — the moral scoring dropped (see §8) | none (narrative kind) | `analogy` (legacy `brothers[]`) · src-05 |
| 6 | UP gains 11 seats and Bihar 10; Tamil Nadu, Kerala and Andhra Pradesh lose 8 each. | G6 · composition + change | `seat-chart` **[carried verbatim]** | **HERO** · `layout: split` | **135** · intro ≤ 30 w · subtitle ≤ 6 w · 8 row names · built-in quote 17 w + attribution · caption ≤ 22 w · **authored `plain`** ≤ 24 w | — | "Rows of states with today's seat count on the left; the change column is the whole argument." | `seat-chart` all 8 rows + quote · src-05 |
| 7 | Both sides are right. Equal votes is a principle; so is not charging the south for doing what was asked. | G2 · two facts in tension | `paradox` **[carried, details halved]** | — | **95** · intro ≤ 18 w · 2 statements ≤ 5 w each · 2 `detail` ≤ 28 w each (published: 48 and 44) | — | omit — default fits | `paradox` both sides · src-05, src-09 |
| 8 | 298 for, 230 against, 352 needed. It fell 54 short. | G3 · one count against a threshold | `vote-result` **[carried verbatim]** | — | **90** · intro ≤ 26 w · label ≤ 6 w · stamp · `followup` ≤ 20 w · caption ≤ 18 w | — | omit — default fits ("every dot is one vote…") | `vote-result` all values · src-04 |
| 9 | He said he did not want the credit. The fight was never about credit. | G1 · narrative (text-only) | `quote` **[text carried, intro cut]** | — | **95** · intro ≤ 20 w · quote ≤ 34 w (ellipsed at the head) · attribution ≤ 10 w · `followup` ≤ 24 w | — | none (narrative kind) | `quote` text + attribution; `timeline` event 7 folded in · src-03 |

**Head:** 75 words (title 8 · dek 9 · hook 24 · primer 34).
**Total budgeted: 1,007 reader-facing words** against the 1,100 ceiling —
93 words of headroom for the drafter. (Published today: 907 words in 41 blocks.
This spine is ~31 blocks and zero how-to-read panels.)

**Words before the first graphic: 75** (title + dek + hook + primer + a section
1 that carries *no* intro). Ceiling 80. Published today: 137. The first intro is
deliberately empty — the eyebrow, the title and the numeral carry it.

**Floors check.** Visual 6 of 9 (67%, floor 60%) — rows 1, 2, 3, 4, 6, 8.
Text-only 3 (rows 5, 7, 9), never adjacent: the spine alternates V V V V **T**
V **T** V **T**. First section after the head is G3, the `data-readout` group.
`prose` sections: **0** (ceiling 3). `paradox`: **1** (ceiling 1). Kinds from
outside the six workhorses: **6** — `number-sense`, `you-think`,
`bill-breakdown`, `analogy`, `seat-chart`, `vote-result` (floor 1, or 2 where
the data supports it). `timeline` at 6 events (ceiling 6), notes ≤ 12 words
(ceiling 20). Loud sections: **0** (ceiling 3); no WebGL, no `bleed`; one
`layout: split`, on the hero, as CANON §2 requires. Sections: 9 (CANON §3 range
6–12). Text blocks per section besides the title: ≤ 3 everywhere — rows 8 and 9
sit exactly at 3 and must not gain a fourth.

**How-to-read panels: none authored, anywhere.** No kind in this spine is in
`NEEDS_HOW` (no instruments, no WebGL, no counter-intuitive form), so under
RG-19 no panel renders. That is seven blocks the published issue carries today
and this one will not.

**`plain` lines: one authored, on the hero.** Every other row takes the
`EXPLAIN[kind].what` default, which already describes the form correctly. The
source still renders on every section as the second line of that paragraph.

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** `timeline` is
the only kind in this spine with the slot. One required, one optional:

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 3 | `"Sept 2023"` | **"The women's Act switched itself off until a new census"** (10 w) | The hinge. The 2023 Act's own clause is what made a 2026 delimitation bill the only route to women's seats — the whole Trojan-horse mechanism, on the mark that carries it. |
| 3 | `"1976"` *(optional)* | "Seats frozen at 543. Still 543, fifty years on." (9 w) | Keeps the freeze visible without a note. Drop it if two callouts crowd the spine. |

`seat-chart` and `vote-result` are **not** in the eight annotation-enabled
kinds, so their finding rides the section title and the caption instead.

**Rhetorical jobs (3 of the eight, `_voice-core.md` §7).** INVESTIGATION opens
(rows 1 and 3: look at this number, look at these dates) · CONVERSATIONAL
EXPLAINER carries the middle (rows 2, 4, 5, 6 — over half the sections, as
required) · CALM-STRUCTURAL closes (rows 7, 8, 9). **Zero SATIRICAL EXPOSURE**
— the contract sets it to 0 on the politics desk, and the published `quote`
section is currently written in it (see §8). At most one LYRICAL paragraph:
spend it on row 9's `followup` or not at all.

## 4. The head

- **Title (states the finding, ≤ 8 words):** **"The women's bill carried a new map inside"** (8 words)
  - Retires "The Trojan Horse in Parliament" — which names the subject, borrows a
    framing attributed to a named politician (src-06), and is the ninth of ten
    published titles in a retired construction.
  - Alternate for the operator: *"Inside the women's bill: a new political map"* (8).
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"Your MP speaks for 30 lakh people. A Tamil Nadu MP speaks for 18 lakh. The bill that tried to fix that gap lost."** (24 words)
  - This is `_voice-core.md` §9's own worked rewrite of this issue's hook,
    trimmed from 27 words to 24. Published hook: 24 words, no number, no "you".
- **Dek (≤ 14 words; carries the Hindi if the title has none):**
  **"It lost by 54 votes. The 50-year freeze holds."** (9 words)
  - No Hindi: politics carries the fewest Hindi words of any desk (§2), and
    every candidate word here sits next to a number. L1 throughout the head.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"Parliament has had the same 543 seats since 1976. A bill to redraw them, wrapped inside women's reservation, lost on 17 April. Here is what was inside it, and which states would have gained."**
  (34 words, ~200 characters — inside the 80–420 bound. Published primer: 60
  words, 397 characters, at the ceiling.)

## 5. The Indian ground

This issue is Indian throughout and needs no importing. What places it, each
with the published row behind it:

| Ground | Where it lands | Published row |
|---|---|---|
| **lakh is the native unit** — 30 lakh, 18 lakh, 12 lakh | rows 1, 7 | `bill-breakdown` payload-03 bullets; `paradox` detail 1 |
| **Eight states the reader lives in**, each with a number against its name | row 6 (hero) | `seat-chart` rows, src-05 |
| **The joint family and the dinner table** — the household the reader owns | row 5 | `analogy`, kept as the device |
| **The Lok Sabha, a division vote, a two-thirds majority** — the institution | rows 3, 8 | `timeline`, `vote-result`, src-04 |
| **A Hindi phrase, verbatim, in a title** — "Credit nahi chahiye" | row 9 | `quote` title + `timeline` event 7, src-03 |

**No ₹ conversion is needed: the issue carries no dollar figure.** Zero `$`
across all seven published sections. The ₹-for-every-$ rule has nothing to
convert here; the lakh already does the work the rule asks for.

**Derivations used** (arithmetic on the issue's own numbers — no new fact, no
new source, but listed so the operator can rule):

1. **"12 lakh more people per seat"** = 30 lakh − 18 lakh. Row 1 `equals[0].note`.
2. **"about six-tenths of an MP"** = 18 ÷ 30. Row 1 `equals[1]`. This is the
   `paradox`'s own claim — "a North Indian vote literally counts less" (src-05)
   — expressed as the ratio rather than as an adjective.
3. **"fifty years"** for 1976 → 2026, already the issue's own phrase
   ("the 50-year freeze", `bill-breakdown` payload-03).

**Not used, deliberately.** No "the population of Delhi", no city-sized
comparison for 30 lakh, no "one IPL season". Every one of them would add a fact
the issue's `sources[]` does not carry, and a composer does not add sources. If
the operator wants one in `number-sense`, it needs a source first — flag it
back and the drafter can take it.

## 6. The three questions

What the issue must teach. Written from the published issue, not from any
draft; the reader panel answers them from the draft alone. If the draft cannot
teach these, the draft is wrong.

1. **Q:** The bill was called a women's reservation bill. What else was inside it?
   · **A:** Two more changes. It raised the ceiling on Lok Sabha seats from 550
   to 850, and it ended the 50-year freeze so every constituency could be
   redrawn by population on a simple majority.
   · rows 2 and 4 · `bill-breakdown` cards 01–03, src-01.
2. **Q:** Which states would have gained seats, which would have lost, and why?
   · **A:** Uttar Pradesh +11 and Bihar +10, with Rajasthan and Madhya Pradesh
   also up; Tamil Nadu, Kerala and Andhra Pradesh −8 each. Seats would follow
   population, and the south's population grew more slowly after it brought its
   birth rate down.
   · row 6 (the hero) · `seat-chart` rows + `paradox` detail 2, src-05, src-09.
3. **Q:** How close did the bill come, and what did it need?
   · **A:** 298 voted for and 230 against, out of 528 present. A constitutional
   amendment needs two-thirds of those present and voting — 352 — so it fell 54
   short.
   · row 8 · `vote-result`, src-04.

Every one is answerable from a drawn graphic, not from a paragraph. That is the
test of whether the spine works.

## 7. Names

Eight, down from the 24 capitalised names the published issue carries. Ceiling
is 12; the four spare slots should stay spare.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **Narendra Modi** | the Prime Minister, in his address the day after the defeat | row 9 attribution |
| **Indira Gandhi** | the Prime Minister whose government froze the seat map in 1976 | row 3, 42nd Amendment note |
| **Atal Bihari Vajpayee** | the Prime Minister whose government extended that freeze to 2026 | row 3, 2001 note |
| **Yogendra Yadav** | the psephologist who read the gainers and losers off the projected map | row 6, built-in quote |
| **Lok Sabha** | the elected house of Parliament, and the 543 seats in question | rows 3, 4, 8 |
| **Nari Shakti Vandan Adhiniyam** | the 2023 women's reservation Act — named once, glossed in the same breath | row 3 label |
| **Constitution (131st Amendment) Bill** | the bill that lost on 17 April | rows 4, 8 |
| **BJP** | inside the Yadav quote, verbatim — not introduced by the issue's own prose | row 6 quote |

**Described, not named** (all currently named in the published issue): Amit
Shah → "the government's own 50 percent expansion model" (the 816-seat figure
survives, the attribution does not); the "Trojan horse" framing and the
politician it is attributed to (src-06) → dropped with the title; "Article 82"
→ "the constitutional clause that freezes the map"; the 84th Amendment → "the
freeze extended to 2026". States are places, not names — the eight on the hero
do not spend from the budget.

**Source lines only, never inside a sentence** (rule 9): PRS Legislative
Research · Vaishnav & Hintson, Carnegie Endowment · SCC Online and the Lok
Sabha division records · NFHS-5 · Press Information Bureau · Deccan Herald ·
The Wire.

## 8. Composer notes

### 8a. What carries over verbatim

Component `data` is expensive and already verified, so the rewrite reuses it
wherever the register allows. The verifier's trace holds because no number
changes.

| Published section | Verdict | Detail |
|---|---|---|
| `seat-chart` | **verbatim** | All 8 `rows[]` (name/region/current/change), `subtitle`, and the Yadav `quote` + attribution, unchanged. One move: `data.source` goes up to a section-level `source` (since 2026-09-04 the source renders once, from `core/Section.astro`). Becomes the hero at `layout: split`. |
| `vote-result` | **verbatim numbers** | `for` 298, `against` 230, `required` 352, `present` 528, `shortfall` 54, `label`, `stamp: Defeated` all unchanged. Only `followup` is rewritten (see 8b). |
| `quote` | **verbatim text** | The quoted words and the attribution are unchanged, optionally ellipsed at the head to drop "This was not about failure or taking credit." `intro` and `eyebrow` are cut (see 8b). |
| `timeline` | **6 of 7 events** | Dates unchanged. Labels and notes shortened to the new caps; event 7 (18 Apr 2026, the address) folds into row 9 so the quote section carries it once instead of twice. Gains `annotations[]`. |
| `bill-breakdown` | **facts verbatim, prose halved** | 550 → 850, 816, the 2011 Census, 2029, "simple majority" all survive. The three `bullets` on card 03 are cut as text and re-drawn: the 30 lakh / 18 lakh pair becomes row 1, and "the Hindi heartland gains relative weight; the South loses it" is precisely what the hero draws. |
| `paradox` | **one statement verbatim** | "One person, one vote, one value." kept. Both `detail` blocks halved (48 and 44 words → ≤ 28 each) because row 1 now carries the 30/18 numbers they were spending their length on. |
| `analogy` | **device kept, shape changed** | See 8c. |
| `sources[]` | **all ten, unchanged** | Slug `2026-04-24-delimitation` unchanged; the URL does not move. |

### 8b. What is cut, and why

1. **The `quote` section's intro is cut entirely** — "the Prime Minister —
   whose face appeared on vaccine certificates, ration bags, and airport
   arrival screens for a decade". Two reasons, and the first is not stylistic:
   **none of those three claims is backed by any entry in the issue's own
   `sources[]`.** Second, it is SATIRICAL EXPOSURE, which `_voice-core.md` §7
   sets to **0 on the politics desk**. The eyebrow "THE SARCASM, EARNED" goes
   with it. Replaced by a flat CALM-STRUCTURAL intro that says when he said it
   and to whom.
2. **The `quote` `followup` loses its two rhetorical questions.** Rule 6 allows
   one question per section and only as an opener. The reversal it is reaching
   for — the fight was about the map, not the credit — **is** this issue's
   argument, so it may be written once as the binary reframe the tell catalog
   rations to one per issue. **Spend it here and nowhere earlier.** The drafter
   must not reach for "It is not X, it is Y" in rows 2 or 4.
3. **"sine die" is glossed away** in the `vote-result` followup: "the Lok Sabha
   shut for the session the same day". Term of art with no reader payoff.
4. **"Article 82" is described, not cited.** Precision is lost; plainness is
   gained. If the operator wants the article number kept, the cheapest home is
   a `jargon-buster` — but adding one makes a fourth text-only section and
   there is no adjacency-safe slot for it in a 9-row spine. Recommend
   describing it.
5. **Amit Shah's name goes, the 816-seat figure stays.** A name used once with
   no return is the tell; the projection is the fact.
6. **`bill-breakdown` stays a `bill-breakdown`.** It is the one kind whose DATA
   shape *is* this data — provisions as cards, one flagged as the payload — and
   `three-steps` would be wrong twice over (these are three simultaneous
   payloads, not an ordered mechanism, and it is a narrative kind, which would
   put a fourth text-only section in the spine). The measured complaint that it
   is "text-composed" is answered by halving it: three bodies at ≤ 16 words,
   no bullets, the numbers re-drawn in rows 1 and 6. **If the operator disagrees,
   the alternative is a 3-column `comparison` (what it says / what it does /
   who it moves) — but `comparison` is specified for peer entities, and these
   are three parts of one thing.**

### 8c. The ruling I made, and the two I did not

**`analogy`: `pairs[]`, not the legacy `brothers[]` — recommended, reversible.**
The catalog says the legacy shape still renders and wins when present, so this
is a choice, not a migration. My reason is not the shape; it is the copy. The
published `brothers[]` scores its five states morally — "The Disciplined One",
"Didn't listen to family planning", "More mouths, more votes now" — and the
punchline hands the house to them. On the politics desk the contract asks for
restraint and forbids the editorial verb; this is an editorial verb per row.
The `kids: "8 kids"` values are also illustrative, not sourced, which the new
register does not want sitting next to real numbers. The `pairs[]` form keeps
the joint family — genuinely Indian ground the reader owns — and drops the
scoring:

```
headline: Votes in the house, decided by how many children you have.
pairs:
  - this: A state that brought its birth rate down
    that: A brother who kept his household small
  - this: Seats handed out by head-count
    that: Votes at the dinner table by number of children
  - this: The freeze, 1976 to 2026
    that: Everyone keeping the old count for fifty years
punchline: Ending the freeze is the family recounting the children — and the votes — on the same day.
```

**For the operator — three rulings before the draft:**

1. **`act-break`.** RG-06 has not ruled whether act breaks are required at each
   act turn or the act rule is dropped. I composed **without them**. If they
   become required, this spine admits exactly **one**, before row 4 (`timeline`
   V → `act-break` T → `bill-breakdown` V is the only adjacency-safe slot, and
   it is a real pivot: from how the map froze to what the bill did). A second
   act break cannot be placed — with three text-only sections in nine, every
   other boundary would put two text blocks side by side. Note also that two
   acts of 3 and 6 breaks CANON §3's "an act is 2–4 sections". My reading: for
   a 9-row spine with this text/visual mix, the act rule and the adjacency floor
   are in direct conflict, and the adjacency floor is the measured one.
2. **The hook's "you".** "Your MP speaks for 30 lakh people" reads as
   UP-default, and P4 on the reader panel (Karthik, Chennai) is explicitly not
   that reader. I kept it because it is `_voice-core.md` §9's own signed worked
   example for this issue and rule 12 asks for a "you". Say the word and the
   drafter opens "One MP in Uttar Pradesh speaks for 30 lakh people" and drops
   the second person.
3. **"Credit nahi chahiye" as a section title.** The published issue presents
   it as said (both the `timeline` label and the section title), sourced to
   src-03, but the quoted text itself is in English — so the phrase's verbatim
   status is asserted by the issue, not demonstrated by the quote it carries.
   I kept it, with one change the contract forces: **set roman, not italic**
   (tell 15). If you want it gone, the title becomes "He said he did not want
   the credit."

### 8d. Kinds I wanted and could not use

- **`power-matrix`, `vote-flow`, `margin-ladder`, `chamber`, `gerrymander-lens`.**
  All the right shape family for this story and none of them available: the
  issue carries no per-party breakdown of the 298 / 230 split, no bloc-by-bloc
  flow, no constituency-level margins, and no district-plan geometry. The
  published `vote-result` gives four totals and a threshold, which is exactly
  `vote-result`'s DATA and nothing more. A rewrite may not add a source, so
  none of these is available.
- **`region-map`.** The obvious instinct for a north/south redistribution — and
  wrong here. The `seat-chart`'s `region` field is a two-value label
  (`north` / `south`), not a per-state shading value, and the change column is
  what argues. A map would show *where* and hide *how much*.
- **`jargon-buster`.** There are three terms of art in this issue (delimitation,
  Article 82, a two-thirds majority of members present and voting), which is
  its brief exactly. No adjacency-safe slot exists in a 9-row spine with three
  text-only sections. If the operator wants it, drop row 5 (`analogy`) and put
  `jargon-buster` in its place — the same slot, the same text budget.
- **`number-sense` a second time**, on 54 votes. Tempting and cheap, but one
  `number-sense` per issue is the honest ration, and the `vote-result` already
  renders 54 against its threshold as a drawn graphic.

### 8e. One floor call worth stating plainly

The floor says the first section after the head is "a graphic or a
`data-readout`". Row 1 is **`number-sense`**, which is neither of those words —
it is a VizCard kind in **G3, the same shape group as `data-readout`**, and it
renders a large numeral with a drawn equals column beside it. I read that as
satisfying the floor's stated intent ("the number leads; the first screen shows
something") and the plan's own note for this issue ("`number-sense` for 30 lakh
vs 18 lakh per MP"). If you read it the other way, swap in a four-tile
`data-readout` — 543 seats · frozen since 1976 · 30 lakh per UP MP · 54 votes
short — and move `number-sense` to row 2. Every number in that alternative is
already published.

### 8f. Sourcing residuals the rewrite must fix

Three published sections carry no `source` at all, against CANON §7's "no
source, no section":

- `seat-chart` — has `data.source` but no section-level `source`. Promote it.
- `analogy` — none. It restates the hero's mechanism; give it src-05.
- `quote` — none. Give it src-03, the address it quotes.

src-07 (the 850-seat projection) and src-08 (the March 2025 all-party meeting)
back no section in the current spine. Keep both in `sources[]` — the slug and
the bibliography stay whole — but neither needs a `sourceRefs[]` entry unless
the drafter uses them.
