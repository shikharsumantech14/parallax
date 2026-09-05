# Revamp plan — the source of truth

> **Status: v3, signed 2026-09-04.** RD-10…RD-13 govern; §4-v3 is the
> execution order. Two riders signed with it: the parked `Source ·` fold lands
> as-is, and the README's *desk* page is the topic index reskinned.
>
> **What v3 is.** The operator's ruling, 2026-09-04, on re-reading v2: *"I wanted
> to revamp the whole thing — the components, the pages, the sections, the desks,
> the branding — like I had in the Claude Design."* v2 adjudicated the handoff and
> sequenced the visible redesign last, behind the 28 instruments. That was a
> defensible engineering order and the wrong product. v3 flips the sequence to
> **look first** and un-parks the mark. It does **not** reopen the rulings that
> rest on correctness (photography, the toolbar relocation, the fixed headline
> steps, the motion budget, the a11y floor, RD-01b), and it does not adopt
> Literata — on re-examination the handoff's own `TYPE-MAPPING.md` forbids it
> (RD-11). Superseded rulings stay in §1, struck through with a pointer, so a
> citation in code or a commit body never dangles.
>
> v1 was analysis with open questions. v2 is a decision record plus an execution
> sequence. Every open question in v1 has been ruled on; the rulings are §1 and
> they are not to be re-litigated except by the operator, as here. Where v1
> stated a fact that later verification disproved, §3 records the correction.
>
> Read `docs/STATE-OF-PLAY.md` first for where the repo stands. Read `AGENTS.md`
> for the standing rules. This file is what to build, in what order, and why.

---

## 0. Execution state (2026-09-04)

| Phase | Status |
|---|---|
| −1 · Ship the P0–P8 backlog | ✅ pushed + deployed, migration applied, funnel smoked live |
| 0 · Pre-deploy hardening | ✅ deployed (`2625cdd`) |
| 1 · Guardrails + WCAG + phone nav | ✅ deployed (`92870b7`…`7c553a2`) |
| 2 · Chrome primitives (TOKEN-RECORD, schema, VizCard, px-inst) | ✅ (`6f6ca2a`) |
| 3 · The 28 kinds | Wave 0 ✅ (`d86673a`, `afcb49b`) · Wave 1 ✅ (`266734b`) — **library 97/118**; Waves 2–4 remain, **now sequenced last (RD-13)** |
| 4 · Editorial floor | agent-facing half ✅ (`c0887a3`); **source backfill 21→0** ✅ (`37a6f7d`); captions deliberately declined (all 22 carry an `intro` stating the finding); schema tightening pending |
| 5 · Mobile legibility | not started; measured on three files (`ScalingPlot.astro` carries the numbers and why a plain bump fails) |
| 6.1 · Shell adoption | **done bar the signature** — flat viz card + `--viz-edge` world rule (`b74815d`); RD-05 shadow sweep 115→64 + the toolbar's flat skin (`943fe09`); ⤢ 44px on touch, SeatChart source naming, story depth-1 hiding; the `Source ·` fold **landed as-is** — `core/Section.astro` renders `Source · …` as the plain paragraph's second line for every kind (`8eea66f`), and the seventy per-component `.px-viz__src` emitters are gone, the class has zero emitters and zero rules (`b0260b2`); the `EXPLAIN.how` flip is **on** for every kind — Section renders the panel above the graphic, VizCard inside the card for its ten, one panel per section by `:has()` (`bdbfea8`; the review tabled at `9851c9a` counted 90 strings, not 81); the CANON/motion edits are drafted and committed as a **marked draft** (`dc6a28c`). **Not done:** the operator's signature on the canon edits (removing the DRAFT line at the top of each file is the signature) and the `--t-page` retime call (the handoff's ~300/340ms against the shipped 600ms). The ⤢ modal shows no source — the design's own consequence; a modal source line is a separate, later call |
| 6.2 · B1 best-first | ✅ all three — `scaling-plot` log⇄linear (`e5fd2f1`), `xg-race` scrub (`d304c2d`), `climate-spiral` scrub (`714d1ac`); `px-inst` readout reserve generalised (`328395d`); `howToRead` ×4 + the live caption fix (`81cc2da`) |
| 6.3 · Type harvest | **3 of 4 items done** (2026-09-05). Binaries measured: Schibsted's x-height is the LARGER (0.530/em vs Literata's 0.515), so the prototype's 18px Literata is **17.5px** of Schibsted and RD-08's literal 18px overshoots by 3% — body register at 17.5/1.68, space's 15.5px override folded in, travel's 19px Fraunces body kept by ruling (`0894af8`); standfirst 18.5→20px, closing an inversion where the serif lead rendered a smaller x-height than the body it introduces; eyebrow at 9.5/600/.16em across 29 rules, tracking through the `--viz-ls-mono` token that already existed (`d2b6cd3`), with the display-face eyebrows of sports and travel pinned at 11px and three exclusions ruled (the `Source ·` line, the world signature ornaments, the control chips). **`h3` closed 2026-09-05, and the investigation is the finding.** RD-08 describes the prototype's per-figure `vizTitle` — eyebrow row, then `<h3>`, then how-to-read, then the graphic — a FIELD the schema does not have. Repo-wide there are two `<h3>` elements and zero `h3` selectors. The publication titles a figure from ABOVE the card with `.px-section__title` (clamp 28–44px), because one section is one kind is one figure; the prototype's issue body carries no section headings at all, so its `h3` is the only heading there. That is an article-structure difference — Phase 7 / RD-12's block order — not a type one. Mapping the `h3` onto `caption` was REJECTED on measurement: `caption` is the verifier-traced data claim, its lengths run 28–174 chars (median 57, n=110) which at 22/700 collides with the section title above it, and published captions are often all-caps dataset labels (`UBER · AI CODING SPEND · 2026`) that would read as shouting. Also unrecorded until now: the Components gallery sets this h3 at **22px**, the issue page at **21px**; RD-08 took the gallery's number. The spec therefore lands on `.px-bills__title` alone (politics.css, already 22px display, now 700 and −.024em) — one rule, one kind, live on two published issues. **The drop cap is an OPEN CONFLICT between two signed decisions, not a scheduling question:** RD-08 lists the three-line Fraunces drop cap under this phase; RD-12 says the issue furniture — naming the drop cap — lands in the same commit as the 3-column grid in Phase 7. The operator rules; until then it is in neither phase's scope. Measure was NOT touched: 720px stays, and the column is what dominates CPL (95.9→84.8 at 1280), so RD-12 should take it once. |
| 7 · Web pages | not started — after 6.3 (RD-13) |
| Brand · the mark | **un-parked** (RD-10); scoping first, see §4-v3 |
| 8 · App | not started |

Execution corrections folded into the docs this cycle (do not rediscover): the
RD-05 radius flip **cannot** be done in `shared/design/tokens.css` — `app/`
consumes `--r-tile`/`--r-card` there and would flatten against RD-05's own
carve-out, so the publication overrides them in `base.css`; `--r-pill` is
deliberately not flipped (43 sites of UI chrome); three token flips reach 99 of
249 radii, not "128 of 267"; ten of seventeen theme "elevated card" rules were
orphans from the v2 port, including this file's own hairline example
`.px-appr__svg`; the tinted `howToRead` was already shipped in Phase 2; the
`px-inst` 3.2em readout reserve is not enough for a readout carrying proper
nouns (three instances, generalised as `px-inst__readout--sized`); Timeline,
BillBreakdown and VoteResult emit their source as a **sibling** of the graphic
root, so story.css needed a depth-1 rule as well as depth-2. The B1 estimates
(4h/3h/3h) came in on budget in one session.


Execution corrections folded into the docs at shell adoption 3–5 (do not
rediscover): the `Source ·` fold is a **`core/Section.astro`** change, not a
VizCard one — Section receives the resolved `source` and `howToRead` from
`SectionRenderer` and renders both for every kind, so the seventy per-component
`.px-viz__src` emitters were stripped and the class now has zero emitters and
zero rules (`b0260b2`; `CourtValue`'s value-model line moved to its own
`.px-cval__model`); VizCard still accepts `source` and no longer renders it;
the `EXPLAIN.how` review was of **90** strings, not 81 (Phase 1's backfill of
nine breadth-pass kinds postdates v2's count) — 19 kinds render on published
pages (69 sections), exactly one live cue (`tactics-pitch`, rewritten), 29
draft-only cues left for a bulk pass; before `bdbfea8` an authored `howToRead`
on any of the 87 non-VizCard kinds was silently dropped, and the one-panel
guarantee is the `:has()` rule in `dataviz-v2.css`; `climate-spiral`'s scrub
steps by **month**, not year — the payload is four years; and
`pageEnter`/`worldFade` were named as the **existing** `--t-page` 600ms view
transition, not the handoff's ~300/340ms, which is an open token decision.


Execution corrections folded into the docs (do not rediscover): the SVG
`var()`-in-presentation-attribute claim was false — the convention stands for
specificity/satori reasons; **TD-06** added (text sits on `--accent-deep`,
never the vivid accent — travel fails at 3.91:1); the 12-bespoke-roots claim
was overstated (2 near-duplicates, 8 card-less → `[data-viz-root]` attribute,
not the class); bill-funnel's "darker segment" copy bug fixed in three places;
ShotMap does NOT carry the mobile font-bump (4 of 42, not 5). Tooling:
`scripts/wire-kind.mjs` wires the six code registry places per kind.

---

## 1. Decisions

Cite by ID in commit bodies and in any doc that implements them. This section is
the answer to `STATE-OF-PLAY.md §10`'s warning about design decisions decaying
across handovers: a ruling that is cited is a ruling that survives.

| ID | Ruling |
|---|---|
| **RD-01** | **Staged: the annex first.** The 28 blueprinted section kinds are built against *existing* repo canon — current trio, current per-world tokens, current mark, current radii. No revamp brand/type/flatness rule leaks into them. |
| **RD-01a** | All 28 route through **one shared wrapper** (`src/components/core/VizCard.astro`) so a later chrome change is one file, not 28. |
| **RD-01b** | In-SVG `<text>` uses a **literal font stack**, never `var()` inside an SVG presentation attribute — that does not resolve and fails silently to the default serif. |
| **RD-02** | The 8 `.dc.html` prototypes are recovered and committed. **Authority order: `AGENTS.md` → `INTEGRATION.md` → blueprints.** The handoff README is stale background, not the tiebreaker. For the 28 kinds the **blueprint** is binding; screenshots are reference only (four contain real ledger-collision bugs the blueprints already correct). |
| ~~**RD-03**~~ | ~~**The brand mark is deferred.** The locked 2026-06-22 lens mark stands. The 38 medallion SVGs stay unused; B4 and the About lore section ride the eventual decision.~~ **SUPERSEDED by RD-10 (v3, 2026-09-04).** Kept so citations resolve. |
| **RD-04** | **The Fraunces / Schibsted Grotesk / JetBrains Mono trio stays.** Literata never enters the product. `TYPE-MAPPING.md` is authoritative; the README's type section is superseded. |
| **RD-05** | **Flatness covers the reading surfaces and home** — issue pages, viz cards, primer, home cards go radius-0 / shadow-none / hairline-elevation at shell adoption (Phase 6). The app keeps its own spec until Phase 8. Glass survives only on fixed toolbar and modal chrome until its flat reskin. The boundary is a **surface class, never per-component**: home cards flatten *with* the reading surfaces, because flat-next-to-soft in one scroll column is the worst of both. |
| **RD-06** | **The 8 ambient WebGL rotations stay alive.** They pause off-viewport and freeze to composed stills under reduced-motion. The handoff's one-loop-per-page budget is rejected; the repo's per-viewport semantic budget governs. The motion table was written against a stack with no 3D library and cannot govern surfaces it never drew. |
| ~~**RD-07**~~ | ~~**Issue page: harvest the furniture now, defer the floor plan.** The fact grid, drop cap and meta strip enter the current 720px column. The 3-column grid (170px fact rail / 1fr / 250px dek+share) waits for Phase 7, where it is designed together with the `ReadingGate` rework it requires.~~ **SUPERSEDED by RD-12 (v3).** The furniture list and the gate constraint carry forward unchanged; only the deferral is lifted. |
| **RD-08** | **Type harvest under RD-04:** adopt prose 16→18px (after a real measurement of the font binaries), instrument `h3` at 22px/700/−.024em in `--font-display`, 9.5px/600/.16em mono eyebrows, and a drop cap sized *"spans three lines"* in Fraunces. **Reject** the fixed 68/40 headline steps — keep the fluid `clamp()`. The prototype has zero `@media` and zero `clamp`, so 68/40 is a two-width toggle, not a scale. |
| ~~**RD-09**~~ | ~~**Full sequential workstream B** after the annex: manifest bridge → B1 best-first retrofits → shell adoption → B3 web pages → B2 app screens. `/subscribe` and billing are gated on a separate pricing decision.~~ **SUPERSEDED by RD-13 (v3).** The pricing gate on `/subscribe` survives. |
| **RD-10** | **The brand mark is un-parked** (supersedes RD-03). The phase medallion ships as the mark: masthead, colophon, favicon, app icon, OG cards, social banners, the six per-desk marks/seals/covers, and the About page's *"the mark, explained"* + the six-row lore section. **Constraints carried from the handoff's own misuse list:** no gradient or sphere shading, no off-station dial (`politics 325 · space 25 · earth 85 · tech 145 · travel 205 · sports 265`, fixed), no rotation, no second accent, no substitute letter, no drop shadow; the reversed cut below 24px is a declared tier, not a degradation. **One correction to the delivered assets:** all 38 SVGs set the `P` as live `<text font-family="Literata…">`, so as shipped the mark depends on a font RD-11 keeps out of the product, and the favicon already renders in whatever serif the OS has. The glyph is **outlined once at build time from the Literata binary into a `<path>`** — a Literata *shape*, no Literata *file* — so the mark is identical everywhere, including satori/resvg, which cannot load fonts for SVG text. The old CSS-drawn lens (`.mh__lens`, the Colophon lens) retires with it. |
| **RD-11** | **RD-04 was re-examined at the operator's request and STANDS.** The trio stays; Literata does not enter the product. Not a taste call: the handoff's own `TYPE-MAPPING.md` states Literata is *"an artifact of the design runtime, not a design decision, and it must not reach the repo"*, and maps every role onto the trio. The README's migration-plan Phase 2 ("switch body and display to Literata") is the stale instruction RD-02's authority order already subordinates. Adopting Literata would move the product *away* from the handoff. The v2 questioner (this plan's author) mis-framed RD-04 as a rejection of the design; it was compliance with it. |
| **RD-12** | **The 3-column issue floor plan ships in Phase 7** (supersedes RD-07's deferral): 170px fact rail / 1fr / 250px dek+share, per §3 correction 9, **in the same commit as the `ReadingGate` rework** — the standing ruling's two constraints bind: `.px-section` counting is preserved or the gate is reworked with it, and the free allowance always includes at least one graphic. The furniture (fact grid with the `Voice` cell, drop cap, meta strip, primer strip) lands with it, not ahead of it. S-size figures render in-flow until the rail is designed (standing ruling unchanged). |
| **RD-13** | **Look first** (supersedes RD-09). The order is now: **finish 6.1 → 6.3 type harvest → 7 web pages (six, per the README) → the brand → 8 app (eleven screens) → 5 mobile legibility → 3 Waves 2–4.** The annex is last, not dropped; Waves 3–4 are **reassessed at the look's exit** per the editorial review's standing doubt about Wave 4 — the operator decides then whether 21 more kinds are worth ~22 days against a library where 77 of 97 have never reached a reader. The manifest bridge (Phase 8 item 1) stays first *within* the app phase. `/subscribe` stays behind the pricing decision. |

### Standing rulings (same force as the above)

- **The reading gate stays.** The handoff's zero hits for gate/paywall/meter is an omission, not a counter-design — silence about a business model is not a specification of a different one. Two binding constraints on any issue-page rebuild: `.px-section` counting is preserved or `ReadingGate` is reworked in the same commit; and the free-section allowance must always include **at least one graphic**.
- **Story mode: both surfaces, one engine.** `/s/` stays public (acquisition, OG cards). The app's 60-second cards ship in Phase 8 as a retention surface and **reuse `src/lib/story.ts`** (`MAX_BEATS` 6→5, claim/consequence pair) — never a forked deriver.
- **Photography rejected; the drawn plate adopted; the lens deferred.** Photography loses on five independent grounds: `AGENTS.md`'s standing no-raster rule, two world-spec DON'Ts (travel, earth), the unsourceable `1976 ⇄ 2031` pair, a permanent per-issue licensing obligation no agent can discharge, and the handoff's *own* implementation docs excluding it. The plate's frame + caption row + once-only reveal, applied to a drawn or data figure, keeps the pacing at ~2 days.
- **The reading toolbar stays fixed, with live progress**, and takes the flat 2px-ink-rule skin at Phase 6. The spec relocates it in-flow to the document foot *and hardcodes progress at 42%* in both prototypes — the design abandoned the feature the component is named for. You do not adopt a relocation that killed the feature.
- **The fact grid's fourth cell is named `Voice`** (matches the eight voices; "Mode" collides fatally with the Full⇄Skim `mode` state). Storage is an **optional** issue-frontmatter enum authored by the stylist; the cell renders only when present, and the grid drops to three cells when absent. Never invent a value at render time.
- **The per-issue figure budget is editorial guidance in `CANON §3`, not build-enforced.** Published issues average 3.4 figures — comfortably inside; showcase issues are catalogs and violate by design; and "XL xor L" governs a size the prototypes never drew.
- **S-size figures render in-flow.** `SECTION_LAYOUTS` has no margin rail, and the prototype's own grid cannot fit a 300px S in its 170px track — the design never solved its rail either. Ship its degraded state; the rail is a Phase 7 question.
- **`--paper-deep` is aliased to `--paper-warm`.** The prototypes define exactly one elevated surface per world, so there is no second value for it to be. `--accent-warm` → `--accent-alt`.
- **Hover splits.** Lift on a **data mark** survives — that gesture is comprehension (`CANON §9`'s inspect verb). Lift on **cards and nav** (~24 sites) retires to border-colour-only with the RD-05 flatness pass.
- **The explainability contract is two-tier.** Floor: `caption` + structured `source` build-enforced for **all** kinds — the handoff's own *"Never a graphic without both"*. Full seven parts bind **instruments only**. Static profile of parts 04/05 for kinds without controls: part 04 degrades to a **derived** legend (generated from colours the graphic actually paints, non-interactive); part 05 degrades to the **composed-state readout** — which is by definition the no-JS/reduced-motion state, so one definition serves the static profile *and* the fallback contract.
- **The repo's four non-negotiables outrank the handoff everywhere**: the fallback contract (no-JS final state, `prefers-reduced-motion`, missing WebGL), data honesty, the accessibility floor, and the brand/legal naming split. Where the prototypes carry zero `aria-*` and an unguarded infinite marquee while the blueprints specify 37 `aria-live` regions, **the blueprints win without discussion.**

---

## 2. What this is

The handoff is two projects wearing one name.

- **The annex (workstream A):** 28 new section kinds. Fully specified — a ~200-line blueprint, a screenshot, an MDX payload and a registry diff each. **212 agent-hours ≈ 26 agent-days.**
- **The rebrand (workstream B):** the new mark, flatness, the seven-part contract, **32 retrofits of components that already exist**, photography, and 13 app screens. This is the revamp's own stated thesis — `README.md:19`, *"gives every issue its own data instrument"* — and it had **zero** blueprints until the prototypes were recovered.

There is **zero overlap** between the 28 blueprinted kinds and the instruments the README names, and 12 of the 14 it names already exist in `SECTION_KINDS`.

**What v3 changes about this framing.** v2 read the two projects and built the
fully-specified one first. The operator commissioned the handoff as *one*
project — the whole look — and v2's "instruments first" produced, after ~19
agent-days, a site that reads as the old site with flat cards. v3 keeps every
ruling that rests on correctness and reverses the two that rested on sequencing
and caution (the mark, the floor plan). The rebrand's "zero blueprints" problem
is real and unchanged: the README specifies six web pages and eleven app
screens in prose, the mark in a construction table, and nothing per-desk beyond
tokens, the dial angle and the cover cuts. So the look-first phases below carry
**scoping steps before estimates**, and where v2 carried a number with no
source — "B4 ~12 days" appears nowhere the repo can trace — v3 says so instead
of repeating it.

---

## 3. Verified facts, and corrections to v1

Everything below was re-verified on the committed state. Items marked **CORRECTED**
were stated wrongly in v1 and must not be carried forward.

### Corrections

| # | v1 said | Actually |
|---|---|---|
| 1 | The instrument card shell uses `border-top: 3px solid accent` | **CORRECTED — inverted.** Light desks (politics, earth, travel) use **ink**; dark desks (space, tech, sports) use **accent**. Verified 72/72. |
| 2 | The mobile font-bump exists in 5 components incl. ShotMap | **CORRECTED — 4.** PowerFlow, CarbonLoop, EloRiver, PaceRidge. **ShotMap does not carry it** (its 440px hit is a `max-width` property, not a media query). |
| 3 | Muted-meta derivation is 58% dark / 70% light | **CORRECTED — 60% / 72%** (`Revamp Spec:120`). The README's 58/70 is the stale source; the Spec's measured values win under the corrected authority order. |
| 4 | `CategoryCard.astro` carries ~48 hexes | **CORRECTED — 56**, including a tech `--accent-deep` drift (`#a3cc1f` vs the canonical `#9cc528`). |
| 5 | The About lore thumbnails are inline SVG in `Marks.dc.html` | **CORRECTED — they are `React.createElement` calls in `Web.dc.html:665-698` at 46px.** Invisible to a markup grep. |
| 6 | The prototype card shell covers every instrument | **CORRECTED — 60 of 72.** The 12 S margin figures are a **reduced variant**: a 17px `<p>` title (no `<h3>`), an untinted how-to-read, and **2 of the 12 carry no explanatory copy at all**. |
| 7 | The commits were made 2026-08-27 | **CORRECTED — 2026-08-18.** |
| 8 | Promoting caption/source is ~half a day | **CORRECTED — half a day for schema + chrome; the backfill is ~73 authored factual strings**, which is editorial work requiring operator approval. |
| 9 | The issue page's blocks are a flat vertical order | **CORRECTED — it is a 3-column grid.** The fact strip is the **left rail**; the dek lives in the **right rail** with Share, not under the headline; there is no distinct "data card vs instrument" — both are M-column figures. |

### Newly found

- **13 draft issue pages emit `og:image` URLs that 404.** `src/pages/issues/[slug].astro` `getStaticPaths` has no draft filter, but `scripts/story/og.ts` writes PNGs for published issues only. 23 pages built, 10 PNGs.
- **`app/public/` does not exist**, so `AppLayout.astro:46`'s `/favicon.svg` 404s in production today.
- **EXPLAIN (81) and KIND_PRIORITY (81) both drift against SECTION_KINDS (90).** An unscored kind silently defaults to 30 (`story.ts:139`) and ships untrimmed into a 375×667 story card.
- **12 viz components duplicate the `.px-viz` card CSS** byte-identically under bespoke roots (`px-coalc`, `px-swheel`, `px-cgauge`, `px-elev`, `px-map`, `px-bills`, `px-analogy`, `px-seats`, `px-shells`, `px-msl`, `px-commit`, `px-journey`) and consequently **miss the ⤢ expand modal**, whose selector is `.px-viz, .vb, .tl, .tel`.
- **`FeaturedIssue.astro` is stale twice over:** it names five retired font families and is **missing its `earth` block** entirely.
- **`scripts/fetch-fonts.mjs` expects filenames that differ from disk** (`Fraunces-SemiBold.ttf` vs `Fraunces_72pt-SemiBold.ttf`), and its declared italic target is absent. `scripts/social/cards.ts:34-35` finds fonts with **non-null assertions on the prebuild critical path**, so a rename kills every deploy.

### Load-bearing facts

- **The six `--paper-warm` literals**, measured with zero variance across 60 uses (10 per world, each paired with `border-left: 3px solid <accent>`, `padding: 10px 13px`, 14px/1.58):

  | politics | space | earth | tech | travel | sports |
  |---|---|---|---|---|---|
  | `#f2eee4` | `#12233c` | `#ece2c4` | `#171717` | `#f6efe2` | `#12332a` |

  Never derive these from `--bg`: they sit *above* the ground on light worlds and *above* it on dark worlds in opposite directions, so a naive mapping inverts the moment a politics kind runs in a dark-world issue — which `CANON §2` permits.
- **Shared chrome now exists for everything but the caption** (2026-09-04 — `8eea66f`, `bdbfea8`, `b0260b2`). `SectionRenderer.astro` wraps every kind except `hero`/`act-break` in `core/Section.astro`, which renders the ghost numeral, eyebrow, title, intro, the how-to-read panel **above** the graphic (`section.howToRead ?? EXPLAIN[kind].how`), the plain line with `Source · …` as its second line **below** it (`section.source ?? data.source`, `{label, date}` joined), and `data-kind`/`data-layout`. No component renders source, plain or how-to-read itself; the one exception is `VizCard`, which renders the how-to-read *inside* the card for its ten kinds while Section's copy is hidden by `:has()`, so a section never shows two panels. `.px-viz__src` has zero emitters and zero rules. **Caption is still rendered per-component** — VizCard's caption row for the ten, each older kind's own `__cap` — and `Section.astro` is still never passed `data`; it receives the resolved `source` and `howToRead`. `SectionRenderer.astro` wraps every kind except `hero`/`act-break` in `core/Section.astro`, which renders the ghost numeral, eyebrow, title, intro, the plain line, and `data-kind`/`data-layout`. **Caption and source are rendered per-component from `data`** — `Section.astro` is never passed `data`.
- **The label architecture is a two-primitive system**, and the repo already builds one of the two. The prototype file that most loudly asserts *"labels are HTML, geometry is SVG"* breaks its own rule **47 times**; per instrument the choice is clean (28 HTML, 16 in-SVG, **0 mixed**), and the 16 are exactly the tick-dense cases where HTML positioning is worse. **31 of 72 instruments contain no SVG at all.**
- **caption/source coverage:** 148 viz sections across 23 issues; **45 lack a caption, 28 lack a source**; 17 of 23 issues would fail a required-caption rule.
- **13 of 28 supplied explainer strings exceed the 220-char `plain` cap** (porkchop-grid 299 down to turnout-margin 229).
- **`TYPE-MAPPING.md:25` is broken as written** — it prescribes `font-family="var(--font-mono)"`, a CSS variable inside an SVG presentation attribute, which does not resolve. Every axis label would render in the browser default serif, silently.
- **WCAG:** the repo's authored `--muted` fails AA on **four of six** worlds (space 4.16, travel 3.94, earth 4.20, sports 4.26); the derived 60/72 formula passes on all six. Space's `--accent-deep #0085a1` scores **4.2:1 on its own ground** — the spec's `#5ce1ff` scores 11.8:1. "Deep means darker" was applied uniformly and is backwards for dark worlds.

---

## 4. The phases

Branching: push first, then a short-lived branch per phase merged at its exit
gate. Deploy order for anything touching `app/` is **app, then publication**.
Iterate with `npx astro build` — `npm run build` fires the `prebuild` hook, which
rewrites 10 tracked OG PNGs before the token gate can fail.

### §4-v3 — the look-first sequence (RD-13)

The per-phase specs below (Phases 0–8) are unchanged and remain binding for
their content. **Only the order changes**, and two phases gain scope (7 and the
brand). Read a phase's spec below; read its *place* here.

| Order | Phase | Entry | Exit |
|---|---|---|---|
| 1 | **6.1 finish** — ✅ the `Source ·` fold landed (`8eea66f`, `b0260b2`), the `EXPLAIN.how` flip is on (`bdbfea8`), the CANON/motion edits drafted as a marked DRAFT (`dc6a28c`) | operator: signature on the canon edits; the `--t-page` retime call | **met bar the signature** — every viz card on every published issue carries the full shell; the canon drafts match the shipped CSS |
| 2 | **6.3 type harvest** (RD-08) | measure the font binaries first — the 16→18px step is conditional on it | prose 18px, instrument `h3` 22/700/−.024em, 9.5/600/.16em eyebrows, the three-line Fraunces drop cap; 375px sweep green |
| 3 | **7 web pages** — the README's six: masthead, home, desk, issue, archive, about | RD-12 signed (3-column + gate rework in one commit) | see Phase 7 below, extended by v3 |
| 4 | **The brand** (RD-10) — new phase, scoped in v3 | the glyph-outline tooling proven on one SVG; the swap list agreed | the medallion everywhere the lens was; About carries *the mark, explained* and the lore rows; favicon/OG/app-icon busted |
| 5 | **8 app** — the README's eleven screens | manifest bridge first, as before | per Phase 8 below; compile-verified only on this box |
| 6 | **5 mobile legibility** | — | per Phase 5 below |
| 7 | **3 Waves 2–4** | **operator reassesses at the look's exit** | per Phase 3 below |

**Phase 7, extended by v3.** The README names six pages; v2 scoped three. All
six are in: **masthead** (4px ink top rule, wordmark 16/700/−.032em, desk
register 9/600/.17em, `№ NN · live` dot, ghost Subscribe, Menu under 768px);
**home** (hero with the live issue's eyebrow / headline with accent word / dek /
fact rail; then latest-issue rows — number, title, dot + desk + date + read
time, hairline between); **desk** (one world's ground, its issues listed — the
topic index reskinned, not a new route; **confirmed by the operator
2026-09-04**); **issue** (the block order at
README:270, on the RD-12 grid); **archive** (chips + live search, against the 10
real issues — the prototype's 14 fictional backlist rows must not shape the
empty state); **about** (promise hero → the mark explained → three steps → the
eight voices → editorial promises → the lore section). `/subscribe` stays behind
pricing. The fact grid's fourth cell is `Voice`, per the standing ruling.

**The brand phase, scoped.** What exists: 38 SVGs in the handoff's `brand/` —
`mark`, `seal`, `cover` house cuts; `mark-/seal-/cover-<desk>` ×6; two lockups
(+ on-dark); `favicon` (32), `app-icon` (1024), `avatar` (1000); `banner-ink` /
`banner-paper`; `watermark`, `end-mark`; six video/social overlays. What must
happen, in order: (1) a build step that outlines the `P` from the Literata 700
binary into a `<path>` on a 300-unit box, baseline 207, and rewrites all 38
(RD-10) — proven on `mark.svg` first, diffed against the rendered original at
96/40/24px; (2) an inline-SVG `<Mark desk size cut>` component, with the ring
stroke stepping 7/10/14 units at 96/40/24px and the reversed cut selected
automatically below 24px; (3) the swap: masthead (`.mh__lens` retires),
colophon, `favicon.svg`, `app/public/` icons, `scripts/social/cards.ts` and the
OG writer (URL-bust — favicons and share cards are cached hard); (4) the About
page's *"the mark, explained"* (168px mark, the six desk phases beneath, the
two-paragraph premise) and the six lore rows with the 46px thumbnails — which
are `React.createElement` calls in `Web.dc.html:665-698`, not SVG files, and
must be re-drawn or re-extracted (§3 correction 5); (5) the per-desk cuts on
the topic indexes and covers. **Estimate after step 1**, not before: v2's "~12
days" has no traceable source, and step 1 is the only unknown of consequence.

**What v3 does not reopen.** Photography and the lens (five grounds, unchanged —
the lens needs raster pairs); the toolbar's fixed position and live progress;
the fluid headline clamp; the WebGL rotations; the a11y floor; RD-01b; the
reading gate. The plate ships as the *drawn* plate. Where the prototypes carry
zero `aria-*`, the blueprints and the repo's floor still win without discussion.

### Phase 0 — Ship the backlog · operator-led · ~0.5–1 day

**Goal:** the P6–P8 work exists somewhere other than one disk, and is live.

1. **Operator: `git push`.** Highest-value action available; do it before any new commit.
2. Agent: draft-filter `issues/[slug].astro` `getStaticPaths` in PROD (fixes 13 og:image 404s); create `app/public/` with `favicon.svg` / `favicon.ico` / `apple-touch-icon` / `site.webmanifest`; replace the non-null font assertions in `scripts/social/cards.ts` with a checked lookup and a real error; reconcile `scripts/fetch-fonts.mjs` filenames with disk.
3. **Operator: apply** `app/supabase/migrations/20260705000000_journey_onboarding.sql` — idempotent and additive, but `auth/callback.ts` already routes new readers to `/welcome`, which reads those columns.
4. **Operator: deploy app, then publication.** Smoke live: join round-trip, `/welcome`, favicon 200, a draft slug 404s, a published `og:image` 200s.

**Exit:** live smoke green; `origin/main` level with `main`.
**Rollback:** Vercel redeploy of the prior build; the migration is additive and needs none.

### Phase 1 — Guardrails and standing defects · ~4–5 days · releasable

**Goal:** the gates that stop later work being silently wrong, plus every cheap live defect independent of the revamp.

1. Wire `check:catalog` into `prebuild`; fix its error masking — the order check sits behind `if (!fail)` so a missing block suppresses it entirely, and the order loop `break`s at the first drift.
2. Extend `check-catalog.mjs` to assert **EXPLAIN and KIND_PRIORITY coverage** against `SECTION_KINDS` (with a named narrative allowlist); backfill the 9 missing entries in each.
3. Extend `scripts/design-sync.mjs`: assert theme headers against `worlds.css`, derived tokens against their formulas, plus a hex-literal lint with an allowlist. Without this, the reconciliation regresses within two sessions — the four-way `tech` accent-deep split is what an unenforced honour system produces.
4. Palette dedup: rewrite `CategoryCard.astro` onto `[data-world]` tokens; delete `FeaturedIssue.astro`'s stale block; point `scripts/social/cards.ts` and `scripts/lib/social.ts` at one source.
5. WCAG, **each as its own reviewable commit with a visual-regression pass**: derived `--muted` (60/72), space `--accent-deep → #5ce1ff` (audit cross-surface consumers first — it fails hard on light paper), and a new `--on-accent` (alias of the world ground). Write the chosen 60/72 into `worlds.css` as a comment so the README's 58/70 dies here.
6. **Masthead Menu button + in-flow drawer**, at the current 900px threshold in current-canon styling (the 768px threshold and the prototype skin are Phase 7). The drawer **must** carry the live badge and the Subscribe CTA — the prototype gives neither a phone representation, so a literal port deletes the primary mobile CTA.

**Exit:** build green *with the new gates active*; a six-world AA contrast table pasted into the commit; one palette source; nav operable at 375px.

### Phase 2 — Chrome primitives · ~5–6 days · visually near-no-op

**Entry:** operator has ratified the token decision record.

1. **Token decision record** → `docs/design/` and `shared/design/worlds.css`: the six `--paper-warm` literals, `--paper-deep` as an alias, `--accent-warm` → `--accent-alt`. This precedes every kind: an undefined custom property in an SVG fill is invalid at computed-value time, falls back to **black or transparent**, and passes `astro build`, `design:check` *and* the blueprints' own "every colour is a `var(--*)`" acceptance box. `rain-calendar`'s dry band is ~94% of its cells.
2. `src/content/config.ts`: optional top-level `caption`, structured `source {label, date?}`, `howToRead` (max ~360), and an optional issue-level `voice` enum. Renderer falls back to `data.caption` / `data.source`, so nothing existing breaks.
3. **`src/components/core/VizCard.astro`** (RD-01a). Root `px-viz px-<kind>`; a slot for the graphic; caption from props (source was rendered here too until the Phase 6 fold moved it to `core/Section.astro` — VizCard still accepts the prop and no longer renders it, `8eea66f`); a `howToRead` render point **above** the graphic, class `px-viz__how`, added **explicitly** to `story.css`'s hiding rule rather than relying on the `[class$='__cap']` suffix coincidence. At annex it renders **current-canon skin**, and only *authored* `howToRead` — the `EXPLAIN.how` fallback flips on at Phase 6 after a copy review of all the strings (**done 2026-09-04**: the review covered 90, not 81 — Phase 1 backfilled nine; ruled *flip it, rewrite `tactics-pitch`, leave the rest*; the fallback now resolves in `SectionBody` for the ten VizCard kinds and in `core/Section.astro` for the other 87, `bdbfea8`), because `how` was written as a modal interaction cue and auto-rendering it in-flow would change every viz section of 23 issues with copy never reviewed for that surface. At ≤640px the callout drops its tint and keeps the accent border-left (the S-figure precedent), carried from day one so shell adoption does not reopen mobile.
4. Migrate the 12 bespoke roots to `px-viz px-<x>`; delete the duplicated card CSS; verify ⤢ attaches to all 12 in a browser.
5. **`px-inst` primitive**, extracted from `ChipDie` and `SeasonWheel` (the two components that already carry a chip row and an `aria-live` readout with reserved height): chip row, range skin, readout, sr-only text, ledger fold, boot helper. Final form — CSS + a boot helper vs an Astro shell — is decided after an hour inside those two files, not pre-committed here.
6. Shared legend and readout class definitions. New kinds consume them; the six kit-local variants migrate opportunistically, not as a gate.

**Exit:** a published issue diffed at 1280 and 375 shows no change beyond the 12 gaining ⤢; the schema round-trips an issue authored with top-level caption/source; all gates green.

### Phase 3 — The 28 kinds, five waves · ~29 days · releasable per wave

**Entry (one batch commit, before component one):** copy all 28 blueprints to `docs/design/blueprints/<world>/` with a corrections header — `TYPE-MAPPING.md:25` corrected to a literal font stack (RD-01b); the 13 over-cap `what` strings rewritten to ≤220 chars with the surplus richness moved into `howToRead`; the token mapping; and the dispatch idiom. **Discard `registry/SectionBody.diff.md`'s arms wholesale** — the repo idiom is `section.kind === 'x'` with flat named props; the diff's `{kind === 'x' && <X data={section.data} />}` is a `ReferenceError` as written, and "fixing" it by prepending `section.` renders every component on its prop defaults: an empty chart, no error, green build.

Registry duty is **nine places per kind**, now build-enforced by Phase 1.

| Wave | Kinds | Hours |
|---|---|---|
| **0 — pipeline exemplars** | `bill-funnel` (HTML/CSS) + `channel-ternary` (SVG) — one per primitive path, pulled through all nine registry places | 7 |
| **1 — cheap HTML/CSS** | `age-pyramid` · `finish-interval` · `margin-bullets` · `attrition-waffle` · `state-timeline` | 25.5 |
| **2 — straightforward SVG** | `rank-bump` · `goal-clock` · `turnout-margin` · `volume-accuracy` · `glacier-dumbbell` · `river-multiples` · `debris-histogram` | 42 |
| **3 — real geometry** | `fare-spread` · `majority-flow` · `revenue-mosaic` · `price-swarm` · `service-arcs` · `mission-timeline` · `rain-calendar` | 58.5 |
| **4 — hard, last** | `heat-uptake` · `latency-ridge` · `daylight-band` · `knockout-bracket` · `route-criteria` · `flame-graph` · `porkchop-grid` | 79 |

Wave 2's entry gate is `src/lib/axis.ts` (tick generation, extents, unit
formatting) plus the shared legend, built during Wave 1. Wave 3's `rain-calendar`
doubles as the `--paper-warm` fill verification.

Wave 0's exit is the pipeline proof: both kinds render inside `VizCard` in a
scratch draft issue, ⤢ attaches, a story beat appears at the scored priority,
`check:catalog` is green, every grep passes. A primitive defect found here is
fixed **in the primitive** before Wave 1 — that is the wave's entire purpose.

**Parallelism:** component bodies parallelize across worlds; the shared registry
files (`SectionBody.astro`, `config.ts`, `explainers.ts`, `story.ts`,
`catalog.md`) are merge-conflict magnets and are **edited by the orchestrator
alone**, one wiring commit per wave, components rebased onto it.

### Phase 4 — Editorial floor and pipeline demonstration · ~2–3 days + editorial · parallel from Wave 1

Backfill the 45 missing captions and 28 missing sources (agents draft, **operator
approves** — these are factual claims, and the verifier runs on each). *Then*
tighten caption/source toward required in a **separate revertible commit**;
required-immediately fails all 23 issues at once with no partial deploy. In the
same phase, one commit assigns the roles (`plain` = form, `caption` = the data
claim, `howToRead` = usage) across `.claude/agents/*` and the verifier, so a
compliant line never trips PLAIN-CLAIM. Run one `pipeline-draft` demonstration
against the expanded catalog for operator review.

### Phase 5 — Mobile legibility · ~4–6 days · independent

Generalise the `PowerFlow.astro:348-359` breakpoint font-bump to the ~40
remaining SVG-text components; drop `.px-viz`'s 30px padding below 640px (~28px
of chart width back), coordinated with Phase 2's dedupe so that CSS is edited
once. **Finish before Phase 6** so the retrofits inherit it rather than
re-touching the same files.

**Exit:** a 375px sweep of all 23 issues; sampled rendered text ≥ 9.5px; no new clipping.

### Phase 6 — Shell adoption and B1 retrofits · ~20–22 days

**Entry:** annex deployed; the canon edits committed (they are decided — this is the doc commit, not a decision point).

1. **Shell adoption** — the RD-01a dividend, one file plus one CSS block: `VizCard` restyles to the prototype shell (3px border-top **ink on light desks, accent on dark**), the tinted `howToRead` on the six literals, the `EXPLAIN.how` fallback flip after the copy review, and `Source · ` as the second line of the plain paragraph at 9px/600/.14em. Simultaneously: the **RD-05 flatness pass** on reading surfaces and home (three token flips retire 128 of 267 radii; ~20 named shadow classes; a hairline added wherever the shadow was the only edge, e.g. `.px-appr__svg`), and the toolbar's flat 2px-ink-rule skin. `CANON.md` and `motion.md` are edited to match (**as executed: drafted after the CSS commits as one marked-draft commit, `dc6a28c` — a DRAFT line at the top of each file names the passages; removing it is the signature**) — `pageEnter` and `worldFade` named as motions (**named as the existing CSS view transition at `--t-page` 600ms; the handoff's ~300/340ms is unadopted, a token decision still open**), `hoverLift` split into mark-inspect (kept) and card-lift (retired), data-draw motions (`sweep`, `grow`, `settle`, `countup`) kept.
2. **B1 best-first**, because the repo already carries the payload or the control: `scaling-plot` log⇄linear (**4h** — `ScalingPlot.astro:22-23` already has the props at build time; the payoff is *"On this axis the growth is a straight line, which reads as a schedule somebody could keep. Press Linear."* → *"…This is what the log axis was hiding."*), `xg-race` minute scrub (3h), `climate-spiral` time scrub (3h — shipped as a **month** scrub, `714d1ac`: the payload is four years), then the rest by value. **Declines stand:** the risk corridor (a 29th new kind hiding in the retrofit set), `latency-waterfall` (needs a payload change *and* re-authored published data, and `COLLISIONS.md §3` already assigns its argument to `latency-ridge`), `itinerary-reel`, the swing ladder.
3. RD-08's prose 16→18px lands here, after measuring the binaries.

### Phase 7 — B3 web pages · ~11.5 days

Masthead reskin to the 768px spec; **`/archive`** (chips + live search) built
against the **10 real issues** — 14 of the prototype's 24 backlist entries are
fiction and must not shape the empty state; the issue-page furniture per RD-07
(fact grid with the Voice cell, drop cap, meta strip). **The 3-column grid
decision point sits here**, designed with the `ReadingGate` rework it requires.
The About lore section and `/subscribe` stay deferred (RD-03; pricing).

### Phase 8 — B2 app · ~22 days · compile-verified only on this box

1. **The issue-manifest bridge first** — `src/pages/issues-manifest.json.ts` + `app/src/lib/issues.ts`, 14h. It blocks Feed, Archive, real Shelf titles and any in-app issue; nothing else in B2 can start.
2. Then: tab bar + 393px shell → auth conformance (**keep Google + magic link** — the Google-primary hierarchy is the built fix to a diagnosed journey break, and a `.dc.html` prototype cannot perform an OAuth redirect, so "magic link only" describes the prototype's runtime; adopt the field metrics and copy, add the Link-expired and Sign-out screens) → Worlds + You (one migration: `reader_prefs` + the followed-worlds decision) → Feed + Archive → 60-second cards reusing `story.ts` → knowledge check (needs a `quiz_answers` migration plus per-issue editorial authoring).
3. Feed cards apply the **light-world rule universally** (accent at 9%) — a *recorded deviation* from the spec's dark-ground cards, taken to keep `APP-DESIGN-SPEC`'s "the app stays calm" doctrine. Label it, or the next agent restores `wd.bg` and is right to.
4. **Nothing here is runtime-verifiable on this box** (no `.env.local`). `cd app && npm run build` is the entire local gate; every group hands the operator a smoke checklist.

---

## 5. Verification protocol

Standing, every phase:

```bash
npm run build            # publication — 44+ pages
npm run check:catalog    # SECTION_KINDS ↔ catalog.md, plus coverage after Phase 1
node scripts/design-sync.mjs --check
cd app && npm run build  # the ONLY local gate for app work
```

Plus, per touched component: a 375px overflow sweep, a no-JS final-state check, a
`prefers-reduced-motion` check, and the standing greps —

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```

both must return zero. Never `git checkout` / `reset` / `stash` / `restore` to
undo — commits only, and the operator pushes.

---

## 6. Operator-input schedule

| When (v3 order) | What only you can do |
|---|---|
| ~~Now~~ | ~~Sign v3~~ **signed 2026-09-04** |
| 6.1 finish | ~~The modal-source decision for the parked `Source ·` fold~~ **ruled: land as-is (2026-09-04)**; ~~the copy review of the `EXPLAIN.how` strings~~ **tabled at 90 (not 81) and ruled: flip it, rewrite `tactics-pitch`, leave the rest (2026-09-04, `9851c9a` → `bdbfea8`)**; **sign the CANON/motion edits** — drafted and committed as a marked draft (`dc6a28c`); removing the DRAFT line at the top of each file is the signature; and rule on the `--t-page` retime (the handoff's ~300/340ms against the shipped 600ms), named in the motion.md draft as an open token decision |
| 6.3 | Nothing — the binary measurement is the agent's; you see the before/after |
| 7 | Sign RD-12's grid + gate rework as one commit; ~~rule on the `desk` page~~ **ruled: the topic index reskinned, not a route (2026-09-04)**; the pricing decision, which gates only `/subscribe` |
| Brand | Approve the glyph-outline diff on `mark.svg` before the other 37 are rewritten; approve the swap list; **push** — favicon and OG caches are busted only by a deploy |
| 8 | Runtime smoke per group (nothing here is runtime-verifiable on this box); the followed-worlds decision; the two migrations |
| Look's exit | **Reassess Waves 2–4** — the 21 remaining kinds, ~22 days, against 77 of 97 unused |
| Any time | Nothing is parked behind a decision any more; the pricing call is the only gate that parks work — the canon signature (6.1's exit) and the `--t-page` retime are open too, and neither blocks 6.3 |

Phases 0–4's rows are discharged and dropped from this table; their history is
§8 and `docs/PROJECT.md`.

---

## 7. Effort

v2's table is kept for the record; v3's follows it. Done work is subtracted,
unsourced numbers are named as such, and the brand block is not estimated until
its one real unknown is measured.

**v2 (2026-08-27), for the record:**

| | Agent-days |
|---|---|
| Phases 0–5 — annex, floor, fixes | ~45 |
| Phases 6–8 — workstream B | ~54 |
| **Total** | **~99** |
| B4 brand, parked behind RD-03 | ~12 · *no traceable source* |

**v3 (2026-09-04), remaining, in RD-13 order:**

| Block | Agent-days | Basis |
|---|---|---|
| 6.1 finish | **0 — done** (`8eea66f`, `bdbfea8`, `b0260b2`, `dc6a28c`) | only the canon signature and the `--t-page` call remain, both the operator's |
| 6.3 type harvest | ~2 | v2's figure; the 18px step is conditional on the binary measurement |
| 7 web pages, six (was three) | ~11.5 + the three added pages | v2's 11.5 covered masthead/archive/issue; home, desk, about are **unestimated** — desk may be a reskin (cheap) or a route (not) |
| The brand | **scope first** | step 1 (glyph outline) is the only unknown of consequence; everything after it is a swap list |
| 8 app, eleven screens | ~22 | v2's figure, unchanged |
| 5 mobile legibility | ~4–6 | v2's figure; three files already measured |
| 3 Waves 2–4 | ~22 | 179.5 h remaining of 212; **reassessed at the look's exit** |
| **The look (rows 1–5)** | **~35.5 + three pages + the brand** | |
| **Everything** | **~61.5 + three pages + the brand** | |

Done since v2 and subtracted above: Phases 0–2, Waves 0–1 (32.5 h), Phase 4's
agent half and the backfill, 6.2 in full (10 h), 6.1 in full bar the signature (the fold, the flip, the emitter strip and the canon drafts — `8eea66f`, `bdbfea8`, `b0260b2`, `dc6a28c`). The B1 estimates
were accurate to the session, so v2's hour-figures are trusted where they exist;
its day-figures for unbuilt web pages are not, because they were never
itemised.

Each phase is independently releasable and revertible.

---

## 8. Change log

- **2026-09-05 — v3.1.** §0 brought current through `dc6a28c` — the 2026-09-04
  session's five shell-adoption commits and the canon draft. 6.1 finished bar
  the signature, in the order §4-v3 row 1 set: the `Source ·` fold
  (`8eea66f` — `core/Section.astro` renders `Source · …` as the plain
  paragraph's second line for every kind; VizCard stops rendering it), the
  `EXPLAIN.how` review tabled at 90 strings, not 81, and ruled *flip it,
  rewrite `tactics-pitch`, leave the rest* (`9851c9a`), the fallback flipped on
  for every kind with one panel per section guaranteed by `:has()`
  (`bdbfea8`), the seventy per-component `.px-viz__src` emitters stripped and
  the class retired (`b0260b2`), and the CANON/motion amendments committed as a
  **marked draft** awaiting signature (`dc6a28c`) — `pageEnter`/`worldFade`
  named as the existing 600ms `--t-page` transition, the handoff's ~300/340ms
  left as an open token decision. §3's shared-chrome fact, §4-v3 row 1, §6 and
  §7 corrected; 6.3 is next per RD-13.


- **2026-09-04 — v3, signed the same day.** The operator, on being shown what v2
  had done with the handoff, ruled: the whole revamp — components, pages,
  sections, desks, branding — look first. Four amendments were put to the
  operator and answered yes; one was withdrawn by the agent on re-reading the
  handoff. **RD-10** un-parks the mark (supersedes RD-03) and corrects the
  delivered assets: all 38 SVGs set the `P` as live Literata text, so the glyph
  is outlined at build time — a Literata shape, no Literata file. **RD-11**
  records that RD-04 was re-examined and **stands**: the handoff's own
  `TYPE-MAPPING.md` forbids Literata in the repo; the v2 author had mis-framed
  compliance as rejection, and the operator's "yes" to Literata was given on
  that mis-framing. **RD-12** ships the 3-column issue grid in Phase 7 with the
  gate rework (supersedes RD-07's deferral). **RD-13** flips the sequence
  (supersedes RD-09): finish 6.1 → 6.3 → 7 (six pages, not three) → the brand →
  8 → 5 → Waves 2–4, the last reassessed at the look's exit. Superseded rows are
  struck, not deleted, so citations resolve. §0 brought current through
  `943fe09`; §4-v3 added ahead of the unchanged per-phase specs; §6 and §7
  rewritten with done work subtracted and unsourced figures named ("B4 ~12
  days" traces to nothing). The `Source ·` fold sits built and unsigned in the
  working tree. Signed 2026-09-04 with two riders: the parked fold lands as-is
  (the ⤢ modal's missing source is a separate, later call), and the README's
  *desk* page is the topic index reskinned, not a new route.
- **2026-08-28 — v2.1.** Execution-state table added (§0). Recorded in-flight
  corrections: TD-06, the disproven SVG-var() rationale, the bespoke-roots
  overstatement, the bill-funnel copy bug, the font-bump count (4 not 5).
  Sources backfilled 21→0 with the operator's confirmed mapping; the 22 caption
  gaps ruled REDUNDANT (each carries an `intro` stating the finding). Library
  97/118 after Waves 0–1; `scripts/wire-kind.mjs` extracted from the wave
  tooling.
- **2026-08-27 — v2.** Rewritten as a decision record plus an execution sequence after a verification pass (3 agents) and two design passes. Nine corrections to v1 folded into §3. All open questions from v1 §3 ruled on and moved to §1 as RD-05 through RD-09 plus the standing rulings. Workstream B sequenced in full (RD-09).
- **2026-08-18 — v1.** Analysis of the handoff; four decisions locked (RD-01–04); the 18-item contradiction register; workstream B sized. One correction applied to the audit's own output: a reviewer read per-kind estimates as *days* and reported ~190 agent-days for the 28 kinds; they are **hours** — 212h ≈ 26 agent-days.
