/**
 * RAG retrieval — the function the in-process MCP tool (P3) wraps, plus a CLI.
 *
 *   npm run rag:search -- "your query" [tierCsv] [viewpointCsv]
 *
 * Pipeline: embed the query (Voyage voyage-4, input_type=query) → rag_hybrid_search
 * RPC (HNSW + tsvector fused by RRF) → rerank the top 40 with Voyage rerank-2.5
 * → return the top K chunks WITH their source_url + ingest_class, so the drafter
 * cites the original and the verifier respects quotability.
 */
import { loadEnvLocal, serviceClient } from '../lib/social.js';
import { embedOne, rerank } from '../lib/voyage.js';
import type { Tier, IngestClass, ChunkKind } from '../lib/rag.js';

export interface RagHit {
  id: string;
  source_id: string;
  work_title: string | null;
  authors: string | null;
  year: number | null;
  venue: string | null;
  source_url: string;
  license: string | null;
  tier: Tier;
  viewpoint: string | null;
  ingest_class: IngestClass; // 'open-fulltext' = quotable; 'metadata-only' = guide-only
  kind: ChunkKind;
  section_title: string | null;
  page_start: number | null;
  page_end: number | null;
  content: string;
  score: number; // RRF score from the RPC
  rerank_score: number;
}

export interface RagSearchOpts {
  topK?: number; // returned after rerank (default 8)
  candidateCount?: number; // retrieved before rerank (default 40)
  tierFilter?: Tier[];
  viewpointFilter?: string[];
}

type RpcRow = Omit<RagHit, 'source_url' | 'rerank_score'> & { doi_or_url: string };

export async function ragSearch(query: string, opts: RagSearchOpts = {}): Promise<RagHit[]> {
  const topK = opts.topK ?? 8;
  const candidateCount = opts.candidateCount ?? 40;
  const supabase = serviceClient();

  const queryEmbedding = await embedOne(query, 'query');

  const { data, error } = await supabase.rpc('rag_hybrid_search', {
    query_text: query,
    query_embedding: queryEmbedding,
    match_count: candidateCount,
    tier_filter: opts.tierFilter ?? null,
    viewpoint_filter: opts.viewpointFilter ?? null,
  });
  if (error) throw new Error(`rag_hybrid_search failed: ${error.message}`);

  const rows = (data ?? []) as RpcRow[];
  if (rows.length === 0) return [];

  // Rerank the candidate set with Voyage rerank-2.5.
  const order = await rerank(query, rows.map((r) => r.content), topK);

  return order.map(({ index, score }) => {
    const r = rows[index];
    return {
      id: r.id,
      source_id: r.source_id,
      work_title: r.work_title,
      authors: r.authors,
      year: r.year,
      venue: r.venue,
      source_url: r.doi_or_url,
      license: r.license,
      tier: r.tier,
      viewpoint: r.viewpoint,
      ingest_class: r.ingest_class,
      kind: r.kind,
      section_title: r.section_title,
      page_start: r.page_start,
      page_end: r.page_end,
      content: r.content,
      score: r.score,
      rerank_score: score,
    };
  });
}

// ── CLI ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnvLocal();
  const [query, tierCsv, viewpointCsv] = process.argv.slice(2);
  if (!query) {
    console.error('Usage: npm run rag:search -- "<query>" [tierCsv e.g. T0,T2] [viewpointCsv]');
    process.exit(1);
  }
  const hits = await ragSearch(query, {
    tierFilter: tierCsv ? (tierCsv.split(',') as Tier[]) : undefined,
    viewpointFilter: viewpointCsv ? viewpointCsv.split(',') : undefined,
  });
  if (hits.length === 0) {
    console.log('No matches. (Has the corpus been ingested for this topic?)');
    return;
  }
  for (const h of hits) {
    const quote = h.ingest_class === 'open-fulltext' ? 'quotable' : 'guide-only';
    console.log(`\n[${h.tier} · ${quote} · rerank ${h.rerank_score.toFixed(3)}] ${h.work_title ?? h.source_id}`);
    console.log(`  ${h.source_url}${h.page_start ? ` · p.${h.page_start}` : ''}`);
    console.log(`  ${h.content.slice(0, 240)}${h.content.length > 240 ? '…' : ''}`);
  }
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('search.ts');
if (invokedDirectly) {
  main().catch((err) => {
    console.error('rag:search failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
