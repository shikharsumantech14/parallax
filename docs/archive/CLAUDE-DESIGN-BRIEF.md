> # ARCHIVED — FROZEN HISTORY. NOT CURRENT.
>
> **Froze:** 2026-05-26  ·  **Superseded by:** `docs/REVAMP-PLAN.md`
>
> **Why kept:** The brief SUBMITTED to Claude Design on 2026-05-24. Kept as the input record; the delivered handoff and every ruling on it live in REVAMP-PLAN.md (RD-01..RD-09).
>
> Do not treat anything below as the current state of the project, and do not
> act on its instructions. The single entry point is `docs/STATE-OF-PLAY.md`.
> Archived 2026-09-01 under CONTEXT-PLAN.md CD-07/CD-10.

---

# Claude Design — system brief

> **Status:** Submitted to Claude Design on 2026-05-24. This file is the
> canonical record of the brief that was given to the external design
> tool. If you (a future agent or operator) are about to make visual or
> UX decisions, read this file first — the design direction has been
> articulated externally and committed to here.
>
> **Companion docs:**
> - `AGENTS.md` (root) — full brand canon
> - `src/components/AGENTS.md` — section-kind dispatcher conventions
> - `research/_voice/visual-mode-library.md` — visual canon for cover art
> - `docs/PROJECT.md` — long-form project state

---

## How this came about

After Phase A (auth, dashboard, newsletter, privacy/terms) shipped, the
operator's honest read of the build was:

> *"The product currently looks very generic Claude-generated with no
> design language. I want to create a human-looking, commercialized
> product with real design language. And currently very text-heavy with
> no visuals — want to make it visual-heavy with issues that have text."*

That triggered a design-system setup in Claude Design, attaching:
- The GitHub repo (`shikharsumantech14/parallax`)
- Selected source folders (`src/components/`, `src/styles/`, `src/layouts/`, `src/pages/`, `src/lib/`)
- 3-4 screenshots of current production pages
- Representative OG covers from `public/og/`
- Favicon

The brief below is what was sent to Claude Design under "Any other
notes?" It defines what we want, what we explicitly do NOT want, and
the architectural constraints any visual proposal must respect.

---

## The brief (verbatim as submitted)

### Company name and blurb

> Parallax Lens — a visual explainer publication. We publish long-form,
> fully-sourced editorial issues across six topic worlds — politics,
> space, earth, tech, travel, sports — each with its own distinct
> aesthetic register (broadsheet, mission-control, atlas, terminal,
> postcard, matchday programme). Built on Astro 4 + MDX, static deploy.
> Pure typography, no JS islands, no analytics, no cookies, no trackers,
> no ads. Brand promise: *"Stories you think you already understand."* A
> separate Supabase-backed reader-account app lives at
> `app.parallaxlens.com`.

### Current state & vision

- The current build looks generic and Claude-generated. No distinct
  design language yet, no hero treatment, no graphic logo. This is
  intentional — the priority so far has been structural correctness
  over visual identity. Now is the time to give it a real design
  language that feels human, considered, and commercial-grade. The
  product is being prepared for a public launch with real readers, so
  the visual layer must read as *"designed by a real publication"* not
  *"scaffolded by an AI."*

- The publication is currently text-heavy with minimal visuals. We
  want to flip the ratio: visual-heavy editorial layouts where text is
  anchored to imagery rather than imagery being optional decoration.
  Reference register: Bloomberg Businessweek covers AND spreads, FT
  Weekend Magazine, NY Times Magazine longform, The Atlantic feature
  illustration, Pitchfork long-reads, NY Magazine. Visual-heavy in the
  EDITORIAL sense — every image earns its place, supports the
  structural argument, and could be silenced into a print plate. Not
  visual-heavy in the BuzzFeed / social-feed sense.

- Typography must SING. We use professional Google Fonts (Fraunces,
  Inter Tight, JetBrains Mono, Cormorant Garamond, Oswald, Space
  Grotesk, IBM Plex). Keep them. The implementation should make them
  work: proper weight pairings, generous line-height, attentive
  kerning, real italic faces, drop-cap moments where they earn their
  place, hanging punctuation for pull quotes, all-caps with positive
  letter-spacing for chrome, numerals with tabular figures for data
  sections. Every page should read as *"set by a designer, not by a
  CMS."*

- Logo + identity system: we have no graphic logo today, only a
  typographic *"PARALLAX"* wordmark. Propose a full identity system:
  primary wordmark; optional graphic mark (an offset rectangle, a
  parallax-shift glyph, a lens iris); lockup variants (horizontal,
  stacked, mark-only); per-topic identity hints (small chrome
  differentiators); social-card composition system.

- Hero zones, banners, and section openers: today the issue page
  opens with a typographic Hero only. Propose issue hero (full-bleed
  editorial image + overlaid title), topic banner (per-topic standing
  chrome — atlas plate for earth, mission-control telemetry strip for
  space, etc.), home page hero (typographic chord can be retained but
  should feel commissioned), section openers within an issue (visual
  breaks between major structural sections).

### Design craft expectations — modern, but editorial-modern

- Use a contemporary, clean design language — but the *"modern"*
  reference is editorial-modern (NY Times Magazine, The Atlantic,
  Bloomberg Businessweek's site, FT Weekend Magazine), NOT SaaS-modern
  (Linear, Vercel marketing, Notion, generic startup landing pages).
  When in doubt: *"Would this appear in a paid editorial publication's
  digital edition?"* If no, cut it.

- **Transitions** — subtle, considered, single-property.
  - Welcome: 80–150 ms ease-out hover fades; cross-fades between
    reading-mode (skim/full); restrained scroll-triggered reveals
    (opacity 0→1 once, never on every scroll); hairline-accent
    cursor-following warmth.
  - Forbidden: scroll-jacking, parallax effects (despite the brand
    name), spring/bounce easing, animated gradient backgrounds,
    floating decorative orbs / blob shapes / mesh gradients.

- **Gradients** — refined and specific.
  - Welcome: atmospheric sky-to-ground tones inside editorial
    photography or illustrated covers; soft ink-bleed gradients on
    pull quotes and drop caps; warm-paper-to-warmer-paper tonal shifts
    where they enhance depth (2–3 % lightness shift max).
  - Forbidden: gradient buttons / CTAs / brand marks; rainbow or
    multi-stop gradients; loud SaaS hero gradients; conic gradients
    or high-saturation radial gradients.

- **Glass / blurred-backdrop effects** — permitted ONLY where
  transparency reads as functional architecture, never as decoration.
  - Welcome: Q&A sidebar floating over an article (Phase D); modal
    that softly recedes the background body content.
  - Forbidden: frosted-glass cards as primary content surfaces;
    glassmorphic navigation bars; frosted overlays on hero images
    *"for depth."* Think *museum vitrine*, not *iOS control panel*.

- **Banner / chrome detail moves we DO want:**
  hairline rules with accent-color whispers at section breaks;
  optical-corrected drop caps in feature openers (manually positioned);
  subtle ink-shadow under masthead type (1–2 px, ≤8 % opacity);
  refined kerning on display type; numerals with tabular figures in
  data sections, lining figures in body text; pull quotes with
  hanging punctuation and oversized opening marks; section number
  ornaments (— 01, — 02 …) treated as confident metadata.

The rule for any modern touch: every flourish must feel
**commissioned**, not **trendy**. If it could appear in next year's
TikTok marketing template, we don't want it. If it would feel right in
next year's Pentagram annual report, we want it.

### Design philosophy (must respect)

1. Restraint stays. Visual-heavy ≠ cluttered. Every image must clear
   the *"would this earn a printed page"* bar. No stock photos, no
   generic AI art, no gradient slop, no glass-morphism, no
   neumorphism, no soft cards.
2. Typography-led restraint at the **chrome** level. Visual-rich at the
   **editorial** level. The two coexist: the layout chrome is calm,
   the illustration / photography is alive.
3. Zero third-party trackers, zero ads, zero engagement-bait. No
   *"Subscribe to read more"* gates, no popups, no toasts nudging
   signup.
4. White space is the brand. Empty zones are intentional, never
   compressed to fill the viewport.
5. Six topics, six distinct worlds — unified by the typographic chord
   meta-brand. Topic identity is sacred. Don't collapse them.
6. Zero JS islands except the existing SkimToggle, SaveButton, and
   ReactionsBar. Any new interactivity must justify the JS bytes. CSS
   animations OK if restrained.

### Architecture constraints

- Static Astro 4 + MDX. Issues are content collections defined in
  `src/content/config.ts`. Section kinds dispatched via
  `src/components/SectionRenderer.astro`.
- Each section kind is a typed component with its own data schema. New
  components must follow this pattern: declare in `SECTION_KINDS`,
  dispatch in `SectionRenderer`, render with topic-aware CSS variables.
- CSS uses custom properties scoped under `:root[data-topic="<topic>"]`.
  Don't use Tailwind, styled-components, or any CSS-in-JS. Per-component
  `<style>` blocks or per-topic theme files in `src/styles/themes/`.
- Currently 33 section kinds across six topics.

### What we want from Claude Design

1. **Full visual identity pass** — logo system, hero treatments, banner
   treatments, masthead refinements, social-card composition rules.
2. **Second-generation visual refresh of the publication** — same
   brand restraint, sharper typography, more confident white space,
   better integration of editorial imagery into the typography-led
   layout. Move from *"blog post with sprinkled images"* to *"magazine
   spread with anchored text."*
3. **A new family of dynamic component designs** — live numeric
   counters / odometers; comparative scrollers; annotated photographs
   with anchored callouts; networked node diagrams; sequence
   flipbooks; anything reading as *editorial dynamism*, not
   *web flourish*. Each must work as a still image (newspaper-print
   test) AND feel alive on scroll/interaction. Implementable in
   ≤5 KB JS per island.
4. **Polish pass on the app subdomain** (login, dashboard) — currently
   bare bones. Same restraint, warmer because personal.

### Constraints

- Mobile 375 px is a first-class viewport, not an afterthought.
- WCAG AA contrast on all body text. Each topic has a `-deep` accent
  variant for use on light paper.
- No external icon libraries. If icons are needed, inline SVG,
  designed bespoke for Parallax.
- Color tokens defined in `src/styles/themes/*.css`. Don't introduce
  new brand colors without justification.
- All images that ship as part of the design system must be either
  (a) real photography licensed for editorial use, (b) bespoke
  illustration in a recognisably Parallax voice, or (c) generated via
  the existing fal.ai pipeline using the visual mode library at
  `research/_voice/visual-mode-library.md`. No stock photos.

---

## What this means for future implementation

When Claude Design returns proposals — for a logo, a new section kind,
a hero treatment — translate them into Astro components by following
the established conventions:

1. New section kinds → `SECTION_KINDS` in `src/content/config.ts`,
   dispatch in `SectionRenderer.astro`, component in
   `src/components/topic/<topic>/` or `src/components/core/`.
2. New CSS → per-topic theme file or component-scoped `<style>` block,
   unique `px-<abbrev>` class prefix.
3. New images → either fal.ai-generated via the existing pipeline OR
   manually-licensed editorial photography stored in `public/`.
4. New interactivity → ≤5 KB JS client island, no framework runtime.
5. Document each new component in `src/components/AGENTS.md`.

Brand drift risk: if a Claude Design proposal violates a rule from
this brief (e.g., introduces a gradient button, adds a glassmorphic
card, swaps the typeface), **reject it and re-prompt**. The brief is
the floor, not the ceiling.

---

## Open questions to revisit after Claude Design's first proposals

- **Logo**: typographic refinement vs. introduction of a graphic mark.
  Currently undecided; depends on what Claude Design proposes.
- **Visual-heavy shift**: how do we reconcile the new direction with
  the existing `research/_voice/visual-mode-library.md` which leans
  restraint-first? Likely answer: keep the visual mode library for OG
  covers (which Flux generates), and create a new
  `research/_voice/editorial-imagery-guide.md` for inline editorial
  illustration once Claude Design produces direction.
- **Per-topic banner concept**: the six topic worlds already have
  distinct chrome via masthead variants and topic-index pages. Does
  the standing-banner concept add value or duplicate?

---

## Change log

### 2026-05-24 — Brief submitted to Claude Design
Initial brief. Includes visual-heavy direction shift, request for
logo + identity system, dynamic component family proposals, and full
craft expectations (transitions / gradients / glass effects).
