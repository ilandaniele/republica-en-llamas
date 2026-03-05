import React from 'react';
import { motion } from 'framer-motion';
import type { GameState } from '@republica/game-engine';

function computeTension(state: GameState): number {
  const { political, economic, activeCrises } = state;
  const tension =
    (100 - political.popularity) * 0.2 +
    (100 - political.socialStability) * 0.25 +
    economic.inflation * 0.3 +
    economic.publicDeficit * 0.15 +
    activeCrises.length * 15;
  return Math.min(100, Math.max(0, tension));
}

export function TensionMeter({ state }: { state: GameState }) {
  const tension = computeTension(state);
  const color =
    tension > 80 ? 'bg-crimson-500' : tension > 60 ? 'bg-orange-500' : tension > 40 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-smoke-400 uppercase tracking-wider whitespace-nowrap">
        Tensión
      </span>
      <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          animate={{ width: `${tension}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-xs text-smoke-300 w-8 text-right">
        {Math.round(tension)}
      </span>
    </div>
  );
}
