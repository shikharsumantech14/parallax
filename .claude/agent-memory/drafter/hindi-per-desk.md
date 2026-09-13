---
name: hindi-per-desk
description: Which Hindi words survived the four tests on the sports desk, where the one wholly-Hindi field lives, and the lexicon gap that will read as a false flag
metadata:
  type: project
---

Per-run notes on placing Hindi, beyond what the lexicon and contract already
say.

**Why:** the four tests are easy to apply to a word and hard to apply to a
*slot*. Most of the judgement is about which field a word may sit in, and the
answer differs by kind, not only by desk.

**How to apply:**

- **`jargon-buster`'s `hindi` field is the one field in the schema that is
  wholly Hindi by design** (RG-09). It is not a data label and not in
  `check-prose`'s `PRECISION_FIELDS`, so it is legal — but the blueprint's own
  worked line, `"matlab, kitne maukon se goal banta hai"`, uses *kitne*,
  *maukon* and *banta*, none of which are in `hinglish-lexicon.md` or in
  `check-prose.mjs`'s always-on allowed list (which has *mauka*, not the
  oblique *maukon*). Expect a lexicon flag on a string the repo itself ships
  as canonical. Use the blueprint's line verbatim rather than inventing a
  compliant variant.
- **Sports, three touches was the right density for a ten-section issue**
  (dek, the `hindi` slot, one word in the closing prose) — the desk allows the
  most Hindi in the lexicon, and three still reads as seasoning. Every section
  that sits next to a number stayed L1.
- **Words that passed the skip test cleanly on sports:** *hisaab* in a dek
  ("the maths that won it" survives deletion), *maidan* in a closing prose
  paragraph ("the ground stops" survives). Both are nouns the reader owns and
  neither modifies a figure.
- **The slot that keeps failing is the one that looks safest:** a tile `note`
  or a chart `caption` reads like prose but is the precision layer. Keep the
  whole `data-readout`, `benchmark-chart` and `match-stat-line` blocks
  English-only without thinking about it.

Related: [[component-data-shape-traps]].
