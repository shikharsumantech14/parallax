# Lens — the Parallax design system

> **Law from 2026-09-30.** The operator's design revamp of 2026-09-29/30,
> approved on the Design canvas
> (<https://claude.ai/artifact/AhFSGExFKxhc9HNHw5CnRH>, private; boards
> Foundations, Home, Desk, Issue, the library and Motion). Written for an agent
> or an engineer building a screen: every value below is the one to use.
>
> **Supersedes** `docs/design/CANON.md` (every visual rule) and
> `docs/design/motion.md` (the whole vocabulary). Both keep their bodies,
> archived under a header that points here. The correctness rulings they held
> carry into this file (§1.2 says where each one landed).
>
> **Authority, when documents disagree:** the approved canvas board > this file
> > a component's blueprint > `catalog.md` > anything older. When a rule here
> conflicts with the canvas, the canvas wins and this file is corrected in the
> same change.
>
> **What renders today.** This file is the target; the code reaches it phase by
> phase (§11). Until a phase lands, the launch design still renders: Literata,
> square corners, the 720 measure, the how-to-read panel. Do not patch the old
> shell toward Lens piecemeal outside the plan, and do not "restore" an old rule
> because the page still shows it.

---

## 1. What Lens is

**Modern editorial data journalism.** Calm warm paper, a confident serif for
headlines and the article, a crisp sans for every number and label, generous
space, and graphics that build in beats so the sentence and the mark arrive
together. Not gimmicky.

### 1.1 The five principles (every screen obeys them)

1. **One ground.** Every desk sits on the same warm paper. A desk's colour
   lives in its marks, rules, chips, data and ONE bounded plate (§8). Never a
   whole page in a desk colour.
2. **The graphic explains itself.** The reading system (§5): the article's own
   sentences carry numbered cues that light the part of the figure they name.
   No how-to-read panel, no "in plain terms" line, no expand modal as a
   prerequisite. The caption is the finding, stated once, in ink.
3. **Hierarchy before density.** One thing to read first on every screen: the
   headline, then the finding, then the detail. Numbers that matter are big
   (§7); labels are small but never below 12px.
4. **Motion is a reveal, not decoration.** One orchestrated build per graphic
   (§6). Hover changes colour, border or shadow, never size. Reduced motion
   shows the final state.
5. **Everything clickable looks clickable.** Cards lift by border and shadow on
   hover, links carry an arrow or an underline, buttons are buttons.

**Never:** gradient washes, glassmorphism, glow, bloom, emoji, left-border
accent cards (the primer band's 2px rule, §5.4, is the one sanctioned rule),
spring or bounce easing, scroll-jacking on an article page, Inter, Roboto,
Arial as a chosen face, Fraunces, stock icon libraries. Icons are bespoke
inline stroke SVG.

### 1.2 What carries over from CANON and motion.md

These were correctness rulings, not taste, and they bind under Lens:

| Ruling (old home) | Where it lives now |
|---|---|
| **Photography rejected**, no raster covers, no AI imagery (CANON §1, AGENTS §5 "No raster imagery") | §1.1 and §9: the `plate` kind was dropped. Covers are drawn: a section in stage mode (§8), never a photograph |
| **The accessibility floor** (CANON §5 minimums, §9 touch, §13 checks 1–3) | §3.4 (12px rendered floor, 4.5:1), §4.2 (44px targets, focus ring), §5.6 and §6.4 (no-JS and reduced motion paint the final state) |
| **RD-01b, in-SVG text uses a literal font stack** (CANON §5) | §3.3 |
| **The motion budget** (motion.md hard rules: no overshoot, one entrance per element, one ambient loop per viewport, the stagger ceiling) | §6.5 |
| **The reading gate** (CANON §12, `.claude/rules/js-budget.md`): the free allowance includes at least one graphic, and `.px-section` counting is preserved by any issue-page rebuild | §5.7 |
| **Honesty defaults** (CANON §7): a log scale, a compressed distance or an exaggerated vertical is stated in the caption; count-ups tween to the value already in the HTML | §5.5 and §6.2 |
| **Fallback first** (CANON §8): no JS, reduced motion and missing WebGL each paint a composed final state | §5.6, §6.4, §8 |
| **The line-art doctrine for WebGL** (CANON §4: basic materials only, no runtime lights, no bloom, baked shading at most; the silhouette test) | §8.3 |
| **Touch is sacred** (CANON §9): `touch-action: pan-y`, no gesture hijacking, everything readable without interacting | §5.3 and §4.2 |

Everything else in CANON (Literata and the trio, zero radius, flat surfaces,
`--viz-edge`, the four-layer comprehension stack, the one-panel rule, the ⤢
study view, the act-structure ratios, the per-world type) is retired (§10).

---

## 2. Tokens

The values are fixed here. The CSS plumbing (which file declares each
variable, the legacy aliases components still read, what `design:check`
mirrors) is Phase 1's: `shared/design/tokens.css`, `shared/design/worlds.css`
and `docs/design/TOKEN-RECORD.md` TD-09, which records how the legacy names
(`--accent`, `--accent-deep`, `--bg`, `--rule`, …) were re-pointed onto this
palette. A component names a ROLE, never a hex.

### 2.1 Neutrals: one paper under every desk

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F5F2EB` | every page |
| `--paper-2` | `#FBFAF6` | cards, inputs, the pinned figure panel |
| `--paper-3` | `#EDE9DF` | wells, the neutral chip, the primer band |
| `--ink` | `#16140F` | text, the primary button, a strong rule |
| `--ink-2` | `#4A463D` | secondary text |
| `--muted` | `#6B665B` | captions, labels, the source line (passes 4.5:1 on paper; never lighter) |
| `--hair` | `#DCD7CB` | rules, card borders |
| `--hair-2` | `#C9C3B4` | axes, the input border |

### 2.2 The six desk inks

Each desk has four values, and each value has one job:

- **text**: words in the desk colour. ≥ 4.5:1 on paper. Eyebrows, the italic
  emphasis word, desk buttons (as the fill), chips (as the label).
- **mark**: fills, lines, the data. Never small text. The cue disc's fill.
- **tint**: bands and chips (as the fill), the lit-cue band.
- **deep**: the plate (§8). Never a page.

| Desk | Register | text | mark | tint | deep | text on paper |
|---|---|---|---|---|---|---|
| politics | Politics desk | `#A02D18` | `#C8412A` | `#F6E4DF` | `#2A1410` | 6.51:1 |
| space | Mission control | `#0C6A8C` | `#1B9AC4` | `#DCEEF5` | `#0B1B33` | 5.43:1 |
| earth | Field atlas | `#176357` | `#22897A` | `#DCEFEA` | `#0F2A25` | 6.35:1 |
| tech | Changelog | `#566E0F` | `#86A81B` | `#ECF1D3` | `#111111` | 5.17:1 |
| travel | Field journal | `#9C5A14` | `#C97C22` | `#F8EAD5` | `#2C1D10` | 4.83:1 |
| sports | Match programme | `#33691E` | `#5A9E2F` | `#E3F0DA` | `#0F2820` | 5.91:1 |

**The two limes** (`--tec-lime #C6F432`, `--spo-lime #E8F048`) are marks on
their own desk's deep plate only: never text, never on paper.

**The house** (home, about, archive, subscribe, the account pages) is ink on
paper with the politics inks as its accent, because the house cut of the mark
is the politics station (§4.3). A house page shows a desk's colour only where
it shows that desk's content (a desk card, a cover).

**Colour law.**
- Small text in a desk colour uses **text**, never **mark**. A fill that
  carries text uses **text** (the old TD-06, now true on every desk because
  every desk is on paper).
- A graphic's primary marks use **mark**; secondary series use `--ink-2` or a
  darkened tint; grid lines `--hair`; axis text `--muted`.
- A fixed data encoding (the warming ramp, a win/loss pair, a party's colour
  from the section's data) is exempt from theming and is declared in the
  component's blueprint.
- On a deep plate, text is `--on-deep` / `--on-deep-2`, rules are
  `--on-deep-hair`, marks are the desk **mark** (or the lime on tech and
  sports). Never a desk text colour on the plate.
- No new brand colour, ever.

### 2.3 On a deep plate

| Token | Value |
|---|---|
| `--on-deep` | `#F5F2EB` |
| `--on-deep-2` | `rgba(245,242,235,.72)` |
| `--on-deep-hair` | `rgba(245,242,235,.18)` |

### 2.4 Radius, elevation, space

| Token | Value | Use |
|---|---|---|
| `--r-card` | 6px | cards, the pinned figure panel, the plate |
| `--r-ctl` | 4px | buttons, inputs |
| `--r-chip` | 999px | chips (28px tall), the cue disc, dots, the medallion |
| `--shadow-1` | `0 1px 2px rgba(22,20,15,.06), 0 6px 20px rgba(22,20,15,.06)` | every clickable card at rest |
| `--shadow-2` | `0 2px 4px rgba(22,20,15,.08), 0 16px 40px rgba(22,20,15,.10)` | the same card on hover, with an ink border |

**Space** is a multiple of 8: 8 base · 16 stack · 24 gutter and card padding
· 32 block · 48 group · 64 side margin and the phone section gap · 96 the
desktop section gap. Card padding 24 desktop, 20 phone.

---

## 3. Type

### 3.1 Two faces

- **Newsreader** (serif) for display and the article: headlines, section
  titles, prose, captions, the italic emphasis word. Weights 400 / 500 / 600,
  italic 400 / 500, optical sizes 6–72.
- **Instrument Sans** (sans) for UI and every number: navigation, buttons,
  labels, chips, axes, values, the source line. Weights 400 / 500 / 600,
  italic 400.

```css
--font-display: 'Newsreader', Georgia, 'Times New Roman', serif;
--font-ui:      'Instrument Sans', 'Helvetica Neue', Arial, sans-serif;
```

Loaded from Google Fonts:
`https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap`.
The share-card renderer (satori/resvg) cannot load Google Fonts: it renders on
static files of both faces fetched by `scripts/fetch-fonts.mjs` (Phase 1).

The role tokens map as: `--font-display` and `--font-body` → Newsreader,
`--font-ui` and the legacy `--font-mono` (labels, numerals) → Instrument
Sans. The P inside the medallion
is an OUTLINE traced from Literata (`src/lib/mark-glyph.ts`), a drawing, not
live text: retiring Literata as a face does not touch the mark.

### 3.2 The scale

| Role | Face and setting |
|---|---|
| H1 | Newsreader 500, 64/1.02, −0.01em; phone 40/1.06. The issue head is 72/1.02 (§5.4) |
| H2 | Newsreader 500, 40/1.08 |
| H3 | Newsreader 500, 28/1.15 |
| Section title | Newsreader 500, 30/1.12 |
| Prose | Newsreader 400, 19/1.6 on a standalone page (measure ≤ 68ch, 720 max); 18/1.6 in the reading system's 620 column and on phones. Ink. |
| Hook / lede | Newsreader 400, 22 |
| Caption (the finding) | Newsreader 17, italic, ink |
| Emphasis | Newsreader italic 500, the one authored `*word*` of a headline, in the desk **text** colour. One per title |
| UI | Instrument Sans 400, 15/1.5 |
| Label / eyebrow | Instrument Sans 500, 12–13, UPPERCASE, letter-spacing .06em, `--muted` or the desk **text** colour |
| Button | Instrument Sans 600, 15 |
| Numbers | Instrument Sans 600, `font-variant-numeric: tabular-nums`, the tiers in §7 |
| Source line | Instrument Sans 13, `--muted`: `Source · <label> · <date>`, the label a link |

Numerals are tabular everywhere. Headlines are set ragged (no justification).

### 3.3 Text inside an SVG (RD-01b, carried)

In-SVG `<text>` takes a **literal** font stack in a `style` attribute, never
`var()` and never a presentation attribute:
`style="font-family:'Instrument Sans','Helvetica Neue',Arial,sans-serif"`
(Newsreader for an in-figure editorial callout). A presentation attribute loses
to any stylesheet rule, and satori/resvg do no `var()` substitution. The
standing grep in `AGENTS.md` §8 stays at zero.

### 3.4 The floor

- **Never below 12px rendered**, on any viewport, in HTML or in an SVG. (The
  old floor was 9.5px; Lens raises it.) A chart that cannot hold 12px at 375
  redraws its labels (≤ 3 words, §5.5) or scrolls inside its card; it never
  shrinks the type.
- Caption and label grey is `--muted` and passes 4.5:1. Nothing lighter
  carries words.

---

## 4. Layout, the parts, the mark

### 4.1 The frame

- **Desktop:** a 1280 frame, a **1152 content column**, **64px side
  margins**, 12 columns on 24px gutters.
- **Phone:** 390 design width, **20px side margins**, one column. No
  horizontal page scroll, ever (the honest test in `AGENTS.md` §8).
- Vertical rhythm on 8. Sections 96 apart on desktop, 64 on phones.
- A page is a stack of bands on the one paper, split by 1px `--hair` rules.
  A strong rule is 2px ink.

The old 1280 no-padding frame, the 170 / 1fr / 250 floor plan and the 720
measure with its 45px breakout are retired. The issue page's geometry is §5.

### 4.2 The parts (the Foundations board)

- **Card:** `--paper-2` fill, 1px `--hair` border, `--r-card`,
  `--shadow-1`. Hover: border `--ink`, `--shadow-2`, over 160ms. A card
  never translates or scales. Padding 24 / 20.
- **Buttons:** 44px tall, `--r-ctl`, Instrument Sans 15/600.
  Primary: ink fill, paper text. Secondary: 1px ink border on paper. Desk:
  the desk **text** colour as the fill, paper text. Disabled: `--hair` fill,
  `--muted` text.
- **Link:** ink, underlined or carrying an arrow (`Read the issue →`); hover
  takes the desk (or house) text colour.
- **Chip:** 28px tall, `--r-chip`, 12px label, the desk **tint** fill and
  **text** label. The neutral chip is `--paper-3` with `--muted`. A chip that
  is a control is a real `<button>` with `aria-pressed`, and its hit area is
  44px on touch.
- **Input:** 44px, `--paper-2`, 1px `--hair-2` border, `--r-ctl`; focused, a
  2px ink outline at 2px offset.
- **Focus:** every control shows a visible 2px ink focus ring at 2px offset.
  Touch targets are ≥ 44px. Icon-only controls carry an `aria-label`.
- **Stat tile:** a label, one number at 48 (§7), one note line, the source
  line.
- **Masthead:** 64px, paper, a 1px hair rule under it. Left the lockup
  (§4.3); right the nav Home · Desks · Archive · About in Instrument Sans
  14/500, a "Sign in" text link and a primary "Subscribe". On a desk page the
  register follows the wordmark. On a deep plate the masthead reverses to
  `--on-deep`.
- **Footer:** the same lockup at 28px, the legal line, the "no analytics, no
  cookies, no trackers" line.
- **The cover card** (Phase 2, `core/CoverCard.astro`): the graphic-dominant
  issue card on Home, Desk, Archive, the Shelf and Subscribe. It draws the
  issue's cover mark (§8) with its caption; a graphic never appears without
  the line that says what it shows.

### 4.3 The mark and the lockup (BRIEF-3 §1, BRIEF-5 §1)

**The mark is the phase medallion (RD-10), unchanged.** Lens re-sizes its
lockup and nothing else. Four concentric shapes on a 300-unit box: the desk's
accent disc r110 at the centre; a ground-coloured disc r113 pushed 15 units
along the desk's dial station (the crescent it leaves is the mark); an ink
ring r118 (stroke 7 at ≥ 96px, 10 at ≥ 40, 14 below); and the letter P,
outlined, in the calm middle. Six fixed stations, 60° apart: politics 325°,
space 25°, earth 85°, tech 145°, travel 205°, sports 265°. The house cut is
the politics station in the oxide accent.

- **Cuts:** `mark` (open, the default), `seal` (ink disc behind the crescent,
  paper P: a selected state, a share card), `reversed` (ink disc and a paper
  P, automatic below 24px, e.g. the favicon).
- **Every desk mark at 24px and above shows the P** (the phase-only cut is
  retired on every surface; BRIEF-5 §1). Below 24px, the reversed cut.
- **On a deep plate** the ground disc takes the plate's deep colour and the
  ring and P take `--on-deep`.
- **Misuse (binding):** no gradient or sphere shading, no off-station dial, no
  rotation, no second accent, no substitute letter, no drop shadow, never
  smaller than 16px, never the reversed cut above 24px.
- **Use `core/Mark.astro` (props `desk`, `size`, `cut`, `tight`, `ring`) over
  `src/lib/mark.ts`. Never paste SVG bodies.**

**The lockup.** The mark TIGHT (viewBox trimmed to the ring) at a **34px
disc with ring 9**, a **12px gap**, then "Parallax" in **Newsreader 500
24px** with its cap centre on the disc centre; on a desk page the register
("Mission control") in 13px capitals in the desk **text** colour. The footer
uses the same lockup at 28px. A standalone mark (About, icons, the intro)
keeps the full 300 box. The About page tells the mark's story verbatim ("six
drafts, and the one survivor"); its copy is the operator's and is not edited.

---

## 5. The reading system: the article stays, the picture explains it

The operator's ruling (BRIEF-3 §2): "People who like to read can read, and
while reading they can just look at the picture and understand. Not too much
text ON the components." So a section is **prose beside a pinned picture,
joined by cues.** Built in Lens Phase 3.

### 5.1 The two columns

- **Desktop:** a 1164 band of **620 article column + 24 gap + 520 figure
  panel**, with the progress rail in the left margin. LEFT, the section's full
  text in the Parallax voice (eyebrow, title, intro, prose paragraphs), prose
  18/1.6. RIGHT, the **pinned figure panel**: `--paper-2`, 1px hair, 6px
  radius, `--shadow-1`, padding 20 / 24, `position: sticky; top: 24px` while
  its section is in view. The panel carries a small header ("Figure 3 · 4
  cues", a "Show all" control), the graphic, ONE caption sentence (the
  finding, Newsreader 17 italic) and the source line.
- **Phone:** the figure pins at the top of the viewport (about 40% of the
  height) with its cues; the prose scrolls beneath it; tapping a cue lights
  its mark above.
- A section with no graphic (the narrative kinds: `act-break`, `prose`,
  `quote`, `analogy`, `jargon-buster`, `three-steps`) runs in the article
  column with no panel.

### 5.2 The cue contract

The data shape (the schema field lands in Phase 3; the schema has no `cues`
yet):

```yaml
sections:
  - kind: benchmark-chart
    title: "Forest's whole case took 113 days"
    intro: "The calendar showed one case finished and another still open. [[1]] Forest's case, appeal included, took 113 days. [[2]] City's first stage has run 1,330 days and has not stopped."
    cues:
      - { n: 1, at: "forest", text: "Forest's case, appeal included, took 113 days." }
      - { n: 2, at: "city",   text: "City's first stage has run 1,330 days and has not stopped." }
```

- **`cues: [{ n, at, text }]`**: `n` is the numeral (1–4), `at` names an
  ANCHOR the component exposes, `text` is the cue's sentence (the caption the
  panel shows while that cue is lit). Every cue sentence is a data claim, and
  the verifier traces it like a caption.
- **`[[n]]` in any prose field** (`intro`, a prose paragraph, a `followup`)
  renders as the cue button inline, before the sentence it belongs to. The
  example is illustrative: the exact field list is Phase 3's schema change. A marker with no matching cue, or a cue with no
  anchor in the figure, is a render-gate failure (Phase 5 adds the check).
- **Anchors:** every component exposes its cue anchors as `data-cue="<at>"`
  on the element a cue can name (a bar, a dot, a row, a band), and the SAME
  numeral beside that element in the figure (literal SVG text or an HTML
  overlay). The catalog lists each kind's anchors on a `CUES:` line (Phase 7).
- **Two to four cues per graphic section.** None on the narrative kinds.
- **The cue button:** a real `<button>`, a 20px disc, desk **mark** fill,
  paper numeral in Instrument Sans 600 12, `aria-pressed`, `aria-label="Cue
  n: light it on the graphic"`.

### 5.3 Lighting

- Pressing a cue (or scrolling its sentence past the reading line) **lights**
  its anchor: the lit element at opacity 1, every other cue-able element at
  .35, a 2px desk-colour ring fading in on the lit element, over 160ms. Nothing
  scales. The panel's caption switches to that cue's `text`.
- "Show all" returns every element to full and the caption to the section's
  finding.
- **Section 1 autoplays its cues once** (cue 1, then 2, …), then rests on
  "show all". No other section autoplays.
- The island that does this is `cues.ts` (§5.6), about 2 KB. No component
  animates its own lighting.

### 5.4 The issue head (BRIEF-5 §3)

Full 1152 width. Row 1, columns 8 / 4: LEFT the eyebrow ("MATCH PROGRAMME ·
No 17"), the headline at Newsreader 72/1.02 (the italic word in the desk text
colour), the hook at 22px, then the facts as one hairline row of four cells
(Published · Reading time · Sources · Sections). RIGHT a `--paper-2` card "In
this issue": the sections as a numbered list (01–09, the section name, 15px),
the current one marked with the desk dot, a 3px progress bar and a "Start
reading" desk button. Row 2, the primer band ("Before you start") full width
on `--paper-3` with a 2px desk-mark left rule, its label in a 200px column.
Phone: the card collapses to an "In this issue · 9 sections" row under the
facts. The progress rail's names match the card's list exactly.

### 5.5 Calm components

The figure carries the explanation, so the component is quiet:

- labels of **at most three words**; ONE number set large (§7), the rest 13px;
- a legend only where colour carries meaning;
- the figure takes ≥ 55% of the section's area on a library board;
- no in-component how-to-read, no plain line, no caption of its own under a
  spelling the shell cannot see, no source line (the panel owns both);
- honesty stays in the caption: a log scale, a compressed distance, an
  exaggerated vertical or a time compression ("1s = 30 days") is stated there.

The component contract of `AGENTS.md` §7 still holds in full: text cells
wrap, outward SVG labels wrap or are budgeted, no control floats over content
on touch, copy is desk-neutral, values size to their cell, graphic containers
never end in `__cap` / `__src`.

### 5.6 The two islands

Lens adds exactly two islands, both small ES modules loaded once per page,
neither `is:inline` (so Vite bundles them), neither shipping any library:

- **`cues.ts`** (Phase 3): the lighting in §5.3.
- **`build.ts`** (Phase 5): the build in §6.3.

Both honour the fallback contract: with no JS every cue-able element is at
full opacity, every numeral is visible, every build is in its final state; the
cue buttons are present and inert, and the caption shows the finding.

### 5.7 The reading gate (carried)

`core/ReadingGate.astro` keeps counting `.px-section` elements, and the free
allowance still includes at least one graphic. The Phase 3 rebuild of
`core/Section.astro` either preserves that counting or reworks the gate in
the same commit.

---

## 6. Motion: one grammar (BRIEF-4 §1)

### 6.1 Two easings, five durations

| Token | Value | For |
|---|---|---|
| `--ease` | `cubic-bezier(.22,1,.36,1)` | entrances and builds |
| `--ease-move` | `cubic-bezier(.65,0,.35,1)` | things that move across space: a head along a path, a needle, a sliding card |
| `linear` | | physical loops only (an orbiting dot) |
| micro | 160ms | hover, a cue lighting up |
| element | 420ms | a mark, a label, a line of text |
| build | 900ms | a bar, a ring, a group |
| long draw | 1400ms | an axis or spiral drawing, a counter |
| scene | ≤ 4500ms | a whole scene, first mark to last |
| stagger | 80ms | between siblings |

Nothing else. (The Home hero alone runs at 1.6× these, a scene of about 5s;
BRIEF-5 §2.)

### 6.2 The builds

- **Overlap, never cuts.** The next beat begins when the previous is about
  70% through. Between scenes, a 200ms fade out, then the next build.
- **Counters** run on `requestAnimationFrame`, ease-out cubic
  `1 − (1 − t)³`, over 1400ms, tabular HTML text, tweening to the value
  already in the HTML. Never a `setTimeout` ladder.
- **Lines draw** by `stroke-dasharray` / `stroke-dashoffset` over 1400ms on
  `--ease`; a head or marker rides the end on `--ease-move`.
- **Bars and rings grow** by `transform: scaleX()` / `scaleY()` from a set
  `transform-origin`, 900ms. Never by animating `width`, `height` or `r`.
- **Marks drop:** opacity 0 → 1 and `translateY(-6px)` → 0, 420ms, staggered
  80ms.
- **Lighting:** §5.3.
- **Text arrives last**, rising 8px over 420ms.
- **Replay:** everything fades to its start state over 200ms, then the build
  runs again.

### 6.3 One build island

`build.ts` (Phase 5): an IntersectionObserver starts a component's build when
it enters; components declare order with `data-build="1..n"`; the island runs
counters, draws, grows and drops by the rules above. **No component animates
itself.** The classes are one vocabulary everywhere: `.rise`, `.draw`,
`.grow-x`, `.grow-y`, `.drop`, `.lit`, `.dim`.

### 6.4 Reduced motion and no JS

`prefers-reduced-motion: reduce` paints the final state: no movement, every
cue readable, loops become stills. No JS paints the same final state (hidden
start states live behind `html.js`). Print does the same.

### 6.5 The budget (carried from motion.md)

- No overshoot, ever: no cubic-bezier with y > 1, no spring.
- One entrance per element; nothing re-animates on scroll-up.
- A graphic's whole build lands inside the scene ceiling (4.5s).
- At most one ambient loop (a WebGL scene's idle drift, an orbit) and one
  pulse per viewport; loops pause off-screen.
- Hover never moves layout: colour, border and shadow only.

---

## 7. The number scale (BRIEF-4 §2)

| Where | Size |
|---|---|
| Stage counter, home or desk hero, desktop | **160** |
| Stage counter, phone | **88** |
| Pinned figure headline number | **96** |
| Secondary figures in a panel | **48** |
| Cover card and desk card numbers | **40** |
| Stat tiles, the Shelf's rings | **48** |
| Tiers for everything else | 20 / 32 / 48 / 96 / 160 |

Instrument Sans 600, tabular. A number's line-height is 0.92 and its label
(13–14px) sits 8px below it. Where a number shrinks, the space it leaves goes
to the graphic, never to more text.

---

## 8. The stage: the deep plate

### 8.1 What it is

The ONE bounded band per desk where the desk's **deep** colour is the
ground: a hero, a cover, a WebGL scene. It is a card-radius (6px) plate
inside the paper page, never a whole page and never a page background. The
old dark desk grounds (space navy, tech black, sports pine) survive only
here.

### 8.2 Its rules

- Text `--on-deep` and `--on-deep-2`; rules `--on-deep-hair`.
- Marks in the desk **mark**, or the lime on tech and sports.
- The masthead, when it sits on a plate, reverses; the mark takes its on-deep
  body (§4.3).
- **Cover scenes** (Phase 4): the Home hero is a section rendered in stage
  mode: `cover: { section, number, label }` in the issue frontmatter picks the
  section and the one number (160 desktop, 88 phone).
- Contrast on the plate is checked like on paper: every word ≥ 4.5:1.

### 8.3 WebGL on the plate

The ten WebGL kinds draw on their desk's plate. The line-art doctrine carries
(CANON §4): basic materials only, no runtime lights, no shadows, no
environment maps, no bloom or postprocessing; a baked hillshade or a data
tint is the most a fill may carry; every scene passes the silhouette test (a
paused frame is a legible diagram). Cue anchors live on the static fallback
SVG, not in the scene, so no-WebGL and reduced-motion readers get every cue.
A scene still lazy-loads `three` only on scroll-in
(`.claude/rules/viz3d.md`).

---

## 9. The library: 87 kinds (the verdict, 2026-09-30)

The operator took the Verdict board as recommended: 81 keep, 10 change, 10
drop, from 101.

- **Dropped (10), gone from `SECTION_KINDS`, the catalog, every registry and
  `src/components`:** `beat-sheet`, `plate`, `orbital-shells`,
  `elevation-profile`, `coalition-orbit`, `ballot-flow`, `orbit-globe`,
  `signal-readout`, `data-globe`, `route-globe`. A section naming one fails
  the build. No published issue used one; the showcase drafts that did lost
  those sections.
- **Folded (4) into a host, and renamed (2):** `carbon-gauge` is now
  **`gauge`**, with `swing-dial` and `throughput-dial` folded in (one value
  on an arc: a budget, a lean, a load); `route-card` is now **`itinerary`**,
  with `itinerary-reel` folded in (legs, each stop carrying up to three
  items); `city-compare` folded into **`comparison`** (its pair form).
- **Aliases.** The six retired names still build: `KIND_ALIASES` in
  `src/content/config.ts` maps each to its host, the schema resolves it on
  parse, and the host component tells the old data shapes apart by their
  fields. `check-catalog` asserts every alias resolves, is not itself a kind,
  and has no catalog block. Scripts that read MDX directly resolve through
  `scripts/lib/kind-aliases.mjs`. **Author the host name**, never an alias.
- **Changed (the rest of the ten, rebuilt in Phase 6):** `bill-breakdown`
  (the payload drawn), `paradox` (drawn, not two prose blocks), `analogy`
  (pictograms), `commit-grid` (tightened, the grid as the figure),
  `region-map` (fitted projection), `player-card` (the front only, a profile
  card).

Every kept kind gains, in Phase 6: cue anchors, a build order, labels of at
most three words, the figure at ≥ 55% of the section, the number scale. The
library boards on the canvas (`Lib-<kind>`) are each kind's target.

---

## 10. Retired (2026-09-30), and what replaced each

| Retired | Replaced by |
|---|---|
| Literata as the one face; the trio before it; per-world faces | Newsreader + Instrument Sans (§3). Literata survives only as the source outline of the mark's P |
| Zero radius (`--r-card`, `--r-tile`, `--r-pill` at 0) | 6 / 4 / pill (§2.4) |
| Flat surfaces with no shadow (RD-05) | clickable cards on `--shadow-1` / `--shadow-2` (§4.2) |
| The 1280 frame with no side padding; the 170 / 1fr / 250 floor plan; the 720 measure and the `wide` breakout | the 1152 column in 64px margins (§4.1); 620 + 520 in the reading system (§5.1) |
| Six page grounds (dark space, tech and sports pages) | one paper; the deep colour only on the plate (§8) |
| `--viz-edge`, the 3px top rule on every figure | the figure panel card (§5.1) |
| The how-to-read panel (`howToRead`, `EXPLAIN[kind].how`, `NEEDS_HOW`) | cues (§5.2) |
| The plain line (`plain`, "In plain terms", `EXPLAIN[kind].what`) | cues and the one caption (§5.1) |
| The ⤢ expand modal and its study view | the pinned figure panel; no modal |
| The beat rail of the early canvas rounds | cues inside the article's own prose (§5) |
| The four-layer comprehension stack and the one-panel rule | the caption plus cues |
| CANON's act-structure ratios as layout law | the composition floors in `docs/REGISTER-PLAN.md` §5.1 (editorial, unchanged) |
| motion.md's named vocabulary (`reveal`, `sweep`, `settle`, `stamp`, `lensSettle`, `pageEnter` at 420ms, `--ease-snap`, `--t-page`) | the grammar in §6 |
| The onboarding intro "The Second Angle" (removed 2026-09-30) | a three-scene intro on paper (canvas `Intro`), Phase 4 |

`plain` and `howToRead` stay in the schema, still rendered, until Phase 8 (the
backlist builds unchanged); the pipeline keeps authoring them until Phase 7
teaches it cues.

---

## 11. Rollout: what each phase builds

The plan is the operator's (`PLAN` on the canvas, 2026-09-30). Every phase
ends on a green build, a clean `check:render` at 1280 and 375, the
screenshots read, and the operator's push.

| Phase | Builds |
|---|---|
| 0 · Rules | this file; `AGENTS.md` §7 and the rules files rewritten; the verdict applied to the registry (87 kinds, aliases) |
| 1 · Foundations | the palette, faces, radii, shadows and motion tokens in `shared/design/` and the themes; static font files for the share cards |
| 2 · The shell | masthead, footer, buttons, chips, inputs, cards; `core/CoverCard.astro` |
| 3 · The reading system | `cues` in the schema, `[[n]]` markers, `core/Section.astro` as two columns, the `cues.ts` island, the issue head, the progress rail |
| 4 · Pages | Home with a cover scene, Desk, About, Archive, Subscribe, Sign in, Welcome, the Shelf, story cards, the new intro, share cards |
| 5 · Motion | the `build.ts` island; `check:render` learns the final-state and cue-anchor checks |
| 6 · The library | the 87 kinds to their boards, in six waves by desk |
| 7 · The pipeline | `CUES:` and `BUILD:` lines in the catalog; the agents write cues; `check:prose` counts them |
| 8 · The backlist and the switch | every published issue gets cues and a cover; the old shell, themes, panel, modal and retired kinds go in one deploy |
