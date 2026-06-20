import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://parallaxlens.com',
  integrations: [mdx()],
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
