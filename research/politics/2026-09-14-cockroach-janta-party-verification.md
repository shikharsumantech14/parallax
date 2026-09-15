# Verification Report: The account was *hidden* in India, nowhere else

- **Draft:** src/content/issues/2026-06-04-cockroach-janta-party/index.mdx
- **Dossier:** research/politics/2026-06-04-cockroach-janta-party-dossier.md
- **Storyboard:** research/politics/2026-09-14-cockroach-janta-party-storyboard.md (`Status: approved`)
- **Prior verification:** research/politics/2026-06-04-cockroach-janta-party-verification.md (APPROVED)
- **Verified:** 2026-09-15
- **Verdict:** NEEDS REVISION

---

## Overall verdict

**NEEDS REVISION — with nothing wrong at the level of fact.** All five standing
guardrails hold. Every claim traces. There are **zero ❌ flags**: no untraced
claim, no advocacy, no speculation, no non-quotable quote, no Hindi, no
opposition quote, no "109 million", no genocide analogy, no satirical beat, and
the retired "made it bigger" / "steepest stretch" reading appears nowhere,
including in the EDITOR block. Both verbatim texts are character-exact against
dossier §5 and travel as a matched pair on one card, with nothing after the
clarification. The two authorised unit conversions are arithmetically correct.
Every one of the three surviving `adoption-curve` points is sourced, and I
confirmed against the component that the 21 May milestone renders **no pin on
the line**, so it asserts no value — exactly as the EDITOR block claims.

What holds it back is a short list of small, local ⚠️ items, none needing new
research. Three sections carry a `source` line that names an outlet the section
does not cite (or omits one it does). One `three-steps` sentence hardens a
qualifier in a way its own third step then contradicts. One timeline annotation
sharpens "not on record today" into "never saw". The head is four words over the
storyboard's own budget, which puts the issue exactly on the 80-word
pre-graphic ceiling with zero headroom and at or fractionally over the 1,100-word
ceiling. And one `power-matrix` cell — the one the operator asked me to rule on
— asserts a capability the record does not place with that actor. That last item
is a judgement call, flagged and not fixed, per the brief.

One structural note that is **not fixable inside a rewrite** and is therefore
recorded for the operator rather than listed as a fix: all ten sources are T4
journalism, and `_TAXONOMY.md` §1 says in terms that T4 is "not the primary
anchor". See ⚠️ NO PRIMARY ANCHOR below, which also records a stale assertion in
the dossier that the next research pass should correct.

---

## The five standing guardrails

| # | Guardrail | Result | Evidence |
|---|---|---|---|
| 1 | CJI remark + 16 May clarification, both verbatim, matched pair, nothing added after, nothing sharpened | ✅ **PASS** | Both compared character for character against dossier §5. Remark = 51 words, identical. Clarification = 68 words, identical **except** the bracketed gloss "(legal profession)" after "the Bar" — the same omission the 2026-06-04 confirmation pass examined and ruled cosmetic (it is The Wire's lay-reader insertion, not the CJI's spoken words). The storyboard's own 68-word budget was computed on the draft's exact form, so this is carried, not newly introduced. `data.followup` ends at the closing quote; nothing follows. Framing is 8 words, "he clarified:" — a neutral attributive verb and a colon before a quoted line, both permitted. `SectionBody` renders `Quote` and the `followup` paragraph as siblings inside one section, so they cannot be separated. Attribution is 12 words and precise. |
| 2 | Only the X account formally withheld under §69A on 21 May; website + Instagram founder-reported | ✅ **PASS** | Held at **four** sites, none of which collapses it. §1 `note`: "The order covered one account on X. The website and Instagram losses are founder-reported." §3 timeline 23 May label: "**The founder says** the website and his handles are gone." §3 annotation on the 21 May row: "One account, one country. The only formal order on the record." §8 tile 2 `note`: "The X account, 21 May 2026. Website + Instagram losses are founder-reported." Wording is now consistent ("founder-reported" in both notes, replacing the published "founder-attributed"). I verified the 21 May annotation **renders**: `Timeline.astro` matches `a.at` against `e.date` by exact string, and `"21 May 2026"` matches. Head, hook, dek and primer each refer to one order and one account. No sentence anywhere asserts a government order against the website or Instagram. |
| 3 | No opposition quotes — Tharoor, Singhar, Yogendra Yadav, in quotation or paraphrase | ✅ **PASS** | Grep-clean. All three names appear only inside the `# EDITOR NOTES` comment recording their exclusion. No political reaction of any kind appears in the issue — not quoted, not paraphrased, not alluded to. Sibal and Mehta: zero hits anywhere (the `paradox` that paraphrased Sibal is cut, which also retires the prior report's "name Sibal" improvement). |
| 4 | "109 million" discarded as an extraction artifact | ✅ **PASS** | Grep-clean in every reader-facing field. The only occurrence is the EDITOR block recording the exclusion. The follower figure is a dated range wherever it is stated with precision: `~20–22M` in §5 `value` and §8 tile 1, `"A dated range, not a fixed count"` in §5 `note`. The head's "2 crore" / "twenty million … crossed" states the **floor** of the range in round terms, which src-08 and src-10 carry verbatim as "crossed 20M in less than a week". Not a hardening. |
| 5 | No genocide-rhetoric historical analogy | ✅ **PASS** | No historical comparison of any kind appears. No `analogy` section (declined in storyboard §8d partly on this ground). The flagged Wire opinion piece is neither cited nor echoed. The epithet itself appears **exactly once**, inside `data.quote`; every other occurrence of "Cockroach" is the outfit's proper name or a source title. The head, timeline and all captions avoid the word. |

---

## Rulings on the six points

### 1. The two authorised unit conversions — arithmetic ✅, both correct

- **"2 crore followers in a week"** (hook). 2 crore = 2 × 10⁷ = 20,000,000 = twenty
  million. ✅ **Correct.** The dek directly below carries "Twenty million followers
  in a week", so the crore sits beside the published form rather than replacing
  it, exactly as the brief describes. The storyboard placed the crore in the dek
  and tile label rather than the hook; the move to the hook is the authorised
  variation and it is the stronger placement (the hook is the field the contract
  requires to carry a number the reader can feel).
- **"1.6 to 2 lakh followers in a day"** (§6 annotation). 1.6 lakh = 160,000;
  2 lakh = 200,000. ✅ **Correct.** Traced directly to **dossier §4**: the backup
  handle "'Cockroach is Back' on X gained ~160,000–202,000 followers in a day",
  sourced to ThePrint/PTI (**src-09**) and ThePrint (**src-10**). §6 carries
  src-09 in its `sourceRefs`, so the claim is backed inside its own section.
  Rounding 202,000 down to "2 lakh" is conservative and matches the band the
  storyboard (§5 derivation 2, §8e) and the prior verification both used. The
  annotation is 12 words, at the cap.
- **Neither is Hindi.** `hinglish-lexicon.md` §"Units and numbers (English,
  always)" lists ₹, lakh and crore as English units, and `_voice-core.md` §2 makes
  them the Indian anchor. No HINDI-FIELD issue in an annotation.

### 2. The altered `adoption-curve` — every surviving point sourced ✅; the 21 May milestone asserts no value ✅

| Point | Reads as | Source |
|---|---|---|
| `{516, 0}` | 16 May, 0 followers | Dossier §3 — CJP founded 16 May 2026 ✅ |
| `{522, 93}` | 22 May, 93% of the ~22M peak ≈ **20.5M** | Dossier §4 / §4a — ThePrint/CTC, ~20.5M Instagram, **22 May** (src-07) ✅ |
| `{523, 100}` | 23 May, 100% of ~22M ≈ **21.9M** | Dossier §4a — ThePrint/PTI, ~21.9M Instagram, **23 May** (src-09) ✅ |

**All three sourced. The interpolated 518 and 519 and the 520 point are gone, and
the 93% point is re-dated 521 → 522.** Arithmetic checks: 93% × 22M = 20.46M ≈
20.5M; 100% × 22M ≈ 21.9M. Both consistent with the caption's "~22M peak".

**The 21 May milestone asserts no value — confirmed against the component, not
assumed.** `AdoptionCurve.astro` resolves a milestone with
`idxForYear(m.year) = points.findIndex(p => p.year === yr)` and then
`if (i < 0) return null`. There is no point with `year: 521`, so the pin returns
`null` and **nothing is drawn on the line**. The milestone strip below the chart
(`adc__milestones`) maps over `milestones` with no index check, so
"521 · 21 May · the block · already near the peak" still reads there. The EDITOR
block's description is exactly right.

I also confirmed **both annotations render**, which was worth checking because a
mismatch is a silent no-op: `at: 522` resolves to point index 1; the second
annotation's string matches the 23 May milestone label verbatim and resolves to
index 2 (and its `side: above` auto-flips to `below` at the 100% mark, then
right-anchors inside the viewBox). Neither is lost.

Two inherited rendering limits worth knowing, neither introduced by this rewrite
— see ⚠️ CURVE-AXIS below.

### 3. The weakened claim — supported ✅; the old one is nowhere ✅

The new claim is carried in three places and each is supported:

- §6 title "The order arrived near the *top*" — supported. Dossier §3's 21 May
  row reports Instagram at ~20.5M with ~21M projected by end of day, against a
  ~21.9M peek two days later. On either the §3 (21 May) or §4/§4a (22 May) dating
  of the ~20.5M figure, the account was near its peak when the order went out.
- §6 annotation "The 21 May order arrived with the account already near its peak."
  — same basis. "Near its peak" is a level claim, which is the only claim three
  sourced observations can carry.
- §6 annotation 2 "A backup handle drew 1.6 to 2 lakh followers in a day." — the
  demonstrable product, dossier §4.

**The old claim is absent.** Grep for "bigger" and "steepest": **zero hits
anywhere in the file, including the comment block.** The title no longer says
"made it bigger". "A ban is also a billboard", "certify" and "billboard" are all
grep-clean — the two most editorial lines in the published issue are gone with
the cut `paradox`. "Intermediary" is likewise gone, replaced by "the platform"
(storyboard §8c.6).

One dossier inconsistency the operator should know about, which does **not**
change the verdict: **dossier §3's timeline row dates the ~20.5M figure to
21 May**, while §4 and §4a date it to 22 May. The storyboard ruled for §4/§4a
(the verification ledger, the more authoritative section) and the draft followed.
That is the right call, but it means the published `521` dating was not
groundless either. Recording it so a future pass does not "correct" it back.

### 4. The `power-matrix` hero — one filled executive cell ✅; the "copies" row is a ⚠️ and my ruling is that the cell should be empty

**The executive's column has exactly one filled cell. ✅** Read against the
component: `PowerMatrix.astro` renders a glyph in **every** cell, defaulting any
cell absent from `cells[]` to `control: 'none'` (○, no background). The
executive appears in `cells[]` once — `{ "Hide it inside India", exec, full }` —
so its column reads ● ○ ○ ○ ○. Guardrail 5 holds at the render, not just in the
YAML.

The other filled cells all trace: courts `partial` and platforms `partial` on
"Hide it inside India" (the HC can order restoration and declined interim relief,
dossier §3/§4; X is the actor that technically withholds under compulsion,
dossier §1); platforms `full` on "Delete the account" and "Reach the servers"
(dossier §1 — the order "cannot delete the account, cannot reach the servers");
the account `full` on "Stop a backup handle" (dossier §1 "cannot stop the same
content reappearing on a backup handle", and §4 records the backup handle doing
exactly that).

**On "Reach copies readers kept" → account `full`: this is a judgement call, and
my ruling is that the cell should be empty.** Reasons, in order:

1. **The component's own legend defines the semantics.** It renders "● Full
   control · ◐ Partial / contested · ○ None", and the authored `plain` says "a
   filled cell where that actor holds the lever". So `full` reads, unambiguously,
   as *this actor controls this lever*.
2. **Nobody holds this lever, and the account least of all.** A reader's
   screenshot sits on the reader's phone. The account cannot delete it, retrieve
   it or reach it — it has no more access than MeitY does. The relabelling to
   "copies **readers** kept" is what makes this visible; under the old label the
   ambiguity hid it.
3. **The dossier names no holder.** §1 says the order "cannot touch the followers
   who already screenshotted every post" — a statement about the *order's* limit,
   with no actor on the other side of it. The published `comparison` cell the
   enum replaced was "**They kept the screenshots**", which the prior verification
   called "a structural inference phrased as an assertion". The enum translation
   moved a fact about *readers* into a claim about the *account's* control.
4. **An all-○ row is the strongest row in the grid, not a hole.** One lever that
   nobody at all can pull is precisely why a territorial order cannot recall a
   post. Filling it weakens the argument by making the row look like a transfer
   of power rather than a limit on all power.

**Consequential edit if the operator takes the ruling:** the caption's second
sentence, "The rest sit with the platforms or the account", becomes false and
needs to account for a lever nobody holds.

**Why this is ⚠️ and not ❌:** it is an interpretive translation of a sourced
structural point, the storyboard consciously authorised the enum translation
(§8a), and the prior report had already characterised the source cell as an
inference. It does not block. But it is the one cell in the grid that locates a
capability the record does not locate, and that is the exact failure mode
guardrail 5 exists to prevent — so it should be settled before commit, not after.

### 5. The IT Blocking Rules, 2009 — traced ✅, and the swap is the better move

§4 `jargon-buster`, term 2: *"Section 69A — The blocking power in the Information
Technology Act, 2000. The steps for using it are in the Blocking Rules, 2009."*

**Traced** to dossier §9.2 ("the *procedure* governed by the **IT (Procedure and
Safeguards for Blocking) Rules, 2009**"), §3 (the 2015 row: *Shreya Singhal*
"upholds §69A and the IT (Blocking) Rules, 2009"), §6 (the mechanism backbone)
and §4 (the Review Committee sits under Rule 14 of those Rules). The short form
"the Blocking Rules, 2009" is a compression of the statutory title, not a
different instrument. ✅

Two things worth saying about the swap:

- **The negative is gone and nothing is lost.** The published "It is not the IT
  Rules of 2021; that is a separate, parallel takedown track" no longer appears —
  and neither does "IT Rules 2021" anywhere else, so there is no conflation for
  the dossier §9.2 warning to catch. The prior report's mandatory check 2 (§69A
  IT Act 2000 + 2009 procedure, never IT Rules 2021) **passes more cleanly than
  before**: the reader now learns what the procedure *is* rather than what it is
  not.
- **It also protects the once-per-issue reframe.** Keeping both "Withheld is not
  deleted" and "Section 69A is not the 2021 rules" in the same three-term card
  would have put two binary reframes side by side, against tells 2 and 19.

### 6. The 7 July hearing — ✅ PASS, nothing reads as falsely upcoming

Nothing in the issue tells a reader arriving on 15 September that a past hearing
is still ahead:

- The event carries its own explicit date, **"7 Jul 2026"**, on a timeline whose
  `state: now` marker sits on the **29 May** row. "Next hearing" is relative to
  that marker, not to the reader's calendar.
- The **tile was dropped** (storyboard ruling 5), so 7 Jul no longer appears as a
  standalone telemetry figure — which is the form that *would* have read as live,
  because a `data-readout` tile carries no timeline context.
- The draft adds **no claim about what happened** on 7 July, correctly: that
  would need a source the rewrite may not add.
- Head, hook, dek and primer make no forward-looking claim at all.

One low-severity wording note is at ⚠️ TEMPORAL-NOW below.

---

## Claim verification

Component `data` values are traced as claims, per Step 2.

| Claim | Location | Status | Note |
|---|---|---|---|
| Account went dark in India on 21 May 2026 and in no other country | §1 `caption` | ✅ VERIFIED | Dossier §3/§4 — MeitY orders X to withhold **in India** under §69A, 21 May. India-only reach is the instrument's own limit (§1). A DATA claim in a caption, correctly. |
| The order covered one account on X; website + Instagram founder-reported | §1 `data.note` | ✅ VERIFIED | Dossier §9.6. Guardrail-2 site 1. |
| Order reached 1 country; every post still visible outside India | §1 `actually.value` / `.text` | ✅ VERIFIED | Dossier §1 — withholding is territorial; servers and account are US-domiciled. Scoped to "the order", with the `note` immediately below carrying the 23 May distinction. |
| "A ban took the account down…" | §1 `think.text` | n/a | The belief panel, labelled "What most people think". Not a traceable assertion by design. |
| CJI remark, 51 words | §2 `data.quote` | ✅ VERIFIED | Character-exact vs dossier §5 / src-01. |
| Surya Kant · open court · 15 May 2026 | §2 `data.attribution` | ✅ VERIFIED | Dossier §4 — sitting CJI, oral remark, open court, 15 May. |
| 16 May clarification, 68 words | §2 `data.followup` | ✅ VERIFIED | Character-exact vs dossier §5 **except** "(legal profession)", the standing cosmetic residual ruled on 2026-06-04. |
| Name came from the judge's remark, in open court | §2 `intro` | ✅ VERIFIED | Dossier §3 — CJP founded 16 May as satirical response; §4 — name puns on BJP. |
| 15 May 2026 was a **Friday** | §3 `intro` | ✅ VERIFIED | Dossier §3 — "Fri 15 May". |
| 15 May · oral observation in open court | §3 event 1 | ✅ VERIFIED | Dossier §3/§4. |
| 16 May · CJP founded; pun on the Bharatiya Janata Party; founder in Boston | §3 event 2 + note | ✅ VERIFIED | Dossier §4 (name origin), §9.3 (Boston-based at launch). Does not reduce him to "a student" — prior check 5 holds. Name dropped, see ⚠️ NAMES-DROPPED. |
| 21 May · account disappears inside India; ordered by the IT ministry on Intelligence Bureau inputs | §3 event 3 + note | ✅ VERIFIED | Dossier §3/§4 — MeitY on IB inputs. Stated ground not used, see optional note. |
| 23 May · **the founder says** the website and his handles are gone | §3 event 4 | ✅ VERIFIED | Dossier §3/§9.6. Attribution preserved. |
| 29 May · Delhi High Court refuses to restore it; block goes to the ministry's own review committee | §3 event 5 + note | ✅ VERIFIED | Dossier §3/§4 — no interim relief, referred to the MeitY Review Committee. |
| 7 Jul 2026 · next hearing | §3 event 6 | ✅ VERIFIED | Dossier §2/§3. |
| "One account, one country. The only formal order on the record." | §3 annotation @ 21 May | ✅ VERIFIED | Dossier §9.6. Renders — `at` matches `e.date` exactly. |
| "The court was asked to weigh an order it never saw." | §3 annotation @ 29 May | ⚠️ IMPRECISE | Dossier §5 — Kaurav: "Blocking order is **not on record today**. There is only communication." "Never saw" hardens a dated, provisional statement into a permanent negative; dossier §4 records the court also observing the platform "cannot keep it confidential from court", which implies the opposite of "never". See required fix 4. |
| Fourteen days, 15 May → 29 May | §3 `eyebrow` + `caption` | ✅ VERIFIED | 15 → 29 May = 14 days. The prior report's required fix 2, preserved intact. |
| Withheld ≠ deleted: the post is still there, the phone may not fetch it | §4 term 1 | ✅ VERIFIED | Dossier §1 — withhold inside India, cannot delete. The single sanctioned binary reframe. |
| §69A is the blocking power in the IT Act, 2000; procedure in the Blocking Rules, 2009 | §4 term 2 | ✅ VERIFIED | Dossier §9.2, §3 (2015 row), §6. |
| "Not on record" = the judge's phrase, 29 May; the record held a communication, not the order | §4 term 3 | ✅ VERIFIED | Dossier §5 / §4. Presented as a gloss, not as claimed verbatim — correct. |
| ~20–22M Instagram followers within a week of the 16 May launch | §5 `value`/`label`; §8 tile 1 | ✅ VERIFIED | Dossier §4a claim 3, **in the exact form the dossier prescribes**. |
| About two crore followers = twenty million | §5 `equals[0]` | ✅ VERIFIED | Unit conversion, correct (see ruling 1). Storyboard §5 derivation 1. |
| ~2.5× the BJP's Instagram handle; ~1.5× Congress's, **on 21 May** | §5 `equals[1]` + note | ✅ VERIFIED | Dossier §4, src-07, verbatim including the "~21 May" qualifier. Storyboard ruling 1. The qualifier survived compression — the usual failure mode avoided. |
| "A dated range, not a fixed count. Figures vary by platform and by the day." | §5 `data.note` | ✅ VERIFIED | Dossier §9.4 discipline, applied. See the note at ⚠️ REFRAME-SHAPE. |
| Curve points {516,0} {522,93} {523,100} | §6 `data.points` | ✅ VERIFIED | All three sourced — see ruling 2. |
| Milestones 16 May / 21 May / 23 May | §6 `data.milestones` | ✅ VERIFIED | Dossier §3/§4. The 21 May milestone draws no pin, so it asserts no value. |
| "The 21 May order arrived with the account already near its peak." | §6 annotation @ 522 | ⚠️ IMPRECISE (placement) | Claim supported; the **anchor** is the 22 May mark while the text names 21 May. The storyboard's instruction (match the 21 May milestone label) would have rendered nothing at all. See ⚠️ ANNOT-ANCHOR. |
| "A backup handle drew 1.6 to 2 lakh followers in a day." | §6 annotation @ 23 May | ✅ VERIFIED | Dossier §4, src-09 (in this section's `sourceRefs`) + src-10. |
| "share of ~22M peak · May 2026 · approximate, sources vary" | §6 `data.caption` | ✅ VERIFIED | Dossier §4a. Hedge carried verbatim as the storyboard required. Partly form rather than finding — optional note. |
| MeitY issues a §69A direction; the power survived a Supreme Court challenge in 2015 | §7 step 1 | ✅ VERIFIED | Dossier §4 (MeitY), §9.2 (§69A), §3 (*Shreya Singhal* 2015 upholds §69A). Case not named — see ⚠️ NAMES-DROPPED. |
| "X has to act on it, and **it cannot tell you the order exists.**" | §7 step 2 | ⚠️ IMPRECISE | Dossier §1/§9.7 establish the platform must obey and **cannot disclose the order**. "Cannot tell you the order exists" is a stronger claim, and §7's own step 3 then states the accurate version ("has to argue against a document they are not allowed to read"). The founder publicly knew the account was withheld (dossier §5). See required fix 3. |
| The order stays confidential; whoever is blocked argues against a document they may not read | §7 step 3 | ✅ VERIFIED | Dossier §1, §9.7, §6. Structural, not editorial — see the voice audit. |
| 3 hr platform takedown-compliance window since Feb 2026; "cut from a day or more" | §8 tile 3 | ✅ VERIFIED | Dossier §3 — 10 Feb 2026 amendment cutting 24–36 hours to three, effective ~20 Feb. "A day or more" = 24–36 h, accurate and reader-feelable. |
| 2,300+ blocking orders to 19 platforms, Oct 2024–Oct 2025; "across all platforms and cases, not this one" | §8 tile 4 | ✅ VERIFIED | Dossier §4, verbatim. The scoping note prevents misattribution to this case. Single-sourced to src-05 — flagged by the storyboard §8e and kept by ruling. |
| 1 account formally withheld under §69A | §8 tile 2 | ✅ VERIFIED | Dossier §9.6. Guardrail-2 site 3. |
| Executive holds 1 of 5 levers | §9 `title` + `caption` | ✅ VERIFIED | Dossier §1/§9.6. Verified at the render, not just the YAML. |
| Courts `partial`, platforms `partial` on "Hide it inside India" | §9 `cells` | ✅ VERIFIED | Dossier §1/§3/§4. |
| Platforms `full` on "Delete the account" and "Reach the servers" | §9 `cells` | ✅ VERIFIED | Dossier §1. |
| Account `full` on "Stop a backup handle" | §9 `cells` | ✅ VERIFIED | Dossier §1 + §4 (the backup handle appeared and drew followers). |
| Account `full` on "Reach copies readers kept" | §9 `cells` | ⚠️ **JUDGEMENT CALL** | The one cell that locates a capability the record does not locate. Full reasoning and ruling at point 4 above. |

**Totals: 36 ✅ VERIFIED · 4 ⚠️ (3 IMPRECISE + 1 judgement call) · 0 ❌ UNTRACED.**

**No ❌ UNVERIFIED-CLAIM-USED.** No `[UNVERIFIED]` or `[VERIFY WORDING]` dossier
item is used as fact anywhere.

**Internal-consistency sweep — clean.** Every figure that appears more than once
agrees with itself: twenty million / 2 crore / ~20–22M; ~22M peak vs ~21.9M vs
93%/100%; 21 May as the block date across five fields; fourteen days against
15 → 29 May; 2,300+ / 19 platforms / Oct 2024–Oct 2025; 2.5× / 1.5× / 21 May.
No sentence in the draft contradicts a number elsewhere in the draft.

---

## Quotability gate (copyright)

✅ **Clear. No ❌ NON-QUOTABLE SOURCE.**

The issue carries exactly one verbatim passage: the CJI remark and its
clarification, both attributed to **The Wire** (src-01, src-02). Against
`research/_sources/politics.md`, The Wire — Politics is `tier: T4 · access: open ·
ingest: live`. Per `_TAXONOMY.md` §1, `live` means "not pre-indexed; fetched on
demand via the WebFetch allowlist" — so **no RAG corpus chunk is involved**, and
there is no GUIDE-ONLY (`ingest: metadata`) dependency to assess. The dossier §4a
records both texts captured from a direct fetch of the open originals, whose URLs
are the ones cited. That is "cite-the-original" satisfied on its own terms.

The excerpts are short, attributed, and taken for reporting and criticism
(s.52(1)); the words quoted are a judge's public courtroom remark and an official
clarification, carried in identical wording by ThePrint independently (dossier
§4a), so the exposure to any one outlet's expression is minimal. The upstream
wires (PTI, LiveLaw) are off-allowlist and correctly not cited — dossier §9.1
records this and the editor's standing recommendation to consider adding
LiveLaw / Bar & Bench for legal-remark coverage.

---

## Voice audit

| Issue | Location | Severity | Suggested fix |
|---|---|---|---|
| "who can **actually** do them" / "What the law **actually** says" / "How big it **actually** got" | §9 `intro`, §4 `title`, §5 `title` | ⚠️ low — verbal tic | Three "actually"s, two of them in consecutive section titles. Not a catalogued tell, but it reads as a habit. Drop one or two. |
| "These four figures are what the record **does** show." | §8 `intro` | ⚠️ very low | The emphatic "does" carries a faint contrastive lilt. It is defensible — the record does show these four and not the order — and the sentence is a legitimate seam restating §7. Leave, or drop "does". |

**Everything else is clean, and two things are worth stating explicitly because
they are the lines an operator on this desk would worry about:**

- **Zero SATIRICAL EXPOSURE. ✅** The `paradox` is cut and the beat with it. "A ban
  is also a billboard", "certify the account as dangerous" and "billboard" are all
  grep-clean. I read every prose field for a sentence that reads as the writer
  enjoying the joke and found none. The two candidates both survive scrutiny:
  §2's "Its name came from a judge, in open court" is provenance with a precision
  qualifier (an oral courtroom remark, not a written judgment — the dossier's own
  phrasing), not a punchline; and §3's "Two weeks later a satirical account is a
  case in the Delhi High Court" is the CALM-STRUCTURAL move with the connective
  written ("Two weeks later") and the conclusion left undrawn. "Satirical" is the
  dossier's own descriptor for the outfit.
- **§7 step 3 is not advocacy.** "Whoever is blocked has to argue against a
  document they are not allowed to read" is the sharpest sentence in the issue. It
  states a documented procedural fact (dossier §1, §9.7, and the court's own
  minute), carries no editorial verb and draws no conclusion. Within voice.

No ❌ ADVOCACY, ❌ WIRE TONE, ❌ SPECULATION or ⚠️ RHETORICAL Q. No passive filler,
no meta-commentary, no invented consequence.

---

## Register and composition audit

| Flag | Location | Severity | Note |
|---|---|---|---|
| ⚠️ **SOURCE-LINE MISMATCH** | §1 `source`, §4 `source` | **fix** | Both read "The Wire and ThePrint". §1 cites src-03 + src-04; §4 cites src-03 + src-04 + src-05. **All five are The Wire.** No ThePrint source is referenced by either section. |
| ⚠️ **SOURCE-LINE MISMATCH** | §9 `source` | **fix** | Reads "The Wire · Delhi High Court record", but `sourceRefs` include **src-09 (ThePrint / PTI)**, which is the source backing the backup-handle row. The line names an outlet the section does not cite and omits one it does. |
| ⚠️ **HEAD-HEAVY (at the ceiling)** | head + §1 | **fix** | Words before the first graphic = head (73) + §1 eyebrow (3) + §1 title (4) = **exactly 80**, against an 80 ceiling. The storyboard budgeted 76 and instructed "Trim the primer to ≤ 30 words"; the primer is **35**. Title 8 + dek 11 + hook 19 + primer 35 = 73 against the budgeted 69. §1 correctly carries **no intro** ✅ — the floor holds only because of that. |
| ⚠️ **WORD BUDGET** | whole issue | **fix** | My manual count lands at **~1,100 reader-facing words** — at or fractionally over the ceiling. The storyboard predicted this precisely (rulings 1 and 2 pull against each other; ~54 words had to come out of chrome) and named the order in which chrome pays. Several intros and labels sit over their storyboard caps: §2 intro 25 (cap 20), §5 intro 26, §7 intro 24 (cap 18), timeline labels on the 23 May (12) and 29 May (9) events (cap 8), §4 term-3 `meaning` 23 (cap 20). `npm run check:prose -- 2026-06-04-cockroach-janta-party` is the authority; trimming the primer to ≤ 30 fixes this flag and HEAD-HEAVY together. |
| ⚠️ **NO PRIMARY ANCHOR** | `sources[]` | note — not fixable in a rewrite | All ten sources are **T4 long-form journalism** (The Wire ×5, ThePrint ×5). `_TAXONOMY.md` §1 says of T4: "Framing, reporting, leads. **Not the primary anchor.**" There is no T0/T1/T2 source in the issue. See the expanded note below — the dossier's stated reason for this is stale. |
| ⚠️ **CURVE-AXIS** (inherited) | §6 `adoption-curve` | note | `AdoptionCurve.astro` positions points by **array index**, not by x value: `x = padL + i/(n−1) × iw`. With three points the 16→22 May gap (six days) and the 22→23 May gap (one day) render as **equal widths**, so the curve's shape does not encode elapsed time. Separately, the axis labels are `String(year).slice(2)`, written for four-digit years, so with the month-day encoding the two rendered ticks read **"6"** and **"3"**. Both behaviours were present in the published six-point version and are component limits, not authoring defects. Two things make them survivable here, and both are consequences of ruling 4 being right: the milestone strip below the chart carries the real dates, and the weakened claim is about **level** ("already near its peak"), not **rate** — which is the only claim this geometry can honestly support. |
| ⚠️ **ANNOT-ANCHOR** | §6 annotation 1 | judgement call | `at: 522` anchors "The 21 May order arrived…" to the **22 May** mark. The storyboard's instruction — match the 21 May milestone label verbatim — was **impossible**: `annotIdx` resolves a milestone label to its `year` and then to a point index, and there is no point at 521, so it would have been a silent no-op and the finding would have vanished. `at: 522` is the only way to render it. Given the axis ticks read "6" and "3", a reader cannot decode the dot's date anyway, so the practical risk is low. Accept, or reword so the text does not name a date the mark does not carry. |
| ⚠️ **NAMES-DROPPED** (storyboard drift, in the contract's direction) | §3, §4, §7 | note — **not a fix** | Three names the storyboard §7 allotted are gone: **Abhijeet Dipke** ("Its founder was in Boston"), **P.K. Kaurav** ("The judge's phrase on 29 May"), ***Shreya Singhal*** ("a Supreme Court challenge in 2015"). Every claim each carried survives and traces. This is contract rule 9 / tell 11 applied — a name used once is a name to cut — and it brings the issue to **10 distinct named people and organisations** against a ceiling of 12. Recording it so nobody "restores" them. The only cost is that a reader cannot look up *Shreya Singhal* by name. |
| ⚠️ **REFRAME-SHAPE** | §5 `data.note`, §8 tile 4 `note` | note — **not a defect** | The argumentative binary reframe is spent **exactly once**, on "Withheld is not deleted", as ruled. Two further appositive negations appear, both in `note` fields doing accuracy work: "A dated range, not a fixed count" and "Across all platforms and cases, not this one". Neither is a rhetorical reversal used as an argumentative move, and flagging them would push the editor to delete precision hedges. If the operator wants strict compliance, the **first** is the one to trim — "range" already implies "not a fixed count", so the clause is pure redundancy; the second earns its place by preventing misattribution. |
| ⚠️ **TEMPORAL-NOW** | §3 event 5 `note` | very low | "The block **now** goes to the ministry's own review committee." "Now" means "as of 29 May" and sits on a dated row with the `state: now` marker, so it is safe — but a September reader meets the word without that frame. Cutting "now" says the same thing with no ambiguity. |
| ✅ HINDI (all flags) | whole issue | clean | **Zero Hindi words.** No lexicon entry appears anywhere. `lakh` and `crore` are English/Indian-English units per `hinglish-lexicon.md` §"Units and numbers (English, always)" and `_voice-core.md` §2 — they are the Indian anchor, not a Hindi layer. Storyboard ruling 7 held. No HINDI-LOAD-BEARING, HINDI-FIELD, HINDI-SPELLING or HINDI-DENSE. |
| ✅ NO-INDIAN-ANCHOR | — | clean | crore, lakh, an Indian court, an Indian ministry, an Indian law, the BJP and Congress handles, and the reader's own phone as the jurisdiction. No foreign-currency figure exists in the issue, so contract §3 rule 4 has nothing to convert — correct, not an omission. |
| ✅ EM-DASH / SEMICOLON | whole issue | clean | **Zero em-dashes and zero semicolons in every reader-facing field.** The only em-dashes in the file are inside the `{/* */}` EDITOR block, which ships nothing to the reader. The one colon ("he clarified:") precedes a quoted line — permitted. |
| ✅ AI-WORD / OPENING-ADVERB / TRIPLET / MIRRORED CLOSE | whole issue | clean | No word from the list. No sentence opens "Notably" or its siblings. No rhythmic triplet, no mirrored close, no triple-fragment close. |
| ✅ PLAIN-CLAIM | §9 `plain` | clean | Exactly **one** authored `plain`, on the hero, as ruled. "Levers down the side, the four actors across the top, and a filled cell where that actor holds the lever" describes the FORM and asserts no data. It correctly says "actors" where `EXPLAIN['power-matrix'].what` says "parties" — which is why the storyboard mandated authoring it. |
| ✅ CAPTION-FORM | §§1, 3, 5, 9 | clean | Each asserts a finding. §6's caption is partly normalisation and §8's ("CJP × §69A · MAY 2026") is a slug rather than a finding — both carried over under an approved storyboard that budgeted them as such, so an optional note, not a flag. |
| ✅ REDUNDANT-HOWTO | whole issue | n/a | **Zero `howToRead` authored.** I verified against `NEEDS_HOW` in `src/lib/explainers.ts` that **none** of the nine kinds is a member, so `howToReadFor()` returns `undefined` and no panel renders anywhere. Correct under RG-19 and as the storyboard ruled. |
| ✅ JARGON-UNGLOSSED | whole issue | clean | "Withheld", "Section 69A" and "not on record" are the three terms of art and §4 exists to gloss all three. §7 glosses the mechanism in the same breath. |
| ✅ BARE-NUMBER | whole issue | clean | Every figure carries a comparison: twenty million → two crore and 2.5× the BJP handle; 160,000–200,000 → 1.6 to 2 lakh; 3 hours → "cut from a day or more"; 2,300+ → scoped to all platforms and cases. |
| ✅ ANALOGY-CLAIM | whole issue | n/a | No analogy is used; §4's glosses are restatements, not metaphors, deliberately (storyboard §8b guardrail 4). |
| ✅ TITLE-FORMULA / HOOK-ABSTRACT | head | clean | Title states the finding; the retired construction is gone. Hook is 19 words with a number ("2 crore"), a "you" ("your phone") and the twist ("and from nobody else's"). |
| ✅ TEXT-HEAVY / PROSE-RUN / NO-LEAD-GRAPHIC | composition | clean | **6 of 9 visual = 67%** (floor 60%): §§1, 3, 5, 6, 8, 9. Text-only §§2, 4, 7 are each between two visuals — **V T V T V V T V V**, no adjacency. §1 `you-think` is not in `TEXT_ONLY`, so the first section is a graphic. Zero `prose`, zero `paradox`, zero loud sections, one `wide` on the hero, 9 sections (CANON §3 range 6–12). |
| ✅ NAME-THROUGHPUT | whole issue | clean | **10** distinct named people and organisations (CJP, Surya Kant, BJP, X, Instagram, Delhi High Court, MeitY, Intelligence Bureau, Congress, Supreme Court), each with a role phrase. Outlets appear only in `source` lines, per rule 9. Expect `check:prose`'s capitalisation heuristic to over-report on a statute-dense issue — storyboard §8f.2 predicted this. |
| ✅ QUESTION-UNANSWERED | storyboard §6 | clean | All three answerable from the draft alone. **Q1** (what happened, where) → §1 + §4 + §9. **Q2** (which law, who issued, why the court could not see it) → §4 terms 2–3 + §7 + §3's 21 May note and 29 May annotation; the removal of "not the IT Rules of 2021" does not affect it, since Q2's answer needs the positive identification, which §4 gives. **Q3** (how big, and when the order arrived) → §5 + §6, and the follower figure is answerable **as a range**, which storyboard §6 requires. |
| ✅ STORYBOARD-DRIFT | kinds, order, hero | clean | Nine rows in the storyboard's order with `number-sense` slotted between rows 4 and 5 per ruling 1. Hero is `power-matrix` at `layout: wide` per ruling 6. Six tiles → four per ruling 5. Seven timeline events → six per §8a. Departures are limited to the two authorised conversions, the primer overrun, the three dropped names and the forced annotation anchor — all recorded above. |
| ✅ SINGLE-VIEWPOINT / FALSE BALANCE | sources | clean | The Wire is `viewpoint: left`, The Print is `viewpoint: center` — two clusters. The issue makes a mechanism claim about territorial reach, not a contested policy claim, and nowhere argues the block was unjustified. No settled fact is hedged against an opinion. |

### The NO PRIMARY ANCHOR note, expanded — one stale line in the dossier

This is the one finding the operator cannot act on inside this rewrite (ruling 8
keeps all ten `sources[]` unchanged), so it is recorded for the next pass rather
than listed as a fix.

The issue's legal spine — §69A is the blocking power in the IT Act 2000, the
procedure sits in the Blocking Rules 2009, and the Supreme Court upheld the power
in 2015 — currently rests **entirely on two T4 journalism outlets**. The dossier
explains why, at §6 and §9.11: "the statutory text of §69A lives on
indiacode.nic.in (**off-allowlist**)".

**That is no longer true.** `research/_sources/politics.md` lists at T0:

- **India Code (legislation repository)** — `tier: T0 · access: open · ingest: full`
- **Supreme Court of India — Judgments** — `tier: T0 · access: open · ingest: full`
- **Supreme Court — Landmark Judgment Summaries** — `tier: T6 · access: open · ingest: full`

So the bare text of §69A and the *Shreya Singhal* holding are both available on
the allowlist at T0, open and fully quotable. The dossier's constraint was either
written against an older allowlist or missed them.

Nothing in the issue is wrong because of this — the dossier §4a verifies all
three load-bearing claims against ≥2 allowlisted sources, and the two outlets sit
in different viewpoint clusters. But the next time this dossier is refreshed, two
T0 citations would move the legal claims from "reported by two outlets" to
"anchored in the statute and the judgment", which is where a statute-dense
politics issue should sit. The genuinely unavailable documents remain
unavailable: the MeitY order itself is confidential and "not on record" per the
court, exactly as dossier §6 and §9.11 say.

---

## Schema check

| Check | Status | Note |
|---|---|---|
| status: draft | ✅ **by ruling** | `status: published` is **correct** for a Phase-6 in-place rewrite (storyboard ruling 8, REGISTER-PLAN §8.1). Flipping it would unpublish a live page and drop its `/s/` route. **Flagged only so it is not "fixed".** |
| All section kinds registered | ✅ | `you-think`, `quote`, `timeline`, `jargon-buster`, `number-sense`, `adoption-curve`, `three-steps`, `data-readout`, `power-matrix` — all nine verified present in `SECTION_KINDS` in `src/content/config.ts`. |
| No author field | ✅ | Absent. |
| publishedAt valid | ✅ | `2026-06-04`, unchanged, as ruling 8 requires. |
| Source URLs https:// | ✅ | All ten. |
| Source kinds valid | ✅ | primary ×5 (01–04, 06), analysis ×2 (05, 07), secondary ×3 (08–10). |
| ≥6 sources | ✅ | Ten, all unchanged. |
| `sourceRefs` resolve | ✅ | Every entry across all nine sections resolves to an existing `source.id`. |
| No orphan sources | ✅ | All ten referenced at least once: src-01 (§§2,3) · src-02 (§§2,3) · src-03 (§§1,3,4,7,8) · src-04 (§§1,3,4,7,9) · src-05 (§§4,7,8,9) · src-06 (§§3,8) · src-07 (§§3,5,6) · src-08 (§§5,6,8) · src-09 (§§3,5,6,9) · src-10 (§8). src-10 genuinely backs §8 tile 1 ("crossed 20M in less than a week", dossier §8). |
| primer 80–420 chars | ✅ | ~194 characters. The prior report's build watch item is resolved by a primer a third the length. |
| `plain` ≤ 220 chars | ✅ | ~104 characters, one instance. |
| `layout` in enum | ✅ | One `wide`, on the hero. |
| `skimCaption` only on `prose` | ✅ | None authored; no `prose` section exists. |
| Authored fields actually render | ✅ | Checked per dispatch arm, not assumed. §9's caption is authored at **section level** while `SectionBody` passes `caption={data.caption}` to `PowerMatrix` — so the component renders none, the `:has([class$='__cap'])` rule in `dataviz-v2.css` does not fire, and `core/Section.astro` prints it as `.px-section__claim`. It renders. Same route for §3's timeline caption (`Timeline.astro` emits no `__cap`). §§1, 5 pass `section.caption ?? data.caption` into VizCard; §§6, 8 read `data.caption` and render `.px-viz__cap` / `.tel__cap`, with Section's copy correctly suppressed. `data-readout` `emphasis` values (`key`, `key`, `warn`) match the component's real enum. `number-sense` has 2 `equals` rows, inside the 1–3 build-time guard. |

---

## Required fixes before publish

1. **Fix the `source` line on §1 `you-think` and §4 `jargon-buster`.** Both read
   "The Wire and ThePrint"; both cite **only The Wire** (src-03, src-04, and
   src-05 on §4). Either change the label to "The Wire", or add **src-06**
   (ThePrint's Delhi HC report, which dossier §4 also cites for the 21 May §69A
   withholding) to `sourceRefs` so the line becomes true.

2. **Fix the `source` line on §9 `power-matrix`.** It reads "The Wire · Delhi
   High Court record" but cites **src-09 (ThePrint / PTI)**, which is the source
   behind the backup-handle row. Name ThePrint in the line, or drop src-09 if the
   Wire refs already carry every cell.

3. **Soften §7 step 2.** "it cannot tell you the order exists" overstates the
   dossier (§1, §9.7: the platform must obey and **cannot disclose the order**),
   and step 3 of the same section then states the accurate version. The founder
   publicly knew his account had been withheld (dossier §5), so the stronger claim
   is also contradicted by the record. One word does it — "it cannot show you the
   order" — and the two steps stop disagreeing.

4. **Soften the 29 May timeline annotation.** "an order it never saw" hardens
   Kaurav's dated, provisional "not on record **today**. There is only
   communication" into a permanent negative, and dossier §4 records the court also
   observing that the platform "cannot keep it confidential from court". "an order
   that was not on its record" or "an order it had not been shown" stays inside
   the source and inside the 12-word cap.

5. **Trim the primer to ≤ 30 words**, as storyboard §4 already instructed. At 35
   it puts the head at 73 against a budgeted 69, words-before-first-graphic at
   **exactly 80** against an 80 ceiling, and the issue at or fractionally over the
   1,100-word ceiling. This one edit clears HEAD-HEAVY and the word budget
   together. Run `npm run check:prose -- 2026-06-04-cockroach-janta-party`
   afterwards — it is the authority on both counts, not my manual tally. If it
   still reads over, storyboard §8h names the order in which chrome pays (event
   and tile notes, then intros, then captions) and what never pays (any number,
   any verbatim quote, any attribution, the `jargon-buster` glosses, the
   `you-think` reframe).

6. **Settle the `power-matrix` "Reach copies readers kept" cell.** My ruling is at
   point 4 above: empty it, because no actor holds that lever and the account
   least of all, and amend the caption's "The rest sit with the platforms or the
   account" to account for a lever nobody holds. **This is a judgement call, not a
   factual error** — if the operator reads the row as a ledger of which side the
   lever falls on rather than who controls it, the cell stands and nothing else
   changes. It needs a decision either way before commit.

---

## Optional improvements

- **Give the state its own reason, in the 21 May note.** The IB input is named
  ("Ordered by the IT ministry, on Intelligence Bureau inputs") but the **stated
  ground** is not. Dossier §4 records it plainly — the content was cited as a
  "threat to the sovereignty of India" — and src-03 is already in §3's
  `sourceRefs`. Seven words would remove any reading that the order is presented
  without a cause, which is worth having on this desk. Dossier §5 is explicit that
  it must appear as *the stated ground*, never as a quotation.
- **Render the hero before committing.** §9 is a re-kind: `power-matrix` has never
  been rendered on this issue. Two things worth eyeballing — `parties[]` carry no
  `color`, so every filled cell takes `var(--muted)` as its background and the
  executive's single lever is distinguished by glyph and position rather than
  colour (defensible, arguably better on a non-party grid); and the glyph sits on
  that muted fill, which is the kind of fill TD-06 governs.
- **Consider `plat: partial` on "Stop a backup handle".** Dossier §3 records the
  backup handle "also taken down" on 23 May, so the platform arguably holds part
  of that lever. Its absence understates a platform's power, which runs *against*
  the issue's own argument rather than for it — so leaving it is the conservative
  choice, not a defect.
- **§8's caption is a slug.** "CJP × §69A · MAY 2026" names the subject and the
  period and asserts nothing. The storyboard budgeted it at ≤ 6 words, so it is
  sanctioned — but a finding would earn the line.
- **Cut "now" from the 29 May note** (see ⚠️ TEMPORAL-NOW).
- **Drop one or two "actually"s** (see the voice audit).
- **Record the dossier's stale off-allowlist line.** Dossier §6 and §9.11 say
  §69A's statutory text is off-allowlist; India Code sits on the politics
  allowlist at T0, open and fully quotable, as does the Supreme Court judgments
  archive. Worth a one-line correction in the dossier so the next issue that
  touches §69A does not inherit the constraint.
