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
| Framework    | Astro 4.16.x, **`output: 'hybrid'`** + `@astrojs/vercel` serverless, `format: directory`. 45 pages prerender; 24 SSR routes opt out with `export const prerender = false` — miss one and it bakes at build time with no session. |
| Content      | Astro Content Collections + MDX (`@astrojs/mdx` 3.1.x) |
| Types        | TypeScript 5.6 strict                               |
| Styles       | Plain CSS, custom properties swapped via `data-topic` |
| Fonts        | Google Fonts — **ONE face, Literata** (the operator's ruling of 2026-10-04 on the canvas board `Type-Compare`, `docs/design/LENS.md` §3): display, prose, captions, labels AND numbers, at the launch design's weights, case and tracking (300–700, italic 400 for the one emphasis word only). All four role tokens (`--font-display`, `--font-body`, `--font-ui`, `--font-mono`) → Literata; `src/styles/type-v2.css` is the lever; nothing below 12px rendered. The share cards render on three static Literata files from the googlefonts/literata repo (`scripts/fetch-fonts.mjs`; Google serves Literata only as a variable font). Newsreader + Instrument Sans (Lens, 2026-09-30 to 2026-10-04), the trio before them (Fraunces / Schibsted Grotesk / JetBrains Mono) and the per-world faces are retired. |
| Feed         | `@astrojs/rss` 4.0.x                                |
| Node         | `22.x` — a PINNED major, never a range (§7)          |
| Hosting      | Vercel, ONE project (`parallax`), auto-deploy on push to `main` |
| Agent SDK    | `@anthropic-ai/claude-agent-sdk` 0.3.x (for pipeline CLI; upgraded from 0.2.126 on 2026-09-28, COST-PLAN CP-02) |
| Data viz     | `d3-geo` + `topojson-client` + `world-atlas` (build-time maps only) |
| 3D / WebGL   | `three` (self-hosted; lazy-loaded only by the **10** WebGL section kinds (14 until the Lens verdict of 2026-09-30 dropped the four generic globes), one code-split chunk **per scene** — registry: `src/scripts/viz3d/scenes/index.ts`) |
| Section library | **87 kinds** in `SECTION_KINDS` (`src/content/config.ts`; 101 until the Lens verdict of 2026-09-30, LENS §9), 1:1 with the `## <kind>` blocks in `docs/design/catalog.md`, same order. Six retired names build as **aliases** of their host (`KIND_ALIASES`: `carbon-gauge` / `swing-dial` / `throughput-dial` → `gauge`, `route-card` / `itinerary-reel` → `itinerary`, `city-compare` → `comparison`); author the host. `npm run check:catalog` asserts the pairing **plus** KIND_PRIORITY coverage **plus** a reader for every field in every `DATA:` line (check 5, 2026-09-15) **plus** the alias map (check 6, 2026-09-30) **plus** a `data-cue` anchor for every id on every block's `CUES:` line (check 7, Lens Phase 7, 2026-10-01; the EXPLAIN assertion went then), and runs in `prebuild` — so a half-wired kind fails the build. |

**Commands** (from `package.json`):

```bash
npm run dev               # astro dev, port 4321
npm run build             # astro build → dist/
npm run preview           # serve .vercel/output/static — the 45 prerendered
                          # pages, assets, manifest and sw.js. NOT the 24 SSR
                          # routes (a function, not files) — use `npm run dev`
                          # for those. `astro preview` cannot run under the
                          # Vercel adapter at all; this replaced it.
npm run new-issue         # scaffold a new issue folder
npm run pipeline:discover    <category>    # Phase 1, discovery agent
npm run pipeline:research    <category>    # Phase 2, researcher agent
npm run pipeline:check       <category>    # Phase 2.2, the dossier check pass (the script applies its corrections)
npm run pipeline:storyboard  <category>    # Phase 2.5, composer agent (you approve the storyboard)
npm run pipeline:draft       <category>    # Phase 3, drafter agent (refuses an unapproved storyboard)
npm run pipeline:panel       <category>    # Phase 3.2 / 3.7, reader-panel agent, then the Jev quiz grade
npm run pipeline:stylist     <category>    # Phase 3.5, stylist agent, behind the stylist guard
npm run pipeline:verify      <category>    # Phase 4, the Jev pre-pass, then the verifier agent
#   flags (2026-09-16): -- --slug <s> (check…verify) · --candidate C-NN
#   (research) · --model <id> · --count <n> (discover), two issues per desk.
#   (2026-09-28): --effort <level> · --focus "<subject>" (discover) · --topup
#   (research, with --slug) · --dry-run (assemble the prompt, send nothing)
#   · --bill api|subscription (which wallet pays, api by default)
npm run jev:verify           -- --slug <s> # Jev on its own: the claim pre-pass
npm run jev:panel            -- --slug <s> # the quiz grade (--pass second for the -panel-2 report)
npm run jev:pilot            -- --slug <s> # Jev read against an issue already verified
                          # (TypeSafe's decision model through OpenRouter, billed
                          # to JEV_API_KEY only, about a cent an issue)
npm run pipeline:costs       [-- --since <date> | --category <cat>]
                          # what each agent ACTUALLY cost per issue, dollars and
                          # tokens, from research/_costs/ledger.jsonl (every run appends)
npm run check:prose          [-- <slug>]   # the register + composition report (gate: check:prose:gate)
npm run check:render         [-- --slug <s> --widths 1280,375 --report]
                          # the RENDER gate (2026-09-23): headless Chrome loads every
                          # published issue signed in, at 1280 and 375, and measures
                          # overflow, clipping, text-on-text, the ⤢ button on text,
                          # duplicate chrome, and (Phase 5) cue numerals without
                          # anchors, a build ending off the no-JS page, text below
                          # 9.5px; screenshots per section under
                          # research/_ui/<date>/. Exit 1 on a blocking finding.
```

**Two doors, one pipeline (ruled 2026-09-28).** The API door is a terminal:
`npm run pipeline:<phase> <desk> -- <flags>` bills `ANTHROPIC_API_KEY`. The
Claude Code door is the slash command: `/pipeline-<phase> <desk> <flags>`
runs `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and
bills your Claude subscription. Same script, same agents, same
`scripts/pipeline.config.ts`: the door decides only which wallet pays, and
the ledger row's `billedTo` says which.

The key lives in `.env.local` (gitignored). Each `/pipeline-<phase>` is a
wrapper around its npm script since 2026-09-28: it spawns no agent and
changes no model, budget or step. How to prove which credential paid, and
the one trap that matters: `scripts/README.md` ("Two doors, one pipeline")
and `.claude/rules/pipeline-scripts.md`.

**JS budget: rich on issues, lean everywhere else** (2026-07-05 policy). No
framework, no client bundle; everything is tiny vanilla `is:inline` islands
plus the lazy, per-scene code-split `viz3d` runtime. **The fallback contract
is absolute**: every component paints its final composed state under no-JS,
`prefers-reduced-motion`, and missing WebGL.

→ Full island inventory, the gate, and the onboarding exception:
  **`.claude/rules/js-budget.md`** (loads on `src/components|layouts|pages|scripts/**`).

---

## 3. The six topics

Each topic (a desk) has its ink set, its register line, the one desk template
(`desk/DeskIndex.astro`) and signature section kinds.

Worlds: **politics · space · earth · tech · travel · sports**. Under Lens
(2026-09-30) they differ by **ink on one paper**: every desk page sits on the
same warm paper, and each desk has four inks — **text** for words, **mark**
for fills and lines, **tint** for bands and chips, **deep** for the one
bounded plate (a hero, a cover, a WebGL scene) — plus its register line
("Politics desk", "Mission control"). They share the two faces and one type
language. The per-desk page grounds (dark space, tech and sports pages) are
retired, and so is every per-world face or treatment; older docs that
describe one are historical. The HOUSE (home, about, archive, subscribe, the
account pages) is ink on paper with the politics inks as its accent, because
the house cut of the mark is the politics station.

→ Palette values and colour law: **`docs/design/LENS.md` §2** and
  **`.claude/rules/design-tokens.md`** (loads on `src/styles|shared/design|components/topic/**`).

`<html data-topic>` picks the desk. The per-topic theme files
`src/styles/themes/{politics,space,earth,tech,travel,sports}.css` map that
desk's inks onto the role tokens the components read (`--accent` the mark,
`--accent-deep` the text ink, `--accent-tint`, `--deep`, plus the neutral
mirrors `design:check` gates) and hold NOTHING else since Lens Phase 8
(2026-10-04): no page ground, no face, no per-desk component rule, no motif
kit, no `--viz-edge`. A component that needs a desk's colour reads the role
token; it never adds a `[data-topic="…"]` rule to a theme file.

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
│   └── StoryLayout.astro      ← used by /s/* (story mode) — carries the
│                                OG/Twitter head tags for the share cards
│                                (IntroLayout, the onboarding shell, was
│                                removed with the intro on 2026-09-30)
├── pages/
│   ├── index.astro            ← home (Lens Phase 4): the stage (core/Stage
│   │                            + stage/StageScene) · six desk cards ·
│   │                            the six latest covers · the promise strip ·
│   │                            the letter · core/IntroOverlay (the
│   │                            first-visit walkthrough: a <dialog> over
│   │                            the blurred page, five scenes on a CSS
│   │                            clock, once per browser, `px_intro_v3`)
│   ├── about.astro            (the /welcome intro story was removed on
│   │                            2026-09-30; the new intro is
│   │                            core/IntroOverlay, on Home)
│   ├── rss.xml.ts
│   ├── issues/[slug].astro    ← dynamic issue route (one per published+draft);
│   │                            mounts core/ReadingGate.astro (soft signup
│   │                            wall) + core/WelcomeBack.astro (return toast)
│   ├── s/[slug].astro         ← story mode; builds only for status !== 'draft'
│   └── topics/[topic].astro   ← dynamic: 6 routes, dispatches to <Topic>Index
├── components/
│   ├── SectionRenderer.astro  ← ARTICLE CHROME only (core/Section wrapper,
│   │                            the source link, the act-break divider, the
│   │                            skim-caption block)
│   ├── SectionBody.astro      ← the actual dispatcher: section.kind →
│   │                            component. Shared with story mode. THIS is
│   │                            the file a new section kind is wired into.
│   │                            Every arm passes the data props plus
│   │                            `caption` and `source`, which the component
│   │                            does not render (Section prints both once).
│   ├── core/                  ← topic-agnostic (Masthead [the lockup + nav],
│   │                            IssueHead [meta strip · head · primer],
│   │                            Gauge [the `gauge` kind, three variants],
│   │                            Section [the reading system: the article
│   │                            column (eyebrow, title, intro, the kind's
│   │                            sentences with cue buttons, the caption)
│   │                            beside the pinned figure panel (the graphic,
│   │                            the lit cue's line, `Source · …`), the cue
│   │                            numerals filled from `cues`; components render
│   │                            none of that chrome], VizCard [the shell for
│   │                            the VizCard kinds: caption row + chip +
│   │                            graphic slot, the `data-build-scene` root;
│   │                            renders NO source], Quote, Prose, Comparison,
│   │                            DataReadout, Sources, Colophon,
│   │                            ReadingToolbar [replaced SkimToggle; mounts
│   │                            SaveButton], the Viz3DRuntime + Tilt islands for
│   │                            the 3D library, ReadingGate [metered soft
│   │                            signup wall], and the funnel islands
│   │                            AccountEntry / WelcomeBack / NewsletterNotice)
│   ├── story/                 ← story mode: StoryShell, StoryHookCard,
│   │                            StoryCard, StoryCtaCard, StoryShare
│   ├── stage/                 ← StageScene: an issue as a picture on the
│   │                            deep plate (Home and desk heroes, Phase 4)
│   ├── home/                  ← IssueRows, the list-row implementation.
│   │                            Since Phase 4 no page mounts it (Home,
│   │                            archive and desks list cover cards)
│   ├── desk/                  ← DeskIndex — one template for all six desks
│   │                            (the six bespoke <Topic>Index fronts retired)
│   └── topic/<topic>/         ← per-topic signature components
├── styles/
│   ├── base.css               ← topic-agnostic rhythm + skim mode + the `.mh`
│   │                            masthead + the Lens primitives (bands, h1–h3,
│   │                            buttons, chips, inputs, cards) + the `.px-viz`
│   │                            shell (a 1px hair, no shadow). The launch
│   │                            design's dead blocks left in Lens Phase 8
│   ├── meta.css               ← the house tokens (home, about, archive, subscribe)
│   ├── dataviz-v2.css         ← v2 data-viz kit CSS (animations + html.js-gated reveals); imported last in both layouts
│   ├── components-3d.css      ← shared 3D mechanics (.px3d-* tilt/flip) + the .viz3d WebGL mount for the v2 3D/interactive library
│   ├── viz-type.css           ← unified data-viz type scale (caption/axis/legend/value label roles)
│   ├── layout-v2.css          ← the reading system's geometry (Lens Phase 3): the
│   │                            article beside the pinned figure panel, the cue
│   │                            buttons, the source line (`.px-rs__src`,
│   │                            `.px-fig__src`). Every `layout:` value renders it;
│   │                            `wide` widens the panel to 620
│   ├── story.css              ← story mode (.pxs-*), incl. the beat-card
│   │                            chrome-hide compaction rule — see §7
│   └── themes/<topic>.css     ← the desk's inks and nothing else (Lens Phase 8)
├── lib/
│   ├── text.ts                ← renderEmphasis, renderInline, stripEmphasis,
│   │                            formatIssueNumber, formatSectionLabel
│   ├── cover.ts               ← the cover model: which section an issue's cover
│   │                            draws (`cover.section`), and its caption
│   └── story.ts               ← story-mode derivation: KIND_PRIORITY (beat
│                                ranking) + TRIM (per-kind data caps)
├── scripts/build.ts           ← the ONE build island (Lens Phase 5): every
│                                layout loads it; runs `data-build` scenes
│                                (LENS §6.4); classes in motion-v2.css
├── scripts/cues.ts            ← the cue lighting, progress and phone pin
│                                (Lens Phase 3), issue pages only
└── scripts/viz3d/             ← lazy WebGL for the 10 3D section kinds:
                                  runtime.ts (dynamic-imports three on
                                  scroll-in) + scenes/index.ts (the registry —
                                  ONE line per scene, each its own lazy chunk)
                                  + scenes/<name>.ts + the shared physics
                                  helpers at this level (helpers, kepler,
                                  terrain, hemicycle, neural, terminator,
                                  ballistics, packet). Mounted via
                                  core/Viz3DRuntime.astro
public/
├── sw.js                      ← the service worker (PWA). Cache-on-read: an
│                                issue you have opened stays readable offline.
│                                Its APP_ROUTES list MIRRORS src/middleware.ts —
│                                see §7. Hand-written, not generated
├── manifest.webmanifest       ← GENERATED by scripts/brand/build-assets.ts,
├── icon-{192,512}.png            along with the icons, from src/lib/mark.ts.
├── icon-maskable-512.png         Do not hand-edit; re-run the script
├── apple-touch-icon.png
└── geo/                       ← build/runtime geo data: countries-110m.json,
                                  plates.json (tectonic plate boundaries, used
                                  by the plate-motion scene), per-issue DEMs
docs/
├── STATE-OF-PLAY.md           ← dated snapshot of what is actually built /
│                                uncommitted / open — READ THIS FIRST
├── PROJECT.md                 ← long-form project state + change log
└── design/                    ← LENS.md, the design law since 2026-09-30
                                  (CANON.md and motion.md are archived under
                                  a pointer to it), catalog.md, the
                                  *-SPEC.md set, physics/, worlds/,
                                  blueprints/ — read LENS before any visual
                                  work
shared/design/                 ← tokens.css + worlds.css — the CANONICAL token
                                  source. Edit here, then `npm run design:sync`;
                                  `design:check` gates the build. The RD-05
                                  radius flip still sits in src/styles/base.css
                                  rather than here, but only by inertia: the
                                  reason was app/, and app/ is gone.
supabase/migrations/           ← the operator applies these; writing one does not
research/                      ← editorial pipeline working space (see research/AGENTS.md)
.claude/agents/                ← Claude Code's own subagents. Since 2026-09-29 it
                                  holds only voice-checker, a read-only voice gate.
                                  The pipeline's agents are not here (scripts/agents/)
.claude/commands/              ← slash-command wrappers that run the npm
                                  script with --bill subscription
scripts/                       ← pipeline CLI (tsx-driven), bills the API
                                  key by default, the subscription with --bill subscription
                                  + check-catalog.mjs, design-sync.mjs,
                                  story/og.ts + og-card.ts (the `prebuild` hook
                                  and the link-preview card it renders)
scripts/agents/                ← the pipeline's eight agent definitions (discovery,
                                  researcher, dossier-check, composer, drafter,
                                  reader-panel, stylist, verifier), read by
                                  scripts/lib/agent-loader.ts. Moved out of
                                  .claude/agents/ on 2026-09-29 so Claude Code
                                  lists none of them as a subagent type
```

**The reader-account surfaces live here now** (merged 2026-09-06; the design
notes are `docs/APP-SURFACES.md`). They are the SSR half of the hybrid build:

```
src/middleware.ts                        ← session + the AUTH_ROUTES /
                                           ADMIN_ROUTES guard. THIS is what
                                           enforces auth — requireUser only
                                           narrows the type (§7)
src/pages/login.astro                    ← magic link + Google OAuth
src/pages/auth/callback.ts               ← routes first-time users to
                                           /account/welcome. NOT /welcome —
                                           that was the publication's intro
                                           story (removed 2026-09-30), and
                                           the collision shipped broken once
src/pages/account/welcome.astro          ← post-signup "You're in." plate
                                           (name + six world-interest chips)
src/pages/api/onboarding.ts              ← its POST handler (save / skip)
src/pages/dashboard/index.astro          ← "The Shelf"
src/pages/admin/                         ← moderation queues (ADMIN_EMAILS)
supabase/migrations/                     ← 12 files. APPLIED state is not
                                           visible from the repo — ask before
                                           assuming a column exists.
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
- `docs/APP-SURFACES.md` — the reader-account surfaces (auth, the Shelf,
  `/api/*`), formerly `app/AGENTS.md`. One project since 2026-09-06;
  `app.parallaxlens.com` survives only as an alias. See
  `docs/COMMERCIALISATION-SETUP.md` for the operator setup checklist.

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
4.5 /pipeline-check <category>        → research/<cat>/<date>-<slug>-check.md
                                          (CLEAN / CORRECTIONS / BLOCKED, its
                                          corrections applied to the dossier)
   ↓
5. /pipeline-draft <category>         → src/content/issues/<slug>/index.mdx
                                          (status: draft)
   ↓
6. YOU REVIEW DRAFT                    ← fix voice/flow, resolve EDITOR comments
   ↓
7. /pipeline-stylist <category>       → rhetorical-mode rewrites of prose
   ↓
8. /pipeline-verify <category>        → the Jev pre-pass (…-jevpass.md), then
                                          research/<cat>/<date>-<slug>-verification.md
   ↓
9. YOU AUDIT + PUBLISH                 ← read report, fix residuals,
                                          flip status to published, commit
```

**Since 2026-09-13 (`docs/REGISTER-PLAN.md`) the diagram above has three more
stops.** Between 4.5 and 5: `/pipeline-storyboard` writes
`research/<cat>/<date>-<slug>-storyboard.md` (every point the reader must
get → the kind that shows it, from all 87 by data shape, the hero and the
cover, two to four cues per graphic row, the word budgets, the head, the
three quiz questions) and **you approve it**. The
gate is `GATES.storyboard` in `scripts/pipeline.config.ts`, `'required'` for
the first ten issues, `'auto'` after. After 5 and again after 7:
`/pipeline-panel`, where four Indian reader personas read the draft cold,
answer the three questions from the draft alone, and return PASS / REVISE /
BLOCK. Before 9: `npm run check:prose -- <slug>`. The full v2 sequence is in
`research/AGENTS.md` §2.

**Since 2026-09-28 (`docs/COST-PLAN.md`)** the check pass follows research
(4.5 above). It recomputes the dossier's derived numbers and confirms its
anchors in a clean context, and the script applies its corrections to the
dossier. A BLOCKED check sends the dossier back to
`/pipeline-research <category> --topup --slug <slug>`. **Jev runs inside two
phases: `/pipeline-panel` re-grades the quiz answers after the panel, and
`/pipeline-verify` scores every claim against the dossier before the verifier
reads it. It is a pre-pass, never a gate, and a missing `JEV_API_KEY` skips
it with a warning.**

The pipeline's agent definitions live in `scripts/agents/` (since 2026-09-29,
when they left `.claude/agents/` so that Claude Code stops listing them as
subagent types). The slash commands in `.claude/commands/`
(`/pipeline-discover|research|check|storyboard|draft|panel|stylist|verify`)
are wrappers since 2026-09-28: each runs
`npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and reports
the footer. The stylist has one now too, so every phase starts from either
door.

**Two hard rules that have been broken before:**

- **Cost.** A full issue measured **$20.40** at list on the trial of
  2026-09-28, the first on the cost plan's pipeline, against a corrected
  baseline of $31.41 an issue before it. Like for like, without the three
  phases the old pipeline did not have, it was $14.70, a 55% cut.
  `npm run pipeline:costs` has the current figure. The root `.env.local`
  exists, so `npm run pipeline:*` really executes and really bills, and so
  does every `/pipeline-<phase>`, on the subscription. Never run one to test
  something: `--dry-run` assembles the prompt and sends nothing.
- **One config, two wallets.** `scripts/pipeline.config.ts` (models, effort,
  budgets) rules every run on both doors, by the operator's ruling of
  2026-09-28. The Claude Code route's old all-Opus pin is retired. The door
  decides only who pays: a terminal run bills the API key, a slash command
  (the same script with `--bill subscription`) bills the subscription.
  **Never spawn a pipeline agent with the Agent tool**: that runs it outside
  the pipeline, with `CLAUDE.md` loaded and no check pass, no Jev and no
  ledger row.

**No raster imagery** — the publication is type- and data-viz-led. No cover
photos, no AI covers, no image service in the pipeline.

**The agents are catalog-driven (2026-07-14).** `docs/design/catalog.md` is the
canonical component palette they read at runtime: the researcher captures each
component's `DATA:` line so the dossier carries sourced values; the drafter
picks kinds from it and authors `plain` / `skimCaption` / `layout`; the stylist
runs a structure+plain audit; the verifier treats component `data` as traceable
claims. Exercised on every issue since the v2 pipeline of 2026-09-14.

**NotebookLM** sits upstream as the editor's judgment layer, one notebook per
category, seeded from the same `research/_sources/<category>.md` allowlists.
Setup: `research/notebooklm-setup.md`.

→ Cost table, model policy, gates and Windows constraints:
  **`.claude/rules/pipeline-scripts.md`**. Voice: **`.claude/rules/editorial-voice.md`**.
  Category status: **`/pipeline-status`** skill.

**Reader-account product (Phase A + B).** Auth, the Shelf and every
`/api/*` route are part of THIS project since the merge (2026-09-06) — see
`docs/APP-SURFACES.md`. The build is `output: 'hybrid'`: the publication
prerenders, those routes opt out. Reader features attach as small client
islands calling RELATIVE paths, which is what makes them immune to which
host served the page (§7). Phase A shipped. Phase B
mostly shipped (reactions, save, reading-events, annotations capture +
moderation queue, Letters block); remaining: topic affinity heatmap
(B-4, data-gated). See `docs/PROJECT.md` §12 (2026-06-01 entries) for
the full status. As of 2026-07-14 the dashboard is rebuilt as "The Shelf"
and a post-signup `/welcome` onboarding step exists — both compile-verified
only, and the onboarding migration is **not yet applied**. See §10.

---

## 6. The voice system — the register, then eight rhetorical jobs

**The runtime contract is `research/_voice/_voice-core.md` v2, signed
2026-09-13** (`docs/REGISTER-PLAN.md`, RG-01…RG-05). Every writing agent
loads it every run. Its Rule 0: **the register outranks the mode.** Plain
Indian English by default — explicit, concrete, hand-held, placed in India:
every term glossed the moment it appears, every abstraction given a concrete
thing, every number a comparison the reader can feel, names rationed to
twelve, "you" and "we" free. A Hindi word only where it is the natural word,
and **never load-bearing** (delete it and the English still says everything;
the lexicon is `hinglish-lexicon.md`; none in the precision layer). **All
ten published issues were rewritten into this register** (Phases 4 and 6,
closed 2026-09-15), so the live backlist IS the voice reference now. Only
`docs/archive/` and pre-2026-09-13 commits carry the old register.
`mode-library.md` is the deep reference for the eight jobs and loses to the
contract where they disagree.

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

**Blending rules (hard, v2):**
- One dominant job per section; CONVERSATIONAL EXPLAINER carries at least
  half the sections.
- At most 1 SATIRICAL EXPOSURE section per issue, and none on the politics desk.
- At most 1 LYRICAL COMPRESSION paragraph per issue; DRY WIT is a device, not
  a section.
- 3–5 jobs across the full issue.

**The AI-tell catalog** — twenty-two tells every prose field must pass (the
six of v1, five found in the measured corpus, six for Hinglish), and the rule
that neither a mode nor plainness excuses one — lives in
**`.claude/rules/editorial-voice.md`** (loads on `research/**` and `**/*.mdx`),
with the canon in `_voice-core.md` §6.

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
  dispatcher — actual composition lives in `src/components/desk/DeskIndex.astro`,
  ONE template for all six desks (the bespoke fronts retired 2026-09-08).
  Do not add per-topic logic back to the route.
- **Status flag pipeline.** `draft` → `review` → `published`. Only
  `status: 'published'` (actually `!== 'draft'`) shows up on public pages.
  Nothing publishes without a manual flip.

### Schema rules — Zod fails the BUILD, it does not warn

- `primer` 80–420 chars · any `plain` or `howToRead` fails (below)
- **Lens:** `plain` and `howToRead` are **gone**: not rendered since
  Phase 3 (2026-09-30), not authored by the pipeline since Phase 7
  (2026-10-01), and out of the schema since Phase 8 (2026-10-04), which
  FAILS the build on either, by name (a guard in `src/content/config.ts`,
  because the section object is not strict and would otherwise strip them
  silently). The pipeline authors `cues: [{n, at,
  text?}]` with `[[n]]` prose markers (LENS §5.2) and the issue's `cover`
  (LENS §8.2) instead.
- `kind` is one of the 87 in `SECTION_KINDS` or one of the six aliases in
  `KIND_ALIASES` (resolved to the host on parse). A dropped kind fails the
  build.
- `caption` = the **data** claim, the finding; each **cue sentence** (the one
  its `[[n]]` marker introduces, or the cue's `text`) = the data that cue
  lights. The verifier traces both (CUE-UNTRACED); two to four cues per
  graphic section, none on `act-break` / `prose` / `quote` / `analogy`
  (CUE-COUNT, and `check:prose` CUES). Each cue's `at` names an id from its
  kind's `CUES:` line in `docs/design/catalog.md`.
- Instrument kinds (any kind with a chip / scrub / toggle): neither the
  caption nor a cue sentence names a state the reader can change, because
  the control is `html.js`-gated and a no-JS reader cannot change it.

- `sources[].url` must be a real URL; every `sourceRefs[]` must resolve.
- `layout` in `default | wide | bleed | split | split-flip | breath`.
- `skimCaption` applies to `kind: prose` only.

→ Full detail: `src/content/issues/_AGENTS.md` and
  **`.claude/rules/issue-authoring.md`** (that subtree cannot host a CLAUDE.md
  shim — see the Subtree memory note in `CLAUDE.md`).

### Visual rules

**The law is `docs/design/LENS.md` (Lens, 2026-09-30).** `docs/design/CANON.md`
and `docs/design/motion.md` are archived under a header that points there;
their correctness rulings carried over (LENS §1.2). The approved canvas is
the reference for every value. All nine phases are built (LENS §11; Phase 8,
the switch, on 2026-10-04): what renders is Lens, and nothing of the launch
shell is left to restore.

- **One face: Literata** (the operator's ruling of 2026-10-04, LENS §3).
  Headlines 700 tight (issue 68/1.0 −.032em, section 34/1.05 −.028em), prose
  and cue sentences 400 18/1.72 (strong 700), the hook 300 21/1.45, labels
  600 capitals at 12px (eyebrow .18em, meta .16em, chip .14em, button
  .17em), the source line 12 capitals .14em, numbers 700 tabular at
  line-height 1. **No italic sentence anywhere**: the section caption and the
  lit cue line are 500 15.5/1.3 ROMAN (the caption in `--ink-2`), the skim
  caption roman; only the ONE authored emphasis word of a title is italic
  (400, the desk text colour). Worlds differ by ink, **never by face**;
  **nothing below 12px rendered**. The lever is `src/styles/type-v2.css`.
  *Replaces* Lens's two faces, Newsreader and Instrument Sans (2026-09-30).
- **One paper, six inks.** Every desk sits on `--paper` (`#F5F2EB`). A desk's
  colour lives only in its marks, chips, rules, tints and ONE bounded deep
  plate (a hero, a cover, a WebGL scene; LENS §8). Each desk has four inks:
  **text** for words (≥ 4.5:1 on paper), **mark** for fills and lines,
  **tint** for bands and chips, **deep** for the plate. The two limes are
  marks on their own desk's plate only. On a plate, text is `--on-deep`.
  *Replaces* the six page grounds and the two-role `--accent-deep`.
- **The frame is a 1152 content column in 64px margins** (20px on phones), 12
  columns on 24px gutters, sections 96px apart (64 on phones). *Replaces* the
  1280 frame with no side padding. **The issue section is 620 article + 24
  + 520 pinned figure panel** (LENS §5.1, since Phase 3; `src/styles/layout-v2.css`).
  `wide` widens the panel to 620; `bleed`, `split`, `split-flip` and `breath`
  stay valid so the backlist builds, and render as the default: never author
  them.
- **Corners are 6 / 4 / pill; clickable cards lift.** A card is `--paper-2`,
  1px `--hair`, `--r-card` 6px, `--shadow-1`; hover takes an ink border and
  `--shadow-2`, never a translate or a scale. Buttons 44px, `--r-ctl` 4px;
  chips 28px pills on the desk tint. *Replaces* zero radius and the RD-05 flat
  surfaces.
- **The graphic explains itself: cues** (LENS §5). The article's own prose
  carries numbered cue buttons (`[[n]]`) that light the part of the pinned
  figure they name (`cues: [{n, at, text}]`, anchors `data-cue` on the
  component's elements); one caption, the source line in the panel. Two to
  four cues per graphic section, none on the narrative kinds. The schema and
  the `cues.ts` island landed in Phase 3, every kind's anchors in Phase 6,
  and each kind's anchor ids are on its catalog block's `CUES:` line since
  Phase 7, when the pipeline started authoring cues. *Replaces* the
  how-to-read panel, the plain line, the ⤢ expand modal and the canvas's
  beat rail, none of which has rendered since Phase 3; Phase 8 deleted their
  fields, `src/lib/explainers.ts` and their CSS: never reintroduce them, a
  second source emitter, or `.px-viz__src`.
- **A component's contract, enforced by `check:render` (2026-09-22/23), plus
  Lens:** a text cell wraps or truncates, never `nowrap` in a fixed width; an
  outward SVG label wraps or is budgeted in characters against its gutter and
  never leaves its own SVG; a control never floats over content on touch; a
  component renders no source and no caption under a spelling the shell cannot
  see (`__cap` / `__caption`); its copy is desk-neutral; its values size to
  their cell. Lens adds: **labels of at most three words, ONE number set
  large, the figure at ≥ 55% of the section, cue anchors on the elements a cue
  can name, and no motion of its own** (the `build.ts` island builds it,
  Phase 5). **It is not done until `npm run check:render` is clean at 1280
  AND 375 on every page that uses it, and the screenshots have been read.**
- **Motion is one grammar** (LENS §6): `--ease` for entrances and builds,
  `--ease-move` for things that travel, linear for physical loops; 160 / 420
  / 900 / 1400ms and a scene ≤ 4.5s; 80ms stagger; the next beat starts ~70%
  through the last; counters on requestAnimationFrame, lines by dashoffset,
  bars by `scale`, never by animating `width` / `height` / `r`. Reduced motion
  and no JS paint the final state. No overshoot; hover never moves layout.
  **Every build runs through ONE island, `src/scripts/build.ts`, from
  `data-build-scene` / `data-build="n"` / `data-build-kind` in the markup
  (the contract: LENS §6.4, `src/components/AGENTS.md` §11); no component
  animates itself, and `core/Reveal.astro`, `core/VizMotion.astro` and the
  `[data-reveal]` / `.is-in` reveal are retired (Phase 5, 2026-09-30).**
- **The number scale** (LENS §7): stage counter 160 (88 on phones), pinned
  figure headline 96, secondary figures and stat tiles 48, card numbers 40;
  Literata 700 tabular, line-height 1, .12em bottom room on the 160 and 96
  tiers (the comma), the label (12 capitals .16em) 8px below; phones 88 / 72
  / 40.
- **The mark is the phase medallion (RD-10), unchanged.** Lens re-sizes only
  its lockup: the tight mark at a 34px disc with ring 9, a 12px gap, "Parallax"
  in Literata 700 24px on the disc's centre line, the desk register after it
  in 12px capitals; 28px in the footer. Every desk mark ≥ 24px shows the P;
  below 24px the reversed cut. Use `core/Mark.astro` / `src/lib/mark.ts`,
  never pasted SVG. The misuse list is LENS §4.3.
- **In-SVG `<text>` uses a literal font stack, never `var()`** (RD-01b,
  carried: LENS §3.3).
- **CSS prefix isolation** — each component owns a unique `px-<abbrev>` (≤6
  chars). Check `meta.css` for collisions first.
- **Story cards hide a section's chrome, never its data** — `story.css` hides
  `[class$='__cap']` / `[class$='__src']` inside a beat, at depth 1 and 2
  (some kinds emit chrome as a sibling of the graphic root). Graphic
  containers must never end in `__cap`/`__src`; keep that invariant when
  naming.
- **Mobile in-SVG legibility for the scaling charts (2026-09-07).** Those SVGs
  are `width: 100%` over a fixed viewBox, so text renders at `authored x
  (cardWidth / viewBoxWidth)`. The fix is one block in `dataviz-v2.css`: each
  chart gets a `min-width` equal to its own coordinate width and the CARD
  scrolls, so every label lands at the size it was drawn at. **Read that block
  before touching any of it** — it records the exclusions (narrow-viewBox
  forms, the WebGL fallbacks, `climate-spiral`, `flight-of-the-ball`,
  `region-map`) and why each is not a bug. Since Phase 5 the render gate
  follows LENS's 12px floor: TINY (a warning) below 12px, FLOOR (blocking)
  below 9.5px, measured as rendered, the phone pin's zoom taken out.
- **No sitemap integration.** `@astrojs/sitemap` was tried and removed — it
  errored on the collection shape. Verify before re-adding.

**Retired 2026-09-30 by the Lens revamp** (the canvas and LENS §10 are the
reason; do not restore any of them): ~~**Literata as the one face**~~
(restored by the operator's ruling of 2026-10-04, with the launch weights,
case and tracking and no italic sentence; Newsreader and Instrument Sans are
retired in their turn) · the trio of faces before Literata · **zero radius** (`--r-card`, `--r-tile`, `--r-pill` at 0)
and the flat, shadowless surfaces of RD-05 · **the 1280 frame with no side
padding** · **six page grounds** (the dark space, tech and sports pages) ·
**`--viz-edge`**, the 3px top rule on every figure · **the how-to-read panel**
(`howToRead`, `NEEDS_HOW`) · **the plain line** ("In plain terms",
`EXPLAIN.what`) · **the ⤢ expand modal** and its study view · **the beat
rail** of the early canvas rounds. Every one of them was REMOVED from the
code by Lens Phase 8 (2026-10-04): the fields left the schema (a stray one
fails the build), `src/lib/explainers.ts` was deleted, the six theme files
were reduced to their inks, and `base.css`, `dataviz-v2.css` and
`viz-type.css` lost the rules for the retired chrome. Nothing retired still
renders.

→ Palette, colour law, prefixes: **`.claude/rules/design-tokens.md`**.
  JS budget, islands, the gate: **`.claude/rules/js-budget.md`**.
  The whole system: **`docs/design/LENS.md`**.

### Git / deploy rules

- Claude commits only — never pushes. The human pushes manually with
  `git push`. Never `git checkout` / `reset` / `stash` / `restore` a file to
  "undo" something — an agent once wiped hours of uncommitted wiring that way,
  and most of this repo's work sits uncommitted for long stretches.
- **Deploy order is moot since the merge (2026-09-06).** ONE project, one
  deploy: the publication and its API routes ship together, so the old rule
  ("app before publication") cannot be violated. It existed because
  `NewsletterForm` posts to `/api/join` across two independently-deployed
  Vercel projects; both now live in the same build.
- **The apex is canonical; never put a redirect between the reader and the
  API.** Production serves `parallaxlens.com`; `www` 308s to it. That
  direction is load-bearing, not cosmetic: all 17 reader islands bake
  `PUBLIC_APP_URL` as an ABSOLUTE origin at build time, so if the served
  host ever differs from that value, every `fetch` island becomes
  cross-origin — and the redirect answers preflight with a 307 carrying no
  CORS headers, which browsers refuse to follow. Save, reactions, reading
  tracker, annotations, letters, newsletter and account-entry all failed
  silently this way on 2026-09-06 while every page returned 200 and the
  build was green. `canonical`, RSS and OG already declare the apex — the
  redirect was pointing the wrong way, not the code. Flipping it in Vercel
  fixed all seven at once. Repointing the islands at RELATIVE paths would
  retire the whole class; until then, treat the redirect direction as
  part of the contract.
- **`engines.node` must stay a PINNED major (`22.x`), never a range.**
  `@astrojs/vercel@7.8.2` derives the serverless function's runtime from the
  Node version the build runs on, against a hardcoded table that stops at 20;
  anything else silently falls back to `nodejs18.x`, which Vercel rejects at
  deploy time *after* a clean build. `>=20.0.0` resolves to the latest major
  and cost one failed deploy. `scripts/vercel-runtime.mjs` (`postbuild`)
  corrects the emitted runtime and refuses to run against a range. Both retire
  when Astro 5 + adapter v8 land. See `docs/STATE-OF-PLAY.md` §5.2.
- **A new auth-aware route must be declared in THREE places.** Miss one and
  it fails differently each time, all of them quiet:
  1. `export const prerender = false` in the page — miss it and `hybrid`
     prerenders the route at build time with no session, permanently.
  2. `AUTH_ROUTES` / `ADMIN_ROUTES` in `src/middleware.ts` — miss it and the
     route renders for signed-out visitors, because `requireUser` only narrows
     the type; the middleware is what enforces.
  3. `APP_ROUTES` in `public/sw.js` — miss it and the service worker may cache
     a per-session response and serve it to a different reader. `storable()`
     refuses anything carrying `no-store` as a second line of defence, but do
     not rely on that being set.
- **Migrations are the operator's to apply.** Adding a `.sql` file under
  `supabase/migrations/` does not apply it. Write them idempotent
  (`ADD COLUMN IF NOT EXISTS`), state clearly that they are unapplied, and
  never assume a column exists because you wrote the migration for it.
- **No Claude attribution anywhere, ever** — no `Co-Authored-By` trailer on a
  commit, no "Generated with Claude Code" line in a PR description, no agent
  signature in any file, issue or piece of content. This holds **against the
  harness default**: tooling may instruct an agent to add one; the project rule
  wins and the agent does not ask again. Operator ruling, restated 2026-09-05.
- All commits authored with the `shikharsumantech14` GitHub account
  (`git config user.email` must match). Vercel Hobby plan blocks deploys
  from unrecognised commit authors.
- `.env.local` is gitignored (`*.local` rule). Never commit the API key.

---

## 8. Verification — before declaring anything done

```bash
npm run build         # 44+ pages; prebuild runs all four gates first
npm run check:catalog # SECTION_KINDS <-> catalog, order, KIND_PRIORITY, DATA readers, aliases, CUES anchors
npm run check:prose   # the register + composition report (2026-09-13); the
                      # gate form joins prebuild once the backlist passes
npm run design:check  # the ink mirrors, the Lens inks, the one-paper neutrals, the record tokens
npm run graph:check   # the derived project graph is in sync
npm run hooks:test    # the enforcement hooks still decide correctly
npm run check:render  # the render gate (2026-09-23): every published issue,
                      # signed in, 1280 AND 375, measured — see §2. Required
                      # after any change under src/components, src/styles or
                      # src/layouts, and before a status flip. A fix is not
                      # done until BOTH widths are clean.
# app/ is gone (merged 2026-09-06) — `npm run build` now covers everything,
# including the SSR reader-account routes.
```

Both standing greps must return **zero** (scoped to code extensions on
purpose — unscoped, each self-matches the guide documenting it):

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

```bash
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```

**Mobile 375px uses the honest overflow test** — `window.scrollTo(9999, y)`
then `scrollX === 0`. The preview browser reports FALSE overflow: hidden, its
`clientWidth` is 0; displayed, `position: fixed` elements measure wider than the
viewport. Do not "fix" overflow you have not proven this way. **`check:render`
runs this test, and the rest, in a real headless Chrome** — a probe written in
the preview pane against a scaled viewport, signed out, is not verification
(2026-09-23, §10).

→ The full checklist, the per-component checks, and the nine registry places:
  **`/verify-done`** and **`/add-section-kind`** skills.

---

## 8b. Where the detail went — the pointer index

Reference and procedure moved out of this file on 2026-09-01 (CD-03/B4) so it
loads only when relevant. **Rules load automatically when you touch a matching
path; skills load when the task comes up.** This table is the fallback: if a
rule ever fails to fire, open the file directly.

| Looking for | Loads on | File |
|---|---|---|
| The design law (tokens, type, layout, the mark, cues, motion) | on request | `docs/design/LENS.md` |
| Palette, colour law, the two faces, prefixes | `src/styles/**`, `shared/design/**`, `src/components/topic/**` | `.claude/rules/design-tokens.md` |
| JS budget, islands, fallback contract, the gate | `src/components|layouts|pages|scripts/**` | `.claude/rules/js-budget.md` |
| Issue schema + build-breaking bounds | `src/content/issues/**/*.mdx` | `.claude/rules/issue-authoring.md` |
| Voice modes, AI-tell catalog | `research/**`, `**/*.mdx` | `.claude/rules/editorial-voice.md` |
| WebGL subsystem, scene registry | `src/scripts/viz3d/**` | `.claude/rules/viz3d.md` |
| Pipeline cost, model policy, Windows traps | `scripts/**` (the agents are in `scripts/agents/`) | `.claude/rules/pipeline-scripts.md` |
| Component map, SVG conventions | reading any component | `src/components/AGENTS.md` (via its CLAUDE.md shim) |
| The verification checklist | on request | `/verify-done` |
| The nine registry places | on request | `/add-section-kind` |
| Where each category stands | on request | `/pipeline-status` |
| Session orientation / wrap-up | on request | `/catch-up`, `/close-session` |
| History before 2026-08-28 | — | `docs/archive/AGENTS-CHANGELOG.md` |

How this file is kept small: **`docs/CONTEXT-PLAN.md`** (CD-01…CD-12).

---

## 9. Cross-references

- **Current state (read first):** `docs/STATE-OF-PLAY.md` — what is built,
  what is uncommitted, what is compile-verified only, what is still open.
- **Design law:** `docs/design/LENS.md` (Lens, 2026-09-30) — tokens, type,
  layout, the mark and lockup, the reading system and cues, motion, the number
  scale, the stage, what is retired, the rollout by phase. The approved canvas:
  <https://claude.ai/artifact/AhFSGExFKxhc9HNHw5CnRH> (private).
- **Design canon (archived 2026-09-30, superseded by LENS for every visual
  rule):** `docs/design/` — `CANON.md` (master rules; the 2026-09-04
  shell-adoption amendments were **signed 2026-09-05**, `0104915` — §13's two
  universal acceptance checks are a live floor a reviewer can reject on).
  `motion.md` was signed 2026-09-07 (`b06caec`) together with the `--t-page`
  ruling it was waiting on: navigation split off to `--t-slow` (420ms) because
  it answers a click, while in-page settling keeps 600ms. `catalog.md`
  (the 87-kind component palette since the Lens verdict), `motion.md`, the `*-SPEC.md` set,
  `physics/`, `worlds/`, `blueprints/`. Read before any visual work.
- **Long-form project state + change log:** `docs/PROJECT.md` (~1400 lines,
  the canonical historical reference).
- **Editorial pipeline detail:** `research/README.md` + `scripts/README.md`.
- **Voice system canon:** `research/_voice/mode-library.md`.
- **Per-category source allowlists:** `research/_sources/<category>.md`.
- **NotebookLM setup:** `research/notebooklm-setup.md`.

---

## 10. Change log for this file

### 2026-10-04 — One face again: Literata (the Type-Compare ruling)

The operator compared Lens's two faces with the launch design's one on the
canvas board `Type-Compare` and ruled: **Literata everywhere** (display,
prose, captions, labels and numbers) at the launch design's weights, case and
tracking; **no italic sentences anywhere**; the one italic emphasis word in a
title stays. The layout, inks, cards, cues, builds and number tiers are
Lens's, unchanged. What moved:

- `src/styles/type-v2.css`: all four role tokens and `--face-*` → Literata,
  the scale tokens to the board's values, `.px-num` to 700 tabular lh 1.
- Every rule under `src/` by role: headlines 500 → 700 with the launch
  tracking; caps labels 500 / .06em → 600 / .16em (eyebrows .18em, chips
  .14em, buttons and the nav .17em), any caps label at 13–14px or below 12
  to 12px; numbers 600 / lh .92 → 700 / lh 1 with .12em bottom room on the
  96 and 160 tiers; the label under a figure number to 12 capitals; every
  whole-sentence italic set roman, every `em` rule italic 400.
- The 24 component files with literal in-SVG stacks → `'Literata',Georgia,serif`.
- The four layouts load Literata `ital,opsz,wght` 300–700 + italic 400.
- The share cards (`scripts/story/og-card.ts`) draw on Literata 72pt Bold /
  72pt Italic / SemiBold from the googlefonts/literata repo (Google serves
  only the variable font); the Newsreader and Instrument Sans TTFs are gone.
- `scripts/ui-probe.mjs` checks that Literata loaded.

**Standing rule from today:** one face. A component never sets a whole
sentence in italic, and never names a second family.

### 2026-10-04 — Lens, Phase 8: the backlist and the switch

Part A (`280b5c5`) gave every published issue its cues and a cover and
stripped their `plain` / `howToRead`. Part B is the switch, in one change so
no reader sees a half state:

- **The schema** drops `plain` and `howToRead`. The section object is not
  strict, so a bare removal would have let Zod STRIP a stray one in silence;
  instead `retiredField()` in `src/content/config.ts` fails the build on
  either, by name, with the replacement in the message (verified on the dev
  server). The six `2026-06-03-<world>-showcase` drafts lost their last 36.
- **The shell**: `src/lib/explainers.ts` (`EXPLAIN`, `NEEDS_HOW`,
  `howToReadFor`) is DELETED, and with it the `howToRead` prop of
  `core/VizCard.astro` and of the eleven components that forwarded it.
  `viz-type.css` lost `.px-plain*` and `.px-modal__viz`; `dataviz-v2.css`
  lost the city-compare `.cc__*` block and the `.px-bflow__svg` scroll rules
  (both kinds left in the verdict); `docs/design/EXPLAIN-HOW-REVIEW.md` moved
  to `docs/archive/`.
- **The themes** keep their inks and the neutral mirrors `design:check`
  gates, nothing else (1,860 lines to 218): no `--viz-edge`, no per-desk
  component rule, no page texture (earth's contour paper, travel's margin
  ruling), no `pol-` / `ear-` / `trv-` motif kit (no element used one).
  `base.css` lost the launch design's dead blocks (the skim toggle, the
  primer, the section number block, `.px-quote*`, `.px-compare*`,
  `.px-readout*`, the old home list (`.px-home__issue*`, `__title`, `__tagline`), the floor plan's frame step-out), each
  grepped for a consumer first; `.px-viz` reads `--hair` directly. The Lens
  primitives stay even where a page does not use one yet.
- **The scripts**: `project-graph.mjs` reports a `cues` column (the catalog's
  CUES line) where it read `explainers.ts`; `wire-kind.mjs` emits the Lens
  dispatch arm and REFUSES a catalog block without CUES and BUILD lines, or a
  config that still carries `explainWhat` / `explainHow`; the `gate-registry`
  hook no longer watches the deleted file; `check:prose` warns CUES and
  NO-COVER on every status (they were ℹ on a published issue until the
  backlist carried them); `--slug` takes the dated form too (a leading
  `YYYY-MM-DD-` is stripped, and a file named with the date twice matches).

**Standing rules from today:** a desk's colour is a role token, never a rule
in a theme file; a retired field is guarded, not just deleted, wherever a
schema strips unknown keys; nothing retired renders, so there is nothing to
"restore".

### 2026-10-01 — Lens, Phase 7: the pipeline authors cues and covers

- **The catalog** (`docs/design/catalog.md`): every block gained a `CUES:`
  line (its anchor ids, exactly as the component's `Cue anchors:` header
  lists them, `none` on `act-break` / `prose` / `quote` / `analogy`) and a
  `BUILD:` line (the build order and the counter), and lost its PLAIN line.
  The NOTES of the kinds Phase 6 redrew now describe the new drawing.
  `check:catalog` check 7 asserts every CUES id is a `data-cue` in its
  component; the EXPLAIN assertion is gone (`src/lib/explainers.ts` is dead
  code, and Phase 8 deletes it).
- **The agents**: the composer names the cover (§2) and two to four cues per
  graphic row (§3's Cues column, which replaced the plain-line sketch); the
  drafter writes `cover`, `cues` and the `[[n]]` markers; the stylist keeps
  every marker with its sentence and may reword a cue sentence (the stylist
  guard refuses a dropped or added marker, and `plain` left its editable
  list); the verifier traces each cue sentence (❌ CUE-UNTRACED, ⚠️
  CUE-COUNT, ⚠️ COVER-DRIFT) and no longer flags PLAIN-CLAIM, CAPTION-FORM
  or REDUNDANT-HOWTO. The composer and drafter prompts inline LENS §5.2 and
  §8.2.
- **`check:prose`** gained CUES and NO-COVER (ℹ on a published issue until
  Phase 8 authors the backlist). NUMBER-DRIFT still skips `cues` and
  `cover`.
- **Standing rule:** no agent and no author writes `plain` or `howToRead`.
  A cue's `at` comes from the kind's CUES line, never from memory.

### 2026-09-30 — Lens, Phase 0: the design law, and the verdict on the library

The operator approved the Lens design revamp on the Design canvas
(<https://claude.ai/artifact/AhFSGExFKxhc9HNHw5CnRH>, private, 2026-09-29/30)
and its nine-phase implementation plan (0 to 8). Phase 0 writes the rules
before any code:

- **`docs/design/LENS.md` is the design law from today.** The tokens (one
  paper, six desk inks as text / mark / tint / deep, the on-deep set),
  Newsreader + Instrument Sans, the 1152 column in 64px margins, cards /
  buttons / chips, the mark and its lockup (the medallion unchanged, only the
  lockup re-sized), the reading system and the cue contract (a 620 article
  column beside a 520 pinned figure; `cues: [{n, at, text}]`, `[[n]]` prose
  markers, `data-cue` anchors, the lighting), the motion grammar, the number
  scale, the stage, what is retired, and which phase builds what.
- **`CANON.md` and `motion.md` are archived**, bodies unedited, under a
  header that says so and maps each carried correctness ruling (photography
  rejected, the accessibility floor, RD-01b, the motion budget, the reading
  gate, honesty defaults, fallback first, the WebGL line-art doctrine) to its
  LENS section.
- **§7 Visual rules rewritten to Lens**, each replaced rule named, closed by a
  "Retired 2026-09-30" list. §2's Fonts, 3D and library rows, §3, the §4 map,
  §8b and §9 follow. `.claude/rules/design-tokens.md`, `js-budget.md` (the two
  new islands, `cues.ts` and `build.ts`), `issue-authoring.md` (`cues` and
  `[[n]]` arrive in Phase 3; `plain` and `howToRead` deprecated, accepted
  until Phase 8) and `viz3d.md` (ten scenes) updated, and so are
  `src/components/AGENTS.md`, `src/content/issues/_AGENTS.md`, `catalog.md`
  and `catalog-shapes.md`.
- **The verdict on the library, applied: 101 → 87 kinds.** Dropped:
  `beat-sheet`, `plate`, `orbital-shells`, `elevation-profile`,
  `coalition-orbit`, `ballot-flow`, `orbit-globe`, `signal-readout`,
  `data-globe`, `route-globe` (their components, four WebGL scenes, the
  `ballot-flow` blueprint, the catalog blocks, and every EXPLAIN / NEEDS_HOW /
  KIND_PRIORITY / TRIM / narrative-set entry). Renamed: `carbon-gauge` →
  `gauge` (`core/Gauge.astro`), `route-card` → `itinerary`
  (`topic/travel/Itinerary.astro`). Folded: `swing-dial` and
  `throughput-dial` → `gauge` (its lean and capacity variants),
  `itinerary-reel` → `itinerary` (days become stops), `city-compare` →
  `comparison` (its pair form). Each fold keeps the old markup and prefix
  inside the host until Phase 6 redraws it. **The six old names build as
  aliases:** `KIND_ALIASES` in `src/content/config.ts`, resolved by the
  schema on parse, so every consumer of `section.kind` sees the host;
  `check:catalog` check 6 guards the map; `scripts/lib/kind-aliases.mjs`
  resolves them for `check-prose` and `project-graph`, which read MDX
  directly. No published issue used a dropped kind (grep, and the published
  Amazon issue's `throughput-dial` now renders as `gauge` unedited). Five
  drafts lost the sections that did (`2026-05-03-space-components` and the
  earth, politics, space and travel showcases), and their prose was trimmed
  to match.

**Standing rules from today:** author the host kind, never an alias; a
section naming a dropped kind fails the build; build toward LENS, and do not
restore a retired rule because the old shell still renders it (Phase 8
removes the old shell, themes, panel and modal in one deploy).

### 2026-09-30 — The onboarding intro is removed

The operator ruled "scrap this whole intro page". Deleted: `/welcome`
(`src/pages/welcome.astro`), `src/layouts/IntroLayout.astro`, the
`src/components/intro/` set (`IntroStory`, `IntroExperience`, `WorldViz`) and
`src/styles/intro.css`; the home page no longer mounts the first-visit
overlay. The new design will bring a new intro. `/account/welcome`, the
post-signup plate, is untouched and still where `auth/callback.ts` sends a
first-time reader. `/welcome` now 404s; nothing in the repo linked to it.
The `px-intro` / `px-xp` prefixes are free.

### 2026-09-29 — The closing request is gone, the agents leave `.claude/`, a prompt on every paid run

Three of the four questions left open at the end of 2026-09-28 were answered
yes, and the fourth was explained and tabled (COST-PLAN §12.6). Standing
rules changed by the answers:

- **A single-shot pass ends at its Write.** After every Write the agent sent
  one more request to say it was done, and because the Write had outrun the
  five-minute cache, that request re-wrote the whole context: about $3.70 an
  issue on the trial, for replies nothing reads. `scripts/lib/runner.ts`
  takes `stopAfterWrite`, the pass's planned output paths, and a PostToolUse
  hook on Write returns `continue: false` once one of them is written.
  `scripts/pipeline.ts` passes each single-shot prompt's declared `out`, the
  check round's resumed call included. The loops never set it. Measured on
  Haiku through the API door before it went in, for under a cent: 2 requests
  became 1, the file was on disk, and a resumed session still carried its
  earlier context, so the check round still works. A halted run is a
  success with `stopped_after_write` in its ledger row. What it gives up: a
  pass that would have Written twice in one response now ends at the first,
  and corrections belong to the check round.
- **The eight agent definitions live in `scripts/agents/`.** In
  `.claude/agents/` Claude Code listed every one as a subagent type, so a
  session could start the retired route with the Agent tool by mistake.
  `scripts/lib/agent-loader.ts` reads the new path. `.claude/agents/` keeps
  only `voice-checker`, and the memory digests stay in
  `.claude/agent-memory/`. Do not move them back.
- **A paid run started from Claude Code always prompts.** The operator's
  `.claude/settings.local.json` (gitignored, theirs) gained an `ask` list for
  the eight `npm run pipeline:<phase>` forms, `npm run jev:*` and the direct
  `tsx scripts/pipeline.ts` forms. Claude Code evaluates deny, then ask, then
  allow, and a matching ask rule prompts even when a broader allow rule
  matches, so `Bash(npm run *)` no longer waves a phase through, the slash
  commands included.

### 2026-09-28 — The cost plan lands: one pipeline, two wallets, a check pass, Jev

`docs/COST-PLAN.md` v0.1 was signed (CP-01 to CP-10) and built the same day
(`b31ae68`, `1f2071b`), and one trial issue ran through every phase of it
(sports, the Manchester City verdict, `df7d747`). The plan started from a
measurement: the bill was about $31 an issue at list, and 61% of it was four
"short" writing passes that each made 18 to 41 requests, every one of them
re-reading a fixed prefix of about 57,000 tokens that the Claude Code harness
put in front of a 3,000-token agent prompt. About 31,000 of those tokens were
this repo's `CLAUDE.md` and `AGENTS.md`.

**What changed.**

- **The harness diet.** `scripts/lib/runner.ts` runs every agent with
  `settingSources: []`, only the tools its frontmatter lists,
  `permissionMode: 'dontAsk'`, and an effort level and a dollar cap per
  phase. The first request fell from about 57k tokens (54.6k to 58.5k
  measured) to 4,199, and no `CLAUDE.md` reaches the model.
- **Single-shot passes.** The script assembles each pass's inputs, the agent
  answers once and writes one file, and the script does the rest: the
  draft's check round (`check:prose` and the schema check, then one more
  request on the resumed session when either flags), the stylist guard, the
  dossier guard.
- **The check pass**, `pipeline:check`, after research and before the
  storyboard. It recomputes every derived number and confirms every anchor,
  and the script applies its corrections to the dossier. `--topup --slug` on
  research answers a BLOCKED check.
- **Jev**, TypeSafe's decision model through OpenRouter, inside two phases:
  the claim pre-pass before the verifier and the quiz grade after each
  panel. A pre-pass, never a gate. A missing key skips it with a warning.
- **The ledger priced at list**, from each run's token split and its
  5-minute and 1-hour cache writes, with `billedTo` on every row.

**Measured on the trial issue:** $20.40 at list for every phase, 69 requests
in 79 agent-minutes. Like for like, without the three phases the old pipeline
did not have (two check passes and a top-up, $5.70), it cost $14.70, a 55%
cut on the September sports issue ($31 to $34). The verifier found **0
untraced claims** (43 ✅ · 20 ⚠️ · 0 ❌, against 15 ❌ and BLOCKED in
September), and no dossier error reached it: the check pass had corrected
six numbers before the storyboard was drawn. Both panels returned REVISE
with every quiz question right for all four readers. Jev's 71 calls cost
$0.0024 and changed no verdict. The plan's estimate of $11 to $12 was not
reached: the single-shot passes write more output, and their assembled
prompts run about a third larger, than it assumed. The per-phase table is
COST-PLAN §12.2.

**Two things these docs had wrong.** The rules said the pipeline's agents
never saw `CLAUDE.md`. They did, on every first request until the diet,
together with the operator's local allow rules, `Bash(npm run *)` among
them. And until 2026-09-22 05:40 UTC every API-route run drew on the
subscription, not the key, while the SDK reported the key as its source.

**The operator's rulings, the same day. Do not restore what they replaced:**

1. **The slash route is retired.** `/pipeline-<phase>` used to run the agent
   inside Claude Code, where Claude Code loads this file and every tool, and
   where the check pass, Jev and the ledger do not exist. Each command is now
   a wrapper: it runs `npm run pipeline:<phase> <desk> -- --bill subscription
   <flags>` in the background and reports the footer. `/pipeline-check` and
   `/pipeline-stylist` joined them. The commands carry
   `disable-model-invocation`, so only the operator starts one.
2. **One config for both routes, two wallets.** `scripts/pipeline.config.ts`
   (models, effort, budgets) rules every run on both doors, and the Claude
   Code route's all-Opus pin is retired. The door decides only who pays,
   `billedTo` records it, and the cache split proves it: a run on `api` that
   writes 1-hour cache entries has the login back in its path.
3. **An official record sits outside the 40% publisher floor**, written up in
   its own change the same day.
4. **Jev stays**, as a standing part of the pipeline, never a gate.

The detail: COST-PLAN §12, `scripts/README.md` ("Two doors, one pipeline" and
"Jev"), `.claude/rules/pipeline-scripts.md`.

### 2026-09-27 — The June background loops retired

The operator asked whether the three loops of the 2026-06-22 content engine
— the reactive news loop, the evergreen social loop, the RAG research corpus
— could be scrapped without touching the publication or the backend. Measured
first: every scheduled run had failed since the day they shipped (reactive
380 of 380, on a Voyage key that was never a repo secret; evergreen 96 of 96,
because the Agent SDK spawns a Claude Code CLI the runner does not have), the
weekly corpus ingest had reported green for thirteen weeks while `|| true`
masked the same missing key, the corpus held 4 chunks, 114k dead news rows sat
in Supabase, and no dossier, draft or post ever consumed any of it. **Removed:**
the five workflows, `scripts/{evergreen,rag,reactive,social}` and their
`scripts/lib` helpers, the agents `news-classifier` / `social-writer` /
`voice-refiner`, `/admin/social` + `/api/admin/social/[id]` + the dashboard
tile, the `social:* rag:* reactive:*` npm scripts, `cheerio`. **Archived
(CD-07):** `docs/archive/CONTENT-ENGINE.md`, `docs/archive/_voice-social.md`.
**Kept, because the build depends on it:** the OG link-preview renderer, moved
to `scripts/story/og-card.ts` — `story/og.ts` imports it at `prebuild` and
`design:check` mirrors its THEMES. Also kept: the allowlists' `ingest` field
(it is the licence class that decides what may be quoted; the quotability rule
in `research/_sources/README.md` and the verifier's gate now say so without a
corpus) and `voice-checker`. The five tables were dropped by
`supabase/migrations/20260927000000_retire_content_engine.sql` (applied
2026-09-27; the storage bucket went via the dashboard, because Supabase
guards its storage tables against SQL deletes).

**Two standing rules for whatever loops replace them** (also in
`.claude/rules/pipeline-scripts.md`):

- **An agent cannot run from a bare GitHub runner through the Agent SDK.** The
  SDK spawns the Claude Code CLI; `npm install` does not provide it. A
  scheduled job that needs a model installs the CLI or calls the Messages API.
- **Never mask a scheduled step.** `|| true` on the corpus ingest turned a dead
  loop into thirteen weeks of green. A step that may legitimately fail reports
  and exits non-zero; the schedule is the retry.

### 2026-09-24 — Air on wide figures; the render gate becomes a wall

The operator pushed `9ec133a`, read the sixteen issues live and called them
much better, with one residual: some sections felt "fitted to the exact size,
right up against both edges of the middle column". Those were the `wide`
figures, which the 2026-09-23 ruling ran rule to rule while every other
section breathes 69px. **A wide figure now breaks out 45px on each side** —
810 wide, 24px clear of each rule — and the text stays at the measure (§7,
RD-14). Measured on all sixteen issues at 1280 and 375: 0 blocking, 0 warnings.

**The gate is enforced, not documented, from today.** Every textual gate was
green while sixteen issues shipped visually broken, and the operator was
fixing one width by eye and breaking the other. So:

- `.claude/hooks/guard-render.mjs` (PreToolUse on Bash) refuses a `git commit`
  whose STAGED changes affect rendering — anything under `src/components`,
  `src/styles`, `src/layouts`, `src/pages`, `src/lib`, `src/scripts`, the
  schema, or a non-draft issue — unless `research/_ui/last-run.json`, which
  `check:render` writes at the end of every run, carries (a) a fingerprint of
  the rendering tree that matches the tree NOW, (b) `blocking: 0`, and (c)
  coverage of what changed: a full run when code changed, the slug when only
  an issue changed. Edit anything after the run and the stamp is stale; the
  deny message says exactly what to run. `PX_SKIP_RENDER_GATE=1` on the
  commit command is the operator's override, and only theirs.
  `scripts/lib/render-fingerprint.mjs` is the one definition of "the
  rendering tree", shared by the probe and the hook. `hooks:test` covers it.
- The component contract is written where a component author reads (§7
  above, `src/components/AGENTS.md` §3 preamble and step 10,
  `/add-section-kind`), and the publish path runs the gate on the issue
  (`research/AGENTS.md` step 14, `/publish-issue`, `/verify-done`).
- The decision record carries it: **RD-14** (the geometry) and **RD-15** (the
  gate) in `docs/REVAMP-PLAN.md` §1.

**The showcase sweep, same day.** The six `2026-06-03-<world>-showcase`
drafts, the worked examples of every kind, were probed: **32 blocking
findings across 14 kinds** that no published issue had used yet — exactly the
set the diversity floors (≥ 2 new kinds per issue) pull into every round.
Three agents, one per world group, fixed all of them plus the warning-only
kinds, generically (a rule for any data of that shape, never a nudge for the
example): `itinerary-reel` wraps its cards into rows of three on desktop and
scrolls inside its own box on phones (a day card had run 227px past the
column); `commit-grid` sizes its cells to the column at 1280 (it scrolled
sideways) with a per-week floor on phones; `carbon-gauge` had BOTH arcs
sweeping the wrong way, so the gauge hung below its viewBox — it now sweeps
over the top and the filled arc is the USED share, as the catalog and EXPLAIN
always said (the needle moved; no published issue carries the kind);
`altitude-oxygen`, `fare-terrain`, `city-grid`, `momentum-wave`, `pace-ridge`,
`descent-profile`, `lagrange-map`, `ballot-flow`, `chip-die`, `storm-track`
each gained collision-aware label placement (try the other side, stack, drop
the least important, never overlap); `chip-die`'s `overflow: hidden` had also
been hiding two of its tiles' labels behind the 3D side face; `tactics-pitch`
markers had been squashed flat in every mode. **The rule for the WebGL
fallbacks and the aspect-pinned mounts** (`flight-of-the-ball`, `chamber`,
`storm-track`, `constellation-swarm`, `plate-motion`, `terrain-relief`,
`neural-flow`, `packet-trace`, `terminator-globe`): they cannot scroll
sideways without hiding their subject, so they carry two label sets — the
authored sizes for desktop and a phone set that prints at ≥ 9.5px on a 335px
plate — or an HTML / real-pixel SVG label layer over the drawing
(`src/components/AGENTS.md` §10). All six showcases measure 0 blocking,
0 warnings at 1280 and 375. Design calls left for the operator, not defects:
`storm-track` draws a full hemisphere so a basin's track is small (the
region-map fitting question again); `fare-terrain` fills under each ridge
with paper, a flat slab over the sweet-spot band. Run `check:render --slug`
on a showcase before modelling a section on it. On phones a chart drawn for
the 720 measure scrolls sideways inside its card (the 2026-09-07 ruling) and
the region-map on the Indonesia issue is cut at the right edge until scrolled
— a ruling to revisit, not a defect the gate reports.

### 2026-09-23 — The geometry was the bug: one markup, two widths, a render gate

The operator read the six 2026-09-21 issues live, signed in, and found that
the 2026-09-22 fixes had not touched what they saw: the split hero on the ISS
issue now painting over "Nº 14" and the contents list; wide charts with their
text glued to the rule and a 720 hairline under an 860 figure; breath sections
centred in a left-aligned page, and centring the jargon cards and step columns
inside them; a scaling-plot axis title running through the how-to-read panel
above it. Root causes, in order of weight:

- **Two generations of geometry on one page.** `layout-v2.css`'s breakouts
  were derived for the 980 single-column frame, where the margins were empty.
  The launch floor plan (2026-09-08) put the facts rail and the aside in those
  margins and kept `bleed` / `split` as 1080 half-crossings of an 860 column.
  Six of sixteen published issues carry a split, and five of those stages are
  SVGs drawn at 720. **Ruling:** a section has two widths, the measure and the
  column. `wide` puts the FIGURE rule to rule and keeps the TEXT at the
  measure, so the figure breaks out symmetrically. `bleed`, `split` and
  `split-flip` are aliases of `wide` on every viewport until a design pass
  re-derives them on the floor plan; the values stay in the schema so the
  backlist builds, and the agents are told not to author them (composer,
  drafter, storyboard template, `_AGENTS.md`, the authoring rule, CANON §2
  and §3 amended). `breath` keeps its air and its display intro,
  left-aligned. `core/Section.astro` renders ONE markup for every layout: the
  split wrappers put the plain line and source ABOVE the graphic wherever the
  grid stacked, which was every phone. `core-sample` no longer chips its own
  kind name onto the caption row.
- **The instrument was wrong, and it was mine.** The 2026-09-22 probe
  measured every element against its own `.px-section`, so a section that was
  itself the wrong shape passed. It ran signed out, in a scaled preview pane,
  against the dev server. And it ruled the split crossing "designed" and
  painted a ground over the rails, which hid content on the live page. The
  honest answer to "how were these not visible to you" is that the check
  confirmed the ruling instead of testing the page.
- **No rendering gate existed.** Every gate was textual: schema, catalog,
  prose. The diversity floors guarantee two never-rendered kinds per issue, so
  every issue exercises code paths nobody has seen with real data, and the
  operator was fixing one width by eye and breaking the other.

**What exists now, and the standing rule for any visual change:**

- **`npm run check:render`** — `scripts/ui-probe.mjs`, `puppeteer-core`
  driving the installed Chrome (new dev dependency; not in `prebuild`, it
  needs a browser). It loads every published issue as a SIGNED-IN reader (the
  gate's cookie) at 1280 and at 375 with a phone UA, forces the reveals, and
  measures: elements crossing the column (COLUMN), the honest phone overflow
  (FRAME), text clipped by an overflow-hidden ancestor or its own outer SVG
  (CLIP), text printed on text by glyph box (OVERLAP), the ⤢ button on text
  (CHIP), duplicate captions / sources / how panels (CHROME); warnings for
  misaligned edges, touching text, empty stages and tiny text. One screenshot
  per section per width lands under `research/_ui/<date>/` (gitignored, about
  80 MB a run) beside `report.md` / `report.json`. Exit 1 on a blocking
  finding; `--report` to look without failing; `--slug` to scope. **Its first
  run on the sixteen live issues found 49 blocking defects**: 36 were the ⤢
  study button covering captions, readout values and timeline labels on
  phones (the 44px reserve of 2026-09-22 was the wrong shape — on coarse
  pointers the button is now an in-flow row under the graphic, so it cannot
  overlap anything); five data-readout values cut off by their tile; five
  label-on-label collisions in vote-result, scaling-plot and benchmark-chart;
  a clipped climate-strip overlay; two SVG labels hanging across the rule.
  It also measured the text column at 718, not 720: the two 1px rules sat
  inside the 860 cell.
- **The gate runs before a status flip** (`research/AGENTS.md` step 14,
  `/publish-issue`, `/verify-done`) and after any change under
  `src/components`, `src/styles` or `src/layouts`. **A fix for one width is
  not done until the other width's run is clean.** Screenshots are read, not
  just counted: the probe finds what it was written to find.

### 2026-09-22 — The visual layer of the six new issues, measured

The operator read the 2026-09-21 issues live and found the visual layer broken
on every one of them: components spilling their column, a value label reading
"0.6minutes", caption chips sitting under the ⤢ study button, power-flow
labels running off the card, justified text rivering in the narrow columns,
split plates that read as overflow, and the word "subsystem" on a Parliament
issue. Measured with a text-range probe (every text node and every element box
against its `.px-section`, skipping the phone charts that scroll inside their
card by design) at 1280 and 375 on all six, plus an SVG label-overlap pass and
a chip-versus-button pass. **Every cause was a fixed width meeting text nobody
had measured**, and each had been correct once:

- **`nowrap` in a fixed cell.** `margin-bullets` gave its value 104px and
  `white-space: nowrap`; a unit of `"minutes of the scheduled hour"` ran 107px
  past the card. The cell wraps now. The missing space was the same
  assumption from the other side — the blueprint asks authors for a leading
  space and no author has ever written one, so the component supplies it
  unless the unit is `%`, `°`, `′` or `″`.
- **Two things owning one corner.** `.px-viz__cap` and `.px-vexp` both live at
  the card's top-right. The caption row now reserves 44px and the chip wraps.
- **SVG labels longer than their gutter.** `power-flow` prints outward labels
  into a 112-unit gutter at 13px — about sixteen characters. They wrap onto up
  to three tspans.
- **Justification in a column too narrow for it.** The launch ruling justifies
  every flowing paragraph from 640px up; at the 38ch split measure and the
  centred breath intro that rivers. Both go ragged. The 720 measure stays.
- **Breakouts crossing the rails.** A `split` plate is 1078px on the 1280 floor
  plan and passes over 109px of the 170px facts rail and 109px of the 250px
  aside. Left transparent it did not merely cross a rule — the rail's text and
  the plate's own copy printed **on top of each other**. The plate paints its
  own ground now, so it occludes cleanly. The occlusion is the size system's
  L behaving as designed; **do not make the plate transparent again to "show"
  the rails.**
- **Desk copy hard-coded in a universal kind.** `margin-bullets` was written
  for spacecraft and shipped "this subsystem does not close" under eleven
  bills. Its table copy is desk-neutral.

**Four more found by the probe, none of them in the brief:**

- **`[data-viz-root]` was missing from the phone card-scroll rule.** Eleven
  kinds carry a bespoke figure root marked with that attribute instead of
  `.px-viz`; `region-map` is one, and it is the only bespoke root in the
  min-width list, so its 800px SVG had nothing to scroll inside and pushed the
  page to 820px on a 375px phone — on the earth and travel issues both. The
  honest overflow test catches this and nothing else did.
- **`attrition-waffle` cancelled padding that no longer exists.** Its
  `margin-inline: -30px` offset `.px-viz`'s side padding; the launch design
  flattened the card to `padding: 14px 0 0` in 2026-09-08 and from that day the
  negative margin simply hung the grid 30px over each edge (a 385px page). The
  card is already the full column: removing the bleed gives a 14.85px cell,
  better than the 14.7px the bleed was written for.
- **`arch-stack`'s phone rule caused the overflow its comment claimed to
  prevent.** The 22px stage padding is a measured reserve for the front slab's
  ~1.105× perspective magnification; the `max-width: 420px` block cut it to
  14px and the slab landed 2px over the card on both edges. The phone rule now
  tightens the vertical only.
- **Six components spelled the caption hook `__caption` and seven spelled the
  source hook `__source`**, so `[class$='__cap']` missed them and `core/Section`
  printed a second copy of both. Every `region-map`, `carbon-gauge`,
  `elevation-profile`, `orbital-shells`, `commit-grid` and `journey-map`
  section with a caption printed it twice. This is the **third** time this
  exact suffix gap has shipped (the 70 `__src` emitters in 2026-09-04,
  `Comparison.__source` in 2026-09-15). The seven source emitters are gone —
  `core/Section.astro` is the one source emitter, still — and the caption rule
  matches both spellings, excluding `.px-seats__caption`, which carries
  seat-chart's subtitle rather than its caption.

**The standing rule that follows, and it is not negotiable for a new
component:** a text cell wraps or truncates with an ellipsis, and **never**
relies on `nowrap` inside a fixed-width cell — the author will one day write a
unit longer than the cell, and they will be right to. Caption chips wrap.
An outward SVG label wraps, or is budgeted in characters against the gutter it
is drawn into. A card's copy is desk-neutral: 101 kinds run under six worlds,
so no component names a desk's furniture. And a component renders **no**
caption and **no** source of its own under a spelling the shell cannot see —
if it carries a caption it uses a `__cap` or `__caption` hook, and the source
belongs to `core/Section.astro` alone.

**Not fixed, and it needs a ruling.** `region-map` has no projection fitting:
both `naturalEarth` and `mercator` are hardcoded to a world scale
(`.scale(140)` / `.scale(128)`), so a regional story draws the whole globe and
crams its labels into one corner. On the earth issue that is thirteen
overlapping labels — "INDONESIA" sits on "Jambi" at 95% — and no CSS reaches
it. The fix is `fitExtent` on the union of the zones and markers, which
changes every published region-map, so it is a design call, not a bug fix.
The travel issue's region-map is unaffected (its markers spread).

### 2026-09-16 — The API route brought current; the diversity floors

The operator's brief for the next round (two new issues per desk, on the
API route): the rewritten issues still read as text, the same few components
keep appearing, and issues lean on one or two sources. Measured before
changing anything: `you-think` in ten of ten published issues, `timeline` and
`data-readout` in nine, `number-sense` in eight, `jargon-buster` and
`three-steps` in seven — the four plain-language kinds built on 2026-09-13
had become the workhorses and were carrying the 60% visual floor as
typographic cards; 76 of 101 kinds had never reached a reader; four issues
rested on one or two publishers (the token bill: seven sources, one domain).

**Standing rules added — do not relax them back to "visual":**

- **A card is not a graphic.** `you-think`, `number-sense`, `jargon-buster`,
  `three-steps` and `data-readout` count toward the 60% visual floor but not
  as drawn graphics. REGISTER-PLAN §5.1 gained four rows: ≥ 40% of sections
  drawn graphics with ≥ 3 graphic kinds; the four cards at most once each
  and ≤ 3 in total; ≥ 2 graphic kinds new to the publication (the ledger in
  `docs/generated/PROJECT-GRAPH.md`); ≥ 8 sources from ≥ 5 publishers, none
  above 40%. Every agent carries them; the storyboard template gained §9,
  the kind ledger, where the composer tallies them before the draft; and
  `check:prose` flags FEW-GRAPHICS · CARD-HEAVY · NO-NEW-KIND ·
  SOURCE-NARROW (warnings, so the backlist still builds). Discovery now
  names three drawn graphics per candidate with the source that carries
  each one's data — the diversity starts at candidate selection, not at the
  storyboard.
- **The API route had gone stale in ways that would have failed on the
  first call.** `pipeline.config.ts` pinned the drafter and stylist to
  `claude-opus-4-1`, retired on 2026-08-05. Moved to the current generation
  (`claude-sonnet-5` / `claude-opus-5`, both verified live through the SDK).
  **The operator then ruled every phase onto Opus 5 except the reader
  panel**, overturning the May split: the verifier is brand protection and
  needs the reasoning, the researcher's dossier decides what the graphics can
  draw, and the panel stays on Sonnet so it never judges its own drafter's
  prose. **Costs are measured, not estimated, from here on:** every run
  appends its actual dollars and tokens to `research/_costs/ledger.jsonl`
  and `npm run pipeline:costs` totals them per issue and per agent. The SDK's spawned CLI
  was also loading the desktop app's seven claude.ai connectors (196 tools
  instead of 28) into every run; `runner.ts` sets `strictMcpConfig`. The
  footer prints the token split, because every run writes ~35–50k tokens to
  a one-hour cache on its first turn and that is what a short run costs.
- **Two issues per desk needs `--slug` / `--candidate`.** Every phase after
  research found its input by "most recent file in the folder", and two
  same-day files from one desk sort by slug. `--slug <dossier-slug>`,
  `--candidate C-NN`, `--model <id>` and `--count <n>` are in
  `scripts/pipeline.ts`; `scripts/README.md` has the table.
- Prompts tell the agents today's date (an agent under its own system
  prompt is never told it); the stylist prompt names the v2 contract, not
  the v1 mode library.

### 2026-09-15 — The unread-field sweep: thirteen documented fields nothing rendered

All 101 kinds were swept, catalog `DATA:` line against what the component
actually reads BELOW the frontmatter fence (a props interface is a
declaration, not a reader — which is exactly what hid every one of these).
**Thirteen fields were documented, authored against, and never rendered.** The
three found by accident during the Phase 6 rewrites were the smallest of them:

- **`comparison`'s entire documented shape had never been implemented.** The
  catalog said `{ columns: [{label, items}] }`; the component has always taken
  `{ sides, rows }`. A section authored from the catalog rendered an empty
  card. BOTH shapes render now — `columns` is the list form (parallel columns
  that do not pair up row by row), `columns` wins when present — because
  re-pairing eight sourced statements into rows they do not form would have
  been an editorial rewrite, not a fix.
- **`tactics-pitch`'s `role` was the worst live case.** The published Arsenal
  issue authors x / y / role and NO `num` or `name`, so the pitch shipped
  eleven blank discs under an intro promising "each disc is one player in the
  position he holds". The disc now shows `num`, falling back to `role`.
- **`data-readout`'s `emphasis` reached the DOM and painted nothing** — found
  while migrating the phantom `accent: true` onto it. The component has
  written `data-emphasis` since the v2 port, but its CSS stayed behind on the
  RETIRED `.px-readout__tile` prefix in the six theme files. **25 flags across
  8 published issues** were rendering flat. Restored once, in
  `dataviz-v2.css`, on the class the component really emits.
- Also rendered: `benchmark-chart.sublabel` (the Kessler hero, designed around
  it in the approved storyboard), `city-compare.rows[].note`,
  `climate-calendar.months[].note`, `league-table`'s `gf` / `ga` (its prop is
  literally named `showGoals` and only GD was emitted).
- Struck, with authored content moved or removed: `data-readout.accent` (→
  `emphasis: "key"`), `city-compare.flag` (emoji — no raster imagery),
  `channel-ternary.corners[].id` + `entities[].short` (the plot carries no dot
  labels by design), `terminator-globe.showEoT`, `adoption-curve.xLabel`.
- **Not a gap, and recorded as such:** the annotation contract's `side` /
  `series` on single-series kinds. `_ANNOTATIONS.md` §1 calls `side` "a hint
  only" and `series` a multi-series field; each component already said so in a
  comment. They sit in `ACCEPTED_UNREAD` now, where a silent drop has to be a
  stated decision.
- One adjacent find: `Comparison` was still emitting its own source line, so
  any comparison with a source printed it twice. It ends `__source`, not
  `__src`, which is how it survived both the 2026-09-04 sweep and story.css's
  `[class$='__src']` beat rule.

**`check:catalog` gained check 5, so this class cannot recur:** every field in
a catalog DATA line must be read by its component, its dispatch arm, its
direct imports or its WebGL scene. 852 fields checked. A bare prop forward to
the kind's own component does not count as a reader — that is the bug's exact
shape. Deliberate exceptions go in `ACCEPTED_UNREAD` with a reason.

### 2026-09-15 — Phase 6 closed: all ten published issues are in the register

The remaining six (kessler, transgender-ratchet, the token bill, amazon,
asteroid, cockroach) were rewritten in place under their own slugs, each
through storyboard (operator-approved) → draft → panel → stylist → second
panel → verifier → `check:prose`. All six passed the second panel with every
quiz question answered by all four personas, and all six verifiers returned
**zero untraced claims across 303 checked**. **All ten now clear every
composition floor** (≤ 1,100 reader words, ≥ 60% visual, ≤ 80 words before the
first graphic, ≤ 12 names), against a backlist that averaged 1,573 words at
49% visual with up to 639 words of head and 55 names. Six kinds reached
readers for the first time: `power-matrix`, `you-think`, `jargon-buster`,
`three-steps`, `number-sense`, `bill-passage`.

**Standing rules set by this phase — do not restore what they replaced:**

- **The drawing rule.** Where a source gives a band, DRAW THE LOW END and put
  the band in the copy (caption or label), not in the mark. Set on the Amazon
  rewrite, where the bars sit at 3.7 and 1.5 and the dial needle at 17 with 18
  named in prose. Both choices weaken the issue's own claim rather than
  flatter it, and that is the point.
- **The quote-attribution fallback.** When a quotation cannot be matched to
  the primary record, keep the reported wording, attribute it to the OUTLET
  that reported it rather than to the speaker, and reframe any section that
  claims to be "the record". Ruled on the transgender-ratchet rewrite, where
  the Lok Sabha record says जैविक स्थिति ("biological condition") at the one
  word that carries the claim and the reported English says "gender identity"
  — unresolved rather than disproven. **Do not cite the primary record on that
  section**: doing so re-asserts the authority the fallback removed, and it
  passes every automated trace check while doing so.
- **The currency rule gained two composition clauses** (contract §3 rule 4):
  **no rupee bracket inside a dated `timeline` event**, because a timeline
  records what was true on a day, and **none on a per-token rate card**
  regardless of vintage. The conversion's rate AND its month go on that
  section's source line, so a later rate can never read as the date of the
  figure.

**A dossier can go stale about its own allowlist, and it fails silently
towards weaker sourcing.** Three did. The politics dossier sent a researcher
to an unparseable PDF while `indiacode.nic.in` sat on the allowlist at T0, and
wrote off NALSA because *indiankanoon* is off-list while `sci.gov.in` is
listed twice; earth predates Global Forest Watch reaching T1. Cost: two
published claims rested on newspapers for four months. **When a dossier says a
source is off-allowlist, check the allowlist, not the dossier.**

Five published errors were corrected on the way, none of them stylistic: a
"three laws" count that was two (and the 2016 Bill cleared the Lok Sabha
before lapsing in the Rajya Sabha, so it is not "lapsed in committee"
either); the minister's quote above; a NASA sentence trimmed and
recapitalised inside quote marks; "either tipping point ends the same way",
which the record splits by branch; and a `power-matrix` cell giving an account
control over copies its readers held.

### 2026-09-14 — Phase 4 done; two rulings on the register

The four flagship issues (delimitation, El Niño, Arsenal, the Everest/Fuji
queue) are rewritten in the register and committed under their original
slugs, each through the full v2 pipeline with zero untraced claims. Two
published numbers were wrong and are corrected (Arsenal's 28.5 → 28.3 xGA,
"a quarter" → 35.9%). Standing rules changed by the operator's rulings — **do
not restore them**:

- **Currency (contract §3 rule 4).** Foreign money is the primary figure. A
  CURRENT figure gets "(about ₹…)" in brackets after it, the rate and month
  on the source line; a HISTORICAL figure is never converted at today's rate.
  Replaces "every dollar figure carries its rupee equivalent". An issue whose
  only money is historical carries no ₹, and the gate counts an Indian habit
  (cricket, the monsoon) as Indian ground.
- **The machine-prose marks (contract §6, tells 1 and 18–22).** No em-dash in
  reader-facing prose by default and a hard cap of one per issue; no
  semicolons in prose, captions or notes; colons only before a list, a gloss
  or a quote; the AI word list (*delve, robust, leverage, testament, pivotal,
  notably…*) never; "not about X, it's about Y" in any dress counts against
  the one-reframe cap; no rhythmic triplets, no sentence-opening "Notably",
  no mirrored close. `check:prose` flags each (EM-DASH, SEMICOLON, AI-WORD,
  OPENING-ADVERB, NOT-X-BUT-Y). Twenty-two tells.
- **Captions render for every kind.** `core/Section.astro` prints the
  section's caption below the graphic where the component has no caption
  slot of its own (timeline, seat-chart, vote-result, bill-breakdown,
  comparison); a `:has()` rule keeps it to one per section. Until 2026-09-13
  an authored caption on those kinds rendered nowhere.
- **`skimCaption` is not a restatement site**: it renders only in Skim
  mode. Restate in the next section's intro or the caption.

### 2026-09-13 — The register plan: plain Indian voice, component-first issues

Reader feedback after the launch design — a wall of words, hard to read,
language only fluent readers follow — was measured rather than assumed
(`docs/REGISTER-PLAN.md` §1, **signed 2026-09-13**). The finding inverted the
obvious fix: by every readability formula the published issues were already
*easier* than Finshots; what they lacked was hand-holding (zero restatements,
zero questions, zero analogies per thousand words against Finshots' seven,
two and a half, and two), the copy was fragmented into ~40 blocks an issue
(much of it explainer chrome), the reader met ~300 distinct names, and the
register was unplaced (₹, crore and Hinglish: zero occurrences in ten
issues). Only 20 of 98 kinds had ever been published; six kinds were 79% of
sections. Standing rules changed by the signature — **do not restore them**:

- **The runtime contract is `research/_voice/_voice-core.md` v2** (§6): the
  register outranks the mode; plain Indian English by default; a Hindi word
  only where it is the natural word, never load-bearing, never in the
  precision layer; the fifteen rules; twenty-two AI tells; CONVERSATIONAL the
  default job; SATIRICAL barred from politics; DRY WIT a device; LYRICAL ≤ 1
  paragraph. Lexicon and jargon list beside it; `mode-library.md` amended,
  not rewritten, and loses to the contract.
- **The pipeline has a storyboard step and a reader panel** (§5): `composer`
  writes the storyboard (kinds by data shape, `docs/design/catalog-shapes.md`;
  the hero; word budgets; the head; the three quiz questions); the operator
  approves it (`GATES.storyboard` in `scripts/pipeline.config.ts`, read by
  both routes); the drafter executes it; `reader-panel` reads the draft as
  four Indian personas and answers the quiz from the draft alone, twice per
  issue. The drafter's inline eleven-kind list — the cause of the six-kind
  monoculture — is gone.
- **Composition floors, not just ceilings** (REGISTER-PLAN §5.1): ≥ 6 in 10
  sections visual; never two text-only adjacent; the first section a graphic;
  ≤ 3 prose sections of ≤ 200 words; ≤ 1,100 reader-facing words; ≤ 80 words
  before the first graphic; ≤ 12 names. `npm run check:prose` reports them
  (report mode; `check:prose:gate` joins `prebuild` once the backlist passes).
- **The how-to-read default is per kind (RG-19, re-taking the 2026-09-04
  ruling with the measurement it lacked):** `howToReadFor()` in
  `src/lib/explainers.ts` renders an authored paragraph for any kind and the
  default only for `NEEDS_HOW` kinds — instruments, WebGL scenes,
  counter-intuitive forms. The source runs inline on the plain line.
- **Titles state the finding**; the "The ‹Noun› That ‹Verb›s" construction is
  retired; hooks carry a number, a "you", the twist.
- **The old published issues are not a voice reference.** They are rewritten
  under Phase 4 of the plan (four flagships first), then the rest.

**Phase 3 landed the same day** (RG-09, RG-20): four universal plain-language
kinds in `core/` — `you-think`, `jargon-buster`, `number-sense`,
`three-steps` — with blueprints in `docs/design/blueprints/core/`; `analogy`
generalised to a this ↔ that mapping (the legacy joint-family shape still
renders); `hero` retired from the registry, the template and the one draft
that carried it (**library 101**); and the annotation slot,
`data.annotations[]`, on `timeline`, `climate-strip`, `adoption-curve`,
`benchmark-chart`, `approval-chart`, `scaling-plot`, `xg-race`, `elo-river`
(`docs/design/blueprints/_ANNOTATIONS.md`) — a ≤ 12-word callout on the mark,
in the precision layer, verified on the showcases. `wire-kind.mjs` emits the
RG-19 idiom and takes `world: 'core'` / `vizcard: false` / `narrative: true`;
it skips the priority score when the kind's name is already in `story.ts`
(a TRIM entry triggers that) — add the score by hand. The VizCard set is
twelve kinds.

Not yet built from the plan: the rewrites (4, 6), the copy deck and the
EXPLAIN batch (8.2, 8.3), the real-reader protocol (7.4), the `hi-Latn`
span (RG-18).

### 2026-09-08 — The launch design (public launch 19 September)

The operator reviewed the live product against the Claude Design handoff and
ruled that its loose adoption was the problem, not the handoff: the reading
column was 436px because the handoff's three-column issue grid had been put
into a 980px frame; the product ran three typefaces where the design runs one;
the brand lockup was placed by its file's clear space, not its ring. A canvas
prototype (twelve artboards, desktop + phone) was drawn from the handoff's own
`Parallax Web.dc.html`, approved, and then implemented. Standing rules changed
by that ruling — **do not "restore" them**:

- **Literata everywhere** (§2, §7). The three role tokens survive as names
  only. `type-v2.css` is the lever; the share cards use static Literata Bold /
  Medium (`scripts/social/cards.ts`, `scripts/fetch-fonts.mjs`).
- **1280 frame, hairline bands, scoped page styles** (§4, §7). `.px-wrap` has
  no padding; `meta.css` is tokens only (816 → 60 lines); the launch
  primitives live at the end of `base.css`; the six themes lost their
  per-world type overrides of the section chrome.
- **`--r-pill: 0`** (§7) — the RD-05 carve-out is closed.
- **The house is the politics record** (§3, `meta.css`) — the canvas was
  approved in it, and the mark's house cut already sat at 325°.
- **The masthead lockup** (`core/Masthead.astro`, `.mh`): the medallion drawn
  TIGHT (`Mark tight` — the ring is the edge), a 25px/700 wordmark with its cap
  centre on the disc centre (measured −1.5px nudge; −2px at 21px), the desk
  register centred on the same axis; nav Home · Desks · Archive · About; the
  live badge; the account slot; a square Subscribe. Below 768px a native
  `<details>` Menu. The footer (`core/Colophon.astro`) uses the same lockup.
- **The issue page** (`pages/issues/[slug].astro`): `core/IssueHead.astro`
  (meta strip · eyebrow · headline · hook · primer on a 4px accent rule) →
  the floor plan with a 720 measure, the facts rail (№ · published · reading
  time · sources · voice) and an aside (the dek, a contents list, share) →
  `core/ReactionsBar` (four hairline cells) → `core/LettersBlock` (rows + a
  square form) → `core/Sources` (260px label column) → desk / next-issue nav.
  Phones fold the rails into a 2×2 facts grid. `core/ReadingToolbar` is a
  pinned flat strip with a 2px ink rule. **One body register:** prose and
  section intros are both 18px/1.72 Literata in ink, JUSTIFIED with
  hyphenation from 640px up (every flowing paragraph in the product is —
  ledes, titles, captions and rows stay ragged); the drop cap was retired the
  same day by ruling, "simple and consistent across all sections". **Margin notes are gone**
  (`AnnotationLayer` deleted; its API and moderation queue remain for
  letters). `Hero`, `Banner`, `Primer`, `Footer` deleted.
- **One desk template** (`desk/DeskIndex.astro`); the six bespoke fronts are
  deleted. Desk copy is `src/lib/desks.ts` (`DESK_COPY`), shared with the home
  cards so the two can never disagree.
- **Home, About, Archive rebuilt; `/subscribe` added** (free dispatch on the
  left, membership on the right with ₹149/mo struck through to ₹0 for the
  beta — the operator's ruling; "Become a member" opens a free account). All
  numbers on the home page are derived from the published collection.
- **New kind `plate`** (`core/Plate.astro`, 98 kinds): a framed photograph
  with caption and credit that renders NOTHING without an image — no empty
  frames on launch day. Narrative for every gate (no plain line, no how-to-
  read, not the reading gate's free graphic, never a story card).
- `IssueRows` (`home/IssueRows.astro`) is the one row implementation; its
  `.px-archive__*` hooks keep the archive's filter island unchanged.
- Measured, not assumed: 720px measure at 1280; masthead one row at 1280
  with ~230px spare; lockup centres within 0.2px; 412px pages pass the
  honest overflow test; every menu link is 44px; the full gated build,
  `check:catalog` (98 ↔ 98), `design:check` and `hooks:test` are green.


### 2026-09-04 — Shell adoption (Phase 6.1) lands; REVAMP-PLAN v3 signed

Eleven commits. Durable changes to the standing rules recorded here; the
phase state is in `docs/STATE-OF-PLAY.md` (v3) and the decision record in
`docs/REVAMP-PLAN.md` (v3, signed 2026-09-04: RD-10…RD-13 govern, RD-03/07/09
struck not deleted, order is look-first per RD-13).

**(1) Explainability chrome has ONE render site.** `core/Section.astro` now
renders, for every kind, the how-to-read panel ABOVE the graphic
(`howToRead ?? EXPLAIN[kind].how` — the `how` fallback is LIVE for the first
time; before this an authored `howToRead` on any of the 87 non-VizCard kinds
was silently dropped) and the plain line with `Source · …` as its second line
BELOW (`.px-plain__src`, from `section.source ?? data.source`). The seventy
per-component `.px-viz__src` emitters were stripped; the class has zero
emitters and zero rules. VizCard no longer renders source (still accepts the
prop) and renders the how-to-read inside the card for its ten kinds;
`dataviz-v2.css` hides Section's copy via `:has()` so each section shows
exactly one panel. The ⤢ modal portals the card, so it shows no source —
ruled as-is. §4 and §7 updated.

**(2) Surfaces are flat (RD-05).** `.px-viz` and every reading/home surface
lost radius and shadow; hover is border-colour only; every figure wears a 3px
`--viz-edge` top rule (new per-theme token: ink on light desks, accent on
dark). 115 `box-shadow` declarations → 64; ten of seventeen theme 'elevated
card' rules were v2-port orphans and are gone. The radius flip lives in
`base.css :root`, not `shared/design/tokens.css` (app/ consumes those);
`--r-pill` untouched. Measured: three token flips reach 99 of 249 radii, not
the plan's '128 of 267'. Toolbar `.rtb` is flat (paper + 2px ink); glass
survives on modal chrome only. story.css hides `__cap`/`__src` at depth 1 as
well as depth 2.

**(3) Instruments.** scaling-plot (LOG/LINEAR toggle), xg-race (minute scrub)
and climate-spiral (month scrub) gained controls — both projections / all
per-step tables precomputed in frontmatter, native inputs shipped hidden and
unhidden by the island. `px-inst__readout--sized` (+ `.px-inst__sizer`) is an
OPT-IN modifier that reserves true readout height with a hidden worst-case
twin; it must stay opt-in (StateTimeline mixes inline children). Authoring
rule for instrument `howToRead`: static reading leads, control clause trails.

**(4) Canon.** `CANON.md` + `motion.md` amendments (§1 flat surfaces, §7
source-once, §10 four-layer stack + one-panel rule, §11 glass modal-only, new
§14 Surfaces and elevation; `cardLift` RETIRED, `hoverLift` marks-only,
`pageEnter`/`worldFade` named at `--t-page` 600ms) are committed as a MARKED
DRAFT awaiting the operator's signature. Also open: the `--t-page` retime,
Phase 5's mobile font bump on ScalingPlot/XgRace/ClimateSpiral, the 29
draft-only EXPLAIN cues, a JS-gated `howToRead` control clause (schema call).
Next per RD-13: 6.3 type harvest, beginning by MEASURING the font binaries
(RD-08's 16→18px is conditional on it).


### 2026-09-01 — Context system Phase B4: this file trimmed 901 → ~615

Reference and procedure moved out of the always-loaded block into
path-scoped `.claude/rules/` and on-demand skills (CONTEXT-PLAN CD-03).
Resident cost roughly halves; **nothing was deleted** — §8b is the pointer
index to every destination.

Moved: the JS-budget/island prose (→ `js-budget.md`), the historical
per-world font table (→ `design-tokens.md`), the AI-tell catalog (→
`editorial-voice.md`), the pipeline cost + model tables (→
`pipeline-scripts.md`), the schema and visual detail (→ `issue-authoring.md`,
`design-tokens.md`), the §8 checklist (→ `/verify-done`, `/add-section-kind`),
and 191 lines of change log before 2026-08-28 (→
`docs/archive/AGENTS-CHANGELOG.md`).

**Kept here regardless of length (CD-04):** §1 identity, §4 the layout map,
§7 content and git/deploy rules, the standing greps.

**One deliberate deviation from the plan.** CD-03 says verify a rule fires
before deleting its copy — but a session cannot restart itself to observe
that. Rather than delete on faith, §8b keeps an explicit pointer to every
destination, so a rule that fails to fire degrades to "the agent is told
where to look" instead of "the knowledge is gone". **Next session should
still confirm each rule fires** via `/context` on a matching file; if one does
not, fix the glob or move that content back.

**~615, not the ~250 target.** §4 (the layout map) and §7 (hard rules) are
CD-04-protected and account for most of the remainder. The plan states the
target is not a promise: correctness outranks the line count.

### 2026-09-01 — Context system Phase A: the subtree guides now actually load

`docs/CONTEXT-PLAN.md` (CD-01…CD-12) is the plan; this is its first phase.

**(1) A live defect, fixed.** `CLAUDE.md` claimed subtree `AGENTS.md` files were
"picked up when working in their tree (via the agents.md cascading-read
convention)." **That was never true** — Claude Code reads `CLAUDE.md`, not
`AGENTS.md`, and subdirectory discovery covers `CLAUDE.md`/`CLAUDE.local.md`
only. The root guide loaded solely because root `CLAUDE.md` `@`-imports it.
Everything below was invisible: `src/components/AGENTS.md` (~17.1k tokens),
`app/AGENTS.md` (~8.3k), `src/content/issues/_AGENTS.md` (~8.0k),
`research/AGENTS.md` (~3.9k) — **~37k tokens of convention that never entered a
session.** Every agent that ever edited a component did so without the SVG
rules, the prefix table or the nine-registry-place list. Fixed with three-line
loader shims (`src/components/CLAUDE.md`, `app/CLAUDE.md`,
`research/CLAUDE.md`); the guides stay in `AGENTS.md` for portability.

**(2) A new trap, found while fixing (1).** `src/content/issues/` **cannot host
a `CLAUDE.md`**, and neither can `src/content/`. The collection is
`type: 'content'`, so Astro parses every `.md` at the collection root as an
entry (`InvalidContentEntryFrontmatterError`) and rejects any `.md` directly in
`src/content/` as belonging to no collection (`UnknownContentCollectionError`).
Both break the build; both were verified, not assumed. This is the same trap the
guide's leading underscore exists to dodge. That subtree is reached by
`.claude/rules/issue-authoring.md` instead — a rule lives outside `src/`, so
Astro never sees it. **Rule of thumb: inside `src/content/`, put agent
instructions in `.claude/rules/`, never in the tree.**

**(3) `claudeMdExcludes`** now skips `Parallax Design System Revamp/**` (11 MB,
140 files, its own AGENTS.md, explicitly "stale background" per RD-02) via a
committed `.claude/settings.json`.

**(4) `.claude/rules/` exists now.** Path-scoped instruction files that load
only when a matching file is touched. First occupant is the issues rule above.

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

### Earlier entries — archived

Entries before 2026-08-28 moved to `docs/archive/AGENTS-CHANGELOG.md`
(2026-09-01, CD-03/B4): 191 lines of history that loaded into every
session while being needed in almost none. They record *why* the standing
conventions exist — read them when a rule looks arbitrary. The full
narrative history is `docs/PROJECT.md`.
