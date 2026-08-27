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

# attrition-waffle — a hundred people set out

> Blueprint for `attrition-waffle`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/travel.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `attrition-waffle` |
| World | travel |
| Tier | HTML 10×10 grid + one group-select island |
| Component path | `src/components/topic/travel/AttritionWaffle.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-waf` |
| Flagship reference | `commit-grid` (tech) for the cell grid; `bill-funnel` (politics) for the attrition vocabulary |

## 2. What it shows / when to use

A rate drawn as a hundred countable squares, grouped by outcome. The reader learns a published completion rate by counting it rather than trusting it.

- **USE WHEN:** a rate out of exactly 100 with 3–6 outcome groups, where the point is that the reader can COUNT it — a published completion or survival rate that deserves auditing.
- **DON'T USE:** any n not normalised to 100 (the countability IS the kind); a distribution of a continuous value (→ `price-swarm`); stages of attrition in order (→ `bill-funnel`, politics); a part-of-whole where area is the quantity (→ `revenue-mosaic`, tech).
- **Pairs with:** `default`. Not hero-capable — at hero scale the squares stop reading as countable units.

## 3. Data schema

```ts
interface AttritionWaffleData {
  n?: 100;             // literal 100; present for documentation
  trueN?: number;      // the REAL sample size, if not 100 — see §3 flags
  subject?: string;    // 'trekkers', 'patients' — used in the readout
  groups: {
    id: string;
    label: string;
    count: number;     // Σ must be exactly 100
    color?: string;
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: attrition-waffle
data:
  n: 100
  subject: trekkers
  groups:
    - { id: full,    label: Completed the full circuit,   count: 41, note: Forty-one of a hundred. Every published completion rate for this route is quoted from the permit count, not this one. }
    - { id: pass,    label: Turned back at the high pass, count: 27, note: The pass is the single point of failure — more people stop here than everywhere else combined. }
    - { id: alt,     label: Stopped by altitude sickness, count: 16, note: Almost all of these turned back below the pass, on the two days of fastest ascent. }
    - { id: weather, label: Stopped by weather,           count: 11, note: Eleven, and nine of those in a single week when the pass was closed by snow. }
    - { id: other,   label: 'Injury, illness, other',     count: 5,  note: Five, of which two were evacuated by helicopter. }
  caption: Fifty-nine of a hundred did not finish, and 43 of those stopped for the same reason.
  source: Checkpoint registers, autumn season 2025 · n = 100
```

**Counts must sum to exactly 100** — not 99.8, not 100.2 — or the build
**FAILS printing the actual sum**. If the real sample is not 100, set `trueN` and
the component renders the chip `per hundred · n = {trueN}` and the caption must
state the true n. Rounding to reach 100 is permitted only when `trueN` is set, and
the largest group absorbs the rounding remainder (documented in the component so
the choice is not arbitrary). **No other honesty chip** — nothing is scaled;
squares are the data.

## 4. Geometry spec

Pure HTML/CSS grid.

- **Grid:** `grid-template-columns: repeat(20, 1fr)`, `gap: 3px`. Twenty across
  by five down, not ten by ten — a 20-wide block fits the 720px column at a
  comfortable cell size and still reads as "a hundred".
- **Cell:** `aspect-ratio: 1`, no radius. At 720px each cell is ~32px; at 375px
  ~15px. **15px is the countability floor** — below it the grid becomes a texture.
- **Fill order:** row-major from the top-left, in `groups` array order. **No
  interleaving** — each group is one contiguous block, which is what makes the
  proportions countable at a glance.
- **Ledger** below the grid: one row per group,
  `grid-template-columns: 1fr 44px`, `gap: 12px`, `padding: 8px 0`, 1px
  `--rule` bottom border. Swatch (10px) + label, then the count right-aligned in
  mono 700.
- **Note line** below the ledger: a single `<p>`, 12.5px, that carries the
  selected group's note or the default prompt.
- **375px:** the grid stays 20-wide (dropping to 10-wide would double the rows and
  break the five-row silhouette); cells shrink to 15px.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Cells do not stagger or count up —
  an animated waffle turns an auditable figure into a performance.
- **On selection:** cells outside the group drop to 0.2 over 120ms ease-out;
  the ledger row takes the selected background.
- **Composed still:** nothing selected — all groups at full opacity, ledger
  complete, note line showing the default prompt.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| group 1 (the success group) | `--accent-deep` @ 1.0 |
| group 2 | `--accent` @ 1.0 |
| group 3 | `--accent` mixed toward `--paper` 30% |
| group 4 | `--ink` @ 0.55 |
| group 5–6 | `--ink` @ 0.34 / 0.22 |
| cell, dimmed | own colour @ 0.20 |
| ledger row border | `--rule` @ 1.0 |
| ledger row, selected | background `--paper-warm`, text `--ink` |
| ledger label, rest | `--ink` @ 0.78 |
| count | `--ink` @ 1.0, mono 700 |

An ordered ramp, not a palette: the groups are outcomes on a single axis
(finished → stopped for progressively more specific reasons), so the colour
should read as a sequence. `groups[].color` is available but is **not** a
data-encoding exemption.

## 7. Fallback design

Build-time HTML:

1. The **whole grid**, every cell filled in group order.
2. The **ledger** with every count.
3. The **note line** with the default prompt, plus every group's note in a
   `<dl>` below it, so no note is reachable only by pressing.

The grid carries `role="img"` with an `aria-label` naming the headline split
(`"41 of 100 completed; 59 did not"`), and the ledger is the AT-readable source —
100 individual cells of AT output would bury the argument.

## 8. Interaction spec

**One control** — group selection.

- **Targets:** each ledger row is a `<button>`, and each contiguous cell block is
  itself pressable (the whole block shares one handler, so a stray tap on any of
  its cells selects the group). Tab order: the ledger rows only — cells are not
  in the tab order, since the ledger row is the same control.
- **Readout template** (`aria-live="polite"`):
  `"{label} — {count} of 100 {subject}. {note}"`
- **Re-press** clears back to the default prompt.
- **Keyboard:** complete via the ledger; `Esc` clears.

## 9. Comprehension text

- **`what`**: "A hundred squares, one per person who started, grouped by where
  they stopped. Nothing is scaled or estimated — you can count the squares, and
  each colour block is exactly as many people as it looks like."
- **`how`**: "Press a group to isolate it and read why it stopped there. Counting
  the squares is the point: this is a rate you can audit."
- **Caption guidance:** the headline split plus the concentration — "fifty-nine of
  a hundred did not finish, and 43 of those stopped for the same reason".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 160 (100 cells + ledger + notes) |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Groups | 3–6 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Counts not summing to exactly 100 fail the build, printing the actual sum
- [ ] `trueN` renders the `per hundred · n = {trueN}` chip, and the caption states the real n
- [ ] Cells fill row-major in group order; each group is ONE contiguous block
- [ ] Cells are ≥ 15px at 375px, and the grid stays 20 columns wide
- [ ] Colours form an ordered ramp, not an arbitrary palette
- [ ] Grid is `role="img"` with a split-describing label; the ledger is the AT source
- [ ] Cells are not individually in the tab order
- [ ] Every group's note is present in the `<dl>` without JS
- [ ] No count-up or stagger animation
- [ ] No-JS: grid + ledger + default prompt + notes list

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-travel-showcase`.*
