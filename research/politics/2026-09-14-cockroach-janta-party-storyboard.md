# Storyboard: The block that worked in one country

- **Category:** politics
- **Dossier:** `research/politics/2026-06-04-cockroach-janta-party-dossier.md`
  (`Status: ready-for-draft`) — this is a Phase 6 **rewrite** of a published
  issue, so the factual record is three files, not one: the dossier, the
  published `src/content/issues/2026-06-04-cockroach-janta-party/index.mdx`
  with its `sources[]` block (src-01 … src-10), and
  `research/politics/2026-06-04-cockroach-janta-party-verification.md`
  (**APPROVED**, both required fixes confirmed applied). Every fact below is
  already in one of those three. No claim, number, name or source is added.
- **Composed:** 2026-09-14
- **Composer:** composer-agent
- **Status:** approved            ← approved by the operator 2026-09-14; rulings settled in §8h

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
> **REWRITE.** The four measured defects this rewrite exists to fix
> (REGISTER-PLAN §8.1):
> 1. **1,821 reader-facing words in 36 blocks**, against a ≤ 1,100 ceiling —
>    the second-longest of the ten published issues.
> 2. **A run of three text-only sections** (`prose` → `comparison` → `paradox`),
>    the longest text run in the corpus alongside delimitation and kessler.
>    `comparison` counts as text-only in the gate (`scripts/check-prose.mjs`),
>    which is why the published spine measures **3 of 7 visual (43%)** against
>    a 60% floor.
> 3. **The issue opens on a `quote`**, which is text-only. The floor says the
>    first section is a graphic.
> 4. **The title is the retired construction** — "The Ban That Made It
>    *Bigger*" is "The ‹Noun› That ‹Verb›s" (tell 7), and it asserts an
>    amplification the trimmed evidence supports only in its weak form (§8e).
>
> **The verification verdict is a constraint, not background.** The report is
> APPROVED with nine mandatory sensitivity checks passed, two required fixes
> applied and four optional residuals open. Three of those residuals are
> resolved by composition in this spine and are named where they land (§8a).
> The nine guardrails are non-negotiable and are carried forward in §8b.
>
> **Rewrite rules in force** (REGISTER-PLAN §8.1): the slug
> `2026-06-04-cockroach-janta-party` and all ten `sources[]` entries are kept,
> so the URL does not change and the verifier's trace still holds. `id`,
> `topic`, `publishedAt`, `status: published` and `tags` are unchanged;
> `readTimeMinutes` drops 7 → 4. §8 below lists which component `data` carries
> over verbatim and which sections are cut, merged or re-kinded.

---

## 1. The argument in one line

An order under Section 69A can hide an account inside India. It cannot delete
it, cannot reach the servers, and cannot stop it reappearing the next day.

## 2. The hero

**`power-matrix`** (G6 · composition — institutions crossed with actors, each
cell a control state), at `layout: wide`.

It carries the argument because the argument *is* the grid. Everything before
it builds one question: the order was real, it was obeyed, and the account
still existed — so what did it actually reach? The matrix answers in one read.
Five levers down the left (withhold the account inside India · delete the
account · reach the servers and the data · reach followers who already have
the posts · stop a backup handle reappearing), four actors across the top
(the Indian executive · the Indian courts · the US platforms · the account
itself). The executive's column has exactly one filled cell. That single
filled cell is the issue.

It renders the published `comparison`'s own grid — same four actors, same five
levers, cells re-expressed as the component's four-state enum. Dossier §1 and
§9.6 are its basis; the verification traced every cell of the published version
("No invented capability claims").

**`layout: split` is declined.** The hero is the only row permitted it
(CANON §2), and a four-column grid set at half measure loses the read-across
that is the whole point. `wide` gives it the width and keeps the issue at
**zero loud sections**.

**Not the hero, and why: `adoption-curve`.** It is the more striking graphic
and it is hero-capable, but it carries the *outcome* and its series is the
weakest data in the issue. The verification calls its interpolated mid-points
"illustrative, not sourced as hard data", and this spine deletes them (§8a).
An issue should not rest its single hero on the one series its own verifier
flagged. The curve is demoted to a supporting row and told the honest version
of its finding.

## 3. The beats

One row per thing the reader must get, in reading order. 6–9 rows. The first
row after the head is a graphic or a `data-readout`, never prose. No two
text-only rows adjacent. At least six in ten rows visual. ≥ 1 kind from outside
the six workhorses (prose, data-readout, timeline, paradox, quote, comparison).

*For this rewrite the last column cites the published issue's own section and
`sources[]` id, or the dossier §4 row, in place of a fresh dossier reference.*

| # | The reader must get (one line, register) | Data shape | Kind | Hero? | Words around it | Analogy / example | Plain-line sketch | Published row it renders |
|---|---|---|---|---|---|---|---|---|
| 1 | The account was not deleted. It went dark on your phone and on nobody else's. | G2 · belief vs data | `you-think` **[new]** | — | **95** · eyebrow ≤ 2 w · title ≤ 5 w · **no intro** · `think.text` ≤ 24 w · `actually.value` "1 country" · `actually.text` ≤ 26 w · `note` ≤ 16 w · `caption` ≤ 18 w | The reader's own phone: the same account, open in Boston, blank in Bengaluru | omit — `EXPLAIN['you-think'].what` fits | `comparison` rows 1–3; `timeline` 21 May note; `data-readout` tile 2 · src-03, src-04 |
| 2 | A judge said "cockroaches" in open court. The next day he said he had been misquoted. That is where the name came from. | G1 · narrative (text-only) | `quote` **[carried, data verbatim]** | — | **174** · eyebrow ≤ 4 w · title ≤ 5 w · intro ≤ 20 w · `quote` **51 w verbatim, fixed** · `attribution` ≤ 12 w · `followup` ≤ 9 w framing + **68 w verbatim, fixed** | — | none (narrative kind) | `quote` all fields · src-01, src-02 |
| 3 | Fourteen days from a courtroom aside to a constitutional question at the Delhi High Court. | G4 · dated sequence | `timeline` **[carried, 7 → 6 events, gains `annotations[]`]** | — | **142** · eyebrow ≤ 2 w · title ≤ 7 w · intro ≤ 24 w · 6 events (`date` + `label` ≤ 8 w; a `note` ≤ 12 w on **three of six only**) · **2 annotations** ≤ 12 w | — | omit — default fits | `timeline` events 1, 2, 4, 5, 6, 7 · src-01 … src-10 |
| 4 | Withheld is not deleted. Section 69A is not the 2021 rules. "Not on record" means the judge was never shown the order. | G1 · narrative (text-only) | `jargon-buster` **[new]** | — | **97** · eyebrow ≤ 2 w · title ≤ 6 w · intro ≤ 16 w · 3 terms (`term` ≤ 3 w · `meaning` ≤ 20 w) · **no `hindi` field** (§5) | The gloss is the concrete thing: "the post is still there. Your phone is not allowed to fetch it." | none (narrative kind) | `prose` lead + ¶1; `paradox` side 1 · src-03, src-04, src-05 |
| 5 | By the time the order went out, the account was already near its peak. A backup handle was up within a day. | G4 · time series with milestones | `adoption-curve` **[carried, series trimmed, gains `annotations[]`]** | — | **112** · eyebrow ≤ 2 w · title ≤ 6 w · intro ≤ 28 w · `caption` ≤ 16 w (keeps "approximate, sources vary") · 3 `milestones` ≤ 9 w each · `yLabel` · **2 annotations** ≤ 12 w | none — the marker sitting on the line *is* the concrete thing | omit — default fits | `adoption-curve` points + milestones · src-07, src-08, src-09 |
| 6 | The order goes to the platform, the platform has three hours, and the platform may not show it to you. | G1 · narrative (text-only) | `three-steps` **[new]** | — | **112** · eyebrow ≤ 4 w · title ≤ 5 w · intro ≤ 18 w · 3 steps (`title` ≤ 5 w · `text` ≤ 22 w) | The worked example is the walk itself: who writes it, who must obey it, who never sees it | none (narrative kind) | `prose` lead + ¶1 + ¶2 + ¶3 · src-03, src-04, src-05 |
| 7 | Twenty to twenty-two million followers, one formal order, three hours to comply, and 2,300 orders behind it. | G3 · headline numbers | `data-readout` **[carried, 6 → 4 tiles]** | — | **124** · eyebrow ≤ 2 w · title ≤ 5 w · intro ≤ 20 w · 4 tiles (`label` ≤ 9 w · `note` ≤ 12 w) · `caption` ≤ 6 w | "About two crore" for twenty million; "roughly 1.6 to 2 lakh" for the backup handle (both unit conversions — §5) | omit — default fits | `data-readout` tiles 1, 2, 4, 5 · src-03, src-05, src-06, src-08, src-10 |
| 8 | Five things you could do to that account. The Indian executive can do exactly one of them. | G6 · institutions × actors, control state | `power-matrix` **[re-kinded from `comparison`]** | **HERO** · `layout: wide` | **134** · eyebrow ≤ 4 w · title ≤ 7 w · intro ≤ 30 w · 5 `institutions` ≤ 6 w each · 4 `parties` labels ≤ 4 w each · `caption` ≤ 20 w · **authored `plain`** ≤ 22 w | The grid is the concrete thing: one lever per row, one owner per column | "Five things that could be done to an account down the side, the four parties who might do them across the top, and a filled cell where that party actually holds the lever." | `comparison` all 4 sides + all 5 rows · src-04, src-05, src-09 |

**Head:** 69 words (title 8 · dek 10 · hook 21 · primer 30).
**Total budgeted: 1,059 reader-facing words** against the 1,100 ceiling —
41 words of headroom. (Published today: **1,821 words in 36 blocks**. This
spine is ~26 blocks.)

**Words before the first graphic: 76.** Ceiling 80. Published today: ~140.
The arithmetic, because it is easy to get wrong — `check-prose.mjs` counts the
head **plus section 1's eyebrow, title and intro**, and only stops there
because section 1 is visual. So: title 8 + dek 10 + hook 21 + primer 30 = 69,
plus row 1's eyebrow (≤ 2) and title (≤ 5) = **76**. **Row 1 carries no
`intro`** — if the drafter adds one, this floor breaks immediately. The
eyebrow and title are the intro.

**Floors check.**

| Floor | This spine | Verdict |
|---|---|---|
| ≥ 6 in 10 sections visual | **5 of 8 = 62.5%** — rows 1, 3, 5, 7, 8 | ✅ (floor 60%) |
| Never two text-only adjacent | **V T V T V T V V** — rows 2, 4, 6 are the only text-only ones, each between two visuals | ✅ |
| First section a graphic | Row 1 is `you-think`, not in `TEXT_ONLY` | ✅ |
| ≤ 3 `prose` sections of ≤ 200 words | **0** | ✅ |
| ≤ 1 `paradox` | **0** (cut — §8c) | ✅ |
| ≤ 1,100 reader-facing words | **1,059** | ✅ |
| ≤ 80 words before the first graphic | **76** | ✅ |
| ≤ 12 distinct names | **11 real names** (§7); see the heuristic caveat there | ⚠️ read §7 |
| ≥ 1 kind outside the six workhorses | **4** — `you-think`, `jargon-buster`, `three-steps`, `power-matrix` (`adoption-curve` is a fifth) | ✅ |
| `timeline` ≤ 6 events, notes ≤ 20 words | 6 events, notes ≤ 12 words | ✅ |
| Annotations ≤ 12 words | 4 annotations, all ≤ 12 | ✅ |
| ≤ 3 loud sections; no two WebGL adjacent; ≤ 1 `bleed` per act | **0 loud** — no WebGL, no `bleed`, no `split`; one `wide` on the hero | ✅ |
| CANON §3 section count 6–12 | **8** | ✅ |

**The one text-only count worth spelling out.** `jargon-buster` and
`three-steps` are in `TEXT_ONLY` in `scripts/check-prose.mjs`, exactly like
`prose`. They are cheaper and clearer than the `prose` section they replace,
but they do **not** buy visual share. That is why the spine is eight rows and
not nine: a ninth text-only row would drop it to 55% and fail. If the operator
rules `number-sense` in (ruling 1), the ninth row is **visual** and the share
rises to 6 of 9 = 67%.

**The `comparison` → `power-matrix` swap is a floors decision as much as a
word-count one.** `comparison` is in `TEXT_ONLY`: keeping it would leave the
spine at 4 of 8 = 50% visual even after every other cut.

**How-to-read panels: none authored, anywhere.** Checked against `NEEDS_HOW`
in `src/lib/explainers.ts`: none of `you-think`, `quote`, `timeline`,
`jargon-buster`, `adoption-curve`, `three-steps`, `data-readout` or
`power-matrix` is in it. Under RG-19 no panel renders. Do not author one — the
published issue authors none either, so this is a floor held, not a change.

**`plain` lines: one authored, on the hero.** `EXPLAIN['power-matrix'].what`
reads "A grid of institutions against parties" — the columns here are *actors*,
not parties, so the default would misdescribe the form. Every other visual row
takes its default. The three narrative rows take none. The source renders on
every section as the second line of that paragraph, from `core/Section.astro`.

**Annotations (RG-20, `docs/design/blueprints/_ANNOTATIONS.md`).** Two kinds in
this spine carry the slot and both are used. Four callouts, all ≤ 12 words.

| Row | `at` | `text` (≤ 12 words) | Why it is the finding |
|---|---|---|---|
| 3 `timeline` | `"21 May 2026"` | **"One account, one country. The only formal order on the record."** (10 w) | The load-bearing accuracy point of the whole issue, put on the mark that carries it. EDITOR guardrail 5 lives here. |
| 3 `timeline` | `"29 May 2026"` | **"The court was asked to weigh an order it never saw."** (11 w) | The court's own minute. This is where the cut `paradox`'s strongest fact lands, on a mark instead of in 48 words of prose. |
| 5 `adoption-curve` | the **21 May milestone label**, matched verbatim | **"The order arrives with the account already near its peak."** (10 w) | The honest version of the published claim. See §8e, ruling 4. `at` for this kind is the x value or a milestone label — the drafter must match the milestone string exactly, not the date. |
| 5 `adoption-curve` | the **23 May milestone label**, matched verbatim | **"A backup handle drew 160,000 followers in a day."** (9 w) | What the order demonstrably *did* produce, stated at the bottom of the sourced range. |

`power-matrix` and `data-readout` are **not** in the eight annotation-enabled
kinds, so their findings ride the section title and the caption.

**Rhetorical jobs (3 of the eight, `_voice-core.md` §7).**

| Job | Rows | Note |
|---|---|---|
| INVESTIGATION | 1, 5 | The anomaly as a graphic first: what the order did, and where it lands on the line. |
| CONVERSATIONAL EXPLAINER | 4, 6, 7, 8 | **Four of eight — exactly the "at least half" floor.** The default job. |
| CALM-STRUCTURAL | 2, 3 | The remark dated and attributed with no heat; the chronicle. The connective is written, the conclusion is not. |
| SATIRICAL EXPOSURE | **none** | The contract sets it to **0 on the politics desk**. The published `paradox` is written in it and is cut. See §8c and ruling 3 — this is the one point where the 2026-06-04 verification and the 2026-09-13 contract disagree, and the contract is newer. |
| LYRICAL COMPRESSION | at most 1 paragraph | If spent at all, spend it on row 8's `caption`. Not on row 2 — the material there is a slur about unemployed people and a judge's retraction, and it wants flatness. |
| DRY WIT | **none recommended** | The subject is a joke party. A deadpan sentence about it reads as the writer joining in. |

**The one binary reframe.** Tell 2 / tell 19 ration the "it is not X, it is Y"
shape to **one per issue**. Spend it on row 4's first term — *withheld is not
deleted* — because that reversal **is** this issue's argument and it is where
the reader needs it. The drafter must not reach for it again in the title, the
hook, row 1 or row 8.

## 4. The head

- **Title (states the finding, ≤ 8 words):**
  **"The account was hidden in India, nowhere else"** (8 words; set one accent
  word, `*hidden*`)
  - Retires **"The Ban That Made It *Bigger*"** on three counts: it is the
    "The ‹Noun› That ‹Verb›s" construction (tell 7, nine of ten published
    titles); it names the subject rather than the finding; and "made it bigger"
    asserts an amplification that the trimmed, honest series supports only
    weakly (§8e).
  - Deliberately plain. "Withheld" is the precise word and the issue teaches
    it in row 4 — but a title travels alone in the contents list, so it uses
    "hidden" and lets row 4 supply the term of art. This is the delimitation
    panel's own finding applied in advance.
  - Alternates for the operator: *"The block stopped at India's border"* (6) ·
    *"India can hide an account, not delete it"* (8, but it spends the
    once-per-issue reframe on the title — not recommended).
- **Hook (≤ 25 words; a number the reader can feel, a "you", the twist):**
  **"Twenty million followers in one week. Then one order made the account disappear from your phone, and from no one else's."** (21 words)
  - The number is published (primer: "twenty million followers in a week").
    The "you" is the Indian reader, who is precisely the person for whom the
    account vanished — no "your MP"-style default-region problem here.
    Published hook: 34 words, no number, no "you", one em-dash.
- **Dek (≤ 14 words):**
  **"Twenty million followers in a week. The order reached one country."** (10 words)
  - **No Hindi.** Politics carries the fewest Hindi words of any desk and never
    a Hindi joke (`_voice-core.md` §2). The subject here *is* a joke outfit and
    the source material is a slur, so a Hindi word anywhere near it fails the
    wince test. L1 throughout the issue. See §5.
- **Primer (three sentences: what happened · why it matters to you · what you'll see):**
  **"In May 2026 a satirical account crossed twenty million followers in a week. The government ordered X to withhold it inside India under a national security law. Here is what that order could reach, and what it could not."**
  (38 words, ~232 characters — inside the 80–420 bound.)
  - **Budget note:** the head must total ≤ 69 words for the 80-word floor to
    hold with row 1's chrome. At 38 the primer puts the head at 77 and the
    floor at 84. **Trim the primer to ≤ 30 words** — drop "under a national
    security law" (the law is row 4's job) and "satirical" (row 2 establishes
    it) if needed. Published primer: 60 words, ~415 characters, at the Zod
    ceiling, which the verification flagged as a build watch item. That risk
    goes away here.

## 5. The Indian ground

This issue is Indian throughout and needs no importing: an Indian court, an
Indian ministry, an Indian law, an Indian audience, and a reader whose own
phone is the jurisdiction in question.

| Ground | Where it lands | Published / dossier row behind it |
|---|---|---|
| **Your phone is the border.** The account is blank in India and open everywhere else | head (hook), rows 1, 8 | `comparison` rows 1–3; `timeline` 21 May · src-03, src-04 |
| **crore and lakh as the native units** — "about two crore followers", "roughly 1.6 to 2 lakh on the backup handle" | rows 5, 7; dek | `data-readout` tile 1; `timeline` 23 May note · src-08, src-09 (see derivations) |
| **The BJP's own Instagram handle as the size the reader can feel** — the following went past it | rows 3, 7 | `timeline` ~18–21 May label, verbatim: "past the BJP's own Instagram handle" · src-07 |
| **A national security law, a ministry, the Intelligence Bureau, the Delhi High Court** — four institutions the reader already knows by name | rows 3, 4, 6, 8 | `prose` lead + ¶2; `timeline` 21 and 29 May · src-03, src-04, src-05 |
| **A court that could not see the order it was asked to test** | rows 3 (annotation), 4 | `paradox` side 1, verbatim from the bench · src-04 |
| **The word "withheld", taught once and then used** | row 4, then everywhere | `prose` ¶2 · src-03 |

**No ₹ conversion is needed: the issue carries no foreign-currency figure.**
Zero `$` across all seven published sections. Contract §3 rule 4 has nothing to
convert here. The crore/lakh conversions below do the work the rule asks for.

**No Hindi word anywhere in this issue — a decision, not an oversight.** Three
reasons, in order: politics carries the fewest Hindi words of any desk; the
material is a judge's slur about unemployed young people, where warmth reads as
levity; and *yaar / bhai / bro* are barred from politics outright (tell 14).
Every field stays at L1.

**Derivations used** (arithmetic on the issue's own numbers — no new fact, no
new source, but listed so the operator can rule):

1. **"about two crore"** = 20 million ÷ 10⁷. A unit conversion of the published
   "~20–22M" / "twenty million followers in a week". Used in the dek and row 7's
   tile label. The published figure stays the primary form; the crore sits
   beside it, never instead of it.
2. **"roughly 1.6 to 2 lakh"** = 160,000–200,000 ÷ 10⁵. A unit conversion of
   the published backup-handle range. Row 7 or row 5's annotation, not both.
3. **"fourteen days"** 15 May → 29 May. Already the published figure, and
   already the verification's own required fix 2 (the published draft said
   "nineteen" until it was corrected). Not new; restated so the drafter does
   not re-derive it.
4. **93% and 100% of the ~22M peak** are the published `points` values and are
   copied, not recomputed. Re-dating the 93% point from 21 May to 22 May is a
   **correction**, not a derivation — see §8a.

**Not used, deliberately.** No "the population of Mumbai", no "one IPL final's
viewership", no city-sized comparison for twenty million. Every one of them
would add a fact the issue's `sources[]` does not carry, and a composer does
not add sources. The BJP-handle comparison is the only size anchor the record
already contains, and it is used.

## 6. The three questions

What the issue must teach. Written from the dossier and the published record,
not from any draft; the reader panel answers them from the draft alone. If the
draft cannot teach these, the draft is wrong.

1. **Q:** The government ordered the account blocked. What actually happened to
   it, and where?
   · **A:** X was ordered to *withhold* the account inside India. It was not
   deleted. It stayed visible everywhere outside India, on servers in the
   United States that the order could not reach, and the only thing formally
   covered by the order was the X account. The website and Instagram losses two
   days later were reported by the founder, not confirmed as formal orders.
   · rows 1, 3, 4, 8 · `comparison` rows 1–3, `timeline` 21 and 23 May,
   dossier §4a claim 2 and §9.6 · src-03, src-04, src-09.
   · Answerable from a **drawn graphic** (the hero).
2. **Q:** Which law was used, who issued the order, and why could the court not
   see it?
   · **A:** Section 69A of the Information Technology Act, 2000, with procedure
   under the IT Blocking Rules, 2009 — not the IT Rules of 2021, which are a
   separate track. The Ministry of Electronics and Information Technology
   issued it on Intelligence Bureau inputs. A Section 69A direction carries a
   secrecy obligation, and on 29 May the Delhi High Court recorded that the
   blocking order was not on its record, only a communication.
   · rows 4, 6, 3 (29 May annotation) · `prose` lead + ¶1 + ¶2, `paradox`
   side 1, dossier §9.2 and §9.7 · src-03, src-04, src-05.
   · Answerable from the **plain-language cards** (`jargon-buster`,
   `three-steps`) plus row 7's "1" tile. This is the one question the spine
   does not put on a chart, and those two kinds exist precisely for it.
3. **Q:** How big had the account become, and when did the order arrive
   relative to that?
   · **A:** Roughly 20 to 22 million Instagram followers within a week of the
   16 May launch, past the BJP's own Instagram handle. The order went out on
   21 May, when the account was already near that peak. A backup handle drew
   roughly 160,000 to 200,000 followers in a day.
   · rows 5, 7, 3 · `adoption-curve` points + milestones, `data-readout`
   tile 1, `timeline` 23 May note, dossier §4a claim 3 · src-07, src-08,
   src-09, src-10.
   · Answerable from a **drawn graphic** (the curve and its two annotations).

The follower figure must be answerable **as a range**. A panel answer of "22
million" is a pass; a draft that teaches a single hard number is a defect
(dossier §9.4, verification check 3).

## 7. Names

Eleven. Ceiling is 12; the spare slot should stay spare.

| Name | The role phrase that introduces it | Where |
|---|---|---|
| **Surya Kant** | the Chief Justice of India, whose remark in open court gave the outfit its name | row 2 attribution |
| **Cockroach Janta Party** | the satirical outfit founded the day after the remark | head, rows 2, 3 |
| **Bharatiya Janata Party** | the party the name puns on, and the Instagram handle the following went past | rows 2, 3 |
| **Abhijeet Dipke** | the founder, a former AAP communications strategist then living in Boston | row 3, 16 May note |
| **MeitY** | the ministry that issued the order — named once in full, then "the ministry" | rows 3, 6, 8 |
| **Intelligence Bureau** | whose inputs the order cited | rows 3, 6 |
| **X** | the platform ordered to withhold the account | rows 1, 3, 8 |
| **Instagram** | where the following was counted | rows 3, 5 |
| **Delhi High Court** | the court hearing the challenge to the order | rows 3, 4 |
| **P.K. Kaurav** | the judge who recorded that the blocking order was not before him | row 3, 29 May note |
| **Shreya Singhal** | the 2015 Supreme Court case that struck down Section 66A and left Section 69A standing | row 6, step 1 |

**Described, not named** (all currently named, or nearly so, in the published
issue): Justice Joymalya Bagchi → "a two-judge bench"; Meta → Instagram alone;
the MeitY Review Committee → "the ministry's own review committee"; the Sahyog
portal → "a government takedown portal" (as published — the portal is never
named today, and should not start being named now). Senior Advocate Akhil Sibal
and Solicitor General Tushar Mehta do not appear: the `paradox` that carried
Sibal's paraphrase is cut, which also retires the verification's optional
"name Sibal" improvement by making it moot.

**Source lines only, never inside a sentence** (rule 9): The Wire · ThePrint ·
ThePrint / PTI · ThePrint / Bloomberg · the Delhi High Court record.

> **Read this before reacting to a NAMES flag.** `check-prose.mjs` finds names
> with a capitalisation heuristic, and this is a statute-dense issue. It will
> count "Section", "IT Act", "Supreme Court", "Boston", "United States" and
> "Review Committee" as names on top of the eleven above, so the ⚠️ NAMES flag
> will very likely fire even though the issue is disciplined. `India` and
> `Indian` are in the stop list; a bare `X` is too short to match. Mitigations
> already in the spine: the ministry is named once then pronominalised, the
> court is named once then "the court", and the statute is stated in full once
> (row 4) and shortened to "the law" after. **Do not cut a real name to chase
> the number** — report the eleven and let the operator read the flag with this
> paragraph beside it.

## 8. Composer notes

### 8a. What carries over, and what changes — the published-section fate table

Component `data` is expensive and already verified, so the rewrite reuses it
wherever the register allows. Every number in this table is **copied, not
retyped** (contract rule 13).

| Published section | Verdict | Detail |
|---|---|---|
| `quote` | **carried, `data` verbatim; moved to row 2** | `data.quote` (51 words) and `data.attribution` unchanged, character for character. `data.followup` keeps the 68-word 16 May clarification **verbatim end to end** — this is the verifier's required fix 1, resolved via its option (a) on the confirmation pass, and it does not get un-resolved here. Its closing sentence, the one that names the party as a pun on the BJP, moves out to row 3's 16 May event label, which already says it. `intro` cut from 60 words to ≤ 20. It moves from section 1 to section 2 because the floor says section 1 is a graphic. Add `sourceRefs: [src-01, src-02]` — unchanged — and a section-level `source`; the published `quote` carries none, against CANON §7. |
| `timeline` | **carried, 7 → 6 events, gains `annotations[]`** | Every date and every state unchanged. **The event that goes is "~18–21 May · The curve"** — row 5 draws exactly that, and cutting it resolves the verification's ⚠️ IMPRECISE on this section (a "~20.5M on 22 May" note sitting under a "~18–21 May" row label). One cut fixes one residual and lands the ≤ 6 ceiling. Surviving events: 15 May, 16 May, 21 May, 23 May, 29 May, 7 Jul. Labels shortened to ≤ 8 words, notes to ≤ 12 and only on three of six. `source` and `sourceRefs` unchanged. |
| `adoption-curve` | **carried, series trimmed and one point re-dated** | `points` drops the two interpolated mid-points — `{year: 518, pct: 6}` and `{year: 519, pct: 14}` — which the verification calls "illustrative, not sourced as hard data". The 93% point is **re-dated 521 → 522**, because both the dossier §4 and §4a source the ~20.5M Instagram figure to 22 May; this is the verification's own optional improvement, applied. Series becomes `{516,0} {522,93} {523,100}` — three points, all sourced. `milestones` unchanged at 516 / 521 / 523, so the 21 May block marker now sits on the rising segment rather than on an invented value. `caption` keeps "approximate, sources vary" verbatim. `yLabel` unchanged. The x-axis month-day encoding (516 = 16 May) is unchanged and stays in the EDITOR block. |
| `prose` | **cut** | The 3-paragraph statute explainer (~330 words, the single heaviest block in the issue) splits three ways with nothing factual lost: the ordered mechanism → row 6 `three-steps`; the three terms of art → row 4 `jargon-buster`; the 3-hour window and the 2,300+ orders → row 7, which already carries both as tiles. `skimCaption` goes with it — that field applies to `kind: prose` only, and renders only in Skim mode anyway (contract rule 5). **Every fact survives:** §69A, the 2009 Rules, the explicit "not the IT Rules of 2021", *Shreya Singhal* 2015, the secrecy obligation, MeitY on IB inputs, the stated ground, the 3 hours, the 2,300+ orders to 19 platforms. |
| `comparison` | **re-kinded → `power-matrix`, becomes the hero** | Same argument, same four actors, same five levers, same source refs. The twenty prose cells collapse into the component's enum (`full` / `partial` / `none` / `contested`) and the four `kicker` / `tag` lines into four short column labels. Two gains beyond the ~70 words: `comparison` is `TEXT_ONLY` in the gate and `power-matrix` is not, and the enum retires the two cells the verification called structural inferences phrased as assertions ("**They kept the screenshots**", "**Reposts at will**") without losing what they meant — those become a `full` cell in the account's column, which is a claim about who holds a lever, not a claim about an event. `institutions` = the five levers (rows), `parties` = the four actors (columns). |
| `paradox` | **cut** | Its facts survive in three places, none of them prose: the court's "not on record today. There is only communication." is already verbatim in the timeline's 29 May note and is promoted to a timeline annotation; the secrecy obligation becomes row 4's third `jargon-buster` term; the backup-handle surge becomes row 5's second annotation; the "ban is also a billboard" claim is carried, in its honest form, by the hero's caption. See §8c for why cutting it is also the contract-compliant move. |
| `data-readout` | **carried, 6 → 4 tiles** | Kept verbatim, values and notes: "~20–22M" (key), "1 · Account formally withheld under Section 69A" (key), "3 hr", "2,300 +" (warn). **Dropped:** the "14 · Days from the remark to the High Court order" tile and the "7 Jul · Next Delhi High Court hearing" tile — both facts sit on the timeline, and 7 Jul needs a ruling (ruling 5). Four tiles is inside the kind's 3–6 range. |
| `sources[]` | **all ten, unchanged** | Slug `2026-06-04-cockroach-janta-party` unchanged; the URL does not move. Every one of src-01 … src-10 is still referenced by at least one row, so the bibliography carries no orphan. |
| head | **rewritten** | New title, hook, dek, primer (§4). `id`, `topic`, `publishedAt: 2026-06-04`, `status: published`, `tags` all unchanged. `readTimeMinutes` **7 → 4**. |
| MDX body EDITOR block | **rewritten, all guardrails carried** | See §8b. |

**Three verification residuals resolved by composition, not by patching prose:**
the timeline's misaligned "~20.5M on 22 May" note (the row it sat under is
cut); the adoption-curve's unflagged interpolated mid-points (deleted); and the
"name Sibal" improvement (moot — the section that paraphrased him is cut). The
fourth, the primer's proximity to the 420-character Zod ceiling, is resolved by
a primer a third the length.

### 8b. The five standing guardrails, and the rows they constrain

The published MDX body carries an `# EDITOR NOTES` comment block. **All five
survive this rewrite. None is moot.** They are restated here against the new
spine so the drafter cannot lose them, and the rewritten block must carry all
five plus the sixth.

1. **Opposition quotes are excluded.** Tharoor, Umang Singhar and Yogendra
   Yadav are all `[VERIFY WORDING]` in dossier §5 and §9.8 — surfaced from a
   reporting summary, not a clean verbatim fetch. **Constrains: every row.**
   The spine carries exactly one `quote` section and it is the CJI pair. No
   opposition figure is quoted, paraphrased or named anywhere, and §7 has no
   slot for one. If the operator ever wants them, it needs a fresh ThePrint
   fetch first, which is a research job and out of a rewrite's scope.
2. **"109 million" is an extraction artifact and is not used.** Dossier §9.4.
   **Constrains rows 5 and 7**, the only rows that carry a follower figure.
   The published draft is grep-clean on it and the rewrite must stay so.
3. **The CJI remark always travels with its 16 May clarification, verbatim,
   never sharpened past the source.** Mandatory sensitivity check 1.
   **Constrains row 2, absolutely.** Both texts sit on the same card — the
   remark in `data.quote`, the clarification in `data.followup`. This is why
   row 2 is the longest row in an issue whose whole point is being shorter,
   and it is not negotiable on word-count grounds. It is also why the epithet
   appears exactly once in the issue: the dossier's drafter-framing note says
   do not amplify it beyond that single in-context instance, and the new head
   deliberately does not use the word.
4. **No genocide-rhetoric historical analogy.** Dossier §1 and §8 — one
   allowlisted opinion piece makes that move and is explicitly out of bounds.
   **Constrains rows 2 and 4, and the kind selection itself.** The `analogy`
   kind was considered for "a territorial tool against a borderless object"
   and is declined partly for this reason (§8d): any historical mapping placed
   near the epithet risks exactly the move the guardrail forbids. Row 4's
   glosses are restatements, not metaphors, on purpose.
5. **Only the X account is formally §69A-withheld. The website and Instagram
   losses are founder-attributed.** Dossier §9.6; mandatory check 4.
   **This is the accuracy point the whole issue rests on, and it constrains
   four rows:** row 1's `you-think` is built on it (`actually.value` is "1
   country" and the `note` must say one account, not "the accounts"); row 3's
   21 May and 23 May events keep their published wording and gain the 21 May
   annotation that states it; row 7's "1" tile keeps its published note
   verbatim; and row 8's matrix must show the Indian executive's **only**
   `full` cell on "withhold the account inside India" — if any second cell in
   that column is filled, the grid asserts something the record does not.
6. **The adoption-curve x-axis encodes month-day** (516 = 16 May). Carried
   forward and updated: the series is now three sourced points, not five, and
   the block milestone sits between two of them rather than on an invented
   value.

### 8c. What is cut, and why

1. **The `prose` section.** The measured complaint is that it is a
   three-paragraph statute explainer. It is answered by splitting it, not by
   shortening it: an ordered mechanism is what `three-steps` is for, and terms
   of art that would clog a paragraph are what `jargon-buster` is for. Both are
   named for this issue by REGISTER-PLAN §8.1's own note on the sibling
   statute-dense politics rewrite.
2. **The `paradox` section, and the SATIRICAL beat with it.** This is the one
   place where the two governing documents disagree, so it is stated plainly:
   the 2026-06-04 verification's mandatory check 9 *approves* exactly one
   SATIRICAL EXPOSURE beat and names this section as it. `_voice-core.md` §7,
   signed 2026-09-13, sets SATIRICAL to **0 on the politics desk**. The
   contract is the newer document and Rule 0 says the register outranks the
   mode, so the section goes. Nothing is lost: the court's own minute is a
   *fact*, and facts do not need a satirical frame. It reads harder as a
   ten-word callout on the 29 May mark than as 48 words of prose built to a
   punchline. This also removes the two most editorial lines in the published
   issue ("A ban is also a billboard.", "certify the account as dangerous, in
   writing the public cannot read"), which is the right direction on a desk
   where restraint is the safer register.
3. **Two `data-readout` tiles.** "14 days" and "7 Jul" are both on the
   timeline. A tile that repeats a timeline row is a block, not a fact.
4. **One `timeline` event.** "~18–21 May · The curve" is the row the
   adoption-curve draws, and the verification flagged its internal date
   mismatch. Cutting it is the cheapest fix available.
5. **The `quote` section's long intro.** Sixty words to say when and where.
   Twenty will do, and the register wants the flat version on this material.
6. **"Sine die"-class terms of art.** There are none in this issue, but the
   same discipline applies to "intermediary", which the published prose uses
   twice: say "the platform". `jargon-buster` teaches three terms and that is
   the ration.

### 8d. Kinds I wanted and could not use

- **`number-sense`** for the ~20–22 million figure. This is the one I most
  wanted and the only one blocked by something the operator can unblock. Its
  `equals[]` field needs everyday equivalents, and the **published issue
  carries none** — it states the follower range and nothing the reader can feel
  it against, except "past the BJP's own Instagram handle", which is a
  direction, not a size. The **dossier §4 does carry the size**: CJP's
  Instagram following reached "~2.5× the BJP's official handle and ~1.5× the
  Congress handle" (src-07, ThePrint/CTC — **already in `sources[]`**). So this
  is an operator ruling about whether a rewrite may assert a fact that is in
  the record and in the bibliography but was never put on the page, not a
  research job. **Cost if ruled in:** one ninth row at ~95 words, slotted
  between rows 4 and 5, which lifts visual share 62.5% → 67% and needs ~54
  words paid for from elsewhere (ruling 2 frees 46 of them). See ruling 1.
- **`benchmark-chart`** for CJP against the BJP and Congress handles. Blocked
  **even if ruling 1 goes in**: the record has ratios, not values. Deriving
  BJP ≈ 8.2M and Congress ≈ 13.7M by dividing an approximate range by an
  approximate multiple manufactures two figures with false precision, on the
  one number this issue is most careful about. `number-sense` `equals` lines
  are the honest home for a ratio.
- **`power-flow`** for the order's path, IB input → ministry → platform →
  account. The right instinct and the wrong kind: `power-flow` needs a value on
  every link and runs a build-time conservation check. Nothing quantitative
  flows here. `three-steps` is the honest form.
- **`region-map` and `data-globe`** for "borderless". Tempting and wrong twice
  over. `region-map` needs a value per zone and the issue has one country and
  one US city; and a map of the world with India shaded would draw exactly the
  border the argument says does not bind the object. The matrix argues; a map
  would decorate.
- **`latency-waterfall`** for the three-hour compliance window. It needs timed
  spans laid end to end. One duration is a tile.
- **`analogy`** (pairs form) for "a territorial tool against a non-territorial
  object". Declined on two grounds: it would be a fourth text-only row, which
  breaks the visual floor outright; and on this material any this ↔ that
  mapping placed near the epithet runs at guardrail 4 (§8b). The mapping the
  issue needs is *withheld ↔ deleted*, and that belongs inside a
  `jargon-buster` gloss, next to the law, in the precision layer.
- **`bill-passage`, `bill-funnel`, `vote-flow`, `vote-result`, `seat-chart`,
  `chamber`.** No bill, no division, no seats, no party arithmetic anywhere in
  this issue. A rewrite may not add a source, so none is available.
- **`you-think` a second time**, on the "2,300 orders" scale. The catalog rations
  it to one per issue and that ration is right.
- **`act-break`.** Composed **without** them, consistent with RG-06 as settled
  on the delimitation storyboard. Note for the record: with three text-only
  rows in eight there is exactly **one** adjacency-safe slot, before row 5, and
  it is a real pivot (from what was said and what happened, to how the
  machinery works). If the act rule ever returns, that is the only place it can
  go.

### 8e. Re-anchoring: my judgement is **no pass**, with one figure pair flagged

The Arsenal precedent does not transfer. That pass existed because seven of its
numbers rested on sources that were **off-allowlist when the dossier was
written and on-allowlist seventeen days later**, and because one figure was
**contradicted** by the source it was attributed to (28.5 xGA against Opta's
own 28.3). Neither condition holds here.

**What I checked, and what I concluded:**

- **`~20–22M` followers — adequately hedged already. Do not touch it.** Dossier
  §4a claim 3 verifies it as a *dated range* against three relays with three
  distinct upstreams: ThePrint/PTI (~21.9M, 23 May), ThePrint/CTC (~20.5M,
  22 May) and ThePrint/Bloomberg ("crossed 20M in less than a week"). All three
  are on-allowlist. The published issue never states a point figure, and the
  verification confirms the hedge on every instance. A researcher pass could
  not improve on "a dated range" because a dated range is what the sources say.
  **The rewrite must not harden it.**
- **The `adoption-curve` series — genuinely weak, but weak by authorship, not
  by sourcing, and the fix is deletion.** The verification says the 518 and 519
  mid-points "are illustrative, not sourced as hard data". No source can supply
  a daily follower series for an account that no longer exists, so a research
  pass would come back empty. Removing the two points leaves three sourced
  observations and a milestone, which is what the section always actually had.
  **This is the single most important change in the rewrite.**
- **`160,000–200,000` backup handle — fine as a range.** Two allowlisted
  ThePrint pieces (PTI and the death-threats feature), and the published issue
  already carries it as a band. Keep the band; use the lower bound in the
  ≤ 12-word annotation.
- **`2,300+` orders and the `3 hr` window — the one pair I flag.** Both rest on
  a **single** allowlisted analysis piece, src-05 (The Wire's Sahyog explainer,
  24 Feb 2026). They are the only single-sourced numbers left in the spine.
  They are context rather than load-bearing — the argument does not move if
  they go — and the published issue already frames them as context. **My
  recommendation: keep both, and let row 7's source line name the reporting
  rather than implying a government count.** If the operator wants zero
  single-sourced numbers in a rewritten issue, drop the "2,300 +" tile; the
  "3 hr" tile earns its place inside row 6's third step either way. I would not
  commission a research pass for either.
- **Figures the rewrite must keep out, and does.** The `13.4M` X following and
  the "over 200,000" at the withholding — dossier §9.5 says these describe
  different things and must never be presented as one X number, and the
  published issue wisely uses neither. And `109 million`, the extraction
  artifact (guardrail 2).

**If the operator orders a pass anyway, here is what it would have to do**, so
the cost is visible: re-fetch the four Scroll.in URLs that returned HTTP 403 in
the original session (dossier §9.9) to see whether a second named home now
exists for the block date and the website takedown; and re-fetch ThePrint's
"opposition ammunition" piece (`/politics/…/2938822/`) for clean verbatim on
the three opposition quotes. The first changes no number in this spine. The
second is the only thing that could add a *section* to this issue, and it would
need a names slot and a word budget it does not currently have. **Neither is
needed for this rewrite to ship.**

### 8f. Two gate notes that will fire and are not defects

1. **ℹ CHROME-HEAVY on rows 3, 5 and 7.** `check-prose.mjs` counts any field
   with four or more words as a block and flags above five per section. A
   six-event timeline, a milestone-marked curve and a four-tile readout will
   always exceed that, because their data *is* many short strings. The
   published issue trips it on the same three kinds. It is an ℹ, not a ⚠️.
2. **⚠️ NAMES will very likely fire.** See the boxed note in §7. Eleven real
   names, a capitalisation heuristic, and a statute in every third sentence.

### 8g. Sourcing

Every row carries `sourceRefs[]` and a section-level `source`. The published
`quote` and `adoption-curve` need attention: `quote` has no `source` at all
(CANON §7, "no source, no section") and should take src-01 / src-02;
`adoption-curve` has a `data.source` but no section-level `source`, which
should be promoted, since `core/Section.astro` has been the single source
emitter since 2026-09-04. Coverage across the new spine: src-01 (row 2) ·
src-02 (row 2) · src-03 (rows 1, 3, 4, 6, 7) · src-04 (rows 1, 3, 4, 6, 8) ·
src-05 (rows 4, 6, 7, 8) · src-06 (rows 3, 7) · src-07 (rows 3, 5) · src-08
(rows 5, 7) · src-09 (rows 3, 5, 8) · src-10 (row 7). **No orphan.**

### 8h. For the operator — nine rulings before the draft

> ## SETTLED — operator ruling, 2026-09-14
>
> All nine are settled as the composer recommended. The numbered list below is
> kept verbatim as the reasoning; this block is what the drafter executes where
> the two could be read differently.
>
> 1. **`number-sense` is IN.** Nine rows. The drafter may assert the 2.5x / 1.5x
>    multiple against the BJP and Congress Instagram handles (src-07, already in
>    `sources[]`). Visual share rises to 6 of 9 = 67%.
> 2. **The CJI clarification stays FULL VERBATIM, 68 words.** The verifier's
>    option (b) ellipsis is NOT taken. This is sensitive material, the guardrail
>    requires the remark and the retraction to travel as a matched pair, and the
>    retraction is the counterweight to a slur about unemployed young people.
> 3. **`paradox` cut, and the SATIRICAL beat with it.** Where the 2026-06-04
>    verification and the 2026-09-13 contract disagree, the contract governs.
> 4. **The adoption curve loses both interpolated points, re-dates the 93% point
>    521 -> 522, and the claim weakens to the honest form:** by 21 May the
>    account was already near its peak, and what the order demonstrably produced
>    was the backup handle. The title does not say "made it bigger".
> 5. **7 July: drop the tile, keep the date as the timeline's last event.**
> 6. **Hero is `power-matrix` at `layout: wide`.** Not `split`, not the curve.
> 7. **No `act-break`. No Hindi word anywhere in this issue.** Both deliberate.
> 8. **`readTimeMinutes` 7 -> 4.** Slug, `id`, `publishedAt`, `status: published`,
>    `tags` and all ten `sources[]` unchanged. In-place replacement, tabled for
>    the operator before any commit.
> 9. **The `# EDITOR NOTES` block is rewritten** carrying all five published
>    guardrails plus the updated sixth.
>
> ### The budget, rebalanced — read this before writing a word
>
> Rulings 1 and 2 pull against each other and the operator has taken both.
> Row 1 adds ~95 words to a spine budgeted at 1,059 with 41 of headroom, and
> row 2's 46-word saving is refused. The issue must still land **<= 1,100
> reader-facing words**. So roughly **54 words come out of chrome**, in this
> order, and nothing else pays:
>
> 1. **Event and tile notes.** The per-row caps in the table are CEILINGS, not
>    targets. The timeline carries notes on only three of six events and each is
>    capped at 12 words; `data-readout` notes are capped at 12. Run them short.
> 2. **Section intros.** Every intro cap has slack; the hero's 30 and the
>    timeline's 24 are the largest.
> 3. **Captions**, down to the point where the claim still reads.
>
> **Never pays:** any number, any verbatim quote, any attribution, the
> `jargon-buster` glosses, or the `you-think` reframe. If after all three passes
> the issue is still over 1,100, stop and report the overrun with the arithmetic
> rather than cutting into that list.


1. **`number-sense`, and the 2.5× / 1.5× multiple.** Rule the ratio in or out.
   *In* → a ninth row, visual share to 67%, ~95 words, and the drafter may say
   "about two and a half times the BJP's own Instagram following" (src-07,
   already in `sources[]`, but never asserted by the published issue). *Out* →
   the eight-row spine as composed, and "past the BJP's own Instagram handle"
   stays the only size anchor. **My recommendation: in**, because it is in the
   record, in the bibliography, and it is the single best Indian-scale
   comparison this issue has. But it is a ruling because it puts a sentence on
   the page that the published issue chose not to put there.
2. **The CJI clarification: full verbatim, or the verifier's sanctioned
   ellipsis?** Composed at **full verbatim** (68 words), which is the verifier's
   preferred option (a) and what the confirmation pass locked in. Option (b),
   which that same report explicitly offers, is an explicit ellipsis:
   *"…What I had specifically criticised were those who have entered
   professions like the Bar with the aid of fake and bogus degrees…"* — 22
   words, **saving 46**. Row 2 is the **designated slack row**: if any other
   row overruns, this is what pays. I did not take the saving myself, because
   un-resolving a fix the verifier signed off is not the composer's call.
3. **The `paradox` is cut and the SATIRICAL beat goes with it.** Confirm. This
   is the one place the 2026-06-04 verification and the 2026-09-13 contract
   disagree (§8c ¶2). The facts survive in three places, all named.
4. **The adoption-curve loses its two interpolated points and re-dates the 93%
   point to 22 May — and the claim it carries is weakened accordingly.** The
   published intro says the block landed "not at the top of the curve but on
   its steepest stretch". That reading depends on the mid-points this rewrite
   deletes. With only sourced observations the honest statement is: **by 21 May
   the account was already near its peak, and what the order demonstrably
   produced was a backup handle with 160,000 to 200,000 followers in a day.**
   That is a change of emphasis, not of fact, and it is why the title no longer
   says "made it bigger". On a politics desk the weaker, defensible claim is
   the right one. **Confirm, or tell me to keep the published framing.**
5. **The 7 July 2026 hearing has passed.** The issue keeps
   `publishedAt: 2026-06-04` and is a record of that date, so forward-looking
   phrasing is accurate as of publication — but a reader arriving today reads
   "next hearing 7 July" as current. Composed as: **drop the tile, keep the
   date as the timeline's last event**, with its note about the open question.
   The alternatives are to keep the tile, or to say what happened, which needs
   a new source and is out of a rewrite's scope.
6. **The hero is the `power-matrix`, not the `adoption-curve`, at
   `layout: wide` and not `split`.** Confirm (§2).
7. **No `act-break`; no Hindi word anywhere in this issue.** Both are decisions,
   not omissions (§5, §8d).
8. **`readTimeMinutes` 7 → 4.** Slug, `id`, `publishedAt`, `status: published`,
   `tags` and all ten `sources[]` unchanged. The rewrite replaces
   `src/content/issues/2026-06-04-cockroach-janta-party/index.mdx` in place and
   is tabled for the operator's read before it is committed.
9. **The `# EDITOR NOTES` block is rewritten against the new spine**, carrying
   all five published guardrails plus the updated sixth (§8b). None is deleted;
   the sixth changes because the series changes.
