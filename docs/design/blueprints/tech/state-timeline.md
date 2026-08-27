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

# state-timeline — the outage, and the four hours before anyone noticed

> Blueprint for `state-timeline`. Contract, not a suggestion — if implementation
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
| `kind` | `state-timeline` |
| World | tech |
| Tier | HTML lanes + one marker-select island |
| Component path | `src/components/topic/tech/StateTimeline.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-stl` |
| Flagship reference | `timeline` for the event vocabulary; `latency-waterfall` for the lane geometry |

## 2. What it shows / when to use

Each service's discrete health state across one window, with the incident timeline pinned beneath. The reader learns how long the failure was visible in the data before it was visible to anyone.

- **USE WHEN:** 3–8 entities' discrete STATE over one window plus an event timeline, where the lag between the true onset and the first alert is the argument.
- **DON'T USE:** a continuous metric per service (→ `latency-ridge`); one request's spans (→ `latency-waterfall`); a dated narrative history (→ `timeline`); a service dependency graph (→ `service-arcs`).
- **Pairs with:** `default` or `wide`. Not hero-capable.

## 3. Data schema

```ts
interface StateTimelineData {
  window: { fromHour: number; toHour: number };   // e.g. 0 → 24
  states: {
    id: string;
    label: string;     // 'Healthy' | 'Degraded' | 'Down' — or domain equivalents
    ok?: boolean;      // counts toward uptime
  }[];
  lanes: {
    label: string;
    segments: { from: number; to: number; state: string }[];   // MUST tile the window
  }[];
  marks?: { n: number; atHour: number; label: string; note?: string }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: state-timeline
data:
  window: { fromHour: 0, toHour: 24 }
  states:
    - { id: ok,   label: Healthy,   ok: true }
    - { id: deg,  label: Degraded }
    - { id: down, label: Down }
  lanes:
    - label: entitlements
      segments:
        - { from: 0,    to: 9.5,  state: ok }
        - { from: 9.5,  to: 13.6, state: deg }
        - { from: 13.6, to: 16.2, state: down }
        - { from: 16.2, to: 17.1, state: deg }
        - { from: 17.1, to: 24,   state: ok }
    - label: graphql
      segments:
        - { from: 0,    to: 13.4, state: ok }
        - { from: 13.4, to: 16.2, state: deg }
        - { from: 16.2, to: 16.9, state: down }
        - { from: 16.9, to: 24,   state: ok }
    - label: edge
      segments:
        - { from: 0,    to: 13.6, state: ok }
        - { from: 13.6, to: 16.3, state: deg }
        - { from: 16.3, to: 24,   state: ok }
  marks:
    - { n: 1, atHour: 9.5,  label: Deploy 4.19.0,      note: The release that introduced the slow query. Nothing alerts, because the median barely moves. }
    - { n: 2, atHour: 13.6, label: First alert,        note: Four hours and six minutes after the deploy. The alert fires on the edge, four services away from the cause. }
    - { n: 3, atHour: 16.2, label: Page raised,        note: Entitlements goes fully down and the lock queue takes graphql with it. }
    - { n: 4, atHour: 17.1, label: Rollback complete,  note: Seven hours thirty-six from cause to recovery, of which four hours were undetected. }
  caption: Entitlements was degraded for four hours and six minutes before the first alert fired.
  source: Health-check archive and incident review INC-2291
```

**Segments must tile their lane exactly** — first segment starts at
`window.fromHour`, last ends at `window.toHour`, and each `from` equals the
previous `to`. A gap or an overlap **FAILS the build naming the lane**, because a
gap in a state timeline reads as "no data" and there is no such state here.
Per-lane uptime is **derived** from the `ok` flags, never authored. Colour is
categorical, so a legend is mandatory and the component refuses to build without
`states`. **No honesty chip** — nothing is compressed.

## 4. Geometry spec

Pure HTML/CSS.

- **Lane grid:** `grid-template-columns: 118px 1fr 58px`, `gap: 12px`,
  `align-items: center`, `gap: 5px` between lanes.
- **Lane label:** mono 10.5px, `text-overflow: ellipsis`.
- **Track:** `display: flex; height: 20px`, background `--paper-deep`. Each
  segment is a flex item with `width: (to − from) / windowSpan × 100%`.
- **Uptime cell:** right-aligned mono 10.5px 700, coloured by band
  (≥96% accent, 90–96% the warn state, <90% the down state).
- **Marker lane** below the lanes, same three-column grid so it aligns to the
  track: a `position: relative; height: 30px` block. Each mark is
  `position: absolute; left: (atHour − fromHour) / windowSpan × 100%`,
  `transform: translateX(-50%)`, containing a 1px × 8px stalk and a 15px circle
  with its number.
- **Hour axis** below: a `space-between` flex of 5 labels
  (`00:00 … 24:00`), inside the same grid so it aligns to the track.
- **Readout panel:** event name, clock time (`HH:MM` from the fractional hour),
  note.
- **375px:** the lane label column drops to 84px and truncates; the marker
  circles stay 15px (they are the hit targets). Below 340px, marker numbers stay
  but their stalks shorten to 4px.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Lanes do not wipe in — a wiping
  state timeline implies playback of the incident.
- **On marker selection:** the marker circle fills `--accent`; the others return
  to rest. 120ms ease-out. Readout swaps via `aria-live`.
- **Composed still:** the "first alert" marker selected (the argument), all lanes
  and markers painted.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| healthy segment | `#2f6b3a` — **fixed encoding, see below** |
| degraded segment | `#c6a132` — fixed |
| down segment | `#f4623a` — fixed |
| track background | `--paper-deep` @ 1.0 |
| lane label | `--ink` @ 0.80 |
| uptime, ≥96% | `--accent` @ 1.0 |
| uptime, 90–96% | the degraded hex |
| uptime, <90% | the down hex |
| marker circle, rest | `--ink` @ 0.65, numeral in `--paper-deep` |
| marker circle, selected | `--accent` @ 1.0, numeral in `--paper-deep` |
| hour-axis labels | `--ink` @ 0.45 |
| readout clock | `--accent` @ 1.0, mono 700 |

**Declared non-themeable encoding.** The three health colours are fixed hexes
rather than tokens, on the same terms as `storm-track`'s Saffir–Simpson ramp and
`chamber`'s party colours: green/amber/red is a cross-domain convention for
service status, and re-tinting it per world would make "down" mean six different
colours across the publication. The legend names all three, and the state is also
in the readout text — so the encoding never carries meaning by colour alone.

## 7. Fallback design

Build-time HTML:

1. All **lanes** with their segments tiled, uptime figures, the legend.
2. The **marker lane** with every numbered marker in place.
3. The **readout** for the default marker.
4. A `<table>`: two of them, in fact — lanes (service, time in each state,
   uptime) and events (number, clock, label, note). AT-readable source, and the
   lag argument is checkable from the two together.

The marker circles are plain `<span>`s until the island upgrades them to buttons.

## 8. Interaction spec

**One control** — marker selection.

- **Targets:** each marker is a `<button>` (15px visible, ≥24px hit area); tab
  order in `n` order. Segments are NOT interactive — there is nothing to say
  about a segment that the lane table does not already carry.
- **Readout template** (`aria-live="polite"`):
  `"{label} — {HH:MM}. {note}"`
- **Keyboard:** complete; `←`/`→` step markers, `Esc` returns to default.

## 9. Comprehension text

- **`what`**: "One lane per service across a single day, coloured by state
  rather than volume: healthy, degraded, or down. The numbered markers are the
  incident timeline."
- **`how`**: "Press a marker for its clock time and what happened. Then compare
  the lanes vertically to see what was already degraded before the first alert
  fired."
- **Caption guidance:** the lag, as a duration — "entitlements was degraded for
  four hours and six minutes before the first alert fired".

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 140 |
| `data` payload | ≤ 4 KB |
| Island JS | ≤ 0.9 KB minified, inline |
| Lanes × segments | ≤ 8 × 12 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] A gap or overlap in any lane's segments fails the build, naming the lane
- [ ] First segment starts at `fromHour`; last ends at `toHour`
- [ ] Per-lane uptime is derived from the `ok` flags
- [ ] The legend names all three states, and the readout states them in text (never colour alone)
- [ ] The three health hexes are documented in the component as a declared exemption
- [ ] Marker positions align to the track, not to the full row width
- [ ] Fractional hours render as `HH:MM` (13.6 → 13:36)
- [ ] Marker hit areas ≥ 24px
- [ ] Segments are not interactive
- [ ] No-JS: lanes + markers + default readout + both tables

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-tech-showcase`.*
