# Source allowlists

The discovery agent pulls candidate topics **only from the sources listed
in the per-category allowlist below**. This is the brand-protection layer
of the discovery step: no Reddit rumours, no random Substacks, no SEO
spam. Only sources you trust.

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

Try for **8-15 sources per category**. Fewer is fine; more dilutes the
agent's focus.

## Don't include

- Aggregators (Google News, Reddit, HackerNews) — too noisy
- Sources you wouldn't cite in a Parallax issue's `sources:` array
- Anything with paywall walls that block both you and the agent

## Updating sources

Edit the file directly. The discovery agent re-reads it on every run, so
new sources take effect immediately.
