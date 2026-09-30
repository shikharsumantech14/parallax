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
| kinds | 87 |
| webgl | 10 |
| issues | 30 |
| published | 17 |
| blueprints | 39 |
| neverUsedAnywhere | 0 |
| neverInPublished | 50 |
| danglingDecisions | 9 |

## Section kinds

`wired` is the six automated registry places; ✗ marks a gap `check:catalog` would fail on.
`published` asks whether the kind has ever appeared in a non-draft issue.

| kind | component | catalog | explain | priority | webgl | blueprint | used | published |
|---|---|---|---|---|---|---|---|---|
| `act-break` | — | ✓ | · | -1 |  |  | ✓ | ✓ |
| `timeline` | Timeline | ✓ | ✓ | 66 |  |  | ✓ | ✓ |
| `bill-breakdown` | BillBreakdown | ✓ | ✓ | 52 |  |  | ✓ | ✓ |
| `vote-result` | VoteResult | ✓ | ✓ | 88 |  |  | ✓ | ✓ |
| `seat-chart` | SeatChart | ✓ | ✓ | 54 |  |  | ✓ | ✓ |
| `comparison` | Comparison | ✓ | · | 48 |  |  | ✓ | ✓ |
| `paradox` | Paradox | ✓ | ✓ | 50 |  |  | ✓ | ✓ |
| `you-think` | YouThink | ✓ | ✓ | 60 |  | ✓ | ✓ | ✓ |
| `analogy` | BrothersAnalogy | ✓ | · | 34 |  |  | ✓ | ✓ |
| `quote` | Quote | ✓ | · | 40 |  |  | ✓ | ✓ |
| `jargon-buster` | JargonBuster | ✓ | · | 30 |  | ✓ | ✓ | ✓ |
| `three-steps` | ThreeSteps | ✓ | · | 44 |  | ✓ | ✓ | ✓ |
| `prose` | Prose | ✓ | · | 10 |  |  | ✓ | ✓ |
| `data-readout` | DataReadout | ✓ | ✓ | 70 |  |  | ✓ | ✓ |
| `number-sense` | NumberSense | ✓ | ✓ | 68 |  | ✓ | ✓ | ✓ |
| `commit-grid` | CommitGrid | ✓ | ✓ | 58 |  |  | ✓ |  |
| `journey-map` | JourneyMap | ✓ | ✓ | 56 |  |  | ✓ |  |
| `match-stat-line` | MatchStatLine | ✓ | ✓ | 58 |  |  | ✓ | ✓ |
| `region-map` | RegionMap | ✓ | ✓ | 60 |  |  | ✓ | ✓ |
| `climate-strip` | ClimateStrip | ✓ | ✓ | 64 |  |  | ✓ | ✓ |
| `gauge` | Gauge | ✓ | ✓ | 76 |  |  | ✓ | ✓ |
| `approval-chart` | ApprovalChart | ✓ | ✓ | 62 |  |  | ✓ |  |
| `power-matrix` | PowerMatrix | ✓ | ✓ | 56 |  |  | ✓ | ✓ |
| `orbit-trace` | OrbitTrace | ✓ | ✓ | 60 |  |  | ✓ | ✓ |
| `launch-stats` | LaunchStats | ✓ | ✓ | 62 |  |  | ✓ |  |
| `benchmark-chart` | BenchmarkChart | ✓ | ✓ | 62 |  |  | ✓ | ✓ |
| `adoption-curve` | AdoptionCurve | ✓ | ✓ | 62 |  |  | ✓ | ✓ |
| `itinerary` | Itinerary | ✓ | ✓ | 66 |  |  | ✓ |  |
| `league-table` | LeagueTable | ✓ | ✓ | 62 |  |  | ✓ |  |
| `player-radar` | PlayerRadar | ✓ | ✓ | 72 |  |  | ✓ |  |
| `bill-passage` | BillPassage | ✓ | ✓ | 78 |  |  | ✓ | ✓ |
| `vote-flow` | VoteFlow | ✓ | ✓ | 80 |  |  | ✓ |  |
| `margin-ladder` | MarginLadder | ✓ | ✓ | 78 |  |  | ✓ | ✓ |
| `chamber` | Chamber | ✓ | ✓ | 100 | ✓ | ✓ | ✓ |  |
| `power-flow` | PowerFlow | ✓ | ✓ | 92 |  | ✓ | ✓ | ✓ |
| `coalition-calculus` | CoalitionCalculus | ✓ | ✓ | 86 |  | ✓ | ✓ |  |
| `gerrymander-lens` | GerrymanderLens | ✓ | ✓ | 80 |  | ✓ | ✓ |  |
| `bill-funnel` | BillFunnel | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `age-pyramid` | AgePyramid | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `trajectory-arc` | TrajectoryArc | ✓ | ✓ | 84 |  |  | ✓ |  |
| `delta-v-ladder` | DeltaVLadder | ✓ | ✓ | 78 |  |  | ✓ |  |
| `descent-profile` | DescentProfile | ✓ | ✓ | 84 |  |  | ✓ | ✓ |
| `solar-system` | SolarSystem | ✓ | ✓ | 100 | ✓ | ✓ | ✓ |  |
| `constellation-swarm` | ConstellationSwarm | ✓ | ✓ | 90 | ✓ | ✓ | ✓ |  |
| `lagrange-map` | LagrangeMap | ✓ | ✓ | 82 |  | ✓ | ✓ |  |
| `transfer-window` | TransferWindow | ✓ | ✓ | 80 |  | ✓ | ✓ |  |
| `eclipse-cone` | EclipseCone | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `margin-bullets` | MarginBullets | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `core-sample` | CoreSample | ✓ | ✓ | 82 |  |  | ✓ | ✓ |
| `sea-level-tank` | SeaLevelTank | ✓ | ✓ | 84 |  |  | ✓ |  |
| `climate-spiral` | ClimateSpiral | ✓ | ✓ | 90 |  |  | ✓ |  |
| `quake-depth` | QuakeDepth | ✓ | ✓ | 76 |  |  | ✓ |  |
| `terrain-relief` | TerrainRelief | ✓ | ✓ | 94 | ✓ | ✓ | ✓ |  |
| `plate-motion` | PlateMotion | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `atmosphere-column` | AtmosphereColumn | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `carbon-loop` | CarbonLoop | ✓ | ✓ | 66 |  | ✓ | ✓ |  |
| `storm-track` | StormTrack | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `arch-stack` | ArchStack | ✓ | ✓ | 80 |  |  | ✓ | ✓ |
| `latency-waterfall` | LatencyWaterfall | ✓ | ✓ | 82 |  |  | ✓ | ✓ |
| `version-graph` | VersionGraph | ✓ | ✓ | 76 |  |  | ✓ | ✓ |
| `scaling-plot` | ScalingPlot | ✓ | ✓ | 82 |  |  | ✓ | ✓ |
| `neural-flow` | NeuralFlow | ✓ | ✓ | 90 | ✓ | ✓ | ✓ |  |
| `packet-trace` | PacketTrace | ✓ | ✓ | 84 | ✓ | ✓ | ✓ |  |
| `queue-cliff` | QueueCliff | ✓ | ✓ | 82 |  | ✓ | ✓ |  |
| `chip-die` | ChipDie | ✓ | ✓ | 78 |  | ✓ | ✓ |  |
| `moore-ladder` | MooreLadder | ✓ | ✓ | 64 |  | ✓ | ✓ |  |
| `state-timeline` | StateTimeline | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `elevation-trek` | ElevationTrek | ✓ | ✓ | 76 |  |  | ✓ | ✓ |
| `climate-calendar` | ClimateCalendar | ✓ | ✓ | 74 |  |  | ✓ |  |
| `timezone-arc` | TimezoneArc | ✓ | ✓ | 74 |  |  | ✓ |  |
| `terminator-globe` | TerminatorGlobe | ✓ | ✓ | 92 | ✓ | ✓ | ✓ |  |
| `city-grid` | CityGrid | ✓ | ✓ | 74 |  | ✓ | ✓ |  |
| `altitude-oxygen` | AltitudeOxygen | ✓ | ✓ | 62 |  | ✓ | ✓ |  |
| `season-wheel` | SeasonWheel | ✓ | ✓ | 74 |  | ✓ | ✓ |  |
| `fare-terrain` | FareTerrain | ✓ | ✓ | 62 |  | ✓ | ✓ |  |
| `attrition-waffle` | AttritionWaffle | ✓ | ✓ | 68 |  | ✓ | ✓ | ✓ |
| `tactics-pitch` | TacticsPitch | ✓ | ✓ | 86 |  |  | ✓ | ✓ |
| `shot-map` | ShotMap | ✓ | ✓ | 86 |  |  | ✓ | ✓ |
| `xg-race` | XgRace | ✓ | ✓ | 86 |  |  | ✓ |  |
| `momentum-wave` | MomentumWave | ✓ | ✓ | 86 |  |  | ✓ |  |
| `player-card` | PlayerCard | ✓ | ✓ | 74 |  |  | ✓ |  |
| `flight-of-the-ball` | FlightOfTheBall | ✓ | ✓ | 92 | ✓ | ✓ | ✓ |  |
| `elo-river` | EloRiver | ✓ | ✓ | 76 |  | ✓ | ✓ |  |
| `court-value` | CourtValue | ✓ | ✓ | 86 |  | ✓ | ✓ |  |
| `pace-ridge` | PaceRidge | ✓ | ✓ | 72 |  | ✓ | ✓ |  |
| `channel-ternary` | ChannelTernary | ✓ | ✓ | 64 |  | ✓ | ✓ | ✓ |
| `finish-interval` | FinishInterval | ✓ | ✓ | 68 |  | ✓ | ✓ |  |

## Never in a published issue — 50 of 87

The plan's argument for workstream B over Wave 2 rests on this number.
It is computed here rather than asserted.

`commit-grid` · `journey-map` · `approval-chart` · `launch-stats` · `itinerary` · `league-table` · `player-radar` · `vote-flow` · `chamber` · `coalition-calculus` · `gerrymander-lens` · `bill-funnel` · `age-pyramid` · `trajectory-arc` · `delta-v-ladder` · `solar-system` · `constellation-swarm` · `lagrange-map` · `transfer-window` · `eclipse-cone` · `margin-bullets` · `sea-level-tank` · `climate-spiral` · `quake-depth` · `terrain-relief` · `plate-motion` · `atmosphere-column` · `carbon-loop` · `storm-track` · `neural-flow` · `packet-trace` · `queue-cliff` · `chip-die` · `moore-ladder` · `state-timeline` · `climate-calendar` · `timezone-arc` · `terminator-globe` · `city-grid` · `altitude-oxygen` · `season-wheel` · `fare-terrain` · `xg-race` · `momentum-wave` · `player-card` · `flight-of-the-ball` · `elo-river` · `court-value` · `pace-ridge` · `finish-interval`

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
| **CD-01** | 6 files | 3 |
| **CD-02** | 6 files | 4 |
| **CD-03** | 2 files | 0 — _dangling_ |
| **CD-04** | 2 files | 0 — _dangling_ |
| **CD-05** | 2 files | 1 |
| **CD-06** | 1 files | 0 — _dangling_ |
| **CD-07** | 4 files | 1 |
| **CD-08** | 4 files | 1 |
| **CD-09** | 5 files | 2 |
| **CD-10** | 2 files | 1 |
| **CD-11** | 5 files | 3 |
| **CD-12** | 12 files | 6 |
| **RD-01** | 9 files | 3 |
| **RD-01a** | 7 files | 5 |
| **RD-01b** | 42 files | 7 |
| **RD-02** | 4 files | 0 — _dangling_ |
| **RD-03** | 6 files | 2 |
| **RD-04** | 3 files | 0 — _dangling_ |
| **RD-05** | 22 files | 12 |
| **RD-06** | 5 files | 1 |
| **RD-07** | 3 files | 1 |
| **RD-08** | 7 files | 3 |
| **RD-09** | 6 files | 1 |
| **RD-10** | 14 files | 9 |
| **RD-11** | 5 files | 2 |
| **RD-12** | 6 files | 3 |
| **RD-13** | 5 files | 1 |
| **RD-14** | 5 files | 0 — _dangling_ |
| **RD-15** | 5 files | 0 — _dangling_ |
| **TD-01** | 44 files | 10 |
| **TD-02** | 36 files | 7 |
| **TD-03** | 31 files | 2 |
| **TD-04** | 9 files | 8 |
| **TD-05** | 5 files | 3 |
| **TD-06** | 18 files | 5 |
| **TD-07** | 2 files | 0 — _dangling_ |
| **TD-08** | 2 files | 0 — _dangling_ |
| **TD-09** | 13 files | 10 |

## Issues

| slug | topic | status | sections | kinds | sources |
|---|---|---|---|---|---|
| `2026-04-24-delimitation` | politics | published | 9 | 9 | 10 |
| `2026-04-24-kessler-cascade` | space | published | 8 | 8 | 12 |
| `2026-05-02-transgender-ratchet` | politics | published | 9 | 9 | 18 |
| `2026-05-03-earth-map-test` | earth | draft | 3 | 3 | 13 |
| `2026-05-03-el-nino-new-floor` | earth | published | 9 | 8 | 15 |
| `2026-05-03-politics-components` | politics | draft | 2 | 2 | 1 |
| `2026-05-03-space-components` | space | draft | 2 | 2 | 1 |
| `2026-05-03-sports-components` | sports | draft | 3 | 3 | 1 |
| `2026-05-03-tech-components` | tech | draft | 2 | 2 | 1 |
| `2026-05-03-travel-components` | travel | draft | 2 | 2 | 1 |
| `2026-05-15-seven-appeals-rupee-pressure` | politics | draft | 8 | 6 | 11 |
| `2026-06-03-earth-showcase` | earth | draft | 15 | 15 | 15 |
| `2026-06-03-politics-showcase` | politics | draft | 17 | 17 | 4 |
| `2026-06-03-space-showcase` | space | draft | 13 | 13 | 4 |
| `2026-06-03-sports-showcase` | sports | draft | 16 | 16 | 3 |
| `2026-06-03-tech-showcase` | tech | draft | 15 | 15 | 4 |
| `2026-06-03-travel-showcase` | travel | draft | 15 | 14 | 9 |
| `2026-06-04-ai-coding-token-bill` | tech | published | 9 | 9 | 7 |
| `2026-06-04-amazon-tipping-point` | earth | published | 8 | 8 | 8 |
| `2026-06-04-arsenal-set-piece-title` | sports | published | 9 | 9 | 11 |
| `2026-06-04-asteroid-2024-yr4` | space | published | 6 | 6 | 8 |
| `2026-06-04-cockroach-janta-party` | politics | published | 9 | 9 | 10 |
| `2026-06-04-queue-is-the-product` | travel | published | 8 | 8 | 11 |
| `2026-09-21-eleven-bills-fifteen-percent` | politics | published | 0 | 0 | 15 |
| `2026-09-21-half-indias-arrivals-are-indians` | travel | published | 9 | 9 | 21 |
| `2026-09-21-indonesia-fire-burns-soil-not-trees` | earth | published | 9 | 9 | 25 |
| `2026-09-21-iss-retirement-set-by-contract` | space | published | 8 | 8 | 15 |
| `2026-09-21-open-models-four-months-behind` | tech | published | 8 | 8 | 23 |
| `2026-09-21-premier-league-squad-cost-ratio` | sports | published | 9 | 9 | 23 |
| `2026-09-28-verdict-arrived-sentence-didnt` | sports | published | 11 | 10 | 17 |

