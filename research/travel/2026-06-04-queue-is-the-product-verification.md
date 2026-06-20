# Verification Report: The Queue Is the *Product*

- **Draft:** src/content/issues/2026-06-04-queue-is-the-product/index.mdx
- **Dossier:** research/travel/2026-06-04-queue-is-the-product-dossier.md
- **Verified:** 2026-06-04
- **Verdict:** NEEDS REVISION

---

## Overall verdict

NEEDS REVISION. The draft is structurally sound and editorially honest: the
operator's chief risk — a paid Everest "priority / skip-the-bottleneck"
tier — is **absent**, the un-enacted Nepal package is labelled "proposed"
everywhere it appears, the enacted Everest facts ($15,000, 75→55 days, 1:2
ratio) are stated as current, and the Fuji figures match the dossier. The
sole verbatim quote (NatGeo crowding line) is reproduced exactly and
attributed correctly to the magazine, not a person. No ❌ UNTRACED claims
and no ❌ ADVOCACY were found, so this is not BLOCKED/REJECT.

What holds it back from APPROVED are ⚠️-level issues that are fixable
without new research: two `# EDITOR:` flags remain live in published-facing
`note` text (they ship as visible copy if not resolved), the Fuji
season-length figure differs between the draft and the dossier's suggested
tile (the draft dropped the 72-day count, which is fine, but the dossier
needs no action), one number is presented as a hard fact where the dossier
marks it conflicting (the annual-climber range — handled correctly as a
range in prose, see note), and a handful of voice/tell items. None of these
require returning to research. Resolve the items in "Required fixes" and the
issue is publishable.

---

## High-risk operator checks (explicit)

| Operator check | Result | Evidence |
|---|---|---|
| NO paid Everest "priority / skip-the-bottleneck / fast-track" tier asserted anywhere | ✅ PASS | Full-text scan of all sections: no sentence implies a queue-skip surcharge. The comparison row "What it prices → Position in the summit-window queue" describes the *effect of the base royalty + 55-day window*, not a paid priority product. The paradox line "Everest's $15,000 prices entry to a line…" refers to the base royalty. Hook leads on "the bottleneck itself," not a fast-track. Clean. |
| Un-enacted Nepal package labelled "proposed" everywhere | ✅ PASS | 7,000 m prerequisite: comparison row tagged `*(proposed)*` (L124); timeline node "still in committee" + "remain proposed, not enacted" (L161–162). Nepali-only guides / garbage fee / body-recovery insurance: timeline L162 lists them as "proposed, not enacted"; body-recovery insurance in the data-readout note explicitly "PROPOSED … not enacted" (L70). No proposed item is stated as current law. |
| Only enacted Everest facts stated as current ($15,000; 75→55 days; 1:2 ratio) | ✅ PASS | $15,000 (L55–58, dossier §4 L107–109); 55 days "cut from 75" (L62–63, dossier L114); 1:2 ratio (L64–66, dossier L115–117). All three match the VERIFIED block exactly. |
| Fuji figures match dossier (4,000/day; ¥4,000; 14:00–03:00; 1 Jul–10 Sep) | ✅ PASS | 4,000/day (L82, dossier L145); ¥4,000 (L87, dossier L147); gate "14:00–03:00" / "2 PM – 3 AM" (L92, L122, dossier L149); season "1 Jul – 10 Sep" (L93, dossier L152). All match. |
| Fuji reservation split (3,000/1,000) + 27 Apr date absent or `# EDITOR:`-flagged | ✅ PASS | Neither the 3,000/1,000 split nor the 27 April reservation-open date appears anywhere in the draft. Correctly omitted (both are [UNVERIFIED] per dossier §4 L188–193). |
| Annual-climber figure is a range | ✅ PASS | "somewhere between roughly 220,000 and 400,000 climbers a year" (L29). Matches the dossier's prescribed range treatment (§4 L194–198, §9 L458–459). |
| NatGeo crowding/deaths framing attributed | ✅ PASS | Crowding quote attributed "National Geographic put it plainly" (L28); the 5-of-11 deaths handled as "Alan Arnette later worked out that as many as five…may have been crowd-related" (L27) — narration form, not a quote attributed to Arnette, exactly per dossier §5 L233–237. |

All seven explicit operator checks pass. No REJECT-level issue exists.

---

## Claim verification

| Claim | Location | Status | Note |
|---|---|---|---|
| Nirmal Purja shot the line on the summit ridge, May 2019 | prose §1 · paragraphs[0] | ✅ | Dossier §3 (2019-05-22/23), §4 L124 |
| Eleven climbers died that season | prose §1 · paragraphs[0]; timeline | ✅ | Dossier §4 L124 "2019: 11 deaths" |
| Arnette: as many as five of eleven deaths may be crowd-related | prose §1 · paragraphs[0]; timeline | ✅ | Dossier §4 L124, §5 L233–237. Narration form preserved — correct. |
| Death zone above ~7,950 m | prose §1 · paragraphs[0]; elevation-trek | ✅ | Dossier §4 L138–141 (~7,950 m / South Col) |
| ~3 days to make a summit bid before the body fails | prose §1 · paragraphs[0]; elevation-trek intro | ✅ | Dossier §4 L139 "~3 days max" |
| NatGeo crowding quote (verbatim) | prose §1 · paragraphs[1]; src-01 | ✅ | Char-by-char match to dossier §5 L207–210 and src-01 `quote`. See verbatim note below. |
| Fuji 3,776 m | prose §1; comparison tag; data-readout context | ✅ | Dossier §4 L162 |
| Fuji ~220,000–400,000 climbers/year (range) | prose §1 · paragraphs[2] | ✅ | Dossier §4 L194–198 (conflicting → range). Correctly hedged. |
| Base Camp 5,364 m | elevation-trek · points | ✅ | Dossier §4 L136 |
| Camp 1 6,065 m | elevation-trek · points | ✅ | Dossier §4 L136 |
| Camp 2 / Western Cwm 6,400 m | elevation-trek · points | ✅ | Dossier §4 L136 |
| Camp 3 / Lhotse Face 7,162 m | elevation-trek · points | ✅ | Dossier §4 L136 |
| Camp 4 / South Col 7,950 m — death zone begins | elevation-trek · points | ✅ | Dossier §4 L136, L138–141 |
| Bottleneck / Hillary Step 8,790 m | elevation-trek · points | ⚠️ IMPRECISE | Dossier suggests `elevM: 8790` for this waypoint (§7 L291) — matches. But the dossier's prose calls it "Hillary Step / Balcony zone, ~28,000 ft" (~8,534 m); 8,790 m is an interpolated profile point, not a verified Hillary Step altitude. The intro/source already labels distances "illustrative" and elevations "verified," which slightly overstates: 8,790 m for this node is illustrative too. Minor — see optional fix. |
| Summit 8,849 m | elevation-trek · points; comparison tag | ⚠️ IMPRECISE | Dossier gives summit as **8,848.86 m** (§4 L137) / "8,849 m" rounded in §7 L292. Draft uses 8,849 (point) and "8,849 m" (comparison tag L107). Consistent rounding, traces to dossier. Acceptable; flag only that the canonical figure is 8,848.86 m. |
| Enforcement began 1 September 2025 | data-readout §3 intro; timeline | ✅ | Dossier §2 L52, §4 L120, §3 (2025-09-01) |
| First royalty revision since 2015 | data-readout §3 intro + tile note | ✅ | Dossier §4 L107–109 |
| Sixth amendment to Mountaineering (Expedition) Regulation 2002 | data-readout §3 intro | ✅ | Dossier §4 L118–120 |
| Spring permit royalty $15,000, up from $11,000 | data-readout §3 · tiles[0] | ✅ | Dossier §4 L107–109 |
| Permit validity 55 days, cut from 75 | data-readout §3 · tiles[1] | ✅ | Dossier §4 L114 |
| Mandatory guide ratio 1:2 on 8,000 m peaks; under-enforced | data-readout §3 · tiles[2] | ✅ | Dossier §4 L115–117 |
| Body-recovery cost $30,000–$70,000 | data-readout §3 · tiles[3] | ✅ | Dossier §4 L126–127. Note correctly flags insurance as PROPOSED. |
| Yamanashi 2026 notice retains cap/fee/gate | data-readout §5 intro | ✅ | Dossier §6 L245–246 |
| Fuji daily cap 4,000/day (excl. hut guests) | data-readout §5 · tiles[0] | ✅ | Dossier §4 L145 |
| Fuji fee ¥4,000 (≈US$25), doubled from ¥2,000 in 2025 | data-readout §5 · tiles[1] | ✅ | Dossier §4 L147, L160, L165 |
| Gate closes 2 PM, shut 14:00–03:00; hut guests exempt | data-readout §5 · tiles[2] | ✅ | Dossier §4 L149–151 |
| Season 1 Jul – 10 Sep; access prohibited before late June | data-readout §5 · tiles[3] | ✅ | Dossier §4 L152–153 ("until ~30 June (tentative)") |
| Comparison: $15,000 spring / ¥4,000 (≈$25) | comparison · rows | ✅ | Dossier §4 / §7 L334 |
| Comparison: no explicit daily cap (Nepal) / 4,000/day (Japan) | comparison · rows | ✅ | Dossier §7 L335 |
| Comparison: equipment check at the 5th station | comparison · rows; paradox context | ✅ | Dossier §4 L156–157 |
| Mount Fuji inscribed by UNESCO 2013 (dwelling place of the gods) | timeline (2013) | ✅ | Dossier §4 L163–164, §3 L81 ("home of *kami*") |
| Fuji first quota 1 Jul 2024: 4,000/day, ¥2,000, gate 16:00–03:00 | timeline (Jul 1 2024) | ✅ | Dossier §4 L158–159, §3 L86 |
| Nepal 6th amendment: Cabinet 8 Jan 2025; Gazette 3 Feb 2025 | timeline (Jan–Feb 2025) | ✅ | Dossier §4 L118–120, §3 L87–88 |
| 2025 season: fee → ¥4,000, gate → 14:00, extended to all four trails | timeline (2025 season) | ✅ | Dossier §4 L160–161, §3 L89 |
| Nepal enforces royalty 1 Sep 2025 ($11k→$15k; 75→55; 1:2) | timeline (Sep 1 2025) | ✅ | Dossier §4 L107–120, §3 L90 |
| Wider Nepal bill still in committee (7,000 m, Nepali-only, garbage fee, body-recovery insurance) | timeline (2025–26) | ✅ | Dossier §4 L177–187, §3 L91. Correctly labelled proposed. |
| Fuji 2026 season opens 1 Jul 2026 under cap/fee/reservation/gate | timeline (Jul 1 2026) | ✅ | Dossier §3 L94, §4 L152 |
| Paradox: overnight "bullet climbing" banned; gate metered | paradox · sides | ✅ | Dossier §1 L37, §4 L149–151 |
| Paradox: analysts have linked the Everest line to deaths | paradox · sides[1] detail | ✅ | Dossier §4 L124, §5 L207–210 (Arnette + NatGeo). "Analysts" is a fair generalisation of Arnette + NatGeo narration. |
| "Reserved, timed slot booked online" (Fuji, in primer + comparison) | primer; comparison row | ✅ | Dossier §1 L35–37, §4 L147–148 ("advance-booking system"). The *existence* of online advance reservation is verified; only the 3,000/1,000 split + open date are [UNVERIFIED], and both are absent. Clean. |

No ❌ UNTRACED claims. No [UNVERIFIED] dossier item used without a flag
(the two flagged items — body-recovery insurance, bill un-enacted status —
both carry `# EDITOR:` notes; see Required fixes for resolving the flags
themselves).

### Verbatim quote check

Draft (L28), inside the prose paragraph:
> "If the crowds aren't directly culpable for killing people, they are
> unquestionably responsible for increasing the risks by necessitating longer
> summit days—indelibly changing the dynamic of climbing Everest."

Dossier §5 (L207–210) and src-01 `quote` (L191): **identical**,
character-for-character, including the em-dash before "indelibly" and the
plain apostrophe in "aren't." Attribution "National Geographic put it
plainly" matches the dossier's instruction to attribute to the magazine,
not a person (§5 L211). ✅ VERIFIED verbatim.

(One cosmetic note: the draft prose body in `paragraphs[1]` uses a curly
apostrophe `aren’t` while the `sources[].quote` field uses a straight
`aren't`. Both render fine; not a deviation in wording. Optional to
normalise.)

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| "Here's the thing:" — conversational filler opener | comparison §6 · intro (L101) | ⚠️ CONVERSATIONAL FILLER | Drop "Here's the thing:" and lead straight into "Nepal and Japan ended up in the same place…". The crutch reads as a blog tic, below the delimitation benchmark's register. |
| "That is the point." — meta-commentary closer telling the reader the takeaway | paradox §8 · intro (L172) | ⚠️ META-COMMENTARY | Cut the final "That is the point." The preceding sentence ("The waiting was the danger; pricing it was the cure.") already lands it; the tag tells rather than shows. |
| "Notice what that does to the usual story." — instructional address | prose §1 · paragraphs[1] (L28) | ⚠️ META-COMMENTARY (mild) | Acceptable as a CONVERSATIONAL EXPLAINER turn, but borders on telling the reader how to read. Consider "The usual story inverts:" or fold into the next sentence. Not a blocker. |
| "Start with the photograph." + "Now look at Mount Fuji" + "Notice what that does" — three imperative reader-instructions in one section | prose §1 (L26–29) | ⚠️ PASSIVE/INSTRUCTIONAL DENSITY | Three "look/notice/start" imperatives in one prose block is one more than the voice wants. Keep "Start with the photograph"; soften one of the other two. |
| "Read the headlines and it looks like…" lead | prose §1 · lead (L25) | ✅ (no action) | This is the sanctioned Parallax "you think you understand" move (cf. delimitation primer). Keep. |

No ❌ ADVOCACY found. The draft never says the fees are unjust, never sides
with climbers or governments, and frames the safety/pricing trade-off as an
"honest tension" (paradox) rather than taking a position — consistent with
the structural, non-editorial voice. No ❌ WIRE TONE, no ❌ SPECULATION
(every forward-looking line — "the crowd is now inventory" — is grounded in
the enacted 2026 regime, not invented consequence). No rhetorical-question
closers.

AI-tell catalog (per AGENTS.md §6):
- **Em-dashes:** Max 1 per paragraph. ✅ Checked every prose/intro/detail
  field — no paragraph exceeds one em-dash. (The NatGeo quote's em-dash is
  inside a verbatim quotation and does not count against the author.)
- **"It is not X. It is Y." binary:** Used once — "The danger was never
  simply the altitude. It was the time spent waiting in it." (L28) and a
  near-twin "It is not a death-zone mountain, but…" / "the scarce good… is
  no longer the summit. It is the bottleneck" (L25). ⚠️ This binary reframe
  appears **2–3 times** (lead L25, prose L28, and echoed in the hook). The
  rule is **max 1 per issue, only if it is the structural argument**. It
  *is* the structural argument here, so one instance is earned — but trim
  the repeats. See Required fix #3.
- **Triple-fragment close:** None found. ✅
- **Abstract-noun labels ("the mechanism," "rhetorical work"):** None in
  the prose. ✅ (The dossier uses "the mechanism" but the draft does not.)
- **"First… Second… Third…" manifesto rhythm:** None. ✅

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ | Line 8: `status: draft` |
| All section kinds registered | ✅ | prose, elevation-trek, data-readout, comparison, timeline, paradox — all in `SECTION_KINDS` (config.ts L7–76; `elevation-trek` L66). Dispatched in SectionRenderer (ElevationTrek import L58). No explicit `hero` section is expected — frontmatter title/dek/hook drives the IssueLayout hero, same pattern as the published delimitation issue. |
| No author field | ✅ | No `author:` key in frontmatter. |
| publishedAt valid | ✅ | `2026-06-04` — real date, parses as `z.date()`. |
| Source URLs https:// | ✅ | All 11 sources (src-01…src-11) use `https://`. |
| Source kinds valid | ✅ | All `kind` values are `primary` / `secondary` / `analysis`. (src-03 Kathmandu Post = primary; src-04/05 fujisan-climb.jp = primary; src-07/08/11 = analysis; rest secondary.) |
| ≥6 sources | ✅ | 11 sources. |

Additional schema notes (not failures):
- **primer length:** 458 characters (lines 17). **This OVERSHOOTS the Zod
  `max(420)` limit and will fail `npm run build`.** See Required fix #1 —
  this is the one hard build-blocker.
- **sourceRefs:** No section in the draft declares a `sourceRefs[]` array;
  each section instead carries an inline `data.source` string. The schema
  defaults `sourceRefs` to `[]`, so this builds — but it means the
  per-section source attribution is free text, not validated against
  `sources[].id`. Consistent with the delimitation issue's pattern (which
  also uses inline `source`/`attribution` strings in `data`), so this is
  acceptable house style, not a defect. The `sources[]` block (src-01…11)
  is what feeds the Sources component.

---

## Required fixes before publish

1. **Primer exceeds the 420-char Zod limit (build-blocker).** The `primer`
   field (L17) is ~458 characters and will fail `npm run build` at the
   `z.string().min(80).max(420)` check. Trim ~40 characters. Suggested cut:
   the last sentence "Here is what happens when a country starts selling the
   queue." (−56 chars) lands it under the limit, or tighten "each holding a
   timed, paid, reserved slot booked online" → "each holding a timed, paid
   slot." This is the only hard blocker.

2. **Resolve the two live `# EDITOR:` flags — they ship as visible copy.**
   Both are inside `note` fields that render to readers:
   - data-readout §3, tiles[3] note (L70): ends with
     `# EDITOR: body-recovery insurance is PROPOSED … not enacted — the
     $30k–70k cost itself is verified (NatGeo)`. The editorial point is
     already handled in the prose of the note ("a proposed body-recovery
     insurance rule would price"); **delete the `# EDITOR:` sentence** so it
     doesn't appear on the page.
   - timeline node "2025–26" note (L162): ends with
     `# EDITOR: confirm this bill is still un-enacted at publish time …`.
     **Confirm the bill's status as of 2026-06-04 and delete the flag.** The
     dossier's last datapoint is 3 Sep 2025; verify nothing enacted it in
     the intervening nine months, then strip the comment.

   (Action: search the file for `# EDITOR:` and ensure zero remain before
   flipping status. Per AGENTS.md §8 item 9, unverified claims must carry
   flags *in review*; published copy must not.)

3. **Trim the "no longer the summit / it is the bottleneck" binary to one
   instance.** The "It is not X, it is Y" structural reframe appears in the
   hook (L5), the §1 lead (L25), and §1 paragraph 2 (L28). It is the issue's
   real structural argument, so keep **one** load-bearing statement (the §1
   lead is the strongest) and rephrase the echoes so the device doesn't
   repeat three times. Per the AI-tell rule: max 1 per issue.

4. **Remove the two soft openers/closers flagged in the voice audit:**
   "Here's the thing:" (comparison intro, L101) and the trailing "That is
   the point." (paradox intro, L172). Both are below the publication's
   register and add nothing the surrounding sentences don't already carry.

---

## Optional improvements

- **Elevation-trek source line precision.** The intro says "Camp elevations
  are verified; the trail distances are illustrative" (L34) and the source
  line says "death-zone altitude corroborated by National Geographic"
  (L38). The 8,790 m value on the "bottleneck / Hillary Step" node is itself
  an illustrative profile point (the dossier's prose places the Hillary
  Step/Balcony nearer ~8,534 m / ~28,000 ft), not a verified Hillary Step
  altitude. Consider softening the label to "summit ridge / bottleneck" and
  dropping the specific "Hillary Step" altitude implication, or add "(profile
  point)" so the one interpolated elevation isn't read as surveyed.

- **Summit elevation canonical figure.** Draft uses 8,849 m (point label)
  and "8,849 m" (comparison tag). The dossier's precise figure is
  8,848.86 m. Rounding to 8,849 is fine and internally consistent; no change
  needed unless you want the exact figure somewhere once.

- **Apostrophe normalisation.** The NatGeo quote renders with a curly
  apostrophe in the prose body (L28, `aren’t`) and a straight apostrophe in
  the `sources[].quote` field (L191, `aren't`). Cosmetic only; normalise to
  one style if you care about copy consistency. Not a verbatim deviation —
  the words are identical.

- **"Notice what that does to the usual story." / imperative density.**
  Three reader-instructions ("Start with the photograph," "Now look at Mount
  Fuji," "Notice what that does") cluster in §1. Softening one would tighten
  the explainer voice toward the delimitation benchmark, but this is taste,
  not a defect.
