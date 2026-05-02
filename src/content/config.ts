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
  'climate-strip'          // earth signature — warming stripes time-series
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
    ogImage: z.string().optional(),
    sections: z.array(sectionSchema),
    sources: z.array(sourceSchema)
  })
});

export type Source = z.infer<typeof sourceSchema>;
export type Section = z.infer<typeof sectionSchema>;

export const collections = { issues: issuesCollection };
