import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://parallaxlens.com',
  integrations: [mdx()],

  /* ONE PROJECT (merged 2026-09-06, superseding the app/ split).
     `hybrid` PRERENDERS BY DEFAULT — all 45 publication pages stay static CDN
     files, exactly as they were under `output: 'static'`. Only the reader-
     account surfaces opt out with `export const prerender = false`:
     /login, /account/welcome, /dashboard, /admin/*, /auth/callback, /api/*.
     The old split's stated fear — "hybrid would move every issue request onto
     a serverless function" — was the wrong way round; that is what `server`
     does, not `hybrid`. */
  output: 'hybrid',
  adapter: vercel(),
  build: {
    format: 'directory'
  },
  vite: {
    // `astro dev`'s Vite dependency pre-scan (esbuild) chokes on an inline
    // <script> while crawling components ("Failed to scan… Unexpected '.'").
    // It's non-fatal — pages still serve and `astro build` is unaffected —
    // but noisy. Disable the eager scan; client deps optimize lazily on first
    // import instead. Dev-only; has no effect on the production build.
    optimizeDeps: { noDiscovery: true, include: [] }
  }
});
