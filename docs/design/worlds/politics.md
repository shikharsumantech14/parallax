# World spec — POLITICS

> **Register (one sentence):** *The official record, annotated* — the reader is
> holding the authoritative paper (gazette, division list, ledger) and Parallax
> has marked it up with red ink to show what the record actually means.

## Why politics currently reads as "plain paper" (the diagnosis)

`themes/politics.css` only *recolors* the shared kit — warm paper + oxide red, no
motifs, no signature surfaces. Space earned its identity from telemetry chrome and
`● LIVE` pulses; politics never got its equivalents. This spec defines them.

## The world's materials

Palette (from `shared/design/worlds.css` — never restate hexes in components):
`--bg #f4f1ea` warm paper · `--paper #ffffff` · `--ink #161412` · `--accent
#b8341f` oxide red · `--accent-deep #8b2416` (text-safe red) · `--accent-alt
#1e5a3f` opposition green · `--tape #d9c896`.

Roles: **red = the finding** (what Parallax's annotation reveals); **green = the
opposing bloc / counter-position** (never "good/bad" — always "side A/side B");
**tape = archival furniture** (folder tabs, file labels).

## Signature motifs (the identity kit)

These land as ~80 lines in `src/styles/themes/politics.css` as reusable classes,
so the world reads as politics even between vizzes:

1. **The division rule** (`.pol-division`): a horizontal rule that splits mid-line
   into two half-rules separated by `AYES | NOES` mono microcopy — used as the
   section-break ornament (where other worlds use a plain hairline).
2. **The stamp** (`.pol-stamp`): result verdicts as an inked rubber stamp — mono
   uppercase, 1.5px `--accent-deep` border, rotate(−2deg), slight ink-bleed via
   0.5px blur text-shadow @ 8%. Enters with the `stamp` motion, always LAST.
   (Extends the existing `.vb__stamp` into a world-wide treatment.)
3. **The ledger row** (`.pol-ledger`): data rows as ruled ledger lines — baseline
   rules `--rule`, mono figures right-aligned with dot leaders, first column
   sans. Used by margin-ladder, seat tables, funding tables.
4. **The annotation** (`.pol-annot`): Parallax's editorial voice INSIDE a document
   surface — Fraunces italic, `--accent-deep`, a thin red underline connector to
   the annotated figure. The "red pen on the record" move.
5. **The record header** (`.pol-record`): official-document chrome for viz cards —
   a top rule pair (3px + 1px), mono metadata line `BULLETIN № · SESSION · DATE`,
   letter-spaced small caps title. Gives politics cards the "gazette plate" feel
   the way space cards feel like consoles.

## Type treatment

- Headlines: Fraunces, **no italic accent word in-viz** (italics belong to the
  annotation voice); titles read as document headers — small caps + tracking.
- Mono everywhere numbers live: division counts, margins, dates — always tabular.
- The world's case signature: UPPERCASE MONO METADATA + Small-caps titles +
  sentence-case annotations.

## Motion signature

Politics moves like paperwork being processed: `grow` for tallies, `settle` for
seats finding their places, `stamp` for verdicts, `flowDash` ONLY in power-flow
(money/authority in motion). No ambient motion otherwise — records don't fidget.
The chamber's `orbitIdle` equivalent is a very slow camera dolly (see blueprint).

## Flagship components (this world's heroes)

| Kind | Role |
|---|---|
| **`chamber`** (WebGL) | THE politics hero — the 3D hemicycle with every seat instanced; composition ↔ division states |
| **`power-flow`** (SVG) | follow-the-money Sankey with `flowDash` |
| `coalition-calculus` (HTML) | reader-agency coalition builder (P5/P6) |
| `gerrymander-lens` (SVG) | same-votes-three-maps (P5/P6) |
| `ballot-flow` (SVG) | RCV round transfers (P5/P6) |

Existing kinds inherit the motif kit where natural: `vote-result` keeps its stamp;
`seat-chart`/`margin-ladder` adopt ledger rows; `timeline` in politics gets the
division-rule ornament between eras.

## Do / Don't

- DO let whitespace read as official-document margins (generous, structured).
- DO use the annotation motif to editorialize — that IS the brand.
- DON'T use red and green as valence (good/bad); they are blocs.
- DON'T add flags, gavels, capitol iconography — the record itself is the imagery.
- DON'T dark-theme politics; the world is daylight paper.
