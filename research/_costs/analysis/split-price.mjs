// Price four research configurations per run on the six September transcripts, after the harness diet
// (first-request prefix -75%, nested CLAUDE.md/rules gone, Agent tool gone). List prices, 5-minute writes.
// Source rates: https://platform.claude.com/docs/en/about-claude/pricing (fetched 2026-09-27).
import { readFileSync, statSync } from 'fs';

const R = {
  opus5:   { in: 5, w: 6.25, r: 0.50, o: 25 },
  sonnet5: { in: 2, w: 2.50, r: 0.20, o: 10 },
};
const CPT = 2.7;                 // measured chars per token for tool results / dossier markdown
const NESTED_CPT = 3.0;          // prose-heavy guide files
const DIET_KEEP = 0.25;          // first-request prefix kept after the diet
const COMPACT_THRESHOLD = 167000;// observed compactions fired at preTokens 169.6k to 205k
const COMPACTION_COST = 0.50;    // per compaction request, Opus, from composer residuals ($0.43 to $0.55)
const TAXONOMY = 9236;
const ALLOW = { sports: 19902, politics: 18712, tech: 22957, space: 17914, travel: 20226, earth: 21280 };
const TRAVEL_SUB = { opusMain: 2.17, helpers: 0.75 }; // the delegated sweep (25 requests, 40 web calls)
const OPUS_TPS = 88.3, SONNET_TPS = 98.2;            // measured on outputs >= 8k tokens

const runs = JSON.parse(readFileSync('split.json', 'utf8'));
const fileSize = p => { try { return statSync(p).size; } catch { return 0; } };
const $ = (tok, rate) => tok * rate / 1e6;
const f2 = x => x.toFixed(2);

const out = [];
for (const a of runs) {
  const cat = a.run.cat, reqs = a.reqs, N = reqs.length, W = a.W, P1 = a.P1;
  const prompt = r => r.in + r.cw + r.cr;
  // ---- observed partitions
  const part = { SWEEP: [], 'DRAFT-WRITE': [], JUDGMENT: [], 'SWEEP-2': [] };
  for (const r of reqs) part[r.cls].push(r);
  const sum = (rs, k) => rs.reduce((s, r) => s + (r[k] ?? 0), 0);
  const obs = Object.fromEntries(Object.entries(part).map(([k, rs]) => [k, { n: rs.length, cr: sum(rs, 'cr'), cw: sum(rs, 'cw'), out: sum(rs, 'out'), gen: sum(rs, 'gen'), gap: sum(rs, 'gapAfter') }]));
  // ---- evidence pack and dossier
  const evFetch = reqs.reduce((s, r) => s + r.tools.filter(t => t.name === 'WebFetch').reduce((x, t) => x + (t.resultChars ?? 0) + (t.url?.length ?? 0), 0), 0);
  const evSearch = reqs.reduce((s, r) => s + r.tools.filter(t => t.name === 'WebSearch').reduce((x, t) => x + (t.resultChars ?? 0), 0), 0);
  const evOther = reqs.reduce((s, r) => s + r.tools.filter(t => (t.name === 'Read' && /webfetch-.*\.pdf$/.test(t.file ?? '')) || t.name === 'Bash' || t.name === 'PowerShell' || t.name === 'TaskOutput').reduce((x, t) => x + (t.resultChars ?? 0), 0), 0);
  const dossierChars = a.firstWriteChars;
  // ---- dieted, uncompacted simulation
  const Up = new Array(N + 1).fill(0), cwD = [], crD = [], cwDnb = [], crDnb = [];
  let nestedTotTok = 0, bustAt = a.busts[0] ?? null;
  Up[1] = DIET_KEEP * P1; cwD[1] = Up[1]; crD[1] = 0; cwDnb[1] = Up[1]; crDnb[1] = 0;
  for (let j = 2; j <= N; j++) {
    const r = reqs[j - 1], prev = reqs[j - 2];
    const nestedTok = (r.nestedPaths ?? []).reduce((s, p) => s + fileSize(p), 0) / NESTED_CPT;
    let growth;
    if (r.compact) {
      const resChars = Object.entries(r.chars).filter(([k]) => k.startsWith('result:')).reduce((s, [, v]) => s + v, 0);
      growth = prev.out + resChars / CPT;              // what an uncompacted context would have appended
    } else {
      growth = prompt(r) - prompt(prev) - nestedTok;   // measured growth minus the nested guide files
      nestedTotTok += nestedTok;
    }
    growth = Math.max(0, growth);
    Up[j] = Up[j - 1] + growth;
    // tool search on: the observed bust re-writes everything after the (dieted) system layer
    if (j === bustAt) {
      const keep = r.cr > 0 ? DIET_KEEP * P1 : 0;
      cwD[j] = Up[j] - keep; crD[j] = keep;
    } else { cwD[j] = growth; crD[j] = Up[j - 1]; }
    cwDnb[j] = growth; crDnb[j] = Up[j - 1];
  }
  const maxUp = Math.max(...Up.slice(1));
  const tok = (from, to) => { let w = 0, rd = 0, o = 0; for (let j = from; j <= to; j++) { w += cwD[j]; rd += crD[j]; o += reqs[j - 1].out; } return { w: Math.round(w), r: Math.round(rd), o }; };
  const dietAll = tok(1, N), dietSweep = tok(1, W);
  const cost = (model, from, to, bust = true) => {
    let s = 0; const k = R[model];
    for (let j = from; j <= to; j++) {
      const r = reqs[j - 1];
      s += $(r.in, k.in) + $(bust ? cwD[j] : cwDnb[j], k.w) + $(bust ? crD[j] : crDnb[j], k.r) + $(r.out, k.o);
    }
    return s;
  };
  // ---- extras outside the main loop
  const mainSDK = reqs.reduce((s, r) => s + $(r.in, 5) + $(r.cw, 6.25) + $(r.cr, 0.5) + $(r.out, 25), 0);
  const residual = a.run.ledger - mainSDK;
  const nCompact = a.compactBefore.length;
  const isTravel = cat === 'travel';
  const helpers = residual - nCompact * COMPACTION_COST - (isTravel ? TRAVEL_SUB.opusMain + TRAVEL_SUB.helpers : 0);
  const sub = model => isTravel ? (model === 'opus5' ? TRAVEL_SUB.opusMain : TRAVEL_SUB.opusMain * 0.4) + TRAVEL_SUB.helpers : 0;
  const compactD = maxUp > COMPACT_THRESHOLD ? COMPACTION_COST : 0; // one compaction if the dieted run still crosses
  // ---- configurations
  const A = cost('opus5', 1, N) + helpers + sub('opus5') + compactD;
  const Anb = cost('opus5', 1, N, false) + helpers + sub('opus5') + compactD;
  const Bmain = cost('opus5', 1, N);
  const Blo = Bmain * 0.70 + helpers + sub('opus5') + compactD, Bhi = Bmain * 0.87 + helpers + sub('opus5') + compactD;
  const C = cost('sonnet5', 1, N) + helpers + sub('sonnet5') + compactD * 0.4;
  // split
  const sweep = cost('sonnet5', 1, W) + helpers + sub('sonnet5') + (Math.max(...Up.slice(1, W + 1)) > COMPACT_THRESHOLD ? COMPACTION_COST * 0.4 : 0);
  const judgeInChars = dossierChars + evFetch + evSearch + TAXONOMY + ALLOW[cat];
  const judgeIn = judgeInChars / CPT + 3000;
  const judgeOutObserved = obs.JUDGMENT.out + obs['SWEEP-2'].out;
  const judge = o => $(judgeIn, R.opus5.in) + $(o, R.opus5.o);
  const postWeb = a.postWebCalls;
  const sweep2 = 0; // priced from the post-Write fetch count, which is 0 in all six runs
  const signIn = dossierChars / CPT + 5000 + 3000;
  const signoff = $(signIn, R.opus5.in) + $(10000, R.opus5.o);
  const D = sweep + judge(15000) + sweep2 + signoff;
  const D1 = sweep + judge(15000);
  // judgment content inside today's draft-write request: output minus the visible dossier
  const wReq = reqs[W - 1];
  const writeThinking = wReq.out - dossierChars / CPT;
  // ---- latency
  const tGen = rs => rs.reduce((s, r) => s + (r.gen ?? 0), 0);
  const tGap = rs => rs.reduce((s, r) => s + (r.gapAfter ?? 0), 0);
  const compactSec = a.compactBefore.reduce((s, c) => s + c.durationMs / 1000, 0);
  const genAll = tGen(reqs), gapAll = tGap(reqs);
  const toolTime = gapAll - compactSec;
  const latA = genAll + toolTime;                        // no compaction after the diet
  const latC = genAll * OPUS_TPS / SONNET_TPS + toolTime;
  const sweepReqs = reqs.slice(0, W);
  const sweepLat = tGen(sweepReqs) * OPUS_TPS / SONNET_TPS + sweepReqs.slice(0, -1).reduce((s, r) => s + (r.gapAfter ?? 0), 0) - a.compactBefore.filter(c => c.before <= W).reduce((s, c) => s + c.durationMs / 1000, 0);
  const judgeLat = 15 + 15000 / OPUS_TPS, signLat = 10 + 10000 / OPUS_TPS;
  const latD = sweepLat + judgeLat + signLat;
  out.push({ cat, N, W, P1, obs, nCompact, compactBefore: a.compactBefore.map(c => c.before), writtenFromCompacted: a.compactBefore.some(c => c.before <= W),
    postWeb, dossierChars, sec1: a.sec1Chars, evFetch, evSearch, evOther, judgeIn: Math.round(judgeIn), judgeOutObserved, writeThinking: Math.round(writeThinking),
    maxUp: Math.round(maxUp), nestedTotTok: Math.round(nestedTotTok), dietAll, dietSweep, residual, helpers, bustDelta: A - Anb,
    A, Blo, Bhi, C, D, D1, sweep, judge15: judge(15000), judge8: judge(8000), judge25: judge(25000), judgeObs: judge(judgeOutObserved), signoff,
    wall: a.wall, genAll, toolTime, compactSec, latA, latC, latD, sweepLat, judgeLat, signLat, ledger: a.run.ledger });
}

// ---- print
for (const x of out) {
  console.log(`\n=== ${x.cat}: ${x.N} requests, first dossier Write at ${x.W}, compaction before ${x.compactBefore.join(',')} → dossier written from ${x.writtenFromCompacted ? 'COMPACTED' : 'full'} context; post-Write web calls ${x.postWeb}`);
  for (const [k, v] of Object.entries(x.obs)) if (v.n) console.log(`   ${k.padEnd(11)} req ${String(v.n).padStart(2)}  cache-read ${String(v.cr).padStart(9)}  cache-write ${String(v.cw).padStart(7)}  output ${String(v.out).padStart(6)}  gen ${v.gen.toFixed(0)}s`);
  console.log(`   dossier ${x.dossierChars} chars (${Math.round(x.dossierChars / CPT)} tok), §1 ${x.sec1} chars; evidence: fetch ${x.evFetch} + search ${x.evSearch} chars (${Math.round((x.evFetch + x.evSearch) / CPT)} tok), other extracts ${x.evOther}; write-time thinking ≈ ${x.writeThinking}`);
  console.log(`   dieted tokens, whole run: write ${x.dietAll.w} read ${x.dietAll.r} out ${x.dietAll.o} | requests 1..W: write ${x.dietSweep.w} read ${x.dietSweep.r} out ${x.dietSweep.o}`);
  console.log(`   dieted uncompacted peak ${x.maxUp} tok (threshold ${COMPACT_THRESHOLD}); nested removed ${x.nestedTotTok} tok; residual ${f2(x.residual)} → helpers ${f2(x.helpers)}; bust costs ${f2(x.bustDelta)} at Opus`);
  console.log(`   (a) Opus ${f2(x.A)}  (b) Opus medium ${f2(x.Blo)}-${f2(x.Bhi)}  (c) Sonnet ${f2(x.C)}  (d) split ${f2(x.D)} [sweep ${f2(x.sweep)} + judge ${f2(x.judge15)} (in ${x.judgeIn} tok, out 15k) + sweep2 0 + sign-off ${f2(x.signoff)}]  d-one-round ${f2(x.D1)}  | ledger today ${f2(x.ledger)}`);
  console.log(`   judge output sensitivity: observed post-Write ${x.judgeOutObserved} → ${f2(x.judgeObs)}, 8k ${f2(x.judge8)}, 25k ${f2(x.judge25)}`);
  console.log(`   latency: today ${x.wall.toFixed(0)}s (gen ${x.genAll.toFixed(0)} + tools ${x.toolTime.toFixed(0)} + compaction ${x.compactSec.toFixed(0)}); (a) ${x.latA.toFixed(0)}s (c) ${x.latC.toFixed(0)}s (d) ${x.latD.toFixed(0)}s [sweep ${x.sweepLat.toFixed(0)} + judge ${x.judgeLat.toFixed(0)} + sign-off ${x.signLat.toFixed(0)}]`);
}
const avg = k => out.reduce((s, x) => s + x[k], 0) / out.length;
console.log('\nAVERAGES', Object.fromEntries(['A', 'Blo', 'Bhi', 'C', 'D', 'D1', 'sweep', 'judge15', 'signoff', 'helpers', 'bustDelta', 'latA', 'latC', 'latD', 'wall', 'ledger'].map(k => [k, f2(avg(k))])));
