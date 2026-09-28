// Analyse a Claude Code transcript: per-API-call usage, TTL split, what each call appended,
// and a read-weighted attribution of cache reads to content categories.
// Usage: node analyze.mjs <transcript.jsonl> [--calls]
import { readFileSync } from 'fs';

const file = process.argv[2];
const showCalls = process.argv.includes('--calls');
const entries = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));

const toolNameById = new Map();
const calls = [];            // unique API calls in order (main chain only)
const seen = new Set();
let pending = {};            // chars appended since the previous call, by category
let compactions = [];
const toolCalls = {};
const resultChars = {};
const attachChars = {};
const models = {};
const add = (cat, n) => { pending[cat] = (pending[cat] ?? 0) + n; };

for (const o of entries) {
  if (o.isSidechain && !process.argv.includes("--side")) continue;
  if (o.type === 'system' && o.subtype === 'compact_boundary') {
    compactions.push({ atCall: calls.length, ...o.compactMetadata });
    add('COMPACT_BOUNDARY', 0);
    continue;
  }
  if (o.type === 'attachment') {
    const t = o.attachment?.type ?? '?';
    const n = JSON.stringify(o.attachment).length;
    attachChars[t] = (attachChars[t] ?? 0) + n;
    add('attach:' + t, n);
    continue;
  }
  if (o.type === 'assistant') {
    const m = o.message;
    if (!seen.has(m.id)) {
      seen.add(m.id);
      const u = m.usage ?? {};
      models[m.model] = (models[m.model] ?? 0) + 1;
      calls.push({
        j: calls.length + 1, id: m.id, model: m.model,
        in: u.input_tokens ?? 0, cw: u.cache_creation_input_tokens ?? 0, cr: u.cache_read_input_tokens ?? 0,
        out: u.output_tokens ?? 0,
        w5: u.cache_creation?.ephemeral_5m_input_tokens ?? 0, w1: u.cache_creation?.ephemeral_1h_input_tokens ?? 0,
        ws: u.server_tool_use?.web_search_requests ?? 0, wf: u.server_tool_use?.web_fetch_requests ?? 0,
        appendedBefore: pending,
      });
      pending = {};
    }
    for (const b of m.content ?? []) {
      if (b.type === 'tool_use') {
        toolNameById.set(b.id, b.name);
        toolCalls[b.name] = (toolCalls[b.name] ?? 0) + 1;
        add('asst:tool_use:' + b.name, JSON.stringify(b.input ?? {}).length);
      } else if (b.type === 'text') add('asst:text', b.text.length);
      else if (b.type === 'thinking') add('asst:thinking(sig)', (b.signature ?? '').length);
    }
    continue;
  }
  if (o.type === 'user') {
    const c = o.message?.content;
    if (typeof c === 'string') { add('user:text', c.length); continue; }
    for (const b of c ?? []) {
      if (b.type === 'tool_result') {
        const name = toolNameById.get(b.tool_use_id) ?? '?';
        const n = typeof b.content === 'string' ? b.content.length : JSON.stringify(b.content ?? '').length;
        resultChars[name] = (resultChars[name] ?? 0) + n;
        add('result:' + name, n);
      } else if (b.type === 'text') add('user:text', b.text.length);
      else add('user:' + b.type, JSON.stringify(b).length);
    }
  }
}

const sum = k => calls.reduce((s, c) => s + c[k], 0);
const tot = { calls: calls.length, in: sum('in'), cw: sum('cw'), w5: sum('w5'), w1: sum('w1'), cr: sum('cr'), out: sum('out'), ws: sum('ws'), wf: sum('wf') };
console.log('FILE', file.split('/').pop());
console.log('models', models);
console.log('totals', tot);
console.log('first call prompt tokens', calls[0] ? calls[0].in + calls[0].cw + calls[0].cr : 0, 'first-call write', calls[0]?.cw);
console.log('compactions', compactions);
console.log('tool calls', toolCalls);
console.log('tool_result chars', resultChars, 'total', Object.values(resultChars).reduce((a, b) => a + b, 0));
console.log('attachment chars', attachChars);

// Read-weighted attribution. Each category appended before call j is re-read by every later call
// until the next compaction. Weight = chars x (number of later calls that include it).
const compactAt = compactions.map(c => c.atCall).sort((a, b) => a - b); // appended before call index (0-based count)
const weighted = {}; const raw = {};
for (let i = 0; i < calls.length; i++) {
  // content appended before call i+1 (1-based j = i+1) is included in calls i+1 .. end, until a compaction after it
  const nextCompact = compactAt.find(a => a > i);   // compaction recorded when calls.length === a
  const lastIdx = nextCompact !== undefined ? nextCompact : calls.length; // exclusive
  const reads = Math.max(0, lastIdx - (i + 1)); // later calls that re-read it (the call itself writes it)
  for (const [cat, n] of Object.entries(calls[i].appendedBefore)) {
    const key = cat.startsWith('result:') ? cat : cat.startsWith('asst:tool_use:') ? 'asst:tool_use:' + (cat.endsWith('Write') || cat.endsWith('Edit') ? cat.split(':').pop() : 'other') : cat;
    weighted[key] = (weighted[key] ?? 0) + n * reads;
    raw[key] = (raw[key] ?? 0) + n;
  }
}
const wsum = Object.values(weighted).reduce((a, b) => a + b, 0);
const rows = Object.entries(weighted).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ category: k, rawChars: raw[k], readWeightedChars: v, shareOfAppendedReads: (100 * v / wsum).toFixed(1) + '%' }));
console.table(rows);

// Prefix share of cache reads: the first call's prompt (system + tools + first user message + attachments before it)
// is re-read by every later call (until compaction replaces the history, but the system+tools part survives).
const P = calls[0] ? calls[0].in + calls[0].cw + calls[0].cr : 0;
console.log('prefix tokens (call 1 prompt)', P, 'x', calls.length - 1, 'later calls =', P * (calls.length - 1), 'of total reads', tot.cr, '=', (100 * P * (calls.length - 1) / tot.cr).toFixed(1) + '%');

if (showCalls) {
  console.log('\nj  prompt  cw(1h/5m)  cr  out  appended-chars');
  let prev = 0;
  for (const c of calls) {
    const prompt = c.in + c.cw + c.cr;
    const app = Object.entries(c.appendedBefore).map(([k, v]) => `${k}=${v}`).join(' ');
    console.log(`${c.j} ${prompt} (+${prompt - prev}) w1h=${c.w1} w5m=${c.w5} cr=${c.cr} out=${c.out} | ${app}`);
    prev = prompt;
  }
}
