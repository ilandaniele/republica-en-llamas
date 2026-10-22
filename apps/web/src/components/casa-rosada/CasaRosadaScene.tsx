import type { GameOverReason, GameState } from '@republica/game-engine';
import { getCasaRosadaMood, type CasaRosadaMood } from './getCasaRosadaMood.js';
import { getOutcomeMood } from './getOutcomeMood.js';
import { SkyLayer } from './SkyLayer.js';
import { Building } from './Building.js';
import { PlazaLayer } from './PlazaLayer.js';
import { CrowdLayer, PoliceLine } from './CrowdLayer.js';
import { Barricade, DollarRain, Fireworks, Helicopter } from './Effects.js';
import { GravesFallback, JetsFallback, MushroomFallback, RuinsOverlay } from './Threats.js';
import { Bob, Drift, Flicker, FlyAway, Hover, Pulse, Shake } from './motion.js';
import { Sprite } from './Sprite.js';

const ISLAND_BOX = { x: 0, y: 18, w: 160, h: 72 };
const CROWD_BOX = { x: 8, y: 62, w: 144, h: 26 };
const FIRE_X = [16, 120];

function Island({ mood }: { mood: CasaRosadaMood }) {
  const plaza = (
    <>
      <Building sky={mood.sky} />
      <PlazaLayer guards={mood.crowd < 2 && !mood.ruins} />
    </>
  );
  if (!mood.ruins) return <Sprite id="cr_island" box={ISLAND_BOX} fallback={plaza} />;
  const ruins = (
    <>
      {plaza}
      <RuinsOverlay />
    </>
  );
  return <Sprite id="cr_island_ruins" box={ISLAND_BOX} fallback={ruins} />;
}

function Crowd({ mood }: { mood: CasaRosadaMood }) {
  if (mood.celebration) {
    return (
      <Bob dur="0.5s">
        <Sprite id="cr_crowd_party" box={CROWD_BOX} fallback={<CrowdLayer level={1} />} />
      </Bob>
    );
  }
  if (mood.crowd === 0) return null;
  return (
    <Bob dur={mood.crowd === 3 ? '0.4s' : '0.7s'}>
      <Sprite id={`cr_crowd_${mood.crowd}`} box={CROWD_BOX} fallback={<CrowdLayer level={mood.crowd} />} />
    </Bob>
  );
}

function Fire() {
  return (
    <>
      {FIRE_X.map((x, i) => (
        <Flicker key={x} dur="0.4s" begin={`${i * 0.2}s`}>
          <Sprite id="cr_fire" box={{ x, y: 60, w: 20, h: 26 }} fallback={<Barricade x={x + 4} />} />
        </Flicker>
      ))}
    </>
  );
}

function HelicopterLayer({ escape }: { escape: boolean }) {
  const sprite = <Sprite id="cr_helicopter" box={{ x: 94, y: 22, w: 34, h: 17 }} fallback={<Helicopter />} />;
  if (escape) return <FlyAway dur="4s">{sprite}</FlyAway>;
  return <Hover dur="1s">{sprite}</Hover>;
}

function SceneLayers({ mood }: { mood: CasaRosadaMood }) {
  return (
    <>
      {mood.celebration && <Fireworks />}
      {mood.mushroom && (
        <Pulse dur="2s">
          <Sprite id="cr_mushroom" box={{ x: 40, y: 0, w: 80, h: 60 }} fallback={<MushroomFallback />} />
        </Pulse>
      )}
      {mood.jets && (
        <Drift dur="5s">
          <Sprite id="cr_jets" box={{ x: 20, y: 2, w: 120, h: 20 }} fallback={<JetsFallback />} />
        </Drift>
      )}
      <Island mood={mood} />
      {mood.helicopter && <HelicopterLayer escape={mood.escape} />}
      {mood.police && (
        <Sprite id="cr_police" box={{ x: 46, y: 58, w: 68, h: 18 }} fallback={<PoliceLine />} />
      )}
      <Crowd mood={mood} />
      {mood.graves && (
        <Sprite id="cr_graves" box={{ x: 24, y: 66, w: 112, h: 20 }} fallback={<GravesFallback />} />
      )}
      {mood.fire && <Fire />}
      {mood.dollarRain && <DollarRain />}
    </>
  );
}

function isTense(mood: CasaRosadaMood): boolean {
  return mood.crowd === 3 || mood.escape || mood.mushroom;
}

interface Props {
  state: GameState;
  outcome?: GameOverReason;
}

export function CasaRosadaScene({ state, outcome }: Props) {
  const mood = outcome ? getOutcomeMood(outcome) : getCasaRosadaMood(state);
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 160 90"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Casa Rosada: ${mood.label}`}
        style={{ width: '100%', height: 'auto', display: 'block', imageRendering: 'pixelated' }}
      >
        <SkyLayer sky={mood.sky} />
        {isTense(mood) ? (
          <Shake dur="0.3s">
            <SceneLayers mood={mood} />
          </Shake>
        ) : (
          <SceneLayers mood={mood} />
        )}
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
