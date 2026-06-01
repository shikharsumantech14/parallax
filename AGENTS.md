# Parallax — agent guide

> **For any agent (or new human) joining this repo cold.** This file follows
> the [agents.md](https://agents.md) convention: a portable, agent-readable
> entry point that any tooling can pick up. Subdirectory `AGENTS.md` files
> add context where the conventions shift. Claude Code reads this file via
> `CLAUDE.md` (which `@`-imports it).
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
| Fonts        | Google Fonts (Fraunces, Inter Tight, JetBrains Mono, Space Grotesk, Cormorant Garamond, Oswald, IBM Plex) |
| Feed         | `@astrojs/rss` 4.0.x                                |
| Node         | `>=20.0.0`                                          |
| Hosting      | Vercel (static, auto-deploy on push to `main`)      |
| Agent SDK    | `@anthropic-ai/claude-agent-sdk` 0.2.x (for pipeline CLI) |
| Data viz     | `d3-geo` + `topojson-client` + `world-atlas` (build-time maps only) |

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
npm run pipeline:illustrator <category>    # Phase 3.75 — illustrator agent (OG card via fal.ai Flux)
npm run pipeline:verify      <category>    # Phase 4 — verifier agent
```

The pipeline scripts bill to your `ANTHROPIC_API_KEY` (loaded from
`.env.local`, which is gitignored). They do **not** consume the Claude Pro
token budget. Same agents are also invoked as `/pipeline-<phase>` slash
commands inside Claude Code — those routes through Pro.

**No JS islands except one.** Astro's zero-JS posture is intentional. The
only client-side JS in the project is the `SkimToggle.astro` component
(an IIFE inside the component file, no framework). Any new interactivity
must be justified.

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
│   └── IssueLayout.astro      ← used by /issues/*
├── pages/
│   ├── index.astro            ← home: chord + strip + category grid + archive
│   ├── about.astro
│   ├── rss.xml.ts
│   ├── issues/[slug].astro    ← dynamic issue route (one per published+draft)
│   └── topics/[topic].astro   ← dynamic: 6 routes, dispatches to <Topic>Index
├── components/
│   ├── SectionRenderer.astro  ← single dispatcher: section.kind → component
│   ├── core/                  ← topic-agnostic (Masthead, Hero, Primer,
│   │                            SkimToggle, Section, Quote, Prose,
│   │                            Comparison, DataReadout, BeatSheet, Sources,
│   │                            Footer)
│   ├── home/                  ← meta-brand pieces (TypographicChord,
│   │                            TopicStrip, CategoryCard, CategoryGrid,
│   │                            ArchiveList, FeaturedIssue)
│   └── topic/<topic>/         ← per-topic signature components + <Topic>Index
├── styles/
│   ├── base.css               ← Layer A — topic-agnostic rhythm + skim mode
│   ├── meta.css               ← Meta brand tokens + home/topic-index styles
│   └── themes/<topic>.css     ← Layer B — full theme per topic
└── lib/
    └── text.ts                ← renderEmphasis, renderInline,
                                  formatIssueNumber, formatSectionLabel
docs/
└── PROJECT.md                 ← long-form project state + change log
research/                      ← editorial pipeline working space (see research/AGENTS.md)
.claude/agents/                ← agent system prompts (discovery, researcher,
                                  drafter, stylist, verifier)
.claude/commands/              ← slash-command definitions that spawn the agents
scripts/                       ← pipeline CLI (tsx-driven, bills to API key)
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

Pipeline status (as of 2026-05-20):

| Phase | Agent file | Command (Claude Code) | Command (API CLI) |
|-------|-----------|----------------------|-------------------|
| 1. Discovery | `.claude/agents/discovery.md` | `/pipeline-discover <cat>` | `npm run pipeline:discover <cat>` |
| 2. Research | `.claude/agents/researcher.md` | `/pipeline-research <cat>` | `npm run pipeline:research <cat>` |
| 3. Draft | `.claude/agents/drafter.md` | `/pipeline-draft <cat>` | `npm run pipeline:draft <cat>` |
| 3.5. Stylist | `.claude/agents/stylist.md` | (no slash command — API only) | `npm run pipeline:stylist <cat>` |
| 3.75. Illustrator | `.claude/agents/illustrator.md` | (no slash command — API only) | `npm run pipeline:illustrator <cat>` |
| 4. Verify | `.claude/agents/verifier.md` | `/pipeline-verify <cat>` | `npm run pipeline:verify <cat>` |

**Cost per run** (API CLI, May 2026 rates from `scripts/README.md`):
discover ~$0.30–0.80 · research ~$0.80–2.00 · draft ~$3–7.50 · stylist
~$1.50–2.50 · illustrator ~$0.50–1.00 (Opus) + ~$0.04 (Flux 1.1 Pro) ·
verify ~$0.40–1.00. Full pipeline per issue: $7–16.

**Model routing** (`scripts/pipeline.config.ts`):
- Discovery, researcher, verifier → `claude-sonnet-4-6`
- Drafter, stylist, illustrator → `claude-opus-4-1`

**External services**: illustrator phase calls fal.ai (Flux 1.1 Pro) via
`scripts/generate-visual.mjs`. Billing is pay-as-you-go on `FAL_KEY` in
`.env.local`. Daily $2.00 cap enforced in the script.

Voice quality is the highest-value output of draft and stylist, hence Opus.

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
the full status.

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
  Grep test: `Shikhar Sharma` should return zero hits in `src/`.
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
- `skimCaption` only applies to `kind: prose` sections. Other section kinds
  ignore it.
- `sources[].url` must be a valid URL (`z.string().url()`). Mock URLs
  break the build.
- Every section's `sourceRefs[]` must reference an existing `source.id`.

### Visual rules

- **No JS islands except SkimToggle.** Every other component is pure
  Astro / CSS. New interactivity needs explicit justification.
- **CSS class prefix isolation.** Each component owns a unique `px-<abbrev>`
  prefix (≤6 chars). Check `meta.css` for collisions before choosing — the
  `px-strip` namespace is owned by `TopicStrip`; the climate-strip
  component uses `px-cstrip` to avoid it.
- **No sitemap integration.** `@astrojs/sitemap` was tried and removed —
  it errored on the collection shape. Verify before re-adding.

### Git / deploy rules

- Claude commits only — never pushes. The human pushes manually with
  `git push`.
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
5. Grep test: `Shikhar Sharma` returns zero hits in `src/`.
6. Grep test: `No\.\s0` returns zero hits in `src/` except the `travel`
   masthead variant.
7. Mobile 375px: no horizontal overflow on any route.
8. If a new section kind was added: it appears in `SECTION_KINDS` in
   `config.ts`, is dispatched in `SectionRenderer.astro`, has CSS in the
   correct theme file, and is documented in `src/components/AGENTS.md`.
9. If a new issue was added: status is correct (`draft` for review,
   `published` to go live), all `sourceRefs[]` resolve, primer is 80–420
   chars if present, all unverified claims carry `# EDITOR:` flags.

---

## 9. Cross-references

- **Long-form project state + change log:** `docs/PROJECT.md` (~1400 lines,
  the canonical historical reference).
- **Editorial pipeline detail:** `research/README.md` + `scripts/README.md`.
- **Voice system canon:** `research/_voice/mode-library.md`.
- **Per-category source allowlists:** `research/_sources/<category>.md`.
- **NotebookLM setup:** `research/notebooklm-setup.md`.

---

## 10. Change log for this file

### 2026-05-20 — Initial creation
First version of the agent guide. Consolidates the project overview,
pipeline, voice system, and hard rules from `docs/PROJECT.md` into an
agent-readable entry point. Adds three subtree AGENTS.md files:
`src/content/issues/`, `src/components/`, `research/`. Sibling `CLAUDE.md`
created at root to auto-load this file inside Claude Code.
