# flame-graph — where 840 milliseconds of CPU went

> Blueprint for `flame-graph`. Contract, not a suggestion — if implementation
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
| `kind` | `flame-graph` |
| World | tech |
| Tier | HTML nested bars + one frame-select island |
| Component path | `src/components/topic/tech/FlameGraph.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-flm` |
| Flagship reference | `latency-waterfall` for the span vocabulary; `chip-die` for the area-proportional tile treatment and its hover lift |

## 2. What it shows / when to use

One profiled operation's call tree, where a bar's width is the time spent inside that function and everything it called. The reader learns that the cost usually sits deeper than the frames anyone was watching.

- **USE WHEN:** ONE profiled operation's call tree with self-times (depth ≥3), where the cost sits deeper than the obvious top-level frames.
- **DON'T USE:** spans of one request across services (→ `latency-waterfall`); a distribution of many requests (→ `latency-ridge`); a service dependency graph (→ `service-arcs`); a queueing curve (→ `queue-cliff`).
- **Pairs with:** `wide`, hero-capable.

## 3. Data schema

```ts
interface FrameNode {
  name: string;
  self: number;          // time in this frame's OWN code, in `unit`
  children?: FrameNode[];
}

interface FlameGraphData {
  root: FrameNode;
  unit?: string;         // default 'ms'
  caption?: string;
  source?: string;
}
// total(node) = node.self + Σ total(children) — DERIVED, never authored
```

```yaml
kind: flame-graph
data:
  unit: ms
  root:
    name: handleRequest
    self: 122
    children:
      - name: authenticate
        self: 8
        children:
          - { name: verifyToken, self: 6 }
          - name: loadSession
            self: 4
            children: [{ name: redis.get, self: 22 }]
      - name: resolveQuery
        self: 18
        children:
          - { name: parseGraphQL, self: 34 }
          - name: planJoins
            self: 26
            children: [{ name: statsLookup, self: 41 }]
          - name: executePlan
            self: 30
            children:
              - { name: 'pg.query · accounts', self: 96 }
              - name: 'pg.query · entitlements'
                self: 212
                children: [{ name: awaitLock, self: 88 }]
              - { name: 'pg.query · usage', self: 74 }
      - name: serialize
        self: 21
        children: [{ name: JSON.stringify, self: 38 }]
  caption: One entitlements query accounts for 300 of the request's 840 ms.
  source: Sampling profiler, 10 kHz, one p95 request on build 4.19.2
```

**Totals are derived.** `total = self + Σ children.total`; an authored total
is rejected. The root's total is the figure the caption quotes, so a caption
claiming 840 ms must be reproducible from the payload — verify it, because the
prototype's first draft had a root `self` that did not add up.
**Depth cap 6.** Deeper trees are truncated with a `depth truncated at 6` chip
and the truncated subtree's time folded into its parent's self.
No scale compression — width is linear in time — so **no other honesty chip**.

## 4. Geometry spec

Pure HTML/CSS; one absolutely-positioned row per depth level.

- **Rows:** one `position: relative; height: 26px` block per depth, `gap: 3px`.
- **Frame:** `position: absolute; height: 26px`, with
  `left = offset / rootTotal × 100%` and `width = total / rootTotal × 100%`.
- **Offset accumulation:** a node's children start at
  `parentOffset + parent.self` and each subsequent sibling starts at the previous
  sibling's offset + its total. **The parent's own self-time occupies the leading
  slice** — this is what makes the layout a flame graph rather than a treemap.
- **Horizontal position carries no meaning.** Bars are nested, never sorted; do
  not reorder children by size.
- **Right border** 1px `--paper-deep` on every frame, so adjacent siblings
  separate without a gap.
- **Label fitting — the one thing to get right.** Compute the frame's real pixel
  width `px = widthPct / 100 × containerWidth − 11` (7px left pad + 4px
  breathing room). With a mono face at 10.5px, advance ≈ 6.05px per character:
  `fits = floor(px / 6.05)`. Then:
  - `fits >= name.length` → the full name
  - `fits >= 5` → `name.slice(0, fits − 1) + '…'`
  - otherwise → **no label at all**

  Never slice at a fixed character count and rely on `overflow: hidden` — that
  produces unreadable fragments mid-word, and it was the prototype's defect.
  Re-measure on resize (the island re-runs the fit on a debounced
  `ResizeObserver`).
- **Readout panel:** three cells — frame name (mono), `total · self`, share of
  the root.
- **375px:** the graph keeps its proportions, and at that width most labels drop
  by the rule above. That is correct — the shape is the content, and the readout
  supplies names.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Frames do not grow — an animated
  flame graph implies sampling in progress.
- **On selection:** frames outside the selected subtree drop to 0.2 over 120ms
  ease-out. The selected path (ancestors + the subtree) stays at 1.0.
- **Composed still:** the most expensive leaf-bearing frame selected (for the
  example, `pg.query · entitlements`), its path highlighted, the readout showing
  it.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| depth 0 | `--accent` @ 1.0 |
| depth 1–5 | a 6-step ramp from `--accent` toward `--ink`, one step per level |
| frame outside the selected subtree | own colour @ 0.20 |
| frame right border | `--paper-deep` @ 1.0, 1px |
| label, depth 0–2 | `--paper-deep` @ 1.0 (dark text on the bright accent) |
| label, depth 3–5 | `--paper` @ 0.92 |
| readout frame name | `--accent` @ 1.0, mono |
| readout share | `--accent` @ 1.0, mono 700 |

**Single-hue depth ramp, max 6 steps.** Depth is ordinal, so it gets a ramp and
not a palette; a categorical palette would imply that sibling frames at the same
depth are related, which they are not. The label colour flips at depth 3 because
that is where the ramp crosses into dark fills.

## 7. Fallback design

Build-time HTML — the whole graph is static markup.

1. Every **frame** positioned and labelled per the fit rule.
2. The **readout** for the default selection.
3. A nested `<ul>` of the call tree with each frame's total, self and share —
   the AT-readable source, and genuinely useful (a profile is a tree, and a nested
   list is its natural accessible form). The graph itself is
   `aria-hidden="true"`.

Without JS the reader loses only subtree isolation.

## 8. Interaction spec

**One control** — frame selection.

- **Targets:** every frame is a `<button>`; tab order is depth-first, matching
  the tree. Frames with no label still have their `aria-label` set to the full
  name, so keyboard and AT users are never blocked by the fit rule.
- **Effect:** dim everything outside the selected subtree.
- **Readout template** (`aria-live="polite"`):
  `"{name} — {total} {unit} total, {self} {unit} in its own code, {pct}% of the request."`
- **Re-press** clears to the default frame.
- **Keyboard:** complete; `↑`/`↓` move between depths, `←`/`→` between siblings,
  `Esc` clears.

## 9. Comprehension text

- **`what`**: "The top bar is one request and every bar below it is a function
  called by the bar above. Width is the time spent inside that function and
  everything it called; depth is how deep in the stack it sits. Horizontal
  position means nothing — bars are nested, never ordered."
- **`how`**: "Press any frame to isolate its subtree and read total against self
  time. A wide bar low in the stack is the real cost, whatever the top of the
  profile says."
- **Caption guidance:** name the dominant frame and its share — "one entitlements
  query accounts for 300 of the request's 840 ms".
- **The plain line MUST state that horizontal position is meaningless.** It is
  the single thing every first-time reader gets wrong.

## 10. Performance budget

| Budget | Cap |
|---|---|
| DOM nodes | ≤ 200 (≤ 60 frames × label + row wrappers) |
| `data` payload | ≤ 6 KB |
| Island JS | ≤ 1.6 KB minified, inline (includes the debounced re-fit) |
| Depth × frames | ≤ 6 × 60 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] Totals are derived; the root total matches the caption's figure exactly
- [ ] A parent's self-time occupies the leading slice before its first child
- [ ] Children are NOT reordered by size
- [ ] **Label fitting uses measured pixel width with an ellipsis, and drops below 5 characters** — no clipped fragments at any width
- [ ] Labels re-fit on resize (debounced `ResizeObserver`)
- [ ] Unlabelled frames still carry a full `aria-label`
- [ ] Depth beyond 6 truncates and renders the `depth truncated at 6` chip
- [ ] Depth ramp is single-hue, ≤ 6 steps; label colour flips at depth 3
- [ ] The plain line states that horizontal position means nothing
- [ ] No-JS: full graph + default readout + nested call-tree list

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-tech-showcase`.*
