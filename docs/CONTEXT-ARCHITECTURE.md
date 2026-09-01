# Context architecture — how Parallax survives a session boundary

> **Status: v1, 2026-08-31. Research + recommendation. Nothing here is built yet.**
>
> This file answers one question: *how do we work across many sessions and many
> agents without losing what we know?* It exists because the honest answer today
> is **we don't** — and the reason is measurable, not vibes.
>
> Read `docs/STATE-OF-PLAY.md` for where the repo stands, `AGENTS.md` for the
> standing rules, `docs/REVAMP-PLAN.md` for the design revamp. This file is
> about the machinery that carries all three across a `/clear`.

---

## 1. The verdict on Graphify, up front

**Graphify is real and it is not the right tool for this repo.**

It is not vapourware — `Graphify-Labs/graphify`, **112,961 stars, 10,995 forks**,
Apache-2.0, pushed daily. It turns a folder into a queryable knowledge graph via
tree-sitter AST parsing plus LLM semantic extraction, and ships as a `/graphify`
skill for Claude Code. The claimed win is ~70% token reduction by letting an
agent query structure instead of reading files.

It is the wrong shape for Parallax, for six reasons in descending weight:

1. **It solves our lesser problem.** The tool's own community states the split
   precisely (graphify issue #152): *graphify maps **what a codebase is**;
   agentmemory remembers **what a developer did***. Our pain is the second. We do
   not lose sessions to "where is the seat-chart component" — the map in
   `AGENTS.md` §4 and a `grep` answer that in seconds. We lose them to *"what did
   we decide about accent-deep, and why is `state-timeline` allowed three raw
   hexes."*
2. **This repo is prose-shaped, not code-shaped.** 323 source files against
   **192 markdown files totalling ~645k tokens.** The knowledge lives in
   `REVAMP-PLAN.md`, the 28 blueprints, `catalog.md`, `TOKEN-RECORD.md`. A
   code-graph indexes the thin half.
3. **Its doc↔code linking is a known-open bug.** Filed 2026-08-31: *"Node
   merge/dedup doesn't match a code entity to a planning-doc node describing the
   same file."* That join — decision doc ↔ implementing file — is exactly and
   only what we would want it for.
4. **Maturity.** Created 2026-04-03, still **v0.9.53** with **1,175 open
   issues**, releasing near-daily (v0.9.49→.53 in six days). Pinning a moving
   pre-1.0 dependency into our context pipeline buys instability.
5. **It is another artifact that goes stale.** `graphify-out/` must be
   regenerated and trusted. `STATE-OF-PLAY.md` was written 2026-08-28 saying
   *"3 unpushed commits"*; on 2026-08-31 there are zero. **Hand-maintained state
   decays — that is the disease, and a second hand-maintained cache is not the
   cure.**
6. **Platform friction.** A Python tool on a Windows box whose own trap list
   warns that inline interpreter one-liners break in Git Bash; graphify's
   top-voted skill issue is *"Skill should use CLI subcommands instead of inline
   `python -c`"*.

**What we take from it:** the idea is right. A graph over Parallax is genuinely
valuable — just a *small, generated, deterministic* one we own (§5, Layer 2),
not a general-purpose LLM-extracted one we rent.

### The alternatives, honestly scored

| Tool | Real numbers | Fit |
|---|---|---|
| **Graphify** | ★112,961 · v0.9.x · Apache-2.0 · Python | Wrong half of the problem (above) |
| **Serena** (LSP symbol tools) | ★28,686 · MIT · since 2025-03 | Good tech, but Anthropic ships this natively — see below |
| **`typescript-lsp` plugin** | first-party, official marketplace | **Adopt.** Zero-config code intelligence for a TS repo |
| **Graphiti / Zep** (temporal KG) | ★30,461 · Apache-2.0 · since 2024-08 | Real fit for decision-memory, but needs Neo4j/FalkorDB + API keys. Overkill for one operator |
| **agentmemory** | ★27,845 · Apache-2.0 · SQLite, local, ~2k tok/session | Closest third-party fit; **superseded by native auto memory**, which we already have and don't use |
| **mem0 / cognee** | ★64,437 / ★30,372 | General LLM memory; not repo-aware |
| **Native Claude Code primitives** | first-party, free | **The answer.** See §3 |

---

## 2. Diagnosis — why context is actually lost here

Five findings. All measured on the committed state, 2026-08-31.

### Finding 1 — the subtree guides never load. *(defect, highest value)*

`CLAUDE.md:34` claims:

> Subdirectory `AGENTS.md` files are picked up when working in their tree
> (via the agents.md cascading-read convention)

**This is false.** Anthropic's memory documentation is unambiguous: *"Claude Code
reads `CLAUDE.md`, not `AGENTS.md`."* Subdirectory discovery covers `CLAUDE.md`
and `CLAUDE.local.md` only. There is no cascading AGENTS.md read.

The root `AGENTS.md` loads solely because root `CLAUDE.md` `@`-imports it.
Everything else is invisible:

| File | Tokens | Auto-loads? |
|---|---|---|
| `src/components/AGENTS.md` | ~17,131 | **No** |
| `app/AGENTS.md` | ~8,316 | **No** |
| `src/content/issues/_AGENTS.md` | ~7,960 | **No** |
| `research/AGENTS.md` | ~3,897 | **No** |

Confirmed empirically: a session opened at the repo root receives `CLAUDE.md`
and `AGENTS.md` and nothing else. **An agent editing a component does not have
the component conventions unless it happens to read that file** — the SVG rules,
the prefix table, the section-kind map. That is not a documentation gap; it is
~37k tokens of hard-won convention that silently is not there. It explains a
great deal of cross-session drift.

### Finding 2 — the always-loaded block is 4× the guidance

`CLAUDE.md` (540 tok) + `AGENTS.md` (**866 lines**, 13,358 tok) = **~13.9k tokens
before any work.** Anthropic's stated target is **under 200 lines per file**,
because *"longer files consume more context and reduce adherence."*

Compounding: `@`-imports do **not** save context — *"imported files still load
and enter the context window at launch."* Our `CLAUDE.md`→`AGENTS.md` import is
an organisational win and a zero context win.

The cost is not only tokens. It is adherence: rules 700 lines deep compete with
rules at line 20, and the file already contradicts itself in one place (Finding 1).

### Finding 3 — none of the progressive-disclosure primitives are in use

```
.claude/
├── agents/      ✅ 9 files
├── commands/    ✅ 4 files
├── skills/      ❌ does not exist
├── rules/       ❌ does not exist
└── hooks        ❌ none configured
```

This is a 2025-era setup. Everything reference-shaped or procedure-shaped sits
in the always-loaded monolith because there is nowhere else for it to go.

Worse, the rules that have *actually bitten* are prose pleas: *"Claude commits
only — never pushes"*, *"never `git checkout`/`reset`/`stash`/`restore`"* (an
agent once wiped hours of uncommitted work). Anthropic is explicit that
CLAUDE.md *"is context, not enforced configuration… to block an action
regardless of what Claude decides, use a PreToolUse hook."* Our most expensive
lesson is protected by a sentence.

### Finding 4 — auto memory is enabled and completely empty

`~/.claude/projects/D--SideProjects-parallax/memory/` exists and contains **zero
files**. No `MEMORY.md`. A native, free, per-repo, cross-session memory whose
index loads into every conversation — unused for the entire P0–P8 program and
the whole revamp.

### Finding 5 — state is hand-maintained, therefore stale on arrival

`STATE-OF-PLAY.md` is excellent and it decays the moment it is written. Its
2026-08-28 revision opens with *"Three commits await the operator's push"*;
three days later the tree is clean and level with origin. Any reader must
re-derive the live facts before trusting the file — which is the tax the file
was written to remove.

**The parts that decay are exactly the parts a machine can compute**: branch,
unpushed count, working-tree state, gate status, library count, phase progress.

---

## 3. What Anthropic actually recommends

From the official large-codebase guidance, the mechanisms that apply here:

| Mechanism | What it buys Parallax |
|---|---|
| **Per-directory `CLAUDE.md`** | Loads on demand when Claude reads that subtree — the fix for Finding 1 |
| **`.claude/rules/` with `paths:` globs** | Conventions that load *only* when a matching file is touched |
| **Skills** | Procedures that load only when relevant; names + descriptions always visible, body on demand |
| **Hooks** | `PreToolUse` for hard blocks; `SessionStart` to inject live state |
| **Code intelligence plugin** | `typescript-lsp` — symbol lookup instead of file scanning |
| **`claudeMdExcludes`** | Skip trees we never work in |
| **Plan mode** | *"Claude Code re-injects the plan file after each compaction, so the plan survives where conversation history may not"* |
| **Auto memory** | Claude's own accumulated learnings, per repo, across sessions |

Note the last two: **plan-file re-injection and auto memory are the two native
answers to "don't lose context across a long session or a boundary."** We use
neither deliberately.

---

## 4. The design principle

> **Anything a machine can derive, a machine must derive. Anything only a human
> can decide, a human writes once and cites by ID.**

Parallax already half-lives this, and it is why the good parts are good:
`check:catalog` derives the 97↔97 pairing rather than trusting a list;
`design-sync --check` derives token agreement; `wire-kind.mjs` derives six edits
from one config. Decisions get IDs — RD-01…RD-09, TD-01…TD-06 — and are cited,
which is precisely why they survived three handovers.

The failures are the places we broke the principle: `STATE-OF-PLAY.md` hand-writes
derivable facts, and `AGENTS.md` hand-asserts a loading behaviour that was never
verified.

**A graph is the right mental model. It should be generated from ground truth,
not extracted by an LLM from source it may misread.**

---

## 5. The recommendation — four layers

Ordered by value-per-hour. Layer 0 alone recovers ~37k tokens of convention that
is currently unreachable.

### Layer 0 — Fix the loading defect · ~2 hours · free

1. Add a thin `CLAUDE.md` in each subtree that `@`-imports its existing guide:
   `src/components/`, `src/content/issues/`, `app/`, `research/`. Three lines
   each. The AGENTS.md files stay exactly where they are — portable for other
   tooling, now actually loaded for this one.
2. Correct the false claim at `CLAUDE.md:34` and record it in the AGENTS.md
   change log — it is a trap that has been silently costing us.
3. Add `claudeMdExcludes` for `Parallax Design System Revamp/**` (11 MB, 140
   files, tracked, carries its own AGENTS.md, and is explicitly *"stale
   background"* per RD-02).

### Layer 1 — Progressive disclosure · ~2 days · free

Move reference and procedure out of the always-loaded block. Target: root
`AGENTS.md` **866 → under 250 lines**, holding only what every session needs —
identity, hard rules, the map, the change log.

**`.claude/rules/`** (fire on file globs):

| Rule | `paths:` |
|---|---|
| `svg-conventions.md` | `src/components/topic/**` |
| `issue-schema.md` | `src/content/issues/**/*.mdx` |
| `theme-tokens.md` | `src/styles/**`, `shared/design/**` |
| `migrations.md` | `app/supabase/migrations/**` |
| `viz3d.md` | `src/scripts/viz3d/**` |

**`.claude/skills/`** (fire on task):

- `add-section-kind` — the nine registry places, wrapping `wire-kind.mjs`
- `run-wave` — the Phase 3 wave protocol: parallel component agents,
  orchestrator-only registry edits, blueprint verification
- `verify-done` — the §8 checklist including the honest overflow test
- `publish-issue` — status flip, sourceRefs, primer bounds, standing greps

**Hooks** — make the expensive lessons real:

- `PreToolUse` blocking `git push`, and `git checkout|reset|stash|restore` on a
  path. Both are documented traps; both are currently honour-system.
- `PostToolUse` on `src/content/config.ts` / `catalog.md` → run `check:catalog`.

**Plugin:** `/plugin install typescript-lsp@claude-plugins-official` — this is
the Graphify-shaped win, first-party and zero-maintenance.

### Layer 2 — The generated project graph · ~1 day · free · **the graph we should build**

`scripts/project-graph.mjs` → `docs/generated/PROJECT-GRAPH.{md,json}`, wired
into `prebuild` beside the existing gates.

Derived from ground truth, never authored:

| Node | Source of truth |
|---|---|
| **kind** (97) | `SECTION_KINDS` in `config.ts` |
| ↳ its 9 registry places | `SectionBody.astro`, `explainers.ts`, `story.ts`, `catalog.md`, `scenes/index.ts`, showcase issues |
| ↳ component, CSS prefix, world | the component file + theme CSS |
| ↳ blueprint status | `docs/design/blueprints/<world>/<kind>.md` present? built? |
| ↳ **published usage** | which issues actually use it (70 of 90 never have) |
| **decision** (RD-01…09, TD-01…06) | grepped IDs → the files that cite them |
| **issue** (23) | frontmatter: status, world, kinds used, sources, gaps |
| **phase** | `REVAMP-PLAN.md` §0 table ↔ commits that cite it |

This is the honest version of what Graphify promises: an agent asks *"what does
`state-timeline` touch, what decided its three raw hexes, and has it ever
shipped?"* and gets an exact answer with zero LLM cost, zero drift, and a
build-time guarantee — because if the graph and the repo disagree, `prebuild`
fails, exactly like `check:catalog` does today.

It also answers questions nothing currently can: **which of the 97 kinds have
never appeared in a published issue** (the plan's own argument for workstream B
over Wave 2), and **which decisions have no implementing file.**

### Layer 3 — Session continuity · ~half a day · free

1. **`SessionStart` hook** printing the live facts `STATE-OF-PLAY.md` currently
   hand-writes: branch, unpushed count, dirty files, gate status, library count,
   current phase and wave. Then **delete those lines from the doc** and let it
   keep what only a human can write — the rulings, the residuals, the traps.
   *(Anthropic: a SessionStart hook's stdout is added to context before the
   first prompt.)*
2. **Use auto memory deliberately.** It is on and empty. Corrections, confirmed
   approaches, and operator decisions belong there — they load every session and
   cost nothing until read.
3. **Plan mode for multi-session work.** The plan file is re-injected after every
   compaction. For a Phase 3 wave, that is the difference between surviving a
   compaction and re-deriving the wave protocol.
4. **A `Stop` hook that proposes doc updates** — Anthropic's suggested pattern:
   the hook receives the transcript path, so a script can propose the AGENTS.md
   or STATE-OF-PLAY edit *while the gap is fresh*, instead of relying on an
   end-of-session ritual that gets skipped when the session ends badly.

---

## 6. What this costs and what it returns

| Layer | Effort | Return |
|---|---|---|
| 0 · loading fix | ~2 h | Recovers ~37k tokens of unreachable convention; kills a false rule |
| 1 · disclosure | ~2 d | ~13.9k → ~4k always-loaded; two expensive traps become enforced |
| 2 · project graph | ~1 d | The graph, deterministic and gated; answers questions nothing can today |
| 3 · continuity | ~0.5 d | Live state replaces stale prose; memory + plan files carry the rest |
| **Total** | **~4 days** | — |

Against ~99 agent-days of remaining revamp work, four days spent so every one of
those sessions starts correct is the cheapest leverage on the board. Layer 0 is
close to free and should not wait for the rest.

**Sequencing:** Layer 0 → Layer 1 → Layer 2 → Layer 3. Each is independently
committable and revertible. Layer 2 wants Layer 1's skills in place so
`add-section-kind` can cite the graph.

---

## 7. Explicitly rejected

- **Graphify** — §1. Revisit only if the doc↔code node-merge bug closes *and* it
  reaches 1.0.
- **Graphiti / Zep, mem0, cognee** — require a graph DB or hosted service plus
  API keys, for a single-operator repo where native auto memory covers the need.
- **Serena** — good tool, but `typescript-lsp` is first-party for our stack.
- **A hand-maintained knowledge-graph markdown file** — this is
  `STATE-OF-PLAY.md`'s failure mode with more surface area. If it cannot be
  derived, it does not go in the graph; it goes in a decision record with an ID.
- **An MCP server for the project graph** — premature. A generated markdown file
  plus JSON is readable by every agent with no runtime. Reconsider only if
  queries outgrow a file read.

---

## 8. Change log

- **2026-08-31 — v1.** Research pass on Graphify and graph-based agent context.
  Graphify verified real (★112,961) and rejected on fit, with reasons. Five
  measured findings, of which Finding 1 — subtree `AGENTS.md` files never load,
  contradicting `CLAUDE.md:34` — is a live defect worth ~37k tokens of
  convention. Four-layer recommendation, ~4 days, native primitives plus one
  generated project graph. Nothing implemented yet.
