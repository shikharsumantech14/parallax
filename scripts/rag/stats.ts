/**
 * RAG corpus stats — what's actually ingested.
 *   npx tsx scripts/rag/stats.ts   (npm run rag:stats)
 * Needs PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { loadEnvLocal, requireEnv, serviceClient } from '../lib/social.js';

async function main(): Promise<void> {
  loadEnvLocal();
  requireEnv('PUBLIC_SUPABASE_URL');
  requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = serviceClient();

  const { count, error } = await supabase.from('rag_chunks').select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  console.log(`rag_chunks total: ${count ?? 0}`);
  if (!count) { console.log('Corpus is EMPTY — nothing ingested yet.'); return; }

  const { data } = await supabase.from('rag_chunks').select('tier, source_id, ingest_class').limit(20000);
  const rows = (data ?? []) as { tier: string; source_id: string; ingest_class: string }[];
  const tally = (key: keyof (typeof rows)[number]) => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r[key], (m.get(r[key]) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  console.log('by tier:', tally('tier'));
  console.log('by ingest_class:', tally('ingest_class'));
  const sources = tally('source_id');
  console.log(`distinct sources: ${sources.length}`);
  console.log('top sources:', sources.slice(0, 15));
}

main().catch((e) => { console.error('rag:stats failed:', e instanceof Error ? e.message : e); process.exit(1); });
