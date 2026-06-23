/**
 * Poster — the final hop: approved → posted.
 *
 *   npm run social:post                 # drain approved posts due now
 *   npm run social:post -- --dry        # show what would post, post nothing
 *
 * Reads social_posts with status='approved' whose scheduled_at is null or past,
 * posts each via the configured backend (POSTER_BACKEND=bluesky|typefully;
 * default bluesky), then sets status='posted' + permalink (or status='failed' +
 * error_log). Native-first: the link goes in the first reply. Compliance: caps
 * per run + a delay between posts; never auto-likes/follows. Human approval has
 * already happened upstream (/admin/social).
 *
 * Needs PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, plus the backend creds
 * (BLUESKY_IDENTIFIER + BLUESKY_APP_PASSWORD, or TYPEFULLY_API_KEY).
 */
import { loadEnvLocal, requireEnv, serviceClient } from '../lib/social.js';
import { post, type PosterBackend, type PostablePost } from '../lib/poster.js';

const BACKEND = (process.env.POSTER_BACKEND ?? 'bluesky') as PosterBackend;
const MAX_PER_RUN = Number(process.env.POSTER_MAX_PER_RUN ?? '5');
const DELAY_MS = Number(process.env.POSTER_DELAY_MS ?? '20000'); // spacing between posts

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  loadEnvLocal();
  const dry = process.argv.includes('--dry');
  requireEnv('PUBLIC_SUPABASE_URL');
  requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = serviceClient();

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('social_posts')
    .select('id, body, thread, link_url, images, scheduled_at, topic, kind, variant')
    .eq('status', 'approved')
    .or(`scheduled_at.is.null,scheduled_at.lte.${nowIso}`)
    .order('created_at', { ascending: true })
    .limit(MAX_PER_RUN);
  if (error) throw new Error(`approved read failed: ${error.message}`);

  const rows = (data ?? []) as (PostablePost & { topic: string; kind: string; variant: string })[];
  if (rows.length === 0) { console.log('Nothing approved + due.'); return; }
  console.log(`Posting ${rows.length} via ${BACKEND}${dry ? ' [dry]' : ''}.`);

  for (const row of rows) {
    console.log(`\n• ${row.topic}/${row.kind}/${row.variant} ${row.id}`);
    console.log(`  ${row.body.slice(0, 100)}${row.body.length > 100 ? '…' : ''}`);
    if (dry) { console.log('  [dry] not posted'); continue; }
    try {
      const { permalink } = await post(row, BACKEND);
      await supabase.from('social_posts')
        .update({ status: 'posted', permalink, error_log: null })
        .eq('id', row.id).eq('status', 'approved'); // guard against races
      console.log(`  ✓ posted: ${permalink}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await supabase.from('social_posts')
        .update({ status: 'failed', error_log: msg.slice(0, 1000) })
        .eq('id', row.id).eq('status', 'approved');
      console.error(`  ✗ failed: ${msg}`);
    }
    await sleep(DELAY_MS);
  }
  console.log('\nDone.');
}

main().catch((err) => { console.error('social:post failed:', err instanceof Error ? err.message : err); process.exit(1); });
