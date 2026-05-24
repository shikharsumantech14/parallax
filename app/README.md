# Parallax — app subdomain

The reader account layer for [Parallax Lens](https://parallaxlens.com).

Deployed at `app.parallaxlens.com`. Hosts auth, the "Your Parallax"
dashboard, and `/api/*` endpoints called by the publication's client
islands. The publication itself remains pure-static at the repo root.

## Setup

```bash
cd app
npm install
cp .env.example .env.local
# fill in Supabase + Resend values
npm run dev               # http://localhost:4322
```

See `AGENTS.md` for full conventions and `../docs/COMMERCIALISATION-SETUP.md`
for the operator's account-setup checklist.

## Phase A status

Scaffold only — placeholder landing + health check + Supabase client
factories + Phase A schema migration. UI and full API land once the
operator finishes the setup checklist.
