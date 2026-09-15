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
- **Space is a one-word desk, and the closer's `followup` is the slot.** On the
  2024 YR4 rewrite the whole issue carried exactly one Hindi word, *aasmaan*,
  in a `quote` section's `followup`. It passes at PHRASE level, not word level:
  deleting the bare word breaks the sentence, but deleting the phrase "in the
  same aasmaan" leaves "It is still up there, on the same path it has always
  flown" intact — which is what the skip test actually asks. Write the
  zero-Hindi sentence first and slot the phrase in, so the test is passed by
  construction.
- **Every other field on a space issue stays L1 without argument.** The desk's
  vocabulary is technical (probability, orbit, km, dates), so nearly every
  field is either the precision layer or sits next to a figure. One word in
  one prose field is the whole budget, and the lexicon says so.

- **Tech, when the issue is about money, is a one-word desk like space, and
  the slot is `you-think`'s `note`.** The lexicon rates tech "medium", but a
  token-pricing issue runs a figure through almost every field, so the
  precision test bars Hindi from all of them. *hisaab* survived in the opening
  card's `note` ("Cheaper per unit, many more units per job. That hisaab only
  goes one way") because the note is scored as body prose and the sentence
  carrying it has no numeral in it. Note that *hisaab* is the one lexicon entry
  marked "eyebrow-grade" — resist using it in the eyebrow AND the note of the
  same section, which is two touches on one word.
- **`jargon-buster`'s `hindi` field is the wrong place on a money desk**, even
  though it is the one Hindi-by-design slot in the schema (see the first note
  above). A Hindi gloss hung on "token" or "per-token price" is a Hindi word
  standing on a term of art, which is exactly test 4. Leave the field off.
- **Earth can be a ZERO-word desk, and a storyboard may rule it so.** The
  lexicon lets earth use the awe words (*dharti, samundar, aasmaan*), but on
  the Amazon rewrite (2026-09-15) every candidate slot sat beside a threshold,
  a share or a unit, which is test 4, and the composer noted that the desk had
  spent its one licensed word (*jhoola*, in a dek) two days earlier on the
  el-niño rewrite. Repeating the device on the same desk inside a week reads
  as a tic rather than a register. An issue with no Hindi at all is a correct
  outcome; the Indian ground came from one sourced comparison (Delhi's area)
  and one habit (the monsoon, borrowed for half an analogy). *yaar / bhai /
  bro* are barred on earth as well as politics (tell 14).
- **Politics is a ZERO-word desk whenever the subject is a statute or a
  minority's legal status, and a storyboard may rule it so.** On the
  transgender-ratchet rewrite (2026-09-15) every candidate slot sat next to a
  section number, a date, a count or a legal term, which is test 4; and the
  register's own answer to a subject that invites heat is flatness, not warmth.
  A Hindi word there reads as levity about the thing being removed. The Indian
  ground came instead from the institutions (the district magistrate's office,
  the two Houses on named dates, the 2011 census) and from `lakh` as the native
  unit in a tile note and a penalty figure.
- **A statutory vocabulary list is NOT register Hindi, and it does not fire the
  check either.** The Act's own category list (*kinner, hijra, aravani, jogta*,
  plus its term *eunuch*) is a verbatim quotation of the law: set roman, never
  italic, never glossed warmly, and the offensive statutory term used exactly
  once, only because the statute uses it. A storyboard may warn of a Hindi false
  positive on such a card; there is none, because `check-prose` only counts
  tokens that are IN `hinglish-lexicon.md` or its always-on list, and none of
  those four words is. Verified 2026-09-15. Write the card so the sentence says
  the law *names* them, so the reader knows it is the statute talking.
- **The slot that keeps failing is the one that looks safest:** a tile `note`
  or a chart `caption` reads like prose but is the precision layer. Keep the
  whole `data-readout`, `benchmark-chart` and `match-stat-line` blocks
  English-only without thinking about it.

Related: [[component-data-shape-traps]].
