# Parallax — agent guide

> **For any agent (or new human) joining this repo cold.** This file follows
> the [agents.md](https://agents.md) convention: a portable, agent-readable
> entry point that any tooling can pick up. Subdirectory `AGENTS.md` files
> add context where the conventions shift. Claude Code reads this file via
> `CLAUDE.md` (which `@`-imports it).
>
> **Read `docs/STATE-OF-PLAY.md` first.** This guide describes the project's
> *standing conventions* — the rules that hold across sessions. It does not
> track what is finished versus half-built. `docs/STATE-OF-PLAY.md` is the
> dated snapshot of the actual current state: what exists, what is
> uncommitted, what is verified only at compile time, and what is still
> open. Start there, then come back here for the rules.
>
> **Keep this file current.** When you learn a non-obvious project fact
> while working — a constraint that bit you, a convention nobody told the
> agent about, a fix that should have been documented — add it to the
> nearest AGENTS.md before ending the session. The change log at the
> bottom of this file tracks updates.

---

## 1. What this project is

**Parallax** (legal name: **Parallax Lens**, registered in India, trademark
classes 16 + 41) is a visual explainer publication. It publishes long-form,
fully-sourced issues that rebuild familiar topics from the structure up —
timelines, vote results, paradoxes, data readouts, climate strips. The
brand promise: *"Stories you think you already understand."*

Six topics rotate: **politics, space, earth, tech, travel, sports**. Each
topic is its own aesthetic world (palette, typography, masthead, page
template). The Parallax meta-brand sits above them and ties them together.

Public site: [parallaxlens.com](https://parallaxlens.com). Static HTML +
CSS, no analytics, no cookies, no trackers, no comments. Hosted on Vercel,
auto-deploys on push to `main`.

**Brand-vs-legal naming split (deliberate, do not "fix"):**
- Public brand in body copy, masthead, hero, manifestos: **Parallax**
- Legal name in `<title>` tags, RSS metadata, footer copyright, About
  colophon: **Parallax Lens** (with the ™ in the colophon)
- Reason: preserves trademark enforceability while keeping brand voice tight.

---

## 2. Tech stack (verified from `package.json` + `astro.config.mjs`)

| Layer        | Choice                                              |
|--------------|-----------------------------------------------------|
| Framework    | Astro 4.16.x, static output, `format: directory`    |
| Content      | Astro Content Collections + MDX (`@astrojs/mdx` 3.1.x) |
| Types        | TypeScript 5.6 strict                               |
| Styles       | Plain CSS, custom properties swapped via `data-topic` |
| Fonts        | Google Fonts — unified trio: **Fraunces** (serif voice: headlines, leads, nameplates, the one italic accent word), **Schibsted Grotesk** (the single sans: body, UI, structural headings — replaced Inter Tight as `--font-body`), **JetBrains Mono** (labels, eyebrows, numerals). The old per-world display faces (Space Grotesk, Cormorant Garamond, Oswald, Inter Tight, IBM Plex) are retired; see §3 / §7. |
| Feed         | `@astrojs/rss` 4.0.x                                |
| Node         | `>=20.0.0`                                          |
| Hosting      | Vercel (static, auto-deploy on push to `main`)      |
| Agent SDK    | `@anthropic-ai/claude-agent-sdk` 0.2.x (for pipeline CLI) |
| Data viz     | `d3-geo` + `topojson-client` + `world-atlas` (build-time maps only) |
| 3D / WebGL   | `three` (self-hosted; lazy-loaded only by the **14** WebGL section kinds, one code-split chunk **per scene** — registry: `src/scripts/viz3d/scenes/index.ts`) |
| Section library | **97 kinds** in `SECTION_KINDS` (`src/content/config.ts`), 1:1 with the `## <kind>` blocks in `docs/design/catalog.md`, same order. `npm run check:catalog` asserts that pairing **plus** EXPLAIN + KIND_PRIORITY coverage, and runs in `prebuild` — so a half-wired kind fails the build. |

**Commands** (from `package.json`):

```bash
npm run dev               # astro dev, port 4321
npm run build             # astro build → dist/
npm run preview           # serve built output
npm run new-issue         # scaffold a new issue folder
npm run pipeline:discover    <category>    # Phase 1 — discovery agent
npm run pipeline:research    <category>    # Phase 2 — researcher agent
npm run pipeline:draft       <category>    # Phase 3 — drafter agent
npm run pipeline:stylist     <category>    # Phase 3.5 — stylist agent
npm run pipeline:verify      <category>    # Phase 4 — verifier agent
```

The pipeline scripts bill to your `ANTHROPIC_API_KEY` (loaded from
`.env.local`, which is gitignored). They do **not** consume the Claude Pro
token budget. Same agents are also invoked as `/pipeline-<phase>` slash
commands inside Claude Code — those routes through Pro.

**All progressive enhancement; the budget is rich on issues, lean everywhere
else** (the 2026-07-05 policy — see the §7 visual rule, which supersedes the
old "minimal JS everywhere" line). What has not changed: no framework, no
client bundle. Everything is tiny vanilla `is:inline` islands plus the lazy,
per-scene code-split `viz3d` runtime. The island set: `core/Reveal.astro`
(scroll-reveal — adds `.is-in` to `[data-reveal]`), `core/VizMotion.astro`
(count-up + cursor-warmth), `core/ReadingToolbar.astro` (reading progress +
Full/Skim toggle + Save), the two once-per-issue 3D-library islands
`core/Viz3DRuntime.astro` (lazy-boots the WebGL runtime in `src/scripts/viz3d/`
when a `[data-viz3d]` mount scrolls in — three is dynamic-imported + code-split,
so it never loads on home/non-3D pages) and `core/Tilt.astro` (CSS-3D
pointer-tilt + flip) and `core/ExpandModal.astro` (in-page expand-to-modal — on
its ⤢ button it portals any viz card into a focused modal "study view" with a
plain-language explainer; the page never scrolls), plus the Phase-B reader
islands (Save, Reactions, ReadingTracker, AnnotationLayer, Letters, NewsletterForm),
plus the metered soft signup gate `core/ReadingGate.astro` (client-side
cookie-detected auth wall on issues — see §7), plus the three **funnel**
islands that close the account round-trip: `core/AccountEntry.astro` (the
masthead slot — a plain "Sign in" link by default, swapped to the "Shelf"
entry when the shared auth cookie is present, with `/api/me` as a confirmer
only, never a gatekeeper), `core/WelcomeBack.astro` (issue-page toast on
`?welcome=1`, offering the `sessionStorage px_resume` scroll position the
gate saved before the round-trip) and `core/NewsletterNotice.astro` (the home
ribbon on `?newsletter=confirmed`). AccountEntry degrades to a plain static
sign-in link; the other two occupy no space and reveal nothing without JS,
because a post-action confirmation is a nicety, never content.

The contract:
everything degrades to its final painted state under no-JS (hidden states
are gated behind an `html.js` class set by an inline `<head>` guard) and
under `prefers-reduced-motion`. Count-ups tween to the value already in the
HTML. Any new interactivity must honour this contract and be justified.

**Exception — the onboarding surface (`/welcome` + the home first-visit
overlay).** (Two different pages answer to `/welcome`: this one, the
publication's intro story at `src/pages/welcome.astro`, and the app's
post-signup plate at `app/src/pages/welcome.astro`. Unrelated — check which
project you are in.) "The Second Angle" is a deliberately *cinematic*, distinct-identity
marketing/onboarding surface (its own `intro.css` palette, never touches
article styles), so it carries **more** JS than the near-zero-JS articles:
the `intro/IntroStory.astro` 5-scene player (auto/manual modes, keyboard +
dots + skip) and the `intro/IntroExperience.astro` home overlay (auto-plays
the story, then an optional spotlight tour of the real home, gated by
`localStorage px_intro_seen_v1`; `?intro=1` force-replays). Still honours the
fallback contract: no-JS stacks/scrolls the scenes and shows nothing for the
overlay (hidden via the `[hidden]` attr + `html.js`/`.is-player` gating);
reduced-motion drops auto-advance.

---

## 3. The six topics

Each topic has full tokens, masthead variant, topic-index page template,
and signature section kinds.

| Topic    | Vibe                                | BG         | Accent (hex)| Display font        |
|----------|-------------------------------------|------------|-------------|---------------------|
| politics | The Hindu / Caravan broadsheet      | warm paper | `#b8341f`   | Fraunces serif      |
| space    | NASA / JPL mission control          | deep navy  | `#00d4ff`   | Space Grotesk       |
| earth    | USGS / National Geographic atlas    | map paper  | `#2d6a4f`   | Cormorant Garamond  |
| tech     | Stripe docs / Linear changelog      | near-black | `#c6f432`   | JetBrains Mono      |
| travel   | Condé Nast / field journal          | cream      | `#c85a3c`   | Cormorant Garamond  |
| sports   | The Athletic / match programme      | pitch green| `#e8f048`   | Oswald (Druk proxy) |

**The "Display font" column is historical.** As of 2026-06-21 the type system
is unified product-wide to the Fraunces / Schibsted Grotesk / JetBrains Mono
trio (§2, §7) — the worlds no longer carry per-world display faces. They now
differ by **accent colour + treatment** (case / weight / italic / ornament /
motif), not typeface. The table records what each world used to be.

Each topic also has a `-deep` accent variant in `meta.css` for large text on
light paper where the vivid accent would fail WCAG contrast. See
`src/styles/meta.css` for the full token list.

Flipping `<html data-topic>` swaps the entire look. Per-topic theme files:
`src/styles/themes/{politics,space,earth,tech,travel,sports}.css`.

---

## 4. Layout map (the parts that matter)

```
src/
├── content/
│   ├── config.ts              ← Zod schema for issues + TOPICS / SECTION_KINDS exports
│   └── issues/<slug>/index.mdx
├── layouts/
│   ├── HomeLayout.astro       ← used by / and /topics/* and /about
│   ├── IssueLayout.astro      ← used by /issues/*
│   ├── StoryLayout.astro      ← used by /s/* (story mode) — carries the
│   │                            OG/Twitter head tags for the share cards
│   └── IntroLayout.astro      ← minimal full-bleed shell for the onboarding
│                                surface (no .px-wrap/masthead; loads only the
│                                trio fonts + intro.css). Used by /welcome.
├── pages/
│   ├── index.astro            ← home: chord + strip + category grid + archive
│   │                            + <IntroExperience/> first-visit overlay
│   │                            + <NewsletterNotice/> above the masthead
│   ├── about.astro
│   ├── welcome.astro          ← standalone full-screen auto-playing intro
│   │                            story (IntroLayout + IntroStory)
│   ├── rss.xml.ts
│   ├── issues/[slug].astro    ← dynamic issue route (one per published+draft);
│   │                            mounts core/ReadingGate.astro (soft signup
│   │                            wall) + core/WelcomeBack.astro (return toast)
│   ├── s/[slug].astro         ← story mode; builds only for status !== 'draft'
│   └── topics/[topic].astro   ← dynamic: 6 routes, dispatches to <Topic>Index
├── components/
│   ├── SectionRenderer.astro  ← ARTICLE CHROME only (core/Section wrapper,
│   │                            act-break divider, skim-caption block)
│   ├── SectionBody.astro      ← the actual dispatcher: section.kind →
│   │                            component. Shared with story mode. THIS is
│   │                            the file a new section kind is wired into.
│   ├── core/                  ← topic-agnostic (Masthead, Banner, Hero,
│   │                            Primer, Section, Quote, Prose, Comparison,
│   │                            DataReadout, BeatSheet, Sources, Colophon,
│   │                            ReadingToolbar [replaced SkimToggle; mounts
│   │                            SaveButton], the Reveal + VizMotion motion
│   │                            islands, the Viz3DRuntime + Tilt islands for
│   │                            the 3D library, ReadingGate [metered soft
│   │                            signup wall], and the funnel islands
│   │                            AccountEntry / WelcomeBack / NewsletterNotice)
│   ├── story/                 ← story mode: StoryShell, StoryHookCard,
│   │                            StoryCard, StoryCtaCard, StoryShare
│   ├── intro/                 ← onboarding ("The Second Angle"): IntroStory
│   │                            (5-scene player), IntroExperience (home
│   │                            first-visit overlay + spotlight tour),
│   │                            WorldViz (per-category mini data-viz)
│   ├── home/                  ← meta-brand pieces (TypographicChord,
│   │                            TopicStrip, CategoryCard, CategoryGrid,
│   │                            ArchiveList, FeaturedIssue)
│   └── topic/<topic>/         ← per-topic signature components + <Topic>Index
├── styles/
│   ├── base.css               ← Layer A — topic-agnostic rhythm + skim mode + `.mh` masthead
│   ├── meta.css               ← Meta brand tokens + home/topic-index styles
│   ├── dataviz-v2.css         ← v2 data-viz kit CSS (animations + html.js-gated reveals); imported last in both layouts
│   ├── components-3d.css      ← shared 3D mechanics (.px3d-* tilt/flip) + the .viz3d WebGL mount for the v2 3D/interactive library
│   ├── viz-type.css           ← unified data-viz type scale (caption/axis/legend/value label roles)
│   ├── layout-v2.css          ← the `layout:` section geometries (default / wide
│   │                            / bleed / split / split-flip / breath)
│   ├── story.css              ← story mode (.pxs-*), incl. the beat-card
│   │                            chrome-hide compaction rule — see §7
│   ├── modal.css              ← ExpandModal lightbox (in-page expand-to-modal study view)
│   ├── intro.css              ← onboarding design system (px-intro scenes/player
│   │                            + px-xp home overlay/tour). Own palette tokens;
│   │                            loaded only where the intro/overlay render.
│   │                            (welcome.css is now largely superseded — survives
│   │                            only for AccountLine + the About px-abt bits.)
│   └── themes/<topic>.css     ← Layer B — full theme per topic
├── lib/
│   ├── text.ts                ← renderEmphasis, renderInline, stripEmphasis,
│   │                            formatIssueNumber, formatSectionLabel
│   ├── explainers.ts          ← EXPLAIN: per-kind default "in plain terms"
│   │                            line (what / how) — the fallback when a
│   │                            section has no authored `plain`
│   └── story.ts               ← story-mode derivation: KIND_PRIORITY (beat
│                                ranking) + TRIM (per-kind data caps)
└── scripts/viz3d/             ← lazy WebGL for the 14 3D section kinds:
                                  runtime.ts (dynamic-imports three on
                                  scroll-in) + scenes/index.ts (the registry —
                                  ONE line per scene, each its own lazy chunk)
                                  + scenes/<name>.ts + the shared physics
                                  helpers at this level (helpers, kepler,
                                  terrain, hemicycle, neural, terminator,
                                  ballistics, packet). Mounted via
                                  core/Viz3DRuntime.astro
public/
└── geo/                       ← build/runtime geo data: countries-110m.json,
                                  plates.json (tectonic plate boundaries, used
                                  by the plate-motion scene), per-issue DEMs
docs/
├── STATE-OF-PLAY.md           ← dated snapshot of what is actually built /
│                                uncommitted / open — READ THIS FIRST
├── PROJECT.md                 ← long-form project state + change log
└── design/                    ← the design canon (CANON.md, motion.md,
                                  catalog.md, the *-SPEC.md set, physics/,
                                  worlds/, blueprints/) — read before any
                                  visual work
shared/design/                 ← tokens.css + worlds.css — the CANONICAL token
                                  source for BOTH projects. Edit here, then
                                  `npm run design:sync`; `design:check` gates
                                  the root build.
app/                           ← separate Astro SSR project (see app/AGENTS.md)
research/                      ← editorial pipeline working space (see research/AGENTS.md)
.claude/agents/                ← agent system prompts (discovery, researcher,
                                  drafter, stylist, verifier)
.claude/commands/              ← slash-command definitions that spawn the agents
scripts/                       ← pipeline CLI (tsx-driven, bills to API key)
                                  + check-catalog.mjs, design-sync.mjs,
                                  story/og.ts (the `prebuild` hook)
```

The `app/` SSR project's own map lives in `app/AGENTS.md`. The paths added
most recently, worth knowing before you go looking:

```
app/src/pages/welcome.astro              ← post-signup "You're in." plate
                                           (name + six world-interest chips)
app/src/pages/api/onboarding.ts          ← its POST handler (save / skip)
app/src/pages/auth/callback.ts           ← routes first-time users to /welcome
app/src/pages/dashboard/index.astro      ← "The Shelf"
app/supabase/migrations/20260705000000_journey_onboarding.sql
                                         ← adds profiles.welcomed_at +
                                           profiles.stated_interests.
                                           NOT YET APPLIED — operator applies.
```

For deeper rules on each subtree, see the local AGENTS.md:

- `src/content/issues/_AGENTS.md` — schema fields, primer/skimCaption,
  build errors to avoid. (Filename has a leading underscore so Astro's
  content collection ignores it — same convention as the `_template/`
  folder.)
- `src/components/AGENTS.md` — full section-kind → component table, SVG
  conventions, how to add a new component.
- `research/AGENTS.md` — editorial pipeline, voice system, sources, dossier
  template.
- `app/AGENTS.md` — the **separate Astro SSR project** for
  `app.parallaxlens.com` (reader auth + dashboard + `/api/*`). The
  publication at the repo root stays static; `app/` handles every
  auth-aware surface. See `docs/COMMERCIALISATION-SETUP.md` for the
  operator setup checklist.

---

## 5. The editorial pipeline

Every issue is produced via a four-phase agent pipeline. The human (you)
holds two control gates; agents do everything else.

```
1. /pipeline-discover <category>      → research/<cat>/<date>-candidates.md
   ↓
2. YOU PICK 1 CANDIDATE                ← change status: open → status: chosen
   ↓
3. /pipeline-research <category>      → research/<cat>/<date>-<slug>-dossier.md
   ↓
4. YOU REVIEW DOSSIER                  ← check [UNVERIFIED] items
   ↓
5. /pipeline-draft <category>         → src/content/issues/<slug>/index.mdx
                                          (status: draft)
   ↓
6. YOU REVIEW DRAFT                    ← fix voice/flow, resolve EDITOR comments
   ↓
7. /pipeline-stylist <category>       → rhetorical-mode rewrites of prose
   ↓
8. /pipeline-verify <category>        → research/<cat>/<date>-<slug>-verification.md
   ↓
9. YOU AUDIT + PUBLISH                 ← read report, fix residuals,
                                          flip status to published, commit
```

Pipeline status (as of 2026-06-03):

| Phase | Agent file | Command (Claude Code) | Command (API CLI) |
|-------|-----------|----------------------|-------------------|
| 1. Discovery | `.claude/agents/discovery.md` | `/pipeline-discover <cat>` | `npm run pipeline:discover <cat>` |
| 2. Research | `.claude/agents/researcher.md` | `/pipeline-research <cat>` | `npm run pipeline:research <cat>` |
| 3. Draft | `.claude/agents/drafter.md` | `/pipeline-draft <cat>` | `npm run pipeline:draft <cat>` |
| 3.5. Stylist | `.claude/agents/stylist.md` | (no slash command — API only) | `npm run pipeline:stylist <cat>` |
| 4. Verify | `.claude/agents/verifier.md` | `/pipeline-verify <cat>` | `npm run pipeline:verify <cat>` |

**Cost per run** (API CLI, May 2026 rates from `scripts/README.md`):
discover ~$0.30–0.80 · research ~$0.80–2.00 · draft ~$3–7.50 · stylist
~$1.50–2.50 · verify ~$0.40–1.00. Full pipeline per issue: $6–14.

**Model routing** (`scripts/pipeline.config.ts` — **API-CLI route only**):
- Discovery, researcher, verifier → `claude-sonnet-4-6`
- Drafter, stylist → `claude-opus-4-1`
- **Claude Code route** (subscription budget) pins **every** phase to **Opus
  (max)** instead — no Sonnet. The split above is the operator's API-CLI config;
  leave it unchanged.

**No raster imagery**: the publication is type- and data-viz-led. There
are no cover photos or AI-generated covers, and no external image
service in the pipeline.

Voice quality is the highest-value output of draft and stylist, hence Opus.

**The agents are catalog-driven (2026-07-14).** `docs/design/catalog.md` is
now the canonical component palette the editorial agents read at runtime —
the drafter no longer carries an inline kind list (it used to name only 30).
The wiring: the **researcher** captures each proposed component's catalog
`DATA:` line (and its `RESEARCHER MUST CAPTURE` note where the block has one),
so the dossier arrives with real sourced values rather
than invented coordinates or ratings; the **drafter** picks kinds from the
catalog and authors `plain` (≤220 chars, explains the *form* not the data),
`skimCaption` and `layout` per section, under the CANON §3 rhythm rules (one
hero visual, ≤3 loud sections, act-breaks); the **stylist** runs a structure
+ plain audit (Step 4.6) that flags one-metaphor drift, act-rhythm breaks and
catalog non-conformance; the **verifier** treats component `data` values as
traceable claims and flags a `plain` line that asserts data as ⚠️ PLAIN-CLAIM.
This wiring has not yet been exercised on a real run — see §10 (2026-07-14).

**NotebookLM as upstream layer.** A per-category NotebookLM notebook (one
per topic, seeded from the same `research/_sources/<category>.md`
allowlists) sits upstream as the editor's judgment layer. Setup at
`research/notebooklm-setup.md`. NotebookLM and `/pipeline-discover` are
parallel paths into the same candidates file.

**Reader-account product (Phase A + B).** A separate Astro SSR project
at `app/` serves `app.parallaxlens.com` — auth, dashboard, and all
reader-interaction APIs. See `app/AGENTS.md` for full detail. The
publication stays `output: 'static'`; reader features attach as small
client islands that call the app subdomain. Phase A shipped. Phase B
mostly shipped (reactions, save, reading-events, annotations capture +
moderation queue, Letters block); remaining: topic affinity heatmap
(B-4, data-gated). See `docs/PROJECT.md` §12 (2026-06-01 entries) for
the full status. As of 2026-07-14 the dashboard is rebuilt as "The Shelf"
and a post-signup `/welcome` onboarding step exists — both compile-verified
only, and the onboarding migration is **not yet applied**. See §10.

---

## 6. The voice system (eight rhetorical modes)

The stylist agent reads `research/_voice/mode-library.md` (964 lines) at
runtime and assigns one of eight modes to each section. The drafter keeps
the same library open while writing.

| Mode | When |
|---|---|
| AWE | Scale, deep time, mechanism marvel — Sagan / Attenborough register |
| CONVERSATIONAL EXPLAINER | Step-by-step mechanism — Harris / Oliver register |
| CALM-STRUCTURAL | Naming structural cost; scene → civilization pivot — Ravish Kumar |
| SATIRICAL EXPOSURE | Institutional contradiction by its own data — Last Week Tonight |
| DRY WIT | Bureaucratic precision as deadpan — Economist / Bourdain |
| INVESTIGATION | Anomaly observation, evidence assembly — Morris / Wright Thompson |
| FORENSIC | Mechanism with human stakes, staccato precision |
| LYRICAL COMPRESSION | Closer or single emotional landing — Akhtar / Iyer / Ondaatje |

**Mode-blending rules (hard):**
- One dominant mode per section.
- At most 1 SATIRICAL EXPOSURE section per issue.
- At most 2 LYRICAL COMPRESSION paragraphs per issue.
- 4–6 modes across the full issue. Not 8, not 1.

### AI-tell catalog (from mode-library §"Voice rules")

Every prose field must pass these checks before being written or rewritten:

| Tell | Rule |
|---|---|
| 2+ em-dashes in one paragraph | Max 1 em-dash per paragraph |
| `"It is not X. It is Y."` binary reframe | Max 1 per issue, only if it *is* the structural argument |
| 3× short sentences closing a section | Max 1 triple-fragment close per issue |
| `"the mechanism" / "structural argument" / "rhetorical work"` as abstract-noun labels | Replace with the actual claim |
| `"First… Second… Third…"` numbered-manifesto rhythm | Remove ordinals, interleave the ideas |

Applying a mode does not excuse an AI tell. A FORENSIC paragraph with two
em-dashes still needs to be fixed.

---

## 7. Hard rules (do not break without discussion)

### Content rules

- **No hardcoded names in `src/`.** `author` is schema-optional with no
  default. If absent, the Hero component omits the "By" line entirely.
  Grep test (corrected 2026-07-14 — the old form was wrong twice over: it
  named the wrong surname, and it self-triggered on the AGENTS docs that
  describe the rule):

  ```bash
  grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
  ```

  Zero hits = clean. The operator is **Shikhar Suman**; matching on
  `Shikhar S` catches both that and the long-quoted "Shikhar Sharma" variant,
  and scoping to code/content extensions skips the guides that mention it.
- **Numbering format.** Issue and section numbers use em-dash + two-digit
  pattern: `— 01`, `— 02`, … Single source of truth: `formatIssueNumber`
  and `formatSectionLabel` in `src/lib/text.ts`. Exception: the `travel`
  masthead variant intentionally keeps `Vol. I, No. 01`.
- **Emphasis in content.** `*text*` → `<em>` (used for one italic accent
  word in titles, e.g. `The *Architecture* of Every Crisis`). `**text**` →
  `<strong>`. See `src/lib/text.ts` for the renderers.
- **Topic-index dispatch.** `src/pages/topics/[topic].astro` is a slim
  dispatcher — actual composition lives in `src/components/topic/<topic>/<Topic>Index.astro`.
  Do not add per-topic logic back to the route.
- **Status flag pipeline.** `draft` → `review` → `published`. Only
  `status: 'published'` (actually `!== 'draft'`) shows up on public pages.
  Nothing publishes without a manual flip.

### Schema rules (see `src/content/issues/_AGENTS.md` for full detail)

- `primer` is `z.string().min(80).max(420).optional()`. The 420-char limit
  is enforced at build time by Zod — overshooting breaks the build.
- `plain` is `z.string().max(220).optional()`. Same deal: Zod enforces it at
  build time, so a 221-char plain line **breaks the build**. It explains the
  *form* of the viz ("each block is one seat…"); the caption explains the
  data. Omitted ⇒ falls back to the per-kind default in `src/lib/explainers.ts`.
- `layout` is one of `default | wide | bleed | split | split-flip | breath`
  (`SECTION_LAYOUTS` in `config.ts`; geometry in `src/styles/layout-v2.css`).
  Rhythm limits live in `docs/design/CANON.md` §3, not in the schema.
- `skimCaption` only applies to `kind: prose` sections. Other section kinds
  ignore it.
- `sources[].url` must be a valid URL (`z.string().url()`). Mock URLs
  break the build.
- Every section's `sourceRefs[]` must reference an existing `source.id`.

### Visual rules

- **Unified type system (product-wide).** One trio everywhere: **Fraunces**
  (serif voice), **Schibsted Grotesk** (the single sans / `--font-body`),
  **JetBrains Mono** (labels / numerals). The six worlds differ by **accent
  colour + treatment** (case / weight / italic / ornament / motif), **not**
  by typeface — do not reintroduce per-world display faces. Single lever:
  `src/styles/type-v2.css` normalises `--font-display`/`--font-body`/
  `--font-mono` + `--issue-face`/`--face-*` across `:root` and all six
  `:root[data-topic]`, imported last so it wins. The §3 topics-table
  "Display font" column is historical only.
- **JS budget: rich on issues, lean everywhere else (2026-07-05 policy;
  operator-approved — supersedes "minimal JS everywhere").** Issue pages
  (`/issues/*`) and story mode (`/s/*`) carry a generous interactive budget —
  3D scenes, scroll-driven states, hover inspection — under three absolutes:
  every interactive byte serves **comprehension, not decoration** (see
  `docs/design/CANON.md` §12); everything is **lazy-loaded / code-split**
  (the `viz3d` runtime pattern: nothing heavy loads until its mount scrolls
  in, and never on pages that don't use it); and the **fallback contract is
  untouchable** — every component paints its final/composed state under
  no-JS (hidden states gated behind `html.js`), `prefers-reduced-motion`,
  and missing WebGL. Home, topic indexes, and about stay in the near-zero-JS
  posture: the small vanilla `is:inline` island set (`core/Reveal.astro`,
  `core/VizMotion.astro`, `core/ReadingToolbar.astro`, the Phase-B reader
  islands, `core/ReadingGate.astro`, and the funnel islands
  `core/AccountEntry.astro` / `core/WelcomeBack.astro` /
  `core/NewsletterNotice.astro`) and nothing framework-shaped. The
  onboarding surface ("The Second Angle" — `/welcome` + the home first-visit
  overlay) keeps its existing exception. The design canon in
  `docs/design/` governs how the budget is spent.
- **Metered soft signup gate.** `core/ReadingGate.astro` (mounted in
  `issues/[slug].astro`) shows anonymous readers the primer + first 2
  sections, then a per-topic-themed "create a free account to finish" wall;
  the rest of the article + sources + interaction blocks are hidden. Auth is
  detected **client-side** via the shared, client-readable
  `sb-<ref>-auth-token` cookie (`@supabase/ssr` sets it non-HttpOnly on
  `.parallaxlens.com`). **Soft by design** — the publication is static, so
  teaser content is in the page source: chosen over a hard server gate to
  keep teasers shareable + Google-indexable. No-JS / crawlers ⇒ the gate
  stays hidden ⇒ the full article renders (SEO-safe). Intro CTAs funnel to
  `app/login?next=`.
- **CSS class prefix isolation.** Each component owns a unique `px-<abbrev>`
  prefix (≤6 chars). Check `meta.css` for collisions before choosing — the
  `px-strip` namespace is owned by `TopicStrip`; the climate-strip
  component uses `px-cstrip` to avoid it. Reserved: `px-intro` + `px-xp`
  (intro experience + home overlay/tour, in `intro.css`), `px-gate` (the
  reading gate), `px-acct` (AccountEntry), `px-wb` (WelcomeBack), `px-nnote`
  (NewsletterNotice), `pxs-` (story mode, in `story.css`); `px-wj` / `px-abt`
  survive from the onboarding pass (AccountLine + About).
- **Mobile: page overflow is fixed, in-SVG fine print is not.** The 640px
  tail of `dataviz-v2.css` makes data tables (`.lt`, `[class$="__table"]`)
  scroll *inside* their card and adds `max-width`/`min-width:0` safety nets,
  so no route overflows the page at 375px. The honest residual: SVG cards use
  a fixed `viewBox` + `width:100%`, so their in-chart fine print still renders
  at roughly 3.4–7px on a 375px screen. There is no clean blanket fix — a
  `min-width` breaks the tall-narrow columns/discs/gauges. Mobile legibility
  is carried instead by the HTML layer (the `plain` line, caption, and
  legend/table at real px) plus the ⤢ expand-modal study view. A
  per-component mobile-reflow round has **not** been done.
- **Story cards hide the section's own chrome, never its data.** In story
  mode `story.css` hides `[class$='__cap']` / `[class$='__src']` immediately
  inside a beat's viz, because the beat text already supplies the title and
  the CTA card links to the full issue where sources live. Graphic containers
  never end in `__cap`/`__src`, so this only ever removes chrome — keep that
  invariant if you name new sub-elements.
- **No sitemap integration.** `@astrojs/sitemap` was tried and removed —
  it errored on the collection shape. Verify before re-adding.

### Git / deploy rules

- Claude commits only — never pushes. The human pushes manually with
  `git push`. Never `git checkout` / `reset` / `stash` / `restore` a file to
  "undo" something — an agent once wiped hours of uncommitted wiring that way,
  and most of this repo's work sits uncommitted for long stretches.
- **Deploy order: `app/` before the publication.** The publication's
  `NewsletterForm` posts to the app's `/api/join`; ship the publication first
  and every subscribe attempt hits a 404. Same rule for any future
  publication island that calls a new app endpoint.
- **Migrations are the operator's to apply.** Adding a `.sql` file under
  `app/supabase/migrations/` does not apply it. Write them idempotent
  (`ADD COLUMN IF NOT EXISTS`), state clearly that they are unapplied, and
  never assume a column exists because you wrote the migration for it.
- Commit messages have **no** `Co-Authored-By` trailer.
- All commits authored with the `shikharsumantech14` GitHub account
  (`git config user.email` must match). Vercel Hobby plan blocks deploys
  from unrecognised commit authors.
- `.env.local` is gitignored (`*.local` rule). Never commit the API key.

---

## 8. Verification checklist (before declaring any change "done")

1. `npm run build` exits 0.
2. Home (`/`) is visually distinct from a published issue.
3. `/topics/<topic>/` renders correctly (populated *or* themed empty state).
4. `/rss.xml` is valid XML.
5. Grep test: `grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts"
   --include="*.mdx" --include="*.css"` returns zero hits (see §7 — do not use
   the old `Shikhar Sharma`-only form; it tests the wrong name and self-matches
   the docs).
6. Grep test: `No\.\s0` returns zero hits in `src/` except the `travel`
   masthead variant.
7. Mobile 375px: no horizontal overflow on any route. (Measure `scrollWidth`
   rather than eyeballing — a review once called overflow on the reading
   toolbar that measurement disproved. In-SVG small type is a known separate
   residual, see §7.)
8. If a new section kind was added, six files have to agree. `npm run
   check:catalog` now verifies (1)↔(5) name-for-name and in order, **and**
   that the kind has an `EXPLAIN` entry (4) and a `KIND_PRIORITY` score in
   `src/lib/story.ts`. It runs in `prebuild`, so missing any of those fails
   the build rather than failing silently. The rest are still on you:
   1. `SECTION_KINDS` in `src/content/config.ts`
   2. import + dispatch branch in `src/components/SectionBody.astro`
      (**not** `SectionRenderer.astro` — that file is article chrome only)
   3. `src/scripts/viz3d/scenes/index.ts` (WebGL kinds only)
   4. an `EXPLAIN` entry in `src/lib/explainers.ts`
   5. a `## <kind>` block in `docs/design/catalog.md` — same order as
      `SECTION_KINDS`
   6. a worked example section in that world's showcase issue
   Plus: CSS in the correct theme file, an entry in
   `src/components/AGENTS.md`, and — if it should be eligible for story
   beats — a `KIND_PRIORITY` score (and any `TRIM` cap) in `src/lib/story.ts`,
   or it silently sinks to the default 30 and never gets picked.
9. If a new issue was added: status is correct (`draft` for review,
   `published` to go live), all `sourceRefs[]` resolve, primer is 80–420
   chars if present, all unverified claims carry `# EDITOR:` flags.

---

## 9. Cross-references

- **Current state (read first):** `docs/STATE-OF-PLAY.md` — what is built,
  what is uncommitted, what is compile-verified only, what is still open.
- **Design canon:** `docs/design/` — `CANON.md` (master rules), `catalog.md`
  (the 97-kind component palette), `motion.md`, the `*-SPEC.md` set,
  `physics/`, `worlds/`, `blueprints/`. Read before any visual work.
- **Long-form project state + change log:** `docs/PROJECT.md` (~1400 lines,
  the canonical historical reference).
- **Editorial pipeline detail:** `research/README.md` + `scripts/README.md`.
- **Voice system canon:** `research/_voice/mode-library.md`.
- **Per-category source allowlists:** `research/_sources/<category>.md`.
- **NotebookLM setup:** `research/notebooklm-setup.md`.

---

## 10. Change log for this file

### 2026-08-28 — Design-revamp execution: gates hardened, WCAG pass, library 97

The Claude Design revamp is in execution; its decision record and phase state
live in `docs/REVAMP-PLAN.md` (RD-01…RD-09 + TD-01…TD-06 in
`docs/design/TOKEN-RECORD.md`) and the live snapshot in `docs/STATE-OF-PLAY.md`.
Durable changes to the standing rules recorded here:

**(1) Gates.** `check:catalog` now runs in `prebuild` (ahead of the OG writer),
reports every error class in one run, and asserts EXPLAIN + KIND_PRIORITY
coverage. `design-sync --check` gates 30 palette mirrors + 6 in-world
accent-deeps + 18 record tokens across every declaring file, not just the two
generated copies. §2 and §8 updated accordingly.

**(2) Colour law.** `--muted` is now DERIVED (ink at 60% dark / 72% light —
the authored values failed WCAG AA on 8 of 12 world/surface pairs);
`--accent-deep` carries two documented roles (in-world vs light-paper — provably
irreconcilable on dark worlds, see `shared/design/worlds.css`); small text on
light grounds uses `--accent-deep`, never the vivid accent; and TD-06: any FILL
that carries text uses `--accent-deep`. New tokens `--paper-warm` (six measured
literals), `--paper-deep` (alias), `--on-accent` (= world ground) — all gated.

**(3) Schema.** Sections gained optional `howToRead` (form, paragraph, ABOVE
the graphic, 40–360), top-level `caption` (the DATA claim — the only
comprehension field the verifier traces) and `source` (string or
`{label, date}`); issues gained optional `voice`. `plain` keeps its FORM
meaning. `SectionBody` merges the promoted fields down into `data`, so both
authoring forms work for every kind.

**(4) Corrected a false technical claim this file's siblings carried:** CSS
variables DO resolve in SVG presentation attributes in current Chromium. The
literal-stack convention stands anyway — presentation attributes lose to any
stylesheet rule, and satori/resvg do no var() substitution. See
`src/components/AGENTS.md` §5.

**(5) Phone navigation exists now** — a native `<details>` masthead menu below
900px (the nav was previously `display:none` with no replacement).

**(6) Sources.** CANON §7's "no source, no section" is actually true of
published content for the first time: 21 missing source lines backfilled with
the operator's confirmed mapping, and Timeline/BillBreakdown/VoteResult gained
source rendering. The 22 missing captions are DELIBERATE (each section's
`intro` already states the finding; a caption would be a duplicate the
verifier's REDUNDANT-HOWTO/CAPTION-FORM flags exist to catch).

### 2026-07-14 — P6–P8 executed: 90-kind library, funnel closed, app onboarding

The bulk of the elevation plan landed. **All of it is in-repo and
uncommitted** (~70 files — recount with `git status`; the doc refresh itself
added to the pile) — the operator applies the migration, then commits, pushes
and deploys **app before publication** (see `docs/STATE-OF-PLAY.md` §5 for the
canonical go-live sequence). Root `npm run build` is green (44 pages) and `app/`
compiles clean, but the app **cannot run on this box** (no `.env.local`), so
every `app/` claim below is compile-verified only; the publication work was
browser-verified live. Snapshot: `docs/STATE-OF-PLAY.md`.

**(1) P6 component breadth — 22 new section kinds, library now 90.** earth
gets plate-motion (WebGL) / atmosphere-column / carbon-loop / storm-track
(WebGL); space gets constellation-swarm (WebGL) / lagrange-map /
transfer-window / eclipse-cone; politics gets coalition-calculus /
gerrymander-lens / ballot-flow; tech gets packet-trace (WebGL) / queue-cliff
/ chip-die / moore-ladder; travel gets city-grid / altitude-oxygen /
season-wheel / fare-terrain; sports gets elo-river / court-value /
pace-ridge. Four new WebGL scenes (WebGL kinds: 10 → 14) plus a new
`src/scripts/viz3d/packet.ts` helper shared by `PacketTrace.astro` **and**
its scene, and a new `public/geo/plates.json`. Each kind is hand-wired
through six files — §8 item 8 now lists them, and `npm run check:catalog`
asserts `SECTION_KINDS` ↔ `docs/design/catalog.md` 1:1 in the same order.
Traps worth knowing: `coalition-calculus` dispatches with a **spread**
(`<CoalitionCalculus {...data} />`, flat props) unlike every other kind;
`CityGrid.astro` hard-throws outside 1–3 cities; the globe seed-yaw to face
longitude `cLon` is `drag.s.yaw = -((cLon + 90) * Math.PI) / 180` (a `+180`
there opens on the limb). §2 gains a Section-library row and a corrected
WebGL row; §4 gains the real `scenes/` registry shape.

**(2) Systemic responsive pass, with an honest residual.** The reproducible
375px overflow was data tables, fixed in the `max-width:640px` tail of
`dataviz-v2.css` by making `.lt` / `[class$="__table"]` scroll inside their
card (desktop untouched), plus `max-width`/`min-width:0` safety nets. Page
overflow is gone on every route. What is **not** fixed: in-SVG fine print
still lands at ~3.4–7px on a 375px screen because SVG cards use a fixed
viewBox at `width:100%`, and no blanket fix survives the tall-narrow
columns/discs/gauges. Legibility is carried by the HTML layer + the ⤢ study
view. A per-component mobile-reflow round was offered and **not** done. New
§7 visual rule records this plainly.

**(3) P8 editorial-agent wiring.** `docs/design/catalog.md` became the
canonical palette the agents read — the drafter's stale inline "30 kinds"
list is gone; it now authors `plain` / `skimCaption` / `layout` per section
under the CANON §3 rhythm. The stylist gained a Step 4.6 structure+plain
audit, the researcher captures each component's catalog `DATA:` line, and the
verifier flags a `plain` line that asserts data. Documented in §5. **Not yet
exercised on a real pipeline run.**

**(4) App: the Shelf + the onboarding flow.** `dashboard/index.astro` was
rebuilt as "The Shelf" on the existing app.css v2 primitives, querying only
confirmed table shapes. New `app/src/pages/welcome.astro` ("You're in." —
name field + six world-interest chips) with `api/onboarding.ts` behind it;
`auth/callback.ts` now re-reads the user after `exchangeCodeForSession` and
routes first-timers there. The chips are native checkboxes wearing the
`.chip` face so the picker submits and shows state with **zero JS** — the
fallback contract outranked the spec's literal `aria-pressed` suggestion.
New migration `20260705000000_journey_onboarding.sql` adds
`profiles.welcomed_at` + `stated_interests` (no new GRANT/RLS needed;
idempotent) — **not applied**. Deferred on the Shelf: reading-progress
hairlines, topic-affinity bars, and real issue titles (tiles title-case the
slug today).

**(5) P6.3 publication funnel.** Three funnel islands now close the account
round-trip — the pre-existing `core/AccountEntry.astro` plus new
`core/WelcomeBack.astro` (issue toast on `?welcome=1`, offering the
`sessionStorage px_resume` position) and `core/NewsletterNotice.astro` (home
ribbon on `?newsletter=confirmed`). `SaveButton` gained world-tinted signed-out
login links, and `NewsletterForm` repointed `/api/subscribe` → `/api/join` and
is now no-JS-gated (a no-JS submit previously did a native GET that leaked the
reader's email into the URL and server logs). **Deploy order matters: the app
must go live before the publication**, or the newsletter form posts to an
endpoint that does not exist. Added to §2 and the §7 island list.

**(6) P7 story breadth.** All 22 new kinds got `KIND_PRIORITY` scores in
`src/lib/story.ts` — without one they fell to the default 30 and were
effectively unrankable — plus a `TRIM['city-grid']` cap of 2 (a first attempt
at 4 was a dead no-op, since CityGrid throws above 3). Story cards now hide
the section's own `__cap`/`__src` chrome (§7) and render prose beats as
pure-text cards, which is what got the cards inside the viewport;
375×667-verified across space/politics/earth. Residual: text-heavy kinds
(comparison, paradox, timeline) still rely on the spec-sanctioned 62dvh
internal scroller — the real fix for viz-poor issues is an authored `story:`
frontmatter block, an editorial act, not a code gap. Story pages build only
for `status !== 'draft'`, so the six `*-showcase` issues have none.

Still open: the operator steps above; the P8 tail (retrofit two published
issues + one fresh `pipeline:draft` to prove catalog-driven selection — it
touches live content and bills the pipeline, so it is an editorial call); and
the optional code rounds (per-component mobile reflow, per-kind story
compaction, richer Shelf modules). A full product **revamp** is the next
major effort.

### 2026-07-05 — Product-elevation plan approved: design canon + JS-budget rule change

Operator approved the master elevation plan (per-world component inventories,
casual-reader "plain" layer, layout variety, complete UX journey, and the
`/s/<slug>/` shareable story mode). Two durable changes land now: **(1) the
design canon** — a new `docs/design/` doc set (`CANON.md` master canon,
`motion.md` named-motion vocabulary, `catalog.md` component catalog,
`JOURNEY-SPEC.md` + `APP-DESIGN-SPEC.md` + `STORY-MODE-SPEC.md`, `physics/`
formula sheets, `worlds/` per-world language specs, `blueprints/` component
contracts) that encodes every visual decision as checkable rules — read it
before any visual work; plus `shared/design/{tokens,worlds}.css` as the
canonical token source for BOTH projects (`npm run design:sync` regenerates
the checked-in copies; `design:check` gates the root build; `tokens-v2.css`
is now a re-export). **(2) The §7 "minimal JS" rule is rewritten** to
*rich-on-issues, lean-elsewhere*: issues + story mode get a generous
lazy-loaded interactive budget (comprehension-only, fallback contract
absolute); home/topics/about stay near-zero-JS. Decisions locked with the
operator: plain layer added while the literary voice stays; flagship worlds
= space + politics first; story mode ships fully free (CTA card funnels to
the gated issue). Full plan + phases in the session plan file; execution
tracked P0–P8.

### 2026-06-21 — Unified type trio + "The Second Angle" onboarding + signup gate

Three product-wide shifts (all shipped in-repo, build-green, uncommitted —
operator commits/deploys). **(1) Unified type system:** collapsed ~11 fonts
to a strict trio used everywhere — Fraunces (serif voice), Schibsted Grotesk
(the single sans, replacing Inter Tight as `--font-body`), JetBrains Mono
(labels/numerals). The six worlds no longer carry per-world display faces;
they differ by accent colour + treatment. Retired as differentiators: Space
Grotesk, Cormorant Garamond, Oswald, Inter Tight, IBM Plex. Single lever:
`src/styles/type-v2.css` (imported last). Updated §2 Fonts row, §3 note, §7
visual rules. **(2) "The Second Angle" onboarding:** a distinct-identity,
cinematic first-visit surface (own `intro.css` palette) — new
`src/layouts/IntroLayout.astro`, `src/components/intro/{IntroStory,
IntroExperience,WorldViz}.astro`, `src/styles/intro.css`. `/welcome` rebuilt
as the standalone story; `index.astro` mounts the home first-visit overlay +
spotlight tour (gated by `localStorage px_intro_seen_v1`, `?intro=1`
replays). Documented as the sole more-JS exception to the minimal-JS rule
(still no-JS / reduced-motion safe). `welcome.css` now largely superseded.
**(3) Metered soft signup gate:** `core/ReadingGate.astro`, mounted in
`issues/[slug].astro` — primer + 2 sections free, then a per-topic wall;
client-side auth via the shared `sb-<ref>-auth-token` cookie. Soft by design
(static site, SEO-safe: no-JS/crawlers see the full article). New prefix
reservations: `px-intro`, `px-xp`, `px-gate`. Full detail in `docs/PROJECT.md`.

### 2026-06-04 — First full editorial run (6 issues) + title-emphasis fix

Produced one issue per category end-to-end (research → draft → stylist →
verify) **on Opus via the Claude Code route**, then flipped all six to
`status: published` and the operator **committed + pushed them live** on
2026-06-04 (build-green + frontend-verified; go-live was the operator's step,
since git here is owner-locked to the `user` account). Slugs under
`src/content/issues/2026-06-04-*`: `cockroach-janta-party` (politics,
sensitive), `asteroid-2024-yr4` (space), `amazon-tipping-point` (earth),
`ai-coding-token-bill` (tech), `queue-is-the-product` (travel),
`arsenal-set-piece-title` (sports). Confirmed the route policy now in §5 +
`CLAUDE.md`: Claude Code route = Opus on every phase; the
`pipeline.config.ts` Sonnet/Opus split is API-CLI only. Also fixed an
emphasis leak — `*…*` in issue titles rendered literally in
`<title>`/`og:title`/RSS; added `stripEmphasis()` to `src/lib/text.ts`,
applied in both layouts + `rss.xml.ts`. Full detail in `docs/PROJECT.md` §12
(2026-06-04).

### 2026-06-03 — 3D / interactive component library (30 kinds)
Added a 30-kind interactive + 3D section library (5 per world): 4 lazy WebGL
globes on a self-hosted, code-split `three` (only loads when a `[data-viz3d]`
mount scrolls in; runtime in `src/scripts/viz3d/`) + 26 CSS-3D / animated-SVG
kinds (shared `components-3d.css` mechanics, `core/Tilt.astro` island). Both
mount once per issue via `core/Viz3DRuntime.astro` + `core/Tilt.astro`. Same
no-JS / reduced-motion fallback contract as the other islands. Added `three`
to the tech stack, the two islands to the §2 JS list + layout map, and
`components-3d.css` / `scripts/viz3d/` to the layout map. Full detail in
`src/components/AGENTS.md` §10, authoring shapes in
`src/content/issues/_AGENTS.md` §11, and `docs/PROJECT.md` §12 (2026-06-03).

### 2026-06-03 — v2 design match completed
Synced this guide to the completed v2 design-match pass. F1: the six
per-topic mastheads collapsed into one unified `.mh` press-header
(`core/Masthead.astro`), with each world's old register microcopy moving to
the per-issue `core/Banner.astro`. F2: every signature chart was fully
ported to the v2 kit (markup + animations + scroll reveals), sharing a new
`src/styles/dataviz-v2.css`; count-up + cursor-warmth ship in the new
`core/VizMotion.astro` island and reveals in `core/Reveal.astro`, all
`html.js`-gated. F3: ghost-numeral section openers, a bumped hero clamp, and
a new glass `core/ReadingToolbar.astro` (reading progress + Full/Skim + Save)
that **replaced the deleted `core/SkimToggle.astro`**. Updated the §2 JS
posture, the §7 visual rule, the layout map, and the styles list. Full
detail in `src/components/AGENTS.md` §9 and `docs/PROJECT.md` §12
(2026-06-03). (A separate 2026-06-03 entry covers the fal.ai/photo removal.)

### 2026-05-20 — Initial creation
First version of the agent guide. Consolidates the project overview,
pipeline, voice system, and hard rules from `docs/PROJECT.md` into an
agent-readable entry point. Adds three subtree AGENTS.md files:
`src/content/issues/`, `src/components/`, `research/`. Sibling `CLAUDE.md`
created at root to auto-load this file inside Claude Code.
