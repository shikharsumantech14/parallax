# App design spec — app.parallaxlens.com

> How every app surface looks. The doctrine: **the app is the reading room of
> the same building** — same trio (Fraunces / Schibsted Grotesk / JetBrains
> Mono), same beige/ink/rust base, same motion ramp and radii as the
> publication — but calmer. No per-page world takeover; worlds appear only as
> ACCENTS (a card edge, a chip, a tinted auth plate) via `worlds.css`
> `[data-world]` `--w-*` variables. Flagship reference implementation:
> `app/src/pages/login.astro` (P3). Copy: `JOURNEY-SPEC.md` §3 — verbatim.

## 1. Foundation (app.css v2)

- Imports at top: `./shared/tokens.css`, `./shared/worlds.css` (generated
  copies). Delete the hand-copied token block (old lines 10–22).
- **Font fix:** `--font-body: 'Schibsted Grotesk', system-ui, sans-serif` (the
  app still loads Inter Tight — replace in `AppLayout.astro`'s Google Fonts URL
  too; the publication retired Inter Tight on 2026-06-21).
- Palette: keep the app's calm base — `--bg #faf7f0`, `--paper #fff`,
  `--ink #15130f`, `--accent #b8341f`, `--accent-deep #8b2416`, `--danger`,
  `--ok`. The rust accent is the app's home world; `--w-*` tints override it
  only inside `[data-world]` scopes.
- **Shell tiers** (replaces the flat 640px): `AppLayout` gains
  `width: 'narrow' | 'shelf'` prop → container `max-width: var(--col-narrow)`
  (480px — auth, welcome) or `var(--col-shelf)` (960px — dashboard, admin).
  Vertical padding stays (`--pad-y` 48px; 28px < 480px viewport).

## 2. Primitives (class APIs; restyle in place, keep names)

Existing APIs kept so admin pages inherit the lift free: `.btn`, `.btn--ghost`,
`.btn--block`, `.field`, `.notice` (+ `--ok/--err/--info`), `.divider`, `.row`.

New primitives:

| Class | Anatomy |
|---|---|
| `.plate` | the elevated card: `--paper` bg · 1px `--rule` border · `--r-tile` · shadow `0 1px 2px rgba(21,19,15,.05), 0 12px 32px rgba(21,19,15,.07)` · padding 32px (24px mobile) · `plateIn` on load |
| `.tile` | issue card: `.plate` at padding 20px + 3px world accent left edge (`border-left: 3px solid var(--w-accent, var(--accent))`) + hover lift −2px `--t-quick` |
| `.chip` | `--r-pill` · 1px border · mono 11px uppercase +0.08em · 8px dot in `--w-accent` when world-typed · selected state: ink bg / paper text |
| `.toggle` | visually-hidden native checkbox + 36×20 track (`--r-pill`) + 16px knob · checked: `--accent-deep` track · `:focus-visible` 2px ring `--accent` offset 2 · AA in both states |
| `.stat` | StatTile: mono 11px uppercase label over Fraunces 32px tabular value + one-line `--muted` note |
| `.appbar` | glass masthead: sticky · `--glass-bg` + `--glass-blur` · 1px `--glass-border` bottom · LensMark 20px + `PARALLAX · YOUR SHELF` mono 11px · right slot: session email (mono, muted) + `Sign out` ghost |

Buttons: primary = filled ink (`--ink` bg, paper text — NOT rust; rust is for
accents and destructive-adjacent emphasis); ghost = 1px border transparent bg;
destructive = `--danger` border+text, filled only in the confirm step. Square
corners (radius 0) per the publication's button rule; only chips/pills round.

## 3. LensMark (`app/src/components/LensMark.astro`)

The brand mark, ported from the publication masthead's `.mh__lens` (two
overlapping rings + red sphere in the vesica — see `src/styles/base.css`
:55-77 and the locked [brand-logo] concept). Props: `size` (px, default 20),
`animate` (bool — plays `lensSettle` once via `html.js`-gated CSS; static
otherwise), inherits `currentColor` for rings, sphere always `#b8341f`
(brand-fixed, not themeable). Used: appbar (20px), login/welcome plates (56px,
animated), story CTA card (publication side has its own mark usage — don't
cross-import; this component is app-only).

## 4. Surfaces

### Login (P3 flagship — full spec)
Centered `.plate` (max 440px) on the `--bg` field, vertically centered ≥720px
viewports, top-aligned + 12vh padding below. Above the plate: LensMark 56
animated. Plate content per JOURNEY-SPEC states. Google button = primary filled
ink with the Google glyph at 16px; magic-link block under `or use your email`
divider; email field 48px tall, 16px text (no iOS zoom), `inputmode=email`
`autocomplete=email`. World tint (when `data-world` present): the plate's top
rule (3px) and the H1 `em` take `--w-accent-deep` (light worlds) /
`--w-accent` (dark worlds — but the plate stays light always; use
`--w-accent-deep` unconditionally: every world's deep value is AA on white),
the mono world line + focus rings tint; NOTHING else changes.
Google-glyph exception: the G mark keeps its brand colors.

### App /welcome — **BUILT 2026-07-14** (`app/src/pages/welcome.astro`)
`narrow` shell, one `.plate`: H1 + sub, name `.field` (prefilled from
user_metadata), six world `.chip`s (multi-select, `aria-pressed`), feature
strip (3 mono rows), primary CTA + `Skip for now` ghost link. One screen, no
scroll on 667px-tall mobile: compress via 12px chip padding if needed.

Built as specified, with one **deliberate deviation**: the world chips are
native `<input type="checkbox">` elements (visually hidden, wearing the `.chip`
face, state via `.wchip__input:checked + .chip`) — **not** `aria-pressed`
buttons. `aria-pressed` implies a JS-toggled button; the page ships **no client
script**, and native checkboxes both submit and show selected state under
no-JS. The fallback contract outranks the literal ARIA suggestion here. Same
reasoning for the CTA pair: two submit buttons sharing `name="intent"`
(`save` / `skip`, skip carrying `formnovalidate`) rather than a scripted skip.
Name prefill chain: `profiles.display_name` → user_metadata `name` /
`full_name`. Posts to `app/src/pages/api/onboarding.ts`, which always stamps
`welcomed_at` (save *and* skip — welcome is genuinely once). Reached via the
`welcomed_at` gate in `app/src/pages/auth/callback.ts`.
**Not runtime-verified** (compile-verified only), and its migration is not yet
applied — see `JOURNEY-SPEC.md` §5.

### Dashboard ("The Shelf") — **BUILT 2026-07-14** (`app/src/pages/dashboard/index.astro`)
`shelf` shell. Module order: greeting header → Shelf tile grid
(`repeat(auto-fill, minmax(260px, 1fr))`, gap 16) → Reading log (3 `.stat`s +
last-5 event lines) → Your worlds (six 4px accent bars, mono labels, %) →
In the margins (annotation rows: quote clamp-1 + status chip + issue link) →
Preferences (3 `.toggle` rows) → Account (name inline-edit, email, since) →
Admin plates (2 small `.plate`s w/ pending-count mono badges; admin only) →
Danger zone (existing `<details>`, restyled). Every module `reveal`-staggered
(80ms), `data-reveal` pattern ported as `.reveal` (IO island, reduced-motion
no-op).
IssueCard (`.tile`): world edge + chip · mono `— 07 · JUN 2026` · Fraunces
title (clamp 2) · dek (clamp 2, `--muted`) · progress hairline (2px, world
accent, % from reading_events mapping open10/25/75/finish100) · footer link
`Continue reading →` / `Read again`.

**Built 2026-07-14** — this is the rebuild that answers the operator's
"dashboard = 2000s design" note. Shipped module order: greeting header → shelf
tile grid (saved issues) → reading log (3 `.stat`s) → In the margins →
Preferences (3 `.toggle` rows, progressive-enhancement fetch save) → Account
plate → Admin tiles (admin only) → Danger zone. It uses the `width="shelf"`
shell and the P3 app.css v2 primitives (`.plate` / `.tile` / `.chip` /
`.toggle` / `.stat` / `.appbar` + the `.reveal` IO island) — no new primitives
were needed. Queries are restricted to confirmed table shapes: `profiles`,
`saved_issues`, and `comments(id, body_md, status, created_at, issue_id,
user_id)`.

**Three modules from the spec above are DEFERRED, not built** (each needs
schema confirmation plus a runtime the authoring box cannot provide):

1. **Per-issue progress hairlines** — the `reading_events` → open10/25/75/
   finish100 mapping is unwired; tiles render without the 2px hairline.
2. **"Your worlds" topic-affinity bars** — the whole module is absent from the
   shipped order above.
3. **Real issue titles** — tiles **title-case the slug**. The fix is the
   issues-manifest bridge in `JOURNEY-SPEC.md` §5, which was never built.

The page is compile-verified only (`cd app && npm run build` exits 0); the app
cannot boot on the authoring box, so none of it is runtime-verified.

### Admin queues
No structural redesign in this pass: they inherit restyled primitives. Only
addition (P7): per-published-issue story-link row with a copy button in
`admin/social.astro`. **Built 2026-07-14** — a per-post `↗ story` link to
`/s/<issue_id>/` plus a "Copy story link" clipboard button, on its own
delegated handler so it can never touch the approve/reject flow.

## 5. Interaction & a11y floor

- Every async action: pending label swap (`Sending…`) + disabled state +
  `aria-live="polite"` status; no spinners-without-words.
- `:focus-visible` rings everywhere (2px `--accent`, offset 2; tinted under
  `data-world`).
- Forms: field-level inline errors (`.notice--err` text under the field), never
  alert()s; Enter submits; labels always visible (no placeholder-as-label).
- Reduced-motion: `plateIn`/`reveal`/`lensSettle` render final state (global
  `@media` block in app.css v2 — port the publication's pattern).
- All targets ≥ 44×44; toggles operable by keyboard (space) with visible state.

## 6. Do / Don't gallery

- DO keep every page one-purpose (login logs in; welcome asks 2 things; the
  shelf shows your reading — no cross-sell modules beyond the designed ones).
- DO use world accents only via `--w-*` on `[data-world]` scopes.
- DON'T adopt a world's full dark palette anywhere in the app.
- DON'T introduce icons beyond: LensMark, the 3 gate/benefit glyphs, chevrons,
  the Google G. Everything else is type.
- DON'T use rust for primary buttons (ink is primary; rust is emphasis).
- DON'T add dashboards-cliché widgets (donut charts, KPI cards with deltas) —
  the reading log is editorial lines, not analytics.
