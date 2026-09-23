---
name: verify-done
description: Run the Parallax verification checklist before declaring any change done — gates, greps, build, and the honest mobile overflow test. Use after finishing a component, a section kind, a style change, or any visual work.
allowed-tools: Bash(npm run *), Bash(node scripts/*), Bash(grep *), Bash(git *), Read, Grep
---

# Verify before declaring done

AGENTS.md §8. Work through it; report each line honestly, including failures.

## 1. Gates

```
npm run build
npm run check:catalog
npm run design:check
npm run graph:check
npm run hooks:test
```

`npm run build` must exit 0 (44+ pages). Use `npx astro build` while iterating —
it skips the `prebuild` hook, which rewrites tracked OG PNGs.

## 2. Standing greps — both must return zero

```bash
grep -rn "Shikhar S" src/ --include="*.astro" --include="*.ts" --include="*.mdx" --include="*.css"
```

```bash
grep -rn 'font-family="var(' src/components/ --include="*.astro" --include="*.ts" --include="*.css"
```

**Both are scoped to code extensions on purpose.** Unscoped, each one matches
the guide that documents the rule and reports a false failure — that bug has
been fixed twice now, once per grep. If you "find" a hit, check whether it is
prose describing the rule before acting.

## 3. App

`cd app && npm run build` is the **entire** local gate — `app/.env.local` does
not exist on this box. Write "build green, runtime unverified"; never claim an
app runtime behaviour was checked here.

## 4. Per touched component

- **No-JS**: the final composed state paints. Hidden states are gated behind
  `html.js`.
- **`prefers-reduced-motion`**: animation freezes to the composed still.
- **Missing WebGL**: the mount degrades, it does not blank.
- **Touch targets** ≥ 44px on `(pointer: coarse)`.
- **Text** ≥ 9.5px as rendered.

## 5. Mobile — use the honest overflow test

**The preview browser reports false overflow.** With the pane hidden,
`clientWidth` is 0 and every probe fires; even displayed, `position: fixed`
elements (the annotation editor at `opacity: 0`, the reading-progress bar)
measure wider than the viewport. A review once called overflow on the reading
toolbar that measurement disproved.

The only honest test, at 375px:

```js
window.scrollTo(9999, window.scrollY); window.scrollX === 0
```

`scrollX` staying 0 means no overflow. **Do not "fix" overflow you have not
proven this way.**

**Since 2026-09-23 the render gate runs this and more in a real headless
Chrome — use it, not the pane:**

```bash
npm run check:render -- --report            # every published issue, 1280 AND 375
npm run check:render -- --slug <slug>       # one issue
```

It loads each page as a SIGNED-IN reader (the gate lifted), measures elements
crossing the column, clipped text, text printed on text, the ⤢ button on text
and duplicate chrome, and writes a screenshot per section per width under
`research/_ui/<date>/`. Read the report AND the screenshots for the sections
you touched at both widths. A visual change is not done until both widths
are clean; a fix for one width that breaks the other is the loop this gate
exists to end.

Known deliberate residual: in-SVG fine print renders ~3.4–7px at 375px on
fixed-`viewBox` cards. That is Phase 5 of the revamp, not a bug you found.

## 6. If a new section kind was added

Nine registry places must agree — see `/add-section-kind`. `check:catalog`
covers five of them; the component file, the WebGL scene, the showcase example
and the `src/components/AGENTS.md` entry are on you.

## Report

State what passed, what failed, and what you did not check. **"I did not verify
X" is a valid and useful line.** A green summary that skipped a step is worse
than an honest partial one.
