# knockout-bracket — the bracket, and the seed that was never favourite

> Blueprint for `knockout-bracket`. Contract, not a suggestion — if implementation
> reveals a real problem here, update this file first, visibly, and say so in the
> commit body.
>
> Rules that apply regardless of this blueprint: `CANON.md` (§4 line-art, §5
> type, §6 colour, §8 fallback-first, §13 acceptance floor), `motion.md` (motions
> by name), `docs/design/worlds/sports.md`, and the SVG conventions in
> `src/components/AGENTS.md` §5. Type roles per `../../TYPE-MAPPING.md`.

---

## 1. Identity

| Field | Value |
|---|---|
| `kind` | `knockout-bracket` |
| World | sports |
| Tier | SVG bracket + one team-trace island |
| Component path | `src/components/topic/sports/KnockoutBracket.astro` |
| Scene module | — (no WebGL) |
| CSS prefix | `px-brk` |
| Flagship reference | `league-table` for the team vocabulary; `power-flow` (politics) for the width-encodes-quantity discipline |

## 2. What it shows / when to use

A completed single-elimination draw where line weight is the pre-match odds. The reader learns how improbable the winner's run actually was.

- **USE WHEN:** a completed single-elimination draw of 4, 8 or 16 teams WITH pre-match odds per tie, where the improbability of the winner's run is the argument.
- **DON'T USE:** a league's standings (→ `league-table`); ratings over a season (→ `elo-river`); one match's flow (→ `momentum-wave` / `xg-race`); a projection with uncertainty (→ `finish-interval`).
- **Pairs with:** `wide`, hero-capable.

## 3. Data schema

```ts
interface KnockoutBracketData {
  rounds: string[];        // ['QUARTER-FINAL','SEMI-FINAL','FINAL','WINNER']
  teams: {
    id: string;
    name: string;
    short?: string;
    seed?: number;
    odds?: number;         // 0–1, pre-tournament probability of winning it
  }[];
  matches: {
    round: number;         // 0-indexed
    index: number;         // 0-indexed WITHIN the round
    a: string;             // team id
    b: string;             // team id
    winner: string;        // must equal a or b
    score?: string;        // WINNER-FIRST — see §3 flags
  }[];
  caption?: string;
  source?: string;
}
```

```yaml
kind: knockout-bracket
data:
  rounds: ['QUARTER-FINAL', 'SEMI-FINAL', 'FINAL', 'WINNER']
  teams:
    - { id: a, seed: 1, name: Rivermouth United, odds: 0.34 }
    - { id: b, seed: 8, name: Coalbrook,         odds: 0.02 }
    - { id: c, seed: 4, name: Ashford Rangers,   odds: 0.11 }
    - { id: d, seed: 5, name: Fenwick City,      odds: 0.08 }
    - { id: e, seed: 2, name: Harborough,        odds: 0.24 }
    - { id: f, seed: 7, name: Dunmoor,           odds: 0.03 }
    - { id: g, seed: 3, name: Kestrel Park,      odds: 0.14 }
    - { id: h, seed: 6, name: Southgate Mills,   odds: 0.04 }
  matches:
    - { round: 0, index: 0, a: a, b: b, winner: a, score: '2–0' }
    - { round: 0, index: 1, a: c, b: d, winner: d, score: '2–1' }
    - { round: 0, index: 2, a: e, b: f, winner: e, score: '3–1' }
    - { round: 0, index: 3, a: g, b: h, winner: h, score: '1–0' }
    - { round: 1, index: 0, a: a, b: d, winner: d, score: '1–1 · 4–3p' }
    - { round: 1, index: 1, a: e, b: h, winner: h, score: '2–0' }
    - { round: 2, index: 0, a: d, b: h, winner: h, score: '2–1' }
  caption: The two most likely winners were out by the semi-finals; the team that won was priced at 4%.
  source: Match results and closing pre-match odds, knockout stage 2026
```

Three validations, all of which the prototype needed:

1. **Scores are winner-first.** `'2–1'` means the winner scored 2. A score whose
   first figure is lower than its second **FAILS the build naming the match** (a
   penalty-shootout suffix like `'1–1 · 4–3p'` is parsed on the shootout figures).
2. **Bracket completeness.** Round *r* must have exactly `2^(rounds−1−r)`
   matches, and each match's `a`/`b` in round *r > 0* must be the winners of
   matches `2·index` and `2·index+1` of round *r−1*. A mismatch **FAILS naming
   the match** — this is what keeps the tree honest.
3. **`winner` must equal `a` or `b`.**

Line width is `odds`-scaled, so the legend states that thickness is pre-match
probability; **no compression chip** (width is linear in odds).

## 4. Geometry spec

`viewBox="0 0 760 380"`, `width:100%; height:auto` (the 1080px breakout).

- **Column x** `[16, 224, 424, 604]`; **slot widths** `[156, 156, 156, 140]`.
- **Slot y** for round *r*, slot *i*: `gap = 46 · 2^r`, then
  `y = 34 + gap/2 − 13 + i · gap`. Slot height 26px.
- **Round headers** at `y = 16`, `text-anchor="middle"`, at x
  `[92, 300, 500, 672]`.
- **Slot content:** the team name at `x + 9` (truncated to 13 characters with an
  ellipsis — 12 + `…`), and the score right-aligned at `x + w − 8`. Both 11.5px.
- **Feeder links — the part to get right.** For each match, draw **TWO** links,
  one per side:

  ```
  for k, side in enumerate([m.a, m.b]):
      y0 = slotY(m.round,     m.index * 2 + k) + 13
      y1 = slotY(m.round + 1, m.index)         + 13
      x0 = colX[m.round] + slotW[m.round]
      x1 = colX[m.round + 1]
      mid = (x0 + x1) / 2
      d = M x0 y0  L mid y0  L mid y1  L x1 y1
  ```

  Both feeders must be drawn. Drawing one per match — the winner's only — leaves
  half the bracket unconnected and every losing team stranded; **that was the
  prototype's one real bug**, and the acceptance checklist probes for it by
  asserting that every slot except the final winner has an outgoing link and every
  slot except round 0 has an incoming one.
- **Link weight:** the winner's feeder is `max(1.2, odds × 22)`; the loser's is a
  flat 1px hairline.
- **375px:** a 4-round bracket cannot hold at 375px. Below 640px the component
  switches to a **round-by-round list** — one `<section>` per round, each match as
  "winner beat loser, score", with the odds shown per winner. The improbability
  argument survives, because it lives in the numbers.

## 5. Motion spec

- **Entrance:** `reveal` on the card root. Links do not draw progressively — an
  animated bracket implies the tournament replaying.
- **On team trace:** links and slots not on that team's path drop to 0.1 over
  120ms ease-out.
- **Composed still:** the winner traced (the argument), their path at full
  weight, every other line at its rest opacity — not dimmed, since the still must
  show the whole draw.

## 6. Colour spec

| Element | Token @ opacity |
|---|---|
| winner feeder, eventual champion's path | `--accent` @ 0.92 |
| winner feeder, other matches | `--ink` @ 0.70 |
| loser feeder | `--ink` @ 0.28, 1px |
| link, off the traced path | own colour @ 0.10 |
| slot fill, rest | `--paper-deep` @ 1.0 |
| slot fill, traced | `--accent` mixed toward `--paper-deep` 82% |
| slot border, rest | `--rule` @ 1.0, 1.4px |
| slot border, traced | `--accent` @ 1.0, 1.4px |
| team name, rest | `--ink` @ 0.90 |
| team name, traced | `--accent` @ 1.0, 700 |
| score | `--ink` @ 0.55; traced `--accent` @ 1.0 |
| ledger "won it" cell | `--accent` @ 1.0 |

The champion's path is the only accent-coloured run at rest, so the silhouette
already tells the story before any interaction.

## 7. Fallback design

Build-time SVG:

1. The **whole bracket** — every slot, both feeders per match, all scores, round
   headers, and the two-weight legend.
2. The **team ledger** to the right: seed, name, how far they got, and their
   pre-match odds.
3. A `<table>` of matches: round, winner, loser, score, winner's odds.
   AT-readable source; SVG `aria-hidden="true"`.

## 8. Interaction spec

**One control** — team trace.

- **Targets:** each slot and each ledger row is a `<button>`; tab order is the
  ledger (by seed), since 15 slots in bracket order is a confusing tab sequence.
- **Effect:** highlight that team's whole path — every slot they occupied and
  every feeder they travelled — and dim the rest.
- **Readout template** (`aria-live="polite"`):
  `"{name}, seed {seed} — priced at {odds}% before kick-off, reached the {stage}.{runText}"`
  with `runText` for the champion naming the three winning margins.
- **Re-press** clears to the champion trace.
- **Keyboard:** complete via the ledger; `Esc` restores the default.

## 9. Comprehension text

- **`what`**: "Teams enter on the left and one leaves on the right; every fork
  is a match and the surviving line carries on. Line thickness is how likely the
  bookmakers thought that survival was before kick-off, so a thin line reaching the
  right-hand side is an upset the market never priced."
- **`how`**: "Press a team to trace its whole run. Compare how thick each
  winner's line was — the thinnest line that keeps going is the story."
- **Caption guidance:** the favourites' exit and the winner's price — "the two most
  likely winners were out by the semi-finals; the team that won was priced at 4%".

## 10. Performance budget

| Budget | Cap |
|---|---|
| SVG nodes | ≤ 260 (16-team: 31 slots + 30 links + labels) |
| `data` payload | ≤ 5 KB |
| Island JS | ≤ 1.3 KB minified, inline |
| Teams | 4, 8 or 16 |
| Extra assets | none |

## 11. Acceptance checklist

- [ ] **Silhouette test** — recognisable as this kind at thumbnail size
- [ ] **375px** — no overflow, no label collision, no sub-8px text
- [ ] **Reduced-motion still** matches the composed still in §5
- [ ] **Token grep** — no raw hex in the component; every colour a `var(--*)`
- [ ] **Caption + source + plain line** all present
- [ ] **Payload validation** — malformed data fails the build with a named error
- [ ] **Prefix unique** — re-grepped `meta.css`, `base.css`, `src/components/`
- [ ] **TWO feeder links per match** — probe that every slot except the champion has an outgoing link, and every slot outside round 0 has an incoming one
- [ ] Feeder indices are `index*2` and `index*2+1` of the previous round
- [ ] Round *r* has exactly `2^(rounds−1−r)` matches, or the build fails naming the gap
- [ ] Each round's `a`/`b` are the previous round's winners, or the build fails naming the match
- [ ] Scores are winner-first; a lower-first score fails the build
- [ ] `winner` not equal to `a` or `b` fails the build
- [ ] Winner feeders are odds-weighted; loser feeders are 1px hairlines
- [ ] Names truncate at 13 characters with an ellipsis
- [ ] Below 640px the component switches to the round-by-round list
- [ ] No-JS: full bracket + ledger + match table

---

*Registry duties: `SECTION_KINDS` (`src/content/config.ts`), dispatch in
`src/components/SectionBody.astro`, `EXPLAIN` entry (`src/lib/explainers.ts`),
catalog block (`docs/design/catalog.md` — `npm run check:catalog` must pass),
prefix in `src/components/AGENTS.md` §4, worked example in `2026-06-03-sports-showcase`.*
