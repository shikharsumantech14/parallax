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
> **What renders today.** All nine phases are built (§11, Phase 8 on
> 2026-10-04): what renders is Lens. One amendment since: the type went back to
> one face, Literata, at the launch design's weights, case and tracking, with
> no italic sentence (the operator's ruling of 2026-10-04, §3.1). Do not
> "restore" a rule this file retires.

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

Everything else in CANON (the trio, zero radius, flat surfaces,
`--viz-edge`, the four-layer comprehension stack, the one-panel rule, the ⤢
study view, the act-structure ratios, the per-world type) is retired (§10).
Literata, CANON's one face, was retired with it on 2026-09-30 and restored
by the operator's ruling of 2026-10-04 (§3.1).

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

### 3.1 One face: Literata (the operator's ruling of 2026-10-04)

**Literata everywhere**: display, prose, captions, labels AND numbers. The
operator ticked it on the canvas board `Type-Compare` (2026-10-04), comparing
Lens's two faces with the launch design's one, and ruled: the type system goes
back to Literata at the launch design's weights, case and tracking; **no
italic sentences anywhere** (the section caption, the figure caption, the lit
cue's line, the skim caption and every other whole-sentence italic are set
roman); the ONE italic emphasis word in a title or headline stays. The Lens
layout, inks, cards, cues, builds and number tiers all stay; only type
changed. Newsreader and Instrument Sans (2026-09-30 to 2026-10-04) are
retired.

Literata is an optical-size family (opsz 7–72); `font-optical-sizing: auto`
lets the browser take the display cut at 68 and the text cut at 12. Weights
300 / 400 / 500 / 600 / 700, italic 400.

```css
--font-display, --font-body, --font-ui, --font-mono: 'Literata', Georgia, serif;
```

Loaded from Google Fonts:
`https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,400&display=swap`.
The share-card renderer (resvg) cannot load Google Fonts, and Google serves
Literata only as a variable font, which resvg cannot parse: it renders on
three static files from the googlefonts/literata repository fetched by
`scripts/fetch-fonts.mjs` (Literata 72pt Bold for the headline, Literata 72pt
Italic for the emphasised word, Literata SemiBold for the labels).

The four role tokens survive so every kind keeps compiling; all resolve to the
one face. Roles differ by size, weight, case and tracking only. The P inside
the medallion is an OUTLINE traced from Literata (`src/lib/mark-glyph.ts`), a
drawing, not live text.

### 3.2 The scale (the Type-Compare board, `sys-lit`)

| Role | Setting |
|---|---|
| Issue headline | 700, 68/1.0, −0.032em; phone 40/1.0 (`core/IssueHead`, `.px-h1`) |
| H2 / H3 | 700, 40/1.05 −0.028em · 700, 28/1.1 −0.024em |
| Hook / lede | 300, 21/1.45 (17 on phones), `--ink-2` |
| Primer | 400, 17/1.7 |
| Section title | 700, 34/1.05, −0.028em; phone 28 |
| Prose and cue sentences | 400, 18/1.72, ink; `strong` 700 |
| The section caption (the finding) | 500, 15.5/1.3, −0.005em, ROMAN, `--ink-2` |
| The lit cue's line | 500, 15.5/1.3, roman, ink; phone 14/1.4 |
| Skim caption | 400, 14/1.65, roman, `--muted` |
| Emphasis | italic 400, the one authored `*word*` of a headline, in the desk **text** colour (`--accent-deep`). One per title |
| UI body | 400, 15/1.55 |
| Eyebrow | 600, 12, capitals, .18em, the desk text colour |
| Label / meta | 600, 12, capitals, .16em, `--muted` or `--ink-2` |
| Chip | 600, 12, capitals, .14em |
| Button | 600, 12, capitals, .17em |
| Source line | 600, 12, capitals, .14em, `--muted`: `Source · <label> · <date>`, the label a link |
| Numbers | 700, tabular, line-height 1, at the tiers in §7, −0.02em (−0.03em at 160); the 160 and 96 tiers carry .12em of bottom room so Literata's comma clears the label |
| Label under a number | 600, 12, capitals, .16em, `--ink-2`, 8px below |
| Cover headline | 700, 21/1.18, −0.02em; cover meta 12 capitals .16em |
| Desk name | 700, 30/1.0, −0.028em; desk tagline 400, 14/1.5 |
| Stage headline | 700, 48/1.0, −0.032em (40 on phones); stage labels 12 capitals .17em |

Numerals are tabular everywhere. Headlines are set ragged (no justification).

### 3.3 Text inside an SVG (RD-01b, carried)

In-SVG `<text>` takes a **literal** font stack in a `style` attribute, never
`var()` and never a presentation attribute:
`style="font-family:'Literata',Georgia,serif"`. Labels at 500 or 600, numbers
at 600 or 700, at the drawing's own sizes; never italic. A presentation
attribute loses to any stylesheet rule, and resvg does no `var()` substitution.
The standing grep in `AGENTS.md` §8 stays at zero.

### 3.4 The floor

- **Never below 12px rendered**, on any viewport, in HTML or in an SVG. (The
  old floor was 9.5px; Lens raises it.) A chart that cannot hold 12px at 375
  redraws its labels (≤ 3 words, §5.5) or scrolls inside its card; it never
  shrinks the type. The render gate reports text under 12px as TINY (a
  warning, while the library is redrawn in Phase 6) and under 9.5px as FLOOR
  (blocking), measured as rendered: an SVG label at its size times the SVG's
  scale. The phone pin's own zoom (§5.1) is taken out of that measure.
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
- **Buttons:** 44px tall, `--r-ctl`, Literata 600 12px capitals at .17em.
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
  (§4.3); right the nav Home · Desks · Archive · About in Literata
  600 12px capitals at .17em, a "Sign in" link in the same voice and a primary "Subscribe". On a desk page the
  register follows the wordmark. On a deep plate the masthead reverses to
  `--on-deep`.
- **Footer:** on `--paper-3` under a hair: the same lockup at 28px (the house
  cut on every page), the promise "Stories you think you already
  understand.", the six desks as link chips each led by its medallion at
  20px, three link columns (Read · Parallax · Account), then under a
  `--hair-2` rule the line "© 2026 Parallax Lens™ · Registered in India · No
  analytics, no cookies, no trackers" with Privacy and Terms. The chip
  medallions keep the lettered **mark** cut at 20px, the one sanctioned
  exception to the reversed-below-24 rule (§4.3): a reversed cut carries no
  desk colour, and six identical ink discs would not tell the desks apart.
- **The cover card** (Phase 2, `core/CoverCard.astro`): the graphic-dominant
  issue card on Home, Desk, Archive, the Shelf and Subscribe. A 216px panel
  on the desk tint draws the issue's cover mark (`core/CoverMark.astro`),
  then the headline (Literata 700 21, the italic word at 400 in the desk text) and
  "No 17 · 28 Sep · 4 min". Sizes: `card` (3-across), `tile` (the desk
  strip, a 264px panel), `row` (a 120 x 72 thumbnail inside a list row,
  marks only). The mark draws the section the issue's `cover.section` names
  when that is one of eleven drawable kinds, otherwise the issue's first
  section of those kinds (`src/lib/cover.ts`), with the desk medallion at 96
  as the fallback; a graphic never appears without the line that says what
  it shows, which on a card is its headline and on the Home desk card is
  `coverModel().caption` (the cover's own line, else the section caption's
  first sentence, else a line derived from the data). **A
  cover is never blank at any size:** on a card narrower than 340px the 13px
  words hide and the marks and large numbers stay; the `row` thumbnail draws
  no words and every kind keeps a mark heavy enough to read at that scale
  (a readout becomes two bars when two tiles share a unit, otherwise one bar
  beside the desk medallion).

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
  retired on every surface; BRIEF-5 §1). Below 24px, the reversed cut,
  except the footer's desk chips (§4.2), where a row of six marks at 20px
  keeps the lettered mark cut so each desk shows its colour.
- **On a deep plate** the ground disc takes the plate's deep colour and the
  ring and P take `--on-deep` (`<Mark onDeep>`). Off the plate, the ground
  disc takes the surface the mark sits on (`<Mark ground="var(--paper-3)">`
  in the footer), so the crescent is cut from the real ground.
- **Misuse (binding):** no gradient or sphere shading, no off-station dial, no
  rotation, no second accent, no substitute letter, no drop shadow, never
  smaller than 16px, never the reversed cut above 24px.
- **Use `core/Mark.astro` (props `desk`, `size`, `cut`, `tight`, `ring`,
  `ground`, `onDeep`) over `src/lib/mark.ts`. Never paste SVG bodies.**

**The lockup.** The mark TIGHT (viewBox trimmed to the ring) at a **34px
disc with ring 9**, a **12px gap**, then "Parallax" in **Literata 700
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

- **Desktop (from 1024px):** inside the 1152 column, the **article column
  (up to 620) + 32 gap + 520 figure panel**; the figure keeps its 520 and the
  article takes the rest, 600 at full width (the board drew 620 + 24 + 520 on
  a 1164 band that crossed the frame's gutter; built, it stays in the
  column). `layout: wide` widens the figure to 620. The progress rail sits in
  the left gutter, 56px, its names beside the dots from 1440px (narrower, on
  hover or focus). LEFT, the section's full text in the Parallax voice
  (eyebrow, title, intro, the kind's own sentences, the caption as the
  finding in Literata 500 15.5/1.3, roman, ink-2), prose 18/1.72. RIGHT, the **pinned figure
  panel**: `--paper-2`, 1px hair, 6px radius, `--shadow-1`, padding 20 / 24,
  `position: sticky; top: 24px` while its section is in view. The panel
  carries a small header ("Figure 3 · 4 cues", a "Show all" control), the
  graphic, the lit cue's sentence while one is lit, and the source line. The
  caption is printed once, in the article.
- **Phone (below 1024px):** the figure comes first and pins at the top while
  the prose scrolls beneath it, when it fits 40% of the height at 0.75 scale
  or more (the island's `zoom`); otherwise, and without JS, it sits in flow
  above its article. Tapping a cue lights its mark above.
- A section with no graphic (the narrative kinds: `act-break`, `prose`,
  `quote`, `analogy`) runs in the article column with no panel.
  `jargon-buster` and `three-steps` left that set in Phase 6 (2026-09-30),
  because their boards draw a figure with cues: the article carries each
  term's meaning or each step's text as a cue sentence, the panel carries
  the cards (`core/Section.astro`).

### 5.2 The cue contract

The data shape (in `src/content/config.ts` since Phase 3; the City issue's
section 4, as built):

```yaml
sections:
  - kind: latency-waterfall
    title: "Forest's whole case took 113 days"
    caption: "[[1]] Forest's case, appeal included, took 113 days. [[2]] City's first stage has run 1,330 days and has not stopped."
    cues:
      - { n: 1, at: "1 2" }   # Forest's two spans
      - { n: 2, at: "3" }     # City's span
```

- **`cues: [{ n, at, text? }]`**: `n` is the numeral (1–4), `at` names the
  ANCHOR id(s) the component exposes (space-separated for several), `text` is
  the cue's sentence (the line the panel shows while that cue is lit; absent,
  the sentence its marker introduces). Every cue sentence is a data claim, and
  the verifier traces it like a caption.
- **`[[n]]`** in `intro`, `caption`, a prose kind's `data.paragraphs`, the
  `you-think` texts and a timeline event's `note` renders as the cue button
  inline, before the sentence it belongs to. A `data-readout` tile or a
  `timeline` event that a cue names is set as a sentence in the article and
  gets its button without a marker. A marker with no matching cue, or a cue
  with no anchor in the figure, is a render-gate failure: `check:render`'s
  CUES check (Phase 5) blocks on any cue button whose numeral names no
  anchor in its section's figure (`[data-cue-n~="n"]`), any numeral the
  figure prints that no button in the article names, and any cue button in a
  section with no figure panel.
- **Anchors:** every component exposes its cue anchors as `data-cue="<id>"`
  on the element a cue can name (a bar, a dot, a row, a band), ids numbered
  from 1 in data order, with an empty `.px-cue-tag` slot where the SAME
  numeral prints; `core/Section.astro` fills the numerals from `cues`, so
  they are in the HTML without JS. Phase 3 wired the City issue's kinds; the
  list is in `src/content/issues/_AGENTS.md` §16. The catalog lists each
  kind's anchors on a `CUES:` line (Phase 7).
- **Two to four cues per graphic section.** None on the narrative kinds.
- **The cue button:** a real `<button>`, a 20px disc, desk **mark** fill,
  paper numeral in Literata 600 12, `aria-pressed`, `aria-label="Cue
  n: light it on the graphic"`.

### 5.3 Lighting

- Pressing a cue (or scrolling its sentence past the reading line) **lights**
  its anchor: the lit element at opacity 1, every other cue-able element at
  .35, a 2px desk-colour ring fading in on the lit element, over 160ms. Nothing
  scales. The panel shows that cue's sentence under the graphic.
- "Show all" returns every element to full and the caption to the section's
  finding.
- **Section 1 autoplays its cues once** (cue 1, then 2, …), then rests on
  "show all". No other section autoplays.
- The island that does this is `cues.ts` (§5.6), about 2 KB. No component
  animates its own lighting.

### 5.4 The issue head (BRIEF-5 §3)

Full 1152 width. Row 1, columns 8 / 4: LEFT the eyebrow ("MATCH PROGRAMME ·
No 17"), the headline in Literata 700 68/1.0 (the italic word at 400 in the desk text
colour), the hook in Literata 300 21/1.45, then the facts as one hairline row of four cells
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
`core/Section.astro` preserved that counting: each section is still a direct
child of `#px-article` with its `data-kind`, and the rail is a sibling of the
article, never a wrapper.

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

`src/scripts/build.ts` (Phase 5, built 2026-09-30): one ES module, loaded once
by every layout (Home, Issue, Story, App), about 3 KB minified, no library.
The markup declares a build (§6.4); the island runs it by the rules above.
**No component animates itself**: the `[data-reveal]` / `.is-in` scroll
reveal, `core/Reveal.astro` and `core/VizMotion.astro` (the count-up) were
retired in the same phase, and every component's own hidden states with
them. Section 1 of an issue, the Home stage and the intro overlay all build
through this island; the cue lighting stays in `cues.ts` (§5.3), which waits
for section 1's figure to finish building (`px:built`) before it plays its
cues. The classes live in `src/styles/motion-v2.css`, one vocabulary
everywhere: `.bx-pre` (the start state), `.bx-on` (a step running), and
`.bx-fade`, `.bx-drop`, `.bx-rise`, `.bx-draw`, `.bx-grow-x`, `.bx-grow-y`.

### 6.4 The build contract, and the final state

**The markup.**

| Attribute | On | Means |
|---|---|---|
| `data-build-scene` | the build root (a component's root, the stage, an intro scene) | a scene. Optional `data-build-delay="ms"` before its first step and `data-build-tempo="1.6"` (a multiplier on every duration; the Home stage runs at 1.6, §6.1) |
| `data-build="n"` | an element of the scene | its step, an integer from 1. Several elements may share n: they stagger 80ms in document order (a step of more than nine compresses so its spread stays 640ms) |
| `data-build-kind` | the same element | `counter` · `draw` · `grow-x` · `grow-y` · `drop` · `rise` · `fade` (the default) |
| `data-to="1330"` | a counter | the value it counts to, from 0. Optional `data-format="int"` (the default) or `"1dp"` |
| `data-build-replay` | a `<button hidden>` inside a scene | the island shows it; pressing it replays the scene |

- **A counter** is an element whose text holds ONE number (text around it is
  kept: "£1,330m"). It tweens on `requestAnimationFrame`, ease-out cubic,
  1400ms, with en-US grouping on the way, and ends on its HTML text exactly.
  Wrap the number in its own span when the element holds anything else.
- **A draw** is an SVG `path`, `line`, `circle`, `polyline` or `polygon` with
  a solid stroke; the island measures its length (a `pathLength` attribute
  wins) and draws it by `stroke-dashoffset`, 1400ms. Anything else falls back
  to a fade.
- **A grow** scales from the element's `transform-origin`, which the
  component sets (left for a bar, the floor for a column; the defaults are
  those two). 900ms.
- **Drop, rise, fade:** opacity with 6px down, 8px up, or nothing; 420ms.
- Everything moves through the individual `translate` and `scale`
  properties, never `transform`, so an element's own transform (an SVG
  group's placement) is composed with, not replaced.

**The run.** A scene starts when 35% of it, or 35% of the screen's height of
it, is in view (IntersectionObserver). Its steps run in order, each starting
when the previous is 70% through (§6.2). A scene another island has just shown
(the intro overlay's stepper) asks for its build again with a bubbling
`px:build` event on the scene. When a scene ends, every class and inline
property the island added comes off and every counter is back on its HTML
text: the scene takes `data-build-state="done"` and fires a bubbling
`px:built`. Order a component's steps as **axis, then marks, then labels,
then the figure's headline number**, and keep a scene inside 4.5s (§6.5).

**The final state is the HTML.** The start state is applied by the island,
never in the markup, so the static page IS the final state:

- **No JS:** nothing is hidden, nothing moves.
- **`prefers-reduced-motion: reduce`:** the island applies no start state;
  every cue readable, loops become stills.
- **Print:** the island finishes every scene on `beforeprint`.
- **The render gate:** `check:render` dispatches `px:build-finish` (every
  scene to its end) and, in its BUILD check, compares each scene after its
  build, with JS and motion on, against the same page with JavaScript off:
  each `[data-build]` element's text, box (within 1px) and opacity, and the
  scene's size. A build that ends anywhere the static page does not show is
  a blocking finding. So a scene must not hold an `html.js`-gated control
  that moves its build elements: put the scene on the graphic instead.

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

Literata 700, tabular (the ruling of 2026-10-04; Instrument Sans 600 at
line-height .92 before it). A number's line-height is 1, the 160 and 96 tiers
carry .12em of bottom room for Literata's comma, and its label (12px
capitals, 600, .16em) sits 8px below it. Phones: 88 / 72 / 40. Where a number shrinks, the space it leaves goes
to the graphic, never to more text.

---

## 8. The stage: the deep plate

### 8.1 What it is

The ONE bounded band per desk where the desk's **deep** colour is the
ground: a hero, a cover, a WebGL scene. It is a bounded BAND, never a whole
page and never a page background. The Home and desk stages
(`core/Stage.astro`, the Home and Desk boards) run it full bleed, edge to edge
of the viewport, 760 tall on Home and 720 on a desk page with the on-deep
masthead across its top (auto on phones); anywhere else it is a card-radius
(6px) plate inside the paper page. The old dark desk grounds (space navy,
tech black, sports pine) survive only here.

### 8.2 Its rules

- Text `--on-deep` and `--on-deep-2`; rules `--on-deep-hair`.
- Marks in the desk **mark**, or the lime on tech and sports.
- The masthead, when it sits on a plate, reverses; the mark takes its on-deep
  body (§4.3).
- **Cover scenes** (Phase 4, `stage/StageScene.astro`, data in
  `src/lib/stage.ts`): the Home hero and each desk's hero tell one issue as a
  picture. `cover: { section, number, label, headline? }` in the issue
  frontmatter gives the one number (160 desktop, 88 phone) and its label; the
  scene is chosen from the issue's data, never its desk: a **spiral clock**
  (one turn a year) when it carries a timeline with a dated `key` anchor and a
  dated `now` a year or more later, an **orbit** (rings squeezed over a
  planet's edge, heights not to scale) when the cover section is a
  descent-profile, **bars** for a readout, else the issue's cover mark on a
  tint panel beside the number. Then a ladder of at most three rows, the
  headline (Literata 700 48, the italic word at 400 in the desk mark or lime) and the
  paper "Read" button with Replay. Home shows the newest issue that has a
  `cover`, at the 1.6x tempo (§6.1).
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
| ~~Literata as the one face~~ (restored by the operator's ruling of 2026-10-04, §3.1); the trio before it; per-world faces | One face again: Literata (§3). Newsreader + Instrument Sans, Lens's two faces of 2026-09-30, are retired in their turn |
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
| The onboarding intro "The Second Angle" (removed 2026-09-30) | a three-scene intro on paper (canvas `Intro`): `core/IntroOverlay.astro`, Phase 4, shown once per browser on Home |

**All of it is removed as of Phase 8 (2026-10-04).** Phase 3 stopped
rendering the panel and the plain line and deleted the expand modal; Phase 7
stopped the pipeline authoring `plain` and `howToRead`; Phase 8 took both
fields out of the schema (a stray one now FAILS the build, by name), deleted
`src/lib/explainers.ts` (`EXPLAIN`, `NEEDS_HOW`, `howToReadFor`) and the
rules that styled the retired chrome (`.px-plain*`, `.px-modal__viz`), reduced
the six theme files to their inks (no page grounds, no per-world type or
motif kits, no `--viz-edge`, now a plain `--hair` rule on `.px-viz`), and
swept the dead launch-design primitives out of `base.css` (the skim toggle,
the primer, the section number block, `.px-quote*`, `.px-compare*`,
`.px-readout*`, the old home list (`.px-home__issue*`, `__title`, `__tagline`), the floor plan's frame step-out). The RD-05
radius flip had already gone in Phase 1. None of it renders anywhere, and
none of it may come back.

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
| 8 · The backlist and the switch | every published issue gets cues and a cover (Part A, `280b5c5`); the old shell, themes, panel, modal and retired kinds go in one deploy (Part B, 2026-10-04). **Built**: §10 lists what went |
