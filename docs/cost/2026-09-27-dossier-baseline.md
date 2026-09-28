# Researcher dossier quality baseline — Claude Opus 5

**Purpose.** Establish a measured quality bar from the dossiers the current researcher
(Claude Opus 5) has actually produced, so a future cheaper researcher model can be
graded against numbers instead of impressions. Everything below labelled a number is
counted directly from the files in `research/` — line/byte counts via `wc`, structural
counts via a Node script reading each dossier's markdown, cross-checked by hand against
the raw text wherever the script's output looked surprising. Where I judged something
rather than counted it, it says so. Nothing here is estimated.

**Read first — a correction to the brief.** The brief describes the Phase 4/6 group as
dossiers "written 2026-09-13 to 09-15." That is not what the files show. On those dates
the pipeline re-ran **storyboard → draft → panel → stylist → panel → verify** against
dossiers that already existed from **May–June 2026** (the actual research did not
re-run). Two of the ten Phase 4/6 slugs — **delimitation** and **kessler-cascade** — have
**no dossier at all**: both predate the pipeline (published 2026-04-24) and the rewrite
storyboards say so explicitly (`- **Dossier:** none — this is a Phase 4 **rewrite** of a
published issue that predates the pipeline`), working instead from the published MDX's
`sources[]` block. So the "earlier group" below is **eight actual dossiers**, dated
2026-05-02 to 2026-06-04, plus two issues with no dossier to measure at all (reported
separately, downstream-only). This changes what the comparison can show: it is not
"same researcher, same month, different dossiers" — it is the researcher's **May/June**
output against its **September** output, which is exactly the before/after the pipeline's
own changelog describes (component-catalog wiring landed 2026-07-14; the diversity
floors, the `Spread:` line, per-source `tier`/`viewpoint` tags, and the storyboard's §9
kind ledger all landed 2026-09-16). Every one of the eight earlier dossiers predates all
four of those additions. That is confirmed structurally below, not assumed.

---

## 0. Inventory

| Group | Category | Slug | Dossier date |
|---|---|---|---|
| September six | earth | indonesia-fire-burns-soil-not-trees | 2026-09-17 |
| September six | space | iss-retirement-set-by-contract | 2026-09-17 |
| September six | travel | half-indias-arrivals-are-indians | 2026-09-17 |
| September six | tech | open-models-four-months-behind | 2026-09-17 |
| September six | sports | premier-league-squad-cost-ratio | 2026-09-17 |
| September six | politics | eleven-bills-fifteen-percent | 2026-09-17 |
| Earlier (has dossier) | earth | el-nino-new-floor | 2026-05-03 |
| Earlier (has dossier) | sports | arsenal-set-piece-title | 2026-06-04 |
| Earlier (has dossier) | travel | queue-is-the-product | 2026-06-04 |
| Earlier (has dossier) | politics | transgender-ratchet | 2026-05-02 |
| Earlier (has dossier) | tech | ai-coding-token-bill | 2026-06-04 |
| Earlier (has dossier) | earth | amazon-tipping-point | 2026-06-04 |
| Earlier (has dossier) | space | asteroid-2024-yr4 | 2026-06-04 |
| Earlier (has dossier) | politics | cockroach-janta-party | 2026-06-04 |
| No dossier exists | politics | delimitation | — (pre-pipeline, published 2026-04-24) |
| No dossier exists | space | kessler-cascade | — (pre-pipeline, published 2026-04-24) |

Model check (item 8 of the brief): `research/_costs/ledger.jsonl` has a `phase:"research"`
row with `model:"claude-opus-5"` for **all six** September slugs (costs $5.85–$10.24,
45–56k output tokens, 10–17 web searches each). **The ledger has no rows at all for the
eight earlier dossiers** — it starts 2026-09-16 (confirmed: first line in the file is a
2026-09-16 discovery run), and the earlier dossiers were written in May/June, so there is
no ledger entry to check. I cannot confirm their model from the ledger; I can say the
dossier template, section numbering and prose voice are consistent with the same
researcher-agent prompt lineage the AGENTS.md changelog attributes to Opus throughout
2026, but that is an inference from house style, not a measurement.

---

## 1. Per-dossier metrics — September six

| Metric | earth | space | travel | tech | sports | politics |
|---|---|---|---|---|---|---|
| Lines (`wc -l`) | 532 | 522 | 480 | 706 | 637 | 613 |
| Bytes (`wc -c`) | 35,899 | 45,608 | 35,890 | 52,510 | 47,270 | 46,570 |
| §4 table data-rows (excl. header/separator) | 31 | 9 | 32 | 41 | 32 | 17 |
| Drawn-graphic kinds named beside captured data in §4 | 5 (see note) | 4 | 5 (see note) | 3 strict / 4 functional (see note) | 4 | 4 (see note) |
| `[UNVERIFIED]` markers (whole doc) | 2 | 3 | 15 | 6 | 2 | 2 |
| Discrepancy-family mentions (discrepan\|disagree\|conflict\|differ) | 6 | 0 | 2 | 1 | 4 unique | 2 |
| §5 verbatim quotes | 2 | 9 | 4 | 17 | 5 | 10 |
| — of which traceable to a URL | 2/2 | 9/9 | 4/4 | 17/17 | 5/5 | 10/10 (7 direct + 3 explicit "same source" back-reference) |
| §1 filled? | yes | yes | yes | yes | yes | yes |
| §1 word count | 287 | 245 | 202 | 347 | 263 | 240 |
| §8 sources (my count) | 20 | 20 | 11 | 19 | 25 (researcher states 24 — see note) | 16 |
| §8 distinct publisher domains (my count) | 8 | 9 | 8 | 9 | 12 | 9 |
| §8 top-domain share (my count) | 30.0% (mongabay) | 30.0% (nasa.gov) | 27.3% (skift) | 31.6% (epoch.ai) | 36.0% (swissramble) | 37.5% (prsindia) |
| §8 "Spread:" line, verbatim | see below | see below | see below | see below | see below | see below |

**§8 Spread lines, verbatim:**
- earth: *"Spread: 20 sources · 7 publishers · tiers T0, T1, T2, T3, T4 (5 tiers) · top publisher 30% (Mongabay, 6 of 20)"*
- space: *"Spread: 20 sources · 8 publishers · tiers T0/T3/T4/T5/T6/T7 · top publisher 35%"*
- travel: *"Spread: 11 sources · 7 publishers · tiers T0, T1, T4 · top publisher 27.3%"*
- tech: *"Spread: 19 sources · 9 publishers · tiers T0 · T1 · T2 · T3 · T4 · T7 (6 tiers) · top publisher 32% (Epoch AI, 6 of 19)"*
- sports: *"Spread: 24 sources · 12 publishers · tiers T0 / T3 / T4 / T6 / T7 (5 tiers) · top publisher 37.5% (The Swiss Ramble, 9 of 24)"*
- politics: *"Spread: 16 sources · 9 publishers · tiers T0/T1/T2/T3/T4 (5 tiers) · top publisher 37.5% (PRS, 6 of 16)"*

All six state and pass the 2026-09-16 floor (≥8 sources · ≥5 publishers · ≥3 tiers · no
publisher >40%). My independent domain-level count agrees with the researcher's
self-reported publisher count in 5 of 6 cases; the small gaps are explainable, not
errors — e.g. space groups `nasa.gov` + `orbitaldebris.jsc.nasa.gov` as one "NASA"
publisher but counts `oig.nasa.gov` (NASA's Office of Inspector General, an
organizationally independent oversight body) separately, which reconciles their 8 to my
9 domains exactly.

**Notes on "drawn-graphic kinds named beside captured data":**
- **earth** names 5 (`core-sample`, `region-map`, `benchmark-chart`, `power-flow`,
  `carbon-loop`), but the dossier itself flags the 5th, `carbon-loop`, as a **DATA GAP**
  and recommends against authoring it ("Do not author `carbon-loop` with an invented
  return flux"). Net usable: 4.
- **tech** is the one dossier where the count is genuinely borderline. Only 3 kinds get
  a dedicated `### 4.X — DATA for \`kind\`` heading (`benchmark-chart`, `version-graph`,
  `arch-stack`). The 4th drawn graphic in the final plan, `scaling-plot`, is the
  already-published hero — its data table lives under the `version-graph` heading
  (§4.6) rather than getting its own, because the two kinds plot the same 18 sourced
  tuples two different ways. So the issue still gets 4 drawn graphics with real data,
  but only 3 of the 4 are announced with a "name the kind beside the block" heading in
  §4 the way the other five dossiers do it.
- **politics** does not use per-kind sub-headings at all; it uses a single "§4.5
  Component data capture" section with lettered items (A)–(D) naming and fully
  capturing `bill-funnel`, `margin-bullets`, `benchmark-chart`, `bill-passage` — plus a
  5th lettered item (E) that names and gives sourcing reasons for **four more** rejected
  kinds (`approval-chart`, `attrition-waffle`, `power-flow`, `state-timeline`). This is
  the most thorough of the six on this metric even though a naive heading-grep misses
  it entirely (a real miss in my first automated pass, corrected by reading the file).
- **travel** names 5 (`approval-chart`, `attrition-waffle`, `region-map`,
  `benchmark-chart`, `margin-bullets`); the composer's final spine used only 4 of the 5
  (dropped `approval-chart` after finding the component itself can't render the data
  shape — see §4 below — and dropped `margin-bullets` for a catalog DON'T-USE match).
  This is normal: the dossier is supplying options with data attached, not dictating the
  final spine.
- **sports** names exactly 4 (`power-flow`, `channel-ternary`, `benchmark-chart`,
  `scaling-plot`), matching the floor with no slack either way.
- **space** names exactly 4 (`descent-profile`, `orbit-trace`, `elevation-profile`,
  `benchmark-chart`); the final storyboard used `descent-profile`, `timeline`,
  `benchmark-chart`, `orbit-trace` — i.e. `elevation-profile`'s captured data went
  unused in favour of `timeline`, again a normal composer choice, not a defect.

**Note on sports' source count (25 vs 24):** the dossier's own Spread line says 24; my
row-count of the bibliography list gives 25. The likely reconciliation is one row the
researcher does not count toward the citable total — the LawInSport entry is explicitly
annotated *"403 on fetch, not read... **cite nothing from it**"*, which is the most
likely candidate for the one-row difference. This is a minor bookkeeping slip in the
self-reported line, not a sourcing problem (the underlying list is still fully
transparent about what was and wasn't usable).

---

## 2. Per-dossier metrics — earlier group (8 with an actual dossier)

| Metric | earth (el-niño) | sports (arsenal) | travel (queue) | politics (transgender) | tech (token bill) | earth (amazon) | space (asteroid) | politics (cockroach) |
|---|---|---|---|---|---|---|---|---|
| Dossier date | 05-03 | 06-04 | 06-04 | 05-02 | 06-04 | 06-04 | 06-04 | 06-04 |
| Lines | 256 | 462 | 480 | 203 | 369 | 426 | 297 | 401 |
| Bytes | 32,856 | 35,720 | 41,186 | 36,870 | 30,287 | 32,977 | 33,453 | 43,377 |
| §4 table data-rows | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Drawn-graphic kinds named beside captured data | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `[UNVERIFIED]`-family markers | 2 | 20 (see note) | 10 | 4 | 7 | 4 | 8 | 1 |
| Discrepancy-family mentions | 1 | 2 unique | 2 | 1 | 0 | 6 | 1 (explicitly "Not a discrepancy") | 3 |
| §5 verbatim quotes | 6 | 4 usable + 1 flagged do-not-use | 5 | 9 | 9 | 5 | 7 | 8 |
| — traceable to a URL | 6/6 | 4/4 usable (5th explicitly marked `[UNVERIFIED – allowlist]`, do-not-use) | 5/5 | 9/9 | 9/9 | 5/5 | 7/7 | 8/8 |
| §1 filled? | yes | yes | yes | yes | yes | yes | yes | yes |
| §1 word count | 236 | 278 | 270 | 236 | 257 | 231 | 256 | 454 (see note) |
| §8 sources (my count) | 20 | 16 | 19 | 26 | 11 | 10 | 12 | 16 |
| §8 distinct publisher domains (my count) | 5 | 9 | 11 | 3 | 2 | 3 | 4 | 2 |
| §8 top-domain share (my count) | 55.0% (carbonbrief.org) | 18.8% (statsbomb) | 26.3% (natgeo) | 42.3% (theprint.in) | 90.9% (simonwillison.net) | 60.0% (mongabay) | 66.7% (nasa.gov) | 50.0% (thewire.in) |
| §8 "Spread:" line | none (convention didn't exist yet) | none | none | none | none | none | none | none |
| Per-source `tier:`/`viewpoint:` tags | none (0 occurrences) | none | none | none | none | none | none | none |
| "Indian ground" section | absent | absent | absent | absent | absent | absent | absent | absent |

**Note on arsenal's 20 `[UNVERIFIED]`-family markers:** these are not the same thing as
the September dossiers' `[UNVERIFIED]`. Arsenal defines its own two-tier convention up
front: **`(AL)`** = allowlist-anchored, and **`` `[UNVERIFIED – allowlist]` ``** = *"cross-
checked across multiple independent sources and treated as factually reliable, but the
only sources are off-allowlist."* Most of arsenal's 20 are the second tag on facts the
researcher is confident in but can't yet anchor to an allowlisted domain — a stricter,
more conservative disclosure practice, not 20 unresolved gaps. Counting it alongside the
September dossiers' plain `[UNVERIFIED]` without this context would be unfair to arsenal.

**Note on cockroach's §1 word count (454):** roughly 300 of the 454 words are the single
required structural-argument paragraph; the rest is an appended blockquoted "**Drafter
framing note**" instructing the drafter not to sensationalise the material (no
genocide-rhetoric comparisons, keep the epithet to one attributed quote). That's good
editorial judgment, but it is additional content the template's "one paragraph" framing
didn't anticipate, and it's why this cell is nearly double every other dossier's.

**delimitation and kessler-cascade (no dossier — reported for completeness, not counted
into the medians below):** both storyboards state plainly *"Dossier: none... The factual
record is `src/content/issues/<slug>/index.mdx` and its `sources[]` block."* There is
nothing here to measure against the brief's dossier metrics 1–6 and 8.

---

## 3. Structural differences confirmed between the two groups

These are not scored metrics from the brief, but they fell out of the file dates and are
worth recording because they explain *why* several numbers above differ so sharply — the
difference is dated pipeline capability, not researcher inconsistency:

| Feature | September six | Earlier eight | When it was added |
|---|---|---|---|
| `Spread: N sources · M publishers · tiers...` line in §8 | 6/6 | 0/8 | 2026-09-16 (dossier template note: "floors, added 2026-09-16") |
| Per-source `` `tier:` ``/`` `viewpoint:` `` tags | 6/6 | 0/8 | 2026-09-16 |
| Explicit "Indian ground" §4 subsection | 6/6 | 0/8 | REGISTER-PLAN, 2026-09-13 |
| Named drawn-graphic kind beside a captured-data block in §4 | 6/6 (3–5 each) | 0/8 | Component-catalog wiring, 2026-07-14; sharpened 2026-09-16 |
| Storyboard §9 "Kind ledger" (drawn-graphic %, new-kind count) | 6/6 | 0/10 rewrite storyboards | 2026-09-16 |

---

## 4. Downstream outcomes — September six

### 4a. Verification reports (`*-verification.md`, all dated 2026-09-22)

| | earth | space | travel | tech | sports | politics |
|---|---|---|---|---|---|---|
| Verdict | BLOCKED | NEEDS REVISION | BLOCKED | BLOCKED | BLOCKED | BLOCKED |
| ✅ | 92 | 45 | 54 | 59 | 71 | 82 |
| ⚠️ | 32 | 28 | 15 | 24 | 39 | 15 |
| ❌ | 6 | 4 | 4 | 9 | 15 | 6 |
| ❌ traced back to the **dossier** itself (vs. drafter/stylist) | 0 of 6 (1 wording imprecision noted, see below) | 0 of 4 | **1 of 4** | 0 of 9 | 0 of 15 | **1 of 6** |

I read every verification report's prose (not just the ✅/⚠️/❌ table rows) looking for
the words "dossier" beside "wrong"/"error"/"conflict"/"itself". Two genuine
**dossier-caused** errors surfaced downstream, both arithmetic:

- **travel**, verification line 76: *`"which means about 38 paise each"` | §6 ¶4 | ❌
  ARITHMETIC | **₹3,50,00,000 ÷ 9,150,000 = ₹3.83.** Wrong by 10×. Traces to dossier §4h
  ("Researcher's division"), which is itself wrong. Both must be corrected.*
- **politics**, verification line 116: *`"Question Hour falls furthest."` | caption | ❌
  CONTRADICTED | `MarginBullets.astro:140` computes `(required − value)/required`... The
  worst relative shortfall is **row 3, committee scrutiny**... Dossier §4.5(B) and
  storyboard §3 row 4 both assert Question Hour; **both are wrong**, and the draft
  inherited the error.*

A third, non-blocking wording slip in **earth**: the dossier states Indonesia's fossil
emissions are "a fifth of India's" (§1, §4c); 812/3,190 = 25.5%, which is a quarter, not
a fifth. The verifier caught it, noted *"Dossier defect for the next earth run, not this
draft... Fix the dossier line"*, and confirmed the **draft itself** sidestepped it with
softer wording ("a fraction") so nothing published is wrong — but the dossier still
carries the error for the next researcher who reads it.

So: **3 of 6 September dossiers (50%) carried at least one traceable factual/arithmetic
error that reached the verification stage** — 2 that blocked a caption, 1 that the
drafter happened to phrase around. **Zero of the 15 ❌ in space, tech and sports traced to
the dossier** — all drafter/stylist-introduced (overreaching phrasing, unauthored `plain`
lines, uncredited component defaults, etc.).

### 4b. Storyboards — drawn-graphic share and composer notes on data gaps

| | earth | space | travel | tech | sports | politics |
|---|---|---|---|---|---|---|
| Drawn graphics / total rows | 5 / 9 (56%) | 4 / 8 (50%) | 4 / 9 (44%) | 4 / 8 (50%) | 5 / 9 (56%) | 5 / 9 (56%) |
| Distinct graphic kinds | 5 | 4 | 4 | 4 | ≥4 | ≥4 |
| New-to-publication kinds | 3 | 2 | 2 | 2 | 2 | 2 |

All six clear the 40% drawn-graphic floor and the ≥3-distinct/≥2-new floors with no
exceptions.

Composer notes explicitly naming a kind the dossier's data could not support (quoted
verbatim, one per issue):

- **earth**: *"`carbon-loop` — Third time on the earth desk, same blocker. DATA needs ≥3
  reservoirs with sourced stocks and ≥4 fluxes. The dossier has one reservoir (peat, 28
  GtC) and two one-way fluxes. The return flux — the rate peat accumulates — exists only
  off-allowlist."* The same note adds a cross-issue tally: *"el-niño and amazon both
  rejected `region-map` for want of per-zone values; amazon rejected `core-sample` and
  `elevation-profile` on shape; cockroach and transgender-ratchet rejected `power-flow`
  for want of a value per link."*
- **space**: *"R4 — An Indian distance comparison for the 2,000 km debris footprint. The
  one place the issue would benefit from a fact the dossier does not carry. A composer
  does not add sources."*
- **travel**: a different failure mode — the dossier's proposed hero kind
  (`approval-chart`) had the data, but the composer read the component source and found
  it **cannot render it**: *"`ApprovalChart.astro` clamps its y-scale to 0–100 as a
  percentage with hardcoded gridlines... Values of 9.15 and 11.07 would compress into
  the bottom 11% of the plot and never visibly cross — the exact thing the section
  exists to show."* Substituted with `timeline`.
- **tech**: *"`neural-flow` — Needs real per-layer unit counts. K3 publishes 2.8T
  parameters and MoE routing, not per-layer sizes. Cannot be sourced; inventing them is
  forbidden."*
- **sports**: *"`league-table` — Never published, and a wages-against-points chart would
  be the strongest possible version of row 5 [but] the 2024/25 final table renders
  client-side on premierleague.com and could not be retrieved."*
- **politics**: *"`power-flow` — The ideal hero... PRS published only percentages for
  this session, not hours. The kind needs a value on every band."*

### 4c. Reader panel verdicts

| | earth | space | travel | tech | sports | politics |
|---|---|---|---|---|---|---|
| Panel pass 1 | REVISE | REVISE | REVISE | REVISE | REVISE | REVISE |
| Panel pass 2 (post-stylist) | PASS | REVISE | PASS | PASS | REVISE | REVISE |

**All six** got REVISE on the first pass — no dossier/draft combination this round
reached a first-pass PASS. Three of six (earth, travel, tech) cleared on the second
pass; space, sports and politics did not.

---

## 5. Downstream outcomes — earlier group (using the Sept 2026-09-13/14/15 **re-verification**, i.e. current published state)

| | el-niño | arsenal | queue | delimitation* | cockroach | transgender | token-bill | amazon | asteroid | kessler* |
|---|---|---|---|---|---|---|---|---|---|---|
| Verdict | BLOCKED | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION | NEEDS REVISION |
| ✅ | 87 | 92 | 126 | 94 | 90 | 82 | 129 | 96 | 95 | 85 |
| ⚠️ | 30 | 16 | 33 | 22 | 29 | 38 | 27 | 24 | 11 | 17 |
| ❌ | 10 | 2 | 6 | 5 | 8 | 6 | 4 | 3 | 2 | 4 |
| Panel pass 1 | REVISE | REVISE | REVISE | REVISE ("one step from PASS") | REVISE | REVISE | REVISE | REVISE | REVISE | REVISE |
| Panel pass 2 | *(none run — Phase 4 predates the 2nd-panel step)* | *(none)* | *(none)* | *(none)* | PASS | PASS | PASS | PASS | PASS | PASS |

\* delimitation and kessler-cascade have no dossier; figures are the issue's own
verification/panel outcome, shown for completeness only.

**Every one of the sixteen dossier-or-no-dossier issues in this whole exercise — all six
September and all ten earlier — got REVISE on its first reader-panel pass, and none
reached verifier PASS on the first verification run.** A clean first-pass PASS has not
happened yet anywhere in the measured corpus, under either researcher-era dossier. That
is useful context for calibrating a bar: "verifier PASS on the first pass" would fail
100% of Opus's own measured output too.

I did not find a storyboard §9 kind ledger to quote composer "wanted but lacking data"
notes from for this group — the ten Phase 4/6 rewrite storyboards (dated 09-13/14/15)
predate that section (added 2026-09-16), confirmed by grepping their `## ` headers,
which stop at "§8 Composer notes" in every one I checked (kessler-cascade, amazon
verified directly). Where a rewrite storyboard *does* discuss a rejected kind (these are
migration-mapping documents, not fresh composition against a dossier), the shape of the
note is different in kind — e.g. amazon-tipping-point's rewrite storyboard: *"`region-map`
— No per-zone values, and this was already settled before publication: dossier §9.4
records that by-country and by-state clearing shares exist only off-allowlist."*

---

## 6. Summary statistics

All medians below are computed on the exact per-file numbers in §1/§2 (n=6 for
September, n=8 for the earlier group — delimitation and kessler-cascade excluded from
the earlier-group statistics since they have no dossier to measure).

| Metric | September six: median (range) | Earlier eight: median (range) |
|---|---|---|
| Lines | 572.5 (480–706) | 385 (203–480) |
| Bytes | 46,089 (35,890–52,510) | 34,587 (30,287–43,377) |
| §4 table data-rows | 31.5 (9–41) | 0 (0–3) |
| Drawn-graphic kinds named w/ data in §4 | 4 (3–5) | 0 (0–0) |
| `[UNVERIFIED]`-family markers | 2.5 (2–15) | 4 (1–20, but see arsenal caveat above) |
| Discrepancy-family mentions | 2 (0–6) | 1.5 (0–6) |
| §5 verbatim quotes | 7 (2–17) | 6.5 (4–9) |
| Quotes traceable to a URL | 100% in every dossier (both groups) | 100% in 7 of 8 (arsenal flags its one unsourced quote as explicitly do-not-use) |
| §1 word count | 254 (202–347) | 256.5 (231–454, cockroach an outlier — see note) |
| §8 source count (my count) | 19.5 (11–25) | 16 (10–26) |
| §8 distinct publisher domains (my count) | 9 (8–12) | 3.5 (2–11) |
| §8 top-publisher share (my count) | 30.8% (27.3–37.5%) | 52.5% (18.8–90.9%) |
| Issues clearing "≥5 publishers, no publisher >40%" | 6 of 6 | 3 of 8 (el-niño, arsenal, queue) — 5 of 8 fail on at least one axis |
| Verification ❌ traced to the dossier itself | 3 of 6 issues have ≥1 (2 blocking, 1 non-blocking) | not systematically checked past the two confirmed cases pattern-matched in §4a; not re-run for all 8 given scope, see caveat below |

**Caveat on the last row:** for the earlier group I did not re-read all 8 re-verification
reports end-to-end hunting for dossier-attributed errors the way I did for the September
six (the brief's primary target is the September dossiers; the earlier group is
explicitly "a second group" for comparison). The ❌ counts in §5 are real and measured;
whether each one traces to the dossier, the 2026-09-13/14/15 draft rewrite, or the
stylist has not been individually attributed for this group. Treat the September group's
"3 of 6" dossier-attribution figure as the reliable one.

---

## 7. Proposed acceptance bar for a cheaper researcher

**Everything above this line is measured. Everything below is a proposal — a judgment
call informed by the numbers, not itself a measurement.** I've set each threshold at or
slightly below what Opus 5 actually cleared across the six September dossiers (its
current, post-2026-09-16 practice), rather than at an idealised value, because several
idealised values (e.g. "0 verifier ❌") were not met by Opus 5 itself anywhere in the
sixteen-issue corpus.

| Check | Proposed floor | Grounded in |
|---|---|---|
| Sources | ≥ 8 | The existing 2026-09-16 floor; every September dossier cleared it at 11–25 |
| Distinct publisher domains | ≥ 5 | Existing floor; September range was 8–12. The earlier group shows what falls below this is real: 5 of 8 pre-floor dossiers failed it |
| Top-publisher share | ≤ 40% | Existing floor; September range 27–37.5%, all comfortably inside it |
| Source tiers represented | ≥ 3 | Existing floor; September range 3–6 |
| Drawn-graphic kinds named beside captured data in §4 | ≥ 4, OR ≥ 3 with an explicit note that a 4th kind's data is folded into another's table | Five of six September dossiers hit exactly 4–5; tech hit 3-with-a-reason. Set the bar at 4 but don't fail a dossier that explains a legitimate 3, the way tech's does |
| `[UNVERIFIED]` markers | ≤ 15, with each one naming a specific fallback or resolution path (not a bare flag) | September range was 2–15 (travel's 15 is the ceiling, and every one of them proposes a resolution, e.g. "use FireWatch throughout" or "if the verifier will not accept them, drop the markers"). A bare `[UNVERIFIED]` with no proposed handling is what should fail, not the count itself |
| §1 structural argument | present, 200–350 words, one paragraph (a second block, e.g. an editorial framing note, is fine but should not be counted against the word cap) | September range 202–347; cockroach's 454-word outlier shows why a second block needs to be exempted rather than banned |
| §5 quotes | ≥ 2, 100% traceable to a URL either directly or via an explicit "same interview/source" back-reference to an immediately preceding sourced quote | Both groups hit 100% traceability; the floor of 2 is set at the September minimum (earth) |
| Explicit "Indian ground" subsection in §4 | present | 6 of 6 September dossiers have one; 0 of 8 earlier dossiers do — this is the register contract's own requirement (REGISTER-PLAN, 2026-09-13), not new to this proposal |
| Per-source `tier:`/`viewpoint:` tagging in §8 | present on every source row | 6 of 6 September dossiers do this; it is what makes the Spread line and the diversity floor checkable at all |
| Downstream: dossier-attributed verifier ❌ | ≤ 1 per issue, not 0 | Opus 5 itself produced exactly 1 dossier-attributed ❌ in 3 of 6 September issues and 0 in the other 3 — never more than 1, but "0 always" is not what the current researcher actually achieves. A cheaper model held to a stricter bar than Opus 5 clears would be measuring the wrong thing |
| Downstream: reader-panel pass-1 verdict | REVISE is acceptable; BLOCK is not | 16 of 16 measured issues (both groups, all ten categories) got REVISE on pass 1. Expecting PASS on pass 1 fails the entire existing corpus |
| Downstream: composer notes citing the dossier for a genuine data gap | expected to appear (0 is not obviously better) | Every September storyboard has at least one such note; this is the pipeline working as designed (the composer catching what the dossier couldn't get), not a defect to eliminate |

**One number I would not carry over as a bar:** total verifier ❌ count (as opposed to
dossier-attributed ❌). It ranged 4–15 in the September group and 2–10 in the earlier
group, but the large majority in every single issue is drafter/stylist-introduced, not
researcher-introduced — holding a *researcher* model to the *whole issue's* ❌ count
would be scoring it on other agents' mistakes.

---

## Files consulted

Dossiers (September): `research/{earth,space,travel,tech,sports,politics}/2026-09-17-*-dossier.md`
Dossiers (earlier): `research/{earth,sports,travel,politics,tech}/{2026-05-02,2026-05-03,2026-06-04}-*-dossier.md`
Verification: matching `*-verification.md` in each category (2026-09-22 for the September six; 2026-09-13/14/15 for the earlier group's re-verification)
Storyboards: matching `*-storyboard.md` (2026-09-21 for the September six; 2026-09-13/14/15 for the earlier group)
Panels: matching `*-panel.md` / `*-panel-2.md`
Cost ledger: `research/_costs/ledger.jsonl`
Template: `research/_templates/dossier.md`
Scratch scripts (not part of the deliverable): `measure.mjs`, `quotecheck.mjs`, `toppub.mjs` in this scratchpad directory
