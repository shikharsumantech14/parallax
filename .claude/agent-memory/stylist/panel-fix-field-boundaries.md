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

See [[parallax-ai-tells]] and [[job-fit-judgements]].
