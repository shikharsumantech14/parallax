/**
 * On-brand social card renderer — satori (HTML/CSS → SVG) + @resvg/resvg-js
 * (SVG → PNG). One parameterised template, themed per topic by accent colour
 * only (Parallax is type-led: same trio of fonts everywhere). No browser, no
 * system fonts — fonts are embedded as vector paths.
 *
 * Fonts: loaded from assets/fonts/*.ttf (commit them, or run
 * `node scripts/fetch-fonts.mjs` once to download them). satori cannot read
 * WOFF2 — ship static TTFs. If the fonts are absent, renderCard throws a clear
 * error; the evergreen orchestrator catches it and queues the post text-only.
 *
 * CLI (visual check):  npm run social:card -- <topic> "<headline>" "<datum>"
 *   → writes .cache/social-cards/sample-<topic>.png (1600x900) + -sq.png (1080x1080)
 */
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CARD_THEME, TOPICS, type Topic } from './lib/social.js';

type Style = Record<string, string | number>;
interface El { type: string; props: { style: Style; children?: El[] | string } }
function div(style: Style, children?: El[] | string): El {
  return { type: 'div', props: children === undefined ? { style } : { style, children } };
}

const FONT_DIR = join(process.cwd(), 'assets', 'fonts');

// Fonts are matched by pattern in assets/fonts/ (any static Fraunces +
// JetBrains Mono TTF works, regardless of exact filename).

export interface CardBrief {
  eyebrow: string; // e.g. "SPACE · ISSUE — 04"
  headline: string; // the one-line claim (≤ ~70 chars)
  datum?: string; // optional single featured figure, e.g. "3.1%"
  accentTopic: Topic;
}

type SatoriFont = { name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' | 'italic' };

export function loadFonts(): SatoriFont[] {
  const files = existsSync(FONT_DIR)
    ? readdirSync(FONT_DIR).filter((f) => f.toLowerCase().endsWith('.ttf'))
    : [];
  const fraunces = files.find((f) => /fraunces/i.test(f) && !/italic/i.test(f));
  const mono = files.find((f) => /jetbrains/i.test(f));
  if (!fraunces || !mono) {
    throw new Error(
      `Missing card fonts in ${FONT_DIR}. Need a static Fraunces*.ttf + a JetBrainsMono*.ttf. ` +
        `Run \`node scripts/fetch-fonts.mjs\` or drop the TTFs in (any filename matching those names works).`,
    );
  }
  const fonts: SatoriFont[] = [
    { name: 'Fraunces', data: readFileSync(join(FONT_DIR, fraunces)), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: readFileSync(join(FONT_DIR, mono)), weight: 500, style: 'normal' },
  ];
  const italic = files.find((f) => /fraunces/i.test(f) && /italic/i.test(f));
  if (italic) fonts.push({ name: 'Fraunces', data: readFileSync(join(FONT_DIR, italic)), weight: 600, style: 'italic' });
  return fonts;
}

/** Render one card to a PNG buffer. size: 'wide' = 1600x900, 'square' = 1080x1080. */
export async function renderCard(brief: CardBrief, size: 'wide' | 'square' = 'wide'): Promise<Buffer> {
  const t = CARD_THEME[brief.accentTopic];
  const [w, h] = size === 'wide' ? [1600, 900] : [1080, 1080];
  const pad = size === 'wide' ? 96 : 84;
  const headlineSize = size === 'wide' ? 72 : 64;
  const datumSize = size === 'wide' ? 168 : 148;

  // Native satori element objects (no HTML string layer — more reliable).
  const top: El[] = [
    div({ display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: t.accent }, brief.eyebrow),
    div({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: headlineSize, lineHeight: 1.08, color: t.ink, maxWidth: w - pad * 2 }, brief.headline),
  ];
  if (brief.datum) {
    top.push(div({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: datumSize, lineHeight: 1, color: t.accent }, brief.datum));
  }

  const strip = div(
    { display: 'flex', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden' },
    TOPICS.map((tp) => div({ display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: 0, height: '100%', backgroundColor: CARD_THEME[tp].accent })),
  );

  const root = div(
    { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: w, height: h, padding: pad, backgroundColor: t.bg },
    [
      div({ display: 'flex', flexDirection: 'column', gap: 28 }, top),
      div({ display: 'flex', flexDirection: 'column', gap: 20 }, [
        div({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
          div({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 34, letterSpacing: 1, color: t.ink }, 'PARALLAX'),
          div({ display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', color: t.inkSoft }, 'parallaxlens.com'),
        ]),
        strip,
      ]),
    ],
  );

  const svg = await satori(root as unknown as Parameters<typeof satori>[0], { width: w, height: h, fonts: loadFonts() });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng());
}

// ── CLI (visual check) ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [topicArg, headline, datum] = process.argv.slice(2);
  const topic = (topicArg ?? 'space') as Topic;
  if (!TOPICS.includes(topic)) {
    console.error(`Usage: npm run social:card -- <${TOPICS.join('|')}> "<headline>" "<datum?>"`);
    process.exit(1);
  }
  const brief: CardBrief = {
    eyebrow: `${topic.toUpperCase()} · ISSUE — 01`,
    headline: headline ?? 'The story you think you already understand.',
    datum: datum || undefined,
    accentTopic: topic,
  };
  const outDir = join(process.cwd(), '.cache', 'social-cards');
  mkdirSync(outDir, { recursive: true });
  const wide = await renderCard(brief, 'wide');
  const square = await renderCard(brief, 'square');
  writeFileSync(join(outDir, `sample-${topic}.png`), wide);
  writeFileSync(join(outDir, `sample-${topic}-sq.png`), square);
  console.log(`Wrote ${outDir}/sample-${topic}.png (1600x900) + -sq.png (1080x1080).`);
}

// Run as CLI only when invoked directly (not when imported by promote.ts).
const invokedDirectly = process.argv[1] && process.argv[1].endsWith('social-cards.ts');
if (invokedDirectly) {
  main().catch((err) => {
    console.error('card render failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
