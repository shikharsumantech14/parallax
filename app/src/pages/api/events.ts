import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';

/**
 * Reading-events ingestion endpoint.
 *
 * POST /api/events
 * Body: { issueId, eventKind, anonId?, meta? }
 *
 * - Authenticated requests record events with user_id from the session.
 * - Anonymous requests must supply anonId; it must be a v4 UUID.
 * - Both branches use the admin client for the insert (bypasses RLS so
 *   we don't depend on the supabase-js session correctly forwarding the
 *   anonymous insert grant — simpler control surface).
 *
 * CORS: locked to parallaxlens.com origins. The publication's
 * ReadingTracker fires fetch() calls with credentials: 'include'.
 *
 * No rate limiting in v1. If abuse appears (someone scripting events to
 * pollute analytics), add a per-anon-id throttle in front of the insert.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  'https://www.parallaxlens.com',
  'http://localhost:4321',
]);

const VALID_EVENT_KINDS = new Set([
  'open',
  'scroll_25',
  'scroll_75',
  'finish',
  'share',
  'source_click',
  'term_lookup',
]);

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUuid = (s: string): boolean => UUID_V4_RE.test(s);

/**
 * Lightly sanitise meta. Allow only flat string/number/boolean values; cap
 * the payload size to prevent abuse.
 */
function sanitiseMeta(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return {};
  if (typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out: Record<string, unknown> = {};
  let bytes = 0;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof k !== 'string' || k.length > 32) continue;
    if (
      typeof v === 'string' ? v.length <= 200 :
      typeof v === 'number' || typeof v === 'boolean'
    ) {
      out[k] = v;
      bytes += k.length + (typeof v === 'string' ? v.length : 8);
      if (bytes > 1024) break;
    }
  }
  return out;
}

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const cors = corsHeaders(request.headers.get('origin'));

  // Parse body
  let body: { issueId?: unknown; eventKind?: unknown; anonId?: unknown; meta?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body.' }, cors);
  }

  const issueId = typeof body.issueId === 'string' ? body.issueId : '';
  const eventKind = typeof body.eventKind === 'string' ? body.eventKind : '';
  const anonIdRaw = typeof body.anonId === 'string' ? body.anonId : null;

  if (!isSafeIssueId(issueId)) {
    return json(400, { ok: false, error: 'Invalid issue id.' }, cors);
  }
  if (!VALID_EVENT_KINDS.has(eventKind)) {
    return json(400, { ok: false, error: 'Invalid event kind.' }, cors);
  }

  const meta = sanitiseMeta(body.meta);
  if (meta === null) {
    return json(400, { ok: false, error: 'Invalid meta payload.' }, cors);
  }

  const user = locals.user;

  // Decide subject: authenticated (user_id) OR anonymous (anon_id).
  let userId: string | null = null;
  let anonId: string | null = null;

  if (user) {
    userId = user.id;
    // anon_id is ignored once the user is authenticated.
  } else {
    if (!anonIdRaw || !isValidUuid(anonIdRaw)) {
      return json(400, { ok: false, error: 'Anonymous events require a valid anonId (UUID v4).' }, cors);
    }
    anonId = anonIdRaw;
  }

  // Use the admin client to bypass RLS — we've already validated the
  // subject above. This is simpler than relying on the SSR client to
  // proxy the right grants for the anonymous insert case.
  const admin = adminClient();
  const { error } = await admin.from('reading_events').insert({
    user_id: userId,
    anon_id: anonId,
    issue_id: issueId,
    event_kind: eventKind,
    meta,
  });

  if (error) {
    console.error('[api/events] insert failed:', JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }));
    return json(500, { ok: false, error: 'Could not record event.' }, cors);
  }

  return json(200, { ok: true }, cors);
};
