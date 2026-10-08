import React from 'react';
import { m } from 'framer-motion';
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
    tension > 80
      ? 'bg-crimson-500'
      : tension > 60
        ? 'bg-orange-500'
        : tension > 40
          ? 'bg-yellow-500'
          : 'bg-green-500';

  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap font-mono text-xs uppercase tracking-wider text-smoke-400">
        Tensión
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-700">
        <m.div
          className={`h-full rounded-full ${color}`}
          animate={{ width: `${tension}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-smoke-300 w-8 text-right font-mono text-xs">{Math.round(tension)}</span>
    </div>
  );
}
