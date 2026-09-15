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
- **Story `beats` lose the chrome that carries the caveat.** `story.css` hides
  `[class$='__cap']` inside a beat, and most viz render their caption as
  `.px-viz__cap`. So an honesty line the operator ruled into the *caption*
  ("positions are schematic") vanishes in story mode, where the beat text is
  the only copy. On any issue with a schematic or illustrative figure, check
  that its beat repeats the caveat.

See [[inherited-data-blindspot]], [[cheap-checks-that-catch-most]].
