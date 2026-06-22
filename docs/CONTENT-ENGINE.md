# Parallax content engine — operator guide

> The voice + sources + RAG + social-automation engine built on top of the
> editorial pipeline. Everything is in-repo and build-green; this guide is the
> go-live checklist. Architecture + rationale + per-decision confidence scores
> live in the approved plan. Built phases: **P0–P4**. Remaining: **P5 (posting +
> account) · P6 (hardening)** — your go-live.

---

## What's been built (P0–P4)

| Phase | What it does | Key files |
|---|---|---|
| **P0 Voice + Sources** | One shared voice contract read by every writing agent; 6 allowlists expanded to ~50–80 tiered, viewpoint-tagged sources; a diversity gate in discovery | `research/_voice/_voice-core.md`, `.claude/agents/voice-checker.md`, `research/_sources/_TAXONOMY.md` + the 6 `<topic>.md` |
| **P1 Evergreen social** | Daily cron turns a published issue into a voice-correct post + on-brand card → pending queue → you approve at `/admin/social` | `.claude/agents/social-writer.md`, `scripts/evergreen/promote.ts`, `scripts/social-cards.ts`, `app/src/pages/admin/social.astro` |
| **P2 RAG core** | Corpus in Supabase pgvector (Voyage voyage-4 + hybrid search + rerank-2.5), tier-gated + citation-safe ingest | `scripts/rag/{ingest,search}.ts`, `scripts/lib/{voyage,rag,rag-mcp}.ts`, `*_rag_chunks.sql` |
| **P3 RAG → agents** | discovery/researcher/verifier retrieve from the corpus via `mcp__parallax_rag__search`; verifier enforces quote-from-original | `scripts/lib/runner.ts` (+mcpServers), the 3 agent `.md` |
| **P4 Reactive news** | Scrapes GDELT/RSS → clusters → Haiku classifier → routes to a pending reactive post AND/OR an issue candidate | `scripts/reactive/{ingest,cluster,route}.ts` + `sources.config.ts`, `.claude/agents/news-classifier.md`, `*_trend_items_clusters.sql` |

**Three guarantees baked in:** one voice everywhere · everything traces to a
primary source (RAG citation chain + the two-tier copyright gate) · **a human
approves every post and every issue candidate** (nothing auto-publishes).

---

## Go-live checklist (operator)

### 1. Secrets (never in the repo)
Set as **GitHub Actions secrets** (Settings → Secrets → Actions) and, where the
app needs them, **Vercel env**:

| Secret | Used by | Already have? |
|---|---|---|
| `ANTHROPIC_API_KEY` | social-writer, news-classifier, editorial pipeline | yes (pipeline) |
| `PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | every queue/corpus write; the app already uses these | yes (app) |
| `PUBLIC_SITE_URL` | issue links | — |
| `VOYAGE_API_KEY` | RAG + reactive embeddings/rerank ([dash.voyageai.com](https://dash.voyageai.com)) | new |
| `TYPEFULLY_API_KEY` | posting (P5) | new |
| `GROBID_URL` *(optional)* | academic-PDF ingest | optional |

### 2. Apply migrations (Supabase SQL editor or `supabase db push`)
- `app/supabase/migrations/20260621000000_social_pipeline.sql` (social_posts + promotions)
- `app/supabase/migrations/20260621010000_rag_chunks.sql` (pgvector corpus + hybrid_search)
- `app/supabase/migrations/20260621020000_trend_items_clusters.sql` (reactive state)

### 3. Storage + fonts
- Create a **public** Supabase Storage bucket `social-cards`.
- `node scripts/fetch-fonts.mjs`, then add a **static** `Fraunces-SemiBold.ttf` to
  `assets/fonts/` (Fraunces ships variable-only; static is needed — JetBrains Mono
  fetches fine). Commit `assets/fonts/` for deterministic CI. Without it, cards
  render text-only (the pipeline still works).

### 4. Smoke-test locally (`.env.local` from `.env.example`)
```
npm install
npm run social:evergreen -- --dry        # see a generated post
npm run rag:ingest -- politics --limit 3  # seed a few chunks (needs VOYAGE + Supabase)
npm run rag:search -- "delimitation"      # confirm retrieval + citations
npm run reactive:ingest -- space --dry    # see scraped + pre-filtered items
```
Then run without `--dry` and review at `app` → `/admin/social`.

### 5. Enable the workflows
`.github/workflows/`: `evergreen-promote.yml` (daily), `rag-ingest.yml` (weekly),
`reactive-news.yml` (every 6h). They no-op safely until secrets are set.

---

## P5 — Posting (built) + account (yours)

The engine generates → queues → you approve → **the poster publishes**. The poster
is built; what's left is yours: the accounts + the posting credential.

- **Poster (built):** `scripts/social/post.ts` + `scripts/lib/poster.ts` —
  `npm run social:post` reads `status='approved'` rows, posts the body natively +
  the `link_url` in the **first reply** + the thread, then sets `status='posted'`
  + `permalink` (or `failed` + `error_log`). Backends: **bluesky** (direct AT
  Protocol — free, no link penalty; solid) and **typefully** (scheduler holding
  the X relationship — avoids the $0.20/link charge; **verify its endpoint/auth in
  `poster.ts` against current Typefully docs**). Pick via `POSTER_BACKEND`. CI:
  `.github/workflows/social-post.yml` (hourly drain). _Refinement: media (card
  image) attach is not yet wired into the poster — posts go text + link + thread
  first; add image upload per backend when ready._
- **Account (yours):** create `@parallaxlens` on X (+ `parallaxlens.bsky.social`
  / LinkedIn / Threads). Handle, bio, avatar/banner (satori), pinned thread spec
  are in plan §A — I generate the assets on request.
- **Credential:** a Bluesky **app password** (Settings → App Passwords) and/or a
  Typefully API key. Set `POSTER_BACKEND` + the matching creds.
- **X posture (verified):** native-first, link-in-reply (in-body links are
  reach-suppressed); post via the scheduler, not the pay-per-use API; subscribe to
  X Premium as the first paid lever + monetization gate.

## P6 — Hardening
Prune `trend_items` past 30–60 days; quarterly source re-vet + licence re-date;
tune the diversity-gate + trending thresholds against real volume; Supabase Pro
when the corpus outgrows the 500 MB free tier; wire the monetization milestones
(plan §E). Also: fix the repo brand-guard grep (`Shikhar Sharma` → `Shikhar Suman`).

---

## Notes
- **Cost:** Haiku classification ~$1/day; Voyage within the 200M free monthly
  tokens at this corpus scale; GitHub Actions free minutes.
- **Operator/agent boundary:** the dev box is build-only (no secrets); the agent
  builds + verifies via `npm run build` + typecheck; you hold keys, apply
  migrations, commit, deploy.
- **Excluded news sources (cost/ToS):** X, Reddit, GNews, NewsAPI.org. GDELT +
  Google News RSS + NewsData.io (fallback) are commercial-clean.
