/* ============================================================================
   PARALLAX — lazy WebGL runtime for the 3D component library.
   ----------------------------------------------------------------------------
   Three.js is dynamic-imported ONCE, and only when a [data-viz3d] mount first
   scrolls into view (so the chunk never loads on the home page or non-3D
   issues, and only when a reader actually reaches a 3D card). The render loop
   pauses when the mount leaves the viewport and disposes on pagehide.

   No-JS / reduced-motion / no-WebGL: we return early and leave each mount's
   static SVG/HTML fallback in place — no canvas, no loop. This mirrors the
   html.js + prefers-reduced-motion contract used by core/Reveal.astro and
   motion-v2.css.

   Each scene builder receives THREE as a parameter (it must NOT import three
   itself) so three stays out of the eager bundle and in one lazy chunk.

   Scenes register via a per-scene LAZY registry (scenes/index.ts): each entry
   is either a plain SceneBuilder or a { load } loader whose dynamic import is
   its own code-split chunk — a scene's code only downloads when its mount
   scrolls in, alongside three.
   ============================================================================ */

export type SceneColors = { accent: string; ink: string; paper: string; muted: string };
export type SceneHandle = {
  resize: (w: number, h: number, dpr: number) => void;
  frame: (tMs: number) => void;
  dispose: () => void;
  /** Optional named-state switch (motion.md `stateSwitch`) — lets scroll-driven
      shells (layout: split chapters, state chips) re-pose a live scene, e.g.
      the chamber's composition ↔ division. Absent on scenes without states. */
  setState?: (name: string) => void;
};
export type SceneBuilder = (
  THREE: any,
  canvas: HTMLCanvasElement,
  data: any,
  colors: SceneColors,
) => SceneHandle;
export type SceneLoader = { load: () => Promise<{ build: SceneBuilder }> };
export type SceneEntry = SceneBuilder | SceneLoader;
export type SceneRegistry = Record<string, SceneEntry>;

let threePromise: Promise<any> | null = null;
function loadThree(): Promise<any> {
  if (!threePromise) threePromise = import('three');
  return threePromise;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function initViz3D(builders: SceneRegistry): void {
  if (typeof document === 'undefined') return;
  const mounts = Array.from(document.querySelectorAll<HTMLElement>('[data-viz3d]'));
  if (!mounts.length) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof IntersectionObserver === 'undefined' || !hasWebGL()) {
    return; // leave the static fallbacks; never load three
  }

  mounts.forEach((mount) => {
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          io.disconnect();
          void boot(mount, builders);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(mount);
  });
}

async function boot(mount: HTMLElement, builders: SceneRegistry): Promise<void> {
  const type = mount.getAttribute('data-viz3d') || '';
  const entry = builders[type];
  if (!entry) return;

  let data: any = {};
  const dataEl = mount.querySelector('script.viz3d__data');
  if (dataEl && dataEl.textContent) {
    try { data = JSON.parse(dataEl.textContent); } catch { /* keep {} */ }
  }

  let THREE: any; let builder: SceneBuilder;
  try {
    const [t, b] = await Promise.all([
      loadThree(),
      typeof entry === 'function' ? Promise.resolve(entry) : entry.load().then((m) => m.build),
    ]);
    THREE = t; builder = b;
  } catch { return; }

  const cs = getComputedStyle(mount);
  const colors: SceneColors = {
    accent: cs.getPropertyValue('--accent').trim() || '#888888',
    ink: cs.getPropertyValue('--ink').trim() || '#111111',
    paper: cs.getPropertyValue('--paper').trim() || '#ffffff',
    muted: cs.getPropertyValue('--muted').trim() || '#777777',
  };

  const canvas = document.createElement('canvas');
  canvas.className = 'viz3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  mount.appendChild(canvas);

  let handle: SceneHandle;
  try {
    handle = builder(THREE, canvas, data, colors);
  } catch {
    canvas.remove();
    return;
  }

  mount.classList.add('viz3d--live'); // CSS hides the static fallback

  // State-chip bridge (chamber blueprint §8): component chips set
  // `data-viz3d-state` on the mount; if the scene exposes setState, mirror
  // attribute changes into it. Zero cost to scenes without states.
  let stateMO: MutationObserver | null = null;
  if (handle.setState) {
    stateMO = new MutationObserver(() => {
      const s = mount.getAttribute('data-viz3d-state');
      if (s) { try { handle.setState!(s); } catch { /* ignore */ } }
    });
    stateMO.observe(mount, { attributes: true, attributeFilter: ['data-viz3d-state'] });
  }

  const size = () => {
    const r = mount.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (r.width > 0 && r.height > 0) handle.resize(r.width, r.height, dpr);
  };
  size();
  window.addEventListener('resize', size, { passive: true });

  let raf = 0;
  let visible = true;
  const loop = (t: number) => {
    handle.frame(t);
    raf = requestAnimationFrame(loop);
  };
  const visIO = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
      else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    },
    { threshold: 0 },
  );
  visIO.observe(mount);
  if (visible && !raf) raf = requestAnimationFrame(loop);

  const teardown = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (stateMO) stateMO.disconnect();
    visIO.disconnect();
    window.removeEventListener('resize', size);
    try { handle.dispose(); } catch { /* ignore */ }
  };
  window.addEventListener('pagehide', teardown, { once: true });
}
