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

# majority-flow — where a majority actually comes from

> Blueprint for `majority-flow`. Contract, not a suggestion — if implementation
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
| `kind` | `majority-flow` |
| World | politics |
| Tier | SVG (build-time Sankey layout + one chip-set island) |
| Component path | `src/components/topic/politics/MajorityFlow.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-mfl` |
| Flagship reference | `power-flow` for the band geometry and conservation check; `coalition-calculus` for the reader-agency pattern and the aria-live verdict |

## 2. What it shows / when to use

Every seat in a chamber enters as one of several party groups, merges into a bloc, and arrives at a single question: can that bloc pass a law on its own. The reader learns which partners the largest bloc cannot afford to lose.

- **USE WHEN:** a standing chamber where the route to a working majority IS the argument — the dossier has every group's seat count (Σ = chamber total), a bloc assignment per group, and the majority threshold; and at least one bloc member is load-bearing (removing it drops the bloc below the line).
- **DON'T USE:** money or authority moving between institutions (→ `power-flow`); one division's blocs splitting for/against/abstain (→ `vote-flow`); coalition arithmetic played out on a single bar (→ `coalition-calculus`); the chamber as a portrait (→ `chamber`).
- **Pairs with:** `wide`, hero-capable. **Never `split`** — the 3-layer flow needs the full measure, and a scroll column would fight the group ledger.

## 3. Data schema

```ts
interface MajorityFlowData {
  groups: {
    id: string;
    label: string;
    seats: number;        // seats, integer
    bloc: string;         // must match a blocs[].id
    color?: string;       // data-encoding exemption (party colour)
  }[];
  blocs: {
    id: string;
    label: string;
    canLegislate: boolean; // does this bloc clear `majority` alone?
    color?: string;
  }[];
  majority: number;        // seats needed to pass, integer
  chamberTotal: number;    // Σ groups[].seats must equal this
  unit?: string;           // default 'seats'
  caption?: string;
  source?: string;
}
```

```yaml
kind: majority-flow
data:
  majority: 272
  chamberTotal: 543
  groups:
    - { id: gov,    label: Government,           seats: 240, bloc: g, color: '#b8341f' }
    - { id: allyA,  label: Ally · western states, seats: 28, bloc: g }
    - { id: allyB,  label: Ally · north-east,     seats: 25, bloc: g }
    - { id: opp,    label: Main opposition,       seats: 99, bloc: o }
    - { id: regC,   label: Regional · south,      seats: 42, bloc: o }
    - { id: regD,   label: Regional · east,       seats: 37, bloc: o }
    - { id: unal,   label: Unaligned,             seats: 72, bloc: u }
  blocs:
    - { id: g, label: Government bloc, canLegislate: true }
    - { id: o, label: Opposition bloc, canLegislate: false }
    - { id: u, label: Unaligned,       canLegislate: false }
  caption: The government bloc clears the majority by 21 seats.
  source: Lok Sabha party rolls and coalition agreements, June 2026
```

**Conservation, checked at build.** Σ `groups[].seats` must equal
`chamberTotal`, and each bloc's inflow must equal the sum of its groups. A
mismatch **FAILS the build naming the offending group** — the same contract
`power-flow` uses. No visual compression is applied anywhere in this kind, so it
renders **no honesty chip**; seat counts are drawn at true proportion.

## 4. Geometry spec

Three columns in a `viewBox="0 0 810 430"` (the 1080px breakout measure at
0.75 scale; `width:100%; height:auto`).

| Element | x | width |
|---|---|---|
| group nodes | 183 | 16 |
| group labels | 175, `text-anchor="end"` | — |
| bloc nodes | 436 | 16 |
| bloc labels | 458, `text-anchor="start"` | — |
| outcome nodes | 666 | 16 |
| outcome labels | 688, `text-anchor="start"` | — |
| majority rule | 452 → 800 | 1px dashed `4 3` |

- **Vertical scale** `k = 0.62` px per seat. **Gap** between sibling nodes
  `9px`. Column top offsets: groups `26`, blocs `26 + 2·gap`, outcomes
  `26 + 2.5·gap` — the staggered tops keep the three columns visually centred
  without computing a true centre-of-mass.
- **Node height** `h = seats · k`, minimum `3px`.
- **Ribbon** between `(x1,y1,h1)` and `(x2,y2,h2)` is a closed path with two
  cubic edges sharing a mid control-x `mx = (x1+x2)/2`:
  `M x1 y1 C mx y1, mx y2, x2 y2 L x2 y2+h2 C mx y2+h2, mx y1+h1, x1 y1+h1 Z`
- **Stacking order.** Ribbons enter each bloc node in `groups` array order,
  accumulating a running offset per bloc; same for bloc → outcome. Order is
  therefore authored, and the ledger's order matches the visual order.
- **Majority rule y** = `outcomeTop + majority · k`, with its label at
  `y − 6`, `text-anchor="end"` at x 800.
- **Labels.** Group labels are `{label} · {seats}`, blocs `{label} · {seats}`,
  outcomes `{label}` with `{seats} seats` on a second line ONLY if the node is
  ≥ 34px tall; below that, one line `{label} · {seats}`. Never two `<text>`
  elements at the same y in the outcome column — that was the prototype's
  collision.
- **375px.** Columns collapse to a stacked list: the SVG is replaced by the
  group ledger + bloc subtotals + the verdict. A 3-layer Sankey is illegible
  below ~560px and the table is the honest small-screen form.

## 5. Motion spec

- **Entrance:** `reveal` on the card root (opacity 0 → 1, 200ms ease-out, first
  viewport entry only).
- **Ribbons:** no ambient motion. `power-flow`'s `flowDash` is deliberately NOT
  used — seats do not flow continuously, and an animated dash would imply a rate.
- **On selection:** dimmed ribbons cross-fade opacity over 120ms ease-out. The
  readout text swaps with no transition (it is `aria-live`; animating it delays
  the announcement).
- **Composed still** (= reduced-motion = print): nothing selected. All ribbons at
  their rest opacity, all three columns labelled, majority rule visible, the
  verdict reading the unselected summary.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| group / bloc / outcome nodes | party `color` if given, else `--accent` @ 1.0 |
| ribbon, group → bloc | source group's colour @ 0.34 |
| ribbon, bloc → outcome | bloc's colour @ 0.26 |
| ribbon, dimmed (other group selected) | same hue @ 0.07 |
| node, dimmed | own colour @ 0.20 |
| column eyebrows (GROUPS / BLOCS / OUTCOME) | `--ink` @ 0.50 |
| labels, active | `--ink` @ 1.0 |
| labels, dimmed | `--ink` @ 0.35 |
| majority rule + its label | `--ink` @ 0.70 |
| ledger row, selected | background `--paper-warm`, text `--ink` |
| verdict — bloc still clears | `--ink` @ 0.55 |
| verdict — bloc falls short | `--accent-deep` |

**Data-encoding exemption:** party `color` values, on the same terms as
`chamber` and `coalition-calculus` — the ledger legend lists every one. Omit
them and the fallback is a single-accent-plus-ink cycle.

## 7. Fallback design

The print edition, not an apology. With no JS the component paints:

1. The **full three-column Sankey** at rest — build-time layout, so every ribbon,
   node, label and the majority rule are already in the markup.
2. The **group ledger** as a real `<table>`: group, seats, bloc. This is the
   AT-readable data source; the SVG is `aria-hidden="true"`.
3. The **unselected verdict** as static text: the bloc's total, the threshold, and
   the margin between them.

Nothing is dropped. The chip-set control ships `hidden` and is unhidden by the
island, exactly as `coalition-calculus` does it.

## 8. Interaction spec

**One control**, following the `coalition-calculus` pattern.

- **Target:** the group ledger rows and the group nodes are the same control —
  both are `<button>`s inside the ledger/SVG, `aria-pressed`, one tab stop each,
  in array order. `touch-action: pan-y`.
- **Effect:** selecting group *g* dims every ribbon not originating at *g*, and
  replaces the verdict with the walk-out counterfactual.
- **Verdict template** (`aria-live="polite"`):
  - member of a legislating bloc, still clears: `"{bloc} holds {n} without {group} — still {margin} above {majority}."`
  - member of a legislating bloc, falls short: `"Without {group} the bloc holds {n} — {short} short of {majority}. {group} is load-bearing."`
  - outside every legislating bloc: `"{group} sits outside the governing bloc; its exit changes nothing about whether a law passes."`
- **Re-press** the selected group to clear back to the summary.
- **Keyboard:** complete via the ledger buttons. `Esc` clears the selection.
- **AT:** the table + the `aria-live` verdict carry the entire content.

## 9. Comprehension text

- **`what`** (plain-line default; `src/lib/explainers.ts`): "Every seat in the
  house enters on the left as one of several groups, merges into a bloc in the
  middle, and arrives on the right at the only question that matters — whether
  that bloc can pass a law alone. Ribbon thickness is seats, and the dashed line
  is the number needed."
- **`how`** (ExpandModal): "Press any group to follow its seats through the
  flow. The readout answers what happens to the majority if that group walks out
  — which is how you find the partners the bloc cannot afford to lose."
- **Caption guidance:** state the arithmetic claim, not the form — "the
  government bloc clears the majority by 21 seats", not "a Sankey of the
  chamber".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 220 (≤ 8 groups × 2 paths + labels) |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 1.2 KB minified, inline |
| Groups | ≤ 8 (above that the ledger is the better kind) |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Σ `groups[].seats` ≠ `chamberTotal` fails the build, naming the group
- [ ] A group whose `bloc` matches no `blocs[].id` fails the build
- [ ] Ribbon widths are proportional: a 240-seat group's band is exactly 8× a 30-seat group's
- [ ] Selecting a load-bearing ally reads "…is load-bearing" and the verdict turns `--accent-deep`
- [ ] Selecting a non-bloc group reads "…changes nothing" and the verdict stays `--ink` @ 0.55
- [ ] Outcome-column labels never render two `<text>` at the same y (check the ≥34px branch)
- [ ] No-JS: full Sankey + ledger + summary verdict all present; control hidden
- [ ] Keyboard: every group reachable, `aria-pressed` correct, `Esc` clears
- [ ] 375px: SVG replaced by the ledger, not shrunk

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in
`2026-06-03-politics-showcase`.*
