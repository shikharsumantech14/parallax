# Verification Report: Open models are four months behind, not years

- **Draft:** src/content/issues/2026-09-21-open-models-four-months-behind/index.mdx
- **Dossier:** research/tech/2026-09-17-open-models-four-months-behind-dossier.md
- **Storyboard:** research/tech/2026-09-21-open-models-four-months-behind-storyboard.md (Status: approved)
- **Panel 2:** research/tech/2026-09-22-open-models-four-months-behind-panel-2.md (BLOCK)
- **Verified:** 2026-09-22
- **Verdict:** BLOCKED

---

## Overall verdict

**BLOCKED, and the blockers are not accuracy blockers.** This is an unusually
clean draft on the thing a verifier normally catches: 51 traced claims, **zero
invented facts**, every arithmetic check passes, and every one of the dossier's
thirteen §9 landmines is respected — the eight points are never converted into
four months, Epoch's own understatement caveat is carried, K3's licence is never
stated, MIT is named only on DeepSeek V4, 1.56TB never appears, and the
announce/release split on 16 vs 27 July is written out. There is no quotation
anywhere in the issue, so the quotability gate has nothing to assess and there is
no copyright exposure.

What blocks it is **the gap between what the frontmatter asserts and what the
components render**. Section 7 does not build at all: `core/NumberSense.astro`
throws at build time on a numeric `value`, and the draft authors `value: 4795`.
Section 5 makes three claims in its `intro` and `plain` that `VersionGraph.astro`
cannot support — it names three labs the reader never sees, promises columns that
carry no labels, and claims a chronological order the component does not lay out.
Section 4's `plain` states a selection rationale that the dossier contradicts.
Section 8, which carries the issue's landing numbers, has no source line at all.
Every one of these is fixable in the MDX without new research; none can be waived.

The composition floors are all clear — 1,014 reader words, 6 of 8 sections
visual, 4 drawn graphics across 4 kinds, 2 kinds new to the publication, 13
sources from 8 publishers with Epoch at 31%, 71 words before the first graphic,
5 names. The advocacy, wire-tone and speculation sweeps are empty.

---

## Claim verification

| Claim | Location | Status | Note |
|---|---|---|---|
| Open models four months behind the closed frontier | title · hook · primer | ✅ | Dossier §4.1, Epoch AI May 2026 |
| Kimi K3 took 84 days to reach April's closed frontier | hook | ✅ | 23 Apr → 16 Jul = 84 days; ECI 158.22 vs 158 |
| "You can download it free. Almost nobody has." | hook | ⚠️ | Dossier supports "no state-backed programme picked one" (§4.8), not a download claim. K3 has real Hugging Face downloads. Compression overstates |
| The gap is small but has stopped shrinking | primer | ✅ | 3 months Oct 2025 → 4 months May 2026 |
| Four months behind, gap stopped shrinking | §1 you-think · caption | ✅ | §4.1 |
| Epoch AI scores models on hard tests; ECI 4-month gap | §1 · data.actually | ✅ | §4.1, §4.2 |
| Closed lead on preference grew 0.5% → 3.3% | §1 · data.note | ⚠️ | Figure is correct (Stanford HAI Arena, §4.3) but the section `source` names only "Epoch AI, open-closed capability gap". Source-line drift |
| Open weights = the finished model file, not the recipe | §2 jargon-buster | ✅ | §4.7 |
| Open source = weights + code + data; almost no large model ships all three | §2 | ✅ | §4.7, Stanford HAI |
| ECI = Epoch's capability index, one score from many tests | §2 | ✅ | §4.2 |
| **"The gap shrank, then stopped"** | §3 timeline · title | ⚠️ | Contradicted by the section's own data: 3 months → 4 months. Its own note reads "The gap widened, it did not close" |
| 2025-10-30 Epoch reads gap: three months, averaged over nearly three years | §3 · events[0] | ✅ | §3 timeline |
| 2026-04-23 GPT-5.5 · ECI 158.22 | §3 · events[1] | ✅ | §4.5 |
| 2026-05-29 four months now | §3 · events[2] | ✅ | §4.1 |
| 2026-07-16 Kimi K3 · ECI 158; announced 16 July, weights 27 July | §3 · events[3] | ✅ | §3; landmine respected verbatim |
| 2026-09-03 GPT-6 Astra · ECI 166, eight points ahead | §3 · events[4] | ✅ | 166 − 158 = 8 |
| Three months Oct 2025, four months May 2026 | §3 · caption | ✅ | §4.1 |
| Annotation "April's frontier, reached 84 days later" at 2026-07-16 | §3 · annotations | ✅ | Anchor resolves — Timeline matches the event's exact `date` string |
| Eight points and four months are two readings that do not convert | §4 · intro | ✅ | §9 note 1 respected exactly |
| Epoch warns its reading may understate the gap (public-test tuning) | §4 · intro | ✅ | §4.1 caveat carried |
| Mystery Game Puzzles: open 26%, closed 84%, gap 58 | §4 · items[0] | ✅ | §4.5; 84 − 26 = 58 |
| Chess Puzzles: open 39%, closed 72%, gap 33 | §4 · items[1] | ✅ | §4.5; 72 − 39 = 33 |
| SimpleQA Verified: open 51%, closed 76%, gap 25 | §4 · items[2] | ✅ | §4.5; 76 − 51 = 25 |
| GPQA Diamond: open 93%, closed 96%, gap 3 | §4 · items[3] | ✅ | §4.5; 96 − 93 = 3 |
| Near parity on graduate science; 26% vs 84% on a puzzle game | §4 · caption | ✅ | §4.5 |
| **"These four are the widest and the narrowest, not an average."** | §4 · plain | ❌ | **UNTRACED.** Dossier §4.5: these are the only four **cleanly paired** benchmarks — FrontierMath excluded (different versions), ARC-AGI-2 excluded (no paired Astra figure). The stated rationale is not the real one |
| Both benchmark annotations | §4 · annotations | ✅ | `at` values match item labels exactly; both resolve |
| **"Three labs you have probably never heard of. Each has its own column below"** | §5 · intro | ❌ | **UNRENDERED.** `VersionGraph.astro` draws no lane labels — lanes are colour only. "Moonshot", "Zhipu" and "Z.ai" appear nowhere in the issue. The reader is promised three labs and shown none |
| **"Each row is one release, oldest at the top"** | §5 · plain | ❌ | **FALSE IN RENDER.** `cy(i)` positions rows by **array index**, and the array is grouped by lane: k2-thinking (2025-11-06) sits below ds-v4flash (2026-04-24). No dates render either |
| **"the column is the lab that made it"** | §5 · plain | ❌ | Columns carry no labels of any kind. Unverifiable by the reader |
| Eight of ten releases are open weights | §5 · caption | ✅ | 8 nodes tagged `open`, 2 `closed` |
| "the newest landed in July" | §5 · caption | ⚠️ | True of the open releases only. GPT-6 Astra (3 September) is in the same graphic and is newer |
| Node labels render as raw ids (`ds-v32`, `k3`, `glm51`) | §5 · data.nodes | ⚠️ | The legend's bold primary string is `nd.id`; `nd.label` is a secondary line that is `display: none` below 480px. On a phone the section renders slugs only |
| `lane: 4` with no lane 3 | §5 · data.nodes | ⚠️ | `maxLane` drives width, so an empty column is reserved between the open and closed groups |
| V4-Pro · MIT, V4-Flash · MIT | §5 · nodes | ✅ | §4.6; MIT named on DeepSeek V4 only — landmine respected |
| Kimi K3 · 2.8T | §5 · nodes | ✅ | §4.6; 1.56TB correctly never printed |
| Eight of those ten releases are free to download | §6 · intro | ✅ | Consistent with §5 |
| Weights: Kimi K3, DeepSeek V4, Qwen downloadable today | §6 · layers[0] | ✅ | §4.7 |
| Permissive licence: 81% of Chinese releases above 20B, 29% of American | §6 · layers[1] | ✅ | §4.7, Hugging Face census |
| Code: inference usually, training rarely | §6 · layers[2] | ✅ | §4.7 |
| Training data almost never released | §6 · layers[3] | ✅ | §4.7, Stanford HAI |
| Compute and serving: not downloadable at any licence | §6 · layers[4] | ✅ | §4.7 |
| "not downloadable at any **price**" | §6 · caption | ⚠️ | Widens the layer's own "at any **licence**". Compute is precisely what money *does* buy — the section's own point is that the cluster is the real bill |
| **`value: 4795`** | §7 · data.value | ❌ | **BUILD-BREAKING.** `NumberSense.astro` throws: *"`value` is required, as an authored string carrying its own formatting."* YAML parses this as a number |
| **`unit: "₹"`** | §7 · data.unit | ❌ | `unit` renders as a mono uppercase suffix *after* the figure (`.px-ns__u`), so this paints "4795 ₹" against a caption reading "₹4,795" |
| Value carries no digit grouping | §7 · data.value | ⚠️ | The component never reformats (deliberately — en-IN `toLocaleString` regroups). Published convention is `value: "300,000"` |
| GPT-6 Astra ₹4,795 per million output tokens | §7 · value · caption | ⚠️ | Arithmetic correct ($50 × 95.9 = 4,795) but **$50 appears nowhere in the issue**. Contract §3 rule 4: the foreign figure is primary, ₹ in brackets after |
| Best open model ₹1,439 / $15 per million | §7 · equals[0] | ✅ | 15 × 95.9 = 1,438.5. Order inverted (see register audit) |
| DeepSeek V4-Flash ₹27 / $0.28 per million | §7 · equals[1] | ✅ | 0.28 × 95.9 = 26.85 |
| An Indian-language question costs about five times the English price | §7 · data.note | ✅ | §4.9, tokenisation penalty |
| Rate and month on the source line (₹95.9/$, September 2026) | §7 · source | ✅ | §3 rule 4 composition clause satisfied |
| Renting open costs less than a third of renting closed | §8 · para 1 | ✅ | 50 / 15 = 3.3× |
| 139 state-backed AI projects across 56 countries | §8 · para 1 | ✅ | §4.8, Rest of World |
| About 40% picked Llama, Meta's open-weight model | §8 · para 1 | ✅ | §4.8 |
| Not one picked a model from the open frontier labs | §8 · para 1 | ✅ | §4.8 |
| "83% of all downloads ever go to the smallest models on offer" | §8 · para 2 | ⚠️ | Drops both dossier qualifiers: *among models that declare a parameter count*, and *under 1 billion parameters*. Panel 2 flagged the same omission against storyboard §6 |
| Sarvam AI adapts open-weight models to Indian languages | §8 · para 2 | ✅ | §4.9, Rest of World |
| "a free textbook nobody opens because the shelf sits in another building" | §8 · para 1 | ⚠️ | ANALOGY-CLAIM. The analogy says *distance / awareness*; the dossier's mechanism (and the next sentence) says *the cost of the stack underneath*. The picture argues the opposite of the finding |
| §8 carries no `source` and no `sourceRefs` | §8 | ❌ | CANON §7, "no source, no section". This is the section holding 139 / 56 / 40% / 83% / Sarvam. Section renders no source line at all |

**Totals: 51 ✅ verified · 14 ⚠️ imprecise · 7 ❌ (1 untraced, 5 unrenderable-or-breaking, 1 unsourced section).**

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| — | — | — | Advocacy, wire tone, rhetorical closers, passive filler, meta-commentary and speculation sweeps are all **empty**. No section takes a side beyond the sources; no "will happen" claim appears anywhere |

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ PLAIN-CLAIM | §4 · plain | High | "These four are the widest and the narrowest, not an average" asserts a selection rationale — a data claim in a field that may carry form only. It is also the wrong rationale (see claim table) |
| ⚠️ PLAIN-CLAIM | §5 · plain | High | "Each row is one release, oldest at the top" reads as form but asserts an ordering the component does not produce |
| ⚠️ CURRENCY-INVERTED | §7 · value, equals | High | All three figures are rupee-first with the dollar demoted to a `note` or absent. Contract §3 rule 4: the foreign figure is primary, "(about ₹…)" in brackets after. `check:prose` sees the same defect from the other side (`FOREIGN-ANCHOR`, equals[0] and [1]). The 2026-09-15 clause also bars rupee-bracketing a **per-token rate card** at all |
| ⚠️ JARGON-UNGLOSSED | §2 "token" | Medium | `check:prose`. First use inside the jargon-buster itself; §7's intro glosses it later ("small chunks of text a model reads and writes") — move the gloss to first use |
| ⚠️ JARGON-UNGLOSSED | §2 "open source", "ECI", §1 "AI" | Low | `check:prose`. All three are glossed in the same card; the gate fires on the term appearing before its `meaning` string. Cosmetic |
| ⚠️ ANALOGY-CLAIM | §8 · para 1 | Medium | The textbook-in-another-building picture argues inconvenience; the dossier's mechanism is cost of the stack |
| ⚠️ CAPTION-FORM | — | — | Not flagged. Every caption asserts data |
| ⚠️ REDUNDANT-HOWTO | — | — | Not flagged. No section authors `howToRead`; none of the seven kinds used is in `NEEDS_HOW`, so no panel renders. Acceptable, but §5 is a counter-intuitive form that would earn one |
| ⚠️ SOURCE-OFF-ALLOWLIST | `src-13` | Low | Federal Reserve H.10 is not on `research/_sources/tech.md` (checked directly, not taken from the dossier — the allowlist has no FX row at all). It is a T0-grade primary used only for the conversion rate. Recommend adding an FX row to the allowlist rather than dropping the source |
| ⚠️ NO-SOURCE-SECTION | §8, §2 | High / Low | §8 is a CANON §7 breach (blocker, above). §2 `jargon-buster` is narrative and its definitions are general, so its bare state is defensible |
| ✅ HINDI | §6 · intro | Clean | One phrase, "kharcha" — in the lexicon, allowed on tech, in a prose field, and **not load-bearing** (delete it and "that does not come with the file" still says everything). No Hindi in any precision field |
| ✅ Composition floors | whole issue | Clean | 1,014 reader words · 8 sections, 6 visual, **4 drawn** across 4 graphic kinds · 3 cards, each used once · **2 new kinds** (`version-graph`, `arch-stack`) · 71 words before the first graphic · 5 names |
| ✅ SOURCE-NARROW | sources | Clean | 13 sources, 8 publishers, top publisher (Epoch AI) 4/13 = 31% |
| ✅ NAME-THROUGHPUT | whole issue | Clean | 5 named actors against a cap of 12 |
| ✅ Primary anchor | whole issue | Clean | Epoch AI (T1), Stanford HAI (T1), Hugging Face (T0). No SINGLE-VIEWPOINT or FALSE BALANCE: the capability gap is stated as measured, and the openness question carries AI Now, Stanford HAI and vendor sources together |
| ⚠️ STORYBOARD-DRIFT | §5, §7 | Medium | Kinds, order, hero and the head match the approved storyboard exactly. The drift is in execution: the storyboard's §5 row expected the lab identity to reach the reader, and its §7 row specified a dollar-led rate card |
| ⚠️ QUESTION-UNANSWERED | storyboard §6 Q3 | High | Panel 2 confirms all three questions are answerable, but scored §5 at 2/5 for three of four personas on exactly the unrendered-labels defect below |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ | |
| All section kinds registered | ✅ | `you-think`, `jargon-buster`, `timeline`, `benchmark-chart`, `version-graph`, `arch-stack`, `number-sense`, `prose` — all in `SECTION_KINDS` |
| No author field | ✅ | |
| publishedAt valid | ✅ | 2026-09-21 |
| Source URLs https:// | ✅ | 13 of 13 |
| Source kinds valid | ✅ | primary / secondary / analysis only |
| ≥8 sources | ✅ | 13 sources, 8 publishers, none above 40% |
| `plain` ≤ 220 chars | ✅ | Longest is §4 at 197 |
| `primer` 80–420 chars | ✅ | 188 |
| `layout` values valid | ✅ | `wide`, `wide`, `split` |
| `skimCaption` on prose only | ✅ | §8 only |
| `sourceRefs` resolve | ✅ | Vacuously — **no section carries any**. Published convention (e.g. kessler) uses them; recommend adding |
| **Build succeeds** | ❌ | `core/NumberSense.astro` throws on §7's numeric `value` |

---

## Required fixes before publish

1. **§7 `data.value` must be an authored string.** `value: 4795` → `value: "₹4,795"`,
   and **delete `unit: "₹"`** — `unit` renders as a trailing mono suffix, so the
   current pair would paint "4795 ₹" even after quoting. The build fails today;
   this is not a style note. Published convention: `value: "300,000"`, `unit: "+"`.
2. **§7 must lead with the dollar.** Contract §3 rule 4 makes the foreign figure
   primary. `$50` currently appears nowhere in the issue. Either make the headline
   `label`/`caption` read "$50 (about ₹4,795)" and mirror the order in both `equals`
   rows, or drop the rupee brackets entirely per the 2026-09-15 per-token rate-card
   clause. The source line's rate and month are already correct — keep them.
3. **§5 must stop promising what it cannot draw.** `VersionGraph.astro` renders no
   lane labels and orders rows by array index. Three fixes, all in the MDX:
   - Put the lab names into text the reader actually meets — the `intro` naming
     Moonshot, DeepSeek and Zhipu explicitly, or a `label` prefix on the first node
     of each lane ("Moonshot · Kimi K2 Thinking"). "Each has its own column below"
     must go unless a label exists.
   - Re-sort `data.nodes` into true date order, or cut "oldest at the top" from
     `plain`. The array is currently grouped by lane, which puts a November 2025
     release below an April 2026 one.
   - Rewrite `plain` to describe only what renders: rows, joining lines, the colour
     grouping. Drop "the column is the lab that made it".
   - Renumber `lane: 4` → `lane: 3` on `gpt55` / `astra`; the gap reserves an empty
     column.
   - Consider that the bold primary string in each legend row is the raw `id`, and
     `label` is hidden below 480px — a phone reader sees `ds-v32`, `k3`, `glm51`.
     Rewrite the ids as human-readable, or accept slugs as the mobile reading.
4. **§4 `plain` states a rationale the dossier contradicts.** Replace "These four
   are the widest and the narrowest, not an average" with the form only ("Each bar
   is the gap between two scores on one test. Longer bar, bigger gap."), and move
   the real selection rationale — *the only four benchmarks where both models have
   a comparable score* — into the `intro` where a data claim belongs.
5. **§8 needs a source line.** It carries 139 projects, 56 countries, 40% Llama,
   83% of downloads and Sarvam AI with no `source` and no `sourceRefs`. CANON §7.
   Add `source: { label: "Rest of World, Hugging Face open-model census", date:
   "September 2026" }` and `sourceRefs: ["src-07", "src-08", "src-09"]`.
6. **§8's 83% must carry its qualifiers.** "83% of all downloads ever go to the
   smallest models on offer" → the dossier says *among models that declare a
   parameter count*, *under one billion parameters*. Write the threshold: "83% of
   downloads go to models under a billion parameters — the smallest on offer."
7. **§3's title contradicts its own timeline.** "The gap shrank, then stopped" —
   the events show 3 months widening to 4, and the key event's note says so
   outright. Retitle to the finding: "Three months behind, then four."
8. **§6's caption overstates its own layer.** "not downloadable at any price" vs
   the slab's "not downloadable at any licence". Compute is the one thing price
   *does* buy, which is the section's argument. Use "at any licence" in both.

---

## Optional improvements

- **The hook's "Almost nobody has" is doing more work than the dossier supports.**
  The traced finding is that no state-backed AI programme picked an open-frontier
  model — not that the weights go undownloaded. "Almost no government has" would
  be exact and lose nothing.
- **§5's caption should say whose newest.** "the newest landed in July" is true of
  the open releases; GPT-6 Astra (3 September) sits in the same graphic. "The
  newest open release landed in July" fixes it in one word.
- **§8's textbook analogy argues the wrong mechanism.** A free textbook on a shelf
  in another building is about distance. The finding is about cost — a free
  textbook that needs a ₹50,000 desk to read it on would carry the paragraph's own
  next sentence.
- **Add `sourceRefs[]` throughout.** No section carries any. The published backlist
  uses them, and they are what makes the source rail per-section rather than
  per-issue.
- **Add an FX row to `research/_sources/tech.md`.** `src-13` (Federal Reserve H.10)
  is off-allowlist today, and every tech issue that converts a current price will
  hit the same wall. The source itself is unimpeachable; the allowlist is the
  thing that is behind.
- **§5 would earn a `howToRead`.** It is the issue's one counter-intuitive form —
  a lineage graph whose columns mean something and whose rows do not carry dates.
  It is not in `NEEDS_HOW`, so nothing renders unless authored.
- **§2's "token" gloss arrives four sections late.** §7's intro explains it well;
  move that clause to the jargon-buster, or add a fourth term.
