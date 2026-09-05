---
paths:
  - "src/styles/**"
  - "shared/design/**"
  - "src/components/topic/**"
---

# Design tokens and colour law

`shared/design/{tokens,worlds}.css` is the **canonical source for both
projects**. Edit there, then `npm run design:sync`. **One standing exception (RD-05):** the publication's radius flip — `--r-card: 0; --r-tile: 0` — lives in `src/styles/base.css` `:root`, **not** in the shared file. `app/` consumes those two tokens in three files and keeps its own spec until Phase 8, so flipping them at the source would flatten the app. Do not "tidy" the override back into `tokens.css`. `npm run design:check` gates
the root build — it verifies 30 palette mirrors, 6 in-world accent-deeps and 18
record tokens across every declaring file, not just the generated copies.

Full token law with rationale: `docs/design/TOKEN-RECORD.md` (TD-01…TD-06). The two surface decisions from shell adoption — the RD-05 radius flip and the `--viz-edge` world rule — are recorded in the comment blocks above the `:root` override and `.px-viz` in `src/styles/base.css`, in `docs/REVAMP-PLAN.md` RD-05, and in `docs/design/CANON.md` §14 (a marked DRAFT until the operator signs).

## Hard rules

- **`--muted` is DERIVED**, not authored: ink at 60% on dark worlds, 72% on
  light. The previously authored values failed WCAG AA on 8 of 12
  world/surface pairs.
- **`--accent-deep` carries two documented roles** — in-world vs light-paper.
  They are provably irreconcilable on dark worlds; see the comments in
  `shared/design/worlds.css` before "fixing" one.
- **Small text on a light ground uses `--accent-deep`, never the vivid accent.**
- **TD-06: any FILL that carries text uses `--accent-deep`.** The vivid accent
  fails on travel at 3.91:1.
- **`--paper-warm` is six measured literals**, never derived from `--bg`. They
  sit above the ground in *opposite directions* on light and dark worlds, so a
  naive mapping inverts the moment a politics kind runs in a dark-world issue —
  which CANON §2 permits.
- **`--paper-deep`** is an alias of `--paper-warm`; **`--on-accent`** is the
  world ground.

- **`--viz-edge` is a per-theme token, declared only in
  `src/styles/themes/<world>.css`** — `var(--ink)` on the light desks (politics,
  earth, travel), `var(--accent)` on the dark ones (space, tech, sports). It is
  the 3px top rule every figure wears (`.px-viz`, plus the bespoke roots
  `.px-coalc` / `.px-swheel`), consumed as `var(--viz-edge, var(--ink))` so a
  seventh world stays legible rather than edgeless. On a dark ground an ink rule
  vanishes into the paper; on a light ground the vivid accent shouts over the
  figure — do not unify the six values. It has **no** `shared/design` mirror and
  `design:check` does **not** gate it; the six theme values are the only source.
- **Reading and home surfaces are FLAT (RD-05).** `--r-card` and `--r-tile` are
  `0` for the publication via the `base.css` `:root` override (see above);
  surfaces carry no `box-shadow` and hover is border-colour only. Shadows survive
  on focus rings, inset hairlines, halo rings on data marks, slider thumbs,
  CSS-3D scene depth (RD-06), viz3d overlay chrome and modal/popover/toast
  chrome. The reading toolbar `.rtb` is flat — opaque `var(--paper)`, a 2px ink
  rule, no backdrop-filter; glass survives on modal chrome only. Where a shadow
  was a surface's only edge, a 1px hairline replaced it.
- **`--r-pill` is deliberately NOT flipped.** It carries status chips, CTAs, the
  toolbar and progress caps — 43 sites of UI chrome, not reading surfaces.
  Squaring every chip in the product is a separate decision; do not fold it into
  the RD-05 flip.


## Type

One trio product-wide: **Fraunces** (serif voice), **Schibsted Grotesk**
(`--font-body`, the single sans), **JetBrains Mono** (labels/numerals). The six
worlds differ by **accent colour + treatment**, never typeface. Do not
reintroduce per-world display faces — the §3 "Display font" column in
`AGENTS.md` is historical. Single lever: `src/styles/type-v2.css`, imported last.

## In-SVG text (RD-01b)

Use a **literal font stack**, never `var()` inside an SVG presentation
attribute. Not because `var()` fails to resolve — it does resolve in current
Chromium, and the older claim to the contrary was disproven — but because
presentation attributes lose to any stylesheet rule, and satori/resvg (the OG
card renderer) perform no `var()` substitution. Standing grep, must be zero:

```bash
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```

## CSS prefixes

Every component owns a unique `px-<abbrev>` prefix (≤6 chars). Check `meta.css`
for collisions first. Reserved: `px-strip` (TopicStrip — the climate strip uses
`px-cstrip`), `px-intro`, `px-xp`, `px-gate`, `px-acct`, `px-wb`, `px-nnote`,
`pxs-` (story mode), `px-wj`, `px-abt`, `px-inst`.
