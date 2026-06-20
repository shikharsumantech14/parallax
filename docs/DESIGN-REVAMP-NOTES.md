# Design revamp notes — Claude Design v2 export

> **Status:** COMPLETE (2026-06-03). The earlier 2026-06-02 pass shipped
> P0–P5 + topic indexes but was *partial* on chrome and data-viz; the
> 2026-06-03 design-match pass finished it. Now done: the masthead is
> **unified** into one `.mh` press-header (the six per-topic mastheads are
> gone; their register microcopy moved to the per-issue `core/Banner.astro`);
> the data-viz are **fully ported** to the kit's exact markup + full
> animation vocabulary (stroke-draw, grow, scale-pop, count-up, MP-dot vote
> chamber, scan sweep) in the new `src/styles/dataviz-v2.css`, with count-up
> + cursor-warmth in the new `core/VizMotion.astro` island; the glass
> **ReadingToolbar shipped** (`core/ReadingToolbar.astro` — progress +
> Full/Skim + Save) and **SkimToggle was deleted**; section openers gained
> the ghost-numeral echo and the hero clamp was bumped. All raster imagery /
> the fal.ai illustrator phase were also removed (separate 2026-06-03 work).
> Both projects build green; every scroll-reveal is `html.js`-gated (no-JS /
> print render the final state) with `prefers-reduced-motion` resets.
> **Nothing deferred on the design itself.**
> **Follow-up (safe cleanup, not blocking):** remove the now-inert old
> per-component viz CSS in the theme files (`.px-vote*`, `.px-appr*`,
> `.px-pwm*`, `.px-paradox*`, `.px-timeline*`, the old orbit/launch/climate/
> bench/scurve/route/citycompare/ltab/radar blocks) + the `.px-skim-*` rules
> in `base.css`; and the orphaned `research/_voice/visual-mode-library.md`.
> The earlier orphans (`TopicManifesto.astro` + `.px-topic-*` blocks) also
> remain for that pass.
> **Source:** `D:\SideProjects\Parallax Lens Design System\` (Claude Design
> export, 2026-06-02). **Author of this note:** agent ingest pass.
>
> This is the bridge document between the external Claude Design export and
> our Astro codebase. Read it before doing any reskin work.

---

## 1. What the export actually is

A "design system" folder reverse-engineered from our production repo + live
screenshots, **plus** a forward-looking revamp. Key distinction:

| Folder | What it is | Relevance |
|---|---|---|
| `colors_and_type.css`, `src/`, `_shared/parallax-tokens.css` | Mirror of **current** production (tokens identical to ours) | Reference only — not new |
| `ui_kits/publication/` (v1) | React **replica of the current** site | Reference only |
| **`ui_kits/publication-v2/`** | **The revamp** — new direction | ★ This is the work |
| `ui_kits/app/` | React replica of the **current** reader app (not revamped) | Reference only |
| `preview/`, `assets/screenshots/`, `docs/CLAUDE-DESIGN-BRIEF.md` | Reference cards, renders, the original brief | Reference |

The revamp is **React + Babel-from-CDN** (no build step) and is
**publication-only**. It predates Phase B, so it contains **none** of our
new features (reader islands, Letters, moderation queue, app surfaces).

The high-value, directly-portable assets are the three v2 CSS files:
`tokens.css` (3 KB), `styles.css` (55 KB, chrome), `components.css` (35 KB,
banners + section openers + 12 data-viz). The `.jsx` files give markup
structure to translate into `.astro` per component.

---

## 2. The v2 design system (extracted)

**Thesis:** *editorial-modern, commercial-ready* — keeps the type-led,
two-colour-per-surface, per-topic-world identity, but adds restrained depth
(soft curves, soft shadows on the right surfaces), a glass reading toolbar,
and base-visible scroll motion. Reads as a publication, not a SaaS app.

### 2.1 New tokens (`tokens.css`, additive over current)
- **Motion ramp:** `--t-instant 80ms / --t-quick 140 / --t-soft 220 / --t-slow 420 / --t-page 600`, `--ease cubic-bezier(.22,1,.36,1)`, `--ease-snap`.
- **Radii:** `--r-card 6px`, `--r-tile 14px`, `--r-pill 999px`. (Body buttons stay square.)
- **Glass:** `--glass-bg` / `--glass-bg-dark` / `--glass-blur (blur 18px)` / `--glass-border`.
- **Cursor warmth:** `--warmth-color`, `--mx/--my` written by JS.
- **Columns:** `--col-prose 720 / --col-wide 980 / --col-bleed 1180`.

### 2.2 The big typography fix — unified system
Today every topic swaps **display + body + mono**, so the homepage shows six
display faces at once ("font catalogue"). v2:
- **One base everywhere:** Fraunces (display), Inter Tight (body), JetBrains Mono (chrome).
- **Body + mono normalised across all topics** (no more per-topic body/mono swap).
- **One signature face per world**, exposed as `--issue-face`, applied **only**
  to that world's banner nameplate + hero headline (Space Grotesk / Cormorant /
  JetBrains Mono / Oswald / Fraunces). Topic identity survives; the jumble dies.

This is the single most consequential — and most positive — change.

### 2.3 Chrome patterns (`styles.css`)
Masthead (3-zone: brand+lens-mark · status pill · nav+pill-CTA, 3px top rule +
hairline accent) · animated-underline nav · manifesto strip (01/02/03) ·
chord hero (eyebrow w/ leading rule, big Fraunces headline, **accent word in
forest green** w/ animated underline) · **bento** home (rounded tiles, per-world
gradient bg + token overrides, cursor-warmth radial, top stripe grows on hover,
−2px lift, SVG ornaments) · archive (staggered scroll-reveal rows) · issue
hero (`--issue-face`, `— 01` eyebrow) · **primer** (soft `--r-card` card, accent
left edge, 1px shadow) · sections (52px display numeral + mode metadata, prose
indented `margin-left:108px`) · pull-quote (oversized mark, accent gradient) ·
timeline (rail + staggered reveal) · sources (pill-numbered) · **glass reading
toolbar** (fixed bottom-centre, skim/full segmented control, light/dark per
world) · reading-progress hairline · colophon (4-col footer) · subscribe strip
· `@view-transition` MPA transitions · fixed `.atmosphere` radial paper wash.

### 2.4 Data-viz (`components.css`)
Shared `.viz` card shell: `--r-tile` rounded, 1px rule border, **soft two-layer
shadow that lifts −2px on hover**. 12 signature components, each scroll-revealed
(bars grow, lines draw via `stroke-dashoffset`, polygons scale, rows stagger):
VoteBar, Telemetry, ApprovalChart, PowerMatrix, OrbitTrace, LaunchStats,
ClimateStrip, Paradox, BenchmarkChart, AdoptionCurve, RouteCard, CityCompare,
LeagueTable, PlayerRadar. Section openers get an oversized ghost-numeral echo +
gradient hairline.

---

## 3. Conflicts with our hard rules — **operator decisions needed**

v2 deliberately relaxes several rules in our `AGENTS.md` / `src/components/AGENTS.md`.
The export's own root `README.md` still states the *old* rules (radii 0, no
shadows), so the export contradicts itself; v2 is the newer intent. Each of
these needs an explicit yes/no before it ships:

| # | Current rule | v2 wants | Recommendation |
|---|---|---|---|
| C1 | **All corner radii = 0** | `--r-card 6` (cards), `--r-tile 14` (tiles/viz), pills (status, CTA, toolbar, form, source #) — buttons stay square | **Adopt**, scoped exactly as v2 does (square buttons, soft cards/tiles, pill chrome). Tokenised, easy to dial. |
| C2 | **No drop shadows anywhere** | soft 2-layer shadow on `.viz` cards (+hover lift), 1px on primer, big on glass toolbar | **Adopt** for data-viz cards + toolbar only; keep flat elsewhere. |
| C3 | **Backdrop blur only on a future Q&A sidebar** | glass on the reading toolbar now | **Adopt** (it's functional overlay chrome, matches the spirit). |
| C4 | **Near-zero JS** (was "only SkimToggle"; already 6 islands post-Phase-B) | cursor warmth, scroll reveals, count-ups, scroll progress, view transitions, reading toolbar, animated SVG | **Adopt selectively.** Reveals + count-ups as tiny vanilla islands (or CSS-only); cursor warmth optional; view transitions via Astro `<ClientRouter/>` is a separate decision (adds JS + changes routing). |
| C5 | Home headline accent word = meta accent (near-black) | **forest green**, hardcoded `#1a4a36` | Confirm intent; if kept, tokenise it (don't hardcode). |

**None of these touch the publication's `output: 'static'` posture** — they're
all CSS + small islands. The static architecture is preserved.

---

## 4. Bugs / problems found in the export

1. **★ No-JS hides content (highest priority).** The reveal pattern is
   *visible by default, then hidden by a `:not(.is-in)` override*, and JS adds
   `.is-in` (IntersectionObserver, with a 1.5 s `setTimeout` fallback in
   `hooks.js`). The README claims "base-visible, works as a print-still," but
   that's only true because the **JS timer** reveals it. **With JS fully
   disabled, `.is-in` is never added → vote bars, timelines, telemetry, climate
   strips, charts, archive rows, and section numerals stay invisible.** For a
   static, no-JS-resilient publication this is unacceptable as-is.
   **Fix on port:** gate the hidden state behind a `html.js` class (set `.js`
   via a one-line inline `<head>` script), i.e. `html.js .viz:not(.is-in) … {hidden}`.
   No JS ⇒ no `.js` class ⇒ content paints fully. (Reduced-motion is already
   handled — the `@media (prefers-reduced-motion)` block neutralises every
   hidden offset.)
2. **Three unused fonts loaded.** `index.html` imports Playfair Display, DM
   Serif Display, Crimson Pro (tweaks-panel exploration only — `tokens.css`
   never references them). Do **not** ship these; keep the 7 canonical families.
3. **Duplicate `@keyframes lensPulse`** in `styles.css` (lines ~88 and ~156,
   slightly different values). Consolidate to one.
4. **Hardcoded hexes that should be tokens:** home accent-word `#1a4a36`,
   VoteBar `#1e5a3f` / `#f4f1ea`, LeagueTable/PowerMatrix `#c0392b` / `#1e8a5a`.
   Some are legitimate fixed data-encodings (climate blue→red ramp, win/loss);
   the themeable ones (accent-word, opposition green) should map to
   `--accent-deep` / `--accent-alt`.
5. **Contrast risk:** v2 uses `var(--accent)` (the *vivid* value) for a lot of
   **text** (eyebrows, section numerals, italic accent words, CTAs). Our system
   reserves the vivid accent for fills/rules and mandates `--accent-deep` for
   type on light paper (WCAG). A contrast audit per surface is required on port;
   prefer `--accent-deep` for accent-coloured text on light themes.
6. **View transitions** (`@view-transition`) on an MPA need Astro's
   `<ClientRouter/>` to work cross-page — that adds a JS runtime and changes
   navigation/island lifecycle. Treat as an explicit, separable decision.

---

## 5. Gap list — what the revamp does NOT cover (we design these in the v2 language)

1. **Reader-interaction islands** (publication, Phase B): `SaveButton`,
   `ReactionsBar`, `ReadingTracker` (invisible), `AnnotationLayer`,
   **`LettersBlock`**. v2 has its own **glass ReadingToolbar** (skim/full) that
   overlaps the current `.px-reader-controls` row (SkimToggle + Save). **Reconcile:**
   does the glass toolbar absorb Save/Skim? Where do React/Annotate/Letters sit?
2. **Moderation queue** (`/admin/comments`, app subdomain) — not in v2.
3. **App dashboard + login** — v2 doesn't touch the app (its `app/` kit is a v1
   replica). The app has its own lighter `app.css`; we can pull v2 tokens
   (motion/radii/glass) over for consistency, lower priority.
4. **Topic-index pages** (`/topics/<topic>`, 6 of them) — v2 shows the bento
   home + issue pages; the per-topic index template needs reconciliation.
5. **Letters block + moderation queue** specifically must be *designed*, not
   ported (brand-new surfaces). They should reuse v2's `.viz` card, soft form
   inputs, and pill/segment vocabulary.

---

## 6. Porting strategy (React → Astro, static-safe)

- **CSS layers map cleanly:** `tokens.css` → additions to `src/styles/meta.css`
  (motion/radii/glass/cols + the unified-type block); `styles.css` chrome +
  `components.css` → split across `src/styles/base.css`, the 6
  `src/styles/themes/*.css`, and per-component `<style>` blocks. The 6 theme
  files get *simpler* (stop swapping body/mono; expose `--issue-face`).
- **JSX → `.astro`:** map v2 components onto existing ones where they exist
  (Masthead, Hero, Primer, Section, Sources, Quote→PullQuote, home Chord/Bento)
  and add new ones (Banner, section opener, ReadingToolbar, Colophon,
  SubscribeStrip, the new data-viz). Keep the `px-` prefix convention; each new
  component reserves a prefix in `src/components/AGENTS.md §8`.
- **Static rules hold:** publication stays `output:'static'`; motion ships as
  small vanilla islands (an `is:inline` IntersectionObserver toggling `.is-in`,
  plus the `html.js` guard from §4.1) or pure CSS. No framework runtime.
- **Per-topic theming preserved** via `data-topic` (v2 keeps and improves it).

---

## 7. Proposed phased plan (incremental, build-verified, each phase = its own commit)

> Each phase ends green on `npm run build` (publication + app) and is small
> enough to review. Order minimises risk: tokens first, then chrome, then
> long-tail components, then our new features.

- **P0 — Token + motion foundation.** Port `tokens.css` into `meta.css`
  (radii/glass/motion/cols + unified-type + `--issue-face`); add the `html.js`
  guard + the shared reveal island + `prefers-reduced-motion` block. Normalise
  the 6 theme files (body/mono unify, expose `--issue-face`). *No visual
  feature yet — just the substrate.* **← decisions C1–C5 land here.**
- **P1 — Home.** Masthead, chord, manifesto strip, bento grid, archive,
  subscribe strip, colophon.
- **P2 — Issue shell.** Banner, hero (`--issue-face`), primer, section openers,
  prose, pull-quote, sources, reading toolbar (+ reconcile with reader-controls).
- **P3 — Data-viz reskin.** The `.viz` shell + the signature components, topic
  by topic (politics → space → earth → tech → travel → sports).
- **P4 — Topic-index pages** reconciled to the new system.
- **P5 — Our new features in the v2 language:** reader islands (Save, React,
  Annotate, **Letters**), then the **moderation queue**, then app dashboard/login.
- **P6 — Debug + a11y sweep:** contrast (WCAG, `--accent-deep` for type),
  375 px overflow, no-JS resilience, per-topic theme integrity, the
  AGENTS.md §8 verification checklist.

---

## 8. Open decisions for the operator (blockers for P0)

1. **Adopt the rule relaxations C1–C4?** (soft radii on cards/tiles + pills;
   shadows on viz cards + toolbar; glass toolbar; the motion budget.) These
   redefine brand canon — I need a yes/no (all, some, none).
2. **Home accent word green (C5)** — keep the forest green, or use the meta
   near-black accent?
3. **View transitions** — adopt Astro `<ClientRouter/>` (nicer nav, more JS), or
   skip for now?
4. **Reading toolbar vs reader-controls** — should the glass toolbar absorb
   Skim + Save (and where do Reactions / Annotate / Letters live)?
5. **Scope/sequence** — run P0→P6 in order over multiple commits, or
   reprioritise (e.g., do P5 — our new features — earlier so the just-built
   moderation queue + Letters match before the full reskin)?

Once these are answered, P0 starts.
