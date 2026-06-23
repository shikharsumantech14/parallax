-- Social learning loop: store per-post engagement so the voice-refiner can learn
-- from what actually performed. Additive + idempotent. The metrics job
-- (scripts/social/metrics.ts) fills `engagement` ~daily for posted rows.
alter table social_posts
  add column if not exists engagement jsonb,
  add column if not exists engagement_fetched_at timestamptz;

comment on column social_posts.engagement is
  'Latest platform metrics for a posted row, e.g. {"likes":N,"reposts":N,"replies":N,"quotes":N}. Filled by scripts/social/metrics.ts.';
