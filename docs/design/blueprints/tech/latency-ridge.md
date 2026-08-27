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

# latency-ridge — six releases, and the tail nobody averaged

> Blueprint for `latency-ridge`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/tech.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `latency-ridge` |
| World | tech |
| Tier | SVG ridgeline (build-time KDE) + one release-select island |
| Component path | `src/components/topic/tech/LatencyRidge.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-lrg` |
| Flagship reference | `pace-ridge` (sports) — share its KDE, bandwidth and global-height-scale implementation; this kind adds the threshold and the ordering |

## 2. What it shows / when to use

Response-time distributions for a run of releases, stacked newest first, against a named threshold. The reader learns that the median can improve while the tail gets worse.

- **USE WHEN:** response-time distributions for 4–8 ORDERED releases (newest first) against a named threshold, where the median and the tail move in opposite directions.
- **DON'T USE:** peer groups compared for distribution shape with no threshold (→ `pace-ridge`, sports); one request's span breakdown (→ `latency-waterfall`); one request's call tree (→ `flame-graph`); throughput as a single rate (→ `throughput-dial`).
- **Pairs with:** `default` or `wide`. Not hero-capable.

## 3. Data schema

```ts
interface LatencyRidgeData {
  metric: string;                 // e.g. 'response time'
  unit: string;                   // 'ms'
  threshold: { at: number; label: string };
  scale?: 'log' | 'linear';       // default 'log'
  releases: (
    | { label: string; samples: number[] }                              // preferred
    | { label: string; median: number; tailPct: number; secondPeakAt?: number }  // fallback
  )[];                            // NEWEST FIRST
  caption?: string;
  source?: string;
}
```

```yaml
kind: latency-ridge
data:
  metric: response time
  unit: ms
  scale: log
  threshold: { at: 500, label: over 500 ms }
  releases:
    - { label: 4.19.2, median: 82, tailPct: 6.1, secondPeakAt: 760 }
    - { label: 4.19.0, median: 79, tailPct: 4.8, secondPeakAt: 760 }
    - { label: 4.18.4, median: 74, tailPct: 1.9 }
    - { label: 4.18.1, median: 76, tailPct: 2.1 }
    - { label: 4.17.6, median: 88, tailPct: 2.6 }
    - { label: 4.17.0, median: 91, tailPct: 2.8 }
  caption: The median fell from 91 ms to 82 while the share over half a second more than doubled.
  source: Edge access logs, one full day per release
```

⚠ **Merge candidate with `pace-ridge`** — see `../../COLLISIONS.md` §3.
Reuse `pace-ridge`'s KDE code path wholesale: build-time Gaussian KDE, Silverman
bandwidth, **ONE global height scale** so a genuinely peakier ridge reads taller.

- **Prefer `samples`.** The summary form (`median`/`tailPct`/`secondPeakAt`)
  synthesises a log-normal plus an optional second lobe and exists only for when
  raw observations did not survive; using it renders the chip
  `distribution modelled from percentiles`.
- **`scale: 'log'`** renders the `log scale` chip.
- **`releases` must be newest-first**; the component does not sort, because
  version strings do not sort reliably.

## 4. Geometry spec

`viewBox="0 0 440 264"`, `width:440px; height:264px`.

- **Ridge baselines** `base(i) = 60 + i · 30` — 30px pitch with ridges reaching
  46px, so consecutive ridges overlap by roughly a third. The overlap is the point:
  shapes are compared directly, not across whitespace.
- **x (log)** `rgx(ms) = 40 + min(1, log(ms / 20) / log(1400 / 20)) × 390`,
  domain 20 ms → 1400 ms. Linear mode maps the data range with a 4% pad.
- **Sampling:** evaluate the density at multiplicative steps
  `ms *= 1.09` from 20 to 1400 — even spacing in log space, which keeps the
  curve smooth without oversampling the tail.
- **Ridge path** is the density polyline closed to its baseline
  (`L 430 base L 40 base Z`), filled with the surface colour and stroked.
- **Tail shading:** the sub-path from `rgx(threshold.at)` to the right edge,
  closed to the baseline, filled `--accent` at 0.5 (selected) / 0.18 (rest).
- **Median tick:** a 1.4px vertical line at `rgx(median)` from the baseline up
  46px.
- **Release label** at `x = 34`, `y = base − 2`, `text-anchor="end"`, 10px mono.
- **x-axis** rule at y 238, ticks at 20/50/150/500/1400 with 9.5px mono labels at
  y 254; `1400` prints as `1.4 s` (a four-digit ms label reads as noise).
- **375px:** ridge pitch drops to 24px and reach to 36px; the axis keeps all five
  ticks. Release labels move above each ridge, left-aligned, if the 34px gutter
  cannot hold them.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Ridges do not draw left-to-right.
- **On selection:** the selected ridge's fill switches to the raised surface, its
  stroke to `--accent`, stroke width 1.2 → 2, and its tail shading to 0.5; over
  120ms ease-out.
- **Composed still:** the newest release (index 0) selected — the release the
  argument is about — all ridges painted, all median ticks visible.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| ridge fill, rest | `--paper-deep` @ 1.0 (the page surface, so overlaps occlude) |
| ridge fill, selected | `--accent` mixed toward `--paper-deep` 88% |
| ridge stroke, rest | `--ink` @ 0.55 (1.2px) |
| ridge stroke, selected | `--accent` @ 1.0 (2px) |
| tail shading, rest | `--accent` @ 0.18 |
| tail shading, selected | `--accent` @ 0.50 |
| median tick, rest | `--ink` @ 0.35 |
| median tick, selected | `--accent` @ 1.0 |
| release label, rest | `--ink` @ 0.55 |
| release label, selected | `--accent` @ 1.0 |
| axis rule + ticks | `--ink` @ 0.45 / 0.50 |
| readout tail %, above threshold | `--accent-alt` @ 1.0 |

**Opaque rest fill is load-bearing.** Ridges must occlude the ones behind them or
the stack becomes an unreadable mesh — so the rest fill is the page surface
colour, not a transparency.

## 7. Fallback design

Build-time SVG — KDE runs at build, so there is no runtime compute to lose.

1. **Every ridge** drawn, with median ticks, tail shading, axis and chips.
2. The **readout** for release index 0.
3. A `<table>`: release, median, share over threshold, whether a second peak is
   present, and the change in median against the oldest release. AT-readable
   source; SVG `aria-hidden="true"`.

The two-numbers-diverging argument is fully present in that table, which matters
— it is the argument.

## 8. Interaction spec

**One control** — release selection.

- **Targets:** each ridge path and each table row is a `<button>`; tab order
  newest → oldest. `touch-action: pan-y`.
- **Readout template** (`aria-live="polite"`):
  `"{label} — median {median} {unit}, {tailPct}% {threshold.label}{peakText}. Against {oldestLabel}: {±d} {unit} median."`
  with `peakText` = `", second peak near {secondPeakAt} {unit}"` when present.
- **Keyboard:** complete; `↑`/`↓` step releases, `Esc` returns to newest.

## 9. Comprehension text

- **`what`**: "One ridge per release, newest at the top, each showing how a day
  of requests was distributed across response times. The tick on each ridge is
  that release's median and the shaded foot is everything slower than the
  threshold."
- **`how`**: "Press a release to read its median and its share over the threshold
  together. A ridge that grows a second bump has developed a slow path the median
  cannot see."
- **Caption guidance:** both numbers, moving opposite ways — "the median fell from
  91 ms to 82 while the share over half a second more than doubled".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 60 (8 releases × ridge + tail + tick + label) |
| `data` payload | ≤ 12 KB with raw `samples`; ≤ 2 KB in summary form |
| Island JS | ≤ 1 KB minified, inline (no runtime KDE) |
| Releases | 4–8 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] KDE runs at BUILD time; no density maths ships to the client
- [ ] One global height scale across all ridges (a peakier ridge really is taller)
- [ ] Rest fill is opaque so ridges occlude correctly
- [ ] `scale: 'log'` renders the `log scale` chip
- [ ] Summary-form payloads render the `distribution modelled from percentiles` chip
- [ ] Releases render in array order, newest first, unsorted
- [ ] Tail shading starts exactly at `rgx(threshold.at)`
- [ ] The 1400 ms tick prints as `1.4 s`
- [ ] Readout gives median AND tail % together
- [ ] No-JS: all ridges + newest readout + the divergence table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-tech-showcase`.*
