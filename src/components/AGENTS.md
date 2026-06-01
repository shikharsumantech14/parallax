# Components — agent guide

> Local rules for `src/components/`. Read the root `AGENTS.md` first for
> project-level context.

---

## 1. Two layers, six topics

Components split into:

- **`core/`** — topic-agnostic. Renders identically under any `data-topic`,
  picking up colour/font tokens automatically. Includes the Hero, Primer,
  SkimToggle, Quote, Prose, Comparison, DataReadout, BeatSheet, Sources,
  Footer, Section, Masthead.
- **`home/`** — meta-brand pieces used only on `/` and `/topics/*` index
  pages (TypographicChord, TopicStrip, CategoryCard, CategoryGrid,
  ArchiveList, FeaturedIssue).
- **`topic/<topic>/`** — topic-signature components. One folder per topic.
  Each topic also has its own `<Topic>Index.astro` that drives
  `/topics/<topic>/`.
- **`SectionRenderer.astro`** — the single dispatcher. Reads
  `section.kind` from the issue MDX, renders the matching component, and
  passes through the section's `data` payload.

---

## 2. Section-kind → component map

**Source of truth:** `SECTION_KINDS` in `src/content/config.ts` (33 kinds).

| Kind | Component | Topic-scope |
|---|---|---|
| `hero` | inline in `src/pages/issues/[slug].astro` (not via renderer) | universal |
| `prose` | `core/Prose.astro` | universal |
| `quote` | `core/Quote.astro` | universal |
| `comparison` | `core/Comparison.astro` (2–3 column side-by-side) | universal |
| `data-readout` | `core/DataReadout.astro` (telemetry tile grid) | universal |
| `beat-sheet` | `core/BeatSheet.astro` | universal |
| `timeline` | `topic/politics/Timeline.astro` | politics-styled, used across topics |
| `paradox` | `topic/politics/Paradox.astro` | politics-styled, used across topics |
| `analogy` | `topic/politics/BrothersAnalogy.astro` | politics |
| `bill-breakdown` | `topic/politics/BillBreakdown.astro` | politics |
| `vote-result` | `topic/politics/VoteResult.astro` | politics |
| `seat-chart` | `topic/politics/SeatChart.astro` | politics |
| `approval-chart` | `topic/politics/ApprovalChart.astro` | politics |
| `power-matrix` | `topic/politics/PowerMatrix.astro` | politics |
| `orbital-shells` | `topic/space/OrbitalShells.astro` | space |
| `orbit-trace` | `topic/space/OrbitTrace.astro` | space |
| `launch-stats` | `topic/space/LaunchStats.astro` | space |
| `elevation-profile` | `topic/earth/ElevationProfile.astro` | earth |
| `region-map` | `topic/earth/RegionMap.astro` | earth |
| `climate-strip` | `topic/earth/ClimateStrip.astro` (`px-cstrip` prefix) | earth |
| `carbon-gauge` | `topic/earth/CarbonGauge.astro` | earth |
| `commit-grid` | `topic/tech/CommitGrid.astro` | tech |
| `benchmark-chart` | `topic/tech/BenchmarkChart.astro` | tech |
| `adoption-curve` | `topic/tech/AdoptionCurve.astro` | tech |
| `journey-map` | `topic/travel/JourneyMap.astro` | travel |
| `route-card` | `topic/travel/RouteCard.astro` | travel |
| `city-compare` | `topic/travel/CityCompare.astro` | travel |
| `match-stat-line` | `topic/sports/MatchStatLine.astro` | sports |
| `league-table` | `topic/sports/LeagueTable.astro` | sports |
| `player-radar` | `topic/sports/PlayerRadar.astro` | sports |

Topic-scoped components are tinted via the topic's theme tokens (`--accent`,
`--ink`, etc.). They render under any `data-topic` but look most "at home"
in their parent topic.

---

## 3. Adding a new section kind — checklist

A new component touches five places. Miss one and the build either fails
or silently renders nothing.

1. **Add the kind name** to `SECTION_KINDS` in `src/content/config.ts`.
2. **Create the component** at `src/components/<scope>/<Name>.astro` (scope
   = `core/` or `topic/<topic>/`).
3. **Dispatch the kind** in `src/components/SectionRenderer.astro`:
   ```astro
   {section.kind === 'new-kind' && <NewComponent section={section} />}
   ```
4. **Add CSS** in the correct theme file (`src/styles/themes/<topic>.css`)
   or `base.css` if the component is universal.
5. **Document it here** — add a row to §2 and any non-obvious rule.

For data viz components that emit SVG, follow the SVG conventions in §5.

---

## 4. CSS class prefix isolation (hard rule)

Each component owns a unique `px-<abbrev>` prefix, ≤6 chars. Check
`meta.css` for collisions before choosing — collisions silently corrupt
layout (the wrong rule wins).

Known reservations:

| Prefix | Owner | Notes |
|---|---|---|
| `px-strip` | TopicStrip (in `meta.css`, `display: flex`) | DO NOT reuse |
| `px-cstrip` | ClimateStrip | renamed from `px-strip` after collision |
| `px-cgauge` | CarbonGauge | |
| `px-ortrace` | OrbitTrace | |
| `px-launch` | LaunchStats | |
| `px-bench` | BenchmarkChart | |
| `px-scurve` | AdoptionCurve | |
| `px-route` | RouteCard | |
| `px-ccomp` | CityCompare | |
| `px-ltab` | LeagueTable | |
| `px-radar` | PlayerRadar | |
| `px-appr` | ApprovalChart | |
| `px-pwm` | PowerMatrix | |
| `px-skim` | SkimToggle | |
| `px-primer` | Primer | |
| `px-prose-full` / `px-skim-caption-block` | skim-mode wrappers in `[slug].astro` | |

Naming convention: `px-<abbrev>`, ≤6 chars, unambiguous. When in doubt,
grep `meta.css` and `base.css` for the candidate prefix before committing.

---

## 5. SVG conventions (established 2026-05-03 across map / chart components)

Any component that emits inline SVG must follow these:

- **Transparent SVG background.** `background: transparent`. Do not wrap
  the SVG in a `<div>` with a `border` or `background: var(--paper)` — the
  SVG sits directly on the page background.
- **Path / topology loading.** Use
  `readFileSync(join(process.cwd(), 'node_modules/...'), 'utf-8')`. Never
  use `import.meta.url` + relative `../` — chunk depth changes between
  dev and build and the relative path breaks.
- **Natural Earth 50m for maps.** `countries-50m.json` (241 geometries).
  Use 110m only for thumbnails.
- **Two-pass country rendering.** Shadow group first (no stroke,
  `filter: drop-shadow(...)`), then fill group with borders. Creates
  raised-land depth without SVG-filter complexity.
- **SVG text fonts.** Use
  `style="font-family:'Cormorant Garamond',Georgia,serif"` — *not* the
  `font-family="..."` presentation attribute. CSS variables do not work
  in SVG presentation attributes. Display labels: Cormorant Garamond.
  Coord/axis text: JetBrains Mono.
- **Text halo.** `paint-order="stroke"` plus a `stroke` on the SVG `<text>`
  for readable labels over any fill. Never use a separate shadow element.
- **Legends inside SVG.** Cartographic legend boxes live as SVG `<g>`
  elements in the lower-left corner with `fill-opacity` for transparency.
  Never an HTML `<div>` legend below the SVG.
- **Ocean depth.** `<radialGradient>` (lighter centre, darker rim) plus
  a `<pattern>` water-ruling overlay at 15–22% opacity.
- **`overflow: visible` for label-heavy diagrams.** SVGs where axis
  labels, spoke labels, or annotations must bleed outside the viewBox
  (radar charts, orbit diagrams, adoption-curve milestones) set
  `overflow: visible` on `.px-<component>__svg` and add horizontal
  padding on the wrapper `.px-<component>__wrap { padding: 0 56px }`.
  Do not enlarge the viewBox to compensate — it wastes layout space.
- **Fixed-column label pattern.** Diagrams with many labelled rings at
  varying radii (OrbitTrace) place all labels in a fixed right column at
  `LABEL_COL = W * 0.76` with dashed connector lines from each data
  point. Clamp label Y positions to `[20, H-20]`.

---

## 6. The skim-mode wrapper pattern

Skim mode (toggle in `core/SkimToggle.astro`, mode state on
`#px-article[data-mode]`) hides prose and shows a per-section caption.

The wrapper is implemented in `src/pages/issues/[slug].astro` — not in
the components themselves:

```astro
{data.sections.map((section, i) => (
  section.kind === 'prose'
    ? (
      <Fragment>
        <div class="px-prose-full">
          <SectionRenderer section={section} index={i} />
        </div>
        {section.skimCaption && (
          <div class="px-skim-caption-block">
            <p class="px-skim-caption-text">{section.skimCaption}</p>
          </div>
        )}
      </Fragment>
    )
    : <SectionRenderer section={section} index={i} />
))}
```

CSS rules (`base.css`):

```css
#px-article[data-mode="skim"] .px-prose-full { display: none; }
.px-skim-caption-block { display: none; }
#px-article[data-mode="skim"] .px-skim-caption-block { display: block; }
```

Do not duplicate this wrapping into individual components. The site
template handles it once; new section kinds inherit nothing from it
unless they also need a skim equivalent (none do currently — all
non-prose kinds remain visible in skim mode).

---

## 7. Components that *don't* render via SectionRenderer

These render directly in templates, not via the dispatcher:

| Component | Rendered by |
|---|---|
| `core/Hero.astro` | inline in `src/pages/issues/[slug].astro` |
| `core/Primer.astro` | inline in `src/pages/issues/[slug].astro` |
| `core/SkimToggle.astro` | part of `.px-reader-controls` row in `[slug].astro` |
| `core/SaveButton.astro` | part of `.px-reader-controls` row in `[slug].astro` |
| `core/ReadingTracker.astro` | inline in `[slug].astro`, invisible sentinel |
| `core/AnnotationLayer.astro` | inline in `[slug].astro`, between article and ReactionsBar |
| `core/ReactionsBar.astro` | inline in `[slug].astro`, after AnnotationLayer |
| `core/NewsletterForm.astro` | rendered by `core/Footer.astro` |
| `core/Masthead.astro` | in `IssueLayout.astro` and `HomeLayout.astro` |
| `core/Sources.astro` | inline in `src/pages/issues/[slug].astro`, footer |
| `core/Footer.astro` | in both layouts |
| `home/*` | in home + topic-index templates |
| `topic/<topic>/<Topic>Index.astro` | dispatched from `src/pages/topics/[topic].astro` |

---

## 8. Reader-interaction client islands (Phase B)

Five new client islands ship with Phase B. All live in `core/`, all
call `app.parallaxlens.com/api/*` with `credentials: 'include'`. All
fail silently — analytics and engagement must never break the reading
experience.

### CSS class prefix reservations (additions)

| Prefix | Owner |
|---|---|
| `px-save` | SaveButton |
| `px-reactions` | ReactionsBar |
| `px-reading-tracker` | ReadingTracker (invisible — no visible CSS) |
| `px-annot` | AnnotationLayer |
| `px-newsletter` | NewsletterForm |

### Client island pattern

All use `is:inline` script that walks `previousElementSibling` to
find the root element by class name (not by ID — avoids ID collisions
when multiple islands are on the same page). They read `data-*`
attributes from the root element for config (issueId, appUrl) rather
than using Astro's `define:vars` — this keeps the script out of the
build-time bundle and avoids hydration issues.

The pattern from `SaveButton.astro`:

```astro
<div class="px-save" data-issue-id={issueId} data-app-url={appUrl}>
  <!-- markup -->
</div>

<script is:inline>
  (function () {
    var root = document.currentScript.previousElementSibling;
    while (root && !(root.classList && root.classList.contains('px-save'))) {
      root = root.previousElementSibling;
    }
    if (!root) return;
    var issueId = root.dataset.issueId;
    var appUrl = root.dataset.appUrl;
    // ...
  })();
</script>
```

### Unauthenticated reader flow

All islands that require auth handle the anonymous case the same way:
pass the full current URL (`window.location.href`) as the `next`
parameter, redirect to `appUrl + '/login?next=...'`. The
`safeNextPath` function on the app side allows-lists
`parallaxlens.com` as a redirect target so the reader returns to the
same issue after sign-in.

### `AnnotationLayer.astro` — the complex island

Selection capture uses:
- `document.addEventListener('mouseup')` deferred 10ms so selection settles
- `window.getSelection().getRangeAt(0)` + containment check
  (`article.contains(range.startContainer)`)
- Anchor JSON built as W3C TextQuoteSelector subset:
  `{ exact, before: lastN chars, after: firstN chars, section_index? }`
- Popover positioned via `getBoundingClientRect()` + `scrollY`
- Editor is a fixed modal with backdrop; `Escape` key closes both popover and editor

The finish sentinel for `ReadingTracker` is a
`<span id="px-finish-sentinel">` placed **inside the article element**
just before the closing `</article>` tag. `AnnotationLayer.astro` and
`ReactionsBar.astro` render **outside** the article, after it.

When adding a meta-brand or layout-chrome piece, render it directly. Only
narrative section components flow through `SectionRenderer.astro`.

---

## Change log

### 2026-05-20 — File created
Initial version. Section-kind → component table grounded in `config.ts`
and the filesystem. CSS prefix reservation table. SVG conventions and
skim-mode wrapper pattern from `docs/PROJECT.md` §6.
