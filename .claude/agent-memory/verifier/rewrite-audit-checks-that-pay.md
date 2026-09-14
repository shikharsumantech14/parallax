---
name: rewrite-audit-checks-that-pay
description: Which verifier checks actually catch defects on a Phase-4 rewrite, and which are always clean — plus the recurring error classes found so far
metadata:
  type: feedback
---

Measured on the delimitation rewrite (2026-09-14, 52 claims: 41 ✅ / 11 ⚠️ / 0 ❌).

**Why:** a rewrite reuses already-verified component `data`, so the number-level
trace is nearly always clean and spending the run there is wasted effort. The
defects cluster somewhere else entirely.

**How to apply — the checks that paid, in yield order:**

1. **Storyboard §9 operator rulings vs the draft, line by line.** The richest
   seam. A drafter that also read a *reader-panel* report will follow the panel
   over a binding ruling and not say so. Both documents are right; the silent
   override is the defect. Always diff the ruling list against the draft
   explicitly.
2. **Does the authored field actually render?** A `caption` traces perfectly and
   reaches no reader if the kind's `SectionBody` arm does not pass the prop. The
   line-147 promoted-caption merge only helps arms reading `data.caption`.
   **Read the dispatch arm for every kind carrying a caption** — do not assume
   the schema field implies a render site. VizCard kinds pass it; several
   hand-written arms (`seat-chart`, `vote-result`) do not.
3. **Quote provenance vs quote text.** A published issue can *assert* a phrase
   as said (in a title, an eyebrow, a timeline label) while the only quoted text
   it carries says something else entirely. A rewrite then inherits the
   assertion and often strengthens it with an attributive verb. Verbatim-compare
   the quoted passage, then separately ask whether every phrase presented as
   speech appears in it.
4. **Source date vs source content.** A quote dated 2026 cited to a 2019 paper.
   Check each `sourceRefs` entry can *plausibly* carry its claim's date, not
   just that the id resolves.
5. **`story.beats` drift.** Beats are edited less carefully than sections and go
   stale against a section that was fixed. Also verify `section:` indices
   resolve to the kind the beat describes.
6. **`research/_voice/jargon.md` as a gloss oracle.** It carries a per-term
   suggested gloss. A draft that glosses a term *differently* from that entry is
   usually losing the part that made the term worth glossing (e.g. *sine die* →
   "no date set to return", replaced with a same-day timing the record never
   states).

**Always clean on a Phase-4 rewrite, so check fast and move on:** section kinds
registered, source `kind` values, `≥6 sources`, `sourceRefs` resolution, Zod
bounds, PLAIN-CLAIM / CAPTION-FORM / REDUNDANT-HOWTO, the composition floors,
and the whole voice table. The register work is done upstream by the composer
and the stylist and arrives correct.

**Recurring error classes seen so far:**
- Derivation used in the draft that the storyboard §5 list does not carry
  (arithmetically fine, procedurally unsanctioned) → ⚠️, never ❌.
- Name stripped of the role phrase §7 assigned it, while the name itself stays.
- An attribution dropped for brevity, leaving its number ownerless
  ("Projection: 816").
- `http://` URLs inherited from a pre-pipeline published issue.

Related: [[tracing-without-a-dossier]], [[status-published-is-not-a-defect]]
