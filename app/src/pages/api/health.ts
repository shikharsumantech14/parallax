import type { APIRoute } from 'astro';

/**
 * Health check. Returns 200 if the runtime is up and env vars look sane.
 * Used by Vercel deployment checks and as a smoke test in dev.
 */
export const GET: APIRoute = async () => {
  const env = {
    supabase_url: Boolean(import.meta.env.PUBLIC_SUPABASE_URL),
    supabase_anon: Boolean(import.meta.env.PUBLIC_SUPABASE_ANON_KEY),
    supabase_service: Boolean(import.meta.env.SUPABASE_SERVICE_ROLE_KEY),
    resend: Boolean(import.meta.env.RESEND_API_KEY),
    site_url: import.meta.env.PUBLIC_SITE_URL ?? null,
    app_url: import.meta.env.PUBLIC_APP_URL ?? null,
  };

  return new Response(
    JSON.stringify({
      ok: true,
      phase: 'A',
      runtime: 'astro-ssr',
      timestamp: new Date().toISOString(),
      env,
    }, null, 2),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    },
  );
};
