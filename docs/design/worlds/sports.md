# World spec — SPORTS

> **Register (one sentence):** *The floodlit match programme* — night-game green,
> scoreboard numerals, chalk lines on grass; analysis with stadium energy.

## Materials

Palette: `--bg #0f2820` pitch green · `--paper #143328` · `--paper-2 #112c22` ·
`--ink #f5f5f0` floodlight white · `--accent #e8f048` kit volt · `--accent-deep
#b8c038` · `--accent-alt #ff6b35` away orange (the opponent, the second series) ·
`--tape #1a4030`.

Roles: **volt = the home line / the subject**; **orange = the opposition** —
always a rivalry pair, never valence. The dark green is turf under floodlights,
not a dark mode.

## Signature motifs

1. **The chalk line**: pitch markings as the world's grid — 1.5px white @ 0.35
   lines with slightly rounded caps (chalk, not laser); every spatial viz sits on
   a chalked surface.
2. **The scoreboard**: big mono tabular numerals in bordered blocks (`--rule`
   border, `--paper-2` fill) — the world's value-display idiom; `countup` native.
3. **The bracket**: uppercase labels in square brackets `[ ARSENAL ]` — the
   world's case signature (existing treatment, codified).
4. **The minute rail**: a `0' — 90'` mono timeline rail under match vizzes —
   sports' native x-axis, always visible.

## Type treatment

Condensed-feeling caps: Schibsted Grotesk uppercase with tight tracking for
names/labels (the Oswald memory, achieved with weight+case, not a new font);
scoreboard mono for every number. Fraunces only in the editorial annotation.

## Motion signature

Sports moves like a replay package: `grow` fast (350ms) for bars, `sweep` for
shot/momentum traces, `countup` on scoreboard numerals, `flipCard` on
player-card, `stateSwitch` for half/full-time toggles. Entrance staggers
tightest of all worlds (40ms) — broadcast pace. No ambient motion; the
`pulse` budget goes to a `LIVE`-style minute marker only in momentum-wave.

## Geometry doctrine

Real pitch/court geometry (105×68 pitch normalized to 0–100 coords, real goal
dimensions), real event data (Opta-attributed per house rules), real physics for
`flight-of-the-ball` (drag + Magnus, `physics/mechanics-and-flow.md`) — the
trajectory is computed, not drawn.

## Flagship components

| Kind | Role |
|---|---|
| `flight-of-the-ball` (WebGL, P5/P6) | THE sports hero — one famous shot's real physics, replayable |
| `tactics-pitch` / `shot-map` / `xg-race` / `momentum-wave` (existing) | the analysis natives |
| `elo-river` / `court-value` / `pace-ridge` (P5/P6) | the longitudinal set |

## Do / Don't

- DO keep the rivalry pair discipline (volt vs orange, stated in legends).
- DO put every match viz on chalk (the surface is the brand).
- DON'T use club crests, mascots, or kit graphics (rights + clutter).
- DON'T let volt text sit on light surfaces (fails AA — `--accent-deep` or ink).
