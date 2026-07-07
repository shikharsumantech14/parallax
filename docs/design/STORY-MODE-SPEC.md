# Story mode spec — /s/<slug>/ ("the short version")

> The InShorts-class shareable story format: one issue → a full-screen,
> vertically-snapping card story (hook → ≤6 beats → CTA), 100% free (locked
> decision 2026-07-05 — the story IS the marketing surface; the CTA card
> funnels to the gated full issue). STATUS: **P0 skeleton** — the anatomy,
> type scale, and snap spec below are law; the per-kind trim table and the
> flagship worked example land in P4 (marked TODO).
>
> Prefix: `pxs-`. Files: `src/pages/s/[slug].astro` · `src/layouts/
> StoryLayout.astro` · `src/components/story/*` · `src/lib/story.ts` ·
> `src/styles/story.css`. Cards render LIVE section components (via
> `SectionBody.astro`), never PNGs — theming, crispness, accessibility, and
> the WebGL lazy contract all come free.

## 1. Card grammar

```
[ hook ]  eyebrow (world · issue №) → title (Fraunces, clamp 34→56px)
          → the frontmatter hook line → swipe affordance (chevron, animated)
[ beat ×3–6 ]  beat text (2–3 lines, top) → fitted live component (center)
               → kicker (mono, one line, bottom)
[ cta ]   "That's the short version." → issue stats line → button to
          /issues/<slug>/?via=story → share → soft account line
```

- Beat selection priority: world-signature interactive > `data-readout` >
  `timeline` > `paradox`/`comparison` > `quote`; `prose` only with a
  `skimCaption` (max one, rendered as a pure-text card).
- Beat text source chain: authored `story.beats[].text` (social voice, 40–320
  chars) → `skimCaption` → `intro` → `title`. Every published issue gets a
  working story with zero authoring.
- Optional frontmatter (additive): `story: { hook?, beats?: [{section: idx,
  text, kicker?}] (3–6), cta? }`.

## 2. Card anatomy (the dvh budget)

```
.pxs-card grid rows:  [safe-top pad] · beat text ≤26dvh · viz ≤62dvh (own
                      scroller if taller) · kicker ≤8dvh · [safe-bottom pad]
padding: max(20px, env(safe-area-inset-top)) 20px max(72px, env(safe-area-inset-bottom))
```

Type scale (mobile-first; desktop = same, cards capped 520px wide, centered on
the themed field with a soft `--accent` radial glow @ ≤0.08 — NO phone bezel):

| Role | Spec |
|---|---|
| hook title | Fraunces `clamp(34px, 9vw, 56px)` / 1.05, one italic accent word max |
| beat text | Schibsted Grotesk 17px / 1.55 |
| kicker | JetBrains Mono 11px / +0.18em uppercase, `--accent-deep` (light) / `--accent` (dark worlds) |
| eyebrow / progress meta | mono 10px uppercase |
| CTA button | ink-filled, 16px, square corners (publication button rule) |

## 3. Snap spec (+ the iOS gotcha list)

```css
.pxs-shell { height: 100vh; height: 100dvh; overflow-y: auto;
  scroll-snap-type: y mandatory; overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch; }
.pxs-card  { min-height: 100vh; min-height: 100dvh;
  scroll-snap-align: start; scroll-snap-stop: always;
  display: grid; align-content: center; }
@media (max-height: 560px) { .pxs-shell { scroll-snap-type: y proximity; } }
@media (prefers-reduced-motion: reduce) { .pxs-shell { scroll-snap-type: y proximity; } }
```

- `mandatory` is safe ONLY because the trim layer guarantees cards fit
  375×667; the two escape hatches: the ≤560px `proximity` query and per-card
  `.pxs-card__viz { overflow-y: auto; max-height: 62dvh }` internal scroller.
- Navigation: visible 44×44 chevron buttons (bottom-right), `scrollIntoView`
  (`smooth`, `auto` under reduced-motion); IG-style segmented progress bar
  (mobile top) / dot rail (desktop right), `aria-hidden`; native keyboard
  scrolling + arrow-key exact-card handler; cards `id="c1"…` (deep-linkable).
- **No-JS:** cards are ordinary stacked DOM in source order; snap is pure CSS;
  progress/chevrons/share are `hidden` until the island unhides them. Nothing
  is ever content-hidden.
- iOS device checklist (P4/P7, real device via Vercel preview): rubber-band vs
  `overscroll-behavior` · URL-bar collapse vs `dvh` · `snap-stop: always`
  flick behavior · nested scroller inside mandatory snap · safe-area padding ·
  Settings→Reduce Motion. Pre-approved fallback if flaky: ship `proximity`
  globally.

## 4. Fitting rule: trim DATA, never hide with CSS

`fitSectionForStory(section)` returns a trimmed clone per kind — content
decisions, not overflow surgery. TODO(P4): the full per-kind trim table with
fits-375×667 checkboxes. Seed rules:

| Kind | Trim |
|---|---|
| timeline | ≤6 events (keep `state: key/fail/now` first), drop `note`s |
| data-readout | ≤4 tiles, emphasis-first |
| comparison | ≤4 rows |
| beat-sheet | ≤4 beats |
| league-table | top 5 + story team |
| quote | as-is (it's born card-shaped) |

## 5. Route & head

- `getStaticPaths` over `issues`, `status !== 'draft'` (review-stage stories
  visible on branch previews; drafts unbuilt).
- `noindex` meta; excluded from sitemap/RSS; NO canonical link (canonical +
  noindex is contradictory signaling); `og:url` = the story URL.
- OG (P7): `public/og/story/<slug>.png` 1200×630 via the social `heroCard`
  archetype + `og:image` tags. `twitter:card: summary_large_image`.
- StoryLayout: theme CSS + `html.js` guard + `viewport-fit=cover` +
  Reveal/VizMotion/Viz3DRuntime. NO masthead/toolbar/gate/Tilt/ExpandModal.
- Attribution without trackers: the shared link stays clean `/s/<slug>/`
  (Vercel path-level server logs count opens); the CTA carries `?via=story`
  into the issue → gate → login `next=` chain. No client analytics, ever.

## 6. Status (P4 shipped 2026-07-05; P7 completes the tail)

- [x] Skeleton + scroll UX shipped and verified: `src/pages/s/[slug].astro`,
      `StoryLayout`, `StoryShell` (snap + segmented progress + 44×44 chevrons
      + arrow keys), `StoryHookCard`/`StoryCard`/`StoryCtaCard`,
      `src/lib/story.ts`, `src/styles/story.css`. 10 story pages build (one
      per non-draft issue), zero authoring required.
- [x] **Flagship worked example** — the authored `story` block on
      `src/content/issues/2026-06-04-asteroid-2024-yr4/index.mdx`. Why these
      beats: §1 timeline (the 15-month arc IS the story's skeleton; trim
      drops notes + caps to the 6 marked events), §3 data-readout (the
      headline numbers, 4-tile cap), §4 trajectory-arc (the geometry
      argument), §5 paradox (the counterintuitive core — the share-worthy
      beat). Skipped: §0 prose (the hook card already carries the setup),
      §2 signal-readout (observation detail — depth, not tease). Beat voice:
      `_voice-social.md` register; every claim traces to the issue's own
      verified sections.
- [x] `story` frontmatter schema (config.ts, additive/optional, 3–6 beats).
- [ ] P7: trim-table breadth w/ per-kind 375×667 verification · OG images
      (`scripts/story/og.ts`) + head wiring · `StoryShare` · real-iPhone pass
      via Vercel branch preview · per-world hook-card motifs (design nicety,
      optional).
