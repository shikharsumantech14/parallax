# Blueprint template — the component contract

> **LENS (updated 2026-10-04, Phase 8).** The design law is
> `docs/design/LENS.md`. A kind explains itself through **cues** (§5.2) and
> one caption; the how-to-read panel, the plain line, `src/lib/explainers.ts`
> (`EXPLAIN`, `NEEDS_HOW`) and the `--viz-edge` rule are gone, and the schema
> fails the build on `plain` / `howToRead`. §1's Shell row, §3's `source`
> note, §9 and §11 below are written to that. Blueprints written before Lens
> Phase 6 may still describe the old chrome: the catalog's NOTES line wins.

> **Copy this file to `docs/design/blueprints/<world>/<kind>.md` and fill every
> section.** A blueprint is DONE only when a model with no design judgment could
> implement the component without asking a single visual question — and a reviewer
> could verify the result line-by-line against it.
>
> Blueprints are **contracts**: the implementer does not edit the blueprint to
> match what they built. If implementation reveals a real problem in the spec,
> flag it in the commit body and update the blueprint FIRST, visibly.
>
> Rules that apply to every component regardless of blueprint: `CANON.md`
> (especially §4 line-art doctrine, §5 type, §6 color, §7 honesty + the source
> line, §8 fallback-first, §10 the four-layer explainability stack, §13
> acceptance floor, §14 surfaces — flat, no shadow, the 3px `--viz-edge` rule),
> `motion.md` (motions by name only), the world's
> `worlds/<topic>.md`, and the SVG conventions in `src/components/AGENTS.md` §5.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `<kebab-kind>` (goes into `SECTION_KINDS` in `src/content/config.ts`) |
| World | politics · space · earth · tech · travel · sports |
| Tier | WebGL · CSS-3D · SVG · HTML-interactive |
| Component path | `src/components/topic/<world>/<Name>.astro` |
| Scene module (WebGL only) | `src/scripts/viz3d/scenes/<name>.ts` |
| CSS prefix | `px-<abbrev>` (≤6 chars; verify uniqueness: grep `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | the closest already-built component to copy patterns from (e.g. `solar-system` for WebGL, `power-flow` for SVG-flow) |
| Shell | `core/VizCard.astro` — the caption row (with optional honesty chip, story mode only) and the graphic slot; its root is the `data-build-scene`. Nothing else: the component never renders the source or the caption; `core/Section.astro` prints the caption in the article and `Source ·` in the pinned figure panel. `.px-viz` is flat (radius 0, no shadow, a 1px hair): do not re-elevate it. |


## 2. What it shows / when to use

Two sentences max on what the reader learns from it.

- **USE WHEN:** the dossier conditions that justify this component (be concrete:
  "≥4 bodies with real orbital elements", "a seat-by-party composition covering
  ≥90% of the chamber").
- **DON'T USE:** the tempting-but-wrong cases, and what to use instead.
- **Pairs with:** layout recommendations (`split` hero? `wide`? never `bleed`?).

## 3. Data schema

A literal TypeScript type for `section.data`, with units in comments. Required vs
optional explicit. Follow with ONE complete example payload (real numbers, real
names — copy-pasteable into an issue MDX).

```ts
interface <Name>Data {
  // ...
  caption?: string;   // every viz kind — the DATA claim; rendered by VizCard's caption row (or `section.caption`)
  source?: string;    // every viz kind — the component does NOT render it; core/Section.astro
                      // prints it once in the figure panel (`.px-fig__src`; `.px-rs__src` on
                      // phones), from `section.source ?? data.source`. Never emit a `__src` element.
}
```

```yaml
# example payload
```

**Data flags with visual consequences** (log scale, compression, exaggeration)
must be listed here with their auto-generated caption chips (CANON §7).

## 4. Geometry spec

The math, exactly, with variable names matching the code:

- Formulas (reference the `docs/design/physics/` sheet + equation by name where
  applicable — the implementation must mirror the sheet 1:1).
- Coordinate conventions: which axis is up, scene units, world scale mapping
  (e.g. "1 scene unit = 1 AU under `scale:'true'`, `log10(r_AU·9+1)` under
  `scale:'log'`").
- Camera: FOV, initial position, zoom clamps (WebGL) / viewBox and margins (SVG).
- Size constants: radii, stroke widths, marker sizes — exact numbers, including
  their 375px values if they differ.
- Label placement rules (which labels, where, collision policy — reuse the shared
  label layer for globes).

## 5. Motion spec

- Which **named motions** from `motion.md` apply to which elements, with any
  per-component parameters (stagger counts, time-compression rate).
- The **composed still** (= reduced-motion frame = print frame): describe exactly
  what is visible and where every moving element rests.
- Entrance order (what reveals first/last; `stamp` fires last if present).

## 6. Color spec

Tokens only, with exact opacities per element, e.g.:

| Element | Token @ opacity |
|---|---|
| structure lines | `--ink` @ 0.42 |
| support/graticule | `--ink` @ 0.18 |
| data marks | `--accent` @ 1.0 |
| comparison series | `--accent-alt` @ 0.9 |

Fixed data encodings (non-themeable) declared explicitly with their hexes and the
reason ("Saffir-Simpson standard ramp").

## 7. Fallback design (first-class — this section is a mini-blueprint)

What the no-JS / no-WebGL / reduced-motion reader gets. Not a screenshot, not an
apology — the print edition of the same idea:

- Composition (what geometry the static SVG/HTML shows, from what viewpoint).
- What data it encodes (usually everything; state explicitly if a state is dropped).
- The companion legend/table (globes keep their textual legend list — that is the
  AT-readable data source).

## 8. Interaction spec

- Hover/tap targets and their tooltip content **template** ("`{name}` — `{alt_km}`
  km · `{count}` satellites").
- Drag/zoom semantics + clamps. `touch-action: pan-y` mandatory.
- State chips (if `setState`): the chip labels, max 3 states, `aria-pressed`,
- Instrument chrome (if the component has a control): chips are `px-inst__chip`
  with `aria-pressed`; a scrub is a native `<input type="range">` that ships
  hidden and is unhidden by the island once the payload parses; every per-step
  table (per minute, per month, both axis projections) is precomputed in
  frontmatter — no scale math on the client. If the control drives a text
  readout, name its **worst-case string** here: the component renders it as the
  hidden `.px-inst__sizer` twin (`px-inst__readout--sized`, opt-in) so the box
  reserves true height and never reflows mid-drag.

  keyboard focus order.
- What a keyboard/AT user gets instead (usually: the fallback legend/table +
  the article's cue sentences and caption carry the full content; canvas is
  `aria-hidden`).

## 9. Comprehension text

- **Cue anchors** (the catalog block's `CUES:` line): every element a cue can
  name, with its id (`1`…`n` in DATA order for a list, a short name for a
  fixed part: `head` for the headline number, `line`, `legend`, `axis`), the
  `data-cue` it carries and where its empty `.px-cue-tag` numeral slot sits
  (inside an SVG: a `<foreignObject>` or an HTML layer over it). Two to four
  cues per section; the first names the finding, never the axis.
- **Cue sentences**: what a good one says for this kind (a data claim, ≤ 30
  words, traced like the caption), and which of the kind's own items get a
  cue button automatically, if any (as the readout tiles and timeline events
  do).
- **Build order** (the `BUILD:` line, LENS §6.4): axis, then marks, then
  labels, then the headline number, inside 4.5s; the counter if any. A
  control or a JS-only disclosure sits outside the build scene.
- Caption guidance: what a good caption for this kind states (the data claim).

## 10. Performance budget

| Budget | Cap |
|---|---|
| Vertices (WebGL) | e.g. ≤ 60k |
| Instances | e.g. ≤ 1200 via `makeInstanced` |
| Draw calls | e.g. ≤ 20 |
| SVG nodes | e.g. ≤ 900 |
| `data` payload | e.g. ≤ 8 KB |
| Extra assets | none / named (e.g. per-issue DEM JSON ≤ 40 KB, committed) |

WebGL scenes are their own lazy chunk via the scenes registry — no eager imports.

## 11. Acceptance checklist

8–12 binary checks. Always include the canon floor (CANON §13: silhouette test,
375px, reduced-motion still, token grep, caption + source each rendered
exactly once per section with the component emitting neither itself, every
CUES id a `data-cue` that lights (check:catalog check 7, the render gate's
CUES check), the build ending on the no-JS page (BUILD), lazy/dispose
contract, payload validation, prefix uniqueness, flat: no radius, no shadow,
no hover transform) plus component-specific checks,
e.g.:

- [ ] Kepler positions match the physics sheet's worked example within 0.5%
- [ ] Hovering Jupiter shows "Jupiter — 5.20 AU · 11.9 yr"
- [ ] `scale:'log'` renders the caption chip "distances log-compressed"
- [ ] Division state moves every seat to a lobby; totals equal the data
- [ ] ...

---

*Registry duties when implementing: add the kind to `SECTION_KINDS`
(`src/content/config.ts`), dispatch in `src/components/SectionBody.astro`, add the
catalog block with its CUES and BUILD lines (`docs/design/catalog.md` — `npm
run check:catalog` must pass; `scripts/wire-kind.mjs` does these first steps), document the prefix
in `src/components/AGENTS.md` §4, and add a worked example to the world's
`2026-06-03-<world>-showcase` issue.*
