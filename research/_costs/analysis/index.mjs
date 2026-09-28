// Index pipeline transcripts: identify phase/category from the first user prompt, and summarise usage.
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const dir = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const files = readdirSync(dir).filter(f => f.endsWith('.jsonl'));
const out = [];
for (const f of files) {
  const p = join(dir, f);
  if (statSync(p).size > 5e6) continue; // skip long interactive sessions
  const entries = readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } });
  const firstUser = entries.find(o => o.type === 'user' && !o.isSidechain);
  let text = '';
  const c = firstUser?.message?.content;
  if (typeof c === 'string') text = c; else if (Array.isArray(c)) text = c.filter(b => b.type === 'text').map(b => b.text).join(' ');
  let phase = '?';
  if (/^Run discovery/.test(text)) phase = 'discover';
  else if (/^Run research/.test(text)) phase = 'research';
  else if (/^Write the storyboard/.test(text)) phase = 'storyboard';
  else if (/^Write a complete draft/.test(text)) phase = 'draft';
  else if (/^Read this draft as the four reader/.test(text)) phase = 'panel';
  else if (/^Bring this Parallax issue/.test(text)) phase = 'stylist';
  else if (/^Audit this draft issue/.test(text)) phase = 'verify';
  if (phase === '?') continue;
  const cat = (text.match(/category \*\*(\w+)\*\*/) ?? text.match(/research\/(\w+)\//) ?? text.match(/issues\/\d{4}-\d{2}-\d{2}-([a-z0-9-]+)/) ?? [])[1] ?? '?';
  const seen = new Set(); let calls = 0, cw = 0, w5 = 0, w1 = 0, cr = 0, out_ = 0, inp = 0; const models = new Set();
  let compactions = 0, toolSearch = 0, misses = 0;
  for (const o of entries) {
    if (o.isSidechain) continue;
    if (o.type === 'system' && o.subtype === 'compact_boundary') compactions++;
    if (o.type !== 'assistant') continue;
    const m = o.message; if (seen.has(m.id)) continue; seen.add(m.id);
    const u = m.usage ?? {}; calls++; models.add(m.model);
    inp += u.input_tokens ?? 0; cw += u.cache_creation_input_tokens ?? 0; cr += u.cache_read_input_tokens ?? 0; out_ += u.output_tokens ?? 0;
    w5 += u.cache_creation?.ephemeral_5m_input_tokens ?? 0; w1 += u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
    if (calls > 1 && (u.cache_read_input_tokens ?? 0) === 0) misses++;
    for (const b of m.content ?? []) if (b.type === 'tool_use' && b.name === 'ToolSearch') toolSearch++;
  }
  const sub = join(dir, f.replace('.jsonl', ''), 'subagents');
  const subagents = existsSync(sub) ? readdirSync(sub).filter(x => x.endsWith('.jsonl')).length : 0;
  const t0 = entries.find(o => o.timestamp)?.timestamp ?? '';
  out.push({ file: f.slice(0, 8), t0: t0.slice(0, 16), phase, cat, models: [...models].join('|'), calls, cw, w1, w5, cr, out: out_, compactions, toolSearch, fullMisses: misses, subagents });
}
out.sort((a, b) => a.t0.localeCompare(b.t0));
console.table(out);
