import type { ChoiceEffect, GameState, TurnEvent } from './types.js';
import { CAREER_CARDS } from './events/career.js';
import { DIFFICULTY_MODIFIERS } from './constants.js';
import { clamp } from './utils.js';
import { calculateScore } from './scoring.js';

export const CAREER_START_OFFICES = ['mayor', 'governor', 'minister'] as const;
export type CareerStartOffice = (typeof CAREER_START_OFFICES)[number];
export type CareerOffice = CareerStartOffice | 'president';
export interface CareerState {
  startOffice: CareerStartOffice;
  office: CareerOffice;
  officeTurn: number;
  management: number;
  alliances: number;
  budget: number;
  integrity: number;
  completedTurns: number;
  pendingInauguration: boolean;
  previousHistory: TurnEvent[];
  promotions: { from: CareerStartOffice; to: CareerOffice; turn: number }[];
  lastOutcome?: 'promoted' | 'not_ready' | 'retired' | 'stalled';
}
export const CAREER_LABELS = {
  es: { mayor: 'Intendente', governor: 'Gobernador', minister: 'Ministro nacional', president: 'Presidente' },
  en: { mayor: 'Mayor', governor: 'Governor', minister: 'National minister', president: 'President' },
} as const;
const REQUIREMENTS = {
  mayor: { management: 55, alliances: 45, budget: 15, integrity: 45, support: 50 },
  governor: { management: 70, alliances: 60, budget: 20, integrity: 50, support: 55 },
  minister: { management: 80, alliances: 70, budget: 25, integrity: 55, support: 60 },
};

export function isCareerStartOffice(value: unknown): value is CareerStartOffice {
  return CAREER_START_OFFICES.some((office) => office === value);
}
export function isLowerOffice(state: GameState): boolean {
  return Boolean(state.career && state.career.office !== 'president');
}
export function createCareer(state: GameState, office: CareerStartOffice): GameState {
  return {
    ...state,
    activeCrises: [],
    activeShocks: [],
    political: { ...state.political, popularity: 55 },
    career: {
      startOffice: office,
      office,
      officeTurn: 1,
      management: office === 'mayor' ? 35 : office === 'governor' ? 50 : 60,
      alliances: office === 'mayor' ? 35 : office === 'governor' ? 45 : 55,
      budget: 60,
      integrity: 65,
      completedTurns: 0,
      pendingInauguration: false,
      previousHistory: [],
      promotions: [],
    },
  };
}
export function getCareerRequirements(state: GameState) {
  if (!state.career || state.career.office === 'president') return [];
  const requirements = REQUIREMENTS[state.career.office];
  const values = {
    management: state.career.management,
    alliances: state.career.alliances,
    budget: state.career.budget,
    integrity: state.career.integrity,
    support: state.political.popularity,
  };
  return Object.entries(requirements).map(([key, required]) => ({
    key,
    required,
    value: values[key as keyof typeof values],
  }));
}
export function canAdvanceCareer(state: GameState): boolean {
  const requirements = getCareerRequirements(state);
  return requirements.length > 0 && requirements.every((item) => item.value >= item.required);
}
export function drawCareerCard(state: GameState) {
  const career = state.career!;
  const cards = CAREER_CARDS.filter((card) => card.careerOffice === career.office);
  const promotion = career.officeTurn >= 6 && (career.officeTurn - 6) % 3 === 0;
  if (promotion) return cards.find((card) => card.id.endsWith('_promotion'))!;
  const topics = cards.filter((card) => !card.id.endsWith('_promotion'));
  return topics[(career.officeTurn - 1 + (state.seed % topics.length)) % topics.length]!;
}

function localEffects(state: GameState, effects: ChoiceEffect): GameState {
  const career = state.career!;
  const cleanCareer = { ...career };
  delete cleanCareer.lastOutcome;
  const m = (DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS.normal!).negativeEffectMultiplier;
  const change = (value: number, delta = 0) => clamp(value + (delta < 0 ? delta * m : delta), 0, 100);
  return {
    ...state,
    political: {
      ...state.political,
      popularity: change(state.political.popularity, effects.popularityDelta),
    },
    career: {
      ...cleanCareer,
      management: change(career.management, effects.careerManagementDelta),
      alliances: change(career.alliances, effects.careerAlliancesDelta),
      budget: change(career.budget, effects.careerBudgetDelta),
      integrity: change(career.integrity, effects.careerIntegrityDelta),
    },
  };
}

export function applyCareerChoice(state: GameState, cardId: string, index: number): GameState {
  const card = drawCareerCard(state);
  if (state.isGameOver || card.id !== cardId || !Number.isInteger(index) || !card.choices[index])
    throw new Error('Invalid career decision');
  const promotion = card.id.endsWith('_promotion');
  const effects =
    promotion && index === 0 && !canAdvanceCareer(state)
      ? { popularityDelta: -8, careerAlliancesDelta: -5 }
      : card.choices[index]!.effects;
  let next = localEffects(state, effects);
  next = {
    ...next,
    history: [...state.history, { turn: state.turn, cardId, choiceIndex: index, effectsApplied: effects }],
    drawnCardIds: [...state.drawnCardIds, cardId],
  };
  if (promotion && index === 3)
    return {
      ...next,
      isGameOver: true,
      gameOverReason: 'election_loss',
      career: { ...next.career!, lastOutcome: 'retired' },
    };
  if (!promotion || index !== 0) return next;
  if (!canAdvanceCareer(state)) return { ...next, career: { ...next.career!, lastOutcome: 'not_ready' } };
  const from = state.career!.office as CareerStartOffice;
  const to: CareerOffice = from === 'mayor' ? 'governor' : from === 'governor' ? 'minister' : 'president';
  return {
    ...next,
    career: {
      ...next.career!,
      office: to,
      officeTurn: 0,
      lastOutcome: 'promoted',
      pendingInauguration: to === 'president',
      promotions: [...state.career!.promotions, { from, to, turn: state.turn }],
    },
  };
}

export function getCareerChoicePreview(state: GameState, cardId: string, index: number) {
  const next = applyCareerChoice(state, cardId, index);
  const before = state.career!;
  const after = next.career!;
  return [
    { key: 'support', delta: next.political.popularity - state.political.popularity },
    ...(['management', 'alliances', 'budget', 'integrity'] as const).map((key) => ({
      key,
      delta: after[key] - before[key],
    })),
  ].filter((item) => item.delta !== 0);
}

export function advanceCareerTurn(state: GameState): GameState {
  const career = state.career!;
  const stalled = career.officeTurn >= 15;
  const failure =
    career.budget <= 0
      ? 'bankrupt'
      : career.integrity <= 10
        ? 'impeachment'
        : state.political.popularity <= 10
          ? 'popularityCollapse'
          : stalled
            ? 'election_loss'
            : null;
  const next: GameState = {
    ...state,
    turn: state.turn + 1,
    currentMonth: (state.currentMonth % 12) + 1,
    currentYear: state.currentYear + (state.currentMonth === 12 ? 1 : 0),
    career: {
      ...career,
      officeTurn: career.officeTurn + 1,
      ...(failure === 'election_loss' ? { lastOutcome: 'stalled' as const } : {}),
    },
    ...(failure ? { isGameOver: true, gameOverReason: failure } : {}),
  };
  return { ...next, score: calculateScore(next) };
}
