---
name: data-shape-honesty
description: A component's data fields can render a claim the prose never made — check the field against the component source, not the catalog
metadata:
  type: project
---

**A section can be fully traced and still lie, because the FIELD it puts a
fact in renders something different from the fact.** This is a claim class the
dossier trace cannot catch, and it recurs on sports and politics kinds where a
field encodes an outcome.

**Why:** on the Arsenal Phase-4 rewrite (2026-09-14) the `match-stat-line`
carried `home.score: "1"`, `away.score: "1"` and `home.outcome: "win"` for a
match PSG won on penalties. Every underlying fact traced. But
`sports.css` renders `data-outcome="win"` as *colour on the club name only* —
so the figure showed `1 — 1` with one side tinted, no shootout numeral
anywhere, and colour as the sole encoding. The component's own field comment
(`score?: /* "2", "0", or "(4)" for penalties */`) documented the honest shape
that was not used.

**How to apply:**
- For any kind with an outcome / status / emphasis field, open the `.astro`
  and the theme CSS and ask *what does a reader of the graphic alone see?*
  Then compare that to the section's intro. A fact that lives only in the
  prose while the graphic contradicts it is an ⚠️, and the fix is usually one
  field the component already documents.
- **Read the component, not the catalog, for field names.** `catalog.md` said
  `data-readout` takes `accent?: true`; the component's real field is
  `emphasis?: 'default' | 'key' | 'warn'`. The draft was right and the catalog
  stale — flagging the draft there would have been wrong.
- **An annotation that traces can still render NOTHING.** `annotations[].at`
  resolves through the series: `AdoptionCurve` maps a milestone *label* → its
  `year` → `points.findIndex(p => p.year === …)`, and a miss is a **silent
  no-op** by spec. So a storyboard that trims the series *and* names an `at`
  anchor in the same row can mandate an impossible pairing — on the cockroach
  rewrite, deleting the 521 point made the storyboard's "match the 21 May
  milestone label verbatim" unrenderable, and the drafter's departure to a
  numeric `at` was forced, not sloppy. **Verify every annotation RESOLVES, not
  just that it traces**, and check the auto-flip/clamp logic too (a `side:
  above` on a 100% mark flips to `below`). `Timeline` uses a different rule —
  exact string match on the event's `date` — so the same `at` idiom is not
  portable between kinds.
- **A deleted point also changes the geometry, not just the claim.**
  `AdoptionCurve` positions by **array index**, not by x value, so trimming six
  points to three makes a six-day gap and a one-day gap render the same width,
  and its axis labels (`String(year).slice(2)`, written for four-digit years)
  read as single digits under a month-day encoding. Neither is an authoring
  defect, but both decide which claim the graphic can carry: a *level* claim
  survives, a *rate* claim does not. Say that plainly — it is usually an
  argument FOR the weakened wording, not against it.
- **Count the STRANDS: how many rendering places does each key fact reach the
  reader through?** The sibling of the annotation check, and it turns "does this
  render" into something more useful. On amazon the two published bands were
  authored into `items[].sublabel` on `benchmark-chart` — then a declared-but-unemitted
  field. (**Corrected 2026-09-22: it emits now.** The 2026-09-15 unread-field
  sweep wired it as `.bc__sub`, a second line in the fixed 150px label column.
  Re-read that sweep's list in root `AGENTS.md` §10 before citing any field as
  dead — thirteen were fixed at once, and a memory note about a dead field is
  the most perishable kind.) The bands still reached
  the reader, through the `caption`, so nothing was lost and there was no flag to
  raise. But counting strands showed 3.7–4 arriving three ways (two captions plus
  a printed `value`), 22–28 two ways (caption plus a `zones[].label` legend chip,
  which DOES render), and **1.5–1.9 exactly one way** — one caption, with the
  field that looks like its second carrier rendering nothing. That is a fragility
  note the operator can act on ("do not trim this caption") and it costs one pass
  over the file. A one-strand fact whose apparent second strand is a dead field is
  the shape to look for.
- **An intro that promises a label the component does not draw is the
  highest-yield version of this whole class.** On open-models (2026-09-22) the
  `version-graph` intro said *"Three labs you have probably never heard of. Each
  has its own column below"* and the `plain` said *"the column is the lab that
  made it"*. `VersionGraph.astro` draws **no lane labels** — lanes are colour
  only — so the three lab names appeared nowhere in the issue. Every underlying
  fact traced; the reader still got nothing. **The test that catches it: read
  every promissory phrase in an intro or `plain` ("below", "each column", "the
  colour shows", "labelled") as an assertion about the RENDER, and go find the
  markup that satisfies it.** The independent reader panel found the same defect
  and scored the section 2/5 — when a panel says "the intro promises names the
  section never delivers", that is this flag, not a prose complaint.
- **Check the layout axis before believing an ordering claim.** The same
  component positions rows by `cy(i)` where `i` is the **array index**, while the
  `plain` claimed "oldest at the top". The authored array was grouped by lane, so
  a 2025 release sat below a 2026 one. `AdoptionCurve` has the identical
  array-index habit (above). **Any `plain` asserting "oldest", "largest",
  "in order" is a claim about the array, not about the data** — sort the authored
  array yourself and check. Relatedly, a skipped lane/index value reserves an
  empty column, because width comes from `Math.max(...laneVals)`.
- **Some components hard-throw on the wrong TYPE, not just the wrong shape —
  which makes a data-shape defect a build failure.** `NumberSense` requires
  `value` as a **string** (it must never reformat: en-IN `toLocaleString`
  regroups 1,500,000 as 15,00,000), so a YAML `value: 4795` throws at build.
  `data: z.any()` in `config.ts` means Zod coerces nothing and catches nothing.
  Worth one pass: for every kind in the draft, grep its `.astro` for `throw new
  Error` and check the authored data against each guard. Cheap, and it turns a
  "needs revision" into a "does not build", which the operator must know first.
  Sibling trap in the same component: `unit` renders as a mono suffix AFTER the
  figure, so `value: "4,795"` + `unit: "₹"` paints "4,795 ₹" while the caption
  says "₹4,795". The published convention is the symbol inside `value`.
- **Story `beats` lose the chrome that carries the caveat.** `story.css` hides
  `[class$='__cap']` inside a beat, and most viz render their caption as
  `.px-viz__cap`. So an honesty line the operator ruled into the *caption*
  ("positions are schematic") vanishes in story mode, where the beat text is
  the only copy. On any issue with a schematic or illustrative figure, check
  that its beat repeats the caveat.

See [[inherited-data-blindspot]], [[cheap-checks-that-catch-most]].
