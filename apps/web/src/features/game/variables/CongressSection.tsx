import type { GameState } from '@republica/game-engine';

export function CongressSection({ congress }: { congress: GameState['congress'] }) {
  return (
    <div className="space-y-2">
      <p
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
        className="uppercase text-smoke-600"
      >
        CONGRESO
      </p>
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
      <div
        className="flex justify-between"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        <span style={{ color: 'var(--celeste)' }}>GOB:{congress.governmentSeats}</span>
        <span className="text-smoke-400">IND:{congress.independentSeats}</span>
        <span className="text-crimson-400">OPO:{congress.oppositionSeats}</span>
      </div>
      <div
        className="flex justify-between"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        <span className="text-smoke-400">LEYES</span>
        <span style={{ color: 'var(--gold)' }}>{congress.lawsPassedThisRun}</span>
      </div>
    </div>
  );
}
