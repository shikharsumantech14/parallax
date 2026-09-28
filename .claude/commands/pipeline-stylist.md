---
description: The stylist for one desk on your Claude subscription. Runs npm run pipeline:stylist <desk> -- --bill subscription and reports its footer. Rewrites the issue's prose into the voice contract, behind the stylist guard.
argument-hint: <desk> [--slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:stylist *), Read
disable-model-invocation: true
---

# /pipeline-stylist

One action: run `npm run pipeline:stylist <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself.

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** Phase 3.5, between the two panel passes. The stylist rewrites
the issue's prose fields into the runtime voice contract
(`research/_voice/_voice-core.md` v2) with the latest panel report in hand,
and assigns one rhetorical job per section. Facts, numbers, quotes and every
structured data field stay as they are, and the script enforces it: the
stylist guard compares every field outside the stylist's list with the issue
as it stood before the run, and on any change restores the issue, keeps the
stylist's version as `_index.rejected.mdx` and exits 4. Flags:
`--slug <slug>`, `--model <id>`, `--effort <level>`, `--dry-run` (assemble
the prompt, send nothing, bill nothing).

**Next.** `/pipeline-panel <desk> --slug <slug>`, the second pass.

---

## Instructions to Claude

The operator invoked `/pipeline-stylist` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:stylist <desk> -- --bill subscription <flags>
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
   - the `stylist guard:` line (the prose fields it changed, or what it
     refused and where the rejected version is) and the agent's closing
     summary,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and say that nothing was sent and no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
