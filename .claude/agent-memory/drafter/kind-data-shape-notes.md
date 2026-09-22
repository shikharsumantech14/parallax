---
name: kind-data-shape-notes
description: Per-kind authoring frictions found while filling data from a dossier — number-sense/you-think/three-steps caps, comparison and three-steps counting as TEXT_ONLY, annotation `at` matching
metadata:
  type: project
---

Frictions worth knowing before you author, not after.

**`comparison` and `three-steps` count as TEXT_ONLY in the gate.** So does
`paradox`, `jargon-buster`, `analogy` and `plate`. A storyboard that calls
`comparison` "visual" will overstate the visual share — an eight-section spine
with `three-steps` + `comparison` + `paradox` is 5/8 = 62.5%, not 75%. Still
above the 60% floor, but check the arithmetic yourself and check that no two
of those three land adjacent.

**`number-sense`** — `label` ≤ 8 words is tight when the label must carry both
what the number is and when it applies ("Everest permit, spring season, from
September 2025" is exactly 7). The component throws at build on a missing
`value`/`label` or on `equals` outside 1–3. Each `equals[].text` is a traced
claim; put the conversion basis in its `note`, and the rate's as-of date in
the section's `source.date`.

**`you-think`** — `actually.unit` renders as mono, uppercase, tracked, on the
value's baseline. Keep it to two or three words ("slots a day"); anything
longer wraps badly under 400px. `think.text` and `actually.text` each cap at
30 words and the component throws if either is missing.

**`three-steps`** — narrative: no caption, no plain, no how-to-read, no
VizCard. It *does* take an optional `source`, which is the only way to satisfy
"no source, no section" for it. Step `title` ≤ 6 words is the binding cap;
step `text` ≤ 25 is roomy by comparison. Avoid repeating the step title's
first words at the head of its text — the numeral, title and text stack
vertically and the echo reads as a stutter.

**`timeline` annotations** — `at` must equal the event's `date` **string**
exactly, including its formatting: `"2019"`, `"2025 season"`, `"Jul 1 2024"`.
A non-match is a silent no-op. Do not duplicate the annotation's claim in the
same event's `note`: both render, the annotation beside the label and the note
below it.

**`version-graph`** (first authored 2026-09-21) — its `nodes[]` are `{id,
parents?, label?, tag?, lane?}` and **`id`, `parents` and `tag` are all
reader-facing and all billed**. The legend prints `id` at 13px bold, `label` at
11px **hidden below 480px**, and `tag` as an 8.5px uppercase chip, so the `id`
is what a phone reader actually reads: it must be a legible short name, not a
slug, and the `label` must be the expendable half of the pair. Budget ~1.5–2
words per node beyond the label (`id` + `tag` + each `parents` entry), which on
ten nodes is ~16 words a storyboard will not have counted. `lane` is the column
and is free; gaps in the lane numbering are fine (0, 1, 2, 4 renders with an
empty column, which is a cheap way to separate two families). First node in the
array sits at the TOP and the graph runs downward, so author oldest-first.

**`arch-stack`** (first authored 2026-09-21) — `{layers: [{label, sublabel?,
color?}]}`, and the `sublabel` is where the whole section lives: it renders
uppercase mono muted under the label, and it is the only prose slot the kind
has. Five layers of ~10-word sublabels is ~60 billed words before the intro.
The card is capped at 460px wide and tilts on pointer (`data-tilt="7"`), so
keep each `sublabel` to two short sentences or it wraps to four lines and the
stack loses its shape. It is NOT in `NEEDS_HOW`, and its `EXPLAIN.what`
describes a software runtime stack, so any non-runtime use of it — layers of
a *claim*, layers of a *cost* — must author `plain`.

**`elevation-trek` and `data-readout` read `data.caption` / `data.source` at
their dispatch line**, not `section.caption ?? data.caption`. That still works
because `SectionBody` merges the promoted section-level fields down into
`data` first (`data.*` wins where authored). So author `caption` and `source`
at section level for every kind and leave them out of `data` — one form,
no double-count in the word budget, no duplicate render.
