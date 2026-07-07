# Blueprint — `packet-trace` (tech · WebGL globe + synced SVG · FLAGSHIP)

> A request crossing the planet, told twice at once: a country-outline globe
> with the route drawn as great-circle arcs, packets running the arcs as
> `flowDash` dots — and, locked beneath it, an SVG **latency-budget bar** that
> decomposes the round trip hop-by-hop against the hard **speed-of-light
> floor** (`2·d/v_fiber`). The gap between the floor and the measured time is
> the whole story: routing, queuing, TLS handshakes, the last mile. "You can't
> beat physics — here is exactly how much slower than physics your request is."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `packet-trace` |
| World | tech (usable cross-world for any geo-timed flow; wears the issue theme) |
| Tier | WebGL (globe arcs, `extends globe`) **+** build-time SVG budget bar, the two synced |
| Component | `src/components/topic/tech/PacketTrace.astro` |
| Scene module | `src/scripts/viz3d/scenes/packetTrace.ts` |
| Shared math | reuses `kepler.ts` `greatCircle()` (arc points) + a NEW pure `src/scripts/viz3d/packet.ts` (great-circle distance, per-hop light floor, budget layout) — feeds BOTH the scene and the SVG, kepler.ts-style |
| CSS prefix | `px-pkt` (verified free 2026-07-06: grep `meta.css`, `base.css`, `src/components/`, `src/styles/`) |
| Flagship reference | `routeGlobe`/`globe.ts` (arc drawing, `buildCountryGlobe`, `makeLabels`), `power-flow` (the `flowDash` centerline grammar + the build-time SVG bar layout) |

## 2. What it shows / when to use

A single request's journey as geography **and** as a time budget: where the
bytes physically travel, and where the milliseconds actually go once you
subtract the unbeatable minimum physics allows.

- **USE WHEN:** the dossier has a real trace — an ordered hop list, each with
  a `from`/`to` city (lat/lon) and a measured RTT in ms, and the story is
  "why is this slow / where does the time go" (a CDN post-mortem, an
  inter-region latency piece, a submarine-cable story). Total measured RTT and
  the great-circle light floor must both be computable from the data.
- **DON'T USE:** timed spans of a *local* request with no geography (→
  `latency-waterfall` owns the hop-waterfall shape without the globe); a
  multi-stop *travel* journey where the arcs are the point and timing is not
  (→ `route-globe`); throughput as one live number (→ `throughput-dial`); a
  static "these cities are far apart" fact (→ `route-globe` or `data-globe`).
- **Pairs with:** `layout: split` as the issue hero — the prose walks the
  budget bar segment-by-segment while the globe holds and packets loop; `wide`
  standalone. Never adjacent to another WebGL kind (CANON §2). Never `bleed`
  (the SVG bar needs a measured reading width, not edge-to-edge).

## 3. Data schema

```ts
interface PacketTraceData {
  hops: Array<{
    from: string;          // city label, e.g. "Mumbai"
    fromLat: number; fromLon: number;   // deg
    to: string;            // city label, e.g. "Frankfurt"
    toLat: number; toLon: number;       // deg
    rttMs: number;         // MEASURED round-trip for THIS hop, ms (>0)
    kind?: 'fiber' | 'wireless' | 'satellite' | 'compute';
                           // 'compute' = a server-side segment with ~0 distance
                           // (its floor is 0; the whole bar is overhead). default 'fiber'.
    note?: string;         // ≤6 words, shown in tooltip/segment ("TLS + DNS")
  }>;                      // 1–8 hops; build error outside that range
  originLabel?: string;    // overrides hops[0].from for the readout ("your laptop")
  refractiveIndex?: number;// fiber n; default 1.468 (→ v_fiber ≈ 204,218 km/s). 1.0 = vacuum/RF line-of-sight.
  caption?: string;        // every viz kind
  source?: string;         // every viz kind
}
```

```yaml
# example payload (a Mumbai→Frankfurt→Virginia API call, illustrative-but-real geography)
hops:
  - { from: "Mumbai",    fromLat: 19.08, fromLon: 72.88, to: "Frankfurt", toLat: 50.11, toLon: 8.68,  rttMs: 118, kind: fiber,   note: "MELT cable" }
  - { from: "Frankfurt", fromLat: 50.11, fromLon: 8.68,  to: "Frankfurt", toLat: 50.11, toLon: 8.68,  rttMs: 42,  kind: compute, note: "TLS + edge" }
  - { from: "Frankfurt", fromLat: 50.11, fromLon: 8.68,  to: "Ashburn",   toLat: 39.04, toLon: -77.49, rttMs: 96, kind: fiber,   note: "TAT-14" }
originLabel: "Mumbai edge"
caption: "A 256 ms round trip — but physics only demands 108 ms of it. The other 148 ms is everything humans added."
source: "Cloudflare Radar trace, measured 2026-05"
```

**Data flags with visual consequences (CANON §7):**
- The globe's radial arc scale is **not** metric (arcs bulge above the surface
  for legibility, per geodesy §2 `h = 0.05–0.18`) — this is a standard route
  aesthetic, not a data claim, so **no chip** (the *distances* in the budget
  bar are honest; the bulge is decoration only).
- The component AUTO-COMPUTES and displays the **speed-of-light floor** and
  always renders the mono chip `floor = {floorMs} ms · measured {measMs} ms`
  (the honesty core of the card — the reader is told the physical minimum in
  the same breath as the measured total).
- Live scene renders the ambient-motion chip `packets ≈ {loop_s}s / trip`
  (time-compression honesty — real packets cross in ms).
- `refractiveIndex: 1.0` renders the chip `vacuum floor (line-of-sight)` so a
  radio/satellite comparison never silently claims fiber physics.

## 4. Geometry spec

### `packet.ts` (the shared pure math — mirrors `physics/mechanics-and-flow.md` §3 + `physics/geodesy.md` §2)

- `V_FIBER_KMS(n = 1.468) = 299792.458 / n` → **204,218 km/s** at n = 1.468
  (≈ **4.897 ms per 1000 km one-way**, ×2 = 9.793 ms RTT).
- `greatCircleKm(a, b): number` = `R_E · Δ`, `R_E = 6371 km`, `Δ = acos(â·b̂)`
  (geodesy §2). Reuse `kepler.ts greatCircle()` for the arc *points*; this
  function returns only the scalar distance.
- `hopFloorMs(hop, n): number` = `hop.kind === 'compute' ? 0 :
  2 · greatCircleKm(from, to) / V_FIBER_KMS(n) · 1000` (RTT floor, ms).
- `budget(hops, n): { floorMs, measMs, segments }` where
  `floorMs = Σ hopFloorMs`, `measMs = Σ rttMs`, and each `segment` carries
  `{ label, floor, measured, overhead: measured − floor, x0, w }` — the
  segment's on-screen extent (see the bar layout below).
- **Acceptance anchor (worked, recompute this exactly):** `V_FIBER_KMS(1.468)
  = 204,218 km/s` (≈ 9.793 ms RTT per 1000 km). Mumbai→Frankfurt great-circle
  = **6,564 km** (â·b̂ from the payload coords → Δ = 1.0303 rad → 6,371·1.0303).
  Floor = `2·6564/204218·1000` = **64.3 ms**; measured 118 → overhead
  **53.7 ms**. Frankfurt→Ashburn = **6,549 km** → floor **64.1 ms**; measured
  96 → overhead **31.9 ms**. Compute hop floor **0**, overhead **42 ms**.
  Totals: floor **128.4 ms**, measured **256 ms**, overhead **127.6 ms**. (The
  caption's "108/148" is illustrative editorial rounding of an earlier trace;
  the chip shows the *computed* 128/256 — the component never trusts an
  authored total.)

### Globe scene (`extends globe` — reuse `globe.ts` wholesale)

- Build the shared Earth via `buildCountryGlobe(THREE, group, colors, R, disp)`,
  `R = 1.0` scene units — identical occluder + graticule + coastlines as the
  other globes (do NOT restate globe geometry).
- **Arcs:** per hop, `greatCircle(from, to, 64)` → 65 lat/lon points → each
  through `latLon(THREE, lat, lon, R·(1 + h·sin(πt)))`, bulge
  `h = 0.06 + 0.10·(Δ/π)` (geodesy §2 range 0.05–0.18). One
  `LineBasicMaterial` polyline per hop, `--accent` @ 0.85, 1px. `compute`
  hops (from==to) draw NO arc — they render as a **0.03-radius pulsing ring**
  at the city (the "work happens here" marker), `pulse` motion (the ONE
  pulse in the viewport, §5).
- **Packets:** per fiber/wireless hop, a small `--accent` sphere (radius 0.012,
  or a 2-point additive `glowSprite(accent, 0.06)` for the crest) advances
  along the hop's polyline as a `flowDash`-style runner — **one packet dot per
  hop, staggered** so the trip reads as a relay (hop l starts its packet at
  `l · loop_ms / hops.length`). Speed is uniform arc-length per hop (not
  time-accurate per-hop — the honest per-hop timing is the SVG bar's job; the
  globe shows the *path* and *direction*).
- **City nodes:** each unique city = a 0.02-radius `--ink` @ 0.9 sphere on the
  surface; origin + final destination get `--accent-alt` @ 1.0 (the endpoints
  of the story). Labels via `makeLabels`, priority 2 (data labels win over the
  faint country labels), one per unique city, `{city}` mono 9.5px.
- **Camera:** the globe scene's own `dragController(canvas, 0.35)` (the globe
  family's controller, NOT `makeOrbitControls`) — **but** on boot, orient the
  globe so the route's centroid faces the camera: initial `yaw` = `−(mean hop
  lon + 180)·π/180`, so the reader opens on the route, not the Pacific.
  `orbitIdle` auto-rotate is **OFF** on this component (drag-to-spin only) —
  the `flowDash` packets are already this card's one ambient scene motion, and
  running `orbitIdle` alongside them would break motion.md rule 4. Drag stays
  available (user-initiated rotation is not animation). *(Corrected 2026-07-06:
  the earlier "`orbitIdle` auto-rotate ON at the globe default" put two ambient
  scene motions — `orbitIdle` + the packets' `flowDash` — in one viewport,
  violating the "one ambient scene motion per viewport" budget and contradicting
  §5's "packets are the card's ONE ambient scene motion". Auto-rotate off
  resolves it; the boot orientation already frames the route so idle spin isn't
  needed to reveal it.)* No zoom clamps beyond the controller's (globes don't
  zoom in this family).

### SVG latency-budget bar (build-time, synced beneath the globe)

- viewBox `0 0 720 132`. A single horizontal **budget bar** spanning `x` 96→696
  (`W_bar = 600`), `y` 44, height 34. Left 88px gutter holds the row label
  `ROUND TRIP` (mono 9.5px).
- **Scale:** `px_per_ms = W_bar / measMs`. Each hop is a segment placed
  left→right in hop order; segment width `w = rttMs · px_per_ms`,
  `x0 = 96 + Σ(prev widths)`. Within each segment, the **floor portion**
  (`floor · px_per_ms`, from the segment's left) is filled `--accent` @ 0.30
  (physics you can't avoid); the **overhead portion** (`overhead · px_per_ms`,
  abutting to its right) is filled `--accent-alt` @ 0.30 (what humans added —
  the world's failure/hot-path color). `compute` segments are all overhead
  (all pink). 1px `--ink` @ 0.42 dividers between hop segments.
- **The floor line:** a single vertical `--ink` @ 0.7 tick + mono label at
  `x = 96 + floorMs·px_per_ms` (i.e. where the trip would end if every segment
  ran at its physical floor), label `PHYSICS FLOOR · {floorMs} ms` above the
  bar. This is the money mark — the visible gap from it to the bar's right end
  (`measMs`) is the overhead, restated as one distance.
- **Hop labels:** under each segment, mono 9.5px `{from}→{to}` (arrow glyph
  `→`), with `{measured} ms` mono in `--accent-deep` at segment mid, paper
  halo (`paint-order:stroke`). Segments narrower than 56px drop the city
  label (keep the ms) — collision policy stated so labels never overrun the
  viewBox (the neural-flow "labels fit the box" bug class).
- **375px:** the SVG scales to container width (`max-width:100%`,
  `height:auto`); the globe canvas keeps its square aspect above the bar. City
  labels on segments < 40px wide drop to just the `ms` value; the floor label
  wraps to two mono lines if it would exceed the viewBox left edge.

## 5. Motion spec (names from motion.md)

- **Globe boot:** `buildCountryGlobe`'s coastlines fade in as the geo chunk
  resolves (existing behavior); arcs `sweep` (dashoffset len→0, 1200ms
  `--ease`, per-hop stagger `staggerMs` — see the cap below — in hop order, so
  the route draws itself origin→destination). City nodes `settle` in with the
  arcs. **Stagger cap (motion.md rule 3 — full entrance ≤1.6s):** the last
  arc's sweep must END by 1600ms, so `staggerMs = min(120, (1600 − 1200) /
  max(1, hops − 1))` = 120ms for ≤4 hops, tightening toward `≈57ms` at 8 hops
  (last arc then starts ≤400ms, ends ≤1600ms). *(Corrected 2026-07-06: a flat 120ms stagger made the 8-hop
  worst case finish drawing at 840 + 1200 = 2040ms, over the 1.6s card-entrance
  budget; the cap keeps every hop count within it while leaving ≤4-hop traces —
  the common case — at the full 120ms cadence.)*
- **Packets:** `flowDash` grammar as running dots — continuous, period
  `loop_ms` (default **4000**, clamped 2000–8000; `packets ≈ 4s / trip` chip).
  This is the card's ONE ambient scene motion (motion.md budget rule 4).
- **Compute-hop ring:** `pulse` (opacity 0.45↔1, 2.4s sine) — the ONE pulse
  in the viewport (motion.md budget). If there is no compute hop, no pulse.
- **SVG bar reveal** (html.js-gated, `.px-viz:not(.is-in)` hidden states):
  the floor portions `grow` (width 0→final, 400ms, 60ms per-segment stagger,
  tech's tight cadence) → the overhead portions `grow` right after (so the
  reader watches physics fill first, then the human tax stack on) → the floor
  line + labels `reveal`.
- **`hoverLift`:** hovering a globe arc lifts its SVG segment (and vice-versa
  is NOT required — one-way globe→bar highlight only, to keep it simple);
  hovering a bar segment brightens its arc to `--accent` @ 1.0 + dims the
  others to 0.4 (the sync — see §8).
- **Composed still (reduced-motion / print / fallback):** globe at its boot
  orientation with ALL arcs drawn and every packet dot frozen at its hop's
  **midpoint** (t = 0.5), compute ring at full opacity static; the SVG bar
  fully painted (floor + overhead segments, floor line, all labels). The
  build-time SVG bar IS this still for the bar; the globe's still is the
  fallback SVG globe (§7). Reduced-motion never boots WebGL.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| globe occluder / graticule / coastlines | `--paper` @ 1.0 / `--ink` @ 0.07 / `--ink` @ 0.42 (all inherited from `buildCountryGlobe`, unchanged) |
| route arcs | `--accent` @ 0.85 |
| packet dots (crest) | `--accent` @ 1.0 + `glowSprite(accent, 0.06)` |
| city nodes / endpoints | `--ink` @ 0.9 / `--accent-alt` @ 1.0 (origin + destination) |
| compute-hop ring | `--accent-alt` @ 0.45↔1.0 (pulse) |
| bar — floor portion (physics) | `--accent` @ 0.30 |
| bar — overhead portion (human tax) | `--accent-alt` @ 0.30 |
| bar dividers / floor line | `--ink` @ 0.42 / `--ink` @ 0.7 |
| bar values / labels | mono `--accent-deep` (values), `--ink` (city labels), `--muted` (notes) |
| tooltip / globe labels | shared `.viz3d__tip` / `viz3d__label` |

The lime/pink valence pair is the ONE sanctioned two-color data encoding in
this component and it is native to tech (`worlds/tech.md`: **lime = the passing
state / physics floor**, **pink = the overhead / the hot path**). No other
colors; `hops[].color` is deliberately NOT supported.

## 7. Fallback design (first-class)

The card is two figures; the fallback keeps both, computed at build with the
SAME `packet.ts` + `kepler.ts`:

- **Globe → flat route SVG** (viewBox `0 0 720 300`): an equirectangular world
  outline (reuse the earth SVG map-plate convention, `world-atlas` 110m via
  `readFileSync`, geodesy §6) with the route drawn as the same great-circle
  arcs projected flat, city dots + endpoint accents + mono labels, compute-hop
  ring drawn static. (No WebGL, no spin — the print edition of the map.)
- **Budget bar:** the build-time SVG bar is already static — it IS its own
  fallback (identical to the live bar; §4). No-JS ⇒ it paints final with
  floor/overhead segments + floor line.
- **Legend list** (AT-readable data source, `.vz-legend` rows, one per hop):
  `{from} → {to} · {measured} ms · floor {floor} ms · {kind}`. Plus a summary
  row: `Round trip · {measMs} ms measured · {floorMs} ms floor · {overheadMs}
  ms overhead`. **Rows ≤ 5 visible; hops 6–8 collapse behind a "show all hops"
  disclosure** (REVIEW-2026-07-05 amendment 3).
- Caption chips (`floor = … · measured …`, `vacuum floor` when n = 1.0) via
  the standard `.px-viz__cap` pattern; the `packets ≈ …` chip is live-only.

## 8. Interaction spec

- **Globe:** `dragController` — drag to spin, `touch-action: pan-y`. **No
  `orbitIdle` auto-rotate** (§4: the packets' `flowDash` is the one ambient
  scene motion — motion.md rule 4). Hint chip: `drag to spin the globe`. No
  zoom (globe family convention).
- **The sync (the signature interaction):** hover/tap a **bar segment** →
  `hoverLift` on that segment + its matching globe arc brightens to accent @ 1.0
  and the other arcs dim to 0.4 (one shared `activeHop` index the component
  holds; the SVG uses `:hover`/`data-active`, and it sets the mount's
  `data-viz3d-hop` attribute which the runtime watches via the existing
  state-chip MutationObserver bridge — reused, no new runtime code beyond the
  chamber bridge). Tooltip on the segment:
  `<b>{from} → {to}</b><br>{measured} ms · floor {floor} ms · +{overhead} ms<br>{note?}`.
- **One control maximum:** there are NO state chips and NO slider — the hover
  sync is inspection, not a control (CANON §9 one-control rule satisfied at
  zero controls). `setState` hooks reserved (`'trip'|'floor-only'` for a future
  split-chapter "what if it ran at the floor" reveal — unimplemented in v1).
- **Keyboard/AT:** the globe canvas is `aria-hidden`; the SVG bar segments are
  focusable (`tabindex="0"`, `role="img"` with an `aria-label` per segment =
  the tooltip text); the legend list + chips carry the full data. Focus order:
  bar segments left→right, then the disclosure.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts`): "The globe shows the actual path a
  request takes between cities; the bar below splits the round-trip time into
  the part physics forces (green) and the part everything else adds (pink)."
- **how** (ExpandModal): "Drag to spin the globe. Hover any bar segment to
  light up that leg of the journey and see how far it ran over the physical
  minimum."
- Caption guidance: state the overhead claim in ms ("a 256 ms round trip —
  physics only demands 128"), never restate the form. Text budget at rest —
  the floor/measured chip + ≤8 short hop labels + values + caption + plain —
  stays ≤ 80 words (REVIEW amendment 3); hop `note`s are ≤6 words and live in
  tooltips, not on the bar.

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices (WebGL) | ≤ 60k (globe coastlines dominate — inherited; + 8 arcs × 65 pts + ≤8 packet sprites + city spheres) |
| Draw calls | ≤ 28 (globe occluder + graticule + coastlines + ≤8 arc lines + packets + labels) |
| Instancing | not needed (≤ 8 hops, ≤ 9 cities) |
| SVG nodes (bar + fallback map) | ≤ 500 (bar ≤ 80; flat route map reuses the map-plate land paths, inert) |
| `data` payload | ≤ 3 KB |
| Extra assets | `/geo/countries-110m.json` (already the globe family's shared lazy asset — NOT new) + the build-time flat map reuses `world-atlas` from `node_modules` (no new committed asset) |

Scene is its own lazy chunk via the scenes registry — no eager imports; the
globe geo fetch fires only when the scene boots (shared with the globe family).

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight: silhouette · 375px · reduced-motion
      still = fallback (flat map + static bar) · token grep (only lime/pink
      valence pair passes, declared §6) · caption+source+plain · lazy boot +
      dispose + chunk isolation · payload degradation · prefix `px-pkt` unique)
- [ ] `budget()` on the example payload computes floor **128.4 ms**, measured
      **256 ms**, overhead **127.6 ms**; the chip reads
      `floor = 128 ms · measured 256 ms` (grep the component: no authored total
      trusted — floor/measured are computed from `hops`)
- [ ] Mumbai→Frankfurt hop: `greatCircleKm` = **6,564 km**, `hopFloorMs` =
      **64.3 ms** (recompute from the payload coords; ±1%)
- [ ] Every bar segment's floor portion (lime) + overhead portion (pink) sum
      to its width; the floor line sits at the sum of all floor portions; the
      bar's right end is `measMs`
- [ ] A `compute` hop draws NO globe arc, renders the pulsing ring, and its bar
      segment is all pink (floor 0)
- [ ] Live scene renders `packets ≈ 4s / trip`; fallback does not
- [ ] `refractiveIndex: 1.0` renders `vacuum floor (line-of-sight)` and
      recomputes the floor at 299,792 km/s (floor shrinks ~1.47×)
- [ ] Hovering a bar segment brightens ONLY its arc (others dim to 0.4) and
      shows the segment tooltip; hover leaves restore all arcs to 0.85
- [ ] Fallback: flat equirectangular map with the same arcs + the static bar +
      legend collapsing past 5 hops — readable with zero JS
- [ ] Globe boots on scroll-in, disposes on pagehide; the three chunk +
      packetTrace chunk absent from pages without the kind (check dist)
- [ ] `hops.length` of 0 or 9 fails the build with a message naming the 1–8 rule

---

*Registry duties (P6, at implementation — NOT now): add `packet-trace` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in `SectionBody.astro`,
`EXPLAIN` entry (`src/lib/explainers.ts`), catalog block (`docs/design/catalog.md`
— `npm run check:catalog` must pass), prefix `px-pkt` in `src/components/AGENTS.md`
§4, worked example in `2026-06-03-tech-showcase`, and register the scene in
`src/scripts/viz3d/scenes/index.ts`.*
