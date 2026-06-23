# Parallax — social voice, learned heuristics

> **Auto-maintained.** The `voice-refiner` agent updates this file from real
> signals — post engagement (likes/reposts/replies), the diffs between what the
> social-writer generated and what the operator approved, and rejections. Every
> social-writing agent reads it alongside `_voice-social.md` and applies these on
> top of the base contract.
>
> **Format:** each entry is dated, states the heuristic, and cites the evidence
> behind it. The operator prunes anything that's noise — this stays curated, not
> a dumping ground. Conflicts: the most recent, best-evidenced entry wins; if a
> heuristic here contradicts a hard rule in `_voice-social.md`, the hard rule wins.

---

## Active heuristics

_None yet — cold start._ The engine needs a few weeks of posted threads + operator
edits before there's signal. Until then, write to `_voice-social.md` as-is.

<!--
Entry template (the refiner appends here):

### YYYY-MM-DD — <one-line heuristic>
**Do:** <the concrete instruction the writer should follow>
**Why / evidence:** <what in the data supports it — e.g. "the 4 question-hooks
averaged 3.1x the replies of the 6 statement-hooks over the last 30 days"; or
"operator shortened the hook in 7 of 8 approvals">
**Confidence:** low | medium | high
-->
