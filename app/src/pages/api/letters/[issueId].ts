import type { APIRoute } from 'astro';

/**
 * Letters API.
 *
 * GET  /api/letters/<issueId>  → { ok, mine, approved, defaultName, signedIn }
 * POST /api/letters/<issueId>  → create. body: { body_md, author_name? }
 *
 * Letters are end-of-issue reader submissions. They share the `comments`
 * table with annotations but carry NO anchor (anchor IS NULL) — that's the
 * discriminator used everywhere (annotations filter `.not('anchor','is',null)`,
 * letters filter `.is('anchor', null)`). They flow through the same moderation
 * queue (`/admin/comments`).
 *
 * - GET works anonymously (approved letters only). Signed-in users also get
 *   their own pending letters back ("in review"), plus `defaultName` to
 *   prefill the sign-as field and `signedIn` so the form can prompt login.
 * - POST requires auth. Status is forced to 'pending' (DB default + RLS).
 * - author_name is the public pen name, captured at submit. Falls back to the
 *   reader's own profile display_name (readable via RLS), else null.
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

/** Normalise a free-text name: collapse whitespace, cap 80, empty → null. */
const cleanName = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null;
  const n = raw.trim().replace(/\s+/g, ' ');
  return n ? n.slice(0, 80) : null;
};

export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });

export const GET: APIRoute = async ({ request, locals, params }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const issueId = params.issueId ?? '';
  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }

  const { user, supabase } = locals;

  // RLS returns approved (public) + the requester's own rows. We filter to
  // letters (anchor IS NULL) and to the relevant statuses.
  const { data: rows, error } = await supabase
    .from('comments')
    .select('id, user_id, body_md, author_name, status, created_at')
    .eq('issue_id', issueId)
    .is('anchor', null) // letters only — not annotations
    .in('status', user ? ['pending', 'approved'] : ['approved'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[api/letters GET] failed:', error.message);
    return json(500, { ok: false, error: 'Could not load letters.' }, cors);
  }

  const mine: NonNullable<typeof rows> = [];
  const approved: NonNullable<typeof rows> = [];
  for (const row of rows ?? []) {
    if (row.status === 'approved') approved.push(row);
    else if (user && row.user_id === user.id) mine.push(row);
  }

  // Prefill the reader's "sign as" field with their own profile display name.
  // RLS (profiles_select_own) lets a signed-in user read only their own row.
  let defaultName: string | null = null;
  if (user) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();
    defaultName = cleanName(prof?.display_name);
  }

  return json(200, { ok: true, mine, approved, defaultName, signedIn: !!user }, cors);
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

  let body: { body_md?: unknown; author_name?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body.' }, cors);
  }

  const bodyMd = typeof body.body_md === 'string' ? body.body_md.trim() : '';
  if (!bodyMd) {
    return json(400, { ok: false, error: 'Your letter needs some text.' }, cors);
  }
  if (bodyMd.length > 2000) {
    return json(400, { ok: false, error: 'Letter is too long (max 2000 chars).' }, cors);
  }

  // Author name: explicit input wins; else fall back to the reader's profile
  // display name; else null (the UI shows "A reader").
  let authorName = cleanName(body.author_name);
  if (!authorName) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();
    authorName = cleanName(prof?.display_name);
  }

  const { data: inserted, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      issue_id: issueId,
      body_md: bodyMd,
      author_name: authorName,
      // anchor omitted → NULL: this is what marks the row as a letter.
      // status defaults to 'pending' via the DB default (+ enforced by RLS).
    })
    .select('id, body_md, author_name, status, created_at')
    .single();

  if (error) {
    console.error('[api/letters POST] insert failed:', JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }));
    return json(500, { ok: false, error: 'Could not save your letter.' }, cors);
  }

  return json(200, { ok: true, letter: inserted }, cors);
};
