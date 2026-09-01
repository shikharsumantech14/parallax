#!/usr/bin/env node
/**
 * guard-generated — PreToolUse(Edit|Write) hook. Enforces CD-09: docs/generated/
 * is a build artifact, never a source.
 *
 * Why a hook and not a convention: the whole value of a generated file is that
 * it cannot drift from the repo. One hand-edit destroys that guarantee silently
 * — the file still looks right, the build still passes, and it is wrong from
 * then on. That is precisely the failure this context system exists to end, so
 * it gets a wall rather than a note.
 *
 * Same contract as guard-git: deny with a reason, or exit 0 silently so the
 * normal permission flow applies. Never emits "allow".
 */
import { readFileSync } from 'node:fs';

export function decide(filePath) {
  if (typeof filePath !== 'string' || !filePath) return null;
  const p = filePath.replace(/\\/g, '/');
  if (!/(^|\/)docs\/generated\//.test(p)) return null;

  return 'BLOCKED by CONTEXT-PLAN CD-09: docs/generated/ is a build artifact, '
    + 'not a source. Hand-editing it destroys the guarantee that it matches the '
    + 'repo — the file would still look right and still build, and be wrong from '
    + 'then on. To change what it says, change the repo or '
    + '`scripts/project-graph.mjs`, then run `node scripts/project-graph.mjs`.';
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
    const reason = decide(input?.tool_input?.file_path);
    if (reason) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: reason,
        },
      }));
    }
  } catch {
    /* Never block on a hook bug. */
  }
  process.exit(0);
}
