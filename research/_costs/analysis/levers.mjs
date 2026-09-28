// Lever arithmetic on the measured Parallax profile. List prices from
// https://platform.claude.com/docs/en/about-claude/pricing (fetched 2026-09-27). API route: 5-minute writes.
const P = {
  opus5:   { in: 5, w5: 6.25, w1: 10, r: 0.50, o: 25 },
  opus55:  { in: 4, w5: 5.00, w1: 8,  r: 0.20, o: 20 },
  sonnet5: { in: 2, w5: 2.50, w1: 4,  r: 0.20, o: 10 },
  haiku45: { in: 1, w5: 1.25, w1: 2,  r: 0.10, o: 5 },
};
const M = 1e6;
// Per-run averages. Tokens: ledgered successful runs. Shares/P1/busts/calls: all transcripts of the phase.
const ph = {
  discovery: { m: 'opus5', n: 1, I: 41, W: 210438, R: 2005217, O: 27763, ex: { helpers: 0.49, compaction: 0.11, subagent: 0 }, P1: 56475, sPre: .527, sNest: .098, sRef: .128, sMem: 0, comp: 0.17, bust: 71307, calls: 20.3, memCalls$: 0 },
  research:  { m: 'opus5', n: 1, I: 75, W: 307835, R: 4058221, O: 52106, ex: { helpers: 1.26, compaction: 0.50, subagent: 0.37 }, P1: 56768, sPre: .492, sNest: .084, sRef: .121, sMem: 0, comp: 1.0, bust: 81092, calls: 37.7, memCalls$: 0 },
  composer:  { m: 'opus5', n: 1, I: 44, W: 239098, R: 2322305, O: 48289, ex: { helpers: 0, compaction: 0.48, subagent: 0 }, P1: 56347, sPre: .511, sNest: .113, sRef: .047, sMem: .065, comp: 1.0, bust: 0, calls: 26.0, memCalls$: 1.03 },
  drafter:   { m: 'opus5', n: 1, I: 74, W: 362122, R: 3933498, O: 54361, ex: { helpers: 0, compaction: 1.12, subagent: 0 }, P1: 58500, sPre: .506, sNest: .108, sRef: .055, sMem: .022, comp: 2.0, bust: 0, calls: 40.5, memCalls$: 0.59 },
  panel:     { m: 'sonnet5', n: 2, I: 8, W: 117144, R: 354391, O: 23691, ex: { helpers: 0, compaction: 0.01, subagent: 0 }, P1: 54569, sPre: .607, sNest: .121, sRef: .091, sMem: 0, comp: 0.08, bust: 0, calls: 4.4, memCalls$: 0 },
  stylist:   { m: 'opus5', n: 1, I: 71, W: 224525, R: 3139978, O: 43039, ex: { helpers: 0, compaction: 0.36, subagent: 0 }, P1: 57109, sPre: .604, sNest: .084, sRef: .042, sMem: .038, comp: 1.0, bust: 0, calls: 34.8, memCalls$: 0.71 },
  verifier:  { m: 'opus5', n: 1, I: 41, W: 214571, R: 2273264, O: 33298, ex: { helpers: 0, compaction: 0.42, subagent: 0 }, P1: 58156, sPre: .503, sNest: .178, sRef: .004, sMem: .050, comp: 0.67, bust: 0, calls: 18.3, memCalls$: 0.59 },
};
const f = x => x.toFixed(2);
const main = (p, model, ttl = 'w5') => { const k = P[model]; return (p.I * k.in + p.W * k[ttl] + p.R * k.r + p.O * k.o) / M; };
const exSum = p => p.ex.helpers + p.ex.compaction + p.ex.subagent;
const scaleModel = (p, from, to) => main(p, to) / main(p, from);

console.log('== Baseline per run (5m list) and per issue');
let base = 0, base1h = 0; const baseBy = {};
for (const [k, p] of Object.entries(ph)) {
  const k5 = P[p.m];
  const w = p.W * k5.w5 / M, r = p.R * k5.r / M, o = p.O * k5.o / M;
  const run = main(p, p.m) + exSum(p);
  const run1h = main(p, p.m, 'w1') + exSum(p);
  baseBy[k] = run * p.n; base += run * p.n; base1h += run1h * p.n;
  console.log(k.padEnd(10), p.m.padEnd(8), `W ${f(w)} R ${f(r)} O ${f(o)} main ${f(main(p, p.m))} extras ${f(exSum(p))} = ${f(run)} /run x${p.n} = ${f(run * p.n)} | 1h: ${f(run1h)}`);
}
console.log('BASELINE per issue (API route, 5m):', f(base), ' | as run on subscription (1h):', f(base1h));

// L1 Sonnet loops
const l1 = {};
for (const k of ['discovery', 'research']) {
  const p = ph[k];
  const after = main(p, 'sonnet5') + p.ex.helpers + (p.ex.compaction + p.ex.subagent) * 0.4;
  l1[k] = baseBy[k] - after;
  console.log('L1', k, 'after', f(after), 'saving', f(l1[k]));
}
const L1 = l1.discovery + l1.research;
console.log('L1 total', f(L1), (100 * L1 / base).toFixed(1) + '%');

// L2 Haiku loops: 0.2x rates and ~1/1.3 tokens (older tokenizer)
const l2 = {};
for (const k of ['discovery', 'research']) {
  const p = ph[k];
  const factor = (main(p, 'haiku45') / main(p, 'opus5')) / 1.3;
  const after = main(p, 'opus5') * factor + p.ex.helpers + (p.ex.compaction + p.ex.subagent) * factor;
  l2[k] = baseBy[k] - after;
  console.log('L2', k, 'factor', factor.toFixed(3), 'after', f(after), 'saving', f(l2[k]));
}
const L2 = l2.discovery + l2.research;
console.log('L2 total', f(L2), (100 * L2 / base).toFixed(1) + '%', 'incremental over L1', f(L2 - L1));

// L3 effort medium: 13–30% of phase cost (published: medium = 70–87% of default cost on research/knowledge work)
const loopsOpus = baseBy.discovery + baseBy.research;
const loopsSonnet = loopsOpus - L1;
console.log('L3 loops on Opus: medium saves', f(loopsOpus * .13), '-', f(loopsOpus * .30), '| on Sonnet', f(loopsSonnet * .13), '-', f(loopsSonnet * .30),
  '| panel', f(baseBy.panel * .13), '-', f(baseBy.panel * .30));
const passes = baseBy.composer + baseBy.drafter + baseBy.stylist + baseBy.verifier;
console.log('L3 Opus passes (composer+drafter+stylist+verifier =', f(passes), '): medium 13–30% =', f(passes * .13), '-', f(passes * .30));

// L4 halve API calls: reads -50%, output -10%
let L4o = 0, L4s = 0;
for (const [k, p] of Object.entries(ph)) {
  const kk = P[p.m];
  const s = (0.5 * p.R * kk.r + 0.1 * p.O * kk.o) / M * p.n;
  L4o += s;
  L4s += (k === 'discovery' || k === 'research') ? s * 0.4 : s;
  console.log('L4', k, f(s));
}
console.log('L4 halve calls: loops on Opus', f(L4o), (100 * L4o / base).toFixed(1) + '% | loops on Sonnet', f(L4s));

// L5 prefix -50% (narrow: first-call prefix P1 only) and realistic (-75% prefix + nested memory gone)
const REINJ = 37000; // CLAUDE.md+AGENTS.md+listings re-injected after each compaction and re-written by a bust
let L5n = 0, L5r = 0; const l5 = {};
for (const [k, p] of Object.entries(ph)) {
  const kk = P[p.m];
  const readsPre = p.R * p.sPre * kk.r / M;
  const writesPre = (p.P1 + p.comp * REINJ + (p.bust ? REINJ : 0)) * kk.w5 / M;
  const narrow = 0.5 * (readsPre + writesPre) * p.n;
  const nested = (p.R * p.sNest * kk.r / M + 30000 * kk.w5 / M * (1 + p.comp) * 0.5) * p.n; // reads + ~15k-token writes per load
  const realistic = 1.5 * narrow + nested;
  l5[k] = { narrow, realistic };
  L5n += narrow; L5r += realistic;
  console.log('L5', k, 'narrow', f(narrow), 'realistic', f(realistic));
}
const L5nS = L5n - 0.6 * (l5.discovery.narrow + l5.research.narrow);
const L5rS = L5r - 0.6 * (l5.discovery.realistic + l5.research.realistic);
console.log('L5 narrow (-50% P1)', f(L5n), (100 * L5n / base).toFixed(1) + '% | realistic', f(L5r), (100 * L5r / base).toFixed(1) + '% | with Sonnet loops: narrow', f(L5nS), 'realistic', f(L5rS));

// L7 passes on the Messages API (single shot), interactive and Batch. chars -> tokens at 2.7 chars/token.
const tok = c => c / 2.7;
const L7in = {
  composer: { in: tok(11078 + 47000 + 11794 + 106567 + 5023 + 3000 + 8000 + 4000 + 9000 + 10000), out: 31000, m: 'opus5', rounds: 1 },
  drafter:  { in: tok(16006 + 47000 + 30500 + 29700 + 4971 + 12787 + 13131 + 1110 + 15000 + 15000 + 3154), out: 35500, m: 'opus5', rounds: 1.5 },
  stylist:  { in: tok(11552 + 15000 + 29700 + 4971 + 12787 + 50514 + 30500 + 12000 + 10000), out: 30500, m: 'opus5', rounds: 1 },
  verifier: { in: tok(14447 + 15000 + 47000 + 30500 + 29700 + 4971 + 10000), out: 32400, m: 'opus5', rounds: 1 },
  panel:    { in: tok(5671 + 15000 + 30500 + 29700), out: 23000, m: 'sonnet5', rounds: 1, n: 2 },
};
let L7i = 0, L7b = 0, passesNow = 0;
for (const [k, x] of Object.entries(L7in)) {
  const kk = P[x.m];
  const one = (x.in * kk.in + x.out * kk.o) / M * x.rounds * (x.n ?? 1);
  L7i += one; L7b += one / 2; passesNow += baseBy[k];
  console.log('L7', k, 'in', Math.round(x.in), 'out', x.out, 'cost', f(one), 'batch', f(one / 2), 'now', f(baseBy[k]));
}
console.log('L7 passes now', f(passesNow), '-> interactive', f(L7i), 'saving', f(passesNow - L7i), (100 * (passesNow - L7i) / base).toFixed(1) + '% | batch', f(L7b), 'saving', f(passesNow - L7b), (100 * (passesNow - L7b) / base).toFixed(1) + '%');
const L7i55 = L7i - (L7in.panel.in * 2 + L7in.panel.out * 10) * 2 / M; // placeholder not used

// L9 memory upkeep
const L9 = ['composer', 'drafter', 'stylist', 'verifier'].reduce((s, k) => s + ph[k].memCalls$ + ph[k].R * ph[k].sMem * P.opus5.r / M, 0);
console.log('L9 memory upkeep', f(L9), (100 * L9 / base).toFixed(1) + '%');

// L10 ToolSearch bust
const L10o = ['discovery', 'research'].reduce((s, k) => s + ph[k].bust * (P.opus5.w5 - P.opus5.r) / M, 0);
console.log('L10 bust Opus', f(L10o), 'Sonnet', f(L10o * .4));

// L12 Opus 5 -> Opus 5.5 on passes
let L12 = 0;
for (const k of ['composer', 'drafter', 'stylist', 'verifier']) {
  const p = ph[k]; const ratio = scaleModel(p, 'opus5', 'opus55');
  const after = main(p, 'opus55') + exSum(p) * ratio;
  L12 += baseBy[k] - after;
  console.log('L12', k, 'ratio', ratio.toFixed(3), 'after', f(after), 'saving', f(baseBy[k] - after));
}
console.log('L12 total', f(L12), (100 * L12 / base).toFixed(1) + '%');
// Opus 5.5 on the loops for comparison with Sonnet
for (const k of ['discovery', 'research']) console.log('loops on Opus 5.5 main', k, f(main(ph[k], 'opus55')), 'vs Sonnet 5', f(main(ph[k], 'sonnet5')));

// 1h TTL on API route: extra write cost
let ttl = 0; for (const [k, p] of Object.entries(ph)) ttl += p.W * (P[p.m].w1 - P[p.m].w5) / M * p.n;
console.log('1h TTL surcharge per issue', f(ttl));
