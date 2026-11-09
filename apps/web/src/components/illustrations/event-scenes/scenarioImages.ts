import type { ScenarioId } from '@republica/game-engine';

export const SCENARIO_IMAGES: Partial<Record<ScenarioId, string>> = {
  hiperinflacion_1989: 'scenario_hyperinflation',
  corralito_2001: 'arg_corralito',
  convertibilidad: 'scenario_convertibility',
  rodrigazo_1975: 'scenario_rodrigazo',
  malvinas_1982: 'malvinas',
  kirchnerismo_boom: 'scenario_commodity_boom',
  libertad_avanza_2023: 'scenario_austerity',
  guerra_ucrania_2022: 'int_guerra_ucrania',
  conflicto_iran_2024: 'int_conflicto_iran',
};
