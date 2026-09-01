# Project graph — GENERATED, DO NOT EDIT

> Written by `scripts/project-graph.mjs`. Hand-edits are blocked by a
> PreToolUse hook (CONTEXT-PLAN CD-09) and would be overwritten anyway.
> To change what this says, change the repo or the generator.
>
> **Repo-content facts only.** Volatile facts (branch, unpushed, dirty) live
> in `--brief` and are deliberately never committed (CD-11). Attested facts
> ("migration applied", "live smoke") cannot be computed here and stay
> authored in `docs/STATE-OF-PLAY.md`.

## Totals

| | |
|---|---|
| kinds | 97 |
| webgl | 14 |
| issues | 23 |
| published | 10 |
| blueprints | 36 |
| neverUsedAnywhere | 3 |
| neverInPublished | 77 |
| danglingDecisions | 8 |

## Section kinds

`wired` is the six automated registry places; ✗ marks a gap `check:catalog` would fail on.
`published` asks whether the kind has ever appeared in a non-draft issue.

| kind | component | catalog | explain | priority | webgl | blueprint | used | published |
|---|---|---|---|---|---|---|---|---|
| `hero` | — | ✓ | · | -1 |  |  | ✓ |  |
| `act-break` | — | ✓ | · | -1 |  |  |  |  |
| `timeline` | Timeline | ✓ | ✓ | 66 |  |  | ✓ | ✓ |
| `bill-breakdown` | BillBreakdown | ✓ | ✓ | 52 |  |  | ✓ | ✓ |
| `vote-result` | VoteResult | ✓ | ✓ | 88 |  |  | ✓ | ✓ |
| `seat-chart` | SeatChart | ✓ | ✓ | 54 |  |  | ✓ | ✓ |
| `comparison` | Comparison | ✓ | · | 48 |  |  | ✓ | ✓ |
| `paradox` | Paradox | ✓ | ✓ | 50 |  |  | ✓ | ✓ |
| `analogy` | BrothersAnalogy | ✓ | · | 34 |  |  | ✓ | ✓ |
| `quote` | Quote | ✓ | · | 40 |  |  | ✓ | ✓ |
| `beat-sheet` | BeatSheet | ✓ | · | 36 |  |  |  |  |
| `prose` | Prose | ✓ | · | 10 |  |  | ✓ | ✓ |
| `data-readout` | DataReadout | ✓ | ✓ | 70 |  |  | ✓ | ✓ |
| `orbital-shells` | OrbitalShells | ✓ | ✓ | 72 |  |  | ✓ | ✓ |
| `commit-grid` | CommitGrid | ✓ | ✓ | 58 |  |  | ✓ |  |
| `journey-map` | JourneyMap | ✓ | ✓ | 56 |  |  | ✓ |  |
| `match-stat-line` | MatchStatLine | ✓ | ✓ | 58 |  |  | ✓ |  |
| `elevation-profile` | ElevationProfile | ✓ | ✓ | 58 |  |  |  |  |
| `region-map` | RegionMap | ✓ | ✓ | 60 |  |  | ✓ |  |
| `climate-strip` | ClimateStrip | ✓ | ✓ | 64 |  |  | ✓ | ✓ |
| `carbon-gauge` | CarbonGauge | ✓ | ✓ | 64 |  |  | ✓ |  |
| `approval-chart` | ApprovalChart | ✓ | ✓ | 62 |  |  | ✓ |  |
| `power-matrix` | PowerMatrix | ✓ | ✓ | 56 |  |  | ✓ |  |
| `orbit-trace` | OrbitTrace | ✓ | ✓ | 60 |  |  | ✓ |  |
| `launch-stats` | LaunchStats | ✓ | ✓ | 62 |  |  | ✓ |  |
| `benchmark-chart` | BenchmarkChart | ✓ | ✓ | 62 |  |  | ✓ | ✓ |
| `adoption-curve` | AdoptionCurve | ✓ | ✓ | 62 |  |  | ✓ | ✓ |
| `route-card` | RouteCard | ✓ | ✓ | 56 |  |  | ✓ |  |
| `city-compare` | CityCompare | ✓ | ✓ | 56 |  |  | ✓ |  |
| `league-table` | LeagueTable | ✓ | ✓ | 62 |  |  | ✓ |  |
| `player-radar` | PlayerRadar | ✓ | ✓ | 72 |  |  | ✓ |  |
| `coalition-orbit` | CoalitionOrbit | ✓ | ✓ | 94 | ✓ |  | ✓ |  |
| `swing-dial` | SwingDial | ✓ | ✓ | 80 |  |  | ✓ |  |
| `bill-passage` | BillPassage | ✓ | ✓ | 78 |  |  | ✓ |  |
| `vote-flow` | VoteFlow | ✓ | ✓ | 80 |  |  | ✓ |  |
| `margin-ladder` | MarginLadder | ✓ | ✓ | 78 |  |  | ✓ |  |
| `chamber` | Chamber | ✓ | ✓ | 100 | ✓ | ✓ | ✓ |  |
| `power-flow` | PowerFlow | ✓ | ✓ | 92 |  | ✓ | ✓ |  |
| `coalition-calculus` | CoalitionCalculus | ✓ | ✓ | 86 |  | ✓ | ✓ |  |
| `gerrymander-lens` | GerrymanderLens | ✓ | ✓ | 80 |  | ✓ | ✓ |  |
| `ballot-flow` | BallotFlow | ✓ | ✓ | 80 |  | ✓ | ✓ |  |
| `bill-funnel` | BillFunnel | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `age-pyramid` | AgePyramid | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `orbit-globe` | OrbitGlobe | ✓ | ✓ | 96 | ✓ |  | ✓ |  |
| `trajectory-arc` | TrajectoryArc | ✓ | ✓ | 84 |  |  | ✓ | ✓ |
| `delta-v-ladder` | DeltaVLadder | ✓ | ✓ | 78 |  |  | ✓ |  |
| `signal-readout` | SignalReadout | ✓ | ✓ | 76 |  |  | ✓ | ✓ |
| `descent-profile` | DescentProfile | ✓ | ✓ | 84 |  |  | ✓ |  |
| `solar-system` | SolarSystem | ✓ | ✓ | 100 | ✓ | ✓ | ✓ |  |
| `constellation-swarm` | ConstellationSwarm | ✓ | ✓ | 90 | ✓ | ✓ | ✓ |  |
| `lagrange-map` | LagrangeMap | ✓ | ✓ | 82 |  | ✓ | ✓ |  |
| `transfer-window` | TransferWindow | ✓ | ✓ | 80 |  | ✓ | ✓ |  |
| `eclipse-cone` | EclipseCone | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `margin-bullets` | MarginBullets | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `data-globe` | DataGlobe | ✓ | ✓ | 96 | ✓ |  | ✓ |  |
| `core-sample` | CoreSample | ✓ | ✓ | 82 |  |  | ✓ |  |
| `sea-level-tank` | SeaLevelTank | ✓ | ✓ | 84 |  |  | ✓ |  |
| `climate-spiral` | ClimateSpiral | ✓ | ✓ | 90 |  |  | ✓ |  |
| `quake-depth` | QuakeDepth | ✓ | ✓ | 76 |  |  | ✓ |  |
| `terrain-relief` | TerrainRelief | ✓ | ✓ | 94 | ✓ | ✓ | ✓ |  |
| `plate-motion` | PlateMotion | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `atmosphere-column` | AtmosphereColumn | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `carbon-loop` | CarbonLoop | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `storm-track` | StormTrack | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `arch-stack` | ArchStack | ✓ | ✓ | 80 |  |  | ✓ |  |
| `latency-waterfall` | LatencyWaterfall | ✓ | ✓ | 82 |  |  | ✓ |  |
| `version-graph` | VersionGraph | ✓ | ✓ | 76 |  |  | ✓ |  |
| `scaling-plot` | ScalingPlot | ✓ | ✓ | 82 |  |  | ✓ | ✓ |
| `throughput-dial` | ThroughputDial | ✓ | ✓ | 76 |  |  | ✓ |  |
| `neural-flow` | NeuralFlow | ✓ | ✓ | 90 | ✓ | ✓ | ✓ |  |
| `packet-trace` | PacketTrace | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `queue-cliff` | QueueCliff | ✓ | ✓ | 82 |  | ✓ | ✓ |  |
| `chip-die` | ChipDie | ✓ | ✓ | 78 |  | ✓ | ✓ |  |
| `moore-ladder` | MooreLadder | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `state-timeline` | StateTimeline | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `route-globe` | RouteGlobe | ✓ | ✓ | 96 | ✓ |  | ✓ |  |
| `elevation-trek` | ElevationTrek | ✓ | ✓ | 76 |  |  | ✓ | ✓ |
| `itinerary-reel` | ItineraryReel | ✓ | ✓ | 74 |  |  | ✓ |  |
| `climate-calendar` | ClimateCalendar | ✓ | ✓ | 74 |  |  | ✓ |  |
| `timezone-arc` | TimezoneArc | ✓ | ✓ | 74 |  |  | ✓ |  |
| `terminator-globe` | TerminatorGlobe | ✓ | ✓ | 92 | ✓ | ✓ | ✓ |  |
| `city-grid` | CityGrid | ✓ | ✓ | 74 |  | ✓ | ✓ |  |
| `altitude-oxygen` | AltitudeOxygen | ✓ | ✓ | 62 |  | ✓ | ✓ |  |
| `season-wheel` | SeasonWheel | ✓ | ✓ | 74 |  | ✓ | ✓ |  |
| `fare-terrain` | FareTerrain | ✓ | ✓ | 62 |  | ✓ | ✓ |  |
| `attrition-waffle` | AttritionWaffle | ✓ | ✓ | 68 |  | ✓ | ✓ |  |
| `tactics-pitch` | TacticsPitch | ✓ | ✓ | 86 |  |  | ✓ | ✓ |
| `shot-map` | ShotMap | ✓ | ✓ | 86 |  |  | ✓ | ✓ |
| `xg-race` | XgRace | ✓ | ✓ | 86 |  |  | ✓ |  |
| `momentum-wave` | MomentumWave | ✓ | ✓ | 86 |  |  | ✓ |  |
| `player-card` | PlayerCard | ✓ | ✓ | 74 |  |  | ✓ |  |
| `flight-of-the-ball` | FlightOfTheBall | ✓ | ✓ | 92 | ✓ | ✓ | ✓ |  |
| `elo-river` | EloRiver | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `court-value` | CourtValue | ✓ | ✓ | 86 |  | ✓ | ✓ |  |
| `pace-ridge` | PaceRidge | ✓ | ✓ | 72 |  | ✓ | ✓ |  |
| `channel-ternary` | ChannelTernary | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `finish-interval` | FinishInterval | ✓ | ✓ | 68 |  | ✓ | ✓ |  |

## Never in a published issue — 77 of 97

The plan's argument for workstream B over Wave 2 rests on this number.
It is computed here rather than asserted.

`hero` · `act-break` · `beat-sheet` · `commit-grid` · `journey-map` · `match-stat-line` · `elevation-profile` · `region-map` · `carbon-gauge` · `approval-chart` · `power-matrix` · `orbit-trace` · `launch-stats` · `route-card` · `city-compare` · `league-table` · `player-radar` · `coalition-orbit` · `swing-dial` · `bill-passage` · `vote-flow` · `margin-ladder` · `chamber` · `power-flow` · `coalition-calculus` · `gerrymander-lens` · `ballot-flow` · `bill-funnel` · `age-pyramid` · `orbit-globe` · `delta-v-ladder` · `descent-profile` · `solar-system` · `constellation-swarm` · `lagrange-map` · `transfer-window` · `eclipse-cone` · `margin-bullets` · `data-globe` · `core-sample` · `sea-level-tank` · `climate-spiral` · `quake-depth` · `terrain-relief` · `plate-motion` · `atmosphere-column` · `carbon-loop` · `storm-track` · `arch-stack` · `latency-waterfall` · `version-graph` · `throughput-dial` · `neural-flow` · `packet-trace` · `queue-cliff` · `chip-die` · `moore-ladder` · `state-timeline` · `route-globe` · `itinerary-reel` · `climate-calendar` · `timezone-arc` · `terminator-globe` · `city-grid` · `altitude-oxygen` · `season-wheel` · `fare-terrain` · `attrition-waffle` · `xg-race` · `momentum-wave` · `player-card` · `flight-of-the-ball` · `elo-river` · `court-value` · `pace-ridge` · `channel-ternary` · `finish-interval`

## Decisions

`implemented by` counts files that DO something and name the ID: `src/`,
`app/`, `shared/`, `scripts/`, `.claude/hooks/`, `.claude/skills/`,
`.claude/settings.json`. Prose (docs, `.claude/rules/`) is cited, not
implementing.

**Zero is not an error, and it is not proof of absence.** It means either
*decided but not yet built* (RD-03, the deferred brand mark) **or**
*built by files that never name the ID* — TD-03 is cited in 30 blueprints
while the tokens implementing it carry no `TD-03` comment. This graph can
only see citations. Treat a zero as a question, never as a verdict.

| id | cited in | implemented by |
|---|---|---|
| **CD-01** | 7 files | 3 |
| **CD-02** | 7 files | 4 |
| **CD-03** | 3 files | 0 — _dangling_ |
| **CD-04** | 3 files | 0 — _dangling_ |
| **CD-05** | 3 files | 1 |
| **CD-06** | 2 files | 0 — _dangling_ |
| **CD-07** | 3 files | 1 |
| **CD-08** | 3 files | 0 — _dangling_ |
| **CD-09** | 6 files | 2 |
| **CD-10** | 3 files | 1 |
| **CD-11** | 6 files | 3 |
| **CD-12** | 10 files | 2 |
| **RD-01** | 10 files | 3 |
| **RD-01a** | 8 files | 5 |
| **RD-01b** | 36 files | 3 |
| **RD-02** | 5 files | 0 — _dangling_ |
| **RD-03** | 6 files | 2 |
| **RD-04** | 2 files | 0 — _dangling_ |
| **RD-05** | 11 files | 7 |
| **RD-06** | 3 files | 0 — _dangling_ |
| **RD-07** | 3 files | 1 |
| **RD-08** | 3 files | 1 |
| **RD-09** | 8 files | 1 |
| **TD-01** | 46 files | 10 |
| **TD-02** | 37 files | 7 |
| **TD-03** | 32 files | 2 |
| **TD-04** | 10 files | 8 |
| **TD-05** | 2 files | 0 — _dangling_ |
| **TD-06** | 10 files | 1 |

## Issues

| slug | topic | status | sections | kinds | sources |
|---|---|---|---|---|---|
| `2026-04-24-delimitation` | politics | published | 7 | 7 | 10 |
| `2026-04-24-kessler-cascade` | space | published | 8 | 7 | 12 |
| `2026-05-02-transgender-ratchet` | politics | published | 6 | 6 | 15 |
| `2026-05-03-earth-map-test` | earth | draft | 3 | 3 | 13 |
| `2026-05-03-el-nino-new-floor` | earth | published | 8 | 6 | 13 |
| `2026-05-03-politics-components` | politics | draft | 2 | 2 | 1 |
| `2026-05-03-space-components` | space | draft | 3 | 3 | 1 |
| `2026-05-03-sports-components` | sports | draft | 3 | 3 | 1 |
| `2026-05-03-tech-components` | tech | draft | 2 | 2 | 1 |
| `2026-05-03-travel-components` | travel | draft | 2 | 2 | 1 |
| `2026-05-15-seven-appeals-rupee-pressure` | politics | draft | 8 | 7 | 11 |
| `2026-06-03-earth-showcase` | earth | draft | 14 | 14 | 15 |
| `2026-06-03-politics-showcase` | politics | draft | 18 | 18 | 4 |
| `2026-06-03-space-showcase` | space | draft | 15 | 15 | 4 |
| `2026-06-03-sports-showcase` | sports | draft | 15 | 15 | 3 |
| `2026-06-03-tech-showcase` | tech | draft | 15 | 15 | 4 |
| `2026-06-03-travel-showcase` | travel | draft | 15 | 15 | 9 |
| `2026-06-04-ai-coding-token-bill` | tech | published | 7 | 6 | 7 |
| `2026-06-04-amazon-tipping-point` | earth | published | 7 | 6 | 8 |
| `2026-06-04-arsenal-set-piece-title` | sports | published | 7 | 6 | 6 |
| `2026-06-04-asteroid-2024-yr4` | space | published | 6 | 6 | 8 |
| `2026-06-04-cockroach-janta-party` | politics | published | 7 | 7 | 10 |
| `2026-06-04-queue-is-the-product` | travel | published | 7 | 6 | 11 |

