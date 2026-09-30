# Drafter memory digest
Digest of the memory as of 2026-09-28. Read-only during a run. Updates happen in a post-review pass.

## Data shapes that bite
- `at` must match exactly or the callout silently drops: `timeline` event `date`, `benchmark-chart` item `label`, `adoption-curve` plotted year.
- Build fails: rising `bill-funnel` counts, a `power-flow` unknown node id or unbalanced middle node, `margin-bullets` outside 0 < required <= max or value > max.
- `region-map`: zone `value` 0 to 1, unclamped (categories 1 and 0.35), `id` a quoted ISO numeric code ("096"), provinces in `markers`.
- `bill-passage` status means that stage was cleared or not, so say so in `plain`. A stage never held is `failed` plus a note.
- `power-matrix`: author only non-`none` cells, a `color` on every party, column heads that can hold control.
- `number-sense` prints `note` above `equals`, so it must stand alone.
- Default copy fits only the home use, so author `plain` on `benchmark-chart` (inverted metric), `gauge` (was `throughput-dial`), `power-flow`, `margin-bullets`, `arch-stack`, `core-sample`, schematic `shot-map`, and `howToRead` on `core-sample` and count-free `orbit-trace`.

## How check:prose counts
- The 1,100 bills eyebrows, titles, source labels, data strings of 2+ words. Free: `value`, `unit`, `date`, `at`, `status`, `role`, `id`, one-word strings, a `{label, date}` source's date.
- A gloss needs a colon, brackets, "that is" or "which means" after the term, within two sentences. "X means Y" and a comma appositive fail.
- First use runs title, dek, hook, primer, then each section from its eyebrow down. Keep a term out of the dek and the title of the section glossing it.
- Acronyms and years in jargon rows are terms of their own. Skip the acronym, spell units in words.
- Names: a sentence's first word is free, "X's Y" mints a new name, hyphenated and ALL CAPS words count. Put "the" or a role before a person.
- Numbers per sentence count in body text only (head, intro, data notes, text). A third figure goes in `value`, `unit` or the caption.
- A `prose` section needs "that means" or "in other words" and "think of" or "like a". A spaced en dash counts as an em dash.

## Budgets that slip
- Storyboard rows run light, worst in kinds never published (`margin-bullets` costs about 200 words). Add 15 to 20% there, trim prose, never data.
- The 80 before the first graphic includes section 1's eyebrow and title. Head about 72, those two 8, so its intro usually goes.

## Hindi by desk
- The desk row beats a word's own note. `hisaab` passed in a sports dek and a tech card note, failed as a politics eyebrow.
- Politics, statutes, minority rights: zero except a sourced quote. Space, money-led tech: one word in a numeral-free sentence, deletable, off technical terms. Sports: three touches in ten sections. Earth, travel: none, or one in the head.
- Keep tile notes and stat rows English too. The gate skips particles and off-lexicon words, so silence is not approval.
