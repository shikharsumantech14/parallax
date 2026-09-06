-- Parallax — RAG corpus (pgvector + hybrid search)
-- Created: 2026-06-21
--
-- One chunk table for the research corpus the editorial agents query. Every
-- chunk carries full PROVENANCE so the verifier can trace any drafted claim
-- back to a primary source URL/page (claim → chunk → source_id → original).
--
-- Two-tier copyright model (India worst-case — see research/_sources/README.md
-- "Two-tier ingestion & quoting"):
--   - ingest_class='open-fulltext'  → retrievable AND quotable
--   - ingest_class='metadata-only'  → retrievable to GUIDE the agent, NOT
--     quotable. The verifier rejects any quote backed by a metadata-only chunk.
--
-- Admin/cron-only (written by scripts/rag/ingest.ts via service-role, read by
-- the in-process MCP search tool via service-role). NOT reader-facing → RLS
-- enabled with no anon/authenticated policies (deny-by-default; service_role
-- bypasses RLS).

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.rag_chunks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     text NOT NULL,                 -- allowlist source id (e.g. 'prs-billtrack')
  work_title    text,
  authors       text,
  year          integer,
  venue         text,                          -- publisher / journal / agency
  doi_or_url    text NOT NULL,                 -- citation URL — HARD requirement (ingest fails without it)
  license       text,
  tier          text NOT NULL
                CHECK (tier IN ('T0','T1','T2','T3','T4','T5','T6','T7')),
  viewpoint     text,                          -- cluster id, or 'n/a' for primary/data tiers
  ingest_class  text NOT NULL
                CHECK (ingest_class IN ('open-fulltext','metadata-only')),
  kind          text NOT NULL
                CHECK (kind IN ('article','research-paper','book-chapter','dataset','podcast-transcript','official-document','report')),
  section_title text,
  page_start    integer,
  page_end      integer,
  char_span     integer,
  content       text NOT NULL CHECK (length(content) >= 1),
  chunk_hash    text NOT NULL,                 -- sha256(source_id|doc-version|content) — stable citation id
  retrieved_at  timestamptz,
  embedding     vector(1024),                  -- Voyage voyage-4, 1024-dim (int8 stored as float by pgvector)
  fts           tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.rag_chunks IS 'RAG corpus chunks with full provenance + two-tier copyright class. Admin/cron-only; service_role access. Agents query via the in-process MCP tool mcp__parallax_rag__search.';
COMMENT ON COLUMN public.rag_chunks.ingest_class IS 'open-fulltext = quotable; metadata-only = guide-only, NOT quotable (verifier rejects quotes from these).';
COMMENT ON COLUMN public.rag_chunks.chunk_hash IS 'sha256(source_id|doc-version|content). UNIQUE — re-ingest upserts on this, so the citation id is stable across runs.';
COMMENT ON COLUMN public.rag_chunks.doi_or_url IS 'The primary-source citation URL. NOT NULL — ingest hard-fails on any chunk missing it, so the claim→source audit chain never breaks.';

-- Idempotent re-ingest: a chunk is identified by its content hash.
CREATE UNIQUE INDEX IF NOT EXISTS rag_chunks_hash_key ON public.rag_chunks (chunk_hash);

-- Semantic search: HNSW over cosine distance (pgvector).
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx
  ON public.rag_chunks USING hnsw (embedding vector_cosine_ops);

-- Keyword search: GIN over the generated tsvector (exact-term grounding —
-- statutes, proper nouns, figures, dataset codes — that pure vector misses).
CREATE INDEX IF NOT EXISTS rag_chunks_fts_idx ON public.rag_chunks USING gin (fts);

CREATE INDEX IF NOT EXISTS rag_chunks_source_idx ON public.rag_chunks (source_id);
CREATE INDEX IF NOT EXISTS rag_chunks_tier_idx ON public.rag_chunks (tier);

ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;
-- No policies / no grants to anon/authenticated → deny-by-default. service_role
-- (ingest cron + the agent search tool) bypasses RLS.

-- ── Hybrid search (Reciprocal Rank Fusion) ────────────────────────────────────
-- Fuses semantic (HNSW) + keyword (tsvector) rankings via RRF (rrf_k=50, the
-- Supabase default). Optional tier/viewpoint filters. Returns chunks + the RRF
-- score; the caller (scripts/rag/search.ts) then reranks the top N with Voyage
-- rerank-2.5. ingest_class is returned so the agent/verifier respect quotability.
CREATE OR REPLACE FUNCTION public.rag_hybrid_search(
  query_text       text,
  query_embedding  vector(1024),
  match_count      int DEFAULT 40,
  tier_filter      text[] DEFAULT NULL,
  viewpoint_filter text[] DEFAULT NULL,
  full_text_weight float DEFAULT 1.0,
  semantic_weight  float DEFAULT 1.0,
  rrf_k            int DEFAULT 50
)
RETURNS TABLE (
  id uuid, source_id text, work_title text, authors text, year integer,
  venue text, doi_or_url text, license text, tier text, viewpoint text,
  ingest_class text, kind text, section_title text, page_start integer,
  page_end integer, content text, score double precision
)
LANGUAGE sql
STABLE
AS $$
WITH params AS (
  SELECT websearch_to_tsquery('english', query_text) AS q
),
full_text AS (
  SELECT c.id,
         row_number() OVER (ORDER BY ts_rank_cd(c.fts, (SELECT q FROM params)) DESC) AS rank
  FROM public.rag_chunks c
  WHERE c.fts @@ (SELECT q FROM params)
    AND (tier_filter IS NULL OR c.tier = ANY(tier_filter))
    AND (viewpoint_filter IS NULL OR c.viewpoint = ANY(viewpoint_filter))
  ORDER BY rank
  LIMIT LEAST(match_count, 200)
),
semantic AS (
  SELECT c.id,
         row_number() OVER (ORDER BY c.embedding <=> query_embedding) AS rank
  FROM public.rag_chunks c
  WHERE c.embedding IS NOT NULL
    AND (tier_filter IS NULL OR c.tier = ANY(tier_filter))
    AND (viewpoint_filter IS NULL OR c.viewpoint = ANY(viewpoint_filter))
  ORDER BY rank
  LIMIT LEAST(match_count, 200)
),
fused AS (
  SELECT COALESCE(ft.id, se.id) AS id,
         COALESCE(full_text_weight / (rrf_k + ft.rank), 0.0)
           + COALESCE(semantic_weight / (rrf_k + se.rank), 0.0) AS score
  FROM full_text ft
  FULL OUTER JOIN semantic se ON ft.id = se.id
)
SELECT c.id, c.source_id, c.work_title, c.authors, c.year, c.venue, c.doi_or_url,
       c.license, c.tier, c.viewpoint, c.ingest_class, c.kind, c.section_title,
       c.page_start, c.page_end, c.content, f.score
FROM fused f
JOIN public.rag_chunks c ON c.id = f.id
ORDER BY f.score DESC
LIMIT match_count;
$$;

COMMENT ON FUNCTION public.rag_hybrid_search IS 'Hybrid semantic+keyword retrieval over rag_chunks via Reciprocal Rank Fusion. Optional tier/viewpoint filters. Returns ingest_class so callers respect quotability. service_role only.';
