# Handoff — agent guide

> **You are implementing 28 new section kinds in the Parallax repo.** This folder
> is the contract. Read this file, then `INTEGRATION.md`, then work one kind at a
> time from `blueprints/`.
>
> This guide follows the repo's own [agents.md](https://agents.md) convention so
> Claude Code picks it up the same way it picks up the repo's `AGENTS.md`.

---

## 0. Read these first, in this order

| Order | File | Why |
|---|---|---|
| 1 | `INTEGRATION.md` (this folder) | what the 28 kinds are, what is NOT in scope, the registry moves |
| 2 | `COLLISIONS.md` | five of the 28 sit next to kinds you already have. Read before writing a `DON'T USE` line |
| 3 | `TYPE-MAPPING.md` | the prototypes are typeset in Literata. The repo is not. Apply this table |
| 4 | repo `docs/STATE-OF-PLAY.md` | ~70 files of P0–P8 work are uncommitted. Know that before you branch |
| 5 | repo `docs/design/CANON.md` + `motion.md` + `worlds/<world>.md` | the rules every component obeys regardless of blueprint |
| 6 | `blueprints/<world>/<kind>.md` | the per-component contract |

`README.md` in this folder is the **design-system reference** — the size system,
the explainability contract, the mark construction, the brand rules. It predates
this integration pass and is still accurate for those subjects. It is background,
not your task list.

**Do not read the `.dc.html` prototypes as code.** They are Design Components
from a different runtime; copying their markup would fight your Astro
conventions. The blueprint is the spec, `screenshots/` is the visual reference.

---

## 1. The one rule that will bite you

`npm run check:catalog` enforces a **1:1, same-order** match between
`SECTION_KINDS` (`src/content/config.ts`) and the `##` blocks in
`docs/design/catalog.md`. Adding a kind to one without the other fails the
check. The catalog file ends with:

```html
<!-- check:catalog expects exactly the SECTION_KINDS list above this line -->
```

New blocks go **above** that comment, in the same order as the array.

---

## 2. Registry duty — five moves per kind, all in one commit

Straight from `docs/design/blueprints/_TEMPLATE.md`. Every kind needs all five:

1. **`SECTION_KINDS`** — `src/content/config.ts`, appended to its world's block
   (see `registry/SECTION_KINDS.diff.md` for exact insertion points).
2. **Dispatch** — `src/components/SectionBody.astro`: import + switch arm.
   **Never `SectionRenderer.astro`** — story mode shares the dispatcher.
3. **Explainer** — `src/lib/explainers.ts`, the `what` / `how` pair
   (`registry/explainers.entries.ts` has all 28, copy-paste ready).
4. **Catalog block** — `docs/design/catalog.md`
   (`registry/catalog-blocks.md`, in order).
5. **Prefix documented** — `src/components/AGENTS.md` §4, plus a worked example
   in that world's `2026-06-03-<world>-showcase` issue
   (`mdx/<kind>.mdx` has a real payload per kind).

## 3. Definition of done, per kind

```bash
npm run check:catalog     # 1:1 + order — the hard gate
npm run build             # green
npm run design:check      # token copies not drifted
npm run dev               # verify in browser at 375px AND desktop
```

Then walk the blueprint's §11 acceptance checklist. It is binary — every box is
checkable without judgment. If a box cannot be ticked, **update the blueprint
first, visibly, and say so in the commit body.** Blueprints are contracts; they
do not get quietly bent to match the build.

## 4. Order of work

The 28 are independent — no kind imports another. Suggested order, cheapest
structural risk first:

1. **SVG, no interaction** (12): `rank-bump`, `age-pyramid`, `turnout-margin`,
   `debris-histogram`, `glacier-dumbbell`, `heat-uptake`, `river-multiples`,
   `service-arcs`, `daylight-band`, `channel-ternary`, `goal-clock`,
   `volume-accuracy`
2. **HTML/CSS, no SVG** (8): `bill-funnel`, `margin-bullets`, `revenue-mosaic`,
   `state-timeline`, `attrition-waffle`, `finish-interval`, `rain-calendar`,
   `mission-timeline`
3. **One state control** (6): `majority-flow`, `porkchop-grid`, `fare-spread`,
   `price-swarm`, `route-criteria`, `latency-ridge`
4. **Structurally fiddly, do last** (2): `flame-graph` (recursive layout),
   `knockout-bracket` (two feeder links per match — see that blueprint's §4;
   this is where the prototype had its only real bug)

## 5. Things about this repo the blueprints assume

- **Fallback first.** Everything paints its final state with no JS. Interaction
  is added on top by a tiny `is:inline` island, gated behind `html.js`.
  `topic/politics/CoalitionCalculus.astro` is the reference pattern for reader
  agency: data at rest → one chip-set control → `aria-live` verdict →
  keyboard-complete → refusals that explain themselves.
- **No client framework, no bundle.** Vanilla islands only.
- **Tokens, never hexes.** `shared/design/tokens.css` is canonical; the copies
  under `src/styles/shared/` are generated — edit the canonical file and run
  `npm run design:sync`. Every colour in these blueprints is given as a token.
- **Honesty chips.** Any visual compression (log scale, √-compression,
  exaggeration, per-panel normalisation) auto-renders a mono chip declaring it.
  Six of these 28 need one; each blueprint §3 names it.
- **`touch-action: pan-y`** is mandatory on any drag surface.
- **Caption + source + plain line** on every viz kind. No exceptions.

## 6. What is deliberately NOT here

- **No component code.** By design — you are writing Astro against your own
  conventions, not porting a prototype.
- **No photographs.** The prototypes' plate frames are empty drop zones.
- **No new tokens.** All 28 use the existing six-world token set. If one
  genuinely needs a new token, that is a canon change — raise it, don't add it.
- **The other 32 instruments** from the design work map onto kinds you already
  have (`approval-chart`, `chamber`, `climate-spiral`, `chip-die`, `xg-race`
  and so on). Not in scope; see `INTEGRATION.md` §"The 28 kinds".
