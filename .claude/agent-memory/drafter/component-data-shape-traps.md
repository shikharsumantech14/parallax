---
name: component-data-shape-traps
description: Section-kind DATA shapes whose catalog line does not match what the component actually reads, and the single-slot fields that force an editorial choice
metadata:
  type: project
---

Traps found while filling real dossier data into section kinds. Each cost a
re-check of the component or the dispatcher.

**Why:** `docs/design/catalog.md`'s `DATA:` line is a summary; the component
and `SectionBody.astro` are the contract. Authoring to the catalog alone
produces a field that silently does not render.

**How to apply — check these before authoring:**

- **`data-readout` uses `emphasis: "key" | "warn"`, not the catalog's
  `accent: true`.** And its `data.caption` is the *grid header*
  ("ARSENAL · 2025/26 PREMIER LEAGUE"), not the data claim. A section-level
  `caption` on this kind is invisible — `SectionBody` passes `data.caption`,
  and `data.caption` wins over the promoted one. Author one or the other,
  never both.
- **`number-sense` renders its single `note` ABOVE the `equals` list**, inside
  `.px-ns__num` with the label and the value, so a note written as a follow-on
  ("That pay is around …") points at something the reader has not read yet.
  Write the note so it stands alone and let the `equals[].note` carry the
  dependent clause. When a caveat and a currency bracket have to travel with
  the same figure (an outside pay estimate plus its rupee equivalent), the
  section `note` is the right slot and it will overrun the catalog's 20 words —
  the storyboard's "never pays" list normally protects exactly this string.
- **`number-sense` has exactly one `note`.** When a dossier attaches a
  mandatory caveat to the figure ("label it 2017") *and* the storyboard wants
  a general-rate note in the same slot, they collide. Put the caveat in
  `label` or `caption` and leave `note` for the comparison. The component
  throws at build if `equals` is outside 1–3, so one `equals` line is legal
  when only one equivalence is sourced.
- **`section.caption` / `section.source` work on every kind**, because
  `SectionBody` builds `data.caption = data.caption ?? section.caption` and
  the same for source. Prefer section-level for both; the only reason to use
  `data.caption` is a kind like `data-readout` where it means something else.
  Verified 2026-09-14: `you-think` and `number-sense` dispatch as
  `caption={section.caption ?? data.caption}`, so section-level is right for
  them; `data-readout` dispatches `caption={data.caption}` **only**.
  Re-checked 2026-09-15: the merge at the top of `SectionBody` runs *before*
  the dispatch arms, so a section-level caption does reach `data-readout`
  after all. What still holds is the semantic half. On that kind
  `data.caption` is the grid header, so author one or the other, never both.
- **A `data-readout` tile note cannot hold a two-source figure AND its
  Indian-scale comparison.** The gate caps tile notes at 15 words, and a note
  carrying both agencies' forms of one quantity ("ESA: more than 20,000 km.
  NASA: 13,200 mi (21,200 km) above the lunar surface.") is already 14. Put
  the lakh/crore comparison on the tile whose value IS the yardstick — the
  size tile, "the miss distance is three to four lakh times this width" — not
  on the tile being compared. It reads better there anyway.
- **`you-think`'s `actually.value` and `unit` are free** (`value` and `unit`
  are in the gate's `SKIP_KEYS`), so a two-figure value string
  (`"3.1% → 0.004%"`) plus a unit used as a time qualifier (`"in six days"`)
  buys the whole reframe for zero reader words. The panel labels default to
  "What most people think" / "What the data shows" — omit them unless the
  default is wrong, since an authored label is not free.
- **`timeline` `annotations[].at` matches an event's `date` string exactly**
  (or a 0-based index), and a miss is a silent no-op. Copy the `date` string,
  including its published spacing ("Feb 18 & 26 2026").
- **A six-event `timeline` does not need six notes.** Dropping the note on the
  event that carries an annotation reads cleanly: the callout is the note for
  that node, and the section loses a text block it could not afford.
- **`benchmark-chart` annotation `at` must equal an item's `label` string
  exactly** — a mismatch is a silent no-op, not an error. Keep the highlighted
  item's label a bare proper noun so the two can never drift.
- **`benchmark-chart` emits its `__cap` unconditionally, but BOTH caption slots
  still work.** Corrected 2026-09-15, after this entry shipped claiming a
  section-level `caption` "renders NOWHERE". That conclusion is wrong and would
  have taught the next drafter to avoid a valid authoring form.
  `SectionBody.astro` builds its `data` object with
  `caption: section.data?.caption ?? section.caption` (line 147) and then
  dispatches `caption={data.caption}`, so a section-level `caption` **is merged
  down and does reach the component**. Either slot renders.
  What IS true: `BenchmarkChart.astro` emits `<div class="px-viz__cap">`
  unconditionally, so `dataviz-v2.css`'s
  `.px-section:has([class$='__cap']:not(.vb__cap)) .px-section__claim
  { display: none }` always suppresses Section's own copy for this kind, and a
  section with no caption anywhere gets an empty caption row. So the caption is
  never invisible, it is only ever rendered by the component rather than by
  Section. `paradox` differs: its `__cap` is `{caption && …}`.
  **The lesson is about method, not about this kind.** Read the merge in
  `SectionBody` before concluding a field is dropped. Reaching the right
  authoring choice for the wrong reason still writes a false rule down.
- **`benchmark-chart`'s `EXPLAIN.what` says "Longer is better" and names a
  reference line.** Both are false for an inverted metric (passes allowed
  before a defensive action). That kind always needs an authored `plain`.
- **`shot-map`'s `EXPLAIN.what` says shots are "plotted where it was taken"**,
  which implies tracked event data. A schematic map needs an authored `plain`
  and an honesty clause in the caption, not only the source line.
- **`tactics-pitch` is the only `NEEDS_HOW` kind among the common sports
  kinds**, and its control is the pointer-tilt island (`data-tilt`), not a
  button — so the trailing control clause should say the pitch *leans* as the
  pointer moves, never "press" or "toggle". Its `players[]` render fine with
  `role` alone; dropping `name`/`num` is the cheapest way to buy back nine
  slots against the twelve-name ceiling.
- **`power-matrix` bills every cell's `institution` string to the word count,
  and a missing cell is not an error.** `cellFor()` defaults any absent
  institution×party pair to `control: 'none'` (the ○ glyph, no fill), so a 5×4
  grid needs only the cells that are `full` / `partial` / `contested`. Authoring
  all twenty costs ~100 reader words in duplicated lever names (`institution` is
  not in `check-prose`'s `SKIP_KEYS`; `party` and `control` are one-token and
  fall under the two-word floor). Author the non-`none` cells only, and keep the
  lever strings 3–4 words — each one is paid for once in `institutions[]` plus
  once per authored cell. Note also that "filled" in an editorial guardrail means
  *any* control but `none`: `partial` gets the party colour too.
- **`adoption-curve` resolves milestones AND annotations by an EXACT `points[].year`
  match.** `idxForYear` is `findIndex(p => p.year === yr)`, so a milestone whose
  year is not itself a plotted point renders **no pin on the line** (it still
  prints in the `adc__milestones` row under the chart) and any annotation whose
  `at` is that milestone's label is a silent no-op. Deleting interpolated points
  from a series therefore un-pins every milestone that sat between the survivors
  — anchor the annotation to a surviving point's numeric year instead, and say so.
- **`benchmark-chart` declares `items[].sublabel` and NEVER RENDERS IT.**
  Verified 2026-09-15 in `topic/tech/BenchmarkChart.astro`: the row emits
  `bc__label`, `bc__track`, `bc__fill`, `bc__val` and the annotation block, and
  nothing reads `sublabel` — it is in the Props interface and in the catalog's
  DATA line, so a storyboard will keep assigning it. The published
  `2026-04-24-kessler-cascade` carries five of them. Consequence for authoring:
  a band, a condition or a caveat parked in `sublabel` is invisible to the
  reader AND still billed to `readerWords` (`sublabel` is not in `SKIP_KEYS`,
  ~8 words a bar). When a storyboard's drawing rule says "the band goes in the
  sublabel", author it for payload completeness if you like, but put the band
  in the `caption` and the `plain` line too, and say so in the return — the
  bar's own `label` is the only string beside a bar that a reader actually
  sees.
- **`throughput-dial` is NOT in `NEEDS_HOW`** (checked against
  `src/lib/explainers.ts`, 2026-09-15), even though a briefing may say it is
  and even though it is a gauge. Practically this changes nothing — an
  authored `howToRead` renders for any kind — but it means the honest reading
  has to be authored or the section ships with no panel at all. Two more
  things about the kind: its `EXPLAIN.what` is a req/s string about server
  capacity, so any non-tech use MUST author `plain`; and `zones[0]` renders in
  `color-mix(--muted 55%, --paper)`, a soft grey, while the fill arc is
  `var(--accent)` — on a light desk the arc that grows as the thing gets worse
  is the cheerful colour and the danger band is the quiet one. Say which is
  which in the `plain` line.
- **`bill-passage` has no `status` value that means "introduced".** The enum is
  `passed | failed | pending | current`, and the component prints the raw status
  word under every card. A first stage labelled "Introduced" with a date of its
  own therefore reads "13 MAR 2026 / Introduced / … / PASSED", which a reader can
  take as "it passed on the 13th". The showcase (`2026-06-03-politics-showcase`)
  sets the precedent that `passed` means *this stage was cleared*
  (`Cabinet draft — passed`), so the value is right; the reading is the problem.
  Author a `plain` line saying the word under each card is whether the bill
  cleared that stage, even though the catalog and `EXPLAIN['bill-passage'].what`
  say a default fits. Costs ~18 reader words a storyboard will not have budgeted.
  Everything else about the kind fills cleanly from a legislative record:
  `label`, `status`, `date` and `note` are all present on the component, `date`
  and `status` are in the gate's `SKIP_KEYS` (free), and a one-word `label`
  ("Introduced", "Assent") falls under the two-word floor and is free too — a
  four-stage passage can cost as little as its four notes.
- **`power-matrix` renders a FIXED legend the author cannot reach:**
  `● Full control · ◐ Partial / contested · ○ None`, hard-coded in
  `PowerMatrix.astro`. The kind is catalogued as institutions × parties, but it
  works for any who-holds-what grid (five decisions × four actors in one
  application). The constraint is that the legend's word is **control**, so the
  column heads must be people or bodies that can *hold* a decision — never a
  date, a regime or an outcome. Also: `colorOf` falls back to `var(--muted)`, a
  soft grey, for any party with no `color`, so a non-party grid needs an explicit
  `color` on every party or its filled cells read as absent. `var(--accent-deep)`
  on all of them is the TD-06-safe choice, since the cell carries a glyph.
- **`match-stat-line` rows take numeric `home`/`away`** and split each row as a
  share of the row total, so a 1–1 scoreline with a penalty shoot-out needs the
  outcome stated in a row `note` or the intro; `outcome: "win"` on one side is
  the only signal the sheet itself gives.

Related: [[word-budget-accounting]], [[hindi-per-desk]].
