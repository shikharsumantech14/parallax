# Parallax motion vocabulary

> **DRAFT AMENDMENTS AWAITING SIGNATURE (2026-09-04).** The `cardLift`,
> `pageEnter` and `worldFade` rows, the `hoverLift` scope note, hard rule 7 and
> the reduced-motion line for the two page motions were drafted at shell
> adoption against the shipped CSS. Until this line is removed they are the
> agent's draft, not law (REVAMP-PLAN §6). Open with them: whether `--t-page`
> stays 600ms or is retimed toward the handoff's ~300/340ms.
>
> The complete, closed set of motions used across the publication, the app, and
> story mode. Blueprints and specs reference these **by name** — "markers use
> `settle`, orbits use `orbitIdle`" — instead of restating curves. If a design
> needs a motion not on this list, that is a canon change: flag it, don't invent it.
>
> Timing tokens come from `shared/design/tokens.css` (`--t-instant` 80ms ·
> `--t-quick` 140ms · `--t-soft` 220ms · `--t-slow` 420ms · `--t-page` 600ms ·
> `--ease` cubic-bezier(0.22,1,0.36,1) · `--ease-snap` cubic-bezier(0.16,1,0.3,1)).

## The register

Parallax motion is **a chart being inked by a confident hand**: things draw, settle,
and then hold. Nothing bounces, nothing floats, nothing loops for decoration.
Continuous motion is reserved for phenomena that ARE continuous (orbits, flows,
live pulses) and must be slow enough to read as ambient, not busy.

## Named motions

### Entrances (fire once, on scroll-in via `[data-reveal]` / `.is-in`)

| Name | Spec | Use |
|---|---|---|
| `reveal` | opacity 0→1 + translateY 14px→0 · 700ms `--ease` · stagger children 60–90ms | the universal section/card entrance (existing Reveal contract) |
| `sweep` | stroke-dashoffset len→0 · 1200ms `--ease` · per-segment stagger totalling ≤1600ms | SVG path/line draws (spirals, traces, routes, Sankey links) |
| `grow` | scaleY or width 0→final, transform-origin at the axis · 600ms `--ease` · stagger 50ms | bars, columns, filled areas |
| `settle` | critically damped approach to final position — CSS: translate + 600ms `--ease-snap` (no overshoot); JS scenes: `p += (target−p) · min(1, 8·dt)` | markers/bodies/seats arriving at data positions |
| `countup` | numeric tween to the value already in the HTML · 900ms ease-out · tabular nums | big values (existing VizMotion contract) |
| `stamp` | opacity 0→1 + scale 1.12→1 + rotate −4°→−2° · 220ms `--ease-snap` · fires LAST in a card's sequence | verdict stamps, result seals (politics signature) |

### Continuous (ambient; only for phenomena that are truly continuous)

| Name | Spec | Use |
|---|---|---|
| `orbitIdle` | constant angular drift, yaw += 0.0004·dt(ms) ≈ 1 rev/4min · pauses off-viewport (runtime contract) | 3D scene auto-rotate when not being dragged |
| `orbitBody` | bodies advance along their real paths at a stated time-compression (e.g. "1s = 30 days" in the caption) | satellites, planets, moving story-objects |
| `flowDash` | stroke-dasharray 2 6 · dashoffset −= speed·dt · speed ∝ the flow's data value | directional flows: Sankey links, packet paths, currents |
| `pulse` | opacity 0.45↔1 · 2.4s sine · at most ONE pulsing element per viewport | live markers, "now" indicators |
| `scan` | a 1px accent line traversing the card · 6s linear · ≤0.12 opacity | telemetry surfaces (space/tech worlds only) |

### Interaction feedback (event-driven)

| Name | Spec | Use |
|---|---|---|
| `hoverLift` | translateZ 6px / scale 1.03 + opacity of siblings →0.55 · 150ms `--ease` | picked marks in scenes/charts — **marks only** (the inspect verb, CANON §9) |
| `cardLift` | **RETIRED 2026-09-04 (RD-05).** Cards, plates, index rows, letters and annotations no longer translate or cast a shadow on hover; the affordance is `border-color` only, 140ms `--ease` (`.px-viz:hover`, `.px-cat:hover`, `.px-trv-index__card:hover` are the shipped forms) | nothing — listed so a blueprint that reaches for it gets a hard answer |
| `tooltipIn` | opacity 0→1 + translateY 4px→0 · 140ms `--ease` · leave: 80ms | shared tooltip |
| `stateSwitch` | outgoing 160ms fade → geometry `settle` to new positions ≤600ms · never a hard cut | `setState` transitions (chamber division, scale toggles) |
| `flipCard` | rotateY 0→180° · 420ms `--ease` (existing `.px3d-flip`) | player-card and flip surfaces |
| `pressDown` | scale 0.98 · 80ms | buttons/chips on :active |

### Page/chrome (app + story mode)

| Name | Spec | Use |
|---|---|---|
| `plateIn` | opacity 0→1 + translateY 10px→0 · 420ms `--ease` | app plates/cards on load, one stagger level max |
| `lensSettle` | the two brand rings translate from ±6px overlap into registration + red sphere opacity 0→1 · 600ms `--ease-snap` · ONCE per surface | brand moment (login, welcome) — the only sanctioned flourish |
| `toastIn` | translateY 12px→0 + opacity · 220ms `--ease` · auto-dismiss 8s · leave 160ms | WelcomeBack toast, save confirmations |
| `pageEnter` | the CSS-native cross-document view transition (`@view-transition { navigation: auto }`, `base.css`) · `--t-page` **600ms** `--ease` · root crossfade, no transform | every navigation on the publication. **Named 2026-09-04; not retimed.** The handoff specifies ~300ms; `--t-page` is shared by five other transitions (welcome, dataviz), so retuning it is a token decision for the operator, recorded in REVAMP-PLAN §6, not made here |
| `worldFade` | **the same view transition**, when the navigation also changes `data-topic` — the whole palette crossfades with the root. No separate implementation exists or is needed | desk → desk, issue → home. The handoff's 340ms is likewise unadopted pending the `--t-page` decision |

## Hard rules

1. **No overshoot, ever.** Every ease lands from one side (`--ease`, `--ease-snap`
   are both overshoot-free). No `cubic-bezier` with y > 1, no spring bounce.
2. **One entrance per element.** Reveals fire once (existing IO contract); nothing
   re-animates on scroll-up.
3. **Stagger budget:** a card's full entrance sequence completes in ≤1.6s.
4. **Continuous-motion budget:** at most one `pulse` and one ambient scene motion
   (`orbitIdle`/`orbitBody`/`flowDash`) active per viewport.
5. **Hover states never move layout** — lift/opacity only, no size reflow.
6. **Time compression is honest:** any `orbitBody` speed is stated in the caption.
7. **Reading surfaces do not lift (RD-05, 2026-09-04).** Cards, plates and index
   rows respond to hover with `border-color` only. `hoverLift` is for a data
   MARK — the inspect gesture — and nothing else. The data-draw entrances
   (`sweep`, `grow`, `settle`, `countup`) are untouched by the flatness pass: a
   flat card still gets inked.

## Reduced motion (`prefers-reduced-motion: reduce`)

- **Entrances** → render final state immediately (existing `html.js` gating +
  dataviz-v2 resets). `countup` shows the final number (it's already in the HTML).
- **Continuous** → freeze at the **composed still**: the frame the blueprint
  designates as its print frame (see blueprint §motion). For orbital scenes that is
  bodies at their data epoch positions; for flows it is dashes visible but static;
  `pulse`/`scan` render at full opacity, static.
- **Interaction feedback** → `hoverLift` becomes opacity-only; `stateSwitch`
  becomes a hard swap; `flipCard` becomes an instant flip; tooltips appear/disappear
  without transition.
- **Chrome** → `lensSettle` renders the registered lockup; toasts appear statically;
  `pageEnter` / `worldFade` become an instant swap (the browser suppresses the
  view transition under reduced-motion on its own — nothing to gate). `cardLift`
  is retired, so there is nothing to reduce.
- Drag/zoom remain available (user-initiated motion is not animation), but
  `orbitIdle` auto-rotate stays off.

## No-JS

No `.js` class on `<html>` ⇒ no hidden states exist ⇒ everything paints in its
final/composed state. Interactive hints and controls that require JS are rendered
`hidden` and unhidden only by their island. This is the existing contract; motion
never breaks it.
