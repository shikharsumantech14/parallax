-- Parallax — Reactive news pipeline state (trend_items + trend_clusters)
-- Created: 2026-06-21
--
-- The reactive pipeline scrapes free, commercial-clean news sources (GDELT +
-- RSS), dedups the same story across outlets into clusters, scores trending,
-- and routes the trending ones to EITHER an issue candidate OR a pending social
-- post (or both) — always human-gated.
--
--   trend_items    : one row per scraped article (UNIQUE url_hash → cross-run dedup)
--   trend_clusters : same-story-across-outlets, with a trending score + routing verdict
--
-- Admin/cron-only (service-role). RLS enabled, no anon/authenticated policies.

CREATE EXTENSION IF NOT EXISTS vector;

-- ── trend_clusters ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.trend_clusters (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic         text NOT NULL
                CHECK (topic IN ('politics','space','earth','tech','travel','sports')),
  rep_title     text NOT NULL,                 -- representative headline
  rep_url       text NOT NULL,
  centroid      vector(1024),                  -- representative embedding (for dedup vs new items)
  outlet_count  integer NOT NULL DEFAULT 1,    -- distinct domains carrying the story
  item_count    integer NOT NULL DEFAULT 1,
  velocity      double precision NOT NULL DEFAULT 0, -- items per hour over the window
  first_seen    timestamptz NOT NULL DEFAULT now(),
  last_seen     timestamptz NOT NULL DEFAULT now(),
  route_verdict text                           -- NULL=unrouted; 'issue-candidate'|'social'|'both'|'ignore'
                CHECK (route_verdict IS NULL OR route_verdict IN ('issue-candidate','social','both','ignore')),
  routed_at     timestamptz,                   -- set once routed (don't re-route)
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.trend_clusters IS 'Same-story-across-outlets clusters with a trending score + routing verdict. Admin/cron-only.';

CREATE INDEX IF NOT EXISTS trend_clusters_topic_idx ON public.trend_clusters (topic, last_seen DESC);
CREATE INDEX IF NOT EXISTS trend_clusters_unrouted_idx
  ON public.trend_clusters (topic, last_seen DESC) WHERE routed_at IS NULL;

ALTER TABLE public.trend_clusters ENABLE ROW LEVEL SECURITY;

-- ── trend_items ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.trend_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic         text NOT NULL
                CHECK (topic IN ('politics','space','earth','tech','travel','sports')),
  url           text NOT NULL,
  url_hash      text NOT NULL,                 -- sha256(normalised url) — cross-run dedup
  title         text NOT NULL,
  snippet       text,
  domain        text,
  source        text,                          -- 'gdelt' | feed name
  published_at  timestamptz,
  embedding     vector(1024),                  -- set in the cluster stage
  cluster_id    uuid REFERENCES public.trend_clusters(id) ON DELETE SET NULL,
  fetched_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.trend_items IS 'One row per scraped article. UNIQUE url_hash dedups across cron runs. Pruned past ~30-60 days to stay under the free-tier DB cap.';

CREATE UNIQUE INDEX IF NOT EXISTS trend_items_url_hash_key ON public.trend_items (url_hash);
CREATE INDEX IF NOT EXISTS trend_items_topic_idx ON public.trend_items (topic, fetched_at DESC);
CREATE INDEX IF NOT EXISTS trend_items_unclustered_idx
  ON public.trend_items (topic, fetched_at DESC) WHERE cluster_id IS NULL;

ALTER TABLE public.trend_items ENABLE ROW LEVEL SECURITY;
-- Deny-by-default; service_role (ingest/cluster/route cron) bypasses RLS.
