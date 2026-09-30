import type { Topic } from '../content/config';

/**
 * The Lens desk inks by role (docs/design/LENS.md §2.2), as CSS variable
 * references. The values live in shared/design/worlds.css (`--pol-text`,
 * `--spa-mark`, …) and are page-wide, so a component that shows a desk's
 * content on a house page (a cover card, a desk chip, a stage) names the ink
 * by desk and role instead of a hex.
 *
 *   text  words in the desk colour, >= 4.5:1 on paper
 *   mark  fills, lines, the data; never small text
 *   tint  bands and chips, the cover panel
 *   deep  the plate; never a page
 *
 * `var()` in an SVG presentation attribute resolves in every current engine;
 * only `font-family` must stay a literal stack (RD-01b, LENS §3.3).
 */
export type InkRole = 'text' | 'mark' | 'tint' | 'deep';

export const INK_PREFIX: Record<Topic, string> = {
  politics: 'pol',
  space: 'spa',
  earth: 'ear',
  tech: 'tec',
  travel: 'tra',
  sports: 'spo',
};

export const ink = (desk: Topic, role: InkRole): string => `var(--${INK_PREFIX[desk]}-${role})`;

/** The lime of the two desks that have one (a mark on their own deep plate only). */
export const lime = (desk: Topic): string | undefined =>
  desk === 'tech' || desk === 'sports' ? `var(--${INK_PREFIX[desk]}-lime)` : undefined;
