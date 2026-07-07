# Journey spec — the complete reader UX

> The end-to-end reader journey: every surface, every state, every string.
> Companion: `APP-DESIGN-SPEC.md` (how app surfaces look), `CANON.md` (global
> rules). Implementers use the copy deck VERBATIM — copy is design here; do not
> paraphrase. Owner phases: P3 (login flagship, Fable), P6 (breadth, Opus),
> P4 gate/funnel touches noted inline.
>
> ⚠️ **Name collision:** the publication has `/welcome` (the cinematic "Second
> Angle" story, `src/pages/welcome.astro`) and the app gains `/welcome` (the
> post-signup onboarding, `app/src/pages/welcome.astro`). Different domains,
> different files, both fine — but agents: never confuse them.

## 1. The journey (12 breaks → 12 fixes)

| # | Break (verified 2026-07-05) | Fix | Where | Phase |
|---|---|---|---|---|
| 1 | No signup presence on home/masthead | `AccountEntry` in masthead: static "Sign in" link; island swaps to shelf glyph when authed | `core/Masthead.astro` + new `core/AccountEntry.astro` | P6 |
| 2 | No anonymous feature teaser | SaveButton signed-out label → "Save to your shelf" (redirect on click stays) | `core/SaveButton.astro` | P6 |
| 3 | Gate appears with no warning | (accepted — soft meter is the design; no change) | — | — |
| 4 | Gate lists no benefits | 3 benefit rows inside the gate card (copy §3) | `core/ReadingGate.astro` | P6 |
| 5 | Auth methods undifferentiated | Google = filled primary; magic link = secondary under "or use your email" | `app/login.astro` | P3 |
| 6 | No "link sent" state | Full form-swap `link-sent` state w/ inbox links + 60s resend cooldown | `app/login.astro` | P3 |
| 7 | No post-auth welcome | `welcomed_at` gate → app `/welcome` (name + worlds + features) | `app/auth/callback.ts` + `app/welcome.astro` | P6 |
| 8 | Dashboard empty-state dead end | The Shelf rebuild w/ designed empty states (every empty = a door) | `app/dashboard/index.astro` | P6 |
| 9 | Features work silently | First-save microline; WelcomeBack toast; prefs saved-tick | SaveButton, `core/WelcomeBack.astro`, dashboard | P6 |
| 10 | Annotation void | "In the margins" dashboard module w/ status chips (existing RLS suffices) | dashboard | P6 |
| 11 | Newsletter confirm dead end | `NewsletterNotice` ribbon on `/?newsletter=confirmed` + shelf cross-sell | `core/NewsletterNotice.astro` | P6 |
| 12 | join/me drafts unwired | NewsletterForm → `/api/join`; `/api/me` deployed as AccountEntry confirmer | NewsletterForm + operator deploy | P6 |

Funnel spine: **read → gate (benefits) → login (world-tinted, `?next=&world=`) →
callback → welcome (first time only) → back to the issue (`?welcome=1` toast at
the saved scroll position) → shelf grows.**

## 2. State machines

### Login (`app/login.astro`)
```
idle ── click Google ──► google-redirecting (btn spinner-in-place, all else disabled)
  │                        └─► (leaves page; on return w/ ?notice= → error)
  ├─ submit email ──► magic-sending (btn "Sending…", disabled)
  │                     ├─ ok ──► link-sent   (FULL plate swap, see copy)
  │                     └─ err ─► error       (inline notice, form re-enabled)
  └─ load w/ ?notice=<msg> ──► error shown in notice slot
link-sent: [resend] disabled 60s w/ visible countdown → re-enters magic-sending
           [use a different email] → idle (email field focused, value kept)
Already-authed on load → redirect /dashboard (existing behavior, keep).
world param: validate against {politics,space,earth,tech,travel,sports};
set data-world on the plate; invalid/missing → no attribute (default rust).
```

### Save (SaveButton)
```
signedout ── click ──► redirect app/login?next=<here>&world=<topic>
saved-first-time ──► microline "On your shelf →" (link: app dashboard) fades 4s
saved ⇄ unsaved (existing API calls; silent failures stay silent — reading first)
```

### Gate (ReadingGate) — logic UNCHANGED (cookie heuristic, free=2, no-JS
renders full article). Additions only: benefit rows markup inside the hidden
card; CTA gains `&world=`; CTA click stores `{slug, scrollY}` in
sessionStorage (`px_resume`) before navigation.

## 3. Copy deck (verbatim)

### ReadingGate card
- Eyebrow: `Keep reading — free`
- Title: `Create a free account to finish this issue.`
- Benefit rows (glyph + line, mono glyphs are bespoke inline SVG):
  1. `Save any issue to your shelf — pick up where you left off.`
  2. `Annotate the margins — the editors read every note.`
  3. `Six worlds, one account. No ads, ever.`
- CTA: `Create your free account →` · Alt: `Already a member? Sign in`
- Fine print (keep): `Free forever · we never sell your data`

### Login
- Eyebrow: `Sign in` · H1: `Open your *shelf*.`
- Dek: `One sign-in to save issues, follow the worlds you care about, and pick up reading where you left off.`
- World line (when `world` present): `RETURNING YOU TO THE <WORLD> DESK →` (mono, tinted)
- Google btn: `Continue with Google` · divider: `or use your email`
- Email label: `Your email` · submit: `Send me a sign-in link`
- Micro-assurance under submit: `No password. The link signs you in instantly.`
- **link-sent state:** H2 `Check your inbox.` · body: `We sent a sign-in link to
  <email>. It signs you in instantly and expires in 60 minutes.` · links:
  `Open Gmail` `Open Outlook` · reset: `Wrong address? Use a different email` ·
  resend: `Resend link` (`Resend in 42s` while cooling)
- Errors: expired/used link → `That link has expired — they only live for an
  hour. Send yourself a fresh one below.` · generic → `Something broke on our
  side. Try again in a moment.`

### App /welcome (first sign-in)
- H1: `You're in.`
- Sub: `Your shelf is open. Two quick questions — both optional.`
- Name label: `What should we call you?` (skip link: `Skip for now`)
- Worlds label: `Which worlds pull you in?` · sub: `We'll put these first on your shelf.`
- Feature strip (mono labels): `THE SHELF — save any issue` · `THE MARGINS —
  annotate; editors read every note` · `THE DISPATCH — one email per issue, no more`
- CTA (issue next): `Back to the issue →` · (else): `Open my shelf`

### WelcomeBack toast (publication, post-auth return)
`You're in — the full issue is open.` + link `Continue where you left off ↓`

### Dashboard ("The Shelf")
- Greeting: `Good <morning|afternoon|evening>, <name>.` (no name → `Welcome back.`)
- Meta line: `READER SINCE <MON YYYY> · <N> SAVED · <N>-DAY STREAK`
- Shelf empty state: `Nothing saved yet.` + `Browse the desks →`
- Margins empty state: `No notes yet. Select any passage in an issue to leave one.`
- Margins status chips: `IN REVIEW` / `PUBLISHED` / `NOT PUBLISHED`
- Prefs saved tick: `Saved.` (mono, fades 2s)
- Danger zone: keep existing copy.

### NewsletterForm (repointed to /api/join)
- Title: `One email. Two things.`
- Dek: `The dispatch when each issue ships — and a free shelf that saves your
  place. One click in your inbox does both.`
- Success: `Check your inbox — one tap subscribes you and opens your shelf.`
- Degraded (`account:false`): `You're subscribed. The sign-in link couldn't be
  sent — you can open your shelf any time from the masthead.`

### NewsletterNotice (home ribbon)
`You're on the dispatch.` + `One more click: your free shelf →`

### Join email (restyled, Resend)
- Subject: `Your Parallax shelf is one tap away`
- Body H1: `Open your shelf.` · button: `Sign in & open my shelf` · footnote:
  `The link expires in 60 minutes. If you didn't request this, ignore it —
  nothing happens without the click.`

## 4. Celebration doctrine

Celebrations are **quiet and useful** — a Parallax celebration is information
arriving at the right moment, never confetti:
- `lensSettle` brand moment: login + welcome only (once per surface).
- First-save microline, prefs saved-tick, WelcomeBack toast: each ≤ one line,
  auto-dismissing, never blocking content, all reduced-motion safe.
- NO badges, streak-guilt, popups, or unprompted emails. Streaks are stated
  on the dashboard, never nagged.

## 5. Data & wiring (P6, operator-gated)

- Migration `app/supabase/migrations/20260705000000_journey_onboarding.sql`:
  `profiles.welcomed_at timestamptz NULL` + `profiles.stated_interests text[]
  NOT NULL DEFAULT '{}'`. Nothing else — progress/streaks/affinity/margins all
  derive from existing tables (reading_events, saved_issues, comments RLS).
- Issue-metadata bridge: static `src/pages/issues-manifest.json.ts`
  (slug/title/dek/topic/issueNumber/date/sectionCount, published only) +
  `app/src/lib/issues.ts` fetch with ~10min in-memory TTL + slug-only fallback.
- `/api/me` = confirmer, not gatekeeper: AccountEntry fires it after the cookie
  heuristic says authed (stale-session cleanup); the gate keeps pure heuristic.
- `?via=story` (story mode CTA) flows into the gate's login `next=` — signup
  attribution lands at the app layer with zero publication tracking.

## 6. Operator go-live checklist (verbatim into the deploy note)

1. Apply `20260705000000_journey_onboarding.sql`.
2. Confirm `RESEND_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` in app env.
3. Supabase Auth URL config: `${APP_URL}/auth/callback` + publication origins
   allowlisted (join's redirectTo targets a publication `next`).
4. Deploy app FIRST, then publication (funnel params degrade gracefully in
   either order, but this order avoids a window of world-param no-ops).
5. Smoke: join round-trip · gate → login (tint) → welcome → toast-at-position ·
   save/unsave + first-save line · prefs ticks · margins statuses · `/api/me`
   CORS from parallaxlens.com.
