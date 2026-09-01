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
- **Onboarding.** `/welcome` — the one-time post-signup plate (optional
  name + world picker), reached from `/auth/callback` when
  `profiles.welcomed_at` is NULL. API: `/api/onboarding`. Added
  2026-07-14; needs the journey migration applied first (§9). Not to be
  confused with the **publication's** `/welcome` (the cinematic "Second
  Angle" story) — different project, different domain, different file.
- **Dashboard — "The Shelf".** `/dashboard`. Rebuilt 2026-07-14 on the
  `app.css` v2 primitives. Module order: greeting header → shelf tile
  grid (saved issues) → reading log (3 `.stat`s) → "In the margins" (the
  reader's own `comments` with status chips) → preferences (3 `.toggle`
  rows) → account plate → admin tiles (admin only) → danger zone.
- **Reader-account APIs** called by the publication's client islands:
  `/api/save/[issueId]`, `/api/reactions/[issueId]`, `/api/events`,
  `/api/annotations/[issueId]`, `/api/letters/[issueId]`,
  `/api/subscribe`, `/api/subscribe/confirm`, `/api/account/prefs`,
  `/api/account/delete`.
- **Moderation / editor** (admin-only): APIs `/api/admin/comments`,
  `/api/admin/comments/[id]`, `/api/admin/social/[id]`; queue UIs at
  `/admin/comments` (annotations + letters) and `/admin/social` (social
  post approvals).
- **Health.** `/api/health` returns env booleans + runtime info.
- **Wired into the publication but NOT yet deployed:** `/api/join`
  (Tier-1 unified "Join": one email → newsletter subscribe + Supabase
  magic-link account in a single step) is now the POST target of the
  publication's `NewsletterForm.astro` — repointed from `/api/subscribe`
  on 2026-07-14. `/api/me` is used by the publication's
  `AccountEntry.astro` as a stale-session **confirmer only, never a
  gatekeeper**, and remains the optional server-confirmed upgrade for
  `ReadingGate.astro` (which reads auth client-side). Both endpoints and
  both publication changes are uncommitted and undeployed.
  **Deploy order matters: the app must go live BEFORE the publication**,
  or the newsletter form posts to an endpoint that isn't there yet.

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
| Social approval queue (`/admin/social` + `/api/admin/social/[id]`) | ✅ In repo and committed, alongside the `20260621*` / `20260623*` social + RAG migrations. 2026-07-14 added a per-post story link (uncommitted) |
| Journey — `/welcome` + `/api/onboarding` | ⚠️ Code complete, `npm run build` green (2026-07-14). **Uncommitted**; the `20260705000000_journey_onboarding` migration is **not applied**; nothing runtime-verified |
| Dashboard — "The Shelf" rebuild | ⚠️ Code complete, build green (2026-07-14). **Uncommitted**; richer modules deferred (see the 2026-07-14 change-log entry) |
| C / D / E | ⏳ Not started |

Everything dated 2026-07-14 in this file is **in-repo and uncommitted**.
It compiles (`cd app && npm run build` exits 0) and nothing more: the app
cannot run on the code-only dev box (§7 rule 7), so no 2026-07-14 app
change has been runtime-verified, deployed, or exercised against the live
database.

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
│   └── migrations/                                    ← see §9 for the full table
│       ├── 20260524000000_phase_a_foundation.sql      ← profiles, saved_issues, newsletter_subscriptions
│       ├── 20260524100000_phase_b_reactions.sql       ← reactions
│       ├── 20260524200000_phase_b_reading_events.sql  ← reading_events
│       ├── 20260524300000_phase_b_comments.sql        ← comments (annotations + letters)
│       ├── 20260601000000_phase_b_letters_author.sql  ← comments.author_name
│       ├── 20260621000000_social_pipeline.sql         ← social pipeline (admin/cron-only tables)
│       ├── 20260621010000_rag_chunks.sql              ← RAG corpus (pgvector + hybrid search)
│       ├── 20260621020000_trend_items_clusters.sql    ← reactive news pipeline state
│       ├── 20260623000000_social_post_images.sql      ← per-post thread images
│       ├── 20260623010000_social_engagement.sql       ← social_posts.engagement (learning loop)
│       └── 20260705000000_journey_onboarding.sql      ← profiles.welcomed_at + stated_interests — NOT YET APPLIED
└── src/
    ├── env.d.ts                  ← typed env + Astro.locals types
    ├── middleware.ts             ← session populate + no-store cache header
    ├── lib/
    │   ├── supabase.ts           ← browser/server/admin client factories; ws wired in
    │   ├── auth.ts               ← requireUser, safeNextPath (allow-listed origins)
    │   └── admin.ts              ← isAdmin, requireAdmin (ADMIN_EMAILS env allowlist)
    ├── components/
    │   └── LensMark.astro        ← the brand lens glyph (login + welcome)
    ├── layouts/
    │   └── AppLayout.astro       ← shared chrome (masthead, footer, app.css)
    ├── styles/
    │   ├── app.css               ← token system mirroring publication + v2 primitives
    │   │                           (.plate/.tile/.chip/.toggle/.stat/.appbar + .reveal island)
    │   └── shared/               ← generated token copies (npm run design:sync at repo root)
    │       ├── tokens.css
    │       └── worlds.css
    └── pages/
        ├── index.astro           ← landing (redirects to dashboard if signed in)
        ├── login.astro           ← magic-link + Google buttons
        ├── welcome.astro         ← ONE-TIME POST-SIGNUP ONBOARDING (name + world picker);
        │                           plain <form> POST, zero client JS (§8)
        ├── auth/
        │   └── callback.ts       ← OAuth code exchange + welcomed_at gate (fail-open, §8)
        ├── dashboard/
        │   └── index.astro       ← "THE SHELF" — greeting, shelf tiles, reading log,
        │                           in the margins, prefs, account, admin tiles, danger
        ├── admin/
        │   ├── comments.astro    ← MODERATION QUEUE UI ✓ (admin-gated)
        │   └── social.astro      ← SOCIAL APPROVAL QUEUE ✓ (admin-gated); per-post
        │                           "↗ story" link to <site>/s/<issue_id>/ + copy button
        └── api/
            ├── health.ts
            ├── join.ts           ← Tier-1 unified Join (newsletter + magic-link).
            │                       NOW the publication NewsletterForm's POST target — deploy first
            ├── me.ts             ← server-confirmed { authed } probe; AccountEntry confirmer
            ├── onboarding.ts     ← POST from welcome.astro; always stamps welcomed_at (§8)
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
                ├── comments/
                │   └── [id].ts
                └── social/
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
7. **The app cannot RUN on the code-only dev box — `npm run build` is
   the only local gate.** There is no `.env.local` here (prod-only DB,
   secrets live with the operator), so `assertEnv` in the middleware
   throws `Missing env: PUBLIC_SUPABASE_URL` and every request 500s
   before routing. `astro dev`, curling `/api/health`, and any live
   Supabase check are therefore impossible from this account. That
   means: (a) app work is **compile-verifiable only** — `cd app &&
   npm run build` exiting 0 is the whole local proof; (b) never write
   "verified", "tested", or "working" about an app change made here —
   write "build green, runtime unverified"; (c) query only table/column
   shapes you can confirm from the migrations or from an existing
   working query, because a wrong shape will not surface until the
   operator deploys.

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

**No-JS multi-select ("chip picker") — `welcome.astro`:** a toggle-pill
group that must both *submit* and *show its state* with zero JavaScript.
Each pill is a `<label>` wrapping a visually-hidden native
`<input type="checkbox" name="interest">` plus a `<span class="chip">`
face; selection is pure CSS via `.wchip__input:checked + .chip`, and the
focus ring via `.wchip__input:focus-visible + .chip`. Repeated
`name="interest"` gives the endpoint a plain
`formData.getAll('interest')` array.

> **Precedent this sets:** `docs/design/APP-DESIGN-SPEC.md` §4 first
> described this picker as `aria-pressed` chips, which would need JS both
> to toggle *and* to submit (the spec now records the deviation too).
> The fallback contract outranks a spec's literal markup suggestion —
> when a spec's implementation detail would require JS for a form to
> work at all, implement the behaviour natively and note the deviation.
> Native checkboxes also come with real keyboard + AT semantics for free.

**Two submit buttons, one form:** `save` and `skip` are both
`type="submit"` sharing `name="intent"`; `skip` carries `formnovalidate`
so it can never be blocked by field validation. The endpoint branches on
`intent`.

**"Once means once" — always stamp `welcomed_at`:** `/api/onboarding`
writes `welcomed_at` on **both** `save` and `skip`, before it even looks
at the answers. A reader who skips must not be asked again. The same
handler is defensive in two more ways worth copying: a **blank name
field never overwrites** a `display_name` Google supplied (only a
non-empty trimmed value is written), and the update ends with
`.select('id')` so a silent 0-row write is logged as a warning instead of
being mistaken for success. Interests are allowlist-filtered against the
six worlds and deduped; `next` always goes through `safeNextPath`.

**Fail-open gates — `auth/callback.ts`:** after
`exchangeCodeForSession`, the callback re-reads the user with
`supabase.auth.getUser()` — `ctx.locals.user` was pre-fetched by the
middleware *before* the exchange, so it is still `null` at that point.
It then reads `profiles.welcomed_at` and redirects to `/welcome` **only
on a clean read**:

```ts
if (!profileError && (!profile || profile.welcomed_at == null)) { /* → /welcome */ }
```

A transient profiles read error falls through to `next`. The rule
generalises: **a nicety must never become a barrier to getting in.** If
the gate can't prove the reader needs it, let them through. The optional
`?world=` param carried into `/welcome` is allowlist-validated against
the six worlds before it is echoed into a URL.

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
| 20260621000000_social_pipeline.sql | social pipeline tables — admin/cron-only, never reader-facing |
| 20260621010000_rag_chunks.sql | RAG corpus for the editorial agents (pgvector + hybrid search) |
| 20260621020000_trend_items_clusters.sql | reactive news pipeline state (trend_items + trend_clusters) |
| 20260623000000_social_post_images.sql | social_posts.images — per-thread-post card {ref, alt} |
| 20260623010000_social_engagement.sql | social_posts.engagement — the metrics/voice-refiner loop |
| 20260705000000_journey_onboarding.sql | **NOT YET APPLIED.** profiles.welcomed_at (timestamptz) + profiles.stated_interests (text[] NOT NULL DEFAULT '{}') |

Apply via Supabase SQL editor (paste contents, click Run) OR
`supabase db push` once the CLI is linked. Every migration is
idempotent — `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`
before `CREATE POLICY`, etc.

**`20260705000000_journey_onboarding.sql` — status and rationale.**
Written 2026-07-05, still **unapplied** as of 2026-07-14; the operator
applies it. Until it runs, `/welcome` and `/api/onboarding` will error on
the missing columns and the `/auth/callback` gate's profiles read fails
(fail-open, so sign-in still works — readers simply land on `next` and
are never welcomed). The migration is `ALTER TABLE … ADD COLUMN IF NOT
EXISTS` only, so it is safe to re-run.

It deliberately adds **no GRANT and no RLS policy**, and that is correct,
not an omission: the Phase-A `GRANT SELECT, UPDATE ON public.profiles TO
authenticated` is *table-level* so it already covers new columns, and
`profiles_update_own` (`auth.uid() = id`, same in `WITH CHECK`) already
permits a reader to write their own row — exactly what `/api/onboarding`
does. Rule 4 in §7 ("RLS is non-optional") is about **new tables**;
adding a column to an already-protected table inherits its policies.
Everything else the journey needs (progress, streaks, affinity, margins)
derives from existing tables — `reading_events`, `saved_issues`,
`comments`.

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
- `src/pages/dashboard/index.astro` — the admin entry point, shown only
  when `isAdmin(user)`. Since the 2026-07-14 "Shelf" rebuild this is an
  **Editor module of admin tiles** ("The comment queue" → `/admin/comments`,
  "The social queue" → `/admin/social`), not the old eyebrow-level link.
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
- **Operator setup checklist:** `docs/COMMERCIALISATION-SETUP.md`
  (repo root `docs/`) — includes the go-live order and the post-deploy
  smoke list for the journey work.
- **Design canon governing this app:** `docs/design/APP-DESIGN-SPEC.md`
  (the app's own surfaces) and `docs/design/JOURNEY-SPEC.md` (the
  end-to-end reader journey; `/welcome` closes its fix #7).
- **Claude Design brief:** `docs/archive/CLAUDE-DESIGN-BRIEF.md` (archived) —
  the design direction submitted externally.
- **Publication agent guide:** `../AGENTS.md` (root).
- **Publication CLAUDE.md:** `../CLAUDE.md`.
- **Publication change log:** `../docs/PROJECT.md` §12.

---

## Change log

### 2026-07-14 — Journey onboarding, "The Shelf" dashboard, funnel wiring

All of the below is **in-repo and uncommitted**, `cd app && npm run build`
exits 0, and **none of it has been runtime-verified** — the dev box has no
Supabase env (§7 rule 7). The operator commits, applies the migration, and
deploys.

- `supabase/migrations/20260705000000_journey_onboarding.sql` — **NEW,
  not yet applied.** Adds `profiles.welcomed_at timestamptz` and
  `profiles.stated_interests text[] NOT NULL DEFAULT '{}'`. No new GRANT
  or RLS policy needed (table-level Phase-A grant + `profiles_update_own`
  already cover both columns). Idempotent (`ADD COLUMN IF NOT EXISTS`).
  Until it is applied, `/welcome` and `/api/onboarding` will error on the
  missing columns; sign-in itself is unaffected because the callback gate
  fails open.
- `src/pages/welcome.astro` — **NEW.** The one-time post-signup plate:
  "You're in.", an optional name `.field` prefilled from
  `profiles.display_name` → `user_metadata.name`/`full_name`, a six-world
  picker, a three-row mono feature strip, and two submit buttons sharing
  `name="intent"` (`save` / `skip`, the latter `formnovalidate`). The CTA
  reads "Back to the issue →" when `next` points at an issue, else "Open
  my shelf". The picker is **native checkboxes** wearing the shared
  `.chip` face, selected via `.wchip__input:checked + .chip` — it submits
  and shows state with **zero JavaScript**, which is why it departs from
  the spec's literal `aria-pressed` buttons (§8). The page ships no
  client script at all. Mirrors `login.astro` (LensMark 56 animated,
  `data-world` tint).
- `src/pages/api/onboarding.ts` — **NEW.** Authenticated POST
  (`requireUser`). Always stamps `welcomed_at` on **both** save and skip
  so welcome is genuinely once; a blank name never wipes a name Google
  supplied; interests are allowlist-filtered + deduped; `next` runs
  through `safeNextPath`; the `?welcome=1` toast marker is appended only
  for `/issues/` URLs and before any `#fragment`; a `.select('id')`
  row-count check logs a silent 0-row update rather than treating it as
  success.
- `src/pages/auth/callback.ts` — **MODIFIED.** After
  `exchangeCodeForSession`, reads the fresh user via
  `supabase.auth.getUser()` (the middleware pre-fetched `locals.user` as
  null *before* the exchange). Gates to `/welcome?next=&world=` **only on
  a clean profiles read** — `!profileError && (!profile ||
  profile.welcomed_at == null)`. A transient read error falls through to
  `next`: the gate is a nicety, never a barrier to getting in. `world` is
  allowlist-validated.
- `src/pages/dashboard/index.astro` — **REBUILT as "The Shelf"**,
  answering the operator's "dashboard = 2000s design" note. Module order:
  greeting header → shelf tile grid → reading log (3 `.stat`s) → "In the
  margins" (the reader's own `comments` with status chips) → preferences
  (3 `.toggle` rows, progressive-enhancement fetch save) → account plate
  → admin tiles (admin only) → danger zone. Built on the `app.css` v2
  primitives that already existed from P3; queries only confirmed shapes
  (`profiles`, `saved_issues`, `comments(id, body_md, status, created_at,
  issue_id, user_id)`). **Deferred** (need schema + runtime verification):
  per-issue reading-progress hairlines from `reading_events`, topic-
  affinity bars, and real issue titles via a cross-project issues
  manifest — tiles title-case the slug today.
- `src/pages/admin/social.astro` — **MODIFIED.** Each post card gains a
  "↗ story" link to `<PUBLIC_SITE_URL>/s/<issue_id>/` and a "Copy story
  link" clipboard button, on a separate delegated handler so it can never
  interfere with approve/reject.
- Publication side (not this project, listed for the deploy order):
  `NewsletterForm.astro` now POSTs to `/api/join` instead of
  `/api/subscribe`, and `AccountEntry.astro` uses `/api/me` as a
  confirmer. **The app must therefore deploy BEFORE the publication.**
- The onboarding work was adversarially reviewed on three lenses
  (security / runtime / spec): four minor findings, all fixed; security
  found nothing exploitable. That review was static — it is not a
  substitute for the operator's live smoke test.

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
- *(Superseded 2026-07-14: both are now wired into the publication —
  `/api/join` as the NewsletterForm POST target, `/api/me` as the
  AccountEntry confirmer. Still undeployed. See §1.)*

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
