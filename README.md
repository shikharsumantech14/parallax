# Parallax

A visual explainer publication. *Stories you think you already understand, from a different angle.*

Built with Astro 4 + MDX + TypeScript. Static output, deployed on Vercel.

## Requirements

- Node `>= 20`
- npm (or pnpm / yarn — lockfile is npm)

## Quick start

```bash
npm install
npm run dev         # http://localhost:4321
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run new-issue` | Scaffold a new issue folder (Phase 2) |

## Project layout

```
src/
  content/issues/        MDX + data.json per issue
  layouts/               IssueLayout, HomeLayout
  components/
    core/                topic-agnostic (Masthead, Hero, Section, Quote, Sources, Footer)
    topic/{politics,space,tech,travel,sports}/
  styles/
    base.css             layout + structure (never colors/fonts)
    themes/{topic}.css   per-topic design tokens
  pages/
    index.astro          home
    issues/[slug].astro  dynamic issue route
    rss.xml.ts           RSS feed
```

## Deploy

Push `main` — Vercel picks it up.

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Node runtime: 20.x

## Writing an issue

1. Create `src/content/issues/YYYY-MM-DD-slug/index.mdx`
2. Fill frontmatter per the `Issue` schema in `src/content/config.ts`
3. Compose structured `sections` (see existing issue for reference)
4. List every cited `source` — sections reference them by `sourceRefs: ['src-01']`

## Roadmap

- **Phase 1** — politics theme + delimitation issue live ← *current*
- **Phase 2** — add a second topic theme
- **Phase 3+** — research + draft automation, email, analytics
