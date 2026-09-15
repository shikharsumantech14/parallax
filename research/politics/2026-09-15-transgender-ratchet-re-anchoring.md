# Re-anchoring pass: the statute, the judgment and the House record

- **Category:** politics
- **Issue:** `src/content/issues/2026-05-02-transgender-ratchet/index.mdx` (published)
- **Dossier:** `research/politics/2026-05-02-transgender-ratchet-dossier.md` (§2, §9 notes 1, 2, 5 — **untouched by this pass**)
- **Storyboard:** `research/politics/2026-09-15-transgender-ratchet-storyboard.md` (§8f, §8i ruling 1 — the ruling this file answers)
- **Researched:** 2026-09-15
- **Researcher:** researcher-agent
- **Scope:** NARROW. Three source anchors and two factual questions. No new argument, no new structure, no edit to any other file.

> **Operator ruling 1 (storyboard §8i), verbatim:** *"**RUN THE NARROW RESEARCH
> PASS FIRST.** The dossier's allowlist assumption is stale in two places:
> `sci.gov.in` (NALSA) and `indiacode.nic.in` (the bare Acts and amendments) are
> both T0 on `research/_sources/politics.md`, and `sansad.in` (T0, vote records)
> was never fetched. The pass writes
> `research/politics/2026-09-15-transgender-ratchet-re-anchoring.md`. The drafter
> reads it and uses its attributions. The dossier is NOT edited."*

---

## ⚠️ READ FIRST — two things that change what the draft may say

### 1. The minister's quote does not match the House record. Do not treat it as settled.

The published `quote` section attributes twenty-one English words to Union Social
Justice Minister Virendra Kumar. The storyboard fixes them as *"21 w verbatim,
fixed"* (row 7) and makes them unpayable slack. **The official Lok Sabha record
of 24 March 2026 has him moving the Bill in Hindi**, and the sentence that maps
to the published English differs at the one word that matters.

**Published (src-06, The Print):**

> "The objective of this legislation is solely to protect those individuals who
> face severe social exclusion due to their **gender identity**."

**Official Lok Sabha record, 24 March 2026, verbatim:**

> "माननीय सभापति जी, इस विधायी नीति का आशय केवल उन लोगों की रक्षा करना है, जो अपनी
> **जैविक स्थिति** के कारण गम्भीर सामाजिक बहिष्कार का सामना करते हैं । नीति का उपयोग
> केवल उन्हीं लोगों के लिए किया जाए, जिन्हें वास्तव में ऐसी सुरक्षा की आवश्यकता है ।"
> — सामाजिक न्याय और अधिकारिता मंत्री (डॉ. वीरेन्द्र कुमार), Lok Sabha, 24 March 2026
> — https://elibrary.sansad.in/items/44e8c4e0-d2b1-4a0d-92ee-cccae238db1f
> — **T0 · open · viewpoint: n/a**

**My English rendering, offered as a rendering and not as a quotation:** *"Hon.
Chairperson, the intent of this legislative policy is only to protect those
people who face severe social exclusion on account of their biological
condition. The policy should be used only for those people who genuinely need
such protection."*

`जैविक स्थिति` is "biological condition / biological status". It is not "gender
identity", which in this register would be `लैंगिक पहचान`. Every other element of
the published sentence — *objective · solely · protect · those individuals who
face severe social exclusion due to their …* — tracks the Hindi almost word for
word, which is what makes the divergence at the final term hard to read as
coincidence.

**What I can and cannot establish.** I have **page 1 only** of the debate extract
(see "Tools and failures logged"). A minister also replies at the close of a
debate, and The Print's sentence could be a translation of a different sentence
spoken hours later. **I cannot exclude that, so this is a discrepancy to resolve,
not a proven error.** What is certain is that the published words are The Print's
English rendering of a Hindi speech, and that the issue currently presents them
as the minister's own words without saying so.

**Three courses, drafter's or operator's choice:**
1. **Keep the English and fix the attribution** — attribute to the minister *as
   reported by The Print*, which is what src-06 actually supports. Cheapest, and
   it is honest.
2. **Quote the record** — but the record's words are Hindi, which collides head-on
   with the storyboard's zero-Hindi ruling (§5, ruling 7). A verbatim quotation of
   the House record is a quotation and not register Hindi, on exactly the logic
   §8i already applied to the statutory category list. **That is an operator call.**
3. **Drop the quote** and let T. Sumathy and Kalki Subramanium carry row 7.

**My recommendation: option 1**, unless the operator wants to reopen the Hindi
ruling. On this subject an attribution that overstates a source's authority is
the failure mode to avoid, and option 1 removes it for a handful of words.

### 2. Two of the three anchors could not be fetched at all. The storyboard's premise is half right.

The storyboard is **correct that `sci.gov.in` and `indiacode.nic.in` are on the
allowlist at T0**, and correct that the dossier's stated reason for skipping NALSA
(indiankanoon is off-list) was never a reason to skip the Supreme Court's own
archive. I verified the allowlist myself: `research/_sources/politics.md` L27
(`sci.gov.in`, T0), L28 (`indiacode.nic.in`, T0), L23–24 (`sansad.in/ls`,
`sansad.in/rs`, T0), and all three are in the WebFetch block at L118–L122.

**But both domains refuse this crawler outright.** This is the Arsenal condition
in its second form — not "a primary treated as unavailable", but "a primary that
is genuinely unavailable, for a reason nobody had written down". The dossier
reached the right conclusion by the wrong route, and the storyboard reached the
wrong conclusion by the right route.

| Anchor | Allowlist status | Result |
|---|---|---|
| **NALSA (2014)**, `sci.gov.in` | **T0**, twice (L27 judgments, L105 landmark summaries) | **NOT LANDED.** Blanket HTTP 403 on every path tried |
| **The Act as amended**, `indiacode.nic.in` | **T0** (L28, "bare acts … amendments") | **NOT LANDED.** Blanket HTTP 403, including the site root |
| **The March 2026 passage**, `sansad.in` | **T0** (L23, L24) | **LANDED**, via the `elibrary.sansad.in` subdomain — the official Lok Sabha record, in the House's own words |

**The net is still strongly positive.** One anchor landed at T0 and yielded more
than it was asked for, the appeal question is settled on two independent
documents, and both factual questions are answered from the record. But the issue
does **not** move to "sourced to the statute, the judgment and the House record".
It moves to **"sourced to the House record, PRS and two newspapers"**, which is
one primary better than it was and two short of the ambition.

---

## Tools and failures logged

Per the brief, `mcp__parallax_rag__search` was **not called on this run**.
WebSearch and WebFetch only.

**Refused the crawler (HTTP 403, blanket — the site root fails too):**

| URL | Result |
|---|---|
| `https://www.sci.gov.in/` | 403 |
| `https://www.sci.gov.in/landmark-judgment-summaries/` | 403 |
| `https://www.sci.gov.in/judgements-judgement-date/` | 403 |
| `https://www.indiacode.nic.in/` | 403 |
| `https://www.indiacode.nic.in/handle/123456789/13091` | 403 |
| `https://indiacode.nic.in/handle/123456789/13091` (no `www`) | 403 |
| `https://www.indiacode.nic.in/bitstream/123456789/13091/1/a2019-40.pdf` | 403 |

**Dead or unreachable hosts:**

| Host | Result | Note |
|---|---|---|
| `main.sci.gov.in` | **DNS does not resolve** | The SCI's legacy `jonew/judis` judgment server. `main.sci.gov.in/jonew/judis/41411.pdf` is still the URL cited across the literature for NALSA; **it no longer exists.** Anyone re-running this pass will find that link everywhere and reachable nowhere |
| `digiscr.sci.gov.in` | **DNS does not resolve** | Digital Supreme Court Reports |
| `api.sci.gov.in` | Timed out at 300s | Server accepts connections; nothing retrieved |
| `eparlib.sansad.in` | `ECONNREFUSED 164.100.166.186:443` | Indexed by search engines, unreachable live. The debate PDFs surface in search results from this host and none of them can be fetched |
| `sansad.in/rs/legislation/bills` | `Parse Error: Missing expected CR after header value` | Malformed HTTP response from the server |
| `web.archive.org` | Blocked by the tool | Closed the one legitimate route to an archived SCI copy |

**Rendered but returned no data (JavaScript-loaded tables):**
`sansad.in/ls/legislation/bills` (the columns are exactly the ones this pass
needed — *Date of Introduction · Date Passed in LS · Date Passed in RS · Act No ·
Assent Date* — and every row is client-rendered); `sansad.in/ls/debates/synopsis`.
`sansad.in/ls/business/divisions` returns **404** — there is no divisions register
at that path.

**PDFs could not be parsed anywhere in this session.** There is no PDF renderer on
this machine (`pdftoppm` absent), and WebFetch returned raw FlateDecode streams
for every PDF tried: the PRS Bill text (`Transgender_Bill_2026_Text.pdf`, 384 KB),
the PRS Issues-for-Consideration PDF, and the Lok Sabha debate PDF (316 KB).
**Dossier §9 note 1 is therefore confirmed, not fixed** — the Bill text PDF
remains unparseable, and the drafter still cannot get clause numbers from it.

**One workaround worth recording for future runs.** The Lok Sabha debate was
reached by treating `elibrary.sansad.in` as a DSpace instance and walking its REST
API: `…/server/api/core/items/<uuid>/bundles` → the **TEXT** bundle →
`…/server/api/core/bundles/<uuid>/bitstreams` → a plain-text extraction of the
PDF. The page-1 image came from the **THUMBNAIL** bundle, fetched as a JPEG and
read as an image. **This is how you get Indian parliamentary text without a PDF
parser.** Its limit: WebFetch truncates from the head, and the 190 KB text
extraction is cut off mid-debate, so the *end* of a sitting — which is where every
passage formula lives — stays out of reach.

**Off-allowlist, used only to check that a finding is not contradicted, quoted
nowhere and citable nowhere:** LiveLaw, Amnesty International, Manorama Yearbook,
DD News, NewsOnAir, The Quint, Wikipedia. One of them is flagged under "For the
operator to rule" because its headline slug says something the record should be
asked about.

---

## 1 · NALSA v. Union of India (2014) — **NOT RE-ANCHORED**

**Status: the judgment's own words could not be reached on any allowlisted
domain. Storyboard constraint 8b.4 stands unchanged.**

The Supreme Court of India's site is a blanket 403; its legacy judgment server and
its Digital Reports server no longer resolve; the Internet Archive is blocked by
the tool. `indiankanoon.org`, `clpr.org.in`, `globalhealthrights.org` and
`equalrightstrust.org` all carry the full text and **none of them is on the
allowlist**, so none is quoted here and none may be cited.

**What I would have needed:** either `sci.gov.in` to serve a crawler, or an
operator hand-fetch of the judgment PDF, or `indiankanoon.org` added to the
politics allowlist by explicit ruling.

### What IS now anchored, and it is more than the dossier had

The **formal citation** and a **statement of the holding** are both available on an
allowlisted T1 source, quoted verbatim:

> "The Supreme Court has held that the self determination of one's gender is part
> of the fundamental right to dignity, freedom and personal autonomy guaranteed
> under Article 21 of the Constitution. Further, the Court upheld the right of
> transgender persons to determine their self-identified gender as a man, woman or
> as third gender."
> — PRS Legislative Research, *Issues for Consideration — The Transgender Persons
> (Protection of Rights) Bill, 2019*
> — https://prsindia.org/billtrack/prs-products/issues-for-consideration-3283
> — **T1 · open · ingest: full · viewpoint: n/a**

> "The Supreme Court has noted that self-determination of gender is an integral
> part of personal autonomy and self-expression and falls within the realm of
> personal liberty guaranteed under Article 21."
>
> "National Legal Services Authority vs. Union of India [(2014) 5 SCC 438]"
> — PRS Legislative Research, *Change in the definition of a "transgender person"*
> — https://prsindia.org/billtrack/prs-products/issues-for-consideration-1774350113
> — **T1 · open · ingest: full · viewpoint: n/a** — **already `src-02` in the issue**

**What this does and does not buy:**

- The citation **(2014) 5 SCC 438** is now confirmed on an allowlisted source. The
  published timeline already carries it. It stands.
- **Article 21** is confirmed as the article PRS names. The published issue asserts
  **"Articles 14, 15, 19, and 21"** in three separate places (the timeline note, the
  `paradox` detail, the `prose` petition paragraph). **PRS names only Article 21 in
  both documents.** The four-article formulation is standard in the literature and
  is almost certainly right, but on the allowlist it now rests on The Print
  (src-04, src-10, src-12), not on anything primary. Flagged, not fixed — the
  storyboard's quiz answer 1 states all four.
- **The surgery-precondition holding is still unanchored.** Neither PRS document
  says NALSA held that sex reassignment surgery cannot be a precondition. That
  claim — which is load-bearing for the whole ratchet argument — rests on The Print
  and The Wire alone. **The storyboard's quiz answer 1 asserts it.**
- **The date stays out.** April 15, 2014 could not be confirmed on any allowlisted
  source. **Constraint 8b.4 holds: the `date` string stays "Apr 2014".**

---

## 2 · The Act, the Amendment, and the appeal — **RE-ANCHORED, but on PRS, not on the statute**

**Status: the hero's empty bottom row is VERIFIED. It rests on two independent
PRS documents rather than on the bare Act, because India Code refuses the
crawler.**

This is the load-bearing finding of the pass. The approved hero's fifth row —
*appeal a refusal* — is empty across all four actors, and the storyboard says that
empty row is the graphic's whole point and must be verified against statute text
rather than inferred. **It could not be verified against statute text. It is
verified, explicitly and in the negative, on PRS, twice, seven years apart.**

**On the 2019 Act, written when it was still a Bill:**

> "Note that, if a transgender person is denied a Certificate of Identity, the Bill
> does not provide a mechanism for appeal or review of such decision of the
> District Magistrate."
> — PRS Legislative Research, *Issues for Consideration — The Transgender Persons
> (Protection of Rights) Bill, 2019*
> — https://prsindia.org/billtrack/prs-products/issues-for-consideration-3283
> — **T1 · open · ingest: full**

**On the 2026 Amendment, and on the 2019 Act as it now stands:**

> "The Act does not provide for any kind of redressal mechanism for those
> transgender persons who are denied a certificate of identity."
>
> "The Bill also does not address this."
> — PRS Legislative Research, *Change in the definition of a "transgender person"*
> — https://prsindia.org/billtrack/prs-products/issues-for-consideration-1774350113
> — **T1 · open · ingest: full** — **already `src-02` in the issue**

**Three things follow, and the third is the useful one:**

1. **The hero is sound.** Two independent PRS analyses, one written about the 2019
   Bill and one about the 2026 Bill, both state the absence in terms. The second
   states it of *the Act* and *the Bill* separately, which is exactly the
   both-Acts claim the bottom row makes. The word "appeal" appears verbatim in the
   first; "redressal mechanism" in the second.
2. **The tier is T1, not T0.** `_TAXONOMY.md` §5 prefers a T0/T1/T2 primary anchor
   for a load-bearing fact, so **this clears the gate** — PRS Legislative Research
   is T1 on the politics allowlist (L40–L41), open, `ingest: full`. It is not the
   statute, and the drafter should not imply it is. The honest source line names
   PRS.
3. **No new `sources[]` entry is needed for the hero.** The 2026 document is
   **already `src-02`**. The claim the storyboard was most worried about is the one
   claim the published issue already sources correctly. Adding `src-17` (below)
   strengthens it to two documents; it is an upgrade, not a repair.

### Who decides, in the record's own words

The brief asks what the District Magistrate's and the medical board's roles
actually are. **The House record answers it, and it confirms storyboard constraint
8b.2 from the primary rather than from a summary.** The minister, moving the Bill:

> "इनकी परिभाषा में संशोधन करने का जो प्रमुख बिंदु आया है, उसमें मेडिकल बोर्ड की स्थापना करने
> का निर्णय लिया गया है, जिसमें मुख्य चिकित्सा अधिकारी या उप मुख्य चिकित्सा अधिकारी, राज्यों या
> संघ राज्य क्षेत्रों के नियुक्त किए जाएंगे ।"
>
> "उनकी अध्यक्षता में बोर्ड **सिफारिश करेगा** । बोर्ड की सिफारिश के बाद जिला मजिस्ट्रेट के द्वारा
> ट्रांसजेंडर व्यक्तियों को पहचान प्रमाण-पत्र दिए जाएंगे ।"
> — सामाजिक न्याय और अधिकारिता मंत्री (डॉ. वीरेन्द्र कुमार), Lok Sabha, 24 March 2026
> — https://elibrary.sansad.in/items/44e8c4e0-d2b1-4a0d-92ee-cccae238db1f
> — **T0 · open · viewpoint: n/a**

**Rendering, not a quotation:** the board will be chaired by a Chief Medical
Officer or Deputy Chief Medical Officer appointed by the States or Union
Territories; under that chairmanship **the board will recommend**; after the
board's recommendation the District Magistrate will issue identity certificates to
transgender persons.

- **`सिफारिश करेगा` — "will recommend".** The verb in the House record is
  *recommends*. **Constraint 8b.2 is now anchored at T0, not merely inferred from
  PRS.** Nothing in the record says the board examines the applicant.
- **And PRS carries one sentence the dossier and the published issue both miss:**

  > "The District Magistrate may also take assistance of other medical experts."
  > — PRS, *Change in the definition of a "transgender person"* (`src-02`)

  This does not add a column to the hero — "other medical experts" are the
  magistrate's assistants, not a party holding a decision — but the drafter should
  know it exists before writing row 5's three steps or the hero's `caption`, so
  that "the board recommends, the magistrate issues" is not presented as the
  complete list of who is consulted.

### What remains unreachable about the statute

- **Clause numbers of the 2026 Amendment: still unknown.** India Code 403s and the
  Bill PDF will not parse. **Constraint 8b.3 stands: the Amendment's own clause
  numbers are never stated**, and "Section 4(2)" is stated once, only as a section
  of the 2019 parent Act.
- **The text of Section 4(2) itself: never seen.** Every statement about it in this
  issue traces to PRS and two newspapers paraphrasing it. PRS's own words are
  *"The Act states that a transgender person will have a right to self-perceived
  gender identity"* — a description, not the provision.
- **Section 5, 6 and 7 texts: never seen.** The published timeline's "Section 6
  requires a District Magistrate certificate" and "Section 7 requires proof of
  gender reassignment surgery" remain on the dossier's secondary sourcing.
  Confirmed by PRS in substance — *"An application for obtaining such a Certificate
  should be made to the District Magistrate (DM), in the form and manner, as may be
  prescribed"* and *"the individual undergoes surgery to change their gender either
  as a male or a female"* (src-03 and `issues-for-consideration-3283`) — but not by
  section number.

---

## 3 · The March 2026 passage — **PARTLY RE-ANCHORED**

**Status: the Lok Sabha date and chamber are now T0. "Voice vote" could NOT be
upgraded and stays on the two newspapers already cited.**

### What landed

The Lok Sabha's own record of the day carries an item whose official title states
the outcome:

| Field | Value, verbatim from the record |
|---|---|
| Title | **"The Transgender Persons (Protection of Rights) Amendment Bill, 2026 (passed)"** |
| Date Issued | **2026-03-24** |
| Type | Part 2 (Other than Questions And Answers) / **GOVERNMENT BILLS** |
| Lok Sabha Number | **18** |
| Session Number | **VII** |
| Handle | https://elibrary.sansad.in/handle/123456789/1537506 |

— Lok Sabha, Parliament Digital Library — https://elibrary.sansad.in/items/44e8c4e0-d2b1-4a0d-92ee-cccae238db1f — **T0**

The word **"(passed)"** is the House's own classification of the sitting's outcome,
not a reporter's. The motion moved is on the record verbatim:

> "सामाजिक न्याय और अधिकारिता मंत्री (डॉ. वीरेन्द्र कुमार) : महोदया, मैं प्रस्ताव प्रस्तुत करता हूं :
>
> कि उभयलिंगी व्यक्ति (अधिकारों का संरक्षण) अधिनियम, 2019 का संशोधन करने वाले विधेयक पर
> विचार किया जाए । (व्यवधान)"
>
> "माननीय सभापति : प्रस्ताव प्रस्तुत हुआ:
>
> कि उभयलिंगी व्यक्ति (अधिकारों का संरक्षण) अधिनियम, 2019 का संशोधन करने वाले विधेयक पर
> विचार किया जाए ।"

**Rendering, not a quotation:** *"Minister of Social Justice and Empowerment (Dr.
Virendra Kumar): Madam, I beg to move: That the Bill further to amend the
Transgender Persons (Protection of Rights) Act, 2019, be taken into consideration.
(Interruptions)"* … *"Hon. Chairperson: Motion moved: …"*

`(व्यवधान)` — "(Interruptions)" — is on the record at the moment the motion is
moved. The first speaker after the minister is on the record in English:

> "SUSHRI S. JOTHIMANI (KARUR): Thank you, Madam, Chairperson. I stand here today
> to oppose the Transgender Persons (Protection of Rights) Amendment Bill, 2026. I
> stand as a representative of the Congress party, the party which is committed to
> justice, dignity and constitutional morality."

**And both chambers and both dates are confirmed on an allowlisted T1 source:**

> "The Bill was passed in Lok Sabha on March 24, 2026 and in Rajya Sabha on
> March 25, 2026."
> — PRS Legislative Research, *Monthly Policy Review: March 2026*
> — https://prsindia.org/policy/monthly-policy-review/march-2026 — **T1**

### What did not land

- **"Voice vote" is NOT upgraded.** Neither PRS document says how either House
  passed the Bill. The passage formula — the Chair putting the question, the Ayes
  and Noes, any division — sits at the **end** of the sitting, and WebFetch
  truncates the 190 KB text extraction from the head. I reached page 1 and roughly
  the first half; I never reached the vote.
  **Consequence: the claim stays exactly where the storyboard already put it.**
  Constraint 8b.1's permitted formulation — *passed by voice vote* — remains
  supported by The Wire (`src-05`) and The Print (`src-06`), both allowlisted T4,
  both already in `sources[]`. **Nothing in this pass contradicts it.** Nothing in
  this pass strengthens it either.
- **Constraint 8b.1 is unchanged and still binds.** Never assert the absence of a
  division. I did not find a division record; I also could not read the page where
  one would appear, which is not the same thing. `sansad.in/ls/business/divisions`
  is a 404, so there is no divisions register to check.
- **The Rajya Sabha record is not in this library.** `elibrary.sansad.in` is a Lok
  Sabha repository; it holds no Rajya Sabha debates. The 25 March sitting, the DMK
  select-committee motion and its rejection are **not** re-anchored and stay on
  src-06.

---

## 4 · Question: how many Acts called "Protection" has Parliament actually passed?

**Answer: TWO. The published primer is wrong — and the storyboard's own correction
is incomplete in a way that matters.**

### The record

| Instrument | Introduced | What happened | Source |
|---|---|---|---|
| **Rights of Transgender Persons Bill, 2014** (private member's, Tiruchi Siva) | Rajya Sabha, 2014 | **Passed by Rajya Sabha in 2015.** Pending in Lok Sabha; lapsed | PRS, `issues-for-consideration-3283` |
| **Transgender Persons (Protection of Rights) Bill, 2016** (government) | Lok Sabha, **Aug 02, 2016** | Referred to Standing Committee **Sep 08, 2016**; report **Jul 21, 2017**; **passed by Lok Sabha Dec 17, 2018**; **lapsed with the dissolution of the 16th Lok Sabha** | PRS Bill Track 2016; PRS `issues-for-consideration-3283` |
| **Transgender Persons (Protection of Rights) Act, 2019** | Lok Sabha, **Jul 19, 2019** | LS **Aug 05, 2019**; RS **Nov 26, 2019**. **ENACTED** | PRS Bill Track 2019 |
| **Transgender Persons (Protection of Rights) Amendment Act, 2026** | Lok Sabha, **Mar 13, 2026** | LS **Mar 24, 2026**; RS **Mar 25, 2026**; assent **Mar 30, 2026**. **ENACTED** | PRS Bill Track 2026; PRS Monthly Policy Review |

**The verbatim evidence, from PRS:**

> "A private member Bill was introduced in Rajya Sabha by Mr. Tiruchi Siva in 2014
> to guarantee rights and provide welfare measures for transgender persons. This
> Bill was passed in Rajya Sabha in 2015, and is currently pending in Lok Sabha. In
> August 2016, the government introduced the Transgender Persons (Protection of
> Rights) Bill, 2016 in Lok Sabha."
>
> "However, the 2016 Bill lapsed with the dissolution of the 16th Lok Sabha. The
> Transgender Persons (Protection of Rights) Bill, 2019 was introduced in Lok Sabha
> on July 19, 2019 to replace the 2016 Bill."
> — PRS Legislative Research, *Issues for Consideration — The Transgender Persons
> (Protection of Rights) Bill, 2019*
> — https://prsindia.org/billtrack/prs-products/issues-for-consideration-3283
> — **T1 · open · ingest: full**

And from PRS's Bill Track record for the 2016 Bill, the field that nobody had
looked at:

| Field | Value |
|---|---|
| Date of Introduction | **"Aug 02, 2016"** |
| Referred to Standing Committee | **"Sep 08, 2016"** |
| Standing Committee report | **"Jul 21, 2017"** |
| Status | **"Passed"** by Lok Sabha on **"Dec 17, 2018"** |

— https://prsindia.org/billtrack/the-transgender-persons-protection-of-rights-bill-2016 — **T1**

### What this settles

- **"Parliament has passed three laws all called 'Protection'" is false.**
  Parliament has passed **two**: the 2019 Act and the 2026 Amendment Act. The
  storyboard's §8i correction is right on the count and the count is what shipped
  wrong. **Confirmed.**
- **But the storyboard's description of the 2016 Bill is incomplete.** §8i says the
  2016 Bill "was introduced, went to the Standing Committee and lapsed." It also
  **passed the Lok Sabha**, on 17 December 2018, and lapsed only because it was
  still pending in the Rajya Sabha when the 16th Lok Sabha dissolved. The published
  timeline's "Parliament introduces a Bill" is equally incomplete. **Do not replace
  one wrong claim with a thinner one.**
- **There is a fourth instrument the issue has never mentioned**, and it is the
  most interesting fact this question turned up: a **private member's Bill passed
  by the Rajya Sabha in 2015**, which then lapsed in the Lok Sabha. Its mover,
  Tiruchi Siva, is the DMK MP who — per off-allowlist reporting I am not citing —
  moved the select-committee referral in the Rajya Sabha on 25 March 2026. **I have
  not confirmed that identification on an allowlisted source and the drafter must
  not use it.** The 2015 passage itself is sourced, above.

**The accurate formulation, and it is stronger than "three laws":** across twelve
years each House passed a transgender-rights Bill that never became law — the
Rajya Sabha in 2015, the Lok Sabha in 2018 — before Parliament passed the 2019 Act
and then amended it in 2026. **Two Acts. Two Bills that cleared one House each.**

**Register warning.** That formulation needs care in plain Indian English: "passed
by one House" is exactly the distinction the published primer collapsed. If the
rewritten primer cannot carry it in its word budget, say **two** and say nothing
about the earlier Bills — a bare "two" is correct, and the timeline row for
2016–2017 can carry the rest.

---

## 5 · Question: six days, eleven days, or seventeen?

**Answer: the introduction date is 13 March 2026, confirmed. The dossier's "six
days" is wrong. The storyboard's "seventeen days" is right.**

> **Date of Introduction (Lok Sabha): March 13, 2026**
> **Date Passed (Lok Sabha): March 24, 2026**
> **Date Passed (Rajya Sabha): March 25, 2026**
> — PRS Legislative Research, *The Transgender Persons (Protection of Rights)
> Amendment Bill, 2026 — Bill Track*
> — https://prsindia.org/billtrack/the-transgender-persons-protection-of-rights-amendment-bill-2026
> — **T1 · open · ingest: full** — **already `src-01` in the issue**

| Interval | Arithmetic | Days |
|---|---|---|
| Introduction → Lok Sabha passage | 13 Mar → 24 Mar | **11** |
| Introduction → Rajya Sabha passage | 13 Mar → 25 Mar | **12** |
| Introduction → assent | 13 Mar → 30 Mar | **17** |
| **Lok Sabha passage → assent** | **24 Mar → 30 Mar** | **6** |
| Lok Sabha passage → Rajya Sabha passage | 24 Mar → 25 Mar | **1** (two sitting days) |

**Where "six days" came from.** Dossier §2 reads: *"received presidential assent on
**March 30, 2026**, six days after its introduction in Lok Sabha on March 13."* Six
is the gap from the **Lok Sabha vote** to assent, not from introduction. The
dossier attached the right number to the wrong pair of dates. **Storyboard §8e
already caught this and its diagnosis is exactly right.** Confirmed independently
here.

- **The published issue never repeats the error** — it carries no
  introduction-to-assent interval at all. Nothing on the live site needs fixing for
  this one.
- **The storyboard's D5 derivations are both correct:** eleven days (13 → 24) and
  seventeen days (13 → 30).
- **Assent on 30 March 2026 is still not anchored on an allowlisted primary.** PRS's
  Bill Track returned no assent date and no Act number to the crawler; the Monthly
  Policy Review gives only the two passage dates. Dossier §9 note 3 stands: the
  date is consistent across sources, the Gazette notification was never fetched.
  **Any "seventeen days" figure inherits that gap**, because its endpoint is the
  assent date. Eleven days (13 → 24) is the interval whose endpoints are both
  anchored, and it is the safer of the two.

---

## Findings outside the brief that the drafter needs

1. **The 5,566 figure has a precise date, and it is earlier than the issue implies.**
   PRS: *"As of March 11, 2026, the number of applications rejected stand at
   5,566."* The published tile 4 note says "As of March 2026". **11 March 2026 is
   two days before the Bill was introduced** — so the figure describes the system as
   it stood *before* the Amendment existed, which is precisely what the
   `data-readout` section is for. Constraint 8b.7 is satisfied and can be sharpened
   from "March 2026" to "11 March 2026" at no word cost. Source: `src-02`, already
   in the issue.
2. **The issue asserts four Articles; PRS names one.** "Articles 14, 15, 19, and 21"
   appears three times in the published file. Both PRS documents name **Article 21**
   only. Not a contradiction — PRS is summarising, not enumerating — but the
   four-article formulation has no allowlisted primary behind it, and the
   storyboard's quiz answer 1 states it. **Flagged for the operator.**
3. **Nineteen contributors are on the Lok Sabha record for this debate**, which sits
   awkwardly beside the dossier §4 line "11 opposition MPs and 4 NDA MPs spoke".
   The record lists: Virendra Kumar, S Jothimani, Anand Bhadauria, T Sumathy Alias
   Thamizhachi Thangapandian, June Maliah, Byreddy Shabari, Supriya Sule, Pratap
   Chandra Sarangi, Arvind Ganpat Sawant, Alok Kumar Suman, Naresh Ganpat Mhaske,
   Gowaal Kagada Padavi, Abhay Kumar Sinha, Shyamkumar Daulat Barve, Balwant
   Baswant Wankhade, Sudha R, Sandhya Ray, Rajesh Ranjan, Kumari Selja. A
   contributor list is not a list of speakers in a debate and the two need not
   reconcile. **Neither the published issue nor the storyboard uses a speaker
   count, so nothing needs fixing** — recorded so nobody adds one.
4. **Two names are confirmed against the House record.** **T. Sumathy** appears as
   *"T Sumathy Alias Thamizhachi Thangapandian"*; the storyboard's short form is
   correct. **S. Jothimani** is *"SUSHRI S. JOTHIMANI (KARUR)"*, Congress — the
   dossier carries her as both "Jothimani" and "S. Jothimani" and the storyboard
   does not name her. Both stand as composed.
5. **The Act's Hindi short title is on the record:** *उभयलिंगी व्यक्ति (अधिकारों का
   संरक्षण) अधिनियम, 2019*. Recorded only so that a future pass does not read
   *उभयलिंगी* as an error. It is not usable copy under the zero-Hindi ruling.

---

## The exact `sources[]` entries to add

Three entries. Ids continue from the existing fifteen and do not collide.

```yaml
  - id: "src-16"
    title: "The Transgender Persons (Protection of Rights) Amendment Bill, 2026 (passed) — Lok Sabha debate, Eighteenth Lok Sabha, Session VII"
    publisher: "Lok Sabha, Parliament of India"
    url: "https://elibrary.sansad.in/items/44e8c4e0-d2b1-4a0d-92ee-cccae238db1f"
    accessedAt: "2026-09-15"
    kind: primary
  - id: "src-17"
    title: "Issues for Consideration — The Transgender Persons (Protection of Rights) Bill, 2019"
    publisher: "PRS India"
    url: "https://prsindia.org/billtrack/prs-products/issues-for-consideration-3283"
    accessedAt: "2026-09-15"
    kind: primary
  - id: "src-18"
    title: "The Transgender Persons (Protection of Rights) Bill, 2016 — Bill Track"
    publisher: "PRS India"
    url: "https://prsindia.org/billtrack/the-transgender-persons-protection-of-rights-bill-2016"
    accessedAt: "2026-09-15"
    kind: primary
```

**Optional fourth**, if the operator wants the two-chamber passage carried by a
source that states it in one sentence. It is in the dossier bibliography but has
never been in `sources[]`:

```yaml
  - id: "src-19"
    title: "Monthly Policy Review: March 2026"
    publisher: "PRS India"
    url: "https://prsindia.org/policy/monthly-policy-review/march-2026"
    accessedAt: "2026-09-15"
    kind: primary
```

**Where each attaches, against the storyboard's §8h coverage map:**

| New id | Rows | What it anchors |
|---|---|---|
| **src-16** | 6, 7 | The Lok Sabha passage at T0: the date, the chamber, the session, the House's own "(passed)". The minister's motion. **The medical board "recommends"** |
| **src-17** | 5, 9 | **"does not provide a mechanism for appeal or review"** — the hero's empty bottom row, second anchor. The NALSA holding. The 2016 Bill's lapse |
| **src-18** | 2 | The 2016 Bill: introduced Aug 2016, Standing Committee Sep 2016, report Jul 2017, **passed by Lok Sabha Dec 2018**. Answers question 4 |
| src-19 | 6 | Both chambers, both dates, one sentence |

**This clears the storyboard's one orphan.** §8h reports src-09 orphaned by ruling
5 (the UN statement is cut). Adding three anchored sources against one orphan
leaves the issue with eighteen entries, seventeen of them live.

---

## Closing table

| # | Anchor / question | Status | What to cite | Note |
|---|---|---|---|---|
| 1 | **NALSA (2014)** from `sci.gov.in` | **NOT RE-ANCHORED** | keep src-04, src-12; add **src-17** for the holding and the citation | `sci.gov.in` is a blanket 403; `main.sci.gov.in` and `digiscr.sci.gov.in` no longer resolve; the Internet Archive is tool-blocked. PRS (T1) now anchors **(2014) 5 SCC 438** and an Article 21 holding. **The surgery-precondition holding and the four-Article formulation remain on newspapers only.** Constraint 8b.4 stands — the date stays out |
| 2 | **The Act + Amendment** from `indiacode.nic.in` | **NOT REACHED — but the appeal question is SETTLED** | **src-02** (already in the issue) + **src-17** | India Code is a blanket 403 and the Bill PDF will not parse, so **dossier §9 note 1 is confirmed, not fixed**: clause numbers stay unstated (8b.3). **The hero's empty bottom row is VERIFIED** on two PRS documents: *"does not provide a mechanism for appeal or review"* (2019) and *"The Act does not provide for any kind of redressal mechanism … The Bill also does not address this"* (2026). T1, which clears the §5 gate. **The hero does not change** |
| 3 | **The March 2026 passage** from `sansad.in` | **PARTLY RE-ANCHORED (T0)** | **src-16**; keep src-05, src-06 for the voice vote | The Lok Sabha's own record titles the item **"(passed)"**, dated 2026-03-24, LS 18, Session VII. The minister's motion is on the record, and **"बोर्ड सिफारिश करेगा" — the board recommends — anchors constraint 8b.2 at T0.** **"Voice vote" could NOT be upgraded** (the passage formula sits past the fetch truncation) and stays on the two newspapers. The Rajya Sabha sitting is not in this library and is not re-anchored |
| 4 | **How many Acts called "Protection"?** | **SETTLED — TWO** | **src-17**, **src-18** | The published primer's "three laws" is false. **But the storyboard's own correction is incomplete:** the 2016 Bill did not merely lapse at committee, it **passed the Lok Sabha on 17 Dec 2018** and lapsed pending in the Rajya Sabha. And a 2014 private member's Bill **passed the Rajya Sabha in 2015**. Two Acts; two Bills that cleared one House each |
| 5 | **Six days, or seventeen?** | **SETTLED — 17** | **src-01** (already in the issue) | Introduction **13 March 2026** confirmed. 13 → 24 = **11 days**; 13 → 30 = **17 days**; the dossier's "six" is the **24 → 30** gap misattributed. The published issue never repeats it. **Caveat: the 30 March assent date is still unanchored on the allowlist, so "eleven days" is the safer figure** |
| — | **The minister's quote** | **⚠️ CONTRADICTED BY THE RECORD, unresolved** | see READ FIRST | The House record has him saying **जैविक स्थिति** — "biological condition" — where the published English says "gender identity". I have page 1 only and cannot exclude that The Print translated a later sentence. **Do not present the English as the minister's own words without attributing it to The Print** |

**Net: one anchor landed at T0 and over-delivered, one question the hero depended
on is settled in the issue's favour, both factual questions are answered, two of
the three primaries are unreachable for reasons now documented, and one published
quotation needs an attribution fix.**

---

## For the operator to rule

1. **The minister's quote.** The record says *biological condition*; the issue
   prints *gender identity*. My recommendation: keep the English, attribute it to
   The Print's report of the debate, and do not call it the minister's own words.
   Quoting the record instead would put Hindi in the issue, which ruling 7 forbids
   and which §8i's own logic about the statutory list would arguably permit. **This
   is the one item in the pass that needs a decision before the draft.**
2. **`indiankanoon.org` onto the politics allowlist?** It is the only accessible
   full text of NALSA, and NALSA is the issue's founding legal claim. The Supreme
   Court's own archive refusing crawlers is not going to change. Without it, a
   2014 holding this issue is built on stays sourced to newspapers. *My reading:
   worth a ruling on its own merits, not under time pressure from this issue —
   the storyboard is already composed so that nothing depends on it.*
3. **"Articles 14, 15, 19, and 21."** Asserted three times in the published file
   and in the storyboard's quiz answer 1; PRS names Article 21. Leave it (it is
   almost certainly correct and is carried by three allowlisted newspapers), or
   soften to Article 21 where the primary is doing the work? *My reading: leave it,
   and know that it rests on T4.*
4. **The surgery-precondition holding.** "Surgery or medical certification cannot
   be made a precondition" is in the published timeline and is the hinge of the
   ratchet argument. **No allowlisted primary states it.** Same choice as 3, with
   higher stakes, because this one is load-bearing rather than decorative.
5. **How much of the 2016 Bill's history to carry.** "Two Acts" is correct and
   short. "Two Acts, and two Bills that each cleared one House" is correct, richer,
   and costs the primer words it does not have. The timeline's 2016–2017 row is the
   natural home. *My reading: primer says two; the timeline row carries the Lok
   Sabha passage of Dec 2018, which is a better fact than "a committee reported".*
6. **Three new sources, or four?** src-16, src-17, src-18 are the pass's output.
   src-19 (PRS Monthly Policy Review) is optional and duplicates dates src-01
   already carries.
7. **One off-allowlist headline I am flagging rather than using.** A national
   outlet not on the allowlist published its 24 March report under a slug reading
   `lok-sabha-passes-transgender-bill-amid-division`. "Division" there most likely
   means political division rather than a recorded vote, and **I did not cite it,
   did not read it as evidence, and draw no conclusion from it.** But constraint
   8b.1 exists precisely because nobody has read the end of that sitting, and this
   is one more reason to keep the constraint absolute: **say "voice vote" on the
   authority of src-05 and src-06, and say nothing whatever about divisions.**
