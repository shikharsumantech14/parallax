# Issues — agent guide

> Local rules for `src/content/issues/<slug>/index.mdx` files. Read the
> root `AGENTS.md` first for project-level context.

---

## 1. The schema (source of truth: `src/content/config.ts`)

Every issue has frontmatter validated by Zod at build time. The full
shape:

```ts
{
  id: string;
  topic: 'politics' | 'space' | 'earth' | 'tech' | 'travel' | 'sports';
  title: string;                         // *italic* for one accent word
  hook: string;                          // social/SEO description
  dek: string;                           // sub-headline shown under hero
  publishedAt: Date;                     // YYYY-MM-DD
  status: 'draft' | 'review' | 'published';   // default 'draft'
  author?: string;                       // optional, no default; do not hardcode
  tags: string[];                        // default []
  readTimeMinutes?: number;
  primer?: string;                       // 80–420 chars (Zod-enforced)
  ogImage?: string;                      // deprecated/unused — kept optional so
                                         //   legacy MDX validates; do NOT set it.
                                         //   The site renders no raster cover art.
  story?: StoryBlock;                    // optional authored story-mode beats; see §13
  sections: Section[];                   // see §2
  sources: Source[];                     // see §3
}
```

**Only `status !== 'draft'` shows in the public archive and RSS feed.** Draft
issues still build into HTML routes at `/issues/<slug>/` (visible if you know
the URL), but are excluded from the index and feed.

---

## 2. Section schema

Every section conforms to:

```ts
{
  kind: SectionKind;          // must be one of SECTION_KINDS in config.ts
  number?: string;            // optional; auto-formatted via formatSectionLabel
  title?: string;             // *italic* for one accent word
  eyebrow?: string;           // ALL CAPS short label
  intro?: string;             // 1–3 sentences setting up the section
  skimCaption?: string;       // 90-sec-skim caption — ANY kind may carry one
                              // (2026-07-05; prose hides behind it in skim
                              // mode, viz kinds show it alongside — author one
                              // per viz so the skim rail reads complete)
  plain?: string;             // ≤220 chars, ZOD-ENFORCED — overshooting breaks
                              // the build (see §7). The "In plain terms" line:
                              // one sentence explaining the FORM of the viz
                              // ("each block is one seat…"), NEVER the data
                              // (that's the caption's job). Omit to fall back to
                              // the per-kind default in src/lib/explainers.ts.
  howToRead?: string;         // 40–360 chars, ZOD-ENFORCED (2026-08-27).
                              // The FORM at PARAGRAPH length, rendered ABOVE
                              // the graphic by core/Section.astro for EVERY
                              // kind (2026-09-04) — what a mark IS, what the
                              // axes mean, any inversion in the form. The ten
                              // VizCard kinds render theirs inside the card
                              // instead; a :has() rule in dataviz-v2.css hides
                              // Section's copy there, so a section shows exactly
                              // one panel. Omit to fall back to EXPLAIN[kind].how
                              // in src/lib/explainers.ts — the fallback is LIVE,
                              // so a panel renders either way; author one only
                              // where the default misleads (channel-ternary:
                              // distance FROM a corner = LOW use — readers get
                              // it backwards). Never a longer restatement of
                              // `plain`. On instrumented kinds (scaling-plot,
                              // xg-race, climate-spiral) the static reading
                              // LEADS and the control clause TRAILS: the
                              // controls are html.js-gated, the paragraph is not.
  caption?: string;           // TOP-LEVEL since 2026-08-27 — the DATA claim,
                              // one sentence, traceable ("214 bills went in and
                              // 47 came out"). The ONE comprehension field that
                              // SHOULD assert data; the verifier traces it.
                              // Legacy data.caption still works (SectionBody
                              // merges; authored data.* wins).
  source?: string | { label: string; date?: string };
                              // TOP-LEVEL since 2026-08-27. CANON §7: no
                              // source, no section. Since 2026-09-04 it renders
                              // ONCE, from core/Section.astro, as the second
                              // line of the "In plain terms" paragraph BELOW the
                              // graphic (`.px-plain__src`, literal text
                              // "Source · …"); object form joins to
                              // "Source · label · date". Components and VizCard
                              // render no source of their own any more
                              // (`.px-viz__src` is gone). The ⤢ study modal
                              // portals only the card, so it shows no source —
                              // ruled as-is. Legacy data.source still works.
  layout?: 'default'|'wide'|'bleed'|'split'|'split-flip'|'breath';
                              // geometry variant — rhythm rules in
                              // docs/design/CANON.md §3: ≤1 bleed per act,
                              // split ONLY for the issue's hero metaphor,
                              // never two loud sections adjacent
  data?: unknown;             // section-kind-specific shape; §11–§12 below,
                              // then src/components/AGENTS.md
  sourceRefs: string[];       // ids that must exist in this issue's sources[]
}
```

`SECTION_KINDS` is the source of truth for valid `kind` values. Current
count (2026-09-04): **97 kinds** — 31 originals, the 59-kind v2 interactive
library, and the seven Phase 3 revamp kinds. Earlier figures in this file
("63", "61", then "90") were right for their date and are superseded. Each
maps to a component dispatched by
`src/components/SectionBody.astro` (the switch; `SectionRenderer.astro` is
the article chrome around it) — see `src/components/AGENTS.md` for the full
table and `docs/design/catalog.md` for per-kind usage rules. `docs/design/catalog.md`
is kept 1:1 with `SECTION_KINDS`, in the same order, and `npm run check:catalog`
verifies that — run it yourself, it is **not** part of `npm run build`. The v2 kinds and their `data` shapes are in §11 (the 2026-06-03
set) and §12 (the 22 added 2026-07-14).

**`act-break` (2026-07-05)** — the chapter divider giving issues their act
structure (CANON.md §3: 2–4 acts per issue). `data: { act: 'II', title?,
epigraph? }`. Consumes no section number. Use at real structural pivots
only, not between every section.

---

## 3. Source schema

```ts
{
  id: string;                            // e.g. 'src-01'; referenced by sourceRefs
  title: string;
  publisher: string;
  url: string;                           // MUST be a valid URL (Zod URL check)
  accessedAt: string;                    // YYYY-MM-DD
  kind: 'primary' | 'secondary' | 'analysis';
  quote?: string;
}
```

**Build will fail if:** a source `url` is missing or malformed, or any
section's `sourceRefs[]` includes an id that isn't in `sources[]`.

---

## 4. Primer rules (80–420 chars, Zod-enforced)

The primer renders between Hero and the first section via `src/components/core/Primer.astro`.
It's the plain-English on-ramp for a reader who knows nothing about the
topic.

**Hard rules:**
- **Length: 80 ≤ chars ≤ 420.** Astro build fails on either side. Count
  characters before writing; do not estimate.
- **No acronyms.** First mention spelled out (e.g. "balance of payments,"
  not "BoP"). Even SEO-common acronyms.
- **No jargon.** If the word wouldn't appear in a kitchen conversation,
  reword.
- **No em-dashes.** Use commas and full stops only. The primer is a
  bridge into the issue, not part of the rhetorical voice.
- **Ends with a forward gesture.** Examples that work: *"This piece asks
  why."* / *"Here is what the data shows."* / *"This is the system underneath."*

The drafter agent has the primer step at Step 2.5 of its instructions
(`.claude/agents/drafter.md`). It estimates length poorly; verify before
finalising.

---

## 5. SkimCaption rules

The site has two reading modes (the Full/Skim segmented control in
`core/ReadingToolbar.astro` toggles `#px-article[data-mode]` between `full`
and `skim`; it replaced the old `SkimToggle.astro`).

In skim mode:
- Prose sections are hidden (their `.px-prose-full` div has `display: none`).
- Their `skimCaption` shows instead, in a `.px-skim-caption-block`.
- All other section kinds (timeline, data-readout, paradox, etc.) stay
  visible — those *are* the skimmable structural surface — and (2026-07-05)
  any of them may ALSO carry a `skimCaption`, shown alongside in skim mode.

**Rules:**
- `skimCaption` on `kind: prose` = the replacement text (mandatory if the
  prose carries structural weight). On any other kind = a one-line summary
  next to the visible viz (author one per viz section so the skim rail reads
  as a complete 90-second edition — rendered by `SectionRenderer.astro`).
- 1–3 sentences (one for viz kinds). The job: "if someone reads only the
  skim view, what does this section contribute structurally?"
- Should be readable as a standalone caption, not a paraphrase of the
  prose paragraphs. Don't duplicate the `plain` line (plain = how to READ
  the form; skimCaption = what this section SAYS).

---

## 6. The `*italic*` and `**bold**` markers

Used inside `title`, `intro`, paragraph text, and some structured fields:

- `*text*` renders as `<em>` (italic accent). Used for one accent word in
  titles: `The *Architecture* of Every Crisis`.
- `**text**` renders as `<strong>` (bold). Used in timeline event labels,
  paradox statements, occasional paragraph emphasis.

Renderers: `renderEmphasis` and `renderInline` in `src/lib/text.ts`. Do
not paste literal `<em>` / `<strong>` tags into MDX frontmatter — use the
markdown markers.

---

## 7. Common build errors (and the fix)

| Error | Cause | Fix |
|---|---|---|
| `String must contain at most 420 character(s) at "primer"` | Primer over 420 chars | Tighten the primer. Count actual chars; do not estimate from word count. |
| `Invalid url at "sources.N.url"` | Mock or malformed URL | Use real URLs only, even in drafts. |
| `Invalid enum value at "sections.N.kind"` | Unregistered section kind | Use only kinds in `SECTION_KINDS` (config.ts). |
| `Expected ")" but found "{"` in build | Sibling JSX returned from `.map()` without a Fragment wrapper | Wrap siblings in `<>...</>`. |
| Climate strip renders as 3-column flex | Used `.px-strip` instead of `.px-cstrip` | `px-strip` is owned by TopicStrip; ClimateStrip must use `px-cstrip`. |
| Author "By Shikhar Sharma" appears | Hardcoded name | Remove. Set `author:` in frontmatter only if you want the byline. |
| `String must contain at most 220 character(s) at "sections.N.plain"` | `plain` line over 220 chars | Tighten it. **This broke the build twice on 2026-07-14** — the cap is easy to blow because a `plain` line that runs long is usually a caption in disguise. `plain` names the FORM in one sentence; move anything about the DATA into `caption`. |
| `city-grid: expected 1–3 cities, got N` | More than three orientation roses on one plate | Split into two `city-grid` sections. |
| `city-grid: city "X" has N bins; the 36-bin rule requires EXACTLY 36` | Street-orientation histogram not binned to 10° sectors | Rebin to exactly 36 values, one per 10° compass sector. |
| `season-wheel: expected EXACTLY 12 months (Jan→Dec), got N` | Partial year | The wheel is a calendar year; supply all twelve `months[]` entries. |
| Component arity throws (`chip-die` 4–24 blocks · `moore-ladder` ≥6 points · `packet-trace` 1–8 hops · `altitude-oxygen` 2–8 stops · `fare-terrain` 1–5 routes, ≥6 points each · `ballot-flow` ≥2 candidates + ≥2 rounds) | Data outside the kind's legible range | These are deliberate legibility contracts, not bugs. Split the data across sections, or pick the kind the blueprint points you to (e.g. `moore-ladder` → `scaling-plot` for a narrow range). |
| Conservation throws (`carbon-loop` reservoir "does not conserve" · `ballot-flow` "books don't balance" / transfers ≠ tally · `gerrymander-lens` "same votes guarantee is broken" / unequal population / non-contiguous district · `power-flow` via-node imbalance) | The authored numbers don't add up | Fix the data. `carbon-loop` alone has an escape hatch — `imbalance: 'the-point'` licenses a residual on the single `accent: true` reservoir when the imbalance *is* the story. It is not a blanket amnesty. |

---

## 8. The `# EDITOR:` flag convention

When the drafter or researcher encounters a claim that can't be fully
verified from primary sources, it inserts an inline comment:

```yaml
note: "Indira Gandhi reportedly donates 367 grams. # EDITOR: 367g figure
       traces to a 2009 MoD book via non-allowlisted source — verify
       before publish or remove specific figure."
```

These are YAML comments — they don't affect the build but they're visible
to the next human reader. **Every `# EDITOR:` flag must be resolved
before flipping `status: draft → published`.** Either verify and remove
the flag, or remove the specific claim.

---

## 9. New-issue scaffolding

```bash
npm run new-issue       # scripts/new-issue.mjs
```

Creates a dated slug folder under `src/content/issues/` with the
`_template/index.mdx` frontmatter pre-filled. Edit from there.

Naming: `YYYY-MM-DD-kebab-slug` (date prefix + 2–6 word slug). The slug
becomes the public URL: `/issues/<slug>/`.

---

## 10. Existing issues (voice reference)

The drafter agent reads these two for voice calibration:

1. `2026-04-24-delimitation/index.mdx` — primary reference (politics,
   bill-defeat structural argument).
2. `2026-04-24-kessler-cascade/index.mdx` — secondary reference (space,
   data-driven scale and consequence).

If you're writing a new issue manually (not via the drafter agent), open
both before starting. Voice consistency matters more than feature parity.

---

## 11. v2 3D / interactive section kinds (2026-06-03)

The first wave of the v2 interactive library — thirty kinds shipped
2026-06-03, plus the three politics/space additions from the 2026-07-05 canon
pass (`chamber`, `power-flow`, `solar-system`), so 33 entries below. Some
are lazy WebGL scenes (marked **WebGL** — they load Three.js only when
scrolled into view; everything else is CSS-3D or animated SVG/canvas). The
rendering architecture is in `src/components/AGENTS.md` §10; here is only
what an issue author needs — the `kind` and the `data` shape. **The 22 kinds
added 2026-07-14 are in §12.**

**Two universals for every kind in §11 and §12:**
- Every one also accepts `caption?` and `source?` (same as the other viz).
  Sole exception: `eclipse-cone`, whose citation field is `sourceCite` (§12).
- Every one renders a static SVG/HTML fallback with no JS / under
  `prefers-reduced-motion`, so the section is always meaningful.

**Canonical examples.** The six
`src/content/issues/2026-06-03-<world>-showcase/index.mdx` issues exercise
each world's v2 kinds with real `data`. They are `status: draft` —
URL-viewable at `/issues/2026-06-03-<world>-showcase/` but unlisted (excluded
from the archive + RSS). Copy a section out of the matching showcase as a
starting point.

**Gap, stated honestly.** Four of the six per-world FLAGSHIP kinds have no
shape entry below: `terrain-relief` (earth), `neural-flow` (tech),
`terminator-globe` (travel), `flight-of-the-ball` (sports). Their contracts
live in `docs/design/blueprints/<world>/<kind>.md`, their prop names are
readable off the dispatch in `src/components/SectionBody.astro`, and each has
a worked section in its world's showcase issue. The other two flagships,
`chamber` and `solar-system`, are documented below.

### politics
- **`coalition-orbit`** (WebGL) — `{ parties[]{ name, seats, color?, bloc? }, totalSeats? }`
- **`swing-dial`** — `{ leftLabel?, rightLabel?, value(-100..100), markers?[]{ at, label } }`
- **`bill-passage`** — `{ stages[]{ label, status: 'passed'|'failed'|'pending'|'current', date?, note? } }`
- **`vote-flow`** — `{ blocs[]{ name, seats, color?, vote: 'for'|'against'|'abstain' }, outcome?{ label, passed } }`
- **`margin-ladder`** — `{ rows[]{ label, margin, winner?, color? } }`
- **`chamber`** (WebGL · FLAGSHIP) — `{ chamber?{ rows?, arcDeg? }, parties[]{ name, seats, color?, side?: 'gov'|'opp'|'cross', short? }, majority?, division?{ label?, aye{party→n}, no{party→n} } }` — blueprint: `docs/design/blueprints/politics/chamber.md`
- **`power-flow`** — `{ nodes[]{ id, label, group?: 'source'|'via'|'sink' }, links[]{ from, to, value, note? }, unit, imbalance?: 'the-point' }` — conservation is build-enforced; blueprint: `docs/design/blueprints/politics/power-flow.md`

### space
- **`orbit-globe`** (WebGL) — `{ orbits[]{ name, altKm, inclDeg?, color?, satCount? }, maxAltKm? }`
- **`trajectory-arc`** — `{ phases[]{ label, altKm, downrangeKm, note? }, apoapsisKm? }`
- **`delta-v-ladder`** — `{ segments[]{ label, dv, color? }, unit? }`
- **`signal-readout`** — `{ bands[]{ label, freq, value, max?, color? } }`
- **`descent-profile`** — `{ points[]{ t, altKm, phase? }, events?[]{ t, label }, craftLabel? }`
- **`solar-system`** (WebGL · FLAGSHIP) — `{ epoch, planets?['mercury'…], bodies?[]{ name, a_AU, e, i_deg, Omega_deg, omega_deg, M0_deg, period_d, role?: 'focus', note? }, scale?: 'log'|'true', trailDays? }` — blueprint: `docs/design/blueprints/space/solar-system.md`

### earth
- **`data-globe`** (WebGL) — `{ markers[]{ name, lat, lon, value, color? }, unit? }`
- **`core-sample`** — `{ layers[]{ depth, label, value?, color? }, unit? }`
- **`sea-level-tank`** — `{ levels[]{ label, riseM, year? }, landmarks?[]{ name, heightM }, maxM? }`
- **`climate-spiral`** — `{ months[]{ year, month(1-12), value }, unit?, baseline? }`
- **`quake-depth`** — `{ quakes[]{ date, depthKm, mag, place? } }`

### tech
- **`arch-stack`** — `{ layers[]{ label, sublabel?, color? } }`
- **`latency-waterfall`** — `{ spans[]{ label, start, dur, kind? }, unit? }`
- **`version-graph`** — `{ nodes[]{ id, parents?[], label?, tag?, lane? } }`
- **`scaling-plot`** — `{ points[]{ x, y, label? }, xLabel?, yLabel?, logX?, logY?, fit? }`
- **`throughput-dial`** — `{ value, max, unit?, label?, zones?[]{ from, to, label? } }`

### travel
- **`route-globe`** (WebGL) — `{ stops[]{ city, lat, lon, note? } }`
- **`elevation-trek`** — `{ points[]{ km, elevM, label? }, unit? }`
- **`itinerary-reel`** — `{ days[]{ day, place, items?[] } }`
- **`climate-calendar`** — `{ months[]{ month, temp?, rainfall?, note? }, tempUnit? }`
- **`timezone-arc`** — `{ zones[]{ city, offset }, refOffset? }`

### sports
- **`tactics-pitch`** — `{ players[]{ x(0-100), y(0-100), num?, name?, role? }, formation?, team? }`
- **`shot-map`** — `{ shots[]{ x, y, xg, outcome: 'goal'|'saved'|'miss'|'blocked' } }`
- **`xg-race`** — `{ events[]{ minute, team: 'home'|'away', xg }, home?, away? }`
- **`momentum-wave`** — `{ points[]{ minute, value(-100..100) }, events?[]{ minute, label, team? }, home?, away? }`
- **`player-card`** (CSS-3D flip) — `{ name, position?, team?, rating, stats[]{ label, value, max? } }`

---

## 12. Breadth kinds — the 22 added 2026-07-14

The P6 component-breadth pass added twenty-two more kinds, taking
`SECTION_KINDS` to **90**. Four are lazy WebGL scenes (marked **WebGL**);
the rest are build-time SVG or CSS-3D. The two universals from §11 apply to
all of them, bar the `eclipse-cone` citation-field exception noted below.

Each kind's full contract — the honesty rules, the geometry, and the exact
data a researcher must source (the catalog's `DATA:` line, plus a
`RESEARCHER MUST CAPTURE` note on some blocks) — is in
`docs/design/blueprints/<world>/<kind>.md`. When to reach for it (and when
not to) is in `docs/design/catalog.md`.

**Worked examples.** Every one of the 22 has a real-data section in the
matching `src/content/issues/2026-06-03-<world>-showcase/index.mdx`. Copy
from there rather than writing `data` from scratch — the shapes below are
sketches, the showcase sections are the reference implementation.

**One dispatch exception.** `coalition-calculus` is dispatched with a spread
— `<CoalitionCalculus {...data} />` in `SectionBody.astro` — so it reads its
props FLAT off `data`. Every other kind has its props named explicitly.
Authoring is unaffected (the `data:` block looks identical); it matters only
if you rename the component's props.

### earth
- **`plate-motion`** (WebGL) — `{ plates[]{ name, pole{ lat, lon, omega }, color?, samples?[]{ lat, lon }, bbox?[lonW,latS,lonE,latN] }, boundaries?, maxVel_mmyr? }` — `boundaries` defaults to `/geo/plates.json` (checked in at `public/geo/plates.json`). `omega` is the Euler rotation rate; the velocity field is derived, never authored.
- **`atmosphere-column`** — `{ maxAlt_km?, model?: 'lapse'|'isothermal', landmarks?[]{ name, alt_km, note? }, showOxygen?, logAlt? }` — the printed O₂ value uses whichever `model` draws the curve.
- **`carbon-loop`** — `{ unit?, reservoirs[]{ id, label, stock, x, y, role?: 'store'|'source'|'sink', accent? }, fluxes[]{ from, to, value, note? }, imbalance?: 'the-point', residualLabel?, cycle?, year? }` — `unit` defaults to `GtC`; `x,y` place the box on the diagram. Every `role: 'store'` must balance within 1% or the build throws naming it (§7).
- **`storm-track`** (WebGL) — `{ storms[]{ name, fixes[]{ t, lat, lon, wind_kt, landfall? } }, windScale?, smooth? }` — Saffir–Simpson category is DERIVED from `wind_kt`; never author it.

### space
- **`constellation-swarm`** (WebGL) — `{ shells[]{ name, altKm, inclDeg, count, color?, planes?, raanSpread? }, epoch?, spin? }`
- **`lagrange-map`** — `{ primary{ name, mass }, secondary{ name, mass }, separationKm?, markers?[]{ at: 'L1'…'L5', label }, show?: ['L1'…'L5'] }` — `mass` is relative (any consistent unit); only the ratio is used.
- **`transfer-window`** — `{ central{ name, mu }, from{ name, radiusKm, periodDays? }, to{ name, radiusKm, periodDays? }, distanceUnit?: 'AU'|'km' }` — Δv and transfer time are computed from `src/scripts/viz3d/kepler.ts`; don't author them.
- **`eclipse-cone`** — `{ source{ name, radiusKm }, occulter{ name, radiusKm, distanceFromSourceKm }, target{ name, radiusKm, distanceFromOcculterKm, distanceRangeKm?[min,max] }, showPenumbra? }` — **the citation field here is `sourceCite`, not `source`**: `source` is the light SOURCE (the Sun). The one kind that breaks the §11 universal.

### politics
- **`coalition-calculus`** — `{ majority?, parties[]{ name, short?, seats, color?, locked? }, preset?: string[] }` — `locked` carries the sourced one-line reason nobody will govern with them. `preset` lists the parties in the opening coalition and matches on `name` (not `short`); it defaults to the largest unlocked party. `majority` defaults to ⌈(Σ seats + 1) / 2⌉; declaring a different one prints an honesty chip. Dispatched with a spread (above).
- **`gerrymander-lens`** — `{ grid{ cols, rows, perCell, a[cols·rows] }, parties{ a{ name, short?, color? }, b{ … } }, plans[]{ label, districts[cols·rows], note? }, flagPct? }` — `a[]` is party-A votes per cell, `districts[]` a district id per cell, `flagPct` defaults to 7. Build throws on length mismatch, unequal district population, a non-contiguous district, or a plan whose A-tallies don't re-sum to the shared statewide total.
- **`ballot-flow`** — `{ candidates[]{ id, name, short?, color? }, rounds[]{ tallies{ <candidateId>: n }, exhausted?, eliminate?{ id, transfers[]{ to, value } } }, winnerId?, majorityBasis?: 'continuing'|'firstRound' }` — the component RENDERS a precomputed count, it never runs the election. Needs ≥2 candidates and ≥2 rounds; transfers must sum to the eliminated candidate's tally and Σ tallies + exhausted must hold constant across rounds.

### tech
- **`packet-trace`** (WebGL) — `{ hops[]{ from, fromLat, fromLon, to, toLat, toLon, rttMs, kind?: 'fiber'|'wireless'|'satellite'|'compute', note? }, originLabel?, refractiveIndex?, loopMs? }` — 1–8 hops. Shared geometry lives in `src/scripts/viz3d/packet.ts`, imported by both the component and its scene, so the fallback and the globe agree.
- **`queue-cliff`** — `{ muPerSec | serviceMs, startRho?, maxRho?, annotations?[]{ rho, label, tone?: 'ok'|'hot' } }` — supply one of `muPerSec` / `serviceMs`.
- **`chip-die`** — `{ chip, dieAreaMm2?, blocks[]{ label, areaMm2? | pct?, group?: 'compute'|'memory'|'io'|'media'|'other', primary?, note?, count? } }` — 4–24 blocks; each needs a resolvable area (`areaMm2`, or `pct` plus `dieAreaMm2`). Tile pixel area is real mm², so bad areas are a visible lie.
- **`moore-ladder`** — `{ points[]{ year, count, label, highlight? }, yLabel?, unit?, fit?, fitRange?[from,to] }` — ≥6 points; `yLabel` defaults to "transistors per chip".

### travel
- **`city-grid`** — `{ cities[]{ name, subtitle?, bins[36], orderScore? } }` — **1–3 cities, EXACTLY 36 bins each** (one per 10° compass sector). Both are hard build throws (§7). `orderScore` (Boeing φ, 0–1) is computed if absent.
- **`altitude-oxygen`** — `{ stops[]{ name, elevM, nights?, note? }, maxElevM?, model?: 'lapse'|'isothermal', seaLevelO2Pct? }` — 2–8 stops.
- **`season-wheel`** — `{ place, months[12]{ climate?, crowd?, price?, label? }, rings?: ['climate'|'crowd'|'price'], sweetSpot?: number[] }` — EXACTLY 12 months, Jan→Dec. `sweetSpot` is 0-based month indices (0–11); computed if omitted.
- **`fare-terrain`** — `{ routes[]{ label, points[]{ daysBefore, fare }, highlight? }, unit?, sweetSpotDays?[from,to] }` — 1–5 routes, ≥6 fare samples each.

### sports
- **`elo-river`** — `{ model, kInfo?, dates[], baseline?, teams[]{ name, short?, color?, ratings[], subject? } }` — `model` NAMES the rating system (honesty rule, required). `ratings[]` is index-aligned to `dates[]`; `null` = not yet rated. `baseline` defaults to 1500.
- **`court-value`** — `{ surface?: 'football-box'|'football-half'|'basketball-half', model, valueLabel, valueRange?[min,max], grid?{ cols, rows, values[cols·rows] }, shots?[]{ x, y, value }, levels?, showShots?, smoothed? }` — `model` and `valueLabel` (≤3 words) are the only required fields: the surface must say what it measures. Supply **exactly one** of `grid` (pre-binned, preferred) or `shots` — if both are given, `grid` wins. `x,y` are the ShotMap 0–100 pitch coords.
- **`pace-ridge`** — `{ metric?, unit?, source_n?, stat?: 'mean'|'median', domain?[min,max], groups?[]{ label, samples[], subject? } }` — every field is technically optional (the component defaults `metric` to `'value'` and renders nothing useful without `groups`), so treat `metric`, `unit` and `groups` as required *in practice*. `samples[]` is the raw observation array (the KDE is computed at build). The blueprint asks for 2–7 groups, top→bottom, ~15+ observations each, one carrying `subject: true`; unlike the arity rules in §7 this one is **not** enforced by a throw.

---

## 13. Story-mode frontmatter (`story`) — optional

Story mode (`/s/<slug>/`) builds for every issue with `status !== 'draft'`
— ten issues today. By default `src/lib/story.ts` DERIVES the beats from the
issue itself: it ranks sections by a per-kind visual-priority table and pulls
text from `skimCaption` / `intro` / `title`. An optional `story` block
overrides that with hand-authored beats in the social voice
(`research/_voice/_voice-social.md`):

```yaml
story:
  hook: "…"            # ≤220 chars — replaces frontmatter `hook` on the cover card
  beats:               # 3–6 beats; omit the block to keep the derived selection
    - section: 4       # 0-based index into sections[]
      text: "…"        # 40–320 chars — the ~60-word beat
      kicker: "…"      # ≤80 chars, optional
  cta: "…"             # ≤160 chars, optional
```

Every length above is Zod-enforced in `config.ts`. Spec:
`docs/design/STORY-MODE-SPEC.md`.

**When to author beats instead of deriving them.** Derivation ranks by
visual strength, so a viz-rich issue usually reads fine untouched. A
prose-heavy one does not: text-heavy narrative kinds (comparison, paradox,
timeline) still render taller than a card and fall back to the
spec-sanctioned 62dvh internal scroller. Hand-picking three to six viz beats
is the real fix, and it is an editorial act, not a code change — the
asteroid flagship does it this way.

**The six `2026-06-03-<world>-showcase` issues are `status: draft`, so they
have no story page.** They are viz reference, not story reference.

---

## 14. The comprehension fields — who says what (2026-08-27, render sites updated 2026-09-04)

| Field | Carries | Renders | Length | Verifier |
|---|---|---|---|---|
| `howToRead` | the FORM, paragraph | ABOVE the graphic, from `core/Section.astro` for every kind; `EXPLAIN[kind].how` is the LIVE fallback when omitted. The ten VizCard kinds (bill-funnel, age-pyramid, margin-bullets, state-timeline, attrition-waffle, finish-interval, channel-ternary, scaling-plot, xg-race, climate-spiral) render it inside the card instead — a `:has()` rule hides Section's copy, so a section shows exactly ONE panel | 40–360 | flags data-assertion (PLAIN-CLAIM) and `plain` restatement (REDUNDANT-HOWTO) |
| `plain` | the FORM, one sentence | BELOW the graphic, the "In plain terms" paragraph from `core/Section.astro` | ≤220 | flags data-assertion (PLAIN-CLAIM) |
| `caption` | **the DATA — the finding** | with the figure (VizCard's caption row, or the component's own `__cap`) | one sentence | **traced to the dossier**; flags form-only captions (CAPTION-FORM) |
| `source` | the citation | BELOW the graphic as the plain paragraph's SECOND LINE — `.px-plain__src`, literal "Source · …" — from `core/Section.astro` for every kind. Components render none; the ⤢ modal shows none (ruled as-is) | free | CANON §7: no source, no section |

**Instrumented kinds (`scaling-plot` LOG/LINEAR toggle, `xg-race` minute scrub,
`climate-spiral` month scrub — 2026-09-04).** The controls are `html.js`-gated;
the paragraph is not. So in `howToRead` the static reading LEADS and the
control clause TRAILS ("…Press Linear for the proportional view…"), and the
`caption` must not name a projection the reader can flip — the published
token-bill caption dropped its trailing "· log scale" for exactly that
CAPTION-FORM reason. The `data` shapes in §11 are unchanged: the toggle and
scrubs are derived at build, never authored.

Issues may also carry an optional top-level `voice:` — the DOMINANT rhetorical
mode (one of the eight, e.g. `FORENSIC`), authored by the stylist for the fact
grid's fourth cell. Omit rather than guess; the grid drops to three cells.

Do NOT add captions to `paradox`/`timeline` sections whose `intro` already
states the finding — that duplication is exactly what REDUNDANT flags exist to
catch (ruled 2026-08-28; see REVAMP-PLAN §0).

## Change log

### 2026-09-04 — Shell adoption: render sites for `howToRead` / `source` moved to Section
Phase 6.1 changed WHERE two schema fields render, not their meaning. `source`
(§2, §14) now renders once, from `core/Section.astro`, as the second line of
the "In plain terms" paragraph below the graphic — `.px-plain__src`, literal
"Source · label · date" — for every kind; the seventy per-component emitters
and `.px-viz__src` are gone, VizCard accepts the prop but renders nothing,
and the ⤢ modal shows no source (ruled as-is). `howToRead` (§2, §14) now
renders ABOVE the graphic from Section for every kind, with
`EXPLAIN[kind].how` as the LIVE fallback — before this an authored
`howToRead` on any of the 87 non-VizCard kinds was silently dropped; the ten
VizCard kinds render it in-card and a `:has()` rule keeps it to one panel per
section. New authoring rule for the three instrumented kinds (`scaling-plot`
log/linear toggle, `xg-race` minute scrub, `climate-spiral` month scrub):
static reading leads, control clause trails, and the caption must not name a
projection the reader can flip (the published token-bill caption lost its
"· log scale"). `data` shapes in §11 are unchanged. §2's kind count corrected
90 → **97** (it had been stale since the Phase 3 waves). CANON §10 now calls
this the four-layer stack — its amendment is a marked DRAFT awaiting the
operator's signature.


### 2026-07-14 — Breadth kinds (+22), story frontmatter, arity/conservation throws
Added §12: the 22 kinds from the P6 component-breadth pass and their `data`
shapes, read off the components' own `Astro.props` (four WebGL —
`plate-motion`, `storm-track`, `constellation-swarm`, `packet-trace`; the rest
build-time SVG/CSS-3D). `SECTION_KINDS` went 68 → **90**; the "61 kinds" figure
in §2 was already wrong and is corrected, with a pointer to `npm run
check:catalog`, which holds `docs/design/catalog.md` 1:1 with `SECTION_KINDS`.
Added §13 for the optional `story` frontmatter block (story mode derives beats
unless you author them), and listed `story?` in the §1 shape. Two authoring
traps now documented explicitly: `coalition-calculus` is the one kind
dispatched with a spread (flat props off `data`), and `eclipse-cone` cites via
`sourceCite` because its `source` is the light source. §7 gained six rows — the
Zod-enforced 220-char `plain` cap (it broke the build twice this session), the
two `city-grid` throws (1–3 cities, exactly 36 bins), `season-wheel`'s
12-month throw, the grouped component-arity family, and the conservation family
(`carbon-loop` / `ballot-flow` / `gerrymander-lens` / `power-flow`). Also
recorded honestly: §11 still has no shape entry for four flagship kinds
(`terrain-relief`, `neural-flow`, `terminator-globe`, `flight-of-the-ball`) —
their contracts are in `docs/design/blueprints/`. All 22 new kinds have worked
sections in the six `2026-06-03-<world>-showcase` issues. Everything described
here landed in-repo on 2026-07-14 and was **uncommitted** at the time of
writing — the operator commits; check `git status` before assuming it shipped.

### 2026-06-03 — v2 3D / interactive section kinds
Added §11: the 30 new v2 3D / interactive section kinds (5 per world) and
their `data` shapes, for issue authors and the drafter. `SECTION_KINDS` went
33 → 63. Noted the six `2026-06-03-<world>-showcase` draft issues as the
canonical worked examples (URL-viewable, unlisted). Rendering architecture is
in `src/components/AGENTS.md` §10.

### 2026-05-20 — File created
Initial version. Captures schema, primer + skimCaption rules, source
constraints, common build errors, EDITOR-flag convention.
