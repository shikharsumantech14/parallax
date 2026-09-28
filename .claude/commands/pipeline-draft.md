---
description: The draft for one desk on your Claude subscription. Runs npm run pipeline:draft <desk> -- --bill subscription and reports its footer. Writes src/content/issues/<date-slug>/index.mdx with status draft, from an approved storyboard.
argument-hint: <desk> [--slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:draft *), Read
disable-model-invocation: true
---

# /pipeline-draft

One action: run `npm run pipeline:draft <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself
(retired 2026-09-28).

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** Phase 3. The drafter executes the storyboard (its kinds,
order, hero, word budgets and head) and writes
`src/content/issues/<date-slug>/index.mdx` with `status: draft`. The script
refuses a storyboard that is not `Status: approved` while `GATES.storyboard`
is `'required'`, and `hold` always stops it. After the draft it runs the
check round: `check:prose` and the schema check on the file, and one more
request on the resumed session when either flags something. Flags:
`--slug <slug>` (the dossier's slug, without the date), `--model <id>`,
`--effort <level>`, `--dry-run` (assemble the prompt and preview the check
round, send nothing, bill nothing).

**Next.** `/pipeline-panel <desk> --slug <slug>`, the first pass, then read
the draft with the panel report beside it and resolve the
`# EDITOR: verify before publish` comments.

---

## Instructions to Claude

The operator invoked `/pipeline-draft` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:draft <desk> -- --bill subscription <flags>
   ```

   A phase takes 2 to 18 minutes (the trial's draft took 17), longer than a
   foreground call may last, so start it in the background: a run cut off
   midway writes no ledger row. Do not read files, validate the desk, check the
   storyboard gate or spawn an agent first: the script checks everything
   itself before it spends anything, and exits with a message when something
   is missing.
4. Tell the operator the run has started and where its output is going.
   While it runs, stream it: follow the output file if your tools can watch
   a background task, and read it whenever the operator asks.
5. When it exits, report from its output, quoting rather than paraphrasing:
   - the `bills to:` line of the header,
   - the outcome (`done` or `stopped: …`) and the exit code,
   - the issue file it wrote, every `check round:` line (the flags, whether
     the second request resumed the session, what remains for the operator)
     and the agent's closing summary,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and the check round's preview, and say that nothing was sent and
   no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
