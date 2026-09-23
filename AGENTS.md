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
| Fonts        | Google Fonts — **ONE family, Literata** (launch design, 2026-09-08). The three ROLE tokens `--font-display` / `--font-body` / `--font-mono` survive so 101 kinds keep compiling, but all resolve to Literata; roles differ by size / weight / case / tracking (display 700 tight, body 400, labels 600 small capitals tracked .14–.20em). Tabular figures on `<body>`. The trio (Fraunces / Schibsted Grotesk / JetBrains Mono) and the per-world faces before it are retired; the share cards render on static Literata Bold / Medium from `assets/fonts/`. |
| Feed         | `@astrojs/rss` 4.0.x                                |
| Node         | `22.x` — a PINNED major, never a range (§7)          |
| Hosting      | Vercel, ONE project (`parallax`), auto-deploy on push to `main` |
| Agent SDK    | `@anthropic-ai/claude-agent-sdk` 0.2.x (for pipeline CLI) |
| Data viz     | `d3-geo` + `topojson-client` + `world-atlas` (build-time maps only) |
| 3D / WebGL   | `three` (self-hosted; lazy-loaded only by the **14** WebGL section kinds, one code-split chunk **per scene** — registry: `src/scripts/viz3d/scenes/index.ts`) |
| Section library | **101 kinds** in `SECTION_KINDS` (`src/content/config.ts`), 1:1 with the `## <kind>` blocks in `docs/design/catalog.md`, same order. `npm run check:catalog` asserts that pairing **plus** EXPLAIN + KIND_PRIORITY coverage **plus** a reader for every field in every `DATA:` line (check 5, 2026-09-15), and runs in `prebuild` — so a half-wired kind fails the build. |

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
npm run pipeline:discover    <category>    # Phase 1 — discovery agent
npm run pipeline:research    <category>    # Phase 2 — researcher agent
npm run pipeline:storyboard  <category>    # Phase 2.5 — composer agent (you approve the storyboard)
npm run pipeline:draft       <category>    # Phase 3 — drafter agent (refuses an unapproved storyboard)
npm run pipeline:panel       <category>    # Phase 3.2 / 3.7 — reader-panel agent, the comprehension gate
npm run pipeline:stylist     <category>    # Phase 3.5 — stylist agent
npm run pipeline:verify      <category>    # Phase 4 — verifier agent
#   flags (2026-09-16): -- --slug <s> (storyboard…verify) · --candidate C-NN
#   (research) · --model <id> · --count <n> (discover) — two issues per desk
npm run pipeline:costs       [-- --since <date> | --category <cat>]
                          # what each agent ACTUALLY cost per issue, dollars and
                          # tokens, from research/_costs/ledger.jsonl (every run appends)
npm run check:prose          [-- <slug>]   # the register + composition report (gate: check:prose:gate)
npm run check:render         [-- --slug <s> --widths 1280,375 --report]
                          # the RENDER gate (2026-09-23): headless Chrome loads every
                          # published issue signed in, at 1280 and 375, and measures
                          # overflow, clipping, text-on-text, the ⤢ button on text,
                          # duplicate chrome; screenshots per section under
                          # research/_ui/<date>/. Exit 1 on a blocking finding.
```

The pipeline scripts bill to your `ANTHROPIC_API_KEY` (loaded from
`.env.local`, which is gitignored). They do **not** consume the Claude Pro
token budget. Same agents are also invoked as `/pipeline-<phase>` slash
commands inside Claude Code — those routes through Pro.

**JS budget: rich on issues, lean everywhere else** (2026-07-05 policy). No
framework, no client bundle; everything is tiny vanilla `is:inline` islands
plus the lazy, per-scene code-split `viz3d` runtime. **The fallback contract
is absolute**: every component paints its final composed state under no-JS,
`prefers-reduced-motion`, and missing WebGL.

→ Full island inventory, the gate, and the onboarding exception:
  **`.claude/rules/js-budget.md`** (loads on `src/components|layouts|pages|scripts/**`).

---

## 3. The six topics

Each topic has full tokens, masthead variant, topic-index page template,
and signature section kinds.

Worlds: **politics · space · earth · tech · travel · sports**. They differ by
**colour** — ground, ink, rule, accent — and by their register line ("Politics
desk", "Mission control"). Since the launch design (2026-09-08) they share ONE
typeface (Literata) AND one type language: the per-world eyebrow / numeral /
prose treatments that the themes used to carry were removed. Older docs carry
a per-world "Display font" column and "treatment" notes; both are historical.
The HOUSE (home, about, archive, subscribe) is the politics record — same
ground, ink and oxide-red accent — set in `src/styles/meta.css`.

→ Palette values, the `-deep` variants, colour law and the type trio:
  **`.claude/rules/design-tokens.md`** (loads on `src/styles|shared/design|components/topic/**`).

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
│   ├── SectionRenderer.astro  ← ARTICLE CHROME only (core/Section wrapper —
│   │                            passes `source` + `howToRead` through to it —
│   │                            act-break divider, skim-caption block)
│   ├── SectionBody.astro      ← the actual dispatcher: section.kind →
│   │                            component. Shared with story mode. THIS is
│   │                            the file a new section kind is wired into.
│   │                            Also resolves `howToReadFor(kind, howToRead)`
│   │                            for the fourteen VizCard kinds so the panel renders
│   │                            inside the card (Section's copy hides via :has()).
│   ├── core/                  ← topic-agnostic (Masthead [the lockup + nav],
│   │                            IssueHead [meta strip · head · primer], Plate
│   │                            [a framed photograph — renders only with an
│   │                            image], Section [owns ALL explainability chrome for
│   │                            every kind: how-to-read panel ABOVE the graphic,
│   │                            plain line + `Source · …` second line BELOW —
│   │                            components render none of it], VizCard [the
│   │                            shell for twelve kinds: caption row + chip +
│   │                            in-card how-to-read + graphic slot; renders NO
│   │                            source], Quote, Prose, Comparison,
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
│   ├── home/                  ← IssueRows — the ONE list-row implementation
│   │                            (home, archive, desks). The old home pieces
│   │                            (cards, plate, wire, chord, strips) retired
│   │                            2026-09-08; the home page is scoped styles
│   ├── desk/                  ← DeskIndex — one template for all six desks
│   │                            (the six bespoke <Topic>Index fronts retired)
│   └── topic/<topic>/         ← per-topic signature components
├── styles/
│   ├── base.css               ← Layer A — topic-agnostic rhythm + skim mode + `.mh` masthead
│   │                            + the RD-05 radius flip (`--r-card: 0; --r-tile: 0`
│   │                            in :root, NOT in shared/design — the reason was
│   │                            that app/ consumed those tokens, which the merge
│   │                            retired; the carve-out is now vestigial) + `.px-viz`
│   │                            shell (3px `--viz-edge` top rule, no shadow)
│   ├── meta.css               ← Meta brand tokens + home/topic-index styles
│   ├── dataviz-v2.css         ← v2 data-viz kit CSS (animations + html.js-gated reveals); imported last in both layouts
│   ├── components-3d.css      ← shared 3D mechanics (.px3d-* tilt/flip) + the .viz3d WebGL mount for the v2 3D/interactive library
│   ├── viz-type.css           ← unified data-viz type scale (caption/axis/legend/value label roles)
│   │                            + `.px-plain__src`, the `Source ·` second line of the plain paragraph
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
│   └── themes/<topic>.css     ← Layer B — full theme per topic, incl. `--viz-edge`
│                                (ink on light desks, accent on dark — the
│                                figure's 3px top rule)
├── lib/
│   ├── text.ts                ← renderEmphasis, renderInline, stripEmphasis,
│   │                            formatIssueNumber, formatSectionLabel
│   ├── explainers.ts          ← EXPLAIN: per-kind default `what` (the "in plain
│   │                            terms" fallback when a section has no `plain`)
│   │                            and `how` (the how-to-read default when a
│   │                            section has no `howToRead` — for the NEEDS_HOW
│   │                            kinds only since 2026-09-13, RG-19; every kind
│   │                            from 2026-09-04 to then). `howToReadFor()` is the
│   │                            one resolution. 92 entries + 9 narrative-exempt;
│   │                            copy review in docs/design/EXPLAIN-HOW-REVIEW.md
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
└── design/                    ← the design canon (CANON.md, motion.md,
                                  catalog.md, the *-SPEC.md set, physics/,
                                  worlds/, blueprints/) — read before any
                                  visual work
shared/design/                 ← tokens.css + worlds.css — the CANONICAL token
                                  source. Edit here, then `npm run design:sync`;
                                  `design:check` gates the build. The RD-05
                                  radius flip still sits in src/styles/base.css
                                  rather than here, but only by inertia: the
                                  reason was app/, and app/ is gone.
supabase/migrations/           ← the operator applies these; writing one does not
research/                      ← editorial pipeline working space (see research/AGENTS.md)
.claude/agents/                ← agent system prompts (discovery, researcher,
                                  drafter, stylist, verifier)
.claude/commands/              ← slash-command definitions that spawn the agents
scripts/                       ← pipeline CLI (tsx-driven, bills to API key)
                                  + check-catalog.mjs, design-sync.mjs,
                                  story/og.ts (the `prebuild` hook)
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
                                           that is the publication's intro
                                           story, and the collision shipped
                                           broken once already
src/pages/account/welcome.astro          ← post-signup "You're in." plate
                                           (name + six world-interest chips)
src/pages/api/onboarding.ts              ← its POST handler (save / skip)
src/pages/dashboard/index.astro          ← "The Shelf"
src/pages/admin/                         ← moderation queues (ADMIN_EMAILS)
supabase/migrations/                     ← 11 files. APPLIED state is not
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

**Since 2026-09-13 (`docs/REGISTER-PLAN.md`) the diagram above has three more
stops.** Between 4 and 5: `/pipeline-storyboard` writes
`research/<cat>/<date>-<slug>-storyboard.md` (every point the reader must
get → the kind that shows it, from all 101 by data shape; the hero; the word
budgets; the head; the three quiz questions) and **you approve it** — the
gate is `GATES.storyboard` in `scripts/pipeline.config.ts`, `'required'` for
the first ten issues, `'auto'` after. After 5 and again after 7:
`/pipeline-panel` — four Indian reader personas read the draft cold, answer
the three questions from the draft alone, and return PASS / REVISE / BLOCK.
Before 9: `npm run check:prose -- <slug>`. The full v2 sequence is in
`research/AGENTS.md` §2.

Agents live in `.claude/agents/`; slash commands in `.claude/commands/`
(`/pipeline-discover|research|storyboard|draft|panel|verify`; the stylist is
API-CLI only).

**Two hard rules that have been broken before:**

- **Cost.** A full pipeline run is **$3–7** on the API-CLI route at the
  September 2026 rates (it was $6–14 on the previous model generation) and
  the root `.env.local` exists, so `npm run pipeline:*` really executes and
  really bills. Never run one to test something.
- **Model routing.** The Claude Code route pins **every** phase to Opus.
  `scripts/pipeline.config.ts`'s Sonnet/Opus split is the API-CLI config —
  **do not "optimise" the Claude Code route to match it.**

**No raster imagery** — the publication is type- and data-viz-led. No cover
photos, no AI covers, no image service in the pipeline.

**The agents are catalog-driven (2026-07-14).** `docs/design/catalog.md` is the
canonical component palette they read at runtime: the researcher captures each
component's `DATA:` line so the dossier carries sourced values; the drafter
picks kinds from it and authors `plain` / `skimCaption` / `layout`; the stylist
runs a structure+plain audit; the verifier treats component `data` as traceable
claims. **Not yet exercised on a real run.**

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

- `primer` 80–420 chars · `plain` ≤220 · `howToRead` 40–360
- `plain` = the **form** of the graphic; `caption` = the **data** claim (the
  only one the verifier traces); `howToRead` = how to use it. Confusing these
  trips PLAIN-CLAIM / CAPTION-FORM / REDUNDANT-HOWTO.
- Instrument `howToRead` (any kind with a chip / scrub / toggle): the static
  reading leads, the control clause trails — controls are `html.js`-gated, the
  paragraph is not, so a no-JS reader must get a complete sentence before the
  clause about a control they cannot see.

- `sources[].url` must be a real URL; every `sourceRefs[]` must resolve.
- `layout` in `default | wide | bleed | split | split-flip | breath`.
- `skimCaption` applies to `kind: prose` only.

→ Full detail: `src/content/issues/_AGENTS.md` and
  **`.claude/rules/issue-authoring.md`** (that subtree cannot host a CLAUDE.md
  shim — see the Subtree memory note in `CLAUDE.md`).

### Visual rules

- **One typeface product-wide — Literata** (launch design, 2026-09-08). The
  three role tokens all resolve to it; roles differ by size / weight / case /
  tracking. Worlds differ by colour, **never typeface, never treatment**.
  Single lever: `src/styles/type-v2.css`, imported last. Do not reintroduce
  per-world faces or per-world eyebrow / numeral / prose cuts in the themes.
- **The frame is 1280 with no side padding** (`.px-wrap`); every page is a
  stack of full-width bands (`.px-band`, 46/40px → 24/20px on phones) split by
  hairlines, built from the launch primitives at the end of `base.css`
  (`.px-h1`, `.px-lede`, `.px-eyebrow`, `.px-meta`, `.px-btn`, `.px-cells`,
  `.px-chip`, `.px-input`). Page styles are SCOPED to their page; `meta.css`
  is tokens only. The issue floor plan is 170 / 1fr / 250 on that frame, which
  is what makes the prose column exactly 720 — the old 980 cap left it 436.
- **Zero rounded corners.** `--r-card`, `--r-tile` AND `--r-pill` are all 0
  in `base.css :root` (the pill joined on 2026-09-08 by operator ruling on the
  canvas). Only colour dots and the medallion are round.
- **In-SVG `<text>` uses a literal font stack, never `var()`** (RD-01b).
- **Small text on a light ground uses `--accent-deep`**; TD-06: any fill that
  carries text uses `--accent-deep` (the vivid accent fails travel at 3.91:1).
- **CSS prefix isolation** — each component owns a unique `px-<abbrev>` (≤6
  chars). Check `meta.css` for collisions first.
- **Story cards hide a section's chrome, never its data** — `story.css` hides
  `[class$='__cap']` / `[class$='__src']` inside a beat, at depth 1 and 2
  (some kinds emit chrome as a sibling of the graphic root). The source line
  is Section's `.px-plain__src`; `.px-viz__src` no longer exists — do not
  reintroduce it. Graphic containers
  must never end in `__cap`/`__src`; keep that invariant when naming.
- **Explainability chrome renders once, from `core/Section.astro`.** The
  how-to-read panel sits ABOVE the graphic, resolved by ONE function,
  `howToReadFor(kind, authored)`: an authored `howToRead` always renders; the
  per-kind default renders only for the `NEEDS_HOW` kinds — instruments, WebGL
  scenes, counter-intuitive forms (REGISTER-PLAN RG-19, 2026-09-13; the
  every-kind fallback of 2026-09-04 measured a paragraph on 69 published
  sections). The plain line sits BELOW with `Source · …` running inline after
  it (`.px-plain__src`, from `section.source ?? data.source`) — for every kind.
  Components render none of source / plain / how themselves. The one
  exception: the fourteen VizCard kinds render their how-to-read INSIDE the card,
  and `dataviz-v2.css` hides Section's copy with `:has()` so a section shows at
  most one panel. Do not add a `.px-viz__src` emitter back — the seventy that
  existed were stripped on 2026-09-04.
- **Surfaces are flat (RD-05).** `.px-viz` and every reading / home surface:
  `border-radius: 0`, no `box-shadow`, hover changes border-colour only; every
  figure wears a 3px `border-top: var(--viz-edge)` (ink on light desks, accent
  on dark). The radius flip (`--r-card: 0; --r-tile: 0`) lives in
  `src/styles/base.css` `:root`, NOT in `shared/design/tokens.css`. That split
  existed because app/ read those tokens; the merge removed the reason, so the
  override is vestigial — moving it is an RD-05 call, not a cleanup.
  `--r-pill` was flipped to 0 with the launch design (2026-09-08) — chips,
  CTAs and the reading strip are square. Shadows survive only on focus rings, inset
  hairlines, data-mark halos, slider thumbs, CSS-3D scene depth (RD-06), viz3d
  overlay chrome, modal / popover / toast chrome and the onboarding surface.
  The reading toolbar is flat (paper + 2px ink rule); glass is modal-only.

- **Mobile in-SVG legibility is FIXED for the scaling charts (2026-09-07).**
  It was never a font-size problem, which is why it survived a year of being
  described as one. Those SVGs are `width: 100%` over a fixed viewBox, so text
  renders at `authored x (cardWidth / viewBoxWidth)` — at 375px a 720-unit
  chart scales by 0.379 and an authored 9.5px lands at 3.6px. The fix is one
  block in `dataviz-v2.css`: each chart gets a `min-width` equal to its own
  coordinate width and the CARD scrolls, so the scale factor is 1 and every
  label lands at the size it was drawn at. 23 charts, 3.1px → 9–12.5px,
  measured across all six showcase issues.

  **Read that block before touching any of it** — it records the exclusions and
  why each one is not a bug: narrow-viewBox forms (dials, radars, ternary,
  shot-map) already fit; the WebGL fallback SVGs carry no class to target;
  `climate-spiral` is a square radial that wants a redraw, not a scroll;
  `flight-of-the-ball` cannot be fixed this way at all because
  `.viz3d--fball` pins an aspect-ratio on the mount; and `region-map` is short
  of the floor because its labels are AUTHORED at 7.5px, which is a type-scale
  call, not geometry.
- **No sitemap integration.** `@astrojs/sitemap` was tried and removed — it
  errored on the collection shape. Verify before re-adding.

→ Palette, colour law, prefixes: **`.claude/rules/design-tokens.md`**.
  JS budget, islands, the gate: **`.claude/rules/js-budget.md`**.

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
  when Astro 5 + adapter v8 land. See `docs/STATE-OF-PLAY.md` §9.
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
npm run check:catalog # SECTION_KINDS <-> catalog, order, EXPLAIN + KIND_PRIORITY
npm run check:prose   # the register + composition report (2026-09-13); the
                      # gate form joins prebuild once the backlist passes
npm run design:check  # 30 mirrors + 6 in-world deeps + 18 record tokens
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
| Palette, colour law, type trio, prefixes | `src/styles/**`, `shared/design/**`, `src/components/topic/**` | `.claude/rules/design-tokens.md` |
| JS budget, islands, fallback contract, the gate | `src/components|layouts|pages|scripts/**` | `.claude/rules/js-budget.md` |
| Issue schema + build-breaking bounds | `src/content/issues/**/*.mdx` | `.claude/rules/issue-authoring.md` |
| Voice modes, AI-tell catalog | `research/**`, `**/*.mdx` | `.claude/rules/editorial-voice.md` |
| WebGL subsystem, scene registry | `src/scripts/viz3d/**` | `.claude/rules/viz3d.md` |
| Pipeline cost, model policy, Windows traps | `scripts/**`, `.claude/agents/**` | `.claude/rules/pipeline-scripts.md` |
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
- **Design canon:** `docs/design/` — `CANON.md` (master rules; the 2026-09-04
  shell-adoption amendments were **signed 2026-09-05**, `0104915` — §13's two
  universal acceptance checks are a live floor a reviewer can reject on).
  `motion.md` was signed 2026-09-07 (`b06caec`) together with the `--t-page`
  ruling it was waiting on: navigation split off to `--t-slow` (420ms) because
  it answers a click, while in-page settling keeps 600ms. `catalog.md`
  (the 101-kind component palette), `motion.md`, the `*-SPEC.md` set,
  `physics/`, `worlds/`, `blueprints/`. Read before any visual work.
- **Long-form project state + change log:** `docs/PROJECT.md` (~1400 lines,
  the canonical historical reference).
- **Editorial pipeline detail:** `research/README.md` + `scripts/README.md`.
- **Voice system canon:** `research/_voice/mode-library.md`.
- **Per-category source allowlists:** `research/_sources/<category>.md`.
- **NotebookLM setup:** `research/notebooklm-setup.md`.

---

## 10. Change log for this file

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
