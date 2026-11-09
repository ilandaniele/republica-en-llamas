import type { EventCard } from '@republica/game-engine';
import { useGameImage } from '../../../hooks/useGameImage.js';
import { CharacterPortrait } from './CharacterPortrait.js';
import { EVENT_CHARACTERS, getEventCharacter } from './eventCharacters.js';

export function EventCharacterBadge({
  card,
  panic = false,
}: {
  card: Pick<EventCard, 'id' | 'characterId'>;
  panic?: boolean;
}) {
  const characterId = getEventCharacter(card);
  const imageUrl = useGameImage(characterId ? `char_${characterId}_${panic ? 'panic' : 'normal'}` : '');
  if (!characterId || !imageUrl) return null;
  return (
    <div className="pointer-events-none absolute bottom-2 left-2 z-10 flex items-end gap-2">
      <div className="border-2 border-[#111] bg-[#1a1a2e]">
        <CharacterPortrait characterId={characterId} size={64} panic={panic} />
      </div>
      <span className="border border-[#111] bg-[#1a1a2e] px-2 py-1 font-mono text-xs text-white">
        {EVENT_CHARACTERS[characterId]?.label}
      </span>
    </div>
  );
}
