---
paths:
  - "src/styles/**"
  - "shared/design/**"
  - "src/components/topic/**"
---

# Design tokens and colour law

`shared/design/{tokens,worlds}.css` is the **canonical source for both
projects**. Edit there, then `npm run design:sync`. `npm run design:check` gates
the root build — it verifies 30 palette mirrors, 6 in-world accent-deeps and 18
record tokens across every declaring file, not just the generated copies.

Full token law with rationale: `docs/design/TOKEN-RECORD.md` (TD-01…TD-06).

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
