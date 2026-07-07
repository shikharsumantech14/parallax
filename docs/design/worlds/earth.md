# World spec — EARTH

> **Register (one sentence):** *The field atlas* — a surveyor's plate: contour
> lines, core samples, coordinates penciled in the margin.

## Materials

Palette: `--bg #f0e9d8` map paper · `--paper #fbf6e9` · `--paper-2 #ece3cc` ·
`--ink #1f2a1c` moss-black · `--accent #2d6a4f` forest · `--accent-deep #1a4a36` ·
`--accent-alt #a04922` USGS contour brown (sparing: strata, geology, heat) ·
`--tape #d8c89a`.

Roles: **green = the living datum** (forests, water, the measured value); **brown
= the geologic / the warmed** (strata, contours, heat anomalies). The fixed
climate ramp (cool blue → warm red) is a declared non-themeable encoding.

## Signature motifs

1. **Contours**: the world's texture — closed contour loops (`--accent-alt` @
   0.2–0.3) behind or within vizzes; elevation is the world's native language.
2. **The coordinate margin**: mono `27.9881° N, 86.9250° E` lines in card headers
   — every earth viz is *somewhere*.
3. **The specimen label**: serif italic species/place names + mono sample IDs —
   field-notebook typography.
4. **The measured rule**: scale bars (km, m, GtC) drawn as survey ticks — earth
   always shows its units graphically.

## Type treatment

Fraunces italic gets its widest use here (place names, specimen labels) — the
naturalist's hand. Mono for coordinates, depths, dates. Sentence-case labels;
the world's case signature is *lower-key* than politics/space — field notes, not
documents or consoles.

## Motion signature

Earth moves geologically: `sweep` for contours/tracks drawing, `grow` for strata
and water levels rising, `settle` for markers landing on maps. Ambient motion
only in `data-globe`/`storm-track` rotation (`orbitIdle`). Water in
`sea-level-tank` may drift ≤2px (counts as the ambient budget item).

## Geometry doctrine

Real geodesy: the shared country globe, real DEMs (per-issue quantized heightmap
JSON, `physics/geodesy.md` conventions), stated vertical exaggeration (`vertical
×12` caption chip). Natural Earth 50m for maps (per `src/components/AGENTS.md`
§5); two-pass land rendering stays.

## Flagship components

| Kind | Role |
|---|---|
| **`terrain-relief`** (WebGL, P2-stretch/P5) | THE earth hero — the story's real landscape as contour/ridgeline mesh |
| `data-globe` (WebGL, existing) | geo-located values |
| `climate-spiral` (existing) | the climate signature |
| `plate-motion` / `atmosphere-column` / `carbon-loop` / `storm-track` (P5/P6) | the mechanism set |

## Do / Don't

- DO ground every viz in a place (coordinates, names, scale bars).
- DO use the climate ramp only for actual temperature/anomaly data.
- DON'T use satellite-photo textures or terrain imagery — contours and ridgelines
  ARE the world's realism.
- DON'T let green mean "good" — it is the measured world, including when the
  measurement is grim.
