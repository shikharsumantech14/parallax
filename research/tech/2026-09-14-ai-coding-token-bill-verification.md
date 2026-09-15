# Verification Report: Uber's year of AI money lasted *four* months

- **Draft:** `src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx`
- **Dossier:** `research/tech/2026-06-04-ai-coding-token-bill-dossier.md`
- **Storyboard:** `research/tech/2026-09-14-ai-coding-token-bill-storyboard.md`
  (`Status: approved`, §8i SETTLED, nine rulings + the rate block + the five-part date rule)
- **Panels:** `-panel.md` (REVISE) · `-panel-2.md` (PASS)
- **Prior verification:** `research/tech/2026-06-04-ai-coding-token-bill-verification.md` (NEEDS REVISION)
- **Verified:** 2026-09-15
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION, and the revision is about forty words.** Nothing here needs a
phase re-run, a new source or a new fact. **Zero ❌ of any species** — no
untraced claim, no advocacy, no non-quotable quote, no Hindi defect. Both
required fixes from the June report are resolved (the Goldman sentence and
src-08 are gone; the file now contains exactly one em-dash and it is in a
`sources[]` bibliographic title). The currency work holds on all five parts of
the operator's ruling and both conversions are arithmetically right at ₹95. The
`scaling-plot` trim is exactly as ruled. The restored `$0.25` anchor traces. The
~11% hedge is self-contained in both places.

What stops APPROVED is eleven ⚠️, of which **four are worth fixing before
commit** and are each a word or two: the §6 `timeline` source line is dated
"19 and 27 May 2026" on a timeline whose last event is **2 June**; §7's `note`
drops the dossier's **"US"** from "median Uber **US** software-engineer", which
on an Indian-audience page is the one dropped qualifier that could mislead; the
§2 gloss's claim that **"small models keep getting cheaper"** is the one
sentence in the issue whose supporting figures were removed from the page by
this very rewrite, and the dossier's own ladder carries a counterexample; and
the §2 `meaning` field is **26 words against a hard cap of 25**, so
`check:prose` will fire FIELD-OVER-CAP on the restored anchor. The remaining
seven are notes, not fixes.

Two things the operator should see that are not defects: **every load-bearing
fact in this issue rests on one T7 blog** (⚠️ NO PRIMARY ANCHOR — the taxonomy's
diversity gate fails on both halves), which the storyboard's ruling 7 already
closed as a paywall, not a gap; and the head sits at **78 of 80** words before
the first graphic and the closer at **exactly 90 of 90**, so the issue has two
words and zero words of margin on two separate floors.

---

## The seven points in the brief — my rulings

### 1 · The currency work — **all five parts hold. ✅**

| Part of the ruling | Finding |
|---|---|
| Exactly **two** rupee figures, both in `number-sense` (§7) | ✅ Lines 165 and 167. The only other `₹` in the file is the rate note on §7's source line (line 158), which the ruling requires; lines 291–294 are inside the `{/* */}` comment and reach no reader. |
| `$1,500` → "about ₹1.4 lakh" | ✅ **1,500 × 95 = ₹1,42,500 = ₹1.425 lakh.** "About ₹1.4 lakh" is correct and correctly rounded. |
| `~$330,000` → "about ₹3.1 crore" | ✅ **330,000 × 95 = ₹3,13,50,000 = ₹3.135 crore.** "About ₹3.1 crore" is correct. |
| The storyboard's stale illustrations (₹1.3 lakh / ₹2.9 crore at ₹85–90) | ✅ **Not used.** Both figures match the operator's supplied table exactly. |
| No ₹ inside any dated `timeline` event | ✅ The timeline carries `$20 a seat a month` at **Apr 14 2026** unconverted, which is composition rule 1 working. |
| No ₹ on a per-token rate card | ✅ `$0.25 per million` in §2 is unconverted, which is composition rule 2 working. |
| No ₹ in any `caption`, `plain`, data label or `source` other than the rate note | ✅ Verified by grep. The two ₹ figures sit in `data.note` and `data.equals[0].text` — neither is a precision field. |
| The dollar leads every time | ✅ **with the mechanism named, because a future editor could "fix" this wrongly.** Line 165 is literal: `$330,000 (about ₹3.1 crore)`. Line 167 — "About ₹1.4 lakh a month, for one person and one tool" — carries no dollar *inside the string*, and it does not need one: `NumberSense` renders it as an `≈` row hanging off the component's `value` slot, which holds `$1,500` at 44–72px in the same card. The dollar leads by component geometry. Panel 1 finding 4 tested exactly this and no reader misread it. **Do not "fix" line 167 by adding a dollar figure to it** — it would put two currencies in one equals row and break rule 8's two-numbers cap. |
| The rate and its month stated explicitly | ✅ "Converted at about ₹95 to the dollar, September 2026" on §7's source line. |
| Could a reader take a rupee figure for the price itself, or misdate the cap? | **No.** §7's intro says "the cap arrived on 2 June" one line above the value, so the date is nailed before the source line is reached; both panels confirmed no reader misdated it. The residual both panels *did* record is the reverse and smaller: the September rate on a June-dated page reads as a quiet later edit. It costs a beat of trust, never the meaning. That is a known, accepted cost of the ruling, not a defect. |

### 2 · The restored `$0.25` anchor — **it traces, its date and its "no bracket" are right, and its second clause is the weakest sentence in the issue.**

Four separate questions, four separate answers.

- **Does `$0.25` trace?** ✅ Dossier §3 row 1 and §4: *"Claude 3 Haiku launches at
  $0.25 / $1.25 per million input/output tokens — the cheap-per-token baseline
  readers anchor on"*, cited to src-04.
- **Is "a 2023 launch price" right?** ✅ The dossier dates it `2023 (ref)` and
  says "launches at". The draft says "A cheap 2023 model launched at $0.25 per
  million". Correct against the dossier, and the model is described rather than
  named, per storyboard §7.
- **Is taking no rupee bracket right?** ✅ **Yes, twice over.** It is HISTORICAL
  (storyboard §5's currency table classifies it as "the clearest historical
  figure in the issue and the rule's own example case") *and* it is a per-token
  rate card, which composition rule 2 bars regardless of vintage. Converting it
  would also be noise: $0.25 is about ₹24.
- **Is "small models keep getting cheaper" supported, or an extrapolation?**
  **⚠️ It is a hair beyond the record, and the rewrite removed its own
  evidence.** Three findings, and they stack:
  1. The dossier's small-model ladder does not point one way. Below the 2023
     $0.25 input anchor: GPT-5-mini/nano at **$0.05**, Grok 4 Fast at **$0.20**.
     At or above it: Gemini 3.1 Flash-Lite at **$0.25** (equal on input, $1.50
     against $1.25 on output) and — in the same product family as the anchor —
     **Claude Haiku 4.5 at $1.00 / $5.00**, four times the 2023 Haiku price. The
     dossier's own verified sentence is about a different quantity: *"Frontier
     capability that cost dollars per million tokens in 2023 now costs cents."*
     That is a capability-adjusted claim, not "small models keep getting cheaper".
  2. **Every one of those figures left the page in this rewrite** (they were the
     `paradox`'s side-1 ladder). So the clause now asserts a continuing trend
     with no mark, no second figure and no end point anywhere in the issue. Panel
     2's finding 2 reaches the same place from the reader's side: *"The fall has
     a start point and a direction word. It has no end point."*
  3. The clause is also the post-panel-2 edit. Panel 2 quotes the field as
     *"and newer ones cost less"* and its fix 1 asked for scope. "Small models"
     supplies scope and is the right move — but it swaps an unscoped claim for a
     scoped one the dossier's ladder half-contradicts.

  **This is ⚠️ IMPRECISE, not ❌.** The direction is real and dossier-backed;
  the wording overreaches it. The fix is inside the existing words, needs no
  research, and **also clears the field-cap breach in the same stroke** (see the
  register table): replacing *"and small models keep getting cheaper"* (6 words)
  with something like *"and the cheapest ones today cost less still"* (7) or
  *"and today's cheapest cost a fraction of that"* (7) would still be over cap —
  the cheapest clean fix is to trim the third sentence instead, e.g. *"That is
  the cheaper-AI headline"* → *"That is the headline"* (−1, lands on 25).

### 3 · The `scaling-plot` trim — **exactly as ruled. ✅**

- Two points survive: `{x:1, y:5000, label:"one chat reply*"}` and
  `{x:2, y:1363250, label:"GPT-5 Codex task (measured)"}`. Both values are
  byte-identical to the published ones; the measured point is re-indexed to
  `x: 2` as §8a specifies. `logY: true`, `xLabel`, `yLabel` unchanged.
- The three invented interior points (22,000 / 90,000 / 320,000) are **gone from
  the frontmatter entirely** — they survive only inside the `EDITOR NOTES`
  comment recording their deletion, which is why a numeral grep still finds them.
- **The 5,000 floor is still marked illustrative on the page**, in two places:
  the asterisk on its own label, and the source line *"Lower point illustrative,
  not measured"*. The annotation adds a third, on the mark: *"The only measured
  point here."*
- **No ratio is taken off it.** No "270×", no 5–30× band, no multiplier of any
  kind. The issue uses only "a few thousand" against "over a million". Guardrail
  2 holds; both panels confirm no reader produced a multiplier.
- **One thing worth protecting, and nobody has written it down.** The caveat's
  primary home is the source line, and `core/Section.astro` does not run in story
  mode (`story/StoryCard.astro` composes `SectionBody`), so **a `/s/` reader
  never sees "Lower point illustrative, not measured"** — and `scaling-plot`
  carries the highest `KIND_PRIORITY` in this issue (82, against `data-readout`
  70 and `number-sense` 68), so it will almost certainly be a beat. What carries
  the honesty there is the annotation, which is in-SVG and survives. **Do not cut
  or soften that annotation for words.** §8g's "never pays" list covers it
  ("any hedge or caveat"), but only by implication.

### 4 · The Bloomberg guardrail — **written, visible, and nothing in the body outruns the relay. ✅**

- Guardrail 3 is in the `EDITOR NOTES` block, lines 275–281, and it is the
  fullest of the six: it names the original (Natalie Lung, 2 June 2026), says
  **PAYWALLED** and **"never directly accessed"**, lists all four load-bearing
  facts that reach the page through it ($1,500, the four-month burn, ~$330,000,
  ~11%), names the relay (src-01, "which quotes the cap verbatim"), says in
  terms that **"the title, the hook and the third quiz question all rest on that
  relay"**, and leaves the standing instruction to confirm against the original
  if Bloomberg access exists. That is the ruling executed to the letter.
- **Does the body overstate the relay?** No. Every Uber statement in reader-facing
  copy is a flat report of what the relay reports, with no confidence verb
  attached: "Uber exhausted its entire 2026 AI budget in four months", "the cap
  arrived on 2 June", "$1,500 / Per engineer, per tool". Bloomberg and Natalie
  Lung appear on §1's and §7's **source lines** and nowhere inside a sentence —
  which is the correct handling under rule 9 *and* keeps the provenance on the
  page for the reader who looks.
- One judgement call for the operator, not a defect: **src-01 carries
  `kind: primary`** while being a relay of a paywalled wire story. The
  `publisher` field is honest about it ("Simon Willison's Weblog (relaying
  Bloomberg / Natalie Lung)") and the dossier §8 classifies it the same way, so
  the draft is consistent with its record. It is simply the one place the label
  is stronger than the chain.

### 5 · The ~11% hedge — **intact in both places, and §8's version is now self-contained. ✅**

| Place | Text | Verdict |
|---|---|---|
| §7 `data.note` | "A median Uber engineer's total pay is around $330,000 (about ₹3.1 crore), **an outside estimate, not a company figure**." | ✅ Full sentence, own noun, no back-reference. |
| §8 tile 4 | label "Of a median engineer's **estimated** total pay" · note "Two tools a year, **against an outside estimate, not Uber's figure**." | ✅ **The storyboard's named fail condition is closed.** The hedge is now in the two lines a tile reader actually reads: one word inside the label for a scanner, one complete sentence with its own subject in the note. It does not reach back to §7 for an antecedent — the pass-1 defect ("that outside estimate") is gone. Panel 2 confirms Sana, the reader it was written for, returned both hedge words in her own retell. |

**One qualifier the rewrite dropped, and it is the fix I would make first.** The
dossier §4 reads *"median Uber **US** software-engineer total comp ≈ $330,000
(Levels.fyi, cited by Willison)"*. The draft says *"A median Uber engineer's
total pay"*. On an issue written for Indian readers and carrying "about ₹3.1
crore" in the same sentence, dropping "US" is the one compression in this file
that could actively mislead — a reader may take ₹3.1 crore as what an Uber
engineer anywhere is paid. The fix is one word and costs one word from the
budget (the note goes 19 → 20, still inside the 20-word cap for
`number-sense.note`).

### 6 · Every surviving figure — **copied, not retyped. ✅ All of them.**

| Figure | Where | Against the record |
|---|---|---|
| 1,363,250 | §3 point · §3 caption · §5 caption | ✅ = 169,818 + 17,112 + 1,176,320. Sum re-checked. |
| 1,176,320 | §5 item · §5 caption | ✅ dossier §4 |
| 169,818 | §5 item | ✅ dossier §4 |
| 17,112 | §5 item · §5 caption | ✅ dossier §4 |
| 1.36 million | §3 annotation | ✅ correct rounding of 1,363,250 |
| $1,500 | §7 value · §6 Jun 2 · guardrail | ✅ dossier §4, src-01 verbatim quote |
| ~$330,000 | §7 note | ✅ dossier §4 (see the "US" note above) |
| ~$36,000 | §7 equals · §8 intro | ✅ = 1,500 × 2 × 12; dossier §4 |
| ~11% | §8 tile 4 | ✅ 36,000 ÷ 330,000 = 10.9%; dossier §4 |
| $2,180 | §8 tile 1 | ✅ rounding of the dossier's $2,180.16. The exact figure appears nowhere else in the issue now, so the June report's optional #3 (rounding inconsistency) is moot. |
| $200 | §8 tile 1 note | ✅ dossier §4 |
| $20 a seat a month | §6 Apr 14 note | ✅ dossier §3 |
| $0.25 per million | §2 | ✅ dossier §3 (see point 2) |
| 2× | §6 Apr 23 · §8 tile 2 | ✅ dossier §3/§4 (GPT-5.5 vs GPT-5.4) |
| ~1.4× | §8 tile 3 | ✅ dossier §3/§4 (Opus 4.7 vs 4.6; the conservative reading of 1.46× / ~40%) |
| 4 months | §1 value · §6 note · title · hook | ✅ dossier §2/§4 |
| Nov 24 2025 · Apr 2 2026 · Apr 14 2026 · Apr 23 2026 · ~Apr 2026 · Jun 2 2026 | §6 | ✅ every date matches dossier §3, and every `state` is unchanged from the published version |
| November 2025, "a week apart" | §4 step 1 | ✅ 19 Nov + 24 Nov = five days; "a week apart" is fair |
| 23 April 2026 | §8 tile 2 note | ✅ dossier §3 |
| 2026 / 2025 / 2023 | head, §1, §2 | ✅ |

### 7 · `NUMBER-DRIFT` — **every removal is a mandated cut. No fact was lost. ✅**

Audited in the direction the gate cannot: for each vanished numeral, is the cut
mandated, does a surviving sentence still lean on it, and did it have a dossier
home at all?

| Removed | Mandate | Does anything surviving lean on it? |
|---|---|---|
| 22,000 / 90,000 / 320,000 | Ruling 1 / §8c ¶2 | No. They were invented; nothing derived from them. **A trace improvement, not a loss** — the chart went from 4-of-5 unsourced marks to 1-of-2, and that one is asterisked, sourced-as-illustrative and annotated. |
| $1.25 (2023 output) · $0.05 · $0.40 · $0.20 · $0.50 (the small-model ladder) | §8a (the `paradox` is cut) | **Yes — one clause.** "Small models keep getting cheaper" is now the only survivor of that ladder and has no figure behind it. This is the ⚠️ in point 2, and it is the one place a removal left a survivor exposed. |
| Aug 7 2025 · $1.25 / $10 (GPT-5 frontier ship) | §8a (event dropped; "scene-setting rather than a turn") | No. |
| Apr 16 2026 · Opus 4.7 · $5 / $25 | §8a (event dropped; the fact moves to a tile) | **Partly.** The `~1.4×` tile's note still says *"**The April update** counts the same text as more pieces"* and no section now names an April update. The claim is sourced and stands; only its antecedent left. Panel 2 recorded the same. A two-word fix ("An April model update"), not a restoration. |
| Nov 19 2025 (GPT-5.1 Codex Max ship date) | §7 (model versions described, not named) | No — "two coding models shipped a week apart" carries it. |
| $1,199.79 · $980.37 | §8a (the arbitrage bars are demoted to a tile, per dossier §9) | No. Their sum, $2,180, survives as tile 1 and the $200 comparison with it. |
| $2,180.16 → $2,180 | §8a | No. Rounding is now internally consistent because the exact figure appears nowhere else. |
| 24× · 2030 · 120 quadrillion · Jim Schneider · src-08 | Guardrail 1; the June report's required fix 1 | No — and the closer's forward-looking clause went with it, which is exactly what that report's optional #2 asked for. |
| 5,000 (kept) | — | Kept deliberately: an endpoint of the claim, asterisked. |

**Dropped names, tested the same way.** GPT-5.1 Codex Max, Claude Opus 4.5 / 4.6
/ 4.7, GPT-5.4 / 5.5, Claude 3 Haiku, Haiku 4.5, GPT-5-mini, Grok 4 Fast, Gemini
3.1 Flash-Lite, Max, Pro. **No claim the draft still makes rests on any of
them** — each supported a figure that also left, or is a version string for an
event the draft states by its effect and date. Colour, not premise.

---

## Claim verification

68 traceable claims. **57 ✅ · 11 ⚠️ · 0 ❌.** Only the non-✅ rows and the
load-bearing ✅ rows are listed; the full figure audit is point 6 above.

| Claim | Location | Status | Note |
|---|---|---|---|
| "Uber's year of AI money lasted four months" | head · title | ✅ | Dossier §2, §4 |
| "Uber burned its whole 2026 AI budget in four months, and capped every engineer" | head · hook | ✅ | Dossier §2. "every engineer" is dossier §1's own wording (§2 says "every employee"; the narrower form is what the record's own summary uses) |
| "A token is the unit AI bills by: a piece of a word" | head · primer | ✅ | Definitional, consistent with dossier §4 |
| "AI gets cheaper every year…" (the belief) | §1 · `think.text` | ✅ | Dossier §1 — the corollary the reader walks in with |
| "4" / "months" | §1 · `actually.value`/`unit` | ✅ | Dossier §2, §4 |
| "ran through all of it **by April**" | §1 · `actually.text` | ⚠️ IMPRECISE | The dossier says "exhausted **four months into** the year", i.e. through the end of April. "By April" reads most naturally as *before* April, which is three months, and sits a line under a value that says "4 months". "**through April**" is the same length and exact. |
| "Uber exhausted its entire 2026 AI budget in four months and capped each engineer" | §1 · `caption` | ✅ | Traced data claim, correctly in the caption |
| "token — a piece of a word… the unit AI companies price their work by" | §2 · `terms[0]` | ✅ | Dossier §4 |
| "A cheap 2023 model launched at **$0.25 per million**" | §2 · `terms[1]` | ⚠️ IMPRECISE | Figure, date and "at launch" all trace to dossier §3/§4. Two small elisions: $0.25 is the **input** side of $0.25/$1.25, and "per million" does not say per million *what*. Both panels recorded the second ("per million *what* — elided"). Recoverable from the term above it; worth one word if any is spare. |
| "and **small models keep getting cheaper**" | §2 · `terms[1]` | ⚠️ IMPRECISE | See point 2. Direction verified, wording beyond the ladder (Claude Haiku 4.5 is $1.00 against the 2023 $0.25), and the supporting figures left the page with the `paradox`. |
| "cost per task — the price of one piece times how many pieces the job used" | §2 · `terms[2]` | ✅ | Dossier §1 |
| The electricity-bill mapping (rate per unit × units used = bill) | §2 · `intro`, §9 | ✅ | ANALOGY-CLAIM check: the mapping is the mechanism the dossier describes, with nothing added |
| 5,000 "one chat reply*" | §3 · `points[0]` | ✅ | Dossier §4 marks the floor [UNVERIFIED]; flagged illustrative in three places on the page |
| 1,363,250 "GPT-5 Codex task (measured)" | §3 · `points[1]`, caption | ✅ | Dossier §4; sum re-checked |
| "The only measured point here. One task, 1.36 million tokens." | §3 · annotation | ✅ | Resolves — `at` matches `points[1].label` exactly (ScalingPlot matches on label string) |
| "One measured coding task used 1,363,250 tokens. A chat reply uses a few thousand." | §3 · `caption` | ✅ | Data claim, **no scale word** — the log/linear toggle cannot make it false |
| "two coding models shipped a week apart" (Nov 2025) | §4 · step 1 | ✅ | Dossier §3: 19 Nov + 24 Nov |
| "Coding agents went from often working to mostly working" | §4 · step 1 | ✅ | Dossier §5; rendered unquoted, so no verbatim obligation |
| "maintain state by replaying entire conversations with each new prompt" | §4 · step 3 | ✅ **VERBATIM** | Dossier §4 / src-06, correctly truncated before ", causing input token growth over time". Attributed with a role phrase ("The developer Simon Willison, who tracks AI pricing"). Quotable: src-04/06 are `simonwillison.net`, T7, **access: open**. |
| §4 source line dated "19 and 27 May 2026" | §4 · `source.date` | ⚠️ | `sourceRefs` include **src-06**, an undated guide page, which is where the quoted sentence comes from. The date pair covers src-02 and src-03 only. Cosmetic; the label names the right publication. |
| 1,176,320 cached · 169,818 input sent · 17,112 output written | §5 · `items` | ✅ | Dossier §4 |
| "Of those, 1,176,320 were cached and 17,112 were new code." | §5 · `caption` | ✅ | Data claim. "New code" for output tokens is the storyboard's own §2 reading ("the code it actually wrote back was 17,112 tokens"). |
| "Most of the task was context re-sent, not new code." | §5 · annotation | ✅ | Resolves — `at: "cached tokens"` matches `items[0].label` |
| "Cached means the pieces the agent had already sent once." | §5 · `intro` | ✅ | Dossier §4 / src-06; the panel-1 gloss request, applied |
| Six timeline events, dates and `state` values | §6 · `events` | ✅ | Every one matches dossier §3 |
| "Uber caps engineers at **$1,500 a month**." | §6 · Jun 2 label | ⚠️ IMPRECISE | Drops "per tool", the qualifier the storyboard's Q3 model answer sets in bold and the only one that changes the number's meaning (two tools is $3,000, not $1,500). §7 fixes it two sections later, and every panel reader got it — but the timeline label read alone understates the cap. **"Uber caps engineers at $1,500 per tool" is the same 7 words** and the row's `label` cap is 7. |
| "A seat is one person's licence. About $20 a month, plus what you use." | §6 · Apr 14 note | ✅ | Dossier §3 ("$20/seat/month plus API pricing", announced 2026-04-14). Correctly unconverted inside a dated event. |
| "Nothing got more expensive here. The tools just started working." | §6 · annotation | ✅ | Resolves — `at: "Nov 24 2025"` matches the event `date` exactly (Timeline matches on the date string). Dossier §3/§4. |
| "At the frontier, the per-token price is now rising." | §6 · annotation | ✅ | Resolves on "Apr 23 2026". Dossier §4. |
| §6 source line dated "19 and 27 May 2026" | §6 · `source.date` | ⚠️ **fix before commit** | The section's last event is **2 June 2026** and its `sourceRefs` include src-01, published 3 June. A timeline dated to May cannot carry a June event; it reads as an editing slip on the issue's headline fact. §8's line ("20 April to 3 June 2026") is the right idiom. Suggest **"19 May to 3 June 2026"**. |
| "$1,500" / "/month" / "Per engineer, per tool" | §7 · value, unit, label | ✅ | Dossier §4; src-01 quotes the cap verbatim |
| "The cap covers agent tools like Cursor and Claude Code, not chat assistants." | §7 · `caption` | ✅ | src-01: "The limits … only apply to agentic coding software such as Cursor or Anthropic PBC's Claude Code" |
| "A median **Uber engineer's** total pay is around $330,000" | §7 · `note` | ⚠️ **fix before commit** | Dossier §4 says "median Uber **US** software-engineer total comp". One word, and on this audience beside "about ₹3.1 crore" it is the compression most likely to mislead. Note goes 19 → 20 words, inside the cap. |
| "an outside estimate, not a company figure" | §7 · `note` | ✅ | Dossier §4 caveat, carried as instructed |
| "About ₹1.4 lakh a month, for one person and one tool." | §7 · `equals[0]` | ✅ | 1,500 × 95 = ₹1.425 lakh |
| "(about ₹3.1 crore)" | §7 · `note` | ✅ | 330,000 × 95 = ₹3.135 crore |
| "A year of that cap, on two tools, is roughly $36,000." + "Assuming an engineer uses two tools." | §7 · `equals[1]` | ✅ | Dossier §4; the assumption stated on the row that makes it |
| "Converted at about ₹95 to the dollar, September 2026" | §7 · `source.label` | ✅ | Operator's supplied rate and month, stated explicitly |
| "$2,180 · Tokens **one heavy user** burned in 30 days" | §8 · tile 1 | ⚠️ | Figure ✅ (dossier §4). But the published page framed it as **"self-reported"**, and storyboard §8e ruled "keep the framing on the source line". The source line says "Simon Willison's Weblog" and nothing more, so a reader cannot tell the heavy user *is* the source. One word on the source line or in the label restores it. |
| "Valued at the advertised price. The subscriptions behind it cost $200." | §8 · tile 1 note | ✅ | Dossier §4 ("at API rates", $100 + $100) |
| "2× · Newest top model's price against the last one" · "Shipped 23 April 2026. At the top end, prices are rising." | §8 · tile 2 | ✅ | Dossier §3/§4 |
| "~1.4× · Cost rise with the price per piece unchanged" · "**The April update** counts the same text as more pieces." | §8 · tile 3 | ⚠️ | Claim ✅ (dossier §4, src-05). "The April update" has no antecedent since the Apr 16 timeline event was cut. Two-word fix. |
| "~11% · Of a median engineer's estimated total pay" · "…not Uber's figure." | §8 · tile 4 | ✅ | Dossier §4; hedge self-contained (point 5) |
| "The token bill, four readings" | §8 · `data.caption` | ⚠️ CAPTION-FORM | Describes the shape of the grid, asserts no finding. Mitigating: `DataReadout` renders its caption as the card's header strip rather than as a figure caption, and the storyboard capped the field at 6 words, which forecloses a finding sentence. Low severity; the kind's idiom. |
| "One price rose in April, at the top of the market." | §9 | ✅ | Dossier §3/§4 |
| "Where the price per piece held still, the bill rose" | §9 | ✅ | Dossier §4 (tokenizer inflation at an unchanged card) |
| "**The rate per unit fell**" | §9 | ⚠️ | The second of the issue's two unscoped fall statements (panel 2's "what the fixes created"). Same root cause as the §2 clause; fixing §2's scope makes this paragraph read correctly without touching it. |
| "one job went from a few thousand units to over a million" | §9 | ✅ | Guardrail 2's approved framing |
| "Writing new code is close to free now. Getting good code is still expensive" | §9 | ✅ | src-07, paraphrased and **not** in quotation marks — correct handling |

**Absence checks (guardrails 1–6 and the brief's forbidden comparison)**

| Must be ABSENT | Result |
|---|---|
| Goldman 24×/2030, src-08 | ✅ Absent. Named only in the `EDITOR NOTES` comment. |
| $18.40 → $6.07 blended cost | ✅ Absent. |
| Microsoft / Claude-Code licence cancellation | ✅ Absent. |
| 5–30× multiplier, or any ratio off the 5,000 floor ("270×") | ✅ Absent. Only "a few thousand" against "over a million". |
| `version-graph` | ✅ Not used. |
| Any claim the cap exceeds an Indian engineer's pay | ✅ **Absent.** Grep for salary / earn / Indian / Mumbai / Delhi / IPL / cricket / monsoon returns nothing in reader-facing copy. |
| Bloomberg · Natalie Lung · Levels.fyi inside a sentence | ✅ **Absent.** All three appear only in `source.label` strings, the `sources[]` block and the editor comment — rule 9 and tell 9 both held. |

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | Clean. |

- **Em-dashes: exactly one in the file**, at line 232 in `sources[].title`
  ("Simon Willison — llm-pricing tag index"). Zero in reader-facing prose. The
  dossier §8 carries the same form. It renders in the sources block, so it is
  reader-visible — **a judgement call for the operator, not a defect**: a
  bibliographic title is not prose, the hard cap of one per issue is not
  breached either way, and the brief pre-ruled it.
- **Semicolons: zero.** Colons: one, in the primer, before a gloss — permitted.
- **The AI word list:** zero hits (delve, robust, leverage, testament, pivotal,
  crucially, notably, nuanced, journey, unlock, foster, underscore, tapestry,
  landscape, navigate, "at its core", "the reality is").
- **The one binary reframe** is spent where the storyboard put it: `you-think`'s
  own two-panel form. The published closer title "The cost didn't fall. It
  *moved*." is **not** restored. Three appositive negations survive — "not new
  code" (§5 annotation), "not chat assistants" (§7 caption), "not Uber's figure"
  (§8 tile) — and **none counts against the ration**: each is a qualifier doing
  precision work on exactly the numbers the dossier was most careful about, not
  a rhetorical reversal used as the argumentative move. *Noted, not a defect.*
- **Staccato:** §9's sentence lengths run 7 · 11 · 21 · 8 · 22 · 8 · 13 — no
  three consecutive under eight words. No triple-fragment close.
- No advocacy, no wire tone, no rhetorical-question closer, no passive filler, no
  meta-commentary. **No speculation** — the forward-looking clause went with
  Goldman, which is what the June report's optional #2 asked for.
- **Structure:** the timeline's arc is directional and causal (tools work →
  billing meters → frontier repricing → exhaustion → cap) and its two
  annotations sit on the two turning events. The hero tells its story in bars,
  not prose. The one prose section documents and does not argue past its sources.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| **FIELD-OVER-CAP** | §2 · `terms[1].meaning` | ⚠️ **fix before commit** | **26 words against `check-prose`'s cap of 25** for a `jargon-buster` meaning. Counted with the gate's own tokeniser (`cheaper-AI` and `$0.25` are one token each). This is the restored anchor's field, so the restoration is what pushed it over. One word anywhere in the field clears it. |
| **STORYBOARD-DRIFT** | §9 · paragraph | ⚠️ | **90 words against the storyboard's row-9 budget of ≤ 75**, and §8g designated row 9 the slack row that shrinks to 60 *before anything else pays*. It grew instead. Inside the contract (`proseSectionWords` 200), but it is **exactly 90 of `paragraphWords`' 90** — one added word fires PARA-OVER-CAP. Panel 2 flagged the same. |
| **STORYBOARD-DRIFT** | head · primer | ⚠️ low | 33 words against the storyboard's 28 — the added gloss ", a piece of a word". It is a **good** addition (panel 1 finding 2 credits it with landing the token gloss for the two readers who needed it), but it ate four of the six words of margin on the 80-word floor. See the arithmetic below. |
| **STORYBOARD-DRIFT** | §7 `note` (19 v ≤16) · §6 Apr 14 note (14 v ≤10) | ⚠️ low | Both inside the contract caps (20 each). §8g's "never pays" list protects hedges and caveats by name, so §7's overrun is spent exactly where the storyboard said to spend it. Not fixes. |
| **NAME-UNPLACED** | §6 · Apr 2 and Apr 14 labels | ⚠️ low | **Anthropic** and **OpenAI** each appear **once**, in a timeline label, with no role phrase. Storyboard §7 assigned each a role and a second row (Anthropic rows 2 and 6, OpenAI rows 4 and 6); the row-2 and row-4 mentions were written around, and the role phrase went with them. Both are predicate-placed ("Anthropic starts billing the seat by usage") and no panel reader stumbled. Recorded because the count is 7 real names against a ration of 12 — there is room, if the operator wants either introduced. |
| **JARGON-UNGLOSSED** | §6 "the seat" · §3 x-axis "task autonomy" · §5 bar label "input sent" | ⚠️ low | All three are panel-2 residuals, carried forward verbatim. Panel 2's own ruling: "seat" is carried by its event label, "task autonomy" is decoration on an axis with two labelled dots, "input sent" carries no claim. Its fixes 2 and 3 cost ~4 words and net zero words. |
| **CAPTION-FORM** | §8 · `data.caption` | ⚠️ low | See the claim table. |
| **NO PRIMARY ANCHOR** | issue · `sources[]` | ⚠️ **for the record, not fixable here** | **All seven sources are one author's blog.** `research/_sources/tech.md` lists Simon Willison's Weblog at **T7 · access: open · ingest: live · viewpoint: primary**. `_TAXONOMY.md` §5 requires **≥ 1 T0/T1/T2 anchor** for load-bearing facts and **≥ 3 sources across ≥ 2 viewpoint clusters**; this issue meets neither half. The storyboard §8e ruled this out of scope with reasons I accept in full (the only improvement available is behind a paywall the researcher already hit), and a rewrite adds no sources. **Naming it is the point**: the gate's own verdict should be on the record, and the fix the storyboard names — a dated per-million-token price series for one model family from an allowlisted source — is the same research job that would unblock `moore-ladder` **and** put a figure behind "small models keep getting cheaper". Three problems, one fetch. |
| **SINGLE-VIEWPOINT** | issue | ⚠️ low, contextual | One source means one viewpoint cluster on the issue's one interpretation claim ("the work changed shape, and a business pays for work"). Nothing in the record contests it, and **no false balance is warranted** — the empirical spine (dates, token counts, a stated company policy) is the anchor and must not be "balanced". Recorded as a consequence of the anchor finding, not a separate defect. |
| HINDI (all flags) | §1 `note` | ✅ clean | **One Hindi word, *hisaab*, once.** Lexicon spelling ✅ (`hinglish-lexicon.md` line 53). Skip test ✅ — "That maths only goes one way" loses nothing, and the section's own eyebrow is **THE ARITHMETIC**, four lines above, so the English gloss is already on screen. Sentence carries **no numeral** ✅. Sits in `data.note`, which is body prose and not in `PRECISION_FIELDS` ✅ — no HINDI-FIELD, no HINDI-LOAD-BEARING, no HINDI-DENSE (1 word in 14 against a 0.4 share). Roman, not italicised ✅. Operator ruling 6 ✅. *One note for the lexicon, not the draft: the per-desk table lists `hisaab` under sports and gives tech a different example set. That table reads as density guidance with examples, not an exclusive list, and the main table carries the spelling — so the draft is right. If the operator wants it airtight, add the row.* |
| BARE-NUMBER / currency | issue | ✅ clean | The two CURRENT figures carry brackets; every HISTORICAL and dated figure correctly carries none. No figure converted at today's rate that should not be. |
| NO-INDIAN-ANCHOR | issue | ✅ clean | ₹ · lakh · crore all present. |
| NAME-THROUGHPUT | issue | ✅ clean | **7 real names** — Uber, Simon Willison, Anthropic, OpenAI, Claude Code, Cursor, Codex — plus "AI", which the heuristic will count and the issue cannot avoid. 8 against a ration of 12. "Simon Willison" appears in full **once** and never as a bare surname ✅ (§7 drafter rule 1). "API", "USD", "Max", "Pro" all written around ✅ (rule 2). |
| ANALOGY-CLAIM | §2, §9 | ✅ clean | The electricity bill maps rate-per-unit × units-used onto price-per-token × tokens-per-task with nothing added. Panel 2 records one honest stretch (§8's tiles 2–4 are not "readings off meters"), which loosens the metaphor without misstating a mechanism. |
| HOOK-ABSTRACT / TITLE-FORMULA | head | ✅ clean | Hook: 21 words, two numbers, a "you", the twist. Title states the finding, not the subject, and is not "The ‹Noun› That ‹Verb›s". |
| TEXT-HEAVY | sections | ✅ clean | **6 of 9 visual = 67%**, floor 60%. `you-think`, `scaling-plot`, `benchmark-chart`, `timeline`, `number-sense`, `data-readout` are all outside `TEXT_ONLY` in `scripts/check-prose.mjs`; `jargon-buster`, `three-steps` and `prose` are in it. |
| PROSE-RUN | sections | ✅ clean | V T V T V V V V T — no two text-only adjacent. |
| NO-LEAD-GRAPHIC | section 1 | ✅ clean | `you-think` is not in `TEXT_ONLY`. |
| HEAD-HEAVY | head | ✅ clean, **2 words of margin** | Arithmetic by hand, the gate's own tokeniser: title 8 + dek 10 + hook 21 + primer **33** = 72, plus §1's eyebrow (2) and title (4) = **78 of 80**. It stops there only because §1 is visual, and `you-think`'s data strings cost nothing. **§1 still carries no `intro`** — the load-bearing constraint held. The storyboard budgeted 74; the primer's five-word gloss is where the difference went. |
| PROSE-COUNT / WORKHORSE-ONLY | sections | ✅ clean | 1 prose section at 90 words; four kinds from outside the six workhorses. |
| Reader words | issue | ✅ clean | ~1,020 of 1,100 (panel 2 measured 1,019 before the §2 edit, which added one word). |
| QUESTION-UNANSWERED | issue | ✅ clean | All three storyboard questions answerable from the draft alone; panel 2 scored 12 of 12 cells correct, including both hedges the storyboard makes part of the pass mark. |
| REDUNDANT-HOWTO / PLAIN-CLAIM | §3, §5 | ✅ clean | §3's `howToRead` explains the decade axis and trails its control clause ("Press Linear for the evenly spaced view") — instrument rule held, and `scaling-plot` is the only kind here in `NEEDS_HOW`, so it is the only authored panel. Its `plain` says what a **dot** is; no overlap. §5's `plain` says what a **bar** is. Neither states a finding; both are toggle-agnostic. |
| Component render / resolution | §3, §5, §6, §7, §8 | ✅ clean | Read against the components, not the catalog. All four annotations **resolve**: `ScalingPlot` matches `at` against the point `label` string ("GPT-5 Codex task (measured)" ✓), `BenchmarkChart` against the item label ("cached tokens" ✓), `Timeline` against the event `date` ("Nov 24 2025", "Apr 23 2026" ✓) — a miss is a silent no-op in all three, and there is none. `NumberSense` takes 2 `equals` (bound 1–3 ✓), `label` ✓, `note` ✓, `equals[].note` ✓. `DataReadout` accepts `emphasis: key/warn` and `unit` ✓. `BenchmarkChart` renders `caption` + the `unit` chip ✓. **Story mode loses no data**: `TRIM` caps are equals 2 (has 2), items 5 (has 3), terms 4 (has 3), steps 3 (has 3). |
| `sourceRefs` | all 9 sections | ✅ clean | Every id resolves. **All seven sources are referenced; no orphan.** src-01 §§1,6,7,8 · src-02 §§4,6,8,9 · src-03 §§4,6 · src-04 §§1,2,3,5 · src-05 §8 · src-06 §§4,5 · src-07 §9. The June report's optional improvement 1 (empty `sourceRefs[]` on every section) is **resolved**. |
| Quotability | §4 step 3 | ✅ clean | One verbatim quote in reader-facing copy, from src-06 — `simonwillison.net`, **access: open**, `ingest: live`, so there is no corpus chunk and the quote comes from a legally-accessed original by construction (retrieve-to-guide, cite-the-original). The RAG tool was unavailable this run; verified against the dossier's recorded URLs as the fallback prescribes. **`sources[].quote` is metadata, not copy** — `core/Sources.astro` does not render the field, so src-01's verbatim **Bloomberg** passage never reaches a reader. No ❌ NON-QUOTABLE SOURCE. |

---

## Prior verification report — required fixes, re-checked

| June required fix | Status |
|---|---|
| 1. Goldman 24×: inline `# EDITOR:` flag on the carrying field, or cut the sentence + src-08 | ✅ **Resolved by cutting.** No Goldman figure, no Jim Schneider, no src-08 anywhere. Guardrail 1 in the `EDITOR NOTES` block records the decision and why (off-allowlist, JS-gated). The closer's forward-looking clause went with it, which also closes optional #2. |
| 2. The double em-dash in the `paradox` | ✅ **Resolved by cutting the section**, and the whole file now carries one em-dash, in a bibliographic title. |
| Optional 1. Populate `sourceRefs[]` | ✅ **Resolved.** All nine sections wired; all seven sources covered; no orphan. |
| Optional 2. Soften the forward-looking clause if Goldman goes | ✅ **Resolved.** The clause is gone. |
| Optional 3. `$2,180` rounding | ✅ **Moot.** $2,180.16 no longer appears anywhere else in the issue. |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ **by ruling** | `status: published` is **correct** for a Phase-6 in-place rewrite (storyboard ruling 9; REGISTER-PLAN §8.1). The slug, `id`, `topic`, `publishedAt` and `tags` are unchanged so the URL does not move and the `/s/` route keeps building. **Flagged only so it is not "fixed"** — flipping it to draft would unpublish a live page. |
| All section kinds registered | ✅ | All nine (`you-think`, `jargon-buster`, `scaling-plot`, `three-steps`, `benchmark-chart`, `timeline`, `number-sense`, `data-readout`, `prose`) are in `SECTION_KINDS`. |
| No author field | ✅ | Absent. |
| publishedAt valid | ✅ | `2026-06-04`. |
| Source URLs https:// | ✅ | All seven. |
| Source kinds valid | ✅ | 5 `primary`, 2 `analysis`. |
| ≥ 6 sources | ✅ | Seven, all carried unchanged per ruling 9. |
| `readTimeMinutes` | ✅ | 7 → 4, per ruling 9. |
| Zod field bounds | ✅ | `primer` ~152 chars (80–420) · §3 `howToRead` ~190 chars (40–360) · both `plain` lines well under 220 · `layout: wide` valid · no `skimCaption` on a non-prose kind. |

---

## Required fixes before publish

Four, all inside existing words. None needs research, a re-run, or a new source.

1. **§6 `timeline` · `source.date`** — "19 and 27 May 2026" → **"19 May to 3 June
   2026"**. The section's last event is 2 June 2026 and it cites src-01,
   published 3 June. §8 already uses the range idiom correctly.
2. **§7 `data.note`** — "A median Uber engineer's total pay" → **"A median Uber
   US engineer's total pay"** (or "…Uber engineer in the US…"). The dossier §4
   qualifier is "median Uber **US** software-engineer". Costs one word; the note
   goes 19 → 20, inside the cap.
3. **§2 `terms[1].meaning`** — two problems, one field, and the cheapest edit
   solves both. It is **26 words against a hard cap of 25**, and its second
   clause ("small models keep getting cheaper") states a continuing trend whose
   only supporting figures left the page with the `paradox`, against a dossier
   ladder that contains a counterexample in the anchor's own product family
   (Claude Haiku: $0.25 in 2023, $1.00 today). Either tie the claim to the
   figures that remain in the record, or trim it to what the dossier says in
   terms — its verified sentence is about **frontier capability**, not small
   models. A one-word trim elsewhere in the field (e.g. "That is the cheaper-AI
   headline" → "That is the headline") clears the cap; the scope wording is the
   editorial half. **Keep the "That is the…headline" clause in some form** —
   panel 2 identified it as what converts the anchor from a definition into
   evidence.
4. **§6 Jun 2 `label`** — "Uber caps engineers at $1,500 a month." → **"Uber caps
   engineers at $1,500 per tool."** Identical word count, and it restores the
   qualifier that decides what the number means. (If "a month" must stay, the
   alternative is a `note` on the event, which would take the timeline to four
   notes of six against the storyboard's three.)

---

## Optional improvements

1. **§8 tile 1 — restore the "self-reported" framing.** Storyboard §8e ruled
   "keep it, keep the framing on the source line". "One heavy user" hides that
   the user is the source. One word on §8's source line ("Simon Willison's
   Weblog, self-reported usage. Levels.fyi for the pay estimate") puts the
   provenance back for one word.
2. **§8 tile 3 — give "The April update" an antecedent.** The Apr 16 Opus event
   was cut by mandate, so nothing on the page names an April update that changed
   how text is counted. "An April model update counts the same text as more
   pieces" fixes it at +1 word.
3. **Panel 2's three residual fixes**, unactioned and still cheap: gloss "the
   seat" (§6 Apr 14, ~4 words); swap the §3 x-axis label off "task autonomy" and
   the §5 middle bar label off "input sent" (both **net zero words**).
4. **§9 is 90 words against a 90-word cap and a 75-word budget.** Nothing forces
   a cut, but the issue currently has zero margin on `paragraphWords` and two
   words on `wordsBeforeFirstGraphic`. If any of the fixes above needs body room,
   §8g names §9 as the row that pays.
5. **Protect §3's annotation in writing.** It is the only carrier of the
   "illustrative, not measured" caveat in **story mode**, where
   `core/Section.astro` never runs and the source line does not render, and
   `scaling-plot` holds the highest `KIND_PRIORITY` in this issue. Worth a line
   in the `EDITOR NOTES` block beside guardrail 2.
6. **For the record, not this issue:** the sourcing gate fails on both halves
   (⚠️ NO PRIMARY ANCHOR). One fetch — a dated per-million-token price series
   for a single model family from an allowlisted source — would unblock
   `moore-ladder`, put a mark under the falling blade, and retire required fix 3
   at the root. The storyboard already names it "the highest-value research job
   this issue has".

---

## Judgement calls, flagged rather than ruled

- **The em-dash in `sources[].title`.** Renders to the reader in the sources
  block; it is bibliographic rather than prose; the cap of one per issue is not
  breached either way. Pre-ruled by the brief; recorded so it is not re-litigated.
- **src-01 carries `kind: primary` while relaying a paywalled wire story.** The
  `publisher` field and the dossier both say so plainly, so the draft is
  consistent with its record. It is the one place the label is stronger than the
  chain.
- **Three appositive negations** ("not new code", "not chat assistants", "not
  Uber's figure"). I read all three as precision work, not as the once-per-issue
  binary reframe, and counting them would strip the qualifiers that keep the
  issue honest. Operator's call if they disagree.
- **"every engineer" vs the dossier §2 "every employee".** The narrower form is
  dossier §1's own summary wording and it is what the published issue carried.
  Left alone.
- **`hisaab` sits four lines below a 52px numeral ("4").** The sentence carries
  no numeral of its own, the eyebrow glosses it, and both panels cleared it. Not
  flagged — recorded because "nowhere near a number" is the one of the four
  tests where a reader could argue.
