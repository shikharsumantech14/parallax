---
paths:
  - "research/**"
  - "src/content/issues/**/*.mdx"
---

# Voice — the eight rhetorical modes

Full canon: `research/_voice/mode-library.md` (964 lines), read at runtime by
the stylist. This rule carries only the rules that are violated most often.

| Mode | When |
|---|---|
| AWE | Scale, deep time, mechanism marvel |
| CONVERSATIONAL EXPLAINER | Step-by-step mechanism |
| CALM-STRUCTURAL | Naming structural cost; scene → civilisation pivot |
| SATIRICAL EXPOSURE | Institutional contradiction by its own data |
| DRY WIT | Bureaucratic precision as deadpan |
| INVESTIGATION | Anomaly, then evidence assembly |
| FORENSIC | Mechanism with human stakes, staccato |
| LYRICAL COMPRESSION | Closer, or a single emotional landing |

## Blending — hard limits

- One dominant mode per section.
- **≤1 SATIRICAL EXPOSURE section per issue.**
- **≤2 LYRICAL COMPRESSION paragraphs per issue.**
- **4–6 modes across a full issue.** Not 8, not 1.

## The AI-tell catalog

Every prose field passes these before it is written or rewritten. **Applying a
mode does not excuse a tell** — a FORENSIC paragraph with two em-dashes is
still broken.

| Tell | Rule |
|---|---|
| 2+ em-dashes in one paragraph | Max 1 per paragraph |
| `"It is not X. It is Y."` | Max 1 per issue, and only if it *is* the structural argument |
| 3× short sentences closing a section | Max 1 triple-fragment close per issue |
| `"the mechanism"`, `"structural argument"`, `"rhetorical work"` as abstract-noun labels | Replace with the actual claim |
| `"First… Second… Third…"` | Remove the ordinals, interleave the ideas |

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
