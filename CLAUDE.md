# Parallax — Claude Code memory

> This file is auto-loaded by Claude Code at session start. The full agent
> guide lives in `AGENTS.md` (portable across agent tooling). This file is
> only for Claude-Code-specific notes that don't belong in the universal
> guide.

@./AGENTS.md

---

## Claude Code specifics

- **Slash commands are wrappers (2026-09-28):** `/pipeline-discover`,
  `/pipeline-research`, `/pipeline-check`, `/pipeline-storyboard`,
  `/pipeline-draft`, `/pipeline-panel`, `/pipeline-stylist`,
  `/pipeline-verify`. Each runs its phase's npm script with
  `--bill subscription` in the background and reports the footer, nothing
  else. It spawns no agent, and it carries `disable-model-invocation`, so
  only the operator starts one.

  **Two doors, one pipeline (ruled 2026-09-28).** The API door is a terminal:
  `npm run pipeline:<phase> <desk> -- <flags>` bills `ANTHROPIC_API_KEY`. The
  Claude Code door is the slash command: `/pipeline-<phase> <desk> <flags>`
  runs `npm run pipeline:<phase> <desk> -- --bill subscription <flags>` and
  bills your Claude subscription. Same script, same agents, same
  `scripts/pipeline.config.ts`: the door decides only which wallet pays, and
  the ledger row's `billedTo` says which.
- **Agent definitions** live in `.claude/agents/<name>.md` (discovery,
  researcher, dossier-check, composer, drafter, reader-panel, stylist,
  verifier). The runner loads them under the harness diet. Claude Code also
  lists them as subagent types, but spawning one with the Agent tool is the
  retired route: this file and every tool come along, and the check pass,
  Jev and the ledger do not. When the operator asks you for a phase, run its
  npm script with `--bill subscription` (the Claude Code door) unless they
  name the key, and run it in the background: a phase can outlast a
  foreground call.
- **One config, two wallets (the operator's ruling of 2026-09-28).**
  `scripts/pipeline.config.ts` (models, effort, budgets) rules every run on
  both doors. The old rule that the Claude Code route runs every phase on
  Opus is retired, so add no model override on this door unless the operator
  asks for a `--model` run. The storyboard gate (`GATES.storyboard`) is the
  script's, so it holds on both doors.
- **Working directory** for all pipeline operations: `D:\SideProjects\parallax`
  (Windows). PowerShell does not chain commands with `&&`; use `;` or
  `; if ($?) { ... }`.

## Subtree memory

**Claude Code reads `CLAUDE.md`, not `AGENTS.md`.** Subdirectory discovery
covers `CLAUDE.md` / `CLAUDE.local.md` only — there is no cascading AGENTS.md
read. This file's `@AGENTS.md` import is the only reason the root guide loads.

Each subtree therefore carries a three-line `CLAUDE.md` shim that imports its
guide; the guide stays in `AGENTS.md` so other agent tooling still finds it.
The shim loads on demand when Claude reads a file in that tree.

| Guide | Reached via |
|---|---|
| `src/components/AGENTS.md` — section-kind → component map, SVG conventions, how to add a component | `src/components/CLAUDE.md` |
| `docs/APP-SURFACES.md` — the reader-account surfaces (no shim: one project since the merge, so it is read on request, not by path) | — |
| `research/AGENTS.md` — editorial pipeline, voice system, dossier flow | `research/CLAUDE.md` |
| `src/content/issues/_AGENTS.md` — issue schema, primer rules, build-error catalog | **`.claude/rules/issue-authoring.md`** (see below) |

**The issues subtree is the exception, and it is load-bearing.** It cannot host
a shim: the collection is `type: 'content'`, so Astro parses every `.md` at the
root of `src/content/issues/` as an entry, and any `.md` directly in
`src/content/` belongs to no collection. Both break the build — verified
2026-09-01. That is the same trap the guide's leading underscore dodges. A
path-scoped rule sits outside `src/`, so Astro never sees it.

> Corrected 2026-09-01. This section previously claimed subtree `AGENTS.md`
> files were "picked up via the agents.md cascading-read convention." That was
> never true, and it cost every prior session ~37k tokens of unreachable
> convention — an agent editing a component did so without the component rules.
> See `docs/CONTEXT-PLAN.md` §2.1.
