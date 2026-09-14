# Parallax Voice Core — the runtime contract

> **v2 · signed by the operator 2026-09-13.** Written under
> `docs/REGISTER-PLAN.md` (RG-01…RG-05, RG-10, RG-21, RG-22) and the dial ruled
> the same day: *plain Indian English by default, Hindi only where it fits,
> never forced.* v1 (2026-06-21) is the previous commit of this file.
> `mode-library.md` is still v1 until its own rewrite lands; **where the two
> disagree, this file wins.** The anchors in §4 were confirmed at signing.
>
> **Every writing agent loads this file every run** — drafter, stylist,
> composer, social-writer, reader-panel, voice-checker, news-classifier. It is
> the single source of truth for how Parallax sounds at any length: an issue, a
> section, a caption, a thread, one post. The leading underscore keeps it out
> of any content collection.

---

## 0. The brand, in one line (unchanged)

**Parallax publishes "Stories you think you already understand."** Every piece —
issue or post — rebuilds a familiar topic from its *structure* and shows the
reader the angle they were missing. The voice is the parallax shift itself: same
object, the position moved. The hook engine is still *"You think you understand
X. Here's the part you were missing."* What changed in v2 is who it is said to,
and how.

**Brand-vs-legal naming split (do not "fix"):** body copy, posts, hooks,
mastheads say **Parallax**; `<title>` tags, RSS metadata, footer copyright and
the About colophon say **Parallax Lens** (™ in the colophon).

---

## 1. Who is reading

Write for four people. They sit on the reader panel and they sit in your head
while you write.

| | Reader | What they do to your draft |
|---|---|---|
| P1 | **Aarav, 24, Lucknow.** Works at a bank branch. Reads Hindi papers and English headlines, watches Dhruv Rathee. Hinglish is his natural register. | The core reader. If Aarav has to read a sentence twice, rewrite it. |
| P2 | **Meera, 31, Bengaluru.** Product manager. English-first, Hindi at home. Reads on a phone in a cab. | Leaves at the first paragraph that does not pay off. |
| P3 | **Sana, 19, Pune.** Second-year college. Instagram and YouTube. Hinglish native. | The hook either stops her thumb or it does not. |
| P4 | **Karthik, 28, Chennai.** Engineer. English and Tamil, **no Hindi.** | The skip test. If Karthik loses the meaning, a Hindi word was carrying it. That is a defect. |

The reader is on a phone, mid-scroll, and did not choose to sit down. Every
sentence earns the next one. (v1 said the site reader "chose to sit down" and
the social reader did not. Readers told us otherwise. There is one reader now,
at two lengths.)

---

## 2. How Parallax talks — the register

**Plain Indian English is the floor and the default.** Explicit, concrete,
warm, placed in India. The reader is walked, never left to infer. Then — only
where it fits — a Hindi word.

### The dial

| Level | What it is | Where |
|---|---|---|
| **L1 · plain Indian English** | No Hindi. Short sentences, Indian examples, ₹ / lakh / crore. | **The default for every field.** The only level allowed in the precision layer: `caption`, `howToRead`, `plain`, `source`, data labels, legal and technical terms, all UI chrome. |
| **L2 · a Hindi word where it is the natural word** | English carries the meaning; the Hindi carries warmth. | Allowed in prose fields only: `hook`, `dek`, `primer`, titles, `intro`, `prose`, `skimCaption`, quote follow-ups, story beats. |
| **L3 · Hindi-dominant** | Hindi carries clauses. | Social posts and story hooks only, and only when `_voice-social.md` asks for it. **Never on the reading page.** |

### The four tests every Hindi word passes (fail one, cut it)

1. **The skip test.** Delete it. The English still says everything. (Karthik.)
2. **The natural-word test.** It is the word an Indian would actually say in
   that sentence in conversation — *jhoola, hisaab, jugaad, matlab* — not a
   translation of the English word standing next to it.
3. **The wince test.** A Lallantop sub-editor would not wince. Forced, cute,
   "brand Hinglish" and YouTube-intro Hindi are out.
4. **The precision test.** It never modifies, hedges or counts a number, a
   unit or a term of art — *lagbhag 15,000*, *das lakh*, *shayad* — and it
   never appears in a caption, a how-to-read, a plain line, a source line or
   a data label. A possessive or a connective standing beside a figure
   (*Everest ka ticket: $15,000*) is allowed: the figure itself stays exactly
   as sourced. (Worded this way on 2026-09-13, when the queue storyboard found
   the earlier "nowhere near a number" contradicting §9's signed example.)

**When in doubt, leave it out.** Most paragraphs will have no Hindi at all,
and that is correct. Ceiling: one Hindi phrase per paragraph, never in two
consecutive sentences, at most two *matlab / basically* per section.

### Script and setting

Roman script only — the typeface has no Devanagari and the share cards render
from static Literata. Hindi is set **roman, never italic**: italics mark it as
foreign, which is the opposite of the point. One spelling per word, from
`research/_voice/hinglish-lexicon.md` (to be created under the plan; until it
exists: *samajh, kyunki, zyada, thoda, matlab, jhoola, hisaab, jugaad, asli,
seedha, bilkul, kaafi, bas*). Per desk: politics carries the fewest Hindi
words and never a Hindi joke; sports the most; space and earth may use the
awe words (*aasmaan, dharti, samundar*).

---

## 3. The rules

Every prose field, every length. The gate (`check:prose`, when it lands) and
the reader panel test these; until then, the writer does.

1. **Hindi is never load-bearing.** See §2. The single rule that makes the
   rest safe.
2. **Every term of art is explained the moment it appears**, in the same
   sentence or the next — *"xG, matlab how many goals those chances usually
   turn into."* Not in a footnote, not in a later section, not in the
   how-to-read panel.
3. **Every abstraction gets a concrete thing in the same section** — an
   analogy or a worked example the reader can picture. "The scarce good being
   priced" never stands alone; "the mountain is selling the wait itself" can.
4. **Every number gets a comparison the reader can feel**, Indian scale
   first: ₹, lakh, crore; the population of Delhi; one IPL season; a Mumbai
   local at nine in the morning; four packets of Maggi. Use the unit the
   reader counts in: crore for Indian figures, both for global ones ("1.2
   billion — 120 crore"). **Foreign currency stays in its own currency, as
   the primary figure.** A CURRENT figure — a price in force, a fee, a
   valuation from this year or last — gets an approximate rupee equivalent in
   brackets after it: *$15,000 (about ₹12.5 lakh)*, with the rate and its
   month in the section's source line. A HISTORICAL figure — a 2017
   valuation, a 2019 price — stays in dollars or pounds alone: converting it
   at today's rate invents a number that never existed. (Operator ruling,
   2026-09-14, replacing "every dollar figure carries its rupee equivalent".)
5. **Restate after every graphic.** The caption carries the data; the next
   sentence the reader meets — the **following section's intro**, or this
   section's caption — says what it showed, in the reader's words. Not
   `skimCaption`: that field renders only in Skim mode (`base.css`, the
   `.px-skim-caption-block` rule) and a restatement put there is invisible on
   the normal page. (Corrected 2026-09-13 after the queue rewrite's panel
   found six restatements hidden this way.)
6. **Direct address is free.** "You" and "we" in every mode. One question per
   section, as an opener, never as a closer. Never "I".
7. **Rhythm, not brevity.** The published corpus already has a 12-word median
   sentence and reads as staccato. The caps are guardrails — mean ≤ 16 words,
   95th percentile ≤ 25, nothing over 35; paragraphs ≤ 90 words — and the rule
   is connective tissue: no run of three sentences under eight words; every
   paragraph has at least one sentence that joins two ideas with *because, so,
   which means, but*.
8. **Numbers per unit.** ≤ 2 in a sentence, ≤ 4 in a paragraph. A paragraph
   with nine numbers is a table that has not been drawn yet.
9. **Names are rationed.** ≤ 12 distinct named people and organisations per
   issue. Every name that stays is introduced with its role in the same
   sentence — *"Alan Arnette, who has logged every Everest season for twenty
   years"*. A name used once is a name to cut: say "an Everest chronicler".
   Never stack a citation into a sentence ("the study, led by X of Y and
   reported by Z and W…"); the source line carries that.
10. **Place the issue in India.** Every issue has Indian ground under it: a
    bracketed ₹ beside each current $ (rule 4), the
    for every $, an Indian comparison for every big number, at least one
    Indian place, institution or habit the reader owns. Global references
    only when universal; nothing the reader had to grow up elsewhere to feel.
11. **Titles state the finding, not the subject.** *"Every 'cool' year is now
    hotter than the hot years before it"*, not *"The Pacific That No Longer
    Resets"*. The construction "The ‹Noun› That ‹Verb›s" is retired. A reader
    who reads only the titles gets the argument.
12. **The hook is ≤ 25 words with a number the reader can feel, a "you" or a
    thing they own, and the twist.** The dek carries the Hindi if the title
    has none. The primer is three short sentences: what happened · why it
    matters to you · what you are about to see (inside the 80–420 character
    bound).
13. **Numbers are copied, never retyped.** A rewrite that changes a numeral is
    a defect; the gate diffs them.
14. **Facts are sacred and Hindi never hedges them.** *Shayad* does not soften
    a sourced claim. The English sentence carries the exact claim.
15. **No advocacy, no wire tone, no invented consequence** (unchanged from v1
    and the verifier's catalog). Plain is not sloppy.

---

## 4. The eight jobs — pattern cards, v2

A section still does one kind of rhetorical work. The eight jobs are the same
as v1. The cards changed, because the cards were where the inference load
lived. Named figures are **patterns, not people**: the reader never sees the
names; they tell the writer which habits to copy. The anchors below are
proposals under RG-05 until the operator confirms or replaces them.

**Rule 0 — the register outranks the mode.** A mode shapes rhythm and the
opening move. It never suspends §2 or §3. Every "no glossing", "the reader is
assumed to know", "juxtaposition without the connective" and "trust the reader
absolutely" from v1 is struck.

**AWE** — scale, deep time, the marvel of a mechanism.
- *Cadence:* a plain fact stated flat → one sentence converting it to a scale
  the reader owns → a short landing on a plain noun.
- *Open:* the number, then the Indian-scale conversion ("that is Kanyakumari to
  Kashmir, forty times over"); or "imagine" / "picture".
- *Do:* "we"; one big claim per paragraph; the downshift into a flat factual
  sentence after the image (Attenborough's move).
- *Don't:* truly, incredibly, mind-blowing, exclamation marks; a second cosmic
  claim in the same paragraph; awe over a thing the reader cannot picture.
- *Closer:* *This is [plain noun].* / *We are [plain noun].*
- *Calibration:* the awe is in the fact and the comparison, never in the
  adjectives.
- *Anchors (proposed):* ISRO's own mission commentary; Jayant Narlikar; Harsha
  Bhogle when a record falls; Attenborough (universal, plain).

**CONVERSATIONAL EXPLAINER** — walking the reader across a gap. **The default
job: at least half the sections of any issue.**
- *Cadence:* analogy → the number → the restatement → the question that opens
  the next step. Mixed lengths; one short reset sentence per paragraph.
- *Open:* an everyday object as the door ("Think of the ocean as a geyser that
  never switches off"); or the question the reader would ask.
- *Do:* "you"; contractions; *that means / matlab*; one idea per paragraph;
  a sub-head's worth of clarity per idea.
- *Don't:* condescension ("simple hai na?"); fake confusion; two digressions in
  a paragraph; an analogy that needs a second analogy to land.
- *Closer:* *And that's why [plain claim].*
- *Calibration:* read it aloud to Aarav. Anything you would rephrase for him,
  rephrase on the page.
- *Anchors (proposed):* Dhruv Rathee; Finshots; Mohak Mangal; Think School;
  Zerodha Varsity.

**CALM-STRUCTURAL** — naming what a structure costs, without heat.
- *Cadence:* short-to-medium clauses, comma-joined; say it, then say it again
  with one word changed.
- *Open:* a date, a place, an ordinary object; or the official line beside the
  physical fact **with the sentence that joins them** — *"The order said X. On
  the ground, Y. The gap between the two is this story."*
- *Do:* the "we" of shared citizenship; the doubled question (Ravish Kumar's
  move); one image that proves the writer feels it.
- *Don't:* monstrous, devastating, fascist, neoliberal; leaving the connective
  out; the editorial verb ("betrayed", "punished").
- *Calibration:* restraint must read as a choice. The connective is written;
  the conclusion is not.
- *Anchors (proposed):* Ravish Kumar; Faye D'Souza; P. Sainath.

**SATIRICAL EXPOSURE** — an institution contradicted by its own numbers.
**≤ 1 section per issue. 0 on the politics desk by default.**
- *Cadence:* flat setup → the absurd specific → a *further fact* as the
  punchline, landing on a title, a figure or a date.
- *Open:* quote the official line straight.
- *Do:* full titles, exact figures, deadpan.
- *Don't:* visible outrage; satirising groups or vibes; a line funnier than the
  fact; Hindi inside the joke.
- *Calibration:* the laugh is the reader recognising a real fact.
- *Anchors (proposed):* The Lallantop's deadpan; Akash Banerjee — off the
  politics desk only.

**DRY WIT — a device, not a mode.** One deadpan sentence inside another mode's
section: an accurate small verb placed late, or a parenthesis that carries the
judgement while the main clause stays neutral. Never a whole section; never
Latinate vocabulary (*disport, contrive, repair to* are gone); never "of
course"; never explained. If the reader would need the irony pointed out, cut
it. *Anchor (proposed):* a Lallantop headline.

**INVESTIGATION** — an anomaly the reader can see, then the evidence.
- *Cadence:* a short curiosity jab, then two longer reasoning sentences
  (about 1:2).
- *Open:* the anomaly as a graphic, **first** — "Look at the map. Notice the
  gap." — before any context.
- *Do:* implicit narrator ("Look. Notice."); each section ends on a sharper
  question and delivers a partial answer.
- *Don't:* the narrator becoming the story; faked discovery; questions that
  never resolve; more than one self-aware aside per section.
- *Calibration:* the reader is brought into the noticing. (Measured on the
  Queue issue: the one v1 mode that already talked to the reader.)
- *Anchors (proposed):* Johnny Harris (visual-anchor-first is universal);
  Nitish Rajput; Scroll / The Reporters' Collective.

**FORENSIC** — a mechanism whose stakes are human.
- *Cadence:* a specific moment → the mechanism in **two short sentences** →
  the stake in the same paragraph → a short landing. The opening image
  returns at the close, changed.
- *Do:* every technical fact glossed the moment it appears; the stake in the
  same breath as the fact; specific detail as the moral content (the cut over
  the eye, the size of the purse).
- *Don't:* the lecture; the periodic sentence; the bolted-on stakes paragraph;
  decoration; showing off.
- *Calibration:* lift the technical part out and the stake should collapse
  with it — that is how you know they are fused.
- *Anchors (proposed):* Harsha Bhogle; Rukmini S. (*Whole Numbers and Half
  Truths*).

**LYRICAL COMPRESSION** — one landing. **≤ 1 paragraph per issue.**
- *Cadence:* a plain image, a long breath, a short line.
- *Vocabulary:* road, lamp, doorway, wrist, platform, monsoon, courtyard.
- *Don't:* naming the feeling; adjective stacks; fragments for their own sake;
  spiritual jargon; any argumentative work.
- *Calibration:* one image, used precisely; it lands the argument, never
  carries it.
- *Anchors (proposed):* Gulzar; Ruskin Bond; Javed Akhtar; Sudha Murty for
  plainness.

---

## 5. Short-form compression (social posts, hooks, captions)

A post is one job at one breath. Compress the job, don't dilute it. Facts come
only from an already-verified issue or a sourced dossier — never invent a
number for a post. `_voice-social.md` governs format and platform; this file
governs voice. Social may go to L3 (§2) where that contract asks for it.

- **AWE →** one scale-anchor fact, flat, with its Indian conversion.
- **CONVERSATIONAL →** the everyday-object door in one line, then the turn.
- **CALM-STRUCTURAL →** the official line, the physical fact, and the one
  sentence that joins them.
- **SATIRICAL →** the official line, then the single contradicting figure.
- **INVESTIGATION →** the visible anomaly as the first line; end on the
  question.
- **FORENSIC →** the mechanism in a clause, fused to its stake.
- **LYRICAL →** a single landing line. Never a thread's connective tissue.

---

## 6. The AI-tell catalog (non-negotiable, any length)

Check every prose field — and every post — before returning. **Applying a mode
never excuses a tell. Being plain never excuses one either.**

The six from v1, unchanged:

1. **The em-dash.** None in reader-facing prose by default, and a hard cap of
   **one per issue** (one per post). It is the single most recognisable mark
   of machine-written English and it reads as a writer who could not decide
   how the sentence ends. Commas, full stops and a new sentence do the work.
   (Tightened from "one per paragraph" on 2026-09-14, operator ruling.)
   **Semicolons** likewise: not in flowing prose, captions or notes — a full
   stop is what the reader expects. A **colon** only before a list, a gloss
   or a quoted line, never as a drum-roll before a punchline.
2. **Binary reframe as default closer.** *"It is not X. It is Y."* — at most
   **once per issue**, and only when the reversal *is* the argument.
3. **Triple-fragment closer.** Three consecutive 5–8-word sentences closing a
   section — max **one per issue**; expand at least one fragment.
4. **Abstract-noun jargon.** "structural argument", "the mechanism", "rhetorical
   work" as labels → say the actual claim. If it can't be said in the kitchen,
   rewrite.
5. **Numbered-manifesto rhythm.** "First… Second… Third…" / "The timeline. The
   numbers. The forecast." → remove the ordinals, interleave.
6. **Stacked binary reframes.** Two parallel "not X / it is Y" reversals across
   a piece → keep one.

Added in v2, from the measured corpus:

7. **The title formula.** "The ‹Noun› That ‹Verb›s" (nine of ten published
   titles). Retired — the title states the finding.
8. **The antithesis dek.** "X is not Y, it is Z" as a dek (eight of ten). At
   most one per issue, and never the dek if the hook already reverses.
9. **The stacked citation.** A source's authors, institutions and the outlets
   that reported it inside one sentence. The source line carries that; the
   sentence carries the finding.
10. **The staccato run.** Three consecutive sentences under eight words in a
    paragraph → join two of them.
11. **The once-used name.** A named person or body that appears once, with no
    role → cut or describe.

The vocabulary and shapes that mark prose as machine-written (added
2026-09-14, operator ruling — "it does not look that good"):

18. **The AI word list.** *delve, tapestry, landscape (figurative), navigate
    (figurative), robust, leverage, seamless, testament, underscore,
    pivotal, crucial(ly), notably, arguably, nuanced, multifaceted, realm,
    journey (figurative), unlock, foster, harness, elevate, game-changer,
    in today's fast-paced, at its core, the reality is, it's worth noting,
    in the ever-evolving.* Never. Say the plain thing.
19. **The "not X, but Y" shape** in any of its dresses — "it's not about X,
    it's about Y", "not because X but because Y", "less a X than a Y". It is
    tell 2 in a longer coat; the same once-per-issue cap covers all of them.
20. **The rhythmic triplet.** Three adjectives or three parallel nouns placed
    for cadence — "the rules, the maths, and the reasons" — when two would
    say it or one would. Lists of three are fine when there are three things.
21. **The sentence-opening adverb of importance.** *Notably, Crucially,
    Importantly, Interestingly, Ultimately, Essentially.* Cut the word; if the
    sentence was important, it still is.
22. **The mirrored close.** A closing sentence that repeats the opening
    sentence's shape with one word swapped, as a bow. Once is a device; as a
    habit it is a tell.

Hinglish tells (v2):

12. **The YouTube intro.** "Toh dosto…", "Namaskar" — never.
13. **Salt in every sentence.** Hindi in consecutive sentences, or in a field
    where §2 forbids it → cut to the natural word or to none.
14. ***Yaar, bhai, bro.*** Out of politics and earth; at most once per issue
    elsewhere.
15. **Italicised or Devanagari Hindi.** Roman, set roman.
16. **The literal idiom.** An idiom translated across languages → use it in the
    language it belongs to, or cut.
17. **The condescending tag.** *"samjhe?"*, *"simple hai na?"* → cut.

**Quick correction table**

| Tell found | Rewrite move |
|---|---|
| An em-dash anywhere in prose (cap one per issue) | A comma, a full stop, or a new sentence |
| A semicolon in prose, a caption or a note | A full stop |
| A word from the AI list, or a sentence-opening "Notably" | The plain word, or nothing |
| "not about X, it's about Y" | Say Y |
| "It is not X. It is Y." | Merge into one clause, or cut the first half |
| 3× short sentences closing a section | Expand one fragment into a full clause |
| "structural argument" / "the mechanism" as a label | Replace with the actual claim |
| "First… Second… Third…" | Interleave; remove the ordinal labels |
| "The ‹Noun› That ‹Verb›s" | State the finding in the title |
| Authors + institutions + outlets in one sentence | Move them to the source line; keep the finding |
| Three sentences under eight words in a row | Join two with *because / so / which means / but* |
| A name used once | Cut it, or give the role instead of the name |
| Hindi in two consecutive sentences | Keep the one natural word; the rest goes |

---

## 7. Blending rules (hard)

- **One dominant job per section.** A device from another job is allowed (one
  dry-wit sentence inside a forensic section); the register reads as one job.
- **CONVERSATIONAL EXPLAINER carries at least half the sections** of an issue.
- **3–5 jobs across a full issue.** Never all eight; never one.
- **Seasoning, not staple:** ≤ 1 SATIRICAL section (0 on the politics desk);
  ≤ 1 LYRICAL paragraph; DRY WIT as a device only.
- **Jobs follow the rhetorical work, not the topic.** A space issue is not
  always AWE; a politics issue is not always CALM-STRUCTURAL.
- **Seams.** The last sentence of a section restates what its graphic showed,
  in the reader's words. The first sentence of the next section asks the next
  question or shows the next thing.
- **Default slot allocation:** head → the hook formula (§3.12) · first section →
  a graphic, INVESTIGATION ("look at this") or AWE (scale) · explanation →
  CONVERSATIONAL · mechanism → FORENSIC, two short sentences at a time ·
  contradiction → CALM-STRUCTURAL (SATIRICAL only off politics) · quote →
  CALM-STRUCTURAL · closer → CALM-STRUCTURAL or LYRICAL.

---

## 8. Decision tree — "which job does this section need?"

```
Establishing scale / deep time / marvel?                  → AWE
Explaining something the reader must grasp?
   stakes human and structural?                           → FORENSIC
   a walk-through, one step at a time?                    → CONVERSATIONAL EXPLAINER  (the default)
Exposing an institutional contradiction?
   documented, fact-stacked, and not the politics desk?   → SATIRICAL EXPOSURE
   otherwise                                              → CALM-STRUCTURAL
Naming a structural cost?                                 → CALM-STRUCTURAL
Discovering / observing an anomaly the reader can see?    → INVESTIGATION
A closer, a single emotional landing?                     → LYRICAL COMPRESSION (≤ 1 paragraph) or CALM-STRUCTURAL
```

If two jobs fit, pick the one whose failure mode the content is least likely
to trigger. On sensitive topics — politics especially — restraint is the safer
register. **When nothing else fits, it is CONVERSATIONAL.**

---

## 9. Worked examples (a real published sentence, then its rewrite)

**The staircase** (2026-05-03-el-nino-new-floor). Before, 74 words, the reader
must infer what "oscillating around a baseline" means:

> *The conventional reading of ENSO — the El Niño / La Niña oscillation in the
> Pacific — runs like this: warm years spike upward, cool years pull the global
> mean back to a long-run average, and the system oscillates around a slowly
> rising baseline. The data since 2015 reads differently. Each La Niña year now
> lands above the previous El Niño year from a decade before. The system is not
> oscillating around a baseline. It is climbing a staircase.*

After (L2; delete the Hindi and it still says everything):

> *Most people picture El Niño and La Niña as a jhoola: garam saal, thanda
> saal, and back to the middle. The numbers since 2015 say something else.
> Every "thanda" La Niña year is now warmer than the "garam" El Niño year from
> ten years before. Yeh jhoola nahi hai. It's a staircase, and it only goes up.*

The same at L1, for a field where Hindi is not allowed:

> *Most people picture El Niño and La Niña as a swing: hot years, cool years,
> and back to the middle. The numbers since 2015 say something else. Every
> "cool" La Niña year is now warmer than the "hot" El Niño year from ten years
> earlier. That is not a swing. That is a staircase, and it only goes up.*

**The mechanism, with the analogy the original never gives.** Before:

> *Each El Niño transfers some of that ocean-stored heat to the atmosphere and
> lifts surface temperatures. The subsequent La Niña suppresses Pacific
> sea-surface temperatures again, but cannot return the global mean to its
> previous floor — because the reservoir is now permanently warmer.*

After:

> *Think of the ocean as a giant geyser that never switches off. El Niño is when
> the hot water spills into the air, so the world's temperature jumps. La Niña
> is when the tap closes for a while. Hawa thodi thandi ho jaati hai, but the
> geyser is still hotter than last time. So the next "cool" year starts higher
> than the last one did.*

**The lead** (2026-06-04-queue-is-the-product). Before:

> *Read the headlines and it looks like a routine tightening of overtourism
> rules: two famous peaks, made a little harder to reach. Look closer and the
> change is sharper than that. At both mountains, the scarce good now being
> priced is no longer the summit. It is the bottleneck — the queue, the slot,
> the narrow window of safe weather everyone competes for at once.*

After:

> *Headlines mein yeh bas "overtourism rules" lagta hai: two famous mountains,
> a bit harder to climb now. But look closer. Everest aur Fuji par jo cheez ab
> bik rahi hai, woh summit nahi hai. It's the line. The queue, the time-slot,
> the few safe-weather hours that everyone wants at the same time. Nepal and
> Japan have started selling the wait itself.*

**Two hooks.**

| Before | After |
|---|---|
| How a bill about women's empowerment became the vehicle for the biggest redrawing of Indian political power in 50 years. | Your MP speaks for 30 lakh people. A Tamil Nadu MP speaks for 18 lakh. One bill tried to fix that gap — and lost by 54 votes. |
| At Everest and Fuji, managing the crowd and selling the crowd have become the same administrative act — the scarce good being priced is the bottleneck itself. | Everest ka ticket: $15,000, about ₹12.5 lakh. Fuji ka ticket: ₹2,300. Both countries are now selling the same thing — your place in the line. |

**A title.** *The Pacific That No Longer Resets* → *Every "cool" year is now
hotter than the hot years before it.*

---

## 10. Files this contract points to

Created under `docs/REGISTER-PLAN.md` Phase 1 as they land; until then the
writer works from this file alone.

- `research/_voice/hinglish-lexicon.md` — one spelling per word, the allowed
  set, the banned set, per-desk notes.
- `research/_voice/jargon.md` — the terms of art that must be glossed on first
  use, with a suggested gloss each.
- `research/_templates/storyboard.md` — the composer's output shape, including
  the three quiz questions the reader panel uses.
- `research/_voice/mode-library.md` — v1 until rewritten; this file wins.
- `_voice-social.md` — format and platform rules for posts; this file governs
  voice there too.
