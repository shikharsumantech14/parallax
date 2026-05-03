#!/usr/bin/env node
/**
 * Parallax pipeline CLI — API-direct runner.
 *
 * Usage:
 *   npm run pipeline:discover <category>
 *   npm run pipeline:research <category>
 *   npm run pipeline:draft    <category>
 *   npm run pipeline:verify   <category>
 *
 * Or the generic form:
 *   npm run pipeline -- <phase> <category> [--verbose]
 *
 * All agent work bills to ANTHROPIC_API_KEY (from .env.local),
 * not to your Claude Pro plan.
 */

import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

import { loadAgent }                                 from './lib/agent-loader.js';
import {
  buildDiscoverPrompt,
  buildResearchPrompt,
  buildDraftPrompt,
  buildVerifyPrompt,
  findMostRecent,
  findDraftIssue,
}                                                    from './lib/prompts.js';
import { runAgent }                                  from './lib/runner.js';
import { CONFIG }                                    from './pipeline.config.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_PHASES     = ['discover', 'research', 'draft', 'verify'] as const;
const VALID_CATEGORIES = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;

type Phase    = typeof VALID_PHASES[number];
type Category = typeof VALID_CATEGORIES[number];

const PHASE_TO_AGENT: Record<Phase, keyof typeof CONFIG.models> = {
  discover: 'discovery',
  research: 'researcher',
  draft:    'drafter',
  verify:   'verifier',
};

const LINE = '─'.repeat(48);

// ── Helpers ───────────────────────────────────────────────────────────────────

function printUsage(): void {
  console.error(`
\x1b[1mParallax pipeline CLI\x1b[0m

  Usage: npm run pipeline:<phase> <category> [--verbose]

  phase:    ${VALID_PHASES.join(' | ')}
  category: ${VALID_CATEGORIES.join(' | ')}

  Examples:
    npm run pipeline:discover earth
    npm run pipeline:research earth
    npm run pipeline:draft    earth
    npm run pipeline:verify   earth

  Or generic form:
    npm run pipeline -- discover earth --verbose
`);
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

  // Parse args — strip npm/tsx boilerplate from argv
  const rawArgs = process.argv.slice(2);
  const args    = rawArgs.filter(a => !a.startsWith('--'));
  const verbose = rawArgs.includes('--verbose');

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

  const phase    = phaseArg    as Phase;
  const category = categoryArg as Category;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('\x1b[31mError:\x1b[0m ANTHROPIC_API_KEY is not set.');
    console.error('  1. Copy .env.example → .env.local');
    console.error('  2. Replace the placeholder value with your real key from console.anthropic.com');
    process.exit(1);
  }

  // ── Load agent + model ────────────────────────────────────────────────────

  const agentName = PHASE_TO_AGENT[phase];
  const model     = CONFIG.models[agentName];
  const cwd       = process.cwd();
  const agent     = loadAgent(agentName);

  // ── Build prompt (with pre-flight checks) ────────────────────────────────

  let prompt: string;

  if (phase === 'discover') {
    const sourcesPath = join(cwd, 'research', '_sources', `${category}.md`);
    if (!existsSync(sourcesPath)) {
      console.error(`\x1b[31mError:\x1b[0m Source allowlist not found: research/_sources/${category}.md`);
      console.error('Populate the allowlist before running discovery.');
      process.exit(1);
    }
    prompt = buildDiscoverPrompt(category);

  } else if (phase === 'research') {
    const candidatesFile = findMostRecent(join(cwd, 'research', category), '-candidates.md');
    if (!candidatesFile) {
      console.error(`\x1b[31mError:\x1b[0m No candidates file found in research/${category}/`);
      console.error(`  Run first: npm run pipeline:discover ${category}`);
      process.exit(1);
    }
    prompt = buildResearchPrompt(category, candidatesFile);

  } else if (phase === 'draft') {
    const dossierFile = findMostRecent(join(cwd, 'research', category), '-dossier.md');
    if (!dossierFile) {
      console.error(`\x1b[31mError:\x1b[0m No dossier found in research/${category}/`);
      console.error(`  Run first: npm run pipeline:research ${category}`);
      process.exit(1);
    }
    prompt = buildDraftPrompt(category, dossierFile);

  } else {
    // verify
    const dossierFile = findMostRecent(join(cwd, 'research', category), '-dossier.md');
    const draftSlug   = findDraftIssue(cwd, category);

    if (!dossierFile) {
      console.error(`\x1b[31mError:\x1b[0m No dossier found in research/${category}/`);
      process.exit(1);
    }
    if (!draftSlug) {
      console.error(`\x1b[31mError:\x1b[0m No draft issue found with topic: ${category}`);
      console.error(`  Run first: npm run pipeline:draft ${category}`);
      process.exit(1);
    }
    prompt = buildVerifyPrompt(category, draftSlug, dossierFile);
  }

  // ── Header ────────────────────────────────────────────────────────────────

  console.log(`\n\x1b[1m${LINE}\x1b[0m`);
  console.log(`\x1b[1m  parallax pipeline\x1b[0m`);
  console.log(`${LINE}`);
  console.log(`  phase:    \x1b[33m${phase}\x1b[0m`);
  console.log(`  category: \x1b[33m${category}\x1b[0m`);
  console.log(`  agent:    ${agentName}`);
  console.log(`  model:    \x1b[36m${model}\x1b[0m`);
  console.log(`  cwd:      ${cwd}`);
  console.log(`${LINE}\n`);

  // ── Run ───────────────────────────────────────────────────────────────────

  const result = await runAgent({ agent, prompt, model, cwd, verbose });

  // ── Footer ────────────────────────────────────────────────────────────────

  const totalSec = Math.floor(result.durationMs / 1000);
  const mins     = Math.floor(totalSec / 60);
  const secs     = totalSec % 60;
  const duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const costStr  = result.costUsd > 0
    ? `$${result.costUsd.toFixed(4)} (actual)`
    : 'check console.anthropic.com';

  console.log(`\n\x1b[1m${LINE}\x1b[0m`);
  console.log(`\x1b[32m  done\x1b[0m`);
  console.log(`${LINE}`);
  console.log(`  cost:     \x1b[33m${costStr}\x1b[0m`);
  console.log(`  duration: ${duration}`);
  console.log(`${LINE}\n`);
}

main().catch(err => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
