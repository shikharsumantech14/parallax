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

**`elevation-trek` and `data-readout` read `data.caption` / `data.source` at
their dispatch line**, not `section.caption ?? data.caption`. That still works
because `SectionBody` merges the promoted section-level fields down into
`data` first (`data.*` wins where authored). So author `caption` and `source`
at section level for every kind and leave them out of `data` — one form,
no double-count in the word budget, no duplicate render.
