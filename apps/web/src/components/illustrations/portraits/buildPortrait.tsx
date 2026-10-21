import type React from 'react';
import { PixelGrid, type Layer, type Palette } from './pixelGrid.js';
import { BACKGROUND, BODY, BROWS, HEAD, NOSE, SHARED_PALETTE, moodLayers } from './faceLayers.js';
import type { PortraitMood } from './types.js';

export interface PortraitSpec {
  palette: Palette;
  hair: Layer[];
  face?: Layer[];
  front?: Layer[];
}

export function buildPortrait({ palette, hair, face = [], front = [] }: PortraitSpec) {
  const colors = { ...SHARED_PALETTE, ...palette };
  return function Portrait({ mood }: { mood: PortraitMood }): React.ReactElement {
    const browLayers = mood === 'panic' ? [] : [BROWS];
    const layers = [
      BACKGROUND,
      BODY,
      HEAD,
      ...face,
      NOSE,
      ...browLayers,
      ...moodLayers(mood),
      ...hair,
      ...front,
    ];
    return <PixelGrid layers={layers} palette={colors} />;
  };
}
