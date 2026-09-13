# Blueprint — `you-think`

> **Corrections header (2026-09-13, at implementation):** `source` is typed
> `string | { label; date? }` — the schema's union, which §3's own example
> uses; `.px-yt__note` takes `padding-inline: 16px` below 640px so it lines
> up with the stacked panels' 16px gutter; the component throws at build on a
> missing `think.text` or `actually.text` (the house loud-failure pattern);
> the word caps in §3 are enforced by `check:prose`, not by the component.
> Written under `docs/REGISTER-PLAN.md` RG-09. The brand's promise — *stories you think you
> already understand* — as a component: what most people assume on the left,
> what the numbers show on the right, and the one figure that settles it.
> Universal kind; lives in `core/`. The rules in `_TEMPLATE.md`'s preamble
> apply (CANON §4–§8, §10, §13, §14; `src/components/AGENTS.md` §4–§5).

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `you-think` |
| World | universal — wears the issue's theme |
| Tier | HTML, static |
| Component path | `src/components/core/YouThink.astro` |
| CSS prefix | `px-yt` (verified free 2026-09-13) |
| Flagship reference | `topic/politics/Paradox.astro` for the two-panel shape; `core/DataReadout.astro` for the number treatment |
| Shell | `core/VizCard.astro` — caption row and slot. The component renders no source, plain or how-to-read. Not in `NEEDS_HOW`. |

## 2. What it shows / when to use

The reader sees the belief they walked in with and the number that corrects
it, side by side, in one glance.

- **USE WHEN:** the dossier's structural argument corrects one specific,
  common belief, and one sourced figure does the correcting.
- **DON'T USE:** two legitimate positions in tension (→ `paradox`); a
  feature-by-feature contrast (→ `comparison`); a correction with no number
  behind it (→ `prose`).
- **Pairs with:** `layout: default`; usually the first or second section —
  the reframe early. Never `bleed`. One per issue.

## 3. Data schema

```ts
interface YouThinkData {
  think: {
    label?: string;    // default "What most people think"
    text: string;      // ≤ 30 words, plain register
  };
  actually: {
    label?: string;    // default "What the data shows"
    value?: string;    // the settling figure, as authored ("54", "543 → 850", "91%")
    unit?: string;     // "votes short", "seats", "of the extra heat"
    text: string;      // ≤ 30 words
  };
  note?: string;       // ≤ 20 words, muted, under both panels
  caption?: string;    // the DATA claim — VizCard's caption row
  source?: string;     // not rendered here; core/Section.astro prints it
}
```

Example payload (delimitation; every figure is in the published issue):

```yaml
- kind: you-think
  eyebrow: "THE ASSUMPTION"
  title: "The bill was sold as women's seats. The fight was the map."
  data:
    think:
      text: "The 131st Amendment was a women's reservation bill, and the opposition blocked it."
    actually:
      value: "543 → 850"
      unit: "seats"
      text: "The same bill would have redrawn every constituency by population and raised the house to 850 seats. That is what was voted down."
    note: "Same bill text, two readings. Only one was on the poster."
  caption: "The amendment bundled women's reservation with a population-based delimitation raising the Lok Sabha cap from 550 to 850."
  source: { label: "PRS Legislative Research, 131st Amendment Bill brief" }
```

## 4. Geometry spec

- Root: `<div class="px-viz px-yt" data-reveal>` via `<VizCard prefix="px-yt" caption={caption}>`.
- `.px-yt__grid`: two columns `1fr 1fr`, `gap: 0`, from 640px up; one column
  below 640px, the *actually* panel stacked second.
- `.px-yt__panel`: `padding: 18px 20px` (14px 16px below 640). The
  *actually* panel carries `border-left: 3px solid var(--accent)` at ≥ 640px
  and `border-top: 3px solid var(--accent)` below; the *think* panel carries
  `border-right: 1px solid var(--rule)` at ≥ 640px only.
- `.px-yt__k` (the label): the `.vz-eyebrow` role — mono, 9.5px, 600, tracked
  `.16em`, uppercase; `color: var(--muted)` on the think panel,
  `color: var(--accent-deep)` on the actually panel. Margin-bottom 10px.
- `.px-yt__v` (the value): `font-family: var(--font-display)`, 700,
  `font-size: clamp(36px, 6vw, 52px)`, `line-height: 1`, tabular figures,
  `color: var(--ink)`, `letter-spacing: -0.01em`. `.px-yt__u` (unit) sits on
  the same baseline after a 10px gap: mono 11px 600 uppercase tracked,
  `color: var(--muted)`. Value row margin-bottom 12px. Omitted cleanly when no
  value.
- `.px-yt__t` (text): `font-family: var(--font-body)`, 17.5px / 1.55;
  `color: var(--ink-soft)` on think, `var(--ink)` on actually. Max-width
  `34ch`.
- `.px-yt__note`: 13.5px / 1.5, `color: var(--muted)`, `padding: 10px 20px 0`,
  `border-top: 1px solid var(--rule)`.
- Flat: no radius, no shadow, no hover transform. The `.px-viz` shell supplies
  the 3px `--viz-edge` top rule.

## 5. Motion spec

`data-reveal` on the root (the kit's reveal, named in `motion.md`). Nothing
else. Reduced motion: the composed still.

## 6. Color spec

Tokens only: `--ink`, `--ink-soft`, `--muted`, `--accent`, `--accent-deep`,
`--rule`. No hex literals. The accent rule is the only vivid mark; text never
sits on a vivid fill (TD-06).

## 7. Fallback design

It is static HTML; the fallback is the component. No JS, no WebGL.

## 8. Interaction spec

None. Not an instrument.

## 9. Comprehension text

- `EXPLAIN.what` (≤ 220): *Two panels: on the left what most people assume, on
  the right what the numbers show, with the one figure that settles it.*
- `EXPLAIN.how` (40–360): *Read the left panel first, then the right. The
  number on the right is the fact the rest of the section rests on.*
- `caption` is the data claim; the verifier traces it. Author `plain` only
  when the default does not fit the issue's framing.

## 10. Performance budget

Zero JS. ≤ 60 lines of scoped CSS.

## 11. Acceptance checklist

1. Silhouette: two panels and one large number, JS disabled.
2. 375px: stacked, no horizontal overflow, value ≤ 44px, labels ≥ 9.5px.
3. Reduced motion: composed still.
4. Tokens only; `px-yt` unique; no radius, shadow or hover lift.
5. Exactly one caption row (VizCard); no source, plain or how-to-read emitted.
6. Dark desks (space, tech, sports): labels and value legible.
7. Story card (375×667): fits with ≤ 30-word texts.
8. `check:catalog` green after wiring; `check:prose` reports no FIELD-OVER-CAP
   on the showcase example.
