# Re-anchoring pass: the seven Opta-attributed numbers

- **Category:** sports
- **Issue:** `src/content/issues/2026-06-04-arsenal-set-piece-title/index.mdx` (published)
- **Dossier:** `research/sports/2026-06-04-arsenal-set-piece-title-dossier.md` (§0, §9 — untouched by this pass)
- **Verification report:** `research/sports/2026-06-04-arsenal-set-piece-title-verification.md` (required fix #5 — untouched)
- **Storyboard:** `research/sports/2026-09-13-arsenal-set-piece-title-storyboard.md` (§9, ruling 6 — the ruling this file answers)
- **Researched:** 2026-09-13
- **Researcher:** researcher-agent
- **Scope:** NARROW. Seven counting statistics only. No new argument, no new structure, no edit to any other file.

> **Operator ruling 6 (storyboard §9), verbatim:** *"The seven Opta-attributed
> numbers are re-anchored by a researcher pass BEFORE this draft — 27 conceded,
> 28.5 xGA, 25 set-piece goals, 19 corner goals, 238 days top, 200 consecutive,
> the 19 May clinch. The pass writes `research/sports/2026-09-13-arsenal-re-anchoring.md`
> (a separate file; the dossier … is untouched). The drafter reads it and uses its
> attributions; where a number could not be re-anchored, the drafter keeps the Opta
> attribution and says so in the source line, and no `# EDITOR:` flag ships as
> visible copy."*

---

## ⚠️ READ FIRST — one figure is CONTRADICTED and must not be used

**`28.5` expected goals against is wrong.** Opta's own published full-season
figure is **`28.3`**. The published issue attributes 28.5 to Opta; Opta prints
28.3. No allowlisted source anywhere carries 28.5.

> "Arsenal conceded just 28.3 expected goals (xG) across their domestic campaign,
> the best figure not only in England but across Europe's top five leagues."
> — Opta Analyst, 19 Aug 2026

**The drafter must use 28.3, not 28.5.** This lands on storyboard row 3, tile 2.

### A second contradiction, outside the seven but load-bearing

**"A quarter of their goals from set pieces" is wrong** — it is **more than a
third**. It appears in the published `primer`, in the `paradox` and in the
`comparison` row. Opta's own framing is both more accurate and much stronger:

> "Perhaps unsurprisingly, this all translates to Arsenal being on track to score
> the greatest proportion of non-penalty goals from set-pieces among all Premier
> League champions, with 35.9% of theirs coming via dead-ball situations."
> — Opta Analyst, 15 May 2026

Full-season arithmetic agrees: 71 league goals, 29 set-piece goals of which 4
were penalties → 25 of 67 non-penalty goals = **37.3%**. The storyboard does not
carry the "quarter" phrasing forward in any row, so this is a *do-not-reintroduce*
note rather than a fix — but the primer is being rewritten and must not restate it.

---

## The thing that unblocks this issue

**The dossier's core premise is stale.** Dossier §0 says the counting stats'
"only homes are off-allowlist (Premier League official, Opta/The Analyst,
Arsenal.com)". That was true on **2026-06-04**. `research/_sources/sports.md`
was revised on **2026-06-21** — seventeen days later — and both are now
**on the allowlist**:

| Source | Line | Tier / fields |
|---|---|---|
| **Premier League — Official Statistics** — `premierleague.com` | `sports.md` L32 | T0 · access: open · ingest: live · viewpoint: n/a · cadence: live |
| **Opta Analyst (Stats Perform)** — `theanalyst.com` | `sports.md` L98 | T7 · access: open · ingest: live · viewpoint: analytics · cadence: live |

Both are in the file's WebFetch block (L110, L147). The Guardian hand-read that
dossier §9 called "the recommended path" is **no longer required** — the figures
can be cited directly, from the body that collects them and from the league that
publishes them. Six of the seven are now anchored on that basis.

**One gate caveat the operator should see.** `_TAXONOMY.md` §5 wants a
**T0/T1/T2 primary anchor** for load-bearing facts. Five of the six re-anchored
numbers rest on **T7** (Opta Analyst). The T0 source (premierleague.com) carries
the same data — Opta collects it for the league — but its statistics tables
(`/clubs/3/arsenal/stats`, `/stats/top/clubs/expected-goals-conceded/2025-26`)
are JavaScript-rendered and return **no data to the crawler**; only the league's
*editorial* pages fetch. So the anchor tier is weaker than ideal, while the
provenance is the strongest available: Opta is the league's own data collector,
and The Analyst is Stats Perform's own masthead. **This is a judgement call for
the operator, flagged rather than decided** (see "For the operator to rule").

### Tools and failures logged

- **`mcp__parallax_rag__search` was not available in this session** (no RAG MCP
  tool in the tool set). Fell back entirely to the allowlisted WebSearch/WebFetch
  flow, per the researcher brief.
- **Did not render for the crawler:** `premierleague.com/en/clubs/3/arsenal/stats`;
  `premierleague.com/en/stats/top/clubs/expected-goals-conceded/2025-26`;
  `understat.com/team/Arsenal/2025` (T1 — its season JSON is JS-injected).
- **Dead URL corrected:** the dossier's Premier League clinch link
  (`/4662306/arsenal-end-22-year-wait-for-premier-league-title/`) returns **404**.
  The live URL is `/4662306/arsenal-win-2025-26-premier-league-title-ending-22-year-wait-to-be-crowned-champions-again`.
- **`fbref.com` (T1) not used as an anchor:** the allowlist records that it lost
  the Opta licence in Jan 2026 (`ingest: metadata`, `cadence: archival`), so any
  2025-26 xG it carries is a different model. Citing it against an Opta figure
  would compare two models, not verify one.
- **Not quoted from anywhere:** Arsenal.com, StatMuse, Wikipedia, Sky Sports — all
  off-allowlist. Used only to confirm that the one unanchored figure is not
  disputed (see number 6).

### The dating trap that explains most of the apparent disagreements

Arsenal were confirmed champions in **Matchweek 37** and played one more game
(a 2-1 win at Crystal Palace on the final day). **Every Opta piece published on
19 May 2026 is therefore a 37-game snapshot, not a season total.** That single
fact reconciles 26-vs-27 conceded, 18-vs-19 corners and 28-vs-29 set-piece goals.
The dossier already caught the first of these; it is the same effect each time.

---

## 1 · `27` goals conceded, fewest in the league

**Status: RE-ANCHORED. Exact, full-season. Two independent Opta pieces.**

> "They conceded just 27 goals in the league last season, eight fewer than any
> other side."
> — Opta Analyst, *Can Arsenal Win Back-to-Back Titles? Five Questions For
> Reigning Champions Ahead of New Season*, Oliver Hopkins & Matt Sisneros,
> 19 Aug 2026 — https://theanalyst.com/articles/arsenal-premier-league-title-defence-2026-27-preview
> — **T7 · open · live · analytics**

> "Arsenal conceded just 27 goals all season. That was eight fewer than any other
> side (Man City next best on 35)."
> — Opta Analyst, *Premier League Team of the Season: Opta Analyst's 2025-26 XI*,
> 25 May 2026 — https://theanalyst.com/articles/premier-league-team-of-the-season-2025-26-opta
> — **T7 · open · live · analytics**

- **Figure is exact and full-season (38 games).** The dossier's correction —
  27, not the candidate's 26 — is **confirmed**.
- **Where 26 came from:** Opta's 19 May piece says *"They have conceded just 26
  league goals this season, at least six fewer than any other side, and the
  second-fewest they've ever conceded in a Premier League campaign behind
  1998-99 (17)."* That is the Matchweek-37 figure. They conceded once more at
  Crystal Palace on the final day.
- **Upgrade available to the drafter.** "Fewest in the division" is the weak form
  of this fact. Opta's own form is concrete and comparative: **eight fewer than
  any other side; Manchester City next best on 35.** That is a better tile note
  than "Across 38 games." and costs no extra words.

---

## 2 · `28.5` expected goals against, lowest in the league

**Status: CONTRADICTED. The correct figure is `28.3`. Do not use 28.5.**

> "Arsenal conceded just 28.3 expected goals (xG) across their domestic campaign,
> the best figure not only in England but across Europe's top five leagues."
> — Opta Analyst, Oliver Hopkins & Matt Sisneros, 19 Aug 2026
> — https://theanalyst.com/articles/arsenal-premier-league-title-defence-2026-27-preview
> — **T7 · open · live · analytics**

Corroborating, same provider, mid-season snapshot:

> "Arsenal have allowed chances worth only 0.74 expected goals per game this
> season. As far back as Opta have advanced expected goals data (2012-13), that
> is the fourth-best figure ever recorded in a Premier League campaign."
> — Opta Analyst, *The 10 Defining Numbers Behind Arsenal's Premier League Title
> Win*, Oliver Hopkins, 19 May 2026
> — https://theanalyst.com/articles/how-arsenal-won-premier-league-title-10-numbers-stats
> — **T7 · open · live · analytics**

- **0.74 × 38 = 28.1**, which sits with 28.3 and not with 28.5. The arithmetic
  corroborates the contradiction rather than resolving it in 28.5's favour.
- **28.5 could not be traced to any source, allowlisted or otherwise.** It is not
  a rival provider's figure that was mislabelled — Understat (T1) does not render
  for the crawler and FBref (T1) is off its Opta licence since Jan 2026, so
  neither could be checked, but the published issue attributes the number to
  **Opta**, and Opta's published number is 28.3.
- **A dossier instruction is superseded here — flag for the drafter.** Dossier §4
  and §9 tell the drafter to keep "lowest league xGA" and "lowest in Europe's big
  five" as two separate claims that must never be merged. Opta merges them itself:
  the 28.3 domestic figure **is** "the best figure not only in England but across
  Europe's top five leagues". Storyboard constraint 8d-2 ("never merge the two xGA
  measurements") was written against the dossier's reading and is now stricter
  than the source requires.
- **And the dossier appears to have mis-assigned the per-game numbers.** Dossier
  §4 presents "goals conceded 0.7, shots faced 8.2, shots on target faced 2.4,
  xGA 0.7" as a **Champions League** profile. Opta's 19 May piece gives those as
  **Premier League** per-game figures benchmarked against big-five clubs:
  *"Arsenal have conceded just 8.2 shots per game and 2.4 shots on target per
  game, both the best figures across Europe's top five leagues this season."*
  The "Champions League per-game profile of 0.7" in the published tile note is
  therefore **[UNVERIFIED]** and probably a misreading. Safest course: tile 2's
  note drops the CL comparison entirely and says only what Opta says.

---

## 3 · `25` set-piece goals excluding penalties, most in the division

**Status: RE-ANCHORED — but as a subtraction on one sourced sentence, not as a
printed figure. Opta prints `29`, penalties included.**

> "They scored 19 goals from corners, setting a new Premier League record in the
> process. They scored another 10 from other dead balls – four from free-kicks,
> four penalties and twice from throw-ins. Their total of 29 set-piece goals was
> comfortably the highest in the division."
> — Opta Analyst, Oliver Hopkins & Matt Sisneros, 19 Aug 2026
> — https://theanalyst.com/articles/arsenal-premier-league-title-defence-2026-27-preview
> — **T7 · open · live · analytics**

**The derivation, both routes agreeing:**

| Route | Working | Result |
|---|---|---|
| Subtract penalties from the total | 29 − 4 penalties | **25** |
| Add the non-penalty components | 19 corners + 4 free-kicks + 2 throw-ins | **25** |

- **The figure `25` is exact and correct, and is a computation, not a quotation.**
  Opta's printed headline is 29 including penalties. The drafter may use 25, but
  the source line must not imply Opta printed it.
- **Definitional warning — this is the one real exposure on this number.**
  "Comfortably the highest in the division" is sourced for **29 (penalties
  included)**. Opta does not state that Arsenal also led the division on the
  penalties-excluded measure. Storyboard tile 3 reads *"25 · Set-piece goals,
  penalties excluded · Most in the division."* — the value is safe, the
  **"most in the division" clause is an inference** on the excluded-penalties
  measure. It is very likely true (they led by a wide margin on the inclusive
  measure and took only four penalties), but it is not sourced as stated.
- **Two clean ways out, drafter's choice:**
  1. **Use 29** — "29 set-piece goals, including four penalties" — which is
     directly quotable *and* carries "comfortably the highest in the division"
     with it. Costs the "penalties excluded" purity the dossier fought for.
  2. **Keep 25**, and let the note carry the derivation: "Nineteen from corners,
     four from free-kicks, two from throw-ins. Four penalties excluded." That is
     fully sourced, and it is more concrete than the current tile.
  Recommendation: **option 2** — it keeps the issue's existing number, states its
  own arithmetic, and the breakdown is better copy than the bare total.
- **The corner total may exclude own goals.** Opta's 15 May piece phrases it
  *"Their 17 goals (excluding own goals) from corners in 2025-26"*. Consistent
  with the 19 figure; noted so the drafter does not add an own-goal caveat that
  the final-season sentences do not carry.
- **Bonus, fully sourced, and stronger than anything currently in the issue:**
  *"the greatest proportion of non-penalty goals from set-pieces among all Premier
  League champions, with 35.9% of theirs coming via dead-ball situations"* and
  *"Arsenal's 64.1% of non-penalty goals coming in open play will be comfortably
  the lowest by a team to win the Premier League"* (Opta Analyst, Ryan Benson,
  15 May 2026 — https://theanalyst.com/articles/arsenal-open-play-set-pieces-stats-premier-league).
  Both are 36-game "on track" framings; the full-season arithmetic (25 of 67
  non-penalty goals = 37.3%) lands slightly higher, so the claim held.

---

## 4 · `19` goals from corners, a Premier League record; previous high `16`

**Status: RE-ANCHORED. Exact, full-season. And the dossier's "conflict" over the
previous record-holder was a FALSE conflict — it is resolved.**

> "Eberechi Eze's winner against Newcastle was Arsenal's 17th goal from a corner
> in this Premier League season, the most by any side in a single campaign in the
> competition (finishing on 19)."
> — Opta Analyst, *The 139 Best Opta Facts of the 2025-26 Premier League Season*,
> 25 May 2026 — https://theanalyst.com/articles/best-premier-league-facts-of-the-2025-26-season-opta
> — **T7 · open · live · analytics**

> "They scored 19 goals from corners, setting a new Premier League record in the
> process."
> — Opta Analyst, Oliver Hopkins & Matt Sisneros, 19 Aug 2026
> — https://theanalyst.com/articles/arsenal-premier-league-title-defence-2026-27-preview
> — **T7 · open · live · analytics**

On the previous record, from the dedicated Opta piece:

> "That total was a record that had remained unbroken for 32 full seasons. Until
> now." … "Tony Pulis' West Bromwich Albion equalled the record in 2016-17, before
> Arsenal did the same in 2023-24."
> — Opta Analyst, *Set-Piece Kings: Arsenal Break Record for Most Goals Scored
> From Corners in a Premier League Season*, Oliver Hopkins, 25 Apr 2026
> — https://theanalyst.com/articles/arsenal-most-goals-from-corners-premier-league-season-record
> — **T7 · open · live · analytics**

- **The previous mark of 16 was SET by Oldham Athletic in 1992-93** (the Premier
  League's first season — "a record that had stood since the very first season",
  "unbroken for 32 full seasons"), then **EQUALLED** by West Bromwich Albion in
  2016-17 and by Arsenal themselves in 2023-24.
- **Dossier §4's warning is therefore obsolete.** It flagged a contradiction
  between "Oldham Athletic's 1992-93" and "Tony Pulis' West Bromwich Albion in
  2016/17" and instructed: *"Do not assert the prior record-holder."* Both source
  claims were true of different events — one set the record, the other equalled
  it. **Storyboard standing constraint 8d-3 can be relaxed if the operator wants
  it relaxed** — but that is an operator call, not mine, and the safe phrasing
  ("the previous Premier League high was 16") remains correct and costs nothing.
  The genuinely interesting fact, if a tile note has room: Arsenal had already
  equalled the record themselves in 2023-24 before breaking it.
- **The 17 / 18 / 19 progression is a dating artefact, not a disagreement:**
  17 on 25 Apr (the record-breaking goal), 18 by the 19 May clinch, **19** at the
  final whistle of the season. The 25 May piece states the endpoint explicitly —
  "(finishing on 19)".

---

## 5 · `238` days top of the table

**Status: RE-ANCHORED — with one honest caveat: the sentence is prospective.**

> "Come the end of the season on Sunday, they will have led the league for 238
> days this season, 204 more days than Liverpool and a huge 229 more days than
> City."
> — Opta Analyst, *The 10 Defining Numbers Behind Arsenal's Premier League Title
> Win*, Oliver Hopkins, 19 May 2026
> — https://theanalyst.com/articles/how-arsenal-won-premier-league-title-10-numbers-stats
> — **T7 · open · live · analytics**

- **Figure is exact and full-season, but written in the future tense** — it is
  Opta projecting forward to the final Sunday from a Matchweek-37 vantage. Arsenal
  stayed top (they won the final day 2-1 at Crystal Palace and lifted the trophy),
  so the projection resolved. No later Opta piece restates 238 as a completed
  fact, so this is the best anchor available and it is a sound one.
- **Do not confuse with two other day-counts in the same article** — this is the
  single easiest error to make here:
  - **562 days** — cumulative "since the start of 2022-23", i.e. four seasons.
  - **232 days** — Arsenal's own 2022-23 total, *"still the record for the most
    days spent top by a side who've failed to go on to win the title."*
- **Wording note:** the published tile label reads "Nights spent top of the
  table"; Opta says "led the league for 238 **days**". The dossier §4 also says
  "238 nights". Nothing sources "nights". Use **days**.

---

## 6 · `200` consecutive days top

**Status: NOT RE-ANCHORED — the Opta attribution stands.**

**What I tried, all of it allowlisted:**

| Attempt | Result |
|---|---|
| Opta Analyst, *10 Defining Numbers* — full text of the "238 – Days Spent Top of the Table" section, fetched twice with different prompts | **No consecutive-run claim anywhere in the section.** It carries only the 238 season total, the 232-day 2022-23 comparison and the 562-day four-season cumulative figure |
| Opta Analyst, *139 Best Opta Facts of the 2025-26 Season* | Arsenal facts present, none about days top |
| Opta Analyst, *Team of the Season 2025-26* | Defensive figures only |
| Opta Analyst, *2026-27 title-defence preview* | Season totals only |
| Targeted WebSearch scoped to `theanalyst.com` + `premierleague.com` for "238 days" / "200 days in a row" | Returned the 238 figure only; search engine explicitly reported no consecutive-days reference on those domains |
| Premier League official, clinch and season-decided articles | No day-count of any kind |

- **The claim is not disputed — it is merely unciteable here.** It appears
  consistently across **Arsenal.com** (the club's own site), StatMuse and
  Wikipedia: 200 consecutive days between October and April, longer than any of
  Arsenal's previous title runs, ninth-longest such run in Premier League
  history, ended when Manchester City edged above them on goals scored in late
  April before Arsenal won four straight without conceding to reclaim top spot.
  **All three are off-allowlist. None is quoted in this file and none may be
  cited.** I record the substance only so the operator knows the figure is
  sound-but-unanchored rather than doubtful.
- **The sub-claims travel with it and are equally unanchored:** "longer than any
  of Arsenal's previous title runs" and "ninth-longest in Premier League history"
  (the latter is in dossier §4 and has never had an allowlisted home).
- **Per operator ruling 6, this is the one number where the drafter keeps the
  Opta attribution and says so in the source line.**
- **Cheapest alternative, if the operator prefers no unanchored figure at all:**
  storyboard tile 5's note ("Including 200 in a row.") is the only place it
  appears. Dropping that one clause leaves the fully-anchored 238 standing alone,
  and Opta's own comparative — *"204 more days than Liverpool"* — is available to
  fill the note with a sourced number instead. That swap costs the issue nothing
  and clears the last flag.

---

## 7 · The `19 May 2026` clinch, Manchester City `4` points behind

**Status: RE-ANCHORED — and this is the one T0 anchor in the set.**

> "Arsenal are the 2025/26 Premier League champions, winning the title for the
> first time in 22 years."

> "Manchester City's 1-1 draw at AFC Bournemouth on Tuesday night leaves them
> four points adrift of first place in the Premier League table."

> "Arsenal's success follows three consecutive seasons in which they finished as
> runners-up, including in 2023/24 when Man City pipped them to the title by an
> agonising margin of two points."
> — Premier League (official), *Arsenal end 22-year wait for Premier League
> title*, Sam Cunningham, 19 May 2026
> — https://www.premierleague.com/en/news/4662306/arsenal-win-2025-26-premier-league-title-ending-22-year-wait-to-be-crowned-champions-again
> — **T0 · open · live · viewpoint: n/a**

And for "with a game to spare", plus the final numbers:

> "Mikel Arteta's side finished on 85 points, seven points clear of second-placed
> Man City."
> — Premier League (official), *EVERYTHING that's been decided in 2025/26 Premier
> League*, 24 May 2026
> — https://www.premierleague.com/en/news/4668605/everything-thats-been-decided-in-202526-premier-league
> — **T0 · open · live · viewpoint: n/a**

- **Every component of the tile is now T0-anchored:** the date (19 May 2026), the
  mechanism (City's 1-1 draw at Bournemouth), the gap (**four points adrift**),
  the 22-year wait, and the three consecutive runner-up finishes — the last of
  which the dossier could previously anchor only as Coaches' Voice *framing*.
- **"With a game to spare" is confirmed:** the title was settled in **Matchweek
  37**; Arsenal then won 2-1 at Crystal Palace on the final day and lifted the
  trophy there.
- **Note the two different gaps, and do not let them collide.** **Four points**
  is the gap *at the moment of confirmation* (City, one game left) — this is the
  tile's number. **Seven points** is the *final* margin. Storyboard tile 6's note
  says "Manchester City drew and finished four points behind", which conflates
  them: City **finished** seven behind; they were four behind *when the title was
  confirmed*. **This needs a one-word fix in the draft** — "and were four points
  behind" rather than "finished four points behind".
- **URL correction for `sources[]`:** the dossier's link 404s. Use the URL above.
  (Storyboard 8a says all six `sources[]` entries stay unchanged; that is still
  true — the Premier League is not currently among the six. If the drafter adds
  it as a citation, it is an allowlisted T0 addition, which is the operator's
  call under "no new source" — see below.)

---

## Closing table

| # | Number | Status | Source to cite | Note |
|---|---|---|---|---|
| 1 | **27** goals conceded, fewest in the league | **RE-ANCHORED** | Opta Analyst, 19 Aug 2026 (`/arsenal-premier-league-title-defence-2026-27-preview`) · corroborated 25 May 2026 (`/premier-league-team-of-the-season-2025-26-opta`) · **T7** | Exact, full-season. Opta's 19 May "26" is the Matchweek-37 snapshot. Upgrade the note to Opta's own form: "eight fewer than any other side; Man City next on 35." |
| 2 | **28.5** expected goals against, lowest | **CONTRADICTED** | — use **28.3** — Opta Analyst, 19 Aug 2026 · **T7** | **Do not use 28.5.** Opta prints 28.3; 0.74/game × 38 corroborates. Also: Opta itself says the domestic figure is best across Europe's big five, so the dossier's never-merge rule is stricter than the source. The "Champions League per-game profile of 0.7" in the published tile is a probable misreading — drop it. |
| 3 | **25** set-piece goals, penalties excluded | **RE-ANCHORED (as a derivation)** | Opta Analyst, 19 Aug 2026 · **T7** | Opta prints **29 including 4 penalties**; 29 − 4 = 25, and 19 corners + 4 free-kicks + 2 throw-ins = 25. "Most in the division" is sourced for **29**, not for the penalties-excluded measure — state the breakdown rather than asserting the rank. |
| 4 | **19** goals from corners, record; previous high **16** | **RE-ANCHORED** | Opta Analyst, 25 May 2026 (`/best-premier-league-facts-of-the-2025-26-season-opta`) · 19 Aug 2026 · record detail 25 Apr 2026 (`/arsenal-most-goals-from-corners-premier-league-season-record`) · **T7** | Exact, full-season — "(finishing on 19)". The dossier's Oldham-vs-WBA conflict was **false**: Oldham **set** 16 in 1992-93; WBA **equalled** it 2016-17; Arsenal equalled it 2023-24. Prior-holder is now assertable if the operator lifts constraint 8d-3. |
| 5 | **238** days top of the table | **RE-ANCHORED** | Opta Analyst, 19 May 2026 (`/how-arsenal-won-premier-league-title-10-numbers-stats`) · **T7** | Exact, but written prospectively ("Come the end of the season … they will have led"). Resolved as projected. Say **days**, not "nights". Do not confuse with 562 (four-season cumulative) or 232 (2022-23). |
| 6 | **200** consecutive days top | **STANDS ON OPTA — not re-anchored** | none available; keep the Opta attribution in the source line, per ruling 6 | Absent from every Opta and Premier League page fetched, including the full "238 days" section. Substance uncontested but only on Arsenal.com / StatMuse / Wikipedia — all off-allowlist, none quoted here. Cheapest clean fix: drop the clause and use Opta's sourced "204 more days than Liverpool" instead. |
| 7 | **19 May 2026** clinch, City **4** points behind | **RE-ANCHORED (T0)** | Premier League official, 19 May 2026 (`/4662306/arsenal-win-2025-26-premier-league-title-ending-22-year-wait-to-be-crowned-champions-again`) · **T0** | Strongest anchor in the set. Also anchors the 22-year wait and the three runner-up finishes. **Fix needed:** four points was the gap *at confirmation*; City **finished** seven behind (Premier League, 24 May 2026). Dossier's URL 404s — use the one given. |

**Net: five re-anchored outright, one re-anchored as a stated derivation, one
contradicted, one standing on Opta.** Six of the seven `# EDITOR:` flags can be
cleared; one number must be changed; one flag converts into a visible source-line
attribution.

---

## For the operator to rule

1. **The T7 anchor tier.** Five of six re-anchored numbers rest on Opta Analyst
   (**T7**), not on a T0/T1/T2 primary as `_TAXONOMY.md` §5 prefers. The T0 source
   (premierleague.com) publishes the same Opta-collected data but only behind
   JavaScript the crawler cannot read. Accept T7 as the anchor for the counting
   stats, or commission a hand-read of the league's own statistics tables?
   *My reading: accept. Opta is the league's official collector, The Analyst is
   Stats Perform's own masthead, and two independent Opta pieces agree on the
   load-bearing figures. But it is your gate, not mine.*
2. **`28.5` → `28.3` is a change to a published number.** It is a correction, not
   a rewrite choice, so I have flagged it rather than treated it as settled.
3. **"A quarter" must not survive the rewrite.** It is in the current primer and
   is wrong by ~11 points. Opta's "greatest proportion of non-penalty goals from
   set-pieces among all Premier League champions, 35.9%" is stronger, sourced,
   and already fits the issue's argument.
4. **Do you want `25` or `29` set-piece goals?** 25 is the issue's existing number
   and is correct but derived; 29 is Opta's printed headline and carries "the
   highest in the division" with it. The storyboard assumes 25.
5. **Storyboard constraint 8d-3** ("never assert the previous corner record-holder")
   is now obsolete on the evidence. Lift it or leave it — the safe phrasing still
   works either way.
6. **Does the Premier League official page enter `sources[]`?** Storyboard 8a says
   all six sources stay unchanged because no fact is new. No fact *is* new — but
   the anchors for six of them are. Adding `premierleague.com` (T0) and
   `theanalyst.com` (T7) would make the issue's provenance match this file. That
   changes the published `sources[]` array, which is your call under ruling 8.
7. **`19` clean sheets (David Raya)** — outside the seven, and the storyboard cuts
   the tile, so I did not chase it hard. Flagging it because §8c calls it "the
   cheapest thing to restore": **it is not re-anchored.** The nearest Opta figure
   is *"Arsenal kept 15 clean sheets in their 26 league starts together"* (Team of
   the Season, 25 May 2026), which measures a centre-back pairing over 26 games —
   a different thing entirely. If you restore that tile, it restores an unanchored
   number.
