import type { GameState } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';
import { PixelFuego } from '../../components/illustrations/PixelFuego.js';
import { CasaRosadaMini } from './variables/CasaRosadaMini.js';
import { getTemperatura } from './variables/getTemperatura.js';
import { useFlashMap } from './variables/useFlashMap.js';
import { PoliticalSection } from './variables/PoliticalSection.js';
import { EconomicSection } from './variables/EconomicSection.js';
import { CongressSection } from './variables/CongressSection.js';

interface Props {
  state: GameState;
}

function PanelHeader({ positiveStreak }: { positiveStreak: number }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ borderBottom: '2px solid var(--celeste-dark)', paddingBottom: '8px' }}
    >
      <h3
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: 'var(--celeste)' }}
        className="uppercase"
      >
        TERMOMETRO NACIONAL
      </h3>
      {positiveStreak >= 2 && (
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '6px',
            background: 'var(--gold)',
            color: '#0D1B2A',
            padding: '2px 5px',
          }}
        >
          🔥 RACHA ×{positiveStreak}
        </span>
      )}
    </div>
  );
}

function TemperatureBox({ state }: Props) {
  const temp = getTemperatura(state);
  return (
    <div className={`p-3 ${temp.bg}`} style={{ border: '2px solid currentColor' }}>
      <p
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
        className="text-smoke-500 mb-1 uppercase"
      >
        TEMPERATURA
      </p>
      <div
        className={`flex items-center gap-2 font-bold ${temp.color}`}
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
      >
        <span>{temp.emoji}</span>
        <span>{temp.label}</span>
      </div>
    </div>
  );
}

function TurnScore({ turn, score }: { turn: number; score: number }) {
  return (
    <div className="flex justify-between pt-3" style={{ borderTop: '2px solid var(--celeste-dark)' }}>
      <div>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600">
          TURNO
        </p>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }}>
          {turn}/50
        </p>
      </div>
      <div className="text-right">
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600">
          SCORE
        </p>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }}>
          {score.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function VariablesPanel({ state }: Props) {
  const { political, economic, congress } = state;
  const prevSnapshot = useGameStore((s) => s.prevVarSnapshot);
  const flashMap = useFlashMap(state, prevSnapshot);

  const hasAnyCrisis = [
    political.popularity,
    political.socialStability,
    economic.marketConfidence,
    economic.currencyStrength,
    economic.foreignReserves,
  ].some((v) => v < 30);
  const isStable = political.socialStability > 50 && political.popularity > 50;

  return (
    <div className="pixel-border space-y-4 bg-navy-800 p-4">
      <PanelHeader positiveStreak={state.positiveStreak ?? 0} />

      {/* Pixel decoration: fuego or Casa Rosada depending on state */}
      <div className="flex justify-center py-1">
        {hasAnyCrisis ? <PixelFuego size="sm" /> : <CasaRosadaMini tense={!isStable} />}
      </div>

      <PoliticalSection political={political} prevSnapshot={prevSnapshot} flashMap={flashMap} />
      <EconomicSection
        economic={economic}
        breakdown={state.lastInflationBreakdown}
        prevSnapshot={prevSnapshot}
        flashMap={flashMap}
      />
      <CongressSection congress={congress} />
      <TemperatureBox state={state} />
      <TurnScore turn={state.turn} score={state.score} />
    </div>
  );
}
