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

**9. The BRANCH ERROR — a sourced figure attached to the wrong arm of a
two-arm finding.** The sharpest defect found on the amazon rewrite, and a
different animal from pattern 1: nothing is compressed and no qualifier is
dropped. The record splits an outcome across two scenarios (heat alone → "up to
35% / around one-third"; heat plus clearing → "two-thirds to three-quarters")
and the draft attaches the *larger* outcome to **both** ("Either point ends the
same way, because two-thirds to three-quarters could turn to savanna"). Every
number traces. The conjunction does not.
**Why it survives every prior gate:** the earlier verification's claim row reads
"Collapse = two-thirds to three-quarters ✅ — dossier §4", which checks the
*figure* and never asks which branch owns it. A reader panel cannot catch it
either: it makes the issue simpler, not harder.
**How to apply:** whenever a dossier bullet is headed by a CONDITION ("with both
dials turned", "without additional deforestation", "under the amended rule"),
write the conditions down as a two-column list before reading the draft, then
find every sentence that states the outcome and check which column it is in. The
tell is a sentence containing "either", "both", "same", "in every case" beside a
figure the record conditions. **And check the draft against itself** — here the
contradiction sat one section earlier in the issue's own `note`, which is what
made it provable rather than arguable (see [[cheap-checks-that-catch-most]] 1).
Report ⚠️, not ❌: the figures are sourced and the fix is a clause.

**6. Analogies are claims when they describe a mechanism.** An analogy that
maps a booked, dated, pre-paid slot to a timed temple entry is fine; one that
implies priority or queue-skipping where none exists would be an invented
product. Check the mapping against the dossier's mechanism, not its vibe.

**10. The ENTAILMENT stated as though it were quoted.** A later research pass
quotes its sources verbatim, which makes it easy to check what is *in* the quote
and easy to miss what the draft added around it. On transgender-ratchet the pass
quoted PRS saying the 2016 Bill "lapsed with the dissolution of the 16th Lok
Sabha"; the draft wrote "**Still pending in the Rajya Sabha**, it died when that
Lok Sabha ended." The added clause is true and follows necessarily (Art. 107(5):
only a Bill *passed by the Lok Sabha and pending in the Rajya Sabha* lapses that
way), but no cited source states it. **How to apply:** for each claim traced to a
verbatim block, read the block and the draft sentence side by side and underline
the words the block does not contain. Report ⚠️ at the lowest severity with the
reasoning written out, both because it is usually right and because the operator
needs to know which words are quoted and which are reasoned. Do not ask for a
rewrite.

**12. A CUT section leaves its source behind on a neighbour's `sourceRefs` —
and the `# EDITOR:` note inherits the same wrong document.** The storyboard's
contingency swap (§8.4: if the delta-v values cannot be confirmed, drop the
`benchmark-chart` for an `elevation-profile`) never fired, but the *source that
belonged to the unbuilt section* did: `src-07`, the Orbital Debris Program
Office, sits on the benchmark chart carrying none of its three numbers, while
the white paper that does carry them is the OTHER ref on the same line. The
`# EDITOR:` block then told the operator to "confirm against NASA's Orbital
Debris Program Office" — the wrong document, so the pre-publish check on three
[UNVERIFIED] figures would have returned a false negative and the operator
would reasonably have concluded the numbers were unfindable.
**Why it survives:** both refs resolve, the section is genuinely dual-sourced,
and the EDITOR note reads as diligence. The trace check asks "does this id
exist", never "does this id contain this number".
**How to apply:** whenever the storyboard names a contingency section that was
NOT built, list that section's planned sources and grep the draft for them —
each one still present is on the wrong section. Then read every `# EDITOR:`
block as a claim in its own right and trace the *document it names* the same
way you trace a figure. An EDITOR note naming the wrong source is more damaging
than an untraced number, because it converts a resolvable check into a dead end.

**13. THE HEDGE REVERSAL — "at least X" rewritten as "only to X".** Distinct
from pattern 1 (a dropped qualifier) because nothing is dropped: a bound is
*inverted*. The dossier and its primary source both say Russia is committed
"through **at least** 2028" — a floor. The draft says "**only to** 2028" — a
ceiling, in two places. The direction is never random: it always strengthens
the issue's own argument (here, that the partnership is fraying faster than the
2030 date suggests).
**How to apply:** build a small list before reading the draft of every dossier
phrase containing *at least, at minimum, up to, no earlier than, through, more
than, roughly, approximately*, and grep the draft for each figure. Check which
side of the number the draft's word sits on. Report ⚠️ with both phrasings
quoted side by side — the fix is one word and needs no research, but a verifier
who only compares numerals will never see it.

**14. A section promises arithmetic and then does not do it.** `three-steps`
opened "The gap between them is arithmetic" and gave 18 months plus "at least
three years", which counted back from 2030 does not land on the 2027 the third
step asserts. The real driver (certifying a replacement, securing funding) is in
the dossier and never reaches the page. Every individual figure traces; the
*derivation* does not exist.
**How to apply:** when an intro says the finding follows from the numbers
("arithmetic", "count back", "add it up", "that leaves"), do the sum yourself on
the section's own `data`. This is [[cheap-checks-that-catch-most]] 1 applied to a
promise rather than a total. Note that the reader panel finds these
independently — if the panel's surviving item and your arithmetic point at the
same section, say so; a defect two gates found from opposite directions is the
one the editor should fix first.

**15. THE DOSSIER'S OWN ARITHMETIC, inherited faithfully and ratified by the
panel.** Distinct from every pattern above, because the draft did nothing
wrong: it copied a computed figure the researcher had already got wrong. On
half-indias-arrivals the dossier's §4h read "roughly 38 paise per foreign
tourist (Researcher's division)"; ₹3.5 crore ÷ 9.15 million is **₹3.83**, a
factor of ten. The draft printed both operands and the wrong quotient in one
sentence, so the page refuted itself.
**Why nothing else caught it:** a reader panel's arithmetic persona *validates*
a figure that is presented as already-divided — Karthik wrote "the ₹3.5 crore
promotion budget works out to 38 paise a tourist. Numbers check out." The
stylist preserves numerals by contract. The trace check passes, because the
figure genuinely traces.
**How to apply:** treat any dossier line annotated "(Researcher's division)",
"(computed)", "(derived)" or carrying a unit that is a *ratio* as UNVERIFIED
regardless of what the dossier's status header says, and redo the division on
the draft's own printed operands. Then **write the dossier fix as a numbered
required fix of its own**, beside the draft fix — the draft edit alone leaves
the error live for the next issue that reaches for the figure. Report ❌: a
self-refuting sentence is not a wording flag. See
[[cheap-checks-that-catch-most]] 1, which this is the purest instance of.

**16. Check the COMPONENT's value domain before flagging a draft that departs
from its approved storyboard.** Twice on one issue the draft's `data` differed
from the storyboard and the draft was right both times. `region-map` documents
`value` as **0–1 choropleth intensity** consumed by `colorAt()` with no
internal normalisation, so the storyboard's raw percentage shares (18.13,
17.59…) would have clamped every zone to the darkest colour; the draft
normalised against the leader. `attrition-waffle`'s optional `trueN` forces the
literal figure into the caption and adds a `per hundred · n = N` chip, so the
storyboard's `trueN: 9150000` would have asserted a full-year foreign-tourist
sample size over a three-month table of admittedly unknown denominator; the
draft omitted it. **How to apply:** a storyboard is a composition document, not
a type contract, and the composer reads `catalog-shapes.md` rather than the
component. Before writing STORYBOARD-DRIFT, open the component and read the
interface comment on the field. When the departure is correct, still record it
— and check whether the draft's `# EDITOR:` block *names* it. One of these two
was named and one was not, and the unnamed one invites a later editor to
"restore" values that break the graphic.

**11. The dossier is stale in more places than the brief names — and the date
that betrays it is the one the draft got RIGHT.** The brief said three; a fourth
surfaced from a row the draft had quietly sidestepped. Dossier §3 put the 2019
Act's 26 November passage in the **Lok Sabha**; the later pass's PRS table has
LS 5 Aug and **RS 26 Nov**. The draft's label named no chamber, so nothing on the
page was wrong and no flag fired anywhere in the pipeline. **How to apply:** when
a later pass supplies a table of the same events the dossier timelines, diff the
two tables row by row even where the draft is clean. A draft that dodges an error
leaves no trace of the dodge, so the error survives in the dossier for the next
rewrite. The fix is always a dossier line, never a draft change — say so, because
a rewrite is usually barred from editing the dossier and the recommendation will
otherwise read as unactionable.
