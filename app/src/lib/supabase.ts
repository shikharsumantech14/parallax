/**
 * Supabase client factories for the Parallax app subdomain.
 *
 * Three clients:
 *
 *   1. browserClient()    — for client-side JS in the publication's
 *                            client islands (talks to this app via CORS)
 *   2. serverClient(ctx)  — for Astro SSR routes; reads cookies for
 *                            auth, uses the `anon` key + user session
 *   3. adminClient()      — uses the SERVICE_ROLE key; SERVER ONLY,
 *                            never imported from a route that may
 *                            return data to the browser
 *
 * Cookie scope: `.parallaxlens.com` so that sessions are shared
 * between the publication's client islands and this app's pages.
 *
 * Phase A scope: this file just defines the factories. Actual usage
 * arrives in subsequent commits as auth + dashboard pages are wired.
 */

import { createServerClient, createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing env: ${name}. See app/.env.example.`);
  }
  return value;
}

/**
 * Cookie domain for the session cookie. In production, scope to the
 * apex so both parallaxlens.com and app.parallaxlens.com share it.
 * In dev, leave undefined so the cookie sticks to localhost.
 */
function cookieDomain(): string | undefined {
  const isProd = import.meta.env.PROD;
  return isProd ? '.parallaxlens.com' : undefined;
}

/**
 * Browser client — client-side JS only. Used by client islands on the
 * publication AND by interactive bits of the dashboard.
 */
export function browserClient() {
  const url = assertEnv('PUBLIC_SUPABASE_URL', SUPABASE_URL);
  const key = assertEnv('PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
  return createBrowserClient(url, key, {
    cookieOptions: {
      domain: cookieDomain(),
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      path: '/',
    },
  });
}

/**
 * Server client — for Astro SSR routes. Reads session cookies from the
 * request via Astro's cookie API and forwards them to Supabase.
 *
 * Usage:
 *   const supabase = serverClient({ cookies: Astro.cookies, headers: Astro.request.headers });
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export function serverClient(ctx: { cookies: AstroCookies; headers: Headers }) {
  const url = assertEnv('PUBLIC_SUPABASE_URL', SUPABASE_URL);
  const key = assertEnv('PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        const all: { name: string; value: string }[] = [];
        // AstroCookies doesn't expose a list — re-derive from the request header
        const header = ctx.headers.get('cookie') ?? '';
        for (const pair of header.split(';')) {
          const eq = pair.indexOf('=');
          if (eq < 1) continue;
          const name = pair.slice(0, eq).trim();
          const value = decodeURIComponent(pair.slice(eq + 1).trim());
          if (name) all.push({ name, value });
        }
        return all;
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          ctx.cookies.set(name, value, {
            ...options,
            domain: cookieDomain(),
            sameSite: 'lax',
            secure: import.meta.env.PROD,
            path: '/',
          });
        }
      },
    },
  });
}

/**
 * Admin client — uses the service-role key. Bypasses RLS. SERVER ONLY.
 * Use only for:
 *   - account deletion (PDPDP/GDPR right-to-erasure)
 *   - cron jobs and scheduled maintenance
 *   - admin/moderation tools
 *
 * NEVER use this client in a route that returns data to the browser.
 */
export function adminClient() {
  const url = assertEnv('PUBLIC_SUPABASE_URL', SUPABASE_URL);
  const key = assertEnv('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
