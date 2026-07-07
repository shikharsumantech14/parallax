# Blueprint — `chamber` (politics · WebGL · FLAGSHIP + world signature)

> The politics world's hero and its identity anchor: a 3D hemicycle
> parliament, every seat an instanced block on true hemicycle arcs, colored by
> party — with a **division state** where the seats physically walk to the Aye
> and No lobbies. "The record, rendered."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `chamber` |
| World | politics |
| Tier | WebGL (instanced + picking + setState) |
| Component | `src/components/topic/politics/Chamber.astro` |
| Scene module | `src/scripts/viz3d/scenes/chamber.ts` |
| Shared math | `src/scripts/viz3d/hemicycle.ts` (NEW pure module — used by BOTH the scene and the component's build-time fallback, kepler.ts-style) |
| CSS prefix | `px-chmbr` |
| Flagship reference | `solarSystem.ts` (helpers/controls/tooltip/label patterns) |

## 2. What it shows / when to use

Who holds the chamber — composition as contiguous party wedges on the real
hemicycle geometry; optionally how one vote split it.

- **USE WHEN:** seat-by-party composition covering ≥90% of the chamber
  (name + seats per party); optionally a specific division's per-party
  aye/no counts.
- **DON'T USE:** partial compositions (→ `seat-chart`); vote-total-only
  stories (→ `vote-result`); coalition arithmetic play (→
  `coalition-calculus`, P5).
- **Pairs with:** `layout: split` as issue hero — chapter copy scrolls while
  the chamber holds and `setState('division')` fires; `wide` standalone.

## 3. Data schema

```ts
interface ChamberData {
  chamber?: { rows?: number; arcDeg?: number };  // defaults: rows by size (≤200→7, ≤400→9, else 11), arc 210
  parties: Array<{
    name: string;
    seats: number;
    color?: string;      // party color — data encoding, allowed (CANON §6 exemption)
    side?: 'gov' | 'opp' | 'cross';   // wedge ordering: gov left → cross → opp right
    short?: string;      // tooltip/legend abbreviation, default name
  }>;
  majority?: number;      // default floor(total/2)+1
  division?: {            // optional second state
    label?: string;       // "Second reading · 12 Mar"
    aye: Record<string, number>;   // party name → seats voting aye
    no: Record<string, number>;
    // absent seats = party total − aye − no (rendered seated, dimmed 0.25)
  };
  caption?: string; source?: string;
}
```

```yaml
# example payload (Lok Sabha 2024, illustrative subset)
parties:
  - { name: "BJP", short: "BJP", seats: 240, color: "#e8963a", side: gov }
  - { name: "Allies (NDA)", short: "NDA+", seats: 53, color: "#f0c983", side: gov }
  - { name: "INC", short: "INC", seats: 99, color: "#3a7bd5", side: opp }
  - { name: "Allies (INDIA)", short: "INDIA+", seats: 135, color: "#8fb8e8", side: opp }
  - { name: "Others", short: "OTH", seats: 16, color: "#9a9184", side: cross }
majority: 272
caption: "The 18th Lok Sabha: no single-party majority — the first coalition chamber in a decade."
source: "Election Commission of India, June 2024"
```

## 4. Geometry spec

**`hemicycle.ts` (the shared math — mirrors `physics/apportionment.md` §1):**
- `hemicycleSeats(total, rows, arcDeg, r0, gap)` → array of `{x, z, angle, row}`
  scene-space seat anchors: row radii `r_k = r0 + k·gap`; seats/row ∝ arc
  length with largest-remainder correction; per-row angles
  `α_j = −θ/2 + θ·(j+0.5)/n_k`; position `(r·sinα, 0, −r·cosα)` (chamber
  faces −Z, Y-up). Sort ALL seats by α (then r) for party filling — blocs =
  contiguous wedges, gov→cross→opp order.
- `lobbyGrid(n, cols, x0, z0, dx, dz)` → row-major grid anchors for the
  division lobbies (Aye x<0, No x>0).
- Constants: `r0 = 1.05`, `gap = 0.16`, seat block `0.075 × 0.06 × 0.075`,
  lobby cols = ceil(sqrt(n·1.6)), lobby spacing `0.095`.
- **Acceptance anchor:** `hemicycleSeats(543, 11, 210, …)` returns exactly
  543 anchors; row seat-counts ascend monotonically; Σ = 543.

**Scene:**
- One `makeInstanced` box mesh for ALL seats (per-instance color = party).
  Instance order = the α-sorted seat order (instanceId → seat → party lookup
  table for picking).
- Majority arc: dashed ink line (`--ink` @ 0.42, dash 0.04/0.03) sweeping the
  hemicycle at `r0 + rows·gap + 0.12`, with a mono label anchor `MAJORITY ·
  {majority}` (label layer, priority 2).
- Rostrum: a low paper-colored plinth block at origin (0.3 × 0.05 × 0.18) —
  the visual anchor, nothing decorative.
- Floor: none (paper is the floor). No walls, no dome — the seats ARE the
  architecture (CANON: strip the scaffolding).
- Camera: FOV 38, position (0, 2.2, 3.4)·zoom, lookAt (0, 0, −0.3).
  `makeOrbitControls` startPitch 0.55, minZoom 0.7, maxZoom 2.6,
  **autoRotate: false** — instead a slow dolly sway: `yaw = 0.06·sin(tMs/9000)`
  added in frame() when idle (the politics register: records don't spin).
- Division state targets: aye seats → `lobbyGrid` left of the rostrum
  (x −1.3 … −0.4), no seats → mirrored right, absent seats stay seated
  dimmed to 0.25 opacity via instance color lerp toward paper. **The band
  WINS over the nominal spacing constants** (clarified 2026-07-05): for
  large lobbies, clamp dx/dz so the grid fits the band — packed lobbies
  read as packed.

## 5. Motion spec

- Boot: seats `settle` in row waves — per-seat delay `row·60ms +
  j_within_row·1.5ms` (j = index within the row, keeping the whole sequence
  ≤1.2s; clarified 2026-07-05), scale 0→1 smoothstep 500 ms (same pattern as
  solarSystem body settle).
- `stateSwitch` (composition ↔ division): every moving seat lerps its
  instance matrix to its target over 600 ms with the `settle` curve,
  staggered by 0.8 ms·index (a visible "walk", ≤ 1.2 s total including
  stagger); majority arc fades to 0.15 in division state (the threshold
  moved to the lobbies).
- `hoverLift`: picked PARTY (all its instances) lifts +0.04 Y; others dim to
  0.55 via color lerp; tooltip follows.
- **Composed still:** composition state, all seats seated, majority arc on,
  camera at start pose. The fallback SVG IS this still.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| seat blocks | party `color` from data @ 1.0 (data-encoding exemption; fallback cycle if absent: accent, accent-alt, then ink @ 0.7/0.5/0.35) |
| majority arc + label | `--ink` @ 0.42, dashed |
| rostrum | `--paper` @ 1.0 with `--rule` edge line |
| absent seats (division) | party color mixed 75% toward `--paper` |
| tooltip / labels | shared `.viz3d__tip` / `viz3d__label` |

## 7. Fallback design (first-class)

Build-time SVG from the SAME `hemicycle.ts` — front-facing 2D hemicycle
projection (x → x, z → y·0.72 foreshortening):
- every seat a 3.2px-radius dot in party color, wedges contiguous;
- dashed majority arc + mono label `MAJORITY · {n}`;
- if `division` present: a second mini-hemicycle pair below (aye/no lobby
  blocks as two dot grids with tallies) — the division rendered as its own
  static plate, since the fallback can't animate the walk;
- below: the **ledger legend** (this is politics — `.pol-ledger` rows):
  party · seats · (division: aye/no). AT-readable data source.

## 8. Interaction spec

- Drag rotate (pitch clamp ±0.9 — but startPitch 0.55 reads as "standing in
  the gallery"), wheel/pinch zoom, `touch-action: pan-y`.
- Hover/tap a seat → party-level tooltip (uses `short ?? name`):
  `<b>{short ?? name}</b><br>{seats} seats · {pct}%{division: `<br>Aye {a} · No {n}`}`.
- State chips (when `division` present): two mono pill buttons over the
  mount's top-right — `COMPOSITION` / `DIVISION — {label}` — `aria-pressed`,
  call `setState`. Rendered by the component, wired via a tiny inline
  listener dispatching to the runtime handle… **NO** — scene handles are not
  exposed to the page. Instead: the chips set `data-viz3d-state` on the
  mount; the runtime (already owning the handle) watches it with a
  MutationObserver IF `handle.setState` exists (add ~8 lines to runtime.ts,
  documented as the state-chip bridge; zero cost to scenes without states).
- Keyboard: chips are real buttons (focusable); canvas `aria-hidden`; the
  ledger legend carries the data.

## 9. Comprehension text

- **Plain default:** "The chamber from above — every block is one seat,
  grouped by party. The dashed arc is the majority line."
- **how:** "Drag to look around. Hover any bloc for its numbers — and if a
  vote is attached, press DIVISION to watch the seats walk to the lobbies."
- Caption states the composition claim ("no single-party majority…").

## 10. Performance budget

| Budget | Cap |
|---|---|
| Instances | ≤ 900 (one InstancedMesh, 1 draw call for all seats) |
| Vertices | ≤ 25k |
| Draw calls | ≤ 10 |
| `data` payload | ≤ 4 KB |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight)
- [ ] `hemicycleSeats(543, 11, 210)` → exactly 543 anchors, Σrows = 543,
      row counts ascend
- [ ] Party wedges are contiguous and ordered gov→cross→opp left→right
- [ ] Majority arc label shows the data's majority (or floor(total/2)+1)
- [ ] Hovering any BJP seat lifts ALL BJP seats + tooltip "BJP — 240 seats · 44%"
- [ ] DIVISION chip walks seats to lobbies in ≤1.2 s; totals in the lobby
      tallies equal `division` sums; absent seats stay dimmed in place
- [ ] COMPOSITION chip returns every seat home
- [ ] Fallback SVG: wedges + majority arc + (if division) the second plate +
      ledger legend — readable with zero JS
- [ ] One InstancedMesh for seats (verify draw calls ≤10 via spector or
      renderer.info in a debug log — remove after)
