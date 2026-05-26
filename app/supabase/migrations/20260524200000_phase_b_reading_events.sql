-- Parallax — Phase B reading events
-- Created: 2026-05-24
--
-- The reading_events table is the data foundation for Phase B / C / D.
-- Every meaningful interaction on an issue page becomes a row here.
--
-- v1 is intentionally a flat table (not partitioned). Partition by month
-- when row count > ~5M (probably ~12 months in at 1k MAU). Migration to
-- partitioned is straightforward via pg_partman or a one-time ALTER.
--
-- Anonymous tracking is allowed: rows with user_id = NULL and anon_id =
-- a uuid set by the publication client. Once a user signs in, we don't
-- back-fill anon_id rows — they stay anonymous in perpetuity. This is
-- privacy-friendly and good enough for aggregate reach numbers.

CREATE TABLE IF NOT EXISTS public.reading_events (
  id            bigserial PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  anon_id       uuid,
  issue_id      text NOT NULL,
  event_kind    text NOT NULL CHECK (event_kind IN (
    'open',
    'scroll_25',
    'scroll_75',
    'finish',
    'share',
    'source_click',
    'term_lookup'
  )),
  meta          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  -- Either authenticated (user_id) or anonymous (anon_id) — never both NULL.
  CONSTRAINT reading_events_subject_check CHECK (
    user_id IS NOT NULL OR anon_id IS NOT NULL
  )
);

COMMENT ON TABLE public.reading_events IS 'Reader interaction events. Anonymous via anon_id cookie or authenticated via user_id. Foundation for Phase B topic affinity, Phase C personalisation.';
COMMENT ON COLUMN public.reading_events.event_kind IS 'open / scroll_25 / scroll_75 / finish / share / source_click / term_lookup';
COMMENT ON COLUMN public.reading_events.meta IS 'Per-event-kind JSON. For source_click: { url, label }. For term_lookup: { term }. For share: { channel }. Etc.';

-- Indexes for the common query shapes
-- 1. Per-issue aggregation (reach, finish rate)
CREATE INDEX IF NOT EXISTS reading_events_issue_idx
  ON public.reading_events (issue_id, created_at DESC);

-- 2. Per-user history (dashboard, topic affinity job)
CREATE INDEX IF NOT EXISTS reading_events_user_idx
  ON public.reading_events (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- 3. Per-anon-id (dedup, anonymous engagement reports)
CREATE INDEX IF NOT EXISTS reading_events_anon_idx
  ON public.reading_events (anon_id, created_at DESC)
  WHERE anon_id IS NOT NULL;

-- 4. Per-event-kind aggregates (which events fire most, abuse detection)
CREATE INDEX IF NOT EXISTS reading_events_kind_idx
  ON public.reading_events (event_kind, created_at DESC);

ALTER TABLE public.reading_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own events (dashboard self-view).
DROP POLICY IF EXISTS "reading_events_select_own" ON public.reading_events;
CREATE POLICY "reading_events_select_own"
  ON public.reading_events FOR SELECT
  USING (auth.uid() = user_id);

-- Both anon and authenticated users can insert their own events.
-- The API endpoint validates anon_id vs user_id consistency before insert.
DROP POLICY IF EXISTS "reading_events_insert_anon" ON public.reading_events;
CREATE POLICY "reading_events_insert_anon"
  ON public.reading_events FOR INSERT
  WITH CHECK (
    -- Authenticated insert: user_id must match auth.uid()
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    -- OR anonymous insert: user_id must be NULL and anon_id must be present
    OR (auth.uid() IS NULL AND user_id IS NULL AND anon_id IS NOT NULL)
  );

-- No UPDATE or DELETE policies — events are append-only. Account deletion
-- cascades via the FK ON DELETE CASCADE.

GRANT SELECT, INSERT ON public.reading_events TO authenticated;
GRANT INSERT ON public.reading_events TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.reading_events_id_seq TO authenticated, anon;
