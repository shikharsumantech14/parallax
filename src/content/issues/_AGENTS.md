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
  plain?: string;             // ≤220 chars — the "In plain terms" line: one
                              // sentence explaining the FORM of the viz ("each
                              // block is one seat…"), NEVER the data (that's
                              // the caption's job). Omit to fall back to the
                              // per-kind default in src/lib/explainers.ts.
  layout?: 'default'|'wide'|'bleed'|'split'|'split-flip'|'breath';
                              // geometry variant — rhythm rules in
                              // docs/design/CANON.md §3: ≤1 bleed per act,
                              // split ONLY for the issue's hero metaphor,
                              // never two loud sections adjacent
  data?: unknown;             // section-kind-specific shape; see src/components/AGENTS.md
  sourceRefs: string[];       // ids that must exist in this issue's sources[]
}
```

`SECTION_KINDS` is the source of truth for valid `kind` values. Current
list (**61 kinds** — the older "63" figure was wrong) is exported from
`src/content/config.ts`. Each maps to a component dispatched by
`src/components/SectionBody.astro` (the switch; `SectionRenderer.astro` is
the article chrome around it) — see `src/components/AGENTS.md` for the full
table and `docs/design/catalog.md` for per-kind usage rules. The 30 v2 3D /
interactive kinds and their `data` shapes are in §11 below.

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

Thirty new section kinds, five per world, in the v2 design language. Four are
lazy WebGL scenes (marked **WebGL** — they load Three.js only when scrolled
into view; everything else is CSS-3D or animated SVG/canvas). The rendering
architecture is in `src/components/AGENTS.md` §10; here is only what an issue
author needs — the `kind` and the `data` shape.

**Two universals for all 30:**
- Every one also accepts `caption?` and `source?` (same as the other viz).
- Every one renders a static SVG/HTML fallback with no JS / under
  `prefers-reduced-motion`, so the section is always meaningful.

**Canonical examples.** The six
`src/content/issues/2026-06-03-<world>-showcase/index.mdx` issues exercise
each world's five kinds with real `data`. They are `status: draft` —
URL-viewable at `/issues/2026-06-03-<world>-showcase/` but unlisted (excluded
from the archive + RSS). Copy a section out of the matching showcase as a
starting point.

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

## Change log

### 2026-06-03 — v2 3D / interactive section kinds
Added §11: the 30 new v2 3D / interactive section kinds (5 per world) and
their `data` shapes, for issue authors and the drafter. `SECTION_KINDS` went
33 → 63. Noted the six `2026-06-03-<world>-showcase` draft issues as the
canonical worked examples (URL-viewable, unlisted). Rendering architecture is
in `src/components/AGENTS.md` §10.

### 2026-05-20 — File created
Initial version. Captures schema, primer + skimCaption rules, source
constraints, common build errors, EDITOR-flag convention.
