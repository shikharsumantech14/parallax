---
description: The verifier for one desk on your Claude subscription. Runs npm run pipeline:verify <desk> -- --bill subscription and reports its footer. The Jev claim pre-pass, then the claim-by-claim audit of the draft against the dossier, written to research/<desk>/<date>-<slug>-verification.md.
argument-hint: <desk> [--slug <slug>] [--model <id>] [--effort <level>] [--dry-run]
allowed-tools: Bash(npm run pipeline:verify *), Read
disable-model-invocation: true
---

# /pipeline-verify

One action: run `npm run pipeline:verify <desk> -- --bill subscription <flags>`
from the repo root, stream its output, and report its footer. The script is
the pipeline, the same one a terminal runs: the same agent, the same
`scripts/pipeline.config.ts` (models, effort, budgets), the same harness diet
and the same cost ledger. This command does not spawn the agent itself
(retired 2026-09-28).

This bills your Claude subscription. For the API key, run the same npm script in a terminal without `--bill subscription`.

**The phase.** Phase 4, the brand-protection step before publish. The script
first runs the Jev pre-pass: every claim in the draft scored against the
dossier (supports, contradicts, says nothing), written to
`research/<desk>/<date>-<slug>-jevpass.md`. It orders the verifier's
attention and is never a gate. Without a Jev key it is skipped with a note
and the verifier runs without it. Then the verifier audits every claim,
quote and date against the dossier and writes
`research/<desk>/<date>-<slug>-verification.md` with APPROVED, NEEDS
REVISION or BLOCKED. Flags: `--slug <slug>`, `--model <id>`,
`--effort <level>`, `--dry-run` (assemble the prompt, send nothing, bill
nothing, and skip the Jev pre-pass).

**Next.** Work through the report's required fixes, then
`npm run check:prose -- <slug>` and `npm run check:render -- --slug <slug>`
before the status flip.

---

## Instructions to Claude

The operator invoked `/pipeline-verify` with: **$ARGUMENTS**

1. The first word of the arguments is the desk. Everything after it is the
   flags, passed through unchanged, quotes included. If there are no
   arguments, run nothing and ask for the desk.
2. If the flags contain `--bill`, run nothing. Say that this command always
   bills the subscription, and that the API key door is the same npm script
   in a terminal.
3. Otherwise run exactly this, once, with the Bash tool, from the repo root,
   in the background (`run_in_background: true`):

   ```
   npm run pipeline:verify <desk> -- --bill subscription <flags>
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
   - the `jev:` line: the pre-pass report and its counts, or why Jev was
     skipped,
   - the outcome (`done` or `stopped: …`) and the exit code,
   - the report it wrote and the agent's closing summary: the verdict, the
     verified, imprecise and untraced counts, the top issues,
   - the footer: the `cost:`, `tokens:`, `prefix:`, `duration:` and
     `ledger:` lines, and any `denied:` or `warning:` line.

   A `--dry-run` prints an inventory instead of a header and a footer: report
   its size and say that nothing was sent and no ledger row was written.
6. Stop there. Do not re-run a failed phase, do not switch `--bill` to finish
   one, and do not start the next phase. Add no editorial comment.
