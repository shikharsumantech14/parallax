# Dossier check: <TITLE>

- **Category:** <category>
- **Dossier:** research/<category>/<date>-<slug>-dossier.md
- **Candidate:** <C-NN> (research/<category>/<date>-candidates.md)
- **Checked:** <YYYY-MM-DD>
- **Checker:** dossier-check-agent
- **Verdict:** CLEAN | CORRECTIONS | BLOCKED
- **Corrections:** <N> in §6, for the script to apply | none

> Created 2026-09-28 under `docs/COST-PLAN.md` CP-09. The check pass runs
> after every research run, whatever model swept, and before the storyboard.
> It recomputes every derived number from the inputs the dossier states,
> confirms the primary anchor behind each load-bearing fact, and lists every
> disagreement and every open `[UNVERIFIED]` item. It never adds a fact and
> never fetches. Since the trial issue (COST-PLAN §12.5) it never writes the
> dossier either: its corrections go in §6 as one JSON block, and the
> pipeline applies them.
>
> **The verdicts.**
> - `CLEAN`: every derived number reproduces, every load-bearing fact cites a
>   T0 to T2 anchor, the spread line matches its own count, every
>   `[UNVERIFIED]` names its resolution path. §6 carries an empty list and the
>   dossier is not touched.
> - `CORRECTIONS`: something was wrong and §6 carries its fix (a number, a
>   spread line), or something is flagged that the storyboard can work
>   around. The pipeline applies §6 to the dossier and appends a
>   `## §N Check pass, <date>` section listing every change.
> - `BLOCKED`: a load-bearing fact has no source, two sources disagree on a
>   number the argument turns on and the dossier gives no way to choose, a
>   number the argument turns on cannot be reproduced or corrected from the
>   stated inputs, or the spread misses a floor. The operator rules before the
>   storyboard runs.

---

## 1. Derived numbers, recomputed

Every division, share, difference, sum, rate and conversion in the dossier,
recomputed from the inputs the dossier states beside it. A number whose
inputs the dossier does not state is not guessed at: it is listed with the
result `inputs not stated`.

| # | Where (dossier §) | As written | Inputs and formula, as the dossier states them | Recomputed | Result |
|---|---|---|---|---|---|
| 1 | §4.2 | <value> | <a> ÷ <b> | <value> | reproduces / corrected / inputs not stated |

## 2. Anchors behind the load-bearing facts

Every fact the structural argument (§1) or a captured component dataset (§4)
rests on, with the source the dossier cites for it and that source's tier
(from the dossier's §8 tags and the allowlist).

| # | Fact (dossier §) | Cited source | Tier | Result |
|---|---|---|---|---|
| 1 | <fact> | <publisher, URL> | T0 | anchored / journalism only / no source |

## 3. Where sources disagree

| # | What | Source A says | Source B says | The dossier should carry | Why |
|---|---|---|---|---|---|

(Empty table: no disagreements found.)

## 4. `[UNVERIFIED]` items

| # | Item (dossier §) | Resolution path stated? | Note |
|---|---|---|---|

## 5. The spread line

- **As written in §8:** <the dossier's line>
- **Counted from §8:** N sources · N publishers · tiers … · top publisher N%, or, with an official record above 40% set aside, N sources · N publishers + 1 official record (<publisher>, N rows) · tiers … · top non-official publisher N%
- **Floors:** ≥ 8 sources · ≥ 5 publishers · ≥ 3 tiers · no publisher above 40%. Amended 2026-09-28 by the operator's ruling: an official-record publisher, one whose domain sits at T0 on the desk's allowlist, sits outside the 40% ceiling and counts once, provided at least five other publishers are cited.
- **Result:** matches | corrected to <line> | misses a floor (<which>)

## 6. Corrections for the dossier

One fenced `json` block, and nothing else in this section: the pipeline reads
it and applies it, so it is data, not a table. Its shape is
`{"corrections":[{"section":"§4.2","was":"…","now":"…","why":"…"}]}`, one
object per correction, and the list is empty (`{"corrections":[]}`) when the
verdict is CLEAN.

- `section`: the dossier § the text sits in, e.g. `§4i`.
- `was`: the dossier's text, copied character for character from the
  inlined DOSSIER block, markdown (`**`, backticks, `|`) and symbols
  (`→ ÷ × £ ₹`) included. It must occur exactly once in the dossier: take the
  whole table cell or the clause around the number, and add neighbouring
  words until nothing else in the dossier matches. Text that runs over a
  line break is written on one line with single spaces, and the pipeline
  matches it across the wrap. A `was` found nowhere, or found more than
  once, is refused and left for the operator.
- `now`: the same text with only the wrong value changed. Every URL, quote
  and `[UNVERIFIED]` marker in `was` stays in `now`, and no correction
  touches a heading line.
- `why`: one line, the inputs and the formula.

The block must be valid JSON: write every `"` inside a string as `\"` and
every backslash as `\\`. The pipeline replaces each `was` with its `now`,
refuses the ones it cannot place, appends `## §N Check pass, <date>` to the
dossier with a row for every change (N is the next free number: §10 on a
first pass, §12 after a §11 top-up), and runs the dossier guard before it
writes. A flag belongs in §1 to §5, never here: §6 changes the dossier.

## 7. For the operator

Up to five lines, most important first: what to read before approving the
storyboard, and anything only the operator can rule on.
