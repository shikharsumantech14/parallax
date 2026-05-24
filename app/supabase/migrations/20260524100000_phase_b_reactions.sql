-- Parallax — Phase B reactions
-- Created: 2026-05-24
--
-- Adds the `reactions` table. Four kinds, multi-select per issue (so a reader
-- can be both "thinking" and "want more"). Composite PK enforces no
-- duplicate same-kind reactions from the same user on the same issue.
--
-- Counts are aggregated server-side via the admin client (bypasses RLS).
-- Visibility of the count only shows once total reactions on an issue ≥ 3,
-- to avoid the "0 likes" loneliness — that logic lives in the API, not here.

CREATE TABLE IF NOT EXISTS public.reactions (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_id    text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('think', 'agree', 'disagree', 'want_more')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, issue_id, kind)
);

COMMENT ON TABLE public.reactions IS 'Reader reactions to issues. Multi-select per issue. PK enforces uniqueness per (user, issue, kind).';

CREATE INDEX IF NOT EXISTS reactions_issue_kind_idx
  ON public.reactions (issue_id, kind);

CREATE INDEX IF NOT EXISTS reactions_user_idx
  ON public.reactions (user_id, created_at DESC);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Owner-only SELECT (admin client bypasses for aggregate count queries).
DROP POLICY IF EXISTS "reactions_select_own" ON public.reactions;
CREATE POLICY "reactions_select_own"
  ON public.reactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reactions_insert_own" ON public.reactions;
CREATE POLICY "reactions_insert_own"
  ON public.reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reactions_delete_own" ON public.reactions;
CREATE POLICY "reactions_delete_own"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.reactions TO authenticated;
