import { readFileSync } from 'fs';
import { join } from 'path';

export interface AgentDef {
  name: string;
  description: string;
  tools: string[];
  systemPrompt: string;
}

/**
 * Load and parse a Parallax agent definition from .claude/agents/<name>.md.
 * YAML frontmatter supplies name, description, tools.
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
    tools:        toolsMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean),
    systemPrompt,
  };
}
