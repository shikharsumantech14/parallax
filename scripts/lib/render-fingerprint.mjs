/**
 * render-fingerprint — one hash over everything that decides how a public page
 * renders. Shared by the render gate's two halves:
 *
 *   scripts/ui-probe.mjs            computes it at the START of a run and writes
 *                                   it into research/_ui/last-run.json
 *   .claude/hooks/guard-render.mjs  recomputes it at commit time and refuses a
 *                                   rendering commit when the two disagree
 *
 * So "the last run is clean" can only mean "the last run rendered THIS tree".
 *
 * Inputs (repo-relative, forward slashes):
 *   src/components/** · src/styles/** · src/layouts/** · src/pages/** ·
 *   src/lib/** · src/scripts/** · src/content/config.ts ·
 *   src/content/issues/<slug>/index.mdx whose frontmatter status is not `draft`
 *   (published and review issues build; drafts do not, and `_template` never).
 *
 * Skipped: node_modules / .astro / dist directories, and Markdown outside
 * src/pages — src/components/AGENTS.md and its CLAUDE.md shim are agent guides,
 * not page source, and a doc edit must not demand a three-minute render run.
 * (Markdown IN src/pages is a route, so it counts.)
 *
 * CRLF is normalised to LF before hashing, so Git's autocrlf cannot change the
 * hash of a file nobody edited. Plain fs recursion, no glob dependency: ~240
 * files, well under a second.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const RENDER_DIRS = ['src/components', 'src/styles', 'src/layouts', 'src/pages', 'src/lib', 'src/scripts'];
export const RENDER_FILES = ['src/content/config.ts'];
export const ISSUES_DIR = 'src/content/issues';
const SKIP_DIRS = new Set(['node_modules', '.astro', 'dist']);

const norm = (p) => String(p).replace(/\\/g, '/').replace(/^\.\//, '');

/** Frontmatter status of an issue's source: 'draft' | 'review' | 'published',
 *  'draft' when the field is absent (the schema default, src/content/config.ts),
 *  null when there is no frontmatter to read. Same parse as ui-probe used. */
export function issueStatus(src) {
  if (typeof src !== 'string') return null;
  const fm = /^﻿?---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  if (!fm) return null;
  const st = /^status:\s*['"]?([a-z]+)/m.exec(fm[1]);
  return st ? st[1] : 'draft';
}

/** The slug when `rel` is an issue's index.mdx, else null. `_template` and any
 *  other underscore folder are not issues. */
export function issueSlugOf(rel) {
  const m = /^src\/content\/issues\/([^/_][^/]*)\/index\.mdx$/.exec(norm(rel));
  return m ? m[1] : null;
}

/** True for a non-issue path the fingerprint covers. Issue MDX is decided by
 *  its status, so it is NOT answered here: see issueSlugOf + issueStatus. */
export function isRenderSource(rel) {
  const p = norm(rel);
  if (RENDER_FILES.includes(p)) return true;
  if (!RENDER_DIRS.some((d) => p.startsWith(d + '/'))) return false;
  if (p.split('/').some((seg) => SKIP_DIRS.has(seg))) return false;
  if (/\.md$/i.test(p) && !p.startsWith('src/pages/')) return false;
  return true;
}

function walk(root, relDir, out) {
  let ents;
  try {
    ents = fs.readdirSync(path.join(root, relDir), { withFileTypes: true });
  } catch {
    return; // a missing input dir is an empty one
  }
  for (const e of ents) {
    const rel = `${relDir}/${e.name}`;
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(root, rel, out);
    } else if (e.isFile() && isRenderSource(rel)) {
      out.push(rel);
    }
  }
}

/** Slugs of every issue that renders publicly (status not `draft`), sorted. */
export function renderedIssueSlugs(root) {
  const out = [];
  let ents;
  try {
    ents = fs.readdirSync(path.join(root, ISSUES_DIR), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const d of ents) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    let src;
    try {
      src = fs.readFileSync(path.join(root, ISSUES_DIR, d.name, 'index.mdx'), 'utf8');
    } catch {
      continue;
    }
    const st = issueStatus(src);
    if (st && st !== 'draft') out.push(d.name);
  }
  return out.sort();
}

/** Every input file, repo-relative, sorted by plain code-unit order. */
export function renderInputs(root) {
  const out = [];
  for (const d of RENDER_DIRS) walk(root, d, out);
  for (const f of RENDER_FILES) if (fs.existsSync(path.join(root, f))) out.push(f);
  for (const slug of renderedIssueSlugs(root)) out.push(`${ISSUES_DIR}/${slug}/index.mdx`);
  return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** sha1 over the sorted relative paths and their LF-normalised contents. */
export function renderFingerprint(root) {
  const h = crypto.createHash('sha1');
  for (const rel of renderInputs(root)) {
    // latin1 maps bytes 1:1, so this is safe for any binary that ever lands here
    const body = fs.readFileSync(path.join(root, rel)).toString('latin1').replace(/\r\n/g, '\n');
    h.update(rel, 'utf8');
    h.update('\0');
    h.update(body, 'latin1');
    h.update('\0');
  }
  return h.digest('hex');
}
