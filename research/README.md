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

Each step is an isolated Claude Code subagent under `.claude/agents/`,
invoked via a slash command under `.claude/commands/`. The pipeline can
be driven manually one step at a time or strung together (Phase 4+).

## Current pipeline status

| Step | Built | How to invoke | Notes |
|---|---|---|---|
| 1. Discovery | ✅ Phase 1 | `/pipeline-discover <category>` | This phase |
| 2. Pick | manual | edit candidates file | 5 min/week |
| 3. Research | ⏳ Phase 2 | `/pipeline-research <slug>` | Next |
| 4. Draft | ⏳ Phase 2 | `/pipeline-draft <slug>` | Next |
| 5. Verify | ⏳ Phase 3 | `/pipeline-verify <slug>` | Brand-protection step |
| 6. Visual | ⏳ Phase 4 | `/pipeline-visuals <slug>` | After verify works |
| 7. Audit | manual | read draft + report, fix, publish | Always manual |

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
