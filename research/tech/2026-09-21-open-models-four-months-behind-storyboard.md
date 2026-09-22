# Storyboard: Open models are four months behind, not years

- **Category:** tech
- **Dossier:** research/tech/2026-09-17-open-models-four-months-behind-dossier.md
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
> `story:` block to remap, no `NUMBER-DRIFT` exposure. The exposure inverts:
> every graphic here is new, so the drawing rule (`dossier-data-gaps`, "a range
> is not a value") is where an invented number would enter. This spine puts no
> unsourced value on any mark — see §8, ruling 2.
>
> **One structural change from the dossier's §7, and the operator should read
> it first.** The dossier proposes `scaling-plot` as the hero, drawing "two
> families (open, closed) with a fit line each". **The component cannot do
> that.** Its DATA is a single `points[]` array with one optional `fit`, and
> `ScalingPlot.astro` line 208 says so in terms: *"There is no `series` here —
> a scatter has one."* The two-family chart is not buildable in this library at
> all (§8, ruling 1). The spine below routes that beat to `timeline` +
> `benchmark-chart` and moves the hero to `arch-stack`.

---

## 1. The argument in one line

Open models are four months behind the closed frontier, not four years. That
gap is now the cheap part of the problem, and almost nobody takes the offer.

## 2. The hero

**`arch-stack`** (G6 · composition, parts of a whole, layers) — row 6,
`layout: split`, the only section that takes it.

Five slabs, top to bottom: **Weights · Licence · Code · Training data · Compute
and serving.** It renders §4.7 in full — the Stanford HAI weights/source
distinction, the Hugging Face licence census (81% of Chinese releases above 20B
permissive against 29% of American ones), and the AI Now line that compute
stays "prohibitively expensive and scarce".

**Why this and not the measurement chart.** The issue's title is about four
months, but its *argument* is the last line of the dossier's §1: the gap that
decides who uses these models was never the capability gap. `arch-stack` is the
only component in the spine that draws that sentence. The reader sees one free
slab sitting on four that are not, and the whole first half of the issue — the
timeline, the benchmark decomposition, the lineage — becomes the set-up for it.
It is also tech-native (CSS-3D), new to readers, and its DATA is five labels
with five sublabels, all sourced, none derived.

It is not "loud" under CANON §3 (loud = WebGL, `bleed`, or full-width animated);
this issue has no WebGL and no `bleed`, so the ≤ 3-loud and no-two-WebGL-adjacent
ceilings are satisfied trivially. The eye-rest rule holds: row 7 (`number-sense`)
is quiet.

## 3. The beats

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | You think open models are years behind the paid ones. Two separate measurements say months, and the gap stopped closing. | G2 | `you-think` | — | **95** · `think` ≤26, `actually` ≤26, `note` ≤14, caption ≤14. **No `intro`** (HEAD-HEAVY) | — (the reframe is the analogy) | default — do not author | §4.1 (Epoch 3→4 months; the Arena 0.5%→3.3% check) |
| 2 | Three words decide this story, and one of them is doing work you did not agree to. | G1 | `jargon-buster` | — | **100** · intro ≤25, 3 terms × meaning ≤20 | "Open weights is the recipe's finished cake, not the recipe." | — (narrative kind; takes none) | §4.2, §4.7 · glosses already in `research/_voice/jargon.md` L96–98 |
| 3 | The gap shrank, then stopped, then widened a little. Here are the five dates that show it. | G4 | `timeline` | — | **150** · 5 events, `note` ≤12, intro ≤25, 1 annotation ≤8 | — | default — do not author | §3 rows + §4.1, §4.3 (the 84-day proof) |
| 4 | "Eight points" is an average, and the average hides everything. Three points apart on graduate science. Fifty-eight apart on a puzzle game. | G5 | `benchmark-chart` | — | **140** · 4 items, `sublabel` ≤9, intro ≤28, 2 annotations ≤9 | "Two students, same final mark, one of them cannot do word problems." | **AUTHOR IT** — the default promises a reference line this chart does not have | §4.5 (the only four cleanly paired benchmarks) |
| 5 | The labs actually at the open frontier are not the ones you have heard of. | G11 | `version-graph` | — | **125** · 10 nodes, `label` ≤4, intro ≤28 | — | **AUTHOR IT** — lanes are labs here, not branches of one project | §4.6 (trimmed to 10 of 18 — see §8) |
| 6 | The weights are free. They are one slab of five, and the four underneath them are not downloadable at any price. | G6 | `arch-stack` | **HERO** · `layout: split` | **155** · 5 layers, `sublabel` ≤13, intro ≤35 | "You were given the car. Not the fuel, not the road, not the licence." | **AUTHOR IT** — the default says "what users touch"; this stack is what you can download | §4.7 (all five layers, each sourced) |
| 7 | What a million tokens costs, in rupees, and what the same question costs in Hindi. | G3 | `number-sense` | — | **115** · 3 `equals` ≤13, `note` ≤18, intro ≤25 | The ₹ ladder **is** the everyday comparison | default — do not author | §4.4, §4.9 (the tokeniser tax) |
| 8 | The offer was free, dated and on the table. Almost nobody took it, and that is the finding. | G1 | `prose` | — | **115** · `paragraphs` ≤95, skimCaption ≤12 | **MUST carry both markers** — see §8 ruling 5 | — (prose takes none) | §4.8 (139 / 56 / 40% / zero; 83% under 1B) |

**Head: 65 words.** Row 1 carries eyebrow + title only and **no `intro`**, so the
words-before-the-first-graphic count is **65 + 7 = 72** against the cap of 80.
`check-prose.mjs` line 300 adds each section's eyebrow, title and intro and only
breaks *after* the first non-`TEXT_ONLY` section, so row 1's chrome is inside the
count. Do not add an intro to row 1.

**Budgeted total: 1,063 reader-facing words** against the 1,100 cap — 37 spare.
This counts every `eyebrow`, `title`, `intro`, `plain`, `howToRead`, `caption`,
`skimCaption`, `source` **and every string inside `data`** (`readerWords`,
line 264). A budget built from intros alone under-reads this issue by ~300 words,
because `version-graph` and `arch-stack` pay for every label they draw.

**Designated slack, in order of use:** row 8 `prose` (95 → 75 costs nothing
structural), then row 3 `timeline` (5 events → 4, drop the 2025-10-30 row and
put "three months" in the `you-think`).

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

### Row data, fixed here so the drafter does not re-derive it

**Row 3 · `timeline` — 5 events. Model names go in `label`, never in `note`.**
`label` is not scanned by the name counter; `note` is (line 400). This is the
single technique that keeps a lab-dense issue inside the 12-name cap.

| date | label | note (≤12 words) | state |
|---|---|---|---|
| 2025-10-30 | Epoch AI reads the gap | Three months behind, averaged across nearly three years. | `default` |
| 2026-04-23 | GPT-5.5 · ECI 158.22 | The closed frontier sets a mark. | `default` |
| 2026-05-29 | Epoch AI reads it again | Four months now. The gap widened, it did not close. | `key` |
| 2026-07-16 | Kimi K3 · ECI 158 | Announced 16 July. Weights released 27 July. | `key` |
| 2026-09-03 | GPT-6 Astra · ECI 166 | Eight points ahead again. | `now` |

- `annotations: [{ at: '2026-07-16', text: "April's frontier, reached 84 days later" }]` (6 words)
- `source`: Epoch AI data insight and model pages, accessed September 2026

**Row 4 · `benchmark-chart` — draw THE GAP, not the two scores.** The component
takes one `value` per item (`{items:[{label,value,sublabel?,highlight?}]}`), so a
grouped two-bar-per-benchmark chart is not available. Draw the gap in points as
the value and let `sublabel` carry both underlying scores — honest, and it makes
the spread the subject, which is the beat.

| label | value | sublabel | highlight |
|---|---|---|---|
| Mystery Game Puzzles | 58 | Open 26% · closed 84% | |
| Chess Puzzles | 33 | Open 39% · closed 72% | |
| SimpleQA Verified | 25 | Open 51% · closed 76% | |
| GPQA Diamond | 3 | Open 93% · closed 96% | ✓ |

`sortDesc: true`, `unit: 'points'`. The tall bar leads and **GPQA lands last as
the finding** — near-parity on graduate science, which is the counter-intuitive
part. `highlight` sits on GPQA because the argument is about that bar, not the
biggest one. **No `refValue`** — hence the authored `plain`.
- `annotations`: `[{at:'GPQA Diamond', text:'Three points apart on graduate science'}, {at:'Mystery Game Puzzles', text:'Fifty-eight apart on a puzzle game'}]`
- **FrontierMath is excluded and must stay excluded** (§4.5 — the two scores are
  on different versions). ARC-AGI-2 has no paired figure. Four rows is all there is.

**Row 5 · `version-graph` — 10 nodes, not the dossier's 18.** Eighteen nodes cost
~90 reader words in labels alone and crowd five lanes. These ten keep every lane,
the DeepSeek fork (which is what the kind is *for*), the Moonshot climb, and a
two-node closed reference.

| id | lane | label | tag | parents |
|---|---|---|---|---|
| `ds-v32` | 0 DeepSeek | DeepSeek V3.2 | open | — |
| `ds-v4pro` | 0 DeepSeek | V4-Pro · MIT | open | `ds-v32` |
| `ds-v4flash` | 0 DeepSeek | V4-Flash · MIT | open | `ds-v32` |
| `k2-thinking` | 1 Moonshot | Kimi K2 Thinking | open | — |
| `k26` | 1 Moonshot | Kimi K2.6 | open | `k2-thinking` |
| `k3` | 1 Moonshot | Kimi K3 · 2.8T | open | `k26` |
| `glm5` | 2 Zhipu | GLM-5 | open | — |
| `glm51` | 2 Zhipu | GLM-5.1 | open | `glm5` |
| `gpt55` | 4 closed | GPT-5.5 | closed | — |
| `astra` | 4 closed | GPT-6 Astra | closed | `gpt55` |

Alibaba's lane is dropped rather than shown with one node — Qwen's story is
downloads, not frontier ECI, and it lands in row 8 where it belongs. **Qwen 3.8
Max stays out entirely** (§9 item 8: no sourced date or ECI).

**Row 6 · `arch-stack` (HERO) — five layers, top to bottom.**

| label | sublabel (≤13 words) |
|---|---|
| Weights | Downloadable today. Kimi K3, DeepSeek V4, Qwen. The layer everyone means. |
| Licence | Permissive for 81% of Chinese releases above 20B. Only 29% of American ones. |
| Code | Inference code usually. Training code rarely. |
| Training data | Almost never released. You cannot see what the thing was trained on. |
| Compute and serving | Not downloadable at any licence. The cluster is the real bill. |

The licence row rests on the **Hugging Face census percentages, not on Kimi K3's
own licence**, which the dossier could not confirm (§9 item 8). Do not state K3's
licence anywhere. DeepSeek V4's MIT is confirmed and is the one licence the issue
may name.

**Row 7 · `number-sense`.** `value: 4795`, `unit: '₹'`,
`label: 'One million output tokens, GPT-6 Astra'`.
- equals 1: "The same million from the best open model: ₹1,439" · note: "$15 per million"
- equals 2: "From DeepSeek V4-Flash: ₹27" · note: "$0.28 per million output tokens"
- `note` (≤18): "Ask the same question in an Indian language and it costs about five times the English price."
- `source`: must carry **"converted at ₹95.9 to the dollar, September 2026"** (contract §3 rule 4).

## 4. The head

- **Title (states the finding, ≤ 8 words):** **Open models are four months behind, not years** (8)
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):** **Kimi K3 took 84 days to reach the frontier OpenAI had in April. You can download it free. Almost nobody has.** (21)
- **Dek (≤ 14 words):** **And the four months is the cheap part.** (8)
- **Primer (three sentences):** **Epoch AI puts open models four months behind the closed frontier. The gap is small and has stopped shrinking. We show what those four months hide.** (28 words, ~155 chars — inside the 80–420 bound)

**Head total 65.** Sentence lengths in the hook are **13 / 5 / 3** — two short
sentences in a row, not three, so `STACCATO` does not fire. **Do not shorten the
first sentence**; at 13 it is the only thing holding that flag off.

## 5. The Indian ground

Every item below is sourced in the dossier. Nothing here is a new claim.

1. **The tokeniser tax — the anchor.** The same question in an Indian language
   costs about five times what it costs in English (§4.9, Rest of World, 7 April
   2026). It sits in row 7's `note`, right under the rupee ladder, because that
   is where it bites: with a closed API you simply pay the multiplier, and with
   open weights the tokeniser is a thing you can change. **This is also the hinge
   to the published `2026-06-04-ai-coding-token-bill` issue** — name the
   relationship once, in row 8, and not again (§9 item 11).
2. **The rupee ladder (§4.4), current figures, so they take brackets** (contract
   §3 rule 4): a million output tokens is **₹4,795** from GPT-6 Astra, **₹1,439**
   from Kimi K3, **₹27** from DeepSeek V4-Flash. Rate **₹95.9 = $1, September
   2026**, on row 7's source line.
3. **An Indian institution taking the offer:** Sarvam AI adapts open-weight base
   models to Indian languages and builds better tokens for them (§4.9). One
   mention, in row 8. Krutrim and the Delhi AI Impact Summit are available and
   are **held in reserve** — spending them costs two more names (§7).
4. **What the dossier does NOT have, and the issue must not invent** (§4.9, §9
   item 9): any figure for Indian adoption of open-weight models, any rupee cost
   for an Indian open-model deployment, and whether any Indian project sits among
   the Sovereign AI Index's 139. A scale comparison needs no new fact; a new claim
   needs a source, and this storyboard adds none.

**Currency composition check.** No ₹ appears inside any dated `timeline` event
(row 3 carries no prices at all), and the issue builds **no multi-model per-token
rate card** — the two clauses added on 2026-09-15. Row 7 is one current price
with its equivalents, which is exactly what rule 4 asks for. See §8 ruling 6:
those two clauses are recorded in `AGENTS.md` but are **not in the runtime
contract**, and that gap is the operator's to close.

## 6. The three questions

1. **Q:** How far behind the best closed model is the best open one, and is that
   gap growing or shrinking?
   **A:** About four months — 8 points on Epoch AI's capability index. It stopped
   shrinking in 2025 and has widened slightly since: three months, then four. A
   second and different measurement, of which model people actually prefer, moved
   the same way (0.5% to 3.3%). · dossier **§4.1**
2. **Q:** What do you actually get when a model's weights are "open"?
   **A:** The weights file, and that is the top layer of five. The licence may
   restrict you, the inference code usually ships but the training code rarely
   does, the training data is almost never released, and the compute to serve it
   is not downloadable at any licence. · dossier **§4.7**, **§4.2**
3. **Q:** If today's frontier is four months old and free, why do so few take it?
   **A:** Because the four months is the cheap part. Of 139 state-backed AI
   projects across 56 countries, 40% chose Llama and none chose the labs actually
   at the open frontier. And 83% of all downloads go to models under one billion
   parameters. · dossier **§4.8**

## 7. Names

The name counter scans body fields plus `title` / `hook` / `dek` / `primer` /
`caption` (line 400). It does **not** scan `label`, `sublabel` or `tag` — so
every lab in rows 3, 4, 5 and 6 rides in a graphic label for free. **Twelve is
the cap and this list is exactly twelve. Do not add a thirteenth.**

| # | Name | Role phrase that introduces it |
|---|---|---|
| 1 | **Epoch AI** | the research group that built the capability index this issue leans on |
| 2 | **Kimi K3** | the best open-weight model anyone has measured |
| 3 | **Moonshot** | the Chinese lab behind Kimi |
| 4 | **GPT-6 Astra** | the closed model at the top of the same index |
| 5 | **OpenAI** | the company that makes it |
| 6 | **GPT-5.5** | the April model K3 caught in July |
| 7 | **DeepSeek** | the Chinese lab that put V4 out under an MIT licence |
| 8 | **Hugging Face** | the site where open weights are actually downloaded |
| 9 | **Llama** | Meta's open-weight model, the one governments picked |
| 10 | **Meta** | the company that gives it away |
| 11 | **Sarvam AI** | the Indian company teaching Indian languages to open models |
| 12 | **India / Indian** | counted by the heuristic; unavoidable and wanted |

**Described, never named** (each would cost a slot and buys nothing): Stanford
HAI, Rest of World, Simon Willison, Nathan Lambert, James Landay, AI Now, Zhipu,
Alibaba, Qwen, Vivek Raghavan, Bhavish Aggarwal, Krutrim, Sam Altman, Mohammed
Soliman, Pablo Chavez, Raffi Krikorian. **All attribution moves to the `source`
line**, which is not scanned. "A second, independent measurement of which model
people prefer" carries Stanford; the source line names it.

**This also disposes of the quote-attribution problem.** The dossier's §5 flags
the Altman, Soliman and Chavez lines as reported wording not matched to a primary
record. **This spine carries no `quote` row and no reported quotation at all**, so
the fallback never has to be invoked. If the operator wants Landay's "That's open
*distribution*" line restored, it costs a name, a row and ~120 words — see §8.

## 8. Composer notes

### Rulings the operator should make before the draft

**1. The dossier's hero is not buildable, and I have replaced it.** §7 row 1 asks
`scaling-plot` to draw "two families (open, closed) with a fit line each". Its
DATA is `{points:[{x,y,label?}], …, fit?}` — one series, one fit — and
`ScalingPlot.astro` line 208 states it outright: *"There is no `series` here — a
scatter has one."* I checked the three alternatives before moving the beat:

| Kind | Why not |
|---|---|
| `elo-river` (new, the dossier's own alternate) | It is a **stacked streamgraph**: ribbon *thickness* is the rating and the ribbons stack (`EloRiver.astro` L114–116, rFloor = min − 20). A ribbon's vertical position is the cumulative stack, not its rating, so **a constant open/closed gap is not readable off it at all**. With every ECI between 145 and 166 the ten ribbons would also be near-identical in thickness with almost no crossovers — the one thing the kind exists to show. |
| `approval-chart` (new, two series over time — the right shape) | `DON'T USE: non-opinion series`. And the legend is hardcoded: `ApprovalChart.astro` L156–157 print "Approve · now X%" and "Disapprove · now X%". It would print the wrong words on the page. |
| `scaling-plot`, open models only, single series + fit | Honest and buildable, but it draws the open frontier climbing with **the closed frontier absent**, which deletes the gap — the whole argument. |

So the measurement beat splits: `timeline` carries it over time (including the
3→4-month reversal and the 84-day proof), `benchmark-chart` carries what the 8
points are made of. **This is a real library gap and worth recording:** the
publication has no kind that draws two named series against a shared date axis
for non-opinion data. If the operator wants one, that is a component job, not a
composition one.

**2. Nothing on any mark is derived.** Every value drawn is a sourced figure read
straight from the dossier: five dated ECI readings (row 3), four benchmark gaps
that are subtractions of two sourced percentages with both printed in the
`sublabel` (row 4), ten dated releases (row 5), five layer descriptions (row 6),
three prices (row 7). No midpoint, no interpolation, no ratio standing in for a
value. The one arithmetic step anywhere is `96 − 93 = 3` and its siblings, shown
alongside their inputs.

**3. Epoch's understatement caveat is mandatory and I have placed it.** §9 item 2:
the gap "may tend to understate the true gap" because open models "more
aggressively hillclimb on public benchmarks". **It goes in row 4's `intro`** —
the row about what the average hides is the only honest home for it, and the
drawing rule applies: an issue whose thesis is "the gap is small" must carry the
strongest argument against itself. Budgeted inside row 4's 28-word intro. **If the
drafter cannot fit it there, it takes slack from row 8, not deletion.**

**4. Do not convert four months into eight points, or the reverse.** §9 item 1 is
the single most likely place this issue manufactures false precision. The two are
different measurements of the same window — one horizontal, one vertical — and
8 ÷ 14 is 6.9 months, not four. **Present them side by side, each as its own
reading, and never write "8 points, which is four months".** Row 3's notes and
row 4's intro are where this would go wrong. Same for ranking: K3 is **11th of
249 on Epoch's index**; a different index on an earlier date said third (§9 item
7). Name the index and the date or say neither.

**5. Row 8 `prose` must carry two literal markers or the gate fires.**
`NO-RESTATEMENT` and `NO-ANALOGY` fire on *every* `prose` section unless it
contains a hard-coded marker from each list — "that means / which means / the
point is / for context / in other words" and "think of / like a / imagine / the
way a / is like". Good plain prose still fails this by accident. Also:
`NUMBER-DENSE` fires at **3 numerals in one sentence** in body keys, and
`paragraphs` is one — so 139, 56, 40 and zero **must be split across sentences**.

**6. A documented rule is missing from the runtime contract.** `AGENTS.md`
(2026-09-15) records two composition clauses on the currency rule — no ₹ inside a
dated `timeline` event, and none on a per-token rate card. **Neither clause is in
`research/_voice/_voice-core.md`.** I grepped the whole `_voice/` directory: no
match for "rate card", "timeline event" or "regardless of vintage". I have
honoured both anyway (§5). The gap is the operator's to close, and it will recur
on this desk, which prices something in every issue.

**7. Two `[UNVERIFIED]` items are load-bearing and I have composed around both.**
- **Kimi K3's licence.** Hugging Face's census says K3 is "starting to include
  some non-commercial restrictions and revenue share requirements" — which **cuts
  against this issue's own argument** and by the drawing rule should be carried if
  confirmed. It is not confirmed. Row 6's licence slab therefore rests on the
  census percentages and names no model's licence except DeepSeek V4's MIT, which
  is confirmed. **If the operator confirms K3's licence before the draft, it
  belongs in row 6's `intro` and it makes the issue stronger, not weaker.**
- **K3's weight-file size ("1.56TB").** A lovely concrete number for the hero's
  bottom slab and **not confirmed**. Use the confirmed **DeepSeek V4-Pro figure,
  865GB**, or no number. Do not print 1.56TB.
- The local-hardware figure (K2.5 at ~1.7 tokens/second on a 128GB M4 Max) is
  also unconfirmed and would have been the ideal honest counterweight. Left out.
  **One fetch of the Hugging Face model card would settle both this and the file
  size** — the highest-value research note this storyboard can leave behind.

**8. The ₹ rate's source is off-allowlist.** §4.4 uses federalreserve.gov, which
is not on `research/_sources/tech.md`. The rate is a lookup, not a Parallax claim,
but the dossier's own suggestion is the clean fix: **add `rbi.org.in` to the tech
allowlist**. This desk hits the currency rule on every issue that prices anything.

### Kinds considered and rejected, with the exact blocker

| Kind | New? | Why it is not available |
|---|---|---|
| `scaling-plot` | published | One series only — see ruling 1. Available as a single-series open-frontier scatter if the operator wants a 9th row; costs ~120 words and deletes the gap it is meant to show. |
| `elo-river` | **new** | Stacked streamgraph; the gap is not readable. Ruling 1. |
| `approval-chart` | **new** | `DON'T USE: non-opinion series`, plus hardcoded "Approve/Disapprove" legend. Ruling 1. |
| `moore-ladder` | **new** | The dossier already rejected it and is right: 65B → 2.8T is 1.6 orders of magnitude against the catalog's ≥ 3, and ≥ 6 points. A log₂ ladder on that range misuses the axis. |
| `channel-ternary` | **new** | Needs 4–12 entities; the licence split has two (Chinese labs, American labs). **Builds fail outside the range.** |
| `neural-flow` | **new** | Needs real per-layer unit counts. K3 publishes 2.8T parameters and MoE routing, not per-layer sizes. Cannot be sourced; inventing them is forbidden. |
| `attrition-waffle` | **new** | The obvious home for "139 projects, 40% Llama, zero open-frontier". Needs groups summing to **exactly 100** and a real n; the dossier gives 40% and 0% with the remaining 60% unstated. **Throws at build time on a bad sum.** The beat goes to row 8 prose. |
| `comparison` | published | The dossier offers it for the licence split. It is in the gate's `TEXT_ONLY` set, so it buys **no** visual share, and its content is already row 6's licence slab. Rejected to protect the floors. |
| `data-readout` | published | Would suit the live gap (166 · 158 · 8.0), but the plain-card cap is 3 and rows 1, 2 and 7 spend it. The numbers live in row 3's labels instead. |
| `quote` | published | No row. The dossier's strongest lines are reported wording flagged under the attribution fallback (§5), and a `quote` row is the first thing the word budget kills. See §7 for the cost of restoring Landay. |
| `act-break` | **new** | CANON §3 asks for acts, but `act-break` has **never been published** and none of the ten rewritten issues uses one. It is `TEXT_ONLY`, so adding two would push text-only rows to four and break both the adjacency rule and the 60% floor on an 8-row spine. Not used; flagged so the operator sees it was a decision, not an oversight. |

### Composition arithmetic, so the operator can check it in one pass

- **8 sections** (CANON §3 wants 6–12) · **1 hero** · **0 WebGL** · **0 `bleed`** · **0 loud**
- `TEXT_ONLY` rows are **2 and 8** — never adjacent (rows 1, 3, 7 around them are not text-only), so `PROSE-RUN` cannot fire
- Row 1 is `you-think`, which is **not** in `TEXT_ONLY`, so `NO-LEAD-GRAPHIC` passes on `firstVisual === 0`
- **1 `prose`** section against a cap of 3 · **0 `paradox`** against a cap of 1
- Layouts: row 6 `split` (hero), rows 4 and 5 `wide`, the rest `default`
- `plain` **authored** on rows 4, 5, 6 (their EXPLAIN defaults are wrong for this
  use — `benchmark-chart`'s promises a reference line this chart lacks,
  `arch-stack`'s says "what users touch", `version-graph`'s assumes one project).
  Rows 1, 3, 7 take the default. Rows 2 and 8 take none.

## 9. Kind ledger

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| `you-think` | 1 | No — plain-language card | No (all ten published issues) |
| `jargon-buster` | 2 | No — `TEXT_ONLY` | No (seven published issues) |
| `timeline` | 3 | **Yes** | No (nine published issues) |
| `benchmark-chart` | 4 | **Yes** | No |
| `version-graph` | 5 | **Yes** | **Yes** |
| `arch-stack` | 6 | **Yes** | **Yes** |
| `number-sense` | 7 | No — plain-language card | No (eight published issues) |
| `prose` | 8 | No — `TEXT_ONLY` | No |

- **Drawn graphics:** **4 of 8 = 50%** (floor 40% ✓) · distinct graphic kinds: **4** — `timeline`, `benchmark-chart`, `version-graph`, `arch-stack` (floor 3 ✓)
- **Plain-language cards** (you-think · number-sense · jargon-buster · three-steps): **3** — `you-think` ×1, `jargon-buster` ×1, `number-sense` ×1 (cap 3 ✓, one of each ✓). `data-readout` and `three-steps` unused.
- **Visual share** (not `TEXT_ONLY`): **6 of 8 = 75%** (floor 60% ✓)
- **New kinds: 2** (floor 2 ✓)
  - **`version-graph`** — G11, network/DAG. Fills the release-lineage shape: ten dated releases across four lanes with a genuine branch (DeepSeek V4 forking into Pro and Flash from V3.2), which is precisely the kind's USE WHEN. Tech's own signature kind.
  - **`arch-stack`** — G6, layers. Fills the composition shape: five named layers of "open", top to bottom, each sourced. Tech's own signature kind, and the hero.
- **Verified unclaimed.** Both are on the "Never in a published issue" ledger
  (`docs/generated/PROJECT-GRAPH.md` L139) and appear in `src/content/issues/`
  only in `2026-06-03-tech-showcase`, which is **status `draft`** — so
  `seenElsewhere` (built from published issues only, line 288) does not contain
  them. Neither is claimed by any storyboard in the last 30 days: the only other
  tech storyboard, `2026-09-14-ai-coding-token-bill`, **rejected both** for want
  of data (its §8, L643–646). Both are the issue's own world's signature kinds,
  which is the order this agent is told to prefer.
- **Sources** (dossier §8, carried forward): 19 sources · 9 publishers · top
  publisher 32% — clears ≥ 8 / ≥ 5 / ≤ 40%, so `SOURCE-NARROW` will not fire.
