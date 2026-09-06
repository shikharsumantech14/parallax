/* Parallax service worker — cache-on-read.
 *
 * WHAT IT IS FOR: an issue the reader has opened stays readable with no
 * network. Nothing is hoarded ahead of time; the cache grows only with what
 * they actually read.
 *
 * ── The line that matters ───────────────────────────────────────────────────
 * The build is `output: 'hybrid'`. Prerendered pages are anonymous and byte-
 * identical for every reader, so they are safe to keep. The 24 SSR routes are
 * never that: they carry a session, and a cached Shelf served to a second
 * reader would be a data leak, not a stale page. APP_ROUTES below mirrors the
 * list in `src/middleware.ts` — ADD A SURFACE THERE, ADD IT HERE. `storable()`
 * then checks `no-store` independently, so a surface that starts returning
 * per-session content without being listed still keeps itself out.
 *
 * The reading gate needs no special handling: it runs client-side on every
 * load, and the full article is in the page source either way (the soft-gate
 * design, deliberately SEO-safe). Cached HTML is gated exactly like fresh HTML.
 *
 * ── If this ever goes wrong ────────────────────────────────────────────────
 * A broken service worker persists in readers' browsers, so there is an escape
 * hatch by construction: registration uses `updateViaCache: 'none'`, meaning
 * THIS FILE is always revalidated against the network and never served from
 * the HTTP cache. Deploy a sw.js whose body is just
 *
 *   self.addEventListener('install', () => self.skipWaiting());
 *   self.addEventListener('activate', (e) => e.waitUntil(
 *     caches.keys().then((k) => Promise.all(k.map((n) => caches.delete(n))))
 *       .then(() => self.registration.unregister())));
 *
 * and every client drops it on their next visit. Bumping VERSION is the
 * lighter tool: it orphans every old cache and activate() deletes them.
 */

const VERSION = 'v1';
const SHELL = `px-shell-${VERSION}`;
const PAGES = `px-pages-${VERSION}`;
const ASSETS = `px-assets-${VERSION}`;
const KEEP = new Set([SHELL, PAGES, ASSETS]);

/* Deliberately tiny. Everything else arrives by being read. */
const PRECACHE = ['/', '/offline/'];

const APP_ROUTES = ['/login', '/dashboard', '/admin', '/auth', '/api', '/account'];
const isAppRoute = (p) => APP_ROUTES.some((r) => p === r || p.startsWith(r + '/'));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // Individually, so one 404 cannot fail the whole install and leave the
      // worker permanently stuck in `installing`.
      .then((cache) => Promise.all(PRECACHE.map((u) => cache.add(u).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/**
 * Storable = a complete, cacheable 200 that this origin actually produced.
 * `type === 'basic'` rejects opaque cross-origin responses, whose status is
 * always 0 and whose body cannot be inspected.
 */
function storable(res) {
  return (
    res &&
    res.status === 200 &&
    res.type === 'basic' &&
    !/no-store/i.test(res.headers.get('Cache-Control') || '')
  );
}

async function put(cacheName, req, res) {
  if (storable(res)) (await caches.open(cacheName)).put(req, res.clone());
  return res;
}

/** Hashed build output: the filename changes when the bytes do, so this is safe. */
async function cacheFirst(req, cacheName) {
  const hit = await caches.match(req);
  if (hit) return hit;
  return put(cacheName, req, await fetch(req));
}

/** Pages: fresh when online, cached when not, branded page when neither. */
async function networkFirst(req) {
  try {
    return await put(PAGES, req, await fetch(req));
  } catch {
    return (await caches.match(req)) || (await caches.match('/offline/')) || Response.error();
  }
}

/** Unhashed same-origin files (geo JSON, OG images, the favicon, rss.xml). */
async function staleWhileRevalidate(event, req, cacheName) {
  const hit = await caches.match(req);
  const fresh = fetch(req)
    .then((res) => put(cacheName, req, res))
    .catch(() => undefined);
  if (hit) {
    // Let the refresh finish even though the response has already gone out.
    event.waitUntil(fresh);
    return hit;
  }
  return (await fresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only reads. A POST is never idempotent enough to replay from a cache.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // v1 is same-origin only. Google Fonts would survive offline if cached, but
  // they arrive opaque and cannot be validated — and every face already ships
  // with a real fallback stack, so an offline read degrades to system type
  // rather than to nothing. Revisit with the font question, not before.
  if (url.origin !== self.location.origin) return;

  // Sessions never touch the cache.
  if (isAppRoute(url.pathname)) return;

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(req, ASSETS));
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  event.respondWith(staleWhileRevalidate(event, req, ASSETS));
});
