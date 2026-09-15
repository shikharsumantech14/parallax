# Reader panel: Uber's year of AI money lasted four months

- **Draft:** `src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx`
- **Storyboard:** `research/tech/2026-09-14-ai-coding-token-bill-storyboard.md`
- **Pass:** first (after draft)
- **Read:** 2026-09-15
- **Verdict:** REVISE

The argument lands. All four readers can say back the unit confusion in their
own words, and three of them can do it without re-reading anything. What stops
this being a PASS is a short list of mechanical things: four unglossed terms of
art (`cached`, `seat`, `frontier`, `rate card`), one tile that nobody outside
the trade can read, one sentence in the closer that the reader has already seen
contradicted twice, and a hedge that thins out at exactly the tile a scanner
reads first.

Nothing here is structural. The seams are the best thing in the draft: every
section's first sentence restates the graphic before it, which is why the
retells hold even where a term does not.

---

## The quiz

Answered from the draft alone, before the storyboard's model answers were read.
Compared afterwards; gaps noted in the last column.

| Question | Aarav | Meera | Sana | Karthik |
|---|---|---|---|---|
| **1.** The price of an AI token keeps falling. So why did Uber's AI bill go up? | **correct** — "Ek token sasta hua, lekin ab ek kaam mein dus lakh token lagte hain. Pehle sirf hazaar. Tool baar baar sab kuch dobara bhejta hai, so total upar. Uber ka poora saal ka paisa chaar mahine mein khatam." | **correct** — "Unit price down, units per job up by three orders of magnitude, and the agent re-sends its whole context every loop. Multiply and the bill climbs. Uber budgeted on last year's arithmetic." | **correct** — "Rate kam hua but usage bahut zyada, so bill zyada. Ek chat ka jawab kuch hazaar tokens, ek coding job dus lakh se upar." | **correct, with one objection** — "Price × volume, and volume won. But the issue never shows me the price falling. It shows me the price doubling, twice, and then tells me nobody raised a price." |
| **2.** What changed in November 2025, and was it a price change? | **correct** — "Koi price nahi badhi. Do naye coding models aaye ek hafte mein aur tools sach mein kaam karne lage. Software ne sawaal ka jawab dena chhod kar poora kaam karna shuru kiya." | **correct** — "Capability, not price. Two models shipped a week apart and agents crossed from often-working to mostly-working. Billing followed in April, it did not cause it." | **correct** — "Tools bas achhe ho gaye. Kuch mehnga nahi hua. Timeline pe likha hai — 'Nothing got more expensive here.'" | **correct** — "A capability step, not a repricing. The metering changes are April, four months downstream." |
| **3.** What exactly did Uber cap, and how big is that number? | **correct** — "$1,500 har mahine, yaani lagbhag ₹1.4 lakh, ek engineer ke liye, ek tool ke liye. Sirf woh tools jo khud code likhte aur chalate hain, chat wale nahi. Do tools ka saal ka $36,000." | **correct** — "$1,500/month per engineer *per tool*, agentic tools only — Cursor, Claude Code — not chat. Two tools is ~$36,000 a year, about 11% of a median engineer's total pay, and that pay number is an outside estimate, not Uber's." | **partly** — has the number, the ₹ and the per-engineer framing, loses "per tool" on the first pass and **drops the hedge**: "AI tools engineer ki salary ka 11% le rahe hain." No sense that the 11% is somebody's arithmetic on an outside estimate. | **correct** — "$1,500 a month per engineer per agentic tool. ~$36k a year for two. ~11% of a ~$330k median comp, and the draft is careful to say that comp figure is Levels.fyi via a blogger, not a disclosure." |

**Against the model answers.** Q1 and Q2 match the storyboard's model answers on
all four readers, including the hedges the storyboard makes part of the pass
mark (nobody produced a chat-versus-agent multiplier; everyone used "a few
thousand against over a million", which is the framing the guardrail requires).
Q3 is the gap: the storyboard says in §6 that an answer stating "11% of an Uber
engineer's pay" without the caveat is a **fail, not a pass**. Sana's answer is
that answer. See finding 6.

---

## Section by section

| # | Kind · title | Aarav retell | Meera | Sana | Karthik | Lowest · why |
|---|---|---|---|---|---|---|
| 1 | `you-think` · Cheaper tokens, bigger bills | "Sabko lagta hai AI sasta ho raha hai, but Uber ka saal bhar ka paisa chaar mahine mein gaya aur sab par limit lag gayi." | "The belief, then the four-month counter-fact and the cap." | "AI sasta hone ka matlab bill chhota nahi hota. Uber ka budget April mein khatam." | "The premise I walked in with, and the number that breaks it. One word I don't know, but the eyebrow says ARITHMETIC so I have it." | **4 · Karthik** — one unknown word, meaning intact |
| 2 | `jargon-buster` · Only one of these is your bill | "Bijli ka bill: rate per unit alag, units alag. Token = shabd ka tukda. Bill = rate × tukde." | "Three words, one of which is the invoice. Clean." | "Token ek shabd ka piece hota hai. Rate aur total alag cheez hai." | "Token, unit price, task cost. The electricity bill does the work." | **4 · Sana** — the middle term's relative clause needs a beat |
| 3 | `scaling-plot` · One job, over a million tokens | "Ek chat ka jawab kuch hazaar tokens. Ek coding job 13 lakh se upar. Sirf upar wala dot asli measurement hai." | "Two points, log axis, three orders of magnitude between them, and the draft flags which one is measured." | "Ek kaam mein dus lakh se zyada tokens. Chart ka upar wala point hi asli hai." | "Order-of-magnitude gap, honestly labelled. The starred point is illustrative and says so." | **4 · Aarav, Sana** — the log-scale panel costs one honest re-read |
| 4 | `three-steps` · The software changed jobs | "Tools achhe ho gaye. Ab woh loop mein kaam karta hai. Aur har baar sab kuch dobara bhejta hai." | "Capability step, the loop, the replay. Three beats, no price in any of them." | "Tool ab khud kaam karta hai, try karta hai, fail hota hai, phir try karta hai. Har baar sab dobara." | "Ship, loop, replay. The quote is the mechanism verbatim." | **4 · Aarav, Sana** — step 3's quote is opaque; the step *title* rescues it |
| 5 | `benchmark-chart` **(hero)** · Most of it was re-reading | "Poore kaam ka zyada hissa sirf dobara padhna tha. Naya code sirf thoda sa." | "86-ish per cent of a 1.36M-token task was re-sent context. 17k was output." | "Sabse lamba bar re-reading ka hai. Naya code sabse chhota." | "Cached dominates, output is a rounding error. The chart is the replay mechanism drawn." | **4 · Aarav, Sana** — the three bar labels are unglossed; title + annotation carry the meaning anyway |
| 6 | `timeline` · Billing changed, prices rose, budget gone | "Pehle tools kaam karne lage, phir dono companies ne meter laga diya, phir naya model do guna mehnga, phir Uber ka paisa khatam, phir cap." | "Capability → metering → frontier repricing → exhaustion → cap. The Nov annotation is the load-bearing one." | "Sab kuch April mein hua. Budget khatam, phir June mein limit." | "Six dates, two of them annotated correctly. The Nov 24 callout answers the whole issue." | **4 · Aarav, Sana** — "seat" and "frontier" are blanks; the sequence survives them |
| 7 | `number-sense` · One engineer, one tool, one month | "$1,500 mahina, ₹1.4 lakh. Ek banda, ek tool. Engineer ki salary ₹3.1 crore ke aas paas, woh bhi andaaza hai." | "The cap, felt. The ₹ bracket is what makes it land." | "₹1.4 lakh har mahine ek engineer ke ek tool pe. Bahut zyada hai." | "$1,500/month/tool, ₹ bracket dated September on a June issue. I noticed." | **4 · Sana, Karthik** — Sana needs a beat on $ vs ₹; Karthik stops at the September date |
| 8 | `data-readout` · Where else the money moved | "Ek bande ne $2,180 ke tokens jalaye... phir price do guna... phir 1.4×... 11%. Do tiles samajh aaye, do nahi." | "Arbitrage, frontier repricing, tokenizer drift, comp share. Tile 3 needed a second read and tile 1 needs arithmetic I had to do myself." | "Kuch numbers hain. 11% wala samajh aaya. Baaki do pata nahi kya keh rahe hain." | "Four unrelated readings under an intro that promises they explain the $36,000. Only one does." | **3 · Aarav, Sana** — two of four tiles are trade language; the intro mis-promises |
| 9 | `prose` · The work changed shape | "Kisi ne price nahi badhaya, kaam ka shape badal gaya. Bijli ka bill wapas aaya. Achha code ab bhi mehnga hai." | "The landing works. But 'Nobody raised a price' is not what the last two sections told me." | "Rate kam hua lekin ek kaam mein lakhon units lag gaye. Meter wahi ginta hai." | "Good close, one false-sounding sentence. I just read '2× frontier price' and 'prices are rising'." | **3 · Meera, Karthik** — the gist lands, one sentence reads as contradicted |

**Scores** (5 = retold, nothing re-read · 4 = retold, one re-read · 3 = gist
only · 2 = wrong gist · 1 = nothing).

| # | Aarav | Meera | Sana | Karthik | Σ |
|---|---|---|---|---|---|
| 1 | 5 | 5 | 5 | 4 | 19 |
| 2 | 5 | 5 | 4 | 5 | 19 |
| 3 | 4 | 5 | 4 | 5 | 18 |
| 4 | 4 | 5 | 4 | 5 | 18 |
| 5 | 4 | 5 | 4 | 5 | 18 |
| 6 | 4 | 5 | 4 | 5 | 18 |
| 7 | 5 | 5 | 4 | 4 | 18 |
| **8** | **3** | 4 | **3** | 4 | **14** |
| **9** | 4 | **3** | 4 | **3** | **14** |

No section is ≤ 2 for any reader, and no question is "not in the draft" or
"wrong" for anybody. That is why this is REVISE and not BLOCK. It is not a PASS
because §8 sits at 3 for Aarav and Sana, §9 at 3 for Meera and Karthik, and
Sana's Q3 answer drops a hedge the storyboard names as a fail condition.

---

## The lost sentences

First sentence each reader had to read twice, then the ones that cost meaning
rather than a beat.

| Reader | Sentence (quoted) | Why, in five words |
|---|---|---|
| **Aarav** | "Each step up the side is ten times the step below it, so a small-looking gap on this chart is a large one." (§3 `howToRead`) | Log scale, one honest re-read |
| Aarav (2) | 'The developer Simon Willison, who tracks AI pricing, writes that agents "maintain state by replaying entire conversations with each new prompt".' (§4 step 3) | Quoted jargon, no gloss beside |
| Aarav (3) | "At list prices, on $200 of subscriptions. You never feel it." (§8 tile 1 note) | Arithmetic left for the reader |
| Aarav (4) | "The April update counts more tokens for the same input." (§8 tile 3 note) | Which update, counts how, why |
| **Meera** | "~1.4× · Cost rise at an unchanged rate card" (§8 tile 3) | "Rate card" never met before |
| Meera (2) | "Nobody raised a price." (§9) | Two sections said prices rose |
| **Sana** | "Each step up the side is ten times the step below it…" (§3 `howToRead`) | First chart instruction she meets |
| Sana (2) | "cached tokens" / "input sent" / "output written" (§5 bar labels) | Three trade words, none glossed |
| Sana (3) | "~1.4× · Cost rise at an unchanged rate card" (§8 tile 3) | Nothing here she can picture |
| **Karthik** | "Cheaper per unit, many more units per job. That hisaab only goes one way." (§1 note) | One blank word, meaning survives |
| Karthik (2) | "Nobody raised a price." (§9) | Contradicts the 2× tile |
| Karthik (3) | "Converted at about ₹95 to the dollar, September 2026" (§7 source) | Conversion dated after publication date |

**Also unglossed, in page order, each a blank for Aarav and Sana:** "task
autonomy" (§3 x-axis), "coding agents" before the next step explains it (§4),
"cached" (§5, and it is the highlighted bar), "the seat" (§6 Apr 14),
"frontier" (§6 Apr 23 and §8 tile 2), "list prices" and "rate card" (§8).
None of them destroys a retell on its own. Together they are why §8 falls over
and §5 costs a re-read.

---

## The hook

> "You keep hearing AI is getting cheaper. Uber burned its whole 2026 AI budget
> in four months, and capped every engineer."

- **Aarav — yes.** The "you keep hearing" is exactly the headline he has been
  reading, and "poora saal ka budget chaar mahine mein" is a sentence he would
  repeat at the branch.
- **Meera — yes.** Reversal in twenty-one words with a named company. She keeps
  scrolling.
- **Sana — half.** It stops her on "Uber" and "burned", but the number she is
  handed is a *company's* number. There is nothing here she owns. The issue's
  one number she can feel, ₹1.4 lakh a month, is seven sections down. The hook
  has no room (it is at 21 of 25 words, and the head is at 78 of 80 before the
  first graphic), so this is an observation, not a fix request.
- **Karthik — yes**, and the twist is the right one for him.

**The title** does its job for all four: a reader who reads only titles gets
"Uber ran out of AI money fast" from §head, "the software changed jobs" from
§4, "most of it was re-reading" from §5 and "the work changed shape" from §9.
That chain is the argument.

**One placement warning about the dek.** "The price per unit fell. The units
per job exploded." is the cleanest single statement of the whole argument in
the issue, and per `AGENTS.md` §10 the dek renders in the issue page's **aside
rail**, not in the head flow above the primer. A phone reader mid-scroll may
never meet it. The argument survives — §1's note, §2's three terms and §9 all
restate it — but the draft should not be *relying* on the dek to teach the
unit confusion. Worth an operator check on a 375px render.

---

## Findings on the seven test points

### 1. The unit confusion — does a cold reader come away able to explain it?

**Yes. This is the draft's strongest result.** All four readers produced the
multiplication unprompted, and two of them produced it with numbers attached.
The reason is repetition by design: the reader meets the same idea five times
in five different shapes — dek, §1's note, §2's three terms, §3's two dots, §9's
"went from a few thousand units to over a million". Neither Aarav nor Sana
finished on "AI got more expensive". Both finished on "rate kam, usage zyada".

**One crack in it, and Karthik is the reader who finds it.** The issue asserts
the falling half of the scissor three times (primer, the "per-token price"
gloss, the dek) and **never evidences it** — there is no number and no mark
anywhere on the page showing a token price going down. Meanwhile the rising
half is evidenced twice and loudly: a timeline event labelled "New frontier
model, twice the price", its annotation "At the frontier, the per-token price
is now rising", and a `2×` tile. The reconciliation exists, but it is carried
by the two words "at the frontier" inside an annotation. A careful reader can
finish this issue believing prices went **up**, which is the opposite of the
premise the whole argument rests on.

This is the single most consequential comprehension finding in the report, and
it is what makes §9's "Nobody raised a price." read as false rather than as the
summary it is meant to be.

### 2. Does the "token" gloss land for someone who has never met the word?

**Yes, at the level the issue needs.** "A token is the unit AI bills by: a
piece of a word" arrives in the primer's first sentence and is repeated in §2
with the halves swapped. Both Aarav and Sana used "shabd ka tukda / a piece of
a word" back, unprompted, and both understood its *role* (the thing they charge
by) rather than only its definition. §3's "those pieces" keeps the gloss alive
at the point the reader needs it most, which is a good touch.

Keeping "token" out of the dek in favour of "unit" **worked**: the word arrives
once, with its gloss attached, and the dek's abstraction is resolved one
sentence later by the primer. Neither Aarav nor Sana treated "unit" as a blank.

**The gap is that the reader gets a definition, not a picture.** Nobody is ever
shown a word broken into pieces, and no reader could tell you how many tokens
the sentence they are reading would be. Sana's retell has "token" as a label
she can repeat but not a thing she can see. Rule 3 (every abstraction gets a
concrete thing) is satisfied by the electricity unit rather than by the token
itself. That is a defensible trade in a 971-word issue, and it is why this is
an observation rather than a fix.

### 3. Does the electricity bill carry the argument, or get dropped?

**It is a bookend, not a spine.** It appears three times, all of them in the
first 100 words of §2 or in §9: "Look at your electricity bill. There is a rate
per unit, and there are units used" (§2 intro), "On your electricity bill, this
is the bottom line" (§2, third term), and "Think of it like your electricity
bill again… that is what the meter counts" (§9).

Both ends are strong, and both ends work. Aarav and Sana both reached for the
bill on their own when answering Q1, which is exactly what an analogy is for.

**But it goes silent for six sections, across the hardest stretch of the
issue.** Sections 3 through 8 are where the reader has to hold *units per job*
in their head — the million-token task, the three-way token split, the cap per
tool — and the word "units" does not appear in any of them. §3 says "pieces",
§5 says "tokens", §8 says "rate card". The reader who was handed a frame in §2
is not handed it again until §9. Both low-scoring tiles in §8 are exactly the
place where one word of the analogy ("the meter", "units pulled") would have
done the work that "list prices" and "unchanged rate card" failed to do.

The "again" in §9's "Think of it like your electricity bill again" is doing a
lot of load: it asks the reader to recall a frame from roughly 700 words back.
Aarav and Sana both made the jump; neither found it effortless.

### 4. The currency work and the date question

**Does the rupee figure read as the price itself?** No. In §7 the dollar sits
in the component's `value` slot at full size with `/month` and "Per engineer,
per tool" beside it, and the rupee arrives below as an *equals* line reading
"About ₹1.4 lakh a month, for one person and one tool." The word "About" and
the component's own equivalence form both mark it as a conversion. No reader
misread it. The same holds for "$330,000 (about ₹3.1 crore)" — the bracket
form is unambiguous.

**Do the two brackets help? Decisively, and they are the right two figures.**
This is the clearest positive result after the unit confusion. $1,500 a month
is an abstraction to Aarav and Sana — it is a number from a country whose
salaries they do not price in. "₹1.4 lakh a month, for one person and one tool"
is the only figure in the issue that made either of them react. Sana's retell
is "bahut zyada hai" and Aarav's answer priced it against a salary
unprompted. ₹3.1 crore does the same work for the 11%: without it, "11% of
$330,000" is arithmetic; with it, it is a number with a shape. Neither bracket
is decoration.

**Does any reader get confused about when a price applied? Not about the
prices — but there is one thing two readers notice.** The §7 source line reads
"Converted at about ₹95 to the dollar, September 2026" on an issue the facts
rail dates 4 June 2026. Nobody misdated the cap: §7's intro says "the cap
arrived on 2 June" in the sentence directly above, so the date is nailed down
before the source line is reached. But the conversion is dated **three months
after the issue was published**, which is temporally impossible on its face,
and both Karthik and Meera stopped on it. It does not cost them the meaning. It
costs a beat of trust, and it is the kind of thing an engineer notices and
mentions to somebody. Aarav and Sana did not read the source line at all.

The operator's worry was that a September rate would read as the date of a June
event. It does not. The residual risk is the reverse and smaller: the page
looks like it was quietly edited later, which it was, with no line saying so.

**One asymmetry a reader does feel, inside a single card.** §7 gives $1,500 a
rupee bracket and gives $36,000 — a figure derived from it, two lines below, in
the same component — none. Then §8's intro repeats "$36,000 a year" as the
number the reader is meant to carry into the tiles. So the figure the reader is
asked to hold across a section boundary is the one without the bracket. Aarav
retold "₹1.4 lakh" and dropped "$36,000" entirely. Nobody was confused; the
number just did not stick. The bracketing rule is the operator's ruling and I
am not reopening it — this is a note that $36,000 is currently the issue's
weakest-travelling number.

The unbracketed figures elsewhere ($2,180, $200, $20 a seat, the rate cards)
caused no confusion at all. No reader expected a conversion on every number.

### 5. *hisaab* — the skip test and the wince test

**Karthik's skip test: passes, and it passes for a reason worth recording.**
"Cheaper per unit, many more units per job. That hisaab only goes one way."
Delete the word and the sentence still works ("That only goes one way"),
and — more to the point — **the section's own eyebrow is "THE ARITHMETIC"**,
sitting four lines above the note. Karthik meets the blank, looks up, and the
English word for it is already on screen. He loses one beat and no meaning. His
retell of §1 is complete.

That is the cleanest Hindi placement this panel has seen: the gloss is not in
the sentence, it is in the section's own chrome, so the English says everything
without spending a word on saying it twice.

**The wince test in a money-and-units issue.** The sentence carries no numeral.
"Cheaper per unit, many more units per job" is a shape, not a figure, and
*hisaab* is the subject noun of the reckoning rather than a modifier sitting
beside a number. It is in a `note`, not in a `caption`, `plain`, `howToRead`,
`source` or data label. On comprehension grounds it is clean, and Aarav read it
as his own register rather than as decoration. Whether one Hindi word in a
sentence whose neighbours are all units is *within* the precision test is a
voice-checker call, not mine — I record only that no reader paid for it.

### 6. Does the ~11% hedge survive a fast read?

**Half.** The hedge is written twice and the two instances are not equally
strong.

§7's note is explicit and it works: "A median Uber engineer's total pay is
around $330,000 (about ₹3.1 crore), **an outside estimate, not a company
figure**." Aarav, Meera and Karthik all carried it into their Q3 answers.

§8's tile is where it thins. The tile reads "~11% · Of a median engineer's
total pay" with the note "Two tools a year, **set against that outside
estimate**." Two problems for a scanner. First, "that outside estimate" is a
back-reference to a note one whole section earlier — the reader who meets the
tile first, which a tile reader does, has no antecedent for "that". Second, the
word "estimate" alone does not say *whose*; §7's decisive phrase, "not a
company figure", is not repeated.

Sana reads tile grids and not notes, and her Q3 answer is "AI tools engineer ki
salary ka 11% le rahe hain" — flat, unhedged, and per the storyboard's §6 that
is a **fail condition**, not a soft mark. The `~` and the word "estimate" are
carrying a caveat that needs a noun.

Nobody attributed the figure to Uber outright. But nobody who read only §8
knew it was somebody's arithmetic on somebody else's data.

### 7. The close

**It lands, and one sentence in it misfires.**

What works: "that is what the meter counts" is a genuine landing, it closes the
electricity frame the issue opened with, and "Writing new code is close to free
now. Getting good code is still expensive" is the one line all four readers
could quote back. Sana and Aarav both retold §9 correctly. It does not trail
off, it is not a mirrored close, and at 71 words it does not overstay.

What misfires is the third sentence in: **"Nobody raised a price."** The reader
arrived at §9 having just read, two sections earlier, a timeline event labelled
"New frontier model, twice the price" with the annotation "At the frontier, the
per-token price is now rising", and one section earlier a tile reading "2× ·
Frontier price, newest model against the last · At the top end, prices are
rising." Meera and Karthik both stopped. Meera's words: "that is not what the
last two sections told me."

The intended claim — that no price rise caused Uber's bill — is true and is the
whole point. As written it is an absolute the issue has already contradicted on
its own page, and it is the first sentence of the paragraph that has to carry
the argument home. It also compounds finding 1: the reader who was already
unsure whether prices fell or rose now has the closer telling them neither
happened.

One smaller thing: "Getting good code is still expensive" introduces code
*quality* in the last two sentences, and quality appears nowhere else in the
issue. It reads well and it is the right landing, but it is a new idea arriving
after the evidence has closed. Sana took it on trust. Aarav asked, in effect,
where that came from.

---

## What would fix it (direction only)

In priority order. The first three are what stand between this draft and a PASS.

1. **§9: "Nobody raised a price." needs the scope the rest of the issue gives
   it.** The issue's own timeline and §8 tile both say a price rose. The
   sentence means "no price rise caused this bill" and the reader needs that
   distinction on the sentence, not three sections earlier in a two-word
   prepositional phrase.
2. **§1–§3: the falling half of the scissor is asserted and never shown.** Every
   mark on the page points the price *up*. The reader is asked to take the
   premise of the entire argument on trust while the counter-evidence is drawn
   twice. Either the fall gets a number the reader can see, or the two rising
   figures get the scope that keeps them from reading as the headline.
3. **§8: two of four tiles are trade language and the intro mis-promises them.**
   "Four more numbers sit behind that" tells the reader the tiles explain the
   $36,000; only the `~11%` one does. And `~1.4× · Cost rise at an unchanged
   rate card` is unreadable to anyone outside the trade — "rate card" is a third
   name for a thing §2 already glossed as "per-token price", and "counts more
   tokens for the same input" needs the tokenizer idea the issue never
   introduces. This is the lowest-scoring section for the two readers who matter
   most here.
4. **§8 tile 4: the hedge needs its noun back.** "that outside estimate" points
   at a note in the previous section. A tile is read first and alone. §7's
   working phrase is "not a company figure" and it is the part that did not
   travel.
5. **§5 (the hero): "cached tokens" is the highlighted bar and the word is never
   glossed.** The title and the annotation rescue the meaning, which is why the
   section still scores 4 — but the reader is looking at three labels
   ("cached tokens" / "input sent" / "output written") where two mean input and
   cannot tell them apart. The gloss belongs on the chart, not in the intro that
   precedes it.
6. **Four more terms arrive without a gloss:** "the seat" (§6 Apr 14),
   "frontier" (§6, §8), "list prices" (§8 tile 1), "task autonomy" (§3 x-axis).
   None is fatal alone; the x-axis one is free to fix because only two points
   sit on it.
7. **§8 tile 1 leaves the reader to do the arithmetic that is the point.**
   "$2,180 … on $200 of subscriptions. You never feel it." The comparison
   between the two figures *is* the fact, and it is never stated. Aarav got
   there; Sana did not.
8. **§4 step 3's quote is the only unglossed sentence in the narrative spine.**
   "maintain state by replaying entire conversations with each new prompt" is
   carried entirely by the step title above it ("It re-sends everything"), which
   is good design — but it means the quote itself is decoration for two of the
   four readers.
9. **The electricity bill goes quiet for six sections.** It is the issue's only
   Indian ground besides the currency and it is doing bookend duty. One word of
   it inside §5 or §8 would cost almost nothing against the 129-word headroom
   and would carry the frame across the stretch where the reader needs it.
10. **Operator check, not a draft fix:** confirm the dek renders somewhere a
    phone reader meets it. It holds the cleanest statement of the argument in
    the issue and the aside rail is not the head flow.

**Do not change:** the *hisaab* placement (it passes the skip test cleanly on
the eyebrow), the two rupee brackets (they are the only figures in the issue
that made Aarav and Sana react), the token gloss and its "pieces" echo in §3,
the seam sentences at the top of §5 through §9, and the §9 landing from "Think
of it like your electricity bill again" onward.
