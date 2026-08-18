# `SectionBody.astro` diff

`src/components/SectionBody.astro` — the dispatcher. **Never add kinds to
`SectionRenderer.astro`**: story mode (`/s/<slug>/`) renders bodies without the
article chrome and shares this switch.

## 1 · imports

Append to each world's existing import group, matching the file's grouping:

```ts
// politics
import MajorityFlow from './topic/politics/MajorityFlow.astro';
import RankBump from './topic/politics/RankBump.astro';
import BillFunnel from './topic/politics/BillFunnel.astro';
import AgePyramid from './topic/politics/AgePyramid.astro';
import TurnoutMargin from './topic/politics/TurnoutMargin.astro';

// space
import MissionTimeline from './topic/space/MissionTimeline.astro';
import PorkchopGrid from './topic/space/PorkchopGrid.astro';
import DebrisHistogram from './topic/space/DebrisHistogram.astro';
import MarginBullets from './topic/space/MarginBullets.astro';

// earth
import RiverMultiples from './topic/earth/RiverMultiples.astro';
import HeatUptake from './topic/earth/HeatUptake.astro';
import GlacierDumbbell from './topic/earth/GlacierDumbbell.astro';
import RainCalendar from './topic/earth/RainCalendar.astro';

// tech
import FlameGraph from './topic/tech/FlameGraph.astro';
import LatencyRidge from './topic/tech/LatencyRidge.astro';
import ServiceArcs from './topic/tech/ServiceArcs.astro';
import RevenueMosaic from './topic/tech/RevenueMosaic.astro';
import StateTimeline from './topic/tech/StateTimeline.astro';

// travel
import AttritionWaffle from './topic/travel/AttritionWaffle.astro';
import FareSpread from './topic/travel/FareSpread.astro';
import PriceSwarm from './topic/travel/PriceSwarm.astro';
import RouteCriteria from './topic/travel/RouteCriteria.astro';
import DaylightBand from './topic/travel/DaylightBand.astro';

// sports
import KnockoutBracket from './topic/sports/KnockoutBracket.astro';
import VolumeAccuracy from './topic/sports/VolumeAccuracy.astro';
import GoalClock from './topic/sports/GoalClock.astro';
import ChannelTernary from './topic/sports/ChannelTernary.astro';
import FinishInterval from './topic/sports/FinishInterval.astro';
```

## 2 · dispatch arms

Follow whatever form the existing switch uses in your copy of the file (the
`{kind === 'x' && <X … />}` chain or a `switch`). Each new kind takes the same
two props every viz kind takes:

```astro
{kind === 'majority-flow'    && <MajorityFlow    data={section.data} />}
{kind === 'rank-bump'        && <RankBump        data={section.data} />}
{kind === 'bill-funnel'      && <BillFunnel      data={section.data} />}
{kind === 'age-pyramid'      && <AgePyramid      data={section.data} />}
{kind === 'turnout-margin'   && <TurnoutMargin   data={section.data} />}

{kind === 'mission-timeline' && <MissionTimeline data={section.data} />}
{kind === 'porkchop-grid'    && <PorkchopGrid    data={section.data} />}
{kind === 'debris-histogram' && <DebrisHistogram data={section.data} />}
{kind === 'margin-bullets'   && <MarginBullets   data={section.data} />}

{kind === 'river-multiples'  && <RiverMultiples  data={section.data} />}
{kind === 'heat-uptake'      && <HeatUptake      data={section.data} />}
{kind === 'glacier-dumbbell' && <GlacierDumbbell data={section.data} />}
{kind === 'rain-calendar'    && <RainCalendar    data={section.data} />}

{kind === 'flame-graph'      && <FlameGraph      data={section.data} />}
{kind === 'latency-ridge'    && <LatencyRidge    data={section.data} />}
{kind === 'service-arcs'     && <ServiceArcs     data={section.data} />}
{kind === 'revenue-mosaic'   && <RevenueMosaic   data={section.data} />}
{kind === 'state-timeline'   && <StateTimeline   data={section.data} />}

{kind === 'attrition-waffle' && <AttritionWaffle data={section.data} />}
{kind === 'fare-spread'      && <FareSpread      data={section.data} />}
{kind === 'price-swarm'      && <PriceSwarm      data={section.data} />}
{kind === 'route-criteria'   && <RouteCriteria   data={section.data} />}
{kind === 'daylight-band'    && <DaylightBand    data={section.data} />}

{kind === 'knockout-bracket' && <KnockoutBracket data={section.data} />}
{kind === 'volume-accuracy'  && <VolumeAccuracy  data={section.data} />}
{kind === 'goal-clock'       && <GoalClock       data={section.data} />}
{kind === 'channel-ternary'  && <ChannelTernary  data={section.data} />}
{kind === 'finish-interval'  && <FinishInterval  data={section.data} />}
```

## 3 · CSS prefix registration

`src/components/AGENTS.md` §4 — add each prefix so the next author does not
collide with it. All 28 verified unique against `meta.css`, `base.css`,
`dataviz-v2.css` and `src/components/` at time of writing; re-grep before you
commit, since the P0–P8 work is uncommitted and may have taken one.

```
px-mfl  majority-flow      px-flm  flame-graph
px-bmp  rank-bump          px-lrg  latency-ridge
px-fnl  bill-funnel        px-svc  service-arcs
px-pyr  age-pyramid        px-mos  revenue-mosaic
px-tmg  turnout-margin     px-stl  state-timeline
px-mtl  mission-timeline   px-waf  attrition-waffle
px-pkc  porkchop-grid      px-fsp  fare-spread
px-dbh  debris-histogram   px-swm  price-swarm
px-mbl  margin-bullets     px-pcd  route-criteria
px-rmu  river-multiples    px-dbn  daylight-band
px-hup  heat-uptake        px-brk  knockout-bracket
px-gdb  glacier-dumbbell   px-qad  volume-accuracy
px-rcl  rain-calendar      px-gcl  goal-clock
                           px-trn  channel-ternary
                           px-fiv  finish-interval
```
