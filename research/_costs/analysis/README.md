# Cost analysis scripts (2026-09-27)

Written for `docs/COST-PLAN.md`. They read `research/_costs/ledger.jsonl` and the
pipeline run transcripts under the operator's Claude config
(`C:\Users\<user>\.claude\projects\D--SideProjects-parallax\*.jsonl`) and bill
nothing. `turn-model.mjs` needs only the ledger. The rest were written by the
2026-09-27 analysis agents and hardcode that transcript directory: adjust the
path at the top of each before running on another machine. See
`docs/cost/2026-09-27-cost-levers.md` §8 and `2026-09-27-token-profile.md`
for what each one measured.
