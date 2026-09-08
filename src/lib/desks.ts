import type { Topic } from '../content/config';

/**
 * The desk register — what each world calls the kind of publication it is.
 *
 * These are the handoff's own values (`w.reg`, Web.dc.html:534-549), and they
 * line up with the conceits the six topic indexes already run: politics is a
 * broadsheet desk, tech is a changelog, travel a field journal, and so on.
 */
export const DESK_REGISTER: Record<Topic, string> = {
  politics: 'Politics desk',
  space: 'Mission control',
  earth: 'Field atlas',
  tech: 'Changelog',
  travel: 'Field journal',
  sports: 'Match programme',
};

/**
 * The desk copy the launch design draws on (2026-09-08) — the home page's six
 * cards and the one desk template both read from here, so a tagline can never
 * disagree between the card and the page it opens. Values are the handoff's
 * (`worlds()` in Parallax Web.dc.html), approved on the canvas.
 *
 *   name   the world's plain name
 *   tag    one line on the home card
 *   cta    the card's call to action, in the desk's own voice
 *   title  the desk page's headline
 *   blurb  the desk page's lede
 */
export interface DeskCopy {
  name: string;
  tag: string;
  cta: string;
  title: string;
  blurb: string;
}

export const DESK_COPY: Record<Topic, DeskCopy> = {
  politics: {
    name: 'Politics',
    tag: 'The machinery behind the headlines.',
    cta: 'Visit the desk →',
    title: 'The machinery behind the headlines',
    blurb: 'Not who won. How the winning was arranged — the procedure, the arithmetic, the incentive that made the outcome inevitable before anyone voted.',
  },
  space: {
    name: 'Space',
    tag: 'Transmissions from beyond the line.',
    cta: 'Open mission control →',
    title: 'Transmissions from beyond the line',
    blurb: 'Orbits, missions and the telemetry underneath them — what the instruments actually recorded, before anyone wrote a press release.',
  },
  earth: {
    name: 'Earth',
    tag: 'The planet, in the present tense.',
    cta: 'Open the atlas →',
    title: 'The planet, in the present tense',
    blurb: 'Climate, oceans and deep time, read off the record rather than the forecast.',
  },
  tech: {
    name: 'Tech',
    tag: 'The commit messages of a changing world.',
    cta: '→ cd /tech',
    title: 'The commit messages of a changing world',
    blurb: 'Not the launch. The diff underneath it — what shipped, what broke, and who pays for the tokens.',
  },
  travel: {
    name: 'Travel',
    tag: "Field notes from somewhere you haven't been.",
    cta: 'Visit the bureau →',
    title: "Field notes from somewhere you haven't been",
    blurb: 'Cities, crossings and quiet rooms, reported at walking pace.',
  },
  sports: {
    name: 'Sports',
    tag: 'The tactics, told honestly.',
    cta: 'Open the programme →',
    title: 'The tactics, told honestly',
    blurb: 'Shape, xG and the decisions behind the table — without the pundit shrug.',
  },
};

/** The three dark grounds — where the accent, not the ink, is the world's edge. */
export const DARK_DESKS: ReadonlySet<Topic> = new Set<Topic>(['space', 'tech', 'sports']);
