#!/usr/bin/env node
/**
 * session-brief — SessionStart hook. Prints the live state to stdout, which
 * Claude Code adds to context before the first prompt.
 *
 * This replaces the hand-written "Repo state right now" table that
 * STATE-OF-PLAY.md used to carry. That table said "Three commits await the
 * operator's push"; three days later the tree was clean and level with origin.
 * Nothing was wrong with the writing — a human had written down a fact that
 * changes on its own. These facts are measured every session instead (CD-11).
 *
 * Two hard constraints:
 *   - Budget: a few hundred tokens. It is paid on EVERY session start.
 *   - A failure must never block a session. Every path exits 0, and any
 *     output at all is better than a broken start — so on error we print
 *     nothing and leave silently.
 */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.CLAUDE_PROJECT_DIR
  || join(dirname(fileURLToPath(import.meta.url)), '..', '..');

try {
  const out = execFileSync('node', ['scripts/project-graph.mjs', '--brief'], {
    cwd: root, encoding: 'utf8', stdio: 'pipe', timeout: 25_000,
  });
  if (out && out.trim()) process.stdout.write(out.trim() + '\n');
} catch {
  /* Silent. A session that starts without the brief is fine; a session that
     fails to start is not. */
}
process.exit(0);
