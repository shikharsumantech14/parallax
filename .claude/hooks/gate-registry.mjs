#!/usr/bin/env node
/**
 * gate-registry — PostToolUse(Edit|Write) hook. Runs check:catalog the moment a
 * registry file is touched.
 *
 * Why: the registry maps fail SILENTLY. A kind with no EXPLAIN entry renders no
 * comprehension line; a kind with no KIND_PRIORITY falls to the default 30 and
 * is effectively unrankable as a story beat. Neither shows up in a build, a
 * browser, or a diff — which is exactly how four WebGL flagships sat unscored.
 * check:catalog already catches this; this hook just moves the catch from
 * "next build" to "the edit that caused it", while the context is still live.
 *
 * PostToolUse cannot block (the write already happened) — it reports via
 * systemMessage so the model sees the failure immediately.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const WATCHED = [
  'src/content/config.ts',
  'src/lib/explainers.ts',
  'src/lib/story.ts',
  'docs/design/catalog.md',
  'src/components/SectionBody.astro',
];

try {
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const p = (input?.tool_input?.file_path || '').replace(/\\/g, '/');
  if (!p || !WATCHED.some((w) => p.endsWith(w))) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  try {
    execFileSync('node', ['scripts/check-catalog.mjs'], {
      cwd: root, stdio: 'pipe', encoding: 'utf8', timeout: 60_000,
    });
  } catch (err) {
    const out = `${err.stdout || ''}${err.stderr || ''}`.trim().slice(0, 1500);
    process.stdout.write(JSON.stringify({
      systemMessage:
        'check:catalog FAILED after editing a registry file. The registry maps '
        + 'fail silently at runtime, so fix this now rather than at build time:\n\n'
        + out,
    }));
  }
} catch {
  /* Never disrupt the session on a hook bug. */
}
process.exit(0);
