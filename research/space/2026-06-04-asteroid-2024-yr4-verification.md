# Verification Report: The Asteroid We *Talked* Down

- **Draft:** src/content/issues/2026-06-04-asteroid-2024-yr4/index.mdx
- **Dossier:** research/space/2026-06-04-asteroid-2024-yr4-dossier.md
- **Verified:** 2026-06-04
- **Verdict:** APPROVED

---

## Overall verdict

**APPROVED.** Every factual claim, number, date, and quote in the draft
traces to a sourced entry in the dossier (§3 Timeline, §4 Key facts, §5 Key
quotes). All three verbatim quotes match the dossier character-for-character.
The two `[UNVERIFIED]` dossier items — the ESA "Moon is safe" closing line
(speaker unconfirmed) and any flat "faintest-ever" superlative — were handled
correctly: the ESA line is **not used at all** (so there is no invented
speaker), and the faintness claim stays inside NASA's hedged "among the
faintest" wording. The Palermo value the researcher deliberately excluded does
not appear. Both schematic sections (`signal-readout`, `trajectory-arc`) are
labelled as illustrative in **both** their caption and intro, with the single
sourced quantity (the >20,000 km lunar miss) called out explicitly. No
advocacy, no AI-tell violations that breach the hard caps, schema clean. This
is ready for the editor's final read and publish. The items below are
zero-blocker notes for the editor's judgment only.

---

## Claim verification

| Claim | Location | Status | Note |
|---|---|---|---|
| Discovery 27 Dec 2024, ATLAS, Río Hurtado, Chile | timeline · Dec 27 2024 | ✅ | Matches §3/§4. Attribution split handled correctly: "NASA places the station 'in Chile'; ESA names it Río Hurtado" — exactly the dossier's NASA-vs-ESA sourcing. |
| Earth-impact odds peak 3.1%, 18 Feb 2025 | timeline · Feb 18 2025; data-readout tile 1 | ✅ | §4 verbatim. Event dated 18 Feb (date the figure was *for*); quote attributed to NASA 19 Feb post. No date conflation. |
| "highest impact probability NASA has ever recorded for an object of this size or larger" | timeline note; data-readout tile 1 note | ✅ | Verbatim vs §5 / src-03 quote. NASA's exact qualifier preserved — NOT paraphrased to "highest ever in 20 years" or a flat superlative. (Requested check — PASS.) |
| Dark-skies cut odds to 1.5%, 19 Feb 2025 | timeline · Feb 19 2025 | ✅ | Matches §3. |
| Earth ruled out, 0.004%, 24 Feb 2025; residual 1.7% lunar | timeline · Feb 24 2025; data-readout tile 2 | ✅ | Matches §3/§4. |
| Lunar odds rise to 3.8%, 2 Apr 2025 | timeline · Apr 2 2025 | ✅ | Matches §3. |
| Size 53–67 m from JWST thermal data (26 Mar 2025) | timeline · Apr 2 2025; data-readout tile 4 | ✅ | §3/§4: thermal obs 26 Mar 2025, reported in 2 Apr post. Note correctly cites "(NASA, 2 Apr 2025)". |
| Lunar odds 4.3%, 3 Jun 2025 | timeline · Jun 3 2025; data-readout tile 3 | ✅ | §3/§4. Event date 3 Jun vs NASA blog URL 5 Jun handled correctly: note reads "3 Jun 2025 … (NASA, 5 Jun 2025)" — exactly the researcher's trap-note distinction. |
| ESA later described lunar peak as "around 4%" | data-readout tile 3 note | ✅ | §4: ESA all-clear page rounds to "around 4%." |
| JWST two decisive faint detections, 18 & 26 Feb 2026 | timeline · Feb 18 & 26 2026 | ✅ | §4: "18 and 26 February 2026." |
| Tracked against Gaia-anchored star positions | timeline note; signal-readout band 4 | ✅ | §4: "stars whose positions are very well known thanks to the work of ESA's Gaia mission." |
| Lunar impact ruled out, odds to zero, 5 Mar 2026 | timeline · Mar 5 2026; paradox | ✅ | §2/§3/§4. |
| Miss > 20,000 km (ESA); 13,200 mi / 21,200 km above lunar surface (NASA) | data-readout tile 5; trajectory-arc caption + "Closest to Moon" phase | ✅ | §4: both figures present, consistent, correctly attributed. NASA's "21,200 km" labelled as above the lunar surface. |
| Close approach 22 Dec 2032 | prose, timeline, data-readout tile 6, trajectory-arc | ✅ | §4. |
| Unobservable again until 2028 | trajectory-arc · Outbound note | ✅ | §4: "Next natural observation window: 2028." |
| "among the faintest observations of an asteroid ever made" | timeline · Feb 18 & 26 2026 note | ✅ | §4 + researcher note: stays inside NASA's hedged "among the faintest" — does NOT claim a flat "faintest-ever" superlative. Correctly handled. |
| Quote: "This update reflects improved precision … rather than a shift in its orbital path." | paradox · Structural Read; src-01 | ✅ | Verbatim vs §5 (Molly Wasser). Character-for-character match. (Requested check — PASS.) |
| Quote: "2024 YR4 is exceedingly faint right now, reflecting about as much light as an almond at the distance of the Moon." | src-07 | ✅ | Verbatim vs §5 (carried as source quote; not used in body prose, so no speaker attribution risk). |
| ESA "Moon is safe … work continues" closing line | (not present) | ✅ | The `[UNVERIFIED]`-speaker line is NOT used anywhere in the draft. No invented speaker. ESA all-clear is attributed institutionally ("NASA and ESA announce …"). (Requested check — PASS.) |
| Palermo-scale value (−0.18) | (not present) | ✅ | Absent, as the dossier requires. (Requested check — PASS.) |
| signal-readout bar values | signal-readout · bands | ✅ | Editorial/illustrative — caption: "SCHEMATIC … not published measurements"; intro: "It's an illustrative schematic, not data." No fabricated SNR presented as sourced. (Requested check — PASS.) |
| trajectory-arc coordinates (altKm/downrangeKm) | trajectory-arc · phases | ✅ | Illustrative — caption: "SCHEMATIC, not to scale"; intro: "It is a schematic, not to scale. The only published quantity is the miss distance; the axis values are illustrative." (Requested check — PASS.) |

No ❌ UNTRACED claims. No ⚠️ PARAPHRASE on quotes. No `[UNVERIFIED]` dossier
item used without resolution.

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| Binary "not X / but Y" device appears in three places: hook ("not because the rock moved, but because the uncertainty around it did"), and the prose closer ("The scariest moment was **not** the moment of greatest danger. **It was** the moment of least light."). The closer is the canonical "It is not X. It is Y." form and IS the structural argument (allowed: 1 per issue). | hook; prose §1 para 3 | ⚠️ ADVISORY | Within the hard cap as written — only ONE instance (the closer) is the strict period-separated reframe; the hook is the softer "not…but" variant. No change required. Just do not add any further "It is not X. It is Y." constructions during final edit; the quota is spent. |
| Three-sentence anaphoric staircase ("The number peaked when the orbit was least constrained. The orbit was least constrained when the asteroid was faintest. The peak measured how little light we had, not how close the rock was coming.") | paradox · Structural Read detail | ⚠️ ADVISORY | This is a rhetorical staircase mid-paragraph, not the banned "3× short fragments *closing* a section." It carries the structural payload and reads as intentional. Acceptable; flagged only so the editor doesn't add a second triple-cadence elsewhere. |

No advocacy framing. No rhetorical-question closers. No wire-service tone. No
unsourced speculation. No "In conclusion / This shows that" meta-commentary.
No abstract-noun labels ("the mechanism" / "the structural argument" / "the
rhetorical work"). No "First… Second… Third…" manifesto rhythm. No paragraph
exceeds one em-dash.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ | `status: draft` in frontmatter. |
| All section kinds registered | ✅ | prose, timeline, signal-readout, data-readout, trajectory-arc, paradox — all in `SECTION_KINDS` (config.ts) and dispatched in `SectionRenderer.astro`. Hero is rendered from frontmatter by `[slug].astro`, not a section entry (correct). |
| No author field | ✅ | Absent. |
| publishedAt valid | ✅ | 2026-06-04 (a real date; parses as `z.date()`). |
| Source URLs https:// | ✅ | All 8 sources use `https://`. |
| Source kinds valid | ✅ | All 8 are `primary` (enum allows primary/secondary/analysis). All-primary is unusual but legitimate — the dossier's lone secondary (space.com) was correctly dropped because every figure it carries is also in a NASA/ESA primary. |
| ≥6 sources | ✅ | 8 sources. |
| primer 80–420 chars | ✅ | ~410 chars — within the Zod ceiling (build would fail if over). |

---

## Required fixes before publish

None. The verdict is APPROVED.

---

## Optional improvements

1. **Lunar peak label vs body wording.** The data-readout tile labels the
   lunar peak "**4.3**%" and the note adds ESA's "around 4%." The dossier's
   recommended phrasing was "peaked at about 4% (4.3%)." The draft's split
   (precise figure in the tile, ESA's rounding in the note) is cleaner than
   the dossier's parenthetical and is fully sourced — keep as is unless the
   editor wants the "~4%" framing surfaced in the tile value itself.
2. **`sourceRefs[]` are empty on every section.** This matches the house
   pattern (the published delimitation issue also omits them and cites
   sources inline in notes/captions), and the draft does cite inline
   throughout — e.g. "(NASA, 19 Feb 2025)". No build risk. If the project
   later wants per-section source attribution to render, this issue would be
   a candidate to backfill, but it is not a publish blocker.
3. **3.1% "high-water mark" gloss.** The timeline note for 18 Feb 2025 reads
   "This is the high-water mark, set when the orbit was least constrained."
   The "least constrained" causal claim is the issue's thesis and is
   supported by the Wasser precision quote + the faintness mechanism, but it
   is an editorial synthesis rather than a single sourced sentence. It is
   defensible and consistent across the issue; no change needed, noted only
   for transparency.
