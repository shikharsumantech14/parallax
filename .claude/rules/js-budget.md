---
paths:
  - "src/components/**"
  - "src/layouts/**"
  - "src/pages/**"
  - "src/scripts/**"
---

# The JS budget and the fallback contract

**Policy (2026-07-05, operator-approved): rich on issues, lean everywhere
else.** This supersedes the older "minimal JS everywhere" line.

- **Issue pages (`/issues/*`) and story mode (`/s/*`)** carry a generous
  interactive budget — 3D scenes, scroll-driven states, hover inspection.
- **Home, topic indexes, about** stay near-zero-JS: the small vanilla
  `is:inline` island set and nothing framework-shaped.

Three absolutes on the generous budget:

1. **Every interactive byte serves comprehension, not decoration**
   (`docs/design/CANON.md` §12).
2. **Everything is lazy-loaded and code-split** — the `viz3d` pattern: nothing
   heavy loads until its mount scrolls in, and never on pages that don't use it.
3. **The fallback contract is untouchable** (below).

No framework, no client bundle — ever.

## The fallback contract

Every component paints its **final composed state** under:

- **no JS** — hidden states are gated behind an `html.js` class set by an
  inline `<head>` guard
- **`prefers-reduced-motion`** — count-ups tween to the value already in the
  HTML; ambient motion freezes to a composed still
- **missing WebGL** — the mount degrades, it does not blank

Any new interactivity must honour this and be justified.

## The island set

- `core/Reveal.astro` — scroll-reveal, adds `.is-in` to `[data-reveal]`
- `core/VizMotion.astro` — count-up + cursor-warmth
- `core/ReadingToolbar.astro` — reading progress, Full⇄Skim, Save
- `core/Viz3DRuntime.astro` — lazy-boots the WebGL runtime on `[data-viz3d]`
- `core/Tilt.astro` — CSS-3D pointer-tilt + flip
- `core/ExpandModal.astro` — ⤢ portals a viz card into a modal study view
- `core/ReadingGate.astro` — the metered soft signup wall
- Phase-B reader islands — Save, Reactions, ReadingTracker,
  Letters, NewsletterForm (AnnotationLayer — margin notes — was removed with
  the launch design on 2026-09-08; its API route and moderation queue stay for
  letters)
- Funnel islands — `AccountEntry` (masthead slot; `/api/me` confirms, never
  gatekeeps), `WelcomeBack` (`?welcome=1` toast offering the `px_resume`
  scroll position), `NewsletterNotice` (`?newsletter=confirmed` ribbon)

AccountEntry degrades to a static sign-in link; the other two occupy no space
and reveal nothing without JS — a post-action confirmation is a nicety, never
content.

## The service worker

`public/sw.js` (PWA, 2026-09-06) is the one piece of JavaScript that is not an
island and does not run in the page. It is hand-written and deliberately small:
no Workbox, no build step, no generated precache manifest.

- **Cache-on-read.** Precache is exactly `['/', '/offline/']`; everything else
  is kept because a reader opened it. Nothing is hoarded.
- **It never touches a session.** `APP_ROUTES` mirrors `src/middleware.ts`, and
  `storable()` independently refuses any response carrying `no-store`. A cached
  Shelf served to a second reader is a data leak, not a stale page.
- **It changes nothing about the fallback contract.** No JS ⇒ no worker ⇒ the
  site behaves exactly as it always did. The worker is additive by
  construction, which is why it needs no no-JS story of its own.
- **The reading gate is unaffected** — it runs client-side on every load, and
  the full article is in the page source either way, so cached HTML is gated
  exactly like fresh HTML.
- **Registration is production-only** (`import.meta.env.PROD` in
  `core/PwaMeta.astro`). Under `astro dev` the worker cached Astro's dev-toolbar
  and Vite dep-optimiser modules from `/node_modules/`, and a caching layer
  under HMR turns every stale-asset question into "is it the worker?". Exercise
  it with `npm run preview`, which serves a real build.
- **Google Fonts are the one cross-origin exception**, re-requested with
  `mode: 'cors'` so the response can be validated before storing — an opaque
  404 is indistinguishable from an opaque 200, and caching one would break a
  face until the version is bumped.

`/offline` is its navigation fallback and is **self-contained on purpose**: no
stylesheet, no webfont, no script, and the mark comes from `markSVG` with
literal colours rather than `core/Mark.astro`, whose `var(--ink)` fills resolve
to nothing there. It first shipped rendering a solid black disc for exactly
that reason.

## The one exception

**The onboarding surface** — `/welcome` plus the home first-visit overlay
("The Second Angle"). A deliberately cinematic, distinct-identity marketing
surface with its own `intro.css` palette that never touches article styles, so
it carries more JS: the `intro/IntroStory.astro` 5-scene player and
`intro/IntroExperience.astro` (gated by `localStorage px_intro_seen_v1`;
`?intro=1` replays). **It still honours the fallback contract** — no-JS stacks
the scenes and shows nothing for the overlay; reduced-motion drops auto-advance.

> **`/welcome` is the intro story, and nothing else.** Before the merge two
> projects each owned a `/welcome`: this one, and the app's post-signup
> plate. One namespace has room for one, so the plate moved to
> `src/pages/account/welcome.astro` — served at **`/account/welcome`**.
>
> `auth/callback.ts` was not repointed with it, so every first-time reader
> landed on the cinematic intro instead of name-and-worlds setup, and the
> plate sat orphaned with zero inbound links. Caught by walking the signup
> flow on 2026-09-06, not by any gate — a redirect to a route that exists
> and returns 200 is invisible to every check this repo has.

## The metered gate

`core/ReadingGate.astro` shows anonymous readers the primer + first 2 sections,
then a per-topic wall. Auth is detected **client-side** via the shared,
client-readable `sb-<ref>-auth-token` cookie.

**Soft by design.** The publication is static, so teaser content is in the page
source. Chosen over a hard server gate to keep teasers shareable and
Google-indexable: no-JS and crawlers see the full article, which is SEO-safe.
Any issue-page rebuild must either preserve `.px-section` counting or rework
`ReadingGate` in the same commit, and the free allowance must always include
**at least one graphic**.
