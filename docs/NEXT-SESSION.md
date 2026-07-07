# Next-session pickup — Parallax

> **TWO active threads.** Pick the one you're resuming:
>
> **A. PRODUCT ELEVATION (last worked 2026-07-06, the current thread).**
> P0–P4 + review-round-1 + home revamp DONE and verified; P5 blueprint breadth
> in flight; P6–P8 (Opus breadth: components from blueprints, app welcome/Shelf
> dashboard, story OG/share, pipeline wiring) next. Read `docs/design/CANON.md`
> first, then `docs/design/REVIEW-2026-07-05.md` + the task list; blueprints are
> contracts in `docs/design/blueprints/`. Gates: root build + `npm run
> design:check` + `npm run check:catalog`. ALL UNCOMMITTED — operator commits.
>
> **B. CONTENT/SOCIAL ENGINE (last worked 2026-06-23)** — the note below.

# Content/social engine pickup

> The full plan/status lives in the agent memory `content-engine-plan.md`; the
> operator runbook is `docs/CONTENT-ENGINE.md`. Last worked: 2026-06-23.

## One-paragraph state
The content engine is **live** (sources+voice, evergreen + reactive pipelines, RAG
core, editorial pipeline). Social **v2 shipped**: threaded explainers in an
accessible voice (`_voice-social.md`) with **per-beat infographic cards** rendered
from real issue data and attached per Bluesky post. The **learning loop** (engagement
metrics → `voice-refiner`) is built. Accounts live (X `@readtheparallax`, Bluesky
`parallaxlens.com`), branded. The current thread of work is **expanding the RAG
corpus + a RAG-grounded "Reactive v2"** — the corpus is essentially **empty**, so
that's the gate.

## 1. Commit the uncommitted work first (small)
These 5 files are done + type-clean but not committed (built after the last push):
`package.json` · `scripts/rag/ingest.ts` (exports `fetchAndExtract`) ·
`scripts/social/cards.ts` (added the `quote` archetype) · `scripts/rag/harvest.ts` (new) ·
`scripts/rag/stats.ts` (new).
```
git add -A
git commit -m "RAG corpus harvesters (OpenAlex + local drop) + rag:stats + social quote card"
git push origin main
```
(Everything before this — social v2, the learning loop D, the runbook — is already pushed.)

## 2. Operator setup still pending (unblocks the corpus seed)
1. **GROBID** — `docker run -d --name grobid --restart unless-stopped -p 8070:8070 grobid/grobid:0.8.1`; then `GROBID_URL=http://localhost:8070` in `.env.local`. (Depth multiplier — without it, harvesters get abstracts only; with it, arXiv/PDF full text flows.)
2. **Free OpenAlex API key** → `OPENALEX_API_KEY` in `.env.local`.
3. *(Learning loop D)* confirm the `20260623010000_social_engagement.sql` migration is applied + D files pushed.

## 3. Remaining work — prioritized

### A. Seed the RAG corpus (BLOCKED on §2.1 + §2.2)
Corpus is ~empty (`npm run rag:stats` → ~4 smoke chunks). Once GROBID + key are set, the agent runs:
- `npm run rag:harvest -- openalex all` (OA papers, all topics — validated on-topic; abstract-fallback works)
- `npm run rag:ingest -- <topic>` for the HTML `ingest:full` allowlist sources
- self-ingest the published issues (small harvester to add — connects news to what we've covered)
Then `npm run rag:stats` to confirm coverage. **Key finding:** many allowlist URLs are *hubs* (journal homepages / arxiv listings) → naive `rag:ingest` yields shallow index text; the **harvesters** pull the real documents instead. That's why `rag:harvest` exists.

### B. Fast-follow harvesters (no operator dependency — build next)
Same pattern as `scripts/rag/harvest.ts`:
- **arXiv** API — reliable preprint PDFs (highest value for space/tech/earth; needs GROBID).
- **Europe PMC** — OA full-text **XML** (no GROBID needed).
- **Project Gutenberg** — PD books (India life+60 check; strip PG trademark).
- **Dataset cards** (T1) — World Bank / OWID → ingest data-dictionary + generated summary facts (citable figures).

### C. Reactive v2 — RAG-grounded, verified (DESIGNED, not built)
The reason to seed the corpus. Today `route.ts` → `news-classifier` still emits the **old one-liner** (reads `_voice-core.md`, single `body`, no thread/cards). Upgrade:
1. **RAG-augment** in `route.ts`: for `social`/`both` routes, `mcp__parallax_rag__search` on the trend's entities/angle → sourced facts (with `source_url`).
2. **Reactive writer**: build an accessible thread + `image_beats` (infographics + the new **quote** card) from the RAG-sourced facts — never from unverified news numbers.
3. **New `social-verifier` agent**: every claim/figure must trace to a RAG chunk's `source_url` or it's cut; flags sensitive. Runs before queuing; stores a verification note.
4. Wire through the existing v2 card renderer + poster.
The 6 card archetypes are ready (`hero`, `data-readout`, `paradox`, `timeline`, `comparison`, `quote`); the section-data extractor + `renderByKind` are in `scripts/social/cards.ts` / `extract.ts`.

### D. Optional / ongoing
- **X Premium** — longer posts (drop the ≤280 trims) + monetization gate.
- **Playwright hero-screenshots** — the "faithful real component" half of the hybrid, for launch moments.
- **Admin inline-edit** in `/admin/social` — captures operator edits = the 3rd learning-loop signal (engagement + rejections already wired).
- **Curate** `research/_voice/_voice-social-learned.md` as `social:refine` proposes heuristics (needs ~6 measured posts first).

## 4. Key files
- Memory: `content-engine-plan.md` (plan + full status). Runbook: `docs/CONTENT-ENGINE.md`.
- Voice: `research/_voice/_voice-social.md` (+ `_voice-social-learned.md`).
- Cards: `scripts/social/cards.ts` (6 archetypes) + `extract.ts` (issue → card data).
- Pipelines: `scripts/evergreen/promote.ts`, `scripts/reactive/{ingest,cluster,route}.ts`, `scripts/social/{post,metrics,refine-voice}.ts`.
- RAG: `scripts/rag/{ingest,harvest,search,stats}.ts`, `scripts/lib/{rag,voyage}.ts`.
- Agents: `.claude/agents/{social-writer,news-classifier,voice-refiner,voice-checker,...}.md`.
