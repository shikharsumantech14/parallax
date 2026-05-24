import type { APIRoute } from 'astro';

/**
 * Save-for-later API.
 *
 * GET    /api/save/<issueId>   → { saved: boolean }       (or 401 if anonymous)
 * POST   /api/save/<issueId>   → { saved: boolean }       (toggles; 401 if anonymous)
 * DELETE /api/save/<issueId>   → { saved: false }         (explicit remove)
 *
 * Called by the publication's SaveButton client island. CORS-locked to
 * parallaxlens.com.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  'https://www.parallaxlens.com',
  'http://localhost:4321', // publication dev port
]);

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
  }
  return {};
};

const json = (status: number, body: unknown, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

const isSafeIssueId = (id: string): boolean =>
  // YYYY-MM-DD-kebab-slug format; keep it strict to prevent injection-shaped values
  /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id) && id.length <= 80;

export const OPTIONS: APIRoute = async ({ request }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  return new Response(null, { status: 204, headers: cors });
};

export const GET: APIRoute = async ({ request, locals, params }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const issueId = params.issueId ?? '';
  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }

  const { user, supabase } = locals;
  if (!user) {
    return json(401, { ok: false, signedOut: true }, cors);
  }

  const { data, error } = await supabase
    .from('saved_issues')
    .select('issue_id')
    .eq('user_id', user.id)
    .eq('issue_id', issueId)
    .maybeSingle();

  if (error) {
    console.error('[api/save GET] select failed:', JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }));
    return json(500, { ok: false, error: 'Lookup failed.' }, cors);
  }

  return json(200, { ok: true, saved: Boolean(data) }, cors);
};

export const POST: APIRoute = async ({ request, locals, params }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const issueId = params.issueId ?? '';
  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }

  const { user, supabase } = locals;
  if (!user) {
    return json(401, { ok: false, signedOut: true }, cors);
  }

  // Toggle: check current state, then insert or delete accordingly.
  const { data: existing, error: lookupError } = await supabase
    .from('saved_issues')
    .select('issue_id')
    .eq('user_id', user.id)
    .eq('issue_id', issueId)
    .maybeSingle();

  if (lookupError) {
    console.error('[api/save POST] lookup failed:', lookupError.message);
    return json(500, { ok: false, error: 'Toggle failed.' }, cors);
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from('saved_issues')
      .delete()
      .eq('user_id', user.id)
      .eq('issue_id', issueId);
    if (deleteError) {
      console.error('[api/save POST] delete failed:', deleteError.message);
      return json(500, { ok: false, error: 'Could not unsave.' }, cors);
    }
    return json(200, { ok: true, saved: false }, cors);
  }

  const { error: insertError } = await supabase
    .from('saved_issues')
    .insert({ user_id: user.id, issue_id: issueId });
  if (insertError) {
    console.error('[api/save POST] insert failed:', insertError.message);
    return json(500, { ok: false, error: 'Could not save.' }, cors);
  }
  return json(200, { ok: true, saved: true }, cors);
};

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const issueId = params.issueId ?? '';
  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }

  const { user, supabase } = locals;
  if (!user) {
    return json(401, { ok: false, signedOut: true }, cors);
  }

  const { error } = await supabase
    .from('saved_issues')
    .delete()
    .eq('user_id', user.id)
    .eq('issue_id', issueId);

  if (error) {
    console.error('[api/save DELETE] failed:', error.message);
    return json(500, { ok: false, error: 'Could not unsave.' }, cors);
  }
  return json(200, { ok: true, saved: false }, cors);
};
