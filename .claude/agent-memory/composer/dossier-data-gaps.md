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

**A third: on-allowlist, in the bibliography, and still never put on the page.**
A rewrite's dossier §4 routinely carries a sourced comparison the published
issue chose not to assert — on the cockroach issue, "~2.5× the BJP's official
Instagram handle" (src-07, already in `sources[]`) against the published text's
bare "past the BJP's own Instagram handle". That figure is exactly what
`number-sense`'s `equals[]` needs and what the Indian-ground rule asks for.
It is **not** a data gap and **not** a research job: it is an operator ruling
about whether a rewrite may promote a bibliography fact to page copy. Compose
the spine without it, cost the row that would carry it, and make it ruling 1.

**A ratio is not a value.** Where the record gives "2.5× X" but never X, the
ranked-bar kinds (`benchmark-chart`, `league-table`) stay unavailable even
after that ruling: dividing an approximate range by an approximate multiple
manufactures false precision on the issue's most carefully hedged number. A
ratio's honest home is a `number-sense` `equals` line, whose `note` carries the
basis and which the verifier traces.

See [[kind-fit-by-argument-shape]] for what was used instead.
