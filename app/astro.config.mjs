import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// Parallax — app subdomain (app.parallaxlens.com)
//
// This is a SEPARATE Astro project from the publication. The publication
// at parallaxlens.com stays static (output: 'static'). This subdomain
// hosts auth, the dashboard, and all /api/* endpoints.
//
// Why separate? See the approved plan at:
//   docs/COMMERCIALISATION-SETUP.md
//   (and the strategic plan saved in the user's .claude/plans/)
//
// Keeping the publication static protects 30+ hours of per-topic
// theming work. The app is the only thing that ever cold-starts.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://app.parallaxlens.com',
  server: {
    port: 4322,
    host: true
  }
});
