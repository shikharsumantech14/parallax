# goal-clock — when goals are actually scored

> Blueprint for `goal-clock`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/sports.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `goal-clock` |
| World | sports |
| Tier | SVG dual-axis bars + line, one block-select island |
| Component path | `src/components/topic/sports/GoalClock.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-gcl` |
| Flagship reference | `xg-race` for the match-clock vocabulary; `momentum-wave` for the per-block reading |

## 2. What it shows / when to use

Events binned across a fixed period, with the cumulative share drawn on a second axis. The reader learns when the period actually delivers, and that the line is only the bars added up.

- **USE WHEN:** events binned across a fixed period (12–20 blocks) where both the per-block rate AND the cumulative share carry the argument.
- **DON'T USE:** two teams' cumulative xG within one match (→ `xg-race`); momentum swing (→ `momentum-wave`); a distribution with real samples (→ `pace-ridge`); a daily calendar (→ `rain-calendar`, earth).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface GoalClockData {
  period: { label: string; blocks: number; unit: string };  // e.g. 90, 'minute'
  bars: { label: string; share: number }[];   // share in %, Σ = 100 ±0.1
  intervalAt?: number;      // block index of the interval (half time)
  cumulativeLabel?: string; // default 'Scored by now'
  caption?: string;
  source?: string;
}
```

```yaml
kind: goal-clock
data:
  period: { label: match, blocks: 18, unit: minute }
  intervalAt: 9
  bars:
    - { label: '0–5',   share: 3.0 }
    - { label: '5–10',  share: 3.7 }
    - { label: '10–15', share: 4.2 }
    - { label: '15–20', share: 4.7 }
    - { label: '20–25', share: 5.0 }
    - { label: '25–30', share: 5.2 }
    - { label: '30–35', share: 5.4 }
    - { label: '35–40', share: 5.6 }
    - { label: '40–45 + added', share: 7.6 }
    - { label: '45–50', share: 3.5 }
    - { label: '50–55', share: 4.9 }
    - { label: '55–60', share: 5.4 }
    - { label: '60–65', share: 5.7 }
    - { label: '65–70', share: 6.0 }
    - { label: '70–75', share: 6.2 }
    - { label: '75–80', share: 6.5 }
    - { label: '80–85', share: 6.9 }
    - { label: '85–90 + added', share: 10.5 }
  caption: Half of all goals arrive after the 52nd minute, and the last five minutes carry 10.5% on their own.
  source: Goal timestamps, 380 league matches, 2025–26
```

**A dual axis is permitted here for exactly one reason:** the line is
literally the cumulative sum of the bars. It is never acceptable for two
independent series — that rule belongs in the component's own comment, because the
next author will be tempted.

- **`bars[].share` must sum to 100 ±0.1** or the build **FAILS printing the sum**.
- **The cumulative line is derived**, never authored.
- **Any prose claim about the 50% crossing must be computed from the payload.** The
  component exposes the crossing block and interpolated position; the caption uses
  it. The prototype's first draft asserted a crossing minute that its own bars
  contradicted.
- **No honesty chip** — both axes are linear and the right axis is fixed 0–100%.

## 4. Geometry spec

`viewBox="0 0 440 260"`, `width:440px; height:260px`.

- **Plot floor** y 216; **bars area** x 42 → 404 (the right gutter holds the
  second axis's labels).
- **Bar** width 17px, pitch 19.8px: `x = 48 + i · 19.8`, centre `x + 8.5`.
- **Left axis** (per-block share): `cby(v) = 216 − v / 12 × 198`, gridlines at
  0/4/8/12%, labelled at `x = 36`, `text-anchor="end"`.
- **Right axis** (cumulative): **fixed 0–100%**, `cbCumY(p) = 216 − p × 198`,
  labels at `x = 410` (left-anchored) at 0/50/100%, coloured to bind them to the
  line.
- **Cumulative line** through `(x + 8.5, cbCumY(runningSum))` at each block, 2px.
- **Interval marker:** a dashed `3 3` vertical at the left edge of block
  `intervalAt`, with a `HALF TIME` label at `y = 30`, left-anchored just past the
  line.
- **x-axis labels** at five chosen blocks, `y = 232`,
  `text-anchor="middle"`; axis title at `x = 223, y = 252`.
- **Readout** to the right (200px): block name, its share, cumulative by that
  block, and the deviation from the mean block.
- **375px:** the SVG scales; bar width drops to 11px and only three x-labels
  render. The right-axis labels stay — they are what makes the line readable.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Neither the bars nor the line animate
  — a growing cumulative line implies a match in progress.
- **On selection:** the selected bar takes the accent; others return to rest.
  120ms ease-out.
- **Composed still:** the tallest block selected (for the example, the final
  block), the line drawn, the interval marker visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| bar, rest | `--accent` mixed toward `--ink` 40% @ 0.90 |
| bar, selected | `--accent` @ 1.0 |
| cumulative line | `--accent` @ 1.0, 2px |
| right-axis labels | `--accent` @ 1.0 |
| left gridlines | `--rule` @ 1.0 |
| left-axis labels | `--ink` @ 0.50 |
| interval marker + label | `--ink` @ 0.40 / 0.50 |
| x-axis labels + title | `--ink` @ 0.50 / 0.45 |
| readout share, the maximum block | `--accent` @ 1.0 |

**The right axis's labels take the line's colour.** With two scales on one frame,
colour is the only cheap way to say which axis belongs to which mark, and it costs
nothing since the accent is already the line.

## 7. Fallback design

Build-time SVG:

1. The **whole chart** — all bars, the cumulative line, both axes, the interval
   marker.
2. The **readout** for the default block.
3. A `<table>`: block, share, cumulative share. Plus a summary line naming the
   50% crossing block and the largest block. AT-readable source; SVG
   `aria-hidden="true"`.

## 8. Interaction spec

**One control** — block selection.

- **Targets:** each bar is a `<button>` with a transparent hit rect the full pitch
  width (19.8px, above the 17px bar); plus the table rows. Tab order left to
  right.
- **Readout template** (`aria-live="polite"`):
  `"{label} {period.unit}s — {share}% of all goals, {cumulative}% scored by now, {±d} points against the average block."`
- **Keyboard:** complete; `←`/`→` step blocks, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "Two things on one frame, so read them separately. The bars count
  goals in each five-minute block, on the left-hand scale. The line is the running
  share of all goals scored by that minute, on the right-hand scale from nought to
  a hundred per cent. Where the line steepens, the bars are tall — the line is just
  the bars, added up."
- **`how`**: "Press a block for its share and the cumulative total by then. Read
  the bars and the line separately: they use different scales on purpose."
- **Caption guidance:** the crossing and the peak block, both computed — "half of
  all goals arrive after the 52nd minute, and the last five minutes carry 10.5% on
  their own".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 110 (20 bars + line + axes) |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Blocks | 12–20 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] `bars[].share` not summing to 100 ±0.1 fails the build, printing the sum
- [ ] The cumulative line is derived from the bars
- [ ] **The caption's 50% crossing figure matches the computed crossing**
- [ ] Right axis is fixed 0–100% and its labels take the line's colour
- [ ] The component carries a comment stating why the dual axis is legitimate here
- [ ] Interval marker sits at the left edge of `intervalAt`, not its centre
- [ ] Bar hit rects span the full pitch width
- [ ] Readout gives share, cumulative, and deviation from the mean block
- [ ] 375px: bars ≥ 11px, right-axis labels retained
- [ ] No-JS: full chart + default readout + cumulative table + summary line

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-sports-showcase`.*
