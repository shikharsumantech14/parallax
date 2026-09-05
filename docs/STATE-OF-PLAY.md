# State of play — read this first

> **Purpose.** A cold-start snapshot for anyone (human or agent) picking this repo
> up fresh. `AGENTS.md` tells you the *rules*; `docs/PROJECT.md` is the *history*;
> `docs/REVAMP-PLAN.md` is the revamp's decision record and execution sequence;
> this file tells you **where things stand right now and what to do next**.
>
> **Last updated: 2026-09-04.** Derived facts below are generated and gated —
> if they look wrong, run `npm run graph`, do not hand-edit. Volatile facts
> (branch, unpushed, dirty) are not in this file at all; read the session brief.
> Refresh the authored sections with `/update-state`.

---

## 1. The one-paragraph version

Parallax is a visual explainer publication (static Astro site at the repo root)
plus a separate Astro SSR reader-account app (`app/`, Supabase-backed). The
P0–P8 product-elevation program is **committed, pushed and deployed** (both
sites live). The current effort is the **design-system revamp** driven by the
Claude Design handoff — its source of truth is `docs/REVAMP-PLAN.md`, **v3,
signed 2026-09-04**: decisions RD-01…RD-13 (RD-03/07/09 superseded by
RD-10/12/13, struck not deleted), and the order is **look first** (RD-13):
finish 6.1 → 6.3 type → 7 web pages → the brand → 8 app → 5 mobile → Waves
2–4. Execution stands at: **Phases 0–2 complete, Phase 3 at Wave 1 of 4,
Phase 4's agent half plus the backfill done, 6.2 done, 6.1 built — only the
canon signature outstanding.** Alongside it, the **context system** (`docs/CONTEXT-PLAN.md`,
CD-01…CD-12) is being built out — Phases A–E are in.

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
| Decisions tracked | 35 (12 decided-but-unbuilt) |

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

Decision record + full phase plan: `docs/REVAMP-PLAN.md` (**v3, signed
2026-09-04**). Decisions RD-01…RD-13 are **locked — do not re-litigate**;
RD-03/07/09 are superseded by RD-10/12/13 and stay struck in the table so
citations resolve. Highlights of what shipped:

| Phase | Outcome |
|---|---|
| **0** | Draft issues no longer emit 404 `og:image`; `app/public/` exists (favicon was 404ing live); card-renderer font lookup fails loudly; `fetch-fonts` matches disk. Deployed. |
| **1** | `check:catalog` rebuilt (coverage of EXPLAIN + KIND_PRIORITY, no error-masking) and wired into `prebuild` **ahead of** the OG writer; `design-sync --check` gates 30 palette mirrors + 6 in-world deeps + 18 record tokens; tech accent-deep 4-way drift fixed; dead `FeaturedIssue.astro` (7th palette, 5 retired fonts) deleted; **WCAG pass** — derived `--muted` (60%/72%), the accent-deep two-role split, travel small-text fixes → all six worlds measure zero failures; **phone navigation** added (native `<details>` menu ≤900px — the site had none). |
| **2** | `docs/design/TOKEN-RECORD.md` (TD-01…TD-06); schema grew optional `howToRead`, top-level `caption`, `source {label,date}`, issue `voice`; `core/VizCard.astro` (the RD-01a shell seam); `px-inst` primitive in `dataviz-v2.css`; 11 bespoke-root figures gained the ⤢ modal via `[data-viz-root]`. |
| **3** | Wave 0: `bill-funnel` + `channel-ternary` (the two path exemplars, fully verified). Wave 1: `age-pyramid`, `margin-bullets`, `state-timeline`, `attrition-waffle`, `finish-interval`. **Library 97 of 118.** All wired through all NINE registry places. |
| **4 (partial)** | The three comprehension fields have stated contracts in the drafter, verifier (new flags: `CAPTION-FORM`, `REDUNDANT-HOWTO`) and catalog grammar. **Source backfill: 21 → 0 missing sources** on published figures (operator-confirmed mapping); `SectionBody` now merges promoted `caption`/`source` down into `data` for every kind; Timeline/BillBreakdown/VoteResult gained source rendering (since folded into `core/Section.astro` with every other kind — `8eea66f` / `b0260b2`; the three still accept the prop, render nothing). |
| **6.2** | B1 best-first, all three: `scaling-plot` log⇄linear (`e5fd2f1`), `xg-race` minute scrub (`d304c2d`), `climate-spiral` month scrub (`714d1ac`) — every projection computed at build, no scale math on the client; the `px-inst` exact readout reserve generalised (`328395d`); `howToRead` ×4 and the live caption fix (`81cc2da`). |
| **6.1 (built, unsigned)** | Flat viz card + `--viz-edge` world rule, ink on light desks / accent on dark (`b74815d`); RD-05 shadow sweep 115→64, hover retired to border-colour, the toolbar's flat 2px-ink skin (`943fe09`); the `Source ·` fold — one render site for every kind (`8eea66f`); ⤢ 44px on touch, SeatChart naming, story depth-1 hiding. The `EXPLAIN.how` fallback is **on** for every kind — `core/Section.astro` renders the how-to-read above the graphic, `SectionBody` resolves `section.howToRead ?? EXPLAIN[kind].how` for the ten VizCard kinds, a `:has()` rule guarantees exactly one panel per section, `tactics-pitch` rewritten as the one live cue (`bdbfea8`); the 70 `.px-viz__src` emitters stripped, the class and the interim hide retired — zero emitters, zero rules (`b0260b2`); CANON/motion amendments drafted and committed under a DRAFT line (`dc6a28c`). **Not done:** the operator's signature on those amendments, and the `--t-page` call (600ms kept, or retimed toward the handoff's ~300/340ms). |

**Corrections discovered in execution** (already folded into the plan/docs — do
not rediscover): the "CSS vars don't resolve in SVG presentation attributes"
claim was **false** (the convention stands for specificity + satori reasons —
see `src/components/AGENTS.md` §5); TD-06 (*any fill that carries text uses
`--accent-deep`*, vivid accent fails on travel at 3.91:1); the bill-funnel
blueprint's "darker segment" copy bug; the 12-bespoke-roots audit claim was
overstated (only 2 near-duplicate `.px-viz`, 8 carry no card at all — hence the
attribute, not the class). Added this cycle: the radius flip cannot live in
`shared/design/tokens.css` (the app consumes it — flatten there and RD-05's own
carve-out breaks); `--r-pill` is not flipped; three token flips reach 99 of 249
radii, not 128 of 267; ten theme elevation rules were v2-port orphans, including
the plan's own `.px-appr__svg` example; the tinted `howToRead` shipped in Phase
2; `TYPE-MAPPING.md` forbids Literata, so RD-04 was compliance, not rejection
(RD-11); the `EXPLAIN.how` review is of **90** strings, not the plan's 81 (Phase 1
backfilled nine breadth-pass kinds — the plan's figure is historical, not a
ruling); an authored `howToRead` on any of the 87 non-VizCard kinds was
**silently dropped** until `core/Section.astro` took the render (`bdbfea8`).

## 5. What is left, in order

1. **Operator: `git push`** when ready — the count is in the session brief,
   deliberately not written here (CD-11). Vercel deploys on push.
2. **6.1 finish** — operator: sign the CANON.md/motion.md amendments
   (`dc6a28c` — a DRAFT line sits at the top of each file until then) and rule
   on `--t-page` (600ms kept, or retimed toward the handoff's ~300/340ms).
   Everything else in 6.1 is built: the copy review was tabled at 90 strings
   (not 81), the `EXPLAIN.how` fallback is on (`bdbfea8`), the 70 `.px-viz__src`
   emitters are gone (`b0260b2`).
3. **6.3 type harvest** (RD-08) — measure the font binaries first; instrument
   h3, eyebrows, the three-line drop cap.
4. **Phase 7 — six web pages** — masthead to the 768px spec; home; desk = the
   topic index reskinned (ruled); issue on the 3-column grid **with the gate
   rework in one commit** (RD-12); `/archive` against the 10 real issues; About
   with the mark explained and the lore rows. `/subscribe` behind pricing.
5. **The brand** (RD-10) — the glyph outline proven on `mark.svg` first, *then*
   estimate; the swap list; a push busts favicon/OG caches.
6. **Phase 8 app** — manifest bridge first; eleven screens; compile-only here.
7. **Phase 5 — mobile legibility** (~4–6 days): generalise the
   `PowerFlow.astro:348` font-bump to the ~38 remaining SVG-text components
   (4 of 42 have it; ShotMap does NOT, despite older notes saying 5). Three
   files are already measured — `ScalingPlot.astro` carries the numbers.
8. **Phase 3 Waves 2–4** — **reassess at the look's exit**: 21 kinds, ~22
   days, against 77 of 97 unused. When they run, the build pattern is proven:
   parallel component agents (component file ONLY), orchestrator wires via
   **`scripts/wire-kind.mjs`** (example config in its header), worked example
   into the world's showcase, browser-verify against the blueprint §11, one
   commit per wave. Blueprints live at `docs/design/blueprints/<world>/`
   **with a standing corrections header — read it first; it overrides the
   handoff**. The editorial review flagged Wave 4's kinds as the least
   defensible spend.
9. **Schema tightening** — make `source` required now the gap is 0. Its own
   revertible commit. The 22 missing *captions* are **deliberate**: all 22
   carry an `intro` that already states the finding; adding captions would trip
   the verifier's new REDUNDANT rule. Recorded in `37a6f7d`.
10. **Still rejected/deferred**: photography and the lens (five grounds);
    `/subscribe` + pricing.
11. **Operator-optional, still open**: apex-vs-`www` primary domain in Vercel
    (canonical + og:image take a 307 today); OG filename fingerprinting
    (cheapest at 10 published issues).

## 6. Known residuals — deliberate, do not "discover"

- **In-SVG fine print ~3.4–7px at 375px** on fixed-viewBox cards. Phase 5 is the
  fix; the per-component bump pattern exists in 4 components.
- **Phase 5's bump is owed on `ScalingPlot`, `XgRace`, `ClimateSpiral`** —
  `ScalingPlot.astro` carries the measurements and why a plain bump fails
  (23 SVG units needed at 375px; y-ticks at that size run off the canvas into
  the rotated axis title; the de-clutter constants are build-time).
- **The ⤢ modal shows no source since `8eea66f`.** It portals the card; the
  source lives with the section now. Landed as-is by ruling; a modal source
  line is a separate, later call.

- **29 draft-only `EXPLAIN.how` cues still read as modal controls** ("Drag to
  spin…") — left for a bulk pass by ruling; none renders on a published page
  (`tactics-pitch` was the one live cue and is rewritten in `bdbfea8`).
- **`CANON.md` and `motion.md` carry a DRAFT line at the top** (`dc6a28c`) —
  the shell-adoption passages (CANON §1/§7/§10/§11/§13/§14; motion's
  `cardLift`/`pageEnter`/`worldFade` rows and hard rule 7) are the agent's draft
  until the operator removes that line. Cite them as draft, not law.
- **`--t-page` stays 600ms.** `pageEnter`/`worldFade` are named in `motion.md`
  against the existing CSS view transition; the handoff's ~300/340ms is
  unadopted — a token decision the operator still owes.

- **`.px-viz__src` is gone** — zero emitters, zero rules since `b0260b2`; the
  source line is `.px-plain__src`, rendered once by `core/Section.astro`.
  `story.css`'s `[class$='__src']` beat rule is left in place on purpose (a
  suffix rule; costs nothing). Do not give a component its own source, plain
  or how-to-read emitter — Section owns all three for every kind.
- **`howToRead` control clauses are wrong under no-JS** wherever the control is
  `html.js`-gated — reordered so the static reading leads; the proper fix is a
  JS-gated field or a VizCard convention (a schema call).
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
- **`--r-tile` / `--r-card` are consumed by `app/` from the shared token
  source** — flipping them there flattens the app against RD-05's own carve-out.
  Override in the publication's `base.css`. (Nearly done at shell adoption.)
- **`npm run graph` chained with `graph:check` in one shell line reports STALE
  spuriously** — the check runs before the write flushes. Run the script
  directly, or the two commands separately. (Cost a diagnosis.)
- **The preview browser reports `prefers-reduced-motion: reduce`**, so the
  motion contract's global reset makes every `transition` compute to `none`.
  Not a CSS defect — verify against a known-good committed rule first. (Cost a
  diagnosis.)
- **A `scrollIntoView` measurement taken before the reveal reflow settles is
  garbage** — 703px reported for a 76px paragraph. Wait ~1s, re-measure.
- **Bash heredocs carrying Astro/JSX content break in Git Bash** — use the
  Write tool or a scratch `.py`, as §7 already says for Node one-liners.

- **An authored `howToRead` on any of the 87 non-VizCard kinds was silently
  dropped until `bdbfea8`** — nothing read the field outside VizCard. Since
  then `core/Section.astro` owns the how-to-read (above), plain and `Source ·`
  (below) for every kind, and the `:has()` rule in `dataviz-v2.css` hides
  Section's panel when a slotted VizCard already carries one. A component that
  grows its own emitter for any of the three re-opens the double render.


## 8. Where to find things

| You want… | Read |
|---|---|
| The revamp's decisions + phases | `docs/REVAMP-PLAN.md` (RD-01…RD-13 §1; the v3 order in §4-v3) |
| Token law incl. TD-06 | `docs/design/TOKEN-RECORD.md` |
| The 28 blueprints (corrected) | `docs/design/blueprints/<world>/` — header first |
| The registry wirer | `scripts/wire-kind.mjs` |
| The two component exemplars | `topic/politics/BillFunnel.astro` (HTML), `topic/sports/ChannelTernary.astro` (SVG) |
| The shell + instrument primitives | `core/VizCard.astro`, `px-inst` in `src/styles/dataviz-v2.css` |

| The explainability chrome for every kind (how-to-read above; plain + `Source ·` below) | `core/Section.astro`; `.px-plain__src` in `src/styles/viz-type.css`; the one-panel `:has()` rule in `src/styles/dataviz-v2.css` |
| The canon, with its unsigned shell-adoption draft | `docs/design/CANON.md`, `docs/design/motion.md` — the DRAFT line at the top says which passages are not yet law |

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
