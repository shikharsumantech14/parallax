# Parallax pipeline — token profile

Measured 2026-09-27. All "chars" counts are JS string `.length` (UTF-16 code
units) on the file read with `utf-8` encoding; "≈tokens" = chars ÷ 4 per the
task's own convention, except where noted as a **real** (API-reported) token
count, which is exact, not estimated.

---

## Headline findings

1. **The custom agent prompt is a small fraction of what actually loads.**
   The researcher's own `.md` file is ~2.9–3K tokens; the drafter's is
   ~3.7–3.9K. But the first turn of the two largest real runs measured
   **56,767 tokens** (researcher) and **37,152 tokens** (drafter) of fresh
   cache-write before any tool ran. Only ~2,500–3,900 of that is the agent
   file. The remaining ~33,000–54,000 tokens is Claude Code CLI harness
   overhead (built-in tool schemas, environment preamble) that the pipeline's
   `systemPrompt` override does not remove — this is the single biggest
   "garbage tokens" lever available, bigger than any doc-trimming discussed
   below.
2. **`allowedTools` did not fully restrict the tool surface in either
   measured run.** The researcher's frontmatter (both the version live on
   2026-09-17 and today's) never lists `Bash`, `PowerShell`, `Edit`, `Agent`
   or `ToolSearch` — yet the transcript shows real, billed calls to all five.
   Same for the drafter (`Bash`, `PowerShell`, `Edit` used; frontmatter says
   `Read, Glob, Grep, Write` only, unchanged since before the run). `Read`
   `Write` `Edit` `Bash` `Grep` `Glob` `Agent` `ToolSearch` `TaskOutput` and,
   once the agent called `ToolSearch`, `WebSearch`/`WebFetch`/the RAG tool —
   all appeared regardless of the frontmatter `tools:` line.
3. **Because both target agent files were edited *after* the runs analysed**
   (`researcher.md` today, 04:34, in the same commit that retired the RAG
   corpus; `drafter.md` on 2026-09-23), Part A's "current file" sizes and
   Part B's historical transcripts are not perfectly the same prompt. Where
   it matters I measured the actual historical blob with `git show` instead
   of guessing.
4. **`docs/design/catalog.md` (105K chars / 26K tokens whole) is NOT read in
   full.** Both the researcher and drafter transcripts show `awk`/`grep`
   pulling only the named kinds' `## <kind>` blocks (a few thousand chars),
   confirming the prompts' own "the block for every kind you shortlist"
   wording is followed literally, not satisfied by one big `Read`. This part
   of the design is already token-efficient.
5. **Agent memory (`.claude/agent-memory/<agent>/`) is read selectively, not
   wholesale** — in the drafter run, one topic file was opened in full
   (twice) and three more were peeked at with `tail -c 700–900` before an
   `Edit`, not the full 67K-char directory. But the directories grow
   monotonically (every run is told to "update it when you finish") and nothing
   caps them — worth watching, not yet a problem.
6. **Two literal re-reads of the same static input.** The drafter run read
   its own dossier (37,396 chars) and storyboard (25,297 chars) in full
   *twice each* — ~15,700 tokens of pure repetition with no code path that
   requires it.
7. **A PDF-extraction detour cost the researcher run ~8 tool calls just on
   environment discovery** (`Get-Command python…`, `where.exe python…`,
   locating `pdftotext.exe`) before it could read one government PDF's text.

---

# PART A — fixed prefix per agent

## A0. The seven agent definition files

| Agent | Chars | ≈Tokens | Tools (frontmatter) | `memory: project`? |
|---|---:|---:|---|---|
| discovery | 11,380 | 2,845 | Read, Glob, Grep, WebSearch, WebFetch, Write | no |
| researcher | 11,766 | 2,942 | Read, Glob, Grep, WebSearch, WebFetch, Write, Edit | no |
| composer | 10,928 | 2,732 | Read, Glob, Grep, Write | yes |
| drafter | 15,768 | 3,942 | Read, Glob, Grep, Write | yes |
| reader-panel | 5,606 | 1,402 | Read, Glob, Grep, Write | no |
| stylist | 11,419 | 2,855 | Read, Glob, Grep, Edit, Write | yes |
| verifier | 14,130 | 3,533 | Read, Glob, Grep, Write, Edit | yes |
| **sum** | **80,997** | **~20,249** | | |

Historical check (`git show 9be76d9`, the commit live on both 2026-09-17 and
2026-09-21, i.e. during both transcripts analysed below): `researcher.md` was
**10,054 chars** then (tools: `Read, Glob, Grep, WebSearch, WebFetch, Write,
mcp__parallax_rag__search` — no `Edit`, and the now-retired RAG tool instead)
vs 11,766 today; `drafter.md` was **14,828 chars** then (tools: `Read, Glob,
Grep, Write` — identical to today) vs 15,768 today. So the drafter's prompt
barely moved; the researcher's did (RAG removal, `Edit` added, other prose
changes net larger despite the removal).

`discovery.md`, `researcher.md`, `verifier.md`, `voice-checker.md` all carry
today's date (2026-09-27 04:34) — the same commit that retired the June
content engine (`70ca7d2`). `composer.md`/`drafter.md` are from 2026-09-23.
`stylist.md` (2026-09-16) and `reader-panel.md` (2026-09-13) predate the
window analysed in Part B and are very likely exactly what ran.

## A1. Files each agent's prompt instructs it to Read at the start

Only the numbered "Step 1 / Load inputs" list per agent file; conditional or
dynamic (per-run) reads are marked. Chars/tokens from the **current** files
(caveat above).

**discovery** (Step 1 + Step 4's format/kind references):
| File | Chars | ≈Tok |
|---|---:|---:|
| `research/_sources/_TAXONOMY.md` | 9,120 | 2,280 |
| `research/_sources/<category>.md` (one of six) | 17,192–22,086 | 4,298–5,522 |
| `docs/design/catalog-shapes.md` | 11,737 | 2,934 |
| `docs/generated/PROJECT-GRAPH.md` | 12,353 | 3,088 |
| `research/_templates/candidate.md` | 2,506 | 627 |
| *dynamic:* `src/content/issues/*/index.mdx` titles/tags, to skip covered stories (30 dirs, 463,488 chars if fully read — in practice almost certainly Grepped for `title:`/`tags:`, not fully Read) | — | — |
| **fixed sum** (mid-size category) | **≈54,900** | **≈13,725** |

**researcher** (Step 1 + Step 5/6 references):
| File | Chars | ≈Tok |
|---|---:|---:|
| `research/_sources/_TAXONOMY.md` | 9,120 | 2,280 |
| `research/_sources/<category>.md` | 17,192–22,086 | 4,298–5,522 |
| *dynamic:* `research/<cat>/*-candidates.md` (most recent) | 17,075–19,726 measured | 4,269–4,932 |
| `docs/design/catalog.md` — **per-kind blocks only** (measured: 2 Grep/`awk` pulls totalling 11,808 chars in the transcript, not the 105,134-char whole file) | ~9,400 (≈9 kinds) | ~2,350 |
| `docs/generated/PROJECT-GRAPH.md` | 12,353 | 3,088 |
| `research/_voice/jargon.md` (append target; read first) | 12,765 | 3,191 |
| `research/_templates/dossier.md` | 2,471 | 618 |
| **fixed sum (excl. candidates file)** | **≈65,700** | **≈16,425** |

**composer** (Step 1):
| File | Chars | ≈Tok |
|---|---:|---:|
| *dynamic:* dossier | 32,332–51,927 measured (5 in this round) | 8,083–12,982 |
| `research/_voice/_voice-core.md` | 29,364 | 7,341 |
| `docs/design/catalog-shapes.md` | 11,737 | 2,934 |
| `docs/design/catalog.md` — per-kind blocks shortlisted (not the whole file; same pattern as researcher/drafter, not directly transcript-confirmed for composer but consistent with its own wording "the block for every kind you shortlist") | ~9,000 est. | ~2,250 |
| `research/_templates/storyboard.md` | 4,934 | 1,234 |
| `src/content/config.ts` | 12,763 | 3,191 |
| `docs/design/CANON.md` (§2–3; whole file is 857 lines, fits one Read) | 19,874 | 4,969 |
| `docs/generated/PROJECT-GRAPH.md` | 12,353 | 3,088 |
| *dynamic:* other storyboards this round (`research/*/*-storyboard.md`, ≤30 days) — measured example 28,897 chars each, up to 5 others | 0–~144,000 | 0–~36,000 |
| agent memory `.claude/agent-memory/composer/` (ceiling; "consult before you start") | 52,486 | 13,122 |
| **fixed sum (excl. dossier, other-storyboards)** | **≈142,500** | **≈35,630** |

**drafter** (Step 1, transcript-confirmed):
| File | Chars | ≈Tok |
|---|---:|---:|
| *dynamic:* dossier (read **twice**, full, in the measured run) | 35,372–51,927 measured ×2 in practice | 8,843–12,982 ×2 |
| *dynamic:* storyboard (read **twice**, full, in the measured run) | 28,897 measured ×2 | 7,224 ×2 |
| `research/_voice/_voice-core.md` | 29,364 | 7,341 |
| `research/_voice/hinglish-lexicon.md` | 4,944 | 1,236 |
| `research/_voice/jargon.md` | 12,765 | 3,191 |
| `src/content/config.ts` | 12,763 (measured 13,647 in the historical read — CRLF line endings inflate char count slightly) | 3,191–3,412 |
| `src/content/issues/_template/index.mdx` | 1,106 | 277 |
| `docs/design/catalog.md` — per-kind blocks (transcript-confirmed via `awk`/`grep`, not full file) | ~9,000 (≈9 kinds) | ~2,250 |
| `docs/design/catalog-shapes.md` (conditional — only if a storyboard kind lacks data) | 11,737 | 2,934 |
| agent memory `.claude/agent-memory/drafter/` (ceiling 67,064; **observed** in the run: MEMORY.md index 834 + one topic file read twice ~26,864 + three `tail -c 700–900` peeks ~2,300 ≈ **30,000 actually touched**) | 30,000 observed / 67,064 ceiling | 7,500 / 16,766 |
| **fixed sum (single dossier/storyboard read, observed memory)** | **≈100,500** | **≈25,110** |
| **as actually run (double dossier+storyboard reads, observed memory)** | **≈155,000** | **≈38,760** |

**reader-panel** (Step 1–2, no agent memory):
| File | Chars | ≈Tok |
|---|---:|---:|
| `research/_voice/_voice-core.md` (only §1 needed; whole 528-line file fits one Read) | 29,364 | 7,341 |
| *dynamic:* storyboard (§6 only) | 4,934–28,897 range | 1,234–7,224 |
| *dynamic:* draft issue MDX | 10,000–24,000 typical (measured avg 15,450 across 30 issues) | ~3,860 |
| **fixed sum** | **29,364 + dynamic** | **7,341 + dynamic** |

This is the leanest agent by a wide margin — consistent with its ledger
turns (5–10) and cost ($1.28–2.37) being the smallest of all seven phases.

**stylist** (Step 1):
| File | Chars | ≈Tok |
|---|---:|---:|
| `research/_voice/_voice-core.md` | 29,364 | 7,341 |
| `research/_voice/hinglish-lexicon.md` | 4,944 | 1,236 |
| `research/_voice/jargon.md` | 12,765 | 3,191 |
| `research/_voice/mode-library.md` | 50,109 | 12,527 |
| *dynamic:* issue MDX | ~15,450 avg | ~3,860 |
| *dynamic:* storyboard (if exists) | ~4,900–28,900 | ~1,200–7,200 |
| *dynamic:* reader-panel report (if exists) | 10,103–11,966 measured | 2,526–2,992 |
| agent memory `.claude/agent-memory/stylist/` (ceiling) | 74,975 | 18,744 |
| **fixed sum (excl. dynamic)** | **≈172,157** | **≈43,040** |

**verifier** (Step 1):
| File | Chars | ≈Tok |
|---|---:|---:|
| *dynamic:* draft issue MDX | ~15,450 avg | ~3,860 |
| *dynamic:* dossier (most recent) | 32,332–51,927 | 8,083–12,982 |
| *dynamic:* storyboard (if exists) | ~4,900–28,900 | ~1,200–7,200 |
| `research/_voice/_voice-core.md` | 29,364 | 7,341 |
| `research/_voice/hinglish-lexicon.md` | 4,944 | 1,236 |
| agent memory `.claude/agent-memory/verifier/` (ceiling) | 81,618 | 20,405 |
| **fixed sum (excl. dynamic)** | **≈115,926** | **≈28,982** |

(Referenced-but-not-listed-in-Step-1: `_TAXONOMY.md` for the source-balance
check, `docs/generated/PROJECT-GRAPH.md` for NO-NEW-KIND, `research/_sources/README.md`
for the quotability rule — the verifier prompt cites these rules inline
rather than pointing at the files, so whether the model re-opens the source
files is a per-run judgment call, not a scripted Read.)

## A2. Files shared by several agents

| File | Chars | Used by |
|---|---:|---|
| `research/_voice/_voice-core.md` | 29,364 | composer, drafter, reader-panel, stylist, verifier (5 of 7) |
| `research/_voice/jargon.md` | 12,765 | researcher (append), drafter, stylist |
| `research/_voice/hinglish-lexicon.md` | 4,944 | drafter, stylist, verifier |
| `research/_sources/_TAXONOMY.md` | 9,120 | discovery, researcher |
| `docs/design/catalog.md` (per-kind blocks) | ~105K whole / ~9K typical slice | researcher, composer, drafter |
| `docs/design/catalog-shapes.md` | 11,737 | discovery, composer, drafter (conditional) |
| `docs/generated/PROJECT-GRAPH.md` | 12,353 | discovery, researcher, composer, (verifier, by reference) |
| `src/content/config.ts` | 12,763 | composer, drafter |
| the dossier | per-issue | composer, drafter, verifier |
| the storyboard | per-issue | drafter, reader-panel, stylist, verifier |

`_voice-core.md` is the single most-shared fixed file (5 of 7 agents) — it is
also 528 lines / 29,364 chars, comfortably inside one `Read` call. It is the
best single-file target if the operator wants to shrink everyone's floor at
once.

## A3. `scripts/lib/prompts.ts` and `scripts/lib/runner.ts`

**What the user prompt adds** (from `prompts.ts`): today's date in IST
(`todayIST()`, for discovery/research recency windows), the working directory
as a POSIX path (`cwdPosix()`, for storyboard/draft/panel/verify), and the
exact file paths for candidates/dossier/storyboard files — the prompt tells
the agent exactly which files exist and where, so it does not have to Glob
for them (though it still may, per the Step-1 "Glob `research/<category>/*-candidates.md`"
instruction in researcher.md). The invocation prompts themselves are short:
993 chars (research, travel) and 717 chars (draft, earth) measured directly
from the two transcripts — call it ~700–1,300 chars typically.

**`systemPrompt` is the agent file verbatim**, not a preset — confirmed in
`agent-loader.ts`: it splits the `.md` on `---` delimiters and everything
after the second one, trimmed, becomes `systemPrompt`. No Claude Code preset
text, no CLAUDE.md/AGENTS.md is merged in (confirmed separately by
`pipeline-scripts.md`: "the agent runs under its own system prompt, not the
Claude Code preset, so it does NOT see CLAUDE.md / AGENTS.md").

**Tools allowed per agent**: `allowedTools: opts.agent.tools`, i.e. exactly
the frontmatter `tools:` line, comma-split. See the table in A0.
**Measured caveat (Part B): this restriction did not hold in practice** —
both analysed transcripts show tool calls (`Bash`, `PowerShell`, `Edit`,
`Agent`, `ToolSearch`, `TaskOutput`) outside the declared list. See Part B.

**`maxTurns`**: passed only when `opts.maxTurns` is set — the caller
(`scripts/pipeline.ts`, not shown here) supplies it from `MAX_TURNS` in
`pipeline.config.ts`: discovery 60, researcher 90, composer 60, drafter 60,
stylist 60, reader-panel 40, verifier 70.

**Context-management / effort options**: none. The full options object
passed to the SDK's `query()` is exactly:

```js
options: {
  systemPrompt: opts.agent.systemPrompt,
  allowedTools: opts.agent.tools,
  model: opts.model,
  cwd: opts.cwd,
  env,                                  // CLAUDE_CONFIG_DIR override, or process.env
  strictMcpConfig: true,                // only the mcpServers passed below — none today
  ...(opts.maxTurns ? { maxTurns: opts.maxTurns } : {}),
  ...(opts.mcpServers ? { mcpServers: opts.mcpServers } : {}),
}
```

No `thinking`/effort budget, no context-editing/compaction option, no cache
TTL override is passed — `runner.ts`'s own comment says the first turn is
cached for one hour by default behaviour, not a setting this code chooses.
Given the runner does not set an interleaved-thinking or extended-thinking
option, the `thinking` blocks seen in the researcher transcript (37 of them,
0 chars of actual content in the one sampled — `signature`-only, no visible
`thinking` text) are presumably redacted/empty by default in this SDK path,
not a cost driver.

**`strictMcpConfig: true`**, per the code comment, keeps only the MCP
servers explicitly passed to this call (none today; the RAG corpus filled
this slot until its 2026-09-27 retirement). The historical Sep-17 researcher
run predates that retirement and indeed shows one real
`mcp__parallax_rag__search` call — consistent.

## A4. `docs/design/catalog.md` composition

857 lines, **105,134 chars (≈26,284 tokens)** whole. 101 `## <kind>` blocks
(1:1 with `SECTION_KINDS`). The `- **DATA:**` lines themselves total
**15,418 chars (14.7%)**; the remaining **89,716 chars (85.3%)** is prose —
USE WHEN / DON'T USE / PLAIN / RESEARCHER MUST CAPTURE prose and the header
material. So even a full read is 85% narrative guidance around a 15% data
skeleton — but per A1/A4 above, the transcripts show this file is not read
in full by any of the three writing agents that cite it; they Grep/`awk` out
only the named kinds' blocks (average block ≈1,041 chars).

## A5. Other measured reference files (task-specified)

| File | Chars | ≈Tokens | Lines |
|---|---:|---:|---:|
| `research/_voice/_voice-core.md` | 29,364 | 7,341 | 528 |
| `research/_voice/mode-library.md` | 50,109 | 12,527 | 1,029 |
| `research/_voice/hinglish-lexicon.md` | 4,944 | 1,236 | — |
| `src/content/config.ts` | 12,763 | 3,191 | — |
| `docs/design/catalog-shapes.md` | 11,737 | 2,934 | 208 |
| `docs/design/blueprints/**` (63 files, total) | **895,241** | **223,810** | — |
| largest allowlist: `research/_sources/tech.md` | 22,086 | 5,522 | — |
| (all six allowlists, for reference) politics 17,894 · space 17,192 · earth 20,439 · tech 22,086 · travel 19,478 · sports 19,217 | | | |

**Important scope note on the blueprints total**: none of the seven
editorial-pipeline agents (discovery/researcher/composer/drafter/reader-panel/
stylist/verifier) reads `docs/design/blueprints/**` — it is not mentioned in
any Step-1 load list. That 895K-char / 224K-token figure belongs to a
*different* workflow (component engineering — the `add-section-kind` /
`run-wave` skills, run interactively in Claude Code, not the API-billed
pipeline). It is reported here only because it was explicitly asked for; it
is not part of any pipeline agent's prefix.

`docs/REGISTER-PLAN.md` (84,206 chars / 21,052 tokens, 1,173 lines) and
`docs/design/CANON.md` (19,874 chars) are **cited by section number**
inside several agent prompts (drafter Step 2.5, composer Step 1 item 7,
stylist Step 4.6) but the actual floor/ceiling *rules* are quoted verbatim
into the agent `.md` files themselves (e.g. drafter Step 2.5 spells out
every floor). So these two source documents are very unlikely to be
re-Read at run time — the agent file already carries the operative text.
Treat their sizes as "provenance", not "prefix."

---

# PART B — a real run's transcript

## Where I looked, and what I found

- `D:\SideProjects\parallax\.claude-api-home\projects\D--SideProjects-parallax\`
  exists but is **empty** (no `.jsonl` files at all). No pipeline run ever
  wrote a transcript there.
- `C:\Users\user\.claude\projects\D--SideProjects-parallax\` holds ~80
  session transcripts, both interactive-human sessions and, mixed in among
  them, the automated pipeline runs — because of the credential bug
  `.claude/rules/pipeline-scripts.md` documents (the spawned CLI prefers the
  operator's real claude.ai login over `CLAUDE_CONFIG_DIR`'s isolated
  directory unless that directory is truly empty of a login; every run from
  2026-09-16 through 2026-09-22 05:40 UTC used the operator's real config,
  confirmed here by a `SessionStart:startup` hook — `session-brief.mjs`,
  project-local — actually firing inside these transcripts).
- I identified the pipeline runs unambiguously by grepping every transcript
  for the exact prompt text `prompts.ts` generates (`"Run research for
  category"`, `"Write a complete draft issue from this dossier"`), then
  confirmed each candidate file's **first user message** matches the
  template exactly for a specific category/slug, and cross-checked every
  token/cost number the SDK reported against the matching row in
  `research/_costs/ledger.jsonl`. Every number matched **exactly** (see
  below) — high confidence these are the right files.
- Largest **researcher** run by the ledger (`cacheReadTokens`): **travel /
  half-indias-arrivals-are-indians**, 2026-09-17, turns 79, cost $10.24 →
  transcript `C:\Users\user\.claude\projects\D--SideProjects-parallax\db3bff05-6543-467a-bef6-c4aac08806c9.jsonl` (915,464 bytes).
- Largest **drafter** run (only 3 drafts exist in the ledger — politics/
  travel/sports never reached this phase before the operator's subscription
  usage ran out on 2026-09-22): **earth / indonesia-fire-burns-soil-not-trees**,
  2026-09-21, turns 58, cost $7.79 → transcript
  `C:\Users\user\.claude\projects\D--SideProjects-parallax\858fd4cd-c757-413f-a890-2dbae2d23d68.jsonl` (1,794,899 bytes).

**Validation**: for both files, summing `message.usage` (deduped by
`message.id`, since the CLI logs one JSONL line per content block but repeats
the same usage object across every block of one API turn) across every
assistant turn reproduces the ledger row's `cacheWriteTokens`,
`cacheReadTokens`, `inputTokens` and `outputTokens` **exactly**:

| | cache-write | cache-read | input | output |
|---|---:|---:|---:|---:|
| travel research — ledger | 333,579 | 5,257,374 | 94 | 49,711 |
| travel research — summed from transcript | 333,579 | 5,257,374 | 94 | 49,711 |
| earth draft — ledger | 380,033 | 4,904,041 | 90 | 68,243 |
| earth draft — summed from transcript | 380,033 | 4,904,041 | 90 | 68,243 |

Tool-call counts also match: travel research ledger says `webSearches:17,
webFetches:29`; the transcript's `tool_use` tally is `WebSearch: 17,
WebFetch: 29`, exactly.

**One discrepancy, reported rather than smoothed over**: the ledger's
`turns` field (79 for travel, 58 for earth) does not match the count of
*unique assistant `message.id` values* in the transcript (47 and 45
respectively). `tool_use` block counts (77 and 55) are much closer to the
ledger figures than the message-id count is. The SDK's `num_turns` is
evidently counting at a finer grain than "one turn = one assistant API
response" — most likely each tool round-trip, or an internal step counter —
not something recoverable from the transcript alone. I report both numbers
rather than forcing a reconciliation.

## B1. Researcher — travel / half-indias-arrivals-are-indians (largest)

**Turns**: 47 unique assistant responses (136 content-block lines); ledger's
own count is 79. One `compact_boundary` fired (Claude Code's own
auto-compaction triggered mid-run — an extra, currently invisible-to-the-
ledger cost of its own).

**Tool calls by name** (77 total):

| Tool | Calls | Allowed by (then-current) frontmatter? |
|---|---:|---|
| WebFetch | 29 | yes |
| WebSearch | 17 | yes (after a `ToolSearch` load) |
| Read | 8 | yes |
| Bash | 7 | **no** |
| Grep | 5 | yes |
| PowerShell | 3 | **no** |
| ToolSearch | 2 | **no** (not listed; appears to be a harness default) |
| Edit | 2 | **no** (2026-09-17 frontmatter had no `Edit`) |
| mcp\_\_parallax_rag\_\_search | 1 | yes (RAG was live then) |
| Agent | 1 | **no** |
| TaskOutput | 1 | **no** (the Agent call's own result) |
| Write | 1 | yes |

15 of 77 calls (19%) are on tools the researcher's declared list did not
include. Peeking at what they actually did (not just that they ran):

- `ToolSearch` loaded `WebSearch,WebFetch,mcp__parallax_rag__search` and
  later `TaskOutput` — confirming this run's harness uses the same
  deferred-tool-schema mechanism visible in this very measurement session:
  a baseline toolset is available up front, and some tools are gated behind
  an explicit `ToolSearch` call regardless of the agent's own `tools:` line.
- `Bash`/`PowerShell` were used for a **PDF-text-extraction detour**: the
  agent WebFetched a government PDF, got back something it couldn't use
  directly, then spent two `PowerShell` calls checking whether `python`,
  `python3`, `py` or `pdftotext` were even installed
  (`Get-Command python,python3,py,pdftotext…`, `where.exe python python3 py
  pdftotext`), located `pdftotext.exe` under Git's own mingw64 bundle, and
  ran it twice via `Bash`/`PowerShell` to extract two separate PDFs to local
  `.txt` snapshots. One more `Bash` check tested for the `pypdf` Python
  package (twice). That is **~8 of the run's 47 turns spent on environment
  discovery**, not research.
- `Agent` spawned one background `general-purpose` sub-agent
  ("Find ministry country-wise FTA tables… trace specific figures back to
  India's Ministry of Tourism's OWN published tables") — a leaf pipeline
  agent delegating to a fresh sub-agent, which is not described anywhere in
  `researcher.md`.
- `Edit` (×2) and one plain `Bash` (`ls research/_voice/ && tail -20
  research/_voice/jargon.md`) look like ordinary jargon-file maintenance.

**Tool-result content, chars, by originating tool**:

| Tool | Chars | ≈Tok |
|---|---:|---:|
| Read | 69,899 | 17,475 |
| WebSearch | 55,707 | 13,927 |
| WebFetch | 22,800 | 5,700 |
| Grep | 11,373 | 2,843 |
| mcp\_\_parallax_rag\_\_search | 7,873 | 1,968 |
| TaskOutput | 4,198 | 1,050 |
| (unattributed — likely sub-agent/sidechain) | 2,915 | 729 |
| Bash | 1,990 | 498 |
| Agent | 838 | 210 |
| PowerShell | 498 | 125 |
| Edit | 293 | 73 |
| Write | 125 | 31 |
| ToolSearch | 50 | 13 |
| **total** | **178,559** | **44,640** |

**Ten largest single tool results**:

1. Read, 23,874 chars — `research/travel/2026-09-16-candidates.md`
2. Read, 19,998 chars — `research/_sources/travel.md`
3. Read, 9,555 chars — `research/_voice/jargon.md`
4. Read, 9,421 chars — `research/_sources/_TAXONOMY.md`
5. `mcp__parallax_rag__search`, 7,873 chars — query "India foreign tourist arrivals NRI arrivals 2025…"
6. Grep, 6,575 chars — `docs/design/catalog.md` (kind-block extraction)
7. WebSearch, 6,019 chars — theconversation.com VFR-tourism query
8. Read, 5,233 chars — `docs/design/catalog.md` (second slice)
9. TaskOutput, 4,198 chars — the sub-agent's returned summary
10. WebSearch, 3,900 chars — Thailand/Vietnam/Malaysia/Japan arrivals query

**Assistant output**: text 5,576 chars (1,394 tok); thinking 0 chars visible
(37 `thinking` blocks exist but carry only a `signature`, no visible
`thinking` text in this SDK path); tool-call JSON arguments 62,769 chars
(15,692 tok, mostly WebFetch/WebSearch query strings and the long `Agent`
sub-prompt). **Total model output ≈ 68,345 chars (17,086 tok).**

**First user message** (the invocation prompt from `prompts.ts`): 993 chars
(248 tok).

## B2. Drafter — earth / indonesia-fire-burns-soil-not-trees (largest)

**Turns**: 45 unique assistant responses (232 lines total). Ledger's own
count: 58. Two `compact_boundary` events fired mid-run.

**Tool calls by name** (55 total): Read 28 · Grep 9 · Bash 8 · Edit 7 ·
Write 2 · PowerShell 1. Frontmatter (then and now): `Read, Glob, Grep,
Write` only — so `Bash` (8), `Edit` (7) and `PowerShell` (1), 16 of 55 calls
(29%), are outside the declared list.

What the extra tools did:
- `Bash`/`sed -n` read three **overlapping, non-contiguous line ranges**
  of the dossier and storyboard (lines 380–470, 150–310, 30–120 of the
  dossier; 140–200 of the storyboard) — on top of two **full** `Read` calls
  of each file (see below). `Bash`/`grep -n` and `awk` also pulled the
  catalog's kind blocks, same pattern as the researcher.
- **`PowerShell` ran `npm run check:prose -- 2026-09-21-indonesia-fire-burns-soil-not-trees`**
  — the drafter invoked the composition/register gate on its own draft,
  mid-run, on its own initiative. `drafter.md`'s own Step 7 checklist never
  mentions running this script; the gate is documented elsewhere
  (`AGENTS.md` §8, the `/verify-done` skill) as a later, separate check.
- `Edit` (×7) touched the just-written issue MDX (2 edits) and four of its
  own agent-memory files (`component-data-shape-traps.md`,
  `word-budget-accounting.md` ×2, `check-prose-heuristics.md`,
  `hindi-per-desk.md`) — consistent with "update it when you finish", just
  interleaved mid-run rather than only at the end.

**Tool-result content, chars, by originating tool**:

| Tool | Chars | ≈Tok |
|---|---:|---:|
| Read | 293,095 | 73,274 |
| Bash | 31,842 | 7,961 |
| Grep | 22,608 | 5,652 |
| (unattributed) | 5,316 | 1,329 |
| Edit | 916 | 229 |
| Write | 270 | 68 |
| PowerShell | 30 | 8 |
| **total** | **354,077** | **88,519** |

**Ten largest single tool results** — note items 1/2 and 4/5 are the *same
file*, read in full **twice**:

1–2. Read, 37,396 chars **each** (×2) — `research/earth/2026-09-17-indonesia-fire-burns-soil-not-trees-dossier.md`
3. Read, 31,081 chars — `research/_voice/_voice-core.md`
4–5. Read, 25,297 chars **each** (×2) — `research/earth/2026-09-21-indonesia-fire-burns-soil-not-trees-storyboard.md`
6. Read, 16,147 chars — `src/components/topic/politics/PowerFlow.astro` (component source — the drafter went and read an unrelated topic's component implementation, not just the catalog entry)
7. Read, 14,451 chars — `.claude/agent-memory/drafter/component-data-shape-traps.md`
8. Read, 13,647 chars — `src/content/config.ts`
9. Read, 13,229 chars — `research/_voice/jargon.md`
10. Read, 12,413 chars — `.claude/agent-memory/drafter/component-data-shape-traps.md` (again — a second, differently-ranged read of the same file)

The two full re-reads of the dossier and storyboard alone total **125,386
chars (~31,347 tokens)** for content that only needed to enter context once.

**Assistant output**: text 4,364 chars (1,091 tok); thinking 0 chars
visible; tool-call JSON arguments 48,276 chars (12,069 tok — the `Edit`
calls' `old_string`/`new_string` pairs are the bulk of this, since each Edit
duplicates the surrounding YAML context in its arguments). **Total model
output ≈ 52,640 chars (13,160 tok).**

**First user message**: 717 chars (179 tok).

## B3. The arithmetic — prefix vs tool results vs model output

Two methods, shown side by side because the naive one the task describes
systematically misleads here, and I want that visible rather than hidden.

### Method 1 — literal: cumulative chars ÷ 4, using only what the transcript shows

For each turn, add up (a) the constant first-user-message chars (the only
"prefix" visible in a transcript — the actual system prompt is never logged
as a distinct entry in this JSONL format, confirmed by inspecting the one
`type: system` entry present, which is a `compact_boundary` marker, not the
prompt), (b) cumulative tool-result chars introduced so far, (c) cumulative
model-output chars introduced so far. Sum that per-turn total across all
turns:

| | travel research | earth draft |
|---|---:|---:|
| turns simulated | 47 | 45 |
| Σ prefix/user chars | 190,236 (3.0%) | 1,679,957 (11.3%) |
| Σ tool-result chars | 5,418,798 (84.2%) | 12,280,955 (82.9%) |
| Σ model-output chars | 826,879 (12.8%) | 855,585 (5.8%) |
| **grand total** | **6,435,913 chars ≈ 1,608,978 tok** | **14,816,497 chars ≈ 3,704,124 tok** |

This method's "prefix" share (3.0% / 11.3%) is **known to be wrong** — it
only captures the ~1KB first user message, not the system prompt or tool
schemas, because the transcript format never logs those verbatim (see B0
note above). It understates prefix and correspondingly overstates the other
two.

### Method 2 — corrected: real per-turn API usage for the total and the prefix, transcript chars only to split the remainder

The API's own `usage` on each turn already reports the exact context size
that turn (`cache_creation_input_tokens + cache_read_input_tokens +
input_tokens`), summed and cross-validated against the ledger above. The
first turn's `cache_creation_input_tokens` is the true prefix (system
prompt + tool schemas + first user message, all written fresh) — and
because a cached prefix is *re-read*, not re-written, on every later turn,
its contribution to the sum-over-turns is `prefix_tokens × turn_count`:

**Travel research:**
```
real prefix (turn-1 cache_creation)         = 56,767 tok
prefix contribution = 56,767 × 47 turns     = 2,668,049 tok
real Σ context-per-turn (all 47 turns)      = 5,591,047 tok
  prefix share = 2,668,049 / 5,591,047      = 47.7%
remainder                                   = 5,591,047 − 2,668,049 = 2,922,998 tok
  (from transcript chars: tool-results 178,559 / output 68,345 = 72.3% / 27.7% split)
  tool-results ≈ 2,922,998 × 72.3%          = 2,113,889 tok = 37.8% of total
  model-output ≈ 2,922,998 × 27.7%          =   809,109 tok = 14.5% of total
  check: 47.7 + 37.8 + 14.5                 = 100.0%
```

**Earth draft:**
```
real prefix (turn-1 cache_creation)         = 37,152 tok
prefix contribution = 37,152 × 45 turns     = 1,671,840 tok
real Σ context-per-turn (all 45 turns)      = 5,284,164 tok
  prefix share = 1,671,840 / 5,284,164      = 31.6%
remainder                                   = 5,284,164 − 1,671,840 = 3,612,324 tok
  (from transcript chars: tool-results 354,077 / output 52,640 = 87.1% / 12.9% split)
  tool-results ≈ 3,612,324 × 87.1%          = 3,144,793 tok = 59.5% of total
  model-output ≈ 3,612,324 × 12.9%          =   467,531 tok = 8.8% of total
  check: 31.6 + 59.5 + 8.8                  = 99.9% (rounding)
```

| Share of cumulative context | travel research | earth draft |
|---|---:|---:|
| **Prefix** (system prompt + tool schemas + harness, re-read every turn) | **47.7%** | **31.6%** |
| **Tool results** | 37.8% | 59.5% |
| **Model output** | 14.5% | 8.8% |

Reading this: the researcher run's cost is nearly *half* pure prefix
re-reading, because it ran 47 turns each re-reading the same ~57K-token
opening — a long tool loop (this is exactly what `pipeline.config.ts`'s own
comment already says, generically: "a long tool loop spends its tokens
re-reading a growing context on every turn"). The drafter run has fewer,
richer turns (big `Read`s of the dossier/storyboard/catalog blocks
dominate), so tool-results take the larger share.

### Cross-check against the ledger's stated researcher average

The task's fallback numbers ("researcher avg 308k cache-write, 4.06M
cache-read, 52k output, 65 turns, ~14 web searches") are closely reproduced
by averaging the five *other* research-phase ledger rows directly (I did
not need the fallback since transcripts exist, but it corroborates them):

| | ledger-quoted avg | computed from the 5 research rows |
|---|---:|---:|
| cache-write | 308k | 311,261 |
| cache-read | 4.06M | 4,206,608 |
| output | 52k | 52,418 |
| turns | 65 | 65.2 |
| web searches | ~14 | 14.4 |

---

## Recommendations (what is actually worth removing)

1. **Biggest lever, unconfirmed mechanism**: find out what is in the
   ~33K–54K tokens of first-turn cache-write that is *not* the agent `.md`
   file. It cannot be observed from the transcript format itself (no logged
   system-prompt entry); it would need either an API-level request capture
   or a controlled A/B run (same agent, `strictMcpConfig` toggled, a
   from-scratch empty `CLAUDE_CONFIG_DIR`) to attribute cleanly between CLI
   harness preamble, built-in tool schemas, and any stray connector bloat.
2. **Confirm and fix the `allowedTools` leak.** Two independent transcripts,
   two different agents, both show tool calls outside the frontmatter list.
   If this is still true post-fix (worth re-checking on a fresh isolated
   run), it means the "researcher does not write prose" / "drafter does not
   research" contracts in the agent files are aspirational, not enforced —
   and every extra tool surface is extra schema tokens on top of whatever
   is already unexplained in point 1.
3. **Stop the double full-reads.** The drafter re-read its own dossier and
   storyboard in full a second time (~31K tokens combined) with no
   instruction that calls for it. If this reproduces on other runs, it is
   pure waste and the simplest of all the findings to act on.
4. **Cap or consolidate agent memory before it compounds.** Ceiling sizes
   today (stylist 75K chars / verifier 82K chars across a dozen-ish files
   each) are already bigger than the voice contract. They grow by
   instruction ("update it when you finish") with no stated cap, unlike the
   user's own `MEMORY.md` convention (200-line/25KB index cap). Observed
   behaviour is still selective (one file read in full, others tail-peeked)
   so this is not costing much *yet* — but nothing stops it from becoming
   the researcher/drafter-scale problem in a year.
5. **The PDF-extraction detour (8 turns of environment discovery on one
   run) is a one-time fix**: teach the researcher prompt (or give it a
   pre-installed `pdftotext`/`pypdf` check baked into the environment) so it
   doesn't re-discover the same toolchain from scratch per run.
6. Leave `docs/design/catalog.md` alone — the per-kind Grep/`awk` pattern
   already keeps its 105K chars almost entirely out of context.
