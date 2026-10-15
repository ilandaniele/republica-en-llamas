import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import { getAnibalLine } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';
import { trackGameOver } from '../../lib/analytics.js';
import { ShareImageCard } from './ShareImageCard.js';
import { ShareSection } from './ShareSection.js';
import { GameOverActions } from './GameOverActions.js';
import { buildViralText } from './gameOverCopy.js';
import { NewspaperFront } from './newspaper/NewspaperFront.js';
import { StatBoxes } from './newspaper/StatBoxes.js';
import { ScoreReport } from './newspaper/ScoreReport.js';

export default function GameOverScreen() {
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);
  const personalBest = useGameStore((s) => s.personalBest);
  const updatePersonalBest = useGameStore((s) => s.updatePersonalBest);
  const presidentId = useGameStore((s) => s.presidentId);
  const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePersonalBest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gameState) {
      trackGameOver({
        turns_survived: gameState.turn,
        reason: gameState.gameOverReason ?? 'hyperinflation',
        score: gameState.score,
        difficulty: gameState.difficulty,
        president: presidentId,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Guard: if no game state, navigate away (must be in useEffect, not in render)
  useEffect(() => {
    if (!gameState) navigate('/');
  }, [gameState, navigate]);

  if (!gameState) return null;

  const reason = gameState.gameOverReason ?? 'hyperinflation';
  const isWin = reason === 'term_complete';
  const anibalLine = getAnibalLine(gameState);
  const viralText = buildViralText(gameState, reason, presidentId, anibalLine);

  return (
    <>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center p-6"
        style={{ background: 'var(--night-blue)' }}
      >
        <div className="w-full max-w-2xl">
          <div className="pixel-border overflow-hidden bg-[#f4f4f0] text-smoke-900">
            <NewspaperFront turn={gameState.turn} reason={reason} presidentId={presidentId} isWin={isWin} />
            <StatBoxes gameState={gameState} isWin={isWin} />
            <ScoreReport
              gameState={gameState}
              reason={reason}
              isWin={isWin}
              personalBest={personalBest}
              isCrisisExpress={isCrisisExpress}
              anibalLine={anibalLine}
            />
          </div>
          <ShareSection viralText={viralText} shareCardRef={shareCardRef} />
          <GameOverActions />
        </div>
      </m.div>

      <ShareImageCard
        ref={shareCardRef}
        gameState={gameState}
        presidentId={presidentId}
        score={gameState.score}
      />
    </>
  );
}
