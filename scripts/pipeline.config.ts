/**
 * Pipeline model assignments — the API-CLI route's config.
 *
 * This is the single place to tune which model runs each phase ON THE API
 * ROUTE (`npm run pipeline:*`, billed to ANTHROPIC_API_KEY). The Claude Code
 * route pins every phase to Opus via the Agent `model: 'opus'` override and
 * does not read this file — do NOT "optimise" that route to match this split
 * (CLAUDE.md, Claude Code specifics).
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
 * Cost: ESTIMATES belong nowhere — every run appends its actual dollars and
 * tokens to research/_costs/ledger.jsonl and `npm run pipeline:costs` totals
 * them per issue and per agent. Read that, not a guess.
 *
 * MAX_TURNS is a safety cap per phase, set well above each phase's budget so
 * a stuck agent cannot spend without bound. A run that hits it is reported
 * as failed (exit 3) and still lands in the ledger.
 *
 * Per-run override without editing this file:
 *   npm run pipeline:<phase> <category> -- --model claude-sonnet-5
 */
export interface PipelineConfig {
  models: {
    discovery:      string;
    researcher:     string;
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
    researcher:     'claude-sonnet-5',  // longest loop — 2026-09-21 ruling
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

/** Safety caps on agent turns per phase (the SDK's `maxTurns`). Measured
 *  first-round turns: discover 40–51, research 53–79 (before the budgets);
 *  composer 30–35 plus up to ten more spent on its agent-memory edits, which
 *  is where a cap of 40 caught the tech run on 2026-09-21 — after the
 *  storyboard was written, so nothing was lost but the ledger row. */
export const MAX_TURNS: Record<keyof PipelineConfig['models'], number> = {
  discovery:      60,
  researcher:     90,
  composer:       60,
  drafter:        60,
  stylist:        60,
  'reader-panel': 40,
  verifier:       70,
};
