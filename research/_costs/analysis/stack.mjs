// Stacked (deflated) lever path. Each step acts on what the previous steps left. 5m list prices.
const P = {
  opus5:  { in: 5, w: 6.25, r: 0.50, o: 25 },
  opus55: { in: 4, w: 5.00, r: 0.20, o: 20 },
  sonnet5:{ in: 2, w: 2.50, r: 0.20, o: 10 },
};
const M = 1e6;
const mk = (m, n, W, R, O, helpers, compaction, subagent, P1, sPre, sNest, sMem, comp, bust, mem$) =>
  ({ m, n, W, R, O, helpers, compaction, subagent, P1, sPre, sNest, sMem, comp, bust, mem$ });
const S = {
  discovery: mk('opus5', 1, 210438, 2005217, 27763, 0.49, 0.11, 0, 56475, .527, .098, 0, 0.17, 71307, 0),
  research:  mk('opus5', 1, 307835, 4058221, 52106, 1.26, 0.50, 0.37, 56768, .492, .084, 0, 1.0, 81092, 0),
  composer:  mk('opus5', 1, 239098, 2322305, 48289, 0, 0.48, 0, 56347, .511, .113, .065, 1.0, 0, 1.03),
  drafter:   mk('opus5', 1, 362122, 3933498, 54361, 0, 1.12, 0, 58500, .506, .108, .022, 2.0, 0, 0.59),
  panel:     mk('sonnet5', 2, 117144, 354391, 23691, 0, 0.01, 0, 54569, .607, .121, 0, 0.08, 0, 0),
  stylist:   mk('opus5', 1, 224525, 3139978, 43039, 0, 0.36, 0, 57109, .604, .084, .038, 1.0, 0, 0.71),
  verifier:  mk('opus5', 1, 214571, 2273264, 33298, 0, 0.42, 0, 58156, .503, .178, .050, 0.67, 0, 0.59),
};
const loops = ['discovery', 'research'], passes = ['composer', 'drafter', 'stylist', 'verifier'];
const cost = s => { const k = P[s.m]; return ((s.W * k.w + s.R * k.r + s.O * k.o) / M + s.helpers + s.compaction + s.subagent + (s.mem$ ?? 0) * 0) * s.n; };
// mem$ is already inside W/R/O (memory calls are part of the main loop); keep it for removal only.
const total = () => Object.values(S).reduce((a, s) => a + cost(s), 0);
const log = (label) => console.log(label.padEnd(58), total().toFixed(2));

log('0 baseline (API route, 5m, list)');
// 1. L10 + L11: no ToolSearch bust (bust tokens read instead of re-written); no unrequested subagent
for (const k of loops) { const s = S[k]; s.W -= s.bust; s.R += s.bust; s.subagent = 0; }
log('1 +L10 tool search off, +L11 Agent tool removed');
// 2. L5 realistic: first-call prefix -75% (~57k -> ~14k), nested CLAUDE.md/rules gone
for (const s of Object.values(S)) {
  const preR = s.R * s.sPre, nestR = s.R * s.sNest;
  s.R -= 0.75 * preR + nestR;
  s.W -= 0.75 * (s.P1 + s.comp * 37000) + 15000 * (1 + s.comp);
  s.mem$ *= (s.R / (s.R + 0.75 * preR + nestR)); // memory calls now re-read a smaller context
}
log('2 +L5 settingSources:[] + tool restriction (prefix -75%)');
// 3. L1: loops on Sonnet 5 (x0.4 on tokens, compaction, subagent; helpers unchanged)
for (const k of loops) { const s = S[k]; s.m = 'sonnet5'; s.compaction *= 0.4; }
log('3 +L1 discovery+research on Sonnet 5 (ruled 2026-09-21)');
// 4. L9: no in-run agent-memory upkeep (memory-only calls and memory-file reads)
for (const k of passes) { const s = S[k]; const k5 = P[s.m];
  const memCost = s.mem$ + s.R * s.sMem * k5.r / M;
  // remove as reads/writes proportionally (approximation: take it off R)
  s.R -= memCost * M / k5.r * 0.6; s.W -= memCost * M / k5.w * 0.4 * 0.25; }
log('4 +L9 no in-run agent-memory upkeep');
// 5. L4: loops batch parallel web calls: -40% API calls -> reads -40%, output -5%
for (const k of loops) { const s = S[k]; s.R *= 0.6; s.O *= 0.95; }
log('5 +L4 batched web calls in loops (-40% calls)');
const beforeEffort = total();
// 6. L3: effort medium on loops + panel: -13..-30% of those phases
const eff = ['discovery', 'research', 'panel'].reduce((a, k) => a + cost(S[k]), 0);
console.log('6 +L3 effort medium on loops+panel (range)'.padEnd(58), (beforeEffort - eff * 0.30).toFixed(2), '-', (beforeEffort - eff * 0.13).toFixed(2));
for (const k of ['discovery', 'research', 'panel']) { const s = S[k]; s.W *= 0.8; s.R *= 0.8; s.O *= 0.8; s.helpers *= 0.8; }
log('  (midpoint -20% used below)');
// 7a. L12: passes on Opus 5.5
const snap = JSON.parse(JSON.stringify(S));
for (const k of passes) { const s = S[k]; const r = (s.W * 5 + s.R * 0.2 + s.O * 20) / (s.W * 6.25 + s.R * 0.5 + s.O * 25); s.m = 'opus55'; s.compaction *= r; }
log('7a +L12 passes on Opus 5.5 (alternative to 7b)');
// 7b. L7: passes on Messages API + Batch (Opus 5): 2.89 per issue incl. 2 panels (panel already in loops set? no: panel is a pass)
Object.assign(S, JSON.parse(JSON.stringify(snap)));
const nonPass = ['discovery', 'research'].reduce((a, k) => a + cost(S[k]), 0);
console.log('7b +L7 passes+panel on Messages API + Batch (Opus 5 / Sonnet 5)'.padEnd(58), (nonPass + 2.89).toFixed(2), '| with Opus 5.5 passes:', (nonPass + 2.10 + 0.29).toFixed(2));
