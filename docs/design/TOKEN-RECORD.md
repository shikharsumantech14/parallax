# Token decision record

> **Status: TD-01…TD-06 ratified 2026-08-27, Phase 2 of `docs/REVAMP-PLAN.md`.
> TD-07 and TD-08 added 2026-09-04 at shell adoption (Phase 6.1) as DRAFTS —
> awaiting the operator's ratification, alongside the CANON/motion edits at
> `dc6a28c`. TD-09 (2026-09-30, the Lens revamp) supersedes TD-05, TD-07 and
> TD-08 and re-points TD-01, TD-02 and TD-04: read it first. The entries
> above it are kept as history.**
> Numbered decisions (TD-nn). Cite the ID in any file that implements one.
>
> This record exists because the design handoff's 28 blueprints reference three
> tokens that did not exist in this repo, while its own `INTEGRATION.md:127`
> claims *"No new tokens."* Adding a token is a canon change under the handoff's
> own rules — *"if one genuinely needs a new token, that is a canon change: raise
> it, don't add it"* — so it is raised here rather than absorbed silently.

---

## Why this had to be settled before any component

An undefined CSS custom property is **invalid at computed-value time**. In an
SVG `fill` it falls back to **black**; in a `background` it falls back to
**transparent**. Nothing errors:

- `astro build` passes
- `design:check` passes
- `check:catalog` passes
- and each blueprint's own acceptance box — *"Token grep: no raw hex; every
  colour a `var(--*)`"* — **passes on the broken build**, because the value
  genuinely is a `var()`

It is invisible to every automated gate in the repo. Only a browser catches it.
`rain-calendar`'s dry band is ~94% of its 365 cells and is painted in one of
these tokens; `margin-bullets` uses another for its primary track. Left
unresolved, 20 of the 28 components would have shipped with black or missing
fills, green all the way.

---

## TD-01 — `--paper-warm` is real, and its values are measured, not derived

**Decision:** add `--paper-warm` as a seventh per-world surface token, using the
six literals below.

| World | `--paper-warm` | Ink on it | vs its own ground |
|---|---|---|---|
| politics | `#f2eee4` | 15.86:1 | 1.08:1 |
| space | `#12233c` | 13.52:1 | 1.15:1 |
| earth | `#ece2c4` | 11.55:1 | 1.10:1 |
| tech | `#171717` | 17.18:1 | 1.10:1 |
| travel | `#f6efe2` | 14.07:1 | 1.12:1 |
| sports | `#12332a` | 12.53:1 | 1.14:1 |

**Provenance.** Read directly out of `prototypes/Parallax Components.dc.html`,
where the how-to-read callout's `background` + `border-left: 3px solid <accent>`
pair occurs **exactly 10 times per world, 60 in total, with zero variance** —
independently re-counted. The panel geometry is equally invariant:
`padding: 10px 13px`, `font-size: 14px`, `line-height: 1.58`.

**Do NOT derive it.** A `color-mix` toward ink or paper looks equivalent and is
not: measured, each literal sits 1.08–1.15:1 off its own ground, which is the
"barely a panel" effect the design wants, and the six do not share a single
mixing ratio that reproduces all of them.

**Do NOT map it to `--bg`.** It sits *above* the ground toward white on the
three light worlds and *above* the ground toward light on the three dark ones —
opposite directions. A `--bg` substitution inverts the moment a politics kind
runs inside a dark-world issue, which `CANON §2` explicitly permits.

---

## TD-02 — `--paper-deep` is an alias, not a token

**Decision:** `--paper-deep` resolves to `--paper-warm`. No new value.

The 21 blueprint references imply a *second* elevated surface per world. The
prototypes do not have one: measured across all 72 instruments, each world
defines **exactly one** non-ground surface value — `#12233c` on space, `#12332a`
on sports, `#f2eee4` above `#faf7f0` on politics, and so on. There is no second
value for `--paper-deep` to be.

The split in the blueprints is along the light/dark axis, not a semantic one:
`--paper-warm` appears only in politics/earth/travel blueprints and
`--paper-deep` only in space/tech/sports, with **zero files using both**. They
are two names for one role, coined by different authors for light and dark
worlds.

Aliasing rather than renaming keeps the 21 blueprint references valid as
written, so no blueprint has to be edited to be buildable.

---

## TD-03 — `--accent-warm` maps to `--accent-alt`

One reference, in `blueprints/travel/daylight-band.md`, for the warm half of a
day/night band. `--accent-alt` is the repo's existing governed contrast role and
travel's is `#2d6a7a` — a deep teal, which reads as the *cool* half. The
blueprint wants warmth on the daylight side.

**Decision:** `--accent-warm` → `--accent-alt`, and `daylight-band` chooses which
half each token paints when it is built. Flagged rather than silently swapped:
this is the one of the three where the mapping is not obviously right, and the
component author should sanity-check it against the blueprint's §6.

---

## TD-04 — `--on-accent` is added as an alias of the world ground

The handoff lists On-accent as one of six mandatory per-world values and it
exists nowhere in the repo; foregrounds on accent fills are currently picked ad
hoc (e.g. `themes/politics.css` hardcodes `color: #f4f1ea` on an ink-filled
card).

In every world record the on-accent value **is** that world's ground, so it
enters as an alias rather than a new authored colour, and it removes a class of
ad-hoc picks.

---

## TD-06 — type on a fill sits on `--accent-deep`, never on `--accent`

Added 2026-08-27, after two Wave-1 components independently reached for
`--on-accent` over a vivid `--accent` fill.

Measured, `--on-accent` over `--accent`:

| politics | space | earth | tech | travel | sports |
|---|---|---|---|---|---|
| 5.25 | 10.24 | 5.28 | 15.17 | **3.91 ✗** | 12.63 |

Over `--accent-deep` it clears **6.21:1 at worst** in all six.

**Rule: any fill that carries text uses `--accent-deep`.** The vivid accent is
for hairlines, dots, bars and edges — marks nothing is written on.

"But this is a politics kind" is not a defence: `CANON §2` lets any kind run in
any world, so a component that only works on five of the six is a component with
a latent bug. The pressed state of `.px-inst__chip` already follows this rule,
which is why it passes everywhere.

## TD-05 — the two accent-deep roles stay separate (ratifying Phase 1)

> **Superseded 2026-09-30 by TD-09:** one paper under every desk makes the two roles one.

Recorded here because it is the precedent the above rely on. `--accent-deep`
carries two roles that are **provably irreconcilable** on dark worlds:

- **in-world** — legible on that world's own ground (theme files, CategoryCard)
- **light-paper** — legible on `#faf7f0`/`#fff` (`worlds.css`, `meta.css`, the app)

Space needs luminance ≥ 0.2168 to clear 4.5:1 on `#0a1628`, and ≤ 0.1787 to clear
it on white. The ranges do not overlap. One token cannot serve both, and
`design-sync --check` gates each role separately for that reason.


---

## TD-07 — `--viz-edge` is a per-world alias: ink on the light desks, accent on the dark

> **Superseded 2026-09-30 by TD-09:** `--viz-edge` is a hair on every desk.
> **Removed 2026-10-04 (Lens Phase 8):** the variable is gone from the six
> themes and `meta.css`; `.px-viz` reads `--hair` directly.

> **Draft 2026-09-04 — awaiting the operator's ratification.** Landed in code at
> `b74815d` (shell adoption 1/n) ahead of this entry; recorded here so the token
> is raised rather than absorbed, per the rule at the top of this record.

**Decision:** add `--viz-edge` to each of the six theme files
(`src/styles/themes/<world>.css`) as an alias of an existing token — no new
authored colour. It paints the 3px top rule every figure wears now that `.px-viz`
is flat (RD-05, `CANON §14`): the rule replaces the drop shadow as the card's edge
and its world signature.

| World | `--viz-edge` | Desk |
|---|---|---|
| politics | `var(--ink)` | light |
| earth | `var(--ink)` | light |
| travel | `var(--ink)` | light |
| space | `var(--accent)` | dark |
| tech | `var(--accent)` | dark |
| sports | `var(--accent)` | dark |

The split is by desk brightness, not by world identity (REVAMP-PLAN §3,
correction 1, verified 72/72 across the prototypes). On a dark ground an ink rule
vanishes into the paper; on a light ground a 3px vivid accent is louder than the
figure it frames. Every consumer writes `var(--viz-edge, var(--ink))` — the
fallback keeps a seventh world, or a kind rendered outside any `data-topic`
scope, edged rather than edgeless.

**It is publication-scoped.** Declared in the theme files only — not in
`shared/design/worlds.css`, not as a `--w-*` tint, not in `app/`. The app has no
flat viz card until Phase 8 (RD-05), so there is nothing for the token to paint
there yet.

**Do NOT collapse it to one colour.** The same rule cannot serve both grounds;
that is the whole reason the token exists (`CANON §14`, *"a hairline never
disappears into its ground"*).

**Do NOT reach for `--accent-deep`.** TD-06 governs fills that carry text. The
edge rule carries none, so the vivid accent is correct on the dark desks — it is
exactly the "hairlines, dots, bars and edges" case TD-06 reserves it for.

**Consumers:** `.px-viz` and `.px-viz:hover` in `base.css` (the hover re-asserts
`border-top-color` so the signature does not flicker), plus the two bespoke roots
that carry the shell themselves — `.px-coalc` (CoalitionCalculus) and
`.px-swheel` (SeasonWheel).

**Not yet gated.** `design-sync --check` does not assert `--viz-edge`: it matches
hex literals, and this token is a `var()` alias. The gate should assert presence
in all six theme files and the light/dark mapping above before this entry is
ratified — see Enforcement.

---

## TD-08 — `--r-card` and `--r-tile` go to `0` in the publication, not at the shared source

> **Superseded 2026-09-30 by TD-09:** the override is removed; the corners are 6 / 4 / pill at the source.

> **Draft 2026-09-04 — awaiting the operator's ratification.** Landed at
> `b74815d`; the reasoning also lives as a comment above the override in
> `src/styles/base.css`.

**Decision:** `src/styles/base.css` `:root` overrides `--r-card: 0; --r-tile: 0`.
The values in `shared/design/tokens.css` (6px / 14px) are **unchanged**.

**Why not at the source.** `shared/design/tokens.css` is canonical for BOTH
projects, and `app/` consumes `--r-tile` / `--r-card` in three files. Flipping
them there flattens the app, which RD-05 explicitly forbids — the app keeps its
own spec until Phase 8. So the publication overrides the two tokens for itself
and the shared values stay as the app's.

**`--r-pill` is deliberately NOT flipped.** It carries status chips, CTAs, the
toolbar and progress caps — 43 sites of UI chrome, not reading surfaces — and
RD-05's own carve-out keeps glass on toolbar and modal chrome until their flat
reskin. Squaring every chip in the product is a different decision than this one.

**Measured, and the plan's figure is off:** two token flips reach 99 of 249
radii, not the plan's "128 of 267". 57 of the remaining literals are `50%` —
circles, dots and markers that must never flatten.

**Not yet gated.** `design:check` reads the shared file, where nothing changed. A
future edit to the shared values would be silently masked in the publication by
this override; a one-line assertion that `base.css` still carries `--r-card: 0;
--r-tile: 0` is the cheap fix.


---

## TD-09 — Lens: one paper, six inks, three corners (2026-09-30)

> **Dated 2026-09-30, Phase 1 of the Lens implementation plan.** The operator
> ruled the launch design unsellable on 2026-09-29 and authorised the Lens
> rebuild from the approved canvas (the Foundations board, `BRIEF.md` tokens,
> `BRIEF-4.md` motion and number scale). This entry records how the token
> layer moved. It **supersedes TD-05, TD-07 and TD-08** and re-points TD-01,
> TD-02 and TD-04; those entries stay above as history, not as law.

**The palette.** `shared/design/tokens.css` now carries the neutrals, and
`shared/design/worlds.css` the desk inks:

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f5f2eb` | every page, every desk |
| `--paper-2` | `#fbfaf6` | cards, inputs |
| `--paper-3` | `#ede9df` | wells, the neutral chip |
| `--ink` / `--ink-2` | `#16140f` / `#4a463d` | text / secondary text |
| `--muted` | `#6b665b` | captions and labels (5.2:1 on the paper) |
| `--hair` / `--hair-2` | `#dcd7cb` / `#c9c3b4` | rules / axes and input borders |
| `--<desk>-text` | pol `#a02d18` · spa `#0c6a8c` · ear `#176357` · tec `#566e0f` · tra `#9c5a14` · spo `#33691e` | words in the desk colour, ≥ 4.5:1 |
| `--<desk>-mark` | pol `#c8412a` · spa `#1b9ac4` · ear `#22897a` · tec `#86a81b` · tra `#c97c22` · spo `#5a9e2f` | fills, lines, data; never small text |
| `--<desk>-tint` | pol `#f6e4df` · spa `#dceef5` · ear `#dcefea` · tec `#ecf1d3` · tra `#f8ead5` · spo `#e3f0da` | bands, chips |
| `--<desk>-deep` | pol `#2a1410` · spa `#0b1b33` · ear `#0f2a25` · tec `#111111` · tra `#2c1d10` · spo `#0f2820` | the plate: stages and covers only |
| `--tec-lime` / `--spo-lime` | `#c6f432` / `#e8f048` | marks on their own deep plate only |
| `--on-deep` / `-2` / `-hair` | `#f5f2eb` / 72% / 18% | type and rules on a plate |

**The legacy names are re-pointed, not renamed**, so the 101 kinds keep
compiling. In every theme header and in `meta.css`:

- `--bg`, `--paper` → the one paper. **No desk sets a page ground.** The three
  dark desks (space navy, tech black, sports pine) lose their dark pages; their
  dark survives only as `--deep`, the plate.
- `--accent` → the desk **mark**. `--accent-deep` → the desk **text** ink.
  `--accent-tint` (new) → the tint. `--accent-lime` (new, tech and sports) →
  the plate mark.
- `--ink`, `--ink-soft` → `--ink`, `--ink-2`. `--muted` → `#6b665b` (the
  derived 60 / 72% muted of Phase 1 has no job left: there is one ground).
  `--rule` → `--hair`. `--rule-soft`, `--tape` → neutrals.
- `--paper-warm` and its alias `--paper-deep` (TD-01, TD-02) → `--paper-3`,
  the well, on every desk. `--on-accent` (TD-04) → the paper.
- `--viz-edge` (TD-07) → `var(--hair)` on every desk, and `.px-viz` draws it at
  1px, not 3px: figures lose the coloured top rule (Lens Phase 8 then removed
  the variable: `.px-viz` reads `--hair`). Phase 3 replaces the shell
  with the pinned figure panel (paper-2, hair, radius 6, shadow-1).
- `--world-<desk>` / `--world-<desk>-deep` and `--topic-<desk>` /
  `--topic-<desk>-deep` → the mark / the text ink.
- `--accent-alt` stays per desk, but the three values drawn for the dark
  grounds failed as text on the paper and were moved onto palette inks:
  space `#ffb347` → `#9c5a14`, tech `#ff5c8a` → `#a02d18`, sports `#ff6b35` →
  `#a02d18`.

**TD-05 is retired.** The two accent-deep roles were irreconcilable only
because the dark desks printed on dark grounds. On one paper a desk's text ink
is its type-safe accent everywhere, and `design:check` now gates the theme
headers' `--accent-deep` against the canonical text ink.

**TD-08 is retired.** The `base.css` `:root` override (`--r-card: 0;
--r-tile: 0; --r-pill: 0`) is gone. The corners are set once, in the shared
file: `--r-card: 6px`, `--r-ctl: 4px`, `--r-chip: 999px`, with `--r-tile`
aliasing the card and `--r-pill` the chip until the components move to the
three Lens names. Elevation: `--shadow-1` at rest, `--shadow-2` on hover.

**Motion** (BRIEF-4 §1): `--ease` (entrances, unchanged value), `--ease-move`
(things that move across space), `--t-micro 160ms`, `--t-el 420ms`,
`--t-build 900ms`, `--t-draw 1400ms`, `--t-scene 4500ms`, `--stagger 80ms`.
The old names stay as aliases until Phase 5: `--t-instant`, `--t-quick`,
`--t-soft` → micro; `--t-slow`, `--t-page` → element; `--ease-snap` → `--ease`.
(This also settles the open `--t-page` retime listed below: 420ms.)

**Type** lives in `src/styles/type-v2.css`, not here: Newsreader for display
and prose, Instrument Sans for UI and data (`--font-ui` added; `--font-mono`
now means the sans). The scale and the five number tiers (20 / 32 / 48 / 96 /
160) are tokens there.

**Gated.** `design-sync --check` asserts: the 24 ink mirrors (theme headers,
`meta.css`, the `[data-world]` subtrees, the share-card literals), with the
text ink gated alongside the mark wherever a file declares one; the 24 Lens
inks (the Lens names equal the legacy pair, and each theme's `--accent-tint`
and `--deep` equal the canonical tint and plate); the **one-paper check**, 74
assertions that every theme header, `meta.css` and every `[data-world]`
subtree declares the canonical paper, ink, muted and hair (so a dark desk
ground cannot come back quietly); and the 18 record tokens above at their
TD-09 values.

---

## What is NOT being added

- **No new ramp, no grey scale, no second accent.** `CANON §6` stands.
- **`rule` / `ink-soft` / `muted` are not promoted into `worlds.css`.** They are
  needed to finish tokenising `CategoryCard`'s 48 local hexes, but that is a
  wider change than the 28 components require, and it belongs with the web-pages
  phase rather than being smuggled in here.
- **`--ink-soft` is not switched to the spec's derived formula.** Measured, it is
  worse on all six worlds; see `shared/design/worlds.css`.

- **`--t-page` is not retimed.** *(Settled 2026-09-30 by TD-09: it aliases `--t-el`, 420ms.)* It stays 600ms in `shared/design/tokens.css`.
  The handoff's ~300ms `pageEnter` / 340ms `worldFade` were **named** onto the
  existing CSS view transition on 2026-09-04 (`motion.md`) but not adopted:
  `--t-page` is shared by five other transitions, so retuning it is a token
  decision for the operator (REVAMP-PLAN §6), still open.


## Enforcement

**Since TD-09 (2026-09-30)** the check gates the Lens inks, the one-paper
neutrals and the record tokens as listed there; TD-07 and TD-08's open gate
items fell away with those entries. The paragraph below is the pre-Lens state.

`scripts/design-sync.mjs --check` gates every value in TD-01 and TD-04 across all
declaring files, and runs in `prebuild`. It does **not** yet gate TD-07's
`--viz-edge` — a `var()` alias the hex-matching check cannot see — nor TD-08's
`base.css` radius override, which sits outside the shared file the check reads.
Both are open gate items, and by the next sentence's own logic they are the
first thing to close before either entry is ratified. A token added here without
a gate is a token that drifts within two sessions — that is what produced the
four-way `tech` accent-deep split this record's Phase 1 sibling had to unpick.
