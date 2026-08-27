/**
 * Story mode (`/s/<slug>/`) — card selection + per-kind data trimming.
 * Spec (the contract): docs/design/STORY-MODE-SPEC.md.
 *
 * `selectStoryCards` turns an issue's sections into ≤MAX_BEATS beat cards:
 * authored `story.beats` win; otherwise beats are derived by kind priority
 * with text from skimCaption → intro → title — so EVERY published issue gets
 * a working story with zero authoring.
 *
 * `fitSectionForStory` trims section DATA (never CSS-hides content) so every
 * card fits a 375×667 viewport — the trim table lives here, one entry per
 * kind (STORY-MODE-SPEC §4; extend it kind-by-kind as cards are verified).
 */
import type { Section } from '../content/config';

export const MAX_BEATS = 6;

export interface StoryBeatCard {
  section: Section;      // the FITTED section (trimmed clone)
  index: number;         // original index in sections[] (deep-link/debug)
  text: string;          // the beat sentence (social voice when authored)
  kicker?: string;
}

export interface StoryModel {
  hook: string;          // hook-card line (story.hook ?? issue hook)
  beats: StoryBeatCard[];
  cta?: string;
}

/* Kind priority for derived beats (spec §1): world-signature interactive >
   data-readout > timeline > paradox/comparison > quote. prose only with a
   skimCaption, max one. Exported for reuse: home/FeaturedPlate.astro picks
   the featured issue's art section from the same ranking (HOME-SPEC §5). */
export const KIND_PRIORITY: Record<string, number> = {
  // WebGL / flagship interactive
  'solar-system': 100, 'chamber': 100, 'orbit-globe': 96, 'data-globe': 96,
  'route-globe': 96, 'coalition-orbit': 94,
  // The four remaining WebGL flagships — one per world, unscored until now, so
  // they fell to the default 30 (see `?? 30` below) and were effectively
  // unrankable as beats despite being the most arresting things in the library.
  // Scored just under the globes: flagship, but never displacing solar-system,
  // chamber or a globe when an issue carries one.
  'terrain-relief': 94, 'flight-of-the-ball': 92, 'terminator-globe': 92,
  'neural-flow': 90,
  // strong interactive / signature
  'power-flow': 92, 'climate-spiral': 90, 'vote-result': 88, 'shot-map': 86,
  'xg-race': 86, 'momentum-wave': 86, 'tactics-pitch': 86, 'trajectory-arc': 84,
  'descent-profile': 84, 'sea-level-tank': 84, 'core-sample': 82,
  'latency-waterfall': 82, 'scaling-plot': 82, 'arch-stack': 80,
  'swing-dial': 80, 'vote-flow': 80, 'bill-passage': 78, 'margin-ladder': 78,
  'delta-v-ladder': 78, 'signal-readout': 76, 'quake-depth': 76,
  'version-graph': 76, 'throughput-dial': 76, 'elevation-trek': 76,
  'itinerary-reel': 74, 'climate-calendar': 74, 'timezone-arc': 74,
  'player-card': 74, 'player-radar': 72, 'orbital-shells': 72,
  // P6 breadth library (2026-07) — ranked alongside their world-signature siblings
  'constellation-swarm': 90, 'court-value': 86, 'coalition-calculus': 86,
  'plate-motion': 84, 'storm-track': 84, 'packet-trace': 84,
  'lagrange-map': 82, 'queue-cliff': 82, 'transfer-window': 80,
  'gerrymander-lens': 80, 'ballot-flow': 80, 'bill-funnel': 66, 'chip-die': 78,
  'eclipse-cone': 76, 'elo-river': 76, 'city-grid': 74, 'season-wheel': 74,
  'pace-ridge': 72, 'carbon-loop': 66, 'moore-ladder': 64,
  'atmosphere-column': 64, 'altitude-oxygen': 62, 'fare-terrain': 62,
  // classic data
  'data-readout': 70, 'timeline': 66, 'climate-strip': 64, 'carbon-gauge': 64,
  'approval-chart': 62, 'benchmark-chart': 62, 'adoption-curve': 62,
  'launch-stats': 62, 'league-table': 62, 'orbit-trace': 60, 'region-map': 60,
  'elevation-profile': 58, 'commit-grid': 58, 'match-stat-line': 58,
  'route-card': 56, 'city-compare': 56, 'journey-map': 56, 'power-matrix': 56,
  'seat-chart': 54, 'bill-breakdown': 52,
  // narrative-adjacent
  'paradox': 50, 'comparison': 48, 'quote': 40, 'beat-sheet': 36, 'analogy': 34,
  // prose only qualifies with a skimCaption (handled in selection), low prio
  'prose': 10,
  // never cards
  'hero': -1, 'act-break': -1,
};

/* ── per-kind data trimming (spec §4) — clone, cap, never mutate input ── */
type Trim = (data: any) => any;
const cap = <T,>(arr: T[] | undefined, n: number): T[] => (Array.isArray(arr) ? arr.slice(0, n) : []);

const TRIM: Record<string, Trim> = {
  'timeline': (d) => {
    const events: any[] = Array.isArray(d.events) ? [...d.events] : [];
    let keep = events;
    if (events.length > 6) {
      const marked = events.filter((e) => e.state && e.state !== 'default');
      const rest = events.filter((e) => !e.state || e.state === 'default');
      keep = [...marked, ...rest].slice(0, 6)
        .sort((a, b) => events.indexOf(a) - events.indexOf(b));
    }
    return { ...d, events: keep.map((e) => ({ ...e, note: undefined })) };
  },
  'data-readout': (d) => ({ ...d, tiles: cap(d.tiles, 4) }),
  'comparison': (d) => ({ ...d, rows: cap(d.rows, 4) }),
  'beat-sheet': (d) => ({ ...d, beats: cap(d.beats, 4) }),
  'league-table': (d) => ({ ...d, rows: cap(d.rows, 5) }),
  'launch-stats': (d) => ({ ...d, years: cap(d.years, 8) }),
  'benchmark-chart': (d) => ({ ...d, items: cap(d.items, 5) }),
  'margin-ladder': (d) => ({ ...d, rows: cap(d.rows, 6) }),
  'bill-breakdown': (d) => ({ ...d, cards: cap(d.cards, 2) }),
  'seat-chart': (d) => ({ ...d, rows: cap(d.rows, 4), quote: undefined }),
  'itinerary-reel': (d) => ({ ...d, days: cap(d.days, 4) }),
  'city-grid': (d) => ({ ...d, cities: cap(d.cities, 2) }), // CityGrid hard-caps at 3; 2 roses fit a 375 card

  'quote': (d) => ({ ...d, followup: undefined }),
  'vote-result': (d) => ({ ...d, followup: undefined }),
  // WebGL kinds ship data untrimmed — their fallbacks/scenes self-scale.
};

export function fitSectionForStory(section: Section): Section {
  const trim = TRIM[section.kind];
  const data = trim ? trim(section.data ?? {}) : section.data;
  return { ...section, data };
}

/* ── beat text derivation chain (spec §1) ── */
function beatText(section: Section): string | undefined {
  return section.skimCaption ?? section.intro ?? section.title;
}

export function selectStoryCards(issue: {
  hook: string;
  sections: Section[];
  story?: { hook?: string; beats?: { section: number; text: string; kicker?: string }[]; cta?: string };
}): StoryModel {
  const { sections, story } = issue;

  // Authored path — the story block wins wholesale.
  if (story?.beats?.length) {
    const beats: StoryBeatCard[] = story.beats
      .filter((b) => sections[b.section])
      .slice(0, MAX_BEATS)
      .map((b) => ({
        section: fitSectionForStory(sections[b.section]),
        index: b.section,
        text: b.text,
        kicker: b.kicker,
      }));
    return { hook: story.hook ?? issue.hook, beats, cta: story.cta };
  }

  // Derived path — priority-ranked, document order preserved, ≤1 prose card.
  const candidates = sections
    .map((s, i) => ({ s, i, prio: KIND_PRIORITY[s.kind] ?? 30 }))
    .filter((c) => c.prio > 0)
    .filter((c) => (c.s.kind === 'prose' ? !!c.s.skimCaption : true))
    .filter((c) => !!beatText(c.s));

  const picked = candidates
    .sort((a, b) => b.prio - a.prio)
    .slice(0, MAX_BEATS)
    .filter((c, idx, arr) => c.s.kind !== 'prose' || arr.findIndex((x) => x.s.kind === 'prose') === idx)
    .sort((a, b) => a.i - b.i); // back to document order

  const beats: StoryBeatCard[] = picked.map((c) => ({
    section: fitSectionForStory(c.s),
    index: c.i,
    text: beatText(c.s)!,
    kicker: c.s.eyebrow,
  }));

  return { hook: issue.hook, beats, cta: story?.cta };
}
