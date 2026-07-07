# Physics sheet — mechanics, flow & systems

> Reference for `flight-of-the-ball`, `queue-cliff`, `packet-trace`,
> `neural-flow`, `carbon-loop`, `sea-level-tank`, and the `settle` motion math.

## 1. Ball flight with drag + Magnus (flight-of-the-ball)

State **r**, **v**; spin vector **ω** (rad/s, axis = spin axis). Forces:
```
F_gravity = m·g,                g = 9.81 m/s² (−y)
F_drag    = −½·ρ·C_d·A·|v|·v
F_magnus  =  ½·ρ·C_L·A·|v|²·(ω̂ × v̂)
```
Constants (declare per sport in the blueprint; football defaults):
`ρ = 1.225 kg/m³` · football `m = 0.43 kg`, `r = 0.11 m`, `A = πr² = 0.0380 m²`,
`C_d = 0.25` (post-critical), `C_L = S/(2.2·S + 0.4)` with spin ratio
`S = r·|ω|/|v|` (clamped 0–0.35; gives C_L ≈ 0.21 at S = 0.25 — free-kick range).

Integrate **RK4, dt = 1/240 s**, precomputed at build (or on data load in the
scene) into a polyline of ~200 points — the scene animates a marker along it
(`orbitBody`-style, real-time or stated slow-mo). Sanity check: 30 m free kick,
v₀ = 25 m/s, sidespin 8 rev/s → lateral deviation ≈ 2–3 m.

Basketball: `m = 0.62 kg`, `r = 0.12 m`, `C_d = 0.47`, backspin typical 2 rev/s.
Cricket: `m = 0.16 kg`, `r = 0.036 m`; seam effects are NOT modeled — say so in
the caption if used ("swing not modeled").

## 2. Queueing (queue-cliff)

M/M/1: utilization `ρ = λ/μ` (arrival/service rate):
```
L (in system) = ρ/(1−ρ)        W (latency) = 1/(μ−λ) = (1/μ)/(1−ρ)
```
The interactive: slider drives λ; the curve plots latency multiplier `1/(1−ρ)`
vs ρ — flat until ~0.7, vertical past 0.9. Annotations from data (e.g. "your
API at Black Friday"). The honest footnote: real systems are worse (M/M/1 is
the OPTIMISTIC case) — bake that line into the component.

## 3. Light in fiber (packet-trace)

`v_fiber = c/1.468 ≈ 204 000 km/s` → **~4.9 ms per 1000 km** one-way, ×2 for
RTT. Budget bar = per-hop RTT from data; the "speed-of-light floor" line =
`2·d_greatcircle/v_fiber` — the gap between floor and measured is the story
(routing, queuing, handshakes). Distances via geodesy §2.

## 4. Stocks & flows (carbon-loop, sea-level-tank)

- Conservation check at build: for each stock, Σ(in) − Σ(out) = stated Δ/yr;
  build FAILS loudly on imbalance > 1% unless data carries
  `imbalance: 'the-point'` (for carbon, the atmosphere's +5.1 GtC/yr IS the
  story — render the accumulation visibly).
- `flowDash` speed ∝ flux value, normalized to the largest flux = dash speed
  60 px/s, floor 8 px/s.
- Sea-level tank: water plane `grow`s to level; landmark silhouettes are simple
  ink outlines with mono height labels; stated datum (e.g. "vs 2000 mean").

## 5. Neural forward pass (neural-flow)

Layer sizes from data (real architecture — e.g. [784, 512, 512, 10]); rendered
as instanced node columns (cap: sample ≥1024-unit layers down to ≤256 shown,
say "showing 1 in N" in the legend — honesty chip). The "wave": per-layer
`settle` stagger, 90 ms/layer. Param count in the readout:
`Σ (n_l·n_{l+1} + n_{l+1})` — computed, not hardcoded.

## 6. The `settle` motion (shared)

Frame-rate-independent critically damped approach (used by JS scenes):
```
p += (target − p)·min(1, k·dt)     k = 8 s⁻¹  (dt in seconds)
```
Reaches 98% in ~0.5 s; never overshoots. CSS equivalent: 600 ms `--ease-snap`.

## 7. Moore fit (moore-ladder)

Linear regression on `log2(transistors)` vs year; slope `m` → doubling time
`= 1/m` years, printed in the legend ("doubling every 2.1 yr over this range").
Points are the data; the fit line is `sweep`-drawn last.
