# Jev panel grade: 2026-09-22-eleven-bills-fifteen-percent-panel-2.md

- **Storyboard:** research/politics/2026-09-21-eleven-bills-fifteen-percent-storyboard.md
- **Panel:** research/politics/2026-09-22-eleven-bills-fifteen-percent-panel-2.md
- **Run:** 2026-09-28 · typesafe/jev-1.13-20260917 via openrouter · threshold p ≥ 0.90
- **Cost:** $0.00025 · 12 calls · 1.3 s

> A second opinion on the reader panel's own grades (docs/COST-PLAN.md CP-06). Each persona's
> answer was graded against the storyboard's model answer, one answer per Jev call, with the
> panel's grade and commentary removed. The panel's grade stands, and a disagreement is a place to look.

**Agreement:** 10 of 12 (83%) · on Jev's confident grades (p ≥ 0.90): 7 of 7 (100%)

| Q | Persona | Panel | Jev | p | Agree | Reader answer (as graded) |
|---|---|---|---|---|---|---|
| 1 | Aarav | correct | correct | 0.80 | yes | Worked 15% of its scheduled time, still passed 11 of 12 bills. |
| 1 | Meera | correct | correct | 0.91 | yes | Worked 15% of its scheduled time, still passed 11 of 12 bills. (same, straight from the hook and row 1.) *(resolved "same")* |
| 1 | Sana | correct | correct | 0.85 | yes | Only 15% time used, still 11/12 bills through. |
| 1 | Karthik | correct | correct | 0.99 | yes | 15% scheduled-time utilisation, 11/12 bill throughput. |
| 2 | Aarav | correct | correct | 0.96 | yes | None. Zero of the eleven passed bills went through committee scrutiny (the required-8 row shows 0). |
| 2 | Meera | correct | correct | 0.92 | yes | Bills passed after committee scrutiny: 0. |
| 2 | Sana | correct | correct | 0.90 | yes | Not even one — zero of eleven had a committee look at them first. |
| 2 | Karthik | correct | correct | 1.00 | yes | 0 of 11; the one bill that did go to committee is the twelfth, which is not among the eleven that passed. |
| 3 | Aarav | partly | correct | 0.72 | **no** | The government. It decides when a session ends [row 8 quote] and it controls the calendar committees need [row 6], so it decides how much time examination gets. |
| 3 | Meera | partly | correct | 0.63 | **no** | government owns the clock → controls prorogation and the legislative calendar → that's why committees don't get time. |
| 3 | Sana | partly | partly | 0.90 | yes | The government decides when it ends, for sure [the quote]. Referral is more like... because they control the calendar, committees don't get their turn. |
| 3 | Karthik | partly | partly | 0.70 | yes | Explicit for session-end (Article 85 cited as source, prorogation stated as government's prerogative in the quote). Implicit only for referral and convening — inferred from calendar control, not state |

## Panel grade (rows) against Jev grade (columns)

| Panel \ Jev | correct | partly | wrong | not in the draft |
|---|---|---|---|---|
| correct | 8 | 0 | 0 | 0 |
| partly | 2 | 2 | 0 | 0 |
| wrong | 0 | 0 | 0 | 0 |
| not in the draft | 0 | 0 | 0 | 0 |

## Disagreements

- **Q3 · Aarav**: panel *partly*, Jev *correct* (not_in_draft 0.00, partly 0.28, correct 0.72, wrong 0.00): "The government. It decides when a session ends [row 8 quote] and it controls the calendar committees need [row 6], so it decides how much time examination gets."
- **Q3 · Meera**: panel *partly*, Jev *correct* (correct 0.63, partly 0.37, wrong 0.00, not_in_draft 0.00): "government owns the clock → controls prorogation and the legislative calendar → that's why committees don't get time."

## The questions as graded

1. **Q:** In the Monsoon Session of 2026, how much of its scheduled time did the Lok Sabha work, and how many bills passed?  
   **Model answer:** It worked 15% of its scheduled time, and eleven of the twelve bills before it passed both Houses.
2. **Q:** How many of those eleven bills had been examined by a parliamentary committee before they passed?  
   **Model answer:** None. The only bill of the twelve sent to a committee, the Indian Statistical Institute Bill, is the one that did not pass.
3. **Q:** Who decides when Parliament meets, whether a bill goes to a committee, and when a session formally ends?  
   **Model answer:** The government. The President summons and prorogues on the Cabinet's advice under Article 85, and referral is the government's call. So a collapse of time does not slow legislation down. It removes the one stage of lawmaking that time protects.
