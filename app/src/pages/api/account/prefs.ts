import type { APIRoute } from 'astro';
import { requireUser } from '../../../lib/auth';

/**
 * Update email preferences. POST from the dashboard form.
 *
 * Body: `weekly_digest=on&issue_publish=on&reengagement=` (HTML form encoding)
 */
export const POST: APIRoute = async (ctx) => {
  const user = requireUser(ctx);
  const { supabase } = ctx.locals;

  const formData = await ctx.request.formData();
  const prefs = {
    weekly_digest: formData.get('weekly_digest') === 'on',
    issue_publish: formData.get('issue_publish') === 'on',
    reengagement: formData.get('reengagement') === 'on',
  };

  const { error } = await supabase
    .from('profiles')
    .update({ email_prefs: prefs })
    .eq('id', user.id);

  if (error) {
    console.error('[api/account/prefs] update failed:', error.message);
    return ctx.redirect('/dashboard?notice=' + encodeURIComponent('Could not save preferences. Try again.') + '&kind=err');
  }

  return ctx.redirect('/dashboard?notice=' + encodeURIComponent('Preferences saved.') + '&kind=ok');
};
