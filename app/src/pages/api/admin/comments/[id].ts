import type { APIRoute } from 'astro';
import { adminClient } from '../../../../lib/supabase';
import { requireAdmin } from '../../../../lib/admin';

/**
 * Moderate a single comment.
 *
 * POST /api/admin/comments/<uuid>
 * Body: { action: 'approve' | 'hide' | 'reset' }
 *
 * - approve: status → 'approved' (becomes public on the issue page)
 * - hide:    status → 'hidden'   (author still sees it; nobody else)
 * - reset:   status → 'pending'  (un-approves or un-hides; back to queue)
 *
 * Admin-only. Uses service-role.
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
    return new Response(JSON.stringify({ ok: false, error: 'Invalid comment id.' }), {
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
    hide: 'hidden',
    reset: 'pending',
  };
  const nextStatus = ACTIONS[action];
  if (!nextStatus) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid action. Use approve|hide|reset.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const admin = adminClient();
  const { data, error } = await admin
    .from('comments')
    .update({ status: nextStatus })
    .eq('id', id)
    .select('id, status')
    .maybeSingle();

  if (error) {
    console.error('[api/admin/comments POST] update failed:', error.message);
    return new Response(JSON.stringify({ ok: false, error: 'Could not update comment.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ ok: false, error: 'Comment not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, id: data.id, status: data.status }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
