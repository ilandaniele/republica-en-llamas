import type { GameState } from '@republica/game-engine';

interface Stat {
  label: string;
  value: number;
  color: string;
}

function statsOf(gameState: GameState): Stat[] {
  return [
    { label: 'Aprobación', value: gameState.political.popularity, color: '#F6B40E' },
    { label: 'Paz social', value: gameState.political.socialStability, color: '#7FD46B' },
    { label: 'Confianza de los mercados', value: gameState.economic.marketConfidence, color: '#B8D9F0' },
    { label: 'Reservas internacionales', value: gameState.economic.foreignReserves, color: '#F28AB0' },
  ];
}

function StatBar({ label, value, color }: Stat) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm leading-snug text-white">
        <span>{label}</span>
        <span className={`shrink-0 tabular-nums ${clamped < 20 ? 'text-[#FFB3A7]' : ''}`}>{clamped}</span>
      </div>
      <div className="h-[10px] border-2 border-[#111] bg-[#111]">
        <div
          className="h-full origin-left transition-transform duration-500"
          style={{ transform: `scaleX(${clamped / 100})`, background: clamped < 20 ? '#FF5A3C' : color }}
        />
      </div>
    </div>
  );
}

export function StatStrip({ gameState }: { gameState: GameState }) {
  return (
    <div
      className="game-stat-strip grid grid-cols-2 gap-3 sm:grid-cols-4"
      role="group"
      aria-label="Indicadores principales"
    >
      {statsOf(gameState).map((stat) => (
        <StatBar key={stat.label} {...stat} />
      ))}
    </div>
  );
}
