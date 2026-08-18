# Type mapping — Literata → the repo trio

The prototypes are set in **Literata** throughout. That is an artifact of the
design runtime, not a design decision, and it must not reach the repo.

This repo standardised on one trio on 2026-06-21 (`src/styles/type-v2.css`,
imported last so it wins), retiring the per-world display faces:

| Repo role | Family | Token |
|---|---|---|
| Serif voice — headlines, leads, nameplates, the one italic accent word | **Fraunces** | `--font-display` |
| Sans — body, UI, structural headings | **Schibsted Grotesk** | `--font-body` |
| Labels, eyebrows, numerals | **JetBrains Mono** | `--font-mono` |

## Apply this table

| Prototype element | Prototype value | Implement as |
|---|---|---|
| Instrument title (`<h3>`) | Literata 22px/700, `-0.024em` | `--font-display` 22px/700, `-0.024em` |
| Size + figure eyebrow | Literata 9.5px/600, `0.18em`, uppercase | `--font-mono` 9.5px/600, `0.16em`, uppercase |
| Unit / axis-role eyebrow (right-aligned) | Literata 9.5px/600, `0.16em`, uppercase, accent | `--font-mono`, same metrics, `--accent-deep` |
| "How to read this" block | Literata 14px/1.58 | `--font-body` 14px/1.58 |
| Body / readout labels | Literata 12.5px | `--font-body` 12.5px |
| **All numerals** — readouts, axis ticks, table values, deltas | Literata 12.5–31px/700 | `--font-mono` + `font-variant-numeric: tabular-nums` |
| SVG `<text>` axis + series labels | `font-family="'Literata', Georgia, serif"` 9–11.5px | `font-family="var(--font-mono)"` 9–11.5px |
| "In plain terms" line | Literata 13.5px/1.62 | `--font-body` 13.5px/1.62 |
| Source line | Literata 9px/600, `0.14em`, uppercase | `--font-mono` 9px/600, `0.14em`, uppercase |
| Mono-flavoured labels in tech instruments | `ui-monospace, SFMono-Regular, Menlo` | `--font-mono` |

## Two consequences worth calling out

1. **Every number becomes mono + `tabular-nums`.** The prototypes set numerals
   in the same serif as the prose. Here numerals are a mono role — which is also
   what stops readouts jittering as values change on interaction. This is a real
   visual change from the screenshots; make it.
2. **SVG labels change width at the same px size.** JetBrains Mono is wider per
   character but shorter in x-height than Literata. Two labels that touch at 9px
   in the screenshots may clear in the build, and two that clear may touch.
   Every blueprint §4 gives a label collision policy — verify at 375px.

## What does not change

Sizes, weights, letter-spacing, line-heights, and the uppercase/sentence-case
pattern all carry over exactly. Only the family changes, plus the numeral role
moving to mono.

## The `_ds/` bundle is a stale snapshot

The design system bundle the prototypes were built against still describes the
old per-world display faces (Space Grotesk, Cormorant Garamond, Oswald). It
predates the 2026-06-21 change. Trust `src/styles/type-v2.css`, not that
bundle and not the design system's README.
