# Blueprint — `queue-cliff` (tech · HTML-interactive · FLAGSHIP)

> The utilization cliff, made draggable: one slider drives arrival rate, and
> the reader watches latency stay flat, flat, flat — and then go vertical past
> ρ ≈ 0.9. The exact **M/M/1** curve (`W_mult = 1/(1−ρ)`), not a hand-drawn
> swoop. The "why can't we just run the servers at 100%?" question answered by
> the reader's own hand on the slider, with the honest footnote baked in: real
> systems are *worse* than this — M/M/1 is the optimistic case.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `queue-cliff` |
| World | tech |
| Tier | HTML-interactive (one slider; SVG curve; zero WebGL, zero framework — a tiny vanilla island) |
| Component | `src/components/topic/tech/QueueCliff.astro` |
| Scene module | none (no WebGL) |
| Shared math | inline pure helpers in the island (`wMult(rho) = 1/(1−rho)`, `L(rho) = rho/(1−rho)`) — trivial enough to live in the component, but mirrored 1:1 from `physics/mechanics-and-flow.md` §2 |
| CSS prefix | `px-qc` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, `src/styles/`) |
| Flagship reference | `swing-dial`/`throughput-dial` (single-control CSS island grammar), `scaling-plot` (SVG curve + axis + build-time path), `ReadingToolbar.astro` (the vanilla `is:inline` island + `html.js` gating contract) |

## 2. What it shows / when to use

Why a queue's latency explodes near full utilization — the reader drags one
control (offered load) and the curve shows the wait multiplier climbing to a
vertical wall as ρ → 1. It teaches the shape, then names one real operating
point on it.

- **USE WHEN:** the story hinges on the utilization/latency trade-off — a
  capacity-planning piece, an incident where a system was run "too hot", a
  "why we keep headroom" explainer. The dossier needs a service rate μ (or a
  baseline capacity) and ideally 1–3 named annotation points (`{ rho, label }`
  — "steady state", "Black Friday", "the incident").
- **DON'T USE:** a general x/y power law or cost curve (→ `scaling-plot`); a
  single live utilization number without the trade-off argument (→
  `throughput-dial`); a request's timing breakdown (→ `latency-waterfall`);
  multi-server queues or priority classes (M/M/1 only — say so, don't fake
  M/M/c). If the point is throughput saturation not *latency*, use
  `throughput-dial`.
- **Pairs with:** default width or `wide`; a quiet section either side (it is
  a "loud" interactive — CANON §3 eye-rest rule). Can be the hero for a
  queueing/capacity issue with `layout: split` (prose walks the reader from
  ρ = 0.5 to the cliff), but it is NOT a WebGL kind, so the "never two WebGL
  adjacent" rule does not gate it.

## 3. Data schema

```ts
interface QueueCliffData {
  muPerSec: number;            // service rate μ (requests/sec the system can clear); >0
  serviceMs?: number;          // per-request service time 1/μ in ms; if given, μ = 1000/serviceMs
                               // (provide ONE of muPerSec | serviceMs; serviceMs wins if both, with a build warning)
  startRho?: number;           // initial slider position, 0..0.99; default 0.5
  maxRho?: number;             // right edge of the plotted domain, 0.90..0.995; default 0.98
                               // (never 1.0 — the asymptote is undrawable; the curve stops one step short)
  annotations?: Array<{        // named operating points pinned to the curve; ≤3 (CANON text budget)
    rho: number;               // 0..maxRho
    label: string;             // ≤4 words ("steady state", "Black Friday")
    tone?: 'ok' | 'hot';       // 'ok' → accent, 'hot' → accent-alt; default by rho (≥0.85 ⇒ hot)
  }>;
  caption?: string;            // every viz kind
  source?: string;             // every viz kind
}
```

```yaml
# example payload (an API sized at 1000 rps, run near the edge on peak)
muPerSec: 1000
startRho: 0.5
maxRho: 0.98
annotations:
  - { rho: 0.50, label: "normal day",   tone: ok }
  - { rho: 0.85, label: "peak hour",    tone: hot }
  - { rho: 0.95, label: "Black Friday", tone: hot }
caption: "At 95% utilization the average request waits 20× longer than at 50% — same servers, five points more load."
source: "M/M/1 model · capacity from the 2025 load test"
```

**Data flags with visual consequences (CANON §7):**
- The y-axis is **latency multiplier `1/(1−ρ)`**, dimensionless and unbounded;
  it is drawn on a **clipped linear axis** capped at the multiplier for
  `maxRho` (e.g. maxRho 0.98 → y-cap 50×). The component ALWAYS renders the
  mono chip `y capped at {yCap}× · M/M/1` — honesty about the clip: the plotted
  curve climbs to the y-cap at the top-right **corner** (ρ = maxRho), and
  everything past it (ρ ∈ (maxRho, 1), where the multiplier runs 50×→∞) is the
  **undrawable asymptote** the cap holds back. *(Corrected 2026-07-06: the
  earlier wording said the curve "runs off the top past maxRho", but with
  `yCap = wMult(maxRho)` and the domain ending at maxRho the curve reaches the
  ceiling exactly at the corner — nothing is drawn past maxRho. The clip's
  honesty is the off-scale ρ→1 region, not an in-frame overshoot.)*
- The component ALWAYS renders the baked honesty line (not a chip — a visible
  footnote in the card): **`M/M/1 is the optimistic case — real systems, with
  variable service times and bursty arrivals, are worse.`** (`physics/
  mechanics-and-flow.md` §2 mandates this.) It is part of the component, not
  the author's caption.

## 4. Geometry spec

**Math (mirrors `physics/mechanics-and-flow.md` §2, M/M/1):**
- Utilization `ρ = λ/μ` — the slider drives λ; ρ is what's plotted.
- `wMult(ρ) = 1/(1 − ρ)` — the **latency multiplier** vs the ideal (ρ→0) wait.
  This is the plotted curve. `L(ρ) = ρ/(1−ρ)` (mean number in system) and
  `W(ρ) = (1/μ)/(1−ρ)` (absolute latency) are shown in the live readout.
- **Worked anchor (recompute exactly):** `wMult(0.5) = 2.00×`,
  `wMult(0.7) = 3.33×`, `wMult(0.9) = 10.0×`, `wMult(0.95) = 20.0×`,
  `wMult(0.98) = 50.0×`. Absolute latency at μ = 1000 rps (service 1 ms):
  `W(0.95) = 1ms/(1−0.95) = 20 ms`, `W(0.5) = 2 ms` → the readout at ρ = 0.95
  shows "20 ms (20× the ρ→0 floor of 1 ms)". These five points ARE the
  acceptance table.

**SVG plot (build-time skeleton, live-updated overlay):**
- viewBox `0 0 720 420`. Plot area `x` 72→696 (`W_plot = 624`), `y` 40→360
  (`H_plot = 320`); 24px bottom band for the x-axis, left 60px for the y-axis.
- **x-axis:** ρ from 0 to `maxRho`, linear. `x(ρ) = 72 + ρ/maxRho · W_plot`.
  Ticks at 0, 0.25, 0.5, 0.7, 0.9, `maxRho` (mono 9.5px, `+0.08em`, uppercase).
  Axis label `UTILIZATION ρ` centered under.
- **y-axis:** multiplier 1 to `yCap = wMult(maxRho)`, linear, clipped.
  `y(m) = 360 − (m − 1)/(yCap − 1) · H_plot` (clamped to the plot top).
  Ticks at 1×, and at the multipliers for ρ = 0.5/0.7/0.9 (2×, 3.33×, 10×) plus
  yCap. Axis label `LATENCY vs IDEAL` rotated.
- **The curve:** sampled `1/(1−ρ)` over ρ ∈ [0, maxRho] at **200 steps**, as one
  SVG `path` (`M`/`L`), `--accent` @ 0.9, 2px, `paint-order:stroke`. Built at
  build time so no-JS shows the full curve.
- **The "flat then vertical" read is inherent** — do not exaggerate the axis to
  dramatize it (CANON §7: charts don't lie even beautifully). The clip cap is
  the only manipulation and it is chipped.
- **The slider handle → a live marker:** a 5px-radius `--accent` dot rides the
  curve at the current ρ, with a vertical drop-line to the x-axis (`--ink` @
  0.42, 1px dashed) and a horizontal line to the y-axis. The **area under the
  curve left of the marker** fills `--accent` @ 0.10 (the "you are operating
  here" region).
- **Annotations:** each pinned at `(x(rho), y(wMult(rho)))` as a 3px ring +
  mono label with a 1px leader, `tone`-colored (ok = `--accent-deep`, hot =
  `--accent-alt`), paper halo. Labels placed above-right by default, flipping
  below-left if within 60px of the right/top edge (collision policy — labels
  never leave the viewBox).
- **375px:** SVG `max-width:100%`, `height:auto`; the slider control stacks
  below the plot full-width (44px min touch height); tick labels thin to
  0/0.5/0.9/maxRho on x and 1×/10×/yCap on y; annotation labels that would
  collide at narrow width collapse to just their ring + a number, full labels
  moving into the readout on tap.

## 5. Motion spec (names from motion.md)

- **Reveal** (html.js-gated, `.px-viz:not(.is-in)` hidden states): axes
  `reveal` → the curve `sweep` (stroke-dashoffset len→0, 1200ms `--ease`) →
  annotations `reveal` (staggered 90ms) → the slider + readout `reveal`. Tech
  cadence: the curve draw is the signature entrance.
- **Slider drag:** the live marker + drop-lines + area fill + readout update
  **synchronously with input** (not animated — direct manipulation is
  user-driven, not a transition; motion.md: drag is not animation). The readout
  numbers do NOT `countup` on drag (that's for entrance values only); they
  track the handle 1:1.
- **`pressDown`** on the slider thumb (`scale 0.98`, 80ms) on `:active`.
- **No ambient motion** — this card holds still until touched (it is not a
  continuous phenomenon; the cliff is a fixed law). Zero `pulse`, zero
  `flowDash`.
- **Composed still (reduced-motion / no-JS / print):** full curve drawn, axes
  + all annotations painted, the marker + drop-lines + area fill at `startRho`
  (0.5), the readout showing the ρ = 0.5 values, and the honesty footnote. The
  slider renders (functional if JS loads; under no-JS it is a plain `<input
  type=range>` that still shows its start value — but the marker is baked at
  startRho so the still is complete without it moving). Reduced-motion: the
  reveal is skipped (final state), drag still works, no transitions on update.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| axes + ticks | `--ink` @ 0.42 (lines), `--muted` (tick labels) |
| the curve | `--accent` @ 0.9 |
| operating-region fill (under curve, left of marker) | `--accent` @ 0.10 |
| live marker + drop-lines | `--accent` @ 1.0 (dot), `--ink` @ 0.42 dashed (lines) |
| annotation — ok tone | `--accent-deep` @ 1.0 |
| annotation — hot tone | `--accent-alt` @ 1.0 |
| readout values | mono `--accent-deep`; labels `--muted` |
| honesty footnote | `--muted`, mono, small — never accented (it's a caveat, not a highlight) |

Single-accent discipline with the ONE sanctioned exception: `--accent-alt`
marks the **hot** operating points (worlds/tech.md: pink = the hot path / the
danger zone). No per-annotation custom colors; `tone` selects between the two
declared tokens only.

## 7. Fallback design (first-class)

The whole card is HTML+SVG and build-time; there is no separate fallback to
design — the no-JS reader gets:

- The full **static curve** (built at build time, §4), axes, and all
  annotations — the law is fully visible without the slider.
- The marker + drop-lines + area fill **baked at `startRho`**, so the "you are
  operating here" read is present statically.
- The honesty footnote (static text).
- A **companion readout table** below (`.vz-legend` rows): one row per
  annotation — `{label} · ρ {rho} · {wMult}× · {W_ms} ms` — plus a header row
  for the current point. This is the AT-readable data source. ≤ 5 rows visible
  (annotations are capped at 3, so no collapse needed, but the current-point +
  min/max rows keep it ≤ 5).
- Under no-JS the `<input type=range>` is present and styled but inert (its
  `oninput` island never wires); the reader still reads the whole argument from
  the static curve + table. Under JS, the island takes over and the slider
  becomes live.

## 8. Interaction spec

- **The ONE control (CANON §9): a single slider** (`<input type="range">`,
  min 0, max `maxRho`, step 0.01, value `startRho`). Dragging it drives ρ; the
  marker, drop-lines, area fill, and the live readout update 1:1. No second
  control — no μ slider, no toggle, no state chips.
- **Readout** (mono, above or beside the slider), live: `ρ = {rho} · wait
  {wMult}× · {W_ms} ms · {L} in queue`. Values from the current ρ:
  `wMult = 1/(1−rho)`, `W_ms = (1000/μ)/(1−rho)`, `L = rho/(1−rho)`.
- **Snap affordance:** dragging near an annotation's ρ (within 0.015) gently
  snaps the handle to it and surfaces that annotation's label in the readout
  ("← Black Friday") — a discoverable nicety, not required to read anything.
- **Keyboard:** the slider is a native range input — arrow keys step ρ by 0.01,
  Page keys by 0.05, Home/End jump to 0/maxRho; the readout updates and is in
  an `aria-live="polite"` region so AT announces the new latency. The SVG plot
  is `aria-hidden` (decoration over the live readout + the fallback table).
- **Touch:** the range input has a ≥44px touch target (thumb + padded track);
  `touch-action` on the slider is default (it's a control, not a scene) — the
  page still scrolls around it.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "Drag the slider to raise how busy the
  system is; the curve is the exact math of how long each request then waits —
  barely rising until it's nearly full, then shooting almost straight up."
- **how** (ExpandModal): "Drag the slider from calm to busy. Watch the wait
  time barely move — until you pass about 90%, where it goes vertical."
- Caption guidance: state the operating-point claim in concrete multiples ("at
  95% utilization the average request waits 20× longer than at 50%"), never
  restate the form. Text budget at rest — the two chips + honesty footnote +
  ≤3 short annotation labels + readout + caption + plain — stays ≤ 80 words
  (REVIEW amendment 3); annotation labels are ≤4 words for this reason.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 260 (curve is one 200-point path counted as 1 node + axes + ≤3 annotations + marker group) |
| JS (island) | ≤ 1.5 KB min+gz — a single `oninput` handler updating marker transform + readout text; no framework, no import |
| `data` payload | ≤ 1 KB |
| Extra assets | none |
| Reflow on drag | zero layout thrash — update only `transform`/`d` on the marker + `textContent` on the readout (no width/height writes) |

No WebGL, no lazy chunk — the island is inline `is:inline` per the near-zero-JS
contract, gated by `html.js` (motion.md no-JS section).

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight: silhouette (static curve reads as the
      cliff) · 375px (slider stacks, ≥44px) · reduced-motion still (curve +
      marker at startRho, no reveal) · token grep (only lime + the declared
      pink hot tone) · caption+source+plain · no-JS = full static curve + table
      · payload degradation (missing annotations ⇒ bare curve) · prefix `px-qc`
      unique)
- [ ] `wMult` matches the anchor table exactly: 0.5→2.00×, 0.7→3.33×,
      0.9→10.0×, 0.95→20.0×, 0.98→50.0× (the acceptance table — grep the
      component: the curve is `1/(1−ρ)`, not a hand-tuned Bézier)
- [ ] At μ = 1000, the readout at ρ = 0.95 shows `20× · 20 ms · 19 in queue`
      (W = 1/(1−0.95) ms = 20 ms; L = 0.95/0.05 = 19)
- [ ] Exactly ONE control (the slider); no second slider/toggle/chip (CANON §9)
- [ ] The honesty footnote `M/M/1 is the optimistic case — real systems … are
      worse.` renders in the card, always, regardless of caption
- [ ] The y-cap chip `y capped at 50× · M/M/1` renders for maxRho 0.98; the
      curve climbs to the y-cap (50×) at the top-right corner (ρ = maxRho), and
      the region ρ ∈ (0.98, 1) is off-scale (undrawn) — the cap, not an in-frame
      overshoot, is what the chip is honest about
- [ ] Dragging updates marker + drop-lines + area fill + readout with no
      animation and no layout reflow (only transform/text writes)
- [ ] Annotations pin at the correct curve points, tone-colored, labels inside
      the viewBox at 375px (no overrun)
- [ ] Keyboard: arrow keys step ρ; the readout is `aria-live` and announces
      the new latency; the SVG is `aria-hidden`
- [ ] No-JS: full static curve + all annotations + the marker at startRho + the
      readout table — the argument is complete without the slider working

---

*Registry duties (P6, at implementation — NOT now): add `queue-cliff` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`,
`EXPLAIN` entry (`src/lib/explainers.ts`), catalog block (`docs/design/catalog.md`
— `npm run check:catalog` must pass), prefix `px-qc` in `src/components/AGENTS.md`
§4, worked example in `2026-06-03-tech-showcase`. No scene registry entry (no
WebGL).*
