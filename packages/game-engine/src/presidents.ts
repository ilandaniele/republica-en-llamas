const ALIASES: Record<string, string> = {
  ingeniero: 'milei',
  populista: 'massa',
  tecnocrata: 'bullrich',
  izquierda: 'bregman',
  federal: 'schiaretti',
  corporativo: 'larreta',
};

export function canonicalPresident(id?: string): string | undefined {
  return id ? (Object.hasOwn(ALIASES, id) ? ALIASES[id] : id) : undefined;
}
import type { ChoiceEffect } from './types.js';

export const PRESIDENT_IDS = [
  'milei',
  'massa',
  'bullrich',
  'bregman',
  'schiaretti',
  'larreta',
  'nestor',
  'cristina',
  'macri',
  'del_cano',
  'kicillof',
  'grabois',
] as const;

export const PRESIDENT_LABELS: Record<string, string> = {
  milei: 'Javier Milei',
  massa: 'Sergio Massa',
  kicillof: 'Axel Kicillof',
  bullrich: 'Patricia Bullrich',
  bregman: 'Myriam Bregman',
  schiaretti: 'Juan Schiaretti',
  larreta: 'Horacio Rodríguez Larreta',
  nestor: 'Néstor Kirchner',
  cristina: 'Cristina Fernández de Kirchner',
  macri: 'Mauricio Macri',
  del_cano: 'Nicolás del Caño',
  grabois: 'Juan Grabois',
};

export function isPresidentId(id: unknown): id is string {
  return typeof id === 'string' && PRESIDENT_IDS.some((president) => president === canonicalPresident(id));
}

const STARTING_EFFECTS: Record<string, ChoiceEffect> = {
  milei: { marketConfidenceDelta: 15, popularityDelta: -10 },
  massa: { popularityDelta: 15, marketConfidenceDelta: -10 },
  bullrich: { stabilityDelta: 10, mediaCredibilityDelta: 5, popularityDelta: -10 },
  bregman: { stabilityDelta: 15, marketConfidenceDelta: -15 },
  schiaretti: { mediaCredibilityDelta: 10, stabilityDelta: 5, popularityDelta: -10 },
  larreta: { marketConfidenceDelta: 10, mediaCredibilityDelta: 5, popularityDelta: -15 },
};

export function presidentStartingEffects(id?: string): ChoiceEffect {
  const president = canonicalPresident(id);
  return president && Object.hasOwn(STARTING_EFFECTS, president) ? STARTING_EFFECTS[president]! : {};
}
