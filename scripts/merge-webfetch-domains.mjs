#!/usr/bin/env node
/**
 * merge-webfetch-domains.mjs — operator utility (run intentionally, by you).
 *
 * Reads the "WebFetch domains to allow" fenced block at the bottom of each
 * research/_sources/<topic>.md allowlist, dedupes against the WebFetch entries
 * already in .claude/settings.local.json, and APPENDS `WebFetch(domain:X)`
 * permission rules for any new domains. This pre-approves the source domains so
 * discovery / research / cron runs don't prompt per-domain.
 *
 * It only ever ADDS read-only `WebFetch(domain:...)` rules — it never touches
 * Bash/Skill/MCP permissions or removes anything. Re-run it any time you add
 * sources to an allowlist. Pass --dry to preview without writing.
 *
 *   node scripts/merge-webfetch-domains.mjs          # apply
 *   node scripts/merge-webfetch-domains.mjs --dry     # preview only
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry');
const root = process.cwd();
const topics = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'];

// 1. Extract bare domains from each allowlist's fenced WebFetch block.
const domains = new Set();
for (const t of topics) {
  const md = readFileSync(join(root, 'research', '_sources', `${t}.md`), 'utf8');
  const idx = md.search(/##\s*WebFetch domains to allow/i);
  if (idx === -1) { console.warn(`!! no WebFetch block in ${t}.md`); continue; }
  const fence = md.slice(idx).match(/```([\s\S]*?)```/);
  if (!fence) { console.warn(`!! no fenced block in ${t}.md`); continue; }
  for (const line of fence[1].split('\n')) {
    const d = line.trim();
    if (d && !d.startsWith('#') && d.includes('.')) domains.add(d);
  }
}

// 2. Load settings, collect existing WebFetch domains.
const settingsPath = join(root, '.claude', 'settings.local.json');
const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
const allow = settings.permissions.allow;
const existing = new Set();
for (const e of allow) {
  const m = /^WebFetch\(domain:(.+)\)$/.exec(e);
  if (m) existing.add(m[1]);
}

// 3. Append new entries (existing order preserved; new ones appended, sorted).
const toAdd = [...domains].filter(d => !existing.has(d)).sort();

console.log(`Extracted ${domains.size} unique domains from ${topics.length} allowlists.`);
console.log(`Already present: ${domains.size - toAdd.length}. New: ${toAdd.length}.`);
if (toAdd.length) console.log('  ' + toAdd.join('\n  '));

if (DRY) { console.log('\n[--dry] no changes written.'); process.exit(0); }
if (!toAdd.length) { console.log('Nothing to add.'); process.exit(0); }

for (const d of toAdd) allow.push(`WebFetch(domain:${d})`);
writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
console.log(`\nWrote ${toAdd.length} new WebFetch rules. Total allow entries: ${allow.length}.`);
