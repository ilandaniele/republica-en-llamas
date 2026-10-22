import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';
import { VariablesPanel } from './VariablesPanel.js';
import { CrisisAlert } from './CrisisAlert.js';
import { TensionMeter } from './TensionMeter.js';
import { TutorialOverlay } from './TutorialOverlay.js';
import { OfflineBanner } from '../../components/OfflineBanner.js';
import { TurnTransitionScreen } from './TurnTransitionScreen.js';
import { DecisionDiary } from './DecisionDiary.js';
import type { PortraitMood } from '../../components/illustrations/PixelPortrait.js';
import { getFeatureFlag, trackExperimentStarted } from '../../lib/analytics.js';
import { BuenosAiresBackground } from '../../components/illustrations/BuenosAiresBackground.js';
import { AnibalTicker } from './AnibalTicker.js';
import { PaywallModal } from '../../components/PaywallModal.js';
import { useEntitlements } from '../../hooks/useEntitlements.js';
import { useCrisisCountdown } from './screen/useCrisisCountdown.js';
import { useCardShake } from './screen/useCardShake.js';
import { useIdlePresidentMood } from './screen/useIdlePresidentMood.js';
import { useEasterEggs } from './screen/useEasterEggs.js';
import { useChoiceHotkeys } from './screen/useChoiceHotkeys.js';
import { GameHeader } from './screen/GameHeader.js';
import { CardArea } from './screen/CardArea.js';
import { ActiveShocks, EasterEggOverlays, MilestoneToast } from './screen/GameOverlays.js';

function isAnyVariableBelowTen(gameState: GameState): boolean {
  return [
    gameState.political.popularity,
    gameState.political.socialStability,
    gameState.economic.marketConfidence,
    gameState.economic.currencyStrength,
    gameState.economic.foreignReserves,
  ].some((v) => v < 10);
}

function getMoodBackground(gameState: GameState): string {
  if (gameState.activeCrises.length > 0) return '#7A2A20';
  if (isAnyVariableBelowTen(gameState) || gameState.political.popularity < 35) return '#34507A';
  return 'var(--celeste-dark)';
}

function getPresidentMood(gameState: GameState): PortraitMood {
  if (gameState.activeCrises.length > 0 || isAnyVariableBelowTen(gameState)) return 'panic';
  return gameState.political.popularity > 65 ? 'victory' : 'neutral';
}

function useMidGamePaywall(turn: number | undefined) {
  const { hasEntitlement } = useEntitlements();
  const paywallTimingVariant = getFeatureFlag('paywall_timing') ?? 'after_game_over';
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    trackExperimentStarted({ experiment: 'paywall_timing', variant: paywallTimingVariant });
  }, [paywallTimingVariant]);

  const showPaywall =
    !dismissed && paywallTimingVariant === 'at_turn_5' && turn === 5 && !hasEntitlement('full_access');
  return [showPaywall, () => setDismissed(true)] as const;
}

export default function GameScreen() {
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);
  const currentCard = useGameStore((s) => s.currentCard);
  const pendingChoiceIndex = useGameStore((s) => s.pendingChoiceIndex);
  const isAnimating = useGameStore((s) => s.isAnimating);
  const showTransition = useGameStore((s) => s.showTransition);
  const transitionData = useGameStore((s) => s.transitionData);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const confirmChoice = useGameStore((s) => s.confirmChoice);
  const dismissTransition = useGameStore((s) => s.dismissTransition);
  const presidentId = useGameStore((s) => s.presidentId);
  const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
  const timeoutSelection = useGameStore((s) => s.timeoutSelection);
  const [showDiary, setShowDiary] = useState(false);

  const crisisTimeLeft = useCrisisCountdown({
    cardId: currentCard?.id,
    enabled: isCrisisExpress,
    paused: isAnimating,
    onTimeout: timeoutSelection,
  });
  const cardShaking = useCardShake(currentCard);
  const idlePresidentMood = useIdlePresidentMood();
  const { showDolarFloat, showCrowd, showConfetti, milestoneToast } = useEasterEggs(gameState);
  const [showMidGamePaywall, closeMidGamePaywall] = useMidGamePaywall(gameState?.turn);
  useChoiceHotkeys({
    card: currentCard,
    enabled: !isAnimating && !showTransition,
    pendingChoiceIndex,
    selectChoice,
    confirmChoice,
  });

  useEffect(() => {
    if (!gameState) navigate('/');
  }, [gameState, navigate]);

  if (!gameState || !currentCard) return null;

  const hasCrisis = gameState.activeCrises.length > 0;

  return (
    <div
      className="relative min-h-screen transition-colors duration-700"
      style={{ background: getMoodBackground(gameState) }}
    >
      <BuenosAiresBackground />
      <OfflineBanner />
      <MilestoneToast message={milestoneToast} />
      <DecisionDiary isOpen={showDiary} onClose={() => setShowDiary(false)} />

      <div className={`p-4 ${hasCrisis || cardShaking ? 'animate-screen-shake' : ''}`}>
        {hasCrisis && <div className="crisis-vignette" />}

        <TutorialOverlay />

        <AnimatePresence>
          {showTransition && transitionData && (
            <TurnTransitionScreen data={transitionData} onDismiss={dismissTransition} />
          )}
        </AnimatePresence>

        <GameHeader
          gameState={gameState}
          presidentId={presidentId}
          presidentMood={idlePresidentMood ?? getPresidentMood(gameState)}
          isCrisisExpress={isCrisisExpress}
          crisisTimeLeft={crisisTimeLeft}
          onOpenDiary={() => setShowDiary(true)}
        />

        <div className="mb-4">
          <TensionMeter state={gameState} />
        </div>

        {/* Main layout: mobile = card on top, indicators below; desktop = sidebar left */}
        <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[320px_1fr]">
          <aside>
            <VariablesPanel state={gameState} />
          </aside>
          <main>
            <CardArea gameState={gameState} />
          </main>
        </div>

        {hasCrisis && (
          <div className="mt-6">
            <CrisisAlert crises={gameState.activeCrises} />
          </div>
        )}

        <ActiveShocks shocks={gameState.activeShocks} />
      </div>

      <AnibalTicker isCrisis={hasCrisis} />
      <EasterEggOverlays showDolarFloat={showDolarFloat} showCrowd={showCrowd} showConfetti={showConfetti} />
      {showMidGamePaywall && (
        <PaywallModal
          entitlement="full_access"
          triggerPoint="mid_game_turn_5"
          onClose={closeMidGamePaywall}
        />
      )}
    </div>
  );
}
