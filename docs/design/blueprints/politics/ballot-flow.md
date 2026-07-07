# Blueprint — `ballot-flow` (politics · SVG · a `flowDash` sibling of `power-flow`)

> Ranked-choice voting made visible as motion: candidates as columns, each
> round's tally as a bar, and every eliminated candidate's votes drawn as
> `flowDash` ribbons transferring to who they went to next — with the ballots
> that ran out of ranked choices flowing to a muted **exhausted** sink, never
> silently dropped. "Watch the count actually resolve." Copies `power-flow`'s
> build-time layout + `flowDash` machinery; adds the round structure.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `ballot-flow` |
| World | politics |
| Tier | SVG (build-time layout + geometry; CSS-variable `flowDash` dash animation; the only JS is the shared `core/Reveal.astro` island) |
| Component | `src/components/topic/politics/BallotFlow.astro` |
| Scene module | n/a (no WebGL) |
| Shared math | none — the component does **NOT** run the election. Rounds/tallies/transfers are precomputed in the data (`physics/apportionment.md` §5). The frontmatter only lays out and runs the two conservation asserts (§4). |
| CSS prefix | `px-bflow` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`, and the blueprint prefix tables in `src/components/AGENTS.md` §4) |
| Flagship reference | `power-flow` (build-time Sankey layout, `flowDash` speed ∝ value, `html.js`-gated reveal, single-accent discipline, conservation-checked build) — this kind is the round-structured cousin of it |

## 2. What it shows / when to use

An instant-runoff / ranked-choice election resolving round by round: who led
first, who got eliminated, where their votes flowed, and who assembled the final
majority — with vote conservation visible (transfers in = eliminated tally; the
column total holds except for the growing exhausted pile).

- **USE WHEN:** the dossier has a **precomputed** RCV/IRV count — for each round,
  every continuing candidate's tally, and for each elimination, the breakdown of
  where that candidate's ballots transferred (including how many exhausted). ≥ 3
  candidates and ≥ 2 rounds (one round is just `vote-result`). The transfer
  mechanism IS the story.
- **DON'T USE:** a single plurality vote against a threshold (→ `vote-result`);
  blocs splitting into for/against/abstain in one shot (→ `vote-flow`); money/
  authority moving between institutions (→ `power-flow`, which owns the general
  Sankey); a coalition's post-election arithmetic (→ `coalition-calculus`). If
  you only have first-preference totals and no transfer breakdown, you cannot
  honestly draw the flows — use `vote-result`.
- **Pairs with:** `layout: wide` (rounds run left→right and need the width);
  hero-capable for RCV explainer issues. **Never `bleed`** (labels need the
  gutter). **Never `split`** — it is a static, self-contained forensic diagram,
  not a scroll-scrubbed scene.

## 3. Data schema

```ts
interface BallotFlowData {
  candidates: Array<{
    id: string;                // "reed" — referenced by rounds + transfers
    name: string;              // "Dana Reed"
    short?: string;            // column/legend abbreviation, default name
    color?: string;            // candidate color — data-encoding exemption (chamber §6 rule).
                               // Fallback cycle if absent: --accent, --accent-alt, then
                               // --ink @ 0.7 / 0.5 / 0.35 (identical to coalition-calculus §6).
  }>;
  rounds: Array<{              // precomputed; the component renders, never computes
    tallies: Record<string, number>;  // candidateId → votes STILL HELD this round
    exhausted?: number;        // ballots exhausted by the START of this round (cumulative). R1 usually 0.
    // The candidate eliminated AT THE END of this round, and where their votes went.
    // Omitted on the final (winning) round.
    eliminate?: {
      id: string;              // candidate removed after this round
      transfers: Array<{ to: string | 'exhausted'; value: number }>;  // Σ value === tallies[id]
    };
  }>;
  winnerId?: string;           // the candidate who reached a majority of continuing votes.
                               // Default: the top tally in the final round.
  majorityBasis?: 'continuing' | 'firstRound';  // what the majority line measures against.
                               // default 'continuing' (majority of non-exhausted ballots — standard IRV).
                               // 'continuing' AUTO-RENDERS the honesty chip `majority of continuing ballots`.
  caption?: string;
  source?: string;
}
```

```yaml
# example payload — a 100,000-ballot, 4-candidate mayoral RCV resolving in 3 rounds.
candidates:
  - { id: reed,  name: "Dana Reed",   short: "REED",  color: "#b8341f" }
  - { id: ortiz, name: "Sam Ortiz",   short: "ORTIZ", color: "#1e5a3f" }
  - { id: chen,  name: "Mei Chen",    short: "CHEN",  color: "#3a5f8f" }
  - { id: blake, name: "Ada Blake",   short: "BLAKE", color: "#8a6d3b" }
rounds:
  - tallies:   { reed: 34000, ortiz: 31000, chen: 22000, blake: 13000 }
    exhausted: 0
    eliminate:
      id: blake
      transfers:
        - { to: reed,  value: 4000 }
        - { to: ortiz, value: 3000 }
        - { to: chen,  value: 5000 }
        - { to: exhausted, value: 1000 }
  - tallies:   { reed: 38000, ortiz: 34000, chen: 27000 }
    exhausted: 1000
    eliminate:
      id: chen
      transfers:
        - { to: reed,  value: 11000 }
        - { to: ortiz, value: 13000 }
        - { to: exhausted, value: 3000 }
  - tallies:   { reed: 49000, ortiz: 47000 }
    exhausted: 4000
winnerId: reed
majorityBasis: continuing
caption: "The first-round leader with 34% only won on the third count — Chen's transfers, not Blake's, put Reed over the top."
source: "Illustrative RCV tabulation; method: instant-runoff, majority of continuing ballots"
```

**Data flags with visual consequences:**
- `majorityBasis: 'continuing'` (the default) → the caption chip
  `majority of continuing ballots` (the majority line moves as ballots exhaust —
  the reader must be told the denominator shrank; CANON §7). `firstRound` renders
  no chip (the line is fixed at 50% of the round-1 total).
- Exhausted ballots are ALWAYS shown as their own muted sink lane (§4) — never
  folded into a candidate, never dropped (`physics/apportionment.md` §5).

## 4. Geometry spec (build-time, in the component frontmatter)

**Conservation asserts (both `throw` at build naming the round — mirrors
`physics/apportionment.md` §5 "build checks"):**
1. For every round with an `eliminate`: `Σ transfers[].value === tallies[eliminate.id]`
   — every eliminated vote goes somewhere (a continuing candidate or exhausted).
   Fail naming the round + candidate if not.
2. **Running conservation:** for consecutive rounds `k → k+1`,
   `Σ tallies(k+1) + exhausted(k+1) === Σ tallies(k) + exhausted(k)` — the total
   ballot pool is constant; only its distribution (and the exhausted slice) moves.
   Equivalently `Σ tallies(k+1) === Σ tallies(k) − (exhausted(k+1) − exhausted(k))`.
   Fail naming the round if the books don't balance. (This is the RCV analogue of
   `power-flow`'s `via`-node conservation check.)

**Layout — columns are rounds, lanes are candidates:**
- `viewBox="0 0 W H"`, `W = 720`, `PAD = 8`, `GUTTER = 96` (left gutter — holds
  the outward candidate-name labels without enlarging the viewBox, same trick as
  `power-flow`), `BAR = 28`, `R_MARGIN = BAR/2 + 20 = 34` (right inset so the
  final round's bar and its value label stay inside the viewBox).
- `nRounds` columns at x (bar centers) = `PAD + GUTTER + i·colW`,
  `colW = (W − PAD − GUTTER − R_MARGIN − PAD)/(nRounds − 1)` for `nRounds ≥ 2`.
  The last center is `W − PAD − R_MARGIN = 678`, so its bar right edge is
  `678 + 14 = 692 < 712` — inside the viewBox with room for the mid-x value
  label. Each round's bars are drawn AT its column x; transfer ribbons span from
  column `i` to column `i+1`. *(Corrected 2026-07-06: the prior
  `colW = (W − 2·PAD − GUTTER)/(nRounds − 1)` put the last column center at
  `712`, so a 28px bar centered there reached x=726, 6px past the `W = 720`
  viewBox edge — a clipped final-round bar. Added `R_MARGIN` so the last bar +
  label sit inside.)*
- Vertical model: each round-column is a **grouped column** — the round's
  continuing candidates are drawn as vertical bars side by side within the
  column, in a **stable candidate order** (by round-1 tally descending, the
  exhausted sink always last/rightmost within the group). "Lane" here means this
  fixed *order slot + color*, not a dedicated horizontal band: a candidate keeps
  the same slot position and color in every round so the eye tracks them, and an
  eliminated candidate's slot simply goes empty from the next round on. Bars
  within a group are spaced `BAR + 6` apart and the whole group is centered on
  the column x. *(Corrected 2026-07-06: §4 previously described candidates as
  "stable horizontal lanes" with each bar "at the lane's baseline" AND bar
  height ∝ votes with `H ≈ 300` — mutually inconsistent (fixed horizontal lanes
  stacked vertically would need ~5×150px of height, not 300; and 4 same-x 28px
  bars would overlap). Resolved to a grouped-column model: all bars share one
  baseline, candidate identity is carried by fixed slot + color, so `H ≈ 300`
  and the "eye tracks a candidate" intent both hold.)*
- Bar height ∝ votes: `barH = value · K`, `K = 150 / maxTally` where `maxTally`
  is the largest single tally across all rounds (so the tallest bar is 150px).
  All bars share the column group's baseline. The **bar zone ceiling** is
  `ZONE = max(150, majTickMax·K)` where `majTickMax = max over rounds of
  ⌊continuing/2⌋+1` — this guarantees the majority tick (which in an early round
  can sit *above* the tallest bar, since no candidate is near majority yet:
  R1 tick = 50,001·K ≈ 153px > the 150px leader bar) is never clipped.
  `H = BASELINE_PAD(40) + ZONE + LABEL_PAD(30)`; for the worked example
  `ZONE ≈ 153`, `H ≈ 223`, rounded up to `230`. Self-size down to the tallest
  column if the whole diagram is shorter. *(Corrected 2026-07-06: the prior
  `H = 40 + 2·(150) ≈ 300` double-counted bar height for a stacked-lane model
  that no longer applies; with one shared baseline the diagram needs one
  bar-zone of vertical room — sized to the majority tick, not just the tallest
  bar — plus label chrome.)*

**The majority line:**
- `majorityBasis: 'continuing'` → per round, `maj = ⌊continuing/2⌋ + 1` where
  `continuing = Σ tallies(round)` (excludes exhausted). The line is drawn **per
  column** at height `maj · K` as a short dashed `--ink` @ 0.42 horizontal tick
  across that column's bar zone (it descends as ballots exhaust — visibly).
- `firstRound` → one fixed dashed line across all columns at `(totalR1/2)·K`.
- Label `MAJORITY` (`.vz-eyebrow`, mono 10px) once, placed just above the final
  column's majority tick and **right-aligned to that tick's right end** (which
  sits at `finalColX + groupHalfWidth`, inside the `R_MARGIN` inset), so it reads
  next to the line the reader is checking and never clips the viewBox. *(Corrected
  2026-07-06: the prior "right-anchored inside the gutter" was geometrically
  impossible — `GUTTER` is the LEFT inset (x 0–104) that holds candidate names,
  while the final column and its majority tick are at the RIGHT of the diagram;
  there is no right gutter. Anchored to the final tick's right end within
  `R_MARGIN` instead.)*

**Transfer ribbons (`flowDash`, the card's one ambient motion):**
- For each `eliminate.transfers[t]`: a cubic-Bézier band from the eliminated
  candidate's bar (round `i`, right edge) to the recipient's bar (round `i+1`,
  left edge) — `M x0,y0 C mx,y0 mx,y1 x1,y1`, `mx = (x0+x1)/2`. Band thickness
  ∝ `value` (same `K`), drawn as a filled path @ 0.24 in the **eliminated
  candidate's** color (the votes carry their origin's color as they move — you
  see whose ballots these were) + a 1.5px centerline (the dash carrier).
- Ribbons to `'exhausted'` are drawn in `--ink` @ 0.30 (muted, not a candidate
  color) landing in the exhausted lane — visually "these ballots left the count."
- Value label on each ribbon at mid-x: mono `--viz-fs-axis` tabular with a
  `--paper` halo, e.g. `+11,000`.

**`flowDash` speed ∝ value (identical rule to `power-flow` §5, corrected form):**
per ribbon, `stroke-dasharray: 2 6`, animated `stroke-dashoffset` via CSS
`@keyframes`, duration `clamp(1.2s, 8·minValue/value s, 8s)` — the SMALLEST
transfer sits at the 8s cap (slowest), the largest is fastest. (`minValue` =
the smallest transfer value in the whole diagram. Using `8·minValue/value`, not
`8·maxValue/value`, so durations land inside [1.2s, 8s] — the bug `power-flow`
§5 flags.) Runs continuously; this is the ONE ambient motion of the card
(motion.md continuous-motion budget: one ambient per viewport).

**Candidate + round labels:**
- Candidate name: `.vz-legend` (mono) at the far-left gutter, one per lane,
  aligned to the round-1 bar; grays to `--ink` @ 0.4 in the round after the
  candidate is eliminated.
- Round axis: `ROUND 1 · ROUND 2 · ROUND 3` (`.vz-eyebrow`) under each column.
- Per-bar tally: the vote count in `.vz-value` (mono tabular 12px) above each
  bar, in the candidate's color; the winner's final bar gets the count + a
  `WINNER` chip via `stamp` (§5).

**375px:** rounds don't fit side by side for >2 rounds. Below 640px the diagram
**switches to a vertical round stack**: each round is a horizontal bar group
(candidates as rows, bar width ∝ votes), rounds stacked top→bottom, and
transfers render as short labeled connectors (`from → to +n`) between stacked
rounds rather than long Béziers (long diagonal ribbons don't survive the narrow
column). The exhausted row stays muted and last in every round. All data
preserved; labels ≥ 9.5px; no horizontal overflow.

## 5. Motion spec (names from motion.md)

- Entrance (once, on scroll-in; `html.js`-gated hidden states). To keep the
  whole sequence inside the 1.6s stagger budget (motion.md hard rule 3) with
  up to 6 rounds, the transfer sweeps are **not** chained one-round-behind-the-
  next (that serial chain is what overran the budget); they run as a single
  overlapping wave with a small per-round stagger, and later-round bars grow
  under the tail of that wave rather than strictly after it:
  1. `t=0–600ms` — round-1 bars `grow` (scaleY from baseline, 600ms `--ease`,
     50ms stagger by lane).
  2. `t=250–1150ms` — transfer ribbons `sweep` (dashoffset draw): **all
     elimination rounds draw within one 900ms window**, staggered left→right by
     `min(120ms, 700ms/(nRounds−1))` per round so even 6 rounds finish inside
     the window — the reader still reads the flow as moving round to round, but
     the rounds overlap instead of queueing.
  3. `t=650–1250ms` — later-round bars `grow` as their transfers land (overlaps
     the sweep tail; a round's bar begins growing once its incoming ribbons pass
     ~60% draw, not after they fully finish).
  4. `t=250–1150ms` — tally numbers `countup` (900ms tabular, tween to the HTML
     value), concurrent with the sweep.
  5. `t≈1380–1600ms` — **the winner's `WINNER` chip fires `stamp` LAST** (220ms
     `--ease-snap`) — the result seal (politics signature; motion.md `stamp`).
  - Full entrance **≤ 1.6s** (stagger budget). *(Corrected 2026-07-06: the prior
    spec drew ribbons "900ms per round set" and grew later bars "chained after
    that round's ribbons draw" — a serial chain that reaches ~2.05s for the
    3-round example (and worse for 6 rounds) while still asserting ≤1.6s. Sweeps
    now overlap within one 900ms window with a bounded per-round stagger, and
    later stages overlap the sweep tail, so the assertion holds at the 6-round
    cap.)*
- `flowDash` on the ribbon centerlines runs continuously afterward (§4), speed ∝
  transfer value. The single ambient motion.
- **Composed still (reduced-motion / print / no-JS):** the full round diagram —
  all bars at final heights, all ribbons drawn with dashes **static but visible**
  (dasharray stays → reads as directional stippling, exactly like `power-flow`),
  majority ticks, tallies, `WINNER` chip pre-stamped. This IS the print plate.
  Reduced-motion freezes the dashes and renders all entrances/`countup`/`stamp`
  in final state (motion.md reduced-motion: flows freeze as static dashes).

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| candidate bars | candidate `color` @ 0.85 (data-encoding exemption; fallback cycle `--accent`, `--accent-alt`, `--ink` @ 0.7/0.5/0.35) |
| transfer ribbons (to a candidate) | the **eliminated** candidate's color @ 0.24 fill + 0.9 centerline dash |
| transfer ribbons (to exhausted) | `--ink` @ 0.30 fill + centerline |
| exhausted lane bar | `--ink` @ 0.30 (muted sink — reads as "out of the count") |
| majority line + label | `--ink` @ 0.42, dashed |
| tally numbers | candidate color (`.vz-value`); exhausted count `--muted` |
| eliminated candidate label (post-elimination) | `--ink` @ 0.4 |
| `WINNER` chip + stamp border | `--accent-deep` (the finding — red marks the resolved result) |
| round axis / candidate labels | `--muted` (`.vz-eyebrow` / `.vz-legend`) |

Single-accent discipline holds for the CHROME (majority line, winner stamp,
axes all in ink/accent-deep); the candidate colors are the sanctioned data
encoding (`chamber` §6 rule). No per-ribbon rainbow — a ribbon's color is
inherited from its source candidate, so color means "whose votes," not decoration
(the `power-flow` principle: the palette carries meaning, thickness carries
magnitude).

## 7. Fallback design (first-class)

The SVG is 100% build-time; no-JS = the final painted plate (all rounds, ribbons
as static stipple, majority ticks, `WINNER` stamp — per §5's composed still).
Nothing needs JS to paint; `core/Reveal.astro` only choreographs assembly.

Below the diagram, the **round ledger** (`.pol-ledger` rows — AT-readable data
source, CANON §4.5 text-budget answer): one block per round —
`ROUND {n} — {candShort} {tally} · … · exhausted {n}`, then for the elimination
`{eliminated} out → {to} +{value}, …`. Mono figures right-aligned with dot
leaders. In `<details>` **open** in markup (no-JS readers keep it); the reveal
island removes `open` on boot once the in-SVG numbers show (legend-collapse rule).
A single always-visible line above it states the outcome:
`{winner} elected in {nRounds} rounds — {finalPct}% of continuing ballots`
(example: `Dana Reed elected in 3 rounds — 51.0% of continuing ballots`).

Nothing is dropped: every round tally, every transfer, and the exhausted counts
are in the no-JS page.

## 8. Interaction spec

- **None interactive in v1** (no hover targets — the SVG stays a pure diagram,
  matching `power-flow`). The full count is visible at rest; there is no "reveal
  more" state to add without inventing a gesture (CANON §9).
- The `⤢` expand modal (automatic via the shared `.px-viz` card) is the study
  view; `viz-type.css` bumps the label scale.
- Transfer value labels and the round ledger carry what a tooltip would say —
  no tooltips.
- Keyboard/AT: nothing focusable beyond the `<details>` disclosure and the expand
  button; the round ledger carries the full data.
- `touch-action` untouched (no drag surface); vertical scroll never captured.

## 9. Comprehension text

- **Plain default** (→ `src/lib/explainers.ts` at implementation): "Each column
  is one counting round; when a candidate is knocked out, the moving ribbons show
  where their votes went next, and the dashed line is the majority needed to win."
- **how** (ExpandModal): "Read left to right, round by round. Follow a ribbon
  from an eliminated candidate to see who picked up their votes; ballots with no
  next choice flow to the muted exhausted lane."
- Caption guidance: state the count's finding ("the first-round leader only won
  on the third count" / "transfers, not first preferences, decided it"), never
  restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 66 words — round-axis labels (~6) +
  candidate labels (~8) + per-bar tallies (the numerals, ~16) + `MAJORITY` (1) +
  `WINNER` (1) + outcome headline (~12) + caption (~20). Under the 80-word
  ceiling. Transfer value labels are part of the marks (magnitudes, not prose);
  the full round ledger sits below the fold. Hard cap: **≤ 6 candidates, ≤ 6
  rounds** — beyond that the columns crowd below the 375px floor; a larger field
  wants a simplified two-round `vote-result` framing or a data table.

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 500 (≤6 rounds × [≤6 bars + tallies] + ≤ (5 rounds × 6) ribbons + majority ticks) |
| `data` payload | ≤ 5 KB |
| JS | none beyond the shared `core/Reveal.astro` island (the `flowDash` is pure CSS `@keyframes`) |
| Extra assets | none |
| Continuous motion | exactly one `flowDash` system (motion.md budget: one ambient per viewport) |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13, all eight): silhouette test (prints as a legible
      round-by-round count) · 375px = vertical round stack, no horizontal
      overflow, labels ≥ 9.5px, expand target ≥ 44px · reduced-motion = static
      stipple + composed still, no dead space · token grep (only the declared
      candidate-color exemption passes) · caption + source + plain all render ·
      no-JS = final plate (view-source) · payload validates + degrades on missing
      `short`/`color`/`winnerId`/`majorityBasis` (defaults: name, accent cycle,
      top final tally, 'continuing') · prefix `px-bflow` unique
- [ ] **Conservation recompute (the worked anchor — checkable by hand):** on the
      example payload:
  - R1 Σ tallies = 34,000 + 31,000 + 22,000 + 13,000 = **100,000**; exhausted 0
  - Blake (13,000) eliminated → transfers 4,000 + 3,000 + 5,000 + 1,000 =
    **13,000** ✓ (assert 1 passes)
  - R2 Σ tallies = 38,000 + 34,000 + 27,000 = **99,000**; + exhausted 1,000 =
    **100,000** ✓ (assert 2 passes: 100,000 = 100,000 − (1,000 − 0))
  - Chen (27,000) eliminated → 11,000 + 13,000 + 3,000 = **27,000** ✓
  - R3 Σ tallies = 49,000 + 47,000 = **96,000**; + exhausted 4,000 = **100,000** ✓
  - Continuing at R3 = 96,000 → majority = ⌊96,000/2⌋ + 1 = **48,001**;
    Reed 49,000 ≥ 48,001 → Reed wins at **51.0%** of continuing (49,000/96,000);
    Reed had only **34.0%** in round 1 — the caption's claim recomputes
- [ ] Build **fails** naming the round if any `eliminate.transfers` don't sum to
      the eliminated candidate's tally
- [ ] Build **fails** naming the round if `Σ tallies + exhausted` is not constant
      across rounds
- [ ] Exhausted is rendered as its own muted `--ink` @ 0.30 lane, growing
      0 → 1,000 → 4,000, and is NEVER folded into a candidate
- [ ] `majorityBasis: 'continuing'` renders the chip `majority of continuing
      ballots` and the majority tick descends per round as continuing shrinks
      (R1 line at ⌊100,000/2⌋+1 = 50,001 → R3 at 48,001)
- [ ] Transfer ribbons carry the **eliminated** candidate's color; the largest
      transfer's dashes are visibly faster than the smallest's (Chen→Ortiz 13,000
      faster than Blake→Ortiz 3,000)
- [ ] `WINNER` chip fires `stamp` last on Reed's final bar; reduced-motion renders
      it pre-stamped
- [ ] Round ledger `<details>`: open under no-JS with every round tally + every
      transfer + exhausted counts; folds on boot; outcome headline always visible

---

*Registry duties when implementing (P6 — deliberately NOT done at blueprint time):
add `ballot-flow` to `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, add the `EXPLAIN` entry (`src/lib/
explainers.ts`, §9 wording), add the catalog block (`docs/design/catalog.md` —
`npm run check:catalog` must pass), document the `px-bflow` prefix in
`src/components/AGENTS.md` §4, and add a worked example to
`2026-06-03-politics-showcase`.*
