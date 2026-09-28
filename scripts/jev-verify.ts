#!/usr/bin/env node
/**
 * The Jev pre-pass before the verifier (docs/COST-PLAN.md CP-06, job b).
 *
 *   npx tsx scripts/jev-verify.ts --slug <issue-dir-or-slug> [flags]
 *
 *   --slug <s>         the issue directory (2026-09-21-premier-league-squad-cost-ratio)
 *                      or its bare slug (premier-league-squad-cost-ratio)
 *   --dossier <path>   default: the newest research/<topic>/<date>-<slug>-dossier.md
 *   --draft <path>     default: src/content/issues/<dir>/index.mdx (pass a saved copy to
 *                      re-run the pre-pass on the text a verifier actually read)
 *   --out <path>       default: research/<topic>/<today>-<slug>-jevpass.md
 *   --threshold <p>    the "confident" line, default JEV_THRESHOLD_VERIFY or 0.90
 *   --use <verify|pilot>  the ledger tag, default verify
 *   --json             print the result object instead of the summary
 *
 * Writes the report, prints the summary, and appends one line per Jev call to
 * research/_costs/jev-ledger.jsonl. Bills JEV_API_KEY (OpenRouter) by default,
 * about a cent an issue, never ANTHROPIC_API_KEY. Exits 2 with no Jev key,
 * 1 if the files cannot be found or every call failed.
 */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import matter from 'gray-matter';
import {
  bareSlug, findIssueDir, findResearchFile, flagValue, jevAvailable, jevUnavailableReason, loadEnvLocal, todayIST, REPO_ROOT,
} from './lib/jev.js';
import type { JevUse } from './lib/jev.js';
import { runJevVerify } from './lib/jev-verify.js';

function fail(msg: string, code = 1): never {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(code);
}

const abs = (p: string) => (isAbsolute(p) ? p : resolve(process.cwd(), p));

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const slugArg = flagValue(args, 'slug');
  if (!slugArg) fail('Usage: npx tsx scripts/jev-verify.ts --slug <issue-dir-or-slug> [--dossier <path>] [--draft <path>] [--out <path>] [--threshold 0.9]');
  if (!jevAvailable()) fail(`Jev is not configured. ${jevUnavailableReason()}`, 2);

  const issue = findIssueDir(slugArg);
  const draftPath = flagValue(args, 'draft') ? abs(flagValue(args, 'draft')!) : issue?.file;
  if (!draftPath || !existsSync(draftPath)) fail(`No issue found for --slug ${slugArg} under src/content/issues/ (or --draft does not exist).`);
  const fm = matter(readFileSync(draftPath, 'utf-8')).data as { topic?: string; id?: string; status?: string };
  const category = fm.topic;
  if (!category) fail(`${draftPath} has no topic in its frontmatter.`);
  const bare = bareSlug(issue?.dirName ?? fm.id ?? slugArg);

  const dossierPath = flagValue(args, 'dossier') ? abs(flagValue(args, 'dossier')!) : findResearchFile(category, '-dossier.md', bare);
  if (!dossierPath || !existsSync(dossierPath)) fail(`No dossier research/${category}/<date>-${bare}-dossier.md (pass --dossier).`);
  const outPath = flagValue(args, 'out') ? abs(flagValue(args, 'out')!) : join(REPO_ROOT, 'research', category, `${todayIST()}-${bare}-jevpass.md`);
  const thresholdArg = flagValue(args, 'threshold');
  const threshold = thresholdArg ? Number(thresholdArg) : undefined;
  if (threshold !== undefined && !(threshold > 0 && threshold <= 1)) fail(`--threshold must be a probability in (0, 1] (got "${thresholdArg}").`);
  const use = (flagValue(args, 'use') ?? 'verify') as JevUse;
  if (use !== 'verify' && use !== 'pilot') fail(`--use must be verify or pilot (got "${use}").`);

  const result = await runJevVerify({ draftPath, dossierPath, outPath, threshold, use });
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    const s = result.summary;
    console.log(`\n  jev pre-pass · ${result.title}`);
    console.log(`  draft:    ${result.draft}${fm.status && fm.status !== 'draft' ? `  (status: ${fm.status}. Edited since its verifier read it? Pass --draft <saved copy>.)` : ''}`);
    console.log(`  dossier:  ${result.dossier}`);
    console.log(`  claims:   ${s.claims} · ${s.supported} confident support (p ≥ ${result.threshold.toFixed(2)}) · ${s.contradicts} contradicts · ${s.saysNothing} says nothing · ${s.low} low · ${s.flagged} code-flagged${s.errors ? ` · \x1b[31m${s.errors} errors\x1b[0m` : ''} · ${s.sourceLines} of ${result.sourceLines.length} source lines flagged`);
    console.log(`  cost:     $${result.cost.usd.toFixed(5)} · ${result.cost.calls} calls · ${result.cost.inputTokens.toLocaleString('en-US')} input tokens · ${(result.ms / 1000).toFixed(1)} s · ${result.answeredBy ?? result.route.model}`);
    console.log(`  report:   ${result.out}\n`);
  }
  if (result.summary.claims && result.summary.errors === result.summary.claims) process.exit(1);
}

main().catch((err) => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
