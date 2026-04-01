import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionData } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';

interface Props {
  data: TransitionData;
  onDismiss: () => void;
}

export function TurnTransitionScreen({ data, onDismiss }: Props) {
  const [clicked, setClicked] = useState(false);
  const gameState = useGameStore((s) => s.gameState);
  const breakdown = gameState?.lastInflationBreakdown;

  const handleContinue = () => {
    setClicked(true);
    onDismiss();
  };

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-navy-900/95"
    >
      <div className="max-w-xl w-full mx-4">
        {/* Turn counter */}
        <div className="text-center mb-4">
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }} className="text-smoke-500 uppercase">TURNO {data.fromTurn} ▶ {data.toTurn}</span>
        </div>

        {/* Stat deltas */}
        {data.statDeltas.length > 0 && (
          <div className="pixel-border bg-navy-800 p-4 mb-4 grid grid-cols-2 gap-2">
            {data.statDeltas.map((d) => (
              <div key={d.label} className="flex items-center justify-between bg-navy-900/60 rounded px-3 py-2">
                <span className="font-mono text-xs text-smoke-400">{d.emoji} {d.label}</span>
                <span className={`font-mono font-bold text-sm ${d.delta > 0 ? 'text-green-400' : 'text-crimson-400'}`}>
                  {d.delta > 0 ? '+' : ''}{Math.round(d.delta)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Newspaper headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#f4f4f0] text-smoke-900 p-4 mb-4 pixel-border" style={{ borderColor: '#888' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-500 mb-2 uppercase">LA GACETA DE LA REPUBLICA</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', lineHeight: '1.8' }} className="font-black text-smoke-900 leading-tight">{data.headline}</div>
        </motion.div>

        {/* Inflation breakdown (shown when delta > 0.5) */}
        {breakdown && Math.abs(breakdown.delta) > 0.5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-4"
          >
            <InflationBreakdownPanel breakdown={breakdown} />
          </motion.div>
        )}

        {/* Hook text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-smoke-400 italic mb-6"
          style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
        >
          {data.hookText}
        </motion.p>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full"
        >
          <button
            onClick={handleContinue}
            className="w-full min-h-[56px] pixel-border-gold bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-navy-900 font-bold py-4 px-8 transition-colors shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
          >
            CONTINUAR ▶
          </button>
          {!clicked && (
            <p className="text-smoke-500 font-mono text-xs mt-2 text-center animate-pulse">
              tocá para continuar →
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
