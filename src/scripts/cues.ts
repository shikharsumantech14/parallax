/**
 * cues.ts — the reading system's one island (Lens Phase 3, docs/design/LENS.md
 * §5.3 and §5.6). Loaded once by src/pages/issues/[slug].astro as a bundled
 * module. No library, no framework. Budget: about 2 KB minified.
 *
 * 1. LIGHTING. Pressing a cue button (`.px-cue`, from a `[[n]]` marker) lights
 *    the anchors that cue names. core/Section.astro has already written the
 *    numerals onto them (`data-cue-n="n"` beside `data-cue`), so this sets
 *    `data-lit="true"` on those and "false" on every other anchor in the
 *    figure (the CSS keeps an unlit anchor that holds a lit one, or sits
 *    inside one, at full strength, since opacity multiplies). The section
 *    takes `data-lit-n="n"`, from which the CSS tints the cue's sentences,
 *    presses its discs and shows its line in the figure panel (the lines are
 *    rendered, one per cue). Pressing the lit cue again, or Show all, clears
 *    it. A cue button crossing the middle third of the screen lights too.
 *    Section 1 plays its cues once, 1400ms apart, when its figure first comes
 *    into view and has finished its build (the `px:built` event from
 *    src/scripts/build.ts; at once when nothing is building), then shows all.
 * 2. PROGRESS. The section crossing a line 40% down the screen is current:
 *    the rail's dot and the head card's entry take `aria-current` (the CSS
 *    marks the ones before it as read and fills the rail's line up to it),
 *    `--px-read` on the root drives the card's bar, and the card counts the
 *    sections passed.
 * 3. THE PHONE PIN. Below 1024px a figure pins at the top only when it fits
 *    40% of the screen at 0.75 scale or more (`zoom`, so a 12px label still
 *    prints at 9px); otherwise it stays in the flow above its article. Refitted when the width changes, never when
 *    only the height does (a phone's address bar).
 *
 * Reduced motion: no autoplay (the CSS drops the transitions). No JS: every
 * anchor at full strength, every numeral visible, the buttons inert, each
 * figure in flow above its article.
 */
type Sec = { el: HTMLElement; fig: HTMLElement; cur: number; auto?: boolean; tm?: any };

const D = document;
const $$ = (sel: string, root: ParentNode = D) => [...root.querySelectorAll<HTMLElement>(sel)];
const secs = new Map<Element, Sec>();
const IO = IntersectionObserver;

function light(s: Sec, n: number) {
  const all = $$('[data-cue]:not(.px-cue)', s.fig);
  const on = all.filter((a) => a.dataset.cueN?.split(' ').includes('' + n));
  for (const a of all) {
    if (on[0]) a.dataset.lit = on.includes(a) as any;
    else delete a.dataset.lit;
  }
  for (const b of $$('.px-cue', s.el)) b.ariaPressed = (+b.dataset.cue! === n) as any;
  s.el.dataset.litN = (n || '') as any;
  s.cur = n;
}

for (const el of $$('.px-rs--fig')) {
  const fig = el.querySelector<HTMLElement>('.px-fig')!;
  if (!el.querySelector('.px-cue')) continue;
  const s: Sec = { el, fig, cur: 0 };
  secs.set(el, s);
  el.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('.px-cue,[data-cue-all]');
    if (!t) return;
    s.auto = false;
    const n = +(t.dataset.cue || 0);
    light(s, n === s.cur ? 0 : n);
  });
}

// A cue button crossing the middle third of the screen lights its cue.
const mid = new IO(
  (es) => {
    for (const e of es) {
      const b = e.target as HTMLElement;
      const s = secs.get(b.closest('.px-rs')!);
      if (e.isIntersecting && s && !s.auto) light(s, +b.dataset.cue!);
    }
  },
  { rootMargin: '-33% 0px' },
);
for (const b of $$('.px-section__copy .px-cue')) mid.observe(b);

// Section 1 plays its cues once, when its figure first comes into view.
const first = secs.get(D.getElementById('sec-1')!);
if (first && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ns = $$('[data-cue-line]', first.fig).map((l) => +l.dataset.cueLine!);
  const o = new IO(
    ([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      first.auto = true;
      const step = () => {
        if (!first.auto) return;
        const n = ns.shift() || 0;
        light(first, n);
        first.auto = !!n;
        setTimeout(step, 1400);
      };
      // The cues play once the figure has built (src/scripts/build.ts).
      const b = first.fig.querySelector('[data-build-state]:not([data-build-state=done])');
      b ? b.addEventListener('px:built', step, { once: true }) : step();
    },
    { threshold: 0.35 },
  );
  o.observe(first.fig);
}

// ── progress: the rail and the head card ────────────────────────────────────
const sections = $$('.px-rs');
const N = sections.length;
const mark = (cur: number, read: number) => {
  for (const a of $$('[data-rail],[data-toc]')) a.ariaCurrent = +(a.dataset.rail || a.dataset.toc!) === cur ? 'step' : null;
  D.documentElement.style.setProperty('--px-read', read as any);
  for (const r of $$('[data-toc-read]')) r.textContent = `${read} of ${N} read`;
};
const band = new IO(
  (es) => {
    for (const e of es) {
      const i = sections.indexOf(e.target as HTMLElement);
      if (e.isIntersecting) i < 0 ? mark(N, N) : mark(i + 1, i);
    }
  },
  { rootMargin: '-40% 0px -59%' },
);
for (const el of [...sections, D.getElementById('px-finish-sentinel')]) el && band.observe(el);

// ── the phone pin ────────────────────────────────────────────────────────────
const fit = () => {
  for (const fig of $$('.px-fig')) {
    const body = fig.children[1] as HTMLElement;
    body.style.zoom = '';
    delete fig.dataset.pin;
    if (innerWidth > 1023) continue;
    const h = body.offsetHeight;
    const k = ((innerHeight * 0.4 - fig.offsetHeight + h) / h) * 0.99;
    if (k >= 0.75) {
      if (k < 1) body.style.zoom = k as any;
      fig.dataset.pin = '';
    }
  }
};
let w = innerWidth;
addEventListener('resize', () => {
  if (w !== innerWidth) {
    w = innerWidth;
    fit();
  }
});
fit();
D.fonts?.ready.then(fit);
