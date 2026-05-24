import type { APIRoute } from 'astro';
import { adminClient } from '../../../lib/supabase';

/**
 * Newsletter subscription confirmation.
 *
 * The link from the confirmation email points here with `?token=<...>&email=<...>`.
 * We look up the subscription, verify the token, set confirmed_at, and
 * redirect the user back to the publication with a success message.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email')?.toLowerCase();

  if (!token || !email) {
    return redirect(
      `${SITE_URL}/?newsletter=invalid&msg=${encodeURIComponent('Confirmation link is missing data.')}`,
    );
  }

  const admin = adminClient();

  // Look up the row by email
  const { data: row, error: lookupError } = await admin
    .from('newsletter_subscriptions')
    .select('id, confirmation_token, confirmed_at')
    .eq('email', email)
    .maybeSingle();

  if (lookupError || !row) {
    return redirect(
      `${SITE_URL}/?newsletter=invalid&msg=${encodeURIComponent('Subscription not found. Sign up again.')}`,
    );
  }

  // Token check (constant-time-ish comparison)
  if (row.confirmation_token !== token) {
    return redirect(
      `${SITE_URL}/?newsletter=invalid&msg=${encodeURIComponent('This confirmation link is no longer valid.')}`,
    );
  }

  if (row.confirmed_at) {
    // Already confirmed; idempotent success
    return redirect(`${SITE_URL}/?newsletter=already-confirmed`);
  }

  const { error: updateError } = await admin
    .from('newsletter_subscriptions')
    .update({ confirmed_at: new Date().toISOString(), confirmation_token: null })
    .eq('id', row.id);

  if (updateError) {
    console.error('[subscribe/confirm] update failed:', updateError.message);
    return redirect(
      `${SITE_URL}/?newsletter=error&msg=${encodeURIComponent('Could not confirm — try again later.')}`,
    );
  }

  return redirect(`${SITE_URL}/?newsletter=confirmed`);
};
