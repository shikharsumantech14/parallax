> # ARCHIVED — FROZEN HISTORY. NOT CURRENT.
>
> **Froze:** 2026-09-01  ·  **Superseded by:** `AGENTS.md` §10 (recent entries)
> and `docs/PROJECT.md` (the full narrative history).
>
> **Why kept:** these entries record why standing conventions exist. They were
> moved out of AGENTS.md because 271 lines of history loaded into every session
> while being needed in almost none (CONTEXT-PLAN CD-03/B4).
>
> Do not treat anything below as current. Cite what superseded it.

---

# AGENTS.md change log — entries before 2026-08-28

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

