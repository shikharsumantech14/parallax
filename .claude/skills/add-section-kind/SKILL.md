---
name: add-section-kind
description: Add a new section kind to the Parallax component library, wired through all nine registry places. Use when building a kind from a blueprint, running a Phase 3 wave, or when check:catalog reports a kind missing from a registry.
argument-hint: [kind-name]
allowed-tools: Bash(node scripts/*), Bash(npm run *), Read, Edit, Write, Glob, Grep
---

# Add a section kind

**Nine registry places. Five are automated — do not hand-edit those five.**
(Lens Phase 8, 2026-10-04: the EXPLAIN entry and the how-to-read default are
gone with `src/lib/explainers.ts`. A kind explains itself through its cues.)

## Automated: `node scripts/wire-kind.mjs <config.json>`

1. `SECTION_KINDS` in `src/content/config.ts`
2. import + dispatch arm in `src/components/SectionBody.astro` — the script
   emits the Lens arm, `<Name …props caption={section.caption ?? data.caption}
   source={section.source ?? data.source} />`, a bare arm when the config says
   `vizcard: false`, and a `./core/` import when `world` is `core`. A
   narrative kind (`narrative: true`, no figure panel) also joins the
   `NARRATIVE` set in `core/Section.astro` and `scripts/project-graph.mjs` by
   hand.
3. `## <kind>` block in `docs/design/catalog.md` — **same order** as
   SECTION_KINDS. The script REFUSES a block without a `- **CUES:**` line (the
   anchor ids, or `none` on a narrative kind) and a `- **BUILD:**` line (the
   build order), and a config that still carries `explainWhat` / `explainHow`.
4. `KIND_PRIORITY` score in `src/lib/story.ts`
5. the CSS prefix registration in `src/components/AGENTS.md` §4

Read the header of `scripts/wire-kind.mjs` for the config shape and a worked
example. It is **idempotent** — every step skips if already applied, so a
partial run is safe to re-run. `afterKind` anchors the entry, the dispatch arm
and the catalog block so all three stay in the same order, which
`check:catalog` enforces.

## Manual: yours

6. the component itself — `src/components/topic/<world>/<Name>.astro` (or
   `core/`), drawn for the pinned figure panel (about 470px of content at
   1280, 293 on a 375 phone; LENS §5.1).

   **The cue contract.** A `Cue anchors:` block in the header comment;
   `data-cue="<id>"` on every element a cue can name (ids numbered from 1 in
   DATA order, or short names for fixed parts); an empty
   `<span class="px-cue-tag" data-cue-tag="<id>" hidden></span>` where the
   numeral sits (inside an SVG, in a `<foreignObject>` or an HTML layer over
   it). `core/Section.astro` fills the numerals; `src/scripts/cues.ts` lights
   them. The same ids go on the catalog block's CUES line, and
   `check:catalog` check 7 fails until each is a `data-cue` in the component.

   **The build contract.** `data-build-scene` on the graphic, `data-build="n"`
   and `data-build-kind` on its parts (`src/components/AGENTS.md` §11). No
   motion of its own; the static HTML is the final state.

   **The shell.** A VizCard kind renders inside `core/VizCard.astro`
   (`<VizCard prefix="px-xxx" {caption} chip=…>`): the caption row and the
   slot, nothing else. `core/Section.astro` owns the rest of the section
   chrome for every kind: the caption in the article, the `Source · …` line
   in the figure panel. A component emits **no** source line and no caption
   under a spelling the shell cannot see; `.px-viz__src` and the how-to-read
   panel must not come back. `.px-viz` is a 1px `--hair` rule: add no
   `border-radius`, `box-shadow` or hover lift on the root.

   **The CSS** is a scoped `<style>` in the component reading the role tokens
   (`--accent`, `--accent-deep`, `--accent-tint`, `--deep`, the neutrals).
   **Never a theme file**: since Lens Phase 8 the six `themes/<desk>.css`
   hold the desk's inks and nothing else.

7. `src/scripts/viz3d/scenes/index.ts` — **WebGL kinds only**
8. a worked example in that world's showcase issue, with two to four `cues`
   and their `[[n]]` markers
9. the kind's row in `src/components/AGENTS.md` §2, its `data` shape in
   `src/content/issues/_AGENTS.md`, and a `TRIM` cap in `src/lib/story.ts`
   if it needs one

## Traps that have actually bitten

- **`SectionBody.astro` is the dispatcher.** `SectionRenderer.astro` is article
  chrome only — wiring there does nothing, silently.
- **`coalition-calculus` dispatches with a spread** (`{...data}`, flat props),
  unlike every other kind. Do not copy it as the template.
- **`CityGrid` hard-throws outside 1–3 cities.** `TRIM['city-grid']` is 2; an
  earlier cap of 4 was a dead no-op.
- **Globe seed-yaw is `-((cLon + 90) * Math.PI) / 180`.** A `+180` opens on the
  limb: it renders, looks fine, shows the wrong hemisphere.
- **Match line endings per file.** Some files are CRLF; exact-string anchors
  fail unless you match `\r?\n`. This is the whole reason `wire-kind.mjs`
  exists.
- **In-SVG `<text>` uses a literal font stack, never `var()`** (RD-01b) —
  presentation attributes lose to any stylesheet rule, and satori/resvg do no
  `var()` substitution.
- **A missing KIND_PRIORITY fails silently** at runtime: the kind sinks to the
  default 30 and never gets picked as a story beat (this is how four WebGL
  flagships sat unscored); `check:catalog` catches it. **A CUES id with no
  `data-cue`** lights nothing; check 7 catches it, and the render gate blocks
  a page whose cue names a missing anchor.
- **A control or a JS-only disclosure inside the build scene** breaks the
  render gate's BUILD check: put the scene on the graphic, not the card.

## Finish

```
npm run check:catalog
npm run graph
npm run check:render -- --slug 2026-06-03-<world>-showcase
```

`check:catalog` asserts the 1:1 pairing, the order, KIND_PRIORITY coverage, a
reader for every DATA field, the alias map and the CUES anchors. `npm run
graph` refreshes the derived graph — commit its output alongside the kind, or
`prebuild` will fail on a stale graph. `check:render` (2026-09-23) renders the
showcase that carries the worked example at 1280 and 375 as a signed-in
reader and fails on overflow, clipping, text on text, duplicate chrome, a cue
numeral without its anchor, a build that ends off the no-JS page, or text
below 9.5px; open the section's screenshots at both widths under
`research/_ui/<date>/` and read them. The commit hook refuses a component
commit without a fresh clean run.

Then run `/verify-done`.

## Before you start

Read `docs/design/blueprints/<world>/$0.md` — **its corrections header first;
that header overrides the original handoff.** A blueprint written before Lens
Phase 6 may describe a drawing, a how-to-read paragraph or an EXPLAIN string
the catalog's NOTES line says is retired: the catalog wins. The blueprint is
binding otherwise; screenshots are reference only, and four contain real
ledger-collision bugs the blueprints already correct.
