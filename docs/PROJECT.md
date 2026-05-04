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
| Fonts        | Google Fonts (Fraunces, Inter Tight, JetBrains Mono, Space Grotesk, Cormorant Garamond, Oswald, IBM Plex Sans/Mono) |
| Feed         | **@astrojs/rss 4.0.x**          |
| Node         | `>=20.0.0` (see `.nvmrc`)       |
| Hosting      | **Vercel** (static, auto-deploy on push to `main`) |
| Repo         | github.com/shikharsumantech14/parallax |

No JS islands, no client frameworks, no analytics, no cookies. Static HTML +
CSS only.

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
- **Layer B — Topic themes (themes/*.css).** Each of the 5 topics defines a
  full token set (`--bg`, `--ink`, `--accent`, `--font-display`, …) scoped
  under `:root[data-topic="<topic>"]`. Flipping `<html data-topic>` swaps the
  entire look.

### 3.2 Topic worlds

Each topic has its own visual identity. Current themes:

| Topic    | Vibe                                | BG         | Accent      | Display font        |
| -------- | ----------------------------------- | ---------- | ----------- | ------------------- |
| politics | The Hindu / Caravan broadsheet      | warm paper | oxide red   | Fraunces serif      |
| space    | NASA / JPL mission control          | deep navy  | bright cyan | Space Grotesk       |
| earth    | USGS / National Geographic atlas    | map paper  | forest green| Cormorant Garamond  |
| tech     | Stripe docs / Linear changelog      | near-black | lime        | JetBrains Mono      |
| travel   | Condé Nast / field journal          | cream      | terracotta  | Cormorant Garamond  |
| sports   | The Athletic / match programme      | pitch green| neon lime   | Oswald (Druk proxy) |

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
| sports   | `MATCHDAY 01 · KO 15:00`          | uppercase Oswald `[ SPORTS ]` brackets | Read the match report → |

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
4. Sections iterated via `SectionRenderer.astro` dispatcher
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
│   └── IssueLayout.astro    # used by /issues/*
├── pages/
│   ├── index.astro          # home: chord + strip + featured + archive
│   ├── about.astro
│   ├── rss.xml.ts
│   ├── issues/[slug].astro
│   └── topics/[topic].astro # dynamic: 5 routes, getStaticPaths from TOPICS
├── components/
│   ├── core/                # topic-agnostic
│   │   ├── Masthead.astro   # 6 variants
│   │   ├── Hero.astro
│   │   ├── Section.astro
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
│   ├── base.css             # Layer A — topic-agnostic rhythm
│   ├── meta.css             # Meta brand tokens + home/topic-index styles
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
  - **SVG text fonts** — use `style="font-family:'Cormorant Garamond',Georgia,serif"` 
    (not `font-family="..."` presentation attribute — CSS vars don't work there).
    Display/label text: Cormorant Garamond. Coord/axis text: JetBrains Mono.
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
--font-body        Inter Tight
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
