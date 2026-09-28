import { readFileSync } from 'fs';
import { join } from 'path';

export interface AgentDef {
  name: string;
  description: string;
  tools: string[];
  /** Scoped permission rules from the optional `allow:` frontmatter field,
   *  e.g. `Bash(npm run check:prose *)`. The runner makes each rule's tool
   *  available to this agent and pre-approves only the matching calls; every
   *  other call to that tool is denied (COST-PLAN CP-02). */
  allow: string[];
  systemPrompt: string;
}

/** Split `a, B(x, y), c` on the commas that sit outside parentheses. */
function splitList(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { out.push(current); current = ''; }
    else current += ch;
  }
  out.push(current);
  return out.map((t) => t.trim()).filter(Boolean);
}

/** A frontmatter list field, inline (`allow: A, B`) or as a block (`allow:` then `  - A` lines). */
function listField(frontmatter: string, field: string): string[] {
  const inline = frontmatter.match(new RegExp(`^${field}:[ \\t]*(\\S.*)$`, 'm'));
  if (inline) return splitList(inline[1]);
  const block = frontmatter.match(new RegExp(`^${field}:[ \\t]*\\r?\\n((?:[ \\t]+-[^\\n]*\\r?\\n?)+)`, 'm'));
  if (!block) return [];
  return block[1]
    .split(/\r?\n/)
    .map((l) => l.replace(/^[ \t]+-[ \t]*/, '').trim().replace(/^(['"])(.*)\1$/, '$2'))
    .filter(Boolean);
}

/**
 * Load and parse a Parallax agent definition from .claude/agents/<name>.md.
 * YAML frontmatter supplies name, description, tools and the optional allow.
 * Everything after the closing --- becomes the system prompt.
 */
export function loadAgent(name: string): AgentDef {
  const filePath = join(process.cwd(), '.claude', 'agents', `${name}.md`);

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(`Agent definition not found at: ${filePath}`);
  }

  // Split on --- delimiters. parts[0]=pre, parts[1]=frontmatter, parts[2+]=body
  const parts = content.split(/^---\s*$/m);
  if (parts.length < 3) {
    throw new Error(`Agent file has no YAML frontmatter delimiters: ${filePath}`);
  }

  const frontmatter = parts[1];
  const systemPrompt = parts.slice(2).join('---').trim();

  const nameMatch  = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch  = frontmatter.match(/^description:\s*(.+)$/m);
  const toolsMatch = frontmatter.match(/^tools:\s*(.+)$/m);

  if (!nameMatch || !toolsMatch) {
    throw new Error(`Agent frontmatter missing required fields (name, tools): ${filePath}`);
  }

  return {
    name:         nameMatch[1].trim(),
    description:  descMatch ? descMatch[1].trim() : '',
    tools:        splitList(toolsMatch[1]),
    allow:        listField(frontmatter, 'allow'),
    systemPrompt,
  };
}
