/**
 * Admin-access helpers.
 *
 * Phase B doesn't introduce a role table or RBAC — it's overkill for a
 * solo-operator product. Instead, the operator declares the admin email(s)
 * via an env var, and any signed-in user whose email matches gets admin
 * access to moderation surfaces.
 *
 * Env var: ADMIN_EMAILS — comma-separated list, lowercased before compare.
 *   e.g. ADMIN_EMAILS=editor@parallaxlens.com,founder@parallaxlens.com
 *
 * When the operator grows the team (or adds an editorial assistant), they
 * add an email to ADMIN_EMAILS and redeploy. No DB change required.
 */
import type { User } from '@supabase/supabase-js';

/**
 * Resolved admin allowlist, lowercase, deduplicated.
 * Computed once at module load (env vars don't change at runtime).
 */
const ADMIN_EMAIL_SET = (() => {
  const raw = import.meta.env.ADMIN_EMAILS ?? '';
  const set = new Set<string>();
  for (const piece of raw.split(',')) {
    const e = piece.trim().toLowerCase();
    if (e) set.add(e);
  }
  return set;
})();

/**
 * Returns true if the given user is on the admin allowlist.
 * Pass `locals.user` from any API or page route.
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAIL_SET.has(user.email.toLowerCase());
}

/**
 * Narrow `locals.user` to a non-null admin `User`.
 *
 * Like `requireUser`, this no longer enforces anything: `src/middleware.ts`
 * refuses non-admins on ADMIN_ROUTES before rendering, with a real 401/403 for
 * API callers. The thrown Responses this used to raise never reached the
 * client — Astro turned them into blank 500s — so a signed-in non-admin hit a
 * 500 where they should have seen a 403.
 *
 * Reaching a throw below means the route is missing from ADMIN_ROUTES.
 */
export function requireAdmin(user: User | null | undefined): User {
  if (!user || !isAdmin(user)) {
    throw new Error(
      'requireAdmin: no admin session. That route is missing from ADMIN_ROUTES in ' +
        'src/middleware.ts, which is what enforces admin access.',
    );
  }
  return user;
}
