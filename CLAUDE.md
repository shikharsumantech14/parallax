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

Subdirectory `AGENTS.md` files are picked up when working in their tree
(via the agents.md cascading-read convention):

- `src/content/issues/_AGENTS.md` — issue schema, primer rules,
  build-error catalog. (Underscored because Astro's content collection
  would otherwise treat it as an issue entry and fail validation.)
- `src/components/AGENTS.md` — section-kind → component map, SVG
  conventions, how to add a new component.
- `research/AGENTS.md` — editorial pipeline, voice system, dossier flow.
