# Reader panel: Uber's year of AI money lasted four months

- **Draft:** `src/content/issues/2026-06-04-ai-coding-token-bill/index.mdx`
- **Storyboard:** `research/tech/2026-09-14-ai-coding-token-bill-storyboard.md`
- **First panel:** `research/tech/2026-09-14-ai-coding-token-bill-panel.md` (REVISE)
- **Pass:** second (after stylist)
- **Read:** 2026-09-15
- **Verdict:** PASS

Every quiz question is answered correctly by Aarav, Meera and Sana, including
the ~11% hedge that failed last pass. Every section scores ≥ 4 for those three.
Every one of Karthik's retells matches its section's caption or intro, and
*hisaab* still passes the skip test on the eyebrow above it.

Section 8 moved 3 → 4 for both readers who failed it, and section 9 moved 3 → 4
for both readers who stopped on it. Those were the two blockers and both are
cleared.

Three residuals survive. None of them breaks a retell or a quiz answer, which is
why this is a PASS and not a REVISE, but one of them is a **new** collision the
stylist's own fixes created and it is the sharpest sentence-level problem left in
the issue. See "What the fixes created".

---

## The quiz

Answered from the draft alone, before the first report was re-opened.

| Question | Aarav | Meera | Sana | Karthik |
|---|---|---|---|---|
| **1.** Token prices keep falling. So why did Uber's bill go up? | **correct** — "Bill = rate × pieces. Rate kam hua, lekin ek kaam mein ab dus lakh se upar pieces lagte hain, pehle kuch hazaar. Tool loop mein chalta hai aur har baar sab dobara bhejta hai. Uber ne purane hisaab se budget banaya, chaar mahine mein khatam." | **correct** — "Unit price down, units per job up three orders of magnitude, and the agent re-sends its entire context on every loop. Multiply. Uber budgeted 2026 on 2025 arithmetic." | **correct** — "Ek token sasta hai but ab ek job mein ek million se zyada lagte hain, kyunki AI khud poora kaam karta hai aur baar baar sab dobara bhejta hai. Toh total upar." | **correct** — "Price × volume, volume won. The fall is one dated point, a 2023 model at $0.25 per million with 'newer ones cost less'. The rise is drawn three times but scoped to the top end every time, and section 9 says so plainly. The argument holds." |
| **2.** What changed in Nov 2025, and was it a price change? | **correct** — "Koi price nahi badhi. Do coding models ek hafte mein aaye aur tools sach mein kaam karne lage. Meter April mein laga, saat mahine baad." | **correct** — "Capability, not price. Two models a week apart, agents crossed from often-working to mostly-working. Metering followed in April, it did not cause it." | **correct** — "Kuch mehnga nahi hua. Tools bas achhe ho gaye. Timeline pe seedha likha hai, 'Nothing got more expensive here.'" | **correct** — "A capability step. The two metering changes are April 2026, four months downstream, and the Nov 24 annotation says explicitly that nothing got more expensive." |
| **3.** What exactly did Uber cap, and how big is it? | **correct** — "$1,500 mahine, lagbhag ₹1.4 lakh, ek engineer ke liye, **ek tool** ke liye. Sirf woh tools jo khud code likhte hain. Do tools ka saal $36,000, engineer ki pay ka lagbhag 11%, aur woh pay ka number bahar ka andaaza hai, Uber ka nahi." | **correct** — "$1,500/month per engineer *per tool*, agentic tools only, Cursor and Claude Code, not chat. Two tools ≈ $36,000/yr, ~11% of an estimated median total pay of ~$330,000 — an outside estimate, explicitly not Uber's figure." | **correct** — "$1,500 har mahine, ₹1.4 lakh, ek banda ek tool. Do tools saal ka $36,000, yaani engineer ki **estimated** pay ka 11%. Aur woh estimate bahar ka hai, Uber ka figure nahi." | **correct** — "$1,500/month/engineer/agentic tool. ~$36k a year for two, ~11% of a ~$330k median comp, and the tile itself says outside estimate, not Uber's figure. The hedge no longer needs the previous section." |

**Against the model answers.** All twelve cells match. Nobody produced a
chat-versus-agent multiplier (guardrail 2 holds — everyone used "a few thousand"
against "over a million"). Nobody attributed the comp figure to Uber. **Sana's
Q3, last pass's single fail condition, is now a clean pass with both hedge words
in her own retell.** That fix worked exactly as intended.

---

## Section by section

| # | Kind · title | Aarav | Meera | Sana | Karthik | Score A/M/S/K |
|---|---|---|---|---|---|---|
| 1 | `you-think` · Cheaper tokens, bigger bills | "Sabko lagta hai AI sasta hai, par Uber ka saal bhar ka paisa chaar mahine mein gaya." | "The belief, then the four-month counter-fact and the cap." | "AI sasta hone se bill chhota nahi hota. Budget April mein khatam." | "My own premise and the number that breaks it. One unknown word; the eyebrow says ARITHMETIC." | 5/5/5/4 |
| 2 | `jargon-buster` · Only one of these is your bill | "Bijli bill: rate alag, units alag. Token = shabd ka tukda. **2023 mein ek sasta model $0.25 per million tha**, ab aur sasta." | "Three words, one of which is the invoice. The 2023 anchor is where the cheaper-AI headline comes from." | "Token ek piece hota hai. Rate aur total alag. Sasta wala number 2023 ka hai." | "Token, unit price, task cost. The falling half finally has a date and a figure on it. 'Newer ones cost less' is unscoped, though." | 4/5/4/4 |
| 3 | `scaling-plot` · One job, over a million tokens | "Chat ka jawab kuch hazaar pieces. Ek coding job 13 lakh se upar." | "Two points, log axis, three orders of magnitude, and it flags which one is measured." | "Ek kaam mein dus lakh se zyada. Upar wala dot hi asli hai." | "Order-of-magnitude gap, honestly starred. Only one point is measured and it says so." | 4/5/4/5 |
| 4 | `three-steps` · The software changed jobs | "Tools achhe hue, ab loop mein kaam karta hai, har baar sab dobara bhejta hai." | "Capability step, the loop, the replay. No price in any of the three." | "Tool khud try karta hai, fail hota hai, phir try karta hai, aur sab dobara bhejta hai." | "Ship, loop, replay. The quote is the mechanism verbatim." | 4/5/4/5 |
| 5 | `benchmark-chart` **(hero)** · Most of it was re-reading | "Poore kaam ka zyada hissa dobara padhna tha. Naya code sirf 17,112." | "~86% of a 1.36M-token task was re-sent context; output was 17k." | "Sabse lamba bar re-reading ka. **Cached matlab jo pehle bhej chuka hai.** Naya code sabse chhota." | "Cached dominates, output is a rounding error. The chart is the replay mechanism drawn." | 5/5/4/5 |
| 6 | `timeline` · Billing changed, prices rose, budget gone | "Meter laga April mein, naya model do guna mehnga, budget khatam, phir June mein cap." | "Capability → metering → frontier repricing → exhaustion → cap." | "Sab April mein hua. **Frontier matlab sabse naya aur sabse capable model.** Phir June mein limit." | "Six dates, two annotated. But 'twice the price' here against 'newer ones cost less' in section 2 — I went back." | 4/5/4/4 |
| 7 | `number-sense` · One engineer, one tool, one month | "$1,500, ₹1.4 lakh, ek banda ek tool. Pay ₹3.1 crore ke aas paas, woh bhi andaaza." | "The cap, felt. The ₹ bracket is what makes it land." | "₹1.4 lakh har mahine, ek engineer ke ek tool pe. Bahut zyada." | "$1,500/month/tool. The ₹ bracket is dated September on a June issue. I still notice." | 5/5/4/4 |
| 8 | `data-readout` · Where else the money moved | "$2,180 ke tokens, subscription sirf $200. Top model do guna. Price wahi, cost 1.4×. Aur 11%." | "Arbitrage, frontier repricing, tokenizer drift, comp share. Four readings, and the intro no longer claims they explain the $36,000." | "Ek bande ne $2,180 ke tokens use kiye, paisa $200 diya. Price per piece same, phir bhi cost upar. 11% wala estimate hai." | "Four readings, each self-contained now. Tile 3 makes its own argument without the tokenizer word." | 4/5/4/4 |
| 9 | `prose` · The work changed shape | "Ek price badhi, upar wale market mein. Baaki jagah price wahi, kaam bada ho gaya. Achha code ab bhi mehnga." | "The landing works and the concession is made first. Three price states in one paragraph, though." | "Rate kam hua lekin ek kaam mein lakhon units lag gaye. Meter wahi ginta hai." | "Good close. It concedes the April rise before making the general claim, which is what I wanted. Rose, held, fell — three states, never labelled as three tiers." | 4/4/4/4 |

**Scores** (5 = retold, nothing re-read · 4 = retold, one re-read · 3 = gist only
· 2 = wrong gist · 1 = nothing).

| # | Aarav | Meera | Sana | Karthik | Σ | vs pass 1 |
|---|---|---|---|---|---|---|
| 1 | 5 | 5 | 5 | 4 | 19 | = |
| 2 | 4 | 5 | 4 | 4 | 17 | −2 (the 2023 anchor costs a beat, buys the argument) |
| 3 | 4 | 5 | 4 | 5 | 18 | = |
| 4 | 4 | 5 | 4 | 5 | 18 | = |
| 5 | 5 | 5 | 4 | 5 | 19 | **+1** |
| 6 | 4 | 5 | 4 | 4 | 17 | −1 (frontier glossed, fall/rise collision surfaces) |
| 7 | 5 | 5 | 4 | 4 | 18 | = |
| **8** | **4** | **5** | **4** | 4 | **17** | **+3** |
| **9** | 4 | **4** | 4 | **4** | **16** | **+2** |

No section below 4 for anyone. No question wrong or "not in the draft" for
anyone. PASS.

---

## The lost sentences

| Reader | Sentence (quoted) | Why, in five words |
|---|---|---|
| **Aarav** | "A cheap 2023 model launched at $0.25 per million, and newer ones cost less." (§2, `per-token price`) | Per million *what* — elided |
| Aarav (2) | "About $20 a seat a month, plus what you use." (§6, Apr 14) | "Seat" never glossed anywhere |
| **Meera** | "Where the price per piece held still, the bill rose, because the work changed shape…" (§9) | Fronted clause, three joined ideas |
| **Sana** | "Each step up the side is ten times the step below it, so a small-looking gap on this chart is a large one." (§3 `howToRead`) | Log scale explained before seeing |
| Sana (2) | "About $20 a seat a month, plus what you use." (§6) | Software "seat" means nothing |
| **Karthik** | "**New frontier model, twice the price.**" (§6, Apr 23) — read against §2's "newer ones cost less" | Cheaper claim unscoped, rise scoped |
| Karthik (2) | "The rate per unit fell…" (§9) — read against "One price rose" and "held still" in the same paragraph | Three price states, one paragraph |

**Cleared since pass 1:** "cached" (§5 intro), "frontier" (§6 intro), "rate card"
(gone from the issue), "list prices" (now "the advertised price"), "Nobody raised
a price" (rewritten), "that outside estimate" (now self-contained).

**Still unglossed, and still not fatal:** "the seat" (§6 Apr 14 — the event's own
label, "Anthropic starts billing the seat by usage", carries the meaning without
it), "task autonomy" (§3 x-axis — only two labelled dots sit on that axis, so the
label is decoration), and the middle bar label "input sent" (§5 — the intro
glosses `cached` and the caption names `cached` and `new code`, so the 169,818
bar is the one slice with neither a gloss nor a caption mention; it carries no
claim, so nobody stumbles, but nobody can say what it is either).

---

## The hook

Unchanged, and the verdict is unchanged.

> "You keep hearing AI is getting cheaper. Uber burned its whole 2026 AI budget
> in four months, and capped every engineer."

**Aarav — yes.** "You keep hearing" is the headline he has been reading.
**Meera — yes.** Reversal in 21 words with a named company.
**Karthik — yes**, and the twist is the right one for him.
**Sana — half**, exactly as last pass: "Uber" and "burned" stop her, but the
number she is handed is a company's number. Her own number, ₹1.4 lakh a month,
is seven sections down. **The head is at 78 of 80 words before the first
graphic, so this stays an observation and not a fix request.**

The title chain still carries the argument on its own: *year of AI money lasted
four months* → *the software changed jobs* → *most of it was re-reading* → *the
work changed shape*.

**Dek placement:** settled by the operator (renders at y=763 at 375×812, inside
the first viewport, in the 2×2 facts grid). Not re-raised.

---

## Findings on the seven test points

### 1 · Section 9 no longer contradicts the page — confirmed, for both readers

**Closed.** Meera and Karthik were the two who stopped on "Nobody raised a
price." Neither stops now. The new opening makes the concession *before* the
general claim ("One price rose in April, at the top of the market"), and then
scopes the claim to the case it is true of ("Where the price per piece held
still"). Meera's words this pass: "it concedes the thing I just read, then says
what it actually means." Karthik's §9 score moves 3 → 4 and Meera's 3 → 4.

Both are 4 rather than 5 for a new reason. See "What the fixes created".

### 2 · Does one dated figure close Karthik's objection? — **Yes for comprehension, no for evidence. And the evidential half is a closed door, not a gap.**

This is the one you asked me to judge hardest, so here is the strict answer in
three parts.

**What changed, measured by what he can say back.** Last pass Karthik's Q1
carried the objection *"the issue never shows me the price falling."* He could
not state the falling half at all — it existed only as a headline he was asked to
accept. This pass his Q1 reads: *"the fall is one dated point, a 2023 model at
$0.25 per million with 'newer ones cost less'."* That is the difference between
**"not in the draft"** and **"in the draft, with a date and a figure."** It is a
real move and it is the right one.

**Why the gloss registers as evidence and not as a definition.** I expected it
not to: a number buried in the third sentence of a term-of-art definition is a
place readers skim. The sentence that saves it is the one after — *"That is the
cheaper-AI headline."* That clause explicitly wires the definition back to the
hook's claim, so the reader converts it from "here is what a per-token price is"
into "here is where the thing you keep hearing comes from." Without that clause
the anchor would have been invisible. Keep it.

**Where it still falls short, and be clear that it does.** A single number in a
gloss is not a chart, and the asymmetry is still visible to a technical reader:

| | The fall | The rise |
|---|---|---|
| Marks on the page | none | 1 timeline event (`state: fail`), 1 annotation, 2 tiles |
| Figures | one, dated 2023 | 2×, ~1.4×, both dated April 2026 |
| Second term | none — "newer ones cost less", undated, unquantified | each has a named before-and-after |

The fall has a *start* point and a direction word. It has no *end* point. Nothing
in the issue tells the reader what a comparable token costs today, so the fall
can be stated but not measured, while the rise can be measured twice.

**But the drawn version is a door the record closes, not one the drafter left
shut.** Storyboard §8d rules `moore-ladder` out on exactly this ground: the
record holds "$0.25, $0.05, $0.20, $1.25, $1.00 across five different models",
which is a scatter across capability tiers and not a series, and plotting it
"would assert a fall that mixes tiers." The one figure with the right shape (the
$18.40 → $6.07 blended cost of intelligence) is the dossier's flagship
[UNVERIFIED] item and is barred by guardrail 4. **Asking for a chart of the fall
is asking for a fact that does not exist in this issue's seven sources.** The
storyboard names it as "the highest-value research job this issue has" — which is
the honest place for it: a future research pass, not this rewrite.

**So: the objection is closed for the purpose of this gate.** Karthik answers Q1
correctly, retells §2 accurately, and does not finish the issue believing prices
went up. What remains is not a comprehension defect — it is an evidence
asymmetry the record cannot fix, and the issue should stop asserting more than
the anchor supports rather than try to draw what it cannot. See fix 1, which is
two words and comes out of the body.

### 3 · Sana's ~11% hedge — **confirmed intact**

The fail condition from pass 1 is gone. Her Q3 this pass: *"do tools saal ka
$36,000, yaani engineer ki **estimated** pay ka 11%. Aur woh estimate bahar ka
hai, Uber ka figure nahi."* Both hedge words are in her own retell.

The reason it worked is worth recording: the hedge now sits in **the two lines a
tile reader actually reads** rather than in a note pointing at the previous
section. "estimated" is inside the label, so a scanner who reads only labels
still gets one hedge; "an outside estimate, not Uber's figure" is a complete
sentence with its own noun, so nothing has to be carried across a section
boundary. Aarav and Meera were already carrying it from §7; Sana was the reader
it was written for and it reached her.

§8 tile 4 is the single biggest improvement in the draft.

### 4 · "Rate card" gone; the tiles readable — **confirmed**

"rate card" appears exactly once in the file, in the EDITOR NOTES block, which no
reader sees. Both tile rewrites land:

- **Tile 3** — "Cost rise with the price per piece unchanged" / "The April update
  counts the same text as more pieces." This now makes its own argument in the
  issue's own vocabulary: price per piece held, the count of pieces for the same
  text went up, so cost went up ~1.4×. Sana can retell it; last pass she could
  not ("Nothing here she can picture"). The word "pieces" is doing the work —
  it now runs §2 → §3 → §5 → §8 → §9 and is the strongest thread in the issue.
  One small residual: **"The April update" has no antecedent.** The Opus 4.7
  timeline event was dropped in the rewrite, so no section names an April update
  that changed how text is counted. The claim survives without it, which is why
  the score is 4 and not 3.
- **Tile 1** — "Valued at the advertised price. The subscriptions behind it cost
  $200." The comparison that *is* the fact is now stated instead of left as
  arithmetic. Sana got it this pass; last pass she did not.

### 5 · "Cached" and "frontier" glossed — **confirmed, both effective**

Sana used both glosses back verbatim in her retells ("cached matlab jo pehle bhej
chuka hai", "frontier matlab sabse naya aur sabse capable model"), which is the
strongest evidence a gloss can produce. §5 moves 4 → 5 for Aarav.

One note on placement. My pass-1 direction was "the gloss belongs on the chart,
not in the intro that precedes it." The stylist put it in the intro and it works
anyway, because the intro sits immediately above the bars and the bar label is
the same word. No fix needed. The residual is the *middle* bar: "input sent" is
now the only label the reader meets with neither a gloss nor a caption mention,
and with "cached" defined as "already sent once" it is not obvious that "input
sent" means the fresh remainder. It carries no claim, so nobody stumbles — but
nobody can say what it is.

### 6 · The electricity bill now runs §2 → §8 → §9 — **confirmed**

"Four more readings, taken off other meters" does the job: it re-enters the frame
at exactly the section that fell over last pass, and it sets up §9's "that is
what the meter counts" so "again" is recalling something 300 words back instead
of 700. Aarav and Sana both reached for the bill unprompted in Q1 again.

One honest wrinkle: **tiles 2, 3 and 4 are not readings off meters.** Two are
prices and one is a share of pay. The metaphor stretches across the tile grid.
Nobody was confused by it — a "reading" is loose enough to cover a number — but
it is doing less work than it looks like it is doing. Not a fix.

### 7 · §8's intro no longer over-promises; $36,000 tied to "that cap" — **confirmed**

Karthik's pass-1 complaint was "four unrelated readings under an intro that
promises they explain the $36,000." That intro now hands the reader the $36,000
as a closing figure from §7 and then opens a new frame ("four more readings"), so
the reader is not hunting for a link that was never there. His §8 score holds at
4 and his retell now says "each self-contained."

"A year of that cap, on two tools, is roughly $36,000" reads cleanly as derived
from the $1,500 above it. Aarav retold $36,000 this pass; last pass he dropped it
entirely.

---

## What the fixes created

One new problem, and it is the sharpest sentence-level issue left in the issue.
It is not a regression — it is the price of putting the falling half on the page,
and it was invisible until the anchor existed.

**The issue now names three price movements and never says they are three
different parts of the market.**

| Where | What it says | Scope given |
|---|---|---|
| §2 gloss | "newer ones cost less" | **none** |
| §6 event + annotation | "New frontier model, twice the price" / "At the frontier, the per-token price is now rising" | the frontier |
| §8 tile 2 | "Newest top model's price against the last one" / "At the top end, prices are rising" | the top end |
| §9 sentence 2 | "One price rose in April, at the top of the market" | the top of the market |
| §9 sentence 3 | "Where the price per piece held still, the bill rose" | implied: elsewhere |
| §9 sentence 5 | "The rate per unit fell" | **none** |

Every *rise* statement is scoped, three times over, and §9 scopes it a fourth
time. Both *fall* statements are unscoped. The reconciliation is available to any
reader who assembles it — cheap tier falls, top tier rises, middle holds — but
**the issue never states the three-way in one breath**, and §9 puts "rose",
"held still" and "fell" in a single paragraph about apparently the same thing.

Karthik went back at §6 ("twice the price" against "newer ones cost less") and
stopped again at §9. Meera reconciled it but called it out. Aarav and Sana did
not parse three states at all — they read "prices mostly didn't go up, the work
got bigger", which is the intended landing, so no retell is lost.

This costs two 5s (Karthik §2 and §6, Meera §9) and nothing more. It is a
two-word fix.

---

## What would fix it (direction only)

All three are in the body. **Body headroom is 81 words (1,019 of 1,100); the head
is at 78 of 80 and nothing here touches it or §1.**

1. **§2: "newer ones cost less" needs the scope every rise statement already
   has.** The issue scopes its rises to "the frontier" and "the top end" four
   times. The fall is the only movement stated without a tier, which is what
   collides with §6's "twice the price" and what puts three unlabelled states in
   §9's paragraph. Give the fall the same kind of scope the rises have, in the
   same gloss. **Cost: ~2–3 words, from the body's 81.** This is the highest-value
   move left and it improves finding 2 and the §9 paragraph at once.
2. **§6 Apr 14: "the seat" is the last load-bearing-adjacent blank.** It is the
   one term two readers named as a lost sentence and the only unglossed term left
   in the narrative spine. The event's own label carries the meaning, so this is
   a polish, not a rescue — but it is the cheapest gloss remaining. **Cost: ~4–5
   words, from the body's 81.**
3. **§5: the middle bar and §3: the x-axis.** "input sent" is the only label with
   neither gloss nor caption mention, and the caption names only two of three
   bars. "task autonomy" on an axis carrying two labelled dots is a term of art
   doing no work. Both are **label swaps, net zero words** — they cost nothing
   from any budget.

**Do not change:** the *hisaab* placement (skip test passes cleanly on the
eyebrow above it — Karthik loses one beat and no meaning); the two rupee brackets
(₹1.4 lakh is still the only figure in the issue that made Aarav and Sana react);
the "That is the cheaper-AI headline" clause (it is what converts the 2023 anchor
from a definition into evidence); §8's four tiles as now written; §9 from "Think
of it like your electricity bill again" onward; and the "pieces" thread running
§2 → §3 → §5 → §8 → §9.

---

## Outside my lane, flagged and not judged

- **⚠ check:prose.** §9's single paragraph is **90 words** against the
  storyboard's row-9 budget of ≤ 75. That is where roughly 15 of the spent
  headroom went. Inside the issue ceiling; a budget question, not a
  comprehension one.
- **⚠ check:prose.** "Press **Linear** for the evenly spaced view" (§3
  `howToRead`) — a capitalised token of 2+ characters that the name heuristic
  will score as a distinct name. Cosmetic against a ration of 12 with 8 expected.
- **⚠ verify.** §7's source line still reads "Converted at about ₹95 to the
  dollar, September 2026" on an issue the facts rail dates 4 June 2026. Karthik
  and Meera both still stop on it. It costs a beat of trust, never the meaning —
  unchanged from pass 1, where it was recorded as a note rather than a fix.
