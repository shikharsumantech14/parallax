---
name: source-tier-pitfalls
description: Tier and ingest traps — a dossier's "off-allowlist" claim goes stale, T4-only issues, and why `ingest: live` is not the quotability gate
metadata:
  type: project
---

Three things about `_sources/` that cost a full read to work out, and that the
dossier in front of you will not tell you.

**1. A dossier's "off-allowlist" claim is a snapshot, and allowlists grow.**
The cockroach dossier (2026-06-04) said at §6 and §9.11 that §69A's statutory
text "lives on indiacode.nic.in (off-allowlist)", and built its whole sourcing
strategy around that. By the time of the rewrite, **India Code was on
`_sources/politics.md` at T0, open, `ingest: full`** — as was the Supreme Court
judgments archive that carries the *Shreya Singhal* holding the issue asserts.
So an issue whose legal spine could have been anchored in the statute rested
entirely on two newspapers.
**How to apply:** whenever a dossier explains a sourcing gap by naming a source
as off-allowlist, *open the allowlist and check*. It takes one grep. The dossier
is frozen at its research date; the allowlist is not. The fix to recommend is a
dossier line, not a draft change — and say so, because it is not actionable
inside a rewrite that may not add sources.

**2. An all-T4 issue is a flag, and the taxonomy says so for you.**
`_TAXONOMY.md` §1 describes T4 as "Framing, reporting, leads. **Not the primary
anchor.**" That sentence is the citable basis for ⚠️ NO PRIMARY ANCHOR — quote
it rather than asserting the judgement yourself. Ten T4 sources with two
viewpoint clusters is *diverse* but still *unanchored*; the two checks are
independent and an issue can pass one and fail the other.

**2b. The single-author issue fails BOTH halves, and it will look fine.** Seven
`sources[]` entries, seven distinct URLs, seven resolving `sourceRefs`, no
orphan — and one blog. The tech desk's Simon Willison is T7 · `viewpoint:
primary`, so an issue built entirely on him has one cluster (breadth fails,
§5.1) and no T0/T1/T2 (anchor fails, §5.2). **Check the tier of every source as
a set, not one at a time** — the per-source check passes every time and the set
is the finding. Report it even when a storyboard has already ruled the gap out
of scope (a paywalled original a researcher pass cannot reach): the rewrite
cannot act on it, but the gate's verdict belongs on the record, and the fetch
that would fix it usually also unblocks a kind the composer wanted and a claim
the drafter had to hedge. Say that the ⚠️ is structural, not a rewrite defect,
or it reads as a criticism of a file that could not have done otherwise.

**3. `ingest: live` is not GUIDE-ONLY, and the README alone will mislead you.**
`_sources/README.md` §"Two-tier ingestion" defines only `full` (quotable) and
`metadata` (non-quotable), so a `live` source reads as undefined and you will be
tempted to treat it conservatively. **`_TAXONOMY.md` §1 defines it:** `live` =
"not pre-indexed; fetched on demand via the WebFetch allowlist." So there is no
corpus chunk at all, the RAG trace is moot, and the quote comes from a
legally-accessed original by construction — which is exactly what
retrieve-to-guide/cite-the-original asks for. Check `access:` too (`open` vs
`paywall`). Say all this in one line and move on.

See [[cheap-checks-that-catch-most]], [[flag-severity-calibration]].
