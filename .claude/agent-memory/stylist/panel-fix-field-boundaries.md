---
name: panel-fix-field-boundaries
description: On a Phase-6 rewrite the reader panel's fix list usually lands in fields the stylist's Step-5 list calls untouchable, and a restored fact must land where sourceRefs already cover it
metadata:
  type: project
---

# Where a panel fix is allowed to land

**Most of a panel's "what would fix it" list sits in fields Step 5 marks
do-not-touch** — `timeline` event `note`s, `data-readout` tile `note`s,
`jargon-buster` `terms[]`. Measured on the asteroid rewrite: six of the panel's
nine fixes were in those fields, and only two were in `intro` / `followup`.

**Why:** Step 5 protects them because they are *data copy* — the verifier traces
them and the drafter budgets them. But a comprehension defect in a note cannot
be fixed anywhere else, so the launching agent authorises them item by item.

**How to apply:** do not assume the ban and return a flag-only report. Read the
task message for the explicit authorisation, then edit **wording only**: never a
numeral, never a date, never a verbatim fragment, and copy the figure string
character for character (`53–67`, `>20,000`, `13,200 mi (21,200 km)`). Say in
the summary which protected fields you entered and on whose instruction.

## The constraint that decides *where* a restored fact goes

**A fact restored from the storyboard must land in a section whose
`sourceRefs[]` already back it** — source metadata is the one thing the stylist
may never add.

**Why:** on the asteroid rewrite the obvious home for "two years before any
ground telescope could have" was the closer's `intro`, which carries `src-01`
only. The claim traces to the Webb blog, `src-07`, which sits on the `timeline`
section. Putting it in the closer would have created an untraceable claim on a
published issue.

**How to apply:** before placing a restored clause, check which `sourceRefs[]`
carry it and place it inside that section. Prefer the event note or intro of the
section that already cites the source over the section where the sentence reads
best. If neither fits, flag it rather than moving the source line.

## Verify the fix list's premise before you plan the fix

**A fix instruction can name a fact the draft does not contain.** On the
token-bill rewrite the instruction was "make the one historical rate card the
issue already carries do visible work" — and the draft carried no rate-card
figure at all. The storyboard had assigned one to a specific row (§5's currency
table) and the drafter silently dropped it, so the panel and the launching
agent both inherited the assumption that it survived.

**How to apply:** grep the file for the figure or phrase the instruction names
*before* planning around it. If it is absent and you are barred from adding a
figure, say so in the summary, name the row the storyboard assigned it to, and
hand the operator the restore as an authorisation request. Do not substitute a
different fact to satisfy the instruction.

## The closer with no source line at all

A `prose` closer sometimes carries **neither `source` nor `sourceRefs`**, which
makes it the hardest place in the issue to land a panel fix that wants a fact.
The tech issue's §8 was the panel's most-criticised section *and* its only
unsourced one, and the dossier held the exact clause the fix invited ("after
more than a year of availability").

**Do not import it.** Instead, land the panel's "why" as a **restatement of an
argument the issue has already drawn and sourced** in an earlier section — here,
the hero's five-layer stack. A restatement asserts nothing new, so it needs no
`sourceRefs`, and it does the panel's job better anyway: the complaint was that
the closer left the reader to infer the point from section 6, and pointing back
at section 6 in words is the literal fix. Then flag the missing source line
under Structure flags as a CANON §7 issue for the drafter or the operator.

## Two component grammars that force the wording

- **`number-sense` prints a decorative ≈ on every `equals` row** and cannot be
  told otherwise from the MDX. Any row that is not the headline figure restated
  (a complement, a later reading) has to **self-label inside `text`** — "The
  same figure turned around:", "Six days later, the reading was…" — because the
  row `note` renders at 13px in `--muted` under a 17.5px line and readers do not
  reach it.
- **A quoted fragment inside a `note` with no speaker reads as unsourced**, even
  when the section's source line carries it. The quote marks announce that
  somebody said this and then decline to say who. Give it a described speaker
  ("the astronomers who led those runs") rather than a name — rule 9 still
  applies.

## When the fix's own suggested home is protected, the section `intro` is the escape hatch

On the ISS-retirement issue the panel's fix #2 ("say *why* 2030") nominated the
`timeline`'s `caption` and its `annotation` — both Step-5 protected. The claim
(five agencies signed to 2030, Russia only to 2028) traced to `src-03`, which
already sat on that same section's `sourceRefs`, so the clause went into the
section's **`intro`**, which is the stylist's to write. **Check the section's
own `intro` before flagging a protected-field fix as unfixable**: an intro
sitting above a protected caption usually shares its `sourceRefs`, and a
restatement there reaches the reader before the graphic does.

The same run shows the opposite case. Fix #3 wanted the GAO's other 2027
drivers in the `three-steps` section, whose `sourceRefs` are `src-09` and
`src-04`; the claim traces to `src-01`/`src-02`. No intro escape hatch exists
when the source is on a *different* section. Flag it.

## A four-word budget decides which fixes you can apply

Cost every planned rewrite in words against the 1,100 ceiling **before**
editing, not after. This issue's baseline was 1,061, leaving 39 words. Five
intro rewrites plus three role/gloss additions spent 28 of them. The remaining
11 words are what made fix #3 impossible on arithmetic alone, independently of
the sourcing problem — and knowing that up front meant the fix was flagged
rather than half-applied and reverted.

## Move the orphan stat, do not cut it — the destination is chosen by `sourceRefs`

A panel's "connect it or cut it" on an orphan statistic has a third option the
list usually names in passing. On the eleven-bills issue "Seven of these bills
took five minutes or less" sat in `margin-bullets`' intro with no row to match
it, and none of the four rows could ever carry it (none measures debate time).
The panel's own aside — "or the debate-time theme in section 2/5" — was the
answer: section 5 already carries `src-04`, the ThePrint/PTI piece the figure
comes from, **and** a stage note reading "Five minutes of debate" that gives the
reader a referent one line below. Section 2 does *not* carry `src-04`, so the
move had exactly one legal destination.

**How to apply:** when a stat is orphaned, do not reach for the cut first. List
the sections whose `sourceRefs[]` back it, then pick the one whose existing data
copy supplies a visible referent. Cutting a sourced figure loses reader value
the panel did not ask you to lose; moving it costs words but pays them back.

Watch the aggregation trap on the way: the case-study bill's own total was 45
minutes, so the sentence must say "Seven of the eleven bills", never anything
that implies this bill is one of the seven.

## The unsourced half of a two-part fix

Panel fix instructions bundle claims. Here fix #2 asked for the government to be
named as the owner of both the **calendar** and **committee referral**. The
dossier's §4.3 sources the first ("the power to summon parliament rests with the
executive", Article 85 + The Wire, both already on the section) and sources the
second **nowhere** — only the dossier's own §1 structural-argument prose asserts
it, and the storyboard's Q3 answer cites a §4.3 that does not contain it.

Write the sourced half, flag the other. A fix list is not a source, and a
storyboard quoting a dossier section is not a check that the section says it.

## "Move the caveat" means delete it from where it was

A panel fix that reads "move the denominator caveat into the intro or plain
line, before the numbers" authorises **both halves of the move**. On the
NRI-arrivals issue the caveat ("the ministry does not say whether the base is
foreign tourists or all arrivals") lived in the `attrition-waffle` `caption` —
Step-5 protected. Writing it into the `intro` and leaving the caption alone
satisfies the letter of the fix and leaves the issue 15 words heavier with the
same sentence printed twice, four lines apart, on the same section.

The caption is protected because the verifier traces its *claim*. Deleting a
sentence the panel explicitly relocated removes no claim from the issue — it is
still on the section, above the graphic instead of below it, where the panel
wanted it. Do it, and name the field in the summary.

## When the draft is already over the 1,100 ceiling before you start

Cost the baseline first, not just your additions. Here the gate read 1,158 after
the first wave of edits and my net additions were ≈ +55, so the drafter had
shipped ≈ 1,103 against a storyboard budget of 972. Two consequences:

- **Do not absorb someone else's overspend by dropping facts.** Trim your own
  additions to their tightest form, then take the redundancy the panel fixes
  expose (a duplicated caveat, a `plain` that restates the caption), and report
  the residual as the drafter's, with both numbers.
- **The cheapest legitimate words are duplicates, not glosses.** Every trim that
  worked on this issue was a sentence saying something the issue already said
  somewhere else. The glosses, restatements and comparisons the register
  *requires* are the last thing to cut, never the first.

See [[parallax-ai-tells]] and [[job-fit-judgements]].
