# The register plan — plain Indian voice, component-first issues

> **Status: v1 · SIGNED 2026-09-13.** The operator signed every RG-nn in §11
> as recommended, with two amendments: **RG-02** — Indian English with some
> Hindi, *never forced; if it does not fit, avoid it* (the contract's four
> tests and "when in doubt, leave it out"); **RG-16** — no announcement date
> for now; the operator will set one. A decision record in the same form as
> `REVAMP-PLAN.md` (RD-nn) and `CONTEXT-PLAN.md` (CD-nn). Every number in §1
> was measured in this session; the method is stated next to it.
>
> **Progress (2026-09-13):** Phase 1 (the contract, lexicon, jargon list,
> storyboard template, the composer and reader-panel agents, both routes'
> wiring, the prompt edits, `catalog-shapes.md`, the mode-library amendments),
> Phase 2 (`check:prose` in report mode) and RG-19 (how-to-read per kind, the
> source folded onto the plain line) are built. Next: Phase 3 (the four kinds
> and the annotation slot), then Phase 4 (the four flagship rewrites).
>
> **The brief, in one paragraph.** Readers — including heavy readers — say the
> product is a wall of words, does not grab them, and is written in a language
> only fluent people follow. The operator's diagnosis: the voice was built on
> American references for an audience that is Indian and reads English, Hindi
> and the Hinglish mix of today's generation. What must stay: the tone, the
> theme, the vision, and the way candidates are picked, researched and built.
> What must change: the writing layer — the simplest words, analogies and
> examples, the Hinglish register — and the component library, 98 kinds deep and
> rarely used, doing the heavy lifting visually. The brain (discover → research →
> structural argument) keeps doing the hard thinking; the mouth (draft → style →
> everything the reader sees) says it simply and shows the data. The operator
> has authorised overriding any Parallax rule where it makes the writing better.

---

## 0. The one-screen version

1. **The feedback is right, but the cause is not vocabulary or length.**
   Measured with one script against Finshots — the Indian benchmark for
   "plain" — Parallax prose is *easier* on every readability formula (grade 8.2
   vs 10.4, shorter sentences, fewer hard words), and across all ten published
   issues the median sentence is 12 words. What Parallax has none of is
   hand-holding: Finshots restates every number, asks a question before every
   turn, drops an analogy by sentence two. Parallax makes the reader infer — by
   design: the mode library *prescribes* "juxtaposition without the connective",
   "no glossing", "the reader is assumed to know". Those devices are the craft
   of the New Yorker / ESPN / Economist anchors the modes were extracted from
   (19 of the 24 named anchors are American or British). That is the "American
   references" problem in its exact mechanism: not the names, the inference
   load. Three more things the corpus shows: the copy is **fragmented into ~40
   blocks per issue** (5.7 per section, much of it explainer chrome); the reader
   meets **298 distinct proper nouns, 179 of them once**; and the register is
   *unplaced* rather than American — ₹, "crore" and Hinglish each appear
   **zero** times in ten issues, while `$` appears 54 times.
2. **The library is unused and the "visual" sections are text in disguise.** 20
   of 98 kinds have ever reached a reader. Six kinds are 79% of all published
   sections; only **17%** of sections are drawn graphics. 59% of published
   words sit in text-only sections; a `timeline` averages 295 words per use, a
   `paradox` 248 with no graphic at all. The drafter prompt inlines the data
   shape of exactly eleven kinds, and those are what gets used. No rule
   anywhere sets a floor on showing — every density rule is a ceiling on
   loudness. And the best evidence on chart reading (§10) says readers want
   *more* text inside the graphic, not less text overall: the fix is to move
   explanation into the charts as annotations, not only to cut it.
3. **The fix is a register change plus a composition change, gated.** A new
   runtime voice contract (explicit, concrete, hand-held, placed in India,
   English base with Hindi seasoning that is never load-bearing), a storyboard
   step that picks components by data shape before a word is drafted, caps on
   words and blocks and a floor on visual sections, an annotation layer on the
   workhorse charts, a deterministic prose gate built for this repo's data
   model (the off-the-shelf linters cannot see 86% of the prose), an LLM
   reader panel that tests comprehension with a quiz rather than scoring
   style, and a rewrite of the ten published issues, the explainer dictionary
   and the site's own copy — then real readers before the announcement.
4. **The date.** Today is 13 September; `/subscribe` promises the public
   opening on the 19th. The full plan is 7–9 working days plus reader
   turnaround. §9 gives two honest options; the recommendation is to move the
   announcement and announce a product that has been read by five real people
   in the new register.

---

## 1. What was measured

### 1.1 Finshots vs Parallax, same script, same method

Sample: the Finshots explainer on the Economic Survey 2026 (1,562 words of body
text) against the prose of two published issues: the El Niño opener + closer
(438 words) and the Everest/Fuji opener + intros (456 words). Script:
`readstats.mjs` / `feelstats.mjs` in this session's scratchpad (sentence split on
terminal punctuation, syllables by vowel-group heuristic, proper nouns excluded
from hard words). Formulas are a floor, not a verdict — but they settle one
question: **shorter sentences and simpler words are not what is missing.**

| Measure | Finshots | Parallax · El Niño | Parallax · Queue |
|---|---|---|---|
| Avg sentence length (words) | 18.4 | 15.7 | 17.5 |
| Sentences over 25 words | 26% | 18% | 15% |
| Flesch-Kincaid grade | 10.4 | 8.3 | 8.2 |
| Hard words (3+ syllables, non-proper) | 14.6% | 12.4% | 8.0% |
| Words per paragraph | 56 | 73 | 65 |

What differs is everything a reader feels as "being walked through it":

| Per 1,000 words | Finshots | El Niño | Queue |
|---|---|---|---|
| Restatements ("in simple terms", "that means", "to put that in perspective", "basically") | **7.0** | 0 | 0 |
| Questions to the reader | **2.5** | 0 | 0 |
| "we / us / our" | **9.6** | 0 | 0 |
| "you" | 5.1 | 0 | 6.6 |
| Analogies ("think of it as", "like a", "imagine") | 1.9 | 0 | 2.2 |
| Colons and semicolons (the literary joint) | 3.2 | 6.8 | **13.2** |
| Numbers per paragraph (avg / max) | 1.8 / 9 | **3.7** / 9 | 1.6 / 4 |
| Sub-heads per idea | 4 | 0 | 0 |

Read the two side by side and the mechanism is visible. Finshots, sentence two:
*"Think of it as the government's annual report card."* Parallax, sentence
three: *"the scarce good now being priced is no longer the summit. It is the
bottleneck."* The second is a better sentence and a worse explanation: the
reader has to work out what "a scarce good being priced" is, then that a
bottleneck can be one. Nothing restates it. The mode library asks for exactly
this — FORENSIC: "trust the reader absolutely, no glossing"; CALM-STRUCTURAL:
"place the two things; leave the verb out"; DRY WIT: "there is no explanation of
context; the reader is assumed to know." Applied by a capable model, those
instructions produce prose that is *measurably* simple and *experientially*
hard. That is the whole finding, and it is why "use simpler words" alone would
change nothing that readers noticed.

**The anchor count.** Of the 24 reference figures named across the eight mode
cards, 19 are American or British (Sagan, Attenborough, Tyson, Bryson,
Krulwich/Abumrad, Oliver, Stewart, Chappelle, Standage/Economist, Wodehouse,
Craig Brown, James Wood, Johnny Harris, Bourdain, Errol Morris, Wright Thompson,
McIlvanney, Foster Wallace, Ondaatje); five are Indian or Indian-origin (Ravish
Kumar, Pankaj Mishra, Arundhati Roy, Javed Akhtar, Pico Iyer). The library says
"patterns, not people", and that is true — but the patterns were harvested from
long-form magazine and broadcast craft whose reader chose to sit down with a
weekend supplement. The operator's hypothesis is confirmed at the level of
mechanism, not just taste.

### 1.2 The whole published corpus, measured

Method: every reader-facing string in the ten published issues' frontmatter
(100% of copy lives there; the MDX bodies are empty), parsed with the repo's
own `js-yaml`, split into running prose, headline text and data labels; the
`sources[]` bibliography and `story.beats` excluded. Same syllable and
sentence heuristics as §1.1.

| Issue | Reader words | Sections | Prose-section share | Avg sentence | FK grade | Hard words |
|---|---|---|---|---|---|---|
| delimitation | 907 | 7 | 0% | 10.0 | 7.3 | 15.5% |
| kessler-cascade | 1,476 | 8 | 25% | 11.2 | 8.9 | 19.2% |
| transgender-ratchet | 1,745 | 6 | 17% | 17.1 | **12.7** | **25.0%** |
| el-nino-new-floor | 1,774 | 8 | 25% | 12.2 | 7.1 | 13.3% |
| ai-coding-token-bill | 1,742 | 7 | 29% | 15.4 | 7.6 | 8.0% |
| amazon-tipping-point | 1,829 | 7 | 29% | 15.6 | 7.8 | 8.6% |
| arsenal-set-piece-title | 1,429 | 7 | 29% | 14.2 | 7.1 | 9.3% |
| asteroid-2024-yr4 | 1,529 | 6 | 17% | 13.6 | 6.4 | 7.7% |
| cockroach-janta-party | 1,821 | 7 | 14% | 17.1 | 9.5 | 12.1% |
| queue-is-the-product | 1,475 | 7 | 14% | 15.6 | 7.7 | 8.6% |
| **All ten** | **15,727** (avg 1,573) | 70 | — | **14.1** (median 12) | **8.2** | 12.6% |

Four things the corpus says, in the order they matter:

**(a) The wall is fragmentation, not volume.** An issue is ~1,570 words — a
genuine seven-minute read, exactly as declared. But those words arrive as
**~40 separate blocks of copy across 7 sections: 5.7 blocks per section,
averaging 33 words each.** Every section ships an eyebrow, a title, an intro, a
how-to-read panel, a plain line, a source line, a caption and per-datum notes.
The reader never gets a run; they get forty short stops. Two-thirds of all copy
(8,731 of 13,093 running-prose words) is intros, captions and data notes, not
body prose. The densest text in the product is the **197 small data notes**
(15% hard words) — timeline notes, tile notes, paradox details — not the
essays. And 69 published sections gained a how-to-read paragraph on 2026-09-04
when the `EXPLAIN.how` fallback was switched on for every kind: a design
decision that added a block to nearly every section of every issue.

**(b) Only 17% of sections are drawn graphics.** 38 of 70 sections (54%) are
text-composed — `prose`, `paradox`, `quote`, `comparison`, `bill-breakdown`,
`analogy`; 20 (29%) are number-tile or list hybrids (`data-readout`,
`timeline`); **12 (17%)** are genuine drawn graphics, and 12 of the 20 kinds
used appear exactly once. A visual explainer is rendering 17% graphics.

**(c) Rhythm, not length.** 928 published sentences: median 12 words, mean
14.1, p90 27, max 51; only 11.5% over 25 words. **41% of sentences are ten
words or shorter.** That is the FORENSIC / staccato register running as the
default, and inside 33-word blocks it reads as a list of assertions rather
than an argument. The GDS evidence on sentence length (§10) puts >90%
comprehension at 14 words — Parallax is already there. **Cutting sentences
shorter would make this worse.** Paragraphs are fine too: zero over 120 words,
longest 111.

**(d) The "complex references" are proper-noun throughput, and the register
is unplaced.** 768 proper-noun tokens, **298 distinct, 179 used exactly once**;
`transgender-ratchet` alone carries 77 distinct names at 9.8% of its words. A
reader meets a new name every 17 words and most of them never return. The
classic American tells score **zero** — no Congress, Senate, Fed, Wall Street,
Fahrenheit, miles, no Sagan or Oliver. What hits is `$` (54 times), US tech
company names (39) and NASA (38). On the other side: **₹ zero, "rupee" zero,
"crore" zero**, lakh 14, Hinglish effectively zero (six hits, all proper
nouns). Four of ten issues — arsenal, token-bill, el-niño, amazon — have
near-zero Indian anchoring; two have literally none. The register is not
American; it is *unplaced international-newspaper English with no Indian ground
under it*. The 3+-syllable list confirms it: the most frequent hard words are
amendment, temperature, already, asteroid, exactly, national, climate, agency,
baseline, probability, reservoir — abstract nouns a news reader knows, not
jargon; the difficulty is in what surrounds them.

The five longest sentences run 45–51 words; three of the five open with a
name or a date and stack a citation into the sentence ("The study, led by Nico
Wunderling of Goethe University Frankfurt and the Potsdam Institute and reported
by Mongabay and Carbon Brief's DeBriefed, is the first to…"). The three densest
paragraphs are all in `transgender-ratchet` — legal text quoted at statute
density (34.5% hard words). That issue is the outlier on every axis and the
clearest case for `jargon-buster` and `three-steps` (§5.3).

**(e) The head.** Words before the first graphic: **128–188** per issue.
Primers run 316–400 characters — all ten sit near the 420 ceiling. **Nine of
ten titles use one construction — "The ‹Noun› That ‹Verb›s"** (*The Orbit
That Remembers*, *The Pacific That No Longer Resets*, *The Ban That Made It
Bigger*) — and eight of ten deks are an antithesis ("X is not Y, it is Z"). The
titles are interchangeable and name no person, place, number or stake.

### 1.3 The component library, audited (all 23 issues, 10 published)

| Fact | Value |
|---|---|
| Kinds registered | 98 (all built and renderable; `hero` is dead — see below) |
| Kinds that have appeared in a **published** issue | **20** |
| Kinds never published | **78** |
| Kinds never used anywhere, showcase drafts included | 3 — `act-break`, `beat-sheet`, `elevation-profile` |
| Published sections | 70 |
| …drawn from six kinds (prose, data-readout, timeline, paradox, quote, comparison) | **55 (79%)** |
| Sections that are text-only (narrative kinds + `paradox`) | 36 of 70 (51%) |
| Published words that sit in text-only sections | **59%** (46–71% per issue) |
| Longest run of consecutive text-only sections | 3 (delimitation, kessler, cockroach) |

The "visual" workhorses carry most of the text load themselves: `prose` averages
**341 words per use (max 618)** with no schema cap on paragraphs; `timeline`
**295** (uncapped events, each `note` a sentence — story mode trims to six
events and drops every note, the reading page does not); `paradox` **248** and
renders two facing blocks of prose with no mark at all; `data-readout` 194.

Why the monoculture: `.claude/agents/drafter.md` Step 2 inlines the DATA shape
of exactly eleven kinds — timeline, bill-breakdown, vote-result, seat-chart,
paradox, analogy, quote, prose, data-readout, comparison, plus a one-line
mention of five topic kinds — and that inlined set is, almost exactly, the set
in use. The other 87 sit behind "READ the catalog", with a brake right after
("don't force a heavy component in"). The dossier's §7 picks the kinds and the
drafter executes them; the researcher is told "6–9 sections, 6–8 minutes". Not
one rule sets a minimum on showing: CANON §3 and the drafter's §2.4b are all
ceilings — at most one loud section per act, at most three loud per issue,
"everything else is quiet: prose, quote, data-readout". The act device those
rules depend on, `act-break`, has **zero uses in 23 issues**.

`hero` is a dead kind: `core/Hero.astro` was deleted in the launch design and
`pages/issues/[slug].astro` filters it out, but it is still in `SECTION_KINDS`,
still in the catalog as "always — every issue opens with exactly one", still
seeded by `_template/index.mdx` (`npm run new-issue`).

The catalog's 98 kinds sort into twelve data shapes (the lookup the storyboard
step in §5.2 will use): narrative (7) · peers compared row by row (6) · one
number against a threshold, or a few headline numbers (6) · time series and
dated sequence (16) · ranking (3) · composition, parts of a whole, layers (16) ·
process, flow, stage attrition (9) · geographic (11) · physics, orbits, physical
scale (13) · distribution, relationship, uncertainty (6) · network / DAG (2) ·
spatial field on a playing surface (3). The full kind-by-kind table is in
Appendix C.

### 1.4 The attention problem is the head of the issue

The first screen is words: eyebrow → title → hook → primer → facts rail → the
first section's intro → *then* the first graphic. The hooks are abstract:

- *"How a bill about women's empowerment became the vehicle for the biggest
  redrawing of Indian political power in 50 years."*
- *"At Everest and Fuji, managing the crowd and selling the crowd have become
  the same administrative act — the scarce good being priced is the bottleneck
  itself."*

Neither has a number, a "you", or a thing the reader can picture. Story mode
(`/s/<slug>/`, "the short version") exists precisely as the scroll-stopping
surface, but it derives its beats from `skimCaption` → `intro` → `title`, so it
inherits the same register.

### 1.5 The product chrome speaks the same register

Desk copy (`src/lib/desks.ts`): *"the procedure, the arithmetic, the incentive
that made the outcome inevitable before anyone voted."* About: *"Two eyes, one
object, a second angle"*, and a public block advertising **the eight voices** an
issue can use. The intro story: *"From the structure up."* The 90 default
explainer strings (`src/lib/explainers.ts`): several run past 40 words. The
labels themselves: "In plain terms", "How to read this". All of it is the
literary register, and all of it is read before any issue is.

### 1.6 What already points the right way — do not rebuild it

- **The social voice contract is already the target register.**
  `research/_voice/_voice-social.md`: *"a sharp friend explaining it over
  coffee"*, *"if a smart 15-year-old wouldn't follow it, it isn't done"*,
  *"humanize every number"*, *"define any jargon the instant it appears"*,
  contractions encouraged. Its header states the premise this plan retires:
  *"the site is literary and compressed for a reader who chose to sit down;
  social has to teach a stranger mid-scroll."* Readers have said the site's
  reader is mid-scroll too. The plan promotes the social register to the site
  and adds the Hindi layer on top.
- **The comprehension scaffolding is built.** How-to-read above, caption, plain
  line and source below, `skimCaption`, Skim mode, story mode, the ⤢ study
  view: the *slots* for explanation exist for every kind. The words inside them
  are the problem, not the frame.
- **The AI-tell catalog stays.** Plain is not sloppy; a Hinglish paragraph with
  two em-dashes is still broken. §3.6 adds the Hinglish-specific tells.
- **CANON §10 already promises** "a smart 15-year-old finishes every issue".
  This plan is how that sentence becomes enforceable.

### 1.7 Three technical facts found on the way

- **Justified prose with `hyphens: auto` under `<html lang="en">`**
  (`src/styles/base.css:861-864`, every layout) will hyphenate romanised Hindi
  by English rules — *sam-ajh*, *kyun-ki*. Fix: the inline renderer wraps Hindi
  runs in `<span lang="hi-Latn">` (browsers carry no hyphenation dictionary for
  it, so the word stays whole), or hyphenation is switched off for prose. RG-18.
- **Literata has no Devanagari**, and the share cards render from static
  Literata files. Roman script only — by necessity as well as by choice. RG-04.
- **No MCP connector fits.** The connector registry was searched for
  readability, grammar, prose-lint, Hindi and translation tools: nothing
  relevant (finance and compliance tools came back). The tooling is npm and
  CLI, §10. No new secrets are needed; the existing `ANTHROPIC_API_KEY` covers
  the API route.

---

## 2. What stays — the invariants

Signed once, cited everywhere below. Nothing in this plan touches:

- **The brand promise and the reframe engine.** *Stories you think you already
  understand*; every issue rebuilds a familiar thing from the structure up and
  shows the angle the reader was missing. The hook engine stays "you think you
  understand X — here's the part you were missing"; it just gets written for a
  person on a phone.
- **The brain.** Discovery, the source allowlists and diversity gate, the
  researcher, the dossier and its §1 structural argument, the candidate gate,
  the dossier gate. Unchanged.
- **Rigor.** No source, no section. Every claim traces; every quote verbatim;
  component data are claims; no advocacy; no invented facts; the verifier
  blocks. The operator's own read-aloud script says it best: *"No adjective
  doing the job a number should be doing."* That sentence survives intact.
- **The pipeline shape and the human gates.** One new step (the storyboard,
  §5.2) and one new gate agent (the reader panel, §7.2) are added; nothing is
  removed.
- **The design system.** Literata, the six worlds, the 1280 frame, flat
  surfaces, the comprehension layer's four fields. Copy changes; rules of the
  page do not.
- **The eight rhetorical jobs.** A section still does one kind of work — awe,
  walk-through, naming a cost, exposure, deadpan, investigation, mechanism with
  stakes, a landing. What changes is the register those jobs are done in (§4).
- **The AI-tell catalog**, extended, never relaxed.

---

## 3. The register — the new writing contract

This becomes `research/_voice/_voice-core.md` v2, the file every writing agent
loads at runtime. §3 is its content; the file is written after signature.

### 3.1 Who we write for

Four personas, used by the reader panel (§7.2) and by every writer as the
imagined reader. They are deliberately concrete.

| | Persona | Why they are on the panel |
|---|---|---|
| P1 | **Aarav, 24, Lucknow.** Works at a bank branch. Reads Hindi papers and English headlines, watches Dhruv Rathee. Hinglish is his natural register. | The core reader. If Aarav has to re-read a sentence, it is rewritten. |
| P2 | **Meera, 31, Bengaluru.** Product manager. English-first, Hindi at home. Reads on a phone in a cab. | Patience is the constraint: she leaves at the first paragraph that does not pay off. |
| P3 | **Sana, 19, Pune.** Second-year college. Instagram and YouTube. Hinglish native. | The attention test: the hook either stops her thumb or it does not. |
| P4 | **Karthik, 28, Chennai.** Engineer. English and Tamil, **no Hindi**. | The skip test. If Karthik loses the meaning of a sentence, a Hindi word was carrying it, and that is a defect (RG-03). |

The question every persona answers per section: *"In one line, what did this
section just tell you?"* and *"Which sentence lost you, if any?"*

### 3.2 The dial — three levels, one default

| Level | What it is | Where it is used |
|---|---|---|
| **L1 — plain Indian English** | No Hindi. Short sentences, Indian examples, ₹ / lakh / crore, one idea per sentence. | Titles, captions, how-to-read, plain lines, source lines, data labels, legal and technical terms, all UI chrome. |
| **L2 — English base, Hindi seasoning** *(the default)* | The English alone carries the meaning; the Hindi carries the warmth. At most one Hindi phrase per paragraph. | Hook, dek, primer, section titles, intros, prose, `skimCaption`, quote follow-ups, story beats. |
| **L3 — Hinglish-dominant** | Hindi carries clauses. | Optional, and only in social posts and story-mode hooks. Never on the reading page. |

Worked samples (the operator approves the *dial*, not the sentences):

**El Niño, the "staircase" paragraph.** Original (74 words, and the reader must
infer what "oscillating around a baseline" means):

> *The conventional reading of ENSO — the El Niño / La Niña oscillation in the
> Pacific — runs like this: warm years spike upward, cool years pull the global
> mean back to a long-run average, and the system oscillates around a slowly
> rising baseline. The data since 2015 reads differently. Each La Niña year now
> lands above the previous El Niño year from a decade before. The system is not
> oscillating around a baseline. It is climbing a staircase.*

L1: *Most people picture El Niño and La Niña as a swing: hot years, cool years,
and back to the middle. The numbers since 2015 say something else. Every "cool"
La Niña year is now warmer than the "hot" El Niño year from ten years earlier.
That is not a swing. That is a staircase, and it only goes up.*

L2: *Most people picture El Niño and La Niña as a jhoola: garam saal, thanda
saal, and back to the middle. The numbers since 2015 say something else. Every
"thanda" La Niña year is now warmer than the "garam" El Niño year from ten years
before. Yeh jhoola nahi hai. It's a staircase, and it only goes up.*

L3: *El Niño aur La Niña ko log ek jhoola samajhte hain: garam saal, thanda
saal, aur beech mein sab average par wapas. But 2015 ke baad ka data kuch aur
kehta hai. Ab har "thanda" La Niña saal bhi das saal pehle ke "garam" El Niño
saal se zyada garam hai. Yeh jhoola nahi hai. Yeh seedhi hai, aur hum sirf upar
ja rahe hain.*

Delete every Hindi word from the L2 version and it still says the whole thing.
That is RG-03 in one sentence.

**The mechanism paragraph, with the analogy the original never gives.**
Original: *"Each El Niño transfers some of that ocean-stored heat to the
atmosphere and lifts surface temperatures. The subsequent La Niña suppresses
Pacific sea-surface temperatures again, but cannot return the global mean to
its previous floor — because the reservoir is now permanently warmer."*

L2: *Think of the ocean as a giant geyser that never switches off. El Niño is
when the hot water spills into the air, so the world's temperature jumps. La
Niña is when the tap closes for a while. Hawa thodi thandi ho jaati hai, but the
geyser is still hotter than last time. So the next "cool" year starts higher
than the last one did.*

**The Everest/Fuji lead.** Original: *"Read the headlines and it looks like a
routine tightening of overtourism rules… At both mountains, the scarce good now
being priced is no longer the summit. It is the bottleneck — the queue, the
slot, the narrow window of safe weather everyone competes for at once."*

L2: *Headlines mein yeh bas "overtourism rules" lagta hai: two famous mountains,
a bit harder to climb now. But look closer. Everest aur Fuji par jo cheez ab bik
rahi hai, woh summit nahi hai. It's the line. The queue, the time-slot, the few
safe-weather hours that everyone wants at the same time. Nepal and Japan have
started selling the wait itself.*

**Two hooks.**

| Now | Proposed |
|---|---|
| How a bill about women's empowerment became the vehicle for the biggest redrawing of Indian political power in 50 years. | Your MP speaks for 30 lakh people. A Tamil Nadu MP speaks for 18 lakh. One bill tried to fix that gap — and lost by 54 votes. |
| At Everest and Fuji, managing the crowd and selling the crowd have become the same administrative act — the scarce good being priced is the bottleneck itself. | Everest ka ticket: $15,000. Fuji ka ticket: ₹2,300. Both countries are now selling the same thing — your place in the line. |

**Desk copy (chrome, L1).** *"Not who won. How the winning was arranged — the
procedure, the arithmetic, the incentive that made the outcome inevitable
before anyone voted."* → *"Not who won. How the win was set up — the rules, the
maths, and the reasons that decided it before anyone voted."*

### 3.3 Field-by-field register map

| Field | Level | Cap | Note |
|---|---|---|---|
| `title` | L1 | ≤ 8 words | Search- and share-card-safe. One `*accent*` word still allowed. |
| `hook` | L2 | ≤ 25 words | The hook formula, §6.1: a number, a "you", a thing you can picture, the twist. |
| `dek` | L2 | ≤ 14 words | Where the Hindi lives if the title has none. |
| `primer` | L2 | 3 sentences, ≤ 60 words | Rewritten as *what happened · why it matters · what you'll see*. Schema bound (80–420 chars) unchanged. |
| `eyebrow` | L1 | 2–4 words | ALL CAPS stays. Hindi eyebrows allowed by ruling (RG-02 note). |
| section `title` | L2 | ≤ 8 words | |
| `intro` | L2 | ≤ 45 words | Frames the graphic; one question allowed as its first sentence. |
| `prose` | L2 | ≤ 200 words per section, ≤ 90 per paragraph, ≤ 3 prose sections per issue | Each prose section carries ≥ 1 analogy or concrete example and ≥ 1 restatement. |
| `skimCaption` | L2 | ≤ 40 words | This is the story-mode beat; write it as one. |
| `caption` | L1 | ≤ 25 words | The data claim. Verifier-traced. No Hindi. |
| `howToRead` | L1 | schema 40–360 chars | Static reading leads, control trails (unchanged). |
| `plain` | L1 | schema ≤ 220 chars | Form only (unchanged). |
| `source` | L1 | — | |
| component `data` text (timeline notes, tile notes, paradox details, comparison cells) | L1 | timeline note ≤ 20 words; tile note ≤ 15; paradox `detail` ≤ 45; ≤ 6 timeline events | The text load hides here (§1.3): 197 data notes at 15% hard words. |
| `data.annotations[].text` (the in-chart callouts, RG-20) | L1 | ≤ 12 words, ≤ 3 per chart | States the finding on the mark that shows it. |
| quote `followup` | L2 | ≤ 45 words | |
| `story.hook` / `story.beats[].text` | L2, L3 allowed | schema 40–320 chars | Authored for every launch issue. |
| UI chrome, EXPLAIN strings | L1 | EXPLAIN `what` ≤ 30 words, `how` ≤ 30 words | A short list of L2 labels is a ruling (RG-15). |

### 3.4 The hard rules

1. **Hindi is never load-bearing.** Remove every Hindi word and the English still
   says everything. The reader panel's Karthik is the test; the gate's
   heuristic is a sentence with fewer than 60% English tokens (§7.1).
2. **Roman script only, set roman.** No Devanagari (the typeface has none). No
   italics on Hindi — italics mark it "foreign", which is the opposite of the
   point.
3. **Seasoning, not sauce.** At most one Hindi phrase per paragraph; never in
   two consecutive sentences; at most two "matlab / basically" per section.
4. **Pan-India words only.** The vocabulary Bollywood, cricket commentary and
   the family WhatsApp group made national — *samjho, matlab, kyunki, bas,
   seedha, asli, kaafi, thoda, bilkul, jugaad, jhoola, tamasha, hisaab*. The
   lexicon file (§3.7) is the allowlist; regional slang is out; *yaar* is out
   of politics.
5. **No Hindi in the precision layer.** Captions, how-to-read, plain, source,
   data labels, legal and technical terms, numbers and units.
6. **Every term of art is glossed in-line on first use**, in the same sentence
   or the next: *"xG — matlab, how many goals those chances usually turn
   into."* Not in a footnote, not in a later section.
7. **Every abstraction gets a concrete thing in the same section.** An analogy
   or a worked example a reader can picture. "The scarce good being priced" is
   never allowed to stand alone.
8. **Every number gets a comparison a reader can feel.** Indian scale first:
   ₹, lakh, crore; "the population of Delhi"; "one IPL season"; "a Mumbai local
   at 9 a.m."; "four Maggi packets". Dollars always carry a rupee conversion.
9. **Direct address is allowed everywhere.** "You" and "we" are how Indians
   explain things to each other. One question per section, as an opener; never
   as a closer (that tell stays).
10. **After every graphic, one plain sentence says what it showed.** The
    caption carries the data; the next intro or the `skimCaption` carries the
    "so what" in the reader's words.
11. **Rhythm, not brevity.** The corpus already passes every sentence-length
    test (median 12 words) and reads as staccato: 41% of sentences are ten
    words or shorter. So the caps are guardrails against the rewrite drifting
    long — mean ≤ 16, 95th percentile ≤ 25, hard fail over 35; paragraphs ≤ 90
    words — and the *rule* is connective tissue: no run of three sentences
    under eight words; every paragraph has at least one sentence that joins
    two ideas with *because, so, which means, but*. ≤ 2 numbers per sentence,
    ≤ 4 per paragraph.
12. **Numbers are copied, never retyped.** A rewrite that changes a numeral is
    a defect the gate catches by diffing (§7.1).
13. **Names are rationed.** ≤ 12 distinct named people and organisations per
    issue (the corpus averages 30, one issue carries 77). Every name that
    stays is introduced with a role in the same sentence — *"Alan Arnette, who
    has logged every Everest season for twenty years"* — and a name used once
    is a name to cut: say "an Everest chronicler" instead.
14. **Place the issue in India.** Every issue carries Indian ground under it:
    every `$` figure with its ₹ equivalent, every big number with an Indian
    comparison, at least one Indian place, institution or habit the reader
    owns. Four of ten published issues have none; two have literally none.
15. **Titles state the finding, not the subject.** *"Every 'cool' year is now
    hotter than the hot years before it"*, not *"The Pacific That No Longer
    Resets"*. Nine of ten current titles share one construction; the gate
    flags a repeat of "The ‹Noun› That ‹Verb›s". The same rule for section
    titles: a reader who reads only the titles should get the argument.

### 3.5 References — Indian first, global when universal

Use freely: cricket, Bollywood, the railways, the kirana shop, UPI, the
monsoon, board exams, the joint family, the housing society, the wedding
budget, the Mumbai local, the Delhi metro, the RTO, the ration card, the
Aadhaar queue, IPL auctions, the electricity bill, the LPG cylinder. Use with a
rupee conversion or an Indian equivalent: anything in dollars, miles,
Fahrenheit, acres, US political institutions, US pop culture. Never as the
only anchor: a reference the reader has to have grown up in another country to
feel.

### 3.6 Hinglish-specific tells, added to the AI-tell catalog

| Tell | Rule |
|---|---|
| "Toh dosto…" / "Namaskar" — the YouTube intro | Never. The register is a friend across the table, not a channel opening. |
| Hindi in every sentence | Rule 3 above. If it reads like a translation exercise, it is one. |
| *yaar, bhai, bro* | Out of politics and earth; at most once per issue elsewhere. |
| Devanagari, italicised Hindi | Rule 2. |
| Idioms translated literally into English, or English idioms into Hindi | Cut. Use the idiom in the language it belongs to. |
| "samjhe?" / "simple hai na?" | Condescension. Cut. |
| "basically" / "matlab" more than twice in a section | Cut the extras. |
| A Hindi word that changes the claim ("shayad" softening a sourced fact) | The English sentence carries the exact claim; Hindi never hedges it. |

### 3.7 The lexicon file

`research/_voice/hinglish-lexicon.md` — one spelling per word (*samajh* not
*samaj*; *kyunki* not *kyonki*; *zyada* not *jyada*; *thoda* not *thora*), the
allowed set, the banned set, and per-desk notes (politics: fewest Hindi words,
never satire in Hindi; sports: most; space and earth: the awe words —
*aasmaan, dharti, samundar*). The gate reads it (§7.1); the writers read it.
Built once, offline: the 200–400 words the writers will actually use are
round-tripped through a transliterator to one canonical Roman spelling (§10.1),
then **read by a person** before commit — *samaj* (society) and *samajh*
(understanding) are different words, and a machine round-trip merges them.
No live language-detection model anywhere in the pipeline: the lexicon is the
detector, it diffs in a pull request, and it has no Windows build story to
break.

---

## 4. The mode library reform

The eight modes stay as **jobs**. Their **cards** change, because the cards are
where the inference load is prescribed.

**Rule 0 (new): the register outranks the mode.** A mode may shape the rhythm
and the opening move; it may never suspend §3. "No glossing" is struck from
every card.

| Mode | Job (unchanged) | What the card loses | What the card gains | Candidate Indian anchors (patterns, not people) |
|---|---|---|---|---|
| AWE | scale, deep time | "awe doesn't ask"; the liturgical closer as default | scale-anchors in Indian units ("the distance from Kanyakumari to Kashmir, 40 times"); one plain sentence after the big number | ISRO's own mission commentary; Jayant Narlikar; Harsha Bhogle when a record falls; Attenborough stays (universal, plain) |
| CONVERSATIONAL EXPLAINER | walk-through | "casual + technical, rapid switching" | becomes the **default mode for at least half the sections**; the Finshots pattern: analogy first, number, restatement, question, next | Dhruv Rathee; Finshots; Zerodha Varsity; Mohak Mangal; Think School |
| CALM-STRUCTURAL | naming a cost | "juxtaposition **without** the connective" | juxtaposition **with** the connective — place the two things *and* say what joins them | Ravish Kumar (keep); Faye D'Souza; P. Sainath |
| SATIRICAL EXPOSURE | contradiction by data | nothing structural | stays ≤ 1 per issue; **0 in politics** by default (the existing "restraint" clause, made a rule) | Lallantop's deadpan; Akash Banerjee — with the politics rule above |
| DRY WIT | deadpan precision | the Latinate stiff-collar vocabulary ("disport, repair to, contrive") — the single most anti-plain instruction in the library | **demoted to a device**: one deadpan sentence inside another mode's section, never a whole section | Lallantop headlines |
| INVESTIGATION | anomaly, then evidence | nothing — "Look. Notice." tested best of the current modes (the Queue issue's 6.6 "you" per 1,000) | the anomaly is always a graphic the reader can see first | Johnny Harris stays (visual-anchor-first is universal); Nitish Rajput; Scroll / The Reporters' Collective |
| FORENSIC | mechanism with stakes | "trust the reader absolutely, no glossing"; "periodic sentences" | the call-back structure stays; every technical fact still fused to its stake, now in two short sentences instead of one long one | Harsha Bhogle; Rukmini S. (*Whole Numbers and Half Truths*) |
| LYRICAL COMPRESSION | a landing | the Ondaatje fracture | ≤ 1 paragraph per issue, plain words, one image | Gulzar; Ruskin Bond; Javed Akhtar (keep); Sudha Murty for plainness |

The anchor column is a proposal for the operator, who knows this landscape
better than an agent does; the *pattern* changes are the ruling (RG-05). The
runtime contract `_voice-core.md` is rewritten first (every agent loads it);
`mode-library.md` v2 follows with new pattern cards, new reference quotes and
the same maintenance section. The About page's public "eight voices" block is
retired (RG-15): it advertises the literary machine to the reader who just
said the machine was the problem.

Struck from the drafter and stylist prompts, because §3 contradicts them:
"contractions allowed in CONVERSATIONAL EXPLAINER mode only"; "avoid 'I' in all
modes" (kept — but "we" and "you" are free in every mode); "no rhetorical
questions" (narrowed to closers); "6–8 minutes" (now 4–5); the eleven inline
data shapes (§5.2 replaces them).

---

## 5. Component-first composition

### 5.1 Floors, not just ceilings (extends CANON §3)

| Rule | Value | Why |
|---|---|---|
| Visual sections (non-narrative, non-`paradox`) | **≥ 60% of sections** | 51% of published sections are text-only today; only 17% are drawn graphics. |
| Adjacent text-only sections | **never** | Runs of three exist in three issues. |
| First section after the head | a graphic or a `data-readout` | The number leads; the first screen shows something. |
| Words before the first graphic (title + dek + hook + primer + first intro) | **≤ 80** | 128–188 today. |
| `prose` sections per issue | ≤ 3, each ≤ 200 words | 341 average today, 618 max. |
| Reader-facing words per issue (the gate's count: every frontmatter string a reader sees) | **≤ 1,100** | 1,573 average today; Mint's Plain Facts pieces run 900–1,200. |
| Text blocks per section, besides the title | **≤ 3** (intro · the graphic's own labels · one line below) | 5.7 today: eyebrow, title, intro, how-to-read, plain, source, caption, notes. |
| How-to-read panel | renders only where `EXPLAIN[kind].needsHow` is set (instruments and counter-intuitive forms) or a `howToRead` is authored; the plain line and the source fold into one line | The 2026-09-04 fallback put a paragraph on 69 published sections. RG-19. |
| Unbroken prose between two figures | ≤ 250 words | The one ratio with a content analysis behind it (§10). |
| Read time | 4–5 minutes | 6–8 today. |
| Annotations inside the workhorse charts | every chart with a finding carries ≥ 1 in-graphic callout (≤ 12 words) that states it | Readers prefer annotated charts to sparse ones (Stokes et al., n=302, §10); today the charts carry captions outside, never callouts inside. RG-20. |
| Kinds from outside the six workhorses | ≥ 1 per issue, ≥ 2 when the dossier's data supports it | 78 kinds have never been seen. |
| `timeline` | ≤ 6 events, notes ≤ 20 words | Story mode already trims to 6. |
| `paradox` | `detail` ≤ 45 words each; used ≤ 1 per issue | It is prose in a costume. |
| Loudness ceilings (CANON §3: one hero, ≤ 3 loud, no adjacent WebGL) | unchanged | |
| `act-break` | required at each act turn, **or** the act rule is dropped | Zero uses in 23 issues; a rule nobody follows is not a rule. RG-06 decides which. |
| `hero` | retired from `SECTION_KINDS`, the catalog and the template | Dead since 2026-09-08. |

### 5.2 The storyboard step (Phase 2.5, new)

Between the dossier and the draft. Input: the dossier. Output:
`research/<cat>/<date>-<slug>-storyboard.md`, one row per beat:

| # | What the reader must get (one line, L2) | Data shape (G1–G12) | Kind | Hero? | Words allowed around it | The analogy / example | Plain-line sketch |
|---|---|---|---|---|---|---|---|

The operator reads it in two minutes and flips `Status: approved`. This is a
new human gate, but a cheap one, and it moves the expensive draft (Opus, $3–7
on the API route) onto a skeleton that has already been judged for showing
versus telling. It also fixes the monoculture at the root: the storyboard picks
from all twelve data shapes because the catalog gains a **§0 "data shape → kind"
lookup** at its head (the grouping in Appendix C), and the drafter's inline
eleven-kind list is deleted. The drafter executes the storyboard the way it
executes the dossier today.

Two ways to build it — the ruling is RG-07:

- **A separate `composer` agent** (recommended): read-only on the repo apart
  from its one output file; reviewable; runs on Sonnet on the API route
  (~$0.30–0.60) and Opus on the Claude Code route; a `/pipeline-storyboard`
  slash command and `npm run pipeline:storyboard`.
- **A Step 0 inside the drafter**: no new agent, no new gate, but the operator
  never sees the skeleton before paying for the draft.

### 5.3 Kinds that plain writing needs (≤ 4 new, via `/add-section-kind`)

Verified against the catalog: none of these exists as a reusable kind.

| Kind | What it is | Nearest existing kind, and why it is not this |
|---|---|---|
| `you-think` | Two panels: *what most people think* / *what the data shows* — the brand reframe as a component, one line each plus one number | `paradox` is two legitimate sides in tension; this is one misconception corrected. |
| `jargon-buster` | 2–4 terms with one-line L2 meanings, rendered as cells | `comparison` is rows of values; `bill-breakdown` is provisions. |
| `number-sense` | One big number with its everyday equivalent drawn beside it ("₹15,000 crore = 3 years of Delhi's water bill") | `data-readout` is 3–6 tiles; this is one number made physical. |
| `three-steps` | A mechanism in three cards, 1 → 2 → 3, each ≤ 20 words | `bill-passage` is stages of a bill; `beat-sheet` is timed beats and has never been used. |

Also: `analogy` is politics-bespoke (`brothers[]`, the joint-family shape); it
is generalised to a universal *this ↔ that* mapping so every desk can use it.
Each new kind is a blueprint + component + the nine registry places; four in
parallel is roughly one working day. The 21 blueprinted-but-unbuilt kinds
(Waves 2–4) are **not** part of this plan — usage, not count, is the problem.

**The annotation layer (RG-20).** The strongest evidence found on chart
reading says readers prefer heavily annotated charts to sparse ones and to
text alone (§10). Parallax charts carry their explanation *outside* — intro
above, caption and plain line below — and none of the workhorse charts has a
slot for a callout *inside*. Add an optional `data.annotations[]`
(`{ at, text ≤ 12 words, side? }`) to the eight charts the backlist and the
storyboard will actually reach first — `timeline` (a callout on the hinge
event), `climate-strip`, `adoption-curve`, `benchmark-chart`, `approval-chart`,
`scaling-plot`, `xg-race`, `elo-river` — rendered as in-SVG labels under the
existing in-SVG type rules (literal font stack, `--accent-deep` on light
grounds, ≥ 9.5px at 375). The finding then lives on the mark it describes, the
section title states it, and the intro shrinks. Word count falls; information
does not move out of the reader's eye-line.

### 5.4 Data for the new components comes from the dossiers that exist

Every published issue has its dossier in `research/<cat>/`. The storyboard-check
on a published issue (§8) picks components whose data the dossier already
carries — no new research, no new facts, the verifier's trace still holds.

---

## 6. The head of the issue (attention)

### 6.1 The hook formula

≤ 25 words. A number the reader can feel, a "you" or a thing they own, the
twist. Examples in §3.2. The verifier flags a hook with no number and no
concrete noun (HOOK-ABSTRACT, §7.3).

### 6.2 Title, dek, primer

Title L1, ≤ 8 words, one accent word allowed — it has to survive a share card
and a search box. The dek carries the Hindi. The primer becomes three short
sentences — *what happened · why it matters to you · what you're about to
see* — inside the existing 80–420 character bound (no schema change), rendered
as it is today on the 4px accent rule.

### 6.3 The first screen shows something

Rule 5.1 (the first section is a graphic or a data-readout) is what changes
the first screen; the layout does not move. For every launch issue the `story`
frontmatter is authored (hook + 3–6 beats at L2), so the shareable short
version is written, not derived.

---

## 7. The gates

### 7.1 Deterministic — `scripts/check-prose.mjs` → `npm run check:prose`

Runs over every issue (published and draft, reported separately). **Report mode
first**; it joins `prebuild` as a gate only after the ten published issues pass
(§9), so a half-migrated backlist never breaks a deploy.

| Check | Rule | Flag |
|---|---|---|
| Composition | §5.1 floors and ceilings, including blocks per section and words before the first graphic | TEXT-HEAVY, PROSE-RUN, NO-LEAD-GRAPHIC, WORKHORSE-ONLY, HEAD-HEAVY, CHROME-HEAVY |
| Field caps | §3.3 | FIELD-OVER-CAP (with the field and the count) |
| Sentence / paragraph | mean ≤ 16, p95 ≤ 25, fail > 35; paragraph ≤ 90; no run of three sentences under 8 words | SENTENCE-OVER-CAP, PARA-OVER-CAP, STACCATO |
| Numbers per unit | ≤ 2 per sentence, ≤ 4 per paragraph | NUMBER-DENSE |
| Hand-holding floor | ≥ 1 restatement and ≥ 1 analogy/example per prose section; ≥ 1 comparison per section that carries a number; ≥ 1 connective sentence per paragraph | NO-RESTATEMENT, NO-ANALOGY, BARE-NUMBER, NO-CONNECTIVE |
| Names | ≤ 12 distinct named entities per issue; a name used once with no role phrase | NAME-THROUGHPUT, NAME-UNPLACED |
| Jargon | a term from `research/_voice/jargon.md` appears before its gloss marker | JARGON-UNGLOSSED |
| Hard words | 3+ syllables **and** not in the Parallax known-word list (seeded from `dale-chall`, then extended with Indian civic vocabulary and the lexicon — the raw list flags *population, census, amendment* as unfamiliar, which is wrong for this reader) | HARD-WORD-DENSE, warn-only |
| Hindi rules | lexicon spelling; density (rule 3); Devanagari = fail; a sentence under 60% English tokens = load-bearing | HINDI-SPELLING, HINDI-DENSE, HINDI-SCRIPT, HINDI-LOAD-BEARING |
| Hindi in the precision layer | any lexicon word in caption / howToRead / plain / source / data labels | HINDI-FIELD |
| Indian ground | `$` without `₹`; miles, Fahrenheit, acres; an issue with no ₹ / lakh / crore / Indian place or comparison at all | FOREIGN-ANCHOR, NO-INDIAN-ANCHOR |
| Title formula | `^The .+ That ` on the issue title, or the same construction on two section titles | TITLE-FORMULA |
| The AI tells | em-dash > 1 per paragraph; "It is not X. It is Y."; triple-fragment close; "First… Second…"; the §3.6 Hinglish tells | the existing names, plus HINGLISH-TELL |
| Readability formulas | **ARI only** (no syllable counting — `syllable()` gets 3 of 12 romanised Hindi words wrong), on English-dominant fields only, grade ≤ 9, **warn-only** | ARI-HIGH |
| **Number preservation** | on a rewrite, the multiset of numerals in the old file equals the new file's (proper-noun years excepted) | NUMBER-DRIFT — a blocking flag |

Why formulas are advisory and Hinglish-blind by design: measured in this
session, `retext-readability` at its default target flags a *Hinglish*
sentence at 25 words where the equivalent plain-English sentence survives past
36 — the familiar-word lists behind Dale-Chall and Spache read Hindi as jargon.
Gating on it would push the drafter back toward formal English, the opposite
of the goal. And the eye-tracking evidence (§10) says formulas and LLM grade
estimates alike are poor predictors of adult reading ease; word frequency and
sentence length are better, and comprehension tests are better still.

Stack: `retext-english` + `retext-simplify` (327 plain-phrase patterns) +
`retext-passive` + `automated-readability` + `dale-chall` (as the seed list
only), on top of the `retext` / `unified` / `nlcst` packages already present
transitively in `node_modules`; the GSA plain-language "don't say / say" pairs
(~231, public domain) vendored as substitutions; the composition, Hindi, name
and number checks are custom code (~300–400 lines) walking the known prose
fields with the `gray-matter` the repo already ships. **Not Vale as the gate** —
it lints only string-valued top-level frontmatter fields and reaches 14.4% of
this repo's prose by character count (measured on the delimitation issue: two
alerts, both on `primer`). Not `retext-intensify` (9 of 11 warnings on a real
Parallax paragraph were false positives). Windows note (CD-08): a scratch
`.mjs`, never a one-liner. Where it runs: `prebuild` beside `check-catalog.mjs`,
and the existing `PostToolUse` Edit|Write hook (`gate-registry.mjs` is the
precedent) so a drafting agent sees the flags on the edit that caused them.

### 7.2 The reader panel — a new read-only agent

`.claude/agents/reader-panel.md`, the same shape as `voice-checker`: no edit
tools, returns a report. It tests **comprehension, not style** — the design
the evidence supports (§10: the KnowledgeGain result, that an LLM reader
persona answering "what did you learn" questions tracks human learning far
better than any prose rubric).

How it works: the storyboard (§5.2) carries **three questions the issue must
teach**, written from the dossier — ground truth the drafter never sees as a
target. The panel reads the draft cold, once per persona of §3.1, and for
each: answers the three questions from the draft alone; gives the one-line
retell per section; quotes the first sentence it had to read twice; and only
then fills a short form (1–5 per section, with the reason). Issue verdict:
**PASS** when all three questions are answered correctly by P1–P3, every
section scores ≥ 4, and Karthik's retells match the captions; **REVISE**
otherwise; **BLOCK** when a question is missed by two personas. Runs after the
draft (before the stylist) and again after the stylist. Calibration rules
taken from the judge literature (§10): reason and retell *before* scoring, in
a form-filling pass; sections in isolation before the issue (position bias);
absolute rubric with anchored examples, never pairwise; never let it rewrite.
Judge and drafter should differ where the route allows it — on the API route
Sonnet judges Opus drafts, which is the right way round; on the Claude Code
route both are Opus, so the quiz's objective answers are what guard against
the 10–25% self-flattery a same-model judge shows. Roughly $0.50–1.00 per run
on the API route.

### 7.3 Verifier additions

New flags, same report: **JARGON-UNGLOSSED**, **HINDI-LOAD-BEARING**,
**HINDI-FIELD**, **TEXT-HEAVY**, **PROSE-RUN**, **HOOK-ABSTRACT** (no number,
no concrete noun), **NUMBER-DRIFT** (blocking). The stylist's Step 4.6 structure
audit gains the §5.1 floors. The social writer and voice-checker load the same
v2 contract, so every surface moves together.

### 7.4 Real readers — the only analytics this site will ever have

The site ships no analytics by design, so comprehension is measured off-site.
Protocol: five to eight readers from the target group (two of them non-Hindi
speakers), each issue sent as a link over WhatsApp with a three-question Google
Form: *retell the hook in one line · the one fact you'd repeat to a friend ·
the sentence that lost you*. Pass: ≥ 80% retell the hook correctly. Run once
before the announcement on the flagship issues, then per issue for the first
month. Ten minutes of the operator's time per issue to read the answers.

---

## 8. What gets rewritten

### 8.1 The ten published issues

Method per issue, in this order: storyboard-check against the existing dossier
(which sections become graphics, which of the 78 unseen kinds the data already
supports) → new component data authored from the dossier → every prose field
rewritten at L2 with numbers copied → `check:prose` → reader panel → verifier
(the trace holds because no fact changed) → operator read → `published`. The
issue files are independent, so several rewrites run in parallel as subagents,
one file each (the standing rule: registry files are the orchestrator's alone).

Word counts are the gate's measure (every frontmatter string a reader sees,
§1.2), not `wc -w` on the file.

| Issue | Reader words now | Target | Blocks now | Notes |
|---|---|---|---|---|
| 2026-04-24-delimitation | 907 | ≤ 1,100 | 41 | Already under the cap and the most visual; its work is blocks, names and the title. `analogy` and `paradox` become the model for `you-think`. |
| 2026-04-24-kessler-cascade | 1,476 | ≤ 1,100 | 45 | Opens and closes on prose; `orbit-globe` / `constellation-swarm` data exists in the space dossier. |
| 2026-05-02-transgender-ratchet | 1,745 | ≤ 1,100 | 40 | The outlier on every axis (77 names, statute-density text). Politics: fewest Hindi words, no satire; `jargon-buster` + `three-steps`. |
| 2026-05-03-el-nino-new-floor | 1,774 | ≤ 1,100 | 50 | The staircase wants `climate-spiral` or a stepped series with annotations, not two prose bookends. |
| 2026-06-04-ai-coding-token-bill | 1,742 | ≤ 1,100 | 40 | 37 `$` figures and no ₹: `number-sense` for the bill, rupee conversions throughout. |
| 2026-06-04-amazon-tipping-point | 1,829 | ≤ 1,100 | 39 | `carbon-loop` (stock-and-flow) is the mechanism; it exists and has never been published. |
| 2026-06-04-arsenal-set-piece-title | 1,429 | ≤ 1,100 | 34 | Zero Indian anchoring today. Sports: most Hindi allowed; `xg-race` / `momentum-wave` exist. |
| 2026-06-04-asteroid-2024-yr4 | 1,529 | ≤ 1,100 | 38 | Already 1:5 text:viz; mostly a prose rewrite and 34 NASA mentions to thin. |
| 2026-06-04-cockroach-janta-party | 1,821 | ≤ 1,100 | 36 | Run of three text sections to break. |
| 2026-06-04-queue-is-the-product | 1,475 | ≤ 1,100 | 38 | `number-sense` for the two ticket prices; ₹ for both. |

Order: the flagship set first — one per desk, chosen by the operator (RG-14
suggests delimitation, el-niño, arsenal, queue) — then the rest. Effort per
issue on the Claude Code route: roughly 1.5–2.5 hours of agent time plus 30–45
minutes of operator reading; ten issues in parallel batches is two to three
working days.

### 8.2 The explainer dictionary

All 90 `EXPLAIN` entries rewritten at L1 within the new caps, in one batch; the
29 draft-only strings still phrased as modal controls ("Drag to spin…", a
known residual) fixed in the same pass. One commit; `check:catalog` guards the
coverage.

### 8.3 The site's own copy

One copy deck — `docs/design/COPY-DECK.md`, every string old → new — that the
operator approves in one read, then applied: `DESK_COPY` and `DESK_REGISTER`;
the home promises; About (lede, the three steps, the voices block retired, the
mark copy kept — it is good and it is short); `/subscribe`; the intro story's
five scenes; the reading gate; the labels ("In plain terms", "How to read
this", "Skim", "Save"); the story-mode CTA; the newsletter notice. The 13 drafts
are untouched; the six showcase issues stay as internal fixtures.

---

## 9. Sequence, effort and the date

Today is 13 September 2026. `/subscribe` tells beta readers that Parallax opens
to the public on the 19th — six days, including a weekend. Honest sizing on
the Claude Code route (Opus every phase, per the standing model policy):

| Phase | Work | Output | Sizing |
|---|---|---|---|
| **0 · Rulings** | The operator signs §11. | this file, signed | 1 read |
| **1 · The contract** | `_voice-core.md` v2, the lexicon, the jargon list, `mode-library.md` v2, the drafter / stylist / verifier / social-writer / voice-checker prompt edits, the reader-panel agent, the composer agent + slash command + `pipeline.ts` phase, the catalog §0 lookup, the schema caps, `hero` retired. | files, one commit per group | 2 sessions |
| **2 · The gate** | `check-prose.mjs` in report mode; run on the backlist; thresholds tuned against the ten issues. | `npm run check:prose` | 1 session |
| **3 · Kinds** | `you-think`, `jargon-buster`, `number-sense`, `three-steps`; `analogy` generalised; the annotation slot on the eight workhorse charts; the how-to-read gating flag in EXPLAIN. Parallel component agents, orchestrator wires. | 98 → 102 (or 101 with `hero` gone) | 1.5 days |
| **4 · Flagships** | Four issues rewritten end to end through the new pipeline; EXPLAIN batch; the copy deck applied. | 4 issues, chrome | 1.5 days |
| **5 · Readers** | Five to eight real readers on the four flagships; fixes. | the form results | 3–5 calendar days, overlapping 6 |
| **6 · The rest** | Six issues rewritten; `check:prose` promoted into `prebuild`; STATE-OF-PLAY, AGENTS.md §6, CANON §3/§10 updated to match. | 10 issues, gates on | 2 days |
| **7 · Announce** | The first fresh issue runs the new pipeline end to end (discover → storyboard → draft → panel → stylist → verify) as the launch issue. | issue № 11, the announcement | 1 day |

Roughly **8–10 working days plus reader turnaround**, against six calendar
days including a weekend. Two honest options (RG-16):

- **A · Announce on the 19th with a smaller surface.** Phases 0–4 only: the
  contract, the gate in report mode, the four new kinds, four flagship issues,
  the chrome. The other six stay live in the old register (hiding a published
  issue means flipping it to `draft`, which breaks its link for anyone who has
  it — not recommended). Reader testing happens on the live product in the
  first week. Risk: the first people the announcement brings meet six old-
  register issues, and the ones who already said "wall of words" find it half
  fixed.
- **B · Announce on the 26th, or 3 October** *(recommended)*. Everything in
  the table, every issue in the new register, five real readers having said so
  before a stranger does. The `/subscribe` line about the 19th becomes a one-
  word edit. The operator's own script states the wager: reference value, not
  reach — a week's delay costs nothing that wager values.

---

## 10. Tooling — what to add, what to skip, how

The research ran against the actual repo, not the tools' documentation, and
two obvious choices failed for reasons their docs would not predict. The
short version: **build the gate; buy almost nothing.**

### 10.1 What to adopt

| Tool | What for | Install | Verdict |
|---|---|---|---|
| **`scripts/check-prose.mjs`** (ours) | the deterministic gate, §7.1 | — | Build it. Nothing off the shelf can walk nested frontmatter fields, and that is where 86% of the prose is. |
| **retext** — `retext-english`, `retext-simplify`, `retext-passive` | plain-phrase substitutions (327 patterns), passive voice, sentence tokenising | `npm i -D retext-english retext-simplify retext-passive unified` | MIT, wooorm / unified collective. Last releases 2023 — finished, not abandoned. Programmatic over strings, no files, no CLI. |
| **`automated-readability`** | the one formula we run (ARI: characters and words only, no syllables) | `npm i -D automated-readability` | MIT. It is also Hemingway's algorithm (grade 9 target, yellow at 12, red at 14), so the operator's desktop check and the gate agree. |
| **`dale-chall`** | the *seed* for the Parallax known-word list | `npm i -D dale-chall` | 2,942 familiar words, US 4th-grade, 1995. Flags *population, census, amendment, delimitation* as hard — extend it, never gate on it raw. |
| **GSA plain-language pairs** | ~231 "don't say / say" substitutions | vendor `use-simple-words-phrases.md` from `github.com/GSA/plainlanguage.gov` | Public domain (CC0), no attribution burden. GOV.UK's ~30 banned words are OGL v3 (attribution) — take the words, drop its ban on negative contractions. |
| **`@cloudrumbles/indic-transliterate` + `@indic-transliteration/sanscript`** | build the Hinglish spelling lockfile **once, offline** | `npm i -D @cloudrumbles/indic-transliterate @indic-transliteration/sanscript` | MIT, 2025 releases; an ONNX port of AI4Bharat's IndicXlit, pure TS, no Python. Round-trip *samajh → समझ → canonical Roman* gives one spelling per word. **Never live**: *samaj* (society) and *samajh* (understanding) are different words a blind round-trip merges — the 200–400-word lockfile is human-reviewed, then committed, then the gate reads only the file. |
| **The reader panel** (ours) | comprehension judge, §7.2 | — | An agent file; no dependency. |
| **Vale** (optional, scoped) | keep the substitution list in YAML if that is preferred to JS; lint the MDX body and the four top-level fields | `npm i -D @vvago/vale` (v3.21.0, verified working on this machine) | MIT, very active. Parses MDX natively since 3.18. **But it lints only string-valued top-level frontmatter fields** — measured on the delimitation issue: 2 alerts, both on `primer`; 14.4% of the prose reached. Fine as a second opinion; never the gate. |

Also to read, not install: **Jyoti Sanyal, *Indlish* (2006)** — the one
prescriptive Indian source on plain Indian English, aimed at exactly this
failure ("in an inebriated condition" for "drunk"; nouniness; officialese). The
Finshots co-founder's stated method (assume absolute ignorance; lay the
foundational concept first; build toward the headline; accept repetition) is
the nearest thing to a published Indian plain-explainer method — no numbers
anywhere; nobody has measured Finshots, Mint or The Ken sentence norms, which
is why §1.1 did.

### 10.2 What to skip, and why

- **LanguageTool** — no `en-IN` variant exists (en-AU/CA/GB/NZ/US/ZA only); it
  checks grammar, and grammar is not the complaint; a JVM plus a Docker
  service for comma splices.
- **Hemingway Editor** — no API, no CLI, editor-only. Its algorithm is ARI;
  six lines reimplement it.
- **proselint** — Python runtime on Windows for marginal gain; if wanted, take
  it as a Vale package.
- **`retext-readability`** as a gate — measured penalty against Hinglish: flags
  at 25 words what plain English survives past 36. Advisory on English-only
  fields at most. **`retext-intensify`** — 9 of 11 warnings on a real Parallax
  paragraph were false positives (*so, that, then, could, understand*). **`retext-usage`** — pre-1.0, 2022.
- **Word-level language ID models** (l3cube `hing-bert-lid`, AI4Bharat
  IndicLID) — PyTorch or sentence-level, 200 MB–1.4 GB; a committed lexicon
  gives a ±5-point Hindi ratio in microseconds and diffs in a pull request.
  CLD3 and fastText are archived; `franc` detects Hindi only by seeing
  Devanagari. Microsoft's GLUECoS benchmark was archived in July 2026.
- **SARI / ASSET / Newsela** (simplification metrics and datasets) — need
  multiple reference simplifications per sentence, which do not exist here;
  no Hindi or code-mixed corpus exists at all. Few-shot exemplars for the
  stylist at most.
- **Every prose-linting MCP server.** The official MCP registry lists none;
  the connector registry searched in §1.7 has none; Vale-MCP has 26 stars and
  the widely cited `npx vale-mcp` does not exist on npm; textlint has a real
  first-party MCP (`npx textlint --mcp`) but an MCP is the wrong shape for a
  build gate — a process boundary around a 40 ms function. The repo already
  has the right mechanism: `prebuild` and the `PostToolUse` hook.
- **Chasing a Flesch-Kincaid grade.** Eye-tracking evidence (Gruteke Klein et
  al., 2025–26) finds formulas, NLP systems and frontier LLMs alike poor
  predictors of adult reading ease; simple word-level properties do better.
  Gate on what predicts difficulty — names, numbers, connectives, comprehension
  — not on a grade number.

### 10.3 What the evidence says about text and charts

- **Stokes et al., IEEE VIS 2022 (n = 302):** readers were not put off by
  heavily annotated charts — they *preferred* the most-annotated version over
  sparser ones and over text alone. "Too text-heavy" is a relocation problem.
- **A visual every ~250 words** is the only ratio with a content analysis
  behind it (award-winning online stories placed a visual every 180–300
  words). Nobody — not The Pudding, not Reuters Graphics, not the FT —
  publishes a prose-to-visual ratio; The Pudding's pitch page rejects any idea
  that would work as a 1,000-word text piece, which is a sharper rule.
- **The title states the finding** (Aisch); the annotation layer transforms
  the reading (Cox); direct labels over legends, two levels of type at most,
  about ten words as the ceiling for centred text (Muth).
- **Indian comparables:** Mint's Plain Facts — ten recent pieces measured
  live, 2–6 minutes, median 4.5 ≈ 900–1,200 words, half the headlines naming
  the chart. Finshots is a language benchmark, not a visual one: one hero image,
  zero charts. IndiaSpend has rebranded and is prose-led. The Amul billboard
  study (Kathpalia & Ong, 2015: 59% of 1,191 hoardings Hindi-English mixed) is
  the evidence that the L2 register is mainstream Indian, not a novelty.

### 10.4 Judge design, from the literature

MT-Bench (Zheng et al., 2023) — position bias up to 75% for the first-shown
option, verbosity bias, 10–25% self-enhancement when a model judges its own
text. G-Eval (Liu et al., 2023) — generate the evaluation steps first, then
form-fill; reason before scoring. KnowledgeGain (2026) — score what the reader
*learned*, validated against human studies, with an LLM reader simulator used
to rank drafts before human review. Anthropic's own eval guidance — pair
deterministic checks with an LLM rubric for the subjective half. §7.2 is built
from exactly these.

### 10.5 What is on this machine

Node 24, Python 3.12, winget; `retext`, `retext-latin`, `retext-stringify`,
`unified`, `nlcst-to-string`, `vfile` already present transitively. Absent:
Vale (the npm route installs cleanly), textstat, poppler (which is why the
voice-session PDF was read from its HTML twin). No new secrets; the existing
`ANTHROPIC_API_KEY` covers the API route for the composer and the panel.

---

## 11. Decisions for signature

| # | Decision | Recommendation | Alternative | What it changes |
|---|---|---|---|---|
| **RG-01** | The premise | The site adopts the social register: explicit, concrete, hand-held. The reader is mid-scroll, not sitting down. | Keep the literary site voice and simplify only vocabulary. (The measurements say this would change nothing readers noticed.) | `_voice-core.md` §0, the About copy, every agent. |
| **RG-02** | The dial | L2 default for prose fields; L1 for the precision layer and chrome; L3 only on social and story hooks. | L1 everywhere (no Hindi) — safest for non-Hindi readers, loses the operator's stated intent. | §3.3 map. |
| **RG-03** | Hindi is never load-bearing | Hard rule; Karthik on the panel; the 60%-English heuristic in the gate. | — (this is the rule that makes RG-02 safe; the plan does not offer an alternative). | gate + panel. |
| **RG-04** | Script and setting | Roman only, set roman, lexicon-governed spelling. | Allow Devanagari with a paired face (Tiro Devanagari, Noto Serif Devanagari) — a type decision, and the share cards would need it too. | typography, cards. |
| **RG-05** | The modes | Eight jobs stay; Rule 0 register-outranks-mode; DRY WIT demoted to a device; the cards lose every "no glossing / without the connective" clause; anchors re-proposed. | Keep the cards and rely on the stylist to soften them. | `mode-library.md` v2. |
| **RG-06** | Composition floors | The §5.1 table, including ≥ 60% visual and ≤ 1,300 words. The `act-break` rule: **drop it** (never used) rather than enforce it. | Enforce `act-break` at every turn. | CANON §3 amendment, gate. |
| **RG-07** | The storyboard step | A separate `composer` agent with a cheap human gate. | A Step 0 inside the drafter. | pipeline.ts, a slash command, an agent file. |
| **RG-08** | Kind selection | Catalog §0 data-shape lookup; delete the drafter's inline eleven-kind list. | — | catalog, drafter. |
| **RG-09** | New kinds | The four in §5.3 plus `analogy` generalised; `hero` retired. | Fewer — `you-think` and `number-sense` are the two that matter most. | 9 registry places × 4. |
| **RG-10** | The head | Hook formula, L1 title, three-sentence primer, first section shows a graphic, `story` authored for launch issues. | — | drafter, verifier flag. |
| **RG-11** | The deterministic gate | `check:prose` in report mode now; into `prebuild` and the edit hook after the backlist passes; the §7.1 thresholds; ARI only, formulas warn-only; a Parallax known-word list, not Dale-Chall raw. | Warn-only forever. | scripts, package.json, settings.json hook. |
| **RG-12** | The reader panel | New read-only agent; four personas; a three-question quiz written from the dossier at storyboard time; runs twice per issue; Opus on the Claude Code route. | Fold the personas into the verifier's voice audit (cheaper, weaker). | agent file, storyboard template, prompts. |
| **RG-13** | Verifier flags + number preservation | The §7.3 set; NUMBER-DRIFT blocks. | — | verifier, script. |
| **RG-14** | The backlist | Rewrite all ten; flagships first: delimitation, el-niño, arsenal, queue. | Flagships only before the announcement (Option A). | content. |
| **RG-15** | Chrome | The copy deck; About's voices block retired; labels stay L1 with at most three L2 labels the operator picks (e.g. "Seedhi baat" for the plain line). | Labels unchanged. | pages, components, EXPLAIN. |
| **RG-16** | The date | Option B: 26 September or 3 October. | Option A: the 19th with four flagships. | `/subscribe` copy, the announcement. |
| **RG-17** | Real readers | The §7.4 protocol before the announcement and per issue for a month. | Skip — no data on whether it worked. | operator time. |
| **RG-18** | `hi-Latn` and hyphenation | Wrap Hindi runs in `<span lang="hi-Latn">` via the inline renderer; keep justification. | Turn hyphenation off for prose. | `src/lib/text.ts`, base.css. |
| **RG-19** | The chrome budget | ≤ 3 text blocks around a graphic besides its title; the how-to-read panel renders only for instruments and counter-intuitive forms (an `EXPLAIN[kind].needsHow` flag) or when authored; plain line and source fold into one line. **Re-takes the 2026-09-04 ruling** that switched the `EXPLAIN.how` fallback on for every kind — with the measurement it did not have: 5.7 blocks per section, a paragraph added to 69 published sections. | Keep the fallback on everywhere and cut elsewhere. | `core/Section.astro`, `SectionBody.astro`, `explainers.ts`, CANON §10. |
| **RG-20** | The annotation layer | `data.annotations[]` on the eight workhorse charts (§5.3), rendered in-SVG; the finding lives on the mark. | Captions only, as today. | eight components, catalog, schema. |
| **RG-21** | Names rationed | ≤ 12 distinct named entities per issue; every name introduced with a role; once-used names cut. | ≤ 20. | gate flag, drafter, stylist. |
| **RG-22** | Titles and the head | Titles state the finding; the "The ‹Noun› That ‹Verb›s" construction retired; ≤ 80 words before the first graphic; primer as three sentences. | Keep the house title style. | drafter, gate flag. |

---

## 12. Rules this plan overrides, by name

The operator authorised this; it is listed so nothing is bent quietly.

| Rule | Where | What happens to it |
|---|---|---|
| "The site is literary and compressed for a reader who chose to sit down" | `_voice-social.md` header | Retired. One register, two lengths. |
| "Contractions are allowed in CONVERSATIONAL EXPLAINER mode only" | `stylist.md` Step 4 | Struck; contractions everywhere. |
| "'We' / 'our' in AWE mode; avoid 'I' in all modes" | `stylist.md`, mode cards | "We" and "you" free in every mode; "I" stays out. |
| "No rhetorical questions as section closers" | `drafter.md` | Kept for closers; questions allowed as openers, one per section. |
| "Trust the reader absolutely. No glossing." | FORENSIC card | Struck. |
| "Juxtaposition without the connective" | CALM-STRUCTURAL card, LYRICAL card | Becomes *with* the connective. |
| "Stiff-collar vocabulary … Latinate verbs" | DRY WIT card | Struck; the mode becomes a device. |
| "The reader is assumed to know" | DRY WIT card | Struck. |
| 6–8 minute issues, 6–9 sections, 2,000–2,800 words | researcher, drafter, `research/AGENTS.md` §9 | 4–5 minutes, ≤ 1,300 words; section count unchanged. |
| The eleven inline data shapes | `drafter.md` Step 2 | Deleted; catalog §0 instead. |
| Density = ceilings only | CANON §3 | Floors added (§5.1). |
| `hero` "always — every issue opens with exactly one" | catalog, template | Retired. |
| The public "eight voices" block | `about.astro` | Retired. |
| "The `EXPLAIN.how` fallback is ON for every kind" (ruled 2026-09-04) | CANON §10, `core/Section.astro`, `SectionBody.astro` | Re-taken with the measurement (RG-19): renders where the form needs it, not on every section. |
| Section titles as "the structural revelation … with one `*italic*` accent" | `drafter.md` Step 4 | Titles state the finding in plain words; the accent word may stay. |
| "The reader is assumed to know" / no per-issue limit on names | mode cards, drafter | Names rationed (RG-21); every name carries a role. |
| "Only `status !== 'draft'` renders" and "only the operator flips it" | everywhere | **Unchanged.** |
| The AI-tell catalog | everywhere | **Unchanged, extended** (§3.6). |
| Sourcing, verbatim quotes, no advocacy, no invented facts | everywhere | **Unchanged.** |

`AGENTS.md` §6 and §7's content rules, `research/AGENTS.md` §7/§9,
`.claude/rules/editorial-voice.md` and CANON §3/§10 are updated to match after
signature — in the same commits as the changes they describe, never before.

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| Non-Hindi readers (Tamil, Bengali, the North-East, the diaspora) feel excluded | RG-03 and Karthik; L1 in the precision layer; the title never carries Hindi. |
| Forced Hinglish reads as a brand trying too hard — the "cringe" failure | The density rule (one phrase per paragraph), the lexicon, §3.6, and the panel's Sana. The test sentence for every writer: *would a Lallantop sub-editor wince?* |
| Search and sharing: Hinglish spellings vary, and a Hinglish title is unsearchable | Titles L1; the lexicon fixes one spelling; the dek carries the Hindi. |
| Facts drift while sentences are rewritten | Numbers are copied not retyped; NUMBER-DRIFT blocks; the verifier re-runs on every rewritten issue. |
| The model writes "AI Hinglish" — grammatical, stilted, every sentence salted | §3.6 tells in the gate; the panel; the lexicon's per-desk notes; the operator's ear on the flagship four before the rest are run. |
| Readability formulas mislead (they already say Parallax is easy, and the retext default penalises Hinglish by ~11 words a sentence) | ARI only, warn-only, English-dominant fields only; the gate measures names, numbers, connectives and blocks; the panel measures comprehension; real readers decide. |
| The chrome cut (RG-19) removes a how-to-read a reader needed | The flag is per kind, set from the 2026-09-04 copy review (29 "cue" strings, the instruments, the counter-intuitive forms); an authored `howToRead` always renders; the ⤢ study view keeps the full text. |
| Annotations clutter the charts at 375px | The in-SVG type rules already hold (≥ 9.5px, `min-width` scroll); ≤ 12 words per callout, ≤ 3 per chart; the silhouette test in CANON §13 applies. |
| Simplifying into wrongness — an analogy that misstates the mechanism | The analogy is a claim: the verifier checks that it does not contradict the dossier; the panel's retell shows what readers took away. |
| The plan slips the date | RG-16 is decided up front, not discovered on the 18th. |
| Hyphenation breaks Hindi words in justified prose | RG-18. |
| The desk voices flatten into one | Worlds still differ by colour and subject; the per-desk lexicon notes keep sports looser than politics. |

---

## 14. Open questions for the operator (non-blocking)

1. Are there Indian writers or channels you want as anchors instead of the
   §4 proposals? The pattern change is the ruling; the names are yours.
2. The three L2 chrome labels (RG-15): which, if any?
3. Do you want a Hindi eyebrow style ("ASLI KAHANI", "HISAAB") or eyebrows kept
   English?
4. Who are the five readers? Two should not speak Hindi.
5. Option A or B on the date — everything in §9 is sized for B.
6. RG-19 re-takes a ruling you made nine days ago on the how-to-read fallback.
   The measurement is new (5.7 blocks per section; 69 sections gained a
   paragraph); the call is yours to keep or re-take.
7. The name cap (RG-21) at 12: the delimitation issue, the most visual and the
   one readers found easiest, carries about that many. Higher if you want it.

---

## Appendix A — the samples at three levels

The worked samples are all in §3.2 (three levels of the staircase paragraph,
the mechanism paragraph with its analogy, the Everest/Fuji lead, two hooks,
one line of desk copy). Once the dial is signed they move, with more, into
`research/_voice/` as the worked examples the v2 contract cites — every
example a real published sentence and its rewrite, never an invented one.

## Appendix A2 — how the measurements were made

Three small scripts, written this session, become the seed of
`check-prose.mjs`: a readability pass (sentence split, syllable heuristic,
Flesch-Kincaid, ARI-equivalent, hard-word share, proper nouns excluded), a
hand-holding pass (per 1,000 words: restatements, questions, direct address,
analogies, abstract nouns, colons and semicolons, numbers per paragraph,
sub-heads), and a corpus walker over every frontmatter prose field of all 23
issues using the repo's own `js-yaml` (field families, blocks per section,
proper-noun throughput, cultural-reference and Hindi counts). The Finshots
sample was one article fetched on 2026-09-12 and used for statistics only.
Nothing in the repo was modified by the measurement.

## Appendix B — the persona cards

§3.1, written out for the reader-panel agent's prompt: background, what they
read, what loses them, what they would repeat to a friend. Karthik's card ends
with the rule he exists to test.

## Appendix C — the 98 kinds by data shape (the storyboard lookup)

**[3D]** = WebGL scene · **[i]** = has a control.

- **G1 · Narrative, no data (7):** `hero` (dead), `act-break`, `prose`, `quote`, `analogy`, `beat-sheet`, `plate`.
- **G2 · Peers compared row by row (6):** `comparison`, `paradox`, `city-compare`, `match-stat-line`, `player-radar`, `player-card`.
- **G3 · One number against a threshold, or a few headline numbers (6):** `data-readout`, `vote-result`, `carbon-gauge`, `swing-dial`, `throughput-dial`, `margin-bullets` [i].
- **G4 · Time series and dated sequence (16):** `timeline`, `approval-chart`, `climate-strip`, `adoption-curve`, `launch-stats`, `moore-ladder`, `elo-river`, `climate-spiral` [i], `commit-grid`, `descent-profile`, `latency-waterfall`, `state-timeline` [i], `climate-calendar`, `season-wheel`, `xg-race` [i], `momentum-wave`.
- **G5 · Ranking (3):** `benchmark-chart`, `league-table`, `margin-ladder`.
- **G6 · Composition, parts of a whole, layers (16):** `seat-chart`, `bill-breakdown`, `chamber` [3D], `coalition-orbit` [3D], `coalition-calculus` [i], `age-pyramid` [i], `attrition-waffle` [i], `channel-ternary` [i], `chip-die`, `orbital-shells`, `delta-v-ladder`, `signal-readout`, `elevation-profile`, `core-sample`, `arch-stack`, `power-matrix`.
- **G7 · Process, flow, stage attrition (9):** `bill-passage`, `bill-funnel` [i], `vote-flow`, `power-flow`, `ballot-flow`, `carbon-loop`, `journey-map`, `route-card`, `itinerary-reel`.
- **G8 · Geographic (11):** `region-map`, `data-globe` [3D], `route-globe` [3D], `terrain-relief` [3D], `plate-motion` [3D], `storm-track` [3D], `packet-trace` [3D], `terminator-globe` [3D], `gerrymander-lens`, `city-grid`, `timezone-arc`.
- **G9 · Physics, orbits, physical scale (13):** `solar-system` [3D][i], `orbit-globe` [3D], `constellation-swarm` [3D], `flight-of-the-ball` [3D], `orbit-trace`, `trajectory-arc`, `transfer-window` [i], `lagrange-map`, `eclipse-cone`, `atmosphere-column`, `altitude-oxygen`, `sea-level-tank`, `elevation-trek`.
- **G10 · Distribution, relationship, uncertainty (6):** `scaling-plot` [i], `pace-ridge`, `finish-interval` [i], `queue-cliff` [i], `fare-terrain`, `quake-depth`.
- **G11 · Network / DAG (2):** `version-graph`, `neural-flow` [3D].
- **G12 · Spatial field on a playing surface (3):** `tactics-pitch`, `shot-map`, `court-value`.

The proposed new kinds land in G2 (`you-think`), G1 (`jargon-buster`,
`three-steps`) and G3 (`number-sense`).
