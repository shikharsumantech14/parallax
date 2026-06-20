/**
 * Pipeline model assignments.
 *
 * This is the single place to tune which model runs each phase.
 * Model IDs that are known to work (May 2026):
 *   claude-sonnet-4-6   — fast, cheap, good for structured tasks
 *   claude-opus-4-1     — slower, ~5× cost, best for high-craft writing
 *
 * Rule of thumb:
 *   - discovery / researcher / verifier → Sonnet (rule-following, not craft)
 *   - drafter → Opus (this is where voice quality lives)
 *
 * Cost at May 2026 rates (Sonnet: $3/$15 per MTok in/out, Opus: $15/$75):
 *   - Full 6-issue run all Sonnet: ~$14
 *   - Drafter on Opus, others Sonnet: ~$18–23
 */
export interface PipelineConfig {
  models: {
    discovery:    string;
    researcher:   string;
    drafter:      string;
    stylist:      string;
    verifier:     string;
  };
}

export const CONFIG: PipelineConfig = {
  models: {
    discovery:   'claude-sonnet-4-6',
    researcher:  'claude-sonnet-4-6',
    drafter:     'claude-opus-4-1',   // high-craft step — Opus recommended
    stylist:     'claude-opus-4-1',   // high-craft step — Opus recommended
    verifier:    'claude-sonnet-4-6',
  },
};
