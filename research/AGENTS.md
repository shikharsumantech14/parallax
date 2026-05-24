# Research — agent guide

> Local rules for `research/`. This is the editorial pipeline's working
> space. Read the root `AGENTS.md` first for project-level context.

---

## 1. What lives here

```
research/
├── README.md                       ← long-form operator guide
├── AGENTS.md                       ← this file
├── notebooklm-setup.md             ← per-category NotebookLM desk setup
├── _sources/                       ← per-category trusted-source allowlists
│   ├── README.md
│   ├── politics.md
│   ├── space.md
│   ├── earth.md
│   ├── tech.md
│   ├── travel.md
│   └── sports.md
├── _templates/                     ← shapes that pipeline outputs follow
│   ├── candidate.md                ← candidate list shape (one block per topic candidate)
│   └── dossier.md                  ← researcher output shape
├── _voice/
│   ├── mode-library.md             ← 8 rhetorical modes + AI-tell catalog
│   └── visual-mode-library.md      ← 6 visual modes + visual AI-tell catalog
├── _visual/
│   └── ledger.jsonl                ← fal.ai spend ledger (daily $2.00 cap)
└── <topic>/                        ← per-topic working folder
    ├── YYYY-MM-DD-candidates.md            ← discovery output (Phase 1)
    ├── YYYY-MM-DD-<slug>-dossier.md        ← researcher output (Phase 2)
    └── YYYY-MM-DD-<slug>-verification.md   ← verifier output (Phase 4)
```

---

## 2. The pipeline (phases 1–4)

```
1. /pipeline-discover <cat>     → research/<cat>/<date>-candidates.md
2. YOU PICK 1                    ← change one candidate's status: open → chosen
3. /pipeline-research <cat>     → research/<cat>/<date>-<slug>-dossier.md
4. YOU REVIEW DOSSIER            ← check [UNVERIFIED], approve
5. /pipeline-draft <cat>        → src/content/issues/<slug>/index.mdx (status: draft)
6. YOU REVIEW DRAFT              ← fix voice/flow, resolve EDITOR comments
7. (CLI only) npm run pipeline:stylist <cat>      → rhetorical-mode rewrites
8. (CLI only) npm run pipeline:illustrator <cat>  → OG cover image via fal.ai
9. /pipeline-verify <cat>       → research/<cat>/<date>-<slug>-verification.md
10. YOU AUDIT + PUBLISH          ← read report, fix, flip status, commit
```

Two paths run the same agents:

- **Slash commands** (`/pipeline-*`) inside Claude Code — bills to Pro budget.
- **API CLI** (`npm run pipeline:*`) — bills to `ANTHROPIC_API_KEY` from
  `.env.local`. See `scripts/README.md` for setup. **The stylist phase is
  CLI-only** (no slash command equivalent today).

---

## 3. Source allowlists (`_sources/<category>.md`)

Each file lists the URLs / domains a discovery + research agent is
**allowed** to mine from. The agents must not pull facts from anywhere
else; if they need to, the citation gets flagged `[UNVERIFIED]` for human
review.

When adding a new source:

1. Confirm it's a primary, secondary, or analysis source (not just opinion).
2. Add the domain *and* representative URLs.
3. If it's a paywalled / metered source, note that — the researcher will
   need to fetch within metered limits.
4. Append, don't reorder. The agents read top-to-bottom for "what to
   prioritise."

---

## 4. Candidate file shape (Phase 1 output)

Discovery writes `research/<cat>/<date>-candidates.md` with 5–10 blocks,
each one a candidate Parallax issue. Each block has:

```markdown
## C-NN · <Title>

- **status:** open                ← human flips one of these to `chosen`
- **why now:** <event + date that makes this timely>
- **angle:** <the structural Parallax framing — what makes this an issue,
              not just a news story>
- **suggested kinds:** hero, timeline, ...
- **est. read time:** N min
- **sources:**
  - URL 1
  - URL 2
- **notes:** <gotchas, paywalled sources, contested claims to verify>
```

Exactly one candidate's `status:` must be `chosen` before
`/pipeline-research` will proceed. More than one chosen → research errors.

---

## 5. Dossier shape (Phase 2 output, template at `_templates/dossier.md`)

Dossier sections (researchers must produce all):

1. **Status header:** `Status: ready-for-draft` (or `Status: needs-research`
   if blocking unknowns remain).
2. **Topic + slug + date.**
3. **Structural argument** (one sentence — the thesis the issue makes).
4. **Verified facts** (every number, name, date, with primary-source
   citations from the allowlist).
5. **Key quotes** (verbatim, with attribution + source URL).
6. **[UNVERIFIED] items** — anything the researcher couldn't lock down.
   These must be either resolved or dropped before the draft phase.
7. **Suggested issue structure** — ordered list of section kinds with what
   each covers. Drafter uses this as the section skeleton.
8. **Sources** (with `kind: primary | secondary | analysis` and full URLs).

`Status: ready-for-draft` is the gate. The drafter won't run on a dossier
without it.

---

## 6. Verification report shape (Phase 4 output)

Verifier writes a verdict: `PASS`, `NEEDS REVISION`, or `REJECT`.

For each claim in the draft, the report lists:
- **Claim** (verbatim from the draft)
- **Dossier source** (which dossier line backs it)
- **Verdict** (verified / unverified / contradicted)
- **Recommended fix** (if needed)

The verifier also checks for AI-tell violations per the mode library's
voice rules (em-dash overload, binary reframes, triple-fragment closers,
etc.).

**`NEEDS REVISION` is the most common verdict.** Apply the fixes directly
to the draft (or re-run a phase), then re-verify or proceed at your
discretion.

---

## 7a. Visual canon (`_voice/visual-mode-library.md`)

Parallel reference for cover imagery, read by the **illustrator** agent.
Six visual modes (AERIAL DIAGRAM, SINGLE OBJECT STILL, ARCHIVAL DOCUMENT,
TYPOGRAPHIC GRID, MONOCHROME PORTRAIT, GEOMETRIC ABSTRACTION) with a
Decision Tree, brand-wide constants (no faces, no hands, no text in
image, muted palette, topic-aware accents), an 8-item visual AI-tell
catalog, and Quick-Reference Prompt Cards for runtime use.

Image generation is metered by `scripts/generate-visual.mjs` which
enforces a **daily $2.00 cap** via the ledger at
`research/_visual/ledger.jsonl`. One image per script invocation; the
illustrator agent calls the script exactly once per run.

## 7b. Voice canon (`_voice/mode-library.md`)

964 lines. Read fully when first onboarding to the project. Contains:

- **Eight modes** — AWE, CONVERSATIONAL EXPLAINER, CALM-STRUCTURAL,
  SATIRICAL EXPOSURE, DRY WIT, INVESTIGATION, FORENSIC, LYRICAL COMPRESSION.
- **Per-mode pattern card** — sentence rhythm, opening templates, lexical
  defaults, pronoun policy, failure modes.
- **Decision Tree** — how the stylist agent picks one mode per section.
- **Mode Allocation Table** — defaults per section slot (hook, mechanism,
  closer, etc.).
- **Mode-blending rules** — hard limits (1 SATIRICAL, 2 LYRICAL paragraphs,
  4–6 modes per issue, one dominant mode per section).
- **Voice rules — what to avoid** — the AI-tell catalog (em-dash overload,
  binary reframe, triple-fragment closer, abstract-noun jargon, numbered
  manifesto, stacked reframes). The drafter and stylist both check
  against this list.
- **Quick-Reference Pattern Cards** at the bottom — runtime recipes.

The stylist agent (`.claude/agents/stylist.md`) reads this file every
time it runs. The drafter keeps it open while writing.

When updating the mode library: bump the `Last updated` date at the top
and add an entry to its own change log section (it has one).

---

## 8. NotebookLM upstream desk

`research/notebooklm-setup.md` documents a per-category NotebookLM
notebook (one per topic, seeded from the same allowlists). This is the
editor's judgment layer — where you decide what's worth writing — and
sits parallel to `/pipeline-discover` (which is the agent equivalent).

Both paths write candidates into the same
`research/<cat>/<date>-candidates.md` file. The editor can populate it
manually from NotebookLM or have the discovery agent fill it.

---

## 9. Topic cadence target

From `research/README.md`:

| Category | Cadence | Why |
|---|---|---|
| Politics | weekly | hot news cycle |
| Earth | weekly | climate constant story |
| Tech | bi-weekly | model/release pacing |
| Space | bi-weekly | mission pacing |
| Sports | bi-weekly to monthly | match cycles |
| Travel | monthly | pieces don't expire, allow craft time |

Average ~3.5 issues/week. Sustainable for solo + audit-quality.

---

## 10. Cost discipline

From `scripts/README.md` (May 2026 rates), full per-issue API spend:

| Phase | Approx |
|---|---|
| Discover (Sonnet) | $0.30–0.80 |
| Research (Sonnet) | $0.80–2.00 |
| Draft (Opus) | $3.00–7.50 |
| Stylist (Opus) | $1.50–2.50 |
| Illustrator (Opus + fal.ai Flux) | $0.50–1.00 + $0.04 |
| Verify (Sonnet) | $0.40–1.00 |
| **Per issue** | **$6.50–14.80** |

Discovery and verify are cheap — re-run freely if results look off. Draft
and stylist are expensive — review the dossier carefully before
triggering draft, and review the draft carefully before triggering
stylist.

---

## 11. Files to never edit directly during a pipeline run

While the agents are mid-run, **do not edit**:
- The candidates file (mid-discovery)
- The dossier file (mid-research)
- The draft MDX (mid-draft or mid-stylist)
- The verification report (mid-verify)

The agents read these files multiple times during execution. Concurrent
edits cause silent inconsistencies in the output. If you need to change
something, kill the agent first, then edit, then re-run.

---

## Change log

### 2026-05-20 — File created
Initial version. Captures pipeline phases, file shapes (candidate /
dossier / verification), source-allowlist convention, mode-library
pointer, cost table.
