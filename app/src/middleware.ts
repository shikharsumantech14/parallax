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

  return next();
});
