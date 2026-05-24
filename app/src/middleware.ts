import { defineMiddleware } from 'astro:middleware';
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

  const response = await next();

  // The app subdomain serves reader-account surfaces only. Never let the
  // browser (or any intermediate cache) hold onto the response — otherwise
  // the back button after sign-out shows a stale logged-in page.
  // `private` = don't cache in shared caches (CDNs); `no-store` = don't
  // store at all, not even in browser history navigation.
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');

  return response;
});
