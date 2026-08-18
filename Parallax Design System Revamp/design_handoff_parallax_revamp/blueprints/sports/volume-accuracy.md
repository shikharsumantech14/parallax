# volume-accuracy — shooting a lot, or shooting well

> Blueprint for `volume-accuracy`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/sports.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `volume-accuracy` |
| World | sports |
| Tier | SVG quadrant scatter + one team-select island |
| Component path | `src/components/topic/sports/VolumeAccuracy.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-qad` |
| Flagship reference | `scaling-plot` (tech) for the scatter + offset-label discipline; `league-table` for the team vocabulary |

## 2. What it shows / when to use

Two rates plotted against each other with league averages cutting the field into quadrants, and dot size for the product of the two. The reader learns that volume and accuracy are separate strategies.

- **USE WHEN:** 8–20 entities on two rates whose PRODUCT is a meaningful total, where position relative to both averages is the argument.
- **DON'T USE:** one entity's multi-axis profile (→ `player-radar`); shots by pitch location (→ `shot-map`); a value surface over space (→ `court-value`); two numbers over time (→ `turnout-margin`, politics).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface VolumeAccuracyData {
  x: { label: string; unit: string };
  y: { label: string; unit: string };
  size?: { label: string };     // what dot AREA encodes
  entities: {
    name: string;               // short form — drawn on the plot
    x: number;
    y: number;
    size?: number;              // must be derivable from x × y × opportunities
    note?: string;
  }[];
  quadrantLabels?: [string, string, string, string];  // TL, TR, BL, BR
  caption?: string;
  source?: string;
}
```

```yaml
kind: volume-accuracy
data:
  x: { label: Shots per match, unit: '' }
  y: { label: Conversion, unit: '%' }
  size: { label: Goals }
  entities:
    - { name: Rivermouth, x: 17.2, y: 14.1, size: 92 }
    - { name: Harborough, x: 15.8, y: 12.4, size: 74 }
    - { name: Kestrel Pk, x: 14.1, y: 11.8, size: 63 }
    - { name: Ashford,    x: 13.4, y: 9.2,  size: 47 }
    - { name: Fenwick,    x: 12.6, y: 13.6, size: 65 }
    - { name: Southgate,  x: 9.8,  y: 15.9, size: 59, note: Fewest shots in the top half, best conversion in the league. }
    - { name: Dunmoor,    x: 11.2, y: 8.1,  size: 34 }
    - { name: Coalbrook,  x: 8.4,  y: 7.2,  size: 23 }
    - { name: Marsh End,  x: 15.1, y: 7.9,  size: 45, note: Third for volume, eleventh for conversion. }
    - { name: Oldcastle,  x: 10.4, y: 12.1, size: 48 }
    - { name: Thornbury,  x: 12.1, y: 10.4, size: 48 }
    - { name: Waverly,    x: 9.1,  y: 9.6,  size: 33 }
  caption: The most shots and the best conversion belong to different teams, and both won things.
  source: League shot log, 2025–26, all 38 matchdays
```

Two requirements:

1. **`size` must be the product**, not a third measurement:
   `size ≈ x × (y/100) × matches`. The build **`console.warn`s** when any
   entity's `size` deviates more than 5% from that product, because a dot area
   that is not the product silently lies about the relationship the chart exists
   to show. (For the example: 17.2 × 0.141 × 38 ≈ 92.)
2. **Quadrant captions live OUTSIDE the plot.** They go in an HTML row beneath the
   SVG, not as in-plot corner text — corner labels collide with dots at 375px and
   read as data points. This was a real defect in the prototype.

Dot **area** (not radius) is proportional to `size`. No scale compression on
either axis, so **no honesty chip**.

## 4. Geometry spec

`viewBox="0 0 440 270"`, `width:440px; height:270px`.

- **Plot box** x 44 → 430, y 18 → 222.
- **Scales** linear over the padded data range (6%), rounded outward to a nice
  step. **Not forced to zero** — these are rates around their averages, and a
  forced zero would collapse the spread that the quadrants depend on.
- **Average lines:** a dashed `4 3` vertical at the mean of `x` and a dashed
  horizontal at the mean of `y`, both `--ink` @ 0.35. Means are **derived**.
- **Dot radius** `r = √(size / maxSize) × 11 + 3.6` — area-proportional with a
  floor that keeps the smallest dot clickable.
- **Entity labels** at a per-dot offset. Default `dy −10 / middle`; flip to
  `dx ±8 / start|end` or `dy +16` when a neighbour's label box is within 16px.
  The example's tuned set (index order):
  `[−10 mid, −10 mid, +8 start, +16 mid, −8 end, −11 mid, +8 start, +16 mid, +16 mid, −8 end, +8 start, +16 mid]`.
- **Gridline ticks:** four per axis; x labels at `y = 238`, y labels at
  `x = 38` (`text-anchor="end"`) carrying the unit (`7%`).
- **Axis title** for x at `x = 237, y = 258`; the y title is an HTML eyebrow above
  the plot (a rotated SVG y-title costs more than it earns at this size).
- **Quadrant caption row** below the SVG: a 2×2 CSS grid, 9px mono uppercase,
  `--ink` @ 0.45, left/right aligned to match the quadrant it names.
- **375px:** the SVG scales; labels drop for dots whose offset box would collide,
  and those names remain in the readout and the table.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Dots do not scale up from zero.
- **On selection:** the selected dot takes the accent and its radius steps; others
  to 0.82. 120ms ease-out on colour only.
- **Composed still:** the most interesting quadrant outlier selected (for the
  example, Southgate), average lines drawn, all labels placed.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| dot, rest | `--ink` @ 0.62, 1.2px `--paper-deep` stroke |
| dot, selected | `--accent` @ 1.0 |
| average lines | `--ink` @ 0.35, dashed |
| gridline ticks + labels | `--ink` @ 0.50 |
| entity label, rest | `--ink` @ 0.50 |
| entity label, selected | `--accent` @ 1.0 |
| axis titles | `--ink` @ 0.45 |
| quadrant captions | `--ink` @ 0.45 |
| readout value above its average | `--accent` @ 1.0 |
| readout value below its average | `--ink` @ 0.85 |

Every dot is the same colour at rest — the position is the encoding, and colouring
teams would imply a grouping the chart is not making.

## 7. Fallback design

Build-time SVG:

1. The **whole plot** — dots at their area-proportional radii, both average lines,
   all placed labels, both axes, and the quadrant caption row.
2. The **readout** for the default entity.
3. A `<table>`: entity, x, y, size, and which quadrant it falls in. AT-readable
   source; SVG `aria-hidden="true"`. The quadrant column is what makes the
   argument reachable without seeing the plot.

## 8. Interaction spec

**One control** — entity selection.

- **Targets:** each dot is a `<button>` with a ≥24px hit area, plus the table
  rows. Tab order by `x` descending.
- **Readout template** (`aria-live="polite"`):
  `"{name} — {x} {x.label}, {y}{y.unit} {y.label}, {size} {size.label}. {quadrantText}. {note}"`
  where `quadrantText` is e.g. `"Low volume, accurate"`.
- **Keyboard:** complete; `←`/`→` step by `x` order, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "Each dot is a team, placed by how often it attempts something
  across the bottom and how often that attempt works up the side. The dashed lines
  are the league averages, cutting the chart into four quadrants; dot size is the
  resulting total."
- **`how`**: "Find which quadrant a team sits in, then check the dot size — it is
  the two axes multiplied out, so a small dot in the top-left is accuracy without
  enough volume to matter."
- **Caption guidance:** name the two extremes and refuse the false conclusion —
  "the most shots and the best conversion belong to different teams, and both won
  things".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 120 (20 dots + labels + axes) |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 1 KB minified, inline |
| Entities | 8–20 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Dot **area** (not radius) is proportional to `size`
- [ ] `size` deviating >5% from `x × y × matches` triggers a build `console.warn`
- [ ] **Quadrant captions render in an HTML row below the plot**, never as in-plot SVG text
- [ ] Average lines are derived from the payload, not authored
- [ ] Axes are not forced to zero
- [ ] Zero label overlap at 375px; dropped labels remain in the readout and table
- [ ] Smallest dot is still ≥ 3.6px radius with a ≥24px hit area
- [ ] The fallback table carries a quadrant column
- [ ] All dots share one rest colour
- [ ] No-JS: full plot + quadrant row + default readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-sports-showcase`.*
