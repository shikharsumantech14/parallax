# Home spec — "The Observatory Floor" (R9 revamp)

> The operator's directive (REVIEW-2026-07-05 R9): redesign the home
> completely — modern, attention-hooking, interactive — while keeping the
> vision. This spec is the contract. Doctrine: the home is not a landing
> page; it is **the observatory floor of a working publication** — you can
> see all six instruments from here, one is lit and running, and the brand
> idea (two viewpoints resolving one object) is physically enacted once.
> Everything stays island-based vanilla JS, fallback-first, zero three.js
> (chunk isolation holds — the home never loads WebGL).

## Page order (top → bottom)

1. **Masthead** (unchanged; now carries AccountEntry).
2. **HERO — "The Second Angle, enacted"** (new `home/HeroLens.astro`, `px-hlens`)
3. **THE WIRE** — latest-dispatch mono strip (new `home/WireStrip.astro`, `px-wire`)
4. **DESK PORTALS** — the six worlds, alive (upgraded `home/CategoryGrid.astro`/`CategoryCard.astro`)
5. **FEATURED PLATE** — the latest issue with its hero viz as art (new `home/FeaturedPlate.astro`, `px-fplate`)
6. **Manifesto strip** (existing `px-mstrip`; numbers gain `countup`)
7. **Archive** (existing; staggered reveals stay)
8. **Subscribe strip → Colophon** (existing).

The first-visit IntroExperience overlay is unchanged (it plays above all this).

## 2. HERO — the brand moment

Full-width, ~78vh min 560px, warm meta paper. Composition:

- **The lens figure**: the two brand rings drawn LARGE (≈ 520px, right half of
  the hero, bleeding off-edge on mobile) as 1.5px ink strokes @ 0.35, with the
  red hero sphere (the locked mark's #b8341f, gradient-shaded like the brand
  asset) sitting in the vesica. Pure inline SVG.
- **The enactment (the ONE parallax, cursor-driven)**: on `pointermove` the
  two rings drift in OPPOSITE directions, ±10px max, `settle`-damped — two
  viewpoints shifting around the fixed red object under your hand. This is a
  sanctioned, documented exception to CANON §11's parallax ban: it is the
  brand's own physics, enacted exactly once, on one surface. Touch: drifts
  with a slow 14s idle sway instead (±6px). Reduced-motion/no-JS: static
  registered figure. Island ≤ 40 lines, no dependencies.
- **Headline** (left half): eyebrow `SIX WORLDS · ONE PUBLICATION` (mono) →
  Fraunces clamp(44px, 7vw, 84px): `Stories you think you *already*
  understand.` (accent word italic red) → dek (2 lines, body serif standfirst
  style, justified ≥640) → two CTAs: primary ink pill `Start with a story →`
  (→ the newest issue's `/s/` link — story mode as the front door) + ghost
  mono `How Parallax works` (→ /welcome).
- Reveal: headline lines `reveal`-stagger on load (html.js-gated); rings draw
  in with `sweep` (1200ms) once, then hold.

## 3. THE WIRE — `px-wire`

A single-row mono strip between hero and portals (the "publication is alive"
signal): `THE WIRE //` + the 3 latest issues as `— NN · <TITLE> · <topic>`
inline links + a persistent tail link `EVERY ISSUE HAS A 60-SECOND VERSION →`
(→ newest `/s/`). Static row, horizontal scroll on overflow (no marquee — the
motion budget is spent on the hero). 1px rules top+bottom, `--paper-2`-tone.

## 4. DESK PORTALS — the six worlds, alive

`CategoryCard` upgrade (keep grid, keep warmth + top-stripe hover, keep all
existing per-world head compositions — this is ADDITIVE):

- **Live micro-viz**: each card embeds its world's `intro/WorldViz.astro`
  (already built for the onboarding: vote bar / orbit / stripes / commit grid
  / route / momentum wave) as a quiet animated figure in the card body,
  `reveal`-gated. Reuse, don't rebuild.
- **World dressing**: light worlds pick up their motif kits — politics: a
  `.pol-division`-style rule under the card head; earth: `.ear-coords` line +
  contour whisper; travel: `.trv-stub` perforation on the card's left edge.
  Dark worlds already carry their registers.
- **Meta line**: `N dispatches · latest — NN` (mono) + the card CTA.
- Cards link to desks (unchanged). Hover: existing lift/stripe/warmth.

## 5. FEATURED PLATE — `px-fplate`

The newest published issue as a full-width editorial plate (between portals
and manifesto): left = eyebrow `LATEST DISPATCH · <WORLD> DESK` + issue title
(Fraunces 34-44px) + hook (justified) + 2 links (`Read the issue →` ink pill;
`60-second version →` mono, → its `/s/`). Right = **the issue's own hero viz
as the art**: render the issue's highest-priority viz section via
`SectionBody` inside a `.px-viz`-style plate, `data-reveal` (NOT WebGL kinds
— skip to the next SVG/CSS kind if the top pick is WebGL; keep the home
three-free). Selection: reuse `KIND_PRIORITY` from `src/lib/story.ts`,
filtering out the 6 WebGL kinds. Whole plate wears the issue's world via a
scoped `data-topic` island? NO — nested `data-topic` doesn't retheme CSS
vars… it DOES: custom properties cascade from any element. Set
`data-topic=<topic>` on the plate wrapper and the theme vars re-scope (the
`:root[data-topic]` selectors won't match a div — so instead apply the
world's `--w-*` accents from `worlds.css` `[data-world]` + explicit
`--accent/--accent-deep/--ink`… simplest robust: the plate stays META-toned
(paper/ink) with the world's ACCENT pulled via `--topic-<name>` vars from
meta.css for the eyebrow/rules/CTA. Restraint wins; no full retheme.)

## 6. Existing sections

- Manifesto strip: the `01/02/03` numerals get `data-countup` (VizMotion
  already on the page? HomeLayout includes Reveal+VizMotion — verify, add if
  absent).
- Archive + subscribe + colophon: untouched this pass.

## 7. Budgets & contracts

- JS added: the hero ring-drift island only (≤40 lines). WorldViz/Reveal/
  VizMotion already exist. No new deps, no three.
- No-JS: hero static + everything painted; wire/plate are static; portals
  keep no-JS behavior.
- Mobile 375: hero stacks (headline over a 60%-scale lens figure, drift off),
  wire scrolls, portals single column (existing), plate stacks.
- A11y: hero SVG `aria-hidden`; CTAs real links; AA on all text (accent-deep
  for red text on paper).
- Perf: LCP is the headline text (no images); rings SVG inline (~2KB).

## 8. Acceptance

- [ ] Home is visually distinct from any issue AND from its old self (the
      operator's "generic Claude design" verdict overturned or bust).
- [ ] The hero enacts the parallax under the cursor; static + composed under
      reduced-motion/no-JS; nothing else on the page moves continuously.
- [ ] `/s/` links present in hero CTA + wire + featured plate (story mode is
      the front door).
- [ ] No three.module chunk requested on `/` (network check).
- [ ] 375px: no overflow; hero headline ≥44px; tap targets ≥44px.
- [ ] Every new text respects the type rhythm rules (one body register,
      justified ≥640, mono = metadata only).
