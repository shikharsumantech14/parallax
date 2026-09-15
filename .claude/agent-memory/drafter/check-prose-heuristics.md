---
name: check-prose-heuristics
description: How check-prose.mjs's name, jargon and foreign-anchor heuristics actually fire — the traps that make a clean draft flag, and the cheap authoring moves that avoid them
metadata:
  type: project
---

The gate's thresholds are documented; its *heuristics* are not, and each one
below cost a re-draft of a field that was already correct.

**Why:** `scripts/check-prose.mjs` scores strings, not meaning. Three of its
checks fire on shapes a careful writer produces by accident.

**How to apply:**

- **The name heuristic counts hyphenated compounds whole.** `NAME_STOP` has
  `Earth`, but the token `Earth-impact` does not match it, so
  "Earth-impact odds" in a caption or a body string mints a distinct name and
  spends a slot. Keep the proper noun bare in any counted field
  ("the odds of an Earth impact"); the hyphenated form is safe only in
  `label` / `eyebrow` / `term`, which the name loop skips.
- **`NAME_STOP` is case-sensitive.** An ALL-CAPS `data-readout` grid header
  such as `"ASTEROID 2024 YR4 · KEY FIGURES, DEC 2024 – MAR 2026"` mints
  "KEY FIGURES DEC" and "MAR" as two names, because `Dec`/`Mar` are in the stop
  set and `DEC`/`MAR` are not, and the multi-word extender keeps eating
  capitalised tokens. Author the header in **mixed case** — the CSS carries the
  uppercase if the kind wants it, and the heuristic reads what you authored.
- **Which fields the name loop reads:** body strings plus `title`, `hook`,
  `dek`, `primer`, `caption` — and `title` matches *section* titles too, not
  just the head. It skips `eyebrow`, `label`, `unit`, `term`, `meaning`,
  `attribution` and `annotations[].text`. So a name parked in a tile label or
  a quote attribution is free to the gate (but still counts against the
  contract's twelve, which is the real ceiling).
- **A sentence's first token is never a name.** The loop starts at index 1, so
  `"NASA's own sentence for what changed"` and `"ESA: more than 20,000 km."`
  cost nothing. The flip side is a real trap: a person named at the head of a
  sentence spends the slot on the token at index 1, so `"Simon Willison, the
  developer who…"` mints the bare surname **"Willison"** while
  `"The developer Simon Willison, who…"` mints the correct `"Simon Willison"`.
  Put an article or a role noun in front of any person you name.
- **`steps[].title` on `three-steps` IS name-scanned** — the loop reads
  `s.key === 'title'`, which matches a section title and a data `title` alike.
  `label`, `term`, `meaning` and `annotations[].text` are not, which is why
  institution names ride free on timeline labels, bar labels and point labels.
  Park "OpenAI", "Anthropic" and every model name there rather than in prose.
- **Month names, weekday names, `That`/`This`/`You`/`Four` and the imperative
  openers (`Think`, `Look`, `Press`, `Read`) are all in `NAME_STOP`** in their
  mixed-case form. The caps trap from the `data-readout` header stands: the
  stop set is case-sensitive, so sentence case in a counted field is free and
  ALL CAPS is not.
- **The head is the first string, so a term of art in the PRIMER is the first
  use** — and a primer that merely *states* the definition still has no gloss
  marker. "Low Earth orbit runs 160 to 2,000 km up." flags; "Low Earth orbit:
  the band 160 to 2,000 km up." passes on the colon, which contract §6 tell 1
  explicitly allows before a gloss. That one character is the cheapest repair
  in the whole gate, and it costs zero words against the 80-word floor.
- **An acronym in `jargon.md` is parsed as its own term with a
  case-sensitive match.** `"low Earth orbit (LEO)"` splits into `low Earth
  orbit` AND `LEO`, and terms of four characters or fewer are matched
  case-sensitively. So a `data-readout` grid header reading `"LEO OPS · …"`
  needs its own gloss *and* mints names (the caps trap above). Dropping the
  acronym from reader-facing copy retires both at once — `if (!m) continue`
  means an unused term is never checked.
- **A role phrase can be written to mint zero names.** The loop skips index 0,
  so `"ESA, the agency that counts what is in orbit, wrote this"` satisfies
  rule 9 for free, while `"ESA, Europe's space agency, …"` mints **"Europe"**
  at index 1 and spends a slot on a continent. On an issue sitting at the
  twelve-name ceiling, prefer a role phrase built from common nouns over one
  built from a place or a parent body.
- **JARGON-UNGLOSSED fires on the FIRST occurrence in `strings` order**, and
  `strings` runs head → then per section eyebrow, title, intro, plain,
  howToRead, caption, skimCaption, source, then `data`. That means a **section
  title containing the term of art is read before the `jargon-buster` entry
  that defines it**, and the title has no gloss marker, so the section built to
  gloss the term is the section that trips the flag. Keep the term out of the
  title of the section that defines it.
- **A good plain definition often has no gloss marker.** `GLOSS_MARKERS` wants
  a dash, colon, open paren, *matlab*, *that means*, *which means*, *which is*,
  *in other words*, *in plain terms*, *think of it*, *that is*, *i.e.*,
  *called* or *known as* within the **two sentences** after the term. A
  `jargon-buster` meaning like "The odds the rock hits us, written as a
  percentage." passes nothing. The cheapest compliant repair is a second
  sentence opening **"That is …"** — it reads naturally and matches.
- **FOREIGN-ANCHOR ⚠️ matches the word `miles`, never the abbreviation `mi`.**
  A published figure written `13,200 mi (21,200 km)` is clean; expanding it to
  "13,200 miles" flags. Another reason a rewrite copies rather than retypes.
- **NUMBER-DENSE and the sentence-rhythm stats read only `body` strings** —
  `intro`, `skimCaption`, and the data keys `lead, paragraphs, followup,
  detail, body, punchline, statement, note, desc, text, kicker, headline,
  bullets`. A `caption` or a `label` can carry four numerals without a flag;
  a tile `note` or a timeline `note` cannot carry three.
- **ℹ CHROME-HEAVY is structural, not a defect.** The threshold is five text
  blocks of ≥ 4 words. Any six-tile `data-readout` (~11 blocks) and any
  three-row `number-sense` carrying the blueprint's `equals[].note` bases
  (~11 blocks) exceed it, exactly as every `timeline` does. Say so in the
  summary rather than cutting a traced note to silence an ℹ.
- **The head is read in a FIXED order — `title`, `dek`, `hook`, `primer` — and
  JARGON-UNGLOSSED fires on the first hit in that order.** The composer will
  often plan the gloss as the primer's first sentence and put the same term in
  the dek, which sits two slots earlier. The dek then owns the first use, has
  no gloss marker in the two sentences after it, and the issue flags on the one
  term it was built to explain. Either keep the term out of the dek entirely
  (write "unit" where the dek means "token" and let the primer say "a token is
  the unit AI bills by") or give the dek its own marker. A colon before the
  gloss is the cheapest legal marker and the contract explicitly allows a colon
  there.
- **A possessive in front of a proper noun mints a THIRD name.** The extender
  strips `'s` before testing, so `"Brazil's Amazon"` produces the single name
  **"Brazil Amazon"**, distinct from both "Brazil" and "Amazon", and
  `"Brazilian Amazon"` produces "Brazilian Amazon" (`NAME_STOP` has `Indian`
  but no other demonym). Two capitalised words in a row are always one name.
  Write "clearing in Brazil", or park the possessive form in a `label`, which
  the name loop skips.
- **A gloss marker inside the two-sentence window can be a colon you were
  going to write anyway.** The cheapest legal first use of a term of art is
  `"…against the tipping point: the state past which the forest cannot recover
  on its own."` — one character, no extra words, and contract §6 allows a
  colon before a gloss. Note the window is measured from the term's match
  index, so the marker must come AFTER the term, not before it.
- **A bare YEAR can be a jargon term, and the politics desk has one: `2014`.**
  The jargon loader splits each row's first cell on `(` and `/`, so
  `NALSA (2014)` becomes TWO terms, `NALSA` **and** `2014`. `2014` is four
  characters, which puts it on the case-sensitive branch, and the regex
  `(^|[^A-Za-z])2014(?=[^A-Za-z]|$)` matches the bare numeral anywhere. So
  "In 2014 the Supreme Court said…" is an unglossed first use of a *term of art*
  unless a gloss marker falls in the two sentences after it. The repair is one
  character: put a colon after the clause that names the year
  ("In 2014 the Supreme Court settled it: you decide your own gender."), and
  keep the year out of the `dek`, which the head reads two slots before the
  hook. Avoid the acronym `NALSA` entirely and that half never fires either —
  an unused term is skipped (`if (!m) continue`). Check any jargon row written
  as `Name (Year)` for the same split before drafting.
- **A law-report citation trips NUMBER-DENSE and cannot be repaired.**
  `(2014) 5 SCC 438` is three numerals, and `sentences()` splits on `v.` +
  space + capital, so the citation always lands in one sentence with all three.
  A timeline `note` is a body key, so it is sentence-scored. The flag is
  cosmetic on a reference string; name it in the summary rather than mangling
  the citation. Parking the citation in a `label` would dodge it (labels are
  neither number-scored nor name-scanned), but a raw citation as a bolded
  timeline label reads badly.
- **A rewrite that CUTS a section always trips NUMBER-DRIFT**, and on a
  `status: published` file that flag is **❌, not ℹ** (the severity is chosen
  by status). It diffs numerals against `git show HEAD:` for the same path, so
  every figure inside a deleted section reads as "removed". When the storyboard
  rules a section out, name the expected drift in the summary — it is not
  avoidable and it is not a defect.

Related: [[word-budget-accounting]], [[component-data-shape-traps]].
