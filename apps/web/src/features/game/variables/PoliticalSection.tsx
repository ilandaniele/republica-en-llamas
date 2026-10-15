import type { GameState } from '@republica/game-engine';
import type { VarSnapshot } from '../../../stores/gameStore.js';
import { Meter } from './Meter.js';
import type { FlashMap } from './useFlashMap.js';

interface PoliticalSectionProps {
  political: GameState['political'];
  prevSnapshot: VarSnapshot | null;
  flashMap: FlashMap;
}

export function PoliticalSection({ political, prevSnapshot, flashMap }: PoliticalSectionProps) {
  return (
    <div className="space-y-3">
      <p
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
        className="uppercase text-smoke-600"
      >
        POLITICO
      </p>
      <Meter
        label="POP"
        value={political.popularity}
        prevValue={prevSnapshot?.popularity}
        color="bg-blue-500"
        icon="★"
        flashDir={flashMap['popularity']}
      />
      <Meter
        label="EST"
        value={political.socialStability}
        prevValue={prevSnapshot?.socialStability}
        color="bg-emerald-500"
        icon="⚖"
        flashDir={flashMap['socialStability']}
      />
      <Meter label="MED" value={political.mediaCredibility} color="bg-purple-500" icon="📺" />
      <div
        className="flex justify-between"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        <span className="text-smoke-400">DECRETOS</span>
        <span className={political.emergencyDecreesUsed > 2 ? 'text-crimson-400' : 'text-smoke-200'}>
          {political.emergencyDecreesUsed}
        </span>
      </div>
    </div>
  );
}
