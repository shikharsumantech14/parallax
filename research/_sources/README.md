# Source allowlists

The discovery agent pulls candidate topics **only from the sources listed
in the per-category allowlist below**. This is the brand-protection layer
of the discovery step: no Reddit rumours, no random Substacks, no SEO
spam. Only sources you trust.

> **Read `_TAXONOMY.md` first.** Each `<topic>.md` is now a **tiered**
> (T0–T7), viewpoint-tagged, machine-readable allowlist of ~50–80 vetted
> sources, not a flat list. `_TAXONOMY.md` defines the tiers, the per-source
> fields (`tier · access · ingest · viewpoint · cadence`), the vetting rubric,
> the viewpoint clusters, and the diversity gate. This README holds the
> operator-facing how-to + the copyright/ingestion rule.

## How to fill an allowlist

Each `<topic>.md` file in this folder is a list of trusted sources for
that topic. The discovery agent reads it before running and uses it as
the universe of stories it's allowed to surface.

Format per source line:

```markdown
- **<Display Name>** — <URL> — type: <newspaper|magazine|digital|academic|official|think-tank|blog|podcast> — focus: <what to look for>
```

Example:

```markdown
- **The Hindu** — https://www.thehindu.com/news/national/politics/ — type: newspaper — focus: parliamentary politics, electoral analysis
```

## How to add a domain to Claude's WebFetch allowlist

For each source domain, add a permission entry to
`.claude/settings.local.json` so the discovery agent can fetch it:

```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:thehindu.com)",
      "WebFetch(domain:indianexpress.com)"
    ]
  }
}
```

Otherwise Claude will prompt you to allow each domain on first fetch.
That's fine for ad-hoc; tedious for weekly cron runs.

## What "trusted" means here

Pick sources that:

1. Have an editorial standards process
2. Cite primary sources (not just other secondary sources)
3. Cover your topic with reasonable frequency (so weekly discovery has
   fresh material to mine)
4. Are accessible to fetch (not behind hard paywalls; basic-paywall is
   fine if you have a subscription)

Target **~50–80 vetted sources per category**, organised under the `_TAXONOMY.md`
tiers. (The old "8–15, more dilutes focus" cap applied when the whole list was
pasted into the agent prompt; retrieval now moves to the RAG layer, so a large
*tiered* corpus gives breadth **and** focus. The allowlist still gates what
Parallax will cite.) Curate for tier + viewpoint coverage, not raw count — admit
only sources that pass the `_TAXONOMY.md` §3 vetting rubric.

## Don't include

- Aggregators (Google News, Reddit, HackerNews) — too noisy
- Sources you wouldn't cite in a Parallax issue's `sources:` array
- Anything with paywall walls that block both you and the agent

## Two-tier ingestion & quoting (copyright rule)

The RAG corpus (see the plan / `scripts/rag/`) ingests sources at two physical
tiers, set by each source's `ingest` field. **India is the binding worst-case**
jurisdiction (no statutory text-and-data-mining exception; Copyright Act 1957
s.52 fair dealing is *exhaustive*; the DPIIT working paper of 8 Dec 2025 favours
mandatory licensing; *ANI v OpenAI* is reserved at the Delhi HC). So:

- **`ingest: full`** — open / official / public-domain / CC-permissive / owned
  full text only. These chunks are **retrievable *and* quotable**.
- **`ingest: metadata`** — closed / paywalled / non-commercially-licensed works
  (e.g. Semantic Scholar's default licence is non-commercial; Google Books /
  HathiTrust snippet-only). Only title/abstract/citation is indexed. These chunks
  **guide** an agent but are **non-quotable**.

**The rule, both for agents and the verifier:** *retrieve-to-guide, cite-the-
original.* A published issue may quote **only** a short, attributed, s.52(1)-
purpose (criticism / review / reporting) excerpt taken from a **legally accessed
copy of the original** — never text reconstructed from the index, and never from
a `metadata`-only chunk. The verifier rejects any quote backed by a `metadata`-
only or non-permissive source. When a source's licence is unclear, set
`ingest: metadata` (conservative default). Date-stamp and re-review this rule set
quarterly — licences drift.

## Updating sources

Edit the file directly. The discovery agent re-reads it on every run, so
new sources take effect immediately. Add every new domain to the file's WebFetch
block **and** to `.claude/settings.local.json`.
