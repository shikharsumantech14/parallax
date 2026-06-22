/**
 * Reactive pipeline — STAGE 1: ingest.
 *
 *   npm run reactive:ingest -- <topic|all>
 *
 * Pulls free, commercial-clean news (GDELT DOC 2.0 + Google News search RSS +
 * official feeds), applies a cheap deterministic keyword pre-filter (kills ~95%
 * of volume before any LLM cost), and upserts survivors into trend_items
 * (UNIQUE url_hash → cross-run dedup). No keys needed for the sources; needs
 * PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to write.
 */
import { createHash } from 'crypto';
import * as cheerio from 'cheerio';
import { loadEnvLocal, requireEnv, serviceClient, TOPICS, type Topic } from '../lib/social.js';
import { SOURCES, type TopicSources } from './sources.config.js';
import type { SupabaseClient } from '@supabase/supabase-js';

const UA = 'ParallaxNewsBot/1.0 (+https://parallaxlens.com)';

interface RawItem { url: string; title: string; snippet: string; domain: string; source: string; publishedAt: string | null }

function normalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    url.search = '';
    return `${url.host}${url.pathname}`.replace(/\/$/, '').toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}
const urlHash = (u: string) => createHash('sha256').update(normalizeUrl(u)).digest('hex');
const domainOf = (u: string) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };

function gdeltDate(s: string): string | null {
  // "20260620T120000Z" → ISO
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : null;
}

async function fetchGdelt(cfg: TopicSources): Promise<RawItem[]> {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(cfg.gdeltQuery)}&mode=ArtList&format=json&timespan=2d&maxrecords=75&sort=DateDesc`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) { console.warn(`  GDELT ${res.status}`); return []; }
    const json = (await res.json()) as { articles?: { url: string; title: string; domain: string; seendate: string }[] };
    return (json.articles ?? []).map((a) => ({
      url: a.url, title: a.title ?? '', snippet: a.title ?? '',
      domain: a.domain ?? domainOf(a.url), source: 'gdelt',
      publishedAt: a.seendate ? gdeltDate(a.seendate) : null,
    }));
  } catch (err) { console.warn(`  GDELT failed: ${err instanceof Error ? err.message : err}`); return []; }
}

async function fetchRss(name: string, url: string): Promise<RawItem[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) { console.warn(`  ${name} ${res.status}`); return []; }
    const $ = cheerio.load(await res.text(), { xmlMode: true });
    const out: RawItem[] = [];
    // RSS <item> and Atom <entry>
    $('item, entry').each((_, el) => {
      const $el = $(el);
      const title = $el.find('title').first().text().trim();
      const link = $el.find('link').first().attr('href') || $el.find('link').first().text().trim();
      const desc = $el.find('description, summary, content').first().text().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const date = $el.find('pubDate, published, updated').first().text().trim();
      if (!title || !link) return;
      out.push({
        url: link, title, snippet: desc.slice(0, 500), domain: domainOf(link),
        source: name, publishedAt: date ? new Date(date).toISOString() : null,
      });
    });
    return out;
  } catch (err) { console.warn(`  ${name} failed: ${err instanceof Error ? err.message : err}`); return []; }
}

function passesPrefilter(item: RawItem, keywords: string[]): boolean {
  const hay = `${item.title} ${item.snippet}`.toLowerCase();
  return keywords.some((k) => hay.includes(k));
}

async function ingestTopic(supabase: SupabaseClient | null, topic: Topic, dry: boolean): Promise<number> {
  const cfg = SOURCES[topic];
  console.log(`\n=== ${topic} ===`);
  const gnUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cfg.googleNewsQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;

  const batches = await Promise.all([
    fetchGdelt(cfg),
    fetchRss('Google News', gnUrl),
    ...cfg.rssFeeds.map((f) => fetchRss(f.name, f.url)),
  ]);
  const all = batches.flat();
  const filtered = all.filter((i) => passesPrefilter(i, cfg.keywords));
  console.log(`  fetched ${all.length}, kept ${filtered.length} after pre-filter`);

  // de-dup within this run by url_hash
  const seen = new Set<string>();
  const rows = filtered
    .map((i) => ({ ...i, url_hash: urlHash(i.url) }))
    .filter((i) => { if (seen.has(i.url_hash)) return false; seen.add(i.url_hash); return true; })
    .map((i) => ({
      topic, url: i.url, url_hash: i.url_hash, title: i.title.slice(0, 500),
      snippet: i.snippet || null, domain: i.domain || null, source: i.source,
      published_at: i.publishedAt,
    }));

  if (dry) { console.log(`  [dry] ${rows.length} unique items (not written)`); return rows.length; }
  if (rows.length === 0 || !supabase) return 0;

  const { error, count } = await supabase
    .from('trend_items')
    .upsert(rows, { onConflict: 'url_hash', ignoreDuplicates: true, count: 'exact' });
  if (error) throw new Error(`trend_items upsert failed (${topic}): ${error.message}`);
  console.log(`  ✓ ${count ?? rows.length} new/updated`);
  return count ?? rows.length;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const arg = (process.argv[2] ?? 'all').toLowerCase();
  const dry = process.argv.includes('--dry');
  if (!dry) { requireEnv('PUBLIC_SUPABASE_URL'); requireEnv('SUPABASE_SERVICE_ROLE_KEY'); }
  const supabase = dry ? null : serviceClient();

  const topics: Topic[] = arg === 'all' ? [...TOPICS] : [arg as Topic];
  if (arg !== 'all' && !TOPICS.includes(arg as Topic)) {
    console.error(`Usage: npm run reactive:ingest -- <${TOPICS.join('|')}|all>`);
    process.exit(1);
  }
  let total = 0;
  for (const t of topics) {
    try { total += await ingestTopic(supabase, t, dry); }
    catch (err) { console.error(`  ! ${t}: ${err instanceof Error ? err.message : err}`); }
  }
  console.log(`\nDone. ${total} items ${dry ? 'previewed' : 'ingested'}.`);
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('ingest.ts');
if (invokedDirectly) {
  main().catch((err) => { console.error('reactive:ingest failed:', err instanceof Error ? err.message : err); process.exit(1); });
}
