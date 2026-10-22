import type { GameOverReason } from '@republica/game-engine';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';

const EMPTY_PLAZA: Omit<CasaRosadaMood, 'label'> = {
  sky: 'dusk',
  crowd: 0,
  fire: false,
  police: false,
  helicopter: false,
  escape: false,
  dollarRain: false,
  celebration: false,
  jets: false,
  ruins: false,
  mushroom: false,
  graves: false,
};

const HELICOPTER_ESCAPE = { sky: 'night', crowd: 3, police: true, helicopter: true, escape: true } as const;

const OUTCOME_MOODS: Record<GameOverReason, Partial<CasaRosadaMood> & { label: string }> = {
  impeachment: { ...HELICOPTER_ESCAPE, label: 'JUICIO POLÍTICO: SE VA EN HELICÓPTERO' },
  popularityCollapse: { ...HELICOPTER_ESCAPE, label: 'QUE SE VAYAN TODOS' },
  socialCollapse: { sky: 'night', crowd: 3, fire: true, police: true, label: 'ESTALLIDO SOCIAL' },
  hyperinflation: { sky: 'night', crowd: 2, fire: true, dollarRain: true, label: 'HIPERINFLACIÓN' },
  bankrupt: { crowd: 2, police: true, dollarRain: true, label: 'DEFAULT' },
  deflation_spiral: { label: 'PLAZA VACÍA' },
  election_loss: { crowd: 1, label: 'DERROTA EN LAS URNAS' },
  term_complete: { sky: 'night', celebration: true, label: 'MANDATO CUMPLIDO' },
  nuclear_annihilation: {
    sky: 'night',
    ruins: true,
    mushroom: true,
    graves: true,
    label: 'BUENOS AIRES BORRADA DEL MAPA',
  },
  military_defeat: { sky: 'night', ruins: true, fire: true, jets: true, label: 'DERROTA MILITAR' },
};

export function getOutcomeMood(reason: GameOverReason): CasaRosadaMood {
  return { ...EMPTY_PLAZA, ...OUTCOME_MOODS[reason] };
}
