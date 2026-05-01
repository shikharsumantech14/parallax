# NotebookLM — Parallax research-desk setup

The reference for the six NotebookLM notebooks that sit upstream of the
Parallax editorial pipeline. If you ever rebuild a notebook (account
migration, accidental deletion, fresh Google account), this doc is the
source of truth — paste-ready titles and summaries, source seed list,
the editorial-guidelines note used as a soft prompt, and the weekly
workflow.

> **Status as of 2026-04-28.** All six notebooks created on
> `shikharcasm@gmail.com`. Titles set. Summary blocks pasted. Sources
> not yet added (next manual step). Editorial-guidelines note not yet
> added (optional — see §4).

---

## 1. Reality check — what NotebookLM actually offers

NotebookLM (April 2026 UI) **does not have a "Custom Instructions" /
persistent system-prompt field**. An earlier version of this doc told
you to paste system prompts into a non-existent panel. That was wrong.
The customisation surface is narrower than ChatGPT's:

| Feature | Where | What it does |
|---|---|---|
| **Notebook title** | Customise dialog (Customise button on Chat panel) | Notebook name. |
| **Custom notebook summary** | Customise dialog → toggle on → paste text | Soft context for the model. NotebookLM consults it when answering. |
| **Cover image** | Customise dialog → Upload | Cosmetic. |
| **Creator notes** | Below summary on the notebook page | Note shown to viewers when notebook is **shared**. Passive — not a system prompt. |
| **Notes** | "Add note" button bottom-right; appears as a source | Notes ARE indexed as sources. **This is the closest thing to a system prompt** — see §4. |
| **Audio Overview customisation** | Studio → Audio Overview → Customise | Per-output focus prompt. Not persistent across chats. |
| **Output language** | Settings (gear icon) | App-level language. |

**Implication.** The Summaries you've pasted already do partial
voice-shaping. To get a sharper Parallax voice you can add a
**Note-as-prompt** (§4). Otherwise, lean on `/pipeline-discover` (the
agent pipeline) for strict editorial output — that uses a real Claude
system prompt and does the voice work properly.

---

## 2. Why NotebookLM at all

NotebookLM is the **per-category research desk**. It holds a curated set
of sources, answers grounded cited questions, and turns a clutch of
articles into Briefing Docs / Audio Overviews when you want a faster way
to absorb material than reading every tab.

```
┌──────────────────────┐
│  NotebookLM          │  ← per-category research desk (this doc)
│  (library + chat)    │     ingest sources, ask questions, surface options
└──────────┬───────────┘
           │  you pick a candidate worth writing
           ▼
┌──────────────────────┐
│  research/<topic>/   │  ← human-edited candidates file
│  <date>-candidates   │     status: chosen
└──────────┬───────────┘
           │  /pipeline-discover (Phase 1, built)
           │  /pipeline-research <slug>  (Phase 2, queued)
           ▼
┌──────────────────────┐
│  agent dossier       │  ← researcher subagent (real system prompt,
│  <slug>-dossier.md   │     strict Parallax voice)
└──────────┬───────────┘
           ▼
       drafter → verifier → human audit → publish
```

NotebookLM and `/pipeline-discover` both write candidates to the same
`research/<category>/<date>-candidates.md`. NotebookLM is for
brainstorming; `/pipeline-discover` is for strict, repeatable
candidate-generation with a real system prompt. Use whichever fits the
moment.

---

## 3. Account + tier

| Tier | Sources / notebook | Chats / day | Audio overviews / day | Cost |
|---|---|---|---|---|
| **Free** | 50 | 50 | 3 | ₹0 |
| **Plus / Google AI Pro** | 300+ | unlimited | unlimited | ~$20/mo bundled |

**Stay on free.** Per-category source seed counts vs the 50-source cap:

| Notebook | Sources at seed | Cap | Headroom for fresh articles |
|---|---|---|---|
| Politics | 13 | 50 | 37 |
| Space | 13 | 50 | 37 |
| Earth | 14 | 50 | 36 |
| Tech | 15 | 50 | 35 |
| Travel | 13 | 50 | 37 |
| Sports | 13 | 50 | 37 |

37 fresh weekly additions ≈ 9 months before any pruning is needed.

**Upgrade triggers** (none active yet):

- A notebook passes 45 sources (approaching cap)
- Daily chat ceiling hit (3 categories × 5 chats = 15 — won't happen)
- More than 3 Audio Overviews/day needed (only relevant if Audio
  Overviews become a marketing channel)
- Need long-context analysis of 200+ page PDFs (full IPCC AR reports)

**Account.** Notebooks live on `shikharcasm@gmail.com`. URL slot is
`/u/?authuser=2`. Note Chrome's stable account-index does not always
match Google's `/u/N/` URL — clicking the avatar account-switcher in
NotebookLM is more reliable than typing the URL.

---

## 4. The Note-as-prompt workaround (optional but recommended)

Since NotebookLM has no real custom-instructions field, the way to bias
the chat toward Parallax voice is to add a NOTE inside each notebook
containing the editorial guidelines. NotebookLM treats notes as sources
and consults them when answering — so the model sees your guidelines
the same way it sees an article.

**To add the note:**

1. Open the notebook
2. Click **+ Add note** (bottom-right of the Studio panel)
3. Title the note: `Editorial guidelines — read this first`
4. Paste the matching block from §6 below
5. Save

That's it. Once added, every chat answer in that notebook will see the
note as one of its sources. Combined with the Summary you've pasted,
this is the closest NotebookLM gets to a system prompt.

**Optional.** Skip the note and just rely on the Summary. The
candidates the chat surfaces will be looser in voice but still useful
as input — you'd then sharpen them by re-running through
`/pipeline-discover` against the same allowlist. Both paths work.

---

## 5. The six notebooks — title and summary

These are the summaries for each notebook's **Custom notebook summary**
field. They set identity, sources, and editorial voice. To paste: open
the notebook → click **Customise** → "Set custom notebook summary" toggle
ON → Ctrl+A in the text area → paste → **Done**.

> **Character-limit note (confirmed 2026-05-01).** NotebookLM's summary
> field caps at roughly 1,400–1,500 characters. Summaries with output-
> format + reject-list blocks (~1,900 chars) get truncated. The summaries
> below are trimmed to ~1,250 chars (4 paragraphs: identity, sources,
> use-case, editorial voice). The output-format and reject-list instructions
> live in the §6 Note-as-prompt blocks — paste those as Notes for full
> coverage. Both together do the same job as one long block that got cut.

### 5.1 Parallax · Politics

```
Research desk for Parallax · Politics — editorial-research backbone for Indian parliamentary politics, electoral mechanics, coalition dynamics, court rulings on electoral law, and the structural mechanics under the day's political headlines.

Sources: The Hindu (Politics), Indian Express (Political Pulse), The Wire, Caravan, Scroll, Economic & Political Weekly, The Print, plus primary data from PRS India (bill summaries, MP voting records), Sansad (debates, committee reports), the Election Commission of India (results, voter data), and MoSPI (census, NSS data). International context from The Economist (Asia) and Foreign Policy (South Asia).

Used by Parallax — an independent visual explainer publication — to surface candidate issues each editorial week. Outputs feed into research/politics/.

Editorial voice: structural, sourced, perspective-shifting. We're not a wire service, op-ed page, or listicle factory. Stories worth writing reveal something under the news: a 30-year-old procedural quirk that explains today's vote, a constituency boundary drawn in 1976 that decides an election in 2026, a coalition arithmetic that makes an "unexpected" outcome inevitable in retrospect. "X happened because the system was designed this way" beats "X happened today."
```

### 5.2 Parallax · Space

```
Research desk for Parallax · Space — editorial-research backbone for spaceflight, orbital mechanics, missions, debris, launches, and space policy.

Sources: SpaceNews, Ars Technica (Science), Space.com, Astronomy Magazine, Sky & Telescope, plus primary materials from NASA Newsroom, ESA News, ISRO, SpaceX Updates, Jonathan McDowell's Space Report (launch data, debris), LeoLabs (orbital tracking), Secure World Foundation (space policy), and Aviation Week (Space).

Used by Parallax — an independent visual explainer publication — to surface candidate issues every two weeks. Outputs feed into research/space/.

Editorial voice: structural, sourced, perspective-shifting. We're not a launch tracker, hype outlet, or doom newsletter. Stories worth writing reveal mechanism over event: orbital regimes that constrain what's possible, propellant budgets that decide mission shape, debris cross-sections that bound LEO operations for a generation, regulatory choices that ripple through commercial markets. "Cosmos 1408 left a debris cloud that intersects every LEO operator's manifest for 25 years" beats "ASAT tests are bad."
```

### 5.3 Parallax · Earth

```
Research desk for Parallax · Earth — editorial-research backbone for climate science, oceans, biodiversity, geology, atmosphere, and the human-systems interface.

Sources: Carbon Brief, Inside Climate News, Yale Climate Connections, Mongabay, Grist, The Guardian (Environment), plus primary materials from NASA Earth Observatory, NOAA, IPCC, WMO, Copernicus Climate Change Service, and India-specialist Centre for Science and Environment, IndiaSpend, and Down To Earth.

Used by Parallax — an independent visual explainer publication — to surface candidate issues each editorial week. Outputs feed into research/earth/.

Editorial voice: structural, sourced, perspective-shifting. We're not a climate-doom newsletter, an activism platform, or a tech-solutionism page. Stories worth writing reveal mechanism over event: feedback loops, threshold dynamics, the lag between atmospheric forcing and observed change, the gap between scientific consensus and policy response. "The Atlantic Meridional Overturning Circulation is showing the same slowdown signature it showed before the Younger Dryas" beats "climate change is bad."
```

### 5.4 Parallax · Tech

```
Research desk for Parallax · Tech — editorial-research backbone for AI/ML, infrastructure, platforms, protocols, and the shipping products that change how the rest of the internet works.

Sources: Ars Technica, The Verge, TechCrunch, The Information, Stratechery, Platformer, plus primary materials from Anthropic, OpenAI, DeepMind, Hugging Face, Simon Willison's blog, and engineering blogs from Stripe, Vercel, Linear, and High Scalability.

Used by Parallax — an independent visual explainer publication — to surface candidate issues every two weeks. Outputs feed into research/tech/.

Editorial voice: structural, sourced, perspective-shifting. We're not a hype outlet, launch tracker, or AI-doom newsletter. Stories worth writing reveal mechanism over event: cost curves that explain capability ceilings, protocol decisions that ripple through ecosystems, post-incident reports that expose architectural debt, the 18-month lag between research papers and shipping products. "The reason context windows kept doubling for two years and then stopped is the KV-cache cost curve" beats "AI is changing everything."
```

### 5.5 Parallax · Travel

```
Research desk for Parallax · Travel — editorial-research backbone for places, crossings, infrastructure, and rituals, with bias toward sourced narrative reporting.

Sources: Condé Nast Traveler, Atlas Obscura, AFAR, Roads & Kingdoms, NYT Travel, plus India-specialist Outlook Traveller, Live History India, Mint Lounge (Travel), with Skift and The Points Guy for industry data, and National Geographic and Lonely Planet for geographic and cultural depth.

Used by Parallax — an independent visual explainer publication — to surface candidate issues each editorial month (travel pieces don't expire as fast as politics or tech). Outputs feed into research/travel/.

Editorial voice: structural, sourced, perspective-shifting. We're not a listicle factory, an aspirational-luxury magazine, or a sponsored-trip outlet. Stories worth writing reveal mechanism over destination: the seasonal economics that shape a valley, the infrastructure choice that rerouted pilgrim traffic, the ritual that survived because of how a road was built, the disappearing trade that explains a town. "The seasonal closing of the Rohtang Pass shapes 14 distinct local economies in three valleys" beats "10 things to do in Manali."
```

### 5.6 Parallax · Sports

```
Research desk for Parallax · Sports — editorial-research backbone for football tactics, sports finance, governance, and cricket.

Sources: The Athletic, Tifo Football, Coaches' Voice, Statsbomb, The Guardian (Football), with economics from Swiss Ramble, Forbes SportsMoney, and Off The Pitch; cricket via ESPN Cricinfo, The Cricket Monthly, and The Cricketer; India-specialist coverage from Sportstar and Scroll Field.

Used by Parallax — an independent visual explainer publication — to surface candidate issues every two weeks to a month. Outputs feed into research/sports/.

Editorial voice: structural, sourced, perspective-shifting. We're not a match-report factory, transfer-rumour aggregator, or fan-tribal commentary site. Stories worth writing reveal mechanism over result: the build-up structure that makes a tactic work, the financial filing that exposes an ownership pattern, the broadcast-rights renegotiation that shifts a league's incentives, the IPL auction-rule tweak that redistributes value across the entire fee market. "City's build-up depends on a 6-second window the inverted full-back opens after the goalkeeper's first pass" beats "City played well."
```

---

## 6. Editorial-guidelines notes (paste-ready, optional per §4)

Short notes — paste each into the matching notebook as a **Note**, not
a custom-instructions field (which doesn't exist).

### 6.1 Politics

```
Editorial guidelines for Parallax · Politics

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice (structural, not breaking news)
- why-now: anchored to a concrete recent event, vote, ruling, or data release
- angle: the structural revelation under the headline
- 3+ source citations from this notebook

Reject pure breaking news, op-eds, listicles, and self-promotional press.
Always cite. Never invent dates, names, numbers, or quotes. If a claim
isn't in the sources, say so.

Prefer primary sources (PRS, Sansad, ECI, MoSPI, court orders) over
commentary. Lean structural: "X happened because the procedure was
designed this way in 1976" beats "X happened today."
```

### 6.2 Space

```
Editorial guidelines for Parallax · Space

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice (mechanism over event)
- why-now: anchored to a concrete recent launch, mission, ruling, or data release
- angle: the structural revelation
- 3+ source citations from this notebook

Reject pure launch hype, Musk-vs-Bezos commentary, doom takes. Cite
always. Never invent mission designators, debris counts, or quotes.

Prefer primary sources (NASA, ESA, ISRO press, McDowell launch DB,
LeoLabs telemetry, FCC filings) over wire copy. Flag uncertainty in
numbers explicitly.
```

### 6.3 Earth

```
Editorial guidelines for Parallax · Earth

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice
- why-now: anchored to a recent paper, data release, threshold crossing, or ruling
- angle: the structural revelation
- 3+ source citations from this notebook

Reject pure activism, tech-solutionism, and outrage framing. Cite always.
Use the source's own confidence language (IPCC "high confidence", "very
likely"). Never invent numbers or paper titles.

Prefer primary sources (IPCC, NOAA, Copernicus C3S, NASA Earth
Observatory, peer-reviewed papers) over secondary news. Lean Indian /
South Asian where the data supports it.
```

### 6.4 Tech

```
Editorial guidelines for Parallax · Tech

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice
- why-now: anchored to a recent release, RFC, incident, or policy change
- angle: the structural revelation
- 3+ source citations from this notebook

Reject vendor PR, AI-doom takes, "X tool changed my life," and breathless
launch coverage. Cite always. Distinguish vendor-claimed benchmarks from
measured ones.

Prefer primary sources (model cards, GitHub diffs, RFCs, official
changelogs, Anthropic/OpenAI/DeepMind blog posts, post-mortems by the
operators) over secondary commentary.
```

### 6.5 Travel

```
Editorial guidelines for Parallax · Travel

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice (places, crossings, rituals, infra)
- why-now: seasonal, anniversary-driven, or infrastructure-event-driven
  (travel pieces don't expire as fast as politics)
- angle: the structural revelation
- 3+ source citations from this notebook

Reject top-10 lists, sponsored-trip writeups, aspirational-luxury puff.
Cite always. Flag press-release rewrites.

Prefer narrative longform (Roads & Kingdoms, AFAR, Atlas Obscura),
historical primary sources (Live History India), and industry data
(Skift). Lean Indian-subcontinent where sources support it.
```

### 6.6 Sports

```
Editorial guidelines for Parallax · Sports

When asked for "candidate Parallax issues," return 3-5 hooks. Each:
- one-line headline in Parallax voice (tactics, finance, governance)
- why-now: anchored to a recent match, transfer window, financial
  filing, or governance ruling
- angle: the structural revelation
- 3+ source citations from this notebook

Reject match-report rewrites, transfer-rumour churn, fan-tribal commentary.
Cite always. Distinguish data-backed claims (xG, transfer-fee disclosures)
from punditry.

Prefer tactical analysis (The Athletic, Tifo, Coaches' Voice, Statsbomb),
economic disclosure (Swiss Ramble, Off The Pitch, club annual reports),
and longform (Cricket Monthly, Sportstar) over wire copy.
```

---

## 7. Seeding sources

Each notebook starts with the URLs in `research/_sources/<category>.md`
— the same allowlist `/pipeline-discover` mines from. Same source
universe for both layers.

For each notebook:

1. Open the notebook
2. Click **+ Add sources** (top of Sources panel)
3. Pick **Website**, paste a URL from the allowlist, click Insert
4. Repeat for every URL in the allowlist

NotebookLM fetches and indexes the page at upload time — it does **not**
auto-update. Fresh articles get added weekly (§9).

**Pro tip — primary documents.** For high-leverage primary sources you
expect to cite often (ESA Space Environment Report PDFs, IPCC chapter
PDFs, the Constitution Amendment text, RBI annual reports), upload the
PDF directly. PDFs index richer than landing pages and survive URL
churn.

---

## 8. Test query — verify each notebook

After adding sources (and optionally the editorial-guidelines note),
paste this into the chat:

> Surface 3-5 candidate Parallax issues from the sources in this
> notebook for the coming week. For each: one-line hook in Parallax
> voice, why-now anchored to a concrete recent event, angle, and 3+
> source citations from this notebook.

A working notebook returns:

- 3-5 candidates anchored to real, dated, citable events
- 3+ citations per candidate, all from the notebook's sources
- Hooks that read like Parallax (structural, not breaking)

A misconfigured notebook returns:

- Generic "the climate is changing" non-news
- Candidates with no citations or invented citations
- Padded list to reach 5 even when sources don't support it

If misconfigured: re-check that the editorial-guidelines note (§4) is
saved as a note, and that the Summary toggle is ON in the Customise
dialog. Or fall back to `/pipeline-discover` for that category.

---

## 9. Weekly workflow

Per category, ~15 min/week:

| Step | Time | Action |
|---|---|---|
| 1 | 5 min | Add 2-5 fresh articles from allowlisted sources to the notebook. |
| 2 | 5 min | Run the candidates query (§8). Read the answer. |
| 3 | 3 min *(optional)* | For the most promising candidate, generate a Studio → **Briefing Doc** (1-page synthesis). |
| 4 | 3 min *(optional)* | Generate an **Audio Overview** for the candidate you're most interested in. Listen on a walk. |
| 5 | 2 min | Pick a candidate. Paste hook + sources into `research/<category>/<YYYY-MM-DD>-candidates.md`. Mark `status: chosen`. |

Cadence target (from `research/README.md`):

| Category | Cadence |
|---|---|
| Politics, Earth | weekly |
| Space, Tech, Sports | bi-weekly |
| Travel | monthly |

Total NotebookLM time: ~90 min/week across all six.

---

## 10. NotebookLM vs `/pipeline-discover`

Two paths to the same candidates file:

| | NotebookLM | `/pipeline-discover` |
|---|---|---|
| Voice control | Soft (Summary + optional Note) | Strict (real Claude system prompt) |
| Cost | Free | ~₹15-40/run |
| Best for | Brainstorming, audio absorption, "what's worth writing about" | Repeatable strict candidate generation |
| Output | Hooks + citations in chat | Structured `candidates.md` file |

Use NotebookLM when you want to think. Use `/pipeline-discover` when
you want options without thinking. Both are valid; both feed the same
file.

---

## 11. When to update this doc

- Notebook title / summary changed → update §5.x
- Editorial-guidelines note updated → update §6.x
- NotebookLM ships a real custom-instructions feature → rewrite §1 and
  point §4 at it
- New source added to the allowlist that should also go in the notebook
  → mention in change log
- Tier limits change → update §3
