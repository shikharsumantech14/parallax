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

See [[kind-fit-by-argument-shape]] for what was used instead.
