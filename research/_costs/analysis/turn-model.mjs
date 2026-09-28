import { readFileSync } from 'node:fs';
const rows = readFileSync('research/_costs/ledger.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l));
const by = {};
for (const r of rows) { const k = r.agent; (by[k] ??= []).push(r); }
console.log('agent | model | avg turns | avg ctx/turn (cacheRead/turns) | avg new tokens/turn (cacheWrite/turns) | avg out/turn | $/turn | min/turn');
for (const [k, rs] of Object.entries(by)) {
  const n = rs.length, s = f => rs.reduce((a, r) => a + f(r), 0) / n;
  const turns = s(r => r.turns), cr = s(r => r.cacheReadTokens), cw = s(r => r.cacheWriteTokens), out = s(r => r.outputTokens), cost = s(r => r.costUsd), ms = s(r => r.durationMs);
  console.log(`${k} | ${rs[0].model} | ${turns.toFixed(0)} | ${(cr/turns/1000).toFixed(0)}k | ${(cw/turns/1000).toFixed(1)}k | ${(out/turns).toFixed(0)} | $${(cost/turns).toFixed(3)} | ${(ms/turns/1000).toFixed(0)}s`);
}
// per-issue totals for a full v2 sequence: research + composer + drafter + panel×2 + stylist + verifier (+ discovery/desk)
const avg = a => { const rs = by[a]; return rs.reduce((x, r) => x + r.costUsd, 0) / rs.length; };
const seq = avg('researcher') + avg('composer') + avg('drafter') + 2*avg('reader-panel') + avg('stylist') + avg('verifier');
console.log('\nper-issue (research→verify, panel twice):', seq.toFixed(2), '+ discovery per desk', avg('discovery').toFixed(2), '=', (seq+avg('discovery')).toFixed(2));
const mins = a => { const rs = by[a]; return rs.reduce((x, r) => x + r.durationMs, 0) / rs.length / 60000; };
console.log('agent-minutes per issue:', (mins('researcher')+mins('composer')+mins('drafter')+2*mins('reader-panel')+mins('stylist')+mins('verifier')).toFixed(0), '+ discovery', mins('discovery').toFixed(0));
