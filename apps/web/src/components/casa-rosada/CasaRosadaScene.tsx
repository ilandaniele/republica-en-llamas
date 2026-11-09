import { useEffect, useRef, useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { GameOverReason, GameState } from '@republica/game-engine';
import { getCasaRosadaMood, type CasaRosadaMood } from './getCasaRosadaMood.js';
import { getOutcomeMood } from './getOutcomeMood.js';
import { SkyLayer } from './SkyLayer.js';
import { Building } from './Building.js';
import { PlazaLayer } from './PlazaLayer.js';
import { PoliceLine } from './CrowdLayer.js';
import { Barricade, DollarRain, Fireworks, Helicopter } from './Effects.js';
import { GravesFallback, JetsFallback, MushroomFallback, RuinsOverlay } from './Threats.js';
import { Drift, Flicker, FlyAway, Hover, Pulse, Shake } from './motion.js';
import { Sprite } from './Sprite.js';
import { AnimatedPeople, Inauguration, BritishArrival, CombatActors } from './AnimatedPlaza.js';
import { getDioramaSituation, type DioramaSituation } from './getDioramaSituation.js';
import { getPlazaActivity } from './getPlazaActivity.js';
import { PlazaProps, PlazaPerformers } from './PlazaActivity.js';
import { getRiotResponse, RIOT_LABELS } from './getRiotResponse.js';
import { RiotEffects, RiotOfficers } from './RiotResponse.js';
import { ArgentineFlag } from './ArgentineFlag.js';
import { useGameImage } from '../../hooks/useGameImage.js';

const ISLAND_BOX = { x: 0, y: 18, w: 160, h: 72 };
const FIRE_X = [32, 114];

function Island({ mood }: { mood: CasaRosadaMood }) {
  const maskId = useId();
  const islandImage = useGameImage('cr_island');
  const plaza = (
    <>
      <Building sky={mood.sky} />
      <PlazaLayer guards={mood.crowd < 2 && !mood.ruins} />
    </>
  );
  if (!mood.ruins) {
    if (!islandImage) return plaza;
    return (
      <>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={160} height={90}>
            <rect x={0} y={0} width={160} height={90} fill="white" />
            <rect x={70} y={18} width={8} height={8} fill="black" />
            <rect x={87} y={18} width={8} height={8} fill="black" />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <Sprite id="cr_island" box={ISLAND_BOX} fallback={plaza} />
        </g>
        <g data-roof-flags="true">
          <ArgentineFlag x={70} y={18} />
          <ArgentineFlag x={87} y={18} phase={-0.35} />
        </g>
      </>
    );
  }
  const ruins = (
    <>
      {plaza}
      <RuinsOverlay />
    </>
  );
  return <Sprite id="cr_island_ruins" box={ISLAND_BOX} fallback={ruins} />;
}

function Fire() {
  return (
    <>
      {FIRE_X.map((x, i) => (
        <Flicker key={x} dur="0.4s" begin={`${i * 0.2}s`}>
          <Sprite id="cr_fire" box={{ x, y: 53, w: 12, h: 18 }} fallback={<Barricade x={x + 4} />} />
        </Flicker>
      ))}
    </>
  );
}

function HelicopterLayer({ escape }: { escape: boolean }) {
  const sprite = (
    <>
      <Sprite id="cr_helicopter" box={{ x: 94, y: 22, w: 34, h: 17 }} fallback={<Helicopter />} />
      <g opacity="0.65">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="0.12s" repeatCount="indefinite" />
        <rect x={101} y={24} width={22} height={1} fill="#cbd6db" />
      </g>
    </>
  );
  if (escape) return <FlyAway dur="4s">{sprite}</FlyAway>;
  return <Hover dur="1s">{sprite}</Hover>;
}

function SceneLayers({
  mood,
  situation,
  presidentId,
  state,
}: {
  mood: CasaRosadaMood;
  situation: DioramaSituation;
  presidentId: string;
  state: GameState;
}) {
  const activity = getPlazaActivity(state, mood, situation);
  const response = getRiotResponse(state, mood, situation);
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
      {situation.britishFleet && <BritishArrival situation={situation} />}
      <Island mood={mood} />
      {situation.inauguration && <Inauguration presidentId={presidentId} />}
      {mood.helicopter && <HelicopterLayer escape={mood.escape} />}
      {mood.police && (
        <Sprite id="cr_police" box={{ x: 48, y: 55, w: 64, h: 12 }} fallback={<PoliceLine />} />
      )}
      <PlazaProps activity={activity} />
      <RiotOfficers response={response} />
      <AnimatedPeople mood={mood} situation={situation} />
      <PlazaPerformers activity={activity} />
      <CombatActors situation={situation} />
      {mood.graves && (
        <Sprite id="cr_graves" box={{ x: 24, y: 66, w: 112, h: 20 }} fallback={<GravesFallback />} />
      )}
      {mood.fire && <Fire />}
      <RiotEffects response={response} />
      {mood.dollarRain && <DollarRain />}
    </>
  );
}

function isTense(mood: CasaRosadaMood): boolean {
  return mood.mushroom;
}

interface Props {
  state: GameState;
  outcome?: GameOverReason;
}

export function CasaRosadaScene({ state, outcome }: Props) {
  const situation = getDioramaSituation(state, outcome);
  const baseMood = outcome ? getOutcomeMood(outcome) : getCasaRosadaMood(state);
  const mood: CasaRosadaMood = situation.inauguration
    ? {
        ...baseMood,
        sky: 'day',
        crowd: 0,
        celebration: true,
        fire: false,
        police: false,
        helicopter: false,
        label: 'ASUNCIÓN PRESIDENCIAL: PLAZA LLENA',
      }
    : situation.landing
      ? { ...baseMood, label: 'DESEMBARCO BRITÁNICO', sky: 'dusk' }
      : situation.britishFleet
        ? { ...baseMood, label: 'FLOTA BRITÁNICA EN CAMINO' }
        : situation.combat
          ? { ...baseMood, label: 'ENFRENTAMIENTO ARMADO', sky: 'night' }
          : baseMood;
  const svgRef = useRef<SVGSVGElement>(null);
  const visualState = outcome ? { ...state, isGameOver: true } : state;
  const sceneLabel = RIOT_LABELS[getRiotResponse(visualState, mood, situation).phase] ?? mood.label;
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) svgRef.current?.pauseAnimations?.();
    else svgRef.current?.unpauseAnimations?.();
  }, [reducedMotion]);
  const layers = (
    <SceneLayers
      mood={mood}
      situation={situation}
      presidentId={state.presidentId ?? 'populista'}
      state={visualState}
    />
  );
  return (
    <figure
      className="casa-rosada-scene w-full"
      data-situation={
        situation.inauguration
          ? 'inauguration'
          : situation.landing
            ? 'landing'
            : situation.combat
              ? 'combat'
              : situation.britishFleet
                ? 'fleet'
                : 'plaza'
      }
    >
      <svg
        ref={svgRef}
        viewBox="0 0 160 90"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Casa Rosada: ${sceneLabel}`}
        style={{ width: '100%', height: 'auto', display: 'block', imageRendering: 'pixelated' }}
      >
        <SkyLayer sky={mood.sky} />
        {isTense(mood) ? <Shake dur="0.3s">{layers}</Shake> : layers}
      </svg>
      <figcaption
        className="bg-navy-900 py-1 text-center"
        style={{
          fontFamily: 'var(--font-readable)',
          fontSize: '13px',
          lineHeight: '1.4',
          color: 'var(--gold)',
        }}
      >
        {sceneLabel}
      </figcaption>
    </figure>
  );
}
