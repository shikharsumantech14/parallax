# Dossier check: <TITLE>

- **Category:** <category>
- **Dossier:** research/<category>/<date>-<slug>-dossier.md
- **Candidate:** <C-NN> (research/<category>/<date>-candidates.md)
- **Checked:** <YYYY-MM-DD>
- **Checker:** dossier-check-agent
- **Verdict:** CLEAN | CORRECTIONS | BLOCKED
- **Dossier rewritten:** yes, §10 added | no

> Created 2026-09-28 under `docs/COST-PLAN.md` CP-09. The check pass runs
> after every research run, whatever model swept, and before the storyboard.
> It recomputes every derived number from the inputs the dossier states,
> confirms the primary anchor behind each load-bearing fact, and lists every
> disagreement and every open `[UNVERIFIED]` item. It never adds a fact and
> never fetches.
>
> **The verdicts.**
> - `CLEAN`: every derived number reproduces, every load-bearing fact cites a
>   T0 to T2 anchor, the spread line matches its own count, every
>   `[UNVERIFIED]` names its resolution path. The dossier is not rewritten.
> - `CORRECTIONS`: something was wrong and is now fixed in the dossier (a
>   number, a spread line), or something is flagged that the storyboard can
>   work around. The corrected dossier carries a §10 listing every change.
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
- **Counted from §8:** N sources · N publishers · tiers … · top publisher N%
- **Floors:** ≥ 8 sources · ≥ 5 publishers · ≥ 3 tiers · no publisher above 40%
- **Result:** matches | corrected to <line> | misses a floor (<which>)

## 6. Changes made to the dossier

The same list is the dossier's `## §10 Check pass, <date>` section. Empty
when the verdict is CLEAN.

| # | Where (dossier §) | Was | Now | Why |
|---|---|---|---|---|

## 7. For the operator

Up to five lines, most important first: what to read before approving the
storyboard, and anything only the operator can rule on.
