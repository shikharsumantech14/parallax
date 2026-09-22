import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

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
// These mirror the subagent prompts in .claude/commands/pipeline-*.md
// but are adapted for direct agent invocation (no orchestrator layer).
//
// The agent runs under its own system prompt (the body of .claude/agents/<name>.md),
// not the Claude Code preset, so nothing tells it today's date unless the
// prompt does. Discovery and research need it for their recency windows.

const cwdPosix = () => process.cwd().replace(/\\/g, '/');

export function buildDiscoverPrompt(category: string, count?: number): string {
  const today = todayIST();
  const howMany = count
    ? `Surface **exactly ${count}** candidates, ranked strongest first.`
    : 'Surface 5–10 candidates, ranked strongest first.';
  return `Run discovery for category **${category}**. Today is ${today} (IST); apply your recency window from that date. Read the source allowlist at \`research/_sources/${category}.md\`, survey recent stories per the rules in your agent definition, and write the candidates file to \`research/${category}/${today}-candidates.md\`. ${howMany} Every candidate names at least three DRAWN-graphic kinds with the data each needs and the allowlisted source that carries it, at least one of them from the never-published ledger, and cites 4–6 allowlisted sources from at least three distinct publishers. Skip any story an issue in \`src/content/issues/\` already tells. Return a one-paragraph summary with the file path and your top pick.`;
}

export function buildResearchPrompt(category: string, candidatesFile: string, candidateId?: string): string {
  const today = todayIST();
  const which = candidateId
    ? `Research candidate **${candidateId}** — treat it as chosen regardless of its \`status\` line (the operator named it with \`--candidate\`).`
    : 'Find the candidate with `status: chosen`.';
  return `Run research for category **${category}**. Today is ${today} (IST). The candidates file is at \`research/${category}/${candidatesFile}\`. ${which} Deeply research it using the source allowlist at \`research/_sources/${category}.md\`, and write the dossier to \`research/${category}/${today}-<slug>-dossier.md\` (derive the slug from the candidate title, kebab-case, max 6 words). Follow the template at \`research/_templates/dossier.md\` exactly. The dossier's §8 must carry at least eight sources from at least five distinct publishers across at least three tiers, no publisher behind more than 40% of them; and §4 must capture the data for at least four DRAWN graphics, two of them from the never-published ledger in \`docs/generated/PROJECT-GRAPH.md\`. Return a one-paragraph summary with: dossier file path, the structural argument in one sentence, 3 strongest verified facts, the source spread (count · publishers · tiers), and any [UNVERIFIED] items to flag for the editor.`;
}

export function buildStoryboardPrompt(category: string, dossierFile: string): string {
  const today = todayIST();
  return `Write the storyboard for this dossier: \`research/${category}/${dossierFile}\`

Follow all rules in your agent definition exactly. Write the output to \`research/${category}/${today}-<slug>-storyboard.md\` (the slug matches the dossier's), following \`research/_templates/storyboard.md\`, with \`Status: draft\`. Fill §9, the kind ledger, and check its floors before you finish.

Working directory: ${cwdPosix()}

Return: the file path, the hero and why, the spine (kinds in order), how many rows are drawn graphics, which kinds are new to the publication, the word total budgeted, any kind you wanted and could not use for want of data, and anything the operator should rule on before the draft.`;
}

export function buildDraftPrompt(category: string, dossierFile: string, storyboardFile: string): string {
  return `Write a complete draft issue from this dossier: \`research/${category}/${dossierFile}\`

Execute this storyboard — it fixes the kinds, the order, the hero, the word budgets and the head: \`research/${category}/${storyboardFile}\`

Follow all rules in your agent definition exactly. Write the output to \`src/content/issues/<id>/index.mdx\` where \`<id>\` matches the dossier slug and today's date (YYYY-MM-DD-slug format).

Working directory: ${cwdPosix()}

Return: file path written, issue title + hook, section count + read time estimate, any [UNVERIFIED] items omitted or flagged, any place the draft departs from the storyboard and why.`;
}

export function buildPanelPrompt(
  category: string,
  draftSlug: string,
  storyboardFile: string,
  pass: 'first' | 'second',
): string {
  const today = todayIST();
  const bare = draftSlug.replace(/^\d{4}-\d{2}-\d{2}-/, ''); // the directory carries the date already
  return `Read this draft as the four reader personas: \`src/content/issues/${draftSlug}/index.mdx\`

The storyboard with the three questions: \`research/${category}/${storyboardFile}\`
This is the ${pass} pass.

Follow all rules in your agent definition exactly. Write the report to \`research/${category}/${today}-${bare}-panel${pass === 'second' ? '-2' : ''}.md\`.

Working directory: ${cwdPosix()}

Return: the verdict, one line per quiz question, the three lowest-scoring sections, and the top three fixes.`;
}

export function buildStylePrompt(category: string, issueSlug: string, panelFile?: string): string {
  const panelLine = panelFile
    ? `The first reader-panel report: \`research/${category}/${panelFile}\` — its "What would fix it" list is your first job. Apply every direction that is prose (a referent, a gloss, a Hindi word carrying the meaning, a sentence the dossier already supports); where a direction needs a fact the dossier does not carry, flag it under Structure flags instead of inventing it.`
    : 'No reader-panel report exists yet for this issue.';
  return `Bring this Parallax issue into the runtime voice contract and assign one rhetorical job per section.

Issue: \`src/content/issues/${issueSlug}/index.mdx\`
The contract (v2 — the register outranks the job): \`research/_voice/_voice-core.md\`
Its lexicon and jargon list sit beside it; \`research/_voice/mode-library.md\` is the deeper reference for the eight jobs and loses to the contract where they disagree.
The issue's storyboard, if one exists: \`research/${category}/*-storyboard.md\` (the row budgets and the three questions).
${panelLine}
Working directory: ${cwdPosix()}

Follow all rules in your agent definition exactly. Edit the issue file in-place — do not write a new file. Preserve every fact, number, name, date, verbatim quote and structured data field exactly.

Return: the job assignment table (slot · kind · eyebrow · job · rationale · fields rewritten), the job blend line, the count of fields rewritten vs. retained, and the Structure flags from Step 4.6.`;
}

export function buildVerifyPrompt(
  category: string,
  draftSlug: string,
  dossierFile: string,
): string {
  const today = todayIST();
  const bare = draftSlug.replace(/^\d{4}-\d{2}-\d{2}-/, ''); // the directory carries the date already
  return `Audit this draft issue: \`src/content/issues/${draftSlug}/index.mdx\`

Against this dossier: \`research/${category}/${dossierFile}\`

Write the verification report to: \`research/${category}/${today}-${bare}-verification.md\`

Working directory: ${cwdPosix()}

Return: verdict (APPROVED / NEEDS REVISION / BLOCKED), count of verified/imprecise/untraced claims, and the top 3 specific issues to fix if the verdict is not APPROVED.`;
}
