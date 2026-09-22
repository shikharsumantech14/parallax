# Storyboard: Football's new cap is *highest* for the richest

- **Category:** sports
- **Dossier:** research/sports/2026-09-17-premier-league-squad-cost-ratio-dossier.md
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

> **FRESH ISSUE, not a rewrite.** No published slug, no verification report, no
> `story:` block, no NUMBER-DRIFT exposure. The risk therefore sits entirely in
> the *new* numbers: two of the four drawn charts render figures the dossier
> built itself (a calculated ratio, a multiplication), and both carry mandatory
> caveats. §8 turns each into a named operator ruling. The dossier is
> `Status: ready-for-draft` with four unresolved items in its §9.1 — three of
> them are settled below by composition (the beat is dropped or bounded), and
> one (the IPL figures) is a ruling the operator must make before the draft
> runs, because it is the issue's Indian landing.

---

## 1. The argument in one line

The old rule capped every club's losses at the same £105m. The new one caps
spending at 85% of what each club earns, so the biggest earners get the
highest ceilings.

*(30 words. Dossier §1, §4.1.)*

---

## 2. The hero

**`scaling-plot`** · data shape **G10** (distribution, relationship,
uncertainty) · `layout: split` · row 6.

It renders dossier **§4.6** in full: seven clubs, revenue on the x axis, squad
cost as a share of revenue on the y axis, the fit drawn and falling. Liverpool,
Manchester City, Arsenal and Manchester United cluster on the right between
75% and 83%. Aston Villa sits at 98.7%, West Ham at 120.6%, Bournemouth at
124.7%. Seven points, one line through them, sloping down.

**Why this one carries the argument.** The issue's whole claim is about the
*denominator*. Every other figure in the spine describes a piece of the
system — where the league's money comes from (row 1), where each club's share
of it comes from (row 4), how much of it goes on wages (row 5). This is the
only figure in which the argument itself is a visible shape: as revenue rises,
the share a squad costs falls, so a single percentage line presses hard on the
small clubs and leaves the big ones room. A reader who looks at nothing else
gets the finding from the slope.

**What it is NOT, and this is load-bearing.** `y` is Parallax arithmetic —
(wages + player amortisation) ÷ revenue — over two sourced components per club.
It is **not** any club's filed Squad Cost Ratio, which no club publishes and
which cannot be reconstructed from the accounts (agents' fees are not disclosed
separately, and net profit on player sales belongs in the official denominator
and is not in the revenue line). The official ratio is **lower than every number
on this chart**, and lower by most at the clubs that sell most players. Dossier
§9.4 calls any appearance of the phrase "squad cost ratio" beside these seven
values a blocking flag, and this storyboard adopts that as a hard instruction:
the axis label, the caption, the `plain` line and the `howToRead` all say what
the number is. **The ranking is the claim. The level is not.**

**Layout.** CANON §2 says the hero should take `layout: split` and it is the
only row that may. Assigned. If the split column squeezes seven point labels at
1280, fall back to `wide` — see ruling 5.

**Considered and not chosen as hero:** `power-flow` (row 1) is hero-capable per
its catalog NOTES and is the better cold open, but it draws the *league
aggregate* and shows no per-club difference at all, so it carries the setting
and not the argument. `channel-ternary` (row 4) is fully sourced and would be
the safer hero, but it explains *why* the ceilings differ rather than showing
that they do, and the catalog pins it to `layout: default` (its table is the
identity layer, not a fallback), so it cannot take the hero's split.

---

## 3. The beats

Nine rows. No `prose`, no `paradox`, no `act-break`, no WebGL, no `bleed`.

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | The league takes in £6.8bn from three places, and nearly two-thirds of it walks straight back out as wages | G7 · flow, source → via → sink | `power-flow` **[NEW]** | — | **88** · no `intro` (see §4) | — (the figure opens cold) | AUTHORED: "Money flows left to right. Each band is one route, and a thicker band carries more." | §4.3 in full — 6 nodes, 5 links, unit `£m`, totals reconcile at 6800 both sides |
| 2 | You hear "cap" and picture one line for everybody; this one is drawn from each club's own income | G2 · the reframe | `you-think` | — | **118** · `intro` ≤ 24 (restates row 1) | Two families told to spend at most 85% of what they earn: same rule, different amounts | default (accurate, clean) — do not author | §4.1 (85% green line, PSR's £105m/3yr) + §1 (£590m vs £155m — see ruling 1) |
| 3 | The four words the rest of the issue needs, in plain English | G1 · narrative | `jargon-buster` | — | **100** · 4 terms, meanings ≤ 18 words each | The 85% sum lives inside the SCR gloss (see §4) | — (narrative kind; no plain line) | §4.1 + `research/_voice/jargon.md` (SCR · football revenue · amortisation · PSR) |
| 4 | Bournemouth's money is 82% the pot the league shares out; Manchester City's is half money they sell themselves | G6 · three shares summing to 100 | `channel-ternary` **[NEW]** | — | **130** · `intro` ≤ 30 (restates row 2) | — (the triangle is the explanation) | default (accurate, cross-world-safe) — do not author; **author `howToRead`** | §4.4 in full — 7 entities, all verified to sum to 1.000, three named streams |
| 5 | Wages alone already eat 87% of what Bournemouth earns, against a league average of 65% | G5 · ranking on one metric | `benchmark-chart` | — | **118** · `intro` ≤ 26 (restates row 4) | — | AUTHORED (the default ends "Longer is better", which is false here) | §4.5 in full — 7 items, `refValue` 65, `refLabel`, `sortDesc`, `maxValue` 100, 1 annotation |
| 6 | Add the transfer fees to the wages and the small clubs are already past the line the rule draws | G10 · relationship with a fit | `scaling-plot` | **HERO** · `layout: split` | **142** · `intro` ≤ 30 (restates row 5) | — | AUTHORED (the default is about model size and accuracy) | §4.6 in full — 7 points, `fit: true`, `logX/logY: false`, + §4.9 (Villa and the 70% UEFA rule) in the intro |
| 7 | The £948m of losses the rule answers did not come from wages, which barely moved | G3 · a few headline numbers | `data-readout` | — | **95** · `intro` ≤ 25 (the Villa worked instance) | Aston Villa's £17m profit rested on £114m from selling the women's team and property rights | default (accurate) — do not author | §4.2 (losses £135m → £948m, wages/revenue 64% → 65%, 8 clubs in profit from 13) + §4.8 (Deloitte on the £812m; the Villa instance) |
| 8 | The clubs voted this in themselves, and voted down the cap that would have narrowed the gap | G4 · dated sequence | `timeline` | — | **108** · 4 events, notes ≤ 12 words | — | default (accurate) — do not author | §3 rows 1, 2, 5, 6 + §4.1 (the 14-of-20 threshold) |
| 9 | A cap can be an amount instead, and the one you already know is: ₹151 crore, the same for all ten | G2 · peers, attribute by attribute | `comparison` | — | **110** · `intro` ≤ 24 · matrix form | The IPL auction the reader watched in December | default (accurate) — do not author | §4.7 (IPL ₹151 crore / ₹125 crore purse, ten franchises) + §4.1 (85% of your own) |

**Budget.** Head **72** + rows **1,009** = **1,081** reader-facing words, against
the 1,100 ceiling — **19 words of slack**. The per-row figures are caps on
*everything* the gate counts in that section: `eyebrow`, `title`, `intro`, every
`label`, `note`, `caption`, `plain`, `howToRead`, `source` and annotation text
(`check-prose.mjs:264` sums all collected strings, not just body prose).

**Designated slack, in the order it pays:** row 3 `jargon-buster` drops from
four terms to three (−24, and *amortisation* is the one that must survive); then
row 9 `comparison` drops from three rows to two (−30). Do not pay out of the
hero.

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

### 3a. The floors, checked row by row

| Floor | Required | This spine | ✓ |
|---|---|---|---|
| Sections | 6–12 (CANON §3) | 9 | ✓ |
| First row after the head is a graphic | not `TEXT_ONLY` | row 1 `power-flow` — a drawn graphic, not a card | ✓ |
| Visual share | ≥ 60% | 7 of 9 = **78%** (only rows 3 and 9 are `TEXT_ONLY`) | ✓ |
| Drawn graphics | ≥ 40%, ≥ 3 kinds | 5 of 9 = **56%**, 5 distinct kinds | ✓ |
| Plain-language cards | ≤ 3, one of each | 2 (`you-think`, `jargon-buster`) | ✓ |
| New graphic kinds | ≥ 2 | 2 (`power-flow`, `channel-ternary`) | ✓ |
| No two text-only rows adjacent | — | rows 3 and 9; rows 2, 4 and 8 are visual | ✓ |
| `prose` sections | ≤ 3 | 0 | ✓ |
| `paradox` | ≤ 1 | 0 | ✓ |
| A kind outside the six workhorses | ≥ 1 | 6 (`power-flow`, `channel-ternary`, `scaling-plot`, `benchmark-chart`, `you-think`, `jargon-buster`) | ✓ |
| Loud sections | ≤ 3, ≤ 1 per act, next one quiet | 1 (the hero at `split`), act B, followed by the quiet row 7 | ✓ |
| `layout: bleed` | ≤ 1 per act | 0 | ✓ |
| Two WebGL kinds adjacent | never | 0 WebGL kinds | ✓ |
| `timeline` events | ≤ 6 | 4 | ✓ |
| Words before the first graphic | ≤ 80 | **78** (head 72 + row 1's eyebrow 2 + title 4, no intro) | ✓ |
| Reader-facing words | ≤ 1,100 | **1,081** | ✓ |
| Names | ≤ 12 | 8 named, ~10 on the heuristic (§7) | ✓ |

### 3b. Acts and the quiet sections

No `act-break` sections. All five register-era rewritten issues use none, and
each one added here would be a `TEXT_ONLY` row costing every share above. The
acts are implicit, marked by `layout`:

- **Act A · rows 1–3** — the money, the reframe, the words. Quiet: **row 3**,
  `layout: breath`.
- **Act B · rows 4–7** — the evidence. Loud: **row 6**, the hero at `split`.
  Quiet: **row 7**, `layout: breath`, which is also the eye-rest CANON §3
  requires immediately after a loud section.
- **Act C · rows 8–9** — how it passed, and the cap that is an amount. Quiet:
  **row 9**, `layout: breath`.

Every other row is `layout: default`. `channel-ternary`'s catalog block pins it
to `default` and bars `bleed`; honour that.

### 3c. Per-row copy requirements the drafter must not improvise

| # | Kind | `plain` | `howToRead` | Annotation | Restates |
|---|---|---|---|---|---|
| 1 | `power-flow` | **AUTHOR** | **AUTHOR** (in `NEEDS_HOW`) | none available | — |
| 2 | `you-think` | default | none (not in `NEEDS_HOW`) | none available | row 1 |
| 3 | `jargon-buster` | none (narrative) | none | none | row 1's finding, in the SCR gloss |
| 4 | `channel-ternary` | default | **AUTHOR** (in `NEEDS_HOW`) | none available | row 2 |
| 5 | `benchmark-chart` | **AUTHOR** | none | **1** (§4.5) | row 4 |
| 6 | `scaling-plot` | **AUTHOR** | **AUTHOR** (in `NEEDS_HOW`) | **2** (§4.6 + one descriptive) | row 5 |
| 7 | `data-readout` | default | none | none available | row 6 |
| 8 | `timeline` | default | none | **1** | row 7 |
| 9 | `comparison` | default | none (narrative) | none | row 8 |

**The four authored `plain` / `howToRead` fields are not style preferences.**
Each default in `src/lib/explainers.ts` is either factually wrong for this issue
or carries banned punctuation. See §8, "EXPLAIN defaults that must be
overridden" — that subsection is the one an operator should read before
approving.

**There are no `prose` sections**, so `check:prose`'s `NO-RESTATEMENT` and
`NO-ANALOGY` never fire (both scan `prose` sections only). The register still
requires both. The restatement column above is therefore a hard instruction,
not a gate artefact, and the analogy is fixed at row 3 (two families, one 85%
rule, different amounts). `skimCaption` applies to `kind: prose` only, so this
issue carries none.

### 3d. The data payloads, row by row

**Row 1 · `power-flow`** — dossier §4.3, the **five-link two-sink** version.
Nodes: `matchday` / `broadcast` / `commercial` (group `source`) →
`revenue` (group `via`) → `wages` / `rest` (group `sink`). Links: 1000, 3400,
2400 in; 4400, 2400 out. Unit `£m`. Sources sum 6800, sinks sum 6800, the `via`
node balances exactly, so the build's conservation check passes and no
`imbalance` flag is needed.

**Take the two-sink version, not the optional three-sink variant.** The variant's
"other operating costs 2137" is derived by subtraction and is not a Deloitte
line item; the two-sink `rest` of 2400 is exact. The drawing rule applies to
matchday: Deloitte reports "exceeded £1bn", a floor and not a point figure, so
**draw 1000 and put "more than" in the caption**.

**Row 4 · `channel-ternary`** — dossier §4.4, all seven entities, corners in
`[l, t, r]` order `Matchday · Broadcast · Commercial`. Every row verified to sum
to 1.000. **The caption must say the split is of the three named streams**, not
of stated total revenue: three clubs report a small "other" line (Aston Villa's
streams sum to £370m against a stated £378m, an £8m gap, the largest). The plot
carries no dot labels by design; the table below it is the identity layer.

**Row 5 · `benchmark-chart`** — dossier §4.5, all seven items, `sortDesc: true`,
`maxValue: 100`, `unit: '%'`, `refValue: 65`, `refLabel: 'Premier League
average, 2024/25'`. Annotation at `Bournemouth`: *"Highest wage share. Smallest
revenue."* **Do NOT draw the 85% line on this chart** — 85% applies to squad
costs, which include amortisation and agents' fees, not to wages alone. The 65%
Deloitte average is the only honest reference line here.

**Row 6 · `scaling-plot`** — dossier §4.6, all seven points, `fit: true`,
`logX: false`, `logY: false`. `xLabel: 'Revenue, 2024/25 (£m)'`.
`yLabel: 'Squad cost as a share of revenue (wages plus player amortisation)'` —
the long form, verbatim, because the short form is the false claim. Annotations:
at `Bournemouth`, *"Smallest revenue. Highest ratio. Same rule."* (the dossier's
own suggestion); at `Arsenal`, *"Biggest earners sit furthest below the line."*
(descriptive of the plotted values, ≤ 12 words). Maximum 3 allowed; 2 proposed.

**Row 7 · `data-readout`** — four tiles from §4.2, `emphasis: 'key'` on the
first and nowhere else:

| value | label | note | emphasis |
|---|---|---|---|
| `£948m` | Pre-tax losses, 2024/25 | Up from £135m the season before | `key` |
| `65%` | Wages as a share of revenue | It was 64% the season before | — |
| `8` | Clubs in operating profit | Thirteen managed it the year before | — |
| `£6.8bn` | Total revenue | A record, and up 8% | — |

A `value` that is a plain integer counts up; `8` will animate and the three
formatted values will render verbatim. That is correct and wanted.

**Row 8 · `timeline`** — four events, dossier §3:

| date | label | state |
|---|---|---|
| 2024 | Clubs agree to **explore** a hard cap | `default` |
| 21 Nov 2025 | Squad Cost Ratio approved. The hard cap fails | `key` |
| 8 Jul 2026 | Deloitte counts £948m of losses | `key` |
| 2026/27 | The rule binds. PSR is gone | `now` |

Annotation at the 21 Nov 2025 event: *"The cap that would have narrowed the gap
failed here."* (10 words.) Event 1's label must say **explore** — its 16–3 count
belongs to a vote on whether to *investigate* anchoring, and dossier §9.1 warns
that conflating vote counts here is the single easiest damaging error in this
issue. Event 4's note carries the levy timing (levies first payable 2027/28).

**Two timeline rows deliberately dropped:** the 28 Nov 2025 Swiss Ramble
publication (a commentary date, not an event) and the EFL Championship's 20–4
vote of May 2026. The second is dropped **because** it is tempting: §9.1 names
it as the count most likely to be mistaken for the Premier League's own, and it
would also spend a name slot on a competition the issue otherwise never
mentions.

**Row 9 · `comparison`** — the **matrix** form (`sides` + `rows`), not the list
form. The rows genuinely pair up, which is what the matrix form is for. Two
sides only: *Premier League, from 2026/27* and *IPL, 2026*. Three rows: what the
cap is · whether it is the same number for everyone · what happens when you earn
more. Subject to ruling 3 — the IPL figures are only partially verified.

---

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  `Football's new cap is *highest* for the richest`
  *(8 words. The one italic accent is `*highest*`. No "The ‹Noun› That ‹Verb›s".)*

- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  `You hear "cap" and picture one line for everybody. This one is 85% of what each club earns. Manchester City gets £590m, Bournemouth £155m.`
  *(24 words. Sentence lengths 9 / 9 / 6 — no three consecutive under eight, so
  `STACCATO` does not fire. **The middle sentence must not be shortened.** No
  em-dash, no semicolon, no colon. The two figures are subject to ruling 1 and
  must read "about £590m" and "about £155m" if the drafter has room; if not, the
  hedge moves to the `you-think` caption, which is where the verifier traces it.)*

- **Dek (≤ 14 words):**
  `The old rule capped a loss. The new one caps a share.`
  *(12 words. No Hindi — see §5 for why this issue carries none.)*

- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  `A Premier League club may now spend 85% of its own revenue on its squad. Every club therefore has its own ceiling. You will see whose sits highest.`
  *(28 words, ~157 characters — inside the 80–420 Zod bounds.)*

**Head total: 72 words.** Row 1 then adds `eyebrow` (2 words) + `title`
(4 words) and **carries no `intro`**, giving **78 words before the first
graphic** against the cap of 80. The gate adds the head *plus* section 1's
eyebrow, title and intro before it stops, so row 1's missing intro is what buys
the margin. Row 2's intro does the restating work instead.

Suggested row 1 chrome: eyebrow `THE MONEY`, title `£6.8bn in. £4.4bn out.`
Any longer and the head must come down to compensate.

---

## 5. The Indian ground

The issue's Indian ground is **structural, not a conversion**: India already
runs the counter-design, and the reader has watched it happen on television.

| What | Dossier row | How it is used |
|---|---|---|
| **IPL 2026 salary cap ₹151 crore per franchise**, of which ₹125 crore is the auction purse. Identical for all ten franchises. | §4.7 | Row 9, the landing. The whole comparison rests on the cap being **one amount for everybody**, which is exactly what 85%-of-your-own is not. **[PARTIAL — ruling 3]** |
| At the December 2025 auction one franchise went in with **₹2.75 crore** left of its ₹125 crore while another still had **₹64.3 crore** | §4.7 | Row 9's third comparison row, and the sharp end of it: under an amount cap, the gap between two franchises is one they *created by spending*, not one the rule *granted them*. Describe the franchises, do not name them (§7). **[PARTIAL — ruling 3]** |
| **ISL squad salary cap ₹16.5 crore**, 2021-22, up to three Under-23 home-grown players excluded, squad maximum 35 | §4.7 | The fallback for row 9 if ruling 3 goes against the IPL figures. **HISTORICAL — the sentence must carry "in 2021-22".** |
| **Bengaluru FC losing about ₹25 crore a season**, per the then chief executive | §4.7 | Not used. 2020-21 reporting, pandemic-affected, and it would spend a name slot for an order of magnitude the issue does not need. Available to the operator as a one-line scale note if row 7 runs short. **HISTORICAL — date it in the sentence.** |

### The currency rule, applied

**Every £ figure in this issue is historical** — 2024/25 accounts, a 2025 rule
vote, a rule threshold set in 2025. Under `_voice-core.md` §3 rule 4 a
historical figure stays in its own currency and is **never** converted at
today's rate. **So this issue carries no ₹ bracket beside any £ figure, and the
drafter must not add one.**

The one current-rule figure that would need a bracket is the **£6.5m per
additional point** sanction above 115%. The dossier carries **no sourced FX
rate** (§9.1 item 4) and no allowlisted sports source provides one. **The exact
figure is therefore not stated.** Where the sanction appears — the
`jargon-buster` SCR gloss is the only place it might — it reads *"six points,
and another point for every few million over"*. Inventing a rate is the failure
mode; leaving the figure out is the fix.

**No £→₹ comparison may be manufactured anywhere**, including the tempting
"£948m is about N IPL salary caps". That is cross-currency arithmetic with no
rate, on the issue's headline number. The contract's 2026-09-14 amendment
already counts an Indian habit (cricket) as Indian ground, and row 9 supplies
it.

### Hindi

**None, deliberately.** This issue is almost entirely precision layer — currency
figures, ratio thresholds, accounting terms, rule names — where L1 plain Indian
English is the only level allowed. The few prose fields that could take an L2
word all sit within a sentence or two of a number or a technical term, which
fails the fourth test. `_voice-core.md`: *when in doubt, leave it out.* The dek
carries no Hindi and does not need to; rule 12's "the dek carries the Hindi if
the title has none" is conditional on there being any.

---

## 6. The three questions

Written from the dossier. The reader panel answers these from the draft alone.

1. **Q:** Under the new rule, how much may a Premier League club spend on its
   squad?
   **A:** 85% of its own football revenue plus net profit on player sales.
   "Squad" means player and head-coach wages, agents' fees, and transfer fees
   spread over the years of the contract. Because the 85% is taken from the
   club's own income, the limit is a different number at every club.
   · *dossier §4.1 (green threshold, what counts as squad costs)*

2. **Q:** Why does the same 85% give Manchester City a far bigger budget than
   Bournemouth?
   **A:** Because it is 85% of *their own* revenue, and the revenues are not
   close. City earned £694m in 2024/25 and Bournemouth £182m. The kind of money
   differs too: 81.5% of Bournemouth's came from the broadcast pot the league
   shares out nearly equally, while 49% of City's came from commercial deals
   City sells itself.
   · *dossier §4.4 (the seven-club split), §1 (the two ceilings)*

3. **Q:** The rule is meant to answer £948m of losses. Where did those losses
   come from?
   **A:** Not from wages. Wages went from 64% to 65% of revenue in the same
   season the losses rose sevenfold. Deloitte says most of the £812m increase
   came from decisions about selling players and other club assets — the very
   activity the new rule's numerator counts.
   · *dossier §4.2 (the aggregates), §4.8 (Deloitte on the £812m)*

**Considered as a third question and not chosen:** *"What would a cap that is
an amount do differently?"* It is the issue's closing move and row 9 teaches it,
but it asks the reader to reason about a counterfactual rather than to recall
what the issue showed. Question 3 above is the harder one to get from the draft
and the one most likely to expose a draft that has become an explainer of a
rule. If the operator prefers the IPL question, swap it in for question 3 and
strengthen row 9's budget by the 20 words row 7 would release.

---

## 7. Names

Eight named, each with the role phrase that introduces it. The dossier's §4.10
ledger runs to exactly twelve with zero headroom; this spine spends eight and
keeps four in reserve.

1. **Premier League** — the league that runs England's top division and writes
   its own financial rules.
2. **Bournemouth** — the smallest earner among the seven clubs whose accounts
   this issue reads.
3. **Manchester City** — the league's biggest commercial earner.
4. **Aston Villa** — the club whose 2024/25 profit came from selling assets
   rather than from football.
5. **Deloitte** — the accountancy firm whose annual review is football's
   standard set of books.
6. **The Swiss Ramble** — Kieron O'Connor, who has read every English club's
   published accounts line by line for over a decade.
7. **UEFA** — European football's governing body, which runs its own tighter
   version of the same rule, at 70%.
8. **IPL** — the Indian Premier League, whose salary cap is one amount for all
   ten franchises.

The heuristic name counter may read "Kieron O'Connor" as a ninth and "Indian
Premier League" as a tenth. Ten against a cap of twelve is comfortable.

**Described, never named:** the EFL Championship; CIES Football Observatory;
Tim Bridge (unless ruling 7 restores the Deloitte quote); the two IPL
franchises in row 9 ("one franchise… another…"); Nassef Sawiris and Liverpool's
chief financial officer (both reach the dossier second-hand and are barred by
the quote-attribution fallback).

**Liverpool, Arsenal, Manchester United and West Ham appear only as chart
labels** — in `channel-ternary`'s `entities[].name`, `benchmark-chart`'s
`items[].label` and `scaling-plot`'s `points[].label`. The dossier's §4.10 asked
the composer to confirm this reading against `check:prose`. **Confirmed from the
source:** `scripts/check-prose.mjs:400` builds the name set from body keys
(`note`, `text`, `detail`, `lead`, `paragraphs`, `followup`, `statement`,
`kicker`, `headline`, `desc`, `bullets`) plus `title`, `hook`, `dek`, `primer`
and `caption` only. `label` and `name` are not among them, so chart labels cost
no name slots.

**The consequence, stated honestly:** a *reader* still meets eleven club names
on the page. If the operator judges that too many, the lever is ruling 8, not
the prose. And a hard instruction follows from the same mechanism: **timeline
`note` and `data-readout` `note` fields ARE name-scored**, so no club outside
the eight above may be named in one.

---

## 8. Composer notes

### 8.1 Rulings the operator should make before the draft runs

**Ruling 1 — the £590m and £155m ceilings (arithmetic, not a fact).**
Dossier §1 asserts both. Each is 85% × that club's sourced 2024/25 revenue
(£694m → £589.9m; £182m → £154.7m). It is a *computation* on two sourced
figures, not a new fact, but it is the only arithmetic the composer is putting
in the head. Two things make it honest: it **understates** both ceilings,
because the official denominator adds net profit on player sales, and the
*ratio* between them (about 3.8×) is exactly the revenue ratio and so is fully
sourced. **Recommendation: approve, with "about" on both figures**, and with the
`you-think` caption stating that the real ceiling is higher at both clubs
because player-sale profit adds to the base. The figures appear in the hook and
in row 2, and nowhere else.

**Ruling 2 — the 14–6 vote count is dropped.** Dossier §9.1 item 1: no
allowlisted source gives the split, the Premier League's own statement omits it
deliberately, and the one 20-vs-4 count in circulation belongs to the EFL
Championship. This spine follows the dossier's recommendation and leads on the
threshold instead, which is fully T0-sourced: *a rule change needs fourteen of
the twenty clubs, and this one got them*. `vote-result` stays unavailable. **If
the operator finds an allowlisted report of the split**, `vote-result` becomes
an excellent sixth drawn graphic and row 5 (`benchmark-chart`) is the row to
swap out for it — the wages picture is the most dispensable of the four charts.

**Ruling 3 — the IPL figures, and this one blocks the draft.** ₹151 crore /
₹125 crore and the two auction purses are `[PARTIAL]`: ESPNcricinfo returned
403 to three direct fetches and the figures come from two independent
search passes. **This is the issue's Indian landing and its entire closing
move**, so unlike the other partials it cannot be routed around. The operator
has browser access where the crawler did not; thirty seconds settles it. If the
figures do not hold, row 9 falls back to the ISL's ₹16.5 crore squad salary cap
(2021-22, dated in the sentence), which is weaker — it is a smaller number, it
is historical, and it does not carry the auction-purse detail that makes the
point.

**Ruling 4 — no FX rate, so no £6.5m.** See §5. The sanction is stated without
its per-point figure. Approving this ruling is approving a *weaker* sentence on
purpose.

**Ruling 5 — the hero's layout.** CANON §2 says the hero should take
`layout: split` and it is the only row permitted to. Assigned. The risk is
specific: `scaling-plot` is a VizCard instrument with an axis toggle and seven
point labels, and `split` narrows its column. `dataviz-v2.css` gives the
scaling charts a `min-width` equal to their own coordinate width so the card
scrolls rather than shrinking the type, which should hold — but it has not been
tested inside `split`. **Fallback: `wide`.** Either way the issue then carries
zero or one loud section, well inside the CANON §2 ceiling of three.

**Ruling 6 — `benchmark-chart` (row 5) against `data-readout` (row 7).** Both
earn their rows, but if only one may stand, the composer keeps row 7. Row 5
shows wages per club against the 65% league average; row 7 carries the £948m,
the 64→65% wage move and the drop from thirteen clubs in operating profit to
eight — which is the beat the *dossier's own §7 structure never gave a row*,
despite §1 naming it as the thing the issue turns on. Swapping them in either
direction keeps every floor (row 5 is a drawn graphic, row 7 is a card, so
cutting row 5 takes drawn graphics to 4 of 9, still 44%).

**Ruling 7 — no `quote` row.** Two quotes were considered and neither is
carried. **Tim Bridge / Deloitte**: the extract as fetched contains an ellipsis
inside the quotation, which is a verifier flag; carrying it needs someone to
re-read the release and lift the unbroken sentence, and it spends a ninth name
slot. **Kieron O'Connor / The Swiss Ramble** — *"higher revenue would still help
clubs to meet the squad cost control ratio, though the spending cap would ensure
that they don't enjoy too much of an advantage"* — is the issue's own argument
in a named expert's words, and it is *about the anchoring proposal the clubs
voted down*, which makes it sharper rather than weaker. It was cut on budget
alone. **Cost to restore: ~30 words in row 8's intro**, verbatim and attributed
to O'Connor, paid for by the slack in §3 plus one of the designated slack rows.
The composer's recommendation is to restore it if ruling 3 goes well and row 9
does not need the reserve.

**Ruling 8 — eleven club names on the page.** See §7. If that is too many, cut
Manchester United and West Ham from `channel-ternary`; five entities still
clears the kind's 4–12 floor. **The cost is specific and real**: Manchester
United's 24.0% matchday share is the sharpest single contrast in the issue
against Bournemouth's 3.7%, and removing it makes the triangle a story about
broadcast money alone. The composer recommends keeping all seven.

### 8.2 EXPLAIN defaults that must be overridden — read this one

Four of the six `EXPLAIN` defaults this spine would otherwise inherit are wrong
for this issue. Checked against `src/lib/explainers.ts`, not the catalog's PLAIN
lines, because the two differ.

| Kind | Default | Why it cannot stand |
|---|---|---|
| `scaling-plot` | *what*: "How performance changes as something grows — for example, model size against accuracy — plotted on a scaling curve." · *how*: "Up-and-to-the-right means it keeps improving as it scales." | Written for its home world. The `what` describes a different chart entirely and carries **two em-dashes**. The `how` **inverts this chart's finding**: here the line runs down and to the right, and the clubs up and to the left are the ones under pressure. **Author both.** |
| `benchmark-chart` | *what*: "Scores compared as horizontal bars, with a reference line for context. **Longer is better.**" | Longer is a bigger wage share. Here longer is worse. **Author `plain`.** |
| `power-flow` | *what*: "Money flows left to right **—** every band is one route…" · *how*: "Follow any band from its source to where it lands**;** the values are marked mid-stream." | Accurate, but the `what` carries an em-dash and the `how` a semicolon, both barred in reader-facing prose (contract §6, tells 1 and 18). **Author both**, same meaning, plain punctuation. |
| `channel-ternary` | *how*: "**Press a dot** or a table row for the three exact shares. A dot near an edge means…" | Opens with the control. The instrument rule is that the static reading leads and the control clause trails, because controls are `html.js`-gated and the paragraph is not. **Author `howToRead`**; the `what` default is accurate and clean, so leave it. |

`timeline`, `data-readout` and `you-think` defaults are accurate here. Leaving
them unauthored is also free against the word ceiling — the gate counts
frontmatter strings, not rendered defaults — though the reader still reads about
twenty words per panel, and the budgets in §3 are honest about the page rather
than about the gate.

### 8.3 Kinds considered and rejected

| Kind | Why it was wanted | Why it is not available |
|---|---|---|
| `vote-result` | Shape-perfect for G3: for, against, required 14, and a shortfall of zero as the finding | The 14–6 split is `[UNVERIFIED]` (§9.1). Do not draw an unverified count. **Unblocked by one allowlisted report of the split** — see ruling 2 |
| `margin-bullets` | The candidate proposed it as a compliance dashboard | Wrong shape twice over. The catalog wants 4–8 measurements **in units that do not compare** and sends same-unit values to `benchmark-chart`; four percentages on one scale is the literal DON'T USE. And three of four rows are unsourceable — SSR's Working Capital and Liquidity tests publish no club-level values and no club's filed SCR is public, so building it means inventing `required` / `max` pairs. **Unblocked by** UEFA's ECFIL club-level PDF, which §9.3 says was not retrieved |
| `league-table` | Never published, and a wages-against-points chart would be the strongest possible version of row 5 | The 2024/25 final table renders client-side on `premierleague.com` and could not be retrieved (§9.3). **Unblocked by** the operator pasting the final table — and it would also unblock a wages-vs-points `scaling-plot`, which is a better chart than the one this spine has |
| `attrition-waffle` | Never published; "eight clubs in operating profit, down from thirteen" looks like a rate | Needs a rate out of exactly **100**. Eight of twenty does not normalise without five squares per club, which destroys the countability the kind exists for, and the build throws on a bad sum. The beat lives in row 7's third tile instead |
| `number-sense` | The obvious home for £948m, and it would have made the plain-card count 3 | Its `equals[]` lines are claims the verifier traces, and **the only equivalents available are in rupees** — which ruling 4 bars, since no FX rate is sourced. A `number-sense` with no `equals` is not the kind. The £948m sits in row 7's accented tile |
| `three-steps` | The dossier's §7 proposed it for the 85% sum, and it is the standard register move | It is `TEXT_ONLY`, and the dossier's own §7 puts it **immediately after `jargon-buster`**, which is also `TEXT_ONLY` — a `PROSE-RUN` flag in the suggested structure as written. Cutting it bought row 5, a fifth drawn graphic. **The sum survives inside the `jargon-buster` SCR gloss**, which is where `research/_voice/jargon.md` already writes it: *"…as a share of its football revenue plus profit on player sales; 85% is the green line"* |
| `quote` | The O'Connor line is the issue's argument in a named expert's words | Word budget. Ruling 7 prices the restore at ~30 words |
| `analogy` | The two-families mapping | Would be a third `TEXT_ONLY` row and the second one adjacent to row 3. The mapping sits inside row 3's intro instead, which is the recurring right answer |
| `city-compare` | Two entities with a winner per row, for the IPL contrast | It is for two **places** with travel stats. `comparison`'s matrix form is the correct kind for two rule regimes |

### 8.4 Corrections this spine makes to the dossier's suggested §7 structure

The dossier's §7 is nine good sections with three composition defects. Recording
them so the operator sees the changes were deliberate:

1. **It opens on a card.** §7 row 1 is `you-think`, and §7 flags this itself.
   Taken its recommended way out: `power-flow` opens, `you-think` moves to row 2
   as the pivot. (Worth noting the two are equivalent for the
   words-before-the-first-graphic gate — the counter stops at the first
   non-`TEXT_ONLY` section either way, and `you-think` is not `TEXT_ONLY` — so
   this was decided on the template's "a graphic or a `data-readout`" wording and
   on the fact that the money geography is the better cold open, not on the
   arithmetic.)
2. **Rows 3 and 4 are adjacent text-only sections.** `jargon-buster` →
   `three-steps` fires `PROSE-RUN`. Resolved by cutting `three-steps` and
   folding the 85% sum into the SCR gloss.
3. **§4.8 has no row, and §1 says the issue turns on it.** The £948m, the
   64→65% wage move and Deloitte's line about transaction decisions are the
   evidence that the rule is aimed at the wrong thing. Row 7 (`data-readout`)
   is new here and carries it, with Aston Villa's £114m of asset-sale gains as
   the concrete instance the register requires beside an abstraction.

One thing the dossier got right that is easy to miss and is kept: **`timeline`
counts as a drawn graphic** by `check:prose` (`isGraphic` excludes only the
`TEXT_ONLY` set and the three card kinds). The dossier's §7 calls it
"supporting, not counted as drawn", which is the stricter reading. This spine
clears the 40% floor on **both** readings — 5 of 9 with the timeline, 4 of 9
without — so the operator does not have to settle which reading is right.

### 8.5 Sourcing

Not the composer's gate, but it carries: the dossier reports **24 sources, 12
publishers, 5 tiers, top publisher 37.5%** against floors of ≥ 8 sources, ≥ 5
publishers and no publisher above 40%. `SOURCE-NARROW` will not fire. The Swiss
Ramble's 37.5% is close to the ceiling and is structural, not lazy — Deloitte's
Money League publishes top-20 totals but no per-club three-way splits, so rows
4, 5 and 6 can only be built from club-by-club accounts. If the operator wants
that share down, the lever is the UEFA ECFIL PDF, which would add a T0 publisher
to exactly those rows.

---

## 9. Kind ledger

"New" means on the ledger in `docs/generated/PROJECT-GRAPH.md` ("Never in a
published issue — 76 of 101") **and** not claimed by another storyboard dated
within the last 30 days. All eight sibling storyboards were checked: `power-flow`
appears in two of them and `channel-ternary` in one, in every case in a "kinds
considered and rejected" table. **Neither is claimed by any storyboard in this
round.**

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `power-flow` | 1 | **yes** | **yes** — G7, a flow table with 5 links, 3 layers and totals that reconcile at 6800 |
| `you-think` | 2 | no — typographic card | n/a (card) |
| `jargon-buster` | 3 | no — `TEXT_ONLY` card | n/a (card) |
| `channel-ternary` | 4 | **yes** | **yes** — G6, 7 entities across three shares each summing to 1.000 |
| `benchmark-chart` | 5 | **yes** | no |
| `scaling-plot` | 6 · **HERO** | **yes** | no |
| `data-readout` | 7 | no — typographic card | n/a (card) |
| `timeline` | 8 | **yes** | no |
| `comparison` | 9 | no — `TEXT_ONLY` | n/a |

- **Drawn graphics:** **5 of 9 rows (56%)**, floor 40% ✓ · distinct graphic
  kinds: **5** (`power-flow`, `channel-ternary`, `benchmark-chart`,
  `scaling-plot`, `timeline`), floor 3 ✓
  · *On the stricter reading that excludes `timeline`: **4 of 9 (44%)**, 4
  kinds. Clears the floor either way.*
- **Plain-language cards** (you-think · number-sense · jargon-buster ·
  three-steps): **2** — `you-think` ×1, `jargon-buster` ×1. Cap 3, one of each ✓
  (`number-sense` and `three-steps` unused; see §8.3 for why each was dropped)
- **New kinds:** **2**, floor 2 ✓
  - `power-flow` — G7, money flowing source → via → sink. Fills the "where does
    the league's money come from and go" beat, which no ranking or share kind
    can draw because it is a *routing*, not a composition. The issue's own world
    does not own a flow kind, so this is the cross-world pick.
  - `channel-ternary` — G6, entities split across exactly three shares summing
    to 100. Fills the "why the ceilings differ" beat. **The sports desk's own
    signature kind**, taken first as the brief asks, and the dossier captured
    its data to the ±0.001 build tolerance for exactly this purpose.
- **Card-vs-graphic honesty check:** the three card rows (2, 7 and the
  `TEXT_ONLY` 3 and 9) are 4 of 9. Every one of the issue's four load-bearing
  numeric claims — the league's money, where each club's money comes from, what
  wages take, what squad costs take — is carried by a drawn graphic, not by a
  card.
