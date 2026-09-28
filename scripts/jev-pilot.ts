#!/usr/bin/env node
/**
 * The Jev pilot (docs/COST-PLAN.md §9 step 4): run the verifier pre-pass and
 * the panel grade on an issue that has ALREADY been verified, and read Jev
 * against the verifier's own report and the panel's own grades.
 *
 *   npx tsx scripts/jev-pilot.ts --slug <issue-dir-or-slug> [flags]
 *
 *   --draft <path>       the text the verifier read. Default: the issue file, which
 *                        for a published issue already carries the verifier's fixes.
 *                        Pass a saved copy of the verified draft for a fair reading
 *                        (research/_costs/jev-pilot/ keeps the two September ones)
 *   --dossier <path>     default: the newest research/<topic>/<date>-<slug>-dossier.md
 *   --report <path>      default: the newest <date>-<slug>-verification.md
 *   --no-panel           skip the panel grade
 *   --threshold <p>      default 0.90
 *   --out <path>         default: research/<topic>/<today>-<slug>-jevpilot.md
 *   --jevpass <path>     where the pre-pass report goes, default research/<topic>/<today>-<slug>-jevpass.md
 *
 * Every call is tagged `use: "pilot"` in research/_costs/jev-ledger.jsonl.
 * What it measures: of the report's ⚠️ / ❌ rows, how many the pre-pass sent to
 * the verifier (recall of problems), source-line rows included. Of its ✅ rows,
 * how many Jev also called confident support. The confident-support rate, a
 * threshold sweep over the claims the report labels, the panel agreement, cost
 * and wall time.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import matter from 'gray-matter';
import {
  bareSlug, findIssueDir, findResearchFile, flagValue, jevAvailable, jevUnavailableReason, loadEnvLocal, todayIST, REPO_ROOT,
} from './lib/jev.js';
import { featuresOf, runJevVerify } from './lib/jev-verify.js';
import type { ClaimFeatures, ClaimResult, JevVerifyResult, SourceLineCheck } from './lib/jev-verify.js';
import { runJevPanel } from './lib/jev-panel.js';
import type { JevPanelResult } from './lib/jev-panel.js';

type Status = 'ok' | 'warn' | 'fail';
interface ReportRow { i: number; section: number | null; claim: string; location: string; status: Status; note: string }

function fail(msg: string, code = 1): never {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(code);
}
const abs = (p: string) => (isAbsolute(p) ? p : resolve(process.cwd(), p));
const rel = (p: string) => {
  const r = relative(REPO_ROOT, p);
  return (r && !r.startsWith('..') && !isAbsolute(r) ? r : p).replace(/\\/g, '/');
};
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : '—');
const icon = (s: Status | null) => (s === 'ok' ? '✅' : s === 'warn' ? '⚠️' : s === 'fail' ? '❌' : '·');

// ── The verification report's claim tables ───────────────────────────────────

const splitRow = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, '|').trim());

export function parseVerificationReport(md: string): ReportRow[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => /^##\s+claim verification/i.test(l));
  if (start === -1) return [];
  const rows: ReportRow[] = [];
  let section: number | null = null;
  let header: string[] | null = null;
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const h = line.match(/^###\s+(.*)$/);
    if (h) {
      const t = h[1];
      const n = t.match(/^(?:Section\s+(\d+)|§\s?(\d+))/i);
      if (n) section = Number(n[1] ?? n[2]);
      else if (/^head\b/i.test(t)) section = 0;
      header = null;
      continue;
    }
    if (!/^\s*\|/.test(line)) { header = null; continue; }
    const cells = splitRow(line);
    if (!header) { header = cells.map((c) => c.toLowerCase()); continue; }
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;
    const at = (name: string) => header!.findIndex((c) => c.startsWith(name));
    const ci = at('claim'), li = at('location'), si = at('status'), ni = at('note');
    if (ci === -1 || si === -1) continue;
    const st = cells[si] ?? '';
    const status: Status | null = st.includes('❌') ? 'fail' : st.includes('⚠') ? 'warn' : st.includes('✅') ? 'ok' : null;
    if (!status) continue;
    const location = li === -1 ? '' : cells[li] ?? '';
    const sec = section ?? (() => {
      const m = location.match(/§\s?(\d+)|section\s+(\d+)/i);
      return m ? Number(m[1] ?? m[2]) : null;
    })();
    rows.push({ i: rows.length + 1, section: sec, claim: (cells[ci] ?? '').replace(/\*\*/g, ''), location, status, note: ni === -1 ? '' : cells[ni] ?? '' });
  }
  return rows;
}

// ── Matching report rows to the pre-pass claims ──────────────────────────────

const FIELD_WORDS = ['hook', 'dek', 'primer', 'title', 'intro', 'caption', 'skimcaption', 'links', 'entities', 'items', 'points', 'tiles', 'events', 'rows',
  'terms', 'annotations', 'note', 'actually', 'refvalue', 'values', 'steps', 'pairs', 'equals', 'cards', 'bars', 'series', 'quote', 'paragraphs', 'lead',
  'source', 'sourcerefs'];

/** The fields a report row's location names: "caption", "`terms[1]`", "`data.links`" → ["caption"], ["terms[1]"], ["links"]. */
function fieldFilter(location: string): string[] {
  const loc = location.toLowerCase().replace(/`/g, '');
  return FIELD_WORDS.flatMap((w) => {
    const indexed = [...loc.matchAll(new RegExp(`(?:^|[^a-z])${w}\\[(\\d+)\\]`, 'g'))].map((m) => `${w}[${m[1]}]`);
    if (indexed.length) return indexed;
    return new RegExp(`(^|[^a-z])${w}([^a-z]|$)`).test(loc) ? [w] : [];
  });
}

function fieldMatches(c: ClaimResult, fields: string[]): boolean {
  const f = c.field.toLowerCase();
  return fields.some((w) => f === w || f.includes(`.${w}`) || (w === 'caption' && c.type === 'caption'));
}

function similarity(a: ClaimFeatures, b: ClaimFeatures): number {
  let score = 0;
  const seen = new Set<string>();
  for (const t of a.nums) {
    if (seen.has(t.keys[0])) continue;
    if (b.nums.some((u) => u.keys.some((k) => t.keys.includes(k)))) { score += t.temporal ? 2 : 5; seen.add(t.keys[0]); }
  }
  for (const w of a.words) if (b.words.has(w)) score += a.caps.has(w) ? 2 : 1;
  return score;
}

/** A report row lands on claims, or (a row about a `source` / `sourceRefs`) on its section's source-line check. */
interface Match { row: ReportRow; claims: ClaimResult[]; source: SourceLineCheck | null }

function matchRows(rows: ReportRow[], claims: ClaimResult[], sourceLines: SourceLineCheck[]): Match[] {
  const cf = new Map(claims.map((c) => [c.n, featuresOf(c.text)]));
  return rows.map((row) => {
    const fields = fieldFilter(row.location);
    if (fields.includes('source') || fields.includes('sourcerefs')) {
      return { row, claims: [], source: sourceLines.find((s) => s.section === row.section) ?? null };
    }
    const rf = featuresOf(`${row.claim}`);
    let pool = claims.filter((c) => row.section === null || c.section === row.section);
    const byField = fields.length ? pool.filter((c) => fieldMatches(c, fields)) : [];
    const filtered = byField.length > 0;
    if (filtered) pool = byField;
    const scored = pool.map((c) => ({ c, s: similarity(rf, cf.get(c.n)!) + (filtered ? 3 : 0) })).sort((x, y) => y.s - x.s);
    const best = scored[0]?.s ?? 0;
    const min = filtered ? 5 : 7;
    if (best < min) return { row, claims: [], source: null };
    return { row, claims: scored.filter((x) => x.s >= Math.max(min, 0.8 * best)).map((x) => x.c), source: null };
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const slugArg = flagValue(args, 'slug');
  if (!slugArg) fail('Usage: npx tsx scripts/jev-pilot.ts --slug <issue-dir-or-slug> [--draft <path>] [--dossier <path>] [--report <path>] [--no-panel] [--threshold 0.9]');
  if (!jevAvailable()) fail(`Jev is not configured. ${jevUnavailableReason()}`, 2);

  const started = Date.now();
  const issue = findIssueDir(slugArg);
  const draftPath = flagValue(args, 'draft') ? abs(flagValue(args, 'draft')!) : issue?.file;
  if (!draftPath || !existsSync(draftPath)) fail(`No issue for --slug ${slugArg} (or --draft does not exist).`);
  const fm = matter(readFileSync(draftPath, 'utf-8')).data as { topic?: string; id?: string };
  const category = fm.topic;
  if (!category) fail(`${draftPath} has no topic.`);
  const bare = bareSlug(issue?.dirName ?? fm.id ?? slugArg);
  const dossierPath = flagValue(args, 'dossier') ? abs(flagValue(args, 'dossier')!) : findResearchFile(category, '-dossier.md', bare);
  if (!dossierPath || !existsSync(dossierPath)) fail(`No dossier for ${bare} (pass --dossier).`);
  const reportPath = flagValue(args, 'report') ? abs(flagValue(args, 'report')!) : findResearchFile(category, '-verification.md', bare);
  if (!reportPath || !existsSync(reportPath)) fail(`No verification report for ${bare} (pass --report).`);
  const thresholdArg = flagValue(args, 'threshold');
  const threshold = thresholdArg ? Number(thresholdArg) : 0.9;
  const today = todayIST();
  const outPath = flagValue(args, 'out') ? abs(flagValue(args, 'out')!) : join(REPO_ROOT, 'research', category, `${today}-${bare}-jevpilot.md`);
  const passPath = flagValue(args, 'jevpass') ? abs(flagValue(args, 'jevpass')!) : join(REPO_ROOT, 'research', category, `${today}-${bare}-jevpass.md`);
  const sameAsIssue = issue ? readFileSync(issue.file, 'utf-8').replace(/\r/g, '').trim() === readFileSync(draftPath, 'utf-8').replace(/\r/g, '').trim() : null;

  // 1. The pre-pass.
  const v: JevVerifyResult = await runJevVerify({ draftPath, dossierPath, outPath: passPath, threshold, use: 'pilot', tag: 'verify' });

  // 2. Read it against the report.
  const rows = parseVerificationReport(readFileSync(reportPath, 'utf-8'));
  const matches = matchRows(rows, v.claims, v.sourceLines);
  const routed = (c: ClaimResult, t = threshold) => !(c.verdict === 'supports' && c.p >= t);
  const flagged = (c: ClaimResult) => c.codeFlags.length > 0;
  const onClaims = (m: Match) => m.claims.length > 0;
  const onSource = (m: Match) => m.source !== null;
  // Routed by anything: Jev, a claim's code flag, or the section's source-line check.
  const caught = (m: Match) => (m.source ? m.source.flags.length > 0 : m.claims.some((c) => routed(c) || flagged(c)));
  const problems = matches.filter((m) => m.row.status !== 'ok');
  const oks = matches.filter((m) => m.row.status === 'ok');
  const claimProblems = problems.filter(onClaims);
  const sourceProblems = problems.filter(onSource);
  const matchedProblems = problems.filter((m) => onClaims(m) || onSource(m));
  const matchedOks = oks.filter(onClaims);
  const sourceOks = oks.filter(onSource);
  const caughtJev = claimProblems.filter((m) => m.claims.some((c) => routed(c)));
  const caughtAny = matchedProblems.filter(caught);
  const okAgreed = matchedOks.filter((m) => m.claims.every((c) => !routed(c)));
  const okClean = matchedOks.filter((m) => m.claims.every((c) => !routed(c) && !flagged(c)));

  // The labelled set: each claim takes the worst status of the rows it matched.
  const rank: Record<Status, number> = { ok: 0, warn: 1, fail: 2 };
  const label = new Map<number, Status>();
  for (const m of matches) for (const c of m.claims) {
    const prev = label.get(c.n);
    if (!prev || rank[m.row.status] > rank[prev]) label.set(c.n, m.row.status);
  }
  const labelled = v.claims.filter((c) => label.has(c.n) && c.verdict !== 'error');
  const sweep = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.99].map((t) => {
    const prob = labelled.filter((c) => label.get(c.n) !== 'ok');
    const ok = labelled.filter((c) => label.get(c.n) === 'ok');
    const r = (c: ClaimResult) => routed(c, t);
    const routedAll = v.claims.filter((c) => r(c) || flagged(c)).length;
    return {
      t,
      problemsRouted: prob.filter(r).length, problemsRoutedOrFlagged: prob.filter((c) => r(c) || flagged(c)).length, problems: prob.length,
      okPassed: ok.filter((c) => !r(c)).length, oks: ok.length,
      routedShare: routedAll / v.claims.length,
    };
  });
  const routedClaims = v.claims.filter((c) => routed(c) || flagged(c));
  const routedLabelledProblems = routedClaims.filter((c) => label.get(c.n) && label.get(c.n) !== 'ok').length;
  const routedLabelled = routedClaims.filter((c) => label.has(c.n)).length;

  // 3. The panel grade, every pass on file.
  const panels: JevPanelResult[] = [];
  if (!args.includes('--no-panel')) {
    const storyboard = findResearchFile(category, '-storyboard.md', bare);
    for (const suffix of ['-panel.md', '-panel-2.md']) {
      const p = findResearchFile(category, suffix, bare);
      if (!p || !storyboard) continue;
      panels.push(await runJevPanel({ storyboardPath: storyboard, panelPath: p, outPath: p.replace(/\.md$/, '.jev.md'), threshold, use: 'pilot', tag: 'panel', slug: bare }));
    }
  }

  const usd = v.cost.usd + panels.reduce((s, p) => s + p.cost.usd, 0);
  const calls = v.cost.calls + panels.reduce((s, p) => s + p.cost.calls, 0);
  const ms = Date.now() - started;
  const byStatus = (s: Status) => rows.filter((r) => r.status === s).length;

  // 4. The report.
  const line = (m: Match) => {
    const where = `${m.row.section === null ? '?' : m.row.section === 0 ? 'head' : `§${m.row.section}`} · ${cell(m.row.location).slice(0, 40)}`;
    if (m.source) {
      const s = m.source;
      return `| ${icon(m.row.status)} | ${cell(m.row.claim).slice(0, 110)} | ${where} | source-line check: ${s.flags.length ? cell(s.flags.join(' · ')).slice(0, 140) : 'clean'} | ${s.flags.length ? 'code (source line)' : 'missed'} |`;
    }
    const cs = m.claims.map((c) => `#${c.n} ${c.verdict === 'supports' && c.p >= threshold ? 'supported' : `${c.verdict} ${c.p.toFixed(2)}`}${c.codeFlags.length ? ' ⚑' : ''}`).join('; ') || '*not extracted*';
    const by = !m.claims.length ? '—' : m.claims.some((c) => routed(c)) ? 'Jev' : m.claims.some(flagged) ? 'code' : 'missed';
    return `| ${icon(m.row.status)} | ${cell(m.row.claim).slice(0, 110)} | ${where} | ${cs} | ${by} |`;
  };
  const kept = rel(draftPath).startsWith('research/_costs/jev-pilot/') ? ' Kept in research/_costs/jev-pilot/ (see its README).' : '';
  const md = [
    `# Jev pilot: ${v.title}`,
    '',
    `- **Draft:** ${rel(draftPath)}${sameAsIssue === false ? ', the text the verifier read. The issue file has changed since (the verifier\'s fixes).' : sameAsIssue ? ', identical to the issue file.' : ''}${kept}`,
    `- **Dossier:** ${rel(dossierPath)}`,
    `- **Verification report:** ${rel(reportPath)} (${byStatus('ok')} ✅ · ${byStatus('warn')} ⚠️ · ${byStatus('fail')} ❌ rows)`,
    `- **Pre-pass report:** ${rel(passPath)}`,
    `- **Run:** ${today} · ${v.answeredBy ?? v.route.model} via ${v.route.provider} · threshold p ≥ ${threshold.toFixed(2)}`,
    `- **Cost:** $${usd.toFixed(5)} · ${calls} Jev calls · ${(ms / 1000).toFixed(1)} s wall`,
    '',
    '## The numbers',
    '',
    `- **Claims extracted:** ${v.summary.claims}. Confident support (p ≥ ${threshold.toFixed(2)}): **${v.summary.supported} (${pct(v.summary.supported, v.summary.claims)})**. Routed to the verifier by Jev: ${v.summary.claims - v.summary.supported}. By Jev or code: ${routedClaims.length} (${pct(routedClaims.length, v.summary.claims)}).`,
    `- **Recall of problems** (report ⚠️ / ❌ rows the pre-pass routed): **${caughtJev.length} of ${claimProblems.length}** claim rows by Jev alone. **${caughtAny.length} of ${matchedProblems.length}** rows with the code checks, source lines included (the source-line check flagged ${sourceProblems.filter(caught).length} of ${sourceProblems.length} source rows). ${problems.length - matchedProblems.length} problem rows matched nothing the pre-pass checks (listed below).`,
    `  - ❌ rows: ${matchedProblems.filter((m) => m.row.status === 'fail' && caught(m)).length} of ${matchedProblems.filter((m) => m.row.status === 'fail').length} matched ❌ rows routed (${problems.filter((m) => m.row.status === 'fail').length} ❌ rows in all).`,
    `- **Agreement on ✅ rows** (every matched claim confident support): **${okAgreed.length} of ${matchedOks.length}** claim rows (${pct(okAgreed.length, matchedOks.length)}). With no code flag either: ${okClean.length}. Source-line ✅ rows left unflagged: ${sourceOks.filter((m) => !caught(m)).length} of ${sourceOks.length}. ${oks.length - matchedOks.length - sourceOks.length} ✅ rows matched nothing.`,
    `- **Source lines:** ${v.summary.sourceLines} of ${v.sourceLines.length} sections flagged.`,
    `- **Of what was routed**, ${routedLabelledProblems} of ${routedLabelled} labelled claims were real ⚠️ / ❌ (${pct(routedLabelledProblems, routedLabelled)}). The rest are the verifier's time on a clean claim.`,
    ...panels.map((p) => `- **Panel grade, ${p.panel.split('/').pop()}:** ${p.agreement.agree} of ${p.agreement.graded} agree (${pct(p.agreement.agree, p.agreement.graded)}). On Jev's confident grades, ${p.agreement.confidentAgree} of ${p.agreement.confident}.`),
    '',
    '## Threshold sweep over the labelled claims',
    '',
    `Each claim takes the worst status of the report rows it matched: ${labelled.filter((c) => label.get(c.n) !== 'ok').length} problem claims, ${labelled.filter((c) => label.get(c.n) === 'ok').length} clean ones. "Routed" = not confident support at that threshold.`,
    '',
    '| Threshold | Problems routed by Jev | … or code-flagged | Clean claims passed | Share of all claims sent to the verifier |',
    '|---|---|---|---|---|',
    ...sweep.map((s) => `| ${s.t.toFixed(2)} | ${s.problemsRouted} of ${s.problems} | ${s.problemsRoutedOrFlagged} of ${s.problems} | ${s.okPassed} of ${s.oks} | ${Math.round(s.routedShare * 100)}% |`),
    '',
    '## Every problem row in the report',
    '',
    '| | Report claim | Where | Pre-pass claims matched | Routed by |',
    '|---|---|---|---|---|',
    ...problems.map(line),
    '',
    '## ✅ rows the pre-pass did not confidently support',
    '',
    '| | Report claim | Where | Pre-pass claims matched | Routed by |',
    '|---|---|---|---|---|',
    ...[...matchedOks, ...sourceOks].filter(caught).map(line),
    '',
    '## Source lines, section by section',
    '',
    '| § | Source line | Cites | Check | Report rows on this source |',
    '|---|---|---|---|---|',
    ...v.sourceLines.map((s) => {
      const onIt = matches.filter((m) => m.source === s).map((m) => icon(m.row.status)).join(' ') || '—';
      return `| ${s.section} ${s.kind} | ${cell(s.line ?? '—')} | ${cell(s.publishers.join(', ') || '—')} | ${s.flags.length ? cell(s.flags.join(' · ')) : 'clean'} | ${onIt} |`;
    }),
    '',
    '## The labelled set (for calibration, CP-06)',
    '',
    '| # | Label | Verdict | p(supports) | p(pick) | Code flags | Claim |',
    '|---|---|---|---|---|---|---|',
    ...v.claims.map((c) => `| ${c.n} | ${icon(label.get(c.n) ?? null)} | ${c.verdict} | ${(c.probabilities.supports ?? 0).toFixed(2)} | ${c.p.toFixed(2)} | ${cell(c.codeFlags.join(' · ')) || '—'} | ${cell(c.text).slice(0, 100)} |`),
    '',
  ].join('\n');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, md);

  console.log(`\n  jev pilot · ${v.title}`);
  console.log(`  report rows: ${byStatus('ok')} ✅ · ${byStatus('warn')} ⚠️ · ${byStatus('fail')} ❌   claims: ${v.summary.claims}`);
  console.log(`  confident support: ${v.summary.supported} of ${v.summary.claims} (${pct(v.summary.supported, v.summary.claims)})`);
  console.log(`  recall of problems: ${caughtJev.length}/${claimProblems.length} claim rows by Jev · ${caughtAny.length}/${matchedProblems.length} rows with code (source rows ${sourceProblems.filter(caught).length}/${sourceProblems.length}) · ${problems.length - matchedProblems.length} matched nothing`);
  console.log(`  ❌ rows routed: ${matchedProblems.filter((m) => m.row.status === 'fail' && caught(m)).length}/${problems.filter((m) => m.row.status === 'fail').length}`);
  console.log(`  ✅ agreement: claims ${okAgreed.length}/${matchedOks.length} · source lines ${sourceOks.filter((m) => !caught(m)).length}/${sourceOks.length} unflagged · routed share ${pct(routedClaims.length, v.summary.claims)} · routed that were real: ${routedLabelledProblems}/${routedLabelled}`);
  for (const p of panels) console.log(`  panel ${p.panel.split('/').pop()}: ${p.agreement.agree}/${p.agreement.graded} agree · confident ${p.agreement.confidentAgree}/${p.agreement.confident}`);
  console.log(`  cost: $${usd.toFixed(5)} · ${calls} calls · ${(ms / 1000).toFixed(1)} s`);
  console.log(`  pilot report: ${rel(outPath)}\n`);
}

main().catch((err) => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
