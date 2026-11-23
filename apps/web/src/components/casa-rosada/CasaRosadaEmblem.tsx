import { Island } from './CasaRosadaScene.js';
import { AnimatedPeople } from './AnimatedPlaza.js';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';
import type { DioramaSituation } from './getDioramaSituation.js';

const PLAZA_MOOD: CasaRosadaMood = {
  sky: 'day',
  crowd: 1,
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
  label: 'Casa Rosada',
};

const PLAZA_SITUATION: DioramaSituation = {
  vacant: false,
  inauguration: false,
  britishFleet: false,
  landing: false,
  combat: false,
};

export function CasaRosadaEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 14 160 76"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Casa Rosada"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      <Island mood={PLAZA_MOOD} />
      <AnimatedPeople mood={PLAZA_MOOD} situation={PLAZA_SITUATION} />
    </svg>
  );
}
