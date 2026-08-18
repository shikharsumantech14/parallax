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
│   └── mode-library.md             ← 8 rhetorical modes + AI-tell catalog
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
8. /pipeline-verify <cat>       → research/<cat>/<date>-<slug>-verification.md
9. YOU AUDIT + PUBLISH          ← read report, fix, flip status, commit
```

> **Component palette.** The publication ships **~90 section kinds** — the
> editorial kinds plus a deep physics / data / geography-grounded interactive +
> 3D library (each world's flagships and its breadth: WebGL globes, CSS-3D
> cards, animated SVG). The canonical catalog is **`docs/design/catalog.md`**:
> one `## <kind>` block per kind giving **USE WHEN**, **DON'T USE** (with the
> right alternative), the exact **DATA** shape, the **PLAIN** one-liner, and —
> on the data-hungry kinds — a **RESEARCHER MUST CAPTURE** note.
> `npm run check:catalog` verifies that the catalog and `SECTION_KINDS` in
> `src/content/config.ts` stay 1:1 and in the same order (90 ↔ 90 today).
> It is a manual check — `npm run build` does not run it.
> The drafter chooses kinds that fit the data; discovery should suggest them.
> The six `2026-06-03-<world>-showcase` **draft** issues exercise the library
> with real data — the canonical worked examples.
> `src/content/issues/_AGENTS.md` §11 still documents the 2026-06-03
> 3D/interactive set and its authoring shapes, but the catalog is what the
> agents read. See §12 for how each agent uses it.

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

**A dossier must now carry the data its components need.** For every
interactive / 3D / data component the structure proposes, the researcher opens
that kind's `## <kind>` block in `docs/design/catalog.md`, reads its **DATA**
shape and its **RESEARCHER MUST CAPTURE** note, and captures that data for
real, from a named source — best-track fixes (lat/lon + wind per timestamp) for
`storm-track`, Euler poles for `plate-motion`, the dated count series for
`moore-ladder`, the two orbital radii plus the central-body μ for
`transfer-window`. Coordinates, ratings and physical values are facts like any
other; the drafter is forbidden from inventing them, and the verifier traces
them. A component whose primary data cannot be sourced is not a component this
issue can use: say so in the dossier and propose a simpler kind the evidence
does support.

The template at `_templates/dossier.md` has **not** been given a dedicated slot
for this yet — its §7 table is still `kind / eyebrow / what it covers`. Until it
grows one, put the captured component data under §4 (Key facts & data) with its
citation and point at it from the §7 row.

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
etc.), plus two component checks added by the P8 wiring (§12):

- **Component `data` values are claims.** The numbers a viz renders — satellite
  counts, orbital elements, Euler poles, ratings, xG values, transistor counts,
  lat/lon, measured physical quantities — trace to the dossier exactly like body
  text does.
- **⚠️ PLAIN-CLAIM.** A section's `plain` line must describe the FORM of the
  graphic, never assert the data. A `plain` that states a finding ("Leicester
  won") is flagged; the data belongs in the caption.

**`NEEDS REVISION` is the most common verdict.** Apply the fixes directly
to the draft (or re-run a phase), then re-verify or proceed at your
discretion.

---

## 7. Voice canon (`_voice/mode-library.md`)

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
| Verify (Sonnet) | $0.40–1.00 |
| **Per issue** | **$6.00–13.80** |

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

## 12. Component-aware agents (P8 wiring)

The four agent prompts in `.claude/agents/` were rewired so the component
catalog — not the model's memory of an older, smaller library — drives which
visual a section gets. These are prompts, not code, so there is no build impact.
Uncommitted at the time of writing, like the rest of the 2026-07-14 work.

- **`researcher.md`** — Step 5 (propose the issue structure) now ends with
  "Capture the DATA each component needs": open the proposed kind's catalog
  block, read its **DATA** shape and **RESEARCHER MUST CAPTURE** note, capture
  that real sourced data, and where it can't be sourced, say so and suggest a
  simpler kind the evidence supports. Never leave the drafter to guess a
  coordinate, rating or physical value. See §5.
- **`drafter.md`** — Step 2.4 is now "The component catalog (pick the right
  form)", pointing at `docs/design/catalog.md` as the single source of truth for
  choosing *and* shaping a component: pick by what the data genuinely is, never
  by what looks impressive. This replaced a stale inline list of 30 kinds. The
  drafter also authors three per-section fields it previously didn't:
  `plain` (the FORM of the graphic, ≤ 220 chars — the Zod cap; omit it when the
  per-kind default in `src/lib/explainers.ts` already fits, and narrative kinds
  take none), `skimCaption` (the one thing the section proves), and `layout`
  (`default` unless there's a reason — `wide`, `split` for the issue's single
  hero metaphor, `bleed` at most once per act, `breath`). It works to the
  `docs/design/CANON.md` §3 rhythm — one hero visual, no more than ~3 loud
  sections, acts separated by `act-break`, every act carrying a quiet section —
  and its end-of-run self-check covers all of it.
- **`stylist.md`** — new **Step 4.6, structure + plain-layer audit**. As the last
  editorial pass before the verifier it checks the issue against the CANON §3
  structure rules and the plain-layer contract, reporting under a "Structure
  flags" heading. It *flags* rather than fixes (it does not restructure the issue
  or change section kinds); the one thing it may rewrite is a `plain` line, since
  that wording is prose within its remit.
- **`verifier.md`** — Step 2 now extracts component `data` values as claims to
  trace, and audits `plain` lines, flagging **⚠️ PLAIN-CLAIM** where one asserts
  data instead of describing form. See §6.

**Not yet demonstrated.** The P8 retrofit — pulling the new components into two
already-published issues, plus one fresh `pipeline:draft` run to prove
catalog-driven selection works end to end — has **not been run**. It touches live
content and bills a full draft phase, so it's an editorial call. Until it
happens, the wiring above is verified by reading the prompts, not by output.

---

## Change log

### 2026-07-14 — P8: the agents read the component catalog

Rewired all four agent prompts in `.claude/agents/` around
`docs/design/catalog.md`, now ~90 kinds after the P6 breadth build (22 new
components across the six worlds). The drafter's stale inline "30 kinds" list is
gone — it reads the catalog and authors `plain` / `skimCaption` / `layout` per
section to the CANON §3 rhythm. The stylist gained Step 4.6 (structure +
plain-layer audit, flag-only except `plain` wording). The researcher captures
each proposed component's **DATA** shape and **RESEARCHER MUST CAPTURE** note as
real sourced data, so dossiers now carry the numbers a component renders. The
verifier treats those `data` values as traceable claims and flags ⚠️ PLAIN-CLAIM
when a `plain` line asserts data. Updated §2 (palette count + canonical
pointer), §5 (dossier data requirement, and the note that
`_templates/dossier.md` has no slot for it yet), §6 (the two new verifier
checks); added §12. The retrofit demonstration — two published issues plus a
fresh draft run — has not been run.

### 2026-05-20 — File created
Initial version. Captures pipeline phases, file shapes (candidate /
dossier / verification), source-allowlist convention, mode-library
pointer, cost table.
