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

**6a. The orphan quotation — quote marks with a perfect trace and no speaker.**
The most durable quote defect is not a misquote. It is a *fragment*: three words
lopped off the front of a sourced sentence, the next word silently
recapitalised, no ellipsis, and nobody named on the page — while the `sourceRefs`
entry that carries the sentence sits right there, so the trace passes cleanly and
the field still reads as an unattributed claim in quotation marks. Seen twice on
one issue (a NASA sentence in a `number-sense` note; the same shape survived
two reader panels, which both found it from the reader's side). **How to apply:**
separate the two questions — *are the enclosed words verbatim* and *does the page
say who said them*. A fragment can pass the first and fail the second, and the
fix is a four-word attributive phrase or deleting the marks, never re-research.
The sibling case is honest and worth praising when you see it: a quoted fragment
inside an accurate frame with the speakers **described** rather than named
("the astronomers who led them said…") is fully compliant with the name ration.

**7. Match the SHAPE of each ref to the SHAPE of its claim — event, year-total,
or global stock.** A section's `sourceRefs` can all resolve, all be earned by
*some* sentence, and still leave the section's biggest number homeless. On
kessler-cascade the `data-readout` carried "7,473 objects added to orbit in 2024"
over five refs that were a *Starlink* statistics page, a 2022 rulemaking Order, a
*single* break-up article, one mission page and one station blog post — not one of
which can carry an annual global figure, while the one entry in the bibliography
that publishes annual environment statistics (the ESA report) was cited on five
other sections and not on that one. **How to apply:** for every year-total or
population figure, ask which named source *publishes that series*, then check that
id is on that section. A per-event source under a per-year claim is the tell.

**7b. A ref can also be the wrong STAGE of the right institution.** The dated-source
check (rewrite-audit item 4) has a second axis. A regulator's **rulemaking** order
cannot carry a **penalty levied under it** two years later; a **First Committee**
press release (`press.un.org/.../gadis….doc.htm`) cannot carry the **plenary**
tally, and the two votes have different numbers and different months. Both shapes
passed every prior gate on this issue because the publisher name matches and the
id resolves.

**8. When a stylist softens a quantifier a panel flagged, re-audit the NOUN.**
"Mostly from things breaking apart" → "Break-ups are part of it" fixed a share the
page's own arithmetic refuted, without touching either numeral — correct, and it
also made the tile *look* settled. What the softening could not reach was the
label's verb: "objects added **to orbit**" versus "added to the **catalogue**" are
different claims, and the note is only true under one of them. **How to apply:** a
softened quantifier narrows what is asserted; it never sources the figure it sits
on. Trace the number and the label separately from the hedge, and say which of the
three the fix belongs to.

**6. Analogies are claims when they describe a mechanism.** An analogy that
maps a booked, dated, pre-paid slot to a timed temple entry is fine; one that
implies priority or queue-skipping where none exists would be an invented
product. Check the mapping against the dossier's mechanism, not its vibe.
