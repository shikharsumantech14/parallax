---
description: The reader panel for one desk on your Claude subscription. Runs npm run pipeline:panel <desk> -- --bill subscription and reports its footer. Four Indian reader personas read the draft cold and answer the storyboard's quiz for a PASS, REVISE or BLOCK verdict, with the Jev quiz grade beside it. Run after the draft and again after the stylist.
argument-hint: <desk> [--slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:panel *), Read
disable-model-invocation: true
---

# /pipeline-panel

One action: run `npm run pipeline:panel <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself
(retired 2026-09-28).

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** The comprehension gate (REGISTER-PLAN RG-12), twice per issue.
Four reader personas read the draft cold, answer the storyboard's three
questions from the draft alone, retell every section and quote the sentence
that lost them. The script picks the pass itself: the first run on an issue
writes `research/<desk>/<date>-<slug>-panel.md`, any later run the second
pass, `…-panel-2.md`. A `--pass second` flag is passed through and ignored
here (it belongs to `npm run jev:panel`). After the panel the script runs the
Jev quiz grade, which re-grades every answer beside the panel's own grades
and writes `….jev.md`. Advisory only, never the verdict. Without a Jev key it
is skipped with a note. Flags: `--slug <slug>`, `--model <id>`,
`--effort <level>`, `--dry-run` (assemble the prompt, send nothing, bill
nothing).

**Next.** PASS: `/pipeline-stylist` (first pass) or `/pipeline-verify`
(second pass). REVISE: apply the fixes, they are directions, not sentences.
BLOCK: back to the storyboard or the draft before anything else is spent.

---

## Instructions to Claude

The operator invoked `/pipeline-panel` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:panel <desk> -- --bill subscription <flags>
   ```

   A phase takes 2 to 18 minutes (the trial's draft took 17), longer than a
   foreground call may last, so start it in the background: a run cut off
   midway writes no ledger row. Do not read files, validate the desk, work out
   the pass or spawn an agent first: the script does all of that itself
   before it spends anything, and exits with a message when something is
   missing.
4. Tell the operator the run has started and where its output is going.
   While it runs, stream it: follow the output file if your tools can watch
   a background task, and read it whenever the operator asks.
5. When it exits, report from its output, quoting rather than paraphrasing:
   - the `bills to:` line of the header,
   - the outcome (`done` or `stopped: …`) and the exit code,
   - the report it wrote and the agent's closing summary: the verdict, one
     line per quiz question, the weakest sections, the top fixes,
   - the `jev:` line: the quiz grade's file and its agreement with the
     panel, or why Jev was skipped,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and say that nothing was sent and no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
