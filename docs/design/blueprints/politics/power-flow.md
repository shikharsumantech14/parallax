# Blueprint — `power-flow` (politics · SVG · flagship of the SVG-flow family)

> Follow-the-money made structural: money / authority / votes flowing between
> institutions as a directional Sankey with animated flow dashes. The
> reference implementation for every future `flowDash` component
> (`carbon-loop`, `ballot-flow`, `packet-trace` budget bar).

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `power-flow` |
| World | politics (usable cross-world; wears the issue theme) |
| Tier | SVG (build-time layout, CSS/SMIL-free dash animation via CSS vars) |
| Component | `src/components/topic/politics/PowerFlow.astro` |
| CSS prefix | `px-pflow` |
| Flagship reference | ClimateSpiral.astro (build-time geometry + html.js-gated reveal pattern) |

## 2. What it shows / when to use

Where the quantity actually goes — sources, intermediaries, destinations,
with conservation visible.

- **USE WHEN:** the dossier has a flow table (from → to → amount, one unit)
  with ≥4 links and ≥2 layers; totals reconcile (or the imbalance IS the
  story and is flagged).
- **DON'T USE:** simple part-of-whole (→ `data-readout` tiles or
  `comparison`); bloc→vote flows (→ `vote-flow`, which owns that shape).
- **Pairs with:** `wide`; hero-capable for money-trail issues.

## 3. Data schema

```ts
interface PowerFlowData {
  nodes: Array<{ id: string; label: string; group?: 'source' | 'via' | 'sink' }>;
  links: Array<{ from: string; to: string; value: number; note?: string }>;
  unit: string;                    // "₹ cr" | "$m" | "seats" — labels every value
  imbalance?: 'the-point';         // suppresses the build-time conservation error
  caption?: string; source?: string;
}
```

```yaml
# example payload (electoral-bond style flow, illustrative)
unit: "₹ cr"
nodes:
  - { id: corp, label: "Corporate donors", group: source }
  - { id: trust, label: "Electoral trusts", group: via }
  - { id: bjp, label: "BJP", group: sink }
  - { id: inc, label: "INC", group: sink }
  - { id: oth, label: "Others", group: sink }
links:
  - { from: corp, to: trust, value: 2100 }
  - { from: trust, to: bjp, value: 1450, note: "≈69%" }
  - { from: trust, to: inc, value: 380 }
  - { from: trust, to: oth, value: 270 }
caption: "Where trust money landed: ≈69% of routed corporate giving reached one party."
source: "ECI disclosures, FY 2023-24"
```

## 4. Geometry spec (build-time, in the component frontmatter)

- **Columns:** node depth = longest path from any source (group hints
  override: source=0, sink=last). Column x positions evenly spaced across
  `W − 2·PAD − 2·GUTTER` (`W = 720`, `PAD = 8`, `GUTTER = 112` — the gutters
  hold the outward source/sink labels without enlarging the viewBox);
  `H = 40 + the tallest column's stacked height` (self-sizing). *(Clarified
  2026-07-05 from implementation feedback.)*
- **Node heights:** `h_n = max(26, throughput_n · K)` where throughput =
  max(Σin, Σout) and `K = 150 / max throughput`. Vertical packing per
  column: 18px gaps, column vertically centered.
- **Ribbons:** cubic Bézier bands `M x0,y0 C mx,y0 mx,y1 x1,y1` (mx =
  midpoint), band thickness ∝ value (same K), drawn as filled paths @ 0.30
  accent + a 1.5px centerline path (the dash carrier).
- **Conservation check:** for every `via` node, |Σin − Σout| ≤ 1% of Σin,
  else `throw` at build with a message naming the node — unless
  `imbalance: 'the-point'` (per `physics/mechanics-and-flow.md` §4).
- Value labels: mono `--viz-fs-value` on each ribbon at mid-x with paper
  halo; node labels sans 13px, right-aligned into sources / left-aligned out
  of sinks.

## 5. Motion spec

- Reveal (html.js-gated, `.px-viz:not(.is-in)` hidden states):
  nodes `grow` (scaleY from center, 400 ms, 50 ms column stagger) → ribbons
  `sweep` (dashoffset draw, 900 ms, starting 250 ms) → values `reveal`.
- `flowDash` on the centerlines: `stroke-dasharray: 2 6`, animated
  `stroke-dashoffset` via CSS `@keyframes` — **speed ∝ value**: duration
  `clamp(1.2s, 8·minValue/value s, 8s)` per link — the smallest flow sits at
  the 8s cap, the largest is fastest. *(Corrected 2026-07-05: the original
  `8·maxValue/value` yielded 8s for every link since value ≤ maxValue —
  caught during implementation.)* Runs continuously (this is the ONE ambient
  motion of the card).
- Reduced-motion: everything painted final; dashes STATIC but visible
  (dasharray stays — reads as directional stippling); no keyframes run.
- **Composed still:** full diagram, dashes visible as stipple.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| ribbons | `--accent` @ 0.30 (fills), centerline dash `--accent-deep` @ 0.9 |
| node bars | `--ink` @ 0.85; `via` nodes `--ink` @ 0.6 |
| labels | node sans `--ink`; values mono `--accent-deep`; notes `--muted` |
| the flagged imbalance (if the-point) | `--accent-alt` residual stub + mono label |

Single-accent discipline: NO per-link colors — the politics answer to
rainbow Sankeys is one red system and thickness doing the talking.

## 7. Fallback design

The SVG is build-time static already — no separate fallback needed. No-JS =
final painted diagram with stipple dashes (per §5). This IS the print plate.

## 8. Interaction spec

- None interactive in v1 (no hover targets — SVG stays pure). The ⤢ expand
  modal (automatic via `.px-viz`) is the study view.
- `note` strings render as small muted labels, not tooltips.

## 9. Comprehension text

- **Plain default:** "Money flows left to right — every band is one route,
  and thicker bands carry more. The moving dashes show direction."
- **how:** "Follow any band from its source to where it lands; the values
  are marked mid-stream."

## 10. Performance budget

SVG nodes ≤ 400 · payload ≤ 6 KB · no JS beyond the shared Reveal island.

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13)
- [ ] Conservation: a deliberately unbalanced `via` node FAILS the build
      with the node named; adding `imbalance: 'the-point'` renders the
      `--accent-alt` residual stub instead
- [ ] Ribbon thicknesses proportional (spot-check: 1450 vs 380 ≈ 3.8×)
- [ ] Largest flow's dashes visibly faster than the smallest's
- [ ] Reduced-motion: static stipple, full diagram painted
- [ ] No-JS: identical final diagram (view-source check)
- [ ] Values all carry the unit; mono + tabular; paper halo over ribbons
- [ ] One accent only (grep the component for color literals)
