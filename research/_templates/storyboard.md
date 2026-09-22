# Storyboard: <TITLE>

- **Category:** <category>
- **Dossier:** research/<category>/<date>-<slug>-dossier.md
- **Composed:** <YYYY-MM-DD>
- **Composer:** composer-agent
- **Status:** draft            ← draft | approved | hold  (the gate; see below)

> Created under `docs/REGISTER-PLAN.md` §5.2; RG-07 ruled 2026-09-13: a
> separate composer agent, and the gate is a switch. The storyboard is written
> after the dossier and before the draft. It maps every point the reader must
> get to the component that shows it, chosen from all twelve data shapes in
> `docs/design/catalog-shapes.md`, and fixes how many words may sit around each
> one. The drafter executes it the way it executes the dossier; the verifier
> checks the draft matched it.
>
> **The gate.** `GATES.storyboard` in `scripts/pipeline.config.ts` is the one
> switch, read by both routes (the API CLI and the `/pipeline-draft` command):
> - `'required'` (the setting until the first ten issues have run): the drafter
>   runs only when this file says `Status: approved`. The operator reads the
>   table, edits rows if needed, and flips the status.
> - `'auto'`: the drafter also runs on `Status: draft`.
> - `Status: hold` parks the issue in either mode.

---

## 1. The argument in one line

The dossier's §1 structural argument, restated in the register (plain Indian
English, ≤ 30 words). This is what the issue exists to make a reader get.

## 2. The hero

One component carries the argument (CANON §2). Name it, name its data shape,
and say which dossier §4 facts it renders. It is the only section that may use
`layout: split`.

## 3. The beats

One row per thing the reader must get, in reading order. 6–9 rows. The first
row after the head is a graphic or a `data-readout`, never prose. No two
text-only rows adjacent. At least six in ten rows visual. ≥ 1 kind from outside
the six workhorses (prose, data-readout, timeline, paradox, quote, comparison).
And, since 2026-09-16: at least 40% of rows DRAWN graphics (`you-think`,
`number-sense`, `jargon-buster`, `three-steps` and `data-readout` are cards,
not graphics), ≥ 3 distinct graphic kinds, the four plain-language cards at
most once each and ≤ 3 in total, ≥ 2 graphic kinds new to the publication —
tallied in §9.

| # | The reader must get (one line, register) | Data shape (G1–G12) | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Dossier §4 rows it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |
| 2 | | | | | | | | |

Word budgets (from `_voice-core.md` §3 and REGISTER-PLAN §3.3): intro ≤ 45;
prose section ≤ 200; timeline note ≤ 20; tile note ≤ 15; paradox detail ≤ 45;
annotation ≤ 12; whole issue ≤ 1,100 reader-facing words; ≤ 80 words before
the first graphic.

## 4. The head

- **Title (states the finding, ≤ 8 words):**
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
- **Dek (≤ 14 words; carries the Hindi if the title has none):**
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**

## 5. The Indian ground

Where the issue touches India, with the dossier row that supports each: a
bracketed ₹ for each CURRENT foreign-currency figure (historical ones stay
unconverted), the comparison for every big number, the place or habit the
reader owns. If the dossier carries no Indian fact, say so here — a scale
comparison needs no new fact; a new claim needs a source before the drafter
may use it.

## 6. The three questions

What the issue must teach. Written from the dossier, not the draft; the
reader panel answers them from the draft alone. Each has a short model
answer with the dossier row it traces to.

1. Q: … · A: … · dossier §4 row …
2. Q: … · A: … · dossier §4 row …
3. Q: … · A: … · dossier §4 row …

## 7. Names

The ≤ 12 named people and organisations the issue will carry, each with the
role phrase that introduces it. Anything in the dossier not on this list is
described, not named.

## 8. Composer notes

Kinds considered and rejected (and why); data the dossier lacks for a kind
that would have fitted; anything the operator should rule on before the draft.

## 9. Kind ledger

Added 2026-09-16. The floors on drawn graphics and new kinds are checked
here before the draft, and by `npm run check:prose` after it (FEW-GRAPHICS,
CARD-HEAVY, NO-NEW-KIND). "New" means on the ledger in
`docs/generated/PROJECT-GRAPH.md` ("Never in a published issue") AND not
claimed by another storyboard dated within the last 30 days.

| Kind | Rows (#) | Drawn graphic? | New to the publication? |
|---|---|---|---|
| | | | |

- **Drawn graphics:** N of M rows (floor 40%) · distinct graphic kinds: N (floor 3)
- **Plain-language cards** (you-think · number-sense · jargon-buster · three-steps): N (cap 3, one of each)
- **New kinds:** N (floor 2) — which, and the data shape each fills
