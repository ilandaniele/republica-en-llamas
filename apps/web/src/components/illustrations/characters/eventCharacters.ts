import type { EventCard } from '@republica/game-engine';

export const EVENT_CHARACTERS: Record<string, { label: string; events: string[] }> = {
  docente: {
    label: 'Docente',
    events: ['soc_002', 'law_003', 'session_law_004'],
  },
  medica: {
    label: 'Médica',
    events: ['soc_004', 'scn_004'],
  },
  empresaria: {
    label: 'Empresaria',
    events: ['eco_002', 'eco_007'],
  },
  jubilado: {
    label: 'Jubilado',
    events: ['law_005', 'session_law_003'],
  },
  productor: {
    label: 'Productor rural',
    events: ['new_001', 'arg_003', 'geo_003'],
  },
  jueza: {
    label: 'Jueza',
    events: ['con_002', 'scn_002', 'arg_009'],
  },
  militar: {
    label: 'Militar',
    events: [
      'guerra_001',
      'guerra_002',
      'guerra_003',
      'malvinas_002',
      'malvinas_003',
      'malvinas_004',
      'geo_004',
    ],
  },
  cientifica: {
    label: 'Científica',
    events: ['new_003', 'new_005', 'new_009', 'law_006'],
  },
};

export function getEventCharacter(card: Pick<EventCard, 'id' | 'characterId'>): string | undefined {
  if (card.characterId) return undefined;
  return Object.entries(EVENT_CHARACTERS).find(([, character]) => character.events.includes(card.id))?.[0];
}
