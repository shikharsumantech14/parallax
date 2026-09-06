-- Parallax — Journey onboarding (post-signup /welcome)
-- Created: 2026-07-05
--
-- Adds the two columns the app /welcome flow needs:
--   profiles.welcomed_at       — NULL until the reader completes (or skips)
--                                the one-time welcome; the /auth/callback gate
--                                routes NULL → /welcome, non-NULL → next.
--   profiles.stated_interests  — the worlds the reader picked ("put these first
--                                on my shelf"); blended with computed
--                                topic_affinity by the dashboard.
--
-- Everything else the journey needs (progress, streaks, affinity, margins)
-- derives from existing tables — reading_events, saved_issues, comments.
--
-- Apply via:
--   supabase db push                         (when CLI is wired)
--   OR paste this into Supabase SQL editor   (one-time)
--
-- Idempotent: safe to re-run (ADD COLUMN IF NOT EXISTS).

-- ============================================================================
-- profiles — onboarding columns
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS welcomed_at      timestamptz,
  ADD COLUMN IF NOT EXISTS stated_interests text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.profiles.welcomed_at IS 'When the reader completed or skipped the one-time app /welcome. NULL = not yet welcomed; /auth/callback routes NULL sessions to /welcome.';
COMMENT ON COLUMN public.profiles.stated_interests IS 'Worlds the reader chose at welcome (subset of politics/space/earth/tech/travel/sports). Blended with computed topic_affinity on the dashboard.';

-- No new GRANT or RLS policy needed:
--   • The Phase-A `GRANT SELECT, UPDATE ON public.profiles TO authenticated` is
--     table-level, so it already covers these new columns.
--   • The `profiles_update_own` policy (auth.uid() = id, WITH CHECK the same)
--     already lets a reader write their own row — which is exactly what
--     /api/onboarding does (welcomed_at + stated_interests + display_name).
