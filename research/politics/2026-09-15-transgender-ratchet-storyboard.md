# Storyboard: Who decides your gender in law moved twice

- **Category:** politics
- **Dossier:** `research/politics/2026-05-02-transgender-ratchet-dossier.md`
  (`Status: ready-for-draft`) — this is a Phase 6 **rewrite** of a published
  issue, so the factual record is three files, not one: the dossier, the
  published `src/content/issues/2026-05-02-transgender-ratchet/index.mdx` with
  its `sources[]` block (src-01 … src-15), and
  `research/politics/2026-05-02-transgender-ratchet-verification.md`
  (**NEEDS REVISION**, three required fixes, two of them still open in the
  published file). Every fact below is already in one of those three. No claim,
  number, name or source is added.
- **Composed:** 2026-09-15
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-15; rulings settled in §8i

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
>
> **REWRITE.** REGISTER-PLAN §8.1 calls this issue "the outlier on every axis".
> The five measured defects this rewrite exists to fix:
> 1. **1,745 reader-facing words in 6 sections** against a ≤ 1,100 ceiling —
>    the longest issue in the backlist, and the only one whose average section
>    runs near 300 words.
> 2. **3 of 6 sections visual (50%)** against a 60% floor. Four of the six
>    kinds are in `TEXT_ONLY` in `scripts/check-prose.mjs`: `paradox`, `quote`,
>    `prose`, and — the one that surprises people — nothing else, because
>    `timeline`, `bill-breakdown` and `data-readout` are all visual. The three
>    text-only sections sit at positions 3, 4 and 6.
> 3. **A run of two text-only sections** (`paradox` → `quote`, sections 3 and
>    4), which trips PROSE-RUN.
> 4. **145 words before the first graphic** against a ceiling of 80, and the
>    issue **closes on `prose`** — a three-paragraph, ~330-word block.
> 5. **55 distinct names against a ceiling of 12** — the single largest gap in
>    the backlist. §7 works out which are load-bearing and which belong on the
>    source line, and carries a boxed note about the gate's heuristic, which
>    will overcount this issue badly.
>
> **The verification verdict is a constraint, not background.** The report is
> NEEDS REVISION with three required fixes and three optional improvements.
> **Two of the three required fixes are still open in the published file** and
> both are resolved by composition here, not by patching prose (§8a). The
> report predates `_voice-core.md` v2 by four months; where the two disagree,
> §8c says which one this spine followed.
>
> **Rewrite rules in force** (REGISTER-PLAN §8.1): the slug
> `2026-05-02-transgender-ratchet` and all fifteen `sources[]` entries are
> kept, so the URL does not change and the verifier's trace still holds. `id`,
> `topic`, `publishedAt`, `status: published` and `tags` are unchanged;
> `readTimeMinutes` drops 7 → 4. §8a lists which component `data` carries over
> character for character and which sections are cut or re-kinded.
>
> **The editorial care this subject needs, stated once.** This issue is about a
> law governing a vulnerable minority. The register work and the editorial care
> pull the same way: be concrete, be accurate, and let the record speak. The
> politics desk carries **zero** SATIRICAL EXPOSURE (`_voice-core.md` §7), the
> fewest Hindi words of any desk, and no Hindi joke ever. This spine carries
> **no Hindi at all** (§5), no DRY WIT, and no LYRICAL paragraph. Where the
> law's language and the community's language differ, the precision layer takes
> the law's term and glosses it flat. Three characterisations the published
> issue makes and its sources do not support are named in §8e and are **not**
> carried forward.

---

## 1. The argument in one line

In 2014 a person's own word settled their gender in law. Two Acts later a
medical board recommends and a district magistrate issues, and a refusal has
nowhere to go.

## 2. The hero

**`power-matrix`** (G6 · composition — the decisions in one case crossed with
the people the law puts in charge of each), at `layout: wide`.

It carries the argument because the argument *is* the grid. Everything before
it builds one question: after three legislative cycles, who actually decides?
The matrix answers it in one read. Five decisions down the left (**apply for a
certificate · examine and recommend · issue it or refuse it · report your
surgery · appeal a refusal**), four actors across the top (**you · the hospital
· the medical board · the magistrate**). The "you" column has exactly one
filled cell: you may apply. The bottom row is empty across all four columns,
because neither the 2019 Act nor the 2026 Amendment provides an appeal.

Every one of its twenty cells traces to a dossier §4 line: Section 4(2)
deleted in full (the "you" column on rows 2–5); the magistrate issues "after
examining the recommendation of a designated medical board" (rows 2 and 3);
medical institutions must report patient details to the magistrate and the
board (row 4); no appeal mechanism under either Act (row 5). The enum claims
who holds a lever, not that an event happened, which is the right register for
a statute.

**`layout: split` is declined.** The hero is the only row permitted it
(CANON §2), and a four-column grid at half measure loses the read-across that
is the whole point. `wide` gives it the width and keeps the issue at **zero
loud sections**.

**Not the hero, and why: `timeline`.** It is the published lead, it is honest,
and it is the section the verification traced most completely. But it shows
*when* the decision moved, not *where it landed*, and it is a workhorse in an
issue whose measured defect is workhorse monoculture. It stays as row 2 and
hands the hero the question it raises.

## 3. The beats

One row per thing the reader must get, in reading order. 6–9 rows. The first
row after the head is a graphic or a `data-readout`, never prose. No two
text-only rows adjacent. At least six in ten rows visual. ≥ 1 kind from outside
the six workhorses (prose, data-readout, timeline, paradox, quote, comparison).

*For this rewrite the last column cites the published issue's own section and
`sources[]` id, or the dossier §4 row, in place of a fresh dossier reference.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / worked example | Plain-line sketch | Published row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | This did not start this year. The decision has already moved twice. | G2 · belief vs record | `you-think` **[new]** | — | **70** · eyebrow ≤ 2 w · title ≤ 6 w · **no intro** · `think.text` ≤ 16 w · `actually.value` "12 years" · `actually.text` ≤ 20 w · `note` ≤ 14 w · `caption` ≤ 12 w | The two dates themselves, 2014 and 2019, as a before and after the reader can hold | omit — `EXPLAIN['you-think'].what` fits | `timeline` events 1, 3, 8; `paradox` side 1 · src-04, src-12 |
| 2 | Twelve years, six dates, one question running through all of them. | G4 · dated sequence | `timeline` **[carried, 8 → 6 events, gains `annotations[]`]** | — | **160** · eyebrow ≤ 2 w · title ≤ 5 w · intro ≤ 18 w · 6 events (`date` + `label` ≤ 10 w; a `note` ≤ 10 w on **three of six**, and ≤ 18 w on the last) · **2 annotations** ≤ 12 w | — | omit — default fits | `timeline` events 1, 2, 3, 4, 5, 8 · src-01, src-03, src-10, src-11, src-12, src-14, src-15 |
| 3 | Three words the law uses, in plain terms, before the law is quoted. | G1 · narrative (text-only) | `jargon-buster` **[new]** | — | **85** · eyebrow ≤ 2 w · title ≤ 5 w · intro ≤ 12 w · 3 terms (`term` ≤ 4 w · `meaning` ≤ 18 w) · **no `hindi` field** (§5) | Each gloss is itself the concrete thing: "the paper a district magistrate issues" | none (narrative kind) | `bill-breakdown` cards 1–3; `timeline` event 3 note · src-02, src-03, src-04 |
| 4 | Four things the 2026 Amendment did to the Act, in the Act's own words. | G6 · composition, provisions as cards | `bill-breakdown` **[carried, 4 cards, bodies cut ~70 % ]** | — | **150** · eyebrow ≤ 3 w · title ≤ 6 w · intro ≤ 15 w · 4 cards (`label` ≤ 3 w · `title` ≤ 5 w · `body` ≤ 22 w; card 1 keeps **one** bullet ≤ 12 w) · `primary: true` stays on card 2 · `caption` ≤ 12 w | The ₹2 lakh fine on card 4 is the felt number; the statutory category list on card 1 is the law's own vocabulary, carried exactly (§5) | omit — default fits | `bill-breakdown` all 4 cards · src-01, src-02, src-04 |
| 5 | How one person gets a certificate now, and where a refusal goes. | G1 · narrative (text-only) | `three-steps` **[new]** | — | **90** · eyebrow ≤ 2 w · title ≤ 6 w · intro ≤ 10 w · 3 steps (`title` ≤ 5 w · `text` ≤ 20 w) | The worked example is one application walked end to end: who starts it, who is consulted, who signs, and what happens if the answer is no | none (narrative kind) | `bill-breakdown` cards 2–3; `data-readout` tile 4 note · src-01, src-02, src-04 |
| 6 | It cleared both houses in two days, by voice vote, with the scrutiny refused. | G7 · process, stage by stage | `bill-passage` **[new]** | — | **90** · eyebrow ≤ 3 w · title ≤ 5 w · intro ≤ 22 w · 4 stages (`label` ≤ 2 w · `date` · `note` ≤ 10 w) · `caption` ≤ 12 w | The calendar is the concrete thing: 13, 24, 25, 30 March | omit — `EXPLAIN['bill-passage'].what` fits | `timeline` events 6, 7, 8; `paradox` side 2 · src-01, src-05, src-06, src-07 |
| 7 | What was said on the day, by the minister, an MP, and a council member who resigned. | G1 · narrative (text-only) | `quote` **[carried, three voices, quote text verbatim]** | — | **115** · eyebrow ≤ 3 w · title ≤ 3 w · intro ≤ 14 w · `quote` **21 w verbatim, fixed** · `attribution` ≤ 9 w · `followup`: framing ≤ 10 w + **12 w verbatim, fixed** + attribution ≤ 7 w + **30 w verbatim, fixed** + attribution ≤ 13 w | — | none (narrative kind) | `quote` all fields · src-05, src-06, src-08 |
| 8 | The system being amended had issued 15,800 certificates, and refused 5,566. | G3 · headline numbers | `data-readout` **[carried, 5 tiles, `value` strings verbatim]** | — | **100** · eyebrow ≤ 3 w · title ≤ 6 w · intro ≤ 12 w · 5 tiles (`label` ≤ 6 w · `note` ≤ 10 w) · `accent: true` stays on tiles 3 and 4 · `caption` ≤ 8 w | "4.87 lakh" beside 4,87,803 (unit conversion, D1); the activists' "fewer than 5 in 100" is the sourced feel, and no ratio is computed (§5, D6/D7) | omit — default fits | `data-readout` all 5 tiles · src-02, src-13 |
| 9 | Five decisions in one certificate case. You hold one of them. | G6 · who controls what | `power-matrix` **[new]** | **HERO** · `layout: wide` | **95** · eyebrow ≤ 3 w · title ≤ 5 w · intro ≤ 16 w · 5 `institutions` ≤ 5 w each · 4 `parties` labels ≤ 3 w each · `caption` ≤ 14 w · **authored `plain`** ≤ 24 w | The grid is the concrete thing: one row per decision, one column per person who can make it | "Five decisions down the side, the people who can make them across the top. A filled cell means that person holds the decision." | `bill-breakdown` cards 2–3; `data-readout` tile 4 note · src-01, src-02, src-04 |

**Head:** 69 words (title 8 · dek 11 · hook 25 · primer 25).

**Total budgeted: 1,024 reader-facing words** against the 1,100 ceiling —
76 words of headroom. (Published today: **1,745 words in 6 sections**.) The
row caps above sum to 955; add the head's 69 and roughly **27 words of `source`
labels** across nine sections, which `readerWords` also sweeps. Composed at the
caps the issue lands near **1,050**; composed at the sketches in §8a it lands
near **990**. The caps are ceilings, not targets.

**Words before the first graphic: 77.** Ceiling 80. Published today: **145**.
The arithmetic, because it is easy to get wrong — `check-prose.mjs` counts the
head **plus section 1's eyebrow, title and intro**, and stops there only
because section 1 is visual. So: title 8 + dek 11 + hook 25 + primer 25 = 69,
plus row 1's eyebrow (≤ 2) and title (≤ 6) = **77**. **Row 1 carries no
`intro`** — if the drafter adds one, this floor breaks immediately. The eyebrow
and the title are the intro.

**Floors check.**

| Floor | This spine | Verdict |
|---|---|---|
| ≥ 6 in 10 sections visual | **6 of 9 = 67%** — rows 1, 2, 4, 6, 8, 9 | ✅ (floor 60%) |
| Never two text-only adjacent | **V V T V T V T V V** — rows 3, 5, 7 are the only text-only ones, each between two visuals | ✅ |
| First section a graphic | Row 1 is `you-think`, not in `TEXT_ONLY` | ✅ |
| ≤ 3 `prose` sections of ≤ 200 words | **0** | ✅ |
| ≤ 1 `paradox` | **0** (cut — §8c) | ✅ |
| ≤ 1,100 reader-facing words | **1,024 budgeted** | ✅ |
| ≤ 80 words before the first graphic | **77** | ✅ |
| ≤ 12 distinct names | **11 real names** (§7); see the boxed heuristic caveat there | ⚠️ read §7 |
| ≥ 1 kind outside the six workhorses | **5** — `you-think`, `jargon-buster`, `bill-breakdown`, `three-steps`, `bill-passage`, `power-matrix` (six, in fact) | ✅ |
| `timeline` ≤ 6 events, notes ≤ 20 words | 6 events; three notes ≤ 10 words, the last ≤ 18 | ✅ |
| Annotations ≤ 12 words | 2 annotations, both ≤ 12 | ✅ |
| ≤ 3 loud sections; no two WebGL adjacent; ≤ 1 `bleed` per act | **0 loud** — no WebGL, no `bleed`, no `split`; one `wide` on the hero. `bill-passage` is CSS-3D, not WebGL, and sits at `layout: default` | ✅ |
| CANON §3 section count 6–12 | **9** | ✅ |

**The text-only arithmetic, spelled out, because it is the trap on this
issue.** `jargon-buster` and `three-steps` are the plan's own prescription for
statute-dense material (REGISTER-PLAN §8.1 names both), and **both sit in
`TEXT_ONLY` in `scripts/check-prose.mjs`, exactly like `prose`.** Replacing the
published `prose` and `paradox` with those two halves the words and buys **zero**
visual share. That is why the visual count was planned first: six drawable
beats exist in this record, so the spine is nine rows, not eight and not ten. A
fourth text-only row would drop the share to 60% exactly at nine rows and below
it at any smaller count. Do not add one.

**Two published kinds that are already visual, and were being counted wrongly.**
`bill-breakdown` and `data-readout` are **not** in `TEXT_ONLY`. The published
issue's 3-of-6 visual share comes from `paradox`, `quote` and `prose` alone.
Cutting `paradox` and `prose` and adding four visual rows is what moves the
share, not re-kinding anything that was already drawing.

**How-to-read panels: none authored, anywhere.** Checked against `NEEDS_HOW` in
`src/lib/explainers.ts`: none of `you-think`, `timeline`, `jargon-buster`,
`bill-breakdown`, `three-steps`, `bill-passage`, `quote`, `data-readout` or
`power-matrix` is in it. Under RG-19 no panel renders. Do not author one — the
published issue authors none either, so this is a floor held, not a change.

**`plain` lines: one authored, on the hero.** `EXPLAIN['power-matrix'].what`
reads "A grid of institutions against parties" — the columns here are the
people in one application, not parties, so the default would misdescribe the
form. Every other visual row takes its default. The three narrative rows take
none. The source renders on every section as the second line of that paragraph,
from `core/Section.astro`.

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** One kind in
this spine carries the slot (`timeline`) and it is used twice. Both ≤ 12 words.

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 2 `timeline` | `"Apr 2014"` | **"The right the 2026 Amendment deletes begins here."** (8 w) | Puts the whole argument on the first mark. The reader learns in one line that the thing removed was not new and was not small. |
| 2 `timeline` | the **last event's `date` string**, matched verbatim | **"Twelve years on, a board recommends and a magistrate issues."** (10 w) | The honest statement of where the decision landed, on the mark where it landed. Not "erases", not "overruled" — the two verbs the published issue used and its sources do not support (§8e). |

`bill-breakdown`, `bill-passage`, `data-readout` and `power-matrix` are **not**
in the eight annotation-enabled kinds, so their findings ride the section title
and the caption.

**Rhetorical jobs (3 of the eight, `_voice-core.md` §7).**

| Job | Rows | Note |
|---|---|---|
| CONVERSATIONAL EXPLAINER | 1, 3, 5, 8, 9 | **Five of nine — above the "at least half" floor.** The default job, and the right one for a statute a reader has never read. |
| CALM-STRUCTURAL | 2, 6, 7 | The record, the passage, the voices. The connective is written, the conclusion is not. This is Ravish Kumar's register, and it is the whole editorial answer to a subject that invites heat. |
| FORENSIC | 4 | The statute itself, two short sentences at a time, every term glossed before it is used (row 3 does the glossing). |
| SATIRICAL EXPOSURE | **none** | The contract sets it to **0 on the politics desk**. Nothing in this spine reaches for it, and the published `paradox` — the only section written anywhere near it — is cut (§8c). |
| DRY WIT | **none** | On a law about who legally exists, one deadpan sentence reads as a joke about people. Not a close call. |
| LYRICAL COMPRESSION | **none recommended** | The ration is one paragraph an issue. Spending it here would put the writer's feeling where the record should be. If the operator wants it spent, row 9's caption is the only defensible site. |

**The one binary reframe.** Tell 2 / tell 19 ration the "it is not X, it is Y"
shape to **one per issue**. It is spent structurally, in row 1's `you-think`
panels, because that opposition is the component's own form rather than a
rhetorical move. The drafter must **not** reach for the shape again — not in
the title, not in the hook, not in row 4's intro, not in row 9's caption.

**Punctuation.** Zero em-dashes and zero semicolons anywhere in the issue
(contract §6, tells 1 and 18). The published file carries several of both.

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **"Who decides your gender in law moved *twice*"** (8 words; accent word
  `*twice*`)
  - Retires **"The *Protection* That Erases"** on three counts. It is the
    retired "The ‹Noun› That ‹Verb›s" construction (tell 7). It names the
    subject rather than the finding. And "erases" is an editorial verb doing
    argumentative work: the sources establish that the definition was narrowed,
    that categories were removed from the Act's coverage and that Section 4(2)
    was deleted. **No source measures an effect on persons**, which is what
    "erases" asserts. On this subject that gap is not stylistic.
  - "in law" is load-bearing and must survive any trim. Without it the title
    reads as a claim that somebody decides a person's gender, full stop. With
    it, the title says exactly what the record says.
  - "moved twice" is countable and sourced: 2014 (the person) → 2019 (a
    district magistrate's certificate) → 2026 (a medical board's recommendation
    ahead of it). Two moves.
  - Alternates for the operator: *"In 2014 your own word was enough"* (7) ·
    *"A medical board now comes before the certificate"* (8).
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"In 2014 the Supreme Court said you decide your own gender. By March, 5,566 applications had been refused, with no appeal anywhere in the law."** (25 words)
  - The number is published (`data-readout` tile 4, src-02, PRS India, as of
    March 2026) and it is the one a reader can feel: a refusal with nowhere to
    take it. The "you" is the reader, and it is earned rather than borrowed —
    the question the petition puts is whether the State may define who *a
    person* is, which is everyone's question.
  - Published hook: 39 words, no number, no "you", one em-dash.
- **Dek (≤ 14 words):**
  **"In 2014 your word settled it. Now a medical board recommends."** (11 words)
  - Retires **"How a fundamental right became a certificate, then a medical
    verdict."** "Verdict" overstates the record: the Act says the magistrate
    issues the certificate *after examining the recommendation* of a designated
    medical board. A recommendation is not a verdict, and the difference is
    exactly the sort of precision this issue owes its subject.
  - **No Hindi.** See §5.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"In 2014 the Supreme Court said your own word settles your gender. Parliament has since passed two laws. Here is what the second one changed."**
  (25 words, ~148 characters — inside the 80–420 bound.)
  - **The published primer states a fact its sources do not support** and must
    not be carried forward: *"Since then, Parliament has passed three laws all
    called 'Protection.'"* The record shows **two** enacted statutes — the
    Transgender Persons (Protection of Rights) Act, 2019 and the Amendment Act,
    2026. The 2016 Bill was introduced and examined by a standing committee; it
    was never passed as a law (dossier §3, rows 2016 and 2017). See §8e.
  - **Budget note:** the head must total ≤ 69 words for the 80-word floor to
    hold with row 1's chrome. At 8 + 11 + 25 + 25 it is exactly 69, and row 1's
    eyebrow and title take it to 77. There are three words of slack. If the
    drafter wants a longer hook, the primer pays.

## 5. The Indian ground

This issue is Indian throughout and needs no importing: an Indian statute, an
Indian Parliament, an Indian court, an Indian census, and a reader whose own
district magistrate is the office in question.

| Ground | Where it lands | Published / dossier row behind it |
|---|---|---|
| **The district magistrate's office** — the single most familiar institution in Indian administrative life, and the one this law puts in charge | rows 3, 5, 9; dek | `bill-breakdown` cards 2–3; `timeline` event 3 · src-02, src-04 |
| **lakh as the native unit** — "4.87 lakh people counted", "a fine from ₹2 lakh" | rows 4, 8 | `data-readout` tile 1; `bill-breakdown` card 4 · src-02, src-04 (see derivations) |
| **The 2011 census** — a count every Indian reader has been part of, and the only official count this community has | row 8 | `data-readout` tile 1 · src-02 |
| **Lok Sabha and Rajya Sabha on named dates** — the two days, the voice vote, the walkout | rows 2, 6, 7 | `timeline` event 7; `paradox` side 2 · src-05, src-06 |
| **The law's own words for the communities it now covers** — *kinner, hijra, aravani, jogta*, and the Act's term *eunuch* | row 4, card 1 | `bill-breakdown` card 1, verbatim · src-04 |
| **A refusal with no appeal** — the most ordinary Indian administrative experience there is, here written into the statute | rows 5, 8, 9; hook | `data-readout` tile 4 note · src-02 |

**No ₹ conversion is needed: the issue carries no foreign-currency figure.**
Zero `$` across all six published sections. Contract §3 rule 4 has nothing to
convert. The only money in the issue is Indian and already in rupees.

**No Hindi word anywhere in this issue — a decision, not an oversight.** Four
reasons, in order:

1. Politics carries the fewest Hindi words of any desk and **never** a Hindi
   joke (`_voice-core.md` §2). *Yaar / bhai / bro* are barred from this desk
   outright (tell 14).
2. Every place a Hindi word could naturally sit in this issue is next to a
   statute, a section number, a date or a count — the precision layer, where §2
   forbids it regardless of desk.
3. The subject is a minority's legal recognition. Warmth in the register reads
   as levity about the thing being removed, and the register's own answer to
   heat is flatness.
4. **The statutory list is not the issue's Hindi and must not be treated as
   flavour.** *kinner, hijra, aravani, jogta* appear on row 4's first card
   because **the Act names them as the categories it now covers**. They are a
   verbatim quotation of the law, set roman, never italic, never glossed
   warmly, never used again elsewhere in the issue as register vocabulary. The
   Act's fifth term, *eunuch*, is offensive in ordinary Indian English and is
   carried **only** because it is the statute's own word: the card must make
   plain that it is quoting the Act, and the word appears exactly once.

**Derivations used** (arithmetic or notation applied to the issue's own
numbers — no new fact, no new source, but listed so the operator can rule):

1. **"4.87 lakh"** = 4,87,803 to two decimals in the unit the reader counts in.
   A unit conversion of the published tile value, which stays the primary form.
   Used in row 8's tile note and row 4 if needed.
2. **"fewer than 5 in 100"** = the published `<5%`, restated. The attribution
   ("activists' estimate") travels with it every time. Not a new number.
3. **"two days"** = 24 March → 25 March, the two sitting days on which the two
   Houses passed it. Already implicit in the published timeline's "Mar 24–25
   2026" entry.
4. **"₹2 lakh" / "₹5 lakh"** = the published "Rs 2 lakh" / "Rs 5 lakh" re-set
   with the rupee symbol. Same numbers, house notation.
5. **"eleven days" / "seventeen days"** — 13 March → 24 March (introduction to
   the Lok Sabha vote) and 13 March → 30 March (introduction to assent). Both
   depend on ruling 2, because the 13 March introduction date is in the dossier
   and in `sources[]` (src-01, PRS) but **has never been on the page**. Neither
   figure is required by the spine; row 6's caption is composed without them.

**Two derivations that are FORBIDDEN, named so the drafter does not compute
them:**

6. **Any percentage combining the certificate figures with the rejection
   figure.** 5,566 ÷ 24,000 looks like a refusal rate and is not one: the
   applications and issuances are **as of late 2023** and the rejections are
   **as of March 2026** (dossier §9 notes 9 and the §4 rows). Different
   denominators, different dates.
7. **15,800 ÷ 4,87,803 = 3.2%.** A late-2023 numerator over a 2011 denominator,
   presented as harder than the sourced estimate it would replace. The
   activists' `<5%` is the record's own version of this comparison, it is
   attributed, and it is what the issue uses.

**Not used, deliberately.** No population-of-a-city comparison for 4.87 lakh,
no "a stadium full of people", no per-district average. Every one of them would
add a fact `sources[]` does not carry, and a composer does not add sources.

## 6. The three questions

What the issue must teach. Written from the dossier and the published record,
not from any draft; the reader panel answers them from the draft alone. If the
draft cannot teach these, the draft is wrong.

1. **Q:** Before 2019 who decided a person's gender in law, and who decides
   now?
   · **A:** In 2014 the Supreme Court held in *National Legal Services
   Authority v. Union of India* that a person's self-perceived gender identity
   is protected under Articles 14, 15, 19 and 21, and that surgery or medical
   certification cannot be made a precondition. The 2019 Act kept a "right to
   self-perceived gender identity" in Section 4(2) but routed recognition
   through a district magistrate's certificate, with proof of surgery needed
   for a male or female certificate. The 2026 Amendment deletes Section 4(2)
   and conditions the magistrate's certificate on a designated medical board's
   recommendation.
   · rows 1, 2, 4, 5, 9 · `timeline` events 1 and 3, `bill-breakdown` cards 2
   and 3, dossier §4 NALSA holding, 2019 Sections 4(2)/6/7, 2026 deletion and
   medical board · src-01, src-02, src-03, src-04, src-12.
   · Answerable from a **drawn graphic** (the hero, backed by the timeline).
2. **Q:** After the 2026 Amendment, who is covered by the Act and who is not?
   · **A:** Two categories only. People with recognised socio-cultural
   identities, which the Act lists as *kinner, hijra, aravani, jogta* and
   *eunuch*; and people with medically recognised intersex variations in
   primary sexual characteristics, genitalia, chromosomal patterns, gonadal
   development or hormone production. Trans-men, trans-women whatever their
   surgery status, and genderqueer persons are no longer covered. The Bill's
   own statement of purpose excludes "persons with different sexual
   orientations or self-perceived sexual identities".
   · rows 3, 4 · `bill-breakdown` card 1 and its bullets, dossier §4 definition
   rows · src-01, src-02, src-04.
   · Answerable from a **drawn graphic** (the card stack) plus row 3's glosses.
3. **Q:** How many people has the certificate system actually reached, and what
   happens if it refuses you?
   · **A:** The only official count of the community is the 2011 census figure
   of 4,87,803 people recorded as "other", and there has been no later one. The
   national portal had taken more than 24,000 applications and issued about
   15,800 certificates as of late 2023. As of March 2026, 5,566 applications
   had been refused, and neither the 2019 Act nor the 2026 Amendment provides
   an appeal. Activists put the share of the community holding any ID under 5%.
   · rows 5, 8, 9 · `data-readout` tiles 1–5, dossier §4 certificate rows ·
   src-02, src-13.
   · Answerable from a **drawn graphic** (the tiles, and the hero's empty
   bottom row).

**Two panel-answer standards worth stating**, because both are places a draft
can go wrong while sounding right:

- The certificate figures must be answerable **with their dates attached**. A
  panel answer of "15,800 certificates" is a pass; "15,800 certificates today"
  is a defect, because the figure is as of late 2023 (dossier §9 note 9).
- The medical board's role must be answerable as **"recommends"**, not
  "examines you" and not "decides". The Act as reported says the magistrate
  issues the certificate after examining *the board's recommendation*. Nothing
  in the record says what the board does to form it. A draft that says the
  board examines the applicant has invented a procedure.

## 7. Names

Eleven. Ceiling is 12, and the spare slot is reserved for ruling 5.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **Supreme Court** | the court that ruled in 2014, appointed the committee in 2025, and now holds the challenge | rows 1, 2, 6; head |
| ***National Legal Services Authority v. Union of India*** | the 2014 judgment, named once in full and then "the 2014 judgment" | row 2, first event note |
| **Transgender Persons (Protection of Rights) Act, 2019** | the law being amended, named once in full and then "the Act" | row 4, card 2 |
| **Lok Sabha** | the lower house, which passed it on 24 March | rows 6, 7 |
| **Rajya Sabha** | the upper house, which passed it the next day and refused the referral | row 6 |
| **Virendra Kumar** | the Union Social Justice Minister who moved the Bill and stated its purpose | row 7 attribution |
| **T. Sumathy** | the DMK MP who answered him in the same debate | row 7 followup |
| **DMK** | the party that moved to send the Bill to a select committee | rows 6, 7 |
| **Kalki Subramanium** | one of two members who resigned from the government's own transgender council that week | row 7 followup |
| **National Council of Transgender Persons** | the government's advisory council, named once and then "the council" | row 7 followup |
| **Rajasthan High Court** | the court that published criticism of the new law and then deleted it | row 2, last event note |

**Described, not named** (all currently named in the published issue):
Justice Asha Menon → "a committee the Supreme Court had appointed"; Justice
Arun Monga → the court alone, not the judge; President Droupadi Murmu →
"presidential assent"; Rituparna Neog → "one of two members who resigned";
Laxmi Narayan Tripathi and Zainab Javid Patel → "two members of that same
council"; the Ministry of Social Justice and Empowerment → "the social justice
ministry", lower case; the National Portal for Transgender Persons → "the
national portal", lower case; *Jane Kaushik v. Union of India* → "a 2025 order";
*Ganga Kumari v. State of Rajasthan* → not referenced at all; the UN Human
Rights Office → not referenced at all (ruling 5); INC, TMC, SP, RJD, NCP and
SS-UBT → "the opposition walked out"; Dr. Aqsa Shaikh, Jothimani and Manoj
Kumar Jha → not quoted (the three voices are fixed at row 7).

**Roles, written lower case, because they are offices and not names:** district
magistrate · chief medical officer · medical board · select committee ·
standing committee · national portal · the census. This is register-correct
plain Indian English *and* it keeps the gate's capitalisation heuristic off
twelve phrases that are not names. It is not gaming the gate: "a district
magistrate" is how the reader says it.

> **Read this before reacting to a NAMES flag.** `check-prose.mjs` finds names
> with a capitalisation heuristic, and this is the most statute-dense issue in
> the backlist. On top of the eleven above it will count **"Section"**,
> **"Articles"**, **"Amendment"**, **"Act"**, **"Bill"**, **"Protection"**,
> **"Rights"**, **"Transgender Persons"**, **"Centre"**, **"State"**,
> **"Council"**, **"Union Social Justice Minister"** and every fragment of the
> statute's title it can join into a sequence. Expect a reported figure
> somewhere between **25 and 40**, against eleven real names. `India` and
> `Indian` are in the stop list; `Parliament`, `Constitution`, `Minister` and
> `MP` are too, which helps. **Do not cut a real name to chase the number.**
> The published issue reported 55 with roughly the same heuristic; the honest
> comparison for the operator is eleven against a published count that was
> genuinely far higher, not the two heuristic outputs against each other.

**Source lines only, never inside a sentence** (rule 9): PRS India · The Print ·
The Wire · the 2011 census.

## 8. Composer notes

### 8a. What carries over, and what changes — the published-section fate table

Component `data` is expensive and already verified, so the rewrite reuses it
wherever the register allows. Every number in this table is **copied, not
retyped** (contract rule 13).

| Published section | Verdict | Detail |
|---|---|---|
| `timeline` | **carried, 8 → 6 events, gains `annotations[]`** | Every surviving `date` string and `state` value is unchanged. Labels and notes are re-registered: the published notes run 28–50 words each against a ≤ 20-word cap, and three of them are three sentences long. **Surviving events:** Apr 2014 (`key`) · 2016–2017 · Nov 26 2019 · 2020 · Oct 2025 · the final March 2026 entry (`now`). **Cut:** "Mar 20 2026" (the committee's withdrawal request moves to row 6's intro, which is where it belongs, beside the vote it preceded) and "Mar 24–25 2026" (row 6 draws it, stage by stage). The published "Mar 30 2026" entry absorbs the assent and the challenge and becomes the `now` event. **Two required fixes resolved here by deletion, not by patching:** the "Two days later" error (required fix 1 — the clause is gone, and the surviving note says "then deleted it", which carries no interval) and "No division vote recorded" (required fix 2 — never asserted anywhere in this spine; see §8b). `source: { label: "PRS India" }` stays, and the section gains `sourceRefs[]`. |
| `bill-breakdown` | **carried, all 4 cards, bodies cut by roughly 70%** | The four changes, their order, their `label` strings and `primary: true` on Change 02 all stay. Every fact survives. What goes is length: the published bodies run 46–77 words each, against ≤ 22 here, and card 1 drops from two bullets to one. **The intro is rewritten**: "It removed an entire category of persons from legal existence under the Act" is the verification's own optional improvement, never applied — "from legal existence" is a consequence the sources do not establish, and the report offered "from the Act's coverage" as the neutral form. Take it. The statutory category list on card 1 is carried **verbatim** (§5). |
| `paradox` | **cut** | Four reasons, any one sufficient. (1) It is `TEXT_ONLY` and the issue cannot reach 60% visual carrying it. (2) Its title, **"Built by the court. *Overruled* by Parliament."**, asserts that Parliament overruled the Supreme Court. Whether an ordinary statute can override a holding under Articles 14, 15, 19 and 21 is **the precise question now before that court** in the pending petition. The issue cannot state the answer as a section title. (3) Its intro carries required fix 3, "The tension is structural, not rhetorical" — meta-commentary telling the reader how to read. (4) The catalog's USE WHEN is "two facts **both true**, pulling opposite ways". These two are a *sequence*, not a tension: the court held, then Parliament amended. A sequence is what `timeline` and `bill-passage` are for, and both draw it. **Every fact survives:** the committee's withdrawal request → row 6's intro; the seven absent secretaries → row 6's intro; the rejected select-committee referral → row 6, stage 3; NALSA's holding → row 2's first event and its annotation. |
| `quote` | **carried; all three voices, quote text verbatim** | `data.quote` (21 words, the minister) is unchanged character for character. Inside `followup`, T. Sumathy's 12 words and Kalki Subramanium's 30 words are unchanged character for character. What changes: the `intro` drops 33 → ≤ 14 words; the attributions are re-set to the house form; and **Rituparna Neog's name is removed**, replaced by "one of two members who resigned" — which keeps the fact, saves a names slot, and makes the verification's minor gap about her placement moot. It moves from section 4 to row 7 and is no longer adjacent to another text-only row. **The section has no `source` today**, against CANON §7, and must gain one plus `sourceRefs: [src-05, src-06, src-08]`. |
| `data-readout` | **carried, all 5 tiles, `value` strings verbatim** | `4,87,803` · `24,000+` · `15,800` · `5,566` · `<5%` are copied character for character, and `accent: true` stays on tiles 3 and 4. Labels and notes are re-registered to ≤ 6 and ≤ 10 words (the published notes run 12–20 and one is two sentences). Tile 3's note keeps the published comparison in the published form, "about 15,800 of 24,000+ applications", which is the only ratio this issue is allowed to state (§5, D6/D7). Tile 4's note keeps "neither law gives you an appeal", which is the fact the hero's empty bottom row draws. |
| `prose` | **cut** | The three-paragraph closer, ~330 words, is the single heaviest block in the backlist and the reason the issue closes on text. It does not split cleanly the way the cockroach prose did, because it is not a mechanism — it is four separate aftermath events. So each is placed or cut on its own merits: the Supreme Court petition → row 2's last event label ("and is challenged"), with the 886-page detail a ruling (ruling 4); the Rajasthan High Court epilogue → row 2's last event note, compressed to ≤ 18 words and **stating only the sequence, never quoting the deleted text** (dossier §9 note 6 requires any quotation to be attributed to reporting *about* the order, and eighteen words cannot carry that caveat); the UN Human Rights Office statement → **cut** (ruling 5); the 140 lawyers who wrote to the President → **cut**. `skimCaption` goes with the section: that field applies to `kind: prose` only and renders only in Skim mode anyway (contract rule 5). |
| `sources[]` | **all fifteen, unchanged** | Slug `2026-05-02-transgender-ratchet` unchanged; the URL does not move. **One orphan after the cuts: src-09 (The Wire, the UN statement)**, which is the whole of ruling 5's cost. src-11 and src-15 stay anchored because row 2's last event note keeps the epilogue sequence. No section carries `sourceRefs[]` today; every row in the new spine should. |
| head | **rewritten** | New title, hook, dek, primer (§4). `id`, `topic`, `publishedAt: 2026-05-02`, `status: published` and `tags` all unchanged. `readTimeMinutes` **7 → 4**. |
| MDX body | **gains an `# EDITOR NOTES` block** | The published body is the scaffold comment only — this issue carries **no** editor guardrails today, which on this subject is the gap worth closing. §8b is what the new block must say. |
| `story` block | **not present, nothing to remap** | The published frontmatter has no `story:` field, so there are no `story.beats[].section` 0-based indices to repoint. Story mode derives from `KIND_PRIORITY` and `TRIM`. This rewrite reorders and re-kinds freely without the silent-repointing hazard that the cockroach and delimitation rewrites had to manage. |

**Two of the three required fixes are resolved by composition, not by patching
prose:** the "Two days later" misdating (the clause is deleted) and the
unflagged use of the [UNVERIFIED] "No division vote recorded" claim (never
asserted). The third, the paradox's meta-commentary sentence, goes with the
section. **All three close.**

### 8b. The standing constraints, and the rows they bind

The published MDX body carries no guardrail block. These eight are extracted
from the dossier's §9 researcher notes and the verification report, and the new
`# EDITOR NOTES` block must carry all of them. They bind the draft absolutely.

1. **Never assert the absence of a division vote.** Dossier §9 note 2 marks it
   [UNVERIFIED against Sansad.in]; the verification made flagging it required
   fix 2 and it is still unflagged in the published file. **Binds row 6 and
   row 2.** The permitted formulation is the one three allowlist sources
   support: *passed by voice vote*. Nothing about divisions, counts, tallies or
   their absence, anywhere.
2. **Never say the medical board examines the applicant.** The record says the
   magistrate issues the certificate "after examining the recommendation of a
   designated medical board". How the board forms that recommendation is not in
   any source. **Binds rows 3, 4, 5 and 9, and the dek and hook.** The verbs
   are *recommends* (the board) and *issues or refuses* (the magistrate).
3. **The 2026 Amendment's own clause numbers are never stated.** Dossier §9
   note 1: the Bill text PDF would not parse, and "section numbers in the 2026
   Amendment itself may differ". **Binds row 4.** "Section 4(2)" may be stated
   once, and only as a section of the **2019 parent Act**, which PRS and two
   allowlist secondaries confirm.
4. **NALSA's exact date is never stated.** Dossier §9 note 5: April 15, 2014 is
   derived from general reference and is [UNVERIFIED]. **Binds row 2.** The
   `date` string stays "Apr 2014", exactly as published.
5. **The deleted epilogue is reported as a sequence, never quoted.** Dossier §9
   note 6: Justice Monga's language survives only in reporting about an order
   that no longer contains it. **Binds row 2's last event note.** State that the
   court published criticism and then deleted it as "included by mistake" — the
   court's own reported reason, in quotation marks. Do not reproduce "a
   contingent, state-mediated entitlement" or "selfhood is not a matter of
   concession" anywhere.
6. **The Supreme Court has not responded to the petition.** Dossier §9 note 4.
   **Binds row 2's last event and ruling 4.** "Challenged" is the ceiling.
   Nothing about listing, admission, notice or a stay.
7. **The certificate figures always travel with their dates.** 24,000+ and
   15,800 are **as of late 2023**; 5,566 is **as of March 2026**; 4,87,803 is
   **2011**. **Binds row 8 and the hook.** They are never combined (§5, D6/D7)
   and never presented as current.
8. **No figure above 4.87 lakh is used as a population.** Dossier §9 note 8:
   activists' estimates of the community's true size are not primary-sourced.
   **Binds row 8.** The census figure is described as the only official count,
   which is what the source says, and not as the true size.

### 8c. What is cut, and why

1. **The `prose` closer (~330 words).** It is the largest single cause of every
   measured defect: the word count, the 50% visual share and the text-only
   close. Its four aftermath events are placed or cut individually in §8a
   rather than compressed, because compressing four unrelated events into one
   short paragraph produces exactly the stacked-citation sentence tell 9
   forbids.
2. **The `paradox`.** Four reasons in §8a. The one worth restating: its title
   asserts the answer to the question now before the Supreme Court.
3. **Where the two governing documents disagree.** The 2026-05-02 verification
   predates `_voice-core.md` v2 by four months and **approves two things the
   contract now forbids**: the hook's directional framing is marked ✅
   ACCEPTABLE "per benchmark issue" — a benchmark set by issues the plan has
   since ruled are not a voice reference (AGENTS.md §10) — and the report
   treats the published title as a non-issue, while tell 7 retires the
   construction outright. **The contract is the newer document and Rule 0 says
   the register outranks the mode, so the contract governs.** The verification's
   *factual* findings are followed to the letter; its *voice* findings are
   followed where they are stricter than the contract and superseded where they
   are looser. Nothing factual is overridden.
4. **Two names inside `data`.** Rituparna Neog in the `quote` followup and
   Justice Arun Monga in the prose: each appears once, which rule 9 says is a
   name to cut. Both facts survive with a role phrase.
5. **The UN Human Rights Office statement and the 140 lawyers.** Ruling 5. Both
   are reactions to the law, not parts of how it works, and the issue already
   carries three Indian critical voices plus a court's deleted criticism.
6. **The published hook's "while the name 'Protection' stayed constant".** The
   observation is true and sourced, and it survives — as row 1's `note`, which
   is nine words instead of a clause inside a 39-word hook.

### 8d. Kinds I wanted and could not use

- **`number-sense`** for 4,87,803. This is the one I most wanted, and it is the
  only one blocked by something no ruling can unblock. Its `equals[]` field
  needs everyday equivalents, and **neither the published issue nor the dossier
  carries a single one** — no city population, no comparable count, nothing the
  reader can hold 4.87 lakh against. Unlike the cockroach issue, where the
  comparison sat in the dossier bibliography waiting for a ruling, here it does
  not exist in the record at all. Supplying one would be adding a fact, which a
  rewrite may not do. The honest home for the number is row 8's tile, and the
  lakh conversion (D1) is the only feel available.
- **`comparison`** for the 2019 Act against the 2026 Amendment, column by
  column. The obvious kind, and wrong twice: `comparison` is in `TEXT_ONLY`, so
  it would be a fourth text-only row and break the visual floor outright; and
  the read-across it offers is the same read-across `bill-breakdown` already
  gives, card by card, while drawing. If the operator wants the side-by-side
  shape, the answer is a second `power-matrix`, not a `comparison`, and the
  one-hero rule says no.
- **`power-matrix` a second time**, with the three regimes (2014 · 2019 · 2026)
  as columns. This was my first instinct for the hero and it is a **catalog
  violation**: `power-matrix`'s DON'T USE routes "control changing over time" to
  `timeline`, which is exactly what three dated regimes are. The hero is
  composed as a snapshot of the law as it stands, and the movement stays on the
  timeline where the catalog puts it.
- **`vote-result`** for the passage. Blocked by the record itself: both Houses
  passed by voice vote and the dossier forbids representing any numeric count
  (§9 note 2). The kind needs `for`, `against`, `required`, `present` and
  `shortfall`. None exists. This is the clearest case in the backlist of a kind
  being unavailable because the *event* produced no data, not because the
  research missed it. `bill-passage` is the honest form.
- **`vote-flow`** for the walkout. Needs `blocs[].seats` and a vote per bloc.
  The record names seven opposition parties and says they walked out. No seat
  counts, no votes. A walkout is precisely the absence of the data this kind
  draws.
- **`attrition-waffle`** for the certificate funnel. It needs groups summing to
  exactly **100** with a real n, and the build throws on a bad sum. Here the
  numerator (15,800 issued, late 2023), the denominator (24,000+ applications,
  late 2023) and the rejections (5,566, March 2026) come from **two different
  dates**, and 15,800 + 5,566 does not reconcile to 24,000+ in any honest way.
  Normalising them to 100 would manufacture a refusal rate the record does not
  contain. This is the single most tempting wrong graphic in the issue.
- **`bill-funnel`** for the three legislative cycles. It draws a *population*
  of bills surviving procedural stages. One bill is not a population.
- **`power-flow`** for the certificate route. The right instinct, the wrong
  kind: it needs a value on every link and runs a build-time conservation check.
  Nothing quantitative flows from an applicant to a magistrate. `three-steps`
  is the honest form, and the hero shows where the authority sits.
- **`analogy`** (pairs form) for "a right that became a certificate". Declined
  on two grounds. It would be a fourth text-only row, which breaks the visual
  floor; and on this material any this ↔ that mapping risks comparing a
  minority's legal recognition to an everyday convenience, which is the tonal
  failure this desk cannot afford. The mappings the issue needs are the three
  `jargon-buster` glosses, sitting next to the law, in the precision layer.
- **`seat-chart`, `chamber`, `coalition-orbit`, `margin-ladder`.** No seats, no
  division, no party arithmetic anywhere in this issue.
- **`act-break`.** Composed **without** them, consistent with RG-06 as settled
  on the delimitation and cockroach storyboards. For the record: with three
  text-only rows in nine there are two adjacency-safe slots, before row 4 and
  before row 8, and the second is the real pivot (from what the law says to what
  the system it replaces actually did). If the act rule ever returns, that is
  where it goes.

### 8e. What the published issue asserts beyond its sources

Named here rather than carried forward, as the brief requires. **None of these
is a sourcing failure by the researcher** — every one is a characterisation
added at the drafting stage, and each is retired by a composition decision
above.

1. **The title, "The *Protection* That Erases".** "Erases" asserts an effect on
   persons. The sources establish that the definition was narrowed, that named
   categories were removed from the Act's coverage, and that Section 4(2) was
   deleted. No source in the fifteen measures an outcome for any person. The
   verb also does the argumentative work the section stack should do. **Retired
   in §4.**
2. **The primer's "Parliament has passed three laws all called 'Protection.'"**
   **This is factually unsupported**, not merely strong. The record shows two
   enacted statutes: the 2019 Act and the 2026 Amendment Act. The 2016 Bill was
   introduced and examined by a standing committee, and the government did not
   accept the committee's report (dossier §3, 2016 and 2017 rows). Three
   legislative *cycles* is the supported claim and is what the new head says.
   **Corrected in §4.** This one should be checked against the published file by
   the operator directly: it is the kind of error that survives a claim-by-claim
   verification because no single row in the report is about the count.
3. **The `paradox` title, "Built by the court. *Overruled* by Parliament."**
   "Overruled" is a legal term with a specific meaning, and whether ordinary
   legislation can override a holding under Articles 14, 15, 19 and 21 is the
   exact question in the pending petition. The issue cannot answer it in a
   section title. **Section cut (§8a).**
4. **The `paradox` closing line, "The Amendment now operates under the
   authority of the Constitution the same court enforces."** A rhetorical
   construction, not a sourced claim. **Cut with the section.**
5. **The `bill-breakdown` intro, "removed an entire category of persons from
   legal existence under the Act".** The verification flagged it as
   ⚠️ META-COMMENTARY and offered the neutral form. Removal from an Act's
   coverage is the sourced fact; removal from "legal existence" is not.
   **Rewritten (§8a).**
6. **The `data-readout` title, "The 2019 Act had already *failed* to reach the
   community."** "Failed" is a verdict. The figures are the finding and they are
   stronger stated plainly. **Retitled to what the numbers say.**
7. **The dek's "then a medical verdict".** The board recommends. **Retired in
   §4.**
8. **The `paradox` intro's "The tension is structural, not rhetorical."**
   Required fix 3, still open in the published file. **Cut with the section.**

**One error in the dossier itself, flagged so the drafter never copies it.**
Dossier §2's opening sentence says the Act "received presidential assent on
March 30, 2026, **six days after** its introduction in Lok Sabha on March 13".
March 13 to March 30 is **seventeen** days; six is the gap from the Lok Sabha
vote on 24 March to assent. The published issue never repeats the error — it
carries no introduction-to-assent interval at all — and neither does this spine
(§5, D5). **Do not use "six days" in any form.**

### 8f. Re-anchoring: my judgement is **a narrow pass is warranted, and the issue can ship without it**

This is the opposite call from the cockroach rewrite, and the reason is the
allowlist.

**The dossier carries the same stale allowlist assumption the cockroach
verifier found, in two places, plus a third that is simply undone.** Checked
against `research/_sources/politics.md` as it stands today:

| The dossier says | The allowlist says | Effect |
|---|---|---|
| §9 note 5: NALSA "is not on an allowlist domain in its original form (indiankanoon.org is not on the allowlist)" | **`sci.gov.in` — Supreme Court of India, Judgments — T0, open, ingest: full**, and **Supreme Court Landmark Judgment Summaries — T6, open, ingest: full.** Both are in the WebFetch allow list. | True about indiankanoon, **wrong about the Supreme Court's own archive**, which carries the judgment twice over. The issue's founding legal claim is sourced entirely to newspapers and PRS summaries. |
| §9 note 1: the Bill text and the Issues PDF "not fully parseable"; the drafter is told to download the PDF | **`indiacode.nic.in` — India Code, the legislation repository — T0, open, ingest: full**, focus "bare acts, central + state legislation, **amendments**". In the WebFetch allow list. | Never considered. India Code is the canonical home of the Act as amended, and it is where "Section 4(2)" would stop being a claim about a newspaper's summary. |
| §9 note 2: "Sansad.in was not directly fetched" | **`sansad.in/ls` and `sansad.in/rs` — T0, open, ingest: full**, focus includes "vote records" and "divisions". | Not a stale assumption, just undone. It is why required fix 2 exists. |

**That is the Arsenal condition in its first form** — a primary that was
available and was treated as unavailable — and on statute-dense material it is
worth a great deal. Three fetches (India Code for the Act as amended,
`sci.gov.in` for NALSA, `sansad.in` for 24–25 March) would move this issue from
"sourced to PRS and two newspapers" to "sourced to the statute, the judgment and
the House record". On an issue about a minority's legal status, that is a
materially better footing than any wording change can buy.

**But it is a research job, not a composition failure, and it adds sources —
which a rewrite may not do.** So the operator commissions it or does not, and
this spine is composed to be correct either way:

- **Every claim that depends on an unfetched primary has been removed or
  bounded.** "No division vote recorded" is never asserted (§8b.1). The 2026
  Amendment's own clause numbers are never stated (§8b.3). NALSA's exact date is
  never stated (§8b.4). "Section 4(2)" is stated once, as a section of the 2019
  parent Act, which PRS and two allowlist secondaries independently confirm.
- **Nothing in this issue is contradicted by its cited source**, which was the
  Arsenal pass's second trigger (28.5 against Opta's own 28.3). I checked every
  number: the five `data-readout` values, the four penalty figures, the three
  dates and the two section references all match the dossier §4 rows exactly.
  The verification found the same, with two ⚠️ IMPRECISE date-arithmetic notes
  and no contradictions.
- **No figure here is weak by authorship in the Arsenal sense.** There are no
  interpolated points, no modelled series, no illustrative values. Every number
  is a published count.

**And the standard the operator set on the other five — a graphic whose drawn
values are editorial fails the verifier's trace — is met cleanly. I found no
such graphic in this issue.** Every value the published components draw is a
sourced count, date or quotation. No section's caption says SCHEMATIC, no source
line says the values are editorial, and nothing needs cutting or re-kinding on
that ground. **The one figure worth naming is `<5%`** (tile 5), which is an
activists' estimate rather than a count. It is not editorial — it is attributed
and it is the record's own version of a comparison the issue would otherwise
have to compute for itself (§5, D7). It stays, with the attribution travelling
with it every time, and the operator should know it is the softest number on the
page.

**If the operator orders the pass, here is exactly what it would do**, so the
cost is visible: fetch India Code for the Transgender Persons (Protection of
Rights) Act as amended, to confirm the clause numbers and quote the definition
from the statute rather than a summary; fetch `sci.gov.in` for NALSA, to anchor
the 2014 holding and settle the date; fetch `sansad.in` for the 24 and 25 March
proceedings, to close required fix 2 one way or the other. It adds two or three
`sources[]` entries, which means it must run **before** the draft and the
rewrite's "no new sources" rule is relaxed by explicit ruling. **My
recommendation: run it.** This is the one issue in the backlist where a primary
would change what the page can say, and the three URLs are already allowlisted.
But the spine above ships correctly without it, so it is a ruling and not a
blocker.

### 8g. Two gate notes that will fire and are not defects

1. **ℹ CHROME-HEAVY on rows 2, 4, 6 and 8.** `check-prose.mjs` counts any field
   of four or more words as a block and flags above five per section. A
   six-event timeline, a four-card breakdown, a four-stage passage and a
   five-tile readout will always exceed that, because their data *is* many short
   strings. The published issue trips it on three of the same kinds. It is an
   ℹ, not a ⚠️.
2. **⚠️ NAMES will fire hard.** See the boxed note in §7. Eleven real names, a
   capitalisation heuristic, and a statute in every third sentence.
3. **If a Hindi flag fires on row 4's card 1, it is a false positive.**
   *kinner, hijra, aravani, jogta* are a verbatim quotation of the Act's own
   category list, sitting in a `body` field rather than the precision layer, and
   they are the only such words in the issue (§5). They are the law's
   vocabulary, not the register's.

### 8h. Sourcing

Every row should carry `sourceRefs[]` and a section-level `source`. **No section
in the published issue carries `sourceRefs[]` today**, and the `quote` section
carries no `source` at all, against CANON §7's "no source, no section". Coverage
across the new spine: src-01 (rows 2, 4, 5, 6, 9) · src-02 (rows 3, 4, 5, 8, 9) ·
src-03 (rows 2, 3) · src-04 (rows 1, 3, 4, 5, 9) · src-05 (rows 6, 7) · src-06
(rows 6, 7) · src-07 (row 6) · src-08 (row 7) · **src-09 (none — see ruling 5)** ·
src-10 (row 2) · src-11 (row 2) · src-12 (rows 1, 2) · src-13 (row 8) · src-14
(rows 2, 3) · src-15 (row 2). **One orphan of fifteen**, and it is a ruling, not
an oversight.

### 8i. For the operator — seven rulings before the draft

> ## SETTLED — operator ruling, 2026-09-15
>
> **All seven settled as recommended, and the research pass is authorised.**
>
> 1. **RUN THE NARROW RESEARCH PASS FIRST.** The dossier's allowlist
>    assumption is stale in two places: `sci.gov.in` (NALSA) and
>    `indiacode.nic.in` (the bare Acts and amendments) are both T0 on
>    `research/_sources/politics.md`, and `sansad.in` (T0, vote records) was
>    never fetched. The pass writes
>    `research/politics/2026-09-15-transgender-ratchet-re-anchoring.md`. The
>    drafter reads it and uses its attributions. The dossier is NOT edited.
> 2. **The 13 March introduction date stays a bibliography fact**, off the page.
> 3. **The Rajasthan HC epilogue is carried at <= 18 words**, stating only the
>    sequence.
> 4. **The SC petition gets one clause**, not a tile and not a fourth voice.
> 5. **The UN statement is cut.** src-09 is orphaned as a result, and that is
>    accepted: one orphan of fifteen.
> 6. **Hero is the `power-matrix` at `layout: wide`.** The empty bottom row,
>    where neither Act provides an appeal, is the point of the graphic.
> 7. **`readTimeMinutes` 7 -> 4. No `act-break`. No Hindi anywhere.** A new
>    `# EDITOR NOTES` block is written (the file carries none today).
>
> ### The published error this rewrite must not carry forward
>
> The published primer says *"Parliament has passed three laws all called
> 'Protection.'"* **Parliament passed two**: the 2019 Act and the 2026
> Amendment Act. The third was a 2016 Bill that was introduced, went to the
> Standing Committee and lapsed. The issue's own timeline says Parliament
> "introduces a Bill". No verification row ever tested the count, so it
> shipped. The rewritten primer does not restate it in any form.
>
> ### The statutory vocabulary is a quotation, not register Hindi
>
> The Act's own list (*kinner, hijra, aravani, jogta*, and its term *eunuch*)
> is a **verbatim statutory quotation**: set roman, never glossed warmly,
> *eunuch* used once and only because the law uses it. It is not a Hindi word
> under the contract's dial and does not count against the zero-Hindi ruling.


1. **The narrow research pass: run it, or ship without it?** §8f. India Code,
   `sci.gov.in` and `sansad.in` are all on the politics allowlist at T0 and the
   dossier treated two of the three as unavailable. Running the pass adds two or
   three sources, which needs an explicit relaxation of the rewrite's no-new-
   sources rule, and it must run **before** the draft. **My recommendation: run
   it**, because on statute-dense material about a minority's legal status a
   primary is worth more here than on any other issue in the backlist. *Not
   running it* costs nothing in this spine — every claim that would depend on
   those fetches has already been removed or bounded (§8b).
2. **The 13 March introduction date: in or out?** It sits in the dossier §3 and
   is sourced to src-01 (PRS, already in `sources[]`) but **has never been on the
   page**. *In* → `bill-passage` opens with a fourth stage, "Introduced · 13 Mar
   2026", and the issue may say "eleven days to the Lok Sabha vote" (D5).
   *Out* → three stages, and row 6's caption says only "both houses in two days".
   **My recommendation: in.** It is a bill's own starting line, it is in the
   bibliography, and a passage graphic that starts at the vote is missing its
   first card. But it is a ruling because it promotes a bibliography fact to page
   copy.
3. **The Rajasthan High Court epilogue: carried at 18 words, or cut?** Composed
   as **carried**, in row 2's last event note, stating only the sequence and
   quoting only the court's reported reason, "included by mistake". Carrying it
   keeps src-11 and src-15 anchored and keeps the single most arresting fact in
   the record. *Cutting it* orphans two more sources and loses the fact.
   **My recommendation: carry it as composed**, and note the hard constraint —
   the deleted text is **never** quoted (§8b.5), because eighteen words cannot
   carry the "known only from reporting" caveat that the dossier requires.
4. **The Supreme Court petition: one clause, or a tile and a quote?** Composed as
   **one clause** on row 2's last event ("and is challenged"). Two upgrades are
   available and cost words: an "886" tile in row 8 (≈ 19 words, and it makes the
   readout six tiles, still inside the kind's 3–6 range only if another tile
   goes); or the petition's central question as a fourth voice in row 7 (≈ 40
   words verbatim, and it is the best closing line in the record). If the second
   is taken, **T. Sumathy's twelve words are what pays** — she is the only voice
   in the row whose line asserts a motive rather than a fact, and the petition's
   question is the same point put as a question by the people it concerns.
   **My recommendation: one clause as composed**, with the petition's question
   held as the operator's option if the issue reads thin at the close.
5. **The UN Human Rights Office statement: cut, or one clause?** Composed as
   **cut**, which orphans src-09 — the only orphan in fifteen. *In* → one clause
   of about 13 words, and it spends the twelfth and last names slot on a body
   that appears once. **My recommendation: out.** The issue carries three Indian
   critical voices and a court's deleted criticism; an international body's
   opinion is a reaction to the law, not part of how it works, and rule 9 says a
   name used once is a name to cut.
6. **The hero is the `power-matrix` at `layout: wide`, not `split`, and not the
   `timeline`.** Confirm (§2). The `power-matrix` is composed as a **snapshot of
   the law as it stands**, not as three dated regimes, because the catalog's
   DON'T USE routes control-changing-over-time to `timeline`.
7. **`readTimeMinutes` 7 → 4. No `act-break`. No Hindi word anywhere.** Slug,
   `id`, `publishedAt: 2026-05-02`, `status: published`, `tags` and all fifteen
   `sources[]` unchanged. The rewrite replaces
   `src/content/issues/2026-05-02-transgender-ratchet/index.mdx` in place and is
   tabled for the operator's read before it is committed. A new `# EDITOR NOTES`
   block carrying all eight constraints in §8b goes into the MDX body, which
   carries none today.

**The designated slack row is row 7, the `quote`** — but only its `intro` and
its framing words. **Never pays:** the minister's 21 verbatim words, T. Sumathy's
12, Kalki Subramanium's 30, any attribution, any number, or the `jargon-buster`
glosses. If the issue runs over 1,100 after the intros, the event notes and the
captions have been trimmed, stop and report the overrun with the arithmetic
rather than cutting into that list. On this subject the record speaking in its
own words is the thing the issue is for.
