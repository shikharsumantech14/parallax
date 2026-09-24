# State of play — read this first

> **Purpose.** A cold-start snapshot for anyone (human or agent) picking this repo
> up fresh. `AGENTS.md` tells you the *rules*; `docs/PROJECT.md` is the *history*;
> `docs/REVAMP-PLAN.md` is the revamp's decision record and execution sequence;
> this file tells you **where things stand right now and what to do next**.
>
> **Last updated: 2026-09-16, with a 2026-09-23 addendum below.** Derived
> facts below are generated and gated — if they look wrong, run
> `npm run graph`, do not hand-edit. Volatile facts (branch, unpushed, dirty)
> are not in this file at all; read the session brief. Refresh the authored
> sections with `/update-state`.

---

## 0. Addendum, 2026-09-23 / 24 — the visual layer, and the gate it was missing

Sixteen issues are published: the ten rewritten in the register and six new
ones (one per desk, 2026-09-21) through the full v2 pipeline. The operator
read the six live, signed in, and found the visual layer broken on every one;
the fixes of 2026-09-22 had chased the wrong thing. What changed, and what
holds now (`AGENTS.md` §7 and §10, 2026-09-23 and 2026-09-24; RD-14 and RD-15
in `docs/REVAMP-PLAN.md`):

- **The section geometry was the bug.** `layout-v2.css`'s breakouts predated
  the launch floor plan and crossed the rails that now carry the facts and the
  contents list. **Ruling (RD-14):** a section has two widths, the measure
  (720) and the breakout. `wide` keeps the text at the measure and lets the
  figure out 45px each side, 24px clear of the rules. `bleed`, `split` and
  `split-flip` are aliases of `wide` until re-derived; `breath` is
  left-aligned. `core/Section.astro` is one markup for every layout. The
  agents no longer author split or bleed.
- **`npm run check:render` is the render gate (RD-15), and it is enforced.**
  Headless Chrome, signed-in reader, 1280 and 375, objective measurements, a
  screenshot per section per width under `research/_ui/<date>/`. Its first run
  found 49 blocking defects on the sixteen live issues; the tree at `9ec133a`
  and after measures 0 blocking, 0 warnings. `guard-render.mjs` refuses a
  rendering-relevant commit without a fresh clean run that covers it.
- **Committed and live:** `9ec133a` (the geometry, the gate, the fixes from
  the first run), pushed by the operator 2026-09-24; the wide-figure air and
  the hook follow in the next commit.
- **Open — the next work package:** the six showcase drafts carry 32 blocking
  findings across 14 never-published kinds (the list is in `AGENTS.md` §10,
  2026-09-24); the gate will refuse the first issue that carries one until the
  kind is fixed, so fix the kinds before the next round picks them. Also the composer's
  cross-round kind ledger and a closing-section rule are still to be written;
  the operator's pending editorial items from the 2026-09-21 round stand
  (space delta-v figures, sports IPL and Swiss Ramble figures, politics
  prorogation and committee-referral source, travel ₹3.5 crore source, the
  allowlist edits); the phone card-scroll ruling (charts drawn for 720 scroll
  inside their card at 375) may want revisiting after the operator reads on a
  phone.

---

## 1. The one-paragraph version

Parallax is a visual explainer publication, one Astro project in
`output: 'hybrid'` since the 2026-09-06 merge: the publication prerenders,
the reader-account routes render on demand, Supabase-backed. The launch
design (2026-09-08) is committed and deployed; the announcement date is open,
the operator will set one. The current effort is the **register plan**,
`docs/REGISTER-PLAN.md`, **v1 signed 2026-09-13**, RG-01…RG-22: reader
feedback was measured rather than assumed, and the fix is a register change
(plain Indian English, Hindi only where it fits and never load-bearing) plus
component-first composition, gated. **Phases 1–4 and RG-19 are built and
committed**: the runtime contract v2 with its lexicon and jargon list; the
storyboard step and the reader panel on both routes; `check:prose` in report
mode; the how-to-read default per kind; four plain-language kinds and the
annotation slot; and **the four flagship issues rewritten in the register**
(delimitation, El Niño, Arsenal, the Everest/Fuji queue), each through
storyboard → draft → panel → stylist → verifier → gate, zero untraced claims,
two published numbers corrected on the way. Two rulings landed on 2026-09-14:
foreign money stays primary with a bracketed ₹ only on current figures, and
the machine-prose marks (em-dashes, semicolons, the AI word list) are out.
**Phase 6 closed on 2026-09-15: the other six are rewritten too** (kessler,
transgender-ratchet, the token bill, amazon, asteroid, cockroach), so **all
ten published issues are now in the register** and every one clears all four
composition floors. A sweep the same day found **thirteen catalog-documented
fields that no component rendered**, two of them live, and `check:catalog`
gained check 5 so the class cannot recur. Next is promoting
`check:prose:gate` into `prebuild`, whose condition is now met, then the copy
deck and the EXPLAIN batch. The design-system revamp
(`docs/REVAMP-PLAN.md` v3) stands at its Phase 5/7 residuals, with Waves 2–4
reassessed against usage rather than count; the context system
(`docs/CONTEXT-PLAN.md`) Phases A–E are in.

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
| Section kinds | **101** (14 WebGL) |
| Blueprinted | 40 of 101 |
| Issues | 23 (10 published, 13 draft) |
| Kinds never in a published issue | **76** |
| Registry gaps | none |
| Decisions tracked | 35 (8 decided-but-unbuilt) |

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

One measurement trap, three times confirmed: **the preview browser reports
false page overflow.** With the pane not displayed, `clientWidth` is 0 and every
overflow probe fires; even displayed, `position: fixed` elements (the annotation
editor at `opacity: 0`, the reading-progress bar) measure wider than the
viewport. `window.scrollTo(9999, y)` → `scrollX` is the honest test **only once
the viewport is real** — corrected 2026-09-05, when it returned `scrollX: 352`
on a page with no overflow at all. A hidden pane reports `innerWidth: 0`,
`clientWidth: 0` and a non-zero `scrollWidth`, so the scroll test fires too; it
is not immune, it is downstream of the same zero. **Assert `innerWidth > 0` in
the same call as the probe**, or set a real viewport first with `resize_window`
— which works even while the pane is hidden and is cheaper than displaying
it. Do not "fix" overflow you have not proven with the viewport width printed
beside it.

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
| **6.1 (signed)** | Flat viz card + `--viz-edge` world rule, ink on light desks / accent on dark (`b74815d`); RD-05 shadow sweep 115→64, hover retired to border-colour, the toolbar's flat 2px-ink skin (`943fe09`); the `Source ·` fold — one render site for every kind (`8eea66f`); ⤢ 44px on touch, SeatChart naming, story depth-1 hiding. The `EXPLAIN.how` fallback is **on** for every kind — `core/Section.astro` renders the how-to-read above the graphic, `SectionBody` resolves `section.howToRead ?? EXPLAIN[kind].how` for the ten VizCard kinds, a `:has()` rule guarantees exactly one panel per section, `tactics-pitch` rewritten as the one live cue (`bdbfea8`); the 70 `.px-viz__src` emitters stripped, the class and the interim hide retired — zero emitters, zero rules (`b0260b2`); CANON/motion amendments drafted and committed under a DRAFT line (`dc6a28c`). **Both files are now SIGNED** — `CANON.md` 2026-09-05 (`0104915`), `motion.md` 2026-09-07 (`b06caec`) with the `--t-page` ruling it was gated on: navigation split off to `--t-slow` (420ms) because it answers a CLICK; in-page settling keeps 600ms. The token was never a page-transition token — 12 sites, exactly one navigation — so retiming it would have bought a faster click by making every scroll reveal snappier, paying for the fix with the register worth keeping. |
| **6.3** | Type harvest, **complete 2026-09-05**. Prose **17.5px**, not RD-08's literal 18 — measured against the loaded binaries: Schibsted's x-height is the LARGER (0.530/em against Literata's 0.515), so the prototype's 18px Literata is 17.5px of Schibsted and 18 would overshoot its own optical intent by 3% (`0894af8`). Space's 15.5px override folded in; travel's 19px Fraunces body kept by ruling, and it now reads ~11% smaller in x-height than the other five — deliberate, commented in `base.css`. Standfirst 18.5→20px, closing an inversion where the serif lead rendered a *smaller* x-height than the body it introduces. Eyebrow to 9.5/600/.16em across 29 rules, tracked through the `--viz-ls-mono` token that already existed at .16em and that `.vz-legend` was ignoring (`d2b6cd3`); sports' and travel's display-face eyebrows pinned at 11px; the `Source ·` line, the world signature ornaments and the control chips excluded by ruling. `h3` landed on `.px-bills__title` — its only referent in the repo, the spec describing a `vizTitle` field the schema does not have (`c224e44`). Measure deliberately untouched: the 720px column dominates CPL (95.9→84.8 at 1280) and RD-12 redraws it, so it is taken once. |

| **5 (step 1)** | **Mobile legibility, and the diagnosis is the finding.** It was never a font-size problem, which is why it survived a year of being described as one. These SVGs are `width: 100%` over a fixed viewBox, so text renders at `authored × (cardWidth / viewBoxWidth)`: at 375px the card is 273px, a 720-unit chart scales by 0.379, and an authored 9.5px lands at 3.6px. `throughput-dial` uses the SAME 9.5px on a 280-unit viewBox and measures 9.3px. PowerFlow, the exemplar the plan said to generalise, measures **7.0px** — short of the floor it was written for. Fixed with one block in `dataviz-v2.css`: `min-width` = each chart's own coordinate width, and the CARD scrolls, so the scale factor is 1 and labels land where they were drawn. **23 charts, 3.1 → 9–12.5px** (`f76fa8c`). Four remain short BY DESIGN and the block records each: `region-map` (authored at 7.5px — a type call), `flight-of-the-ball` (`.viz3d--fball` pins an aspect-ratio, so a min-width cannot help), the WebGL fallbacks (no class to target), `climate-spiral` (square radial — wants a redraw). Exit not met: 6 issues swept, not 23. |
| **7** | **The six web pages.** Masthead to the 768px spec (the phone threshold settled at 768 by splitting the badge query, after five failed attempts); home leading with the issue; desk as the reskinned topic index (ruled); the issue floor plan **with the RD-12 gate rework in the same commit**, carrying the fact grid, meta strip, primer strip and the three-line Fraunces drop cap; `/archive` (chips + live search, controls ship `hidden` and are revealed by the island) against the 10 real issues; About with the mark explained and the six lore rows. |
| **Brand (RD-10)** | **All five steps.** The P outlined from Literata at two optical tiers — proven on `mark.svg` first (0.15% ink delta against its source), and the 11.5% discrepancy that looked like an error turned out to be a DIFFERENT Literata instance: Google's CSS2 API serves static slices when an axis is pinned. Two tiers kept because the display cut loses 14% of its ink at 40px where the text cut loses 2.9%. `src/lib/mark.ts` is the single geometry source (`DIAL`, `ringFor`, `cutFor`, `markBody`, `markSVG`); `core/Mark.astro` renders it; the masthead/wordmark swap, About's mark + lore, and the per-desk cuts all draw from it — as do the favicon and the PWA icons. |
| **The merge** | **One project since 2026-09-06.** `app/` folded into the publication: `output: 'hybrid'`, 45 pages prerendered, 24 SSR routes opting out. `app.parallaxlens.com` survives as an alias only. Design notes moved to `docs/APP-SURFACES.md`. It cost two failed deploys and one silent outage — all three are §7 entries — and it bought the thing Phase 8 could not have: one origin, which is what a service worker and a TWA both require. |
| **PWA** | **Installable, and offline reading works.** Manifest + icon set generated from the medallion (`f1c336c`); the service worker cache-on-read, sessions never cached, Google Fonts kept as validated CORS responses rather than opaque ones (`a1485f9`, `bd72092`). Verified against a real build with the server stopped: a read issue renders complete with its own CSS and all three faces. `npm run preview` was rebuilt to make that testable at all — `astro preview` cannot run under the Vercel adapter (`11e1aac`). |
| **Launch design (2026-09-08)** | **The public launch is 19 September, and the operator ruled the product's adoption of the handoff too loose to ship.** A twelve-artboard canvas prototype was drawn from `Parallax Web.dc.html`, approved, and implemented in one pass: Literata everywhere; a 1280 frame of hairline bands with scoped page styles (`meta.css` is tokens only); zero radii; the masthead lockup measured onto one axis; the issue page rebuilt (IssueHead, the 720 measure inside 170/1fr/250, facts rail + aside, reactions / letters / sources as bands, a pinned reading strip, margin notes removed); one desk template; home, about, archive rebuilt; `/subscribe` with the beta pricing (₹149 → ₹0); kind `plate` (98). Full build, all gates, 412px overflow and the menu's 44px targets verified. Details: `AGENTS.md` §10, `src/components/AGENTS.md` change log. |
| **Register plan, Phase 4 (2026-09-14)** | The four flagships rewritten in place and committed (`1cb7256`…`55b6aea`), same slugs, same status. Each went storyboard (operator-approved) → draft → reader panel → stylist → verifier → `check:prose`; panels all REVISE with every quiz answered, verifiers 41–59 verified and **zero untraced** on each, all fixes applied. Arsenal's seven Opta figures were re-anchored first and two published numbers were wrong (28.5 → 28.3 xGA; "a quarter" → 35.9% of set-piece goals). The pipeline pass fixed the tooling under it: an authored caption on timeline / seat-chart / vote-result had never rendered (`core/Section.astro` now prints `.px-section__claim`, hidden where the component shows its own); `skimCaption` was a restatement site in the contract but renders only in Skim mode; seven gate false flags. Measured on the four: 907–1,774 → 970–1,098 reader-facing words; 137–607 → 77–80 words before the first graphic; 15–24 → 5–12 names; five kinds reached readers for the first time. Two rulings the same day: the currency rule (foreign money primary, bracketed ₹ only on current figures) and the machine-prose marks (no em-dashes, no semicolons in prose, the AI word list; tells 18–22). |
| **Register plan, Phase 6 (2026-09-15)** | The remaining six rewritten in place and committed (`4122cc9`, `9d23414`), same slugs, same status. Each went storyboard (operator-approved) → draft → panel → stylist → second panel → verifier → `check:prose`. **All six passed the second panel with every quiz question answered by all four personas, and all six verifiers returned zero untraced claims across 303 checked.** Transgender-ratchet took a narrow re-anchoring pass first, which landed the Lok Sabha record at T0 by walking the e-library as a DSpace REST API, and which corrected its own storyboard. **All ten published issues now clear every floor**: ≤1,100 words, ≥60% visual, ≤80 before the first graphic, ≤12 names, against a backlist that averaged 1,573 words at 49% visual with up to 639 words of head and 55 names. Six kinds reached readers for the first time (`power-matrix`, `you-think`, `jargon-buster`, `three-steps`, `number-sense`, `bill-passage`). Five published errors corrected: "Parliament passed three laws" (it passed two, and the 2016 Bill cleared the Lok Sabha before lapsing in the Rajya Sabha, so neither three laws nor lapsed in committee); a minister's sentence presented as his own words from the record, where the record says "biological condition" and the reported English says "gender identity"; a NASA quotation trimmed and recapitalised inside quote marks; "either tipping point ends the same way", which the record splits by branch; and a hero cell giving an account control over copies its readers held. Two standing rules were set: **draw the low end of a published band and put the band in the copy**, and **no rupee bracket inside a dated event or on a per-token rate card**. |
| **The unread-field sweep (2026-09-15)** | All 101 kinds swept, each catalog `DATA:` line against what its component reads BELOW the frontmatter fence. **Thirteen documented fields rendered nothing.** A props interface is a declaration, not a reader, which is why every one survived: each was in the interface, the header comment, the catalog and issue frontmatter, and Astro does not error on an unread prop. Two were live: the Arsenal pitch shipped **eleven blank discs** (`tactics-pitch.role`), and `data-readout`'s `emphasis` reached the DOM and painted nothing because its CSS stayed on the retired `.px-readout__tile` prefix, so **25 flags across 8 published issues** were flat. `comparison`'s entire documented `columns` shape had never been implemented. Rendered rather than struck where authors already used them (`benchmark-chart.sublabel` is the Kessler hero, designed around it); struck with content moved otherwise. `Comparison` also stopped emitting its own source line, the last component-rendered one in the codebase, which printed the source twice and ends `__source` so neither the 2026-09-04 sweep nor story.css's `[class$='__src']` rule caught it. **`check:catalog` gained check 5**: every DATA field needs a reader in the component, its dispatch arm, its imports or its WebGL scene, and a bare prop forward does not count. 852 fields. Exceptions carry a reason in `ACCEPTED_UNREAD`. |
| **Register plan (2026-09-13)** | Reader feedback measured (REGISTER-PLAN §1): the formulas said the issues were already easier than Finshots; what was missing was hand-holding, the copy was ~40 blocks an issue, ~300 names, and no Indian ground (₹, crore, Hinglish: zero). Signed RG-01…RG-22 with two amendments (Hindi only where it fits; no date). Built: `_voice-core.md` v2, the lexicon, the jargon list; `composer` and `reader-panel` with `/pipeline-storyboard`, `/pipeline-panel` and the API phases behind `GATES.storyboard` (`'required'`); drafter, stylist, verifier and researcher re-based; `check:prose` (report mode: 0 blocking on the backlist, 16–59 warnings per issue); RG-19 (`howToReadFor`, `NEEDS_HOW`, the source inline on the plain line; the delimitation page went from 5 panels to 0); Phase 3 (`you-think`, `jargon-buster`, `number-sense`, `three-steps`, `analogy` pairs, `hero` retired, annotations on eight charts, all verified on the showcases). Five commits, `828f9a5`…`b2e21a5`. |

**Corrections discovered in execution** (already folded into the plan/docs — do
not rediscover): the "CSS vars don't resolve in SVG presentation attributes"
claim was **false** (the convention stands for specificity + satori reasons —
see `src/components/AGENTS.md` §5); TD-06 (*any fill that carries text uses
`--accent-deep`*, vivid accent fails on travel at 3.91:1); the bill-funnel
blueprint's "darker segment" copy bug; the 12-bespoke-roots audit claim was
overstated (only 2 near-duplicate `.px-viz`, 8 carry no card at all — hence the
attribute, not the class). Added this cycle: the radius flip was put in `base.css` rather than
`shared/design/tokens.css` because the app consumed those tokens — **that reason
died with the merge (2026-09-06)**; the override is now vestigial, and moving it
is an RD-05 call rather than a cleanup; `--r-pill` is not flipped; three token flips reach 99 of 249
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
   **Launch follow-ups (the date is open since 2026-09-13; the operator sets
   it):** supply the About portrait
   (`EDITOR_PORTRAIT` in `about.astro`) and any issue plates (`kind: plate`
   needs an image under `public/`); the reader-account pages (login, shelf,
   admin) still run `app.css` and were only re-fonted, not redesigned; the
   design rules in `docs/design/CANON.md` describe the pre-launch look and are
   to be re-hardened after launch (operator's stated intent).
2. **Register plan, what is left after Phase 6.** All ten issues are in the
   register as of 2026-09-15, so **promote `check:prose:gate` into
   `prebuild`** — the condition it was waiting on is met. Then the copy deck
   and the EXPLAIN batch (8.2, 8.3), the `hi-Latn` span for justified prose
   (RG-18), and the readers' test on the flagships (7.4; the operator supplies
   five readers, two without Hindi). **Three dossiers are stale about their
   own allowlists** and should be corrected before any of them is drawn on
   again: politics writes off India Code and the Supreme Court archive, both
   listed at T0 (and its §3 puts the 26 Nov 2019 passage in the wrong House);
   earth predates Global Forest Watch reaching T1. Two research jobs, neither
   blocking: one published catalogued-object count closes kessler's missing
   total, and one dated per-million-token price series closes the token bill's
   evidence gap and unblocks `moore-ladder`.
3. **Phase 5 — finish it.** Step 1 landed (`f76fa8c`, §4). What is left is the
   stated exit and the four exclusions: sweep all 23 issues at 375px rather
   than the 6 showcases, test for new clipping, decide `region-map`'s authored
   7.5px labels (a type-scale call, not geometry), and handle
   `flight-of-the-ball`'s pinned mount aspect-ratio. Step 2 of the original
   plan — rebuilding `adoption-curve` and `scaling-plot` as true mobile
   layouts — is **no longer urgent**: both now clear the floor, so it would buy
   back the at-a-glance shape, not legibility.
4. **Phase 3 Waves 2–4** — **reassess at the look's exit**: 21 kinds, ~22
   days, against 81 of 101 unused. The register plan's finding was that
   usage, not count, is the problem, and its four plain-language kinds now
   exist; reassess after Phase 4 puts kinds into published issues. When they
   run, the build pattern is proven:
   parallel component agents (component file ONLY), orchestrator wires via
   **`scripts/wire-kind.mjs`** (example config in its header), worked example
   into the world's showcase, browser-verify against the blueprint §11, one
   commit per wave. Blueprints live at `docs/design/blueprints/<world>/`
   **with a standing corrections header — read it first; it overrides the
   handoff**. The editorial review flagged Wave 4's kinds as the least
   defensible spend.
5. **Schema tightening** — make `source` required now the gap is 0. Its own
   revertible commit. The 22 missing *captions* are **deliberate**: all 22
   carry an `intro` that already states the finding; adding captions would trip
   the verifier's new REDUNDANT rule. Recorded in `37a6f7d`.
6. **TWA (Android) — BLOCKED on the operator, not on the repo.** The PWA is
   live and installable from the browser today; a Trusted Web Activity is the
   Play-Store wrapper on top of it. `scripts/twa-assetlinks.mjs` writes and
   validates `/.well-known/assetlinks.json` (verified: a dot-folder under
   `public/` does survive the build, and no APP_ROUTES prefix intercepts the
   path). The file is deliberately **not committed** — it cannot be written
   without the app's signing-key fingerprint, and a wrong one is worse than an
   absent one, because Android caches a failed verification until the app is
   reinstalled.

   Needs two values, both of which only exist once a Play Console app does:
   the reverse-DNS package id (**permanent once published**) and the SHA-256
   **App signing key** fingerprint — *not* the upload key, because Play App
   Signing re-signs with a key the operator never holds. Pass the upload key
   as well so locally-signed test builds verify too.

   Also gating: Play charges a one-time $25 registration, and a new personal
   developer account needs 12 testers on a closed test for 14 days before
   production access.
7. **Still rejected/deferred**: photography and the lens (five grounds).
   (`/subscribe` with the ₹149 → ₹0 beta price shipped with the launch design;
   the line that listed it here was stale and was cut on 2026-09-13.)
8. **Operator-optional, still open**: OG filename fingerprinting (cheapest
   at 10 published issues). The apex-vs-`www` item that sat here is
   **settled** — the apex is Production and `www` 308s to it since
   2026-09-06. It was never merely cosmetic: `canonical`, RSS and OG all
   declared the apex while Vercel served `www`, and the redirect between them
   silently killed all seven reader islands (§7).

## 6. Known residuals — deliberate, do not "discover"

**Ranked by what leaving them actually costs** (audited 2026-09-07). The short
version: nothing on this list needs doing this week, and only one item is worth
doing soon.

**1 · Social art is on the RETIRED brand.** `assets/brand/*.png` are dated
2026-06-22 — the pre-RD-10 two-lens mark, not the medallion. `npm run
brand:assets` (`scripts/brand-assets.ts`) still renders that mark, so re-running
it reproduces the old identity. If those files are deployed as the actual
avatars and banners, the site and the social presence are on two different
brands. **The only visible-to-everyone item here, and the cheapest to fix** —
but it is a re-authoring against `src/lib/mark.ts`, a design act, not a sweep.

**2 · Nothing enforces "no source, no section."** `source` is `.optional()` in
`config.ts`, so a future issue can publish a figure with none and no gate
catches it. Against a brand promise of *fully-sourced issues* that is a
credibility hit rather than a bug. **Low probability today** — the verifier
traces claims and `published` is flipped by hand — **and it gets worse exactly
as publishing volume rises**, which is when eyeballs stop catching it. Audited:
all 10 published issues are clean; 6 sourceless sections exist, all in two
drafts (4 in `seven-appeals-rupee-pressure`, needing real sourcing; 2 in
`politics-showcase`, where synthetic demo data makes "source" a different
question).

**3 · `shot-map` renders at 7.6px** in the published
`2026-06-04-arsenal-set-piece-title`. The ONLY Phase 5 residual a reader meets
today — its 360-unit viewBox already fits, so forcing a scroll would cost the
pitch's shape for 2px. Cosmetic; the ⤢ study view is adjacent.

**4 · 120 sections carry `source` under `data:` instead of at the top level.**
Renderers read `section.source ?? data.source`, so this costs a reader nothing
and changes no output. It is purely the blocker to item 2: Zod can only require
the top-level field, so flipping `.optional()` off today fails 120 sections.
Only 28 are already promoted. Mechanical to migrate, and worth doing as its own
commit rather than smuggled into a schema change.

**5 · The rest of Phase 5 is draft-only.** `flight-of-the-ball` (3.6px — its
mount pins an aspect-ratio, so a min-width cannot help), `climate-spiral`,
`region-map` (authored at 7.5px — a type call), the WebGL fallbacks, and the
narrow-viewBox forms left by ruling. **No published issue uses any of them**,
and the WebGL ones only render without WebGL. Fix one the week you publish an
issue that uses it, not before.

**7 · `check:prose` is report-only, on purpose.** Six published issues are
still the old register and carry 16–59 warnings each (the four flagships are
clean); a gate would block every deploy until the Phase 6 rewrites land. `check:prose:gate` (blocking flags
only) joins `prebuild` when the backlist passes.

**8 · 76 kinds still render only in the showcase drafts.** Phase 4 put five
into published issues (`you-think`, `jargon-buster`, `number-sense`,
`three-steps`, `benchmark-chart`); Phase 6 will move more. The plan's point is
usage, not count.

**6 · No breakage at all:** Waves 2–4 (21 kinds), TWA, the vestigial RD-05
radius override in `base.css`, `APP-SURFACES.md` §§3–10's pre-merge paths (the
header now warns), and the 23-issue Phase 5 sweep the plan asked for (6 showcase
issues were swept, and they carry every kind by design, so kind coverage is
likely complete and instance coverage is not).

> **Corrected while auditing.** The three-list rule for auth routes (§7,
> `AGENTS.md`) was written as if missing `APP_ROUTES` in `sw.js` could leak a
> session. It cannot, and the overstatement is worth retracting: middleware
> stamps `Cache-Control: private, no-store` on everything matching its own
> list, and `storable()` refuses anything carrying it. A leak needs a route in
> NEITHER list — but middleware then attaches no session, so there is nothing
> per-reader to leak. Keep the rule for consistency; it is not a live hazard.

---

- **In-SVG fine print is FIXED for the scaling charts** (`f76fa8c`, §4) — and
  the bump pattern those two entries described was the wrong fix. It is a
  viewBox-width problem, not a type one; `PowerFlow`, the exemplar they said to
  generalise, measured 7.0px and never held the floor it was written for. The
  per-component bumps on `PowerFlow`, `CarbonLoop`, `EloRiver` and `PaceRidge`
  were RETIRED with the fix: at natural scale they would render their 21px
  SVG-unit sizes at a literal 21px. What remains is item 5 above.
- **The ⤢ modal shows no source since `8eea66f`.** It portals the card; the
  source lives with the section now. Landed as-is by ruling; a modal source
  line is a separate, later call.

- **29 draft-only `EXPLAIN.how` cues still read as modal controls** ("Drag to
  spin…") — left for a bulk pass by ruling; none renders on a published page
  (`tactics-pitch` was the one live cue and is rewritten in `bdbfea8`).
- **Both canon files are SIGNED and cite as law** — `CANON.md` 2026-09-05
  (`0104915`), `motion.md` 2026-09-07 (`b06caec`). Neither carries a DRAFT line.
- **`--t-page` is RULED (`b06caec`): navigation split off it.** The token was
  never a page-transition token — 12 sites, exactly one of them a navigation —
  so retiming it would have made every scroll reveal snappier to buy a faster
  click. `@view-transition` moved to `--t-slow` (420ms) because it answers a
  CLICK and a waiting reader budgets motion differently; in-page settling keeps
  600ms. No token VALUE changed.

- **`.px-viz__src` is gone** — zero emitters, zero rules since `b0260b2`; the
  source line is `.px-plain__src`, rendered once by `core/Section.astro`.
  `story.css`'s `[class$='__src']` beat rule is left in place on purpose (a
  suffix rule; costs nothing). Do not give a component its own source, plain
  or how-to-read emitter — Section owns all three for every kind.
  **This entry was true about the class and false about the rule until
  `b5c68b1` (2026-09-05).** `b0260b2` swept on the *name* `.px-viz__src`; three
  components emitted a source under other names and survived it —
  `core/DataReadout` (`.tel__src`, doubling on the **published**
  the-bill-came-due-in-april), `politics/CoalitionCalculus` (`.px-coalc__src`)
  and `travel/SeasonWheel` (`.px-swheel__src`). All three are now gone and each
  keeps its unrendered `source` prop per the VizCard precedent. The standing
  check is a grep for `__src` under `src/components`, which must return only
  `core/Section.astro`.
- **`howToRead` control clauses are wrong under no-JS** wherever the control is
  `html.js`-gated — reordered so the static reading leads; the proper fix is a
  JS-gated field or a VizCard convention (a schema call).
- **`state-timeline` carries 3 raw hexes** — a DECLARED fixed encoding
  (green/amber/red service status), single declaration, never colour-alone.
- **Text-heavy story beats scroll** (sanctioned); **dashboard tiles title-case
  slugs** — the issues-manifest bridge is still unbuilt and still the blocker
  for real Shelf titles, Feed and Archive. It was the first move of Phase 8;
  **Phase 8 is superseded** (REVAMP-PLAN §4), but this piece of it survives and
  is now simpler — one project, no cross-project hop.
- **`finish-interval` rows are 34px with a mouse, 44px on touch** — deliberate
  (`@media (pointer: coarse)`).

## 7. Traps that have actually bitten (additions this cycle in bold)

- **A git worktree poisons any generator that walks the filesystem.**
  Worktrees live under `.claude/worktrees/` and each is a FULL second copy of
  the repo. They are gitignored, so git never surfaces them, but a filesystem
  walk does not read `.gitignore`. On 2026-09-15 `npm run graph` was run
  during a merge while a sweep's worktree was still on disk: **380 phantom
  paths** went into the committed graph, `graph:check` PASSED locally because
  the walk saw the same phantom tree on both the write and the check, and the
  Vercel build failed on a clean checkout where the worktree does not exist.
  **A self-consistent generator is not a correct one.** `project-graph.mjs`
  now skips `.claude/worktrees` by path; if you add another tree-walking
  generator, give it the same skip.

- **A component can accept a documented field and never draw it.**
  `benchmark-chart` takes `items[].sublabel` and `data-readout` takes
  `tiles[].accent`. Both are in their catalog `DATA:` lines, both are declared
  in the component's props interface, and **neither is ever emitted below the
  frontmatter fence**. `2026-04-24-kessler-cascade` shipped live with five
  invisible sublabels and its hero had been *designed* around them;
  `2026-05-15-seven-appeals-rupee-pressure` is live with three flat tiles.
  Found by accident, twice, during the Phase 6 rewrites (2026-09-15). **Grep
  the template, not the interface** — the interface is what made both
  invisible. A sweep of all 101 kinds is in flight.
- **A dossier can go stale about its own allowlist, and it fails silently in
  the direction of weaker sourcing.** Three did. The politics dossier sent a
  researcher to an unparseable PDF while India Code sat on the allowlist at
  T0, and wrote off NALSA because *indiankanoon* is off-list while the Supreme
  Court's own archive is listed twice. Cost: two published claims rested on
  newspapers for four months, and only a re-anchoring pass found it
  (2026-09-15). **When a dossier says a source is off-allowlist, check the
  allowlist, not the dossier.**

- **An authored `caption` on a kind whose component has no caption slot
  rendered nowhere**: timeline, seat-chart, vote-result, bill-breakdown,
  comparison. The delimitation rewrite's reader panel found its two quiz
  answers authored and invisible (2026-09-13). `core/Section.astro` now prints
  `section.caption ?? data.caption` as `.px-section__claim` and a `:has()`
  rule hides it where the component shows its own. Check the page, not the
  file.
- **`skimCaption` renders only in Skim mode.** The contract named it as a
  restatement site and six restatements in the queue rewrite were invisible
  on the normal page (2026-09-13). Restate in the following section's intro,
  or the caption; `skimCaption` on `prose` only.
- **`graph:check` goes stale whenever a `sourceRefs[]` list changes**, not
  only when a decision is cited. Three builds in one day failed at the gate
  after rewrites touched citations (2026-09-14). Run `npm run graph` before
  the build whenever an issue's sources moved.
- **`wire-kind.mjs` skips its KIND_PRIORITY step whenever the kind's name
  already appears anywhere in `story.ts`** — a TRIM entry written before
  wiring triggers the skip, silently; `check:catalog` caught it as a missing
  score (2026-09-13). Wire first, or add the score by hand.
- **One YAML list item at column 0 inside `sections:` takes every issue page
  down** ("end of the stream or a document separator is expected", 500s on
  every route for three minutes on 2026-09-13). A scratch inserter had
  trimmed the leading indent of a block's first line. Anchor inserts at line
  start with `^` and never trim a block.
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
- **`graph:check` used to report STALE right after a fresh `npm run graph`** —
  never a flush race, whatever this entry said first. The citation scan walked
  `docs/` including `docs/generated/`, so the graph counted its own output:
  when the set of cited decisions changed, the first write changed the counts
  and only a second run reached the fixed point. **Fixed 2026-09-05
  (`1459380`)** — `buildDecisions()` excludes `docs/generated/`, one pass now
  reaches the fixed point, and every `citedIn` dropped by exactly one (all 35
  verified; nothing else moved). The entry stays because the *shape* recurs: a
  generator whose output lives inside its own input set has no fixed point in
  one pass. Check that before adding anything to `docs/generated/`. (Cost two
  diagnoses and three double-runs.)
- **A class-name sweep cannot establish an invariant about a behaviour.**
  `b0260b2` swept `.px-viz__src` and the docs recorded source-once as settled;
  three differently-named emitters were still rendering, one on a published
  page, for four days. When the rule is *"no component renders X"*, the check
  has to match **X** — grep the rendered string `Source ·` under
  `src/components` — not the class name someone happened to use for it.
  Cost: a user-visible duplicate on a live issue. (`b5c68b1`)
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

- **A green build is not a deploy.** Vercel accepted 45 pages and rejected the
  deployment afterwards: `_render (nodejs18.x)` is an invalid runtime.
  `@astrojs/vercel@7.8.2` picks the function runtime from the Node version the
  **build** runs on, against a hardcoded `{18, 20}` table, and falls back to
  `nodejs18.x` for anything else — and `engines.node: ">=20.0.0"` resolves to
  the *latest* major (Vercel's own version table lists `>=20.0.0` in the
  **24.x** row), so the build machine ran 24. No override exists: `getRuntime()`
  reads `process.version`, and the adapter exposes no option, env var or config
  field. Fixed 2026-09-06 (`24f83b9`) by pinning `engines.node: "22.x"` and
  correcting the emitted runtime in `postbuild` (`scripts/vercel-runtime.mjs`,
  which refuses to run against a range). **The adapter is the ceiling, not
  Node** — 7.8.2 can emit nothing above `nodejs20.x`, which Vercel deprecates
  2026-10-01; the script is the bridge to Astro 5 + adapter v8 and should be
  deleted with it. The shape recurs: a build tool that infers a deploy target
  from the *builder's* environment is wrong the moment the builder is upgraded
  under you.
- **Every page returned 200 while seven features were dead.** Production served
  `www`, but all 17 reader islands bake `PUBLIC_APP_URL` (the apex) as an
  **absolute** origin at build time — so every island `fetch` was cross-origin,
  and the apex→www redirect answered CORS preflight with a **307 carrying no
  CORS headers**, which browsers refuse to follow. Save, reactions, reading
  tracker, annotations, letters, newsletter and account-entry all failed
  silently; no gate, log or status code showed it. The code was never wrong —
  `canonical`, RSS and OG all already declared the apex. **The redirect pointed
  the wrong way.** Fixed 2026-09-06 by flipping it in Vercel (apex →
  Production, `www` → 308 → apex); all seven recovered at once, with no deploy.
  Until the islands use RELATIVE paths, the redirect direction is part of the
  contract (`AGENTS.md` §7). The shape: an absolute origin baked at build time
  turns any hosting-layer redirect into a silent cross-origin failure.
- **A redirect to a route that exists and returns 200 is invisible to every
  check this repo has.** The merge gave one namespace two `/welcome` pages —
  the publication's intro story and the app's post-signup plate. The plate
  moved to `/account/welcome`; `auth/callback.ts` kept pointing at `/welcome`.
  So every first-time reader watched the cinematic intro instead of
  name-and-worlds setup, `profiles.welcomed_at` stayed NULL so they were
  re-offered onboarding forever without ever reaching it, and the plate sat
  orphaned with **zero inbound links** in `src/`. Build green, gates green, 200
  on the redirect target. Found by walking the signup flow on the live deploy;
  fixed `cf0c0b6`. **After any merge that unions two route namespaces, walk
  every redirect target** — a collision resolves silently in favour of
  whichever page the router finds first, and nothing reports it.


## 8. Where to find things

| You want… | Read |
|---|---|
| The revamp's decisions + phases | `docs/REVAMP-PLAN.md` (RD-01…RD-13 §1; the v3 order in §4-v3) |
| Token law incl. TD-06 | `docs/design/TOKEN-RECORD.md` |
| The 28 blueprints (corrected) | `docs/design/blueprints/<world>/` — header first |
| The registry wirer | `scripts/wire-kind.mjs` |
| The register plan and its measurements | `docs/REGISTER-PLAN.md` |
| The runtime voice contract, the lexicon, the jargon list | `research/_voice/_voice-core.md`, `hinglish-lexicon.md`, `jargon.md` |
| Kinds by data shape (the composer's lookup) | `docs/design/catalog-shapes.md` |
| The annotation contract | `docs/design/blueprints/_ANNOTATIONS.md` |
| The two component exemplars | `topic/politics/BillFunnel.astro` (HTML), `topic/sports/ChannelTernary.astro` (SVG) |
| The shell + instrument primitives | `core/VizCard.astro`, `px-inst` in `src/styles/dataviz-v2.css` |

| The explainability chrome for every kind (how-to-read above; plain + `Source ·` below) | `core/Section.astro`; `.px-plain__src` in `src/styles/viz-type.css`; the one-panel `:has()` rule in `src/styles/dataviz-v2.css` |
| The canon, both files signed (CANON 2026-09-05, motion 2026-09-07) | `docs/design/CANON.md`, `docs/design/motion.md` |

| Section-kind → component map | `src/components/AGENTS.md` |
| Issue authoring incl. new fields | `src/content/issues/_AGENTS.md` |
| The design handoff (delivered artifact) | `Parallax Design System Revamp/` — authority: AGENTS → INTEGRATION → blueprints; README is stale background |
| Standing rules / the reader-account surfaces / pipeline | `AGENTS.md`, `docs/APP-SURFACES.md` (formerly `app/AGENTS.md`), `research/AGENTS.md` |
| How context reaches a session | `docs/CONTEXT-PLAN.md` (CD-01…CD-12 §3; §10 in plain terms) |
| Frozen history — **not current** | `docs/archive/` — read its README before citing anything there |

Live examples of every unpublished kind, the four plain-language kinds and the
annotation slot included: the six `2026-06-03-<world>-showcase` issues
(status draft — unhide gated sections in the console with
`document.querySelectorAll('.px-gate-hidden').forEach(e => e.classList.remove('px-gate-hidden'))`).

## 9. Verification commands

```bash
npm run build            # 45 static pages + 24 SSR routes.
                         # prebuild is FOUR steps, in order:
                         #   design-sync --check
                         #   check-catalog
                         #   project-graph --check      ← the one that bites
                         #   tsx scripts/story/og.ts    ← writes 10 tracked PNGs
                         # postbuild is ONE step:
                         #   vercel-runtime             ← corrects the fn runtime
npm run check:catalog    # kinds ↔ catalog blocks, order, EXPLAIN + KIND_PRIORITY coverage
npm run check:prose      # the register + composition report; check:prose:gate is the blocking form
npm run design:check     # 30 mirrors + 6 in-world deeps + 18 record tokens
npm run graph:check      # the derived graph matches the repo
npm run hooks:test       # the enforcement hooks still decide correctly
```

The old `cd app && npm run build` line retired with the merge — there is one
project and one build now.

**`npx astro build` skips the prebuild — all four steps of it.** It is still the
right way to iterate (the real build rewrites ten tracked OG PNGs on every run),
but it proves only that the pages compile. It proves nothing about the gates
that guard CI. **Run the full `npm run build` before calling work done, and
certainly before the operator pushes.**

`graph:check` is the gate this matters most for, because ordinary good practice
invalidates it: §1 asks you to cite decision IDs in the files that implement
them, and every such citation changes the graph's `citedIn` and `implementedBy`
counts. Phase 7 added RD-12 and TD-06 citations to `layout-v2.css`,
`issues/[slug].astro`, `ReadingGate.astro` and `FeaturedPlate.astro`, the graph
was never regenerated, and **Vercel failed the deploy at `20d66b9`** on a STALE
graph while every hand-run gate had been green. Fixed in `ab59353`. If you
cited a decision anywhere, run `node scripts/project-graph.mjs` and commit the
result with the work.

**`npx astro build` also skips the POSTBUILD, and that one decides whether the
deploy is accepted at all.** `@astrojs/vercel@7.8.2` picks the serverless
function's Node runtime from the version of Node the *build* runs on, against a
hardcoded table that stops at 20 — anything else falls back to `nodejs18.x`,
which Vercel no longer accepts. **Vercel failed the deploy a second time on
this**, at the merge commit: the build was clean, 45 pages and all four gates
green, and the deploy was rejected afterwards with

```
The following Serverless Functions contain an invalid "runtime":
  - _render (nodejs18.x)
```

The cause was `engines.node: ">=20.0.0"` — an open range, which Vercel's own
version table resolves to the *latest* major (24). `scripts/vercel-runtime.mjs`
runs as `postbuild` and rewrites the `runtime` key in every function's
`.vc-config.json`, deriving the target from `engines.node` so the build image
and the function runtime cannot drift. It refuses to run if that field is ever
loosened back to a range. **A green `npx astro build` says nothing about
either.**

The real ceiling is the adapter: 7.8.2 can emit nothing above `nodejs20.x`, and
Vercel deprecates Node 20 on **2026-10-01**. Adapter v8 fixes this properly but
requires Astro 5 (Content Layer API — reaches every kind and every issue).
The script is a bridge to that upgrade and should be deleted with it.

Standing greps (all must return zero):

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

```bash
grep -rn 'font-family="var(' src/components/topic/
```

Plus per touched component: no-JS final state, `prefers-reduced-motion`, 375px
with the honest overflow test (§3), 44px targets on touch, text ≥ 9.5px.
