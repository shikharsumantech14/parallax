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
- **`benchmark-chart` annotation `at` must equal an item's `label` string
  exactly** — a mismatch is a silent no-op, not an error. Keep the highlighted
  item's label a bare proper noun so the two can never drift.
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
- **`match-stat-line` rows take numeric `home`/`away`** and split each row as a
  share of the row total, so a 1–1 scoreline with a penalty shoot-out needs the
  outcome stated in a row `note` or the intro; `outcome: "win"` on one side is
  the only signal the sheet itself gives.

Related: [[word-budget-accounting]], [[hindi-per-desk]].
