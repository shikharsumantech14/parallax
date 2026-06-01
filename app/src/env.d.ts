/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { User, SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      /** Authenticated Supabase user, or null if anonymous. Populated by middleware. */
      user: User | null;
      /** Per-request Supabase client with the session cookie attached. */
      supabase: SupabaseClient;
    }
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_SITE_URL: string;
  /** Comma-separated admin email allowlist for moderation surfaces. Server-only. */
  readonly ADMIN_EMAILS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
