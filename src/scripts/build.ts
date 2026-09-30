/**
 * build.ts — the one build island (Lens Phase 5, docs/design/LENS.md §6.3 and
 * §6.4). Loaded once per layout as a bundled module. No library. Budget: 3 KB
 * minified (`npx esbuild src/scripts/build.ts --bundle --minify --format=esm`).
 *
 * THE CONTRACT (the markup declares, this file only runs it):
 *   [data-build-scene]            a build root. Optional `data-build-delay`
 *                                 (ms before the first step) and
 *                                 `data-build-tempo` (a multiplier on every
 *                                 duration; the Home stage runs at 1.6).
 *   [data-build="n"]              an element of the scene, in step n (an
 *                                 integer). Elements sharing n stagger 80ms
 *                                 in document order (a step of more than nine
 *                                 compresses so its spread stays 640ms).
 *   [data-build-kind]             counter | draw | grow-x | grow-y | drop |
 *                                 rise | fade (default fade).
 *   counter  + data-to="1330"     tweens 0 to data-to on requestAnimationFrame,
 *            (+ data-format=      ease-out cubic, 1400ms, keeping the text
 *             "int" | "1dp")      around the number; ends on the HTML text.
 *   draw                          an SVG path / line / circle / polyline: the
 *                                 island measures its length and draws it by
 *                                 stroke-dashoffset, 1400ms.
 *   grow-x / grow-y               `scale` from the element's transform-origin
 *                                 (the component sets it), 900ms.
 *   drop / rise / fade            opacity with 6px down / 8px up / nothing,
 *                                 420ms.
 *   [data-build-replay]           a button inside a scene; ships `hidden`, is
 *                                 shown here, and replays the scene (a 200ms
 *                                 fade to the start state, then the build).
 *   `px:build` (event)            dispatched on a scene (bubbling) by another
 *                                 island that has just shown it: replays it.
 * A scene starts when 35% of it (or 35% of the screen's height of it) is in
 * view. Step n+1 starts when step n is 70% through. All movement is CSS
 * classes from motion-v2.css (.bx-pre, .bx-on, .bx-<kind>) on `translate`,
 * `scale`, `opacity` and `stroke-dashoffset`, so a component's own
 * `transform` is never touched.
 *
 * FALLBACK. The start state is applied HERE, never in the HTML, so the static
 * page is the final state: no JS, reduced motion (this file then does
 * nothing), print (finished on `beforeprint`) and the render gate (it
 * dispatches `px:build-finish`) all see it. When a scene ends every class and
 * inline property this file added is removed and every counter is back on its
 * HTML text: `data-build-state="done"` and a `px:built` event on the scene.
 */
export {};
type El = HTMLElement & SVGGeometryElement;
type Scene = { el: HTMLElement; t: ReturnType<typeof setTimeout>[]; raf: number[] };

const D = document;
const DUR: Record<string, number> = { counter: 1400, draw: 1400, 'grow-x': 900, 'grow-y': 900 };
const NAMES = ['fade', 'drop', 'rise', 'draw', 'grow-x', 'grow-y'];
const KINDS = NAMES.map((k) => 'bx-' + k);
const text = new WeakMap<Element, string>();
const scenes = new Map<Element, Scene>();

const kindOf = (e: El) => {
  const k = e.dataset.buildKind || 'fade';
  return k === 'counter' || (NAMES.includes(k) && (k !== 'draw' || 'getTotalLength' in e)) ? k : 'fade';
};
const els = (s: Element) =>
  [...s.querySelectorAll<El>('[data-build]')].filter((e) => e.closest('[data-build-scene]') === s);

/** The counter's text at value v: the HTML text with its number replaced. */
const count = (e: El, v: number) => {
  const t = text.get(e)!;
  const a = t.search(/\d/);
  const b = t.search(/\d[^\d]*$/) + 1;
  if (a < 0) return;
  const d = e.dataset.format === '1dp' ? 1 : 0;
  e.textContent = t.slice(0, a) + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + t.slice(b);
};

function stop(s: Scene) {
  s.t.forEach(clearTimeout);
  s.raf.forEach(cancelAnimationFrame);
  s.t = [];
  s.raf = [];
}

/** Everything this file added comes off; the static page is what remains. */
function done(s: Scene) {
  stop(s);
  for (const e of els(s.el)) {
    e.classList.remove('bx-pre', 'bx-on', ...KINDS);
    e.style.removeProperty('--bx-d');
    e.style.removeProperty('--bx-len');
    if (text.has(e)) e.textContent = text.get(e)!;
  }
  s.el.classList.remove('bx-fading');
  s.el.dataset.buildState = 'done';
  s.el.dispatchEvent(new Event('px:built', { bubbles: true }));
}

/** The start state. */
function arm(s: Scene) {
  for (const e of els(s.el)) {
    const k = kindOf(e);
    e.classList.remove('bx-on');
    if (k === 'counter') {
      if (!text.has(e)) text.set(e, e.textContent || '');
      count(e, 0);
      continue;
    }
    if (k === 'draw') {
      const p = e.getAttribute('pathLength');
      e.style.setProperty('--bx-len', String(p ? +p : e.getTotalLength()));
    }
    e.classList.add('bx-pre', 'bx-' + k);
  }
  s.el.dataset.buildState = 'pre';
  void s.el.offsetWidth;
}

function run(s: Scene) {
  stop(s);
  s.el.classList.remove('bx-fading');
  s.el.dataset.buildState = 'run';
  const tempo = +(s.el.dataset.buildTempo || 1);
  const steps = new Map<number, El[]>();
  for (const e of els(s.el)) {
    const n = +e.dataset.build! || 0;
    steps.set(n, [...(steps.get(n) || []), e]);
  }
  let at = +(s.el.dataset.buildDelay || 0);
  let end = at;
  for (const n of [...steps.keys()].sort((a, b) => a - b)) {
    const g = steps.get(n)!;
    const gap = g.length > 1 ? Math.min(80, 640 / (g.length - 1)) : 0;
    let len = 0;
    g.forEach((e, i) => {
      const k = kindOf(e);
      const d = (DUR[k] || 420) * tempo;
      const off = i * gap * tempo;
      len = Math.max(len, off + d);
      s.t.push(
        setTimeout(() => {
          if (k !== 'counter') {
            e.style.setProperty('--bx-d', d + 'ms');
            e.classList.replace('bx-pre', 'bx-on');
            return;
          }
          const to = +e.dataset.to! || 0;
          let t0 = 0;
          const tick = (now: number) => {
            t0 ||= now;
            const p = Math.min(1, (now - t0) / d);
            count(e, to * (1 - (1 - p) ** 3));
            if (p < 1) s.raf.push(requestAnimationFrame(tick));
            else e.textContent = text.get(e)!;
          };
          s.raf.push(requestAnimationFrame(tick));
        }, at + off),
      );
    });
    end = Math.max(end, at + len);
    at += len * 0.7;
  }
  s.t.push(setTimeout(() => done(s), end + 60));
}

function replay(s: Scene) {
  stop(s);
  s.el.classList.add('bx-fading');
  arm(s);
  s.t.push(setTimeout(() => run(s), 220));
}

const finishAll = () => scenes.forEach((s) => s.el.dataset.buildState !== 'done' && done(s));

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        const s = scenes.get(e.target);
        if (!s || !e.isIntersecting) continue;
        if (e.intersectionRatio < 0.35 && e.intersectionRect.height < innerHeight * 0.35) continue;
        io.unobserve(e.target);
        run(s);
      }
    },
    { threshold: [0, 0.1, 0.2, 0.35] },
  );
  for (const el of D.querySelectorAll<HTMLElement>('[data-build-scene]')) {
    const s: Scene = { el, t: [], raf: [] };
    scenes.set(el, s);
    arm(s);
    io.observe(el);
    for (const b of el.querySelectorAll<HTMLElement>('[data-build-replay]')) {
      b.hidden = false;
      b.addEventListener('click', () => {
        io.unobserve(el);
        replay(s);
      });
    }
  }
  D.addEventListener('px:build-finish', finishAll);
  // A scene shown by its own island (the intro overlay's stepper) asks for
  // its build again with a bubbling `px:build` event.
  D.addEventListener('px:build', (e) => {
    const s = scenes.get(e.target as Element);
    if (s) {
      io.unobserve(s.el);
      replay(s);
    }
  });
  addEventListener('beforeprint', finishAll);
}
