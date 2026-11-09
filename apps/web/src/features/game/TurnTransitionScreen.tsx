import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import type { TransitionData } from '../../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../../stores/gameStore.js';
import { CasaRosadaScene } from '../../components/casa-rosada/CasaRosadaScene.js';
import { DebateSummary } from './debate/DebateSummary.js';

function CasaRosadaBanner({ gameState }: { gameState: GameState }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="pixel-border mb-4 w-full overflow-hidden rounded"
    >
      <CasaRosadaScene state={gameState} />
    </m.div>
  );
}

function StatDeltas({ deltas }: { deltas: TransitionData['statDeltas'] }) {
  return (
    <div className="pixel-border mb-4 grid grid-cols-2 gap-2 bg-navy-800 p-4">
      {deltas.map((d) => {
        const isGood = d.inverse ? d.delta < 0 : d.delta > 0;
        const impact = Math.round(Math.abs(d.delta));
        return (
          <div key={d.label} className="flex items-center justify-between bg-navy-900/60 px-3 py-2">
            <span className="font-mono text-xs text-smoke-400">
              {d.emoji} {d.label}
            </span>
            <span className={`font-mono text-sm font-bold ${isGood ? 'text-green-400' : 'text-crimson-400'}`}>
              {isGood ? `▲ +${impact}` : `▼ -${impact}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  data: TransitionData;
  onDismiss: () => void;
}

function isPresidentialInauguration(state: GameState | null): boolean {
  return Boolean(
    state?.career && state.career.office === 'president' && state.turn === 1 && state.history.length === 0,
  );
}

export function TurnTransitionScreen({ data, onDismiss }: Props) {
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false);
  const gameState = useGameStore((s) => s.gameState);
  const breakdown = gameState?.lastInflationBreakdown;
  const startsPresidency = isPresidentialInauguration(gameState);

  const handleContinue = () => {
    if (clicked) return;
    setClicked(true);
    onDismiss();
  };

  // Keyboard: Enter or Space to continue
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clicked]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <m.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/95"
    >
      <div className="mx-auto w-full max-w-xl px-4 py-4">
        {gameState && <CasaRosadaBanner gameState={gameState} />}
        {gameState?.debate?.rounds.at(-1) && gameState.history.at(-1)?.cardId.startsWith('pol_debate_') && (
          <DebateSummary debate={gameState.debate} />
        )}

        {/* Turn counter */}
        <div className="mb-4 text-center">
          <span
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px' }}
            className="uppercase text-smoke-500"
          >
            {startsPresidency ? t('career.presidentStart') : `TURNO ${data.fromTurn} ▶ ${data.toTurn}`}
          </span>
        </div>

        {startsPresidency && <p className="mb-4 text-lg text-celeste-light">{t('career.presidentIntro')}</p>}

        {/* Stat deltas */}
        {data.statDeltas.length > 0 && <StatDeltas deltas={data.statDeltas} />}

        {/* Newspaper headline */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pixel-border mb-4 bg-[#f4f4f0] p-4 text-smoke-900"
          style={{ borderColor: '#888' }}
        >
          <div
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px' }}
            className="mb-2 uppercase text-smoke-500"
          >
            La Gaceta de la República
          </div>
          <div
            style={{ fontFamily: 'var(--font-readable)', fontSize: '22px', lineHeight: '1.35' }}
            className="font-black leading-tight text-smoke-900"
          >
            {data.headline}
          </div>
        </m.div>

        {/* Inflation breakdown (shown when delta > 0.5) */}
        {breakdown && Math.abs(breakdown.delta) > 0.5 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-4"
          >
            <InflationBreakdownPanel breakdown={breakdown} />
          </m.div>
        )}

        {/* Hook text */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-6 text-center leading-relaxed text-smoke-200"
          style={{ fontFamily: 'var(--font-readable)', fontSize: '16px' }}
        >
          {data.hookText}
        </m.p>

        {/* Continue button */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full"
        >
          <button
            onClick={handleContinue}
            className="pixel-border-gold min-h-[56px] w-full bg-gold-500 px-8 py-4 font-bold text-navy-900 shadow-lg transition-colors hover:bg-gold-400 active:bg-gold-600"
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px' }}
          >
            CONTINUAR ▶
          </button>
          {!clicked && (
            <p className="mt-2 animate-pulse text-center font-mono text-xs text-smoke-500">
              tocá para continuar →
            </p>
          )}
        </m.div>
      </div>
    </m.div>
  );
}
