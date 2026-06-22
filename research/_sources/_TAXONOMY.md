# Source taxonomy — tiers, fields, vetting, viewpoint clusters, diversity gate

> The shared schema for every `research/_sources/<topic>.md` allowlist. Read this
> before editing any allowlist, and the discovery + researcher agents read it
> before each run. The leading underscore keeps it out of the content collection.
>
> **Why this exists.** The old allowlists were deliberately small (8–15 sources)
> because the whole list is pasted into the agent's prompt — past ~15 it crowds
> the context. We are expanding to **~50–80 vetted sources/topic** to get more
> perspective, deeper primary material, and case studies. That only works because
> retrieval moves to the **RAG layer** (see `../README.md` and the plan) — the
> allowlist becomes a *tiered, machine-readable config*, not a flat reading list.
> The allowlist still **gates** what Parallax will cite (the brand-protection
> layer); it just got bigger and structured.
>
> **Last updated 2026-06-21.**

---

## 1. The eight tiers

| Tier | What it is | Default `ingest` | Weight in a Parallax issue |
|---|---|---|---|
| **T0** | Primary documents / official data — bills, vote rolls, court orders, treaties, mission logs, agency reports (IPCC, NOAA, ECI, NASA), official statistics | `full` | Highest. Cite directly. The factual spine. |
| **T1** | Datasets / data portals — the numbers behind the data-viz format (World Bank, Copernicus CDS, JPL Horizons, StatsBomb open-data) | `live` + `metadata` | Highest for figures/charts. Cite the dataset + version. |
| **T2** | Peer-reviewed & preprints — journals, arXiv, EPW, DOAJ, OA repositories | `full` (OA only) | High. Mechanism + evidence. |
| **T3** | Think-tanks / NGOs / research institutes — **tagged by viewpoint cluster** | `metadata` + `live` | Interpretation layer. Balance across clusters. |
| **T4** | Long-form journalism — newspapers, magazines, digital outlets (where the old allowlists lived) | `metadata` + `live` | Framing, reporting, leads. Not the primary anchor. |
| **T5** | Books / reference — chapter-level, **licensing permitting** | `full` only if open/owned/PD; else `metadata` | Depth, context, case framing. |
| **T6** | Case-study / postmortem / incident repositories — official inquiry reports, retrospectives, incident databases | `full` | The "hidden deep knowledge" + worked examples. |
| **T7** | Named expert blogs / newsletters / data shops — individuals with a track record | `metadata` + `live` | Specialist signal. Named, never anonymous. |

**`ingest` controls the RAG layer, not whether we cite.** `full` = the open/
licensed full text is chunked into the corpus and is **quotable**. `metadata` =
only title/abstract/citation is indexed — it can **guide** an agent but is
**non-quotable**; the issue must quote the legally-accessed original. `live` =
not pre-indexed; fetched on demand via the WebFetch allowlist. The copyright
basis for this split (India worst-case, "retrieve-to-guide, cite-the-original")
is in `../README.md` §"Two-tier ingestion & quoting".

---

## 2. Per-source line format (machine-readable)

Every source line in a `<topic>.md` allowlist, under its tier heading, uses:

```markdown
- **<Display Name>** — <URL> — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: <what to look for>
```

Field values (keep them exact — the agents grep these):

| Field | Allowed values | Meaning |
|---|---|---|
| `tier` | `T0`–`T7` | the tier above |
| `access` | `open` \| `reg` \| `paywall` | open / free-registration / paywalled |
| `ingest` | `full` \| `metadata` \| `live` | RAG class (per §1) — **must respect licence** |
| `viewpoint` | a cluster id from §4, or `n/a` | only T3/T4/T7 (interpretation sources) carry a cluster; primary/data/empirical = `n/a` |
| `cadence` | `live` \| `weekly` \| `annual` \| `archival` | how often it refreshes (drives RAG re-index frequency) |

Keep the existing **"WebFetch domains to allow"** code block at the bottom of each
file, and add every new domain to it **and** to `.claude/settings.local.json` so
cron runs don't prompt per-domain.

---

## 3. Vetting rubric — what earns a place

A source is admitted only if it passes a **two-axis** screen. Do not just "scrape
everything" — a large but noisy corpus lowers retrieval precision.

**Axis A — reliability / provenance / transparency (the gate):**
- **Reliability** — track record of factual accuracy (à la Ad Fontes' reliability
  axis); cites primary sources rather than only other secondary sources.
- **Provenance** — named authorship, an editorial/standards process, corrections policy.
- **Transparency** — methods, funding, and data disclosed; datasets documented.

**Admit if the source scores adequately on at least two of {reliability,
provenance, transparency}.** A T0/T1/T2 primary/data/peer-reviewed source clears
this almost by definition; T3/T4/T7 must earn it.

**Axis B — bias / viewpoint (the label, not the gate):**
- Assess lean using external references (AllSides / Media Bias-Fact Check for news;
  V-Dem / GIGA / think-tank self-description for institutes). Record it as the
  `viewpoint` cluster.
- **Partisan-but-rigorous is admitted *if labelled*** with its cluster (we *want*
  multiple viewpoints). **Partisan-and-unreliable is rejected** (fails Axis A).
- Bias is never a reason to exclude a source that passes Axis A — it is a reason
  to **tag** it and to **balance** it.

When in doubt, prefer the more primary tier and the more transparent source.
Re-vet the whole set quarterly (link-rot + licence drift).

---

## 4. Viewpoint clusters (per topic)

Clusters operationalise "more perspective" so issues draw across genuine
viewpoint diversity **without false balance**. They apply to the *interpretation*
layer (T3/T4/T7). Empirical primary/data sources (T0/T1/T2) are `viewpoint: n/a` —
they carry facts, not stances. Anchor each assignment to an external reference so
it is auditable, not asserted.

- **politics** — `left` · `center` · `right` · `intl-comparative` · `primary`
  (T0/T1 official). Anchor: AllSides/MBFC for outlets; think-tank self-description +
  scholarship for institutes. (India + comparative.)
- **earth** — `mainstream-science` · `policy-market` (market/innovation framing) ·
  `policy-regulatory` (state/precaution framing) · `industry` · `primary` (IPCC/
  agencies). The physics is settled → it lives in `primary`/`mainstream-science`;
  clusters apply only to the *policy* response.
- **tech** — `accelerationist` · `safety-governance` · `labor-society` (critical/
  worker/consumer) · `industry-vendor` · `primary` (papers/benchmarks). Anchor:
  institute mission + author affiliation.
- **space** — `agency-official` · `commercial-industry` · `science-academic` ·
  `policy-sustainability` · `primary`. Mostly empirical; clusters matter for
  policy (debris, militarisation, regulation).
- **sports** — `analytics` (data/xG) · `traditional-tactical` · `business-finance` ·
  `primary` (official stats/governing bodies). Viewpoint diversity is mostly
  analytical school, not ideology.
- **travel** — `industry-official` (UN Tourism/ICAO/operators) · `independent-critical`
  (overtourism, labour, climate) · `place-local` (regional/Indigenous perspective) ·
  `primary` (data/statistics).

Topics are free to refine their own cluster list inside their `<topic>.md` header —
keep the ids stable once set (the diversity gate greps them).

---

## 5. The diversity gate (discovery enforces this)

A candidate issue is only well-sourced if it satisfies **both**:

1. **Breadth:** ≥ 3 sources spanning ≥ 2 viewpoint clusters (on the
   interpretation layer), **and**
2. **Anchor:** ≥ 1 **T0/T1/T2 primary anchor** for the load-bearing facts.

**The primary-anchor requirement is the anti-false-balance mechanism.** On settled
empirical questions (climate physics, orbital mechanics, vote counts) the T0–T2
anchor carries the facts and is *not* "balanced" against a contrary opinion.
Viewpoint diversity applies **only** to the policy / interpretation / "what it
means" layer. The discovery and researcher prompts state this explicitly so the
gate never both-sides a fact.

If a candidate can't meet the gate from the allowlist, that is a signal the
allowlist needs expansion for that sub-topic — not a reason to reach for an
un-vetted source (which would get flagged `[UNVERIFIED]` downstream anyway).

---

## 6. Maintenance

- **Append, don't reorder**, within a tier (agents read top-to-bottom for priority).
- Add every new domain to the file's WebFetch block **and** `.claude/settings.local.json`.
- Re-vet quarterly: link-check, re-confirm `access`/`ingest`/licence (licences
  drift — e.g. FBref lost its Opta licence Jan 2026 → `ingest: metadata`,
  `cadence: archival`).
- Keep `viewpoint` cluster ids stable once published.
- When a tier's `ingest: full` set changes, the RAG re-index (P2/P3) must re-run
  for that topic.
