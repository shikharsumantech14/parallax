---
name: dossier-data-gaps
description: Recurring places where a dossier's data was too thin for the kind the story wanted — check these before proposing the kind
metadata:
  type: project
---

Dossiers written before the storyboard step existed (everything dated 2026-06
and earlier) captured **aggregates and totals**, not the per-observation series
the instrument kinds need. Assume the gap and check §4 before proposing.

**The pattern, by shape**

- **Time-series instruments are almost never available.** `xg-race` wants
  `{minute, team, xg}` per shot; `momentum-wave` wants a minute-indexed index;
  `elo-river` wants ≥6 dated ratings from a *named* model for 3–10 entities;
  `climate-spiral` wants a monthly series. Dossiers carry match totals and
  season totals. A series drawn from two totals is an invented series — and
  usually the issue's central number.
- **Modelled surfaces are never available.** `court-value`, `altitude-oxygen`,
  `finish-interval`, `pace-ridge` all require a named model plus either a
  per-observation sample or published percentiles. The catalog's capture notes
  forbid inventing a range around a published point estimate; the build fails
  on several of them anyway.
- **`attrition-waffle` fails more often than it fits.** It needs groups summing
  to exactly 100 *and* a real n. Dossiers give shares of a physical quantity or
  a part-season checkpoint with no denominator. The build throws on a bad sum.
- **`league-table` needs a table, not three standings facts.** "1st, four points
  clear, 89 points two seasons ago" is not played/won/drawn/lost/points.
- **Geographic kinds need per-zone values**, not one or two global shares.
- **Space geometry is blocked by one missing number, almost every time.** The
  whole G9 family turns on a quantity a pre-storyboard dossier never captured:
  `solar-system` wants the object's elements (a, e, i, Ω, ω, M0, period) plus
  the epoch M is quoted at, from JPL SBDB; `orbit-trace` wants `altKm` per named
  orbit; `eclipse-cone` wants three radii and two distances; `transfer-window`
  wants two radii and μ. A story whose only published geometry is a single miss
  distance has no drawable geometry at all, and the honest home for that one
  number is a `data-readout` tile or a `number-sense`. Say which single fetch
  would unblock the flagship — it is the highest-value research note a
  storyboard can leave behind. (asteroid-2024-yr4: one SBDB lookup would have
  bought `solar-system`.)

**The rule that keeps this honest:** when a kind is wanted and blocked, name it
in the composer notes with the exact `DATA` field that is missing and what
sourcing would unblock it ("an Opta per-shot timeline" / "a Copernicus ERA5
monthly fetch") — the operator then knows it is a research job, not a
composition failure. Both sibling storyboards and the arsenal one do this in a
dedicated "kinds considered and rejected" table, and it is the section the
operator reads.

**A second, subtler gap: allowlist provenance, not just presence.** A dated fact
can be in the dossier and still be off-allowlist. Do not build a `timeline` out
of dates the published issue deliberately never asserted — a rewrite adds no
sources, so importing four cross-checked-but-off-allowlist dates is the wrong
trade even though the data "exists".

**And the mirror of it: a dossier's own "not on the allowlist" note is a claim
to CHECK, not a fact.** Pre-storyboard dossiers repeatedly wrote off a whole
class of primary because one well-known aggregator was off-list — e.g. "NALSA
is not on an allowlist domain (indiankanoon.org is not on the allowlist)" while
`sci.gov.in` sat on `research/_sources/politics.md` at T0 *twice*, and
"the Bill PDF would not parse" while `indiacode.nic.in` (bare acts and
amendments, T0) was never tried. Open the category's `_sources/<cat>.md` and
grep it against every §9 note that claims unavailability. On statute-dense
politics the four to check are `indiacode.nic.in`, `sci.gov.in`, `sansad.in`
and `prsindia.org`. When one is available and unfetched, that is the Arsenal
re-anchoring condition in its first form, and it is a **research ruling for the
operator** (it adds sources, which a rewrite may not) — so compose the spine so
that every claim depending on the unfetched primary is removed or bounded, then
state that the issue ships either way.

**A third: on-allowlist, in the bibliography, and still never put on the page.**
A rewrite's dossier §4 routinely carries a sourced comparison the published
issue chose not to assert — on the cockroach issue, "~2.5× the BJP's official
Instagram handle" (src-07, already in `sources[]`) against the published text's
bare "past the BJP's own Instagram handle". That figure is exactly what
`number-sense`'s `equals[]` needs and what the Indian-ground rule asks for.
It is **not** a data gap and **not** a research job: it is an operator ruling
about whether a rewrite may promote a bibliography fact to page copy. Compose
the spine without it, cost the row that would carry it, and make it ruling 1.

**A fourth: two figures from different dates are not a funnel.** The recurring
temptation on any application/approval/rejection record is `attrition-waffle`
or a derived rate. Check the *as-of* date on each figure before proposing
either: a numerator from one year over a denominator from another manufactures
a rate the record does not contain, and `attrition-waffle` additionally needs
groups summing to exactly 100 and throws at build time on a bad sum. Where the
record already carries somebody else's version of that comparison (an
activists' estimate, an analyst's share), **use the attributed one and compute
nothing** — it is weaker-looking and stronger. Name the forbidden arithmetic
explicitly in the storyboard's §5 so the drafter does not rediscover it.

**A fifth: a vote that produced no numbers blocks the whole G3/G7 vote family.**
A voice vote with a walkout gives `vote-result` no `for`/`against`/`required`
and `vote-flow` no per-bloc seats. That is the *event* producing no data, not
the research missing it, so no pass unblocks it and the honest form is
`bill-passage` (stages with a status) plus a caption that says "voice vote". Do
not let the storyboard assert the *absence* of a division either, unless the
House record was actually fetched.

**A post-2026-09-16 dossier inverts this whole file, and you should check which
kind you are holding before assuming a gap.** Researchers now capture DATA
against each proposed kind's catalog `DATA:` line, so a current dossier may
arrive with four or five drawn graphics already filled, the component source
already read (the indonesia-fire dossier settled `region-map`'s ISO-country
constraint by citing `RegionMap.astro` line numbers), and the unavailable kind
already killed with a named gap. When that happens the composer's job moves
from *finding* data to *auditing* it — the exposure shifts to the conversions
and the drawing rules, which is where an unsourced number now enters. Dossiers
dated 2026-06 and earlier still have the old gaps.

**`carbon-loop` has now been wanted and blocked THREE times, all three on
earth, and the blocker is always the same** (el-niño, amazon, indonesia-fire).
On the third it was the *dossier* that pre-emptively killed it and recommended
`power-flow` instead — which is the right swap and worth reaching for directly:
also never-published, no conservation constraint, and it accepts a flow table
with no reservoir sizes at all.

**The original note:** REGISTER-PLAN §8.1 names it for two different
issues, so expect to be asked. Its DATA needs ≥3 reservoirs with a **stock** and
≥4 **fluxes** in one conserved unit; dossiers carry *shares* of a flow (91/5/3/1
of the year's extra heat; "up to half the rainfall is recycled") and no
reservoir sizes at all. The clinching argument for the operator is the build:
`CarbonLoop.astro` conservation-checks every `role: 'store'` reservoir at build
and throws unless the imbalance is flagged as the point, so an invented payload
either fails the build or, worse, passes because the invented numbers happen to
balance. Say what would unblock it — a published balance table in one unit (for
a water cycle: ocean inflow, evapotranspiration, precipitation, runoff, plus
three stocks) — and move the beat to `three-steps`, which needs no number.

**A range is not a value, and the honest fix is a stated drawing rule.** Reported
science comes as bands ("17–18% cleared", "1.5–1.9°C", "3.7–4°C"). Text kinds
carry a band fine; every *drawn* kind wants a scalar. Do not take the midpoint —
that is a number nobody published, and on a hedged figure it is the exact error
class the operator watches for. Take **one edge, apply it to every mark in the
chart, and say so on the page** (the `sublabel` carries the band, the `plain`
line states the rule), choosing the edge that makes the issue's own claim
*weaker*. Where two allowlisted sources round differently, draw the figure they
both support and put the wider one in the `howToRead`. Make it an operator
ruling, because it is the one place a rewrite puts a new number on a page.

**Never make an `[UNVERIFIED]` graphic the hero, even when the dossier nominates
it.** A dossier can pre-capture a kind's full DATA payload and still flag the
figures as unconfirmed, with its own §9 saying to cut the graphic if they do not
confirm. That row cannot carry the argument: the hero is the one row a draft
must not lose. Give the hero to a row whose data is settled, keep the flagged
kind mid-spine, and write a **one-for-one contingency swap** into §8 — the kind
that comes back in, its word cost, and the resulting ledger — so an unconfirmed
check is a single edit rather than a re-composition. (iss-retirement: three
delta-v figures flagged, `benchmark-chart` demoted to row 5, `elevation-profile`
held in reserve at 1,087 words and 3 new kinds.)

**A ratio is not a value.** Where the record gives "2.5× X" but never X, the
ranked-bar kinds (`benchmark-chart`, `league-table`) stay unavailable even
after that ruling: dividing an approximate range by an approximate multiple
manufactures false precision on the issue's most carefully hedged number. A
ratio's honest home is a `number-sense` `equals` line, whose `note` carries the
basis and which the verifier traces.

**A published PERCENTAGE blocks every flow kind, and no amount of arithmetic
unblocks it.** PRS reports a session as "the Lok Sabha functioned 15% of its
scheduled time" and Question Hour as "1%" — shares, not hours. `power-flow`
wants magnitudes in one unit, so turning 15% into hours needs the scheduled
hours, which PRS does not publish per session. Do not multiply a session's
sitting days by a nominal six-hour day to get there: that manufactures the
issue's headline quantity. The kind that *does* take shares against targets is
`margin-bullets` (value, max, required), and it is the right swap. Say the
unblocking fetch out loud — here, one Lok Sabha Secretariat productivity return
giving scheduled and lost hours by category — so the operator reads it as a
research job. (eleven-bills-fifteen-percent.)

**Check the ledger before believing a dossier calls a kind "new".** The
eleven-bills dossier proposed `bill-passage` as a never-published kind; it had
reached readers in the transgender-ratchet rewrite three days earlier and was
no longer on `PROJECT-GRAPH.md`'s list. A dossier's novelty claim is as of its
own write date, and in a twelve-issue round the ledger moves under it. Same
check in the other direction: grep every sibling storyboard in the round for
the kind before counting it toward the ≥ 2 floor — `bill-funnel` and
`margin-bullets` had both been *considered and rejected* by siblings, which
leaves them unclaimed, but a rejection and a claim read identically until you
open the file.

**`bill-passage` has no "skipped" status.** Its DATA enum is
`passed | failed | pending | current`, so a stage the House **bypassed** — the
committee referral that never happened — has no honest value. `failed` is the
nearest and it is a semantic compromise, not a match: it must be carried by a
mandatory `note` on that stage saying the stage did not occur. Settle it as an
operator ruling rather than letting the drafter pick.

See [[kind-fit-by-argument-shape]] for what was used instead.

---

## Read the component's render code, not its catalog line — three blockers the catalog does not mention

(half-indias-arrivals-are-indians, travel, 2026-09-21. Same lesson as the
2026-09-15 unread-field sweep, pointed the other way: there, fields documented
and never rendered; here, **hardcoded strings the catalog never documents**.)

- **`launch-stats` ships a hardcoded unit chip.** Line 40 emits
  `<b>launches / yr</b>` unconditionally — there is no `unit` prop. On a
  tourist-arrivals chart that reaches the reader as "launches / yr". Its
  `DEFAULT_COLORS` are space-palette literals too, though those are
  per-bar overridable. Cross-world kinds are allowed by policy; this one is
  not portable in fact.
- **`approval-chart` hardcodes a 0–100% axis and an Approve / Disapprove
  legend.** Any two-series count in absolute units is out.
- **`benchmark-chart` prints values raw.** `{it.value}` and
  `${refLabel} · ${refValue}` go to the DOM with no formatter, so `1804586`
  appears literally. **Author every value in the register's own unit —
  lakh — in the storyboard**, and say so in §2, or the drafter will paste the
  source's integers.

Also: `benchmark-chart` does **not** clip a reference line far above the bars.
`dataMax` folds `refValue` into the auto-max, so a 6x-larger reference lands at
~95% of the track and every bar becomes a stub. That is the argument drawn, not
a bug, but it only holds if `maxValue` is left unset — say that in the
storyboard as an authoring rule.

**A dossier can mix years inside one component payload.** This one set a 2025
`refValue` against 2024 country bars. Nothing flags it: both figures are
sourced, both are correct, and the chart still builds. Check that every mark in
a single graphic comes from the same reporting year before accepting a
pre-captured payload.

---

## Chart labels cost no name slots — settled from the code

(premier-league-squad-cost-ratio, sports, 2026-09-21.)

`check-prose.mjs` ~l.400 scans a section's body fields plus `title` / `hook` /
`dek` / `primer` / `caption` **only**. A `label` or `name` inside a component
payload is never scanned, so a seven-club `scaling-plot` and a seven-club
`channel-ternary` spend **zero** of the twelve-name ration. On a club-dense or
lab-dense subject this is the difference between an impossible spine and a
comfortable one. Two honest caveats to write into the storyboard rather than
quietly bank: the reader still *meets* every one of those names on the page, and
the `tactics-pitch` trap is still live in the other direction (the **verifier**
objects to a named player the source does not anchor, and that check does not
care what the name counter scans).

**A derived ratio that nobody filed is a mandatory-caveat row, not a blocked
one.** This dossier computed squad-cost-over-revenue itself because no club
files an SCR, and flagged it. That is publishable — but every surface of that
row (axis label, `caption`, `plain`, `howToRead`) must say the number is wages
plus amortisation over revenue and must never call it "the Squad Cost Ratio".
Carry the dossier's own wording forward verbatim into the storyboard so the
drafter cannot paraphrase the caveat away.

**No FX rate in the dossier bars every ₹ bracket, including the comparisons you
want most.** Every £ figure here was historical (contract §3 rule 4 forbids
converting those anyway), and the one current-ish figure — a per-point sanction
— had no sourced rate. Consequence for composition: `number-sense` becomes
unavailable, because its `equals[]` line for an Indian reader would have to be
in rupees. Name it in §8 as cut by the missing rate, not by the data, and bar
the drafter from manufacturing a £→₹ comparison.

**A vote whose split is `[UNVERIFIED]` blocks `vote-result` even when the
outcome is certain.** The rule passed; the reported 14–6 was single-sourced. The
honest substitute is the *threshold* (14 of 20 required), which is a sentence
and needs no kind. Sibling of the voice-vote note above: the G3 vote family
needs the numbers, not the result.
