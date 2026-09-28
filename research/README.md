# Parallax — Editorial Pipeline

This folder is the working space for the Parallax editorial pipeline:
the agent-assisted workflow that takes a category, surfaces candidate
issue topics, builds research dossiers, drafts MDX, and verifies every
claim before manual audit + publish.

## Folder layout

```
research/
├── README.md                                    ← you are here
├── _sources/                                    ← per-category trusted-source allowlists
│   ├── README.md
│   ├── politics.md
│   ├── space.md
│   ├── earth.md
│   ├── tech.md
│   ├── travel.md
│   └── sports.md
├── _templates/                                  ← shapes that pipeline outputs follow
│   └── candidate.md
└── <topic>/                                     ← per-topic working folder
    ├── YYYY-MM-DD-candidates.md                 ← discovery agent output (Phase 1)
    ├── YYYY-MM-DD-<slug>-dossier.md             ← researcher output (Phase 2)
    └── YYYY-MM-DD-<slug>-verification.md        ← verifier output (Phase 3)
```

## The pipeline (target state)

```
1. DISCOVERY        per category, weekly       → candidates list
   ↓
2. YOU PICK 1       manual gate (5 min)        → chosen candidate
   ↓
3. RESEARCH         dossier-builder            → structured research notes
   ↓
4. DRAFT            MDX writer                 → src/content/issues/<slug>/index.mdx
                                                 (status: draft)
   ↓
5. VERIFY           ★ fact-checker ★           → claim-by-claim audit report
   ↓
6. VISUAL CHECK     component-need detector    → suggestions, you build if needed
   ↓
7. YOU AUDIT        manual review (~30 min)    → status: published, git commit
```

Each step is an agent definition under `scripts/agents/`, run by
`scripts/pipeline.ts` through the Claude Agent SDK from either door. It is
not a Claude Code subagent. A slash command under `.claude/commands/`
starts a step from Claude Code, and the same npm script starts it from a
terminal. The pipeline can be driven manually one step at a time or strung
together (Phase 4+).

## Current pipeline status

| Step | Phase | How to invoke | Notes |
|---|---|---|---|
| 1. Discovery | 1 | `/pipeline-discover <category>` | Runs `npm run pipeline:discover <category> -- --bill subscription` |
| 2. Research | 2 | `/pipeline-research <category>` | Runs `npm run pipeline:research <category> -- --bill subscription` |
| 3. Check | 2.2 | `/pipeline-check <category>` | Runs `npm run pipeline:check <category> -- --bill subscription` |
| 4. Storyboard | 2.5 | `/pipeline-storyboard <category>` | Runs `npm run pipeline:storyboard <category> -- --bill subscription`. You approve the storyboard |
| 5. Draft | 3 | `/pipeline-draft <category>` | Runs `npm run pipeline:draft <category> -- --bill subscription` |
| 6. Panel | 3.2 / 3.7 | `/pipeline-panel <category>` | Runs `npm run pipeline:panel <category> -- --bill subscription`. Runs after the draft and again after the stylist |
| 7. Stylist | 3.5 | `/pipeline-stylist <category>` | Runs `npm run pipeline:stylist <category> -- --bill subscription` |
| 8. Verify | 4 | `/pipeline-verify <category>` | Runs `npm run pipeline:verify <category> -- --bill subscription` |

Every slash command above runs on the Claude Code door and bills the
operator's Claude subscription. The terminal door runs the same npm script
directly, without `--bill subscription`, and bills `ANTHROPIC_API_KEY`
instead. Full flag table and setup: `scripts/README.md`.

## Cadence target

| Category | Cadence | Notes |
|---|---|---|
| Politics | weekly | hot news cycle |
| Earth | weekly | climate constant story |
| Tech | bi-weekly | model/release pacing |
| Space | bi-weekly | mission pacing |
| Travel | monthly | pieces don't expire, allow craft time |
| Sports | bi-weekly to monthly | match cycles |

Average ~3.5 issues/week. Sustainable for solo + audit-quality.

## Cost-aware model routing

| Step | Model | Why |
|---|---|---|
| Discovery | Claude Sonnet (Pro plan) or Gemini 2.5 Pro (free) | Topic-finding doesn't need top-tier |
| Research | Claude Sonnet | Multi-source synthesis |
| Draft | Claude Sonnet | High-craft, voice-consistent |
| Verify (1st pass) | Cheap model (DeepSeek / Haiku) | Bulk claim-checking |
| Verify (escalation) | Claude Sonnet | Only flagged claims |
| Visual check | Claude Sonnet | Architectural understanding |

## Status board

Current in-flight candidates / drafts:

(Empty — first pipeline run pending)
