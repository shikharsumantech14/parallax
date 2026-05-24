import type { APIRoute } from 'astro';

/**
 * Sign out. POST-only to prevent CSRF via image-tag GETs.
 * Clears the Supabase session cookie and redirects back to the publication.
 */
export const POST: APIRoute = async (ctx) => {
  const { supabase } = ctx.locals;
  await supabase.auth.signOut();

  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
  return ctx.redirect(siteUrl);
};

// Friendly response if someone hits it with GET (e.g. by accident from a browser bar)
export const GET: APIRoute = async (ctx) => {
  return new Response('Method Not Allowed. Use POST to sign out.', {
    status: 405,
    headers: { allow: 'POST' },
  });
};
