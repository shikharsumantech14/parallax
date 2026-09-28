// Fit each ledger row against list prices under 5-minute vs 1-hour cache writes.
// Rates: https://platform.claude.com/docs/en/about-claude/pricing (fetched 2026-09-27)
import { readFileSync } from 'fs';

const RATES = {
  'claude-opus-5':   { in: 5, w5: 6.25, w1: 10, r: 0.50, o: 25 },
  'claude-sonnet-5': { in: 2, w5: 2.50, w1: 4,  r: 0.20, o: 10 },
};
const SEARCH = 10 / 1000; // $ per search

const rows = readFileSync('D:/SideProjects/parallax/research/_costs/ledger.jsonl', 'utf8')
  .split('\n').filter(Boolean).map(l => JSON.parse(l));

const M = 1e6;
const out = [];
for (const r of rows) {
  const k = RATES[r.model];
  const inC = r.inputTokens * k.in / M;
  const wr5 = r.cacheWriteTokens * k.w5 / M;
  const wr1 = r.cacheWriteTokens * k.w1 / M;
  const rd  = r.cacheReadTokens * k.r / M;
  const op  = r.outputTokens * k.o / M;
  const ws  = (r.webSearches ?? 0) * SEARCH;
  const c5 = inC + wr5 + rd + op + ws;
  const c1 = inC + wr1 + rd + op + ws;
  // implied share of writes at the 1h rate
  const f = (r.costUsd - c5) / (r.cacheWriteTokens * (k.w1 - k.w5) / M);
  out.push({
    n: rows.indexOf(r) + 1, agent: r.agent, cat: r.category, model: r.model.replace('claude-', ''),
    cost: r.costUsd.toFixed(3), c5m: c5.toFixed(3), c1h: c1.toFixed(3),
    f1h: r.costUsd > 0 ? f.toFixed(2) : 'n/a',
    resid1h: r.costUsd > 0 ? (r.costUsd - c1).toFixed(3) : 'n/a',
    fetches: r.webFetches ?? '-', searches: r.webSearches ?? 0,
    billed: r.billedTo ? 'sub(explicit)' : 'sub(pre-fix)',
  });
}
console.table(out);

// Per-agent averages over successful, costed rows
const byAgent = {};
for (const r of rows) {
  if (!(r.costUsd > 0)) continue;
  const a = (byAgent[r.agent] ??= { n: 0, cost: 0, w: 0, rd: 0, o: 0, in: 0, turns: 0, ms: 0, ws: 0, wf: 0, model: r.model });
  a.n++; a.cost += r.costUsd; a.w += r.cacheWriteTokens; a.rd += r.cacheReadTokens; a.o += r.outputTokens;
  a.in += r.inputTokens; a.turns += r.turns; a.ms += r.durationMs; a.ws += r.webSearches ?? 0; a.wf += r.webFetches ?? 0;
}
const avg = [];
for (const [agent, a] of Object.entries(byAgent)) {
  const k = RATES[a.model];
  const w = a.w / a.n, rd = a.rd / a.n, o = a.o / a.n, ws = a.ws / a.n;
  const c5 = (w * k.w5 + rd * k.r + o * k.o) / M + ws * SEARCH;
  const c1 = (w * k.w1 + rd * k.r + o * k.o) / M + ws * SEARCH;
  avg.push({
    agent, n: a.n, avgCost: (a.cost / a.n).toFixed(2),
    w: Math.round(w), rd: Math.round(rd), o: Math.round(o), turns: (a.turns / a.n).toFixed(1),
    min: (a.ms / a.n / 60000).toFixed(1), ws: ws.toFixed(1), wf: (a.wf / a.n).toFixed(1),
    split5m: `W ${(w * k.w5 / M).toFixed(2)} | R ${(rd * k.r / M).toFixed(2)} | O ${(o * k.o / M).toFixed(2)} | S ${(ws * SEARCH).toFixed(2)} = ${c5.toFixed(2)}`,
    split1h: `W ${(w * k.w1 / M).toFixed(2)} | R ${(rd * k.r / M).toFixed(2)} | O ${(o * k.o / M).toFixed(2)} | S ${(ws * SEARCH).toFixed(2)} = ${c1.toFixed(2)}`,
  });
}
console.table(avg);
