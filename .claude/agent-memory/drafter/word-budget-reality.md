---
name: word-budget-reality
description: The 1,100 reader-word ceiling counts data labels, captions, sources and skimCaptions — storyboard per-row budgets do not, so a "970-word" storyboard drafts at ~1,350
metadata:
  type: project
---

A storyboard's per-row word budget counts only intro + component copy. The
1,100-word ceiling (`scripts/check-prose.mjs` `readerWords`) counts **every**
reader-facing string: eyebrow, title, intro, plain, howToRead, caption,
skimCaption, source *label*, and every nested `data` string whose key is not
in `SKIP_KEYS`. That includes `label`, `note`, `text`, `values`, `kicker`,
`tag`, `statement`, `detail`, point labels and annotation text.

**Why:** a storyboard budgeted at 970 words drafted out at ~1,350 on the first
pass of the Everest/Fuji rewrite (2026-09-13). The gap is the precision layer
plus the verbatim `comparison` / `paradox` / `timeline` payloads, which alone
ran 92 / 87 / 121 words and were non-negotiable copy-verbatim.

**How to apply:** budget roughly `storyboard total × 1.35` before you start,
then buy the difference back in this order — it costs the least meaning:

1. **Omit `plain` wherever the catalog `PLAIN:` / `EXPLAIN[kind].what`
   default already says the storyboard's sketch.** The reader sees the same
   sentence either way (Section renders the default), but an authored one is
   counted. Author `plain` only when it adds something the default cannot —
   e.g. an honesty line about which values are surveyed and which are drawn.
   Saves ~15 words per section.
2. Keep `skimCaption` at 11–15 words, not the 40-word cap. Eight sections at
   the cap is 320 words on its own.
3. Put a conversion basis or an as-of date in `source: { date: … }` rather
   than the label — `date` is in `SKIP_KEYS`, renders identically in the
   `Source · label · date` line, and reads more honestly anyway.
4. Shorten source labels to the shortest form that still names the issuing
   body ("Nepal Dept. of Tourism via The Kathmandu Post", not the full
   department title).

**Words before the first graphic is the tighter constraint.** It is head
(title + dek + hook + primer) + the first section's eyebrow + title + intro,
cap 80. A 24-word operator-signed hook and a 23-word primer leave ~20 words
for the whole first section's chrome. Draft the first section's title at 6
words and its intro at 12.

See [[copy-verbatim-vs-gate-flags]].
