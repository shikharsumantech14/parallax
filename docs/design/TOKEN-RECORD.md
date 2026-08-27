# Token decision record

> **Status: ratified 2026-08-27, Phase 2 of `docs/REVAMP-PLAN.md`.**
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

## TD-05 — the two accent-deep roles stay separate (ratifying Phase 1)

Recorded here because it is the precedent the above rely on. `--accent-deep`
carries two roles that are **provably irreconcilable** on dark worlds:

- **in-world** — legible on that world's own ground (theme files, CategoryCard)
- **light-paper** — legible on `#faf7f0`/`#fff` (`worlds.css`, `meta.css`, the app)

Space needs luminance ≥ 0.2168 to clear 4.5:1 on `#0a1628`, and ≤ 0.1787 to clear
it on white. The ranges do not overlap. One token cannot serve both, and
`design-sync --check` gates each role separately for that reason.

---

## What is NOT being added

- **No new ramp, no grey scale, no second accent.** `CANON §6` stands.
- **`rule` / `ink-soft` / `muted` are not promoted into `worlds.css`.** They are
  needed to finish tokenising `CategoryCard`'s 48 local hexes, but that is a
  wider change than the 28 components require, and it belongs with the web-pages
  phase rather than being smuggled in here.
- **`--ink-soft` is not switched to the spec's derived formula.** Measured, it is
  worse on all six worlds; see `shared/design/worlds.css`.

## Enforcement

`scripts/design-sync.mjs --check` gates every value in TD-01 and TD-04 across all
declaring files, and runs in `prebuild`. A token added here without a gate is a
token that drifts within two sessions — that is what produced the four-way `tech`
accent-deep split this record's Phase 1 sibling had to unpick.
