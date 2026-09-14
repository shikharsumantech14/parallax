---
name: inherited-data-blindspot
description: The highest-yield check per run — long carried-over data series in a rewrite are the claims nobody has ever traced
metadata:
  type: project
---

**The biggest untraced claims in this repo are not invented sentences — they
are long `data.values` arrays that were carried over verbatim and therefore
never audited.**

**Why:** a storyboard that says "data carries over verbatim" reads as a
safety guarantee, and a prior verification report reads as prior clearance.
Neither is. On the el-niño Phase-4 rewrite (2026-09-14) the hero
`climate-strip` rendered 57 annual values of which 6 were in the dossier; the
dossier's §9 explicitly said the series "still needs a direct fetch" and no
fetch was ever recorded. The May report never audited that section at all —
it audited a `comparison` row that had been re-kinded before publication, so
the report *looked* thorough while the series slipped between two passes.

**How to apply:**
- On any rewrite, treat "carries over verbatim" as *unaudited until proven*,
  not as *already verified*. Diff the previous verification report's claim
  table against the current section list: any section the old report does not
  name is a section nobody has ever checked.
- For any series longer than ~10 points, spot-check the anchor years the
  dossier does carry, then ask where the remaining points came from. The
  dossier's own "data for <kind> visualisation" note usually confesses the gap.
- Check the graphic's `source` line names against `sources[]`. A data provider
  credited in a source string but absent from the source list (Berkeley Earth,
  ERA5 annual) is the tell that the series was fetched outside the dossier.
- The fix to recommend is almost always a dossier §4 addendum plus a
  `sources[]` entry — not a text change. Say so, so the editor does not read
  ❌ as "your prose is wrong".

See [[cheap-checks-that-catch-most]].
