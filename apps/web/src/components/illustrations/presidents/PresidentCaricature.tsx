import React from 'react';
import { PixelCharacter } from '../PixelCharacter.js';

export type CaricatureState = 'good' | 'regular' | 'bad' | 'crisis';

const PRESIDENT_PIXEL_ID: Record<string, string> = {
  ingeniero: 'milei',
  populista: 'massa',
  tecnocrata: 'bullrich',
};

interface Props {
  presidentId: string;
  popularity: number;
  hasCrisis?: boolean;
  width?: number;
  height?: number;
}

function getMood(popularity: number, hasCrisis: boolean): 'normal' | 'panic' | 'victory' {
  if (hasCrisis || popularity < 30) return 'panic';
  if (popularity > 60) return 'victory';
  return 'normal';
}

export function PresidentCaricature({ presidentId, popularity, hasCrisis = false, width = 280 }: Props) {
  const pixelId = PRESIDENT_PIXEL_ID[presidentId] ?? 'milei';
  const mood = getMood(popularity, hasCrisis);
  return <PixelCharacter id={pixelId} size={width} mood={mood} />;
}
