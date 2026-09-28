#!/usr/bin/env node
/**
 * The Jev panel grade (docs/COST-PLAN.md CP-06, job c): re-grade every
 * persona's quiz answer against the storyboard's model answer, one answer per
 * call, beside the panel's own grade.
 *
 *   npx tsx scripts/jev-panel.ts --slug <issue-dir-or-slug> [flags]
 *
 *   --slug <s>            the issue directory or its bare slug
 *   --pass <first|second> which panel report: <slug>-panel.md (first, default) or
 *                         <slug>-panel-2.md (second, after the stylist)
 *   --panel <path>        a panel report, instead of --pass
 *   --storyboard <path>   default: the newest research/<topic>/<date>-<slug>-storyboard.md
 *   --out <path>          default: the panel report's name with .jev.md
 *   --threshold <p>       the "confident" line, default JEV_THRESHOLD_PANEL or 0.90
 *   --use <panel|pilot>   the ledger tag, default panel
 *   --json                print the result object instead of the summary
 *
 * Twelve calls for four personas and three questions: well under a cent.
 * Exits 2 with no Jev key, 1 if the files cannot be found or every call failed.
 */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import matter from 'gray-matter';
import {
  bareSlug, findIssueDir, findResearchFile, flagValue, jevAvailable, jevUnavailableReason, loadEnvLocal,
} from './lib/jev.js';
import type { JevUse } from './lib/jev.js';
import { runJevPanel } from './lib/jev-panel.js';

const CATEGORIES = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'];

function fail(msg: string, code = 1): never {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(code);
}

const abs = (p: string) => (isAbsolute(p) ? p : resolve(process.cwd(), p));

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const slugArg = flagValue(args, 'slug');
  if (!slugArg) fail('Usage: npx tsx scripts/jev-panel.ts --slug <issue-dir-or-slug> [--pass first|second] [--panel <path>] [--storyboard <path>] [--out <path>]');
  if (!jevAvailable()) fail(`Jev is not configured. ${jevUnavailableReason()}`, 2);
  const pass = flagValue(args, 'pass') ?? 'first';
  if (pass !== 'first' && pass !== 'second') fail(`--pass must be first or second (got "${pass}").`);

  const bare = bareSlug(slugArg);
  const issue = findIssueDir(slugArg);
  let category = issue ? (matter(readFileSync(issue.file, 'utf-8')).data as { topic?: string }).topic : undefined;
  const suffix = pass === 'second' ? '-panel-2.md' : '-panel.md';
  let panelPath = flagValue(args, 'panel') ? abs(flagValue(args, 'panel')!) : null;
  if (!panelPath) {
    for (const cat of category ? [category] : CATEGORIES) {
      const found = findResearchFile(cat, suffix, bare);
      if (found) { panelPath = found; category = cat; break; }
    }
  }
  if (!panelPath || !existsSync(panelPath)) fail(`No ${pass}-pass panel report research/<topic>/<date>-${bare}${suffix} (pass --panel).`);
  if (!category) category = CATEGORIES.find((c) => panelPath!.replace(/\\/g, '/').includes(`/research/${c}/`));
  const storyboardPath = flagValue(args, 'storyboard')
    ? abs(flagValue(args, 'storyboard')!)
    : category ? findResearchFile(category, '-storyboard.md', bare) : null;
  if (!storyboardPath || !existsSync(storyboardPath)) fail(`No storyboard research/<topic>/<date>-${bare}-storyboard.md (pass --storyboard).`);
  const outPath = flagValue(args, 'out') ? abs(flagValue(args, 'out')!) : panelPath.replace(/\.md$/, '.jev.md');
  const thresholdArg = flagValue(args, 'threshold');
  const threshold = thresholdArg ? Number(thresholdArg) : undefined;
  if (threshold !== undefined && !(threshold > 0 && threshold <= 1)) fail(`--threshold must be a probability in (0, 1] (got "${thresholdArg}").`);
  const use = (flagValue(args, 'use') ?? 'panel') as JevUse;
  if (use !== 'panel' && use !== 'pilot') fail(`--use must be panel or pilot (got "${use}").`);

  const r = await runJevPanel({ storyboardPath, panelPath, outPath, threshold, use, slug: bare });
  if (args.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    const a = r.agreement;
    console.log(`\n  jev panel grade · ${r.panel}`);
    console.log(`  agreement: ${a.agree} of ${a.graded} (${Math.round(a.rate * 100)}%) · confident (p ≥ ${r.threshold.toFixed(2)}): ${a.confidentAgree} of ${a.confident}`);
    for (const x of r.answers.filter((g) => g.agree === false)) {
      console.log(`    Q${x.n} ${x.persona}: panel ${x.grade}, jev ${x.jev} (${x.p.toFixed(2)})`);
    }
    console.log(`  cost:      $${r.cost.usd.toFixed(5)} · ${r.cost.calls} calls · ${(r.ms / 1000).toFixed(1)} s`);
    console.log(`  report:    ${r.out}\n`);
  }
  if (r.answers.length && r.cost.calls === 0) process.exit(1);
}

main().catch((err) => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
