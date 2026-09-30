/**
 * render-checks — the pure halves of two render-gate checks (Lens Phase 5),
 * kept out of scripts/ui-probe.mjs so .claude/hooks/hooks.test.mjs can test
 * them without a browser. The probe gathers the raw data in the page; these
 * decide what is a finding.
 *
 *   cueNotes     CUES: the cue contract (docs/design/LENS.md §5.2)
 *   compareBuild BUILD: the build contract (LENS §6.4)
 */

/**
 * One section's cue data → the reasons it breaks the contract (empty when it
 * keeps it).
 *   buttons   numerals of the cue buttons in the article (`button.px-cue`)
 *   named     numerals the figure's anchors carry (`data-cue-n`)
 *   tags      numerals printed in the figure (filled `.px-cue-tag`)
 *   hasStage  whether the section has a figure panel
 * Every button needs an anchor it names; every numeral the figure prints
 * needs a button; a button with no figure panel at all is a failure.
 */
export function cueNotes({ buttons = [], named = [], tags = [], hasStage = true, anchors = 0 }) {
  const btns = [...new Set(buttons.map(String))];
  const nm = new Set(named.map(String));
  const notes = [];
  if (btns.length && !hasStage) {
    notes.push(`cue button${btns.length > 1 ? 's' : ''} ${btns.join(', ')} in a section with no figure panel`);
  } else {
    const lost = btns.filter((k) => !nm.has(k));
    if (lost.length) notes.push(`cue ${lost.join(', ')} has no anchor in the figure (no [data-cue-n~="${lost[0]}"]; ${anchors} anchor${anchors === 1 ? '' : 's'} exposed)`);
  }
  const printed = [...new Set([...nm, ...tags.map(String)])];
  const orphan = printed.filter((k) => !btns.includes(k));
  if (orphan.length) notes.push(`the figure prints numeral${orphan.length > 1 ? 's' : ''} ${orphan.join(', ')} that no cue button in the article names`);
  return notes;
}

const r1 = (n) => Math.round(n * 10) / 10;

/**
 * Two snapshots of the page's build scenes (the probe's buildSnapshot()):
 * `live` with JS on after every build ended, `still` with JS off. Returns the
 * { findings: [{ nn, kind, desc, px }], notShown }. A scene: { i, nn, kind,
 * scene, w, h, shown, hasSection, els: [{ d, x, y, w, h, o, t, bx }] }, boxes
 * relative to the scene.
 *
 * A scene the STATIC page does not draw at all (`shown: false`: 0×0 or
 * display:none, as the intro overlay's scenes are until JS shows one) has
 * nothing to compare against. It is skipped and counted in `notShown`,
 * unless it holds a `.px-section` (`hasSection`): article content must
 * always be drawn without JS, so that stays a finding.
 *
 * Only a scene with a build element is compared, and text is compared per
 * build element (a counter ends on its HTML text), never the whole scene:
 * a scene may hold an island's readout that JS rewrites, which is not a
 * build. A scene must not, though, hold an `html.js`-gated control that
 * moves its build elements, or the boxes differ (put the scene on the
 * graphic, not the card, in that case).
 */
export function compareBuild(live, still, tol = 1) {
  const out = [];
  let notShown = 0;
  const B = (sc, d, px) => out.push({ nn: sc.nn, kind: sc.kind, desc: `${sc.scene} (scene ${sc.i + 1}): ${d}`, px: px == null ? null : r1(px) });
  if (live.length !== still.length) {
    out.push({ nn: '--', kind: 'page', desc: `${live.length} build scenes with JS, ${still.length} without: the page's markup depends on JS`, px: null });
  }
  for (let i = 0; i < Math.min(live.length, still.length); i++) {
    const a = live[i];
    const z = still[i];
    if (!a.els.length && !z.els.length) continue;
    if (z.shown === false) {
      if (!z.hasSection) { notShown++; continue; }
      B(a, 'the static page does not draw this scene, and it holds article sections', null);
      continue;
    }
    const dw = Math.abs(a.w - z.w);
    const dh = Math.abs(a.h - z.h);
    if (dw > tol || dh > tol) B(a, `the scene ends ${a.w}×${a.h}px, the static page draws it ${z.w}×${z.h}px`, Math.max(dw, dh));
    if (a.els.length !== z.els.length) {
      B(a, `${a.els.length} [data-build] elements with JS, ${z.els.length} without`, null);
      continue;
    }
    const off = [];
    for (let j = 0; j < a.els.length; j++) {
      const p = a.els[j];
      const q = z.els[j];
      const d = Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y), Math.abs(p.w - q.w), Math.abs(p.h - q.h));
      if (p.t !== q.t) off.push({ p, d: 0, why: `text “${p.t.slice(0, 40)}” vs static “${q.t.slice(0, 40)}”` });
      else if (d > tol) off.push({ p, d, why: `box ${p.x},${p.y} ${p.w}×${p.h} vs static ${q.x},${q.y} ${q.w}×${q.h}` });
      else if (Math.abs(p.o - q.o) > 0.01) off.push({ p, d: 0, why: `opacity ${p.o} vs static ${q.o}` });
      else if (p.bx) off.push({ p, d: 0, why: `left with ${p.bx}` });
    }
    if (off.length) {
      B(a, `${off.length} build element${off.length > 1 ? 's end' : ' ends'} off the static page: ${off.slice(0, 3).map((o) => `${o.p.d} ${o.why}`).join(' · ')}`, Math.max(...off.map((o) => o.d)));
    }
  }
  return { findings: out, notShown };
}
