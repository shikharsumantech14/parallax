/**
 * Pipeline model assignments: one config for both doors.
 *
 * This is the single place to tune which model runs each phase. Since the
 * operator's ruling of 2026-09-28 (COST-PLAN §8) the same script runs behind
 * both doors, the terminal (`npm run pipeline:*`, billed to ANTHROPIC_API_KEY)
 * and the slash command (`/pipeline-*`, the same script with
 * `--bill subscription`), and both read this file. The earlier rule that the
 * Claude Code route pinned every phase to Opus is retired with that route.
 *
 * Model IDs — current generation, verified live on 2026-09-16 (a one-word
 * call through the Agent SDK answered from each):
 *   claude-sonnet-5   $2 / $10 per MTok in/out — fast, rule-following
 *   claude-opus-5     $5 / $25 per MTok        — high-craft writing, composition
 *
 * The previous pins were `claude-sonnet-4-6` (previous generation, 50% dearer
 * than Sonnet 5) and `claude-opus-4-1`, which RETIRED on 2026-08-05: the
 * drafter and stylist would have failed with a model-not-found error on the
 * first run after that date. Use the bare IDs above — never a date-suffixed
 * variant.
 *
 * Routing (the operator's ruling, 2026-09-21, after the first measured round):
 *   Split by the SHAPE of the phase, not its importance. A long tool loop
 *   spends its tokens re-reading a growing context on every turn (the ledger:
 *   45% cache writes, 30% cache reads, 20% output); a short read-only pass
 *   spends almost nothing. So the cheap model runs the loops and the dear
 *   model runs the passes.
 *   - discovery / researcher → Sonnet 5. Long loops (40–80 turns measured on
 *     Opus at $3.61 and $7.38 a run). Diligence, not craft; the operator picks
 *     the candidate and the verifier catches what research missed. Both
 *     prompts now carry a fetch / search budget — the trajectory length was
 *     the bigger cost than the model.
 *   - composer / drafter / stylist / verifier → Opus 5. Short passes with few
 *     or no tool calls: the storyboard is the diversity lever, the draft and
 *     the stylist are craft, the verifier is brand protection and fetches
 *     nothing.
 *   - reader-panel → Sonnet, and deliberately NOT the drafter's model: a model
 *     judging its own prose flatters it by 10–25% (REGISTER-PLAN §10.4). A
 *     slightly less capable reader is also the better proxy for a cold one.
 *   The 2026-09-16 ruling (every phase on Opus) stood for one round; the
 *   ledger showed discovery + research for six desks at $65.91.
 *
 * Cost: ESTIMATES belong nowhere — every run, failed runs included, appends
 * its tokens to research/_costs/ledger.jsonl priced two ways: `costUsd` at
 * list price from the token split (scripts/lib/pricing.ts, COST-PLAN CP-01)
 * and `costUsdSdk`, the SDK's own client-side estimate. `npm run
 * pipeline:costs` totals them per issue and per agent. Read that, not a guess.
 *
 * MAX_TURNS is a safety cap per phase, set well above each phase's budget so
 * a stuck agent cannot spend without bound. MAX_BUDGET_USD is the hard stop
 * in dollars. A run that hits either is reported as failed (exit 3) and still
 * lands in the ledger.
 *
 * EFFORT is the SDK's `effort` option per phase (COST-PLAN CP-04 / CP-07,
 * signed 2026-09-28): the loops and the panel at `medium`, the passes and the
 * check at `high`, which is also the models' own default. Effort is a trade;
 * change a phase's level only after one measured issue reads clean against
 * the panel, the verifier's untraced count, `check:prose` and the §4.5 bar.
 *
 * Per-run overrides without editing this file:
 *   npm run pipeline:<phase> <category> -- --model claude-sonnet-5
 *   npm run pipeline:<phase> <category> -- --effort high
 */
export type EffortLevel = 'low' | 'medium' | 'high' | 'xhigh' | 'max';
export const EFFORT_LEVELS: readonly EffortLevel[] = ['low', 'medium', 'high', 'xhigh', 'max'];

export interface PipelineConfig {
  models: {
    discovery:      string;
    researcher:     string;
    /** The dossier check pass (COST-PLAN CP-09): single-shot, after research.
     *  Its definition is scripts/agents/dossier-check.md (AGENT_FILE in
     *  scripts/pipeline.ts maps the key to the file). */
    check:          string;
    composer:       string;
    drafter:        string;
    stylist:        string;
    'reader-panel': string;
    verifier:       string;
  };
  gates: {
    /**
     * The storyboard gate (REGISTER-PLAN RG-07, ruled 2026-09-13: a separate
     * composer agent, and the gate is a switch). Read by BOTH routes — the
     * API CLI's draft phase and the /pipeline-draft slash command.
     *   'required' — the drafter runs only when the storyboard says
     *                `Status: approved` (the setting for the first ten issues)
     *   'auto'     — the drafter also runs on `Status: draft`
     * `Status: hold` parks the issue in either mode.
     */
    storyboard: 'required' | 'auto';
  };
}

export const CONFIG: PipelineConfig = {
  models: {
    discovery:      'claude-sonnet-5',  // long loop — 2026-09-21 ruling
    researcher:     'claude-opus-5',    // COST-PLAN CP-10 (signed 2026-09-28): Opus 5 at `medium` first, Opus 5.5 next, the Sonnet sweep + Opus judge split as the fallback
    check:          'claude-opus-5',    // recompute and confirm in a clean context — CP-09
    composer:       'claude-opus-5',    // the diversity lever — see the header
    drafter:        'claude-opus-5',    // high-craft step
    stylist:        'claude-opus-5',    // high-craft step
    'reader-panel': 'claude-sonnet-5',  // a different model from the drafter, on purpose
    verifier:       'claude-opus-5',    // brand protection; read-only, so affordable
  },
  gates: {
    storyboard: 'required',
  },
};

export const GATES = CONFIG.gates;

export type AgentKey = keyof PipelineConfig['models'];

/** Safety caps on agent turns per phase (the SDK's `maxTurns`). Measured
 *  first-round turns: discover 40–51, research 53–79 (before the budgets);
 *  composer 30–35 plus up to ten more spent on its agent-memory edits, which
 *  is where a cap of 40 caught the tech run on 2026-09-21 — after the
 *  storyboard was written, so nothing was lost but the ledger row. The check
 *  pass is single-shot by design; 20 leaves room for its reads. */
export const MAX_TURNS: Record<AgentKey, number> = {
  discovery:      60,
  researcher:     90,
  check:          20,
  composer:       60,
  drafter:        60,
  stylist:        60,
  'reader-panel': 40,
  verifier:       70,
};

/** The SDK's `effort` per phase (see the header). The models default to
 *  `high` (Opus 5.5 to `medium`), so `high` here changes nothing but makes the
 *  level explicit in the ledger row. */
export const EFFORT: Record<AgentKey, EffortLevel> = {
  discovery:      'medium',
  researcher:     'medium',
  check:          'high',
  composer:       'high',
  drafter:        'high',
  stylist:        'high',
  'reader-panel': 'medium',
  verifier:       'high',
};

/** A hard stop per run, in dollars (the SDK's `maxBudgetUsd`, COST-PLAN
 *  CP-02). It is checked against the SDK's own client-side estimate, not the
 *  list price the ledger records, so leave headroom. Set above the measured
 *  worst runs of September (research $7.38 average, drafter $6.71) so a
 *  normal run never meets it and a runaway one stops. */
export const MAX_BUDGET_USD: Record<AgentKey, number> = {
  discovery:      5,
  researcher:     12,
  check:          3,
  composer:       5,
  drafter:        8,
  stylist:        5,
  'reader-panel': 3,
  verifier:       5,
};

/** Scoped permission rules the runner grants per agent on top of its
 *  frontmatter `tools:` (COST-PLAN CP-02). Every run is `permissionMode:
 *  'dontAsk'`, so a call no rule approves is denied, not prompted. A rule's
 *  tool (Bash below) is made available for that agent only, and only the
 *  matching commands run, plus the read-only set Claude Code never asks
 *  about (ls, cat, grep…). An agent's own `allow:` frontmatter adds to these;
 *  `Bash(npm run check:prose *)` belongs there, for the agents that run it.
 *  Never grant `Bash(npm run *)`: it would let an agent start a billing
 *  `npm run pipeline:*`. */
export const ALLOW: Partial<Record<AgentKey, string[]>> = {
  // WebFetch saves a PDF under the run's tool-results folder; this reads it.
  // Matches `pdftotext …` as written, not the full exe path or a `&&` chain.
  researcher: ['Bash(pdftotext *)'],
};
