// Per-run attribution of cache-read tokens to content categories, from Claude Code transcripts.
// Method: prompt(j) = in + cache_write + cache_read of API call j. Growth between calls is the
// previous call's output (carried: thinking + tool_use + text) plus appended tool results/attachments,
// apportioned by characters. Each attributed block is re-read by every later call until the next
// compaction. The first call's prompt is the fixed prefix (tools + system + CLAUDE.md + listings + prompt).
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const RATES = {
  'claude-opus-5':   { in: 5, w5: 6.25, w1: 10, r: 0.50, o: 25 },
  'claude-sonnet-5': { in: 2, w5: 2.50, w1: 4,  r: 0.20, o: 10 },
};

function phaseOf(text) {
  if (/^Run discovery/.test(text)) return 'discover';
  if (/^Run research/.test(text)) return 'research';
  if (/^Write the storyboard/.test(text)) return 'storyboard';
  if (/^Write a complete draft/.test(text)) return 'draft';
  if (/^Read this draft as the four reader/.test(text)) return 'panel';
  if (/^Bring this Parallax issue/.test(text)) return 'stylist';
  if (/^Audit this draft issue/.test(text)) return 'verify';
  return null;
}
function readCat(path) {
  const p = String(path ?? '').replace(/\\/g, '/');
  if (/agent-memory\//.test(p)) return 'read:agent-memory';
  if (/research\/(politics|space|earth|tech|travel|sports)\//.test(p) || /src\/content\/issues\/\d{4}/.test(p)) return 'read:payload';
  if (/\.claude\/projects\//.test(p)) return 'read:saved-tool-result';
  return 'read:reference';
}

function analyse(file) {
  const entries = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } });
  const firstUser = entries.find(o => o.type === 'user' && !o.isSidechain);
  const c0 = firstUser?.message?.content;
  const text = typeof c0 === 'string' ? c0 : Array.isArray(c0) ? c0.filter(b => b.type === 'text').map(b => b.text).join(' ') : '';
  const phase = phaseOf(text);
  if (!phase) return null;

  const calls = []; const seen = new Set(); const toolById = new Map();
  let pend = { chars: {}, compact: false }; let lastOut = null; const asstChars = { write: 0, other: 0 };
  let memCalls = 0, webFetch = 0, webSearch = 0, agentCalls = 0;
  const flushAsst = () => {};
  for (const o of entries) {
    if (o.isSidechain) continue;
    if (o.type === 'system' && o.subtype === 'compact_boundary') { pend.compact = true; continue; }
    if (o.type === 'attachment') {
      const t = o.attachment?.type ?? '?';
      const k = t === 'nested_memory' ? 'nested-memory' : 'attachments';
      pend.chars[k] = (pend.chars[k] ?? 0) + JSON.stringify(o.attachment).length;
      continue;
    }
    if (o.type === 'assistant') {
      const m = o.message;
      if (!seen.has(m.id)) {
        seen.add(m.id);
        const u = m.usage ?? {};
        calls.push({ model: m.model, in: u.input_tokens ?? 0, cw: u.cache_creation_input_tokens ?? 0, cr: u.cache_read_input_tokens ?? 0,
          out: u.output_tokens ?? 0, w1: u.cache_creation?.ephemeral_1h_input_tokens ?? 0, w5: u.cache_creation?.ephemeral_5m_input_tokens ?? 0,
          appended: pend, asst: { write: 0, other: 0 } });
        pend = { chars: {}, compact: false };
      }
      const cur = calls[calls.length - 1];
      for (const b of m.content ?? []) {
        if (b.type === 'tool_use') {
          toolById.set(b.id, b);
          const n = JSON.stringify(b.input ?? {}).length;
          if (b.name === 'Write' || b.name === 'Edit') cur.asst.write += n; else cur.asst.other += n;
          const fp = String(b.input?.file_path ?? '');
          if (/agent-memory/.test(fp)) memCalls++;
          if (b.name === 'WebFetch') webFetch++;
          if (b.name === 'WebSearch') webSearch++;
          if (b.name === 'Agent' || b.name === 'Task') agentCalls++;
        } else if (b.type === 'text') cur.asst.other += b.text.length;
      }
      continue;
    }
    if (o.type === 'user') {
      const c = o.message?.content;
      if (typeof c === 'string') { pend.chars['user-text'] = (pend.chars['user-text'] ?? 0) + c.length; continue; }
      for (const b of c ?? []) {
        if (b.type === 'tool_result') {
          const t = toolById.get(b.tool_use_id);
          const n = typeof b.content === 'string' ? b.content.length : JSON.stringify(b.content ?? '').length;
          let k = 'result:other';
          if (t?.name === 'WebFetch') k = 'result:web'; else if (t?.name === 'WebSearch') k = 'result:web';
          else if (t?.name === 'Read') k = readCat(t.input?.file_path);
          else if (t?.name === 'Grep' || t?.name === 'Glob') k = 'result:grep-glob';
          else if (t?.name && /rag/.test(t.name)) k = 'result:rag';
          pend.chars[k] = (pend.chars[k] ?? 0) + n;
        } else if (b.type === 'text') pend.chars['user-text'] = (pend.chars['user-text'] ?? 0) + b.text.length;
      }
    }
  }
  if (!calls.length) return null;
  const model = calls.find(c => RATES[c.model])?.model ?? 'claude-opus-5';
  const prompt = c => c.in + c.cw + c.cr;
  const P1 = prompt(calls[0]);

  // attribute tokens appended before each call
  const blocks = []; // {cat, tokens, at: call index (0-based) that first carries it}
  blocks.push({ cat: 'fixed-prefix', tokens: P1, at: 0 });
  let busts = 0, bustTokens = 0;
  for (let j = 1; j < calls.length; j++) {
    const c = calls[j], prev = calls[j - 1];
    const a = c.appended;
    if (a.compact) {
      const base = prompt(c);
      blocks.push({ cat: 'fixed-prefix', tokens: Math.min(base, P1), at: j });
      if (base > P1) blocks.push({ cat: 'compaction-summary+files', tokens: base - P1, at: j });
      continue;
    }
    const G = prompt(c) - prompt(prev);
    // model output of prev call, carried in context: split visible write/other vs thinking by chars (~2.6 chars/token visible)
    const out = prev.out;
    const visWrite = Math.min(out, prev.asst.write / 2.6), visOther = Math.min(out - visWrite, prev.asst.other / 2.6);
    const think = Math.max(0, out - visWrite - visOther);
    const carried = Math.min(Math.max(G, 0), out);
    const scale = out > 0 ? carried / out : 0;
    blocks.push({ cat: 'model-output:thinking', tokens: think * scale, at: j });
    blocks.push({ cat: 'model-output:own-writes', tokens: visWrite * scale, at: j });
    blocks.push({ cat: 'model-output:tool-calls+text', tokens: visOther * scale, at: j });
    const R = Math.max(0, G - carried);
    const totChars = Object.values(a.chars).reduce((s, v) => s + v, 0);
    for (const [k, v] of Object.entries(a.chars)) blocks.push({ cat: k, tokens: totChars ? R * v / totChars : 0, at: j });
    if (c.cr < prompt(prev) * 0.5) { busts++; bustTokens += c.cw - Math.max(G, 0); }
  }
  // compaction positions
  const compactAt = calls.map((c, i) => (c.appended.compact ? i : -1)).filter(i => i > 0);
  const reads = {};
  for (const b of blocks) {
    const next = compactAt.find(i => i > b.at);
    const end = next ?? calls.length;
    const n = Math.max(0, end - b.at - 1);
    reads[b.cat] = (reads[b.cat] ?? 0) + b.tokens * n;
  }
  const sum = k => calls.reduce((s, c) => s + c[k], 0);
  const k = RATES[model];
  const W = sum('cw'), Rr = sum('cr'), O = sum('out'), I = sum('in');
  return {
    file: file.split('/').pop().slice(0, 8), phase, model, calls: calls.length, P1,
    W, W1h: sum('w1'), W5m: sum('w5'), R: Rr, O, I, compactions: compactAt.length, busts, bustTokens: Math.round(bustTokens),
    memCalls, webFetch, webSearch, agentCalls,
    cost5m: (I * k.in + W * k.w5 + Rr * k.r + O * k.o) / 1e6,
    cost1h: (I * k.in + W * k.w1 + Rr * k.r + O * k.o) / 1e6,
    reads,
  };
}

const files = readdirSync(DIR).filter(f => f.endsWith('.jsonl')).map(f => join(DIR, f)).filter(p => statSync(p).size < 5e6);
const runs = files.map(analyse).filter(Boolean).filter(r => r.calls > 1);
const byPhase = {};
for (const r of runs) (byPhase[r.phase] ??= []).push(r);
const order = ['discover', 'research', 'storyboard', 'draft', 'panel', 'stylist', 'verify'];
const summary = [];
const attribution = {};
for (const p of order) {
  const rs = byPhase[p] ?? []; if (!rs.length) continue;
  const avg = key => rs.reduce((s, r) => s + r[key], 0) / rs.length;
  summary.push({ phase: p, runs: rs.length, calls: avg('calls').toFixed(1), P1: Math.round(avg('P1')), W: Math.round(avg('W')), R: Math.round(avg('R')), O: Math.round(avg('O')),
    compactions: avg('compactions').toFixed(1), busts: avg('busts').toFixed(1), bustTok: Math.round(avg('bustTokens')), memCalls: avg('memCalls').toFixed(1),
    webFetch: avg('webFetch').toFixed(1), webSearch: avg('webSearch').toFixed(1), agent: avg('agentCalls').toFixed(1),
    cost5m: avg('cost5m').toFixed(2), cost1h: avg('cost1h').toFixed(2) });
  const tot = {}; let all = 0;
  for (const r of rs) for (const [c, v] of Object.entries(r.reads)) { tot[c] = (tot[c] ?? 0) + v; all += v; }
  const measured = rs.reduce((s, r) => s + r.R, 0);
  attribution[p] = Object.fromEntries(Object.entries(tot).sort((a, b) => b[1] - a[1]).map(([c, v]) => [c, `${(100 * v / all).toFixed(1)}%`]));
  attribution[p]['(model/measured reads)'] = `${(all / measured).toFixed(2)}`;
}
console.table(summary);
for (const [p, a] of Object.entries(attribution)) { console.log('\n' + p); console.log(a); }
if (process.argv.includes('--runs')) console.table(runs.map(({ reads, ...r }) => ({ ...r, cost5m: r.cost5m.toFixed(2), cost1h: r.cost1h.toFixed(2) })));
