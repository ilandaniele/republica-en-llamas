import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore.js';
import { VariablesPanel } from '../components/VariablesPanel.js';
import { EventCardComponent } from '../components/EventCardComponent.js';
import { CrisisAlert } from '../components/CrisisAlert.js';
import { TensionMeter } from '../components/TensionMeter.js';
import { TutorialOverlay } from '../components/TutorialOverlay.js';
import { OfflineBanner } from '../components/OfflineBanner.js';
import { TurnTransitionScreen } from '../components/TurnTransitionScreen.js';
import { DecisionDiary } from '../components/DecisionDiary.js';
import { PixelPortrait } from '../components/illustrations/PixelPortrait.js';
import { CongressSession } from '../components/CongressSession.js';
import type { PortraitMood } from '../components/illustrations/PixelPortrait.js';
import { UserMenu } from '../components/UserMenu.js';
import { trackCongressSession, trackTurnCompleted } from '../lib/analytics.js';
import { BuenosAiresBackground } from '../components/illustrations/BuenosAiresBackground.js';
import { AnibalTicker } from '../components/AnibalTicker.js';
import { PixelDolar } from '../components/illustrations/PixelDolar.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { useEntitlements } from '../hooks/useEntitlements.js';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
  crisis: 'Crisis',
};

function getRedZoneVars(state: import('@republica/game-engine').GameState): string[] {
  const vars: string[] = [];
  if (state.political.popularity < 25) vars.push('popularity');
  if (state.political.socialStability < 25) vars.push('socialStability');
  if (state.economic.marketConfidence < 25) vars.push('marketConfidence');
  if (state.economic.currencyStrength < 25) vars.push('currencyStrength');
  if (state.economic.foreignReserves < 25) vars.push('foreignReserves');
  return vars;
}

export default function GameScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);
  const currentCard = useGameStore((s) => s.currentCard);
  const pendingChoiceIndex = useGameStore((s) => s.pendingChoiceIndex);
  const isAnimating = useGameStore((s) => s.isAnimating);
  const showTransition = useGameStore((s) => s.showTransition);
  const transitionData = useGameStore((s) => s.transitionData);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const confirmChoice = useGameStore((s) => s.confirmChoice);
  const resolveCongressSession = useGameStore((s) => s.resolveCongressSession);
  const dismissTransition = useGameStore((s) => s.dismissTransition);
  const presidentId = useGameStore((s) => s.presidentId);
  const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
  const timeoutSelection = useGameStore((s) => s.timeoutSelection);
  const [showDiary, setShowDiary] = useState(false);
  const [crisisTimeLeft, setCrisisTimeLeft] = useState(45);
  const [cardShaking, setCardShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Easter egg states
  const [idlePresidentMood, setIdlePresidentMood] = useState<PortraitMood | null>(null);
  const [showMidGamePaywall, setShowMidGamePaywall] = useState(false);
  const { hasEntitlement } = useEntitlements();
  const paywallTimingVariant = (posthog.getFeatureFlag('paywall_timing') ?? 'after_game_over') as string;
  const [showDolarFloat, setShowDolarFloat] = useState(false);
  const [showCrowd, setShowCrowd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevInflationRef = useRef<number | null>(null);
  const prevLawsPassedRef = useRef<number>(0);

  // Reset countdown when a new card appears
  useEffect(() => {
    if (!isCrisisExpress) return;
    setCrisisTimeLeft(45);
  }, [currentCard?.id, isCrisisExpress]);

  // Countdown tick
  useEffect(() => {
    if (!isCrisisExpress || !currentCard || isAnimating) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => {
      setCrisisTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          timeoutSelection();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [currentCard?.id, isCrisisExpress, isAnimating, timeoutSelection]);

  React.useEffect(() => {
    if (!gameState) { navigate('/'); return; }
  }, [gameState, navigate]);

  useEffect(() => {
    posthog.capture('$experiment_started', { experiment: 'paywall_timing', variant: paywallTimingVariant });
  }, [paywallTimingVariant]);

  useEffect(() => {
    if (paywallTimingVariant === 'at_turn_5' && gameState?.turn === 5 && !hasEntitlement('full_access')) {
      setShowMidGamePaywall(true);
    }
  }, [gameState?.turn, paywallTimingVariant, hasEntitlement]);

  React.useEffect(() => {
    if (currentCard?.category === 'crisis') {
      setCardShaking(true);
      const t = setTimeout(() => setCardShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [currentCard?.id]);

  // Easter egg: idle 10s → president panics
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIdlePresidentMood(null);
      idleTimerRef.current = setTimeout(() => {
        setIdlePresidentMood('panic');
        setTimeout(() => setIdlePresidentMood(null), 2000);
      }, 10000);
    };
    resetIdle();
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Easter egg: inflation ≥50 → floating dollar
  useEffect(() => {
    if (!gameState) return;
    const curr = gameState.economic.inflation;
    if (prevInflationRef.current !== null && prevInflationRef.current < 50 && curr >= 50) {
      setShowDolarFloat(true);
      setTimeout(() => setShowDolarFloat(false), 2000);
    }
    prevInflationRef.current = curr;
  }, [gameState?.economic.inflation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Easter egg: popularity = 0 → crowd torches
  useEffect(() => {
    if (!gameState) return;
    if (gameState.political.popularity <= 0) {
      setShowCrowd(true);
      setTimeout(() => setShowCrowd(false), 2000);
    }
  }, [gameState?.political.popularity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Easter egg: law passed → confetti
  useEffect(() => {
    if (!gameState) return;
    const curr = gameState.congress.lawsPassedThisRun ?? 0;
    if (curr > prevLawsPassedRef.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
    prevLawsPassedRef.current = curr;
  }, [gameState?.congress.lawsPassedThisRun]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!gameState || !currentCard) return null;

  const hasCrisis = gameState.activeCrises.length > 0;
  const redZoneVars = getRedZoneVars(gameState);
  const inRedZone = redZoneVars.length > 0;
  const anyBelowTen = [
    gameState.political.popularity,
    gameState.political.socialStability,
    gameState.economic.marketConfidence,
    gameState.economic.currencyStrength,
    gameState.economic.foreignReserves,
  ].some((v) => v < 10);
  const presidentMood: PortraitMood = hasCrisis || anyBelowTen
    ? 'panic'
    : gameState.political.popularity > 65
      ? 'victory'
      : 'neutral';

  return (
    <div className={`min-h-screen relative transition-colors duration-500 bg-[var(--night-blue)] ${anyBelowTen ? 'animate-pulse' : ''}`}>
      {/* Buenos Aires pixel background */}
      <BuenosAiresBackground />

      <OfflineBanner />

      {/* Decision Diary (slide-in from left) */}
      <DecisionDiary isOpen={showDiary} onClose={() => setShowDiary(false)} />

      <div className={`p-4 ${hasCrisis || cardShaking ? 'animate-screen-shake' : ''}`}>
        {hasCrisis && <div className="crisis-vignette" />}

        <TutorialOverlay />

        {/* Turn transition overlay */}
        <AnimatePresence>
          {showTransition && transitionData && (
            <TurnTransitionScreen
              data={transitionData}
              onDismiss={dismissTransition}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center justify-between mb-4 pb-4 border-b ${hasCrisis ? 'border-crimson-800' : 'border-navy-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden pixel-border">
              <PixelPortrait
                id={presidentId as import('../components/illustrations/PixelPortrait.js').PortraitId}
                mood={idlePresidentMood ?? presidentMood}
                px={48}
              />
            </div>
            <div>
              <h1 className="font-serif text-base text-gold-400 font-bold leading-tight uppercase">
                República en Llamas
              </h1>
              <span className="font-mono text-sm text-smoke-400 bg-navy-800 px-2 py-0.5">
                {DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
            {/* Diary button */}
            <button
              onClick={() => setShowDiary(true)}
              className="bg-navy-800 hover:bg-navy-700 border border-navy-600 text-smoke-400 font-mono text-sm px-3 py-2 rounded flex items-center gap-1"
              title="Diario de Gestión"
            >
              📋 Diario
            </button>
            {isCrisisExpress && (
              <div className={`pixel-border flex flex-col items-center px-3 py-1 font-mono ${
                crisisTimeLeft <= 10
                  ? 'bg-crimson-900/70 text-crimson-300 animate-pulse'
                  : 'bg-navy-800 text-smoke-300'
              }`}>
                <p className="text-sm">⚡ EXPRESS</p>
                <p className="font-bold text-lg leading-none">{crisisTimeLeft}s</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm text-smoke-500 font-mono">Turno</p>
              <p className="font-mono font-bold text-gold-400">{gameState.turn}/{isCrisisExpress ? 15 : 50}</p>
            </div>
            {(gameState.currentMonth != null && gameState.currentYear != null) && (
              <div className="text-right">
                <p className="text-sm text-smoke-500 font-mono">{t(`month.${gameState.currentMonth}`)}</p>
                <p className="font-mono font-bold text-celeste">{gameState.currentYear}</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm text-smoke-500 font-mono">Puntaje</p>
              <p className="font-mono font-bold text-gold-400">{gameState.score.toLocaleString()}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-smoke-600 hover:text-smoke-400 font-mono text-xs"
            >
              ← Salir
            </button>
          </div>
        </motion.header>


        {/* Tension meter */}
        <div className="mb-4">
          <TensionMeter state={gameState} />
        </div>

        {/* Main layout: mobile = card on top, indicators below; desktop = sidebar left */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Left: Variables panel */}
          <aside>
            <VariablesPanel state={gameState} />
          </aside>

          {/* Right: Event card + choices */}
          <main>
            <AnimatePresence mode="wait">
              {!isAnimating && currentCard?.isLaw ? (
                <CongressSession
                  key={currentCard.id}
                  card={currentCard}
                  gameState={gameState}
                  presidentId={presidentId}
                  onComplete={(choiceIdx, negEffects) => {
                    trackCongressSession({ law: currentCard.id, turn: gameState.turn });
                    resolveCongressSession(choiceIdx, currentCard.id, negEffects);
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
                      trackTurnCompleted({ turn_number: gameState.turn, event_category: currentCard.category, choice_index: pendingChoiceIndex });
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-64"
              >
                <p className="font-mono text-gold-400 text-2xl animate-pulse">
                  Aplicando decisión...
                </p>
              </motion.div>
            )}
          </main>
        </div>

        {/* Bottom: Crisis alerts */}
        {hasCrisis && (
          <div className="mt-6">
            <CrisisAlert crises={gameState.activeCrises} />
          </div>
        )}

        {/* Shock notification */}
        {gameState.activeShocks.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {gameState.activeShocks.map((shock) => (
              <span
                key={shock.id}
                className="pixel-border bg-orange-900/50 text-orange-300 font-mono text-xs px-3 py-1"
              >
                ⚡ {shock.name} ({shock.turnsRemaining} turnos)
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Fixed overlays */}
      <AnibalTicker isCrisis={hasCrisis} />
      {showDolarFloat && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <PixelDolar floating />
        </div>
      )}
      {showCrowd && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-around items-end pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="pixel-crowd-torches w-2 h-8 bg-orange-500" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="pixel-confetti-piece absolute"
              style={{
                left: `${5 + i * 9}%`,
                top: `${15 + (i % 4) * 8}%`,
                background: i % 2 === 0 ? 'var(--celeste)' : 'white',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
      {showMidGamePaywall && (
        <PaywallModal
          entitlement="full_access"
          triggerPoint="mid_game_turn_5"
          onClose={() => setShowMidGamePaywall(false)}
        />
      )}
    </div>
  );
}
