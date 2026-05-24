import type { APIRoute } from 'astro';
import { requireUser } from '../../../lib/auth';
import { adminClient } from '../../../lib/supabase';

/**
 * Account deletion.
 *
 * PDPDP / GDPR right-to-erasure. We use the service-role client to delete
 * the auth.users row, which cascades to:
 *   - profiles (FK with ON DELETE CASCADE)
 *   - saved_issues (FK with ON DELETE CASCADE)
 *
 * For newsletter_subscriptions, we unlink the user_id rather than hard-delete
 * the email row — this preserves the audit trail of consent withdrawal
 * (the unsubscribed_at timestamp) while removing the user-account link.
 *
 * After deletion, sign the user out and redirect to the publication with
 * a confirmation notice.
 */
export const POST: APIRoute = async (ctx) => {
  const user = requireUser(ctx);
  const { supabase } = ctx.locals;
  const admin = adminClient();

  // Step 1: soft-delete newsletter subscription linked to this user (preserve audit row).
  const { error: unsubError } = await admin
    .from('newsletter_subscriptions')
    .update({ unsubscribed_at: new Date().toISOString(), user_id: null })
    .eq('user_id', user.id);

  if (unsubError) {
    console.error('[api/account/delete] newsletter unlink failed:', unsubError.message);
    // Continue anyway — deleting the auth user is the priority.
  }

  // Step 2: delete the auth.users row. Cascade FK constraints delete profile + saved_issues.
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('[api/account/delete] auth.users delete failed:', deleteError.message);
    return ctx.redirect(
      '/dashboard?notice=' +
        encodeURIComponent('Could not delete your account. Email privacy@parallaxlens.com and we will handle it manually.') +
        '&kind=err',
    );
  }

  // Step 3: sign out (clear the session cookie on this client).
  await supabase.auth.signOut();

  // Step 4: redirect to publication with confirmation.
  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
  return ctx.redirect(`${siteUrl}/?account-deleted=1`);
};
