> **Role of this file.** This is the *design-system reference* for the Parallax
> revamp — the size system, the explainability contract, the mark construction,
> and the brand rules. It predates the integration pass and remains accurate for
> those subjects.
>
> **If you are implementing, start at [`AGENTS.md`](./AGENTS.md), then
> [`INTEGRATION.md`](./INTEGRATION.md).** The 28 new section kinds, their
> blueprints, registry diffs and example payloads live there — not here.

---

# Handoff: Parallax Lens revamp — website + reader app

## Overview

Parallax Lens is a visual-explainer publication: long-form, fully-sourced editorial issues across six topic worlds (politics, space, earth, tech, travel, sports). This handoff covers a full revamp of two surfaces:

- **parallaxlens.com** — the public website (static Astro 4 + MDX in production).
- **app.parallaxlens.com** — the Supabase-backed reader app (auth, saved issues, preferences).

The revamp replaces a four-family typographic system with one, turns the six worlds into data rather than themes, gives every issue its own data instrument, introduces two scroll-linked image treatments, and replaces the brand mark with a phase medallion whose crescent encodes which desk you are reading.

**Read in this order:** this README → `design/Parallax Revamp Spec.dc.html` (the printable spec) → `design/Parallax Brand.dc.html` (the brand book) → the two prototypes.

## About the design files

The files in `design/` are **design references created in HTML** — prototypes showing intended look and behaviour, not production code to copy. Recreate them in the target codebase's existing environment (Astro + MDX for the site, whatever the reader app uses) with its established patterns. The `.dc.html` files run in a component runtime specific to the design tool; treat their markup and inline styles as the source of truth for values, not their structure.

Open any of them directly in a browser to see the live design.

| File | What it is |
|---|---|
| `design/Parallax Web.dc.html` | Website, six pages, desktop + phone widths |
| `design/Parallax App.dc.html` | Reader app, eleven screens at 393 × 852 |
| `design/Parallax Revamp Spec.dc.html` | The written spec (printable) — read this first |
| `design/Parallax Revamp.dc.html` | The exploration canvas, nine turns, including rejected options |
| `design/Parallax Brand.dc.html` | The brand book — construction, dial, cuts, scale, watermarks, banners, misuse |
| `design/Parallax Marks.dc.html` | Mark exploration, six turns, including every rejected draft |
| `design/Parallax Components.dc.html` | The component library — size system, explainability contract, 60 instruments (10 per desk) |
| `design/Parallax Content Templates.dc.html` | Video/social branding kit — vertical + horizontal, safe zones, presence tiers |
| `brand/` | 32 production SVGs — see **Brand assets** below |
| `design/support.js` | Runtime for the `.dc.html` files — not part of the design |
| `design/image-slot.js` | Drop-zone placeholder web component used for photography |
| `design/doc-page.js` | Paged-document shell used by the spec |

## Fidelity

**High-fidelity.** Final colours, typography, spacing and interactions. Every value in this README is read off the working prototypes. Recreate the UI precisely; substitute only where the target codebase has an established equivalent.

---

## The brand mark

A **phase medallion**: a disc lit from one side, with the letter in the calm middle. The crescent is the part that was hidden until something moved — the publication's premise in one shape.

### Construction

All geometry on a **300-unit box centred at 150,150**. Four circles and a letter, in paint order:

| Element | Value |
|---|---|
| Light | `r = 110`, filled **accent** |
| Occluder | `r = 113`, filled the surface's **ground** colour |
| Ring | `r = 118`, `fill: none`, stroke **ink** |
| Letter | `P`, Literata **700**, `font-size: 160`, `text-anchor: middle`, `x = 150`, `y = 207` |
| Clear space | 15 units on all four sides, outside the ring |

Two details that are not arbitrary and must not be "cleaned up":

- **The occluder is 3 units larger than the light** (113 vs 110). That difference is what makes the crescent swell at its belly and taper to points at both horns. Equal radii give a dead, even sliver.
- **The letter's baseline is 207, not 200.** The cap centre then lands optically on 150. Box-centring the glyph makes it sit visibly high.

### The dial — one angle per desk

The occluder sits **15 units from centre, pushed away from the desk's angle θ**, so the crescent appears *at* θ. This angle is the only value that changes between desks.

```js
const DIAL = { politics: 325, space: 25, earth: 85, tech: 145, travel: 205, sports: 265 };

function occluder(deg, r = 15) {
  const t = (deg * Math.PI) / 180;
  return { cx: 150 - r * Math.cos(t), cy: 150 - r * Math.sin(t) };
}
```

Six stations, 60° apart, politics anchoring at 325°. Fixed once — never improvised, never reassigned.

### Three cuts

| Cut | Where | How |
|---|---|---|
| **Outline** | The everyday mark — masthead, footer, lockups, share cards | As constructed above. Ring stroke thickens as it shrinks: **7** units at 96px, **10** at 40px, **14** at 24px |
| **Reversed** | The seal, and the declared tier **below 24px** — favicon, app icon, inline end mark | Solid ink disc `r = 118`, letter knocked out in ground, crescent dropped |
| **Cover** | Covers, posters, colophon, printed matter only | Adds a second crescent *outside* the ring, opposite flank: a disc `r = 112` at 31.6 units from centre on the same dial |

The reversed cut below 24px is a **declared tier, not a degradation** — the outline and crescent both fail at that size, so the mark switches drawings.

### Misuse

No gradient or sphere shading · no off-station dial · no rotation · no second accent colour · no substitute letter · no drop shadow. If a rendering adds depth, light, a second accent, or moves the dial off its 60° station, it is no longer this mark.

### Brand assets

32 SVGs in `brand/`, all generated from the construction above. **Regenerate rather than hand-edit** — the generator is reproducible from this section.

| Files | What |
|---|---|
| `mark-{desk}.svg` × 6 | Outline cut, one per desk, on that desk's ground |
| `seal-{desk}.svg` × 6 | Reversed cut, one per desk |
| `cover-{desk}.svg` × 6 | Cover cut, one per desk |
| `mark.svg`, `mark-ondark.svg`, `seal.svg`, `cover.svg` | House versions (politics dial) |
| `favicon.svg` (32) · `app-icon.svg` (1024) · `avatar.svg` (1000) | Platform tiers |
| `watermark.svg` · `end-mark.svg` | Ink at 5–10%; 24px letterless inline ornament |
| `lockup-horizontal.svg` · `lockup-horizontal-ondark.svg` · `lockup-stacked.svg` | Mark + wordmark |
| `banner-paper.svg` · `banner-ink.svg` | 1500 × 500 social banners |

**In-product the mark is inline SVG, not an `<img>`** — it reads `accent`, `ground` and `ink` from the current world so it recolours with the surface. Use the files for anything outside the product: favicons, social, print, email, press.

### Watermarks and ornaments

| Placement | Spec |
|---|---|
| Page watermark | Ink at **5–10%**, bled off one corner, 250px, behind the primer |
| Plate watermark | Ink slab bottom-right, 12px inset: reversed mark at 15px + `PARALLAX` at 8.5px/600/.2em |
| End mark | 24px **letterless** outline mark, inline at the end of the last paragraph, replacing the ¶ |

### Lockups

Horizontal is the default: mark at 40–46px, 11–12px gap, wordmark `Parallax` at 26–34px/700/−.032em. Stacked adds `LENS` at 9px/600/.24em under the wordmark, and is for print and the colophon only. The wordmark never appears without the mark on a masthead; the mark appears without the wordmark everywhere below 40px.

---

## Data components

Two rules govern every figure. Both are enforced in `design/Parallax Components.dc.html`, which shows all six desks as real issue pages with components in the flow at true size.

### The size system

The prose column is **720px** and never moves. A component's size is a decision about how much it may interrupt reading, not about how much data will fit.

| Size | Width | Rule |
|---|---|---|
| **S** | 300px | Margin rail beside the prose; in the flow on phone. One number, one shape, **no controls**. |
| **M** | 720px | The measure of the prose. The default, and the **only size that may carry a control**. |
| **L** | 1080px | Breaks the column symmetrically, 180px each side. Only when the data has a genuinely long axis. |
| **XL** | full bleed | Its own section, prose stops. The one instrument an issue is built around. |

- **Phone:** every size collapses to 353px inside 20px margins. S stays as drawn; M and L reflow to one column with controls below the graphic; XL becomes M.
- **Never:** no component exceeds its declared size, and none scales with the viewport. A chart that reflows on every window drag cannot be captioned, cited or screenshotted consistently.
- **Budget per issue:** one S per two screens, at most three M, at most one L, and either an XL or an L — never both.

### The explainability contract

A reader opens a component **because the prose was hard**. If the component is harder, it has failed. Seven parts, all seven, every time — a figure missing any of them does not ship.

| # | Part | What it means |
|---|---|---|
| 01 | **A stated subject** | A headline saying what the figure is about in words, not a chart type. "How the house voted", never "Hemicycle". |
| 02 | **How to read this** | One paragraph above the graphic naming what a mark is and what the axes mean. Written for someone who just failed to follow the prose. |
| 03 | **Labelled axes with units** | km, m/s, percentage points, ppm. A number without a unit is a rumour. |
| 04 | **A legend that is also a control** | Colour is never explained elsewhere. Clicking the legend filters, so reading and interrogating are one gesture. |
| 05 | **A live readout** | The state of every control, in words and figures, beside the graphic. |
| 06 | **In plain terms** | One sentence stating the **finding** — rewritten as the reader moves the controls. Never a restatement of item 02. |
| 07 | **A source line** | Named, dated, specific enough to check. |

**Structural rule underneath all seven: labels are HTML, geometry is SVG.** Text inside an `<svg>` cannot wrap, cannot be selected, cannot be read by a screen reader, and does not survive a stream. Position real text over the drawing — and put it inside a wrapper matching the SVG's exact pixel size, or it will not register with the coordinates.

**Legends are derived from the chart, never authored beside it.** Every swatch must be a colour the graphic actually paints, and must change with the chart's state (politics recolours between Composition and Division, so its legend does too). Continuous scales get a gradient bar with end labels, not fake discrete swatches. Pale chips need a `1px solid var(--w-rule2)` edge to read at 10px.

### The eighteen built

| Desk | S | M | L |
|---|---|---|---|
| Politics | Seats-vs-population sparkline | The chamber (543 seats) · vote-to-seat conversion | Swing ladder |
| Space | — | Risk corridor · orbital shells | Delta-v ladder |
| Earth | Warming stripes | Climate spiral · sea level tank | Ice core |
| Tech | — | Latency waterfall · scaling plot | The die |
| Travel | — | Trek profile · season wheel | Route ribbon |
| Sports | — | xG race · shot map | Player radar |

The production repo has ~90 components, nearly all build-time pictures. These eighteen are rebuilt so the reader **changes an input and watches the claim change**, on one interaction vocabulary across all six desks: **scrub**, **filter**, **step**, **isolate**. Every one degrades to a readable static figure.

---

## Design tokens

### Colour — six worlds, one record each

Each world is one record of six values. Nothing in the system hard-codes a colour outside these records.

| World | Ground | Ink | Accent | Accent-deep | Rule | On-accent |
|---|---|---|---|---|---|---|
| Politics | `#faf7f0` | `#161412` | `#b8341f` | `#8b2416` | `#ddd4c4` | `#faf7f0` |
| Space | `#0a1628` | `#e8eef7` | `#00d4ff` | `#5ce1ff` | `#1e3352` | `#0a1628` |
| Earth | `#f4ecd4` | `#1f2a1c` | `#2d6a4f` | `#1f4d38` | `#d4c8a8` | `#f4ecd4` |
| Tech | `#0a0a0a` | `#fafafa` | `#c6f432` | `#a8d61c` | `#262626` | `#0a0a0a` |
| Travel | `#fffdf6` | `#2a1f15` | `#c85a3c` | `#a03f24` | `#e5d9c4` | `#fffdf6` |
| Sports | `#0f2820` | `#f5f5f0` | `#e8f048` | `#c3cc2c` | `#1f4434` | `#0f2820` |

**Accent vs accent-deep.** The vivid accent is for hairlines, dots, fills and dark grounds. Accent-deep is the type-safe sibling on light paper — vivid cyan, lime and oxide-red all fail WCAG as type on their own ground.

**Derived values** (computed, never authored):

- Secondary ink: world ink at **74%** on dark grounds, **78%** on light.
- Muted meta: world ink at **58%** on dark, **70%** on light.
- Tint fill: accent at **8%** on light grounds, **12%** on dark.
- Card field (app feed): the world's own ground on dark worlds; accent at 9% on light worlds.
- Ghost issue number: accent at 16% (dark) / 18% (light).

No grey ramp, no second accent, no third colour on any page.

### Type — Literata only

One family (`Literata`, Google Fonts, optical sizing on, `font-variant-numeric: tabular-nums` globally). `Anek Devanagari` survives for exactly one job: the bilingual wordmark in the app, toggleable in preferences.

| Role | Web | App | Weight · tracking · line-height |
|---|---|---|---|
| Headline | 68 / 40px | 52 / 38 / 42px | 700 · −.032em · 1.02–1.05 |
| Section title | 25px | 30 / 33px | 700 · −.022em · 1.05 |
| Lede / hook | 21 / 17px | 15–17px | 300 · 0 · 1.5 |
| Prose | 18px | 15 / 16 / 18.5px | 400 · 0 · 1.68–1.72 |
| Meta / eyebrow | 10.5–11px | 9.5–10.5px | 600 · .14–.20em · uppercase |
| Stat | 40–54px | 26–46px | 700 · −.035em |
| Drop cap | 74px | 62px | 700 · line-height .76 · accent, float left |

**The italic accent word.** Every headline carries exactly one word set 400 italic in the world accent, the rest upright: *The **Trojan** horse in Parliament*. Store as three fields — `pre`, `em`, `post` — never as markup inside a string.

**Reader text size** (app preferences) scales prose only: S 15px / M 16px / L 18.5px. Headlines, meta and stats do not move.

### Space, rules, radii

| Token | Value |
|---|---|
| Hairline | 1px on the world's rule colour — list rows, card edges, table dividers, meta cells |
| Section rule | 2px on ink — used once per screen, above the reading toolbar |
| Page rule | 4px on ink — top of masthead, top of footer |
| Accent strip | 4px on accent, one edge only — primer block, followed-world row |
| Padding, web | 46 / 40px desktop; 24 / 20px phone |
| Padding, app | 20px horizontal throughout; 6–18px vertical by block |
| Radius | **0 everywhere.** The only rounded shapes are topic dots and the device bezel |
| Shadow | **None on any surface.** Elevation is a hairline, not a blur |

### Motion

Single-property, short, never decorative. **No parallax** — the brand promise is a shift of viewpoint, not background displacement.

| Event | Spec |
|---|---|
| Screen enter | opacity 0 → 1 + 10–14px rise, 280–320ms ease-out, once per entry |
| World change | background + colour cross-fade, 340ms |
| Data change | bar widths 140ms; seat fills 420ms with 5ms-per-index stagger; both `cubic-bezier(.22,1,.36,1)` |
| Plate reveal | opacity 0 → 1 + 20–22px rise, 320ms ease-out, once on first entry |
| Lens wipe | scroll-linked, not timed — the reader owns the edge |
| Live dot | opacity 1 → .35 → 1 over 2s, infinite. The only looping animation |
| Hover | border-colour rule → ink, or muted → ink on text. No lift, no scale, no shadow |
| Selected | ink fill with paper text, or accent tint with a 4px accent edge |

---

## Screens

### Website (`Parallax Web.dc.html`) — six pages

**Masthead** (all pages). 4px ink top rule. Wordmark `Parallax` at 16px/700/−.032em, desk register at 9px/600/.17em uppercase in muted. Right side: Home · Desks · Archive, a pulsing accent dot with `№ NN · live`, and a ghost Subscribe button. Collapses to a Menu button under 768px.

**Home.** Hero with the live issue's eyebrow, headline (accent word), dek, and fact rail. Below: latest-issue rows (issue number, title, dot + desk + date + read time, hairline between).

**Desk.** One world's ground, its issues listed.

**Issue.** In order: meta strip (`№ NN · date` left, Full ⇄ Skim right) → eyebrow → headline → dek → primer (4px accent strip, `The primer` label, 3–5 sentences that let a reader skip the issue honestly) → fact grid (published · reading time · sources · voice; voice set in accent) → prose with drop cap, *or* the skim block (accent tint, 3px accent left border) → **the plate** → **the lens** (politics and travel only) → data card (`— 02 · label`, ghost alt-view toggle, the graphic, `In plain terms —` caption, source line) → instrument (`— 03 · drag the year`) → reading toolbar (2px ink top rule, progress hairline, time left, Full ⇄ Skim).

**Archive.** Filter chips + issue rows.

**About.** In order: the promise hero → **the mark, explained** (168px mark, the six desk phases beneath it, and the two-paragraph premise) → three steps → the eight voices → editorial promises → **the making of the mark** (see below). Public site only.

**Subscribe.** ₹149/mo student rate, stated identically to the app's You screen.

### Reader app (`Parallax App.dc.html`) — eleven screens, 393 × 852

**Welcome** → mark at 34px + wordmark, then *Choose your worlds →* (accent fill) or *I already read here · sign in* (ghost).

**Sign in.** Magic link only. Eyebrow `Reader access`, headline *Pick up where you **left off***, email field (transparent, 1px rule border, 16px Literata, 14px/13px padding), accent CTA *Email me a sign-in link →*, footnote: no password, twenty minutes, one use. Ghost link to create an account.

**Sign up.** Name + email, accent CTA *Create my account →*, footnote on no investors/advertisers/trackers.

**Link sent.** Pulsing accent dot + `Check your inbox`, headline *The link is **on its way***, the typed address echoed back, a two-cell hairline grid (Expires `20:00` / Uses left `1`), accent CTA *Open the link →* and a ghost *Resend the link* that flips to *Sent again*.

**Worlds.** Six rows, each a dot + name + register; followed rows take an accent tint and a 4px accent left edge.

**Feed.** Cards filtered to followed worlds. Each card: full-bleed world ground, ghost issue number bled off the bottom-right corner (68px/700, accent at 16–18%), dot + desk + read time, headline with accent word, two ghost buttons — *Read →* and *60-sec cards* (the second stops propagation; the card body opens the issue).

**Archive.** Issue count + `The archive` headline, search input (title and desk, live), filter chips (All + six worlds; selected = accent tint + accent border + accent text), then rows: issue number, title, dot + desk + date + read time. Empty state names the six desks.

**Issue.** Same block order as web, at app measurements. Plate 186px, lens 210px.

**60-second cards.** Five per issue. Tick bar at the top, 40px claim over 16px consequence, tap anywhere advances.

**Knowledge check.** One question, three options, ✓ / × marks, an explanation that adds a fact rather than repeating the answer, and a reader tally.

**You.** Reading stats, then **Preferences**: text size (segmented S/M/L, ink fill on selected), open issues in Full ⇄ Skim, weekly issue email switch (Thursday 07:00 IST), Devanagari wordmark switch. Switches are 46 × 24 **square** tracks with an 18 × 18 square knob — accent track when on, transparent with a muted knob when off. Then the subscription block (accent border, tint fill, ₹149/mo).

**Tab bar:** Feed · Archive · Worlds · You.

---

## The two image treatments

Both are scroll-linked. Neither displaces a photograph behind its frame.

**The plate** — the default, one per issue. Prose width, 1px frame with 6–8px inset padding. Caption row underneath: plate number and subject on the left, source on the right, both 9–10px/600/.14–.15em uppercase muted. Fades 0 → 1 with a 20–22px rise as it reaches the lower third of the viewport, once, never on the way back up.

Per-world captions and sources currently in the prototypes: politics *Plate 02 · the chamber, empty* / PIB · space *Plate 03 · 2024 YR4, first light* / ATLAS Chile · earth *Plate 02 · the Pacific, from above* / Copernicus · tech *Plate 01 · the invoice* / Parallax · travel *Plate 01 · the South Col route* / Field journal · sports *Plate 04 · the block, matchday 38* / Parallax.

**The lens** — conditional. Two viewpoints of one subject in a single frame. Scroll drives a `clip-path: inset(0 0 0 N%)` wipe across the top image, trailed by a 2px accent line at the same offset. An ink-filled caption block bottom-left names the pair. Currently travel (*1996 ⇄ 2019 · same ridge*) and politics (*1976 ⇄ 2031 · same house*); the other four worlds run the plate alone.

**Scroll mapping** (both): progress `p = clamp01((scrollerTop + scrollerHeight × 0.72–0.78 − figureTop) / (scrollerHeight × 0.40–0.42))`. Plate opacity `min(1, p × 1.8)`. Wipe offset `clamp01((p − 0.05) / 0.5) × 100%`.

**Placement.** After the opening prose, before the data card — the picture establishes the scene, the graphic then argues about it. Sizes: web 300px plate / 320px lens at the 720px prose column; app 186px / 210px at 20px margins. Never bleeds past the reading column.

**Tone.** Warm for politics, earth, travel. Moonlit blue for space. Near-black with a lime cast for tech. Pitch green for sports.

**Colour vs black and white.** Colour is preferred and is the default for every editorial plate — it carries the world palette into the picture. Black and white is permitted where the frame earns it: portraits, archival images, or a subject whose colour adds nothing. Per picture, never a house style; a b&w plate keeps the same hairline frame and the same caption. No grain filters, no press stock. *(This relaxes the design system's blanket "no b&w" rule — a deliberate, recorded deviation.)*

Two further treatments were explored and **held back** — an *aperture* (full-bleed frame opening from a letterbox band) and an *overlay* (the issue's figure drawn onto the photograph in accent). Both work and both are in turn 8 of `Parallax Revamp.dc.html`; neither is in the shipping system.

---

## The lore section (About page)

The mark took six rounds. Every discarded draft was discarded for a reason, and the reasons are published to readers as the argument for what survived. Rendered as six rows: number, 64px thumbnail of the draft, title + description, and a verdict column (`Discarded` in muted, `Kept, reassigned` and `Adopted` in accent).

| # | Draft | Verdict |
|---|---|---|
| 01 | **Two offset squares** — displacement said with one outlined and one filled rectangle | Discarded: legible at any size and completely anonymous |
| 02 | **The observatory seal** — a full stellar-parallax diagram in a ring of type | Discarded: correct and unreadable; a reader should not have to be taught a diagram |
| 03 | **The lens assembly** — an optics-catalogue plate, parallel light in, two focal points out | Kept, reassigned: it is the About-page and onboarding illustration, not a logo |
| 04 | **The eclipse** — two discs of one size, moved apart by a step | Kept in principle: the idea was right, the disc was empty |
| 05 | **The letter, four ways** — P inset, reversed, fused to the ring, and in front of it | Discarded: clever lost to legible |
| 06 | **The phase medallion** — crescent inside the rim, letter in the calm middle | **Adopted** |

Closing line, verbatim: *"What survived is four concentric circles, one dial position and one letter. Nothing in it is decoration, and nothing in it needs the story above in order to be read — which is the only test a mark has to pass."*

Full exploration with every rejected variant lives in `design/Parallax Marks.dc.html`.

---

## Interactions & behaviour

- **Full ⇄ Skim.** Cross-fades the prose block against the skim block. Persisted in app preferences; a per-session toggle on the web.
- **Data card alt view.** One ghost toggle per graphic, switching between two readings of the same figures (e.g. absolute vs per-capita). Bars animate 140ms.
- **Instrument (politics).** A slider the reader drags; two proportion bars and a claim sentence that rewrites itself at three thresholds.
- **60-second cards.** Tap anywhere advances; the tick bar fills. Entered from a feed card's second ghost button, which must stop propagation — the card body's own handler opens the full issue.
- **Archive search.** Live, case-insensitive, matches title and desk name. Combined with the chip filter (AND).
- **Knowledge check.** Options lock after the first pick; the explanation is revealed with the mark.
- **Responsive (web).** Single breakpoint at 768px: masthead collapses to a Menu button, padding drops to 24/20px, headline 68px → 40px, lede 21px → 17px.

## State

Website: `page`, `world`, `mode` (full/skim), `alt` (per data card), `menu`, `year` (instrument), `filter`, `q`.

App: `screen`, `world`, `followed[]`, `mode`, `alt`, `storyIdx`, `quiz`, `q`, `filter`, `tsize`, `weekly`, `bili`, `email`, `name`, `resent`.

Data fetching: issues, archive catalogue, and per-issue figures. Auth is magic-link — request link, verify token, establish session.

## Assets

**Fonts.** Literata and Anek Devanagari, both Google Fonts CDN. No local binaries.

**Icons.** None. The vocabulary is coloured dots (8–10px), hairline rules, unicode arrows (`→ ← ×`), `— 01` section ornaments, and metadata glyphs (`№ ° · ™ _`). No emoji anywhere.

**Photography.** Not yet supplied. Every image position in both prototypes is an `<image-slot>` drop zone with a placeholder describing what belongs there; the real photographs are the outstanding dependency.

## Migration plan

The revamp must land without breaking the live product. Ship in this order; each phase is independently releasable and reversible.

### Phase 0 — foundations, no visible change

1. Add the six world records as one data structure (ground, ink, accent, accent-deep, rule, on-accent, dial angle). Replace every hard-coded colour with a lookup. **Nothing should look different when this ships.**
2. Add `Literata` alongside the existing families. Do not remove anything yet.
3. Add `brand/` to the asset pipeline.

*Rollback: revert the colour lookup; no user-visible surface changed.*

### Phase 1 — the mark

4. Ship the inline-SVG mark component (props: `desk`, `size`, `cut`). Swap masthead, footer and app header.
5. Swap `favicon.svg`, `app-icon.svg`, the social banners and the OG share cards.

*Watch: favicon and OG images are cached hard by browsers and social platforms. Bust the URL. Rollback is a file swap.*

### Phase 2 — typography

6. Switch body and display to Literata, role by role, using the type table above. Keep `Anek Devanagari` for the app wordmark.
7. Remove the retired families from the font loader **only after** step 6 is verified on every page kind.

*Watch: measure line lengths after the switch — Literata sets wider than the outgoing body face. The 720px prose column and ~60ch optimum still hold, but per-page overflow (tables, mastheads, chips) needs a pass.*

*Rollback: font-family swap. Sizes and tracking in the type table are Literata-specific — reverting type without reverting the scale will look wrong.*

### Phase 3 — components

8. Primer, fact grid, data card, number block, reading toolbar. These are additive; existing MDX keeps rendering.
9. Then the per-issue instruments, one desk at a time.

*Watch: the data card requires a caption (`In plain terms —`) and a source line. A graphic without both is a spec violation, not a stub.*

### Phase 4 — imagery

10. Ship the plate on all six desks. Frames can go live empty — `<image-slot>` in the prototypes is a placeholder, not a component to port.
11. Ship the lens only where a genuine pair exists (currently travel and politics).

*Watch: scroll handlers must be passive and must no-op when the element is disconnected. Honour `prefers-reduced-motion` by rendering both figures at their end state.*

### Phase 5 — app surfaces

12. Auth (magic link), archive with search, preferences.
13. Then 60-second cards and knowledge checks.

*Watch: text-size preference scales prose only. Persist it server-side with the account, not in local storage alone.*

### Non-negotiables through every phase

- **No parallax displacement anywhere.** It is the one effect this brand forbids by name.
- **One accent per surface**; never a third colour on a page.
- **Radius 0, shadow none** on every surface.
- **The dial angles never move.** Six stations, 60° apart, politics at 325°.
- **One italic accent word per headline**, stored as `pre` / `em` / `post`.
- **No emoji**, anywhere, ever.

---

## For an agent working from this handoff

If you are a model extending this design rather than a person reading it:

- **Derive, do not invent.** Every colour comes from a world record; every mark from the construction in **The brand mark**; every type size from the role table. If a value you need is not in this document, it is either derived (the formulas are given) or it does not exist yet — say so rather than inventing one.
- **The prototypes are the tiebreaker.** Where this README and `design/*.dc.html` disagree, the prototypes win; they are the measured source. Open them in a browser.
- **`.dc.html` structure is not portable.** `<sc-for>`, `<sc-if>`, `{{ }}` holes and `support.js` belong to the design tool. Read the *values* — hex codes, px, ms, easing, copy — and rebuild in the target framework's idiom.
- **Regenerate assets, never hand-edit them.** The 32 SVGs in `brand/` are output. Changing one by hand desynchronises it from the construction.
- **New desk?** It needs a dial angle. Six desks sit 60° apart; a seventh means re-spacing all seven, which is a brand decision, not an implementation one. Escalate.
- **New surface?** Pick the cut by size and medium: outline ≥ 24px on screen, reversed < 24px or as a seal, cover for print only.
- **Copy is voice-bound.** Third-person observational, sentence case, one em-dash per paragraph maximum, no "It is not X, it is Y" reframes, no abstract-noun labels. The eight rhetorical modes are listed on the About page and in the spec.
- **When something is missing, add it to Known gaps** rather than filling it with a plausible invention.
- **A figure's prose must match its data.** The "In plain terms" sentence is checked against what the chart actually renders — if you change a data array, re-read the sentence. A caption asserting a number the graphic contradicts is a worse failure than a missing caption.
- **Pick a component size before designing it.** Decide S/M/L against the budget above, then fit the data to the size. Fitting the size to the data is how a 720px column ends up with a 1400px chart in it.

---

## Known gaps

1. **Photography.** Treatments specified and built; the frames are empty.
2. **Account recovery and sign-out.** Sign in, sign up and link-sent exist; expired-link and sign-out states do not.
3. **Archive depth.** Eight issues against a stated twenty-four — sixteen need real front matter.
4. **Instruments.** All six worlds now carry ten instruments each — 60 in total, every one with the full explainability contract. Each desk has at least one reader-driven control; whether every instrument needs one is an editorial call.
