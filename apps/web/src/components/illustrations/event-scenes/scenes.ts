import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { SceneProps } from './pixel.js';

type SceneComponent = LazyExoticComponent<ComponentType<SceneProps>>;

const scene = (load: () => Promise<{ default: ComponentType<SceneProps> }>): SceneComponent => lazy(load);

const polCongress = scene(() => import('./ScenePolCongress.js'));
const polScandal = scene(() => import('./ScenePolScandal.js'));
const argCampo = scene(() => import('./SceneArgCampo.js'));
const crisis = scene(() => import('./SceneCrisis.js'));

// One lazy chunk per scene; some scene IDs reuse another scene's artwork.
export const SCENES: Partial<Record<string, SceneComponent>> = {
  pol_congress: polCongress,
  arg_congreso_ley: polCongress,
  pol_scandal: polScandal,
  arg_fmi_negocio: polScandal,
  pol_protest: scene(() => import('./ScenePolProtest.js')),
  pol_election: scene(() => import('./ScenePolElection.js')),
  pol_veto: scene(() => import('./ScenePolVeto.js')),
  eco_inflation: scene(() => import('./SceneEcoInflation.js')),
  eco_reserves: scene(() => import('./SceneEcoReserves.js')),
  eco_growth: scene(() => import('./SceneEcoGrowth.js')),
  eco_dollar_blue: scene(() => import('./SceneEcoDolarBlue.js')),
  eco_corte_luz: scene(() => import('./SceneEcoCorteLuz.js')),
  soc_strike: scene(() => import('./SceneSocStrike.js')),
  soc_unrest: scene(() => import('./SceneSocUnrest.js')),
  soc_health: scene(() => import('./SceneSocHealth.js')),
  soc_housing: scene(() => import('./SceneSocHousing.js')),
  int_imf: scene(() => import('./SceneIntImf.js')),
  int_war: scene(() => import('./SceneIntWar.js')),
  int_trade: scene(() => import('./SceneIntTrade.js')),
  int_aid: scene(() => import('./SceneIntAid.js')),
  int_guerra_ucrania: scene(() => import('./SceneIntGuerraUcrania.js')),
  int_conflicto_iran: scene(() => import('./SceneIntConflictoIran.js')),
  arg_mundial: scene(() => import('./SceneArgMundial.js')),
  arg_corralito: scene(() => import('./SceneArgCorralito.js')),
  arg_campo: argCampo,
  arg_dolar: argCampo,
  crisis,
  crisis_impeachment: crisis,
  malvinas: scene(() => import('./SceneCongresoMalvinas.js')),
  guerra_join: scene(() => import('./SceneGuerraJoin.js')),
  guerra_nuke_threat: scene(() => import('./SceneGuerraNukeThreat.js')),
  guerra_nuke_explosion: scene(() => import('./SceneGuerraNukeExplosion.js')),
};
