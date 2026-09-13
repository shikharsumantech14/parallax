---
name: word-budgets-that-bite
description: Word budgets that are harder to hold than the storyboard implies — the head/first-graphic cap, the name heuristic, and where skimCaption silently costs words
metadata:
  type: project
---

Three budgets that cost rewrites on the delimitation rewrite (2026-09-13).

**The 80-word "before the first graphic" cap includes section 1's eyebrow and
title.** A storyboard that budgets "head: 75 words" has already spent the cap,
because the gate adds the first section's `eyebrow` + `title` + `intro` on top
of title/dek/hook/primer. Budget the head at **≤ 72** and the first section's
eyebrow+title at **≤ 8** (e.g. `THE GAP` + a five-word title).
**Why:** the head is the last thing you write and the first thing that blows.
**How to apply:** count the head against 72, not 80, before drafting section 1.

**The ≤ 12 names cap is measured by a capitalised-token heuristic, not by
people.** It counts from the *second* token of each sentence, so a title or
caption that STARTS with "Uttar Pradesh" hides "Uttar" and exposes "Pradesh"
as its own name. It also counts `MP`, `MPs`, `Act`, `Census`, `Constitution`,
`Prime Minister` and `Lok Sabha` as names.
**Why:** a nine-section politics issue with eight authored names measured at
eleven to thirteen depending purely on where proper nouns sat in a sentence.
**How to apply:** keep proper nouns off sentence-initial position; lowercase
"census" and "law" where the sentence allows; a run of states separated by
"and" collapses into ONE entry, so naming three losers together is cheaper
than naming them in three sentences. See [[kind-data-shapes]].

**`skimCaption` renders only for `kind: prose`, but counts toward the 1,100
reader-word ceiling.** On a spine with zero prose sections and an authored
`story` block, nine skimCaptions cost ~200 words and reach no reader.
**Why:** the standing drafter instruction says author one per section; the
storyboard's own budget table excludes them, which is the tell.
**How to apply:** on a zero-prose spine with authored story beats, omit
`skimCaption` entirely and report it as a named departure.
