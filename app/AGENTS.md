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

- Login (magic-link + Google OAuth via Supabase)
- "Your Parallax" dashboard
- `/api/*` endpoints called by the publication's client islands
  (save / react / annotate / subscribe / Q&A)

Two Vercel projects deploy from this one repo: the publication (root
directory `.`) and the app (root directory `app/`).

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

## 3. Phase A scope (what lives here today)

Phase A is foundation only:

- `astro.config.mjs` — `output: 'server'`, Vercel adapter
- `package.json` — Supabase + Resend deps, port 4322 dev server
- `src/lib/supabase.ts` — three client factories (browser / server / admin)
- `src/pages/index.astro` — placeholder landing
- `src/pages/api/health.ts` — health check
- `supabase/migrations/*.sql` — Phase A schema (profiles,
  saved_issues, newsletter_subscriptions)

Phase A's UI and full API surface land in subsequent commits once the
operator has completed `docs/COMMERCIALISATION-SETUP.md`.

---

## 4. Local dev

```bash
cd app
npm install
cp .env.example .env.local         # fill the real values
npm run dev                        # http://localhost:4322
```

The publication runs at `localhost:4321`; the app at `localhost:4322`.
Both must be running for end-to-end testing of save-for-later and
client islands.

Health check:
```bash
curl http://localhost:4322/api/health
```

---

## 5. Environment variables (`.env.local` in this directory)

| Var | Purpose | Visibility |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL | client + server |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (RLS-gated) key | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS — admin ops only | **server only** |
| `RESEND_API_KEY` | Resend transactional + newsletter | server only |
| `PUBLIC_APP_URL` | `https://app.parallaxlens.com` | client + server |
| `PUBLIC_SITE_URL` | `https://parallaxlens.com` | client + server |

`PUBLIC_*` prefix is Astro's convention for client-visible vars. The
service-role key is intentionally NOT prefixed — never import it from
a file that runs in the browser.

---

## 6. Hard rules (do not break)

1. **Never import `SUPABASE_SERVICE_ROLE_KEY` in a `.astro` page or
   `.tsx` component that hydrates on the client.** Service-role
   bypasses RLS. A leak is a database compromise.
2. **Cookie domain is `.parallaxlens.com` in prod.** Hard-coded in
   `src/lib/supabase.ts`. Do not override per-route.
3. **CORS allowlist is `parallaxlens.com` only.** When `/api/*`
   endpoints are added, they must validate the Origin header against
   `PUBLIC_SITE_URL`.
4. **RLS is non-optional.** Every new table gets RLS-enabled in its
   migration. No exceptions, even for "internal" tables.
5. **Migration files are append-only.** Never edit a migration that
   has been applied to production. Add a new migration to alter.

---

## 7. Schema migrations

Stored at `supabase/migrations/<timestamp>_<name>.sql`. Apply with:

```bash
supabase db push                    # via Supabase CLI, once linked
# OR paste into Supabase SQL editor for one-off migrations
```

Naming: `YYYYMMDDHHMMSS_<phase>_<description>.sql` (e.g.
`20260524000000_phase_a_foundation.sql`).

Every migration is idempotent. Use `CREATE TABLE IF NOT EXISTS`,
`DROP POLICY IF EXISTS` before `CREATE POLICY`, etc. The Phase A
migration is the reference.

---

## 8. Cross-references

- **Strategic plan:** `C:\Users\user\.claude\plans\resetting-the-todo-list-nested-shannon.md`
  (operator's machine; the canonical 5-month roadmap).
- **Operator setup checklist:** `docs/COMMERCIALISATION-SETUP.md`.
- **Publication agent guide:** `../AGENTS.md` (root).
- **Publication CLAUDE.md:** `../CLAUDE.md`.

---

## Change log

### 2026-05-24 — Phase A scaffold
Initial subdirectory scaffold. astro.config (output: 'server'),
package.json, supabase client factories, placeholder landing page,
/api/health endpoint, Phase A migrations. No auth or dashboard pages
yet — those land once the operator finishes the setup checklist.
