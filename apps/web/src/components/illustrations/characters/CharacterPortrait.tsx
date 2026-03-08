import React from 'react';
import { PixelCharacter } from '../PixelCharacter.js';
import { useGameImage } from '../../../hooks/useGameImage.js';

const CHARACTER_PIXEL_ID: Record<string, string> = {
  ministro:    'caputo',
  sindicalista:'moyano',
  periodista:  'periodista',
  embajador:   'embajador',
  gobernadora: 'kicillof',
};

// Maps characterId → manifest key for AI-generated portraits
const CHAR_IMAGE_KEY: Record<string, string> = {
  ministro:    'char_caputo',
  sindicalista:'char_moyano',
  gobernadora: 'char_kicillof',
  kirchner:    'char_kirchner',
  georgieva:   'char_georgieva',
};

interface Props {
  characterId: string;
  size?: number;
  panic?: boolean;
}

export function CharacterPortrait({ characterId, size = 80, panic = false }: Props) {
  const imageKey = CHAR_IMAGE_KEY[characterId] ?? `char_${characterId}`;
  const imageUrl = useGameImage(imageKey);

  // AI-generated portrait if available
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={characterId}
        width={size}
        height={size}
        style={{ display: 'block', objectFit: 'cover', borderRadius: 4 }}
        loading="lazy"
      />
    );
  }

  // Fallback: pixel character SVG
  const pixelId = CHARACTER_PIXEL_ID[characterId];
  if (!pixelId) return null;
  return <PixelCharacter id={pixelId} size={size} mood={panic ? 'panic' : 'normal'} />;
}
