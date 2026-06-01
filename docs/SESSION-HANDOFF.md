# Session handoff — new agent onboarding

> **For the new session / new account.** This file is the fastest
> path from zero context to productive. Read it fully before touching
> any code. Then read `AGENTS.md` (root) for the full brand and
> pipeline canon. Then `app/AGENTS.md` for the reader-account product.
>
> **Last updated:** 2026-06-01

---

## What this project is

**Parallax Lens** (`parallaxlens.com`) is a visual explainer
publication — long-form, fully-sourced editorial issues across six
topic worlds: politics, space, earth, tech, travel, sports. Each topic
has its own distinct design aesthetic. Brand promise: *"Stories you
think you already understand."*

The repo has **two products**:

1. **The publication** — root of the repo. Pure-static Astro 4 + MDX.
   Deploys to `parallaxlens.com`. Five published issues. Agent-driven
   editorial pipeline (discover → research → draft → stylist →
   illustrator → verify → publish). 33 section kinds, 6 topic worlds.

2. **The reader-account app** — `app/` subdirectory. Astro SSR.
   Deploys to `app.parallaxlens.com`. Auth, dashboard, and all
   reader-interaction APIs called by client islands on the publication.
   Phase A + most of Phase B shipped.

---

## Current state (as of 2026-06-01)

### Publication: stable
- 5 published issues (politics × 2, space × 1, earth × 1, politics
  draft × 1 pending publish)
- OG cover images on all 4 currently-published issues
- Privacy Policy + Terms of Service live at `/about/privacy/` and
  `/about/terms/`
- Newsletter signup in footer, confirmation via Resend
- `npm run build` exits 0 (21 pages)

### Reader-account app: Phase B in progress

| Feature | Status |
|---|---|
| Auth (Google + magic-link) | ✅ Live |
| Dashboard (saved issues, email prefs, account deletion) | ✅ Live |
| Anonymous newsletter signup | ✅ Live |
| Save-for-later button on all issues | ✅ Live |
| Reactions bar (4 kinds) on all issues | ✅ Live |
| Reading-event tracking (6 event kinds) | ✅ Live |
| Annotations capture (select → annotate) | ✅ Live |
| Annotations moderation queue UI | ✅ Shipped 2026-06-01 (operator `ADMIN_EMAILS` + live smoke test pending) |
| Letters block (B-6) | ✅ Shipped 2026-06-01 (operator must apply the letters migration to prod) |
| **Topic affinity heatmap (B-4)** | 🟡 **Last Phase B item — gated on ~1wk of reading_events data** |
| AI pre-moderation on annotations | ⏳ Deferred |
| Phase C (AI explainers + TL;DR) | ⏳ Not started |
| Phase D (Q&A sidebar) | ⏳ Not started |
| Phase E (newsletter v2 digest) | ⏳ Not started |

---

## The single most important pending task

**Apply the letters migration, then B-4 is the last Phase B item.**
Phase B-5 (moderation queue) and B-6 (Letters block) both shipped
2026-06-01 (see the sections below). The only remaining Phase B feature
is **B-4, the topic affinity heatmap**, gated on having ~a week of
`reading_events` data to aggregate. If enough has accumulated, B-4 is
next; otherwise Phase B is effectively done pending that data.

**First, an operator step:** apply
`app/supabase/migrations/20260601000000_phase_b_letters_author.sql` to
prod Supabase (paste into the SQL editor) — letters can't be submitted
until the `author_name` column exists.

> Phase C (AI explainers + TL;DR) / D / E stay blocked until Phase B
> closes. Do not start them early.

---

## Letters block (shipped 2026-06-01)

End-of-issue reader "Letters" — longer reflections, shown publicly once
the editor approves them. Reuse the `comments` table (anchor NULL) and
flow through the moderation queue (null-anchor rows render as "letter").

**Built this session:**
- `app/supabase/migrations/20260601000000_phase_b_letters_author.sql` —
  nullable `author_name` on `comments` (denormalised pen name captured at
  submit; profiles are RLS-private so it can't be joined at display).
  **Operator must apply this to prod before letters work.**
- `app/src/pages/api/letters/[issueId].ts` — GET (approved + own-pending,
  `.is('anchor', null)`, returns `defaultName` + `signedIn`) + POST
  (create; `author_name` falls back to the reader's profile name).
- `src/components/core/LettersBlock.astro` — publication island
  (`px-letter`), mounted in `[slug].astro` after `ReactionsBar`:
  approved-letters list + a "write a letter" form (sign-as + body).
  Anonymous → "Sign in to write a letter" redirect.

**Verify (operator):** after applying the migration and signing in, open
a published issue, write a letter, then approve it in `/admin/comments`
and confirm it renders under "Letters" on the issue. Local verification
uses the same `DEV_ADMIN_EMAIL` bypass described below.

---

## Moderation queue (shipped 2026-06-01)

Code-complete and builds clean (`npm run build` in `app/` exits 0).

**Built this session:**
- `app/src/pages/admin/comments.astro` — admin-gated queue UI.
  Double-gated: `requireUser(Astro)` → `/login`, then `isAdmin(user)` →
  `/dashboard`. Server-renders the list via `adminClient()` (same
  select/order as the GET endpoint); `?status=` filter is plain links;
  each card shows author email, issue link, quoted `anchor.exact`, note
  body, date, optional `ai_risk_score` badge; context-aware
  Approve / Hide / Reset buttons; one delegated client script POSTs to
  `/api/admin/comments/<id>` and removes the card on success.
- `app/src/pages/dashboard/index.astro` — `isAdmin`-gated "Admin ·
  Moderation queue" link above the Account section.
- `app/src/env.d.ts` — `ADMIN_EMAILS` typed on `ImportMetaEnv`.
- `.claude/launch.json` — `app` dev-server entry (cwd `app`, port 4322).
- `app/src/middleware.ts` + `app/.env.example` — DEV-only auth bypass
  (`DEV_ADMIN_EMAIL`) for local verification of auth-gated pages;
  prod-safe (see "To verify locally" below).

**Built before this session (the backend — don't rebuild):**
- `app/src/lib/admin.ts` — `isAdmin(user)` / `requireAdmin()`.
- `app/src/pages/api/admin/comments.ts` — GET list endpoint.
- `app/src/pages/api/admin/comments/[id].ts` — POST action endpoint
  (`approve | hide | reset`).
- `app/.env.example` — `ADMIN_EMAILS` declared.

**Operator must still:** add `ADMIN_EMAILS=<your-email>` to the
`parallax-app` Vercel project (Production + Preview), redeploy, then
open `/admin/comments` and approve a test annotation to confirm it
renders publicly. This could **not** be verified from the dev machine —
there is no Supabase env in `.env.local`, so the middleware returns 500
on every request before routing, and the page is admin-gated regardless.

**To verify locally** (under an env-equipped account): set
`DEV_ADMIN_EMAIL=<an email also in ADMIN_EMAILS>` in `app/.env.local`,
then `npm run dev` in `app/`. The DEV-only bypass in `src/middleware.ts`
signs you in as that admin so `/admin/comments` renders without the
magic-link flow; seed a pending comment to exercise Approve / Hide. The
bypass is inert in production (gated on `import.meta.env.DEV`).

---

## Architecture rules (CRITICAL — don't violate)

1. **Publication stays `output: 'static'`.** `astro.config.mjs` at the
   repo root must NOT change to `hybrid` or `server`. Every new reader
   feature attaches as a small client island on the static publication
   that calls the app subdomain.

2. **App subdomain is the single auth surface.** Session cookies are
   scoped to `.parallaxlens.com`. The publication's client islands pass
   `credentials: 'include'` to CORS requests.

3. **`SUPABASE_SERVICE_ROLE_KEY` is server-only.** Never import it in
   any file that could hydrate on the client. Same for `ADMIN_EMAILS`.

4. **All reader-facing API routes need CORS headers.** Follow the
   `ALLOWED_ORIGINS` Set pattern in every `api/*` file.

5. **All migrations are append-only.** Never edit an applied migration.
   Add a new `.sql` file with a later timestamp.

6. **CSS class prefix isolation.** Each component owns a unique
   `px-<abbrev>` prefix ≤6 chars. Check `src/components/AGENTS.md`
   §8 for the current reservation table.

---

## Key files to read before starting

| File | Why |
|---|---|
| `AGENTS.md` (root) | Full brand canon, pipeline, voice system, hard rules |
| `app/AGENTS.md` | Full reader-account architecture, file map, patterns |
| `src/components/AGENTS.md` | Section-kind → component table, client island pattern |
| `docs/PROJECT.md` §12 (2026-05-26 entry) | Everything shipped this session |
| `docs/CLAUDE-DESIGN-BRIEF.md` | Visual design direction sent to Claude Design |
| `app/src/lib/admin.ts` | isAdmin + requireAdmin helpers — read before building any admin UI |
| `app/src/pages/api/admin/comments.ts` | The GET endpoint the moderation UI will call |
| `app/src/pages/dashboard/index.astro` | Where to add the admin link |

---

## Running locally

```bash
# Terminal 1 — publication
cd "D:/SideProjects/parallax"
npm install
npm run dev           # http://localhost:4321

# Terminal 2 — app subdomain
cd "D:/SideProjects/parallax/app"
npm install
npm run dev           # http://localhost:4322
```

`.env.local` at the repo root is gitignored and contains all keys.
The app reads from there too (Astro searches upward for `.env.local`).

Health check after both start:
```bash
curl http://localhost:4322/api/health
```
Should return `"ok": true` with all env booleans `true`.

Build check (before any push):
```bash
cd "D:/SideProjects/parallax" && npm run build    # publication — must exit 0
cd "D:/SideProjects/parallax/app" && npm run build # app — must exit 0
```

---

## Git workflow

- **Commits only, never push.** The operator pushes manually via
  `git push`. Vercel auto-deploys on push to `main`.
- **No `Co-Authored-By` trailer.** Commits must come from the
  `shikharsumantech14` GitHub account (Vercel Hobby plan blocks
  deploys from unrecognised authors).
- **Check the build** before committing.

---

## Pending operator actions (things only the human can do)

1. Add `ADMIN_EMAILS=<your-email>` to Vercel env vars for
   `parallax-app` project → redeploy. This unlocks the now-built
   moderation queue UI (`/admin/comments`) for the operator.
2. Apply `app/supabase/migrations/20260601000000_phase_b_letters_author.sql`
   to prod Supabase (paste into the SQL editor). Letters cannot be
   submitted until the `author_name` column exists.
3. Review + publish the `2026-05-15-seven-appeals-rupee-pressure` issue
   (currently `status: draft`). Two `# EDITOR:` flags remain in that
   file — resolve them first.
4. Claude Design proposals: when they arrive, share with the agent for
   translation into Astro components per `src/components/AGENTS.md`.

---

## What NOT to do in the next session

- Do **not** redesign the publication in bulk. The Claude Design brief
  is in progress externally; wait for proposals before implementing
  visual changes.
- Do **not** change the publication's `astro.config.mjs` to hybrid.
- Do **not** add a new section kind without following the 5-step
  checklist in `src/components/AGENTS.md` §3.
- Do **not** introduce gradients, glassmorphism, or emoji into the
  publication's UI (see `docs/CLAUDE-DESIGN-BRIEF.md` for why).
- Do **not** start Phase C / D / E before Phase B is closed.
