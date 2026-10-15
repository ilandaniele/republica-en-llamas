import { useEffect, useRef } from 'react';
import type { GameState } from '@republica/game-engine';
import { useTransientValue } from '../../../hooks/useTransientValue.js';

const MILESTONE_MESSAGES: Record<number, string> = {
  10: '¡Sobreviviste el primer mes de gobierno!',
  20: 'Mitad del mandato. El pueblo te juzga.',
  30: 'Los medios no paran de hablar de vos.',
  40: 'Se vienen las elecciones. ¿Llegás?',
};

/** Flashes the floating dollar when inflation crosses 50. */
function useDolarFloat(inflation: number | undefined) {
  const [showDolarFloat, flashDolarFloat] = useTransientValue(false);
  const prevInflationRef = useRef<number | null>(null);

  useEffect(() => {
    if (inflation === undefined) return;
    if (prevInflationRef.current !== null && prevInflationRef.current < 50 && inflation >= 50) {
      flashDolarFloat(true, 2000);
    }
    prevInflationRef.current = inflation;
  }, [inflation, flashDolarFloat]);

  return showDolarFloat;
}

/** Shows the torch crowd when popularity hits zero. */
function useCrowd(popularity: number | undefined) {
  const [showCrowd, flashCrowd] = useTransientValue(false);

  useEffect(() => {
    if (popularity !== undefined && popularity <= 0) flashCrowd(true, 2000);
  }, [popularity, flashCrowd]);

  return showCrowd;
}

/** Throws confetti every time a law is passed. */
function useConfetti(lawsPassed: number | undefined) {
  const [showConfetti, flashConfetti] = useTransientValue(false);
  const prevLawsPassedRef = useRef(0);

  useEffect(() => {
    if (lawsPassed === undefined) return;
    if (lawsPassed > prevLawsPassedRef.current) flashConfetti(true, 1500);
    prevLawsPassedRef.current = lawsPassed;
  }, [lawsPassed, flashConfetti]);

  return showConfetti;
}

/** Milestone toast at turns 10, 20, 30 and 40, once per run. */
function useMilestoneToast(turn: number | undefined) {
  const [milestoneToast, showMilestoneToast] = useTransientValue<string | null>(null);
  const shownMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (turn === undefined) return;
    const message = MILESTONE_MESSAGES[turn];
    if (message && !shownMilestonesRef.current.has(turn)) {
      shownMilestonesRef.current.add(turn);
      showMilestoneToast(message, 4000);
    }
  }, [turn, showMilestoneToast]);

  return milestoneToast;
}

export function useEasterEggs(gameState: GameState | null) {
  return {
    showDolarFloat: useDolarFloat(gameState?.economic.inflation),
    showCrowd: useCrowd(gameState?.political.popularity),
    showConfetti: useConfetti(gameState?.congress.lawsPassedThisRun),
    milestoneToast: useMilestoneToast(gameState?.turn),
  };
}
