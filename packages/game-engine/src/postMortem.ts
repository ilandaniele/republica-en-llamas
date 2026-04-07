import type { TurnEvent, GameOverReason } from './types.js';

export interface FatalDecision {
  turn: number;
  cardId: string;
  choiceIndex: number;
  impact: number;
}

const GAME_OVER_TO_VARIABLE: Record<GameOverReason, keyof import('./types.js').ChoiceEffect | null> = {
  hyperinflation: 'inflationDelta',
  popularityCollapse: 'popularityDelta',
  socialCollapse: 'stabilityDelta',
  bankrupt: 'deficitDelta',
  impeachment: 'popularityDelta',
  term_complete: null,
  election_loss: 'popularityDelta',
  deflation_spiral: 'inflationDelta',
};

export function getFatalDecision(
  history: TurnEvent[],
  reason: GameOverReason
): FatalDecision | null {
  if (reason === 'term_complete' || history.length === 0) return null;

  const variable = GAME_OVER_TO_VARIABLE[reason];
  if (!variable) return null;

  let worst: FatalDecision | null = null;
  let worstImpact = 0;

  for (const event of history) {
    const delta = (event.effectsApplied[variable] as number | undefined) ?? 0;
    // For inflation/deficit, positive delta is bad; for others, negative is bad
    const isInverse = variable === 'inflationDelta' || variable === 'deficitDelta';
    const impact = isInverse ? delta : -delta;
    if (impact > worstImpact) {
      worstImpact = impact;
      worst = {
        turn: event.turn,
        cardId: event.cardId,
        choiceIndex: event.choiceIndex,
        impact: worstImpact,
      };
    }
  }

  return worst;
}

const COUNTERFACTUALS: Record<string, string> = {
  pol_001: 'Ordenar la investigación hubiera ahorrado el escándalo final.',
  pol_002: 'Negociar con los sindicatos a tiempo hubiera evitado el colapso.',
  pol_003: 'Ceder algo a los aliados hubiera mantenido la coalición.',
  pol_007: 'Retener a los ministros con incentivos era la opción más segura.',
  pol_013: 'Desescalar la protesta a tiempo hubiera salvado la popularidad.',
  eco_001: 'Subir las tasas era doloroso pero hubiera frenado la inflación.',
  eco_003: 'Rescatar los bancos hubiera evitado el contagio financiero.',
  eco_004: 'El ajuste fiscal era amargo pero inevitable para no quebrar.',
  eco_005: 'Defender el tipo de cambio hubiera dado más tiempo para ajustar.',
  eco_010: 'Recortar el gasto a tiempo era mejor que endeudarse más.',
  eco_011: 'Control de capitales temporal hubiera frenado la fuga.',
  eco_013: 'El plan de austeridad de emergencia hubiera calmado a los mercados.',
  eco_015: 'Negociar la reestructuración era mejor que el default.',
  soc_001: 'Dialogar con los manifestantes hubiera detenido la escalada social.',
  soc_003: 'Importar alimentos de emergencia hubiera evitado la escasez crítica.',
  soc_006: 'Invertir en seguridad antes era más barato que el caos después.',
  int_006: 'Buscar aliados alternativos antes de las sanciones hubiera dado margen.',
  int_009: 'Defender la moneda era costoso pero más estable que la caída libre.',
  cri_debt_001: 'La austeridad de guerra era el único camino para recuperar el crédito.',
  cri_hyper_001: 'Anclar la moneda a tiempo hubiera parado la espiral hiperinflacionaria.',
  cri_social_001: 'Negociar en lugar del estado de sitio hubiera salvado la legitimidad.',
  cri_legis_001: 'Negociar con los independientes hubiera sobrevivido la moción.',
  cri_impeach_001: 'El discurso directo al pueblo era la única chance real.',
  char_min_001: 'Escuchar al ministro Paredes desde el principio hubiera evitado el desastre económico.',
  char_sind_001: 'Una relación más cercana con Morales hubiera moderado las huelgas.',
  life_pop_001: 'Convocar el acto de respaldo a tiempo hubiera recuperado la popularidad.',
  life_inf_001: 'Adoptar el plan antiinflacionario completo era la única salida real.',
};

export function getCounterfactual(fatalDecision: FatalDecision | null): string | null {
  if (!fatalDecision) return null;
  return COUNTERFACTUALS[fatalDecision.cardId] ?? null;
}

export function getBestMomentTurn(history: TurnEvent[]): number | null {
  if (history.length === 0) return null;
  let best: { turn: number; total: number } | null = null;
  let runningPop = 0;

  for (const event of history) {
    runningPop += event.effectsApplied.popularityDelta ?? 0;
    if (!best || runningPop > best.total) {
      best = { turn: event.turn, total: runningPop };
    }
  }
  return best?.turn ?? null;
}
