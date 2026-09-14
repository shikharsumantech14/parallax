---
name: claim-error-patterns
description: The recurring ways a Parallax draft goes wrong on claims — compression drops qualifiers, characterisations outrun their events, source lines drift from rows
metadata:
  type: project
---

Recurring claim-error shapes worth checking for first. None is derivable from
the schema or the dossier template; each cost a full read to find.

**1. Compression drops the qualifier, not the number.** The figure is always
right (drafters copy numerals); the *scope* attached to it in the dossier gets
lost. Seen: a daily cap that applies to one trail stated of a whole mountain; a
proposed rule requiring a peak "in Nepal" stated as any peak of that height.
**How to apply:** for every number, read the dossier's full sentence, not the
row — the qualifier lives in the clause after the figure. The shorter the field
(primer, title, tile note), the likelier the loss.

**2. A section title characterises the data and gets the count wrong.** Titles
now state the finding (register rule 11), which makes them claims. Seen: "four
steps that only tighten" over a six-event timeline where the fourth step is the
regime continuing unchanged. **How to apply:** if a title or intro counts or
characterises the marks in its own graphic, verify it against the graphic's
`data`, not against the dossier.

**3. The section `source` line and the section's rows drift apart.** A row
carried over from a published version keeps the old source line while its
sources changed, or a row was always backed by a source the line never named.
**How to apply:** per section, list which `sources[].id` backs each row, then
check the line names them. The proposed / contested rows are where this matters.

**4. "Absent" constraints hide in `sources[].quote`.** A quote ruled cut from
the body can still sit in the sources block. Check whether the renderer reads
the field before flagging it — `core/Sources.astro` does not render `quote`, so
it is metadata, not copy. Say which, in the report.

**5. Rupee conversions are computations, not claims — but only at the rate the
storyboard ruled.** Recompute them (value × rate) and check the rate is stated
in the section's `source` line. A rate that appears nowhere on the page is an
untraced claim even when the arithmetic is right.

**6. Analogies are claims when they describe a mechanism.** An analogy that
maps a booked, dated, pre-paid slot to a timed temple entry is fine; one that
implies priority or queue-skipping where none exists would be an invented
product. Check the mapping against the dossier's mechanism, not its vibe.
