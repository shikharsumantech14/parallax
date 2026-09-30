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
  out and `EXPLAIN[kind].how` (`src/lib/explainers.ts`) renders in its place
  **only for the kinds in `NEEDS_HOW`** — instruments, WebGL scenes,
  counter-intuitive forms (RG-19, 2026-09-13). A timeline, a tile row or a bar
  chart shows no panel unless one is authored. A section shows at most one.
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
- `layout` ∈ `default | wide | bleed | split | split-flip | breath` — author
  only `default`, `wide` or `breath`; `bleed`, `split` and `split-flip` are
  aliases of `wide` since 2026-09-23 (they crossed the floor plan's rails)
- `skimCaption` applies to `kind: prose` only; other kinds ignore it
- `source` — string or `{ label, date }`, on the section (or legacy `data.source`).
  Renders ONCE, from `core/Section.astro`, as `SOURCE · …` — the second line of
  the plain paragraph BELOW the graphic, for every kind (`.px-plain__src`).
  Components emit no source line of their own any more (`.px-viz__src` is gone),
  so do not duplicate the source into the graphic's data or caption. `plain`
  renders in the same paragraph, as `IN PLAIN TERMS — …`.
- `kind` — one of the **87** in `SECTION_KINDS`, or one of the six retired
  names in `KIND_ALIASES` (`src/content/config.ts`), which the schema resolves
  to the host on parse: `carbon-gauge`, `swing-dial`, `throughput-dial` →
  `gauge`; `route-card`, `itinerary-reel` → `itinerary`; `city-compare` →
  `comparison`. **Author the host name.** The ten kinds the Lens verdict
  dropped (`beat-sheet`, `plate`, `orbital-shells`, `elevation-profile`,
  `coalition-orbit`, `ballot-flow`, `orbit-globe`, `signal-readout`,
  `data-globe`, `route-globe`) fail the build.

## Lens: what changes for an author (2026-09-30, `docs/design/LENS.md` §5)

- **Cues arrive in Phase 3; the schema has neither yet.** A graphic section
  will carry `cues: [{ n, at, text }]` (two to four; `at` names an anchor the
  component exposes; `text` is the cue's sentence, a traced data claim) and
  its prose will carry inline `[[n]]` markers that render as cue buttons.
  Until Phase 3 lands, a `cues` list is silently stripped by the schema (Zod
  drops unknown keys) and a `[[n]]` prints as literal brackets. Do not author
  them yet.
- **`plain` and `howToRead` are deprecated.** Still accepted by the schema and
  still rendered, until Phase 8 retires them with the old shell; the pipeline
  keeps authoring them until Phase 7 teaches it cues. The bounds above still
  fail the build.
- **Photography is rejected** (LENS §1): there is no `plate` kind any more; a
  cover is a section drawn in stage mode (`cover:` arrives in Phase 4).

## Status

`draft` → `review` → `published`. Only `status !== 'draft'` renders publicly,
and **only the operator flips it.** Story pages build only for
`status !== 'draft'`.
