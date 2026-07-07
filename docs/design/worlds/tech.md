# World spec — TECH

> **Register (one sentence):** *The terminal session* — a beautifully typeset
> build log: everything is measured, versioned, and traced.

## Materials

Palette: `--bg #0d0d0d` near-black · `--paper #161616` panel · `--paper-2
#1a1a1a` · `--ink #fafafa` · `--accent #c6f432` phosphor lime · `--accent-deep
#9cc528` · `--accent-alt #ff5c8a` error pink (failures, regressions, hot paths) ·
`--tape #333333`.

Roles: **lime = throughput / the passing state**; **pink = the failure / the
regression / the hot path** — tech is the one world where a valence pair (pass/
fail) is native and sanctioned. Dark is a terminal background, not a "dark mode".

## Signature motifs

1. **The prompt**: `$` / `>` mono prefixes on card metadata; blinking caret
   (counts as the `pulse` budget) on the one "live" element.
2. **The trace**: horizontal span bars with mono timing labels (the
   latency-waterfall grammar) — tech's native chart.
3. **The diff**: paired before/after values as `- old` / `+ new` mono lines with
   `--accent-alt`/`--accent` — the world's comparison idiom.
4. **The grid**: pixel-precise cell grids (commit-grid, die floorplans) at exact
   integer sizes — crispness is the aesthetic; no anti-aliased blur.

## Type treatment

Mono dominates: labels, values, metadata, even some titles (lowercase mono
`parallax/tech` chrome). Sans for explanatory labels. Fraunces only in the
editorial annotation. Case signature: lowercase mono chrome + sentence-case
explanations.

## Motion signature

Tech moves like a build executing: `grow` for bars (fast, 400ms), `sweep` for
traces, `countup` for metrics, `flowDash` for packet/pipeline flows, the caret
`pulse`. Entrances stagger tight (40ms) — mechanical cadence. No ambient scene
motion except `neural-flow`'s wave and `packet-trace`'s dashes (one per viewport).

## Geometry doctrine

Log axes are native here (`scaling-plot`, `moore-ladder`) — always with the
caption chip. Real numbers from real benchmarks; the queue-cliff curve is the
actual M/M/1 formula (`physics/mechanics-and-flow.md`).

## Flagship components

| Kind | Role |
|---|---|
| `neural-flow` (WebGL, P5/P6) | THE tech hero — a real network's forward pass |
| `packet-trace` (WebGL+SVG, P5/P6) | a request crossing the planet |
| `queue-cliff` (HTML, P5/P6) | the interactive utilization cliff |
| `latency-waterfall` / `arch-stack` (existing) | the trace + stack natives |

## Do / Don't

- DO keep everything pixel-crisp (integer sizes, 1px rules, no blur).
- DO use the diff idiom for any before/after.
- DON'T use lime as decoration — it means throughput/pass.
- DON'T add circuit-board clichés, binary rain, or glow-for-glow's-sake; the
  phosphor accent already carries the register.
