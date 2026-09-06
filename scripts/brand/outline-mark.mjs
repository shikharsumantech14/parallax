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
 * PLACEMENT IS EXACT, NOT EYEBALLED. The delivered SVGs set the glyph with
 * `<text x="150" y="207" font-size="160" text-anchor="middle">`, i.e. centred
 * on x=150 with its baseline at y=207. A capital P has no descender, so the
 * glyph's bounding box bottom IS its baseline — which makes the transform
 * solvable from the outline alone: centre the bbox on 150, sit its bottom on
 * 207. No reference render needed to place it.
 */
import { readFileSync, writeFileSync } from 'node:fs';
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

/* ── main ────────────────────────────────────────────────────────────────── */
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`
    || process.argv[1].endsWith('outline-mark.mjs')) {
  const src = process.argv[2];
  if (!src) {
    console.error('usage: node scripts/brand/outline-mark.mjs <literata-700.woff|ttf> [--write]');
    process.exit(1);
  }
  const ttf = woff2ttf(readFileSync(src));
  const d = await outlineGlyph(ttf);
  const outPath = 'scripts/brand/p-outline.path';
  writeFileSync(outPath, d);
  console.log(`glyph outlined · ${d.length} chars · wrote ${outPath}`);
}
