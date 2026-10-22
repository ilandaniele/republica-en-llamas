import type React from 'react';
import { useGameImage } from '../../hooks/useGameImage.js';

export interface SpriteBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Props {
  id: string;
  box: SpriteBox;
  fallback: React.ReactNode;
}

export function Sprite({ id, box, fallback }: Props) {
  const url = useGameImage(id);
  if (!url) return <>{fallback}</>;
  return (
    <image
      href={url}
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      preserveAspectRatio="xMidYMax meet"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
