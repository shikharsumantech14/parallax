# State of play — read this first

> **Purpose.** A cold-start snapshot for anyone (human or agent) picking this repo
> up fresh. `AGENTS.md` tells you the *rules*; `docs/PROJECT.md` is the *history*;
> this file tells you **where things stand right now and what to do next**.
>
> **Last updated: 2026-07-14.** If the git state below no longer matches reality,
> trust the repo and update this file.

---

## 1. The one-paragraph version

Parallax is a visual explainer publication (static Astro site at the repo root)
plus a separate Astro SSR reader-account app (`app/`, Supabase-backed). A
nine-phase **product-elevation program (P0–P8)** has just been completed in code:
a written design canon, a 90-kind component library, a plain-language layer for
casual readers, layout variety, an InShorts-style shareable story mode at
`/s/<slug>/`, a rebuilt account app, and a complete signup→reading funnel.
**Everything from that program is currently uncommitted.** The next planned
effort is a full product revamp — design *and* functionality.

---

## 2. Repo state right now

| Fact | Value |
|---|---|
| Branch | `main` |
| Last commit | `ed04da5` (home hero + eye-tracking fix) |
| Unpushed commits | none |
| **Uncommitted files** | **~70** — recount with `git status --porcelain \| wc -l`. Do not trust this number: it drifted 60 → 72 during the doc refresh that produced this file. |
| Root build | green — `npm run build`, 44 pages |
| App build | green — `cd app && npm run build`, exit 0 |
| Migration applied? | **No** — `20260705000000_journey_onboarding.sql` is written but not applied |
| Deployed? | **No** — none of this is live |

**The single biggest risk is that ~70 files of finished work exist only in the
working tree.** Getting it committed is the operator's first move (see the
go-live sequence in §5 — the migration goes first, then the app, then the
publication).

---

## 3. What this box can and cannot do

This development machine is **code-only** for Parallax. It has no `.env.local`,
no database access, and the git repo is owned by a different account.

- ✅ **Can:** edit code, run both builds, run the publication dev server and
  verify it in a browser (`npm run dev` → `localhost:4321`).
- ❌ **Cannot:** run the `app/` project (its middleware throws
  `Missing env: PUBLIC_SUPABASE_URL` on every request), touch the production
  database, apply migrations, deploy, or commit/push.

**Consequence for agents:** publication work is *runtime-verifiable* — verify it
in the browser, don't just assume. App work is **compile-verifiable only**;
`cd app && npm run build` is the gate, and anything requiring auth or a database
must be handed to the operator with clear instructions. Never pull production
secrets to work around this.

---

## 4. What was just built (P0–P8)

| Phase | Outcome |
|---|---|
| **P0** | Design canon in `docs/design/` — `CANON.md`, `motion.md`, `catalog.md`, three specs, `physics/`, `worlds/`, `blueprints/`; plus `shared/design/` tokens with `design:sync`/`design:check` |
| **P1** | Lazy code-split `viz3d` scene registry, `kepler.ts` math, the `plain` comprehension layer, `layout` variety + `act-break`, `SectionBody` extraction |
| **P2** | Flagship components: `solar-system`, `chamber`, `power-flow`, plus politics world identity |
| **P3** | App design language v2 (`.plate`/`.tile`/`.chip`/`.toggle`/`.stat`/`.appbar`) + the login flagship with its 5-state machine and world tinting |
| **P4** | Story mode skeleton: `/s/<slug>/`, `StoryLayout`, `StoryShell`, card components, `src/lib/story.ts`, OG generation, share |
| **P5** | ~24 further blueprints + the full 90-kind `catalog.md` + `check:catalog` |
| **P6** | **22 new components** across all six worlds; the app dashboard rebuilt as "The Shelf"; the welcome/onboarding flow; the publication funnel |
| **P7** | Story breadth: the 22 kinds ranked for beat selection, teaser compaction, prose text cards, admin story links |
| **P8** | The four editorial agents wired to the component catalog *(retrofit demonstration still pending)* |

The component library is now **90 section kinds** (`npm run check:catalog`
enforces a 1:1, same-order match between `SECTION_KINDS` and `catalog.md`).

---

## 5. What is actually left

### Operator-only (blocked on access this box doesn't have)

**Go-live sequence — this order matters. It is the canonical one; `docs/design/JOURNEY-SPEC.md` §6
and `docs/COMMERCIALISATION-SETUP.md` Stage 5 state the same steps.**

1. **Apply the migration** `app/supabase/migrations/20260705000000_journey_onboarding.sql`
   **first**, before any deploy. It only adds two columns with defaults and is
   idempotent, so the currently-deployed app is unaffected by it.
2. **Get the app live before the publication.** The newsletter form now posts to
   `/api/join` on the app subdomain, so if the publication ships first its form
   posts into a 404. Zero-risk sequence: commit the `app/` changes, push, wait
   for that deploy to go green and smoke it, *then* commit and push the
   publication changes. (Whether a single push rebuilds one project or both
   depends on the per-project root-directory settings in the Vercel dashboard —
   there is no `vercel.json` in this repo to confirm it from, so don't assume.)
3. **Smoke the funnel** end to end: join round-trip · gate → login (world-tinted)
   → welcome → back-to-issue toast · save + first-save microline ·
   `/?newsletter=confirmed` ribbon · admin story link.
4. **Real-iPhone pass** on story mode (scroll-snap, `dvh`, safe areas) via a
   Vercel branch preview. Pre-approved fallback if snapping is flaky: ship
   `scroll-snap-type: y proximity` globally.

### Editorial call
5. **P8 retrofit demonstration** — put the new components into two published
   issues and run one fresh `pipeline:draft` to prove catalog-driven selection.
   This touches live content and bills the pipeline, so it needs a human to start it.

### Optional code follow-ups (none blocking)
6. Per-component mobile chart reflow (see the honest residual in §6).
7. Per-kind story compaction for text-heavy narrative kinds.
8. Richer Shelf modules: reading-progress hairlines from `reading_events`,
   topic-affinity bars, and real issue titles via an issues-manifest bridge
   (tiles currently title-case the slug).

---

## 6. Known residuals — do not mistake these for bugs to "discover"

These are **known, deliberate, and documented**. Re-deriving them wastes a session.

- **Mobile in-SVG fine print renders ~3.4–7px at 375px.** SVG cards use a fixed
  `viewBox` with `width:100%`, so the whole graphic scales down uniformly. There
  is no clean blanket fix — a `min-width` breaks tall-narrow columns, discs, and
  small gauges. Legibility is carried by the HTML layer (the `plain` line,
  caption, legend, and tables at real pixel sizes) plus the ⤢ expand-modal study
  view. A per-component reflow round was offered and consciously deferred.
- **Text-heavy story beats scroll inside their card.** `comparison` (~3.8×),
  `paradox` (~2.3×), and `timeline` (~1.5×) exceed the card budget and use the
  spec-sanctioned 62dvh internal scroller. The real fix for a viz-poor issue is
  an authored `story:` frontmatter block where the editor hand-picks visual
  beats — an editorial action, not a code gap.
- **Dashboard tiles title-case the slug** instead of showing real issue titles.
  The issues-manifest bridge was specified but not built.
- **The reading gate is soft by design.** The publication is static, so teaser
  content is in the page source. This was chosen deliberately to keep teasers
  shareable and Google-indexable; no-JS and crawlers see the full article.

---

## 7. Traps that have actually bitten this project

- **A subagent once ran `git checkout` on shared files** and silently wiped hours
  of accumulated wiring across `config.ts` and `SectionBody.astro`. Any workflow
  that spawns agents must carry an absolute git prohibition, and shared/registry
  files must be edited by the orchestrator alone, never by parallel agents.
- **Section `plain` is capped at 220 characters** by Zod. Overshooting breaks the
  build — it happened twice.
- **`coalition-calculus` dispatches with a spread** (`{...data}`, flat props),
  unlike every other kind. Don't "fix" it into the standard shape.
- **`CityGrid` hard-throws** unless it gets 1–3 cities, each with exactly 36 bins.
- **Globe seed-yaw:** to face longitude `cLon`, set
  `drag.s.yaw = -((cLon + 90) * Math.PI) / 180`. A `+180` there is the classic
  bug that opens the globe on the wrong hemisphere.
- **The preview browser's viewport measurements are unreliable.** Fixed-position
  elements routinely measure a few pixels over `clientWidth`; those are artifacts,
  not real overflow. Verify a suspected overflow by measuring the element itself
  before "fixing" it. One adversarial review's only "major" finding was exactly
  this false positive, disproven by direct measurement.
- **Two different `/welcome` pages exist.** The publication's `/welcome` is the
  cinematic "Second Angle" intro story; the app's `/welcome` is post-signup
  onboarding. Different projects, different files. Never conflate them.

---

## 8. Where to find things

| You want… | Read |
|---|---|
| The rules any agent must follow | `AGENTS.md` (root — auto-loaded) |
| Full project history | `docs/PROJECT.md` |
| The visual law (taste as checkable rules) | `docs/design/CANON.md` |
| Named motion vocabulary | `docs/design/motion.md` |
| The 90-kind component palette | `docs/design/catalog.md` |
| Per-component implementation contracts | `docs/design/blueprints/` |
| Per-world visual language | `docs/design/worlds/` |
| The reader journey + verbatim copy deck | `docs/design/JOURNEY-SPEC.md` |
| App surface design | `docs/design/APP-DESIGN-SPEC.md` |
| Story mode | `docs/design/STORY-MODE-SPEC.md` |
| Section-kind → component map | `src/components/AGENTS.md` |
| Issue authoring + data shapes | `src/content/issues/_AGENTS.md` |
| The account app | `app/AGENTS.md` |
| Editorial pipeline + voice | `research/AGENTS.md`, `research/_voice/mode-library.md` |
| Operator go-live checklist | `docs/COMMERCIALISATION-SETUP.md` |

**Live examples of every new component:** the six
`src/content/issues/2026-06-03-<world>-showcase/` issues. They are
`status: draft`, so they build as issue pages but have **no** story page, and the
reading gate hides everything past section 2 for anonymous readers. To see them
all while developing, run this in the browser console:

```js
document.querySelectorAll('.px-gate-hidden').forEach(e => e.classList.remove('px-gate-hidden'))
```

---

## 9. Verification commands

```bash
npm run build            # publication — must exit 0 (44 pages today).
                         # `prebuild` runs design:check + check:catalog FIRST,
                         # before og.ts writes anything, so a failing gate
                         # leaves the tree clean. Use `npx astro build` to skip
                         # the hook while iterating.
npm run check:catalog    # SECTION_KINDS ↔ catalog.md (1:1, same order) PLUS
                         # EXPLAIN + KIND_PRIORITY coverage. Reports every
                         # problem in one run.
npm run design:check     # shared design tokens in sync
npm run dev              # publication dev server → localhost:4321
```

```bash
cd app && npm run build  # app SSR — the ONLY local gate for app work
```

Standing checks before declaring anything done:

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

must return zero hits (no hardcoded author name in code or content — the
operator is **Shikhar Suman**; older docs grepped the wrong surname and
also self-matched the guides, so use this form). Also: `No\.\s0` clean except
the travel masthead variant, and no horizontal overflow at 375px.

---

## 10. The next effort: a full product revamp

The operator's stated next step is a **complete revamp — design and
functionality** — aimed at something more commercial, more current, and more
enjoyable to interact with, with explicit latitude to rework design principles
and replace existing decisions.

Whoever picks that up should understand the tension, and resolve it deliberately
rather than by accident:

- The design canon in `docs/design/` exists **precisely so that design decisions
  survive a handover between models without quality decay.** It is the accumulated
  output of P0–P5.
- A revamp with liberty to rewrite those principles is a legitimate choice — but
  it should be a *decision*, not a side effect of not having read them.

**The recommended framing:** the canon is the *handover payload*, not the
obstacle. A new session inherits full context by reading it, then works within an
explicitly scoped mandate — for example, commercial and marketing surfaces,
visual treatment, and interaction language are open for reinvention, while these
stay fixed unless the operator says otherwise:

1. **The fallback contract** — every component paints its final state under no-JS,
   `prefers-reduced-motion`, and missing WebGL.
2. **Data honesty** — declared log scales and compressions; `plain` describes the
   *form*, captions carry the *data*; no invented values.
3. **Accessibility floor** — focus rings, 44×44 targets, real semantics.
4. **The brand/legal naming split** — "Parallax" in body copy, "Parallax Lens" in
   titles, RSS, and legal lines.

Everything else — palettes, layout systems, motion, typography, the home page,
the app surfaces, even the six-world structure — is arguable, provided the
argument is written down in `docs/design/` the way the current canon is.
