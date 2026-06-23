/**
 * Posting backends for approved social posts.
 *
 *   - bluesky  : direct via the AT Protocol (free, no link penalty). Solid,
 *                well-documented — the recommended workhorse for Bluesky.
 *   - typefully: a scheduler that holds the X/LinkedIn/Threads relationship, so
 *                you avoid X's $0.20/link pay-per-use charge + ban-wave risk.
 *                **VERIFY the endpoint/auth against your current Typefully plan's
 *                API docs before relying on it** — marked below.
 *
 * Native-first: the post body carries NO link; the issue link goes in the FIRST
 * REPLY (segment index 1). Threads chain after that.
 */
import { requireEnv } from './social.js';

export type PosterBackend = 'bluesky' | 'typefully';

export interface PostablePost {
  id: string;
  body: string;
  thread: string[] | null;
  link_url: string | null;
  /** segment-index (0 = hook/body, 1..N = thread) → rendered card {ref,alt}. */
  images?: Record<string, { ref: string; alt?: string }> | null;
}

export interface PostResult { permalink: string }

/**
 * [body, ...thread, link] — empty segments dropped. The link is the FINAL
 * segment: for a single post that's the first reply (native-first); for a
 * threaded explainer it's the closing post, so the link never interrupts the
 * thread right after the hook.
 */
export function buildSegments(p: PostablePost): string[] {
  const segs = [p.body.trim()];
  for (const t of p.thread ?? []) if (t.trim()) segs.push(t.trim());
  if (p.link_url) segs.push(p.link_url.trim());
  return segs;
}

// ── Bluesky (AT Protocol) ─────────────────────────────────────────────────────

const BSKY = process.env.BLUESKY_PDS ?? 'https://bsky.social';

async function bskyXrpc<T>(method: string, body: unknown, jwt?: string): Promise<T> {
  const res = await fetch(`${BSKY}/xrpc/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`bluesky ${method} ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

/** Fetch a card image by URL and upload it as a Bluesky blob (≤1MB). */
async function bskyUploadImage(jwt: string, url: string): Promise<unknown> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch image ${r.status}`);
  const mime = r.headers.get('content-type') ?? 'image/png';
  const bytes = new Uint8Array(await r.arrayBuffer());
  const res = await fetch(`${BSKY}/xrpc/com.atproto.repo.uploadBlob`, {
    method: 'POST',
    headers: { 'Content-Type': mime, Authorization: `Bearer ${jwt}` },
    body: bytes,
  });
  if (!res.ok) throw new Error(`uploadBlob ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { blob: unknown }).blob;
}

/** Build a richtext link facet covering the whole text (UTF-8 byte range). */
function linkFacet(text: string, uri: string) {
  const bytes = Buffer.byteLength(text, 'utf8');
  return [{ index: { byteStart: 0, byteEnd: bytes }, features: [{ $type: 'app.bsky.richtext.facet#link', uri }] }];
}

export async function postViaBluesky(p: PostablePost): Promise<PostResult> {
  const identifier = requireEnv('BLUESKY_IDENTIFIER'); // handle or email
  const password = requireEnv('BLUESKY_APP_PASSWORD'); // an app password, not the account password
  const session = await bskyXrpc<{ accessJwt: string; did: string; handle: string }>(
    'com.atproto.server.createSession', { identifier, password },
  );

  const segs = buildSegments(p);
  let root: { uri: string; cid: string } | null = null;
  let parent: { uri: string; cid: string } | null = null;
  let firstUri = '';

  for (let i = 0; i < segs.length; i++) {
    const text = segs[i];
    const isLink = p.link_url != null && text === p.link_url.trim();
    const record: Record<string, unknown> = {
      $type: 'app.bsky.feed.post',
      text,
      createdAt: new Date().toISOString(),
      langs: ['en'],
      ...(isLink ? { facets: linkFacet(text, text) } : {}),
      ...(root && parent ? { reply: { root, parent } } : {}),
    };
    // attach this post's card (the link reply carries none)
    const img = isLink ? undefined : p.images?.[String(i)];
    if (img?.ref) {
      try {
        const blob = await bskyUploadImage(session.accessJwt, img.ref);
        record.embed = { $type: 'app.bsky.embed.images', images: [{ alt: img.alt ?? '', image: blob, aspectRatio: { width: 1600, height: 900 } }] };
      } catch (err) {
        console.warn(`  image attach skipped (post ${i}): ${err instanceof Error ? err.message : err}`);
      }
    }
    const out = await bskyXrpc<{ uri: string; cid: string }>(
      'com.atproto.repo.createRecord',
      { repo: session.did, collection: 'app.bsky.feed.post', record },
      session.accessJwt,
    );
    if (i === 0) { root = out; firstUri = out.uri; }
    parent = out;
  }

  // at://did/app.bsky.feed.post/<rkey> → bsky.app permalink
  const rkey = firstUri.split('/').pop() ?? '';
  return { permalink: `https://bsky.app/profile/${session.handle}/post/${rkey}` };
}

// ── Typefully (scheduler — holds the X relationship) ──────────────────────────
// VERIFY against https://support.typefully.com/en/articles/8718287-typefully-api
// (endpoint path, auth header, and the thread separator) before production use.
// The 4-newline separator splits content into a thread on Typefully.

export async function postViaTypefully(p: PostablePost): Promise<PostResult> {
  const key = requireEnv('TYPEFULLY_API_KEY');
  const content = buildSegments(p).join('\n\n\n\n');
  const res = await fetch('https://api.typefully.com/v1/drafts/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': `Bearer ${key}` },
    body: JSON.stringify({ content, threadify: false, share: true }),
  });
  if (!res.ok) throw new Error(`typefully ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { id?: number | string; share_url?: string };
  return { permalink: json.share_url ?? (json.id ? `https://typefully.com/draft/${json.id}` : 'typefully:queued') };
}

export async function post(p: PostablePost, backend: PosterBackend): Promise<PostResult> {
  return backend === 'bluesky' ? postViaBluesky(p) : postViaTypefully(p);
}
