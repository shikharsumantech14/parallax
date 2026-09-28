---
description: Research for one desk on your Claude subscription. Runs npm run pipeline:research <desk> -- --bill subscription and reports its footer. Writes research/<desk>/<date>-<slug>-dossier.md.
argument-hint: <desk> [--candidate C-NN] [--topup --slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:research *), Read
disable-model-invocation: true
---

# /pipeline-research

One action: run `npm run pipeline:research <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself
(retired 2026-09-28).

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** Phase 2. The researcher takes the candidate marked
`status: chosen` in the desk's newest candidates file (or the one named by
`--candidate C-NN`), verifies it against the allowlist and writes
`research/<desk>/<date>-<slug>-dossier.md`. `--topup --slug <slug>` instead
tops up that existing dossier with what its check pass asked for, in place.
Other flags: `--model <id>`, `--effort <level>`, `--dry-run` (assemble the
prompt, send nothing, bill nothing).

**Next.** `/pipeline-check <desk> --slug <slug>` on the dossier, then read it
with the check report beside it.

---

## Instructions to Claude

The operator invoked `/pipeline-research` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:research <desk> -- --bill subscription <flags>
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
   - the dossier it wrote (or topped up) and the agent's closing summary: the
     structural argument, the strongest facts, every `[UNVERIFIED]` item,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and say that nothing was sent and no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
