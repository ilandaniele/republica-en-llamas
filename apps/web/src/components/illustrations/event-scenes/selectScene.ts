import type { GameState } from '@republica/game-engine';

type EventMatcher = (eventId: string) => boolean;
type SceneRule = readonly [scene: string, matches: EventMatcher];

interface CategoryScenes {
  rules: SceneRule[];
  fallback: string[];
}

const is =
  (...ids: string[]): EventMatcher =>
  (eventId) =>
    ids.includes(eventId);
const has =
  (...words: string[]): EventMatcher =>
  (eventId) =>
    words.some((word) => eventId.includes(word));
const startsWith =
  (...prefixes: string[]): EventMatcher =>
  (eventId) =>
    prefixes.some((prefix) => eventId.startsWith(prefix));
const anyOf =
  (...matchers: EventMatcher[]): EventMatcher =>
  (eventId) =>
    matchers.some((matches) => matches(eventId));

// Event-specific keyword overrides: highest priority, checked for every category.
const EVENT_RULES: SceneRule[] = [
  ['arg_mundial', anyOf(is('arg_015'), has('mundial', 'campeon'))],
  ['malvinas', has('malvinas')],
  ['guerra_nuke_explosion', is('guerra_003')],
  ['guerra_nuke_threat', is('guerra_002')],
  ['guerra_join', startsWith('guerra_')],
  ['arg_corralito', anyOf(is('arg_002'), has('corralito'))],
  ['arg_campo', anyOf(is('arg_003'), has('campo'))],
  ['crisis_impeachment', has('impeach', 'juicio_politico')],
  ['arg_dolar', has('dolar', 'dollar', 'devalua', 'tipo_cambio')],
  ['arg_fmi_negocio', has('fmi_deal', 'imf_deal', 'fmi_neg')],
  ['arg_congreso_ley', startsWith('session_law_', 'law_')],
];

// Active scenario drives the illustration for events without a keyword match.
const SCENARIO_SCENE_OVERRIDE: Partial<Record<string, string>> = {
  hiperinflacion_1989: 'eco_inflation',
  corralito_2001: 'arg_corralito',
  convertibilidad: 'eco_growth',
  rodrigazo_1975: 'soc_unrest',
  malvinas_1982: 'malvinas',
  kirchnerismo_boom: 'eco_growth',
  libertad_avanza_2023: 'crisis',
  guerra_ucrania_2022: 'int_guerra_ucrania',
  conflicto_iran_2024: 'int_conflicto_iran',
};

const CATEGORY_SCENES: Partial<Record<string, CategoryScenes>> = {
  international: {
    rules: [
      ['int_imf', has('fmi', 'emb', 'imf')],
      ['int_aid', has('asist', 'ayuda', 'fondo')],
      ['int_war', has('war', 'guerra', 'conflict')],
      ['int_trade', has('trade', 'export', 'comercio')],
    ],
    fallback: ['int_imf', 'int_trade', 'int_war', 'int_aid'],
  },
  economic: {
    rules: [
      ['eco_reserves', has('reserv')],
      ['eco_growth', has('growth', 'pib', 'gdp', 'crecim')],
      ['eco_dollar_blue', has('dolar_blue', 'blue', 'mercado_negro')],
      ['eco_corte_luz', has('corte_luz', 'apagon', 'blackout')],
    ],
    fallback: ['eco_inflation', 'eco_reserves', 'eco_growth', 'eco_dollar_blue'],
  },
  social: {
    rules: [
      ['soc_strike', has('huelga', 'strike', 'sind')],
      ['soc_health', has('health', 'salud', 'hospital')],
      ['soc_housing', has('vivienda', 'alquiler', 'housing', 'inquilino')],
    ],
    fallback: ['soc_unrest', 'soc_strike', 'soc_health', 'soc_housing'],
  },
  political: {
    rules: [
      ['pol_scandal', anyOf(startsWith('scan_'), has('scandal', 'escandalos'))],
      ['pol_protest', has('protest', 'marcha', 'piquete')],
      ['pol_election', has('eleccion', 'election', 'voto', 'ballot')],
      ['pol_veto', has('veto')],
      ['pol_scandal', (eventId) => eventId.startsWith('arg_') && eventId !== 'arg_015'],
    ],
    fallback: ['pol_congress', 'pol_scandal', 'pol_protest', 'pol_election'],
  },
};

function matchRule(rules: SceneRule[], eventId: string): string | undefined {
  return rules.find(([, matches]) => matches(eventId))?.[0];
}

// Trailing number of the event ID (e.g. "eco_007" gives 7) picks a deterministic fallback.
function eventNumber(eventId: string): number {
  return parseInt(eventId.match(/\d+/)?.[0] ?? '0', 10);
}

function isUnpopular(category: string, gameState: GameState | null | undefined): boolean {
  return category === 'political' && (gameState?.political.popularity ?? 50) < 25;
}

export function selectScene(
  category: string,
  eventId: string,
  gameState: GameState | null | undefined,
): string {
  const eventScene = matchRule(EVENT_RULES, eventId);
  if (eventScene) return eventScene;
  if (category === 'crisis') return 'crisis';

  const scenarioScene = gameState?.activeScenario
    ? SCENARIO_SCENE_OVERRIDE[gameState.activeScenario]
    : undefined;
  if (scenarioScene) return scenarioScene;

  const group = CATEGORY_SCENES[category];
  if (!group) return 'pol_congress';

  const ruleScene = matchRule(group.rules, eventId);
  if (ruleScene) return ruleScene;
  if (isUnpopular(category, gameState)) return 'crisis';
  return group.fallback[eventNumber(eventId) % group.fallback.length]!;
}
