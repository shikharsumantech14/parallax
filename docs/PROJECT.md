# Parallax — Project State

> **Purpose of this document.** A self-contained handoff for anyone (human or LLM)
> dropped into this repo cold. It captures the vision, architecture, current
> state, and conventions — enough to continue work without re-discovering
> context. **Keep this doc current: every time we ship a meaningful change,
> update the relevant section and append a Change Log entry.**

---

## 1. Elevator pitch

**Parallax** (legal: **Parallax Lens**) is a visual explainer publication —
a static site that publishes long-form, structured, fully-cited pieces one
topic at a time. Six topics rotate: **politics, space, earth, tech, travel,
sports**. Each topic is its own aesthetic world (layout, palette,
typography, masthead composition); the Parallax meta-brand sits above
them all and ties them together.

The publication's public-facing brand is **Parallax**; the registered
trademark and legal entity is **Parallax Lens** (filed in India, classes
16 + 41). The longer name appears in browser titles, RSS metadata, footer
copyright, and the About-page colophon — everywhere SEO and trademark
records expect to see it. The shorter "Parallax" is used in body copy,
mastheads, and the spoken brand voice. Publication domain:
[parallaxlens.com](https://parallaxlens.com).

The brand promise is *"Stories you think you already understand."* The site
rebuilds familiar topics from the structure up — timelines, bill breakdowns,
vote charts, paradoxes, analogies — with every factual claim sourced.

**Out of scope:** real-time news, hot takes, unstructured blog posts,
comments, engagement metrics, trackers.

---

## 2. Tech stack

| Layer        | Choice                          |
| ------------ | ------------------------------- |
| Framework    | **Astro 4.16.x** (static output)|
| Content      | **Astro Content Collections** + MDX (@astrojs/mdx 3.1.x) |
| Types        | **TypeScript 5.6** strict       |
| Styles       | Plain CSS, CSS custom properties swapped via `data-topic` |
| Fonts        | Google Fonts — **one strict 3-font system**: Fraunces (serif voice — headlines, leads, nameplates, the italic accent word), Schibsted Grotesk (the single sans — body, UI, structural headings), JetBrains Mono (labels, eyebrows, numerals). The old per-world display fonts (Space Grotesk, Cormorant Garamond, Oswald, Inter Tight, IBM Plex) are retired; worlds now differ by **accent colour + treatment**, not font. |
| Feed         | **@astrojs/rss 4.0.x**          |
| 3D / WebGL   | **three** (self-hosted, lazy-loaded, one code-split chunk per scene; **14** WebGL kinds registered in `src/scripts/viz3d/scenes/index.ts`) |
| Data viz     | build-time SVG + CSS-3D; `d3-geo` / `topojson-client` / `world-atlas` (maps + the 3D globe) |
| Node         | `>=20.0.0` (see `.nvmrc`)       |
| Hosting      | **Vercel** (static, auto-deploy on push to `main`) |
| Repo         | github.com/shikharsumantech14/parallax |

No client framework, no analytics, no cookies, no trackers, no raster imagery.

**JS budget: rich on issues, lean everywhere else** (operator-approved
2026-07-05 — this *supersedes* the older "near-zero JS everywhere" posture; see
`AGENTS.md` §7 for the governing rule). Issue pages and story mode carry a
generous interactive budget — WebGL scenes, scroll-driven states, hover
inspection — under three absolutes: every interactive byte serves
**comprehension, not decoration**; everything is **lazy-loaded and code-split**
(nothing heavy loads until its mount scrolls in, and never on pages that don't
use it); and the **fallback contract is untouchable**. Home, topic indexes and
about stay near-zero-JS: small vanilla `is:inline` islands only — scroll-reveal,
count-up + cursor-warmth, reading toolbar, expand-to-modal, the `px-inst` instrument controls on issue pages (the scaling-plot LOG/LINEAR toggle, the xg-race minute scrub and the climate-spiral month scrub — every projection precomputed at build, the control `html.js`-gated and hidden until the payload parses), the Phase-B reader
islands, the reading gate, and the three funnel islands (`AccountEntry`,
`WelcomeBack`, `NewsletterNotice`). The onboarding surface ("The Second Angle")
keeps its own documented exception. Everything degrades to its final painted
state under no-JS (`html.js`-gated), `prefers-reduced-motion`, and missing WebGL.

**Commands**

```bash
npm run dev        # astro dev, port 4321
npm run build      # astro build → dist/
npm run preview    # serve built output
npm run new-issue  # scaffold a new issue folder (scripts/new-issue.mjs)
```

---

## 3. Architecture

### 3.1 Two-layer design system

- **Layer A — Constants (base.css + meta.css).** Topic-agnostic layout,
  rhythm, spacing, and the Parallax meta-brand aesthetic used on home and
  `/topics/*` index pages.
- **Layer B — Topic themes (themes/*.css).** Each of the 6 topics defines a
  full token set (`--bg`, `--ink`, `--accent`, `--font-display`, `--viz-edge` — the 3px figure top-rule colour: ink on the light desks politics / earth / travel, accent on the dark space / tech / sports — …) scoped
  under `:root[data-topic="<topic>"]`. Flipping `<html data-topic>` swaps the
  entire look.

### 3.2 Topic worlds

Each topic has its own visual identity. Since the unified type system landed
(2026-06-21) every world shares the same 3-font trio (Fraunces / Schibsted
Grotesk / JetBrains Mono); worlds are now differentiated by **accent colour +
treatment** (case / weight / italic / ornament / motif), not by a per-world
display font. Current themes:

| Topic    | Vibe                                | BG         | Accent      | Differentiator (font is shared) |
| -------- | ----------------------------------- | ---------- | ----------- | ------------------------------- |
| politics | The Hindu / Caravan broadsheet      | warm paper | oxide red   | Fraunces serif + red drop-cap   |
| space    | NASA / JPL mission control          | deep navy  | bright cyan | cyan + telemetry / cursor mono  |
| earth    | USGS / National Geographic atlas    | map paper  | forest green| italic serif + coord ornament   |
| tech     | Stripe docs / Linear changelog      | near-black | lime        | lowercase mono + lime slash     |
| travel   | Condé Nast / field journal          | cream      | terracotta  | italic + terracotta underline   |
| sports   | The Athletic / match programme      | pitch green| neon lime   | uppercase bracketed treatment   |

### 3.3 Masthead variants

`src/components/core/Masthead.astro` takes a `variant` prop and renders seven
different compositions — *text-only*, no images:

| Variant   | Composition example                               |
| --------- | -------------------------------------------------- |
| `meta`    | `PARALLAX — 01   EST. 2026`                       |
| `politics`| `●PARALLAX  Issue 01   APR 24, 2026`              |
| `space`   | `PARALLAX//SPACE  T+ 18:40:07_   ORBIT 01A`       |
| `earth`   | `PARALLAX · EARTH  14.6°N · 121.0°E   ELEV 23M · SHEET 01` |
| `tech`    | `parallax/tech  v0.1.0   main@a3f1c9`             |
| `travel`  | `Parallax · Travel   Vol. I, No. 01 · 24.IV.2026` |
| `sports`  | `PARALLAX FC  MATCHDAY 01   KO 18:40`             |

The `meta` variant is used on `/` and `/about`. Other variants are used on
`/topics/<topic>` and `/issues/*` pages driven by the issue's topic.

### 3.4 Home page anatomy

```
meta masthead
typographic chord (headline + dek — "Six worlds. One publication.")
category grid (2-col × 3-row of CategoryCard, each themed in its topic)
archive list (every published issue, topic-color dot tag)
footer
```

Each `CategoryCard` is a mini magazine cover with a **per-topic
composition** — header chrome line, topic-word typographic treatment,
manifesto, latest-issue/empty block, and a CTA worded in that topic's
voice. The treatments differ enough that politics-on-paper and
travel-on-paper no longer collapse into the same gestalt:

| Topic    | Header chrome line                | Topic-word treatment           | CTA                         |
| -------- | --------------------------------- | ------------------------------ | --------------------------- |
| politics | `● PARALLAX · POLITICS DESK`      | serif "Politics" with red drop-cap "P" | Read the dispatch →   |
| space    | `T+ HH:MM:SS_` blinking telemetry | sans "Space" with cursor       | Decrypt transmission →      |
| earth    | `SHEET 01 · 14.6°N · 121.0°E`     | italic serif "Earth" + sage coords below | Turn the sheet →   |
| tech     | `$ parallax/tech v0.1.0` prompt   | mono lowercase "tech/" with lime slash | → git pull          |
| travel   | dashed PRX stamp box top-left     | italic "Travel" with terracotta underline | Open the postcard → |
| sports   | `MATCHDAY 01 · KO 15:00`          | uppercase bracketed `[ SPORTS ]` treatment | Read the match report → |

Cards scope `data-topic` locally so politics reds and space cyans don't
leak to neighbours. Each card also carries a **topic-signature backdrop
motif** rendered in pure CSS:

| Topic    | Motif                                                  |
| -------- | ------------------------------------------------------ |
| politics | broadsheet column rule down the centre                 |
| space    | three concentric orbital rings, bottom-right corner    |
| earth    | topographic contour lines, lower-left                  |
| tech     | monospace lattice grid                                 |
| travel   | postage-stamp perforation along the right edge         |
| sports   | pitch halfway line + centre circle, bottom            |

Layout: 2-col on desktop (≥1100px), 2-col on tablet, 1-col on mobile
(≤720px). 2-col was chosen over 3-col after visual A/B — 3-col cramped the
type and shrank the motifs; 2-col gives each cover real presence.

### 3.5 Topic index pages — six different page templates

`/topics/<topic>` is a dynamic route that **dispatches to one of six fully
distinct page templates**, each native to its category. The route itself
does only `getStaticPaths` + collection filtering; the rendering happens
in the topic's own `*Index.astro` component.

| Topic    | Template metaphor              | Component                                       |
| -------- | ------------------------------ | ----------------------------------------------- |
| politics | broadsheet front (nameplate, dropcap editorial, columnar leads) | `topic/politics/PoliticsIndex.astro` |
| space    | mission-control console (telemetry banner, TX log)              | `topic/space/SpaceIndex.astro`       |
| earth    | atlas index sheet (nameplate, coord legend, numbered sheets)    | `topic/earth/EarthIndex.astro`       |
| tech     | git changelog (terminal prompt, commit-log entries with hashes/tags) | `topic/tech/TechIndex.astro`    |
| travel   | postcard rack (letterhead, dated stamps, perforated cards)      | `topic/travel/TravelIndex.astro`     |
| sports   | matchday programme (PFC crest, fixture list, scoreboard empty state) | `topic/sports/SportsIndex.astro` |

Every template handles **both states** — populated (real issues rendered
in its native list/feed shape) and empty (themed design surface, *not* a
fallback): broadsheet "FILING" stamp, mission-control signal-strength
bars, atlas concentric contour rings, git-log fatal-error block,
rotated postcard stamp, pre-season scoreboard.

Each template also has its own **back-to-home affordance** worded in the
voice of the desk (`← All worlds` / `← Mission directory` / `← Atlas
index` / `← cd ..` / `← Back to bureau index` / `← Fixture index`).

### 3.6 Issue pages

`/issues/<slug>` uses `IssueLayout.astro`, applies `data-topic=<topic>` on
`<html>`, renders:

1. Topic-variant masthead
2. Compact `TopicStrip` (cross-topic nav)
3. `Hero` (eyebrow, title with `*italic*` accent, dek, byline)
4. Sections iterated via `SectionRenderer.astro` (article chrome) → `core/Section.astro` (the explainability stack for every kind: how-to-read panel ABOVE the graphic from `howToRead ?? EXPLAIN[kind].how`; plain line + `Source · …` second line BELOW, from `section.source ?? data.source`) → `SectionBody.astro` (the kind → component dispatch). Components render none of source / plain / how themselves; the ten VizCard kinds render the how-to-read inside the card and Section's copy is hidden there by `:has()`.
5. `Sources` list

### 3.7 Editorial pipeline (agent-assisted)

Parallax issues are produced via a multi-step agent pipeline that lives
in `.claude/agents/` and `.claude/commands/`. The pipeline is invoked
manually one step at a time via slash commands; the human (you) holds
two control gates: the **candidate pick** between discovery and research,
and the **final audit** before publish.

```
1. /pipeline-discover <category>   ✅ discovery subagent → candidates file
   ↓
2. YOU PICK 1 CANDIDATE            ← edit candidates file, status: chosen
   ↓
3. /pipeline-research <category>   ✅ researcher subagent → dossier file
   ↓
4. YOU REVIEW DOSSIER              ← check [UNVERIFIED] items, approve
   ↓
5. /pipeline-draft <category>      ✅ drafter subagent → MDX with status: draft
   ↓
6. YOU REVIEW DRAFT                ← read, fix voice/flow, resolve EDITOR comments
   ↓
7. /pipeline-stylist <category>    ✅ stylist subagent → rhetorical mode rewrites
   ↓
8. /pipeline-verify <category>     ✅ verifier subagent → claim-by-claim audit
   ↓
9. YOU AUDIT + PUBLISH             ← read report, fix, status: published
```

**Stylist agent** (`stylist.md`) sits between draft and verify. It reads
`research/_voice/mode-library.md` (890 lines, 8 rhetorical modes extracted
from Sagan, Attenborough, Ravish Kumar, Oliver, Bourdain, Iyer, Akhtar,
Morris, Wright Thompson, and others), assigns one mode per section using a
formal Decision Tree, then rewrites `intro:` fields, prose section paragraphs,
and quote followups in the assigned mode pattern. Structured data (timeline
events, readout tiles, climate-strip values, verbatim quotes) is never touched.
A single stylist run produces a Before/After across every prose field and
costs roughly $1.50–2.50 on Opus. The mode library lives at
`research/_voice/mode-library.md`.

**Working files** live under `research/`:
- `research/_sources/<category>.md` — per-category trusted-source allowlist
  (the universe of sources the discovery agent is allowed to mine from)
- `research/_templates/candidate.md` — candidates file output shape (Phase 1)
- `research/_templates/dossier.md` — dossier output shape (Phase 2)
- `research/<category>/<date>-candidates.md` — discovery output (Phase 1)
- `research/<category>/<date>-<slug>-dossier.md` — research output (Phase 2)
- `research/<category>/<date>-<slug>-verification.md` — verifier output (Phase 4)

**Git workflow rules (as of 2026-05-02):**
- Claude commits only — never pushes. You push manually with `git push`.
- Commit messages have no `Co-Authored-By` trailer.
- All commits must be authored with the `shikharsumantech14` GitHub account
  (git config email must match). Vercel Hobby plan blocks deploys from
  unrecognised commit authors.

**Upstream of the agent pipeline** sits a per-category NotebookLM
research desk (one notebook per topic, sources seeded from the same
allowlists). NotebookLM is the editorial-judgment layer where the
editor surfaces candidate issues by hand; `/pipeline-discover` is the
agent-driven equivalent. Both write to the same candidates file. Setup
and weekly workflow are documented in
[`research/notebooklm-setup.md`](../research/notebooklm-setup.md).

**Status flag pipeline:** every `src/content/issues/<slug>/index.mdx` flows
through `status: draft` (drafter writes here) → `status: review` (you've
read it but not committed to publish) → `status: published` (live on
site, RSS-syndicated). Nothing publishes without manual flip.

**Cost-aware model routing** is documented in `research/README.md` —
discovery and verifier-first-pass can use cheap models; drafting always
uses Sonnet (high-craft step).

**API-direct pipeline CLI (`scripts/`)** is the preferred way to run all
four phases. It calls the same agents via the Claude Agent SDK, billing to
`ANTHROPIC_API_KEY` (your own key) instead of the Claude Pro token budget.
Each full pipeline run costs roughly $4–12 on Sonnet; the draft phase costs
$3–8 more on Opus. Running agents through Claude Pro would consume 2–4 hours
of the 5-hour usage-limit window instead. Full operator guide:
[`scripts/README.md`](../scripts/README.md). Model assignments:
`scripts/pipeline.config.ts`.

**Phase status (as of 2026-05-04):**
- ✅ Phase 1: discovery agent (`discovery.md`) + `/pipeline-discover` command + per-category source allowlists
- ✅ Phase 2: researcher agent (`researcher.md`) + `/pipeline-research` command + dossier template
- ✅ Phase 3: drafter agent (`drafter.md`) + `/pipeline-draft` command
- ✅ Phase 3.5: stylist agent (`stylist.md`) + `npm run pipeline:stylist` — rhetorical mode rewrites (8 modes, mode library at `research/_voice/mode-library.md`)
- ✅ Phase 4: verifier agent (`verifier.md`) + `/pipeline-verify` command ★ brand-protection step ★
- ⏳ Phase 5: visual-checker + scheduled cron via GitHub Actions
- ⏳ Phase 6: remaining categories — earth is live; pipeline runs queued for politics, space, tech, travel, sports.

**Component expansion plan (completed batch 1 on 2026-05-03):**

Politics (2 components):
- ✅ `approval-chart` — dual-area presidential/PM approval time series with configurable series
- ✅ `power-matrix` — institution × party control grid (●=full / ◐=partial / —=none / ◆=contested)

Space (2 components):
- ✅ `orbit-trace` — tilted orbital ellipses around Earth; sqrt altitude scale; fixed right-column
  labels with dashed connector lines; inclination renders as ellipse compression
- ✅ `launch-stats` — stacked launch-count bar chart by year, coloured by agency/series

Earth (3 components):
- ✅ `region-map` — build-time choropleth world map (d3-geo + Natural Earth 50m, two-pass shadow
  render, SVG cartographic legend, ocean ruling texture)
- ✅ `carbon-gauge` — semicircular remaining-carbon-budget arc gauge; needle + colour-coded
  remaining arc (green→amber→red)
- ✅ `climate-strip` — Ed Hawkins warming stripes (**CSS class prefix: `px-cstrip`**, not
  `px-strip` — the latter is owned by the TopicStrip nav in `meta.css`)

Tech (2 components):
- ✅ `benchmark-chart` — horizontal bar benchmark comparison with highlight row + optional
  reference line
- ✅ `adoption-curve` — technology S-curve (Rogers' diffusion model) with milestone markers;
  bounds-aware label anchoring

Travel (2 components):
- ✅ `route-card` — multi-leg journey itinerary with transport-mode emoji icons, connector
  dot-and-line, total km + duration summary
- ✅ `city-compare` — side-by-side city comparison table with winner-dot highlights and
  optional per-row notes

Sports (2 components):
- ✅ `league-table` — standings table with form pills (W/D/L), position-change arrows,
  promotion/relegation/qualified zone highlighting
- ✅ `player-radar` — hexagonal radar/spider web for player attributes; overflow:visible
  to allow axis labels to bleed outside SVG viewBox

Deferred:
- ⏳ `dependency-graph` — Tech node/edge SVG
- ⏳ `constituency-map` — Politics India state-level choropleth
- ⏳ Carousel dual-mode architecture (web + Instagram 1080×1350 PNG export)

**Full pipeline validated end-to-end (2026-05-02):** C-03 (*The Protection That Erases* — Transgender Amendment 2026 ratchet) ran through all 4 phases: discover → research → draft → verify. Verdict NEEDS REVISION (3 minor fixes), fixed and published. Third Parallax issue live at `/issues/2026-05-02-transgender-ratchet/`.

---

## 4. Content model

### 4.1 Schema (`src/content/config.ts`)

```ts
issues: {
  id, topic, title, hook, dek,
  publishedAt, status: 'draft'|'review'|'published',
  author?,              // optional — no default, no hardcoded name
  tags[], readTimeMinutes?, ogImage?,
  sections: Section[],  // typed union — see 4.2
  sources: Source[]
}
```

Only `status: 'published'` (actually `!== 'draft'`) shows up on public pages.

### 4.2 Section kinds

Dispatched by `SectionRenderer.astro` based on `section.kind`:

| Kind             | Component                                      |
| ---------------- | ---------------------------------------------- |
| `hero`           | inline in issue page (not via renderer)        |
| `timeline`       | `topic/politics/Timeline.astro`                |
| `bill-breakdown` | `topic/politics/BillBreakdown.astro`           |
| `vote-result`    | `topic/politics/VoteResult.astro`              |
| `seat-chart`     | `topic/politics/SeatChart.astro`               |
| `paradox`        | `topic/politics/Paradox.astro`                 |
| `analogy`        | `topic/politics/BrothersAnalogy.astro`         |
| `quote`           | `core/Quote.astro`                            |
| `beat-sheet`      | `core/BeatSheet.astro`                        |
| `prose`           | `core/Prose.astro` (paragraphs + optional bold lead) |
| `comparison`      | `core/Comparison.astro` (2–3 column side-by-side) |
| `data-readout`    | `core/DataReadout.astro` (telemetry tile grid) |
| `orbital-shells`  | `topic/space/OrbitalShells.astro` (altitude bands + density dots) |
| `commit-grid`     | `topic/tech/CommitGrid.astro` (GitHub heatmap, 5 intensity steps) |
| `journey-map`     | `topic/travel/JourneyMap.astro` (vertical itinerary stops) |
| `match-stat-line` | `topic/sports/MatchStatLine.astro` (scoreline + horizontal stat bars) |
| `elevation-profile` | `topic/earth/ElevationProfile.astro` (stacked depth/altitude bands) |
| `region-map`        | `topic/earth/RegionMap.astro` (build-time choropleth world map, d3-geo + Natural Earth 50m) |
| `carbon-gauge`      | `topic/earth/CarbonGauge.astro` (semicircular remaining-budget arc gauge) |
| `climate-strip`     | `topic/earth/ClimateStrip.astro` (Ed Hawkins warming stripes — CSS prefix `px-cstrip`) |
| `approval-chart`    | `topic/politics/ApprovalChart.astro` (dual-area approval time series) |
| `power-matrix`      | `topic/politics/PowerMatrix.astro` (institution × party control grid) |
| `orbit-trace`       | `topic/space/OrbitTrace.astro` (named orbital ellipses around Earth, sqrt scale) |
| `launch-stats`      | `topic/space/LaunchStats.astro` (stacked launch-count bars by year + agency) |
| `benchmark-chart`   | `topic/tech/BenchmarkChart.astro` (horizontal bar benchmarks with highlight + reference line) |
| `adoption-curve`    | `topic/tech/AdoptionCurve.astro` (S-curve diffusion chart with milestone markers) |
| `route-card`        | `topic/travel/RouteCard.astro` (multi-leg itinerary with transport icons) |
| `city-compare`      | `topic/travel/CityCompare.astro` (side-by-side city comparison table) |
| `league-table`      | `topic/sports/LeagueTable.astro` (standings with form pills + zone highlights) |
| `player-radar`      | `topic/sports/PlayerRadar.astro` (hexagonal attribute radar/spider chart) |

### 4.3 Authoring a new issue

1. Duplicate `src/content/issues/_template/index.mdx` under a new dated slug
   folder (`YYYY-MM-DD-slug/`).
2. Fill in `id`, `topic`, `title`, `hook`, `dek`, `publishedAt`, `tags`.
3. Add sections in frontmatter YAML (see delimitation issue for examples).
4. Add sources at the bottom; reference their `id`s from `section.sourceRefs`.
5. Flip `status: review → published` when ready.

---

## 5. File map

```
src/
├── layouts/
│   ├── HomeLayout.astro     # used by / and /topics/* and /about
│   ├── IssueLayout.astro    # used by /issues/*
│   └── IntroLayout.astro    # minimal full-bleed shell for the intro (no masthead/.px-wrap; trio fonts + intro.css)
├── pages/
│   ├── index.astro          # home: chord + strip + featured + archive; mounts <IntroExperience/> (first-visit overlay)
│   ├── about.astro          # redesigned still-frame; six-world type specimen is now one font + colour
│   ├── rss.xml.ts
│   ├── issues/[slug].astro  # mounts <ReadingGate/> metered soft signup wall
│   ├── welcome.astro        # rebuilt: standalone full-screen auto-playing "Second Angle" story (IntroLayout + IntroStory)
│   └── topics/[topic].astro # dynamic: 5 routes, getStaticPaths from TOPICS
├── components/
│   ├── intro/               # "The Second Angle" first-visit onboarding (distinct identity, px-intro/px-xp)
│   │   ├── IntroStory.astro       # 5-scene player (feed→shift→rebuild→worlds→join)
│   │   ├── IntroExperience.astro  # home first-visit overlay + spotlight tour (px_intro_seen_v1; ?intro=1 replays)
│   │   ├── WorldViz.astro         # per-category mini data-viz on the worlds cards
│   │   └── RegistrationMark.astro # (legacy from the earlier issue-like pass — now orphaned)
│   ├── core/                # topic-agnostic
│   │   ├── Masthead.astro   # 6 variants
│   │   ├── ReadingGate.astro # metered soft signup wall (primer + 2 sections, then themed account wall)
│   │   ├── Hero.astro
│   │   ├── Section.astro    # owns the explainability stack for EVERY kind: how-to-read ABOVE the graphic (authored howToRead, else EXPLAIN[kind].how), plain line + `Source · …` (.px-plain__src) BELOW. Components render none of source/plain/how themselves (VizCard's ten kinds render the how-to-read in-card; Section's copy is hidden there by :has())
│   │   ├── Quote.astro
│   │   ├── BeatSheet.astro
│   │   ├── Prose.astro
│   │   ├── Comparison.astro
│   │   ├── DataReadout.astro
│   │   ├── Sources.astro
│   │   └── Footer.astro
│   ├── home/                # meta-brand pieces
│   │   ├── TypographicChord.astro
│   │   ├── TopicStrip.astro
│   │   ├── CategoryCard.astro    # themed mini magazine cover, scoped data-topic
│   │   ├── CategoryGrid.astro    # 2-col grid of 6 category cards
│   │   ├── FeaturedIssue.astro   # legacy — retained for possible future use
│   │   └── ArchiveList.astro
│   ├── topic/
│   │   ├── TopicManifesto.astro     # legacy — kept but no longer used by [topic].astro
│   │   ├── politics/
│   │   │   ├── PoliticsIndex.astro  # broadsheet-front topic index page
│   │   │   ├── Timeline.astro
│   │   │   ├── BillBreakdown.astro
│   │   │   ├── VoteResult.astro
│   │   │   ├── SeatChart.astro
│   │   │   ├── Paradox.astro
│   │   │   ├── BrothersAnalogy.astro
│   │   │   ├── ApprovalChart.astro  # dual-area approval time series
│   │   │   └── PowerMatrix.astro    # institution × party control grid
│   │   ├── space/
│   │   │   ├── SpaceIndex.astro     # mission-control topic index page
│   │   │   ├── OrbitalShells.astro
│   │   │   ├── OrbitTrace.astro     # named tilted orbital ellipses
│   │   │   └── LaunchStats.astro    # stacked launch-count bar chart
│   │   ├── earth/
│   │   │   ├── EarthIndex.astro     # atlas-sheet topic index page
│   │   │   ├── ElevationProfile.astro
│   │   │   ├── RegionMap.astro      # build-time d3-geo choropleth
│   │   │   ├── ClimateStrip.astro   # Ed Hawkins warming stripes (px-cstrip)
│   │   │   └── CarbonGauge.astro    # semicircular remaining-budget arc
│   │   ├── tech/
│   │   │   ├── TechIndex.astro      # git-changelog topic index page
│   │   │   ├── CommitGrid.astro
│   │   │   ├── BenchmarkChart.astro # horizontal benchmark bars + highlight
│   │   │   └── AdoptionCurve.astro  # S-curve diffusion with milestones
│   │   ├── travel/
│   │   │   ├── TravelIndex.astro    # postcard-rack topic index page
│   │   │   ├── JourneyMap.astro
│   │   │   ├── RouteCard.astro      # multi-leg itinerary with mode icons
│   │   │   └── CityCompare.astro    # side-by-side city comparison table
│   │   └── sports/
│   │       ├── SportsIndex.astro    # matchday-programme topic index page
│   │       ├── MatchStatLine.astro
│   │       ├── LeagueTable.astro    # standings with form pills + zones
│   │       └── PlayerRadar.astro    # hexagonal attribute radar chart
│   └── SectionRenderer.astro
├── content/
│   ├── config.ts            # Zod schema + TOPICS/SECTION_KINDS exports
│   └── issues/
│       ├── _template/index.mdx
│       ├── 2026-04-24-delimitation/index.mdx        # published
│       ├── 2026-04-24-kessler-cascade/index.mdx     # published
│       ├── 2026-05-02-transgender-ratchet/index.mdx # published
│       ├── 2026-05-03-el-nino-new-floor/index.mdx   # published — earth issue 01 (stylist pass applied)
│       ├── 2026-05-03-earth-map-test/index.mdx      # draft — component test fixture
│       ├── 2026-05-03-politics-components/index.mdx # draft — component test fixture
│       ├── 2026-05-03-space-components/index.mdx    # draft — component test fixture
│       ├── 2026-05-03-tech-components/index.mdx     # draft — component test fixture
│       ├── 2026-05-03-travel-components/index.mdx   # draft — component test fixture
│       └── 2026-05-03-sports-components/index.mdx   # draft — component test fixture
├── styles/
│   ├── base.css             # Layer A — topic-agnostic rhythm + the flat .px-viz shell (3px --viz-edge rule) + the RD-05 radius flip (--r-card/--r-tile: 0 on :root — here, not in shared/design/tokens.css, because app/ consumes those)
│   ├── meta.css             # Meta brand tokens + home/topic-index styles
│   ├── intro.css            # "The Second Angle" intro design system (px-intro scenes/player + px-xp home overlay/tour; own palette tokens)
│   ├── welcome.css          # largely superseded — survives only for AccountLine (px-wj) + About px-abt bits
│   └── themes/
│       ├── politics.css     # Layer B — full theme
│       ├── space.css        # Layer B — full theme (dark mission-control)
│       ├── earth.css        # Layer B — full theme (atlas paper, contour motifs)
│       ├── tech.css         # Layer B — full theme (near-black, lime, mono lattice)
│       ├── travel.css       # Layer B — full theme (cream, terracotta, postage perfs)
│       └── sports.css       # Layer B — full theme (pitch green, lime, condensed display)
└── lib/
    └── text.ts              # renderEmphasis, renderInline, formatIssueNumber, formatSectionLabel
docs/
└── PROJECT.md               # this file
```

---

## 6. Conventions (non-obvious rules)

These are deliberate decisions from past rounds of review. Don't change
them without discussion.

- **Numbering format.** Issue and section numbers use an em-dash + two-digit
  pattern: `— 01`, `— 02`, … Do **not** reintroduce the old `No. 01` format.
  Single source of truth: `formatIssueNumber` / `formatSectionLabel` in
  `src/lib/text.ts`, plus the fallback in `SectionRenderer.astro`. Exception:
  the `travel` masthead variant intentionally keeps "Vol. I, No. 01" for
  field-journal character.
- **Typographic chord discipline.** The home hero uses **two font families
  max** — Fraunces for the headline, JetBrains Mono for the small mark, and
  Fraunces again (italic, lighter weight) for the dek. Never revert to the
  old four-font ransom-note composition (Oswald + Cormorant + Space Grotesk
  + Fraunces all on one line). One italic accent word only.
- **Unified 3-font type system (2026-06-21).** The whole product uses exactly
  three faces — **Fraunces** (serif voice), **Schibsted Grotesk** (the single
  sans, `--font-body`), **JetBrains Mono** (labels/numerals). The six worlds
  **no longer carry per-world display fonts**; they differ by **accent colour +
  treatment** (case / weight / italic / ornament / motif). `type-v2.css` is
  imported last and normalises `--font-display`/`--issue-face`/`--face-*` to
  Fraunces across `:root` and all six `:root[data-topic]`, so it wins. Do not
  reintroduce Space Grotesk / Cormorant Garamond / Oswald / Inter Tight / IBM
  Plex as world differentiators, and keep SVG `font-family` strings on the trio.
- **Onboarding is a distinct-identity surface.** "The Second Angle" intro
  (`/welcome`, the home first-visit overlay, the spotlight tour) is a
  marketing/onboarding world, not an article. It is allowed to carry **more JS
  than the near-zero-JS publication** for its cinematic player, *provided* it
  keeps a graceful no-JS fallback (scenes stack & scroll; hidden states gated
  behind `html.js` + `.is-player`) and honours `prefers-reduced-motion` (no
  auto-advance). It is fully scoped under `.px-intro` / `.px-xp` in `intro.css`
  with its own palette tokens and never touches article styles.
- **Metered soft signup gate.** `core/ReadingGate.astro` (mounted in
  `issues/[slug].astro`) shows anonymous readers the primer + first 2 sections,
  then a per-topic-themed "create a free account to finish" wall; the rest is
  hidden. **Soft by design** — teaser content is in the page source (the site is
  static), chosen over a hard server gate to keep teasers shareable +
  Google-indexable. Auth is detected client-side via the shared non-HttpOnly
  `sb-<ref>-auth-token` cookie. No-JS / crawlers ⇒ the gate stays hidden ⇒ the
  full article renders (SEO-safe). Prefix: `px-gate`.
- **Byline.** `author` is schema-optional with no default. If absent, the
  Hero component omits the "By" line entirely. No hardcoded names anywhere
  in `src/`.
- **Emphasis in content.** `*text*` → `<em>` via `renderEmphasis`. Used for
  the italic accent word in titles (e.g. `The Trojan Horse in *Parliament*`).
  `**text**` → `<strong>` is available via `renderInline`.
- **No JS islands.** Astro's zero-JS-by-default posture is intentional. Any
  interactivity must be justified.
- **No sitemap integration.** `@astrojs/sitemap` was tried and removed —
  it errored on build with our collection shape. If added back, verify
  first.
- **Topic accent on meta pages.** The chord's italic accent color and the
  featured-card border both pick up the *featured issue's topic color*, so
  the tagline visually leads into the cover. Changing the featured issue
  changes those accents automatically.
- **Brand-as-home-link.** The Parallax brand element in every Masthead
  variant is wrapped in `<a href="/" class="px-masthead__home">`. Style:
  `color: inherit; text-decoration: none; opacity: 0.78 on hover`. This is
  the universal "back to home" affordance — no separate Home nav item.
  Each topic-index page also adds a topic-voice back link below the
  masthead (`← All worlds`, `← cd ..`, `← Atlas index`, etc.).
- **SVG component conventions (established 2026-05-03).** Any component
  that emits an inline SVG must follow these rules, learned from the
  region-map build:
  - **Transparent background** — `background: transparent` on the SVG
    element. No wrapper `<div>` with `border` or `background: var(--paper)`.
    The SVG sits directly on the page; the page background shows through.
  - **d3-geo path resolution** — load topology files with
    `readFileSync(join(process.cwd(), 'node_modules/...'), 'utf-8')`.
    Never use `import.meta.url` + relative `../` — the compiled chunk
    depth changes between dev and build, breaking the path.
  - **50m over 110m** — Natural Earth 50m (`countries-50m.json`,
    241 geometries) for sharper coastlines. 110m only for thumbnails.
  - **Two-pass country rendering** — shadow group (no stroke,
    `filter: drop-shadow(...)`) then fill group (with borders). Creates
    raised-land depth without SVG filter complexity.
  - **SVG text fonts** — use `style="font-family:'Fraunces',Georgia,serif"` 
    (not `font-family="..."` presentation attribute — CSS vars don't work there).
    Display/label text: Fraunces (changed from Cormorant Garamond on 2026-06-21
    with the unified type system). Coord/axis text: JetBrains Mono.
  - **Text halo** — `paint-order="stroke"` + `stroke` on SVG `<text>` for
    readable labels over any fill. Never use `<textStroke>` or a separate
    shadow element.
  - **Legends inside SVG** — cartographic legend boxes live as SVG
    `<g>` elements in the lower-left corner, with `fill-opacity` for
    semi-transparency. Never a separate HTML `<div>` legend below the SVG.
  - **Ocean depth** — `<radialGradient>` lighter at the centre, darker
    at the rim. Add a `<pattern>` water-ruling overlay at 15-22% opacity
    for the engraving texture.
  - **overflow:visible for label-heavy diagrams** — SVGs where axis labels,
    spoke labels, or other annotations must bleed outside the viewBox (radar
    charts, orbit diagrams, adoption-curve milestones) should set
    `overflow: visible` on the `.px-<component>__svg` class in the theme
    CSS, plus add horizontal padding on the wrapper div
    (`.px-<component>__wrap { padding: 0 56px }`) to create the bleed space
    without clipping. Never enlarge the viewBox coordinate space to
    compensate — it wastes layout space.
  - **Fixed-column label pattern** — for diagrams with many labelled rings
    or bands at varying radii (e.g. OrbitTrace), place all labels in a fixed
    right column at `LABEL_COL = W * 0.76` with dashed connector lines from
    each data point to its label. Prevents stacking, clipping, and visual
    noise. Clamp label Y positions to `[20, H-20]` with
    `Math.max(20, Math.min(H-20, labelY))`.
  - **CSS class prefix isolation** — each component must own a unique CSS
    class prefix. Check `meta.css` for conflicts before choosing. The
    `ClimateStrip` component uses `px-cstrip` (not `px-strip`) because
    `.px-strip` is already owned by the `TopicStrip` navigation component in
    `meta.css` with `display:flex`. Using the wrong prefix silently corrupts
    layout. Convention: `px-<abbrev>` where `abbrev` is ≤6 chars and
    unambiguous (e.g. `cstrip`, `cgauge`, `ortrace`, `launch`, `bench`,
    `scurve`, `route`, `ccomp`, `ltab`, `radar`, `appr`, `pwm`).
- **Brand vs. legal name split.** Public brand is **Parallax**; registered
  trademark and legal entity is **Parallax Lens**. The longer name is used
  *only* where SEO and trademark records expect it: `<title>` tags, meta
  descriptions, RSS feed title, footer copyright (`© YYYY Parallax Lens`),
  and the About-page colophon (`Parallax is published by Parallax Lens™`).
  Everywhere else — masthead chrome, body headlines, hero, manifesto,
  topic-index nameplates, card kickers — keeps the brand as just
  "Parallax". Do not "fix" this asymmetry: it is deliberate and it
  preserves trademark enforceability while keeping the brand voice tight.
- **Topic-index dispatch.** `src/pages/topics/[topic].astro` is a slim
  dispatcher. The actual page composition lives in
  `src/components/topic/<topic>/<Topic>Index.astro`. Each topic gets its
  own page template that handles populated and empty states. Do **not**
  add per-topic logic back to the route file — the dispatcher pattern
  keeps the route to ~70 lines and lets each topic evolve its layout
  independently.

---

## 7. Design tokens

### 7.1 Meta brand (default `:root` in `meta.css`)

```
--bg               #faf7f0   warm neutral paper
--paper            #ffffff
--rule             #d8cfbf
--ink              #15130f
--ink-soft         #3d352c
--muted            #7a6d5e
--accent           #161412   (near-black — meta has no topic color)
--font-display     Fraunces
--font-body        Schibsted Grotesk   (was Inter Tight — unified type system, 2026-06-21)
--font-mono        JetBrains Mono
```

Topic accents exposed on meta pages for the strip/dots/archive-dots/cards:

```
--topic-politics   #b8341f      --topic-politics-deep  #8b2416
--topic-space      #00d4ff      --topic-space-deep     #0085a1
--topic-earth      #2d6a4f      --topic-earth-deep     #1a4a36
--topic-tech       #c6f432      --topic-tech-deep      #5a6e16
--topic-travel     #c85a3c      --topic-travel-deep    #9a4028
--topic-sports     #e8f048      --topic-sports-deep    #3f5428
```

`-deep` variants are used for large-text usages on light paper where the
vivid strip colors would fail WCAG contrast.

### 7.2 Per-topic tokens

See each `src/styles/themes/<topic>.css`. All topic tokens are currently
defined; only `politics.css` also ships full component styles (timelines,
vote charts, etc.). Other themes get component styles in Phase 2.

---

## 8. Routes generated

Total: 18 static routes + 1 RSS endpoint (as of 2026-05-04 build).
4 published issues (appear in home archive + RSS); 6 draft test fixtures
(built but not listed in archive or RSS — component verification only).

```
/                                              (home)
/about/
/issues/2026-04-24-delimitation/               published
/issues/2026-04-24-kessler-cascade/            published
/issues/2026-05-02-transgender-ratchet/        published
/issues/2026-05-03-el-nino-new-floor/          published — earth issue 01
/issues/2026-05-03-earth-map-test/             draft — earth component tests
/issues/2026-05-03-politics-components/        draft — politics component tests
/issues/2026-05-03-space-components/           draft — space component tests
/issues/2026-05-03-tech-components/            draft — tech component tests
/issues/2026-05-03-travel-components/          draft — travel component tests
/issues/2026-05-03-sports-components/          draft — sports component tests
/topics/politics/
/topics/space/
/topics/earth/
/topics/tech/
/topics/travel/
/topics/sports/
/rss.xml
```

---

## 9. Current state — what's done, what's deferred

### Phase 1 (shipped)

- Astro + MDX + TS scaffold
- Content collection schema
- Politics theme (tokens + all 7 custom components)
- Three full issues: *The Trojan Horse in Parliament* (delimitation, politics) + *The Orbit That Remembers* (Kessler cascade, space) + *The Protection That Erases* (transgender ratchet, politics — first agent-pipeline issue)
- RSS feed
- Home index, about page
- Mobile responsive (375px tested)
- **Site live at [parallaxlens.com](https://parallaxlens.com)** — Vercel + Cloudflare, auto-deploys on push to `main`

### Phase 1.5 — "Design Reframe" (shipped)

**Problem addressed.** Home page and issue page looked too similar because
both inherited `data-topic="politics"`. Design vision was one publication
holding five distinct aesthetic worlds — not achieved by the scaffold.

**Delivered.**

- Meta brand layer (`meta.css`) — neutral palette that harmonises with all
  five topic accents
- Typographic chord home hero (Fraunces + italic accent) + mono-style eyebrow
- Topic strip navigation with five vivid topic-color dots
- Featured issue card with locally-scoped topic theme (no leakage)
- Archive list with topic-color dot tags
- 6 masthead variants (meta + 5 topics)
- Dynamic `/topics/[topic]` route with getStaticPaths for all 5
- Per-topic manifestos + themed empty states (`T− awaiting launch`,
  `v0.1.0 · unreleased`, etc.)
- Compact `TopicStrip` under masthead on issue pages
- Author-name audit — no hardcoded `Shikhar Sharma` anywhere in `src/`
- Numbering format change: `No. 01 → — 01` site-wide

### Phase 2 — in progress

**Space world delivered (2026-04-24).**

- Full space theme CSS — dark mission-control palette applied to masthead,
  hero, timeline, paradox, quote, source list, footer
- New generic section kinds: `prose`, `comparison`, `data-readout`
- New space signature kind: `orbital-shells` (CSS-only altitude band chart
  with 12-cell relative-density dot rows)
- Issue 02 — *The Orbit That Remembers* (Kessler cascade) — 8 sections,
  12 verified sources

**Phase 2.5a — Earth + magazine home (2026-04-26).**

- Added `earth` as the 6th topic across schema, meta tokens, manifesto,
  topic route, masthead variant, and topic strip
- New `earth.css` theme — atlas paper palette (`#f0e9d8` / `#fbf6e9`),
  forest-green accent (`#2d6a4f`), USGS contour-brown alt, Cormorant
  Garamond display, lat/lng coordinate masthead, contour-line topic-hero
  motif
- Home page rebuilt around `CategoryGrid` — 2-col × 3-row of themed
  `CategoryCard` covers, each with topic-signature backdrop motif and
  either latest-issue preview or themed empty-state ribbon
- Chord dek updated from "Five topics" → "Six worlds"

**Phase 2.5b — Theme depth + signature components (2026-04-26).**

- Four new signature section kinds wired end-to-end (schema → SectionRenderer
  → component → topic theme styles):
  - `commit-grid` (tech) — GitHub-style activity heatmap, 5 lime intensity steps
  - `journey-map` (travel) — vertical itinerary with km / elevation / arrival
    metadata, terracotta dashed connector
  - `match-stat-line` (sports) — bold scoreline with horizontal stat-bar
    comparisons normalised per row
  - `elevation-profile` (earth) — stacked horizontal bands keyed to depth or
    altitude, USGS contour-brown / forest-green bars
- Full theme CSS depth for tech, travel, sports, earth (parity with
  politics/space) — masthead variant styles, hero, section, eyebrow,
  sources, footer, prose, comparison, data-readout, paradox, timeline
  re-skins, plus topic-index hero with topic-signature backdrop motif
- All cross-topic components now render correctly under any theme

**Phase 2.6 — Component library expansion (2026-05-03).**

11 new signature section kinds built, wired, and visually verified:

- `approval-chart`, `power-matrix` (politics)
- `orbit-trace`, `launch-stats` (space)
- `carbon-gauge`, `climate-strip` (earth — climate-strip class renamed
  `px-cstrip` to fix collision with TopicStrip nav in `meta.css`)
- `benchmark-chart`, `adoption-curve` (tech)
- `route-card`, `city-compare` (travel)
- `league-table`, `player-radar` (sports)

Each category now has 3+ signature section kinds available. Six draft test
fixture issues in `src/content/issues/2026-05-03-*` verified all components
render correctly at build time and visually.

SVG conventions expanded: `overflow: visible` + wrapper padding pattern for
label-bleeding diagrams; fixed-column label pattern for orbit/ring diagrams;
CSS class prefix isolation rule documented.

**API-direct pipeline CLI (shipped 2026-05-03).**

`npm run pipeline:<phase> <category>` — bills to `ANTHROPIC_API_KEY`, not Pro.
Smoke-tested: `pipeline:discover earth` ran 5m 9s, cost $1.23, produced a
valid 7-candidate file. Operator guide: `scripts/README.md`.

**Active pipeline queue.**

- earth: **published** ✅ — *The Pacific That No Longer Resets* (El Niño new floor) at `/issues/2026-05-03-el-nino-new-floor/`. Stylist pass applied (INVESTIGATION→FORENSIC→AWE→CONVERSATIONAL→FORENSIC→CALM-STRUCTURAL→LYRICAL blend).
- tech, travel, sports, politics, space: all at Phase 0 (run discover next)
- After each discover: editor picks 1 candidate → research → draft → **stylist** → verify → publish
- Target: **1 published issue per category**

**Deferred.**

1. Add WebFetch domain permissions for new research sources (separate task).
2. `git init` on any new tooling (queued, separate task).

**Still deferred.**

- More issues (will be addressed next session — see next session queue above)
- CSS motion signatures (scroll reveals, micro-interactions)
- About-page redesign
- OG image template
- Email / analytics / pipeline
- Sitemap (after investigating the earlier build error)
- `dependency-graph` and `constituency-map` components (deferred from component batch 1)

---

## 10. Verification checklist (run before declaring a change "done")

1. `npm run build` exits 0
2. `/` distinctly different from `/issues/2026-04-24-delimitation/`
3. `/topics/politics/` shows the delimitation issue; the other four show
   themed empty states
4. Home hero uses two fonts only; no ransom-note composition
5. Repo grep for `Shikhar Sharma` returns zero hits in `src/`
6. Repo grep for `No\.\s0` returns zero hits in `src/` except the `travel`
   masthead variant
7. Mobile 375px: no horizontal overflow on any route
8. `/rss.xml` is valid XML
9. Topic dots on the home strip each link to the correct `/topics/*` page
10. `npm run dev` + visual pass on home + all 5 topic pages + delimitation
    issue

---

## 11. How to update this doc

**Every meaningful change should:**

1. Update the affected section(s) above (file map, design tokens,
   conventions, state, etc.) so this doc continues to mirror reality.
2. Append a dated entry to the Change Log below — short and factual:
   *what changed, why*.
3. If a convention has shifted, lift it into §6 (Conventions) so it isn't
   forgotten.
4. If you discover context that future sessions will need (a design decision,
   a deliberately-rejected approach, a non-obvious constraint), capture it
   here rather than in a scratch file.

---

## 12. Change log


### 2026-09-04 — Revamp plan v3 signed (look first) + Phase 6.1 shell adoption + B1 instrument retrofits

Eleven commits on `main`, `d304c2d` → `dc6a28c`, all committed (a change from
the uncommitted sprawl of earlier entries). The operator re-read REVAMP-PLAN v2
and ruled **look first**: the plan is now **v3, signed 2026-09-04**, RD-10…RD-13
added, RD-03/07/09 struck (not deleted) in §1. Under it, Phase 6.2 (B1
best-first) closed and Phase 6.1 (shell adoption) closed in code, with only the
canon signature and one token decision outstanding. Source of truth:
`docs/REVAMP-PLAN.md` (v3) + `docs/STATE-OF-PLAY.md` (v3, operator-approved via
`/update-state`, `9851c9a`).

**A — B1 instrument retrofits (Phase 6.2, complete).** `scaling-plot` gained a
**LOG / LINEAR axis toggle** (`e5fd2f1`): both projections are computed in
frontmatter — no scale math on the client — the readout is derived from data,
the control is the `px-inst` chip pair (`aria-pressed`) + `px-inst__readout`,
routed through `core/VizCard.astro`; two latent tick-formatter bugs fell out of
it (a negative floor on a count axis; duplicate exponential labels). `xg-race`
gained a **minute scrub** (`d304c2d`) and `climate-spiral` a **month scrub**
(`714d1ac` — the plan said year; month was chosen because the payload is four
years). Both are a native `<input type=range>` that ships hidden and is unhidden
by the island once the payload parses; the per-minute / per-month tables are
precomputed at build. `XgRace` derives its `clipPath` id from a payload hash;
in `ClimateSpiral` the scroll-in reveal owns `stroke-dashoffset` and the scrub
owns opacity only. **`px-inst` gained an opt-in exact readout reserve**
(`328395d`): `px-inst__readout--sized` + `.px-inst__sizer` render the
component's worst-case readout string as a `visibility: hidden` twin stacked in
the same grid cell, so the box reserves its true height — `min-height: 3.2em`
was not enough (xg-race reflowed 15px mid-drag; scaling-plot jumped 17px on the
live page). Applied to the three instruments; it **must stay opt-in** because
`StateTimeline` mixes inline children. Editorial (`81cc2da`): `howToRead`
authored for four sections (the token-bill `scaling-plot` + the tech / sports /
earth showcases); the *published* token-bill caption dropped its trailing
"· log scale" (CAPTION-FORM — the reader can now change the scale). Rule for
instrument how-to-reads: **the static reading leads, the control clause trails**
— the controls are `html.js`-gated, the paragraph is not.

**B — Phase 6.1 shell adoption, five commits.**

- **1/n — the flat viz card and its world rule** (`b74815d`). `.px-viz` is flat:
  `border-radius: 0`, no `box-shadow`, a 3px top rule
  `border-top: 3px solid var(--viz-edge, var(--ink))`, hover = border-colour
  only. New per-theme token `--viz-edge` in `src/styles/themes/<world>.css` —
  `var(--ink)` on the light desks (politics, earth, travel), `var(--accent)` on
  the dark (space, tech, sports). The RD-05 radius flip — `--r-card: 0;
  --r-tile: 0` — lives in `src/styles/base.css` `:root`, **not** in
  `shared/design/tokens.css`, because `app/` consumes those tokens and keeps its
  own spec until Phase 8. `--r-pill` deliberately **not** flipped (43 sites of
  UI chrome). Measured, not assumed: the three token flips reach **99 of 249**
  radii, not the plan's "128 of 267". The ⤢ expand button (`.px-vexp`) is 44px
  under `(pointer: coarse)`. SeatChart's bespoke `px-seats__source` replaced by
  the shared class, its CSS retired. `story.css` now hides `[class$='__cap']` /
  `[class$='__src']` at depth 1 as well as depth 2 — Timeline / BillBreakdown /
  VoteResult emit their chrome as a *sibling* of the graphic root.
- **2/n — the RD-05 shadow sweep and the toolbar's flat skin** (`943fe09`).
  115 `box-shadow` declarations → 64. Removed on **surfaces only**: the
  `px-viz`-style cards, `.px-compare`, `.px-beats`, `.px-bills__card`,
  `.px-analogy`, `.px-shells`, `.px-commit__frame`, `.px-elev__stack`, the gate
  card, letters, annotation items, home category cards, the featured plate +
  its CTA, the travel index ticket cards, the six topic-index empty states
  (which got a 1px hairline — the shadow had been their only edge), and the
  bespoke roots `.px-coalc` / `.px-swheel` (which also gained the 3px
  `--viz-edge` rule). **Kept**: focus rings, inset hairlines, halo rings / glows
  on data marks, slider thumbs, CSS-3D scene depth (ArchStack, PlayerCard,
  TacticsPitch, ChipDie, CoreSample, SeaLevelTank, AtmosphereColumn,
  BillPassage, ItineraryReel — RD-06), viz3d overlay chrome, modal / popover /
  toast chrome, the onboarding surface. Ten of seventeen theme "elevated card"
  rules were **orphans from the v2 port** (`.px-readout`, `.px-vote`,
  `.px-paradox`, `.px-appr__svg`, `.px-pwm`, `.px-ortrace__wrap`,
  `.px-launch__svg`, `.px-bench__svg`, `.px-scurve__svg`, `.px-route__card`) —
  their elevation blocks deleted, base rules left for the deferred dead-CSS
  pass. Reading toolbar `.rtb` flat: opaque `var(--paper)`, `border: 2px solid
  var(--ink)`, no `backdrop-filter`, no shadow, pill radius kept; the live
  progress bar untouched; thumb shadow → 1px rule. Hover lift retired to
  border-colour on every surface.
- **3/n — the Source fold** (`8eea66f`). `core/Section.astro` now renders the
  source line as `.px-plain__src` — `SOURCE · …` at 9px / 600 / .14em mono — as
  the plain paragraph's **second line, below the graphic, for every kind**, from
  `section.source ?? data.source` (SectionRenderer passes `source` to
  CoreSection; Section joins `{label, date}`). VizCard no longer renders source
  (it still accepts the prop). The verifier is unaffected (it reads MDX). The ⤢
  modal portals the card, so it shows no source — ruled as-is, a later call.
  CSS in `viz-type.css`.
- **4/n — the how-to-read fallback is on, for every kind** (`bdbfea8`).
  `core/Section.astro` renders `<p class="px-viz__how px-viz__how--section">`
  **above** the graphic (after `intro`, before `<slot/>`) for every kind, from
  `section.howToRead ?? EXPLAIN[kind].how`; SectionRenderer passes `howToRead`.
  For the **ten VizCard kinds** (bill-funnel, age-pyramid, margin-bullets,
  state-timeline, attrition-waffle, finish-interval, channel-ternary,
  scaling-plot, xg-race, climate-spiral) `SectionBody` resolves
  `section.howToRead ?? EXPLAIN[section.kind]?.how` at the dispatch line (it now
  imports `EXPLAIN`) so VizCard renders it *inside* the card, and the
  `dataviz-v2.css` rule `.px-section:has(.px-viz > .px-viz__how)
  .px-viz__how--section { display: none; }` guarantees **exactly one panel per
  section**. Before this, an authored `howToRead` on any of the 87 non-VizCard
  kinds was **silently dropped**. `tactics-pitch`'s `how` rewritten ("Each disc
  is a player in their starting spot; the pitch can be turned to read the shape
  from either end.") — the only live control cue; 29 draft-only cues left for a
  bulk pass. `VizCard.astro`'s header comment updated.
- **5/n — the seventy in-card source emitters are gone** (`b0260b2`). Every
  per-component `.px-viz__src` emitter stripped (66 canonical one-liners, 3
  variants, the SeatChart comment rewritten); the `.px-viz__src` CSS rule and
  the interim unscoped hide retired in `dataviz-v2.css` (a note remains).
  **`.px-viz__src` now has zero emitters and zero rules; the source line class
  is `.px-plain__src`.** CourtValue kept its value-*model* line on a new scoped
  class `.px-cval__model`. The `story.css` `[class$='__src']` beat rule stays (a
  harmless suffix rule).

**C — REVAMP-PLAN v3, signed** (`f40fd4c`). **RD-10 supersedes RD-03**: the
mark is **un-parked** — all 38 handoff SVGs set the P as live `<text
font-family=Literata>`, so the glyph is to be outlined at build time (a Literata
*shape*, no Literata *file*). **RD-11**: RD-04 re-examined and **stands** — the
handoff's own `TYPE-MAPPING.md` says Literata "must not reach the repo"; the v2
author had mis-framed compliance as rejection. **RD-12 supersedes RD-07**: the
3-column issue grid ships in Phase 7 in the **same commit** as the ReadingGate
rework. **RD-13 supersedes RD-09**: the order is finish 6.1 → 6.3 type harvest
→ 7 web pages (the README's **six**: masthead, home, desk, issue, archive,
about; "desk" = the topic index reskinned, ruled) → the brand (scope first —
"B4 ~12 days" traces to nothing) → 8 app (eleven screens) → 5 mobile → Waves
2–4 (reassessed at the look's exit). Two riders: the Source fold lands as-is
(modal shows no source); desk = reskin. §0 execution state, §4-v3 sequence, §6,
§7, §8 rewritten.

**D — Docs.** `docs/STATE-OF-PLAY.md` → v3 (`9851c9a`).
`docs/design/EXPLAIN-HOW-REVIEW.md` **tabled**: **90** `how` strings (not 81 —
the plan's count predates Phase 1's backfill of nine breadth-pass kinds), 30
CUE / 60 READ; 19 kinds would render on published pages (69 sections); exactly
**one** live cue (tactics-pitch). `CANON.md` + `motion.md` amendments committed
as a **marked DRAFT** (`dc6a28c` — a DRAFT line at the top of each file),
**awaiting the operator's signature** per REVAMP-PLAN §6: CANON §1 flat surfaces
+ world rule; §7 source renders once, from Section; §10 the four-layer stack
(how-to-read ABOVE, caption, plain + source BELOW, prose) + the one-panel rule +
"static reading leads, control trails"; §11 glass modal-only, reading-surface
shadows on the kill list; §13 items 5 and 9; new **§14 Surfaces and elevation**
(RD-05). `motion.md`: `hoverLift` marks-only; `cardLift` a RETIRED row;
`pageEnter` / `worldFade` **named** as the existing CSS view transition at
`--t-page` 600ms (the handoff's ~300/340ms unadopted — a token decision still
open); hard rule 7; the reduced-motion line.

**Where this leaves the architecture** (any doc contradicting these is stale):
`core/Section.astro` owns all explainability chrome for every kind — how-to-read
above, plain + `Source ·` below — and components render none of it themselves
(VizCard's ten kinds render the how-to-read in-card, Section's copy hidden by
`:has()`). VizCard = caption row (+ optional chip) + optional in-card
how-to-read + the graphic slot; it does **not** render the source line.
`EXPLAIN[kind].how` is the live fallback on every kind. `.px-viz` and every
reading / home surface are **flat** — radius 0, no shadow, hover border-colour
only — every figure wears the 3px `--viz-edge` top rule, the radius override
lives in `base.css :root`, `--r-pill` is untouched, the toolbar is paper + 2px
ink, and glass survives on modal chrome only.

**Remaining.** Phase 6.1 is complete **except** the canon signature (and the
`--t-page` retime decision). Phase 6.2 is complete. Next per RD-13: **6.3 type
harvest**, which begins by **measuring the font binaries** — RD-08's 16→18px is
conditional on it. Still owed: Phase 5's mobile font bump on ScalingPlot /
XgRace / ClimateSpiral (`ScalingPlot.astro` carries the measurements and why a
plain bump fails); the modal shows no source; the 29 draft-only EXPLAIN cues; a
JS-gated `howToRead` control clause (a schema call); the `--t-page` decision.
Counts as of this entry: 97 kinds; 90 EXPLAIN entries + 7 narrative-exempt; 33
decisions tracked (12 decided-but-unbuilt); 77 kinds never in a published issue;
10 published / 13 draft issues.


### 2026-08-17 → 08-28 — Design-revamp: analysis, decisions, Phases 0–4 execution

The Claude Design handoff (`Parallax Design System Revamp/`, committed with its
8 recovered `.dc.html` prototypes) was analysed by a ~30-agent audit, ruled on
(RD-01…RD-09 — staged annex-first scope, mark deferred, trio kept, flatness at
Phase 6, full workstream B sequenced), and executed through Phase 3 Wave 1.
Source of truth: `docs/REVAMP-PLAN.md` (v2.1, with an execution-state table);
snapshot: `docs/STATE-OF-PLAY.md`. Shipped, in order: **Phase 0** pre-deploy
hardening (draft og:image 404s, app favicon, font-lookup crash) + the P6–P8
backlog pushed, migration applied, both sites deployed; **Phase 1** gates
(`check:catalog` coverage + no masking + into `prebuild`; `design-sync` palette
mirrors) and a measured WCAG pass — derived `--muted`, the accent-deep two-role
split (the app was rendering tech/sports accent-deep text at 1.88/1.85:1 on
light paper), travel small-text fixes, all six worlds now zero failures — plus
phone navigation (native `<details>` masthead menu; the site had none <900px);
**Phase 2** `docs/design/TOKEN-RECORD.md` (TD-01…TD-06), schema fields
`howToRead`/top-level `caption`+`source`/issue `voice`, `core/VizCard.astro`,
the `px-inst` primitive, ⤢ for 11 bespoke-root figures; **Phase 3** Waves 0–1 —
seven new kinds (bill-funnel, channel-ternary, age-pyramid, margin-bullets,
state-timeline, attrition-waffle, finish-interval), library **97**, each
build-validating its payload invariant and browser-verified against its
blueprint §11 (`scripts/wire-kind.mjs` wires the registry); **Phase 4 partial**
— the three comprehension fields contracted across drafter/verifier/catalog,
and the source backfill: 21 published figures with no source line → 0
(operator-confirmed mapping; Timeline/BillBreakdown/VoteResult gained source
rendering; the 22 caption gaps ruled deliberate). Notable corrections en route:
the "CSS vars don't resolve in SVG presentation attributes" claim disproven
(convention retained for specificity/satori reasons); TD-06 (text sits on
`--accent-deep`, never the vivid accent). Remaining: Waves 2–4 (21 kinds),
Phase 5 mobile legibility, Phases 6–8 (workstream B), B4 behind RD-03.

### 2026-07-14 — P6 breadth (22 kinds → 90) + responsive pass + P8 agent wiring + app Shelf/welcome + funnel + story breadth

Closed the four items the 2026-07-05 entry listed as "remaining", plus the
publication-side funnel and a story-mode breadth pass. **Everything below is
shipped in-repo and UNCOMMITTED** — ~70 files against `main` @ `ed04da5`
(60 at the time the code landed; the same-day documentation refresh took it to
~72 — recount with `git status`), nothing pushed. Root `npm run build` green
(44 pages); `cd app && npm run build` green (exit 0). **The app cannot run on
this box** (no `.env.local` ⇒ the middleware throws `Missing env:
PUBLIC_SUPABASE_URL`), so every app change here is **compile-verified only** —
no runtime, no auth round-trip, no DB read. Publication changes were
browser-verified live on the dev server.

**A — P6 component breadth: 22 new section kinds (`SECTION_KINDS` 68 → 90).**
Built from the P5 blueprints, five-ish per world, each browser-verified on
desktop and at 375px:

- **earth (4)** — `plate-motion` (WebGL), `atmosphere-column`, `carbon-loop`,
  `storm-track` (WebGL)
- **space (4)** — `constellation-swarm` (WebGL), `lagrange-map`,
  `transfer-window`, `eclipse-cone`
- **politics (3)** — `coalition-calculus`, `gerrymander-lens`, `ballot-flow`
- **tech (4)** — `packet-trace` (WebGL), `queue-cliff`, `chip-die`,
  `moore-ladder`
- **travel (4)** — `city-grid`, `altitude-oxygen`, `season-wheel`,
  `fare-terrain`
- **sports (3)** — `elo-river`, `court-value`, `pace-ridge`

Components live at `src/components/topic/<world>/<Name>.astro`. Four new
lazy WebGL scenes landed under `src/scripts/viz3d/scenes/`
(`plateMotion.ts`, `stormTrack.ts`, `constellationSwarm.ts`, `packetTrace.ts`)
plus a new shared helper `src/scripts/viz3d/packet.ts` (exports `budget`,
`layoutBar`, `cities`, `meanHopLon`, `Hop`) that is imported by **both**
`PacketTrace.astro` and its scene, so the static fallback and the WebGL scene
cannot drift. One new data file: `public/geo/plates.json`.

**The 6-file wiring pattern.** Every kind touches exactly six shared files,
hand-wired (this is the checklist for kind 91):

1. `SECTION_KINDS` in `src/content/config.ts`
2. `src/components/SectionBody.astro` — import + dispatch branch
3. `src/scripts/viz3d/scenes/index.ts` — WebGL kinds only
4. `src/lib/explainers.ts` — the `EXPLAIN` entry (what / how)
5. `docs/design/catalog.md` — the `## <kind>` block; `npm run check:catalog`
   enforces a 1:1 match with `SECTION_KINDS` **in the same order** (90 ↔ 90)
6. a worked example section in that world's
   `src/content/issues/2026-06-03-<world>-showcase/index.mdx`

**Gotchas worth keeping.** `coalition-calculus` is the **one** kind dispatched
with a spread — `<CoalitionCalculus {...data} />` — because it reads flat
props; every other kind takes `section.data`. Section `plain` is capped at
**220 chars** by Zod (`config.ts`) and overshooting **breaks the build**.
`CityGrid.astro` **hard-throws** unless `cities.length` is 1–3. And the globe
seed-yaw convention (from `globe.ts`, basis `th = lon + 180`, camera on `+z`):
to open facing longitude `cLon`, set
`drag.s.yaw = -((cLon + 90) * Math.PI) / 180` — writing `+180` there is the
classic bug that opens the scene on the limb.

**B — Systemic responsive pass** (tail of `src/styles/dataviz-v2.css`, one
`@media (max-width: 640px)` block). The real, reproducible mobile overflow was
**data tables**, not charts: `table.lt` and `[class$="__table"]` now go
`display: block; overflow-x: auto` so rows scroll *within* their card (desktop
untouched — they stay `display: table` above 640px). Safety nets alongside:
`.px-viz { max-width: 100% }`, `.px-viz > * { min-width: 0 }`,
`.px-ireel { overflow-x: clip }`. **Honest residual (not fixed):** in-SVG fine
print still renders at roughly 3.4–7px at a 375px viewport, because SVG cards
use a fixed `viewBox` with `width: 100%` and scale their type down with the
drawing. There is **no clean blanket fix** — a `min-width` floor breaks the
tall-narrow columns / discs / gauges. Mobile chart legibility is currently
carried by the HTML layer around the graphic (the "In plain terms" line, the
caption, and legends/tables at real px) plus the ⤢ expand-modal study view. A
per-component mobile-reflow round was offered to the operator and **not done**.

**C — P8 editorial-agent wiring** (`.claude/agents/*.md`; no build impact).
`drafter.md` now reads `docs/design/catalog.md` as the canonical ~90-kind
palette — this **replaced a stale inline "30 kinds" list** — and authors
`plain` (form, not data; ≤220 chars), `skimCaption`, and `layout` per section
while following the one-hero-visual / ≤3-loud / act-break rhythm from CANON §3;
its self-check was extended to match. `stylist.md` gained a new **Step 4.6
structure + plain audit** (flags one-metaphor violations, act-rhythm problems,
catalog non-conformance). `researcher.md` now captures each proposed
component's catalog **`DATA:`** line — plus the `RESEARCHER MUST CAPTURE` note
on the 14 blocks that carry one — so dossiers carry real sourced
data instead of invented coordinates or ratings. `verifier.md` treats component
`data` values as traceable claims and flags a `plain` line that asserts *data*
with ⚠️ PLAIN-CLAIM.

**D — App: dashboard rebuilt as "The Shelf"**
(`app/src/pages/dashboard/index.astro`). Fixes the operator's "dashboard =
2000s design" complaint. Module order: greeting header → shelf tile grid
(saved issues) → reading log (3 `.stat`s) → "In the margins" (the reader's own
`comments` with status chips) → preferences (3 `.toggle` rows with a
progressive-enhancement fetch save) → account plate → admin tiles (admin only)
→ danger zone. It uses `width="shelf"` and the `app.css` v2 primitives that
already existed from P3 (`.plate` / `.tile` / `.chip` / `.toggle` / `.stat` /
`.appbar` + the `.reveal` IO island) — no new design language. Queries are
restricted to confirmed shapes: `profiles`, `saved_issues`, and
`comments(id, body_md, status, created_at, issue_id, user_id)`. **Deferred**
(each needs schema + runtime verification we can't do here): per-issue
reading-progress hairlines from `reading_events`, topic-affinity bars, and
**real issue titles** via a cross-project issues manifest — today the tiles
title-case the slug.

**E — App: welcome / onboarding flow (new; closes JOURNEY-SPEC fix #7).**

- **Migration** `app/supabase/migrations/20260705000000_journey_onboarding.sql`
  adds `profiles.welcomed_at timestamptz` and
  `profiles.stated_interests text[] NOT NULL DEFAULT '{}'`. No new GRANT and no
  new RLS policy are needed: the Phase-A
  `GRANT SELECT, UPDATE ON public.profiles TO authenticated` is table-level (so
  it covers new columns) and `profiles_update_own` already permits own-row
  writes. Idempotent (`ADD COLUMN IF NOT EXISTS`). **NOT YET APPLIED — the
  operator applies it to prod Supabase.**
- **`app/src/pages/welcome.astro`** — a "You're in." plate on the narrow shell,
  mirroring `login.astro` (animated `LensMark` 56, `data-world` tint). The name
  `.field` prefills from `profiles.display_name`, falling back to the
  `user_metadata` name / full_name. The six world chips are **native
  `<input type="checkbox">`** elements (visually hidden) wearing the shared
  `.chip` face, with selection shown via `.wchip__input:checked + .chip` — so
  the picker both **submits and shows state with zero JavaScript**. That was a
  deliberate departure from the spec's literal `aria-pressed` suggestion: the
  fallback contract outranks the spec. Three-row mono feature strip; two submit
  buttons share `name="intent"` (`save` / `skip`, with `skip` carrying
  `formnovalidate`); the CTA reads "Back to the issue →" when `next` is an
  issue and "Open my shelf" otherwise. **The page ships no client script.**
- **`app/src/pages/api/onboarding.ts`** — authenticated POST (`requireUser`).
  It **always** stamps `welcomed_at`, on save *and* on skip, so welcome is
  genuinely once. A blank name will not wipe a name Google supplied. Interests
  are allowlist-filtered and deduped. `next` is validated through
  `safeNextPath`. The `?welcome=1` toast marker is appended **only** for
  `/issues/` URLs and **before** any `#fragment`. A `.select('id')` row-count
  check logs a silent 0-row update rather than reporting success.
- **`app/src/pages/auth/callback.ts`** (modified) — after
  `exchangeCodeForSession` it re-reads the user via `supabase.auth.getUser()`,
  because the middleware pre-fetched `locals.user` as **null before the
  exchange**. It gates on a *clean* read only —
  `!profileError && (!profile || profile.welcomed_at == null)` →
  `/welcome?next=&world=` (world allowlist-validated). A transient profiles
  read error falls through to `next`, so the gate can never become a barrier to
  getting in.
- Adversarially reviewed on three lenses (security / runtime / spec): four
  minor findings, **all fixed**. The security lens found nothing exploitable.

**F — P6.3 publication funnel** (closes the loop; browser-verified live).
Two pieces **already existed** before this session and were verified rather
than rebuilt: `src/components/core/AccountEntry.astro` (the masthead
"Sign in" ↔ "Shelf" swap via the shared auth-cookie heuristic, with `/api/me`
used as a *confirmer* only, never a gatekeeper) and
`src/components/core/ReadingGate.astro` (3 benefit rows, `&world=` on the CTA,
and the `sessionStorage px_resume` scroll-position save). New/changed:

- **`src/components/core/WelcomeBack.astro`** (new, prefix `px-wb`) — a
  top-centre glass toast mounted in `src/pages/issues/[slug].astro`. Fires on
  `?welcome=1`, reads `sessionStorage px_resume`, offers "Continue where you
  left off ↓" which scrolls to the saved y, clears `px_resume`, and strips the
  param via `history.replaceState`. The 8s auto-dismiss **pauses on
  hover/focus** so keyboard and AT users don't lose the resume control. At
  ≤460px it uses a definite `width: calc(100vw - 24px)` plus flex-wrap, giving
  a ~73px two-row toast (it was 168px when it shrink-wrapped).
- **`src/components/core/NewsletterNotice.astro`** (new, prefix `px-nnote`) —
  an in-flow ribbon mounted **above `<Masthead>`** in `src/pages/index.astro`.
  Fires on `/?newsletter=confirmed` with "You're on the dispatch." + a
  free-shelf CTA, strips the param, and is dismissible. It occupies no space
  until revealed, so no-JS readers and crawlers see nothing.
- **`src/components/core/SaveButton.astro`** (modified) — the signed-out label
  is now "Save to your shelf"; the signed-out click carries
  `&world=<data-topic>` into the login URL (world-tinted auth plate); a
  first-save microline "On your shelf →" (linking to the app dashboard) flashes
  once and fades after 4s; the loading pulse is now gated by
  `prefers-reduced-motion`. Note for future edits: SaveButton mounts **inside
  `core/ReadingToolbar.astro`**, not directly on the issue page.
- **`src/components/core/NewsletterForm.astro`** (modified) — the POST target
  was repointed `/api/subscribe` → **`/api/join`**, the copy is now "One email.
  Two things.", and it handles the degraded `{ ok: true, account: false }`
  response. The form is also now **no-JS-gated** behind `html:not(.js)` with an
  "Enable JavaScript to subscribe." line: previously a no-JS submit did a
  native GET that reloaded the page with the reader's **email in the URL,
  browser history, and server logs**. NewsletterForm is the single source
  embedded by SubscribeStrip / Colophon / Footer / BeatJoin, so one repoint
  covers every mount.
- Reviewed on three lenses (no-JS + SEO / security / spec + a11y + mobile): six
  findings. The one rated "major" — a claimed reading-toolbar horizontal
  overflow at 375px — was **disproven by measurement**: the glass pill measures
  260px wide at a 375px viewport and page `scrollWidth` is exactly 375. The
  rest were fixed; security found nothing.
- **Deploy order matters: the app must deploy BEFORE the publication**, because
  the NewsletterForm repoint depends on `/api/join` being live.

**G — P7 story mode: breadth + share.** Four pieces were **already built by
P4** and only verified here, not redone: `src/components/story/StoryShare.astro`
(`navigator.share` → clipboard fallback → `role=status` confirmation);
`scripts/story/og.ts` wired as the `prebuild` npm hook, rendering one 1200×630
PNG per non-draft issue into `public/og/story/<slug>.png` via `ogCard` +
`toPng(…, 'og')` from `scripts/social/cards.ts` (it regenerates every build —
10 valid PNGs, 53–109KB); the OG/Twitter head tags in
`src/layouts/StoryLayout.astro`; and the `?via=story` attribution on
`StoryCtaCard`. New in this session:

- **All 22 P6 kinds added to `KIND_PRIORITY`** in `src/lib/story.ts`. They had
  been silently falling to the default 30, which made them effectively
  unrankable for beat selection. Assigned: `constellation-swarm` 90;
  `court-value` + `coalition-calculus` 86; `plate-motion` + `storm-track` +
  `packet-trace` 84; `lagrange-map` + `queue-cliff` 82; `transfer-window` +
  `gerrymander-lens` + `ballot-flow` 80; `chip-die` 78; `eclipse-cone` +
  `elo-river` 76; `city-grid` + `season-wheel` 74; `pace-ridge` 72;
  `carbon-loop` 66; `moore-ladder` + `atmosphere-column` 64; `altitude-oxygen`
  + `fare-terrain` 62. All 22 names were cross-checked 1:1 against
  `SECTION_KINDS`.
- **New trim** `TRIM['city-grid'] = cap(cities, 2)`. An adversarial review
  caught the gotcha: `CityGrid` hard-throws above 3 cities, so the initially
  written cap of 4 was a guaranteed **dead no-op**.
- **Story-teaser chrome compaction** in `src/styles/story.css`:
  `.pxs-beat__viz > * > [class$='__cap'], .pxs-beat__viz > * > [class$='__src']
  { display: none }` plus `.pxs-beat__viz > * { margin: 0 }`. Rationale: inside
  a story card the beat text already supplies the title and the CTA links to
  the full issue where sources live, so the section's *own* title-caption and
  source-citation are redundant **chrome**. Reclaims 150–280px per card
  (trajectory-arc went 2.32× → 1.41× overflow). An adversarial lens confirmed
  the selector hides only chrome and never data — graphic containers never end
  in `__cap` / `__src`.
- **Prose beats are now pure-text cards** (STORY-MODE-SPEC §1):
  `StoryCard.astro` skips `<SectionBody>` when `kind === 'prose'` and adds
  `.pxs-card--text` (editorial Fraunces, no 26dvh clamp). Rendering the whole
  prose section had been a tall duplicate — 2.74× overflow became a 374px card
  that fits.
- **`app/src/pages/admin/social.astro`** gained a per-post "↗ story" link to
  `/s/<issue_id>/` and a "Copy story link" clipboard button, on a separate
  delegated handler so it never touches approve/reject.
- **Verified at 375×667** across the space / politics / earth stories: every
  card fits the viewport, zero horizontal page overflow, graphics survive the
  compaction.
- **Honest residual:** text-heavy narrative kinds still render tall and rely on
  the spec-sanctioned 62dvh internal scroller (comparison ≈3.8×, paradox ≈2.3×,
  timeline ≈1.5×). The real fix for viz-poor issues is an **authored `story:`
  frontmatter block** where the editor hand-picks viz beats (as on the asteroid
  flagship) — an editorial action, not a code gap. A per-kind compaction pass
  across all 90 kinds was scoped **out**. Note that story pages build only for
  `status !== 'draft'` issues (10 today); the six `*-showcase` issues are
  `status: draft`, so they have **no** story page.

**H — What remains.** *Operator only:* apply the `journey_onboarding` migration
first; then commit + push (~70 files) and **get the app live before the
publication** — the newsletter form now posts to `/api/join`, so a
publication-first deploy leaves that form hitting a 404; then run a real-iPhone
story snap pass via a Vercel branch preview. `docs/STATE-OF-PLAY.md` §5 holds
the canonical sequence. *P8 tail:* retrofit
two published issues with the new components and run one fresh
`pipeline:draft` to prove catalog-driven selection — that touches live content
and bills the pipeline, so it's an editorial call. *Optional code:*
per-component mobile chart reflow; per-kind story compaction; the richer Shelf
modules (reading-progress hairlines, topic affinity, real issue titles via an
issues manifest). A full product **revamp** (design + functionality) is planned
as the next major effort in a fresh session.

### 2026-07-05 → 07-06 — Product-elevation program (design canon + flagships + home + story mode + 2 review rounds)

Operator-approved master elevation of the whole product — visual depth,
per-world component inventories, a casual-reader language layer, a complete UX
journey, and a shareable story format — executed as a phased plan (P0–P8) with
a **model-succession** design (Fable authored the design-critical artifacts;
Opus executed breadth from them after Fable's budget capped mid-run — the
succession the plan was built for). **All shipped in-repo, build green (44
pages), and UNCOMMITTED** (code-only account — operator commits/pushes/deploys).
Full detail lives in `docs/design/` (the canon); this is the summary. *(The
2026-06-21→23 content/social-engine work sits between this and the entry below;
it's logged in `AGENTS.md` change log + `docs/CONTENT-ENGINE.md` + agent
memory, not backfilled here.)*

- **P0 — Design canon (`docs/design/`).** The model-succession payload: turns
  taste into checkable rules. `CANON.md` (one-metaphor rule, act-structure
  density, line-art doctrine, type/color/honesty rules, anti-"generic-AI"
  kill-list), `motion.md` (named motion vocabulary), `catalog.md` (the
  what-to-use-when catalog, enforced by `npm run check:catalog`),
  `JOURNEY-SPEC.md` / `APP-DESIGN-SPEC.md` / `STORY-MODE-SPEC.md`, `physics/`
  (formula sheets), `worlds/` (per-world language), `blueprints/` (per-component
  contracts). Plus `shared/design/{tokens,worlds}.css` as the canonical token
  source for BOTH projects (`npm run design:sync`; `design:check` gates the
  build; `tokens-v2.css` is now a re-export). The §7 "minimal JS" rule was
  rewritten to **rich-on-issues, lean-elsewhere** (fallback contract absolute).
- **P1 — Shared infrastructure.** Per-scene lazy WebGL chunks
  (`viz3d/scenes/` + `helpers.ts` orbit/zoom/pick/tooltip/instancing +
  `kepler.ts` pure math); the in-flow **"In plain terms" line** under every viz
  (`src/lib/explainers.ts` + `core/Section.astro`); `section.layout`
  variants + the `act-break` kind + `layout-v2.css` (incl. the zero-JS
  `split` scrollytelling primitive); the `SectionBody.astro` extraction that
  unlocked story mode.
- **P2 + P6 — Flagship components, one hero per world.** Six navigable,
  physics-grounded WebGL centerpieces: **solar-system** (Keplerian, epoch-
  correct), **chamber** (instanced hemicycle + division walk), **power-flow**
  (conservation-gated Sankey), **terrain-relief** (hillshaded hypsometric DEM
  relief), **neural-flow** (instanced forward-pass), **terminator-globe** (jet
  lag on the day/night line), **flight-of-the-ball** (drag+Magnus trajectory).
  All browser-verified, physically correct, code-split, fallback-first.
- **P3 — App design language + login.** `app.css` v2 (Schibsted Grotesk,
  plate/chip/toggle/glass primitives), `AppLayout` v2, `LensMark`, and a
  **fully redesigned `login.astro`** (5-state machine, world-tinted plate,
  "check your inbox" state). App builds green; live verify is operator-side.
- **P4 + P7 — Story mode + share.** `/s/<slug>/` — swipeable full-screen
  visual stories reusing live components as cards (all 10 issues), snap UX,
  `?via=story` funnel, `noindex`. Plus **OG images** auto-generated at build
  (`scripts/story/og.ts` → `ogCard` 1200×630) for story AND issue pages
  (issues shipped no `og:image` before) + a share button.
- **P5 — All 26 remaining component blueprints** authored + adversarially
  verified (~60 findings — formula/geometry/motion bugs — caught & fixed).
  The full design-contract set (`docs/design/blueprints/`) that makes the
  remaining breadth build model-agnostic.
- **P2.5 / P2.6 / home — review round 1.** Primer → integrated brief;
  unified body type + justification; optical drop cap; orbit-globe framing;
  the three light worlds (politics/earth/travel) given distinct **motif kits**
  (gazette / survey atlas / field journal) so each is identifiable with the
  masthead cropped; masthead **Sign-in entry** + gate benefit rows (visible
  journey); and a **full home revamp** (`HOME-SPEC.md`) — the enacted
  brand-lens hero, wire strip, live desk portals, featured plate.
- **Review round 2** (`docs/design/REVIEW-2026-07-05.md`): unified in-scene
  labels (anchor dot + consistent offset, all 6 scenes); widened zoom-out
  so scenes frame fully; **CANON §4 amended to allow restrained fills** →
  terrain became a filled hillshaded relief (regenerated a clean sample DEM);
  hero refined so the parallax concept reads (tinted overlapping fields +
  sightlines + reticle + caption).

**Remaining (not yet built):** ~20 breadth components (all blueprinted); the
app Shelf-dashboard + welcome flow + join wiring (P6 app side); P8 pipeline
wiring (teach the editorial agents the catalog). Standing gates: root `npm run
build`, `npm run design:check`, `npm run check:catalog`.

### 2026-06-21 — Unified type system + "The Second Angle" onboarding + soft signup gate

Three product-wide passes; all shipped in-repo, **build green (34 pages)** and
**uncommitted** (code-only account — operator commits/pushes/deploys).

- **Unified 3-font type system.** Collapsed ~11 fonts to a strict trio used
  everywhere — **Fraunces** (serif voice), **Schibsted Grotesk** (the single
  sans, replacing Inter Tight as `--font-body`), **JetBrains Mono** (labels /
  numerals). The six worlds no longer use per-world display fonts; they differ
  by **accent colour + treatment**. Retired as differentiators: Space Grotesk,
  Cormorant Garamond, Oswald, Inter Tight, IBM Plex (and the intro-only Sora /
  Syne / Instrument Serif / Space Mono). Lever: `type-v2.css` (imported last)
  normalises `--font-display`/`--issue-face`/`--face-*` to Fraunces across
  `:root` + all six `:root[data-topic]`; also touched `meta.css`, all six
  `themes/<topic>.css`, `home/CategoryCard.astro`, the earth SVGs
  (`RegionMap`/`CarbonGauge` Cormorant → Fraunces), the Google-Fonts `<link>` in
  all three layouts (trimmed to the trio), and the `about.astro` colophon copy.
- **"The Second Angle" first-visit onboarding** — a cinematic, distinct-identity
  surface (NOCTURNE / kinetic / AURORA on the trio), scoped under
  `.px-intro` / `.px-xp` in the new `intro.css` (own palette tokens, never
  touches article styles). New files: `styles/intro.css`,
  `layouts/IntroLayout.astro`, `components/intro/{IntroStory,IntroExperience,
  WorldViz}.astro`. `pages/welcome.astro` rebuilt as a standalone full-screen
  auto-playing story (linked from the Colophon "Why Parallax"); `index.astro`
  mounts `<IntroExperience/>` (auto-story → optional spotlight tour of the real
  home, gated by `px_intro_seen_v1`; `?intro=1` force-replays) and the earlier
  issue-like home opener was removed. Carries more JS than the near-zero-JS
  articles by design, with a graceful no-JS fallback (scenes stack & scroll,
  `html.js`-gated) + reduced-motion (no auto-advance). The earlier issue-like
  pass (`components/welcome/Beat*.astro`, `RegistrationMark.astro`) is now
  orphaned; `welcome.css` survives only for AccountLine + the About bits.
- **Metered soft signup gate** — `core/ReadingGate.astro`, mounted in
  `issues/[slug].astro`. Anonymous readers get the primer + first 2 sections,
  then a per-topic-themed account wall; the rest is hidden. Soft by design
  (teasers in page source — shareable + indexable), client-side auth via the
  shared non-HttpOnly `sb-<ref>-auth-token` cookie; no-JS / crawlers ⇒ wall
  hidden ⇒ full article (SEO-safe). Intro CTAs now funnel to `app/login?next=`.
  Prefix: `px-gate`.
- **About redesign** — rebuilt as a ~5-section still-frame on the existing
  hero/section rhythm (+ `px-abt`), incl. a six-world type specimen that is now
  one font + colour; colophon credit updated to the trio.
- **App drafts (operator-deployed, not yet wired/active):** `app/src/pages/api/
  join.ts` (Tier-1 unified email → newsletter + magic-link account) and
  `app/src/pages/api/me.ts` (server-confirmed `{ authed }` probe — optional
  robustness upgrade for ReadingGate).
- **New CSS prefix reservations:** `px-intro` + `px-xp` (intro.css), `px-gate`
  (ReadingGate). `px-wj` / `px-abt` remain from the earlier pass.

Verified: `npm run build` exits 0 (34 pages), zero console errors; intro / home
overlay / spotlight tour / signup gate all work; return-visit gating + `?intro=1`
replay work; mobile 375px no horizontal overflow; no-JS + reduced-motion
contracts hold.

### 2026-06-04 — First full editorial run: 6 issues produced + published (in-repo)

Ran the four-phase pipeline (research → draft → stylist → verify) **on Opus
for every phase via the Claude Code route** for one issue per category, then
flipped all six to `status: published`. All build-green (33 pages) and
frontend-verified on the dev server (home/topic/RSS listing, per-issue render,
expand-modal, mobile, console). **Shipped** — the operator committed and pushed these live on 2026-06-04
(Vercel auto-deploy). This code-only session can't commit/push (the repo is
owned by the `user` account, and Vercel only accepts the operator's commit
author), so go-live was the operator's step.

The six (`src/content/issues/2026-06-04-<slug>/`):
- **politics** · `cockroach-janta-party` — "The Ban That Made It *Bigger*"
  (suppression-as-amplification; the §69A IT-Act block of the Cockroach Janta
  Party. Sensitive: CJI Surya Kant's 15 May remark is quoted verbatim and
  always paired with his 16 May clarification; verifier PASS on all nine
  sensitivity checks.)
- **space** · `asteroid-2024-yr4` — "The Asteroid We *Talked* Down" (2024 YR4;
  the rising-then-vanishing impact odds as the signature of a working
  planetary-defense system. trajectory-arc + signal-readout captioned as
  schematics.)
- **earth** · `amazon-tipping-point` — "The Forest Has a Dial, and It *Isn't*
  Temperature" (deforestation, not warming, is the lever.)
- **tech** · `ai-coding-token-bill` — "The Bill Came Due in *April*"
  (price-per-token down, spend-per-task up; Uber's $1,500/mo cap. The
  off-allowlist Goldman projection was cut — rests entirely on Willison.)
- **travel** · `queue-is-the-product` — "The Queue Is the *Product*"
  (Everest/Fuji access priced as the bottleneck; the unverifiable pay-to-skip
  tier was cut; Nepal package labelled "proposed".)
- **sports** · `arsenal-set-piece-title` — "The Title Nobody Could *Watch*"
  (Arsenal's title on lowest xGA + set pieces; counting stats accepted as
  Opta-attributed since Guardian/StatsBomb are uncrawlable.)

Route policy (now in `CLAUDE.md` + `AGENTS.md` §5): the Claude Code route pins
**every** phase to **Opus**; the `scripts/pipeline.config.ts` Sonnet/Opus split
is the API-CLI route only. Dossiers + verification reports live in
`research/<cat>/2026-06-04-*`.

**Bug fixed during publish QA:** `*emphasis*` markers leaked literally into
`<title>`, `og:title`, and RSS item titles (existing issues never used emphasis
in titles, so the path was untested). Added `stripEmphasis()` to
`src/lib/text.ts`, applied in `layouts/IssueLayout.astro`,
`layouts/HomeLayout.astro`, and `pages/rss.xml.ts`. Verified zero asterisk
leaks across all 33 built pages + RSS.

### 2026-06-03 — expand-to-modal + unified viz typography
Two reader-experience passes on the data-viz library:
- **Expand-to-modal** (`core/ExpandModal.astro` + `src/styles/modal.css`, mounted once in
  `IssueLayout`). Every viz card (`.px-viz` / `.vb` / `.tl` / `.tel`) gets a ⤢ button; clicking it
  **portals the live node** into a centred glass modal — the same WebGL context + count-up / Tilt /
  reveal state, enlarged — leaving a same-height placeholder so the reader's scroll position is
  untouched on open and close. WebGL re-fits via a fired `resize`. Esc / backdrop / ✕ close,
  focus-trapped, `aria-modal`, body scroll locked, mobile full-screen, reduced-motion + no-JS safe
  (no buttons without JS). Zero per-component edits (JS-enhanced by root selector).
- **Unified editorial viz typography** (`src/styles/viz-type.css`). One label scale (tokens
  `--viz-fs-*` + `.vz-*` roles) blending the display serif for viz titles/captions with crisp mono +
  tabular figures for axes/values/legends. Refined the shared `.px-viz__cap` (serif caption + mono
  accent unit-chip) / `.px-viz__src` and the globe `.viz3d__label`, then swept all 30 components'
  scoped labels onto the scale (tabular-nums everywhere, serif in-viz titles, paper halos on SVG
  text over busy fills, consistent ink/ink-soft/muted hierarchy). The modal bumps the scale a notch.
- Also in this batch: the WebGL globe was upgraded from a dot-matrix sphere to a real
  **country-outline Earth** (coastlines + borders from `world-atlas` / `topojson-client`, lazy-fetched
  from `public/geo/countries-110m.json`, occluding body + graticule + near-side de-cluttered labels),
  and a component-wide **alignment/label-overlap polish** pass (edge-clip clamps, label de-collision,
  axis alignment, 3D-tilt overflow caps, mobile reflow). Both publication (27 pages) + app builds green.

### 2026-06-03 — 3D / interactive component library (30 kinds)

Built a 30-kind interactive + 3D section-component library in the v2 design
language (5 kinds per world), on top of the completed v2 design match below.
`SECTION_KINDS` in `src/content/config.ts` went 33 → 63; each new kind is
dispatched in `src/components/SectionRenderer.astro` and demonstrated in a new
draft showcase issue. Both projects build green; uncommitted (operator
commits). Architecture detail in `src/components/AGENTS.md` §10; per-kind
`data` shapes for authors in `src/content/issues/_AGENTS.md` §11.

- **4 lazy WebGL globes** — `coalition-orbit`, `orbit-globe`, `data-globe`,
  `route-globe`. Three.js is self-hosted (new `three` dependency) and
  **dynamic-imported** by `src/scripts/viz3d/runtime.ts` (lifecycle) +
  `scenes.ts` (scene builders, keyed by `data-viz3d` type) **only when a
  `[data-viz3d]` mount scrolls into view**. Vite code-splits it into its own
  ~730 KB (≈170 KB gzipped) chunk that never loads on the home page or any
  non-3D issue; the per-page hoisted runtime is ~5 KB. Mounted once per issue
  via the new bundled `core/Viz3DRuntime.astro`. The render loop pauses when
  the mount leaves the viewport and disposes on `pagehide`; device-pixel-ratio
  capped at ≤2.
- **26 CSS-3D / animated-SVG** kinds — perspective / `transform-3d` via the
  shared `.px3d-stage` / `.px3d-tilt` / `.px3d-flip` mechanics in the new
  `src/styles/components-3d.css`, driven by the new vanilla `core/Tilt.astro`
  island (`[data-tilt]` pointer-tilt + `[data-flip-btn]` flip), plus animated
  SVG/canvas readouts. `Viz3DRuntime` + `Tilt` both render once per issue in
  `IssueLayout.astro`.
- **No-JS / `prefers-reduced-motion` contract** (same as Reveal / VizMotion /
  the v2 data-viz): every component renders a static SVG/HTML fallback by
  default; WebGL bails with no canvas and no loop, leaving the fallback;
  reveal-hidden states are `html.js`-gated; reduced-motion resets to the final
  frame. Per-component cosmetic CSS is a scoped `<style>` in each `.astro`
  (unique `px-*` prefix); only the shared 3D mechanics + the `.viz3d` mount
  live in `components-3d.css`.
- **6 showcase issues** — `src/content/issues/2026-06-03-<world>-showcase/index.mdx`,
  one per world, each exercising that world's five new kinds end-to-end. All
  `status: draft` (URL-viewable, unlisted — excluded from the archive + RSS).

### 2026-06-03 — v2 design match completed

Closed out the v2 design port (the 2026-06-02 entry below shipped P0–P5 +
topic indexes; this pass finished the pieces that were deferred or only
partially matched). Markdown-doc sync only here — code already landed.
A separate 2026-06-03 entry below covers the fal.ai illustrator / photo
removal; the two passes are independent.

- **F1 — unified masthead.** The six per-topic mastheads
  (`.px-masthead--<topic>` variants) were replaced by one v2 press-header
  (`core/Masthead.astro` → `.mh`): lens-dot mark + pulse status pill + nav
  (Desks/About/Feed) + Subscribe CTA, identical on every page; the active
  world still comes from `data-topic`. Each world's old masthead register
  microcopy (telemetry orbit / atlas coords / build hash / vol-no / matchday)
  now reads in the per-issue `core/Banner.astro`. `.mh` CSS lives in
  `base.css`; the `.mh*` names are a documented adoption of the kit's names
  (exception to the `px-` prefix rule). This supersedes the 2026-06-02 note
  that the per-topic masthead registers were "kept".
- **F2 — data-viz fully ported.** Every signature chart was rewritten to the
  kit's exact markup + animations (stroke-draw lines, grow bars, scale-pop
  polygon, count-up tiles, the 44-column MP-dot vote chamber, scan sweep) +
  scroll reveals, in a new shared CSS file `src/styles/dataviz-v2.css`
  (imported last in both layouts). 15 components ported to the kit's generic
  class names — VoteResult `.vb`, ApprovalChart `.ac`, PowerMatrix `.pm`,
  Paradox `.px2`, Timeline `.tl`, OrbitTrace `.ot`, LaunchStats `.ls`,
  DataReadout `.tel`, ClimateStrip `.cs`, BenchmarkChart `.bc`, AdoptionCurve
  `.adc`, RouteCard `.rc`, CityCompare `.cc`, LeagueTable `.lt`, PlayerRadar
  `.pr` — inside the shared elevated `.px-viz` card. Eleven components kept
  their `px-` classes (light touch, `data-reveal` only): SeatChart,
  BillBreakdown, BrothersAnalogy, OrbitalShells, CarbonGauge,
  ElevationProfile, RegionMap, CommitGrid, JourneyMap, MatchStatLine.
  Count-up + cursor-warmth now ship in a new vanilla island
  `core/VizMotion.astro` (`[data-countup]` tweens to the value already in the
  HTML; `[data-warmth]` tracks the pointer); reveals run via the existing
  `core/Reveal.astro`. Every reveal-hidden state is `html.js`-gated (no-JS /
  print paint the final state) with matching `prefers-reduced-motion` resets.
- **F3 — openers, hero, toolbar.** Section openers gained the ghost-numeral
  depth echo (`data-n` + a scaled 0.1-opacity `::after`) plus a scroll-in
  rise; `.px-section` is now `data-reveal` (`Section.astro`). Hero clamp
  bumped to `clamp(52px, 7.5vw, 104px)`. A new glass `core/ReadingToolbar.astro`
  (floating bottom pill: reading-progress bar + Full/Skim segmented toggle +
  live % + read time + Save) drives `#px-article[data-mode]` and **replaced
  the now-deleted `core/SkimToggle.astro`** — this closes the one deferred
  item from the 2026-06-02 entry. The Save control (`core/SaveButton.astro`)
  now lives inside the toolbar (the old `.px-reader-controls` row is gone).
  ManifestoStrip on the home page was verified against the kit `.mf-strip`
  (prefix `.px-mstrip`).
- **Inert dead-CSS follow-up.** The old per-component viz CSS in the theme
  files (`.px-vote*`, `.px-appr*`, `.px-pwm*`, `.px-paradox*`,
  `.px-timeline*`, and the old orbit/launch/climate/bench/scurve/route/
  citycompare/ltab/radar blocks) plus the `.px-skim-toggle` / `.px-skim-btn`
  rules in `base.css` are now orphaned (no element emits them). Harmless — no
  override conflict, since the new viz use new class names — but flagged for a
  future safe removal pass.

### 2026-06-03 — Illustrator phase + all raster imagery removed

Scrapped the fal.ai / Flux illustrator phase and every cover photo. The
publication is now fully type- and data-viz-led — zero raster imagery,
no external image service.

- **Pipeline is now `discover → research → draft → stylist → verify`.**
  The illustrator phase (Phase 3.75) is gone. Earlier change-log entries
  below that mention the illustrator phase or the
  `discover → … → illustrator → verify` order describe the pipeline as it
  stood before this date.
- Deleted: `scripts/generate-visual.mjs`, `.claude/agents/illustrator.md`,
  `research/_visual/` (the fal.ai spend ledger), every
  `src/content/issues/*/og-prompt.txt`, and every image under `public/og/`
  (the directory is removed).
- Removed `ogImage:` from all issue frontmatter and dropped the
  `og:image` meta tag, the category-card cover `<img>`, and the
  archive-row thumbnail (the archive grid lost its leading thumbnail
  column). Issue `twitter:card` downgraded from `summary_large_image` to
  `summary`.
- `ogImage` is **kept** in the Zod schema (`src/content/config.ts`) as an
  optional, unused field so any legacy MDX still validates. Nothing sets it.
- Config/scripts: removed the `@fal-ai/client` dependency and the
  `pipeline:illustrator` npm script; dropped the `illustrator` entry from
  `pipeline.config.ts`, `pipeline.ts` (VALID_PHASES, PHASE_TO_AGENT,
  dispatch branch, help text), and `buildIllustratorPrompt` from
  `scripts/lib/prompts.ts`; removed `FAL_KEY` from `.env.example`.
- Docs synced: `AGENTS.md`, `research/AGENTS.md` (and this entry).

### 2026-06-02 — v2 design revamp (Claude Design port, P0–P5 + topic indexes)

Ported the external Claude Design "v2" kit into the codebase (full analysis +
plan in `docs/archive/DESIGN-REVAMP-NOTES.md`). An editorial-modern evolution, adopted
faithfully with controlled customizations. Both projects build green;
**uncommitted** (operator commits). The glass ReadingToolbar is the one
deferred piece.

- **P0 — foundation.** `src/styles/tokens-v2.css` (motion ramp, radii
  `--r-card/-tile/-pill`, glass, columns), `type-v2.css` (unified
  `--font-body`/`--font-mono` across all topics + per-world `--issue-face`
  applied only to banner/hero), `motion-v2.css` + `core/Reveal.astro` — a
  no-JS-safe scroll-reveal mechanism: base state visible, hidden state gated
  behind an `html.js` class set by an inline `<head>` guard. **This fixes the
  export's bug** where reveal targets stayed invisible without JS. Theme files
  stopped overriding body/mono (only `--font-display` per topic remains).
- **P1 — issue shell.** New `core/Banner.astro` (per-world standing plate);
  hero on `--issue-face`; soft rounded primer card; section openers (display
  numeral + gradient rule); pill-numbered sources; rounded accent quotes; CSS
  `@view-transition`. Politics data-viz → elevated `px-viz`-style cards.
- **P3 — data-viz, all topics.** space/earth/tech/travel/sports signature
  components → elevated rounded cards (soft shadow + hover lift). Transparent/
  full-bleed components (region map, climate strip, carbon gauge, player
  radar, scoreline) deliberately left flat. Core `Comparison`/`DataReadout`
  carded in `base.css`.
- **P2 — home + masthead.** Bento `CategoryCard`s (rounded, per-world gradient
  wash, CSS-only cursor warmth, hover lift); archive staggered reveals; new
  `home/ManifestoStrip`, `home/SubscribeStrip` (wraps the existing
  NewsletterForm island), `core/Colophon` (replaces Footer site-wide). Masthead
  gained the accent hairline; the per-topic masthead registers (telemetry/
  coordinate/shell/matchday/postcard/dateline) were **kept** — a brand
  signature the generic kit would have flattened.
- **P4 — topic indexes.** All six `px-*-index` pages onto the new system
  (archive-style reveals, soft elevated empty states, per-topic backdrops
  preserved).
- **P5 — reader features + app.** Reader islands (Save/Reactions/Annotations/
  Letters) → soft corners / pill chips / elevated item cards / pill submits
  (+ fixed a cross-topic hardcoded politics-red bug in ReactionsBar's active
  state). `app/src/styles/app.css` got a motion+radii token subset (no glass/
  issue-face — app stays lighter) + reduced-motion guard. **Moderation queue**
  (`app/.../admin/comments.astro`) → elevated cards + segmented-pill tabs + pill
  risk chips. NewsletterForm left to the SubscribeStrip/Colophon work. No JS/
  auth/CORS touched.
- **Deferred:** glass `ReadingToolbar` (would fold Skim+Save, retire
  SkimToggle) — careful follow-up.
- **Dead code (not pruned):** `topic/TopicManifesto.astro` + `.px-topic-*` in
  `meta.css`/themes are orphaned (live pages use `px-*-index`).
- **Verification:** publication + app builds exit 0; every reveal-hidden rule
  is `html.js`-gated; accent text uses `--accent-deep` on light themes. Visual
  checks (375px, per-topic `data-topic` flip, full WCAG sweep) pending operator
  browser review.

### 2026-06-01 — Letters block (Phase B-6) shipped

**Scope.** End-of-issue reader "Letters" — longer reflections submitted
below each issue, shown publicly once the editor approves them. Letters
reuse the `comments` table (anchor IS NULL) and flow through the
moderation queue shipped earlier the same day, so no moderation work was
needed. Publication + app builds both exit 0.

**Schema.** `app/supabase/migrations/20260601000000_phase_b_letters_author.sql`
adds a nullable `author_name` (≤ 80) to `comments`. Letters need public
attribution, but profiles are RLS-private (`profiles_select_own`) — a
public letters list rendered with the anon/user client cannot read
another reader's `display_name`. So the chosen name is denormalised onto
the comment row at submit time. Append-only, idempotent, no RLS change.
**Operator must apply this migration to prod Supabase** (paste into the
SQL editor) before letters can be submitted — the insert references the
new column.

**API.** `app/src/pages/api/letters/[issueId].ts` mirrors the annotations
endpoint:
- GET (anonymous-friendly): approved letters for the issue, filtered
  `.is('anchor', null)`; signed-in callers also get their own pending
  letters plus `defaultName` (their profile display name, to prefill the
  sign-as field) and `signedIn`.
- POST (auth required): creates a letter with anchor NULL and status
  `pending`. `author_name` uses the submitted value, else the reader's
  own profile display name, else null (UI shows "A reader"). 2000-char cap.

**Publication.** `src/components/core/LettersBlock.astro` is a new
`is:inline` client island (the `px-letter` prefix), mounted in
`src/pages/issues/[slug].astro` after `ReactionsBar`. It lists approved
letters (plus the reader's own pending, marked "In review") and offers a
"write a letter" form: a sign-as name input (prefilled from the profile
when signed in) and a body textarea. Anonymous submit redirects to login
(the button reads "Sign in to write a letter"); a 401 on POST also
redirects. Body rendered as escaped text — no HTML injection.

**Moderation.** Letters appear in `/admin/comments` automatically (the
queue lists all `comments` rows by status; null-anchor rows already
render as "letter"). Approve promotes a letter to public.

**Phase B status.** B-1…B-3, B-5 (capture + moderation), and B-6 are now
complete in code. The only remaining Phase B feature is B-4 (topic
affinity heatmap), gated on ~a week of `reading_events` data. Phase C
(AI explainers + TL;DR) stays blocked until Phase B closes.

**Left uncommitted** for the operator to review and commit from their own
account — this build account is code-only for Parallax (see the
moderation-queue entry below for why).

### 2026-06-01 — Annotations moderation queue UI shipped (Phase B-5 closed in code)

**Scope.** Built the last missing piece of Phase B-5: the moderation
queue UI. The backend (admin helpers + GET/POST endpoints) shipped
2026-05-26; this session added the operator-facing page and the
dashboard entry point. `npm run build` (app) exits 0.

**`app/src/pages/admin/comments.astro` — the queue UI.**
- Double-gated: `requireUser(Astro)` (→ `/login` when signed out), then
  `isAdmin(user)` (→ `/dashboard` when signed in but not on the
  `ADMIN_EMAILS` allowlist). `adminClient()` and `ADMIN_EMAILS` stay
  server-only — never hydrated to the browser.
- Server-renders the list with the service-role client, reusing the
  exact select + ordering of the GET `/api/admin/comments` endpoint
  (`profiles:user_id(email, display_name)` join, oldest-first for
  pending). Reads `?status=` (pending | approved | hidden, default
  pending; `removed` accepted via URL).
- Status filter is plain `<a href="?status=…">` tabs — zero JS.
- Each card shows author email (falls back to display name, then a
  truncated user_id when the profile join is empty), the issue id
  linked to `PUBLIC_SITE_URL/issues/<id>/`, the quoted `anchor.exact`
  selection (Letters with a null anchor are labelled instead), the note
  body, the submitted date, an optional `ai_risk_score` badge (banded
  mid ≥ 30 / high ≥ 60), and an "edited" marker.
- Context-aware actions: pending → Approve + Hide; approved → Hide +
  Reset; hidden → Approve + Reset. The one client script (delegated
  click handler, the SkimToggle-style exception to no-JS) POSTs to
  `/api/admin/comments/<id>`, fades/removes the card on success,
  decrements the count, redirects to `/login` on a 401, and surfaces
  the endpoint's error inline on failure. User text renders as escaped
  plain text (no `set:html`) — no XSS surface.
- Scoped `<style>` block (`mq-` classes) reusing the app token system;
  no `app.css` change needed.

**`app/src/pages/dashboard/index.astro`.** When `isAdmin(user)`, an
eyebrow-level "Admin · Moderation queue →" link to `/admin/comments`
renders above the Account section. Hidden for everyone else.

**`app/src/env.d.ts`.** Declared `ADMIN_EMAILS` on `ImportMetaEnv` for
type hygiene (it was read via Vite's `any` index before).

**`.claude/launch.json`.** Added an `app` dev-server entry (cwd `app`,
port 4322) alongside the existing publication entry, so the preview
tooling can launch app routes.

**Verification.** `npm run build` in `app/` exits 0 — frontmatter, the
moderation query, and the client action script all compile and bundle.
Live request-level verification was **not** possible in this
environment: the dev machine has no Supabase env in `.env.local`, so
`assertEnv` in the middleware returns 500 on every request before
routing, and the page is admin-gated regardless. End-to-end
verification (approve an annotation, confirm it renders publicly)
remains an operator step.

**DEV auth bypass (kept).** This build machine is a different Windows
user / account than the operator's — the repo is owned by `user`, while
this session ran as `ShikharWork`, which has no `.env.local` — and the
only Supabase is production, so local end-to-end verification was
declined to avoid touching prod data. To make local verification
possible later under an env-equipped account, `app/src/middleware.ts`
gained a DEV-only auth bypass: set `DEV_ADMIN_EMAIL` (documented in
`app/.env.example`) and a local `astro dev` session is treated as that
signed-in user. Prod-safe — gated on `import.meta.env.DEV`, so it is
dead-code-eliminated from the build. The change set was left
uncommitted for the operator to review and commit from their own
account; the `ShikharWork` account is treated as code-only for Parallax
(no secrets, no prod DB, no deploys).

**Still pending (operator).** Add `ADMIN_EMAILS=<email>` to the
`parallax-app` Vercel project (Production + Preview) and redeploy —
without it nobody is admin and the queue 403s. Then open
`/admin/comments`, approve a few annotations, and confirm they appear
in the issue's public list.

**Phase B status after this session.** B-1…B-3 plus B-5 (capture +
moderation) are complete in code. Remaining Phase B: B-6 Letters block
(reuses the `comments` table) and B-4 topic affinity heatmap (waiting
on ~a week of `reading_events` data). Phase C (AI explainers + TL;DR)
stays blocked until Phase B closes.

### 2026-05-26 — Phase A complete + most of Phase B shipped + Claude Design brief

**Scope of this session.** Started with the Phase A scaffold landing
(separate `app/` Astro SSR project, Supabase + Resend + Vercel). Ended
with a functioning reader-account product: auth, dashboard, newsletter,
privacy + terms routes, save-for-later, reactions, reading-event
tracking, and the capture half of annotations. Also committed the
external Claude Design brief and started the moderation queue (API
done, UI page pending).

#### Phase A — shipped end-to-end

**Auth.** Magic-link + Google OAuth via Supabase. Login page at
`app.parallaxlens.com/login` uses the browser Supabase client; callback
at `/auth/callback` exchanges the code for a session. Sign-out at
`/api/auth/signout`. Session cookie scoped to `.parallaxlens.com` so
both subdomains share it.

**Dashboard.** `/dashboard` shows the user's display name + email +
member-since date, saved-issues list (Phase B integration), email
prefs toggles (`/api/account/prefs`), and an account-deletion form
(`/api/account/delete` — PDPDP / GDPR compliant: hard-delete within 30
days, soft-deletes the newsletter row to preserve consent audit).

**Newsletter.** Anonymous footer signup form on the publication
(`NewsletterForm.astro`) POSTs to `app.parallaxlens.com/api/subscribe`.
Double opt-in: a confirmation token is stored, an email is sent via
Resend, the user clicks the link, `/api/subscribe/confirm` flips
`confirmed_at`. Resend is wired as the SMTP provider for Supabase auth
emails too (magic-link from `noreply@parallaxlens.com`).

**Privacy + Terms.** Manually drafted at `src/content/guides/privacy.mdx`
and `terms.mdx`. New `guides` content collection in
`src/content/config.ts`. Dynamic route at
`src/pages/about/[guide].astro` renders with publication typography.
Covers GDPR, CCPA, CalOPPA, and India's DPDP Act 2023. Each named
service (Supabase, Resend, Vercel, Cloudflare, Google OAuth, Anthropic,
fal.ai) declared explicitly. Termify's auto-generator was rejected for
shipping clauses that contradicted the brand promise (advertising
sharing, Facebook audience targeting).

**Footer.** Updated to include the newsletter signup component +
Privacy + Terms + Account links.

#### Phase B — three of six features shipped, fourth in progress

**B-1 Reactions.** `app/supabase/migrations/20260524100000_phase_b_reactions.sql`
created the `reactions` table (composite PK on user_id/issue_id/kind,
RLS owner-only). Four kinds: `think`, `agree`, `disagree`, `want_more`.
Multi-select per issue. `/api/reactions/[issueId]` GET (returns user's
kinds + aggregate counts when total ≥ 3) + POST (toggle).
`src/components/core/ReactionsBar.astro` is the client island —
restrained editorial register, no emoji, optimistic toggle, anon → login
redirect.

**B-2 Save-for-later.** `saved_issues` table already existed from
Phase A. `/api/save/[issueId]` GET + POST (toggle) + DELETE.
`src/components/core/SaveButton.astro` client island next to the
SkimToggle. Bookmark-outline SVG with accent-fill on saved state.
Dashboard already displays saved issues from the table.

**B-3 Reading-event tracking.**
`app/supabase/migrations/20260524200000_phase_b_reading_events.sql`
created the `reading_events` table (composite of user_id-or-anon_id +
issue_id + event_kind + meta jsonb, partitioning deferred until row
count > 5M). Seven event kinds: `open`, `scroll_25`, `scroll_75`,
`finish`, `share`, `source_click`, `term_lookup`. Indexed for per-issue
aggregation, per-user history, per-anon-id history, per-kind aggregates.
`/api/events` POST validates and inserts via admin client (bypasses RLS;
endpoint enforces user_id-vs-anon_id consistency). RLS still in place
as defence-in-depth.

`src/components/core/ReadingTracker.astro` is the invisible client
island: fires `open` after 500ms dwell, `scroll_25`/`scroll_75` on
scroll progress through the article, `finish` via IntersectionObserver
on a sentinel at the end, `source_click` via delegated click listener
on `.px-sources` links, `share` via `navigator.share` patch + custom
`parallax:share` event. Anonymous tracking via `px_anon_id` cookie
(UUID v4, 90-day, scoped to `.parallaxlens.com`). Network failures
silent — analytics never break the reader's experience.

**B-5 Annotations (capture half).**
`app/supabase/migrations/20260524300000_phase_b_comments.sql` created
the unified `comments` table that handles both annotations (with
anchor JSON) and Letters (without anchor). Anchor uses W3C
TextQuoteSelector subset: `{ exact, before, after, section_index? }`.
Statuses: `pending` (default), `approved` (editor promoted, public),
`hidden`, `removed`. AI risk score column reserved for Phase B
moderation polish.

`/api/annotations/[issueId]` GET (returns own pending + everyone's
approved, RLS-enforced) + POST (create, body capped at 2000 chars).
`src/components/core/AnnotationLayer.astro` is the most complex client
island built so far:
- Listens for text selection inside `#px-article`
- Shows a floating "+ Margin note" popover above the selection
- Click → modal editor opens with the quoted selection at top
- Save → POST → row appears in the bottom annotations list
- Existing annotations rendered as a list at the article's reflective
  end, between ReactionsBar and the bottom back-to-desk link
- Anonymous users get redirected to login

**B-5 part 2 — moderation queue, in flight.**
Built but not finished this session:
- `app/src/lib/admin.ts` — `isAdmin(user)` + `requireAdmin()` helpers
  reading the `ADMIN_EMAILS` env var (comma-separated allowlist,
  lowercased before compare). Throws 401/403 Response objects.
- `app/.env.example` — `ADMIN_EMAILS` declared
- `app/src/pages/api/admin/comments.ts` — GET endpoint listing
  comments filtered by status (default pending, oldest-first), joined
  with author profile email + display name
- `app/src/pages/api/admin/comments/[id].ts` — POST endpoint accepting
  `{ action: 'approve' | 'hide' | 'reset' }`, admin-only, uses
  service-role client

Pending in next session:
- `/admin/comments` page UI rendering the queue with approve/hide buttons
- Dashboard surface showing an "Admin → moderation queue" link to admin
  users only
- `ADMIN_EMAILS` env var setup in Vercel (operator action)
- Once UI lands: the editor can promote private annotations to public.
  Public margin-note rendering already works because the existing GET
  `/api/annotations` returns approved rows to everyone, and
  AnnotationLayer.astro renders them.

#### Cross-cutting fixes shipped during the session

**ws (WebSocket) workaround for Node 20 + @astrojs/vercel v7.** The
`@supabase/realtime-js` client refuses to construct without a
WebSocket implementation. Node 22 has native WebSocket; Node 20
doesn't. `@astrojs/vercel@7` supports Node 18 / 20 only, so we pinned
the app/ project to Node 20 via `engines: "20.x"` and added `ws` as a
runtime dep. `serverClient()` and `adminClient()` pass
`realtime: { transport: ws as any }`. Future cleanup: upgrade app/ to
Astro 5 + `@astrojs/vercel@8` to drop `ws`.

**Env var contamination defence.** A pasted-with-newlines Vercel env
var (the service-role JWT got duplicated three times across line
breaks) caused cryptic `Headers.set` errors. `assertEnv()` in
`app/src/lib/supabase.ts` now rejects values containing `\n` / `\r`
or leading/trailing whitespace with a clear startup error.

**Cross-subdomain redirect allowlist.** `safeNextPath()` was treating
`/issues/...` as relative-to-current-host, causing post-Google-login
redirects from the app subdomain to land on `app.parallaxlens.com/issues/...`
(404). Now accepts absolute URLs whose origin is on an allowlist
(`parallaxlens.com`, `www.`, `app.`, localhost variants). SaveButton
and ReactionsBar now pass `window.location.href` (full URL) as the
`next` param.

**No-store cache on app subdomain.** Middleware sets
`Cache-Control: private, no-store, max-age=0` on all responses from
the app so the back button after sign-out doesn't show the cached
dashboard. (BFcache is still a known gap — addressed by `pageshow`
listener in a future polish session.)

#### External: Claude Design brief committed

`docs/archive/CLAUDE-DESIGN-BRIEF.md` captures the verbatim brief submitted to
Claude Design covering: company blurb, current-state self-assessment
(generic-looking, text-heavy → wants visual-heavy editorial polish),
typography expectations, logo + identity system request, hero / banner
proposals, design craft expectations (modern but editorial-modern, not
SaaS-modern), and the full list of dynamic component design asks
(annotated photographs, comparative scrollers, networked diagrams,
sequence flipbooks). This is now canonical — when Claude Design
proposals come back, they're translated into Astro components
following the rules at `src/components/AGENTS.md`.

#### Files added or modified this session

**Migrations applied to production Supabase:**
- `app/supabase/migrations/20260524000000_phase_a_foundation.sql`
- `app/supabase/migrations/20260524100000_phase_b_reactions.sql`
- `app/supabase/migrations/20260524200000_phase_b_reading_events.sql`
- `app/supabase/migrations/20260524300000_phase_b_comments.sql`

**App subdomain (`app/`):**
- All Phase A pages: login, auth/callback, dashboard, api/auth/signout,
  api/account/prefs, api/account/delete, api/subscribe, api/subscribe/confirm
- Phase B endpoints: api/save/[issueId], api/reactions/[issueId],
  api/events, api/annotations/[issueId]
- Moderation endpoints (UI pending): api/admin/comments, api/admin/comments/[id]
- lib/auth.ts (requireUser, safeNextPath), lib/admin.ts (isAdmin)
- middleware.ts (session + no-store cache header)
- layouts/AppLayout.astro
- styles/app.css

**Publication (`src/`):**
- New client islands: SaveButton.astro, ReactionsBar.astro,
  ReadingTracker.astro, AnnotationLayer.astro, NewsletterForm.astro
- Updated Footer.astro (newsletter + privacy + terms + account links)
- Updated [slug].astro (controls row, finish sentinel, ReadingTracker,
  AnnotationLayer, ReactionsBar)
- New dynamic route: `src/pages/about/[guide].astro`
- New content collection: `guides` in `src/content/config.ts`
- Content: `src/content/guides/privacy.mdx`, `terms.mdx`

**Docs:**
- `docs/CLAUDE-DESIGN-BRIEF.md` (new — design brief; archived 2026-09-01)
- `docs/PROJECT.md` (this entry)
- `app/AGENTS.md`, `src/components/AGENTS.md` (refreshed elsewhere this
  session)

#### Operator actions performed during the session

1. Created Supabase project, Resend account, Google OAuth client,
   Iubenda → swapped to Termify → swapped to manual drafts.
2. Configured Cloudflare DNS (`app.parallaxlens.com` CNAME, Resend
   verification records, Cloudflare Email Routing for
   `privacy@parallaxlens.com`).
3. Added Vercel project for `app/` (root directory = `app`, Node 20.x).
4. Pasted env vars into Vercel (correctly after one
   newline-contamination round-trip).
5. Configured Supabase: SMTP via Resend, redirect URL allowlist
   including `https://app.parallaxlens.com/auth/callback`.
6. Applied four SQL migrations via Supabase SQL editor.
7. Switched local DNS resolver to `1.1.1.1` to bypass ISP negative-cache
   on the new app subdomain.
8. Filled the Claude Design setup form (company blurb + brief).

#### What's deliberately deferred (still in the queue)

**Phase B remaining:**
- B-5 part 2 finish: `/admin/comments` UI page + dashboard admin link +
  `ADMIN_EMAILS` env var setup. APIs and helpers already shipped.
- B-4 Topic affinity heatmap: Supabase scheduled function aggregating
  `reading_events` → `profiles.topic_affinity`, dashboard heatmap
  visualisation. Naturally fits after a week of real reading-event data.
- B-6 Letters block: end-of-issue Letters form (reuses `comments`
  table). Same moderation queue covers it.
- AI pre-moderation on new annotations / Letters: Haiku-tier 0-100
  toxicity score, stored in `comments.ai_risk_score`.

**Phase A polish, deferred:**
- BFcache fix (back-button after sign-out): `pageshow` event listener
  with `event.persisted` check, force reload.
- Google consent screen branding (currently says "Sign in to
  cpzzfszkkkcztyvdmtvs.supabase.co" — fix is Supabase Pro custom auth
  domain ~$10/mo, or accept).
- Account deletion end-to-end live test (UI shipped, never live-tested).
- Email prefs end-to-end live test (UI shipped, never live-tested).

**Phases C / D / E not started:**
- C: Inline explain-term tooltips (pre-gen), per-issue TL;DR (pre-gen),
  templated "why this matters to you" line.
- D: Per-issue AI Q&A sidebar with RAG over dossier + sources, rate-
  limited per user.
- E: Newsletter v2 — weekly digest with personalised section, per-issue
  publish push, re-engagement flows.

#### Spend tally (rough)

- Anthropic API (illustrator agent run × 1 issue): ~$1.20
- fal.ai (6 issue covers across earlier illustrator session): ~$0.24
- Vercel: $0 (both projects on free tier)
- Supabase: $0 (free tier — Pro upgrade triggered around B-4 deployment
  when reading_events ramps)
- Resend: $0 (free tier 3k/month sends)
- Cloudflare: $0 (DNS + Email Routing free)
- Iubenda / Termify: rejected; not paid

#### Pipeline order (publication editorial pipeline, unchanged)

`discover → research → draft → stylist → illustrator → verify →
(human audit) → publish`

The agent pipeline is independent of the reader-account work — they
share the same repo but no code overlap. Reading-event tracking flows
into Supabase, never into the editorial pipeline.

---

### 2026-05-24 — Commercialisation roadmap approved + Phase A scaffold

**What.** Editorial direction shifted: Parallax adds a reader-account
layer to enable email lead-gen, lightweight community (annotations +
letters, not Disqus threads), AI-augmented reading (inline explainers,
TL;DR, per-issue Q&A sidebar), and a "Your Parallax" dashboard. Free
forever in v1, no paywall. ~5-month roadmap across Phases A–E.

**Architectural decision (single most consequential).** The publication
at `parallaxlens.com` stays **pure-static Astro, `output: 'static'`**.
A separate Astro SSR project at `app.parallaxlens.com` (this repo's
new `app/` subdirectory) hosts auth, the dashboard, and `/api/*`. The
publication is unchanged structurally — interactive elements arrive
only as small client islands that call the app subdomain.

Reasoning: hybrid mode would put 30+ hours of per-topic theming work
behind a serverless function for every issue request. The split keeps
the publication on the free Vercel static edge and lets the app be
torn down or rebuilt without touching it.

**Phase A scaffold landed this session:**

| File | Status |
|---|---|
| `app/package.json` | new — Astro SSR + Supabase + Resend + Vercel adapter |
| `app/astro.config.mjs` | new — `output: 'server'` |
| `app/tsconfig.json` | new |
| `app/.env.example` | new — Supabase + Resend env template |
| `app/src/env.d.ts` | new — typed env vars |
| `app/src/lib/supabase.ts` | new — browser / server / admin client factories |
| `app/src/pages/index.astro` | new — placeholder landing |
| `app/src/pages/api/health.ts` | new — health check |
| `app/supabase/migrations/20260524000000_phase_a_foundation.sql` | new — profiles, saved_issues, newsletter_subscriptions tables with RLS |
| `app/AGENTS.md` | new — subtree agent guide |
| `app/README.md` | new |
| `docs/COMMERCIALISATION-SETUP.md` | new — operator setup checklist (Supabase / Resend / Iubenda / DNS) |
| `AGENTS.md` (root) | edit — subtree reference for `app/` |

`npm install && npm run build` inside `app/` both pass. The scaffold
boots; auth + dashboard pages land in subsequent sessions once the
operator finishes the setup checklist at
`docs/COMMERCIALISATION-SETUP.md`.

**Brand-restraint guarantees (codified in the approved plan):**
- Publication URLs never change. `/issues/<slug>/` is contractual.
- The article page is unchanged visually. New reader interactions
  attach as small client islands, never disrupt the hero / sections /
  sources composition.
- No third-party trackers. Ever. All reading events first-party.
- No popups, no engagement-bait modals, no paywall gates.
- RSS contract preserved.
- Editorial pipeline unchanged.

**UX principles (operator-mandated, gate every phase):** white-space
discipline; sign-up ≤ 3 screens; empty states in editorial voice;
guides at `/about/how-to-read` and `/about/your-parallax`; no
Disqus-style threads (annotations on sentences + end-of-issue
Letters); ≤ 30 KB client JS on issue pages; Lighthouse ≥ 95
publication / ≥ 90 app.

**Next operator action.** Complete Stages 0-3 of
`docs/COMMERCIALISATION-SETUP.md` (account creation + DNS). Then we
proceed to Phase A coding: auth flows, dashboard pages, newsletter
form.

---

### 2026-05-20 — Illustrator phase + visual mode library + agent docs

**What.** Two deliverables: a new pipeline phase that generates per-issue
OG cover imagery via fal.ai (Flux 1.1 Pro), and a consolidated
agent-documentation layer at the repo root.

**Illustrator phase.**

New pipeline phase between stylist and verify. Reads the dossier + the
stylist-rewritten draft + a new visual mode library, picks one of six
visual modes via a Decision Tree, writes a structured prompt to
`src/content/issues/<slug>/og-prompt.txt`, calls a deterministic Node
generator (`scripts/generate-visual.mjs`) exactly once, saves
`public/og/<slug>.png` at 1216×640 (Flux's nearest legal dimension to
the OG 1200×630 standard), and updates the issue's `ogImage:`
frontmatter so `IssueLayout.astro`'s existing `<meta property="og:image">`
and Twitter `summary_large_image` tags resolve.

Cost protection has three independent layers: one fal.ai call per
script invocation (no loop); a daily $2.00 cap enforced via
`research/_visual/ledger.jsonl`; and the agent system prompt forbids
retries.

| File | Change |
|---|---|
| `research/_voice/visual-mode-library.md` | new — 6 modes (AERIAL DIAGRAM / SINGLE OBJECT STILL / ARCHIVAL DOCUMENT / TYPOGRAPHIC GRID / MONOCHROME PORTRAIT / GEOMETRIC ABSTRACTION), Decision Tree, brand constants, 8-item visual AI-tell catalog, per-mode pattern cards, QR cards |
| `.claude/agents/illustrator.md` | new — system prompt enforcing "exactly one generator call per run" |
| `scripts/generate-visual.mjs` | new — deterministic single-call generator with `--dry-run`, `--force`, daily cap, retry-once on 5xx |
| `scripts/pipeline.ts` | edit — added `'illustrator'` to VALID_PHASES, PHASE_TO_AGENT, dispatch branch |
| `scripts/pipeline.config.ts` | edit — added `illustrator: 'claude-opus-4-1'` |
| `scripts/lib/prompts.ts` | edit — added `buildIllustratorPrompt` |
| `package.json` | edit — added `pipeline:illustrator` script + `@fal-ai/client` dep |
| `.env.example` | edit — added `FAL_KEY` placeholder + comment |
| `public/og/.gitkeep` | new — output directory |
| `research/_visual/.gitkeep` | new — ledger directory |

**Agent documentation layer.**

| File | Change |
|---|---|
| `AGENTS.md` (root) | new — universal entry point, 250+ lines, agents.md convention |
| `CLAUDE.md` (root) | new — Claude-Code-specific notes, `@./AGENTS.md` import |
| `src/content/issues/_AGENTS.md` | new — schema fields, primer/skimCaption rules, build errors. Underscore prefix because Astro's content collection would otherwise treat it as an issue entry |
| `src/components/AGENTS.md` | new — section-kind → component map, CSS prefix reservations, SVG conventions |
| `research/AGENTS.md` | new — pipeline phases, source allowlist convention, voice + visual canon pointers |

**Pipeline order is now:**
`discover → research → draft → stylist → illustrator → verify → (fix) → publish`

---

### 2026-05-04 — Stylist agent + voice system shipped; El Niño earth issue published

**What.** Two deliverables: a complete rhetorical voice system (mode library +
stylist pipeline agent), and the first earth category issue published end-to-end.

**Voice system — `research/_voice/mode-library.md` (890 lines).**

A canonical reference for the stylist agent (and future editors) containing
8 rhetorical modes, each with: sentence rhythm recipe, opening templates,
lexical defaults, pronoun policy, signature moves, reference quotes (≤15w),
failure modes, and a Quick-Reference Pattern Card for agent runtime use.

| Mode | When to use |
|---|---|
| AWE | Scale, deep time, marvel of mechanism — Sagan/Attenborough/Tyson register |
| CONVERSATIONAL EXPLAINER | Step-by-step mechanism the reader must infer — Harris/Oliver register |
| CALM-STRUCTURAL | Naming structural cost; scene → civilization pivot — Ravish Kumar register |
| SATIRICAL EXPOSURE | Institutional contradiction exposed by its own data — Oliver/Last Week Tonight |
| DRY WIT | Mismatched register; bureaucratic precision as deadpan — Economist/Bourdain |
| INVESTIGATION | Anomaly observation, evidence assembly — Morris/Wright Thompson register |
| FORENSIC | Mechanism with human stakes, staccato precision — Bourdain/Attenborough |
| LYRICAL COMPRESSION | Closer or single emotional landing — Akhtar/Iyer/Ondaatje register |

Mode-blending rules: one dominant mode per section; at most 1 Satirical +
2 Lyrical per issue; 4–6 modes per issue. Decision Tree and mode allocation
table included for agent runtime use.

**Stylist pipeline agent — `.claude/agents/stylist.md`.**

New pipeline phase (3.5, between draft and verify). Agent reads the mode
library, assigns one mode per section using the Decision Tree, rewrites
`intro:` fields + `prose` paragraphs + `quote` followups in the assigned
mode pattern. Uses `Edit` tool for surgical YAML-safe field replacements.
Preserves every number, name, date, verbatim quote, and all structured
data fields exactly.

**Files added / modified:**

| File | Change |
|---|---|
| `research/_voice/mode-library.md` | 890-line canonical voice reference — 8 modes, decision tree, QR cards |
| `.claude/agents/stylist.md` | Stylist agent — mode assignment + prose rewriting |
| `scripts/pipeline.config.ts` | Added `stylist: 'claude-opus-4-1'` model assignment |
| `scripts/lib/prompts.ts` | Added `findIssueByTopic()` + `buildStylePrompt()` |
| `scripts/pipeline.ts` | Added `'stylist'` to `VALID_PHASES`, `PHASE_TO_AGENT`, and phase handling |
| `package.json` | Added `pipeline:stylist` script |

**Test run on El Niño issue:** `npm run pipeline:stylist earth` — 6m 40s,
$1.80, 11 fields rewritten. Mode blend: INVESTIGATION → FORENSIC → FORENSIC →
AWE → CONVERSATIONAL EXPLAINER → FORENSIC → CALM-STRUCTURAL → LYRICAL.
Key moves: `"A question lives underneath both announcements"` (Investigation
opener); `"It is the shape of the record."` (AWE plain-noun close on
climate-strip); `"The reservoir is the disease. It has only one direction."`
(Lyrical compression closer).

**El Niño issue published — first earth category issue.**

`/issues/2026-05-03-el-nino-new-floor/` — *The Pacific That No Longer Resets*.
Full pipeline: discover (earth C-04) → research → draft → stylist → verify
→ fix → publish. 8 sections, 13 sources, climate-strip with 57 data points
(1970–2026, Berkeley Earth / Copernicus ERA5). Structural argument: La Niña
years now land warmer than El Niño years of a decade earlier; 91% of excess
heat in oceans prevents any reset; the staircase has only one direction.

**CSS bug fixed (shared component layout):**
`base.css` lacked layout rules for `px-prose`, `px-compare`, `px-readout` —
those rules existed only in `space.css` scoped to `[data-topic="space"]`. Any
non-space issue using these components rendered without layout CSS. Fixed by
moving topic-agnostic rules into `base.css` with responsive breakpoints.

**Pipeline order is now:**
`discover → research → draft → stylist → verify → (fix) → publish`

---

### 2026-05-03 — API-direct pipeline CLI built and smoke-tested

**What.** Replaced `/pipeline-<phase>` slash commands with `npm run pipeline:<phase> <category>` scripts that bill to `ANTHROPIC_API_KEY` instead of the Claude Pro token budget.

**Files added / modified:**

| File | Change |
|---|---|
| `scripts/pipeline.ts` | CLI entry point — validates args, force-loads `.env.local`, runs agent, prints cost + duration |
| `scripts/pipeline.config.ts` | Model assignments: Sonnet for discovery/researcher/verifier, Opus for drafter |
| `scripts/lib/agent-loader.ts` | Parses `.claude/agents/<name>.md` YAML frontmatter |
| `scripts/lib/runner.ts` | Claude Agent SDK wrapper — streams tool calls, captures `total_cost_usd` |
| `scripts/lib/prompts.ts` | Prompt builders with resolved file paths per phase |
| `scripts/README.md` | Operator guide — workflow, cost table, troubleshooting |
| `package.json` | Added 5 pipeline scripts + `@anthropic-ai/claude-agent-sdk`, `dotenv`, `tsx` deps |
| `.env.example` | Added template with placeholder key and setup instructions |
| `.gitignore` | `scripts/_*.md` rule for scratch notes |

**Key engineering notes:**
- `loadEnvLocal()` manually reads `.env.local` with `readFileSync` and
  force-sets `process.env[key]` — required because Claude Code injects its
  own `ANTHROPIC_API_KEY` session token, which `--env-file` and `dotenv.config()`
  both refuse to override.
- `dotenv@17` is actually dotenvx (rebranded); `config()` loaded 0 variables.
  Avoided entirely.
- JSDoc `*/` inside a `/** */` block closes the comment (e.g. the path
  `issues/*/index.mdx` must be written as `issues/<slug>/index.mdx` in a JSDoc).

**Smoke test:** `npm run pipeline:discover earth` — 5m 9s, $1.23, wrote
`research/earth/2026-05-03-candidates.md` with 7 valid candidates. Earth
discovery is the first step of the active pipeline run.

**Cost comparison:** Full 6-category run (all 4 phases) ≈ $26–70 API vs.
2–4 hours of Pro 5-hour usage window. ~98% of token cost moves off Pro.

---

### 2026-05-03 — 11 new signature components across all 6 categories

**What.** Component library expanded to full coverage — every category now
has 3+ signature section kinds for visual storytelling.

**New section kinds (registered in `config.ts` + wired in `SectionRenderer.astro`):**

| Kind | Component | Category |
|---|---|---|
| `approval-chart` | `topic/politics/ApprovalChart.astro` | politics |
| `power-matrix` | `topic/politics/PowerMatrix.astro` | politics |
| `orbit-trace` | `topic/space/OrbitTrace.astro` | space |
| `launch-stats` | `topic/space/LaunchStats.astro` | space |
| `carbon-gauge` | `topic/earth/CarbonGauge.astro` | earth |
| `benchmark-chart` | `topic/tech/BenchmarkChart.astro` | tech |
| `adoption-curve` | `topic/tech/AdoptionCurve.astro` | tech |
| `route-card` | `topic/travel/RouteCard.astro` | travel |
| `city-compare` | `topic/travel/CityCompare.astro` | travel |
| `league-table` | `topic/sports/LeagueTable.astro` | sports |
| `player-radar` | `topic/sports/PlayerRadar.astro` | sports |

**CSS added:** `.px-appr*` + `.px-pwm*` in `politics.css`; `.px-ortrace*` +
`.px-launch*` in `space.css`; `.px-cgauge*` in `earth.css`; `.px-bench*` +
`.px-scurve*` in `tech.css`; `.px-route*` + `.px-ccomp*` in `travel.css`;
`.px-ltab*` + `.px-radar*` in `sports.css`.

**Bugs fixed during verification:**
- `CityCompare` build error — `Expected ")" but found "{"` because two
  sibling `<tr>` elements in `.map()` lacked a `<>...</>` Fragment wrapper.
- `PlayerRadar` label clipping — "Big matches", "Strike Rate" were cut off.
  Fixed: added `overflow: visible` to `.px-radar__svg` + `padding: 0 56px`
  to `.px-radar__wrap` in `sports.css`.
- `OrbitTrace` label clipping — GEO orbit labels extended beyond 580px
  viewBox. Fixed: redesigned to a fixed right column at `W * 0.76` with
  dashed connector lines from each orbit's right ansa.

**Test fixtures:** 6 draft issues at `src/content/issues/2026-05-03-*/`
verified all 11 components + the earlier `region-map` and `climate-strip`
components. Build: 17 pages / 3.25 s, 0 errors.

**SVG conventions expanded** — overflow:visible+padding pattern, fixed-column
label pattern, and CSS prefix isolation rule all documented in §6.

### 2026-05-03 — ClimateStrip CSS class collision fixed

**What.** `ClimateStrip.astro` was using CSS class prefix `.px-strip` which
is also used by the `TopicStrip` navigation component in `meta.css`
(`display:flex`). This caused the climate bars to render in a broken
3-column flex layout instead of the intended stacked year rows.

**Fix.** All `px-strip*` class names in `ClimateStrip.astro` and in the
`earth.css` climate-strip section renamed to `px-cstrip*`. The note is
now codified in §6 (CSS class prefix isolation) and in the component
expansion plan so future components avoid the same collision.

### 2026-05-03 — region-map component (Earth) — v1 + v2 redesign

**What.**
- New `region-map` section kind registered in `SECTION_KINDS` and
  `SectionRenderer.astro`.
- `src/components/topic/earth/RegionMap.astro` — build-time choropleth
  world map using `d3-geo` + `world-atlas`. Runs in Node at build time,
  emits static inline SVG. Zero runtime JS.
- v1 shipped: 177 paths (110m), basic 5-swatch HTML legend, ocean fill.
- v2 redesign (same session, after visual review):
  - Switched to Natural Earth 50m (241 paths, sharper coastlines)
  - Ocean: radial gradient (light centre → deeper rim) + SVG water
    ruling pattern for engraving texture
  - Countries: two-pass render with CSS `drop-shadow` filter for
    raised-land depth effect
  - Zone labels: Cormorant Garamond uppercase, white fill + dark halo
    via `paint-order: stroke`
  - Markers: redesigned with accent ring + dot, JetBrains Mono labels
  - Legend: moved inside SVG as cartographic box (lower-left,
    semi-transparent parchment bg, italic title, smooth linear-gradient
    ramp, mono axis labels)
  - Removed white frame box — SVG `background: transparent`, sits
    flush on page background
  - CSS: removed `.px-map__frame`, `.px-map__legend` HTML wrappers;
    all styling now lives in SVG attributes or minimal CSS
- Dev fixture: `src/content/issues/2026-05-03-earth-map-test/` (status:
  draft — not public, used for visual verification)
- New devDependencies: `d3-geo`, `topojson-client`, `world-atlas`,
  `@types/d3-geo`, `@types/topojson-client`, `@types/topojson-specification`
- SVG component conventions documented in §6.

### 2026-05-02 — Full pipeline run: *The Protection That Erases* published

**What.** First end-to-end pipeline run across all 4 phases. Issue C-03
(Transgender Persons Amendment Act 2026 ratchet — NALSA 2014 → 2019 Act
→ 2026 Amendment) discovered, researched, drafted, and verified.

- **Phase 4 run:** `/pipeline-verify politics` on
  `src/content/issues/2026-05-02-transgender-ratchet/index.mdx`. Verdict:
  **NEEDS REVISION** (47 ✅ verified, 4 ⚠️ flagged, 0 ❌ blocked).
- **Three fixes applied before publish:**
  1. Timeline Mar 30 note: "Two days later" → "Three days later" (Mar 30 →
     Apr 2 = 3 days; prose section had it right, timeline was contradicting)
  2. Mar 24–25 note: clarified voice-vote attribution to Sansad.in,
     resolving the dossier's [UNVERIFIED] flag
  3. Paradox intro: deleted meta-commentary sentence "The tension is
     structural, not rhetorical."
- Verification report at
  `research/politics/2026-05-02-transgender-ratchet-verification.md`.
- `status: draft → published`. Third Parallax issue live on parallaxlens.com.

### 2026-05-02 — Git workflow rules + author config fixed

**What.** Vercel Hobby plan blocked a deploy because the commit author
identity didn't match the `shikharsumantech14` GitHub account.

**Fix.** `git config user.email` set to match shikharsumantech14's GitHub
account email.

**New workflow rules (in effect from this session):**
- Claude commits only — never pushes. Editor pushes manually (`git push`).
- Commit messages have no `Co-Authored-By` trailer.

### 2026-05-02 — Phase 4 verifier agent built

**What.**

- `.claude/agents/verifier.md` — verifier subagent. Performs claim-by-claim
  audit of draft issues: extracts every date, number, named actor, legal
  claim, quote, and event; traces each to the dossier; marks ✅ VERIFIED /
  ⚠️ IMPRECISE / ❌ UNTRACED. Runs voice audit (flags advocacy, rhetorical
  questions, passive filler, wire tone, speculation, meta-commentary) and
  schema check. Outputs a structured verification report. Hard verdict:
  APPROVED / NEEDS REVISION / BLOCKED.
- `.claude/commands/pipeline-verify.md` — `/pipeline-verify <category>`
  slash command. Finds draft issue + dossier, spawns verifier subagent,
  relays verdict to editor.
- Pipeline diagram in §3.7 updated to show Phase 4 complete.

### 2026-05-02 — Phase 3 drafter agent built

**What.**

- `.claude/agents/drafter.md` — drafter subagent. Reads the dossier,
  the content schema, the issue template, and both published issues for
  voice reference. Writes a complete MDX issue file with `status: draft`.
  Hard rules: facts from dossier only, verbatim quotes only, registered
  section kinds only, no `author` field, YAML-safe strings, flags any
  [UNVERIFIED] dossier items with `# EDITOR: verify before publish`.
- `.claude/commands/pipeline-draft.md` — `/pipeline-draft <category>`
  slash command. Finds the most recent dossier, confirms
  `status: ready-for-draft`, spawns the drafter subagent.
- Pipeline diagram in §3.7 updated to show Phase 3 complete and add
  "YOU REVIEW DRAFT" human gate between draft and verify.

### 2026-05-02 — Phase 2 researcher agent built + first pipeline-discover run

**What.**

1. **`/pipeline-discover politics` run successfully.** First real
   pipeline validation. Agent surfaced 6 candidates from 11 allowlisted
   sources using 16 search queries. Output at
   `research/politics/2026-05-02-candidates.md`. C-03 (*The Protection
   Act That Criminalized Identity* — Transgender Amendment 2026 ratchet
   from NALSA 2014) chosen. C-02 (Bengal voter deletion machine) queued
   for next week.

2. **Phase 2 researcher agent scaffolded.** Three new files:
   - `.claude/agents/researcher.md` — researcher subagent. Reads the
     chosen candidate, deeply verifies all facts against allowlisted
     primary sources, finds verbatim quotes, proposes section structure,
     writes a structured dossier. Hard rules: mark [UNVERIFIED] rather
     than silently drop, verbatim quotes only, no draft prose.
   - `.claude/commands/pipeline-research.md` — `/pipeline-research
     <category>` slash command. Finds the chosen candidate, spawns
     the researcher subagent, relays the dossier path + summary.
   - `research/_templates/dossier.md` — output shape contract for the
     dossier: structural argument, timeline, key facts & data, key
     quotes, primary source documents, suggested issue structure,
     bibliography, researcher notes.

3. **Both published issues confirmed live** on parallaxlens.com.
   Kessler Cascade flipped to `status: published`.

### 2026-05-01 — Site deployed to parallaxlens.com

**What.** First live deployment.

- GitHub repo created at `github.com/shikharsumantech14/parallax` (private)
- Initial commit: 75 files — full Astro scaffold, two issues, six topic
  worlds, component library, pipeline docs, NotebookLM setup docs
- Deployed to Vercel: `parallax-eta.vercel.app` (auto-deploys on every
  push to `main`, ~60s build time)
- Custom domain `parallaxlens.com` connected via Cloudflare auto-configure
  — Vercel detected Cloudflare and set DNS records automatically; SSL
  certificate auto-provisioned. Both `parallaxlens.com` (307 → www) and
  `www.parallaxlens.com` now point to production
- `astro.config.mjs` `site` updated from placeholder to
  `https://parallaxlens.com`

**Workflow going forward.** Edit locally → push to `main` → Vercel
auto-deploys. No manual deploy step required.

### 2026-05-01 — Delimitation issue published + VoteResult stamp fix

**What.**

1. **Issue cleaned up for publication.** Removed the `beat-sheet` section
   ("Video beat sheet" — production scaffolding, never meant for readers).
   Removed the sentence "This is the analogy that carries the video." from
   the analogy section intro. Flipped `status: review → published`.

2. **VoteResult "Defeated" stamp alignment fixed.** The stamp was a child
   of `.px-vote__bar` which has `overflow: hidden` — the rotated stamp's
   corners were being clipped, making it look misaligned. Fix: introduced
   a `.px-vote__bar-wrap` wrapper with `position: relative`; moved the
   stamp outside the overflow boundary so it overlays the bar cleanly
   without clipping. CSS: `pointer-events: none; z-index: 1` added to
   stamp so it sits above the bars without blocking interactions.

### 2026-05-01 — NotebookLM summary character limit discovered and fixed

**What.** NotebookLM's Custom Summary field has a hard character limit of
~1,400–1,500 characters. The expanded 6-paragraph summaries (~1,900 chars)
were being silently truncated, cutting off the output-format and reject-list
paragraphs.

**Fix.** All six summaries trimmed to 4 paragraphs (~1,250 chars each):
identity, sources, use-case, editorial voice + example. The output-format
and reject-list instructions moved exclusively to the §6 Note-as-prompt
blocks (paste as notebook Notes). `research/notebooklm-setup.md` §5 intro
updated with the character-limit note and the reason for the split.

### 2026-04-28 — NotebookLM notebooks seeded + summaries expanded

**What.** Two follow-on actions on the NotebookLM setup:

1. **All six notebooks seeded with sources via browser automation** —
   pasted the URLs from `research/_sources/<category>.md` into each
   notebook's website-import dialog. Final tally: Politics 13/10
   working, Space 13/13, Earth 14/14, Tech 15/15, Travel 13/13,
   Sports 13/13. ~78 working sources across the six desks. Three
   politics URLs failed (404 / Access Denied / hijacked landing page)
   and one cricket URL pulled in Thai gambling-spam content; both
   need cleanup later.

2. **Custom summaries expanded** from ~70 words to ~280-320 words.
   The new versions fold editorial voice + reject-list + output
   format into the Summary itself, so chat answers stay on-brand
   without needing the optional Note-as-prompt workaround. Sports +
   Space updated via browser; Politics/Earth/Tech/Travel pasted
   manually after the browser-automation rate limit was hit. New
   versions are the canonical reference in
   `research/notebooklm-setup.md` §5.

### 2026-04-28 — NotebookLM research-desk setup documented (and corrected)

**What.** Created `research/notebooklm-setup.md` — the permanent
reference for the six per-category NotebookLM notebooks. Captures: the
role NotebookLM plays (editorial-judgment layer, not production); free-
tier limits and upgrade triggers; paste-ready titles and Summary blocks
(already applied) for each of the six notebooks; seeding instructions
tied to `research/_sources/<category>.md`; test query for validating
configuration; ~15 min/week per category workflow; and how NotebookLM
and `/pipeline-discover` are two paths to the same candidates file.
Section 3.7 of this doc links to it.

**Correction (same day).** First version of the doc instructed pasting
"Custom Instructions" blocks into a NotebookLM customisation panel.
That panel does not exist. Verified via direct browser inspection of
the live UI (April 2026): NotebookLM's "Customise" dialog only exposes
title, custom summary, and cover image. There is no per-notebook
system-prompt field. Doc rewritten to reflect this, with a
**Note-as-prompt workaround** (paste the editorial guidelines as a
notebook NOTE, which NotebookLM indexes as a source) for users who
want sharper Parallax voice from the chat. For strict editorial
output, the agent pipeline (`/pipeline-discover`) remains the
authoritative voice-shaping layer.

**Why.** The six notebooks were created in a prior session but their
configuration lived only in volatile chat history. Without this doc,
rebuilding a notebook (account migration, accidental deletion) would
mean re-deriving the setup from scratch.

**Status.** Notebooks created on `shikharcasm@gmail.com`. Titles and
Summaries set. Sources not yet added (next manual or assisted step).
Editorial-guidelines note optional — see §4 of the setup doc.

### 2026-04-27 — Phase 1 of editorial agent pipeline scaffolded

**What.** Set up the foundation for the agent-assisted editorial workflow.
Built:

- `research/` working folder with per-category subfolders for each topic
- `research/_sources/<category>.md` × 6 — starter trusted-source allowlists
  for politics, space, earth, tech, travel, sports (8-15 sources each,
  filled with sensible defaults to be edited by the editor)
- `research/_sources/README.md` — explains allowlist format, WebFetch
  permissions, what "trusted" means, when to add/remove
- `research/_templates/candidate.md` — output shape contract for the
  discovery step, with example
- `research/README.md` — pipeline overview, status board, cost-routing
  guidance
- `.claude/agents/discovery.md` — discovery subagent definition (tools:
  Read, Glob, Grep, WebSearch, WebFetch, Write). Hard rules: only mines
  allowlisted sources, never invents facts, never sets status, never
  writes to `src/content/issues/`.
- `.claude/commands/pipeline-discover.md` — `/pipeline-discover <category>`
  slash command. Validates category, ensures allowlist + topic folder exist,
  spawns the discovery subagent.

**How to use.** From this conversation or a fresh Claude Code session,
run `/pipeline-discover politics` (or any of the six categories). The
agent surfaces 5-10 candidate issue topics from the allowlisted sources,
writes them to `research/<category>/<YYYY-MM-DD>-candidates.md`, and
returns a top-pick summary. Editor then opens the file, picks one by
flipping `status: open` → `status: chosen`, and triggers Phase 2 (when
built).

**Cost.** ~₹15-40 per `/pipeline-discover` run on Anthropic API direct.
On Claude Pro plan, ~3-5% of a 5-hour limit window per run.

**Phases 2-5** (researcher, drafter, verifier, visual-checker, GitHub
Actions cron) are queued.

### 2026-04-26 — Brand & legal name split (Parallax / Parallax Lens)

**Why.** Trademark search confirmed bare "PARALLAX" is locked in India
classes 16 + 41 (Rohit Mankar 2006, Sardessai 2016) and in USPTO classes
9/16/41 (Parallax Inc., Parallax LLC, DBA Parallax, Parallax Productions,
The Parallax Effect Podcast). Combined mark **PARALLAX LENS** is clean in
both jurisdictions (zero hits in India for classes 16 + 41; zero hits in
USPTO for any combination of PARALLAX with LENS, live or dead). Domain
parallaxlens.com purchased on Cloudflare 2026-04-26.

**What changed.** Brand name in body copy and visual chrome stays as
"Parallax". The full registered name "Parallax Lens" now appears in:
- `src/components/core/Footer.astro` — `© 2026 Parallax Lens`
- `src/layouts/IssueLayout.astro` — `<title>{title} · Parallax Lens</title>`
- `src/pages/index.astro` — HomeLayout title and description
- `src/pages/topics/[topic].astro` — HomeLayout title and description
- `src/pages/about.astro` — title, description, and new "— 03 Colophon"
  section: `Parallax is published by Parallax Lens™`
- `src/pages/rss.xml.ts` — feed title and description

**What did NOT change.** Masthead variants, hero titles, topic-index
nameplates ("● The Parliamentary Desk", "Earth · Field Atlas", etc.),
card kickers and CTAs, manifestos, and all back-link copy. The visual
brand is still "Parallax".

**Future.** A custom Lens device-mark (logo / SVG) will be designed
later. When it lands it goes in the masthead area as a small typographic
mark; the registered trademark protects the combined word + device.

### 2026-04-26 — Phase 2.6: Per-topic index pages + card differentiation + home nav

**The problem this addressed.** Politics and travel cards were collapsing
into the same "warm-paper-with-serif" gestalt because both used identical
DOM structure. Topic pages were rendered by a single generic dispatcher
with no category-native treatment. There was no obvious back-to-home
affordance once you were inside a topic.

**Card differentiation (`CategoryCard.astro` rewrite).** Each card now has
a per-topic header chrome line (red dot + "POLITICS DESK", T+ telemetry,
coordinate bar, terminal prompt, dashed PRX stamp box, MATCHDAY/KO line),
a per-topic typographic treatment of the topic word (red drop-cap "P",
sans + cursor, italic + sage coordinates, mono "tech/" with lime slash,
italic with terracotta underline, `[ SPORTS ]` brackets), and a CTA
worded in the desk's voice.

**Home navigation.** Wrapped the Parallax brand in `<a href="/">` on
every Masthead variant. New `.px-masthead__home` styling in `meta.css`
keeps it text-like with a subtle hover. Each topic-index page also adds
a back link in the topic's voice below the masthead.

**Per-topic index pages — six new components, dispatcher pattern.** The
dynamic route `[topic].astro` slimmed to a 70-line dispatcher. Six new
Index components in `src/components/topic/<topic>/`:
- `PoliticsIndex.astro` — broadsheet front: double-rule nameplate ("● The
  Parliamentary Desk"), editor's-note column with red drop-cap, columnar
  issue leads with large "01" + bold title + hook + meta. Empty state:
  "FILING" rotated stamp on warm paper.
- `SpaceIndex.astro` — mission-control console: telemetry banner with
  blinking pulse + 4 rows (MISSION / T+ / STATUS / FEED), TX log table
  (TX-002 · CLEARED · subject · date), pulsing dots. Empty state: 4-bar
  signal strength block + "AWAITING TRANSMISSION".
- `EarthIndex.astro` — atlas index sheet: nameplate with sheet number /
  origin / scale legend, issue list as numbered map sheets with
  cartographic coord per row. Empty state: large concentric contour rings
  in corner + survey legend.
- `TechIndex.astro` — git changelog: terminal prompt header, REPO/BRANCH/
  COMMITS line, commits as a left-rail timeline with hash · tag · message
  · author · date · body. Empty state: faux `git log fatal: your current
  branch 'main' does not have any commits yet`.
- `TravelIndex.astro` — postcard rack: italic letterhead with terracotta
  rule + dateline, issues as horizontal postcards (stamp box + perforated
  divider + body). Empty state: rotated PRX dashed stamp top-right + "—
  Postmarked Bureau —" italic footer.
- `SportsIndex.astro` — matchday programme: PFC crest box + uppercase
  Oswald nameplate + scoreboard panel (FIXTURES / SEASON / STATUS),
  issues as fixture rows (MD · DATE · MATCH · KO · REPORT). Empty state:
  pre-season scoreboard with TBA values + visible pitch markings.

Every template handles populated *and* empty states as design surfaces.
Every template has a topic-voice back-to-home link.

### 2026-04-26 — Phase 2.5b: Theme depth + signature components for tech / travel / sports / earth

- Schema: added 4 new section kinds — `commit-grid`, `journey-map`,
  `match-stat-line`, `elevation-profile`. SectionRenderer wires them all.
- New components:
  - `src/components/topic/tech/CommitGrid.astro` — props-driven 7×N week heatmap;
    5 intensity levels mapped to lime opacity steps; mono caption + meta + legend
  - `src/components/topic/travel/JourneyMap.astro` — `stops[]` of place / region /
    km / elev / arrival / note; pin column + dashed terracotta connector;
    origin / arrival / detour / transit pin variants
  - `src/components/topic/sports/MatchStatLine.astro` — home/away sides with
    score, badge, win/draw/loss outcome; competition + venue + date meta;
    `rows[]` of label / home / away / unit normalised to percent for the bar fill
  - `src/components/topic/earth/ElevationProfile.astro` — `bands[]` with
    label / range / value / unit / note; bar width proportional to value vs
    `maxValue`; surface / depth / altitude / core flag tints the row
- `src/styles/themes/tech.css` rebuilt from tokens-only stub to full theme
  — near-black canvas, monospace-forward type, lime accent, lattice-grid
  topic-hero backdrop, full component re-skins for masthead, hero,
  sections, sources, footer, prose, comparison, data-readout, paradox,
  timeline, and the new CommitGrid signature
- `src/styles/themes/travel.css` rebuilt — Cormorant Garamond italic-leaning
  display, terracotta accent, postage perforation topic-hero backdrop, full
  component re-skins, and the JourneyMap signature
- `src/styles/themes/sports.css` rebuilt — Oswald bold condensed display,
  pitch-green canvas, lime accent, pitch-marking topic-hero backdrop, full
  component re-skins, and the MatchStatLine signature (80px scoreline,
  per-row dual stat bars)
- `src/styles/themes/earth.css` expanded from Phase 2.5a's masthead-only
  scope to full theme — added cross-topic component re-skins (prose,
  comparison, data-readout, paradox, timeline, topic-list, empty-state)
  and the ElevationProfile signature

### 2026-04-26 — Phase 2.5a: Earth added, home redesigned around themed category grid

- Added `earth` as 6th topic in TOPICS enum, meta token map, manifesto,
  TopicStrip labels, topic route empty-state copy, and Masthead variants
- New `src/styles/themes/earth.css` — atlas paper / forest-green palette,
  Cormorant Garamond display, contour-line topic-hero motif, custom masthead
  styles for the lat/lng/elevation coordinate bar
- New components `src/components/home/CategoryCard.astro` and `CategoryGrid.astro`
  — 6 themed mini-magazine covers, each scoping its own `data-topic` block
  so politics red and space cyan can sit beside each other without leaking
- Each card carries a topic-signature backdrop motif (broadsheet column rule
  for politics, orbital rings for space, contour lines for earth, monospace
  lattice for tech, postage perforation for travel, pitch markings for sports)
  — all pure CSS gradients, no SVG/image dependencies
- `index.astro` rewritten: kept TypographicChord, dropped TopicStrip+FeaturedIssue,
  added CategoryGrid (2-col × 3-row); ArchiveList now lists *every* published
  issue rather than skipping the latest
- Visual A/B between 3-col 3×2 and 2-col 2×3 — 2-col chosen because each
  cover earns the room it needs; 3-col cramped the type and shrank the motifs
- Chord dek copy: `Five topics. One publication.` → `Six worlds. One publication.`
- IssueLayout + HomeLayout import `earth.css` so `data-topic="earth"` works
  on issue pages too

### 2026-04-24 — Issue 02 shipped: *The Orbit That Remembers* (Kessler cascade)

- First non-politics full issue — opens the Space world
- Added four new section kinds (`prose`, `comparison`, `data-readout`,
  `orbital-shells`) and their components. `prose`, `comparison`,
  `data-readout` live under `core/`; `orbital-shells` under `topic/space/`
  as the space signature visualization
- `src/styles/themes/space.css` expanded from tokens-only stub to full theme
  (dark navy `#0a1628` / paper `#111f36` / cyan accent `#00d4ff` / amber
  `#ffb347`) — restyles masthead, hero, timeline, paradox, quote, sources,
  footer plus the four new components, with a 760px responsive breakpoint
- `SectionRenderer.astro` dispatches the four new kinds
- Issue content: 8 sections (Kessler framing → 6-event timeline → Cosmos
  vs Fengyun altitude asymmetry → 5-shell altitude chart → 2025 scoreboard
  → UN/FCC paradox → ESA quote → debris-removal closer), 12 verified
  sources (ESA SER 2025, McDowell, FCC 22-74, UN A/RES/77/41, LeoLabs, etc.)

### 2026-04-24 — Phase 1.5 reframe shipped

- Added meta brand layer, 5 topic index pages, 6 masthead variants
- Author-name audit (removed hardcoded `Shikhar Sharma`, made `author`
  optional)
- Home page rewritten around typographic chord + topic strip + featured card
- Compact `TopicStrip` added under masthead on issue pages
- Numbering changed: `No. 01` → `— 01` across lib/text helpers, section
  renderer, masthead meta variant, featured card header, about page, archive
  empty copy

### 2026-04-24 — Tagline + dek refinement

- Typographic chord reduced from four display fonts to two (Fraunces +
  JetBrains Mono) — "Stories you think you already *understand*." with a
  single italic accent
- Dek upgraded from 13px mono metadata to Fraunces italic subtitle
  (clamp 20–30px) with red italic `Five` echoing the hero accent

### 2026-04-24 — Docs bootstrapped

- Created `docs/PROJECT.md` (this file) as the canonical project handoff.
