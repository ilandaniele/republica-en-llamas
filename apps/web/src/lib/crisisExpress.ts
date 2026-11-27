import type { Difficulty, EventCard } from '@republica/game-engine';

const CRISIS_SECONDS = 45;
const EXTENDED_CRISIS_SECONDS = 90;

export function crisisSecondsPerTurn(extendedTime: boolean): number {
  return extendedTime ? EXTENDED_CRISIS_SECONDS : CRISIS_SECONDS;
}

export function isTimedTurn(
  card: EventCard | null | undefined,
  isCrisisExpress: boolean,
  difficulty: Difficulty | undefined,
): boolean {
  return isCrisisExpress || (card?.category === 'crisis' && difficulty !== 'easy');
}
