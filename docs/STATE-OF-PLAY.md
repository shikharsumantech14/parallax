# State of play — read this first

> **Purpose.** A cold-start snapshot for anyone (human or agent) picking this
> repo up fresh. `AGENTS.md` tells you the *rules*; `docs/design/LENS.md` is the
> *design law*; `docs/PROJECT.md` is the *history*; this file tells you **what
> is true right now, how each part of it was verified, and what is open**.
>
> **Last updated: 2026-10-04**, at the close of the Lens revamp session (Phase 8, the type ruling, the intro, the
> switch, then the push and the live check, which found and fixed one phone defect). Rewritten, not appended: the September snapshot it replaces
> described the launch design, which no longer renders. Older narrative lives
> in `AGENTS.md` §10 (the change log), `docs/PROJECT.md` and git history.
> Derived facts below are generated and gated: if one looks wrong, run
> `npm run graph`, do not hand-edit. Volatile facts (branch, unpushed, dirty
> tree) are not in this file at all: read the session brief (CD-11). Refresh
> the authored sections with `/update-state`.

---

## 1. The one-paragraph version

Parallax is a visual explainer publication: one Astro 4 project in
`output: 'hybrid'` (the publication prerenders, the reader-account routes
render on demand, Supabase-backed), deployed on Vercel from `main`. **Its
design is Lens** (`docs/design/LENS.md`, approved on the canvas 2026-09-29/30):
one paper under every desk and six desk inks, one face (Literata, since the
ruling below), a 1152 column, 6 / 4 / pill corners, and a reading system in which every
graphic section is the article (620) beside a pinned figure panel (520),
joined by numbered **cues** the reader presses in the prose. **All nine
phases are built**, 0 to 7 and Part A of 8 committed (`789f275` … `280b5c5`)
and Part B of 8, the switch, landing as one change on 2026-10-04: the retired
how-to-read panel, plain line, `explainers.ts`, `--viz-edge` and the old
theme and shell rules are deleted, and the schema fails the build on `plain`
or `howToRead`. The library is **87 kinds** (10 WebGL), every one redrawn for
the figure panel with cue anchors and a build order. Every one of the **17
published issues** carries cues on its graphic sections and a cover, and
the pipeline authors both (Phase 7). The editorial pipeline is the cost
plan's (`docs/COST-PLAN.md`, 2026-09-28): two doors, one config, a dossier
check pass, Jev as a pre-pass, a ledger priced at list. The register plan
(`docs/REGISTER-PLAN.md`) governs the voice: plain Indian English,
component-first issues.

**2026-10-04, the type ruling.** On the canvas board `Type-Compare` the
operator chose the launch design's type over Lens's two faces: **Literata
everywhere** (display, prose, captions, labels and numbers) at the launch
weights, case and tracking, **no italic sentence anywhere**, the one italic
emphasis word of a title kept (LENS §3, rewritten). Built the same day:
`src/styles/type-v2.css` and every role rule under `src/`, the 24 literal
in-SVG stacks, the four layouts' font link, and the share cards (static
Literata files from the googlefonts/literata repo; the Newsreader and
Instrument Sans TTFs are deleted). Verified by the fast gates and a scoped
`check:render` (the City issue, the ISS issue, the politics showcase and
Home at 1280 and 375); the full render run belongs to the commit.

**2026-10-04, the Shelf.** `/dashboard` opened slower than a prerendered desk
page because it waited on seven sequential hops to Supabase from the Vercel
function (the middleware's `getUser()`, then six reads one after another).
The six reads run in one `Promise.all` now (`b2be29e`); the interests read
stays its own query so a database without the onboarding migration still
renders the rest. What remains is Vercel's cold start on any server-rendered
page (measured live: a desk page 0.13s warm, sign-in 0.38s warm, 1.4s cold).

**2026-10-04, the intro walkthrough.** The first-visit intro on Home
(`core/IntroOverlay.astro`) is rebuilt to the approved `Intro`,
`Intro-Phone` and `Intro-Entry` boards (BRIEF-8): a native dialog rises over
the drawn page, which blurs under a paper scrim, and five scenes play
themselves in about 39 seconds (what Parallax is, what you can do, what to
do first, what members get, where to start), each built by `build.ts`, the
clock a CSS animation that hover, focus or Pause stops. It ends on the six
desks and three choices: Start browsing (`/#desks`), Sign in or become a
member (`/login`), Continue to the home page. Every number comes from the
collection. The key is now `px_intro_v3`, so readers who saw the
three-scene intro see this one once. The board's third step ("Answer three
questions") was corrected in the build to "Tell us how it landed", the
ReactionsBar cells, because no reader-facing quiz exists. Verified by the
fast gates, screenshots of every scene at 1280 and 375 read against the
boards, a build-versus-final-state comparison of all five scenes, and
`check:render` on Home at both widths (0 blocking; its intro pass now also
checks the five dots, Skip and Escape). The full render run belongs to the
commit.

**2026-10-04, pushed and checked live.** The operator pushed everything
through `9bd588a` and the live site was read at parallaxlens.com: every page
type 200, Literata loaded, the intro plays and closes, cue presses light
their anchors, the only console error the expected signed-out 401 on
`/api/save/<slug>`. One defect, on the phone only: the intro opened but its
first scene stayed blank for its whole eight-second hold, because the build
island's module finished loading about six seconds after the intro's
inline script had dispatched `px:build` for scene 1, so the event had no
listener. Fixed in `695d922`: the intro marks the scene it shows
(`data-build-wants`) before the event, and `build.ts` builds any marked
scene when it initialises, so the order the two islands load in no longer
matters. Reproduced against the built output with the island's response
held back three seconds, then measured live after the operator's second
push on a throttled phone profile (slow mobile network, a quarter of the
CPU, headless Chrome): the dialog open by 2.8s, scene 1 drawn by 5.9s, the
clock stepping to scene 2 at 10s. Both islands stay under 3 KB (`build.ts`
3,023 bytes minified, the intro 2,467).

---

## 2. Repo state

> **Three fact classes, and the split is the point (CD-02).** Below, in
> order: **derived** facts, generated and gated (never hand-edit them); then
> **attested** facts, which only the operator can know because they happened
> outside this box. **Volatile** facts (branch, unpushed, dirty tree) live
> only in the session brief.

<!-- BEGIN GENERATED — scripts/project-graph.mjs. Do not hand-edit (CD-09). -->

| Derived fact | Value |
|---|---|
| Section kinds | **87** (10 WebGL) |
| Blueprinted | 39 of 87 |
| Issues | 30 (17 published, 13 draft) |
| Kinds never in a published issue | **50** |
| Registry gaps | none |
| Decisions tracked | 38 (9 decided-but-unbuilt) |

<!-- END GENERATED -->

Refresh with `npm run graph`; `npm run graph:check` gates it in `prebuild`.
"Registry gaps" counts a kind missing its catalog block, or a figure kind
whose CUES line names no anchors.

### Attested — the operator's word, not measurable here

| Fact | Attested | On |
|---|---|---|
| Deployed | the trial issue (`a66cb33`) is **live on Vercel**, read by the operator | 2026-09-29 |
| Deployed | **the Lens revamp through `695d922` is live** at parallaxlens.com: the operator pushed `9bd588a` and then `695d922` on 2026-10-04, and each deploy was read live in a browser (every page type 200; the intro at 375 measured on a throttled phone profile after the second push) | 2026-10-04 |
| Migration | `20260705000000_journey_onboarding.sql` **applied** | 2026-08-28 |
| Migration | `20260927000000_retire_content_engine.sql` **applied**, the `social-cards` bucket deleted from the dashboard | 2026-09-27 |
| Live smoke | signup → `/welcome` → Shelf (the app's post-signup plate, `/account/welcome` since the merge), `/api/join`, app favicon 200, published og:image 200, draft og:image absent | 2026-08-28 |

**Never regenerate, infer, or quietly refresh these dates.** If one looks
stale, ask the operator. Commits made after an attested date are, by
definition, not covered by it.

---

## 3. What is built: the Lens revamp, phase by phase

| Phase | What it built | Commit |
|---|---|---|
| 0 · Rules | `docs/design/LENS.md`; `AGENTS.md` §7 and the rules files rewritten; the verdict applied to the library (101 → 87: ten kinds dropped, six old names kept as aliases in `KIND_ALIASES`); CANON and motion.md archived | `789f275` |
| 1 · Foundations | the palette (one paper, six inks), the two faces, the radii and shadows, the motion tokens, in `shared/design/` and the themes; static font files for the share cards | `789f275` |
| 2 · The shell | masthead and lockup, footer, buttons, chips, inputs, cards; `core/CoverCard` and `core/CoverMark` | `01afde8` |
| 3 · The reading system | `cues` in the schema, `[[n]]` markers, `core/Section.astro` as the article beside the pinned figure, `src/scripts/cues.ts` (lighting, progress, the phone pin), the issue head; the panel, the plain line and the ⤢ modal stopped rendering | `01afde8` |
| 4 · Pages | the stage (`core/Stage`, `stage/StageScene`), Home, the desk template, About, Archive, Subscribe, the account surfaces, story cards, the first-visit intro (`core/IntroOverlay`), `cover` in the schema | `6304dbc` |
| 5 · Motion | `src/scripts/build.ts`, the one build island; `core/Reveal` and `core/VizMotion` deleted; the render gate's BUILD, CUES and FLOOR checks | `6304dbc` |
| 6 · The library | all 87 kinds redrawn to their boards for the figure panel, six waves by desk: cue anchors, a build order, one number set large, scoped CSS | `bf5104f` |
| 7 · The pipeline | the catalog's CUES and BUILD lines (check 7 asserts every CUES id is a `data-cue`); composer, drafter, stylist and verifier author and check cues and covers; `check:prose` CUES and NO-COVER | `280b5c5` |
| 8A · The backlist | every published issue given cues on its graphic sections and a cover, its `plain` / `howToRead` stripped, each cue sentence traced to its dossier | `280b5c5` |
| 8B · The switch | below | this change (2026-10-04) |

**Phase 8 Part B, in one change.** `plain` and `howToRead` leave the schema
behind a guard that fails the build by name (the section object is not
strict, so a bare removal would strip them silently); the showcases lost
their last 36. `src/lib/explainers.ts` is deleted, and `VizCard` and eleven
components lost the `howToRead` prop. The six theme files hold their inks
and the gated neutral mirrors only (1,860 lines → 218: no `--viz-edge`, no
per-desk component rules, no page textures, no motif kits). `base.css`,
`dataviz-v2.css` and `viz-type.css` lost every rule for retired chrome and
dead launch-design classes, each grepped for an emitter first; `.px-viz`
reads `--hair`. `project-graph.mjs` reports cues instead of EXPLAIN;
`wire-kind.mjs` emits the Lens dispatch arm and refuses a catalog block
without CUES and BUILD lines; `check:prose` warns CUES and NO-COVER on every
status; `--slug` accepts the dated form. `docs/design/EXPLAIN-HOW-REVIEW.md`
moved to `docs/archive/`. Docs: LENS §10 and §11, `AGENTS.md`, the
components and issues guides, the three rules files, the catalog header, the
blueprint template, the add-section-kind and run-wave skills, TOKEN-RECORD.

**Before Lens, and still true** (history: `AGENTS.md` §10): the register plan
(all ten older issues rewritten 2026-09-14/15, the voice contract v2, the
storyboard step, the reader panel, `check:prose`); the cost plan's pipeline
(2026-09-28, one trial issue at $20.40 at list); the render gate
(`check:render`, 2026-09-23, enforced at commit time by `guard-render.mjs`);
the merge into one project (2026-09-06); the PWA (installable, offline
reading); the medallion mark (RD-10, unchanged by Lens).

---

## 4. How it is verified

| What | How | Result |
|---|---|---|
| The rendered product, Phases 0 to 8A | `npm run check:render`, full run, every published issue plus Home, signed in, 1280 and 375, in headless Chrome; the commit hook refuses a rendering commit without a current clean stamp | last full run 2026-10-04 on the tree of `695d922` (the intro's race fix): **0 blocking, 0 warnings** at both widths on all 17 published issues and Home (`research/_ui/last-run.json`, report under `research/_ui/2026-10-04/`); the six showcase drafts measured the same on the Phase 6 tree |
| Each phase commit | the orchestrator's acceptance gates (`npm run build` with its prebuild, `check:render` at both widths, the two standing greps, the screenshots read), then `guard-render.mjs` at commit time | committed, `789f275` … `280b5c5`, then `8a30214` (8B), `b2be29e` (the Shelf), `2aaf620` (the type ruling), `9bd588a` (the intro), `695d922` (the intro's phone race, found live) |
| Part B (this change) | `check:catalog`, `design:check`, `graph:check`, `hooks:test`, `check:prose` on all 30 issues, both standing greps, a TypeScript pass over `src/` and `scripts/` | all green; `check:prose` 0 ❌, and no CUES or NO-COVER on any published issue |
| Part B in a browser | dev server on its own port, headless Chrome, an issue (ISS), a showcase (earth), Home, a desk (space), the archive and story mode, each at 1280 and 375 | all 200, no console errors, no horizontal scroll, no retired chrome in the DOM, cue buttons and numerals present (21 / 35 on the ISS issue) |
| The schema guard | a stray `plain` and a stray `howToRead` added to a test draft on the dev server, then removed | the page fails with ``  `howToRead` was removed in Lens Phase 8 … `` |
| **Not yet run on Part B** | `npm run build` and `check:render` | **the orchestrator's**, before the commit (the hook enforces the second) |

Known TypeScript errors, all three older than Lens and unrelated: the
`Guide` type in `src/content/config.ts` (TS2344), an implicit `any` in
`src/lib/supabase.ts`, and no types for `three`. A whole-repo `tsc` also
trips on the archived design handoff under `Parallax Design System Revamp/`;
scope a check to `src/` and `scripts/`.

---

## 5. What is open

### 5.1 Three operator decisions pending from Phase 8 Part A

1. **The transgender bill-passage stage (`2026-05-02-transgender-ratchet`,
   section "ELEVEN DAYS").** The status enum has no value for "introduced",
   so stage 1 prints PASSED under Introduced. The authored `plain` that
   defined the word under each card was the departure from the storyboard;
   Part A stripped it, and its job is now carried by the drawing and cue 1's
   caption ("Introduced on 13 March, passed by voice vote eleven days
   later."). Decide whether that is enough, or whether the kind needs an
   "introduced" status. The issue's EDITOR note 3 still describes the
   stripped `plain`: update it with the decision.
2. **The ISS delta-v figures (`2026-09-21-iss-retirement-set-by-contract`,
   "THE FUEL BILL").** 57, 120–140 and 760 m/s are still [UNVERIFIED] at the
   primary source, NASA's ISS Deorbit Analysis Summary (src-04, June 2024),
   and the issue is published. The standing instruction in its EDITOR note:
   confirm each against the PDF, and cut the section rather than soften it
   if any one cannot be confirmed.
3. **Two "form" captions on the cockroach issue
   (`2026-06-04-cockroach-janta-party`).** Two `data.caption` lines describe
   the figure rather than state a finding ("CJP following as share of ~22M
   peak · May 2026 · approximate, sources vary" and "CJP × §69A · MAY 2026").
   The Part A agent left them as editorial calls: rewrite each as the data
   claim, or keep them.

### 5.2 The operator's, carried forward

- **Push and deploy.** The count is in the session brief. Vercel deploys on
  push. Read the live site at both widths, signed in, after the Lens deploy.
- **Node 20 on Vercel.** `@astrojs/vercel@7.8.2` can emit nothing above
  `nodejs20.x`, which Vercel scheduled for deprecation on **2026-10-01**, now
  past. `scripts/vercel-runtime.mjs` is the bridge; the fix is Astro 5 with
  adapter v8 (the Content Layer API reaches every kind and every issue).
  Confirm a deploy is still accepted.
- **Pending editorial confirmations from the 2026-09-21 round**: the sports
  IPL and Swiss Ramble figures, the politics prorogation and
  committee-referral source, the travel ₹3.5 crore source, three allowlist
  edits (the ISS delta-v item is 5.1.2).
- **Three stale dossiers** to correct before they are drawn on again:
  politics writes off India Code and the Supreme Court archive (both T0 on
  the allowlist) and puts the 26 Nov 2019 passage in the wrong House; earth
  predates Global Forest Watch reaching T1.
- **The pipeline round** (ruled 2026-09-29): the next two or three issues on
  the cost plan's pipeline as it stands, then CP-08 (Opus 5.5 at medium on
  one issue, measured against the trial).
- **Launch follow-ups**: the About portrait (`EDITOR_PORTRAIT` in
  `about.astro`); the social art in `assets/brand/` is the pre-RD-10 two-lens
  mark (2026-06-22) and `npm run brand:assets` re-renders it, so the site and
  the social presence are on two brands until it is redrawn from
  `src/lib/mark.ts`.
- **TWA (Android)**: blocked on a Play Console app (the package id and the
  App-signing-key fingerprint); `scripts/twa-assetlinks.mjs` is ready.

### 5.3 Engineering, in order

1. **Promote `check:prose:gate` into `prebuild`.** The backlist has 0 ❌;
   the condition it waited on is met.
2. **The commit guard does not run `graph:check` when an issue is staged.**
   Any change to a published issue can stale the graph (a title, a
   `sourceRefs` list); that failed the `80ae941` deploy. Run `npm run graph`
   before committing an issue until the guard does.
3. **`check:catalog` check 5 accepts a field the component reads even when
   the dispatcher does not forward it** (how `margin-ladder`'s chip shipped
   wrong on the trial issue). Teach it the dispatch arm.
4. **The verifier and the panel find drafts only**, so re-verifying a
   published issue needs a temporary status flip. Accept a published slug.
5. **Make `source` required.** Measured 2026-10-04 over all 30 issues: 152
   sections carry `source` at the top level and 86 under `data:` (3 of them
   in published issues), which Zod cannot require, so migrate those first,
   in their own commit. Four published sections have no source at all, all
   `jargon-buster` glossaries (El Niño, Arsenal, eleven bills, open models):
   decide whether a glossary needs one before the field becomes required.

6. **Per-kind blueprints** (`docs/design/blueprints/<world>/`) still
   describe EXPLAIN strings, a how-to-read paragraph and pre-Phase 6
   drawings. The catalog's NOTES and CUES lines win, and the template and
   the add-section-kind skill say so; rewrite a blueprint when its kind is
   next touched, not as a sweep.
7. **Topic memory files under `.claude/agent-memory/`** (not the DIGESTs,
   which are inlined into prompts and are current) still cite EXPLAIN
   defaults and `NEEDS_HOW`. They are notes, not instructions an agent
   receives; prune them in the next digest pass.

8. **The intro's "Your path" progress arcs are a sample** (read, read,
   60%, 38%), the board's illustration, not a reader's data. Either draw a
   real anonymous shape or label it as an example before launch.
9. **The promise strip says "Read in six minutes"** (`core/PromiseStrip.astro`)
   while every published issue lists 4 or 5 minutes and the intro says so.
   Pick one.
10. **The sign-in page shows a Vite module error on the dev server only**
    (`cookie` served unbundled through `@supabase/ssr`); the production chunk
    bundles the parser and the import predates Lens. Harmless; the fix is a
    `vite.optimizeDeps.include` entry if it ever matters.
11. **The canvas's `Type-Compare` board still ticks Lens by default.** The
    ruling is the unticked state; flip its defaults when the board is next
    touched. The rest of the canvas is in Literata (version 35).
12. **The intro's board copy.** The approved `Intro` board's third card still
    says "Answer three questions"; the build says "Tell us how it landed".
    Redraw the card when the board is next touched.

### 5.4 Deliberate, do not "discover"

- **Phone charts scroll sideways inside their figure** where a kind is drawn
  at 452–552 units (the earth, sports, tech and travel lists in
  `dataviz-v2.css` and the components): an unreadable axis is worse than a
  scrollable one. The radial and HTML kinds fit a 375 phone outright.
- **`layout: split`, `bleed`, `split-flip` and `breath` stay valid** so the
  backlist builds (the ISS issue's §0 carries one); they render as the
  default, and `wide` widens the panel to 620. Never author them.
- **The reading gate's NARRATIVE list is wider than Section's.** It also
  holds `comparison`, `jargon-buster` and `three-steps`, because it answers
  which sections count as the free graphic, not which have a figure panel.
- **`state-timeline` carries three raw hexes**, a declared fixed encoding.
- **Unused Lens primitives stay in `base.css`** (`.px-h2`, `.px-btn--acc`,
  `.px-card--flat` and others): they are the Foundations board, not
  retired chrome.
- **The `pxs-` story cards hide `__cap` / `__src` children** and keep the
  data, by design.

---

## 6. Traps that have actually bitten

- **Zod strips unknown keys on a non-strict object.** Deleting a field from
  `sectionSchema` would have let a stray `plain` vanish in silence; the
  `retiredField()` guard fails instead. And **Astro's error map rewrites an
  `invalid_type` message** ("Expected type undefined"): a custom message
  survives only on a refine (2026-10-04).
- **A class with a consumer is not dead.** Grep every class before deleting
  its rule, and grep for template-built names too; `px-home` is live on
  Home although the old `.px-home__issue*` rules were dead (2026-10-04).
- **Git Bash rewrites a leading `/` in a command argument into a Windows
  path** (a URL path given to a script becomes `C:/Program Files/Git/...`);
  set `MSYS_NO_PATHCONV=1`. **A Python string containing `\b` writes a
  backspace**, and a Bash heredoc eats backslashes: write scratch scripts
  with the Write tool.
- **The render gate is the only check that sees the page.** A probe run
  signed out, in a scaled preview pane, confirmed the ruling it was written
  under (2026-09-22). Verification means `check:render` at both widths and
  the screenshots read.
- **A component can accept a documented field and never draw it**: grep the
  template, not the props interface (check 5, 2026-09-15). **A dispatcher
  can drop a field the component reads** and pass check 5 (5.3.3).
- **A dossier can go stale about its own allowlist**, and fails toward
  weaker sourcing: check the allowlist, not the dossier.
- **`graph:check` goes stale whenever a published issue changes**, and **a
  git worktree poisons any generator that walks the filesystem**
  (`project-graph.mjs` skips `.claude/worktrees` by path).
- **One YAML list item at column 0 inside `sections:` takes every issue
  page down.** Anchor inserts with `^` and never trim a block.
- **Match each file's line endings** (some are CRLF, some LF): exact-string
  anchors need `\r?\n`, and a tool that rewrites a file must keep its
  endings.
- **A green build is not a deploy** (the adapter's runtime table, 5.2), and
  **every page can return 200 while the reader islands are dead** (the
  apex / `www` redirect, `AGENTS.md` §7).
- **A redirect to a route that exists and returns 200 is invisible to every
  check**: after a route merge, walk every redirect target.
- **The preview pane reports false page overflow** and
  `prefers-reduced-motion: reduce`: the honest test is `scrollTo(9999, y)`
  then `scrollX === 0` with a real viewport, and the real test is
  `check:render`. **A hidden preview pane also freezes CSS transitions at
  their start value and runs a CSS-animation clock late** (no frames are
  painted), so a sample read through it can show a built scene at opacity 0
  under the step that should show it; a screenshot forces the paint and the
  reading changes (2026-10-04). Measure timing in headless Chrome.
- **Two islands that talk by DOM event race on a slow page.** The intro's
  inline script fires `px:build` at parse time; the build island is a
  deferred module that arrived six seconds later on a phone, and the event
  was gone (2026-10-04). An island that asks another island for something
  leaves a mark in the DOM as well as the event, and the other island reads
  the mark on init.
- A subagent once wiped uncommitted work with `git checkout`: **commits
  only, never checkout / reset / stash / restore to undo.**

---

## 7. Where to find things

| You want… | Read |
|---|---|
| The design law | `docs/design/LENS.md` (the canvas is linked from `AGENTS.md` §9) |
| The rules, the change log | `AGENTS.md`; Claude Code reads it through `CLAUDE.md` |
| Kinds: what to use when, their CUES and BUILD lines | `docs/design/catalog.md`; by data shape, `docs/design/catalog-shapes.md` |
| Section kind → component, prefixes, the build contract | `src/components/AGENTS.md` (§2, §4, §11) |
| Issue authoring: the schema, cues, covers | `src/content/issues/_AGENTS.md` (§2, §16); `.claude/rules/issue-authoring.md` |
| The reading system in code | `core/Section.astro`, `src/styles/layout-v2.css`, `src/scripts/cues.ts` |
| The build island | `src/scripts/build.ts`, `src/styles/motion-v2.css` |
| Tokens and their history | `shared/design/tokens.css`, `worlds.css`; `docs/design/TOKEN-RECORD.md` (TD-09) |
| Adding a kind | `/add-section-kind`, `scripts/wire-kind.mjs` |
| The register and the voice | `docs/REGISTER-PLAN.md`; `research/_voice/_voice-core.md` |
| The pipeline, its cost and its two doors | `docs/COST-PLAN.md` (§12), `scripts/README.md`, `scripts/agents/`, `.claude/rules/pipeline-scripts.md` |
| The reader-account surfaces | `docs/APP-SURFACES.md` |
| Live examples of every kind | the six `2026-06-03-<world>-showcase` drafts (unhide gated sections in the console with `document.querySelectorAll('.px-gate-hidden').forEach(e => e.classList.remove('px-gate-hidden'))`) |
| Frozen history, **not current** | `docs/archive/` (read its README first); `docs/REVAMP-PLAN.md` and the archived `CANON.md` / `motion.md` are the pre-Lens decision record |

---

## 8. Verification commands

```bash
npm run build            # 45 prerendered pages + the SSR routes. prebuild, in order:
                         #   design-sync --check · check-catalog · project-graph --check
                         #   · tsx scripts/story/og.ts (writes the share-card PNGs)
                         # postbuild: vercel-runtime (corrects the function runtime)
npm run check:catalog    # kinds ↔ blocks and order, KIND_PRIORITY, DATA readers,
                         # the alias map, every CUES id a data-cue
npm run check:prose      # the register, composition, CUES and NO-COVER report
npm run design:check     # ink mirrors, Lens inks, one-paper neutrals, record tokens
npm run graph:check      # the derived graph matches the repo
npm run hooks:test       # the enforcement hooks still decide correctly
npm run check:render     # the render gate, 1280 AND 375, signed in: required after any
                         # change under src/components, src/styles or src/layouts and
                         # before a status flip; enforced by guard-render.mjs at commit
```

`npx astro build` skips both the prebuild gates and the postbuild runtime fix:
it proves only that the pages compile. Run the full `npm run build` before
calling work done.

Standing greps (both must return zero):

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

```bash
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```
