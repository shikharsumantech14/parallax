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
   (`docs/design/LENS.md` §1.1, carried from CANON §12).
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

## The two Lens islands (2026-09-30, `docs/design/LENS.md` §5.6)

Lens adds exactly two islands. Both are **small** (about 2 KB each), both are
**`is:inline`-free ES modules** (a bundled module `<script>`, so Vite
processes them, the `Viz3DRuntime` pattern, not the `is:inline` pattern the
reader islands use), both are **loaded once per page**, and neither ships a
library:

- **`src/scripts/cues.ts`** (Lens Phase 3, LANDED 2026-09-30) — loaded by
  `src/pages/issues/[slug].astro` only. **Measured 2,030 bytes minified,
  1,026 gzipped** (`npx esbuild src/scripts/cues.ts --bundle --minify
  --format=esm`); keep it under 2 KB minified. Three jobs:
  1. *Lighting.* A cue button pressed, or crossing the middle third of the
     screen, sets `data-lit="true"` on the anchors its cue names and
     `"false"` on the rest of that figure (the CSS: 1 / .35, a 2px desk-mark
     ring, 160ms), and `data-lit-n` on the section (the CSS tints the
     sentence, presses the discs and shows the panel's line for that cue).
     Pressing it again, or Show all, clears it. Section 1 plays its cues once,
     1400ms apart, when its figure first comes into view.
  2. *Progress.* A band 40% down the screen picks the current section:
     `aria-current` on the rail's dot and the head card's entry, `--px-read`
     on the root for the card's bar, "k of N read".
  3. *The phone pin.* Below 1024px a figure pins at the top only when it fits
     40% of the screen at 0.75 scale or more (`zoom`); refitted on a width
     change, never on a height-only one (the address bar).
  No JS: every anchor at full strength, every numeral visible (they are
  server-rendered), the cue buttons inert, Show all not offered, each figure
  in flow above its article, the head card's links still jump. Reduced
  motion: no autoplay, no transitions.
- **`build.ts`** (Lens Phase 5) — the one build: an IntersectionObserver
  starts a component's build on entry, in its `data-build="1..n"` order;
  counters on requestAnimationFrame, draws by dashoffset, grows by scale,
  drops by opacity and 6px. **No component animates itself** once it lands.
  Reduced motion and no JS: the final state. Not built yet; Phase 5 decides
  whether `core/Reveal.astro` and `core/VizMotion.astro`'s count-up fold
  into it.

`core/ExpandModal.astro` (the ⤢ study view) and `src/styles/modal.css` were
DELETED in Phase 3 with the how-to-read panel and the plain line.

## The island set

- `core/Reveal.astro` — scroll-reveal, adds `.is-in` to `[data-reveal]`
- `core/VizMotion.astro` — count-up + cursor-warmth
- `core/ReadingToolbar.astro` — reading progress, Full⇄Skim, Save
- `core/Viz3DRuntime.astro` — lazy-boots the WebGL runtime on `[data-viz3d]`
- `core/Tilt.astro` — CSS-3D pointer-tilt + flip
- `src/scripts/cues.ts` — the reading system (above), issue pages only
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

**None at present.** The one exception was the onboarding surface ("The
Second Angle": `/welcome`, the home first-visit overlay, `intro.css`), which
the operator removed on 2026-09-30; the new design will bring its own intro.
Whatever replaces it earns an exception here on its own terms and still
honours the fallback contract.

> **`/welcome` was the intro story, and nothing else.** Before the merge two
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
