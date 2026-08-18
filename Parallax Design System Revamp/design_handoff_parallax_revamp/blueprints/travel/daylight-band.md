# daylight-band — how much daylight you actually get

> Blueprint for `daylight-band`. Contract, not a suggestion — if implementation
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
| `kind` | `daylight-band` |
| World | travel |
| Tier | SVG band (build-time solar model) + one latitude island |
| Component path | `src/components/topic/travel/DaylightBand.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-dbn` |
| Flagship reference | `terminator-globe` for the solar-geometry vocabulary; `season-wheel` for the year-cycle reading |

## 2. What it shows / when to use

The band between sunrise and sunset across a whole year. The reader learns that at low latitudes the light does not shrink so much as move.

- **USE WHEN:** usable daylight across a whole year at one or more latitudes, where WHEN the light falls (not just how much) affects the plan.
- **DON'T USE:** a day/night terminator for one moment and one flight (→ `terminator-globe`); clock offsets between cities (→ `timezone-arc`); altitude physiology (→ `altitude-oxygen`); a single destination's monthly weather (→ `climate-calendar`).
- **Pairs with:** `default`. Not hero-capable.

## 3. Data schema

```ts
interface DaylightBandData {
  latitudes: { id: string; label: string; lat: number }[];   // 1–3 presets
  year?: number;
  showCivilTwilight?: boolean;   // default false
  months?: string[];             // default the 12 abbreviations
  caption?: string;
  source?: string;
}
// sunrise/sunset are COMPUTED from `lat`, never authored
```

```yaml
kind: daylight-band
data:
  year: 2026
  latitudes:
    - { id: n28, label: 28° N · Kathmandu, lat: 27.7 }
    - { id: n47, label: 47° N · Alpine,     lat: 47.4 }
  caption: At 28° the band barely changes thickness — what moves is when the light arrives.
  source: Solar position model · local clock time, no daylight saving
```

**Derived, not authored.** Sunrise and sunset come from the declination +
hour-angle model in `docs/design/physics/` — mirror that sheet rather than
re-deriving, so this kind and `terminator-globe` never disagree.

- **Declination** `δ = 23.44° · sin(2π (doy − 81) / 365)`
- **Hour angle** `H = acos(clamp(−tan(φ) · tan(δ), −1, 1))`
- **Day length** `= 2H · 12/π` hours; sunrise `= 12 − len/2 + eot`, sunset
  `= 12 + len/2 + eot`, with the equation-of-time approximation the sheet gives.

**Local clock time, no daylight saving**, and the caption says so — the chip
`local clock time · no DST` always renders. Latitudes beyond ±66.5° would produce
polar day/night and are **rejected at build with a named error**; that needs a
different kind.

## 4. Geometry spec

`viewBox="0 0 440 250"`, `width:440px; height:250px`.

- **Plot box** x 42 → 430, y 16 → 216, filled with the night surface.
- **x** `dx(doy) = 42 + doy / 365 × 388`.
- **y — FIXED domain 03:00 → 21:00** so the band's vertical *position* is
  comparable between latitude presets: `dy(h) = 16 + (h − 3) / 18 × 200`.
  A data-fitted y-axis would defeat the whole argument.
- **Sampling** every 3rd day of year — 122 points, smooth at this width without a
  spline.
- **Band** is the sunrise polyline forward and the sunset polyline reversed,
  closed; **plus** two 1.6px edge strokes so the boundaries stay crisp against the
  fill.
- **Gridlines** at 06:00, 09:00, 12:00, 15:00, 18:00, labelled at `x = 36`,
  `text-anchor="end"`, `y + 3.5`, in `HH:MM`.
- **Month markers** — a vertical line at each month's mid-doy from y 16 to y 216,
  with the month label at `y = 232`. The selected month's line takes the accent;
  the rest are barely-there rules.
- **Readout** to the right (200px): month, sunrise, sunset, daylight length, and
  the delta against the June solstice.
- **375px:** the SVG scales; month labels drop to first letters, and the y-axis
  keeps all five gridlines (they are the reference the argument needs).

## 5. Motion spec

- **Entrance:** `reveal` on the card root. The band does not sweep in — that
  reads as the year playing forward.
- **Latitude switch:** the band's `d` interpolates over 260ms ease-out. This is
  the one motion doing real work in this kind: the reader watches the band swell
  or flatten, which IS the comparison. Under `prefers-reduced-motion`, swap
  instantly.
- **On month selection:** the marker line takes the accent; readout swaps.
- **Composed still:** the authored default latitude, December selected (the
  shortest day), band and gridlines painted.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| night field (plot background) | `--paper-warm` darkened (`color-mix` toward `--ink` 8%) |
| daylight band fill | `--accent-warm` if the world defines one, else `--accent` @ 0.55 |
| band edge strokes | `--accent-deep` @ 1.0, 1.6px |
| gridlines | `--ink` @ 0.18 |
| gridline labels | `--ink` @ 0.55 |
| month marker, rest | `--ink` @ 0.12 |
| month marker, selected | `--accent-deep` @ 1.0, 1.6px |
| month label, rest | `--ink` @ 0.50 |
| month label, selected | `--ink` @ 1.0 |
| latitude chip, active | background `--ink`, text `--paper` |
| readout daylight length | `--accent-deep` @ 1.0, mono 700 |

The band is warm and the field is cool-neutral; that is the only chromatic
statement, and it survives greyscale because the band also has hard edge strokes.

## 7. Fallback design

Build-time SVG for the default latitude:

1. The **whole band** with its edge strokes, the night field, gridlines and month
   markers.
2. The **readout** for the default month.
3. A `<table>`: month, sunrise, sunset, daylight length — **for every latitude
   preset**, so the comparison the chips make interactively is also available
   statically. AT-readable source; SVG `aria-hidden="true"`.

The latitude chips ship `hidden`.

## 8. Interaction spec

**One control** — the latitude preset. Month selection is secondary and
carries no state beyond the readout.

- **Chips:** one per latitude, `aria-pressed`, one tab stop each.
- **Month targets:** each month marker is a `<button>` with a
  `(388/12)`-wide transparent hit rect. Tab order Jan → Dec.
- **Announcements** (`aria-live="polite"`):
  - latitude: `"{label} — {junLen} of daylight in June, {decLen} in December."`
  - month: `"{month} — sunrise {HH:MM}, sunset {HH:MM}, {len} of daylight. {delta} against June."`
- **Keyboard:** complete; `←`/`→` step months, chips are separate tab stops.

## 9. Comprehension text

- **`what`**: "The shaded band is the time between sunrise and sunset across the
  year; everything above and below it is dark. The band's thickness is walkable
  hours, and its position is when they happen."
- **`how`**: "Switch latitude to see the band widen or flatten. At low latitudes
  the thickness barely changes but the whole band shifts — the light moves rather
  than shrinks."
- **Caption guidance:** name what actually changes — "at 28° the band barely
  changes thickness; what moves is when the light arrives".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 60 (band + 2 edges + 12 markers + axes) |
| `data` payload | ≤ 1 KB (latitudes only; curves are derived) |
| Island JS | ≤ 1.4 KB minified, inline (holds the precomputed curve sets) |
| Latitudes | 1–3 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Sunrise/sunset are derived from the physics sheet, not authored
- [ ] **y-axis domain is FIXED 03:00–21:00** across every latitude preset
- [ ] The `local clock time · no DST` chip always renders
- [ ] A latitude beyond ±66.5° fails the build with a named error
- [ ] The band has hard edge strokes, so it survives greyscale
- [ ] Latitude switch interpolates the band `d`, and swaps instantly under reduced motion
- [ ] Month hit rects are ~32px wide
- [ ] The readout delta is measured against the June solstice
- [ ] Fallback table covers EVERY latitude preset
- [ ] No-JS: default band + default month readout + all-latitude table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-travel-showcase`.*
