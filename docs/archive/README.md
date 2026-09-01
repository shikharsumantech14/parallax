# Archive — frozen history

> **Nothing in this folder is current. Do not act on it.**
>
> The single entry point for where the project stands is
> **`docs/STATE-OF-PLAY.md`**. The revamp's decisions are
> `docs/REVAMP-PLAN.md`; the long-form history is `docs/PROJECT.md`.

## Why this folder exists

Before 2026-09-01, `docs/` held **three files that each claimed to be the one
to read first** — and two of them were stale by months:

| File | Opening claim | Reality |
|---|---|---|
| `STATE-OF-PLAY.md` | *"read this first"* | ✅ current |
| `NEXT-SESSION.md` | *"TWO active threads… the current thread"* | ❌ described shipped work as in flight |
| `SESSION-HANDOFF.md` | *"Read it fully before touching any code"* | ❌ ~2.5 months stale |

Neither `AGENTS.md` nor `CLAUDE.md` linked the stale two, so they were orphaned
but still assertive. **A confidently wrong answer is worse than no answer** — an
agent that finds nothing asks; an agent that finds a stale answer acts on it.
That is context loss by contradiction, and it is the failure mode this folder
ends.

Archived rather than deleted (CD-07): these files record real decisions and
real reasoning, and `git mv` preserved their history. They simply stop
competing to be the entry point (CD-10).

## Contents

| File | Froze | Superseded by |
|---|---|---|
| `NEXT-SESSION.md` | 2026-07-07 | `docs/STATE-OF-PLAY.md` |
| `SESSION-HANDOFF.md` | 2026-06-20 | `docs/STATE-OF-PLAY.md` |
| `DESIGN-REVAMP-NOTES.md` | 2026-06-20 | `docs/PROJECT.md` |
| `COMPONENT-AUDIT.md` | 2026-06-20 | `docs/design/catalog.md` + `npm run check:catalog` |
| `CLAUDE-DESIGN-BRIEF.md` | 2026-05-26 | `docs/REVAMP-PLAN.md` |

Every file carries a freeze header stating its date and what replaced it.

## Rules for this folder

- **Never cite an archived file as current.** Cite what superseded it.
- **Never edit for correctness.** These are frozen records; fixing a stale fact
  in place defeats the purpose.
- **Adding a file:** `git mv` it here, add the freeze header, add a row above.
  Never a plain copy — history matters more than the bytes.
