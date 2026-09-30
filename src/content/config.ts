import { defineCollection, z } from 'astro:content';

export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export const topicEnum = z.enum(TOPICS);
export type Topic = z.infer<typeof topicEnum>;

export const SECTION_KINDS = [
  'act-break',             // typographic chapter divider — CANON.md §3 act structure
  'timeline',
  'bill-breakdown',
  'vote-result',
  'seat-chart',
  'comparison',
  'paradox',
  'you-think',             // core — what most people think vs what the data shows, with the settling figure (REGISTER-PLAN RG-09)
  'analogy',
  'quote',
  'jargon-buster',         // core — 2–4 terms of art with a one-line meaning each (REGISTER-PLAN RG-09); narrative
  'three-steps',           // core — a mechanism in three numbered cards, one idea each (REGISTER-PLAN RG-09); narrative
  'prose',
  'data-readout',
  'number-sense',          // core — one big number and the everyday things it equals (REGISTER-PLAN RG-09)
  'commit-grid',           // tech signature
  'journey-map',           // travel signature
  'match-stat-line',       // sports signature
  'region-map',            // earth signature — choropleth world map
  'climate-strip',         // earth signature — warming stripes time-series
  'gauge',                 // universal — one value on an arc: a budget used, a lean between two blocs, or load against capacity (was carbon-gauge; swing-dial and throughput-dial fold in, Lens 2026-09-30)
  'approval-chart',        // politics signature — approval/disapproval time series
  'power-matrix',          // politics signature — institution × party control grid
  'orbit-trace',           // space signature — named satellite orbits diagram
  'launch-stats',          // space signature — annual launch count bar chart
  'benchmark-chart',       // tech signature — horizontal performance comparison bars
  'adoption-curve',        // tech signature — S-curve technology diffusion
  'itinerary',             // travel signature — a journey as legs, each stop carrying up to three items (was route-card; itinerary-reel folds in, Lens 2026-09-30)
  'league-table',          // sports signature — standings with form guide
  'player-radar',          // sports signature — spider chart for player stats

  // ── v2 3D / interactive component library (5 per world) ──────────────────
  // politics
  'bill-passage',          // CSS-3D — bill stage cards advancing
  'vote-flow',             // SVG — Sankey of blocs → for/against/abstain
  'margin-ladder',         // CSS-3D — seats by win-margin on a tilted plane
  'chamber',               // WebGL FLAGSHIP — instanced 3D hemicycle parliament + division walk
  'power-flow',            // SVG — directional money/authority Sankey with animated flow dashes
  'coalition-calculus',    // HTML-interactive — coalition builder vs the majority line
  'gerrymander-lens',      // SVG — same votes, three maps, efficiency-gap counters
  'bill-funnel',           // HTML — many bills surviving each procedural stage
  'age-pyramid',           // HTML — composition by age band and sex, counts or shares
  // space
  'trajectory-arc',        // CSS-3D/SVG — launch→orbit parabola in a starfield
  'delta-v-ladder',        // CSS-3D — stacked Δv/energy budget bars
  'descent-profile',       // SVG — altitude-vs-time descent with craft glyph
  'solar-system',          // WebGL FLAGSHIP — navigable Keplerian solar system
  'constellation-swarm',   // WebGL — instanced satellite mega-constellation shells
  'lagrange-map',          // SVG — three-body effective-potential contour field
  'transfer-window',       // SVG interactive — Hohmann transfer Δv + phase scrubber
  'eclipse-cone',          // SVG/CSS-3D — umbra/penumbra shadow-cone geometry to scale
  'margin-bullets',        // HTML — subsystem margins vs requirement, each in its own unit
  // earth
  'core-sample',           // CSS-3D — ice/sediment core column, scrub strata
  'sea-level-tank',        // CSS-3D/SVG — cross-section water-rise
  'climate-spiral',        // SVG — warming spiral (radial months)
  'quake-depth',           // SVG — seismic events on depth×time axis
  'terrain-relief',        // WebGL FLAGSHIP — real DEM ridgeline/contour landscape
  'plate-motion',          // WebGL — plate velocity field from Euler poles on the globe
  'atmosphere-column',     // SVG — barometric atmosphere column to true altitude
  'carbon-loop',           // SVG — stock-and-flow carbon cycle (conservation-checked)
  'storm-track',           // WebGL — cyclone best-track on the globe, Saffir–Simpson
  // tech
  'arch-stack',            // CSS-3D — exploded layer stack
  'latency-waterfall',     // SVG — request/span waterfall timeline
  'version-graph',         // SVG — git-style branch/merge graph
  'scaling-plot',          // SVG — log-log scaling scatter + fit
  'neural-flow',           // WebGL FLAGSHIP — instanced forward-pass activation wave
  'packet-trace',          // WebGL globe + SVG latency budget — light floor vs measured RTT
  'queue-cliff',           // SVG interactive — M/M/1 utilization cliff 1/(1−ρ)
  'chip-die',              // CSS-3D — exploded die floorplan, area ∝ real mm²
  'moore-ladder',          // SVG — base-2 log doubling fit (Moore's law)
  'state-timeline',        // HTML — per-service health lanes + incident clock
  // travel
  'elevation-trek',        // CSS-3D/SVG — route elevation profile, moving marker
  'climate-calendar',      // SVG — month×metric weather heat ribbon
  'timezone-arc',          // SVG — sun/day arc across time zones
  'terminator-globe',      // WebGL FLAGSHIP — day/night line + flight arc (jet lag)
  'city-grid',             // SVG — street-orientation polar histograms (grid vs tangle)
  'altitude-oxygen',       // SVG — altitude vs breathable oxygen curve + landmarks
  'season-wheel',          // SVG — radial year of a destination's climate
  'fare-terrain',          // SVG — fare/price surface across dates or routes
  'attrition-waffle',      // HTML — 100 countable squares; an auditable rate
  // sports
  'tactics-pitch',         // CSS-3D — tilted pitch with player markers + heat
  'shot-map',              // SVG/CSS-3D — goal frame + shot-placement scatter
  'xg-race',               // SVG — cumulative xG step-line race
  'momentum-wave',         // SVG — match-momentum area
  'player-card',           // CSS-3D — flip rating card
  'flight-of-the-ball',    // WebGL FLAGSHIP — drag+Magnus shot trajectory over a pitch
  'elo-river',             // SVG — Elo/rating streamgraph, braided season (crossovers)
  'court-value',           // SVG — xG/eFG value surface shaded over a pitch/court
  'pace-ridge',            // SVG — ridgeline of a stat's distribution per group
  'channel-ternary',       // SVG — three shares constrained to sum to 100
  'finish-interval',       // HTML — projected position + 90% interval; overlaps = undecided
] as const;
export const sectionKindEnum = z.enum(SECTION_KINDS);
export type SectionKind = z.infer<typeof sectionKindEnum>;

/* Retired kind names that still build (the Lens verdict, 2026-09-30,
   docs/design/LENS.md §9). Two kinds were renamed and four folded into a host
   kind; the backlist and the showcase drafts still carry the old names, so the
   schema accepts them and hands the CANONICAL name on. Every consumer of
   `section.kind` (SectionBody, Section, story mode, the explainers) therefore
   sees `gauge`, never `swing-dial`. The host components tell the old data
   shapes apart by their fields, so no issue has to be edited to keep building.
   Scripts that read the MDX directly (check-prose, project-graph) parse this
   map out of this file; keep it a flat literal of quoted pairs. The ten kinds
   the verdict DROPPED have no alias: a section naming one fails the build. */
export const KIND_ALIASES = {
  'carbon-gauge': 'gauge',
  'swing-dial': 'gauge',
  'throughput-dial': 'gauge',
  'route-card': 'itinerary',
  'itinerary-reel': 'itinerary',
  'city-compare': 'comparison',
} as const satisfies Record<string, SectionKind>;
export type KindAlias = keyof typeof KIND_ALIASES;
const KIND_ALIAS_NAMES = Object.keys(KIND_ALIASES) as [KindAlias, ...KindAlias[]];

/** The canonical kind for any accepted name, alias or not. */
export function canonicalKind(kind: string): SectionKind {
  return ((KIND_ALIASES as Record<string, SectionKind>)[kind] ?? kind) as SectionKind;
}

/* What an issue may write in `kind:` — a registered kind or an alias — with
   the alias resolved on parse. */
export const sectionKindInput = z
  .union([sectionKindEnum, z.enum(KIND_ALIAS_NAMES)])
  .transform((k): SectionKind => canonicalKind(k));

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
  kind: sectionKindInput,
  number: z.string().optional(),
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  intro: z.string().optional(),
  skimCaption: z.string().optional(),
  // DEPRECATED by the Lens reading system (2026-09-30, docs/design/LENS.md §5):
  // `plain` and `howToRead` give way to `cues` (Phase 3). Both are still
  // accepted and still rendered until Phase 8 retires them with the old shell,
  // so the backlist builds unchanged. The pipeline authors them until Phase 7
  // teaches it cues.
  //
  // One sentence explaining the FORM of the viz ("each block is one seat…") —
  // rendered as the in-flow "In plain terms" line. Falls back to the per-kind
  // default in src/lib/explainers.ts. Captions explain the DATA instead.
  plain: z.string().max(220).optional(),
  // How to read the graphic — the FORM, at paragraph length, rendered ABOVE it.
  // `plain` is one sentence below the graphic and stays that; this is the
  // handoff's contract part 02, which the 220-char cap cannot hold (13 of the
  // 28 supplied strings exceed it). Optional for now: it is tightened toward
  // required only after the existing issues are backfilled, in its own commit.
  howToRead: z.string().min(40).max(360).optional(),
  // Promoted OUT of `data: z.any()`, where they were unvalidated and could go
  // missing silently. The handoff's floor is "never a graphic without both",
  // and CANON §7 already said "no source, no section" on the honour system.
  // Renderers still fall back to data.caption / data.source so no existing
  // issue breaks. See docs/REVAMP-PLAN.md §1 (two-tier contract).
  caption: z.string().optional(),
  source: z
    .union([
      z.string(),
      z.object({ label: z.string(), date: z.string().optional() }),
    ])
    .optional(),
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
    // The issue's DOMINANT rhetorical mode, for the fact grid's fourth cell.
    // Named `voice`, not `mode`: `mode` is already the Full⇄Skim reading state
    // and the collision would be fatal. The stylist assigns modes per SECTION at
    // runtime and leaves no trace in the MDX, so this is the one authored
    // summary of them — optional, and the grid drops to three cells when it is
    // absent rather than inventing a value. See docs/REVAMP-PLAN.md §1.
    voice: z
      .enum([
        'AWE',
        'CONVERSATIONAL EXPLAINER',
        'CALM-STRUCTURAL',
        'SATIRICAL EXPOSURE',
        'DRY WIT',
        'INVESTIGATION',
        'FORENSIC',
        'LYRICAL COMPRESSION',
      ])
      .optional(),
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
