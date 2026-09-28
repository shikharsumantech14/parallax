/**
 * The panel grade (docs/COST-PLAN.md CP-06, job c).
 *
 * The reader panel answers the storyboard's three questions as four personas
 * and grades each answer itself: correct / partly / wrong / not in the draft.
 * This re-grades every persona's answer against the storyboard's model answer
 * with Jev, ONE answer per call, so the gate gets a second, repeatable opinion
 * at a hundredth of a cent. The panel's grade stands. Jev's sits beside it,
 * and a disagreement is a place for the operator to look, not an override.
 *
 * The reader's answer is passed without the panel's grade and without the
 * panel's commentary after it: Jev grades what the reader said, not what the
 * panel concluded.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative } from 'node:path';
import { jev, jevRoute, jevThreshold, mapPool, pickOf, REPO_ROOT } from './jev.js';
import type { ChoiceAnswer, ChoiceQuestion, JevUse } from './jev.js';

export type Grade = 'correct' | 'partly' | 'wrong' | 'not_in_draft';
const GRADES: Grade[] = ['correct', 'partly', 'wrong', 'not_in_draft'];

export interface QuizQuestion { n: number; question: string; answer: string }

export interface PanelAnswer {
  n: number;
  question: string;
  persona: string;
  /** The panel's own grade, or null when the cell carries none. */
  grade: Grade | null;
  /** What the reader said: the quoted answer, the panel's grade and commentary removed. */
  answer: string;
  /** The answer said "same" as another persona, and was resolved to that persona's words. */
  backref: boolean;
}

// ── The storyboard's §6 ──────────────────────────────────────────────────────

const stripMd = (s: string) => s
  .replace(/\*\*|__/g, '')
  .replace(/(^|[\s(])\*(?=\S)/g, '$1')
  .replace(/(\S)\*(?=[\s).,;:]|$)/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

/** Where an answer ends and its provenance ("· dossier §4.1", "· rows 1, 2", "· Taught by …") begins. */
const PROVENANCE = /\s·\s(?=(?:dossier|rows?\b|taught|published|storyboard|§|src-|the dossier|\(dossier))/i;

/** The three questions and model answers from a storyboard's "## 6. The three questions". */
export function parseStoryboardQuestions(md: string): QuizQuestion[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  let start = lines.findIndex((l) => /^##\s+6\.?\s/.test(l));
  if (start === -1) start = lines.findIndex((l) => /^##\s.*\bquestions\b/i.test(l));
  if (start === -1) return [];
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end === -1) end = lines.length;
  const items: string[] = [];
  let cur: string[] | null = null;
  for (const line of lines.slice(start + 1, end)) {
    if (/^\s*(?:\*\*)?\d+\.(?:\*\*)?\s/.test(line)) { if (cur) items.push(cur.join(' ')); cur = [line.trim()]; }
    else if (!line.trim()) { if (cur) { items.push(cur.join(' ')); cur = null; } }
    else if (cur) cur.push(line.trim());
  }
  if (cur) items.push(cur.join(' '));
  const out: QuizQuestion[] = [];
  for (const item of items) {
    const flat = stripMd(item);
    const n = Number(flat.match(/^(\d+)\./)?.[1]);
    const m = flat.match(/Q:\s*(.+?)\s*(?:·\s*)?A:\s*(.+)$/);
    if (!m || !n) continue;
    const answer = m[2].split(PROVENANCE)[0].replace(/\s*·\s*$/, '').trim();
    out.push({ n, question: m[1].replace(/\s*·\s*$/, '').trim(), answer });
  }
  return out;
}

// ── The panel report's quiz table ────────────────────────────────────────────

const splitRow = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, '|').trim());

function parseCell(cell: string): { grade: Grade | null; rest: string } {
  const flat = stripMd(cell);
  const m = flat.match(/^(correct|partly|partial|wrong|not in the draft|not_in_draft)\b\.?\s*(?:[—–:-]\s*)?(.*)$/i);
  if (!m) return { grade: null, rest: flat };
  const g = m[1].toLowerCase();
  const grade: Grade = g.startsWith('not') ? 'not_in_draft' : g === 'partial' ? 'partly' : (g as Grade);
  return { grade, rest: m[2].trim() };
}

/** The reader's words: the first quoted passage when there is one (the rest is the panel's commentary), else everything. */
function readerWords(rest: string): string {
  const q = rest.match(/["“]([^"”]{2,})["”]/);
  return (q ? q[1] : rest).trim();
}

/** The "## The quiz" table of a panel report: personas, and every persona's graded answer. */
export function parsePanelQuiz(md: string): { personas: string[]; answers: PanelAnswer[] } {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => /^##\s+the quiz/i.test(l));
  if (start === -1) return { personas: [], answers: [] };
  const table: string[] = [];
  for (const l of lines.slice(start + 1)) {
    if (/^##\s/.test(l)) break;
    if (/^\s*\|/.test(l)) table.push(l);
    else if (table.length) break;
  }
  if (table.length < 3) return { personas: [], answers: [] };
  const personas = splitRow(table[0]).slice(1).map(stripMd);
  const answers: PanelAnswer[] = [];
  for (const row of table.slice(2)) {
    const cells = splitRow(row);
    const qCell = stripMd(cells[0] ?? '');
    const n = Number(qCell.match(/^(\d+)\./)?.[1]);
    if (!n) continue;
    const question = qCell.replace(/^\d+\.\s*/, '');
    const said = new Map<string, string>();
    let previous = '';
    personas.forEach((persona, i) => {
      const { grade, rest } = parseCell(cells[i + 1] ?? '');
      let answer = readerWords(rest);
      // "same, off the you-think card" / "Same reasoning as Aarav, but …": resolve to the words referred to.
      const named = personas.find((p) => new RegExp(`^same\\b[^.]*?\\bas ${p}\\b|^as ${p}\\b`, 'i').test(answer));
      const target = named ? said.get(named) : previous;
      const backref = /^(same\b|as [A-Z][a-z]+\b)/i.test(answer) && Boolean(target);
      if (backref) answer = `${target} (${answer})`;
      else previous = answer;
      said.set(persona, answer);
      answers.push({ n, question, persona, grade, answer, backref });
    });
  }
  // A column with no grades in it ("Gap vs §6") is the panel's notes, not a reader.
  const readers = personas.filter((p) => answers.some((a) => a.persona === p && a.grade));
  return { personas: readers, answers: answers.filter((a) => readers.includes(a.persona)) };
}

// ── The grade ────────────────────────────────────────────────────────────────

const GRADE_QUESTION: ChoiceQuestion = {
  type: 'choice',
  instructions: 'For `question`, compare `reader_answer` with `model_answer`. Judge the substance, not the wording. Which grade fits the reader\'s answer?',
  criteria: {
    correct: "the reader's answer states the model answer's substance",
    partly: 'part of it, or vague',
    wrong: 'a different answer',
    not_in_draft: 'the reader says the draft did not tell them',
  },
};

export interface GradedAnswer extends PanelAnswer {
  jev: Grade | 'error';
  p: number;
  probabilities: Record<string, number>;
  agree: boolean | null;
  error?: string;
  usd: number;
  /** The model id that answered (null on error). */
  model: string | null;
}

export interface JevPanelOptions {
  storyboardPath: string;
  panelPath: string;
  outPath: string;
  threshold?: number;
  concurrency?: number;
  use?: JevUse;
  tag?: string;
  slug?: string;
}

export interface JevPanelResult {
  storyboard: string;
  panel: string;
  out: string;
  route: { provider: string; model: string };
  answeredBy: string | null;
  threshold: number;
  questions: QuizQuestion[];
  answers: GradedAnswer[];
  agreement: { graded: number; agree: number; rate: number; confident: number; confidentAgree: number; confidentRate: number };
  cost: { usd: number; calls: number };
  ms: number;
}

const rel = (p: string) => {
  const r = relative(REPO_ROOT, p);
  return (r && !r.startsWith('..') && !isAbsolute(r) ? r : p).replace(/\\/g, '/');
};
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const label = (g: Grade | 'error' | null) => (g === 'not_in_draft' ? 'not in the draft' : g ?? '—');

export async function runJevPanel(opts: JevPanelOptions): Promise<JevPanelResult> {
  const started = Date.now();
  const threshold = opts.threshold ?? jevThreshold('panel');
  const questions = parseStoryboardQuestions(readFileSync(opts.storyboardPath, 'utf-8'));
  const { answers } = parsePanelQuiz(readFileSync(opts.panelPath, 'utf-8'));
  if (!questions.length) throw new Error(`No "## 6. The three questions" with Q:/A: items in ${rel(opts.storyboardPath)}.`);
  if (!answers.length) throw new Error(`No "## The quiz" table in ${rel(opts.panelPath)}.`);
  const slug = opts.slug ?? rel(opts.panelPath).split('/').pop()?.replace(/^(\d{4}-\d{2}-\d{2}-)+/, '').replace(/-panel(-2)?\.md$/, '') ?? null;

  const graded = await mapPool(answers, opts.concurrency ?? 4, async (a): Promise<GradedAnswer> => {
    const q = questions.find((x) => x.n === a.n);
    if (!q) return { ...a, jev: 'error', p: 0, probabilities: {}, agree: null, error: `storyboard has no question ${a.n}`, usd: 0, model: null };
    try {
      const r = await jev(
        { question: q.question, model_answer: q.answer, reader_answer: a.answer },
        { grade: GRADE_QUESTION },
        { use: opts.use ?? 'panel', slug: slug ?? undefined, tag: opts.tag },
      );
      const pick = pickOf(r.answers.grade as ChoiceAnswer, threshold);
      const g = pick.pick as Grade;
      return { ...a, jev: g, p: pick.p, probabilities: (r.answers.grade as ChoiceAnswer).probabilities, agree: a.grade ? a.grade === g : null, usd: r.usage.usd, model: r.model };
    } catch (err) {
      return { ...a, jev: 'error', p: 0, probabilities: {}, agree: null, error: (err as Error).message, usd: 0, model: null };
    }
  });
  const models = [...new Set(graded.map((g) => g.model).filter((m): m is string => Boolean(m)))];

  const judged = graded.filter((g) => g.agree !== null);
  const confident = judged.filter((g) => g.p >= threshold);
  const result: JevPanelResult = {
    storyboard: rel(opts.storyboardPath),
    panel: rel(opts.panelPath),
    out: rel(opts.outPath),
    route: jevRoute(),
    answeredBy: models.length ? models.join(', ') : null,
    threshold,
    questions,
    answers: graded,
    agreement: {
      graded: judged.length,
      agree: judged.filter((g) => g.agree).length,
      rate: judged.length ? judged.filter((g) => g.agree).length / judged.length : 0,
      confident: confident.length,
      confidentAgree: confident.filter((g) => g.agree).length,
      confidentRate: confident.length ? confident.filter((g) => g.agree).length / confident.length : 0,
    },
    cost: { usd: graded.reduce((s, g) => s + g.usd, 0), calls: graded.filter((g) => g.jev !== 'error').length },
    ms: Date.now() - started,
  };
  mkdirSync(dirname(opts.outPath), { recursive: true });
  writeFileSync(opts.outPath, renderPanelReport(result));
  return result;
}

function renderPanelReport(r: JevPanelResult): string {
  const a = r.agreement;
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const matrix = GRADES.map((pg) => `| ${label(pg)} | ${GRADES.map((jg) => r.answers.filter((x) => x.grade === pg && x.jev === jg).length).join(' | ')} |`);
  const disagreements = r.answers.filter((x) => x.agree === false);
  return [
    `# Jev panel grade: ${r.panel.split('/').pop()}`,
    '',
    `- **Storyboard:** ${r.storyboard}`,
    `- **Panel:** ${r.panel}`,
    `- **Run:** ${new Date().toISOString().slice(0, 10)} · ${r.answeredBy ?? r.route.model} via ${r.route.provider} · threshold p ≥ ${r.threshold.toFixed(2)}`,
    `- **Cost:** $${r.cost.usd.toFixed(5)} · ${r.cost.calls} calls · ${(r.ms / 1000).toFixed(1)} s`,
    '',
    '> A second opinion on the reader panel\'s own grades (docs/COST-PLAN.md CP-06). Each persona\'s',
    '> answer was graded against the storyboard\'s model answer, one answer per Jev call, with the',
    '> panel\'s grade and commentary removed. The panel\'s grade stands, and a disagreement is a place to look.',
    '',
    `**Agreement:** ${a.agree} of ${a.graded} (${pct(a.rate)}) · on Jev's confident grades (p ≥ ${r.threshold.toFixed(2)}): ${a.confidentAgree} of ${a.confident}${a.confident ? ` (${pct(a.confidentRate)})` : ''}`,
    '',
    '| Q | Persona | Panel | Jev | p | Agree | Reader answer (as graded) |',
    '|---|---|---|---|---|---|---|',
    ...r.answers.map((x) => `| ${x.n} | ${x.persona} | ${label(x.grade)} | ${x.jev === 'error' ? `error: ${cell(x.error ?? '')}` : label(x.jev)} | ${x.jev === 'error' ? '—' : x.p.toFixed(2)} | ${x.agree === null ? '—' : x.agree ? 'yes' : '**no**'} | ${cell(x.answer).slice(0, 200)}${x.backref ? ' *(resolved "same")*' : ''} |`),
    '',
    '## Panel grade (rows) against Jev grade (columns)',
    '',
    `| Panel \\ Jev | ${GRADES.map(label).join(' | ')} |`,
    `|---|${GRADES.map(() => '---').join('|')}|`,
    ...matrix,
    '',
    '## Disagreements',
    '',
    ...(disagreements.length
      ? disagreements.map((x) => `- **Q${x.n} · ${x.persona}**: panel *${label(x.grade)}*, Jev *${label(x.jev)}* (${Object.entries(x.probabilities).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(', ')}): "${x.answer}"`)
      : ['None.']),
    '',
    '## The questions as graded',
    '',
    ...r.questions.map((q) => `${q.n}. **Q:** ${q.question}  \n   **Model answer:** ${q.answer}`),
    '',
  ].join('\n');
}
