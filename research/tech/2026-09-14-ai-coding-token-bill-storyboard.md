# Storyboard: Uber's year of AI money lasted four months

- **Category:** tech
- **Dossier:** `research/tech/2026-06-04-ai-coding-token-bill-dossier.md`
  (`Status: ready-for-draft`) — this is a Phase 6 **rewrite** of a published
  issue, so the factual record is three files, not one: the dossier, the
  published `src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx` with
  its `sources[]` block (src-01 … src-07), and
  `research/tech/2026-06-04-ai-coding-token-bill-verification.md`
  (**NEEDS REVISION**, both required fixes since applied — see §8b). Every fact
  below is already in one of those three. No claim, number, name or source is
  added.
- **Composed:** 2026-09-14
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-15; rulings settled in §8i

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
> **REWRITE.** The five measured defects this rewrite exists to fix
> (REGISTER-PLAN §8.1, measured 2026-09-14):
> 1. **748 reader words before the first graphic**, against a ceiling of 80.
>    **The worst number in the entire backlist**, and it is structural, not
>    stylistic: the issue opens `paradox` → `prose`, both in `TEXT_ONLY`, so
>    the gate's counter runs through the head, through all six of the paradox's
>    data strings, and through a three-paragraph prose section before it
>    reaches `scaling-plot`. No amount of editing the head fixes this. The
>    first section has to become a graphic.
> 2. **1,741 reader-facing words in 7 sections**, against a ≤ 1,100 ceiling.
> 3. **4 of 7 visual (57%)**, against a 60% floor. Two `prose` sections plus a
>    `paradox` is three text-only of seven, and `paradox` counts as text-only
>    in `scripts/check-prose.mjs`.
> 4. **21 distinct names**, against a ration of 12. The model-version ladder
>    (Haiku, Opus, Grok, Gemini, Flash-Lite, the GPT numbers) is where the fat
>    is, and the two plan names in the `$200` figure add two more.
> 5. **The issue closes on prose**, and that closer's title spends the
>    once-per-issue binary reframe on a restatement ("The cost didn't fall. It
>    *moved*.").
>
> **The verification verdict is a constraint, not background.** The report is
> NEEDS REVISION with two required fixes, both of which the published file
> shows as applied (the Goldman sentence and src-08 were cut rather than
> flagged, and the double em-dash in the paradox is gone). Three of its
> findings are carried forward as guardrails in §8b, and one of its passes is
> re-opened by the new contract in §8e.
>
> **Rewrite rules in force** (REGISTER-PLAN §8.1): the slug
> `2026-06-04-ai-coding-token-bill` and all seven `sources[]` entries are kept,
> so the URL does not change and the verifier's trace still holds. `id`,
> `topic`, `publishedAt: 2026-06-04`, `status: published` and `tags` are
> unchanged; `readTimeMinutes` drops 7 → 4. §8a lists which component `data`
> carries over verbatim and which sections are cut, merged or re-kinded.

---

## 1. The argument in one line

The price of a token keeps falling. One job now eats a thousand times more
tokens than a question did. Multiply the two and the bill goes up.

## 2. The hero

**`benchmark-chart`** (G5 · ranked bars on one metric, one highlighted), at
`layout: wide`.

**What it draws:** the token bill of **one real coding task** — the GPT-5 Codex
run in dossier §4 and already quoted in the published `scaling-plot` intro —
broken into its three measured parts and sorted longest first.

| bar | value | source |
|---|---|---|
| cached tokens | **1,176,320** | dossier §4 (tokens-per-task), src-04 |
| input tokens sent fresh | **169,818** | same |
| output tokens written back | **17,112** | same |

It carries the argument because the argument is a multiplication, and this is
the only fully-sourced picture of the multiplier the record contains. The
reader has just been told that one task burned over a million tokens. The
question that follows is *how*, and the bars answer it in one look: the
overwhelming majority of that task was context the agent re-sent, and the code
it actually wrote back was 17,112 tokens, a rounding error at the bottom of
the chart. That is the mechanism Willison describes in src-06 (an agent
"maintain[s] state by replaying entire conversations with each new prompt"),
drawn instead of asserted.

**No fact is added by this.** All three values sit on the published page today,
inside the `scaling-plot`'s `intro` ("169,818 input, 17,112 output, and
1,176,320 cached tokens"), and their sum was arithmetic-checked by the
verifier. The rewrite moves them out of a sentence and onto a chart.

**`layout: split` is declined.** The hero is the only row permitted it
(CANON §2) and the catalog calls `benchmark-chart` hero-capable, but three
horizontal bars whose labels are multi-word ("cached tokens, re-sent each
step") lose their labels at half measure. `wide` gives the bars their run and
keeps the issue at **zero loud sections**.

**Not the hero, and why: `scaling-plot`.** It was the published issue's
signature chart and it is the tech desk's own kind, but four of its five points
are invented. The published file labels each one with an asterisk and says so
in the caption, the source line and the intro, and the verifier passed that
treatment — but the cockroach rewrite settled the same question the other way
on 2026-09-14, and an issue should not rest its hero on the one chart where
80% of the marks are illustrative. It survives as a supporting row, trimmed to
the two points that carry the claim (§8c, ruling 1).

**Not the hero, and why: `carbon-gauge`.** The perfect hero for this issue is a
gauge of Uber's 2026 AI budget, used against remaining, with the needle pinned
at the end of April. It is blocked by exactly one number that no source
discloses. See §8d.

## 3. The beats

One row per thing the reader must get, in reading order. 6–9 rows. The first
row after the head is a graphic or a `data-readout`, never prose. No two
text-only rows adjacent. At least six in ten rows visual. ≥ 1 kind from outside
the six workhorses (prose, data-readout, timeline, paradox, quote, comparison).

*For this rewrite the last column cites the published issue's own section and
`sources[]` id, or the dossier §4 row, in place of a fresh dossier reference.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Published row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | AI keeps getting cheaper, so the bill should be falling. Uber's whole year of AI money was gone by April. | G2 · belief vs data | `you-think` **[new]** | — | **95** · eyebrow ≤ 2 w · title ≤ 5 w · **no intro** · `think.text` ≤ 24 w · `actually.value` "4" · `actually.unit` "months" · `actually.text` ≤ 26 w · `note` ≤ 18 w · `caption` ≤ 16 w | The reader's own arithmetic: a unit price that halves beside a unit count that goes up a hundredfold | omit — `EXPLAIN['you-think'].what` fits | `paradox` sides 1 and 2; `data-readout` tiles 1 and 2 · src-01, src-02 |
| 2 | Token, price per token, cost per task. Three words that sound the same. Only the last one is the bill. | G1 · narrative (text-only) | `jargon-buster` **[new]** | — | **100** · eyebrow ≤ 3 w · title ≤ 6 w · intro ≤ 16 w · 3 terms (`term` ≤ 3 w · `meaning` ≤ 22 w) · **no `hindi` field** (§5) | **The electricity bill.** Two halves: the rate per unit, and the units you actually pulled. The rate card is the first half only | none (narrative kind) | `paradox` side 1 detail · src-04 |
| 3 | A chat reply is a few thousand tokens. One coding task, measured, was over a million. | G10 · x/y relationship | `scaling-plot` **[carried, 5 → 2 points, gains `annotations[]`]** | — | **125** · eyebrow ≤ 3 w · title ≤ 6 w · intro ≤ 28 w · **authored `howToRead`** ≤ 40 w · axis labels ≤ 7 w · 2 point labels ≤ 9 w · `caption` ≤ 14 w · `source` ≤ 16 w · **1 annotation** ≤ 12 w | none — the height of the upper dot *is* the concrete thing | **authored** (see §8f) | `scaling-plot`, points 1 and 5 · src-04 |
| 4 | Nobody raised a price. In November 2025 the software stopped answering questions and started doing jobs, and a job is a loop. | G1 · narrative (text-only) | `three-steps` **[new]** | — | **102** · eyebrow ≤ 3 w · title ≤ 6 w · intro ≤ 18 w · 3 steps (`title` ≤ 5 w · `text` ≤ 22 w) | The worked example is the loop itself: read the code, try, read the failure, try again, re-sending everything each time | none (narrative kind) | `prose` CROSSOVER, all three paragraphs · src-02, src-03, src-06 |
| 5 | Of those 1.36 million tokens, almost all were the agent re-reading. 17,112 were the code it wrote. | G5 · ranked bars, one metric | `benchmark-chart` **[carried as a kind, repointed to the task's token split]** | **HERO** · `layout: wide` | **116** · eyebrow ≤ 4 w · title ≤ 6 w · intro ≤ 28 w · `unit` ≤ 5 w · 3 bar labels ≤ 9 w · `caption` ≤ 16 w · **authored `plain`** ≤ 20 w · **1 annotation** ≤ 12 w | none — the length of the top bar against the bottom one is the concrete thing | **authored** (see §8f) | `scaling-plot` intro (the three token counts); `prose` CROSSOVER ¶2 (the mechanism) · src-04, src-06 |
| 6 | The tools got good, so billing switched to metered. Then the frontier price went up. Then the budget ran out. | G4 · dated sequence | `timeline` **[carried, 8 → 6 events, gains `annotations[]`]** | — | **145** · eyebrow ≤ 4 w · title ≤ 6 w · intro ≤ 22 w · 6 events (`date` + `label` ≤ 7 w; a `note` ≤ 10 w on **three of six only**) · **2 annotations** ≤ 12 w | — | omit — default fits | `timeline` events 2, 3, 4, 6, 7, 8 · src-01, src-02, src-03 |
| 7 | $1,500 a month. Per engineer. Per tool. That is about ₹1.3 lakh, every month, for one person and one piece of software. | G3 · one number, felt | `number-sense` **[new]** | — | **118** · eyebrow ≤ 3 w · title ≤ 5 w · intro ≤ 20 w · `value` "$1,500" · `unit` "/month" · `label` ≤ 7 w · 2 `equals` (≤ 12 w each, one with a `note` ≤ 10 w) · `note` ≤ 16 w · `caption` ≤ 12 w · `source` ≤ 14 w (carries the ₹ rate and month) | **The rupee bracket and the pay packet.** One engineer, one tool, one month, against what that engineer is paid in a year | omit — `EXPLAIN['number-sense'].what` fits | `data-readout` tiles 1 and 3 · src-01 |
| 8 | The bill an individual never feels: $2,180 of tokens for a $200 subscription. And at the frontier the price is now rising. | G3 · headline numbers | `data-readout` **[carried, 6 → 4 tiles]** | — | **122** · eyebrow ≤ 3 w · title ≤ 5 w · intro ≤ 18 w · 4 tiles (`label` ≤ 8 w · `note` ≤ 11 w) · `caption` ≤ 6 w · `source` ≤ 12 w | "Two months of a flat subscription bought eleven months of tokens" is the shape; the tile notes carry it | omit — default fits | `data-readout` tiles 3, 4, 5, 6; `benchmark-chart` items · src-01, src-02, src-05 |
| 9 | Nobody raised a price. The work changed shape, and a business pays for work. | G1 · narrative (text-only) | `prose` **[carried, 3 paragraphs → 1, ≤ 75 words]** | — | **90** · eyebrow ≤ 4 w · title ≤ 5 w · one paragraph ≤ 75 w · **no `skimCaption`** (§8c) · `source` ≤ 6 w | The closing image is the two halves of the bill, returned to: a rate card is what one unit costs, an invoice is what you used | none (narrative kind) | `prose` closer ¶1 and ¶3 · src-02, src-07 |

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

**Head: 67 words** (title 8 · dek 10 · hook 21 · primer 28).
**Total budgeted: 1,080 reader-facing words** against the 1,100 ceiling —
**20 words of headroom**, which is thin. Row 9 is the **designated slack row**
(§8g). Published today: **1,741 words in 7 sections**; this spine is ~26
blocks across 9.

The per-row figures above already include every `eyebrow`, section `title`,
`caption`, `plain`, `howToRead` and `source` label, because `readerWords` in
`check-prose.mjs` sweeps all of them. A budget built from intros and notes
alone under-reads by roughly 15 words a section, which is 135 on this spine.

**Words before the first graphic: 74.** Ceiling 80. Published today: **748**.
The arithmetic, because this is the floor the issue fails worst —
`check-prose.mjs` counts `title + dek + hook + primer`, then adds section 1's
`eyebrow + title + intro`, and **stops there only because section 1 is
visual**. So: 8 + 10 + 21 + 28 = 67, plus row 1's eyebrow (≤ 2) and title
(≤ 5) = **74**.

Two things make that work, and both are load-bearing:

- **Row 1 carries no `intro`.** The eyebrow and the title are the intro. If the
  drafter adds one, the floor breaks immediately.
- **`you-think`'s `data` is free of this count.** The loop adds a section's
  data strings only when that section is in `TEXT_ONLY`, and it breaks after
  the first visual one. So `think.text`, `actually.text`, `note` and `caption`
  cost nothing against the 80. That is the whole reason the published 748
  becomes 74: the same opening argument, moved from a `paradox`'s six data
  strings into a component that counts as a graphic.

**Floors check.**

| Floor | This spine | Verdict |
|---|---|---|
| ≥ 6 in 10 sections visual | **6 of 9 = 67%** — rows 1, 3, 5, 6, 7, 8 | ✅ (floor 60%; published 57%) |
| Never two text-only adjacent | **V T V T V V V V T** — rows 2, 4, 9 are the only text-only ones | ✅ |
| First section a graphic | Row 1 is `you-think`, not in `TEXT_ONLY` | ✅ (published: `paradox`, which is) |
| ≤ 3 `prose` sections of ≤ 200 words | **1**, at ≤ 75 words | ✅ |
| ≤ 1 `paradox` | **0** (cut — §8c) | ✅ |
| ≤ 1,100 reader-facing words | **1,080** | ✅ (20 words of headroom) |
| ≤ 80 words before the first graphic | **74** | ✅ |
| ≤ 12 distinct names | **7 real names**, 8 expected heuristic hits (§7) | ✅ read §7 |
| ≥ 1 kind outside the six workhorses | **4** — `you-think`, `scaling-plot`, `benchmark-chart`, `number-sense` | ✅ |
| `timeline` ≤ 6 events, notes ≤ 20 words | 6 events, notes ≤ 10 words on three of six | ✅ |
| Annotations ≤ 12 words | 4 annotations, all ≤ 12 | ✅ |
| ≤ 3 loud sections; no two WebGL adjacent; ≤ 1 `bleed` per act | **0 loud** — no WebGL, no `bleed`, no `split`; one `wide` on the hero | ✅ |
| CANON §3 section count 6–12 | **9** | ✅ |

**The text-only count, spelled out.** `jargon-buster` and `three-steps` are in
`TEXT_ONLY` in `scripts/check-prose.mjs`, exactly like `prose`. They are
shorter and clearer than the ~430-word `prose` section they replace, but they
buy **no visual share at all**. This is why the spine has nine rows and three
text-only ones and not ten with four: a fourth text-only row takes it to 6 of
10 = 60%, which is the floor exactly and leaves no margin for an operator
edit. The visual count was fixed first; the plain-language kinds were spent
from what was left.

**Rhetorical jobs (3 of the eight, `_voice-core.md` §7).**

| Job | Rows | Note |
|---|---|---|
| CONVERSATIONAL EXPLAINER | 2, 4, 5, 7, 8 | **Five of nine — past the "at least half" floor.** The default job. |
| INVESTIGATION | 1, 3 | The anomaly as a graphic first. Row 1 is the whole issue in one card; row 3 is "look at the height of that dot". |
| CALM-STRUCTURAL | 6, 9 | The chronology with the connective written and the conclusion not; then the landing. |
| LYRICAL COMPRESSION | at most 1 paragraph | If spent at all, spend it on row 9's single paragraph. Nowhere else. |
| SATIRICAL EXPOSURE | **none** | The contract allows ≤ 1 off the politics desk, but there is no institutional contradiction here to expose. Uber budgeted against last year's arithmetic and corrected. Deadpanning that reads as sneering at a finance department. |
| DRY WIT | **one sentence, optional** | If used, row 8's `$2,180` tile note is the place. Never a whole section. |

**The one binary reframe.** Tells 2 and 19 ration the "it is not X, it is Y"
shape to **one per issue**. Spend it on **row 1's `you-think`**, where the
component's own two-panel form is the reframe and the reader needs it. The
drafter must not reach for it again in the title, the dek, the hook, row 2 or
row 9 — and specifically must not restore the published closer title "The cost
didn't fall. It *moved*."

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **"Uber's year of AI money lasted *four* months"** (8 words; set one accent
  word, `*four*`)
  - Retires **"The Bill Came Due in *April*"** on two counts: it names the
    event rather than the finding, and "April" means nothing to a reader who
    does not already know the story, which is exactly the failure rule 11 was
    written against. A reader who reads only the titles must get the argument.
  - "AI money" rather than "budget" is deliberate. A title travels alone in
    the contents list, and "Uber's budget lasted four months" read on its own
    says the company nearly went under.
  - Alternates for the operator: *"Cheaper tokens, and the bill still went up"*
    (8, but it spends the once-per-issue reversal on the title) · *"A year of
    AI money, gone by April"* (8, but it drops the institution).
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"You keep hearing AI is getting cheaper. Uber burned its whole 2026 AI budget in four months, and capped every engineer."** (21 words)
  - The "you" is the reader who has read the cheaper-AI headline. The numbers
    are four months and 2026, both from src-01. The twist is the second
    sentence. Published hook: **34 words**, no number a reader can feel, no
    "you", and it states the thesis before the reader has a reason to care.
- **Dek (≤ 14 words; carries the Hindi if the title has none):**
  **"The price per token fell. The tokens per task exploded."** (10 words)
  - Two parallel facts, not a "not X but Y" — the antithesis dek is tell 8 and
    the published one ("Cheaper is a per-unit word. The invoice is a per-task
    number.") is exactly that shape sitting beside a hook that already
    reverses.
  - **No Hindi here.** See §5 for where the issue's one Hindi word goes and
    why it is not in the dek.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"A token is the unit AI bills by. Its price keeps falling, but coding tools now burn millions of tokens per task. Here is where the money went."**
  (28 words, ~152 characters — inside the 80–420 bound.)
  - **Budget note:** the head must total ≤ 69 words for the 80-word floor to
    hold with row 1's chrome. At 28 the primer puts the head at 67 and the
    floor at 74. Published primer: 60 words, ~365 characters, and it glosses
    "token" in a subordinate clause the reader meets 700 words before the
    first graphic. Here the gloss is the first sentence and `jargon-buster`
    takes it properly in row 2.

## 5. The Indian ground

**This issue has no Indian fact in its record, and the composer does not add
one.** The subject is a US company, two US labs and a market priced in dollars.
Dossier §4 carries no Indian figure, no Indian institution and no Indian place,
and a rewrite adds no sources. So the Indian ground is built entirely from
things that need no new fact: the rupee brackets the contract asks for, the
units the reader counts in, and one everyday object the reader already owns.
Under the operator's 2026-09-14 ruling, an Indian habit counts as Indian
ground, and that is what carries this issue.

| Ground | Where it lands | Published / dossier row behind it |
|---|---|---|
| **The electricity bill.** Two halves: the rate per unit, and the units you actually pulled. The rate card is only the first half | row 2 intro and the "per-task cost" gloss; echoed in row 9 | none needed — a mechanism the reader owns, asserting nothing about any price |
| **₹ beside the cap** — "$1,500 a month (about ₹1.3 lakh)" | row 7 only | `data-readout` tile 1 · src-01 (see the currency table) |
| **lakh and crore as the units** — ₹1.3 lakh a month; about ₹2.9 crore a year for the comp figure, if ruling 5 goes in | row 7 | `data-readout` tiles 1 and 3 · src-01 |
| **One person, one tool, one month** as the frame for a wholesale number | rows 7, 8 | `data-readout` tile 1 note, verbatim: "Separate budgets per tool" · src-01 |
| **"Millions of tokens for one job"** rather than "an order of magnitude" | primer, rows 3, 5 | dossier §4 tokens-per-task · src-04 |

**Not used, deliberately.** No "the population of Mumbai", no IPL comparison,
no Indian salary comparison for the $1,500 cap or the $330,000 pay figure.
Every one of them would need a fact the issue's seven sources do not carry, and
a composer adds no sources. The temptation here is real and specific: the
sentence "that cap is more per month than most Indian engineers earn" writes
itself, is probably true, and **must not be written**, because nothing in the
record sources it.

### The currency split — which dollar figures are CURRENT and which are not

The plan's own note on this issue ("37 `$` figures and no ₹: rupee conversions
throughout") is **superseded**. `_voice-core.md` §3 rule 4 was rewritten by the
operator on **2026-09-14**: foreign currency stays primary, a CURRENT figure
gets a bracketed rupee equivalent with the rate and month on the section's
source line, and a HISTORICAL figure stays unconverted because converting it at
today's rate invents a number that never existed. So each figure has to be
classified, and there is no blanket answer.

**First, the structural point that shrinks the problem.** The published issue
carries roughly 23 dollar figures, most of them per-token rate cards stacked
inside the `paradox` and the `timeline`. This spine cuts the `paradox`, cuts
two timeline events, and carries **one** rate-card anchor instead of six. Nine
dollar figures survive, not 23.

| Figure | Row | CURRENT / HISTORICAL | Reasoning | ₹? |
|---|---|---|---|---|
| **$0.25 / $1.25 per million tokens** (Anthropic's cheapest 2023 model at launch) | 2 | **HISTORICAL** | A 2023 launch price for a model three generations superseded. This is the clearest historical figure in the issue and the rule's own example case. | **No** |
| **$1,500 / month / engineer / tool** (Uber's cap) | 1, 6, 7 | **CURRENT** | A limit in force. Announced 2 June 2026, reported as policy, no report of withdrawal anywhere in the record. This is a fee in the rule's sense: a number a named party is actually bound by today. | **Yes** — row 7 only |
| **~$36,000 / year** (two tools, twelve months) | 7 note | **CURRENT** (derived from the above) | Willison's own arithmetic on the current cap. | No — see ruling 4 |
| **~$330,000** median total comp | 7 or 8 | **CURRENT**, with a caveat | A 2026 compensation figure. But it is Levels.fyi data quoted by a third party, explicitly "not an Uber disclosure", so a rupee bracket converts an estimate. | **Operator ruling 5** |
| **$2,180.16 / $1,199.79 / $980.37** (one user's 30-day token value, May 2026) | 8 | **Neither cleanly.** My read: **treat as historical in kind** | This is not a price in force. It is a record of what one particular month cost, computed against rate cards that may themselves have moved since. Converting it produces a rupee figure nobody was ever charged. | **No** — ruling 4 |
| **$200** paid (two subscriptions at $100 a month) | 8 note | **CURRENT** | Subscription prices in force. | **No**, on composition grounds — ruling 4 |
| **$20 a seat a month** (enterprise terms, 14 Apr 2026) | 6 | **Dated timeline event** | See the timeline rule below. | **No** |
| **$5 / $25 per million** (the unchanged card, Apr 2026) | 8 note | **Dated** | Stated as the card that did *not* change. Its point is that it stayed still while the bill moved. | **No** |
| **$1.25 / $10** (the frontier price at ship, Aug 2025) | **cut** | — | The Aug 2025 timeline event is dropped (§8a), so this figure leaves the issue. | — |

**Two composition rules I am proposing, both of which need the operator's
sign-off because neither is written down yet:**

1. **Every money figure inside a dated `timeline` event is stated as of that
   date, so it takes no rupee bracket.** A timeline is a record of what was
   true on a day. Converting a 14 April 2026 seat price at a September 2026
   rate is the same error rule 4 exists to prevent, only smaller.
2. **Per-token rate cards take no bracket regardless of vintage.** Two
   reasons. First, $0.25 per million tokens is roughly ₹21, and a bracket there
   is noise rather than a comparison the reader can feel, which is what rule 4
   is *for*. Second, a rate card's point is the ratio between it and the next
   one, and a second currency puts four numbers in a sentence, past rule 8's
   cap of two.

**Where the rupee actually lands: one bracket, maybe two.** Row 7's `$1,500`,
and row 7 or 8's `~$330,000` if ruling 5 goes in. That is the whole of it.
An issue with one well-placed bracket on the number the reader is meant to
feel does more for rule 4 than nine brackets on wholesale unit prices.

**The rate is a fact I do not have, and will not guess.** The contract requires
the rate and its month on the source line of each section carrying a bracket.
I have no web access and the rate is in none of the three input files. **The
drafter must be given the September 2026 USD/INR rate by the operator** and
must not invent one. The bracket text in this storyboard ("about ₹1.3 lakh")
is my own illustration at roughly ₹85–90 to the dollar, shown so the operator
can see the order of magnitude; **it is not a sourced figure and the drafter
computes the real one from the supplied rate**. See ruling 4.

One further question inside that: the issue keeps `publishedAt: 2026-06-04` but
the bracket is being written in September 2026. My recommendation is to use the
**September 2026 rate and name September on the source line**, because that is
when the conversion was done and naming it is what makes it honest. The
alternative, a June 2026 rate, is defensible too and is the operator's call.

### Derivations used

Arithmetic on the issue's own numbers. No new fact, no new source, listed so
the operator can rule.

1. **"About 86%"** = 1,176,320 ÷ 1,363,250. The cached share of the measured
   task. Used in the hero's caption and its annotation. This is the single
   derivation the hero rests on.
2. **"17,112 of 1.36 million"** — stated as the raw pair rather than as 1.3%,
   because the raw pair is more arresting and involves no division at all.
3. **1,363,250** = 169,818 + 17,112 + 1,176,320. Already published, and the
   verifier already checked the sum. Restated so the drafter does not
   re-derive it.
4. **"~$36,000 a year"** = $1,500 × 2 tools × 12 months, and **"~11%"** against
   ~$330,000. Both are already published and both are Willison's arithmetic,
   not Uber's. The caveat travels with them.
5. **The rupee brackets** — arithmetic on a rate I do not have. Blocked
   pending ruling 4.

**Derivations deliberately NOT used, and the drafter must not compute them:**

- **"About 270×"** = 1,363,250 ÷ 5,000. The tempting headline multiplier. It
  is barred, because the 5,000 is an illustrative floor the dossier marks
  [UNVERIFIED], so dividing by it manufactures three digits of precision on a
  number nobody sourced. The 5–30× band stays barred for the same reason
  (guardrail 2, §8b) and the issue keeps the verified order-of-magnitude
  framing instead.
- **"15×"** = ($1,500 × 2) ÷ $200. A cap is a ceiling and $200 is a price
  paid. They are not like for like and the ratio would read as one.

### The one Hindi word

**One, in row 1's `note`: *hisaab*.** Sketch: *"Cheaper per unit, many more
units per job. That hisaab only goes one way."*

The four tests (§2): delete it and the English still says everything ("that
maths only goes one way") ✅ · it is the word an Indian would actually use for
a reckoning of what something adds up to ✅ · no wince, because it is not a
joke and not decoration ✅ · it sits in a `note`, which `check-prose.mjs`
scores as body prose, not in a `caption`, `plain`, `howToRead`, `source` or
data label, and it modifies nothing numeric ✅.

**Nowhere else.** This is a money-and-units issue where almost every sentence
runs beside a figure, and the precision test bars Hindi from all of them. In
particular: **no `hindi` field on any `jargon-buster` term.** The component
offers one, but a Hindi gloss attached to a term of art is precisely what the
precision test forbids, and "token" is the most technical word in the issue.
If the operator would rather the issue carried none at all, cut it and nothing
else changes (ruling 6).

## 6. The three questions

What the issue must teach. Written from the dossier and the published record,
not from any draft; the reader panel answers them from the draft alone. If the
draft cannot teach these, the draft is wrong.

1. **Q:** The price of an AI token keeps falling. So why did Uber's AI bill go
   up?
   · **A:** Because the bill is the price of a token multiplied by the number
   of tokens used, and the second number climbed faster than the first one
   fell. Coding tools stopped answering questions and started doing whole jobs
   on their own, and a job loops: it reads the code, tries, reads the failure,
   tries again, re-sending what it already has on every step. One measured task
   used 1,363,250 tokens where a chat reply uses a few thousand. Uber budgeted
   2026 against the old arithmetic and the whole year's AI money was gone in
   four months.
   · rows 1, 3, 4, 5 · `paradox` sides 1 and 2, `prose` CROSSOVER ¶2,
   `scaling-plot` intro, dossier §1 and §4 (the scissor; tokens-per-task) ·
   src-01, src-02, src-04, src-06.
   · Answerable from **two drawn graphics** (rows 3 and 5).
2. **Q:** What changed in November 2025, and was it a price change?
   · **A:** No price change at all. Two coding models shipped in one week and,
   with their coding harnesses, coding agents went from often-work to
   mostly-work, crossing the line where you could use one as a daily driver.
   The software changed jobs. Billing followed the change rather than causing
   it: OpenAI moved Codex to token metering in April 2026 and Anthropic's
   enterprise seat stopped including usage in the same month.
   · rows 4, 6 · `prose` CROSSOVER ¶1, `timeline` Nov 24 / Apr 2 / Apr 14,
   dossier §3 and §4 · src-02, src-03.
   · Answerable from the **three cards plus the timeline**. This is the one
   question the spine does not put on a chart, and `three-steps` exists for it.
3. **Q:** What exactly did Uber cap, and how big is that number?
   · **A:** $1,500 of token spending a month, per engineer, **per tool**, with
   a separate budget for each one, and it applies only to agentic coding
   software such as Cursor and Claude Code, not to chat assistants. That is
   about ₹1.3 lakh a month for one person and one piece of software. Two tools
   works out to roughly $36,000 a year, about 11% of a median Uber engineer's
   total compensation of around $330,000 — Willison's arithmetic on Levels.fyi
   data, not a company disclosure.
   · rows 1, 6, 7, 8 · `data-readout` tiles 1 and 3, `timeline` Jun 2,
   dossier §4 (Uber) · src-01.
   · Answerable from a **drawn component** (row 7) with row 8 behind it.

**The hedges are part of the pass mark.** A panel answer that states "11% of an
Uber engineer's pay" as Uber's own figure is a **fail**, not a pass: the
caveat ("Levels.fyi data quoted by Willison, not an Uber disclosure") is a
dossier instruction the published issue carries and this rewrite keeps.
Likewise, an answer that gives a hard multiplier for chat-versus-agent tokens
is a fail — the record supports "a few thousand against over a million" and
nothing sharper.

## 7. Names

**Seven real names.** The ration is 12 and the published issue carries 21.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **Uber** | the first named company to run out of AI budget and say so | head, rows 1, 6, 7, 8, 9 |
| **Simon Willison** | the developer who has tracked AI pricing week by week and measured his own token bill | rows 4, 8 (full form, once) |
| **Anthropic** | one of the two labs whose coding agent Uber capped | rows 2, 6 |
| **OpenAI** | the other, and the maker of the agent in the measured task | rows 4, 6 |
| **Claude Code** | Anthropic's coding agent, one of the two tools the cap names | rows 6, 7 |
| **Cursor** | the other tool the cap names | row 7 |
| **Codex** | OpenAI's coding agent, the one whose single task was measured | rows 3, 5 |

**Described, not named — this is where 14 of the published 21 go.** Every
model version is described by what it did and when, never by its version
string: *"two coding models shipped in one week in November 2025"* (was
GPT-5.1 Codex Max and Claude Opus 4.5); *"the newest frontier model shipped in
April at twice the price of the one before it"* (was GPT-5.5 and GPT-5.4);
*"the April update counts more tokens for the same input"* (was Opus 4.7 and
Opus 4.6); *"Anthropic's cheapest 2023 model"* (was Claude 3 Haiku). The
comparison models in the published `paradox` (GPT-5-mini, Grok 4 Fast, Gemini
3.1 Flash-Lite, Claude Haiku 4.5) leave the issue with the `paradox` itself.
The two subscription plans in the `$200` figure become "two subscriptions".

**Source lines only, never inside a sentence** (rule 9, and it is also the
cheapest name saving available): **Bloomberg · Natalie Lung · Levels.fyi ·
Simon Willison's Weblog.** `check-prose.mjs` scans `body` strings plus
title / hook / dek / primer / caption for names, and a `source` string is
neither, so a name on the source line costs nothing against the ration and
still appears on the page.

> **Two drafter rules that follow from how the heuristic works. Both are easy
> to break by accident.**
>
> 1. **Use "Simon Willison" in full on first mention and then "the developer"
>    or a pronoun. Never a bare "Willison".** The scanner adds the full
>    sequence and the bare surname as two *different* entries, so the
>    published issue is paying twice for one person.
> 2. **Avoid the bare tokens "API", "USD", "PDF", "Max" and "Pro".** The
>    heuristic matches any capitalised token of two or more characters that is
>    not in its stop list, so each of these lands as a "name". Write "at list
>    prices" not "at API rates", "$20 a seat a month plus what you actually
>    use" not "plus API pricing", and "two subscriptions" not "Max + Pro".
>    Model version strings containing digits (GPT-5, Opus 4.7) do **not**
>    match, so they are not the problem the count suggests — the bare words
>    around them are.
>
> **"AI" will be counted and cannot be avoided.** It matches the pattern, it is
> not in the stop list, and this issue cannot be written without it. Budget one
> slot. Expected heuristic total: **8** (the seven above plus "AI"), against a
> cap of 12.

## 8. Composer notes

### 8a. What carries over, and what changes — the published-section fate table

Component `data` is expensive and already verified, so the rewrite reuses it
wherever the register allows. Every number in this table is **copied, not
retyped** (contract rule 13).

| Published section | Verdict | Detail |
|---|---|---|
| `paradox` (THE SCISSOR) | **cut → re-kinded to `you-think` at row 1** | This single change is what takes 748 words before the first graphic down to 74. `paradox` is in `TEXT_ONLY`, so all six of its data strings (two labels, two statements, two details of 85 and 120 words) counted against the floor, and it sat at section 1. The catalog's USE WHEN for `paradox` is "two facts **both true**" and both blades are indeed true — but the issue's own §1 says the reader "walks in believing the obvious corollary", and a corollary the reader has wrong is `you-think`'s job, not `paradox`'s. **Every fact survives:** side 1's rate-card anchor becomes row 2's "per-token price" gloss; side 2's mechanism becomes rows 3, 4 and 5; the four-month burn becomes `actually.value`. Nothing carries over verbatim; the section is re-authored at roughly a third the length. |
| `prose` (THE CROSSOVER) | **cut → split three ways** | ~430 words, the single heaviest block in the issue and the second half of the 748. The ordered mechanism → row 4 `three-steps`; the November dates → row 6's first event; "burn vastly more tokens" and the replay quote → rows 4 and 5. **Every fact survives:** the 2025 RLVR training push, the two November ship dates, "from often-work to mostly-work", the replay-the-whole-conversation mechanism with both verbatim fragments, and the cost-shift framing. `skimCaption` goes with it. |
| `scaling-plot` | **carried, 5 → 2 points, `howToRead` rewritten, gains 1 annotation** | `points` drops `{x:2, y:22000}`, `{x:3, y:90000}` and `{x:4, y:320000}` — the invented interior. Keeps `{x:1, y:5000, label:"one chat reply*"}` (the illustrative floor, asterisk and all) and the measured `{x:5, y:1363250}`, **re-indexed to x:2** so the axis is not two dots at opposite ends of an empty field. `logY: true`, `xLabel` and `yLabel` unchanged. The `caption` and `source` keep their "illustrative of task class, not measured" language, narrowed to the one remaining starred point. See §8c for the rule this applies and ruling 1. |
| `timeline` | **carried, 8 → 6 events, gains `annotations[]`** | Every surviving date and `state` unchanged. **Dropped:** "Aug 7 2025 · GPT-5 sets the frontier price" (the falling-price anchor now lives in row 2, and the event is scene-setting rather than a turn) and "Apr 16 2026 · Opus 4.7 ships" (the tokenizer fact is better as a `data-readout` tile than as a timeline beat, and it frees the slot). Surviving: Nov 24 2025 (key), Apr 2 2026, Apr 14 2026, Apr 23 2026 (fail), ~Apr 2026 (fail), Jun 2 2026 (now). Labels shortened to ≤ 7 words, notes to ≤ 10 and only on three of six, with model version strings replaced per §7. `source` and `sourceRefs` unchanged. |
| `benchmark-chart` | **carried as a kind, repointed to different sourced data, promoted to hero** | The component, its `unit` / `caption` / `source` machinery and its `highlight` flag all stay. What changes is which four numbers it draws: the $ arbitrage bars ($2,180.16 / $1,199.79 / $980.37 / $200 with `refValue: 200`) are replaced by the measured task's three token counts. **No fact is added** — all three values already sit in the published `scaling-plot` intro. `refValue` / `refLabel` / `sortDesc: true` become: no reference line, `sortDesc: true` kept. The displaced arbitrage figures do not leave the issue; they move to row 8's tile, which is where the dossier's own §9 note says a sub-point belongs. |
| `data-readout` | **carried, 6 → 4 tiles** | Kept verbatim, values and notes, with two edits: **"~11%"** (its note loses "Levels.fyi", which moves to the source line, and keeps "not an Uber disclosure"), **"$2,180"** (note keeps the $200 subscription), **"2×"**, **"~1.4×"** (note reworded to drop the two Opus version strings). **Dropped:** the "$1,500" tile, which becomes row 7's whole subject, and the "4 months" tile, which is row 1's `actually.value`. Four tiles is inside the kind's 3–6 range. |
| `prose` (the closer) | **carried, 3 paragraphs → 1, ≤ 75 words** | ~330 words to ≤ 75. The published title "The cost didn't fall. It *moved*." is retired: the once-per-issue binary reframe is spent on row 1, and a closer that restates the opening in mirrored shape is tell 22. Paragraph 2's forward-looking clause ("the unit economics suggest it will not be the last") is **dropped** — the verifier's optional note 2 said to soften it if the Goldman sentence went, and the Goldman sentence did go. The src-07 quote (code cheap to write, good code not) lands here, which is also what keeps src-07 from being orphaned. `skimCaption` cut. |
| `sources[]` | **all seven, unchanged** | Slug `2026-06-04-ai-coding-token-bill` unchanged; the URL does not move. Coverage across the new spine: src-01 (rows 1, 6, 7, 8) · src-02 (rows 1, 4, 6, 8, 9) · src-03 (rows 4, 6) · src-04 (rows 2, 3, 5) · src-05 (row 8) · src-06 (rows 4, 5) · src-07 (row 9). **No orphan.** |
| head | **rewritten** | New title, hook, dek, primer (§4). `id`, `topic`, `publishedAt: 2026-06-04`, `status: published`, `tags` all unchanged. `readTimeMinutes` **7 → 4**. |
| MDX body EDITOR block | **rewritten, all four guardrails carried plus two new** | See §8b. |
| `sourceRefs[]` | **populate them** | The verifier's optional improvement 1: every section names its sources in prose and the `source` line, but `sourceRefs[]` is empty on all seven published sections. A rewrite that re-authors every section is the cheapest moment this will ever be done. Wire `sourceRefs` on all nine rows per the coverage map above. |

**Verification residuals resolved by composition rather than by patching
prose:** the empty `sourceRefs[]` on every section (wired above); the
forward-looking clause that lost its footing when Goldman was cut (dropped);
and the `$2,180` tile's rounding ambiguity (the exact `$2,180.16` no longer
appears anywhere else in the issue, so the tile's rounding is no longer
inconsistent with a chart bar — it is the only place the figure appears).

### 8b. The standing guardrails, and the rows they constrain

The published MDX body carries a four-item `EDITOR NOTES` block. **All four
survive. None is moot.** Restated here against the new spine, plus two new
ones the rewrite creates.

1. **The Goldman 24×-by-2030 projection and src-08 stay out.** goldmansachs.com
   is off the tech allowlist and the page was JS-gated. This was the verifier's
   required fix 1 and it was resolved by cutting rather than flagging. The
   issue rests entirely on allowlisted Willison facts. **Constrains row 9**,
   which is the only row that would reach for a forward-looking number, and it
   has none to reach for.
2. **The 5–30× chat-versus-agent multiplier is never stated as a figure**, and
   neither is any ratio derived from the illustrative 5,000 floor. Dossier §9
   note 2 and §4. **Constrains rows 1, 3 and 5**, the three rows that carry a
   token count. Only the verified order-of-magnitude framing is used: "a few
   thousand" against "over a million".
3. **The Bloomberg original (Natalie Lung, 2 June 2026) is paywalled and was
   never directly accessed.** Every load-bearing Uber fact reaches the page
   through Willison's relay, src-01, which quotes the cap verbatim.
   **Constrains rows 1, 6, 7 and 8** — every Uber figure in the issue. If the
   operator has Bloomberg access, confirm the cap wording and the "four
   months" claim. See §8e.
4. **Two stories stay out entirely:** the $18.40 → $6.07 per-million blended
   cost-of-intelligence figure (in no allowlisted source at all) and the
   Microsoft / Claude-Code-licence-cancellation story (non-allowlisted
   aggregators only, tracing to a paywalled original Willison did not cover).
   **Constrains kind selection itself** — the second would be the issue's only
   second institutional data point and would justify a `comparison`, and it is
   not available.
5. **NEW: the comp figure always travels with its caveat.** "~$330,000" and
   "~11%" are Levels.fyi data quoted by Willison plus Willison's own
   arithmetic assuming two tools, not an Uber disclosure. **Constrains rows 7
   and 8.** The caveat sits in the tile note and the `number-sense` note; the
   outlet name sits on the source line.
6. **NEW: the names ration is a drafting rule, not a review note.** Model
   versions are described, not named (§7); "Simon Willison" appears in full
   once and never as a bare surname; "API", "USD", "Max" and "Pro" are written
   around. **Constrains every row.**

### 8c. What is cut, and why

1. **The `paradox`.** Not because it is a bad section — it is a genuine
   two-sided paradox and the verifier said so — but because it is `TEXT_ONLY`
   sitting at position 1, which is single-handedly most of the 748. The
   argument it makes is stronger in `you-think`, at a third the words, in a
   kind the gate counts as a graphic, and with its `data` outside the
   before-first-graphic count entirely.
2. **Three of the `scaling-plot`'s five points, and the rule behind it.** The
   test is **decoration versus claim**. The published claim is "a chat reply
   burns a few thousand tokens, one task burns over a million" — the *endpoints*
   carry it. The three interior points (22,000 / 90,000 / 320,000) carry
   nothing except a smooth line, and a smooth line is itself an assertion:
   it tells the reader the climb is even across five named task classes, which
   no source says. The floor (5,000) is invented too, but it is an endpoint of
   the claim, it is asterisked, and deleting it deletes the comparison. So the
   interior goes and the endpoints stay. This is the cockroach adoption-curve
   ruling applied with one refinement, and it is worth writing down, because
   the naive version of that ruling ("delete every unsourced point") would
   leave this chart with one dot.
3. **Two `data-readout` tiles.** "$1,500" becomes row 7's entire subject and
   "4 months" is row 1's settling figure. A tile that repeats a number the
   reader met two sections ago is a block, not a fact.
4. **Two `timeline` events.** See §8a. Both are scene-setting rather than
   turns, and the ≤ 6 ceiling has to come from somewhere.
5. **The `benchmark-chart`'s original bars.** Not deleted, demoted. Dossier §9
   is explicit: "The subscription-arbitrage fact is seductive but is a
   *sub-point*... Keep it subordinate to the enterprise scissor; don't let the
   issue become 'how to get cheap tokens.'" The published issue gave it a whole
   section and the hero-adjacent slot. This rewrite gives it a tile, which is
   what "subordinate" looks like structurally.
6. **`skimCaption` on the closer.** It renders only in Skim mode (contract
   rule 5) and costs up to 40 words on a spine with 20 to spare. The
   consequence is that row 9 shows nothing in Skim mode, which is acceptable:
   the argument is already in row 1's `you-think` and the hero's caption, and
   both render there.
7. **The published closer's title and its second paragraph.** See §8a.

### 8d. Kinds I wanted and could not use

- **`carbon-gauge`** (earth, cross-world) for Uber's budget burn. This is the
  one I most wanted and it is the best hero this issue could possibly have:
  the kind is literally "a budget as a gauge, used against remaining", and the
  issue's whole event is a budget that hit zero eight months early. It is
  blocked by **one number**: the size of Uber's 2026 AI budget in dollars,
  which `value`/`max` both need. Nothing in the record discloses it — Bloomberg
  reported the *proportion* ("entire annual budget") and not the amount, and
  Willison's relay carries no figure. **Unblocking it is not a researcher
  job**, because no source has the number; it would need Uber to disclose it.
  Worth stating so the operator sees a closed door rather than a gap.
- **`throughput-dial`** (tech signature) for the same story. Same block, plus a
  second: a dial wants a rate against a capacity, and "100% of a year's budget
  in four months" is a total, not a rate.
- **`moore-ladder`** (tech signature) for the falling price of a token. The
  shape is right — a dated count series over three or more orders of magnitude
  where a doubling is the claim — and this is the issue that should have one.
  It is blocked twice. The kind needs **≥ 6 points, each `{year, count}` for
  one comparable quantity**, and the record has a scatter of per-model rate
  cards at different capability tiers, mostly undated: $0.25, $0.05, $0.20,
  $1.25, $1.00 across five different models is not a series of anything.
  Plotting it would assert a fall that mixes tiers. The one figure that *is*
  the right shape, the blended cost of intelligence at $18.40 → $6.07 per
  million, is the dossier's flagship [UNVERIFIED] item and is barred. **What
  would unblock it:** a dated per-million-token price series for one model
  family from an allowlisted source. That is a real research job and it is the
  highest-value one this issue has, because it would give the falling blade a
  chart of its own and let the hero be a two-chart scissor.
- **`version-graph`** (the native tech signature). The dossier forbids it in
  §7 and §9 and is right: the story is a cost curve, not a release tree.
- **`commit-grid`**, **`latency-waterfall`**, **`queue-cliff`**,
  **`neural-flow`**, **`arch-stack`**. Each needs data the record has none of:
  daily activity levels; timed spans with durations; a service rate and a
  utilisation ρ; per-layer unit counts; and a layered structure with values.
  The agent loop is sequential, not layered, and its steps have no measured
  durations, so `three-steps` is its honest form.
- **`attrition-waffle`** for the token split. It nearly fits, which is why it
  is worth naming: the three shares sum to about 100 and there is a real n
  (1,363,250). It is declined on two grounds. The frame is wrong — nothing is
  attriting, the tokens are all spent — and the three shares round to 100.02,
  which the kind's build-time sum check is entitled to reject. `benchmark-chart`
  says the same thing without the risk.
- **`analogy`** (pairs form) for the electricity bill. Declined because it
  would be a fourth text-only row, which takes visual share to 60% exactly and
  leaves the operator no room to move a row. The mapping is one line and
  belongs inside row 2's "per-task cost" gloss, next to the number.
- **`quote`.** There are six verbatim Willison lines in dossier §5 and at least
  two of them are excellent. A `quote` row costs roughly 110 words for one
  line, and this spine has 20. The lines survive as fragments inside row 4's
  step text and row 9's paragraph, attributed, which is what the published
  issue already does successfully.
- **`comparison`.** `TEXT_ONLY`, and nothing here is a peer-by-peer
  read-across. The two labs are not being compared; they are doing the same
  thing.
- **`number-sense` a second time**, on 1,363,250 tokens with "about 22
  thirty-page PDFs" as an `equals` line (a real derivation: 1,363,250 ÷ 60,934
  from the tokenizer measurements in src-05). Genuinely tempting, and a good
  way to make the unit concrete. Declined: the catalog rations the kind to one
  per issue, the hero already draws that number, and it would cost a tenth row
  the budget does not have. Named here in case the operator prefers it to
  row 7.
- **`act-break`.** Composed **without** them, consistent with RG-06 as settled
  on the delimitation and cockroach storyboards. For the record: with three
  text-only rows in nine there are two adjacency-safe slots, before row 5 and
  before row 7, and the second is the real pivot (from how the machine works
  to what it costs a company).

### 8e. Re-anchoring: my judgement is **no researcher pass**, with one figure set flagged for the operator

The Arsenal condition is narrow and neither half of it is met here. That pass
existed because seven of its numbers rested on sources that were off-allowlist
when the dossier was written and on-allowlist seventeen days later, and because
one figure was contradicted by the source it was attributed to (28.5 xGA
against Opta's own 28.3).

**What I checked, and what I concluded:**

- **The whole Uber figure set — $1,500, four months, ~$330,000, ~11%. This is
  the one I flag, and it is not an Arsenal case.** Everything the issue's
  title, hook and three quiz questions rest on reaches the page through
  **one** source: Willison's 3 June post relaying a **paywalled Bloomberg
  story the researcher never accessed**. That is thin for an issue's central
  institutional fact. But it fails both Arsenal tests: Willison was and is on
  the tech allowlist, he quotes the cap wording verbatim, and nothing anywhere
  contradicts him. **A researcher pass cannot improve this**, because the only
  improvement available is the Bloomberg original and the researcher already
  hit the paywall. **This is an operator action, not a pipeline phase:** if the
  operator has Bloomberg access, confirm the cap wording and the "four months"
  claim before the rewrite ships. If not, the issue publishes as it published
  in June, on the same relay, and guardrail 3 stays in the EDITOR block.
- **Vendor pricing pages — the prompt's other candidate — are not actually in
  this issue's chain.** Every rate card comes from Willison's `llm-pricing`
  tag index (src-04), not from a vendor page, so there is no off-allowlist
  hop to re-anchor. What *is* true is that a rate card is a live document and
  src-04 reflects prices as of 4 June 2026. **That is the currency question
  in §5, not a sourcing question**, and it is a ruling rather than a research
  job: no fetch tells you whether the issue should convert a June price at a
  September rate.
- **The four illustrative `scaling-plot` points — weak by authorship, not by
  sourcing, and the fix is deletion.** No source can supply a token count for
  "a short Q&A thread" or "a single-file edit", because those are task classes
  somebody invented, not measurements anybody took. A research pass returns
  empty-handed. Three of them go (§8c), which is the single most important
  provenance change in this rewrite.
- **Willison's $2,180.16 — self-reported, unaudited, and by the issue's only
  source.** It is the clearest single-source figure left. It is also framed
  honestly on the published page ("self-reported 30-day usage") and it is a
  sub-point that this rewrite demotes from a section to a tile. **Keep it, keep
  the framing on the source line, and do not commission anything.** If the
  operator wants zero self-reported numbers in a rewritten issue, dropping the
  tile costs ~30 words and loses nothing structural.
- **Goldman — already gone, stays gone.** The verifier's required fix 1 was
  resolved by cutting the sentence and src-08 rather than by flagging them.
  This rewrite does not reopen it, and the closer no longer has a
  forward-looking clause that needed it.

**If the operator orders a pass anyway**, here is what it would have to do, so
the cost is visible: fetch Bloomberg's 2 June original for the cap wording and
the four-month claim (an access problem, not a search problem); and search for
a dated per-million-token price series for one model family to unblock
`moore-ladder` (§8d), which is the only fetch that could add a *section* to
this issue. Neither is needed for this rewrite to ship.

### 8f. `plain`, `howToRead` and the annotation layer

**How-to-read panels: exactly one, on row 3.** Checked against `NEEDS_HOW` in
`src/lib/explainers.ts`: of the nine kinds in this spine, only `scaling-plot`
is in it. `you-think`, `jargon-buster`, `three-steps`, `benchmark-chart`,
`timeline`, `number-sense`, `data-readout` and `prose` are all absent, so under
RG-19 no panel renders on them and **none is authored**. The published issue
authors exactly one too, on the same row, which makes this a floor held rather
than a change.

Row 3's panel must be rewritten for two points instead of five, and it must
follow the instrument rule: **the static reading leads, the control clause
trails**, because the toggle is `html.js`-gated and the paragraph is not.
Sketch (~44 words, ~235 characters, inside the 40–360 bound):

> *"Each step up the side is ten times the step below it, so a gap that looks
> small here is not. Read the height of each dot rather than the distance
> between them. Press Linear for the evenly spaced view of the same two
> numbers."*

**`plain` lines: two authored, seven defaults.**

| Row | `plain` | Why |
|---|---|---|
| 3 `scaling-plot` | **authored**, ≤ 18 w: *"Each dot is one kind of task, placed by the number of tokens it used."* | `EXPLAIN['scaling-plot'].what` ends "the fit line shows the law the points obey", and there is no fit line on two points. Note the wording is deliberately toggle-agnostic: the reader can switch the scale, so a `plain` that names the log scale becomes false in the other projection (the CAPTION-FORM trap, applied to `plain`). |
| 5 `benchmark-chart` | **authored**, ≤ 18 w: *"Each bar is one slice of a single task's token bill, longest first."* | The default ends "the reference line the mark to beat", and this chart has no `refValue`. |
| 1, 6, 7, 8 | default | `you-think`, `timeline`, `number-sense` and `data-readout` defaults all describe these payloads correctly. |
| 2, 4, 9 | none | Narrative kinds take no plain line. |

The source renders on every section as the second line of that paragraph, from
`core/Section.astro`. Rows 7 and 8 are the two whose source lines do extra
work: row 7 carries the ₹ rate and its month (ruling 4), row 8 carries
Levels.fyi (the names saving, §7).

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** Three
annotation-capable kinds sit in this spine and **all three are used**. Four
callouts, all ≤ 12 words.

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 3 `scaling-plot` | the label `"GPT-5 Codex task (measured)"`, matched exactly | **"The only measured point here. One task, 1.36 million tokens."** (10 w) | States the provenance on the mark rather than burying it in a source line, and it is the honest counterweight to the one remaining starred point below it. `at` for this kind is the point's `label` or its raw x — the drafter must match the label string exactly. |
| 5 `benchmark-chart` | the top bar's label | **"Most of the task was context re-sent, not new code."** (10 w) | The hero's finding, on the bar that carries it. This is where derivation 1 (86%) lands if the operator prefers the share to the raw counts. |
| 6 `timeline` | `"Nov 24 2025"` | **"Nothing got more expensive here. The tools just started working."** (10 w) | The load-bearing point of the whole issue, placed on the date that turns it. Answers quiz question 2 on the mark. |
| 6 `timeline` | `"Apr 23 2026"` | **"At the frontier, the per-token price is now rising."** (9 w) | The fact that breaks the headline the reader walked in with, on the event that proves it. |

`you-think`, `number-sense` and `data-readout` are **not** in the eight
annotation-enabled kinds, so their findings ride the section title and the
caption.

### 8g. The budget, and what pays if a row overruns

Twenty words of headroom is thin, and three rows in this spine are prone to
overrun (row 6's six events, row 8's four tile notes, row 3's authored
`howToRead`). **Row 9 is the designated slack row.** In order, and nothing else
pays:

1. **Row 9, the `prose` closer**, from 75 words down to 60. That buys 15.
2. **Row 9 entirely.** Cutting it takes the spine to **eight rows**, frees
   **90 words**, and raises visual share to **6 of 8 = 75%**. The cost is that
   the issue ends on a tile grid with no landing, which is a real loss but not
   a floor violation.
3. **Timeline and tile notes.** The per-row caps in §3 are ceilings, not
   targets: notes on three of six events, capped at 10 words; tile notes capped
   at 11.
4. **Section intros**, which all have slack. Rows 3 and 5 carry the largest at
   28 each.

**Never pays:** any number, any hedge or caveat, the ₹ bracket, the `equals`
notes in row 7, the `jargon-buster` glosses, or the `you-think` reframe. If
after all four passes the issue is still over 1,100, stop and report the
overrun with the arithmetic rather than cutting into that list.

**The larger lever, if the operator wants real headroom:** cutting row 3
(`scaling-plot`) frees **125 words** and leaves an eight-row spine at 5 of 8 =
62.5% visual, still inside the floor. I do not recommend it — it is the
issue's only instrument, its only log axis, and the toggle is the argument made
physical, since pressing Linear makes the chat reply vanish into the axis. But
it is the biggest single block of words available and the operator should know
its price. See ruling 1.

### 8h. Two gate notes that will fire and are not defects

1. **ℹ CHROME-HEAVY on rows 6 and 8.** `check-prose.mjs` counts any field of
   four or more words as a block and flags above five per section. A six-event
   timeline and a four-tile readout will always exceed that, because their data
   *is* many short strings. The published issue trips it on the same two kinds.
   It is an ℹ, not a ⚠️.
2. **The names count will read 8, not 7.** "AI" matches the capitalisation
   heuristic and is not in the stop list, and this issue cannot avoid the word.
   Both numbers are well inside the ration of 12; the boxed note in §7 is what
   the operator should read beside the figure.

### 8i. For the operator — nine rulings before the draft

> ## SETTLED — operator ruling, 2026-09-15
>
> **All nine settled as recommended, and the rate is supplied.** The reasoning
> below is kept verbatim; this block is what the drafter executes.
>
> 1. **`scaling-plot` trims to two points.** The three invented interior points
>    go; the asterisked 5,000 floor and the measured 1,363,250 stay.
> 2. **Hero is the `benchmark-chart`** on the measured task's token split, at
>    `layout: wide`.
> 3. **Neutral bar labels, sharp annotation.** The sharper labels join two
>    sourced facts into one inference and are not authorised.
> 4. **The currency split is approved in full**, including both proposed
>    composition rules. See the rate block below.
> 5. **The ~$330,000 figure gets its bracket**, in row 7's `equals` note, with
>    the estimate caveat in the same breath.
> 6. **One Hindi word:** *hisaab*, once, in row 1's `note`. No `hindi` field on
>    any `jargon-buster` term.
> 7. **No researcher pass.** A pass cannot get past a paywall. Guardrail 3
>    stays in the EDITOR block and the issue ships on the footing it shipped on
>    in June.
> 8. **Row 9 is kept** and shrinks to 60 words before anything else pays.
> 9. **`readTimeMinutes` 7 → 4**, everything else in the frontmatter unchanged,
>    in-place replacement, tabled before commit.
>
> ### THE RATE — supplied by the operator, 2026-09-15
>
> **About ₹95 to the dollar, September 2026.** The month ran roughly 94.5 to
> 95.9 (US Federal Reserve H.10; exchangerates.org.uk). Use **₹95** for every
> conversion in this issue and do not recompute at any other rate. The two
> figures, already worked out so they are not re-derived:
>
> | Figure | Bracket to use |
> |---|---|
> | **$1,500 a month** (Uber's cap, row 7 tile) | **about ₹1.4 lakh** |
> | **~$330,000** (median total comp, row 7 `equals` note) | **about ₹3.1 crore** |
>
> The storyboard's own illustrations of "₹1.3 lakh" and "₹2.9 crore" were
> struck at roughly ₹85–90 and are **stale. Do not use them.**
>
> ### The date rule — the operator's explicit constraint
>
> *"September 2026, but that should not create a confusion with the event
> dates."* The issue is a June 2026 record carrying a September 2026
> conversion, so the drafter must make that impossible to misread:
>
> 1. **No rupee bracket inside any dated `timeline` event, ever.** A timeline
>    records what was true on a day; converting a 14 April 2026 seat price at a
>    September rate is the same error rule 4 exists to prevent. Composition
>    rule 1, approved.
> 2. **No bracket on a per-token rate card regardless of vintage.** Composition
>    rule 2, approved.
> 3. **The rupee appears in exactly two places**, both in row 7, both on
>    figures that are current because they are still in force.
> 4. **The source line on row 7 states the rate AND its month explicitly**, so
>    the reader can see the conversion is dated later than the issue: for
>    example *"Converted at about ₹95 to the dollar, September 2026."* The
>    rate's date is never left implicit and is never allowed to read as the
>    date of the cap.
> 5. **The dollar figure always leads.** The rupee is in brackets after it,
>    never instead of it, and never in a caption, a `plain` line, a data label
>    or a source label other than the rate note above (contract §2, the
>    precision test).


1. **The `scaling-plot` trim: five points to two.** Confirm. This deletes
   22,000, 90,000 and 320,000 — three invented interior points whose only
   function is to draw a smooth line that no source describes — and keeps the
   asterisked 5,000 floor and the measured 1,363,250. The rule I applied is in
   §8c ¶2 (decoration goes, an endpoint of the claim stays), and it is a
   refinement of the cockroach adoption-curve ruling rather than a copy of it.
   *Alternatives:* keep all five as published (the verifier did pass them), or
   cut the row entirely and free 125 words (§8g). **My recommendation: trim to
   two.**
2. **The hero is the `benchmark-chart`, repointed to the measured task's token
   split, at `layout: wide` and not `split`.** Confirm (§2). All three values
   are already on the published page inside the `scaling-plot` intro, so no
   fact is added. The arbitrage bars it displaces move to a `data-readout`
   tile, which is what dossier §9 asks for.
3. **How sharp may the hero's bar labels be?** Composed with **neutral**
   labels ("cached tokens", "input sent", "output written") and the
   interpretation carried by the intro and the annotation, using Willison's own
   verbatim mechanism line. The sharper version labels the top bar "context
   re-read on every step", which is what the section means and what makes the
   chart land — but it joins two facts (the cached count in src-04, the replay
   mechanism in src-06) into one label, and that join is an inference, however
   good. **My recommendation: neutral labels, sharp annotation.** Confirm, or
   authorise the sharper labels.
4. **The currency split (§5), and the rate.** Three things to rule on, and the
   third blocks the draft:
   (a) the two composition rules I proposed — no ₹ inside a dated timeline
   event, and no ₹ on a per-token rate card regardless of vintage;
   (b) that the issue carries **one** rupee bracket, on the $1,500 cap in
   row 7, and that $2,180.16 / $200 / $36,000 carry none;
   (c) **the drafter needs the September 2026 USD/INR rate from you.** I have
   no web access, the rate is in none of the three input files, and the
   "about ₹1.3 lakh" in this storyboard is my own illustration at roughly
   ₹85–90 to the dollar, not a sourced figure. The rate and its month go on
   row 7's source line. Also rule whether the rate is September 2026 (when the
   conversion is being written, my recommendation) or June 2026 (the issue's
   `publishedAt`).
5. **Does ~$330,000 get a bracket?** It is a current-year compensation figure,
   so rule 4 says yes, and "about ₹2.9 crore a year" is the line that makes
   11% feel real to an Indian reader. Against: it is a Levels.fyi estimate
   quoted by a third party and explicitly not a company disclosure, so the
   bracket converts an estimate and adds a second layer of approximation.
   **My recommendation: in, in row 7's `equals` note, with the caveat in the
   same breath.** This is the only figure in the issue where I am genuinely
   undecided.
6. **The one Hindi word.** *hisaab*, once, in row 1's `note` (§5). It passes
   all four tests and it is the only place in a money-and-units issue where
   the precision test does not bar it. **No `hindi` field on any
   `jargon-buster` term**, which is where the component would invite one.
   Confirm, or rule the issue to zero Hindi, which changes nothing else.
7. **The Bloomberg confirmation (§8e).** The issue's title, hook and third quiz
   question all rest on one blogger's relay of a paywalled wire story the
   researcher could not reach. **I recommend no researcher pass** — a pass
   cannot get past a paywall. If you have Bloomberg access, confirm the cap
   wording and the "four months" claim before this ships. If not, guardrail 3
   stays in the EDITOR block and the issue publishes on the same footing it
   published on in June.
8. **Row 9 is the designated slack row, and it may be cut.** At 1,080 against
   1,100 the budget is tight. Cutting the closer takes the spine to eight rows,
   frees 90 words, and lifts visual share to 75%, at the cost of ending on a
   tile grid with no landing. **My recommendation: keep it**, and let it shrink
   to 60 words before anything else pays (§8g).
9. **`readTimeMinutes` 7 → 4.** Slug, `id`, `topic`, `publishedAt: 2026-06-04`,
   `status: published`, `tags` and all seven `sources[]` unchanged. The rewrite
   replaces `src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx` in
   place, wires `sourceRefs[]` on all nine sections (the verifier's optional
   improvement 1), rewrites the `EDITOR NOTES` block with all four published
   guardrails plus the two new ones in §8b, and is tabled for your read before
   it is committed.
