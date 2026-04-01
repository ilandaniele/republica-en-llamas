import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { w: 24, h: 32, vw: 40, vh: 60, scale: 0.6 },
  md: { w: 40, h: 60, vw: 40, vh: 60, scale: 1 },
  lg: { w: 60, h: 80, vw: 40, vh: 60, scale: 1 },
};

export function PixelFuego({ size = 'md' }: Props) {
  const { w, h } = SIZE_MAP[size];

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block', overflow: 'visible' }}
    >
      {/* Layer 0 — red base (shifted by pixel-fire animation) */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0s' }}>
        <rect x="8"  y="44" width="24" height="16" fill="#CC2200" />
        <rect x="4"  y="48" width="32" height="12" fill="#CC2200" />
        <rect x="6"  y="42" width="28" height="8"  fill="#AA1800" />
      </g>
      {/* Layer 1 — orange middle */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.1s' }}>
        <rect x="10" y="30" width="20" height="16" fill="#FF6600" />
        <rect x="6"  y="36" width="28" height="10" fill="#FF5500" />
        <rect x="12" y="28" width="16" height="8"  fill="#FF4400" />
      </g>
      {/* Layer 2 — yellow top */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.2s' }}>
        <rect x="14" y="16" width="12" height="16" fill="#FFAA00" />
        <rect x="10" y="22" width="20" height="10" fill="#FFCC00" />
        <rect x="16" y="12" width="8"  height="8"  fill="#FFDD00" />
        <rect x="18" y="8"  width="4"  height="6"  fill="#FFEE00" />
      </g>
    </svg>
  );
}
