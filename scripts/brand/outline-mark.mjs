#!/usr/bin/env node
/**
 * RD-10 step 1 — outline the mark's "P" from the Literata 700 binary into a
 * `<path>`, so the mark is identical everywhere including satori and resvg,
 * which cannot load fonts for SVG text.
 *
 *   node scripts/brand/outline-mark.mjs <literata-700.ttf> [--write]
 *
 * WHY A SCRIPT AND NOT A COMMITTED PATH ALONE. The handoff ships 38 SVGs that
 * all set the P as live `<text font-family="Literata…">`. As delivered the mark
 * therefore depends on a font RD-11 keeps out of the product, and the favicon
 * already renders in whatever serif the OS happens to have. This turns the
 * glyph into geometry once; the OUTPUT is committed, the binary never is.
 *
 * WHICH INSTANCE — settled 2026-09-06, operator ruling "variable at display
 * opsz". Literata is variable on opsz 7..72, and the instances differ enough to
 * matter: cap height 0.701/em at the text cut against 0.730/em at the display
 * cut. Google's CSS2 API serves a STATIC SLICE when you pin the axis to a
 * point, so no variable instancer is needed — just ask for the point:
 *
 *   https://fonts.googleapis.com/css2?family=Literata:opsz,wght@72,700
 *
 * Pinning matters. Requesting the RANGE (`opsz,wght@7..72,700`) with a legacy
 * UA returns a static at the TEXT end, which is a different letterform; that
 * mistake cost one round of measurement here. Verified: the opsz@72 slice
 * renders identically to what Chrome picks for Literata at 160px (607 vs 608
 * ink pixels at 96px), and its cap height matches the type harvest's 0.730.
 *
 * THE BINARY IS NOT IN THE REPO, deliberately (RD-11: a Literata *shape*, no
 * Literata *file*). Obtaining one is genuinely awkward and worth writing down:
 *   · Google Fonts serves .woff even to the legacy User-Agent that makes it
 *     serve .ttf for other families (verified 2026-09-06).
 *   · @fontsource/literata@5 ships woff/woff2 only — no TTF at all.
 *   · google/fonts ships Literata as a VARIABLE ttf, which satori's parser
 *     crashes on (see scripts/fetch-fonts.mjs).
 * So the static .woff is the only static source, and WOFF is a per-table zlib
 * wrapper around SFNT — decompressible with node:zlib in ~60 lines. See
 * `woff2ttf` below.
 *
 * TWO TIERS — operator ruling 2026-09-06. A display cut is high-contrast, and
 * its hairlines do not survive small sizes: filled as a path, the opsz@72 glyph
 * carries 3.6% less ink than its own text rendering at 96px and 14.6% less at
 * 40px, while the opsz@14 cut matches its own to 0.15%. So the mark ships TWO
 * outlines and picks by size, the same way the ring stroke already steps
 * 7/10/14 units:
 *
 *   display  opsz 72   the large mark — About's 168px, covers, banners
 *   text     opsz 14   favicon, app icon, masthead, anywhere small
 *
 *   node scripts/brand/outline-mark.mjs <woff> display
 *   node scripts/brand/outline-mark.mjs <woff> text
 *
 * PLACEMENT IS EXACT, NOT EYEBALLED. The delivered SVGs set the glyph with
 * `<text x="150" y="207" font-size="160" text-anchor="middle">`, i.e. centred
 * on x=150 with its baseline at y=207. A capital P has no descender, so the
 * glyph's bounding box bottom IS its baseline — which makes the transform
 * solvable from the outline alone: centre the bbox on 150, sit its bottom on
 * 207. No reference render needed to place it.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import satori from 'satori';

/* ── WOFF → SFNT ─────────────────────────────────────────────────────────── */
export function woff2ttf(woff) {
  if (woff.toString('latin1', 0, 4) !== 'wOFF') return woff; // already SFNT
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);
  const entries = [];
  for (let i = 0; i < numTables; i++) {
    const p = 44 + i * 20;
    entries.push({
      tag: woff.toString('latin1', p, p + 4),
      offset: woff.readUInt32BE(p + 4),
      compLength: woff.readUInt32BE(p + 8),
      origLength: woff.readUInt32BE(p + 12),
      checksum: woff.readUInt32BE(p + 16),
    });
  }
  for (const e of entries) {
    const raw = woff.subarray(e.offset, e.offset + e.compLength);
    // compLength === origLength means STORED, not deflated.
    e.data = e.compLength === e.origLength ? Buffer.from(raw) : inflateSync(raw);
    if (e.data.length !== e.origLength) {
      throw new Error(`table ${e.tag}: inflated ${e.data.length}, expected ${e.origLength}`);
    }
  }
  entries.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  const pad4 = (n) => (n + 3) & ~3;
  let offset = 12 + numTables * 16;
  for (const e of entries) { e.outOffset = offset; offset += pad4(e.data.length); }
  const out = Buffer.alloc(offset, 0);
  const maxPow2 = Math.floor(Math.log2(numTables));
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(16 * 2 ** maxPow2, 6);
  out.writeUInt16BE(maxPow2, 8);
  out.writeUInt16BE(numTables * 16 - 16 * 2 ** maxPow2, 10);
  entries.forEach((e, i) => {
    const p = 12 + i * 16;
    out.write(e.tag, p, 4, 'latin1');
    out.writeUInt32BE(e.checksum, p + 4);
    out.writeUInt32BE(e.outOffset, p + 8);
    out.writeUInt32BE(e.data.length, p + 12);
    e.data.copy(out, e.outOffset);
  });
  return out;
}

/* ── outline ─────────────────────────────────────────────────────────────── */
export async function outlineGlyph(ttf, { char = 'P', size = 160 } = {}) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '600px', height: '600px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Literata', fontWeight: 700, fontSize: `${size}px`, color: '#000',
        },
        children: char,
      },
    },
    { width: 600, height: 600, fonts: [{ name: 'Literata', data: ttf, weight: 700, style: 'normal' }] }
  );
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) throw new Error('satori emitted no <path> — the text was not outlined');
  return paths.sort((a, b) => b.length - a.length)[0];
}

/* ── geometry ────────────────────────────────────────────────────────────── */
/* satori emits absolute M/L/Q/Z only, so a small exact parser is enough — and
   an exact bbox matters, because placement is derived from it. Quadratic
   extrema are solved rather than approximated from control points, which would
   overstate the box and shift the glyph. */
export function pathBBox(d) {
  const nums = (str) => str.trim().split(/[\s,]+/).map(Number);
  let x = 0, y = 0, sx = 0, sy = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const hit = (px, py) => {
    if (px < minX) minX = px; if (px > maxX) maxX = px;
    if (py < minY) minY = py; if (py > maxY) maxY = py;
  };
  const quadExtrema = (p0, p1, p2) => {
    const denom = p0 - 2 * p1 + p2;
    if (Math.abs(denom) < 1e-12) return [];
    const t = (p0 - p1) / denom;
    if (t <= 0 || t >= 1) return [];
    return [(1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2];
  };
  for (const [, cmd, args] of d.matchAll(/([MLQZ])([^MLQZ]*)/gi)) {
    const a = args.trim() ? nums(args) : [];
    if (cmd === 'M') { [x, y] = a; sx = x; sy = y; hit(x, y); }
    else if (cmd === 'L') { for (let i = 0; i < a.length; i += 2) { x = a[i]; y = a[i + 1]; hit(x, y); } }
    else if (cmd === 'Q') {
      for (let i = 0; i < a.length; i += 4) {
        const [cx, cy, ex, ey] = a.slice(i, i + 4);
        hit(ex, ey);
        quadExtrema(x, cx, ex).forEach((v) => hit(v, y));
        quadExtrema(y, cy, ey).forEach((v) => hit(x, v));
        x = ex; y = ey;
      }
    } else if (cmd === 'Z' || cmd === 'z') { x = sx; y = sy; }
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/* Bake the placement into the coordinates so the consumer needs no transform
   and no magic numbers. */
export function translatePath(d, dx, dy) {
  return d.replace(/([MLQ])([^MLQZ]*)/gi, (_, cmd, args) => {
    const a = args.trim().split(/[\s,]+/).map(Number);
    const moved = a.map((v, i) => +(v + (i % 2 === 0 ? dx : dy)).toFixed(2));
    return cmd + moved.join(' ');
  });
}

/* ── main ────────────────────────────────────────────────────────────────── */
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`
    || process.argv[1].endsWith('outline-mark.mjs')) {
  const src = process.argv[2];
  if (!src) {
    console.error('usage: node scripts/brand/outline-mark.mjs <literata-700.woff|ttf> [--write]');
    process.exit(1);
  }
  const tier = process.argv[3] || 'display';
  if (!['display', 'text'].includes(tier)) {
    console.error('tier must be "display" (opsz 72) or "text" (opsz 14)');
    process.exit(1);
  }
  const ttf = woff2ttf(readFileSync(src));
  const raw = await outlineGlyph(ttf);

  /* Place it: the delivered SVGs set the P centred on x=150 with its baseline
     at y=207, and a capital P has no descender, so bbox bottom IS the baseline. */
  const bb = pathBBox(raw);
  const d = translatePath(raw, 150 - (bb.x + bb.width / 2), 207 - (bb.y + bb.height));

  const outPath = `scripts/brand/p-outline-${tier}.path`;
  writeFileSync(outPath, d);
  console.log(`glyph outlined · tier=${tier} · cap ${(bb.height / 160).toFixed(4)}/em`
            + ` · ${d.length} chars · wrote ${outPath}`);

  /* Emit the module the component consumes, once both tiers exist, so nothing
     is copied by hand and the two cannot drift. */
  const other = tier === 'display' ? 'text' : 'display';
  const otherPath = `scripts/brand/p-outline-${other}.path`;
  if (existsSync(otherPath)) {
    const paths = {
      display: tier === 'display' ? d : readFileSync(otherPath, 'utf8').trim(),
      text: tier === 'text' ? d : readFileSync(otherPath, 'utf8').trim(),
    };
    const mod = `/* GENERATED by scripts/brand/outline-mark.mjs — do not hand-edit.
 *
 * The mark's "P", outlined from Literata 700 at two optical sizes (RD-10,
 * RD-11: a Literata shape, never a Literata file). Coordinates are already
 * placed on the 300-unit box — centred on x=150, baseline y=207 — so a
 * consumer drops the path in with no transform.
 *
 * TWO TIERS, because a display cut's hairlines do not survive small sizes:
 * filled as a path the opsz@72 glyph loses 14% of its ink at 40px, the opsz@14
 * cut 2.9%. Measured 2026-09-06.
 */
export const MARK_GLYPH = {
  /** opsz 72 — cap 0.730/em. The large mark: About's 168px, covers, banners. */
  display: '${paths.display}',
  /** opsz 14 — cap 0.7013/em. Favicon, app icon, masthead, anything small. */
  text: '${paths.text}',
} as const;

/** The glyph tier flips with the ring's own 96/40/24 steps. */
export function glyphTier(size: number): keyof typeof MARK_GLYPH {
  return size >= 96 ? 'display' : 'text';
}
`;
    writeFileSync('src/lib/mark-glyph.ts', mod);
    console.log('wrote src/lib/mark-glyph.ts (both tiers)');
  }
}
