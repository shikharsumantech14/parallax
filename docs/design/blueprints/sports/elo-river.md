# Blueprint — `elo-river` (sports · SVG · the longitudinal streamgraph)

> A season (or an era) of teams' strength drawn as a braided river — each team
> a ribbon whose vertical thickness is its Elo rating, stacked into a
> streamgraph so the whole field's shape and every crossover read at once. The
> ribbons weave; the ones that climbed rise to the top of the braid. "The
> table, unrolled into time."

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `elo-river` |
| World | sports |
| Tier | SVG (build-time layout in the component frontmatter; CSS/`html.js`-gated reveal; no three.js, no runtime layout) |
| Component | `src/components/topic/sports/EloRiver.astro` |
| CSS prefix | `px-eriv` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `power-flow` (build-time SVG geometry + `html.js`-gated reveal + single-accent thickness-does-the-talking discipline) · `ClimateSpiral.astro` (build-time path geometry + `sweep` reveal) · `XgRace.astro` (two-line cumulative sports SVG, the nearest existing kind) |

## 2. What it shows / when to use

How a set of teams' ratings moved over a season/era relative to each other —
who rose, who collapsed, and exactly when the order changed — as one woven
streamgraph rather than a spaghetti line chart.

- **USE WHEN:** the dossier has a **rating time series** — ≥3 and ≤10 teams,
  each with ≥6 dated Elo (or SPI / power-ranking) values over the same window,
  from a named model. The *relative* rise/fall and the crossovers are the story.
- **DON'T USE:** current standings as a snapshot table (→ `league-table`); one
  match's momentum (→ `momentum-wave`); two teams' cumulative xG within a match
  (→ `xg-race`); a single team's multi-axis profile (→ `player-radar`); raw
  win/loss margins ranked (→ `margin-ladder`, politics, cross-world). If there
  is no *rating* (just points or wins), it is a `league-table`, not this.
- **Pairs with:** `wide`; hero-capable for season-arc / dynasty issues. Not
  `split` (no interaction to scroll-drive — it is a static plate). Not `bleed`
  before section 2 (CANON §3).

## 3. Data schema

```ts
interface EloRiverData {
  model: string;         // the rating system NAMED (honesty — Elo is a model, not truth):
                         // "FiveThirtyEight SPI" | "World Football Elo" | "Chess Elo".
                         // Renders in the source row; REQUIRED (no model, no section).
  kInfo?: string;        // the K-factor / update rule, ≤ 10 words, e.g. "K = 20, MoV-adjusted".
                         // Renders as the mono chip `K = {…}` (methodological honesty, CANON §7).
  dates: string[];       // ISO dates, ascending, the shared x-axis ticks (6–40). Every team
                         // provides a value per date (nulls interpolated linearly, flagged §4).
  teams: Array<{
    name: string;
    short?: string;      // ≤ 4-char bracket tag "[ARS]", default first 3 letters upper
    color?: string;      // team color — DATA-ENCODING EXEMPTION (CANON §6, same rule as
                         // `chamber`/`coalition-calculus`). >2 distinct colors is allowed here
                         // because each ribbon is a labelled data series (the rivalry-pair
                         // rule relaxes for a full field; the legend states every color).
    ratings: Array<number | null>;   // same length as `dates`; null = no rating that date.
    subject?: true;      // at most ONE — the ribbon this issue follows; volt + label emphasis.
  }>;
  baseline?: number;     // rating drawn as the neutral centerline reference, default 1500
                         // (standard Elo mean). Shown as a faint mono `1500 avg` gridline.
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Premier League title race 2015-16, monthly World-Football-Elo, illustrative)
model: "World Football Elo"
kInfo: "K = 20, margin-adjusted"
dates: ["2015-08-01","2015-10-01","2015-12-01","2016-02-01","2016-04-01","2016-05-15"]
baseline: 1500
teams:
  - { name: "Leicester City", short: "LEI", subject: true,
      ratings: [1622, 1651, 1702, 1748, 1791, 1812] }
  - { name: "Arsenal", short: "ARS",
      ratings: [1802, 1808, 1799, 1781, 1770, 1762] }
  - { name: "Tottenham", short: "TOT",
      ratings: [1738, 1760, 1781, 1799, 1803, 1795] }
  - { name: "Man City", short: "MCI",
      ratings: [1824, 1818, 1802, 1788, 1779, 1771] }
caption: "Leicester's ribbon climbs from the bottom of the braid to the top — a 190-point rating swing no model had them making."
source: "World Football Elo Ratings, 2015-16 season"
```

**Data flags with visual consequences (CANON §7):**
- `kInfo` present → the mono chip `K = {kInfo}` in the caption row (the update
  rule is a modelling choice and must be visible).
- Any interpolated `null` gap → the ribbon is drawn **hollow** (fill @ 0.4× its
  normal opacity, no dashed edge) across that span, and the caption row appends
  the chip `dashed spans interpolated` **only if any null exists** (never claim
  data you don't have).
- The rating scale is **not** truncated deceptively. A centered streamgraph has
  **no honest single horizontal rating axis** (vertical position is stack order +
  wiggle, not absolute rating — see §4), so there is no y-domain and no baseline
  gridline to draw; instead the streamgraph's floor `rFloor = min(all non-null
  ratings) − 20` (§4) is what thickness is measured from, and the `baseline`
  reference (default 1500) is shown as the per-ribbon notch + a legend annotation
  (§4), not a false horizontal line. Streamgraphs stack thickness, so there is no
  zero-baseline lie to flag — but the floor and the average line are stated in
  text, not hidden. *(Corrected 2026-07-06: this bullet formerly claimed a
  "y-domain `[min−pad, max+pad]`" and a labelled "baseline gridline"; §4
  authoritatively forbids a rating y-axis on a centered streamgraph and renders
  the baseline as a notch — the two are now reconciled to §4.)*

## 4. Geometry spec (build-time, in the component frontmatter)

- **viewBox:** `0 0 W H`, `W = 760`, `H = 420`. Margins `PAD_L = 16`,
  `PAD_R = 132` (right gutter holds the end-of-ribbon team tags without
  enlarging the box — the `power-flow` gutter pattern), `PAD_T = 22`,
  `PAD_B = 34` (bottom holds the date rail). Plot rect
  `w = W − PAD_L − PAD_R = 612`, `h = H − PAD_T − PAD_B = 364`.
- **X (time):** `x_i = PAD_L + (i/(dates.length−1))·w` for date index `i`.
  Uniform spacing by index (not by calendar gap) — the ticks ARE the sampling.
- **Ribbon thickness → rating:** vertical thickness encodes rating **above the
  streamgraph's own floor**: `thick(r) = (r − rFloor)·SY` where
  `rFloor = min(all non-null ratings) − 20` and
  `SY = h_avail / maxStackHeight`. `maxStackHeight = max over i of Σ_teams
  (r_{team,i} − rFloor)`; `h_avail = h`. So the tallest date-column exactly
  fills the plot height and no column overflows — deterministic, no magic scalar.
- **Stack + braid order:** at each date `i`, teams are stacked bottom→top by
  **ascending rating that date** (strong teams ride the top of the braid — the
  crossovers are the visible weave). Stacking order is recomputed per column, so
  a team that overtakes another visibly crosses it. Center the stack on the plot
  midline (streamgraph "wiggle" = symmetric): the stack's vertical center at
  each `i` sits at `PAD_T + h/2`; each ribbon's centerline
  `yc_{t,i} = midline − stackHalf_i + (cumBelow_{t,i} + thick_{t,i}/2)`.
- **Ribbon path:** for team `t`, build a closed path from its top edge
  (`yc − thick/2`) left→right through all dates, then its bottom edge
  (`yc + thick/2`) right→left. Between adjacent dates use a **monotone cubic**
  horizontal segment (Catmull-Rom → Bézier with x-monotone tangents; control
  x at the midpoint, control y = the endpoint y — no vertical overshoot, no
  ribbon self-crossing) so the braid is smooth but never wiggles past its data.
  *(This is the streamgraph analogue of `power-flow`'s cubic ribbons.)*
- **Null handling:** a `null` at date `i` is linearly interpolated from its
  nearest non-null neighbours for geometry (so the stack stays complete); the
  ribbon's fill over any interpolated span drops to 0.4× opacity (§3 flag).
  Leading/trailing nulls (no neighbour on one side) clamp to the nearest value.
- **Baseline gridline:** a horizontal `--ink` @ 0.16 line is NOT meaningful in a
  centered streamgraph (thickness, not absolute y, is the encoding). Instead the
  `baseline` renders as a **mono annotation in the legend** ("avg 1500") and as a
  faint tick on each ribbon where it crosses its own `baseline` rating — a 3px
  `--ink` @ 0.22 notch — so "above/below average" is still legible without a
  false horizontal axis. *(Clarified: a stacked streamgraph has no honest single
  horizontal rating axis; the notch is the honest substitute.)*
- **End tags (right gutter):** each ribbon's final centerline `yc_{t,last}` gets
  a tag at `x = W − PAD_R + 10`: `[{short}] {finalRating}` (bracket motif —
  `worlds/sports.md` motif 3), sans 12px + mono 11px tabular, vertically
  de-collided by pushing overlapping tags apart to a 15px minimum gap (greedy,
  top-down), connector: a 1px `--ink` @ 0.3 line from ribbon end to tag.
- **Date rail (the minute-rail motif adapted, `worlds/sports.md` motif 4):** a
  mono `0'`-style rail along `y = H − PAD_B + 4`, ticks at each `x_i`, labels the
  short date (`MMM` or `MMM 'YY`) at every tick if ≤ 8 dates, else every ⌈n/8⌉th.
- **Size constants:** ribbon edge stroke 1px `--ink` @ 0.28; subject ribbon edge
  1.5px volt; notch 3px; tag connector 1px. **375px:** viewBox unchanged (SVG
  scales); `PAD_R` drops to 92 and tags shorten to `[{short}]` only (rating
  moves into the hover-free legend below); date-rail labels thin to every
  ⌈n/5⌉th; nothing below 9.5px (the SVG scale-down keeps mono ≥ 9.5px because
  the viewBox text is authored at 11–12px and the card min-width floors the
  scale — verify at 375px per CANON §13).

## 5. Motion spec (names from motion.md)

- Reveal (once, on scroll-in, `.px-eriv:not(.is-in)` hidden states gated behind
  `html.js` — the §9 AGENTS contract):
  1. ribbons `sweep` — each ribbon's fill is revealed left→right via an
     animated `clipPath` rectangle growing in x (**900 ms** `--ease`, per-ribbon
     stagger **40 ms** ascending by final rating — sports' broadcast pace,
     `worlds/sports.md`; the stagger total is **capped at 320 ms** so even a
     10-ribbon field's last sweep starts by 320 ms and finishes by ≈ 1220 ms),
     so the river "flows in" from the season's start;
  2. the subject ribbon draws within the ribbon sweep (not appended after it),
     and its end tag `stamp`s (220 ms `--ease-snap`) firing at the sweep's tail
     — the sports verdict beat lands on the followed team, landing by ≈ 1.44 s;
  3. date-rail ticks + non-subject end tags `reveal` (opacity, 300 ms)
     **overlapping** the last ~300 ms of the sweep (not sequenced after it), so
     they settle by the time the sweep ends.
  Full sequence ≤ **1.6 s** (stagger budget). *(Corrected 2026-07-06: the
  original 1200 ms sweep + up to 360 ms ascending stagger + a subject ribbon
  drawn LAST + a 300 ms rail reveal appended AFTER the sweep summed to ≈ 1.86 s
  at 10 ribbons — over budget. Now: 900 ms sweep [the `power-flow` reference's
  own duration], stagger capped at 320 ms, subject drawn in-sequence, and the
  rail/tag reveal overlapped into the sweep tail — the whole card closes by
  ≈ 1.5 s. This is the streamgraph analogue of `power-flow` §5, which also uses
  a 900 ms ribbon sweep.)*
- **No ambient motion** — a rating river is a finished record, it does not flow
  continuously (`worlds/sports.md`: "No ambient motion"; motion.md rule 4).
- Reduced-motion / no-JS: every ribbon painted final (clipPath at full width),
  tags placed, subject pre-emphasised, `stamp` pre-stamped. This IS the print plate.
- **Composed still:** the full braided river, all ribbons filled, end tags +
  date rail placed, subject ribbon volt.

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| team ribbons (fill) | team `color` from data @ **0.72** (data-encoding exemption; fallback cycle if absent: `--accent`, `--accent-alt`, then `--ink` @ 0.6 / 0.42 / 0.28 / 0.18 …) |
| ribbon edges | `--ink` @ 0.28 (1px) |
| subject ribbon | edge 1.5px `--accent` (volt); fill = its data color @ 0.85 (lifted) |
| interpolated spans | the ribbon's fill @ 0.4× (hollow look) |
| baseline notch | `--ink` @ 0.22 (3px) |
| end tags / date rail | tags sans `--ink` @ 0.92 + mono `--accent-deep` values; rail mono `--ink` @ 0.6 |
| K-chip / interpolated-chip | `.px-viz__cap` mono unit-chip pattern |

Team colors are declared data encodings (the legend lists every one). This is
the ONE sports kind where the rivalry-pair discipline relaxes — a full-field
river needs per-team hues to be read — and the relaxation is explicit here
(CANON §6 requires fixed encodings be blueprint-declared). If a payload omits
colors, the fallback cycle keeps it single-accent-plus-ink. `--accent-alt`
(orange) has no fixed "opposition" role in a multi-team river; it is just the
2nd cycle color.

## 7. Fallback design (first-class)

The SVG is build-time static already — **no separate fallback is needed** (same
posture as `power-flow` §7). No-JS = the final painted river (clipPaths render at
full width without JS; the reveal only animates their growth). This IS the print
plate. What the no-JS/AT reader gets:

- The full braided streamgraph, every ribbon filled, crossovers visible, subject
  ribbon volt, end tags + date rail placed, baseline notches drawn.
- **In-SVG legend** (lower-left `<g>`, per AGENTS §5 — legends live in the SVG,
  not an HTML div): a swatch + `[{short}] {name}` row per team, subject row first
  and bold. **≤ 5 rows show; teams 6–10 collapse** behind a `<title>`-summarised
  "+N more" row that the (optional) island expands — but since this is a static
  plate with no island, at 6–10 teams the legend renders a compact two-column
  grid instead of collapsing (there is no interaction to disclose behind).
  *(CANON §4.5: the collapse rule is for interactive components; a static plate
  packs instead — stated so the implementer doesn't add JS just to fold a legend.)*
- The `model` + `kInfo` in the `.px-viz__src` line — the AT reader learns which
  rating system and update rule produced the river (honesty is in the text).

## 8. Interaction spec

- **None interactive in v1** (SVG stays pure — the `power-flow` posture). No
  hover targets, no chips, no controls. The `⤢` expand-to-modal (automatic on
  `.px-viz` via `core/ExpandModal.astro`) is the study view — it enlarges the
  same static SVG, no per-component wiring.
- This satisfies "at most ONE control" trivially (zero controls). Everything is
  readable at rest (CANON §9): the braid, the crossovers, and the followed team
  are all in the composed still + caption + legend.
- Keyboard/AT: the SVG carries `role="img"` + an `aria-label` summarising the
  subject's arc ("{subject} rose from {first} to {last} over {span}"); the
  in-SVG legend + source line carry the field. No focusable interactive elements.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "Each coloured ribbon
  is one team, and how thick it is shows its rating; the ribbons stack and weave,
  so a team climbing past another crosses over it in the braid."
- **how** (ExpandModal): "Follow any ribbon left to right across the season; the
  volt one is the team this story is about. Press ⤢ to study it larger."
- Caption guidance: state the relative-movement claim ("climbs from the bottom
  of the braid to the top — a 190-point swing"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 55 words — end tags (≤10 short+num) +
  date rail (~8) + legend (≤10 short names, but the legend is the collapsible
  data source, exempt) + caption ~24 + plain ~28. On-plate text (tags + rail +
  chips) ≈ 20 words, under 80. Team `name`s live only in the legend.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 700 (≤10 ribbon paths + ≤10 clip rects + edges + ≤40 date ticks + tags + legend) |
| `data` payload | ≤ 6 KB (10 teams × 40 dates × a number ≈ 4 KB + names) |
| JS | none beyond the shared `core/Reveal.astro` island (clipPath growth is CSS) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13): silhouette test (the still reads as a captioned
      braid) · 375px no overflow, mono labels ≥ 9.5px · reduced-motion / no-JS =
      full painted river (view-source check) · token grep (only declared team-
      color exemption + tokens; no stray hex) · caption + source(+model) + plain
      all render · payload degradation (missing `color`→cycle; missing `short`→
      first 3 letters; `null` ratings→interpolated hollow span) · `px-eriv` prefix
      unique
- [ ] **Worked anchor (recomputable):** with the example payload, at the last
      date the ratings are LEI 1812, ARS 1762, TOT 1795, MCI 1771 → `rFloor =
      min(all ratings) − 20 = 1622 − 20 = 1602`; the last column's stack heights
      (r − 1602) are LEI 210, ARS 160, TOT 193, MCI 169, Σ = 732; and the
      bottom→top order that date is **ARS(1762) < MCI(1771) < TOT(1795) <
      LEI(1812)** — so LEICESTER'S RIBBON IS ON TOP of the braid in the final
      column, and at the first date its order is bottom (LEI 1622 is the season
      minimum). The ribbon visibly climbs bottom→top. (A reviewer recomputes the
      order per column from `ratings` and checks the crossings.)
- [ ] Thickness is proportional to `(rating − rFloor)`: spot-check the final
      column — LEI's ribbon (210) is ~1.09× TOT's (193) and ~1.24× MCI's (169) tall
- [ ] The tallest date-column exactly fills the plot height (`SY` derivation);
      no column overflows the viewBox
- [ ] `kInfo` present renders the `K = 20, margin-adjusted` chip; omitting it
      renders no K-chip
- [ ] A payload with a `null` rating renders that ribbon hollow (0.4× fill)
      across the span AND renders the `dashed spans interpolated` chip; a
      null-free payload renders no such chip
- [ ] Subject ribbon (`subject: true`) is volt-edged and its end tag `stamp`s;
      exactly one subject is honoured (a second `subject` is ignored with the
      first winning — document, don't crash)
- [ ] End tags de-collide (≥15px gaps) and never clip the right gutter; the date
      rail labels thin correctly past 8 dates
- [ ] No-JS: identical final river (the reveal only animates clipPath growth);
      in-SVG legend lists every team; `model` in the source line
- [ ] One color system only when colors are omitted (grep the component for hex
      literals — only the declared fallback cycle constants pass)

---

*Registry duties (P6, at implementation — NOT now): add `elo-river` to
`SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry
(`src/lib/explainers.ts`), add the catalog block (`docs/design/catalog.md` —
`npm run check:catalog` must pass), document the `px-eriv` prefix in
`src/components/AGENTS.md` §4, and add a worked example to
`src/content/issues/2026-06-03-sports-showcase`. Do NOT edit SECTION_KINDS or
catalog.md at blueprint time.*
