# Blueprint — `number-sense`

> **Corrections header (2026-09-13, at implementation):** `source` is typed
> `string | { label; date? }` (the schema's union). The value renders STATIC —
> the shared count-up ends by writing `toLocaleString()` in the reader's
> locale, so an `en-IN` browser would regroup an authored `1,500,000` as
> `15,00,000`, and this kind exists to carry one verified figure exactly as
> authored (CANON §7). `.px-ns__v` is itself the baseline flex container for
> the number and its unit. `.px-ns__num` pads `16px` all round below 640px.
> The component throws at build on a missing `value` or `label`, or on
> `equals` outside 1–3 — a big number with nothing beside it is a one-tile
> `data-readout`, not this kind. The `≈` glyph is `aria-hidden`. Word caps
> are `check:prose`'s. Written under `docs/REGISTER-PLAN.md` RG-09. One big number and, beside it, the everyday
> things it equals, so the size is felt rather than read. The contract's rule
> that every number gets a comparison the reader can feel, drawn as a
> component. Universal; lives in `core/`. `_TEMPLATE.md`'s preamble applies.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `number-sense` |
| World | universal |
| Tier | HTML, static |
| Component path | `src/components/core/NumberSense.astro` |
| CSS prefix | `px-ns` (verified free 2026-09-13) |
| Flagship reference | `core/DataReadout.astro` (the `.tel__val` number treatment) |
| Shell | `core/VizCard.astro` — caption row and slot. Not in `NEEDS_HOW`. |

## 2. What it shows / when to use

The reader sees one figure at the size it deserves and, next to it, one to
three things they already know that are the same size.

- **USE WHEN:** one number carries the section — a price, a count, a share —
  and the dossier or the storyboard's Indian-ground list gives its everyday
  equivalents (the ₹ for a $ figure; "the population of Delhi"; "one IPL
  season").
- **DON'T USE:** three to six numbers (→ `data-readout`); a number against a
  threshold (→ `vote-result`, `carbon-gauge`); a series (→ a time-series
  kind).
- **Pairs with:** `layout: default`; a quiet section. Often the section right
  after a chart, restating its headline figure at human scale.

## 3. Data schema

```ts
interface NumberSenseData {
  value: string;       // as authored, with its formatting ("15,000", "91", "1.47")
  unit?: string;       // "USD", "%", "°C above pre-industrial"
  label: string;       // what the number is, ≤ 8 words ("Everest permit, spring season")
  equals: Array<{
    text: string;      // ≤ 14 words: the same amount in a thing the reader knows ("about ₹12.5 lakh")
    note?: string;     // ≤ 12 words: the basis ("at ₹83 to the dollar, September 2025")
  }>;                  // 1–3; TRIM caps at 2
  note?: string;       // ≤ 20 words under the number
  caption?: string;    // the DATA claim
  source?: string;     // rendered by core/Section.astro
}
```

Example payload (Everest/Fuji issue; the dollar figure is published, the
rupee line is a conversion — its basis goes in `note` and the source line
names the rate's date):

```yaml
- kind: number-sense
  eyebrow: "THE TICKET"
  title: "What a place in the Everest line now costs."
  data:
    value: "15,000"
    unit: "USD"
    label: "Everest permit, spring season, from September 2025"
    equals:
      - text: "about ₹12.5 lakh"
        note: "at ₹83 to the dollar"
      - text: "36 percent more than the ₹9.1 lakh it cost in 2024"
    note: "The fee buys entry to the line, not a place at the front of it."
  caption: "Nepal raised the spring Everest permit from $11,000 to $15,000 on 1 September 2025."
  source: { label: "Nepal Department of Tourism via The Kathmandu Post", date: "2025-09-02" }
```

## 4. Geometry spec

- Root: `<div class="px-viz px-ns" data-reveal>` via VizCard.
- `.px-ns__grid`: two columns `2fr 3fr` from 640px up, one column below (the
  number first). `gap: 0`; the equals column carries `border-left: 1px solid
  var(--rule)` at ≥ 640px and `border-top` below.
- `.px-ns__num` (the number column): `padding: 20px 22px` (16px below 640).
  - `.px-ns__k` (label): `.vz-eyebrow` role, `color: var(--muted)`,
    margin-bottom 10px.
  - `.px-ns__v` (value): `font-family: var(--font-display)`, 700,
    `font-size: clamp(44px, 9vw, 72px)`, `line-height: 1`, tabular figures,
    `letter-spacing: -0.02em`, `color: var(--accent-deep)`.
  - `.px-ns__u` (unit): mono 11px 600 uppercase tracked `.16em`,
    `color: var(--muted)`, on the value's baseline after a 10px gap (wrap
    below the value under 400px).
  - `.px-ns__note`: 13.5px / 1.5, `color: var(--muted)`, margin-top 12px.
- `.px-ns__eq` (the equals column): a list; each `.px-ns__row` is a grid
  `28px 1fr`, `padding: 14px 20px` (12px 0 below 640), rows separated by
  `1px solid var(--rule)`.
  - `.px-ns__sign`: the `≈` glyph, `font-family: var(--font-display)`, 20px,
    `color: var(--accent-deep)`, aligned to the text's first line.
  - `.px-ns__t`: `font-family: var(--font-body)`, 17.5px / 1.5,
    `color: var(--ink)`.
  - `.px-ns__n`: 13px / 1.45, `color: var(--muted)`, margin-top 3px.
- Flat. The `.px-viz` shell supplies the top rule.

## 5. Motion spec

`data-reveal` on the root. The value may reuse DataReadout's count-up only if
that mechanism is already shared and needs no new JS; otherwise static.
Reduced motion: still.

## 6. Color spec

`--ink`, `--muted`, `--accent-deep`, `--rule`. The number is the one accent
mark; it is text on the paper, never on a fill.

## 7. Fallback design

Static HTML; the fallback is the component.

## 8. Interaction spec

None.

## 9. Comprehension text

- `EXPLAIN.what` (≤ 220): *One number, large, and beside it the everyday things
  it equals, so the size can be felt rather than read.*
- `EXPLAIN.how` (40–360): *Read the big number first, then each line beside it.
  Every line is the same amount said in something you already know.*
- `caption` is the data claim. Each `equals` line is a claim too: the
  verifier traces the figure and the basis in `note`.

## 10. Performance budget

Zero JS. ≤ 60 lines of scoped CSS.

## 11. Acceptance checklist

1. Silhouette: one big number and a short list beside it, JS disabled.
2. 375px: stacked, no overflow, value ≤ 44px, unit wraps cleanly.
3. Reduced motion: still.
4. Tokens only; `px-ns` unique; flat.
5. Exactly one caption row; no source, plain or how emitted.
6. Dark desks: `--accent-deep` legible on the ground (the in-world role).
7. Story card: ≤ 2 equals rows fit 375×667 (TRIM caps at 2).
8. `check:catalog` green; the showcase example passes `check:prose` caps.
