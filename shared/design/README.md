# shared/design — the sync contract

Canonical design-token sources shared by BOTH Astro projects (the static
publication at the repo root and the SSR reader app in `app/`).

**The rule: edit HERE, never edit the copies.**

| Canonical file | Generated copies |
|---|---|
| `shared/design/tokens.css` | `src/styles/shared/tokens.css` · `app/src/styles/shared/tokens.css` |
| `shared/design/worlds.css` | `src/styles/shared/worlds.css` · `app/src/styles/shared/worlds.css` |

- `npm run design:sync` — regenerate the copies (each gets a `GENERATED` header).
- `npm run design:check` — diff canonical vs copies, exit non-zero on drift.
  Wired into the root `npm run build`, so a drifted copy fails the publication
  build (the app deploys from `app/` and can't see the repo root on Vercel —
  the root gate + git review is its protection).

Why copies instead of a live cross-project import: the app is a separate Vercel
project rooted at `app/`; imports reaching outside its root depend on fragile
"include files outside root" + Vite `fs.allow` settings. Checked-in generated
copies are boring and deploy-proof.

Related: the six `src/styles/themes/<topic>.css` headers remain the
publication's palette law. `worlds.css` mirrors their accent values for
non-theme surfaces — when you change a world accent, change BOTH together
(the header comment in each theme file points here).
