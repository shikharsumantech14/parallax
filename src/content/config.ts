import { defineCollection, z } from 'astro:content';

export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export const topicEnum = z.enum(TOPICS);
export type Topic = z.infer<typeof topicEnum>;

export const SECTION_KINDS = [
  'hero',
  'act-break',             // typographic chapter divider — CANON.md §3 act structure
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
  'chamber',               // WebGL FLAGSHIP — instanced 3D hemicycle parliament + division walk
  'power-flow',            // SVG — directional money/authority Sankey with animated flow dashes
  // space
  'orbit-globe',           // WebGL — dot-matrix Earth + inclined orbit rings
  'trajectory-arc',        // CSS-3D/SVG — launch→orbit parabola in a starfield
  'delta-v-ladder',        // CSS-3D — stacked Δv/energy budget bars
  'signal-readout',        // SVG — telemetry / EM-band sweep readout
  'descent-profile',       // SVG — altitude-vs-time descent with craft glyph
  'solar-system',          // WebGL FLAGSHIP — navigable Keplerian solar system
  // earth
  'data-globe',            // WebGL — 3D choropleth globe (graticule style)
  'core-sample',           // CSS-3D — ice/sediment core column, scrub strata
  'sea-level-tank',        // CSS-3D/SVG — cross-section water-rise
  'climate-spiral',        // SVG — warming spiral (radial months)
  'quake-depth',           // SVG — seismic events on depth×time axis
  'terrain-relief',        // WebGL FLAGSHIP — real DEM ridgeline/contour landscape
  // tech
  'arch-stack',            // CSS-3D — exploded layer stack
  'latency-waterfall',     // SVG — request/span waterfall timeline
  'version-graph',         // SVG — git-style branch/merge graph
  'scaling-plot',          // SVG — log-log scaling scatter + fit
  'throughput-dial',       // CSS-3D — perspective req/s gauge
  'neural-flow',           // WebGL FLAGSHIP — instanced forward-pass activation wave
  // travel
  'route-globe',           // WebGL — 3D globe + great-circle arc
  'elevation-trek',        // CSS-3D/SVG — route elevation profile, moving marker
  'itinerary-reel',        // CSS-3D — flip-through day cards
  'climate-calendar',      // SVG — month×metric weather heat ribbon
  'timezone-arc',          // SVG — sun/day arc across time zones
  'terminator-globe',      // WebGL FLAGSHIP — day/night line + flight arc (jet lag)
  // sports
  'tactics-pitch',         // CSS-3D — tilted pitch with player markers + heat
  'shot-map',              // SVG/CSS-3D — goal frame + shot-placement scatter
  'xg-race',               // SVG — cumulative xG step-line race
  'momentum-wave',         // SVG — match-momentum area
  'player-card',           // CSS-3D — flip rating card
  'flight-of-the-ball'     // WebGL FLAGSHIP — drag+Magnus shot trajectory over a pitch
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

export const SECTION_LAYOUTS = ['default', 'wide', 'bleed', 'split', 'split-flip', 'breath'] as const;
export const sectionLayoutEnum = z.enum(SECTION_LAYOUTS);
export type SectionLayout = z.infer<typeof sectionLayoutEnum>;

const sectionSchema = z.object({
  kind: sectionKindEnum,
  number: z.string().optional(),
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  intro: z.string().optional(),
  skimCaption: z.string().optional(),
  // One sentence explaining the FORM of the viz ("each block is one seat…") —
  // rendered as the in-flow "In plain terms" line. Falls back to the per-kind
  // default in src/lib/explainers.ts. Captions explain the DATA instead.
  plain: z.string().max(220).optional(),
  // Geometry variant — see src/styles/layout-v2.css + docs/design/CANON.md §3
  // rhythm rules (≤1 bleed per act; split only for the issue's hero metaphor).
  layout: sectionLayoutEnum.optional(),
  data: z.any().optional(),
  sourceRefs: z.array(z.string()).default([])
});

// Story mode (/s/<slug>/) — optional authored beats in the SOCIAL voice
// (research/_voice/_voice-social.md). Absent ⇒ src/lib/story.ts derives a
// working story from skimCaption/intro/title. Spec: docs/design/STORY-MODE-SPEC.md.
const storyBeatSchema = z.object({
  section: z.number().int().nonnegative(),  // index into sections[]
  text: z.string().min(40).max(320),        // the ~60-word beat
  kicker: z.string().max(80).optional()
});
const storySchema = z.object({
  hook: z.string().max(220).optional(),     // overrides frontmatter `hook` on the cover card
  beats: z.array(storyBeatSchema).min(3).max(6).optional(),
  cta: z.string().max(160).optional()
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
    story: storySchema.optional(),
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
