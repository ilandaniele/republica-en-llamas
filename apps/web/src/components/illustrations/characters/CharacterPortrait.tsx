import React from 'react';
import { PixelCharacter } from '../PixelCharacter.js';
import { useGameImage } from '../../../hooks/useGameImage.js';
import '../event-scenes/raster-effects.css';
import { EVENT_CHARACTERS } from './eventCharacters.js';

const CHARACTER_PIXEL_ID: Record<string, string> = {
  ministro: 'caputo',
  sindicalista: 'moyano',
  periodista: 'periodista',
  embajador: 'embajador',
  gobernadora: 'kicillof',
};

interface Props {
  characterId: string;
  size?: number;
  panic?: boolean;
}

export function CharacterPortrait({ characterId, size = 80, panic = false }: Props) {
  const pixelId = CHARACTER_PIXEL_ID[characterId];
  const imageUrl = useGameImage(`char_${characterId}_${panic ? 'panic' : 'normal'}`);
  if (imageUrl) {
    return (
      <div className="pixel-portrait-frame" style={{ width: size, height: size }}>
        <img
          className={`pixel-portrait-image ${panic ? 'pixel-portrait-image--panic' : ''}`}
          src={imageUrl}
          width={size}
          height={size}
          alt={EVENT_CHARACTERS[characterId]?.label ?? characterId}
          style={{ imageRendering: 'pixelated', display: 'block' }}
        />
      </div>
    );
  }
  if (!pixelId) return null;
  return <PixelCharacter id={pixelId} size={size} mood={panic ? 'panic' : 'normal'} />;
}
