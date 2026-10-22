import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { PortraitMood } from './types.js';

type PortraitComponent = LazyExoticComponent<ComponentType<{ mood: PortraitMood }>>;

const POLITICIAN_PORTRAITS: Record<string, PortraitComponent> = {
  milei: lazy(() => import('./MileiPortrait.js')),
  massa: lazy(() => import('./MassaPortrait.js')),
  bullrich: lazy(() => import('./BullrichPortrait.js')),
  bregman: lazy(() => import('./BregmanPortrait.js')),
  schiaretti: lazy(() => import('./SchiarettiPortrait.js')),
  larreta: lazy(() => import('./LarretaPortrait.js')),
};

// Generic president archetypes reuse a real politician's portrait.
const ARCHETYPE_POLITICIAN: Record<string, string> = {
  ingeniero: 'milei',
  populista: 'massa',
  tecnocrata: 'bullrich',
  izquierda: 'bregman',
  federal: 'schiaretti',
  corporativo: 'larreta',
};

export function politicianFor(id: string): string {
  return ARCHETYPE_POLITICIAN[id] ?? id;
}

export const PORTRAITS: Partial<Record<string, PortraitComponent>> = {
  ...POLITICIAN_PORTRAITS,
  ...Object.fromEntries(
    Object.entries(ARCHETYPE_POLITICIAN).map(([archetype, politician]) => [
      archetype,
      POLITICIAN_PORTRAITS[politician],
    ]),
  ),
};
