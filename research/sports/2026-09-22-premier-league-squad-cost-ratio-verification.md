# Verification Report: Football's new cap is *highest* for the richest

- **Draft:** `src/content/issues/2026-09-21-premier-league-squad-cost-ratio/index.mdx`
- **Dossier:** `research/sports/2026-09-17-premier-league-squad-cost-ratio-dossier.md`
- **Storyboard:** `research/sports/2026-09-21-premier-league-squad-cost-ratio-storyboard.md` (`Status: approved`)
- **Panel:** `research/sports/2026-09-22-premier-league-squad-cost-ratio-panel.md` (first pass, REVISE)
- **Verified:** 2026-09-22
- **Verdict:** **BLOCKED**

---

## Overall verdict

**What is resolved first, because it is most of the issue.** Every component
payload in this draft traces exactly: all 7 `channel-ternary` triples (each
summing to 1.000), all 7 `benchmark-chart` percentages, all 7 `scaling-plot`
points, all 5 `power-flow` links (reconciling at 6800 on both sides) and all 4
`data-readout` tiles. I recomputed every ratio from the dossier's own numerator
and denominator and all 14 divisions check out. The two hardest disciplines the
dossier imposed were both honoured: the `scaling-plot` never calls its numbers
"the Squad Cost Ratio" and carries the §9.4 caveat in the axis label, the
`plain` line and the caption; and the 85% line is correctly **absent** from the
wages chart. The unverified 14–6 vote count is dropped from the timeline exactly
as ruling 2 directed, the drawing rule is applied to matchday, the
"three named streams" normalisation survives into the caption, and the currency
ruling holds — no manufactured ₹ bracket anywhere. There are **zero verbatim
quotations** in the draft, so there is no copyright or quotability exposure to
assess. No advocacy, no wire tone, no em-dash, no semicolon, no AI-word, no
Devanagari. All three storyboard quiz questions are answerable from the draft.

**Three ❌ flags block, and it matters which species each is.** None needs
re-research and none needs an expensive phase re-run.

1. **An untraced vote tally** — section 9's intro states "Fourteen clubs chose",
   converting the T0 *threshold* into a *count* no source gives. This is the
   exact error dossier §9.1 calls "the single easiest damaging error in this
   issue". **Fix: one word.**
2. **An annotation its own chart refutes** — the hero's "Biggest earners sit
   furthest below the line." is false against the seven plotted points. **Fix:
   delete or rewrite the annotation.**
3. **Provenance paperwork** — the IPL figures are `[PARTIAL]` in the dossier and
   storyboard ruling 3 requires an operator eye-check that is nowhere recorded.
   **Fix: thirty seconds in a browser, plus one line written down.**

Below the blockers sits one systemic ⚠️ worth as much attention: **seven of nine
section `source` lines name "club accounts" or "Premier League" where the ids
they cite are The Swiss Ramble**, and the draft's own section 4 gets it right,
which is what makes the other six an oversight rather than a convention. That
same concentration fires `SOURCE-NARROW` on `check:prose` — 16 sources but only
4 publishers, Swiss Ramble at 56% against a 40% ceiling.

**Word budget warning for whichever fixes the editor applies.** `check:prose`
measures this draft at **1,097 of 1,100** reader-facing words. The storyboard
budgeted 1,081; the three post-panel edits spent 16 of the 19 words of slack.
`title` is **8 of 8**, `hook` 24 of 25, `jargon-buster` SCR meaning 24 of 25.
**Every required fix must be a substitution or a net removal.** Fix 1 is
word-neutral; fix 2 frees 7 words; fixing the source lines costs about 3 words
each and will need paying for out of fix 2's refund or a tile note.

---

## Claim verification

**Totals: 61 ✅ VERIFIED · 9 ⚠️ IMPRECISE · 3 ❌ UNTRACED / UNVERIFIED-USED.**

### Head

| Claim | Location | Status | Note |
|---|---|---|---|
| Cap is 85% of what each club earns | hook | ⚠️ | Omits "plus net profit on player sales" (§4.1). Completed in §2 and §3; storyboard fixed this hook verbatim. Noted, not a defect. |
| Manchester City gets £590m | hook | ⚠️ | 0.85 × £694m = £589.9m ✓. Ruling 1 required "about"; the hook drops it and the `you-think` caption carries the hedge instead — the fallback the storyboard explicitly permitted. Sanctioned. |
| Bournemouth £155m | hook | ⚠️ | 0.85 × £182m = £154.7m ✓. Same ruling-1 fallback. |
| A club "may now spend 85% of its own revenue on its squad" | primer | ⚠️ | §4.1 makes 85% the **green** threshold. Between 85% and 115% a club pays a levy and keeps playing; only above 115% is there a points deduction, and there is a 30% multi-year allowance. The draft states the ceiling as absolute and nowhere mentions 115%, the levy or the allowance. See the register table. |
| Old rule capped a loss, new one caps a share | dek | ✅ | §1, §4.1 (PSR £105m/3yr). |

### Section 1 · `power-flow`

| Claim | Location | Status | Note |
|---|---|---|---|
| £6.8bn in, £4.4bn out | title | ✅ | §4.2. |
| Matchday passed £1bn for the first time | caption | ✅ | §4.2. Drawing rule applied correctly: 1000 drawn, "passed" in the caption. |
| Wages took £4.4bn of the £6.8bn | caption | ✅ | §4.2. |
| matchday→revenue 1000 · broadcast 3400 · commercial 2400 | `data.links` | ✅ | §4.3 exactly. Sources sum 6800. |
| revenue→wages 4400 · revenue→rest 2400 | `data.links` | ✅ | §4.3. Sinks sum 6800; the `via` node balances. |
| Link notes: "first time above £1bn" · "shared nearly equally" · "not shared between clubs" · "65% of revenue" · "transfer fees and running the club" | `data.links[].note` | ✅ | §4.3 (last two lightly reworded from "transfers, amortisation, running the club" — same content). |
| Source: Deloitte ARFF 2026, 8 July 2026 | `source` | ✅ | §3, §4.2. Refs src-04/05 are both Deloitte. |

### Section 2 · `you-think`

| Claim | Location | Status | Note |
|---|---|---|---|
| Nearly two thirds of football earnings went out as wages | intro | ✅ | 65% (§4.2). |
| Line is 85% of each club's own revenue **plus what it makes selling players** | `actually.text` | ✅ | §4.1. Closes panel fix 3. |
| 85% of 2024/25 revenue is about £590m at City, about £155m at Bournemouth | caption | ✅ | Arithmetic on §4.4 revenues; hedged per ruling 1. |
| Both real ceilings are higher, because player-sale profit adds to the base | caption | ✅ | §4.1 + ruling 1's mandated caveat. |
| Manchester City earned £694m, Bournemouth £182m | `data.note` | ✅ | §4.4. **Post-panel edit** closing panel fix 1; traced, and 10 words against the 20-word `you-think.note` cap. |
| `actually.unit` reads "of your own revenue" | `data.actually.unit` | ⚠️ | Omits the player-sale half of the base that the adjacent `text` states. Low severity — the unit is a label, not a sentence. |
| Source line "Premier League rules and club accounts, 2024/25" | `source` | ⚠️ | Cites src-06 and src-12, both **The Swiss Ramble**, named as "club accounts". See the source-line audit. |

### Section 3 · `jargon-buster`

| Claim | Location | Status | Note |
|---|---|---|---|
| Two families told to spend at most 85% of what they earn | intro | ✅ | ANALOGY-CLAIM check: the mapping (same rate, different bases → different amounts) is the mechanism §1 describes. Correct. |
| Football revenue = broadcast + matchday + commercial; not owner money, not player sales | `terms[0]` | ✅ | §4.1, §4.2. |
| SCR = squad spending (wages, agents' fees, transfer fees) over revenue plus player-sale profit | `terms[1]` | ✅ | §4.1 verbatim in substance. |
| "Earn £100 that way, and £85 is your ceiling" | `terms[1]` | ⚠️ | Arithmetic is right. **"Ceiling" overstates** — §4.1 makes £85 the green line, not a bar; the levy band runs to £115. **Post-panel edit** closing panel fix 2; 24 words against the 25-word `jargon-buster.meaning` cap, one word of slack. |
| Amortisation = a transfer fee counted a slice at a time over the contract's years | `terms[2]` | ✅ | §4.1. |
| PSR = lose at most £105m over three seasons, whatever its size | `terms[3]` | ✅ | §4.1 (sourced to Swiss Ramble, src-13). |
| Source line "Premier League" | `source` | ⚠️ | The £105m PSR figure traces to src-13, **The Swiss Ramble**, which the line does not name. |
| Ruling 4's sanction wording absent | `terms[1]` | ⚠️ | Storyboard ruling 4 placed "six points, and another point for every few million over" in this gloss. It is not here, which is why the issue never tells a reader what happens above the line. |

### Section 4 · `channel-ternary`

| Claim | Location | Status | Note |
|---|---|---|---|
| Three streams, the league shares out only one | intro | ✅ | §4.3, §4.4. |
| Broadcast is 81.5% of Bournemouth's and 40.2% of Manchester City's | caption | ✅ | §4.4 exactly. |
| "Shares are of the three named streams" | caption | ✅ | §4.4's normalisation note carried, as the storyboard required. |
| Man City [0.108, 0.402, 0.490] | `entities` | ✅ | §4.4. Sums 1.000. |
| Liverpool [0.165, 0.376, 0.459] | `entities` | ✅ | §4.4. Sums 1.000. |
| Arsenal [0.223, 0.396, 0.381] | `entities` | ✅ | §4.4. Sums 1.000. |
| Manchester United [0.240, 0.260, 0.500] | `entities` | ✅ | §4.4. Sums 1.000. |
| Aston Villa [0.103, 0.651, 0.246] | `entities` | ✅ | §4.4. Sums 1.000; consistent with §4.9's 65.1% broadcast. |
| West Ham [0.172, 0.581, 0.247] | `entities` | ✅ | §4.4. Sums 1.000. |
| Bournemouth [0.037, 0.815, 0.148] | `entities` | ✅ | §4.4. Sums 1.000. |
| Corner order Matchday · Broadcast · Commercial | `corners` | ✅ | §4.4 `[l, t, r]`. |
| Source "The Swiss Ramble, club accounts 2024/25" | `source` | ✅ | **The one section that names the outlet correctly.** |

### Section 5 · `benchmark-chart`

| Claim | Location | Status | Note |
|---|---|---|---|
| Bournemouth spent 86.8% of revenue on wages | caption | ✅ | 158 ÷ 182 = 86.81 (§4.5). |
| League average was 65% | caption / `refValue` | ✅ | §4.2 Deloitte, src-04. |
| West Ham 77.2 · Aston Villa 72.2 · Liverpool 60.9 · Man City 58.8 · Arsenal 50.3 · Man Utd 46.9 | `items` | ✅ | §4.5. All six recomputed from the per-club wage bill and revenue: 176/228, 273/378, 428/703, 408/694, 347/690, 313/667. Every one matches to 0.1pp. |
| No 85% line drawn | `data` | ✅ | §4.5's explicit prohibition honoured. |
| Annotation "Highest wage share. Smallest revenue." | `annotations` | ✅ | §4.5 verbatim; 5 words against the 12-word cap. |
| Source "Club accounts and Deloitte" | `source` | ⚠️ | Seven of the eight refs are **The Swiss Ramble**, unnamed. |

### Section 6 · `scaling-plot` (HERO)

| Claim | Location | Status | Note |
|---|---|---|---|
| Liverpool (703, 77.5) · Man City (694, 83.3) · Arsenal (690, 75.2) · Man Utd (667, 75.9) · Aston Villa (378, 98.7) · West Ham (228, 120.6) · Bournemouth (182, 124.7) | `points` | ✅ | §4.6, all seven. Recomputed from (wages + amortisation) ÷ revenue: 545/703, 578/694, 519/690, 506/667, 373/378, 275/228, 227/182. All match. |
| yLabel "Squad cost as a share of revenue (wages plus player amortisation)" | `data.yLabel` | ✅ | The long form verbatim, as §9.4 and the storyboard require. **The phrase "Squad Cost Ratio" appears nowhere near these values.** The blocking risk §9.4 named is fully avoided. |
| "The rule's own measure adds agents' fees and profit on player sales, so every real figure is lower" | caption | ✅ | §4.6's mandatory caveat, carried. |
| "Read the order of the clubs, not the exact height" | `howToRead` | ✅ | §9.4's "the ranking is the claim". **Post-panel edit** replacing the string the panel's Karthik lost ("The ranking is the finding, not the exact level."). Improves on it. |
| "The fitted line slopes down, so clubs that earn more spend a smaller share" | `howToRead` | ✅ | True of the OLS fit the component computes (slope −0.0889). |
| "Dots high on the left are already spending more than they earn" | `howToRead` | ⚠️ | True of West Ham (120.6) and Bournemouth (124.7) only. Aston Villa, the third dot on the left, is at 98.7 — under 100. **Post-panel edit**, unreviewed by any panel. A two-word fix ("the two dots highest on the left"). |
| **"Biggest earners sit furthest below the line."** | `annotations[1]`, at Arsenal | ❌ | **Refuted by the section's own seven points.** See the arithmetic below. |
| Annotation "Smallest revenue. Highest ratio. Same rule." | `annotations[0]` | ✅ | §4.6 verbatim; 6 words. |
| Source "Club accounts, 2024/25" | `source` | ⚠️ | All seven refs are **The Swiss Ramble**, unnamed. |

**The arithmetic behind the ❌.** `ScalingPlot.astro` (lines 173–191) computes an
ordinary least-squares fit in the plotted space; `logX` and `logY` are both
`false`, so the fit is linear on the authored values. On the seven points:
Σx = 3542 (x̄ = 506.0), Σy = 655.9 (ȳ = 93.70), Σdxdy = −29,578.6,
Σdx² = 332,574 → **slope −0.08894, intercept 138.70**. Residuals:

| Club | x | fitted y | actual y | residual |
|---|---|---|---|---|
| **Aston Villa** | 378 | 105.08 | 98.7 | **−6.38 — furthest below** |
| Manchester United | 667 | 79.38 | 75.9 | −3.48 |
| **Arsenal (the anchor)** | 690 | 77.34 | 75.2 | **−2.14** |
| Liverpool | 703 | 76.18 | 77.5 | **+1.32 — above** |
| West Ham | 228 | 118.42 | 120.6 | +2.18 |
| Bournemouth | 182 | 122.51 | 124.7 | +2.19 |
| **Manchester City** | 694 | 76.98 | 83.3 | **+6.32 — furthest above** |

The annotation fails three ways at once: the club furthest below the line is
Aston Villa, not a biggest earner; two of the four biggest earners sit *above*
the line, Manchester City furthest above of anyone; and Arsenal, the point the
callout is pinned to, is not even the lowest residual among the big four.
Nothing in the dossier proposes this annotation — §4.6 suggests only the
Bournemouth one. The storyboard invented it and called it "descriptive of the
plotted values", which is the claim that fails.

### Section 7 · `data-readout`

| Claim | Location | Status | Note |
|---|---|---|---|
| Wages barely moved, losses grew sevenfold | title | ✅ | 64→65%; £135m → £948m = 7.02× (§4.2). |
| Aston Villa's £17m profit rested on £114m from selling the women's team and property rights | intro | ✅ | §4.8 exactly. |
| "The accountants Deloitte put **most** of the £812m increase down to decisions about selling players and club assets" | caption | ⚠️ | §4.8 quotes Deloitte as "**much** of the £812m increase". "Much" does not assert a majority; "most" does. Classic hedge-strength drift, and it originates in the storyboard's own §6 Q3 answer. The paraphrase is otherwise correct and correctly **not** in quote marks. |
| £948m pre-tax losses, up from £135m | `tiles[0]` | ✅ | §4.2. |
| 65% wages share, was 64% | `tiles[1]` | ✅ | §4.2. |
| 8 clubs in operating profit, thirteen the year before | `tiles[2]` | ✅ | §4.2. |
| £6.8bn total revenue, a record, up 8% | `tiles[3]` | ✅ | §4.2, §2. |
| Source "Deloitte Annual Review of Football Finance 2026" | `source` | ⚠️ | The Villa £17m/£114m claim in the intro comes from src-10, **The Swiss Ramble**, which the line does not name — and the line positively attributes the section to Deloitte. The strongest instance of the source-line class. |
| "Those dots are already over the line" | intro | ⚠️ | Refers back to §6. On that chart all seven clubs sit above 85% on one reading and only three above 100% on another; "the line" is not identified. A three-word fix ("the smallest clubs are already over 100%"). |

### Section 8 · `timeline`

| Claim | Location | Status | Note |
|---|---|---|---|
| A rule change needs fourteen of the twenty clubs. This one got them. | caption | ✅ | §4.1 (two-thirds, or 14 clubs; one vote per club), src-03. **Ruling 2 executed correctly** — the threshold leads, no tally is asserted. |
| 2024 · clubs agree to **explore** a hard cap; "a vote to investigate, not to adopt" | `events[0]` | ✅ | §3 row 1. The 16–3 count correctly omitted, per §9.1's warning. |
| 21 Nov 2025 · Squad Cost Ratio approved, the hard cap fails | `events[1]` | ✅ | §3 row 2, src-02. |
| 8 Jul 2026 · Deloitte counts £948m of losses | `events[2]` | ⚠️ | Date and figure ✅ (§3 row 5). But **no Deloitte ref on this section** — `sourceRefs` are src-01/02/03 (Premier League) and src-14 (Swiss Ramble). The one source that publishes this figure is cited on three other sections and not here. |
| 2026/27 · the rule binds, PSR is gone; "Fines first payable from 2027/28" | `events[3]` | ✅ | §3 row 7 / §4.1. "Fines" for "levies" is defensible — the League's own worked example in §4.1 uses "fine". |
| Annotation "The cap that would have narrowed the gap failed here." | `annotations` | ✅ | §3 row 1 (anchoring tied to a multiple of the lowest TV income) + O'Connor, §5. 10 words. |
| Source "Premier League statements" | `source` | ⚠️ | Cites src-14, **The Swiss Ramble**, which carries event 1; and see the missing Deloitte ref above. |

### Section 9 · `comparison`

| Claim | Location | Status | Note |
|---|---|---|---|
| **"Fourteen clubs chose a share of themselves."** | intro | ❌ | **Untraced vote tally.** See below. |
| IPL cap is one amount for all ten franchises | caption / rows | ❌ | **`[PARTIAL]` used without an editor flag.** See below. |
| ₹151 crore, with a ₹125 crore auction purse | `rows[0]` | ❌ | Same. §4.7, marked `[PARTIAL — 403 on direct fetch]`. |
| One franchise had ₹2.75 crore left, another still had ₹64.3 crore | caption | ❌ | Same. §4.7, `[PARTIAL]`. Franchises correctly described rather than named, per storyboard §7. |
| "85% of the club's own football revenue" | `rows[0]` | ⚠️ | Third place in the issue the player-sale half of the base is dropped. Here it matters least (it is a comparison row), but the issue now states the rule three ways. |
| Twenty clubs, twenty ceilings / the same for all ten | `rows[1]` | ✅ | §4.1, §4.7. |
| Your ceiling rises with you / the cap does not move | `rows[2]` | ✅ | §1, §4.7. |
| "At the 2026 auction" | caption | ⚠️ | The IPL 2026 auction was held **16 December 2025** (§4.7); the storyboard writes "the December 2025 auction". ESPNcricinfo's own naming is "IPL auction 2026", so this is defensible, but a reader in September 2026 will place it earlier this year. |
| Source "ESPNcricinfo, IPL 2026 auction" | `source` | ⚠️ | src-01 (Premier League) backs the whole left-hand column and is unnamed. Minor. |

**❌ 1 — "Fourteen clubs chose a share of themselves."** Section 8's caption
correctly states 14 as the *threshold* ("needs fourteen of the twenty clubs.
This one got them"). One section later the draft converts it into a *tally*.
Dossier §9.1 item 1 is unambiguous: "**No allowlisted source gives the actual
for/against split.** The Premier League's own statement deliberately omits it."
It also names this exact conversion as "an easy and damaging" error, and
storyboard ruling 2 dropped the count on those grounds. A reader finishes the
issue believing 14 clubs voted yes and 6 voted no. The fix is one word —
"Enough clubs chose a share of themselves" — and is word-neutral against the
1,097/1,100 budget.

**❌ 2 — the IPL figures.** ₹151 crore, ₹125 crore, ₹2.75 crore and ₹64.3 crore
all sit in dossier §4.7 flagged `[PARTIAL]` and are re-listed in §9.1 item 2
under "the editor must rule on these before drafting": ESPNcricinfo returned 403
to three direct fetches, and the numbers come from two search passes, not from
reading the page. Storyboard ruling 3 says this one "blocks the draft" and asks
the operator for thirty seconds of browser time. The draft carries all four
figures with no `# EDITOR:` comment and no record of that confirmation anywhere
in the repo. **This is provenance paperwork, not a suspected error** — the
figures are internally coherent and probably right. But it is the issue's entire
closing move, and the fallback if they do not hold (ISL ₹16.5 crore, 2021-22,
dated in the sentence) is already specified in §5 of the storyboard.

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | No advocacy, no rhetorical-question closer, no passive filler, no wire tone, no speculation, no meta-commentary. |

Swept mechanically as well: **zero** em-dashes, **zero** semicolons, zero words
from the AI list, zero Devanagari, zero sentence-opening "Notably", no
"not about X, it's about Y", no mirrored close. Colons appear twice (section
3's `terms[0]` before a list and `terms[3]` before a gloss) — both permitted
uses. `status: draft` means nothing has shipped.

**Quotability / copyright gate: not applicable.** The draft contains no verbatim
quotation attributed to any person or document. The one place it could have
carried one — Deloitte on the £812m — is correctly paraphrased outside quote
marks rather than fragmented into an orphan quotation. Nothing to re-source.

**Structure.** The timeline's arc is directional (explore → approve → the losses
that justify it → the rule binds). The `data-readout` tells its story in tiles,
not prose. There is no `paradox` section, so no straw-man risk. No prose
sections at all.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ SOURCE-NARROW | `sources[]` | **warning (gate)** | 16 sources but only **4 publishers** (floor 5), and The Swiss Ramble carries **9 of 16 = 56%** against a 40% ceiling. The dossier's §8 reports 24 sources / 12 publishers / 37.5%, and storyboard §8.5 concluded on that basis that "`SOURCE-NARROW` will not fire". It fires: the draft cites only a third of the bibliography. Five unused publishers are already researched and available — CIES, UEFA, Off The Pitch, Opta Analyst, Scroll.in — but each must be *earned* by a section, not pasted in to clear a gate. The cheapest honest route is restoring the UEFA beat (below), which adds a T0 publisher to exactly the rows Swiss Ramble dominates. |
| ⚠️ STORYBOARD-DRIFT | section 6 `intro` | warning | The storyboard assigns "**§4.9** (Villa and the 70% UEFA rule) in the intro" to row 6. The draft's intro carries neither. **UEFA is name 7 of the storyboard's 8 and appears nowhere in the issue.** The departure is not named in the draft. Accuracy is unharmed — with 70% absent, the §9.2 rule that every percentage must name its regime cannot be broken — but the issue loses its one piece of evidence that a ratio cap already catches a real club, and loses a T0 publisher. |
| ⚠️ STORYBOARD-DRIFT | section 3 `terms[1]` | warning | Ruling 4 placed the sanction ("six points, and another point for every few million over") in the SCR gloss. It is absent, which is why nothing in the issue tells a reader what happens above the line. |
| ⚠️ JARGON-UNGLOSSED | section 1 `data.nodes[3].label` | warning (gate) | `check:prose` flags "football revenue" first used as a `power-flow` node label in section 1 and glossed in section 3. It is a chart label rather than prose, and two sections is a short wait, so this is the mild form of the flag. |
| ⚠️ ANALOGY-CLAIM (cleared) | section 3 `intro` | noted | "Two families told to spend at most 85% of what they earn" maps the mechanism correctly (same rate, different bases → different amounts). No defect. |
| ⚠️ BARE-NUMBER (cleared) | section 7 tiles | noted | £948m carries no Indian-scale comparison, and **must not** — ruling 4 bars a manufactured £→₹ conversion with no sourced FX rate. Every £ figure in the issue is historical, so the no-bracket rule is correctly applied throughout. Deliberate, operator-approved. |
| ⚠️ NO-INDIAN-ANCHOR (cleared) | section 9 | noted | ₹151 crore / ₹125 crore / ₹2.75 crore / ₹64.3 crore, plus the IPL auction as lived reference. Anchor present. |
| ⚠️ SINGLE-VIEWPOINT | `sources[]` | low | Every interpretive source the draft cites is `viewpoint: business-finance` (Deloitte, Swiss Ramble). The dossier's second cluster, `analytics` (CIES, Opta Analyst), is cited nowhere. Low severity because the issue's central claim — 85% of a bigger number is a bigger number — is arithmetic, not a contested reading. Same fix as SOURCE-NARROW. |
| FALSE BALANCE | — | clear | No settled figure is hedged against a contrary opinion. |
| Hindi flags | — | clear | Zero Hindi, by storyboard §5's deliberate ruling. HINDI-LOAD-BEARING, HINDI-FIELD, HINDI-SPELLING, HINDI-DENSE all inapplicable. |
| NAME-THROUGHPUT / NAME-UNPLACED | — | clear | 9 names against a cap of 12. Deloitte carries its role phrase ("The accountants Deloitte"); Aston Villa is placed by its own beat; club names on charts are `label`/`name` fields and cost no slots. |
| TITLE-FORMULA / HOOK-ABSTRACT | head | clear | Title states the finding, is not "The ‹Noun› That ‹Verb›s". Hook carries two figures, a "you" and the twist. |
| TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC / HEAD-HEAVY | — | clear | 1,097 words (ceiling 1,100); 7 of 9 visual; 78 words before the first graphic (ceiling 80); text-only rows 3 and 9 are not adjacent. |
| FEW-GRAPHICS / CARD-HEAVY / NO-NEW-KIND | — | clear | 5 of 9 drawn (56%) across 5 graphic kinds; 3 cards, one of each; 2 kinds new to the publication (`power-flow`, `channel-ternary`). |
| QUESTION-UNANSWERED | — | clear | All three storyboard questions are answerable from the draft alone. The post-panel edits are what closed Q1 and Q2 — see below. |
| ℹ CHROME-HEAVY ×7 | sections 1, 2, 5, 6, 7, 8, 9 | info | `check:prose` info-level only; sections 8 and 9 carry 11 and 13 text blocks. Not a gate failure. |

### The source-line audit (the systemic ⚠️)

Per section, the `source` string against the publishers of the ids it actually
cites:

| § | `source` string | publishers of cited refs | |
|---|---|---|---|
| 1 | Deloitte ARFF 2026 | Deloitte ×2 | ✅ |
| 2 | "Premier League rules and **club accounts**" | Premier League, **Swiss Ramble ×2** | ⚠️ |
| 3 | "Premier League" | Premier League, **Swiss Ramble** | ⚠️ |
| 4 | "**The Swiss Ramble**, club accounts 2024/25" | Swiss Ramble ×7 | ✅ |
| 5 | "**Club accounts** and Deloitte" | Deloitte, **Swiss Ramble ×7** | ⚠️ |
| 6 | "**Club accounts**, 2024/25" | **Swiss Ramble ×7** | ⚠️ |
| 7 | "Deloitte ARFF 2026" | Deloitte ×2, **Swiss Ramble** (the Villa claim) | ⚠️ |
| 8 | "Premier League statements" | PL ×3, **Swiss Ramble**; **no Deloitte ref** under a Deloitte event | ⚠️⚠️ |
| 9 | "ESPNcricinfo, IPL 2026 auction" | ESPNcricinfo ×2, Premier League | ⚠️ |

Six sections write "club accounts" or name only the Premier League where the id
they cite is a T7 named-expert blog. That is a quiet **upgrade of provenance**:
Parallax did not read the filed accounts, Kieron O'Connor did, and the dossier
applies exactly this discipline elsewhere (§4.9: "attribute to the outlet, not
to UEFA"). Section 4 gets it right, which is what makes the other six an
oversight rather than a house convention. The fix is about three words per line
("club accounts, read by The Swiss Ramble") and it also puts the publisher's
name in front of a reader who currently never learns who produced two thirds of
the issue's numbers.

### The post-panel edit diff

The panel is a **first** pass and quotes the draft verbatim, so diffing its
quotations against the current file finds every edit made after it. Three
differ, all of them closing the panel's own three fixes, none re-read by any
gate before this report:

1. §3 SCR gloss gained "Earn £100 that way, and £85 is your ceiling." — traced
   to §4.1; 24 words against the 25-word cap.
2. §2 `data.note` gained "Manchester City earned £694m, Bournemouth £182m." —
   traced to §4.4; 10 words against the 20-word cap.
3. §6 `howToRead` replaced "The ranking is the finding, not the exact level."
   with a four-sentence panel — an improvement, but it introduced the "Dots high
   on the left" imprecision flagged above.

**No fourth, undeclared edit exists.** The other four strings the panel quotes
are byte-identical to the file. The cost is that the three edits spent 16 of the
storyboard's 19 words of slack, which is why every fix below is priced.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| `status: draft` | ✅ | |
| All section kinds registered | ✅ | All 9 present in `SECTION_KINDS` (`src/content/config.ts`): timeline 9, comparison 13, you-think 15, jargon-buster 19, data-readout 23, benchmark-chart 37, power-flow 52, scaling-plot 85, channel-ternary 115. |
| No `author` field | ✅ | |
| `publishedAt` valid | ✅ | 2026-09-21. |
| Source URLs `https://` | ✅ | All 16. |
| Source `kind` values valid | ✅ | primary ×3, analysis ×11, secondary ×2. |
| ≥ 8 sources | ✅ | 16. |
| ≥ 5 publishers, none above 40% | ❌ | **4 publishers; Swiss Ramble 56%.** The 2026-09-16 diversity floor. |
| All `sourceRefs` resolve | ✅ | Every id src-01…src-16 is defined, and every defined id is cited at least once. No orphans either way. |
| `plain` ≤ 220 chars | ✅ | 85 / 130 / 103. |
| `howToRead` 40–360 chars | ✅ | 118 / 186 / 228. |
| `primer` 80–420 chars | ✅ | ~146. |
| `layout` values legal | ✅ | default ×5, breath ×3, split ×1 (the hero only). Matches the storyboard row for row. |
| `skimCaption` | ✅ | None authored; correct, since there are no `prose` sections. |

---

## Required fixes before publish

1. **§9 intro — remove the vote tally.** Change "Fourteen clubs chose a share of
   themselves." to a phrasing that does not assert a count: "Enough clubs chose a
   share of themselves." Word-neutral. *(❌ 1 — untraced claim.)*
2. **§6 — delete or rewrite the Arsenal annotation.** "Biggest earners sit
   furthest below the line." is false against the section's own seven points:
   Aston Villa is furthest below (−6.4), Manchester City is furthest *above*
   (+6.3), and Arsenal is −2.1. If a second annotation is wanted, the true
   version of the same idea is about *level*, not residual — e.g. at Arsenal,
   "The four biggest earners all sit under 85%." (correct: 83.3, 77.5, 75.9,
   75.2). Deleting it frees 7 words. *(❌ 2 — contradicted by the draft's own
   data.)*
3. **Confirm the IPL figures, and record the confirmation.** ₹151 crore /
   ₹125 crore / ₹2.75 crore / ₹64.3 crore are `[PARTIAL]` (dossier §4.7, §9.1
   item 2) because ESPNcricinfo 403'd the crawler three times. Storyboard ruling
   3 asks for thirty seconds of browser time. Either confirm and add a line to
   the dossier saying so, or fall back to the ISL's ₹16.5 crore squad salary cap
   with "in 2021-22" in the sentence. *(❌ 3 — provenance paperwork, not a
   suspected error.)*
4. **Fix the six source lines that name "club accounts" where the id is The
   Swiss Ramble** (§2, §3, §5, §6, §7 — and §8, which cites src-14). Section 4's
   "The Swiss Ramble, club accounts 2024/25" is the model. ~3 words each; pay for
   it out of fix 2's refund.
5. **§8 — add `src-04` to `sourceRefs`.** The timeline asserts "8 Jul 2026 ·
   Deloitte counts £948m of losses" while citing only Premier League and Swiss
   Ramble ids. The source that publishes that figure is on five other sections
   and not this one.
6. **§7 caption — "most" back to "much".** Deloitte's published wording is "much
   of the £812m increase" (§4.8). "Most" asserts a majority the source does not.
   Word-neutral.
7. **Clear `SOURCE-NARROW`.** 4 publishers against a floor of 5, Swiss Ramble at
   56% against a ceiling of 40%. The fix that does double duty is restoring the
   storyboard's assigned §4.9 beat to §6's intro — Aston Villa failing UEFA's
   tighter 70% version of the same rule, *attributed to Swiss Ramble's reading*
   per §9.1 item 3 — and citing the UEFA ECFIL landing page alongside it. That
   adds a T0 publisher to the rows Swiss Ramble currently dominates, restores
   UEFA (storyboard name 7), and gives the issue its only piece of evidence that
   a ratio cap has already caught a real club. **Budget:** at 1,097 of 1,100 this
   must be paid for; the storyboard's designated slack is §3 dropping to three
   terms (−24) or §9 dropping to two rows (−30). Do not pay out of the hero.

---

## Optional improvements

1. **Say what happens above 85%.** The issue calls 85% "the ceiling", "the
   line", "your ceiling" and never mentions that §4.1 makes it the *green*
   threshold: between 85% and 115% a club pays a levy and keeps playing, there is
   a 30% multi-year allowance, and sporting sanctions start only at 115%. The
   panel's readers took away "some clubs are already breaking the new rule",
   which is stronger than the record. Ruling 4 had reserved a home for this in
   the SCR gloss. Not flagged ❌ because nothing stated is false — the omission
   is what overstates.
2. **§6 `howToRead` — "Dots high on the left"** covers three dots on the chart
   and is true of two. "The two dots highest on the left" is exact and costs one
   word.
3. **Restore `benchmark-chart`'s `sublabel`s.** Dossier §4.5 supplies a wage bill
   per club (£158m, £176m, £273m…) and the field has rendered since 2026-09-15.
   The panel's Karthik specifically wanted raw numbers printed rather than
   implied by bar length. Costs words, so it competes with fix 7.
4. **§6's caption states no finding.** It is a method note, and the storyboard
   mandated exactly that content — so this is not a CAPTION-FORM defect. But it
   is the one caption in the issue that tells a reader nothing about what the
   chart shows, and it is the sentence the panel's Sana lost. If the caveat can
   move into the `howToRead` (which already carries half of it), the caption
   could carry the finding: the ranking, not the level.
5. **§9 caption — "At the 2026 auction"** could read "At the auction in December
   2025" to stop a September-2026 reader placing it earlier this year. Costs two
   words.
6. **§7 intro — "Those dots are already over the line"** does not say which line.
   "Over 100%" is what the chart shows.
