<!-- ────────────────────────────────────────────────────────────────────────────
 COPIED FROM THE DESIGN HANDOFF, 2026-08-27, WITH FOUR STANDING CORRECTIONS.

 The handoff folder is a delivered artifact; this is the in-repo contract. Where
 they differ, THIS file wins, because the handoff could not know the repo.

 1. SVG TEXT — the handoff TYPE-MAPPING.md:25 prescribes
    font-family="var(--font-mono)". A CSS variable inside an SVG PRESENTATION
    ATTRIBUTE does not resolve; every axis label would silently render in the
    browser default serif. Use a LITERAL stack in a style attribute:
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

# bill-funnel — where a session’s bills actually stopped

> Blueprint for `bill-funnel`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/politics.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `bill-funnel` |
| World | politics |
| Tier | HTML bars (no SVG) |
| Component path | `src/components/topic/politics/BillFunnel.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-fnl` |
| Flagship reference | `bill-passage` for the stage vocabulary; `benchmark-chart` for the HTML bar-row pattern |

## 2. What it shows / when to use

A population of bills counted again at each stage it had to clear. The reader learns where the real attrition is, which is rarely the vote.

- **USE WHEN:** a POPULATION of bills counted at each procedural stage in order — ≥4 stages, counts monotonically non-increasing — where the attrition between stages is the argument.
- **DON'T USE:** ONE bill's journey through the stages (→ `bill-passage`); what a bill contains (→ `bill-breakdown`); a dated legislative history (→ `timeline`).
- **Pairs with:** `default`. **Never `split`** — the bar lengths need the full column measure to stay comparable.

## 3. Data schema

```ts
interface BillFunnelData {
  stages: {
    label: string;
    count: number;    // still alive at this stage
    note?: string;    // surfaced in the readout on press
  }[];
  unit?: string;      // default 'bills'
  caption?: string;
  source?: string;
}
```

```yaml
kind: bill-funnel
data:
  unit: bills
  stages:
    - { label: Introduced,             count: 214, note: Every bill placed before the house in the 2024–26 session. }
    - { label: Referred to committee,  count: 131, note: 83 were never referred. A bill that skips committee skips the only stage at which witnesses are heard. }
    - { label: Committee reported,     count: 88,  note: 43 reports were still outstanding when the session ended. }
    - { label: Debated in the house,   count: 71,  note: 17 were listed for debate and never reached. }
    - { label: Passed the lower house, count: 63,  note: 8 fell at the division. }
    - { label: Passed the upper house, count: 49,  note: 14 are still with the upper house and lapse if the session closes. }
    - { label: Received assent,        count: 47,  note: 2 were returned for reconsideration and have not come back. }
  caption: 214 bills went in and 47 came out with assent.
  source: House bulletins and committee reports, 2024–26 session
```

**A funnel cannot widen.** If any stage's `count` exceeds the stage before
it, the build **FAILS naming the stage**. The per-row loss is DERIVED
(`stages[i−1].count − stages[i].count`) and must never be authored — an authored
loss can disagree with the counts. No compression, **no honesty chip**.

## 4. Geometry spec

Pure HTML/CSS grid — no SVG, no `viewBox`.

- **Row grid:** `grid-template-columns: 186px 1fr 92px` with `gap: 14px`,
  `padding: 7px 0`, and a 1px `--rule` bottom border per row.
  At 375px: `grid-template-columns: 1fr 64px` with the bar on its own second line.
- **Bar track** is `height: 17px`, background `--paper-warm`, spanning the middle
  column. Inside it, two spans in flow:
  - **survived** `width: count / stages[0].count × 100%`
  - **lost** `width: (prev.count − count) / stages[0].count × 100%`
  Together they always end at the previous row's total width, so the step-down
  between rows is visible as the white gap growing to the right.
- **Scale is shared across all rows**, normalised to `stages[0].count`. This is
  what makes it a funnel rather than seven independent bars.
- **Value cell** right-aligned: `{count}` in mono 700, then `−{lost}` in
  `--ink` @ 0.5 at 400 weight. Row 1 has no loss figure.
- **Readout panel** below the rows: a 3-cell flex — stage name, survival
  percentage (`count / stages[0].count`), and the `note`. Background
  `--paper-warm`, `padding: 10px 13px`.
- **Labels never truncate.** `stages[].label` wraps to two lines if needed; the
  186px column is sized for "Passed the lower house" at 12.5px.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Bars do NOT animate their width —
  a growing funnel bar reads as data changing.
- **On press:** the row background and the readout swap with no transition
  (`aria-live`).
- **Composed still:** the last stage selected (the session's actual output),
  all rows painted at full width, readout showing that stage's note.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| bar track | `--paper-warm` @ 1.0 |
| survived segment, rest | `--accent` @ 1.0 |
| survived segment, selected row | `--ink` @ 1.0 |
| lost segment | `--accent` @ 0.34 |
| row border | `--rule` @ 1.0 |
| row background, selected | `--paper-warm` |
| stage label, rest | `--ink` @ 0.78 |
| stage label, selected | `--ink` @ 1.0 |
| count | `--ink` @ 1.0, mono 700 |
| loss figure | `--ink` @ 0.50 |
| readout survival % | `--accent-deep` |

The selected row inverts to `--ink` rather than brightening the accent, so the
selection never competes with the loss segments for attention.

## 7. Fallback design

Entirely build-time HTML. With no JS:

1. All rows painted, bars at their correct proportions.
2. The readout panel painted for the **last** stage (the default selection).
3. Every stage's `note` also present as a `<dl>` below the readout, so no note
   is reachable only by pressing. This is the AT-readable source.

The rows become `<button>`s only when the island runs; without it they are
plain `<div>`s with no interactive affordance.

## 8. Interaction spec

**One control.**

- **Targets:** each row is a `<button>`, `aria-pressed`, one tab stop each, in
  stage order.
- **Effect:** the row inverts and the readout swaps to that stage's name,
  survival percentage and note.
- **Readout template** (`aria-live="polite"`):
  `"{stage} — {count} of {total} still alive, {pct}%. {note}"`
- **Re-press** to return to the default (last) stage.
- **Keyboard:** complete via the row buttons. `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "The same set of bills counted again at every stage they had to
  clear, in order. Bar length is how many were still alive at that point, and the
  FADED segment on each row is what was lost since the row above it."

  > CORRECTED 2026-08-27: this line said "darker". Section 6 paints the lost
  > segment at `--accent` @ 0.34 — PALER than the survived segment at 1.0 — so
  > the copy contradicted the drawing. The same wrong word is in the handoff
  > registry/explainers.entries.ts and in mdx/politics/bill-funnel.mdx; both are
  > corrected where they land in the repo.
- **`how`**: "Press a stage to read what happened there. The widening white
  space to the right of the bars is the real output of the session."
- **Caption guidance:** the input and the output as one sentence — "214 bills
  went in and 47 came out with assent".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 120 |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 0.8 KB minified, inline |
| Stages | 4–10 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] A stage with a higher count than its predecessor fails the build, naming the stage
- [ ] Per-row loss is derived; an authored `lost` field is ignored or rejected
- [ ] All bars share one scale normalised to stage 1 (measure two rows to confirm)
- [ ] Row 1 shows no loss figure
- [ ] Survival percentage in the readout matches `count / stages[0].count`
- [ ] No-JS: last stage's readout painted, and every note present in the `<dl>`
- [ ] 375px: bar moves to its own line, labels do not truncate
- [ ] Keyboard: every stage reachable, `Esc` restores the default

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in
`2026-06-03-politics-showcase`.*
