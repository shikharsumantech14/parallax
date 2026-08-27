<!-- ────────────────────────────────────────────────────────────────────────────
 COPIED FROM THE DESIGN HANDOFF, 2026-08-27, WITH FOUR STANDING CORRECTIONS.

 The handoff folder is a delivered artifact; this is the in-repo contract. Where
 they differ, THIS file wins, because the handoff could not know the repo.

 1. SVG TEXT — the handoff TYPE-MAPPING.md:25 prescribes
    font-family="var(--font-mono)". Do not use it. NOT because var() fails —
    measured 2026-08-27, it resolves fine in Chromium — but because a
    presentation attribute is the lowest-specificity thing in CSS, so any
    stylesheet rule silently beats it, and because satori/resvg do no var()
    substitution when they rasterise the OG cards. Use a LITERAL stack in a
    style attribute:
      style="font-family:'JetBrains Mono',ui-monospace,monospace"
    (RD-01b. See src/components/AGENTS.md section 5.)

 2. TOKENS — the three tokens this blueprint may reference resolve per
    docs/design/TOKEN-RECORD.md: --paper-warm is REAL (TD-01, six measured
    values); --paper-deep is an ALIAS of it (TD-02), not a second surface;
    --accent-warm maps to --accent-alt (TD-03, flagged — check it against
    this blueprint section 6).

 3. DISPATCH — ignore registry/SectionBody.diff.md. Its arms read
    {kind === x && <X data={section.data} />}: there is no bare "kind"
    variable in SectionBody.astro, and NO component in this repo takes a
    "data" prop. "Fixing" it by prepending section. renders the component on
    its prop defaults — an empty chart, no error, green build. Use the repo
    idiom: {section.kind === x && <X ...flat named props />}

 4. EXPLAINER LENGTH — "plain" is Zod-capped at 220 chars and 13 of the 28
    supplied "what" strings exceed it. The EXPLAIN map is uncapped, so a long
    string is safe THERE, but an author copying it into a section plain:
    breaks the build. Keep EXPLAIN entries under 220 and move the surplus
    into "howToRead", which is capped at 360.

 Also: the SCREENSHOT is reference only. Four of them contain real ledger
 overflow bugs that these blueprints already document and correct — where
 they disagree, the blueprint wins.
──────────────────────────────────────────────────────────────────────────── -->

# debris-histogram — the debris nobody can see

> Blueprint for `debris-histogram`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/space.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `debris-histogram` |
| World | space |
| Tier | SVG log-axis bars + one filter island |
| Component path | `src/components/topic/space/DebrisHistogram.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-dbh` |
| Flagship reference | `moore-ladder` (tech) for the log-axis treatment and its honesty chip; `launch-stats` for the bar vocabulary |

## 2. What it shows / when to use

A population sorted into size bins on a scale where each step is ten times the last. The reader learns that the trackable objects are a small fraction of the hazard.

- **USE WHEN:** a size- or magnitude-binned population spanning ≥3 orders of magnitude (5–8 bins), where a detectability or capability threshold splits the bins and the invisible majority is the argument.
- **DON'T USE:** a constellation's spatial distribution (→ `constellation-swarm`); counts over time (→ `launch-stats`); a value distribution with real samples (→ `pace-ridge`, sports); a part-of-whole split (→ `data-readout`).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface DebrisHistogramData {
  bins: {
    label: string;      // e.g. '1–5 cm', ascending
    count: number;
    flagged?: boolean;  // true = passes the capability threshold (trackable)
    note?: string;
  }[];
  flagLabel?: string;   // default 'Trackable only'
  countUnit?: string;   // default 'objects'
  caption?: string;
  source?: string;
}
```

```yaml
kind: debris-histogram
data:
  countUnit: objects
  flagLabel: Trackable only
  bins:
    - { label: 1–5 cm,        count: 128000, flagged: false, note: Too small to track, large enough to end a mission. This bar is the actual risk. }
    - { label: 5–10 cm,       count: 34000,  flagged: false, note: Detected occasionally, catalogued almost never. Nothing manoeuvres around these. }
    - { label: 10–20 cm,      count: 9382,   flagged: true,  note: The smallest size radar holds reliably. Everything from here up has a name and an orbit. }
    - { label: 20–50 cm,      count: 3100,   flagged: true,  note: Catalogued, and the source of most conjunction warnings. }
    - { label: 50 cm – 1 m,   count: 940,    flagged: true,  note: Mostly spent upper stages and dead satellites. }
    - { label: 1–3 m,         count: 310,    flagged: true,  note: A collision here would create thousands of new objects in the bins to the left. }
    - { label: over 3 m,      count: 84,     flagged: true,  note: Intact derelict spacecraft. Each one is a future debris cloud waiting for a trigger. }
  caption: 175,816 objects, of which 13,816 can be tracked.
  source: Orbital debris catalogue and statistical size model, 2026
```

**Log₁₀ y-axis — always chipped.** The component auto-renders
`log scale · each step ×10`. Gridlines are labelled `10¹ … 10ⁿ` with superscript
digits, never raw numbers, and **every bar carries its true count as a mono label
above it** so the actual magnitude is always recoverable. Counts must be > 0 (a
log axis cannot render zero); a zero or negative count **FAILS the build naming
the bin**.

## 4. Geometry spec

`viewBox="0 0 440 240"`, `width:440px; height:240px`.

- **Plot floor** y 202, x 46 → 424. **Log ceiling** is `ceil(log10(maxCount))`
  rounded up to the next integer, with 170px of usable height:
  `h(count) = log10(count) / ceilExp × 170`, bar top `y = 202 − h`.
  For the example, `ceilExp = 5.4` gives 128,000 ≈ 165px.
- **Bars** 44px wide, pitch 53px: `x = 52 + i · 53`, centre `cx = x + 22`.
  For 8 bins, pitch becomes `(378 − 44) / (n − 1)`.
- **Gridlines** at each integer power, x 46 → 424, 1px, labelled at `x = 40`,
  `text-anchor="end"`, `y + 3.5`, as `10¹`…`10⁵` (superscript glyphs
  `¹²³⁴⁵`).
- **Bin label** at `cx`, `y = 220`, `text-anchor="middle"`, 9px mono.
- **Count label** at `cx`, `y = barTop − 6`, `text-anchor="middle"`, 9.5px
  mono 700, abbreviated (`128k`, `9,382`) with the full value in the readout.
- **Axis title** `OBJECT SIZE` at `x = 235, y = 236`.
- **375px:** bars narrow to `(width − 60)/n` and bin labels rotate −45°
  (`text-anchor="end"`, transform about their own anchor). Count labels drop to
  the readout only if the bar is under 26px wide.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Bars do not grow from the axis — on a
  log scale a growing bar animates through wrong magnitudes.
- **Filter switch:** unflagged bars fade to 0.16 over 150ms ease-out. They are
  **dimmed, never removed** — removing them hides the argument.
- **Composed still:** all bins shown (filter off), first bin selected, all count
  labels present.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| bar, flagged (trackable) | `--accent` @ 1.0 |
| bar, unflagged | `--accent-alt` @ 1.0 |
| bar, selected | `--accent` lightened (`color-mix` toward `--paper` 30%) |
| bar, dimmed by filter | own colour @ 0.16 |
| gridlines | `--rule` @ 1.0 |
| power labels | `--ink` @ 0.50 |
| bin labels | `--ink` @ 0.55 |
| count labels | `--ink` @ 0.85; dimmed `--ink` @ 0.30 |
| axis title | `--ink` @ 0.45 |
| filter chip, active | background `--accent`, text `--paper-deep` |
| readout "Trackable: no" | `--accent-alt` |

`--accent-alt` for the untrackable bins is the one categorical use of a second
hue in this kind, and it is the whole point: the two tallest bars are a different
colour from every bar the tracking system can see.

## 7. Fallback design

Build-time SVG:

1. The **full histogram**, all bins, all count labels, log gridlines, the chip.
2. The **readout** for the first bin.
3. A `<table>`: bin, count, trackable yes/no, share of total. AT-readable
   source; SVG `aria-hidden="true"`.

The filter chips ship `hidden`; the unfiltered view is the default and carries
the argument on its own.

## 8. Interaction spec

**One control** — the trackable filter, plus bar selection for the readout.

- **Filter:** two chips (`All objects` / `{flagLabel}`), `aria-pressed`, two tab
  stops. Dims unflagged bars and swaps the plain line to the filtered wording.
- **Selection:** each bar is a `<button>`, tab order left to right.
- **Readout template** (`aria-live="polite"`):
  `"{label} — {count} {countUnit}, {pct}% of all. Trackable: {yes|no}. {note}"`
- **Filter announcement:** `"Showing {all objects | trackable objects only} — {n} of {total}."`
- **Keyboard:** complete; `←`/`→` step bins, chips are separate tab stops.

## 9. Comprehension text

- **`what`**: "Objects in orbit sorted into size bins, smallest on the left, on
  a scale where each gridline is ten times the one below it — so a bar one step
  taller means ten times as many objects, not twice."
- **`how`**: "Switch to trackable-only to see what radar can actually hold. The
  gap between the two views is the part of the hazard that no collision-avoidance
  system can see."
- **Caption guidance:** the two totals — "175,816 objects, of which 13,816 can be
  tracked".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 120 |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 1 KB minified, inline |
| Bins | 5–8 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] The `log scale · each step ×10` chip always renders
- [ ] Gridlines are labelled as powers (`10¹`…), never as raw numbers
- [ ] Every bar carries its true count as a label (or the readout does, below 26px)
- [ ] A zero or negative count fails the build, naming the bin
- [ ] Bar heights are `log10(count)`-proportional: the 128k bar is not ~14× the 9,382 bar
- [ ] The filter DIMS unflagged bins to 0.16; it does not remove them
- [ ] Unflagged bins use `--accent-alt`, and the readout states "Trackable: no"
- [ ] Filtered plain line differs from the unfiltered one
- [ ] 375px: bin labels rotate −45° and do not collide
- [ ] No-JS: full histogram + first-bin readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-space-showcase`.*
