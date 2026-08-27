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

# margin-bullets — six margins, and the one that is short

> Blueprint for `margin-bullets`. Contract, not a suggestion — if implementation
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
| `kind` | `margin-bullets` |
| World | space |
| Tier | HTML bullet rows |
| Component path | `src/components/topic/space/MarginBullets.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-mbl` |
| Flagship reference | `benchmark-chart` (tech) for the HTML bar-row pattern; `delta-v-ladder` for the budget vocabulary |

## 2. What it shows / when to use

Several measurements, each against its own requirement and in its own unit. The reader learns which subsystems close and which do not, without being invited to compare quantities that do not compare.

- **USE WHEN:** 4–8 measurements each against its OWN requirement, in units that do not compare (dB, kg, °C, W), where whether each one closes is the argument.
- **DON'T USE:** values sharing one unit and scale (→ `benchmark-chart`, tech); a stacked energy budget (→ `delta-v-ladder`); telemetry band strengths (→ `signal-readout`); one measurement over time (→ `approval-chart`).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface MarginBulletsData {
  rows: {
    label: string;      // MUST carry or imply the unit — see §3 flags
    value: number;      // what it has
    required: number;   // what it needs
    max: number;        // the row's own full range, sets 100% width
    unit: string;       // ' dB', ' kg', ' °C', ' W' — leading space if the
                        // convention is "4.8 dB"
    note?: string;
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: margin-bullets
data:
  rows:
    - { label: Downlink margin,            value: 4.8,  required: 3.0, max: 8,   unit: ' dB', note: Comfortable. The high-gain antenna closes the link with room to spare at maximum range. }
    - { label: Uplink margin,              value: 6.2,  required: 3.0, max: 8,   unit: ' dB', note: The strongest margin on the spacecraft, because the transmitter is on the ground and can be arbitrarily large. }
    - { label: Ranging signal-to-noise,    value: 12.4, required: 9.0, max: 18,  unit: ' dB', note: Navigation holds. This is what turns an arrival prediction into an arrival measurement. }
    - { label: Thermal margin,             value: 11,   required: 5,   max: 20,  unit: ' °C', note: Eleven degrees between the hottest predicted case and the qualification limit. }
    - { label: Power margin,               value: 84,   required: 40,  max: 160, unit: ' W',  note: Healthy at arrival, and it degrades every year the mission is extended. }
    - { label: Propellant margin,          value: 22,   required: 30,  max: 60,  unit: ' kg', note: Eight kilograms short. Either a course correction gets deleted or the extended mission does. }
  caption: Five subsystems close with margin; propellant does not.
  source: Critical design review margin report, June 2026
```

**Each row is normalised to its OWN `max`.** Two bars of equal length mean
nothing in common — so the component **requires `unit` on every row** and prints
it in the value cell, and the "how to read" copy must say "each on its own scale".
There is no shared axis and none should be drawn. `required` must satisfy
`0 < required <= max` and `value <= max`; a violation **FAILS the build naming
the row**. No compression, **no honesty chip** — but the per-row normalisation is
stated in the plain line, which is this kind's equivalent.

## 4. Geometry spec

Pure HTML/CSS.

- **Row grid:** `grid-template-columns: 168px 1fr 104px`, `gap: 14px`,
  `padding: 9px 0`, 1px `--rule` bottom border.
  At 375px: `grid-template-columns: 1fr 84px` with the track on a second line.
- **Track:** `position: relative; height: 18px`, background `--paper-warm`.
- **Value bar:** absolutely positioned, `left: 0`, `width: value / max × 100%`.
- **Requirement tick:** absolutely positioned at `left: required / max × 100%`,
  `width: 2px`, `top: -3px; bottom: -3px` so it overhangs the track and stays
  visible when the bar covers it.
- **Value cell:** right-aligned, `{value}{unit}`, mono 700.
- **Readout panel:** three cells — subsystem, signed margin against requirement
  (`{±d}{unit}`, decimals matching the unit's convention: 1 dp for dB, 0 for
  kg/°C/W), and the note.
- **Legend:** three items — "Meets the requirement" (accent swatch), "Short of it"
  (alt swatch), "Requirement" (a 2px × 12px tick), in a wrapping flex.
- **No shared gridlines.** Deliberately absent; a gridline across rows would
  imply a common scale.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Bars do not grow.
- **On selection:** row background swaps to `--paper-warm`; readout swaps
  (`aria-live`). No bar transition.
- **Composed still:** the failing row selected (the argument), all bars and ticks
  painted, legend visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| track | `--paper-warm` @ 1.0 |
| value bar, meets requirement | `--accent` @ 1.0 |
| value bar, short | `--accent-alt` @ 1.0 |
| requirement tick | `--ink` @ 1.0 (2px) |
| row border | `--rule` @ 1.0 |
| row background, selected | `--paper-warm` |
| row label, rest | `--ink` @ 0.80 |
| row label, selected | `--ink` @ 1.0 |
| value cell | matches its bar (`--accent` / `--accent-alt`) |
| readout margin, positive | `--accent` @ 1.0 |
| readout margin, negative | `--accent-alt` @ 1.0 |
| legend text | `--ink` @ 0.65 |

**Declared:** the pass/short pair is `--accent` / `--accent-alt`, never
green/red. Several worlds already own a red or a lime accent, and a hard-coded
red would either clash or read as the world's own accent.

## 7. Fallback design

Build-time HTML:

1. All rows painted — bars, ticks, value cells, legend.
2. The readout painted for the failing row (or the last row if all pass).
3. A `<table>`: subsystem, value, requirement, margin, unit. AT-readable source.

No JS needed to see which subsystem is short — the bar/tick relationship carries
it, and the value cell's colour reinforces it.

## 8. Interaction spec

**One control** — row selection.

- **Targets:** each row is a `<button>`, `aria-pressed`, tab order in array
  order.
- **Readout template** (`aria-live="polite"`):
  `"{label} — {value}{unit} against a requirement of {required}{unit}: {±d}{unit}. {note}"`
  and where negative, append `"This subsystem does not close."`
- **Re-press** returns to the default row.
- **Keyboard:** complete; `↑`/`↓` step rows, `Esc` restores default.

## 9. Comprehension text

- **`what`**: "One row per subsystem, each drawn on its own scale because
  decibels and kilograms do not compare. The bar is what the spacecraft has, the
  tick is what it is required to have, and a bar stopping short of its tick is a
  subsystem that does not close."
- **`how`**: "Compare each bar to its own tick, never to another row. The
  readout gives the signed margin against requirement in that row's unit."
- **Caption guidance:** the count that closes and the one that does not — "five
  subsystems close with margin; propellant does not".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 100 |
| `data` payload | ≤ 2 KB |
| Island JS | ≤ 0.8 KB minified, inline |
| Rows | 4–8 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Every row carries a `unit`, printed in the value cell; a missing unit fails the build
- [ ] `required > max` or `value > max` fails the build, naming the row
- [ ] No gridlines or shared axis are drawn across rows
- [ ] The requirement tick overhangs the track (visible even when the bar covers its position)
- [ ] Short rows use `--accent-alt`, not a hard-coded red
- [ ] Signed margin decimals match the unit convention (4.8 dB → 1 dp; 84 W → 0 dp)
- [ ] The plain line states that each row is on its own scale
- [ ] Default selection is the failing row
- [ ] 375px: track moves to its own line, value cell stays readable
- [ ] No-JS: all rows + failing-row readout + table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-space-showcase`.*
