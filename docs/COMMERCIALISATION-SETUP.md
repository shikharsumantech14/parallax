# Commercialisation — operator setup checklist

> Companion to the approved plan at
> `C:\Users\user\.claude\plans\resetting-the-todo-list-nested-shannon.md`.
> This file lists the **steps only you can do** (account creation, DNS,
> domain verification) before / in parallel with Phase A development.
> Check items off as you complete them.

---

## Stage 0 — Accounts to create (~45 min total)

### [ ] Supabase project

1. Sign up / log in at [supabase.com](https://supabase.com).
2. Create a new project named **`parallax-prod`**.
3. Choose region: **Mumbai (ap-south-1)** if your audience skews India,
   otherwise the region closest to your bulk readership.
4. Set a strong DB password — save it to your password manager.
5. From the project's **Settings → API**, copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **`anon` public key**
   - **`service_role` secret key** (treat like a root password)
6. From **Settings → Auth → Providers**:
   - Enable **Email** (magic link only — leave password disabled).
   - Enable **Google** — requires a Google Cloud OAuth client, see
     below.

### [ ] Google OAuth client (for Supabase Google login)

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create OAuth 2.0 Client ID, type **Web application**.
3. **Authorized JavaScript origins:**
   - `http://localhost:4321` (publication dev)
   - `http://localhost:4322` (app dev — see Stage 2)
   - `https://parallaxlens.com`
   - `https://app.parallaxlens.com`
4. **Authorized redirect URIs:**
   - `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
   - (Supabase shows you this exact URL on the provider page — copy it)
5. Save the **Client ID** and **Client secret** into Supabase's Google
   provider settings.

### [ ] Resend account + domain verification

1. Sign up at [resend.com](https://resend.com).
2. **Add domain:** `parallaxlens.com` (transactional from
   `noreply@parallaxlens.com`, marketing from `letters@parallaxlens.com`).
3. Resend gives you DNS records to add (DKIM + SPF + DMARC) — see
   Stage 1 below.
4. From **API Keys**, create a key named **`parallax-prod`** with full
   sending access. Copy it.

### [ ] Iubenda (privacy policy + terms)

1. Sign up at [iubenda.com](https://www.iubenda.com).
2. Generate a privacy policy for `parallaxlens.com`:
   - Services to include: Supabase (auth + database), Resend (email),
     Vercel (hosting), Anthropic API (AI Q&A).
   - User rights: GDPR + India PDPDP both selected.
3. Generate a terms-and-conditions doc — basic template is fine for v1.
4. Copy the **embed snippets** for both. You'll paste them into
   `/about/privacy` and `/about/terms` pages on the publication.

---

## Stage 1 — DNS records (~15 min)

You're on Cloudflare (verified from your existing setup).

### [ ] `app.parallaxlens.com` subdomain

Add an **A record** or **CNAME** pointing to Vercel:
- Type: `CNAME`
- Name: `app`
- Target: `cname.vercel-dns.com`
- Proxy status: **DNS only** (grey cloud — Vercel handles SSL via
  Let's Encrypt; Cloudflare proxy would interfere)

Verify resolution after ~5 minutes:
```bash
dig app.parallaxlens.com CNAME +short
```
Expected: `cname.vercel-dns.com`.

### [ ] Resend domain verification records

Resend gave you 3-4 DNS records when you added `parallaxlens.com`. Add
each one to Cloudflare:
- 1× SPF (`TXT @` — usually `v=spf1 include:resend.com ~all`)
- 1× DKIM (`TXT resend._domainkey.<...>`)
- 1× DMARC (`TXT _dmarc` — start permissive: `v=DMARC1; p=none;`)
- 1× Return-path / bounce-handling CNAME (Resend provides)

Verify in Resend dashboard — green checkmarks against all four.

---

## Stage 2 — Local environment (~10 min)

After accounts exist, add the keys to `.env.local`:

```bash
# Existing
ANTHROPIC_API_KEY=sk-ant-api03-...

# New for Phase A
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # SERVER ONLY, never client
RESEND_API_KEY=re_...
PUBLIC_APP_URL=https://app.parallaxlens.com
PUBLIC_SITE_URL=https://parallaxlens.com
```

For local dev, override the last two:
```bash
PUBLIC_APP_URL=http://localhost:4322
PUBLIC_SITE_URL=http://localhost:4321
```

`.env.local` is gitignored — never commit it.

---

## Stage 3 — Vercel project (~10 min)

The publication is already on Vercel. Add the app subdomain as a **second
Vercel project**:

1. **Import** the same Git repo into a new Vercel project.
2. **Root directory:** `app/` (the new subdirectory the scaffolding step
   creates).
3. **Framework preset:** Astro.
4. **Environment variables:** paste the same `.env.local` contents into
   Vercel's UI (production + preview both).
5. **Domain:** add `app.parallaxlens.com`.

Verify:
- `parallaxlens.com` → publication (existing Vercel project, unchanged)
- `app.parallaxlens.com` → app (new Vercel project)

---

## Stage 4 — When you've finished Stages 0-3

Tell me, and we proceed to Phase A coding:
- Apply the schema migrations (I'll have written them at
  `app/supabase/migrations/`)
- Wire up the magic-link + Google login flow
- Build the newsletter signup form
- Build the minimal dashboard

You can do Stage 0-3 in parallel with my scaffolding work — neither
blocks the other.

---

## Things you do NOT need to do

- Domain transfer (parallaxlens.com stays where it is)
- SSL certificates (Vercel handles both subdomains automatically)
- Database backups (Supabase Pro includes daily backups + PITR)
- Email warmup (Resend handles reputation for low-volume domains)
- Account deletion endpoint (I'll build this; PDPDP/GDPR requirement)

---

## Estimated cost commitment

This setup unlocks **~$45/mo of recurring services** at 0 readers:
- Supabase Pro: $25/mo (only needed once `reading_events` ramps up;
  free tier works for the first month or two)
- Resend: $20/mo (free tier covers first 3k sends/month)
- Iubenda: ~$8-30/mo depending on plan

You can defer Supabase Pro and Resend paid until ~Phase B or actual
traffic. Iubenda is the only thing worth paying for from day one (legal
exposure).

So **realistic first-month cost: ~$10** (Iubenda only). Phase A
development burns no marginal $$ — Anthropic stays on the existing
pipeline credits.
