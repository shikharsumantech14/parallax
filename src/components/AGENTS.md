# Components — agent guide

> Local rules for `src/components/`. Read the root `AGENTS.md` first for
> project-level context.

---

## 1. Two layers, six topics

Components split into:

- **`core/`** — topic-agnostic. Renders identically under any `data-topic`,
  picking up colour/font tokens automatically. Includes the Masthead, Banner,
  Hero, Primer, Section, Quote, Prose, Comparison, DataReadout, BeatSheet,
  Sources, Colophon, and the ReadingToolbar (the floating reading-progress +
  Full/Skim + Save pill that replaced the old SkimToggle). The scroll-reveal
  and count-up/cursor-warmth behaviours ship as two tiny vanilla
  progressive-enhancement islands — `core/Reveal.astro` and
  `core/VizMotion.astro` — discussed in §"v2 data-viz + chrome class
  exception" below.
- **`home/`** — meta-brand pieces used only on `/` and `/topics/*` index
  pages (TypographicChord, TopicStrip, CategoryCard, CategoryGrid,
  ArchiveList, FeaturedIssue).
- **`topic/<topic>/`** — topic-signature components. One folder per topic.
  Each topic also has its own `<Topic>Index.astro` that drives
  `/topics/<topic>/`.
- **`SectionRenderer.astro`** — the single dispatcher. Reads
  `section.kind` from the issue MDX, renders the matching component, and
  passes through the section's `data` payload.

**One 3-font type system (2026-06-21, supersedes per-topic display fonts).**
The product now uses a single trio everywhere — **Fraunces** (serif: headlines,
leads, nameplates, the one italic accent word), **Schibsted Grotesk** (sans:
body, UI, structural headings; replaced Inter Tight as `--font-body`), and
**JetBrains Mono** (labels, eyebrows, numerals). The six worlds no longer carry
per-world display fonts (Space Grotesk / Cormorant / Oswald etc. are retired) —
they differ by **accent colour + treatment** (case / weight / italic / ornament /
motif), not typeface. Normalised in `src/styles/type-v2.css` (imported last so it
wins); also touches `meta.css`, the six `themes/<topic>.css`, and SVG
`font-family` in `RegionMap`/`CarbonGauge` (now Fraunces, not Cormorant — note
this overrides the old §5 "Display labels: Cormorant Garamond" guidance).

---

## 2. Section-kind → component map

**Source of truth:** `SECTION_KINDS` in `src/content/config.ts` (63 kinds —
33 narrative/v2-viz kinds below, plus the 30-kind v2 3D / interactive
library in the block after the table).

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
| `climate-strip` | `topic/earth/ClimateStrip.astro` (v2 kit `.cs`, inside `.px-viz`) | earth |
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

**v2 data-viz note (2026-06-03).** Most topic charts plus the shared
`timeline` and `paradox` kinds were rewritten to the v2 kit's exact markup
and animations, and now emit the kit's *generic* data-viz class names
(`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside the
shared elevated `.px-viz` card (CSS in `src/styles/dataviz-v2.css`). This is
a deliberate, documented break from the `px-` prefix convention — see the
"v2 data-viz + chrome class exception" section below for the full list, the
`html.js`-gated reveal contract, and which components were left on their
`px-` classes.

### v2 3D / interactive library (2026-06-03) — 30 kinds, 5 per world

These are the new interactive + 3D section kinds, all in the v2 design
language. **Four are lazy WebGL scenes** (Three.js — marked **WebGL**
below); the other 26 are CSS-3D (perspective / `transform-3d`) or animated
SVG/canvas. The full architecture — the `Viz3DRuntime` lazy-WebGL pattern,
the shared `.px3d-*` CSS-3D mechanics, and the no-JS / reduced-motion
contract — is documented in the new "3D / interactive component library"
section (§10). Each component's per-component cosmetic CSS is a **scoped
`<style>` in its own `.astro`** (unique `px-*` prefix — see §4); only the
shared 3D mechanics + `.viz3d` mount live in `components-3d.css`. All take
`caption?` + `source?` like the other viz, and all render a static
SVG/HTML fallback by default.

| Kind | Component | Topic | Tech |
|---|---|---|---|
| `coalition-orbit` | `topic/politics/CoalitionOrbit.astro` | politics | **WebGL** |
| `swing-dial` | `topic/politics/SwingDial.astro` | politics | CSS-3D |
| `bill-passage` | `topic/politics/BillPassage.astro` | politics | CSS-3D |
| `vote-flow` | `topic/politics/VoteFlow.astro` | politics | SVG/CSS-3D |
| `margin-ladder` | `topic/politics/MarginLadder.astro` | politics | SVG/CSS-3D |
| `orbit-globe` | `topic/space/OrbitGlobe.astro` | space | **WebGL** |
| `trajectory-arc` | `topic/space/TrajectoryArc.astro` | space | SVG/CSS-3D |
| `delta-v-ladder` | `topic/space/DeltaVLadder.astro` | space | SVG/CSS-3D |
| `signal-readout` | `topic/space/SignalReadout.astro` | space | SVG/canvas |
| `descent-profile` | `topic/space/DescentProfile.astro` | space | SVG |
| `data-globe` | `topic/earth/DataGlobe.astro` | earth | **WebGL** |
| `core-sample` | `topic/earth/CoreSample.astro` | earth | CSS-3D |
| `sea-level-tank` | `topic/earth/SeaLevelTank.astro` | earth | CSS-3D/SVG |
| `climate-spiral` | `topic/earth/ClimateSpiral.astro` | earth | SVG/canvas |
| `quake-depth` | `topic/earth/QuakeDepth.astro` | earth | SVG |
| `arch-stack` | `topic/tech/ArchStack.astro` | tech | CSS-3D |
| `latency-waterfall` | `topic/tech/LatencyWaterfall.astro` | tech | SVG |
| `version-graph` | `topic/tech/VersionGraph.astro` | tech | SVG |
| `scaling-plot` | `topic/tech/ScalingPlot.astro` | tech | SVG |
| `throughput-dial` | `topic/tech/ThroughputDial.astro` | tech | SVG/CSS-3D |
| `route-globe` | `topic/travel/RouteGlobe.astro` | travel | **WebGL** |
| `elevation-trek` | `topic/travel/ElevationTrek.astro` | travel | SVG/CSS-3D |
| `itinerary-reel` | `topic/travel/ItineraryReel.astro` | travel | CSS-3D |
| `climate-calendar` | `topic/travel/ClimateCalendar.astro` | travel | SVG |
| `timezone-arc` | `topic/travel/TimezoneArc.astro` | travel | SVG/CSS-3D |
| `tactics-pitch` | `topic/sports/TacticsPitch.astro` | sports | CSS-3D/SVG |
| `shot-map` | `topic/sports/ShotMap.astro` | sports | SVG |
| `xg-race` | `topic/sports/XgRace.astro` | sports | SVG |
| `momentum-wave` | `topic/sports/MomentumWave.astro` | sports | SVG |
| `player-card` | `topic/sports/PlayerCard.astro` | sports | CSS-3D flip |

The four WebGL kinds (`coalition-orbit`, `orbit-globe`, `data-globe`,
`route-globe`) are the only section kinds that load Three.js, and only when
scrolled into view — see §10. Per-kind `data` shapes are documented for
issue authors in `src/content/issues/_AGENTS.md`; the six
`2026-06-03-<world>-showcase` draft issues are the canonical worked examples.

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

**Two documented v2 exceptions to this rule** (see the "v2 data-viz + chrome
class exception" section below for full detail):

- The unified press-header adopts the kit's `.mh*` class names verbatim
  (`core/Masthead.astro`, CSS in `base.css`).
- The ported data-viz adopt the kit's *generic* names —
  `.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel` (plus the
  shell hooks `.px-viz__cap` / `.px-viz__src`) — defined in
  `src/styles/dataviz-v2.css`. These are intentional adoptions, **not**
  collisions: the kit's animation/reveal CSS is tightly coupled to them.

Known reservations (still-live `px-` prefixes):

| Prefix | Owner | Notes |
|---|---|---|
| `px-viz` | shared elevated data-viz card (`base.css`) | wraps every ported chart; `data-reveal` root |
| `px-strip` | TopicStrip (in `meta.css`, `display: flex`) | DO NOT reuse |
| `px-cgauge` | CarbonGauge | kept on `px-` (free-standing gauge, light-touch port) |
| `px-seats` | SeatChart | kept on `px-` |
| `px-bills` | BillBreakdown | kept on `px-` |
| `px-analogy` | BrothersAnalogy | kept on `px-` |
| `px-msl` | MatchStatLine | kept on `px-` |
| `px-primer` | Primer | |
| `px-prose-full` / `px-skim-caption-block` | skim-mode wrappers in `[slug].astro` | |

Retired prefixes (the v2 data-viz port replaced these with the kit's generic
class above; the old per-component CSS in the theme files is now **inert dead
code** — no element emits it — pending a future safe cleanup pass):

| Retired prefix | Was | Now emits |
|---|---|---|
| `px-cstrip` | ClimateStrip | `.cs` |
| `px-ortrace` | OrbitTrace | `.ot` |
| `px-launch` | LaunchStats | `.ls` |
| `px-bench` | BenchmarkChart | `.bc` |
| `px-scurve` | AdoptionCurve | `.adc` |
| `px-route` | RouteCard | `.rc` |
| `px-ccomp` | CityCompare | `.cc` |
| `px-ltab` | LeagueTable | `.lt` |
| `px-radar` | PlayerRadar | `.pr` |
| `px-appr` | ApprovalChart | `.ac` |
| `px-pwm` | PowerMatrix | `.pm` |
| `px-skim` | SkimToggle (component **deleted**) | — (skim toggle now lives in `core/ReadingToolbar.astro`) |

**v2 3D / interactive library prefixes (2026-06-03).** Each of the 30 new
components (§2 block + §10) owns a **component-scoped** `px-*` prefix — its
cosmetic CSS lives in a scoped `<style>` inside that component's own `.astro`,
not in the theme files. (The shared 3D mechanics + the WebGL mount keep the
`.px3d-*` / `.viz3d*` namespaces in `components-3d.css`.)

| Prefix | Component | Prefix | Component |
|---|---|---|---|
| `px-co` | CoalitionOrbit | `px-dg` | DataGlobe |
| `px-swdial` | SwingDial | `px-core` | CoreSample |
| `px-billp` | BillPassage | `px-sltank` | SeaLevelTank |
| `px-vflow` | VoteFlow | `px-spiral` | ClimateSpiral |
| `px-mladr` | MarginLadder | `px-quake` | QuakeDepth |
| `px-og` | OrbitGlobe | `px-arch` | ArchStack |
| `px-traj` | TrajectoryArc | `px-lwf` | LatencyWaterfall |
| `px-dvl` | DeltaVLadder | `px-vgraph` | VersionGraph |
| `px-sig` | SignalReadout | `px-scale` | ScalingPlot |
| `px-desc` | DescentProfile | `px-tdial` | ThroughputDial |
| `px-rg` | RouteGlobe | `px-pitch` | TacticsPitch |
| `px-etrek` | ElevationTrek | `px-shot` | ShotMap |
| `px-ireel` | ItineraryReel | `px-xgr` | XgRace |
| `px-ccal` | ClimateCalendar | `px-mom` | MomentumWave |
| `px-tzarc` | TimezoneArc | `px-pcard` | PlayerCard |

Because these are scoped to their `.astro`, they cannot collide with the
global theme/`base.css`/`meta.css` namespaces — but the prefixes are still
unique and reserved here for the record.

Naming convention: `px-<abbrev>`, ≤6 chars, unambiguous. When in doubt,
grep `meta.css` and `base.css` for the candidate prefix before committing.
New narrative section kinds keep using `px-`; the kit class names above are
a closed, one-time v2 exception, not a new pattern to extend.

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
  `style="font-family:'Fraunces',Georgia,serif"` — *not* the
  `font-family="..."` presentation attribute. CSS variables do not work
  in SVG presentation attributes. Display labels: Fraunces (the serif voice;
  changed from Cormorant Garamond on 2026-06-21 with the unified type system).
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

Skim mode (toggle now in the Full/Skim segmented control inside
`core/ReadingToolbar.astro`, mode state on `#px-article[data-mode]`) hides
prose and shows a per-section caption. The `#px-article[data-mode]`
mechanism and the CSS below are unchanged from the old SkimToggle era —
only the control that writes the attribute moved into the toolbar.

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
| `core/ReadingToolbar.astro` | inline at the bottom of `[slug].astro` (floating glass pill: reading-progress bar + Full/Skim toggle + live % + read time + Save). Replaced the old `.px-reader-controls` row. |
| `core/SaveButton.astro` | inside `core/ReadingToolbar.astro` |
| `core/ReadingTracker.astro` | inline in `[slug].astro`, invisible sentinel |
| `core/AnnotationLayer.astro` | inline in `[slug].astro`, between article and ReactionsBar |
| `core/ReactionsBar.astro` | inline in `[slug].astro`, after AnnotationLayer |
| `core/LettersBlock.astro` | inline in `[slug].astro`, after ReactionsBar |
| `core/NewsletterForm.astro` | rendered by `core/Colophon.astro` (and by `home/SubscribeStrip.astro` on the home page) |
| `core/Masthead.astro` | in `IssueLayout.astro` and `HomeLayout.astro` |
| `core/Banner.astro` | inline in `[slug].astro` (per-issue standing plate; carries the per-world register readout — telemetry orbit / atlas coords / build hash / vol-no / matchday — that the unified masthead no longer shows) |
| `core/ReadingGate.astro` | inline in `[slug].astro` — metered soft signup wall. Anonymous readers get primer + first 2 sections, then a per-topic-themed "Create a free account to finish" wall hiding the rest; signed-in (cookie heuristic) ⇒ full issue. No-JS / crawlers ⇒ gate hidden, full article renders (SEO-safe). `px-gate`. |
| `core/Sources.astro` | inline in `src/pages/issues/[slug].astro`, footer |
| `core/Colophon.astro` | in both layouts (editorial footer; replaced `core/Footer.astro`) |
| `core/Reveal.astro` | both layouts, after content — scroll-reveal island (adds `.is-in` to `[data-reveal]`) |
| `core/VizMotion.astro` | both layouts, after content — count-up + cursor-warmth island (`[data-countup]` / `[data-warmth]`) |
| `core/Viz3DRuntime.astro` | `IssueLayout.astro`, once per issue — bundled module `<script>` that lazy-boots the WebGL runtime (`scripts/viz3d/`) when a `[data-viz3d]` mount scrolls in (§10) |
| `core/Tilt.astro` | `IssueLayout.astro`, once per issue — vanilla island driving the CSS-3D `[data-tilt]` pointer-tilt + `[data-flip-btn]` flip (§10) |
| `core/ExpandModal.astro` | `IssueLayout.astro`, once per issue — in-page lightbox. Adds a ⤢ button to every viz card (`.px-viz` / `.vb` / `.tl` / `.tel`) and **portals the live node** into a modal (placeholder holds the page slot, scroll preserved); fires `resize` so WebGL re-fits. `styles/modal.css`. |
| `intro/IntroStory.astro` | `welcome.astro` (and inside `IntroExperience`) — the 5-scene "The Second Angle" onboarding player. Vanilla `is:inline` player (auto/manual, prev/next/dots/skip/keyboard); no-JS scenes stack + scroll. `px-intro`. |
| `intro/IntroExperience.astro` | `index.astro`, once — home first-visit overlay. Auto-plays the story, then an optional spotlight tour of the real home. Gated by localStorage `px_intro_seen_v1`; `?intro=1` force-replays; `[hidden]` by default (no-JS shows nothing). `px-xp`. |
| `intro/WorldViz.astro` | inside `IntroStory` — per-category mini data-viz on the six worlds cards (vote split / orbit / stripes / commit grid / route / momentum wave) |
| `home/*` | in home + topic-index templates |
| `topic/<topic>/<Topic>Index.astro` | dispatched from `src/pages/topics/[topic].astro` |

---

## 8. Reader-interaction client islands (Phase B)

Six new client islands ship with Phase B. All live in `core/`, all
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
| `px-letter` | LettersBlock (end-of-issue reader letters, Phase B-6) |
| `px-mstrip` | ManifestoStrip (home, three editorial promises — v2 `.mf-strip` port) |
| `px-sub` | SubscribeStrip (home, editorial `.sub` framing wrapping NewsletterForm) |
| `px-col` | Colophon (editorial footer, replaces Footer in both layouts — v2 `.col` port) |
| `px-intro` | "The Second Angle" onboarding (scenes/player/controls, in `intro.css`) |
| `px-xp` | home first-visit overlay + spotlight tour (`IntroExperience`, in `intro.css`) |
| `px-gate` | ReadingGate (metered signup wall, scoped in `ReadingGate.astro`) |
| `px-wj` / `px-abt` | now mainly serve AccountLine + About (the rest of the earlier welcome pass is retired) |

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

**Orphaned/retired (2026-06-21).** An earlier "issue-like" onboarding pass is
superseded by `intro/`: `intro/RegistrationMark.astro`, the
`welcome/Beat*.astro` set, and most of `welcome/` are now unused. `welcome.css`
survives only for `AccountLine` (`px-wj-join`, used on home + welcome) and the
About `px-abt` / `px-wj-reg` bits.

When adding a meta-brand or layout-chrome piece, render it directly. Only
narrative section components flow through `SectionRenderer.astro`.

---

## 9. v2 data-viz + chrome class exception (2026-06-03)

The v2 design-match pass adopted the external kit's own class names in two
places, verbatim. This is a deliberate, closed exception to the `px-` prefix
rule (§4) — the kit's animation/reveal CSS is tightly coupled to these
selectors, so renaming them would mean rewriting the whole animation layer.

**Adopted names**

- **Masthead:** `.mh*` (`core/Masthead.astro`; CSS in `base.css`). One
  unified press-header on every page — lens-dot mark + pulse status pill +
  nav (Desks/About/Feed) + Subscribe CTA. The active world still comes from
  `data-topic` on `<html>`. The six old `.px-masthead--<topic>` variants are
  gone; their per-world microcopy now reads in `core/Banner.astro`.
- **Data-viz:** the generic kit names
  `.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`, plus the
  shared shell hooks `.px-viz__cap` (caption) and `.px-viz__src` (source
  line). All CSS lives in the new `src/styles/dataviz-v2.css`, imported
  **last** in both `IssueLayout.astro` and `HomeLayout.astro`.

**Components fully ported** (rewritten to the kit's markup + animations —
stroke-draw lines, grow bars, scale-pop polygon, count-up tiles, the
44-column MP-dot vote chamber, scan sweep — and wrapped in the shared
elevated `.px-viz` card):

| Component | Kit class |
|---|---|
| VoteResult | `.vb` |
| ApprovalChart | `.ac` |
| PowerMatrix | `.pm` |
| Paradox | `.px2` |
| Timeline | `.tl` |
| OrbitTrace | `.ot` |
| LaunchStats | `.ls` |
| DataReadout | `.tel` |
| ClimateStrip | `.cs` |
| BenchmarkChart | `.bc` |
| AdoptionCurve | `.adc` |
| RouteCard | `.rc` |
| CityCompare | `.cc` |
| LeagueTable | `.lt` |
| PlayerRadar | `.pr` |

Charts wrap in the shared `.px-viz` card tagged `data-reveal`; the vote bar
(`.vb`), timeline (`.tl`), and telemetry (`.tel`) are standalone `data-reveal`
roots.

**Components kept on their `px-` classes** (light-touch port — only gained a
card-level `data-reveal` scroll-in): SeatChart (`.px-seats`), BillBreakdown
(`.px-bills`), BrothersAnalogy (`.px-analogy`), OrbitalShells, CarbonGauge
(`.px-cgauge`), ElevationProfile, RegionMap (free-standing cartographic SVG),
CommitGrid, JourneyMap, MatchStatLine (`.px-msl`).

**The reveal + motion contract (no-JS / print safe)**

- Scroll reveals are driven by `core/Reveal.astro` (an `is:inline` island
  that adds `.is-in` to every `[data-reveal]` via IntersectionObserver).
- **Every reveal-hidden state is gated behind an `html.js` class** set by a
  one-line inline `<head>` guard. No JS ⇒ no `.js` class ⇒ content paints in
  its final revealed state. Print does the same. Matching
  `prefers-reduced-motion` resets live in `dataviz-v2.css` (and
  `motion-v2.css` for chrome).
- Count-up + cursor-warmth ship as `core/VizMotion.astro`: `[data-countup]`
  tweens to the final value **already present in the HTML** (so no-JS shows
  the real number), and `[data-warmth]` tracks the pointer for the warmth
  radial.

**Inert dead-CSS follow-up.** The old per-component viz CSS in the theme
files (`.px-vote*`, `.px-appr*`, `.px-pwm*`, `.px-paradox*`, `.px-timeline*`,
and the old orbit/launch/climate/bench/scurve/route/citycompare/ltab/radar
blocks) plus the `.px-skim-toggle` / `.px-skim-btn` rules in `base.css` are
now **orphaned** — no element emits them. They are harmless (the new viz use
new class names, so there is no override conflict) but should be removed in a
future safe cleanup pass.

---

## 10. 3D / interactive component library (2026-06-03)

The 30 v2 interactive kinds (§2 block) split into three implementation
families. All three honour one shared no-JS / `prefers-reduced-motion`
contract: **every component renders a static SVG/HTML fallback by default,
and interactivity is layered on top only when JS runs and motion is
allowed.** This is the same contract as `core/Reveal.astro` /
`core/VizMotion.astro` and the v2 data-viz (§9).

### Family A — lazy WebGL scenes (Three.js): 4 kinds

`coalition-orbit`, `orbit-globe`, `data-globe`, `route-globe`. These are the
**only** parts of the whole site that touch Three.js.

- **Self-hosted Three.js.** `three` is an npm dependency (`npm i three`), not
  a CDN script. It is **dynamic-imported** (`import('three')`) inside
  `src/scripts/viz3d/runtime.ts`, so Vite **code-splits it into its own
  chunk** (~730 KB raw, ≈170 KB gzipped). That chunk is fetched **only when a
  `[data-viz3d]` mount first scrolls into view** — never on the home page or
  any issue without a 3D section. The per-page hoisted runtime script is
  ~5 KB.
- **Two source files.** `runtime.ts` owns the lifecycle (IntersectionObserver
  to lazy-boot, DPR capped at ≤2, a render loop that **pauses when the mount
  leaves the viewport** and **disposes on `pagehide`**, plus the no-WebGL /
  reduced-motion bail). `scenes.ts` exports the `builders` registry, keyed by
  the kind's `data-viz3d` type; each builder is
  `(THREE, canvas, data, colors) => SceneHandle` and **takes `THREE` as a
  parameter** (it must never `import 'three'` itself, or three would leak into
  the eager bundle). Scene aesthetic is dot-matrix / wireframe / low-poly in
  the world's theme colours (read from CSS custom properties), to match the
  type-led, no-photo v2 look.
- **Mounted once per issue** via `core/Viz3DRuntime.astro` — a **bundled
  module `<script>`** (not `is:inline`, so Vite can process the dynamic
  import). `IssueLayout.astro` renders it once; if a page has no `[data-viz3d]`
  mounts, `initViz3D()` returns immediately and three is never fetched.
- **Mount markup.** Each WebGL component renders a `.viz3d` element with
  `data-viz3d="<kind>"`, a `<script class="viz3d__data" type="application/json">`
  carrying the section's data payload, and a `.viz3d__fallback` holding the
  static SVG. On successful boot the runtime appends a `.viz3d__canvas`, adds
  `.viz3d--live` to the mount (CSS then hides the fallback), and runs the loop.
  No JS / no WebGL / reduced-motion ⇒ no canvas, no loop, the fallback stays.

### Family B — CSS-3D: most of the remaining 26

Perspective + `transform-3d` via the shared mechanics in
`src/styles/components-3d.css`:

- `.px3d-stage` establishes `perspective`; `.px3d-tilt` reads `--rx` / `--ry`
  (default `0`) for a pointer-tilt; `.px3d-flip` / `.px3d-flip.is-flipped`
  rotates a card face (e.g. `player-card`).
- Driven by the vanilla `core/Tilt.astro` island: `[data-tilt="<deg>"]`
  writes clamped `--rx` / `--ry` on `pointermove` (reset on `pointerleave`)
  and is **skipped entirely under `prefers-reduced-motion`**; `[data-flip-btn]`
  toggles `.is-flipped` on the `.px3d-flip` inside its nearest
  `[data-flip-card]` and manages `aria-pressed`. Rendered **once per issue**
  in `IssueLayout.astro` (alongside `Viz3DRuntime`).
- No JS ⇒ nothing runs: cards stay flat and front-facing (the vars default to
  `0`). Reduced-motion resets `.px3d-tilt` / `.px3d-flip` to no transform in
  `components-3d.css`.

### Family C — animated SVG / canvas: the rest

Reveal-on-scroll line draws, bars, dials, and area fills (e.g.
`latency-waterfall`, `climate-spiral`, `shot-map`, `momentum-wave`). These
follow the §9 reveal contract: hidden states are **`html.js`-gated** (no JS ⇒
final painted state) and reduced-motion resets to the final frame.

### CSS ownership

- **Shared** (in `components-3d.css`): the `.px3d-*` 3D mechanics and the
  `.viz3d` / `.viz3d__canvas` / `.viz3d__fallback` / `.viz3d--live` /
  `.viz3d__data` mount machinery.
- **Per-component cosmetic CSS** is a **scoped `<style>` inside each
  component's `.astro`** under a unique `px-*` prefix (§4 table) — it does not
  live in the theme files.

### Worked examples

The six `src/content/issues/2026-06-03-<world>-showcase/index.mdx` draft
issues each exercise that world's five new kinds end-to-end. They are
`status: draft` — URL-viewable at `/issues/2026-06-03-<world>-showcase/` but
unlisted (excluded from the archive + RSS). Data shapes for every kind are in
`src/content/issues/_AGENTS.md`.

---

## Change log

### 2026-06-21 — unified type system + onboarding + signup gate
- **One 3-font system (§1).** Collapsed ~11 fonts to **Fraunces** (serif) +
  **Schibsted Grotesk** (sans, replaced Inter Tight as `--font-body`) +
  **JetBrains Mono**. Worlds now differ by accent colour + treatment, not
  per-world display fonts (Space Grotesk / Cormorant / Oswald etc. retired).
  Normalised in `src/styles/type-v2.css` (imported last); also `meta.css`, the
  six `themes/<topic>.css`, `home/CategoryCard.astro`, and SVG `font-family` in
  `RegionMap`/`CarbonGauge`. This overrides the old §5 "Display labels:
  Cormorant Garamond" note.
- **"The Second Angle" onboarding (§7).** New `intro/` components in a distinct
  cinematic identity (scoped to `px-intro` / `px-xp` in `src/styles/intro.css`,
  loaded via `src/layouts/IntroLayout.astro`): `IntroStory` (5-scene player),
  `IntroExperience` (home first-visit overlay + spotlight tour, gated by
  localStorage `px_intro_seen_v1`, `?intro=1` replays), `WorldViz` (per-category
  mini data-viz). `welcome.astro` rebuilt as a standalone story; `index.astro`
  mounts the overlay. No-JS / reduced-motion safe.
- **Retired/orphaned (§7).** `intro/RegistrationMark.astro` + the earlier
  `welcome/Beat*.astro` issue-like pass are now unused; `welcome.css` survives
  only for AccountLine + About.
- **Metered signup gate (§7).** New `core/ReadingGate.astro` (`px-gate`),
  mounted in `[slug].astro` — soft wall after primer + first 2 sections;
  client-side cookie auth heuristic; no-JS / crawlers render the full article
  (SEO-safe).
- **Prefix reservations (§8):** added `px-intro`, `px-xp`, `px-gate`; noted
  `px-wj` / `px-abt` now mainly serve AccountLine + About.

### 2026-06-03 — expand-to-modal + unified viz typography
- **Expand-to-modal.** New `core/ExpandModal.astro` (+ `src/styles/modal.css`,
  mounted once in `IssueLayout`) adds a ⤢ expand button to every viz card and,
  on click, **moves the live node** into a centred glass modal — the same WebGL
  context + count-up/Tilt/reveal state, just larger — leaving a same-height
  placeholder so the reader's scroll position is untouched. Esc / backdrop / ✕
  close, focus-trapped, `aria-modal`, body scroll locked, mobile full-screen,
  reduced-motion + no-JS safe (no buttons without JS). Targets
  `.px-viz, .vb, .tl, .tel` → zero per-component edits.
- **Unified viz type system.** New `src/styles/viz-type.css` defines one label
  scale (tokens `--viz-fs-*` + `.vz-*` roles: eyebrow / caption / axis / legend /
  value / annot / src) blending the display serif for viz titles+captions with
  crisp mono + tabular figures for axes/values/legends. The shared
  `.px-viz__cap` (now a serif caption + a mono accent unit-chip) / `.px-viz__src`
  and the globe `.viz3d__label` were refined, then every component's scoped
  labels were swept onto the scale (tabular-nums everywhere, serif in-viz titles,
  paper halos on SVG text over busy fills, consistent ink/ink-soft/muted
  hierarchy). The modal bumps the scale a notch (`.px-modal__viz`).

### 2026-06-03 — v2 3D / interactive component library (30 kinds)
- **30 new section kinds, 5 per world** (§2 block), in the v2 design language.
  `SECTION_KINDS` in `config.ts` went 33 → 63; each is dispatched in
  `SectionRenderer.astro`.
- **4 lazy WebGL globes** (`coalition-orbit`, `orbit-globe`, `data-globe`,
  `route-globe`) on self-hosted Three.js, dynamic-imported by
  `src/scripts/viz3d/runtime.ts` (+ `scenes.ts` builders) only when a
  `[data-viz3d]` mount scrolls in — Vite code-splits it into a ~730 KB
  (≈170 KB gz) chunk that never loads on home / non-3D pages. Mounted once
  per issue via the new bundled `core/Viz3DRuntime.astro`. RAF pauses
  off-screen + disposes on `pagehide`; DPR ≤2. See the new §10.
- **26 CSS-3D / animated-SVG** kinds using the shared `.px3d-*` mechanics in
  the new `src/styles/components-3d.css`, driven by the new vanilla
  `core/Tilt.astro` island (`[data-tilt]` / `[data-flip-btn]`, once per issue).
- **No-JS / reduced-motion contract** as §9: every kind renders a static
  SVG/HTML fallback by default; WebGL bails (no canvas, no loop) and the
  fallback stays; reveal-hidden states are `html.js`-gated; reduced-motion
  resets to the final frame.
- Per-component cosmetic CSS is a **scoped `<style>`** in each `.astro` under a
  unique `px-*` prefix (§4 additions: `px-co … px-pcard`); only the shared 3D
  mechanics + `.viz3d` mount live in `components-3d.css`.
- Six `2026-06-03-<world>-showcase` draft issues are the worked examples.

### 2026-06-03 — v2 design-match pass (F1–F3)
- **F1 — masthead unified.** The six `.px-masthead--<topic>` variants
  collapsed into one `.mh` press-header (`core/Masthead.astro`, CSS in
  `base.css`). Per-world register microcopy moved to `core/Banner.astro`.
  `.mh*` is a documented adoption of the kit's names (§9).
- **F2 — data-viz fully ported.** 15 components rewritten to the v2 kit's
  markup, animations, and reveals, emitting the kit's generic class names
  (`.vb .ac .pm .px2 .tl .ot .ls .cs .bc .adc .rc .cc .lt .pr .tel`) inside
  the shared `.px-viz` card. New shared CSS file `src/styles/dataviz-v2.css`.
  Count-up + cursor-warmth via the new `core/VizMotion.astro` island; reveals
  via `core/Reveal.astro`, all `html.js`-gated. Eleven components kept their
  `px-` classes (light-touch — `data-reveal` only). See §2 note + §9.
- **F3 — openers / hero / toolbar.** Section openers gained the ghost-numeral
  depth echo + scroll-in (`Section.astro` now `data-reveal`); hero clamp
  bumped. New glass `core/ReadingToolbar.astro` (progress + Full/Skim + live %
  + read time + Save) **replaced the deleted `core/SkimToggle.astro`**; Save
  now lives inside the toolbar.
- Retired the `px-skim`, `px-appr`, `px-pwm`, `px-cstrip`, `px-ortrace`,
  `px-launch`, `px-bench`, `px-scurve`, `px-route`, `px-ccomp`, `px-ltab`,
  `px-radar` prefixes; the old per-component viz CSS + `.px-skim-*` rules are
  now inert dead code (cleanup deferred — §9).

### 2026-05-20 — File created
Initial version. Section-kind → component table grounded in `config.ts`
and the filesystem. CSS prefix reservation table. SVG conventions and
skim-mode wrapper pattern from `docs/PROJECT.md` §6.
