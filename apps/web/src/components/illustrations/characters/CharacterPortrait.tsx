import React from 'react';
import { PixelCharacter } from '../PixelCharacter.js';

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
  if (!pixelId) return null;
  return <PixelCharacter id={pixelId} size={size} mood={panic ? 'panic' : 'normal'} />;
}
