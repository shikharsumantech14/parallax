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
 * Hosts we trust as redirect targets. Anything else falls back to /dashboard.
 *
 * Allows the publication (so a "save" / "react" click from the publication can
 * round-trip the user through login and back to the same issue), this app
 * itself (for in-app navigation), and localhost dev variants.
 */
const ALLOWED_NEXT_HOSTS = new Set([
  'parallaxlens.com',
  'www.parallaxlens.com',
  'app.parallaxlens.com',
  'localhost:4321',
  'localhost:4322',
]);

/**
 * Normalise the `next` query param to a safe redirect target.
 *
 * Accepts:
 *   - a relative path on this app, e.g. `/dashboard`
 *   - an absolute URL whose origin is in ALLOWED_NEXT_HOSTS
 *
 * Rejects:
 *   - protocol-relative URLs (`//evil.com`)
 *   - absolute URLs to hosts not on the allowlist
 *   - paths with whitespace, backslashes, embedded protocols
 *
 * Prevents open-redirect attacks while supporting the "round-trip from
 * publication" pattern that save/react buttons rely on.
 */
export function safeNextPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw) return fallback;

  // Absolute URL — only allow when origin is on the allowlist.
  if (raw.includes('://')) {
    try {
      const url = new URL(raw);
      const host = url.host.toLowerCase();
      if (ALLOWED_NEXT_HOSTS.has(host)) {
        return url.toString();
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  // Relative path — must start with a single forward slash.
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  if (/[\s\\]/.test(raw)) return fallback;
  return raw;
}
