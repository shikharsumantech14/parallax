# Parallax visual canon

> **DRAFT AMENDMENTS AWAITING SIGNATURE (2026-09-04).** §1 (flat surfaces), §7
> (where the source line renders), §10 (the four-layer explainability stack),
> §11 (glass modal-only), §13 items 5 and 9, and the new §14 were drafted at
> shell adoption against the shipped CSS. REVAMP-PLAN §6 requires the operator's
> signature on canon edits; until this line is removed, those passages are the
> agent's draft, not law. The rest of this document is unchanged.
>
> **What this is.** The master design document for the Parallax product elevation
> (2026-07). Every visual decision that would otherwise live in a designer's (or a
> model's) head is written here as a **checkable rule**. If you are implementing a
> component, a page, or a story card and you find yourself making a visual judgment
> call that this document does not cover — stop, and either find the answer in the
> companion specs (`motion.md`, `worlds/<topic>.md`, `blueprints/<world>/<kind>.md`,
> `APP-DESIGN-SPEC.md`, `STORY-MODE-SPEC.md`, `JOURNEY-SPEC.md`) or flag it for the
> operator. Do not improvise taste.
>
> **Authority order** (when documents disagree): a component's blueprint > the world
> spec > this canon > older docs (`docs/archive/CLAUDE-DESIGN-BRIEF.md`, `docs/archive/DESIGN-REVAMP-NOTES.md`
> — both are historical context now, not law).

---

## 1. What Parallax looks like (the one-paragraph brief)

Parallax is a **printed publication that learned to move**. Warm paper, ink, one
accent per world, a three-font trio (Fraunces / Schibsted Grotesk / JetBrains Mono),
data drawn as **line-art and geometry — never photoreal, never glossy**. Motion is
editorial: things *settle*, *draw*, and *sweep* into place the way a chart is inked,
and then they hold still. Interactivity is an invitation ("drag to orbit", "hover a
bloc"), never a demand. Whitespace is content. When in doubt, the test is: *would
this feel right in a Pentagram annual report — and would it survive being printed
in two colors?* If no to either, cut it. Surfaces are **flat** (RD-05, shell
adoption 2026-09): reading surfaces and home carry no radius and no drop shadow;
a hairline is the edge, and every figure wears a 3px world rule on top — ink on
the light desks, accent on the dark. Elevation is for marks and scenes, never for
the paper they sit on (§14).

---

## 2. The one-metaphor rule (issue composition)

The research finding this encodes: **one vivid metaphor explored deeply beats many
small charts.** Readers remember the picture, not the words.

- Every issue names **one hero visual** — the single component that carries the
  issue's structural argument (the chamber for a vote story, the solar system for a
  trajectory story). The drafter picks it FIRST, before writing sections.
- The hero visual is the only section that may use `layout: split` (the sticky
  scrollytelling layout) and it should — the issue's deepest explanation happens
  while the hero holds on screen.
- Every other viz **supports** the hero: smaller, quieter, single-state.
- **Never two WebGL sections adjacent.** Never more than **3 "loud" sections** per
  issue (loud = WebGL, `layout: bleed`, or a full-width animated viz).
- One issue = one world = one accent. Cross-world components are allowed (the kinds
  are topic-styled, not topic-locked) but they wear the issue's theme.

## 3. Density: the act structure (the whitespace ratio, made checkable)

The operator's ask — "find the gap between minimalism and fully overpowered" — is
enforced structurally, not aesthetically:

- An issue is **2–4 acts**. Acts are separated by the `act-break` section kind
  (ghost numeral, rule, air). An act is 2–4 sections.
- Each act contains **at least one quiet section** (`prose`, `quote`, or any section
  with `layout: breath`) and **at most one loud section**.
- ≤ 1 `layout: bleed` per act. The issue opens at default width — the first bleed
  must be *earned* (never before section 2).
- The eye-rest rule: after any loud section, the next section is quiet.
- Section count discipline: 6–12 sections per issue. Below 6, the act structure
  collapses; above 12, split the story.

A stylist pass can verify every one of these mechanically.

## 4. The line-art doctrine (all 3D + SVG)

This is what makes 90 components feel like one publication.

- **Materials:** `MeshBasicMaterial` / `LineBasicMaterial` / `PointsMaterial` only.
  No lights, no `MeshStandardMaterial`, no shadows, no environment maps, no textures
  (the country-globe topojson line work is the reference).
- **Restrained fills + baked shading (2026-07-06, review R2-3).** Line-art alone was
  reading as bare wireframe ("looks like a layout, not a mountain"). Filled SURFACES
  are now allowed to give a scene *substance* — BUT only flat, editorial, and baked:
  a filled mesh may carry **vertex colors** that encode data (hypsometric elevation
  tint: green→tan→brown→white) and/or a **baked hillshade** (a fake directional shade
  precomputed per vertex from the geometry and multiplied into the vertex color — NOT
  a runtime light). Still `MeshBasicMaterial`; still no runtime lights, no `Standard`
  material, no shadows/env-maps/PBR/gloss/photoreal textures. The test: it must still
  print as a two-colour editorial diagram, and the fill must *serve legibility or
  encode data*, never decorate. The terrain relief surface (hypsometric + hillshade
  under the contour lines) is the reference; globes may carry a faint land/ocean tint.
- **No postprocessing. No bloom.** Glow = additive-blended radial-gradient sprites
  (`glowSprite` in `src/scripts/viz3d/helpers.ts`). Depth = paper-colored occluder
  geometry (the existing globe's occluding sphere is the pattern).
- **Palette per scene:** paper (background/occluders), ink (structure, at the
  opacities in §6), accent (the data), muted (support). A scene may add at most
  **two** data-encoding colors beyond the accent (e.g., party colors), and they must
  come from the section's `data` payload, not be invented.
- **Silhouette test:** every 3D scene must read correctly as a still frame — if you
  paused it and printed it, it's a legible diagram with a caption. (This is also the
  reduced-motion frame, see `motion.md`.)
- **SVG conventions** stay as documented in `src/components/AGENTS.md` §5
  (transparent backgrounds, `paint-order` halos, in-SVG legends, `overflow: visible`
  for label bleed).

## 5. Type in viz

| Role | Face | Size (px, desktop → 375px) | Case / tracking |
|---|---|---|---|
| In-viz editorial callout / annotation | Fraunces | 15–18 → 14 | sentence case, italic allowed |
| Data labels, legends | Schibsted Grotesk | 12–13 → 11.5 | sentence case |
| Axes, units, readouts, coords | JetBrains Mono | 10–11 → 9.5 | uppercase, +0.08em |
| Big value moments (count-ups) | Fraunces (values) or Mono (telemetry worlds) | per world spec | tabular figures always |

- Minimums are hard floors: **never below 9.5px** rendered on any viewport.
- Numerals are tabular everywhere (`font-variant-numeric: tabular-nums`).
- The unified scale lives in `src/styles/viz-type.css` (`--viz-fs-*`, `.vz-*` roles)
  — use those tokens, don't restate sizes.
- SVG text: inline `style="font-family:..."` with a LITERAL stack (never a
  presentation attribute), halo via `paint-order="stroke"`. Not because `var()`
  fails there — measured 2026-08-27, it resolves fine in Chromium — but because
  a presentation attribute is the lowest-specificity thing in CSS and any rule
  silently beats it, and because satori/resvg do no var() substitution when they
  rasterise the OG cards. See src/components/AGENTS.md §5.

## 6. Color discipline

- Text on light paper uses `--accent-deep`, never the vivid `--accent` (WCAG AA).
  Vivid accent is for fills, rules, data marks, and dark-world text where it passes.
- Standard ink opacities (matching the existing globe/scene conventions):
  structure lines **0.42**, support/graticule **0.16–0.22**, occluders paper @ 1.0,
  data marks 0.85–1.0, idle/decoration ≤ 0.12.
- Fixed data encodings are exempt from theming (climate blue→red ramp, win/loss
  green/red pairs) but must be declared in the component blueprint.
- Never introduce a new brand color. `--accent-alt` exists in every world for the
  contrast role (opposition, alert, comparison-B).

## 7. Honesty defaults (charts must not lie, even beautifully)

- Log scales, compressed distances, exaggerated verticals, truncated axes → the
  caption **must say so**, in the mono unit-chip pattern: `distances log-compressed`,
  `vertical ×12`. The component renders this automatically from its data flags —
  honesty is not left to the author's memory.
- Count-ups tween to the value already in the HTML (existing VizMotion contract).
- Every viz keeps its `source` line. No source, no section. Since shell adoption
  (2026-09) it renders **once, from `core/Section.astro`**, as the plain
  paragraph's second line — `SOURCE · …` at 9px/600/.14em mono — for every kind,
  from the section frontmatter. Components do not render their own; the seventy
  that did were stripped. (The ⤢ study view therefore shows no source: it portals
  the card, and the source lives with the section. A modal source line is a
  separate decision, recorded in REVAMP-PLAN §0.)

## 8. The fallback-first doctrine

The no-JS / no-WebGL / reduced-motion fallback is a **first-class design deliverable**,
not a degradation:

- Every blueprint contains a fallback mini-spec. The fallback is designed to be
  *the print edition of the same idea* — a composed static SVG/HTML diagram, not a
  screenshot and not an apology.
- Hidden-until-reveal states are gated behind `html.js` (existing contract). No JS ⇒
  everything paints in final state. Print ⇒ same.
- `prefers-reduced-motion` ⇒ continuous motion freezes at the composed still
  (`motion.md` §reduced-motion); entrances render final state; interactive hints
  (drag/hover chips) hide.
- WebGL absent ⇒ the static fallback simply stays. No error states, no spinners.

## 9. Interaction grammar

A small, fixed vocabulary — components compose these, never invent new gestures:

| Gesture | Meaning | Affordance |
|---|---|---|
| Drag (pointer/touch) | rotate the scene | `viz3d__hint` chip: "drag to orbit" — fades in when live |
| Wheel / pinch | zoom, clamped | no chip; discoverable, never required to read the data |
| Hover / tap a mark | inspect → tooltip readout | cursor change + `hoverLift` on the mark |
| Click a control chip | switch scene state (`setState`) | mono pill buttons, `aria-pressed`, max 3 states |
| Scroll (in `layout: split`) | advance the explanation | the prose column IS the control |
| ⤢ | expand to study view | existing ExpandModal, unchanged |

- **Everything readable without interacting.** Interaction reveals *more*, never
  *the point*. (A reader who never touches the scene still gets the argument — from
  the composed default state + caption + plain line.)
- Touch: `touch-action: pan-y` always (vertical scroll is sacred); no gesture
  hijacking; 44×44 minimum targets on controls.
- Keyboard: state chips and expand are focusable buttons; canvas scenes are
  `aria-hidden` decoration over their readable fallback/legend, which carries the
  data for AT users.

## 10. The comprehension layer ("a smart 15-year-old finishes every issue")

- Every viz section carries a three-part explainability stack, all static HTML,
  all rendered by `core/Section.astro` (shell adoption, 2026-09):
  1. **How to read this** — a paragraph ABOVE the graphic (`.px-viz__how`, the
     handoff's contract part 02). Authored `section.howToRead` wins; otherwise
     the per-kind `EXPLAIN[kind].how` from `src/lib/explainers.ts` (the fallback
     flipped on 2026-09-04 after the copy review in
     `docs/design/EXPLAIN-HOW-REVIEW.md`). The ten VizCard kinds render theirs
     INSIDE the card, where the handoff's shell puts it; a `:has()` rule hides
     Section's copy there, so **a section shows exactly one**, never two.
  2. The graphic, with its **caption** — the DATA claim, the only field the
     verifier traces.
  3. The **plain line** BELOW the graphic: `IN PLAIN TERMS — <one sentence>`
     (`.px-plain`) explaining the FORM ("Each block is one seat; the dotted arc is
     the majority line"), with `SOURCE · …` as its second line (§7).
  The prose makes the ARGUMENT. Four layers, no overlap: how-to-read = usage,
  caption = data, plain = form, prose = argument. Confusing them trips the
  verifier's `PLAIN-CLAIM` / `CAPTION-FORM` / `REDUNDANT-HOWTO` flags.
- Authored `section.plain` and `section.howToRead` override the per-kind defaults
  from `src/lib/explainers.ts`. The drafter authors a `plain` per viz section and
  a `howToRead` per **instrument** (any kind with a control): a control clause
  ("Press Linear…") must never lead the paragraph, because the control is
  `html.js`-gated and the paragraph is not — the static reading leads, the
  control trails.
- Every section carries a `skimCaption` (skim mode = the complete 90-second read).
- Jargon rule: the first use of any term of art in an issue gets an in-prose gloss
  or a plain-line mention. The verifier checks this.

## 11. Anti-patterns (the "generic AI design" kill list)

Reject on sight, in any surface:

- Gradient buttons/CTAs; rainbow or mesh gradients; glassmorphic content cards
  (glass survives on **modal** chrome only — the reading toolbar has been flat,
  opaque paper with a 2px ink rule, since `943fe09`); drop shadows on any
  reading surface (§14); floating blob shapes; neumorphism.
- Bloom/postprocessing, lens flares, photoreal planets, skyboxes, star-field
  particle backgrounds (space's darkness is paper, not a screensaver).
- Spring/bounce easing (see `motion.md` — our springs are critically damped, they
  never overshoot); parallax scroll effects (yes, despite the name); scroll-jacking
  on article pages (story mode's snap container is the one sanctioned exception).
- Emoji in UI, icon libraries, stock illustration styles. Icons are bespoke inline
  SVG, line-drawn, 1.5px stroke.
- Dark-pattern engagement: countdowns, fake scarcity, guilt copy, pre-checked boxes.
- Centered-everything layouts; text over busy visuals without a paper halo;
  more than one italic accent word per title.

## 12. Where the JS budget stands (2026-07 policy)

**Rich on issues + story mode, lean everywhere else.** Issue pages and `/s/` story
pages may carry substantial interactivity — always lazy-loaded, code-split, and
fallback-first per §8. Home, topic indexes, about, and the app's non-auth pages stay
in the near-zero-JS posture. The onboarding surface keeps its existing exception.
`AGENTS.md` §7 records this as the current rule; this canon governs *how* the budget
is spent (never on decoration — every interactive byte serves comprehension).

## 13. Component quality bar (the acceptance floor)

A component ships only when its blueprint's acceptance checklist is fully ticked.
Universal checks (every blueprint inherits these):

1. Reads correctly as a still (silhouette test) — screenshot with JS disabled.
2. 375px: no horizontal overflow, labels ≥ 9.5px, targets ≥ 44px.
3. Reduced-motion: composed still, no dead space, hints hidden.
4. Tokens only — grep the component for hex literals; only blueprint-declared
   fixed encodings pass.
5. How-to-read + caption + plain line + source all render — exactly one of each
   per section (§10); the component renders none of the four itself except the
   caption row inside a VizCard.
6. WebGL: boots only on scroll-in; disposes on pagehide; three-chunk absent from
   pages without 3D kinds; DPR ≤ 2; RAF pauses off-screen.
7. Data payload validates against the blueprint schema by inspection; component
   degrades gracefully on missing optional fields.
8. The px- prefix is unique (grep `meta.css`, `base.css`, and this repo's
   components before claiming).
9. Flat (RD-05, §14): the card carries no `border-radius`, no `box-shadow`, no
   hover `transform`; the 3px `--viz-edge` top rule is present; nothing the
   component adds re-elevates the paper. Marks may still lift (§9).

## 14. Surfaces and elevation (RD-05, shell adoption 2026-09)

Written against the shipped CSS (`b74815d`, `943fe09`), not the handoff's
prototypes — where they differ, this is what is true.

- **The boundary is a surface class, never a component.** Reading surfaces
  (issue pages, viz cards, primer, letters, annotations, the gate) and home
  (category cards, the featured plate, archive rows, the six topic indexes)
  flatten together. Flat-next-to-soft in one scroll column is the worst of both.
- **Flat means:** `border-radius: 0`, `box-shadow: none`, no hover translate. The
  edge is a **1px `--rule` hairline**; where a shadow used to be a surface's
  only edge (the topic-index empty states), the hairline replaced it.
- **Every figure wears a 3px rule on top, `--viz-edge`** — `var(--ink)` on the
  light desks (politics, earth, travel), `var(--accent)` on the dark (space,
  tech, sports). On a dark ground an ink rule vanishes into the paper; on a
  light ground the vivid accent is louder than the figure it frames. Declared per
  theme in `src/styles/themes/<world>.css`; a world without one falls back to
  ink. Bespoke `[data-viz-root]` cards carry the same rule themselves.
- **The radius flip lives in the publication, not the shared tokens.**
  `--r-card` and `--r-tile` are overridden to `0` in `src/styles/base.css`,
  NOT in `shared/design/tokens.css` — `app/` consumes those tokens and keeps its
  own spec until Phase 8. **`--r-pill` is not flipped**: status chips, CTAs, the
  toolbar and progress caps are UI chrome, not reading surfaces.
- **What keeps its shadow, and why:** focus rings (a11y); inset hairlines (they
  *are* the edge); halo rings and glows on data marks; slider thumbs; CSS-3D
  scene depth — ArchStack, PlayerCard, TacticsPitch, ChipDie, CoreSample,
  SeaLevelTank, AtmosphereColumn, BillPassage, ItineraryReel — where the shadow
  is the graphic's physics (RD-06); the viz3d overlay chrome; modal, popover and
  toast chrome; the onboarding surface's own identity. Elevation is for things
  the reader *reads*, never for the paper they read *on*.
- **Hover on a surface is `border-color` only** (`motion.md` rule 7). `hoverLift`
  is a mark's gesture.
- **The reading toolbar** is fixed, opaque paper, a **2px ink rule**, no blur, no
  shadow; live progress stays. Glass survives on modal chrome only.
- **A hairline never disappears into its ground.** The `--viz-edge` fallback and
  the light/dark split above exist because the same rule cannot serve both
  grounds; do not "simplify" it to one colour.

---

*Companions: `motion.md` (the motion vocabulary) · `worlds/` (per-world language)
· `blueprints/_TEMPLATE.md` (the component contract) · `catalog.md` (what to use
when) · `physics/` (the formula sheets implementations must mirror).*
