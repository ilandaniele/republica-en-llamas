import React, { useState } from 'react';
import { m } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import type { TransitionData } from '../../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../../stores/gameStore.js';
import { CasaRosadaScene } from '../../components/casa-rosada/CasaRosadaScene.js';

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

export function TurnTransitionScreen({ data, onDismiss }: Props) {
  const [clicked, setClicked] = useState(false);
  const gameState = useGameStore((s) => s.gameState);
  const breakdown = gameState?.lastInflationBreakdown;

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

        {/* Turn counter */}
        <div className="mb-4 text-center">
          <span
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
            className="text-smoke-500 uppercase"
          >
            TURNO {data.fromTurn} ▶ {data.toTurn}
          </span>
        </div>

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
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
            className="text-smoke-500 mb-2 uppercase"
          >
            LA GACETA DE LA REPUBLICA
          </div>
          <div
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', lineHeight: '1.8' }}
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
          className="mb-6 text-center italic text-smoke-400"
          style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
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
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
          >
            CONTINUAR ▶
          </button>
          {!clicked && (
            <p className="text-smoke-500 mt-2 animate-pulse text-center font-mono text-xs">
              tocá para continuar →
            </p>
          )}
        </m.div>
      </div>
    </m.div>
  );
}
