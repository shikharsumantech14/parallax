-- Parallax — Phase B comments (annotations + Letters)
-- Created: 2026-05-24
--
-- Single table covers both surfaces:
--   - Annotations: anchored to a specific text selection in an issue.
--     `anchor` JSON populated with W3C TextQuoteSelector shape:
--       { before: string, exact: string, after: string, section_index?: int }
--   - Letters: end-of-issue submissions, no anchor. `anchor` is NULL.
--
-- Statuses:
--   - pending   — submitted; private to author + editor. Default.
--   - approved  — editor promoted to public. Visible to all readers.
--   - hidden    — editor declined or removed for moderation reasons.
--   - removed   — author deleted their own.

CREATE TABLE IF NOT EXISTS public.comments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_id        text NOT NULL,
  parent_id       uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body_md         text NOT NULL CHECK (length(body_md) >= 1 AND length(body_md) <= 2000),
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'hidden', 'removed')),
  anchor          jsonb,
  ai_risk_score   integer CHECK (ai_risk_score IS NULL OR (ai_risk_score >= 0 AND ai_risk_score <= 100)),
  created_at      timestamptz NOT NULL DEFAULT now(),
  edited_at       timestamptz,
  CONSTRAINT comments_anchor_shape_check CHECK (
    anchor IS NULL
    OR (
      jsonb_typeof(anchor) = 'object'
      AND anchor ? 'exact'
      AND length(anchor->>'exact') <= 1000
    )
  )
);

COMMENT ON TABLE public.comments IS 'Annotations (with anchor JSON) and Letters (without anchor). All start status=pending; editor promotes to approved for public display.';
COMMENT ON COLUMN public.comments.anchor IS 'NULL for Letters. For annotations: W3C TextQuoteSelector { before, exact, after, section_index? }.';
COMMENT ON COLUMN public.comments.ai_risk_score IS 'Optional 0-100 toxicity score from Haiku pre-moderation. Editor uses to prioritise queue.';

CREATE INDEX IF NOT EXISTS comments_issue_status_idx
  ON public.comments (issue_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS comments_user_idx
  ON public.comments (user_id, created_at DESC);

-- Moderation queue convenience: pending items only, sorted by oldest first
-- so editor sees the longest-waiting submissions at the top.
CREATE INDEX IF NOT EXISTS comments_moderation_queue_idx
  ON public.comments (created_at ASC)
  WHERE status = 'pending';

-- Updated-at trigger reuses the existing public.set_updated_at function
-- defined in the Phase A migration.
DROP TRIGGER IF EXISTS comments_set_edited_at ON public.comments;
CREATE OR REPLACE FUNCTION public.set_edited_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.body_md IS DISTINCT FROM OLD.body_md THEN
    NEW.edited_at = now();
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER comments_set_edited_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_edited_at();

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- SELECT policy: a reader can see their own comments (any status) PLUS all
-- approved comments on any issue. Hidden/removed comments are invisible
-- except to their author (so the author knows it was hidden).
DROP POLICY IF EXISTS "comments_select_own_or_approved" ON public.comments;
CREATE POLICY "comments_select_own_or_approved"
  ON public.comments FOR SELECT
  USING (
    status = 'approved'
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

-- INSERT policy: must be authenticated. user_id must match auth.uid().
-- Status defaults to 'pending' — no one can insert with a non-default status.
DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
CREATE POLICY "comments_insert_own"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
    AND status = 'pending'
  );

-- UPDATE policy: authors can edit body and soft-remove (status -> removed).
-- Promotion to 'approved' and demotion to 'hidden' is editor-only (uses
-- service_role from server-side moderation endpoints, which bypass RLS).
DROP POLICY IF EXISTS "comments_update_own" ON public.comments;
CREATE POLICY "comments_update_own"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('pending', 'removed')
  );

-- DELETE policy: soft delete preferred via UPDATE to status='removed', but
-- allow hard delete for the author too (cascades cleanly).
DROP POLICY IF EXISTS "comments_delete_own" ON public.comments;
CREATE POLICY "comments_delete_own"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO anon;
