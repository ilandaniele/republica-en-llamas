import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { GAME_OVER } from '@republica/game-engine';
import type { GameState } from '@republica/game-engine';
import type { VarSnapshot } from '../../../stores/gameStore.js';
import { InflationBreakdownPanel } from '../InflationBreakdownPanel.js';
import { Meter } from './Meter.js';
import type { FlashDir } from './Meter.js';
import type { FlashMap } from './useFlashMap.js';

interface EconomicSectionProps {
  economic: GameState['economic'];
  breakdown: GameState['lastInflationBreakdown'];
  prevSnapshot: VarSnapshot | null;
  flashMap: FlashMap;
}

function invertFlash(dir: FlashDir | undefined): FlashDir {
  if (dir === 'up') return 'down';
  return dir === 'down' ? 'up' : null;
}

function InflationMeter({
  inflation,
  prevInflation,
  hasBreakdown,
  flashDir,
}: {
  inflation: number;
  prevInflation: number | undefined;
  hasBreakdown: boolean;
  flashDir: FlashDir | undefined;
}) {
  const magnifier = hasBreakdown ? ' 🔍' : '';
  if (inflation < 0) {
    return (
      <Meter
        label={`Deflación${magnifier}`}
        value={Math.abs(inflation)}
        prevValue={prevInflation === undefined ? undefined : Math.abs(prevInflation)}
        max={20}
        color="bg-crimson-500"
        icon="📉"
        inverse
        flashDir={invertFlash(flashDir)}
      />
    );
  }
  return (
    <Meter
      label={`Inflación${magnifier}`}
      value={inflation}
      prevValue={prevInflation}
      max={GAME_OVER.MAX_INFLATION}
      color="bg-orange-500"
      icon="💸"
      inverse
      flashDir={flashDir}
    />
  );
}

export function EconomicSection({ economic, breakdown, prevSnapshot, flashMap }: EconomicSectionProps) {
  const [showInflationBreakdown, setShowInflationBreakdown] = useState(false);

  return (
    <div className="space-y-3">
      <p className="uppercase text-smoke-300">Economía</p>
      <button
        className="w-full text-left"
        onClick={() => setShowInflationBreakdown((v) => !v)}
        title="Ver desglose de inflación"
      >
        <InflationMeter
          inflation={economic.inflation}
          prevInflation={prevSnapshot?.inflation}
          hasBreakdown={Boolean(breakdown)}
          flashDir={flashMap['inflation']}
        />
      </button>
      <AnimatePresence>
        {showInflationBreakdown && breakdown && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <InflationBreakdownPanel breakdown={breakdown} />
          </m.div>
        )}
      </AnimatePresence>
      <Meter
        label="Déficit público"
        value={economic.publicDeficit}
        prevValue={prevSnapshot?.publicDeficit}
        color="bg-red-500"
        icon="📊"
        inverse
        flashDir={flashMap['publicDeficit']}
      />
      <Meter
        label="Confianza de los mercados"
        value={economic.marketConfidence}
        prevValue={prevSnapshot?.marketConfidence}
        color="bg-teal-500"
        icon="📈"
        flashDir={flashMap['marketConfidence']}
      />
      <Meter
        label="Fortaleza de la moneda"
        value={economic.currencyStrength}
        prevValue={prevSnapshot?.currencyStrength}
        color="bg-yellow-500"
        icon="💰"
        flashDir={flashMap['currencyStrength']}
      />
      <Meter
        label="Reservas internacionales"
        value={economic.foreignReserves}
        prevValue={prevSnapshot?.foreignReserves}
        color="bg-cyan-500"
        icon="🏦"
        flashDir={flashMap['foreignReserves']}
      />
      <div className="flex justify-between gap-2">
        <span className="text-smoke-300">Crecimiento del producto interno bruto</span>
        <span
          className={`shrink-0 tabular-nums ${economic.gdpGrowth >= 0 ? 'text-green-400' : 'text-crimson-400'}`}
        >
          {economic.gdpGrowth >= 0 ? '+' : ''}
          {economic.gdpGrowth.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
