# Verifier memory — Parallax

One line per memory. Detail lives in the topic files, read on demand.
Only what the repo cannot say about itself: the schema, the mode library, the
source allowlists and the agent definition all have better homes.

**Claim tracing**

- [Claim-error patterns](claim-error-patterns.md) — the recurring ways a draft goes wrong: dropped qualifiers, characterisations outrunning events, source lines drifting
- [Inherited-data blindspot](inherited-data-blindspot.md) — carried-over `data.values` arrays are the claims nobody has ever traced
- [Data-shape honesty](data-shape-honesty.md) — a traced fact in the wrong field renders a different claim; read the component, not the catalog
- [Cheap checks that catch most](cheap-checks-that-catch-most.md) — the highest-yield checks, and the two that reliably find nothing

**Rewrites (Phase 4)**

- [Rewrite audits](rewrite-audits.md) — what to load for an in-place rewrite and how the schema check changes
- [Rewrite audit — checks that pay](rewrite-audit-checks-that-pay.md) — which checks catch defects on a rewrite and which are always clean
- [Binding-file precedence](binding-file-precedence.md) — a later commissioned research pass outranks dossier and storyboard; a mandated departure is not drift
- [Tracing without a dossier](tracing-without-a-dossier.md) — when a rewrite has no dossier, and what stands in for the published record
- [status: published is not a defect](status-published-is-not-a-defect.md) — the draft-status schema row is waived for in-place rewrites

**Reporting**

- [Flag severity calibration](flag-severity-calibration.md) — how to report a ❌ that is paperwork, and when the lexicon is wrong instead of the draft
