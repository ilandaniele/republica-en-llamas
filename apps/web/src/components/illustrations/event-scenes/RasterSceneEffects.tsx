import type { CSSProperties } from 'react';
import { EVENT_ART } from './eventArt.js';
import { presidentSceneEffect } from './presidentScenes.js';
import './raster-effects.css';

type Effect = 'smoke' | 'embers' | 'confetti' | 'rain' | 'flash' | 'signal';

const EVENT_EFFECTS = Object.fromEntries(
  Object.values(EVENT_ART).map(({ scene, effect }) => [scene, [effect]]),
);

const EFFECTS: Record<string, Effect[]> = {
  scenario_hyperinflation: ['flash'],
  scenario_convertibility: ['signal'],
  scenario_rodrigazo: ['smoke'],
  scenario_commodity_boom: ['smoke'],
  scenario_austerity: ['rain'],
  eco_drought: ['smoke'],
  eco_cyberattack: ['signal'],
  eco_lithium: ['signal'],
  eco_automation: ['signal'],
  soc_flood: ['rain'],
  pol_congress: ['flash'],
  pol_scandal: ['flash'],
  pol_protest: ['smoke'],
  pol_election: ['flash'],
  pol_veto: ['flash'],
  eco_inflation: ['embers'],
  eco_reserves: ['signal'],
  eco_growth: ['smoke'],
  eco_dollar_blue: ['rain'],
  eco_corte_luz: ['signal'],
  soc_strike: ['smoke'],
  soc_unrest: ['embers', 'smoke'],
  soc_health: ['signal'],
  soc_housing: ['rain'],
  int_imf: ['flash'],
  int_war: ['signal'],
  int_trade: ['smoke'],
  int_aid: ['smoke'],
  int_guerra_ucrania: ['embers', 'smoke'],
  int_conflicto_iran: ['embers', 'smoke'],
  arg_mundial: ['confetti'],
  arg_corralito: ['rain'],
  arg_campo: ['smoke'],
  arg_dolar: ['rain'],
  arg_congreso_ley: ['signal'],
  arg_fmi_negocio: ['flash'],
  crisis: ['embers', 'smoke'],
  crisis_impeachment: ['flash'],
  guerra_nuke_explosion: ['embers', 'smoke'],
  guerra_nuke_threat: ['signal'],
  guerra_join: ['smoke'],
  malvinas: ['rain'],
};

const COLORS: Record<Effect, string[]> = {
  smoke: ['#53606b', '#75828c'],
  embers: ['#f6b40e', '#e96b30'],
  confetti: ['#74acdf', '#f4f4f0', '#f6b40e'],
  rain: ['#a7c5d9', '#74acdf'],
  flash: ['#fff5d8'],
  signal: ['#ee784e', '#f6b40e'],
};

const SMOKE_SOURCES: Partial<Record<string, readonly [number, number][]>> = {
  scenario_rodrigazo: [[30, 110]],
  scenario_commodity_boom: [[75, 110]],
  eco_drought: [[160, 145]],
  pol_protest: [[250, 90]],
  eco_growth: [
    [85, 45],
    [180, 45],
  ],
  soc_strike: [[25, 120]],
  soc_unrest: [[100, 120]],
  int_trade: [[165, 65]],
  int_aid: [[70, 60]],
  int_guerra_ucrania: [[240, 75]],
  int_conflicto_iran: [[270, 80]],
  arg_campo: [
    [60, 110],
    [240, 110],
  ],
  crisis: [
    [60, 80],
    [270, 90],
  ],
  guerra_nuke_explosion: [[160, 65]],
  guerra_join: [[260, 130]],
};

export function RasterSceneEffects({ scene }: { scene: string }) {
  const presidentEffect = presidentSceneEffect(scene);
  return (
    <g aria-hidden="true" className="raster-effects" pointerEvents="none">
      {(EFFECTS[scene] ?? EVENT_EFFECTS[scene] ?? (presidentEffect ? [presidentEffect] : [])).map(
        (effect) => (
          <g key={effect} data-effect={effect}>
            {Array.from({ length: effect === 'flash' || effect === 'signal' ? 3 : 12 }, (_, i) => {
              const falling = effect === 'rain' || effect === 'confetti';
              const sources = effect === 'smoke' ? SMOKE_SOURCES[scene] : undefined;
              const source = sources?.[i % sources.length];
              const x = source ? source[0] + (i % 3) * 3 : 12 + ((i * 47) % 296);
              const y = source ? source[1] : falling ? -12 : effect === 'embers' ? 150 : 25 + i * 32;
              const size = effect === 'smoke' ? 6 : effect === 'flash' ? 4 : 2;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={size}
                  height={effect === 'rain' ? 5 : size}
                  fill={COLORS[effect][i % COLORS[effect].length]}
                  className={`raster-effect raster-effect--${effect}`}
                  style={
                    {
                      animationDelay: `${-i * 0.37}s`,
                      animationDuration: `${(effect === 'smoke' ? 3 : 2) + (i % 4) * 0.4}s`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </g>
        ),
      )}
    </g>
  );
}
