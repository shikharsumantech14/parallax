# mission-timeline — four years, and the seven minutes inside them

> Blueprint for `mission-timeline`. Contract, not a suggestion — if implementation
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
| `kind` | `mission-timeline` |
| World | space |
| Tier | HTML gantt (no SVG) |
| Component path | `src/components/topic/space/MissionTimeline.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-mtl` |
| Flagship reference | `bill-passage` for the stage-card vocabulary; `descent-profile` for the milestone-diamond treatment |

## 2. What it shows / when to use

A mission's phases laid on one elapsed clock, so their real durations are comparable. The reader learns that the phase the whole mission exists to deliver occupies almost none of it.

- **USE WHEN:** a mission's phases on ONE elapsed clock (4–8 phases) plus fixed milestones, where the disproportion between phase durations is the argument — typically one decisive phase that is orders of magnitude shorter than the transit around it.
- **DON'T USE:** a dated real-world history (→ `timeline`); altitude over time during one descent (→ `descent-profile`); a Δv budget (→ `delta-v-ladder`); procedural stages of a process (→ `bill-funnel`, politics).
- **Pairs with:** `default`. Not hero-capable — the disproportion only lands with the "how to read" block beside it.

## 3. Data schema

```ts
interface MissionTimelineData {
  phases: {
    label: string;
    fromDay: number;   // days since launch (day 0)
    toDay: number;     // exclusive; fractional allowed (EDL = 0.3 of a day)
    note?: string;
  }[];
  milestones?: {
    label: string;
    atDay: number;
    slip?: 'none' | 'hours' | 'days';   // default 'hours'
  }[];
  totalDays?: number;  // default: max(toDay, atDay)
  caption?: string;
  source?: string;
}
```

```yaml
kind: mission-timeline
data:
  totalDays: 1400
  phases:
    - { label: Launch window,           fromDay: 0,   toDay: 14,    note: Fourteen days in which the rocket can fly at all. Miss it and the next one is twenty-six months away. }
    - { label: Trans-Mars cruise,       fromDay: 14,  toDay: 210,   note: Six months of nothing happening on purpose. Three course corrections, and otherwise coasting. }
    - { label: Approach and navigation, fromDay: 210, toDay: 228,   note: The last eighteen days, when the arrival point stops being a prediction and becomes a measurement. }
    - { label: Entry, descent, landing, fromDay: 228, toDay: 228.3, note: Seven minutes. Drawn at minimum width because at four years to the page it is thinner than the rule beneath it. }
    - { label: Primary surface mission, fromDay: 228, toDay: 915,   note: One Mars year of guaranteed operations. }
    - { label: Extended mission,        fromDay: 915, toDay: 1400,  note: Unfunded at launch. Every extended mission in the programme's history has been granted. }
  milestones:
    - { label: TCM-1,        atDay: 26 }
    - { label: TCM-2,        atDay: 96 }
    - { label: TCM-3,        atDay: 205 }
    - { label: Entry,        atDay: 228, slip: none }
    - { label: First drive,  atDay: 240 }
    - { label: Cache sealed, atDay: 610 }
  caption: The phase that decides whether any of the rest happens takes 0.02% of the timeline.
  source: Mission plan, revision F · phase durations as flown or as budgeted
```

**Minimum bar width is an honesty problem, and the fix is declared.** Any
phase narrower than 3px renders at a 3px floor and the component auto-renders the
mono chip `shortest phase at minimum width`. Without the chip the reader would
take 3px as a real duration. Phases must be non-overlapping in `fromDay` order
except where two share a boundary day (EDL ending as the surface mission begins is
legal); a true overlap **FAILS the build naming both phases**.

## 4. Geometry spec

Pure HTML/CSS inside a 720px column; the track is a positioned block, not SVG.

- **Track box:** `position: relative`, left inset 46px (the day-axis gutter),
  right inset 16px. Usable width `W`.
- **x mapping** `x(day) = day / totalDays × W`. **Bar width**
  `max(3, x(toDay) − x(fromDay))`.
- **Rows** 28px apart, bar height 17px, one row per phase in array order.
- **Phase label** sits inside the bar at `+7px` when the bar is ≥ 120px wide;
  otherwise it moves to the right of the bar's end, `+7px`, clamped so it never
  passes the track's right edge. This is why EDL's label is readable despite a
  3px bar.
- **Milestone lane** below the phases: a 1px `--ink` @ 0.5 rule across the full
  track, with a diamond per milestone centred at `x(atDay)`, drawn as a rotated
  10×10 square (or an inline 10px SVG path — either is fine, the diamond is the
  only glyph in the component).
- **Day axis** below the milestone lane: ticks at 0, ¼, ½, ¾, 1 of `totalDays`,
  labelled `LAUNCH`, then `DAY {n}`, 9.5px mono, `text-anchor: middle` via
  `transform: translateX(-50%)`.
- **Readout panel** below: selected phase or milestone — name, start day,
  duration (rendered as minutes if < 1 day, else days), share of mission, note.
- **375px:** the gantt becomes a stacked list — one row per phase with its bar on
  a full-width second line, and the milestone lane becomes a separate labelled
  list. A 1400-day axis is not readable at 375px with six phases on it.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Bars do not grow — an animated
  timeline implies playback.
- **On selection:** the selected bar swaps to `--accent`, others to the muted
  fill, over 120ms ease-out. Readout swaps with no transition.
- **Composed still:** the shortest phase selected (this is the argument — the
  default selection should be the phase the caption is about), all bars painted,
  milestones and axis visible, readout showing that phase.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| phase bar, rest | `--accent` @ 0.85 mixed toward `--ink` (use `--accent-deep` where the world defines it) |
| phase bar, selected | `--accent` @ 1.0 |
| phase label on a wide bar | `--paper` @ 1.0 (sits on the fill) |
| phase label outside the bar | `--ink` @ 0.80 |
| milestone lane rule | `--ink` @ 0.50 |
| milestone diamond, rest | fill `--paper`, stroke `--accent` 1.2px |
| milestone diamond, selected | fill `--accent` |
| day-axis ticks + labels | `--ink` @ 0.50 |
| `MILESTONES` eyebrow | `--ink` @ 0.45 |
| readout values | `--accent` @ 1.0, mono 700 |
| honesty chip | `--ink` @ 0.55, mono |

Single accent throughout. A milestone with `slip: 'none'` gets no special colour
— its non-negotiability is stated in the readout, not encoded as alarm.

## 7. Fallback design

Build-time HTML:

1. The **whole gantt** — every bar at its computed width and position, every
   milestone diamond, the day axis.
2. The **readout** painted for the default selection.
3. A `<table>` of phases (label, start day, end day, duration, share) and a
   second of milestones (label, day, slip allowance). AT-readable source.

Nothing requires JS to be legible.

## 8. Interaction spec

**One control** — select a phase or a milestone.

- **Targets:** every bar and every diamond is a `<button>`; diamonds get a ≥24px
  hit area around the 10px glyph. Tab order: phases in array order, then
  milestones in day order. `touch-action: pan-y`.
- **Readout templates** (`aria-live="polite"`):
  - phase: `"{label} — starts day {fromDay}, runs {duration}, {pct}% of the mission. {note}"`
    where `duration` is `"{n} minutes"` below one day, else `"{n} days"`.
  - milestone: `"{label} — day {atDay}. {slipText}"` with `slipText` one of
    "No slip allowance at all." / "A scheduled event; it can move by hours, not days." /
    "Can move by days."
- **Keyboard:** `←`/`→` step within the current lane, `↑`/`↓` switch lanes,
  `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "One bar per mission phase, laid on a single clock that starts at
  launch, so bar length is real duration. The diamonds on the lower lane are the
  moments that cannot be rescheduled."
- **`how`**: "Press a phase or a milestone for its dates and its share of the
  mission. The phase drawn thinnest is usually the one everything else exists to
  deliver."
- **Caption guidance:** the disproportion as a number — "the phase that decides
  whether any of the rest happens takes 0.02% of the timeline".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 140 |
| `data` payload | ≤ 3 KB |
| Island JS | ≤ 1 KB minified, inline |
| Phases × milestones | ≤ 8 × 10 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] A phase under 3px renders at 3px AND the `shortest phase at minimum width` chip appears
- [ ] Truly overlapping phases fail the build, naming both
- [ ] A sub-day duration reads out in minutes, not "0 days"
- [ ] Labels move outside the bar below 120px and never pass the track's right edge
- [ ] Milestone diamonds sit exactly at `x(atDay)` (check TCM-3 against day 205)
- [ ] `slip: 'none'` reads "No slip allowance at all." and gets no special colour
- [ ] Share-of-mission percentages sum to ≤ 100 (phases may share boundaries but not overlap)
- [ ] 375px: gantt becomes a stacked list, not a squeezed axis
- [ ] No-JS: full gantt + default readout + both tables

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-space-showcase`.*
