import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { PortraitMood } from './types.js';

type PortraitComponent = LazyExoticComponent<ComponentType<{ mood: PortraitMood }>>;

const milei = lazy(() => import('./MileiPortrait.js'));
const massa = lazy(() => import('./MassaPortrait.js'));
const bullrich = lazy(() => import('./BullrichPortrait.js'));
const bregman = lazy(() => import('./BregmanPortrait.js'));
const schiaretti = lazy(() => import('./SchiarettiPortrait.js'));
const larreta = lazy(() => import('./LarretaPortrait.js'));

// Generic president archetypes reuse a real politician's portrait.
export const PORTRAITS: Partial<Record<string, PortraitComponent>> = {
  milei,
  massa,
  bullrich,
  bregman,
  schiaretti,
  larreta,
  ingeniero: milei,
  populista: massa,
  tecnocrata: bullrich,
  izquierda: bregman,
  federal: schiaretti,
  corporativo: larreta,
};
