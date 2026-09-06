import { defineMiddleware } from 'astro:middleware';
import type { User } from '@supabase/supabase-js';
import { serverClient } from './lib/supabase';
import { isAdmin } from './lib/admin';

/**
 * Session middleware.
 *
 * Runs on every request. Creates a request-scoped Supabase server client
 * that reads + writes the auth cookie, attaches it to Astro.locals,
 * and pre-fetches the authenticated user so pages can render synchronously.
 *
 * Pages access locals via:
 *   const { user, supabase } = Astro.locals;
 */
/**
 * The app's surfaces, and ONLY these, get a session.
 *
 * This guard is load-bearing since the merge (2026-09-06). Without it the
 * middleware would run for the whole publication: 45 prerendered pages would
 * each call `supabase.auth.getUser()` during the build, and every response
 * would leave with `Cache-Control: no-store`, taking the publication out of
 * the CDN entirely. The publication is static and anonymous by design; it must
 * never touch Supabase.
 */
const APP_ROUTES = ['/login', '/dashboard', '/admin', '/auth', '/api', '/account'];

/** Path-prefix match on segment boundaries, so `/accounts` never matches `/account`. */
const under = (pathname: string, p: string) => pathname === p || pathname.startsWith(p + '/');

const isAppRoute = (pathname: string) => APP_ROUTES.some((p) => under(pathname, p));

/**
 * Which app routes need what.
 *
 * Everything else under APP_ROUTES is deliberately open: `/login` and
 * `/auth/callback` are how you sign IN, `/api/join` and `/api/subscribe` serve
 * anonymous readers, and `/api/me` is auth-OPTIONAL — it reports
 * `{authed:false}` rather than refusing, which is what lets the masthead and
 * the reading gate ask "is anyone there?" without gatekeeping. Save,
 * reactions, letters and annotations decide per request.
 */
const AUTH_ROUTES = ['/dashboard', '/account', '/api/account', '/api/onboarding'];
const ADMIN_ROUTES = ['/admin', '/api/admin'];

function routeGuard(pathname: string): 'auth' | 'admin' | null {
  if (ADMIN_ROUTES.some((p) => under(pathname, p))) return 'admin';
  if (AUTH_ROUTES.some((p) => under(pathname, p))) return 'auth';
  return null;
}

const deny = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isAppRoute(context.url.pathname)) return next();

  const supabase = serverClient({
    cookies: context.cookies,
    headers: context.request.headers,
  });

  // getUser() validates the JWT against Supabase; safer than reading the cookie directly.
  // Returns null for unauthenticated requests; never throws.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  context.locals.user = user;
  context.locals.supabase = supabase;

  // ── DEV-ONLY auth bypass ──────────────────────────────────────────────────
  // Lets a local `astro dev` session render auth-gated pages (e.g. the admin
  // moderation queue) without completing the magic-link / OAuth flow, which
  // needs inbox access plus a localhost redirect allow-listed in Supabase.
  //
  // Prod-safe by construction: `import.meta.env.DEV` is `true` only under
  // `astro dev`. Under `astro build` (what Vercel runs) Vite inlines it as the
  // literal `false`, so this whole block is dead-code-eliminated from the
  // production bundle — it cannot execute in prod even if DEV_ADMIN_EMAIL were
  // present in the deploy env. Opt-in: only active when DEV_ADMIN_EMAIL is set
  // in .env.local. The synthesised user is an admin iff that email is also in
  // ADMIN_EMAILS. Requires real Supabase env — it only skips the sign-in step,
  // not the database (the admin page still reads via the service-role client).
  if (import.meta.env.DEV && !context.locals.user && import.meta.env.DEV_ADMIN_EMAIL) {
    context.locals.user = {
      id: '00000000-0000-4000-8000-000000000000',
      aud: 'authenticated',
      role: 'authenticated',
      email: import.meta.env.DEV_ADMIN_EMAIL,
      app_metadata: {},
      user_metadata: { name: 'Local Dev Admin' },
      created_at: '2026-01-01T00:00:00.000Z',
    } as unknown as User;
  }

  // ── The auth guard ────────────────────────────────────────────────────────
  // This lives here because `requireUser` / `requireAdmin` CANNOT enforce it.
  // They throw a Response, and this Astro version converts that into a blank
  // 500 for both pages and endpoints rather than honouring it — so a
  // signed-out reader opening a bookmarked /dashboard got a 500 instead of the
  // sign-in page. Verified against production and against the pre-merge
  // deployment on 2026-09-06: long-standing, not a merge regression.
  //
  // Deciding here also means no page body is rendered for a request that is
  // about to be refused. Runs after the DEV bypass on purpose, so a local
  // session still reaches admin surfaces.
  const guard = routeGuard(context.url.pathname);
  if (guard) {
    const isApi = under(context.url.pathname, '/api');
    if (!context.locals.user) {
      // A redirect to an HTML sign-in page is useless to `fetch`, so the API
      // surface gets a status its callers can act on.
      return isApi
        ? deny(401, { ok: false, signedOut: true, error: 'Not signed in.' })
        : context.redirect(
            `/login?next=${encodeURIComponent(context.url.pathname + context.url.search)}`,
          );
    }
    if (guard === 'admin' && !isAdmin(context.locals.user)) {
      return isApi ? deny(403, { ok: false, error: 'Admin access required.' }) : context.redirect('/dashboard');
    }
  }

  const response = await next();

  // Reader-account surfaces only — the guard above guarantees we never reach
  // here for a publication page. Never let the
  // browser (or any intermediate cache) hold onto the response — otherwise
  // the back button after sign-out shows a stale logged-in page.
  // `private` = don't cache in shared caches (CDNs); `no-store` = don't
  // store at all, not even in browser history navigation.
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');

  return response;
});
