// Cost of API calls whose every tool call touches .claude/agent-memory/ (memory upkeep), per run, at 5m list prices.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const R = { 'claude-opus-5': { in: 5, w: 6.25, r: 0.5, o: 25 }, 'claude-sonnet-5': { in: 2, w: 2.5, r: 0.2, o: 10 } };
const phaseOf = t => /^Run discovery/.test(t) ? 'discover' : /^Run research/.test(t) ? 'research' : /^Write the storyboard/.test(t) ? 'storyboard'
  : /^Write a complete draft/.test(t) ? 'draft' : /^Read this draft as the four/.test(t) ? 'panel' : /^Bring this Parallax/.test(t) ? 'stylist' : /^Audit this draft/.test(t) ? 'verify' : null;
const agg = {};
for (const f of readdirSync(DIR).filter(f => f.endsWith('.jsonl'))) {
  const p = join(DIR, f); if (statSync(p).size > 5e6) continue;
  const es = readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }).filter(o => !o.isSidechain);
  const fu = es.find(o => o.type === 'user'); const c = fu?.message?.content;
  const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text).join(' ') : '';
  const phase = phaseOf(text); if (!phase) continue;
  const calls = new Map(); // id -> {usage, model, tools:[]}
  for (const o of es) if (o.type === 'assistant') {
    const m = o.message; if (!calls.has(m.id)) calls.set(m.id, { u: m.usage ?? {}, model: m.model, tools: [] });
    for (const b of m.content ?? []) if (b.type === 'tool_use') calls.get(m.id).tools.push(b);
  }
  let memOnly = 0, cost = 0, n = 0;
  for (const { u, model, tools } of calls.values()) {
    n++;
    if (!tools.length) continue;
    const allMem = tools.every(t => /agent-memory/.test(JSON.stringify(t.input ?? {})));
    if (!allMem) continue;
    memOnly++;
    const k = R[model] ?? R['claude-opus-5'];
    cost += ((u.input_tokens ?? 0) * k.in + (u.cache_creation_input_tokens ?? 0) * k.w + (u.cache_read_input_tokens ?? 0) * k.r + (u.output_tokens ?? 0) * k.o) / 1e6;
  }
  const a = (agg[phase] ??= { runs: 0, calls: 0, memOnly: 0, cost: 0 });
  a.runs++; a.calls += n; a.memOnly += memOnly; a.cost += cost;
}
for (const [p, a] of Object.entries(agg)) console.log(p.padEnd(11), 'runs', a.runs, 'avg calls', (a.calls / a.runs).toFixed(1), 'memory-only calls/run', (a.memOnly / a.runs).toFixed(1), 'their cost/run $', (a.cost / a.runs).toFixed(2));
