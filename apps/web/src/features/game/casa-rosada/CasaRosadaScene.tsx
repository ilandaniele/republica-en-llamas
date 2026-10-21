import type { GameState } from '@republica/game-engine';
import { getCasaRosadaMood } from './getCasaRosadaMood.js';
import { SkyLayer } from './SkyLayer.js';
import { Building } from './Building.js';
import { PlazaLayer } from './PlazaLayer.js';
import { CrowdLayer } from './CrowdLayer.js';
import { DollarRain, FireLayer, Fireworks, Helicopter } from './Effects.js';

export function CasaRosadaScene({ state }: { state: GameState }) {
  const mood = getCasaRosadaMood(state);
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 160 90"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Casa Rosada: ${mood.label}`}
        shapeRendering="crispEdges"
        style={{ width: '100%', height: 'auto', display: 'block', imageRendering: 'pixelated' }}
      >
        <SkyLayer sky={mood.sky} />
        {mood.celebration && <Fireworks />}
        <Building sky={mood.sky} />
        {mood.helicopter && <Helicopter />}
        <PlazaLayer guards={mood.crowd < 2} />
        <CrowdLayer level={mood.crowd} police={mood.police} />
        {mood.fire && <FireLayer />}
        {mood.dollarRain && <DollarRain />}
      </svg>
      <figcaption
        className="bg-navy-900 py-1 text-center"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--gold)' }}
      >
        {mood.label}
      </figcaption>
    </figure>
  );
}
