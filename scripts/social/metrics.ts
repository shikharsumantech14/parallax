/**
 * Engagement fetcher (learning-loop signal #1).
 *
 *   npm run social:metrics            # fetch + store engagement for posted rows
 *   npm run social:metrics -- --dry   # fetch + print, write nothing
 *
 * For each posted row with a Bluesky permalink that hasn't been fetched recently,
 * resolves the at:// uri and reads like/repost/reply/quote counts from the public
 * AT Protocol AppView (no auth needed for public reads), then stores them on
 * social_posts.engagement (+ engagement_fetched_at). Feeds scripts/social/refine-voice.ts.
 *
 * Needs PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { loadEnvLocal, requireEnv, serviceClient } from '../lib/social.js';

const APPVIEW = process.env.BLUESKY_APPVIEW ?? 'https://public.api.bsky.app';
const REFRESH_DAYS = Number(process.env.METRICS_REFRESH_DAYS ?? '7'); // re-fetch until this old
const MAX_PER_RUN = Number(process.env.METRICS_MAX_PER_RUN ?? '50');

async function xrpcGet<T>(method: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${APPVIEW}/xrpc/${method}?${qs}`);
  if (!res.ok) throw new Error(`${method} ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

function parsePermalink(url: string): { handle: string; rkey: string } | null {
  const m = url.match(/profile\/([^/]+)\/post\/([^/?#]+)/);
  return m ? { handle: m[1], rkey: m[2] } : null;
}

const didCache = new Map<string, string>();
async function resolveDid(handle: string): Promise<string> {
  if (handle.startsWith('did:')) return handle;
  const cached = didCache.get(handle);
  if (cached) return cached;
  const out = await xrpcGet<{ did: string }>('com.atproto.identity.resolveHandle', { handle });
  didCache.set(handle, out.did);
  return out.did;
}

interface BskyPost { likeCount?: number; repostCount?: number; replyCount?: number; quoteCount?: number }

async function main(): Promise<void> {
  loadEnvLocal();
  const dry = process.argv.includes('--dry');
  requireEnv('PUBLIC_SUPABASE_URL');
  requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = serviceClient();

  const cutoff = new Date(Date.now() - REFRESH_DAYS * 864e5).toISOString();
  const { data, error } = await supabase
    .from('social_posts')
    .select('id, topic, kind, permalink, engagement_fetched_at')
    .eq('status', 'posted')
    .like('permalink', '%bsky.app%')
    .or(`engagement_fetched_at.is.null,engagement_fetched_at.lt.${cutoff}`)
    .order('engagement_fetched_at', { ascending: true, nullsFirst: true })
    .limit(MAX_PER_RUN);
  if (error) throw new Error(`read failed: ${error.message}`);

  const rows = (data ?? []) as { id: string; topic: string; kind: string; permalink: string; engagement_fetched_at: string | null }[];
  if (rows.length === 0) { console.log('No posted rows due for a metrics fetch.'); return; }
  console.log(`Fetching engagement for ${rows.length} post(s)${dry ? ' [dry]' : ''}.`);

  for (const row of rows) {
    const parsed = parsePermalink(row.permalink);
    if (!parsed) { console.warn(`  skip ${row.id}: unparseable permalink`); continue; }
    try {
      const did = await resolveDid(parsed.handle);
      const uri = `at://${did}/app.bsky.feed.post/${parsed.rkey}`;
      const { posts } = await xrpcGet<{ posts: BskyPost[] }>('app.bsky.feed.getPosts', { uris: uri });
      const p = posts?.[0];
      if (!p) { console.warn(`  skip ${row.id}: post not found`); continue; }
      const engagement = {
        likes: p.likeCount ?? 0, reposts: p.repostCount ?? 0,
        replies: p.replyCount ?? 0, quotes: p.quoteCount ?? 0,
      };
      console.log(`  ${row.topic}/${row.kind} ${row.id}: ♥${engagement.likes} ↻${engagement.reposts} 💬${engagement.replies}`);
      if (!dry) {
        await supabase.from('social_posts')
          .update({ engagement, engagement_fetched_at: new Date().toISOString() })
          .eq('id', row.id);
      }
    } catch (err) {
      console.warn(`  skip ${row.id}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log('Done.');
}

main().catch((err) => { console.error('social:metrics failed:', err instanceof Error ? err.message : err); process.exit(1); });
