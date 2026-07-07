# World spec — TRAVEL

> **Register (one sentence):** *The field journal with tickets stapled in* — a
> traveler's kept notebook: routes inked on cream, stubs, stamps, margins that
> smell of paper.

## Materials

Palette: `--bg #faf6ef` cream · `--paper #fffdf7` · `--paper-2 #f4ecdb` ·
`--ink #2a1f15` sepia-black · `--accent #c85a3c` terracotta · `--accent-deep
#9a4028` · `--accent-alt #2d6a7a` sea teal (water, rivers, the second route) ·
`--tape #e8d5a8`.

Roles: **terracotta = the journey** (routes, stops, the traveler's line); **teal
= water / the alternative** (sea legs, comparison routes). Warmest world on the
site — generous cream margins are the luxury.

## Signature motifs

1. **The stub**: ticket-stub cards — perforated edge (dashed rule + punched
   semicircles via radial-gradient background), mono fare/route codes (`DEL→LHR`),
   `--tape` fill.
2. **The route line**: dashed terracotta paths with stop dots + city labels — the
   world's native line (route-card, journey-map, route-globe arcs).
3. **The stamp cluster**: entry-stamp marks (rotated 1.5px-border rounded rects,
   mixed rotations −6°…+4°, `--accent-alt` and `--accent-deep` inks @ 0.75) as
   card corner furniture — sparing, 1–2 per issue.
4. **The margin note**: Fraunces italic asides ("the queue starts before dawn") —
   the journal voice, travel's version of the politics annotation.

## Type treatment

The romance world: Fraunces italic works hardest here (place names, margin
notes); the `Vol. I, No. 01` masthead exception stays. Mono for codes, fares,
times, offsets. Case signature: italic serif place names + uppercase mono codes.

## Motion signature

Travel moves at walking pace: `sweep` for routes drawing (the signature —
slightly slower, 1400ms), `settle` for stops landing, `stamp` for arrival marks,
`orbitIdle` on route-globe. Longest ease durations of any world; nothing snaps.

## Geometry doctrine

Real geodesy for routes (great circles via the shared globe/`geodesy.md`), real
elevations for treks (shares the barometric/altitude math with earth), honest
time-zones (`terminator-globe` uses the real subsolar point).

## Flagship components

| Kind | Role |
|---|---|
| `terminator-globe` (WebGL, P5/P6) | THE travel hero — day/night line + the flight arc = jet lag made visible |
| `route-globe` (WebGL, existing) | the multi-stop journey |
| `season-wheel` / `city-grid` / `altitude-oxygen` / `fare-terrain` (P5/P6) | the planner's instruments |

## Do / Don't

- DO let the margins breathe — travel is the whitespace showcase world.
- DO use stub/stamp furniture sparingly (furniture, not content).
- DON'T use photographic postcards or watercolor clichés; ink on cream carries it.
- DON'T compress travel's pacing to match tech's — slow is the register.
