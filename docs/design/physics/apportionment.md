# Physics sheet — apportionment & competition math

> Reference for `chamber`, `coalition-calculus`, `gerrymander-lens`,
> `ballot-flow`, `elo-river`, and seat/vote arithmetic anywhere.

## 1. Hemicycle geometry (chamber)

Given: total seats `N`, rows `R`, arc span `θ` (rad, typ. 200–220° → 3.49–3.84),
inner radius `r₀`, row gap `g` (scene units; blueprint fixes values per chamber
size).

1. Row radii: `r_k = r₀ + k·g`, k = 0..R−1.
2. Seats per row ∝ arc length: `n_k = round(N·r_k / Σr_j)` — then fix rounding
   drift by largest-remainder so `Σn_k = N` exactly.
3. Seat positions on row k: angles evenly spaced,
   `α_j = −θ/2 + θ·(j + 0.5)/n_k` (chamber faces −Z; α measured from the axis
   of symmetry), position `(r_k·sinα, seatY, −r_k·cosα)`.
4. **Party filling is angular, not row-wise:** sort all N seat positions by α
   (then by r within equal α), assign parties in bloc order left→right — blocs
   render as contiguous wedges, matching real chamber photography.
5. Division state: each seat's target becomes one of two lobby grids (Aye left,
   No right, simple row-major packing); seats `settle` to targets, colored by
   their party throughout. Totals must equal `division.aye/no` sums.

## 2. Seat allocation from votes (when data gives votes, not seats)

Largest remainder (Hare): `q = votes_i·N / Σvotes`; give `floor(q)`, distribute
the remaining seats by largest fractional part. (D'Hondt exists; use ONLY if the
dossier's jurisdiction uses it and then name it in the caption.)

## 3. Coalition arithmetic (coalition-calculus)

Majority threshold `⌈(N+1)/2⌉`. A toggled set S governs iff `Σseats(S) ≥`
threshold. Surface two honest readouts: `short by X` / `clears by X`. A party
flagged `locked: 'out'` renders untoggleable with its lock reason from data.

## 4. Efficiency gap (gerrymander-lens)

Per district: winner's wasted = votes − (⌊total/2⌋ + 1); loser's wasted = all
their votes. `EG = (Σwasted_A − Σwasted_B) / Σtotal votes` — signed; |EG| > 7%
is the commonly cited flag (attribute: Stephanopoulos & McGhee) — the caption
states the convention. The three plans in the viz share ONE vote grid; only
district lines differ — that constraint is the entire point; build asserts the
cell sets are identical.

## 5. Ranked-choice transfers (ballot-flow)

Rounds from data (precomputed — the component does NOT run the election):
each round shows candidate tallies; eliminated candidate's transfers render as
`flowDash` ribbons `from → to` with widths ∝ n. Build checks: Σtransfers(round)
= eliminated tally; Σtallies constant (± declared exhausted ballots — render
exhausted as a muted sink column, never silently drop).

## 6. Elo (elo-river)

`E_A = 1/(1 + 10^((R_B − R_A)/400))`; update `R' = R + K·(S − E)`,
S ∈ {1, ½, 0}. Series precomputed in data (`{teams: [{name, series: [{t,
elo}]}]}`); K stated in the caption (football club ratings typ. K = 20).
Streamgraph: teams as braided ribbons, thickness constant (it's a line chart
braided, not proportional) — ribbon vertical order = rank at time t, `sweep`
reveal.

## 7. Shot value surfaces (court-value)

The surface ships in data as a binned grid (`number[][]`, e.g. 21×14 for a
football half); the component renders contours/heat-cells with the fixed
low→high ramp declared in the blueprint. The model behind it is named in the
source line ("xG model: Understat 2024") — components never compute xG.
