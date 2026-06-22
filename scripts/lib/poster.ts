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
}

export interface PostResult { permalink: string }

/** [body, link (first reply), ...thread] — empty segments dropped. */
export function buildSegments(p: PostablePost): string[] {
  const segs = [p.body.trim()];
  if (p.link_url) segs.push(p.link_url.trim());
  for (const t of p.thread ?? []) if (t.trim()) segs.push(t.trim());
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
    const isLink = i === 1 && p.link_url === text;
    const record: Record<string, unknown> = {
      $type: 'app.bsky.feed.post',
      text,
      createdAt: new Date().toISOString(),
      langs: ['en'],
      ...(isLink ? { facets: linkFacet(text, text) } : {}),
      ...(root && parent ? { reply: { root, parent } } : {}),
    };
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
