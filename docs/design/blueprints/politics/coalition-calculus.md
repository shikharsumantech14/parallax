# Blueprint — `coalition-calculus` (politics · HTML-interactive · the reader-agency reference)

> Coalition arithmetic the reader performs. Parties are weight blocks on a
> single seat-bar against the majority line; the reader presses parties in
> and out of a coalition and the component keeps honest score — `CLEARS BY X`
> or `SHORT BY X`, never spin. **This is the first reader-agency component:
> its §8 interaction pattern (data-at-rest / one chip-set control /
> aria-live verdict / refusals that explain themselves) is the precedent
> every later reader-agency kind copies.**

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `coalition-calculus` |
| World | politics |
| Tier | HTML-interactive (build-time HTML + one tiny vanilla inline island; no SVG beyond the lock glyph, no three.js) |
| Component | `src/components/topic/politics/CoalitionCalculus.astro` |
| Scene module | n/a |
| Shared math | none — the arithmetic is three one-line formulas (§4) implemented identically in the Astro frontmatter (preset render) and the inline island (toggles). The §11 anchors force the two sites to agree; a shared module for three expressions is overhead, not safety. |
| CSS prefix | `px-coalc` (grepped 2026-07-06: unique across `meta.css`, `base.css`, `src/components/`) |
| Flagship reference | `chamber` §8 (mono pill chips, `aria-pressed`), `power-flow` (build-time layout + reveal pattern), `core/ReadingToolbar.astro` (the vanilla inline-island shape) |

## 2. What it shows / when to use

Which coalitions can actually govern — party seat weights summed against the
majority threshold, with the shortfall or margin stated as a number, and the
parties nobody will govern with locked out of the game.

- **USE WHEN:** a hung chamber / coalition-formation story where the dossier
  has ≥3 parties' seat counts covering the full chamber (Σseats = N) and the
  arithmetic of who-can-combine IS the argument. Locked-out parties need a
  sourced one-line reason.
- **DON'T USE:** the chamber's composition as portrait (→ `chamber`); one
  decisive vote against a threshold (→ `vote-result`); blocs splitting into
  for/against (→ `vote-flow`); seat totals with a change column (→
  `seat-chart`).
- **Pairs with:** `wide` standalone; hero-capable for coalition-math issues.
  **Never `layout: split`** — in split, scroll is the control (CANON §9);
  a chip-set component inside split would carry two competing controls. This
  is a standing rule for all reader-agency kinds.

## 3. Data schema

```ts
interface CoalitionCalculusData {
  majority?: number;      // threshold to govern. Default ⌈(N+1)/2⌉ (apportionment.md §3).
                          // If provided AND ≠ the default, auto-renders the honesty
                          // chip `threshold {majority} of {N}` (CANON §7).
  parties: Array<{
    name: string;         // "CDU/CSU"
    short?: string;       // beam-tag/ledger abbreviation, default name
    seats: number;        // integer ≥ 1; N = Σ seats (the whole chamber)
    color?: string;       // party color — data-encoding exemption, same rule as
                          // `chamber` §6 (fallback cycle if absent: --accent,
                          // --accent-alt, then --ink @ 0.7/0.5/0.35)
    locked?: string;      // PRESENCE = locked out (realises apportionment.md §3's
                          // `locked:'out'` flag); VALUE = the stated reason,
                          // ≤ 12 words, sourced. Locked parties are untoggleable.
  }>;
  preset?: string[];      // party names toggled IN at load (usually the real
                          // governing coalition — the composed still IS the answer).
                          // Default: the largest unlocked party only.
  caption?: string;
  source?: string;
}
```

```yaml
# example payload (Bundestag 2025 — real seat counts, 630 seats)
parties:
  - { name: "CDU/CSU", short: "Union", seats: 208, color: "#2f2f38" }
  - { name: "AfD", seats: 152, color: "#3d9fd6",
      locked: "every other party rules out governing with it" }
  - { name: "SPD", seats: 120, color: "#e3001b" }
  - { name: "Grüne", seats: 85, color: "#46962b" }
  - { name: "Linke", seats: 64, color: "#be3075" }
  - { name: "SSW", seats: 1, color: "#003c8f" }
preset: ["CDU/CSU", "SPD"]
caption: "With the second-largest party locked out, exactly one two-party majority exists — and it clears by 12 seats."
source: "Bundeswahlleiterin, final result, Feb 2025"
```

**Data flags with visual consequences:** `majority` present and ≠ ⌈(N+1)/2⌉ →
mono unit-chip `threshold {majority} of {N}` in the caption row (supermajority
rules must announce themselves). No other flags.

## 4. Geometry spec

**The three formulas (both implementation sites, identical):**

- `N = Σ parties[].seats` · `majority = data.majority ?? Math.ceil((N + 1) / 2)`
- `sum = Σ seats of toggled-in parties` · `margin = sum − majority`
- verdict: `margin ≥ 0 → "CLEARS BY {margin}"` else `"SHORT BY {−margin}"`.
  `margin = 0` renders `CLEARS BY 0` — Σ ≥ threshold governs (apportionment.md
  §3); the display stays literal, it does not editorialise the knife-edge.

**Worked anchor (the example payload):** N = 630, majority = ⌈631/2⌉ = 316.
Preset Union + SPD = 328 → `CLEARS BY 12`. Union alone = 208 → `SHORT BY 108`.
Union + Grüne = 293 → `SHORT BY 23`. All unlocked parties = 478 → `CLEARS BY 162`.

**The beam (`.px-coalc__beam`):**

- Track: width 100% of the `.px-viz` content column (max 720px), height 64px
  desktop / 52px at ≤640px, 1px `--rule` border, transparent background.
- Blocks: toggled-in parties only, laid left→right in **data order** (stable —
  toggling never reorders), `width = max(2px, seats/N × 100%)`, full track
  height, separated by a 1px gap showing the page background. The 2px visual
  floor may distort micro-parties (SSW at 1/630 = 1.1px renders 2px); the
  verdict and the majority-line position are computed **from data, never from
  block pixel geometry** — the floor can never change the answer.
- Majority line: absolutely positioned at `left: majority/N × 100%` (example:
  50.16%, = 361.1px at 720), zero-width element with a 1.5px **dashed**
  border-left `--ink` @ 0.42, extending 10px above and 6px below the track.
  Label `MAJORITY · {majority}` — mono `--viz-fs-eyebrow` (10px), uppercase,
  +0.08em — sits above the line, anchored left of it when the line is within
  90px of the track's right edge, else right of it (the label must always fit
  the card; never let it clip).
- Paper tags (block labels): rendered only on blocks ≥ 84px wide —
  `{short ?? name} {seats}` (11px sans + 11px mono tabular), padding 2px 6px,
  background `--paper` @ 0.85, border-radius 2px, centered in the block. The
  tag's paper ground makes the label legible on any party color; blocks below
  84px carry no text (the bench chip is their label).
- Verdict row: fixed 32px strip under the track (reserved even when empty —
  toggling never changes card height). A bracket (1.5px `--accent-deep`
  horizontal line with 4px down-turned end serifs) spans from
  `min(stackEndX, majorityX)` to `max(stackEndX, majorityX)` — the bracket IS
  the margin, drawn to scale (example: clears-by-12 bracket = 12/630 × 720 =
  13.7px). The verdict chip (mono 11px uppercase +0.08em `--accent-deep`)
  centers under the bracket, clamped to `[0, trackW − chipW]`; when the
  bracket is < 72px wide the chip right-aligns under the track instead.
- **375px:** track 343px wide × 52px; Union's block = 113px (tag shows), SPD =
  65px (tag drops); everything else identical.

**The bench (`.px-coalc__bench`):** flex row, wrap, 8px gap, 18px above-margin.
One chip per party in data order: 10×10px color swatch + name (13px sans) +
seats (12px mono tabular). Chip min-height 44px, padding 10px 14px (44×44
target floor, CANON §9). Locked chips append a 12×12 bespoke inline-SVG
padlock (line-drawn, 1.5px stroke `--ink`, 3 nodes — no icon library).

**The annotation (`.px-coalc__why`):** the lock-reason line, rendered in the
world's `.pol-annot` voice — Fraunces italic 13px `--accent-deep` with the
thin red underline connector to the tapped chip. One visible at a time, in a
reserved 24px row under the bench (again: no height change).

## 5. Motion spec (names from motion.md)

- Entrance (once, on scroll-in): card `reveal` → blocks `grow` (width 0→final,
  600ms `--ease`, 50ms stagger left→right) → majority line + label `reveal` →
  verdict number `countup` (900ms, starts at 700ms) → **if the preset clears,
  the verdict chip fires `stamp` last** (220ms `--ease-snap`, the politics
  verdict signature). Full sequence ≤ 1.6s.
- Toggle-time (event-driven, not entrance): entering block `grow` in 220ms
  (`--t-soft`, `--ease`); leaving block `grow` out (width→0, 220ms); sibling
  blocks translate on the same 220ms curve (CSS width transitions carry it);
  bracket + chip re-lay instantly at transition end. When the margin **crosses
  from short to clears**, the verdict chip fires `stamp` once per crossing;
  clears→short is a plain 140ms (`--t-quick`) text swap — losing a majority
  gets no ceremony.
- `pressDown` on chips (scale 0.98, 80ms).
- The `__why` annotation enters with `reveal` (140ms variant), auto-dismisses
  after 8s or on the next pointer/key interaction.
- No ambient motion. Records don't fidget (worlds/politics.md).
- **Composed still (reduced-motion / print / no-JS):** the preset coalition on
  the beam, majority line + label, bracket + verdict painted, bench per §7's
  no-JS state. Reduced-motion: all transitions become hard swaps; `stamp`
  renders pre-stamped; `countup` shows the final number (already in the HTML).

## 6. Color spec

| Element | Token @ opacity |
|---|---|
| party blocks + chip swatches | party `color` from data @ 1.0 (data-encoding exemption, identical rule to `chamber` §6; fallback cycle: `--accent`, `--accent-alt`, then `--ink` @ 0.7/0.5/0.35) |
| track border, ledger rules | `--rule` @ 1.0 |
| majority line + label | `--ink` @ 0.42, dashed (structure opacity, CANON §6) |
| paper tags | `--paper` @ 0.85 ground, `--ink` @ 0.92 text |
| bracket + verdict chip + stamp border | `--accent-deep` (red = the finding) |
| locked chips | chip at 0.55 opacity; padlock `--ink` @ 0.9 |
| `__why` annotation | `--accent-deep`, Fraunces italic (the `.pol-annot` motif) |

No new colors. Red is never valence here — it marks the arithmetic finding
(the gap or the margin), per worlds/politics.md.

## 7. Fallback design (first-class)

No-JS is the print edition of the preset answer:

- The beam renders fully at build time in the **preset** state — blocks,
  majority line, bracket, verdict chip (and its stamp styling if it clears).
  This is complete, correct, static HTML; nothing requires JS to paint.
- The bench chip set is a JS-only control: rendered with the `hidden`
  attribute, unhidden by the island on boot (the existing island contract —
  controls that need JS never show dead).
- Below the beam, the **party ledger** (`.pol-ledger` rows — the AT-readable
  data source): `{name} · {seats} · {IN COALITION | — | LOCKED OUT — {reason}}`,
  one row per party, mono figures right-aligned with dot leaders. In markup it
  lives inside `<details open>`; the island removes `open` on boot and retitles
  the summary `party ledger — show all` (the CANON §4.5 legend-collapse rule:
  once chips carry the data live, the ledger folds away). No-JS readers get it
  permanently open; `<details>` needs no JS to toggle.
- Nothing is dropped: every party, every seat count, every lock reason is in
  the no-JS page.

## 8. Interaction spec — THE READER-AGENCY PATTERN

This section is precedent. Future reader-agency blueprints cite these five
rules instead of re-deriving them:

1. **Data at rest, control on boot.** The composed still already states the
   issue's answer (the preset). Interaction reveals *alternatives*, never the
   point (CANON §9). Controls ship `hidden`, unhidden by the island.
2. **One control per component.** Here: the party chip set. No sliders, no
   scrubbers, no second chip row. (A chip SET of toggles is one control.)
3. **The verdict is `aria-live`.** The readout element carries
   `aria-live="polite"`; every toggle announces "Clears by 12" / "Short by 23"
   to AT without focus moving.
4. **Refusals explain themselves.** A locked control is never silently inert:
   activating it produces the stated reason (the `__why` annotation), visually
   and via `aria-describedby`.
5. **Keyboard-complete.** Every reachable state is reachable by keyboard alone;
   the fallback ledger carries the full data for non-visual reading.

Concrete wiring:

- Chips are real `<button>`s, `aria-pressed="true|false"`, tab order = data
  order. Enter/Space toggles. Focus ring 2px `--accent-deep`, 2px offset.
- Locked chips: `aria-disabled="true"` (still focusable — discoverability),
  `aria-describedby` → the reason node, `cursor: not-allowed`. Pointer or key
  activation shows the `__why` annotation; `aria-pressed` never becomes true;
  the sum never includes them.
- Chip label template: `{swatch} {name} {seats}`. No tooltips — everything a
  tooltip would say is already on the chip or in the ledger.
- These chips deliberately extend CANON §9's "control chip" affordance (mono
  pill, `aria-pressed`) beyond its ≤3-scene-states clause: they are data
  toggles, not `setState` scene states. Deviation recorded here on purpose;
  the governing limit for reader-agency kinds is rule 2 above.
- `touch-action` untouched (no drag surface exists); vertical scroll is never
  captured.

## 9. Comprehension text

- **Plain default** (→ `explainers.ts` at implementation): "Every block is one
  party's seats on a single bar; press parties in or out and the bar shows
  whether the group reaches the majority line."
- **how** (ExpandModal): "Tap a party chip to add it to the coalition — the
  readout keeps honest score. Padlocked parties state why they can't join."
- Caption guidance: state the coalition-space claim ("exactly one two-party
  majority exists"), never restate the form.
- **Text budget (CANON §4.5):** at rest ≈ 55 words (tags 4 + majority label 2 +
  verdict 3 + six chips ≈ 12 + collapsed-ledger summary 2 + caption ~14 +
  plain ~18) — under the 80-word ceiling. Lock reasons (≤12 words each) are
  behind interaction and don't count at rest. Hard cap: 10 parties; beyond
  that the story wants `chamber` or `seat-chart`.

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 140 (track + ≤10 blocks + tags + bench + ledger) |
| Inline island JS | ≤ 2.5 KB / ≤ 90 lines, vanilla, `is:inline` |
| `data` payload | ≤ 2 KB |
| SVG | lock glyphs only (3 nodes each) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] Canon floor (CANON §13: silhouette test · 375px no overflow, labels
      ≥ 9.5px, targets ≥ 44px · reduced-motion still · token grep (declared
      party-color exemption only) · caption + source + plain · payload
      degradation (missing `preset` → largest unlocked party; missing
      `majority` → formula) · prefix unique)
- [ ] Example payload: N = 630 and omitted `majority` computes 316
      (⌈631/2⌉); no honesty chip renders (316 = default)
- [ ] Preset Union+SPD renders blocks totalling 52.06% of the track, verdict
      `CLEARS BY 12`, bracket ≈ 13.7px at 720px, stamp fired
- [ ] Toggle SPD off → `SHORT BY 108`; toggle Grüne on → 293 seats,
      `SHORT BY 23`, bracket ≈ 26.3px; re-toggle SPD → stamp fires exactly
      once on the short→clears crossing
- [ ] All unlocked parties toggled → `CLEARS BY 162`
- [ ] AfD chip: `aria-disabled`, padlock glyph, activation shows "every other
      party rules out governing with it" as a `.pol-annot` line and NEVER
      changes the sum or `aria-pressed`
- [ ] A payload with `majority: 420` (⅔ rule) renders the chip
      `threshold 420 of 630`
- [ ] SSW's 1-seat block renders at the 2px floor; majority-line position and
      verdict remain data-exact regardless
- [ ] Verdict element is `aria-live="polite"`; toggling announces the new
      verdict with no focus change; full toggle round-trip works with
      keyboard only
- [ ] No-JS (view-source): beam painted in preset state with verdict; bench
      absent (hidden); ledger `<details>` open with all six rows including
      the lock reason
- [ ] Card height never changes across any toggle sequence (reserved verdict
      + annotation rows)
- [ ] `margin = 0` case renders `CLEARS BY 0` (not "SHORT BY 0", not blank):
      verify with a test payload whose toggled-in Σ equals the majority exactly —
      e.g. `parties: [{A: 316}, {B: 314}]`, `preset: ["A"]` → N = 630,
      majority = ⌈631/2⌉ = 316, Σ = 316, margin = 0 → `CLEARS BY 0`, bracket
      length 0 (chip right-aligns under the track per §4). *(Corrected 2026-07-06:
      the prior line trailed off — "Union + SPD − 12 fictional…" — and named no
      executable payload; replaced with a concrete 2-party Σ = majority case.)*

---

*Registry duties (add to `SECTION_KINDS`, dispatch in `SectionBody.astro`,
`explainers.ts` entry, `catalog.md` block, prefix doc in
`src/components/AGENTS.md` §4, showcase example) happen at implementation
(P6) — deliberately NOT done at blueprint time.*
