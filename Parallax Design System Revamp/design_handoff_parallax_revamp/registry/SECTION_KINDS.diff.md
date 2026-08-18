# `SECTION_KINDS` diff — 90 → 118

`src/content/config.ts`. The array is grouped by world with a blank line
between groups; new kinds **append to the end of their own world's group**, which
keeps the diff readable and keeps `docs/design/catalog.md` in the same order.

`npm run check:catalog` compares this array to the catalog's `##` blocks
**1:1 and in order** — so the catalog blocks in `catalog-blocks.md` must be
inserted at exactly the matching positions.

---

## 1 · politics — after `'ballot-flow'`

```diff
   'ballot-flow',           // SVG — ranked-choice round transfers (flowDash)
+  'majority-flow',         // SVG — seats group→bloc→outcome Sankey vs the majority line
+  'rank-bump',             // SVG — finishing position across elections (rank, not votes)
+  'bill-funnel',           // HTML — many bills surviving each procedural stage
+  'age-pyramid',           // HTML — composition by age band and sex, counts or shares
+  'turnout-margin',        // SVG — turnout vs winning margin as a time-ordered path
```

## 2 · space — after `'eclipse-cone'`

```diff
   'eclipse-cone',          // SVG/CSS-3D — umbra/penumbra shadow-cone geometry to scale
+  'mission-timeline',      // HTML — mission phases on one clock + fixed milestones
+  'porkchop-grid',         // SVG/HTML — departure×arrival Δv matrix (launch opportunity space)
+  'debris-histogram',      // SVG — size-binned population on a log axis, trackable vs not
+  'margin-bullets',        // HTML — subsystem margins vs requirement, each in its own unit
```

## 3 · earth — after `'storm-track'`

```diff
   'storm-track',           // WebGL — cyclone best-track on the globe, Saffir–Simpson
+  'river-multiples',       // SVG — many series in self-scaled panels (shape, not size)
+  'heat-uptake',           // SVG — stacked reservoir areas, absolute or share
+  'glacier-dumbbell',      // HTML — then-vs-now per entity, sortable absolute or relative
+  'rain-calendar',         // HTML — 365 daily cells; concentration of extremes
```

## 4 · tech — after `'moore-ladder'`

```diff
   'moore-ladder',          // SVG — base-2 log doubling fit (Moore's law)
+  'flame-graph',           // HTML — CPU profile; width = total time, depth = call stack
+  'latency-ridge',         // SVG — latency distribution per release + tail threshold
+  'service-arcs',          // SVG — call graph on one axis; arcs below the line are cycles
+  'revenue-mosaic',        // HTML — marimekko: column width × block height = money
+  'state-timeline',        // HTML — per-service health lanes + incident clock
```

## 5 · travel — after `'fare-terrain'`

```diff
   'fare-terrain',          // SVG — fare/price surface across dates or routes
+  'attrition-waffle',      // HTML — 100 countable squares; an auditable rate
+  'fare-spread',           // SVG — per-month fare distribution (range + IQR + median)
+  'price-swarm',           // SVG — every observation as a dot; mean vs median marked
+  'route-criteria',        // SVG — parallel coordinates, five axes in five units
+  'daylight-band',         // SVG — sunrise/sunset band across the year
```

## 6 · sports — after `'pace-ridge'` (note: add the comma)

```diff
-  'pace-ridge'             // SVG — ridgeline of a stat's distribution per group
+  'pace-ridge',            // SVG — ridgeline of a stat's distribution per group
+  'knockout-bracket',      // SVG — draw tree; line weight is pre-match odds
+  'volume-accuracy',       // SVG — two rates vs their averages, quadrant-labelled
+  'goal-clock',            // SVG — per-block counts + cumulative share on a 2nd axis
+  'channel-ternary',       // SVG — three shares constrained to sum to 100
+  'finish-interval'        // HTML — projected position + 90% interval; overlaps = undecided
```

---

## Count check

| World | Was | New | Now |
|---|---|---|---|
| politics | 21 | +5 | 26 |
| space | 14 | +4 | 18 |
| earth | 13 | +4 | 17 |
| tech | 12 | +5 | 17 |
| travel | 14 | +5 | 19 |
| sports | 12 | +5 | 17 |
| universal / narrative | 4 | 0 | 4 |
| **total** | **90** | **+28** | **118** |

After editing, update the count in **two** places that state it in prose:
`src/components/AGENTS.md` §2 ("**90 kinds** as of 2026-07-14") and
`docs/design/catalog.md`'s STATUS note. Neither is checked automatically.
