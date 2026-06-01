import type { APIRoute } from 'astro';
import { adminClient } from '../../../lib/supabase';
import { requireAdmin } from '../../../lib/admin';

/**
 * Moderation queue — list comments.
 *
 * GET /api/admin/comments?status=pending|approved|hidden|removed&limit=100
 *
 * Default: returns pending comments only, oldest first (longest waiting at top).
 * For "recent activity," call with status=approved.
 *
 * Admin-only. Uses service-role client to read every row regardless of RLS.
 */
export const GET: APIRoute = async (ctx) => {
  let user;
  try {
    user = requireAdmin(ctx.locals.user);
  } catch (resp) {
    if (resp instanceof Response) return resp;
    throw resp;
  }

  const status = ctx.url.searchParams.get('status') ?? 'pending';
  const limit = Math.min(parseInt(ctx.url.searchParams.get('limit') ?? '100', 10) || 100, 200);

  const VALID = new Set(['pending', 'approved', 'hidden', 'removed']);
  if (!VALID.has(status)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid status filter.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const admin = adminClient();
  // Pull rows + author email via a join. profiles has email.
  const { data: rows, error } = await admin
    .from('comments')
    .select('id, user_id, issue_id, body_md, status, anchor, ai_risk_score, created_at, edited_at, profiles:user_id(email, display_name)')
    .eq('status', status)
    .order('created_at', { ascending: status === 'pending' })
    .limit(limit);

  if (error) {
    console.error('[api/admin/comments GET] failed:', error.message);
    return new Response(JSON.stringify({ ok: false, error: 'Could not load queue.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, items: rows ?? [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
