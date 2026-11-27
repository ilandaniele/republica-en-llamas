import { cabinetAdvice } from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';
import { useGameStore } from '../../../stores/gameStore.js';

export function CabinetAdvice({ card }: { card: EventCard }) {
  const characters = useGameStore((s) => s.gameState?.characters);
  const advice = characters ? cabinetAdvice(card, characters) : [];
  if (advice.length === 0) return null;

  return (
    <p className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#444]">
      <span className="font-bold">Tu gabinete opina:</span>
      {advice.map((entry) => (
        <span key={entry.characterId}>
          {entry.avatar} {entry.name} → {String.fromCharCode(65 + entry.choiceIndex)}
        </span>
      ))}
    </p>
  );
}
