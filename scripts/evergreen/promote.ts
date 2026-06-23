#!/usr/bin/env node
/**
 * Evergreen promotion — turn one published issue into one pending social post.
 *
 *   npm run social:evergreen            # generate + queue one post
 *   npm run social:evergreen -- --dry   # generate + print, do NOT write
 *
 * Flow: pick the next non-duplicative (issue, angle) via the promotions ledger
 * (+ cooldown) → run the social-writer agent → render an on-brand card (best
 * effort) → insert a social_posts row (status=pending, kind=evergreen) + a
 * promotions ledger row. A human approves it in /admin/social before it posts.
 *
 * Bills ANTHROPIC_API_KEY (social-writer runs on a cheap model). Needs
 * PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Operator-run / cron.
 */
import { join } from 'path';
import { loadAgent } from '../lib/agent-loader.js';
import { runAgent } from '../lib/runner.js';
import {
  loadEnvLocal,
  requireEnv,
  serviceClient,
  listPublishedIssues,
  issueUrl,
  contentHash,
  ANGLES,
  type Angle,
  type IssueRef,
  type SocialWriterOutput,
} from '../lib/social.js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { heroCard, renderByKind, toPng } from '../social/cards.js';
import { loadIssue, findSection, sectionToCard } from '../social/extract.js';

// Threaded explainers need real reasoning (the asteroid-paradox class of idea),
// so default to Sonnet, not Haiku. Override with SOCIAL_MODEL (e.g. an Opus id
// for max quality, or a Haiku id to cut cost).
const SOCIAL_MODEL = process.env.SOCIAL_MODEL ?? 'claude-sonnet-4-6';
const COOLDOWN_DAYS = Number(process.env.EVERGREEN_COOLDOWN_DAYS ?? '21');
const STORAGE_BUCKET = process.env.SOCIAL_BUCKET ?? 'social-cards';

interface Pick { issue: IssueRef; angle: Angle; }

/** Choose the next (issue, angle): never-promoted issues first, then the
 *  least-recently-promoted; within an issue, the first unused angle, else the
 *  least-recently-used angle if it has cleared the cooldown. */
async function pickIssueAndAngle(supabase: SupabaseClient, issues: IssueRef[]): Promise<Pick | null> {
  const { data, error } = await supabase
    .from('promotions')
    .select('issue_id, angle, promoted_at');
  if (error) throw new Error(`promotions read failed: ${error.message}`);

  // issue_id → angle → last promoted (ms)
  const used = new Map<string, Map<string, number>>();
  for (const row of (data ?? []) as { issue_id: string; angle: string; promoted_at: string }[]) {
    const m = used.get(row.issue_id) ?? new Map<string, number>();
    const ts = new Date(row.promoted_at).getTime();
    m.set(row.angle, Math.max(ts, m.get(row.angle) ?? 0));
    used.set(row.issue_id, m);
  }

  const lastOverall = (slug: string): number => {
    const m = used.get(slug);
    if (!m || m.size === 0) return 0; // never promoted → most eligible
    return Math.max(...m.values());
  };
  const ordered = [...issues].sort((a, b) => lastOverall(a.slug) - lastOverall(b.slug));

  const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (const issue of ordered) {
    const m = used.get(issue.slug) ?? new Map<string, number>();
    const unused = ANGLES.find((a) => !m.has(a));
    if (unused) return { issue, angle: unused };
    // all angles used — take the least-recently-used if past cooldown
    let best: Angle | null = null;
    let bestTs = Infinity;
    for (const a of ANGLES) {
      const ts = m.get(a) ?? 0;
      if (ts < bestTs) { bestTs = ts; best = a; }
    }
    if (best && now - bestTs >= cooldownMs) return { issue, angle: best };
  }
  return null;
}

function parseWriterJson(message: string): SocialWriterOutput {
  let s = message.trim();
  // tolerate a ```json fence despite the agent contract
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('social-writer returned no JSON object');
  return JSON.parse(s.slice(start, end + 1)) as SocialWriterOutput;
}

/** Render every image_beat (the hook hero + per-beat section cards) and upload to
 *  the public Storage bucket. Best-effort per beat: a failed render/upload is
 *  skipped (the post still posts, just with fewer/no images). Returns the
 *  segment-index → {ref,alt} map + the hook image for the admin thumbnail. */
async function renderBeats(
  supabase: SupabaseClient,
  out: SocialWriterOutput,
  issue: IssueRef,
): Promise<{ images: Record<string, { ref: string; alt: string }>; hookRef: string | null }> {
  const images: Record<string, { ref: string; alt: string }> = {};
  let hookRef: string | null = null;
  let sections: ReturnType<typeof loadIssue>['sections'] | null = null;

  for (const b of out.image_beats ?? []) {
    try {
      let svg: string | null = null;
      if (b.kind === 'hero') {
        if (!b.hero) continue;
        svg = heroCard(
          { eyebrow: out.image_brief?.eyebrow ?? issue.topic, claim: b.hero.claim ?? '', value: b.hero.value, label: b.hero.label, source: 'parallaxlens.com' },
          issue.topic,
        );
      } else {
        if (!sections) sections = loadIssue(issue.path).sections;
        const section = findSection(sections, b.kind);
        if (!section) continue;
        const card = sectionToCard(section);
        if (!card) continue;
        svg = renderByKind(card.kind, card.data, issue.topic);
      }
      if (!svg) continue;
      const png = toPng(svg, 'wide');
      const path = `${issue.slug}/${b.post}-${b.kind}.png`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, png, { contentType: 'image/png', upsert: true });
      if (error) { console.warn(`  card upload skipped (${b.kind}): ${error.message}`); continue; }
      const ref = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
      if (!ref) continue;
      images[String(b.post)] = { ref, alt: b.alt ?? out.alt_text ?? '' };
      if (b.post === 0) hookRef = ref;
    } catch (err) {
      console.warn(`  card render skipped (${b.kind}): ${err instanceof Error ? err.message : err}`);
    }
  }
  if (!hookRef) hookRef = Object.values(images)[0]?.ref ?? null;
  return { images, hookRef };
}

async function main(): Promise<void> {
  loadEnvLocal();
  const dry = process.argv.includes('--dry');
  requireEnv('ANTHROPIC_API_KEY');
  if (!dry) {
    requireEnv('PUBLIC_SUPABASE_URL');
    requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  }

  const cwd = process.cwd();
  const issues = listPublishedIssues(cwd);
  if (issues.length === 0) {
    console.log('No published issues to promote.');
    return;
  }

  // In --dry with no DB, just promote the newest issue's first angle.
  const supabase = dry && !process.env.PUBLIC_SUPABASE_URL ? null : serviceClient();
  const pick: Pick | null = supabase
    ? await pickIssueAndAngle(supabase, issues)
    : { issue: issues[0], angle: ANGLES[0] };

  if (!pick) {
    console.log(`Nothing eligible — every issue/angle is within the ${COOLDOWN_DAYS}-day cooldown.`);
    return;
  }

  const { issue, angle } = pick;
  console.log(`Promoting ${issue.slug} · angle: ${angle} · model: ${SOCIAL_MODEL}`);

  const agent = loadAgent('social-writer');
  const prompt = [
    `Write a threaded social explainer for this published Parallax issue — a short thread that makes its hard idea easy for a stranger scrolling.`,
    ``,
    `issue path: ${issue.path.replace(/\\/g, '/')}`,
    `entry angle: ${angle}`,
    `platform: x`,
    `link_url: ${issueUrl(issue.slug)}`,
    ``,
    `Follow your agent definition exactly. Read research/_voice/_voice-social.md + research/_voice/_voice-social-learned.md and the issue, build the teaching arc (adaptive length, biased short — only as many posts as the idea needs), run the AI-tell + accessibility rules, and return EXACTLY one JSON object (no surrounding prose).`,
  ].join('\n');

  const result = await runAgent({ agent, prompt, model: SOCIAL_MODEL, cwd });
  const out = parseWriterJson(result.finalMessage);

  // Trust the issue's real topic over the model's echo.
  out.topic = issue.topic;
  if (out.image_brief) out.image_brief.accent_topic = issue.topic;
  out.link_url = out.link_url || issueUrl(issue.slug);
  const hash = contentHash(issue.slug, out.variant, out.body);

  console.log(`\n--- ${out.variant} · ${out.mode} · ${out.body.length} chars ---`);
  console.log(out.body);
  if (out.thread?.length) out.thread.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  if (out.image_beats?.length) out.image_beats.forEach((b) => console.log(`  🖼 post ${b.post}: ${b.kind}${b.hero ? ` (${b.hero.value})` : ''}`));
  console.log(`↳ link (closes thread): ${out.link_url}`);
  if (out.notes) console.log(`notes: ${out.notes}`);

  if (dry || !supabase) {
    console.log('\n[--dry] nothing written.');
    return;
  }

  const { images, hookRef } = await renderBeats(supabase, out, issue);

  const { data: inserted, error: insErr } = await supabase
    .from('social_posts')
    .insert({
      issue_id: issue.slug,
      topic: issue.topic,
      platform: 'x',
      kind: 'evergreen',
      variant: out.variant,
      angle,
      body: out.body,
      thread: out.thread?.length ? out.thread : null,
      link_url: out.link_url,
      alt_text: out.alt_text,
      image_ref: hookRef,
      images,
      image_brief: out.image_brief,
      content_hash: hash,
      created_by: 'evergreen-cron',
    })
    .select('id')
    .maybeSingle();

  if (insErr) {
    // Unique-violation on content_hash = this exact post already queued. Not fatal.
    if (insErr.code === '23505') {
      console.log('\nIdentical post already in the queue (dedup) — skipped.');
      return;
    }
    throw new Error(`social_posts insert failed: ${insErr.message}`);
  }

  await supabase
    .from('promotions')
    .insert({ issue_id: issue.slug, angle, social_post_id: inserted?.id ?? null });

  const nCards = Object.keys(images).length;
  console.log(`\n✓ Queued pending post ${inserted?.id} (${nCards} card${nCards === 1 ? '' : 's'}). Review at /admin/social.`);
}

main().catch((err) => {
  console.error('\nFatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
