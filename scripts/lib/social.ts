/**
 * Shared helpers for the social pipelines (evergreen + reactive).
 *
 * - env loading (force-override, same as pipeline.ts)
 * - a Supabase service-role client for scripts/cron
 * - the canonical evergreen ANGLE set + types
 * - content hashing (dedup)
 * - listing published issues from src/content/issues
 * - the per-topic card theme (accent/bg/ink) used by social-cards.ts
 *
 * Runtime only — these talk to Supabase + the Agent SDK and need
 * ANTHROPIC_API_KEY + PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
 * .env.local (operator-held). They are never part of the Astro build.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ── Env ───────────────────────────────────────────────────────────────────────

/**
 * Parse a .env file and force-set each KEY=VALUE into process.env, overriding
 * any value already present (Claude Code sets its own ANTHROPIC_API_KEY).
 * Mirrors scripts/pipeline.ts loadEnvLocal().
 */
export function loadEnvLocal(cwd: string = process.cwd()): void {
  try {
    const content = readFileSync(join(cwd, '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key) process.env[key] = value;
    }
  } catch {
    // .env.local optional
  }
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}. Add it to .env.local (see .env.example).`);
  return v;
}

// ── Supabase (service role — server/cron only) ────────────────────────────────

export function serviceClient(): SupabaseClient {
  const url = requireEnv('PUBLIC_SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Topics, angles, variants ──────────────────────────────────────────────────

export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export type Topic = (typeof TOPICS)[number];

/** The canonical evergreen angles, rotated per issue so no hook repeats. */
export const ANGLES = [
  'headline-paradox',
  'key-stat',
  'timeline-beat',
  'quote',
  'lyrical-closer',
] as const;
export type Angle = (typeof ANGLES)[number];

export type Variant = 'hook' | 'thread' | 'data-card' | 'paradox' | 'quote';

/** One per-post visual: which thread post (0 = hook), which archetype, alt. */
export interface ImageBeat {
  post: number;
  kind: 'comparison' | 'data-readout' | 'paradox' | 'timeline' | 'hero';
  alt?: string;
  /** for kind:'hero' only — a synthetic stat card (no issue section behind it) */
  hero?: { value: string; label: string; claim?: string };
}

/** The JSON shape the social-writer agent returns (its final message). */
export interface SocialWriterOutput {
  issue_slug: string;
  topic: Topic;
  angle: Angle;
  variant: Variant;
  mode: string;
  platform: string;
  body: string;
  thread: string[];
  link_url: string;
  alt_text: string;
  image_brief: { eyebrow: string; headline: string; datum: string; accent_topic: Topic };
  image_beats?: ImageBeat[];
  char_count: number;
  ai_tell_pass: boolean;
  notes?: string;
}

// ── Issues ────────────────────────────────────────────────────────────────────

export interface IssueRef {
  slug: string;
  path: string;
  topic: Topic;
  title: string;
  status: string;
}

/** List published issues (status !== 'draft'), newest first. */
export function listPublishedIssues(cwd: string = process.cwd()): IssueRef[] {
  const dir = join(cwd, 'src', 'content', 'issues');
  const out: IssueRef[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    const path = join(dir, entry.name, 'index.mdx');
    if (!existsSync(path)) continue;
    try {
      const fm = matter(readFileSync(path, 'utf-8')).data as Record<string, unknown>;
      const status = String(fm.status ?? 'draft');
      if (status === 'draft') continue;
      out.push({
        slug: entry.name,
        path,
        topic: String(fm.topic) as Topic,
        title: String(fm.title ?? entry.name),
        status,
      });
    } catch {
      continue;
    }
  }
  return out.sort((a, b) => b.slug.localeCompare(a.slug));
}

export function issueUrl(slug: string): string {
  const base = (process.env.PUBLIC_SITE_URL ?? 'https://parallaxlens.com').replace(/\/$/, '');
  return `${base}/issues/${slug}/`;
}

// ── Dedup ─────────────────────────────────────────────────────────────────────

export function contentHash(issueId: string, variant: string, body: string): string {
  return createHash('sha256').update(`${issueId}|${variant}|${body}`).digest('hex');
}

// ── Per-topic card theme (mirrors src/styles/themes/<topic>.css) ──────────────

export interface CardTheme {
  accent: string;
  bg: string;
  ink: string;
  inkSoft: string;
  dark: boolean;
}

export const CARD_THEME: Record<Topic, CardTheme> = {
  politics: { accent: '#b8341f', bg: '#f4f1ea', ink: '#161412', inkSoft: '#4a463f', dark: false },
  space: { accent: '#00d4ff', bg: '#0a1628', ink: '#e8f0f4', inkSoft: '#9fb4c2', dark: true },
  earth: { accent: '#2d6a4f', bg: '#f0e9d8', ink: '#1a1a17', inkSoft: '#4d4a40', dark: false },
  tech: { accent: '#c6f432', bg: '#0d0d0d', ink: '#ededed', inkSoft: '#9a9a9a', dark: true },
  travel: { accent: '#c85a3c', bg: '#fffdf7', ink: '#1a1a17', inkSoft: '#4d4a40', dark: false },
  sports: { accent: '#e8f048', bg: '#0f2820', ink: '#eaf5ee', inkSoft: '#9bb3a5', dark: true },
};
