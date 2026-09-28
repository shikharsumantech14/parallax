---
description: The dossier check pass for one desk on your Claude subscription. Runs npm run pipeline:check <desk> -- --bill subscription and reports its footer. Writes research/<desk>/<date>-<slug>-check.md and applies its corrections to the dossier.
argument-hint: <desk> [--slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:check *), Read
disable-model-invocation: true
---

# /pipeline-check

One action: run `npm run pipeline:check <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself.

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** After research, before the storyboard, on every dossier
(`docs/COST-PLAN.md` CP-09). The check agent recomputes every derived number
and confirms the anchor behind each load-bearing fact in a clean context, and
writes `research/<desk>/<date>-<slug>-check.md` with a CLEAN, CORRECTIONS or
BLOCKED verdict. It never writes the dossier: the script applies the report's
corrections to it behind the dossier guard and appends a `## §N Check pass`
section. Exit 4 means a correction or the guard needs the operator. Flags:
`--slug <slug>` (the dossier's slug, without the date), `--model <id>`,
`--effort <level>`, `--dry-run` (assemble the prompt, send nothing, bill
nothing).

**Next.** CLEAN or CORRECTIONS: `/pipeline-storyboard <desk> --slug <slug>`.
BLOCKED: `/pipeline-research <desk> --topup --slug <slug>`, then
`/pipeline-check` again.

---

## Instructions to Claude

The operator invoked `/pipeline-check` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:check <desk> -- --bill subscription <flags>
   ```

   A phase takes 2 to 18 minutes (the trial's draft took 17), longer than a
   foreground call may last, so start it in the background: a run cut off
   midway writes no ledger row. Do not read files, validate the desk or spawn an
   agent first: the script checks everything itself before it spends
   anything, and exits with a message when something is missing.
4. Tell the operator the run has started and where its output is going.
   While it runs, stream it: follow the output file if your tools can watch
   a background task, and read it whenever the operator asks.
5. When it exits, report from its output, quoting rather than paraphrasing:
   - the `bills to:` line of the header,
   - the outcome (`done` or `stopped: …`) and the exit code,
   - the `check report:` line, every line on a correction applied or
     refused, and the dossier guard's line,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and the dossier section the corrections would land in, and say
   that nothing was sent and no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
