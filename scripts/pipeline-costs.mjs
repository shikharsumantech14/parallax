#!/usr/bin/env node
/**
 * pipeline-costs — what each agent actually cost, per issue and in total.
 *
 *   npm run pipeline:costs                          every run in the ledger
 *   npm run pipeline:costs -- --since 2026-09-16    runs on or after a date
 *   npm run pipeline:costs -- --category earth      one desk
 *   npm run pipeline:costs -- --json                the raw rows, one per line
 *
 * Reads research/_costs/ledger.jsonl, which scripts/pipeline.ts appends to
 * after every agent run: the SDK's own total_cost_usd and the token split
 * (fresh input, cache write, cache read, output), web searches, turns and
 * duration. Nothing here is estimated. Discovery rows belong to the desk
 * (slug "(discovery)"), every other row to the issue whose dossier /
 * storyboard / draft the phase worked on.
 *
 * Operator's request, 2026-09-16: "measure the cost each agent incurs for
 * each issue, API cost and tokens both, per issue and in total".
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = join(root, 'research', '_costs', 'ledger.jsonl');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i === -1 ? undefined : args[i + 1]; };
const since = flag('since');
const category = flag('category');
const asJson = args.includes('--json');

if (!existsSync(ledgerPath)) {
  console.log('No ledger yet: research/_costs/ledger.jsonl is written by the first `npm run pipeline:<phase>` run.');
  process.exit(0);
}

let rows = readFileSync(ledgerPath, 'utf-8')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));
if (since) rows = rows.filter((r) => r.at.slice(0, 10) >= since);
if (category) rows = rows.filter((r) => r.category === category);

if (asJson) { for (const r of rows) console.log(JSON.stringify(r)); process.exit(0); }
if (!rows.length) { console.log('No runs match.'); process.exit(0); }

const PHASE_ORDER = ['discover', 'research', 'storyboard', 'draft', 'panel', 'stylist', 'verify'];
const usd = (n) => `$${n.toFixed(2)}`;
const k = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const mins = (ms) => `${Math.round(ms / 60000)}m`;

const zero = () => ({ runs: 0, costUsd: 0, inputTokens: 0, cacheWriteTokens: 0, cacheReadTokens: 0, outputTokens: 0, webSearches: 0, webFetches: 0, turns: 0, durationMs: 0 });
const add = (acc, r) => { acc.runs++; for (const key of Object.keys(acc)) if (key !== 'runs') acc[key] += Number(r[key] ?? 0); return acc; };

// Group: issue (category/slug) → phase → totals. Discovery groups under the desk.
const issues = new Map();
for (const r of rows) {
  const issueKey = `${r.category} · ${r.slug}`;
  if (!issues.has(issueKey)) issues.set(issueKey, { category: r.category, slug: r.slug, phases: new Map(), total: zero() });
  const issue = issues.get(issueKey);
  const phaseKey = `${r.phase} (${r.agent} · ${r.model})`;
  if (!issue.phases.has(phaseKey)) issue.phases.set(phaseKey, { phase: r.phase, ...zero() });
  add(issue.phases.get(phaseKey), r);
  add(issue.total, r);
}

const header = 'phase (agent · model)'.padEnd(46) + 'runs'.padStart(5) + 'cost'.padStart(9) + 'in'.padStart(8) + 'cache-w'.padStart(9) + 'cache-r'.padStart(9) + 'out'.padStart(8) + 'search'.padStart(7) + 'fetch'.padStart(6) + 'turns'.padStart(6) + 'time'.padStart(6);
const line = (label, t) => label.padEnd(46) + String(t.runs).padStart(5) + usd(t.costUsd).padStart(9) + k(t.inputTokens).padStart(8) + k(t.cacheWriteTokens).padStart(9) + k(t.cacheReadTokens).padStart(9) + k(t.outputTokens).padStart(8) + String(t.webSearches).padStart(7) + String(t.webFetches).padStart(6) + String(t.turns).padStart(6) + mins(t.durationMs).padStart(6);

const grand = zero();
const byAgent = new Map();
const sortedIssues = [...issues.values()].sort((a, b) => a.category.localeCompare(b.category) || (a.slug === '(discovery)' ? -1 : 1) || a.slug.localeCompare(b.slug));

console.log(`\nPipeline costs — ${rows.length} run(s)${since ? ` since ${since}` : ''}${category ? ` · ${category}` : ''} · source: research/_costs/ledger.jsonl (actual SDK-reported figures)\n`);
for (const issue of sortedIssues) {
  console.log(`\x1b[1m${issue.category} · ${issue.slug}\x1b[0m`);
  console.log('  ' + header);
  const phases = [...issue.phases.values()].sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase));
  for (const [key, t] of [...issue.phases.entries()].sort((a, b) => PHASE_ORDER.indexOf(a[1].phase) - PHASE_ORDER.indexOf(b[1].phase))) {
    console.log('  ' + line(key, t));
    const agentKey = key.replace(/^\S+ /, '');
    if (!byAgent.has(agentKey)) byAgent.set(agentKey, { phase: t.phase, ...zero() });
    const a = byAgent.get(agentKey);
    a.runs += t.runs; for (const kk of Object.keys(zero())) if (kk !== 'runs') a[kk] += t[kk];
  }
  void phases;
  console.log('  ' + line(`\x1b[1msubtotal — ${issue.slug}\x1b[0m`.padEnd(54), issue.total));
  console.log('');
  for (const kk of Object.keys(grand)) grand[kk] += issue.total[kk];
}

console.log('\x1b[1mPer agent, across every issue above\x1b[0m');
console.log('  ' + header);
for (const [key, t] of [...byAgent.entries()].sort((a, b) => PHASE_ORDER.indexOf(a[1].phase) - PHASE_ORDER.indexOf(b[1].phase))) {
  console.log('  ' + line(key, t) + `   avg ${usd(t.costUsd / t.runs)}/run`);
}
console.log('');
console.log('  ' + line('\x1b[1mGRAND TOTAL\x1b[0m'.padEnd(54), grand));
const issuesOnly = sortedIssues.filter((i) => i.slug !== '(discovery)');
if (issuesOnly.length) {
  const perIssue = issuesOnly.reduce((s, i) => s + i.total.costUsd, 0) / issuesOnly.length;
  console.log(`\n  ${issuesOnly.length} issue(s) · average ${usd(perIssue)} per issue excluding discovery · discovery ${usd(grand.costUsd - issuesOnly.reduce((s, i) => s + i.total.costUsd, 0))} across the desks`);
}
const unreported = rows.filter((r) => !(r.costUsd > 0) && r.stopReason && r.stopReason !== 'success');
if (unreported.length) {
  console.log(`\n  \x1b[31m${unreported.length} run(s) with NO reported cost\x1b[0m (the SDK throws on a capped run, so nothing came back) — the totals above are LOW by those runs:`);
  for (const r of unreported) console.log(`    ${r.at.slice(0, 10)} · ${r.category} · ${r.slug} · ${r.phase} · ${r.stopReason}${r.note ? ` — ${r.note}` : ''}`);
}
console.log('\n  columns: cost = SDK total_cost_usd · in = fresh input tokens · cache-w / cache-r = prompt-cache write / read tokens · out = output tokens · search / fetch = WebSearch / WebFetch calls counted from the stream (rows before 2026-09-16 02:10 UTC show 0: the SDK reported none) · time = wall clock');
