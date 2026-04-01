import React from 'react';

interface Props {
  width?: number;
  height?: number;
  /** If true, applies a continuous translateX loop animation */
  moving?: boolean;
}

export function PixelColectivo({ width = 80, height = 40, moving = false }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: moving ? 'colectivo-move 30s linear infinite' : undefined,
      }}
    >
      {/* Bus body — red */}
      <rect x="4"  y="6"  width="72" height="26" fill="#CC1100" />
      {/* Yellow stripe */}
      <rect x="4"  y="18" width="72" height="4"  fill="#FFD600" />
      {/* Windshield */}
      <rect x="62" y="8"  width="10" height="10" fill="#88CCFF" />
      {/* Windows — pixel passengers inside */}
      <rect x="8"  y="8"  width="10" height="8"  fill="#88CCFF" />
      <rect x="22" y="8"  width="10" height="8"  fill="#88CCFF" />
      <rect x="36" y="8"  width="10" height="8"  fill="#88CCFF" />
      <rect x="50" y="8"  width="8"  height="8"  fill="#88CCFF" />
      {/* Pixel passengers (silhouettes) */}
      <rect x="10" y="9"  width="4"  height="4"  fill="#0D1B2A" />
      <rect x="24" y="9"  width="4"  height="4"  fill="#0D1B2A" />
      <rect x="38" y="9"  width="4"  height="4"  fill="#0D1B2A" />
      <rect x="52" y="9"  width="3"  height="4"  fill="#0D1B2A" />
      {/* Bus front details */}
      <rect x="68" y="22" width="8"  height="4"  fill="#FFEE00" />
      {/* Bumper */}
      <rect x="4"  y="30" width="72" height="4"  fill="#990000" />
      {/* "60" route number on side */}
      <text x="6" y="25" fontFamily="'Press Start 2P', monospace" fontSize="4" fill="#FFD600">60</text>
      {/* Wheels */}
      <rect
        x="12" y="32" width="12" height="8"  fill="#222"
        style={{ transformOrigin: '18px 36px', animation: 'colectivo-move 30s linear infinite' }}
      />
      <rect
        x="56" y="32" width="12" height="8"  fill="#222"
        style={{ transformOrigin: '62px 36px', animation: 'colectivo-move 30s linear infinite' }}
      />
      {/* Wheel centers */}
      <rect x="16" y="34" width="4" height="4" fill="#444" />
      <rect x="60" y="34" width="4" height="4" fill="#444" />
    </svg>
  );
}
