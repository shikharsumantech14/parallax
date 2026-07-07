/* Scene registry — every scene is its OWN lazy chunk. Adding a scene:
   create scenes/<name>.ts exporting `build: SceneBuilder`, add one line here.
   (docs/design/blueprints/ holds the specs; docs/design/CANON.md the rules.) */
import type { SceneRegistry } from '../runtime';

export const builders: SceneRegistry = {
  'orbit-globe':     { load: () => import('./orbitGlobe') },
  'coalition-orbit': { load: () => import('./coalitionOrbit') },
  'data-globe':      { load: () => import('./dataGlobe') },
  'route-globe':     { load: () => import('./routeGlobe') },
  'solar-system':    { load: () => import('./solarSystem') },
  'chamber':         { load: () => import('./chamber') },
  'terrain-relief':  { load: () => import('./terrainRelief') },
  'neural-flow':     { load: () => import('./neuralFlow') },
  'terminator-globe':{ load: () => import('./terminatorGlobe') },
  'flight-of-the-ball': { load: () => import('./flightOfTheBall') },
};
