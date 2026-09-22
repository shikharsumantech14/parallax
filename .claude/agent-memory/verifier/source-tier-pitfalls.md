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

**It paid a second time on earth (amazon, 2026-09-15), with two refinements.**
(a) **Grep the WebFetch domain block at the bottom, not just the tiered
entries.** `nature.com` sits in that block while the only named journal entries
are *Nature Climate Change* and *Nature Geoscience* — sister titles, not the
flagship the dossier needed. A domain can be reachable while the exact journal is
unlisted, and the honest report says which. (b) **The tier answers "is it
reachable", `ingest:` answers "may I quote it".** Every journal entry that opened
up there is T2 `ingest: metadata` — GUIDE-ONLY, so a new fetch pins a figure and
still cannot be quoted. Say both in one line or the editor reads "now
allowlisted" as "now quotable". The finding worth leading with is usually not the
paywalled paper but a **T1 data publisher for a figure the issue currently
carries second-hand** (here Global Forest Watch, publisher of the 36% the issue
sources through a Mongabay interview) — that one would close ⚠️ NO PRIMARY
ANCHOR, which the paper's abstract would not.

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

**4. A section's `source.date` can be the ACCESS year, not the document's
vintage — and the dossier usually already knows.** The ISS issue's
`orbit-trace` carried `source: {label: "ISRO and NASA", date: "2026"}` for a
Gaganyaan page the dossier's §6 explicitly records as "last updated 23 November
2022". Nothing in the pipeline compares the two: the id resolves, the publisher
is right, and "2026" reads as currency rather than as a claim. It is the
sibling of [[cheap-checks-that-catch-most]] 8 (dates against events) on the
provenance axis — there the date was *earlier* than the section's own content,
here it is *later* than the source's. **How to apply:** for any `source.date`
that is a bare year, find that source in the dossier §6 and check for a "last
updated" note. A bare year with no month is the tell; a properly dated document
almost always gets a month in the label.

**5. A bibliography can be diverse and still carry orphans.** Fifteen sources,
nine publishers, comfortably past every §5.1 floor — and two ids
(`src-08`, `src-10`) referenced by no section at all. Valid per schema, and the
diversity check passes *because of* them. Worth reporting as an optional fix:
either the issue rests on them somewhere the refs do not say, or the
bibliography overstates what the issue actually stands on. Grep each
`sources[].id` against the union of every `sourceRefs[]` — it is one pass and
the diversity numbers should be re-read after removing the orphans.

**6. SOURCE-NARROW is sometimes structural, and the right recommendation names
the ONE source that is load-bearing and thin.** half-indias-arrivals ran 7
sources / 3 publishers with Skift at 43%, and the draft declared the miss in
its own `# EDITOR:` block while refusing to pad from the dossier's four unused
entries. That refusal is correct (padding is pattern 5 above, in reverse), so
"add one more source" is not an actionable finding. What is actionable: walk
the bibliography for the single figure whose only backing is the thinnest
publisher — here the ₹3.5 crore promotion allocation, secondary-only — and
check the allowlist for a primary that publishes it. One addition can fix the
publisher count, the concentration ratio and the tier of the issue's weakest
claim at once. **And run pitfall 1 before you write the line:** the dossier
said the budget documents were off-allowlist, which was true of
`indiabudget.gov.in` and `pib.gov.in` and NOT of `tourism.gov.in`, sitting at
T0 · open · `ingest: full` on the travel list. A dossier's off-allowlist note
is scoped to the domains it actually names.

See [[cheap-checks-that-catch-most]], [[flag-severity-calibration]].
