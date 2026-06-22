/**
 * Reactive pipeline — STAGE 2: cluster.
 *
 *   npm run reactive:cluster -- <topic|all>
 *
 * Embeds un-clustered trend_items (Voyage) and groups the SAME story across
 * outlets into trend_clusters by cosine similarity (≥ threshold) against recent
 * cluster centroids + within the batch. Each cluster gets outlet_count + a
 * velocity (items/hour) — the trending score the router thresholds on.
 *
 * Bills VOYAGE_API_KEY. Needs PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { loadEnvLocal, requireEnv, serviceClient, TOPICS, type Topic } from '../lib/social.js';
import { embed } from '../lib/voyage.js';
import type { SupabaseClient } from '@supabase/supabase-js';

const SIM = Number(process.env.REACTIVE_SIM_THRESHOLD ?? '0.82');
const WINDOW_HOURS = Number(process.env.REACTIVE_WINDOW_HOURS ?? '72');
const EMBED_BATCH = 64;

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
function parseVec(v: unknown): number[] {
  if (Array.isArray(v)) return v as number[];
  if (typeof v === 'string') { try { return JSON.parse(v) as number[]; } catch { return []; } }
  return [];
}

interface ItemRow { id: string; title: string; snippet: string | null; domain: string | null; published_at: string | null; fetched_at: string }
interface ClusterRow { id: string; centroid: unknown; outlet_count: number; item_count: number; first_seen: string; last_seen: string; rep_title: string }

interface WorkCluster {
  id: string | null; // null = new
  centroid: number[];
  domains: Set<string>;
  itemIds: string[];
  itemCount: number;
  firstSeen: number;
  lastSeen: number;
  repTitle: string;
  repUrl: string;
  dirty: boolean;
}

async function clusterTopic(supabase: SupabaseClient, topic: Topic): Promise<number> {
  console.log(`\n=== ${topic} ===`);
  const sinceIso = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString();

  const { data: items, error: itemsErr } = await supabase
    .from('trend_items')
    .select('id, title, snippet, domain, published_at, fetched_at, url')
    .eq('topic', topic).is('cluster_id', null).gte('fetched_at', sinceIso)
    .order('fetched_at', { ascending: true }).limit(400);
  if (itemsErr) throw new Error(`trend_items read failed: ${itemsErr.message}`);
  const rows = (items ?? []) as (ItemRow & { url: string })[];
  if (rows.length === 0) { console.log('  no un-clustered items'); return 0; }

  // Embed title+snippet
  const texts = rows.map((r) => `${r.title}. ${r.snippet ?? ''}`.slice(0, 1000));
  const vecs: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    vecs.push(...(await embed(texts.slice(i, i + EMBED_BATCH), 'document')));
  }

  // Seed work-set from existing recent clusters
  const { data: existing } = await supabase
    .from('trend_clusters')
    .select('id, centroid, outlet_count, item_count, first_seen, last_seen, rep_title')
    .eq('topic', topic).gte('last_seen', sinceIso).is('routed_at', null).limit(200);
  const work: WorkCluster[] = ((existing ?? []) as ClusterRow[]).map((c) => ({
    id: c.id, centroid: parseVec(c.centroid), domains: new Set<string>(), itemIds: [],
    itemCount: c.item_count, firstSeen: new Date(c.first_seen).getTime(), lastSeen: new Date(c.last_seen).getTime(),
    repTitle: c.rep_title, repUrl: '', dirty: false,
  })).filter((c) => c.centroid.length > 0);

  const assign = new Map<string, string | null>(); // itemId → cluster index marker handled after

  rows.forEach((item, idx) => {
    const v = vecs[idx];
    const ts = new Date(item.published_at ?? item.fetched_at).getTime();
    let best: WorkCluster | null = null;
    let bestSim = SIM;
    for (const c of work) {
      const s = cosine(v, c.centroid);
      if (s >= bestSim) { bestSim = s; best = c; }
    }
    if (!best) {
      best = { id: null, centroid: v.slice(), domains: new Set(), itemIds: [], itemCount: 0, firstSeen: ts, lastSeen: ts, repTitle: item.title, repUrl: item.url, dirty: true };
      work.push(best);
    }
    best.itemIds.push(item.id);
    best.itemCount += 1;
    if (item.domain) best.domains.add(item.domain);
    best.firstSeen = Math.min(best.firstSeen, ts);
    best.lastSeen = Math.max(best.lastSeen, ts);
    best.dirty = true;
    assign.set(item.id, best.id); // may be null (new) — patched after insert
  });

  // Persist: insert new clusters, update existing, then set item.cluster_id + embedding.
  let clustersTouched = 0;
  // index items by id for embedding write
  const embById = new Map<string, number[]>();
  rows.forEach((r, i) => embById.set(r.id, vecs[i]));

  for (const c of work) {
    if (!c.dirty) continue;
    const span = Math.max(1, (c.lastSeen - c.firstSeen) / 3600_000);
    const velocity = c.itemCount / span;
    if (c.id === null) {
      const { data: ins, error } = await supabase.from('trend_clusters').insert({
        topic, rep_title: c.repTitle.slice(0, 500), rep_url: c.repUrl, centroid: c.centroid,
        outlet_count: c.domains.size || 1, item_count: c.itemCount, velocity,
        first_seen: new Date(c.firstSeen).toISOString(), last_seen: new Date(c.lastSeen).toISOString(),
      }).select('id').single();
      if (error) { console.warn(`  cluster insert failed: ${error.message}`); continue; }
      c.id = ins.id;
    } else {
      const { error } = await supabase.from('trend_clusters').update({
        outlet_count: c.domains.size || c.itemCount, item_count: c.itemCount, velocity,
        last_seen: new Date(c.lastSeen).toISOString(),
      }).eq('id', c.id);
      if (error) { console.warn(`  cluster update failed: ${error.message}`); continue; }
    }
    clustersTouched += 1;
    // assign cluster_id + embedding to the (already-existing) items via UPDATE
    // (an upsert would attempt an INSERT and trip the NOT NULL columns).
    const results = await Promise.all(
      c.itemIds.map((id) =>
        supabase.from('trend_items').update({ cluster_id: c.id, embedding: embById.get(id) }).eq('id', id),
      ),
    );
    const failed = results.filter((r) => r.error);
    if (failed.length) console.warn(`  ${failed.length} item assigns failed: ${failed[0].error?.message}`);
  }

  console.log(`  clustered ${rows.length} items into ${clustersTouched} touched clusters`);
  return clustersTouched;
}

async function main(): Promise<void> {
  loadEnvLocal();
  requireEnv('VOYAGE_API_KEY'); requireEnv('PUBLIC_SUPABASE_URL'); requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = serviceClient();
  const arg = (process.argv[2] ?? 'all').toLowerCase();
  const topics: Topic[] = arg === 'all' ? [...TOPICS] : [arg as Topic];
  if (arg !== 'all' && !TOPICS.includes(arg as Topic)) {
    console.error(`Usage: npm run reactive:cluster -- <${TOPICS.join('|')}|all>`); process.exit(1);
  }
  for (const t of topics) {
    try { await clusterTopic(supabase, t); }
    catch (err) { console.error(`  ! ${t}: ${err instanceof Error ? err.message : err}`); }
  }
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('cluster.ts');
if (invokedDirectly) {
  main().catch((err) => { console.error('reactive:cluster failed:', err instanceof Error ? err.message : err); process.exit(1); });
}
