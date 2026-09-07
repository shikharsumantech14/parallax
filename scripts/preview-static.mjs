#!/usr/bin/env node
/**
 * preview-static — serve the built output at .vercel/output/static.
 *
 *   npm run preview            # after npm run build
 *
 * WHY THIS EXISTS. `astro preview` cannot run under the Vercel serverless
 * adapter — it refuses the command outright:
 *
 *   [preview] The @astrojs/vercel/serverless adapter does not support the
 *   preview command.
 *
 * So `npm run preview` had been dead since the merge flipped the build to
 * `output: 'hybrid'` (2026-09-06), and nothing said so.
 *
 * WHAT IT COVERS, AND WHAT IT DOES NOT. The 45 prerendered pages, every hashed
 * asset, the manifest, the icons and the service worker — that is, everything
 * that only exists after a real build, and therefore everything `astro dev`
 * cannot show you. The service worker in particular registers only in
 * production (`import.meta.env.PROD`), so this is the ONLY way to exercise it
 * locally.
 *
 * The 24 SSR routes are absent: they are a serverless function, not files.
 * `astro dev` renders those, with DEV_ADMIN_EMAIL standing in for a session.
 * Between the two you can reach every surface; neither does it alone.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, resolve as resolvePath } from 'node:path';

const ROOT = resolvePath(process.cwd(), '.vercel', 'output', 'static');
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

/** `format: 'directory'`, so /archive/ is /archive/index.html on disk. */
async function resolveFile(pathname) {
  const candidates = pathname.endsWith('/')
    ? [join(ROOT, pathname, 'index.html')]
    : [join(ROOT, pathname), join(ROOT, pathname, 'index.html'), join(ROOT, `${pathname}.html`)];

  for (const candidate of candidates) {
    if (!normalize(candidate).startsWith(ROOT)) continue; // no traversal
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* try the next shape */
    }
  }
  return null;
}

try {
  if (!(await stat(ROOT)).isDirectory()) throw new Error('not a directory');
} catch {
  console.error(`preview-static: no build at ${ROOT}\n  run: npm run build`);
  process.exit(1);
}

createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  const file = await resolveFile(pathname);
  if (!file) {
    // An SSR route reaching here is expected, not a defect — say which.
    const ssr = /^\/(api|login|auth|dashboard|admin|account)(\/|$)/.test(pathname);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(
      ssr
        ? `404 — ${pathname} is an SSR route and is not part of the static build.\nUse: npm run dev\n`
        : `404 — ${pathname}\n`,
    );
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    // Let the service worker own caching; the HTTP layer must not mask it.
    'Cache-Control': 'no-cache',
  });
  res.end(await readFile(file));
}).listen(PORT, () => {
  console.log(`preview-static: http://localhost:${PORT}  (${ROOT})`);
  console.log('  serves the 45 prerendered pages, assets, manifest and sw.js');
  console.log('  SSR routes are NOT here — use `npm run dev` for those');
});
