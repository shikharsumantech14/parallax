#!/usr/bin/env node
/**
 * pipeline-costs — what each agent actually cost, per issue and in total.
 *
 *   npm run pipeline:costs                          every run in the ledger
 *   npm run pipeline:costs -- --since 2026-09-16    runs on or after a date
 *   npm run pipeline:costs -- --category earth      one desk
 *   npm run pipeline:costs -- --json                the raw rows, one per line
 *   npm run pipeline:costs -- --ledger <path>       read another ledger file (a copy, a test)
 *
 * Reads research/_costs/ledger.jsonl, which scripts/pipeline.ts appends to
 * after every agent run, failed runs included: the token split (fresh input,
 * cache write, cache read, output), web searches and fetches, API requests,
 * turns and duration, and two prices. `list` is the list price of every
 * request the run made (main loop, compaction, web helpers), computed from
 * the tokens and the 5-minute / 1-hour cache split in scripts/lib/pricing.ts
 * (COST-PLAN CP-01, 2026-09-28). `sdk` is the SDK's own client-side
 * estimate, kept beside it. Rows before 2026-09-28 recorded only the SDK's
 * estimate, so for them both columns show that figure (the footer counts
 * them). Discovery rows belong to the desk (slug "(discovery)"), every other
 * row to the issue whose dossier / storyboard / draft the phase worked on.
 *
 * Operator's request, 2026-09-16: "measure the cost each agent incurs for
 * each issue, API cost and tokens both, per issue and in total".
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i === -1 ? undefined : args[i + 1]; };
const ledgerPath = flag('ledger') ?? join(root, 'research', '_costs', 'ledger.jsonl');
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

// A row from before 2026-09-28 has one price, the SDK's, in `costUsd`.
const legacy = (r) => r.costUsdList === undefined;
const listOf = (r) => Number(r.costUsdList ?? r.costUsd ?? 0);
const sdkOf = (r) => Number(r.costUsdSdk ?? r.costUsd ?? 0);

const PHASE_ORDER = ['discover', 'research', 'check', 'storyboard', 'draft', 'panel', 'stylist', 'verify'];
const usd = (n) => `$${n.toFixed(2)}`;
const k = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const mins = (ms) => `${Math.round(ms / 60000)}m`;

const TOKEN_KEYS = ['inputTokens', 'cacheWriteTokens', 'cacheReadTokens', 'outputTokens', 'webSearches', 'webFetches', 'requests', 'turns', 'durationMs'];
const zero = () => ({ runs: 0, list: 0, sdk: 0, legacyRuns: 0, ...Object.fromEntries(TOKEN_KEYS.map((key) => [key, 0])) });
const add = (acc, r) => {
  acc.runs++;
  acc.list += listOf(r);
  acc.sdk += sdkOf(r);
  if (legacy(r)) acc.legacyRuns++;
  for (const key of TOKEN_KEYS) acc[key] += Number(r[key] ?? 0);
  return acc;
};
const merge = (acc, t) => { for (const key of Object.keys(zero())) acc[key] += t[key]; return acc; };

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

const header = 'phase (agent · model)'.padEnd(46) + 'runs'.padStart(5) + 'list'.padStart(9) + 'sdk'.padStart(9) + 'req'.padStart(6) + 'in'.padStart(8) + 'cache-w'.padStart(9) + 'cache-r'.padStart(9) + 'out'.padStart(8) + 'search'.padStart(7) + 'fetch'.padStart(6) + 'turns'.padStart(6) + 'time'.padStart(6);
const line = (label, t) => label.padEnd(46) + String(t.runs).padStart(5) + (usd(t.list) + (t.legacyRuns ? '*' : '')).padStart(9) + usd(t.sdk).padStart(9) + (t.requests ? String(t.requests) : '—').padStart(6) + k(t.inputTokens).padStart(8) + k(t.cacheWriteTokens).padStart(9) + k(t.cacheReadTokens).padStart(9) + k(t.outputTokens).padStart(8) + String(t.webSearches).padStart(7) + String(t.webFetches).padStart(6) + String(t.turns).padStart(6) + mins(t.durationMs).padStart(6);
const order = (phase) => { const i = PHASE_ORDER.indexOf(phase); return i === -1 ? PHASE_ORDER.length : i; };

const grand = zero();
const byAgent = new Map();
const sortedIssues = [...issues.values()].sort((a, b) => a.category.localeCompare(b.category) || (a.slug === '(discovery)' ? -1 : 1) || a.slug.localeCompare(b.slug));

console.log(`\nPipeline costs — ${rows.length} run(s)${since ? ` since ${since}` : ''}${category ? ` · ${category}` : ''} · source: ${flag('ledger') ?? 'research/_costs/ledger.jsonl'}\n`);
for (const issue of sortedIssues) {
  console.log(`\x1b[1m${issue.category} · ${issue.slug}\x1b[0m`);
  console.log('  ' + header);
  for (const [key, t] of [...issue.phases.entries()].sort((a, b) => order(a[1].phase) - order(b[1].phase))) {
    console.log('  ' + line(key, t));
    const agentKey = key.replace(/^\S+ /, '');
    if (!byAgent.has(agentKey)) byAgent.set(agentKey, { phase: t.phase, ...zero() });
    merge(byAgent.get(agentKey), t);
  }
  console.log('  ' + line(`\x1b[1msubtotal — ${issue.slug}\x1b[0m`.padEnd(54), issue.total));
  console.log('');
  merge(grand, issue.total);
}

console.log('\x1b[1mPer agent, across every issue above\x1b[0m');
console.log('  ' + header);
for (const [key, t] of [...byAgent.entries()].sort((a, b) => order(a[1].phase) - order(b[1].phase))) {
  console.log('  ' + line(key, t) + `   avg ${usd(t.list / t.runs)}/run`);
}
console.log('');
console.log('  ' + line('\x1b[1mGRAND TOTAL\x1b[0m'.padEnd(54), grand));
const issuesOnly = sortedIssues.filter((i) => i.slug !== '(discovery)');
if (issuesOnly.length) {
  const issuesList = issuesOnly.reduce((s, i) => s + i.total.list, 0);
  console.log(`\n  ${issuesOnly.length} issue(s) · average ${usd(issuesList / issuesOnly.length)} per issue at list, excluding discovery · discovery ${usd(grand.list - issuesList)} across the desks`);
}
if (grand.legacyRuns) {
  console.log(`\n  * ${grand.legacyRuns} run(s) from before 2026-09-28 recorded only the SDK's estimate, so their list column repeats it. That estimate priced every cache write at the 5-minute rate, priced claude-sonnet-5 at Opus 5 rates, and wrote failed runs at $0 (docs/cost/2026-09-27-cost-levers.md §4).`);
}
const unreported = rows.filter((r) => legacy(r) && !(r.costUsd > 0) && r.stopReason && r.stopReason !== 'success');
if (unreported.length) {
  console.log(`\n  \x1b[31m${unreported.length} run(s) with NO recorded cost\x1b[0m (before 2026-09-28 a failed run wrote $0) — the totals above are LOW by those runs:`);
  for (const r of unreported) console.log(`    ${r.at.slice(0, 10)} · ${r.category} · ${r.slug} · ${r.phase} · ${r.stopReason}${r.note ? ` — ${r.note}` : ''}`);
}
const failed = rows.filter((r) => !legacy(r) && r.stopReason !== 'success');
if (failed.length) {
  console.log(`\n  ${failed.length} failed run(s) since 2026-09-28, priced from their tokens and counted above:`);
  for (const r of failed) console.log(`    ${r.at.slice(0, 10)} · ${r.category} · ${r.slug} · ${r.phase} · ${r.stopReason}${r.errorKind ? ` (${r.errorKind})` : ''} · ${usd(listOf(r))}`);
}
console.log('\n  columns: list = list price of every request (scripts/lib/pricing.ts) · sdk = the SDK\'s total_cost_usd estimate · req = API requests (rows from 2026-09-28) · in = fresh input tokens · cache-w / cache-r = prompt-cache write / read tokens, main loop · out = output tokens · search / fetch = WebSearch / WebFetch calls counted from the stream (rows before 2026-09-16 02:10 UTC show 0: the SDK reported none) · time = wall clock');
