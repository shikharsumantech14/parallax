import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  type Assembled,
  type Block,
  type Part,
  allowlist,
  assembled,
  bareSlug,
  block,
  candidateEntry,
  canonSections,
  catalogBlocks,
  catalogFull,
  catalogShapes,
  checkReport,
  issueAuthoringRule,
  issueKinds,
  issueSchemaBlock,
  issueTemplate,
  jargon,
  lexicon,
  memoryDigestBlock,
  modeLibrary,
  neverPublishedLedger,
  recentStoryboardLedgers,
  sectionKindsBlock,
  storyboard as findStoryboard,
  storyboardKinds,
  storyboardQuestions,
  taxonomy,
  template,
  textBlock,
  voiceCore,
  voiceCoreSections,
} from './assemble.js';

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Today's date as YYYY-MM-DD in IST (Asia/Kolkata, UTC+5:30). */
export function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── File-finding helpers ──────────────────────────────────────────────────────

/**
 * Return the most recently-named file in `dir` whose name ends with `suffix`.
 * Files are sorted lexicographically — YYYY-MM-DD prefixes make this chronological.
 * With `slug`, only `<date>-<slug><suffix>` files qualify — the `--slug` flag
 * (2026-09-16), so a desk carrying two issues in one round targets the right
 * dossier / storyboard instead of whichever sorts last.
 * Returns the filename (not full path), or null if none found.
 */
export function findMostRecent(dir: string, suffix: string, slug?: string): string | null {
  const exact = slug ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escapeRe(slug)}${escapeRe(suffix)}$`) : null;
  try {
    const files = readdirSync(dir)
      .filter(f => f.endsWith(suffix) && (!exact || exact.test(f)))
      .sort()
      .reverse();
    return files.length > 0 ? files[0] : null;
  } catch {
    return null;
  }
}

/** An issue directory is `<date>-<slug>`; with `slug`, only that one matches. */
function slugMatches(dirName: string, slug?: string): boolean {
  if (!slug) return true;
  return dirName === slug || new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escapeRe(slug)}$`).test(dirName);
}

/**
 * Scan src/content/issues/<slug>/index.mdx for the most recent draft issue
 * matching the given topic (and slug, when given). Returns the directory name, or null.
 */
export function findDraftIssue(cwd: string, topic: string, slug?: string): string | null {
  const issuesDir = join(cwd, 'src', 'content', 'issues');
  try {
    const slugs = readdirSync(issuesDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('_'))
      .map(e => e.name)
      .filter(s => slugMatches(s, slug))
      .sort()
      .reverse(); // most recent date prefix first

    for (const s of slugs) {
      try {
        const content = readFileSync(join(issuesDir, s, 'index.mdx'), 'utf-8');
        // The drafter may quote scalars (`topic: 'space'`) — YAML allows it, so match either.
        const hasTopicMatch  = new RegExp(`^\\s*topic:\\s*['"]?${topic}['"]?\\s*$`, 'm').test(content);
        const hasDraftStatus = /^\s*status:\s*['"]?draft['"]?\s*$/m.test(content);
        if (hasTopicMatch && hasDraftStatus) return s;
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Find the most recent issue directory for a given topic (and slug, when given),
 * regardless of status. Returns the directory name, or null if none found.
 */
export function findIssueByTopic(cwd: string, topic: string, slug?: string): string | null {
  const issuesDir = join(cwd, 'src', 'content', 'issues');
  try {
    const slugs = readdirSync(issuesDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('_'))
      .map(e => e.name)
      .filter(s => slugMatches(s, slug))
      .sort()
      .reverse(); // most recent date prefix first

    for (const s of slugs) {
      try {
        const content = readFileSync(join(issuesDir, s, 'index.mdx'), 'utf-8');
        const hasTopicMatch = new RegExp(`^\\s*topic:\\s*['"]?${topic}['"]?\\s*$`, 'm').test(content);
        if (hasTopicMatch) return s;
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Read the `- **Status:** <value>` line of a storyboard (or dossier) file.
 * Returns the lower-cased value, or null when the line is absent.
 */
export function readStatus(filePath: string): string | null {
  try {
    const m = readFileSync(filePath, 'utf-8').match(/^\s*-\s*\*\*Status:\*\*\s*([a-z-]+)/im);
    return m ? m[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

// ── Prompt builders ───────────────────────────────────────────────────────────
// Each function builds the invocation prompt passed directly to the agent.
//
// The agent runs under its own system prompt (the body of .claude/agents/<name>.md),
// not the Claude Code preset, so nothing tells it today's date unless the
// prompt does. Every builder states it.
//
// The two loops (discovery, research) still gather their own inputs, on the
// web. The six passes after them (check, storyboard, draft, panel, stylist,
// verify) are SINGLE-SHOT since 2026-09-28 (docs/COST-PLAN.md CP-03): the
// builder inlines every input through `assemble.ts`, in a fixed order, and
// the agent answers once and writes its one file once. Their builders return
// an `Assembled` (text plus an inventory of what was inlined, for --dry-run).

const cwdPosix = () => process.cwd().replace(/\\/g, '/');

/** The sentence every single-shot prompt carries (CP-03). */
const SINGLE_SHOT = 'Everything you need is inlined below. Do not read files. Write your output once with Write. Do not edit agent memory.';

/** An output path as the Write tool wants it: absolute, forward slashes. */
const absPath = (rel: string): string => `${cwdPosix()}/${rel}`;

/** The numbered list of the blocks that follow, so the agent knows the order. */
function inputList(parts: Part[]): string {
  const blocks = parts.filter((p): p is Block => !!p && typeof p !== 'string');
  return blocks.map((b, i) => `${i + 1}. ${b.label} (${b.source})`).join('\n');
}

/** The closing line after the last block: the task restated where the model
 *  reads last, after 60k to 90k tokens of inputs. */
const endOfInputs = (action: string): string => `\n\n===== END OF INPUTS =====\n\n${action}\n`;

/** The slug a dossier file carries: `2026-09-17-x-y-dossier.md` → `x-y`. */
const dossierSlug = (dossierFile: string): string => bareSlug(dossierFile.replace(/-dossier\.md$/, ''));

/** The optional last line of a pass's reply (CP-05: memory is updated in a
 *  post-review pass, and this line is its input). */
const MEMORY_LINE = 'and, only if this run taught you a durable pattern, one final line headed "For the memory pass"';

/** Candidates a `--focus` run surfaces when `--count` is not given. */
export const FOCUS_DEFAULT_COUNT = 5;

export function buildDiscoverPrompt(category: string, count?: number, focus?: string): string {
  const today = todayIST();
  // `--focus` (COST-PLAN trial, 2026-09-28): every candidate is an angle on
  // one subject the operator names, so the count is always exact.
  const howMany = focus
    ? `Focus every candidate on this subject: ${focus}. Surface exactly ${count ?? FOCUS_DEFAULT_COUNT} candidates that are different structural angles on it, strongest first, each still meeting the diversity gate and the drawn-graphic rule.`
    : count
      ? `Surface **exactly ${count}** candidates, ranked strongest first.`
      : 'Surface 5–10 candidates, ranked strongest first.';
  return `Run discovery for category **${category}**. Today is ${today} (IST); apply your recency window from that date. Read the source allowlist at \`research/_sources/${category}.md\`, survey recent stories per the rules in your agent definition, and write the candidates file to \`research/${category}/${today}-candidates.md\`. ${howMany} Every candidate names at least three DRAWN-graphic kinds with the data each needs and the allowlisted source that carries it, at least one of them from the never-published ledger, and cites 4–6 allowlisted sources from at least three distinct publishers. Skip any story an issue in \`src/content/issues/\` already tells. Return a one-paragraph summary with the file path and your top pick.`;
}

export function buildResearchPrompt(category: string, candidatesFile: string, candidateId?: string): string {
  const today = todayIST();
  const which = candidateId
    ? `Research candidate **${candidateId}** — treat it as chosen regardless of its \`status\` line (the operator named it with \`--candidate\`).`
    : 'Find the candidate with `status: chosen`.';
  return `Run research for category **${category}**. Today is ${today} (IST). The candidates file is at \`research/${category}/${candidatesFile}\`. ${which} Deeply research it using the source allowlist at \`research/_sources/${category}.md\`, and write the dossier to \`research/${category}/${today}-<slug>-dossier.md\` (derive the slug from the candidate title, kebab-case, max 6 words). Follow the template at \`research/_templates/dossier.md\` exactly. The dossier's §8 must carry at least eight sources from at least five distinct publishers across at least three tiers, no publisher behind more than 40% of them; and §4 must capture the data for at least four DRAWN graphics, two of them from the never-published ledger in \`docs/generated/PROJECT-GRAPH.md\`. Write every derived number (a division, a share, a difference, a conversion) with its inputs and its formula on the same line, because a check pass recomputes each one from what you wrote. Issue independent fetches and searches together, three or four per turn. Return a one-paragraph summary with: dossier file path, the structural argument in one sentence, 3 strongest verified facts, the source spread (count · publishers · tiers), and any [UNVERIFIED] items to flag for the editor.`;
}

/**
 * The dossier check pass (CP-09): a single-shot read of a fresh dossier that
 * recomputes every derived number, confirms the anchors, lists disagreements
 * and open [UNVERIFIED] items, writes a report, and rewrites the dossier in
 * place only when it corrected something.
 */
export function buildCheckPrompt(category: string, dossierFile: string): Assembled {
  const today = todayIST();
  const slug = dossierSlug(dossierFile);
  const dossierRel = `research/${category}/${dossierFile}`;
  const reportRel = `research/${category}/${today}-${slug}-check.md`;
  const candidate = candidateEntry(category, dossierRel);
  const blocks: Part[] = [
    block('DOSSIER', dossierRel),
    candidate,
    taxonomy(),
    allowlist(category),
    template('check'),
  ];
  const head = `Run the dossier check pass on the dossier inlined below (${dossierRel}).

Today is ${today} (IST). You write at most two files, each once, with the Write tool:

1. The check report, always, to \`${absPath(reportRel)}\`, following the CHECK TEMPLATE block, with the verdict CLEAN, CORRECTIONS or BLOCKED.
2. The corrected dossier, only when you corrected something, written in full to the path it came from, \`${absPath(dossierRel)}\`: each corrected number replaced in place, every other line exactly as it stands, and a new final section \`## §10 Check pass, ${today}\` listing every change (the same list as the report's §6). When the verdict is CLEAN, do not rewrite the dossier. The script compares a rewrite with the original and restores the original if a heading, a URL or an [UNVERIFIED] marker went missing, or if the text before §10 changed by more than a few per cent.

Your jobs, in this order (your definition has the detail):
1. Recompute every derived number (a division, a share, a difference, a sum, a rate, a conversion) from the inputs the dossier states beside it. Flag each one that does not reproduce, with the correct value.
2. For every load-bearing fact, confirm that a T0 to T2 anchor URL is cited. Flag each one that has none.
3. List every place two sources disagree, and say which the dossier should carry and why.
4. List every [UNVERIFIED] item and whether its resolution path is stated.
5. Check the §8 spread line against your own count of §8.
${candidate ? '' : '\nThe candidate entry this dossier came from could not be found: judge the argument against the dossier\'s own §1 and §2.\n'}
You never add a fact and never fetch: you have no web tools. A number you cannot recompute from inputs the dossier states is flagged, never replaced.

${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(`Now write the check report to \`${absPath(reportRel)}\` with one Write call, and only if you corrected something, the corrected dossier to \`${absPath(dossierRel)}\` with one more. Then reply with four things. The verdict. The counts: derived numbers checked, reproduced, corrected and with inputs not stated, load-bearing facts without a T0 to T2 anchor, disagreements, and [UNVERIFIED] items without a resolution path. Whether you rewrote the dossier. The three lines the operator should read first.`);
  return { ...assembled([head, ...blocks, tail]), out: [reportRel, dossierRel] };
}

export function buildStoryboardPrompt(category: string, dossierFile: string): Assembled {
  const today = todayIST();
  const slug = dossierSlug(dossierFile);
  const dossierRel = `research/${category}/${dossierFile}`;
  const outRel = `research/${category}/${today}-${slug}-storyboard.md`;
  const blocks: Part[] = [
    block('DOSSIER', dossierRel),
    voiceCore(),
    catalogShapes(),
    catalogFull(),
    template('storyboard'),
    sectionKindsBlock(),
    canonSections([2, 3]),
    neverPublishedLedger(),
    recentStoryboardLedgers(slug, 30),
    memoryDigestBlock('composer'),
  ];
  const head = `Write the storyboard for the dossier inlined below (${dossierRel}).

Today is ${today} (IST). Write one file, once, with the Write tool, to \`${absPath(outRel)}\`. The slug \`${slug}\` matches the dossier's. Follow the STORYBOARD TEMPLATE block exactly, with \`Status: draft\`, and fill every section, §9 the kind ledger included. Check the §9 floors before you write: drawn graphics on at least 40% of rows with at least three distinct graphic kinds, the four plain-language cards (you-think, number-sense, jargon-buster, three-steps) at most once each and at most three in total, and at least two graphic kinds new to the publication. "New" means on the NEVER-PUBLISHED LEDGER and not marked (NEW) by another storyboard in the OTHER STORYBOARDS block. The other floors and the ceilings are in your definition, Step 3. A storyboard that misses one goes back to Step 3, not to the operator.

${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(`Now write the storyboard to \`${absPath(outRel)}\` with one Write call. Then reply with: the file path, the hero and why, the spine (kinds in order), how many rows are drawn graphics, which kinds are new to the publication, the word total budgeted, any kind you wanted and could not use for want of data, anything the operator should rule on before the draft, ${MEMORY_LINE}.`);
  return { ...assembled([head, ...blocks, tail]), out: [outRel] };
}

/** The drafter's check round: its first draft and what the gates said about it. */
export interface DraftCheckRound {
  /** The issue file the first draft wrote, repo-relative. */
  firstDraft: string;
  /** The flags, one per line, from check:prose and the schema check. */
  flags: string;
}

/**
 * The drafter. Without `round` it writes the first draft. With `round`
 * (pipeline.ts runs check:prose and the schema check on the first draft and
 * found something) it gets the same inputs plus its first draft and the
 * flags, and writes the whole file again.
 */
export function buildDraftPrompt(category: string, dossierFile: string, storyboardFile: string, round?: DraftCheckRound): Assembled {
  const today = todayIST();
  const slug = dossierSlug(dossierFile);
  const dossierRel = `research/${category}/${dossierFile}`;
  const storyboardRel = `research/${category}/${storyboardFile}`;
  const outRel = round?.firstDraft ?? `src/content/issues/${today}-${slug}/index.mdx`;
  const id = outRel.split('/').slice(-2, -1)[0];
  const check = checkReport(category, slug);
  const kinds = storyboardKinds(storyboardRel);
  if (!kinds.length) throw new Error(`No section kinds found in the §3 table of ${storyboardRel}.`);
  const blocks: Part[] = [
    block('DOSSIER', dossierRel),
    check && block('CHECK REPORT', check),
    block('STORYBOARD', storyboardRel),
    voiceCore(),
    lexicon(),
    jargon(),
    sectionKindsBlock(),
    issueSchemaBlock(),
    issueTemplate(),
    catalogBlocks(kinds),
    issueAuthoringRule(),
    memoryDigestBlock('drafter'),
    round && block('YOUR FIRST DRAFT', round.firstDraft),
    round && textBlock('GATE FLAGS from check:prose and the schema check on your first draft', 'scripts/check-prose.mjs and scripts/lib/validate-issue.ts', round.flags),
  ];
  const checkLine = check
    ? `\nA dossier check pass ran on this dossier. Its CHECK REPORT is inlined after the dossier, and the dossier you have is the corrected one (its §10, when present, lists what changed). A fact the report marks as unanchored, not reproducible or disputed is not stated as fact: drop it, or carry it the way the report says the dossier should.\n`
    : '';
  const task = round
    ? `This is the check round of the draft you wrote from the dossier inlined below (${dossierRel}) and its storyboard (${storyboardRel}). The script ran \`check:prose\` and the schema check on YOUR FIRST DRAFT, inlined near the end, and they raised the GATE FLAGS inlined after it.

Fix every flag, change nothing the flags do not touch, and Write the whole file again, once, with the Write tool, to the same path: \`${absPath(outRel)}\`. A schema error always needs a fix, because the build fails on it. A check:prose flag you judge a false positive of its heuristic: leave that text as it is and name the flag in your summary with the reason. Every rule of your definition still holds, and every fix still traces to the dossier.`
    : `Write a complete draft issue from the dossier inlined below (${dossierRel}), executing the approved storyboard inlined after it (${storyboardRel}). The storyboard fixes the kinds, the order, the hero, the word budgets and the head.

Today is ${today} (IST). Write one file, once, with the Write tool, to \`${absPath(outRel)}\`. Its frontmatter carries \`id: "${id}"\`, \`topic: ${category}\`, \`publishedAt: ${today}\` and \`status: draft\`, and the standard empty body follows it.

After you write, the script runs \`check:prose\` and the schema check on your file. If either flags something you get one more request carrying the flags, so go through your definition's Step 7 list before you write, not after.`;
  const head = `${task}
${checkLine}
${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(round
    ? `Now write the whole corrected file to \`${absPath(outRel)}\` with one Write call. Then reply with each flag and what you did about it (fixed, or left as a false positive and why), and any departure from the storyboard a fix caused.`
    : `Now write the issue file to \`${absPath(outRel)}\` with one Write call. Then reply with: the file path, the title and hook, the section count, the spine (kinds in order), the reader-facing word count and read time, any [UNVERIFIED] dossier items omitted or flagged, any departure from the storyboard and why, ${MEMORY_LINE}.`);
  return { ...assembled([head, ...blocks, tail]), out: [outRel] };
}

export function buildPanelPrompt(
  category: string,
  draftSlug: string,
  storyboardFile: string,
  pass: 'first' | 'second',
): Assembled {
  const today = todayIST();
  const bare = bareSlug(draftSlug); // the directory carries the date already
  const draftRel = `src/content/issues/${draftSlug}/index.mdx`;
  const storyboardRel = `research/${category}/${storyboardFile}`;
  const outRel = `research/${category}/${today}-${bare}-panel${pass === 'second' ? '-2' : ''}.md`;
  // The personas, the questions, the draft. Never the dossier or the rest of
  // the storyboard: the reader has neither (reader-panel.md, Step 2).
  const blocks: Part[] = [
    voiceCoreSections([1, 2]),
    storyboardQuestions(storyboardRel),
    block('THE DRAFT', draftRel),
  ];
  const head = `Read the draft inlined below (${draftRel}) as the four reader personas. This is the ${pass} pass (${pass === 'first' ? 'after the draft, before the stylist' : 'after the stylist'}).

Today is ${today} (IST). Write the report, once, with the Write tool, to \`${absPath(outRel)}\`, in the report shape of your definition. Its header names the draft as \`${draftRel}\` and the storyboard as \`${storyboardRel}\`.

You have the personas and the register (the voice contract's §1 and §2), the three questions with their model answers (the storyboard's §6), and the draft. You do not have the dossier or the rest of the storyboard, deliberately: the reader never has them either.

${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(`Now write the report to \`${absPath(outRel)}\` with one Write call. Then reply with: the verdict, one line per quiz question, the three lowest-scoring sections, and the top three fixes.`);
  return { ...assembled([head, ...blocks, tail]), out: [outRel] };
}

/**
 * The stylist. `panelFile` is the most recent reader-panel report for the
 * issue, a repo-relative path or a bare filename in research/<category>/.
 * pipeline.ts snapshots the issue before this pass and refuses the output if
 * any field outside the stylist's list moved (`scripts/lib/single-shot.ts`).
 */
export function buildStylistPrompt(category: string, issueSlug: string, panelFile?: string | null): Assembled {
  const today = todayIST();
  const bare = bareSlug(issueSlug);
  const issueRel = `src/content/issues/${issueSlug}/index.mdx`;
  const storyboardRel = findStoryboard(category, bare);
  const panelRel = panelFile ? (panelFile.includes('/') ? panelFile : `research/${category}/${panelFile}`) : null;
  const blocks: Part[] = [
    block('ISSUE FILE', issueRel),
    storyboardRel && block('STORYBOARD', storyboardRel),
    panelRel && block('READER PANEL REPORT', panelRel),
    voiceCore(),
    lexicon(),
    jargon(),
    modeLibrary(),
    // Not in the COST-PLAN list: the stylist's Step 4.6 flags `data` that does
    // not match its catalog DATA shape, which needs the shapes in hand.
    catalogBlocks(issueKinds(issueRel)),
    issueAuthoringRule(),
    memoryDigestBlock('stylist'),
  ];
  const panelLine = panelRel
    ? `The most recent reader-panel report is inlined (${panelRel}). Its "What would fix it" list is your first job. Apply every direction that is prose (a referent, a gloss, a comparison, a Hindi word that was carrying the meaning, a sentence the issue's own facts already support). Where a direction needs a fact the issue does not carry, or a change to a field outside your list, flag it under Structure flags instead of making it.`
    : 'No reader-panel report exists yet for this issue.';
  const head = `Bring the Parallax issue inlined below (${issueRel}) into the runtime voice contract and assign one rhetorical job per section.

Today is ${today} (IST). You rewrite prose fields only: each section's \`intro\`, \`skimCaption\` and \`plain\` (the last only where its wording is wrong), and inside \`data\` the \`lead\`, \`paragraphs\` and \`followup\`. Every other field stays exactly as it is: the frontmatter keys and their order, the head (title, hook, dek, primer), every \`caption\`, \`howToRead\`, section title, eyebrow, number, label, note, data value, annotation and source, the order and the kinds of the sections, and the body below the frontmatter.

Then Write the WHOLE corrected file, once, with the Write tool, to \`${absPath(issueRel)}\`. The script snapshots the file before your run and compares every field outside your list afterwards. If any of them moved, it restores the snapshot, keeps your version aside as \`_index.rejected.mdx\`, and the whole pass is lost. Copy every line you do not rewrite exactly as it stands, its quoting included.

${panelLine}
${storyboardRel ? '' : 'No storyboard exists for this issue: skip the storyboard checks in Step 4.6 and say so.\n'}
${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(`Now write the whole corrected file to \`${absPath(issueRel)}\` with one Write call. Then reply with: the job assignment table (slot · kind · eyebrow · job · rationale · fields rewritten), the job blend line, the register notes, the count of fields rewritten against retained with the reader-facing words before and after, the Structure flags from Step 4.6, ${MEMORY_LINE}.`);
  return { ...assembled([head, ...blocks, tail]), out: [issueRel] };
}

export function buildVerifyPrompt(
  category: string,
  draftSlug: string,
  dossierFile: string,
  extras: {
    /** The issue's storyboard, repo-relative. Found by slug when omitted. */
    storyboardPath?: string | null;
    /** Agent C's claim-support pre-pass report (`-jevpass.md`), repo-relative,
     *  when one exists that is newer than the draft (CP-06 b). */
    jevPassPath?: string | null;
  } = {},
): Assembled {
  const today = todayIST();
  const bare = bareSlug(draftSlug); // the directory carries the date already
  const draftRel = `src/content/issues/${draftSlug}/index.mdx`;
  const dossierRel = `research/${category}/${dossierFile}`;
  const storyboardRel = extras.storyboardPath === undefined ? findStoryboard(category, bare) : extras.storyboardPath;
  const jevRel = extras.jevPassPath ?? null;
  const outRel = `research/${category}/${today}-${bare}-verification.md`;
  const blocks: Part[] = [
    block('THE DRAFT', draftRel),
    block('DOSSIER', dossierRel),
    storyboardRel && block('STORYBOARD', storyboardRel),
    voiceCore(),
    lexicon(),
    issueAuthoringRule(),
    // Not in the COST-PLAN list: the quotability gate (Step 3, item 5) reads
    // each source's `ingest` class, which lives in the allowlist.
    allowlist(category),
    memoryDigestBlock('verifier'),
    jevRel && block('JEV PRE-PASS', jevRel),
  ];
  const jevLine = jevRel
    ? `\nA JEV PRE-PASS is inlined last (${jevRel}): a cheap classifier read each claim it extracted from the draft against the dossier. The JEV PRE-PASS orders your attention: trace every claim in its 'For the verifier' list first and in full, then trace every remaining claim as before. A confident-support verdict is a hint about where the dossier evidence sits, never a reason to skip a claim. Every count in your report is your own.\n`
    : '';
  const head = `Audit the draft issue inlined below (${draftRel}) against its dossier (${dossierRel}).

Today is ${today} (IST). Write the verification report, once, with the Write tool, to \`${absPath(outRel)}\`, in the report format of your definition.
${jevLine}${storyboardRel ? '' : '\nNo storyboard exists for this issue: skip STORYBOARD-DRIFT and QUESTION-UNANSWERED and say so in the report.\n'}
${SINGLE_SHOT}

The inputs, in this order:
${inputList(blocks)}`;
  const tail = endOfInputs(`Now write the verification report to \`${absPath(outRel)}\` with one Write call. Then reply with: the verdict (APPROVED / NEEDS REVISION / BLOCKED), the count of verified, imprecise and untraced claims, the top three issues to fix if the verdict is not APPROVED, ${MEMORY_LINE}.`);
  return { ...assembled([head, ...blocks, tail]), out: [outRel] };
}
