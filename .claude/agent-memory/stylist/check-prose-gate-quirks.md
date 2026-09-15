---
name: check-prose-gate-quirks
description: How scripts/check-prose.mjs actually measures an issue — which fields it scores as prose, and the three flags that are heuristic artifacts rather than writing faults
metadata:
  type: reference
---

# What `check:prose` really measures

Read `scripts/check-prose.mjs` before hand-counting an issue; the thresholds
table is at the top and the field classification is the part that surprises.

## Which fields get scored as body prose

Not "the prose fields". It is section `intro` + `skimCaption`, head
`hook`/`dek`/`primer`, and any `data` string whose **key** is one of
`lead, paragraphs, followup, detail, body, punchline, statement, note, desc,
text, kicker, headline, bullets`.

Consequences that bite:

- **`timeline` event `note`s are scored as prose sentences** (key `note`) and
  feed the issue's sentence mean / p95 / max. So do `bill-breakdown` card
  `body`s, `paradox` `detail`s and `statement`s, a `seat-chart`'s built-in
  `quote.text`, and `analogy` `headline` / `punchline`.
- **`data.quote` (the quote kind's verbatim text) is NOT scored** — key `quote`
  is not on the list. A verbatim quote therefore cannot break the rhythm caps.
  It **is** counted in `readerWords`, though (`quote` is not in `SKIP_KEYS`), so
  an unellipsed 44-word institutional sentence spends 44 of the 1,100 before the
  section's own copy starts. Budget the quote first, then the words around it.
  Neither are `analogy` `pairs[].this` / `.that` (keys `this` / `that`).
- `label`, `unit`, `attribution`, `caption`, `plain`, `howToRead`, `source` and
  anything under `annotations` are the **precision layer**: English-only, not
  sentence-scored.

## There are TWO cap layers, and only one of them is law

A storyboard sets its own per-row caps (`tile note ≤ 10 w`, `actually.text ≤ 20 w`,
`followup ≤ 24 w`, `paradox detail ≤ 36 w`) that are deliberately **tighter than
the gate's**. `check-prose.mjs` flags on its own numbers: tile note 15, timeline
note 20, paradox detail 45, intro 45, annotation 12, and the plain-language kinds'
own caps near the bottom of the section loop (`you-think` think/actually 30,
note 20). When a panel fix needs words, the gate cap is the ceiling you may
spend to and the storyboard cap is the budget you report having exceeded. Say
both numbers in the summary so the operator sees the overrun was priced, not
missed.

## `readerWords` is EVERY string, not the prose

The 1,100 ceiling counts every collected string: head fields, **every `eyebrow`
and section `title`**, `caption`, `source`, `plain`, `howToRead`, and every data
leaf whose key is not in `SKIP_KEYS` (`role, value, unit, x, y, at, side, date,
accent, emphasis, id, kind, state, layout…`). So a `shot-map`'s twenty
`outcome` strings cost twenty words, and a section's eyebrow + title cost ten
before a sentence is written.

Consequence for a light-touch pass: an issue measured at ~1,075 has room for
roughly one added sentence in the whole issue. Budget the delta before editing,
not after. `ISSUE-LONG` is ⚠️ (not ❌), so it warns rather than blocks the
gate — but it is still a finding on a published issue.

## Three flags that are artifacts, not faults — report, don't chase

1. **`NAME-THROUGHPUT`.** The proper-noun heuristic counts `MP`, `MPs`,
   `Prime Minister`, `Constitution` and state names as distinct "names", and it
   greedily glues list items into one entry ("Tamil Nadu Kerala and Andhra
   Pradesh"). An issue whose real people/organisation count is 8–10 can show 14.
   Never rewrite prose to game it; state the true count in the flag.
2. **`CHROME-HEAVY` (ℹ).** Fires at >5 text blocks of ≥4 words per section.
   `number-sense` and `timeline` exceed it from their DATA shape alone.
3. **`NUMBER-DRIFT`.** Diffs numerals against `git show HEAD:<path>`. On a
   Phase-4 rewrite of a published issue it fires ❌ on the whole rewrite, from
   the first uncommitted keystroke. It is not a signal about the styling pass —
   but it *is* the reason every styling edit must be punctuation-and-wording
   only, never a retyped figure.

## Words-before-the-first-graphic is a head budget, and it has three levers

The count is **head (title + hook + dek + primer) + section 1's `eyebrow` +
`title`**, stopping there only because section 1 is visual. Ceiling 80. On a
tight rewrite that number, not the 1,100, is the binding constraint: a panel
fix to the primer (naming a platform, restoring "satirical") is +2 and blows it.

Of the six contributors the stylist may touch exactly one by default — the
`primer`, which is **not** in the do-not-touch list while `title`, `hook`,
`dek`, `eyebrow` and the section title all are. So **the primer can only be
paid for out of the hook, and only when the launching agent has authorised a
hook rewrite.** Ask for that authorisation when a head fix is on the list;
without it the primer fix is unfundable and the honest answer is to flag it.
Where the hook and primer open on the same seven words (they often do — the
drafter reuses the published line), trimming the hook is free.

## The cheap, exact fixes

- **`NUMBER-DENSE`** (>2 numerals in one sentence): swap a semicolon for a full
  stop. Splits the sentence, keeps every word and every numeral.
- **`NO-CONNECTIVE`** (ℹ; fires only on `intro`/`lead`/`paragraphs`/`primer` at
  ≥25 words with >1 sentence): the regex accepts only
  `because | so | which means | but | that means | matlab | kyunki | lekin`.
  "and", "which", ";" and "—" do not count. A semicolon doing contrastive work
  becomes ", but".
- **`SENTENCE-MAX` / a 30-word intro**: replace the colon with a full stop and
  capitalise. Word count and numerals unchanged, mean halves.

See [[job-fit-judgements]].
