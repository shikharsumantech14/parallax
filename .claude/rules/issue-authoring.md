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
- `plain` — max 220 chars, and `howToRead` — 40–360 chars. **Both are
  deprecated and no longer rendered** (Lens Phase 3, 2026-09-30): the cues and
  the one caption do their work. The bounds still hold because the fields stay
  in the schema until Phase 8, so an over-long one still fails the build. Do
  not author new ones
- `caption` — the DATA claim; the only comprehension field the verifier traces
  (with the cue sentences, below). It renders ONCE, at the end of the article
  column, in Newsreader italic. Never a scale or axis word ("· log scale" is
  FORM, CAPTION-FORM)
- `sources[].url` — must be a real URL; mock URLs break the build
- every `sourceRefs[]` entry must resolve to an existing `source.id`
- `layout` ∈ `default | wide | bleed | split | split-flip | breath`. Since
  Lens Phase 3 every value renders the one reading-system geometry: `wide`
  widens the figure panel to 620, every other value renders as `default`.
  Author `default` or `wide` only
- `cues` — at most four per section, each `n` an integer 1–4, `at` a
  non-empty string (or a positive integer), `text` ≤ 240 chars; `short` ≤ 24
  chars (both below)
- `skimCaption` applies to `kind: prose` only; other kinds ignore it
- `cover` (Lens Phase 4, 2026-09-30, optional) — `{ section, number, label,
  headline? }`: `section` an integer ≥ 0 (the index of the section a cover
  draws), `number` a string of 1–12 chars written as the issue prints it
  (`"1,330"`, `"2030"`), `label` 3–60 chars, `headline` ≤ 120 chars. The Home
  and desk stages set `number` at 160 with `label` under it (a lower-case
  `label` that starts with a unit reads after the number: "1,330 days since
  City were charged"); `headline` overrides the title on the stage only.
  `cover.section` picks the cover card's drawing when it names one of the
  eleven drawable kinds (`src/lib/cover.ts`), else the first drawable section
  is used. Every number must be one the issue already carries (the verifier's
  rule). Author one on the newest issue of a desk: the Home stage shows the
  newest issue that has one. Examples: No 17 (`section: 0`, the readout) and
  No 14 (`section: 0`, the descent profile)
- `source` — string or `{ label, date }`, on the section (or legacy
  `data.source`). Renders ONCE, from `core/Section.astro`, as `Source · label
  · date` with the label linked to the section's first `sourceRefs` entry: in
  the figure panel's foot on a desktop graphic section, under the caption on
  phones and on narrative sections. Components emit no source line
- `kind` — one of the **87** in `SECTION_KINDS`, or one of the six retired
  names in `KIND_ALIASES` (`src/content/config.ts`), which the schema resolves
  to the host on parse: `carbon-gauge`, `swing-dial`, `throughput-dial` →
  `gauge`; `route-card`, `itinerary-reel` → `itinerary`; `city-compare` →
  `comparison`. **Author the host name.** The ten kinds the Lens verdict
  dropped (`beat-sheet`, `plate`, `orbital-shells`, `elevation-profile`,
  `coalition-orbit`, `ballot-flow`, `orbit-globe`, `signal-readout`,
  `data-globe`, `route-globe`) fail the build.

## Lens: the reading system (Phase 3, 2026-09-30, `docs/design/LENS.md` §5)

A graphic section is the article (620) beside a pinned figure panel (520);
a narrative section (`prose`, `quote`, `analogy`, `jargon-buster`,
`three-steps`) is the article alone. The article carries the eyebrow, the
title, the intro, **the kind's own sentences** (a `timeline`'s events, a
`data-readout`'s tiles as "**Label: value.** note", a `you-think`'s two
texts), the caption and, on phones, the source. The figure's compact form
drops what the article already says.

- **`cues: [{ n, at, text? }]`** — two to four per graphic section, none on a
  narrative kind. `n` is the numeral (1–4). `at` names the anchor(s) the
  component exposes: an id, or several separated by spaces ("2 6" lights two
  timeline events). `text` is the sentence the panel shows while the cue is
  lit; leave it out and the panel shows the sentence the marker introduces
  (or the item's own sentence). A cue sentence is a data claim, traced like a
  caption.
- **`[[n]]`** — the inline marker, placed BEFORE the sentence it belongs to,
  in `intro` (a blank line starts a paragraph), `caption`, a prose kind's
  `data.paragraphs`, the `you-think` `think.text` / `actually.text`, a
  timeline event's `note`. It renders as the cue button (a real `<button>`,
  the 20px disc) and tints the sentence while lit. A `data-readout` tile or a
  `timeline` event named by a cue gets its button automatically, before its
  sentence; no marker needed. Story cards, meta tags and `check:prose` strip
  every marker.
- **Anchors** — a component exposes `data-cue="<id>"` on the element a cue can
  name, ids numbered from 1 in DATA order (before any sort), plus an empty
  `<span class="px-cue-tag" data-cue-tag="<id>" hidden>` where the numeral
  should sit; `core/Section.astro` fills the numerals from `cues`. Wired so far
  (the City issue's kinds): `data-readout` (each tile), `you-think` ("1" the
  belief, "2" the record, "3" the record's figure), `timeline` (each event),
  `benchmark-chart` (each bar, authored order), `latency-waterfall` (each
  span), `margin-ladder` (each rung, authored order), `power-matrix` (each
  institution row), `jargon-buster` (each term), `comparison` (each row; each
  column in the list form). The other kinds get theirs in Phase 6; until then
  a cue naming one of them lights nothing.
- **`short`** — the section's name in the "In this issue" card and the rail,
  ≤ 3 words (≤ 24 chars). Absent, it is derived from the eyebrow.
- An issue with no cues renders the two columns with no numerals, and reads.
- **Photography is rejected** (LENS §1): there is no `plate` kind; a cover is
  a section drawn in stage mode (`cover:` arrives in Phase 4).

## Status

`draft` → `review` → `published`. Only `status !== 'draft'` renders publicly,
and **only the operator flips it.** Story pages build only for
`status !== 'draft'`.
