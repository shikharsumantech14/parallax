# Blueprint — `jargon-buster`

> **Corrections header:** none — first version, written 2026-09-13 under
> `docs/REGISTER-PLAN.md` RG-09. Two to four terms of art with a one-line
> meaning each, in the register, so the issue never carries an unexplained
> word. Narrative kind (no plain line, no how-to-read, no card); universal;
> lives in `core/`. `_TEMPLATE.md`'s preamble rules apply.

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `jargon-buster` |
| World | universal |
| Tier | HTML, static |
| Component path | `src/components/core/JargonBuster.astro` |
| CSS prefix | `px-jb` (verified free 2026-09-13) |
| Flagship reference | `core/BeatSheet.astro` (a narrative kind's bare root); the `.px-cells` primitive at the end of `base.css` for hairline cells |
| Shell | none — narrative kind. Bare root with `data-reveal`; no VizCard, no caption row. Joins the `NARRATIVE` set in `scripts/check-catalog.mjs` and the header list in `src/lib/explainers.ts`. |

## 2. What it shows / when to use

The two to four words a reader needs before the next section, each explained
the way a friend would.

- **USE WHEN:** the issue needs more than one term of art and glossing them
  in-line would clog a paragraph (`research/_voice/jargon.md` carries the
  glosses).
- **DON'T USE:** one term (gloss it in the sentence); a comparison of
  entities (→ `comparison`); a sequence (→ `three-steps`).
- **Pairs with:** `layout: default`; sits right before the first section
  that uses the terms. Quiet section in the act rhythm.

## 3. Data schema

```ts
interface JargonBusterData {
  terms: Array<{
    term: string;      // as it appears in the issue ("xG")
    meaning: string;   // ≤ 25 words, the register; Hindi allowed by the four tests
    hindi?: string;    // optional one-line Hindi gloss, Roman script, ≤ 10 words
  }>;                  // 2–4 entries; TRIM caps at 4
  source?: string;     // rarely needed; rendered by core/Section.astro if given
}
```

Example payload (sports; glosses from `research/_voice/jargon.md`):

```yaml
- kind: jargon-buster
  eyebrow: "FOUR WORDS FIRST"
  title: "The words the rest of this issue uses."
  data:
    terms:
      - term: "xG"
        meaning: "Expected goals: how many goals those chances usually turn into, judged by where each shot was taken from."
        hindi: "matlab, kitne maukon se goal banta hai"
      - term: "Set piece"
        meaning: "A corner or a free kick — play restarting from a dead ball."
      - term: "Open play"
        meaning: "Everything that is not a set piece."
      - term: "Elo rating"
        meaning: "A running score of a team's strength that rises with wins against strong sides, like a cricket ranking updated every match."
```

## 4. Geometry spec

- Root: `<div class="px-jb" data-reveal>`. `border-top: 1px solid var(--rule)`.
- `.px-jb__grid`: hairline cells in the `.px-cells` manner — two columns at
  ≥ 640px (`grid-template-columns: 1fr 1fr`), one below; cells separated by
  `1px solid var(--rule)` (right border on **left-column** cells at ≥ 640px,
  never on a spanning cell; bottom border on all but the last row). Three
  terms: the third cell spans both columns at ≥ 640px. Four: 2×2. *(Amended
  2026-09-13 at implementation: "odd cells" would have drawn a hairline
  through the spanning third cell; the per-cell span/right/bottom flags are
  computed in the frontmatter, not with `nth-child`.)*
- `.px-jb__cell`: `padding: 16px 18px` (14px 0 below 640px).
- `.px-jb__term`: `font-family: var(--font-display)`, 700, 17px / 1.25,
  `color: var(--ink)`, margin-bottom 6px.
- `.px-jb__m` (meaning): `font-family: var(--font-body)`, 15.5px / 1.5,
  `color: var(--ink-soft)`.
- `.px-jb__h` (hindi): 13.5px / 1.5, `color: var(--muted)`, **`font-style:
  normal`** — Hindi is set roman, never italic — margin-top 6px.
- Flat, no radius, no shadow.

## 5. Motion spec

`data-reveal` on the root. Reduced motion: still.

## 6. Color spec

`--ink`, `--ink-soft`, `--muted`, `--rule`. No accent — this is a quiet
section.

## 7. Fallback design

Static HTML; the fallback is the component.

## 8. Interaction spec

None.

## 9. Comprehension text

Narrative kind: no `EXPLAIN` entry, no plain line, no how-to-read. The
section `title` and `intro` do the framing. Terms and meanings are prose
fields; the precision layer (captions, labels) is not involved.

## 10. Performance budget

Zero JS. ≤ 40 lines of scoped CSS.

## 11. Acceptance checklist

1. Silhouette: a hairline grid of term + meaning cells, JS disabled.
2. 375px: one column, no overflow, term 17px, meaning ≥ 15px.
3. Reduced motion: still.
4. Tokens only; `px-jb` unique; flat.
5. Nothing emitted beyond the cells: no caption, source, plain or how.
6. Hindi line renders roman, never italic.
7. Story card: ≤ 4 terms fit 375×667 (TRIM caps at 4).
8. `check:catalog` green with the kind in `NARRATIVE`.
