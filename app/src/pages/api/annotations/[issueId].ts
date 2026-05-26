import type { APIRoute } from 'astro';

/**
 * Annotations API.
 *
 * GET  /api/annotations/<issueId>  → { ok, mine: Annotation[], approved: Annotation[] }
 * POST /api/annotations/<issueId>  → create. body: { body_md, anchor }
 *                                    Returns the created row.
 *
 * Anchor JSON shape (W3C TextQuoteSelector):
 *   { exact: string, before?: string, after?: string, section_index?: number }
 *
 * - GET works anonymously (returns approved-only).
 * - POST requires authentication. Status is forced to 'pending' on the
 *   server regardless of input (RLS also enforces this).
 *
 * CORS locked to parallaxlens.com.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  'https://www.parallaxlens.com',
  'http://localhost:4321',
]);

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
  /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id) && id.length <= 80;

interface AnchorInput {
  exact?: unknown;
  before?: unknown;
  after?: unknown;
  section_index?: unknown;
}

/**
 * Validate and normalise an anchor payload. Returns null if invalid.
 */
function sanitiseAnchor(raw: unknown): {
  exact: string;
  before: string;
  after: string;
  section_index: number | null;
} | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as AnchorInput;
  const exact = typeof r.exact === 'string' ? r.exact.trim() : '';
  if (!exact || exact.length > 1000) return null;
  const before = typeof r.before === 'string' ? r.before.slice(-80) : '';
  const after = typeof r.after === 'string' ? r.after.slice(0, 80) : '';
  const section_index =
    typeof r.section_index === 'number' && Number.isInteger(r.section_index) && r.section_index >= 0
      ? r.section_index
      : null;
  return { exact, before, after, section_index };
}

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
};

export const GET: APIRoute = async ({ request, locals, params }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const issueId = params.issueId ?? '';
  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }

  const { user, supabase } = locals;

  // Approved annotations are public: anyone can see them.
  // We rely on RLS to filter — the SELECT policy returns approved + own.
  const { data: rows, error } = await supabase
    .from('comments')
    .select('id, user_id, body_md, anchor, status, created_at, edited_at')
    .eq('issue_id', issueId)
    .not('anchor', 'is', null) // annotations only — not letters
    .in('status', user ? ['pending', 'approved'] : ['approved'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[api/annotations GET] failed:', error.message);
    return json(500, { ok: false, error: 'Could not load annotations.' }, cors);
  }

  const mine: typeof rows = [];
  const approved: typeof rows = [];
  for (const row of rows ?? []) {
    if (row.status === 'approved') {
      approved.push(row);
    } else if (user && row.user_id === user.id) {
      mine.push(row);
    }
  }

  return json(200, { ok: true, mine, approved }, cors);
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

  let body: { body_md?: unknown; anchor?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body.' }, cors);
  }

  const bodyMd = typeof body.body_md === 'string' ? body.body_md.trim() : '';
  if (!bodyMd) {
    return json(400, { ok: false, error: 'Note text is required.' }, cors);
  }
  if (bodyMd.length > 2000) {
    return json(400, { ok: false, error: 'Note is too long (max 2000 chars).' }, cors);
  }

  const anchor = sanitiseAnchor(body.anchor);
  if (!anchor) {
    return json(400, { ok: false, error: 'Annotation requires a valid anchor with an `exact` selection.' }, cors);
  }

  const { data: inserted, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      issue_id: issueId,
      body_md: bodyMd,
      anchor,
      // status defaults to 'pending' via DB default
    })
    .select('id, body_md, anchor, status, created_at')
    .single();

  if (error) {
    console.error('[api/annotations POST] insert failed:', JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }));
    return json(500, { ok: false, error: 'Could not save annotation.' }, cors);
  }

  return json(200, { ok: true, annotation: inserted }, cors);
};
