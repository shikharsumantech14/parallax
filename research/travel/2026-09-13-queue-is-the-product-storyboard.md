# Storyboard: Everest and Fuji now sell the *wait*

- **Category:** travel
- **Dossier:** research/travel/2026-06-04-queue-is-the-product-dossier.md
- **Composed:** 2026-09-13
- **Composer:** composer-agent
- **Status:** draft            ← draft | approved | hold  (the gate; see below)

> **This is a REWRITE, not a new issue.** The subject is the published
> `src/content/issues/2026-06-04-queue-is-the-product/index.mdx`
> (`docs/REGISTER-PLAN.md` §8.1, the flagship set under RG-14). The slug, the
> eleven `sources[]` and every fact stay; the composition and the register
> change. **No new claim enters.** Two currency conversions and one ratio are
> computations, not facts — each is flagged in §5 with the rate for the
> operator to rule, and the source line would name the rate.
>
> Verification for the published issue (`…-verification.md`, NEEDS REVISION)
> is read as a constraint: the seven high-risk operator checks all passed and
> the rewrite must keep them passing — no paid Everest queue-skip anywhere,
> the un-enacted Nepal package labelled proposed or absent, only the enacted
> Everest facts stated as current, the Fuji reservation split and open date
> absent, the annual-climber figure a range or nowhere.
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

Nepal and Japan did not cap their two most crowded mountains. They put a price
on the wait — the queue itself is now the thing being sold.

*(Dossier §1. 27 words.)*

---

## 2. The hero

**`elevation-trek` · data shape G9 (physical scale) · `layout: split` · row 3.**

It is the only component in the issue that *shows* the thing being sold. The
comparison table can say "position in the summit-window queue"; only the
mountain silhouette shows you a line of people standing still at 8,790 metres
with the air running out. The deep explanation — why waiting is the danger —
happens while the profile holds on screen, which is what `split` is for
(CANON §2).

**Dossier §4 facts it renders** (all seven points carry over verbatim from the
published issue, which the verifier traced):

- Base Camp 5,364 m · Camp 1 6,065 m · Camp 2 / Western Cwm 6,400 m ·
  Camp 3 / Lhotse Face 7,162 m · Camp 4 / South Col 7,950 m ·
  the bottleneck / summit ridge 8,790 m · Summit 8,849 m
  — dossier §4 "Everest South Col route — elevation profile".
- The death zone begins at the South Col, ~7,950 m; about three days there.
- The waypoint **labels are the in-graphic callouts** — "Camp 4 · South Col —
  death zone begins" and "The bottleneck · summit ridge / Hillary Step" already
  state the finding on the mark. `elevation-trek` has no `annotations[]` slot
  (RG-20 wired eight kinds; this is not one), so the labels do that job.
- The published intro's honesty line stays: camp elevations verified, trail
  distances illustrative. Per the verification report's optional fix, the
  8,790 m bottleneck node is **also** an interpolated profile point — the
  drafter says "profile point", not a surveyed Hillary Step altitude.

Rejected as hero: `comparison` (a text-composed table cannot be the picture the
reader remembers), `timeline` (the ratchet is the *how*, not the *what*),
`altitude-oxygen` (the better hero, blocked for want of data — see §8).

---

## 3. The beats

Eight rows. **Six of eight are visual (75%)**, floor is 60%. The two text-only
rows (4 `three-steps`, 8 `paradox`) are not adjacent. The first row after the
head is a number-led graphic, not prose. Zero `prose` sections (floor allows 3).
One `paradox` (ceiling 1). Four kinds from outside the six workhorses —
`number-sense`, `you-think`, `three-steps`, `elevation-trek` — against a floor
of one. Zero WebGL, zero `bleed`, one `split` (the hero): no loudness ceiling
is approached.

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | A place in the Everest line costs about ₹12.5 lakh — and it buys entry, not a place at the front. | G3 · one big number | `number-sense` | — | intro ≤ 20 · component copy ≤ 85 · **105** | ₹12.5 lakh; the same money is about 600 Fuji tickets. **Gloss "royalty" here**: the fee Nepal charges for the permit itself. | "One number set large, and beside it the everyday amounts it equals." | Spring royalty $11,000 → $15,000, eff. 1 Sep 2025, first rise since 2015 · Nepali citizens Rs 75,000 → Rs 150,000 · ¥4,000 ≈ US$25 |
| 2 | You think the rules just got stricter. Japan is selling 4,000 dated slots a day; Nepal re-priced the line without capping it. | G2 · two panels, one settling figure | `you-think` | — | intro ≤ 25 · component copy ≤ 95 · **120** | Booking a timed darshan slot or an IRCTC berth online — you are buying a time, not a place. | "Left panel, what most people assume; right panel, the number that settles it." | Fuji cap 4,000/day (excl. hut guests) · ¥4,000 paid in advance to reserve · no explicit Nepal daily cap · **no paid queue-skip exists** ([UNVERIFIED] block) |
| 3 | Above about 7,950 metres the body starts failing — and the worst jam sits higher still. Standing still is what kills. | G9 · elevation along a route | `elevation-trek` | **HERO** `layout: split` | intro ≤ 42 · caption ≤ 14 · labels carry over · **90** | **Gloss "death zone" here**, in the intro, the moment it appears: above ~7,950 m there is so little oxygen the body starts shutting down, and you get about three days there. | "A mountain silhouette of the route; left to right is distance walked, up and down is real height." | Camp elevations 5,364 → 8,849 m · death zone from the South Col ~7,950 m · ~3 days to make a summit bid · the bottleneck between South Col and summit |
| 4 | Here is how a queue turns into a product, in three moves. | G1 · narrative, ordered mechanism | `three-steps` | — | intro ≤ 20 · 3 titles ≤ 6 w · 3 texts ≤ 25 w · **100** | Step 3 is the Tirupati / IRCTC move: put a price, a quota and a clock on the same few hours and the wait becomes stock. | — (narrative kind; no plain line) | Everyone competes for the same safe-weather window (§1) · time waiting in the death zone is the danger · Fuji's hazard is bodies arriving in the same overnight hours · the 14:00 gate ends the overnight "bullet climb" |
| 5 | Fuji's crowd is now a daily stock: 4,000 slots, ¥4,000 each, gate shut at 2 p.m. | G3 · headline numbers | `data-readout` | — | intro ≤ 30 · 4 tiles ≤ 55 · caption ≤ 10 · **95** | ₹2,300 for the ticket, said once in the intro; a venue booking its seats. | "A grid of instrument tiles, one number and its label each; the accented tile is the headline reading." | 4,000/day Yoshida cap · ¥4,000 in advance (doubled from ¥2,000 in 2025) · gate 14:00–03:00, hut guests exempt · season 1 Jul – 10 Sep 2026 |
| 6 | Nepal raised the price of the ticket. Japan fixed how many tickets exist. Same destination, opposite levers. | G2 · peers, attribute by attribute | `comparison` | — | intro ≤ 30 · sides ≤ 14 · 7 rows ≤ 76 · **120** | The read-across is the analogy: one row at a time, the same question asked of both mountains. | "Two columns, one mountain each; read across a row for the same rule on both." | All seven published rows: headline lever · what you pay · hard cap · time slot · time gate · competence screen (guide 1:2 *enacted*, 7,000 m peak *proposed*) · what it prices |
| 7 | In three seasons Fuji went from no limit at all to a booked, timed, paid trail — and Nepal's decade-frozen fee jumped a third. | G4 · dated sequence | `timeline` | — | intro ≤ 28 · 6 labels ≤ 24 · 6 notes ≤ 11 each · 2 annotations ≤ 12 each · **145** | The ratchet: each step tightens and none loosens. | "Events stacked in time order down a spine; the marked nodes are the turning points." | **Six events only** (see below) — 2013 UNESCO · 2019 photograph + 11 deaths · Jul 2024 first quota · 2025 season fee doubles · 1 Sep 2025 royalty enforced · 1 Jul 2026 season opens |
| 8 | The same counter that sells the wait also shortens it. You pay more to stand there less. | G2 · two facts pulling opposite ways | `paradox` | — | intro ≤ 30 · labels + statements ≤ 16 · 2 details ≤ 38 each · caption ≤ 10 · **135** | The old deal and the new deal, side by side; the ticket counter as the image. | "Two statements face each other; both are true, and the gap between them is the section." | Time on the mountain was unpriced · the 14:00 gate kills the overnight climb · the $15,000 prices entry to a line linked to deaths (Arnette / NatGeo) |

### Word budget

| Block | Words |
|---|---|
| Head (title 6 · dek 9 · hook 24 · primer 21) | **60** |
| 1 `number-sense` | 105 |
| 2 `you-think` | 120 |
| 3 `elevation-trek` (hero) | 90 |
| 4 `three-steps` | 100 |
| 5 `data-readout` | 95 |
| 6 `comparison` | 120 |
| 7 `timeline` | 145 |
| 8 `paradox` | 135 |
| **Total reader-facing** | **970** |

Ceiling 1,100 — 130 words of headroom for the drafter. The published issue is
**1,475 across 38 blocks**; this is a 34% cut with two more sections.

**Words before the first graphic: 76** (title 6 + dek 9 + hook 24 + primer 21 +
row 1's intro ≤ 20 = 80 at the absolute ceiling; budget 76). Floor is ≤ 80.
Published: 503, on a 341-word opening `prose` section. **That prose section is
deleted** — see §8.

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

### The timeline, re-cut to six (floor: ≤ 6 events, notes ≤ 20 words)

The published timeline runs **eight** events and one note carries **seven
numbers**. Six survive; each note carries at most two numbers.

| # | `date` | Label | `state` | Note (≤ 20 w, ≤ 2 numbers) |
|---|---|---|---|---|
| 1 | `2013` | Fuji listed by UNESCO. | `default` | Listed for its spiritual significance, the dwelling place of the gods — not only the view. |
| 2 | `2019` | The photograph of the line. | `fail` | Hundreds stacked on the summit ridge. Eleven climbers died that season. |
| 3 | `Jul 1 2024` | Fuji's first quota. | `key` | The Yoshida Trail is capped at 4,000 a day, with a ¥2,000 fee. |
| 4 | `2025 season` | Fuji doubles the price. | `key` | The fee goes to ¥4,000 and the gate shuts two hours earlier, at 2 p.m. |
| 5 | `Sep 1 2025` | Nepal enforces the new royalty. | `key` | The spring Everest fee jumps to $15,000, the first rise since 2015. |
| 6 | `Jul 1 2026` | Fuji's 2026 season opens. | `now` | Under the cap, the advance fee and the 2 p.m. gate. The crowd is now inventory. |

**Cut from the timeline:** *Jan–Feb 2025, the 6th amendment clears Cabinet and
Gazette* (the legal plumbing; the "first rise since 2015" in node 5 carries the
weight) and *2025–26, the wider Nepal bill still in committee* (a non-event, and
with the Nepali-only-guide clause, the garbage fee and the body-recovery
insurance all out of the issue, there is nothing left to label "proposed" — the
one proposed item that survives, the 7,000 m prerequisite, keeps its
`*(proposed)*` tag in the `comparison` row, which is where the verification
report found it).

**Annotations (RG-20, `data.annotations[]`, `at` = the event's `date` string):**

| `at` | `text` (≤ 12 words) | Words |
|---|---|---|
| `2019` | The photograph that made the queue visible. Eleven died that season. | 11 |
| `2025 season` | Fuji's fee doubles in one year: ¥2,000 to ¥4,000. | 9 |

These are the two the brief asked for. `timeline` is the **only** kind in this
spine with an annotation slot; the other seven have none and the drafter must
not author one (§8).

### How-to-read panels

**None.** No kind in this spine is in `NEEDS_HOW` (`src/lib/explainers.ts`) and
none is an instrument, so no `howToRead` is authored anywhere. Under RG-19 that
means zero panels render — eight blocks of copy the published issue carried and
this one does not.

---

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **Everest and Fuji now sell the *wait*** — 6 words, one italic accent word.
  Replaces "The Queue Is the *Product*", which names the subject and says
  nothing. Survives a share card and a search box; names two places the reader
  knows.

- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"Everest ka ticket: $15,000, about ₹12.5 lakh. Fuji ka ticket: ₹2,300. Both
  countries are now selling the same thing — your place in the line."**
  24 words. This is the operator-signed worked example in `_voice-core.md` §9,
  used verbatim. Two numbers the reader can feel, a "your", the twist in the
  last clause. **Conditional on the ₹ ruling in §5** — see §8 for the L1
  fallback and for the one register question it raises.

- **Dek (≤ 14 words; carries the Hindi if the title has none):**
  **"Two mountains, two methods, the same thing for sale."** — 9 words, L1.
  The Hindi sits in the hook instead; see §8, ruling 6.

- **Primer (three sentences: what happened · why it matters to you · what
  you'll see):**
  **"Nepal now charges $15,000 to climb Everest. Japan sells 4,000 timed Fuji
  slots a day. Below: what each ticket really buys."**
  21 words, ~128 characters — inside the 80–420 Zod bound with room. The
  published primer is 458 characters and **fails the build** (verification
  report, required fix #1); this replaces it.

Published head for comparison: title 5 words, hook 26 words with no number and
no "you", dek an antithesis ("Two mountains, two ways to put a price on the
line"), primer 458 chars / 68 words.

---

## 5. The Indian ground

**The dossier carries no Indian fact.** There is no count of Indian climbers on
Everest, no figure for Indian visitors to Japan or to Fuji, no Indian
institution in the story. The researcher did not look for one and the rewrite
may not add one: a new claim needs a source and the composer adds no sources.
So the Indian ground here is **currency, scale and habit** — none of which needs
a new fact.

### A. The ₹ for every $ and ¥ — three computations for the operator to rule

Each is arithmetic on a dossier figure, not a new claim. **The source line on
the section would name the rate**; the drafter adds no source entry.

| # | The figure | Dossier row | Proposed conversion | Proposed rate | Where it lands |
|---|---|---|---|---|---|
| 1 | $15,000 spring Everest royalty | §4 "$11,000 → $15,000, eff. 1 Sep 2025" | **about ₹12.5 lakh** | **₹83 to the dollar** | hook · `number-sense` `equals[0]`, with `note: "at ₹83 to the dollar"` |
| 1b | $11,000, the old fee | same row | **about ₹9.1 lakh**, i.e. the new fee is ~36% more | ₹83 to the dollar | `number-sense` `equals[2]` |
| 2 | ¥4,000 Fuji entry fee | §4 "¥4,000 per person per trip (2026)"; "¥4,000 ≈ US$25" | **about ₹2,300** | **₹0.58 to the yen** | hook · `data-readout` intro, once |
| 3 | One Everest permit = **about 600 Fuji tickets** | $15,000 ÷ ≈US$25, both dossier §4 | ratio only, no new currency | — | `number-sense` `equals[1]` |

Rate 1 (₹83) is **already in the repo**: the `number-sense` worked example in
`src/content/issues/2026-06-03-travel-showcase/index.mdx` was built from this
issue's permit and reads "about ₹12.5 lakh" / `note: "at ₹83 to the dollar"` /
"36 percent more than the ₹9.1 lakh it cost in 2024". If the operator accepts
it, that block ports straight across.
Rate 2 (₹0.58/¥) is the rate implied by `_voice-core.md` §9's own hook
("Fuji ka ticket: ₹2,300").
**The operator sets the as-of date**; the proposal is the rewrite's
republication date, stated in the source line as e.g. "conversions at ₹83 to
the dollar and ₹0.58 to the yen, ‹date›".

### B. The one rupee figure the dossier already carries — and its trap

Dossier §4, the full Nepal royalty table: **"Nepali citizens (spring) Rs 75,000
→ Rs 150,000."** This is the sharpest unused fact in the dossier — the same
permit, the same mountain, two prices depending on the passport — and it is the
"who is this priced for" question the whole issue is about. It goes in the
`number-sense` **`note`** (≤ 20 words).

> ⚠️ **These are NEPALI rupees, not Indian rupees.** Do not print them as ₹, do
> not convert them, do not set them beside the ₹12.5 lakh as if comparable. The
> dossier gives no NPR↔INR rate and the composer adds none. The drafter writes
> "Rs 150,000 in Nepali rupees" and stops there. Operator ruling 8 in §8.

### C. Scale and habit — no new fact needed

- **The Indian habit that *is* the Fuji mechanism:** booking a timed slot
  online, in advance, for a fixed window — a Tirupati darshan slot, an IRCTC
  berth, a tatkal window. Every reader owns it. It is an **analogy, not a
  claim**: the drafter attaches no number to it and needs no source. It carries
  row 2 (`you-think`) and row 4's third step (`three-steps`).
- **The queue you pay to skip** is a thing an Indian reader has met at a temple
  and a ticket counter. The issue's honest twist is that neither mountain sells
  that — Nepal has **no** paid queue-skip (dossier §4, [UNVERIFIED] block; the
  operator's chief risk) and Fuji sells a time, not a priority. Row 2's `note`
  states the negative outright, which is the strongest place to keep the false
  claim from creeping back in.
- **"4,000 a day"** is the whole trail's stock, sold before anyone arrives — the
  comparison the reader feels is a booked venue, not a crowd. No Indian number
  is asserted because the dossier carries none.

---

## 6. The three questions

Written from the dossier, not the draft. The reader panel answers them from the
draft alone.

1. **Q:** Both mountains now put a price on something. What is it?
   **A:** The wait — the queue, the timed slot, the few safe-weather hours
   everyone wants at once. Nepal re-priced entry to the line ($11,000 →
   $15,000) without capping numbers; Japan sells 4,000 dated slots a day at
   ¥4,000 each. · **dossier §1 (structural argument)**; §4 "Spring Everest
   royalty" and §4 "Daily cap: 4,000 climbers/day" + "Fee: ¥4,000 payable in
   advance to reserve".

2. **Q:** What does Nepal's higher fee *not* buy you?
   **A:** It does not cap how many people climb — there is no daily limit on
   Everest — and no amount of money buys a place at the front of the line. No
   paid priority or fast-track tier exists. · **dossier §4 [UNVERIFIED] block**
   ("Paid 'priority / skip-the-bottleneck' tier at Everest — no primary or
   authoritative source found"); §7 comparison row "Hard cap on numbers? → No
   explicit daily cap".

3. **Q:** Why was standing in a queue on Everest dangerous in the first place?
   **A:** Above about 7,950 metres — Camp 4, the South Col — there is so little
   oxygen that the body starts shutting down, and a climber has roughly three
   days there. Hundreds stacked on the summit ridge burn hours they cannot
   spare. Eleven died in the 2019 season and an Everest chronicler calculated
   as many as five of those may have been crowd-related. · **dossier §4
   "Everest South Col route — elevation profile"** (death zone from ~7,950 m,
   ~3 days); §4 "Recent death tolls" (2019: 11, ~5 crowd-related); §5 (the
   National Geographic crowding line).

---

## 7. Names

Ten named people, places and bodies in reader-facing copy — ceiling is 12. Each
is introduced with its role in the same sentence (`_voice-core.md` §3 rule 9).
The published issue also names Himal Gautam (once, no role) and the Nepal
Department of Tourism in body copy; both drop to the source line.

| # | Name | The role phrase that introduces it |
|---|---|---|
| 1 | **Everest** | the world's highest mountain, climbed from Nepal's side each spring |
| 2 | **Nepal** | the government that sets the permit price and enforces it |
| 3 | **Mount Fuji** | Japan's sacred volcano, 3,776 metres |
| 4 | **Yamanashi Prefecture** | the local government that runs the Yoshida Trail and sells its slots |
| 5 | **The Yoshida Trail** | the one route up Fuji that carries the cap |
| 6 | **Camp 4 / the South Col** | the shoulder at 7,950 metres where the death zone begins |
| 7 | **The summit ridge / Hillary Step** | the narrow stretch where the line backs up |
| 8 | **Nirmal Purja** | the climber whose 2019 photograph of the summit line went round the world |
| 9 | **Alan Arnette** | an Everest chronicler who has logged every season for twenty years |
| 10 | **UNESCO** | the body that listed Fuji in 2013 for its spiritual significance |

**Source line only, never in a sentence** (rule 9's ban on the stacked
citation): National Geographic · The Kathmandu Post · Yamanashi Prefecture /
fujisan-climb.jp · Skift · Syracuse JILC · Nepal Department of Tourism · Himal
Gautam. All eleven `sources[]` entries stay exactly as published.

---

## 8. Composer notes

### 8a. The published sections — carried, re-kinded, cut

| Published section | Fate | Detail |
|---|---|---|
| `prose` "THE BOTTLENECK" (341 words, 3 paragraphs + lead) | **CUT** | The single biggest defect: 503 words before the first graphic, on a section that tells what three components now show. Its argument goes to row 2 (`you-think`), its mechanism to row 4 (`three-steps`), its death-zone explanation to row 3's intro. Its one verbatim quote — see 8c. Its Fuji annual-climber range (220,000–400,000, dossier-flagged CONFLICTING) is **dropped entirely**: a component value must be one number, and the rewrite has no prose to hedge it in. |
| `elevation-trek` "THE DEATH ZONE" | **CARRIES OVER VERBATIM** | All seven `points` unchanged; `unit`, `caption`, `source` unchanged. Becomes the **hero** at `layout: split` (it was `default`). New intro (≤ 42 words, glosses "death zone"), plus the verifier's optional fix: the 8,790 m node named a profile point. |
| `data-readout` "WHAT EVEREST NOW COSTS" | **RE-KINDED, then cut** | Three of four tiles survive elsewhere: the $15,000 royalty becomes row 1 (`number-sense`, which does it better and in ₹); the 55-day validity and the 1:2 guide ratio are **already verbatim rows in the `comparison`** ("Time gate", "Competence screen"). The fourth tile — **$30,000–70,000 to recover a body — is dropped.** It prices a rule that is *proposed*, not enacted; its note was one of the two live `# EDITOR:` flags the verifier caught shipping as visible copy; and it is off the queue spine. Operator ruling 4. |
| `data-readout` "FUJI BY THE SLOT" | **CARRIES OVER VERBATIM** | All four tiles unchanged (4,000/day · ¥4,000 · 2 PM · 1 Jul – 10 Sep), `caption` and `source` unchanged. New shorter intro; the ₹2,300 said once there. |
| `comparison` "TWO WAYS TO PRICE A CROWD" | **CARRIES OVER VERBATIM** | All seven rows, both `sides`, the `source` — unchanged, in the published `sides`/`rows` form the component accepts. Keeps the `*(enacted)*` / `*(proposed)*` tags the verifier checked. New intro; the published one opens "Here's the thing:", which the verification report flagged. |
| `timeline` "THE RATCHET" | **RE-CUT** | 8 events → 6 (§3); every note rewritten to ≤ 20 words and ≤ 2 numbers (one published note carries seven); two `annotations[]` added under RG-20. Dates, labels, `state` values and `source` otherwise unchanged. |
| `paradox` "PAY MORE, STAY LESS" | **CARRIES OVER, TRIMMED** | Both `sides`, both `statement`s and the `caption` unchanged; the two `detail` fields trimmed to ≤ 38 words each (floor is 45). The intro loses its closing "That is the point.", which the verification report flagged as meta-commentary. |
| — | **NEW: `number-sense`** | Row 1. Data from dossier §4 + the §5 conversions. |
| — | **NEW: `you-think`** | Row 2. Data from dossier §1 + §4 + the [UNVERIFIED] block's negative. |
| — | **NEW: `three-steps`** | Row 4. Text only, from dossier §1. |

### 8b. Kinds considered and rejected

- **`altitude-oxygen`** (travel signature, G9) — *the better hero, blocked for
  want of data.* It draws exactly the issue's mechanism: the oxygen column
  narrowing with height, so the reader sees *why* an hour spent at 8,000 m is
  not an hour. But its `stops[]` want acclimatisation `nights` the dossier does
  not have, and its x-axis is **modelled** effective O₂ with a mandatory
  `model:` chip — a value the issue cannot trace to a source. Not available.
  `elevation-trek`, whose data is published and already verified, keeps the
  hero.
- **`queue-cliff`** (tech, G10) — thematically perfect (the wait stays flat then
  snaps vertical near full load) and cross-world kinds are allowed. It needs a
  service rate μ or a service time; the dossier has no arrival or service rates
  for either mountain, and faking one would be inventing the issue's central
  number. Not available.
- **`benchmark-chart`** (G5, and one of the eight annotated kinds) — the
  dossier's **full Nepal royalty table** (Everest spring $15,000, autumn
  $7,500, winter/monsoon $3,750, other 8,000 m peaks $3,000) is a genuine
  ranked one-metric set and would take an annotation on the Everest bar.
  Rejected on two grounds: the table mixes USD with the Nepali-rupee citizen
  rate, so one honest axis cannot hold all of it, and the word budget is better
  spent on the two new plain-language kinds. **This is the best available ninth
  section if the operator wants a second annotated chart** — ruling 9.
- **`jargon-buster`** — there are exactly two terms of art, "death zone" and
  "royalty". The catalog says gloss one term in the sentence; the voice contract
  (§3 rule 2) says gloss it *the moment it appears*, not in a separate section.
  Both glosses are assigned to the rows that need them (rows 3 and 1). A third
  text-only row would also cost ~60 words for no new information. Ruling 5.
- **`quote`** — see 8c.
- **`analogy`** (G1, generalised) — the this↔that mapping (Everest ↔ a temple
  queue; Fuji ↔ a booked berth) is tempting, but it is a third text-only row and
  both mappings land harder *inside* `three-steps` and the `you-think` note,
  where they sit next to the number.
- **`city-compare`** (travel signature, G2) — exactly two places, per-row
  winners. The rows here are rules, not metrics, and there is no winner per
  row; `comparison` is the right kind and its data is already authored.
- **`journey-map` / `route-card`** (travel signatures, G7) — the South Col camps
  are a stop sequence, but `elevation-trek` already renders them *and* shows the
  height that carries the argument. Duplication.
- **`throughput-dial`** (G3) — 4,000/day against a maximum; the dossier gives no
  trail capacity other than the cap itself, so the gauge would have no scale.
  Not available.
- **`attrition-waffle`** (travel, G6) — "11 deaths, ~5 crowd-related" is not a
  rate out of 100, and the 374-climber 2025 season is not normalised. The
  countability *is* the kind. Not available.
- **`act-break`** — not used. RG-06's recommended ruling is to **drop** the act
  rule rather than enforce it (zero uses in 23 issues). If the operator takes
  the other branch, one `act-break` goes before row 7 and the visual share
  falls to 6 of 9 = 67%, still above the floor.
- **`plate`** — no image exists; it renders nothing.
- **`hero`** — retired; never used.

### 8c. What the rewrite gives up, on purpose

**The verbatim National Geographic quote.** The published `prose` carries the
only sourced quote in the issue — *"If the crowds aren't directly culpable for
killing people, they are unquestionably responsible for increasing the risks by
necessitating longer summit days…"* — reproduced character-perfect and
attributed to the magazine, not a person (the verifier checked both). It dies
with the prose section. Reasons: it is 33 words of dense English in an issue cut
to 970; it is magazine narration, so there is no person to name; and a `quote`
row would be a third text-only section. Its **finding** survives, paraphrased,
in row 3's intro and row 4's second step, with src-01 on the source line. A
paraphrase of narration names nobody and invents nothing. **Operator ruling 5**
— it is available and sourced if wanted, at ~60 words and one more text row.

**The one binary reframe is already spent.** `_voice-core.md` §6 tell 2 allows
*"It is not X. It is Y."* once per issue, and only when the reversal is the
argument. Here the reversal *is* the argument — and the `you-think` component's
two panels are it, structurally. **No prose field may add another.** The
published issue used it three times (hook, lead, and again in paragraph 2),
which the verifier flagged as required fix #3.

### 8d. Standing constraints the drafter must not break

1. **No paid Everest queue-skip, anywhere, in any wording.** The dossier's §9
   calls this the candidate's most exposed claim. Row 2's `note` states the
   negative explicitly, which is deliberate.
2. **Only the enacted Nepal facts are current:** the $15,000 royalty, the 55-day
   validity, the 1:2 guide ratio. The 7,000 m prerequisite keeps its
   `*(proposed)*` tag in the `comparison` row; everything else in that bill is
   out of the issue entirely.
3. **Absent, as published:** the 3,000-advance / 1,000-same-day reservation
   split and the 27 April 2026 reservation-open date (both [UNVERIFIED]).
4. **Annotations exist on `timeline` only.** The other seven kinds in this spine
   have no `annotations[]` slot; authoring one is a silent no-op.
5. **No `howToRead` on any row** — none of the eight kinds is in `NEEDS_HOW`.
6. `caption` = the data claim (traced) · `plain` = the form · never swapped.
7. **Numbers are copied, never retyped.** Every figure above traces to the
   published issue, whose numbers the verifier already traced to the dossier.

### 8e. For the operator to rule, before the draft runs

| # | Ruling | Why it blocks |
|---|---|---|
| 1 | **The two currency rates: ₹83 to the dollar, ₹0.58 to the yen, as of a date you set.** | The hook, row 1 and row 5's intro all depend on them. Rate 1 is already live in `2026-06-03-travel-showcase`. If refused, the head reverts to L1 dollars and yen and the issue loses its Indian ground entirely — there is no other Indian fact in the dossier. |
| 2 | **The derived ratio: one Everest permit ≈ 600 Fuji tickets** ($15,000 ÷ ≈US$25, both dossier §4). | It is arithmetic on two sourced figures, but the ≈$25 is itself a secondary source's conversion. Cheap to drop — row 1 then runs on two `equals` lines instead of three. |
| 3 | **Does `number-sense` satisfy the §5.1 floor "the first section after the head is a graphic or a `data-readout`"?** | It is G3, the same shape group as `data-readout`, a VizCard with its own caption, source and plain line, and it is literally "the number leads". If you read the floor more narrowly, swap rows 1 and 5 so the Fuji `data-readout` opens; the head's ≤ 80-word budget holds either way. |
| 4 | **The $30,000–70,000 body-recovery figure is dropped.** | It is a verified cost attached to a *proposed* rule, and it was one of the two `# EDITOR:` flags the verifier found shipping as visible copy. Rule it back as an eighth `comparison` row ("What a death costs · $30,000–70,000 · —") if you want it. |
| 5 | **The verbatim NatGeo quote is cut**, and `jargon-buster` is not used. | Both are word-budget and block-count calls, both reversible at ~60 words each. |
| 6 | **The dek is L1, with no Hindi.** | `_voice-core.md` §3 rule 12 says the dek carries the Hindi when the title has none. The hook carries it instead, and no Hindi phrase passes all four tests inside a 9-word dek here — every candidate failed the skip test. The contract's own instruction is "when in doubt, leave it out." Confirm or send back a dek. |
| 7 | **"Everest ka ticket: $15,000"** puts a Hindi particle immediately beside a number. | §2's fourth test says Hindi goes nowhere near a number — but §9's signed worked example *is* this exact line, and *ka* is a possessive that cannot soften a figure. The contract appears to contradict itself; the hook is the place it shows. L1 fallback, 22 words: *"An Everest ticket costs $15,000, about ₹12.5 lakh. A Fuji ticket costs ₹2,300. Both countries are selling your place in the line."* |
| 8 | **Rs 150,000 for a Nepali citizen is in NEPALI rupees.** | The dossier gives no NPR↔INR rate. It stays unconverted and is never set beside ₹12.5 lakh as a comparison. Confirm the drafter may print it at all. |
| 9 | **Optional ninth section: `benchmark-chart` of the full Nepal royalty table** (spring / autumn / winter / other 8,000 m peaks), with an annotation on the Everest bar. | +~110 words (total 1,080, still under 1,100) and a second annotated chart. Blocked only by the USD/NPR axis problem: the citizen rate would have to be left off the chart and said in the note. |
| 10 | **`act-break`.** | Not used, per RG-06's recommended branch. If you enforce the act rule instead, one goes before row 7. |
