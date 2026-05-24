/**
 * Auth helpers for app subdomain routes.
 *
 * Use `requireUser(Astro)` in any page or API route that must have an
 * authenticated user. It either returns the user or throws a Response
 * (redirect to /login) which Astro turns into the actual redirect.
 */
import type { APIContext } from 'astro';
import type { User } from '@supabase/supabase-js';

/**
 * Require an authenticated user. Returns the user or throws a redirect.
 *
 *   const user = requireUser(Astro);   // user is non-null on this line
 */
export function requireUser(ctx: APIContext): User {
  const user = ctx.locals.user;
  if (!user) {
    const here = ctx.url.pathname + ctx.url.search;
    throw ctx.redirect(`/login?next=${encodeURIComponent(here)}`);
  }
  return user;
}

/**
 * Normalise the `next` query param to a safe relative path on this app.
 * Prevents open-redirect attacks via attacker-controlled `next=//evil.com`.
 */
export function safeNextPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw) return fallback;
  // Must start with a single forward slash and not be a protocol-relative URL.
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  // Disallow paths containing protocol or whitespace.
  if (/[\s\\]/.test(raw) || raw.includes('://')) return fallback;
  return raw;
}
