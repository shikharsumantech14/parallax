-- Parallax — Phase B: letter author attribution
-- Created: 2026-06-01
--
-- Adds a denormalised author display name to `comments`, captured at submit
-- time for public attribution of *letters* (rows where anchor IS NULL).
--
-- Why denormalise instead of joining profiles at display time: profiles are
-- RLS-private (`profiles_select_own` in the Phase A migration), so the
-- anon/user client that renders a public letters list cannot read another
-- reader's display_name. Storing the chosen name on the comment row at INSERT
-- sidesteps that, and lets the reader control exactly what gets published.
--
-- Nullable: annotations and unsigned letters leave it NULL (the UI falls back
-- to "A reader"). No RLS change — the column inherits the table's policies and
-- the existing table-level grants to `authenticated`. Append-only, idempotent.

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS author_name text;

-- Length guard, added idempotently (Postgres has no ADD CONSTRAINT IF NOT EXISTS).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'comments_author_name_len_check'
  ) THEN
    ALTER TABLE public.comments
      ADD CONSTRAINT comments_author_name_len_check
      CHECK (author_name IS NULL OR length(author_name) <= 80);
  END IF;
END$$;

COMMENT ON COLUMN public.comments.author_name IS 'Denormalised display name the reader signed a letter with, captured at submit time (profiles are RLS-private, so it cannot be joined at display). NULL for annotations and unsigned letters; the UI falls back to "A reader".';
