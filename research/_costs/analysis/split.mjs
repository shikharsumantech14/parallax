// Per-request view of the six September research transcripts, for the sweep / judgment split.
// Usage: node split.mjs [--table] [--json out.json]
import { readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const DIR = 'C:/Users/user/.claude/projects/D--SideProjects-parallax';
const RUNS = [
  { cat: 'sports',   id: '59aab041-074c-40de-8643-afdb53d36a62', ledger: 5.84661225 },
  { cat: 'politics', id: '828bf7df-eb1e-4779-86f4-27c77732df40', ledger: 6.51530675 },
  { cat: 'tech',     id: 'd83fac63-282e-4449-bed4-7a08a0eede99', ledger: 6.0736575 },
  { cat: 'space',    id: '1786f13d-9a9e-4b77-8f11-2aaee7c49f9c', ledger: 6.93349925 },
  { cat: 'travel',   id: 'db3bff05-6543-467a-bef6-c4aac08806c9', ledger: 10.2359565 },
  { cat: 'earth',    id: 'c5c301ed-f965-40d0-b560-b57fafd93c21', ledger: 8.6490695 },
];
const showTable = process.argv.includes('--table');
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const T = s => Date.parse(s) / 1000;
const short = (s, n = 70) => String(s ?? '').replace(/\s+/g, ' ').slice(0, n);

function analyse(run) {
  const es = readFileSync(join(DIR, run.id + '.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(o => !o.isSidechain);
  const reqs = []; const byId = new Map(); const toolById = new Map();
  let pend = { chars: {}, nestedPaths: [], compact: null, lastT: null };
  let lastNonAsstT = null;
  for (const o of es) {
    if (o.type === 'system' && o.subtype === 'compact_boundary') { pend.compact = o.compactMetadata; pend.compactT = o.timestamp; }
    if (o.type === 'attachment') {
      const a = o.attachment ?? {};
      const k = a.type === 'nested_memory' ? 'nested' : 'attach:' + a.type;
      pend.chars[k] = (pend.chars[k] ?? 0) + JSON.stringify(a).length;
      if (a.type === 'nested_memory') pend.nestedPaths.push(String(a.path ?? ''));
    }
    if (o.type === 'assistant') {
      const m = o.message;
      let r = byId.get(m.id);
      if (!r) {
        const u = m.usage ?? {};
        r = { j: reqs.length + 1, id: m.id, start: lastNonAsstT, end: o.timestamp,
          in: u.input_tokens ?? 0, cw: u.cache_creation_input_tokens ?? 0, cr: u.cache_read_input_tokens ?? 0, out: u.output_tokens ?? 0,
          appended: pend, tools: [], text: '', thinkSig: 0, visChars: 0 };
        pend = { chars: {}, nestedPaths: [], compact: null };
        byId.set(m.id, r); reqs.push(r);
      }
      r.end = o.timestamp;
      for (const b of m.content ?? []) {
        if (b.type === 'tool_use') {
          const inp = b.input ?? {};
          const tc = { name: b.name, id: b.id, file: inp.file_path ?? inp.path ?? '', url: inp.url ?? '', query: inp.query ?? inp.pattern ?? '', content: inp.content ?? '', newStr: inp.new_string ?? '', oldStr: inp.old_string ?? '' };
          r.tools.push(tc); toolById.set(b.id, { tc, req: r.j });
          r.visChars += JSON.stringify(inp).length;
        } else if (b.type === 'text') { r.text += b.text + ' '; r.visChars += b.text.length; }
        else if (b.type === 'thinking') r.thinkSig += (b.signature ?? '').length;
      }
      continue;
    }
    if (o.timestamp) lastNonAsstT = o.timestamp;
    if (o.type === 'user') {
      const c = o.message?.content;
      if (typeof c === 'string') { pend.chars['user-text'] = (pend.chars['user-text'] ?? 0) + c.length; continue; }
      for (const b of c ?? []) {
        if (b.type === 'tool_result') {
          const t = toolById.get(b.tool_use_id);
          const n = typeof b.content === 'string' ? b.content.length : JSON.stringify(b.content ?? '').length;
          const name = t?.tc.name ?? '?';
          const k = 'result:' + name;
          pend.chars[k] = (pend.chars[k] ?? 0) + n;
          if (t) t.tc.resultChars = n;
        } else if (b.type === 'text') pend.chars['user-text'] = (pend.chars['user-text'] ?? 0) + b.text.length;
      }
    }
  }
  const N = reqs.length;
  const prompt = r => r.in + r.cw + r.cr;
  const P1 = prompt(reqs[0]);
  // first dossier Write
  const W = reqs.find(r => r.tools.some(t => t.name === 'Write' && /-dossier\.md$/.test(t.file)))?.j ?? null;
  const firstWrite = W ? reqs[W - 1].tools.find(t => t.name === 'Write' && /-dossier\.md$/.test(t.file)) : null;
  const compactBefore = reqs.filter(r => r.appended.compact).map(r => ({ before: r.j, ...r.appended.compact }));
  // bust: cache read fell below half of the previous prompt, not right after a compaction
  const busts = reqs.filter((r, i) => i > 0 && !r.appended.compact && r.cr < prompt(reqs[i - 1]) * 0.5).map(r => r.j);
  // web calls and categories
  const web = t => t.name === 'WebFetch' || t.name === 'WebSearch';
  const postW = W ? reqs.filter(r => r.j > W) : [];
  const postWebCalls = postW.reduce((s, r) => s + r.tools.filter(web).length, 0);
  const postFetch = postW.reduce((s, r) => s + r.tools.filter(t => t.name === 'WebFetch').length, 0);
  const postSearch = postW.reduce((s, r) => s + r.tools.filter(t => t.name === 'WebSearch').length, 0);
  const allWeb = reqs.reduce((s, r) => s + r.tools.filter(web).length, 0);
  // evidence pack: web result chars
  let fetchChars = 0, searchChars = 0, fetchN = 0, searchN = 0;
  for (const r of reqs) for (const t of r.tools) {
    if (t.name === 'WebFetch') { fetchChars += t.resultChars ?? 0; fetchN++; }
    if (t.name === 'WebSearch') { searchChars += t.resultChars ?? 0; searchN++; }
  }
  // durations
  for (let i = 0; i < N; i++) {
    const r = reqs[i];
    r.gen = r.start ? T(r.end) - T(r.start) : null;
    r.gapAfter = i + 1 < N && reqs[i + 1].start ? T(reqs[i + 1].start) - T(r.end) : null;
  }
  const wall = T(reqs[N - 1].end) - T(reqs[0].start);
  // classify each request
  for (const r of reqs) {
    const names = r.tools.map(t => t.name);
    let cls;
    if (W && r.j === W) cls = 'DRAFT-WRITE';
    else if (!W || r.j < W) cls = 'SWEEP';
    else if (r.tools.some(web)) cls = 'SWEEP-2';
    else cls = 'JUDGMENT';
    r.cls = cls;
    r.summary = r.tools.map(t => t.name + (t.file ? ':' + t.file.replace(/^.*[\\/]/, '') : t.url ? ':' + short(t.url, 40) : t.query ? ':' + short(t.query, 30) : '')).join(' | ');
  }
  // dossier on disk
  let finalDossierChars = null;
  if (firstWrite) { try { finalDossierChars = statSync(firstWrite.file).size; } catch { finalDossierChars = null; } }
  // §1 of the first write
  let sec1Chars = null;
  if (firstWrite?.content) {
    const m = firstWrite.content.match(/\n##\s*1[.\s][\s\S]*?(?=\n##\s*2[.\s])/);
    sec1Chars = m ? m[0].length : null;
  }
  return { run, N, P1, W, firstWriteChars: firstWrite?.content?.length ?? null, sec1Chars, finalDossierChars, compactBefore, busts,
    postWebCalls, postFetch, postSearch, allWeb, fetchChars, searchChars, fetchN, searchN, wall, reqs };
}

const results = RUNS.map(analyse);
for (const a of results) {
  const { run, N, W, compactBefore, busts } = a;
  console.log(`\n=== ${run.cat}  requests ${N}  P1 ${a.P1}  first dossier Write at request ${W}  compaction before request ${compactBefore.map(c => c.before + ' (pre ' + c.preTokens + ', post ' + c.postTokens + ', ' + (c.durationMs / 1000).toFixed(0) + 's)').join(', ')}  busts at ${busts.join(',')}`);
  console.log(`   web calls total ${a.allWeb} (fetch ${a.fetchN}, search ${a.searchN}); after first Write: ${a.postWebCalls} (fetch ${a.postFetch}, search ${a.postSearch})`);
  console.log(`   first Write content ${a.firstWriteChars} chars (§1 ${a.sec1Chars}), dossier on disk now ${a.finalDossierChars} chars; evidence: fetch ${a.fetchChars} + search ${a.searchChars} chars; wall ${a.wall.toFixed(0)} s`);
  if (showTable) {
    for (const r of a.reqs) {
      const p = r.in + r.cw + r.cr;
      console.log(`${String(r.j).padStart(3)} ${r.cls.padEnd(11)} gen ${String(r.gen?.toFixed(0) ?? '-').padStart(4)}s gap ${String(r.gapAfter?.toFixed(0) ?? '-').padStart(4)}s  p ${String(p).padStart(6)} cw ${String(r.cw).padStart(6)} cr ${String(r.cr).padStart(7)} out ${String(r.out).padStart(5)}${r.appended.compact ? ' [COMPACTED BEFORE]' : ''}  ${short(r.summary, 150)}  ${r.text.trim() ? '«' + short(r.text, 90) + '»' : ''}`);
    }
  }
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results.map(a => ({ ...a, reqs: a.reqs.map(r => ({ j: r.j, cls: r.cls, in: r.in, cw: r.cw, cr: r.cr, out: r.out, gen: r.gen, gapAfter: r.gapAfter, compact: r.appended.compact, chars: r.appended.chars, nestedPaths: r.appended.nestedPaths, tools: r.tools.map(t => ({ name: t.name, file: t.file, url: t.url, resultChars: t.resultChars, len: (t.content?.length ?? 0) + (t.newStr?.length ?? 0) })), visChars: r.visChars, thinkSig: r.thinkSig, text: r.text })) })), null, 1));
