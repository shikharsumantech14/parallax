# Reader panel: Open models are four months behind, not years

- **Draft:** src/content/issues/2026-09-21-open-models-four-months-behind/index.mdx
- **Storyboard:** research/tech/2026-09-21-open-models-four-months-behind-storyboard.md
- **Pass:** second (after stylist)
- **Read:** 2026-09-22
- **Verdict:** PASS

> Note to the operator: an earlier report at this same path recorded a BLOCK,
> on the grounds that section 5's `version-graph` intro promised lab names
> ("Three labs you have probably never heard of") that the section never
> delivered. In the draft as it stands now, that gap is closed — the intro
> reads *"Three Chinese labs: DeepSeek, Moonshot, which makes Kimi, and
> Zhipu, which makes GLM"* — so this pass re-reads the current file and
> supersedes that verdict.

## The quiz

| Question | Aarav | Meera | Sana | Karthik |
|---|---|---|---|---|
| 1. How far behind the best closed model is the best open one, and is that gap growing or shrinking? | correct — "About four months behind, and it's not closing. It actually went from three months to four, and a separate 'which model do people prefer' score also grew, from 0.5% to 3.3%." | correct — "Four months, or eight points on Epoch's index. The gap widened, it didn't shrink." | correct — "Stuck at four months, used to be three. Even the 'which one do people like better' number moved against open models." | correct — "Four months / eight ECI points. Grew, didn't narrow, since October 2025." |
| 2. What do you actually get when a model's weights are "open"? | correct — "Just the model file. The licence, the training code, the training data, and the computing power to run it don't necessarily come with it." | correct — "The download, full stop. Everything else in the stack below it — licence, code, data, compute — is usually not there." | correct — "You get the file to run. Whether you're even allowed to, whether you can see how it was trained, and whether you can afford to run it are all separate questions." | correct — names all five layers in order: weights, licence, code, training data, compute. |
| 3. If today's frontier is four months old and free, why do so few take it? | correct — "Because free only covers the file. Running it costs money, and hardly anyone uses the actual best open models — 40% of state AI projects picked Meta's Llama instead, and most downloads go to tiny models." | correct — "The compute is the real bill, so 'free' doesn't mean much. Governments overwhelmingly picked Llama, not the frontier labs, and most downloads worldwide are small models." | correct — "The download costs nothing, but running it isn't free, so almost nobody bothered — 40% of government AI projects went with Llama and none picked the actual best ones." | correct — "139 state-backed projects, 40% Llama, zero for the actual frontier labs, and 83% of all downloads are sub-1B-parameter models." |

## Section by section

| # | Kind · title | Aarav retell | Meera | Sana | Karthik | Lowest score · why |
|---|---|---|---|---|---|---|
| 1 | you-think · "Two measurements, one answer" | 5 — "I thought open models were years behind; a research group's tests say four months, and it's not closing." | 5 — same, no re-read. | 5 — the assumption/reality contrast landed on first pass. | 5 — clean, matches caption exactly. | 5 · all clean |
| 2 | jargon-buster · "What the labels actually mean" | 5 — "weights = the file, open source = file + code + data (rare), ECI = the one score both models get ranked on." | 5 — glosses landed inline, no stall. | 4 — got weights and open source at once; ECI took a beat to place as "the scoreboard." | 5 — precise, no Hindi to skip. | 4 · Sana, ECI needed a beat |
| 3 | timeline · "Three months behind, then four" | 4 — got the 3→4 month arc, needed a second pass to place Kimi K3's catch-up before the September jump. | 4 — same re-read, on "the day an open model caught April's best closed one." | 4 — followed the dates but had to re-scan to see the catch-up happened *before* the gap widened again. | 4 — one re-read on ordering, but the state colours (default/key/now) helped him self-correct. | 4 · all, the mid-sequence catch-up event |
| 4 | benchmark-chart · "Eight points, spread very unevenly" | 4 — got "8 points ahead on average, but only 3 points apart on hard science" after a second look at the "two readings" sentence. | 4 — same sentence slowed her down, then the bar order (small gap last) confirmed it. | 4 — "closed model way ahead on a puzzle game, basically tied on the science test" — got the point without needing the abstract framing sentence. | 5 — read it as data first, prose second; no stall. | 4 · A/M/S, the "two readings of the same gap" sentence |
| 5 | version-graph · "Not the labs you have heard of" | 4 — "the best open models come from Chinese labs, not the ones people have heard of — DeepSeek, Moonshot which makes Kimi, Zhipu which makes GLM — and most releases here are open." | 4 — the inline glosses (Moonshot→Kimi, Zhipu→GLM) kept her from bailing; retold correctly from the intro plus the caption. | 4 — retold the caption cleanly ("8 of 10 are open, newest in July") and could name DeepSeek and Kimi, but not which lab made GLM without checking back. | 4 — tracked all three lanes plus OpenAI's without trouble, names and all. | 4 · Sana, one lab-to-product link needed a second look |
| 6 | arch-stack (HERO) · "Free is only the top layer" | 5 — "the file is free, but the licence, code, training data and the actual computer to run it mostly aren't." | 5 — the five-layer stack was the clearest single idea in the issue. | 5 — "you get the cake, not the oven, the recipe, or the kitchen." | 4 — "kharcha" left a blank in the intro sentence, recovered from "somebody else's bill" just before it; the five layers themselves were unaffected. | 4 · Karthik, the one Hindi word in the issue |
| 7 | number-sense · "Three prices for the same million tokens" | 5 — "$50 for the closed model, $15 for the best open one, $0.28 for the cheapest — but non-English questions cost five times more." | 5 — clean ladder, no re-read. | 5 — same, and she flagged the Indian-language line as the one she'd screenshot. | 5 — precise numbers, no ambiguity. | 5 · all clean |
| 8 | prose · "The offer nobody took" | 5 — "139 government AI projects, 40% picked Llama, zero picked the actual best models, and most downloads are tiny models anyway." | 4 — got the finding; the "textbook nobody opens" analogy needed a beat before the compute-cost point clicked. | 4 — same analogy needed a re-read, then "free but nobody uses it because running it costs money" landed. | 5 — read the numbers straight through, analogy didn't slow him. | 4 · Meera/Sana, the textbook analogy |

## The lost sentences

| Reader | Sentence (quoted) | Why, in five words |
|---|---|---|
| Aarav | "Those are two readings of the same gap: the points say how far behind, the months say how long the catch-up took." | abstract parallel, no concrete anchor |
| Meera | "In between, the day an open model caught April's best closed one." | vague verb "caught," unclear referent |
| Sana | "Think of a free textbook nobody opens because the shelf sits in another building." | analogy needs a beat to click |
| Karthik | "...and that kharcha does not come with the file." | Hindi word blank, redundant restatement |

## The hook

**"Kimi K3 took 84 days to reach the frontier OpenAI had in April. You can download it free. Almost nobody has."**

Stopped the thumb for all four. It has a number a reader can feel (84 days), a "you" with something to do (download it), and a twist (nobody does). Aarav and Karthik took the names at face value and kept scrolling to find out what they meant. Meera got a payoff inside three short sentences, which is what keeps her from leaving. Sana's read was the most provisional of the four — "Kimi K3," "OpenAI" and "the frontier" are all unglossed at this point — but the concrete "84 days / free / almost nobody" pattern reads on Instagram logic even before she knows what a "frontier" model is, so it still pulled her in rather than losing her.

## What would fix it (direction only, never the sentence)

1. **Section 4, the "two readings of the same gap" sentence** is the one purely abstract beat in an otherwise concrete issue — the only sentence three of four readers needed twice. It states a relationship (points measure X, months measure Y) with no anchor either side of the colon. Give it one concrete peg — tie it back to a number already on the page — so it resolves in one pass instead of two.
2. **Section 3's catch-up event** ("the day an open model caught April's best closed one") sits in the middle of the timeline before the reader has anywhere to place it against the two Epoch readings that bracket it. Naming what "caught" means right there (matched the same score) rather than trusting the hook's earlier mention to carry it would save the re-read for Aarav, Meera and Sana alike.
3. **Section 6's "kharcha"** does the same job the English clause just did ("somebody else's bill"). It passes the skip test for Karthik — he loses nothing — but that also means the Hindi word isn't earning its own place per §2's natural-word test. Either let it carry a job the English hasn't already done, or cut it.

Minor, not blocking: **Section 8's "shelf sits in another building" analogy** needed a second beat for Meera and Sana before it connected to the compute-cost point that follows it. A more physically located image (whose shelf, which building) would let it land on first read.
