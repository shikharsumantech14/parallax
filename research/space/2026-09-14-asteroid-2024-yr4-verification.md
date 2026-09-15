# Verification Report: The odds *moved*. The asteroid did not.

- **Draft:** src/content/issues/2026-06-04-asteroid-2024-yr4/index.mdx (Phase 6 rewrite, in place)
- **Dossier:** research/space/2026-06-04-asteroid-2024-yr4-dossier.md
- **Storyboard:** research/space/2026-09-14-asteroid-2024-yr4-storyboard.md (Status: approved, rulings settled §8c)
- **Prior verification:** research/space/2026-06-04-asteroid-2024-yr4-verification.md (APPROVED, zero required fixes)
- **Panels:** research/space/2026-09-14-asteroid-2024-yr4-panel.md (REVISE) · -panel-2.md (**PASS**)
- **Verified:** 2026-09-15
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION — zero ❌, four ⚠️ in the claim table and three register
notes. One of the seven is worth holding the file for, and it is a punctuation
mark, not a fact.** The trace holds. Fifty-five of fifty-nine claims verify
against the dossier or against an arithmetic derivation the storyboard
sanctions in §5; no number moved; both verbatim quotes survive
character-for-character; all eight `sources[]` are intact, all eight are still
referenced, and every `sourceRefs[]` id resolves. The one genuinely new
sentence in the issue — "two years before any ground telescope could have" —
is dossier §2 in substance and sits on a section whose `sourceRefs` already
carry src-01, src-02 and src-07, so it needed nothing added to be legal. The
two cut sections took only untraceable or illustrative values with them; the
one published figure inside `trajectory-arc` (21,200 km) survives on
`data-readout` tile 5, and the lakh derivation on tile 4 is computed from two
numbers that are both still on the page. The [UNVERIFIED] pair stayed out. The
register work is clean and measurable: zero em-dashes, zero semicolons, zero
words from the AI list, no sentence-opening adverb of importance, six names
against a twelve ceiling, four rhetorical jobs with CONVERSATIONAL carrying
three of six, one Hindi word that passes the skip test in a prose field with no
number in it, the single reversal spent in the head and nowhere in the body,
and the kinds, order and hero exactly as the storyboard composed them. What
holds it back: §04's `note` wears quotation marks around a NASA sentence it has
silently truncated and recapitalised, with no speaker anywhere on the page —
both reader panels found it independently, and it is the one field in the issue
where a reader is told somebody spoke and is not told who. The other six items
are notes, waivers and one provenance gap. None needs new research; none needs
a writing agent.

---

## Claim verification

Fifty-nine claims. **55 ✅ · 4 ⚠️ · 0 ❌.**

| Claim | Location | Status | Note |
|---|---|---|---|
| The odds moved, the asteroid did not | frontmatter · `title` | ✅ | The thesis. Dossier §1, and §5's Wasser quote states it in NASA's own words. |
| "once read 1 in 32" | frontmatter · `hook` | ⚠️ | Derivation of §4's 3.1% (1 ÷ 0.031 = 32.26), sanctioned by storyboard §5 item 1 and already the published `story.beats[1]` framing. But every other instance in the issue hedges it — §04 `equals[0]` and story beat 0 both say "about". The hook states it flat. IMPRECISE, not untraced. |
| "Six days later, 1 in 25,000" | frontmatter · `hook` | ✅ | 1 ÷ 0.00004 = 25,000 exactly. 18 Feb → 24 Feb 2025 is six days (§3). |
| "The rock you were watching never moved" | frontmatter · `hook` | ✅ | §5 Wasser: "rather than a shift in its orbital path". |
| "The number rose before it fell" | frontmatter · `dek` | ✅ | §1 ("the number went *up* before it went down") and the sourced lunar arc 1.7 → 3.8 → 4.3 in §4. No pre-peak *Earth* figure exists in the record; the dek and primer both say "the number" / "odds of a hit", never "odds of hitting Earth", which keeps them inside the record. Panel-2 tested this on all four readers and withdrew its first-read flag. |
| December 2024, a telescope in Chile found this rock | frontmatter · `primer` | ✅ | §3/§4: first reported 27 Dec 2024 by the NASA-funded ATLAS station in Chile. |
| "For fifteen months its odds … rose, then fell to zero" | frontmatter · `primer` | ✅ | §2: "~15-month risk-resolution arc". Carried in the published form, not recomputed. |
| Odds fell 3.1% → 0.004% between 18 and 24 February 2025 | §01 `you-think` · `caption` | ✅ | §4, both figures, both dates. A DATA caption, correctly. |
| `actually.value` "3.1% → 0.004%", `unit` "in six days" | §01 · `data.actually` | ✅ | §4. |
| "The asteroid flew the same orbit through both readings" | §01 · `actually.text` | ✅ | §5 Wasser. |
| "The risk then moved to the Moon and rose there, before going to zero as well." | §01 · `data.note` | ✅ | §4 lunar arc, §3 5 Mar 2026 all-clear. |
| src-03 + src-04 back the two figures | §01 · `sourceRefs` | ✅ | 3.1% is src-03 (19 Feb post); 0.004% is src-04 (24 Feb post). Correctly split. |
| Annotation: "Peak odds. The orbit was at its least known." | §02 `timeline` · `annotations[0]` | ✅ | Editorial synthesis, not a quoted line — the same one the June report logged as optional note 3 and called defensible. Supported by §5 Wasser plus §4's faintness mechanism; storyboard §8b deliberately keeps it in plainer words. `at: "Feb 18 2025"` matches an event `date` exactly, so it renders. |
| Annotation: "The risk moves to the Moon. The rock does not." | §02 · `annotations[1]` | ✅ | §4 lunar arc. `at: "Jun 3 2025"` matches. |
| 27 Dec 2024 · "Found by ATLAS, in Chile." | §02 · event 1 | ✅ | §3/§4. NASA's own geography ("in Chile"); ESA's station name Río Hurtado correctly dropped per storyboard §7. |
| "The first report of this rock, from a survey telescope NASA funds." | §02 · event 1 note | ✅ | §3 ("first reported to the Minor Planet Center"), §4 ("NASA-funded"). The MPC is described, not named — storyboard §7. |
| 18 Feb 2025 · "Earth-impact odds peak at 3.1%." | §02 · event 2 | ✅ | §4, verbatim figure and date. |
| 24 Feb 2025 · "Earth ruled out. Odds 0.004%." | §02 · event 3 | ✅ | §3/§4. |
| "The odds are split across whatever is still inside the range of possible positions." | §02 · event 3 note | ✅ | §1's mechanism (the error ellipse; the Moon inside the cone). A synthesis of the primary sources rather than a quoted sentence, consistent across every section that states it. |
| "The Moon is still inside, at 1.7%." | §02 · event 3 note | ✅ | §3/§4: 1.7% residual lunar chance on 24 Feb 2025. |
| 3 Jun 2025 · "Lunar odds climb to 4.3%." | §02 · event 4 | ✅ | §3/§4. The researcher's date trap is handled: the event is dated 3 Jun, the NASA post is 5 Jun, and no citation inside the note conflates them. |
| "The range keeps shrinking with the Moon inside it, so the Moon's share of that smaller space rises." | §02 · event 4 note | ✅ | §1. This is the sentence that buys quiz question 2 (panel-2). |
| "Then the rock fades from view." | §02 · event 4 note | ✅ | §3, spring 2025: too faint for Earth- and space-based observatories until the Feb 2026 JWST window. |
| 18 & 26 Feb 2026 · "Webb makes two faint detections." | §02 · event 5 | ✅ | §4 decisive observation dates, VERIFIED there. |
| "about as much light as an almond at the distance of the Moon" | §02 · event 5 note | ✅ | **Verbatim** against §5 / src-07, quoted as a fragment inside an accurate frame ("said it reflects …"; the source reads "reflecting about as much light as …"). Speakers described, not named — storyboard ruling §8c.4. src-07 is on this section's `sourceRefs` and the Webb blog is on its `source` label. |
| "The astronomers who led them" | §02 · event 5 note | ✅ | Honest without the names: §5 attributes the line to Rivkin and de Wit, "JWST observation co-principal investigators" — i.e. the people who led these observations. No role is claimed that the record does not give. |
| 5 Mar 2026 · "Lunar impact ruled out. Zero." | §02 · event 6 | ✅ | §2/§3. |
| **"two years before any ground telescope could have"** | §02 · event 6 note | ✅ | **The one new sentence in the issue, and it traces.** Dossier §2: the two Webb observations "pinned the orbit down two years before any ground-based telescope could have (the asteroid is otherwise unobservable until its 2028 return)", sourced there to src-01 and src-02; §3's 6 Mar row sources the same point to src-07. All three sit on this section's `sourceRefs`. See ruling 1 below. |
| "It passes more than 20,000 km clear." | §02 · event 6 note | ✅ | §4, ESA's figure. |
| Caption: six dated updates, December 2024 discovery to March 2026 all-clear | §02 · `caption` | ✅ | Counts the marks correctly — six events render. A DATA caption. `Timeline.astro` takes no caption prop, but `core/Section.astro` prints it below the graphic and the component emits no `*__cap`, so it reaches the page. |
| `plain`: "Each entry is one dated update … the last is where it stands now." | §02 · `plain` | ✅ | FORM only. No finding. 125 chars, inside the 220 cap. |
| "The error box: the stretch of space the asteroid could be in on the day." | §03 `jargon-buster` · term 1 | ✅ | §1's error ellipse, and the same gloss `research/_voice/jargon.md` carries for "uncertainty ellipse" ("the stretch of sky where the asteroid might be; it shrinks as we watch more"). |
| "Impact probability … tracks the size of that box" | §03 · term 2 | ✅ | §1, and jargon.md's own gloss ("the odds the rock hits us, as a percentage"). |
| "Crossing one percent starts the international planetary-defence notification process." | §03 · term 3 | ✅ | §4 defence-trigger context, src-04, which the issue already carried. New to the issue, old to the record — storyboard ruling §8c.3, TAKEN. |
| 3.1%, "Peak Earth-impact odds, 18 February 2025" | §04 `number-sense` · `value` / `label` | ✅ | §4. |
| "About one chance in thirty-two." · "3.1 out of every 100." | §04 · `equals[0]` | ✅ | Derivation, storyboard §5 item 1. |
| "thirty-one chances in thirty-two that nothing happens" | §04 · `equals[1]` | ✅ | The complement, storyboard §5 item 3. 31/32 = 96.875% against 96.9%; the rounding is consistent with `equals[0]`. |
| "about one chance in 25,000", from the 0.004% reading | §04 · `equals[2]` | ✅ | Exact (1 ÷ 0.00004). The note names the source reading and its month. |
| "'The highest impact probability NASA has ever recorded for an object of this size or larger.'" | §04 · `data.note` | ⚠️ | **PARAPHRASE (fragment).** Traces to §5 / src-03, which is on this section's `sourceRefs` — but the marks enclose a sentence the draft has truncated ("This is the highest…" → "The highest…") and recapitalised, with no ellipsis and no speaker anywhere on the page. Quote marks announce that somebody said this and then decline to say who. Both panels flagged it. Cheap fix, see Required fixes. |
| Caption: "The peak Earth reading of 3.1% is about one chance in thirty-two." | §04 · `caption` | ✅ | DATA claim. |
| Tile 1 · 3.1%, "Set on 18 February 2025, when the orbit was known least well." | §05 `data-readout` | ✅ | §4 plus the same synthesis clause as the timeline annotation. |
| Tile 2 · 0.004%, "Earth is out, for 2032 and beyond." | §05 | ✅ | §4 and src-04's own title ("in 2032 and Beyond"). |
| Tile 3 · 4.3%, "3 June 2025 … Europe's space agency later called it around 4%." | §05 | ✅ | §4. The published split is kept exactly as storyboard §8b settles it: precise figure in the tile, ESA's rounding in the note. |
| Tile 4 · "53–67" m | §05 | ✅ | §4. En-dash preserved, copied not retyped. |
| "The miss distance is three to four lakh times this width." | §05 · tile 4 note | ✅ | 21,200 km ÷ 67 m = 3.16 lakh; ÷ 53 m = 4.00 lakh. Storyboard §5 item 4, including its reason for a range rather than a tidy 3.5 lakh. Both input numbers are on this same section. |
| Tile 5 · ">20,000" km, "The other published figure puts it 21,200 km above the lunar surface." | §05 | ✅ | §4: ESA ">20,000 km" and NASA "13,200 miles (21,200 km) above the lunar surface". NASA's "above the lunar surface" qualifier is preserved — the compression did not drop it. The mi figure is gone, which loses a unit, not a fact. |
| Tile 6 · "Dec 22" / " 2032" | §05 | ✅ | §4 close-approach date. |
| Caption: "Asteroid 2024 YR4 · key figures, Dec 2024 to Mar 2026" | §05 · `data.caption` | ⚠️ | **CAPTION-FORM.** A label for the figure, not a finding — nothing here a reader could not see by looking. Carried verbatim under storyboard §8a, so this is a note, not a fix. |
| "Those odds describe how well we knew the orbit … The size is the one figure here that belongs to the rock itself." | §05 · `intro` | ✅ | §1 plus §4. Sorts the six tiles into three kinds, which is what pays the title's two-way claim (panel-2 point 9). |
| Quote: "This update reflects improved precision in our understanding of where the asteroid is expected to be in 2032 rather than a shift in its orbital path." | §06 `quote` · `data.quote` | ✅ | **Character-for-character** against dossier §5 and against src-01's own `quote` field. No word added, dropped or reordered. |
| Attribution: "Molly Wasser, NASA Science" | §06 | ✅ | §5, author of the 5 March 2026 post. |
| `source` label + date "5 March 2026" | §06 | ✅ | §5/§6, src-01. |
| "the range of possible positions kept shrinking, so the Moon ended up outside it" | §06 · `followup` | ✅ | §1, in the same words the timeline uses. Glosses the hard half of the quote in the next breath. |
| "On 22 December 2032 it arrives, and it misses." | §06 · `followup` | ✅ | §4 close-approach date; §2/§4 miss distance. |
| Beat 0 → `sections[0]` `you-think` · "about 1 in 32 … 1 in 25,000 … six days" | `story.beats` | ✅ | Index resolves to the kind the beat describes; every figure is the section's own. |
| Beat 1 → `sections[1]` `timeline` · discovery, peak, six days, the Moon, 5 March 2026 | `story.beats` | ✅ | All six dates are the section's own. |
| Beat 4 → `sections[4]` `data-readout` · 3.1%, 4.3%, 53 to 67 m, >20,000 km | `story.beats` | ✅ | Every figure matches its tile. Ascending order 0, 1, 4, 5 preserved; no stale index, so no beat is silently dropped. |
| Beat 5 → `sections[5]` `quote` · "The change reflected improved precision about where the asteroid would be in 2032, rather than a shift in its orbital path." | `story.beats` | ⚠️ | Accurate and unmarked as a quotation, which is honest. But the kicker reads "NASA's own words" over a past-tense paraphrase, and the beat text is near-verbatim without marks. Either quote it or re-kicker it. Low severity. |
| ESA's "The Moon is safe … but the work continues" ([UNVERIFIED] speaker) | — | ✅ | **Not present.** No invented speaker. |
| A flat "faintest-ever" superlative ([UNVERIFIED]) | — | ✅ | **Not present.** The draft claims no superlative at all — not even NASA's hedged "among the faintest", which is conservative rather than wrong. |
| Palermo-scale value (−0.18) | — | ✅ | **Absent**, as the dossier requires. |

---

## Rulings on the five named checks

**1 · The restored clause is traced.** "Two nights of Webb put the Moon outside
that range too, two years before any ground telescope could have. It passes
more than 20,000 km clear." Dossier §2 states the two-years claim directly and
gives its reason in the same sentence (the asteroid is otherwise unobservable
until 2028), sourced there to src-01 and src-02; §3's 6 Mar 2026 row states the
same via src-07. All three ids sit on this section's `sourceRefs[]`, and the
section's `source` label names both NASA blogs and ESA. This is the only new
claim in the issue and it required no new source. It also closes the single
storyboard-to-draft shortfall panel-1 found (its gap 2). **✅ VERIFIED.**

**2 · The two cuts left nothing hanging.** `signal-readout`'s four bars
(22/54/94/88) were an editorial precision scale by the dossier's own admission
(§9, "signal-readout values are editorial") — cutting them removes values that
could never have passed a trace, which is why the published caption had to
label itself "SCHEMATIC". `trajectory-arc` carried eight numbers of which one
was published; that one, the 21,200 km, is alive on tile 5, and tile 4's lakh
comparison is computed from it and from the size range on the same section — so
no surviving figure depends on a cut section. The Gaia band and the 2028 window
left with them (see 4, and the note below). **No orphaned `sourceRefs`:** every
id in every `sourceRefs[]` resolves to a `sources[]` entry, and in the other
direction all eight sources are still referenced — src-05 by the size tile,
src-06 by the 4.3% tile, src-07 by the almond and the Feb 2026 event, src-08 by
the discovery and the close-approach date. One quiet bonus of the cuts: with no
schematic figure left, the story-mode caption-hiding trap (`story.css` hides
`[class$='__cap']` inside a beat) can no longer strip an honesty caveat off a
beat, because there is no caveat left to strip.

**3 · Every NUMBER-DRIFT removal is a mandated cut, and the size preference is
correct.**

| Removed | Ruling |
|---|---|
| 1.5% (19 Feb 2025) | Mandated, storyboard §8a — the story needs the peak and the floor, not the step between. No surviving sentence implies an intermediate reading. |
| 3.8% (2 Apr 2025) | Mandated, §8a, folded into the Jun 3 event. "Lunar odds climb to 4.3%" is supported by the two rungs that remain (1.7% at Feb 24, 4.3% at Jun 3), both on the page. |
| Bars 22 / 54 / 94 / 88 | Operator ruling §8c.1. Editorial values; their removal is the point. |
| `altKm` / `downrangeKm` / `apoapsisKm` | Operator ruling §8c.2. Seven of eight were invented; the eighth survives. |
| **50-to-70 m** | **Correct preference, not a dropped figure.** The 50–70 m range appears **nowhere in the dossier** — it was the pre-JWST estimate the published primer carried. What the record actually contains is 53–67 m (174–220 ft), sourced to src-05 and src-08, with ~60 m ±7 as its central value. The rewrite kept the traceable figure and dropped the untraceable one. If anything this is a trace *improvement*. |
| 2028 | Left with `trajectory-arc`'s outbound note. Nothing that survives needs it: the "two years" clause is stated directly in §2 and does not have to be inferred from the 2028 return. The reader now gets the consequence without the reason — worth a line only if the operator wants it, and the honest home is a note the panel already calls the densest block on the page. Optional, below. |
| 26 Mar 2025 | Left with the cut Apr 2 event. The size tile does not need the observation date; the section `source` line names the blogs that carry it. |

**4 · Gaia is not load-bearing. No restoration required.** The draft, after the
cut, asserts four things about February 2026: Webb made two faint detections on
18 and 26 February; two nights of Webb put the Moon outside the range; that
happened two years before any ground telescope could have; and the object is as
faint as an almond at the distance of the Moon. **Not one of them rests on the
reference frame.** Gaia's role in the record (dossier §4, from ESA) is
*method* — the star positions Webb's astrometry is measured against — and the
draft makes no astrometric claim for it to support. The load-bearing "why only
Webb" is sensitivity, not the catalogue, and the dossier says so in the same
breath ("the asteroid is otherwise unobservable until its 2028 return"). The
all-clear itself is a published NASA/ESA conclusion (src-01, src-02), not an
inference the issue is building from a mechanism. Panel-2 reached the same
place from the reader's side: Karthik was the only one who asked, no quiz
question depends on it, and in its last form the clause gave Gaia "a name and a
product but no reason" — a name used once with no role, which is exactly what
contract rule 9 and tell 11 say to cut. So the removal improved the register
and cost no support. *If* the operator disagrees, the only honest home is the
Feb 2026 event note with a reason attached ("you measure an asteroid's position
against stars whose positions are already fixed"), and that is the 34-word node
two of four panel readers already abandon — I would not spend the words there.
The one thing to record: storyboard §7 still lists Gaia among its seven names,
so the departure exists only in panel-2's direction 2 and in this report. See
Required fixes 2.

**5 · Every surviving figure is copied, not retyped.** Checked character by
character against the dossier and, where the storyboard quotes the published
form, against that: **3.1%** ✅ · **0.004%** ✅ · **1.7%** ✅ · **4.3%** ✅ ·
**53–67** ✅ (en-dash intact, `unit: " m"` with its leading space) ·
**>20,000** ✅ (the ">" intact, `unit: " km"`) · **21,200 km above the lunar
surface** ✅ (qualifier intact) · **"1 in 32"** ✅ as a derivation (1 ÷ 0.031 =
32.26; hedged everywhere but the hook, see the ⚠️) · **"1 in 25,000"** ✅ exact
(1 ÷ 0.00004) · **the 1% threshold** ✅ (§4 says ">1%", the draft says
"crossing one percent" — equivalent) · **three to four lakh** ✅ (3.16–4.00).
Dates: 27 Dec 2024 ✅ · 18 Feb 2025 ✅ · 24 Feb 2025 ✅ · 3 Jun 2025 ✅ ·
18 & 26 Feb 2026 ✅ · 5 Mar 2026 ✅ · 22 Dec 2032 ✅. The 3 Jun / 5 Jun trap the
researcher flagged is handled correctly and no citation sits inside a note to
reintroduce it.

---

## Render check — does each authored field reach the page?

A traced field that no component prints is a claim the reader never sees.

| Field | Route | Renders? |
|---|---|---|
| §01 `caption` | `SectionBody` → `YouThink` → `VizCard` caption row | ✅ |
| §02 `caption` | `Timeline` takes no caption prop, but `core/Section.astro` prints it and `Timeline` emits no `*__cap`, so the `:has()` suppression does not fire | ✅ |
| §02 `annotations[]` | `Timeline` resolves `at` against each event's `date` string; both match exactly ("Feb 18 2025", "Jun 3 2025"). A non-matching `at` is a silent no-op | ✅ |
| §02 `plain` | `core/Section.astro`, below the graphic, with `Source · …` inline | ✅ |
| §04 `caption` | `NumberSense` → `VizCard` | ✅ |
| §05 `data.caption` | `DataReadout` `.tel__cap` | ✅ |
| §05 `emphasis` on tiles | `data-emphasis` on `.tel__tile` | ✅ (but see the register table) |
| §06 `followup` | `SectionBody` prints `.px-followup` after the quote | ✅ |
| `sourceRefs[]` | metadata only — nothing renders them; the `source` line is what the reader sees | n/a |

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|

Empty. Zero advocacy, zero wire tone, zero invented consequence, zero
meta-commentary, zero rhetorical questions (zero questions of any kind). Zero
em-dashes and zero semicolons in the whole file; the two colons both precede a
gloss, which the contract allows. No word from the AI list, no sentence-opening
adverb of importance, no numbered-manifesto rhythm, no triple-fragment close,
no mirrored close, no stacked citation inside a sentence. **The single reversal
is spent in the head** — the title's "The odds moved. The asteroid did not."
and the hook's "never moved" work as one composed unit, exactly as storyboard
§4 assigns them — and no "It is not X. It is Y." or "not because X but because
Y" appears anywhere in the body. The dek is a sequence, not an antithesis, so
tell 8 does not fire beside the reversing hook. Four jobs (INVESTIGATION,
CONVERSATIONAL ×3, AWE, CALM-STRUCTURAL) inside the 3–5 band, CONVERSATIONAL at
exactly half the sections, zero SATIRICAL, no lyrical paragraph spent.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| HINDI-LOAD-BEARING | §06 `followup` | **clean** | *aasmaan* passes the skip test: delete it and "The rock is still up there, on the same path it has always flown" says everything. Lexicon spelling ✅ (`hinglish-lexicon.md` line 68, space desk, awe noun). Roman, not italic. One word in the issue, in a prose field, in a sentence with no number. |
| HINDI-FIELD | — | **clean** | No Hindi in any `caption`, `plain`, `source` or data label. "Lakh" on tile 4 is Indian English under rule 4, not an L2 word. |
| JARGON-UNGLOSSED | — | **clean** | "Impact probability" is glossed in §03 before its only use as a term of art in §04, and the gloss matches `jargon.md`'s own. "The error box" is the jargon-list gloss for "uncertainty ellipse" in plain words. No unglossed term of art anywhere. |
| BARE-NUMBER | — | **clean** | 3.1% → one in thirty-two; 0.004% → one in 25,000; 53–67 m and >20,000 km → three to four lakh. No currency in the issue at all, so rule 4 has nothing to convert (storyboard §5). |
| NO-INDIAN-ANCHOR | whole issue | **noted** | One anchor: "lakh", on tile 4. Thin, and ruled so — storyboard §5 establishes that not one of the eight sources carries an Indian fact and that adding one is a research job, not a composition one. Not a flag against this draft. |
| NAME-THROUGHPUT | whole issue | **clean** | Six distinct names (2024 YR4, NASA, ESA/"Europe's space agency", Webb, ATLAS, Molly Wasser) against a ceiling of twelve, down from 34 NASA mentions plus eight other bodies in the published version. |
| NAME-UNPLACED | §02 event 1 · §06 attribution | ⚠️ **waived** | ATLAS appears once, with a role ("a survey telescope NASA funds"); Molly Wasser appears once, in an attribution, which is not a sentence. Both placements are storyboard §7 by name. **Flagged only so a later pass does not "fix" them.** |
| ANALOGY-CLAIM | §03, §05 | **clean** | The error box and the lakh comparison both describe the mechanism the dossier describes. Nothing implies the asteroid moved or that an action was taken. |
| HOOK-ABSTRACT / TITLE-FORMULA | head | **clean** | The hook carries two numbers, a "you" and the twist in its last five words. The title states the finding and is not "The ‹Noun› That ‹Verb›s" — it retires exactly that construction ("The Asteroid We Talked Down"), which also asserted the opposite of the argument. |
| TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC | sections | **clean** | 4 of 6 visual (66.7%, floor 60%); spine runs V V T V V T, so no two text-only rows adjacent; the first section is `you-think`, a VizCard kind, which the operator ruled satisfies the floor. Zero `prose` sections, zero loud sections, one `wide`. |
| HEAD-HEAVY | head + §01 | ⚠️ **watch** | My hand count is 79 words before the first graphic (title 7 · dek 11 · hook 24 · primer 28 · eyebrow 3 · title 6 · no intro) against the ceiling of 80, and my hook count is one over the storyboard's 23 because "1 in 25,000" is three tokens. `check:prose` is the authority, not this report — but at 79–80 the head has no slack. Do not add a word to the head without taking one out of §01's title, and do not give §01 an `intro`. |
| Reader-facing words | whole issue | **clean** | 922 by panel-2's count against 1,100, from a published 1,529. |
| STORYBOARD-DRIFT | several | ⚠️ low | Kinds, order, hero, `layout: wide`, the six timeline events, the two required annotations, the one authored `plain`, the zero `howToRead` and the `sourceRefs` backfill all match §3 and §8b exactly. Three small departures, none named in the file: (a) five fields over their word caps, which panel-2 judged worth it in four of five cases and §8g anticipates; (b) Gaia dropped from the §7 names list after panel-2's direction 2; (c) the optional third annotation on Mar 5 not taken, which §3 permits. See Required fixes 2. |
| QUESTION-UNANSWERED | §6 of the storyboard | **clean** | All three answerable from the draft alone, and independently confirmed by four personas in panel-2. Q1: §01 + §02 + §03. Q2: §02's Feb 24 denominator, the Jun 3 "so", and §03's terms 1–2. Q3: §02's Feb 2026 and Mar 5 notes plus tile 5. Q3's model answer also mentions Gaia and "among the faintest"; neither is needed to answer what settled it and how close it comes. |
| `emphasis: "warn"` on the good-news tile | §05 · tile 5 | ⚠️ note | The miss distance — the happiest number in the issue — renders in the alarm treatment. A design call, out of my lane and out of the panel's, flagged now for the third time so it is a decision rather than an inheritance. |
| Source balance | whole issue | **clean** | Eight sources, all T0/T1 primary (NASA Science, ESA), so the primary anchor is overwhelming. No policy or contested-interpretation claim is made, so viewpoint diversity does not apply. Conversely no settled empirical claim is hedged against an opinion — the all-clear is stated as the agencies state it. No FALSE BALANCE. |
| Quotability | §02, §06 | **clean** | Both verbatim passages come from NASA Science blogs, recorded open access in dossier §6 and quoted from the original, not from a corpus chunk. `mcp__parallax_rag__search` was **not available in this session**, so per the agent contract the check fell back to the dossier's recorded URLs — all eight match the `sources[]` URLs character for character. No GUIDE-ONLY exposure. |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ **by ruling** | `status: published` is correct for a Phase-6 in-place rewrite — storyboard §8a keeps `id`, `topic`, `publishedAt`, `tags` and `status`. Flagged only so nobody "fixes" it to `draft`. |
| All section kinds registered | ✅ | `you-think`, `timeline`, `jargon-buster`, `number-sense`, `data-readout`, `quote` — all in `SECTION_KINDS`, all dispatched in `SectionBody.astro`. |
| No author field | ✅ | Absent. |
| publishedAt valid | ✅ | 2026-06-04, parses as `z.date()`. |
| Source URLs https:// | ✅ | All eight. |
| Source kinds valid | ✅ | All eight `primary`. |
| ≥6 sources | ✅ | Eight, all still referenced. |
| Zod bounds | ✅ | `primer` 147 chars (80–420) · `plain` 125 (≤220) · no `howToRead` authored, correct under RG-19 since no kind here is in `NEEDS_HOW` · `layout: wide` in the enum · four `story.beats` (3–6), all texts inside 40–320, all kickers ≤80, `cta` ≤160 · `voice` in the enum · every `sourceRefs` id resolves. |
| Component build guards | ✅ | `you-think` has both `think.text` and `actually.text`; `number-sense` has a string `value`, a `label` and three `equals` rows each with `text` (guard is 1–3). Nothing throws. |

---

## Required fixes before publish

1. **§04 `number-sense` · `data.note` — the quotation needs a speaker or it
   needs to stop wearing quote marks.** As written it is NASA's sentence with
   its first three words removed, its next word silently capitalised, no
   ellipsis and nobody named, in the one section whose whole job is to make a
   number sayable. Two clean exits, both inside the field's word budget: give
   it the same treatment the almond just got ("NASA called it the highest impact
   probability it has ever recorded for an object of this size or larger"), or
   drop the marks and let it be the issue's own sentence with the section
   `source` line carrying it. It traces either way — src-03 is already on
   `sourceRefs`. This is the only item I would hold the file for.

2. **Add a two-line provenance note to the MDX body comment**, naming what this
   rewrite departed from and why: the two cut sections and their operator
   rulings (§8c.1, §8c.2), and the Gaia clause removed after panel-2's
   direction 2 while storyboard §7 still lists Gaia among its names. Ships
   nothing to the reader and costs one edit. Without it the next pass over this
   file reads the storyboard, sees a missing name, and restores a clause two
   readers had to be rescued from.

---

## Optional improvements

1. **The hook's "1 in 32" could take the "about" the rest of the issue
   carries.** 3.1% is one in 32.26; §04 and story beat 0 both hedge it and the
   hook does not. One word, and the hook is currently 24 against a 25 ceiling —
   but see the HEAD-HEAVY watch: the word has to come from somewhere.
2. **Story beat 5's kicker says "NASA's own words" over a paraphrase.** Either
   quote the sentence and let the marks do the work, or re-kicker the beat.
   Nothing is inaccurate; the promise and the payload just differ by a degree.
3. **Tile 5's `emphasis: "warn"`** puts the alarm treatment on the good news.
   Third flag; worth a decision either way.
4. **Consider whether the reader should be told why only Webb could.** The
   issue now says "two years before any ground telescope could have" without
   the 2028 return that makes it true. The almond carries the *faintness*, which
   is most of it. If the operator wants the rest, dossier §4 has the 2028
   window sourced to src-07 — but the only place it fits is the node panel-2
   calls the densest block on the page, so my recommendation is to leave it.
5. **§05's caption is a label, not a finding.** Carried verbatim by ruling, so
   not a fix — but if this issue is ever touched again, the caption is a free
   place to say the thing the title promises ("five of the six figures are
   readings of us, not of the rock").
