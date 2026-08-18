# Collision adjudication

Five of the 28 new kinds sit next to something you already have. The decision
was **register alongside, document the difference in both directions** — so each
pair below gives the new kind's `DON'T USE` line *and* the edit to make to the
existing kind's catalog block, so a drafter reading either one is routed
correctly.

Two of the five are flagged **⚠ merge candidate**: defensible as separate kinds,
but if you would rather hold the library at 116 than 118, these are the two to
collapse. Recommendation is to keep them separate on the first pass and revisit
after the first real issue uses one.

---

## 1. `porkchop-grid` vs `transfer-window` — clean split

| | `transfer-window` (exists) | `porkchop-grid` (new) |
|---|---|---|
| Form | two orbit rings + transfer arc + phase scrubber | departure × arrival matrix, colour-banded |
| Question | *what does this one transfer cost, and when is the window?* | *across every date pairing, where is it affordable at all?* |
| Cardinality | one transfer | ~140 pairings |

**New kind's DON'T USE:** "one specific transfer's geometry and window timing
(→ `transfer-window`); a pure Δv budget with no date dimension
(→ `delta-v-ladder`)."

**Edit to `transfer-window`'s DON'T USE — append:** "the whole grid of
departure/arrival pairings and their costs (→ `porkchop-grid`)."

---

## 2. `fare-spread` vs `fare-terrain` — clean split, different x-axis

Your catalog already draws this line for `climate-calendar`: *"that's
month-of-year, this is days-before-departure."* `fare-spread` is the
month-of-year case, and adds the distribution `fare-terrain` has no room for.

| | `fare-terrain` (exists) | `fare-spread` (new) |
|---|---|---|
| x-axis | days before departure | month of year |
| y | median fare, one ridge per route | full range + IQR + median per month |
| Argument | when to book | which month is a lottery |

**New kind's DON'T USE:** "fare against days-before-departure — the when-to-book
story (→ `fare-terrain`); a trip's cost split by category (→ `data-readout`)."

**Edit to `fare-terrain`'s DON'T USE — append:** "per-month fare *distribution*
where the spread is the argument (→ `fare-spread`)."

---

## 3. `latency-ridge` vs `pace-ridge` — ⚠ merge candidate

Same form: stacked KDE ridgelines. `pace-ridge` is already declared
world-agnostic ("a measurable quantity with a SAMPLE for the subject AND ≥1
comparison group"), so a tech latency chart is arguably just `pace-ridge` with
tech tokens.

What genuinely differs, and why it is worth its own kind:

- **Groups are time-ordered releases, not peer groups.** Newest at top, and the
  reading is a history rather than a comparison.
- **A named threshold is first-class.** The 500 ms line, the shaded tail beyond
  it, and each release's *percentage over threshold* are part of the component,
  not the caption. `pace-ridge` has no threshold concept.
- **The argument is median-vs-tail divergence** — the median improving while the
  tail worsens. That needs both numbers in the readout.

**If you merge instead:** extend `pace-ridge` with optional
`threshold: {at, label}` + `ordered: 'time'` and drop `latency-ridge`. That
blueprint's §3 and §6 transfer unchanged.

**New kind's DON'T USE:** "peer groups compared for distribution shape with no
threshold (→ `pace-ridge`); one request's span breakdown
(→ `latency-waterfall`); throughput as a single rate (→ `throughput-dial`)."

**Edit to `pace-ridge`'s DON'T USE — append:** "release-over-release latency
where a threshold and its tail percentage are the argument
(→ `latency-ridge`, tech)."

---

## 4. `rain-calendar` vs `climate-calendar` — clean split, different granularity

| | `climate-calendar` (exists) | `rain-calendar` (new) |
|---|---|---|
| Cells | 12 months | 365 days in 12 rows |
| World | travel | earth |
| Argument | when to go | a total hides its concentration — 1% of days carry 40% of the rain |

Twelve cells cannot show concentration; that is the whole point of the new kind.

**New kind's DON'T USE:** "monthly values for a when-to-go decision
(→ `climate-calendar`, travel); multi-decade annual records
(→ `climate-strip` / `climate-spiral`)."

**Edit to `climate-calendar`'s DON'T USE — append:** "daily values where the
concentration of extremes is the argument (→ `rain-calendar`, earth)."

---

## 5. `majority-flow` vs `power-flow` / `vote-flow` / `coalition-calculus` — ⚠ merge candidate

The most crowded neighbourhood in the library. Honest statement of the overlap:
`majority-flow` is **`power-flow`'s form carrying `coalition-calculus`'s
question**. A three-layer Sankey with reconciled totals is exactly
`power-flow`'s schema with `unit: 'seats'`.

What justifies it as its own kind:

- **A threshold line across the sink layer.** `power-flow` has no concept of a
  line a flow must clear.
- **The counterfactual is the payload.** Selecting a source group answers "if
  this partner walked out, does the bloc still legislate?" — that is
  `coalition-calculus`'s question, answered on the flow rather than on a single
  bar, so the reader sees *which* seats leave and from where.
- **Three fixed layers with fixed semantics** (group → bloc → outcome), where
  `power-flow` is an arbitrary DAG.

**If you merge instead:** the cheaper move is to give `coalition-calculus` an
optional Sankey presentation rather than to generalise `power-flow` — the
question, the threshold and the aria-live verdict are already there.

**New kind's DON'T USE:** "money or authority moving between institutions
(→ `power-flow`); one division's blocs splitting for/against/abstain
(→ `vote-flow`); coalition arithmetic played out on a single bar
(→ `coalition-calculus`); the chamber as a portrait (→ `chamber`)."

**Edits to the three existing blocks — append to each DON'T USE:**
- `power-flow`: "seats flowing group → bloc → passes/fails against a majority line (→ `majority-flow`)."
- `vote-flow`: "the standing composition's route to a majority rather than one division (→ `majority-flow`)."
- `coalition-calculus`: "the same arithmetic shown as a flow, where which seats leave matters (→ `majority-flow`)."
