/**
 * Pipeline model assignments — the API-CLI route's config.
 *
 * This is the single place to tune which model runs each phase ON THE API
 * ROUTE (`npm run pipeline:*`, billed to ANTHROPIC_API_KEY). The Claude Code
 * route pins every phase to Opus via the Agent `model: 'opus'` override and
 * does not read this file — do NOT "optimise" that route to match this split
 * (CLAUDE.md, Claude Code specifics).
 *
 * Model IDs that are known to work (May 2026):
 *   claude-sonnet-4-6   — fast, cheap, good for structured tasks
 *   claude-opus-4-1     — slower, ~5× cost, best for high-craft writing
 *
 * Rule of thumb:
 *   - discovery / researcher / composer / verifier → Sonnet (rule-following,
 *     selection, tracing — not craft)
 *   - drafter / stylist → Opus (this is where voice quality lives)
 *   - reader-panel → Sonnet, and deliberately NOT the drafter's model: a model
 *     judging its own prose flatters it by 10–25% (REGISTER-PLAN §10.4)
 *
 * Cost at May 2026 rates (Sonnet: $3/$15 per MTok in/out, Opus: $15/$75):
 *   - Full 6-issue run all Sonnet: ~$14
 *   - Drafter on Opus, others Sonnet: ~$18–23
 *   - storyboard ~$0.30–0.60 and panel ~$0.50–1.00 per issue on top
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
    discovery:      'claude-sonnet-4-6',
    researcher:     'claude-sonnet-4-6',
    composer:       'claude-sonnet-4-6',
    drafter:        'claude-opus-4-1',   // high-craft step — Opus recommended
    stylist:        'claude-opus-4-1',   // high-craft step — Opus recommended
    'reader-panel': 'claude-sonnet-4-6', // a different model from the drafter, on purpose
    verifier:       'claude-sonnet-4-6',
  },
  gates: {
    storyboard: 'required',
  },
};

export const GATES = CONFIG.gates;
