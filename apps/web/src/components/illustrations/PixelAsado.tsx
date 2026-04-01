import React from 'react';

interface Props {
  width?: number;
  height?: number;
}

export function PixelAsado({ width = 60, height = 40 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Grill legs */}
      <rect x="8"  y="30" width="4" height="10" fill="#444" />
      <rect x="48" y="30" width="4" height="10" fill="#444" />
      {/* Grill body */}
      <rect x="4"  y="24" width="52" height="8" fill="#333" />
      {/* Grill bars */}
      <rect x="4"  y="24" width="52" height="2" fill="#555" />
      <rect x="12" y="24" width="2"  height="8" fill="#555" />
      <rect x="22" y="24" width="2"  height="8" fill="#555" />
      <rect x="32" y="24" width="2"  height="8" fill="#555" />
      <rect x="42" y="24" width="2"  height="8" fill="#555" />
      {/* Fire — orange pixels underneath */}
      <rect x="8"  y="18" width="6"  height="6" fill="#FF6600" />
      <rect x="16" y="16" width="6"  height="8" fill="#FF8800" />
      <rect x="24" y="18" width="6"  height="6" fill="#FF4400" />
      <rect x="32" y="16" width="6"  height="8" fill="#FFAA00" />
      <rect x="40" y="18" width="6"  height="6" fill="#FF6600" />
      {/* Fire tips yellow */}
      <rect x="10" y="16" width="2"  height="2" fill="#FFCC00" />
      <rect x="18" y="14" width="2"  height="2" fill="#FFDD00" />
      <rect x="26" y="16" width="2"  height="2" fill="#FFCC00" />
      <rect x="34" y="14" width="2"  height="2" fill="#FFDD00" />
      <rect x="42" y="16" width="2"  height="2" fill="#FFCC00" />
      {/* Smoke particles */}
      <rect
        x="14" y="8" width="2" height="2" fill="#888" opacity="0.5"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '0s' }}
      />
      <rect
        x="28" y="6" width="2" height="2" fill="#888" opacity="0.5"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '0.5s' }}
      />
      <rect
        x="44" y="8" width="2" height="2" fill="#888" opacity="0.4"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '1s' }}
      />
    </svg>
  );
}
