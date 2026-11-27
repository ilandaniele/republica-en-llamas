import type { ScenarioId } from '@republica/game-engine';
import manifest from '../../../assets/image-manifest.json';

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
  primavera_1983: 'pol_election',
  crisis_campo_2008: 'arg_campo',
  corrida_2018: 'arg_dolar',
  pandemia_2020: 'soc_health',
};

/** Dedicated `scenario_<id>` cover once imported, otherwise the shared scene above. */
export function scenarioImage(id: ScenarioId): string | undefined {
  const dedicated = `scenario_${id}`;
  return dedicated in manifest ? dedicated : SCENARIO_IMAGES[id];
}
