/**
 * The four reader reactions at the end of every issue: the cells of
 * `core/ReactionsBar.astro` ("How did this land?"), and the miniature the
 * first-visit intro draws of them (`core/IntroOverlay.astro`, scene 3). One
 * list, so the intro can never show a reaction the issue page does not offer.
 * The ids are the API's (`/api/reactions/<issueId>`, VALID_KINDS).
 */
export const REACTION_KINDS = [
  { id: 'think', label: 'Made me think', help: 'This sparked thought I want to sit with.' },
  { id: 'agree', label: 'Resonates', help: 'This matches how I read the issue.' },
  { id: 'disagree', label: 'Challenges me', help: 'I want to push back on this.' },
  { id: 'want_more', label: 'More like this', help: 'Send me more of this register.' },
] as const;
