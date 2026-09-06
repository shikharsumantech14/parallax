-- Per-post images for threaded social explainers.
-- `images` maps a thread-post index (0 = the hook/body, 1..N = thread entries) to
-- a rendered card { ref: <public URL>, alt: <text> }. The poster attaches each to
-- its post; the link reply (appended after the thread) carries no image. Additive
-- and back-compatible — existing single-image rows keep working via image_ref.
alter table public.social_posts
  add column if not exists images jsonb not null default '{}'::jsonb;
