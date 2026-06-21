import type { APIRoute } from 'astro';
import { serverClient } from '../../lib/supabase';

/**
 * GET /api/me — minimal auth probe for the publication's reading gate.
 *
 * Returns { authed: boolean } based on the shared Supabase session cookie.
 * The publication's ReadingGate ships with a cookie-presence heuristic (works
 * because @supabase/ssr writes a client-readable cookie); this endpoint is the
 * OPTIONAL server-confirmed upgrade — once deployed, the gate can call it with
 * credentials to be certain (e.g. ignore an expired cookie). CORS-locked to the
 * publication origins, same pattern as api/subscribe.ts.
 *
 * DRAFT for operator deploy (runs on the app subdomain). Wiring the gate to
 * prefer it is optional; the cookie heuristic is sufficient for the soft wall.
 */
const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const ALLOWED = new Set([SITE_URL, 'https://www.parallaxlens.com', 'http://localhost:4321']);

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'private, no-store, max-age=0',
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

export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });

export const GET: APIRoute = async (ctx) => {
  const cors = corsHeaders(ctx.request.headers.get('origin'));
  try {
    const supabase = serverClient({ cookies: ctx.cookies, headers: ctx.request.headers });
    const { data } = await supabase.auth.getUser();
    return json(200, { authed: !!data.user }, cors);
  } catch {
    return json(200, { authed: false }, cors);
  }
};
