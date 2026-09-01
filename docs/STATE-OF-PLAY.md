# State of play — read this first

> **Purpose.** A cold-start snapshot for anyone (human or agent) picking this repo
> up fresh. `AGENTS.md` tells you the *rules*; `docs/PROJECT.md` is the *history*;
> `docs/REVAMP-PLAN.md` is the revamp's decision record and execution sequence;
> this file tells you **where things stand right now and what to do next**.
>
> **Last updated: 2026-09-01.** Derived facts below are generated and gated —
> if they look wrong, run `npm run graph`, do not hand-edit. Volatile facts
> (branch, unpushed, dirty) are not in this file at all; read the session brief.
> Refresh the authored sections with `/update-state`.

---

## 1. The one-paragraph version

Parallax is a visual explainer publication (static Astro site at the repo root)
plus a separate Astro SSR reader-account app (`app/`, Supabase-backed). The
P0–P8 product-elevation program is **committed, pushed and deployed** (both
sites live). The current effort is the **design-system revamp** driven by the
Claude Design handoff — its source of truth is `docs/REVAMP-PLAN.md`, every
decision is locked as RD-01…RD-09, and execution stands at: **Phases 0–2
complete, Phase 3 at Wave 1 of 4, Phase 4's agent-facing half plus the source
backfill done.** Alongside it, the **context system** (`docs/CONTEXT-PLAN.md`,
CD-01…CD-12) is being built out — Phases A–D are in.

For branch, uncommitted and unpushed counts, read the **session brief** printed
at session start, or run `node scripts/project-graph.mjs --brief`. Those facts
are deliberately not written down anywhere (CD-11).

---

## 2. Repo state

> **Three fact classes, and the split is the point (CD-02).** Below, in order:
> **derived** facts, generated and gated — never hand-edit them; then
> **attested** facts, which only the operator can know because they happened
> outside this box. **Volatile** facts (branch, unpushed, dirty tree) appear in
> neither — they live only in the session brief, because writing them down is
> what made this section wrong within three days last time.

<!-- BEGIN GENERATED — scripts/project-graph.mjs. Do not hand-edit (CD-09). -->

| Derived fact | Value |
|---|---|
| Section kinds | **97** (14 WebGL) |
| Blueprinted | 36 of 97 |
| Issues | 23 (10 published, 13 draft) |
| Kinds never in a published issue | **77** |
| Registry gaps | none |
| Decisions tracked | 29 (9 decided-but-unbuilt) |

<!-- END GENERATED -->

Refresh with `npm run graph`; `npm run graph:check` gates it in `prebuild`.

### Attested — the operator's word, not measurable here

| Fact | Attested | On |
|---|---|---|
| Deployed | everything through `c0887a3` is **live on Vercel** | 2026-08-28 |
| Migration | `20260705000000_journey_onboarding.sql` **applied** | 2026-08-28 |
| Live smoke | signup → `/welcome` → Shelf, `/api/join`, app favicon 200, published og:image 200, draft og:image absent | 2026-08-28 |

**Never regenerate, infer, or quietly refresh these dates.** If one looks
stale, ask the operator. Commits made after the attested date are, by
definition, not covered by it.

## 3. What this box can and cannot do

This machine is **code-only for the app**, and git pushes are the operator's.
Precisely (corrected 2026-09-01 — this section previously said "no
`.env.local`" flatly, which is wrong and was caught by `doc-audit`'s own
premise):

- **Root `.env.local` EXISTS** — the pipeline's `ANTHROPIC_API_KEY` etc. So the
  API-CLI pipeline scripts (`npm run pipeline:*`, `rag:*`) can run here, and
  running them **bills real money**. Gitignored; never commit it.
- **`app/.env.local` is ABSENT** — no Supabase URL/keys, so the app cannot run
  or be runtime-tested on this box. `cd app && npm run build` is the entire
  local gate — write "build green, runtime unverified".

Publication work is browser-verifiable via `npm run dev`.

One measurement trap, twice confirmed this cycle: **the preview browser reports
false page overflow.** With the pane not displayed, `clientWidth` is 0 and every
overflow probe fires; even displayed, `position: fixed` elements (the annotation
editor at `opacity: 0`, the reading-progress bar) measure wider than the
viewport. The only honest test is `window.scrollTo(9999, y)` → `scrollX`
stays 0. Do not "fix" overflow you have not proven that way.

---

## 4. The revamp: what is DONE (all committed)

Decision record + full phase plan: `docs/REVAMP-PLAN.md` (v2). Decisions
RD-01…RD-09 are **locked — do not re-litigate**. Highlights of what shipped:

| Phase | Outcome |
|---|---|
| **0** | Draft issues no longer emit 404 `og:image`; `app/public/` exists (favicon was 404ing live); card-renderer font lookup fails loudly; `fetch-fonts` matches disk. Deployed. |
| **1** | `check:catalog` rebuilt (coverage of EXPLAIN + KIND_PRIORITY, no error-masking) and wired into `prebuild` **ahead of** the OG writer; `design-sync --check` gates 30 palette mirrors + 6 in-world deeps + 18 record tokens; tech accent-deep 4-way drift fixed; dead `FeaturedIssue.astro` (7th palette, 5 retired fonts) deleted; **WCAG pass** — derived `--muted` (60%/72%), the accent-deep two-role split, travel small-text fixes → all six worlds measure zero failures; **phone navigation** added (native `<details>` menu ≤900px — the site had none). |
| **2** | `docs/design/TOKEN-RECORD.md` (TD-01…TD-06); schema grew optional `howToRead`, top-level `caption`, `source {label,date}`, issue `voice`; `core/VizCard.astro` (the RD-01a shell seam); `px-inst` primitive in `dataviz-v2.css`; 11 bespoke-root figures gained the ⤢ modal via `[data-viz-root]`. |
| **3** | Wave 0: `bill-funnel` + `channel-ternary` (the two path exemplars, fully verified). Wave 1: `age-pyramid`, `margin-bullets`, `state-timeline`, `attrition-waffle`, `finish-interval`. **Library 97 of 118.** All wired through all NINE registry places. |
| **4 (partial)** | The three comprehension fields have stated contracts in the drafter, verifier (new flags: `CAPTION-FORM`, `REDUNDANT-HOWTO`) and catalog grammar. **Source backfill: 21 → 0 missing sources** on published figures (operator-confirmed mapping); `SectionBody` now merges promoted `caption`/`source` down into `data` for every kind; Timeline/BillBreakdown/VoteResult gained source rendering. |

**Corrections discovered in execution** (already folded into the plan/docs — do
not rediscover): the "CSS vars don't resolve in SVG presentation attributes"
claim was **false** (the convention stands for specificity + satori reasons —
see `src/components/AGENTS.md` §5); TD-06 (*any fill that carries text uses
`--accent-deep`*, vivid accent fails on travel at 3.91:1); the bill-funnel
blueprint's "darker segment" copy bug; the 12-bespoke-roots audit claim was
overstated (only 2 near-duplicate `.px-viz`, 8 carry no card at all — hence the
attribute, not the class).

## 5. What is left, in order

1. **Operator: `git push`** when ready — the count is in the session brief,
   deliberately not written here (CD-11). Vercel deploys on push.
2. **Phase 3 Waves 2–4** — 21 kinds remain: Wave 2 (7 SVG, ~1.5 sessions),
   Wave 3 (7 geometry, ~2.5), Wave 4 (7 hard, ~3.5). The build pattern is
   proven: parallel component agents (component file ONLY), orchestrator wires
   via **`scripts/wire-kind.mjs`** (example config in its header), worked
   example into the world's showcase, browser-verify against the blueprint §11,
   one commit per wave. Blueprints live at `docs/design/blueprints/<world>/`
   **with a standing corrections header — read it first; it overrides the
   handoff**. The editorial review flagged Wave 4's kinds as the least
   defensible spend; reassess before starting it.
3. **Phase 5 — mobile legibility** (~4–6 days): generalise the
   `PowerFlow.astro:348` font-bump to the ~38 remaining SVG-text components
   (4 of 42 have it; ShotMap does NOT, despite older notes saying 5).
4. **Phase 6–8 — workstream B** (shell adoption + flatness RD-05, B1 instrument
   retrofits, B3 web pages, B2 app). Best-first B1 items are HOURS:
   `scaling-plot` log⇄linear 4h, `xg-race` scrub 3h, `climate-spiral` scrub 3h.
   The plan argues B beats Wave 2 on reader value (70 of the original 90 kinds
   have never appeared in a published issue).
5. **Schema tightening** — make `source` required now the gap is 0. Its own
   revertible commit. The 22 missing *captions* are **deliberate**: all 22
   carry an `intro` that already states the finding; adding captions would trip
   the verifier's new REDUNDANT rule. Recorded in `37a6f7d`.
6. **Deferred by decision**: the brand mark (RD-03 — B4 ~12d parked), `/subscribe`
   + pricing, photography (rejected; drawn-plate treatment optional), About lore.
7. **Operator-optional, still open**: apex-vs-`www` primary domain in Vercel
   (canonical + og:image take a 307 today); OG filename fingerprinting
   (cheapest at 10 published issues).

## 6. Known residuals — deliberate, do not "discover"

- **In-SVG fine print ~3.4–7px at 375px** on fixed-viewBox cards. Phase 5 is the
  fix; the per-component bump pattern exists in 4 components.
- **SeatChart renders `px-seats__source` / "Source:"** where everything else
  uses `px-viz__src` / "Source · " — so story.css's `[class$='__src']` hiding
  rule misses it. Fold into shell adoption, not a content commit.
- **The ⤢ expand button is 30px** (pre-revamp). Fold into shell adoption.
- **`state-timeline` carries 3 raw hexes** — a DECLARED fixed encoding
  (green/amber/red service status), single declaration, never colour-alone.
- **Text-heavy story beats scroll** (sanctioned); **dashboard tiles title-case
  slugs** (issues-manifest bridge unbuilt — first move of Phase 8).
- **`finish-interval` rows are 34px with a mouse, 44px on touch** — deliberate
  (`@media (pointer: coarse)`).

## 7. Traps that have actually bitten (additions this cycle in bold)

- A subagent once wiped uncommitted work with `git checkout` — **commits only;
  the shared registry files are edited by the orchestrator alone, never by
  parallel agents** (component agents get an explicit one-file scope).
- `plain` is Zod-capped at 220 chars — and **13 of the handoff's own explainer
  strings exceed it**; EXPLAIN is uncapped, `section.plain` is not.
- **`<details>` panels: setting `display` on the panel overrides native hiding**
  — gate on `[open]` (bit the masthead menu; measured, not assumed).
- **Node one-liners with regex/quotes break in Git Bash on Windows** — write
  scratch `.mjs`/`.py` files instead. **Python prints need
  `PYTHONIOENCODING=utf-8`** (cp1252 chokes on em-dashes).
- **Exact-string anchors fail on CRLF files** — `config.ts` is CRLF, match
  `\r?\n` (this is why `wire-kind.mjs` exists).
- `coalition-calculus` dispatches with a spread; `CityGrid` hard-throws outside
  1–3 cities; globe seed-yaw is `-((cLon + 90) * PI) / 180`.
- The false-overflow measurement trap (§3).

## 8. Where to find things

| You want… | Read |
|---|---|
| The revamp's decisions + phases | `docs/REVAMP-PLAN.md` (RD-01…RD-09 §1) |
| Token law incl. TD-06 | `docs/design/TOKEN-RECORD.md` |
| The 28 blueprints (corrected) | `docs/design/blueprints/<world>/` — header first |
| The registry wirer | `scripts/wire-kind.mjs` |
| The two component exemplars | `topic/politics/BillFunnel.astro` (HTML), `topic/sports/ChannelTernary.astro` (SVG) |
| The shell + instrument primitives | `core/VizCard.astro`, `px-inst` in `src/styles/dataviz-v2.css` |
| Section-kind → component map | `src/components/AGENTS.md` |
| Issue authoring incl. new fields | `src/content/issues/_AGENTS.md` |
| The design handoff (delivered artifact) | `Parallax Design System Revamp/` — authority: AGENTS → INTEGRATION → blueprints; README is stale background |
| Standing rules / app / pipeline | `AGENTS.md`, `app/AGENTS.md`, `research/AGENTS.md` |
| How context reaches a session | `docs/CONTEXT-PLAN.md` (CD-01…CD-12 §3; §10 in plain terms) |
| Frozen history — **not current** | `docs/archive/` — read its README before citing anything there |

Live examples of all 7 new kinds: the six `2026-06-03-<world>-showcase` issues
(status draft — unhide gated sections in the console with
`document.querySelectorAll('.px-gate-hidden').forEach(e => e.classList.remove('px-gate-hidden'))`).

## 9. Verification commands

```bash
npm run build            # 44 pages. prebuild runs design-sync --check +
                         # check-catalog BEFORE og.ts writes anything.
                         # Use `npx astro build` to skip the hook while iterating.
npm run check:catalog    # 97 ↔ 97, order, EXPLAIN + KIND_PRIORITY coverage
npm run design:check     # 30 mirrors + 6 in-world deeps + 18 record tokens
cd app && npm run build  # the ONLY local gate for app work
```

Standing greps (all must return zero):

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

```bash
grep -rn 'font-family="var(' src/components/topic/
```

Plus per touched component: no-JS final state, `prefers-reduced-motion`, 375px
with the honest overflow test (§3), 44px targets on touch, text ≥ 9.5px.
