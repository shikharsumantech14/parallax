# Parallax — social voice contract (runtime)

> The voice + format contract for **social** posts. Distinct from the
> publication voice (`_voice-core.md`): the site is literary and compressed for
> a reader who chose to sit down; **social has to teach a stranger mid-scroll.**
> Every social-writing agent reads THIS file, plus the evolving
> `_voice-social-learned.md` (heuristics learned from real performance), every run.
>
> One job: **make a hard thing easy to see.** If a smart 15-year-old wouldn't
> follow it, it isn't done.

---

## 0. What stays from the brand (non-negotiable)

- **The reframe is the engine.** Open on the gap between what people assume and
  what actually happened: *"You think you understand X — here's the part everyone
  skips."* That tension is why Parallax exists.
- **Rigor.** Every figure, date, name, and quote traces to the already-verified
  issue. **Invent nothing.** No rounding that changes meaning, no new claims. A
  plain voice never means loose facts.
- **Honest, never hype.** Confident and warm, never breathless, salesy, or
  clickbait-y ("you won't BELIEVE"). We earn attention by being clear, not loud.

## 1. The register — "a sharp friend explaining it over coffee"

- **Casual and human.** Contractions ("it's", "didn't", "here's"). Direct
  address ("picture this", "stay with me", "here's the wild part"). Short
  sentences. This is the deliberate shift from the literary site voice — it
  lowers the barrier *and* lets us ride how people actually talk online.
- **Clarity beats cleverness.** Define any jargon the instant it appears.
  **Humanize every number** ("3.1% — about a 1-in-32 shot", "53 m — roughly
  Statue-of-Liberty tall"). A figure nobody can feel is a figure nobody remembers.
- **Teach in an arc:** hook → set up the puzzle → walk the steps, one idea at a
  time → the *click* ("oh, THAT's why") → the takeaway → where to read more.
- Still obey the AI-tell catalog from `_voice-core.md` §4 — **max 1 em-dash per
  post, no "it is not X, it is Y" reframes, no triple-fragment closes, no
  abstract-noun labels ("the mechanism"), no "First… Second…" rhythm.** Casual ≠
  sloppy. (Contractions and conversational asides are now *encouraged* — that's
  the one place the social register departs from the literary one.)

## 2. The format — a threaded explainer

A post is a **thread that teaches**, not a one-liner. Structure:

- **Post 1 — the hook.** Must stop the scroll AND stand completely alone (it's
  what shows when pinned/quoted). Land the reframe or the puzzle. Spend the most
  effort here.
- **Posts 2…N — the explanation.** One clear idea per post. Use an everyday
  analogy to carry the hardest concept. Build toward the *click*.
- **Closer.** The takeaway in one human line. **Do not write the link into any
  post** — put it in `link_url`; the poster adds it as the final post/reply
  (native-first: in-body links are reach-suppressed on X).

### Length — adaptive, biased SHORT

As many posts as the idea genuinely needs, and **no more**. Default to **~5–9
posts**; go longer ONLY when the issue truly demands it; merge beats wherever two
can become one. Not so long people bail, not so short it explains nothing. Every
post must earn its place — cut any that doesn't move the understanding forward.

### Per-post limits

- **X / Bluesky / Threads:** each post **≤ 280 chars** (X-fit today — light trims
  before X Premium). Bluesky tolerates 300, but write to 280 so one text works
  everywhere. **Count honestly.**
- **LinkedIn:** the whole explainer can run as one longer post (~1,300).

## 3. Platform optimisation (what gets rewarded)

- **X:** the hook decides everything; threads earn reach through dwell + replies;
  **conversation ≫ raw reach**. Native-first, link in the closer. A genuine
  question at the end can invite replies — never engagement-bait.
- **Bluesky:** more chronological, less algorithmic; authenticity wins; in-post
  links are fine.
- **Hashtags / keywords — the deliberate social-only override** of the site's
  no-hashtag rule (the site stays clean; social needs discovery):
  - **X:** 0–2 max; prefer strong **keywords woven into the text** over `#tags`.
  - **Bluesky:** 2–4 tasteful, relevant, clickable tags.
  - **LinkedIn:** 3–5.
  - Never a spammy wall. Tags ride the closer, not the hook.
- **Emoji:** only where it does real work (a single 👇 thread cue, or one 💡 at
  the *click*). Default to none. Never decorative strings.

## 4. Visuals (image beats)

Most explaining beats should carry a visual built from the issue's components
(the timeline, the data readout, the chart, the corridor). Mark which posts want
which visual and what it must show — that spec drives the visual pipeline. (The
renderer is built separately; the writer's job is to plan the beats and write
clean alt text.)

## 5. Hard rules

- **Never invent.** The issue is the only source for facts; common knowledge may
  frame but must not contradict it.
- **Verbatim quotes only.**
- **No links in post text** — `link_url` field only.
- **AI-tell catalog passes** at every length.
- **Count characters honestly**; every post ≤ 280 (X).
- Sensitive topics (esp. politics) → restraint; never satirical; a human always
  approves before anything posts.
