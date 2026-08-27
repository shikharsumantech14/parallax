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

# service-arcs — nine services, and who calls whom

> Blueprint for `service-arcs`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/tech.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `service-arcs` |
| World | tech |
| Tier | SVG arc diagram + one node-select island |
| Component path | `src/components/topic/tech/ServiceArcs.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-svc` |
| Flagship reference | `power-flow` (politics) for the flow vocabulary; `packet-trace` for the service/hop language |

## 2. What it shows / when to use

A call graph laid on a single line in request order, with arcs above the line for forward calls and below it for backward ones. The reader learns where the graph is actually a cycle.

- **USE WHEN:** a call graph of 6–12 services that has a natural request ORDER, where backward edges (cycles) are the argument.
- **DON'T USE:** a request's timing breakdown (→ `latency-waterfall`); one operation's call tree (→ `flame-graph`); geographic hops (→ `packet-trace`); a value flow that conserves (→ `power-flow`, politics); a layer-by-layer network (→ `neural-flow`).
- **Pairs with:** `default` or `wide`. Not hero-capable.

## 3. Data schema

```ts
interface ServiceArcsData {
  services: {
    id: string;
    label: string;
    order?: number;    // authored position on the axis; see §3 flags
    volume?: number;   // outbound calls/min — sets node radius
  }[];
  calls: { from: string; to: string; rate: number; note?: string }[];
  rateUnit: string;    // e.g. 'calls/min'
  caption?: string;
  source?: string;
}
```

```yaml
kind: service-arcs
data:
  rateUnit: calls/min
  services:
    - { id: edge,   label: edge,         order: 0, volume: 4200 }
    - { id: gw,     label: gateway,      order: 1, volume: 4200 }
    - { id: auth,   label: auth,         order: 2, volume: 3100 }
    - { id: gql,    label: graphql,      order: 3, volume: 5600 }
    - { id: acct,   label: accounts,     order: 4, volume: 2400 }
    - { id: ent,    label: entitlements, order: 5, volume: 1900 }
    - { id: usage,  label: usage,        order: 6, volume: 1400 }
    - { id: search, label: search,       order: 7, volume: 900 }
    - { id: audit,  label: audit,        order: 8, volume: 620 }
  calls:
    - { from: edge,   to: gw,     rate: 4200 }
    - { from: gw,     to: auth,   rate: 3100 }
    - { from: gw,     to: gql,    rate: 4200 }
    - { from: auth,   to: acct,   rate: 1200 }
    - { from: gql,    to: acct,   rate: 2400 }
    - { from: gql,    to: ent,    rate: 1900 }
    - { from: gql,    to: usage,  rate: 1400 }
    - { from: gql,    to: search, rate: 900 }
    - { from: acct,   to: audit,  rate: 620 }
    - { from: ent,    to: acct,   rate: 1450, note: A backward call — entitlements reaching into accounts. }
    - { from: usage,  to: acct,   rate: 700 }
    - { from: ent,    to: auth,   rate: 880,  note: Entitlements calling authentication, which is four positions upstream. }
    - { from: search, to: gql,    rate: 210 }
    - { from: audit,  to: gw,     rate: 90 }
  caption: Three of the fourteen call paths run backwards, and every one passes through entitlements.
  source: Distributed trace sample, 1% of production traffic over one hour
```

**Node order is the spine of the chart.** Author it via `order`. If
`order` is absent the component topologically sorts at build and **breaks cycles
by dropping the lowest-volume back edge from the sort** — the break is
`console.warn`ed with both service names, never silently applied, because a
different break gives a different chart. Arc width is `√rate` scaled, so one
dominant edge cannot swamp the rest; the `rateUnit` legend states that widths are
root-scaled (`widths √-scaled` chip). A `from`/`to` that matches no service
**FAILS the build naming the call**.

## 4. Geometry spec

`viewBox="0 0 440 250"`, `width:440px; height:250px`.

- **Axis** at y 132, x 24 → 416, 1px.
- **Node x** `ax(i) = 32 + i · 44` for 9 services; generally
  `32 + i · (384 / (n − 1))`.
- **Node radius** `3.4 + √volume / 26`, clamped to 4–11px.
- **Arc** between indices `i` and `j`, `r = |ax(j) − ax(i)| / 2`:
  `M ax(i) 132 A r ry 0 0 {sweep} ax(j) 132`
  with `ry = min(r × 0.95, 100)` above the line and `min(r × 0.95, 92)` below.
  `sweep = 1` for forward calls (arc above), `0` for backward (arc below).
- **Arc stroke width** `max(1, √rate / 13)`.
- **Node labels** rotated −90° and hung below the axis:
  `transform="rotate(-90 {ax(i)} 148) translate(0 148)"` with
  `text-anchor="end"`, 9.5px mono. Rotation is mandatory — nine horizontal
  labels on a 440px axis cannot fit.
- **Readout** to the right: service name, called-by count, calls-out count,
  inbound volume, and a backward-call count.
- **Legend:** two line samples — forward (accent, 3px) and backward
  (accent-alt, 3px).
- **375px:** the SVG scales; node radii clamp to 4–8px, and labels shorten to
  their first 6 characters plus an ellipsis (full names stay in the readout and
  the table).

## 5. Motion spec

- **Entrance:** `reveal` on the card root.
- **No `flowDash`.** `power-flow` animates its dashes because money moves along a
  route; here the arcs are call *relationships*, and animating them would imply a
  single traced request. Deliberate divergence from the flagship.
- **On selection:** arcs not touching the selected node drop to 0.07 over 120ms.
- **Composed still:** the node with the most backward calls selected (the
  argument), all arcs painted at rest opacity.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| forward arc | `--accent` @ 0.55 |
| backward arc | `--accent-alt` @ 0.90 |
| arc, not touching the selection | own colour @ 0.07 |
| axis | `--ink` @ 0.40 |
| node, rest | `--ink` @ 0.75, 1.5px `--paper-deep` stroke |
| node, selected | `--accent` @ 1.0 |
| node label, rest | `--ink` @ 0.60 |
| node label, selected | `--accent` @ 1.0 |
| readout backward count, > 0 | `--accent-alt` @ 1.0 |
| legend text | `--ink` @ 0.65 |

Backward arcs are louder than forward ones (0.90 against 0.55) because they are
the finding. `--accent-alt` is the only second hue and it means exactly one
thing: this edge points upstream.

## 7. Fallback design

Build-time SVG:

1. The **whole arc diagram** — axis, nodes, all arcs above and below, labels,
   legend, chips.
2. The **readout** for the default node.
3. A `<table>` of calls: from, to, rate, direction (forward/backward). This is
   the AT-readable source and it makes the cycle count checkable by hand. SVG
   `aria-hidden="true"`.

## 8. Interaction spec

**One control** — node selection.

- **Targets:** each node circle (≥24px hit area) and each table row is a
  `<button>`; tab order follows axis order. `touch-action: pan-y`.
- **Readout template** (`aria-live="polite"`):
  `"{label} — called by {inCount} services, calls out to {outCount}, {inVolume} {rateUnit} inbound. {backwardText}"`
  with `backwardText` = `"Calls back into {names} — {n} backward call(s)."` or
  `"No backward calls; it only waits on things downstream."`
- **Re-press** clears.
- **Keyboard:** complete; `←`/`→` step along the axis, `Esc` clears.

## 9. Comprehension text

- **`what`**: "Every service sits on one line in request order, and each arc is
  one service calling another with thickness for call volume. Arcs above the line
  run forwards; an arc below the line is a service calling something that was
  supposed to be upstream of it."
- **`how`**: "Press a service to keep only its arcs. Count the arcs below the
  line — that is the difference between a dependency graph and a dependency
  cycle."
- **Caption guidance:** count the cycles and name where they converge — "three of
  the fourteen call paths run backwards, and every one passes through
  entitlements".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 200 (12 services + 40 arcs + labels) |
| `data` payload | ≤ 4 KB |
| Island JS | ≤ 1.1 KB minified, inline |
| Services × calls | ≤ 12 × 40 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Backward arcs render BELOW the axis in `--accent-alt`
- [ ] Arc widths are √-scaled and the `widths √-scaled` chip renders
- [ ] An unknown `from`/`to` fails the build, naming the call
- [ ] Absent `order` triggers a topological sort, and any cycle-break is `console.warn`ed with both names
- [ ] No `flowDash` or any ambient arc animation
- [ ] Node labels are rotated −90° and do not collide at 375px
- [ ] Backward-call count in the readout matches the table's direction column
- [ ] Node hit areas ≥ 24px despite radii as small as 4px
- [ ] Selecting a node dims non-incident arcs to 0.07
- [ ] No-JS: full diagram + default readout + calls table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-tech-showcase`.*
