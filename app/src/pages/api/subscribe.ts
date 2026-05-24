import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';
import { Resend } from 'resend';

/**
 * Newsletter signup endpoint.
 *
 * Called by the publication's footer form (anonymous — no auth required).
 * CORS-enabled for parallaxlens.com only.
 *
 * Flow:
 *   1. POST { email } from the publication footer
 *   2. Insert into newsletter_subscriptions with a fresh confirmation_token
 *   3. Send Resend confirmation email with the token link
 *   4. Return { ok: true }
 *
 * Idempotent on email — re-subscribing the same address resends the
 * confirmation token but doesn't error.
 */

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com';
const APP_URL = import.meta.env.PUBLIC_APP_URL ?? 'https://app.parallaxlens.com';
const ALLOWED_ORIGIN = SITE_URL;

const corsHeaders = (origin: string | null): Record<string, string> => {
  // Echo allowed origin only when it matches; otherwise don't set CORS headers
  // (the browser will block the response, which is the right behaviour).
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

function randomToken(): string {
  // 32 hex chars = 128 bits of entropy. URL-safe.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  // Parse body (accept both JSON and form-encoded)
  let email = '';
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { email?: unknown };
      email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    } else {
      const form = await request.formData();
      const raw = form.get('email');
      email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
    }
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid request body.' }, cors);
  }

  if (!isValidEmail(email)) {
    return jsonResponse(400, { ok: false, error: 'Please enter a valid email address.' }, cors);
  }

  const admin = adminClient();
  const token = randomToken();
  const confirmUrl = `${APP_URL}/api/subscribe/confirm?token=${token}&email=${encodeURIComponent(email)}`;

  // Upsert: if email exists, re-issue the token; if not, insert a new row.
  // The unique constraint on `email` is what makes this idempotent.
  const { error: upsertError } = await admin
    .from('newsletter_subscriptions')
    .upsert(
      {
        email,
        confirmation_token: token,
        // Resubscribing after unsubscribe is allowed — clear the unsubscribed_at timestamp.
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    );

  if (upsertError) {
    console.error('[api/subscribe] upsert failed:', upsertError.message);
    return jsonResponse(500, { ok: false, error: 'Could not save subscription. Try again.' }, cors);
  }

  // Send confirmation email via Resend.
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('[api/subscribe] RESEND_API_KEY is not set');
    return jsonResponse(500, { ok: false, error: 'Email service is not configured.' }, cors);
  }

  const resend = new Resend(resendKey);
  try {
    await resend.emails.send({
      from: 'Parallax Lens <noreply@parallaxlens.com>',
      to: email,
      subject: 'Confirm your Parallax subscription',
      text: confirmationEmailText(confirmUrl),
      html: confirmationEmailHtml(confirmUrl),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[api/subscribe] resend send failed:', message);
    return jsonResponse(500, { ok: false, error: 'Could not send confirmation email.' }, cors);
  }

  return jsonResponse(200, { ok: true }, cors);
};

function confirmationEmailText(confirmUrl: string): string {
  return `Confirm your Parallax subscription

We received a request to subscribe this email to the Parallax newsletter.

Confirm by opening this link:

${confirmUrl}

If you didn't request this, ignore this email and we won't send anything.

— Parallax Lens
parallaxlens.com
`;
}

function confirmationEmailHtml(confirmUrl: string): string {
  return `<!doctype html>
<html><body style="font-family: Georgia, 'Times New Roman', serif; max-width: 540px; margin: 32px auto; padding: 0 16px; color: #15130f; background: #faf7f0; line-height: 1.6;">
  <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7a6d5e; margin: 0 0 20px; padding-bottom: 14px; border-bottom: 2px solid #15130f;">PARALLAX · CONFIRMATION</p>
  <h1 style="font-family: Georgia, serif; font-weight: 500; font-size: 26px; line-height: 1.2; margin: 0 0 18px;">Confirm your <em style="color: #b8341f; font-weight: 400;">subscription</em>.</h1>
  <p style="margin: 0 0 16px;">We received a request to subscribe this email to the Parallax newsletter.</p>
  <p style="margin: 24px 0;">
    <a href="${confirmUrl}" style="display: inline-block; padding: 14px 22px; background: #15130f; color: #faf7f0; text-decoration: none; font-family: 'Helvetica Neue', sans-serif; font-weight: 500; font-size: 14px;">Confirm subscription</a>
  </p>
  <p style="margin: 16px 0; font-size: 13px; color: #7a6d5e;">Or paste this link into your browser: <br/><a href="${confirmUrl}" style="color: #7a6d5e; word-break: break-all;">${confirmUrl}</a></p>
  <p style="font-size: 13px; color: #7a6d5e; margin-top: 28px;">If you didn't request this, ignore this email and we won't send anything else.</p>
  <p style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.16em; color: #7a6d5e; margin-top: 32px;">© 2026 PARALLAX LENS™ &middot; parallaxlens.com</p>
</body></html>`;
}
