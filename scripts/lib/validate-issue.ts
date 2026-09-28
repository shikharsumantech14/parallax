/**
 * Validate an issue's frontmatter against the content schema without an
 * Astro build (docs/COST-PLAN.md CP-03: the drafter's check round).
 *
 * The schema is the real one. `src/content/config.ts` is imported, not
 * copied, so this can never drift from what the build enforces. That module
 * imports `astro:content`, a virtual module that exists only inside an Astro
 * build, so a Node resolve hook points that one specifier at a two-line shim:
 * `z` from `astro/zod` (the same zod the build uses, not the root `zod`
 * package, which is a different major) and an identity `defineCollection`.
 *
 * The frontmatter is parsed with gray-matter, the parser check-prose.mjs uses
 * and Astro 4's content layer used (js-yaml underneath, so an unquoted
 * `publishedAt: 2026-09-21` becomes a Date, as z.date() expects).
 *
 * Also checked, because the build fails on it and Zod does not see it: every
 * `sourceRefs[]` entry resolves to a `sources[].id`.
 *
 *   npx tsx scripts/lib/validate-issue.ts src/content/issues/<dir>/index.mdx
 */
import { readFileSync } from 'fs';
import { register } from 'node:module';
import { isAbsolute, join } from 'path';
import { pathToFileURL } from 'url';
import matter from 'gray-matter';

export interface IssueValidation {
  ok: boolean;
  /** One line per problem: `<path>: <message>`. */
  errors: string[];
}

interface ZodIssueLike { path: (string | number)[]; message: string }
interface ZodSchemaLike {
  safeParse(data: unknown): { success: true } | { success: false; error: { issues: ZodIssueLike[] } };
}

let schemaPromise: Promise<ZodSchemaLike> | null = null;

/** The issues collection's schema, loaded once per process. */
function issueSchema(): Promise<ZodSchemaLike> {
  if (schemaPromise) return schemaPromise;
  schemaPromise = (async () => {
    const zodUrl = import.meta.resolve('astro/zod');
    const shim = `export { z } from ${JSON.stringify(zodUrl)};\nexport const defineCollection = (c) => c;\n`;
    const shimUrl = `data:text/javascript,${encodeURIComponent(shim)}`;
    const hook = [
      'export async function resolve(specifier, context, next) {',
      `  if (specifier === 'astro:content') return { url: ${JSON.stringify(shimUrl)}, shortCircuit: true };`,
      '  return next(specifier, context);',
      '}',
    ].join('\n');
    register(`data:text/javascript,${encodeURIComponent(hook)}`);
    const config = await import(pathToFileURL(join(process.cwd(), 'src', 'content', 'config.ts')).href);
    const schema = config?.collections?.issues?.schema as ZodSchemaLike | undefined;
    if (!schema || typeof schema.safeParse !== 'function') {
      throw new Error('src/content/config.ts did not expose collections.issues.schema');
    }
    return schema;
  })();
  return schemaPromise;
}

/** Validate the issue file at `path` (repo-relative or absolute). */
export async function validateIssueFile(path: string): Promise<IssueValidation> {
  const file = isAbsolute(path) ? path : join(process.cwd(), path);
  let data: Record<string, unknown>;
  try {
    // gray-matter caches by input string. A copy of the object keeps a
    // second parse of the same text from sharing mutable state.
    data = structuredClone(matter(readFileSync(file, 'utf-8')).data) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, errors: [`frontmatter: the YAML does not parse (${e instanceof Error ? e.message.split('\n')[0] : String(e)})`] };
  }
  const errors: string[] = [];
  const result = (await issueSchema()).safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      // An enum error lists every allowed value (101 kinds). Keep what was received.
      const message = issue.message.length > 240
        ? issue.message.replace(/Expected .{160,}?, received/, 'Expected one of the registered values, received')
        : issue.message;
      errors.push(`${issue.path.length ? issue.path.join('.') : '(root)'}: ${message}`);
    }
  }
  const ids = new Set(
    (Array.isArray(data.sources) ? data.sources : [])
      .map(s => (s && typeof s === 'object' ? (s as Record<string, unknown>).id : undefined))
      .filter((id): id is string => typeof id === 'string'),
  );
  (Array.isArray(data.sections) ? data.sections : []).forEach((s, i) => {
    const refs = s && typeof s === 'object' ? (s as Record<string, unknown>).sourceRefs : undefined;
    if (!Array.isArray(refs)) return;
    for (const r of refs) if (typeof r === 'string' && !ids.has(r)) errors.push(`sections.${i}.sourceRefs: "${r}" is not a sources[].id`);
  });
  return { ok: errors.length === 0, errors };
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const invokedDirectly = process.argv[1] && /validate-issue\.ts$/.test(process.argv[1].replace(/\\/g, '/'));
if (invokedDirectly) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: npx tsx scripts/lib/validate-issue.ts src/content/issues/<dir>/index.mdx');
    process.exit(2);
  }
  validateIssueFile(target).then(r => {
    if (r.ok) console.log(`ok: ${target} passes the content schema`);
    else { console.log(`${r.errors.length} problem(s) in ${target}:`); for (const e of r.errors) console.log(`  ${e}`); }
    process.exit(r.ok ? 0 : 1);
  }).catch(e => { console.error(e instanceof Error ? e.stack : e); process.exit(2); });
}
