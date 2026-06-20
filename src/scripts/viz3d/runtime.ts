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
   ============================================================================ */

export type SceneColors = { accent: string; ink: string; paper: string; muted: string };
export type SceneHandle = {
  resize: (w: number, h: number, dpr: number) => void;
  frame: (tMs: number) => void;
  dispose: () => void;
};
export type SceneBuilder = (
  THREE: any,
  canvas: HTMLCanvasElement,
  data: any,
  colors: SceneColors,
) => SceneHandle;

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

export function initViz3D(builders: Record<string, SceneBuilder>): void {
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

async function boot(mount: HTMLElement, builders: Record<string, SceneBuilder>): Promise<void> {
  const type = mount.getAttribute('data-viz3d') || '';
  const builder = builders[type];
  if (!builder) return;

  let data: any = {};
  const dataEl = mount.querySelector('script.viz3d__data');
  if (dataEl && dataEl.textContent) {
    try { data = JSON.parse(dataEl.textContent); } catch { /* keep {} */ }
  }

  let THREE: any;
  try { THREE = await loadThree(); } catch { return; }

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
    visIO.disconnect();
    window.removeEventListener('resize', size);
    try { handle.dispose(); } catch { /* ignore */ }
  };
  window.addEventListener('pagehide', teardown, { once: true });
}
