# Revamp integration plan — the Parallax Design System Revamp handoff

> **Status: PROPOSAL. Four decisions locked (§0); the rest awaiting review.**
> Nothing in here has been implemented. Written 2026-08-17 after a full read of
> the handoff bundle (`Parallax Design System Revamp/design_handoff_parallax_revamp/`,
> 131 files) and a 20-agent audit of every codebase subsystem it touches.
>
> Read `docs/STATE-OF-PLAY.md` first for where the repo actually stands.
> This file is the *plan*; the decisions it asks for are listed in §3 and
> nothing downstream of them should start until they are answered.

---

## 0. Decisions locked (2026-08-17)

Numbered so implementing docs can cite them inline. This section is the answer
to `STATE-OF-PLAY.md §10`'s warning about design decisions decaying across
handovers — a ruling that is cited is a ruling that survives.

| ID | Decision | Consequence |
|---|---|---|
| **RD-01** | **Staged scope — the component annex first.** Build the 28 specified kinds against *existing* repo canon (current trio, current tokens, current mark, current radii) as its own release. Then decide the rebrand on a clean, deployed baseline. | The 28 kinds are built **once**, to today's rules. No revamp brand/type/flatness rule may leak into them while the rebrand is undecided. §3.1 |
| **RD-02** | **The eight `.dc.html` prototypes will be retrieved.** | Workstream B stays deferred rather than cancelled. Once they land, the app redesign, the 32 instrument retrofits and the brand book become specified, and every contradiction in §5 gets its tiebreaker back. Until then §5's register is the working authority. |
| **RD-03** | **The brand mark is deferred.** The locked 2026-06-22 lens mark stands for now. | The handoff's Phases 0–1 brand steps drop out of this pass. The 38 SVGs stay unused. No favicon / app-icon / OG / apple-touch cache event — the one irreversible item is off the table. §3.3 |
| **RD-04** | **Keep the Fraunces / Schibsted Grotesk / JetBrains Mono trio; harvest the README's *scale* separately on its merits.** Literata does not enter the product. | `TYPE-MAPPING.md` is authoritative; `README.md §Type` is superseded background. Saves 13–18 agent-days and avoids the satori variable-font blocker. The 16px → 18px prose bump is evaluated on its own, in Schibsted. §3.4 |

**What RD-01 + RD-03 together take off the critical path:** the mark, Literata,
the flatness sweep, the seven-part contract retrofit, photography, and the app
redesign. What remains is Phase −1 (protect the work), Phase 0 (token
foundations), Phase 1 (the 28 kinds), Phase 2 (the mobile legibility pass) and
Phase 3 (the cheap, high-value half of the contract).

One rule follows directly from RD-01 and is worth stating as its own line,
because it is the single easiest way to waste the whole pass: **the 28 kinds use
`--font-display` / `--font-body` / `--font-mono`, the existing per-world token
set, `--r-*` as they stand today, and in-SVG `<text>` — not the revamp's Literata
roles, not radius-0, not the HTML-label architecture.** Those are workstream-B
decisions. Building the annex to undecided rules is how 26 agent-days becomes 52.

**RD-01 amended twice after the prototype pass (§7):**

- **RD-01a — build all 28 through one shared wrapper component.** The prototypes
  put every instrument in an identical card shell (`border-top: 3px solid accent`,
  a two-part eyebrow row, an h3 at 22px/700/−.024em, a tinted how-to-read
  callout, the graphic, then a hairline-topped plain+source paragraph). If the 28
  ship in today's chrome and a later rebrand adopts that shell, it is 0.5–1h of
  markup on each — 14–28h. Routed through one wrapper it is **one file**. This is
  the cheapest possible insurance against the double-build RD-01 exists to
  prevent, and it is the one concrete amendment the evidence forced.
- **RD-01b — in-SVG `<text>` with a *literal* font stack, never
  `font-family="var(--font-mono)"`.** RD-01's original wording pointed at
  `TYPE-MAPPING.md:25`, which is itself broken: a CSS variable inside an SVG
  presentation attribute does not resolve, so every axis label would silently
  render in the browser default serif. Fix that row in the handoff before
  building from it.

---

## 1. The one thing to understand first

**The handoff is two projects wearing one name, and only one of them has a
specification.**

| | Workstream A — the component annex | Workstream B — the actual rebrand |
|---|---|---|
| What | 28 new section kinds | New mark · Literata · flatness · the 7-part explainability contract · 32 *existing* components retrofitted into reader-driven instruments · the plate + lens photography · 11 app screens |
| Spec quality | **Excellent.** Per kind: a ~200-line blueprint (schema, geometry math, motion, colour, fallback, interaction, acceptance checklist), a screenshot, a copy-pasteable MDX payload, and a registry diff | **Prose only.** README §-level description, 15 lines for the entire app |
| Buildable today | Yes, after one token decision | No |
| Cost | **212 agent-hours ≈ 26 agent-days**, measured per kind | Unknown; unknowable until specified |

The revamp's own thesis is workstream B. `README.md:19` sells the whole thing as
*"gives every issue its own data instrument"*, and `README.md:183` says *"These
eighteen are rebuilt so the reader changes an input and watches the claim
change."* That is 32 retrofits of components you already have — and it has
**zero** blueprints, screenshots or payloads.

I verified the split: there is **zero overlap** between the 28 blueprinted kinds
and the instruments the README names, and **12 of the 14** instruments it names
already exist in `SECTION_KINDS`. `INTEGRATION.md:12` states it plainly: *"32 of
those 60 map onto section kinds this repo already has. The delta — and the
entire scope of this handoff — is 28 new kinds."*

So: the request is "completely rebrand Parallax," and the bundle specifies the
annex. That is not a reason to stop. It is the reason §3.2 below is the cheapest
and highest-leverage action available.

### 1.1 The prototypes — recovered 2026-08-17, and the authority order corrected

All eight `.dc.html` files (plus `support.js`, 1.3MB total) now sit in
`design_handoff_parallax_revamp/prototypes/`. They were missing from the
original bundle; `INTEGRATION.md:20` describes that as deliberate packaging.

**Authority order, corrected by the designer directly — this supersedes the
README:**

> Reading order is `AGENTS.md` → `INTEGRATION.md` → blueprints. `README.md` is
> **not** the required first read and **not** the tiebreaker, and its
> "Type — Literata only" section is **stale**.

This matters more than it looks. `README.md:23` claims the reading order starts
at the printable spec, and `README.md:438` claims *"The prototypes are the
tiebreaker. Where this README and `design/*.dc.html` disagree, the prototypes
win."* Both clauses are withdrawn. So:

- **For the 28 new section kinds, the blueprint is binding** and the prototypes
  are a visual reference only. Where a blueprint and a screenshot disagree, the
  blueprint wins — the blueprints already document the prototypes' own bugs.
- **For workstream B, the prototypes are the spec**, because nothing else covers
  it. That is what their recovery buys.
- **Every README-vs-`AGENTS.md`/`INTEGRATION.md` conflict in §5 resolves in
  favour of the latter two**, by the designer's ruling, without needing a
  tiebreaker. The type contradiction (§5 item 1) is settled this way, and RD-04
  matches.
- The two dangling authority clauses (`README.md:23`, `:438`) must be struck
  before that file is referenced from `docs/design/`.

What each prototype supplies:

| Prototype | Size | What it supplies |
|---|---|---|
| `Parallax Components.dc.html` | 467KB | The size system and explainability contract at true size, **and all 60 instruments** — the only spec for the 32 retrofits |
| `Parallax Revamp.dc.html` | 267KB | The exploration canvas, nine turns, including the rejected options and the two held-back image treatments |
| `Parallax Marks.dc.html` | 114KB | The mark exploration — and the six rejected drafts the About lore section needs as 64px thumbnails |
| `Parallax App.dc.html` | 102KB | The app redesign — 11 screens at 393×852, seven of which do not exist in the repo at all |
| `Parallax Web.dc.html` | 97KB | The six website pages, desktop + phone |
| `Parallax Content Templates.dc.html` | 48KB | Safe zones and "presence tiers" — the likely sanction for the six overlays' undocumented geometry (§5.2 item 12) |
| `Parallax Revamp Spec.dc.html` | 40KB | The written spec, printable |
| `Parallax Brand.dc.html` | 39KB | The brand book — construction, dial, cuts, scale, watermarks, misuse |

A full extraction pass over all eight is running; §7 records what it changes.
Note the files reference an `_ds/` stylesheet bundle that is not included, so
their own inline styles are the value source — which is what the handoff says to
read them for anyway (`README.md:27`, *"treat their markup and inline styles as
the source of truth for values, not their structure"*).

---

## 2. What the handoff gets right

This is a genuinely strong piece of work and the plan should not read as a
list of objections.

- **The blueprints are production contracts, not mood boards.** `majority-flow`
  gives the exact two-cubic ribbon path, the `k = 0.62` px-per-seat scale, the
  build-time conservation check, the aria-live verdict templates verbatim, and
  a 16-box binary acceptance checklist. It even names the prototype's own bug
  ("Never two `<text>` elements at the same y in the outcome column — that was
  the prototype's collision"). They cite your `CANON.md` by section number and
  your `CoalitionCalculus.astro` as the reader-agency reference.
- **The mark is exactly reproducible.** The `DIAL` formula regenerates the
  occluder centre of all six delivered `mark-<desk>.svg` files to the published
  decimal (politics 137.7/158.6, space 136.4/143.7, earth 148.7/135.1, tech
  162.3/141.4, travel 163.6/156.3, sports 151.3/164.9). A generator is trivially
  writable, and `scripts/logo-p.ts` already extracts a serif "P" as a vector
  path via satori — the outlining primitive exists.
- **Registry hygiene is real.** The insertion points are verbatim-correct, the
  90 → 118 arithmetic is right, and there are **zero collisions**: none of the
  28 kind names, component filenames or `px-` prefixes exist in the repo.
- **Two findings are outright accessibility fixes**, not taste:
  - Space `--accent-deep: #0085a1` scores **4.21:1** on the space ground (AA
    fail for body text); the revamp's `#5ce1ff` scores **11.81:1**. The repo
    applied "deep means darker" uniformly across six worlds — correct for the
    three light ones, backwards for space.
  - The repo's authored `--muted` fails AA on **four of six** worlds (space
    4.16, travel 3.94, earth 4.20, sports 4.26). The revamp's *derived* formula
    (ink at 58% on dark / 70% on light) passes on all six.
- **"Labels are HTML, geometry is SVG"** (`README.md:166`) is the only thing in
  the handoff that fixes the repo's largest documented defect — in-SVG fine
  print at 3.4–7px on a 375px screen (`STATE-OF-PLAY.md:125`), which also
  violates your own `CANON.md:106` 9.5px floor.

---

## 3. Decisions needed before any code

Ordered by how much work each unblocks. 1–3 gate everything.

### 3.1 Scope: is this the annex, the rebrand, or staged? — **RESOLVED, RD-01**

The bundle specifies A. The request is B. Options:

| | What | Cost | Irreversible calls |
|---|---|---|---|
| **A** | Build the 28 kinds against existing repo canon (current trio, tokens, mark, radii). Ignore the README's brand/type/flatness layers | ~26 agent-days | none |
| **B** | Full revamp now — brand + type + flatness + contract + 32 retrofits + photography + app | 120+ agent-days, and three workstreams have no spec | many, several uncacheable |
| **C** | Ship A as its own release, retrieve the missing artifacts, then decide the rebrand on a clean deployed baseline | A's cost now, B's later and better-specified | deferred |

**Recommendation: C, starting A immediately.** The critical constraint: do **not**
build the 28 kinds to the revamp's contract/type/token rules while the rebrand is
undecided, or they get built twice.

### 3.2 Can you get the eight `.dc.html` files from the designer? — **RESOLVED, RD-02**

Cheapest, highest-leverage action in the engagement. It converts three
unspecified workstreams (the app redesign, the 32 instrument retrofits, the
brand book) into specified ones, and it restores the tiebreaker that resolves
every contradiction in §5. If they cannot be retrieved, strike `README.md:23`
and `:438` before that file enters `docs/design/`, or a future session will hunt
a folder that was never delivered.

### 3.3 The brand mark — **DEFERRED, RD-03** (kept here for the eventual decision)

The phase medallion replaces a mark **you locked on 2026-06-22** (two
overlapping lens rings + a dimensional red hero sphere in the vesica). Two
things make this more than an aesthetic choice:

- **The medallion's misuse rules forbid, by name, what you approved.**
  `README.md:100`: *"No gradient or sphere shading … no drop shadow. If a
  rendering adds depth, light, a second accent … it is no longer this mark."*
  Your locked mark is a dimensional shaded sphere, refined at
  `REVIEW-2026-07-05` R2-4, and your two most recent commits (`ed04da5`,
  `a57e655`) are polish on the hero built from it.
- **A "P" medallion is a direction the earlier exploration rejected**, and the
  new handoff's own lore section lists "the letter, four ways" as *discarded:
  clever lost to legible* — then adopts a letter medallion anyway.

The current mark is not a component. It exists as **five independently
maintained drawings**: `base.css:55-77` (CSS pseudo-element rings + pulsing
dot), `Colophon.astro:115-139`, `HeroLens.astro` (a ~380-line composition where
the rings are cursor-tracking *eyes*), `app/src/components/LensMark.astro:39-70`,
and `scripts/social/cards.ts:78-84`. `HeroLens` is a re-conception, not a
retarget — a medallion has no two-ring, two-pupil affordance.

And the 38 delivered assets are **not shippable as-is**: 37 of 38 carry a live
`<text font-family="Literata, Georgia, …">` node, **zero** contain a `<path>`,
and zero use a CSS variable. A favicon is drawn in browser chrome with no access
to a page webfont, so the letter renders in Georgia on essentially every
consumer today.

Options: **adopt** (budget a `Mark.astro`, five drawing rewrites, a HeroLens
re-conception, 38 regenerations with outlined glyphs, and a one-shot
icon/OG cache event) · **keep the locked mark** (the handoff's Phases 0–1 drop;
everything else still stands) · **defer** (nothing else in the handoff depends
on the mark).

### 3.4 Typography

The handoff contradicts itself, and it resolves in the repo's favour twice over:

- `README.md:212`: *"### Type — Literata only"*, with a Literata-specific size
  and tracking table.
- `TYPE-MAPPING.md:3-4`: *"That is an artifact of the design runtime, not a
  design decision, and **it must not reach the repo**."*
- `INTEGRATION.md:40-41` agrees, and the handoff's own reading order
  (`AGENTS.md:23-26`) demotes the README to *"background, not your task list."*

Costed: **Literata-only is 13–18 agent-days** — not for the family swap (~50
declaration sites, about a day) but because `README.md:399` concedes the sizes
are family-specific, making it a review of ~1067 `font-size` declarations, 67
`ch` constraints, 191 tabular-nums rules and 80 hardcoded family literals across
106 files. Plus a hard blocker: satori cannot parse variable fonts
(`fetch-fonts.mjs:46-53`), Google ships Literata variable-only, and the OG card
pipeline hard-crashes on a missing static TTF (`cards.ts:34-35` uses a non-null
assertion). **Keeping the trio and applying `TYPE-MAPPING.md` is 1–3 days** and
touches none of the 90 existing components.

Your `AGENTS.md:490` hard rule is **not** in tension with either option — it
forbids *per-world* display faces and says nothing about which single family the
product uses. `STATE-OF-PLAY.md:257` explicitly records typography as
"arguable, provided the argument is written down."

**Recommendation: keep the trio; harvest the README's *scale* separately on its
merits** (the 16px → 18px prose bump is a good idea in Schibsted too). Confine
Literata to at most the mark's glyph — which should be outlined at generation
time regardless.

Two measurements to stop quoting: `README.md:397`'s reassurance that *"the 720px
prose column and ~60ch optimum still hold"* is false for **both** faces. At 16px
Schibsted the 720px column runs ~88 characters; 18px Literata ~82. Both are
16–26 characters above the 60–66 optimum. (Estimate — neither binary is vendored,
so this needs a real measurement, which is a 30-minute check.)

### 3.5 The three undefined tokens — cheapest decision, largest blocking radius

`--paper-warm` (18 refs), `--paper-deep` (21) and `--accent-warm` (1) appear
**40 times across 20 of the 28 blueprints** and exist **nowhere** in the repo.
This contradicts `INTEGRATION.md:127` (*"No new tokens"*) and the handoff's own
`AGENTS.md §6` (*"if one genuinely needs a new token, that is a canon change —
raise it, don't add it"*).

Why it must be settled before component one: an undefined custom property inside
`fill="var(--paper-warm)"` is invalid at computed-value time — **SVG fills fall
back to black, backgrounds go transparent, and nothing errors.** `astro build`
passes, `design:check` passes, and every blueprint's own acceptance box ("no raw
hex — every colour a `var(--*)`") **passes on the broken build.** It is invisible
to every gate you have. Load-bearing cases: `rain-calendar`'s dry band is ~94% of
its 365 cells; `margin-bullets` assigns it to both the track and the selected row.

**RESOLVED for `--paper-warm` by the prototype pass — with measured values, not a
derivation.** The how-to-read panel's `background` + `border-left: 3px solid
<accent>` pair occurs **exactly 10× per world, 60 times total, with zero
variance**:

| World | `--paper-warm` | above its ground |
|---|---|---|
| politics | `#f2eee4` | `#faf7f0` |
| space | `#12233c` | `#0a1628` |
| earth | `#ece2c4` | `#f4ecd4` |
| tech | `#171717` | `#0a0a0a` |
| travel | `#f6efe2` | `#fffdf6` |
| sports | `#12332a` | `#0f2820` |

Adopt these as literals in `worlds.css`. Note the data confirms the warning that
mattered: on the three light worlds it sits *above* the ground toward white; on
space/tech/sports it sits *above* the ground toward light — so a naive
`--paper-warm` → `--bg` mapping **inverts** the moment a politics kind is used in
a dark-world issue, which `CANON §2` permits.

**`--paper-deep` (21 refs) is now provably unmappable, which is itself the
answer.** The prototypes define exactly **one** elevated surface per world — one
non-ground value on the dark worlds, one tint above the ground on the light ones.
There is no second value for `--paper-deep` to be. So either alias it to
`--paper-warm`, or push back on the 21 blueprints that use it. Do not invent a
value. `--accent-warm` (1 ref) maps to `--accent-alt`.

### 3.6 `--accent-alt` — a conflict the handoff has with itself

`README.md:210`: *"No grey ramp, no second accent, no third colour on any page."*
`INTEGRATION.md:130-132`: *"No new tokens. All 28 use the existing six-world set:
… `--accent-alt`."*

Your usage is semantic, not decorative: for/against (`politics.css:186`),
win/loss and relegation (`sports.css:308-346`), alert and debris
(`space.css:342,360`), unbalanced residual (`PowerFlow.astro:315`), comparison-B,
party-2, and a declared three-role wedge set — **120 usages across 32 files**, and
`CANON.md:122` mandates it. **Recommendation: keep and govern it** — one accent,
plus one named contrast role, plus a declared fixed-encoding allowlist. Removing
it costs ~3 agent-days redesigning eight encodings for no stated reader benefit,
and guts four of six world specs.

### 3.7 "In plain terms" means the opposite thing in the two systems

This one is a **mechanical pipeline failure**, not a documentation disagreement.

- Repo: `config.ts:131` — *"One sentence explaining the FORM of the viz … Captions
  explain the DATA instead."* Rendered **below** the graphic
  (`Section.astro:54-57`) under the label "In plain terms".
- Revamp: `README.md:163` — part 06 *"In plain terms | One sentence stating the
  **finding**."*
- And `.claude/agents/verifier.md:48-52` **flags a `plain` line that asserts
  data as a ⚠️ PLAIN-CLAIM defect.**

Ship part 06 under the existing name and every compliant finding line trips your
brand-protection step, on every run, forever. Ship both and every issue prints
two contradictory sentences under one heading.

The clean resolution needs **three** schema moves, not one: rename the form line
to `howToRead` with a paragraph-sized cap and render it **above** the graphic;
add `finding` below; and promote `caption` + `source` out of `data: z.any()`
(`config.ts:138`) so they are validated at all. That last move alone makes two of
the seven contract parts build-enforced across all 118 kinds for about half a day
— **the highest reader-value-per-hour item in the entire revamp.**

Related trap: **13 of the 28 supplied `what` strings exceed the 220-char Zod cap**
(porkchop-grid 296, majority-flow 272, flame-graph 267, knockout-bracket 267,
goal-clock 263, service-arcs 251, margin-bullets 247, channel-ternary 247,
fare-spread 240, river-multiples 237, age-pyramid 233, volume-accuracy 232,
turnout-margin 229). Safe pasted into `EXPLAIN` (uncapped); build-breaking if an
author copies one into `section.plain` — and the catalog is what the drafter agent
reads at runtime, so the pipeline is the most likely path to that failure.

### 3.8 Photography — the plate and the lens

The revamp is photography-led in two places. `AGENTS.md:357` is absolute: *"No
raster imagery: the publication is type- and data-viz-led. There are no cover
photos or AI-generated covers, and no external image service in the pipeline."*
The code matches exactly — zero `<img>` in all of `src/`, no `astro:assets`
anywhere, no `src/assets`, no image field in the schema, and every `url()` in the
stylesheets is an inline SVG data URI.

Four things make this cheap to decline:

1. **The bundle itself holds it out of scope** — its `AGENTS.md:118` (*"No
   photographs. The prototypes' plate frames are empty drop zones"*) and
   `INTEGRATION.md:143` (*"No raster assets, no photographs"*).
2. **Your own precedence rule decides it without an aesthetic ruling.**
   `CANON.md:12-14` ranks blueprint > world spec > canon. There is **no plate or
   lens blueprint** in the bundle, so `worlds/travel.md:61` (*"DON'T use
   photographic postcards … ink on cream carries it"*) and `worlds/earth.md:62`
   (*"DON'T use satellite-photo textures or terrain imagery"*) simply win — and
   travel is one of only two worlds the lens ships in.
3. **The politics lens pair is unsourceable as written.** `README.md:314`
   specifies *"1976 ⇄ 2031 · same house."* Today is 2026-08-17.
4. **The recurring cost is the real argument.** ~10 images to start, then 1 per
   issue and 3 for politics/travel — each needing a real photograph of the actual
   named subject (stock is barred by `CANON §11`), a cleared licence, stored
   evidence, a credit and alt text. No agent can clear rights. That is an
   operator obligation on the critical path of every issue, permanently.

Also note a funnel regression nobody would catch: the plate, lens and instrument
all render as `.px-section`, and `ReadingGate` is mounted with `freeSections={2}`
(`issues/[slug].astro:100`). Inserted where the README specifies, an anonymous
reader spends both free sections on one prose block and a photograph, then hits
the signup wall **before seeing a single graphic.**

**Recommendation: decline the photographs; adopt the treatment if you want the
rhythm.** The plate's 1px frame, caption row and once-only reveal applied to a
drawn or data figure is ~2 agent-days instead of ~11, needs no pipeline and no
licensing — and `home/FeaturedPlate.astro` is already most of it.

### 3.9 Flatness — radius 0, shadow none, one looping animation

The repo is a soft, elevated, glassy system; the revamp mandates a flat hairline
one. Measured: **267 `border-radius` declarations** (247 `src/`, 20 `app/src/`),
**112 real `box-shadow` declarations**, 14 `backdrop-filter`, 24 hover lifts
across 21 files, and **26 looping animations against a budget of exactly one**.
87 distinct files carry a radius or a shadow.

The mechanical part is cheaper than it looks — three tokens (`--r-card`,
`--r-tile`, `--r-pill`) account for 128 of the 267 radii, and one shadow recipe
repeats 12 times across ~20 named classes. Three things are not mechanical:

- **It reverses your own written canon in two places.**
  `APP-DESIGN-SPEC.md:36` specifies the `.plate` shadow *to the pixel*, and
  `CANON.md:187` explicitly carves out glass for toolbar/modal chrome. Both must
  be amended in the same commit, or the next agent restores the shadows and is
  right to.
- **Three surfaces read as broken, not flat, under a naive sweep:** the fixed
  glass `ReadingToolbar` (which the revamp *replaces* with an in-flow 2px-ink-rule
  block — a rebuild, not a restyle), the app's sticky glass `.appbar`, and every
  card whose shadow is its only edge (e.g. `.px-appr__svg`,
  `politics.css:567-572`, which has no border at all).
- **The motion half is larger than the radius half.** Of 19 named motions in
  `motion.md`, roughly three survive intact, four need retiming into bands your
  token set does not contain (280–320ms, 340ms), and ~12 are deleted or
  contradicted by name — including `hoverLift`, which the revamp forbids
  verbatim. Freezing the 8 auto-rotating WebGL scenes changes what 14 components
  *are*; that is a product decision, not a CSS sweep.

Also: `src/styles/intro.css` (the "Second Angle" onboarding surface) is a second,
non-revamp design system — 12 radii, 6 shadows, 4 blur values, its own
aurora/cyan palette, a 16s infinite drift. The revamp has no onboarding surface
at all. Flattening it in place produces something that is neither the current
cinematic identity nor the revamp's, which is the worst of both.

### 3.10 The mobile legibility residual — decide this independently

`STATE-OF-PLAY.md:125` records in-SVG fine print at 3.4–7px on 375px as having
"no clean blanket fix." That is true of a *blanket* fix and misleading overall:
**`PowerFlow.astro:348-359` implements a working per-component fix** (bump
in-SVG font-size at ≤680px and ≤440px so rendered text holds the 9.5px floor),
and **5 of the 42 text-emitting SVG components already carry it** (PowerFlow,
CarbonLoop, EloRiver, PaceRidge, ShotMap). The residual is a deferred chore at
12% completion, not an architectural dead end.

So there are two routes, and they should not be confused:

- **Generalise the existing bump** to the remaining 37 components, and drop
  `.px-viz`'s 30px padding below 640px to buy back ~28px of chart width.
  **4–6 agent-days**, proven in-repo, needs no contract, no schema field, and
  none of the 28 kinds. This restores compliance with your own `CANON.md:106`.
- **Adopt "labels are HTML, geometry is SVG."** Architecturally better and it
  makes figures citable — but its precondition (`README.md:148`, *"none scales
  with the viewport"*) breaks every `layout:` variant, the handoff contradicts
  itself on it three ways (`TYPE-MAPPING.md:25` sanctions the forbidden pattern;
  ~15 of 28 blueprints specify in-SVG `<text>`; `src/components/AGENTS.md:414`
  mandates the inverse for legends), and the honest catch nobody costed is that
  constant-size labels over a 275px card take ~2.6× more relative space — so it
  converts a rendering residual into a real per-kind decluttering task.

**Recommendation: do route 1 now, as its own commit.** It is the one
reader-facing defect in this whole dossier that is unambiguously worth fixing,
and it is independent of every other decision — do not let it be held hostage to
the contract question. Then decide route 2 as its own project, before any of the
28 kinds is written, because it determines their label architecture.

### 3.11 Three shipped systems the design contradicts — none of them yet a decision

Surfaced by the prototype pass. Each is a *rule* in the spec, not an omission, so
each needs an explicit ruling rather than a merge.

**(a) The reading toolbar moves from the viewport to the foot of the document.**
`Parallax Revamp Spec.dc.html:175`, verbatim: *"Pinned to the foot of the issue,
not the viewport."* Built that way in both `Web` and `App`. Your shipped
`core/ReadingToolbar.astro` is fixed glass. **The tell that this is a design
mistake rather than a design choice: both prototypes hardcode the progress fill
at 42%.** An in-flow toolbar at the foot of a 6,000-word article cannot show live
progress — the design quietly abandoned the feature the component is named for.
**Recommendation: keep the fixed toolbar; adopt the 2px-ink-rule treatment if you
want the look.** But rule on it, because the spec states the opposite.

**(b) Story mode changes surface *and* business model.** `Spec:176` and `:223`
put the 60-second cards **app-only, behind auth**, per-issue and per-world, and
`Spec:220` adds *"Editorial promises live on the public site only."* Your `/s/`
route is a **public** page with generated OG share cards — a free acquisition
funnel. The design's version is a retention feature. This is the one place the
handoff has a view on your funnel and it is the inverse of the one you built.
Cheapest read: keep `/s/` public, treat app cards as an additional retention
surface. That is a choice to make, not a merge to perform.

**(c) The reading gate has no counterpart anywhere in the design.** Zero hits for
`paywall` / `gate` / `meter` / `free` across the spec. The design is instead
**anonymous-first** — `App:62`'s primary CTA is *Choose your worlds →* leading to
Worlds → Feed with no account at any point, and `App:151` offers *"Keep reading
without an account."* Worse for porting: `Web`'s issue body is **one continuous
centre column** where prose, plate, lens and both figures are flat siblings with
no section wrapper. A literal port collides with `ReadingGate`'s `.px-section`
counting (`ReadingGate.astro:78-89`, FREE=2) one of two ways — either the whole
page falls inside the free allowance, or **the lens and both figures fall behind
the wall while a photograph spends a free section.** The second is likelier and
worse. Nothing in the design decides it.

---

## 4. The plan

### Phase −1 — protect the existing work (hours, not days; before anything else)

**23 section kinds exist on exactly one disk.** Verified: `HEAD` contains 68
`SECTION_KINDS` entries; the working tree contains 90. `git branch -a` shows only
`main`, `git stash list` is empty, and `main` is level with `origin/main`. So the
22 P6 breadth kinds, 4 WebGL scenes, `viz3d/packet.ts`, `public/geo/plates.json`,
the three funnel islands, the app Shelf, the onboarding flow and the unapplied
migration exist in **no** commit, branch, stash or remote. One `git checkout .`
erases the entire 2026-07-14 session — and `STATE-OF-PLAY.md:146` records that a
subagent has already done exactly this once.

Worse, `src/content/config.ts` and `docs/design/catalog.md` are simultaneously
(a) modified-and-uncommitted, holding the only copy of the 68→90 edits, and
(b) the two files the revamp must edit for 90→118. `check:catalog` enforces 1:1
same-order pairing, so a partial edit fails — and the natural remediation an
agent reaches for on a failing generated-looking file is `git checkout`.

Operator steps, in this order:

1. Commit and **push** the 73 files (38 modified, 35 untracked). The build is
   green and `check:catalog` passes at 90↔90 today, so this is safe to do
   immediately with no repair work.
2. Apply `app/supabase/migrations/20260705000000_journey_onboarding.sql`. It is
   idempotent and additive. `auth/callback.ts` already routes first-time users to
   `/welcome`, which reads those columns — deploying the app first breaks signup
   for every new reader, and this box cannot runtime-verify it.
3. Deploy **app, then publication** (`AGENTS.md:560` — the publication's
   `NewsletterForm` posts to the app's `/api/join`). The handoff's Phase 5 puts
   app work *last*, which inverts this repo's rule; don't read it as a release
   order.
4. Smoke the funnel live, then **branch** `revamp/…`. Nothing revamp-shaped
   touches `main`.

Two hazards to fix while here, both cheap:

- **`prebuild` runs before `design:check`.** `npm run build` executes
  `tsx scripts/story/og.ts` — which unconditionally rewrites all 10 tracked OG
  PNGs — *before* the token gate can fail. A token drift (the most likely Phase 0
  error) therefore leaves the build red **and** 10 binary files modified, right
  next to unbacked-up work. Use `npx astro build` for iteration.
- **Wire `check:catalog` into `prebuild`** for the duration. It is not in the
  build today, so 28 registry edits can land half-wired with a green build. Note
  it also hides all but one error class per run — its order check sits behind
  `if (!fail)`, so a missing block suppresses the order check entirely, and the
  order loop `break`s at the first drift.

### Phase 0 — foundations (~4 agent-days)

The handoff's Phase 0 promises *"Nothing should look different when this ships."*
**That is false as written** — its records differ from your canonical
`shared/design/worlds.css` on 9 of ~36 values (four grounds, five accent-deeps).
Implementing it from the README is a visible repaint of four worlds shipped under
a label that says it is invisible, with a rollback note that says nothing changed.

Do it with **repo values**, so the phase is a genuine no-op refactor with a
genuine rollback:

1. **Collapse the palette from ten declaration sites to one.** It is currently
   declared in: the six theme headers · `shared/design/worlds.css` ·
   `home/CategoryCard.astro:557-641` (48 hexes) · `home/FeaturedIssue.astro:38-92`
   (36 hexes) · `meta.css` (a seventh, meta palette) · `app.css` (an eighth) ·
   `scripts/social/cards.ts:23-31` (a ninth) · `scripts/lib/social.ts:164-169`
   (a tenth). `tech` accent-deep alone has **five** distinct live values.
   Delete `FeaturedIssue.astro`'s block outright — it is already stale on two
   other axes (five worlds, earth missing; and it still names the per-world
   display faces retired on 2026-06-21). Rewrite `CategoryCard.astro` to consume
   `[data-world]`. That removes 84 hex literals before any value reconciliation.
2. **Add `--on-accent`** (absent entirely; it equals the world's ground in every
   record, so it can be an alias) and resolve the three undefined tokens per §3.5.
3. **Extend `design:check`** to assert theme-header values against the
   `worlds.css` record and derived tokens against the formula, plus a hex-literal
   lint with an allowlist. Today it byte-compares two files and nothing else —
   which is exactly why `tech` accent-deep drifted five ways. ~0.5 days, and it is
   the only item here that stops the work being redone.
4. **Ship the two accessibility fixes as their own reviewable commits**, not
   smuggled into a refactor labelled invisible: space `--accent-deep` →
   `#5ce1ff`, and the derived `--ink-soft`/`--muted` formulas (438 + 213
   consumption sites re-render, so budget the visual-regression pass, not the
   edit).
5. **Decide the OG filename scheme.** `og:image` is a stable unfingerprinted
   `/og/story/<slug>.png` derived in two places, overwritten in place by
   `prebuild` on every Vercel deploy. Facebook/WhatsApp cache by URL until a
   manual re-scrape; iMessage effectively indefinitely. Fingerprinting now, at 10
   published issues, is the cheapest this decision will ever be. Also create
   `app/public/` — it does not exist, so the app 404s its own favicon today —
   and add `favicon.ico`, `apple-touch-icon` and `site.webmanifest`. iOS caches a
   home-screen icon per install with **no** invalidation path.

### Phase 1 — the 28 kinds (~26 agent-days + wiring)

Blocked only on §3.5. Build order, cheapest structural risk first (the handoff's
own §4, corrected for the effort data):

| Wave | Kinds | Hours |
|---|---|---|
| 1 — cheap HTML/CSS, mobile-immune | `bill-funnel` 3.5 · `age-pyramid` 4 · `finish-interval` 4.5 · `margin-bullets` 5 · `attrition-waffle` 6 · `state-timeline` 6 | 29 |
| 2 — straightforward SVG | `channel-ternary` 3.5 · `rank-bump` 4 · `goal-clock` 5 · `turnout-margin` 5.5 · `volume-accuracy` 6.5 · `glacier-dumbbell` 7 · `river-multiples` 7 · `debris-histogram` 7 | 45.5 |
| 3 — real geometry | `fare-spread` 7 · `majority-flow` 8 · `revenue-mosaic` 8 · `price-swarm` 9 · `service-arcs` 9 · `mission-timeline` 9 · `rain-calendar` 8.5 | 58.5 |
| 4 — hard, do last | `heat-uptake` 10 · `latency-ridge` 10 · `daylight-band` 10 · `knockout-bracket` 10 · `route-criteria` 12 · `flame-graph` 13 · `porkchop-grid` 14 | 79 |

Corrections to apply before writing component one:

- **The registry duty is nine places, not five.** The handoff's `AGENTS.md:49-64`
  lists five moves; `src/components/AGENTS.md:230-263` lists nine, and root
  `AGENTS.md §8` adds a `KIND_PRIORITY` score in `src/lib/story.ts` — without
  which a kind silently defaults to 30 (`story.ts:139`) and never appears as a
  story beat. The bundle mentions story mode **nowhere**. This is the exact
  defect the 2026-07-14 pass had to retrofit for the previous 22 kinds.
- **Discard the `SectionBody.diff.md` arms wholesale.** They prescribe
  `{kind === 'x' && <X data={section.data} />}`. There is no `kind` variable in
  `SectionBody.astro` (it destructures only `section` and `data`), and **no**
  repo component accepts a `data` prop — all 90 arms use `section.kind === 'x'`
  with flat named props. Pasted literally it is a `ReferenceError` (loud);
  "fixed" by prepending `section.` it renders every component on its prop
  defaults — an empty chart, no error, green build. That is the exact
  silent-empty failure the repo already documents.
- **Fix the 13 over-cap explainer strings** (§3.7) before any is authored.
- **Fix `TYPE-MAPPING.md:25` in the handoff first.** It prescribes
  `font-family="var(--font-mono)"` — a CSS variable inside an SVG presentation
  attribute. `src/components/AGENTS.md:406-409` and `CANON.md:110-111` both state
  this does not resolve. The failure is silent: every axis label in all 15
  SVG-bearing blueprints renders in the browser default serif.
- **`INTEGRATION.md`'s interactivity inventory is wrong by 18 kinds.** It claims
  *"19 of the 28 are static build-time renders. Nine carry exactly one control."*
  Measured: 28 of 28 blueprints have a `## 8. Interaction spec`, 28 of 28
  reference `aria-live`, and **27 of 28 declare "One control"** (the exception,
  `rank-bump`, still specifies focusable legend buttons). The handoff's own
  `AGENTS.md:91` gives a third number (six). Budget from the blueprints.
- **Copy the 28 blueprints into `docs/design/blueprints/<world>/`** as part of
  each kind's commit — the handoff folder is untracked, and
  `src/components/AGENTS.md:257` requires the canon path.
- **The screenshots contain real layout bugs.** The right-hand ledger column
  overflows and collides with its row rules in `majority-flow`,
  `knockout-bracket`, `route-criteria` and `rain-calendar`; `knockout-bracket` is
  clipped at its own card's bottom edge. **Blueprint beats screenshot, always** —
  the blueprints know this and name the collisions.

### Phase 2 — the mobile legibility pass (~4–6 agent-days)

Independent of everything. Generalise `PowerFlow.astro:348-359` to the remaining
37 text-emitting SVG components; drop `.px-viz` padding below 640px. See §3.10.

### Phase 3 — full compliance with the contract's actual floor (~1 agent-day)

Retitled after the prototype pass, because the framing was wrong: this is not
"the cheap half" of a seven-part contract. **The contract has two tiers.** Seven
parts bind the 60 instruments (`Components:96`); a **two-part floor** — caption +
source, *"Never a graphic without both"* (`Spec:172`) — binds every other graphic.
The tiers are real; they are simply never declared as tiers.

So: promote `caption` and a structured `source {label, date}` out of
`data: z.any()` onto `sectionSchema`. That is **full compliance with the system's
own floor, across all 118 kinds, for about half a day** — and it closes an
existing canon violation (`CANON.md:132`'s "No source, no section" is
honour-system today; 12 viz kinds render no source line at all). Two details the
prototypes settle: the separator is `Source · ` (70×) not `Source:` (0×), and the
source is **not a separate block** — it is the second line of the plain paragraph,
at 9px/600/.14em.
Add the `howToRead` / `finding` fields **as optional**, backfill all 12 issues,
then tighten to required in a separate revertible commit. Required-immediately
means 12 issue folders fail Zod at once, including all six published ones, with
no partial deploy possible.

### The reader app — deferred with the rest of workstream B, but sized

Audited separately. **0 of 11 revamp screens exist as specified**: four are
partial (Welcome, Sign in, Link sent, You), seven are absent (Sign up, Worlds,
Feed, Archive, Issue, 60-second cards, Knowledge check) plus the tab bar.
Estimated **~18–22 agent-days** for the eleven screens, excluding real billing
and an in-app issue renderer.

Five findings worth carrying forward:

1. **"Magic link only" is a regression, and probably an artifact.** The app ships
   Google OAuth as the *primary* filled button with magic link secondary under
   *"or use your email"* (`login.astro:59-88`) — and that hierarchy is the
   **built fix to diagnosed journey break #5** (`JOURNEY-SPEC.md:28`). Dropping
   Google also breaks the `display_name` prefill chain (`welcome.astro:46-53` and
   the DB trigger read `raw_user_meta_data`, which only OAuth supplies) and
   discards configured Google Cloud OAuth setup. Most likely explanation: a
   `.dc.html` prototype **cannot perform an OAuth redirect**, so "magic link
   only" describes the prototype's runtime, not a design decision. Recommendation:
   keep both methods, adopt the revamp's field metrics and copy on top.
   (Secondary: the spec says 20 minutes / one use; the build says 60 minutes in
   three places. "One use" is already true of Supabase links.)
2. **The blocking gap is not a screen, it is a bridge.** The app has **no issue
   catalogue at all** — `src/pages/issues-manifest.json.ts` and
   `app/src/lib/issues.ts` are both unbuilt (`JOURNEY-SPEC.md:164-169` records
   them as NOT BUILT). That single ~1.5–2 day gap blocks **four** screens (Feed,
   Archive, real Shelf titles, any in-app Issue) and is why dashboard tiles
   title-case the slug today. Build it first.
3. **"Issue" should stay on the publication.** Rendering issues in the app means
   re-implementing the 90-kind section library in SSR — exactly the hybrid move
   `app/AGENTS.md:64-79` calls *"the single most consequential architectural
   decision… Do not undo it."* Read "Issue" as the publication's page, and let
   the plate/lens/toolbar land there.
4. **The eleven screens would silently delete shipped, moderated features.**
   Nothing in them accommodates reactions, annotations/margins, Letters, the two
   admin queues, or the account-deletion danger zone — and that last one is a
   stated DPDP/GDPR requirement (`COMMERCIALISATION-SETUP.md:280`). Implementing
   the eleven literally is a feature regression unless carry-over is explicit.
5. **₹149/mo contradicts live copy.** The app's own landing says *"Free, no ads,
   no trackers"* (`index.astro:24`) and the reading gate promises *"Free forever ·
   we never sell your data"* (`JOURNEY-SPEC.md:87`). There is **zero** billing
   presence in the repo — no table, no processor, no webhook. The ₹149 *block* is
   a day of design; working billing (India-capable processor, recurring e-mandate,
   entitlement checks) is a separate project. Do not bundle them.

Data delta: roughly **two new migrations** — one for `reader_prefs` (text size,
Full/Skim default, bilingual wordmark) plus the followed-worlds decision, one for
`quiz_answers` — and they stack on top of `20260705000000_journey_onboarding.sql`,
which is **still unapplied**. Two features need no new columns: the weekly email
is already modelled (`email_prefs.weekly_digest` + `newsletter_subscriptions.cadence`);
its real gap is that **no scheduler exists anywhere in `app/`**, so "Thursday
07:00 IST" is unimplemented, not unmodelled. And 60-second-card content is
*content*, not reader state — the derivation engine already exists in
`src/lib/story.ts`, needing only `MAX_BEATS` 6 → 5 and a claim/consequence pair
where the beat currently carries one text field.

The "app stays calm" conflict is narrower than it reads: by the revamp's own
derived rule (`README.md:207`) only the three dark worlds get their real ground;
politics, earth and travel are accent-at-9% on paper. Cheapest honest resolution
is to apply the light-world rule universally and let the ghost issue numeral, the
dot and the 4px accent edge carry world identity — that delivers the composition
with zero canon breach and zero dark-variant primitive work.

### Phase 4+ — workstream B, now sized

The prototypes did not make B cheaper. They made it **knowable** — moving ~54
agent-days from "unspecified" to a defensible estimate. Agent-hours, 8h = 1 day:

| Sub-workstream | Hours | Days | Fidelity of its spec |
|---|---|---|---|
| **B1 · 31 instrument retrofits** + shared `px-inst` primitive + hover→focus equivalents | 144–162 | 18–20 | **production** — 1,584 inline styles, zero classes, every value literal |
| **B2 · The app, 13 screens** (incl. the manifest bridge at 14h, which blocks four of them) | 178 | 22 | **production** — every screen measured at 393×852 |
| **B3 · The six web pages** — *this workstream was missing from the plan entirely* | 91 | 11.5 | **high** — but zero `@media`, zero `clamp()`, zero `vw`; a 412/1280 prop toggle, so every width between is unspecified |
| **B4 · Brand book** — deferred, RD-03 | 96 | 12 | **regenerable**, blocked on outlining the letter |
| **Total, B4 deferred** | **413–431** | **52–54** | |
| **Including B4** | **509–527** | **64–66** | |

Add flatness (~10–14 days by §3.9's measurements) and photography (~11 days by
§3.8) and the plan's original "120+ agent-days" for full workstream B was in the
right ballpark.

**The six highest-value items in B, named** — five of them are hours, not days,
because the repo already carries the payload or the control:

1. **`scaling-plot`, log ⇄ linear toggle — 4h.** `ScalingPlot.astro:22-23`
   already has `logX`/`logY` as build-time props; the work is promoting them to
   runtime. The payoff is the sharpest sentence in the handoff
   (`Components:3302`): *"On this axis the growth is a straight line, which reads
   as a schedule somebody could keep. Press Linear."* → *"…This is what the log
   axis was hiding."* The whole thesis of the revamp, in half a day, on a
   component that indicts its own conventional form.
2. **`chip-die` (1.5h) + `season-wheel` (2h) — do these first regardless.** Both
   already have a control *and* an `aria-live` readout
   (`ChipDie.astro:224-269`, `SeasonWheel.astro:245-262`). 3.5h buys two finished
   exemplars to build the shared `px-inst` primitive against — which is where the
   other 118 hours live.
3. **`xg-race`, minute scrub — 3h.** `XgRace.astro`'s `events[]{minute, team, xg}`
   is already the exact shape the prototype's clip needs.
4. **`climate-spiral`, year scrub to the +1.5 °C crossing — 3h.** Geometry and
   payload already correct.
5. **The issue-manifest bridge — 14h.** Unglamorous; unblocks Feed, Archive, real
   Shelf titles and any in-app issue. Nothing else in B2 can start.
6. **The masthead Menu button — 5h.** Fixes a live production defect (§6 item 1)
   with a now fully-specified component: the word *Menu* at 11px/600/.15em
   uppercase in a 1px ink border, `padding: 8px 12px` (`Web:92`); an **in-flow
   accordion** drawer, no scrim, no overlay, no transition (`Web:96`); threshold
   **768px** (`Spec:167`), not the repo's 900. One gap the prototype leaves: the
   live badge and *Subscribe →* have **no phone representation**, so a literal
   port deletes the primary mobile CTA.

**Four to decline or rescope:** the *risk corridor* (8h — it has no repo kind and
no blueprint; it is a 29th new kind hiding inside the retrofit set);
*latency-waterfall* (7h — the only item needing a payload schema change *and*
re-authored data in a published issue, and `COLLISIONS.md §3` already assigns its
argument to the new `latency-ridge`); *itinerary-reel* (6h — replaces a working
CSS-3D flip card with a flat band, and its plain line does not even rewrite); and
the *swing ladder* (7h — its argument is already carried by `coalition-calculus`
and `majority-flow`).

---

## 5. The contradiction register

Every internal inconsistency found in the bundle, verified. Any of these will
otherwise be rediscovered mid-build.

**Resolution rule (§1.1):** where the README conflicts with `AGENTS.md` or
`INTEGRATION.md`, the latter win — the designer has withdrawn the README's
first-read and tiebreaker status. That disposes of items 1 and 8 immediately.
The prototype extraction pass may settle more; §7 records the outcome.

### 5.1 Contradictions that change what gets built

1. **Literata vs the trio** — `README.md:212` vs `TYPE-MAPPING.md:3-4` and
   `INTEGRATION.md:40`. **RESOLVED** by the authority ruling and RD-04: the trio
   stays, the README's type section is stale, and that line should be struck.
   §3.4.
2. **"No new tokens" vs 40 references to three tokens that do not exist** —
   `INTEGRATION.md:127` vs 20 of 28 blueprints. §3.5.
3. **Interactivity: 9 vs 6 vs 27** — `INTEGRATION.md:101` vs the handoff's
   `AGENTS.md:91` vs the blueprints.
4. **The contract has no teeth in the documents an implementer works from.**
   Seven parts are stated once (`README.md:154-168`). All 28 blueprint §11
   checklists reduce it to *"Caption + source + plain line all present"*; 0 of 28
   mention "How to read". Parts 04 (legend-as-control) and 05 (live readout) are
   logically impossible for the kinds `INTEGRATION.md` declares static, so as
   written 19 of 28 fail two of seven mandatory parts by definition.
5. **"Labels are HTML" vs `TYPE-MAPPING.md:25` vs ~15 blueprints** that specify
   in-SVG `<text>` with coordinates and per-label collision policies. §3.10.
6. **"One accent, never a third colour" vs `--accent-alt` required for all 28.**
   §3.6.
7. **"In plain terms" inverted** — and it breaks the verifier. §3.7.
8. **Photography in scope (README Phase 4) vs out of scope** (the handoff's
   `AGENTS.md:118`, `INTEGRATION.md:143`). §3.8.
9. **`README.md:397`'s "60ch still holds"** is false for both faces. §3.4.

### 5.2 Defects in the delivered assets

10. **37 of 38 brand SVGs carry a live Literata `<text>` node; zero contain a
    `<path>`; zero use a CSS variable** — so they render in Georgia in every
    standalone use, and hard-code politics hexes despite `README.md:117` saying
    the in-product mark reads world tokens.
11. **`watermark.svg` is unusable as shipped.** It sets the light circle, ring and
    letter to 0.05/0.1/0.07 opacity but leaves the r=113 occluder at a fully
    opaque `fill="#faf7f0"` with no opacity attribute — punching a solid light
    hole on all five non-politics worlds and on the primer it sits behind.
12. **The overlays' 24-unit occluder — SANCTIONED, and the plan's first guess was
    wrong three ways.** (a) Only **three** of six carry an occluder at all
    (`overlay-corner` 1×, `overlay-title` 1×, `overlay-outro` 7×; bug/spine/
    thumbnail use the reversed cut and have zero). (b) It **is** declared:
    `Content Templates:219` (*"Outline marks widen the dial to 24 units and cap
    the ring stroke at 9"*) and `:291-294` (`150 - 24 * Math.cos(t)`). (c) It is
    **not** a presence tier — presence tiers are opacity-only (signature 100 /
    structural 90 / persistent 72 / ambient 56), and the 24u dial applies to every
    outline mark including signature. Correct statement: *the video/social kit
    runs a declared distinct geometry regime for delivered-at-distance contexts.
    Do not propagate the 24u dial to `mark.svg` / `watermark.svg` /
    `end-mark.svg`, which correctly use 15.* Two residuals survive: "cap the ring
    stroke at 9" is implemented as a *floor* (the ramp gives 7 at those sizes),
    and `CT:196` raises the reversed-cut threshold to **32px delivered** against
    the book's **24px** — a numeric conflict no file reconciles.
13. **The reversed cut — NOT a contradiction; two tiers were conflated, and the
    README is the error.** `Marks:100`, verbatim: *"Below 24px the ladder switches
    to the reversed cut and drops the crescent."* The **seal** at 76px
    deliberately **retains** it (`Brand:104-113`, labelled *"reversed cut, same
    dial"* — and "same dial" is meaningless unless the crescent is drawn). So the
    seven `seal-*.svg` are **correct** and `README.md:93` conflates two tiers into
    one row. `app-icon.svg` is likewise not a fourth drawing but the whole
    construction uniformly scaled ~0.864 (118→102, 110→95, 113→97.5, dial 15→12.96,
    letter 160→138 at y=199) — a well-formed derivation. **One genuine defect
    survives:** the book contradicts itself on polarity (`:158`/`:162` vs
    `:179`/`:182`), which is why `favicon.svg` and `app-icon.svg` ship
    polarity-opposite. Needs a ruling before either is minted.
14. **The About lore art EXISTS — the plan looked in the wrong file.** Six
    finished, purpose-drawn thumbnails sit in `Parallax Web.dc.html:665-698`, at
    **46px**, not 64, and not crops but reductions. (`Marks` holds 19 variants
    across six turns; the README's six lore rows are a curated narrative over
    them, not a 1:1 mapping.) **Three defects in that art instead:** draft 01 has
    no full-size antecedent anywhere; row 06's occluder offset is magnitude
    **12.09 at ~314.7°** against a canon of 15 at 325°, so regenerating from the
    formula yields a visibly different crescent than the checked-in thumbnail; and
    **row 05's thumbnail is geometrically identical to the shipped
    `favicon.svg`** — the About page would show readers a row labelled
    *Discarded* wearing the current favicon.

### 5.3 Counting and bookkeeping errors

15. **Instrument count, three ways in one file** — `README.md:170` heads a table
    "The eighteen built"; the table lists 20 rows; Known gaps #4 says
    "60 in total". **RESOLVED: 60 numbered (48 M + 12 L), plus 12 unnumbered S
    margin figures = 72 drawn.** `Components:45` states 60 and is right;
    `INTEGRATION.md:12`'s 32/28 split reproduces exactly. Note **no XL instrument
    is ever drawn** — `XL ·` appears once, in the intro card. Its geometry is
    specified, budgeted, given a phone rule, and never built.
16. **Brand asset count** — README says "32 production SVGs" three times;
    `INTEGRATION.md` says 38 twice. **RESOLVED at 38** (directory count); the
    README's table enumerates to 32 and omits the six `overlay-*.svg`, so a
    regenerator built from it drops them.
17. **Archive depth** — Known gaps #3 says "Eight issues against a stated
    twenty-four". **RESOLVED at 24 as a *design target*:** `App:584-605` ships 6
    current plus an 18-entry backlist. The repo has 10 published, so **14 of those
    entries are fiction** — do not let a Feed or Archive build assume them.
18. **The politics lens pair cites 2031.** §3.8.

### 5.4 Where the handoff's migration plan is wrong for this repo

- **There is no phase for the pending release.** Its Phase 0 assumes a clean
  tree. See Phase −1.
- **Phase 0's "nothing should look different" is arithmetically false**, which
  destroys its own rollback guarantee. §4 Phase 0.
- **Phase 0 step 2 ("add Literata alongside") is a dead step** — the handoff's
  own later documents forbid Literata reaching the repo.
- **Phase 2 (typography) is void in its entirety** if the trio wins, which both
  later documents say it does.
- **Phase 3's "additive; existing MDX keeps rendering" contradicts the contract's
  "a figure missing any of them does not ship."** Both cannot hold. §4 Phase 3.
- **Phase 5 (app last) inverts this repo's deploy-order rule.** §4 Phase −1.
- **"Each phase is independently releasable and reversible" is false here** —
  `app/` has no `.env.local` on this box, so Phase 1's app-header swap and all of
  Phase 5 are compile-verified only.
- **The plan never mentions story mode, `src/lib/story.ts`, or the
  `ReadingGate`** — three repo systems it silently breaks.

---

## 6. Repo defects this audit surfaced that are worth fixing regardless

Independent of every revamp decision.

1. **Under 900px the site has no primary navigation at all.**
   `base.css:175-179` collapses at 900px and simply sets
   `.mh__links { display: none }` — there is **no** Menu button anywhere. The
   revamp happens to fix this.
2. **`--muted` fails WCAG AA on four of six worlds**, and space `--accent-deep`
   fails on its own ground. §2.
3. **`app/public/` does not exist**, so `AppLayout.astro:46`'s `/favicon.svg`
   404s in production today.
4. **`caption` and `source` are unvalidated** (`data: z.any()`), and 12 viz kinds
   render no source line — against `CANON.md:132`'s "No source, no section."
5. **`check:catalog` is not in the build**, and hides all but one error class per
   run.
6. **`scripts/social/cards.ts:34-35` locates fonts with a non-null assertion**,
   so renaming the Fraunces TTF kills `prebuild` and therefore every deploy,
   including on Vercel. `fetch-fonts.mjs` also writes `Fraunces-SemiBold.ttf`
   while the file on disk is `Fraunces_72pt-SemiBold.ttf`.
7. **There is no `vercel.json`**, so no `Cache-Control` is declared anywhere —
   and the revamp's riskiest surfaces are all cache-mediated.
8. **`catalog.md`'s STATUS note is stale** (claims 64 registered kinds against a
   body of 90), as are several prose counts.
9. **`type-v2.css` is not the single lever three documents claim.** The trio is
   declared independently at `type-v2.css:38`, `meta.css:39`, `intro.css:22` and
   `app.css:39`; two Astro-scoped component styles override all of them by
   specificity; and `IntroLayout.astro` never loads `type-v2.css` at all, so
   `/welcome` is outside the type system.

---

## 7. Change log

### 2026-08-18 — the prototype pass

All eight `.dc.html` files read and reconciled (10 agents). What changed:

**Resolved.** `--paper-warm` settled empirically with six measured values and
zero variance across 60 uses (§3.5) — the blocking decision for 20 of 28
components, answered with data instead of judgment. `--paper-deep` shown to be
*unmappable* because the prototypes define exactly one elevated surface per
world. The overlays' 24u dial confirmed sanctioned but not a presence tier
(§5.2/12). The seals confirmed **correct** and the README confirmed wrong on the
reversed cut (§5.2/13). The lore art located, in `Web.dc.html`, at 46px, with
three defects of its own (§5.2/14). The instrument count settled at **60
numbered (48 M + 12 L) plus 12 unnumbered S = 72 drawn**. The brand asset count
settled at 38. Archive depth settled at 24 — which is a *design target*: 14 of
its backlist entries are fiction against the repo's 10 published issues.

**RD-01 survives, amended twice** (RD-01a shared wrapper, RD-01b literal font
stack). The threat to it was always that the prototypes might prove the 28 kinds
need a different label architecture. They prove the opposite: the file that most
loudly asserts *"labels are HTML, geometry is SVG"* (`Components:108`) **breaks
its own rule 47 times** — on axis titles, tick labels, series labels, callouts,
and one rotated label. Per instrument the choice is clean: 28 obey, 16 use in-SVG
text, **0 mix**, and the 16 are exactly the tick-dense cases where HTML
positioning is worse. It is a two-primitive system and the repo already builds one
of the two. All six prototype accents are byte-identical to the repo's
`--w-accent` values, so no colour migration is implied either.

**Newly added.** §3.11, the three shipped systems the design contradicts (the
toolbar, story mode's surface and business model, and the total absence of a
reading gate from a design that is anonymous-first). Workstream B sized at 52–54
agent-days with B4 deferred (§4 Phase 4+) — **including B3, the six web pages,
which this plan had omitted entirely.** The app corrected from 11 screens to
**13**: `App:562` declares Link-expired and Sign-out, both absent from the repo,
both cheap, and Sign-out's four-row ledger is the best trust copy in the handoff.

**The contract is two tiers, never declared as such** — and this strengthens
Phase 3 rather than complicating it. Seven parts bind the 60 instruments
(`Components:96`); a **two-part floor**, caption + source, *"Never a graphic
without both"* (`Spec:172`), binds every other graphic. So promoting `caption`
and a structured `source` out of `data: z.any()` is not a down-payment on a
seven-part contract — **it is full compliance with the system's actual floor,
across all 118 kinds, for about half a day.** Even the top tier slips: 14 of 72
instruments have no separate readout, and 32 of 58 plain slots are static string
literals, so part 06's "rewritten as the reader moves the controls" is honoured by
roughly 21 of 29 controlled instruments.

**Two findings worth reading once, on their merits.** First: the spec's own
"what changed" says *"The old stack ran Zodiak, Erode, DM Mono and a per-topic
display face"* (`Spec:34`). None of those three faces exists in this repo — the
revamp measures its delta against a baseline that is not ours, which is the
cleanest single piece of evidence that RD-01's "build against existing repo canon"
is right on the merits rather than as a compromise. Second, bearing on RD-03: the
designer **never saw the locked mark** (zero references to it anywhere in the
handoff), yet Turn 2 of `Parallax Marks.dc.html` independently converged on its
construction — a vesica with an accent focus — and proposed it as the everyday
mark, before Turn 3 demoted it, blind, on this reasoning (`Marks:427`): *"A logo
is a form, not a lesson — nobody should have to read a seal to understand it, and
the story belongs in the sentence you tell about the mark, not inside the mark."*
That is not proof the locked mark is wrong. It is an independent, uninfluenced
argument against it, and it deserves one honest reading before the eventual
ruling — alongside the fact that the About-page closing line the design would
publish (*"four concentric circles, one dial position and one letter"*)
**miscounts its own mark**: there are three circles, and the r=113 occluder is
deliberately *eccentric* — that eccentricity is the crescent.

**Also newly known.** Accessibility has no authoritative home in the handoff:
zero hits across the spec for `aria`, `reduced`, `prefers`, `focus`, `keyboard`,
`WCAG` or `contrast`, while it specifies seven motion behaviours including an
infinite loop; and `Components` carries 0 `aria-live`, 0 `role=`, 0 `tabindex`
against **21 `onMouseEnter`/`onMouseLeave`** handlers — so **hover is an
undeclared fifth interaction verb** and four retrofits depend on it as their only
control. The repo's own fallback contract is stricter than anything in the handoff
and should simply outrank it. And on photography: the designer built against **two
real operator photographs** (`uploads/IMG-20180826-WA0029.jpg`,
`IMG-20180812-WA0028.jpg`, with authored captions and a per-world frame override),
contradicting the bundle's own claim that the plate frames are empty drop zones.
That `uploads/` directory is not in the handoff.

### 2026-08-17 — created

Proposal only; no code written. Based on a full read of the handoff bundle and a
20-agent codebase audit. One correction applied to the audit's own output: a
reviewer read the per-kind component estimates as *days* and reported ~190
agent-days for the 28 kinds. They are **hours** — 212h ≈ 26 agent-days. Any
cut-scope argument resting on the larger figure is void.
