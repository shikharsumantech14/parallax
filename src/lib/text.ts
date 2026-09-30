const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* ── Cue markers (the Lens reading system, docs/design/LENS.md §5.2) ─────────
   An inline `[[n]]` (n 1–4) in a prose field renders as the cue button, a real
   <button>, placed before the sentence it introduces. The text that follows
   the marker, up to the next marker or the end of the field, is wrapped as
   that cue's sentence (`.px-cue-s`), so the island can tint it when the cue is
   lit. The attribute order is fixed (class, type, data-cue): core/Section.astro
   decorates the figure's `data-cue` anchors with a regex that skips a button
   by that order. No JS: the button is present and inert, the sentence reads. */
const CUE_SPLIT = /\[\[([1-4])\]\]/;
const CUE_ANY = /\s*\[\[[1-4]\]\]\s*/g;

export function cueButton(n: number | string): string {
  return `<button class="px-cue" type="button" data-cue="${n}" aria-label="Cue ${n}" aria-pressed="false">${n}</button>`;
}

/** Wrap already-formatted HTML as cue n's sentence. */
export function cueSentence(n: number | string, html: string): string {
  return `<span class="px-cue-s" data-cue-s="${n}">${html}</span>`;
}

/** Split escaped text on its markers, format each run, and join the runs with
 *  the cue button and sentence span. Text with no marker is formatted as is. */
function withCues(escaped: string, fmt: (s: string) => string): string {
  const parts = escaped.split(CUE_SPLIT);
  if (parts.length === 1) return fmt(escaped);
  let out = fmt(parts[0]);
  for (let i = 1; i < parts.length; i += 2) {
    const n = parts[i];
    const seg = parts[i + 1] ?? '';
    const body = seg.trim();
    const tail = /\s$/.test(seg) ? ' ' : '';
    out += cueButton(n) + (body ? ' ' + cueSentence(n, fmt(body)) : '') + tail;
  }
  return out;
}

const emphasis = (s: string): string => s.replace(/\*(.+?)\*/g, '<em>$1</em>');
const inline = (s: string): string =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

export function renderEmphasis(input: string): string {
  return withCues(escapeHtml(input), emphasis);
}

export function renderInline(input: string): string {
  return withCues(escapeHtml(input), inline);
}

/** Remove every `[[n]]` marker, for surfaces with no figure beside them (story
 *  cards, meta tags, feeds, the share cards). */
export function stripCues(input: string): string {
  return input.replace(CUE_ANY, ' ').replace(/^ +| +$/g, '');
}

/** True when the string carries at least one cue marker. */
export function hasCues(input: string | undefined): boolean {
  return !!input && CUE_SPLIT.test(input);
}

/** A prose field's paragraphs: a blank line starts a new one. */
export function paragraphsOf(input: string | undefined): string[] {
  if (!input) return [];
  return input.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** Strip *italic* / **bold** markers (and cue markers), leaving plain text — for <title>, og:title, RSS. */
export function stripEmphasis(input: string): string {
  return stripCues(input).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

/* ── The short section name (the "In this issue" card and the progress rail) ─
   An authored `short` wins. Otherwise the eyebrow, then the title: leading
   function words dropped ("THE HISAAB" → "Hisaab", "TOKENS PER TASK" →
   "Tokens per task"), at most three words kept and a dangling function word
   trimmed from the end, sentence case. Editorial names that no rule can
   reach ("THE VOCABULARY" → "Glossary") are authored as `short`. */
const LEAD_STOP = new Set(['the', 'a', 'an', 'what', 'how', 'who', 'why', 'when', 'where', 'which']);
const TAIL_STOP = new Set(['the', 'a', 'an', 'of', 'per', 'for', 'and', 'to', 'in', 'on', 'with', 'by', 'at', 'from', 'is', 'are']);

export function shortLabel(s: { short?: string; eyebrow?: string; title?: string }, fallback: string): string {
  if (s.short && s.short.trim()) return s.short.trim();
  for (const src of [s.eyebrow, s.title]) {
    if (!src) continue;
    const words = stripEmphasis(src).replace(/[^\p{L}\p{N}\s'’-]/gu, ' ').split(/\s+/).filter(Boolean);
    while (words.length > 1 && LEAD_STOP.has(words[0].toLowerCase())) words.shift();
    const three = words.slice(0, 3);
    while (three.length > 1 && TAIL_STOP.has(three[three.length - 1].toLowerCase())) three.pop();
    const kept = three.join(' ').toLowerCase();
    if (kept) return kept.charAt(0).toUpperCase() + kept.slice(1);
  }
  return fallback;
}

export function formatIssueDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();
}

export function formatIssueNumber(n: number): string {
  return `— ${String(n).padStart(2, '0')}`;
}

export function formatSectionLabel(index: number, title?: string): string {
  const num = `— ${String(index + 1).padStart(2, '0')}`;
  return title ? `${num} — ${title}` : num;
}
