// Start-to-start gaps between consecutive API requests in each pipeline transcript.
// Request j+1 starts when the last entry before its first assistant block was written
// (the tool_result / attachment that closed request j). Gaps over 300 s would expire a 5-minute cache.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const phaseOf = t => /^Run discovery/.test(t) ? 'discover' : /^Run research/.test(t) ? 'research' : /^Write the storyboard/.test(t) ? 'storyboard'
  : /^Write a complete draft/.test(t) ? 'draft' : /^Read this draft as the four/.test(t) ? 'panel' : /^Bring this Parallax/.test(t) ? 'stylist' : /^Audit this draft/.test(t) ? 'verify' : null;
const out = [];
for (const f of readdirSync(DIR).filter(f => f.endsWith('.jsonl'))) {
  const p = join(DIR, f); if (statSync(p).size > 5e6) continue;
  const es = readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }).filter(o => !o.isSidechain);
  const fu = es.find(o => o.type === 'user'); const c = fu?.message?.content;
  const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text).join(' ') : '';
  const phase = phaseOf(text); if (!phase) continue;
  const seen = new Set(); const starts = []; const outs = []; let lastT = null;
  for (const o of es) {
    if (o.type === 'assistant') {
      if (!seen.has(o.message.id)) { seen.add(o.message.id); starts.push(lastT ?? o.timestamp); outs.push(o.message.usage?.output_tokens ?? 0); }
    } else if (o.timestamp) lastT = o.timestamp;
  }
  const gaps = [];
  for (let i = 1; i < starts.length; i++) gaps.push({ g: (Date.parse(starts[i]) - Date.parse(starts[i - 1])) / 1000, outPrev: outs[i - 1] });
  const over = gaps.filter(x => x.g > 300);
  const g = gaps.map(x => x.g).sort((a, b) => a - b);
  out.push({ file: f.slice(0, 8), phase, calls: starts.length, medianGap: g.length ? g[Math.floor(g.length / 2)].toFixed(0) : '-', maxGap: g.length ? g[g.length - 1].toFixed(0) : '-',
    over300: over.length, over300detail: over.map(x => `${x.g.toFixed(0)}s/out${x.outPrev}`).join(' ') });
}
out.sort((a, b) => a.phase.localeCompare(b.phase));
console.table(out);
