import { defineCollection, z } from 'astro:content';

export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export const topicEnum = z.enum(TOPICS);
export type Topic = z.infer<typeof topicEnum>;

export const SECTION_KINDS = [
  'hero',
  'timeline',
  'bill-breakdown',
  'vote-result',
  'seat-chart',
  'comparison',
  'paradox',
  'analogy',
  'quote',
  'beat-sheet',
  'prose',
  'data-readout',
  'orbital-shells',
  'commit-grid',           // tech signature
  'journey-map',           // travel signature
  'match-stat-line',       // sports signature
  'elevation-profile',     // earth signature
  'region-map',            // earth signature — choropleth world map
  'climate-strip',         // earth signature — warming stripes time-series
  'carbon-gauge',          // earth signature — remaining carbon budget arc
  'approval-chart',        // politics signature — approval/disapproval time series
  'power-matrix',          // politics signature — institution × party control grid
  'orbit-trace',           // space signature — named satellite orbits diagram
  'launch-stats',          // space signature — annual launch count bar chart
  'benchmark-chart',       // tech signature — horizontal performance comparison bars
  'adoption-curve',        // tech signature — S-curve technology diffusion
  'route-card',            // travel signature — multi-leg journey itinerary
  'city-compare',          // travel signature — two-city comparison table
  'league-table',          // sports signature — standings with form guide
  'player-radar',          // sports signature — spider chart for player stats

  // ── v2 3D / interactive component library (5 per world) ──────────────────
  // politics
  'coalition-orbit',       // WebGL — party bodies orbiting a government core
  'swing-dial',            // CSS-3D — perspective needle between two blocs
  'bill-passage',          // CSS-3D — bill stage cards advancing
  'vote-flow',             // SVG — Sankey of blocs → for/against/abstain
  'margin-ladder',         // CSS-3D — seats by win-margin on a tilted plane
  // space
  'orbit-globe',           // WebGL — dot-matrix Earth + inclined orbit rings
  'trajectory-arc',        // CSS-3D/SVG — launch→orbit parabola in a starfield
  'delta-v-ladder',        // CSS-3D — stacked Δv/energy budget bars
  'signal-readout',        // SVG — telemetry / EM-band sweep readout
  'descent-profile',       // SVG — altitude-vs-time descent with craft glyph
  // earth
  'data-globe',            // WebGL — 3D choropleth globe (graticule style)
  'core-sample',           // CSS-3D — ice/sediment core column, scrub strata
  'sea-level-tank',        // CSS-3D/SVG — cross-section water-rise
  'climate-spiral',        // SVG — warming spiral (radial months)
  'quake-depth',           // SVG — seismic events on depth×time axis
  // tech
  'arch-stack',            // CSS-3D — exploded layer stack
  'latency-waterfall',     // SVG — request/span waterfall timeline
  'version-graph',         // SVG — git-style branch/merge graph
  'scaling-plot',          // SVG — log-log scaling scatter + fit
  'throughput-dial',       // CSS-3D — perspective req/s gauge
  // travel
  'route-globe',           // WebGL — 3D globe + great-circle arc
  'elevation-trek',        // CSS-3D/SVG — route elevation profile, moving marker
  'itinerary-reel',        // CSS-3D — flip-through day cards
  'climate-calendar',      // SVG — month×metric weather heat ribbon
  'timezone-arc',          // SVG — sun/day arc across time zones
  // sports
  'tactics-pitch',         // CSS-3D — tilted pitch with player markers + heat
  'shot-map',              // SVG/CSS-3D — goal frame + shot-placement scatter
  'xg-race',               // SVG — cumulative xG step-line race
  'momentum-wave',         // SVG — match-momentum area
  'player-card'            // CSS-3D — flip rating card
] as const;
export const sectionKindEnum = z.enum(SECTION_KINDS);
export type SectionKind = z.infer<typeof sectionKindEnum>;

const sourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.string().url(),
  accessedAt: z.string(),
  kind: z.enum(['primary', 'secondary', 'analysis']),
  quote: z.string().optional()
});

const sectionSchema = z.object({
  kind: sectionKindEnum,
  number: z.string().optional(),
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  intro: z.string().optional(),
  skimCaption: z.string().optional(),
  data: z.any().optional(),
  sourceRefs: z.array(z.string()).default([])
});

const issuesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    topic: topicEnum,
    title: z.string(),
    hook: z.string(),
    dek: z.string(),
    publishedAt: z.date(),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readTimeMinutes: z.number().optional(),
    primer: z.string().min(80).max(420).optional(),
    ogImage: z.string().optional(),
    sections: z.array(sectionSchema),
    sources: z.array(sourceSchema)
  })
});

export type Source = z.infer<typeof sourceSchema>;
export type Section = z.infer<typeof sectionSchema>;

// ── Guides collection ────────────────────────────────────────────────────────
// Long-form reader-facing documents that aren't issues: privacy policy,
// terms of service, "how to read Parallax," "your Parallax dashboard."
// Renders with the publication's typography at /about/<slug>/.
const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    dek: z.string().optional(),
    updated: z.date(),
    summary: z.string().optional()
  })
});

export type Guide = z.infer<typeof guidesCollection.schema>;

export const collections = {
  issues: issuesCollection,
  guides: guidesCollection
};
