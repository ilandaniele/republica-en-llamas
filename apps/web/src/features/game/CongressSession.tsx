import { useState, useMemo, useCallback, useRef } from 'react';
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
  const phaseRef = useRef<Phase>('negotiation');
  const decisionsRef = useRef(decisions);
  const completedRef = useRef(false);
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const changeDecisions = useCallback((next: CongressDecisions) => {
    decisionsRef.current = next;
    setDecisions(next);
  }, []);

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
  const { seatVotes, startVoting, finishVoting } = useCongressVote(seats, outcome.independentYesPercent);

  const handleAction = useCallback(
    (action: (typeof NEG_ACTIONS)[number]) => {
      const current = decisionsRef.current;
      if (
        phaseRef.current !== 'negotiation' ||
        current.actions.includes(action.id) ||
        resolveCongressSession(gameState, current).actionPointsLeft <= 0
      )
        return;
      changeDecisions({ ...current, actions: [...current.actions, action.id] });
      if (action.isDecree) changePhase('result');
    },
    [gameState, changeDecisions, changePhase],
  );

  const handleVote = useCallback(() => {
    if (phaseRef.current !== 'negotiation') return;
    const hasSwing = resolveCongressSession(gameState, decisionsRef.current).swingCandidates.length > 0;
    changePhase('voting');
    startVoting(() => changePhase(hasSwing ? 'swing' : 'result'));
  }, [startVoting, gameState, changePhase]);

  const handleSwingChoice = useCallback(
    (choice: SwingChoice) => {
      const current = decisionsRef.current;
      if (
        phaseRef.current !== 'swing' ||
        current.swingChoices.length !== swingIdx ||
        swingIdx >= swingSens.length
      )
        return;
      changeDecisions({ ...current, swingChoices: [...current.swingChoices, choice] });
      if (swingIdx + 1 >= swingSens.length) changePhase('result');
    },
    [swingSens, swingIdx, changeDecisions, changePhase],
  );

  const currentSwing = swingSens[swingIdx];

  return (
    <div className="congress-session event-card border-l-4 border-l-[#1a237e]">
      <div
        className={`mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-400`}
      >
        <span className="text-base">🏛</span>
        <span>SESIÓN PARLAMENTARIA</span>
      </div>

      <div key={phase === 'swing' ? `swing-${swingIdx}` : phase}>
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
            finalYes={outcome.votingYes}
            onFinish={finishVoting}
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
            onContinue={() => {
              if (phaseRef.current !== 'result' || completedRef.current) return;
              completedRef.current = true;
              onComplete(decisionsRef.current);
            }}
          />
        )}
      </div>
    </div>
  );
}
