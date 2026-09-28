// Output throughput per model from request generation times (start = last non-assistant entry before the
// request's first block, end = its last block), for requests with large outputs.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const T = s => Date.parse(s) / 1000;
const rows = { 'claude-opus-5': [], 'claude-sonnet-5': [] };
for (const f of readdirSync(DIR).filter(f => f.endsWith('.jsonl'))) {
  const p = join(DIR, f); if (statSync(p).size > 5e6) continue;
  const es = readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }).filter(o => !o.isSidechain);
  const fu = es.find(o => o.type === 'user'); const c = fu?.message?.content;
  const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text).join(' ') : '';
  if (!/^(Run discovery|Run research|Write the storyboard|Write a complete draft|Read this draft|Bring this Parallax|Audit this draft)/.test(text)) continue;
  const reqs = new Map(); let last = null;
  for (const o of es) {
    if (o.type === 'assistant') {
      const m = o.message; let r = reqs.get(m.id);
      if (!r) { r = { start: last, end: o.timestamp, out: m.usage?.output_tokens ?? 0, model: m.model }; reqs.set(m.id, r); }
      r.end = o.timestamp;
    } else if (o.timestamp) last = o.timestamp;
  }
  for (const r of reqs.values()) {
    if (!rows[r.model] || !r.start) continue;
    const gen = T(r.end) - T(r.start);
    if (r.out >= 8000 && gen > 20) rows[r.model].push({ out: r.out, gen, tps: r.out / gen });
  }
}
for (const [m, rs] of Object.entries(rows)) {
  rs.sort((a, b) => a.tps - b.tps);
  const tot = rs.reduce((s, r) => ({ out: s.out + r.out, gen: s.gen + r.gen }), { out: 0, gen: 0 });
  console.log(m, 'requests', rs.length, 'aggregate tok/s', (tot.out / tot.gen).toFixed(1), 'median', rs.length ? rs[Math.floor(rs.length / 2)].tps.toFixed(1) : '-',
    'p10', rs.length ? rs[Math.floor(rs.length * 0.1)].tps.toFixed(1) : '-', 'p90', rs.length ? rs[Math.floor(rs.length * 0.9)].tps.toFixed(1) : '-');
}
