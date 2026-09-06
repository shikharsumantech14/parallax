-- Parallax — Phase A foundation
-- Created: 2026-05-24
--
-- Tables: profiles, saved_issues, newsletter_subscriptions
-- All RLS-enabled. Owner-only access by default.
--
-- Apply via:
--   supabase db push                         (when CLI is wired)
--   OR paste this into Supabase SQL editor   (one-time)
--
-- Idempotent: safe to re-run (CREATE IF NOT EXISTS where possible).

-- ============================================================================
-- profiles
-- ============================================================================
-- One row per authenticated user. Created automatically by a trigger on
-- auth.users insertion. `topic_affinity` and `email_prefs` are denormalised
-- jsonb so the dashboard reads them in one query without joining
-- reading_events (which is partitioned and expensive to aggregate at
-- request time).

CREATE TABLE IF NOT EXISTS public.profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      text,
  email             text NOT NULL,
  topic_affinity    jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_prefs       jsonb NOT NULL DEFAULT '{
    "weekly_digest": true,
    "issue_publish": true,
    "reengagement": true
  }'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'One row per authenticated user. Mirrors auth.users via id.';
COMMENT ON COLUMN public.profiles.topic_affinity IS 'Denormalised topic affinity score map (e.g. {"politics": 0.42, "earth": 0.18}). Recomputed nightly from reading_events. Empty until Phase B.';
COMMENT ON COLUMN public.profiles.email_prefs IS 'Newsletter preferences. Per-channel opt-out flags.';

CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles (created_at DESC);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Auto-create a profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No INSERT policy — only the auth trigger can insert.
-- No DELETE policy — cascade from auth.users delete handles it.

-- ============================================================================
-- saved_issues
-- ============================================================================
-- Composite PK on (user_id, issue_id) means saving the same issue twice is
-- idempotent. issue_id is text — issues live in MDX, not in the DB, so we
-- don't FK to a non-existent table.

CREATE TABLE IF NOT EXISTS public.saved_issues (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_id    text NOT NULL,
  saved_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, issue_id)
);

COMMENT ON TABLE public.saved_issues IS 'A user''s save-for-later shelf. issue_id matches the issue slug in src/content/issues/.';

CREATE INDEX IF NOT EXISTS saved_issues_user_saved_at_idx
  ON public.saved_issues (user_id, saved_at DESC);

ALTER TABLE public.saved_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_issues_select_own" ON public.saved_issues;
CREATE POLICY "saved_issues_select_own"
  ON public.saved_issues FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_issues_insert_own" ON public.saved_issues;
CREATE POLICY "saved_issues_insert_own"
  ON public.saved_issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_issues_delete_own" ON public.saved_issues;
CREATE POLICY "saved_issues_delete_own"
  ON public.saved_issues FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- newsletter_subscriptions
-- ============================================================================
-- Anonymous signups are allowed (user_id NULL). Once a user authenticates
-- with the same email, the app's /api/auth/callback links the row by
-- setting user_id.

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text NOT NULL UNIQUE,
  user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  topic_prefs         jsonb NOT NULL DEFAULT '{
    "politics": true,
    "space": true,
    "earth": true,
    "tech": true,
    "travel": true,
    "sports": true
  }'::jsonb,
  cadence             text NOT NULL DEFAULT 'weekly'
                      CHECK (cadence IN ('weekly', 'per_issue', 'monthly')),
  confirmation_token  text,
  confirmed_at        timestamptz,
  unsubscribed_at     timestamptz,
  provider_id         text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.newsletter_subscriptions IS 'Anonymous + authenticated newsletter list. Double-opt-in via confirmation_token.';
COMMENT ON COLUMN public.newsletter_subscriptions.provider_id IS 'Resend audience contact id, for sync with Resend Audiences.';

CREATE INDEX IF NOT EXISTS newsletter_subs_email_idx
  ON public.newsletter_subscriptions (email);

CREATE INDEX IF NOT EXISTS newsletter_subs_user_id_idx
  ON public.newsletter_subscriptions (user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS newsletter_subs_confirmed_idx
  ON public.newsletter_subscriptions (confirmed_at)
  WHERE unsubscribed_at IS NULL;

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anonymous insert allowed (used by the publication's footer signup form).
-- We rate-limit at the app's API layer, not in the DB.
DROP POLICY IF EXISTS "newsletter_anon_insert" ON public.newsletter_subscriptions;
CREATE POLICY "newsletter_anon_insert"
  ON public.newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view + update their own row (link via user_id).
DROP POLICY IF EXISTS "newsletter_select_own" ON public.newsletter_subscriptions;
CREATE POLICY "newsletter_select_own"
  ON public.newsletter_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "newsletter_update_own" ON public.newsletter_subscriptions;
CREATE POLICY "newsletter_update_own"
  ON public.newsletter_subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No DELETE policy — soft-delete via unsubscribed_at timestamp.
-- Hard deletion happens via the account-deletion flow using service_role.

-- ============================================================================
-- Grants
-- ============================================================================
-- Supabase exposes the `anon` and `authenticated` roles to the JS client.
-- RLS policies above gate actual access; grants here permit the request
-- to reach RLS in the first place.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_issues TO authenticated;
GRANT SELECT, UPDATE ON public.newsletter_subscriptions TO authenticated;
GRANT INSERT ON public.newsletter_subscriptions TO anon;
