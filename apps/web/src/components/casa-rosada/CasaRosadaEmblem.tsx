import { Island } from './CasaRosadaScene.js';
import { PlazaStrollers } from './PlazaStrollers.js';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';

const PLAZA_MOOD: CasaRosadaMood = {
  sky: 'day',
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
  label: 'Casa Rosada',
};

export function CasaRosadaEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="26 16 108 74"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Casa Rosada"
      className={`casa-rosada-scene ${className ?? ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <Island mood={PLAZA_MOOD} />
      <PlazaStrollers />
    </svg>
  );
}
