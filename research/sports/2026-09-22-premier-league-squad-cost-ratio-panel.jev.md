# Jev panel grade: 2026-09-22-premier-league-squad-cost-ratio-panel.md

- **Storyboard:** research/sports/2026-09-21-premier-league-squad-cost-ratio-storyboard.md
- **Panel:** research/sports/2026-09-22-premier-league-squad-cost-ratio-panel.md
- **Run:** 2026-09-28 · typesafe/jev-1.13-20260917 via openrouter · threshold p ≥ 0.90
- **Cost:** $0.00028 · 12 calls · 1.3 s

> A second opinion on the reader panel's own grades (docs/COST-PLAN.md CP-06). Each persona's
> answer was graded against the storyboard's model answer, one answer per Jev call, with the
> panel's grade and commentary removed. The panel's grade stands, and a disagreement is a place to look.

**Agreement:** 11 of 12 (92%) · on Jev's confident grades (p ≥ 0.90): 6 of 6 (100%)

| Q | Persona | Panel | Jev | p | Agree | Reader answer (as graded) |
|---|---|---|---|---|---|---|
| 1 | Aarav | correct | correct | 0.88 | yes | 85% of what the club earns itself, and that includes profit from selling players, not just matchday/broadcast/commercial. Spent on wages, agents' fees and transfer fees, the fees spread over the contr |
| 1 | Meera | partly | partly | 0.97 | yes | 85% of the club's own revenue, spent on wages and transfer stuff. I didn't clock that player-sale profit also counts toward the 85% base — that's only said once, inside the big chart's fine print. |
| 1 | Sana | partly | partly | 1.00 | yes | You can spend 85% of what you earn. Not sure exactly what 'squad spending' includes beyond wages — I'd have to go back and find the glossary card. |
| 1 | Karthik | correct | correct | 0.83 | yes | 85% of revenue plus profit on player sales, covering wages, agents' fees and transfer fees written off (amortised) over the contract. Pieced together from three different sections though, not one. |
| 2 | Aarav | correct | correct | 0.98 | yes | City's revenue dwarfs Bournemouth's — the caps work out to about £590m vs £155m — and City makes almost half its money from commercial deals it sells itself, while Bournemouth leans on the shared broa |
| 2 | Meera | partly | partly | 0.98 | yes | City just earns way more, so 85% of a bigger number is a bigger cap — £590m vs £155m. I didn't register that the kind of money differs too. |
| 2 | Sana | partly | partly | 0.93 | yes | City makes loads more money so their cap is way higher. Couldn't tell you the actual revenue numbers, only the after-85% ones. |
| 2 | Karthik | partly | correct | 0.76 | **no** | City's revenue dwarfs Bournemouth's — the caps work out to about £590m vs £155m — and City makes almost half its money from commercial deals it sells itself, while Bournemouth leans on the shared broa *(resolved "same")* |
| 3 | Aarav | correct | correct | 0.64 | yes | Not wages — those barely moved, 64% to 65%. Losses went sevenfold because of one-off stuff like selling players and assets, per Deloitte. Villa's whole profit came from selling its women's team. |
| 3 | Meera | correct | correct | 0.54 | yes | Not wages. Deloitte blames decisions about selling players and club assets, same thing the new rule is supposed to fix, ironically. |
| 3 | Sana | correct | correct | 0.62 | yes | Wages stayed flat-ish. The huge jump in losses was clubs selling stuff off (like Villa selling the women's team) to look better on paper. |
| 3 | Karthik | correct | correct | 0.97 | yes | Wages 64%→65%, losses ×7 in the same season. Deloitte: mostly asset-sale accounting, which is exactly what the new rule's own formula also counts as income. |

## Panel grade (rows) against Jev grade (columns)

| Panel \ Jev | correct | partly | wrong | not in the draft |
|---|---|---|---|---|
| correct | 7 | 0 | 0 | 0 |
| partly | 1 | 4 | 0 | 0 |
| wrong | 0 | 0 | 0 | 0 |
| not in the draft | 0 | 0 | 0 | 0 |

## Disagreements

- **Q2 · Karthik**: panel *partly*, Jev *correct* (correct 0.76, wrong 0.00, not_in_draft 0.04, partly 0.20): "City's revenue dwarfs Bournemouth's — the caps work out to about £590m vs £155m — and City makes almost half its money from commercial deals it sells itself, while Bournemouth leans on the shared broadcast pot (81.5%). (Same reasoning as Aarav, but I went looking for City's and Bournemouth's actual 2024/25 revenue in the text and it isn't there — only the £590m/£155m ceilings. The real numbers (694/182) only exist as dot positions on the scatter chart, which I can't read precisely without a hover.)"

## The questions as graded

1. **Q:** Under the new rule, how much may a Premier League club spend on its squad?  
   **Model answer:** 85% of its own football revenue plus net profit on player sales. "Squad" means player and head-coach wages, agents' fees, and transfer fees spread over the years of the contract. Because the 85% is taken from the club's own income, the limit is a different number at every club.
2. **Q:** Why does the same 85% give Manchester City a far bigger budget than Bournemouth?  
   **Model answer:** Because it is 85% of their own revenue, and the revenues are not close. City earned £694m in 2024/25 and Bournemouth £182m. The kind of money differs too: 81.5% of Bournemouth's came from the broadcast pot the league shares out nearly equally, while 49% of City's came from commercial deals City sells itself.
3. **Q:** The rule is meant to answer £948m of losses. Where did those losses come from?  
   **Model answer:** Not from wages. Wages went from 64% to 65% of revenue in the same season the losses rose sevenfold. Deloitte says most of the £812m increase came from decisions about selling players and other club assets — the very activity the new rule's numerator counts.
