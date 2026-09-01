# Parallax — Claude Code memory

> This file is auto-loaded by Claude Code at session start. The full agent
> guide lives in `AGENTS.md` (portable across agent tooling). This file is
> only for Claude-Code-specific notes that don't belong in the universal
> guide.

@./AGENTS.md

---

## Claude Code specifics

- **Slash commands available:** `/pipeline-discover`, `/pipeline-research`,
  `/pipeline-draft`, `/pipeline-verify`. The stylist phase is API-CLI only
  (`npm run pipeline:stylist <category>`).
- **Agent definitions** live in `.claude/agents/<name>.md` (discovery,
  researcher, drafter, stylist, verifier). Spawning an agent in Claude
  Code routes the cost through the Claude Pro/Max budget. To bill the API key
  instead, use the `npm run pipeline:<phase>` scripts.
- **Model policy by route — do NOT "optimise" this back to the cheap split.**
  The `scripts/pipeline.config.ts` Sonnet/Opus split (discovery/researcher/
  verifier → Sonnet, drafter/stylist → Opus) applies **only to the API-CLI
  route**. When running the pipeline **from Claude Code** (subscription budget),
  pin **every** phase — discovery, researcher, drafter, stylist, verifier — to
  **Opus (max tier)** via the Agent `model: 'opus'` override. The subscription
  absorbs the cost, so use the best model for all phases — never drop to Sonnet
  on the Claude Code route. Leave `pipeline.config.ts` unchanged (it's the
  API-route config the operator uses).
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
| `app/AGENTS.md` — the SSR reader-account project | `app/CLAUDE.md` |
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
