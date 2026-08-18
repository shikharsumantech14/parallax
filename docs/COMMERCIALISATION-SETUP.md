# Commercialisation — operator setup checklist

> Companion to the approved plan at
> `C:\Users\user\.claude\plans\resetting-the-todo-list-nested-shannon.md`.
> This file lists the **steps only you can do** (account creation, DNS,
> domain verification) before / in parallel with Phase A development.
> Check items off as you complete them.
>
> **Stages 0–4 are the original Phase A setup** (done long ago — kept for
> reference). Later go-live stages are appended below as work lands.
> If you are here to ship the current batch, go straight to **Stage 5**.

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

## Stage 5 — Go-live for the journey batch (~20 min + smoke)

> Everything in this stage is code that is **written, build-green and
> uncommitted** in the repo as of **2026-07-14**. None of it has been
> runtime-tested: the dev machine has no Supabase env, so the app cannot
> run there at all (`assertEnv` 500s every request). These are the steps
> that turn it on — **do them in this order.**

### [ ] 1. Apply the onboarding migration

`app/supabase/migrations/20260705000000_journey_onboarding.sql` — paste
into the Supabase SQL editor and click Run (or `supabase db push` if the
CLI is linked).

It adds two columns to `profiles`:
- `welcomed_at timestamptz` — NULL until the reader finishes *or skips*
  the one-time onboarding page at `app.parallaxlens.com/welcome`
  (a different page from the publication's cinematic `/welcome` story —
  same word, different site)
- `stated_interests text[] NOT NULL DEFAULT '{}'` — the worlds they picked

It is idempotent (`ADD COLUMN IF NOT EXISTS`), so re-running is harmless,
and it needs **no new GRANT and no new RLS policy** — the existing
table-level grant on `profiles` and the `profiles_update_own` policy
already cover both columns.

**Verify:** the `profiles` table shows both new columns.

**If you skip this step:** sign-in still works (the callback gate is
written to fail open), but `/welcome` errors on the missing columns and
no reader is ever welcomed.

### [ ] 2. Check the Supabase redirect allowlist

The unified Join endpoint emails a magic link whose `redirectTo` is
`https://app.parallaxlens.com/auth/callback?next=<publication URL>`. In
Supabase → **Auth → URL Configuration**, confirm that
`https://app.parallaxlens.com/auth/callback` (or a wildcard covering it)
is in the allowed redirect URLs. If it isn't, the join email's link is
rejected and the whole funnel dead-ends.

One decision to make once while you're there: `/api/join` marks the
newsletter subscription **confirmed at join time** — single opt-in, on the
reasoning that the magic-link click already proves the address. If you
want strict double opt-in instead, say so; it's a small code change
(leave `confirmed_at` null in `join.ts` and confirm it in the callback).

### [ ] 3. Deploy the app project FIRST, the publication SECOND

This order is **not cosmetic**. The publication's newsletter form now
POSTs to `app.parallaxlens.com/api/join` instead of the old
`/api/subscribe`. Ship the publication first and every newsletter signup
in that window posts to an endpoint that isn't live yet.

The wrinkle: both Vercel projects auto-deploy from the same repo, so a
single `git push` starts both builds at once. To keep the order, split
the push:

1. Commit and push the **`app/`** changes on their own.
2. Wait for that deploy to go green; confirm
   `https://app.parallaxlens.com/api/health` responds.
3. *Then* commit and push the publication changes (root `src/`, `docs/`,
   `.claude/`, `public/`).

If you'd rather push everything in one go, that's survivable — the
exposure is just the minutes between the two builds finishing. The split
push is the tidy version.

### [ ] 4. Smoke list (~10 min, after both deploys)

Nothing below has been exercised against a running server — this list is
the first real test of the batch.

- [ ] **Join round-trip.** Submit the newsletter form on the publication
      home. Expect exactly one email. Clicking it should sign you in on
      the app and return you to the publication. (A degraded
      `{ok:true, account:false}` response — subscribed but no magic link
      sent — is handled by the form, so watch the inbox, not just the
      success copy.)
- [ ] **Gate → login → welcome → back to the issue.** In a private
      window, open an issue and scroll past the free sections until the
      signup wall appears. Its CTA carries `&world=<topic>`, so the login
      plate should be tinted with that world's accent. Sign in; you
      should land on the app's `/welcome`; press "Back to the issue →";
      the issue should reopen with a "Continue where you left off ↓"
      toast, which
      auto-dismisses after 8s but pauses while hovered or focused.
- [ ] **Welcome is once.** Sign out and back in — you should go straight
      to your destination, never to `/welcome` again. Test this with
      "Skip for now" too; skipping also counts as welcomed.
- [ ] **Save + first-save microline.** Signed in, hit Save in the reading
      toolbar. The label flips, a one-time "On your shelf →" microline
      flashes and fades after ~4s, and the issue shows up as a tile on
      the dashboard shelf. (Tiles currently title-case the slug — real
      issue titles are a known follow-up, not a bug.)
- [ ] **Newsletter-confirmed ribbon.** Visit
      `https://parallaxlens.com/?newsletter=confirmed` (where the confirm
      endpoint sends people). A "You're on the dispatch." ribbon should
      appear above the masthead, be dismissible, and the query param
      should disappear from the URL.
- [ ] **Admin story link.** With your address in `ADMIN_EMAILS`, open
      `app.parallaxlens.com/admin/social`. Each post card should show a
      "↗ story" link to `parallaxlens.com/s/<issue_id>/` and a "Copy story
      link" button, and using either must not affect approve/reject.
      Note: story pages only exist for issues that aren't `status: draft`.

Anything that fails here is a code fix, not a config one — send me the
symptom and I'll take it.

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
