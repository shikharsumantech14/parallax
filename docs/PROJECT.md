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
5. /pipeline-draft <category>      ⏳ drafter subagent → MDX with status: draft
   ↓
6. /pipeline-verify <category>     ⏳ verifier subagent → claim-by-claim audit
   ↓
7. YOU AUDIT + PUBLISH             ← read draft + report, fix, status: published
```

**Working files** live under `research/`:
- `research/_sources/<category>.md` — per-category trusted-source allowlist
  (the universe of sources the discovery agent is allowed to mine from)
- `research/_templates/candidate.md` — candidates file output shape (Phase 1)
- `research/_templates/dossier.md` — dossier output shape (Phase 2)
- `research/<category>/<date>-candidates.md` — discovery output (Phase 1)
- `research/<category>/<date>-<slug>-dossier.md` — research output (Phase 2)
- `research/<category>/<date>-<slug>-verification.md` — verifier output (Phase 4+)

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

**Phase status (as of 2026-05-02):**
- ✅ Phase 1: discovery agent (`discovery.md`) + `/pipeline-discover` command + per-category source allowlists
- ✅ Phase 2: researcher agent (`researcher.md`) + `/pipeline-research` command + dossier template
- ⏳ Phase 3: drafter subagent + `/pipeline-draft` command
- ⏳ Phase 4: verifier ★ brand-protection step ★
- ⏳ Phase 5: visual-checker + scheduled cron via GitHub Actions
- ⏳ Phase 6: roll out beyond politics (space, earth, tech, travel, sports)

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
│   │   │   └── BrothersAnalogy.astro
│   │   ├── space/
│   │   │   ├── SpaceIndex.astro     # mission-control topic index page
│   │   │   └── OrbitalShells.astro
│   │   ├── earth/
│   │   │   ├── EarthIndex.astro     # atlas-sheet topic index page
│   │   │   └── ElevationProfile.astro
│   │   ├── tech/
│   │   │   ├── TechIndex.astro      # git-changelog topic index page
│   │   │   └── CommitGrid.astro
│   │   ├── travel/
│   │   │   ├── TravelIndex.astro    # postcard-rack topic index page
│   │   │   └── JourneyMap.astro
│   │   └── sports/
│   │       ├── SportsIndex.astro    # matchday-programme topic index page
│   │       └── MatchStatLine.astro
│   └── SectionRenderer.astro
├── content/
│   ├── config.ts            # Zod schema + TOPICS/SECTION_KINDS exports
│   └── issues/
│       ├── _template/index.mdx
│       ├── 2026-04-24-delimitation/index.mdx
│       └── 2026-04-24-kessler-cascade/index.mdx
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

Total: 10 static routes + 1 RSS endpoint.

```
/                                    (home)
/about/
/issues/2026-04-24-delimitation/
/issues/2026-04-24-kessler-cascade/
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
- Two full issues: *The Trojan Horse in Parliament* (delimitation, politics) + *The Orbit That Remembers* (Kessler cascade, space)
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

**Still deferred.**

- More issues in non-politics topics
- CSS motion signatures (scroll reveals, micro-interactions)
- About-page redesign
- OG image template
- Email / analytics / pipeline
- Sitemap (after investigating the earlier build error)

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
