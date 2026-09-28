#!/usr/bin/env node
/**
 * Parallax pipeline CLI: the one script behind both doors (terminal and
 * slash command).
 *
 * Usage:
 *   npm run pipeline:discover    <category>
 *   npm run pipeline:research    <category>
 *   npm run pipeline:check       <category>     the dossier check pass (CP-09)
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
 *   --effort <level>     override the phase's effort (low | medium | high | xhigh | max)
 *   --count <n>          discovery: surface exactly n candidates (default 5–10)
 *   --focus "<subject>"  discovery: every candidate an angle on one subject
 *                        (exactly --count of them, 5 when --count is absent)
 *   --dry-run            assemble the prompt, print what it inlines and its size in
 *                        tokens, and exit without calling the model (bills nothing)
 *
 * The passes after research (check, storyboard, draft, panel, stylist, verify)
 * are single-shot since 2026-09-28 (docs/COST-PLAN.md CP-03): every input is
 * inlined into one prompt (scripts/lib/assemble.ts) and the agent writes its
 * one file once. The script does what the agent no longer can, in
 * scripts/lib/single-shot.ts: the drafter's check round (on the resumed
 * session), the stylist guard, applying the check pass's corrections to the
 * dossier behind the dossier guard, and the Jev hooks (CP-06).
 *
 * Which wallet pays is the `--bill` flag (the operator's ruling, 2026-09-28):
 * `api` (default) bills ANTHROPIC_API_KEY from .env.local with the CLI
 * isolated from the claude.ai login; `subscription` bills the operator's
 * Claude plan with the key stripped from the CLI's environment. The slash
 * commands are wrappers that pass `--bill subscription`. The ledger row's
 * `billedTo` says which door ran.
 */

import { join } from 'path';
import { existsSync, readFileSync, appendFileSync, mkdirSync, readdirSync, statSync } from 'fs';

import { loadAgent }                                 from './lib/agent-loader.js';
import {
  buildDiscoverPrompt,
  buildResearchPrompt,
  buildResearchTopupPrompt,
  buildCheckPrompt,
  buildStoryboardPrompt,
  buildDraftPrompt,
  buildDraftCheckRoundPrompt,
  buildStylistPrompt,
  buildPanelPrompt,
  buildVerifyPrompt,
  findMostRecent,
  findDraftIssue,
  findIssueByTopic,
  readStatus,
}                                                    from './lib/prompts.js';
import { runAgent }                                  from './lib/runner.js';
import {
  type Assembled,
  assembled,
  draft as issueFileOf,
  nextDossierSection,
  panelReport,
  todayIST,
}                                                    from './lib/assemble.js';
import {
  type ResumeFrom,
  applyCheckPass,
  draftCheckRound,
  draftGateFlags,
  enforceStylistGuard,
  freshJevPass,
  jevPanelGrade,
  jevVerifyPrePass,
  printDryRun,
  setAsideOutputs,
  settleOutputs,
}                                                    from './lib/single-shot.js';
import {
  CONFIG, GATES, MAX_TURNS, EFFORT, MAX_BUDGET_USD, ALLOW, EFFORT_LEVELS, type EffortLevel,
}                                                    from './pipeline.config.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_PHASES     = ['discover', 'research', 'check', 'storyboard', 'draft', 'stylist', 'panel', 'verify'] as const;
const VALID_CATEGORIES = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;

type Phase    = typeof VALID_PHASES[number];
type Category = typeof VALID_CATEGORIES[number];

const PHASE_TO_AGENT: Record<Phase, keyof typeof CONFIG.models> = {
  discover:    'discovery',
  research:    'researcher',
  check:       'check',
  storyboard:  'composer',
  draft:       'drafter',
  stylist:     'stylist',
  panel:       'reader-panel',
  verify:      'verifier',
};

/** The agent definition file, where it differs from the config key: the
 *  check pass is `check` in pipeline.config.ts and `dossier-check.md` on disk. */
const AGENT_FILE: Partial<Record<Phase, string>> = {
  check: 'dossier-check',
};

const VALUED_FLAGS = ['slug', 'candidate', 'model', 'count', 'bill', 'effort', 'focus'] as const;

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
    --effort <level>    override the phase's effort: ${EFFORT_LEVELS.join(' | ')}
    --count <n>         discovery: surface exactly n candidates
    --focus "<subject>" discovery: every candidate a different structural angle on one
                        subject (exactly --count of them, 5 when --count is absent)
    --topup             research: top up the existing dossier named by --slug with what
                        its check pass asked for (spread, anchors), in place, no rewrite
    --bill <api|subscription>
                        api (default): the CLI is isolated from the machine's claude.ai
                        login so ANTHROPIC_API_KEY is its only credential. subscription:
                        the login stays and the CLI bills the operator's Claude plan.
    --verbose           print tool results as they stream
    --dry-run           assemble the prompt, print what it inlines and its size, send nothing
                        (bills nothing; panel and verify also accept a non-draft issue with --slug)

  Examples:
    npm run pipeline:discover    earth -- --count 5
    npm run pipeline:discover    sports -- --count 3 --focus "Manchester City and the financial rules"
    npm run pipeline:research    earth -- --candidate C-03
    npm run pipeline:check       earth -- --slug glacier-lake-outburst   # recompute the dossier's numbers, confirm its anchors
    npm run pipeline:storyboard  earth -- --slug glacier-lake-outburst   # then flip its Status: approved
    npm run pipeline:draft       earth -- --slug glacier-lake-outburst
    npm run pipeline:panel       earth -- --slug glacier-lake-outburst   # the comprehension gate (run again after stylist)
    npm run pipeline:stylist     earth -- --slug glacier-lake-outburst
    npm run pipeline:verify      earth -- --slug glacier-lake-outburst
    npm run pipeline:draft       earth -- --slug glacier-lake-outburst --dry-run   # the prompt, not the run

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
  // --dry-run: assemble the prompt, print its inventory and size, and exit
  // before the runner. No model is called, no ledger row is written.
  const dryRun  = rawArgs.includes('--dry-run');
  // Research only: keep the existing dossier and add what its check pass
  // asked for, instead of writing a new one (needs --slug).
  const topup   = rawArgs.includes('--topup');
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
  // A valued flag with nothing after it would otherwise be dropped in silence.
  for (const name of VALUED_FLAGS) {
    const i = rawArgs.indexOf(`--${name}`);
    if (i !== -1 && (rawArgs[i + 1] === undefined || rawArgs[i + 1].startsWith('--'))) fail(`--${name} needs a value.`);
  }

  const slug          = flagValue('slug');
  const candidate     = flagValue('candidate')?.toUpperCase();
  const modelOverride = flagValue('model');
  const countArg      = flagValue('count');
  const count         = countArg ? Number(countArg) : undefined;
  const billArg       = flagValue('bill') ?? 'api';
  if (billArg !== 'api' && billArg !== 'subscription') fail(`--bill must be api or subscription (got "${billArg}").`);
  const billing       = billArg as 'api' | 'subscription';
  const effortArg     = flagValue('effort');
  if (effortArg !== undefined && !(EFFORT_LEVELS as readonly string[]).includes(effortArg)) {
    fail(`--effort must be one of ${EFFORT_LEVELS.join(', ')} (got "${effortArg}").`);
  }
  const effortOverride = effortArg as EffortLevel | undefined;
  // `--focus` takes the next argv token, so quote a subject of several words.
  const focusArg      = flagValue('focus');
  const focus         = focusArg?.replace(/\s+/g, ' ').trim();
  if (focusArg !== undefined && !focus) {
    fail('--focus needs a subject in quotes, e.g. --focus "Manchester City and the financial rules".');
  }
  if (focus && focus.length > 300) fail(`--focus is a subject, not a brief: keep it under 300 characters (got ${focus.length}).`);

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
  if (focus && phaseArg !== 'discover') {
    fail('--focus applies to the discover phase only.');
  }

  const phase    = phaseArg    as Phase;
  const category = categoryArg as Category;

  // The API door needs the key. The subscription door needs the machine's
  // claude.ai login instead, and the runner strips the key from that door's
  // environment so the two can never be confused (COST-PLAN, 2026-09-29).
  if (!dryRun && billing === 'api' && !process.env.ANTHROPIC_API_KEY) {
    fail('ANTHROPIC_API_KEY is not set.',
      '1. Copy .env.example → .env.local',
      '2. Replace the placeholder value with your real key from console.anthropic.com',
      '   (or run with --bill subscription to use the claude.ai login instead)');
  }

  // ── Load agent + model ────────────────────────────────────────────────────

  const agentName   = PHASE_TO_AGENT[phase];
  const model       = modelOverride ?? CONFIG.models[agentName];
  const effort      = effortOverride ?? EFFORT[agentName];
  const cwd         = process.cwd();
  const agent       = loadAgent(AGENT_FILE[phase] ?? agentName);
  const researchDir = join(cwd, 'research', category);
  const slugHint    = slug ? ` matching --slug ${slug}` : '';

  // ── Build prompt (with pre-flight checks) ────────────────────────────────

  let prompt: string;
  // The single-shot passes build an Assembled (the text plus an inventory of
  // what it inlined, for --dry-run); the two loops build a plain string.
  let built: Assembled | null = null;
  // What the script checks after a single-shot pass (scripts/lib/single-shot.ts).
  let draftPlan: { dossierFile: string; storyboardFile: string } | null = null;
  let stylistSnapshot: { issueRel: string; text: string } | null = null;
  let checkPlan: { dossierRel: string; snapshot: string } | null = null;
  let panelPlan: { storyboardRel: string; slug: string } | null = null;
  // Panel and verify read a DRAFT issue. A dry run may inspect any issue that
  // --slug names, so a published one can be measured without a real run.
  const issueToRead = (): { dir: string | null; nonDraft: boolean } => {
    const d = findDraftIssue(cwd, category, slug);
    if (d || !dryRun || !slug) return { dir: d, nonDraft: false };
    const any = findIssueByTopic(cwd, category, slug);
    return { dir: any, nonDraft: !!any };
  };
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
    prompt = buildDiscoverPrompt(category, count, focus);

  } else if (phase === 'research') {
    const candidatesFile = findMostRecent(researchDir, '-candidates.md');
    if (!candidatesFile) {
      fail(`No candidates file found in research/${category}/`,
        `Run first: npm run pipeline:discover ${category}`);
    }
    const text = readFileSync(join(researchDir, candidatesFile), 'utf-8');
    if (topup) {
      if (!slug) fail('--topup needs --slug <dossier-slug>: it tops up one existing dossier.');
      const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
      if (!dossierFile) fail(`No dossier found in research/${category}/${slugHint}`);
      const checkFile = findMostRecent(researchDir, '-check.md', slug);
      targetSlug = slugOf(dossierFile, '-dossier.md');
      prompt = buildResearchTopupPrompt(category, dossierFile, checkFile, candidatesFile);
    } else {
      if (candidate) {
        if (!new RegExp(`^##\\s+${candidate}\\b`, 'm').test(text)) {
          fail(`Candidate ${candidate} is not in research/${category}/${candidatesFile}.`);
        }
      } else if (!/^\s*-\s*\*\*status:\*\*\s*chosen\s*$/im.test(text)) {
        fail(`No candidate with status: chosen in research/${category}/${candidatesFile}.`,
          'Flip one `status: open` → `status: chosen`, or pass --candidate C-NN.');
      }
      prompt = buildResearchPrompt(category, candidatesFile, candidate);
    }

  } else if (phase === 'check') {
    // The dossier check pass (COST-PLAN CP-09): after research, before the
    // storyboard, on every dossier. It writes only its report. After the run
    // the script applies the report's §6 corrections to this snapshot of the
    // dossier, behind the dossier guard (COST-PLAN §12.5 item 1).
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`,
        `Run first: npm run pipeline:research ${category}`);
    }
    targetSlug = slugOf(dossierFile, '-dossier.md');
    const dossierRel = `research/${category}/${dossierFile}`;
    checkPlan = { dossierRel, snapshot: readFileSync(join(cwd, dossierRel), 'utf-8') };
    built = buildCheckPrompt(category, dossierFile);
    prompt = built.text;

  } else if (phase === 'storyboard') {
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug);
    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`,
        `Run first: npm run pipeline:research ${category}`);
    }
    targetSlug = slugOf(dossierFile, '-dossier.md');
    built = buildStoryboardPrompt(category, dossierFile);
    prompt = built.text;

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
    built = buildDraftPrompt(category, dossierFile, storyboardFile);
    prompt = built.text;
    draftPlan = { dossierFile, storyboardFile };

  } else if (phase === 'panel') {
    const { dir: draftSlug, nonDraft } = issueToRead();
    // The draft's own storyboard: its §6 is the quiz. Without --slug the
    // desk's newest storyboard could belong to the other issue of the round.
    const storyboardFile = findMostRecent(researchDir, '-storyboard.md', slug ?? (draftSlug ? slugOf(draftSlug) : undefined));
    if (nonDraft) console.log(`  dry run: ${draftSlug} is not a draft. Measuring it anyway.`);
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
    built = buildPanelPrompt(category, draftSlug, storyboardFile, priorReport ? 'second' : 'first');
    prompt = built.text;
    panelPlan = { storyboardRel: `research/${category}/${storyboardFile}`, slug: targetSlug };

  } else if (phase === 'stylist') {
    const issueSlug = findIssueByTopic(cwd, category, slug);
    if (!issueSlug) {
      fail(`No issue found with topic: ${category}${slugHint}`,
        `Run first: npm run pipeline:draft ${category}`);
    }
    targetSlug = slugOf(issueSlug);
    // The issue's most recent reader-panel report, first or second pass.
    const panelPath = panelReport(category, targetSlug, 'latest');
    built = buildStylistPrompt(category, issueSlug, panelPath);
    prompt = built.text;
    // The stylist guard compares every non-prose field with this afterwards.
    const issueRel = `src/content/issues/${issueSlug}/index.mdx`;
    if (!dryRun) stylistSnapshot = { issueRel, text: readFileSync(join(cwd, issueRel), 'utf-8') };

  } else {
    // verify
    const { dir: draftSlug, nonDraft } = issueToRead();
    // The draft's own dossier first: without --slug the desk's newest dossier
    // could belong to the other issue of the round.
    const dossierFile = findMostRecent(researchDir, '-dossier.md', slug ?? (draftSlug ? slugOf(draftSlug) : undefined))
      ?? (slug ? null : findMostRecent(researchDir, '-dossier.md'));
    if (nonDraft) console.log(`  dry run: ${draftSlug} is not a draft. Measuring it anyway.`);

    if (!dossierFile) {
      fail(`No dossier found in research/${category}/${slugHint}`);
    }
    if (!draftSlug) {
      fail(`No draft issue found with topic: ${category}${slugHint}`,
        `Run first: npm run pipeline:draft ${category}`);
    }
    targetSlug = slugOf(draftSlug);
    const draftRel = `src/content/issues/${draftSlug}/index.mdx`;
    // The Jev claim-support pre-pass (COST-PLAN CP-06 b), when Agent C's
    // module is present and Jev is configured. A dry run calls nothing.
    if (!dryRun) {
      await jevVerifyPrePass({
        draftRel,
        dossierRel: `research/${category}/${dossierFile}`,
        outRel: `research/${category}/${todayIST()}-${targetSlug}-jevpass.md`,
      });
    }
    built = buildVerifyPrompt(category, draftSlug, dossierFile, { jevPassPath: freshJevPass(category, targetSlug, draftRel) });
    prompt = built.text;
  }

  // ── Dry run ───────────────────────────────────────────────────────────────
  // The prompt as it would be sent, measured, and nothing else: no model is
  // called and no ledger row is written.
  if (dryRun) {
    printDryRun(`${phase} · ${category}${targetSlug ? ` · ${targetSlug}` : ''} · ${agentName} on ${model}`, built ?? assembled([prompt]));
    if (built?.out?.length) console.log(`  writes: ${built.out.join(', ')}`);
    if (checkPlan) {
      console.log(`  then:   the script applies the report's §6 corrections to ${checkPlan.dossierRel} and appends \`## §${nextDossierSection(checkPlan.snapshot)} Check pass, ${todayIST()}\`, behind the dossier guard`);
    }
    if (phase === 'draft' && draftPlan) {
      // The check round, previewed on the issue already on disk for this
      // slug: its gates run for real (they are local and free), and the
      // second request is assembled and measured, not sent. It resumes the
      // first run's session, so only the flags go out. The fresh-session
      // form is the fallback when the session cannot be resumed.
      const existing = targetSlug ? issueFileOf(targetSlug) : null;
      if (existing) {
        const gates = await draftGateFlags(existing);
        for (const t of gates.toolErrors) console.log(`  check round: ${t}`);
        const flags = gates.lines.length ? gates.lines.join('\n') : '(no flags on the issue on disk: this measures the round as if there were some)';
        printDryRun(`draft check round on the resumed session, previewed on ${existing}, ${gates.lines.length} flag(s) on it now (the session's transcript supplies everything else)`,
          buildDraftCheckRoundPrompt(existing, flags));
        printDryRun('draft check round, the fallback when the session cannot be resumed (a fresh session, every input again)',
          buildDraftPrompt(category, draftPlan.dossierFile, draftPlan.storyboardFile, { firstDraft: existing, flags }));
        for (const l of gates.lines) console.log(`    ${l}`);
      } else {
        console.log('  (no issue file exists for this slug yet, so the check round cannot be previewed)');
      }
    }
    return;
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
  console.log(`  effort:   ${effort}${effortOverride ? ' (--effort override)' : ''} · stops at $${MAX_BUDGET_USD[agentName]} (SDK estimate) or ${MAX_TURNS[agentName]} turns`);
  if (focus) console.log(`  focus:    ${focus}`);
  console.log(`  bills to: ${billing === 'api' ? 'ANTHROPIC_API_KEY (CLI isolated from the login)' : '\x1b[33mthe operator\'s Claude subscription (--bill subscription)\x1b[0m'}`);
  console.log(`  cwd:      ${cwd}`);
  console.log(`${LINE}\n`);

  // ── Run ───────────────────────────────────────────────────────────────────

  // One call, the same model, tools, effort, caps, cwd and billing every
  // time, so a resumed call finds its session (the transcript lives under
  // the billing route's config dir) and reads its prefix back from the cache.
  const runOnce = (text: string, resume?: ResumeFrom, out: string[] | undefined = built?.out) => runAgent({
    agent, prompt: text, model, cwd, verbose,
    maxTurns: MAX_TURNS[agentName],
    maxBudgetUsd: MAX_BUDGET_USD[agentName],
    effort,
    allow: ALLOW[agentName],
    billing,
    // A single-shot pass ends at the Write of its planned output (runner.ts,
    // `stopAfterWrite`, 2026-09-29). The loops build no Assembled, so `out` is
    // undefined for them and they run to their own end.
    ...(out?.length ? { stopAfterWrite: out } : {}),
    ...(resume ? { resume: resume.sessionId, resumeFrom: resume.from } : {}),
  });
  // A single-shot pass Writes without reading, and the Write tool will not
  // overwrite an unread file, so an output that already exists is set aside
  // for the run and put back if the agent did not replace it.
  const runStartedMs = Date.now();
  const setAside = setAsideOutputs(built?.out);
  let result = await runOnce(prompt).finally(() => settleOutputs(setAside));

  // ── After a single-shot pass (scripts/lib/single-shot.ts) ─────────────────

  // The drafter's check round (CP-03): check:prose and the schema check on
  // the first draft. If either flags something, one more request carries the
  // flags, on the first run's resumed session (COST-PLAN §12.5 item 2). Both
  // runs land in this invocation's one ledger row, with `resumed` set.
  if (phase === 'draft' && draftPlan && result.success) {
    const planned = built?.out?.[0];
    // The planned path, or else this slug's newest issue file if THIS run
    // wrote it (never an older issue that happens to share the slug).
    const fallback = targetSlug ? issueFileOf(targetSlug) : null;
    const written = planned && existsSync(join(cwd, planned))
      ? planned
      : (fallback && statSync(join(cwd, fallback)).mtimeMs >= runStartedMs ? fallback : null);
    if (!written) {
      console.log(`\n  \x1b[33mcheck round:\x1b[0m the drafter wrote no issue file for ${targetSlug}. Nothing to check.`);
    } else {
      const gates = await draftGateFlags(written);
      for (const t of gates.toolErrors) console.log(`\n  \x1b[33mcheck round:\x1b[0m ${t}`);
      if (!gates.lines.length) {
        console.log(`\n  check round: check:prose and the schema check are clean on ${written}. No second request.`);
      } else {
        console.log(`\n  check round: ${gates.lines.length} flag(s) on ${written}. One more drafter request carries them:`);
        for (const l of gates.lines) console.log(`    ${l}`);
        const flags = gates.lines.join('\n');
        const plan = draftPlan;
        ({ result } = await draftCheckRound({
          first: result,
          resumePrompt: buildDraftCheckRoundPrompt(written, flags),
          freshPrompt: () => buildDraftPrompt(category, plan.dossierFile, plan.storyboardFile, { firstDraft: written, flags }),
          run: runOnce,
        }));
        const after = await draftGateFlags(written);
        console.log(after.lines.length ? `\n  check round: ${after.lines.length} flag(s) remain, for the operator:` : '\n  check round: clean after the second request.');
        for (const l of after.lines) console.log(`    ${l}`);
      }
    }
  }

  // The stylist guard: every field outside the stylist's list must match the
  // snapshot, or the snapshot is restored and the rewrite kept aside.
  if (phase === 'stylist' && stylistSnapshot) {
    const g = enforceStylistGuard(stylistSnapshot.issueRel, stylistSnapshot.text);
    console.log(`\n  ${g.outcome === 'rejected' ? '\x1b[31m' : ''}${g.report}\x1b[0m`);
    if (g.outcome === 'rejected') process.exitCode = 4;
  }

  // The check pass wrote its report only. The script applies the report's §6
  // corrections to the dossier as it stood before the run, appends the
  // `## §N Check pass` section, and writes the dossier only when the dossier
  // guard accepts the result. Only this run's report counts: an earlier one
  // put back by settleOutputs was applied by its own run.
  if (phase === 'check' && checkPlan) {
    const reportRel = built?.out?.[0];
    const reportFresh = !!reportRel && existsSync(join(cwd, reportRel)) && statSync(join(cwd, reportRel)).mtimeMs >= runStartedMs;
    console.log(reportRel && existsSync(join(cwd, reportRel)) ? `\n  check report: ${reportRel}${reportFresh ? '' : ' (not written by this run)'}` : `\n  \x1b[33mcheck report: none was written${reportRel ? ` at ${reportRel}` : ''}\x1b[0m`);
    if (reportRel) {
      const c = applyCheckPass({ dossierRel: checkPlan.dossierRel, reportRel, snapshot: checkPlan.snapshot, date: todayIST(), reportFresh });
      for (const l of c.lines) console.log(`  ${c.outcome === 'rejected' && l.startsWith('dossier guard') ? '\x1b[31m' : ''}${l}\x1b[0m`);
      if (c.needsOperator) process.exitCode = 4;
    }
  }

  // The Jev quiz grade after a panel (CP-06 c): advisory, beside the panel's
  // own grades, never instead of them.
  if (phase === 'panel' && panelPlan && result.success && built?.out?.[0]) {
    await jevPanelGrade({
      storyboardRel: panelPlan.storyboardRel,
      panelRel: built.out[0],
      // The name scripts/jev-panel.ts gives it too: the panel report's, with .jev.md.
      outRel: built.out[0].replace(/\.md$/, '.jev.md'),
      slug: panelPlan.slug,
    });
  }

  // ── Footer ────────────────────────────────────────────────────────────────

  const totalSec = Math.floor(result.durationMs / 1000);
  const mins     = Math.floor(totalSec / 60);
  const secs     = totalSec % 60;
  const duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const u = result.usage;
  const k = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const usd = (n: number) => `$${n.toFixed(4)}`;

  // ── Cost ledger ───────────────────────────────────────────────────────────
  // One JSON line per agent run, FAILED RUNS INCLUDED → research/_costs/
  // ledger.jsonl. `npm run pipeline:costs` totals it per issue and per agent
  // (operator's request, 2026-09-16: ground truth, not the estimate).
  // COST-PLAN CP-01 (signed 2026-09-28): `costUsd` (= `costUsdList`) is the
  // LIST price of every request the run made — main loop, compaction, web
  // helpers — from the token split and the 5-minute / 1-hour cache split
  // (scripts/lib/pricing.ts). `costUsdSdk` keeps the SDK's own client-side
  // estimate beside it. Rows before 2026-09-28 carry only the SDK's estimate,
  // in `costUsd`. Research learns its slug only now, from the dossier it just
  // wrote; discovery belongs to the desk.
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
    costUsdList: result.costUsd,
    costUsdSdk: result.costUsdSdk,
    // Main-loop tokens (compaction, web helpers and subagents are in modelUsage).
    inputTokens: u.inputTokens,
    cacheWriteTokens: u.cacheWriteTokens,
    cacheReadTokens: u.cacheReadTokens,
    outputTokens: u.outputTokens,
    cacheWrite5mTokens: u.cacheWrite5mTokens,
    cacheWrite1hTokens: u.cacheWrite1hTokens,
    // API requests (not turns) and the fixed prefix the first one carried.
    requests: result.requests,
    firstRequestTokens: result.firstRequestTokens,
    webSearches: u.webSearches,
    webFetches: u.webFetches,
    turns: u.turns,
    durationMs: result.durationMs,
    stopReason: result.stopReason,
    ...(result.errorKind ? { errorKind: result.errorKind, error: result.errorMessage } : {}),
    ...(result.terminalReason ? { terminalReason: result.terminalReason } : {}),
    effort,
    maxBudgetUsd: MAX_BUDGET_USD[agentName],
    ...(focus ? { focus } : {}),
    sdkVersion: result.sdkVersion,
    cliVersion: result.cliVersion,
    sessionId: result.sessionId,
    // The drafter's check round: true when it ran on the first run's resumed
    // session, false when it fell back to a fresh one. Absent without a round.
    ...(result.resumed !== undefined ? { resumed: result.resumed } : {}),
    // Per model, every request: { in, cw, cr, out, web, usdSdk, usdList }.
    modelUsage: result.modelUsage,
    ...(result.unpricedModels.length ? { unpricedModels: result.unpricedModels } : {}),
    ...(result.permissionDenials.length ? { denied: result.permissionDenials } : {}),
    ...(result.instructionsLoaded.length ? { instructionsLoaded: result.instructionsLoaded } : {}),
    ...(result.compactions ? { compactions: result.compactions } : {}),
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
  } else if (result.stopReason === 'error_max_budget_usd') {
    console.log(`\x1b[31m  stopped: the $${MAX_BUDGET_USD[agentName]} budget for ${agentName}\x1b[0m (SDK estimate) — the run is in the ledger; check whether its output file was written before re-running`);
  } else if (result.stopReason === 'error_max_turns') {
    console.log(`\x1b[31m  stopped: the turn cap of ${MAX_TURNS[agentName]} for ${agentName}\x1b[0m — the run is in the ledger; check whether its output file was written before re-running`);
  } else {
    console.log(`\x1b[31m  stopped: ${result.stopReason}${result.errorKind ? ` (${result.errorKind})` : ''}\x1b[0m — the run is in the ledger`);
  }
  console.log(`${LINE}`);
  console.log(`  cost:     \x1b[33m${usd(result.costUsd)} at list price\x1b[0m · SDK estimate ${result.costUsdSdk === null ? 'not reported (no result message)' : usd(result.costUsdSdk)}`);
  console.log(`  tokens:   in ${k(u.inputTokens)} · cache write ${k(u.cacheWriteTokens)}${u.cacheWrite1hTokens ? ` (1h ${k(u.cacheWrite1hTokens)})` : ''} · cache read ${k(u.cacheReadTokens)} · out ${k(u.outputTokens)} · ${result.requests} requests · ${u.turns} turns${u.webSearches ? ` · ${u.webSearches} web searches` : ''}${u.webFetches ? ` · ${u.webFetches} fetches` : ''}`);
  console.log(`  prefix:   first request ${result.firstRequestTokens === null ? 'n/a' : k(result.firstRequestTokens)} tokens · effort ${effort} · SDK ${result.sdkVersion ?? '?'} / CLI ${result.cliVersion ?? '?'}`);
  const models = Object.entries(result.modelUsage);
  if (models.length > 1) {
    console.log(`  models:   ${models.map(([m, s]) => `${m} ${usd(s.usdList)}`).join(' · ')}`);
  }
  if (result.permissionDenials.length) {
    const byTool = [...new Set(result.permissionDenials)].map(t => `${t} ×${result.permissionDenials.filter(d => d === t).length}`);
    console.log(`  \x1b[33mdenied:\x1b[0m   ${result.permissionDenials.length} call(s), each a paid request: ${byTool.join(', ')}`);
  }
  if (billing === 'api' && u.cacheWrite1hTokens > 0) {
    console.log(`  \x1b[31mwarning:\x1b[0m  1-hour cache writes on the API route. The CLI requests an hour only on a subscription login, so the key may not be what this run billed — check console.anthropic.com and scripts/lib/runner.ts (API_CONFIG_DIR).`);
  }
  if (result.instructionsLoaded.length) {
    console.log(`  \x1b[31mwarning:\x1b[0m  the CLI loaded instruction files despite settingSources: [] — ${result.instructionsLoaded.join(', ')}`);
  }
  console.log(`  duration: ${duration}`);
  console.log(`  ledger:   research/_costs/ledger.jsonl (${entry.category} · ${entry.slug} · ${entry.agent}) — npm run pipeline:costs`);
  console.log(`${LINE}\n`);

  if (!result.success) {
    if (result.errorKind === 'auth') {
      console.error('\x1b[31mError:\x1b[0m ANTHROPIC_API_KEY is missing or invalid.');
      console.error('Add it to .env.local:  ANTHROPIC_API_KEY=sk-ant-...');
      process.exit(1);
    }
    if (result.errorKind === 'model') {
      console.error(`\x1b[31mError:\x1b[0m the model "${model}" is not served. Check scripts/pipeline.config.ts against the current model list.`);
      process.exit(1);
    }
    if (result.errorKind === 'rate_limit') {
      console.error('\x1b[31mError:\x1b[0m Rate limit hit. Wait a moment and retry.');
      process.exit(2);
    }
    if (result.errorKind === 'billing') {
      console.error('\x1b[31mError:\x1b[0m the account behind this run is out of credit or usage. Top up at console.anthropic.com (API route); do not switch routes to finish the run.');
    }
    process.exit(result.errorKind === 'other' ? 1 : 3);
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal:\x1b[0m', err instanceof Error ? err.message : err);
  process.exit(1);
});
