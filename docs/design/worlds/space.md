# World spec — SPACE

> **Register (one sentence):** *Mission control, mid-shift* — the reader sits at a
> console reading live-feeling instruments that happen to be beautifully typeset.

## The world's materials

Palette: `--bg #0a1628` deep navy · `--paper #111f36` console panel ·
`--paper-2 #0d1a2e` · `--ink #e8eef7` light · `--accent #00d4ff` signal cyan ·
`--accent-deep #0085a1` · `--accent-alt #ffb347` amber (alerts, secondary
tracks) · `--tape #2a4165`.

Roles: **cyan = the signal** (data, tracks, live elements); **amber = the anomaly
/ the second object** (alerts, comparison bodies, the story-object highlight when
cyan is structural); the navy dark is **paper, not "outer space"** — no star
fields, no nebulae, no skyboxes (CANON §11).

## Signature motifs (already strong — codified here)

1. **Telemetry chrome** (existing `.tel`/orbital-shells patterns): mono readouts,
   `● LIVE` pulse (`pulse` motion, one per viewport), `scan` sweep at ≤0.12.
2. **The graticule**: faint lat/lon or polar grids behind data (`--ink` @ 0.16) —
   space's version of ruled paper.
3. **Mission metadata**: `T+ HH:MM:SS` / epoch lines in card headers (mono,
   +0.08em) — every space viz states its time.
4. **The designation**: objects get their real catalog names (`2024 YR4`,
   `NORAD 25544`) as mono chips — precision is the aesthetic.

## Type treatment

Mono leads this world: readouts, designations, axes. Fraunces appears ONLY as the
editorial voice (section titles, the annotation callout inside a viz — rare,
deliberate). Case signature: UPPERCASE MONO everywhere data lives.

## Motion signature

Space is the one world with sanctioned ambient motion: `orbitIdle` on scenes,
`orbitBody` for real object motion (time-compression stated in caption, e.g.
"1 s = 30 days"), `pulse` on the live marker, `scan` on telemetry cards. Budget
per CANON: one ambient scene + one pulse per viewport. Entrances: `sweep` for
trajectories, `settle` for bodies arriving at epoch positions, `countup` for
readouts.

## Geometry doctrine

- Real numbers or nothing: altitudes, inclinations, orbital elements from the
  dossier; the physics sheets (`physics/orbital-mechanics.md`) are law.
- Scale honesty: true scale where readable; `log`-compressed radial scale
  otherwise, ALWAYS with the caption chip `distances log-compressed` (CANON §7).
- Line-art bodies: planets/moons are stroked circles or low-poly wireframes with
  paper-occluder cores (the country-globe treatment generalized) — never textured
  spheres.

## Flagship components

| Kind | Role |
|---|---|
| **`solar-system`** (WebGL) | THE space hero — navigable Keplerian solar system, epoch-correct positions, story-object highlighted |
| `orbit-globe` (WebGL, existing) | near-Earth: shells + constellations |
| `constellation-swarm` (WebGL, P5/P6) | the instanced mega-constellation wall |
| `lagrange-map` / `transfer-window` / `eclipse-cone` (P5/P6) | the mechanism explainers |

## Do / Don't

- DO make the reader feel the machine is live (pulses, epochs, designations).
- DO state every time-compression and scale choice in mono chips.
- DON'T render star fields, lens flares, photoreal planets, or "cosmic wonder"
  gradients — awe comes from the *numbers being real*.
- DON'T use amber and cyan together without meaning (amber = the anomaly).
- Contrast floor: cyan on navy passes for large text; body text stays `--ink`.
