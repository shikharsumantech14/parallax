import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Today's date as YYYY-MM-DD in IST (Asia/Kolkata, UTC+5:30). */
export function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

// ── File-finding helpers ──────────────────────────────────────────────────────

/**
 * Return the most recently-named file in `dir` whose name ends with `suffix`.
 * Files are sorted lexicographically — YYYY-MM-DD prefixes make this chronological.
 * Returns the filename (not full path), or null if none found.
 */
export function findMostRecent(dir: string, suffix: string): string | null {
  try {
    const files = readdirSync(dir)
      .filter(f => f.endsWith(suffix))
      .sort()
      .reverse();
    return files.length > 0 ? files[0] : null;
  } catch {
    return null;
  }
}

/**
 * Scan src/content/issues/<slug>/index.mdx for the most recent draft issue
 * matching the given topic. Returns the slug (directory name), or null.
 */
export function findDraftIssue(cwd: string, topic: string): string | null {
  const issuesDir = join(cwd, 'src', 'content', 'issues');
  try {
    const slugs = readdirSync(issuesDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('_'))
      .map(e => e.name)
      .sort()
      .reverse(); // most recent date prefix first

    for (const slug of slugs) {
      try {
        const content = readFileSync(join(issuesDir, slug, 'index.mdx'), 'utf-8');
        const hasTopicMatch  = new RegExp(`^\\s*topic:\\s*${topic}\\s*$`, 'm').test(content);
        const hasDraftStatus = /^\s*status:\s*draft\s*$/m.test(content);
        if (hasTopicMatch && hasDraftStatus) return slug;
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// ── Prompt builders ───────────────────────────────────────────────────────────
// Each function builds the invocation prompt passed directly to the agent.
// These mirror the subagent prompts in .claude/commands/pipeline-*.md
// but are adapted for direct agent invocation (no orchestrator layer).

export function buildDiscoverPrompt(category: string): string {
  const today = todayIST();
  return `Run discovery for category **${category}**. Read the source allowlist at \`research/_sources/${category}.md\`, survey recent stories per the rules in your agent definition, and write the candidates file to \`research/${category}/${today}-candidates.md\`. Return a one-paragraph summary with the file path and your top pick.`;
}

export function buildResearchPrompt(category: string, candidatesFile: string): string {
  const today = todayIST();
  return `Run research for category **${category}**. The candidates file is at \`research/${category}/${candidatesFile}\`. Find the candidate with \`status: chosen\`, deeply research it using the source allowlist at \`research/_sources/${category}.md\`, and write the dossier to \`research/${category}/${today}-<slug>-dossier.md\` (derive the slug from the chosen candidate title, kebab-case, max 6 words). Follow the template at \`research/_templates/dossier.md\` exactly. Return a one-paragraph summary with: dossier file path, the structural argument in one sentence, 3 strongest verified facts, and any [UNVERIFIED] items to flag for the editor.`;
}

export function buildDraftPrompt(category: string, dossierFile: string): string {
  return `Write a complete draft issue from this dossier: \`research/${category}/${dossierFile}\`

Follow all rules in your agent definition exactly. Write the output to \`src/content/issues/<id>/index.mdx\` where \`<id>\` matches the dossier slug and today's date (YYYY-MM-DD-slug format).

Working directory: ${process.cwd().replace(/\\/g, '/')}

Return: file path written, issue title + hook, section count + read time estimate, any [UNVERIFIED] items omitted or flagged, any section kind substitutions made.`;
}

export function buildVerifyPrompt(
  category: string,
  draftSlug: string,
  dossierFile: string,
): string {
  const today = todayIST();
  return `Audit this draft issue: \`src/content/issues/${draftSlug}/index.mdx\`

Against this dossier: \`research/${category}/${dossierFile}\`

Write the verification report to: \`research/${category}/${today}-${draftSlug}-verification.md\`

Working directory: ${process.cwd().replace(/\\/g, '/')}

Return: verdict (APPROVED / NEEDS REVISION / BLOCKED), count of verified/imprecise/untraced claims, and the top 3 specific issues to fix if the verdict is not APPROVED.`;
}
