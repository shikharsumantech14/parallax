/**
 * kind-aliases — the retired section-kind names, for scripts that read the
 * issue MDX directly rather than through the content collection.
 *
 * The Lens verdict (2026-09-30, docs/design/LENS.md §9) renamed two kinds and
 * folded four into a host kind. The schema resolves the old names on parse
 * (KIND_ALIASES in src/content/config.ts), so the site only ever sees the
 * canonical kind. A script that reads frontmatter with gray-matter or a regex
 * sees the name as authored, and must resolve it the same way, or it counts
 * `swing-dial` and `gauge` as two different kinds.
 *
 * The map is parsed out of config.ts (a TypeScript file that imports
 * astro:content, so it cannot be imported here). check-catalog asserts its
 * shape; keep it a flat literal of quoted pairs.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const config = readFileSync(join(root, 'src', 'content', 'config.ts'), 'utf-8');
const block = config.match(/KIND_ALIASES\s*=\s*\{([\s\S]*?)\}\s*as const/);

/** { retiredName: canonicalKind } */
export const KIND_ALIASES = Object.fromEntries(
  block ? [...block[1].matchAll(/'([a-z0-9-]+)'\s*:\s*'([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]]) : [],
);

/** The canonical kind for an authored name, alias or not. */
export const canonicalKind = (kind) => KIND_ALIASES[kind] ?? kind;
