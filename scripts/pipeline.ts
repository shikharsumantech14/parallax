#!/usr/bin/env node
/**
 * Parallax pipeline CLI — API-direct runner.
 *
 * Usage:
 *   npm run pipeline:discover    <category>
 *   npm run pipeline:research    <category>
 *   npm run pipeline:storyboard  <category>
 *   npm run pipeline:draft       <category>
 *   npm run pipeline:panel       <category>
 *   npm run pipeline:stylist     <category>
 *   npm run pipeline:verify      <category>
 *
 * Or the generic form:
 *   npm run pipeline -- <phase> <category> [--verbose]
 *
 * Flags (2026-09-16 — a desk carrying two issues in one round needs them;
 * without them every phase after research picks whichever file sorts last):
 *   --slug <slug>        target one dossier / storyboard / draft
 *                        (storyboard, draft, panel, stylist, verify)
 *   --candidate C-NN     research this candidate regardless of its status line
 *   --model <id>         override the phase's model from pipeline.config.ts
 *   --count <n>          discovery: surface exactly n candidates (default 5–10)
 *
 * All agent work bills to ANTHROPIC_API_KEY (from .env.local),
 * not to your Claude Pro plan.
 */

import { join } from 'path';
import { existsSync, readFileSync, appendFileSync, mkdirSync, readdirSync, statSync } from 'fs';

import { loadAgent }                                 from './lib/agent-loader.js';
import {
  buildDiscoverPrompt,
  buildResearchPrompt,
  buildStoryboardPrompt,
  buildDraftPrompt,
  buildStylePrompt,
  buildPanelPrompt,
  buildVerifyPrompt,
  findMostRecent,
  findDraftIssue,
  findIssueByTopic,
  readStatus,
}                                                    from './lib/prompts.js';
import { runAgent }                                  from './lib/runner.js';
import { ragMcpServer }                              from './lib/rag-mcp.js';
import { CONFIG, GATES, MAX_TURNS }                  from './pipeline.config.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_PHASES     = ['discover', 'research', 'storyboard', 'draft', 'stylist', 'panel', 'verify'] as const;
const VALID_CATEGORIES = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;

type Phase    = typeof VALID_PHASES[number];
type Category = typeof VALID_CATEGORIES[number];

const PHASE_TO_AGENT: Record<Phase, keyof typeof CONFIG.models> = {
  discover:    'discovery',
  research:    'researcher',
  storyboard:  'composer',
  draft:       'drafter',
  stylist:     'stylist',
  panel:       'reader-panel',
  verify:      'verifier',
};

const VALUED_FLAGS = ['slug', 'candidate', 'model', 'count', 'bill'] as const;

const LINE = '─'.repeat(48);

// ── Helpers ───────────────────────────────────────────────────────────────────

function printUsage(): void {
  console.error(`
\x1b[1mParallax pipeline CLI\x1b[0m

  Usage: npm run pipeline:<phase> <category> [-- flags]

  phase:    ${VALID_PHASES.join(' | ')}
  category: ${VALID_CATEGORIES.join(' | ')}

  flags:
    --slug <slug>       target one dossier / storyboard / draft when the desk holds several
                        (storyboard, draft, panel, stylist, verify)
    --candidate C-NN    research this candidate regardless of its status line
    --model <id>        override the phase's model from pipeline.config.ts
    --count <n>         discovery: surface exactly n candidates
    --bill <api|subscription>
                        api (default): the CLI is isolated from the machine's claude.ai
                        login so ANTHROPIC_API_KEY is its only credential. subscription:
                        the login stays and the CLI bills the operator's Claude plan.
    --verbose           print tool results as they stream

  Examples:
    npm run pipeline:discover    earth -- --count 5
    npm run pipeline:research    earth -- --candidate C-03
    npm run pipeline:storyboard  earth -- --slug glacier-lake-outburst   # then flip its Status: approved
    npm run pipeline:draft       earth -- --slug glacier-lake-outburst
    npm run pipeline:panel       earth -- --slug glacier-lake-outburst   # the comprehension gate (run again after stylist)
    npm run pipeline:stylist     earth -- --slug glacier-lake-outburst
    npm run pipeline:verify      earth -- --slug glacier-lake-outburst

  Or generic form:
    npm run pipeline -- discover earth --verbose
`);
}

function fail(msg: string, ...hints: string[]): never {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  for (const h of hints) console.error(`  ${h}`);
  process.exit(1);
}

/** `2026-09-16-glacier-lake-dossier.md` → `glacier-lake`; `2026-09-16-glacier-lake` → `glacier-lake`. */
function slugOf(name: string, suffix = ''): string {
  const base = suffix && name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
  return base.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/** The file in `dir` ending with `suffix` that was written most recently (mtime, not name). */
function newestByMtime(dir: string, suffix: string): string | null {
  try {
    const ranked = readdirSync(dir)
      .filter(f => f.endsWith(suffix))
      .map(f => [f, statSync(join(dir, f)).mtimeMs] as const)
      .sort((a, b) => b[1] - a[1]);
    return ranked.length ? ranked[0][0] : null;
  } catch {
    return null;
  }
}

// ── Env loader ────────────────────────────────────────────────────────────────

/**
 * Parse a .env file and force-set each KEY=VALUE into process.env,
 * overriding any values already present (e.g. Claude Code's own session token).
 * Skips blank lines and lines starting with #.
 */
function loadEnvLocal(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 1) continue;
      const key   = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (key) process.env[key] = value;
    }
  } catch {
    // .env.local is optional — silently skip if absent
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Load .env.local and force-override existing env vars.
  // Node's --env-file does NOT override vars already in the environment,
  // which is a problem because Claude Code sets ANTHROPIC_API_KEY to its
  // own session token. We need our .env.local value to take precedence.
  loadEnvLocal(join(process.cwd(), '.env.local'));

  // Parse args — strip npm/tsx boilerplate from argv. Valued flags take the
  // next token (`--slug foo`) or an `=` form (`--slug=foo`).
  const rawArgs = process.argv.slice(2);
  const verbose = rawArgs.includes('--verbose');
  const flagValue = (name: string): string | undefined => {
    const i = rawArgs.indexOf(`--${name}`);
    if (i !== -1) return rawArgs[i + 1];
    const eq = rawArgs.find(a => a.startsWith(`--${name}=`));
    return eq ? eq.slice(name.length + 3) : undefined;
  };
  const consumed = new Set<number>();
  for (const name of VALUED_FLAGS) {
    const i = rawArgs.indexOf(`--${name}`);
    if (i !== -1) consumed.add(i + 1);
  }
  const args = rawArgs.filter((a, i) => !a.startsWith('--') && !consumed.has(i));

  const slug          = flagValue('slug');
  const candidate     = flagValue('candidate')?.toUpperCase();
  const modelOverride = flagValue('model');
  const countArg      = flagValue('count');
  const count         = countArg ? Number(countArg) : undefined;
  const billArg       = flagValue('bill') ?? 'api';
  if (billArg !== 'api' && billArg !== 'subscription') fail(`--bill must be api or subscription (got "${billArg}").`);
  const billing       = billArg as 'api' | 'subscription';

  const [phaseArg, categoryArg] = args;

  // ── Validation ────────────────────────────────────────────────────────────

  if (
    !phaseArg ||
    !categoryArg ||
    !(VALID_PHASES as readonly string[]).includes(phaseArg) ||
    !(VALID_CATEGORIES as readonly string[]).includes(categoryArg)
  ) {
    printUsage();
    process.exit(1);
  }
  if (count !== undefined && (!Number.isInteger(count) || count < 1 || count > 10)) {
    fail(`--count must be a whole number from 1 to 10 (got "${countArg}").`);
  }
  if (candidate && !/^C-\d{2}$/.test(candidate)) {
    fail(`--candidate must look like C-03 (got "${candidate}").`);
  }
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(`--slug is the kebab-case slug without the date (got "${slug}").`);
  }

  const phase    = phaseArg    as Phase;
  const category = categoryArg as Category;

  if (!process.env.ANTHROPIC_API_KEY) {
    fail('ANTHROPIC_API_KEY is not set.',
      '1. Copy .env.example → .env.local',
      '2. Replace the placeholder value with your real key from console.anthropic.com');
  }

  // ── Load agent + model ────────────────────────────────────────────────────

  const agentName   = PHASE_TO_AGENT[phase];
  const model       = modelOverride ?? CONFIG.models[agentName];
  const cwd         = process.cwd();
  const agent       = loadAgent(agentName);
  const researchDir = join(cwd, 'research', category);
  const slugHint    = slug ? ` matching --slug ${slug}` : '';

  // ── Build prompt (with pre-flight checks) ────────────────────────────────

  let prompt: string;
  // The issue this run belongs to, for the cost ledger. Known before the run
  // for every phase except research (its dossier does not exist yet) and
  // discovery (which belongs to the desk, not an issue).
  let targetSlug: string | null = null;

  if (phase === 'discover') {
    const sourcesPath = join(cwd, 'research', '_sources', `${category}.md`);
    if (!existsSync(sourcesPath)) {
      fail(`Source allowlist not found: research/_sources/${category}.md`,
        'Populate the allowlist before running discovery.');
    }
    prompt = buildDiscoverPrompt(category, count);

  } else if (phase === 'research') {
    const candidatesFile = findMostRecent(researchDir, '-candidates.md');
    if (!candidatesFile) {
      fail(`No candidates file found in research/${category}/`,
        `Run first: npm run pipeline:discover ${category}`);
    }
    const text = readFileSync(join(researchDir, candidatesFile), 'utf-8');
    if (candidate) {
      if (!new RegExp(`^##\\s+${candidate}\\b`, 'm').test(text)) {
        fail(`Candidate ${candidate} is not in research/${category}/${candidatesFile}.`);
      }
    } else if (!/^\s*-\s*\*\*status:\*\*\s*chosen\s*$/im.test(text)) {
      fail(`No candidate with status: chosen in research/${category}/${candidatesFile}.`,
        'Flip one `status: open` → `status: chosen`, or pass --candidate C-NN.');
    }
    prompt = buildResearchPrompt(category, candidatesFile, candidate);

  } else if (phase === 'storyboard') {
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`,
        `Run first: npm run pipeline:research ${category}`);
    }
    targetSlug = slugOf(dossierFile, '-dossier.md');
    prompt = buildStoryboardPrompt(category, dossierFile);

  } else if (phase === 'draft') {
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`,
        `Run first: npm run pipeline:research ${category}`);
    }
    // The storyboard gate (REGISTER-PLAN RG-07). `GATES.storyboard` in
    // pipeline.config.ts is the one switch, shared with /pipeline-draft.
    const storyboardFile = findMostRecent(researchDir, '-storyboard.md', slug);
    if (!storyboardFile) {
      fail(`No storyboard found in research/${category}/${slugHint}`,
        `Run first: npm run pipeline:storyboard ${category}`);
    }
    const status = readStatus(join(researchDir, storyboardFile)) ?? 'draft';
    if (status === 'hold') {
      fail(`research/${category}/${storyboardFile} is on hold (Status: hold).`);
    }
    if (GATES.storyboard === 'required' && status !== 'approved') {
      fail(`research/${category}/${storyboardFile} has Status: ${status}.`,
        'The storyboard gate is "required": read the table, edit rows if needed, and',
        'flip it to `Status: approved`. (GATES.storyboard in scripts/pipeline.config.ts',
        'switches this to "auto" once the new rules have settled.)');
    }
    targetSlug = slugOf(dossierFile, '-dossier.md');
    prompt = buildDraftPrompt(category, dossierFile, storyboardFile);

  } else if (phase === 'panel') {
    const draftSlug      = findDraftIssue(cwd, category, slug);
    const storyboardFile = findMostRecent(researchDir, '-storyboard.md', slug);
    if (!draftSlug) {
      fail(`No draft issue found with topic: ${category}${slugHint}`,
        `Run first: npm run pipeline:draft ${category}`);
    }
    if (!storyboardFile) {
      fail(`No storyboard found in research/${category}/${slugHint} — the panel needs its three questions.`,
        `Run first: npm run pipeline:storyboard ${category}`);
    }
    targetSlug = slugOf(draftSlug);
    // A prior first-pass report, under either naming (the date-doubled form
    // was written before 2026-09-22).
    const priorReport = findMostRecent(researchDir, `-${targetSlug}-panel.md`) ?? findMostRecent(researchDir, `-${draftSlug}-panel.md`);
    prompt = buildPanelPrompt(category, draftSlug, storyboardFile, priorReport ? 'second' : 'first');

  } else if (phase === 'stylist') {
    const issueSlug = findIssueByTopic(cwd, category, slug);
    if (!issueSlug) {
      fail(`No issue found with topic: ${category}${slugHint}`,
        `Run first: npm run pipeline:draft ${category}`);
    }
    targetSlug = slugOf(issueSlug);
    const panelFile = findMostRecent(researchDir, `-${targetSlug}-panel.md`) ?? findMostRecent(researchDir, `-${issueSlug}-panel.md`);
    prompt = buildStylePrompt(category, issueSlug, panelFile ?? undefined);

  } else {
    // verify
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
    const draftSlug   = findDraftIssue(cwd, category, slug);

    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`);
    }
    if (!draftSlug) {
      fail(`No draft issue found with topic: ${category}${slugHint}`,
        `Run first: npm run pipeline:draft ${category}`);
    }
    targetSlug = slugOf(draftSlug);
    prompt = buildVerifyPrompt(category, draftSlug, dossierFile);
  }

  // ── Header ────────────────────────────────────────────────────────────────

  console.log(`\n\x1b[1m${LINE}\x1b[0m`);
  console.log(`\x1b[1m  parallax pipeline\x1b[0m`);
  console.log(`${LINE}`);
  console.log(`  phase:    \x1b[33m${phase}\x1b[0m`);
  console.log(`  category: \x1b[33m${category}\x1b[0m`);
  if (slug)      console.log(`  slug:     ${slug}`);
  if (candidate) console.log(`  candidate: ${candidate}`);
  console.log(`  agent:    ${agentName}`);
  console.log(`  model:    \x1b[36m${model}\x1b[0m${modelOverride ? ' (--model override)' : ''}`);
  console.log(`  bills to: ${billing === 'api' ? 'ANTHROPIC_API_KEY (CLI isolated from the login)' : '\x1b[33mthe operator\'s Claude subscription (--bill subscription)\x1b[0m'}`);
  console.log(`  cwd:      ${cwd}`);
  console.log(`${LINE}\n`);

  // ── Run ───────────────────────────────────────────────────────────────────

  // Expose the RAG corpus to the editorial agents (only discovery/researcher/
  // verifier list the tool in their frontmatter, so others ignore it).
  const result = await runAgent({
    agent, prompt, model, cwd, verbose,
    maxTurns: MAX_TURNS[agentName],
    billing,
    mcpServers: { parallax_rag: ragMcpServer },
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  const totalSec = Math.floor(result.durationMs / 1000);
  const mins     = Math.floor(totalSec / 60);
  const secs     = totalSec % 60;
  const duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const costStr  = result.costUsd > 0
    ? `$${result.costUsd.toFixed(4)} (actual)`
    : (result.success ? 'check console.anthropic.com' : 'NOT REPORTED (the SDK throws on a capped run) — check console.anthropic.com');
  const u = result.usage;
  const k = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  // ── Cost ledger ───────────────────────────────────────────────────────────
  // One JSON line per agent run → research/_costs/ledger.jsonl, the actual
  // dollars and tokens the SDK reports. `npm run pipeline:costs` totals it per
  // issue and per agent (operator's request, 2026-09-16: ground truth, not
  // the estimate). Research learns its slug only now, from the dossier it
  // just wrote; discovery belongs to the desk.
  if (phase === 'research') {
    const written = newestByMtime(researchDir, '-dossier.md');
    targetSlug = written ? slugOf(written, '-dossier.md') : null;
  }
  const ledgerDir  = join(cwd, 'research', '_costs');
  const ledgerPath = join(ledgerDir, 'ledger.jsonl');
  const entry = {
    at: new Date().toISOString(),
    category,
    slug: phase === 'discover' ? '(discovery)' : (targetSlug ?? '(unknown)'),
    phase,
    agent: agentName,
    model,
    candidate: candidate ?? null,
    costUsd: result.costUsd,
    inputTokens: u.inputTokens,
    cacheWriteTokens: u.cacheWriteTokens,
    cacheReadTokens: u.cacheReadTokens,
    outputTokens: u.outputTokens,
    webSearches: u.webSearches,
    webFetches: u.webFetches,
    turns: u.turns,
    durationMs: result.durationMs,
    stopReason: result.stopReason,
    // Rows before 2026-09-22 05:40 UTC carry no field here: the CLI was
    // drawing on the operator's claude.ai login, not the key (see
    // API_CONFIG_DIR in runner.ts). Their dollars are token-accurate but were
    // never charged to the API balance.
    billedTo: billing === 'api' ? 'api-key (isolated CLI)' : 'subscription (--bill subscription)',
  };
  mkdirSync(ledgerDir, { recursive: true });
  appendFileSync(ledgerPath, JSON.stringify(entry) + '\n');

  console.log(`\n\x1b[1m${LINE}\x1b[0m`);
  if (result.success) {
    console.log(`\x1b[32m  done\x1b[0m`);
  } else {
    console.log(`\x1b[31m  stopped: ${result.stopReason}\x1b[0m  (turn cap ${MAX_TURNS[agentName]} for ${agentName} — the run is in the ledger; check whether its output file was written before re-running)`);
  }
  console.log(`${LINE}`);
  console.log(`  cost:     \x1b[33m${costStr}\x1b[0m`);
  console.log(`  tokens:   in ${k(u.inputTokens)} · cache write ${k(u.cacheWriteTokens)} · cache read ${k(u.cacheReadTokens)} · out ${k(u.outputTokens)} · ${u.turns} turns${u.webSearches ? ` · ${u.webSearches} web searches` : ''}${u.webFetches ? ` · ${u.webFetches} fetches` : ''}`);
  console.log(`  duration: ${duration}`);
  console.log(`  ledger:   research/_costs/ledger.jsonl (${entry.category} · ${entry.slug} · ${entry.agent}) — npm run pipeline:costs`);
  console.log(`${LINE}\n`);
  if (!result.success) process.exit(3);
}

main().catch(err => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
