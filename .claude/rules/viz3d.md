---
paths:
  - "src/scripts/viz3d/**"
  - "src/components/core/Viz3DRuntime.astro"
---

# The WebGL subsystem

**14 section kinds** use WebGL. `three` is self-hosted and lazy-loaded: the
runtime dynamic-imports it only when a `[data-viz3d]` mount scrolls in, and each
scene is its **own code-split chunk**. It never loads on home, topic indexes, or
any page without a 3D kind. Keep it that way — this is the single largest
potential regression in the JS budget.

## Layout

- `runtime.ts` — boots on scroll-in, dynamic-imports `three`
- `scenes/index.ts` — the registry, **one line per scene**, each its own chunk
- `scenes/<name>.ts` — the scene
- shared physics helpers at the `viz3d/` level: `helpers`, `kepler`, `terrain`,
  `hemicycle`, `neural`, `terminator`, `ballistics`, `packet`

Mounted once per issue via `core/Viz3DRuntime.astro`.

## The fallback contract is absolute

Every 3D kind must paint its **final composed state** with:

- **no JS** — hidden states are gated behind the `html.js` class set by the
  inline `<head>` guard
- **`prefers-reduced-motion`** — ambient rotation freezes to a composed still
- **no WebGL** — the mount degrades, it does not blank

RD-06: the 8 ambient rotations stay alive, pause off-viewport, and freeze under
reduced motion. The handoff's one-loop-per-page budget was rejected.

## Traps that have actually bitten

- **Globe seed-yaw to face longitude `cLon` is
  `drag.s.yaw = -((cLon + 90) * Math.PI) / 180`.** A `+180` there opens on the
  limb — the globe renders, looks plausible, and shows the wrong hemisphere.
- `public/geo/plates.json` backs the plate-motion scene; `countries-110m.json`
  backs the choropleth globes.
- `src/scripts/viz3d/packet.ts` is shared by **both** `PacketTrace.astro` and
  its scene — change one, check the other.

## Adding a scene

A WebGL kind is registry place **8 of 9** (`scenes/index.ts`) on top of the six
`wire-kind.mjs` handles. Missing it means the component mounts and nothing
draws, with a green build. See the `add-section-kind` skill.
