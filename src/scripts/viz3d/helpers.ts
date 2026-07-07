/* ============================================================================
   PARALLAX — shared scene capabilities for the 3D library.
   ----------------------------------------------------------------------------
   Optional building blocks passed by scenes that need them (orbit+zoom
   controls, raycast picking, the shared tooltip, instancing, glow sprites).
   Like the scene builders, every function takes THREE as a PARAMETER and
   never imports three — the library stays in its lazy chunk.

   Contracts (docs/design/CANON.md §9 + motion.md):
   - touch: `touch-action: pan-y` always — vertical page scroll is sacred.
   - hover = inspect (hoverLift + tooltip); wheel/pinch = zoom, clamped;
     everything readable without interacting.
   - reduced-motion: scenes don't boot at all (runtime bail), so no special
     handling here; drag/zoom are user-initiated and fine where scenes run.
   - NO postprocessing/bloom anywhere — glow is glowSprite() only (CANON §4).
   ============================================================================ */

/* ── orbit controls — drag to rotate + wheel/pinch zoom, inertial ─────────── */
export interface OrbitControls {
  s: { yaw: number; pitch: number; zoom: number; dragging: boolean };
  /** call once per frame; applies inertia + idle auto-rotate (motion: orbitIdle) */
  tick(dtMs: number): void;
  dispose(): void;
}

export function makeOrbitControls(
  canvas: HTMLCanvasElement,
  opts: { startPitch?: number; minZoom?: number; maxZoom?: number; autoRotate?: boolean } = {},
): OrbitControls {
  // minZoom is the max ZOOM-OUT (0.42 ⇒ camera pulls back to ~2.4× base distance
  // so whole scenes fit in frame — review R2-2). maxZoom is the max zoom-IN.
  const { startPitch = 0.3, minZoom = 0.42, maxZoom = 3.4, autoRotate = true } = opts;
  const s = { yaw: 0, pitch: startPitch, zoom: 1, dragging: false };
  let lastX = 0, lastY = 0, vYaw = 0, vPitch = 0;
  let pinchDist = 0;
  const pointers = new Map<number, { x: number; y: number }>();

  const down = (e: PointerEvent) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { s.dragging = true; lastX = e.clientX; lastY = e.clientY; vYaw = 0; vPitch = 0; }
    else if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      s.dragging = false;
    }
  };
  const move = (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist > 0) s.zoom = clamp(s.zoom * (d / pinchDist), minZoom, maxZoom);
      pinchDist = d;
      return;
    }
    if (!s.dragging) return;
    const dx = (e.clientX - lastX) * 0.006;
    const dy = (e.clientY - lastY) * 0.006;
    s.yaw += dx; s.pitch = clamp(s.pitch + dy, -0.9, 0.9);
    vYaw = dx; vPitch = dy;
    lastX = e.clientX; lastY = e.clientY;
  };
  const up = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 0) s.dragging = false;
  };
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    s.zoom = clamp(s.zoom * (e.deltaY > 0 ? 0.92 : 1.087), minZoom, maxZoom);
  };

  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  canvas.addEventListener('wheel', wheel, { passive: false });

  return {
    s,
    tick(dtMs: number) {
      if (!s.dragging) {
        // inertial decay, then idle drift (motion.md: orbitIdle 0.0004 rad/ms·dt)
        if (Math.abs(vYaw) > 0.0004 || Math.abs(vPitch) > 0.0004) {
          s.yaw += vYaw; s.pitch = clamp(s.pitch + vPitch, -0.9, 0.9);
          vYaw *= 0.92; vPitch *= 0.92;
        } else if (autoRotate) {
          s.yaw += 0.0004 * dtMs;
        }
      }
    },
    dispose() {
      canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
    },
  };
}

function clamp(v: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, v)); }

/* ── raycast picking — throttled pointer hover over scene objects ─────────── */
export interface Picker {
  /** call each frame AFTER camera/group transforms are up to date */
  tick(): void;
  dispose(): void;
}

/**
 * onHover fires with (object, instanceId | undefined, screenX, screenY) when
 * the picked target changes, and with (null) when the pointer leaves all
 * targets. For InstancedMesh targets, instanceId identifies the instance.
 */
export function makePicker(
  THREE: any,
  camera: any,
  canvas: HTMLCanvasElement,
  targets: any[],
  onHover: (obj: any | null, instanceId: number | undefined, x: number, y: number) => void,
): Picker {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let px = -1, py = -1, has = false, dirty = false;
  let lastObj: any = null, lastInst: number | undefined;

  const move = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    has = px >= 0 && py >= 0 && px <= r.width && py <= r.height;
    ndc.set((px / r.width) * 2 - 1, -(py / r.height) * 2 + 1);
    dirty = true;
  };
  const leave = () => { has = false; dirty = true; };
  canvas.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('pointerleave', leave, { passive: true });

  return {
    tick() {
      if (!dirty) return;
      dirty = false;
      if (!has) {
        if (lastObj) { lastObj = null; lastInst = undefined; onHover(null, undefined, px, py); }
        return;
      }
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(targets, false);
      const hit = hits[0];
      const obj = hit ? hit.object : null;
      const inst = hit ? hit.instanceId : undefined;
      if (obj !== lastObj || inst !== lastInst) {
        lastObj = obj; lastInst = inst;
        onHover(obj, inst, px, py);
        canvas.style.cursor = obj ? 'pointer' : '';
      } else if (obj) {
        onHover(obj, inst, px, py); // position update for a following tooltip
      }
    },
    dispose() {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.style.cursor = '';
    },
  };
}

/* ── shared tooltip — one mono readout chip per mount ─────────────────────── */
export interface Tooltip {
  show(html: string, x: number, y: number): void;
  hide(): void;
  dispose(): void;
}

export function makeTooltip(mount: HTMLElement): Tooltip {
  const el = document.createElement('div');
  el.className = 'viz3d__tip';
  el.setAttribute('aria-hidden', 'true');
  el.style.opacity = '0';
  mount.appendChild(el);
  return {
    show(html: string, x: number, y: number) {
      el.innerHTML = html;
      const w = mount.clientWidth;
      const flip = x > w - 180;
      el.style.left = Math.round(x + (flip ? -12 : 12)) + 'px';
      el.style.top = Math.round(y - 8) + 'px';
      el.style.transform = flip ? 'translate(-100%, -100%)' : 'translateY(-100%)';
      el.style.opacity = '1';
    },
    hide() { el.style.opacity = '0'; },
    dispose() { el.remove(); },
  };
}

/* ── instancing — per-instance color convenience (chamber, swarms, layers) ── */
export function makeInstanced(
  THREE: any,
  geometry: any,
  material: any,
  count: number,
  place: (i: number, dummy: any, setColor: (c: any) => void) => void,
): any {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    let colored = false;
    place(i, dummy, (c: any) => { col.set(c); mesh.setColorAt(i, col); colored = true; });
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    if (!colored) { col.set('#ffffff'); mesh.setColorAt(i, col); }
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

/* ── glow — additive radial sprite (the sanctioned glow; NO bloom, CANON §4) ─ */
export function glowSprite(THREE: any, color: string, size: number): any {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  (sprite as any).userData.disposables = [tex, mat];
  return sprite;
}
