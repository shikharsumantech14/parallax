import { defineMiddleware } from 'astro:middleware';
import type { User } from '@supabase/supabase-js';
import { serverClient } from './lib/supabase';

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
export const onRequest = defineMiddleware(async (context, next) => {
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

  const response = await next();

  // The app subdomain serves reader-account surfaces only. Never let the
  // browser (or any intermediate cache) hold onto the response — otherwise
  // the back button after sign-out shows a stale logged-in page.
  // `private` = don't cache in shared caches (CDNs); `no-store` = don't
  // store at all, not even in browser history navigation.
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');

  return response;
});
