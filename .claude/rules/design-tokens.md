---
paths:
  - "src/styles/**"
  - "shared/design/**"
  - "src/components/topic/**"
---

# Design tokens and colour law (Lens, 2026-09-30)

**The law is `docs/design/LENS.md` §2 (tokens) and §3 (type).** This rule is
the working summary for anyone touching CSS. The launch design's token law
(Literata only, the RD-05 zero-radius override, `--viz-edge`, the two-role
`--accent-deep`, derived `--muted`) is retired; see "Retired" at the foot.

`shared/design/{tokens,worlds}.css` is the **canonical source**. Edit there,
then `npm run design:sync`; `npm run design:check` gates the build against
every declaring file (the theme headers, `meta.css`, the `[data-world]`
subtrees, the share-card literals). How the legacy variable names were
re-pointed onto the Lens palette is recorded in
**`docs/design/TOKEN-RECORD.md` TD-09** (Phase 1); read it before renaming
anything, because the 87 kinds still compile against the legacy names.

## The palette: one paper, six inks

- **One paper under every desk.** `--paper #F5F2EB`, `--paper-2 #FBFAF6`
  (cards, inputs, the figure panel), `--paper-3 #EDE9DF` (wells, the neutral
  chip, the primer band); `--ink #16140F`, `--ink-2 #4A463D`, `--muted
  #6B665B` (captions, labels; passes 4.5:1, never lighter), `--hair #DCD7CB`,
  `--hair-2 #C9C3B4`. **No desk sets a page ground**, ever.
- **Each desk has four inks** (`--<desk>-text / -mark / -tint / -deep`,
  values in LENS §2.2), and each has one job:
  - **text** for words in the desk colour (≥ 4.5:1 on paper), and for any
    fill that carries text (the old TD-06, true on every desk now);
  - **mark** for fills, lines and data, never small text;
  - **tint** for bands and chips;
  - **deep** for the one bounded plate (a hero, a cover, a WebGL scene), never
    a page.
- Components read the desk through the role tokens a theme sets:
  `--accent` = the mark, `--accent-deep` = the text ink, `--accent-tint` = the
  tint, `--deep` = the plate, `--accent-lime` = the plate mark on tech and
  sports (TD-09). A component never names a desk's literal hex.
- **The limes** (`--tec-lime #C6F432`, `--spo-lime #E8F048`) are marks on
  their own desk's deep plate only: never text, never on paper.
- **On a plate:** text `--on-deep` / `--on-deep-2`, rules `--on-deep-hair`,
  marks the desk mark or lime. Never a desk text ink on the plate.
- A fixed data encoding (the warming ramp, win/loss, a party colour from the
  section's data) is exempt from theming and declared in the blueprint. No new
  brand colour, ever.

## Corners, elevation, space

- **Corners 6 / 4 / pill:** `--r-card 6px` (cards, the figure panel, the
  plate), `--r-ctl 4px` (buttons, inputs), `--r-chip 999px` (chips, the cue
  disc, dots, the medallion). `--r-tile` and `--r-pill` survive as aliases of
  the card and the chip until the components move (TD-09).
- **Elevation:** `--shadow-1` on every clickable card at rest, `--shadow-2`
  with an ink border on hover. A card never translates or scales. Shadows
  still belong to focus rings, data-mark halos and CSS-3D scene depth; no
  glass, no glow, no blur on any surface.
- **Space** in multiples of 8; the frame is a 1152 content column in 64px
  margins (20 on phones), sections 96 apart (64 on phones).

## Type

Two faces (LENS §3): **Newsreader** for display, prose and captions,
**Instrument Sans** for UI, labels and every number (600, tabular).
`--font-display` / `--font-body` → Newsreader, `--font-ui` / `--font-mono` →
Instrument Sans. Worlds differ by **ink only**, never by face or treatment.
Single lever: `src/styles/type-v2.css`, imported last. **Nothing below 12px
rendered.** The share cards render on static files of both faces
(`scripts/fetch-fonts.mjs`).

## In-SVG text (RD-01b, carried)

Use a **literal font stack** in a `style` attribute, never `var()` inside an
SVG presentation attribute:
`style="font-family:'Instrument Sans','Helvetica Neue',Arial,sans-serif"`.
Presentation attributes lose to any stylesheet rule, and satori/resvg (the OG
card renderer) perform no `var()` substitution. Standing grep, must be zero:

```bash
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```

## CSS prefixes

Every component owns a unique `px-<abbrev>` prefix (≤6 chars). Check `meta.css`
for collisions first. Reserved: `px-strip` (TopicStrip — the climate strip uses
`px-cstrip`), `px-gate`, `px-acct`, `px-wb`, `px-nnote`,
`pxs-` (story mode), `px-wj`, `px-abt`, `px-inst`. Phase 6 (2026-09-30/10-01)
redrew the folded kinds inside their hosts, so `px-cgauge`, `px-swdial`,
`px-tdial` and `.rc` are free too. `px-intro` / `px-xp` (the removed intro),
`px-plate`, `px-beats`, `px-shells`, `px-elev`, `px-co`, `px-bflow`, `px-og`,
`px-sig`, `px-dg`, `px-rg`, `px-ireel` and `.cc` (the dropped and folded
kinds) are free; a few of their dead rules still sit in the theme files and
`dataviz-v2.css` until Phase 8's sweep.

## Retired 2026-09-30 by the Lens revamp

Do not restore any of these; LENS §10 and TD-09 give the reason for each.
**Literata as the one face** · **zero radius** and the `base.css` `:root`
override that set `--r-card` / `--r-tile` / `--r-pill` to 0 (TD-08) ·
**flat, shadowless surfaces** (RD-05) · **six page grounds** and the
dark-desk worlds · **`--viz-edge`**, the 3px top rule (TD-07; now a hair) ·
**the two `--accent-deep` roles** (TD-05; one paper makes them one) ·
**derived `--muted`** (one ground, one muted) · **glass** on the reading
toolbar and the modal chrome.
