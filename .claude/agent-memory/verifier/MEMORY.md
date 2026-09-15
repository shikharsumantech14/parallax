# Verifier memory — Parallax

One line per memory. Detail lives in the topic files, read on demand.
Only what the repo cannot say about itself: the schema, the mode library, the
source allowlists and the agent definition all have better homes.

**Claim tracing**

- [Claim-error patterns](claim-error-patterns.md) — dropped qualifiers, characterisations outrunning events, entailments dressed as quotations, dossiers stale where the draft is clean
- [Inherited-data blindspot](inherited-data-blindspot.md) — carried-over `data.values` arrays are the claims nobody has ever traced
- [Data-shape honesty](data-shape-honesty.md) — a traced fact in the wrong field renders a different claim; read the component, not the catalog
- [Cheap checks that catch most](cheap-checks-that-catch-most.md) — the highest-yield checks, and the two that reliably find nothing
- [Source-tier pitfalls](source-tier-pitfalls.md) — stale "off-allowlist" claims, all-T4 issues, and why `ingest: live` moots the RAG gate

**Rewrites (Phase 4)**

- [Rewrite audits](rewrite-audits.md) — what to load for an in-place rewrite and how the schema check changes
- [Rewrite audit — checks that pay](rewrite-audit-checks-that-pay.md) — which checks catch defects on a rewrite and which are always clean
- [Binding-file precedence](binding-file-precedence.md) — a later research pass outranks dossier and storyboard, a mandated departure is not drift, and a storyboard can contradict itself
- [Removal audits on rewrites](removal-audits-on-rewrites.md) — audit what LEFT: trace removed numerals too, follow derivations through a cut, and the one test for a dropped name
- [Restored and orphaned claims](restored-and-orphaned-claims.md) — the post-panel edit nobody has read, and the surviving clause whose evidence the same rewrite deleted
- [Currency brackets audit](currency-brackets-audit.md) — the five questions on a ₹-bracket ruling, and why "the dollar leads" is a component question not a string question
- [Tracing without a dossier](tracing-without-a-dossier.md) — when a rewrite has no dossier, and what stands in for the published record
- [status: published is not a defect](status-published-is-not-a-defect.md) — the draft-status schema row is waived for in-place rewrites

**Reporting**

- [Flag severity calibration](flag-severity-calibration.md) — how to report a ❌ that is paperwork, and when the lexicon is wrong instead of the draft
