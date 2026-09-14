---
paths:
  - "research/**"
  - "src/content/issues/**/*.mdx"
---

# Voice — the register, then the eight jobs

The runtime contract is `research/_voice/_voice-core.md` **v2 (signed
2026-09-13, `docs/REGISTER-PLAN.md`)**, read by every writing agent every
run. `mode-library.md` is the deep reference and loses to the contract where
they disagree. This rule carries only what is violated most often.

## The register outranks the mode (Rule 0)

- **Plain Indian English is the default.** Explicit, concrete, hand-held,
  placed in India: every term of art glossed the moment it appears; every
  abstraction given a concrete thing in the same section; every number a
  comparison the reader can feel (₹ beside $, lakh/crore); "you" and "we"
  free; one connective sentence per paragraph; no run of three sentences
  under eight words.
- **A Hindi word only where it is the natural word — and never load-bearing.**
  Four tests: delete it and the English still says everything; an Indian
  would actually say it there; a Lallantop sub-editor would not wince; it is
  nowhere near a number, a source, a caption or a technical term. Roman, set
  roman; lexicon spellings (`research/_voice/hinglish-lexicon.md`); ≤ 1
  phrase per paragraph; none in `caption` / `howToRead` / `plain` / `source` /
  data labels. When in doubt, leave it out.
- **Names rationed** (≤ 12 per issue, each with a role). **Titles state the
  finding** (never "The ‹Noun› That ‹Verb›s"). **Hook** ≤ 25 words with a
  number, a "you", the twist.

| Job | When |
|---|---|
| CONVERSATIONAL EXPLAINER | **The default — at least half the sections.** Analogy → number → restatement → question |
| AWE | Scale, deep time, mechanism marvel — with an Indian-scale conversion |
| CALM-STRUCTURAL | Naming structural cost, with the connective written |
| INVESTIGATION | The anomaly as a graphic first, then the evidence |
| FORENSIC | Mechanism with human stakes, two short sentences at a time, glossed |
| SATIRICAL EXPOSURE | Contradiction by its own data — ≤ 1, and **0 on the politics desk** |
| LYRICAL COMPRESSION | One landing — ≤ 1 paragraph |
| DRY WIT | A device (one deadpan sentence), never a section |

## Blending — hard limits

- One dominant job per section; **3–5 jobs across an issue.**
- Floors (REGISTER-PLAN §5.1): ≥ 6 in 10 sections visual; never two text-only
  sections adjacent; the first section a graphic; ≤ 3 prose sections of
  ≤ 200 words; ≤ 1,100 reader-facing words; ≤ 80 words before the first graphic.

## The AI-tell catalog (twenty-two — contract §6)

Every prose field passes these before it is written or rewritten. **Applying a
job does not excuse a tell; being plain does not either.**

| Tell | Rule |
|---|---|
| An em-dash anywhere in prose | None by default; hard cap one per issue (2026-09-14) |
| A semicolon in prose, a caption or a note · a colon as drum-roll | A full stop; colons only before a list, a gloss or a quote |
| *delve, tapestry, landscape, navigate, robust, leverage, testament, underscore, pivotal, crucially, notably, nuanced, journey, unlock, foster, at its core, the reality is* · a sentence opening "Notably" | Never; say the plain thing |
| "not about X, it's about Y" in any dress · a triplet placed for rhythm · a mirrored close | Say Y; two things or one; once is a device |
| `"It is not X. It is Y."` | Max 1 per issue, and only if it *is* the argument |
| 3× short sentences closing a section | Max 1 triple-fragment close per issue |
| `"the mechanism"`, `"structural argument"` as abstract-noun labels | Replace with the actual claim |
| `"First… Second… Third…"` | Remove the ordinals, interleave the ideas |
| "The ‹Noun› That ‹Verb›s" title · antithesis dek beside a reversing hook | State the finding; one reversal per issue |
| Authors + institutions + outlets stacked in one sentence | The source line carries them |
| Three sentences under eight words in a row · a name used once | Join two with a connective; cut or describe the name |
| "Toh dosto" · *yaar/bhai* on politics or earth · italicised or Devanagari Hindi · literal idioms · "samjhe?" | Cut |

## The three comprehension fields — distinct roles

Confusing these trips the verifier's `PLAIN-CLAIM`, `CAPTION-FORM` and
`REDUNDANT-HOWTO` flags:

- **`plain`** — the FORM of the graphic ("each block is one seat"). Never data.
- **`caption`** — the DATA claim. The only one the verifier traces to a source.
- **`howToRead`** — how to use it; renders above the graphic.

## Sourcing

CANON §7: **no source, no section.** Every `sourceRefs[]` entry resolves to a
real `source.id`; `sources[].url` must be a real URL. RAG chunks marked
`GUIDE-ONLY` may direct you to a claim but **must never be quoted** — quote only
from the original.
