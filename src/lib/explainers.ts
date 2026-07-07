/**
 * Plain-language explainers, keyed by section kind — the ONE dictionary
 * behind both comprehension surfaces:
 *
 *   1. the in-flow "In plain terms" line under every viz section
 *      (core/Section.astro; an authored `section.plain` overrides `what`), and
 *   2. the ⤢ expand-modal study view (core/ExpandModal.astro — serialized
 *      into its inline script as JSON).
 *
 * `what` explains the FORM of the graphic — how to read it, never the data
 * ("each stripe is one year's temperature", not "2023 was the hottest").
 * `how` is the interactive cue shown in the modal.
 *
 * New kinds MUST add an entry here (blueprint §9 supplies the wording; see
 * docs/design/blueprints/_TEMPLATE.md). Narrative kinds (hero, act-break,
 * prose, quote, beat-sheet, analogy, comparison) deliberately have none —
 * they explain themselves.
 */
export interface Explainer {
  what: string;
  how: string;
}

export const EXPLAIN: Record<string, Explainer> = {
  'orbit-globe': { what: 'A 3-D Earth showing the paths satellites travel. Each ring is one orbit at its real altitude and tilt; the coloured dots are satellites, and busier constellations carry more of them.', how: 'Drag to spin the globe — it keeps turning on its own. Country names fade in on the side facing you.' },
  'coalition-orbit': { what: 'Each political party circles the government at the centre as its own body. The bigger the sphere, the more seats that party holds.', how: 'Drag to rotate. Compare sphere sizes to see who holds the balance of power.' },
  'swing-dial': { what: 'A single needle that leans toward whichever of two sides is ahead — the further it tilts, the bigger the lead.', how: 'Read which side the needle points to, and how far over it has swung.' },
  'bill-passage': { what: 'The journey of a bill through every stage of becoming law, each step marked passed, failed, or still pending.', how: 'Follow the cards left to right to see how far it got and where it stalled.' },
  'vote-flow': { what: 'How each voting bloc’s seats flowed into “for”, “against”, or “abstain” — and whether the motion passed.', how: 'Follow a ribbon from a party to its vote; the thicker the ribbon, the more seats it carries.' },
  'margin-ladder': { what: 'Seats ranked by how comfortably they were won. The longer the bar, the bigger the winning margin.', how: 'Long bars are safe seats; the short bars at the bottom were the close contests.' },
  'chamber': { what: 'The chamber from above — every block is one seat, grouped by party. The dashed arc is the majority line.', how: 'Drag to look around. Hover any bloc for its numbers — and if a vote is attached, press DIVISION to watch the seats walk to the lobbies.' },
  'power-flow': { what: 'Money flows left to right — every band is one route, and thicker bands carry more. The moving dashes show direction.', how: 'Follow any band from its source to where it lands; the values are marked mid-stream.' },
  'solar-system': { what: 'A top-down map of the solar system — each ring is one real orbit, each dot a body at its actual position for the story’s date. The amber object is the one this story follows.', how: 'Drag to tilt and spin, scroll to zoom. Hover any body for its distance and year-length.' },
  'trajectory-arc': { what: 'A rocket’s flight from launch to orbit — height climbs as it travels downrange, with each phase of the ascent pinned.', how: 'Trace the arc from liftoff (left) up to orbital insertion (right).' },
  'delta-v-ladder': { what: 'The “fuel budget” (delta-v) it takes to climb from one orbit to the next, stacked into a ladder. Taller blocks need more energy.', how: 'Each block is one leg of the climb; the whole stack is the full trip to escape.' },
  'signal-readout': { what: 'Signal strength across different radio bands, like a mission-control telemetry panel.', how: 'Each bar’s fill shows how strong that band’s signal is right now.' },
  'descent-profile': { what: 'A spacecraft’s altitude over time as it lands — the curve falls as it drops, with the critical moments pinned.', how: 'Read left (high and fast) to right (touchdown).' },
  'terrain-relief': { what: 'The real shape of the ground, drawn as contour rings and ridgelines — each ring joins points at the same height, and the brown lines trace the crests. The vertical scale is stretched to make the relief legible; the caption says by how much.', how: 'Drag to tilt the massif, scroll to zoom. Press the ×-scale button to swap between the true and the exaggerated height. Hover a peak for its elevation.' },
  'neural-flow': { what: 'Each column is one layer of the network and every dot is one unit, at true layer sizes. The lime wave is a single forward pass moving from input to answer.', how: 'Drag to look around the layers. Hover any column for its unit and weight counts.' },
  'terminator-globe': { what: 'A real globe lit for one moment — the shaded half is night, the line across it is where day meets dark, and the terracotta arc is your flight crossing from one into the other.', how: 'Drag to spin the Earth; scroll to zoom. Hover either city for its local clock — and press ARRIVAL to jump the sun forward to when you land.' },
  'flight-of-the-ball': { what: 'The bright line is the ball’s real curved flight; the faint dashed line is the straight path it would have taken with no air. The gap between them is how much the spin bent it.', how: 'Drag to look around the shot, scroll to zoom. Press REPLAY to watch the ball fly the arc again.' },
  'data-globe': { what: 'A 3-D Earth with a bubble on each place. The bigger the bubble, the bigger that place’s value for whatever is being measured.', how: 'Drag to spin; compare bubble sizes across regions.' },
  'core-sample': { what: 'A core drilled into ice or rock, read top (most recent) to bottom (most ancient). Each band is a layer of time.', how: 'Scan down the column to travel further into the past.' },
  'sea-level-tank': { what: 'A cross-section of rising water, with a marked line for each future sea-level scenario.', how: 'The higher the water line, the worse the scenario it represents.' },
  'climate-spiral': { what: 'Temperature for every month, spiralling outward as the years pass. The wider and redder the spiral grows, the more it has warmed.', how: 'Follow the line outward from the centre through time.' },
  'quake-depth': { what: 'Every earthquake plotted by how deep underground it struck and when. Bigger circles are stronger quakes.', how: 'Lower down = deeper; bigger = stronger. Hover a circle for its details.' },
  'arch-stack': { what: 'The layers of a software system stacked like floors of a building — from what users touch at the top down to the infrastructure beneath.', how: 'Top is the front-end; each layer below it is what powers the one above.' },
  'latency-waterfall': { what: 'How long each step of a request takes, laid end-to-end on a timeline. Longer bars are the slower steps.', how: 'Left to right is time elapsed; the longest bar is the bottleneck.' },
  'version-graph': { what: 'A project’s history as a branching tree of commits and releases.', how: 'Follow the line down through time; branches split off and merge back in.' },
  'scaling-plot': { what: 'How performance changes as something grows — for example, model size against accuracy — plotted on a scaling curve.', how: 'Up-and-to-the-right means it keeps improving as it scales.' },
  'throughput-dial': { what: 'A speedometer for how many requests a system handles each second, against its maximum capacity.', how: 'The fuller the arc, the closer the system is to its limit.' },
  'route-globe': { what: 'A 3-D Earth with the flight paths between the cities on a journey, drawn as great-circle arcs.', how: 'Drag to spin; the arcs connect each stop in travel order.' },
  'elevation-trek': { what: 'The ups and downs of elevation along a route — a side-view of the terrain you’d cross.', how: 'Peaks are climbs and dips are descents; left to right is distance travelled.' },
  'itinerary-reel': { what: 'A trip broken into day-by-day cards, each listing what happens that day.', how: 'Move through the days left to right.' },
  'climate-calendar': { what: 'A month-by-month picture of a place’s weather — the typical temperature and rainfall for each month of the year.', how: 'Warmer colours mark hotter months; taller bars mark wetter ones.' },
  'timezone-arc': { what: 'Where it is day or night across several cities at this moment, laid along a 24-hour band.', how: 'Light means daytime, dark means night — read each city’s local time.' },
  'tactics-pitch': { what: 'A team’s shape on the pitch, with every player placed in their position and seen at an angle.', how: 'Drag to rotate the pitch; each disc is a player in their starting spot.' },
  'shot-map': { what: 'Every shot at goal plotted where it was taken. Bigger marks were better chances (higher “xG”).', how: 'Closer to goal and bigger = a better chance; the colour shows what happened.' },
  'xg-race': { what: 'Two teams’ chances stacking up minute by minute. The higher line created the better openings.', how: 'A steeper climb means a spell of strong chances for that team.' },
  'momentum-wave': { what: 'Which team was on top through the match — the wave swells toward whoever was pressing.', how: 'Above the centre line means the home side was on top; below means the away side.' },
  'player-card': { what: 'A player’s headline rating with their key attributes — flip the card for the full breakdown.', how: 'Press Flip to turn the card over and see every stat.' },
  'approval-chart': { what: 'Two lines tracking approval against disapproval over time. Where they cross is the moment opinion flipped.', how: 'A rising accent line means growing approval.' },
  'power-matrix': { what: 'A grid of who controls which institution. Filled cells are full control, hatched cells partial, empty ones none.', how: 'Read each row (an institution) across the columns (the parties).' },
  'paradox': { what: 'Two sides of a contradiction set side by side so you can weigh the competing claims directly.', how: 'Compare the left panel against the right; the pivot marks the tension between them.' },
  'timeline': { what: 'The key events in order down a rail, with coloured dots flagging the pivotal moments.', how: 'Follow the rail from top to bottom through time.' },
  'vote-result': { what: 'How a vote split for against, the threshold it needed to pass, and a chamber showing every member.', how: 'Each dot is one member; the dashed line is the bar the motion had to clear.' },
  'climate-strip': { what: 'Each stripe is one year’s temperature — cooler years blue, warmer years red — with a line tracing the trend.', how: 'Left (past) to right (now); the redder it gets, the hotter the year.' },
  'benchmark-chart': { what: 'Scores compared as horizontal bars, with a reference line for context. Longer is better.', how: 'Compare each bar’s length against the dashed reference mark.' },
  'adoption-curve': { what: 'How fast something caught on over time, following the classic S-shaped adoption curve, with milestones marked.', how: 'The steep middle section is the fast-growth phase.' },
  'route-card': { what: 'A multi-leg journey laid out stop by stop, with the travel mode, distance and time for each leg.', how: 'Read top to bottom in travel order.' },
  'city-compare': { what: 'Two cities compared head-to-head across several measures, with the winner of each row highlighted.', how: 'Each row is one measure; the highlighted side wins it.' },
  'league-table': { what: 'A sports standings table — position, games, points and recent form for each team, with the qualification and relegation bands shaded.', how: 'Top rows make the cut; the shaded bottom rows drop out.' },
  'player-radar': { what: 'A player’s strengths across several skills, drawn as a shape. The bigger the shape, the more complete the player.', how: 'A wider, fuller shape means a stronger all-round player.' },
  'data-readout': { what: 'The headline numbers from the story, each with its unit and a one-line note.', how: 'Each tile is one key figure worth remembering.' },

  // Classic kinds without modal coverage historically — plain-line defaults
  // added 2026-07-05 so every viz gets an in-flow line.
  'seat-chart': { what: 'Seats or races listed with who holds them now and how that changed — the ledger of wins and losses.', how: 'Scan the change column for where the ground shifted.' },
  'bill-breakdown': { what: 'A bill or ruling broken into its key provisions, one card per provision.', how: 'Read the cards in order; the highlighted card is the one that matters most.' },
  'orbital-shells': { what: 'The layers of space around Earth, from low orbit outward, with what lives at each altitude.', how: 'Read outward from Earth: each shell is a different orbital neighbourhood.' },
  'commit-grid': { what: 'Activity over time as a grid of squares — each square is one day, darker means busier.', how: 'Read left to right through the weeks; dark streaks are the intense stretches.' },
  'journey-map': { what: 'The stops of a journey in order, with the story of each leg.', how: 'Follow the line from the first stop to the last.' },
  'match-stat-line': { what: 'The head-to-head numbers from one match, side by side.', how: 'Each row is one stat; the longer side won that battle.' },
  'elevation-profile': { what: 'Heights compared as vertical bands — how high each thing stands against the others.', how: 'Taller band = higher; the axis gives the scale.' },
  'region-map': { what: 'A map with the story’s regions shaded by category and key places pinned.', how: 'The legend decodes the shading; markers pin the named places.' },
  'carbon-gauge': { what: 'How much of the carbon budget is already spent, drawn as a gauge arc.', how: 'The filled arc is what’s used; the remainder is what’s left before the target.' },
};
