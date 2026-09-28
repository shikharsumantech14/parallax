/**
 * List prices for the models the pipeline runs, and the one function that
 * turns a token split into dollars (COST-PLAN CP-01, signed 2026-09-28).
 *
 * Source: https://platform.claude.com/docs/en/about-claude/pricing, read
 * 2026-09-28. USD per million tokens:
 *
 *   model              base input   5m cache write   1h cache write   cache read   output
 *   Claude Opus 5.5    $4           $5               $8               $0.20        $20
 *   Claude Opus 5      $5           $6.25            $10              $0.50        $25
 *   Claude Sonnet 5    $2           $2.50            $4               $0.20        $10
 *   Claude Haiku 4.5   $1           $1.25            $2               $0.10        $5
 *
 * The same page: a 5-minute write is 1.25x base input, a 1-hour write 2x, a
 * cache read 0.1x (0.05x on Opus 5.5). Sonnet 5's $2 / $10 "is now the
 * standard price". Web search is $10 per 1,000 searches; web fetch carries no
 * charge beyond its tokens. Batch halves input and output (this runner does
 * not use Batch). Claude 4.6 and later run the full 1M window at these rates.
 *
 * Why this file exists: the SDK's `total_cost_usd` is a client-side estimate
 * from a price table bundled into the SDK at build time. SDK 0.2.126 priced
 * every cache write at the 5-minute rate and priced `claude-sonnet-5` at Opus 5
 * rates (docs/cost/2026-09-27-cost-levers.md §4). The ledger keeps the SDK's
 * figure as `costUsdSdk` and uses this one as `costUsd` / `costUsdList`.
 *
 * When a price changes, edit RATES and the table above together, with the date
 * you read the page.
 */

export const PRICES_READ_ON = '2026-09-28';

/** USD per million tokens. */
export interface Rates {
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
}

const RATES: Record<string, Rates> = {
  'claude-opus-5-5':  { input: 4, cacheWrite5m: 5,    cacheWrite1h: 8,  cacheRead: 0.20, output: 20 },
  'claude-opus-5':    { input: 5, cacheWrite5m: 6.25, cacheWrite1h: 10, cacheRead: 0.50, output: 25 },
  'claude-sonnet-5':  { input: 2, cacheWrite5m: 2.50, cacheWrite1h: 4,  cacheRead: 0.20, output: 10 },
  'claude-haiku-4-5': { input: 1, cacheWrite5m: 1.25, cacheWrite1h: 2,  cacheRead: 0.10, output: 5 },
};

/** $10 per 1,000 searches (the web search server tool). */
export const WEB_SEARCH_USD_EACH = 10 / 1000;

/** One model's tokens for a run, with the cache writes split by TTL. */
export interface TokenSplit {
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
  webSearches?: number;
}

/**
 * The model's family ID, as RATES keys it: lower-cased, with a context suffix
 * (`[1m]`), a provider prefix (`us.anthropic.`), a version tail (`-v1:0`) and
 * a date snapshot (`-20251001`) removed, and `opus-5.5` spelled `opus-5-5`.
 * `claude-haiku-4-5-20251001` → `claude-haiku-4-5`; `claude-opus-5-5[1m]` → `claude-opus-5-5`.
 */
export function canonicalModel(id: string): string {
  return id
    .trim()
    .toLowerCase()
    .replace(/\[[^\]]*\]$/, '')
    .replace(/^(?:[a-z]{2,6}\.)?anthropic\./, '')
    .replace(/-v\d+(?::\d+)?$/, '')
    .replace(/-\d{8}$/, '')
    .replace(/^claude-opus-5\.5/, 'claude-opus-5-5');
}

/** The list rates for a model ID, or null when the model is not in the table. */
export function ratesFor(id: string): Rates | null {
  return RATES[canonicalModel(id)] ?? null;
}

/** Dollars at list price for one model's tokens, or null for a model the table does not know. */
export function listCostUsd(id: string, t: TokenSplit): number | null {
  const r = ratesFor(id);
  if (!r) return null;
  const tokens =
    t.input * r.input +
    t.cacheWrite5m * r.cacheWrite5m +
    t.cacheWrite1h * r.cacheWrite1h +
    t.cacheRead * r.cacheRead +
    t.output * r.output;
  return tokens / 1_000_000 + (t.webSearches ?? 0) * WEB_SEARCH_USD_EACH;
}
