import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ArgentinaMapSVG } from '../components/illustrations/ArgentinaMapSVG.js';
import { getAnibalLine } from '@republica/game-engine';
import { UserMenu } from '../components/UserMenu.js';
import { trackCongressSession, trackTurnCompleted } from '../lib/analytics.js';

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
    if (gameState.isGameOver) { navigate('/gameover'); return; }
  }, [gameState, navigate]);

  React.useEffect(() => {
    if (currentCard?.category === 'crisis') {
      setCardShaking(true);
      const t = setTimeout(() => setCardShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [currentCard?.id]);

  if (!gameState || !currentCard) return null;

  const hasCrisis = gameState.activeCrises.length > 0;
  const anibalLine = getAnibalLine(gameState);
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
    <div className={`min-h-screen relative transition-colors duration-500 ${hasCrisis ? 'bg-crimson-900/15' : inRedZone ? 'bg-crimson-900/5' : ''} ${anyBelowTen ? 'animate-pulse' : ''}`}>
      {/* Argentina map background */}
      <ArgentinaMapSVG />

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
            <div className="w-12 h-12 overflow-hidden rounded-full border border-navy-600">
              <PixelPortrait
                id={presidentId as import('../components/illustrations/PixelPortrait.js').PortraitId}
                mood={presidentMood}
                px={48}
              />
            </div>
            <div>
              <h1 className="font-serif text-xl text-gold-400 font-bold leading-tight">
                República en Llamas
              </h1>
              <span className="font-mono text-xs text-smoke-500 bg-navy-800 px-2 py-0.5 rounded">
                {DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
            {/* Diary button */}
            <button
              onClick={() => setShowDiary(true)}
              className="bg-navy-800 hover:bg-navy-700 border border-navy-600 text-smoke-400 font-mono text-xs px-3 py-2 rounded flex items-center gap-1"
              title="Diario de Gestión"
            >
              📋 Diario
            </button>
            {isCrisisExpress && (
              <div className={`flex flex-col items-center px-3 py-1 rounded-lg border font-mono ${
                crisisTimeLeft <= 10
                  ? 'bg-crimson-900/70 border-crimson-500 text-crimson-300 animate-pulse'
                  : 'bg-navy-800 border-navy-600 text-smoke-300'
              }`}>
                <p className="text-xs">⚡ EXPRESS</p>
                <p className="font-bold text-lg leading-none">{crisisTimeLeft}s</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-smoke-500 font-mono">Turno</p>
              <p className="font-mono font-bold text-gold-400">{gameState.turn}/{isCrisisExpress ? 15 : 50}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-smoke-500 font-mono">Puntaje</p>
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

        {/* Aníbal quote */}
        {anibalLine && (
          <div className="mb-3 bg-navy-800/60 border border-navy-600 rounded px-4 py-2 flex items-start gap-2">
            <span className="text-gold-500 font-mono text-xs shrink-0 mt-0.5">📻</span>
            <p className="text-smoke-400 font-mono text-xs italic">
              "{anibalLine}" — <span className="text-smoke-500">El Gordo Aníbal, Radio AM 1010</span>
            </p>
          </div>
        )}

        {/* Tension meter */}
        <div className="mb-4">
          <TensionMeter state={gameState} />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
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
                <p className="font-serif text-gold-400 text-xl animate-pulse">
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
                className="bg-orange-900/50 border border-orange-700 text-orange-300 font-mono text-xs px-3 py-1 rounded-full"
              >
                ⚡ {shock.name} ({shock.turnsRemaining} turnos)
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
