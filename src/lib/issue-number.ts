import { getCollection } from 'astro:content';

/**
 * Issue numbers, derived the way the home page derives them: every issue that
 * is not a draft, oldest first, ties on a date broken by slug, numbered from 1.
 * A draft has no number.
 */
export async function issueNumbers(): Promise<Map<string, number>> {
  const published = await getCollection('issues', (e) => e.data.status !== 'draft');
  const oldestFirst = [...published].sort(
    (a, b) => a.data.publishedAt.getTime() - b.data.publishedAt.getTime() || a.slug.localeCompare(b.slug)
  );
  return new Map(oldestFirst.map((e, i) => [e.slug, i + 1]));
}

/** "No 07": the Lens form of the issue number (the board's, no numero sign). */
export const formatNo = (n: number) => `No ${String(n).padStart(2, '0')}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "28 Sep": the cover card's date, day and short month in UTC. Spelled out
 *  by hand because en-GB in current ICU prints September as "Sept". */
export const shortDay = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
