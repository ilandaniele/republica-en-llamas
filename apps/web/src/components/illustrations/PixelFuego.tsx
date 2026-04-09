import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { w: 32,  h: 48  },
  md: { w: 48,  h: 72  },
  lg: { w: 64,  h: 96  },
};

export function PixelFuego({ size = 'md' }: Props) {
  const { w, h } = SIZE_MAP[size];

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 48 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block', overflow: 'visible' }}
    >
      {/* Ember particles — float outward from base */}
      <rect x="4"  y="42" width="4" height="4" fill="#FFAA00" opacity="0.9"
        style={{ animation: 'pixel-rise 1.0s ease-out infinite', animationDelay: '0s' }} />
      <rect x="40" y="44" width="4" height="4" fill="#FF7700" opacity="0.8"
        style={{ animation: 'pixel-rise 1.0s ease-out infinite', animationDelay: '0.25s' }} />
      <rect x="2"  y="36" width="3" height="3" fill="#FFCC00" opacity="0.7"
        style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.5s' }} />
      <rect x="44" y="38" width="3" height="3" fill="#FFEE00" opacity="0.6"
        style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.75s' }} />
      <rect x="6"  y="28" width="2" height="2" fill="#FF8800" opacity="0.5"
        style={{ animation: 'pixel-rise 1.4s ease-out infinite', animationDelay: '0.1s' }} />
      <rect x="40" y="30" width="2" height="2" fill="#FF6600" opacity="0.4"
        style={{ animation: 'pixel-rise 1.4s ease-out infinite', animationDelay: '0.6s' }} />

      {/* Layer 0 — dark red base */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0s' }}>
        <rect x="6"  y="54" width="36" height="18" fill="#AA1800" />
        <rect x="2"  y="58" width="44" height="14" fill="#CC2200" />
        <rect x="4"  y="50" width="40" height="10" fill="#BB2000" />
      </g>

      {/* Layer 1 — orange mid-flame */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.12s' }}>
        <rect x="8"  y="38" width="32" height="18" fill="#FF5500" />
        <rect x="4"  y="44" width="40" height="12" fill="#FF6600" />
        <rect x="10" y="34" width="28" height="10" fill="#FF4400" />
      </g>

      {/* Layer 2 — bright orange */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.24s' }}>
        <rect x="12" y="24" width="24" height="18" fill="#FF8800" />
        <rect x="8"  y="30" width="32" height="12" fill="#FFAA00" />
        <rect x="14" y="20" width="20" height="8" fill="#FF9900" />
      </g>

      {/* Layer 3 — yellow upper flame */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.36s' }}>
        <rect x="16" y="12" width="16" height="16" fill="#FFCC00" />
        <rect x="12" y="18" width="24" height="10" fill="#FFDD00" />
        <rect x="18" y="8"  width="12" height="8"  fill="#FFEE00" />
        <rect x="20" y="4"  width="8"  height="6"  fill="#FFFF88" />
      </g>

      {/* Flame tip */}
      <g style={{ animation: 'pixel-fire 0.5s ease-in-out infinite', animationDelay: '0.48s' }}>
        <rect x="21" y="2"  width="6"  height="4"  fill="#FFFFFF" opacity="0.7" />
        <rect x="22" y="0"  width="4"  height="2"  fill="#FFFFFF" opacity="0.5" />
      </g>
    </svg>
  );
}
