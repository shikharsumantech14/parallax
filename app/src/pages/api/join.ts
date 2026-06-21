import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';
import { Resend } from 'resend';

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ DRAFT — Tier 1 "unified Join" endpoint. NOT yet wired into the            │
 * │ publication form. Requires operator review + deploy (this endpoint runs   │
 * │ on the app subdomain with the service-role key + Resend, which the        │
 * │ code-only publication account cannot deploy or smoke-test).               │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PURPOSE — the owner's "club them together so users don't do it twice": ONE
 * email field on the publication that, in a single submit, both (a) subscribes
 * the reader to the newsletter and (b) sends them a magic link that creates
 * their account on click. One email → one inbox click → subscribed AND signed in.
 *
 * This mirrors api/subscribe.ts (CORS, validation, admin client, Resend) and
 * adds the Supabase magic-link generation. It is deliberately additive: the
 * publication's NewsletterForm still posts to /api/subscribe until the operator
 * chooses to repoint it here.
 *
 * OPERATOR CHECKLIST before enabling:
 *   1. Confirm `SUPABASE_SERVICE_ROLE_KEY` + `RESEND_API_KEY` are set (they are,
 *      for the existing subscribe + auth flows).
 *   2. Decide newsletter consent semantics: this draft marks the subscription
 *      confirmed at join time (the reader is explicitly creating an account, so
 *      the email is verified by the magic-link click). If you prefer strict
 *      double opt-in for the newsletter, keep `confirmed_at` null here and
 *      confirm it in the /auth/callback handler instead.
 *   3. Verify the magic-link `redirectTo` is in Supabase's allowed redirect URLs
 *      (Auth → URL Configuration) and that safeNextPath allows the publication.
 *   4. Repoint the publication form: in
 *      src/components/core/NewsletterForm.astro change the POST target from
 *      `/api/subscribe` to `/api/join` (or add a dedicated Join form), and
 *      update the success copy ("Check your inbox to confirm and sign in").
 *   5. Smoke-test end to end against prod Supabase.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const APP_URL = import.meta.env.PUBLIC_APP_URL ?? 'https://app.parallaxlens.com';
const ALLOWED_ORIGIN = SITE_URL;

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && (origin === ALLOWED_ORIGIN || origin === 'https://www.parallaxlens.com')) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
  }
  return {};
};

const jsonResponse = (status: number, body: unknown, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

const isValidEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length <= 254;

/** Validate the post-login return path (publication-relative only). */
const safeNext = (next: unknown): string => {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//')) return '/';
  return next;
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  let email = '';
  let nextPath = '/';
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { email?: unknown; next?: unknown };
      email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      nextPath = safeNext(body.next);
    } else {
      const form = await request.formData();
      const raw = form.get('email');
      email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
      nextPath = safeNext(form.get('next'));
    }
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid request body.' }, cors);
  }

  if (!isValidEmail(email)) {
    return jsonResponse(400, { ok: false, error: 'Please enter a valid email address.' }, cors);
  }

  const admin = adminClient();

  // 1) Newsletter subscription. Marked confirmed because the reader is also
  //    creating an account (email verified by the magic-link click). Flip to a
  //    null confirmed_at + token flow if you want strict double opt-in.
  const { error: upsertError } = await admin
    .from('newsletter_subscriptions')
    .upsert(
      {
        email,
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    );

  if (upsertError) {
    console.error('[api/join] newsletter upsert failed:', JSON.stringify({
      message: upsertError.message,
      code: upsertError.code,
      details: upsertError.details,
      hint: upsertError.hint,
    }));
    return jsonResponse(500, { ok: false, error: 'Could not save your details. Try again.' }, cors);
  }

  // 2) Account magic link — creates the user on first click.
  const redirectTo = `${APP_URL}/auth/callback?next=${encodeURIComponent(SITE_URL + nextPath)}`;
  let actionLink = '';
  try {
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo },
    });
    if (error) throw error;
    actionLink = data?.properties?.action_link ?? '';
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[api/join] generateLink failed:', message);
    // Newsletter already saved; surface a soft success so the reader isn't lost.
    return jsonResponse(200, { ok: true, account: false }, cors);
  }

  // 3) One email: confirm + sign in.
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('[api/join] RESEND_API_KEY is not set');
    return jsonResponse(200, { ok: true, account: false }, cors);
  }

  const resend = new Resend(resendKey);
  try {
    await resend.emails.send({
      from: 'Parallax Lens <noreply@parallaxlens.com>',
      to: email,
      subject: 'Your Parallax shelf is one tap away',
      text: joinEmailText(actionLink),
      html: joinEmailHtml(actionLink),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[api/join] resend send failed:', message);
    return jsonResponse(200, { ok: true, account: false }, cors);
  }

  return jsonResponse(200, { ok: true, account: true }, cors);
};

function joinEmailText(link: string): string {
  return `Welcome to Parallax

You're subscribed to the dispatch — one letter per issue, nothing else.

Open your shelf with one tap (this link signs you in and expires in 60 minutes):

${link}

Your shelf lets you save issues, follow a world, and pick up where you left off.

If you didn't request this, ignore this email.

— Parallax Lens
parallaxlens.com
`;
}

function joinEmailHtml(link: string): string {
  return `<!doctype html>
<html><body style="font-family: Georgia, 'Times New Roman', serif; max-width: 540px; margin: 32px auto; padding: 0 16px; color: #15130f; background: #faf7f0; line-height: 1.6;">
  <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7a6d5e; margin: 0 0 20px; padding-bottom: 14px; border-bottom: 2px solid #15130f;">PARALLAX · WELCOME</p>
  <h1 style="font-family: Georgia, serif; font-weight: 500; font-size: 26px; line-height: 1.2; margin: 0 0 18px;">Open your <em style="color: #b8341f; font-weight: 400;">shelf</em>.</h1>
  <p style="margin: 0 0 16px;">You're subscribed to the dispatch — one letter per issue, nothing else.</p>
  <p style="margin: 24px 0;">
    <a href="${link}" style="display: inline-block; padding: 14px 22px; background: #15130f; color: #faf7f0; text-decoration: none; font-family: 'Helvetica Neue', sans-serif; font-weight: 500; font-size: 14px;">Sign in &amp; open my shelf</a>
  </p>
  <p style="margin: 16px 0; font-size: 13px; color: #7a6d5e;">This one-tap link signs you in and expires in 60 minutes. Or paste it into your browser:<br/><a href="${link}" style="color: #7a6d5e; word-break: break-all;">${link}</a></p>
  <p style="font-size: 13px; color: #7a6d5e; margin-top: 28px;">If you didn't request this, ignore this email.</p>
  <p style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.16em; color: #7a6d5e; margin-top: 32px;">© 2026 PARALLAX LENS™ &middot; parallaxlens.com</p>
</body></html>`;
}
