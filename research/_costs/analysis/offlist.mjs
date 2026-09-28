// Count tool calls to tools that are NOT in the agent's frontmatter `tools:` list, per phase.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const LISTS = {
  discover: ['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Write'],
  research: ['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Write', 'Edit'],
  storyboard: ['Read', 'Glob', 'Grep', 'Write'],
  draft: ['Read', 'Glob', 'Grep', 'Write'],
  panel: ['Read', 'Glob', 'Grep', 'Write'],
  stylist: ['Read', 'Glob', 'Grep', 'Edit', 'Write'],
  verify: ['Read', 'Glob', 'Grep', 'Write'],
};
const phaseOf = t => /^Run discovery/.test(t) ? 'discover' : /^Run research/.test(t) ? 'research' : /^Write the storyboard/.test(t) ? 'storyboard'
  : /^Write a complete draft/.test(t) ? 'draft' : /^Read this draft as the four/.test(t) ? 'panel' : /^Bring this Parallax/.test(t) ? 'stylist' : /^Audit this draft/.test(t) ? 'verify' : null;
const agg = {};
for (const f of readdirSync(DIR).filter(f => f.endsWith('.jsonl'))) {
  const p = join(DIR, f); if (statSync(p).size > 5e6) continue;
  const es = readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }).filter(o => !o.isSidechain);
  const fu = es.find(o => o.type === 'user'); const c = fu?.message?.content;
  const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text).join(' ') : '';
  const phase = phaseOf(text); if (!phase) continue;
  const a = (agg[phase] ??= { runs: 0, off: {} }); a.runs++;
  const results = new Map();
  for (const o of es) if (o.type === 'user' && Array.isArray(o.message?.content)) for (const b of o.message.content) if (b.type === 'tool_result') results.set(b.tool_use_id, b);
  for (const o of es) if (o.type === 'assistant') for (const b of o.message.content ?? []) {
    if (b.type !== 'tool_use' || LISTS[phase].includes(b.name)) continue;
    const r = results.get(b.id); const denied = r && (r.is_error || /permission|denied|not allowed/i.test(JSON.stringify(r.content ?? '')));
    const key = b.name + (denied ? ' (denied)' : '');
    a.off[key] = (a.off[key] ?? 0) + 1;
  }
}
for (const [p, a] of Object.entries(agg)) console.log(p.padEnd(11), 'runs', a.runs, JSON.stringify(a.off));
