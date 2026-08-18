import type { APIRoute } from 'astro';
import { requireUser, safeNextPath } from '../../lib/auth';

/**
 * Complete (or skip) the one-time app /welcome. POST from welcome.astro.
 *
 * Body (HTML form encoding):
 *   intent=save|skip            which button was pressed
 *   name=<string>               optional display name (save only)
 *   interest=space&interest=…   repeated; the worlds picked (save only)
 *   next=<path|url>             where to send the reader afterwards
 *
 * Always stamps `welcomed_at` so the /auth/callback gate stops routing this
 * reader here — "welcome" is genuinely once, whether they answer or skip.
 * On `save` it also persists the name + stated interests.
 */

const WORLDS = new Set(['politics', 'space', 'earth', 'tech', 'travel', 'sports']);

/**
 * Append the WelcomeBack toast marker, but only for a publication issue.
 * Inserts the param BEFORE any `#fragment` so an issue anchor
 * (`/issues/foo#margins`) keeps working and the browser still sees the query.
 */
function withWelcomeToast(next: string): string {
  if (!/\/issues\//.test(next)) return next;
  const hash = next.indexOf('#');
  const base = hash === -1 ? next : next.slice(0, hash);
  const frag = hash === -1 ? '' : next.slice(hash);
  return base + (base.includes('?') ? '&' : '?') + 'welcome=1' + frag;
}

export const POST: APIRoute = async (ctx) => {
  const user = requireUser(ctx);
  const { supabase } = ctx.locals;

  const form = await ctx.request.formData();
  const intent = form.get('intent');
  const next = safeNextPath(
    typeof form.get('next') === 'string' ? (form.get('next') as string) : null,
    '/dashboard',
  );

  const update: Record<string, unknown> = { welcomed_at: new Date().toISOString() };

  if (intent !== 'skip') {
    const name = (form.get('name') ?? '').toString().trim();
    // Only overwrite display_name when the reader actually typed something —
    // a blank field must not wipe a name Google already gave us.
    if (name) update.display_name = name.slice(0, 80);

    const interests = form
      .getAll('interest')
      .map((v) => v.toString().toLowerCase())
      .filter((v) => WORLDS.has(v));
    update.stated_interests = [...new Set(interests)];
  }

  // `.select('id')` returns the affected rows so a silent 0-row UPDATE (the
  // profile row somehow absent — the handle_new_user trigger should preclude
  // this) is observable rather than mistaken for success.
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id)
    .select('id');
  if (error) {
    // Best-effort: never trap the reader on the welcome screen over a write
    // hiccup. Log it and send them on; welcomed_at simply stays NULL and
    // they'll see /welcome once more on their next sign-in.
    console.error('[api/onboarding] update failed:', error.message);
  } else if (!updated || updated.length === 0) {
    console.warn('[api/onboarding] no profile row for user; answers not saved:', user.id);
  }

  return ctx.redirect(withWelcomeToast(next));
};
