import type { GameState } from '@republica/game-engine';

export function CongressSection({ congress }: { congress: GameState['congress'] }) {
  return (
    <div className="space-y-2">
      <p className="uppercase text-smoke-300">Congreso</p>
      <div className="flex h-3 gap-0.5 overflow-hidden" style={{ border: '2px solid #444' }}>
        <div
          className="transition-all duration-700"
          style={{ width: `${(congress.governmentSeats / 538) * 100}%`, background: 'var(--celeste)' }}
          title={`Gobierno: ${congress.governmentSeats}`}
        />
        <div
          className="bg-smoke-600 transition-all duration-700"
          style={{ width: `${(congress.independentSeats / 538) * 100}%` }}
          title={`Independientes: ${congress.independentSeats}`}
        />
        <div
          className="bg-crimson-500 transition-all duration-700"
          style={{ width: `${(congress.oppositionSeats / 538) * 100}%` }}
          title={`Oposición: ${congress.oppositionSeats}`}
        />
      </div>
      <div className="congress-seats grid gap-1">
        <span style={{ color: 'var(--celeste)' }}>Gobierno: {congress.governmentSeats}</span>
        <span className="text-smoke-300">Independientes: {congress.independentSeats}</span>
        <span className="text-crimson-300">Oposición: {congress.oppositionSeats}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-smoke-300">Leyes aprobadas</span>
        <span style={{ color: 'var(--gold)' }}>{congress.lawsPassedThisRun}</span>
      </div>
    </div>
  );
}
