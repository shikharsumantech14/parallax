# Storyboard: Arsenal won the league from the *corner flag*

- **Category:** sports
- **Dossier:** research/sports/2026-06-04-arsenal-set-piece-title-dossier.md
- **Rewrites:** src/content/issues/2026-06-04-arsenal-set-piece-title/index.mdx (published; slug and all six `sources[]` unchanged)
- **Composed:** 2026-09-13
- **Composer:** composer-agent
- **Status:** draft            ← draft | approved | hold  (the gate; see below)

> **This is a REWRITE, not a new issue** (`docs/REGISTER-PLAN.md` §8.1, the
> flagship set under RG-14). The slug, the six sources and every fact stay; the
> composition and the register change. **No new claim enters.** One currency
> conversion and two subtractions are computations, not facts — each is flagged
> in §5 with its basis and its rate for the operator to rule, and the source
> line would name the rate.
>
> The published issue's four measured defects (REGISTER-PLAN §8.1 and the brief):
> **zero Indian anchoring** — no ₹, no Indian comparison, no Indian place;
> **607 words before the first graphic**; **xG, set piece and open play arrive
> unglossed**; **15 names**, eleven of them player labels inside one component.
> All four are fixed by composition below, not by patching prose.
>
> The verification report (`…-verification.md`, **NEEDS REVISION**) is read as a
> constraint. Required fixes #1, #2 and #3 are resolved by cutting or restripping
> the sections that carry them (§8a); #4 is resolved by a shorter primer; #5 —
> the seven `# EDITOR:` Opta flags — is the operator's standing decision and
> rides forward unchanged.
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

Arsenal ended a 22-year wait by giving the ball away and scoring from corners.
The decisive goal moved off the highlight reel and onto the dead ball.

*(27 words. Dossier §1, restated at L1.)*

---

## 2. The hero

**`shot-map`** · data shape **G12** (spatial field on a playing surface) · row 6 ·
`layout: wide`.

It is the only component in the issue that *shows* the title's finding. A tile
can say "19 goals from corners"; only the map shows you fifteen goal-marks piled
into the same few square yards in front of the net, with the open-play attempts
scattered thin and far behind them. The reader does not have to be told the
goals came from restarts — the picture is the shape of a six-yard box.

**Dossier §4 / published data it renders** (carried over verbatim from the
published issue, which the verifier traced):

- All twenty `shots` entries — fifteen `goal` marks clustered x≈36–64 / y≈6–24,
  five non-goal attempts spread wider and deeper — unchanged, **except** the
  verifier's optional fix: the lead shot's `xg: 0.7` moves to `0.68` so it
  cannot be read as the reserved Champions League per-game xGA of 0.7 that
  dossier §4 tells us to keep distinct.
- `caption` and `source` unchanged. **The source line is load-bearing:**
  *"Illustrative; positions schematic. Goal and corner totals per Opta;
  set-piece share per Coaches' Voice. Not per-shot event data."* The aggregate
  totals it stands on — 25 set-piece goals, 19 from corners — are dossier §4,
  *The set-piece record*.
- `shot-map` has **no `annotations[]` slot** (RG-20 wired eight kinds; this is
  not one). The finding is stated by the caption and by the intro.

**The honesty problem, stated plainly.** The positions are schematic, not
tracked event data — dossier §9 says no per-shot coordinates are sourceable from
any allowlist source, and the verification report logged it ⚠️ IMPRECISE.
Promoting a schematic figure to hero raises the prominence of the issue's
weakest provenance. **This is operator ruling 1** (§8e), with two fully-anchored
alternatives named there.

Rejected as hero: `benchmark-chart` (real data, but it draws the *other* half of
the argument and four bars is thin at hero scale), `match-stat-line` (fully
anchored and hero-capable, but it is the closing proof, not the thesis),
`tactics-pitch` (also schematic, and an instrument), `flight-of-the-ball` (the
desk's flagship, blocked for want of data — §8b).

`wide`, not `split`: the hero is the only row that *may* take `split`, but
`split` is the sticky layout and wants ~120 words of prose held beside the
graphic, which this issue deliberately does not have — its explanation lives in
rows 5 and 7 as separate, countable components. `wide` gives the goal frame the
size it needs. Ruling 2.

---

## 3. The beats

Ten rows. **Seven of ten visual (70%)**, floor is 60%. The three text-only rows
(2 `jargon-buster`, 5 `three-steps`, 10 `prose`) are never adjacent. The first
row after the head is a VizCard figure, not prose. One `prose` (floor allows 3).
Zero `paradox` (ceiling 1). **Eight kinds from outside the six workhorses** —
`you-think`, `jargon-buster`, `benchmark-chart`, `three-steps`, `shot-map`,
`number-sense`, `tactics-pitch`, `match-stat-line` — against a floor of one.
Zero WebGL, zero `bleed`, one `wide` (the hero): no loudness ceiling is
approached.

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | You think a long wait ends when a team finally gets *better*. Arsenal won by scoring nineteen goals from corners. | G2 · one belief corrected by one figure | `you-think` | — | intro ≤ 10 · `think` ≤ 24 · `actually` ≤ 22 + value · note ≤ 13 · caption ≤ 13 · source ≤ 10 · **92** | — (the figure does the work; the analogies start at row 2) | "Two panels: on the left what most people assume, on the right what the numbers show, with the one figure that settles it." (catalog default — **do not author**) | *The set-piece record* → 19 corner goals, record, previous high 16; §2 three consecutive runners-up (AL); §4 27 conceded |
| 2 | Four words first: xG, set piece, open play, and the one number behind "they sat off". | G1 · narrative | `jargon-buster` | — | intro ≤ 12 · 4 × meaning ≤ 18 · 1 `hindi` ≤ 8 · **95** | **The penalty corner in hockey** carries "set piece" — India's own game, a dead-ball restart you drill. *mauka* carries xG. | — (narrative kind; no plain line) | *Set pieces — the conceptual frame* (25–33% of all goals, the definition); *PPDA against 18.05* (the term); the xG readings in §4 |
| 3 | What the boring season actually measured: fewest conceded, most from restarts, 238 nights top. | G3 · a few headline numbers | `data-readout` | — | intro ≤ 25 · **6 tiles** × (label ≤ 7 + note ≤ 9) · caption ≤ 8 · source ≤ 10 · **120** | — | "A grid of instrument tiles; each shows one number and its label, and the accented tile is the headline reading." (catalog default — **do not author**) | 27 conceded · 28.5 league xGA · 25 set-piece goals · 19 corner goals · 238 days / 200 consecutive · 19 May clinch, City 4 points behind |
| 4 | Nobody else let the ball go this freely — and the gap to second is not close. | G5 · entities ranked on one metric | `benchmark-chart` | — | intro ≤ 22 · 4 labels ≤ 10 · **1 annotation ≤ 10** · caption ≤ 18 · authored `plain` ≤ 26 · source ≤ 12 · **95** | **The deep field setting**: everyone back on the boundary, singles conceded all day, the big shot denied. Give up volume, deny value. | **Author** (the default is wrong here — it names a reference line the chart has none of, and "longer is better" is false): "Each bar is one team; the longer the bar, the more passes that team let the other side make before trying to win the ball back." | *PPDA against* → Arsenal 18.05, 1st; next three 13.93, 13.87, 13.67 (**(AL)**, after 11 games) |
| 5 | A corner is not a moment of luck. It is a drilled routine with a specialist running it. | G1 · narrative, ordered mechanism | `three-steps` | — | intro ≤ 18 (carries the verbatim StatsBomb line) · 3 × (title ≤ 5 + text ≤ 22) · **100** | Net practice: the move you run a hundred times before you run it once in a match. | — (narrative kind; no plain line) | "Goals from set pieces are not luck." (**AL**, verbatim); *HOPS / aerial-duel methodology* (find who loses in the air, aim the delivery there — **general method, never attributed to Jover or Arsenal**); §1 (delivery zone, blocking screens, near-/far-post movement); *Set-piece coach* Nicolas Jover (**AL**) |
| 6 | Fifteen goal-marks piled into the same few square yards in front of the net. | G12 · spatial field on a playing surface | `shot-map` | **HERO** `layout: wide` | intro ≤ 37 · caption ≤ 10 · source ≤ 22 · authored `plain` ≤ 24 · **93** | — (the graphic *is* the image; row 5 supplied the analogy one beat earlier) | **Author** (the default says "plotted where it was taken", which implies surveyed positions): "A goal frame seen from above with one dot per attempt; the bigger the dot, the better the chance was." | All 20 `shots` (carried verbatim, one `xg` nudged) standing on *25 set-piece goals* and *19 corner goals* |
| 7 | One Premier League goal was worth about £2.5 million — roughly ₹26 crore. Arsenal made nineteen of them at a corner. | G3 · one big number made physical | `number-sense` | — | intro ≤ 16 · label ≤ 7 · 2 × (`equals` ≤ 12 + note ≤ 11) · note ≤ 18 · caption ≤ 16 · source ≤ 12 · **100** | **The ₹ for the £** — the issue's only money, and its only rupee. See §5. | "One number, large, and beside it the everyday things it equals, so the size can be felt rather than read." (catalog default — **do not author**) | *A single Premier League goal's value (2017 framing): approximately £2.5M* (**AL**, label it 2017); *Average vs elite set-piece output* (.3 vs .75–.80 a game, **AL**); 19 corner goals |
| 8 | The other half of the machine: two flat banks, dropped deep, squeezing the space behind. | G12 · spatial field on a playing surface | `tactics-pitch` **[i]** | — | intro ≤ 34 · **`howToRead` ≤ 52** (authored; instrument) · caption ≤ 8 · source ≤ 12 · **110** | The same field-setting image as row 4, now drawn: everyone behind the ball, nothing through the middle. | "A team's shape on the pitch, with every player placed in their position and seen at an angle." (catalog default — **do not author**) | *Defensive shape* → 4-4-2 block, high back line, centre-backs **Gabriel** and **William Saliba** (**AL**); *Arsenal's final-day shape* (**AL**) |
| 9 | PSG had the ball for three-quarters of the final and could not score from open play. | G2 · one match, home vs away stat rows | `match-stat-line` | — | intro ≤ 24 · 4 row labels ≤ 12 · 1 row note ≤ 12 · caption ≤ 20 · competition + date ≤ 8 · source ≤ 10 · **95** | — | "The head-to-head numbers from one match, side by side." (catalog default — **do not author**) | *The Champions League final* (**fully AL**): possession 74/26 · shots 20/7 · on target 4/1 · xG 2.21/0.57 · the only goal a penalty, in 120 minutes |
| 10 | Open play is expensive. A corner is a reset — and the modern title is decided on the reset. | G1 · narrative | `prose` | — | lead ≤ 22 · 1 paragraph ≤ 55 · `skimCaption` ≤ 33 (counted inside) · **120** | *maidan* — the ground stops, and a rehearsed move does the work. One Hindi phrase, the issue's third and last. | — (narrative kind; no plain line) | §1 closing argument; 27 conceded and 25 set-piece goals (restated in the `skimCaption`) |

### Word budget

| Block | Words |
|---|---|
| Head (title 8 · dek 10 · hook 25 · primer 26) | **69** |
| 1 `you-think` | 92 |
| 2 `jargon-buster` | 95 |
| 3 `data-readout` | 120 |
| 4 `benchmark-chart` | 95 |
| 5 `three-steps` | 100 |
| 6 `shot-map` (hero) | 93 |
| 7 `number-sense` | 100 |
| 8 `tactics-pitch` | 110 |
| 9 `match-stat-line` | 95 |
| 10 `prose` | 120 |
| **Total reader-facing** | **1,089** |

Ceiling 1,100 — 11 words of headroom, which is thin. The drafter comes in
**under** each row's budget rather than at it; the operator's cheapest slack is
ruling 6 (§8e), which frees ~25. The published issue measures **1,429 across 34
blocks** (REGISTER-PLAN §1.2); this is a 24% cut with three more sections and
seven drawn or tiled figures instead of two.

**Words before the first graphic: 79** — title 8 + dek 10 + hook 25 + primer 26
+ row 1's intro ≤ 10. Floor is ≤ 80. Published: **607**, on a 300-word opening
`prose` section plus a 240-word `paradox`. **Both are deleted** — see §8a.

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before the
first graphic.

### Floors and ceilings, checked before writing

| Rule | This storyboard |
|---|---|
| ≥ 6 in 10 sections visual | 7 of 10 = **70%** (rows 1, 3, 4, 6, 7, 8, 9) |
| Never two text-only adjacent | text-only at 2, 5, 10 — a figure between each |
| First section after the head is a graphic or `data-readout` | row 1 `you-think` (VizCard figure) — **operator ruling 3** |
| ≤ 80 words before the first graphic | **79** |
| ≤ 1,100 reader-facing words | **1,089** |
| ≤ 3 `prose`, each ≤ 200 words | one, budgeted 120 |
| ≤ 1 `paradox` | zero (the published one is cut — §8a) |
| ≥ 1 kind outside the six workhorses (≥ 2 where data allows) | **eight** |
| `timeline` ≤ 6 events | no `timeline` — and the reason is a sourcing one (§8b) |
| One hero | `shot-map`, row 6 |
| ≤ 3 loud · never two WebGL adjacent · quiet after loud | zero WebGL, zero `bleed`, zero full-width animated — nothing loud |
| Every chart with a finding carries ≥ 1 in-graphic callout | `benchmark-chart` 1. It is the **only** kind in this spine with an `annotations[]` slot — see §8d rule 4 |
| ≤ 12 names, each with a role | **ten** (§7), down from 15 |
| How-to-read panels | **one**, on row 8. `tactics-pitch` is the only kind in this spine in `NEEDS_HOW` (`src/lib/explainers.ts`), and issue-authoring requires an instrument to author its own |

### The `data-readout`, re-cut to six tiles (catalog: 3–6)

The published readout runs **eight**. Values are unchanged; two tiles leave.

| # | `value` | `label` | `note` (≤ 15 w) | `accent` |
|---|---|---|---|---|
| 1 | `27` | Goals conceded, fewest in the division | Across 38 games. | |
| 2 | `28.5` | Expected goals against, lowest in the league | League xGA. Their Champions League figure, 0.7 a game, is a different measurement. | |
| 3 | `25` | Set-piece goals, penalties excluded | Most in the division. | |
| 4 | `19` | Goals from corners | A Premier League single-season record. The previous high was 16. | **✓** |
| 5 | `238` (`unit: " days"`) | Nights spent top of the table | Including 200 in a row. | |
| 6 | `May 19` | Champions, with a game to spare | Confirmed when Manchester City drew and finished four points behind. | |

**Dropped:** the **18.05** tile — row 4 now *draws* it, and a tile plus a bar
chart of the same number is the duplication the composition floors exist to
stop — and the **19 clean sheets** tile, because two tiles both reading "19"
made the grid unreadable, and dropping it also drops a name (the goalkeeper).
Tile 6 keeps Bournemouth out: "Manchester City drew" says everything the clinch
needs and saves a name.

### The one annotation (RG-20, `data.annotations[]`)

`benchmark-chart` takes `at` = the item's label string.

| `at` | `text` (≤ 12 words) | Words |
|---|---|---|
| `Arsenal` | Arsenal allowed four more passes per defensive action than anyone. | 10 |

"Four more" is 18.05 − 13.93 = 4.12, subtraction on two numbers from the same
sourced row — see §5, computation B1.

---

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **Arsenal won the league from the *corner flag*** — 8 words, one italic accent.
  Retires *The Title Nobody Could Watch*, which names the subject, says nothing,
  and is AI-tell 7's construction in all but the relative pronoun. A reader who
  reads only this title already has the argument.

- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"Arsenal scored 19 league goals from corners, a Premier League record, and
  conceded 27 all season. You were watching a factory, not a football team."**
  25 words, exactly at the cap. Two numbers in the first sentence (rule 8's
  ceiling), a "you", and the twist in the last clause. **This spends the
  issue's one binary reframe** (AI-tell 2) — see §8c.

- **Dek (≤ 14 words; carries the Hindi if the title has none):**
  **"The team everyone called boring, and the hisaab that won it."** — 11 words,
  L2. *hisaab* passes the four tests: delete it and "the maths that won it"
  still says everything; it is the word an Indian would use for the accounting
  of a thing; a Lallantop sub would not wince on the sports desk; it is nowhere
  near a number, a source or a caption. Roman, set roman. It also attributes the
  "boring" judgement to the pundits rather than to Parallax — the published
  issue asserted it in its own voice.

- **Primer (three sentences: what happened · why it matters to you · what
  you'll see):**
  **"Arsenal had not won England's league since 2004. They won it in 2026 by
  giving the ball away and scoring from corners. Below: how that works."**
  26 words, ~148 characters — comfortably inside the 80–420 Zod bound. The
  published primer is ~360 characters and the verification report's required fix
  #4 asks the editor to count it by hand before the build; this retires that
  check.

Published head for comparison: title 5 words (the retired formula), hook 26
words with no "you", dek an antithesis beside an already-reversing hook (AI-tell
8), primer ~68 words.

---

## 5. The Indian ground

**The dossier carries no Indian fact.** There is no Indian player, club, league,
broadcaster, viewership figure or place in §2, §3, §4, §5 or §6 — the sources
are Coaches' Voice, StatsBomb, Opta and the Premier League. The researcher did
not look for one and the rewrite may not add one: a new claim needs a source and
the composer adds no sources. So the Indian ground here is **currency, scale and
the games the reader already owns** — none of which needs a new fact. This is
the desk the operator named as the place to fix the zero.

### A. The ₹ — one computation for the operator to rule

The dossier contains **exactly one money figure**. It is the issue's only
opportunity to obey rule 4 ("every dollar figure carries its rupee equivalent"),
and it is the closer.

| # | The figure | Dossier row | Proposed conversion | Proposed rate | Where it lands |
|---|---|---|---|---|---|
| A1 | **£2.5M**, the value of one Premier League goal | §4 *Set pieces — the conceptual frame* → "A single Premier League goal's value (2017 framing): approximately £2.5M" **(AL)** | **about ₹26 crore** | **₹105 to the pound** | row 7 `number-sense` — the `value` stays £2.5m, `equals[0]` carries the ₹, its `note` carries the rate |

Two cautions the drafter must honour, both from the dossier itself:
- **Label it 2017.** Dossier §4: *"(Dated; use only if framing the economic
  stakes of marginal goals, and label it 2017.)"* The `note` says so.
- **A 2017 sterling figure at a present-day rate is a convenience, not a
  valuation.** The operator sets the rate and the as-of date; the source line
  states it, e.g. "conversion at ₹105 to the pound, ‹date›". If the operator
  refuses the conversion, row 7 runs on £ alone **and the issue carries no
  rupee at all** — which is the defect this rewrite exists to fix. Ruling 4.

### B. Subtractions on sourced numbers — no new fact, but say so

| # | The line | The arithmetic | Where |
|---|---|---|---|
| B1 | "four more passes per defensive action than anyone" | 18.05 − 13.93 = 4.12, both from dossier §4's single **(AL)** PPDA row | row 4's annotation |
| B2 | "three more than anyone had ever managed" | 19 − 16, both from dossier §4's corner-record row | available to row 1's `note` or row 7's `equals[1]` note; use in **one** place only |

### C. The computation deliberately NOT made

**Do not divide 25 set-piece goals by 38 games and set the result against
StatsBomb's ".3 for most clubs, .75–.80 for elite clubs".** It looks like the
comparison that makes 25 feel like something, and it is a trap: 25 excludes
penalties while StatsBomb's framing does not say whether its rate does, the
StatsBomb figures are a general 2017 claim about clubs in the abstract, and the
arithmetic (0.66 a game) lands *below* the elite band and quietly contradicts
the issue. The published draft stitched exactly this join and the verification
report flagged it as required fix #2. Row 7's `note` states the StatsBomb rates
as StatsBomb's general claim and stops.

### D. The games the reader owns — analogies, not claims

No number attaches to any of these, so none needs a source.

| The analogy | What it carries | Row |
|---|---|---|
| **The penalty corner in hockey** — India's own game, where a dead-ball restart is a routine you drill rather than a moment you improvise | the gloss for "set piece" | 2 (`jargon-buster` `meaning`), echoed in 5 |
| **The deep field setting** — everyone back on the boundary, singles conceded all afternoon, the big shot denied | "they gave up volume and denied value", which is the whole defensive half of the argument | 4 (`benchmark-chart` intro), 8 (`tactics-pitch` intro) |
| **Net practice** — the move you run a hundred times before you run it once in a match | why a rehearsed restart repeats and inspiration does not | 5 (`three-steps`) |
| ***mauka*** — "xG counts the maukas" | the gloss for xG; it is the lexicon's own worked sports example | 2 (`jargon-buster` `hindi` slot) |

### E. Hindi density — three touches, the whole issue

Sports is the desk the lexicon allows the most Hindi on, and the ceiling is
still one phrase per paragraph, never in two consecutive sentences, and **never**
in `caption` / `howToRead` / `plain` / `source` / any data label.

| Word | Field | Test it passes |
|---|---|---|
| *hisaab* | the dek | skip test: "the maths that won it" survives deletion |
| *mauka* | row 2's dedicated `hindi` slot (an explicit Hindi field in the `jargon-buster` DATA shape) | the lexicon's own example for this word |
| *maidan* | row 10's one paragraph | skip test: "the ground stops" survives deletion |

Rows 1, 3, 4, 6, 7, 8 and 9 are **L1 throughout** — they sit next to numbers.

---

## 6. The three questions

Written from the dossier, not the draft. The reader panel answers them from the
draft alone; if the draft cannot teach them, the draft is wrong.

1. **Q:** What is a set piece, and how many of Arsenal's league goals came from
   one?
   · **A:** A corner or a free kick — play restarting from a dead ball, the way
   a penalty corner restarts a hockey match. Arsenal scored **25** of their
   league goals from set pieces with penalties excluded, the most in the
   division, and **19** from corners alone, a Premier League single-season
   record. The previous high was 16.
   · dossier §4 *The set-piece record* → "25 set-piece goals (excluding
   penalties)", "19 goals from corners — a new Premier League record… previous
   high of 16"; §4 *Set pieces — the conceptual frame* (the definition).
   · Taught by rows 1, 2, 3, 6.

2. **Q:** Arsenal let opponents keep the ball more than any other team did. How
   do you know that was the plan and not a weakness?
   · **A:** Opponents were allowed **18.05** passes per defensive action against
   Arsenal, the highest figure in the division; the next three teams sat at
   **13.93, 13.87 and 13.67**. And it bought the two things a plan is supposed
   to buy: **27** goals conceded, fewest in the league, and **28.5** expected
   goals against, the lowest. They surrendered volume and refused to surrender
   value.
   · dossier §4 *PPDA against* **(AL, Coaches' Voice, after 11 games)**; §4
   *Goals conceded* and *Lowest expected goals against*.
   · Taught by rows 3, 4, 8.

3. **Q:** Arsenal lost the Champions League final to PSG. What did that match
   prove about the method?
   · **A:** PSG had **74%** of the ball, took **20** shots and produced **2.21**
   expected goals; Arsenal had **26%**, **7** shots and **0.57**. Across 120
   minutes the only goal Arsenal conceded was a **penalty**. Handing over
   possession and territory did not break the block — open play could not.
   · dossier §4 *The Champions League final* (**fully allowlist-anchored**,
   Coaches' Voice, 31 May 2026).
   · Taught by rows 9, 10.

---

## 7. Names

**Ten**, against a ceiling of twelve and against the published issue's fifteen.
Each is introduced with its role in the same sentence (`_voice-core.md` §3
rule 9). Nine of the published fifteen were `name` fields inside the
`tactics-pitch` player array; that array is stripped (§8a), which is where most
of the saving comes from.

| # | Name | The role phrase that introduces it |
|---|---|---|
| 1 | **Arsenal** | the London club that had not won England's league since 2004 |
| 2 | **Mikel Arteta** | Arsenal's manager, who hired a coach to run corners alone |
| 3 | **Nicolas Jover** | Arsenal's set-piece coach |
| 4 | **Gabriel** | one of the two centre-backs holding the line high |
| 5 | **William Saliba** | the other centre-back in that pair |
| 6 | **Manchester City** | the side four points behind when the title was confirmed |
| 7 | **Paris Saint-Germain** | the club that beat Arsenal on penalties in the European final |
| 8 | **The Premier League** | England's top division (the competition, in labels and notes) |
| 9 | **The Champions League** | Europe's club competition (the `competition` field on row 9) |
| 10 | **The Invincibles** | the unbeaten 2003/04 Arsenal side, the last to win the league |

**Jover handling is a dossier rule, not a preference** (§4, §9): the formal name
is **Nicolas Jover**, never "Nico"; he is **French**, never German; and only the
bare role — set-piece coach, hired by Arteta — is allowlist-anchored. The
Montpellier → Brentford → Man City career path is off-allowlist and stays out.

**Source line only, never inside a sentence** (rule 9's ban on the stacked
citation): Coaches' Voice · StatsBomb · Ted Knutson · Scott Johnson · Opta ·
The Guardian · Sky Sports. All six `sources[]` entries stay exactly as
published.

**Described, not named:** the goalkeeper (the 19-clean-sheets tile is cut); the
seven other players in the defensive block (the array carries `role` only); the
PSG forward who scored the penalty (row 9 says "a penalty", which is the claim);
Bournemouth (tile 6 says "Manchester City drew").

---

## 8. Composer notes

### 8a. The published sections — carried, re-kinded, cut

| Published section | Fate | Detail |
|---|---|---|
| `prose` "THE ROMANCE THAT LOST" (~300 words) | **CUT** | Half of the 607 words before the first graphic. Its one working move — *the wait was supposed to end with better football, and better football kept finishing second* — becomes row 1's `think` panel in 24 words. Its 89-points-in-2023/24 line goes with it: it is the weakest-anchored prior-season figure in the issue (Coaches' Voice anchors only the *framing* "three consecutive runners-up"; the point total is a Wikipedia cross-check) and nothing in the argument rests on it. The verifier's ⚠️ polysyndeton run ("Pundits called it dull, and neutrals stopped tuning in, and it won…") dies here. |
| `paradox` "THE INVERSION" (~240 words) | **CUT and re-kinded** | REGISTER-PLAN §5.1 calls `paradox` "prose in a costume" and caps it at one; this is the issue's densest block and the other half of the 607. **The Perception** side (18.05, the next three, the 4-4-2) becomes row 4 (`benchmark-chart`, which *draws* it) and row 8 (`tactics-pitch`). **The Engineering** side becomes row 5 (`three-steps`) and row 7's `note`. Cutting it resolves verification **required fixes #1 and #2 outright**: the misquoted "Set-piece goals are not luck." and the ".75–.80 goals a game" clause stitched to Arsenal both live only in this section. The verbatim StatsBomb line returns, correctly, in row 5's intro. |
| `data-readout` "THE STAT LINE" | **DATA CARRIES OVER VERBATIM**, 8 tiles → 6 | Every surviving `value`, `label` and `note` unchanged in substance. Dropped: the 18.05 tile (row 4 draws it) and the 19 clean sheets tile (see §3). The `source` string — "Coaches' Voice (PPDA 18.05; 4-4-2 block) · full-season totals via Opta" — is rewritten to drop the PPDA clause, which has moved. |
| `shot-map` "WHERE THE GOALS CAME FROM" | **DATA CARRIES OVER VERBATIM** | All 20 `shots`, `caption` and `source` unchanged, except the verifier's optional fix (lead `xg` 0.70 → 0.68). Promoted to **hero**, `layout: default` → `wide`. New 37-word intro; a `plain` line is authored because the catalog default implies surveyed positions (§3). |
| `tactics-pitch` "THE BLOCK" | **DATA CARRIES OVER, names and numbers stripped** | All eleven `x`/`y` pairs and all eleven `role` values unchanged; `formation: "4-4-2"`, `team: "Arsenal"`, `caption` and `source` unchanged. **`name` and `num` are deleted on every player.** This resolves verification **required fix #3 outright** — there is no named starter absent from the Coaches' Voice XI because there is no named starter — and it retires the published MDX-body EDITOR note about the second forward and the wide-left occupant, which becomes moot. It also returns nine slots to the name budget. Gabriel and Saliba survive, in the intro, where the source anchors them. A `howToRead` is authored (the kind is in `NEEDS_HOW`): the static reading leads, the turn-the-pitch clause trails. |
| `comparison` "NEAR-MISS vs CHAMPIONS" | **CUT** | Five rows, four of them qualitative ("front-foot, possession, romantic" / "deep, sat-off, hard to watch"). Row 1's `you-think` does the same reframe in 46 words with a sourced number in it, and the one hard figure here (89 points) is the one being dropped for anchoring. Its `source` string already carried a pointer to the data-readout's EDITOR notes, which is a sign the row was living on borrowed provenance. |
| `prose` "THE 1% MARGINS" (~300 words) | **KEPT as row 10, cut to ~120** | The Champions League numbers move up to row 9, where `match-stat-line` shows them instead of narrating them; Jover and the corner-as-reset move to row 5. What is left is the landing. All three of the verifier's remaining voice flags sit in the deleted half: the staccato cluster ("Open-play creation is expensive, contested and noisy." / "Hand over volume, refuse to hand over value.") and the ⚠️ META-COMMENTARY closer ("had been the winning machine all along"). |
| — | **NEW: `you-think`** | Row 1. Data from dossier §1, §2 and §4. |
| — | **NEW: `jargon-buster`** | Row 2. Three of the four terms port from `2026-06-03-sports-showcase` **verbatim and already in the register** (xG with its `hindi` gloss, set piece, open play); Elo is dropped (no ratings in this dossier) and replaced by *passes per defensive action*, which row 4 needs. |
| — | **NEW: `benchmark-chart`** | Row 4. Data from the single **(AL)** PPDA row in dossier §4. |
| — | **NEW: `three-steps`** | Row 5. Text only, from dossier §4's StatsBomb frame and §1. |
| — | **NEW: `number-sense`** | Row 7. Data from dossier §4's £2.5M row plus the §5 conversion. |
| — | **NEW: `match-stat-line`** | Row 9. Dossier §7 offers this swap explicitly, and the verification report recommends it as the one fully allowlist-anchored alternative to an illustrative viz. Here it runs **alongside** the `shot-map` rather than instead of it. |
| `sources[]` (6 entries) | **UNCHANGED, all six** | No fact is new, so no source is new and the verifier's trace holds. |
| `id`, `topic`, `publishedAt`, `tags`, `status` | **unchanged** | The rewrite replaces the issue in place. `readTimeMinutes` 7 → **4** (REGISTER-PLAN §5.1 target 4–5). |
| MDX body `# EDITOR:` notes | **one carries, one goes** | The allowlist-anchoring note (the seven Opta-flagged counting stats) **carries forward verbatim** — it is verification required fix #5 and it is the operator's standing decision, not the composer's. The tactics-pitch personnel note is deleted, because the personnel are. |

Net: 7 published sections → 10; ~1,429 reader words → 1,089; 607 words before
the first graphic → 79; 15 names → 10; 2 figures → 7; three of the five
verification required fixes resolved by composition rather than by patching.

### 8b. Kinds considered and rejected

| Kind | Why it was wanted | Why it is not available |
|---|---|---|
| `xg-race` | REGISTER-PLAN §8.1 names it for this issue by name, it is the sports desk's instrument, and it carries an `annotations[]` slot | **No per-minute data.** `DATA` needs `events: [{minute, team, xg}]`. The dossier carries the Champions League final's xG **totals** (2.21 / 0.57) and nothing else — no shot times, no per-shot values, for that match or any other. A race drawn from two totals would be an invented series, which is the issue's central number invented. Getting it needs an Opta/Understat per-shot timeline: a research job. |
| `momentum-wave` | The other kind REGISTER-PLAN §8.1 names, and the final would tell well as a wave | **No momentum index.** `DATA` needs `points: [{minute, value −100..100}]` plus timed events. The dossier has neither a minute series nor an event clock — only the 65th-minute penalty. Same research job as above. |
| `elo-river` | Four seasons of Arsenal against their rivals is exactly the braid this kind draws, and it takes annotations | **No ratings at all.** `DATA` needs 3–10 teams with ≥6 dated values from a **named** model. The dossier carries no Elo, SPI or power rating for any club, and the catalog is explicit: "If there is no *rating* (just points/wins), it is a `league-table`." |
| `league-table` | The fallback from the row above, and a sports signature | **No standings.** The dossier gives Arsenal 1st, City 4 points behind with one game left, and 89 points in 2023/24. That is three facts, not a table: no played, won, drawn, lost, goals for or against for any club, Arsenal included. |
| `court-value` | Thematically the sharpest kind in the library for this issue — the geography of where a chance is worth taking is *literally* the argument | **No value surface.** `DATA` needs a model-scored field (a grid, or shots with model values) and a **named** model. The dossier has no xG model output of any kind, and the catalog requires `model` to be stated. The `shot-map` is the kind this evidence supports, and even that is schematic. **This is the kind to revisit if StatsBomb open data is ever pulled for this issue.** |
| `finish-interval` | The title race with a game to spare is a projection story | **No simulation.** `DATA` needs a named simulation, its run count, and per team a median plus 5th/95th-percentile finishing positions for 8–20 teams. The dossier has none, and the catalog's capture note forbids inventing a range around a published projection. The build also fails on a zero-width interval. |
| `player-card` / `player-radar` | Jover's work has faces; a keeper with 19 clean sheets has a card | **No attribute ratings.** Both need 5–8 scored axes per player. The dossier carries one stat for one player (clean sheets) and nothing for anyone else. |
| `pace-ridge` | The distribution of chance quality, set-piece against open-play, would settle the argument better than any tile | **No samples.** `DATA` needs per-observation samples for the subject and ≥1 comparison group, ≥ ~15 each, from a named dataset. The dossier carries aggregates only. |
| `attrition-waffle` | "Half of 20 goals came from set pieces" is countable, and a hundred squares would make the share auditable | **No n of 100 and no season denominator.** The kind's build **fails** unless the groups sum to exactly 100. The dossier's only exact split is the 11-game checkpoint (20 goals: 8 corners, 2 free-kicks, 10 open play) and it never gives Arsenal's full-season goal total, so the headline "a quarter of their goals" has no denominator in the dossier at all. |
| `channel-ternary` | Three mutually exclusive shares summing to 100 — corner, free-kick, open play — is the kind's exact shape | **Needs 4–12 entities.** There is one team at one checkpoint. |
| `flight-of-the-ball` | The sports desk's WebGL flagship, and a corner delivery is a drag-and-Magnus problem | **No launch parameters.** `DATA` needs one shot's speed, elevation, azimuth and spin rate. The dossier names no individual delivery, let alone its physics. |
| `timeline` | A 22-year wait wants a spine, and `timeline` is one of the eight annotated kinds | **Rejected on sourcing, not on shape.** The dossier's §3 has ten dated events, but four of the six that would make the cut are off-allowlist assertions the published issue deliberately never made: Jover's hire date (Wikipedia), the 4 October 2025 date Arsenal went top (Wikipedia), the 25 April 2026 record date (Opta/The Analyst), and the Invincibles' final-day date (Premier League official). Importing four new dated claims into a rewrite that is not allowed to add sources is the wrong trade. The two dates the issue needs — 19 May 2026 and the 30 May final — are carried by tile 6 and row 9. **Operator ruling 5** if you disagree. |
| `comparison` / `paradox` | Both were published; both are workhorses | Cut, and both for the same reason: REGISTER-PLAN §1.2(b) counts them as text-composed, the floors cap `paradox` at one and call it prose in a costume, and `you-think` does the reframe in a quarter of the words with a number inside it. |
| `quote` | The StatsBomb line — *"Goals from set pieces are not luck."* — is the analytics establishment pre-stating this issue's thesis nine years early, and it is the best single sentence in the dossier | Not a section, on word budget alone. It survives **verbatim, in full, attributed by role** inside row 5's intro, with StatsBomb and Knutson on the source line. Restorable as its own quiet row at ~70 words — **operator ruling 6**, which is also where the drafter's slack is. |
| `analogy` (pairs form) | The mappings are good: a corner ↔ a penalty corner in hockey; the block ↔ a deep field setting; open play ↔ improvising | A fourth text-only row, and both mappings land harder *inside* the rows that need them (§5D) where they sit next to the number. |
| `act-break` | CANON §3's act device | Not used. RG-06's recommended ruling is to drop the act rule rather than enforce it (zero uses in 23 issues). If the operator takes the other branch, one goes before row 9; the visual share falls to 7 of 11 = 64%, still above the floor. |
| `plate` | — | No image exists; the component renders nothing. |
| `hero` | — | Retired 2026-09-13; never used. |

### 8c. What the rewrite spends, and what it gives up

**The one binary reframe is spent in the hook.** `_voice-core.md` §6 tell 2
allows *"It is not X. It is Y."* once per issue, and only when the reversal is
the argument. Here it is: "a factory, not a football team". **No other prose
field may reverse** — not the dek, not row 1's `actually`, not row 10's close.
The published issue reversed in the title, the dek and the paradox statement.

**The dek does not reverse either**, which is AI-tell 8 (eight of ten published
deks were antithesis deks sitting beside an already-reversing hook).

**One triple-fragment close, and it is not in row 10.** The published closer
stacked two short-fragment runs in adjoining paragraphs, which the verifier
flagged. Row 10 has one paragraph and it ends on a full clause.

**The 89-point near-miss is gone**, and with it the only per-season number from
the three runner-up years. Row 1 says "finished second every time", which is the
**(AL)** Coaches' Voice framing and needs no cross-check.

**The goalkeeper's 19 clean sheets are gone.** A real, sourced, league-leading
figure, cut for a grid-legibility reason (two tiles reading "19") and a name.
It is the cheapest thing to restore if the operator wants it — swap it for tile
5 (238 days), which is colour rather than argument.

### 8d. Standing constraints the drafter must not break

1. **Every counting stat keeps its flag.** 27 · 19 clean sheets (if restored) ·
   28.5 · 25 · 19 corners · 238 / 200 · the 19 May clinch are all
   `[UNVERIFIED – allowlist]` in dossier §4 and carry `# EDITOR:` Opta notes in
   the published issue. They ride forward **exactly as published**. Do not
   silently promote one to allowlist-verified, and do not drop a flag because
   the tile moved.
2. **Never merge the two xGA measurements.** "Lowest league xGA, 28.5" and
   "lowest per-game xGA in Europe's big five, 0.7" are different measurements
   (dossier §4, §9). Tile 2's note keeps them apart, and that is the only place
   either appears.
3. **Never assert the previous corner record-holder.** Sources disagree (Oldham
   1992–93 vs West Brom 2016/17, dossier §4). The safe phrasing is "the previous
   Premier League high was 16", and it is the phrasing the published issue used.
4. **Annotations exist on `benchmark-chart` only.** The other nine kinds in this
   spine have no `annotations[]` slot; authoring one is a silent no-op.
5. **One `howToRead`, on row 8 only.** `tactics-pitch` is the only kind here in
   `NEEDS_HOW`. Authoring one anywhere else adds a panel the register plan spent
   RG-19 removing.
6. **The HOPS method is never attributed to Jover or to Arsenal.** Dossier §4 is
   explicit: the StatsBomb article names neither. Row 5's first step describes
   the general method; the source line names StatsBomb.
7. **No Carragher.** The "every time they get a corner" line is a Sky broadcast
   surfaced via a Premier League summary, off-allowlist, and dossier §5 says do
   not use it. It is correctly absent from the published issue and stays absent.
8. `caption` = the data claim (traced) · `plain` = the form · `howToRead` = how
   to use it. Never swapped.
9. **Numbers are copied, never retyped.** Every figure above traces to the
   published issue, whose numbers the verifier already traced to the dossier.

### 8e. For the operator to rule, before the draft runs

| # | Ruling | Why it blocks |
|---|---|---|
| 1 | **Is a schematic `shot-map` allowed to be the hero?** Its positions are drawn, not tracked (dossier §9; verification ⚠️ IMPRECISE), and it is labelled illustrative in both the intro and the source. | It is the only component that shows the title's finding, which is why I have put it there. **If you refuse:** the hero moves to row 9 `match-stat-line` (fully allowlist-anchored, hero-capable per the catalog, `layout: wide`) and the `shot-map` stays at row 6 on `default` — no word change either way. A third option is to drop the `shot-map` entirely, per the dossier §7 swap, which costs the issue its picture. |
| 2 | **`wide` or `split` for the hero?** CANON §2 says the hero *should* take `split`, and only the hero may. | I have recommended `wide`: `split` is the sticky layout and wants ~120 words of prose held beside the graphic, which this issue does not have — its explanation lives in rows 5 and 7 as separate components. Ruling `split` costs ~120 words, which means dropping row 7 (`number-sense`) and with it the issue's only rupee. |
| 3 | **Does `you-think` satisfy the floor "the first section after the head is a graphic or a `data-readout`"?** | It is G2, a VizCard with its own caption, source and plain line, and the catalog says "usually the first or second section" — it was built for this slot (RG-09). If you read the floor more narrowly, swap rows 1 and 3 so the `data-readout` opens; the 80-word budget holds either way, but the reframe then lands after the evidence instead of before it. |
| 4 | **The conversion: £2.5M ≈ ₹26 crore at ₹105 to the pound, as of a date you set** — and the fact that it converts a **2017** valuation at a present-day rate. | Row 7 depends on it, and row 7 is the issue's **only** rupee, its only money and its only obedience to rule 4. Refuse it and the issue's Indian ground falls back to the hockey and cricket analogies alone — rule 10 met at its floor, not its height. There is no second money figure in the dossier to fall back on. |
| 5 | **No `timeline`.** The six events that would make one import four off-allowlist dated claims the published issue deliberately never made (§8b). | If you want the spine, it needs a Guardian or Athletic hand-read for the dates — a research job, not a rewrite job. As composed, the two dates the argument needs are carried by tile 6 and row 9. |
| 6 | **The StatsBomb quote is folded into row 5's intro, not given its own `quote` row.** | Word budget: the spine is at 1,089 of 1,100. Restoring it as a quiet row between rows 3 and 4 costs ~70 words and keeps every floor intact at 11 rows (7 of 11 visual = 64%), but row 10's prose must then drop from 120 to ~55. **This is also the drafter's only real slack** — if a row overruns, this is what pays for it. |
| 7 | **The `tactics-pitch` players lose their names and shirt numbers**, keeping only position and role. | It resolves verification required fix #3 outright and returns nine name slots. The cost is that a reader cannot pick out Rice or Saka on the pitch — the figure becomes a shape, which is what its own caption already called it ("schematic"). Rule it back and the issue is at 19 names, well over the ceiling of 12. |
| 8 | **Two kinds ship here for the first time in a published issue** — `you-think` and `jargon-buster` (`number-sense` and `three-steps` too, if the showcase drafts do not count), and `benchmark-chart` and `match-stat-line` have never appeared outside a showcase. | Worth eyeballing rows 1, 2, 4, 5, 7 and 9 in the browser before the draft is verified. Row 4 in particular: a four-bar `benchmark-chart` where three bars are near-identical and unlabelled by club name is a layout risk, and the tech-desk styling lands on a sports page. |
| 9 | **The seven `# EDITOR:` Opta flags are unresolved and ride forward.** | This is the dossier's one structural blocker (§0/§9) and verification required fix #5. It is not a composition question, but the rewrite is the cheapest moment to clear it: read the Guardian's 19 May 2026 wrap (or The Athletic) by hand and re-anchor 27 / 28.5 / 25 / 19 / 238 / 200 / the clinch, **or** consciously accept the Opta attribution and say so. Do not let the flags flip to published a second time by default. |
