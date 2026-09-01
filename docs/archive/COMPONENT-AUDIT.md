> # ARCHIVED — FROZEN HISTORY. NOT CURRENT.
>
> **Froze:** 2026-06-20  ·  **Superseded by:** `docs/design/catalog.md + npm run check:catalog`
>
> **Why kept:** A point-in-time component inventory. The catalog plus the build-enforced gate are now the live source.
>
> Do not treat anything below as the current state of the project, and do not
> act on its instructions. The single entry point is `docs/STATE-OF-PLAY.md`.
> Archived 2026-09-01 under CONTEXT-PLAN.md CD-07/CD-10.

---

# Component audit — kit vs. pipeline vs. issues (2026-06-03)

> Audit behind the "3D/interactive component library" work. Answers: are all the
> design-system components integrated into the pipeline, and do they actually
> show up in issues? **Short answer: every section kind is wired; most are just
> never demonstrated in a live (non-draft) issue.** The new showcase issues (G8)
> fix the demonstration gap.

## How rendering works (recap)
`src/content/config.ts` → `SECTION_KINDS` (30 kinds incl. `hero`). Each issue's MDX
frontmatter lists `sections: [{ kind, eyebrow, title, intro, data, … }]`.
`src/components/SectionRenderer.astro` dispatches `kind → component`. Chrome
(masthead, banner, colophon, subscribe, manifesto, chord, reading toolbar) renders
in the layouts / home, not via the dispatcher.

**Build/visibility:** `src/pages/issues/[slug].astro` `getStaticPaths()` builds **every**
issue (incl. `draft`) at `/issues/<slug>/`. Home (`pages/index.astro`) and `rss.xml.ts`
filter `status !== 'draft'`. ⇒ a `draft` issue is reachable by URL but **unlisted** —
ideal for a styleguide, and the reason the new charts "aren't present" on the live site.

## Integration status — all 30 kinds are wired ✓
Every `SECTION_KIND` has a `SectionRenderer` branch and a component file. No kind is
missing from the pipeline. The F2 pass re-skinned the signature charts to the v2 kit
classes (`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside the
shared `.px-viz` card; the rest keep their `px-*` classes.

## Demonstration status — the real gap

**Used in published issues (live):** `hero`, `timeline`, `bill-breakdown`, `vote-result`,
`comparison`, `prose`, `data-readout`. (Issues: delimitation, transgender-ratchet,
kessler-cascade, el-niño, seven-appeals.)

**Wired + built, but demonstrated ONLY in `draft` test issues (invisible on live site):**
`orbit-trace`, `launch-stats`, `approval-chart`, `power-matrix`, `benchmark-chart`,
`adoption-curve`, `route-card`, `city-compare`, `league-table`, `player-radar`,
`region-map`, `climate-strip`. → **This is why the operator sees no orbit etc.**

**Wired + built, but demonstrated NOWHERE (no issue uses them):**
`seat-chart`, `paradox`, `analogy`, `quote`, `beat-sheet`, `orbital-shells`,
`commit-grid`, `journey-map`, `match-stat-line`, `elevation-profile`, `carbon-gauge`.

## Resolution
The 6 `draft` **showcase issues** (G8 — one per world) demonstrate **every** kind for
their world (new 3D components + the existing signature + universal kinds), each section
captioned with the data it represents. That turns the whole library into a living,
URL-viewable styleguide and closes the demonstration gap above.

## Cosmetic kit↔Astro follow-ups (non-blocking)
- Kit pull-quote `.pq` style is unused — core `Quote` keeps its own look. (Could adopt
  `.pq` later; not required.)
- Kit `Cite` `.cite` superscript is inline-prose-only; no standalone slot. Fine as is.
- Inert dead CSS from F2 (old `.px-vote/.px-appr/.px-pwm/.px-cstrip/.px-ltab/.px-radar…`
  + `.px-skim-*`) still lingers in theme files — harmless, flagged for a safe cleanup pass.

## New library (this initiative)
Adds 30 new section kinds (5 per world) of interactive + 3D components in the v2 language
— 4 lazy Three.js showpieces (`coalition-orbit`, `orbit-globe`, `data-globe`,
`route-globe`) + ~26 CSS-3D / animated-SVG pieces — all themed through the per-topic vars
and demonstrated in the showcase issues. See the approved plan + `src/components/AGENTS.md`.
