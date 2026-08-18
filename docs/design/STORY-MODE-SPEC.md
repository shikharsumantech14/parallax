# Story mode spec — /s/<slug>/ ("the short version")

> The InShorts-class shareable story format: one issue → a full-screen,
> vertically-snapping card story (hook → ≤6 beats → CTA), 100% free (locked
> decision 2026-07-05 — the story IS the marketing surface; the CTA card
> funnels to the gated full issue). STATUS 2026-07-14: **shipped in-repo,
> uncommitted** — P0 skeleton, P4 flagship + share + OG, and the P7 breadth
> pass are all built (§6). The anatomy, type scale, and snap spec below remain
> law. Outstanding: the real-iPhone pass and per-world hook-card motifs.
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

Two P7 amendments to the budget (both detailed in §4b): the viz slot **hides
the section's own `__cap` / `__src` chrome** so the graphic gets the dvh rather
than a duplicated title and citation, and a **prose beat drops the viz slot
entirely** (`.pxs-card--text`) — the beat text becomes the whole card and is
released from the 26dvh clamp. Neither hides data.

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
decisions, not overflow surgery. The original TODO — a full per-kind trim table
with fits-375×667 checkboxes for all ~90 kinds — was **deliberately not**
completed; P7 instead trimmed the kinds that actually overflow and let the
62dvh scroller cover the tail (see the residual at the end of §4b). Seed rules:

| Kind | Trim |
|---|---|
| timeline | ≤6 events (keep `state: key/fail/now` first), drop `note`s |
| data-readout | ≤4 tiles, emphasis-first |
| comparison | ≤4 rows |
| beat-sheet | ≤4 beats |
| league-table | top 5 + story team |
| quote | as-is (it's born card-shaped) |
| city-grid | ≤2 cities (P7, 2026-07-14) |

`TRIM` in `src/lib/story.ts` is the live table; it now also caps
`launch-stats` (8 years), `benchmark-chart` (5 items), `margin-ladder` (6
rows), `bill-breakdown` (2 cards), `seat-chart` (4 rows + drop quote),
`itinerary-reel` (4 days), and drops `followup` on `quote` / `vote-result`.
WebGL kinds ship data untrimmed — their scenes and fallbacks self-scale.

**`city-grid` gotcha (worth reading before adding any cap).** `CityGrid.astro`
**hard-throws** unless `cities.length` is 1–3, so a cap of 4 — the first value
tried — was a guaranteed dead no-op: any issue that would have triggered it had
already failed the build. The shipped cap is 2 (two wind roses fit a 375 card).
Check a component's own input assertions before choosing a cap.

**KIND_PRIORITY breadth (P7, 2026-07-14).** All 22 P6 breadth kinds are now
ranked in `KIND_PRIORITY`. Before this they fell through to the default `30`,
which left them effectively unrankable — an issue built on the new components
could not surface them as beats. Rankings, slotted alongside their
world-signature siblings: `constellation-swarm` 90 · `court-value` +
`coalition-calculus` 86 · `plate-motion` + `storm-track` + `packet-trace` 84 ·
`lagrange-map` + `queue-cliff` 82 · `transfer-window` + `gerrymander-lens` +
`ballot-flow` 80 · `chip-die` 78 · `eclipse-cone` + `elo-river` 76 ·
`city-grid` + `season-wheel` 74 · `pace-ridge` 72 · `carbon-loop` 66 ·
`moore-ladder` + `atmosphere-column` 64 · `altitude-oxygen` + `fare-terrain` 62.
All 22 names were cross-checked 1:1 against `SECTION_KINDS`.

### 4b. Story-teaser compaction (CSS) — chrome only, never data

Two CSS rules in `src/styles/story.css` reclaim the dvh a beat card was losing
to duplicated framing. **This does not weaken the §4 rule.** "Trim DATA, never
hide with CSS" still governs data: nothing carrying a value is ever hidden. The
compaction hides *chrome* — the section's own title-caption and source
citation, which in a story card are redundant (the beat text supplies the
title; the CTA card links to the full issue, where the sources live):

```css
.pxs-beat__viz > * > [class$='__cap'],
.pxs-beat__viz > * > [class$='__src'] { display: none; }
.pxs-beat__viz > * { margin: 0; }
```

The `> * >` child selector is load-bearing: it reaches only direct children of
the section root, never a nested data label. An adversarial review confirmed no
graphic container in the catalog ends in `__cap` / `__src`. Worth 150–280px per
card (`trajectory-arc` went 2.32× → 1.41× overflow).

**Prose beats are pure-text cards** (spec §1, now enforced in code):
`StoryCard.astro` skips `<SectionBody>` when `kind === 'prose'` and adds
`.pxs-card--text` — editorial Fraunces at `clamp(21px, 5.4vw, 27px)`, no 26dvh
text clamp. Rendering the full prose section was a tall duplicate of the beat
text: 2.74× overflow became a 374px card that fits.

**Honest residual.** Text-heavy narrative kinds still overflow and still lean on
the spec-sanctioned 62dvh internal scroller: `comparison` ~3.8×, `paradox`
~2.3×, `timeline` ~1.5×. This is a *content* problem, not a code gap — the real
fix for a viz-poor issue is an authored `story:` frontmatter block where the
editor hand-picks viz beats (as on the asteroid flagship). A per-kind
compaction pass across all ~90 kinds was scoped out.

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

## 6. Status (P4 shipped 2026-07-05; P7 tail closed 2026-07-14 bar two items)

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
- [x] **OG images + head wiring** — `scripts/story/og.ts` runs as the npm
      `prebuild` hook, rendering one 1200×630 PNG per non-draft issue into
      `public/og/story/<slug>.png` via `ogCard` + `toPng(..., 'og')` from
      `scripts/social/cards.ts`. Regenerates on every build; 10 valid PNGs
      today (53–109KB). `og:image` + `twitter:card` tags live in
      `StoryLayout.astro`. (Built in P4; verified 2026-07-14, not rebuilt.)
- [x] **`StoryShare`** — `navigator.share` → clipboard fallback →
      `role="status"` confirmation. (Built in P4; verified 2026-07-14.)
- [x] **`?via=story` attribution** on `StoryCtaCard`. (P4; verified.)
- [x] **Trim-table breadth** (2026-07-14) — all 22 P6 kinds ranked in
      `KIND_PRIORITY`, `city-grid` trim added, story-teaser chrome compaction
      and prose pure-text cards landed. Verified at **375×667 in the browser**
      across the space / politics / earth stories: every card fits the
      viewport, zero horizontal page overflow, graphics survive compaction.
- [ ] **Real-iPhone pass via a Vercel branch preview** — NOT done. The iOS
      checklist in §3 (rubber-band, URL-bar `dvh` collapse, `snap-stop` flick,
      nested scroller in mandatory snap, safe-area, Reduce Motion) remains
      unexercised on real hardware; 375×667 was emulated only. Operator task.
- [ ] **Per-world hook-card motifs** — NOT done (design nicety, still optional).
- [ ] Per-kind compaction across the remaining ~90 kinds — explicitly scoped
      OUT; see the honest residual in §4b.

**Coverage note.** Story pages build only for `status !== 'draft'` issues — 10
today. The six `2026-06-03-*-showcase` issues are `status: draft`, so the P6
breadth components have **no** story page yet; their story behaviour was
verified through the ranking/trim code and the published issues, not through a
showcase story URL.
