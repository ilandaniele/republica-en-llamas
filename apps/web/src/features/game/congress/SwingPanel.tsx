import { m } from 'framer-motion';
import type { SwingChoice } from '@republica/game-engine';
import type { Seat, SwingSen, VoteStatus } from './congressData.js';
import { Hemicycle } from './Hemicycle.js';

interface SwingPanelProps {
  sen: SwingSen;
  swingIdx: number;
  swingCount: number;
  finalYes: number;
  total: number;
  required: number;
  seats: Seat[];
  seatVotes: VoteStatus[];
  onChoice: (choice: SwingChoice) => void;
}

export function SwingPanel({
  sen,
  swingIdx,
  swingCount,
  finalYes,
  total,
  required,
  seats,
  seatVotes,
  onChoice,
}: SwingPanelProps) {
  return (
    <m.div
      key={`swing-${swingIdx}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <Hemicycle seats={seats} seatVotes={seatVotes} required={required} live={false} />

      {/* Current count */}
      <div className="text-center font-mono text-sm">
        <span className="text-emerald-400">{finalYes} SÍ</span>
        <span className="mx-2 text-smoke-600">—</span>
        <span className="text-crimson-400">{total - finalYes} NO</span>
        <span className="text-smoke-500 ml-3 text-xs">({required} para mayoría)</span>
      </div>

      {/* Senator card */}
      <div className="space-y-3 rounded-xl border-2 border-gold-600 bg-navy-800 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy-500 bg-navy-700 text-xl">
            🏛
          </div>
          <div>
            <p className="font-serif font-bold text-smoke-100">{sen.name}</p>
            <p className="text-smoke-500 font-mono text-xs">
              {sen.bloc} · {sen.province}
            </p>
          </div>
          <div className="bg-gold-900/40 border-gold-700 ml-auto rounded border px-2 py-1">
            <p className="font-mono text-xs text-gold-400">⚡ VOTO SORPRESA</p>
            <p className="text-smoke-500 font-mono text-xs">
              {swingIdx + 1}/{swingCount}
            </p>
          </div>
        </div>

        <p className="text-smoke-300 border-gold-700 border-l-2 pl-3 text-sm italic">{sen.demand}</p>

        <div className="space-y-2">
          <button
            onClick={() => onChoice('accept')}
            className="flex w-full items-center justify-between rounded-lg border border-emerald-600 bg-emerald-800/60 px-4 py-2 text-left font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-700/60"
          >
            <span>✅ Acepto la demanda</span>
            <span className="text-xs text-emerald-400">{sen.costLabel} · +1 voto</span>
          </button>
          <button
            onClick={() => onChoice('refuse')}
            className="bg-crimson-900/40 text-crimson-200 flex w-full items-center justify-between rounded-lg border border-crimson-700 px-4 py-2 text-left font-mono text-sm transition-colors hover:bg-crimson-800/40"
          >
            <span>❌ Me niego</span>
            <span className="text-xs text-crimson-400">−1 voto</span>
          </button>
          <button
            onClick={() => onChoice('decide')}
            className="text-smoke-300 flex w-full items-center justify-between rounded-lg border border-navy-500 bg-navy-700 px-4 py-2 text-left font-mono text-sm transition-colors hover:bg-navy-600"
          >
            <span>🎲 Dejarlo decidir solo</span>
            <span className="text-smoke-500 text-xs">50/50</span>
          </button>
        </div>
      </div>
    </m.div>
  );
}
