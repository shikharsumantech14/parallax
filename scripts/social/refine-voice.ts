/**
 * Voice refiner (learning loop) — turns real engagement into proposed voice
 * heuristics. Ranks posted threads by engagement, runs the voice-refiner agent on
 * the top vs bottom (plus recent rejections), and APPENDS its proposals to
 * research/_voice/_voice-social-learned.md under a dated "Proposed" block for you
 * to curate (promote the good ones into "Active heuristics", delete the rest).
 *
 *   npm run social:refine            # analyse + append proposals
 *   npm run social:refine -- --dry   # analyse + print, write nothing
 *
 * Needs ANTHROPIC_API_KEY + PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { loadAgent } from '../lib/agent-loader.js';
import { runAgent } from '../lib/runner.js';
import { loadEnvLocal, requireEnv, serviceClient } from '../lib/social.js';

const MODEL = process.env.SOCIAL_REFINE_MODEL ?? 'claude-sonnet-4-6';
const MIN_POSTS = Number(process.env.REFINE_MIN_POSTS ?? '6');
const LEARNED = join(process.cwd(), 'research', '_voice', '_voice-social-learned.md');

interface Row {
  id: string; topic: string; kind: string; angle: string | null;
  body: string; thread: string[] | null;
  engagement: { likes?: number; reposts?: number; replies?: number; quotes?: number } | null;
}
const score = (e: Row['engagement']) =>
  e ? (e.replies ?? 0) * 3 + (e.reposts ?? 0) * 2 + (e.quotes ?? 0) * 2 + (e.likes ?? 0) : 0;

function digestPost(r: Row, tag: string): string {
  const e = r.engagement ?? {};
  const head = `[${tag}] ${r.topic}/${r.kind}/${r.angle ?? '—'} · score ${score(r.engagement)} (♥${e.likes ?? 0} ↻${e.reposts ?? 0} 💬${e.replies ?? 0} ❝${e.quotes ?? 0})`;
  const lines = [`  hook: ${r.body}`];
  for (const t of (r.thread ?? []).slice(0, 2)) lines.push(`  · ${t}`);
  return `${head}\n${lines.join('\n')}`;
}

function parseJson(s: string): { data_strength?: string; summary?: string; heuristics?: { heuristic: string; do: string; evidence: string; confidence: string }[] } {
  let str = s.trim();
  const fence = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) str = fence[1].trim();
  const a = str.indexOf('{'), b = str.lastIndexOf('}');
  if (a === -1 || b === -1) throw new Error('voice-refiner returned no JSON object');
  return JSON.parse(str.slice(a, b + 1));
}

async function main(): Promise<void> {
  loadEnvLocal();
  const dry = process.argv.includes('--dry');
  requireEnv('ANTHROPIC_API_KEY');
  requireEnv('PUBLIC_SUPABASE_URL');
  requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = serviceClient();

  const { data, error } = await supabase
    .from('social_posts')
    .select('id, topic, kind, angle, body, thread, engagement')
    .eq('status', 'posted')
    .not('engagement', 'is', null)
    .limit(500);
  if (error) throw new Error(`read failed: ${error.message}`);

  const rows = ((data ?? []) as Row[]).sort((a, b) => score(b.engagement) - score(a.engagement));
  if (rows.length < MIN_POSTS) {
    console.log(`Only ${rows.length} posted+measured thread(s) — need ${MIN_POSTS} for a meaningful pass. Keep posting; the loop will sharpen.`);
    return;
  }

  const n = Math.min(4, Math.floor(rows.length / 2));
  const top = rows.slice(0, n).map((r, i) => digestPost(r, `TOP ${i + 1}`));
  const bottom = rows.slice(-n).map((r, i) => digestPost(r, `BOTTOM ${i + 1}`));

  const { data: rej } = await supabase
    .from('social_posts').select('body, error_log').eq('status', 'rejected')
    .order('created_at', { ascending: false }).limit(5);
  const rejected = ((rej ?? []) as { body: string; error_log: string | null }[])
    .map((r, i) => `[REJECTED ${i + 1}] ${r.body}${r.error_log ? `  (reason: ${r.error_log})` : ''}`);

  const digest = [
    `POSTS MEASURED: ${rows.length}. Score = replies×3 + reposts×2 + quotes×2 + likes.`,
    '', '=== TOP PERFORMERS ===', top.join('\n\n'),
    '', '=== BOTTOM PERFORMERS ===', bottom.join('\n\n'),
    ...(rejected.length ? ['', '=== RECENTLY REJECTED (negative signal) ===', rejected.join('\n')] : []),
  ].join('\n');

  const agent = loadAgent('voice-refiner');
  const prompt = [
    'Analyse this engagement digest and propose voice heuristics per your agent definition.',
    'Read research/_voice/_voice-social.md + _voice-social-learned.md first. Return EXACTLY one JSON object.',
    '', digest,
  ].join('\n');

  const result = await runAgent({ agent, prompt, model: MODEL, cwd: process.cwd() });
  const out = parseJson(result.finalMessage);
  const heuristics = out.heuristics ?? [];

  console.log(`\nData strength: ${out.data_strength ?? '?'}`);
  console.log(`Summary: ${out.summary ?? ''}`);
  console.log(`Proposed heuristics: ${heuristics.length}`);
  heuristics.forEach((h) => console.log(`  • [${h.confidence}] ${h.heuristic}`));

  if (heuristics.length === 0) { console.log('\nNothing to propose this pass.'); return; }
  if (dry) { console.log('\n[--dry] nothing written.'); return; }

  const date = new Date().toISOString().slice(0, 10);
  const block =
    `\n\n## Proposed — ${date} (pending operator review)\n` +
    `_${out.summary ?? ''} (data: ${out.data_strength ?? '?'}). Promote the keepers into "Active heuristics" above; delete the rest._\n\n` +
    heuristics.map((h) =>
      `### ${date} — ${h.heuristic}\n**Do:** ${h.do}\n**Why / evidence:** ${h.evidence}\n**Confidence:** ${h.confidence}\n`,
    ).join('\n');
  appendFileSync(LEARNED, block);
  console.log(`\n✓ Appended ${heuristics.length} proposal(s) to ${LEARNED}. Review + curate, then commit.`);
}

main().catch((err) => { console.error('social:refine failed:', err instanceof Error ? err.message : err); process.exit(1); });
