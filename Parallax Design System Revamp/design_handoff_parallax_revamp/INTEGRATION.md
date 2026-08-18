# Integration: 28 new section kinds

> Implementation contract for the Parallax revamp component work.
> Start at `AGENTS.md`; this file is the scope and the specification index.

## Overview

The design work produced **60 data instruments** across the six worlds, ten per
world, each carrying the full explainability contract (subject · how-to-read ·
labelled axes with units · legend · live readout · plain-terms line · source).

**32 of those 60 map onto section kinds this repo already has.** The delta —
and the entire scope of this handoff — is **28 new kinds**, taking
`SECTION_KINDS` from 90 to 118.

## About the design files

The instruments were prototyped as Design Components (`.dc.html`) in a
different runtime. **They are design references, not production code, and they
are deliberately not in this bundle** — copying their markup would fight this
repo's Astro + vanilla-island conventions.

What you implement from:

| Artifact | Role |
|---|---|
| `blueprints/<world>/<kind>.md` | the contract — schema, geometry, motion, colour, fallback, interaction, budget, acceptance |
| `screenshots/<kind>.png` | the visual reference |
| `registry/*` | paste-ready diffs for the five registry moves |
| `mdx/<kind>.mdx` | a real, copy-pasteable example payload |
| `brand/*.svg` | the 38 brand assets |
| `README.md` | background: size system, explainability contract, mark construction |

## Fidelity

**High fidelity.** Colours, type roles, spacing, axis treatments, interaction
states and copy are final and specified to the value. Two caveats:

1. **Type.** The prototypes are set in Literata. This repo retired per-world
   display faces on 2026-06-21 for a single trio (Fraunces / Schibsted Grotesk /
   JetBrains Mono). Apply `TYPE-MAPPING.md` — do not reproduce Literata.
2. **Colour is given as tokens**, not the prototype's literal hexes. The
   prototypes hard-code hexes because that runtime had no token layer; the
   blueprints translate every one back to `--ink` / `--accent` / `--rule`.
   Trust the blueprint, not a pixel-picker on the screenshot.

## The 28 kinds

### politics (5)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `majority-flow` | `MajorityFlow.astro` | `px-mfl` | seats → bloc → can-it-legislate, with a load-bearing-partner counterfactual |
| `rank-bump` | `RankBump.astro` | `px-bmp` | finishing position across elections; distance is places, not votes |
| `bill-funnel` | `BillFunnel.astro` | `px-fnl` | many bills surviving each procedural stage |
| `age-pyramid` | `AgePyramid.astro` | `px-pyr` | a body's composition by age band and sex, counts or shares |
| `turnout-margin` | `TurnoutMargin.astro` | `px-tmg` | two numbers over time as a path that can double back |

### space (4)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `mission-timeline` | `MissionTimeline.astro` | `px-mtl` | phases on one clock, where the decisive phase is 0.02% of it |
| `porkchop-grid` | `PorkchopGrid.astro` | `px-pkc` | every departure×arrival pairing, banded by Δv cost |
| `debris-histogram` | `DebrisHistogram.astro` | `px-dbh` | size-binned population on a log axis, trackable vs not |
| `margin-bullets` | `MarginBullets.astro` | `px-mbl` | subsystem margins each in its own unit against its requirement |

### earth (4)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `river-multiples` | `RiverMultiples.astro` | `px-rmu` | many series, each panel self-scaled, comparing shape not size |
| `heat-uptake` | `HeatUptake.astro` | `px-hup` | stacked reservoirs, absolute or share — the split holds while the total triples |
| `glacier-dumbbell` | `GlacierDumbbell.astro` | `px-gdb` | then-vs-now per entity, sortable by absolute or relative loss |
| `rain-calendar` | `RainCalendar.astro` | `px-rcl` | 365 daily cells — how a total hides its concentration |

### tech (5)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `flame-graph` | `FlameGraph.astro` | `px-flm` | where CPU time goes; width = total, depth = call stack |
| `latency-ridge` | `LatencyRidge.astro` | `px-lrg` | response-time distribution per release, with the tail as a first-class number |
| `service-arcs` | `ServiceArcs.astro` | `px-svc` | who calls whom on one line; arcs below the line are cycles |
| `revenue-mosaic` | `RevenueMosaic.astro` | `px-mos` | column width × block height = real money |
| `state-timeline` | `StateTimeline.astro` | `px-stl` | per-service health lanes plus the incident clock |

### travel (5)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `attrition-waffle` | `AttritionWaffle.astro` | `px-waf` | 100 countable squares — a rate you can audit |
| `fare-spread` | `FareSpread.astro` | `px-fsp` | per-month fare distribution: the month is the spread, not the price |
| `price-swarm` | `PriceSwarm.astro` | `px-swm` | every observation as a dot, mean vs median marked |
| `route-criteria` | `RouteCriteria.astro` | `px-pcd` | five axes in five units; every line crosses every other |
| `daylight-band` | `DaylightBand.astro` | `px-dbn` | sunrise/sunset band — thickness is hours, position is when |

### sports (5)
| Kind | Component | Prefix | What it shows |
|---|---|---|---|
| `knockout-bracket` | `KnockoutBracket.astro` | `px-brk` | a draw where line weight is pre-match odds |
| `volume-accuracy` | `VolumeAccuracy.astro` | `px-qad` | two rates against their averages, quadrant-labelled |
| `goal-clock` | `GoalClock.astro` | `px-gcl` | per-block counts plus the cumulative share on a second axis |
| `channel-ternary` | `ChannelTernary.astro` | `px-trn` | three shares that must total 100 |
| `finish-interval` | `FinishInterval.astro` | `px-fiv` | projected position with a 90% interval; overlaps mean undecided |

## Interactions

19 of the 28 are static build-time renders. Nine carry exactly one control,
following `coalition-calculus`'s reader-agency pattern — data at rest, one
chip-set or scrubber, an `aria-live` readout, keyboard-complete, and a no-JS
print edition that paints the default state. Per-kind detail is blueprint §8.

| Kind | The one control |
|---|---|
| `majority-flow` | select a group → counterfactual readout |
| `porkchop-grid` | hover/focus a cell → Δv + flight time |
| `heat-uptake` | absolute ↔ share |
| `glacier-dumbbell` | sort by share ↔ absolute |
| `age-pyramid` | counts ↔ share of band |
| `fare-spread` | select month |
| `latency-ridge` | select release |
| `rain-calendar` | hover/focus a day |
| `daylight-band` | latitude preset |

## State management

No global state. Each interactive kind holds one local index or enum, hydrated
from a `data-` attribute already present in the painted HTML, and writes only
to its own readout node via `aria-live="polite"`. No fetching — all payloads
are build-time `section.data`.

## Design tokens

No new tokens. All 28 use the existing six-world set from
`shared/design/tokens.css`: `--ink`, `--ink-soft`, `--paper`, `--rule`,
`--accent`, `--accent-deep`, `--accent-alt`. Per-element opacities are in each
blueprint §6. Radii are 0 everywhere; borders are 1px hairline or a 4px
single-edge accent strip; no drop shadows.

Fixed non-themeable encodings (declared with reasons in the relevant §6):
`state-timeline` health colours, `porkchop-grid` Δv bands, `rain-calendar`
rainfall bands, `margin-bullets` pass/short.

## Assets

`brand/` — 38 SVGs (mark and its six world cuts, seals, covers, favicon, app
icon, avatar, watermark, end mark, lockups, banners, six video overlays). No
raster assets, no photographs.

## Files

- `AGENTS.md` — start here; registry duty, order of work, definition of done
- `COLLISIONS.md` — the five adjacent-kind adjudications
- `TYPE-MAPPING.md` — Literata → Fraunces / Schibsted Grotesk / JetBrains Mono
- `blueprints/<world>/<kind>.md` — 28 contracts
- `registry/` — `SECTION_KINDS.diff.md`, `catalog-blocks.md`,
  `explainers.entries.ts`, `SectionBody.diff.md`
- `mdx/<kind>.mdx` — 28 example payloads
- `screenshots/<kind>.png` — 28 visual references
- `README.md` — design-system background (size system, contract, mark)
