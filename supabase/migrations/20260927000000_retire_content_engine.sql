-- Retire the content engine (2026-09-27).
--
-- Drops the five tables the June 2026 background loops wrote to — the
-- evergreen social loop (social_posts, promotions), the RAG research corpus
-- (rag_chunks + rag_hybrid_search) and the reactive news loop (trend_items,
-- trend_clusters). None of them is read by any route after this date; the
-- loops' code, workflows, agents and the /admin/social queue were deleted in
-- the same commit (docs/archive/CONTENT-ENGINE.md records what they were).
--
-- State at retirement, for the record: social_posts 8 rows (1 posted),
-- promotions 8, rag_chunks 4, trend_clusters 121, trend_items ~114,000
-- (roughly 100 MB of news snippets on the free tier — the reason to run this
-- soon), social-cards 7 objects.
--
-- NOT APPLIED by the existence of this file. The operator runs it in the
-- Supabase SQL editor (or `supabase db push`). Idempotent: safe to run twice.
--
-- Left in place on purpose:
--   * the `vector` extension — nothing else depends on it, but dropping an
--     extension is a project-level call, not a cleanup;
--   * public.set_updated_at() — the phase A / B tables (profiles, comments)
--     share the same trigger function.

BEGIN;

-- Reactive news loop (trend_items.cluster_id → trend_clusters).
DROP TABLE IF EXISTS public.trend_items CASCADE;
DROP TABLE IF EXISTS public.trend_clusters CASCADE;

-- RAG corpus.
DROP FUNCTION IF EXISTS public.rag_hybrid_search CASCADE;
DROP TABLE IF EXISTS public.rag_chunks CASCADE;

-- Evergreen social loop (promotions.social_post_id → social_posts).
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.social_posts CASCADE;

COMMIT;

-- The per-post card images live in the `social-cards` storage bucket, which
-- this file does NOT touch. Supabase refuses direct SQL deletes on
-- storage.objects / storage.buckets (storage.protect_delete(), error 42501),
-- and the first version of this file learned that the hard way: the DELETE
-- failed inside the transaction and rolled back every table drop with it.
-- Empty and delete the bucket from the dashboard (Storage → social-cards →
-- delete the folders, then delete the bucket) or through the Storage API with
-- the service-role key:
--   POST   /storage/v1/bucket/social-cards/empty
--   DELETE /storage/v1/bucket/social-cards
