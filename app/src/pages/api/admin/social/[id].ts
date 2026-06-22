import type { APIRoute } from 'astro';
import { adminClient } from '../../../../lib/supabase';
import { requireAdmin } from '../../../../lib/admin';

/**
 * Moderate a single social post (the approval gate).
 *
 * POST /api/admin/social/<uuid>
 * Body: { action: 'approve' | 'reject' | 'reset' }
 *
 * - approve: status → 'approved'  (the scheduler/poster picks it up)
 * - reject:  status → 'rejected'  (won't be posted)
 * - reset:   status → 'pending'   (back to the queue)
 *
 * Admin-only. Uses service-role. Never flips a row straight to 'posted' —
 * that transition belongs to the poster job after a successful publish.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const POST: APIRoute = async (ctx) => {
  try {
    requireAdmin(ctx.locals.user);
  } catch (resp) {
    if (resp instanceof Response) return resp;
    throw resp;
  }

  const id = ctx.params.id ?? '';
  if (!UUID_RE.test(id)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid post id.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { action?: unknown };
  try {
    body = (await ctx.request.json()) as { action?: unknown };
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const action = typeof body.action === 'string' ? body.action : '';
  const ACTIONS: Record<string, string> = {
    approve: 'approved',
    reject: 'rejected',
    reset: 'pending',
  };
  const nextStatus = ACTIONS[action];
  if (!nextStatus) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid action. Use approve|reject|reset.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const admin = adminClient();
  const { data, error } = await admin
    .from('social_posts')
    .update({ status: nextStatus })
    .eq('id', id)
    // Guard: never override a row the poster already published or failed.
    .in('status', ['pending', 'approved', 'rejected'])
    .select('id, status')
    .maybeSingle();

  if (error) {
    console.error('[api/admin/social POST] update failed:', error.message);
    return new Response(JSON.stringify({ ok: false, error: 'Could not update post.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ ok: false, error: 'Post not found, or already posted/failed.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, id: data.id, status: data.status }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
