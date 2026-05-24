import type { APIRoute } from 'astro';
import { safeNextPath } from '../../lib/auth';

/**
 * OAuth + magic-link callback.
 *
 * Supabase redirects here after Google OAuth or after the magic-link
 * email is opened. The URL contains a `code` param that we exchange
 * for a session. The session cookie is set automatically by the
 * SSR Supabase client (via the cookie helpers in supabase.ts).
 *
 * Errors come back as `error` + `error_description` query params —
 * we redirect to /login with a friendly message rather than dumping
 * Supabase's raw error to the user.
 */
export const GET: APIRoute = async (ctx) => {
  const code = ctx.url.searchParams.get('code');
  const next = safeNextPath(ctx.url.searchParams.get('next'), '/dashboard');
  const errorParam = ctx.url.searchParams.get('error');
  const errorDesc = ctx.url.searchParams.get('error_description');

  // OAuth/magic-link rejection (user clicked Deny, link expired, etc.)
  if (errorParam) {
    const reason =
      errorParam === 'access_denied'
        ? 'You declined the sign-in. Try again whenever you’re ready.'
        : errorDesc || 'Sign-in didn’t complete. Try again.';
    return ctx.redirect(`/login?notice=${encodeURIComponent(reason)}`);
  }

  if (!code) {
    return ctx.redirect('/login?notice=' + encodeURIComponent('The sign-in link is missing data. Request a fresh one.'));
  }

  const { supabase } = ctx.locals;
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
    return ctx.redirect(
      `/login?notice=${encodeURIComponent('That sign-in link has expired or was already used. Request a fresh one.')}`,
    );
  }

  // Success — session cookie is set on this response by the SSR client.
  return ctx.redirect(next);
};
