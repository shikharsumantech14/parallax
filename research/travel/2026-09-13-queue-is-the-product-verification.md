# Verification Report: Everest and Fuji now sell the *wait*

- **Draft:** src/content/issues/2026-06-04-queue-is-the-product/index.mdx (Phase-4 rewrite, written in place over the published issue)
- **Dossier:** research/travel/2026-06-04-queue-is-the-product-dossier.md
- **Storyboard:** research/travel/2026-09-13-queue-is-the-product-storyboard.md (Status: approved, rulings §9)
- **Prior report:** research/travel/2026-06-04-queue-is-the-product-verification.md (NEEDS REVISION)
- **Verified:** 2026-09-14
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION — no ❌ flags, six ⚠️ IMPRECISE claims and a short list of
register notes.** Every one of the operator's standing constraints holds: there
is no paid Everest queue-skip in any wording; the only Nepal facts stated as
current are the three enacted ones ($15,000, 55 days, guide 1:2); the 7,000 m
prerequisite keeps its `*(proposed)*` tag and the comparison intro says outright
that a rule tagged proposed is not law yet; "Rs 150,000 … in Nepali rupees" is
printed unconverted; and the 220,000–400,000 Fuji range, the 3,000/1,000
reservation split, the 27 April date and the $30,000–70,000 body-recovery figure
are all absent. All four required fixes from the June report are resolved — the
primer is now ~117 characters (was 458, a build-blocker), zero `# EDITOR:`
strings remain, "Here's the thing:" and "That is the point." are gone, and the
triple binary reframe is down to the one the `you-think` component earns
structurally. The optional fix on the 8,790 m node is also taken: the `plain`
line now says the point is "drawn for shape".

The register work is the strongest part of the rewrite. The Hindi is one
particle used twice in the operator-signed hook and nowhere else — delete both
*ka* and the English still says everything, so there is no HINDI-LOAD-BEARING
defect, and the precision layer (captions, plain, source lines, data labels) is
English throughout. "Death zone", "royalty" and "bullet climbing" are each
glossed in the sentence they first appear in. Every section intro restates what
the previous graphic showed, which is rule 5 executed properly for the first
time in this issue. Composition passes every floor: eight sections, six visual,
the two text-only rows not adjacent, a graphic first, ~71 words before it and
~985 reader-facing words against a 1,100 ceiling.

What holds it back are ⚠️-level precision losses that compression introduced.
Two of them ("4,000 slots a day" with the Yoshida-Trail qualification dropped;
the proposed 7,000 m peak with "in Nepal" dropped) narrow a dossier fact in a
way a reader cannot recover from the sentence they are reading, and one
(the comparison's source line) leaves the issue's only proposed-rule claim
attributed to two sources that are not its source. None needs new research.

---

## High-risk operator checks (explicit)

| Operator check | Result | Evidence |
|---|---|---|
| NO paid Everest "priority / skip-the-bottleneck / fast-track" tier, in any wording | ✅ PASS | Full-file scan. The negative is stated outright twice: `you-think` `note` — "no money buys a place at the front"; `you-think` `intro` — "buys entry to the line, not a place at the front"; story beat 0 repeats it. The `comparison` row "What it prices → Position in the summit-window queue" describes the effect of the base royalty plus the 55-day window, as in the published issue the June report cleared. Clean. |
| Only the enacted Nepal facts stated as current | ✅ PASS | $15,000 (`number-sense` caption, `comparison`, `timeline` Sep 1 2025); 55 days, "not 75" (`comparison` "Time gate", `paradox` detail); guide 1 per 2 climbers, tagged `*(enacted)*` (`comparison` "Who is allowed up"). Nothing else from the Nepal bill appears anywhere. |
| 7,000 m prerequisite still tagged proposed | ✅ PASS | `comparison` · rows[5] · values[0]: "a 7,000 m peak climbed first *(proposed)*", plus the intro's "A rule tagged proposed is not law yet." (See ⚠️ on the missing "in Nepal" and the source line, below — the *tag* itself is correct.) |
| "Rs 150,000 … in Nepali rupees" never converted | ✅ PASS | `number-sense` · `data.note`: "A Nepali citizen pays Rs 150,000 for the same permit, in Nepali rupees." Printed exactly as storyboard §5B and ruling 8 require — no ₹ glyph, no rate, not set inside the `equals[]` rows where the ₹ figures live. |
| 220,000–400,000 Fuji annual-climber range absent | ✅ PASS | No annual-climber figure anywhere in the file. |
| 3,000 / 1,000 reservation split absent | ✅ PASS | Neither number appears. Advance booking is asserted only in the verified form ("Yes — online, in advance"; "sells each slot dated and paid"). |
| 27 April date absent | ✅ PASS | No April date in the file. |
| $30,000–70,000 body-recovery figure absent | ✅ PASS | Not present; the `data-readout` tile that carried it in the published issue is gone, per ruling 5. |
| National Geographic quote absent | ✅ PASS (with a note) | No verbatim quote in any reader-facing field. The string survives in `sources[].quote` on src-01 — **that field has no renderer** (`core/Sources.astro` never reads `quote`), so it ships as metadata, not copy, and storyboard §7 requires the eleven `sources[]` entries to stay exactly as published. Verbatim-exact against dossier §5 in any case. No action needed; recorded so the next reader does not re-litigate it. |

All nine constraints pass.

---

## June report — required fixes, confirmed

| Prior fix | Status | Evidence |
|---|---|---|
| 1. Primer overshoots the 420-char Zod bound (build-blocker) | ✅ RESOLVED | New primer is ~117 characters / 20 words: "Nepal charges about ₹12.5 lakh to climb Everest. Japan sells 4,000 Fuji slots a day. Below: what each ticket buys." Inside 80–420. |
| 2. Two live `# EDITOR:` flags shipping as visible `note` copy | ✅ RESOLVED | Zero occurrences of `# EDITOR:` in the file. Both host tiles are gone: the body-recovery tile dropped (ruling 5), the "bill still in committee" timeline node cut (storyboard §3). |
| 3. Trim the "no longer the summit / it is the bottleneck" binary to one | ✅ RESOLVED | The published hook, lead and paragraph-2 reframes are all gone. The one reversal now lives in the `you-think` component's two panels, which is structural rather than prose — exactly where storyboard §8c spends it. The nearest prose echo, `paradox` detail "The waiting has not gone away. It now has a ticket counter.", is a concession-and-turn, not an "it is not X, it is Y". See ⚠️ REPEATED-REVERSAL below for the one remaining repetition. |
| 4a. "Here's the thing:" (comparison intro) | ✅ RESOLVED | The intro now opens "Fuji's crowd is now a daily count of 4,000, paid before anyone arrives." |
| 4b. "That is the point." (paradox intro) | ✅ RESOLVED | The intro now ends "…also makes you spend less of it." |
| Optional: the 8,790 m node read as a surveyed altitude | ✅ RESOLVED | `elevation-trek` · `plain`: "The distances, and the 8,790 m point, are drawn for shape." |
| Optional: apostrophe normalisation in the NatGeo quote | n/a | The prose copy is cut; only the `sources[].quote` string remains, with a straight apostrophe. |

---

## Claim verification

Component `data` values are traced as claims. "Conversion" = a sanctioned
computation on a dossier figure at a storyboard §9 rate, not a new fact.

| Claim | Location | Status | Note |
|---|---|---|---|
| Everest ticket $15,000 | hook | ✅ | Dossier §4 "Spring Everest royalty … $11,000 → $15,000" |
| about ₹12.5 lakh | hook · primer · number-sense `equals[0]` · comparison row | ✅ | Conversion: 15,000 × 83 = ₹12.45 lakh. Storyboard §5 A-1, §9 ruling 1. Rate stated in the `number-sense` source line. |
| Fuji ticket ₹2,300 | hook · data-readout intro · comparison row | ✅ | Conversion: 4,000 × 0.58 = ₹2,320. Storyboard §5 A-2, §9 ruling 1. Rate stated in the `data-readout` source line. |
| "Nepal charges about ₹12.5 lakh to climb Everest" | primer | ✅ | As above |
| "Japan sells 4,000 Fuji slots a day" | primer | ⚠️ IMPRECISE | Dossier §4: the 4,000/day cap is on the **Yoshida Trail** and excludes mountain-hut guests. The primer states it of Fuji whole. The qualification arrives two sections later. See Required fix 1. |
| Nepal calls the fee a royalty — the price of permission to climb | number-sense · intro | ✅ | Dossier §1, §4 (the "base spring royalty"); jargon.md "permit royalty" |
| $15,000, spring season, from September 2025 | number-sense · `data.value` / `label` | ✅ | Dossier §4, §2 (effective 1 Sep 2025) |
| Permit raised $11,000 → $15,000 on 1 September 2025 | number-sense · caption | ✅ | Dossier §4 / §3 (2025-09-01) |
| "36 percent more than the ₹9.1 lakh it cost in 2024" | number-sense · `equals[1]` | ✅ | 15,000 ÷ 11,000 = 1.364; 11,000 × 83 = ₹9.13 lakh. Storyboard §5 A-1b, §9 ruling 3. The $11,000 fee held through 2024 (dossier §4, first revision since 2015). |
| "at about ₹83 to the dollar" | number-sense · `equals[0].note` | ✅ | Storyboard §9 ruling 1 |
| Nepali citizen pays Rs 150,000, in Nepali rupees | number-sense · `data.note` | ✅ | Dossier §4 full royalty table ("Nepali citizens (spring) Rs 75,000 → Rs 150,000"). Unconverted, labelled — ruling 8. |
| "Japan sells 4,000 dated slots a day" | you-think · title | ⚠️ IMPRECISE | Same Yoshida-only elision as the primer. The section's own `caption` and `actually.text` both carry the qualification, so the title is corrected in place — but the title is what a skimmer keeps. See Required fix 1. |
| Japan fixed how many may start up Fuji's main trail each day; each slot dated and paid | you-think · `actually` | ✅ | Dossier §4 "Daily cap: 4,000 climbers/day on the Yoshida Trail"; "¥4,000 … payable in advance to reserve" |
| 4,000 slots a day | you-think · `actually.value` | ✅ | Dossier §4 |
| Yamanashi Prefecture caps the Yoshida Trail at 4,000 a day; Nepal sets no daily cap | you-think · caption | ✅ | Dossier §4 (cap, issuing authority); §7 comparison row "No explicit daily cap" |
| Nepal set no daily limit at all, and no money buys a place at the front | you-think · `data.note` | ✅ | Dossier §4 [UNVERIFIED] block — the negative stated as a negative, which is the correct handling |
| Nepal's fee buys entry to the line, not a place at the front | you-think · intro | ✅ | Same |
| A temple's timed entry, booked online in advance | you-think · intro (analogy) | ✅ | Analogy, not a claim. Does not misstate the mechanism: Fuji sells a dated, pre-paid slot (dossier §4). No ANALOGY-CLAIM. |
| Death zone above about 7,950 metres; the body starts shutting down; roughly three days there | elevation-trek · intro; three-steps; story beat 2 | ✅ | Dossier §4 "death zone begins at the South Col (~7,950 m)"; "~3 days max to make a summit bid" |
| The worst jam sits higher than Camp 4 | elevation-trek · intro / caption | ✅ | Dossier §4 "the summit-ridge bottleneck sits between the South Col and the top" |
| Base Camp 5,364 m | elevation-trek · points[0] | ✅ | Dossier §4 elevation profile |
| Camp 1 6,065 m | elevation-trek · points[1] | ✅ | Dossier §4 |
| Camp 2 · Western Cwm 6,400 m | elevation-trek · points[2] | ✅ | Dossier §4 |
| Camp 3 · Lhotse Face 7,162 m | elevation-trek · points[3] | ✅ | Dossier §4 |
| Camp 4 · South Col 7,950 m — death zone begins | elevation-trek · points[4] | ✅ | Dossier §4 |
| The bottleneck · summit ridge / Hillary Step 8,790 m | elevation-trek · points[5] | ✅ | Dossier §7 suggests `elevM: 8790` for this waypoint. The June report's ⚠️ is now discharged: the `plain` line declares the point "drawn for shape", so it is no longer readable as a surveyed altitude. |
| Summit 8,849 m | elevation-trek · points[6]; comparison side tag | ⚠️ IMPRECISE | Dossier §4 gives 8,848.86 m; §7 rounds to 8,849. Internally consistent rounding, carried from the published issue. Cosmetic — carried forward from the June report unchanged. |
| One weather window on Everest, one sunrise on Fuji | three-steps · steps[0] | ✅ | Dossier §1 ("the window of safe weather that everyone competes for at once"); §4 (the 14:00 gate ends the overnight sunrise climb) |
| The hours standing above 7,950 m are what kill; on Fuji it is bodies arriving together | three-steps · steps[1] | ✅ | Dossier §1 ("time spent waiting in the death zone … bodies arriving in the same hours") |
| Put a price, a quota and a clock on those hours, the way a temple sells timed slots | three-steps · steps[2] | ✅ | Dossier §1. The temple mapping is an analogy, not a claim; it does not misstate the mechanism. |
| Fuji fee ¥4,000, about ₹2,300, paid before you arrive | data-readout · intro; `tiles[1]` | ✅ | Dossier §4 "¥4,000 per person per trip (2026), payable in advance to reserve" |
| Gate shuts at 2 p.m. to end bullet climbing — the overnight rush to the summit | data-readout · intro | ✅ | Dossier §4 gate hours + anti-bullet-climbing purpose; jargon.md gloss matches |
| Yoshida Trail 2026: 4,000 climbers a day, ¥4,000 each, gate shut from 2 p.m. | data-readout · caption | ✅ | Dossier §4 |
| 4,000/day; Yoshida Trail; excludes mountain-hut guests | data-readout · `tiles[0]` | ✅ | Dossier §4 |
| "About ₹2,300; double what it was in 2024" | data-readout · `tiles[1].note` | ✅ | Dossier §4 2024 origin (¥2,000) and 2025 step (→ ¥4,000). Storyboard §9 sanctions "double what it was in 2024" = ¥2,000 → ¥4,000. (Antecedent ambiguity noted under Optional improvements.) |
| Shut 14:00–03:00; hut guests exempt | data-readout · `tiles[2].note` | ✅ | Dossier §4 gate hours |
| 2026 season 1 Jul – 10 Sep; summit access prohibited before late June | data-readout · `tiles[3]` | ✅ | Dossier §4 ("1 July – 10 September 2026; summit access prohibited until ~30 June (tentative)") |
| Everest 8,849 m / Fuji 3,776 m | comparison · side tags | ⚠️ IMPRECISE | Fuji 3,776 m ✅ (dossier §4). Everest as above — rounding only. |
| Higher base royalty / hard daily quota | comparison · rows[0] | ✅ | Dossier §1, §7 |
| $15,000 permit (spring), about ₹12.5 lakh / ¥4,000 per climb, about ₹2,300 | comparison · rows[1] | ✅ | Dossier §4 + the sanctioned conversions |
| No explicit daily cap / 4,000 climbers a day | comparison · rows[2] | ✅ | Dossier §7 comparison row; §4 |
| No / Yes — online, in advance | comparison · rows[3] | ✅ | Dossier §4 (advance-booking system verified; only the split and open date are [UNVERIFIED], and both are absent) |
| 55-day permit window / gate shut 2 PM – 3 AM | comparison · rows[4] | ✅ | Dossier §4 (75 → 55 days; gate 14:00–03:00) |
| One guide per two climbers *(enacted)* | comparison · rows[5] | ✅ | Dossier §4 "Mandatory guide ratio (enacted): one guide/Sherpa per two climbers on peaks above 8,000 m" |
| A 7,000 m peak climbed first *(proposed)* | comparison · rows[5] | ⚠️ IMPRECISE | Dossier §4 [UNVERIFIED] block: the proposed prerequisite is a 7,000 m peak **in Nepal** — Ama Dablam and non-Nepal peaks are explicitly excluded. Dropping "in Nepal" makes the proposed rule sound looser than it is. The `*(proposed)*` tag itself is correct. Also: the section's source line names only the Nepal Dept. of Tourism / Kathmandu Post and Yamanashi Prefecture; this row's sources are src-02 (National Geographic) and src-08 (Alan Arnette). See Required fix 2. |
| Gear check where the trail starts (the 5th station) | comparison · rows[5] | ✅ | Dossier §4 "Equipment screening at the 5th-station gate" |
| Position in the summit-window queue / a daily unit of crowd | comparison · rows[6] | ✅ | Dossier §1, §7 |
| A rule tagged proposed is not law yet | comparison · intro | ✅ | Dossier §9(b) — the enacted-vs-proposed instruction, stated to the reader |
| 2013 · Mount Fuji inscribed by UNESCO, for its spiritual meaning, the dwelling place of the gods | timeline · events[0] | ✅ | Dossier §4 / §3 ("home of *kami*", listed for spiritual significance) |
| 2019 · Nirmal Purja, a climber, photographs hundreds stacked on the summit ridge | timeline · events[1] | ✅ | Dossier §3 (2019-05-22/23) |
| Jul 1 2024 · Yoshida Trail capped at 4,000 a day, with a ¥2,000 fee | timeline · events[2] | ✅ | Dossier §4 "2024 origin"; §3 |
| 2025 season · the fee goes to ¥4,000 and the gate now shuts at 2 p.m. | timeline · events[3] | ✅ | Dossier §4 "2025 step (price doubling)"; §3 |
| Sep 1 2025 · the spring Everest fee jumps to $15,000, the first rise since 2015 | timeline · events[4] | ✅ | Dossier §4, §2, §3 |
| Jul 1 2026 · Fuji's 2026 season opens under the cap, the advance fee and the 2 p.m. gate | timeline · events[5] | ✅ | Dossier §3 (2026-07-01), §4 |
| **Annotation** — "The photograph that made the queue visible. Eleven died that season." | timeline · `annotations[0]` | ✅ | Dossier §3 (photograph goes viral; 11 die that season); §4 "Recent death tolls — 2019: 11 deaths". 11 words, inside the ≤ 12 cap. |
| **Annotation** — "Fuji's fee doubles in one year: ¥2,000 to ¥4,000." | timeline · `annotations[1]` | ✅ | Dossier §4 2024 origin (¥2,000, from 1 Jul 2024) → 2025 step (¥4,000). 9 words. |
| "Two dates set the scene; the four after them tighten, and not one loosens" | timeline · title + intro | ⚠️ IMPRECISE | Three of the four do tighten (Jul 2024, 2025 season, Sep 2025). The fourth, 1 Jul 2026, is the season **opening under rules already in force** — its own note says so ("Under the cap, the advance fee and the 2 p.m. gate"). Nothing loosens, which is true; but calling the 2026 node a tightening step overstates it. See Required fix 3. |
| Fuji's gate closes at 2 p.m.; Everest's permit runs 55 days, not 75 | paradox · caption | ✅ | Dossier §4 |
| Queuing as long as the crowd forced you to; pushing up Fuji overnight for the sunrise; the danger was unpriced | paradox · `sides[0].detail` | ✅ | Dossier §1, §4 (bullet climbing) |
| Fuji's ¥4,000 slot bans the overnight climb and meters the gate | paradox · `sides[1].detail` | ✅ | Dossier §4 gate hours / anti-bullet-climbing |
| Everest's permit now runs 55 days, not 75 | paradox · `sides[1].detail` | ✅ | Dossier §4 "Permit validity: cut from 75 days → 55 days" |
| "a line an Everest chronicler has linked to deaths" | paradox · `sides[1].detail` | ✅ | Dossier §4 (Arnette: ~5 of 11 2019 deaths may have been crowd-related); §5 attribution caution. Correctly a paraphrase by role, not a quote attributed to a named person — the dossier's explicit instruction. |
| Story beat 0 — $15,000 / ₹12.5 lakh; Nepal's fee only; entry to the line, not a place at the front | story · beats[0] | ✅ | As above |
| Story beat 2 — death zone, 7,950 m, three days, the worst jam higher | story · beats[1] | ✅ | As above |
| Story beat 4 — 4,000 slots, ¥4,000, ₹2,300, gate shuts at 2 p.m. | story · beats[2] | ✅ | As above |
| Story beat 5 — Nepal raised the price, Japan fixed the number | story · beats[3] | ✅ | Dossier §1 |
| Story beat 7 — pay more to stand there less | story · beats[4] | ✅ | Dossier §1, §4 |

**Totals: 59 ✅ VERIFIED · 6 ⚠️ IMPRECISE · 0 ❌ UNTRACED.**

No [UNVERIFIED] dossier item is used as fact. The two the operator watches — the
paid queue-skip and the 7,000 m prerequisite — appear only as an explicit
negative and as a `*(proposed)*`-tagged row respectively.

### Quote / quotability check

No verbatim quote appears in any reader-facing field. The only quoted string in
the file is `sources[].quote` on src-01 (National Geographic, the 2019 crowding
feature), which `core/Sources.astro` does not render — it is metadata. Compared
character-by-character against dossier §5: identical, including the em-dash
before "indelibly". The source is an open National Geographic article, not a
GUIDE-ONLY corpus chunk, so quotability is not in question. **No ❌ NON-QUOTABLE
SOURCE.** (The `mcp__parallax_rag__search` tool was not available this run;
per the agent contract, claims were traced against the dossier's recorded source
URLs instead. All eleven `sources[].url` values match the dossier's §8
bibliography exactly.)

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| "buys entry to the line, not a place at the front" appears three times — `you-think` intro, `you-think` note ("no money buys a place at the front"), story beat 0 ("Not a place at the front of it") | you-think · intro + `data.note`; story · beats[0] | ⚠️ REPEATED-REVERSAL (tell 6, mild) | The repetition is deliberate — storyboard §5C makes the note the place the false claim cannot creep back in — and the beat renders only in story mode, so a page reader meets it twice, not three times. Keep the `note` (it is the operator's guard) and vary the intro: "Nepal's fee gets you into the line. It does not move you up it." |
| "The waiting has not gone away. It now has a ticket counter." repeated verbatim in the story beat ("The waiting did not go away. It now has a ticket counter.") | paradox · `sides[1].detail`; story · beats[4] | ⚠️ (cosmetic) | Story beats are meant to compress the section, not restate it word for word. Reword the beat's close. |

No ❌ ADVOCACY: the draft never says a fee is unjust, never sides with climbers
or governments, and the `paradox` holds both readings rather than choosing one.
No ❌ WIRE TONE. No ❌ SPECULATION — every forward-facing line ("The crowd is a
count now") describes the enacted 2026 regime, not a predicted consequence. No
⚠️ RHETORICAL Q (the issue asks no questions at all — permitted, though rule 6
allows one per section as an opener and none is used). No ⚠️ PASSIVE FILLER.
No ⚠️ META-COMMENTARY — both instances the June report flagged are gone.

AI-tell catalog (contract §6), checked field by field:

- **Em-dash overload (1).** No paragraph carries two. One each in the hook, the
  `elevation-trek` intro, the `data-readout` intro and `paradox` detail[0]. ✅
- **Binary reframe (2) / stacked reframes (6).** The one sanctioned reversal is
  the `you-think` component itself. See the ⚠️ above for the prose echo. ✅/⚠️
- **Triple-fragment closer (3).** None. ✅
- **Abstract-noun jargon (4).** None. Note that the `comparison` row label was
  renamed "Competence screen" → "Who is allowed up", which is the right move. ✅
- **Numbered-manifesto rhythm (5).** `three-steps` carries the ordering in the
  component, and the step titles use no ordinals. ✅
- **Title formula (7).** "Everest and Fuji now sell the *wait*" states the
  finding. All eight section titles state findings. ✅
- **Antithesis dek (8).** "Two mountains, two methods, one thing for sale" is a
  parallel, not an "X is not Y, it is Z", and the hook does not reverse. ✅
- **Stacked citation (9).** None in body copy — National Geographic, The
  Kathmandu Post, Skift, Yamanashi Prefecture and the Nepal Dept. of Tourism all
  sit in `source` lines only, exactly as storyboard §7 requires. ✅
- **Staccato run (10).** No run of three sentences under eight words. ✅
- **Once-used name (11).** See ⚠️ NAME-UNPLACED below. ⚠️
- **Hinglish tells (12–17).** No YouTube intro, no *yaar/bhai*, no Devanagari,
  no italicised Hindi, no literal idiom, no condescending tag. ✅ (13 discussed
  under the register audit.)

**Structure check.** The timeline's arc is directional and its title names the
direction. The paradox is genuinely two-sided: both statements are true and
sourced, and neither is a straw man. The `data-readout` tells its story in four
tiles with no prose carrying the load. There is no `prose` section to audit.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| — HINDI-LOAD-BEARING | — | ✅ clean | Two instances of *ka*, both in the hook. Skip test: "Everest ticket: $15,000, about ₹12.5 lakh. Fuji ticket: ₹2,300." — the English still says everything. Karthik loses nothing. **Not blocking.** |
| — HINDI-FIELD | — | ✅ clean | Every `caption`, `plain`, `source`, tile label, tile note, point label, row label and annotation is English. The precision layer is clean. |
| ⚠️ HINDI-DENSE (waived) | hook | noted, not a defect | *ka* falls in two consecutive sentences, which §2 normally forbids. **This is the operator-signed worked example in `_voice-core.md` §9, reproduced verbatim, and storyboard §9 ruling 2 confirms it stays.** Recorded so it is not "fixed" by a later pass. Spelling *ka* is in the lexicon, set roman, not italic. ✅ |
| — HINDI-SPELLING | — | ✅ clean | *ka* is the lexicon spelling, allowed "only inside a natural phrase ('Everest ka ticket')" — the lexicon's own example. |
| ⚠️ JARGON-UNGLOSSED | comparison · rows[6] · "summit-window queue" | low | jargon.md lists "summit window" (gloss: the few days of safe weather each season). The nearest explanation is two sections earlier, in `three-steps` step 1, and uses a different phrase ("One weather window on Everest"). Every other term of art is glossed in the sentence it appears in: "royalty" (§1 intro), "death zone" (§3 intro), "bullet climbing" (§5 intro), "the 5th station" (§6 row). |
| ⚠️ JARGON-UNGLOSSED | elevation-trek · point labels — "Western Cwm", "Lhotse Face", "Hillary Step" | very low | Waypoint names on a graphic rather than prose terms of art; "Cwm" is the one a 15-year-old will stall on. Acceptable as-is; the labels carry the argument through "death zone begins" and "The bottleneck". |
| ⚠️ BARE-NUMBER | timeline · events[4].note "$15,000"; events[2].note "¥2,000"; annotations[1] "¥2,000 to ¥4,000"; paradox · detail "¥4,000" | low | Rule 4 asks every dollar figure to carry its rupee equivalent. Each of these repeats a figure whose ₹ equivalent is given earlier (§1 for $15,000, §5 for ¥4,000), and the timeline note cap is 20 words / 2 numbers — adding ₹ would break the floor the storyboard set. Judged acceptable; flagged so the choice is visible. |
| — NO-INDIAN-ANCHOR | — | ✅ clean | ₹ appears six times across the hook, primer, §1, §5 and §6; lakh used twice; the Indian habit anchor is "a temple's timed entry, booked online in advance" (§2) and "the way a temple sells timed slots" (§4). |
| ⚠️ NAME-THROUGHPUT | whole issue | borderline pass | People and organisations named in body copy: Nirmal Purja, UNESCO, Yamanashi Prefecture. Places: Everest, Fuji, Nepal, Japan, the Yoshida Trail, plus the route waypoints (Base Camp, Camps 1–4, South Col, Western Cwm, Lhotse Face, Hillary Step) as in-graphic labels. Under 12 on the storyboard's §7 counting, which groups the waypoints; a strict per-proper-noun count would exceed it. `npm run check:prose` has the authoritative heuristic — run it. |
| ⚠️ NAME-UNPLACED | timeline · events[1].note "Nirmal Purja, a climber" | low | The name is used exactly once. It carries a role phrase, so it is not bare — but "a climber" is thinner than the storyboard's "the climber whose 2019 photograph of the summit line went round the world", and the annotation on the same node already says "The photograph that made the queue visible", making the name close to redundant. Either give it the fuller role or drop to "a climber photographs hundreds stacked on the summit ridge". |
| — ANALOGY-CLAIM | you-think intro; three-steps step 3; data-readout intro | ✅ clean | All three analogies (a temple's timed entry; a temple selling timed slots; a venue with a fixed number of seats) match the mechanism the dossier describes — a dated, pre-paid, capped slot sold before arrival. None misstates it. |
| — HOOK-ABSTRACT | hook | ✅ clean | Three numbers ($15,000, ₹12.5 lakh, ₹2,300), a "your", the twist in the last clause. 24 words, under 25. |
| — TITLE-FORMULA | title + all 8 section titles | ✅ clean | No "The ‹Noun› That ‹Verb›s". The title states the finding and names two places the reader knows. |
| — TEXT-HEAVY | whole issue | ✅ clean | 6 of 8 sections visual (75%); floor is 60%. |
| — PROSE-RUN | §4 and §8 | ✅ clean | The two text-only rows (`three-steps`, `paradox`) sit at positions 4 and 8 — not adjacent. Zero `prose` sections (ceiling 3). |
| — NO-LEAD-GRAPHIC | §1 | ✅ clean | `number-sense` opens, per storyboard §9 ruling 4. It is a VizCard with its own caption and source. |
| — HEAD-HEAVY | head + §1 intro | ✅ clean | ~71 words before the first graphic (title 7 + dek 8 + hook 24 + primer 20 + §1 intro 12); floor is ≤ 80. The published issue was 503. |
| — word ceiling | whole issue | ✅ clean | ~985 reader-facing words against the 1,100 ceiling (storyboard budget 970). Published was 1,475. |
| ⚠️ STORYBOARD-DRIFT | §2, §5, §6 intros; dek; primer; timeline events[5].note; comparison rows[5].label | low, all favourable | Kinds, order, hero, `layout: split`, the six timeline events, both annotations, zero `howToRead` and the names list are all exactly as approved. The departures: three intros overshoot the storyboard's per-row caps (§2 37 words vs ≤ 25; §5 39 vs ≤ 30; §6 38 vs ≤ 30) while staying inside the contract's ≤ 45; the dek reads "one thing for sale" not "the same thing for sale"; the primer leads with ₹12.5 lakh rather than $15,000; the 2026 timeline note says "The crowd is a count now" not "inventory" (a jargon removal, and better); the comparison row label is "Who is allowed up" not "Competence screen" (also better). No claim changes. None is named in a draft summary because the frontmatter has no summary field — worth a line in the commit message instead. |
| — QUESTION-UNANSWERED | storyboard §6 | ✅ clean | Q1 (what is being priced) — answerable from the title, hook, `three-steps` and `paradox`. Q2 (what the fee does not buy) — answerable from the `you-think` note and the `comparison` "Hard cap on numbers?" row, both explicit. Q3 (why queuing was dangerous) — answerable from the `elevation-trek` intro and the 2019 annotation. Note that the storyboard's model answer for Q3 includes "an Everest chronicler calculated as many as five of eleven may have been crowd-related"; the draft carries the eleven deaths and "a line an Everest chronicler has linked to deaths" but not the five-of-eleven figure. The question is still answerable; the detail is a deliberate cut. |
| ⚠️ NUMBER-DENSITY | number-sense · caption; data-readout · caption | low | Rule 8 caps a sentence at two numbers. "Nepal raised the spring Everest permit from $11,000 to $15,000, about ₹12.5 lakh, on 1 September 2025" carries three figures and a date; "Fuji's Yoshida Trail in 2026: 4,000 climbers a day, ¥4,000 each, the gate shut from 2 p.m." carries four. Both are captions — the precision layer, where the data claim belongs — so the rule bites less hard than it would in prose. Splitting the first into two sentences would help. |

**Comprehension-field contract.** One `plain` in the issue (`elevation-trek`):
"A silhouette of the route: left to right is distance walked, up and down is
real height. The distances, and the 8,790 m point, are drawn for shape." Pure
FORM — **no ⚠️ PLAIN-CLAIM.** Five captions (§1, §2, §3, §5, §8), every one of
them a data assertion traced above — **no ⚠️ CAPTION-FORM.** Zero `howToRead`
fields, which is correct: none of the eight kinds is in `NEEDS_HOW`
(`src/lib/explainers.ts`), so no panel renders and there is nothing for
**⚠️ REDUNDANT-HOWTO** to catch.

**Seams (rule 5).** Executed properly, and worth recording as the thing to copy:
§2 opens by restating §1, §4 restates §3, §6 restates §5, §7 restates §6, §8
restates §7; §2's caption covers the §2→§3 seam where the intro does not.

### Source balance (`_sources/_TAXONOMY.md` §5)

| Check | Result | Note |
|---|---|---|
| Primary anchor present | ✅ | src-03 (The Kathmandu Post, quoting the Dept. of Tourism director) and src-04/src-05 (fujisan-climb.jp, the issuing authority's own notices) carry every load-bearing figure — $15,000, 55 days, 1:2, 4,000/day, ¥4,000, the gate, the season. |
| Viewpoint diversity on interpretation claims | ✅ (with a note) | The one interpretive claim — "both countries are now selling the wait" — is Parallax's synthesis, and the `paradox` section carries the counter-reading (the same rules shorten the wait) rather than suppressing it. Not a contested empirical question. **Note:** the published issue carried more of the sceptical strand (Alan Arnette on rules made for business and not enforced, dossier §5); the rewrite keeps none of it. Not a defect — the issue asserts no enforcement claim that would need it — but it is what the compression cost. |
| No false balance | ✅ | No settled fact is hedged against an opinion. The one genuinely uncertain item in the dossier (the paid queue-skip) is handled as a stated negative, which is the correct treatment. |
| ⚠️ Source-line gap | see Required fix 2 | The `comparison` section's source line names the Nepal Dept. of Tourism / The Kathmandu Post and Yamanashi Prefecture. Its `*(proposed)*` 7,000 m row traces to src-02 (National Geographic) and src-08 (Alan Arnette), neither of which is on that line. |
| Uncited source | optional | src-11 (Syracuse JILC) backed the 6th-amendment legal plumbing, which the storyboard cut from the timeline. It is now cited by no section source line. Harmless — `sources[]` is the bibliography and storyboard §7 requires all eleven to stay — but worth knowing. |

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ by ruling | The file carries `status: published`. This is **correct and intended**: storyboard §9 ruling 10 requires the rewrite to be written in place over the published issue, keeping the same `id`, `topic`, `publishedAt`, `status: published` and `tags`. Not a defect. Flagged only so it is not "fixed". |
| All section kinds registered | ✅ | `number-sense`, `you-think`, `elevation-trek`, `three-steps`, `data-readout`, `comparison`, `timeline`, `paradox` — all eight present in `SECTION_KINDS` (`src/content/config.ts`). |
| No author field | ✅ | No `author:` key. |
| publishedAt valid | ✅ | `2026-06-04`, parses as `z.date()`. |
| Source URLs https:// | ✅ | All 11 (src-01…src-11). All match the dossier §8 bibliography. |
| Source kinds valid | ✅ | 5 `secondary`, 3 `primary` (src-03, src-04, src-05), 3 `analysis` (src-07, src-08, src-11). |
| ≥6 sources | ✅ | 11. |

Bounds and shapes, checked against the Zod schema and each component's runtime
guard — none will fail the build:

- `primer` ~117 chars (80–420) ✅ · `plain` ~158 chars (≤ 220) ✅ · no `howToRead`
  authored, so the 40–360 bound is not engaged ✅
- `layout: split` on `elevation-trek` only; valid enum member; the issue's single
  hero, per CANON §3 ✅
- `source` as `{ label, date }` on §1 and §5. `date` is `z.string().optional()`,
  so the rate note is legal there and renders as
  `Source · ‹label› · ‹date›` from `core/Section.astro`. ✅
- `number-sense` runtime guard: 1–3 `equals` rows, each with non-empty `text` —
  the draft has 2. ✅ Catalog caps (`label` ≤ 8 words = 7; `equals.text` ≤ 14 = 3
  and 11; `equals.note` ≤ 12 = 6; `note` ≤ 20 = 14) all met. ✅
- `you-think` caps (`think.text` ≤ 30 = 17; `actually.text` ≤ 30 = 21;
  `note` ≤ 20 = 17) ✅
- `three-steps` caps (3 steps; titles ≤ 6 words = 5/5/4; texts ≤ 25 = 20/20/24) ✅
- `timeline` `annotations[]`: both `at` values (`"2019"`, `"2025 season"`) match
  an event `date` string exactly — required for the annotation to bind. ✅ Both
  ≤ 12 words. ✅ `timeline` is one of the eight kinds RG-20 wired for
  annotations, and it is the only kind in this spine with the slot; no other
  section authors one. ✅
- `skimCaption`: absent everywhere, correct — no `prose` section exists. ✅
- Story beats: `section` indices 0, 2, 4, 5, 7 all resolve, and each beat's text
  matches the section it points at. ✅

---

## Required fixes before publish

1. **Restore the Yoshida-Trail qualification to the two places that state the
   cap without it.** The primer ("Japan sells 4,000 Fuji slots a day") and the
   `you-think` title ("Japan sells 4,000 dated slots a *day*.") both assert the
   cap of Fuji as a whole; dossier §4 attaches it to the Yoshida Trail and
   excludes mountain-hut guests. The section's own `caption` and `actually.text`
   are correct, so the fix is small and costs no words — e.g. the title to
   "Japan sells 4,000 dated slots a *day* on Fuji's main trail." and the primer
   to "Japan sells 4,000 timed Fuji slots a day" (which is the storyboard's own
   primer wording, and does not over-claim because "timed slots" points at the
   booked trail rather than the mountain).

2. **Fix the proposed 7,000 m row — the claim and its source line.**
   (a) The dossier's proposed prerequisite is a 7,000 m peak **in Nepal**, with
   Ama Dablam (6,812 m) and non-Nepal peaks explicitly excluded. Write "a 7,000 m
   Nepali peak climbed first *(proposed)*". (b) Add National Geographic to the
   `comparison` source line — as it stands, the issue's only proposed-rule claim
   is attributed to the Nepal Dept. of Tourism and the Kathmandu Post, neither of
   which is its source (src-02 and src-08 are).

3. **Soften "four steps that only tighten."** Three of the four timeline nodes
   after the scene-setters tighten; the fourth (1 Jul 2026) is the season opening
   under rules already in force — its own note says so. Either retitle to
   something like "The before-picture, then three steps that only *tighten*" and
   adjust the intro's count, or keep four and change the verb ("the four after
   them only hold or tighten; not one loosens").

---

## Optional improvements

- **The `number-sense` caption carries three figures and a date in one
  sentence** (rule 8 caps a sentence at two). Splitting it — "Nepal raised the
  spring Everest permit from $11,000 to $15,000 on 1 September 2025. That is
  about ₹12.5 lakh." — would also let the ₹ land on its own.
- **Tile note antecedent.** "About ₹2,300; double what it was in 2024" reads,
  for half a second, as though ₹2,300 is the thing that doubled. "About ₹2,300;
  the fee doubled from ¥2,000 in 2024" removes the wobble at no word cost.
- **The `you-think` intro's reversal repeats the `note`.** Vary one of them (see
  the voice audit). The `note` is the operator's guard against the queue-skip
  claim and should not be the one that changes.
- **Nirmal Purja's role phrase.** "a climber" is thin for a name used once, and
  the annotation on the same node already carries the point. Either give the
  fuller role or describe rather than name.
- **The Indian habit anchor could be sharper.** "a temple's timed entry, booked
  online in advance" is the storyboard's Tirupati-darshan / IRCTC-tatkal idea
  generalised. Naming one of them would place the issue harder in India at the
  cost of about two words, and both are habits, not claims — no source needed.
- **Conversion date versus publication date.** The §1 and §5 source lines read
  "September 2026" while `publishedAt` is `2026-06-04`. Defensible (the rewrite
  is dated September) but a reader sees a rate dated three months after the
  issue. Consider "at about ₹83 to the dollar" without a month, or a colophon
  note that the issue was revised.
- **Summit elevation.** 8,849 m is a consistent rounding of the dossier's
  8,848.86 m and appears twice. No change needed; carried forward from the June
  report for completeness.
- **src-11 (Syracuse JILC) is now cited by no section.** Fine to leave — the
  storyboard requires all eleven `sources[]` entries to stay — but the
  bibliography is one entry wider than the issue's evidence.
- **Run `npm run check:prose -- 2026-06-04-queue-is-the-product`** before the
  commit. It owns NUMBER-DRIFT (this report cannot diff the previous committed
  version) and has the authoritative name-count heuristic, which is the one
  composition floor this report could only call borderline.
