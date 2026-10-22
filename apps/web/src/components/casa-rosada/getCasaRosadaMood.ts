import type { GameState } from '@republica/game-engine';

export type CrowdLevel = 0 | 1 | 2 | 3;
export type Sky = 'day' | 'dusk' | 'night';

export interface CasaRosadaMood {
  sky: Sky;
  crowd: CrowdLevel;
  fire: boolean;
  police: boolean;
  helicopter: boolean;
  escape: boolean;
  dollarRain: boolean;
  celebration: boolean;
  jets: boolean;
  ruins: boolean;
  mushroom: boolean;
  graves: boolean;
  label: string;
}

const DOLLAR_RAIN_INFLATION = 80;
const HELICOPTER_POPULARITY = 15;
const WAR_FLAGS = ['arg_en_guerra', 'ignored_nuke_threat'];

function getCrowdLevel(socialStability: number, hasUnrest: boolean): CrowdLevel {
  if (hasUnrest || socialStability < 25) return 3;
  if (socialStability < 45) return 2;
  if (socialStability < 60) return 1;
  return 0;
}

function getLabel(mood: Omit<CasaRosadaMood, 'label'>): string {
  if (mood.helicopter) return 'HELICÓPTERO EN LA TERRAZA';
  if (mood.jets) return 'CAZAS SOBRE LA PLAZA';
  if (mood.crowd === 3) return 'PLAZA EN LLAMAS';
  if (mood.dollarRain) return 'CORRIDA CAMBIARIA';
  if (mood.crowd === 2) return 'CACEROLAZO';
  if (mood.crowd === 1) return 'MARCHA EN LA PLAZA';
  if (mood.celebration) return 'FIESTA EN LA PLAZA';
  return 'PLAZA TRANQUILA';
}

export function getCasaRosadaMood(state: GameState): CasaRosadaMood {
  const { popularity, socialStability } = state.political;
  const activeCrises = state.activeCrises.filter((crisis) => !crisis.resolved).map((crisis) => crisis.type);
  const crowd = getCrowdLevel(socialStability, activeCrises.includes('socialUnrest'));
  const helicopter = activeCrises.includes('impeachmentAttempt') || popularity < HELICOPTER_POPULARITY;
  const jets = state.characters.some((character) =>
    character.memoryFlags.some((flag) => WAR_FLAGS.includes(flag)),
  );
  const celebration = popularity >= 70 && socialStability >= 60 && activeCrises.length === 0;
  const sky: Sky =
    crowd === 3 || helicopter ? 'night' : crowd === 2 || activeCrises.length > 0 ? 'dusk' : 'day';

  const mood = {
    sky,
    crowd,
    fire: crowd === 3 || activeCrises.includes('hyperinflationSpiral'),
    police: crowd >= 2,
    helicopter,
    escape: false,
    dollarRain: state.economic.inflation >= DOLLAR_RAIN_INFLATION,
    celebration,
    jets,
    ruins: false,
    mushroom: false,
    graves: false,
  };
  return { ...mood, label: getLabel(mood) };
}
