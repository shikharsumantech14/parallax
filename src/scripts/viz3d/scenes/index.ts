/* Scene registry — every scene is its OWN lazy chunk. Adding a scene:
   create scenes/<name>.ts exporting `build: SceneBuilder`, add one line here.
   (docs/design/blueprints/ holds the specs; docs/design/LENS.md the rules.)
   Ten scenes since the Lens verdict (2026-09-30) dropped the four
   generic globes: orbit-globe, coalition-orbit, data-globe, route-globe. */
import type { SceneRegistry } from '../runtime';

export const builders: SceneRegistry = {
  'solar-system':    { load: () => import('./solarSystem') },
  'constellation-swarm': { load: () => import('./constellationSwarm') },
  'chamber':         { load: () => import('./chamber') },
  'terrain-relief':  { load: () => import('./terrainRelief') },
  'plate-motion':    { load: () => import('./plateMotion') },
  'storm-track':     { load: () => import('./stormTrack') },
  'neural-flow':     { load: () => import('./neuralFlow') },
  'packet-trace':    { load: () => import('./packetTrace') },
  'terminator-globe':{ load: () => import('./terminatorGlobe') },
  'flight-of-the-ball': { load: () => import('./flightOfTheBall') },
};
