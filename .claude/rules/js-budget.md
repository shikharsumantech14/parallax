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

- **no JS** — the static HTML is the final state. A build's start state is
  applied by `build.ts`, never in the markup; controls that JS unhides stay
  gated behind the `html.js` class the inline `<head>` guard sets
- **`prefers-reduced-motion`** — no build runs (the island applies no start
  state, so counters show the value already in the HTML); ambient motion
  freezes to a composed still
- **missing WebGL** — the mount degrades, it does not blank

Any new interactivity must honour this and be justified.

## The two Lens islands (2026-09-30, `docs/design/LENS.md` §5.6)

Lens adds exactly two islands. Both are **small** (2 to 3 KB each), both are
**`is:inline`-free ES modules** (a bundled module `<script>`, so Vite
processes them, the `Viz3DRuntime` pattern, not the `is:inline` pattern the
reader islands use), both are **loaded once per page**, and neither ships a
library:

- **`src/scripts/cues.ts`** (Lens Phase 3, LANDED 2026-09-30) — loaded by
  `src/pages/issues/[slug].astro` only. **Measured 2,148 bytes minified,
  1,074 gzipped** (`npx esbuild src/scripts/cues.ts --bundle --minify
  --format=esm`; 2,030 in Phase 3, +118 when Phase 5 made section 1 wait for
  its build); keep it near 2 KB. Three jobs:
  1. *Lighting.* A cue button pressed, or crossing the middle third of the
     screen, sets `data-lit="true"` on the anchors its cue names and
     `"false"` on the rest of that figure (the CSS: 1 / .35, a 2px desk-mark
     ring, 160ms), and `data-lit-n` on the section (the CSS tints the
     sentence, presses the discs and shows the panel's line for that cue).
     Pressing it again, or Show all, clears it. Section 1 plays its cues once,
     1400ms apart, when its figure first comes into view and has finished
     building (`px:built` from `build.ts`; at once if nothing builds).
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
- **`src/scripts/build.ts`** (Lens Phase 5, LANDED 2026-09-30) — loaded
  once by every layout (`HomeLayout`, `IssueLayout`, `StoryLayout`,
  `AppLayout`) as `<script>import '../scripts/build';</script>`. **Measured
  2,983 bytes minified, about 1.4 KB gzipped** (the same esbuild line); the
  ceiling is **3 KB minified**, so a new feature pays for itself. The one
  build: a scene (`data-build-scene`) starts when 35% of it is in view, its
  `data-build="n"` steps run in order, each at 70% of the last, siblings 80ms
  apart; counters on requestAnimationFrame (ease-out cubic, 1400ms), draws by
  `stroke-dashoffset` (1400ms), grows by `scale` (900ms), drop / rise / fade
  by opacity and `translate` (420ms), all through the `.bx-*` classes in
  `src/styles/motion-v2.css`. `[data-build-replay]` (shipped `hidden`)
  replays a scene; a `px:build` event on a scene replays it; `px:build-finish`
  on the document (the render gate) and `beforeprint` finish every scene;
  each scene fires `px:built` when it ends. **No component animates itself.**
  The contract for authors is `docs/design/LENS.md` §6.4 and
  `src/components/AGENTS.md` §11. It replaced `core/Reveal.astro` (the
  `[data-reveal]` / `.is-in` scroll reveal) and `core/VizMotion.astro` (the
  `[data-countup]` count-up and the unused `[data-warmth]` pointer glow),
  both DELETED in Phase 5 along with every component's `html.js …:not(.is-in)`
  hidden state. Section 1 of an issue, the Home stage and the intro overlay
  use this one island; `cues.ts` stays separate.

`core/ExpandModal.astro` (the ⤢ study view) and `src/styles/modal.css` were
DELETED in Phase 3 with the how-to-read panel and the plain line, and Phase 8
(2026-10-04) deleted the data that fed those two (`src/lib/explainers.ts`)
and the CSS that styled them. None of it ran any script; the island set below
is unchanged by it.

## The island set

- `src/scripts/build.ts` — the build (above), every layout
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

**The first-visit intro, `core/IntroOverlay.astro`** (Lens Phase 4,
2026-09-30, rebuilt on 2026-10-04 as the five-scene walkthrough of the
canvas `Intro`, `Intro-Phone` and `Intro-Entry` boards). It replaced "The
Second Angle" (`/welcome`, its overlay and `intro.css`, removed 2026-09-30).
It is the one page-level overlay on a lean page, mounted on Home only, and
it earns its script on these terms:

- **One `is:inline` script, at most 3 KB minified**: **2,390 bytes
  minified, 1,033 gzipped** (`npx esbuild <the script> --minify`, the
  measure `build.ts` uses; 3,223 bytes as written, which is what ships,
  because Astro does not minify an is:inline script). It is the show-once
  (`localStorage` `px_intro_v3`, set when it opens; `?intro=1` reopens,
  `?intro=0` suppresses), `showModal()` and the close, the 5-dot stepper,
  Back / Next, the arrow keys, Escape (the dialog's `cancel`), Pause, and
  scene 2's two cue lightings. No motion of its own: showing a scene
  dispatches `px:build` on it and `build.ts` builds it; the entrance, the
  exit and the clock are CSS. **The clock is a CSS animation**: the current
  stepper pill fills over the scene's hold and its `animationend` steps on,
  so hover (fine pointers), keyboard focus on a control and Pause stop it
  with `animation-play-state` and no timer arithmetic. Holds: 8, 11, 9 and
  9.5s, then scene 5 waits for a choice (about 39s untouched).
- **The fallback contract:** a native `<dialog>`, closed in the HTML, so no
  JS means no overlay (a dialog nobody can dismiss is worse than none), and
  its markup is every scene's final state. Reduced motion: it opens at once
  with every scene final, no clock, no cue autoplay; Back, Next and the dots
  still step. Print: nothing.
- Skip is always visible, the page behind is inert (`showModal`) and does
  not scroll while it is open, and focus returns to where it was.

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
