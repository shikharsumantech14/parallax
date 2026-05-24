import type { APIRoute } from 'astro';
import { adminClient } from '../../../lib/supabase';

/**
 * Reactions API.
 *
 * GET   /api/reactions/<issueId>   → { ok: true, userKinds: string[], counts: Record<kind, n> | null }
 * POST  /api/reactions/<issueId>   body { kind } → toggles that kind for current user
 *
 * Aggregated counts are returned only when the issue's total reactions ≥ 3.
 * Below that threshold counts return null — avoids the "0 likes" loneliness.
 *
 * Auth: GET is anonymous-safe (userKinds = []). POST requires sign-in.
 * CORS: locked to parallaxlens.com.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  'https://www.parallaxlens.com',
  'http://localhost:4321',
]);

const VALID_KINDS = new Set(['think', 'agree', 'disagree', 'want_more']);
const COUNT_VISIBILITY_THRESHOLD = 3;

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

/**
 * Aggregate reaction counts across all users for an issue.
 * Returns null when total < COUNT_VISIBILITY_THRESHOLD.
 */
async function fetchCounts(issueId: string): Promise<Record<string, number> | null> {
  const admin = adminClient();
  // Pull all rows and aggregate in JS. At low scale this is fine; if any
  // single issue exceeds ~10k reactions this should move to a server-side
  // aggregate function (CREATE OR REPLACE FUNCTION ... LANGUAGE sql).
  const { data, error } = await admin
    .from('reactions')
    .select('kind')
    .eq('issue_id', issueId);

  if (error) {
    console.error('[api/reactions] count fetch failed:', error.message);
    return null;
  }

  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of data ?? []) {
    counts[row.kind] = (counts[row.kind] ?? 0) + 1;
    total += 1;
  }

  if (total < COUNT_VISIBILITY_THRESHOLD) return null;
  return counts;
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

  let userKinds: string[] = [];
  if (user) {
    const { data, error } = await supabase
      .from('reactions')
      .select('kind')
      .eq('user_id', user.id)
      .eq('issue_id', issueId);
    if (error) {
      console.error('[api/reactions GET] own reactions failed:', error.message);
    } else {
      userKinds = (data ?? []).map((r) => r.kind as string);
    }
  }

  const counts = await fetchCounts(issueId);

  return json(200, { ok: true, userKinds, counts }, cors);
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

  let body: { kind?: unknown };
  try {
    body = (await request.json()) as { kind?: unknown };
  } catch {
    return json(400, { ok: false, error: 'Invalid request body.' }, cors);
  }

  const kind = typeof body.kind === 'string' ? body.kind : '';
  if (!VALID_KINDS.has(kind)) {
    return json(400, { ok: false, error: 'Invalid reaction kind.' }, cors);
  }

  // Toggle: check if user has this reaction already.
  const { data: existing, error: lookupError } = await supabase
    .from('reactions')
    .select('kind')
    .eq('user_id', user.id)
    .eq('issue_id', issueId)
    .eq('kind', kind)
    .maybeSingle();

  if (lookupError) {
    console.error('[api/reactions POST] lookup failed:', lookupError.message);
    return json(500, { ok: false, error: 'Toggle failed.' }, cors);
  }

  if (existing) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', user.id)
      .eq('issue_id', issueId)
      .eq('kind', kind);
    if (error) {
      console.error('[api/reactions POST] delete failed:', error.message);
      return json(500, { ok: false, error: 'Could not remove reaction.' }, cors);
    }
  } else {
    const { error } = await supabase
      .from('reactions')
      .insert({ user_id: user.id, issue_id: issueId, kind });
    if (error) {
      console.error('[api/reactions POST] insert failed:', error.message);
      return json(500, { ok: false, error: 'Could not add reaction.' }, cors);
    }
  }

  // Re-fetch user's complete reaction set + counts to return fresh state.
  const { data: userRows } = await supabase
    .from('reactions')
    .select('kind')
    .eq('user_id', user.id)
    .eq('issue_id', issueId);

  const userKinds = (userRows ?? []).map((r) => r.kind as string);
  const counts = await fetchCounts(issueId);

  return json(200, { ok: true, userKinds, counts }, cors);
};
