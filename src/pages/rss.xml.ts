import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { stripEmphasis } from '../lib/text';

export async function GET(context: APIContext) {
  const issues = await getCollection('issues', (entry) => entry.data.status !== 'draft');
  const sorted = issues.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'Parallax Lens',
    description: 'Parallax Lens — a visual explainer publication. Stories you think you already understand, from a different angle.',
    site: context.site!,
    items: sorted.map((issue) => ({
      title: stripEmphasis(issue.data.title),
      description: issue.data.hook,
      pubDate: issue.data.publishedAt,
      link: `/issues/${issue.slug}/`,
      categories: [issue.data.topic, ...issue.data.tags]
    })),
    customData: '<language>en-us</language>'
  });
}
