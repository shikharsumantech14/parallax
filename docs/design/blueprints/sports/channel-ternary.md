<!-- ────────────────────────────────────────────────────────────────────────────
 COPIED FROM THE DESIGN HANDOFF, 2026-08-27, WITH FOUR STANDING CORRECTIONS.

 The handoff folder is a delivered artifact; this is the in-repo contract. Where
 they differ, THIS file wins, because the handoff could not know the repo.

 1. SVG TEXT — the handoff TYPE-MAPPING.md:25 prescribes
    font-family="var(--font-mono)". A CSS variable inside an SVG PRESENTATION
    ATTRIBUTE does not resolve; every axis label would silently render in the
    browser default serif. Use a LITERAL stack in a style attribute:
      style="font-family:'JetBrains Mono',ui-monospace,monospace"
    (RD-01b. See src/components/AGENTS.md section 5.)

 2. TOKENS — the three tokens this blueprint may reference resolve per
    docs/design/TOKEN-RECORD.md: --paper-warm is REAL (TD-01, six measured
    values); --paper-deep is an ALIAS of it (TD-02), not a second surface;
    --accent-warm maps to --accent-alt (TD-03, flagged — check it against
    this blueprint section 6).

 3. DISPATCH — ignore registry/SectionBody.diff.md. Its arms read
    {kind === x && <X data={section.data} />}: there is no bare "kind"
    variable in SectionBody.astro, and NO component in this repo takes a
    "data" prop. "Fixing" it by prepending section. renders the component on
    its prop defaults — an empty chart, no error, green build. Use the repo
    idiom: {section.kind === x && <X ...flat named props />}

 4. EXPLAINER LENGTH — "plain" is Zod-capped at 220 chars and 13 of the 28
    supplied "what" strings exceed it. The EXPLAIN map is uncapped, so a long
    string is safe THERE, but an author copying it into a section plain:
    breaks the build. Keep EXPLAIN entries under 220 and move the surplus
    into "howToRead", which is capped at 360.

 Also: the SCREENSHOT is reference only. Four of them contain real ledger
 overflow bugs that these blueprints already document and correct — where
 they disagree, the blueprint wins.
──────────────────────────────────────────────────────────────────────────── -->

# channel-ternary — left, centre, right: pick two

> Blueprint for `channel-ternary`. Contract, not a suggestion — if implementation
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
| `kind` | `channel-ternary` |
| World | sports |
| Tier | SVG ternary + one entity-select island |
| Component path | `src/components/topic/sports/ChannelTernary.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-trn` |
| Flagship reference | `player-radar` for the normalised-axes discipline; `tactics-pitch` for the channel vocabulary |

## 2. What it shows / when to use

Three shares that must total a hundred, drawn in a triangle because only two of them are ever free. The reader learns which teams are lopsided and which are genuinely balanced.

- **USE WHEN:** 4–12 entities split across exactly THREE mutually exclusive shares summing to 100, where the lopsidedness is the argument.
- **DON'T USE:** more or fewer than three parts (→ `player-radar` for many axes, `comparison` for two); positions on the pitch (→ `tactics-pitch`); a value surface (→ `court-value`); a two-way split of a total (→ `revenue-mosaic`, tech).
- **Pairs with:** `default`. **Never `bleed`** — the triangle needs its gridlines legible, and a bleed treatment loses them.

## 3. Data schema

```ts
interface ChannelTernaryData {
  corners: [
    { id: string; label: string },   // LEFT corner
    { id: string; label: string },   // TOP corner
    { id: string; label: string }    // RIGHT corner
  ];
  entities: {
    name: string;
    short?: string;
    values: [number, number, number];   // [left, top, right], Σ = 1.0 ±0.001
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: channel-ternary
data:
  corners:
    - { id: left,   label: LEFT }
    - { id: centre, label: CENTRE }
    - { id: right,  label: RIGHT }
  entities:
    - { name: Rivermouth,      values: [0.29, 0.46, 0.25] }
    - { name: Harborough,      values: [0.41, 0.22, 0.37] }
    - { name: Southgate Mills, values: [0.18, 0.28, 0.54], note: The most one-sided team in the league. }
    - { name: Kestrel Park,    values: [0.34, 0.34, 0.32], note: The only genuinely even team here. }
    - { name: Ashford Rangers, values: [0.46, 0.19, 0.35] }
    - { name: Fenwick City,    values: [0.24, 0.52, 0.24] }
    - { name: Dunmoor,         values: [0.38, 0.16, 0.46] }
    - { name: Coalbrook,       values: [0.31, 0.38, 0.31] }
  caption: Five of the eight lean at least ten points toward one channel.
  source: Touch locations in the attacking third, thirds split at the width of the box
```

**The sum constraint is the reason for the geometry.** Every entity's three
values must sum to 1.0 ±0.001 or the build **FAILS naming the entity** — a ternary
plot of unconstrained values is meaningless.

**The comprehension risk runs backwards.** Readers assume proximity to a corner
means *high* use of the opposite channel; it means high use of *that* corner's
channel, and distance from a corner means LOW use of it. The plain line must say so
explicitly. **No compression chip** — barycentric coordinates are exact.

## 4. Geometry spec

`viewBox="0 0 300 274"`, `width:300px; height:274px`, centred in the column.

- **Triangle** `points="150,20 282,250 18,250"` — top corner, right, left.
- **Barycentric mapping** for `[l, t, r]`:
  `x = 18 + r · 264 + t · 132`, `y = 250 − t · 230`.
  Check: `[⅓,⅓,⅓]` → `(150, 173.3)`, the centroid.
- **Gridlines** at 25/50/75% on all three axes — for each fraction `f`, three
  lines, each joining the two points where that axis equals `f`. Nine lines
  total, 1px.
- **Centroid marker** r 2.4 at `(150, 173.3)`, so "balanced" is a visible position
  rather than something the reader has to infer.
- **Dot** r 5 at rest, 7 when selected, 1.2px stroke.
- **Corner labels:** top at `(150, 14)` `middle`; left at `(12, 264)` `start`;
  right at `(288, 264)` `end`. 10px mono 700.
- **Readout** to the right (200px): entity, all three shares, and the most
  lopsided figure.
- **No dot labels on the plot.** Eight names inside a 300px triangle cannot be
  placed without collision; identity comes from the readout and the table. This is
  a deliberate constraint of the kind, stated in §9.
- **375px:** the triangle scales to the column width (min 260px) and the readout
  moves below it.

## 5. Motion spec

- **Entrance:** `reveal` on the card root.
- **On selection:** the dot takes the accent and its radius steps; others hold at
  rest. 120ms ease-out on colour.
- **Composed still:** the most lopsided entity selected, all dots and gridlines
  drawn, centroid marked.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| triangle fill | `--paper-deep` @ 1.0 |
| triangle border | `--rule` @ 1.0, 1.4px |
| gridlines | `--rule` @ 1.0, 1px |
| centroid marker | `--ink` @ 0.40 |
| dot, rest | `--ink` @ 0.60, `--paper-deep` stroke |
| dot, selected | `--accent` @ 1.0 |
| corner labels | `--accent` @ 1.0 |
| readout share ≥ 40% | `--accent` @ 1.0 |
| readout share < 40% | `--ink` @ 0.85 |

Corners are accent-coloured because they are the chart's vocabulary; dots are ink
because they are peers. Highlighting a share at ≥40% in the readout is how the
lopsidedness gets stated numerically as well as positionally.

## 7. Fallback design

Build-time SVG:

1. The **whole triangle** — gridlines, centroid, all dots, corner labels.
2. The **readout** for the default entity.
3. A `<table>`: entity and its three shares, plus a column naming its dominant
   channel. AT-readable source, and **the only way to identify a dot** — so it is
   not optional. SVG `aria-hidden="true"`.

## 8. Interaction spec

**One control** — entity selection.

- **Targets:** each dot is a `<button>` with a ≥24px hit area, plus the table
  rows. Tab order in array order.
- **Readout template** (`aria-live="polite"`):
  `"{name} — {left}% {corners[0].label}, {centre}% {corners[1].label}, {right}% {corners[2].label}. Most lopsided: {max}% down one channel. {note}"`
- **Keyboard:** complete; `↑`/`↓` through the table, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "A triangle, because the three shares must add to a hundred and
  only two of them are ever free. Each corner is a team playing entirely down that
  channel; the centre point is a perfectly even split. **Distance from a corner is
  how little a team uses it** — so a dot near the bottom edge never goes through
  the middle at all."
- **`how`**: "Press a dot for the three exact shares. A dot sitting near an edge
  means the channel opposite that edge is barely used."
- **Caption guidance:** count the lopsided teams — "five of the eight lean at least
  ten points toward one channel".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 40 (12 dots + 9 gridlines + triangle + labels) |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Entities | 4–12 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Any entity's values not summing to 1.0 ±0.001 fails the build, naming it
- [ ] `[⅓,⅓,⅓]` maps exactly to the centroid `(150, 173.3)`
- [ ] The centroid is marked
- [ ] Nine gridlines render — 25/50/75% on all three axes
- [ ] **The plain line states that distance from a corner means LOW use of that channel**
- [ ] No dot labels are drawn on the plot; the table is the identification route
- [ ] Dot hit areas ≥ 24px
- [ ] Readout highlights any share ≥ 40%
- [ ] Triangle stays ≥ 260px wide at 375px, readout below
- [ ] No-JS: full triangle + default readout + shares table with a dominant-channel column

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-sports-showcase`.*
