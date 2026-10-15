import { m, AnimatePresence } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import { useGameStore } from '../../../stores/gameStore.js';
import { trackCongressSession, trackTurnCompleted } from '../../../lib/analytics.js';
import { CongressSession } from '../CongressSession.js';
import { EventCardComponent } from '../EventCardComponent.js';

export function CardArea({ gameState }: { gameState: GameState }) {
  const currentCard = useGameStore((s) => s.currentCard);
  const pendingChoiceIndex = useGameStore((s) => s.pendingChoiceIndex);
  const isAnimating = useGameStore((s) => s.isAnimating);
  const showTransition = useGameStore((s) => s.showTransition);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const confirmChoice = useGameStore((s) => s.confirmChoice);
  const resolveCongressSession = useGameStore((s) => s.resolveCongressSession);
  const presidentId = useGameStore((s) => s.presidentId);

  if (!currentCard) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAnimating && currentCard?.isLaw ? (
          <CongressSession
            key={currentCard.id}
            card={currentCard}
            gameState={gameState}
            presidentId={presidentId}
            onComplete={(decisions) => {
              trackCongressSession({ law: currentCard.id, turn: gameState.turn });
              resolveCongressSession(currentCard.id, decisions);
            }}
          />
        ) : !isAnimating ? (
          <EventCardComponent
            key={currentCard.id}
            card={currentCard}
            selectedIndex={pendingChoiceIndex}
            onSelect={selectChoice}
            onConfirm={() => {
              if (pendingChoiceIndex !== null && currentCard) {
                trackTurnCompleted({
                  turn_number: gameState.turn,
                  event_category: currentCard.category,
                  choice_index: pendingChoiceIndex,
                });
              }
              confirmChoice();
            }}
            disabled={isAnimating}
            presidentId={presidentId}
            gameState={gameState}
          />
        ) : null}
      </AnimatePresence>

      {isAnimating && !showTransition && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 items-center justify-center"
        >
          <p className="animate-pulse font-mono text-2xl text-gold-400">Aplicando decisión...</p>
        </m.div>
      )}
    </>
  );
}
