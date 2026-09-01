---
name: run-wave
description: Run a Phase 3 wave of the Parallax design revamp — build several blueprinted section kinds in parallel, wire them, verify and commit. Use when starting Wave 2, 3 or 4, or any batch of section kinds from blueprints.
argument-hint: [wave-number]
allowed-tools: Bash(node scripts/*), Bash(npm run *), Read, Edit, Write, Glob, Grep
---

# Run a Phase 3 wave

Waves remaining (`docs/REVAMP-PLAN.md` §4): **2** — 7 straightforward SVG ·
**3** — 7 real geometry · **4** — 7 hard. Library stands at 97 of 118.

> Before Wave 4, reassess. The editorial review flagged its kinds as the least
> defensible spend, and REVAMP-PLAN §5 argues workstream B beats Wave 2 on
> reader value — **77 of 97 kinds have never appeared in a published issue**
> (`npm run graph`). Raise this with the operator rather than assuming the
> wave order still holds.

## Current library state
!`node scripts/project-graph.mjs --brief`

## Protocol

### 1. Read first, and in this order

`docs/design/blueprints/<world>/<kind>.md` — **the corrections header
overrides the original handoff.** The blueprint is binding; screenshots are
reference only (four contain ledger-collision bugs the blueprints correct).

### 2. Parallelise component bodies only

Component files parallelise across worlds. **The shared registry files are
edited by the orchestrator alone** — `config.ts`, `SectionBody.astro`,
`explainers.ts`, `story.ts`, `catalog.md` are merge-conflict magnets.

If you delegate a component to a subagent:

- give it an **explicit one-file scope** — the component file, nothing else
- **preload the conventions** with `skills:` frontmatter. A subagent receives
  the CLAUDE.md hierarchy but **never auto-loads skills** (CD-12), so without
  this it works without the component rules
- a subagent once wiped uncommitted work with `git checkout`. That is now
  blocked by a hook, but keep the scope tight anyway

### 3. Wire

One wiring commit per wave, via `/add-section-kind` and `wire-kind.mjs`.
Components rebase onto it.

### 4. Worked example

Each kind needs a real section in its world's showcase issue. Showcase issues
are `status: draft`, so they build no story pages — check the kind renders on
the issue page.

### 5. Verify

`/verify-done`, plus a browser check against the blueprint's §11 acceptance
box. Then `npm run graph` and commit its output with the wave, or `prebuild`
fails on a stale graph.

### 6. Commit

One commit per wave, citing RD-01/RD-01a/RD-01b and the wave number. Never
push.

## Traps

- `wire-kind.mjs` covers **six** of nine places. The component, the WebGL scene
  and the showcase example are manual.
- A missing `EXPLAIN` or `KIND_PRIORITY` fails **silently** — green build, no
  visual difference, and the kind is unrankable as a story beat.
- `config.ts` is CRLF.
- Wave 2's entry gate is `src/lib/axis.ts` (tick generation, extents, unit
  formatting) plus the shared legend. Build it first or seven components
  reinvent it seven ways.

$ARGUMENTS
