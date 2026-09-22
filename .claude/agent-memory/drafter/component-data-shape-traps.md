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
- **`benchmark-chart` RENDERS `items[].sublabel`. This entry previously said it
  never did; that was wrong and is corrected here (2026-09-21).**
  `topic/tech/BenchmarkChart.astro` line 121 emits
  `{it.sublabel && <span class="bc__sub">{it.sublabel}</span>}`, a second line
  under the bar label. The false claim was written before the 2026-09-15
  unread-field sweep landed and was never re-checked against the file; a later
  drafter would have moved a sourced band out of the slot the storyboard chose
  for it, for no reason. So a storyboard's drawing rule — "draw the low end,
  put the band in the sublabel" — is safe to execute literally. Two things
  still hold: `sublabel` is **not** in `check-prose`'s `SKIP_KEYS`, so it is
  billed to `readerWords` at roughly 3–8 words a bar, and a band the argument
  depends on still belongs in the `caption` as well, because Skim mode and the
  story cards drop the bar labels.
  **Method lesson, restated because this file has now got the same kind wrong
  twice in opposite directions:** grep the component for the field name before
  writing a "never renders" rule, and date the check. A remembered absence is
  not evidence, and the 2026-09-15 sweep rendered thirteen fields that had
  been documented-but-dead — any pre-sweep memory about a dead field is stale
  by default.
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

- **`descent-profile`'s `points[].t` is signed and counts BACKWARD from the
  event**, so a plan expressed as "eighteen months before the final burn"
  authors as `t: -18` through `t: 0`, not as calendar dates. The axis labels
  itself in months-to-go, and `events[].t` is interpolated onto the polyline,
  so an event only lands on the curve if its `t` falls inside the plotted
  range. Two consequences. A final-burn event needs a `t: 0` point authored
  even when the altitude is unchanged from the previous one, or the flag
  floats past the end of the line. And `points[].phase` is optional — omit it
  when the storyboard has not assigned phases, because an authored phase
  string is billed to `readerWords` once per point.
- **`orbit-trace` rings are drawn on a COMPRESSED altitude scale against
  `maxAltKm`, so near-identical orbits collide.** Three rings at 415 / 400 /
  330 km under `maxAltKm: 500` are legible; adding a fourth at 220 would have
  put two rings within a few pixels of each other. When a storyboard drops a
  ring that exists in the dossier, that is usually why — do not add it back
  for completeness. `inclDeg` is optional per orbit and simply omits the
  inclination read-out for that ring, which is the right authoring choice when
  a planned mission's inclination is not sourced. It is also the only
  `NEEDS_HOW` kind in a typical space spine, and its default panel talks about
  satellite counts, so a section that carries no counts must author
  `howToRead` and say so explicitly.

- **`region-map`'s `zones[].value` is a 0–1 interpolation parameter, not a
  rank.** `RegionMap.astro` builds `fill()` as
  `colorAt(minColor, maxColor, v)` and `colorAt` passes `v` straight into
  `lerp` with no clamp, so a "categorical" payload authored as `2` for the
  source country and `1` for the others extrapolates past `maxColor` and emits
  out-of-range RGB. Compose a two-value categorical as `1` and about `0.35`,
  and say in the `plain` line that the shading is a category, not a measured
  ranking. Two more constraints found the same run: `zones[].id` must be the
  **zero-padded three-character ISO 3166-1 numeric** code as the topology
  writes it (`"096"` for Brunei, quoted — YAML would otherwise read `096` as a
  number and the `String(z.id)` lookup would miss), and Indonesian *provinces*
  cannot be zones at all, because the topology only has countries. Provinces go
  in `markers[]`, which carry `label` and `kind` only — no value, so a
  per-marker figure has to live in the caption. `legend.none` is optional and
  is a cheap ~3 words to drop when the budget is tight.
- **`core-sample`'s `EXPLAIN.what` ends "deeper meaning older", which is false
  for any non-stratigraphic column.** A burn-depth column (ground level, burn
  depth, legal water table, canal depth) is distance downward *today*, not
  time, so the kind needs BOTH an authored `plain` ("each mark is a depth
  below ground, not a layer of time") and an authored `howToRead`. Shape notes:
  `layers[].depth` is a free **string** and is **not** in `check-prose`'s
  `SKIP_KEYS`, so "0 cm" / "25 cm" / "40 cm" / "50 cm" bills 8 reader words
  before a single label — write bare numerals where the `unit` already says
  cm. `value` and `unit` ARE skipped, so the one measured figure on the column
  is free. It is the natural `layout: split` hero on an earth issue.
- **`power-flow`'s conservation check only fires on `via` nodes, so a
  four-source / one-sink fan is always build-safe.** `PowerFlow.astro` computes
  `isVia = n.group === 'via' || (si > 0 && so > 0)` and `continue`s on anything
  else, so a sink with inflow only is never balanced against anything. What
  DOES throw is `maxDepth < 1` (needs at least two layers) and a `links[].from`
  or `to` naming an unknown node id. Its `EXPLAIN` default opens "Money flows
  left to right", which is wrong on every non-money use, so a carbon or energy
  flow must author `plain`. Billing: `unit` is skipped, node `label` and link
  `note` are not, so five labels plus four notes cost ~35 reader words on their
  own. Keep node labels to 4–5 words and notes to 3–5.

- **`bill-funnel` build-fails on a stage LARGER than the one above it, so every
  stage has to be a subset of the last, not a different question.** Four to ten
  stages, counts monotonically non-increasing. The trap on a scrutiny story is
  wanting a final stage like "still awaiting assent", which can legitimately
  exceed the bar above it; "debated by any MP but the minister" (2 of 11)
  works because it narrows the same cohort. A stage's `note` is the only place
  to say *why* a bar dropped, and it is where the exception goes ("the twelfth
  went to a committee instead"). The catalog says "pairs with `default`; never
  `split`" — so a `bill-funnel` hero is the one hero that cannot take split.
- **`margin-bullets` is four independent scales in one graphic, which is
  exactly why it needs BOTH an authored `plain` and an authored `howToRead`.**
  Its `EXPLAIN.what` is space-desk copy about decibels and kilograms, so it is
  wrong on every other desk. Per row `{ label, value, required, max, unit,
  note? }` with `0 < required <= max` and `0 <= value <= max`. A percentage row
  and a raw-count row can share the graphic only if each row's `max` is its
  OWN full range — never normalise them to 100 — and the `howToRead` must say
  "compare every bar to the tick on its own line, never to another row's",
  because the default reading of stacked bars is cross-row. When a row's
  `required` is DERIVED (an older House's referral rate applied to this
  House's bill count), put the arithmetic on the section source line and mark
  the row's note "A comparison, not a rule", or the tick reads as a legal
  threshold that does not exist.
- **`bill-passage`'s `status` has no value for "this stage never happened".**
  The enum is `passed | failed | pending | current`. A committee stage that was
  never entered is not "failed" in any ordinary sense, but `failed` is the
  nearest mark, so the `note` carries the whole meaning ("Not referred. No
  committee examined this bill") and is mandatory — without it the graphic
  asserts the committee looked and said no.

Related: [[word-budget-accounting]], [[hindi-per-desk]].
