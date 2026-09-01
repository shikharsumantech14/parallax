---
name: add-section-kind
description: Add a new section kind to the Parallax component library, wired through all nine registry places. Use when building a kind from a blueprint, running a Phase 3 wave, or when check:catalog reports a kind missing from a registry.
argument-hint: [kind-name]
allowed-tools: Bash(node scripts/*), Bash(npm run *), Read, Edit, Write, Glob, Grep
---

# Add a section kind

**Nine registry places. Six are automated — do not hand-edit those six.**

## Automated: `node scripts/wire-kind.mjs <config.json>`

1. `SECTION_KINDS` in `src/content/config.ts`
2. import + dispatch arm in `src/components/SectionBody.astro`
3. `EXPLAIN` entry in `src/lib/explainers.ts`
4. `KIND_PRIORITY` score in `src/lib/story.ts`
5. `## <kind>` block in `docs/design/catalog.md` — **same order** as SECTION_KINDS
6. the CSS prefix registration

Read the header of `scripts/wire-kind.mjs` for the config shape and a worked
example. It is **idempotent** — every step skips if already applied, so a
partial run is safe to re-run. `afterKind` anchors the entry, the dispatch arm
and the catalog block so all three stay in the same order, which
`check:catalog` enforces.

## Manual: yours

7. the component itself — `src/components/topic/<world>/<Name>.astro`
8. `src/scripts/viz3d/scenes/index.ts` — **WebGL kinds only**
9. a worked example in that world's showcase issue

Plus: theme CSS, an entry in `src/components/AGENTS.md`, and a `TRIM` cap in
`src/lib/story.ts` if the kind needs one.

## Traps that have actually bitten

- **`SectionBody.astro` is the dispatcher.** `SectionRenderer.astro` is article
  chrome only — wiring there does nothing, silently.
- **`coalition-calculus` dispatches with a spread** (`{...data}`, flat props),
  unlike every other kind. Do not copy it as the template.
- **`CityGrid` hard-throws outside 1–3 cities.** `TRIM['city-grid']` is 2; an
  earlier cap of 4 was a dead no-op.
- **Globe seed-yaw is `-((cLon + 90) * Math.PI) / 180`.** A `+180` opens on the
  limb: it renders, looks fine, shows the wrong hemisphere.
- **`src/content/config.ts` is CRLF.** Exact-string anchors fail unless you
  match `\r?\n`. This is the whole reason `wire-kind.mjs` exists.
- **In-SVG `<text>` uses a literal font stack, never `var()`** (RD-01b) —
  presentation attributes lose to any stylesheet rule, and satori/resvg do no
  `var()` substitution.
- **A missing EXPLAIN or KIND_PRIORITY fails silently.** No error, no visual
  difference, green build — the kind just renders no comprehension line, or
  sinks to the default 30 and never gets picked as a story beat. This is how
  four WebGL flagships sat unscored.

## Finish

```
npm run check:catalog
npm run graph
```

`check:catalog` asserts the 1:1 pairing, the order, and EXPLAIN + KIND_PRIORITY
coverage. `npm run graph` refreshes the derived graph — commit its output
alongside the kind, or `prebuild` will fail on a stale graph.

Then run `/verify-done`.

## Before you start

Read `docs/design/blueprints/<world>/$0.md` — **its corrections header first;
that header overrides the original handoff.** The blueprint is binding;
screenshots are reference only, and four contain real ledger-collision bugs the
blueprints already correct.
