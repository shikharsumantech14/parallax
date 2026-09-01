# Context system — the plan

> **Status: v1.2, 2026-09-01. Phases A–E BUILT and committed. One item outstanding.**
>
> | Phase | State |
> |---|---|
> | **A · Delivery** | ✅ `d6489cb` — 3 shims + 1 rule, false claim corrected, 5 docs archived |
> | **B · Disclosure** | ✅ `06097ab` — 5 rules, 3 hooks, 48 tests · **B4 trim outstanding** |
> | **C · Skills** | ✅ `0c9283b` — 8 skills, all injections verified |
> | **D · Graph + continuity** | ✅ `a8b70ae`, `ad5a17d` — generator gated in prebuild, session brief, memory seeded |
> | **E · Editorial** | ✅ `ad5a17d` — agent memory on 3 agents, `/pipeline-status` |
>
> **Outstanding: the B4 AGENTS.md trim (866 → ~250 lines).** CD-03 requires each
> moved rule be *observed firing* in a fresh session before its AGENTS.md copy
> is deleted, and the building session could not restart itself to verify. The
> rules are additive today; nothing is lost, the resident block is simply still
> large. **This is the next session's first task** — see §14.
>
> v1.1 is a self-review pass (Fable 5, max effort) that stress-tested v1 against
> the official subagent documentation and the hybrid-system question. It found
> one real flaw in v1 (CD-02 was a false binary — fixed), two missed native
> capabilities (subagent memory, skill preloading — added as CD-12), and one
> live example of the disease this plan treats (§13.3). The verdict and the
> full hybrid analysis are §13.
>
> **What this is.** A complete, buildable plan for how Parallax carries knowledge
> across sessions, agents and months — the docs, the guides, the skills, and one
> generated project graph.
>
> **How to review it.** §2 is the evidence, §3 the locked decisions, §4–§9 the
> build. **§10 is written for you in plain English** — if you read one section,
> read that one. §12 lists what I still need from you. Every claim in §2 was
> measured on the committed repo, not assumed.
>
> **Companion:** `docs/CONTEXT-ARCHITECTURE.md` is the research pass that fed
> this (why Graphify was rejected, the tool survey). At execution the two merge
> into this file and the research doc is archived.

---

## 1. The problem in one paragraph

Parallax is unusually well documented — 192 markdown files, ~645k tokens,
decision records with cited IDs, 28 blueprints, gates that fail the build. And
yet every session starts by re-deriving the same things, because the machinery
that *delivers* that knowledge is broken in four specific ways: the subtree
guides never load at all, the always-loaded block is four times the recommended
size, none of the progressive-disclosure primitives are in use, and the files
that describe "where we are" are hand-maintained and therefore stale on arrival.
This is not a knowledge problem. It is a delivery problem, and all four causes
are fixable with native tooling in about seven days.

---

## 2. The evidence

All measured on the committed state, 2026-08-31 / 09-01.

### 2.1 The subtree guides never load — **live defect**

`CLAUDE.md:34` asserts:

> Subdirectory `AGENTS.md` files are picked up when working in their tree
> (via the agents.md cascading-read convention)

This is false. Anthropic's memory documentation states plainly: *"Claude Code
reads `CLAUDE.md`, not `AGENTS.md`."* Subdirectory discovery covers `CLAUDE.md`
and `CLAUDE.local.md` only. There is no cascading AGENTS.md read, and there
never was.

The root `AGENTS.md` loads **only** because root `CLAUDE.md` `@`-imports it.
Everything below is invisible:

| File | Tokens | Auto-loads today |
|---|---|---|
| `src/components/AGENTS.md` | ~17,131 | **No** |
| `app/AGENTS.md` | ~8,316 | **No** |
| `src/content/issues/_AGENTS.md` | ~7,960 | **No** |
| `research/AGENTS.md` | ~3,897 | **No** |
| **Total unreachable** | **~37,304** | |

Confirmed empirically: a session opened at the repo root receives `CLAUDE.md`
and `AGENTS.md`, and nothing else. **Every agent that has ever edited a
component did so without the component conventions** — the SVG rules, the
`px-` prefix table, the section-kind map, the "nine registry places" list —
unless it happened to read that file unprompted.

This single defect plausibly explains most observed cross-session drift.

### 2.2 The always-loaded block is 4× the guidance

| File | Lines | Tokens |
|---|---|---|
| `CLAUDE.md` | 44 | ~540 |
| `AGENTS.md` (via `@`-import) | 866 | ~13,358 |
| **Resident before any work** | **910** | **~13,898** |

Anthropic's target is **under 200 lines per file**, because *"longer files
consume more context and reduce adherence."*

Two compounding facts:

- **`@`-imports save nothing.** *"Imported files still load and enter the
  context window at launch."* The `CLAUDE.md`→`AGENTS.md` split is an
  organisational win and a zero-token win.
- **Adherence, not just tokens.** A rule at line 700 competes with a rule at
  line 20. The file already contradicts itself once (§2.1).

### 2.3 No progressive-disclosure primitives are in use

```
.claude/
├── agents/      ✅ 9 subagent definitions
├── commands/    ✅ 4 pipeline slash commands
├── skills/      ❌ does not exist
├── rules/       ❌ does not exist
└── hooks        ❌ none configured (settings.local.json has permissions only)
```

Consequence: everything reference-shaped or procedure-shaped has nowhere to live
except the always-loaded monolith.

Worse, the rules that have **actually cost us** are prose pleas:

- *"Claude commits only — never pushes."*
- *"Never `git checkout` / `reset` / `stash` / `restore` a file to 'undo'"* —
  after an agent wiped hours of uncommitted work exactly that way.

Anthropic is explicit: CLAUDE.md *"is context, not enforced configuration… to
block an action regardless of what Claude decides, use a PreToolUse hook."* Our
most expensive lesson is currently protected by a sentence.

### 2.4 Auto memory is enabled and completely empty

`~/.claude/projects/D--SideProjects-parallax/memory/` exists and contains **zero
files**. No `MEMORY.md`. This is a native, free, per-repo, cross-session store
whose index loads into every conversation — unused across the entire P0–P8
program and the whole design revamp.

### 2.5 State is hand-maintained, therefore stale on arrival

`STATE-OF-PLAY.md` is a good document that decays on write. Its 2026-08-28
revision opens *"Three commits await the operator's push."* On 2026-08-31 the
tree was clean and level with `origin/main`. A reader must re-derive the live
facts before trusting the file — which is the exact tax the file exists to remove.

**The decaying parts are precisely the computable parts**: branch, unpushed
count, dirty files, gate status, library count, phase/wave position.

### 2.6 Doc sprawl — three files each claim to be the entry point

| File | Last commit | Opening claim | Truth |
|---|---|---|---|
| `docs/STATE-OF-PLAY.md` | 2026-08-31 | *"read this first"* | ✅ current |
| `docs/NEXT-SESSION.md` | 2026-07-07 | *"TWO active threads… the current thread"* | ❌ describes P0–P8 as in-flight; it shipped |
| `docs/SESSION-HANDOFF.md` | 2026-06-20 | *"Read it fully before touching any code"* | ❌ ~2.5 months stale |

Neither `AGENTS.md` nor `CLAUDE.md` references the stale two, so they are
orphaned but still assertive. A fresh agent running `ls docs/` sees three
"read me first" files and two of them lie. Also stale or historical:
`DESIGN-REVAMP-NOTES.md` (marked COMPLETE 2026-06-03), `COMPONENT-AUDIT.md`,
`CLAUDE-DESIGN-BRIEF.md` (submitted 2026-05-24).

**This is context loss by contradiction, which is worse than loss by absence** —
an agent that finds nothing asks; an agent that finds a confident stale answer
acts on it.

### 2.7 What is already right — and must not be broken

The plan builds on these rather than replacing them:

- **Deterministic gates.** `check:catalog` (103 lines) derives the 97↔97 pairing
  plus EXPLAIN/KIND_PRIORITY coverage from ground truth and fails `prebuild`.
  `design-sync --check` gates 30 mirrors + 6 deeps + 18 record tokens.
- **Cited decision IDs.** RD-01…RD-09, TD-01…TD-06. `RD-01` is cited in **38
  files** spanning docs *and* source (`VizCard.astro`, `BillFunnel.astro`,
  `ChannelTernary.astro`, `FinishInterval.astro`). **This is already a knowledge
  graph** — hand-authored typed edges joining decisions to implementations,
  which is exactly the doc↔code join general-purpose graph tools currently
  cannot do reliably.
- **One-config codegen.** `wire-kind.mjs` derives six registry edits from one
  JSON config, idempotently, with per-file line-ending handling.

The system already embodies the right principle in places. The plan generalises
it.

---

## 3. Decisions — locked

Cite by ID in commit bodies and in any doc that implements them, exactly as
RD-/TD- are cited today. CD-01…CD-10 ratified by the operator on 2026-09-01;
the CD-02 correction plus CD-11 and CD-12 were added by the v1.1 review (§13)
and **await ratification with this draft**.

| ID | Ruling |
|---|---|
| **CD-01** | **Native primitives over third-party frameworks.** Skills, rules, hooks, auto memory, plan mode and the official `typescript-lsp` plugin. No Graphify, Graphiti, mem0, cognee, or Serena. Rationale in `CONTEXT-ARCHITECTURE.md` §1; short form — they solve structure-discovery for undocumented repos, and this repo's problem is delivery of documentation it already has. |
| **CD-02** | **Every fact has exactly one home, chosen by who can know it.** *(v1.1 — v1's two-way split was a false binary; see §13.2.)* Three classes: **derived** — computable from the repo (library count, wiring, citations) → generated, gated in `prebuild`; **attested** — knowable only by the operator because it lives outside this box (migration applied, Vercel smoke, what was pushed where) → authored prose, dated, named as attestation; **judged** — rulings, residuals, traps → authored once, cited by ID. A fact appears in exactly one class. Misfiling is the root staleness bug: v1 itself misfiled attested facts as derivable. |
| **CD-03** | **AGENTS.md is trimmed in stages, verified at each step.** Target ~250 lines. One section per commit. A moved rule must be *proven to fire* (`InstructionsLoaded` hook + `/context`) **before** the AGENTS.md copy is deleted. A step that fails verification reverts alone and its content stays put. **~250 is a target, not a promise — correctness outranks the line count.** |
| **CD-04** | **Never-moves list.** These stay always-loaded regardless of size: §1 identity, §4 the layout map, §7 hard rules (git discipline, no-hardcoded-names, the brand/legal naming split), and the standing greps. An agent cannot orient or stay safe without them. |
| **CD-05** | **Autonomy split.** Generated artifacts (the project graph, the live-state block) are written automatically and gated. Prose requiring judgement — rulings, residuals, traps, change-log entries — is **drafted and shown for approval before writing**. Mirrors the existing "operator approves factual claims" rule. |
| **CD-06** | **Scope: both sides, code first.** Phases A–D cover the code/design context. Phase E covers the editorial pipeline (`research/`, the 9 agents, voice contracts, RAG corpus) and is designed here but executed after D. |
| **CD-07** | **Stale docs are archived, not deleted.** Move to `docs/archive/` with a header stating the freeze date and what superseded them. History preserved; entry-point competition ended. |
| **CD-08** | **Windows is a first-class constraint.** Every skill that shells out uses `shell: powershell` or a `.mjs` script file. **No inline `python -c`, no complex quoted Bash one-liners** — this repo's own trap list records that they break in Git Bash, and it bit again while writing this plan. |
| **CD-09** | **The graph is a build artifact, not a source.** `docs/generated/` is committed for readability but is never hand-edited; a `PreToolUse` hook blocks edits to it. If graph and repo disagree, the build fails — same contract as `check:catalog`. |
| **CD-10** | **One entry point.** `docs/STATE-OF-PLAY.md` is the single "read this first" document. Every other doc that claims primacy is archived (CD-07). Its computable header becomes generated (CD-02); its judgement content stays authored. |
| **CD-11** | **Volatility split — environment-volatile facts are never committed.** *(v1.1.)* Branch, unpushed count, dirty files, gate pass/fail change outside any commit; committing them recreates staleness at machine speed (a committed "unpushed: 3" is wrong the moment the operator pushes). They live **only** in ephemeral surfaces: the SessionStart brief and `--brief` stdout. Committed generated files carry **repo-content facts only** and must be **deterministic** — no timestamps, sorted keys, write-only-if-changed — so `prebuild` never dirties the tree (the og.ts churn precedent is the cautionary tale, not the model). |
| **CD-12** | **Agent teams use native memory and preloading, not prompt restatement.** *(v1.1.)* Subagents that accumulate know-how get `memory: project` (`.claude/agent-memory/<name>/`, version-controlled) — formalising what `research/_voice/_voice-social-learned.md` + voice-refiner already do by hand. Wave component agents **preload** the conventions skills via `skills:` frontmatter (subagents receive the CLAUDE.md hierarchy automatically but never auto-load skills). Episodic recall — *why* something was done — uses session-transcript search and `PROJECT.md`, not a new store. |

---

## 4. Architecture

Five layers. Each is independently committable and revertible.

```
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 3 · CONTINUITY        SessionStart hook · auto memory     │
│                              plan mode · Stop hook               │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2 · THE GRAPH         scripts/project-graph.mjs           │
│                              → docs/generated/*  (gated)         │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 1 · DISCLOSURE        .claude/skills/  (procedures)       │
│                              .claude/rules/   (conventions)      │
│                              hooks            (enforcement)      │
│                              typescript-lsp   (navigation)       │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 0 · DELIVERY          subtree CLAUDE.md shims             │
│                              claudeMdExcludes · doc archive      │
└──────────────────────────────────────────────────────────────────┘
        LAYER E · EDITORIAL    research/ · the 9 agents · RAG
```

**The rule that governs all of it (CD-02):**

> Anything a machine can derive, a machine must derive.
> Anything only a human can decide, a human writes once and cites by ID.

---

## 5. Phase A — Delivery (Layer 0) · ~3 hours

**Goal:** make the knowledge that already exists actually reach the session.
Highest value per hour in the entire plan; ship it before anything else.

### A1 · Subtree CLAUDE.md shims

Four new files, three lines each. The AGENTS.md files do not move — they stay
portable for other tooling and become reachable for this one.

`src/components/CLAUDE.md`:
```markdown
@AGENTS.md
```

Same for `app/CLAUDE.md` and `research/CLAUDE.md`.

> **CORRECTION, verified in execution 2026-09-01.** This step originally
> specified a fourth shim at `src/content/issues/CLAUDE.md`. **That breaks the
> build**, and so does the fallback at `src/content/CLAUDE.md`. The issues
> collection is `type: 'content'`: Astro parses every `.md` at the collection
> root as an entry (`InvalidContentEntryFrontmatterError`) and rejects any `.md`
> directly in `src/content/` as belonging to no collection
> (`UnknownContentCollectionError`). Both were observed, not reasoned about.
> This is the same trap `_AGENTS.md`'s leading underscore exists to dodge — the
> plan reproduced the very mistake the filename documents.
>
> **That subtree uses `.claude/rules/issue-authoring.md` instead**, pulled
> forward from B1. Rules live outside `src/`, so Astro never sees them.
> **Standing rule: inside `src/content/`, agent instructions go in
> `.claude/rules/`, never in the tree.**

**Effect:** when Claude reads any file in that subtree, the guide loads on
demand. ~37k tokens go from unreachable to reachable, at zero always-loaded cost.

**Verify:** open a file in each subtree, run `/context`, confirm the guide
appears under **Memory files**.

### A2 · Correct the false claim

Rewrite `CLAUDE.md` §"Subtree memory" to describe what actually happens, and add
an `AGENTS.md` §10 change-log entry recording the defect and its cost. This is a
trap that silently taxed every prior session; it gets the same treatment as any
other trap in §7.

### A3 · Exclude the stale handoff tree

`Parallax Design System Revamp/` — 11 MB, 140 files, tracked, carries its own
`AGENTS.md`, and is explicitly *"stale background"* under RD-02.

`.claude/settings.json` (committed, project-scope):
```json
{
  "claudeMdExcludes": ["**/Parallax Design System Revamp/**"]
}
```

### A4 · Archive the competing entry points (CD-07)

```
docs/archive/
├── README.md                   ← what this folder is; index with freeze dates
├── NEXT-SESSION.md             ← froze 2026-07-07 · superseded by STATE-OF-PLAY
├── SESSION-HANDOFF.md          ← froze 2026-06-20 · superseded by STATE-OF-PLAY
├── DESIGN-REVAMP-NOTES.md      ← COMPLETE 2026-06-03 · history → PROJECT.md
├── COMPONENT-AUDIT.md          ← froze 2026-06-20
└── CLAUDE-DESIGN-BRIEF.md      ← submitted 2026-05-24 · input to REVAMP-PLAN
```

Each gains a four-line header: froze on, superseded by, why kept, do not treat
as current. `git mv` preserves history.

**Phase A exit:** `/context` shows each subtree guide loading in its tree;
`docs/` has exactly one "read this first"; the false claim is gone.

---

## 6. Phase B — Disclosure (Layer 1) · ~2.5 days

### B1 · Path-scoped rules

`.claude/rules/*.md`, each with `paths:` frontmatter so it loads **only** when a
matching file is touched. Content is *moved from* `AGENTS.md` under CD-03's
verify-then-remove discipline.

| Rule file | `paths:` | Moved from |
|---|---|---|
| `svg-and-components.md` | `src/components/**` | AGENTS.md §7 visual rules |
| `issue-authoring.md` | `src/content/issues/**/*.mdx` | §7 schema rules |
| `design-tokens.md` | `src/styles/**`, `shared/design/**` | §3 topics table, §7 token rules |
| `viz3d.md` | `src/scripts/viz3d/**` | §2 WebGL notes |
| `app-ssr.md` | `app/**` | §7 migration + deploy-order rules |
| `editorial.md` | `research/**`, `.claude/agents/**` | §5 pipeline, §6 voice |
| `pipeline-scripts.md` | `scripts/**` | §2 commands, cost table |

Example — `.claude/rules/issue-authoring.md`:
```markdown
---
paths:
  - "src/content/issues/**/*.mdx"
---

# Issue authoring

- `primer` is 80–420 chars, Zod-enforced. Overshooting **breaks the build**.
- `plain` is max 220 chars, Zod-enforced. It explains the *form* of the viz
  ("each block is one seat"), never the data. The caption explains the data.
- `howToRead` is 40–360 chars, renders ABOVE the graphic.
- `caption` is the DATA claim — the only comprehension field the verifier traces.
- `sources[].url` must be a real URL. Mock URLs break the build.
- Every `sourceRefs[]` entry must resolve to an existing `source.id`.
- `skimCaption` applies to `kind: prose` only; other kinds ignore it.
- `layout` ∈ default | wide | bleed | split | split-flip | breath.

Full detail: `src/content/issues/_AGENTS.md`.
```

**The verify-then-remove loop (CD-03), per rule:**

1. Write the rule file. **Leave the AGENTS.md copy in place.**
2. Restart the session. Open a file matching the glob.
3. `/context` → confirm the rule is listed. `InstructionsLoaded` hook logs
   `load_reason: "path_glob_match"` with the file path.
4. Only then, delete the AGENTS.md copy — **its own commit**, message citing
   CD-03 and naming the verification.
5. If step 3 fails: the glob is wrong or the mechanism does not fit. Fix the
   glob and retry once; if it still fails, **the content stays in AGENTS.md**
   and the rule file is deleted. Record the failure in the change log.

### B2 · Enforcement hooks

`.claude/settings.json`, with scripts in `.claude/hooks/`. Exact schema
confirmed against the hooks reference.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command",
            "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/guard-git.mjs" }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command",
            "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/guard-generated.mjs" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command",
            "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/gate-registry.mjs" }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "startup|resume|clear",
        "hooks": [
          { "type": "command",
            "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/session-brief.mjs",
            "timeout": 30 }
        ]
      }
    ]
  }
}
```

**`guard-git.mjs`** — reads `tool_input.command` from stdin JSON. Denies:
`git push` (operator-only, AGENTS.md §7) and `git checkout|reset|stash|restore`
with a path argument (the work-destroying trap). Returns:

```json
{ "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "AGENTS.md §7: Claude commits only, the operator pushes. Ask the operator to run this." } }
```

Exit 0 with no output for everything else, so normal permission flow applies.
Read-only `git status|log|diff|show` is never touched.

**`guard-generated.mjs`** — denies writes to `docs/generated/**` (CD-09), with
a reason naming `scripts/project-graph.mjs` as the way to change it.

**`gate-registry.mjs`** — after an edit to `src/content/config.ts`,
`docs/design/catalog.md`, `src/lib/explainers.ts` or `src/lib/story.ts`, runs
`check:catalog` and surfaces failure via `systemMessage`. Catches a half-wired
kind at edit time instead of at build time.

**`session-brief.mjs`** — Layer 3; specified in §8.

**Verification burden.** Hooks fire on *every* matching call, so a buggy hook is
expensive. Each ships with a unit test (`node .claude/hooks/<name>.test.mjs`)
feeding recorded stdin fixtures and asserting the decision. Tests run in CI-less
fashion via one npm script, `npm run hooks:test`.

### B3 · Code intelligence

```bash
/plugin install typescript-lsp@claude-plugins-official
```

Symbol lookup via the language server instead of grep-and-read. This is the
navigation win Graphify claims, delivered first-party. Also add `Read` deny
rules for `dist/`, `.astro/`, `node_modules/`, `public/geo/*.json` (large
generated payloads).

### B4 · AGENTS.md trim

Executed *by* B1's loop — the trim is the sum of the verified removals, not a
separate editing pass. Expected end state:

| Section | Disposition |
|---|---|
| §1 what this is | **stays** (CD-04) |
| §2 tech stack | table stays; per-area detail → rules |
| §3 six topics | one-line pointer; table → `design-tokens.md` |
| §4 layout map | **stays** (CD-04) |
| §5 pipeline | summary stays; detail → `editorial.md` |
| §6 voice system | mode table stays; detail → `editorial.md` |
| §7 hard rules | **stays entire** (CD-04) |
| §8 verification | → `verify-done` skill (§7) |
| §9 cross-references | **stays**, updated |
| §10 change log | stays, trimmed to last 3 entries + pointer to PROJECT.md |

**Projected: 866 → ~250 lines, ~13.9k → ~4k resident. Reachable knowledge rises
from ~13.9k to ~50k.**

**Phase B exit:** every rule verified firing; `npm run hooks:test` green; a
blocked `git push` produces the right message; `/context` shows the reduced
resident set.

---

## 7. Phase C — Skills · ~2 days

Skills load their body **only when used**, so long procedures cost nothing until
needed. All frontmatter below is checked against the skills reference.

**Windows note (CD-08):** every skill that shells out declares
`shell: powershell` or calls a `.mjs` file. No inline `python -c`.

### The set

| Skill | Invoked by | Purpose |
|---|---|---|
| `catch-up` | you / auto | Cold-start orientation from live state + graph |
| `update-state` | you | Refresh STATE-OF-PLAY: auto-write derived, propose prose |
| `doc-audit` | you / auto | Find stale, contradictory, orphaned, broken-ref docs |
| `close-session` | you | End-of-session: what changed, what to update, memory writes |
| `add-section-kind` | auto | The nine registry places, wrapping `wire-kind.mjs` |
| `run-wave` | you | The Phase 3 wave protocol |
| `verify-done` | auto | The §8 checklist including the honest overflow test |
| `publish-issue` | you | Status flip, sourceRefs, primer bounds, standing greps |

### C1 · `catch-up` — the orientation skill

`.claude/skills/catch-up/SKILL.md`:

```markdown
---
name: catch-up
description: Orient at the start of a session on Parallax — live repo state, gate status, where the revamp stands, and what to do next. Use when resuming work, when the user asks "where are we", or when starting any task whose scope is not already clear.
allowed-tools: Bash(git *), Bash(npm run *), Read, Glob, Grep
shell: powershell
---

# Catch up

## Live state
!`node scripts/project-graph.mjs --brief`

## Recent history
!`git log --oneline -12`

## Your task

1. Read `docs/STATE-OF-PLAY.md` — the ONLY current entry point. Anything in
   `docs/archive/` is frozen history; never treat it as current.
2. Reconcile: if the doc's prose disagrees with the live state above, **trust
   the live state** and say so plainly. Offer to run `/update-state`.
3. Report in this order, briefly:
   - where the revamp stands (phase, wave, library count)
   - what is uncommitted or unpushed
   - which gates pass
   - the next 2–3 candidate actions from STATE-OF-PLAY §5, with the plan's own
     ranking, not yours
4. Stop. Do not begin work until the operator picks.

Decisions are locked and cited: RD-01…RD-09 in `docs/REVAMP-PLAN.md` §1,
TD-01…TD-06 in `docs/design/TOKEN-RECORD.md`, CD-01…CD-12 in
`docs/CONTEXT-PLAN.md` §3. **Do not re-litigate a cited decision** — if you
believe one is wrong, say so once and continue.

For *why* something was done — a decision's back-story, an abandoned approach —
check `docs/PROJECT.md` first, then search past session transcripts if the
tooling offers it (CD-12). Do not guess at history that is recorded.
```

### C2 · `update-state` — the maintenance skill (CD-05)

```markdown
---
name: update-state
description: Refresh docs/STATE-OF-PLAY.md after a work session — regenerate the derived facts and propose prose edits for the authored sections. Use after finishing a chunk of work, before ending a session, or when the state doc has drifted from reality.
argument-hint: [optional note about what changed]
allowed-tools: Bash(git *), Bash(node scripts/*), Read, Edit
shell: powershell
---

# Update state of play

## Live state
!`node scripts/project-graph.mjs --brief`

## Uncommitted
!`git status --short`

## Since last state-doc commit
!`git log --oneline -20 -- . ":(exclude)docs/archive"`

## Your task

**Two categories, two rules (CD-05).**

**DERIVED — write without asking.** The `<!-- BEGIN GENERATED -->` …
`<!-- END GENERATED -->` block in STATE-OF-PLAY §2. It is produced by
`node scripts/project-graph.mjs --state-block`. Never hand-write inside it.

**AUTHORED — draft, then ask.** §4 what is done, §5 what is left, §6 residuals,
§7 traps. For these:

1. Read the current STATE-OF-PLAY.
2. From the git log and the live state above, work out what genuinely changed.
3. Draft the specific edits — quote the exact before/after lines.
4. **Present them and stop.** Do not write until the operator approves.
5. On approval, apply exactly what was approved. Nothing extra.

## Rules

- A new trap goes in §7 **only if it actually bit this session.** §7 is a record
  of real damage, not a list of hypotheticals.
- A residual goes in §6 only if it is deliberate and you can say why.
- Never delete an authored line to "tidy" — flag it and let the operator rule.
- If a fact is derivable, it belongs in the generated block, not in prose (CD-02).
- $ARGUMENTS
```

### C3 · `doc-audit` — the staleness detector

```markdown
---
name: doc-audit
description: Audit Parallax's documentation for staleness, contradictions, orphaned files, and broken cross-references. Use when docs feel out of sync, before a handover, or periodically as maintenance.
allowed-tools: Bash(git *), Bash(node scripts/*), Read, Glob, Grep
shell: powershell
---

# Documentation audit

## Doc inventory with last-touched dates
!`node scripts/project-graph.mjs --doc-audit`

## Your task

Report findings in these five classes, most severe first. **Report only — change
nothing** unless the operator asks.

1. **Contradiction** — two docs asserting different current truth. The worst
   class: an agent acting on a confident stale answer is worse off than one that
   found nothing. (This is what `NEXT-SESSION.md` did for two months.)
2. **Derivable prose** — a hand-written fact that a generator could compute.
   Every instance is future staleness (CD-02).
3. **Broken reference** — a cited file, section, or ID that does not exist.
   Includes RD-/TD-/CD- IDs with no definition.
4. **Orphan** — a doc nothing links to and no guide mentions.
5. **Dangling decision** — a decision ID cited in planning docs but with **zero
   implementing files.** Report the count and the citing files; a dangling
   decision is legitimately "decided but not built" (RD-05 is exactly this
   today), so **never flag it as an error** — surface it as status.

For each: file, line, what is wrong, and the smallest fix. Rank by cost of
being wrong, not by count.
```

### C4 · `close-session` — the handoff ritual

```markdown
---
name: close-session
description: Close out a Parallax working session — summarise what changed, propose doc updates and memory writes, and leave the repo ready for a cold start. Use when wrapping up, before a context handoff, or when the user says they are done for now.
allowed-tools: Bash(git *), Bash(node scripts/*), Read, Edit, Write
shell: powershell
---

# Close session

## What changed
!`git status --short`
!`git log --oneline -10`
!`git diff --stat HEAD`

## Your task

1. **Summarise** what this session actually did — in outcomes, not narration.
2. **Gates:** report `npm run check:catalog` and `npm run design:check`. If
   either fails, say so plainly; do not close over a red gate.
3. **Propose a commit** — message in repo style: imperative subject, body citing
   the decision IDs touched, **no `Co-Authored-By` trailer** (AGENTS.md §7).
   Do not commit until asked. **Never push** — the operator pushes.
4. **Propose doc updates.** If STATE-OF-PLAY needs it, offer `/update-state`.
   If a *standing convention* changed, propose the AGENTS.md or rule edit.
5. **Propose memory writes.** Auto memory is for what the repo does NOT record:
   operator preferences, corrections given this session, decisions whose
   rationale is not in a doc. Do **not** save anything derivable from code, git
   history, or the guides. Draft each as one line and ask.
6. **Name the next action** in one sentence, so the next session starts there.

Stop after presenting. Every write in steps 3–5 needs approval (CD-05).
```

### C5 · `add-section-kind` — the nine-place procedure

```markdown
---
name: add-section-kind
description: Add a new section kind to the Parallax component library, wiring it through all nine registry places. Use when adding a kind from a blueprint, running a Phase 3 wave, or when check:catalog reports a kind missing from a registry.
argument-hint: [kind-name]
allowed-tools: Bash(node scripts/*), Bash(npm run *), Read, Edit, Write, Glob, Grep
paths:
  - "src/content/config.ts"
  - "src/components/SectionBody.astro"
  - "docs/design/catalog.md"
---

# Add a section kind

**Six of the nine places are automated. Do not hand-edit those six.**

## Automated — `node scripts/wire-kind.mjs <config.json>`
1. `SECTION_KINDS` in `src/content/config.ts`
2. import + dispatch arm in `src/components/SectionBody.astro`
3. `EXPLAIN` entry in `src/lib/explainers.ts`
4. `KIND_PRIORITY` score in `src/lib/story.ts`
5. `## <kind>` block in `docs/design/catalog.md` (same order as SECTION_KINDS)
6. the CSS prefix registration

Read `scripts/wire-kind.mjs`'s header for the config shape. It is idempotent —
a partial run is safe to re-run.

## Manual — yours
7. the component file itself, `src/components/topic/<world>/<Name>.astro`
8. `src/scripts/viz3d/scenes/index.ts` — **WebGL kinds only**
9. a worked example in that world's showcase issue
Plus: theme CSS, an entry in `src/components/AGENTS.md`, and any `TRIM` cap.

## Traps that have actually bitten
- `SectionBody.astro` is the dispatcher. **`SectionRenderer.astro` is article
  chrome only** — wiring there does nothing.
- `coalition-calculus` dispatches with a **spread**, unlike every other kind.
- `CityGrid` hard-throws outside 1–3 cities.
- Globe seed-yaw is `-((cLon + 90) * Math.PI) / 180`. A `+180` opens on the limb.
- `config.ts` is **CRLF** — exact-string anchors fail; match `\r?\n`. This is
  why `wire-kind.mjs` exists.
- In-SVG `<text>` uses a **literal font stack**, never `var()` (RD-01b).

## Finish
Run `npm run check:catalog` — it asserts the 1:1 pairing, the order, and
EXPLAIN + KIND_PRIORITY coverage. Then `/verify-done`.

Blueprint: `docs/design/blueprints/<world>/$0.md` — **read its corrections
header first; it overrides the handoff.**
```

### C6–C8 · `run-wave`, `verify-done`, `publish-issue`

Same pattern; full bodies written during Phase C. Summaries:

- **`run-wave`** — the Phase 3 protocol: component agents get a **one-file
  scope**; the orchestrator alone edits the shared registries (they are
  merge-conflict magnets); browser-verify against blueprint §11; one commit per
  wave. Encodes the trap that a subagent once wiped uncommitted work.
- **`verify-done`** — AGENTS.md §8, including the **honest overflow test**
  (`window.scrollTo(9999, y)` → `scrollX` stays 0; the preview pane reports
  false overflow when hidden or when `position: fixed` elements measure wide)
  and the standing greps. `paths:` scoped so it offers itself after component work.
- **`publish-issue`** — status flip, `sourceRefs[]` resolution, primer bounds,
  the greps, and the reminder that **only the operator publishes**.

### C9 · Existing commands

`.claude/commands/pipeline-*.md` keep working unchanged — custom commands and
skills are now the same mechanism. Migrate to `.claude/skills/` only in Phase E,
and only to gain supporting files or `paths:` scoping.

**Phase C exit:** each skill invoked once against real repo state and its output
checked; `catch-up` correctly reports live state on a fresh session.

---

## 8. Phase D — The graph and continuity · ~1.5 days

### D1 · `scripts/project-graph.mjs`

Modelled directly on `check-catalog.mjs` (103 lines, regex over ground truth).
Expected ~350 lines. **Zero LLM calls, zero network, zero new dependencies.**

**Nodes and their ground truth:**

| Node | Derived from |
|---|---|
| `kind` (97) | `SECTION_KINDS` in `config.ts` |
| `component` | `SectionBody.astro` dispatch arms |
| `decision` (RD/TD/CD) | headers in REVAMP-PLAN §1, TOKEN-RECORD, this file §3 |
| `issue` (23) | `src/content/issues/*/index.mdx` frontmatter |
| `blueprint` (28) | `docs/design/blueprints/<world>/*.md` |
| `doc` (192) | `find *.md` + `git log -1` per file |
| `world` (6) | `TOPICS` in `config.ts` |
| `phase` | REVAMP-PLAN §0 table |

**Edges:**

| Edge | How |
|---|---|
| `kind --wired-in--> registry place` | presence in each of the nine |
| `kind --used-by--> issue` | `kind:` in issue frontmatter |
| `kind --specified-by--> blueprint` | filename match |
| `decision --cited-by--> file` | grep the ID |
| `decision --implemented-by--> source file` | ID cited in `src/`, `app/`, `shared/`, `scripts/` |
| `doc --references--> doc` | markdown links + backtick paths |
| `kind --owns--> css prefix` | `px-` prefix in the component |

**Outputs — split by fact class (CD-02, CD-11):**

- `docs/generated/PROJECT-GRAPH.md` — human/agent-readable, the primary artifact.
  **Repo-content facts only, deterministic** (no timestamps, sorted keys,
  write-only-if-changed) so regenerating on every build never dirties the tree.
- `docs/generated/project-graph.json` — machine-readable for skills and hooks
- `--brief` — ~25 lines for the SessionStart hook and `catch-up`. **The only
  place environment-volatile facts appear** (branch, unpushed, dirty, live gate
  status) — ephemeral stdout, never written to a file.
- `--state-block` — the generated block for STATE-OF-PLAY §2: **repo-content
  facts only** (library count, wave position, caption/source gaps). Volatile
  facts are the brief's job; **attested facts (migration applied, live smoke)
  stay authored** — a script on this box cannot know them, only you can.
- `--doc-audit` — the inventory `doc-audit` consumes
- `--check` — **exit non-zero on disagreement**, wired into `prebuild`

**Questions it answers that nothing can today:**

- Which of the 97 kinds have **never appeared in a published issue.** (The plan's
  own argument for workstream B over Wave 2 rests on "70 of 90 never shipped" —
  currently an unverified assertion in prose. This makes it a computed fact.)
- Which decisions are cited but have **zero implementing files** (RD-05 today).
- Which blueprints are written but unbuilt (21 of 28).
- Which docs have not been touched since a decision they depend on changed.

**`prebuild` becomes:**
```
design-sync --check → check-catalog → project-graph --check → og.ts
```
Graph generation before the OG writer, same as the other gates (a gate that runs
after a writer has already rewritten tracked files is not a gate).

### D2 · `session-brief.mjs` — the SessionStart hook

Runs `project-graph.mjs --brief`, prints to stdout. Exit 0 stdout is added to
context before the first prompt. Roughly:

```
PARALLAX · main · clean · level with origin
Gates: catalog 97↔97 ✅ · design-sync ✅ · graph ✅
Revamp: Phase 3 Wave 1 done · library 97/118 · Waves 2–4 open
Entry point: docs/STATE-OF-PLAY.md   (docs/archive/ = frozen history)
Decisions: RD-01…09 · TD-01…06 · CD-01…10 — locked, cite don't re-litigate
```

**Then STATE-OF-PLAY §2 is rebuilt along the CD-02 three-way split:** the
volatile rows (branch, unpushed, working tree) are **deleted, not generated** —
they move to the ephemeral brief; the repo-content rows become the generated
block; the attested rows (migration applied, live smoke, what is deployed)
**stay authored**, each dated and marked as an operator attestation. The doc
keeps what only a human can write — which v1.1 recognises is two things, not
one: judgement *and* attestation.

Budget: ≤400 tokens, 30s timeout. If the script fails it must exit 0 silently —
**a broken hook must never block a session start.**

### D3 · Auto memory, used deliberately

Seed `MEMORY.md` and write the standing facts that are *not* in the repo:
operator preferences, the Claude-Code-route model policy rationale, the
approval boundaries. `close-session` proposes additions thereafter. Hard limit:
`MEMORY.md` ≤200 lines / 25KB — beyond that the tail is silently dropped.

**What must never go in:** anything derivable from code, git history, or the
guides. Auto memory is for what the repo cannot say about itself.

### D4 · Plan mode as standing practice

For any multi-session unit (a Phase 3 wave, a retrofit round), start in plan
mode. **The plan file is re-injected after every compaction** — it is the native
answer to "don't lose the thread in a long session," and it costs nothing.

### D5 · Optional — Obsidian view

`docs/` opens as an Obsidian vault today with no changes. If the graph *view*
proves useful, `project-graph.mjs` gains an `--obsidian` flag emitting a vault
with `[[wikilinks]]` between decisions, kinds, blueprints and issues — one
generator, two audiences. **Deferred until you have tried the plain vault**;
do not build it speculatively.

**Phase D exit:** `prebuild` gates the graph; a fresh session prints the brief;
STATE-OF-PLAY §2 is generated; `MEMORY.md` seeded.

---

## 9. Phase E — Editorial context (CD-06) · ~2 days · after D

The same treatment for the publication side. Designed now, built after D.

- **`research/CLAUDE.md` shim** — ships in Phase A with the others.
- **`.claude/rules/editorial.md`** — the eight voice modes, blending limits
  (≤1 SATIRICAL, ≤2 LYRICAL, 4–6 modes per issue), the AI-tell catalog. Fires on
  `research/**` and `**/*.mdx`.
- **Skills:** `pipeline-status` (where each of the six categories stands,
  derived from `research/<cat>/` filenames and issue frontmatter);
  `dossier-review` (the operator's gate-2 checklist for `[UNVERIFIED]` items).
- **Graph extension:** `issue → sources → tier`, and **which allowlisted sources
  have never been cited** — a real editorial question nothing answers today.
- **The 9 subagents (CD-12):** each gets a `paths:`-scoped rule instead of
  restating conventions in its system prompt — subagents receive the full
  CLAUDE.md hierarchy (project rules included) automatically, though the
  built-in Explore and Plan agents skip it. They do **not** inherit the main
  conversation's auto memory, and skills never auto-load into them — preload
  via `skills:` frontmatter where a subagent needs one.
- **Persistent agent memory (CD-12):** verifier, stylist and drafter gain
  `memory: project` → `.claude/agent-memory/<name>/`, committed. The verifier
  accumulates recurring claim-error patterns; the stylist accumulates mode-fit
  judgements. This is the native version of what the repo already hand-rolled:
  `research/_voice/_voice-social-learned.md`, which voice-refiner proposes into
  and social-writer reads — that loop keeps its editorial approval gate and
  simply gains the native storage convention. Wave component agents preload the
  conventions skills the same way.
- **Model policy** stays as-is: Claude Code route pins **every** phase to Opus;
  `pipeline.config.ts`'s Sonnet/Opus split is API-CLI only. Not to be
  "optimised."

---

## 10. In plain terms — written for you

*No jargon. This is what actually changes and how you will use it day to day.*

### What is wrong right now

Think of every session as an employee who arrives with amnesia. You handle this
by leaving them a binder. The binder is excellent — better than most companies
have.

Four things are wrong with how the binder gets handed over.

**One: four of the chapters were never in the binder.** You wrote detailed
guides for components, for the app, for issue-writing, for research — about
37,000 words' worth. A note in the front says "these are picked up
automatically." They are not. That was never true. Every session for months has
worked on components **without the component rules**, because the tool reads
files named `CLAUDE.md` and yours are named `AGENTS.md`. It is a filename
mismatch, and it has been quietly expensive.

**Two: the front section is too long to hold.** The always-read part is about
910 lines. The guidance is 200. It is not just cost — a rule on line 700
competes with a rule on line 20 for attention, and the long version wins less
often than you would think.

**Three: the "where we are" note goes out of date the moment it is written.**
`STATE-OF-PLAY.md` said "three commits waiting to be pushed." By the time I read
it there were zero. Nothing was wrong with the writing — it is that a human
wrote down a fact that changes on its own.

**Four: three different files each say "read me first," and two of them are
wrong.** `NEXT-SESSION.md` still describes work that finished in July.
`SESSION-HANDOFF.md` is from June. Neither is linked from anywhere, but both
sound authoritative. **A confidently wrong answer is worse than no answer**,
because nobody thinks to double-check it.

### What we are building

**A place for everything, and things arrive when they are relevant.**

Four kinds of thing, and it helps to keep them straight:

| Thing | Plain description | When it shows up |
|---|---|---|
| **Guides** (`AGENTS.md`, rules) | The house rules | Automatically — the general ones always, the specific ones when you touch that area |
| **Skills** | Recipes for jobs you do repeatedly | When you ask, or when the job comes up |
| **Hooks** | Tripwires | Automatically, at the moment something happens |
| **The graph** | An auto-updating index of the project | Regenerated on every build |

**Guides — the rules split by area.** Instead of one 866-line document read
every time, the general rules stay short, and the specific ones are filed by
area. Open a component file and the component rules arrive. Open an issue and
the writing rules arrive. Work on the app and neither shows up, because neither
applies. Nothing is thrown away — it is filed.

The important safety detail: **we never delete a rule from the big file until we
have watched the new version actually arrive.** There is a diagnostic that logs
which rules loaded and why. Move a rule, check it turns up, then remove the old
copy. If it does not turn up, it goes back and we keep the big file bigger. Being
correct matters more than hitting a line count.

**Skills — recipes.** A skill is a written procedure that sits on a shelf costing
nothing until it is needed. You type `/catch-up` and it fires. Eight of them:

- **`/catch-up`** — *"Where are we?"* Reads the live repo, reports what is
  committed, which checks pass, where the revamp stands, and what the plan says
  to do next. Then stops and waits for you. **This replaces reading three
  documents and not trusting any of them.**
- **`/update-state`** — *"Write down where we got to."* Updates the facts
  automatically, and for anything needing judgement it shows you the exact
  wording and waits for a yes.
- **`/doc-audit`** — *"Is anything in the docs lying?"* Finds contradictions,
  broken references, orphans, and hand-written facts that should be automatic.
  Reports, changes nothing.
- **`/close-session`** — *"Wrap up."* Summarises what changed, checks the gates,
  drafts a commit message, proposes doc updates and notes to remember, and names
  the next action. Everything waits for your approval.
- **`/add-section-kind`**, **`/run-wave`**, **`/verify-done`**,
  **`/publish-issue`** — the recurring project jobs, with the traps that have
  actually bitten written into each.

**Hooks — tripwires.** Small scripts that run automatically. Three matter:

- One **blocks `git push`** and blocks the destructive git commands that once
  wiped hours of your uncommitted work. Right now that rule is a *sentence in a
  document*, which is a request. A hook makes it a wall.
- One **runs the registry check** the moment a registry file is edited, so a
  half-wired component is caught immediately, not at the next build.
- One **prints the live state** at the start of every session — branch, what is
  uncommitted, which checks pass, what phase we are in. About five lines. It is
  always true because it is measured, not remembered.

**The graph — the auto-updating index.** A script reads the repo and writes a
map: all 97 component kinds and which of the nine required places each is wired
into; every decision (RD-01, TD-06, and now CD-01…) and which files actually
implement it; every issue and which components it uses; which blueprints are
written but unbuilt.

The essential property: **nobody writes it, so it cannot go stale.** And it is
checked at build time — if the map and the repo disagree, the build fails. That
is exactly how `check:catalog` already protects the component library. We are
extending a pattern you already trust.

It will also answer things nothing currently can. Your own plan argues that
workstream B beats Wave 2 because *"70 of the original 90 kinds have never
appeared in a published issue."* Right now that is a sentence someone wrote.
Afterwards it is a number the build computes.

### How things get refreshed

Three different clocks, which is the point — each fact is refreshed by whatever
is cheapest and most reliable for that fact.

**Automatic, every build.** The graph and every derived number. You do nothing.
If they drift, the build stops.

**Automatic, every session start.** The five-line live-state brief. Measured
fresh each time.

**On request, with your approval.** The written judgement — what is done, what
is left, what to watch out for. `/update-state` drafts it, you approve or edit.
This is the only kind that needs you, and that is deliberate: it is the only
kind that is *judgement*, and judgement is yours.

One subtlety the review pass sharpened: some facts are neither measurable nor
judgement — things like *"I applied the database migration"* or *"the live site
checks out."* No script on this machine can know those; only you can, because
they happened somewhere else. Those stay written by hand, with a date, clearly
marked as *your word for it*. The system never pretends to know what only you
witnessed — and never asks you to maintain what it can measure.

### A day with this, concretely

**Starting.** You open a session. Five lines appear: branch, clean, gates green,
Phase 3 Wave 1 done, library 97 of 118. You type `/catch-up`. It reads the live
repo and the state doc, tells you if they disagree, and lists two or three
sensible next actions. You pick one.

**Working.** You start on a Wave 2 component. The component rules arrive by
themselves because you opened a component file. `/add-section-kind` offers the
nine-place procedure with the traps already listed — the CRLF one, the
`SectionRenderer`-versus-`SectionBody` one, the globe yaw. You would otherwise
rediscover those, as previous sessions did.

**Slipping.** You try something that would destroy uncommitted work. It is
blocked, with the reason. Not a warning — a wall.

**Finishing.** `/close-session`. It summarises, runs the gates, drafts a commit
citing the right decision IDs, proposes the state-doc update, and suggests one
thing worth remembering permanently. You approve. You push, because only you
push.

**Next week.** New session, no memory of this one. The brief is accurate because
it is measured. The state doc is accurate because it was updated with approval.
The graph is accurate because it is generated. The rules arrive when relevant.
**Nothing to reconstruct.**

### What this does not do

Worth being straight about.

- **It does not make decisions for you.** Every judgement call still comes to you.
  That is by design — the failures here were never bad judgement, they were good
  judgement not making it to the next session.
- **It does not stop docs going stale — it shrinks the stale-able surface.**
  Anything a machine can work out becomes automatic. What is left is genuinely
  yours to maintain, and there is much less of it.
- **It is not Graphify or a memory framework.** No new service, no database, no
  API key, no subscription. Everything here is either built into the tool you
  already use, or about 350 lines of JavaScript in a repo that already has 493
  lines of very similar scripts working well.
- **It will not be perfect on the first pass.** A rule might not fire; a hook
  might be too aggressive. Every step is one commit and reverts alone.

---

## 11. Effort, sequencing, verification

| Phase | Effort | Ship independently? |
|---|---|---|
| **A · Delivery** | ~3 h | ✅ — do this first regardless of the rest |
| **B · Disclosure** | ~2.5 d | ✅ per rule / per hook |
| **C · Skills** | ~2 d | ✅ per skill |
| **D · Graph + continuity** | ~1.5 d | ✅ generator, then hook, then memory |
| **E · Editorial** | ~2 d | ✅ after D |
| **Total** | **~7 days** | |

Against ~99 agent-days of remaining revamp work, seven days so that every one of
those sessions starts correct is strong leverage. **Phase A is ~3 hours and
should not wait for approval of the rest.**

**Order is load-bearing.** A before B (no point trimming into rules while the
delivery mechanism is broken). B before C (skills cite rules). C before D's hook
(the brief points at `catch-up`). D's generator before its `--check` gate.

**Standing verification, every phase:**

```bash
npm run build            # 44 pages; prebuild gates run first
npm run check:catalog    # 97 ↔ 97, order, EXPLAIN + KIND_PRIORITY
npm run design:check     # 30 mirrors + 6 deeps + 18 record tokens
npm run hooks:test       # NEW — hook decisions against recorded fixtures
node scripts/project-graph.mjs --check   # NEW
cd app; npm run build    # the ONLY local gate for app work
```

Plus, per phase: `/context` confirms the intended resident set; the standing
greps return zero; a session opened in each subtree loads the right guide.

**Rollback.** Every phase is its own commit or small series. Layer 0 is four
three-line files plus `git mv`s. Rules and skills are additive — deleting the
file removes the behaviour. Hooks are one settings block. The graph is one
script plus a `prebuild` entry. **Nothing here rewrites existing source.**

---

## 12. Open questions for the operator

Not blocking — Phase A can start without any of these answered.

1. **Hook aggressiveness.** Should `guard-git.mjs` block `git commit` too, or
   only `push` and the destructive commands? AGENTS.md says Claude commits and
   you push, so committing stays allowed — **confirm that is still right.**
2. **`docs/generated/` — committed or ignored?** Recommend **committed**: it is
   readable in a diff, on GitHub, and by an agent with no build step, and
   `--check` keeps it honest. Cost is diff noise on every build.
3. **`STATE-OF-PLAY.md` §2 replacement.** Confirm the generated block replaces
   the whole "Repo state right now" table, and that §3 ("what this box can and
   cannot do") stays authored — it is judgement, not measurement.
4. **Does `typescript-lsp` install cleanly here?** Needs the TS language server
   binary and GitHub network access. If it fails, B3 drops with no other impact.
5. **Phase E timing** — straight after D, or parked until the revamp's Phase 3
   waves are further along?
6. **This file's own fate.** Recommend: on approval, fold
   `CONTEXT-ARCHITECTURE.md` into this file as an appendix and archive it, so
   there is one context document, consistent with CD-10.

---

## 13. The hybrid question — v1.1 review verdict

> Written by a second review pass (Fable 5, max effort) explicitly charged with
> answering: *is a file-based memory system right for Parallax, or do we need a
> hybrid?* Method: re-read the full session and both context docs, verify the
> plan's load-bearing technical claims against the official subagent and hooks
> documentation, and score every hybrid candidate against the repo's real
> constraints rather than its marketing.

### 13.1 Verdict

**The file-based core stands — deliberately, not by default.** The plan is the
right way forward, with the CD-02 correction and the CD-11/CD-12 additions this
pass produced. The reasoning that survives stress:

1. **Parallax's knowledge is ID-structured, and fuzzy retrieval degrades
   structure.** The canon works because RD-01 is *cited*, exactly, in 38 files.
   A vector store returns "probably relevant" chunks; this repo's whole
   discipline is built on "exactly this ruling, by ID." Grep + the generated
   graph preserve citation precision; embeddings blur it. For a corpus of 645k
   *well-organised* tokens, precision beats recall.
2. **Files are the only store that survives every boundary this project
   actually crosses** — sessions, machines, agent tooling (Claude Code, the
   API-CLI pipeline, any future runner), git accounts, and operator review.
   Everything in this plan is `git diff`-able and PR-reviewable. No database is.
3. **Zero new runtime on a box with a fragile environment.** The state docs
   themselves disagree about what env exists here (§13.3). A memory layer must
   not depend on services whose availability is itself uncertain.
4. **The failure modes of files — staleness and contradiction — are exactly
   what Layers 2–3 gate away**, by making derivable facts generated and gated,
   and volatile facts ephemeral (CD-11). A hybrid would add new failure modes
   (index drift, sync lag, service outage) while the file failure modes are
   already being engineered out.

### 13.2 What the review found wrong or missing in v1

- **CD-02 was a false binary — a real flaw.** v1 split facts into *derivable*
  and *judged*. But "migration applied", "live smoke verified", "deployed on
  Vercel" are neither: no script on this box can compute them, and they are not
  judgement — they are **attestations about the world outside the repo**, which
  only the operator can make. v1's `--state-block` would have tried to generate
  some of them, or worse, committed volatile git facts ("unpushed: 3") into a
  tracked file — **recreating the exact staleness disease at machine speed**.
  Fixed: CD-02 is now a three-way split, CD-11 pins volatile facts to ephemeral
  surfaces only, and D1/D2 are rewritten accordingly.
- **Two native capabilities v1 missed**, both verified against the subagent
  docs and both now in CD-12: **subagent persistent memory** (`memory: project`,
  version-controlled — and the repo already hand-rolled this pattern as
  `_voice-social-learned.md`, proving the need is real) and **skill preloading**
  (`skills:` frontmatter — subagents get the CLAUDE.md hierarchy automatically
  but *never* auto-load skills, so the wave protocol must preload conventions
  explicitly or its component agents work without them).
- **An episodic gap, closed for free.** STATE-OF-PLAY records *state*; auto
  memory records *durable facts*; neither records *"what did we try and why did
  we abandon it."* That lives in `PROJECT.md` (curated) and session transcripts
  (raw). Where the tooling offers transcript search, `catch-up` now points at
  it. No new store — the episodic layer already exists, it just was not named.

### 13.3 A live specimen, found during this review

`STATE-OF-PLAY.md` §3 states this box has *"no `.env.local`"*. **A root
`.env.local` exists on disk** (the pipeline's API key per `AGENTS.md` §2; the
app's is the one genuinely absent). A doc asserting an environment fact,
contradicted by the filesystem, discovered *while reviewing the plan about doc
drift* — the disease demonstrating itself in the middle of its own diagnosis.
Under CD-02 this fact is **attested** class: the fix is not generation but
precision — §3 should say *which* env is absent, dated. Queued for Phase A2's
corrections commit.

### 13.4 Hybrid candidates, scored against real constraints

| Candidate | Verdict | Deciding constraint |
|---|---|---|
| **Doc-RAG** — extend `parallax_rag` (pgvector + Voyage) over `docs/` | **Rejected** | Fuzzy recall vs. ID-precision (13.1.1); embedding refresh on every doc churn; env-dependent infra for a need grep already meets. The editorial RAG stays exactly where it belongs — *sources*, where fuzzy recall over a large corpus is the right tool. |
| **Graph DB / Graphiti temporal KG** | **Rejected** (reaffirms CD-01) | Neo4j/FalkorDB + API keys + a sync daemon, to hold edges a 350-line deterministic script derives from ground truth with a build-time guarantee no external DB can give. |
| **Graphify** | **Rejected** (reaffirms CD-01) | Full case in `CONTEXT-ARCHITECTURE.md` §1. Nothing in this review weakened it; the subagent findings strengthened the native path it competes with. |
| **agentmemory / mem0 / cognee** | **Rejected** | Native auto memory + the new CD-12 subagent memory cover the niche, first-party, with version control. |
| **Transcript search** (episodic) | **Adopted** — CD-12 | Already exists where offered; zero build. |
| **Subagent memory + preloading** | **Adopted** — CD-12 | Native, committed, formalises a proven hand-rolled pattern. |
| **Obsidian view** | Stays **optional** (D5) | Human-facing lens on the same generated graph; try the plain vault first. |
| **Graph MCP server** | Stays **deferred** | A file read needs no runtime. Revisit only if query patterns outgrow it. |

**Net: the answer to "file-based, hybrid, or something else?" is: file-based
core, already hybrid in the two places hybridity earns its keep** — the
editorial RAG for sources (fuzzy recall over big corpora, its home ground) and
ephemeral computed state for volatile facts (CD-11). Adding a third store for
project knowledge would spend reliability to buy a capability grep, the graph,
and citations already deliver.

### 13.5 What would change this verdict

Honest tripwires, so a future review knows when to reopen:

- **The docs corpus stops fitting the toolbox** — if `docs/` grows several-fold
  and grep + graph queries demonstrably fail to surface known content, doc-RAG
  re-enters (the infra is already in-repo).
- **The team stops being one operator on one box** — multi-writer concurrent
  memory is where file-based systems genuinely strain and where
  Graphiti-class tools earn their complexity.
- **Graphify ships 1.0 with the doc↔code node-merge bug closed** — re-evaluate
  as a *supplement* for exploratory navigation, never as the system of record.

---

## 14. The B4 trim — the one outstanding step

Everything else is built. This is what remains, written so it can be picked up
cold.

**Why it was not done during the build.** CD-03 requires that a rule be
*observed firing* before its AGENTS.md copy is deleted. Observation needs a
fresh session — the building session cannot restart itself, and deleting on
the assumption that a glob works is exactly the failure CD-03 exists to
prevent. The A1 correction proved the point: the plan's own `src/content/issues/`
shim broke the build, and only building revealed it.

**The procedure, per section:**

1. Open a file matching the rule's `paths:` glob.
2. Run `/context`. Confirm the rule appears under the loaded instruction files.
   (Optionally register an `InstructionsLoaded` hook to log
   `load_reason: "path_glob_match"` with the file path.)
3. Only then delete the duplicated content from `AGENTS.md` — **its own commit**,
   citing CD-03 and naming what was observed.
4. If the rule does **not** appear: fix the glob and retry once. If it still
   does not, **the content stays in AGENTS.md** and the rule is deleted. Record
   the failure in the AGENTS.md change log.

**What may move** (the rules already exist and carry the content):

| AGENTS.md section | Rule that now covers it |
|---|---|
| §3 topics/fonts table | `.claude/rules/design-tokens.md` |
| §7 token + SVG visual rules | `.claude/rules/design-tokens.md` |
| §2 WebGL detail | `.claude/rules/viz3d.md` |
| §2 commands + cost table | `.claude/rules/pipeline-scripts.md` |
| §5 pipeline detail, §6 voice detail | `.claude/rules/editorial-voice.md`, `pipeline-scripts.md` |
| §7 schema rules | `.claude/rules/issue-authoring.md` |
| §8 verification checklist | `/verify-done` skill |

**What must NOT move (CD-04):** §1 identity, §4 the layout map, §7 hard rules
(git discipline, no-hardcoded-names, the brand/legal naming split), the
standing greps, and §10's most recent change-log entries.

**Expected result:** 866 → ~250 lines, ~13.9k → ~4k resident. **~250 is a
target, not a promise.** A rule that will not fire reliably goes back into
AGENTS.md and the file stays bigger. Correctness outranks the line count.

---

## 15. Change log

- **2026-09-01 — v1.2. BUILT.** Phases A–E executed and committed (`d6489cb`,
  `06097ab`, `a8b70ae`, `0c9283b`, `ad5a17d`). Five corrections the build
  forced on the plan, all found by verifying rather than assuming:
  **(1)** A1's `src/content/issues/CLAUDE.md` shim **breaks the build** —
  Astro parses it as a collection entry, and `src/content/CLAUDE.md` fails too.
  The plan reproduced the exact mistake `_AGENTS.md`'s underscore documents.
  That subtree uses a path-scoped rule instead.
  **(2)** B1's `svg-and-components` and `app-ssr` rules were dropped as
  redundant — Phase A's shims already deliver those guides.
  **(3)** Hook tests caught two real bugs pre-wiring: `git -C . push` evaded
  the matcher, and branch names containing `/` were falsely blocked.
  **(4)** The graph counted narrative kinds as registry gaps, contradicting a
  green `check:catalog`.
  **(5)** The generated state block was hand-written from memory and wrong in
  two values — CD-09's failure mode, demonstrated on the block documenting it.
  First real finding from the graph: **77 of 97 kinds have never appeared in a
  published issue** (REVAMP-PLAN asserted "70 of 90"), independently verified.
  Outstanding: the B4 trim (§14).
- **2026-09-01 — v1.1 DRAFT.** Self-review pass (Fable 5, max effort) on the
  hybrid question. CD-02 corrected from a two-way to a three-way fact split
  (derived / attested / judged) after finding v1 would have committed volatile
  git facts into tracked files — the staleness disease at machine speed. Added
  CD-11 (volatility split, deterministic generated output) and CD-12 (subagent
  `memory: project` + skill preloading + transcript-search episodic layer),
  both verified against the official subagent docs. D1/D2/E amended; hybrid
  candidates scored and verdict recorded (§13); a live doc-drift specimen found
  in STATE-OF-PLAY §3's env claim (§13.3), queued for Phase A2.
- **2026-09-01 — v1 DRAFT.** Written after a research pass on graph-based agent
  context (Graphify verified real at ★112,961 and rejected on fit — reasons in
  `CONTEXT-ARCHITECTURE.md` §1) and a full codebase exploration. Six measured
  findings, of which two are live defects: subtree `AGENTS.md` files never load
  (~37k tokens unreachable, contradicting `CLAUDE.md:34`), and three docs
  compete as entry point with two stale. Ten decisions locked as CD-01…CD-10
  after operator ruling on four questions: staged-and-verified AGENTS.md trim;
  auto-write derived / propose prose; both code and editorial scope with code
  first; stale docs archived not deleted. Five phases, ~7 days. **Nothing built.**
