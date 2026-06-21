# app/ — agent guide

> Local rules for the **Parallax app subdomain** at
> `app.parallaxlens.com`. Read the root `AGENTS.md` first for
> project-level context, then this file for app-specific conventions.

---

## 1. What this subdirectory is

`app/` is a **separate Astro project** from the publication. The
publication at `parallaxlens.com` (root of this repo) stays
`output: 'static'` and pure-typography. The app at
`app.parallaxlens.com` is `output: 'server'` and hosts everything
auth-aware:

- **Auth.** Magic-link + Google OAuth via Supabase. Pages: `/login`,
  `/auth/callback`. API: `/api/auth/signout`.
- **Dashboard.** `/dashboard`. Saved issues, email prefs, account
  deletion, link to moderation queue (admin-only).
- **Reader-account APIs** called by the publication's client islands:
  `/api/save/[issueId]`, `/api/reactions/[issueId]`, `/api/events`,
  `/api/annotations/[issueId]`, `/api/subscribe`,
  `/api/subscribe/confirm`, `/api/account/prefs`, `/api/account/delete`.
- **Moderation APIs** (admin-only): `/api/admin/comments`,
  `/api/admin/comments/[id]`.
- **Health.** `/api/health` returns env booleans + runtime info.
- **DRAFT (pending operator deploy — not yet wired/active):**
  `/api/join` (Tier-1 unified "Join": one email → newsletter subscribe
  + Supabase magic-link account in a single step; not yet wired into
  the publication form) and `/api/me` (server-confirmed `{ authed }`
  probe; optional robustness upgrade for the publication's ReadingGate
  metered signup wall, which today reads auth client-side).

Two Vercel projects deploy from this one repo: the publication (root
directory `.`) and the app (root directory `app/`).

The publication's new soft signup gate (`ReadingGate.astro`) detects
auth client-side via the shared, client-readable `sb-<ref>-auth-token`
cookie — already set non-HttpOnly on `.parallaxlens.com` by
`@supabase/ssr`, so it's visible across both subdomains. `/api/me`
exists as an optional server-confirmed upgrade to that heuristic.

---

## 2. Why split, not hybrid?

If you're tempted to flip `astro.config.mjs` at the repo root to
`output: 'hybrid'`, **stop and re-read the approved plan**. The split
exists because:

- The publication's per-topic theming, masthead variants, section
  components, and SVG layouts are static-perfect. Hybrid mode would
  move every issue request onto a serverless function.
- The publication's design investment (30+ hours of typographic and
  per-topic work) is protected from regressions when the app fails.
- The app can be replaced or torn down without touching the
  publication.
- Auth cookies scoped to `.parallaxlens.com` work across both subdomains.

This is the single most consequential architectural decision in the
commercialisation plan. Do not undo it.

---

## 3. Current Phase status

Phase A complete. Most of Phase B shipped. See `docs/PROJECT.md` §12
for the full per-feature breakdown.

| Phase | Status |
|-------|--------|
| A — Foundation | ✅ Shipped: auth, dashboard, newsletter, privacy/terms |
| B-1 Reactions | ✅ Shipped |
| B-2 Save-for-later | ✅ Shipped |
| B-3 Reading-event tracking | ✅ Shipped |
| B-5 Annotations — capture | ✅ Shipped |
| B-5 Annotations — moderation queue | ✅ UI shipped (code complete; operator `ADMIN_EMAILS` + live smoke test pending) |
| B-4 Topic affinity heatmap | ⏳ Not started (waiting on reading-event data) |
| B-6 Letters block | ✅ Shipped (code complete; operator must apply the letters migration to prod) |
| C / D / E | ⏳ Not started |

---

## 4. File map (current state)

```
app/
├── astro.config.mjs              ← output: 'server', Vercel adapter
├── package.json                  ← engines.node = "20.x"; ws workaround for Supabase realtime
├── tsconfig.json
├── .env.example                  ← env var template
├── README.md
├── AGENTS.md                     ← this file
├── supabase/
│   └── migrations/
│       ├── 20260524000000_phase_a_foundation.sql      ← profiles, saved_issues, newsletter_subscriptions
│       ├── 20260524100000_phase_b_reactions.sql       ← reactions
│       ├── 20260524200000_phase_b_reading_events.sql  ← reading_events
│       └── 20260524300000_phase_b_comments.sql        ← comments (annotations + letters)
└── src/
    ├── env.d.ts                  ← typed env + Astro.locals types
    ├── middleware.ts             ← session populate + no-store cache header
    ├── lib/
    │   ├── supabase.ts           ← browser/server/admin client factories; ws wired in
    │   ├── auth.ts               ← requireUser, safeNextPath (allow-listed origins)
    │   └── admin.ts              ← isAdmin, requireAdmin (ADMIN_EMAILS env allowlist)
    ├── layouts/
    │   └── AppLayout.astro       ← shared chrome (masthead, footer, app.css)
    ├── styles/
    │   └── app.css               ← token system mirroring publication
    └── pages/
        ├── index.astro           ← landing (redirects to dashboard if signed in)
        ├── login.astro           ← magic-link + Google buttons
        ├── auth/
        │   └── callback.ts       ← OAuth code exchange
        ├── dashboard/
        │   └── index.astro       ← display name, email, saved, prefs, delete
        ├── admin/
        │   └── comments.astro    ← MODERATION QUEUE UI ✓ (admin-gated)
        └── api/
            ├── health.ts
            ├── join.ts           ← DRAFT: Tier-1 unified Join (newsletter + magic-link); not yet wired
            ├── me.ts             ← DRAFT: server-confirmed { authed } probe for ReadingGate; optional
            ├── auth/
            │   └── signout.ts
            ├── account/
            │   ├── prefs.ts
            │   └── delete.ts
            ├── subscribe.ts
            ├── subscribe/
            │   └── confirm.ts
            ├── save/
            │   └── [issueId].ts
            ├── reactions/
            │   └── [issueId].ts
            ├── events.ts
            ├── annotations/
            │   └── [issueId].ts
            ├── letters/
            │   └── [issueId].ts
            └── admin/
                ├── comments.ts
                └── comments/
                    └── [id].ts
```

---

## 5. Local dev

```bash
cd app
npm install
cp .env.example .env.local         # fill the real values
npm run dev                        # http://localhost:4322
```

The publication runs at `localhost:4321`; the app at `localhost:4322`.
Both must be running for end-to-end testing of save-for-later +
reactions + annotations + reading-events client islands.

Health check:
```bash
curl http://localhost:4322/api/health
```

---

## 6. Environment variables

Production env lives in Vercel project settings. Local dev reads
`app/.env.local` (or the repo-root `.env.local` if env lookup falls
back — both are gitignored).

| Var | Purpose | Visibility |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL | client + server |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (RLS-gated) key | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS — admin ops only | **server only** |
| `RESEND_API_KEY` | Resend transactional + newsletter | server only |
| `PUBLIC_APP_URL` | `https://app.parallaxlens.com` | client + server |
| `PUBLIC_SITE_URL` | `https://parallaxlens.com` | client + server |
| `ADMIN_EMAILS` | Comma-separated admin allowlist (for moderation routes) | server only |

`PUBLIC_*` prefix is Astro's convention for client-visible vars. The
service-role key, Resend key, and ADMIN_EMAILS are intentionally NOT
prefixed — never import them from a file that runs in the browser.

**Common gotcha:** pasting env vars into Vercel UI can introduce
newline characters. `assertEnv` in `lib/supabase.ts` now rejects values
containing `\n` / `\r` or leading whitespace, throwing at startup with
a clear error. See PROJECT.md §12 (2026-05-26 entry) for the
contamination story.

---

## 7. Hard rules (do not break)

1. **Never import `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_EMAILS` in a
   `.astro` page or component that hydrates on the client.** Service-role
   bypasses RLS. A leak is a database compromise. Same for the admin
   allowlist (less critical but still server-only).
2. **Cookie domain is `.parallaxlens.com` in prod.** Hard-coded in
   `src/lib/supabase.ts`. Do not override per-route.
3. **CORS allowlist is `parallaxlens.com` + `www.` only** for
   reader-facing API routes. Pattern in each `api/*` file —
   `ALLOWED_ORIGINS` Set.
4. **RLS is non-optional.** Every new table gets RLS-enabled in its
   migration. No exceptions, even for "internal" tables. The
   `reading_events` table uses defence-in-depth: API enforces
   user_id-vs-anon_id consistency, RLS as a backstop.
5. **Migration files are append-only.** Never edit a migration that
   has been applied to production. Add a new migration to alter.
6. **No-store cache for the app subdomain.** Middleware sets
   `Cache-Control: private, no-store, max-age=0` on every response.
   Removing this would cause stale dashboards via back-button after
   sign-out.

---

## 8. Patterns to reuse

**API endpoint shape (CORS + JSON):**

```ts
import type { APIRoute } from 'astro';

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED_ORIGINS = new Set([SITE_URL, 'https://www.parallaxlens.com', 'http://localhost:4321']);

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
  }
  return {};
};

const json = (status: number, body: unknown, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });

export const GET: APIRoute = async (ctx) => { /* ... */ };
export const POST: APIRoute = async (ctx) => { /* ... */ };
```

**Auth check inside an API or page route:**

```ts
import { requireUser } from '~/lib/auth';
const user = requireUser(Astro);          // throws redirect to /login
// or for an admin endpoint:
import { requireAdmin } from '~/lib/admin';
try { requireAdmin(ctx.locals.user); }    // throws 401/403 Response
catch (resp) { if (resp instanceof Response) return resp; throw resp; }
```

**Issue ID validation (used in every per-issue endpoint):**

```ts
const isSafeIssueId = (id: string): boolean =>
  /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id) && id.length <= 80;
```

**Client island handshake pattern** (selectors + dataset on a wrapper,
script walks `previousElementSibling` to find the wrapper):
See `src/components/core/AnnotationLayer.astro` for the most complex
example; `SaveButton.astro` is the simplest.

---

## 9. Schema migrations

Stored at `supabase/migrations/<timestamp>_<phase>_<description>.sql`.

| Migration | What it created |
|---|---|
| 20260524000000_phase_a_foundation.sql | profiles, saved_issues, newsletter_subscriptions; auth-trigger creates profile row on signup |
| 20260524100000_phase_b_reactions.sql | reactions (composite PK) |
| 20260524200000_phase_b_reading_events.sql | reading_events (auth + anon tracking) |
| 20260524300000_phase_b_comments.sql | comments (annotations with anchor + letters without) |
| 20260601000000_phase_b_letters_author.sql | comments.author_name (denormalised pen name for public letter attribution) |

Apply via Supabase SQL editor (paste contents, click Run) OR
`supabase db push` once the CLI is linked. Every migration is
idempotent — `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`
before `CREATE POLICY`, etc.

---

## 10. Phase B-5 moderation queue — status

**Shipped (code complete, build green):**
- `src/lib/admin.ts` — `isAdmin`, `requireAdmin`
- `src/pages/api/admin/comments.ts` — list pending / approved /
  hidden / removed, oldest-first for pending
- `src/pages/api/admin/comments/[id].ts` — POST with
  `{ action: 'approve' | 'hide' | 'reset' }`
- `.env.example` — `ADMIN_EMAILS` declared
- `src/pages/admin/comments.astro` — the queue UI. Double-gated
  (`requireUser` → `/login`, then `isAdmin` → `/dashboard`).
  Server-renders the list via `adminClient()` (same select + ordering
  as the GET endpoint); the `?status=` filter is plain links; each
  card shows author email, issue link, quoted `anchor.exact`, note
  body, date, optional `ai_risk_score` badge; context-aware
  Approve / Hide / Reset buttons; one delegated client script POSTs the
  action, removes the card, and updates the count. Scoped `mq-` styles.
- `src/pages/dashboard/index.astro` — eyebrow-level "Admin ·
  Moderation queue" link, shown only when `isAdmin(user)`.
- `src/env.d.ts` — `ADMIN_EMAILS` typed on `ImportMetaEnv`.

**Pending (operator action, not code):**
1. Add `ADMIN_EMAILS=<email>` to Vercel env vars (Production +
   Preview) and redeploy. Without this nobody is admin and the queue
   403s.
2. Live smoke test: open `/admin/comments`, approve a few annotations,
   confirm they render publicly in the issue's bottom list. This could
   **not** be done from the dev machine — there is no Supabase env in
   `.env.local`, so `assertEnv` in the middleware returns 500 on every
   request before routing, and the page is admin-gated regardless.

Public margin-note rendering *next to the source paragraph* using the
anchor JSON is still future polish — approved annotations appear in the
bottom list only.

---

## 11. Cross-references

- **Strategic plan:** `C:\Users\user\.claude\plans\resetting-the-todo-list-nested-shannon.md`
  (operator's machine; the canonical 5-month roadmap).
- **Operator setup checklist:** `docs/COMMERCIALISATION-SETUP.md`.
- **Claude Design brief:** `docs/CLAUDE-DESIGN-BRIEF.md` —
  the design direction submitted externally.
- **Publication agent guide:** `../AGENTS.md` (root).
- **Publication CLAUDE.md:** `../CLAUDE.md`.
- **Publication change log:** `../docs/PROJECT.md` §12.

---

## Change log

### 2026-06-21 — Two draft endpoints + publication soft signup gate
- `src/pages/api/join.ts` — **DRAFT, pending operator deploy.** Tier-1
  unified "Join": one email → newsletter subscribe + Supabase magic-link
  account in a single step. Not yet wired into the publication form.
- `src/pages/api/me.ts` — **DRAFT, pending operator deploy.** Server-
  confirmed `{ authed }` probe. Optional robustness upgrade for the
  publication's new `ReadingGate` metered signup wall.
- Publication context: `ReadingGate.astro` gates anonymous readers after
  the first sections behind a "create a free account" wall. It detects
  auth client-side via the shared, client-readable `sb-<ref>-auth-token`
  cookie (set non-HttpOnly on `.parallaxlens.com` by `@supabase/ssr`).
  Soft by design (the publication is static); the cookie heuristic is
  sufficient, with `/api/me` as the optional server-confirmed upgrade.
- Both endpoints are uncommitted drafts; the operator deploys.

### 2026-06-01 — Letters block shipped (Phase B-6, code complete)
- `supabase/migrations/20260601000000_phase_b_letters_author.sql` — adds a
  nullable `author_name` to `comments` (denormalised pen name captured at
  submit; profiles are RLS-private so it can't be joined at display).
  **Operator must apply this to prod Supabase before letters can be sent**
  (insert would otherwise fail on the missing column).
- `src/pages/api/letters/[issueId].ts` — GET (approved + own-pending
  letters, filtered `.is('anchor', null)`; returns `defaultName` +
  `signedIn`) + POST (create; `author_name` falls back to the reader's own
  profile display name). Mirrors the annotations endpoint.
- Publication: `src/components/core/LettersBlock.astro` mounted in
  `src/pages/issues/[slug].astro` after `ReactionsBar` — approved-letters
  list + a "write a letter" form (sign-as + body). `px-letter` styles.
- Letters reuse the existing moderation queue (null anchor → labelled
  "letter" in `/admin/comments`); no moderation changes needed.
- Publication + app builds both exit 0. Remaining Phase B: B-4 topic
  affinity heatmap (gated on reading_events data).

### 2026-06-01 — Moderation queue UI shipped (Phase B-5 closed in code)
- `src/pages/admin/comments.astro` — admin-gated queue UI: server-
  rendered list via `adminClient()`, `?status=` filter links, per-card
  author / issue / quoted `anchor.exact` / body / date / risk-score,
  context-aware Approve / Hide / Reset with one delegated client action
  script. Scoped `mq-` styles. No `app.css` change.
- `src/pages/dashboard/index.astro` — `isAdmin`-gated "Admin ·
  Moderation queue" link above the Account section.
- `src/env.d.ts` — `ADMIN_EMAILS` declared on `ImportMetaEnv`.
- `.claude/launch.json` (repo root) — added an `app` dev-server entry
  (cwd `app`, port 4322) for previewing app routes.
- `src/middleware.ts` + `.env.example` — DEV-only auth bypass
  (`DEV_ADMIN_EMAIL`): synthesises a signed-in admin under `astro dev`
  so auth-gated pages verify locally without the magic-link/OAuth flow.
  Prod-safe — gated on `import.meta.env.DEV`, dead-code-eliminated in
  the build.
- `npm run build` (app) exits 0. Live verification deferred to the
  operator: the dev machine has no Supabase env (`assertEnv` 500s every
  request) and the page is admin-gated. Operator must set
  `ADMIN_EMAILS` in Vercel + redeploy, then approve a test annotation.
- Phase B remaining: B-6 Letters block, B-4 topic affinity heatmap.

### 2026-05-26 — Phase A complete + Phase B mostly shipped
- Phase A live in production: auth, dashboard, newsletter, privacy/terms.
- Phase B-1 (reactions), B-2 (save-for-later), B-3 (reading-event tracking),
  B-5 part 1 (annotations capture) all live.
- B-5 part 2 (moderation queue) — APIs + helpers shipped; UI page +
  dashboard link pending; ADMIN_EMAILS env var pending operator action.
- ws workaround for Node 20 + Supabase realtime.
- Env contamination defence in assertEnv.
- Cross-subdomain redirect allowlist in safeNextPath.
- No-store cache header in middleware.

### 2026-05-24 — Phase A scaffold
Initial subdirectory scaffold. astro.config (output: 'server'),
package.json, supabase client factories, placeholder landing page,
/api/health endpoint, Phase A migrations. No auth or dashboard pages
yet — those land once the operator finishes the setup checklist.
