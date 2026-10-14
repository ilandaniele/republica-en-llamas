import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { resolveCongressSession } from '@republica/game-engine';
import type { EventCard, GameState, CongressDecisions, SwingChoice } from '@republica/game-engine';
import { SWING_POOL } from './congress/congressData.js';
import type { Phase, NEG_ACTIONS } from './congress/congressData.js';
import { computeSeats } from './congress/computeSeats.js';
import { useCongressVote } from './congress/useCongressVote.js';
import { NegotiationPanel } from './congress/NegotiationPanel.js';
import { VotingPanel } from './congress/VotingPanel.js';
import { SwingPanel } from './congress/SwingPanel.js';
import { ResultPanel } from './congress/ResultPanel.js';

interface Props {
  card: EventCard;
  gameState: GameState;
  presidentId: string;
  onComplete: (decisions: CongressDecisions) => void;
}

export function CongressSession({ card, gameState, onComplete }: Props) {
  const { t } = useTranslation();
  const congress = gameState.congress;
  const { governmentSeats, oppositionSeats, independentSeats } = congress;

  const [phase, setPhase] = useState<Phase>('negotiation');
  const [decisions, setDecisions] = useState<CongressDecisions>({ actions: [], swingChoices: [] });

  const outcome = useMemo(() => resolveCongressSession(gameState, decisions), [gameState, decisions]);
  const total = outcome.totalSeats;
  const required = outcome.requiredVotes;
  const swingSens = useMemo(
    () => outcome.swingCandidates.flatMap((id) => SWING_POOL.filter((sen) => sen.id === id)),
    [outcome.swingCandidates],
  );
  const swingIdx = decisions.swingChoices.length;

  const seats = useMemo(
    () => computeSeats({ governmentSeats, oppositionSeats, independentSeats }),
    [governmentSeats, oppositionSeats, independentSeats],
  );
  const { seatVotes, startVoting } = useCongressVote(seats, outcome.independentYesPercent);

  const handleAction = useCallback(
    (action: (typeof NEG_ACTIONS)[number]) => {
      if (decisions.actions.includes(action.id) || outcome.actionPointsLeft <= 0) return;
      setDecisions((prev) => ({ ...prev, actions: [...prev.actions, action.id] }));
      if (action.isDecree) setPhase('result');
    },
    [decisions.actions, outcome.actionPointsLeft],
  );

  const handleVote = useCallback(() => {
    setPhase('voting');
    const hasSwing = outcome.swingCandidates.length > 0;
    startVoting(() => setPhase(hasSwing ? 'swing' : 'result'));
  }, [startVoting, outcome.swingCandidates]);

  const handleSwingChoice = useCallback(
    (choice: SwingChoice) => {
      if (swingIdx >= swingSens.length) return;
      setDecisions((prev) => ({ ...prev, swingChoices: [...prev.swingChoices, choice] }));
      if (swingIdx + 1 >= swingSens.length) setPhase('result');
    },
    [swingSens, swingIdx],
  );

  const currentSwing = swingSens[swingIdx];

  return (
    <div className="event-card border-l-4 border-l-[#1a237e]">
      <div
        className={`mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-400`}
      >
        <span className="text-base">🏛</span>
        <span>SESIÓN PARLAMENTARIA</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'negotiation' && (
          <NegotiationPanel
            card={card}
            congress={congress}
            projectedYes={outcome.votingYes}
            projectedNo={total - outcome.votingYes}
            required={required}
            actionPoints={outcome.actionPointsLeft}
            actionsUsed={decisions.actions}
            onAction={handleAction}
            onVote={handleVote}
          />
        )}
        {phase === 'voting' && (
          <VotingPanel
            title={t(card.titleKey)}
            seats={seats}
            seatVotes={seatVotes}
            required={required}
            total={total}
          />
        )}
        {phase === 'swing' && currentSwing && (
          <SwingPanel
            sen={currentSwing}
            swingIdx={swingIdx}
            swingCount={swingSens.length}
            finalYes={outcome.finalYes}
            total={total}
            required={required}
            seats={seats}
            seatVotes={seatVotes}
            onChoice={handleSwingChoice}
          />
        )}
        {phase === 'result' && (
          <ResultPanel
            card={card}
            finalYes={outcome.finalYes}
            total={total}
            required={required}
            usedDecree={outcome.usedDecree}
            lawPassed={outcome.passed}
            choiceIndex={outcome.choiceIndex}
            onContinue={() => onComplete(decisions)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
