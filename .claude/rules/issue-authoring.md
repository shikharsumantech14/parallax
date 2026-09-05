---
paths:
  - "src/content/issues/**/*.mdx"
  - "src/content/config.ts"
---

# Issue authoring — pointer to the full guide

**Read `src/content/issues/_AGENTS.md`** for the complete schema, primer rules
and build-error catalog before authoring or editing an issue.

This rule exists because that subtree is the one place in the repo that
**cannot host a `CLAUDE.md` loader shim**. The issues collection is
`type: 'content'`, so Astro parses every `.md` at the root of
`src/content/issues/` as a collection entry, and any `.md` directly in
`src/content/` belongs to no collection. Both break the build — verified
2026-09-01 (`InvalidContentEntryFrontmatterError`, then
`UnknownContentCollectionError`). It is the same trap the guide's own leading
underscore exists to dodge. A `.claude/rules/` file sits outside `src/`, so
Astro never sees it.

## The build-breaking constraints

Zod enforces these at build time — overshooting does not warn, it **fails the
build**:

- `primer` — 80–420 chars
- `plain` — max 220 chars. Explains the *form* of the viz ("each block is one
  seat"), never the data
- `howToRead` — 40–360 chars, renders ABOVE the graphic. Optional: leave it
  out and `EXPLAIN[kind].how` (`src/lib/explainers.ts`) renders in its place —
  the fallback is live for every kind (a section shows exactly one panel).
  **Instruments — any kind with a control (scaling-plot, xg-race,
  climate-spiral, tactics-pitch) — must author one**, and the static reading
  leads, the control clause trails ("…Press Linear for the proportional
  view"): the control is `html.js`-gated, the paragraph is not
- `caption` — the DATA claim; the only comprehension field the verifier traces.
  Never a scale or axis word ("· log scale" is FORM — it was stripped from
  the published token-bill caption on 2026-09-04, CAPTION-FORM); a reader
  with the log/linear toggle can make such a caption false
- `sources[].url` — must be a real URL; mock URLs break the build
- every `sourceRefs[]` entry must resolve to an existing `source.id`
- `layout` ∈ `default | wide | bleed | split | split-flip | breath`
- `skimCaption` applies to `kind: prose` only; other kinds ignore it
- `source` — string or `{ label, date }`, on the section (or legacy `data.source`).
  Renders ONCE, from `core/Section.astro`, as `SOURCE · …` — the second line of
  the plain paragraph BELOW the graphic, for every kind (`.px-plain__src`).
  Components emit no source line of their own any more (`.px-viz__src` is gone),
  so do not duplicate the source into the graphic's data or caption. `plain`
  renders in the same paragraph, as `IN PLAIN TERMS — …`.


## Status

`draft` → `review` → `published`. Only `status !== 'draft'` renders publicly,
and **only the operator flips it.** Story pages build only for
`status !== 'draft'`.
