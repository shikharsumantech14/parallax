# Verification Report: The Bill Came Due in April

- **Draft:** src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx
- **Dossier:** research/tech/2026-06-04-ai-coding-token-bill-dossier.md
- **Verified:** 2026-06-04
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION.** This is a clean, disciplined draft that is one mechanical
fix away from publishable. Every load-bearing fact, date, dollar figure, and
quote traces to the dossier; all six Willison quotes are verbatim; the
arithmetic on the one measured scaling-plot anchor (169,818 + 17,112 +
1,176,320 = 1,363,250) is correct and the lower four points are explicitly
labelled illustrative on the label, caption, and source line. All four
guardrail items from the brief pass: the unsourced $18.40 -> $6.07/M blended
figure is **absent**, the Microsoft / Claude-Code-license-cancellation story
is **absent**, the 5-30x multiplier never appears as a hard figure (only
order-of-magnitude framing), and no `version-graph` is used. There are **no
`X` UNTRACED claims and no advocacy** — nothing blocks publish.

The single thing standing between this and APPROVED: the off-allowlist Goldman
24x-by-2030 figure (src-08, goldmansachs.com) is inline-attributed to analyst
Jim Schneider and is documented in the bottom MDX `{/* EDITOR NOTES */}` block,
but it does **not** carry an inline `# EDITOR:` flag on the prose field that
states the claim, which is the convention `_AGENTS.md` §8 mandates and the
brief requires. Move the flag onto the carrying field (close prose para 2 +
skimCaption) and resolve the allowlist decision, and this is APPROVED. One
minor AI-tell (a double em-dash in the paradox) should be fixed in the same
pass.

---

## Claim verification

| Claim | Location | Status | Note |
|---|---|---|---|
| Claude 3 Haiku launched at $0.25 / $1.25 per M in/out | paradox · side 1 detail | `OK` | Dossier §4 verbatim |
| GPT-5-mini at $0.05 / $0.40 | paradox · side 1 detail | `OK` | Dossier §4 |
| Grok 4 Fast at $0.20 / $0.50 | paradox · side 1 detail | `OK` | Dossier §4 |
| "rate card fallen more than an order of magnitude in three years" | paradox · side 1 detail | `OK` | Dossier §1, §4 |
| One task can burn "well over a million tokens"; chat reply "a few thousand" | paradox · side 2 detail | `OK` | Dossier §4 (1M ceiling verified; order-of-magnitude framing, no hard multiplier) |
| Uber budgeted 2026 on old model, exhausted annual figure in four months | paradox · side 2 detail | `OK` | Dossier §2, §4 |
| "from often-work to mostly-work, crossing a quality barrier..." (quote) | prose CROSSOVER · para 1; timeline Nov 24 | `OK` | **Verbatim** vs dossier §5 |
| GPT-5.1 Codex Max shipped 19 Nov 2025 | prose CROSSOVER · para 1; timeline | `OK` | Dossier §3 (2025-11-19) |
| Claude Opus 4.5 shipped 24 Nov 2025 | prose CROSSOVER · para 1; timeline | `OK` | Dossier §3 (2025-11-24) |
| "Reinforcement Learning from Verifiable Rewards to increase the quality of code written by their models" (quote) | prose CROSSOVER · para 1 | `OK` | **Verbatim** vs dossier §5 |
| "maintain state by replaying entire conversations with each new prompt" (quote) | prose CROSSOVER · para 2 | `OK` | **Verbatim** vs dossier §4/src-06; draft correctly ends quote before the "...causing input token growth" clause |
| "as a conversation gets longer, each prompt becomes more expensive since the number of input tokens grows every time" (quote) | prose CROSSOVER · para 2 | `OK` | **Verbatim** vs dossier §4 |
| "burn vastly more tokens, but are also quickly becoming daily drivers..." (quote) | prose CROSSOVER · para 3 | `OK` | **Verbatim** vs dossier §5 / src-02 |
| scaling-plot top point 1,363,250 (= 169,818 in + 17,112 out + 1,176,320 cached) | scaling-plot · intro + points | `OK` | Dossier §4; arithmetic checks (sum = 1,363,250); labelled "measured" / "only verified point" |
| scaling-plot lower 4 points (5,000 / 22,000 / 90,000 / 320,000) illustrative | scaling-plot · points + caption + source | `OK` | Each label carries `*`; caption + source line state "illustrative of task class, not measured" — matches dossier guardrail (§4, notes #3) |
| GPT-5 ships 7 Aug 2025 at $1.25 / $10 | timeline · Aug 7 2025 | `OK` | Dossier §3 (2025-08-07) |
| OpenAI moved Codex pricing "to align with API token usage, instead of per-message pricing" (quote) | timeline · Apr 2 2026 | `OK` | **Verbatim** vs dossier §3/§4 |
| Anthropic enterprise ~$20/seat/month plus API pricing | timeline · Apr 14 2026 | `OK` | Dossier §3 (terms changed; announced 2026-04-14) |
| Opus 4.7 at unchanged $5 / $25; effective cost ~1.4x vs Opus 4.6 | timeline · Apr 16 2026; data-readout | `OK` | Dossier §3, §4 (1.46x system-prompt, ~40% net; "~1.4x" is the conservative framing) |
| GPT-5.5 ships 23 Apr 2026 at 2x the price of GPT-5.4 | timeline · Apr 23 2026; data-readout | `OK` | Dossier §3, §4 |
| Uber 2026 AI budget exhausted ~Apr 2026 | timeline · ~Apr 2026 | `OK` | Dossier §3, §4 |
| Uber caps every engineer at $1,500/month per tool (Bloomberg, Natalie Lung) | timeline · Jun 2 2026; data-readout; src-01 quote | `OK` | Dossier §3, §4, §5 — **cap quote verbatim** on src-01 |
| Willison calls the cap "a rational policy response to over-spending" | timeline · Jun 2 2026 | `OK` | Dossier §5; phrase matches verbatim (rendered as reported speech, not quoted) |
| Willison 30-day usage = $2,180.16 of tokens at API rates | benchmark-chart · item + intro; data-readout | `OK` | Dossier §4/§5; rounded "$2,180" tile is consistent |
| Anthropic Claude Code $1,199.79 | benchmark-chart · item | `OK` | Dossier §4 (1199.79 + 980.37 = 2180.16) |
| OpenAI Codex $980.37 | benchmark-chart · item | `OK` | Dossier §4 |
| Paid $200 (Max + Pro) | benchmark-chart · refValue; data-readout | `OK` | Dossier §4 |
| Cap applies to agentic tools (Cursor, Claude Code), not chat | data-readout · tile 1; src-01 quote | `OK` | Dossier §4, §5 |
| ~11% of median comp; two tools ~$36,000/yr vs ~$330,000 comp; "Willison's arithmetic on Levels.fyi data, not an Uber disclosure" | data-readout · tile 3; close prose; skimCaption | `OK` | Dossier §4 — **caveat carried correctly** ("not an Uber disclosure") per dossier instruction |
| "We stopped buying answers and started renting workers" / cost "moved" | close prose · para 1, 3 | `OK` | Structural restatement of dossier §1 thesis; no new claim |
| Goldman Sachs Research projects token consumption ~24x by 2030, to ~120 quadrillion tokens/month; analyst Jim Schneider | close prose · para 2; skimCaption | `!` | **IMPRECISE SOURCING, not the figure.** Figure + analyst match dossier §4 exactly. But src-08 (goldmansachs.com) is **off the tech allowlist**, was JS-gated on fetch, and the figure was confirmed only via a non-cited secondary. Inline attribution to Jim Schneider is present and correct; the required inline `# EDITOR:` flag is **missing from the carrying field** (it lives only in the bottom MDX comment block). See Required fix #1. |
| "the unit economics suggest it will not be the last" / "The curve only points one way" | close prose · para 2 | `OK` | Hedged inference grounded in the cited Goldman projection + documented dynamics; not free-standing speculation. See Optional #2. |

**Absence checks (brief-mandated):**

| Must be ABSENT | Result |
|---|---|
| $18.40 -> $6.07/M blended cost-of-intelligence figure | `OK` ABSENT — appears nowhere in draft body; only named in the dropped-items MDX comment |
| "Microsoft cancelling Claude Code licenses" story | `OK` ABSENT — appears nowhere in draft body; only named in the dropped-items MDX comment |
| 5-30x multiplier as a hard figure | `OK` Never stated as a figure; only "order of magnitude" / "three orders of magnitude" framing |
| `version-graph` section | `OK` Not used; story is economic, not a release tree (dossier notes / §7) |

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| Two em-dashes in one paragraph ("...and the product — the actual invoice — goes up.") | paradox · side 2 detail | `!` MINOR (AI-tell: max 1 em-dash/para) | Drop the parenthetical em-dashes: "...and the product, the actual invoice, goes up." Or recast: "...and the product goes up. That product is the invoice." |
| Binary-reframe budget spent | close prose · title "The cost didn't fall. It *moved*." | note (within limit) | This is the issue's **one permitted** "not X / Y" reframe and it *is* the structural argument — allowed. Flagged only so the editor knows the per-issue budget is used; the dek ("Cheaper is a per-unit word. The invoice is a per-task number.") and close para 1 lean on the same contrast, which reads as one sustained thesis, not repetition. No change required. |

No advocacy. No rhetorical-question closers. No passive filler. No wire-service
tone. No meta-commentary ("In conclusion" / "This shows that"). No
triple-fragment closer. No "First/Second/Third" manifesto rhythm. No
abstract-noun labels ("the mechanism" / "the structural argument") leaked from
the dossier into prose. Mode variety is healthy (CONVERSATIONAL EXPLAINER in
the crossover, DRY/FORENSIC in the timeline + readout, LYRICAL COMPRESSION in
the close — within the 2-paragraph cap).

**Structure check:** Paradox is genuinely two-sided (both blades are true, not
a straw man) — `OK`. Timeline arc is clearly directional and causal (tools
get good -> pricing flips to metered -> frontier prices rise -> budget
exhausted -> cap) — `OK`. Data-readout tells its story through six numeric
tiles — `OK`. Scaling-plot earns its log axis (one anchor sits three orders
above the floor) — `OK`.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | `OK` | Line 8 |
| All section kinds registered | `OK` | paradox, prose, scaling-plot, timeline, benchmark-chart, data-readout all in SECTION_KINDS (config.ts) |
| No author field | `OK` | Absent from frontmatter |
| publishedAt valid | `OK` | 2026-06-04 (real date) |
| Source URLs https:// | `OK` | All 8 sources use https:// |
| Source kinds valid | `OK` | Only primary / analysis used (both valid enum members) |
| >=6 sources | `OK` | 8 sources (src-01 … src-08) |
| primer 80-420 chars | `OK` | ~365 chars; no em-dashes, no acronyms, ends on a forward gesture ("Here is how the math broke.") — conforms to §4 |
| sourceRefs resolve | `OK` (n/a) | No section declares an explicit `sourceRefs[]` array; sourcing is carried in per-section `source:`/`note:` text + the sources[] block. Not a schema failure (sourceRefs defaults to []), but see Optional #1. |

---

## Required fixes before publish

1. **Goldman 24x figure — move the `# EDITOR:` flag onto the carrying field
   and resolve the allowlist decision.** The figure (24x by 2030, ~120
   quadrillion tokens/month) and the analyst name (Jim Schneider) are correct
   per dossier §4, and the inline attribution is good. But per `_AGENTS.md` §8
   and the brief, the off-allowlist claim must carry an **inline `# EDITOR:`
   flag on the field that states it** — i.e. appended to the close prose para 2
   value (and ideally the skimCaption), the way every other current draft does
   it. Right now the caveat lives only in the bottom `{/* EDITOR NOTES */}`
   block, which documents it but does not satisfy the inline-flag convention.
   Add, e.g.: `# EDITOR: Goldman 24x/2030 (src-08) — goldmansachs.com is
   off-allowlist; JS-gated on fetch, figure confirmed via secondary. Cut this
   sentence + src-08 if not confirmed at audit.` Then make the editorial call:
   either confirm via the Goldman report (or accept the secondary) and remove
   the flag, **or** cut the sentence + src-08 — the issue stands entirely on the
   verified Willison facts without it (dossier §9 says exactly this).

2. **Fix the double em-dash in the paradox** ("...the product — the actual
   invoice — goes up"). Two em-dashes in one paragraph trips the AI-tell rule
   (max 1/paragraph). Recast with commas or a full stop. This is the only
   prose-mechanics defect in the draft.

---

## Optional improvements

1. **Consider populating `sourceRefs[]` per section.** Every section names its
   sources in prose / `source:` lines and all eight sources resolve in
   `sources[]`, so nothing is unsourced and the build passes. But the schema
   field `sourceRefs[]` is empty on every section, so the machine-readable link
   from a section to its source ids is absent. Not a blocker (the field
   defaults to `[]` and the delimitation reference issue also leans on prose
   attribution), but wiring `sourceRefs: ["src-01", ...]` would make the audit
   trail explicit and survive future refactors.

2. **"it will not be the last" / "the curve only points one way"** (close prose
   para 2) is a forward-looking inference. It is properly hedged ("suggest")
   and anchored to the cited Goldman projection, so it is not speculation in
   the prohibited sense — leave it if the Goldman sentence stays. **If** Required
   fix #1 ends in cutting the Goldman sentence, soften this clause too so the
   forward claim doesn't lose its only sourced footing.

3. **data-readout "$2,180" tile** rounds the verified $2,180.16. Consistent and
   fine for a tile; if you want zero ambiguity, "$2,180.16" matches the
   benchmark-chart figure exactly. Cosmetic only.
