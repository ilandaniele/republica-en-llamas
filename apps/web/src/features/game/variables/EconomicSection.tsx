import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
        label={`DEFL${magnifier}`}
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
      label={`INF${magnifier}`}
      value={inflation}
      prevValue={prevInflation}
      max={200}
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
      <p
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
        className="uppercase text-smoke-600"
      >
        ECONOMICO
      </p>
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
        label="DEF"
        value={economic.publicDeficit}
        prevValue={prevSnapshot?.publicDeficit}
        color="bg-red-500"
        icon="📊"
        inverse
        flashDir={flashMap['publicDeficit']}
      />
      <Meter
        label="MKT"
        value={economic.marketConfidence}
        prevValue={prevSnapshot?.marketConfidence}
        color="bg-teal-500"
        icon="📈"
        flashDir={flashMap['marketConfidence']}
      />
      <Meter
        label="$$$"
        value={economic.currencyStrength}
        prevValue={prevSnapshot?.currencyStrength}
        color="bg-yellow-500"
        icon="💰"
        flashDir={flashMap['currencyStrength']}
      />
      <Meter
        label="RES"
        value={economic.foreignReserves}
        prevValue={prevSnapshot?.foreignReserves}
        color="bg-cyan-500"
        icon="🏦"
        flashDir={flashMap['foreignReserves']}
      />
      <div
        className="flex justify-between"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        <span className="text-smoke-400">PIB</span>
        <span className={economic.gdpGrowth >= 0 ? 'text-green-400' : 'text-crimson-400'}>
          {economic.gdpGrowth >= 0 ? '+' : ''}
          {economic.gdpGrowth.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
