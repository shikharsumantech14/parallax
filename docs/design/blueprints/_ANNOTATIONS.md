# The annotation layer — `data.annotations[]` on the workhorse charts

> Written 2026-09-13 under `docs/REGISTER-PLAN.md` RG-20. The evidence
> (Stokes et al., IEEE VIS 2022, n = 302; §10.3 of the plan) says readers
> prefer charts with the finding written *inside* them to sparser charts and
> to text alone. Parallax charts carry their explanation outside — intro
> above, caption and plain line below — and none has a slot for a callout on
> the mark. This spec adds one, to eight kinds first: `timeline`,
> `climate-strip`, `adoption-curve`, `benchmark-chart`, `approval-chart`,
> `scaling-plot`, `xg-race`, `elo-river`. The same contract extends to any
> chart later.

## 1. The contract

```ts
interface Annotation {
  at: string | number;           // WHERE — per kind, below. Exact match on the kind's own key.
  text: string;                  // ≤ 12 words, plain register, states the finding on that mark
  side?: 'above' | 'below' | 'left' | 'right';  // hint only; the kind may override to stay in bounds
  series?: string;               // kinds with several series (xg-race: 'home' | 'away'; elo-river: a team name)
}
// section.data.annotations?: Annotation[]   — 0–3 per chart. Optional everywhere; absent ⇒ nothing renders.
```

The text is a **claim**: the verifier traces it like a caption. It is not
Hindi: the precision layer is English only (`_voice-core.md` §2). The
`check:prose` gate caps it at 12 words.

## 2. `at` — per kind

| Kind | `at` matches | Where the callout attaches |
|---|---|---|
| `timeline` | the event's `date` string exactly, or its 0-based index | the row; rendered as an HTML callout beside the label |
| `climate-strip` | the `year` (number) | the stripe for that year; text above the strip with a 1px leader down to it |
| `adoption-curve` | the x value (year or label) of a point/milestone | the point on the curve |
| `benchmark-chart` | the item's label string | the end of that bar |
| `approval-chart` | the x label / date string of a point | the approve line at that x (or `series: 'disapprove'`) |
| `scaling-plot` | the point's label string, or its x value | the point |
| `xg-race` | the minute (number); `series` defaults to whichever line is higher at that minute | the cumulative line at that minute |
| `elo-river` | the round index (number) with `series` = the team name | that team's ribbon at that round |

A non-matching `at` renders nothing and logs nothing — a silent no-op, like
an unknown kind field. (The gate reports `ANNOTATION-UNMATCHED` later; the
component stays quiet.)

## 3. Rendering rules

- **SVG charts:** a `<g class="<prefix>__annot">` per annotation: a 3px
  marker dot on the mark (`fill: var(--accent)`), a 1px leader
  (`stroke: var(--rule)`) of 14–22 units to the text, and a `<text>` in the
  chart's own coordinate system. The text uses a **literal font stack, never
  `var()`** (RD-01b) — copy the stack already used by that component's other
  `<text>` elements, or `Literata, Georgia, 'Times New Roman', serif` if it
  has none — at **≥ 10 SVG units** where the chart is in the
  `dataviz-v2.css` natural-scale block (every one of the eight is, except
  `timeline`, which is HTML), italic, `fill: var(--ink)`. Keep it inside the
  viewBox: if `x + estimated width` (≈ 0.52 × font-size × characters)
  exceeds the right edge, set `text-anchor="end"` and mirror the leader.
  Wrap at 12 words maximum by splitting into two `<tspan>` lines at the
  nearest space past the midpoint when the estimated width exceeds 40% of
  the viewBox width.
- **HTML charts (`timeline`):** a `<span class="tl__annot vz-annot">` after
  the label, on its own line: the `.vz-annot` role from `viz-type.css`
  (display face, italic, 13px, `--ink-soft`) with a 3px accent dot before it
  (`::before`, `background: var(--accent)`, 8px round — the one round thing
  allowed is a colour dot).
- **Collision:** up to three annotations; the component places them in
  document order and does not resolve overlaps beyond the in-bounds rule.
  Authors avoid two annotations within 10% of the x-range of each other.
- **Motion:** none of its own. The annotation is part of the composed still
  and of the no-JS fallback. It rides the chart's own reveal.
- **Story mode:** annotations stay — they are data, not chrome. Class names
  must never end in `__cap` or `__src` (story.css hides those).
- **No new props on the component's public interface beyond `annotations?`.**
  Read it from `data` at the dispatch line exactly as `caption` is:
  `annotations={data.annotations}`.

## 4. Acceptance (per chart)

1. With one annotation authored, the callout renders in the still (JS
   disabled) at the right mark, inside the viewBox, ≥ 10 units.
2. With none authored, the markup is byte-identical to before.
3. At 375px the card scrolls horizontally (the natural-scale block) and the
   callout stays attached to its mark.
4. Tokens only; literal font stack in SVG text; no hex.
5. `text-anchor="end"` engages near the right edge; two-line wrap engages
   past 40% of the width.
6. The kind's catalog `DATA:` line gains `annotations?: [{at, text ≤ 12 words, side?, series?}]`
   (the orchestrator edits the catalog; the component agent reports the `at`
   semantics it implemented).
