---
name: removal-audits-on-rewrites
description: On a rewrite the risky claims are the ones that LEFT — how to audit cuts, why a removed numeral is often the untraceable one, and the test for whether a dropped name was load-bearing
metadata:
  type: project
---

**A rewrite is audited in two directions. The usual one (does every claim on
the page trace?) is the easy half. The half that needs a method is: does
anything that survived depend on something that left?**

**Why:** `check:prose` reports NUMBER-DRIFT as a list of vanished numerals, which
reads like a list of losses, and the operator's brief will hand it to you that
way. On the 2024 YR4 Phase-6 rewrite six numerals vanished and **every one was a
correct cut** — four mandated by operator rulings, one an editorial value that
could never have passed a trace, and one (a "50-to-70 m" size range) that was
**not in the dossier at all**, removed in favour of the dossier-anchored
"53–67 m" that survived. The gate cannot tell a dropped fact from a dropped
fiction. Only the dossier can, and only if you look up the removed numeral too.

**How to apply:**

- **Trace the removals, not just the survivors.** For each vanished figure ask
  three questions in order: is the cut mandated (storyboard ruling / §8a table)?
  does any surviving sentence still lean on it? and — the one everybody
  skips — **did the removed numeral have a dossier home at all?** A rewrite that
  drops the untraceable member of a pair and keeps the sourced one is a trace
  *improvement*; say so in those words, or the operator reads the gate's ❌ as a
  regression.
- **Follow the derivations through the cut.** A comparison computed from two
  numbers is only safe if both inputs are still on the page. The lakh comparison
  here survived because 21,200 km moved from the cut section into a tile on the
  same section as the size range. Check the inputs' new addresses, not just the
  result.
- **A cut section can retire a whole defect class.** Both schematic sections
  went, and with them the story-mode risk that `story.css` hides the caption
  where the "these values are illustrative" caveat lives. Worth a line in the
  report: it is the kind of improvement nobody claims credit for.
- **"Is this dropped name load-bearing?" has one test:** does any claim the
  draft *still makes* rest on it? A method detail (the star catalogue an
  astrometric measurement is referenced against) supports no asserted claim when
  the draft asserts only the agencies' published conclusion. Colour, not a
  premise — and a name carrying a product but no reason is what rule 9 and tell
  11 tell the drafter to cut anyway. Rule it out loud, both ways, and say where
  it would have to go back if the operator disagrees.
- **A new claim on a rewrite is often free.** Before flagging it, read the
  section's existing `sourceRefs[]`: a section carried over from a
  heavily-sourced original usually already lists the ids that back the new
  sentence. Here the one new clause needed nothing added.

- **The ledger's blind spot is the removal that is WORDS, not digits.** A §8e
  number ledger and `check:prose`'s NUMBER-DRIFT both work on numerals, so a
  removal written in words passes through both invisibly. On amazon the published
  2024 timeline note carried "six times more forest than the year before" — a
  dossier-sourced magnitude comparison — and the rewrite traded it for a unit
  warning ("a wider count than clearing") under a ≤14-word note cap. No numeral
  moved, so nothing flagged. **And it was the cause of the run's ⚠️ BARE-NUMBER:**
  the figure survived and the only thing giving it a feel left. The general shape:
  *a number that loses its comparison has not lost a fact, it has lost its
  felt-ness*, and that is a composition flag nobody attributes to a removal.
  **How to apply:** after the numeral diff, re-read each surviving big number and
  ask what used to sit next to it. Spelled-out multipliers ("six times", "twice",
  "a third"), "than the year before", "enough to fill" and unit conversions are
  where this hides. The recommendation is usually to spend headroom restoring it,
  and it is a strong one because the words are already in the dossier — no new
  research, no new numeral.

See [[binding-file-precedence]], [[inherited-data-blindspot]].
