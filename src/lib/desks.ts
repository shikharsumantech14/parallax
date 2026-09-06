import type { Topic } from '../content/config';

/**
 * The desk register — what each world calls the kind of publication it is.
 *
 * These are the handoff's own values (`w.reg`, Web.dc.html:534-549), and they
 * line up with the conceits the six topic indexes already run: politics is a
 * broadsheet desk, tech is a changelog, travel a field journal, and so on.
 *
 * ONE source. `about.astro`'s six-world specimen carries a near-identical set
 * of its own with two divergences — "Broadsheet" for politics and "Atlas" for
 * earth. That is published brand copy, so it is left alone here rather than
 * silently rewritten; if the two should agree, that is an editorial call.
 */
export const DESK_REGISTER: Record<Topic, string> = {
  politics: 'Politics desk',
  space: 'Mission control',
  earth: 'Field atlas',
  tech: 'Changelog',
  travel: 'Field journal',
  sports: 'Match programme',
};
